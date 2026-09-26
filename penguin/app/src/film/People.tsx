import React from 'react';
import {random} from 'remotion';

/**
 * The documentary crew and the colony, in the same flat 2D look as HIM: flat fills, one ink line.
 * Drawn in units where 100 = the figure's height, feet at (0, 0), facing +x.
 */

export const INK = '#1D2133';
const PARKA0 = '#E8742E';
const PARKA_DARK0 = '#C85A20';
const FUR0 = '#F4EAD9';
const FACE0 = '#232737';
const PANTS0 = '#3B4150';
const BOOT0 = '#1F222C';
const MITT0 = '#2C303B';

export type CrewRole = 'director' | 'camera' | 'sound';

export type CrewPose = {
  /** continuous step count while walking (legs swing, body bobs); undefined = standing */
  step?: number;
  /** arm angles from hanging straight down, degrees (positive = forward) */
  armFront?: number;
  armBack?: number;
  /** 0-1 head tipped back to look up */
  lookUp?: number;
  /** sunk into the snow, units */
  sink?: number;
  /** lean forward, degrees */
  lean?: number;
  /** holding the penguin out in front (S28, S29) */
  carry?: boolean;
  /** the clipboard held up to the lens */
  sign?: boolean;
};

const tube = (x1: number, y1: number, x2: number, y2: number, w: number, fill: string, lw: number) => (
  <>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={w + lw * 2} strokeLinecap="round" />
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={fill} strokeWidth={w} strokeLinecap="round" />
  </>
);

export const CrewMember: React.FC<{x: number; y: number; h: number; role: CrewRole; facing?: 1 | -1; pose?: CrewPose; tn?: (c: string) => string}> = ({x, y, h, role, facing = 1, pose = {}, tn = (c) => c}) => {
  const PARKA = tn(PARKA0);
  const PARKA_DARK = tn(PARKA_DARK0);
  const FUR = tn(FUR0);
  const FACE = tn(FACE0);
  const PANTS = tn(PANTS0);
  const BOOT = tn(BOOT0);
  const MITT = tn(MITT0);
  const SKIN = tn('#E2A987');
  const GOGGLE = tn('#3C5A7A');
  const SCARF = tn('#2F6F8F');
  const s = h / 100;
  const lw = 1.4;
  const walking = pose.step !== undefined;
  const ph = walking ? Math.PI * (pose.step ?? 0) : 0;
  const swing = walking ? 22 * Math.sin(ph) : 0;
  const bob = walking ? -1.6 * Math.abs(Math.sin(ph)) : 0;
  const sink = pose.sink ?? 0;
  const leg = (deg: number, dx: number) => {
    const r = (deg * Math.PI) / 180;
    const hx = dx;
    const hy = -44;
    const ax = hx + Math.sin(r) * 38;
    const ay = hy + Math.cos(r) * 38;
    return (
      <g>
        {tube(hx, hy, ax, ay - 4, 11, PANTS, lw)}
        <rect x={ax - 6} y={ay - 7} width={15} height={8} rx={3.5} fill={BOOT} stroke={INK} strokeWidth={lw} />
      </g>
    );
  };
  const arm = (deg: number, dx: number, back: boolean) => {
    const r = (deg * Math.PI) / 180;
    const sx = dx;
    const sy = -74;
    const L = pose.carry ? 26 : 29;
    const ex = sx + Math.sin(r) * L;
    const ey = sy + Math.cos(r) * L;
    return (
      <g opacity={back ? 1 : 1}>
        {tube(sx, sy, ex, ey, 9, back ? PARKA_DARK : PARKA, lw)}
        <circle cx={ex} cy={ey} r={5.2} fill={MITT} stroke={INK} strokeWidth={lw} />
      </g>
    );
  };
  const look = pose.lookUp ?? 0;
  const lean = pose.lean ?? 0;
  const aF = pose.sign ? 124 : pose.carry ? 138 : (pose.armFront ?? 0) - swing * 0.8;
  const aB = pose.sign ? 132 : pose.carry ? 128 : (pose.armBack ?? 0) + swing * 0.8;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * facing} ${s})`}>
      <defs>
        <clipPath id={`snow${Math.round(x)}${Math.round(y)}`}>
          <rect x={-60} y={-200} width={120} height={200 - sink} />
        </clipPath>
      </defs>
      <g clipPath={sink ? `url(#snow${Math.round(x)}${Math.round(y)})` : undefined}>
        <g transform={`translate(0 ${bob + sink}) rotate(${lean} 0 -44)`}>
          {arm(aB, -9, true)}
          {leg(-swing, -4)}
          {leg(swing, 4)}
          {/* parka */}
          <path d="M -14 -82 Q -17 -60 -18 -42 Q -10 -38 0 -38 Q 10 -38 18 -42 Q 17 -60 14 -82 Q 0 -88 -14 -82 Z" fill={PARKA} stroke={INK} strokeWidth={lw} strokeLinejoin="round" />
          <path d="M -14 -82 Q -17 -60 -18 -42 Q -12 -39 -6 -38 Q -9 -60 -8 -84 Z" fill={PARKA_DARK} />
          <line x1={2} y1={-80} x2={2} y2={-40} stroke={INK} strokeWidth={lw * 0.8} />
          {role === 'director' && !pose.sign ? <rect x={9} y={-66} width={12} height={15} rx={1.5} fill={tn('#FFFFFF')} stroke={INK} strokeWidth={lw} /> : null}
          {/* hood: fur ring around a dark opening, turned toward facing */}
          <g transform={`rotate(${-look * 28} 0 -84)`}>
            <circle cx={1} cy={-92} r={11.5} fill={PARKA} stroke={INK} strokeWidth={lw} />
            <ellipse cx={4.5} cy={-91} rx={8} ry={8.8} fill={FUR} stroke={INK} strokeWidth={lw * 0.8} />
            <ellipse cx={5.8} cy={-91} rx={5.4} ry={6.4} fill={FACE} />
            <ellipse cx={6.2} cy={-89.2} rx={4.3} ry={4.4} fill={SKIN} />
            <rect x={1.2} y={-94.6} width={9.8} height={3.6} rx={1.8} fill={GOGGLE} stroke={INK} strokeWidth={lw * 0.6} />
            <line x1={3.2} y1={-93.6} x2={5.4} y2={-93.6} stroke="#FFFFFF" strokeWidth={0.8} strokeLinecap="round" opacity={0.8} />
            <path d="M 3.2 -86.2 Q 6.4 -85 9.6 -86.4 L 9.2 -84.2 Q 6.4 -83.2 3.6 -84.1 Z" fill={SCARF} />
          </g>
          {role === 'camera' ? (
            <g transform={`rotate(${-look * 20} 0 -84)`}>
              <rect x={2} y={-108} width={22} height={11} rx={2} fill={tn('#2A2E36')} stroke={INK} strokeWidth={lw} />
              <rect x={23} y={-106} width={6} height={7} fill="#3A3F48" stroke={INK} strokeWidth={lw * 0.8} />
              <circle cx={6} cy={-105} r={1.6} fill="#E8322B" />
            </g>
          ) : null}
          {role === 'sound' ? <line x1={8} y1={-70} x2={40} y2={-150} stroke="#3A3E46" strokeWidth={2.2} /> : null}
          {role === 'sound' ? <ellipse cx={42} cy={-155} rx={11} ry={6} fill={tn('#A9A9A4')} stroke={INK} strokeWidth={lw} /> : null}
          {arm(aF, 9, false)}
        </g>
      </g>
    </g>
  );
};

/**
 * The colony: rows of penguins of HIS kind, backs to the lens, facing the sea; alternate rows sit
 * half a place over. `turned` heads look round toward him. `hero` marks the one facing the lens:
 * the caller draws him there with the rig.
 */
export const ColonyCrowd: React.FC<{
  x: number;
  y: number;
  w: number;
  ph: number;
  rows: number;
  cols: number;
  hero?: [number, number];
  /** frames since the wave of turning heads started (2 frames per penguin outward), <0 none */
  wave?: number;
  turned?: [number, number][];
  seed?: string;
  t?: number;
  /** draws HIM in the hero's place, so the rows in front of him cover him */
  heroNode?: (px: number, py: number, scale: number) => React.ReactNode;
  tn?: (c: string) => string;
}> = ({x, y, w, ph, rows, cols, hero, wave = -1, turned = [], seed = 'col', t = 0, heroNode, tn = (c) => c}) => {
  const white = tn('#FBF8F2');
  const items: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (hero && hero[0] === r && hero[1] === c) {
        if (heroNode) {
          const hx = ((c + 0.5 + (r % 2 ? 0.5 : 0)) / cols) * w - w / 2;
          const hy = -((rows - 1 - r) * ph * 0.34);
          const hs = 0.72 + 0.28 * (r / Math.max(1, rows - 1));
          items.push(<g key="hero">{heroNode(hx, hy, hs)}</g>);
        }
        continue;
      }
      const jx = (random(`${seed}x${r}.${c}`) - 0.5) * 0.5;
      const jy = (random(`${seed}y${r}.${c}`) - 0.5) * 0.3;
      const px = ((c + 0.5 + (r % 2 ? 0.5 : 0) + jx) / cols) * w - w / 2;
      const py = -((rows - 1 - r) * ph * 0.34) + jy * ph * 0.2;
      const sc = (0.72 + 0.28 * (r / Math.max(1, rows - 1))) * (0.92 + random(`${seed}s${r}.${c}`) * 0.16);
      const d = hero ? Math.hypot(r - hero[0], c - hero[1]) : 99;
      const turn = (wave >= 0 && d * 2 <= wave && d < 7) || turned.some(([tr, tc]) => tr === r && tc === c);
      const dir = hero && c > hero[1] ? -1 : 1;
      const sway = Math.sin(t * 1.3 + r * 1.7 + c * 2.3) * 1.5;
      items.push(
        <g key={`${r}-${c}`} transform={`translate(${px} ${py}) scale(${(sc * ph) / 100})`}>
          <BackPenguin turned={turn} dir={dir} sway={sway} white={white} />
        </g>,
      );
    }
  }
  return <g transform={`translate(${x} ${y})`}>{items}</g>;
};

/** One penguin of the colony from behind (100 units tall, feet at 0). */
const BackPenguin: React.FC<{turned: boolean; dir: number; sway: number; white: string}> = ({turned, dir, sway, white}) => (
  <g transform={`rotate(${sway} 0 0)`}>
    <rect x={-8} y={-16} width={6} height={14} fill={white} stroke={INK} strokeWidth={1.6} />
    <rect x={2} y={-16} width={6} height={14} fill={white} stroke={INK} strokeWidth={1.6} />
    <ellipse cx={-6} cy={-1.5} rx={6} ry={2.2} fill={white} stroke={INK} strokeWidth={1.4} />
    <ellipse cx={6} cy={-1.5} rx={6} ry={2.2} fill={white} stroke={INK} strokeWidth={1.4} />
    <path d="M -18 -40 Q -22 -24 -15 -16 Q 0 -10 15 -16 Q 22 -24 18 -40 Q 15 -66 0 -70 Q -15 -66 -18 -40 Z" fill={INK} />
    <path d="M -17 -52 Q -26 -34 -22 -24 L -17 -34 Z M 17 -52 Q 26 -34 22 -24 L 17 -34 Z" fill={INK} />
    <circle cx={0} cy={-78} r={11} fill={INK} />
    <path d="M -6 -88 L -11 -95 M 6 -88 L 11 -95" stroke={white} strokeWidth={2.2} strokeLinecap="round" />
    {turned ? (
      <g transform={`scale(${dir} 1)`}>
        <ellipse cx={5} cy={-77} rx={5.5} ry={6.5} fill={white} />
        <circle cx={6.5} cy={-79} r={1.6} fill={INK} />
        <path d="M 9 -77 L 18 -75 L 9 -73 Z" fill={white} stroke={INK} strokeWidth={1.2} />
      </g>
    ) : null}
  </g>
);
