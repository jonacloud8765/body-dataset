#!/usr/bin/env python3
"""Checks a rendered animatic against the timeline and the song.

    python3 scripts/verify-render.py out/animatic-540p.mp4

1. Frame count and duration match the timeline.
2. Every cut in timeline.json is a visible picture change in the video, on its planned frame
   (scene changes are measured with ffmpeg on the HUD-free center of the frame).
3. The video's audio is the song with no offset (cross-correlation against penguin/source).
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
TIMELINE = HERE.parent.parent / "storyboard" / "timeline.json"
SONG = HERE.parent.parent / "source" / "im-the-penguin.mp3"


def probe(video):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-count_frames", "-show_entries",
         "stream=codec_type,nb_read_frames,duration,r_frame_rate", "-of", "json", str(video)],
        capture_output=True, text=True, check=True)
    return json.loads(out.stdout)["streams"]


def frame_diffs(video, w=160, h=90):
    """Mean absolute difference between consecutive frames, center crop (no HUD strips or cut border)."""
    cmd = ["ffmpeg", "-v", "error", "-i", str(video), "-vf",
           f"crop=iw*0.9:ih*0.66:iw*0.05:ih*0.17,scale={w}:{h},format=gray", "-f", "rawvideo", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    frames = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.float32)
    return frames.shape[0], np.abs(np.diff(frames, axis=0)).mean(axis=(1, 2))


def decode(path, sr=8000, seconds=60):
    cmd = ["ffmpeg", "-v", "error", "-i", str(path), "-t", str(seconds), "-ac", "1", "-ar", str(sr),
           "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32)


def main():
    video = Path(sys.argv[1])
    tl = json.loads(TIMELINE.read_text())
    ok = True

    streams = probe(video)
    v = next(s for s in streams if s["codec_type"] == "video")
    a = [s for s in streams if s["codec_type"] == "audio"]
    n = int(v["nb_read_frames"])
    print(f"video: {n} frames ({tl['durationInFrames']} planned), audio streams: {len(a)}")
    ok &= n == tl["durationInFrames"] and len(a) == 1

    n2, d = frame_diffs(video)
    # a cut shows as a spike: much bigger than the frames around it
    cuts = [s["from"] for s in tl["shots"][1:]]
    misses = []
    for c in cuts:
        i = c - 1  # d[i] is the change from frame c-1 to frame c
        # the calmer side of the cut is the reference (a shot can open on a fade or a move)
        local = min(np.median(d[max(0, i - 6):i - 1]), np.median(d[i + 2:i + 7]))
        near = d[max(0, i - 1):i + 2]
        hit = int(np.argmax(near)) - (1 if i > 0 else 0)
        strong = near.max() > max(1.5, 2.5 * local)
        if not strong or hit != 0:
            misses.append((c, round(float(d[i]), 2), round(float(local), 2), hit))
    print(f"cuts on their planned frame: {len(cuts) - len(misses)}/{len(cuts)}")
    for c, v_, m, hit in misses:
        shot = next(s for s in tl["shots"] if s["from"] == c)
        print(f"  {shot['id']} at f{c}: change {v_} vs local {m} (peak offset {hit:+d} frames)")

    ref = decode(SONG)
    got = decode(video)
    L = min(len(ref), len(got))
    r, g = ref[:L] - ref[:L].mean(), got[:L] - got[:L].mean()
    spec = np.fft.irfft(np.fft.rfft(g, 2 * L) * np.conj(np.fft.rfft(r, 2 * L)))
    lag = int(np.argmax(spec))
    lag = lag - 2 * L if lag > L else lag
    corr = spec.max() / (np.linalg.norm(r) * np.linalg.norm(g))
    print(f"audio offset vs the song: {lag / 8:.1f} ms (correlation {corr:.3f})")
    ok &= abs(lag / 8) <= 12 and corr > 0.9
    print("OK" if ok else "CHECK")


if __name__ == "__main__":
    main()
