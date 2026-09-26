import {random} from 'remotion';

/** Procedural shapes shared by every style. All deterministic: same inputs, same shape. */

export type Pt = [number, number];

/** Smooth 1D value noise in [-1, 1]. */
export const noise1 = (x: number, seed: string) => {
  const i = Math.floor(x);
  const f = x - i;
  const a = random(`${seed}:${i}`) * 2 - 1;
  const b = random(`${seed}:${i + 1}`) * 2 - 1;
  const t = f * f * (3 - 2 * f);
  return a + (b - a) * t;
};

/** Fractal 1D noise, roughly in [-1, 1]. */
export const fbm1 = (x: number, seed: string, octaves = 3) => {
  let v = 0;
  let amp = 0.5;
  let freq = 1;
  for (let o = 0; o < octaves; o++) {
    v += amp * noise1(x * freq, `${seed}${o}`);
    amp *= 0.5;
    freq *= 2;
  }
  return v / 0.875;
};

export const poly = (pts: Pt[], close = true) =>
  pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('') + (close ? 'Z' : '');

/** A closed or open Catmull-Rom spline through the points, as cubic Beziers. */
export const smooth = (pts: Pt[], close = true, k = 0.5) => {
  const n = pts.length;
  const at = (i: number) => (close ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  const last = close ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) * k) / 3, p1[1] + ((p2[1] - p0[1]) * k) / 3];
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) * k) / 3, p2[1] - ((p3[1] - p1[1]) * k) / 3];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + (close ? 'Z' : '');
};

/**
 * The creator asleep: a bowed penguin head (summit dome, the beak as a spur pointing left, toward
 * the colony) on sloping shoulders. Units: 100 = the summit's height; base center at (0, 0).
 */
export const MOUNTAIN: Pt[] = [
  [-110, 0], [-96, -14], [-84, -26], [-76, -38], [-70, -47], [-79, -55], [-66, -60], [-62, -61],
  [-50, -80], [-40, -89], [-31, -94], [-20, -98.5], [-10, -100], [0, -99], [8, -96], [16, -91.5],
  [23, -86], [31, -78], [39, -70], [48, -60], [58, -50], [70, -37], [82, -24], [96, -11], [110, 0],
];
/** The broad white face under the beak. */
export const SNOWFIELD: Pt[] = [[-104, 0], [-88, -20], [-72, -40], [-64, -52], [-58, -57], [-48, -61], [-40, -61], [-32, -52], [-22, -40], [-14, -20], [-8, 0]];
/** The main ridge: left of it is the side turned away from a sun on the right. */
export const RIDGE: Pt[] = [[-10, -100], [-2, -84], [6, -66], [16, -46], [28, -24], [40, 0]];
/** Two cornices on the dome, and the two caves under them (the sleeping eyes). */
export const CORNICES: Pt[] = [[-47, -82], [-28, -91]];
export const CAVES: Pt[] = [[-46, -76], [-27, -83]];

/** Resamples an outline every `step` units and roughens it with noise, scaled to px. */
export const roughen = (pts: Pt[], s: number, seed: string, amp: number, step = 2.2, flatBase = true): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const len = Math.hypot(x1 - x0, y1 - y0);
    const n = Math.max(1, Math.round(len / step));
    const nx = -(y1 - y0) / len;
    const ny = (x1 - x0) / len;
    for (let k = 0; k < n; k++) {
      const u = k / n;
      const x = x0 + (x1 - x0) * u;
      const y = y0 + (y1 - y0) * u;
      const base = flatBase && y > -4 ? Math.max(0, -y / 4) : 1;
      const j = fbm1((i * 7.3 + u * n) * 0.8, seed) * amp * base;
      out.push([(x + nx * j) * s, (y + ny * j) * s]);
    }
  }
  const [lx, ly] = pts[pts.length - 1];
  out.push([lx * s, ly * s]);
  return out;
};

/** Snow gullies on the sunlit flank: thin streaks running down from the ridge line. */
export const gullies = (s: number, seed: string, n = 9): Pt[][] => {
  const out: Pt[][] = [];
  for (let i = 0; i < n; i++) {
    const u = 0.12 + (i / n) * 0.78;
    const x0 = -6 + u * 52;
    const y0 = -99 + u * 92;
    const len = 8 + random(`${seed}l${i}`) * 16;
    const w = 0.8 + random(`${seed}w${i}`) * 1.6;
    const dx = 5 + random(`${seed}d${i}`) * 6;
    out.push([
      [x0 * s, y0 * s],
      [(x0 + dx * 0.5 + w) * s, (y0 + len * 0.5) * s],
      [(x0 + dx) * s, (y0 + len) * s],
      [(x0 + dx * 0.5 - w) * s, (y0 + len * 0.45) * s],
    ]);
  }
  return out;
};

/** A distant ridgeline along the horizon, as a closed shape down to `bottom`. */
export const range = (y: number, amp: number, seed: string, x0 = -100, x1 = 2020, step = 12, bottom = 1200): Pt[] => {
  const pts: Pt[] = [];
  for (let x = x0; x <= x1; x += step) {
    const h = Math.max(0, fbm1(x / 180, seed, 4) * 0.6 + 0.45) * amp;
    pts.push([x, y - h]);
  }
  return [...pts, [x1, bottom], [x0, bottom]];
};

/**
 * Sastrugi: wind-carved ridges on the snow, as tapered strokes in perspective (small and dense near
 * the horizon, long and thick near the lens). Returns [path, depth 0-1] pairs.
 */
export const sastrugi = (horizon: number, bottom: number, n: number, seed: string, drift = 0): [string, number][] => {
  const out: [string, number][] = [];
  for (let i = 0; i < n; i++) {
    const depth = Math.pow(random(`${seed}d${i}`), 1.7);
    const y = horizon + 4 + depth * (bottom - horizon);
    const len = 14 + depth * 300 * (0.5 + random(`${seed}l${i}`));
    const t = 0.6 + depth * 5;
    const span = 2200;
    const x = ((((random(`${seed}x${i}`) * span - drift * (0.2 + depth)) % span) + span) % span) - 140;
    const bend = (random(`${seed}b${i}`) - 0.5) * 6 * (0.4 + depth);
    out.push([
      `M${x.toFixed(1)} ${y.toFixed(1)}Q${(x + len * 0.45).toFixed(1)} ${(y - t + bend).toFixed(1)} ${(x + len).toFixed(1)} ${(y + bend * 0.3).toFixed(1)}Q${(x + len * 0.5).toFixed(1)} ${(y + t * 0.35 + bend * 0.5).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}Z`,
      depth,
    ]);
  }
  return out;
};

/** A cumulus cloud as a cluster of puffs (for the styles that paint clouds). */
export const cumulus = (cx: number, cy: number, w: number, seed: string, n = 9): {x: number; y: number; r: number}[] => {
  const out: {x: number; y: number; r: number}[] = [];
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1) - 0.5;
    const r = w * (0.13 + 0.12 * (1 - Math.abs(u) * 1.6) + random(`${seed}r${i}`) * 0.05);
    out.push({x: cx + u * w * 0.9, y: cy - r * 0.5 - random(`${seed}y${i}`) * w * 0.06, r});
  }
  return out;
};
