import React from 'react';
import {C, FONT_DISPLAY, FONT_MONO} from '../theme';
import {EASE_OUT, clamp, lerp, p} from '../lib/anim';

export type Behavior = 'default' | 'fight' | 'flight' | 'freeze' | 'posture' | 'submit';

type LabelProps = {
  text: string;
  /** Seconds since the label started entering. */
  t: number;
  x: number;
  y: number;
  size?: number;
  align?: 'left' | 'center' | 'right';
  behavior?: Behavior;
  color?: string;
  /** 0..1 exit progress. */
  out?: number;
  weight?: number;
};

/** Concept label whose motion demonstrates its meaning. */
export const Label: React.FC<LabelProps> = ({text, t, x, y, size = 96, align = 'center', behavior = 'default', color = C.BONE, out = 0, weight = 620}) => {
  if (t < 0) return null;
  const a = p(t, 0, 0.7, EASE_OUT);
  let tracking = lerp(0.42, 0.12, a);
  let scale = 1;
  let wdth = 100;
  let wght = weight;
  let dy = 0;
  let opacity = clamp(t / 0.35);
  if (behavior === 'fight') {
    scale = lerp(0.86, 1.04, p(t, 0, 0.45, EASE_OUT));
  } else if (behavior === 'flight') {
    tracking = lerp(0.12, 0.46, p(t, 0.4, 2.4));
    scale = lerp(1, 0.9, p(t, 0.4, 2.4));
    opacity = clamp(t / 0.35) * lerp(1, 0.75, p(t, 0.4, 2.4));
  } else if (behavior === 'freeze') {
    tracking = lerp(0.42, 0.12, Math.min(0.7, a));
  } else if (behavior === 'posture') {
    const g = p(t, 0.2, 1.4, EASE_OUT);
    wdth = lerp(75, 125, g);
    wght = lerp(480, 780, g);
    scale = lerp(0.96, 1.06, g);
  } else if (behavior === 'submit') {
    const g = p(t, 0.3, 1.6);
    wdth = lerp(100, 66, g);
    wght = lerp(620, 380, g);
    dy = lerp(0, 14, g);
    opacity = clamp(t / 0.35) * lerp(1, 0.8, g);
  }
  opacity *= 1 - out;
  const tx = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0%';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + dy,
        transform: `translate(${tx}, -50%) scale(${scale})`,
        transformOrigin: align === 'left' ? 'left center' : align === 'right' ? 'right center' : 'center center',
        fontFamily: FONT_DISPLAY,
        fontSize: size,
        fontVariationSettings: `'wdth' ${wdth.toFixed(1)}, 'wght' ${wght.toFixed(0)}`,
        letterSpacing: `${tracking}em`,
        color,
        opacity,
        whiteSpace: 'nowrap',
        textTransform: 'uppercase',
        lineHeight: 1,
      }}
    >
      {text}
    </div>
  );
};

/** Short secondary tag (sentence case). */
export const Tag: React.FC<{text: string; t: number; x: number; y: number; align?: 'left' | 'center' | 'right'; out?: number; size?: number; color?: string; dot?: string}> = ({text, t, x, y, align = 'center', out = 0, size = 30, color = C.MIST, dot}) => {
  if (t < 0) return null;
  const a = p(t, 0, 0.6, EASE_OUT);
  const tx = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0%';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${tx}, calc(-50% + ${lerp(14, 0, a)}px))`,
        fontFamily: FONT_DISPLAY,
        fontSize: size,
        fontVariationSettings: "'wght' 470, 'wdth' 100",
        color,
        opacity: a * (1 - out),
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {dot ? <span style={{width: 10, height: 10, borderRadius: 5, background: dot, display: 'inline-block'}} /> : null}
      {text}
    </div>
  );
};

/** Restrained caveat / footnote line in mono. */
export const Caveat: React.FC<{text: string; t: number; x?: number; y?: number; out?: number; align?: 'left' | 'center' | 'right'}> = ({text, t, x = 64, y = 1040, out = 0, align = 'left'}) => {
  if (t < 0) return null;
  const tx = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0%';
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(${tx}, -50%)`, fontFamily: FONT_MONO, fontSize: 20, color: C.MIST, opacity: 0.8 * clamp(t / 0.6) * (1 - out), whiteSpace: 'nowrap', letterSpacing: '0.02em'}}>
      {text}
    </div>
  );
};

/** Act slate in the top matte bar. */
export const Slate: React.FC<{text: string; t: number; out?: number; y?: number}> = ({text, t, out = 0, y = 69}) => {
  if (t < 0) return null;
  const a = p(t, 0, 0.9, EASE_OUT);
  return (
    <div style={{position: 'absolute', left: '50%', top: y, transform: 'translate(-50%, -50%)', fontFamily: FONT_DISPLAY, fontSize: 26, letterSpacing: `${lerp(0.6, 0.34, a)}em`, fontVariationSettings: "'wght' 500", color: C.MIST, opacity: a * (1 - out), whiteSpace: 'nowrap'}}>
      {text}
    </div>
  );
};

/** Condition name + bpm range for the upper instrument bar. */
export const ConditionReadout: React.FC<{name: string; state: string; bpm: string; color: string; t: number; out?: number}> = ({name, state, bpm, color, t, out = 0}) => {
  if (t < 0) return null;
  const a = p(t, 0, 0.7, EASE_OUT) * (1 - out);
  return (
    <div style={{position: 'absolute', left: 64, top: 69, transform: `translateY(-50%) translateX(${lerp(-20, 0, a)}px)`, display: 'flex', alignItems: 'center', gap: 22, opacity: a, whiteSpace: 'nowrap'}}>
      <span style={{width: 18, height: 18, borderRadius: 9, background: color === '#000000' ? '#000' : color, border: `2px solid ${color === '#000000' ? C.PAPER : color}`}} />
      <span style={{fontFamily: FONT_DISPLAY, fontSize: 34, letterSpacing: '0.14em', color: C.BONE, fontVariationSettings: "'wght' 620"}}>{name.toUpperCase()}</span>
      <span style={{fontFamily: FONT_DISPLAY, fontSize: 28, color: C.MIST, fontVariationSettings: "'wght' 450"}}>{state}</span>
      <span style={{fontFamily: FONT_MONO, fontSize: 22, color: C.MIST}}>{bpm}</span>
    </div>
  );
};
