import React, {useId} from 'react';
import type {SheetPart} from '../art/sheet';
import type {Palette, StyleId} from './palettes';

/**
 * HIM, drawn from the traced model sheet in a given style. Every treatment is computed from the
 * traced shapes and a light direction, so it holds for any pose, size or frame:
 * - form shadow: the silhouette minus itself shifted toward the light (the side turned away)
 * - rim light: the silhouette minus itself shifted away from the light (the lit edge)
 * - flipper tips and tail: the sheet's black-to-navy gradient, over the solid black areas
 */
type Props = {
  part: SheetPart;
  style: StyleId;
  P: Palette;
  /** feet position and height in frame px */
  x: number;
  y: number;
  h: number;
  /** sun position in frame px */
  sun: {x: number; y: number};
  /** cast shadow on the ground: x shift per px of height, y per px of height */
  shadow?: {kx: number; ky: number};
};

export const Character: React.FC<Props> = ({part, style, P, x, y, h, sun, shadow}) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const s = h / part.height;
  const cx = x;
  const cy = y - h * 0.55;
  const len = Math.hypot(sun.x - cx, sun.y - cy) || 1;
  const L = [(sun.x - cx) / len, (sun.y - cy) / len];
  /** an offset of `px` frame pixels toward the light, in sheet units */
  const toward = (px: number) => `translate(${((L[0] * px) / s).toFixed(2)},${((L[1] * px) / s).toFixed(2)})`;
  const away = (px: number) => `translate(${((-L[0] * px) / s).toFixed(2)},${((-L[1] * px) / s).toFixed(2)})`;
  const box = {x: part.left - 40, y: part.top - 40, w: part.width + 80, h: part.height + 80};
  const cover = (fill: string, opacity = 1, extra: React.SVGProps<SVGRectElement> = {}) => (
    <rect x={box.x} y={box.y} width={box.w} height={box.h} fill={fill} opacity={opacity} {...extra} />
  );

  // treatment per style: shadow width, rim width, softness (px, in frame pixels)
  const T = {
    ink: {shade: 34, shadeOp: 0.55, rim: 16, rimOp: 0.32, soft: 6, massRim: 0, massRimColor: '', massRimOp: 0, lineBlur: 0},
    flat: {shade: 34, shadeOp: 1, rim: 16, rimOp: 1, soft: 0, massRim: 12, massRimColor: '#3A4568', massRimOp: 1, lineBlur: 0},
    painterly: {shade: 52, shadeOp: 0.6, rim: 18, rimOp: 0.9, soft: 12, massRim: 14, massRimColor: '#7A6250', massRimOp: 0.55, lineBlur: 0.45},
    anime: {shade: 40, shadeOp: 1, rim: 10, rimOp: 1, soft: 0, massRim: 9, massRimColor: '#5872AE', massRimOp: 1, lineBlur: 0},
  }[style];
  const blurStd = (px: number) => px / s;

  // navy gradient over the solid black: black above mid-body, navy at the flipper tips
  const navyTop = part.top + part.height * 0.46;
  const navyBottom = part.top + part.height * 0.7;
  const hardNavy = style === 'flat' || style === 'anime';

  const shadowT = shadow ? `translate(${x},${y}) matrix(1,0,${shadow.kx},${shadow.ky},0,0) scale(${s})` : '';

  return (
    <g>
      <defs>
        <filter id={`soft${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={blurStd(T.soft)} />
        </filter>
        <filter id={`wash${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency={0.08 * s} numOctaves={3} seed={11} result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale={6 / s} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation={blurStd(1.5)} />
        </filter>
        <filter id={`lb${id}`}>
          <feGaussianBlur stdDeviation={blurStd(T.lineBlur || 0.01)} />
        </filter>
        <filter id={`sh${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={style === 'painterly' ? 5 : style === 'ink' ? 1.5 : 0.01} />
        </filter>
        <mask id={`shade${id}`} maskUnits="userSpaceOnUse" x={box.x} y={box.y} width={box.w} height={box.h}>
          <g filter={T.soft ? `url(#soft${id})` : undefined}>
            <path d={part.fill} fill="white" fillRule="evenodd" />
            <path d={part.fill} fill="black" fillRule="evenodd" transform={toward(T.shade)} />
          </g>
        </mask>
        <mask id={`rim${id}`} maskUnits="userSpaceOnUse" x={box.x} y={box.y} width={box.w} height={box.h}>
          <g filter={T.soft ? `url(#soft${id})` : undefined}>
            <path d={part.fill} fill="white" fillRule="evenodd" />
            <path d={part.fill} fill="black" fillRule="evenodd" transform={away(T.rim)} />
          </g>
        </mask>
        <mask id={`mrim${id}`} maskUnits="userSpaceOnUse" x={box.x} y={box.y} width={box.w} height={box.h}>
          <g filter={style === 'painterly' ? `url(#soft${id})` : undefined}>
            <path d={part.mass} fill="white" fillRule="evenodd" />
            <path d={part.mass} fill="black" fillRule="evenodd" transform={away(T.massRim || 1)} />
          </g>
        </mask>
        <clipPath id={`massc${id}`}>
          <path d={part.mass} fillRule="evenodd" />
        </clipPath>
        <clipPath id={`fillc${id}`}>
          <path d={part.fill} fillRule="evenodd" />
        </clipPath>
        <linearGradient id={`navy${id}`} gradientUnits="userSpaceOnUse" x1={0} y1={navyTop} x2={0} y2={navyBottom}>
          {hardNavy ? (
            <>
              <stop offset="0.55" stopColor={P.navy} stopOpacity={0} />
              <stop offset="0.56" stopColor={P.navy} stopOpacity={1} />
            </>
          ) : (
            <>
              <stop offset="0" stopColor={P.navy} stopOpacity={0} />
              <stop offset="1" stopColor={P.navy} stopOpacity={0.95} />
            </>
          )}
        </linearGradient>
        <linearGradient id={`sheen${id}`} gradientUnits="userSpaceOnUse" x1={part.left} y1={0} x2={part.left + part.width} y2={0}>
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
          <stop offset="0.75" stopColor="#8EA2C4" stopOpacity={0.0} />
          <stop offset="1" stopColor="#8EA2C4" stopOpacity={0.28} />
        </linearGradient>
      </defs>

      {/* cast shadow and contact shadow on the snow */}
      {shadow ? (
        <g opacity={style === 'ink' ? 0.75 : style === 'painterly' ? 0.55 : 1} filter={`url(#sh${id})`}>
          <path d={part.fill} fill={P.castShadow} fillRule="evenodd" transform={shadowT} />
        </g>
      ) : null}
      <ellipse cx={x + 4} cy={y + 3} rx={h * 0.13} ry={h * 0.018} fill={P.castShadow} opacity={style === 'painterly' ? 0.8 : 0.9} filter={style === 'painterly' || style === 'ink' ? `url(#sh${id})` : undefined} />

      <g transform={`translate(${x},${y}) scale(${s})`}>
        {/* paper under the line work */}
        <path d={part.fill} fill={P.white} fillRule="evenodd" />
        {/* form shadow on the side away from the sun, and warm light on the sunlit edge (kept inside him) */}
        <g clipPath={`url(#fillc${id})`}>
          <g mask={`url(#shade${id})`} filter={style === 'ink' ? `url(#wash${id})` : undefined}>
            {cover(P.bodyShade, T.shadeOp)}
          </g>
          <g mask={`url(#rim${id})`} filter={style === 'ink' ? `url(#wash${id})` : undefined}>
            {cover(P.rim, T.rimOp)}
          </g>
        </g>
        {/* the solid black: hood, back, flippers, tail */}
        <path d={part.mass} fill={P.mass} fillRule="evenodd" />
        <g clipPath={`url(#massc${id})`}>
          {cover(`url(#navy${id})`)}
          {style === 'painterly' ? cover(`url(#sheen${id})`) : null}
        </g>
        {T.massRim ? (
          <g clipPath={`url(#massc${id})`}>
            <g mask={`url(#mrim${id})`}>{cover(T.massRimColor, T.massRimOp)}</g>
          </g>
        ) : null}
        {/* the line work */}
        <path d={part.lines} fill={P.lines} fillRule="evenodd" filter={T.lineBlur ? `url(#lb${id})` : undefined} opacity={style === 'painterly' ? 0.92 : 1} />
      </g>
    </g>
  );
};
