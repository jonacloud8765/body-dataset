import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, CONDITIONS, W, mixHex} from '../theme';
import {EASE, EASE_OUT, LINEAR, clamp, kf, lerp, p} from '../lib/anim';
import {Figure, POSES, anchor, mixPose, walkPose} from '../components/Figure';
import {Cam, Plaza, WORLD, laneScale} from '../components/World';
import {Crowd, CrowdShadows} from '../components/Crowd';
import {LIGHT_ACT1, ShadowOf} from '../components/Shadows';
import {AttentionField, GroundRing, IntentWedge, Matte, SoundArcs} from '../components/Signals';
import {ConditionReadout, Label, Tag} from '../components/Type';
import {S} from '../score';
import {BRANCH_CAM, Caption, PROTAGONIST_X, SceneProps, WorldLayer, heartAt, useTimes} from './common';
import {OTHER_START, principalsS03} from './Act1Open';
import {wt2} from './Act2';
import {Instruments, MotorPanel, ReactionGap, cyclistX, wt3} from './Act3Shared';

const LANE = WORLD.lane.main;
/** Act III: the lower bar holds the instruments, so captions sit just above it. */
const LIFT = 128;
const PS = laneScale(LANE);
const OS = laneScale(OTHER_START.lane);

const Phone: React.FC<{x: number; y: number; o: number}> = ({x, y, o}) =>
  o > 0.01 ? (
    <g opacity={o}>
      <rect x={x - 4} y={y - 8} width={9} height={15} rx={2} fill={C.PAPER} opacity={0.9} />
      <circle cx={x} cy={y} r={16} fill={C.PAPER} opacity={0.1} />
    </g>
  ) : null;

const Cyclist: React.FC<{x: number; t: number}> = ({x, t}) => {
  const s = laneScale(WORLD.lane.front + 8);
  const ph = t * 1.4 * 6.28;
  return (
    <g>
      <g transform={`translate(${x} ${WORLD.lane.front + 8}) scale(${s})`} stroke={C.ASH} strokeWidth={4} fill="none">
        <circle cx={-34} cy={-22} r={22} />
        <circle cx={34} cy={-22} r={22} />
        <path d="M -34 -22 L -6 -54 L 24 -54 L 34 -22 M -6 -54 L 4 -22 L -34 -22 M 24 -54 L 20 -68" />
      </g>
      <Figure x={x - 8 * s} y={WORLD.lane.front + 8 - 6 * s} pose={{...POSES.sit, lean: 18, shN: 62, elN: 16, shF: 58, elF: 18, hipN: 62 + 22 * Math.sin(ph), hipF: 62 - 22 * Math.sin(ph), knN: 70 + 20 * Math.cos(ph), knF: 70 - 20 * Math.cos(ph), sit: 1}} scale={s} fill="#5C6670" rim={mixHex(C.SUN, '#5C6670', 0.55)} />
    </g>
  );
};

/** Excluding the looping crowd cyclist in Act III; scenes stage their own. */
const noCyclist = [50];

export const S16Rewind: React.FC<SceneProps> = ({T0}) => {
  const {t, T} = useTimes(T0);
  const back = p(t, 0.3, 4.6, EASE);
  const wtEnd = wt2(S('S16'));
  const wt = lerp(wtEnd, 12, back);
  const x = lerp(1500, 160, back);
  const pose = back < 1 ? walkPose((x - 160) / 96, 0.95) : POSES.stand;
  const cam: Cam = {x: lerp(900, 440, back), y: lerp(575, 640, back), zoom: lerp(0.95, 0.98, back)};
  const heart = heartAt(T);
  const h = anchor({x, y: LANE, pose, scale: PS}, 'heart');
  const drop = p(t, 4.4, 5.4);
  const rewinding = t > 0.3 && t < 4.6;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: `saturate(${kf(t, [[0, 1], [0.3, 0.5], [4.6, 0.5], [5.4, 1]])})`}}>
        <Plaza cam={cam} sun={0} wallLayer={<CrowdShadows t={wt} light={LIGHT_ACT1} />} actorLayer={<Crowd t={wt} exclude={noCyclist} />} />
      </AbsoluteFill>
      <WorldLayer cam={cam}>
        {rewinding
          ? [0.04, 0.08, 0.12].map((d, i) => {
              const bx = lerp(1500, 160, p(t - d * 4, 0.3, 4.6, EASE));
              return <Figure key={i} x={bx} y={LANE} pose={walkPose((bx - 160) / 96, 0.95)} scale={PS} fill={C.BONE} rim={null} flat opacity={0.16 - i * 0.04} />;
            })
          : null}
        <Figure x={x} y={LANE} pose={pose} scale={PS} heart={heart} opacity={p(t, 0, 0.5)} />
      </WorldLayer>
      {drop > 0 ? (
        <svg width={W} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <line x1={W / 2 + (h.x - cam.x) * cam.zoom} x2={W / 2 + (h.x - cam.x) * cam.zoom} y1={540 + (h.y - cam.y) * cam.zoom} y2={lerp(540 + (h.y - cam.y) * cam.zoom, 1011, drop)} stroke={C.PAPER} strokeWidth={2} opacity={1 - p(t, 5.8, 6.6)} />
        </svg>
      ) : null}
      <Matte />
      <Instruments T={T} t={t} cond={0} opacity={p(t, 5.0, 5.8)} readoutAt={99} railDraw={p(t, 5.2, 6.8, LINEAR)} />
      <Label text="III · The ladder" t={t - 0.4} x={W / 2} y={69} size={26} out={p(t, 4, 4.8)} color={C.MIST} weight={500} />
      <Caption text="Back to the start. This time, from the inside." t={t} a={0.6} b={4.6} lift={LIFT} />
      <Caption text="The heartbeat becomes a meter: five conditions of arousal." t={t} a={4.8} b={6.95} lift={LIFT} />
    </AbsoluteFill>
  );
};

/** Act III protagonist path: S17 walk on the phone, S18 arrive and stop at PROTAGONIST_X. */
const protS17 = (t: number) => {
  const x = lerp(160, 700, clamp(t / 22));
  const walk = walkPose((x - 160) / 72, 0.8);
  const ph = p(t, 0.2, 1.0);
  const startle = p(t, 15.0, 15.25) * (1 - p(t, 15.6, 16.4));
  const pose = {...walk, head: lerp(lerp(walk.head, POSES.phone.head, ph), -8, startle), shN: lerp(lerp(walk.shN, POSES.phone.shN, ph), 40, startle), elN: lerp(lerp(walk.elN, POSES.phone.elN, ph), 90, startle), lean: walk.lean - 8 * startle};
  return {x, pose, phone: ph * (1 - 0.3 * startle)};
};

export const S17White: React.FC<SceneProps> = ({T0}) => {
  const {t, T} = useTimes(T0);
  const pr = protS17(t);
  const reveal = p(t, 6.2, 8.2) * (1 - p(t, 10.6, 12.4));
  const cam: Cam = {x: lerp(pr.x + 280, 1420, reveal), y: 640, zoom: lerp(0.98, 0.8, reveal)};
  const wt = wt3(T, S('S17'), 0);
  const head = anchor({x: pr.x, y: LANE, pose: pr.pose, scale: PS}, 'head');
  const hand = anchor({x: pr.x, y: LANE, pose: pr.pose, scale: PS}, 'HN');
  const cyc = cyclistX(t, 12.6, pr.x - 1000, pr.x + 1000, 3.4);
  const otherHi = p(t, 7.4, 8.2) * (1 - p(t, 10.8, 11.8));
  return (
    <AbsoluteFill>
      <Plaza cam={cam} wallLayer={<CrowdShadows t={wt} light={LIGHT_ACT1} />} actorLayer={<Crowd t={wt} exclude={noCyclist} />} />
      <WorldLayer cam={cam}>
        <ShadowOf x={OTHER_START.x} lane={OTHER_START.lane} pose={POSES.stand} scale={OS} facing={-1} light={LIGHT_ACT1} />
        <GroundRing x={OTHER_START.x} y={OTHER_START.lane + 2} r={lerp(30, 90, otherHi)} color={C.COLD} opacity={otherHi} />
        <Figure x={OTHER_START.x} y={OTHER_START.lane} pose={POSES.stand} scale={OS} facing={-1} fill={C.GRAPHITE} rim={C.COLD} opacity={0.75 + 0.25 * otherHi} />
        <IntentWedge x={OTHER_START.x - 38 * OS} y={OTHER_START.lane - 162 * OS} angle={180} opacity={otherHi} />
        <ShadowOf x={pr.x} lane={LANE} pose={pr.pose} scale={PS} light={LIGHT_ACT1} />
        <AttentionField id="w" x={head.x + 6} y={head.y + 4} angle={62} spread={14} radius={82} opacity={p(t, 1.2, 2.4)} />
        <Figure x={pr.x} y={LANE} pose={pr.pose} scale={PS} heart={heartAt(T)} />
        <Phone x={hand.x + 2} y={hand.y - 2} o={pr.phone} />
        <Cyclist x={cyc} t={t} />
        <SoundArcs x={cyc + 30} y={WORLD.lane.front - 70} angle={180} t={t - 13.6} reach={260} count={3} color={C.MIST} />
      </WorldLayer>
      <Matte />
      <Instruments T={T} t={t} cond={0} readoutAt={0.6} />
      <Tag text="It was there the whole time." t={t - 7.6} x={W / 2} y={232} color={C.BONE} size={36} out={p(t, 10.8, 11.6)} />
      <Tag text="Outside attention, so outside awareness." t={t - 8.4} x={W / 2} y={286} size={28} out={p(t, 10.8, 11.6)} />
      <ReactionGap t={t} stim={13.6} react={15.0} label="Slower to react" x={660} y={240} scale={260} out={p(t, 19.6, 20.4)} />
      <Caption text="Condition White: relaxed, unaware, attention somewhere else." t={t} a={0.8} b={6.2} lift={LIFT} />
      <Caption text="Here is what you missed the first time." t={t} a={6.6} b={11.6} lift={LIFT} />
      <Caption text="When something happens, it takes longer to notice and to react." t={t} a={12.2} b={17.2} lift={LIFT} />
      <Caption text="The problem isn't fear. It's attention." t={t} a={17.6} b={21.6} lift={LIFT} />
    </AbsoluteFill>
  );
};

/** S18 protagonist: arrives at PROTAGONIST_X, phone away, head up. */
const protS18 = (t: number) => {
  const k = p(t, 0, 4.2, LINEAR);
  const x = lerp(700, PROTAGONIST_X, k);
  const walk = walkPose((x - 160) / 72, 0.8);
  const away = p(t, 0.6, 1.6);
  const arms = {...walk, head: lerp(POSES.phone.head, walk.head, away), shN: lerp(POSES.phone.shN, walk.shN, away), elN: lerp(POSES.phone.elN, walk.elN, away)};
  const stop = p(t, 4.2, 5.2);
  const glance = t > 14.3 && t < 15.6 ? Math.sin(((t - 14.3) / 1.3) * Math.PI) * -10 : 0;
  const pose = mixPose(arms, {...POSES.alert, head: POSES.alert.head + glance}, stop);
  return {x, pose, phone: 1 - away};
};

export const S18Yellow: React.FC<SceneProps> = ({T0}) => {
  const {t, T} = useTimes(T0);
  const pr = protS18(t);
  const cam: Cam = {x: lerp(980, 1000, p(t, 0, 6)), y: 640, zoom: lerp(0.98, 0.88, p(t, 0, 6))};
  const wt = wt3(T, S('S17'), 0);
  const head = anchor({x: pr.x, y: LANE, pose: pr.pose, scale: PS}, 'head');
  const hand = anchor({x: pr.x, y: LANE, pose: pr.pose, scale: PS}, 'HN');
  const spread = lerp(14, 180, p(t, 1.2, 3.0));
  const radius = lerp(82, 1180, p(t, 1.6, 8.5, EASE_OUT));
  const hi = (d: number) => clamp((radius - d + 60) / 120) * (1 - p(t, 12.5, 13.5));
  const dOther = Math.hypot(OTHER_START.x - head.x, OTHER_START.lane - 100 - head.y);
  const dExit = Math.hypot(WORLD.exitX - head.x, 600 - head.y);
  const dBench = Math.hypot(WORLD.benchX - head.x, WORLD.lane.back - 50 - head.y);
  const cyc = cyclistX(t, 13.5, pr.x - 1000, pr.x + 1000, 3.4);
  const ex = WORLD.exitX;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: `saturate(${lerp(1, 1.08, p(t, 2, 6))}) brightness(${lerp(1, 1.06, p(t, 2, 6))})`}}>
        <Plaza cam={cam} wallLayer={<CrowdShadows t={wt} light={LIGHT_ACT1} />} actorLayer={<Crowd t={wt} exclude={noCyclist} />} />
      </AbsoluteFill>
      <WorldLayer cam={cam}>
        <AttentionField id="y" x={head.x} y={head.y} angle={0} spread={spread} radius={radius} color={C.PAPER} opacity={lerp(0.9, 0.55, p(t, 3, 8))} />
        <g opacity={hi(dExit)} fill="none" stroke={C.BONE} strokeWidth={2.5}>
          <path d={`M ${ex - 75} ${WORLD.wallBase} L ${ex - 75} ${WORLD.wallBase - 255} A 75 75 0 0 1 ${ex + 75} ${WORLD.wallBase - 255} L ${ex + 75} ${WORLD.wallBase}`} />
        </g>
        <rect x={WORLD.benchX - 78} y={WORLD.lane.back - 78} width={156} height={80} rx={6} fill="none" stroke={C.BONE} strokeWidth={2} opacity={hi(dBench)} />
        <ShadowOf x={OTHER_START.x} lane={OTHER_START.lane} pose={POSES.stand} scale={OS} facing={-1} light={LIGHT_ACT1} />
        <GroundRing x={OTHER_START.x} y={OTHER_START.lane + 2} r={70} color={C.COLD} opacity={hi(dOther) * 0.8} />
        <Figure x={OTHER_START.x} y={OTHER_START.lane} pose={POSES.stand} scale={OS} facing={-1} fill={C.GRAPHITE} rim={C.COLD} outline={{color: C.COLD, width: 2, opacity: hi(dOther) * 0.8}} />
        <ShadowOf x={pr.x} lane={LANE} pose={pr.pose} scale={PS} light={LIGHT_ACT1} />
        <Figure x={pr.x} y={LANE} pose={pr.pose} scale={PS} heart={heartAt(T)} />
        <Phone x={hand.x + 2} y={hand.y - 2} o={pr.phone} />
        <Cyclist x={cyc} t={t} />
        <SoundArcs x={cyc + 30} y={WORLD.lane.front - 70} angle={180} t={t - 14.4} reach={260} count={3} color={C.MIST} />
      </WorldLayer>
      <Matte />
      <Instruments T={T} t={t} cond={1} readoutAt={8.6} />
      <ConditionReadout name={CONDITIONS[0].label} state={CONDITIONS[0].state} bpm="≈60–80 bpm" color={CONDITIONS[0].color} t={t + 5} out={p(t, 7.6, 8.4)} />
      <Tag text="General situational awareness" t={t - 5.4} x={W / 2} y={232} color={C.BONE} size={34} out={p(t, 9.4, 10)} />
      <Tag text="Appropriate for everyday activity" t={t - 6.2} x={W / 2} y={286} size={28} out={p(t, 9.4, 10)} />
      <Label text="Calm, but ready" t={t - 10.2} x={W / 2} y={250} size={76} out={p(t, 13.2, 14)} />
      <ReactionGap t={t} stim={14.4} react={14.85} label="Ready" x={660} y={240} scale={260} out={p(t, 19.4, 20.2)} />
      <Caption text="Condition Yellow: relaxed alert. Head up, phone away." t={t} a={0.8} b={5.2} lift={LIFT} />
      <Caption text="Nothing is wrong. You simply notice what's around you." t={t} a={5.6} b={9.8} lift={LIFT} />
      <Caption text="When something happens, you see it sooner and respond sooner." t={t} a={14.2} b={20.4} lift={LIFT} />
    </AbsoluteFill>
  );
};

export const S19Orange: React.FC<SceneProps> = ({T0}) => {
  const {t, T} = useTimes(T0);
  const st = principalsS03(t);
  const os = laneScale(st.otherLane);
  const cam: Cam = {x: lerp(1000, BRANCH_CAM.x, p(t, 2, 14)), y: lerp(640, BRANCH_CAM.y, p(t, 2, 14)), zoom: lerp(0.88, BRANCH_CAM.zoom, p(t, 2, 14))};
  const wt = wt3(T, S('S17'), 0);
  const phoneOut = p(t, 14.2, 15.2);
  const pose = mixPose(mixPose(POSES.alert, POSES.orient, p(t, 3, 4.5)), {...POSES.orient, shN: POSES.phone.shN, elN: POSES.phone.elN}, phoneOut);
  const head = anchor({x: PROTAGONIST_X, y: LANE, pose, scale: PS}, 'head');
  const hand = anchor({x: PROTAGONIST_X, y: LANE, pose, scale: PS}, 'HN');
  const oh = {x: st.otherX, y: st.otherLane - 150 * os};
  const ang = (Math.atan2(oh.y - head.y, oh.x - head.x) * 180) / Math.PI;
  const narrow = p(t, 3, 8.5);
  const spread = lerp(180, 24, narrow);
  const radius = lerp(1180, Math.hypot(oh.x - head.x, oh.y - head.y) + 140, p(t, 3, 8.5));
  const grade = p(t, 4, 10);
  const warm = p(t, 8, 14);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: `saturate(${lerp(1.08, 0.38, grade)}) brightness(${lerp(1.06, 0.74, grade)}) blur(${(2.2 * grade).toFixed(2)}px)`}}>
        <Plaza cam={cam} wallLayer={<CrowdShadows t={wt} light={LIGHT_ACT1} />} actorLayer={<Crowd t={wt} exclude={noCyclist} />} />
      </AbsoluteFill>
      <WorldLayer cam={cam}>
        <AttentionField id="o" x={head.x} y={head.y} angle={narrow < 0.02 ? 0 : ang} spread={spread} radius={radius} color={narrow > 0.5 ? mixHex(C.PAPER, '#E7863B', 0.35) : C.PAPER} opacity={0.55 + 0.25 * narrow} />
        <ShadowOf x={st.otherX} lane={st.otherLane} pose={st.otherPose} scale={os} facing={-1} light={LIGHT_ACT1} />
        <Figure x={st.otherX} y={st.otherLane} pose={st.otherPose} scale={os} facing={-1} fill={C.GRAPHITE} rim={C.COLD} />
        <IntentWedge x={st.otherX - 38 * os} y={st.otherLane - 162 * os} angle={180} opacity={p(t, 2, 3)} />
        <Figure x={PROTAGONIST_X} y={LANE} pose={pose} scale={PS} heart={heartAt(T, {size: 3.4 + warm})} rim={mixHex(C.SUN, '#E7863B', warm)} />
        <Phone x={hand.x + 2} y={hand.y - 2} o={phoneOut} />
      </WorldLayer>
      <Matte />
      <Instruments T={T} t={t} cond={2} readoutAt={8.6} />
      <ConditionReadout name={CONDITIONS[1].label} state={CONDITIONS[1].state} bpm="≈80–115 bpm" color={CONDITIONS[1].color} t={t + 5} out={p(t, 7.6, 8.4)} />
      <Tag text="A specific possible threat" t={t - 4.6} x={W / 2} y={232} color={C.BONE} size={34} out={p(t, 10.4, 11)} />
      <Tag text="Attention narrows onto it" t={t - 6.4} x={W / 2} y={286} size={28} out={p(t, 10.4, 11)} />
      <Tag text="Adrenaline rises" t={t - 11.4} x={W / 2} y={232} color={C.BONE} size={34} out={p(t, 22, 22.8)} />
      <Tag text="Fine motor skills may begin to decline" t={t - 16.2} x={W / 2} y={286} size={28} out={p(t, 22, 22.8)} />
      <MotorPanel t={t - 15.4} tremor={0.22} opacity={p(t, 15, 15.8) * (1 - p(t, 22.2, 22.9))} seed={3} />
      <Caption text="Condition Orange begins when a specific possible threat appears." t={t} a={0.8} b={6.2} lift={LIFT} />
      <Caption text="Attention narrows onto it. Everything else becomes less important." t={t} a={6.6} b={11.6} lift={LIFT} />
      <Caption text="The heart speeds up, and precise tasks start to get harder." t={t} a={12} b={22.6} lift={LIFT} />
    </AbsoluteFill>
  );
};
