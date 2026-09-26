import React from 'react';
import {C, mixHex} from '../theme';
import {rand} from '../lib/anim';
import {Figure, POSES, Pose, walkPose} from './Figure';
import {LIGHT_ACT1, ShadowLight, ShadowOf, Animal} from './Shadows';
import {WORLD, laneScale} from './World';

export type Agent = {
  id: number;
  kind: 'walker' | 'child' | 'sitter' | 'talker' | 'cyclist';
  lane: number;
  x0: number;
  dir: 1 | -1;
  speed: number;
  size: number;
};

const SPAN_MIN = -1000;
const SPAN = 3800;
const lanes = [WORLD.lane.back, WORLD.lane.mid, WORLD.lane.front];

export const AGENTS: Agent[] = (() => {
  const a: Agent[] = [];
  for (let i = 0; i < 14; i++) {
    a.push({
      id: i,
      kind: 'walker',
      lane: lanes[i % 3] + (rand(i + 0.5) - 0.5) * 10,
      x0: SPAN_MIN + rand(i * 2.3) * SPAN,
      dir: rand(i * 5.1) > 0.45 ? 1 : -1,
      speed: 38 + rand(i * 9.7) * 34,
      size: 0.92 + rand(i * 4.4) * 0.14,
    });
  }
  // Parent + child walking together.
  a.push({id: 20, kind: 'walker', lane: WORLD.lane.mid, x0: 150, dir: 1, speed: 34, size: 1.02});
  a.push({id: 21, kind: 'child', lane: WORLD.lane.mid + 6, x0: 195, dir: 1, speed: 34, size: 0.6});
  // Cafe talkers (stationary).
  a.push({id: 30, kind: 'talker', lane: WORLD.lane.back, x0: WORLD.cafeX - 40, dir: 1, speed: 0, size: 1});
  a.push({id: 31, kind: 'talker', lane: WORLD.lane.back, x0: WORLD.cafeX + 40, dir: -1, speed: 0, size: 0.96});
  // Bench sitter: the future sheepdog-figure.
  a.push({id: 40, kind: 'sitter', lane: WORLD.lane.back - 2, x0: WORLD.benchX + 20, dir: 1, speed: 0, size: 1});
  // Cyclist.
  a.push({id: 50, kind: 'cyclist', lane: WORLD.lane.front + 8, x0: -900, dir: 1, speed: 190, size: 1});
  return a;
})();

const wrap = (x: number) => SPAN_MIN + ((((x - SPAN_MIN) % SPAN) + SPAN) % SPAN);

export const agentState = (ag: Agent, t: number): {x: number; pose: Pose; facing: 1 | -1} => {
  if (ag.kind === 'sitter') return {x: ag.x0, pose: POSES.sit, facing: 1};
  if (ag.kind === 'talker') {
    const sway = Math.sin(t * 0.9 + ag.id) * 3;
    return {x: ag.x0, pose: {...POSES.stand, head: sway, shN: 10 + sway * 2, elN: 40}, facing: ag.dir};
  }
  const dist = ag.speed * t;
  const x = wrap(ag.x0 + ag.dir * dist);
  const stride = ag.kind === 'child' ? 58 : 96;
  const phase = (ag.x0 + dist) / (stride * ag.size) + rand(ag.id) ;
  return {x, pose: walkPose(phase, ag.kind === 'child' ? 1.1 : 0.95), facing: ag.dir};
};

const tint = (ag: Agent) => {
  const depth = (ag.lane - WORLD.lane.back) / (WORLD.lane.front - WORLD.lane.back);
  return mixHex('#3F4852', '#5C6670', Math.max(0, Math.min(1, depth)));
};

type CrowdProps = {
  t: number;
  exclude?: number[];
  opacity?: number;
  /** Per-agent overrides (e.g. the sitter standing up). */
  override?: Record<number, {x?: number; pose?: Pose; facing?: 1 | -1; fill?: string}>;
  filter?: (ag: Agent) => boolean;
};

const Bicycle: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ASH} strokeWidth={4} fill="none">
    <circle cx={-34} cy={-22} r={22} />
    <circle cx={34} cy={-22} r={22} />
    <path d="M -34 -22 L -6 -54 L 24 -54 L 34 -22 M -6 -54 L 4 -22 L -34 -22 M 24 -54 L 20 -68" />
  </g>
);

export const Crowd: React.FC<CrowdProps> = ({t, exclude = [], opacity = 1, override = {}, filter}) => {
  const sorted = [...AGENTS].sort((a, b) => a.lane - b.lane);
  return (
    <g opacity={opacity}>
      {sorted.map((ag) => {
        if (exclude.includes(ag.id)) return null;
        if (filter && !filter(ag)) return null;
        const st = agentState(ag, t);
        const o = override[ag.id] ?? {};
        const s = laneScale(ag.lane) * ag.size;
        const x = o.x ?? st.x;
        if (ag.kind === 'cyclist') {
          const ph = t * 1.4;
          return (
            <g key={ag.id}>
              <Bicycle x={x} y={ag.lane} s={s} />
              <Figure x={x - 8 * s} y={ag.lane - 6 * s} pose={{...POSES.sit, lean: 18, shN: 62, elN: 16, shF: 58, elF: 18, hipN: 62 + 22 * Math.sin(ph * 6.28), hipF: 62 - 22 * Math.sin(ph * 6.28), knN: 70 + 20 * Math.cos(ph * 6.28), knF: 70 - 20 * Math.cos(ph * 6.28), sit: 1}} scale={s} fill={tint(ag)} rim={mixHex(C.SUN, tint(ag), 0.55)} />
            </g>
          );
        }
        return <Figure key={ag.id} x={x} y={ag.lane} pose={o.pose ?? st.pose} scale={s} facing={o.facing ?? st.facing} fill={o.fill ?? tint(ag)} rim={mixHex(C.SUN, tint(ag), 0.55)} />;
      })}
    </g>
  );
};

type CrowdShadowProps = {
  t: number;
  light?: ShadowLight;
  exclude?: number[];
  animal?: (ag: Agent) => {kind: Animal; t: number; scale?: number; eye?: string | null} | null;
  override?: CrowdProps['override'];
  opacity?: number;
};

export const CrowdShadows: React.FC<CrowdShadowProps> = ({t, light = LIGHT_ACT1, exclude = [], animal, override = {}, opacity = 1}) => (
  <g opacity={opacity} style={{filter: `blur(${light.blur.toFixed(2)}px)`}}>
    {AGENTS.map((ag) => {
      if (exclude.includes(ag.id) || ag.kind === 'cyclist') return null;
      const st = agentState(ag, t);
      const o = override[ag.id] ?? {};
      return (
        <ShadowOf
          key={ag.id}
          x={o.x ?? st.x}
          lane={ag.lane}
          pose={o.pose ?? st.pose}
          scale={laneScale(ag.lane) * ag.size}
          facing={o.facing ?? st.facing}
          light={light}
          animal={animal ? animal(ag) : null}
          groupBlurred
        />
      );
    })}
  </g>
);
