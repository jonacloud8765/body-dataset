import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, CONDITIONS, FONT_DISPLAY, H, W, conditionColor} from '../theme';
import {EASE, EASE_OUT, LINEAR, clamp, lerp, p} from '../lib/anim';
import {Figure, anchor, walkPose} from '../components/Figure';
import {Cam, Plaza, WORLD, laneScale} from '../components/World';
import {Crowd, CrowdShadows} from '../components/Crowd';
import {LIGHT_ACT1, ShadowOf} from '../components/Shadows';
import {AttentionField, IntentWedge, Matte, PulseLine} from '../components/Signals';
import {ResponseCompass} from '../components/Compass';
import {Label, Tag} from '../components/Type';
import {beatsAt, pulseAt} from '../score';
import {Caption, SceneProps, WorldLayer, heartAt, useTimes} from './common';

const NODES = ['Threat', 'Awareness', 'Arousal', 'Condition', 'Response', 'Decision'] as const;
const NX = (i: number) => 260 + i * 280;
const NY = 500;

const NodeGlyph: React.FC<{i: number; x: number; y: number; T: number; lit: number}> = ({i, x, y, T, lit}) => {
  if (i === 0) return <IntentWedge x={x} y={y} angle={0} size={22} />;
  if (i === 1) return <AttentionField id={`n${i}`} x={x - 26} y={y} angle={0} spread={26} radius={62} opacity={0.9} />;
  if (i === 2) {
    const pu = pulseAt(T);
    return (
      <g>
        <circle cx={x} cy={y} r={10 + 5 * pu} fill={conditionColor(1)} opacity={0.3} />
        <circle cx={x} cy={y} r={6 + 2 * pu} fill={conditionColor(1)} />
      </g>
    );
  }
  if (i === 3) {
    return (
      <g>
        <line x1={x - 30} x2={x + 30} y1={y} y2={y} stroke={C.IRON} strokeWidth={3} />
        {CONDITIONS.map((c, k) => (
          <circle key={c.id} cx={x - 30 + k * 15} cy={y} r={5} fill={c.id === 'black' ? '#000' : c.color} stroke={c.id === 'black' ? C.PAPER : c.color} strokeWidth={1.2} />
        ))}
      </g>
    );
  }
  if (i === 4) return <ResponseCompass x={x} y={y} draw={{fight: 1, flight: 1, freeze: 1, posture: 1, submit: 1}} lit={{fight: 0.7, flight: 0.7, freeze: 0.7, posture: 0.7, submit: 0.7}} rx={24} ry={22} labels={false} litColor={C.BONE} />;
  return (
    <g opacity={0.4 + 0.6 * lit}>
      <circle cx={x - 8} cy={y} r={6} fill={C.PAPER} />
      <path d={`M ${x} ${y} L ${x + 26} ${y}`} stroke={C.PAPER} strokeWidth={3} strokeLinecap="round" />
      <path d={`M ${x + 18} ${y - 8} L ${x + 27} ${y} L ${x + 18} ${y + 8}`} stroke={C.PAPER} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

export const S23Chain: React.FC<SceneProps> = ({T0}) => {
  const {t, T} = useTimes(T0);
  const nodeIn = (i: number) => p(t, 0.8 + i * 0.7, 1.5 + i * 0.7, EASE_OUT);
  const linkIn = (i: number) => p(t, 1.3 + i * 0.7, 1.9 + i * 0.7);
  // Run 1: recognized late (6.6–13). Run 2: recognized early (13.4–20).
  const run1 = t >= 6.6 && t < 13.2;
  const run2 = t >= 13.4;
  const pulse = run1 ? p(t, 7.8, 11, LINEAR) : run2 ? p(t, 14, 17.4, LINEAR) : 0;
  const pulseX = lerp(NX(0), NX(5), pulse);
  const late = run1 ? p(t, 7.8, 9.8) : 0;
  const barLen = run1 ? 0.24 * p(t, 9.4, 11) : run2 ? p(t, 14, 17.4) : 0;
  const decisionLit = run1 ? 0.15 * p(t, 10.6, 11.4) : run2 ? p(t, 17, 17.8) : 0;
  const barO = p(t, 7, 7.6) * (1 - p(t, 13, 13.4)) + p(t, 13.6, 14) * (1 - p(t, 26.8, 27.6));
  const out = p(t, 26.8, 27.8);
  return (
    <AbsoluteFill style={{background: C.NIGHT}}>
      <svg width={W} height={H} style={{position: 'absolute', opacity: 1 - out}}>
        {Array.from({length: 20}).map((_, k) => (
          <line key={k} x1={k * 100} x2={k * 100} y1={0} y2={H} stroke={C.IRON} strokeWidth={1} opacity={0.1} />
        ))}
        {NODES.map((n, i) => {
          const o = nodeIn(i);
          const x = NX(i);
          const isAware = i === 1;
          const flash = isAware && run1 ? late : isAware && run2 ? p(t, 14.2, 14.6) : 0;
          const ring = i === 5 ? decisionLit : flash;
          return (
            <g key={n} opacity={o} transform={`translate(${x} ${NY}) scale(${lerp(0.6, 1, o)}) translate(${-x} ${-NY})`}>
              {i < 5 ? (
                <g opacity={linkIn(i)}>
                  <line x1={x + 58} x2={x + 280 - 70} y1={NY} y2={NY} stroke={C.IRON} strokeWidth={2.5} />
                  <path d={`M ${x + 280 - 80} ${NY - 8} L ${x + 280 - 68} ${NY} L ${x + 280 - 80} ${NY + 8}`} stroke={C.IRON} strokeWidth={2.5} fill="none" />
                </g>
              ) : null}
              <circle cx={x} cy={NY} r={50} fill={C.INK} stroke={ring > 0.05 ? C.PAPER : C.IRON} strokeWidth={ring > 0.05 ? 2 + 2 * ring : 2} />
              {i === 5 && decisionLit > 0.3 ? <circle cx={x} cy={NY} r={64} fill="none" stroke={C.PAPER} strokeWidth={1.5} opacity={decisionLit * 0.6} /> : null}
              <NodeGlyph i={i} x={x} y={NY} T={T} lit={i === 5 ? (run1 || run2 ? decisionLit : 0.6) : 1} />
              <text x={x} y={NY + 96} textAnchor="middle" fill={C.BONE} style={{fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: '0.2em', fontVariationSettings: "'wght' 600"}}>{n.toUpperCase()}</text>
            </g>
          );
        })}
        {pulse > 0 && pulse < 1 ? <circle cx={pulseX} cy={NY} r={9} fill={C.PAPER} style={{filter: `drop-shadow(0 0 10px ${C.PAPER})`}} /> : null}
        <g opacity={barO}>
          <text x={NX(0) - 50} y={NY + 190} fill={C.MIST} style={{fontFamily: FONT_DISPLAY, fontSize: 20, letterSpacing: '0.22em'}}>TIME TO RESPOND</text>
          <rect x={NX(0) - 50} y={NY + 210} width={NX(5) - NX(0) + 100} height={10} rx={5} fill={C.IRON} opacity={0.5} />
          <rect x={NX(0) - 50} y={NY + 210} width={(NX(5) - NX(0) + 100) * clamp(barLen)} height={10} rx={5} fill={run1 ? C.MIST : C.PAPER} />
        </g>
      </svg>
      <Label text="The chain" t={t - 0.3} x={W / 2} y={200} size={52} out={p(t, 6.2, 6.8)} />
      <Tag text="Unaware: the threat is recognized late" t={t - 7.0} x={W / 2} y={220} color={C.BONE} size={36} out={p(t, 12.6, 13.2)} />
      <Tag text="Less time. Fewer options." t={t - 10.8} x={W / 2} y={272} size={30} out={p(t, 12.6, 13.2)} />
      <Tag text="Aware: the threat is recognized early" t={t - 13.6} x={W / 2} y={220} color={C.BONE} size={36} out={p(t, 20, 20.6)} />
      <Tag text="Time to stay in control, and to choose." t={t - 17.4} x={W / 2} y={272} size={30} out={p(t, 20, 20.6)} />
      <Label text="Preparedness is not aggression" t={t - 20.8} x={W / 2} y={230} size={60} out={out} />
      <Tag text="It keeps the decision in your hands." t={t - 22.2} x={W / 2} y={300} size={32} color={C.BONE} out={out} />
      <Caption text="Put it together: threat, awareness, arousal, condition, response, decision." t={t} a={0.8} b={6.4} />
      <Caption text="Notice late, and there is less time to respond, and fewer options." t={t} a={6.8} b={13} />
      <Caption text="Notice early, and there is time: time to stay in control, and to choose." t={t} a={13.4} b={20.4} />
      <Caption text="The goal isn't constant aggression. It's controlled preparedness." t={t} a={20.8} b={27.6} />
    </AbsoluteFill>
  );
};

export const S24Coda: React.FC<SceneProps> = ({T0}) => {
  const {t, T} = useTimes(T0);
  const lane = WORLD.lane.main;
  const ps = laneScale(lane);
  const x = 420 + 34 * t;
  const pose = walkPose((x - 420) / 80, 0.9);
  const cam: Cam = {x: x + 240, y: 630, zoom: lerp(1.02, 0.96, p(t, 0, 16))};
  const wt = 120 + t;
  const head = anchor({x, y: lane, pose, scale: ps}, 'head');
  const inWorld = p(t, 0, 1.2);
  const close = p(t, 14.2, 15.6, EASE);
  return (
    <AbsoluteFill style={{background: C.INK}}>
      <AbsoluteFill style={{opacity: inWorld}}>
        <Plaza cam={cam} sun={0.35} wallLayer={<CrowdShadows t={wt} light={LIGHT_ACT1} />} actorLayer={<Crowd t={wt} />} />
        <WorldLayer cam={cam}>
          <AttentionField id="coda" x={head.x} y={head.y} angle={0} spread={180} radius={620} color={C.PAPER} opacity={0.45} />
          <ShadowOf x={x} lane={lane} pose={pose} scale={ps} light={LIGHT_ACT1} />
          <Figure x={x} y={lane} pose={pose} scale={ps} heart={heartAt(T)} />
        </WorldLayer>
      </AbsoluteFill>
      <Matte extra={close * (H / 2 - 138)} />
      <AbsoluteFill style={{opacity: 1 - p(t, 15.2, 15.9)}}>
        <svg width={W} height={H} style={{position: 'absolute'}}>
          <PulseLine x0={64} x1={W - 64} y={H - 69 - close * 400} phase={beatsAt(T)} beatsVisible={7} amp={40} color={conditionColor(1)} opacity={0.9} />
        </svg>
      </AbsoluteFill>
      <Tag text="Recognize early." t={t - 1.0} x={W / 2} y={236} color={C.BONE} size={46} out={p(t, 10.4, 11)} />
      <Tag text="Know your options." t={t - 3.8} x={W / 2} y={300} color={C.BONE} size={46} out={p(t, 10.4, 11)} />
      <Tag text="Keep control." t={t - 6.6} x={W / 2} y={364} color={C.BONE} size={46} out={p(t, 10.4, 11)} />
      <Label text="Calm, but ready" t={t - 11.2} x={W / 2} y={lerp(280, H / 2 - 80, close)} size={88} out={p(t, 15.2, 15.9)} />
    </AbsoluteFill>
  );
};
