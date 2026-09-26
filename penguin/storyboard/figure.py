#!/usr/bin/env python3
"""Timeline figure for the pre-production document (light and dark PNGs).

Rows: song sections, loudness per bar, sung lines, and the 61 shots colored by which film
they belong to. Reads song-map.json and timeline.json (run build.py first).
"""
import json
from pathlib import Path

import matplotlib
import numpy as np

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Patch, Rectangle  # noqa: E402

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
OUT = ROOT / "docs" / "penguin" / "img"

THEMES = {
    "light": {"surface": "#fcfcfb", "text": "#0b0b0b", "text2": "#52514e", "grid": "#e2e1dc",
              "band": ["#efeeea", "#e3e2dd"], "line": "#8a8983",
              "series": {"CINEMA": "#2a78d6", "DOC": "#eb6834", "MAP": "#1baf7a", "FULL": "#2a78d6"}},
    "dark": {"surface": "#1a1a19", "text": "#ffffff", "text2": "#c3c2b7", "grid": "#34342f",
             "band": ["#252523", "#2f2f2c"], "line": "#8f8e86",
             "series": {"CINEMA": "#3987e5", "DOC": "#d95926", "MAP": "#199e70", "FULL": "#3987e5"}},
}
LABELS = {"CINEMA": "His film (2.39:1)", "DOC": "The documentary (viewfinder)",
          "MAP": "Graphic (map, end card)", "FULL": "His film, frame opened (the creator)"}
GAP = 0.09  # seconds of surface gap between adjacent blocks (~2 px)


def draw(theme):
    th = THEMES[theme]
    song = json.loads((ROOT / "penguin" / "analysis" / "song-map.json").read_text())
    tl = json.loads((HERE / "timeline.json").read_text())
    shots = tl["shots"]
    end = shots[-1]["end_s"]
    song_end = song["source"]["duration_s"]

    plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 9, "hatch.linewidth": 1.6})
    fig, ax = plt.subplots(figsize=(16, 6.2), dpi=150)
    fig.patch.set_facecolor(th["surface"])
    ax.set_facecolor(th["surface"])
    ax.set_xlim(-1, end + 1)
    ax.set_ylim(0, 10.6)
    ax.axis("off")

    # bar grid (recessive) and time axis
    for b in song["bar_starts"]:
        if b["t"] <= song_end:
            ax.plot([b["t"]] * 2, [0.9, 9.3], color=th["grid"], lw=0.6 if b["bar"] % 4 != 1 else 1.0,
                    zorder=0)
            if b["bar"] % 4 == 1:
                ax.text(b["t"], 9.4, f"bar {b['bar']}" if b["bar"] == 1 else str(b["bar"]),
                        ha="center", va="bottom", fontsize=7.5, color=th["text2"])
    for s in range(0, int(end) + 1, 15):
        ax.text(s, 0.55, f"{s // 60}:{s % 60:02d}", ha="center", va="top", fontsize=8, color=th["text2"])
        ax.plot([s, s], [0.72, 0.9], color=th["text2"], lw=0.8)
    ax.plot([0, end], [0.9, 0.9], color=th["text2"], lw=0.8)

    # row labels
    rows = {"sec": 8.3, "loud": 6.55, "vox": 5.25, "shot": 2.65}
    for key, text in (("sec", "Section"), ("loud", "Loudness"), ("vox", "Sung lines"), ("shot", "Shots")):
        ax.text(-1.6, rows[key], text, ha="right", va="center", fontsize=9, color=th["text"],
                fontweight="bold")

    # sections
    short = {"Instrumental climax": "Climax"}
    secs = [(short.get(x["name"], x["name"]), x["start"]["t"], x["end"]["t"]) for x in song["sections"]]
    secs[0] = (secs[0][0], 0.0, secs[0][2])
    secs.append(("Epilogue", song_end, end))
    for i, (name, a, b) in enumerate(secs):
        ax.add_patch(Rectangle((a + GAP / 2, 7.9), b - a - GAP, 0.8, color=th["band"][i % 2], lw=0))
        ax.text((a + b) / 2, 8.3, name, ha="center", va="center", fontsize=9, color=th["text"])

    # loudness per bar (single series: neutral ink, stepped)
    ts = [b["t"] for b in song["bar_starts"][:57]] + [song_end]
    iv = [b["intensity"] for b in song["bar_starts"][:57]]
    ys = 5.95 + np.array(iv + [iv[-1]]) * 1.2
    ax.step(ts, ys, where="post", color=th["text2"], lw=1.6)
    ax.plot([0, song_end], [5.95, 5.95], color=th["grid"], lw=0.8)

    # sung lines
    for ln in song["lines"]:
        a, b = ln["start"]["t"], ln["end"]["t"]
        paren = ln["text"].startswith("(")
        ax.add_patch(Rectangle((a, 5.08), max(b - a - GAP, 0.15), 0.34, lw=0,
                               color=th["line"], alpha=0.45 if paren else 0.9))
    picks = {"I1": "Seventy kilometers", "V1": "I'm the penguin", "C1_5": "documentary",
             "B1": "Don't turn me around", "B8": "wow", "C2_5": "documentary", "O1": "the creator?"}
    for ln in song["lines"]:
        if ln["id"] in picks:
            ax.text(ln["start"]["t"], 4.82, picks[ln["id"]], ha="left", va="top", fontsize=7.5,
                    color=th["text2"])

    # shots
    for s in shots:
        a, b = s["start_s"], s["end_s"]
        c = th["series"][s["mode"]]
        full = s["mode"] == "FULL"
        ax.add_patch(Rectangle((a + GAP / 2, 1.3), b - a - GAP, 2.7, facecolor=c,
                               edgecolor=th["surface"] if full else c, lw=0,
                               hatch="///" if full else None))
        w = b - a
        ax.text(a + w / 2, 2.65, s["id"][1:], ha="center", va="center",
                rotation=0 if w > 2.3 else 90, fontsize=7 if w > 1.0 else 6, color="#ffffff",
                fontweight="bold")

    # key moments
    marks = [("band in", 19.458), ("first sung line", 38.23), ("the clipboard", 48.22),
             ("turned around", 65.476), ("wow", 83.035), ("climb", 104.83), ("drop-out", 126.03),
             ("eyes open", 131.9), ("song ends", song_end)]
    for i, (name, t) in enumerate(marks):
        ax.plot([t, t], [1.2, 7.75], color=th["text"], lw=0.9, ls=(0, (2, 2)), zorder=3)
        ax.text(t + 0.4, 7.62 - (i % 3) * 0.3, name, ha="left", va="top", fontsize=7.5,
                color=th["text"], zorder=4)

    handles = [Patch(facecolor=th["series"][k], edgecolor=th["surface"],
                     hatch="////" if k == "FULL" else None, label=LABELS[k])
               for k in ("CINEMA", "FULL", "DOC", "MAP")]
    leg = ax.legend(handles=handles, loc="upper left", bbox_to_anchor=(0.0, 1.03), ncol=4, frameon=False,
                    fontsize=8.5, handlelength=1.6, columnspacing=1.6)
    for t in leg.get_texts():
        t.set_color(th["text"])
    ax.set_title("THE PENGUIN · shots on the song (numbers are shot IDs; bar grid at 99.09 BPM)",
                 loc="left", fontsize=11, color=th["text"], pad=26)
    OUT.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUT / f"timeline-{theme}.png", facecolor=th["surface"], bbox_inches="tight")
    plt.close(fig)


if __name__ == "__main__":
    for theme in THEMES:
        draw(theme)
    print(f"wrote {OUT}/timeline-light.png and timeline-dark.png")
