import React, {useId} from 'react';
import type {LegMeasure, SheetBody, SheetPart} from '../art/sheet';
import type {BodyId, HeadId, RigPose, Vec} from './types';

/**
 * HIM, rigged from the traced model sheet, in anime cel style.
 *
 * - torso, head and feet are the sheet's own drawings (traced), cut apart and reassembled in the
 *   body frame (sheet px, origin at the feet baseline center, y down)
 * - the legs are drawn to the sheet's measurements (tapered pants legs with a hem, bare ankles), so
 *   the knees can bend and the feet can stay planted: ankles go where the pose puts them, knees solve
 * - heads swap at the neck; each sheet head was registered onto each body by the tracer, and blends
 *   into the body's own neck over a short band
 * - cel shading comes from the light direction, per part: a hard shadow band where a white area
 *   turns away from the light (or meets the black), and a rim on the lit edge
 */

export type RigLook = {
  white: string;
  ink: string;
  navy: string;
  shade: string;
  rim: string;
  /** the flipper tips turn navy in one hard step instead of a gradient */
  hardNavy?: boolean;
  /** line work color, if not the ink of the solid black areas */
  line?: string;
  /** shadow and rim widths in body units (sheet px) */
  shade_: {torso: number; head: number; leg: number; foot: number};
  rim_: {torso: number; head: number; leg: number; foot: number};
};

export const ANIME_LOOK: RigLook = {
  white: '#FFFFFF',
  ink: '#1A1C28',
  navy: '#1F3A6A',
  shade: '#C3CCEA',
  rim: '#5E7BBE',
  shade_: {torso: 17, head: 9, leg: 9, foot: 6},
  rim_: {torso: 4, head: 3, leg: 3, foot: 2},
};

/** The film's look: flat 2D. Flat fills, the sheet's line work, one hard shadow tone, no rim. */
export const FLAT_LOOK: RigLook = {
  white: '#FBF8F2',
  ink: '#1D2133',
  navy: '#26406A',
  shade: '#C9CCE2',
  rim: '#000000',
  hardNavy: true,
  shade_: {torso: 15, head: 8, leg: 8, foot: 0},
  rim_: {torso: 0, head: 0, leg: 0, foot: 0},
};

const LINE = 2.4; // outline weight of the drawn legs, sheet px (matches the traced line work)

const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1]];
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1]];
const len = (a: Vec) => Math.hypot(a[0], a[1]);
const lerp = (a: Vec, b: Vec, t: number): Vec => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const rot = (p: Vec, c: Vec, deg: number): Vec => {
  const r = (deg * Math.PI) / 180;
  const dx = p[0] - c[0];
  const dy = p[1] - c[1];
  return [c[0] + dx * Math.cos(r) - dy * Math.sin(r), c[1] + dx * Math.sin(r) + dy * Math.cos(r)];
};
const rotV = (v: Vec, deg: number): Vec => rot(v, [0, 0], deg);
const f2 = (n: number) => n.toFixed(2);

/** Two-bone IK: the knee for a hip, an ankle and bone lengths, bending toward `bend` (+1 = +x). */
const solveKnee = (hip: Vec, ankle: Vec, a: number, b: number, bend: number): Vec => {
  const d0 = sub(ankle, hip);
  const d = Math.max(Math.abs(a - b) + 0.01, Math.min(a + b - 0.01, len(d0)));
  const cosA = (a * a + d * d - b * b) / (2 * a * d);
  const ang = Math.acos(Math.max(-1, Math.min(1, cosA)));
  const base = Math.atan2(d0[1], d0[0]);
  const k1: Vec = [hip[0] + a * Math.cos(base - ang), hip[1] + a * Math.sin(base - ang)];
  const k2: Vec = [hip[0] + a * Math.cos(base + ang), hip[1] + a * Math.sin(base + ang)];
  return (k1[0] - k2[0]) * bend > 0 ? k1 : k2;
};

/** A tube along a polyline with a width per point, as a closed path. */
const tube = (pts: Vec[], widths: number[]) => {
  const L: Vec[] = [];
  const R: Vec[] = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const t = sub(b, a);
    const l = len(t) || 1;
    const n: Vec = [-t[1] / l, t[0] / l];
    const w = widths[i] / 2;
    L.push([p[0] + n[0] * w, p[1] + n[1] * w]);
    R.push([p[0] - n[0] * w, p[1] - n[1] * w]);
  });
  const all = [...L, ...R.reverse()];
  return all.map((p, i) => `${i ? 'L' : 'M'}${f2(p[0])} ${f2(p[1])}`).join('') + 'Z';
};

type Props = {
  body: SheetBody;
  bodyId: BodyId;
  heads: Record<string, SheetPart>;
  head: HeadId;
  pose?: RigPose;
  /** feet baseline center in frame px, and height in frame px */
  x: number;
  y: number;
  h: number;
  facing?: 1 | -1;
  /** unit vector toward the light, in screen space */
  light?: Vec;
  look?: RigLook;
  /** skip the cel shading (tiny figures) */
  flat?: boolean;
  /**
   * 'forward': the far foot is drawn with the near foot's drawing, toes pointing where he's going
   * (walking, profile). 'sheet': the sheet's own 3/4 stance, far foot splayed out.
   */
  farFoot?: 'forward' | 'sheet';
  /** the head turned to look back over his shoulder (mirrored at the neck) */
  headFlip?: boolean;
};

export const PenguinRig: React.FC<Props> = ({body, bodyId, heads, head, pose = {}, x, y, h, facing = 1, light = [0.95, -0.3], look = ANIME_LOOK, flat, farFoot = 'forward', headFlip = false}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const s = h / body.height;
  const J = body.joints;
  const side = bodyId === '34';
  const [kA, kB] = side ? ['Far', 'Near'] : ['L', 'R'];
  const mA: LegMeasure = body.legs[kA];
  const mB: LegMeasure = body.legs[kB];
  const hipA0: Vec = [mA.top.x, J[`hip${kA}`][1]];
  const hipB0: Vec = [mB.top.x, J[`hip${kB}`][1]];
  const ankA0: Vec = [mA.ankle.x, J[`ankle${kA}`][1]];
  const ankB0: Vec = [mB.ankle.x, J[`ankle${kB}`][1]];
  const pelvis0 = lerp(hipA0, hipB0, 0.5);

  // upper body: pelvis offset, lean and squash around the pelvis
  const off = pose.pelvis ?? [0, 0];
  const spin = pose.spin ?? 0;
  const lean = (pose.lean ?? 0) + spin;
  const sq = pose.squash ?? 1;
  const upper = (p: Vec): Vec => {
    const q: Vec = [pelvis0[0] + (p[0] - pelvis0[0]) / Math.sqrt(sq), pelvis0[1] + (p[1] - pelvis0[1]) * sq];
    return add(rot(q, pelvis0, lean), off);
  };
  const upperT = `translate(${f2(off[0])} ${f2(off[1])}) rotate(${f2(lean)} ${f2(pelvis0[0])} ${f2(pelvis0[1])}) translate(${f2(pelvis0[0])} ${f2(pelvis0[1])}) scale(${f2(1 / Math.sqrt(sq))} ${f2(sq)}) translate(${f2(-pelvis0[0])} ${f2(-pelvis0[1])})`;
  // a whole-figure spin carries the feet around the pelvis too
  const spinP = (p: Vec): Vec => (spin ? add(rot(p, pelvis0, spin), off) : p);

  // light, as a unit vector in the body frame (the rig may be mirrored)
  const Lb: Vec = [light[0] * facing, light[1]];

  // the sheet's 3/4 far foot splays out backward; walking, both feet point the way he's going
  const fwd = side && farFoot === 'forward';
  // the forward foot is drawn standing 10 px above the sheet's baseline (the other foot reaches
  // it): on his feet, he stands that much lower so both soles are on the snow
  const sole = fwd ? 10 * Math.max(0, 1 - Math.abs(pose.spin ?? 0) / 30) : 0;
  const legs = [
    {m: mA, hip: upper(hipA0), ankle: pose.ankleA ?? spinP(ankA0), hip0: hipA0, ank0: ankA0, foot: body.parts[fwd ? `foot${kB}` : `foot${kA}`], footAnk0: fwd ? ankB0 : ankA0, footAngle: pose.footA ?? spin, bend: pose.bend ?? 1, flat: side ? 1 : 0.25},
    {m: mB, hip: upper(hipB0), ankle: pose.ankleB ?? spinP(ankB0), hip0: hipB0, ank0: ankB0, foot: body.parts[`foot${kB}`], footAnk0: ankB0, footAngle: pose.footB ?? spin, bend: pose.bend ?? 1, flat: side ? 1 : 0.25},
  ];

  const legShapes = (L: (typeof legs)[number]) => {
    const rest = len(sub(L.ank0, L.hip0)) * 1.012;
    const a = rest * 0.46;
    const b = rest - a;
    let knee = solveKnee(L.hip, L.ankle, a, b, L.bend);
    if (L.flat < 1) knee = lerp(lerp(L.hip, L.ankle, a / (a + b)), knee, L.flat);
    // centerline: from above the hip (hidden under the torso) through a rounded knee to the ankle
    const up = sub(L.hip, knee);
    const top = add(L.hip, [(up[0] / (len(up) || 1)) * 16, (up[1] / (len(up) || 1)) * 16]);
    const r = Math.min(10, a * 0.35, b * 0.35);
    const kin = lerp(knee, L.hip, r / a);
    const kout = lerp(knee, L.ankle, r / b);
    const pts: Vec[] = [top, L.hip];
    for (let i = 0; i <= 6; i++) pts.push(lerp(L.hip, kin, i / 6));
    for (let i = 1; i <= 6; i++) {
      const t = i / 6;
      pts.push(lerp(lerp(kin, knee, t), lerp(knee, kout, t), t));
    }
    for (let i = 1; i <= 8; i++) pts.push(lerp(kout, L.ankle, i / 8));
    // arc length along it, to put the hem where it sits at rest
    const acc = [0];
    for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + len(sub(pts[i], pts[i - 1])));
    const dCut = acc[1] + (L.m.cut - L.hip0[1]);
    const dTop = Math.max(dCut, acc[1] + (L.m.top.y - L.hip0[1]));
    const dHem = acc[1] + (L.m.cuff - L.hip0[1]);
    const cut = (d: number) => {
      const i = Math.max(1, acc.findIndex((v) => v >= d));
      const t = (d - acc[i - 1]) / Math.max(1e-6, acc[i] - acc[i - 1]);
      return {i, p: lerp(pts[i - 1], pts[i], Math.max(0, Math.min(1, t)))};
    };
    const hem = cut(dHem);
    const pantsPts = [...pts.slice(0, hem.i), hem.p];
    const pantsAcc = [...acc.slice(0, hem.i), dHem];
    const wAt = (d: number) => {
      // hidden under the torso the leg narrows (so it can't poke out at the hip); it reaches its full
      // measured width a little above the cut, so the change never shows
      const full = L.m.top.w - LINE;
      const narrow = Math.min(L.m.top.w, L.m.hem.w) - LINE - 6;
      if (d < dCut - 3) return narrow + (full - narrow) * Math.max(0, Math.min(1, (d - (dCut - 12)) / 9));
      const t = Math.max(0, Math.min(1, (d - dTop) / Math.max(1, dHem - dTop)));
      return full + (L.m.hem.w - L.m.top.w) * t;
    };
    const pants = tube(pantsPts, pantsAcc.map(wAt));
    const ankPts = [lerp(hem.p, pts[Math.min(pts.length - 1, hem.i)], -0.6), hem.p, ...pts.slice(hem.i)];
    const ankle = tube(ankPts, ankPts.map(() => L.m.ankle.w - LINE));
    const footT = `translate(${f2(L.ankle[0])} ${f2(L.ankle[1])}) rotate(${f2(L.footAngle)}) translate(${f2(-L.footAnk0[0])} ${f2(-L.footAnk0[1])})`;
    return {pants, ankle, footT};
  };

  // the head: the body's own, or a sheet head laid on by its registration; tilts at the neck
  const tilt = pose.headTilt ?? 0;
  const headPart = head === 'own' ? body.parts.head : heads[head];
  const reg = head === 'own' ? null : body.heads[head];
  const fade = body.fade[head === 'own' ? 'own' : 'sheet'];
  const neckT = `${upperT} rotate(${f2(tilt)} ${f2(J.neck[0])} ${f2(J.neck[1])})`;
  const regT = reg ? `translate(${f2(reg.x)} ${f2(reg.y)}) scale(${f2(reg.s)})` : '';

  const torso = body.parts.torso;
  const navyTop = torso.top + torso.height * 0.42;
  const navyBottom = torso.top + torso.height * 0.84;
  const W = look.shade_;
  const RIM = look.rim_;

  return (
    <g transform={`translate(${f2(x)} ${f2(y)}) scale(${f2(s * facing)} ${f2(s)}) translate(0 ${sole})`} style={{isolation: 'isolate'}}>
      <defs>
        <linearGradient id={`navy${uid}`} gradientUnits="userSpaceOnUse" x1={0} y1={navyTop} x2={0} y2={navyBottom}>
          {look.hardNavy ? (
            <>
              <stop offset="0.62" stopColor={look.navy} stopOpacity={0} />
              <stop offset="0.63" stopColor={look.navy} stopOpacity={1} />
            </>
          ) : (
            <>
              <stop offset="0" stopColor={look.navy} stopOpacity={0} />
              <stop offset="1" stopColor={look.navy} stopOpacity={0.95} />
            </>
          )}
        </linearGradient>
        <linearGradient id={`hf${uid}`} gradientUnits="userSpaceOnUse" x1={0} y1={fade[0]} x2={0} y2={fade[1]}>
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id={`hm${uid}`} maskUnits="userSpaceOnUse" x={-300} y={-body.height - 200} width={600} height={body.height + 400}>
          <rect x={-300} y={-body.height - 200} width={600} height={body.height + 400} fill={`url(#hf${uid})`} />
        </mask>
      </defs>

      {legs.map((L, i) => {
        const g = legShapes(L);
        return (
          <g key={i}>
            <Shaded id={`${uid}a${i}`} d={g.ankle} look={look} light={Lb} shade={W.leg * 0.6} rim={RIM.leg} flat={flat} />
            <Shaded id={`${uid}p${i}`} d={g.pants} look={look} light={Lb} shade={W.leg} rim={RIM.leg} flat={flat} />
            {L.foot ? (
              <g transform={g.footT}>
                <ShadedPart id={`${uid}f${i}`} part={L.foot} look={look} light={rotV(Lb, -L.footAngle)} shade={W.foot} rim={RIM.foot} flat={flat} />
              </g>
            ) : null}
          </g>
        );
      })}
      <g transform={upperT}>
        <ShadedPart id={`${uid}t`} part={torso} look={look} light={rotV(Lb, -lean)} shade={W.torso} rim={RIM.torso} flat={flat} navy={`url(#navy${uid})`} />
        {(body.seams?.torso ?? []).length ? (
          <polyline points={(body.seams?.torso ?? []).map((q) => q.join(',')).join(' ')} fill="none" stroke={look.line ?? look.ink} strokeWidth={LINE} strokeLinecap="round" strokeLinejoin="round" />
        ) : null}
      </g>
      {body.parts.flipperNear ? (
        <g transform={`${upperT} rotate(${f2(pose.flipper ?? 0)} ${f2(J.shoulderNear[0])} ${f2(J.shoulderNear[1])})`}>
          <ShadedPart id={`${uid}fn`} part={body.parts.flipperNear} look={look} light={rotV(Lb, -(lean + (pose.flipper ?? 0)))} shade={W.torso * 0.5} rim={RIM.torso} flat={flat} navy={`url(#navy${uid})`} />
        </g>
      ) : null}
      <g transform={headFlip ? `${neckT} translate(${f2(J.neck[0])} 0) scale(-1 1) translate(${f2(-J.neck[0])} 0)` : neckT}>
        <g mask={`url(#hm${uid})`}>
          <g transform={regT}>
            <ShadedPart id={`${uid}h`} part={headPart} look={look} light={rotV(Lb, -(lean + tilt))} shade={W.head / (reg?.s ?? 1)} rim={RIM.head / (reg?.s ?? 1)} flat={flat} />
          </g>
        </g>
      </g>
    </g>
  );
};

/** One traced part: paper, solid black, line work. */
export const Part: React.FC<{part: SheetPart; look: RigLook}> = ({part, look}) => (
  <>
    <path d={part.fill} fill={look.white} fillRule="evenodd" />
    <path d={part.mass} fill={look.ink} fillRule="evenodd" />
    <path d={part.lines} fill={look.line ?? look.ink} fillRule="evenodd" />
  </>
);

type ShadeProps = {id: string; look: RigLook; light: Vec; shade: number; rim: number; flat?: boolean};

/**
 * A traced part with cel shading in its own frame. Shadow = the part minus itself shifted toward the
 * light, plus wherever a white area sits just past a black one (the black "casts" onto it); both
 * limited to the part. Rim = the part minus itself shifted away from the light.
 */
const ShadedPart: React.FC<ShadeProps & {part: SheetPart; navy?: string}> = ({id, part, look, light, shade, rim, flat, navy}) => {
  const box = {x: part.left - 30, y: part.top - 30, w: part.width + 60, h: part.height + 60};
  const toward = `translate(${f2(light[0] * shade)} ${f2(light[1] * shade)})`;
  const away = `translate(${f2(-light[0] * rim)} ${f2(-light[1] * rim)})`;
  const rect = (fill: string) => <rect x={box.x} y={box.y} width={box.w} height={box.h} fill={fill} />;
  return (
    <g>
      <Part part={part} look={look} />
      {navy ? (
        <>
          <defs>
            <clipPath id={`m${id}`}>
              <path d={part.mass} fillRule="evenodd" />
            </clipPath>
          </defs>
          <g clipPath={`url(#m${id})`}>{rect(navy)}</g>
        </>
      ) : null}
      {flat || (shade <= 0 && rim <= 0) ? null : (
        <>
          <defs>
            <mask id={`a${id}`} maskUnits="userSpaceOnUse" x={box.x} y={box.y} width={box.w} height={box.h}>
              <path d={part.fill} fill="#fff" fillRule="evenodd" />
            </mask>
            <mask id={`b${id}`} maskUnits="userSpaceOnUse" x={box.x} y={box.y} width={box.w} height={box.h}>
              {rect('#fff')}
              <path d={part.fill} fill="#000" fillRule="evenodd" transform={toward} />
              {part.below ? <path d={part.below} fill="#000" transform={toward} /> : null}
              <path d={part.casts} fill="#fff" fillRule="evenodd" transform={toward} />
            </mask>
            <mask id={`r${id}`} maskUnits="userSpaceOnUse" x={box.x} y={box.y} width={box.w} height={box.h}>
              <path d={part.fill} fill="#fff" fillRule="evenodd" />
              <path d={part.fill} fill="#000" fillRule="evenodd" transform={away} />
              {part.below ? <path d={part.below} fill="#000" transform={away} /> : null}
            </mask>
          </defs>
          {/* the blend sits on the outer group: an inner masked group would blend with nothing */}
          <g mask={`url(#a${id})`} style={{mixBlendMode: 'multiply'}}>
            <g mask={`url(#b${id})`}>{rect(look.shade)}</g>
          </g>
          {rim > 0 ? (
            <g mask={`url(#r${id})`} style={{mixBlendMode: 'screen'}}>
              {rect(look.rim)}
            </g>
          ) : null}
        </>
      )}
    </g>
  );
};

/** A drawn shape (the legs) with an outline and the same cel shading. */
const Shaded: React.FC<ShadeProps & {d: string}> = ({id, d, look, light, shade, rim, flat}) => {
  const toward = `translate(${f2(light[0] * shade)} ${f2(light[1] * shade)})`;
  const away = `translate(${f2(-light[0] * rim)} ${f2(-light[1] * rim)})`;
  const big = {x: -400, y: -800, w: 800, h: 1000};
  const rect = (fill: string) => <rect x={big.x} y={big.y} width={big.w} height={big.h} fill={fill} />;
  return (
    <g>
      <path d={d} fill={look.white} stroke={look.line ?? look.ink} strokeWidth={LINE} strokeLinejoin="round" />
      {flat ? null : (
        <>
          <defs>
            <mask id={`b${id}`} maskUnits="userSpaceOnUse" x={big.x} y={big.y} width={big.w} height={big.h}>
              <path d={d} fill="#fff" />
              <path d={d} fill="#000" transform={toward} />
            </mask>
            <mask id={`r${id}`} maskUnits="userSpaceOnUse" x={big.x} y={big.y} width={big.w} height={big.h}>
              <path d={d} fill="#fff" />
              <path d={d} fill="#000" transform={away} />
            </mask>
          </defs>
          <g mask={`url(#b${id})`} style={{mixBlendMode: 'multiply'}}>
            {rect(look.shade)}
          </g>
          {rim > 0 ? (
            <g mask={`url(#r${id})`} style={{mixBlendMode: 'screen'}}>
              {rect(look.rim)}
            </g>
          ) : null}
          <path d={d} fill="none" stroke={look.line ?? look.ink} strokeWidth={LINE} strokeLinejoin="round" />
        </>
      )}
    </g>
  );
};
