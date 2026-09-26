import React from 'react';
import {Easing, interpolate, random} from 'remotion';
import {FONT_DISPLAY} from '../fonts';
import {mixHex, type WorldPalette} from '../world/palette';

/**
 * Everything else in the film, in the flat 2D look: flat fills, hard edges, one ink line where a
 * shape needs separating. Colors come from the scene's palette, so each prop is lit like its shot.
 */

export const CREATOR_GOLD = '#FFB547';
const GOLD_DEEP = '#E8892B';

/** How far figures and props sink into the scene's light (night turns whites blue-grey). */
export const dimOf = (P: WorldPalette) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(P.snow.slice(i, i + 2), 16) / 255);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return Math.max(0, Math.min(0.5, (0.95 - lum) * 1.2));
};
export const tint = (c: string, P: WorldPalette, k = dimOf(P)) => (k > 0 ? mixHex(c, P.snowShade, k) : c);

// the animatic's blocking colors, and what they are in the film
const TRAMPLED = '#C8CFD5';
const ROCK = '#5B5F66';
const ROCK_DARK = '#4E5259';
const SEA = '#4B6275';
const PAPER = '#F7F7F0';
const WASH_ICE = '#7FB3D5';
const BEAK = '#C9D2DA';

export const trampledOf = (P: WorldPalette) => mixHex(P.snow, P.snowShade, 0.42);
export const iceOf = (P: WorldPalette) => mixHex(P.snowShade, '#7FB3D5', 0.45);
export const seaOf = (P: WorldPalette) => mixHex(P.range[1], '#1E3550', 0.55);

/** A blocking fill as a scene color. */
export const fillOf = (fill: string, P: WorldPalette, stroked = false): string => {
  switch (fill.toUpperCase()) {
    case TRAMPLED:
      return trampledOf(P);
    case ROCK:
      return P.rock;
    case ROCK_DARK:
      return P.rockShade;
    case SEA:
      return seaOf(P);
    case PAPER:
      return stroked ? tint('#FBF8F2', P) : P.snow;
    case '#F3E4DF':
    case '#F1DFD2':
      return P.snow;
    case WASH_ICE:
      return iceOf(P);
    case BEAK:
      return mixHex(P.snowShade, P.rockLit, 0.18);
    case '#3E4148':
      return P.rockShade;
    case '#6A7883':
      return P.snow;
    case '#FFFFFF':
      return P.cloud;
    default:
      return fill;
  }
};

const pathOf = (pts: number[][]) => `M${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L')}Z`;

/** A rock face: flat rock, darker strata, snow caught on the ledges, an ink edge. */
export const RockFace: React.FC<{id: string; pts: number[][]; P: WorldPalette; fill?: string; seed?: string; line?: boolean}> = ({id, pts, P, fill, seed = 'rk', line = true}) => {
  const d = pathOf(pts);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs);
  const y0 = Math.min(...ys);
  const w = Math.max(...xs) - x0;
  const h = Math.max(...ys) - y0;
  const n = Math.max(8, Math.min(46, Math.round((w * h) / 70000)));
  const base = fill ?? P.rock;
  const lens = (cx: number, cy: number, len: number, th: number, ang: number) => {
    const r = (ang * Math.PI) / 180;
    const c = Math.cos(r);
    const s = Math.sin(r);
    const p = (u: number, v: number) => `${(cx + u * c - v * s).toFixed(1)} ${(cy + u * s + v * c).toFixed(1)}`;
    return `M${p(-len / 2, 0)}Q${p(0, -th)} ${p(len / 2, 0)}Q${p(0, th * 0.35)} ${p(-len / 2, 0)}Z`;
  };
  return (
    <g>
      <defs>
        <clipPath id={`rf${id}`}>
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill={base} />
      <g clipPath={`url(#rf${id})`}>
        {new Array(n).fill(0).map((_, i) => {
          const cx = x0 + random(`${seed}x${i}`) * w;
          const cy = y0 + random(`${seed}y${i}`) * h;
          const len = 90 + random(`${seed}l${i}`) * 300;
          const th = 10 + random(`${seed}t${i}`) * 22;
          return <path key={`s${i}`} d={lens(cx, cy, len, th, -14 + random(`${seed}a${i}`) * 10)} fill={P.rockShade} />;
        })}
        {new Array(Math.round(n * 0.7)).fill(0).map((_, i) => {
          const cx = x0 + random(`${seed}X${i}`) * w;
          const cy = y0 + random(`${seed}Y${i}`) * h;
          const len = 40 + random(`${seed}L${i}`) * 150;
          const th = 5 + random(`${seed}T${i}`) * 9;
          return (
            <g key={`l${i}`}>
              <path d={lens(cx, cy + th * 0.5, len * 1.05, th * 0.8, -8)} fill={P.rockShade} />
              <path d={lens(cx, cy, len, th, -8)} fill={P.snow} />
            </g>
          );
        })}
      </g>
      {line ? <path d={d} fill="none" stroke={P.line} strokeWidth={3} strokeLinejoin="round" /> : null}
    </g>
  );
};

/** Trampled snow round the colony: flat grey-white, pocked with prints. */
export const Trampled: React.FC<{id: string; pts: number[][]; P: WorldPalette; seed?: string}> = ({id, pts, P, seed = 'tr'}) => {
  const d = pathOf(pts);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs);
  const y0 = Math.min(...ys);
  const w = Math.max(...xs) - x0;
  const h = Math.max(...ys) - y0;
  const n = Math.min(260, Math.round((w * h) / 5000));
  return (
    <g>
      <defs>
        <clipPath id={`tp${id}`}>
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill={trampledOf(P)} />
      <g clipPath={`url(#tp${id})`}>
        {new Array(n).fill(0).map((_, i) => {
          const cx = x0 + random(`${seed}x${i}`) * w;
          const cy = y0 + random(`${seed}y${i}`) * h;
          const depth = (cy - y0) / Math.max(1, h);
          const r = 3 + depth * 9 + random(`${seed}r${i}`) * 4;
          return <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.36} fill={P.snowShade} opacity={0.8} />;
        })}
      </g>
    </g>
  );
};

/** The director's clipboard, held up to the lens. */
export const Clipboard: React.FC<{x: number; y: number; w: number; h: number; text: string; since: number; P: WorldPalette}> = ({x, y, w, h, text, since, P}) => {
  const rise = interpolate(since, [0, 5], [60, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.4))});
  const words = text.split(' ');
  const lines: string[] = [];
  for (const wd of words) {
    const last = lines[lines.length - 1];
    if (last && (last + ' ' + wd).length <= 14) lines[lines.length - 1] = last + ' ' + wd;
    else lines.push(wd);
  }
  const fs = Math.min(h / (lines.length * 1.25 + 0.6), w / 8.2);
  const ink = '#1D2133';
  return (
    <g transform={`translate(${x},${y + rise}) rotate(-4, ${w / 2}, ${h / 2})`}>
      <rect x={-18} y={-26} width={w + 36} height={h + 52} rx={10} fill={tint('#9A7449', P)} stroke={ink} strokeWidth={3} />
      <rect x={-18} y={h + 10} width={w + 36} height={16} rx={6} fill={tint('#7E5C36', P)} />
      <rect x={0} y={0} width={w} height={h} fill={tint('#FFFFFF', P)} stroke={ink} strokeWidth={2} />
      <rect x={w / 2 - 50} y={-34} width={100} height={24} rx={6} fill={tint('#B9BCC0', P)} stroke={ink} strokeWidth={2.5} />
      {lines.map((ln, j) => (
        <text key={j} x={w / 2} y={h / 2 + (j - (lines.length - 1) / 2) * fs * 1.2 + fs * 0.35} textAnchor="middle" fontFamily={FONT_DISPLAY} fontWeight={800} fontSize={fs} fill={ink} style={{fontStretch: '80%'}}>
          {ln}
        </text>
      ))}
    </g>
  );
};

/** The boom mic dipping into frame: a pole and a furry windshield. */
export const BoomMic: React.FC<{x: number; y: number; P: WorldPalette}> = ({x, y, P}) => {
  const ink = '#1D2133';
  const fur = tint('#A9A49A', P);
  const furDark = tint('#8C877D', P);
  return (
    <g>
      <line x1={x + 300} y1={-300} x2={x + 40} y2={y + 20} stroke={ink} strokeWidth={14} strokeLinecap="round" />
      <line x1={x + 300} y1={-300} x2={x + 40} y2={y + 20} stroke={tint('#4A4F5A', P)} strokeWidth={8} strokeLinecap="round" />
      <rect x={x - 115} y={y - 18} width={230} height={96} rx={48} fill={fur} stroke={ink} strokeWidth={3} />
      <rect x={x - 115} y={y + 40} width={230} height={38} rx={19} fill={furDark} />
      {new Array(22).fill(0).map((_, j) => {
        const px = x - 104 + j * 10;
        return <path key={j} d={`M${px} ${y + 74}l${-3 + (j % 3)} ${9 + (j % 4) * 2}`} stroke={furDark} strokeWidth={3} strokeLinecap="round" />;
      })}
    </g>
  );
};

/** The crew's camp at night: a dome tent, a crate, a lamp on a pole and its cone of light. */
export const Camp: React.FC<{x: number; y: number; s: number; P: WorldPalette}> = ({x, y, s, P}) => {
  const ink = '#1D2133';
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <polygon points="248,-300 -700,120 -200,160 272,-300" fill="#FFF3C8" opacity={0.16} />
      <ellipse cx={-120} cy={140} rx={420} ry={60} fill="#FFF3C8" opacity={0.12} />
      <path d="M -170 0 Q 0 -200 170 0 Z" fill={tint('#4F8A5E', P, 0.3)} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
      <path d="M -170 0 Q -60 -150 20 -178 Q -40 -120 -60 0 Z" fill={tint('#3C6E4A', P, 0.3)} />
      <path d="M -58 0 Q 0 -84 58 0 Z" fill={tint('#1F3326', P, 0.2)} stroke={ink} strokeWidth={2.5} />
      <line x1={260} y1={0} x2={260} y2={-282} stroke={ink} strokeWidth={9} />
      <rect x={230} y={-324} width={60} height={42} rx={4} fill="#FFF6DC" stroke={ink} strokeWidth={3} />
      <rect x={-340} y={-46} width={140} height={46} fill={tint('#8A6440', P, 0.3)} stroke={ink} strokeWidth={3} />
      <line x1={-340} y1={-23} x2={-200} y2={-23} stroke={ink} strokeWidth={2} />
    </g>
  );
};

/** The blizzard: a grey veil and flat white streaks driven across; `part` 0-1 sweeps them aside. */
export const Storm: React.FC<{t: number; density: number; part: number; P: WorldPalette; x0: number; y0: number}> = ({t, density, part, P, x0, y0}) => {
  const n = Math.round(170 * density);
  return (
    <g opacity={1 - part * 0.9}>
      <rect x={x0 - 3000} y={y0 - 3000} width={9000} height={9000} fill={P.cloud} opacity={0.2 * density * (1 - part)} />
      {new Array(n).fill(0).map((_, j) => {
        const sp = 30 + random(`st${j}`) * 40;
        const x = x0 - 240 + ((((random(`sx${j}`) * 2600 - t * sp * 30) % 2600) + 2600) % 2600);
        const y = y0 - 160 + ((((random(`sy${j}`) * 1500 + t * sp * 8) % 1500) + 1500) % 1500);
        const side = part > 0 ? (x - x0 < 960 ? -1 : 1) * part * 1500 : 0;
        const w = 2 + random(`sw${j}`) * 4;
        return <path key={j} d={`M${x + side} ${y}l${-40 - sp} ${10}l${2} ${w}Z`} fill="#FFFFFF" opacity={0.85} />;
      })}
    </g>
  );
};

/** The aurora as flat curtains: a few translucent bands with hanging rays. */
export const Aurora: React.FC<{t: number; fold: number; faint?: boolean}> = ({t, fold, faint}) => {
  const o = (faint ? 0.35 : 0.8) * (1 - fold * 0.85);
  const bands = [
    {c: '#6FD3B0', y: 170, a: 70, w: 110},
    {c: '#4AA9B8', y: 250, a: 55, w: 80},
    {c: '#8B7FD6', y: 320, a: 45, w: 60},
  ];
  return (
    <g opacity={o} transform={`translate(0,${fold * 420}) scale(1,${1 - fold * 0.7})`}>
      {bands.map((b, j) => {
        const top: string[] = [];
        const bot: string[] = [];
        for (let x = -200; x <= 2120; x += 40) {
          const yy = b.y + Math.sin(x / 330 + t * 0.5 + j) * b.a + Math.sin(x / 120 - t * 0.9) * 12;
          top.push(`${x} ${yy.toFixed(1)}`);
          bot.unshift(`${x} ${(yy + b.w + Math.sin(x / 90 + t + j) * 18).toFixed(1)}`);
        }
        return (
          <g key={j}>
            <path d={`M${top.join('L')}L${bot.join('L')}Z`} fill={b.c} opacity={0.42} />
            {new Array(26).fill(0).map((_, i) => {
              const x = -100 + i * 85 + Math.sin(t * 0.7 + i) * 10;
              const yy = b.y + Math.sin(x / 330 + t * 0.5 + j) * b.a;
              return <rect key={i} x={x} y={yy} width={10 + (i % 3) * 6} height={b.w * (0.8 + (i % 4) * 0.25)} fill={b.c} opacity={0.3} />;
            })}
          </g>
        );
      })}
    </g>
  );
};

/** A four-point star glint (the mountain's eye catching the light). */
export const Glint: React.FC<{x: number; y: number; r: number; u: number}> = ({x, y, r, u}) => {
  const k = Math.sin(Math.PI * Math.min(1, u));
  const R = r * 2.4 * k;
  const w = r * 0.35 * k;
  return (
    <g>
      <circle cx={x} cy={y} r={r * 1.4 * k} fill="#FFF3D6" opacity={0.45} />
      <path d={`M${x} ${y - R}L${x + w} ${y - w}L${x + R} ${y}L${x + w} ${y + w}L${x} ${y + R}L${x - w} ${y + w}L${x - R} ${y}L${x - w} ${y - w}Z`} fill="#FFFFFF" />
    </g>
  );
};

/** Light as flat rings: a few translucent discs, no blur. */
export const FlatGlow: React.FC<{x: number; y: number; r: number; color: string; u: number}> = ({x, y, r, color, u}) => {
  if (u <= 0) return null;
  const R = r * (0.4 + 0.6 * u);
  return (
    <g>
      <circle cx={x} cy={y} r={R} fill={color} opacity={0.07 * u} />
      <circle cx={x} cy={y} r={R * 0.62} fill={color} opacity={0.09 * u} />
      <circle cx={x} cy={y} r={R * 0.3} fill={color} opacity={0.12 * u} />
    </g>
  );
};

/** A headlamp: a small hard light with a halo. */
export const Headlamp: React.FC<{x: number; y: number; r: number; u: number}> = ({x, y, r, u}) =>
  u <= 0 ? null : (
    <g>
      <circle cx={x} cy={y} r={r * 0.55} fill="#FFF6DC" opacity={0.12 * u} />
      <circle cx={x} cy={y} r={r * 0.28} fill="#FFF6DC" opacity={0.22 * u} />
      <circle cx={x} cy={y} r={r * 0.09} fill="#FFFDF2" opacity={u} />
    </g>
  );

/** A sun disc with flat rings. */
export const SunDisc: React.FC<{x: number; y: number; r: number; P: WorldPalette}> = ({x, y, r, P}) => (
  <g>
    <circle cx={x} cy={y} r={r * 3.2} fill={P.glow} opacity={0.2} />
    <circle cx={x} cy={y} r={r * 2} fill={P.glow} opacity={0.32} />
    <circle cx={x} cy={y} r={r} fill={P.sun} />
  </g>
);

/**
 * One of the creator's eyes: his own eye design (gold iris, black pupil, one highlight), huge.
 * `open` 0-1 lifts the lid. Units: size = the eye's width.
 */
export const CreatorEye: React.FC<{size: number; open: number; pupil?: number; lid: string; reflection?: React.ReactNode}> = ({size, open, pupil = 1, lid, reflection}) => {
  const s = size / 120;
  const o = Math.max(0.02, open);
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <g transform={`scale(${s})`}>
      <defs>
        <clipPath id={`ce${id}`}>
          <ellipse cx={0} cy={0} rx={61} ry={43} />
        </clipPath>
      </defs>
      <ellipse cx={0} cy={0} rx={60} ry={42} fill="#2A2018" />
      <ellipse cx={0} cy={0} rx={56} ry={38 * o} fill={CREATOR_GOLD} />
      <ellipse cx={0} cy={4 * o} rx={56} ry={30 * o} fill={GOLD_DEEP} opacity={0.35} />
      <ellipse cx={0} cy={0} rx={22 * pupil} ry={32 * o * pupil} fill="#15161F" />
      {reflection && o > 0.5 ? <g transform={`translate(0 ${10 * pupil})`}>{reflection}</g> : null}
      <ellipse cx={-14} cy={-14 * o} rx={8} ry={6 * o} fill="#FFF6E2" />
      {/* the lid: a flat shape that lifts, inside the eye */}
      <g clipPath={`url(#ce${id})`}>
        <path d={`M -64 ${-46} L 64 ${-46} L 64 ${-42 + 84 * (1 - o)} Q 0 ${-30 + 90 * (1 - o)} -64 ${-42 + 84 * (1 - o)} Z`} fill={lid} />
        <path d={`M -62 ${-42 + 84 * (1 - o)} Q 0 ${-30 + 90 * (1 - o)} 62 ${-42 + 84 * (1 - o)}`} fill="none" stroke="#15161F" strokeWidth={4} strokeLinecap="round" />
      </g>
      <ellipse cx={0} cy={0} rx={60} ry={42} fill="none" stroke="#15161F" strokeWidth={3} />
    </g>
  );
};

/** The ice over the creator's eye, cracking with gold light behind. */
export const IceSeal: React.FC<{x: number; y: number; w: number; h: number; cracks: number[]; P: WorldPalette}> = ({x, y, w, h, cracks, P}) => {
  const ice = iceOf(P);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={mixHex(ice, P.snow, 0.35)} />
      {new Array(9).fill(0).map((_, i) => (
        <path key={i} d={`M${x + random(`ic${i}`) * w} ${y + random(`id${i}`) * h}l${120 + random(`ie${i}`) * 260} ${-40 - random(`if${i}`) * 60}`} stroke={P.snow} strokeWidth={10 + random(`ig${i}`) * 14} strokeLinecap="round" opacity={0.6} />
      ))}
      {cracks.map((u, j) => {
        if (u <= 0) return null;
        const x0 = x + w * (0.25 + j * 0.22);
        const pts = [0, 1, 2, 3, 4, 5].map((q) => `${(x0 + Math.sin(q * 2.3 + j) * 60 * u).toFixed(1)},${(y + (h * q * u) / 5).toFixed(1)}`).join(' ');
        return (
          <g key={j}>
            <polyline points={pts} fill="none" stroke={CREATOR_GOLD} strokeWidth={22} strokeLinejoin="round" opacity={0.55} />
            <polyline points={pts} fill="none" stroke="#FFE3A0" strokeWidth={10} strokeLinejoin="round" />
            <polyline points={pts} fill="none" stroke="#1D2133" strokeWidth={4} strokeLinejoin="round" />
          </g>
        );
      })}
    </g>
  );
};

/** A gold ring spreading over the snow (the greeting). */
export const GoldRing: React.FC<{x: number; y: number; u: number}> = ({x, y, u}) => (
  <g>
    <ellipse cx={x} cy={y} rx={60 + u * 1800} ry={20 + u * 500} fill="none" stroke={CREATOR_GOLD} strokeWidth={18 * Math.max(0, 1 - u * 0.6)} opacity={Math.max(0, 1 - u * 0.5)} />
    <ellipse cx={x} cy={y} rx={40 + u * 1500} ry={14 + u * 420} fill="none" stroke="#FFE3A0" strokeWidth={6 * Math.max(0, 1 - u * 0.6)} opacity={Math.max(0, 1 - u * 0.6)} />
  </g>
);

/** The creator's breath: a bank of flat cloud rolling across. */
export const Breath: React.FC<{u: number; P: WorldPalette}> = ({u, P}) => {
  if (u <= 0 || u >= 1) return null;
  const cx = 2300 - u * 2900;
  const o = Math.sin(Math.PI * u);
  return (
    <g opacity={0.95 * o}>
      {new Array(9).fill(0).map((_, i) => (
        <circle key={i} cx={cx + (i - 4) * 150 + Math.sin(i * 1.9) * 40} cy={760 + Math.cos(i * 2.7) * 80} r={200 + (i % 3) * 60} fill={i % 2 ? P.cloud : mixHex(P.cloud, P.cloudShade, 0.35)} />
      ))}
    </g>
  );
};

/** Chunks of rock (or snow) falling. */
export const Debris: React.FC<{x: number; y: number; starts: number[]; f: number; spread: number; color: string; line: string}> = ({x, y, starts, f, spread, color, line}) => (
  <g>
    {starts.map((a, j) => {
      if (f < a || f > a + 30) return null;
      const u = (f - a) / 30;
      return new Array(8).fill(0).map((_, q) => {
        const r = 7 + random(`dr${j}${q}`) * 10;
        const cx = x + (random(`db${j}${q}`) - 0.5) * spread;
        const cy = y + u * u * 600 + q * 12;
        const rot = u * 300 * (random(`dt${j}${q}`) - 0.5);
        return (
          <path
            key={`${j}-${q}`}
            d={`M${-r} ${-r * 0.4}L${-r * 0.2} ${-r}L${r} ${-r * 0.5}L${r * 0.7} ${r * 0.8}L${-r * 0.6} ${r * 0.7}Z`}
            transform={`translate(${cx} ${cy}) rotate(${rot})`}
            fill={color}
            stroke={line}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        );
      });
    })}
  </g>
);

/** The giant footprint in blue ice, from above (three toes, pointing up). */
export const GiantPrint: React.FC<{size: number; P: WorldPalette}> = ({size, P}) => {
  const s = size / 100;
  const ice = iceOf(P);
  return (
    <g transform={`scale(${s})`}>
      <path d="M -14 40 L -50 -30 L -30 -34 L -8 -8 L 0 -46 L 8 -8 L 30 -34 L 50 -30 L 14 40 Q 0 52 -14 40 Z" fill={mixHex(ice, P.snowShade, 0.3)} strokeLinejoin="round" />
      <path d="M -10 34 L -40 -24 L -30 -26 L -6 -2 L 0 -38 L 6 -2 L 30 -26 L 40 -24 L 10 34 Q 0 43 -10 34 Z" fill={ice} />
      <path d="M -20 10 l 10 6 l 4 -10 M 6 0 l 12 4 M -4 26 l 8 -4" stroke={mixHex(ice, '#FFFFFF', 0.5)} strokeWidth={1.2} fill="none" />
    </g>
  );
};

/** A print seen from behind him, pointing away up the frame: heel, three toes. */
export const PrintAway: React.FC<{x: number; y: number; w: number; P: WorldPalette}> = ({x, y, w, P}) => (
  <g transform={`translate(${x} ${y}) scale(${w / 20})`}>
    <ellipse cx={0} cy={0} rx={4.5} ry={2.2} fill={P.snowShade} />
    <path d="M-1.5 -1L-7 -5L-6 -6L0 -2.5L0 -8L1.6 -8L1.6 -2.5L7 -6L8 -5L2.2 -1Z" fill={P.snowShade} />
  </g>
);

/**
 * The creator's legs as it stands up (S59): his legs, huge, white pants with a hem and bare ankles,
 * and his three-toed feet planted in the snow.
 */
export const CreatorLegs: React.FC<{xs: number[]; y: number; top: number; w: number; P: WorldPalette; look: {white: string; ink: string}; dir?: number}> = ({xs, y, top, w, P, look, dir = 1}) => (
  <g>
    {xs.map((x, i) => {
      const hem = top + (y - top) * 0.62;
      const ankle = w * 0.6;
      return (
        <g key={i}>
          <path d={`M${x - w * 0.55} ${top}L${x + w * 0.55} ${top}L${x + w * 0.46} ${hem}L${x - w * 0.46} ${hem}Z`} fill={look.white} stroke={look.ink} strokeWidth={3} strokeLinejoin="round" />
          <rect x={x - ankle / 2} y={hem} width={ankle} height={y - hem - w * 0.2} fill={look.white} stroke={look.ink} strokeWidth={3} />
          <line x1={x - w * 0.46} y1={hem} x2={x + w * 0.46} y2={hem} stroke={look.ink} strokeWidth={4} />
          <ellipse cx={x + w * 0.5 * dir} cy={y + 2} rx={w * 1.6} ry={w * 0.16} fill={P.snowShade} />
          {/* his foot, huge: heel under the ankle, three long toes forward */}
          <g transform={`translate(${x} 0) scale(${dir} 1) translate(${-x} 0)`}>
          <path
            d={`M${x - ankle * 0.6} ${y - w * 0.34}Q${x - ankle * 0.7} ${y + w * 0.04} ${x - ankle * 0.2} ${y + w * 0.06}L${x + w * 2.1} ${y + w * 0.08}L${x + w * 2.2} ${y - w * 0.02}L${x + w * 1.55} ${y - w * 0.06}L${x + w * 2.0} ${y - w * 0.12}L${x + w * 1.95} ${y - w * 0.2}L${x + w * 1.3} ${y - w * 0.16}L${x + ankle * 0.5} ${y - w * 0.36}Z`}
            fill={look.white}
            stroke={look.ink}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <path d={`M${x + w * 1.1} ${y + w * 0.02}L${x + w * 1.75} ${y + w * 0.03}M${x + w * 1.0} ${y - w * 0.1}L${x + w * 1.6} ${y - w * 0.1}`} stroke={look.ink} strokeWidth={2.5} strokeLinecap="round" />
          </g>
        </g>
      );
    })}
  </g>
);
