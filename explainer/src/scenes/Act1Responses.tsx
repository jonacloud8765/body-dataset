import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, W} from '../theme';
import {EASE, EASE_OUT, LINEAR, lerp, p} from '../lib/anim';
import {Figure, POSES, Pose, mixPose, runPose, walkPose} from '../components/Figure';
import {Cam, Plaza, WORLD, laneScale} from '../components/World';
import {Crowd, CrowdShadows} from '../components/Crowd';
import {LIGHT_ACT1, LIGHT_ACT2, ShadowOf, lerpLight} from '../components/Shadows';
import {DistanceLine, GroundRing, IntentWedge, Matte, SoundArcs} from '../components/Signals';
import {ResponseCompass, ResponseId} from '../components/Compass';
import {Behavior, Label, Slate, Tag} from '../components/Type';
import {S} from '../score';
import {BRANCH_CAM, Caption, OTHER_X, PROTAGONIST_X, SceneProps, WorldLayer, heartAt, useTimes} from './common';
import {branchStatic} from './Act1Open';

const LANE = WORLD.lane.main;
const PS = laneScale(LANE);
export const FREEZE_T = () => S('S04') + 0.6;

type Actor = {x: number; pose: Pose; facing: 1 | -1; ring: number; grow?: number; opacity?: number; outline?: number};
type OtherActor = Actor & {wedgeAngle: number; wedgeO: number; ringJag?: number};

type BranchSpec = {
  id: ResponseId;
  behavior: Behavior;
  label: string;
  labelAt: number;
  tags: {text: string; at: number}[];
  captions: {text: string; a: number; b: number}[];
  prot: (b: number) => Actor;
  other: (b: number) => OtherActor;
  cam?: (b: number) => Cam;
  world?: (b: number, t: number) => React.ReactNode;
  worldMoves?: boolean;
  rewind?: boolean;
};

const st0 = branchStatic();
const START_POSE = st0.protPose;
const OTHER_POSE = st0.otherPose;
const allDrawn = {fight: 1, flight: 1, freeze: 1, posture: 1, submit: 1};

const BranchScene: React.FC<SceneProps & {spec: BranchSpec; D: number}> = ({T0, spec, D}) => {
  const {t, T} = useTimes(T0);
  const rewindA = D - 1.7;
  const rewindB = D - 0.8;
  const act = Math.max(0, Math.min(t, rewindA) - 0.6);
  const b = spec.rewind === false ? Math.max(0, t - 0.6) : t < rewindA ? act : lerp(rewindA - 0.6, 0, p(t, rewindA, rewindB, EASE));
  const rewinding = spec.rewind !== false && t > rewindA && t < rewindB;
  const pr = spec.prot(b);
  const ot = spec.other(b);
  const cam = spec.cam ? spec.cam(b) : BRANCH_CAM;
  const wt = FREEZE_T() + (spec.worldMoves ? b * 0.9 : 0);
  const heart = heartAt(T);
  const lit = {fight: 0.3, flight: 0.3, freeze: 0.3, posture: 0.3, submit: 0.3, [spec.id]: 1};
  const labelOut = spec.rewind === false ? 0 : p(t, rewindA - 0.4, rewindA + 0.2);
  const compassO = lerp(1, 0.35, p(t, 0.6, 1.6)) + (spec.rewind === false ? 0 : 0.65 * p(t, rewindA, rewindB));
  const moved = Math.abs(pr.x - PROTAGONIST_X) > 20 || pr.pose !== START_POSE;
  const trail = rewinding ? [0.35, 0.7] : [];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: `saturate(0.15) brightness(${spec.worldMoves ? 0.78 : 0.72})`}}>
        <Plaza cam={cam} wallLayer={<CrowdShadows t={wt} light={LIGHT_ACT1} />} actorLayer={<Crowd t={wt} opacity={0.5} />} />
      </AbsoluteFill>
      <WorldLayer cam={cam}>
        <ShadowOf x={ot.x} lane={LANE} pose={ot.pose} scale={PS} facing={ot.facing} light={LIGHT_ACT1} grow={ot.grow} />
        <ShadowOf x={pr.x} lane={LANE} pose={pr.pose} scale={PS} facing={pr.facing} light={LIGHT_ACT1} grow={pr.grow} />
        {spec.world ? spec.world(b, t) : null}
        <GroundRing x={pr.x} y={LANE + 2} r={pr.ring} />
        <GroundRing x={ot.x} y={LANE + 2} r={ot.ring} color={C.COLD} jagged={ot.ringJag ?? 0} />
        <DistanceLine x1={Math.min(pr.x, ot.x) + pr.ring + 6} x2={Math.max(pr.x, ot.x) - ot.ring - 6} y={LANE + 40} opacity={Math.abs(ot.x - pr.x) - pr.ring - ot.ring > 24 ? 0.8 : 0} />
        {moved ? <Figure x={PROTAGONIST_X} y={LANE} pose={START_POSE} scale={PS} fill={C.BONE} rim={null} flat opacity={0.12} /> : null}
        <Figure x={ot.x} y={LANE} pose={ot.pose} scale={PS} facing={ot.facing} fill={C.GRAPHITE} rim={C.COLD} />
        <IntentWedge x={ot.x + (ot.facing === 1 ? 38 : -38) * PS} y={LANE - 162 * PS} angle={ot.wedgeAngle} opacity={ot.wedgeO} />
        {trail.map((d, i) => {
          const g = spec.prot(Math.min(rewindA - 0.6, b + d));
          return <Figure key={i} x={g.x} y={LANE} pose={g.pose} scale={PS} facing={g.facing} fill={C.BONE} rim={null} flat opacity={0.18 - i * 0.07} />;
        })}
        <Figure x={pr.x} y={LANE} pose={pr.pose} scale={PS} facing={pr.facing} heart={heart} opacity={pr.opacity ?? 1} outline={pr.outline ? {color: C.PAPER, width: 2, opacity: pr.outline} : null} />
        <ResponseCompass x={PROTAGONIST_X} y={st0.heartY} draw={allDrawn} lit={lit} rx={250} ry={150} opacity={compassO} labelOpacity={0.9} />
      </WorldLayer>
      <Matte />
      <Label text={spec.label} t={t - spec.labelAt} x={W / 2} y={232} behavior={spec.behavior} out={labelOut} />
      {spec.tags.map((g, i) => (
        <Tag key={i} text={g.text} t={t - g.at} x={W / 2} y={312 + i * 46} out={labelOut} size={i === 0 ? 32 : 26} color={i === 0 ? C.BONE : C.MIST} />
      ))}
      {spec.captions.map((c, i) => (
        <Caption key={i} text={c.text} t={t} a={c.a} b={c.b} />
      ))}
    </AbsoluteFill>
  );
};

const otherStill = (): OtherActor => ({x: OTHER_X, pose: OTHER_POSE, facing: -1, ring: 78, wedgeAngle: 180, wedgeO: 1});

const FIGHT: BranchSpec = {
  id: 'fight',
  behavior: 'fight',
  label: 'Fight',
  labelAt: 3.9,
  tags: [
    {text: 'Confront the threat directly', at: 4.5},
    {text: 'Can be adaptive when trained and appropriate', at: 5.4},
  ],
  captions: [{text: 'Fight: move toward the threat and confront it.', a: 1, b: 7.8}],
  prot: (b) => {
    const k = p(b, 0.2, 3.1, EASE);
    const x = lerp(PROTAGONIST_X, OTHER_X - 150, k);
    const phase = (x - PROTAGONIST_X) / 80;
    const pose = k < 1 ? mixPose(walkPose(phase, 1.1), POSES.guard, 0.55 + 0.45 * p(b, 0, 0.6)) : POSES.guard;
    return {x, pose: mixPose(START_POSE, pose, p(b, 0, 0.5)), facing: 1, ring: 78};
  },
  other: () => otherStill(),
  cam: (b) => ({...BRANCH_CAM, zoom: BRANCH_CAM.zoom + 0.05 * p(b, 2.6, 3.2, EASE_OUT), x: BRANCH_CAM.x + 60 * p(b, 0.2, 3.1)}),
  world: (b) => {
    const hit = p(b, 3.0, 3.15) * (1 - p(b, 3.3, 4.2));
    const cx = (OTHER_X - 150 + OTHER_X) / 2;
    return (
      <g opacity={hit}>
        <line x1={cx} x2={cx} y1={LANE - 40} y2={LANE + 30} stroke={C.PAPER} strokeWidth={4} strokeLinecap="round" />
        <ellipse cx={cx} cy={LANE + 2} rx={26} ry={8} fill="none" stroke={C.PAPER} strokeWidth={2} />
      </g>
    );
  },
};

const FLIGHT: BranchSpec = {
  id: 'flight',
  behavior: 'flight',
  label: 'Flight',
  labelAt: 3.4,
  tags: [
    {text: 'Escape. Create distance.', at: 4.0},
    {text: 'Survival-oriented; common when escape is possible', at: 4.9},
  ],
  captions: [{text: 'Flight: move away and increase the distance.', a: 1, b: 8.8}],
  prot: (b) => {
    const turn = p(b, 0, 0.5);
    const k = p(b, 0.5, 7.5, (x) => x * (0.6 + 0.4 * x));
    const x = lerp(PROTAGONIST_X, WORLD.exitX + 10, k);
    const run = runPose((PROTAGONIST_X - x) / 150, 1);
    return {x, pose: turn < 1 ? mixPose(START_POSE, run, turn) : run, facing: turn > 0.5 ? -1 : 1, ring: 78, opacity: 1 - p(b, 7.0, 7.6)};
  },
  other: (b) => ({...otherStill(), x: OTHER_X - 90 * p(b, 0.8, 2.6), pose: b > 0.8 && b < 2.6 ? walkPose(b * 1.2, 0.8) : OTHER_POSE}),
  cam: (b) => ({x: lerp(BRANCH_CAM.x, 760, p(b, 0.5, 7)), y: lerp(BRANCH_CAM.y, 620, p(b, 0.5, 7)), zoom: lerp(BRANCH_CAM.zoom, 0.84, p(b, 0.5, 7))}),
  world: (b) => {
    const glow = p(b, 1, 2.5) * (1 - p(b, 7.2, 8));
    const ex = WORLD.exitX;
    return (
      <g opacity={glow}>
        <path d={`M ${ex - 75} ${WORLD.wallBase} L ${ex - 75} ${WORLD.wallBase - 255} A 75 75 0 0 1 ${ex + 75} ${WORLD.wallBase - 255} L ${ex + 75} ${WORLD.wallBase}`} fill="none" stroke={C.BONE} strokeWidth={3} opacity={0.7} />
        <rect x={ex - 70} y={WORLD.wallBase - 300} width={140} height={300} fill={C.BONE} opacity={0.06} />
      </g>
    );
  },
  worldMoves: true,
};

const FREEZE: BranchSpec = {
  id: 'freeze',
  behavior: 'freeze',
  label: 'Freeze',
  labelAt: 1.8,
  tags: [
    {text: 'Temporary inability to act', at: 2.5},
    {text: 'Can conceal, or wait for an opening', at: 5.6},
    {text: 'Dangerous if it lasts too long', at: 9.6},
  ],
  captions: [
    {text: 'Freeze: the body stops, while the world keeps moving.', a: 0.8, b: 5.2},
    {text: 'Sometimes stillness hides you, or buys time.', a: 5.4, b: 9.0},
    {text: 'Held too long, the opening closes. It can follow sensory overload.', a: 9.2, b: 13.2},
  ],
  prot: (b) => ({x: PROTAGONIST_X, pose: START_POSE, facing: 1, ring: 78, opacity: 1 - 0.45 * p(b, 4.6, 5.6) * (1 - p(b, 8.4, 9.2)), outline: p(b, 0.4, 1.4) * 0.8}),
  other: (b) => {
    const adv = p(b, 8.6, 12, LINEAR);
    const x = lerp(OTHER_X, OTHER_X - 190, adv);
    const scan = b > 4.2 && b < 8.4 ? 180 + Math.sin((b - 4.2) * 1.5) * 55 : 180;
    return {x, pose: adv > 0 && adv < 1 ? walkPose(b * 1.1, 0.7) : OTHER_POSE, facing: -1, ring: 78, wedgeAngle: scan, wedgeO: 1};
  },
  world: (b) => {
    const open = p(b, 5.4, 6.4) * (1 - p(b, 9.2, 10.4));
    const ex = WORLD.exitX;
    return (
      <g opacity={open}>
        <path d={`M ${ex - 75} ${WORLD.wallBase} L ${ex - 75} ${WORLD.wallBase - 255} A 75 75 0 0 1 ${ex + 75} ${WORLD.wallBase - 255} L ${ex + 75} ${WORLD.wallBase}`} fill="none" stroke={C.BONE} strokeWidth={3} opacity={0.6} />
        <text x={ex} y={WORLD.wallBase - 350} textAnchor="middle" fill={C.BONE} opacity={0.8} style={{fontFamily: 'inherit', fontSize: 20, letterSpacing: '0.2em'}}>
          OPENING
        </text>
      </g>
    );
  },
  worldMoves: true,
};

const SUBMIT: BranchSpec = {
  id: 'submit',
  behavior: 'submit',
  label: 'Submit',
  labelAt: 3.0,
  tags: [
    {text: 'Yield. Give control to the threat.', at: 3.7},
    {text: 'Passive surrender or appeasement', at: 4.6},
  ],
  captions: [{text: 'Submit: lower, yield, hand control to the threat.', a: 1, b: 7.8}],
  prot: (b) => {
    const k = p(b, 0.2, 2.4, EASE);
    return {x: PROTAGONIST_X, pose: mixPose(START_POSE, POSES.submit, k), facing: 1, ring: lerp(78, 34, k), grow: lerp(1, 0.72, k)};
  },
  other: (b) => {
    const k = p(b, 1.2, 4.2, EASE);
    return {x: lerp(OTHER_X, OTHER_X - 170, k), pose: k > 0 && k < 1 ? walkPose(b, 0.6) : OTHER_POSE, facing: -1, ring: lerp(78, 230, k), wedgeAngle: 180 + 18 * k, wedgeO: 1, grow: lerp(1, 1.3, k)};
  },
};

const POSTURE: BranchSpec = {
  id: 'posture',
  behavior: 'posture',
  label: 'Posture',
  labelAt: 3.0,
  tags: [
    {text: 'Signal strength to deter the threat', at: 3.8},
    {text: 'Voice · stance · visible resistance', at: 4.8},
    {text: 'Can prevent actual violence', at: 8.2},
  ],
  captions: [
    {text: 'Posture: look bigger, sound firm, show resistance.', a: 1, b: 6.8},
    {text: 'Often seen in humans and animals, it can stop violence before it starts.', a: 7.0, b: 12.4},
  ],
  prot: (b) => {
    const k = p(b, 0.3, 1.5, EASE_OUT);
    return {x: PROTAGONIST_X, pose: mixPose(START_POSE, POSES.posture, k), facing: 1, ring: lerp(78, 150, p(b, 1.2, 2.6)), grow: lerp(1, 1.55, p(b, 1.0, 3.0))};
  },
  other: (b) => {
    const hes = p(b, 3.2, 3.8);
    const back = p(b, 4.4, 8.4, EASE);
    const flick = b > 3.2 && b < 4.4 ? 0.55 + 0.45 * Math.cos(b * 28) : 1;
    return {x: lerp(OTHER_X, OTHER_X + 330, back), pose: back > 0 && back < 1 ? walkPose(b * 1.1, 0.8) : OTHER_POSE, facing: back > 0.02 ? 1 : -1, ring: lerp(78, 60, hes), wedgeAngle: lerp(180, 360, p(b, 3.6, 4.6)), wedgeO: flick * lerp(1, 0.55, back)};
  },
  world: (b) => <SoundArcs x={PROTAGONIST_X + 30} y={LANE - 160 * PS} angle={0} t={b - 1.4} reach={380} count={4} color={C.BONE} />,
  rewind: false,
};

export const S05Fight: React.FC<SceneProps> = ({T0}) => <BranchScene T0={T0} spec={FIGHT} D={10} />;
export const S06Flight: React.FC<SceneProps> = ({T0}) => <BranchScene T0={T0} spec={FLIGHT} D={11} />;
export const S07Freeze: React.FC<SceneProps> = ({T0}) => <BranchScene T0={T0} spec={FREEZE} D={15} />;
export const S08Submit: React.FC<SceneProps> = ({T0}) => <BranchScene T0={T0} spec={SUBMIT} D={10} />;
export const S09Posture: React.FC<SceneProps> = ({T0}) => <BranchScene T0={T0} spec={POSTURE} D={13} />;

/** Posture end state (S09 at t=13 → b=12.4) reused by S10. */
const postureEnd = () => ({pr: POSTURE.prot(12.4), ot: POSTURE.other(12.4)});

export const S10PerceivedStrength: React.FC<SceneProps> = ({T0}) => {
  const {t, T} = useTimes(T0);
  const end = postureEnd();
  const heart = heartAt(T);
  const relax = p(t, 11.5, 13.5);
  const light = lerpLight(LIGHT_ACT1, LIGHT_ACT2, p(t, 11, 15.5));
  const protLight = {...light, opacity: Math.max(light.opacity, 0.62 * p(t, 0.5, 2.5)), blur: Math.min(light.blur, 1.6)};
  const cam: Cam = {x: lerp(BRANCH_CAM.x, 900, p(t, 0.5, 4)), y: lerp(lerp(BRANCH_CAM.y, 600, p(t, 0.5, 4)), 575, p(t, 11.5, 16.5)), zoom: lerp(lerp(BRANCH_CAM.zoom, 1.0, p(t, 0.5, 4)), 0.95, p(t, 11.5, 16.5))};
  const sat = lerp(0.15, 1, p(t, 11.5, 15));
  const wt = FREEZE_T() + Math.max(0, t - 11.5) * p(t, 11.5, 13);
  const otherX = end.ot.x + 520 * p(t, 0, 5, EASE);
  const protPose = mixPose(end.pr.pose, POSES.alert, relax);
  const grow = lerp(end.pr.grow ?? 1.55, 1, relax) * (1 + 0.1 * p(t, 5, 6.5) * (1 - relax));
  const cat = p(t, 8.4, 9.2) * (1 - p(t, 10.4, 11.2));
  const shadowTop = WORLD.wallBase - 190 * PS * light.k * grow;
  const shadowRight = PROTAGONIST_X + light.dx + 95 * PS * light.k * grow;
  const bracketO = p(t, 4.6, 5.4) * (1 - p(t, 10.8, 11.6));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: `saturate(${sat}) brightness(${lerp(0.72, 1, p(t, 11.5, 15))})`}}>
        <Plaza cam={cam} sun={p(t, 11, 15.5)} wallLayer={<CrowdShadows t={wt} light={light} />} actorLayer={<Crowd t={wt} opacity={lerp(0.5, 1, p(t, 11.5, 15))} />} />
      </AbsoluteFill>
      <WorldLayer cam={cam}>
        <ShadowOf x={PROTAGONIST_X} lane={LANE} pose={protPose} scale={PS} light={protLight} grow={grow} animal={{kind: 'cat', t: cat, scale: 1.25}} />
        <Figure x={otherX} y={LANE} pose={walkPose(t * 1.2, 0.8)} scale={PS} facing={1} fill={C.GRAPHITE} rim={C.COLD} opacity={1 - p(t, 3, 5)} />
        <GroundRing x={PROTAGONIST_X} y={LANE + 2} r={lerp(150, 78, relax)} opacity={1 - p(t, 12, 14)} />
        <Figure x={PROTAGONIST_X} y={LANE} pose={protPose} scale={PS} heart={heart} />
        <g opacity={bracketO} stroke={C.BONE} strokeWidth={2} fill="none">
          <path d={`M ${PROTAGONIST_X - 70} ${LANE - 185 * PS} l -12 0 l 0 ${185 * PS} l 12 0`} />
          <path d={`M ${shadowRight} ${shadowTop} l 12 0 l 0 ${WORLD.wallBase - shadowTop} l -12 0`} />
        </g>
        <g opacity={bracketO}>
          <text x={PROTAGONIST_X - 92} y={LANE - 95 * PS} textAnchor="end" fill={C.BONE} style={{fontSize: 22, letterSpacing: '0.2em'}}>ACTUAL</text>
          <text x={shadowRight + 26} y={(shadowTop + WORLD.wallBase) / 2} fill={C.BONE} style={{fontSize: 22, letterSpacing: '0.2em'}}>PERCEIVED</text>
        </g>
      </WorldLayer>
      <Matte />
      <div style={{position: 'absolute', left: W / 2, top: 230, transform: 'translate(-50%, -50%)', width: 1300, textAlign: 'center', fontSize: 50, lineHeight: 1.25, color: C.BONE, fontVariationSettings: "'wght' 430", opacity: p(t, 1.2, 2.2) * (1 - p(t, 5.0, 5.6))}}>
        “The appearance of strength is as important, in many cases, as strength itself.”
      </div>
      <Tag text="The threat reacts to what it perceives." t={t - 5.9} x={W / 2} y={232} out={p(t, 7.6, 8.2)} color={C.BONE} size={34} />
      <Tag text="Animals do it too." t={t - 8.8} x={W / 2} y={232} out={p(t, 10.6, 11.2)} color={C.BONE} size={34} />
      <Caption text="Posture works on perception, not on actual strength." t={t} a={4.4} b={8.2} />
      <Caption text="Signals like these are how we read each other: who is harmless, who is dangerous." t={t} a={11.6} b={16.8} />
      <Slate text="II · THE ROLES" t={t - 14.6} />
    </AbsoluteFill>
  );
};
