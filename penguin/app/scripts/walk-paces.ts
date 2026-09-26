// Lists every walking move in the film's blocking with the stride it needs (body units per
// step). Around 70 is his natural walk; over ~100 the legs can't reach and the feet would slide.
//
//   npx esbuild scripts/walk-paces.ts --bundle --platform=node --outfile=out/walk-paces.cjs --log-level=warning && node out/walk-paces.cjs
import {makeResolver, latest} from '../src/animatic/ShotView';
import type {El} from '../src/animatic/types';
import {FILM_SPECS} from '../src/film/blocking';
import {FPS, GRID} from '../src/timing/song';
import {SHOTS} from '../src/timing/timeline';

const BODY_H = 372.17;
const walkers = (els: El[]): Extract<El, {k: 'penguin'}>[] =>
  els.flatMap((e) => (e.k === 'penguin' ? [e] : e.k === 'group' ? walkers(e.els) : []));

for (const shot of SHOTS) {
  const spec = FILM_SPECS[shot.id] ?? {};
  const res = makeResolver(shot);
  const els = (spec.phases ?? [{els: spec.els ?? []}]).flatMap((p) => p.els);
  for (const el of walkers(els)) {
    if (!el.walk) continue;
    const rate = el.walk === 'half' ? 0.5 : el.walk === 'double' ? 2 : 1;
    const xs = el.keys.filter((k) => k.x !== undefined).map((k) => ({f: res(k.at), x: k.x!, h: k.h})).sort((a, b) => a.f - b.f);
    const hs = el.keys.filter((k) => k.h !== undefined);
    const h = hs.length ? hs[0].h! : 200;
    const s = h / BODY_H;
    for (let i = 0; i < xs.length - 1; i++) {
      const a = xs[i];
      const b = xs[i + 1];
      const pose = latest(el.keys, a.f, res, 'pose', 'stand');
      if (pose !== 'walk' || b.f <= a.f) continue;
      const beats = ((b.f - a.f) / FPS / GRID.beat_s) * rate;
      const stride = Math.abs(b.x - a.x) / beats / s;
      const flag = stride > 100 ? '  <-- too fast' : stride < 25 && h >= 60 ? '  <-- shuffling' : '';
      console.log(`${shot.id} f${a.f}-${b.f} h${h} ${el.walk}: ${(b.x - a.x).toFixed(0)}px over ${beats.toFixed(2)} steps -> stride ${stride.toFixed(0)}${flag}`);
    }
    if (xs.length <= 1 || new Set(xs.map((k) => k.x)).size === 1) console.log(`${shot.id} h${h} ${el.walk}: tracked (walks in place)`);
  }
}
