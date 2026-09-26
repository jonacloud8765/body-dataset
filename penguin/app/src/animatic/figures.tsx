import React, {useId} from 'react';
import {CREATOR_GOLD, INK, NAVY, PAPER, PARKA, WASH_ICE} from '../theme/palette';

/**
 * Blocking figures for the animatic. HIM is simplified from the model sheet's proportions
 * (§1.7): head 0.20 H, torso to 0.65 H, bare legs 0.65-0.90 H, feet 0.10 H, flippers to
 * 0.62 H with navy tips, paper beak. The final rig replaces these with traced sheet parts.
 */

export type View = 'side' | 'front' | 'front34' | 'back' | 'back34' | 'top';
export type Pose =
  | 'stand' | 'walk' | 'fallen' | 'toboggan' | 'airborne' | 'climb' | 'lifted' | 'shake'
  | 'lookup' | 'bow' | 'still';

const SW = 1.3; // ink stroke in figure units (figure is 100 units tall)

const FlipperGrad: React.FC<{id: string}> = ({id}) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={INK} />
      <stop offset="0.45" stopColor={INK} />
      <stop offset="1" stopColor={NAVY} />
    </linearGradient>
  </defs>
);

type PenguinProps = {
  h: number;
  view: View;
  facing?: 1 | -1;
  pose?: Pose;
  /** Continuous beat position (walk/climb cycles land contacts on integer values). */
  step?: number;
  /** Beak opening, 0-1. */
  beak?: number;
  /** 0-1: head turned back over the shoulder. */
  headTurn?: number;
  /** Seconds, for fast oscillations (shake). */
  t?: number;
};

const Leg: React.FC<{x: number; angle: number; lift: number; facing: number; front?: boolean}> = ({
  x,
  angle,
  lift,
  facing,
  front,
}) => (
  <g transform={`translate(${x},-35) rotate(${angle})`}>
    <rect x={-2.6} y={0} width={5.2} height={25 - lift} fill={PAPER} stroke={INK} strokeWidth={SW} />
    <line x1={-2.6} y1={22 - lift} x2={2.6} y2={22 - lift} stroke={INK} strokeWidth={SW * 0.8} />
    {front ? (
      <ellipse cx={facing * 2} cy={27 - lift} rx={4.5} ry={2.4} fill={PAPER} stroke={INK} strokeWidth={SW} />
    ) : (
      <path
        d={`M ${-2 * facing} ${25 - lift} L ${10 * facing} ${27 - lift} L ${7 * facing} ${29 - lift} L ${-3 * facing} ${28.5 - lift} Z`}
        fill={PAPER}
        stroke={INK}
        strokeWidth={SW}
      />
    )}
  </g>
);

const SideHead: React.FC<{beak: number; turn: number}> = ({beak, turn}) => {
  // turn 0: facing forward (+x); turn 1: looking back over the shoulder (mirrored head)
  const dir = turn > 0.5 ? -1 : 1;
  return (
    <g transform={`translate(2,-89) scale(${dir},1)`}>
      <path d="M -8 -6 L -12 -12 L -7 -9 L -8 -15 L -3 -9" fill={INK} stroke={INK} strokeWidth={SW} />
      <circle cx={0} cy={0} r={10} fill={INK} />
      <ellipse cx={4.5} cy={1.5} rx={5} ry={6} fill={PAPER} />
      <circle cx={5.5} cy={-0.5} r={1.7} fill={INK} />
      <path d="M 7 -2 Q 9 -3.2 11 -1.6" fill="none" stroke={INK} strokeWidth={SW * 0.8} />
      <polygon points="9,-1.5 19.5,1.6 9,2.6" fill={PAPER} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <g transform={`rotate(${beak * 30}, 9, 2.6)`}>
        <polygon points="9,2.6 17.5,3.1 9,5" fill={PAPER} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      </g>
      {beak > 0.05 ? <polygon points={`9,2.6 ${9 + 7 * beak},${3 + 2 * beak} 9,${3 + 3 * beak}`} fill="#3a1f1f" /> : null}
    </g>
  );
};

const FrontHead: React.FC<{beak: number; shift: number}> = ({beak, shift}) => (
  <g transform="translate(0,-88)">
    {[-1, 1].map((s) => (
      <path
        key={s}
        d={`M ${s * 5 + shift} -8 L ${s * 11 + shift} -14 L ${s * 9 + shift} -9 L ${s * 13 + shift} -11 L ${s * 8 + shift} -5`}
        fill={PAPER}
        stroke={INK}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
    ))}
    <circle cx={0} cy={0} r={11} fill={INK} />
    <ellipse cx={-4.4 + shift} cy={1.5} rx={4.4} ry={5.6} fill={PAPER} />
    <ellipse cx={4.4 + shift} cy={1.5} rx={4.4} ry={5.6} fill={PAPER} />
    <ellipse cx={-3.6 + shift} cy={0} rx={1.3} ry={1.8} fill={INK} />
    <ellipse cx={3.6 + shift} cy={0} rx={1.3} ry={1.8} fill={INK} />
    {beak > 0.05 ? <ellipse cx={shift} cy={5.6 + beak * 1.5} rx={2.8} ry={1 + beak * 2.6} fill="#3a1f1f" /> : null}
    <polygon
      points={`${-3.6 + shift},4.2 ${shift},2.2 ${3.6 + shift},4.2 ${shift},${6.2 + beak * 3.2}`}
      fill={PAPER}
      stroke={INK}
      strokeWidth={SW}
      strokeLinejoin="round"
    />
    {beak > 0.05 ? (
      <path d={`M ${-3 + shift} 4.6 Q ${shift} ${6 + beak * 5} ${3 + shift} 4.6`} fill="none" stroke={INK} strokeWidth={SW} />
    ) : null}
  </g>
);

export const Penguin: React.FC<PenguinProps> = ({h, view, facing = 1, pose = 'stand', step = 0, beak = 0, headTurn = 0, t = 0}) => {
  const s = h / 100;
  const gid = `fl${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const walking = pose === 'walk' || pose === 'lifted';
  const p = walking ? step : 0;
  const a0 = walking ? 20 * Math.cos(Math.PI * p) : 0;
  const lift0 = walking ? Math.max(0, Math.sin(Math.PI * p)) * 3 : 0;
  const lift1 = walking ? Math.max(0, -Math.sin(Math.PI * p)) * 3 : 0;
  const bob = walking && pose === 'walk' ? -1.5 * Math.abs(Math.sin(Math.PI * p)) : 0;

  let outer = '';
  if (pose === 'fallen') outer = 'translate(0,-13) rotate(-88)';
  if (pose === 'toboggan') outer = 'translate(0,-12) rotate(80)';
  if (pose === 'airborne') outer = 'rotate(55)';
  if (pose === 'climb' && view === 'side') outer = 'rotate(24)';
  if (pose === 'bow') outer = 'rotate(10)';
  if (pose === 'shake') outer = `rotate(${6 * Math.sin(t * 60)})`;

  if (view === 'top') {
    return (
      <g transform={`scale(${s})`}>
        <FlipperGrad id={gid} />
        <ellipse cx={-15} cy={2} rx={3.5} ry={11} fill={`url(#${gid})`} />
        <ellipse cx={15} cy={2} rx={3.5} ry={11} fill={`url(#${gid})`} />
        <ellipse cx={0} cy={0} rx={14} ry={22} fill={INK} />
        <circle cx={0} cy={-22} r={9} fill={INK} />
        <path d="M -6 -27 L -9 -33 M 6 -27 L 9 -33" stroke={PAPER} strokeWidth={SW * 1.4} />
        <polygon points="0,-38 -3,-30 3,-30" fill={PAPER} stroke={INK} strokeWidth={SW} />
      </g>
    );
  }

  const front = view === 'front' || view === 'front34';
  const back = view === 'back' || view === 'back34';
  const shift = view === 'front34' ? 2.6 : 0;
  const legsX = front || back ? [-5, 5] : [1, -1];
  const tail = !front ? (
    <polygon points={view === 'side' ? '-12,-36 -18,-30 -9,-32' : '-3,-33 0,-27 3,-33'} fill={INK} />
  ) : null;

  const body = (
    <g transform={`translate(0,${bob})`}>
      {tail}
      {view === 'side' ? (
        <>
          <ellipse cx={0} cy={-58} rx={15} ry={26} fill={INK} />
          <ellipse cx={4.5} cy={-56} rx={10} ry={22.5} fill={PAPER} />
          <path d="M 6 -74 l 1.2 3 l 1.4 -3 l 1.2 3" fill="none" stroke="#7C7C7B" strokeWidth={0.7} />
          <g transform={pose === 'climb' ? `rotate(${Math.sin(Math.PI * step) > 0 ? -150 : -10}, -2, -74)` : 'rotate(6, -2, -74)'}>
            <ellipse cx={-3} cy={-58} rx={4.2} ry={17} fill={`url(#${gid})`} />
          </g>
          <SideHead beak={beak} turn={headTurn} />
        </>
      ) : (
        <>
          <ellipse cx={-16.5 - (view === 'front34' ? -1.5 : 0)} cy={-57} rx={3.6} ry={17} fill={`url(#${gid})`} transform={`rotate(${pose === 'climb' && Math.cos(Math.PI * step) > 0 ? 150 : 6},-16,-74)`} />
          <ellipse cx={16.5} cy={-57} rx={3.6} ry={17} fill={`url(#${gid})`} transform={`rotate(${pose === 'climb' && Math.cos(Math.PI * step) <= 0 ? -150 : -6},16,-74)`} />
          <ellipse cx={0} cy={-58} rx={17} ry={26} fill={INK} />
          {front ? <ellipse cx={shift} cy={-56} rx={12.5} ry={23} fill={PAPER} /> : null}
          {front ? <path d={`M ${shift - 3} -72 l 1.5 3 l 1.5 -3 l 1.5 3 l 1.5 -3`} fill="none" stroke="#7C7C7B" strokeWidth={0.7} /> : null}
          {back ? (
            <g transform="translate(0,-88)">
              {[-1, 1].map((q) => (
                <path key={q} d={`M ${q * 5} -8 L ${q * 11} -14 L ${q * 9} -9 L ${q * 13} -11 L ${q * 8} -5`} fill={PAPER} stroke={INK} strokeWidth={SW} />
              ))}
              <circle cx={0} cy={0} r={11} fill={INK} />
              {view === 'back34' || headTurn > 0.5 ? (
                <polygon points="9,1 16,3 9,5" fill={PAPER} stroke={INK} strokeWidth={SW} />
              ) : null}
            </g>
          ) : (
            <FrontHead beak={beak} shift={shift} />
          )}
        </>
      )}
    </g>
  );

  return (
    <g transform={`scale(${s * facing},${s})`}>
      <FlipperGrad id={gid} />
      <g transform={outer}>
        <Leg x={legsX[0]} angle={front || back ? 0 : a0} lift={lift0 * (front || back ? 1.3 : 1)} facing={1} front={front || back} />
        <Leg x={legsX[1]} angle={front || back ? 0 : -a0} lift={lift1 * (front || back ? 1.3 : 1)} facing={1} front={front || back} />
        {body}
      </g>
    </g>
  );
};

export type Role = 'director' | 'camera' | 'sound';

export const Crew: React.FC<{h: number; role: Role; facing?: 1 | -1; step?: number; sink?: number; look?: 'ahead' | 'up'}> = ({
  h,
  role,
  facing = 1,
  step = 0,
  sink = 0,
  look = 'ahead',
}) => {
  const s = h / 100;
  const bob = -1.5 * Math.abs(Math.sin(Math.PI * step));
  return (
    <g transform={`scale(${s * facing},${s}) translate(0,${sink + bob})`}>
      <rect x={-12} y={-30} width={9} height={30} fill="#2E3237" />
      <rect x={3} y={-30} width={9} height={30} fill="#2E3237" />
      <rect x={-21} y={-80} width={42} height={56} rx={12} fill={PARKA} stroke={INK} strokeWidth={SW} />
      <line x1={0} y1={-76} x2={0} y2={-28} stroke={INK} strokeWidth={SW * 0.7} />
      <circle cx={0} cy={-88} r={14.5} fill={PARKA} stroke={INK} strokeWidth={SW} />
      <circle cx={look === 'up' ? 2 : 3} cy={look === 'up' ? -91 : -88} r={10.5} fill="#D8D0C2" />
      <ellipse cx={look === 'up' ? 2 : 3.5} cy={look === 'up' ? -92 : -88} rx={6.5} ry={8} fill="#141414" />
      {role === 'camera' ? (
        <g>
          <rect x={4} y={-104} width={30} height={16} rx={2} fill="#26292D" stroke={INK} strokeWidth={SW} />
          <rect x={33} y={-100} width={8} height={9} fill="#3A3E44" />
          <circle cx={9} cy={-100} r={2} fill="#E8322B" />
        </g>
      ) : null}
      {role === 'sound' ? (
        <g>
          <line x1={14} y1={-60} x2={58} y2={-150} stroke="#3A3E44" strokeWidth={2.4} />
          <ellipse cx={62} cy={-156} rx={14} ry={7} fill="#9A9A96" stroke="#6E6E6A" strokeWidth={1} />
        </g>
      ) : null}
      {role === 'director' ? <rect x={14} y={-70} width={14} height={18} fill={PAPER} stroke={INK} strokeWidth={SW} /> : null}
    </g>
  );
};

/** Mountain / creator silhouette: a bowed penguin head (dome + beak spur) and sloping shoulders. */
const MOUNTAIN = [
  [-110, 0], [-84, -26], [-70, -47], [-79, -55], [-62, -61], [-50, -80], [-31, -94], [-10, -100],
  [8, -96], [23, -86], [39, -70], [58, -50], [82, -24], [110, 0],
];
const SNOWFIELD = [[-104, 0], [-72, -40], [-58, -57], [-40, -61], [-22, -40], [-8, 0]];
export const mountainPath = MOUNTAIN.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ') + ' Z';

export type EyeState = 'none' | 'glint' | 'sealed' | 'cracked' | 'open';

export const Mountain: React.FC<{
  h: number;
  haze: number;
  hazeColor: string;
  eyes?: EyeState;
  rim?: number;
  plume?: number;
  dark?: boolean;
}> = ({h, haze, hazeColor, eyes = 'none', rim = 0, plume = -1, dark = false}) => {
  const s = h / 100;
  const len = 760;
  return (
    <g transform={`scale(${s})`}>
      <path d={mountainPath} fill={dark ? '#23242A' : '#5B5F66'} stroke={INK} strokeWidth={0.8 / Math.max(0.2, s / 3)} />
      {!dark ? <path d={SNOWFIELD.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ') + ' Z'} fill={PAPER} /> : null}
      {!dark ? (
        <>
          <path d="M -53 -83 q 3 -9 9 -6 q -4 1 -3 5" fill={PAPER} />
          <path d="M -33 -92 q 3 -9 9 -6 q -4 1 -3 5" fill={PAPER} />
          <path d="M -30 -80 l 10 -4 M -24 -74 l 12 -3 M 5 -84 l 12 4 M 14 -72 l 14 5" stroke="#7C7C7B" strokeWidth={0.6} />
        </>
      ) : null}
      {eyes !== 'none' ? (
        <g>
          {[
            [-46, -76],
            [-27, -83],
          ].map(([x, y]) => (
            <g key={x}>
              <ellipse cx={x} cy={y} rx={5} ry={eyes === 'open' ? 4.2 : 2.6} fill={eyes === 'open' ? CREATOR_GOLD : '#1A1B20'} />
              {eyes === 'open' ? <ellipse cx={x + 0.6} cy={y} rx={2.2} ry={3} fill={INK} /> : null}
              {eyes === 'glint' ? <circle cx={x + 1.5} cy={y - 0.6} r={1.1} fill="#FFF3D6" /> : null}
            </g>
          ))}
        </g>
      ) : null}
      {plume >= 0 && plume <= 1 ? (
        <g opacity={Math.sin(Math.PI * Math.min(1, plume * 1.6))}>
          {[0, 1, 2, 3].map((i) => (
            <circle
              key={i}
              cx={-10 - plume * (26 + i * 16)}
              cy={-106 - i * 4 - plume * 10}
              r={8 + plume * 14 + i * 3}
              fill="#FFFFFF"
              opacity={0.85 - i * 0.15}
              stroke="#9AA6B0"
              strokeWidth={0.8 / Math.max(0.2, s / 3)}
            />
          ))}
        </g>
      ) : null}
      {rim > 0 ? (
        <path
          d={mountainPath}
          fill="none"
          stroke={CREATOR_GOLD}
          strokeWidth={2.2 / Math.max(0.2, s / 3)}
          strokeDasharray={len}
          strokeDashoffset={len * (1 - Math.min(1, rim))}
          strokeLinejoin="round"
        />
      ) : null}
      {haze > 0 ? <path d={mountainPath} fill={hazeColor} opacity={haze} /> : null}
    </g>
  );
};

/** The colony: rows of small penguins, all backs except one front (him). */
export const Colony: React.FC<{
  w: number;
  ph: number;
  rows: number;
  cols: number;
  hero?: [number, number];
  wave?: number;
  seed?: number;
  /** [row, col] of penguins whose heads are turned toward camera right now. */
  turned?: [number, number][];
}> = ({w, ph, rows, cols, hero, wave = -1, seed = 1, turned: turnedList = []}) => {
  const items: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const jx = Math.sin((r * 31 + c * 17 + seed) * 12.9898) * 0.35;
      const jy = Math.cos((r * 13 + c * 7 + seed) * 78.233) * 0.25;
      // alternate rows sit half a place over, so each head shows between the two in front
      const x = ((c + 0.5 + (r % 2 ? 0.5 : 0) + jx * 0.6) / cols) * w - w / 2;
      const y = -((rows - 1 - r) * ph * 0.34) + jy * ph * 0.2;
      const sc = 0.72 + 0.28 * (r / Math.max(1, rows - 1));
      const isHero = hero && hero[0] === r && hero[1] === c;
      const d = hero ? Math.hypot(r - hero[0], c - hero[1]) : 99;
      const turned = (!isHero && wave >= 0 && d * 2 <= wave && d < 6) || turnedList.some(([tr, tc]) => tr === r && tc === c);
      items.push(
        <g key={`${r}-${c}`} transform={`translate(${x},${y}) scale(${sc})`}>
          {isHero ? (
            <Penguin h={ph} view="front" />
          ) : (
            <g transform={`scale(${ph / 100})`}>
              <ellipse cx={0} cy={-45} rx={15} ry={27} fill={INK} />
              <circle cx={0} cy={-80} r={10} fill={INK} />
              {turned ? (
                <g transform={hero && c > hero[1] ? 'scale(-1,1)' : undefined}>
                  <ellipse cx={4} cy={-79} rx={5} ry={6} fill={PAPER} />
                  <circle cx={5} cy={-80} r={1.6} fill={INK} />
                  <polygon points="8,-80 17,-77 8,-75" fill={PAPER} stroke={INK} strokeWidth={1} />
                </g>
              ) : null}
              <rect x={-7} y={-22} width={5} height={22} fill={PAPER} stroke={INK} strokeWidth={1} />
              <rect x={2} y={-22} width={5} height={22} fill={PAPER} stroke={INK} strokeWidth={1} />
            </g>
          )}
        </g>,
      );
    }
  }
  return <g>{items}</g>;
};

/** Close-up feet (ECU): two webbed three-toed feet, one of them stepping. */
export const Feet: React.FC<{size: number; lift: number; print: number}> = ({size, lift, print}) => {
  const s = size / 100;
  const foot = (x: number, dy: number, k: number) => (
    <g transform={`translate(${x},${dy})`} key={k}>
      <rect x={-9} y={-120} width={18} height={100} fill={PAPER} stroke={INK} strokeWidth={2.5} />
      <line x1={-9} y1={-40} x2={9} y2={-40} stroke={INK} strokeWidth={2} />
      <path d="M -12 -20 L -40 10 L -24 6 L -8 16 L 0 4 L 8 16 L 24 6 L 40 10 L 12 -20 Z" fill={PAPER} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
    </g>
  );
  return (
    <g transform={`scale(${s})`}>
      {print > 0 ? (
        <path d="M 60 30 L 32 60 L 48 56 L 64 66 L 72 54 L 80 66 L 96 56 L 112 60 L 84 30 Z" fill="#C9D3DC" opacity={print} transform="translate(0,-4)" />
      ) : null}
      {foot(-40, 0, 0)}
      {foot(72, -lift, 1)}
    </g>
  );
};

/** The giant footprint in blue ice, seen from above (three toes, pointing up). */
export const GiantPrint: React.FC<{size: number}> = ({size}) => {
  const s = size / 100;
  return (
    <g transform={`scale(${s})`}>
      <path
        d="M -14 40 L -50 -30 L -30 -34 L -8 -8 L 0 -46 L 8 -8 L 30 -34 L 50 -30 L 14 40 Q 0 52 -14 40 Z"
        fill={WASH_ICE}
        stroke={PAPER}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path d="M -20 10 l 10 6 l 4 -10 M 6 0 l 12 4 M -4 26 l 8 -4" stroke="#DDEBF4" strokeWidth={0.8} fill="none" />
    </g>
  );
};

/** One enormous eye of the creator: his eye design, lit gold. */
export const BigEye: React.FC<{size: number; open: number; pupil: number; reflection?: boolean}> = ({size, open, pupil, reflection}) => {
  const s = size / 100;
  return (
    <g transform={`scale(${s})`}>
      <ellipse cx={0} cy={0} rx={60} ry={42} fill="#4A3A22" />
      <ellipse cx={0} cy={0} rx={56} ry={38 * open} fill={CREATOR_GOLD} />
      <ellipse cx={0} cy={0} rx={22 * pupil} ry={32 * open * pupil} fill={INK} />
      <ellipse cx={-10} cy={-12 * open} rx={7} ry={5 * open} fill="#FFF6E2" />
      {reflection && open > 0.5 ? (
        <g transform="translate(8,6) scale(0.09)" opacity={0.8}>
          <Penguin h={100} view="front" />
        </g>
      ) : null}
      <path d={`M -60 ${-42 + 42 * (1 - open)} Q 0 ${-60 + 50 * (1 - open)} 60 ${-42 + 42 * (1 - open)}`} fill="none" stroke={INK} strokeWidth={3} />
    </g>
  );
};
