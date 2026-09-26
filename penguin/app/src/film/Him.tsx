import React, {useId} from 'react';
import type {Sheet, SheetPart} from '../art/sheet';
import {FLAT_LOOK, PenguinRig, type RigLook} from '../rig/Penguin';
import type {HeadId, RigPose, Vec} from '../rig/types';
import {walkPose, type WalkOpts} from '../rig/walk';
import type {WorldPalette} from '../world/palette';

/**
 * HIM in the film: a storyboard view and pose, turned into the rig (or the sheet's back-view
 * drawings, or the top view), with his shadow on the snow.
 */
export type HimView = 'side' | 'front' | 'front34' | 'back' | 'back34' | 'top';
export type HimPose =
  | 'stand' | 'walk' | 'fallen' | 'toboggan' | 'airborne' | 'climb' | 'lifted' | 'shake' | 'lookup' | 'bow' | 'still';

/** Heads drawn facing the lens (they go on the front body); the rest are 3/4 or profile drawings. */
const FRONT_HEADS: HeadId[] = ['own', 'frown', 'surprised', 'laugh'];
/** The nearest lens-facing head for a front view. */
export const frontHead = (h: HeadId): HeadId => (FRONT_HEADS.includes(h) ? h : h === 'smirk' || h === 'profile' ? 'own' : 'frown');

export const poseFor = (sheet: Sheet, bodyId: '34' | 'front', pose: HimPose, beats: number, t: number, walk: WalkOpts): RigPose => {
  const body = sheet.bodies[bodyId];
  const J = body.joints;
  const pelvis: Vec = [(body.legs[bodyId === '34' ? 'Far' : 'L'].top.x + body.legs[bodyId === '34' ? 'Near' : 'R'].top.x) / 2, J[bodyId === '34' ? 'hipFar' : 'hipL'][1]];
  const breathe = {squash: 1 + 0.006 * Math.sin(t * 2.4), headTilt: 0.8 * Math.sin(t * 1.3)};
  switch (pose) {
    case 'walk':
      return walkPose(body, bodyId, beats, walk);
    case 'still':
      return {};
    case 'stand':
      return breathe;
    case 'lookup':
      return {...breathe, headTilt: -13, lean: -3};
    case 'bow':
      return {lean: 22, headTilt: 12};
    case 'shake':
      return {lean: 7 * Math.sin(t * 55), squash: 1 + 0.03 * Math.sin(t * 43), headTilt: 5 * Math.sin(t * 61), flipper: -25 * Math.sin(t * 50)};
    case 'fallen':
      // flat on his back, feet in the air
      return {spin: -84, pelvis: [-8, 72], ankleA: [pelvis[0] + 12, -128], ankleB: [pelvis[0] + 42, -136], footA: -82, footB: -76, bend: 1, flipper: -30};
    case 'toboggan': {
      // on his belly, head up and forward, legs trailing and kicking on the beat
      const kick = Math.sin(Math.PI * beats) * 10;
      return {spin: 78, pelvis: [0, 73], ankleA: [pelvis[0] - 92, -52 + kick], ankleB: [pelvis[0] - 100, -40 - kick], footA: 165, footB: 170, bend: -1, flipper: 55, headTilt: -18};
    }
    case 'airborne':
      // sailing: tipped forward, flippers out, legs trailing
      return {spin: 42, pelvis: [0, 10], ankleA: [pelvis[0] - 70, -70], ankleB: [pelvis[0] - 60, -52], footA: 110, footB: 100, bend: -1, flipper: -75, squash: 1.04, headTilt: -10};
    case 'lifted': {
      // held up under the flippers; his feet keep walking in the air
      const w = walkPose(body, bodyId, beats, {...walk, lift: 16});
      const up = -70;
      return {...w, pelvis: [0, up], ankleA: [w.ankleA![0], w.ankleA![1] + up], ankleB: [w.ankleB![0], w.ankleB![1] + up], lean: 0, flipper: -35};
    }
    case 'climb': {
      // up a slope: short high steps on the beat, leaning in, the flipper reaching for the rock
      const w = walkPose(body, bodyId, beats, {stride: 34, lift: 22, lean: 14, drop: 6, ...walk});
      return {...w, flipper: -118 + 22 * Math.sin(Math.PI * beats), headTilt: -6};
    }
    default:
      return breathe;
  }
};

/** Where the ankles rest when a pose leaves them alone. */
const restAnkles = (sheet: Sheet, bodyId: '34' | 'front'): [Vec, Vec] => {
  const b = sheet.bodies[bodyId];
  return bodyId === '34'
    ? [[b.legs.Far.ankle.x, b.joints.ankleFar[1]], [b.legs.Near.ankle.x, b.joints.ankleNear[1]]]
    : [[b.legs.L.ankle.x, b.joints.ankleL[1]], [b.legs.R.ankle.x, b.joints.ankleR[1]]];
};

/**
 * A pose between two poses (u 0-1): the in-betweens when he changes pose, so he gets up, dives,
 * lands and bows through the motion instead of snapping to it.
 */
export const blendPose = (sheet: Sheet, bodyId: '34' | 'front', a: RigPose, b: RigPose, u: number): RigPose => {
  const [rA, rB] = restAnkles(sheet, bodyId);
  const k = u * u * (3 - 2 * u);
  const n = (x: number | undefined, y: number | undefined, d: number) => (x ?? d) + ((y ?? d) - (x ?? d)) * k;
  const v = (x: Vec | undefined, y: Vec | undefined, d: Vec): Vec => [n(x?.[0], y?.[0], d[0]), n(x?.[1], y?.[1], d[1])];
  // with no explicit ankle, a spun pose carries the foot round the pelvis; blend from where it really is
  const ankle = (p: RigPose, d: Vec, key: 'ankleA' | 'ankleB'): Vec => {
    if (p[key]) return p[key]!;
    if (!p.spin) return d;
    const b = sheet.bodies[bodyId];
    const J = b.joints;
    const pel: Vec = bodyId === '34' ? [(b.legs.Far.top.x + b.legs.Near.top.x) / 2, J.hipFar[1]] : [(b.legs.L.top.x + b.legs.R.top.x) / 2, J.hipL[1]];
    const r = (p.spin * Math.PI) / 180;
    const off = p.pelvis ?? [0, 0];
    const dx = d[0] - pel[0];
    const dy = d[1] - pel[1];
    return [pel[0] + dx * Math.cos(r) - dy * Math.sin(r) + off[0], pel[1] + dx * Math.sin(r) + dy * Math.cos(r) + off[1]];
  };
  return {
    pelvis: v(a.pelvis, b.pelvis, [0, 0]),
    lean: n(a.lean, b.lean, 0),
    headTilt: n(a.headTilt, b.headTilt, 0),
    ankleA: v(ankle(a, rA, 'ankleA'), ankle(b, rA, 'ankleA'), rA),
    ankleB: v(ankle(a, rB, 'ankleB'), ankle(b, rB, 'ankleB'), rB),
    footA: n(a.footA ?? a.spin, b.footA ?? b.spin, 0),
    footB: n(a.footB ?? a.spin, b.footB ?? b.spin, 0),
    squash: n(a.squash, b.squash, 1),
    spin: n(a.spin, b.spin, 0),
    flipper: n(a.flipper, b.flipper, 0),
    bend: k < 0.5 ? a.bend : b.bend,
  };
};

type Props = {
  sheet: Sheet;
  P: WorldPalette;
  look?: RigLook;
  view: HimView;
  head: HeadId;
  facing?: 1 | -1;
  pose: HimPose;
  /** feet on the ground at (x, y), height h, frame px */
  x: number;
  y: number;
  h: number;
  beats: number;
  t: number;
  light?: Vec;
  walk?: WalkOpts;
  /** 0-1: head turned back over the shoulder */
  headTurn?: number;
  shadow?: boolean;
  /** the sun (or moon) on screen: he casts a long shadow away from it */
  sun?: {x: number; y: number} | null;
  /** a pose computed by the caller, instead of the named one */
  rigPose?: RigPose;
};

/** Scene-lit colors of the figure, for his shadow on the snow. */
const shadowLook = (lk: RigLook, c: string): RigLook => ({...lk, white: c, ink: c, navy: c, line: c, shade_: {torso: 0, head: 0, leg: 0, foot: 0}});

export const Him: React.FC<Props> = ({sheet, P, look = FLAT_LOOK, view, head, facing = 1, pose, x, y, h, beats, t, light, walk = {}, headTurn = 0, shadow = true, sun, rigPose: given}) => {
  const lk: RigLook = {...look, shade: P.bodyShade};
  if (view === 'top') return <TopView x={x} y={y} h={h} look={lk} facing={facing} />;
  if (view === 'back' || view === 'back34') {
    const turned = headTurn > 0.5;
    const hh = h * 0.72;
    if (pose === 'climb') {
      // the sheet's own Ascending drawing (crouched on the rock, so shorter)
      const part: SheetPart = sheet.poses['back.ascend'];
      const bob = pose === 'climb' ? -Math.abs(Math.sin(Math.PI * beats)) * hh * 0.03 : Math.sin(t * 2.4) * hh * 0.004;
      const sway = pose === 'climb' ? Math.sin(Math.PI * beats) * 4 : 0;
      const s = hh / part.height;
      return (
        <g>
          {shadow ? <ellipse cx={x} cy={y + 2} rx={hh * 0.28} ry={hh * 0.04} fill={P.snowShade} /> : null}
          <g transform={`translate(${x} ${y + bob}) rotate(${sway}) scale(${s * facing} ${s})`}>
            <path d={part.fill} fill={lk.white} fillRule="evenodd" />
            <path d={part.mass} fill={lk.ink} fillRule="evenodd" />
            <path d={part.lines} fill={lk.line ?? lk.ink} fillRule="evenodd" />
          </g>
        </g>
      );
    }
    const which = turned ? 'back.pause' : 'back.static';
    return <BackWalker part={sheet.poses[which]} cut={CUTS[which]} look={lk} P={P} x={x} y={y} h={h} beats={beats} t={t} walking={pose === 'walk' && !turned} facing={facing} shadow={shadow} />;
  }
  const front = view === 'front';
  const bodyId = front ? 'front' : '34';
  const hd = front ? frontHead(head) : head;
  const body = sheet.bodies[bodyId];
  const rigPose = given ?? poseFor(sheet, bodyId, pose, beats, t, walk);
  const s = h / body.height;
  const lying = pose === 'fallen' || pose === 'toboggan';
  const inAir = pose === 'airborne' || pose === 'lifted';
  const walking = pose === 'walk';
  const rig = (l: RigLook) => (
    <PenguinRig body={body} bodyId={bodyId} heads={sheet.heads} head={hd} pose={rigPose} x={x} y={y} h={h} facing={facing} light={light} look={l} headFlip={headTurn > 0.5 && !front} />
  );
  // a long shadow away from a low sun, for figures big enough to show it
  const cast = shadow && sun && !inAir && !lying && h >= 90 && sun.y < y ? Math.max(-1.1, Math.min(1.1, (sun.x - x) / 700)) : 0;
  const feet = walking && !front
    ? [
        {a: rigPose.ankleA!, rest: body.joints.ankleFar[1] - 6, dy: -6 * s * 0.6},
        {a: rigPose.ankleB!, rest: body.joints.ankleNear[1], dy: 0},
      ]
    : [];
  return (
    <g>
      {shadow && cast ? (
        <g transform={`translate(${x} ${y}) matrix(1 0 ${cast.toFixed(3)} -0.1 0 0) translate(${-x} ${-y})`} opacity={0.9}>
          <PenguinRig body={body} bodyId={bodyId} heads={sheet.heads} head={hd} pose={rigPose} x={x} y={y} h={h} facing={facing} look={shadowLook(lk, P.snowShade)} flat />
        </g>
      ) : null}
      {shadow ? (
        lying ? (
          <ellipse cx={x + (pose === 'toboggan' ? 60 : -90) * s * facing} cy={y + 2} rx={170 * s} ry={9 * s} fill={P.snowShade} />
        ) : inAir || pose === 'climb' ? null : feet.length ? (
          feet.map((ft, i) => {
            const lift = Math.max(0, ft.rest - ft.a[1]);
            const k = Math.max(0.35, 1 - lift / 30);
            return <ellipse key={i} cx={x + (ft.a[0] + 12) * s * facing} cy={y + ft.dy + 2} rx={30 * s * k} ry={5 * s * k} fill={P.snowShade} />;
          })
        ) : (
          <ellipse cx={x + (front ? 0 : 18) * s * facing} cy={y + 2} rx={62 * s} ry={8 * s} fill={P.snowShade} />
        )
      ) : null}
      {rig(lk)}
    </g>
  );
};

/**
 * From behind, walking away or standing: the sheet's back drawings (Static, and Pause and Check
 * for a look back) above the hips, and legs drawn under them that step on the beat.
 *
 * The back drawings are small thumbnails on the sheet, drawn with a bigger head and a shorter body
 * than the front and 3/4 views; so the torso is lengthened and the legs drawn to the front view's
 * measure (white pants to a hem, bare ankles), and he's the same size whichever way he faces.
 */
type BackCut = {
  /** the drawing without its legs (sheet px) */
  clip: Vec[];
  /** sheet y where the head meets the body, and where the legs come out */
  neck: number;
  hip: number;
  /** sheet x of the two hips */
  hips: [number, number];
};
const CUTS: Record<'back.static' | 'back.pause', BackCut> = {
  'back.static': {
    clip: [
      [1150, 430], [1255, 430], [1255, 529], [1226, 529], [1219, 534], [1211, 541], [1206, 551], [1201, 556],
      [1196, 551], [1192, 541], [1186, 537], [1181, 536], [1181, 516], [1171, 516], [1171, 531], [1150, 531],
    ],
    neck: 478,
    hip: 531,
    hips: [1189, 1212],
  },
  'back.pause': {
    clip: [[1245, 430], [1350, 430], [1350, 506], [1307, 506], [1306, 540], [1297, 549], [1284, 549], [1280, 538], [1276, 530], [1245, 530]],
    neck: 474,
    hip: 540,
    hips: [1285, 1301],
  },
};
/** drawing scale (by the head), torso stretch, and his full height, as fractions of h */
const BACK_SCALE = 0.66;
const TORSO = 1.45;
const TALL = 0.95;

const BackWalker: React.FC<{
  part: SheetPart;
  cut: BackCut;
  look: RigLook;
  P: WorldPalette;
  x: number;
  y: number;
  h: number;
  beats: number;
  t: number;
  walking: boolean;
  facing: 1 | -1;
  shadow: boolean;
}> = ({part, cut, look, P, x, y, h, beats, t, walking, facing, shadow}) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const k = (BACK_SCALE * h) / part.height; // px per drawing unit
  const [ax, ay] = part.anchor;
  const clip = cut.clip.map(([px, py]) => `${(px - ax).toFixed(1)},${(py - ay).toFixed(1)}`).join(' ');
  const neck = cut.neck - ay;
  const hip = cut.hip - ay;
  const top = part.top;
  // the legs make up the rest of his height
  const upper = neck - top + (hip - neck) * TORSO;
  const legs = (TALL * h) / k - upper;
  const E = legs + hip; // how far the upper body is raised
  // centered on x (the drawing's anchor is one foot)
  const cx = (cut.hips[0] + cut.hips[1]) / 2 - ax;
  const hipL = cut.hips[0] - ax;
  const hipR = cut.hips[1] - ax;

  const u = ((beats % 1) + 1) % 1;
  // weight goes onto the foot that just landed: the body dips, then rises, and rocks over it
  const side = Math.cos(Math.PI * beats);
  const bob = walking ? 2.4 * (0.5 * Math.cos(2 * Math.PI * (u - 0.18)) + 0.1) : 0.35 * Math.sin(t * 2.4);
  const rock = walking ? 3 * side : 0;
  const shift = walking ? 1.4 * side : 0;
  const pivotX = (hipL + hipR) / 2;
  const hipY = -legs;
  const moved = (hx: number): Vec => {
    const r = (rock * Math.PI) / 180;
    const dx = hx - pivotX;
    return [pivotX + dx * Math.cos(r) + shift, hipY + dx * Math.sin(r) + bob];
  };
  const legPhase = (off: number) => ((((beats - off) / 2) % 1) + 1) % 1;
  const foot = (hx: number, p: number) => {
    const rest: Vec = [hx + (hx < pivotX ? -1.5 : 1.5), -6];
    if (!walking || p < 0.5) return {a: rest, lift: 0};
    const q = (p - 0.5) / 0.5;
    const up = Math.sin(Math.PI * q);
    return {a: [rest[0], rest[1] - up * 9] as Vec, lift: up};
  };
  const lw = 1.7;
  const ink = look.line ?? look.ink;
  const leg = (hx: number, f: {a: Vec; lift: number}, key: string) => {
    const hp = moved(hx);
    const a = f.a;
    const hem: Vec = [hp[0] + (a[0] - hp[0]) * 0.55, hp[1] + (a[1] - hp[1]) * 0.55];
    const pants = (w0: number, w1: number) => {
      const dx = hem[0] - hp[0];
      const dy = hem[1] - hp[1];
      const l = Math.hypot(dx, dy) || 1;
      const nx = -dy / l;
      const ny = dx / l;
      const top: Vec = [hp[0] - (dx / l) * 14, hp[1] - (dy / l) * 14];
      return `M${top[0] + nx * w0} ${top[1] + ny * w0}L${hem[0] + nx * w1} ${hem[1] + ny * w1}L${hem[0] - nx * w1} ${hem[1] - ny * w1}L${top[0] - nx * w0} ${top[1] - ny * w0}Z`;
    };
    // heel from behind; lifted, the foot tips up and shows its webbed sole
    const heel = `M${a[0] - 5.5} ${a[1] + 6}C${a[0] - 6.5} ${a[1] + 2} ${a[0] - 3} ${a[1] + 0.5} ${a[0]} ${a[1] + 0.5}C${a[0] + 3} ${a[1] + 0.5} ${a[0] + 6.5} ${a[1] + 2} ${a[0] + 5.5} ${a[1] + 6}Z`;
    const sole = `M${a[0] - 5} ${a[1] + 5}L${a[0] - 7.5} ${a[1] + 12}L${a[0] - 2.5} ${a[1] + 10}L${a[0]} ${a[1] + 13.5}L${a[0] + 2.5} ${a[1] + 10}L${a[0] + 7.5} ${a[1] + 12}L${a[0] + 5} ${a[1] + 5}Z`;
    return (
      <g key={key}>
        <line x1={hem[0]} y1={hem[1]} x2={a[0]} y2={a[1] + 2} stroke={ink} strokeWidth={8 + lw * 2} strokeLinecap="round" />
        <line x1={hem[0]} y1={hem[1]} x2={a[0]} y2={a[1] + 2} stroke={look.white} strokeWidth={8} strokeLinecap="round" />
        <path d={pants(8, 8.8)} fill={look.white} stroke={ink} strokeWidth={lw} strokeLinejoin="round" />
        {f.lift > 0.25 ? <path d={sole} fill={look.white} stroke={ink} strokeWidth={lw} strokeLinejoin="round" /> : null}
        <path d={heel} fill={look.white} stroke={ink} strokeWidth={lw} strokeLinejoin="round" />
      </g>
    );
  };
  const drawing = (
    <>
      <path d={part.fill} fill={look.white} fillRule="evenodd" />
      <path d={part.mass} fill={look.ink} fillRule="evenodd" />
      <path d={part.lines} fill={ink} fillRule="evenodd" />
    </>
  );
  const big = 400;
  return (
    <g>
      {shadow ? <ellipse cx={x} cy={y + 2} rx={h * 0.19} ry={h * 0.032} fill={P.snowShade} /> : null}
      <g transform={`translate(${x} ${y}) scale(${k * facing} ${k}) translate(${-cx} 0)`}>
        <defs>
          <clipPath id={`bu${id}`}>
            <polygon points={clip} />
          </clipPath>
          <clipPath id={`bb${id}`}>
            <rect x={-big} y={neck - 0.5} width={big * 2} height={big} />
          </clipPath>
          <clipPath id={`bh${id}`}>
            <rect x={-big} y={neck - big} width={big * 2} height={big + 1.5} />
          </clipPath>
          <clipPath id={`bm${id}`}>
            <path d={part.mass} clipRule="evenodd" />
          </clipPath>
        </defs>
        {leg(hipL, foot(hipL, legPhase(1)), 'l')}
        {leg(hipR, foot(hipR, legPhase(0)), 'r')}
        <g transform={`translate(${shift} ${bob}) rotate(${rock} ${pivotX} ${hipY})`}>
          <g transform={`translate(0 ${-E}) translate(0 ${hip}) scale(1 ${TORSO}) translate(0 ${-hip})`}>
            <g clipPath={`url(#bu${id})`}>
              <g clipPath={`url(#bb${id})`}>{drawing}</g>
            </g>
          </g>
          <g transform={`translate(0 ${-(hip - neck) * (TORSO - 1) - E})`}>
            <g clipPath={`url(#bu${id})`}>
              <g clipPath={`url(#bh${id})`}>{drawing}</g>
            </g>
            <g clipPath={`url(#bm${id})`}>
              <rect x={-big} y={neck - 1.2} width={big * 2} height={3.4} fill={look.ink} />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
};

/** From straight above (S32, S34): body, head with its crest, flippers out, beak ahead. */
export const TopView: React.FC<{x: number; y: number; h: number; look: RigLook; facing?: 1 | -1; angle?: number}> = ({x, y, h, look, facing = 1, angle = 0}) => {
  // from above, his length is about 45% of his standing height
  const s = (h * 0.45) / 80;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s * facing} ${s})`}>
      <ellipse cx={-4} cy={0} rx={30} ry={17} fill={look.ink} />
      <path d="M -6 -15 Q 8 -32 22 -30 Q 12 -20 6 -12 Z" fill={look.navy} stroke={look.ink} strokeWidth={1.5} />
      <path d="M -6 15 Q 8 32 22 30 Q 12 20 6 12 Z" fill={look.navy} stroke={look.ink} strokeWidth={1.5} />
      <ellipse cx={-24} cy={-7} rx={6} ry={4} fill={look.white} stroke={look.ink} strokeWidth={1.5} />
      <ellipse cx={-24} cy={7} rx={6} ry={4} fill={look.white} stroke={look.ink} strokeWidth={1.5} />
      <circle cx={24} cy={0} r={12} fill={look.ink} />
      <path d="M 20 -9 L 14 -16 M 20 9 L 14 16" stroke={look.white} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M 34 -3.5 L 46 0 L 34 3.5 Z" fill={look.white} stroke={look.ink} strokeWidth={1.5} strokeLinejoin="round" />
    </g>
  );
};
