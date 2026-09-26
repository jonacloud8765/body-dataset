import React from 'react';
import {Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {FONT_DISPLAY, FONT_MONO} from '../fonts';
import {CREATOR_GOLD, INK, LINE_2, PAPER, WASH_ICE} from '../theme/palette';
import {beatsAt, FPS, GRID, HEIGHT, posToSeconds, WIDTH} from '../timing/song';
import type {Shot} from '../timing/timeline';
import {mix, mixSky, SKY, type Sky} from './color';
import {BigEye, Colony, Crew, Feet, GiantPrint, Mountain, Penguin, type EyeState} from './figures';
import type {CamKey, El, Move, PenguinKey, SkySpec, Spec, When} from './types';

/** Resolves a When to a frame relative to the shot's first frame. */
export const makeResolver = (shot: Shot) => (w: When): number => {
  if (typeof w === 'number') {
    return Math.round(w * (shot.frames - 1));
  }
  const [pos, add] = w.split('+');
  const extra = add ? parseInt(add, 10) : 0;
  return Math.round(posToSeconds(pos) * FPS) - shot.from + extra;
};

const ease = Easing.inOut(Easing.cubic);

const lerpKeys = <T extends {at: When}>(
  keys: T[],
  f: number,
  res: (w: When) => number,
  field: keyof T,
  fallback: number,
): number => {
  const pts = keys
    .filter((k) => k[field] !== undefined)
    .map((k) => ({f: res(k.at), v: k[field] as unknown as number}))
    .sort((a, b) => a.f - b.f);
  if (!pts.length) return fallback;
  if (f <= pts[0].f) return pts[0].v;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    if (f <= b.f) {
      const t = b.f === a.f ? 1 : (f - a.f) / (b.f - a.f);
      return a.v + (b.v - a.v) * ease(Math.max(0, Math.min(1, t)));
    }
  }
  return pts[pts.length - 1].v;
};

const latest = <T extends {at: When}, K extends keyof T>(keys: T[], f: number, res: (w: When) => number, field: K, fallback: T[K]): T[K] => {
  let v = fallback;
  let best = -Infinity;
  for (const k of keys) {
    const kf = res(k.at);
    if (k[field] !== undefined && kf <= f && kf >= best) {
      best = kf;
      v = k[field];
    }
  }
  return v;
};

const moveOffset = (m: Move | undefined, f: number, res: (w: When) => number) => {
  if (!m) return {dx: 0, dy: 0};
  const [a, b] = m.at ?? [0, 1];
  const t = interpolate(f, [res(a), Math.max(res(a) + 1, res(b))], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  return {dx: (m.x ?? 0) * t, dy: (m.y ?? 0) * t};
};

export const skyAt = (spec: SkySpec | undefined, f: number, res: (w: When) => number, shot: Shot): Sky => {
  if (!spec) return SKY.paper;
  if (spec === 'timelapse') {
    // three day/night cycles across the shot
    const cyc = (f / Math.max(1, shot.frames)) * 3;
    const night = 0.5 - 0.5 * Math.cos(cyc * Math.PI * 2);
    return mixSky(SKY.noon, SKY.night, Math.pow(night, 1.5));
  }
  if (typeof spec === 'string') return SKY[spec];
  const a = res(spec.at);
  const b = res(spec.over);
  const t = interpolate(f, [a, Math.max(a + 1, b)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return mixSky(SKY[spec.from], SKY[spec.to], t);
};

const camTransform = (keys: CamKey[] | undefined, f: number, res: (w: When) => number, extra: {x: number; y: number; roll: number}) => {
  const k = keys ?? [];
  const zoom = lerpKeys(k, f, res, 'zoom', 1);
  const x = lerpKeys(k, f, res, 'x', 0) + extra.x;
  const y = lerpKeys(k, f, res, 'y', 0) + extra.y;
  const roll = lerpKeys(k, f, res, 'roll', 0) + extra.roll;
  return {zoom, x, y, roll, css: `translate(${WIDTH / 2} ${HEIGHT / 2}) rotate(${roll}) scale(${zoom}) translate(${-WIDTH / 2 - x} ${-HEIGHT / 2 - y})`};
};

const stepFor = (walk: 'every' | 'half' | 'double' | undefined, t: number) => {
  const b = beatsAt(t);
  if (walk === 'half') return b / 2;
  if (walk === 'double') return b * 2;
  return b;
};

const penguinState = (keys: PenguinKey[], f: number, res: (w: When) => number) => ({
  x: lerpKeys(keys, f, res, 'x', 960),
  y: lerpKeys(keys, f, res, 'y', 700),
  h: lerpKeys(keys, f, res, 'h', 200),
  headTurn: lerpKeys(keys, f, res, 'headTurn', 0),
  view: latest(keys, f, res, 'view', 'side') ?? 'side',
  facing: latest(keys, f, res, 'facing', 1) ?? 1,
  pose: latest(keys, f, res, 'pose', 'stand') ?? 'stand',
});

type Ctx = {shot: Shot; f: number; global: number; t: number; res: (w: When) => number; sky: Sky; roll: number};

const Stipple: React.FC<{x: number; y: number; w: number; h: number; seed: string; color?: string}> = ({x, y, w, h, seed, color = LINE_2}) => {
  const n = Math.min(120, Math.round((w * h) / 9000));
  return (
    <g>
      {new Array(n).fill(0).map((_, i) => {
        const px = x + random(`${seed}x${i}`) * w;
        const py = y + random(`${seed}y${i}`) * h;
        return <line key={i} x1={px} y1={py} x2={px + 14} y2={py - 8} stroke={color} strokeWidth={1.4} opacity={0.55} />;
      })}
    </g>
  );
};

const renderEl = (el: El, i: number, c: Ctx): React.ReactNode => {
  const {f, res, sky, t} = c;
  switch (el.k) {
    case 'ground': {
      const beats = beatsAt(t);
      const off = el.scroll ? (beats * el.scroll) % 400 : 0;
      return (
        <g key={i}>
          <rect x={-2000} y={el.y} width={6000} height={3000} fill={el.color ?? sky.ground} />
          {el.line !== false ? <line x1={-2000} y1={el.y} x2={4000} y2={el.y} stroke={mix(sky.ground, INK, 0.25)} strokeWidth={1.5} /> : null}
          {el.marks === 'sastrugi'
            ? new Array(40).fill(0).map((_, j) => {
                const depth = random(`sd${j}`);
                const yy = el.y + 8 + Math.pow(depth, 1.6) * (HEIGHT - el.y + 200);
                const xx = ((random(`sx${j}`) * 2400 - off * (0.3 + depth)) % 2400 + 2400) % 2400 - 240;
                const len = 30 + depth * 90;
                return <path key={j} d={`M ${xx} ${yy} q ${len / 2} ${-4 - depth * 6} ${len} 0`} fill="none" stroke={LINE_2} strokeWidth={1 + depth * 1.5} opacity={0.5} />;
              })
            : null}
        </g>
      );
    }
    case 'mountain': {
      const {dx, dy} = moveOffset(el.move, f, res);
      let eyes: EyeState = 'none';
      for (const e of el.eyes ?? []) if (f >= res(e.at)) eyes = e.state;
      let plume = -1;
      for (const p of el.plumes ?? []) {
        const a = res(p);
        const pr = (f - a) / 72;
        if (pr >= 0 && pr <= 1) plume = pr;
      }
      const rim = el.rim ? interpolate(f, [res(el.rim[0]), res(el.rim[1])], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
      const turn = el.turnAt !== undefined ? interpolate(f, [res(el.turnAt), res(el.turnAt) + 20], [1, -1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
      return (
        <g key={i} transform={`translate(${el.x + dx},${el.y + dy}) scale(${turn},1)`}>
          <Mountain h={el.h} haze={el.haze ?? 0} hazeColor={sky.far} eyes={eyes} rim={rim} plume={plume} dark={el.dark} />
        </g>
      );
    }
    case 'penguin': {
      const st = penguinState(el.keys, f, res);
      const step = stepFor(el.walk, t);
      // No lip sync (director's call): the beak stays closed while he sings.
      const beak = 0;
      return (
        <g key={i} transform={`translate(${st.x},${st.y})${el.counterRoll ? ` rotate(${-c.roll})` : ''}`}>
          <Penguin h={st.h} view={st.view} facing={st.facing} pose={el.walk || st.pose !== 'walk' ? st.pose : 'stand'} step={step} beak={beak} headTurn={st.headTurn} t={t} />
        </g>
      );
    }
    case 'crew': {
      const {dx, dy} = moveOffset(el.move, f, res);
      return (
        <g key={i} transform={`translate(${el.x + dx},${el.y + dy})`}>
          <Crew h={el.h} role={el.role} facing={el.facing} step={el.walk ? beatsAt(t) : 0} sink={el.sink} look={el.look} />
        </g>
      );
    }
    case 'colony': {
      const wave = el.waveAt !== undefined ? (f - res(el.waveAt)) / 2 : -1;
      return (
        <g key={i} transform={`translate(${el.x},${el.y})`} style={el.blur ? {filter: `blur(${el.blur}px)`} : undefined}>
          <Colony
            w={el.w}
            ph={el.ph}
            rows={el.rows}
            cols={el.cols}
            hero={el.hero}
            seed={el.seed}
            wave={wave}
            turned={(el.turns ?? []).filter((tn) => f >= res(tn.at) && f < res(tn.until)).map((tn) => [el.rows - 1, tn.col] as [number, number])}
          />
        </g>
      );
    }
    case 'feet': {
      const a = el.stepAt !== undefined ? res(el.stepAt) : -9999;
      const lift = el.stepAt !== undefined ? interpolate(f, [a - 16, a], [90, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)}) : 0;
      const print = el.stepAt !== undefined ? (f >= a ? 1 : 0) : 0;
      const puff = f >= a && f < a + 12 ? (f - a) / 12 : -1;
      return (
        <g key={i} transform={`translate(${el.x},${el.y})`}>
          <Feet size={el.size} lift={lift} print={print} />
          {puff >= 0
            ? new Array(10).fill(0).map((_, j) => (
                <circle key={j} cx={el.size * 0.72 + Math.cos(j) * puff * 180} cy={-10 - Math.abs(Math.sin(j * 1.7)) * puff * 70} r={8 + puff * 14} fill="#FFFFFF" opacity={0.85 * (1 - puff)} />
              ))
            : null}
        </g>
      );
    }
    case 'print':
      return (
        <g key={i} transform={`translate(${el.x},${el.y})`}>
          <GiantPrint size={el.size} />
        </g>
      );
    case 'rect':
      return (
        <g key={i}>
          <rect x={el.x} y={el.y} width={el.w} height={el.h} rx={el.rx} fill={el.fill} opacity={el.opacity} stroke={el.stroke} strokeWidth={el.stroke ? 2 : 0} />
          {el.hatch ? <Stipple x={el.x} y={el.y} w={el.w} h={el.h} seed={`r${i}`} /> : null}
        </g>
      );
    case 'ellipse':
      return <ellipse key={i} cx={el.x} cy={el.y} rx={el.rx} ry={el.ry} fill={el.fill} opacity={el.opacity} />;
    case 'poly': {
      const {dx, dy} = moveOffset(el.move, f, res);
      const xs = el.pts.map((p) => p[0]);
      const ys = el.pts.map((p) => p[1]);
      return (
        <g key={i} transform={`translate(${dx},${dy})`}>
          <polygon points={el.pts.map((p) => p.join(',')).join(' ')} fill={el.fill} opacity={el.opacity} stroke={el.stroke ?? INK} strokeWidth={el.stroke === 'none' ? 0 : 2} strokeLinejoin="round" />
          {el.hatch ? (
            <Stipple x={Math.min(...xs)} y={Math.min(...ys)} w={Math.max(...xs) - Math.min(...xs)} h={Math.max(...ys) - Math.min(...ys)} seed={`p${i}`} color="#2A2C30" />
          ) : null}
        </g>
      );
    }
    case 'footprints':
      return (
        <g key={i}>
          {new Array(el.n).fill(0).map((_, j) => {
            const u = j / Math.max(1, el.n - 1);
            const x = el.x1 + (el.x2 - el.x1) * u;
            const y = el.y1 + (el.y2 - el.y1) * u + (j % 2 ? el.size * 0.6 : -el.size * 0.6);
            return <ellipse key={j} cx={x} cy={y} rx={el.size} ry={el.size * 0.55} fill={el.color ?? mix(sky.ground, INK, 0.3)} />;
          })}
        </g>
      );
    case 'trail': {
      const u = interpolate(f, [res(el.from), res(el.to)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
      return u > 0 ? (
        <line key={i} x1={el.x1} y1={el.y1} x2={el.x1 + (el.x2 - el.x1) * u} y2={el.y1 + (el.y2 - el.y1) * u} stroke={mix(sky.ground, INK, 0.35)} strokeWidth={el.width} strokeLinecap="round" />
      ) : null;
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
      if (!text) return null;
      const rise = interpolate(since, [0, 5], [60, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.4))});
      const words = text.split(' ');
      const lines: string[] = [];
      for (const w of words) {
        const last = lines[lines.length - 1];
        if (last && (last + ' ' + w).length <= 14) lines[lines.length - 1] = last + ' ' + w;
        else lines.push(w);
      }
      const fs = Math.min(el.h / (lines.length * 1.25 + 0.6), el.w / 8.2);
      return (
        <g key={i} transform={`translate(${el.x},${el.y + rise}) rotate(-4, ${el.w / 2}, ${el.h / 2})`}>
          <rect x={-18} y={-26} width={el.w + 36} height={el.h + 52} rx={10} fill="#8A6A45" stroke={INK} strokeWidth={3} />
          <rect x={0} y={0} width={el.w} height={el.h} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
          <rect x={el.w / 2 - 50} y={-34} width={100} height={24} rx={6} fill="#B9BCC0" stroke={INK} strokeWidth={2} />
          {lines.map((ln, j) => (
            <text
              key={j}
              x={el.w / 2}
              y={el.h / 2 + (j - (lines.length - 1) / 2) * fs * 1.2 + fs * 0.35}
              textAnchor="middle"
              fontFamily={FONT_DISPLAY}
              fontWeight={800}
              fontSize={fs}
              fill={INK}
              style={{fontStretch: '80%'}}
            >
              {ln}
            </text>
          ))}
        </g>
      );
    }
    case 'boom': {
      const dip = el.dipAt !== undefined ? interpolate(f, [res(el.dipAt), res(el.dipAt) + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease}) : 1;
      const bob = Math.sin(t * 5) * 10;
      const y = el.y - 260 * (1 - dip) + bob;
      return (
        <g key={i}>
          <line x1={el.x + 300} y1={-200} x2={el.x} y2={y} stroke="#3A3E44" strokeWidth={10} />
          <ellipse cx={el.x} cy={y + 30} rx={110} ry={48} fill="#9A9A96" />
          {new Array(18).fill(0).map((_, j) => (
            <line key={j} x1={el.x - 100 + j * 11} y1={y + 72 + (j % 3) * 4} x2={el.x - 104 + j * 11} y2={y + 84 + (j % 3) * 4} stroke="#7F7F7B" strokeWidth={3} />
          ))}
        </g>
      );
    }
    case 'storm': {
      const part = el.partAt !== undefined ? interpolate(f, [res(el.partAt), res(el.partAt) + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
      const n = Math.round(160 * el.density);
      return (
        <g key={i} opacity={1 - part}>
          <rect x={-2000} y={-2000} width={6000} height={6000} fill="#C8D0D8" opacity={0.28 * el.density} />
          {new Array(n).fill(0).map((_, j) => {
            const sp = 30 + random(`st${j}`) * 40;
            const x = ((random(`sx${j}`) * 2400 - (t * sp * 30)) % 2400 + 2400) % 2400 - 240;
            const y = ((random(`sy${j}`) * 1400 + t * sp * 8) % 1400) - 160;
            const side = part > 0 ? (x < 960 ? -1 : 1) * part * 1400 : 0;
            return <line key={j} x1={x + side} y1={y} x2={x + side - 40 - sp} y2={y + 10} stroke="#FFFFFF" strokeWidth={2 + random(`sw${j}`) * 3} opacity={0.7} />;
          })}
        </g>
      );
    }
    case 'aurora': {
      const fold = el.foldAt !== undefined ? interpolate(f, [res(el.foldAt), res(el.foldAt) + 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease}) : 0;
      const o = el.faint ? 0.3 : 0.75;
      return (
        <g key={i} opacity={o * (1 - fold * 0.8)} transform={`translate(0,${fold * 420}) scale(1,${1 - fold * 0.7})`}>
          {[
            ['#6FD3B0', 0],
            ['#4AA9B8', 1],
            ['#7F74C9', 2],
          ].map(([c, j]) => (
            <path
              key={String(j)}
              d={`M -100 ${180 + Number(j) * 60} C 400 ${80 + Math.sin(t * 0.8 + Number(j)) * 60}, 1200 ${300 + Math.cos(t * 0.6 + Number(j)) * 60}, 2100 ${140 + Number(j) * 50}`}
              fill="none"
              stroke={String(c)}
              strokeWidth={90 - Number(j) * 20}
              opacity={0.5}
              style={{filter: 'blur(18px)'}}
            />
          ))}
        </g>
      );
    }
    case 'streaks': {
      const a = res(el.at);
      if (f < a || f > a + el.frames) return null;
      const u = (f - a) / el.frames;
      return (
        <g key={i}>
          {new Array(40).fill(0).map((_, j) => {
            const y = random(`gy${j}`) * HEIGHT;
            const x = el.vertical ? random(`gx${j}`) * WIDTH : -400 + u * 2800 + random(`gx${j}`) * 600;
            return el.vertical ? (
              <line key={j} x1={x} y1={-100 + u * 1400 + y * 0.3} x2={x} y2={40 + u * 1400 + y * 0.3} stroke="#FFFFFF" strokeWidth={3} opacity={0.7} />
            ) : (
              <line key={j} x1={x} y1={y} x2={x - 260} y2={y + 6} stroke="#FFFFFF" strokeWidth={3 + random(`gw${j}`) * 5} opacity={0.75} />
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
            const x = ((random(`mx${j}`) * 2400 - t * el.speed * 60) % 2400 + 2400) % 2400 - 240;
            return <line key={j} x1={x} y1={y} x2={x + 220} y2={y} stroke={LINE_2} strokeWidth={3} opacity={0.6} />;
          })}
        </g>
      );
    case 'glint': {
      const a = res(el.at);
      if (f < a || f >= a + el.frames) return null;
      const r = el.r ?? 26;
      return (
        <g key={i}>
          <circle cx={el.x} cy={el.y} r={r * 2.2} fill="#FFF3D6" opacity={0.35} />
          <path d={`M ${el.x - r * 2} ${el.y} L ${el.x + r * 2} ${el.y} M ${el.x} ${el.y - r * 2} L ${el.x} ${el.y + r * 2}`} stroke="#FFFFFF" strokeWidth={3} />
          <circle cx={el.x} cy={el.y} r={r * 0.5} fill="#FFFFFF" />
        </g>
      );
    }
    case 'glow': {
      const u = interpolate(f, [res(el.from), res(el.to)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      return <circle key={i} cx={el.x} cy={el.y} r={el.r * (0.4 + 0.6 * u)} fill={el.color} opacity={0.75 * u} style={{filter: 'blur(40px)'}} />;
    }
    case 'sun':
      return (
        <g key={i}>
          <circle cx={el.x} cy={el.y} r={el.r * 2.6} fill="#F6C979" opacity={0.45} style={{filter: 'blur(30px)'}} />
          <circle cx={el.x} cy={el.y} r={el.r} fill="#FFF8E8" />
        </g>
      );
    case 'eyes': {
      const open = el.openAt !== undefined ? interpolate(f, [res(el.openAt), res(el.openAt) + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease}) : 0;
      return (
        <g key={i}>
          {[-1, 1].map((sgn) => (
            <g key={sgn} transform={`translate(${el.x + (sgn * el.gap) / 2},${el.y})`}>
              {open > 0 ? <circle r={el.size * 0.9 * open} fill={CREATOR_GOLD} opacity={0.35 * open} style={{filter: 'blur(40px)'}} /> : null}
              <ellipse rx={el.size * 0.56} ry={el.size * 0.42} fill="#8FA3B5" stroke={INK} strokeWidth={4} />
              <g transform={`scale(${el.size / 100})`}>
                <BigEye size={100} open={Math.max(0.02, open)} pupil={1} />
              </g>
              {open < 1 ? (
                <g opacity={1 - open}>
                  <ellipse rx={el.size * 0.6} ry={el.size * 0.46} fill="#C9D6E0" stroke={INK} strokeWidth={3} />
                  <ellipse rx={el.size * 0.6} ry={el.size * 0.46} fill={WASH_ICE} opacity={0.3} />
                  <path d={`M ${-el.size * 0.34} ${-el.size * 0.2} q ${el.size * 0.2} ${-el.size * 0.16} ${el.size * 0.44} ${-el.size * 0.1}`} fill="none" stroke="#FFFFFF" strokeWidth={el.size * 0.03} strokeLinecap="round" opacity={0.8} />
                </g>
              ) : null}
            </g>
          ))}
        </g>
      );
    }
    case 'seal': {
      return (
        <g key={i}>
          <rect x={el.x} y={el.y} width={el.w} height={el.h} fill="#C9D6E0" />
          <rect x={el.x} y={el.y} width={el.w} height={el.h} fill={WASH_ICE} opacity={0.35} />
          {el.cracks.map((cw, j) => {
            const a = res(cw);
            if (f < a) return null;
            const u = interpolate(f, [a, a + 6], [0, 1], {extrapolateRight: 'clamp'});
            const x0 = el.x + el.w * (0.25 + j * 0.22);
            const pts = [0, 1, 2, 3, 4, 5].map((q) => `${x0 + Math.sin(q * 2.3 + j) * 60 * u},${el.y + (el.h * q * u) / 5}`).join(' ');
            return (
              <g key={j}>
                <polyline points={pts} fill="none" stroke={CREATOR_GOLD} strokeWidth={10} opacity={0.6} style={{filter: 'blur(6px)'}} />
                <polyline points={pts} fill="none" stroke={INK} strokeWidth={4} />
              </g>
            );
          })}
        </g>
      );
    }
    case 'bigEye': {
      const pu = el.pupil ? interpolate(f, [0, c.shot.frames], el.pupil, {extrapolateRight: 'clamp'}) : 1;
      return (
        <g key={i} transform={`translate(${el.x},${el.y})`}>
          <BigEye size={el.size} open={1} pupil={pu} reflection={el.reflection} />
        </g>
      );
    }
    case 'ring': {
      const a = res(el.at);
      if (f < a) return null;
      const u = (f - a) / 45;
      return <ellipse key={i} cx={el.x} cy={el.y} rx={60 + u * 1800} ry={20 + u * 500} fill="none" stroke={CREATOR_GOLD} strokeWidth={16 * Math.max(0, 1 - u * 0.6)} opacity={Math.max(0, 1 - u * 0.5)} />;
    }
    case 'breath': {
      const a = res(el.at);
      const u = interpolate(f, [a - 12, a + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      if (u <= 0 || u >= 1) return null;
      return <ellipse key={i} cx={2100 - u * 2600} cy={760} rx={620} ry={320} fill="#FFFFFF" opacity={0.75 * Math.sin(Math.PI * u)} style={{filter: 'blur(30px)'}} />;
    }
    case 'debris':
      return (
        <g key={i}>
          {el.at.map((w, j) => {
            const a = res(w);
            if (f < a || f > a + 30) return null;
            const u = (f - a) / 30;
            return new Array(8).fill(0).map((_, q) => (
              <circle key={`${j}-${q}`} cx={el.x + (random(`db${j}${q}`) - 0.5) * (el.spread ?? 300)} cy={el.y + u * u * 600 + q * 12} r={6 + random(`dr${q}`) * 8} fill={el.color ?? '#6E7278'} />
            ));
          })}
        </g>
      );
    case 'pip': {
      const a = res(el.at);
      if (f < a || f >= a + el.frames) return null;
      return (
        <g key={i}>
          <rect x={el.x - 6} y={el.y - 6} width={el.w + 12} height={el.h + 12} fill={PAPER} stroke={INK} strokeWidth={3} />
          <svg x={el.x} y={el.y} width={el.w} height={el.h} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid slice">
            <rect width={WIDTH} height={HEIGHT} fill={sky.ground} />
            {el.els.map((e, j) => renderEl(e, j, c))}
          </svg>
        </g>
      );
    }
    case 'camp':
      return (
        <g key={i} transform={`translate(${el.x},${el.y}) scale(${el.s})`}>
          <path d="M -160 0 Q 0 -190 160 0 Z" fill="#3E6E4E" stroke={INK} strokeWidth={3} />
          <path d="M -60 0 Q 0 -80 60 0 Z" fill="#23392A" />
          <line x1={260} y1={0} x2={260} y2={-280} stroke="#2E3237" strokeWidth={8} />
          <rect x={232} y={-320} width={56} height={40} fill="#E8E6DE" stroke={INK} strokeWidth={3} />
          <polygon points="232,-300 -700,120 -200,160 288,-300" fill="#FFFFFF" opacity={0.22} />
          <rect x={-330} y={-40} width={130} height={40} fill="#6C4A2C" stroke={INK} strokeWidth={3} />
        </g>
      );
    case 'group': {
      const {dx, dy} = moveOffset(el.move, f, res);
      const op = el.fade ? interpolate(f, [res(el.fade[0]), res(el.fade[1])], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
      const clipId = `clip${c.shot.id}${i}`;
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
            <g transform={`translate(${dx},${dy})`}>{el.els.map((e, j) => renderEl(e, j, c))}</g>
          </g>
        </g>
      );
    }
    case 'map':
      return <MapGraphic key={i} res={res} f={f} />;
    case 'endcard':
      return <EndCard key={i} f={f} />;
    default:
      return null;
  }
};

const MapGraphic: React.FC<{res: (w: When) => number; f: number}> = ({res, f}) => {
  const draw = interpolate(f, [0, 30], [0, 1], {extrapolateRight: 'clamp'});
  const measure = interpolate(f, [res('1.3'), res('2.2')], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const stamp = f >= res('2.2');
  const stampScale = stamp ? interpolate(f - res('2.2'), [0, 2, 4], [1.25, 0.95, 1], {extrapolateRight: 'clamp'}) : 0;
  const colony = [300, 610];
  const mtn = [1560, 470];
  const dots = 28;
  return (
    <g>
      <rect width={WIDTH} height={HEIGHT} fill={PAPER} />
      {new Array(12).fill(0).map((_, j) => (
        <line key={`g${j}`} x1={j * 170} y1={0} x2={j * 170} y2={HEIGHT} stroke={LINE_2} strokeWidth={1} opacity={0.18 * draw} />
      ))}
      <path d="M 0 250 C 120 320, 90 520, 170 600 S 150 860, 230 1080" fill="none" stroke={INK} strokeWidth={3} strokeDasharray={1400} strokeDashoffset={1400 * (1 - draw)} />
      <rect x={0} y={0} width={120} height={HEIGHT} fill="#DCE4EA" opacity={0.6 * draw} />
      {[1, 2, 3, 4].map((r) => (
        <ellipse key={r} cx={mtn[0]} cy={mtn[1] + 30} rx={90 * r} ry={60 * r} fill="none" stroke={LINE_2} strokeWidth={1.5} opacity={draw * 0.7} />
      ))}
      <g opacity={draw}>
        {new Array(30).fill(0).map((_, j) => (
          <circle key={j} cx={colony[0] - 40 + random(`cd${j}`) * 80} cy={colony[1] - 30 + random(`ce${j}`) * 60} r={4} fill={INK} />
        ))}
        <circle cx={colony[0] + 44} cy={colony[1]} r={6} fill="#E8322B" />
        <g transform={`translate(${mtn[0]},${mtn[1] + 40}) scale(0.9)`}>
          <Mountain h={100} haze={0} hazeColor={PAPER} />
        </g>
        <text x={colony[0]} y={colony[1] + 80} textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize={24} letterSpacing={5} fill={INK}>
          THE COLONY
        </text>
        <text x={mtn[0]} y={mtn[1] + 110} textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize={24} letterSpacing={5} fill={INK}>
          MOUNTAINS
        </text>
      </g>
      {new Array(dots).fill(0).map((_, j) =>
        j / dots < measure ? (
          <circle key={j} cx={colony[0] + 50 + ((mtn[0] - 120 - colony[0] - 50) * j) / dots} cy={colony[1] + ((mtn[1] - colony[1]) * j) / dots} r={5} fill={INK} />
        ) : null,
      )}
      {stamp ? (
        <g transform={`translate(${(colony[0] + mtn[0]) / 2},${(colony[1] + mtn[1]) / 2 - 60}) scale(${stampScale}) rotate(-6)`}>
          <rect x={-150} y={-52} width={300} height={104} fill="none" stroke="#B03A2E" strokeWidth={6} />
          <text x={0} y={24} textAnchor="middle" fontFamily={FONT_MONO} fontWeight={500} fontSize={64} fill="#B03A2E">
            70 KM
          </text>
        </g>
      ) : null}
    </g>
  );
};

const EndCard: React.FC<{f: number}> = ({f}) => {
  const l1 = 'The penguin was not seen again.';
  const l2 = 'Neither was the mountain.';
  const n1 = Math.max(0, Math.min(l1.length, Math.floor((f - 12) / 2)));
  const n2 = Math.max(0, Math.min(l2.length, Math.floor((f - 12 - l1.length * 2 - 15) / 2)));
  return (
    <g>
      <rect width={WIDTH} height={HEIGHT} fill={PAPER} />
      <text x={WIDTH / 2} y={500} textAnchor="middle" fontFamily={FONT_MONO} fontSize={46} fill={INK}>
        {l1.slice(0, n1)}
      </text>
      <text x={WIDTH / 2} y={580} textAnchor="middle" fontFamily={FONT_MONO} fontSize={46} fill={INK}>
        {l2.slice(0, n2)}
      </text>
    </g>
  );
};

/** One shot's blocking: sky, elements and camera, with in-shot phases (cuts or dissolves). */
export const ShotView: React.FC<{shot: Shot; spec: Spec}> = ({shot, spec}) => {
  const frame = useCurrentFrame();
  const res = makeResolver(shot);
  const freeze = spec.freezeLast ? Math.min(frame, shot.frames - spec.freezeLast) : frame;
  const f = freeze;
  const global = shot.from + f;
  const t = global / FPS;
  const phases = spec.phases ?? [{from: 0, sky: spec.sky, els: spec.els ?? [], cam: spec.cam}];
  const starts = phases.map((p) => (p.from === undefined ? 0 : res(p.from)));
  let idx = 0;
  starts.forEach((s, j) => {
    if (f >= s) idx = j;
  });
  const dis = spec.dissolveFrames ?? 0;

  // handheld drift for the documentary, a jolt on downbeats if asked
  const doc = shot.mode === 'DOC';
  const hh = doc
    ? {x: 7 * Math.sin(t * 1.3) + 4 * Math.sin(t * 3.1 + 1), y: 5 * Math.sin(t * 1.7 + 2) + 3 * Math.sin(t * 2.9), roll: 0.35 * Math.sin(t * 0.9 + 0.5)}
    : {x: 0, y: 0, roll: 0};
  if (spec.shakeOnDownbeat) {
    const b = beatsAt(t);
    const since = (b - Math.floor(b / GRID.meter) * GRID.meter) * GRID.beat_s * FPS;
    const amp = since < 6 ? (6 - since) * 3 : 0;
    hh.x += amp * Math.sin(f * 2.3);
    hh.y += amp * Math.cos(f * 3.1);
  }

  const renderPhase = (j: number, opacity: number) => {
    const ph = phases[j];
    const sky = skyAt(ph.sky ?? spec.sky, f, res, shot);
    const cam = camTransform(ph.cam ?? spec.cam, f, res, hh);
    const prev = camTransform(ph.cam ?? spec.cam, Math.max(0, f - 1), res, {x: 0, y: 0, roll: 0});
    const speed = Math.hypot((cam.x - hh.x - prev.x) * cam.zoom, (cam.y - hh.y - prev.y) * cam.zoom) + Math.abs(cam.roll - hh.roll - prev.roll) * 12;
    const blur = speed > 25 ? Math.min(22, speed / 14) : 0;
    const ctx: Ctx = {shot, f, global, t, res, sky, roll: cam.roll};
    return (
      <g key={j} opacity={opacity}>
        <defs>
          <linearGradient id={`sky${shot.id}${j}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={sky.top} />
            <stop offset="0.62" stopColor={sky.low} />
            <stop offset="1" stopColor={sky.low} />
          </linearGradient>
        </defs>
        <rect width={WIDTH} height={HEIGHT} fill={`url(#sky${shot.id}${j})`} />
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
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{position: 'absolute', inset: 0}}>
      {layers}
    </svg>
  );
};
