import React from 'react';
import {random} from 'remotion';
import {CAVES, CORNICES, fbm1, gullies, MOUNTAIN, poly, range, RIDGE, roughen, smooth, SNOWFIELD, type Pt} from '../styles/geometry';
import type {WorldPalette} from './palette';

/**
 * The world in the flat 2D look: flat fills, hard shapes, no glows. The sky keeps its soft
 * top-to-horizon gradient (as in the flat style frame); everything on the ground is flat color.
 * Everything is a function of its props and the time, so any shot can be rebuilt from a few numbers.
 */

export const W = 1920;
export const H = 1080;
type Sun = {x: number; y: number};

// ─── sky ───────────────────────────────────────────────────────────────────
export const FlatSky: React.FC<{
  id: string;
  P: WorldPalette;
  horizon: number;
  sun?: Sun;
  t: number;
  clouds?: number;
  seed?: string;
  pan?: number;
}> = ({id, P, horizon, sun, t, clouds = 5, seed = 'sky', pan = 0}) => (
  <g>
    <defs>
      <linearGradient id={`sky${id}`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={0} y2={horizon}>
        <stop offset={0} stopColor={P.sky[0]} />
        <stop offset={0.45} stopColor={P.sky[1]} />
        <stop offset={0.82} stopColor={P.sky[2]} />
        <stop offset={1} stopColor={P.sky[3]} />
      </linearGradient>
    </defs>
    <rect x={-400} y={-400} width={W + 800} height={horizon + 460} fill={`url(#sky${id})`} />
    {P.stars > 0
      ? new Array(120).fill(0).map((_, i) => {
          const x = random(`${seed}sx${i}`) * W;
          const y = Math.pow(random(`${seed}sy${i}`), 1.4) * (horizon - 40);
          const on = Math.sin(t * (1.5 + random(`${seed}st${i}`) * 3) + i) > -0.4;
          const r = 1 + random(`${seed}sr${i}`) * 1.5;
          return on ? <circle key={i} cx={x} cy={y} r={r} fill="#FFFFFF" opacity={P.stars} /> : null;
        })
      : null}
    {sun ? (
      <g>
        <circle cx={sun.x} cy={sun.y} r={150} fill={P.glow} opacity={0.18} />
        <circle cx={sun.x} cy={sun.y} r={96} fill={P.glow} opacity={0.3} />
        <circle cx={sun.x} cy={sun.y} r={46} fill={P.sun} />
      </g>
    ) : null}
    {/* pill clouds, two tones, drifting */}
    {new Array(clouds).fill(0).map((_, i) => {
      const span = W + 1200;
      const w = 240 + random(`${seed}w${i}`) * 420;
      const x = ((((random(`${seed}x${i}`) * span - pan * 0.06 - t * (5 + i * 2)) % span) + span) % span) - 600;
      const y = 180 + random(`${seed}y${i}`) * (horizon - 330);
      const two = random(`${seed}2${i}`) > 0.4;
      return (
        <g key={i}>
          <rect x={x} y={y} width={w} height={24} rx={12} fill={P.cloud} opacity={0.9} />
          {two ? <rect x={x + w * 0.25} y={y + 30} width={w * 0.6} height={20} rx={10} fill={P.cloudShade} opacity={0.9} /> : null}
        </g>
      );
    })}
  </g>
);

// ─── distant ranges ────────────────────────────────────────────────────────
export const FlatRanges: React.FC<{P: WorldPalette; horizon: number; pan?: number; seed?: string; amp?: number}> = ({P, horizon, pan = 0, seed = 'r', amp = 30}) => {
  const far = range(horizon + 1, amp, `${seed}far`, -300, 2220);
  const mid = range(horizon + 2, amp * 0.53, `${seed}mid`, -300, 2220, 10);
  return (
    <g>
      <path d={poly(far.map(([x, y]) => [x + pan * 0.02, y] as Pt))} fill={P.range[0]} />
      <path d={poly(mid.map(([x, y]) => [x + pan * 0.05, y] as Pt))} fill={P.range[1]} />
    </g>
  );
};

// ─── the creator, asleep ───────────────────────────────────────────────────
export type EyeLook = 'none' | 'glint' | 'sealed' | 'open';

export const FlatMountain: React.FC<{
  id: string;
  P: WorldPalette;
  x: number;
  y: number;
  h: number;
  sun?: Sun;
  /** 0-1 atmospheric haze (distance), as a flat veil */
  haze?: number;
  eyes?: EyeLook;
  /** 0-1 gold rim drawing on (S49) */
  rim?: number;
  /** 0-1 breath plume progress, <0 none */
  plume?: number;
  flip?: number;
  /** a thin outline, for close shots */
  line?: boolean;
  /** against the sun: one dark shape */
  dark?: boolean;
}> = ({id, P, x, y, h, sun, haze = 0, eyes = 'none', rim = 0, plume = -1, flip = 1, line = false, dark = false}) => {
  const s = h / 100;
  const out = roughen(MOUNTAIN, s, 'mtn', 1.8);
  const snow = roughen(SNOWFIELD, s, 'snow', 2.6, 1.6);
  const ridge = RIDGE.map(([rx, ry]) => [rx * s, ry * s] as Pt);
  const lightRight = !sun || (sun.x - x) * flip >= 0;
  const side = (sgn: number): Pt[] => [...ridge, [130 * s * sgn, 0], [130 * s * sgn, -115 * s], [-10 * s, -115 * s]];
  const shadeSide = side(lightRight ? -1 : 1);
  const litSide = side(lightRight ? 1 : -1);
  const outline = smooth(out, true, 0.3);
  const edge = smooth(out, false, 0.3);
  const snowPath = smooth(snow, true, 0.35);
  const g = gullies(s, 'gul', 10);
  // seen up close, the rock has bands and the snow has wind marks (mountain units, so they scale)
  const detail = h > 300 && !dark;
  const lens = (cx: number, cy: number, len: number, th: number, ang: number) => {
    const r = (ang * Math.PI) / 180;
    const c = Math.cos(r);
    const sn = Math.sin(r);
    const p = (u: number, v: number) => `${((cx + u * c - v * sn) * s).toFixed(1)} ${((cy + u * sn + v * c) * s).toFixed(1)}`;
    return `M${p(-len / 2, 0)}Q${p(0, -th)} ${p(len / 2, 0)}Q${p(0, th * 0.35)} ${p(-len / 2, 0)}Z`;
  };
  const bands = detail
    ? new Array(46).fill(0).map((_, i) => lens(-110 + random(`mb${i}x`) * 220, -98 + random(`mb${i}y`) * 96, 10 + random(`mb${i}l`) * 26, 0.9 + random(`mb${i}t`) * 1.8, -22 + random(`mb${i}a`) * 14))
    : [];
  const marks = detail
    ? new Array(40).fill(0).map((_, i) => lens(-100 + random(`mw${i}x`) * 95, -60 + random(`mw${i}y`) * 60, 6 + random(`mw${i}l`) * 16, 0.5 + random(`mw${i}t`) * 0.9, -8 + random(`mw${i}a`) * 8))
    : [];
  return (
    <g transform={`translate(${x} ${y}) scale(${flip} 1)`}>
      <defs>
        <clipPath id={`mc${id}`}>
          <path d={outline} />
        </clipPath>
        <clipPath id={`ms${id}`}>
          <path d={poly(shadeSide)} />
        </clipPath>
        <clipPath id={`ml${id}`}>
          <path d={poly(litSide)} />
        </clipPath>
      </defs>
      <path d={outline} fill={dark ? P.rockShade : P.rock} />
      {dark ? null : (
      <g clipPath={`url(#mc${id})`}>
        <g clipPath={`url(#ms${id})`}>
          <rect x={-140 * s} y={-120 * s} width={280 * s} height={130 * s} fill={P.rockShade} />
        </g>
        {bands.map((d, i) => (
          <path key={`b${i}`} d={d} fill={P.rockShade} opacity={0.75} />
        ))}
        <path d={snowPath} fill={P.snow} />
        <g clipPath={`url(#ms${id})`}>
          <path d={snowPath} fill={P.snowShade} />
        </g>
        {marks.length ? (
          <g>
            <defs>
              <clipPath id={`mf${id}`}>
                <path d={snowPath} />
              </clipPath>
            </defs>
            <g clipPath={`url(#mf${id})`}>
              {marks.map((d, i) => (
                <path key={`w${i}`} d={d} fill={P.sastrugi} />
              ))}
            </g>
          </g>
        ) : null}
        <g clipPath={`url(#ml${id})`}>
          {g.map((pts, i) => (
            <path key={i} d={smooth(pts, true, 0.5)} fill={P.snow} />
          ))}
          <path d={outline} fill="none" stroke={P.rockLit} strokeWidth={Math.max(2, h / 30)} />
        </g>
        {CORNICES.map(([cx, cy], i) => (
          <path key={i} d={`M${(cx - 5) * s} ${(cy + 1) * s}q${3 * s} ${-9 * s} ${10 * s} ${-6 * s}q${-4 * s} ${1 * s} ${-3 * s} ${5 * s}z`} fill={P.snow} />
        ))}
        {CAVES.map(([cx, cy], i) => {
          const open = eyes === 'open';
          return (
            <g key={i}>
              <ellipse cx={cx * s} cy={cy * s} rx={4.4 * s} ry={(open ? 3.6 : 2.3) * s} fill={eyes === 'none' ? P.rockShade : '#15161F'} />
              {eyes === 'glint' ? <circle cx={(cx + 1.4) * s} cy={(cy - 0.6) * s} r={1.4 * s} fill="#FFF3D6" /> : null}
              {eyes === 'sealed' ? <ellipse cx={cx * s} cy={cy * s} rx={4 * s} ry={1.9 * s} fill="#B9D3F0" /> : null}
              {open ? (
                <>
                  <ellipse cx={cx * s} cy={cy * s} rx={3.9 * s} ry={3.1 * s} fill="#FFB547" />
                  <ellipse cx={(cx + 0.5) * s} cy={cy * s} rx={1.6 * s} ry={2.6 * s} fill="#15161F" />
                </>
              ) : null}
            </g>
          );
        })}
        {haze > 0 ? <rect x={-140 * s} y={-120 * s} width={280 * s} height={130 * s} fill={P.sky[3]} opacity={Math.min(0.9, haze)} /> : null}
      </g>
      )}
      {line ? <path d={edge} fill="none" stroke={P.line} strokeWidth={Math.max(1.5, h / 120)} strokeLinejoin="round" strokeLinecap="round" /> : null}
      {rim > 0 ? (
        <path d={edge} fill="none" stroke="#FFB547" strokeWidth={Math.max(3, h / 60)} strokeDasharray={9000} strokeDashoffset={9000 * (1 - rim)} strokeLinejoin="round" strokeLinecap="round" />
      ) : null}
      {plume >= 0 && plume <= 1 ? (
        <g opacity={plume < 0.8 ? 1 : 1 - (plume - 0.8) / 0.2}>
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={`d${i}`} cx={(-10 - plume * (26 + i * 18)) * s} cy={(-104 - i * 4 - plume * 10) * s} r={(7 + plume * 14 + i * 3) * s} fill={P.snowShade} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={(-10 - plume * (26 + i * 18)) * s} cy={(-106.5 - i * 4 - plume * 10) * s} r={(6.4 + plume * 13 + i * 3) * s} fill={P.snow} />
          ))}
        </g>
      ) : null}
    </g>
  );
};

// ─── the snow plain ────────────────────────────────────────────────────────
/**
 * `travel` = how far the camera has moved along the ground, measured at `feetY` (the depth where the
 * characters stand). Nearer ground moves faster, farther ground slower, and at `feetY` it moves
 * exactly `travel`, so a planted foot stays planted.
 */
export const FlatGround: React.FC<{
  id: string;
  P: WorldPalette;
  horizon: number;
  feetY: number;
  travel?: number;
  t: number;
  seed?: string;
  bottom?: number;
  sparkle?: boolean;
  drifts?: boolean;
  /** world x of the left edge of what the camera sees (the snow is laid out around it) */
  x0?: number;
  /** the camera circles the figure at feetY: the ground there stays put, farther ground slides */
  orbit?: boolean;
}> = ({P, horizon, feetY, travel = 0, t, seed = 'g', bottom = H, sparkle = true, drifts = true, x0 = 0, orbit = false}) => {
  const k = (y: number) => {
    const v = (y - horizon) / Math.max(1, feetY - horizon);
    return orbit ? 1 - v : v;
  };
  // marks repeat every `span` px of world, laid out over a window that starts left of the view
  const span = 3200;
  const lo = x0 - 600;
  const wrap = (x: number) => lo + ((((x - lo) % span) + span) % span);
  const strokes = new Array(120).fill(0).map((_, i) => {
    const depth = Math.pow(random(`${seed}d${i}`), 1.6);
    const y = horizon + 4 + depth * (bottom - horizon);
    const len = 12 + depth * 240 * (0.5 + random(`${seed}l${i}`));
    const th = 0.8 + depth * 5;
    const x = wrap(random(`${seed}x${i}`) * span - travel * k(y));
    return `M${x.toFixed(1)} ${y.toFixed(1)}Q${(x + len * 0.45).toFixed(1)} ${(y - th).toFixed(1)} ${(x + len).toFixed(1)} ${y.toFixed(1)}Q${(x + len * 0.5).toFixed(1)} ${(y + th * 0.4).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}Z`;
  });
  const bands = drifts
    ? [0.14, 0.4, 0.72].map((u, i) => {
        const y = horizon + Math.pow(u, 1.5) * (bottom - horizon);
        const thick = 5 + u * 36;
        const pts: Pt[] = [];
        for (let xx = Math.floor((x0 - 700) / 60) * 60; xx <= x0 + W / 0.8 + 700; xx += 60) pts.push([xx, y + fbm1((xx + travel * k(y)) / 420, `${seed}dr${i}`) * thick]);
        const lower = pts.map(([px, py]) => [px, py + thick * (0.6 + 0.4 * fbm1(px / 300 + 7, `${seed}dl${i}`))] as Pt).reverse();
        return smooth([...pts, ...lower], true, 0.4);
      })
    : [];
  return (
    <g>
      <rect x={x0 - 800} y={horizon} width={W / 0.8 + 1600} height={bottom - horizon + 600} fill={P.snow} />
      <rect x={x0 - 800} y={horizon} width={W / 0.8 + 1600} height={16} fill={P.snowShade} opacity={0.5} />
      {bands.map((d, i) => (
        <path key={i} d={d} fill={P.snowShade} opacity={0.45} />
      ))}
      {strokes.map((d, i) => (
        <path key={i} d={d} fill={P.sastrugi} />
      ))}
      {sparkle
        ? new Array(30).fill(0).map((_, i) => {
            const y = horizon + 10 + Math.pow(random(`${seed}qy${i}`), 1.4) * (bottom - horizon - 20);
            const x = wrap(random(`${seed}qx${i}`) * span - travel * k(y));
            const on = Math.sin(t * (2 + random(`${seed}qt${i}`) * 3) + i * 1.7) > 0.55;
            const r = 1.5 + random(`${seed}qr${i}`) * 2.5;
            return on ? <path key={i} d={`M${x} ${y - r * 2.2}L${x + r * 0.45} ${y - r * 0.45}L${x + r * 2.2} ${y}L${x + r * 0.45} ${y + r * 0.45}L${x} ${y + r * 2.2}L${x - r * 0.45} ${y + r * 0.45}L${x - r * 2.2} ${y}L${x - r * 0.45} ${y - r * 0.45}Z`} fill={P.sparkle} /> : null;
          })
        : null}
    </g>
  );
};

/**
 * A footprint in the snow, seen from the side and above: his three-toed foot pressed in, toes
 * pointing along +x (flip with `dir`). `len` is the foot's length in px.
 */
export const FootPrint: React.FC<{x: number; y: number; len: number; dir?: 1 | -1; P: WorldPalette; opacity?: number}> = ({x, y, len, dir = 1, P, opacity = 1}) => {
  const L = len;
  const h = L * 0.3; // foreshortened
  return (
    <g transform={`translate(${x} ${y}) scale(${dir} 1)`} opacity={opacity}>
      {/* the pressed hollow */}
      <ellipse cx={-L * 0.18} cy={0} rx={L * 0.2} ry={h * 0.42} fill={P.snowShade} />
      <path d={`M${-L * 0.05} ${-h * 0.05}L${L * 0.42} ${-h * 0.5}L${L * 0.46} ${-h * 0.32}L${L * 0.05} ${h * 0.12}Z`} fill={P.snowShade} />
      <path d={`M${-L * 0.02} ${h * 0.02}L${L * 0.52} ${h * 0.02}L${L * 0.52} ${h * 0.2}L${-L * 0.02} ${h * 0.22}Z`} fill={P.snowShade} />
      <path d={`M${-L * 0.05} ${h * 0.1}L${L * 0.4} ${h * 0.55}L${L * 0.36} ${h * 0.7}L${-L * 0.1} ${h * 0.34}Z`} fill={P.snowShade} />
      {/* the far wall of the hollow catches a darker line */}
      <path d={`M${-L * 0.38} ${-h * 0.05}Q${-L * 0.2} ${-h * 0.5} ${0} ${-h * 0.2}`} fill="none" stroke={P.sastrugi} strokeWidth={Math.max(1, L * 0.03)} />
    </g>
  );
};

/** A kick of snow where a foot lands: flat puffs flying out and settling, `u` 0-1 over ~10 frames. */
export const SnowKick: React.FC<{x: number; y: number; u: number; size: number; P: WorldPalette; seed: string}> = ({x, y, u, size, P, seed}) => {
  if (u < 0 || u > 1) return null;
  return (
    <g>
      {new Array(7).fill(0).map((_, i) => {
        const a = Math.PI * (0.1 + 0.8 * random(`${seed}a${i}`));
        const d = size * (0.4 + random(`${seed}d${i}`) * 0.8) * Math.sqrt(u);
        const px = x + Math.cos(a) * d * (random(`${seed}s${i}`) > 0.5 ? 1 : -1);
        const py = y - Math.sin(a) * d * 0.6 + u * u * size * 0.35;
        const r = size * (0.06 + random(`${seed}r${i}`) * 0.06) * (1 - u * 0.6);
        return <circle key={i} cx={px} cy={py} r={r} fill={P.snow} stroke={P.snowShade} strokeWidth={1.2} />;
      })}
    </g>
  );
};

// ─── falling snow ──────────────────────────────────────────────────────────
export const FlatSnow: React.FC<{t: number; n?: number; wind?: number; fall?: number; color?: string; top?: number; bottom?: number; seed?: string; big?: number}> = ({
  t,
  n = 60,
  wind = -40,
  fall = 60,
  color = '#FFFFFF',
  top = 0,
  bottom = H,
  seed = 'sf',
  big = 4,
}) => (
  <g>
    {new Array(n).fill(0).map((_, i) => {
      const depth = random(`${seed}d${i}`);
      const sp = 0.5 + depth * 1.6;
      const span = W + 200;
      const hSpan = bottom - top + 100;
      const x = ((((random(`${seed}x${i}`) * span + t * wind * sp + Math.sin(t * 1.3 + i) * 12) % span) + span) % span) - 100;
      const y = ((((random(`${seed}y${i}`) * hSpan + t * fall * sp) % hSpan) + hSpan) % hSpan) + top - 50;
      return <circle key={i} cx={x} cy={y} r={1.2 + depth * depth * big} fill={color} />;
    })}
  </g>
);
