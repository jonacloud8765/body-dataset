import type {SheetBody} from '../art/sheet';
import type {RigPose, Vec} from './types';

/**
 * The walk, locked to the song: one step per beat, a foot lands exactly on every beat.
 *
 * `beats` is the continuous beat count (timing/song.ts beatsAt). Over a two-beat cycle each leg
 * plants on its beat (heel first), stays planted while the body passes over it (it slides back in
 * the body frame at walking speed, which is what keeps it still on the ground), rolls onto the toe,
 * and swings forward in an arc to land on the next-but-one beat. The body is lowest when the feet
 * land and highest when they pass, leans into the walk, and the head lags a little behind.
 *
 * Walking speed is `stride` body units per beat: move the figure (or scroll the ground) at exactly
 * that rate and the planted foot doesn't slide.
 */
export type WalkOpts = {
  /** step length, body units (the body travels this far per beat) */
  stride?: number;
  /** foot lift at mid-swing, body units */
  lift?: number;
  /** body drop at each footfall, body units */
  bob?: number;
  /** forward lean, degrees */
  lean?: number;
  /** 0-1: how much the gait bounces (anime walks bounce) */
  bounce?: number;
};

const ease = (t: number) => t * t * (3 - 2 * t);

export const WALK_STRIDE = 70;

export const walkPose = (body: SheetBody, view: '34' | 'front', beats: number, o: WalkOpts = {}): RigPose => {
  const stride = o.stride ?? WALK_STRIDE;
  const lift = o.lift ?? 14;
  const bob = o.bob ?? 5;
  const lean = o.lean ?? 3;
  const bounce = o.bounce ?? 1;
  const [kA, kB] = view === '34' ? ['Far', 'Near'] : ['L', 'R'];
  const J = body.joints;
  const restA: Vec = [body.legs[kA].ankle.x, J[`ankle${kA}`][1]];
  const restB: Vec = [body.legs[kB].ankle.x, J[`ankle${kB}`][1]];

  // leg phase: 0 = this foot lands. The near foot lands on even beats, the far foot on odd ones.
  const legPhase = (offset: number) => ((((beats - offset) / 2) % 1) + 1) % 1;
  const foot = (rest: Vec, p: number): {pos: Vec; angle: number} => {
    if (view === 'front') {
      // walking toward the lens: the foot lifts and comes forward (down the frame), no sideways travel
      const swing = p >= 0.5 ? (p - 0.5) / 0.5 : 0;
      const up = Math.sin(Math.PI * swing) * lift * 1.2;
      const fwd = p < 0.5 ? 1 - p / 0.5 : ease(swing);
      return {pos: [rest[0], rest[1] - up + (fwd - 0.5) * stride * 0.08], angle: 0};
    }
    if (p < 0.5) {
      // stance: planted, sliding back under the body; heel strike -> flat -> toe off
      const u = p / 0.5;
      const x = rest[0] + stride / 2 - stride * u;
      const angle = u < 0.15 ? -14 * (1 - u / 0.15) : u > 0.75 ? 26 * ((u - 0.75) / 0.25) : 0;
      // rolling onto the toe lifts the ankle
      const heel = u > 0.75 ? Math.sin(((u - 0.75) / 0.25) * Math.PI * 0.5) * 7 : 0;
      return {pos: [x, rest[1] - heel], angle};
    }
    // swing: toe leaves, the foot arcs forward and reaches for the next landing
    const u = (p - 0.5) / 0.5;
    const x = rest[0] - stride / 2 + stride * ease(u);
    const y = rest[1] - 7 * (1 - u) - Math.sin(Math.PI * u) * lift;
    const angle = u < 0.3 ? 26 - 40 * (u / 0.3) : -14 * Math.min(1, (u - 0.3) / 0.5);
    return {pos: [x, y], angle};
  };

  const pA = legPhase(1);
  const pB = legPhase(0);
  // in 3/4 the far foot walks on a line a little farther back (higher in frame), so the legs read
  // as passing one behind the other rather than crossing
  const farLine: Vec = view === '34' ? [restA[0] - 3, restA[1] - 6] : restA;
  const a = foot(farLine, pA);
  const b = foot(restB, pB);

  // body: lowest at each footfall (twice per cycle), highest as the feet pass
  const c = beats * Math.PI; // one bob per beat
  const down = (0.5 + 0.5 * Math.cos(2 * c)) * bob * bounce;
  const sway = Math.sin(c) * (view === '34' ? 1.2 : 2.5);
  return {
    pelvis: [0, down - bob * 0.5],
    lean: lean + sway * 0.4,
    headTilt: -0.8 * Math.sin(2 * c + 0.9) * bounce,
    squash: 1 - 0.012 * Math.cos(2 * c) * bounce,
    ankleA: a.pos,
    ankleB: b.pos,
    footA: a.angle,
    footB: b.angle,
  };
};
