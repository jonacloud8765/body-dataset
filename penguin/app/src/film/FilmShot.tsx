import React from 'react';
import {Easing, interpolate, random, useCurrentFrame} from 'remotion';
import type {Sheet} from '../art/sheet';
import {camTransform, EndCard, latest, lerpKeys, makeResolver, MapGraphic, moveOffset} from '../animatic/ShotView';
import type {CamKey, El, PenguinKey, SkySpec, Spec, When} from '../animatic/types';
import {FLAT_LOOK, type RigLook} from '../rig/Penguin';
import type {HeadId, RigPose, Vec} from '../rig/types';
import {footfalls, WALK_STRIDE} from '../rig/walk';
import {beatsAt, FPS, GRID, HEIGHT, WIDTH} from '../timing/song';
import type {Shot} from '../timing/timeline';
import {FlatGround, FlatMountain, FlatRanges, FlatSky, FootPrint, SnowKick, type EyeLook} from '../world/Flat';
import {mixHex, mixWorld, WORLD, type Tod, type WorldPalette} from '../world/palette';
import {blendPose, Him, poseFor, type HimPose, type HimView} from './Him';
import {ColonyCrowd, CrewMember} from './People';
import {
  Aurora,
  BoomMic,
  Breath,
  Camp,
  Clipboard,
  CreatorEye,
  Debris,
  fillOf,
  FlatGlow,
  GiantPrint,
  CreatorLegs,
  Glint,
  GoldRing,
  Headlamp,
  iceOf,
  IceSeal,
  PrintAway,
  RockFace,
  Storm,
  SunDisc,
  tint,
  Trampled,
} from './Props';

/**
 * One shot of the film, in the flat 2D look, from the same blocking as the animatic: the sky in
 * screen space (at the horizon the camera sees), the world under the camera, HIM from the rig.
 */

const W = WIDTH;
const H = HEIGHT;
const ROCK = '#5B5F66';
const ROCK_DARK = '#4E5259';
const TRAMPLED = '#C8CFD5';

// ─── palette and light ─────────────────────────────────────────────────────
const worldOf = (tod: string): WorldPalette => (tod in WORLD ? WORLD[tod as Tod] : WORLD.morning);

export const paletteAt = (spec: SkySpec | undefined, f: number, res: (w: When) => number, shot: Shot): WorldPalette => {
  if (!spec) return WORLD.noon;
  if (spec === 'timelapse') {
    const cyc = (f / Math.max(1, shot.frames)) * 3;
    const night = 0.5 - 0.5 * Math.cos(cyc * Math.PI * 2);
    return mixWorld(WORLD.noon, WORLD.night, Math.pow(night, 1.5));
  }
  if (typeof spec === 'string') return worldOf(spec);
  const a = res(spec.at);
  const b = res(spec.over);
  const u = interpolate(f, [a, Math.max(a + 1, b)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return mixWorld(worldOf(spec.from), worldOf(spec.to), u);
};

/** Where the sun (or moon) sits for an hour: across the frame, and how high above the horizon. */
const SUN_AT: Partial<Record<string, {x: number; up: number}>> = {
  firstlight: {x: 1650, up: 70},
  noon: {x: 1620, up: 400},
  dusk: {x: 300, up: 110},
  night: {x: 1520, up: 380},
  moon: {x: 1460, up: 360},
  sunrise: {x: 1500, up: 160},
  morning: {x: 1580, up: 330},
};
const todOf = (spec: SkySpec | undefined, f: number, res: (w: When) => number): string => {
  if (!spec) return 'noon';
  if (typeof spec === 'string') return spec;
  return f < (res(spec.at) + res(spec.over)) / 2 ? spec.from : spec.to;
};

/** The figures' colors for the scene: his whites go blue-grey at night, warm at sunrise. */
export const lookFor = (P: WorldPalette): RigLook => ({
  ...FLAT_LOOK,
  white: tint(mixHex(FLAT_LOOK.white, P.snow, 0.12), P),
  ink: tint(FLAT_LOOK.ink, P, 0.12),
  navy: tint(FLAT_LOOK.navy, P, dimOfLook(P)),
  shade_: {torso: 0, head: 0, leg: 0, foot: 0},
});
const dimOfLook = (P: WorldPalette) => {
  const k = parseInt(P.snow.slice(1, 3), 16) / 255;
  return Math.max(0, Math.min(0.45, (0.95 - k) * 1.1));
};

// ─── motion helpers ────────────────────────────────────────────────────────
const ease = Easing.inOut(Easing.cubic);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** The pose in effect at frame f (the animatic's rule: 'walk' needs the element's walk set). */
const poseAt = (el: Extract<El, {k: 'penguin'}>, f: number, res: (w: When) => number): HimPose => {
  const p = (latest(el.keys, f, res, 'pose', 'stand') ?? 'stand') as HimPose;
  return p === 'walk' && !el.walk ? 'stand' : p;
};

/**
 * A figure's x or y at frame f. While he walks the move is linear (a steady pace, so planted
 * feet stay planted); other moves ease in and out, as in the animatic.
 */
const keyed = (el: Extract<El, {k: 'penguin'}>, field: 'x' | 'y' | 'h', f: number, res: (w: When) => number, fallback: number) => {
  const pts = el.keys
    .filter((k) => k[field] !== undefined)
    .map((k) => ({f: res(k.at), v: k[field] as number}))
    .sort((a, b) => a.f - b.f);
  if (!pts.length) return fallback;
  if (f <= pts[0].f) return pts[0].v;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    if (f <= b.f) {
      const u = b.f === a.f ? 1 : (f - a.f) / (b.f - a.f);
      const walking = field !== 'h' && poseAt(el, a.f, res) === 'walk';
      return a.v + (b.v - a.v) * (walking ? clamp01(u) : ease(clamp01(u)));
    }
  }
  return pts[pts.length - 1].v;
};

const stepRate = (walk: 'every' | 'half' | 'double' | undefined) => (walk === 'half' ? 0.5 : walk === 'double' ? 2 : 1);

type View = {x0: number; x1: number; y0: number; y1: number};

type Ctx = {
  shot: Shot;
  spec: Spec;
  f: number;
  t: number;
  beats: number;
  res: (w: When) => number;
  P: WorldPalette;
  look: RigLook;
  sheet: Sheet;
  sun: {x: number; y: number} | null;
  view: View;
  roll: number;
  /** the ground's travel for a tracked walker (px at his feet), and the depth it's measured at */
  travel: number;
  feetY?: number;
  orbit: boolean;
  id: string;
};

/** The walker the ground tracks: a figure walking in place (the camera travels with him). */
const trackedWalker = (els: El[]) =>
  els.find((e): e is Extract<El, {k: 'penguin'}> => {
    if (e.k !== 'penguin' || !e.walk) return false;
    const v0 = e.keys.find((k) => k.view)?.view ?? 'side';
    if (v0 !== 'side' && v0 !== 'front34') return false;
    const xs = new Set(e.keys.filter((k) => k.x !== undefined).map((k) => k.x));
    return xs.size <= 1 && e.keys.some((k) => k.pose === 'walk');
  });

const BODY_H = 372.17;

/**
 * His steps per beat for this shot: the blocking's, doubled while a move would need a stride his
 * legs can't make (feet always land on the beat grid, on beats or on the half beats).
 */
const paceOf = (el: Extract<El, {k: 'penguin'}>, res: (w: When) => number) => {
  let rate = el.rate ?? stepRate(el.walk);
  if (el.rate !== undefined) return rate;
  const xs = el.keys.filter((k) => k.x !== undefined).map((k) => ({f: res(k.at), x: k.x!})).sort((a, b) => a.f - b.f);
  const h = el.keys.find((k) => k.h !== undefined)?.h ?? 200;
  let worst = 0;
  for (let i = 0; i < xs.length - 1; i++) {
    const p = poseAt(el, xs[i].f, res);
    if ((p !== 'walk' && p !== 'climb') || xs[i + 1].f <= xs[i].f) continue;
    const beats = (xs[i + 1].f - xs[i].f) / FPS / GRID.beat_s;
    worst = Math.max(worst, Math.abs(xs[i + 1].x - xs[i].x) / beats / (h / BODY_H));
  }
  while (worst / rate > 100 && rate < 16) rate *= 2;
  return rate;
};

/** Beats walked so far in this shot (the ground only moves while he walks). */
const walkedBeats = (el: Extract<El, {k: 'penguin'}>, shot: Shot, f: number, res: (w: When) => number) => {
  const rate = paceOf(el, res);
  let sum = 0;
  for (let q = 0; q < f; q++) {
    if (poseAt(el, q, res) === 'walk') sum += (rate * (beatsAt((shot.from + q + 1) / FPS) - beatsAt((shot.from + q) / FPS)));
  }
  return sum;
};

// ─── the elements ──────────────────────────────────────────────────────────
const renderEl = (el: El, i: number, c: Ctx): React.ReactNode => {
  const {f, res, P, t} = c;
  const id = `${c.id}e${i}`;
  switch (el.k) {
    case 'ground': {
      if (el.color) {
        // the colony's trampled ground
        const pts = [[c.view.x0 - 600, el.y], [c.view.x1 + 600, el.y], [c.view.x1 + 600, c.view.y1 + 600], [c.view.x0 - 600, c.view.y1 + 600]];
        return <Trampled key={i} id={id} pts={pts} P={P} seed={`${c.shot.id}tg`} />;
      }
      const feetY = el.feetY ?? c.feetY ?? el.y + (H - el.y) * 0.6;
      return (
        <FlatGround
          key={i}
          id={id}
          P={P}
          horizon={el.y}
          feetY={Math.max(el.y + 20, feetY)}
          travel={c.travel || (el.scroll ? c.beats * el.scroll : 0)}
          t={t}
          seed={`${c.shot.id}g`}
          bottom={Math.max(H, el.y + 400)}
          sparkle={el.sparkle ?? true}
          drifts={el.line !== false}
          x0={c.view.x0}
          orbit={c.orbit}
        />
      );
    }
    case 'mountain': {
      const {dx, dy} = moveOffset(el.move, f, res);
      let eyes: EyeLook = 'none';
      for (const e of el.eyes ?? []) if (f >= res(e.at)) eyes = e.state === 'cracked' ? 'sealed' : (e.state as EyeLook);
      let plume = -1;
      for (const p of el.plumes ?? []) {
        const pr = (f - res(p)) / 72;
        if (pr >= 0 && pr <= 1) plume = pr;
      }
      const rim = el.rim ? interpolate(f, [res(el.rim[0]), res(el.rim[1])], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
      // turning round like a cut-out: squash to a third, flip, spring back
      const turn = el.turnAt !== undefined ? interpolate(f, [res(el.turnAt), res(el.turnAt) + 10], [1, -1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease}) : 1;
      const flip = (turn >= 0 ? 1 : -1) * Math.max(0.34, Math.abs(turn));
      return (
        <FlatMountain
          key={i}
          id={id}
          P={P}
          x={el.x + dx}
          y={el.y + dy}
          h={el.h}
          sun={c.sun ?? undefined}
          haze={(el.haze ?? 0) * 0.6}
          eyes={eyes}
          rim={rim}
          plume={plume}
          flip={flip}
          line={el.h > 250}
          dark={el.dark}
        />
      );
    }
    case 'penguin':
      return <PenguinEl key={i} el={el} c={c} />;
    case 'crew': {
      const {dx, dy} = moveOffset(el.move, f, res);
      const carrying = el.carry ? f >= res(el.carry[0]) && f < res(el.carry[1]) : false;
      return (
        <CrewMember
          key={i}
          x={el.x + dx}
          y={el.y + dy}
          h={el.h}
          role={el.role}
          facing={el.facing}
          tn={(col) => tint(col, P)}
          pose={{
            step: el.walk ? c.beats : undefined,
            sink: el.sink,
            lookUp: el.look === 'up' ? 1 : 0,
            lean: el.lean,
            carry: carrying,
            sign: el.sign !== undefined ? f >= res(el.sign) : false,
          }}
        />
      );
    }
    case 'colony': {
      const wave = el.waveAt !== undefined ? f - res(el.waveAt) : -1;
      const turned = (el.turns ?? []).filter((tn) => f >= res(tn.at) && f < res(tn.until)).map((tn) => [el.rows - 1, tn.col] as [number, number]);
      const head = (c.shot.head && c.shot.head !== 'none' ? c.shot.head : 'frown') as HeadId;
      return (
        <g key={i} style={el.blur ? {filter: `blur(${el.blur}px)`} : undefined}>
          <ColonyCrowd
            x={el.x}
            y={el.y}
            w={el.w}
            ph={el.ph}
            rows={el.rows}
            cols={el.cols}
            hero={el.hero}
            wave={wave}
            turned={turned}
            seed={`c${el.seed ?? 1}`}
            t={t}
            tn={(col) => tint(col, P)}
            heroNode={(px, py, sc) => (
              <Him sheet={c.sheet} P={P} look={c.look} view="front" head={head} pose="stand" x={px} y={py} h={el.ph * sc * 0.95} beats={c.beats} t={t} shadow={false} />
            )}
          />
        </g>
      );
    }
    case 'feet':
      return <FeetECU key={i} el={el} c={c} />;
    case 'print':
      return (
        <g key={i} transform={`translate(${el.x},${el.y})`}>
          <GiantPrint size={el.size} P={P} />
        </g>
      );
    case 'rect': {
      const pts = [[el.x, el.y], [el.x + el.w, el.y], [el.x + el.w, el.y + el.h], [el.x, el.y + el.h]];
      if (el.fill === ROCK) return <RockFace key={i} id={id} pts={pts} P={P} seed={`${c.shot.id}r${i}`} line={false} />;
      if (el.fill === TRAMPLED) return <Trampled key={i} id={id} pts={pts} P={P} seed={`${c.shot.id}t${i}`} />;
      return (
        <g key={i}>
          <rect x={el.x} y={el.y} width={el.w} height={el.h} rx={el.rx} fill={fillOf(el.fill, P, !!el.stroke)} opacity={el.opacity} stroke={el.stroke ? P.line : undefined} strokeWidth={el.stroke ? 2.5 : 0} />
          {el.hatch ? <SnowTexture x={el.x} y={el.y} w={el.w} h={el.h} P={P} seed={`${c.shot.id}h${i}`} t={t} /> : null}
        </g>
      );
    }
    case 'ellipse':
      return <ellipse key={i} cx={el.x} cy={el.y} rx={el.rx} ry={el.ry} fill={fillOf(el.fill, P)} opacity={el.opacity} />;
    case 'poly': {
      const {dx, dy} = moveOffset(el.move, f, res);
      const pts = el.pts.map((p) => [p[0] + dx, p[1] + dy]);
      if (el.fill === ROCK || el.fill === ROCK_DARK) {
        return <RockFace key={i} id={id} pts={pts} P={P} fill={el.fill === ROCK_DARK ? P.rockShade : undefined} seed={`${c.shot.id}p${i}`} />;
      }
      if (el.fill === TRAMPLED) return <Trampled key={i} id={id} pts={pts} P={P} seed={`${c.shot.id}t${i}`} />;
      const d = `M${pts.map((p) => p.join(' ')).join('L')}Z`;
      const fill = fillOf(el.fill, P);
      const edge = el.stroke === 'none' ? undefined : fill === P.snow ? P.snowShade : P.line;
      return <path key={i} d={d} fill={fill} opacity={el.opacity} stroke={edge} strokeWidth={edge ? (fill === P.snow ? 5 : 3) : 0} strokeLinejoin="round" />;
    }
    case 'footprints': {
      const dir: 1 | -1 = el.x2 >= el.x1 ? 1 : -1;
      return (
        <g key={i}>
          {new Array(el.n).fill(0).map((_, j) => {
            const u = j / Math.max(1, el.n - 1);
            const x = el.x1 + (el.x2 - el.x1) * u;
            const y = el.y1 + (el.y2 - el.y1) * u + (j % 2 ? el.size * 0.6 : -el.size * 0.6);
            const col = mixHex(P.snowShade, P.line, el.color ? 0.3 : 0.2);
            return el.size < 8 ? (
              <ellipse key={j} cx={x} cy={y} rx={el.size} ry={el.size * 0.5} fill={col} />
            ) : (
              <FootPrint key={j} x={x} y={y} len={el.size * 2.2} dir={dir} P={P} />
            );
          })}
        </g>
      );
    }
    case 'trail': {
      const u = interpolate(f, [res(el.from), res(el.to)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
      if (u <= 0) return null;
      const x2 = el.x1 + (el.x2 - el.x1) * u;
      const y2 = el.y1 + (el.y2 - el.y1) * u;
      return (
        <g key={i}>
          <line x1={el.x1} y1={el.y1} x2={x2} y2={y2} stroke={P.snowShade} strokeWidth={el.width * 1.8} strokeLinecap="round" />
          <line x1={el.x1} y1={el.y1 + el.width * 0.2} x2={x2} y2={y2 + el.width * 0.2} stroke={mixHex(P.snowShade, P.line, 0.18)} strokeWidth={el.width * 0.5} strokeLinecap="round" />
        </g>
      );
    }
    case 'sign': {
      let text = '';
      let since = 0;
      for (const tx of el.texts) {
        if (f >= res(tx.at)) {
          text = tx.text;
          since = f - res(tx.at);
        }
      }
      return text ? <Clipboard key={i} x={el.x} y={el.y} w={el.w} h={el.h} text={text} since={since} P={P} /> : null;
    }
    case 'boom': {
      const dip = el.dipAt !== undefined ? interpolate(f, [res(el.dipAt), res(el.dipAt) + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease}) : 1;
      return <BoomMic key={i} x={el.x} y={el.y - 260 * (1 - dip) + Math.sin(t * 5) * 10} P={P} />;
    }
    case 'storm': {
      const part = el.partAt !== undefined ? interpolate(f, [res(el.partAt), res(el.partAt) + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
      return <Storm key={i} t={t} density={el.density} part={part} P={P} x0={c.view.x0} y0={c.view.y0} />;
    }
    case 'aurora': {
      const fold = el.foldAt !== undefined ? interpolate(f, [res(el.foldAt), res(el.foldAt) + 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease}) : 0;
      return <Aurora key={i} t={t} fold={fold} faint={el.faint} />;
    }
    case 'streaks': {
      const a = res(el.at);
      if (f < a || f > a + el.frames) return null;
      const u = (f - a) / el.frames;
      return (
        <g key={i}>
          {new Array(40).fill(0).map((_, j) => {
            const y = random(`gy${j}`) * H;
            const x = el.vertical ? random(`gx${j}`) * W : -400 + u * 2800 + random(`gx${j}`) * 600;
            const w = 3 + random(`gw${j}`) * 5;
            return el.vertical ? (
              <rect key={j} x={x} y={-100 + u * 1400 + y * 0.3} width={w * 0.7} height={140} fill="#FFFFFF" opacity={0.75} />
            ) : (
              <rect key={j} x={x - 260} y={y} width={260} height={w} fill="#FFFFFF" opacity={0.8} />
            );
          })}
        </g>
      );
    }
    case 'motion':
      return (
        <g key={i}>
          {new Array(28).fill(0).map((_, j) => {
            const y = 500 + random(`my${j}`) * 600;
            const x = ((((random(`mx${j}`) * 2400 - t * el.speed * 60) % 2400) + 2400) % 2400) - 240;
            return <rect key={j} x={x} y={y} width={220} height={4} rx={2} fill={mixHex(P.snowShade, P.snow, 0.3)} />;
          })}
        </g>
      );
    case 'glint': {
      const a = res(el.at);
      if (f < a || f >= a + el.frames) return null;
      return <Glint key={i} x={el.x} y={el.y} r={el.r ?? 26} u={(f - a + 0.5) / el.frames} />;
    }
    case 'glow': {
      const u = interpolate(f, [res(el.from), res(el.to)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      if (el.color === '#FFFFFF' && el.r <= 200) return <Headlamp key={i} x={el.x} y={el.y} r={el.r} u={u} />;
      return <FlatGlow key={i} x={el.x} y={el.y} r={el.r} color={el.color} u={u} />;
    }
    case 'sun':
      return <SunDisc key={i} x={el.x} y={el.y} r={el.r} P={P} />;
    case 'eyes': {
      const open = el.openAt !== undefined ? interpolate(f, [res(el.openAt), res(el.openAt) + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease}) : 0;
      const lid = iceOf(P);
      return (
        <g key={i}>
          {[-1, 1].map((sgn) => (
            <g key={sgn} transform={`translate(${el.x + (sgn * el.gap) / 2},${el.y})`}>
              <ellipse rx={el.size * 0.62} ry={el.size * 0.47} fill={mixHex(P.rockShade, '#000000', 0.25)} />
              <CreatorEye size={el.size} open={open} lid={lid} />
              {open < 1 ? <path d={`M ${-el.size * 0.3} ${-el.size * 0.18} q ${el.size * 0.2} ${-el.size * 0.12} ${el.size * 0.42} ${-el.size * 0.08}`} fill="none" stroke={P.snow} strokeWidth={el.size * 0.035} strokeLinecap="round" opacity={0.8 * (1 - open)} /> : null}
            </g>
          ))}
        </g>
      );
    }
    case 'seal': {
      const cracks = el.cracks.map((cw) => (f < res(cw) ? 0 : interpolate(f, [res(cw), res(cw) + 6], [0, 1], {extrapolateRight: 'clamp'})));
      return <IceSeal key={i} x={el.x} y={el.y} w={el.w} h={el.h} cracks={cracks} P={P} />;
    }
    case 'bigEye': {
      const pu = el.pupil ? interpolate(f, [0, c.shot.frames], el.pupil, {extrapolateRight: 'clamp'}) : 1;
      const reflection = el.reflection ? (
        <g transform="scale(0.16)">
          <Him sheet={c.sheet} P={P} look={c.look} view="front" head="laugh" pose="stand" x={0} y={60} h={140} beats={c.beats} t={t} shadow={false} />
        </g>
      ) : undefined;
      return (
        <g key={i} transform={`translate(${el.x},${el.y})`}>
          <CreatorEye size={el.size} open={1} pupil={pu} lid={P.rock} reflection={reflection} />
        </g>
      );
    }
    case 'ring': {
      const a = res(el.at);
      if (f < a) return null;
      return <GoldRing key={i} x={el.x} y={el.y} u={(f - a) / 45} />;
    }
    case 'breath': {
      const a = res(el.at);
      return <Breath key={i} u={interpolate(f, [a - 12, a + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} P={P} />;
    }
    case 'debris': {
      const col = el.color === '#FFFFFF' ? P.snow : el.color === '#D9DEE2' ? mixHex(P.snow, P.snowShade, 0.5) : P.rock;
      return <Debris key={i} x={el.x} y={el.y} starts={el.at.map(res)} f={f} spread={el.spread ?? 300} color={col} line={P.line} />;
    }
    case 'pip': {
      const a = res(el.at);
      if (f < a || f >= a + el.frames) return null;
      return (
        <g key={i}>
          <rect x={el.x - 6} y={el.y - 6} width={el.w + 12} height={el.h + 12} fill={P.snow} stroke={P.line} strokeWidth={3} />
          <svg x={el.x} y={el.y} width={el.w} height={el.h} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
            <rect width={W} height={H} fill={P.snow} />
            {el.els.map((e, j) => renderEl(e, j, {...c, id: `${id}p`}))}
          </svg>
        </g>
      );
    }
    case 'camp':
      return <Camp key={i} x={el.x} y={el.y} s={el.s} P={P} />;
    case 'group': {
      const {dx, dy} = moveOffset(el.move, f, res);
      const op = el.fade ? interpolate(f, [res(el.fade[0]), res(el.fade[1])], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
      const clipId = `gc${id}`;
      return (
        <g key={i} opacity={op}>
          {el.clipY !== undefined ? (
            <defs>
              <clipPath id={clipId}>
                <rect x={-3000} y={-3000} width={9000} height={3000 + el.clipY} />
              </clipPath>
            </defs>
          ) : null}
          <g clipPath={el.clipY !== undefined ? `url(#${clipId})` : undefined}>
            <g transform={`translate(${dx},${dy})`}>{el.els.map((e, j) => renderEl(e, j, {...c, id: `${id}g`}))}</g>
          </g>
        </g>
      );
    }
    case 'legs': {
      const turn = el.turnAt !== undefined ? interpolate(f, [res(el.turnAt), res(el.turnAt) + 10], [1, -1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease}) : 1;
      const dir = (el.facing ?? 1) * (turn >= 0 ? 1 : -1) * Math.max(0.34, Math.abs(turn));
      return <CreatorLegs key={i} xs={el.xs} y={el.y} top={el.top} w={el.w} P={P} look={{white: c.look.white, ink: c.look.ink}} dir={dir} />;
    }
    case 'map':
      return <MapGraphic key={i} res={res} f={f} />;
    case 'endcard':
      return <EndCard key={i} f={f} />;
    default:
      return null;
  }
};

/** Wind-drawn marks over a big flat of snow (seen from above). */
const SnowTexture: React.FC<{x: number; y: number; w: number; h: number; P: WorldPalette; seed: string; t: number}> = ({x, y, w, h, P, seed}) => {
  const n = Math.min(220, Math.round((w * h) / 60000));
  return (
    <g>
      {new Array(n).fill(0).map((_, i) => {
        const cx = x + random(`${seed}x${i}`) * w;
        const cy = y + random(`${seed}y${i}`) * h;
        const len = 60 + random(`${seed}l${i}`) * 220;
        const th = 4 + random(`${seed}t${i}`) * 8;
        return <path key={i} d={`M${cx} ${cy}q${len / 2} ${-th} ${len} 0q${-len / 2} ${th * 0.4} ${-len} 0z`} fill={i % 3 ? P.sastrugi : P.snowShade} />;
      })}
    </g>
  );
};

// ─── HIM ───────────────────────────────────────────────────────────────────
const HEADS = new Set(['own', 'frown', 'sideeye', 'smirk', 'annoyed', 'profile', 'laugh', 'sad', 'surprised', 'angry']);
const headOf = (s: string | undefined): HeadId | undefined => (s && HEADS.has(s) ? (s as HeadId) : undefined);

const PenguinEl: React.FC<{el: Extract<El, {k: 'penguin'}>; c: Ctx}> = ({el, c}) => {
  const {f, res, shot, P} = c;
  const body = c.sheet.bodies['34'];
  const x = keyed(el, 'x', f, res, 960);
  const y = keyed(el, 'y', f, res, 700);
  const h = keyed(el, 'h', f, res, 200);
  const s = h / body.height;
  const view = (latest(el.keys, f, res, 'view', 'side') ?? 'side') as HimView;
  const facing = (latest(el.keys, f, res, 'facing', 1) ?? 1) as 1 | -1;
  const pose = poseAt(el, f, res);
  const headTurn = lerpKeys(el.keys, f, res, 'headTurn', 0);
  const head: HeadId = headOf(latest(el.keys as (PenguinKey & {head?: string})[], f, res, 'head', undefined)) ?? headOf(el.head) ?? headOf(shot.head) ?? (view === 'side' ? 'profile' : 'own');
  const rate = paceOf(el, res);
  const beatsW = c.beats * rate;

  // his pace: tracked (the ground scrolls under him) or his own move across the frame
  const tracked = c.travel !== 0 && trackedWalker([el]) === el;
  let stride = el.stride ?? WALK_STRIDE;
  let slope = 0;
  if (!tracked && (pose === 'walk' || pose === 'climb') && el.stride === undefined) {
    const dxdf = keyed(el, 'x', f + 0.5, res, 960) - keyed(el, 'x', f - 0.5, res, 960);
    const dydf = keyed(el, 'y', f + 0.5, res, 700) - keyed(el, 'y', f - 0.5, res, 700);
    const beatsPerFrame = rate / (GRID.beat_s * FPS);
    const v = Math.abs(dxdf) / beatsPerFrame / Math.max(0.01, s);
    stride = Math.max(pose === 'climb' ? 16 : 20, Math.min(140, v));
    if (pose === 'climb' && Math.abs(dxdf) > 0.05) slope = Math.max(0, Math.min(38, (Math.atan2(-dydf, Math.abs(dxdf)) * 180) / Math.PI));
  }
  const tiny = h < 40;
  const back = view === 'back' || view === 'back34';

  // a change of pose plays through a few in-between frames (not across a change of view)
  let rigPose: RigPose | undefined;
  if (!back && view !== 'top' && !tiny) {
    const changes = el.keys
      .filter((k) => k.pose !== undefined)
      .map((k) => res(k.at))
      .filter((kf) => kf <= f && kf > 0)
      .sort((a, b) => b - a);
    const kf = changes[0];
    if (kf !== undefined) {
      const before = poseAt(el, kf - 1, res);
      const span = before === 'fallen' || pose === 'fallen' ? 9 : 6;
      const viewThen = (latest(el.keys, kf - 1, res, 'view', 'side') ?? 'side') as HimView;
      if (before !== pose && f - kf < span && viewThen === view) {
        const bodyId = view === 'front' ? 'front' : '34';
        const tk = (shot.from + kf) / FPS;
        const bk = beatsAt(tk) * rate;
        const from = poseFor(c.sheet, bodyId, before, bk, tk, {stride});
        const to = poseFor(c.sheet, bodyId, pose, beatsW, c.t, {stride, slope});
        rigPose = blendPose(c.sheet, bodyId, from, to, (f - kf + 1) / (span + 1));
      }
    }
  }

  // prints: every footfall stays where it landed
  const printsOn = el.prints ?? (!tiny && (view === 'side' || view === 'front34' || back) && pose === 'walk');
  const prints: React.ReactNode[] = [];
  let kick: React.ReactNode = null;
  if (printsOn) {
    const falls = footfalls(body, '34', beatsW, {stride});
    const lenPx = 46 * s;
    const depth = (side: 'A' | 'B') => (side === 'A' ? -6 * s * 0.6 : 0);
    for (const fl of falls) {
      // the frame this foot landed, in the shot
      const fk = (GRID.first_bar_s + (fl.k / rate) * GRID.beat_s) * FPS - shot.from;
      if (fk > f + 1e-6) continue;
      if (fk >= 0 && poseAt(el, Math.floor(fk), res) !== 'walk') continue;
      let px: number;
      if (tracked) {
        px = x + (fl.x + 12 - (beatsW - fl.k) * stride) * s * facing;
      } else {
        const xk = fk >= 0 ? keyed(el, 'x', fk, res, 960) : keyed(el, 'x', 0, res, 960) + (keyed(el, 'x', 1, res, 960) - keyed(el, 'x', 0, res, 960)) * fk;
        px = xk + (fl.x + 12) * s * facing;
      }
      const yk = fk >= 0 ? keyed(el, 'y', fk, res, 700) : y;
      if (back) {
        // from behind: the prints he leaves walking away, left and right of his line
        const sB = (h * 0.66) / 125;
        const xk = fk >= 0 ? keyed(el, 'x', fk, res, 960) : x;
        prints.push(<PrintAway key={fl.k} x={xk + (fl.side === 'A' ? -15 : 15) * sB * facing} y={yk - 1} w={11 * sB} P={P} />);
      } else {
        prints.push(<FootPrint key={fl.k} x={px} y={yk + depth(fl.side) + 2} len={lenPx} dir={facing} P={P} />);
      }
    }
    const last = falls[falls.length - 1];
    if (last && pose === 'walk' && !back) {
      const since = (beatsW - last.k) / rate;
      const u = (since * GRID.beat_s * FPS) / 11;
      const kx = tracked ? x + (last.x + 12 - (beatsW - last.k) * stride) * s * facing : x + (last.x + 12 - (beatsW - last.k) * stride) * s * facing;
      kick = <SnowKick x={kx + 10 * s * facing} y={y + depth(last.side)} u={u} size={60 * s} P={P} seed={`k${shot.id}${last.k}`} />;
    }
  }

  const him = (
    <Him
      sheet={c.sheet}
      P={P}
      look={c.look}
      view={view}
      head={head}
      facing={facing}
      pose={pose}
      x={x}
      y={y}
      h={h}
      beats={beatsW}
      t={c.t}
      walk={{stride, slope}}
      headTurn={headTurn}
      shadow={el.shadow ?? true}
      sun={c.sun}
      rigPose={rigPose}
    />
  );
  return (
    <g>
      {prints}
      <g transform={el.counterRoll ? `rotate(${-c.roll} ${x} ${y})` : undefined}>{him}</g>
      {kick}
    </g>
  );
};

/** Extreme close-up of his feet (S05, S07): the rig's own legs and feet, one foot stepping. */
const FeetECU: React.FC<{el: Extract<El, {k: 'feet'}>; c: Ctx}> = ({el, c}) => {
  const {f, res, P} = c;
  const body = c.sheet.bodies['34'];
  const J = body.joints;
  // the animatic's feet were `size` wide per 100; the rig's near foot is 54 px long
  const s = (el.size * 0.8) / 54;
  const h = body.height * s;
  const x = el.x + 60;
  const y = el.y;
  const ankA: Vec = [body.legs.Far.ankle.x - 3, J.ankleFar[1] - 6];
  const ankB: Vec = [body.legs.Near.ankle.x, J.ankleNear[1]];
  const a = el.stepAt !== undefined ? res(el.stepAt) : null;
  let pose: RigPose = {ankleA: [ankA[0] - 22, ankA[1]], ankleB: ankB, footA: 0, footB: 0};
  let sinkU = 0;
  let kick: React.ReactNode = null;
  if (a !== null) {
    // the near foot hangs over the fresh snow, swings forward and comes down on the beat
    const u = interpolate(f, [a - 16, a], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const lift = f < a ? 18 * (1 - Easing.in(Easing.quad)(u)) : 0;
    const fwd = -18 + 40 * Easing.out(Easing.quad)(u);
    sinkU = f >= a ? interpolate(f, [a, a + 3], [0, 1], {extrapolateRight: 'clamp'}) : 0;
    pose = {ankleA: [ankA[0] - 22, ankA[1]], ankleB: [ankB[0] + fwd, ankB[1] - lift + sinkU * 2.5], footA: 0, footB: f < a ? -8 * (1 - u) : 0};
    const since = f - a;
    if (since >= 0 && since < 12) kick = <SnowKick x={x + (ankB[0] + 22 + 30) * s} y={y} u={since / 11} size={52 * s} P={P} seed={`fk${c.shot.id}`} />;
  }
  return (
    <g>
      <ellipse cx={x + (ankA[0] - 22 + 12) * s} cy={y + 3 - 4 * s} rx={32 * s} ry={4 * s} fill={P.snowShade} />
      <ellipse cx={x + (ankB[0] + 12 + (a !== null ? 22 : 0)) * s} cy={y + 3} rx={32 * s} ry={4 * s} fill={P.snowShade} opacity={a !== null ? interpolate(f, [a - 16, a], [0.3, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1} />
      <Him sheet={c.sheet} P={P} look={c.look} view="side" head="profile" pose="still" x={x} y={y} h={h} beats={c.beats} t={c.t} shadow={false} rigPose={pose} />
      {sinkU > 0 ? <rect x={x + (ankB[0] + 22 - 20) * s} y={y - 1} width={60 * s} height={2.5 * s * sinkU} fill={P.snow} /> : null}
      {kick}
    </g>
  );
};

// ─── the shot ──────────────────────────────────────────────────────────────
const horizonOf = (els: El[]): number => {
  const g = els.find((e) => e.k === 'ground') as Extract<El, {k: 'ground'}> | undefined;
  if (g) return g.y;
  const m = els.find((e) => e.k === 'mountain') as Extract<El, {k: 'mountain'}> | undefined;
  if (m) return m.y;
  return H + 300;
};

export const FilmShot: React.FC<{shot: Shot; spec: Spec; sheet: Sheet}> = ({shot, spec, sheet}) => {
  const frame = useCurrentFrame();
  const res = makeResolver(shot);
  const f = spec.freezeLast ? Math.min(frame, shot.frames - spec.freezeLast) : frame;
  const t = (shot.from + f) / FPS;
  const beats = beatsAt(t);
  const phases = spec.phases ?? [{from: 0, sky: spec.sky, els: spec.els ?? [], cam: spec.cam}];
  const starts = phases.map((p) => (p.from === undefined ? 0 : res(p.from)));
  let idx = 0;
  starts.forEach((s0, j) => {
    if (f >= s0) idx = j;
  });
  const dis = spec.dissolveFrames ?? 0;

  // handheld drift for the documentary, a jolt on downbeats if asked
  const doc = shot.mode === 'DOC';
  const hh = doc
    ? {x: 7 * Math.sin(t * 1.3) + 4 * Math.sin(t * 3.1 + 1), y: 5 * Math.sin(t * 1.7 + 2) + 3 * Math.sin(t * 2.9), roll: 0.35 * Math.sin(t * 0.9 + 0.5)}
    : {x: 0, y: 0, roll: 0};
  if (spec.shakeOnDownbeat) {
    const since = (beats - Math.floor(beats / GRID.meter) * GRID.meter) * GRID.beat_s * FPS;
    const amp = since < 6 ? (6 - since) * 3 : 0;
    hh.x += amp * Math.sin(f * 2.3);
    hh.y += amp * Math.cos(f * 3.1);
  }

  const renderPhase = (j: number, opacity: number) => {
    const ph = phases[j];
    const skySpec = ph.sky ?? spec.sky;
    const P = paletteAt(skySpec, f, res, shot);
    const camKeys: CamKey[] | undefined = ph.cam ?? spec.cam;
    const cam = camTransform(camKeys, f, res, hh);
    const prev = camTransform(camKeys, Math.max(0, f - 1), res, {x: 0, y: 0, roll: 0});
    const speed = Math.hypot((cam.x - hh.x - prev.x) * cam.zoom, (cam.y - hh.y - prev.y) * cam.zoom) + Math.abs(cam.roll - hh.roll - prev.roll) * 12;
    const blur = speed > 30 ? Math.min(14, speed / 16) : 0;
    const hzWorld = horizonOf(ph.els);
    const hzScreen = (hzWorld - H / 2 - cam.y) * cam.zoom + H / 2;
    const reach = (cam.roll ? Math.hypot(W, H) / 2 : W / 2) / cam.zoom;
    const reachY = (cam.roll ? Math.hypot(W, H) / 2 : H / 2) / cam.zoom;
    const view: View = {x0: W / 2 + cam.x - reach, x1: W / 2 + cam.x + reach, y0: H / 2 + cam.y - reachY, y1: H / 2 + cam.y + reachY};

    // the sun or moon: the shot's own, or where it sits at this hour
    const tod = todOf(skySpec, f, res);
    let sun: {x: number; y: number} | null = null;
    if (spec.sun !== undefined) sun = spec.sun;
    else if (skySpec === 'timelapse') {
      const cyc = ((f / Math.max(1, shot.frames)) * 3) % 1;
      const a = cyc * Math.PI * 2;
      sun = {x: 960 + 1000 * Math.sin(a), y: hzScreen - 430 * Math.cos(a)};
    } else if (skySpec && typeof skySpec === 'object' && SUN_AT[skySpec.from] && SUN_AT[skySpec.to]) {
      const a = SUN_AT[skySpec.from]!;
      const b = SUN_AT[skySpec.to]!;
      const u = interpolate(f, [res(skySpec.at), Math.max(res(skySpec.at) + 1, res(skySpec.over))], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
      sun = {x: a.x + (b.x - a.x) * u, y: Math.max(-300, hzScreen - (a.up + (b.up - a.up) * u))};
    } else if (SUN_AT[tod]) sun = {x: SUN_AT[tod]!.x, y: Math.max(-300, hzScreen - SUN_AT[tod]!.up)};

    // a walker the camera travels with: the ground scrolls at his pace under his planted feet
    const walker = trackedWalker(ph.els);
    const ground = ph.els.find((e) => e.k === 'ground') as Extract<El, {k: 'ground'}> | undefined;
    const orbit = !!ground?.scroll && !ph.els.some((e) => e.k === 'penguin' && e.keys.some((k) => k.view === 'side'));
    let travel = 0;
    let feetY: number | undefined;
    if (walker && ground && !orbit) {
      const body = sheet.bodies['34'];
      const hW = keyed(walker, 'h', f, res, 200);
      const sW = hW / body.height;
      const facingW = (latest(walker.keys, f, res, 'facing', 1) ?? 1) as number;
      const beats0 = beatsAt(shot.from / FPS) * paceOf(walker, res);
      travel = (beats0 + walkedBeats(walker, shot, f, res)) * (walker.stride ?? WALK_STRIDE) * sW * facingW;
      feetY = keyed(walker, 'y', f, res, 700);
    }
    const ranges = !!ground && !ground.color && ground.line !== false;
    const ctx: Ctx = {
      shot,
      spec,
      f,
      t,
      beats,
      res,
      P,
      look: lookFor(P),
      sheet,
      sun,
      view,
      roll: cam.roll,
      travel,
      feetY,
      orbit,
      id: `${shot.id}${j}`,
    };
    const skyId = `${shot.id}s${j}`;
    const pan = cam.x * cam.zoom + travel;
    const paper = ph.els.some((e) => e.k === 'map' || e.k === 'endcard');
    return (
      <g key={j} opacity={opacity}>
        <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill={paper ? '#F7F7F0' : P.sky[3]} />
        {paper ? null : (
          <g transform={`rotate(${cam.roll} ${W / 2} ${H / 2})`}>
            <FlatSky id={skyId} P={P} horizon={Math.max(60, hzScreen)} sun={sun ?? undefined} t={t} pan={pan} seed={shot.id} clouds={P.stars > 0.5 ? 2 : 5} />
            {ranges ? <FlatRanges P={P} horizon={hzScreen} pan={-pan} seed={shot.id} amp={13} /> : null}
          </g>
        )}
        <g transform={cam.css} style={blur ? {filter: `blur(${blur.toFixed(1)}px)`} : undefined}>
          {ph.els.map((el, k) => renderEl(el, k, ctx))}
        </g>
      </g>
    );
  };

  const layers: React.ReactNode[] = [renderPhase(idx, 1)];
  if (dis > 0 && idx + 1 < phases.length) {
    const next = starts[idx + 1];
    const u = interpolate(f, [next - dis / 2, next + dis / 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    if (u > 0) layers.push(renderPhase(idx + 1, u));
  }
  if (dis > 0 && idx > 0) {
    const cur = starts[idx];
    const u = interpolate(f, [cur - dis / 2, cur + dis / 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    if (u < 1) {
      layers.unshift(renderPhase(idx - 1, 1));
      layers[1] = renderPhase(idx, u);
    }
  }

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
      {layers}
    </svg>
  );
};
