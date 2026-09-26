import type {SheetBody} from '../art/sheet';
import type {RigPose, Vec} from './types';

/**
 * The walk, locked to the song: one step per beat, a foot lands exactly on every beat.
 *
 * `beats` is the continuous beat count (timing/song.ts beatsAt). A classic 2D walk with weight:
 * contact on the beat, the body sinks into the "down" pose just after it (the planted leg bends to
 * take the weight), rises through "passing" to the "up" pose, and falls into the next contact.
 * The planted foot stays flat and still on the snow; only at the end does the heel peel off.
 * The swinging foot lifts, travels and lands flat.
 *
 * Walking speed is `stride` body units per beat: move the figure (or scroll the ground) at exactly
 * that rate and the planted foot doesn't slide.
 */
export type WalkOpts = {
  /** step length, body units (the body travels this far per beat) */
  stride?: number;
  /** foot lift at mid-swing, body units */
  lift?: number;
  /** how far the body sinks into the down pose, body units */
  drop?: number;
  /** forward lean, degrees */
  lean?: number;
  /** the ground rises this many degrees toward where he's going (climbing) */
  slope?: number;
};

export const WALK_STRIDE = 70;

const smooth = (t: number) => t * t * (3 - 2 * t);
const TAU = Math.PI * 2;

/** Rest ankle position of a foot, and the line it walks on (the far foot a little farther back). */
const footLine = (body: SheetBody, view: '34' | 'front', side: 'A' | 'B'): Vec => {
  const [kA, kB] = view === '34' ? ['Far', 'Near'] : ['L', 'R'];
  const k = side === 'A' ? kA : kB;
  const rest: Vec = [body.legs[k].ankle.x, body.joints[`ankle${k}`][1]];
  return view === '34' && side === 'A' ? [rest[0] - 3, rest[1] - 6] : rest;
};

export const walkPose = (body: SheetBody, view: '34' | 'front', beats: number, o: WalkOpts = {}): RigPose => {
  const stride = o.stride ?? WALK_STRIDE;
  const lift = o.lift ?? 12;
  const drop = o.drop ?? 8;
  const lean = o.lean ?? 3;
  const rise = Math.tan(((o.slope ?? 0) * Math.PI) / 180);
  const restA = footLine(body, view, 'A');
  const restB = footLine(body, view, 'B');

  // leg phase over two beats: 0 = this foot lands. Near/right lands on even beats, far/left on odd.
  const legPhase = (offset: number) => ((((beats - offset) / 2) % 1) + 1) % 1;
  const foot = (rest: Vec, p: number): {pos: Vec; angle: number} => {
    if (view === 'front') {
      // toward the lens: the swinging foot lifts and comes down the frame a little
      const q = p >= 0.5 ? (p - 0.5) / 0.5 : 0;
      const up = Math.sin(Math.PI * q) * lift * 1.3;
      const fwd = p < 0.5 ? 1 - p / 0.5 : smooth(q);
      return {pos: [rest[0], rest[1] - up + (fwd - 0.5) * stride * 0.06], angle: 0};
    }
    if (p < 0.5) {
      // planted: flat and still on the snow (it slides back in the body frame at walking speed)
      const u = p / 0.5;
      const x = rest[0] + stride / 2 - stride * u;
      const peel = u > 0.72 ? smooth((u - 0.72) / 0.28) : 0;
      return {pos: [x, rest[1] - peel * 4], angle: peel * 10};
    }
    // swinging: heel already up, the foot lifts, travels and lands flat
    const q = (p - 0.5) / 0.5;
    const x = rest[0] - stride / 2 + stride * smooth(q);
    const y = rest[1] - 4 * (1 - q) * (1 - q) - lift * Math.pow(Math.sin(Math.PI * Math.min(1, q * 1.05)), 0.9);
    const angle = q < 0.4 ? 10 * (1 - q / 0.4) : q < 0.85 ? -4 * ((q - 0.4) / 0.45) : -4 * (1 - (q - 0.85) / 0.15);
    return {pos: [x, y], angle};
  };

  // on a slope, a foot ahead of its rest spot sits higher, and lies along the slope
  const onSlope = (rest: Vec, f: {pos: Vec; angle: number}) =>
    rise ? {pos: [f.pos[0], f.pos[1] - (f.pos[0] - rest[0]) * rise] as Vec, angle: f.angle - (o.slope ?? 0)} : f;
  const a = onSlope(restA, foot(restA, legPhase(1)));
  const b = onSlope(restB, foot(restB, legPhase(0)));

  // the body: down just after each footfall, up just before the next
  const u = ((beats % 1) + 1) % 1;
  const wave = Math.cos(TAU * (u - 0.18));
  return {
    pelvis: [0, drop * (0.5 * wave + 0.1)],
    lean: lean + 1.5 * Math.sin(TAU * (u - 0.1)),
    headTilt: -1.2 * Math.cos(TAU * (u - 0.35)),
    squash: 1 - 0.015 * wave,
    ankleA: a.pos,
    ankleB: b.pos,
    footA: a.angle,
    footB: b.angle,
    // the near flipper swings against the near leg, a touch behind it
    flipper: view === '34' ? 9 * Math.cos(Math.PI * (beats - 0.12)) : 0,
  };
};

/**
 * Every footfall so far, for snow prints: which foot, the beat it landed on, and where it landed in
 * the body frame at that moment (x, y). In a tracking shot a print made on beat k is now
 * (beats - k) * stride body units behind where it landed.
 */
export const footfalls = (body: SheetBody, view: '34' | 'front', beats: number, o: WalkOpts = {}, from = -Infinity) => {
  const stride = o.stride ?? WALK_STRIDE;
  const out: {k: number; side: 'A' | 'B'; x: number; y: number}[] = [];
  const last = Math.floor(beats + 1e-6);
  for (let k = Math.max(Math.ceil(from), last - 14); k <= last; k++) {
    const side = ((k % 2) + 2) % 2 === 0 ? 'B' : 'A';
    const rest = footLine(body, view, side);
    out.push({k, side, x: rest[0] + stride / 2, y: rest[1]});
  }
  return out;
};
