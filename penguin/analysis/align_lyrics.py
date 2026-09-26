#!/usr/bin/env python3
"""Place every lyric word on the vocal stem.

1. PocketSphinx phone recognition (its bundled English models, no downloads) turns the
   vocal stem into a time-stamped phone string. On singing it is noisy: vowels smear and
   consonants get swapped for their neighbours.
2. The known lyrics are expanded to phones with the CMU dictionary.
3. A semi-global alignment (Needleman-Wunsch with phone-class substitution scores, cheap
   insertions for held vowels and ad-libs, free leading/trailing material) maps each lyric
   phone onto the recognized phones, and so onto time.

Usage: python3 align_lyrics.py VOCALS [--lyrics lyrics.txt] [--out out/words.json]
"""
import argparse
import json
import os
import re
from pathlib import Path

import librosa
import numpy as np

VOWELS = set("AA AE AH AO AW AY EH ER EY IH IY OW OY UH UW".split())
CLASS = {**{p: "V" for p in VOWELS},
         **{p: "S" for p in "B D G K P T".split()},
         **{p: "F" for p in "DH F HH S SH TH V Z ZH CH JH".split()},
         **{p: "N" for p in "M N NG".split()},
         **{p: "L" for p in "L R W Y".split()}}
EXTRA = {"tryna": "T R AY N AH", "nothings": "N AH TH IH NG Z"}


def load_dict(model_dir):
    d = {}
    with open(os.path.join(model_dir, "cmudict-en-us.dict")) as fh:
        for line in fh:
            w, *ph = line.split()
            w = re.sub(r"\(\d+\)$", "", w)
            d.setdefault(w, ph)
    return d


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


def recognize_phones(path, model_dir):
    from pocketsphinx import Decoder
    y = librosa.load(path, sr=16000, mono=True)[0]
    pcm = (np.clip(y / (np.abs(y).max() + 1e-9) * 0.9, -1, 1) * 32767).astype(np.int16).tobytes()
    d = Decoder(samprate=16000, logfn="/dev/null",
                allphone=os.path.join(model_dir, "en-us-phone.lm.bin"),
                lw=2.0, pip=0.3, beam=1e-20, pbeam=1e-20)
    d.start_utt()
    d.process_raw(pcm, full_utt=True)
    d.end_utt()
    out = []
    for s in d.seg():
        if s.word in CLASS:
            out.append((s.word, s.start_frame / 100.0, (s.end_frame + 1) / 100.0))
    return out


def sub_score(a, b):
    if a == b:
        return 3.0
    ca, cb = CLASS[a], CLASS[b]
    if ca == cb:
        return 1.0
    return -1.5


def align(ref, hyp, del_cost=-1.6, ins_v=-0.25, ins_c=-0.7):
    """Semi-global alignment. ref: lyric phones; hyp: recognized phones.
    Returns for each ref index the matched hyp index or -1."""
    n, m = len(ref), len(hyp)
    ins = np.array([ins_v if CLASS[h] == "V" else ins_c for h in hyp])
    H = np.full((n + 1, m + 1), -1e9)
    P = np.zeros((n + 1, m + 1), np.int8)  # 1 diag, 2 up (deletion), 3 left (insertion)
    H[0, :] = 0.0  # free leading insertions
    for i in range(1, n + 1):
        H[i, 0] = H[i - 1, 0] + del_cost
        P[i, 0] = 2
        r = ref[i - 1]
        s = np.array([sub_score(r, h) for h in hyp])
        diag = H[i - 1, :-1] + s
        up = H[i - 1, 1:] + del_cost
        best = np.where(diag >= up, diag, up)
        ptr = np.where(diag >= up, 1, 2).astype(np.int8)
        row = H[i]
        prow = P[i]
        for j in range(1, m + 1):
            v, p = best[j - 1], ptr[j - 1]
            left = row[j - 1] + ins[j - 1]
            if left > v:
                v, p = left, 3
            row[j] = v
            prow[j] = p
    j = int(np.argmax(H[n]))  # free trailing insertions
    i = n
    match = [-1] * n
    while i > 0 and j > 0:
        p = P[i, j]
        if p == 1:
            match[i - 1] = j - 1
            i, j = i - 1, j - 1
        elif p == 2:
            i -= 1
        else:
            j -= 1
    return match, float(H[n].max())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("vocals")
    ap.add_argument("--lyrics", default=str(Path(__file__).with_name("lyrics.txt")))
    ap.add_argument("--out", default=str(Path(__file__).parent / "out" / "words.json"))
    args = ap.parse_args()
    import pocketsphinx
    model_dir = os.path.join(os.path.dirname(pocketsphinx.__file__), "model", "en-us")
    cmu = load_dict(model_dir)
    sections = read_lyrics(args.lyrics)

    ref, owner, words = [], [], []
    for s in sections:
        for li, line in enumerate(s["lines"]):
            for w in re.findall(r"[A-Za-z']+", line.lower()):
                ph = EXTRA.get(w) or " ".join(cmu.get(w, []))
                if not ph:
                    raise SystemExit(f"no pronunciation for {w!r}")
                wi = len(words)
                words.append({"section": s["name"], "line": li, "word": w, "phones": ph.split()})
                for p in ph.split():
                    ref.append(re.sub(r"\d", "", p))
                    owner.append(wi)

    hyp = recognize_phones(args.vocals, model_dir)
    match, score = align(ref, [h[0] for h in hyp])
    # word times from matched phones; interpolate words with no matched phone
    for wi, w in enumerate(words):
        idx = [match[k] for k in range(len(ref)) if owner[k] == wi and match[k] >= 0]
        exact = sum(1 for k in range(len(ref)) if owner[k] == wi and match[k] >= 0
                    and hyp[match[k]][0] == ref[k])
        w["n_phones"] = len(w["phones"])
        w["matched"] = len(idx)
        w["exact"] = exact
        if idx:
            w["start"] = round(hyp[min(idx)][1], 3)
            w["end"] = round(hyp[max(idx)][2], 3)
    known = [i for i, w in enumerate(words) if "start" in w]
    for i, w in enumerate(words):
        if "start" not in w:
            prev = max([k for k in known if k < i], default=None)
            nxt = min([k for k in known if k > i], default=None)
            a = words[prev]["end"] if prev is not None else 0.0
            b = words[nxt]["start"] if nxt is not None else a + 0.5
            w["start"], w["end"], w["interpolated"] = round(a, 3), round(b, 3), True
    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    Path(args.out).write_text(json.dumps({"score": score, "phones": hyp, "words": words}, indent=1))
    print(f"{len(hyp)} recognized phones, {len(ref)} lyric phones, score {score:.0f}")
    cur = None
    for w in words:
        key = (w["section"], w["line"])
        if key != cur:
            cur = key
            print(f"\n[{w['section']} {w['line'] + 1}]", end=" ")
        flag = "~" if w.get("interpolated") else ""
        print(f"{w['word']}@{w['start']:.2f}{flag}({w['exact']}/{w['n_phones']})", end=" ")
    print()


if __name__ == "__main__":
    main()
