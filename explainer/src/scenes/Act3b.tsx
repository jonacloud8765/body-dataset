import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, CONDITIONS, FONT_DISPLAY, FONT_MONO, H, W, mixHex} from '../theme';
import {EASE, EASE_OUT, lerp, p, rand} from '../lib/anim';
import {Figure, POSES, anchor, mixPose, runPose, walkPose} from '../components/Figure';
import {Cam, Plaza, WORLD, laneScale, toScreen} from '../components/World';
import {Crowd, CrowdShadows} from '../components/Crowd';
import {LIGHT_ACT1, ShadowOf} from '../components/Shadows';
import {AttentionField, IntentWedge, Matte, SoundArcs, Tunnel} from '../components/Signals';
import {ResponseCompass} from '../components/Compass';
import {ConditionReadout, Label, Tag} from '../components/Type';
import {S} from '../score';
import {Caption, OTHER_X, PROTAGONIST_X, SceneProps, WorldLayer, heartAt, useTimes} from './common';
import {Instruments, MotorPanel, wt3} from './Act3Shared';

const LANE = WORLD.lane.main;
/** Act III: the lower bar holds the instruments, so captions sit just above it. */
const LIFT = 196;
const PS = laneScale(LANE);
const noCyclist = [50];
const RED_STOP_X = 470;

/** Principals during S20 (Red). */
const principalsS20 = (t: number) => {
  const rush = p(t, 0.8, 2.4, EASE_OUT);
  const follow = p(t, 4, 9, EASE);
  const otherX = lerp(OTHER_X, 1010, rush) - 240 * follow;
  const otherPose = rush > 0 && rush < 1 ? runPose(t * 2.2, 0.9) : follow > 0 && follow < 1 ? walkPose(t * 1.1, 0.8) : POSES.guard;
  const turn = p(t, 2.2, 2.7);
  const go = p(t, 2.7, 6.6, EASE);
  const x = lerp(PROTAGONIST_X, RED_STOP_X, go);
  const face = p(t, 6.6, 7.2);
  let pose = mixPose({...POSES.orient, shN: POSES.phone.shN, elN: POSES.phone.elN}, POSES.orient, p(t, 0.8, 1.6));
  if (go > 0 && go < 1) pose = runPose((PROTAGONIST_X - x) / 140, 1);
  if (go >= 1) pose = mixPose(runPose((PROTAGONIST_X - x) / 140, 1), POSES.shield, face);
  const facing: 1 | -1 = turn > 0.5 && face < 0.5 ? -1 : 1;
  return {otherX, otherPose, x, pose, facing};
};

export const S20Red: React.FC<SceneProps> = ({T0}) => {
  const {t, T, frame} = useTimes(T0);
  const st = principalsS20(t);
  const tun = p(t, 1, 4);
  const mid = (st.x + st.otherX) / 2;
  const shake = tun * 3;
  const cam: Cam = {x: lerp(1025, mid, p(t, 0, 4)) + Math.sin(frame * 0.9) * shake, y: lerp(650, 690, tun) + Math.cos(frame * 1.3) * shake * 0.6, zoom: lerp(1.12, 1.3, p(t, 0, 4))};
  const wt = wt3(T, S('S17'), 0);
  const head = anchor({x: st.x, y: LANE, pose: st.pose, scale: PS, facing: st.facing}, 'head');
  const oh = {x: st.otherX, y: LANE - 150 * PS};
  const ang = (Math.atan2(oh.y - head.y, oh.x - head.x) * 180) / Math.PI;
  const center = toScreen(cam, mid, LANE - 90);
  const bystander = {x: WORLD.exitX + 110, lane: WORLD.lane.back};
  const bs = laneScale(bystander.lane);
  const byPose = mixPose(POSES.stand, {...POSES.stand, shN: 120, elN: 8}, p(t, 15.2, 15.8));
  const tunnelR = 260;
  const bystDist = Math.hypot(head.x - bystander.x, head.y - (bystander.lane - 160 * bs));
  const cutoff = Math.max(40, bystDist - tunnelR);
  const compass = p(t, 21.4, 22.2) * (1 - p(t, 26.2, 26.9));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: `saturate(${lerp(0.38, 0.16, tun)}) brightness(${lerp(0.74, 0.5, tun)}) blur(${lerp(2.2, 3.6, tun).toFixed(2)}px)`}}>
        <Plaza cam={cam} wallLayer={<CrowdShadows t={wt} light={LIGHT_ACT1} />} actorLayer={<Crowd t={wt} exclude={noCyclist} />} />
      </AbsoluteFill>
      <WorldLayer cam={cam} style={{filter: `brightness(${lerp(1, 0.55, p(t, 14.5, 15.5) * (1 - p(t, 21, 22)))})`}}>
        <Figure x={bystander.x} y={bystander.lane} pose={byPose} scale={bs} fill="#4A535D" rim={null} opacity={p(t, 14.6, 15.2)} />
        <SoundArcs x={bystander.x + 30} y={bystander.lane - 160 * bs} angle={-8} t={t - 15.8} reach={300} count={5} color={C.BONE} cutoff={cutoff} />
      </WorldLayer>
      <WorldLayer cam={cam}>
        <AttentionField id="r" x={head.x} y={head.y} angle={ang} spread={lerp(24, 9, tun)} radius={Math.hypot(oh.x - head.x, oh.y - head.y) + 90} color={mixHex(C.PAPER, '#D8432F', 0.4)} opacity={0.75} />
        <ShadowOf x={st.otherX} lane={LANE} pose={st.otherPose} scale={PS} facing={-1} light={LIGHT_ACT1} />
        <Figure x={st.otherX} y={LANE} pose={st.otherPose} scale={PS} facing={-1} fill={C.GRAPHITE} rim={C.COLD} />
        <IntentWedge x={st.otherX - 38 * PS} y={LANE - 162 * PS} angle={180} />
        <Figure x={st.x} y={LANE} pose={st.pose} scale={PS} facing={st.facing} heart={heartAt(T, {size: 4.4})} rim={mixHex(C.SUN, '#D8432F', 0.8)} />
        <ResponseCompass x={st.x} y={LANE - 112 * PS} draw={{fight: 1, flight: 1, freeze: 1, posture: 1, submit: 1}} lit={{fight: 1, flight: 1, freeze: 0.08, posture: 0.08, submit: 0.08}} rx={200} ry={120} opacity={compass} litColor={C.PAPER} />
      </WorldLayer>
      <Tunnel amount={0.72 * tun} cx={center.x} cy={center.y} />
      <Matte extra={62 * tun} />
      <Instruments T={T} t={t} cond={3} readoutAt={5.6} />
      <ConditionReadout name={CONDITIONS[2].label} state={CONDITIONS[2].state} bpm="≈115–145 bpm" color={CONDITIONS[2].color} t={t + 5} out={p(t, 4.6, 5.4)} />
      <MotorPanel t={t - 8.4} tremor={0.85} gross={p(t, 9.2, 9.8)} opacity={p(t, 8, 8.6) * (1 - p(t, 14.4, 15))} seed={7} />
      <Tag text="Gross motor: strong" t={t - 9.4} x={W / 2} y={250} color={C.BONE} size={34} out={p(t, 14.4, 15)} />
      <Tag text="Fine motor and complex thinking may decline" t={t - 10.2} x={W / 2} y={302} size={28} out={p(t, 14.4, 15)} />
      <Tag text="Tunnel vision may occur" t={t - 16.4} x={W / 2} y={250} color={C.BONE} size={34} out={p(t, 20.8, 21.4)} />
      <Tag text="Auditory exclusion may occur" t={t - 17.4} x={W / 2} y={302} size={28} out={p(t, 20.8, 21.4)} />
      <Tag text="Fight or flight" t={t - 22.4} x={W / 2} y={250} color={C.BONE} size={34} out={p(t, 26.2, 26.9)} />
      <Caption text="Condition Red: the threat is immediate. This is the action phase." t={t} a={0.6} b={5.2} lift={LIFT} />
      <Caption text="Big movements stay strong. Precise ones fall apart." t={t} a={5.6} b={10.2} lift={LIFT} />
      <Caption text="Complex thinking can decline too." t={t} a={10.6} b={14.8} lift={LIFT} />
      <Caption text="Someone shouts “This way!” The voice, and the exit, may never register." t={t} a={15.4} b={21} lift={LIFT} />
      <Caption text="Options narrow toward fight or flight. Effects differ from person to person." t={t} a={21.4} b={26.8} lift={LIFT} />
    </AbsoluteFill>
  );
};

export const S21Black: React.FC<SceneProps> = ({T0}) => {
  const {t, T, frame} = useTimes(T0);
  const chaos = p(t, 0.4, 3) * (1 - p(t, 12, 13.2));
  const locked = t >= 12.2;
  const step = Math.floor(frame / 4);
  const erratic = t > 8.6 && t < 12.2;
  const ex = erratic ? Math.sin((t - 8.6) * 4.1) * 40 + Math.sin((t - 8.6) * 9.3) * 12 : 0;
  const erraticPose = erratic ? mixPose(POSES.shield, walkPose(t * 1.7, 1.1), 0.5 + 0.5 * Math.sin(t * 5)) : POSES.shield;
  const x = RED_STOP_X + ex;
  const pose = locked ? POSES.frozen : erraticPose;
  const facing: 1 | -1 = erratic && Math.sin(t * 3.3) < -0.6 ? -1 : 1;
  const otherX = 770;
  const wt = wt3(T, S('S17'), 0) - 2 * p(t, 0, 1);
  const cam: Cam = {x: 620 + Math.sin(t * 0.7) * 30 * chaos + (rand(step) - 0.5) * 6 * chaos, y: 690 + Math.cos(t * 0.5) * 12 * chaos, zoom: 1.3 + Math.sin(t * 1.3) * 0.05 * chaos - 0.18 * p(t, 12.4, 16)};
  const head = anchor({x, y: LANE, pose, scale: PS, facing}, 'head');
  const hand = anchor({x, y: LANE, pose, scale: PS, facing}, 'HN');
  const cones = Array.from({length: 6}).map((_, i) => ({angle: rand(i * 9.1 + step * 0.37) * 360, spread: 8 + rand(i + step) * 14, radius: 200 + rand(i * 2.2 + step) * 360}));
  const quiet = p(t, 12.2, 13.6);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: `saturate(${lerp(lerp(0.16, 0.1, p(t, 0, 1.5)), 0.35, quiet)}) brightness(${lerp(lerp(0.5, 0.42, p(t, 0, 1.5)), 0.62, quiet)}) blur(${lerp(lerp(3.6, 2.5, p(t, 0, 1.5)), 1.2, quiet).toFixed(2)}px)`}}>
        <Plaza cam={cam} wallLayer={<CrowdShadows t={wt} light={LIGHT_ACT1} />} actorLayer={<Crowd t={wt} exclude={noCyclist} />} />
      </AbsoluteFill>
      <WorldLayer cam={cam}>
        {cones.map((c, i) => (
          <AttentionField key={i} id={`b${i}`} x={head.x} y={head.y} angle={c.angle} spread={c.spread} radius={c.radius} color={C.PAPER} opacity={0.35 * chaos} />
        ))}
        {[0, 1, 2].map((i) => (
          <g key={i} opacity={chaos * 0.55}>
            <IntentWedge x={otherX - 38 * PS + (rand(i * 4 + step) - 0.5) * 60} y={LANE - 162 * PS + (rand(i * 7 + step) - 0.5) * 50} angle={180 + (rand(i + step * 0.3) - 0.5) * 60} />
          </g>
        ))}
        <SoundArcs x={hand.x} y={hand.y} angle={-90} t={((t * 1.3) % 1.4)} reach={180} count={3} color={C.MIST} />
        <SoundArcs x={WORLD.exitX + 140} y={WORLD.lane.back - 150} angle={0} t={((t * 0.9 + 0.5) % 1.6)} reach={260} count={4} color={C.MIST} />
        <SoundArcs x={1000} y={WORLD.lane.back - 150} angle={180} t={((t * 1.1 + 0.2) % 1.5)} reach={260} count={4} color={C.MIST} />
        <ShadowOf x={otherX} lane={LANE} pose={POSES.guard} scale={PS} facing={-1} light={LIGHT_ACT1} />
        <Figure x={otherX} y={LANE} pose={POSES.guard} scale={PS} facing={-1} fill={C.GRAPHITE} rim={C.COLD} />
        <IntentWedge x={otherX - 38 * PS} y={LANE - 162 * PS} angle={180} opacity={1 - chaos * 0.5} />
        {chaos > 0.05
          ? [-1, 1].map((d) => (
              <Figure key={d} x={x + d * 9 * chaos} y={LANE + d * 3 * chaos} pose={pose} scale={PS} facing={facing} fill={d > 0 ? '#8A4A3E' : '#4E6272'} rim={null} flat opacity={0.45 * chaos} />
            ))
          : null}
        <Figure x={x} y={LANE} pose={pose} scale={PS} facing={facing} heart={heartAt(T, {size: 4.6})} outline={locked ? {color: C.PAPER, width: 2, opacity: 0.8 * quiet} : null} />
        <ResponseCompass x={x} y={LANE - 112 * PS} draw={{fight: 1, flight: 1, freeze: 1, posture: 1, submit: 1}} lit={{fight: 0.5, flight: 0.5, freeze: locked ? 1 : 0.5, posture: 0.5, submit: 0.5}} rx={200} ry={120} scramble={chaos} seedT={t} opacity={0.8 * (1 - p(t, 14.5, 15.5))} litColor={C.PAPER} />
      </WorldLayer>
      <Tunnel amount={lerp(0.72, 0.35 * chaos + 0.25 * quiet, p(t, 0, 1.5))} cx={W / 2} cy={H / 2 + 60} />
      <Matte extra={62 * (1 - quiet) + 20 * quiet} jitter={10 * chaos} frame={step} />
      <Instruments T={T} t={t} cond={4} readoutAt={4.6} overload={chaos} frame={frame} />
      <ConditionReadout name={CONDITIONS[3].label} state={CONDITIONS[3].state} bpm="≈145–175 bpm" color={CONDITIONS[3].color} t={t + 5} out={p(t, 3.6, 4.4)} />
      <Tag text="Cognitive overload" t={t - 5.2} x={W / 2} y={250} color={C.BONE} size={34} out={p(t, 11.6, 12.2)} />
      <Tag text="Freezing, hesitation, or irrational action" t={t - 6.2} x={W / 2} y={302} size={28} out={p(t, 11.6, 12.2)} />
      <Label text="Freeze" t={t - 13.4} x={W / 2} y={250} behavior="freeze" size={72} out={p(t, 17, 17.6)} />
      <Label text="More arousal is not more readiness" t={t - 18} x={W / 2} y={250} size={50} out={p(t, 24, 24.8)} />
      <Tag text="Higher risk of catastrophic mistakes" t={t - 19.2} x={W / 2} y={318} size={28} out={p(t, 24, 24.8)} />
      <Caption text="Condition Black: the system overloads." t={t} a={0.6} b={4.8} lift={LIFT} />
      <Caption text="Signals overlap. Nothing resolves into a clear picture." t={t} a={5.2} b={8.6} lift={LIFT} />
      <Caption text="Action becomes erratic, or stops altogether." t={t} a={9} b={13} lift={LIFT} />
      <Caption text="Freeze: the same response we saw at the start. The world keeps moving." t={t} a={13.4} b={17.8} lift={LIFT} />
      <Caption text="Extreme arousal doesn't make you more ready. It can take decisions away." t={t} a={18.2} b={24.6} lift={LIFT} />
    </AbsoluteFill>
  );
};

const COLS = [380, 670, 960, 1250, 1540];
const ROWS = {perception: 410, body: 580, decisions: 750};

const MiniPerception: React.FC<{i: number; x: number; y: number; t: number}> = ({i, x, y, t}) => {
  if (i === 0) return <AttentionField id="m0" x={x} y={y} angle={65} spread={12} radius={50} opacity={0.9} />;
  if (i === 1) return <AttentionField id="m1" x={x} y={y} angle={0} spread={180} radius={80} opacity={0.8} />;
  if (i === 2) return <AttentionField id="m2" x={x - 40} y={y} angle={0} spread={22} radius={120} opacity={0.9} />;
  if (i === 3) return (
    <g>
      <AttentionField id="m3" x={x - 40} y={y} angle={0} spread={7} radius={120} opacity={1} />
      <circle cx={x} cy={y} r={78} fill="none" stroke={C.INK} strokeWidth={30} opacity={0.8} />
    </g>
  );
  return (
    <g>
      {[0, 1, 2, 3, 4].map((k) => (
        <AttentionField key={k} id={`m4${k}`} x={x} y={y} angle={rand(k * 3.3 + Math.floor(t * 4)) * 360} spread={10} radius={70} opacity={0.6} />
      ))}
    </g>
  );
};

const MiniMotor: React.FC<{i: number; x: number; y: number}> = ({i, x, y}) => {
  const tremor = [0, 0, 0.25, 0.8, 1.2][i];
  const pts: string[] = [];
  for (let s = 0; s <= 30; s++) {
    const v = s / 30;
    pts.push(`${(x - 70 + 140 * v + tremor * 12 * Math.sin(v * 31 + i)).toFixed(1)},${(y + tremor * 16 * Math.cos(v * 27 + i * 2) * rand(s + i)).toFixed(1)}`);
  }
  return (
    <g>
      <circle cx={x + 70} cy={y} r={10} fill="none" stroke={C.MIST} strokeWidth={2} />
      <polyline points={pts.join(' ')} fill="none" stroke={C.BONE} strokeWidth={2} />
      {i === 3 ? <text x={x} y={y + 50} textAnchor="middle" fill={C.BONE} style={{fontFamily: FONT_DISPLAY, fontSize: 18, letterSpacing: '0.12em'}}>GROSS MOTOR ✓</text> : null}
    </g>
  );
};

export const S22Readout: React.FC<SceneProps> = ({T0}) => {
  const {t} = useTimes(T0);
  const col = (i: number) => p(t, 0.8 + i * 0.5, 1.5 + i * 0.5, EASE_OUT);
  const row = (r: number) => p(t, 3.6 + r * 1.3, 4.6 + r * 1.3);
  const variation = p(t, 10.8, 11.6) * (1 - p(t, 14.6, 15.4));
  const railY = 900;
  const out = p(t, 16.2, 16.95);
  return (
    <AbsoluteFill style={{background: C.NIGHT}}>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        {Array.from({length: 20}).map((_, k) => (
          <line key={k} x1={k * 100} x2={k * 100} y1={0} y2={H} stroke={C.IRON} strokeWidth={1} opacity={0.12} />
        ))}
        {(['perception', 'body', 'decisions'] as const).map((r, ri) => (
          <g key={r} opacity={row(ri)}>
            <text x={120} y={ROWS[r] + 8} fill={C.MIST} style={{fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: '0.22em', fontVariationSettings: "'wght' 600"}}>{r.toUpperCase()}</text>
            <line x1={120} x2={1720} y1={ROWS[r] + 80} y2={ROWS[r] + 80} stroke={C.IRON} strokeWidth={1} opacity={0.5} />
          </g>
        ))}
        {CONDITIONS.map((c, i) => (
          <g key={c.id} opacity={col(i)}>
            <circle cx={COLS[i]} cy={220} r={14} fill={c.id === 'black' ? '#000' : c.color} stroke={c.id === 'black' ? C.PAPER : c.color} strokeWidth={2} />
            <text x={COLS[i]} y={272} textAnchor="middle" fill={C.BONE} style={{fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: '0.16em', fontVariationSettings: "'wght' 620"}}>{c.id.toUpperCase()}</text>
            <text x={COLS[i]} y={302} textAnchor="middle" fill={C.MIST} style={{fontFamily: FONT_DISPLAY, fontSize: 18}}>{c.state}</text>
            <g opacity={row(0)}><MiniPerception i={i} x={COLS[i]} y={ROWS.perception} t={t} /></g>
            <g opacity={row(1)}><MiniMotor i={i} x={COLS[i]} y={ROWS.body} /></g>
            <g opacity={row(2)}>
              <ResponseCompass x={COLS[i]} y={ROWS.decisions} draw={{fight: 1, flight: 1, freeze: 1, posture: 1, submit: 1}} lit={i === 0 ? {} : i === 3 ? {fight: 1, flight: 1, freeze: 0.05, posture: 0.05, submit: 0.05} : i === 4 ? {freeze: 1, fight: 0.2, flight: 0.2, posture: 0.2, submit: 0.2} : {fight: 0.7, flight: 0.7, freeze: 0.7, posture: 0.7, submit: 0.7}} rx={52} ry={44} labels={false} scramble={i === 4 ? 1 : 0} seedT={t} opacity={i === 0 ? 0.35 : 1} litColor={C.BONE} />
            </g>
          </g>
        ))}
        <g opacity={p(t, 8.4, 9.4)}>
          <defs>
            <linearGradient id="rr" x1={COLS[0]} x2={COLS[4]} y1="0" y2="0" gradientUnits="userSpaceOnUse">
              {CONDITIONS.map((c, i) => <stop key={c.id} offset={i / 4} stopColor={c.id === 'black' ? '#50140C' : c.color} />)}
            </linearGradient>
          </defs>
          <line x1={COLS[0]} x2={COLS[4]} y1={railY} y2={railY} stroke="url(#rr)" strokeWidth={6} strokeLinecap="round" />
          {CONDITIONS.map((c, i) => (
            <text key={c.id} x={COLS[i]} y={railY + 40} textAnchor="middle" fill={C.MIST} style={{fontFamily: FONT_MONO, fontSize: 20}}>≈{c.bpm[0]}–{c.bpm[1]}{c.id === 'black' ? '+' : ''} bpm</text>
          ))}
          {[-1, 1, 0.5].map((d, k) => (
            <line key={k} x1={COLS[0] + d * 34} x2={COLS[4] + d * 34} y1={railY - 18 - k * 10} y2={railY - 18 - k * 10} stroke={C.MIST} strokeWidth={2} strokeDasharray="4 6" opacity={variation * 0.6} />
          ))}
        </g>
      </svg>
      <Label text="What arousal does" t={t - 0.2} x={W / 2} y={110} size={52} />
      <Tag text="Illustrative: where these shifts happen differs from person to person." t={t - 11.2} x={W / 2} y={1010} size={24} out={p(t, 14.6, 15.4)} />
      <div style={{position: 'absolute', left: W / 2, top: 1010, transform: 'translate(-50%, -50%)', fontFamily: FONT_MONO, fontSize: 20, color: C.MIST, opacity: p(t, 15.4, 16) * 0.85, whiteSpace: 'nowrap'}}>
        Approximate ranges from a simplified training model, not universal thresholds.
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: lerp(0, 138, out), background: C.INK}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: lerp(0, 138, out), background: C.INK}} />
    </AbsoluteFill>
  );
};
