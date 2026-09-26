import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, H, W} from '../theme';
import {EASE_OUT, LINEAR, clamp, kf, lerp, p} from '../lib/anim';
import {Figure, POSES, mixPose, walkPose} from '../components/Figure';
import {Plaza, WORLD, laneScale, Cam} from '../components/World';
import {Crowd, CrowdShadows} from '../components/Crowd';
import {LIGHT_ACT1, ShadowOf} from '../components/Shadows';
import {DistanceLine, GroundRing, IntentWedge, Matte, PulseLine} from '../components/Signals';
import {ResponseCompass} from '../components/Compass';
import {Label, Slate} from '../components/Type';
import {beatsAt} from '../score';
import {BRANCH_CAM, Caption, OTHER_X, PROTAGONIST_X, SceneProps, WorldLayer, heartAt, useTimes} from './common';

const LANE = WORLD.lane.main;
const PS = laneScale(LANE);

/** The Other stands by the bus shelter from the first frame of S02 ("it was there the whole time"). */
export const OTHER_START = {x: 1930, lane: WORLD.lane.back + 4};

/** Protagonist path in S02: walks from x=160 to PROTAGONIST_X. */
export const protagonistS02 = (t: number) => {
  const x = lerp(160, PROTAGONIST_X, clamp(t / 16));
  const phase = (x - 160) / 96;
  const walk = walkPose(phase, 0.95);
  const phoneAmt = p(t, 4.5, 5.3) * (1 - p(t, 9, 9.8));
  const pose = {...walk, head: lerp(walk.head, POSES.phone.head, phoneAmt), shN: lerp(walk.shN, POSES.phone.shN, phoneAmt), elN: lerp(walk.elN, POSES.phone.elN, phoneAmt)};
  return {x, pose, phoneAmt};
};

const Phone: React.FC<{x: number; y: number; o: number; glow?: number}> = ({x, y, o, glow = 1}) =>
  o > 0.01 ? (
    <g opacity={o}>
      <rect x={x - 4} y={y - 8} width={9} height={15} rx={2} fill={C.PAPER} opacity={0.9} />
      <circle cx={x} cy={y} r={16} fill={C.PAPER} opacity={0.08 * glow} />
    </g>
  ) : null;

export const S01Pulse: React.FC<SceneProps> = ({T0}) => {
  const {t, T} = useTimes(T0);
  const draw = p(t, 0.6, 4.2, LINEAR);
  const lineOut = p(t, 5.2, 7.2);
  const world = p(t, 5.6, 8.4);
  const cam: Cam = {x: lerp(560, 520, p(t, 5, 12)), y: lerp(560, 640, p(t, 5.6, 9.5)), zoom: lerp(1.25, 1.08, p(t, 5.6, 12))};
  const beats = beatsAt(T);
  const pose = walkPose(0, 0);
  const heart = heartAt(T);
  const dotX = lerp(1500, 0, 0);
  return (
    <AbsoluteFill style={{background: C.INK}}>
      <AbsoluteFill style={{opacity: world}}>
        <Plaza cam={cam} wallLayer={<CrowdShadows t={T} light={LIGHT_ACT1} />} actorLayer={<Crowd t={T} />} />
      </AbsoluteFill>
      <WorldLayer cam={cam}>
        <g opacity={p(t, 7.4, 8.6)}>
          <ShadowOf x={160} lane={LANE} pose={pose} scale={PS} light={LIGHT_ACT1} />
          <Figure x={160} y={LANE} pose={{...pose, ...POSES.stand}} scale={PS} heart={heart} />
        </g>
      </WorldLayer>
      <AbsoluteFill style={{opacity: 1 - lineOut}}>
        <svg width={W} height={H}>
          <PulseLine x0={160} x1={dotX + 1760 * draw} y={lerp(H / 2, 470, lineOut)} phase={beats} beatsVisible={5 * Math.max(0.05, draw)} amp={70} draw={1} color={C.PAPER} />
          <circle cx={160 + 1600 * draw} cy={H / 2} r={5 + 4 * heart.pulse} fill={C.PAPER} opacity={draw < 1 ? 1 : 1 - lineOut} />
        </svg>
      </AbsoluteFill>
      <Matte amount={p(t, 6, 8.5)} />
      <Label text="Calm, but ready" t={t - 8.6} x={W / 2} y={300} size={84} out={p(t, 10.9, 11.8)} />
    </AbsoluteFill>
  );
};

export const S02OrdinaryDay: React.FC<SceneProps> = ({T0}) => {
  const {t, T} = useTimes(T0);
  const pr = protagonistS02(t);
  const cam: Cam = {x: lerp(520, 1000, p(t, 0, 16, LINEAR)), y: 640, zoom: lerp(1.08, 1.0, p(t, 0, 16))};
  const heart = heartAt(T);
  const hand = {x: pr.x + 24 * PS, y: LANE - 118 * PS};
  return (
    <AbsoluteFill>
      <Plaza cam={cam} wallLayer={<CrowdShadows t={T} light={LIGHT_ACT1} />} actorLayer={<Crowd t={T} />} />
      <WorldLayer cam={cam}>
        <ShadowOf x={OTHER_START.x} lane={OTHER_START.lane} pose={POSES.stand} scale={laneScale(OTHER_START.lane)} facing={-1} light={LIGHT_ACT1} />
        <Figure x={OTHER_START.x} y={OTHER_START.lane} pose={POSES.stand} scale={laneScale(OTHER_START.lane)} facing={-1} fill={C.GRAPHITE} rim={C.COLD} opacity={0.75} />
        <ShadowOf x={pr.x} lane={LANE} pose={pr.pose} scale={PS} light={LIGHT_ACT1} />
        <Figure x={pr.x} y={LANE} pose={pr.pose} scale={PS} heart={heart} />
        <Phone x={hand.x} y={hand.y} o={pr.phoneAmt} />
      </WorldLayer>
      <Matte />
      <Slate text="I · THE MOMENT" t={t - 0.4} out={p(t, 4, 5)} />
      <Caption text="Most days are ordinary." t={t} a={1} b={6.5} />
      <Caption text="Nothing happens. Nothing needs to." t={t} a={7.5} b={14.5} />
    </AbsoluteFill>
  );
};

/** State of the two principals during S03 (also used as the frozen state for the branch scenes). */
export const principalsS03 = (t: number) => {
  const otherX = lerp(OTHER_START.x, OTHER_X, p(t, 1.5, 13.5, LINEAR));
  const otherLane = lerp(OTHER_START.lane, LANE, p(t, 1.5, 6));
  const otherPhase = (OTHER_START.x - otherX) / 96;
  const walking = t > 1.5 && t < 13.5;
  const otherPose = walking ? walkPose(otherPhase, 0.9) : mixPose(walkPose(otherPhase, 0.9), POSES.stand, p(t, 13.5, 14.2));
  const settle = p(t, 0, 1.2, EASE_OUT);
  const protPose = mixPose(mixPose(walkPose(20 / 3, 0.95), POSES.stand, settle), POSES.alert, p(t, 6, 7.2));
  return {otherX, otherLane, otherPose, protPose};
};

export const S03Shift: React.FC<SceneProps> = ({T0}) => {
  const {t, T} = useTimes(T0);
  const st = principalsS03(t);
  const cam: Cam = {x: kf(t, [[0, 1000], [16, BRANCH_CAM.x]]), y: kf(t, [[0, 640], [16, BRANCH_CAM.y]]), zoom: kf(t, [[0, 1], [16, BRANCH_CAM.zoom]])};
  const heart = heartAt(T);
  const os = laneScale(st.otherLane);
  const wedgeO = p(t, 3, 4.2);
  const pathO = p(t, 8, 9.5) * (1 - p(t, 14.5, 15.8));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: `saturate(${lerp(1, 0.75, p(t, 6, 14))})`}}>
        <Plaza cam={cam} wallLayer={<CrowdShadows t={T} light={LIGHT_ACT1} />} actorLayer={<Crowd t={T} opacity={lerp(1, 0.78, p(t, 6, 14))} />} />
      </AbsoluteFill>
      <WorldLayer cam={cam}>
        <ShadowOf x={st.otherX} lane={st.otherLane} pose={st.otherPose} scale={os} facing={-1} light={LIGHT_ACT1} />
        <ShadowOf x={PROTAGONIST_X} lane={LANE} pose={st.protPose} scale={PS} light={LIGHT_ACT1} />
        <g opacity={pathO}>
          <line x1={st.otherX - 30} x2={PROTAGONIST_X + 40} y1={LANE + 6} y2={LANE + 6} stroke={C.COLD} strokeWidth={2} strokeDasharray="3 9" strokeLinecap="round" />
        </g>
        <Figure x={st.otherX} y={st.otherLane} pose={st.otherPose} scale={os} facing={-1} fill={C.GRAPHITE} rim={C.COLD} opacity={lerp(0.75, 1, p(t, 1, 4))} />
        <IntentWedge x={st.otherX - 38 * os} y={st.otherLane - 162 * os} angle={180} opacity={wedgeO} />
        <Figure x={PROTAGONIST_X} y={LANE} pose={st.protPose} scale={PS} heart={heart} />
      </WorldLayer>
      <Matte />
      <Caption text="Then, sometimes, something doesn't fit." t={t} a={2.5} b={8.5} />
      <Caption text="When a threat appears, a person has to respond." t={t} a={9.5} b={15.6} />
    </AbsoluteFill>
  );
};

export const branchStatic = () => {
  const st = principalsS03(16);
  return {...st, heartY: LANE - 112 * PS};
};

export const S04Branch: React.FC<SceneProps> = ({T0}) => {
  const {t, T} = useTimes(T0);
  const st = branchStatic();
  const freeze = p(t, 0.6, 1.6);
  const worldT = T0 + Math.min(t, 1.1) - 0.5 * p(t, 0.6, 1.6);
  const cam = BRANCH_CAM;
  const heart = heartAt(T);
  const cx = PROTAGONIST_X;
  const cy = st.heartY;
  const arm = (a: number) => p(t, a, a + 0.7, EASE_OUT);
  const draws = {fight: arm(4.2), flight: arm(5.2), freeze: arm(6.2), posture: arm(7.2), submit: arm(8.2)};
  const litAll = 0.9 - 0.55 * p(t, 10, 11);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: `saturate(${lerp(0.75, 0.15, freeze)}) brightness(${lerp(1, 0.72, freeze)})`}}>
        <Plaza cam={cam} wallLayer={<CrowdShadows t={worldT} light={LIGHT_ACT1} />} actorLayer={<Crowd t={worldT} opacity={0.78} />} />
      </AbsoluteFill>
      <WorldLayer cam={cam}>
        <ShadowOf x={st.otherX} lane={LANE} pose={st.otherPose} scale={PS} facing={-1} light={LIGHT_ACT1} />
        <ShadowOf x={PROTAGONIST_X} lane={LANE} pose={st.protPose} scale={PS} light={LIGHT_ACT1} />
        <GroundRing x={PROTAGONIST_X} y={LANE + 2} r={lerp(20, 78, p(t, 2, 3))} opacity={p(t, 2, 2.6)} />
        <GroundRing x={st.otherX} y={LANE + 2} r={lerp(20, 78, p(t, 2.3, 3.3))} color={C.COLD} opacity={p(t, 2.3, 2.9)} />
        <DistanceLine x1={PROTAGONIST_X + 84} x2={st.otherX - 84} y={LANE + 40} opacity={p(t, 2.8, 3.5)} />
        <Figure x={st.otherX} y={LANE} pose={st.otherPose} scale={PS} facing={-1} fill={C.GRAPHITE} rim={C.COLD} />
        <IntentWedge x={st.otherX - 38 * PS} y={LANE - 162 * PS} angle={180} />
        <Figure x={PROTAGONIST_X} y={LANE} pose={st.protPose} scale={PS} heart={heart} />
        <ResponseCompass x={cx} y={cy} draw={draws} lit={{fight: litAll, flight: litAll, freeze: litAll, posture: litAll, submit: litAll}} rx={250} ry={150} />
      </WorldLayer>
      <Matte />
      <Caption text="Time stops. One moment, one threat." t={t} a={1.2} b={4} />
      <Caption text="Broadly, there are five ways a response can go." t={t} a={4.4} b={11.6} />
    </AbsoluteFill>
  );
};
