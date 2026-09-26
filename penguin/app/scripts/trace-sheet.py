#!/usr/bin/env python3
"""Traces the model sheet into vector layers for the character rig.

    python3 scripts/trace-sheet.py

Reads penguin/source/him-model-sheet.jpg and scripts/sheet-parts.json, writes public/art/sheet.json
(gitignored: the drawing is original artwork and this repository is public; only the recipe is
committed).

Every drawing is cropped, upscaled 6x and split into masks, and each mask is traced with potrace:
  fill   the inside of the figure (paper under the line work)
  ink    every dark mark
  mass   the solid black areas (ink with thin lines opened away)
  lines  ink that is not mass: outlines, features, feather strokes
Coordinates are sheet pixels, y down.

- bodies: traced whole, then cut into rig parts (head, torso, feet) by keep-polygons. All parts of a
  body share the body's frame (origin at the feet baseline center) so they reassemble exactly.
  Joints (neck, hips, ankles, shoulders) are written in the same frame.
- heads: the nine swap-in heads, each in its own frame (origin at the bottom center), plus where it
  sits on each body: found by matching the head's line work against the body's own head over scale.
- poses: whole drawings (the climbing takes), cleaned of rocks by keep-polygons.

Needs: pip install potracer opencv-python-headless pillow numpy
"""
import json
from pathlib import Path

import cv2
import numpy as np
import potrace
from PIL import Image

HERE = Path(__file__).resolve().parent
SHEET = HERE.parent.parent / "source" / "him-model-sheet.jpg"
MANIFEST = HERE / "sheet-parts.json"
OUT = HERE.parent / "public" / "art" / "sheet.json"
K = 6  # upscale factor for tracing
INK = 125  # luminance below this is ink
GAP = 2.0  # sheet px: outline gaps this wide are closed when finding the inside
MASS = 2.6  # sheet px: black areas thicker than this are mass
R = 3  # scale for head registration


def disk(r):
    d = max(1, int(round(r * 2)) | 1)
    return cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (d, d))


def path_d(mask, x0, y0, ax, ay, turd=24):
    """potrace a boolean mask (K x scale, origin x0, y0 in sheet px) into anchor-relative sheet px."""
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


def masks(img, box, keep=None, cut_bottom=False):
    """fill / ink / mass / lines masks of one drawing at K x. `cut_bottom`: the drawing runs off the
    bottom of its box (the heads' throats), so the background can't come in that way."""
    x0, y0, x1, y1 = box
    crop = img.crop((x0, y0, x1, y1)).resize(((x1 - x0) * K, (y1 - y0) * K), Image.LANCZOS)
    lum = np.asarray(crop).astype(np.float32) @ np.array([0.299, 0.587, 0.114], np.float32)
    ink = lum < INK
    marks = lum < 200
    if keep is not None:
        k = poly_mask(ink.shape, keep, x0, y0)
        ink &= k
        marks &= k
    # inside = everything the background can't reach once small outline gaps are closed
    # heads have small breaks in their outline beside the beak: close wider gaps there
    gap = GAP * 2.6 if cut_bottom else GAP
    closed = cv2.dilate(marks.astype(np.uint8), disk(gap * K / 2))
    if cut_bottom:
        # seal the base of the neck between the outermost ink, so the background can't reach the
        # throat around the tips of the neck bands
        base = int(closed.shape[0] * 0.8)
        cols = np.nonzero(marks[base:].any(axis=0))[0]
        if len(cols):
            closed[base:, cols.min():cols.max() + 1] = 1
    h, w = closed.shape
    flood = np.pad(1 - closed, 1, constant_values=1).astype(np.uint8)
    cv2.floodFill(flood, np.zeros((h + 4, w + 4), np.uint8), (0, 0), 2)
    outside = flood[1:-1, 1:-1] == 2
    fill = cv2.erode((~outside).astype(np.uint8), disk(gap * K / 2)).astype(bool) | ink
    if cut_bottom:
        # the seal only blocks leaks: row by row, the base keeps just what lies between its ink
        for r in range(base, fill.shape[0]):
            cols = np.nonzero(ink[r])[0]
            if len(cols) < 2:
                fill[r] = False
            else:
                fill[r, : cols.min()] = False
                fill[r, cols.max() + 1 :] = False
    # keep only the largest inside region (drops stray letters and specks)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(fill.astype(np.uint8), 8)
    if n > 2:
        big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        fill = lab == big
        ink &= fill
    mass = cv2.morphologyEx(ink.astype(np.uint8), cv2.MORPH_OPEN, disk(MASS * K / 2)).astype(bool)
    return {"fill": fill, "ink": ink, "mass": mass, "lines": ink & ~mass}


def poly_mask(shape, pts, x0, y0):
    m = np.zeros(shape, np.uint8)
    cv2.fillPoly(m, [np.array([[(x - x0) * K, (y - y0) * K] for x, y in pts], np.int32)], 1)
    return m.astype(bool)


def layers(M, box, ax, ay, sel=None):
    x0, y0 = box[0], box[1]
    pick = (lambda m: m & sel) if sel is not None else (lambda m: m)
    fill = pick(M["fill"])
    ys, xs = np.nonzero(fill)
    if not len(ys):
        return None
    return {
        "left": round(x0 + xs.min() / K - ax, 2),
        "top": round(y0 + ys.min() / K - ay, 2),
        "width": round((xs.max() - xs.min()) / K, 2),
        "height": round((ys.max() - ys.min()) / K, 2),
        "fill": path_d(fill, x0, y0, ax, ay, turd=200),
        "ink": path_d(pick(M["ink"]), x0, y0, ax, ay),
        "mass": path_d(pick(M["mass"]), x0, y0, ax, ay),
        "lines": path_d(pick(M["lines"]), x0, y0, ax, ay, turd=12),
        # only the big black areas cast cel shadow onto the white beside them (not the tail or eyes)
        "casts": path_d(big_only(pick(M["mass"]), 700 * K * K), x0, y0, ax, ay),
    }


def big_only(mask, area):
    n, lab, stats, _ = cv2.connectedComponentsWithStats(mask.astype(np.uint8), 8)
    keep = np.zeros(mask.shape, bool)
    for i in range(1, n):
        if stats[i, cv2.CC_STAT_AREA] >= area:
            keep |= lab == i
    return keep


def feet_anchor(M, box):
    ys, xs = np.nonzero(M["fill"])
    cut = ys.max() - 0.04 * (ys.max() - ys.min())
    return box[0] + xs[ys >= cut].mean() / K, box[1] + ys.max() / K


def ink_small(img, box, frac=1.0):
    x0, y0, x1, y1 = box
    crop = img.crop((x0, y0, x1, y1)).resize(((x1 - x0) * R, (y1 - y0) * R), Image.LANCZOS)
    lum = np.asarray(crop).astype(np.float32) @ np.array([0.299, 0.587, 0.114], np.float32)
    m = (lum < INK).astype(np.float32)
    m = m[: int(m.shape[0] * frac)]
    return cv2.GaussianBlur(m, (0, 0), 1.5 * R)


def register(img, head_box, body_head_box):
    """Scale and offset that lay a sheet head over a body's own head (best line-work match)."""
    pad = 30
    bx0, by0, bx1, by1 = body_head_box
    region = (bx0 - pad, by0 - pad, bx1 + pad, by1 + pad)
    body = ink_small(img, region)
    # flat patches (pure paper, pure black) have no variance, which makes normalized correlation
    # blow up; a whisper of fixed noise keeps it defined there and near zero
    body = body + np.random.default_rng(1).normal(0, 0.01, body.shape).astype(np.float32)
    head = ink_small(img, head_box, 0.66)
    best = (-2, 1, (0, 0))
    for s in np.arange(0.6, 1.0, 0.005):
        t = cv2.resize(head, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
        if t.shape[0] >= body.shape[0] or t.shape[1] >= body.shape[1]:
            continue
        res = cv2.matchTemplate(body, t, cv2.TM_CCOEFF_NORMED)
        _, mx, _, loc = cv2.minMaxLoc(res)
        if mx > best[0]:
            best = (mx, s, loc)
    score, s, (lx, ly) = best
    # sheet point on the head drawing (hx, hy) lands on the body at:
    #   region0 + loc / R + s * (h - head_box0)
    return float(s), region[0] + lx / R - s * head_box[0], region[1] + ly / R - s * head_box[1], float(score)


def main():
    spec = json.loads(MANIFEST.read_text())
    img = Image.open(SHEET).convert("RGB")
    out = {"source": {"sheet": SHEET.name, "scale": K}, "bodies": {}, "heads": {}, "poses": {}, "parts": {}}

    head_anchor = {}
    for hid, h in spec["heads"].items():
        M = masks(img, h["box"], cut_bottom=True)
        ys, xs = np.nonzero(M["fill"])
        ax = h["box"][0] + xs.mean() / K
        ay = h["box"][1] + ys.max() / K
        head_anchor[hid] = (ax, ay)
        out["heads"][hid] = layers(M, h["box"], ax, ay)
        print(f"head {hid:10s} h={out['heads'][hid]['height']:.1f}")

    for bid, b in spec["bodies"].items():
        M = masks(img, b["box"])
        ax, ay = feet_anchor(M, b["box"])
        body = {"anchor": [round(ax, 2), round(ay, 2)], "parts": {}, "joints": {}, "heads": {}, "legs": b["legs"]}
        full = layers(M, b["box"], ax, ay)
        body["height"] = full["height"]
        out["parts"][f"body.{bid}"] = full
        for pid, poly in b["parts"].items():
            sel = poly_mask(M["fill"].shape, poly, b["box"][0], b["box"][1])
            # parts cut out of this one (a flipper that swings on its own)
            for other in b.get("minus", {}).get(pid, []):
                sel &= ~poly_mask(M["fill"].shape, b["parts"][other], b["box"][0], b["box"][1])
            body["parts"][pid] = layers(M, b["box"], ax, ay, sel)
            if pid == "torso":
                # the region under the torso's cut line: shading treats that edge as open, not an outline
                bottom = poly[2:]
                deep = max(y for _, y in poly) + 80
                below = bottom + [[bottom[-1][0], deep], [bottom[0][0], deep]]
                body["parts"][pid]["below"] = "M" + "L".join(f"{x - ax:.2f} {y - ay:.2f}" for x, y in below) + "Z"
        for j, (x, y) in b["joints"].items():
            body["joints"][j] = [round(x - ax, 2), round(y - ay, 2)]
        # lines drawn on a part where a cut-out part used to cover it (the belly edge under a flipper)
        body["seams"] = {pid: [[round(x - ax, 2), round(y - ay, 2)] for x, y in pts] for pid, pts in b.get("seams", {}).items()}
        # each leg measured off the drawing: width and center where it leaves the torso, at the hem
        # and at the ankle (the fill includes the outline, so widths are outside-to-outside)
        body["legs"] = {}
        for side, L in b["legs"].items():
            meas = {}
            for key in ("top", "hem", "ankle"):
                row = M["fill"][int((L[key] - b["box"][1]) * K)]
                x0, x1 = [int((v - b["box"][0]) * K) for v in L["range"]]
                xs = np.nonzero(row[x0:x1])[0] + x0
                # the run of fill nearest the middle of the range
                runs = np.split(xs, np.nonzero(np.diff(xs) > 1)[0] + 1)
                mid = (x0 + x1) / 2
                run = min(runs, key=lambda r: abs((r[0] + r[-1]) / 2 - mid))
                meas[key] = {"x": round(b["box"][0] + (run[0] + run[-1]) / 2 / K - ax, 2),
                             "y": round(L[key] - ay, 2), "w": round((run[-1] - run[0]) / K, 2)}
            meas["cuff"] = round(L["cuff"] - ay, 2)
            meas["cut"] = round(L["cut"] - ay, 2)
            body["legs"][side] = meas
        body["fade"] = {k: [round(a - ay, 2), round(c - ay, 2)] for k, (a, c) in b["fade"].items()}
        for hid, h in spec["heads"].items():
            s, tx, ty, score = register(img, h["box"], b["head"])
            hax, hay = head_anchor[hid]
            # head-frame point p (relative to the head anchor) -> body frame (relative to the body anchor)
            body["heads"][hid] = {"s": round(s, 4), "x": round(tx + s * hax - ax, 2), "y": round(ty + s * hay - ay, 2), "score": round(score, 3)}
        out["bodies"][bid] = body
        print(f"body {bid}: h={full['height']:.1f} parts={list(body['parts'])} heads=" +
              ", ".join(f"{k}:{v['s']:.2f}/{v['score']:.2f}" for k, v in body["heads"].items()))

    for pid, p in spec.get("poses", {}).items():
        M = masks(img, p["box"], p.get("keep"))
        ax, ay = feet_anchor(M, p["box"])
        out["poses"][pid] = layers(M, p["box"], ax, ay)
        out["poses"][pid]["anchor"] = [round(ax, 2), round(ay, 2)]
        print(f"pose {pid} h={out['poses'][pid]['height']:.1f}")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out))
    print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
