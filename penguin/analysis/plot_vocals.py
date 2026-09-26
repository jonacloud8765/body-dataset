#!/usr/bin/env python3
"""Bar-by-bar vocal sheets for checking lyric placement by eye.

Each page covers 8 bars: vocal loudness, sung melody (pYIN), recognized phones, the
aligned lyric words, and the beat grid with bar and beat numbers.

Usage: python3 plot_vocals.py VOCALS --song-map song-map.json [--words out/words.json] --out DIR

The grid and the curated lines come from song-map.json. --words adds align_lyrics.py's
recognized phones along the bottom, which is how the lines were checked.
"""
import argparse
import json
from pathlib import Path

import librosa
import matplotlib
import numpy as np

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402

SR = 22050
HOP = 256


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("vocals")
    ap.add_argument("--song-map", required=True)
    ap.add_argument("--words")
    ap.add_argument("--out", required=True)
    ap.add_argument("--bars-per-page", type=int, default=8)
    args = ap.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    sm = json.loads(Path(args.song_map).read_text())
    g = {"first_bar": sm["grid"]["first_bar_s"], "beat_period": sm["grid"]["beat_s"],
         "meter": sm["grid"]["meter"]}
    W = json.loads(Path(args.words).read_text()) if args.words else {"phones": []}
    lines = [{"text": ln["text"], "start": ln["start"]["t"], "end": ln["end"]["t"], "id": ln["id"]}
             for ln in sm["lines"]]
    y = librosa.load(args.vocals, sr=SR, mono=True)[0]
    dur = len(y) / SR
    rms = librosa.feature.rms(y=y, frame_length=1024, hop_length=HOP)[0]
    db = 20 * np.log10(rms + 1e-9)
    db -= np.percentile(db, 99)
    t = librosa.frames_to_time(np.arange(len(db)), sr=SR, hop_length=HOP)
    f0, voiced, _ = librosa.pyin(y, fmin=70, fmax=1000, sr=SR, hop_length=HOP)
    midi = librosa.hz_to_midi(f0)
    bar0, per, meter = g["first_bar"], g["beat_period"], g["meter"]
    bar_len = per * meter
    n_bars = int(np.ceil((dur - bar0) / bar_len)) + 1
    lo, hi = np.nanpercentile(midi, 1), np.nanpercentile(midi, 99)
    for p0 in range(0, n_bars, args.bars_per_page):
        b_first = p0 + 1
        t0 = bar0 + p0 * bar_len - 0.5 * per
        t1 = t0 + args.bars_per_page * bar_len + per
        fig, ax = plt.subplots(3, 1, figsize=(24, 10), sharex=True,
                               gridspec_kw={"height_ratios": [1.2, 1.4, 1.0]})
        fig.suptitle(f"bars {b_first}-{b_first + args.bars_per_page - 1}", fontsize=14)
        m = (t >= t0) & (t <= t1)
        ax[0].plot(t[m], db[m], color="#333", lw=0.8)
        ax[0].set_ylim(-60, 3)
        ax[0].set_ylabel("vocal dB")
        ax[1].plot(t[m], midi[m], ".", ms=2.5, color="#a0a")
        ax[1].set_ylim(lo - 2, hi + 2)
        ax[1].set_ylabel("melody (MIDI)")
        for ph, a, b in W["phones"]:
            if t0 <= a <= t1:
                ax[2].text(a, 0.15, ph, fontsize=7, rotation=90, color="#666")
        for i, ln in enumerate(lines):
            if ln["end"] < t0 or ln["start"] > t1:
                continue
            lvl = i % 3
            ax[2].plot([ln["start"], ln["end"]], [0.62 + lvl * 0.13] * 2, color="#c33", lw=4,
                       solid_capstyle="butt")
            ax[2].text(max(ln["start"], t0), 0.66 + lvl * 0.13, f"{ln['id']} {ln['text']}", fontsize=9,
                       clip_on=True)
        ax[2].set_ylim(0, 1.05)
        ax[2].set_yticks([])
        for a in ax:
            k0 = int(np.floor((t0 - bar0) / per))
            for k in range(k0, int((t1 - bar0) / per) + 1):
                tt = bar0 + k * per
                beat = k % meter + 1
                a.axvline(tt, color="#000" if beat == 1 else "#8a8", lw=1.2 if beat == 1 else 0.5,
                          alpha=0.6)
                if a is ax[0]:
                    lbl = f"{k // meter + 1}" if beat == 1 else str(beat)
                    a.text(tt, 4, lbl, ha="center", fontsize=10 if beat == 1 else 7,
                           fontweight="bold" if beat == 1 else "normal")
        ax[2].set_xlim(t0, t1)
        ax[2].set_xlabel("seconds")
        fig.tight_layout()
        fig.savefig(out / f"bars-{b_first:02d}.png", dpi=72)
        plt.close(fig)
    print(f"wrote {out}")


if __name__ == "__main__":
    main()
