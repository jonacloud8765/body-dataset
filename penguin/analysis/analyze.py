#!/usr/bin/env python3
"""Measure the song so every shot can be placed on the real music.

Usage:
  python3 analyze.py SONG [--vocals VOCALS] [--lyrics lyrics.txt] [--out DIR]

Writes:
  DIR/raw.json        tempo, beat grid, bars, per-bar features, novelty boundaries,
                      vocal phrases, word and line alignment
  DIR/overview.png    whole song: waveform, spectrogram, intensity, novelty, vocals
  DIR/detail-*.png    30 s windows of the same, with bar numbers and lyric lines

Everything here is measured, not assumed. The curated section map that the storyboard
and the Remotion timeline use is written by hand from this output (see README.md).
"""
import argparse
import json
import re
import subprocess
from pathlib import Path

import librosa
import numpy as np
import scipy.ndimage as ndi
import scipy.signal as sps

SR = 22050
HOP = 256  # 11.6 ms per frame


# ---------------------------------------------------------------- file facts

def probe(path):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries",
         "format=duration,bit_rate:stream=codec_name,sample_rate,channels",
         "-of", "json", str(path)], capture_output=True, text=True, check=True)
    j = json.loads(r.stdout)
    s = j["streams"][0]
    return {"file": Path(path).name, "duration": float(j["format"]["duration"]),
            "codec": s.get("codec_name"), "sample_rate": int(s.get("sample_rate", 0)),
            "channels": s.get("channels"), "bit_rate": int(j["format"].get("bit_rate") or 0)}


def loudness(path):
    r = subprocess.run(
        ["ffmpeg", "-nostats", "-hide_banner", "-i", str(path),
         "-filter_complex", "ebur128=peak=true", "-f", "null", "-"],
        capture_output=True, text=True)
    txt = r.stderr[r.stderr.rfind("Summary:"):]

    def grab(label):
        m = re.search(r"\b" + label + r":\s+(-?[\d.]+)", txt)
        return float(m.group(1)) if m else None
    return {"integrated_lufs": grab("I"), "lra_lu": grab("LRA"), "true_peak_dbfs": grab("Peak")}


# ---------------------------------------------------------------- tempo and grid

def track_beats(path, y):
    import essentia.standard as es
    audio = es.MonoLoader(filename=str(path), sampleRate=44100)()
    bpm, ticks, conf, _, _ = es.RhythmExtractor2013(method="multifeature")(audio)
    oenv = librosa.onset.onset_strength(y=y, sr=SR, hop_length=HOP)
    lt, lb = librosa.beat.beat_track(onset_envelope=oenv, sr=SR, hop_length=HOP, units="time")
    return {"essentia_bpm": float(bpm), "essentia_confidence": float(conf),
            "essentia_beats": np.asarray(ticks, float),
            "librosa_bpm": float(np.atleast_1d(lt)[0]), "librosa_beats": np.asarray(lb, float)}


def fit_grid(beats):
    """Fit t = t0 + n * period. Indices come from rounding each inter-beat interval, so a
    missed or doubled beat shifts n by one instead of skewing the fit; off-grid beats (for
    example a drumless intro the tracker drifted through) are rejected as outliers."""
    b = np.asarray(beats, float)
    ibi = np.diff(b)
    med = np.median(ibi)
    per = ibi[np.abs(ibi - med) < 0.25 * med].mean()
    n = np.concatenate([[0], np.cumsum(np.maximum(1, np.round(ibi / per)))])
    keep = np.ones(len(b), bool)
    for _ in range(6):
        A = np.vstack([np.ones(keep.sum()), n[keep]]).T
        (t0, per), *_ = np.linalg.lstsq(A, b[keep], rcond=None)
        res = b - (t0 + n * per)
        c = np.median(res[keep])
        mad = np.median(np.abs(res[keep] - c))
        keep = np.abs(res - c) < max(0.035, 4 * 1.4826 * mad)
    t0 -= np.floor(t0 / per) * per
    return float(t0), float(per), res, keep


def refine_phase(oenv, t0, per, dur):
    """Slide the grid (+-60 ms) to where it lands on the strongest onsets."""
    best, best_o = -1.0, 0.0
    for o in np.arange(-0.06, 0.0601, 0.002):
        g = np.arange(t0 + o, dur, per)
        fr = librosa.time_to_frames(g[g >= 0], sr=SR, hop_length=HOP)
        fr = fr[fr < len(oenv)]
        sc = oenv[fr].mean()
        if sc > best:
            best, best_o = sc, o
    t = t0 + best_o
    return float(t - np.floor(t / per) * per), float(best_o)


def local_tempo(beats, win=8):
    b = np.asarray(beats)
    out = []
    for i in range(len(b)):
        lo, hi = max(0, i - win // 2), min(len(b) - 1, i + win // 2)
        ibi = np.diff(b[lo:hi + 1])
        out.append(60.0 / np.median(ibi) if len(ibi) else np.nan)
    return np.array(out)


def beat_features(y, beats):
    """Kick-band flux and harmonic change at each beat, used to find beat 1 of the bar."""
    S = np.abs(librosa.stft(y, n_fft=2048, hop_length=HOP))
    f = librosa.fft_frequencies(sr=SR, n_fft=2048)
    low = S[(f >= 30) & (f <= 150)].sum(0)
    low_flux = np.maximum(0, np.diff(low, prepend=low[:1]))
    mid = S[(f >= 150) & (f <= 4000)].sum(0)
    mid_flux = np.maximum(0, np.diff(mid, prepend=mid[:1]))
    chroma = librosa.feature.chroma_stft(S=S ** 2, sr=SR, hop_length=HOP)
    fr = librosa.time_to_frames(beats, sr=SR, hop_length=HOP)
    fr = np.clip(fr, 0, S.shape[1] - 1)
    kick = np.array([low_flux[max(0, i - 3):i + 4].max() for i in fr])
    snare = np.array([mid_flux[max(0, i - 3):i + 4].max() for i in fr])
    cs = librosa.util.sync(chroma, fr, aggregate=np.median)  # column k+1 = beat k to k+1
    hchange = np.linalg.norm(np.diff(cs, axis=1), axis=0)[:len(fr)]
    return kick, snare, hchange, S, f


def z(x):
    x = np.asarray(x, float)
    s = x.std()
    return (x - x.mean()) / s if s > 0 else x * 0


def downbeat_phase(kick, snare, hchange, meter=4, win=16):
    score = z(kick) - 0.5 * z(snare) + z(hchange)
    whole = [score[p::meter].mean() for p in range(meter)]
    best = int(np.argmax(whole))
    srt = sorted(whole)
    windows = []
    for s in range(0, len(score) - win + 1, meter):
        w = score[s:s + win]
        ph = [w[(p - s) % meter::meter].mean() for p in range(meter)]
        windows.append({"beat": s, "phase": int(np.argmax(ph))})
    return best, float(srt[-1] - srt[-2]), [float(v) for v in whole], windows


# ---------------------------------------------------------------- features and structure

def bar_features(y, S, f, bar_times, end):
    rms = librosa.feature.rms(S=S, frame_length=2048, hop_length=HOP)[0]
    cent = librosa.feature.spectral_centroid(S=S, sr=SR)[0]
    H, P = librosa.decompose.hpss(S)
    perc = (P ** 2).sum(0) / ((H ** 2).sum(0) + (P ** 2).sum(0) + 1e-9)
    onsets = librosa.onset.onset_detect(y=y, sr=SR, hop_length=HOP, units="time")
    edges = list(bar_times) + [end]
    rows = []
    for i in range(len(bar_times)):
        a, b = librosa.time_to_frames([edges[i], edges[i + 1]], sr=SR, hop_length=HOP)
        b = max(b, a + 1)
        rows.append({
            "rms_db": float(20 * np.log10(rms[a:b].mean() + 1e-9)),
            "centroid_hz": float(cent[a:b].mean()),
            "percussive": float(perc[a:b].mean()),
            "onsets": int(((onsets >= edges[i]) & (onsets < edges[i + 1])).sum()),
        })
    r = np.array([x["rms_db"] for x in rows])
    c = np.array([x["centroid_hz"] for x in rows])
    p = np.array([x["percussive"] for x in rows])
    o = np.array([x["onsets"] for x in rows], float)

    def unit(v):
        lo, hi = np.percentile(v, 5), np.percentile(v, 95)
        return np.clip((v - lo) / (hi - lo + 1e-9), 0, 1)
    intensity = 0.5 * unit(r) + 0.2 * unit(p) + 0.15 * unit(c) + 0.15 * unit(o)
    for x, v in zip(rows, intensity):
        x["intensity"] = round(float(v), 3)
    return rows, rms, cent


def novelty(y, beats, kernels=(8, 16, 32)):
    fr = librosa.time_to_frames(beats, sr=SR, hop_length=HOP)
    mfcc = librosa.feature.mfcc(y=y, sr=SR, n_mfcc=13, hop_length=HOP)
    chroma = librosa.feature.chroma_cqt(y=y, sr=SR, hop_length=HOP)
    X = np.vstack([librosa.util.sync(mfcc, fr, aggregate=np.mean),
                   librosa.util.sync(chroma, fr, aggregate=np.median)])[:, 1:len(fr) + 1]
    X = (X - X.mean(1, keepdims=True)) / (X.std(1, keepdims=True) + 1e-9)
    Xn = X / (np.linalg.norm(X, axis=0, keepdims=True) + 1e-9)
    S = Xn.T @ Xn
    n = S.shape[0]
    total = np.zeros(n)
    for w in kernels:
        k = np.arange(-w, w) + 0.5
        g = np.exp(-(k / w) ** 2 * 2)
        K = np.outer(g, g) * np.sign(np.outer(k, k))
        Sp = np.pad(S, w, mode="reflect")
        nov = np.array([(K * Sp[i:i + 2 * w, i:i + 2 * w]).sum() for i in range(n)])
        nov = np.maximum(nov, 0)
        total += nov / (nov.max() + 1e-9)
    total /= len(kernels)
    peaks, props = sps.find_peaks(total, distance=12, prominence=0.08)
    return total, S, [(int(p), float(total[p])) for p in peaks]


# ---------------------------------------------------------------- vocals

def vocal_activity(yv, hop=128, hi=26, lo=38, merge=0.25, min_len=0.12, phrase_gap=0.45):
    rms = librosa.feature.rms(y=yv, frame_length=1024, hop_length=hop)[0]
    db = 20 * np.log10(rms + 1e-9)
    ref = np.percentile(db, 99)
    t = librosa.frames_to_time(np.arange(len(db)), sr=SR, hop_length=hop)
    lab, n = ndi.label(db > ref - lo)
    segs = []
    for i in range(1, n + 1):
        idx = np.flatnonzero(lab == i)
        if (db[idx] > ref - hi).any():
            segs.append([float(t[idx[0]]), float(t[idx[-1]])])
    merged = []
    for s in segs:
        if merged and s[0] - merged[-1][1] < merge:
            merged[-1][1] = s[1]
        else:
            merged.append(s)
    merged = [s for s in merged if s[1] - s[0] >= min_len]
    phrases = []
    for s in merged:
        if phrases and s[0] - phrases[-1]["end"] < phrase_gap:
            phrases[-1]["end"] = s[1]
            phrases[-1]["parts"] += 1
        else:
            phrases.append({"start": s[0], "end": s[1], "parts": 1})
    onsets = librosa.onset.onset_detect(y=yv, sr=SR, hop_length=HOP, units="time", backtrack=True)
    return merged, phrases, onsets, (t, db - ref)


# ---------------------------------------------------------------- lyrics

SYL = {"kilometers": 4, "documentary": 5, "every": 2, "everything": 3, "creator": 3,
       "seventy": 3, "interrupt": 3, "nothings": 2, "nothing's": 2, "tryna": 2, "we're": 1,
       "i'm": 1, "i'll": 1, "don't": 1, "that's": 1, "there's": 1, "can't": 1, "wow": 1,
       "yeah": 1, "going": 2, "journey": 2, "figure": 2, "explain": 2, "alone": 2, "around": 2}


def syllables(word):
    w = word.lower()
    if w in SYL:
        return SYL[w]
    n = len(re.findall(r"[aeiouy]+", w))
    if w.endswith("e") and n > 1 and not w.endswith(("le", "ee")):
        n -= 1
    return max(1, n)


def read_lyrics(path):
    sections, cur = [], None
    for raw in Path(path).read_text().splitlines():
        line = raw.strip()
        if not line:
            continue
        m = re.match(r"^\[(.+)\]$", line)
        if m:
            cur = {"name": m.group(1), "lines": []}
            sections.append(cur)
        else:
            cur["lines"].append(line)
    return sections


def words_of(line):
    return re.findall(r"[A-Za-z']+", line.lower())


def align_lines(segs, onsets, sections, w_dur=1.0, w_gap=2.0, w_bound=0.9, w_onset=1.2,
                w_skip=2.0):
    """Place every lyric line on the vocal stem, in order.

    Candidate line starts are vocal segment starts (after a silence) and vocal onsets
    inside continuous singing. Dynamic programming picks one start per line so that each
    line's sung time matches its syllable count, lines start after pauses where possible,
    and no line straddles a long silence (an instrumental break). Vocals before the first
    line or after the last one (ad-libs) can be skipped at a cost.
    """
    lines = [(s["name"], li, t) for s in sections for li, t in enumerate(s["lines"])]
    syl = np.array([sum(syllables(w) for w in words_of(t)) for _, _, t in lines], float)
    segs = np.asarray(segs, float)
    seg_s, seg_e = segs[:, 0], segs[:, 1]
    cum = np.concatenate([[0], np.cumsum(seg_e - seg_s)])

    def active(t):  # sung seconds before t
        t = np.asarray(t, float)
        i = np.searchsorted(seg_s, t, side="right")
        part = np.where(i > 0, np.clip(t - seg_s[np.maximum(i - 1, 0)], 0,
                                       (seg_e - seg_s)[np.maximum(i - 1, 0)]), 0)
        return cum[np.maximum(i - 1, 0)] * (i > 0) + part

    gaps = np.concatenate([[10.0], seg_s[1:] - seg_e[:-1]])  # silence before each segment
    cand_t = list(seg_s)
    cand_g = list(np.minimum(gaps, 4.0))
    for o in onsets:  # onsets inside singing, not near a segment start
        i = np.searchsorted(seg_s, o, side="right") - 1
        if i >= 0 and seg_s[i] + 0.12 < o < seg_e[i] - 0.12:
            cand_t.append(o)
            cand_g.append(0.0)
    order = np.argsort(cand_t)
    ct = np.array(cand_t)[order]
    cg = np.array(cand_g)[order]
    C = len(ct)
    end_t = seg_e[-1] + 0.01
    act_c = active(ct)
    act_end = float(active(end_t))
    rate = act_end / syl.sum()

    # the longest silence strictly inside (a, b): precompute per candidate pair lazily
    big_gap_idx = np.flatnonzero(gaps[1:] > 0.25) + 1  # segment indices preceded by a pause

    def max_gap_inside(a, bvec):
        out = np.zeros(len(bvec))
        inside = big_gap_idx[seg_s[big_gap_idx] > a + 1e-6]
        if len(inside) == 0:
            return out
        gs = gaps[inside]
        st = seg_s[inside]
        for k, bb in enumerate(bvec):
            m = st < bb - 1e-6
            if m.any():
                out[k] = gs[m].max()
        return out

    def bound_cost(g):
        return np.where(g > 0, -w_bound * np.log1p(np.minimum(g, 3.0) / 0.1), w_onset)

    n = len(lines)
    INF = 1e18
    dp = np.full((n + 1, C + 1), INF)  # dp[i, j]: lines < i placed, line i starts at cand j
    bp = np.zeros((n + 1, C + 1), int)
    dp[0, :C] = w_skip * act_c / rate / 4 + bound_cost(cg)
    ends = np.concatenate([ct, [end_t]])
    act_all = np.concatenate([act_c, [act_end]])
    for i in range(n):
        exp = syl[i] * rate
        for j in np.flatnonzero(dp[i, :C] < INF):
            ks = np.arange(j + 1, C + 1)
            sung = act_all[ks] - act_c[j]
            ok = (sung > 0.3 * exp) & (sung < 3.5 * exp)
            if not ok.any():
                continue
            ks, sung = ks[ok], sung[ok]
            cost = w_dur * np.log(sung / exp) ** 2
            cost += w_gap * np.maximum(0, max_gap_inside(ct[j], ends[ks]) - 0.9)
            nb = np.where(ks < C, bound_cost(cg[np.minimum(ks, C - 1)]), 0.0)
            if i == n - 1:  # the last line may leave trailing ad-libs unaligned
                nb = nb + w_skip * (act_end - act_all[ks]) / rate / 4
            tot = dp[i, j] + cost + nb
            better = tot < dp[i + 1, ks]
            dp[i + 1, ks[better]] = tot[better]
            bp[i + 1, ks[better]] = j
    k = int(np.argmin(dp[n]))
    if dp[n, k] >= INF:
        return None
    starts = []
    for i in range(n, 0, -1):
        j = bp[i, k]
        starts.append((j, k))
        k = j
    starts.reverse()
    out = []
    for (sec, li, text), (j, k), sy in zip(lines, starts, syl):
        a, b = ct[j], ends[k]
        inside = segs[(seg_e > a) & (seg_s < b)]
        start = max(a, inside[0, 0]) if len(inside) else a
        stop = min(b, inside[-1, 1]) if len(inside) else b
        # approximate word times: share the line's sung time by syllables
        ws = words_of(text)
        wsyl = np.array([syllables(w) for w in ws], float)
        edges = start + (stop - start) * np.concatenate([[0], np.cumsum(wsyl)]) / wsyl.sum()
        out.append({"section": sec, "line": li, "text": text, "start": round(float(start), 3),
                    "end": round(float(stop), 3), "syllables": int(sy),
                    "boundary": "pause" if cg[j] > 0 else "onset",
                    "words": [{"w": w, "t": round(float(e), 3)} for w, e in zip(ws, edges[:-1])]})
    return out


# ---------------------------------------------------------------- plots

def plot(out_dir, y, dur, bars, bar_rows, beats, nov, nov_peaks, vocal, lines, title):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    mel = librosa.power_to_db(librosa.feature.melspectrogram(y=y, sr=SR, hop_length=1024, n_mels=96),
                              ref=np.max)
    bar_t = np.array(bars)
    inten = np.array([r["intensity"] for r in bar_rows])

    def draw(t0, t1, path, detail):
        fig, ax = plt.subplots(5, 1, figsize=(22 if not detail else 20, 13), sharex=True,
                               gridspec_kw={"height_ratios": [1, 1.4, 1, 0.8, 1.2]})
        fig.suptitle(title + (f"  [{t0:.0f}-{t1:.0f} s]" if detail else ""), fontsize=13)
        tt = np.arange(len(y)) / SR
        step = max(1, int(len(y) / 40000))
        ax[0].plot(tt[::step], y[::step], lw=0.4, color="#335")
        ax[0].set_ylabel("wave")
        ax[1].imshow(mel, aspect="auto", origin="lower", extent=[0, len(y) / SR, 0, 96], cmap="magma")
        ax[1].set_ylabel("mel")
        ax[2].step(bar_t, inten, where="post", color="#c33", lw=1.5, label="intensity")
        rr = np.array([r["rms_db"] for r in bar_rows])
        ax[2].step(bar_t, (rr - rr.min()) / (np.ptp(rr) + 1e-9), where="post", color="#36c", lw=1,
                   alpha=0.7, label="rms")
        pp = np.array([r["percussive"] for r in bar_rows])
        ax[2].step(bar_t, (pp - pp.min()) / (np.ptp(pp) + 1e-9), where="post", color="#393", lw=1,
                   alpha=0.7, label="percussive")
        ax[2].legend(loc="upper left", fontsize=8)
        ax[2].set_ylim(-0.05, 1.1)
        ax[2].set_ylabel("per bar")
        bt = np.array(beats)[:len(nov)]
        ax[3].plot(bt, nov, color="#555", lw=1)
        for p, s in nov_peaks:
            ax[3].axvline(beats[p], color="#e80", lw=1.5)
        ax[3].set_ylabel("novelty")
        if vocal is not None:
            vt, vdb = vocal["curve"]
            ax[4].plot(vt, vdb, color="#777", lw=0.5)
            for p in vocal["phrases"]:
                ax[4].axvspan(p["start"], p["end"], color="#6ad", alpha=0.25)
            ft, f0 = vocal["f0"]
            midi = librosa.hz_to_midi(f0)
            ax4b = ax[4].twinx()
            ax4b.plot(ft, midi, ".", ms=1.5, color="#a0a")
            ax4b.set_ylabel("melody (MIDI)", color="#a0a")
            if np.isfinite(midi).any():
                lo, hi = np.nanpercentile(midi, 1), np.nanpercentile(midi, 99)
                ax4b.set_ylim(lo - 14, hi + 2)
        for i, ln in enumerate(lines or []):
            if ln["end"] < t0 or ln["start"] > t1:
                continue
            ax[4].plot([ln["start"], ln["end"]], [-4 - (i % 3) * 7] * 2, color="#c33", lw=3)
            ax[4].text(ln["start"], -2 - (i % 3) * 7, ln["text"], fontsize=7 if not detail else 8,
                       clip_on=True)
        ax[4].set_ylim(-60, 2)
        ax[4].set_ylabel("vocal dB")
        for a in ax:
            for i, b in enumerate(bar_t):
                if t0 <= b <= t1:
                    a.axvline(b, color="#000", lw=0.8 if i % 4 == 0 else 0.25, alpha=0.35)
        if detail:
            for b in beats:
                if t0 <= b <= t1:
                    ax[0].axvline(b, color="#0a0", lw=0.5, alpha=0.5)
        for i, b in enumerate(bar_t):
            if t0 <= b <= t1 and (detail or i % 4 == 0):
                ax[0].text(b, ax[0].get_ylim()[1], str(i + 1), fontsize=7, va="bottom")
        ax[4].set_xlim(t0, t1)
        ax[4].set_xlabel("seconds")
        fig.tight_layout()
        fig.savefig(path, dpi=80 if not detail else 90)
        plt.close(fig)

    draw(0, dur, out_dir / "overview.png", False)
    for t0 in np.arange(0, dur, 30):
        draw(t0, min(dur, t0 + 32), out_dir / f"detail-{int(t0):03d}.png", True)


# ---------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("song")
    ap.add_argument("--vocals")
    ap.add_argument("--lyrics", default=str(Path(__file__).with_name("lyrics.txt")))
    ap.add_argument("--out", default=str(Path(__file__).parent / "out"))
    ap.add_argument("--meter", type=int, default=4)
    ap.add_argument("--beats", choices=["auto", "essentia", "librosa"], default="auto")
    args = ap.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    info = probe(args.song)
    info["loudness"] = loudness(args.song)
    y = librosa.load(args.song, sr=SR, mono=True)[0]
    dur = len(y) / SR
    print(f"duration {dur:.2f} s, {info['codec']} {info['sample_rate']} Hz x{info['channels']}, "
          f"{info['loudness']['integrated_lufs']} LUFS")

    tr = track_beats(args.song, y)
    pick = args.beats
    if pick == "auto":
        pick = "essentia" if tr["essentia_confidence"] >= 2.5 else "librosa"
    beats = tr[f"{pick}_beats"]
    t0, per, res, keep = fit_grid(beats)
    oenv = librosa.onset.onset_strength(y=y, sr=SR, hop_length=HOP)
    t0, shift = refine_phase(oenv, t0, per, dur)
    res = res[keep]
    lt = local_tempo(beats)
    print(f"tempo essentia {tr['essentia_bpm']:.2f} (conf {tr['essentia_confidence']:.2f}), "
          f"librosa {tr['librosa_bpm']:.2f}; grid {60 / per:.3f} BPM from {pick} "
          f"({keep.mean() * 100:.0f}% of beats on grid, shifted {shift * 1000:+.0f} ms), "
          f"residual median {np.median(np.abs(res)) * 1000:.1f} ms, p95 "
          f"{np.percentile(np.abs(res), 95) * 1000:.1f} ms")
    constant = bool(np.percentile(np.abs(res), 95) < 0.025)
    if constant:
        grid = np.arange(t0, dur, per)
    else:
        grid = beats
    kick, snare, hch, S, f = beat_features(y, grid)
    phase, margin, phase_scores, windows = downbeat_phase(kick, snare, hch, args.meter)
    first_bar = grid[phase]
    if constant:
        first_bar -= np.floor(first_bar / (per * args.meter)) * per * args.meter
        bars = np.arange(first_bar, dur, per * args.meter)
    else:
        bars = grid[phase::args.meter]
    print(f"downbeat phase {phase} (margin {margin:.2f}), first bar line {bars[0]:.3f} s, "
          f"{len(bars)} bars")
    bar_rows, _, _ = bar_features(y, S, f, bars, dur)
    nov, _, nov_peaks = novelty(y, grid)
    bpb = args.meter
    boundaries = [{"t": round(float(grid[p]), 3), "beat": p,
                   "bar": round(float((grid[p] - bars[0]) / (per * bpb)) + 1, 2), "strength": round(s, 3)}
                  for p, s in nov_peaks]

    vocal = None
    lines, align_note = None, "no vocals given"
    sections = read_lyrics(args.lyrics)
    if args.vocals:
        yv = librosa.load(args.vocals, sr=SR, mono=True)[0]
        segs, phrases, v_onsets, curve = vocal_activity(yv)
        f0, voiced, _ = librosa.pyin(yv, fmin=70, fmax=1000, sr=SR, hop_length=HOP * 2)
        vocal = {"segments": segs, "phrases": phrases, "curve": curve,
                 "f0": (librosa.times_like(f0, sr=SR, hop_length=HOP * 2), f0)}
        print(f"vocals: {len(segs)} segments, {len(phrases)} phrases, {len(v_onsets)} onsets")
        lines = align_lines(segs, v_onsets, sections)
        align_note = "syllable/pause DP on the vocal stem" if lines else "alignment failed"
        vocal["onsets"] = v_onsets
        print(f"alignment: {align_note}")

    def bar_pos(t):
        x = (t - bars[0]) / (per * bpb)
        b = int(np.floor(x))
        return b + 1, round((x - b) * bpb + 1, 2)

    for ln in lines or []:
        ln["bar"], ln["beat"] = bar_pos(ln["start"])

    result = {
        "source": info,
        "tempo": {"essentia_bpm": round(tr["essentia_bpm"], 3),
                  "essentia_confidence": round(tr["essentia_confidence"], 3),
                  "librosa_bpm": round(tr["librosa_bpm"], 3), "tracker_used": pick,
                  "local_bpm_range": [round(float(np.nanpercentile(lt, 5)), 2),
                                      round(float(np.nanpercentile(lt, 95)), 2)]},
        "grid": {"constant_tempo": constant, "bpm": round(60 / per, 4), "beat_period": round(per, 6),
                 "t0": round(t0, 4), "meter": bpb, "downbeat_phase": phase,
                 "phase_margin": round(margin, 3), "phase_scores": phase_scores,
                 "phase_windows": windows, "first_bar": round(float(bars[0]), 4),
                 "on_grid_fraction": round(float(keep.mean()), 3), "onset_shift_ms": round(shift * 1000, 1),
                 "residual_ms": {"median": round(float(np.median(np.abs(res))) * 1000, 2),
                                 "p95": round(float(np.percentile(np.abs(res), 95)) * 1000, 2),
                                 "max": round(float(np.abs(res).max()) * 1000, 2)}},
        "beats": [round(float(b), 4) for b in grid],
        "tracked_beats": [round(float(b), 4) for b in beats],
        "bars": [{"n": i + 1, "t": round(float(b), 4), **r} for i, (b, r) in enumerate(zip(bars, bar_rows))],
        "novelty_boundaries": boundaries,
        "vocals": None if vocal is None else {
            "segments": [[round(a, 3), round(b, 3)] for a, b in vocal["segments"]],
            "phrases": [{"start": round(p["start"], 3), "end": round(p["end"], 3), "parts": p["parts"],
                         "bar": bar_pos(p["start"])[0], "beat": bar_pos(p["start"])[1]}
                        for p in vocal["phrases"]]},
        "alignment": {"note": align_note, "lines": lines},
    }
    (out / "raw.json").write_text(json.dumps(result, indent=1))
    plot(out, y, dur, bars, bar_rows, grid, nov, nov_peaks, vocal, lines, info["file"])
    print(f"wrote {out / 'raw.json'} and plots")


if __name__ == "__main__":
    main()
