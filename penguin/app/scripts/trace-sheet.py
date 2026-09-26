#!/usr/bin/env python3
"""Traces the model sheet into vector layers for the character rig.

    python3 scripts/trace-sheet.py            # all parts in sheet-parts.json
    python3 scripts/trace-sheet.py body.34    # just some

Reads penguin/source/him-model-sheet.jpg and writes public/art/sheet.json, which is gitignored:
the drawing is original artwork and this repository is public, so only the recipe is committed.

Each part is cropped, upscaled 6x and split into masks, and each mask is traced with potrace:
  fill   the inside of the figure (paper under the line work)
  ink    every dark mark
  mass   the solid black areas (ink with thin lines opened away)
  lines  ink that is not mass: outlines, features, feather strokes
Coordinates are sheet pixels relative to the part's anchor, y down.

Needs: pip install potracer opencv-python-headless pillow numpy
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np
import potrace
from PIL import Image

HERE = Path(__file__).resolve().parent
SHEET = HERE.parent.parent / "source" / "him-model-sheet.jpg"
MANIFEST = HERE / "sheet-parts.json"
OUT = HERE.parent / "public" / "art" / "sheet.json"
K = 6  # upscale factor
INK = 125  # luminance below this is ink
GAP = 2.0  # sheet px: outline gaps this wide are closed when finding the inside
MASS = 2.6  # sheet px: black areas thicker than this are mass


def disk(r):
    d = max(1, int(round(r * 2)) | 1)
    return cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (d, d))


def path_d(mask, x0, y0, ax, ay, turd=24):
    """potrace a boolean mask; returns an SVG path in anchor-relative sheet pixels."""
    if not mask.any():
        return ""
    # potracer treats True as paper, so pass the mask inverted: marked pixels become the traced shape
    plist = potrace.Bitmap(~mask).trace(turdsize=turd, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,
                                       alphamax=1.0, opticurve=True, opttolerance=0.2)
    f = lambda p: f"{x0 + p.x / K - ax:.2f} {y0 + p.y / K - ay:.2f}"
    out = []
    for curve in plist:
        out.append("M" + f(curve.start_point))
        for seg in curve.segments:
            if seg.is_corner:
                out.append("L" + f(seg.c) + "L" + f(seg.end_point))
            else:
                out.append("C" + f(seg.c1) + " " + f(seg.c2) + " " + f(seg.end_point))
        out.append("Z")
    return "".join(out)


def trace(img, spec):
    x0, y0, x1, y1 = spec["box"]
    crop = img.crop((x0, y0, x1, y1)).resize(((x1 - x0) * K, (y1 - y0) * K), Image.LANCZOS)
    a = np.asarray(crop).astype(np.float32)
    lum = a @ np.array([0.299, 0.587, 0.114], np.float32)
    ink = lum < INK
    if "keep" in spec:
        keep = np.zeros(ink.shape, np.uint8)
        pts = np.array([[(x - x0) * K, (y - y0) * K] for x, y in spec["keep"]], np.int32)
        cv2.fillPoly(keep, [pts], 1)
        ink &= keep.astype(bool)
    # inside = everything the background can't reach once small outline gaps are closed
    marks = (lum < 200).astype(np.uint8)
    closed = cv2.dilate(marks, disk(GAP * K / 2))
    h, w = closed.shape
    flood = np.pad(1 - closed, 1, constant_values=1).astype(np.uint8)
    cv2.floodFill(flood, np.zeros((h + 4, w + 4), np.uint8), (0, 0), 2)
    outside = flood[1:-1, 1:-1] == 2
    fill = cv2.erode((~outside).astype(np.uint8), disk(GAP * K / 2)).astype(bool) | ink
    # keep only the largest inside region (drops stray letters and specks)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(fill.astype(np.uint8), 8)
    if n > 2:
        big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        fill = lab == big
        ink &= fill
    mass = cv2.morphologyEx(ink.astype(np.uint8), cv2.MORPH_OPEN, disk(MASS * K / 2)).astype(bool)
    lines = ink & ~mass
    ys, xs = np.nonzero(fill)
    bottom = y0 + ys.max() / K
    top = y0 + ys.min() / K
    if spec.get("anchor") == "feet":
        # center of the lowest 4% of the figure
        cut = ys.max() - 0.04 * (ys.max() - ys.min())
        ax = x0 + xs[ys >= cut].mean() / K
    else:
        ax = x0 + xs.mean() / K
    ay = bottom
    return {
        "box": spec["box"],
        "anchor": [round(ax, 2), round(ay, 2)],
        "height": round(bottom - top, 2),
        "width": round((xs.max() - xs.min()) / K, 2),
        "left": round(x0 + xs.min() / K - ax, 2),
        "top": round(top - ay, 2),
        "fill": path_d(fill, x0, y0, ax, ay, turd=200),
        "ink": path_d(ink, x0, y0, ax, ay),
        "mass": path_d(mass, x0, y0, ax, ay),
        "lines": path_d(lines, x0, y0, ax, ay, turd=12),
    }


def main():
    parts = json.loads(MANIFEST.read_text())["parts"]
    only = set(sys.argv[1:])
    img = Image.open(SHEET).convert("RGB")
    data = json.loads(OUT.read_text()) if OUT.exists() else {"parts": {}}
    for pid, spec in parts.items():
        if only and pid not in only:
            continue
        data["parts"][pid] = trace(img, spec)
        p = data["parts"][pid]
        print(f"{pid:16s} h={p['height']:6.1f} w={p['width']:6.1f} "
              f"ink={len(p['ink']) // 1024}k mass={len(p['mass']) // 1024}k lines={len(p['lines']) // 1024}k")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    data["source"] = {"sheet": SHEET.name, "scale": K}
    OUT.write_text(json.dumps(data))
    print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
