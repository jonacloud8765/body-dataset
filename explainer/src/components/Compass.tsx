import React from 'react';
import {C, FONT_DISPLAY} from '../theme';
import {clamp} from '../lib/anim';

export type ResponseId = 'fight' | 'flight' | 'freeze' | 'posture' | 'submit';

export const RESPONSES: {id: ResponseId; label: string; dir: [number, number]; line: string}[] = [
  {id: 'fight', label: 'Fight', dir: [1, 0], line: 'Toward the threat'},
  {id: 'flight', label: 'Flight', dir: [-1, 0], line: 'Away from the threat'},
  {id: 'freeze', label: 'Freeze', dir: [0, 0], line: 'No movement'},
  {id: 'posture', label: 'Posture', dir: [0, -1], line: 'Expand, signal strength'},
  {id: 'submit', label: 'Submit', dir: [0, 1], line: 'Lower, yield control'},
];

type CompassProps = {
  x: number;
  y: number;
  /** Arm draw progress per response 0..1. */
  draw: Partial<Record<ResponseId, number>>;
  /** Brightness per response 0..1 (dim = available but not active). */
  lit?: Partial<Record<ResponseId, number>>;
  rx?: number;
  ry?: number;
  labels?: boolean;
  labelOpacity?: number;
  color?: string;
  litColor?: string;
  /** 0..1 scramble for Condition Black. */
  scramble?: number;
  seedT?: number;
  opacity?: number;
};

/** Five responses mapped to five directions of the body. */
export const ResponseCompass: React.FC<CompassProps> = ({x, y, draw, lit = {}, rx = 270, ry = 190, labels = true, labelOpacity = 1, color = C.ASH, litColor = C.BONE, scramble = 0, seedT = 0, opacity = 1}) => {
  return (
    <g opacity={opacity}>
      {RESPONSES.map((r, i) => {
        const d = clamp(draw[r.id] ?? 0);
        if (d <= 0) return null;
        const l = clamp(lit[r.id] ?? 0.35);
        const col = l > 0.5 ? litColor : color;
        const rot = scramble ? Math.sin(seedT * (2.3 + i) + i * 2) * 70 * scramble : 0;
        if (r.id === 'freeze') {
          return (
            <g key={r.id} opacity={d}>
              <circle cx={x} cy={y} r={11 + 5 * l} fill="none" stroke={col} strokeWidth={2.5} opacity={0.4 + 0.6 * l} />
              <circle cx={x} cy={y} r={4} fill={col} opacity={0.4 + 0.6 * l} />
              {labels ? (
                <text x={x + 26} y={y + 46} fill={col} opacity={labelOpacity * (0.45 + 0.55 * l)} style={{fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: '0.2em', fontVariationSettings: "'wght' 600"}}>
                  FREEZE
                </text>
              ) : null}
            </g>
          );
        }
        const len = (r.dir[0] !== 0 ? rx : ry) * d;
        const x0 = x + r.dir[0] * 30;
        const y0 = y + r.dir[1] * 30;
        const x1 = x + r.dir[0] * (30 + len);
        const y1 = y + r.dir[1] * (30 + len);
        const ang = (Math.atan2(r.dir[1], r.dir[0]) * 180) / Math.PI;
        const lx = x + r.dir[0] * (rx + 44);
        const ly = y + r.dir[1] * (ry + 58);
        const anchorSide = r.dir[0] > 0 ? 'start' : r.dir[0] < 0 ? 'end' : 'middle';
        return (
          <g key={r.id} transform={`rotate(${rot} ${x} ${y})`} opacity={0.4 + 0.6 * l}>
            <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={col} strokeWidth={2 + l * 1.5} strokeLinecap="round" />
            <path d="M -14 -9 L 0 0 L -14 9" transform={`translate(${x1} ${y1}) rotate(${ang})`} stroke={col} strokeWidth={2 + l * 1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {labels && d > 0.95 ? (
              <text x={lx} y={ly + 8} textAnchor={anchorSide} fill={col} opacity={labelOpacity} style={{fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: '0.2em', fontVariationSettings: "'wght' 600"}}>
                {r.label.toUpperCase()}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};
