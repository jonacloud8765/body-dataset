import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useSheet, type SheetPart} from '../art/sheet';
import {FONT_DISPLAY, FONT_MONO} from '../fonts';
import {FLAT_LOOK, PenguinRig, type RigLook} from './Penguin';
import type {HeadId} from './types';
import {walkPose} from './walk';

/**
 * Character reference in the flat 2D look, laid out like the model sheet: turnaround, the nine
 * heads, the walk's key poses, three degrees of flatness to choose from, and the palette.
 * Everything is the production rig, drawn from the traced sheet.
 */

const BG = '#F3F2EC';
const TEXT = '#23263A';

/** A: flat fills and the sheet's ink line, no shading at all. */
const LOOK_A: RigLook = {...FLAT_LOOK, shade_: {torso: 0, head: 0, leg: 0, foot: 0}};
/** B: A plus one hard shadow tone. */
const LOOK_B: RigLook = FLAT_LOOK;
/** C: flat fills, the line work tinted instead of black. */
const LINE_C = '#5B6386';
const LOOK_C: RigLook = {...LOOK_A, line: LINE_C};

const Label: React.FC<{x: number; y: number; children: React.ReactNode; size?: number; anchor?: 'middle' | 'start'}> = ({x, y, children, size = 20, anchor = 'middle'}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT_MONO} fontSize={size} fill={TEXT}>
    {children}
  </text>
);

const Heading: React.FC<{x: number; y: number; children: React.ReactNode}> = ({x, y, children}) => (
  <text x={x} y={y} fontFamily={FONT_DISPLAY} fontWeight={800} fontSize={24} letterSpacing={1.5} fill={TEXT}>
    {children}
  </text>
);

/** A traced drawing (a head or a whole pose) scaled to a height, feet/neck at (x, y). */
const Traced: React.FC<{part: SheetPart; x: number; y: number; h: number; look: RigLook; lineColor?: string}> = ({part, x, y, h, look, lineColor}) => (
  <g transform={`translate(${x} ${y}) scale(${h / part.height})`}>
    <path d={part.fill} fill={look.white} fillRule="evenodd" />
    <path d={part.mass} fill={look.ink} fillRule="evenodd" />
    <path d={part.lines} fill={lineColor ?? look.ink} fillRule="evenodd" />
  </g>
);

export const CharacterRef: React.FC = () => {
  const sheet = useSheet();
  if (!sheet) return <AbsoluteFill style={{background: BG}} />;
  const b34 = sheet.bodies['34'];
  const bfr = sheet.bodies.front;
  const heads: HeadId[] = ['frown', 'sideeye', 'smirk', 'annoyed', 'profile', 'laugh', 'sad', 'surprised', 'angry'];
  const walkKeys = [
    {label: 'contact', beat: 0},
    {label: 'down', beat: 0.16},
    {label: 'passing', beat: 0.5},
    {label: 'up', beat: 0.68},
  ];
  const H1 = 430;
  const feet1 = 560;
  const H2 = 300;
  const feet2 = 1010;
  const swatches: [string, string][] = [
    ['paper white', LOOK_A.white],
    ['ink', LOOK_A.ink],
    ['flipper navy', LOOK_A.navy],
    ['shadow tone', FLAT_LOOK.shade],
    ['soft line (C)', LINE_C],
  ];
  return (
    <AbsoluteFill style={{background: BG}}>
      <svg width={1920} height={1080}>
        <text x={40} y={62} fontFamily={FONT_DISPLAY} fontWeight={900} fontSize={46} fill={TEXT}>
          HIM
        </text>
        <text x={150} y={48} fontFamily={FONT_DISPLAY} fontWeight={600} fontSize={22} fill={TEXT}>
          flat 2D reference
        </text>
        <text x={150} y={72} fontFamily={FONT_MONO} fontSize={16} fill="#555A70">
          drawn from your model sheet (traced line for line), flat fills, no gradients
        </text>
        <line x1={40} y1={88} x2={1880} y2={88} stroke={TEXT} strokeWidth={2} />

        {/* turnaround */}
        <Heading x={40} y={124}>
          TURNAROUND
        </Heading>
        <line x1={40} y1={feet1 + 2} x2={900} y2={feet1 + 2} stroke="#C9CCD8" strokeWidth={2} />
        <PenguinRig body={bfr} bodyId="front" heads={sheet.heads} head="own" x={140} y={feet1} h={H1} look={LOOK_A} />
        <PenguinRig body={b34} bodyId="34" heads={sheet.heads} head="own" x={360} y={feet1} h={H1} look={LOOK_A} />
        <PenguinRig body={b34} bodyId="34" heads={sheet.heads} head="profile" x={580} y={feet1} h={H1} look={LOOK_A} />
        <Traced part={sheet.poses['back.static']} x={810} y={feet1} h={H1 * 0.72} look={LOOK_A} />
        {['front', 'three-quarter', 'side', 'back'].map((l, i) => (
          <Label key={l} x={140 + i * 220} y={feet1 + 34}>
            {l}
          </Label>
        ))}

        {/* expressions */}
        <Heading x={960} y={124}>
          EXPRESSIONS
        </Heading>
        {heads.map((hd, i) => {
          const col = i < 5 ? i : i - 5;
          const row = i < 5 ? 0 : 1;
          const x = 1020 + col * 180 + (row ? 90 : 0);
          const y = 330 + row * 230;
          return (
            <g key={hd}>
              <Traced part={sheet.heads[hd]} x={x} y={y} h={170} look={LOOK_A} />
              <Label x={x} y={y + 26}>
                {hd}
              </Label>
            </g>
          );
        })}

        {/* walk */}
        <Heading x={40} y={640}>
          WALK · one step per beat
        </Heading>
        <line x1={40} y1={feet2 + 2} x2={900} y2={feet2 + 2} stroke="#C9CCD8" strokeWidth={2} />
        {walkKeys.map((k, i) => (
          <g key={k.label}>
            <PenguinRig body={b34} bodyId="34" heads={sheet.heads} head="profile" pose={walkPose(b34, '34', k.beat)} x={150 + i * 215} y={feet2} h={H2} look={LOOK_A} />
            <Label x={150 + i * 215} y={feet2 + 32}>
              {k.label}
            </Label>
          </g>
        ))}

        {/* degrees of flatness */}
        <Heading x={960} y={640}>
          HOW FLAT
        </Heading>
        <PenguinRig body={b34} bodyId="34" heads={sheet.heads} head="own" x={1035} y={feet2} h={H2} look={LOOK_A} />
        <PenguinRig body={b34} bodyId="34" heads={sheet.heads} head="own" x={1245} y={feet2} h={H2} look={LOOK_B} light={[0.95, -0.3]} />
        <g>
          <PenguinRig body={b34} bodyId="34" heads={sheet.heads} head="own" x={1450} y={feet2} h={H2} look={LOOK_C} />
        </g>
        <Label x={1035} y={feet2 + 32}>
          A · ink line
        </Label>
        <Label x={1245} y={feet2 + 32}>
          B · + shadow
        </Label>
        <Label x={1450} y={feet2 + 32}>
          C · soft line
        </Label>

        {/* palette */}
        <Heading x={1600} y={640}>
          PALETTE
        </Heading>
        {swatches.map(([name, c], i) => (
          <g key={name} transform={`translate(1600 ${670 + i * 68})`}>
            <rect width={56} height={48} rx={6} fill={c} stroke="#B9BCC8" strokeWidth={1.5} />
            <text x={72} y={20} fontFamily={FONT_MONO} fontSize={17} fill={TEXT}>
              {name}
            </text>
            <text x={72} y={42} fontFamily={FONT_MONO} fontSize={15} fill="#6B7086">
              {c}
            </text>
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
