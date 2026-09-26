import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {FONT_DISPLAY, FONT_MONO} from '../fonts';
import {REC} from '../theme/palette';
import {barBeatAt, FPS, HEIGHT, WIDTH} from '../timing/song';
import type {Shot} from '../timing/timeline';
import {makeResolver} from './ShotView';
import type {Spec} from './types';

/** Battery bars by shot (§13.3); a negative value blinks. */
const BATTERY: Record<string, number> = {S02: 4, S03: 4, S16: 3, S22: 2, S28: 1, S29: 1, S30: 1, S42: -1, S58: -0.01, S60: -0.01};

const tc = (f: number) => {
  const t = Math.floor(f / FPS);
  const ff = f % FPS;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(Math.floor(t / 3600))}:${pad(Math.floor(t / 60) % 60)}:${pad(t % 60)}:${pad(ff)}`;
};

const Bracket: React.FC<{x: number; y: number; w: number; h: number}> = ({x, y, w, h}) => {
  const L = 34;
  const s = {stroke: 'rgba(255,255,255,0.9)', strokeWidth: 3, fill: 'none'};
  return (
    <g>
      <path d={`M ${x} ${y + L} V ${y} H ${x + L}`} {...s} />
      <path d={`M ${x + w - L} ${y} H ${x + w} V ${y + L}`} {...s} />
      <path d={`M ${x} ${y + h - L} V ${y + h} H ${x + L}`} {...s} />
      <path d={`M ${x + w - L} ${y + h} H ${x + w} V ${y + h - L}`} {...s} />
    </g>
  );
};

/** The documentary's camcorder viewfinder, drawn over DOC shots. */
export const DocFrame: React.FC<{shot: Shot; spec: Spec}> = ({shot, spec}) => {
  const frame = useCurrentFrame();
  const res = makeResolver(shot);
  const global = shot.from + frame;
  const {beat} = barBeatAt((global + 0.5) / FPS);
  const frozen = spec.freezeLast !== undefined && frame >= shot.frames - spec.freezeLast;
  if (frozen && frame >= shot.frames - Math.max(4, spec.freezeLast! - 10)) {
    return <div style={{position: 'absolute', inset: 0, background: '#050505'}} />;
  }
  const pop = (i: number) => (frame >= i * 2 ? 1 : 0);
  const glitch = spec.glitchAt !== undefined ? frame - res(spec.glitchAt) : -1;
  const gl = glitch >= 0 && glitch < 24;
  const jx = gl ? Math.sin(frame * 7.3) * 18 : 0;
  const recOn = beat % 2 === 0;
  const bat = BATTERY[shot.id] ?? 4;
  const blink = bat < 0 ? frame % 20 < 10 : true;
  const bars = Math.max(0, Math.round(Math.abs(bat)));
  const focus = spec.focus ?? {x: 700, y: 330, w: 520, h: 420};
  const hunt = Math.sin(frame * 0.35) * 16 * Math.exp(-((frame % 45) / 20));
  const lt = shot.lower_third;
  const ltStart = spec.lowerThirdAt !== undefined ? res(spec.lowerThirdAt) : 12;
  const typed = (s: string, delay: number) => s.slice(0, Math.max(0, Math.floor((frame - ltStart - delay) / 3)));
  let counterLine: string | null = null;
  if (shot.counter) {
    const u = frame / Math.max(1, shot.frames - 1);
    const day = Math.floor(interpolate(u, [0, 1], shot.counter.day));
    const km = interpolate(u, [0, 1], shot.counter.km);
    counterLine = `DAY ${day} · ${km.toFixed(1)} KM TO THE MOUNTAINS`;
  }
  if (shot.id === 'S60') {
    const km = interpolate(frame, [0, shot.frames - (spec.freezeLast ?? 0)], [0, 1.2], {extrapolateRight: 'clamp'});
    counterLine = `DISTANCE TO MOUNTAIN · ${km.toFixed(1)} KM`;
  }
  const exposure = shot.id === 'S02' ? interpolate(frame, [0, 10], [1, 0], {extrapolateRight: 'clamp'}) : 0;
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translateX(${jx}px)`}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.38) 100%)'}} />
      {exposure > 0 ? <div style={{position: 'absolute', inset: 0, background: '#FFFFFF', opacity: exposure}} /> : null}
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
        {gl ? (
          <g opacity={0.5}>
            <rect x={0} y={200 + (glitch * 37) % 600} width={WIDTH} height={24} fill="#FF2D6A" opacity={0.4} />
            <rect x={0} y={500 + (glitch * 53) % 400} width={WIDTH} height={14} fill="#2DE1FF" opacity={0.4} />
          </g>
        ) : null}
        {pop(1) ? (
          <g>
            {[
              [60, 60, 1, 1],
              [WIDTH - 60, 60, -1, 1],
              [60, HEIGHT - 60, 1, -1],
              [WIDTH - 60, HEIGHT - 60, -1, -1],
            ].map(([x, y, sx, sy], i) => (
              <path key={i} d={`M ${x} ${y + sy * 40} V ${y} H ${x + sx * 40}`} stroke="rgba(255,255,255,0.75)" strokeWidth={3} fill="none" />
            ))}
          </g>
        ) : null}
        {pop(2) && recOn ? <circle cx={118} cy={112} r={14} fill={REC} /> : null}
        {pop(2) ? (
          <text x={144} y={124} fontFamily={FONT_MONO} fontWeight={500} fontSize={34} fill="rgba(242,242,242,0.9)">
            REC
          </text>
        ) : null}
        {pop(3) ? (
          <text x={WIDTH - 290} y={124} textAnchor="end" fontFamily={FONT_MONO} fontWeight={500} fontSize={30} fill="rgba(242,242,242,0.9)">
            TC {tc(global)}
          </text>
        ) : null}
        {pop(4) ? (
          <g transform={`translate(${WIDTH - 250},96)`} opacity={blink ? 1 : 0.15}>
            <rect x={0} y={0} width={70} height={32} rx={4} fill="none" stroke={bat <= 0 ? REC : 'rgba(242,242,242,0.9)'} strokeWidth={3} />
            <rect x={70} y={9} width={6} height={14} fill="rgba(242,242,242,0.9)" />
            {new Array(bars).fill(0).map((_, i) => (
              <rect key={i} x={6 + i * 16} y={6} width={12} height={20} fill={bars <= 1 ? REC : 'rgba(242,242,242,0.9)'} />
            ))}
          </g>
        ) : null}
        {shot.id === 'S16' ? (
          <text x={144} y={176} fontFamily={FONT_MONO} fontSize={26} fill="rgba(242,242,242,0.85)">
            TIME-LAPSE
          </text>
        ) : null}
        {pop(5) && !frozen ? <Bracket x={focus.x + hunt} y={focus.y - hunt * 0.5} w={focus.w - hunt} h={focus.h + hunt * 0.6} /> : null}
        {(lt && frame >= ltStart) || counterLine ? (
          <g transform={`translate(120,${HEIGHT - 250})`}>
            <rect x={-20} y={-54} width={900} height={counterLine && !lt ? 70 : 118} fill="rgba(0,0,0,0.35)" />
            {lt ? (
              <text x={0} y={0} fontFamily={FONT_DISPLAY} fontWeight={600} fontSize={40} letterSpacing={5.6} fill="rgba(242,242,242,0.95)" style={{fontStretch: '88%'}}>
                {typed(lt[0], 0)}
              </text>
            ) : null}
            {lt && lt[1] ? (
              <text x={0} y={44} fontFamily={FONT_MONO} fontSize={26} letterSpacing={2} fill="rgba(242,242,242,0.78)">
                {typed(shot.id === 'S60' && counterLine ? counterLine : lt[1], lt[0].length * 3)}
              </text>
            ) : null}
            {!lt && counterLine ? (
              <text x={0} y={0} fontFamily={FONT_MONO} fontWeight={500} fontSize={30} fill="rgba(242,242,242,0.9)">
                {counterLine}
              </text>
            ) : null}
          </g>
        ) : null}
      </svg>
    </div>
  );
};

/** The letterbox of his film (2.39:1). `open` 0-1 slides the bars off the edges. */
export const Letterbox: React.FC<{open?: number}> = ({open = 0}) => {
  const bar = ((HEIGHT - WIDTH / 2.39) / 2) * (1 - open);
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: bar, background: '#000'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: bar, background: '#000'}} />
    </>
  );
};
