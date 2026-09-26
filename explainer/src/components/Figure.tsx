import React from 'react';
import {C, mixHex} from '../theme';
import {lerp} from '../lib/anim';

/** Joint angles in degrees. Limb angles are measured from straight down, + = forward. */
export type Pose = {
  lean: number;
  head: number;
  shN: number;
  elN: number;
  shF: number;
  elF: number;
  hipN: number;
  knN: number;
  hipF: number;
  knF: number;
  /** 0..1 posture expansion (broader chest, wider silhouette). */
  expand: number;
  /** 0..1 sitting (pelvis locked to seat height). */
  sit: number;
};

const base: Pose = {lean: 0, head: 0, shN: 4, elN: 10, shF: -4, elF: 10, hipN: 3, knN: 2, hipF: -3, knF: 2, expand: 0, sit: 0};

export const POSES = {
  stand: base,
  phone: {...base, head: 26, shN: 28, elN: 112, shF: 2, elF: 14},
  alert: {...base, lean: -1, head: -4, shN: 6, elN: 16, shF: -2, elF: 14, hipN: 6, hipF: -6},
  orient: {...base, lean: 3, head: -2, shN: 14, elN: 36, shF: 8, elF: 30, hipN: 9, knN: 6, hipF: -9, knF: 8},
  guard: {...base, lean: 11, head: 4, shN: 38, elN: 118, shF: 30, elF: 124, hipN: 18, knN: 16, hipF: -16, knF: 14},
  frozen: {...base, lean: 2, head: 6, shN: 12, elN: 22, shF: -10, elF: 18, hipN: 14, knN: 6, hipF: -12, knF: 10},
  posture: {...base, lean: -7, head: -10, shN: 84, elN: 6, shF: 18, elF: 30, hipN: 21, knN: 4, hipF: -21, knF: 4, expand: 1},
  submit: {...base, lean: 32, head: 34, shN: 40, elN: 24, shF: 30, elF: 30, hipN: 88, knN: 150, hipF: 5, knF: 118},
  sit: {...base, lean: -4, shN: 20, elN: 60, shF: 16, elF: 56, hipN: 86, knN: 88, hipF: 80, knF: 84, sit: 1},
  shield: {...base, lean: 6, head: 0, shN: 52, elN: 40, shF: 40, elF: 60, hipN: 20, knN: 14, hipF: -18, knF: 12, expand: 0.4},
} satisfies Record<string, Pose>;

export const mixPose = (a: Pose, b: Pose, t: number): Pose => {
  const out = {} as Pose;
  (Object.keys(a) as (keyof Pose)[]).forEach((k) => {
    out[k] = lerp(a[k], b[k], t);
  });
  return out;
};

const TAU = Math.PI * 2;

export const walkPose = (phase: number, amp = 1): Pose => {
  const s = Math.sin(phase * TAU);
  const c = Math.cos(phase * TAU);
  return {
    ...base,
    lean: 3 * amp,
    head: 2,
    hipN: 24 * s * amp,
    hipF: -24 * s * amp,
    knN: (6 + 40 * Math.max(0, c) ** 1.4) * amp,
    knF: (6 + 40 * Math.max(0, -c) ** 1.4) * amp,
    shN: -18 * s * amp,
    shF: 18 * s * amp,
    elN: 16 + 12 * Math.max(0, -s) * amp,
    elF: 16 + 12 * Math.max(0, s) * amp,
  };
};

export const runPose = (phase: number, amp = 1): Pose => {
  const s = Math.sin(phase * TAU);
  const c = Math.cos(phase * TAU);
  return {
    ...base,
    lean: 14 * amp,
    head: -2,
    hipN: 40 * s * amp + 6,
    hipF: -40 * s * amp + 6,
    knN: (14 + 88 * Math.max(0, c) ** 1.2) * amp,
    knF: (14 + 88 * Math.max(0, -c) ** 1.2) * amp,
    shN: -38 * s * amp,
    shF: 38 * s * amp,
    elN: 88,
    elF: 88,
  };
};

const G = {TORSO: 58, NECK: 7, HEADR: 11.5, UARM: 32, LARM: 30, ULEG: 46, LLEG: 45};

type V = {x: number; y: number};
const v = (x: number, y: number): V => ({x, y});
const add = (a: V, b: V, k = 1): V => v(a.x + b.x * k, a.y + b.y * k);
const dirDown = (deg: number): V => v(Math.sin((deg * Math.PI) / 180), Math.cos((deg * Math.PI) / 180));

export type Joints = {
  P: V; S: V; N: V; head: V; heart: V; wedge: V;
  EN: V; HN: V; EF: V; HF: V; KN: V; FN: V; KF: V; FF: V;
  dir: V; perp: V; groundOffset: number;
};

/** Forward kinematics in local space (pelvis at origin, y down). */
export const solve = (pose: Pose): Joints => {
  const r = (pose.lean * Math.PI) / 180;
  const dir = v(Math.sin(r), -Math.cos(r));
  const perp = v(-dir.y, dir.x);
  const P = v(0, 0);
  const S = add(P, dir, G.TORSO - 7);
  const N = add(P, dir, G.TORSO);
  const hr = ((pose.lean + pose.head) * Math.PI) / 180;
  const head = add(N, v(Math.sin(hr), -Math.cos(hr)), G.NECK + G.HEADR);
  const arm = (sh: number, el: number) => {
    const E = add(S, dirDown(pose.lean + sh), G.UARM);
    const Hd = add(E, dirDown(pose.lean + sh + el), G.LARM);
    return [E, Hd] as const;
  };
  const leg = (hip: number, kn: number) => {
    const K = add(P, dirDown(hip), G.ULEG);
    const F = add(K, dirDown(hip - kn), G.LLEG);
    return [K, F] as const;
  };
  const [EN, HN] = arm(pose.shN, pose.elN);
  const [EF, HF] = arm(pose.shF, pose.elF);
  const [KN, FN] = leg(pose.hipN, pose.knN);
  const [KF, FF] = leg(pose.hipF, pose.knF);
  const lowest = Math.max(FN.y, FF.y, KN.y, KF.y) + 4;
  const seat = 50;
  const groundOffset = lerp(-lowest, -seat, pose.sit);
  const heart = add(add(P, dir, G.TORSO * 0.68), perp, 5);
  const wedge = add(head, v(1, 0), G.HEADR + 22);
  return {P, S, N, head, heart, wedge, EN, HN, EF, HF, KN, FN, KF, FF, dir, perp, groundOffset};
};

export type FigureProps = {
  x: number;
  y: number;
  pose: Pose;
  scale?: number;
  facing?: 1 | -1;
  fill?: string;
  rim?: string | null;
  opacity?: number;
  heart?: {color: string; pulse: number; size?: number; glow?: number} | null;
  /** Draw as a single-color silhouette (used for shadows and ghosts). */
  flat?: boolean;
  /** Extra outline (e.g. for "hardened" freeze outline or awareness highlight). */
  outline?: {color: string; width: number; opacity: number} | null;
};

/** World-space position of a joint for a given figure placement. */
export const anchor = (props: Pick<FigureProps, 'x' | 'y' | 'pose' | 'scale' | 'facing'>, key: 'heart' | 'head' | 'wedge' | 'HN' | 'P') => {
  const j = solve(props.pose);
  const s = props.scale ?? 1;
  const f = props.facing ?? 1;
  const pt = j[key];
  return {x: props.x + pt.x * s * f, y: props.y + (pt.y + j.groundOffset) * s};
};

const Limbs: React.FC<{j: Joints; pose: Pose; near: string; far: string; side: 'far' | 'near' | 'all'}> = ({j, pose, near, far, side}) => {
  const lw = (a: V, b: V, w: number, c: string) => (
    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={c} strokeWidth={w} strokeLinecap="round" />
  );
  const foot = (F: V, c: string) => lw(F, add(F, v(9, 1)), 7, c);
  const wP = 21;
  const wS = 26 + pose.expand * 10;
  const tp = [add(j.P, j.perp, wP / 2), add(j.S, j.perp, wS / 2 + pose.expand * 3), add(j.S, j.perp, -wS / 2), add(j.P, j.perp, -wP / 2)];
  const farPart = (
    <g>
      {lw(j.P, j.KF, 14, far)}
      {lw(j.KF, j.FF, 11, far)}
      {foot(j.FF, far)}
      {lw(j.S, j.EF, 10, far)}
      {lw(j.EF, j.HF, 8.5, far)}
    </g>
  );
  const nearPart = (
    <g>
      <polygon points={tp.map((q) => `${q.x},${q.y}`).join(' ')} fill={near} stroke={near} strokeWidth={9} strokeLinejoin="round" />
      {lw(j.N, add(j.N, j.dir, 4), 9, near)}
      <circle cx={j.head.x} cy={j.head.y} r={G.HEADR} fill={near} />
      {lw(j.P, j.KN, 14.5, near)}
      {lw(j.KN, j.FN, 11.5, near)}
      {foot(j.FN, near)}
      {lw(j.S, j.EN, 10.5, near)}
      {lw(j.EN, j.HN, 9, near)}
    </g>
  );
  if (side === 'far') return farPart;
  if (side === 'near') return nearPart;
  return (
    <g>
      {farPart}
      {nearPart}
    </g>
  );
};

export const Figure: React.FC<FigureProps> = ({x, y, pose, scale = 1, facing = 1, fill = C.BONE, rim = C.SUN, opacity = 1, heart = null, flat = false, outline = null}) => {
  const j = solve(pose);
  const far = flat ? fill : mixHex(fill, '#0A0C0F', 0.32);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale * facing} ${scale}) translate(0 ${j.groundOffset})`} opacity={opacity}>
      {outline ? (
        <g opacity={outline.opacity} style={{filter: `drop-shadow(0 0 ${outline.width}px ${outline.color})`}}>
          <Limbs j={j} pose={pose} near={outline.color} far={outline.color} side="all" />
        </g>
      ) : null}
      {rim && !flat ? (
        <g transform={`translate(${-1.8 * facing} -1.4)`}>
          <Limbs j={j} pose={pose} near={rim} far={mixHex(rim, '#0A0C0F', 0.5)} side="all" />
        </g>
      ) : null}
      <Limbs j={j} pose={pose} near={fill} far={far} side="all" />
      {heart ? (
        <g>
          <circle cx={j.heart.x} cy={j.heart.y} r={(heart.size ?? 3.4) * (3 + 2.4 * heart.pulse)} fill={heart.color} opacity={0.16 * (heart.glow ?? 1)} />
          <circle cx={j.heart.x} cy={j.heart.y} r={(heart.size ?? 3.4) * (1.6 + 0.9 * heart.pulse)} fill={heart.color} opacity={0.35 * (heart.glow ?? 1)} />
          <circle cx={j.heart.x} cy={j.heart.y} r={(heart.size ?? 3.4) * (0.9 + 0.35 * heart.pulse)} fill={heart.color} />
        </g>
      ) : null}
    </g>
  );
};
