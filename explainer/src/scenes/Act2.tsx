import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, W} from '../theme';
import {EASE, EASE_OUT, LINEAR, lerp, p} from '../lib/anim';
import {Figure, POSES, mixPose, walkPose} from '../components/Figure';
import {Cam, Plaza, WORLD, laneScale} from '../components/World';
import {AGENTS, Agent, Crowd, CrowdShadows} from '../components/Crowd';
import {Animal, LIGHT_ACT2, ShadowLight, ShadowOf} from '../components/Shadows';
import {GroundRing, IntentWedge, Matte} from '../components/Signals';
import {Label, Tag} from '../components/Type';
import {S} from '../score';
import {Caption, PROTAGONIST_X, SceneProps, WorldLayer, heartAt, useTimes} from './common';
import {FREEZE_T} from './Act1Responses';

const LANE = WORLD.lane.main;
const PS = laneScale(LANE);
const CAM2: Cam = {x: 900, y: 575, zoom: 0.95};
const SITTER = 40;
const sitter = AGENTS.find((a) => a.id === SITTER) as Agent;
const SITTER_LANE = sitter.lane;
const SL = laneScale(SITTER_LANE);
const DOG_X = 1060;
const WOLF_X = 1480;

/** World clock for Act II (continues from S10, holds during the S14 tableau). */
const wt2 = (T: number) => {
  const base = FREEZE_T() + 5.5;
  const t14 = S('S14');
  const t15 = S('S15');
  if (T < t14) return base + (T - S('S11'));
  if (T < t15) return base + (t14 - S('S11')) + 0.6 * p(T, t14, t14 + 1.2, EASE_OUT);
  return base + (t14 - S('S11')) + 0.6 + (T - t15);
};

const sheepMorph = (T: number, reverse = false) => (ag: Agent): {kind: Animal; t: number; scale?: number} | null => {
  if (ag.id === SITTER) return null;
  const start = S('S11') + 3 + (ag.id % 7) * 0.35;
  let t = p(T, start, start + 1.2);
  if (reverse) t *= 1 - p(T, S('S15') + 9.5 + (ag.id % 5) * 0.2, S('S15') + 11.2 + (ag.id % 5) * 0.2);
  return {kind: 'sheep', t, scale: ag.kind === 'child' ? 0.62 : 0.84};
};

const Stage: React.FC<{T: number; light?: ShadowLight; sun?: number; crowdOpacity?: number; shadowOpacity?: number; children?: React.ReactNode; wallExtra?: React.ReactNode; reverse?: boolean; excludeSitter?: boolean}> = ({T, light = LIGHT_ACT2, sun = 1, crowdOpacity = 1, shadowOpacity = 1, children, wallExtra, reverse = false, excludeSitter = false}) => {
  const wt = wt2(T);
  const ex = excludeSitter ? [SITTER] : [];
  return (
    <>
      <Plaza cam={CAM2} sun={sun} wallLayer={<><CrowdShadows t={wt} light={light} animal={sheepMorph(T, reverse)} exclude={ex} opacity={shadowOpacity * 0.62} />{wallExtra}</>} actorLayer={<Crowd t={wt} opacity={crowdOpacity} exclude={ex} />} />
      <WorldLayer cam={CAM2}>{children}</WorldLayer>
    </>
  );
};

export const S11Flock: React.FC<SceneProps> = ({T0}) => {
  const {t, T} = useTimes(T0);
  const x = PROTAGONIST_X + 46 * Math.max(0, t - 0.8);
  const pose = t < 0.8 ? mixPose(POSES.alert, walkPose(0, 0.95), p(t, 0, 0.8)) : walkPose((x - PROTAGONIST_X) / 96, 0.95);
  const morph = p(t, 3.4, 4.6);
  return (
    <AbsoluteFill>
      <Stage T={T}>
        <ShadowOf x={x} lane={LANE} pose={pose} scale={PS} light={LIGHT_ACT2} animal={{kind: 'sheep', t: morph, scale: 1.05}} />
        <Figure x={x} y={LANE} pose={pose} scale={PS} heart={heartAt(T)} />
      </Stage>
      <Matte />
      <Label text="Sheep" t={t - 6.4} x={W / 2} y={232} out={p(t, 14.8, 15.6)} />
      <Tag text="Ordinary, peaceful people" t={t - 7.1} x={W / 2} y={312} color={C.BONE} size={32} out={p(t, 14.8, 15.6)} />
      <Tag text="Law-abiding · cooperative · the majority" t={t - 8.0} x={W / 2} y={358} size={26} out={p(t, 14.8, 15.6)} />
      <Caption text="One metaphor describes people by how they relate to violence." t={t} a={0.6} b={5.8} />
      <Caption text="Sheep: ordinary people who live peacefully and avoid violence." t={t} a={6.2} b={11} />
      <Caption text="Many are uncomfortable even thinking about it. That is normal, not weakness." t={t} a={11.2} b={15.8} />
    </AbsoluteFill>
  );
};

/** Wolf (the Other) placement for Act II. */
const wolfAt = (T: number) => {
  const t12 = T - S('S12');
  const t15 = T - S('S15');
  if (T < S('S15')) {
    const k = p(t12, 0, 7, LINEAR);
    const x = lerp(2250, WOLF_X, k);
    return {x, pose: k > 0 && k < 1 ? walkPose((2250 - x) / 96, 0.9) : POSES.stand, facing: -1 as const, morph: p(t12, 2.4, 3.8)};
  }
  const k = p(t15, 0.6, 8, EASE);
  const x = lerp(WOLF_X, 2400, k);
  return {x, pose: k > 0 && k < 1 ? walkPose((x - WOLF_X) / 96, 0.9) : POSES.stand, facing: (k > 0.01 ? 1 : -1) as 1 | -1, morph: 1};
};

const Wolf: React.FC<{T: number; wedgeO?: number; ringO?: number}> = ({T, wedgeO = 1, ringO = 0}) => {
  const w = wolfAt(T);
  const k = LIGHT_ACT2.k * PS;
  const sx = w.x + LIGHT_ACT2.dx;
  const baseY = WORLD.wallBase + (LANE - WORLD.wallBase) * 0.15;
  const eye = {x: sx + w.facing * 106 * k * 1.05, y: baseY - 63 * k * 1.05};
  const head = {x: w.x + w.facing * 38 * PS, y: LANE - 162 * PS};
  const m = w.morph;
  return (
    <g>
      <ShadowOf x={w.x} lane={LANE} pose={w.pose} scale={PS} facing={w.facing} light={LIGHT_ACT2} animal={{kind: 'wolf', t: m, scale: 1.05}} />
      <GroundRing x={w.x} y={LANE + 2} r={78} color={C.COLD} jagged={0.18} opacity={ringO} />
      <Figure x={w.x} y={LANE} pose={w.pose} scale={PS} facing={w.facing} fill={C.GRAPHITE} rim={C.COLD} />
      <IntentWedge x={lerp(head.x, eye.x, m)} y={lerp(head.y, eye.y, m)} angle={w.facing === 1 ? 0 : 180} size={lerp(14, 22, m)} opacity={wedgeO} />
    </g>
  );
};

export const S12Wolf: React.FC<SceneProps> = ({T0}) => {
  const {t, T} = useTimes(T0);
  return (
    <AbsoluteFill>
      <Stage T={T}>
        <Wolf T={T} />
      </Stage>
      <Matte />
      <Label text="Wolf" t={t - 4.4} x={W / 2} y={232} out={p(t, 13, 13.8)} />
      <Tag text="Preys on others" t={t - 5.1} x={W / 2} y={312} color={C.BONE} size={32} out={p(t, 13, 13.8)} />
      <Tag text="Predatory · exploitative · seeks dominance" t={t - 6.0} x={W / 2} y={358} size={26} out={p(t, 13, 13.8)} />
      <Caption text="Wolves: people who use violence against others." t={t} a={1.0} b={6.6} />
      <Caption text="For gain, for power, or out of cruelty. Criminals, terrorists, predators." t={t} a={6.8} b={13.6} />
    </AbsoluteFill>
  );
};

/** The sheepdog-figure (bench sitter) placement for S13–S15. */
const dogAt = (T: number) => {
  const t13 = T - S('S13');
  const t15 = T - S('S15');
  if (T < S('S15')) {
    const stand = p(t13, 0.8, 2.2);
    const k = p(t13, 2.2, 6.2, EASE);
    const x = lerp(sitter.x0, DOG_X, k);
    const walking = k > 0 && k < 1;
    const pose = stand < 1 ? mixPose(POSES.sit, POSES.stand, stand) : walking ? walkPose((x - sitter.x0) / 96, 0.95) : mixPose(POSES.stand, POSES.alert, p(t13, 6.2, 7));
    return {x, pose, facing: 1 as const, morph: p(t13, 4.2, 5.6), rest: 0};
  }
  const k = p(t15, 1.0, 5.4, EASE);
  const x = lerp(DOG_X, sitter.x0, k);
  const walking = k > 0 && k < 1;
  const sit = p(t15, 5.4, 6.6);
  const pose = walking ? walkPose((DOG_X - x) / 96, 0.95) : k >= 1 ? mixPose(POSES.stand, POSES.sit, sit) : POSES.alert;
  return {x, pose, facing: (walking ? -1 : 1) as 1 | -1, morph: 1, rest: p(t15, 5.6, 7)};
};

const Sheepdog: React.FC<{T: number; chevronO?: number; ringO?: number; reverse?: number}> = ({T, chevronO = 1, ringO = 0, reverse = 0}) => {
  const d = dogAt(T);
  const k = LIGHT_ACT2.k * SL;
  const sx = d.x + LIGHT_ACT2.dx;
  const baseY = WORLD.wallBase + (SITTER_LANE - WORLD.wallBase) * 0.15;
  const eye = {x: sx + 112 * k * 1.05, y: baseY - 106 * k * 1.05};
  const kind: Animal = d.rest > 0.5 ? 'dogRest' : 'dog';
  const m = d.morph * (1 - reverse);
  return (
    <g>
      <ShadowOf x={d.x} lane={SITTER_LANE} pose={d.pose} scale={SL} facing={d.facing} light={LIGHT_ACT2} animal={{kind, t: m, scale: 1.05}} />
      <GroundRing x={d.x} y={SITTER_LANE + 2} r={70} opacity={ringO} />
      <Figure x={d.x} y={SITTER_LANE} pose={d.pose} scale={SL} facing={d.facing} fill="#5C6670" rim={C.SUN} />
      {kind === 'dog' ? <IntentWedge x={eye.x + 18} y={eye.y} angle={0} size={20} color={C.BONE} opacity={chevronO * m} glow={0.3} /> : null}
    </g>
  );
};

export const S13Sheepdog: React.FC<SceneProps> = ({T0}) => {
  const {t, T} = useTimes(T0);
  return (
    <AbsoluteFill>
      <Stage T={T} excludeSitter>
        <Wolf T={T} wedgeO={t > 7 && t < 8.4 ? 0.55 + 0.45 * Math.cos(t * 24) : 1} />
        <Sheepdog T={T} />
      </Stage>
      <Matte />
      <Label text="Sheepdog" t={t - 6.2} x={W / 2} y={232} out={p(t, 15, 15.8)} />
      <Tag text="Protects others" t={t - 6.9} x={W / 2} y={312} color={C.BONE} size={32} out={p(t, 15, 15.8)} />
      <Tag text="Capable of confronting violence · under control" t={t - 7.8} x={W / 2} y={358} size={26} out={p(t, 15, 15.8)} />
      <Caption text="Someone on the bench stands up. Nothing about them looks different." t={t} a={0.8} b={5.6} />
      <Caption text="Sheepdogs: protectors, willing to confront violence to defend others." t={t} a={6.0} b={11} />
      <Caption text="Soldiers, police officers, and others who step in when it matters." t={t} a={11.2} b={15.8} />
    </AbsoluteFill>
  );
};

export const S14CapabilityIntent: React.FC<SceneProps> = ({T0}) => {
  const {t, T} = useTimes(T0);
  const kD = LIGHT_ACT2.k * SL * 1.05;
  const kW = LIGHT_ACT2.k * PS * 1.05;
  const baseD = WORLD.wallBase + (SITTER_LANE - WORLD.wallBase) * 0.15;
  const baseW = WORLD.wallBase + (LANE - WORLD.wallBase) * 0.15;
  const capY = Math.min(baseD - 86 * kD, baseW - 86 * kW);
  const dogX = DOG_X + LIGHT_ACT2.dx;
  const wolfX = WOLF_X + LIGHT_ACT2.dx;
  const cap = p(t, 1.2, 2.4);
  const intent = p(t, 5.2, 6.4);
  const ctrl = p(t, 9.6, 10.6);
  const out = p(t, 16, 16.9);
  return (
    <AbsoluteFill>
      <Stage T={T} excludeSitter shadowOpacity={lerp(1, 0.35, p(t, 0.4, 1.4))} crowdOpacity={lerp(1, 0.5, p(t, 0.4, 1.4))} wallExtra={
        <g opacity={1 - out}>
          <g opacity={cap}>
            <line x1={dogX - 150 * kD} x2={wolfX + 150 * kW} y1={capY} y2={capY} stroke={C.BONE} strokeWidth={2.5} strokeDasharray="10 8" />
            <text x={wolfX + 150 * kW} y={capY - 16} textAnchor="end" fill={C.BONE} style={{fontSize: 24, letterSpacing: '0.24em', fontVariationSettings: "'wght' 600"}}>CAPABILITY</text>
          </g>
          <g opacity={intent}>
            <IntentWedge x={dogX + 40} y={capY - 90} angle={0} size={34} color={C.BONE} glow={0.4} />
            <IntentWedge x={wolfX - 40} y={capY - 90} angle={180} size={34} color={C.COLD} />
            <text x={dogX - 20} y={capY - 140} textAnchor="middle" fill={C.BONE} style={{fontSize: 22, letterSpacing: '0.24em', fontVariationSettings: "'wght' 600"}}>PROTECT</text>
            <text x={wolfX + 20} y={capY - 140} textAnchor="middle" fill={C.COLD} style={{fontSize: 22, letterSpacing: '0.24em', fontVariationSettings: "'wght' 600"}}>PREY</text>
          </g>
        </g>
      }>
        <Wolf T={T} ringO={ctrl * (1 - out)} />
        <Sheepdog T={T} ringO={ctrl * (1 - out)} />
        <g opacity={ctrl * (1 - out)}>
          <text x={DOG_X} y={SITTER_LANE + 52} textAnchor="middle" fill={C.BONE} style={{fontSize: 20, letterSpacing: '0.18em'}}>UNDER CONTROL</text>
          <text x={WOLF_X} y={LANE + 52} textAnchor="middle" fill={C.COLD} style={{fontSize: 20, letterSpacing: '0.18em'}}>UNRESTRAINED</text>
        </g>
      </Stage>
      <Matte />
      <Label text="Same capability" t={t - 2.0} x={W / 2} y={200} size={64} out={out} />
      <Label text="Different intent" t={t - 6.4} x={W / 2} y={282} size={64} out={out} color={C.BONE} />
      <Caption text="In the metaphor, wolf and sheepdog can both use force." t={t} a={0.8} b={5.2} />
      <Caption text="The difference is direction: one turns toward the flock, the other stands between it and harm." t={t} a={5.4} b={10.4} />
      <Caption text="And control: the sheepdog is expected to use force responsibly." t={t} a={10.6} b={16.6} />
    </AbsoluteFill>
  );
};

export const S15Prepared: React.FC<SceneProps> = ({T0}) => {
  const {t, T} = useTimes(T0);
  const dusk = p(t, 9.2, 12.4);
  const light: ShadowLight = {...LIGHT_ACT2, k: lerp(LIGHT_ACT2.k, 1.25, dusk), opacity: lerp(LIGHT_ACT2.opacity, 0.3, dusk), dx: lerp(LIGHT_ACT2.dx, 60, dusk)};
  const rev = p(t, 9.6, 11.4);
  return (
    <AbsoluteFill>
      <Stage T={T} excludeSitter light={light} sun={1 - dusk} reverse>
        <Wolf T={T} />
        <Sheepdog T={T} reverse={rev} chevronO={1 - p(t, 5.5, 6.5)} />
      </Stage>
      <Matte />
      <Label text="Preparedness is not aggression" t={t - 1.2} x={W / 2} y={232} size={62} out={p(t, 8.4, 9.2)} />
      <Tag text="Lives in peace. Ready to protect." t={t - 2.4} x={W / 2} y={312} color={C.BONE} size={32} out={p(t, 8.4, 9.2)} />
      <Tag text="A metaphor: a way to think about roles and intent." t={t - 10.4} x={W / 2} y={232} color={C.BONE} size={36} />
      <Tag text="Not a scientific classification of people." t={t - 11.2} x={W / 2} y={284} size={30} />
      <Caption text="Most of the time, the sheepdog's life looks like everyone else's: peaceful and ordinary." t={t} a={0.8} b={5.2} />
      <Caption text="The difference is readiness, not aggression." t={t} a={5.4} b={9.4} />
      <Caption text="Calm, but ready isn't a role. It's a state, and states change." t={t} a={11.8} b={14.9} />
    </AbsoluteFill>
  );
};
