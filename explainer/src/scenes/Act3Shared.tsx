import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, CONDITIONS, FONT_DISPLAY, H, W, conditionColor} from '../theme';
import {clamp, lerp, p, rand} from '../lib/anim';
import {ConditionRail, PulseLine} from '../components/Signals';
import {ConditionReadout} from '../components/Type';
import {beatsAt, levelAt} from '../score';

/** Crowd world time during Act III: a replay of S02 (world time 12 = S02 start). */
export const wt3 = (T: number, sceneStartT: number, offset: number) => 12 + offset + (T - sceneStartT);

/** Lower instrument bar: pulse line + condition rail. Upper bar: condition readout. */
export const Instruments: React.FC<{T: number; t: number; cond: number; opacity?: number; readoutAt?: number; railDraw?: number; overload?: number; frame?: number}> = ({T, t, cond, opacity = 1, readoutAt = 0.6, railDraw = 1, overload = 0, frame = 0}) => {
  const lvl = levelAt(T);
  const c = CONDITIONS[cond];
  const beats = beatsAt(T);
  const col = conditionColor(lvl);
  const lines = overload > 0 ? 4 : 1;
  return (
    <AbsoluteFill style={{opacity}}>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        {Array.from({length: lines}).map((_, i) => (
          <PulseLine
            key={i}
            x0={64}
            x1={1100}
            y={H - 69 + (i === 0 ? 0 : (rand(i * 3.3 + Math.floor(frame / 3)) - 0.5) * 30 * overload)}
            phase={beats * (i === 0 ? 1 : 1 + i * 0.13) + i * 0.37}
            beatsVisible={lerp(5, 9, clamp(lvl / 4))}
            amp={40}
            color={lvl > 3.5 ? C.PAPER : col}
            opacity={i === 0 ? 0.95 : 0.45 * overload}
            width={i === 0 ? 2.5 : 1.5}
            jitter={overload * 10}
            seed={i}
          />
        ))}
      </svg>
      <ConditionRail level={lvl} draw={railDraw} />
      <ConditionReadout name={c.label} state={c.state} bpm={`≈${c.bpm[0]}–${c.bpm[1]}${c.id === 'black' ? '+' : ''} bpm`} color={c.color} t={t - readoutAt} />
      <div style={{position: 'absolute', right: 64, top: 69, transform: 'translateY(-50%)', fontFamily: 'inherit', fontSize: 18, color: C.ASH, letterSpacing: '0.04em', opacity: p(t, readoutAt + 0.6, readoutAt + 1.4)}}>
        Simplified training model · ranges vary by person
      </div>
    </AbsoluteFill>
  );
};

const KEYS: [number, number][] = [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => [c, r] as [number, number]));

/**
 * Fine-motor demonstration: a fingertip path tapping small targets.
 * tremor 0 = precise; 1 = large, erratic overshoot.
 */
export const MotorPanel: React.FC<{t: number; tremor: number; x?: number; y?: number; opacity?: number; seed?: number; gross?: number; label?: string}> = ({t, tremor, x = 1400, y = 300, opacity = 1, seed = 1, gross = 0, label = 'FINE MOTOR'}) => {
  const size = 300;
  const cell = size / 3;
  const targets = [4, 0, 8, 2, 6];
  const seg = 1.1;
  const i = Math.floor(Math.max(0, t) / seg) % targets.length;
  const u = clamp((Math.max(0, t) % seg) / (seg * 0.75));
  const from = KEYS[targets[(i + targets.length - 1) % targets.length]];
  const to = KEYS[targets[i]];
  const cx = (k: [number, number]) => x + cell * (k[0] + 0.5);
  const cy = (k: [number, number]) => y + cell * (k[1] + 0.5);
  const pts: string[] = [];
  for (let s = 0; s <= 24; s++) {
    const v = (s / 24) * u;
    const wob = tremor * 26 * Math.sin(v * 19 + seed + i) * (rand(i * 7 + s + seed) * 0.6 + 0.4);
    const px = lerp(cx(from), cx(to), v) + wob;
    const py = lerp(cy(from), cy(to), v) + tremor * 22 * Math.cos(v * 23 + i) * rand(i * 5 + s);
    pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  const miss = tremor > 0.45 && rand(i * 13 + seed) < tremor;
  const land = pts[pts.length - 1].split(',').map(Number);
  const endX = miss ? land[0] + (rand(i * 3.7) - 0.5) * 70 * tremor : cx(to);
  const endY = miss ? land[1] + (rand(i * 4.1) - 0.5) * 70 * tremor : cy(to);
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity}}>
      <rect x={x - 30} y={y - 60} width={size + 60} height={size + 90} rx={10} fill={C.INK} opacity={0.72} stroke={C.IRON} />
      <text x={x} y={y - 26} fill={C.MIST} style={{fontFamily: FONT_DISPLAY, fontSize: 18, letterSpacing: '0.22em'}}>{label}</text>
      {KEYS.map((k, j) => (
        <circle key={j} cx={cx(k)} cy={cy(k)} r={13} fill="none" stroke={j === targets[i] ? C.BONE : C.IRON} strokeWidth={2} />
      ))}
      <polyline points={pts.join(' ')} fill="none" stroke={C.BONE} strokeWidth={2} opacity={0.8} strokeLinecap="round" />
      {u >= 1 ? <circle cx={endX} cy={endY} r={8} fill={miss ? 'none' : C.BONE} stroke={miss ? C.MIST : C.BONE} strokeWidth={2} /> : null}
      {gross > 0 ? (
        <g opacity={gross}>
          <text x={x} y={y + size + 64} fill={C.MIST} style={{fontFamily: FONT_DISPLAY, fontSize: 18, letterSpacing: '0.22em'}}>GROSS MOTOR</text>
          <path d={`M ${x + 170} ${y + size + 70} q 60 -50 120 0`} stroke={C.BONE} strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d={`M ${x + 280} ${y + size + 58} l 12 12 l -16 4`} stroke={C.BONE} strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
      ) : null}
    </svg>
  );
};

/** Stimulus→reaction bracket (reaction gap demo). Times are scene-local seconds. */
export const ReactionGap: React.FC<{t: number; stim: number; react: number; label: string; x?: number; y?: number; scale?: number; out?: number}> = ({t, stim, react, label, x = 700, y = 250, scale = 300, out = 0}) => {
  if (t < stim) return null;
  const now = Math.min(t, react);
  const w = (now - stim) * scale;
  const done = t >= react;
  const o = (1 - out) * p(t, stim, stim + 0.2);
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: o}}>
      <line x1={x} x2={x} y1={y - 16} y2={y + 16} stroke={C.BONE} strokeWidth={2} />
      <text x={x} y={y - 26} textAnchor="middle" fill={C.MIST} style={{fontFamily: FONT_DISPLAY, fontSize: 18, letterSpacing: '0.2em'}}>STIMULUS</text>
      <line x1={x} x2={x + w} y1={y} y2={y} stroke={C.BONE} strokeWidth={3} />
      {done ? (
        <>
          <line x1={x + w} x2={x + w} y1={y - 16} y2={y + 16} stroke={C.BONE} strokeWidth={2} />
          <text x={x + w} y={y - 26} textAnchor="middle" fill={C.MIST} style={{fontFamily: FONT_DISPLAY, fontSize: 18, letterSpacing: '0.2em'}}>REACTION</text>
          <text x={x + w / 2} y={y + 42} textAnchor="middle" fill={C.BONE} style={{fontFamily: FONT_DISPLAY, fontSize: 24}}>{label}</text>
        </>
      ) : null}
    </svg>
  );
};

/** A cyclist passing along the front lane (used for the reaction-gap demos). */
export const cyclistX = (t: number, t0: number, x0: number, x1: number, dur = 3.2) => lerp(x0, x1, clamp((t - t0) / dur));
