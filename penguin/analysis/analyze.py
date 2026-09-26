#!/usr/bin/env python3
"""Measure the song so every shot can be placed on the real music.

Usage:
  python3 analyze.py SONG [--vocals VOCALS] [--song-map song-map.json] [--out DIR]

Writes:
  DIR/raw.json        tempo, beat grid (refit to the drum hits), bars with per-bar features,
                      novelty boundaries, vocal activity
  DIR/overview.png    whole song: waveform, spectrogram, intensity, novelty, vocals
  DIR/detail-*.png    30 s windows of the same, with bar numbers and beat ticks

With --song-map, the plots label the curated sung lines. The sung lines themselves are placed
with align_lyrics.py, checked on plot_vocals.py's sheets, and curated into song-map.json,
which is what the storyboard reads.
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


def refit_on_hits(path, t0, per):
    """Refit the grid to where the drum hits actually start.

    Trackers report beats some tens of milliseconds off the audible attack, by an amount that
    depends on the mix. The strongest 1.5-6 kHz transients (snare, claps, hats) are found,
    backtracked to 10% of their rise, and the grid is refit to the hits that sit within a
    quarter beat of it."""
    sr, hop = 44100, 64  # 1.5 ms frames: full rate, so attacks aren't smeared
    y = librosa.load(path, sr=sr, mono=True)[0]
    S = np.abs(librosa.stft(y, n_fft=1024, hop_length=hop))
    f = librosa.fft_frequencies(sr=sr, n_fft=1024)
    t = librosa.frames_to_time(np.arange(S.shape[1]), sr=sr, hop_length=hop)
    e = np.log1p(S[(f >= 1500) & (f < 6000)].sum(0))
    fl = np.maximum(0, np.diff(e, prepend=e[:1]))
    pk, _ = sps.find_peaks(fl, height=np.percentile(fl, 99.7), distance=int(0.25 * sr / hop))
    hits = []
    for pidx in pk:
        q = pidx
        while q > 0 and fl[q - 1] > 0.1 * fl[pidx]:
            q -= 1
        hits.append(t[q])
    h = np.array(hits)
    for _ in range(3):
        k = np.round((h - t0) / per)
        m = np.abs(h - (t0 + k * per)) < 0.25 * per
        A = np.vstack([np.ones(m.sum()), k[m]]).T
        (t0, per), *_ = np.linalg.lstsq(A, h[m], rcond=None)
    k = np.round((h - t0) / per)
    res = h - (t0 + k * per)
    res = res[np.abs(res) < 0.25 * per]
    t0 -= np.floor(t0 / per) * per
    return float(t0), float(per), res, len(h)


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
    ap.add_argument("--song-map", help="label the curated lines from this song-map.json in the plots")
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
    t0, per, _, keep = fit_grid(beats)
    t0, per, res, n_hits = refit_on_hits(args.song, t0, per)
    lt = local_tempo(beats)
    print(f"tempo essentia {tr['essentia_bpm']:.2f} (conf {tr['essentia_confidence']:.2f}), "
          f"librosa {tr['librosa_bpm']:.2f}; {keep.mean() * 100:.0f}% of {pick} beats on one grid; "
          f"refit to {len(res)} of {n_hits} drum hits: {60 / per:.3f} BPM, residual median "
          f"{np.median(np.abs(res)) * 1000:.1f} ms, p95 {np.percentile(np.abs(res), 95) * 1000:.1f} ms")
    constant = bool(np.percentile(np.abs(res), 95) < 0.030)
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
    if args.vocals:
        yv = librosa.load(args.vocals, sr=SR, mono=True)[0]
        segs, phrases, v_onsets, curve = vocal_activity(yv)
        f0, voiced, _ = librosa.pyin(yv, fmin=70, fmax=1000, sr=SR, hop_length=HOP * 2)
        vocal = {"segments": segs, "phrases": phrases, "curve": curve,
                 "f0": (librosa.times_like(f0, sr=SR, hop_length=HOP * 2), f0)}
        print(f"vocals: {len(segs)} active segments, {len(phrases)} phrases")
    lines = None
    if args.song_map:
        sm = json.loads(Path(args.song_map).read_text())
        lines = [{"text": ln["text"], "start": ln["start"]["t"], "end": ln["end"]["t"]} for ln in sm["lines"]]

    def bar_pos(t):
        x = (t - bars[0]) / (per * bpb)
        b = int(np.floor(x))
        return b + 1, round((x - b) * bpb + 1, 2)

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
                 "tracked_on_grid_fraction": round(float(keep.mean()), 3), "drum_hits_used": int(len(res)),
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
    }
    (out / "raw.json").write_text(json.dumps(result, indent=1))
    plot(out, y, dur, bars, bar_rows, grid, nov, nov_peaks, vocal, lines, info["file"])
    print(f"wrote {out / 'raw.json'} and plots")


if __name__ == "__main__":
    main()
