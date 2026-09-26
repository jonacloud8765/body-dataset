import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, CONDITIONS, FONT_DISPLAY, FONT_MONO, H, MATTE, W} from '../theme';
import {clamp, ecg, rand} from '../lib/anim';

/** Direction-of-intent chevron. `angle` in degrees (0 = pointing right). */
export const IntentWedge: React.FC<{x: number; y: number; angle?: number; size?: number; color?: string; opacity?: number; glow?: number}> = ({x, y, angle = 0, size = 14, color = C.COLD, opacity = 1, glow = 0.6}) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`} opacity={opacity}>
    <path d={`M ${-size * 0.6} ${-size * 0.7} L ${size * 0.8} 0 L ${-size * 0.6} ${size * 0.7} L ${-size * 0.25} 0 Z`} fill={color} style={{filter: `drop-shadow(0 0 ${6 * glow}px ${color})`}} />
  </g>
);

/** Personal-space ellipse on the ground. */
export const GroundRing: React.FC<{x: number; y: number; r: number; color?: string; opacity?: number; dash?: boolean; squash?: number; fill?: number; jagged?: number}> = ({x, y, r, color = C.BONE, opacity = 1, dash = false, squash = 0.22, fill = 0.06, jagged = 0}) => {
  if (jagged > 0) {
    const pts = [];
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2;
      const rr = r * (1 + (i % 2 ? jagged : -jagged * 0.3));
      pts.push(`${x + Math.cos(a) * rr},${y + Math.sin(a) * rr * squash}`);
    }
    return <polygon points={pts.join(' ')} fill={color} fillOpacity={fill} stroke={color} strokeWidth={2} opacity={opacity} />;
  }
  return <ellipse cx={x} cy={y} rx={r} ry={r * squash} fill={color} fillOpacity={fill} stroke={color} strokeWidth={2} strokeDasharray={dash ? '8 8' : undefined} opacity={opacity} />;
};

/**
 * Attention field: a soft cone from (x,y) toward `angle` with half-width `spread`.
 * spread >= 180 renders a full ring (general awareness).
 */
export const AttentionField: React.FC<{x: number; y: number; angle: number; spread: number; radius: number; color?: string; opacity?: number; id: string}> = ({x, y, angle, spread, radius, color = C.PAPER, opacity = 1, id}) => {
  const gid = `af-${id}`;
  const s = Math.min(179.9, spread);
  const a0 = ((angle - s) * Math.PI) / 180;
  const a1 = ((angle + s) * Math.PI) / 180;
  const large = s > 90 ? 1 : 0;
  const d = spread >= 179.9
    ? `M ${x - radius} ${y} A ${radius} ${radius} 0 1 1 ${x + radius} ${y} A ${radius} ${radius} 0 1 1 ${x - radius} ${y} Z`
    : `M ${x} ${y} L ${x + Math.cos(a0) * radius} ${y + Math.sin(a0) * radius} A ${radius} ${radius} 0 ${large} 1 ${x + Math.cos(a1) * radius} ${y + Math.sin(a1) * radius} Z`;
  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id={gid} cx={x} cy={y} r={radius} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={color} stopOpacity={0.34} />
          <stop offset="0.7" stopColor={color} stopOpacity={0.1} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <path d={d} fill={`url(#${gid})`} />
      {spread >= 179.9 ? <circle cx={x} cy={y} r={radius * 0.92} fill="none" stroke={color} strokeWidth={1.5} opacity={0.22} /> : null}
    </g>
  );
};

export const DistanceLine: React.FC<{x1: number; x2: number; y: number; opacity?: number; color?: string}> = ({x1, x2, y, opacity = 1, color = C.BONE}) => (
  <g opacity={opacity} stroke={color} strokeWidth={2}>
    <line x1={x1} x2={x2} y1={y} y2={y} strokeDasharray="2 7" strokeLinecap="round" />
    <line x1={x1} x2={x1} y1={y - 9} y2={y + 9} />
    <line x1={x2} x2={x2} y1={y - 9} y2={y + 9} />
  </g>
);

/** Expanding voice/sound arcs from (x,y) toward angle. `t` in seconds since emission. */
export const SoundArcs: React.FC<{x: number; y: number; angle?: number; t: number; color?: string; count?: number; reach?: number; cutoff?: number}> = ({x, y, angle = 0, t, color = C.BONE, count = 4, reach = 420, cutoff = Infinity}) => {
  const arcs = [];
  for (let i = 0; i < count; i++) {
    const tt = t - i * 0.18;
    if (tt <= 0) continue;
    const r = 20 + tt * reach;
    if (r > cutoff) continue;
    const o = clamp(1 - tt / 1.4) * clamp((cutoff - r) / 60);
    const a0 = ((angle - 32) * Math.PI) / 180;
    const a1 = ((angle + 32) * Math.PI) / 180;
    arcs.push(<path key={i} d={`M ${x + Math.cos(a0) * r} ${y + Math.sin(a0) * r} A ${r} ${r} 0 0 1 ${x + Math.cos(a1) * r} ${y + Math.sin(a1) * r}`} stroke={color} strokeWidth={3} fill="none" opacity={o} strokeLinecap="round" />);
  }
  return <g>{arcs}</g>;
};

/** ECG pulse trace across [x0, x1] at baseline y. phase = accumulated beats at the right edge. */
export const PulseLine: React.FC<{x0: number; x1: number; y: number; phase: number; beatsVisible?: number; amp?: number; color?: string; opacity?: number; width?: number; draw?: number; jitter?: number; seed?: number}> = ({x0, x1, y, phase, beatsVisible = 4, amp = 60, color = C.PAPER, opacity = 1, width = 2.5, draw = 1, jitter = 0, seed = 0}) => {
  const n = 320;
  const pts: string[] = [];
  const upto = Math.floor(n * clamp(draw));
  for (let i = 0; i <= upto; i++) {
    const u = i / n;
    const ph = phase - (1 - u) * beatsVisible;
    const jj = jitter ? (rand(i * 1.7 + seed + Math.floor(phase * 7)) - 0.5) * jitter : 0;
    pts.push(`${(x0 + (x1 - x0) * u).toFixed(1)},${(y - ecg(ph) * amp + jj).toFixed(1)}`);
  }
  return <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" opacity={opacity} />;
};

/** Cinematic letterbox. `extra` closes the bars further (tunnel). */
export const Matte: React.FC<{amount?: number; extra?: number; jitter?: number; frame?: number}> = ({amount = 1, extra = 0, jitter = 0, frame = 0}) => {
  const h = MATTE * amount + extra;
  const j1 = jitter ? (rand(frame * 0.37) - 0.5) * jitter : 0;
  const j2 = jitter ? (rand(frame * 0.53 + 3) - 0.5) * jitter : 0;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: Math.max(0, h + j1), background: C.INK}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: Math.max(0, h + j2), background: C.INK}} />
    </AbsoluteFill>
  );
};

/**
 * The Condition Rail: five stops along a line in the lower instrument bar.
 * level: continuous 0 (white) .. 4 (black).
 */
export const ConditionRail: React.FC<{level: number; x0?: number; x1?: number; y?: number; opacity?: number; draw?: number; showRanges?: boolean; labels?: boolean}> = ({level, x0 = 1180, x1 = 1800, y = H - 70, opacity = 1, draw = 1, showRanges = true, labels = true}) => {
  const n = CONDITIONS.length;
  const xs = CONDITIONS.map((_, i) => x0 + ((x1 - x0) * i) / (n - 1));
  const lx = x0 + (x1 - x0) * clamp(level / 4) ;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity}}>
      <defs>
        <linearGradient id="railGrad" x1={x0} x2={x1} y1="0" y2="0" gradientUnits="userSpaceOnUse">
          {CONDITIONS.map((c, i) => <stop key={c.id} offset={i / (n - 1)} stopColor={c.id === 'black' ? '#50140C' : c.color} />)}
        </linearGradient>
      </defs>
      <line x1={x0} x2={x0 + (x1 - x0) * draw} y1={y} y2={y} stroke={C.IRON} strokeWidth={3} strokeLinecap="round" />
      <line x1={x0} x2={Math.min(lx, x0 + (x1 - x0) * draw)} y1={y} y2={y} stroke="url(#railGrad)" strokeWidth={5} strokeLinecap="round" />
      {CONDITIONS.map((c, i) => {
        const vis = clamp((draw * (n - 1) - i + 1) / 1);
        const active = clamp(1 - Math.abs(level - i) * 1.5);
        const passed = level >= i - 0.02;
        const r = 7 + active * 5;
        return (
          <g key={c.id} opacity={vis}>
            <circle cx={xs[i]} cy={y} r={r + 5} fill={c.id === 'black' ? C.PAPER : c.color} opacity={0.18 * active} />
            <circle cx={xs[i]} cy={y} r={r} fill={passed ? (c.id === 'black' ? '#000' : c.color) : C.INK} stroke={c.id === 'black' ? C.PAPER : c.color} strokeWidth={c.id === 'black' ? 1.5 : 2.5} />
            {labels ? (
              <text x={xs[i]} y={y - 22} textAnchor="middle" fill={active > 0.5 ? C.BONE : C.ASH} style={{fontFamily: FONT_DISPLAY, fontSize: 15, letterSpacing: '0.16em', fontVariationSettings: "'wght' 560"}}>
                {c.id.toUpperCase()}
              </text>
            ) : null}
            {showRanges ? (
              <text x={xs[i]} y={y + 32} textAnchor="middle" fill={active > 0.5 ? C.MIST : C.IRON} style={{fontFamily: FONT_MONO, fontSize: 14}}>
                ≈{c.bpm[0]}–{c.bpm[1]}{c.id === 'black' ? '+' : ''}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};

/**
 * Seeded film grain, re-seeded every 2 frames.
 * Computed at quarter resolution and scaled up: procedural noise at full HD is the
 * single most expensive operation in a software-rendered frame.
 */
export const Grain: React.FC<{frame: number; opacity?: number}> = ({frame, opacity = 0.05}) => {
  const seed = Math.floor(frame / 2) % 97;
  const gw = W / 4;
  const gh = H / 4;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity}}>
      <svg width={gw} height={gh} style={{position: 'absolute', left: 0, top: 0, transform: 'scale(4)', transformOrigin: '0 0'}}>
        <filter id={`grain${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={gw} height={gh} filter={`url(#grain${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Radial vignette / tunnel. amount 0..1 closes toward a circle at (cx, cy). */
export const Tunnel: React.FC<{amount: number; cx?: number; cy?: number; color?: string}> = ({amount, cx = W / 2, cy = H / 2, color = C.INK}) => {
  if (amount <= 0) return null;
  const inner = 900 - amount * 700;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      <defs>
        <radialGradient id="tunnelGrad" cx={cx} cy={cy} r={inner + 380} gradientUnits="userSpaceOnUse">
          <stop offset={Math.max(0, inner / (inner + 380))} stopColor={color} stopOpacity={0} />
          <stop offset="1" stopColor={color} stopOpacity={Math.min(1, 0.6 + amount * 0.4)} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#tunnelGrad)" />
    </svg>
  );
};
