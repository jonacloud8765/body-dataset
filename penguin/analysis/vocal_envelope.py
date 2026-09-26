#!/usr/bin/env python3
"""Per-frame vocal level from the vocal stem, for lip sync (0 = silent, 1 = loudest).

RMS over a two-frame window centered on each video frame, in dB relative to the stem's
99th percentile, gated at -35 dB, mapped to 0-1 with a gentle curve, then smoothed with a
1-frame attack and a 3-frame release so the beak opens fast and closes a little slower.

Usage: python3 vocal_envelope.py ../source/im-the-penguin-vocals.mp3 [--fps 30] [--out vocal-envelope.json]
"""
import argparse
import json
from pathlib import Path

import librosa
import numpy as np


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("vocals")
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--out", default=str(Path(__file__).with_name("vocal-envelope.json")))
    args = ap.parse_args()
    sr = 22050
    y = librosa.load(args.vocals, sr=sr, mono=True)[0]
    hop = sr / args.fps
    n = int(np.ceil(len(y) / hop))
    win = int(round(2 * hop))
    level = np.zeros(n)
    for i in range(n):
        c = int(round(i * hop))
        a, b = max(0, c - win // 2), min(len(y), c + win // 2)
        seg = y[a:b]
        level[i] = np.sqrt(np.mean(seg ** 2)) if len(seg) else 0.0
    db = 20 * np.log10(level + 1e-9)
    db -= np.percentile(db, 99)
    v = np.clip((db + 35) / 35, 0, 1) ** 1.4
    out = np.zeros_like(v)
    for i in range(n):  # attack 1 frame, release 3 frames
        prev = out[i - 1] if i else 0.0
        out[i] = v[i] if v[i] >= prev else prev + (v[i] - prev) / 3
    # syllable pulse: onset strength at exactly one value per video frame, decaying between onsets
    hop_i = int(round(hop))
    o = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop_i)[:n]
    o = np.pad(o, (0, max(0, n - len(o))))
    o = np.clip(o / (np.percentile(o, 99) + 1e-9), 0, 1)
    pulse = np.zeros(n)
    for i in range(n):
        pulse[i] = max(o[i], (pulse[i - 1] if i else 0.0) * 0.6)
    Path(args.out).write_text(json.dumps({
        "fps": args.fps, "frames": n,
        "note": "per-frame vocal level (values) and syllable onset pulse (pulse), 0-1, from the vocal stem",
        "values": [round(float(x), 3) for x in out],
        "pulse": [round(float(x), 3) for x in pulse]}))
    print(f"wrote {args.out}: {n} frames, mean {out.mean():.3f}, frames above 0.2: {(out > 0.2).mean() * 100:.0f}%")


if __name__ == "__main__":
    main()
