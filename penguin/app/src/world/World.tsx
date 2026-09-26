import React from 'react';
import {random} from 'remotion';
import {CAVES, CORNICES, cumulus, fbm1, gullies, MOUNTAIN, poly, range, RIDGE, roughen, smooth, SNOWFIELD, type Pt} from '../styles/geometry';
import type {WorldPalette} from './palette';

/**
 * The anime world, as components. Everything is a function of its props and the time, so any shot
 * can be rebuilt from a few numbers: where the horizon is, where the sun is, the palette of the
 * hour, how far the camera has travelled.
 */

export const W = 1920;
export const H = 1080;

type Sun = {x: number; y: number};

// ─── sky ───────────────────────────────────────────────────────────────────
export const Sky: React.FC<{
  id: string;
  P: WorldPalette;
  horizon: number;
  sun?: Sun;
  /** seconds, for cloud drift and star twinkle */
  t: number;
  clouds?: 'cumulus' | 'bands' | 'none';
  seed?: string;
  /** px the camera has panned (clouds drift with a little parallax) */
  pan?: number;
}> = ({id, P, horizon, sun, t, clouds = 'cumulus', seed = 'sky', pan = 0}) => {
  const puffs =
    clouds === 'cumulus'
      ? [0, 1, 2, 3].map((i) => {
          const w = 260 + random(`${seed}w${i}`) * 360;
          const span = W + 900;
          const cx = ((((random(`${seed}x${i}`) * span - pan * 0.08 - t * (6 + i * 3)) % span) + span) % span) - 450;
          const cy = 170 + random(`${seed}y${i}`) * (horizon - 300);
          return {w, puffs: cumulus(cx, cy, w, `${seed}c${i}`, 7 + Math.floor(random(`${seed}n${i}`) * 5))};
        })
      : [];
  return (
    <g>
      <defs>
        <linearGradient id={`sky${id}`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={0} y2={horizon}>
          <stop offset={0} stopColor={P.sky[0]} />
          <stop offset={0.45} stopColor={P.sky[1]} />
          <stop offset={0.82} stopColor={P.sky[2]} />
          <stop offset={1} stopColor={P.sky[3]} />
        </linearGradient>
        {sun ? (
          <radialGradient id={`glow${id}`} gradientUnits="userSpaceOnUse" cx={sun.x} cy={sun.y} r={520}>
            <stop offset={0} stopColor={P.glow} stopOpacity={0.9} />
            <stop offset={0.3} stopColor={P.glow} stopOpacity={0.35} />
            <stop offset={1} stopColor={P.glow} stopOpacity={0} />
          </radialGradient>
        ) : null}
      </defs>
      <rect x={-400} y={-400} width={W + 800} height={horizon + 460} fill={`url(#sky${id})`} />
      {P.stars > 0
        ? new Array(140).fill(0).map((_, i) => {
            const x = random(`${seed}sx${i}`) * W;
            const y = Math.pow(random(`${seed}sy${i}`), 1.4) * (horizon - 40);
            const tw = 0.55 + 0.45 * Math.sin(t * (1.5 + random(`${seed}st${i}`) * 3) + i);
            const r = 0.8 + random(`${seed}sr${i}`) * 1.6;
            return <circle key={i} cx={x} cy={y} r={r} fill="#FFFFFF" opacity={P.stars * tw * (1 - y / horizon)} />;
          })
        : null}
      {sun ? <rect x={-400} y={-400} width={W + 800} height={horizon + 460} fill={`url(#glow${id})`} /> : null}
      {puffs.map((c, j) => (
        <g key={j}>
          {c.puffs.map((p, i) => (
            <circle key={`s${i}`} cx={p.x + 6} cy={p.y + 10} r={p.r} fill={P.cloudShade} />
          ))}
          {c.puffs.map((p, i) => (
            <circle key={`w${i}`} cx={p.x} cy={p.y} r={p.r} fill={P.cloud} />
          ))}
          {c.puffs.map((p, i) => (
            <circle key={`h${i}`} cx={p.x - p.r * 0.1} cy={p.y + p.r * 0.35} r={p.r * 0.72} fill={P.cloudShade} opacity={0.55} />
          ))}
          {c.puffs.map((p, i) => (
            <circle key={`t${i}`} cx={p.x - p.r * 0.05} cy={p.y - p.r * 0.12} r={p.r * 0.86} fill={P.cloud} />
          ))}
        </g>
      ))}
      {clouds === 'bands'
        ? [0, 1, 2].map((i) => (
            <rect key={i} x={-200 + random(`${seed}b${i}`) * 900 - pan * 0.05} y={horizon - 140 - i * 70} width={700 + random(`${seed}bw${i}`) * 600} height={18 + i * 6} rx={14} fill={P.cloud} opacity={0.7} />
          ))
        : null}
      {sun && sun.y < horizon ? (
        <>
          <circle cx={sun.x} cy={sun.y} r={90} fill={P.glow} opacity={0.35} />
          <circle cx={sun.x} cy={sun.y} r={38} fill={P.sun} />
        </>
      ) : null}
    </g>
  );
};

// ─── distant ranges ────────────────────────────────────────────────────────
export const Ranges: React.FC<{P: WorldPalette; horizon: number; pan?: number; seed?: string}> = ({P, horizon, pan = 0, seed = 'r'}) => {
  const far = range(horizon + 1, 30, `${seed}far`, -300 - pan * 0.02, 2220 - pan * 0.02);
  const mid = range(horizon + 2, 16, `${seed}mid`, -300 - pan * 0.05, 2220 - pan * 0.05, 10);
  return (
    <g>
      <path d={poly(far.map(([x, y]) => [x + pan * 0.02, y] as Pt))} fill={P.range[0]} />
      <path d={poly(mid.map(([x, y]) => [x + pan * 0.05, y] as Pt))} fill={P.range[1]} />
    </g>
  );
};

// ─── the creator, asleep ───────────────────────────────────────────────────
export type EyeLook = 'none' | 'glint' | 'sealed' | 'open';

export const Mountain: React.FC<{
  id: string;
  P: WorldPalette;
  x: number;
  y: number;
  h: number;
  sun?: Sun;
  /** 0-1 atmospheric haze (distance) */
  haze?: number;
  eyes?: EyeLook;
  /** 0-1 gold rim drawing on (S49) */
  rim?: number;
  /** 0-1 breath plume progress, <0 none */
  plume?: number;
  /** mirror (it turns inland at the end) */
  flip?: number;
  detail?: number;
}> = ({id, P, x, y, h, sun, haze = 0, eyes = 'none', rim = 0, plume = -1, flip = 1}) => {
  const s = h / 100;
  const out = roughen(MOUNTAIN, s, 'mtn', 1.8);
  const snow = roughen(SNOWFIELD, s, 'snow', 2.6, 1.6);
  const ridge = RIDGE.map(([rx, ry]) => [rx * s, ry * s] as Pt);
  const lightRight = !sun || sun.x * flip >= x * flip;
  const shadeSide: Pt[] = lightRight
    ? [...ridge, [-130 * s, 0], [-130 * s, -115 * s], [-10 * s, -115 * s]]
    : [...ridge, [130 * s, 0], [130 * s, -115 * s], [-10 * s, -115 * s]];
  const litSide: Pt[] = lightRight
    ? [...ridge, [130 * s, 0], [130 * s, -115 * s], [-10 * s, -115 * s]]
    : [...ridge, [-130 * s, 0], [-130 * s, -115 * s], [-10 * s, -115 * s]];
  const outline = smooth(out, true, 0.3);
  const snowPath = smooth(snow, true, 0.35);
  const g = gullies(s, 'gul', 10);
  const lw = Math.max(1, Math.min(2.2, h / 90));
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
        <linearGradient id={`hz${id}`} gradientUnits="userSpaceOnUse" x1={0} y1={-h} x2={0} y2={0}>
          <stop offset={0} stopColor={P.sky[3]} stopOpacity={haze * 0.35} />
          <stop offset={1} stopColor={P.sky[3]} stopOpacity={Math.min(1, haze * 1.05)} />
        </linearGradient>
      </defs>
      <path d={outline} fill={P.rock} />
      <g clipPath={`url(#mc${id})`}>
        <g clipPath={`url(#ms${id})`}>
          <rect x={-140 * s} y={-120 * s} width={280 * s} height={130 * s} fill={P.rockShade} />
        </g>
        <path d={snowPath} fill={P.snow} />
        <g clipPath={`url(#ms${id})`}>
          <path d={snowPath} fill={P.snowShade} />
        </g>
        <g clipPath={`url(#ml${id})`}>
          {g.map((pts, i) => (
            <path key={i} d={smooth(pts, true, 0.5)} fill={P.snow} />
          ))}
        </g>
        {CORNICES.map(([cx, cy], i) => (
          <path key={i} d={`M${(cx - 5) * s} ${(cy + 1) * s}q${3 * s} ${-9 * s} ${10 * s} ${-6 * s}q${-4 * s} ${1 * s} ${-3 * s} ${5 * s}z`} fill={P.snow} />
        ))}
        {CAVES.map(([cx, cy], i) => {
          const open = eyes === 'open';
          return (
            <g key={i}>
              <ellipse cx={cx * s} cy={cy * s} rx={4.4 * s} ry={(open ? 3.6 : 2.3) * s} fill={eyes === 'none' ? P.rockShade : '#15161F'} opacity={eyes === 'none' ? 0.8 : 1} />
              {eyes === 'glint' ? <circle cx={(cx + 1.4) * s} cy={(cy - 0.6) * s} r={1.4 * s} fill="#FFF3D6" /> : null}
              {eyes === 'sealed' ? <ellipse cx={cx * s} cy={cy * s} rx={4 * s} ry={1.9 * s} fill="#B9D3F0" opacity={0.85} /> : null}
              {open ? (
                <>
                  <ellipse cx={cx * s} cy={cy * s} rx={3.9 * s} ry={3.1 * s} fill="#FFB547" />
                  <ellipse cx={(cx + 0.5) * s} cy={cy * s} rx={1.6 * s} ry={2.6 * s} fill="#15161F" />
                </>
              ) : null}
            </g>
          );
        })}
        {haze > 0 ? <rect x={-140 * s} y={-120 * s} width={280 * s} height={130 * s} fill={`url(#hz${id})`} /> : null}
      </g>
      {/* line and rim light */}
      <g clipPath={`url(#ml${id})`}>
        <path d={outline} fill="none" stroke={P.rockLit} strokeWidth={lw * 2.5} opacity={1 - haze * 0.6} />
      </g>
      <path d={outline} fill="none" stroke={P.line} strokeWidth={lw} strokeLinejoin="round" opacity={1 - haze * 0.7} />
      {rim > 0 ? (
        <path d={outline} fill="none" stroke="#FFB547" strokeWidth={lw * 3} strokeDasharray={9000} strokeDashoffset={9000 * (1 - rim)} strokeLinejoin="round" />
      ) : null}
      {plume >= 0 && plume <= 1 ? (
        <g opacity={Math.sin(Math.PI * Math.min(1, plume * 1.4))}>
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={(-10 - plume * (26 + i * 18)) * s} cy={(-106 - i * 4 - plume * 10) * s} r={(7 + plume * 14 + i * 3) * s} fill={P.cloud} stroke={P.cloudShade} strokeWidth={lw * 0.8} />
          ))}
        </g>
      ) : null}
    </g>
  );
};

// ─── the snow plain ────────────────────────────────────────────────────────
/**
 * `travel` = how far the camera has moved along the ground, measured at `feetY` (the depth where
 * the characters stand). Nearer ground moves faster, farther ground slower, as in a real tracking
 * shot, and at `feetY` it moves exactly `travel`, so a planted foot stays planted.
 */
export const Ground: React.FC<{
  id: string;
  P: WorldPalette;
  horizon: number;
  feetY: number;
  travel?: number;
  sun?: Sun;
  t: number;
  seed?: string;
  bottom?: number;
  sparkle?: boolean;
}> = ({id, P, horizon, feetY, travel = 0, sun, t, seed = 'g', bottom = H, sparkle = true}) => {
  const k = (y: number) => (y - horizon) / Math.max(1, feetY - horizon);
  const span = W + 1200;
  const wrap = (x: number) => ((((x) % span) + span) % span) - 600;
  const strokes = new Array(150).fill(0).map((_, i) => {
    const depth = Math.pow(random(`${seed}d${i}`), 1.6);
    const y = horizon + 3 + depth * (bottom - horizon);
    const len = 12 + depth * 280 * (0.5 + random(`${seed}l${i}`));
    const th = 0.6 + depth * 5;
    const x = wrap(random(`${seed}x${i}`) * span - travel * k(y));
    const bend = (random(`${seed}b${i}`) - 0.5) * 6 * (0.4 + depth);
    return {
      d: `M${x.toFixed(1)} ${y.toFixed(1)}Q${(x + len * 0.45).toFixed(1)} ${(y - th + bend).toFixed(1)} ${(x + len).toFixed(1)} ${(y + bend * 0.3).toFixed(1)}Q${(x + len * 0.5).toFixed(1)} ${(y + th * 0.35 + bend * 0.5).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}Z`,
      depth,
    };
  });
  // long drift shadows across the plain, at a few depths
  const drifts = [0.18, 0.42, 0.7, 0.95].map((u, i) => {
    const y = horizon + Math.pow(u, 1.5) * (bottom - horizon);
    const thick = 6 + u * 44;
    const pts: Pt[] = [];
    for (let xx = -700; xx <= W + 700; xx += 60) {
      pts.push([xx, y + fbm1((xx + travel * k(y)) / 420, `${seed}dr${i}`) * thick]);
    }
    const lower = pts.map(([px, py]) => [px, py + thick * (0.6 + 0.4 * fbm1(px / 300 + 7, `${seed}dl${i}`))] as Pt).reverse();
    return smooth([...pts, ...lower], true, 0.4);
  });
  return (
    <g>
      <defs>
        <linearGradient id={`gd${id}`} gradientUnits="userSpaceOnUse" x1={0} y1={horizon} x2={0} y2={bottom}>
          <stop offset={0} stopColor={P.snowShade} stopOpacity={0.55} />
          <stop offset={0.25} stopColor={P.snow} />
          <stop offset={1} stopColor={P.snow} />
        </linearGradient>
        {sun ? (
          <radialGradient id={`gl${id}`} gradientUnits="userSpaceOnUse" cx={sun.x} cy={horizon + 40} r={900}>
            <stop offset={0} stopColor={P.glow} stopOpacity={0.45} />
            <stop offset={1} stopColor={P.glow} stopOpacity={0} />
          </radialGradient>
        ) : null}
      </defs>
      <rect x={-400} y={horizon} width={W + 800} height={bottom - horizon + 400} fill={P.snow} />
      <rect x={-400} y={horizon} width={W + 800} height={bottom - horizon + 400} fill={`url(#gd${id})`} />
      {sun ? <rect x={-400} y={horizon} width={W + 800} height={bottom - horizon + 400} fill={`url(#gl${id})`} /> : null}
      {drifts.map((d, i) => (
        <path key={i} d={d} fill={P.snowShade} opacity={0.55} />
      ))}
      {strokes.map((s, i) => (
        <path key={i} d={s.d} fill={P.sastrugi} opacity={0.6 + s.depth * 0.4} />
      ))}
      {sparkle && sun
        ? new Array(46).fill(0).map((_, i) => {
            const y = horizon + 10 + Math.pow(random(`${seed}qy${i}`), 1.4) * (bottom - horizon - 20);
            const x = wrap(random(`${seed}qx${i}`) * span - travel * k(y));
            const on = Math.max(0, Math.sin(t * (2 + random(`${seed}qt${i}`) * 3) + i * 1.7));
            const r = (1.5 + random(`${seed}qr${i}`) * 3) * on;
            if (r < 0.3) return null;
            return <path key={i} d={`M${x} ${y - r * 2.2}L${x + r * 0.4} ${y - r * 0.4}L${x + r * 2.2} ${y}L${x + r * 0.4} ${y + r * 0.4}L${x} ${y + r * 2.2}L${x - r * 0.4} ${y + r * 0.4}L${x - r * 2.2} ${y}L${x - r * 0.4} ${y - r * 0.4}Z`} fill={P.sparkle} />;
          })
        : null}
    </g>
  );
};

// ─── falling snow ──────────────────────────────────────────────────────────
export const Snowfall: React.FC<{t: number; n?: number; wind?: number; fall?: number; color?: string; top?: number; bottom?: number; seed?: string; big?: number}> = ({
  t,
  n = 70,
  wind = -40,
  fall = 60,
  color = '#FFFFFF',
  top = 0,
  bottom = H,
  seed = 'sf',
  big = 4.5,
}) => (
  <g>
    {new Array(n).fill(0).map((_, i) => {
      const depth = random(`${seed}d${i}`);
      const sp = 0.5 + depth * 1.6;
      const span = W + 200;
      const hSpan = bottom - top + 100;
      const x = ((((random(`${seed}x${i}`) * span + t * wind * sp + Math.sin(t * 1.3 + i) * 12) % span) + span) % span) - 100;
      const y = ((((random(`${seed}y${i}`) * hSpan + t * fall * sp) % hSpan) + hSpan) % hSpan) + top - 50;
      const r = 1.1 + depth * depth * big;
      return <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={0.75 + depth * 0.25} />;
    })}
  </g>
);

/** Letterbox bars for his film (2.39:1). `open` 0-1 slides them off. */
export const LetterboxBars: React.FC<{open?: number}> = ({open = 0}) => {
  const bar = ((H - W / 2.39) / 2) * (1 - open);
  return (
    <>
      <rect x={0} y={0} width={W} height={bar} fill="#000" />
      <rect x={0} y={H - bar} width={W} height={bar} fill="#000" />
    </>
  );
};
