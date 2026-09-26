export {FONT_DISPLAY, FONT_MONO} from './fonts';

export const W = 1920;
export const H = 1080;
/** 2.39:1 matte bar height at 1080p. */
export const MATTE = 138;

export const C = {
  INK: '#0A0C0F',
  NIGHT: '#11151A',
  SLATE: '#1A2027',
  STEEL: '#2A323B',
  IRON: '#3C4550',
  ASH: '#6E7883',
  MIST: '#A7B0B9',
  STONE: '#CFC6B4',
  BONE: '#E9E4D8',
  PAPER: '#F7F4EE',
  COLD: '#8EA4BA',
  GRAPHITE: '#262D35',
  SUN: '#F2D9A6',
  SHADOW: '#07090B',
} as const;

export type ConditionId = 'white' | 'yellow' | 'orange' | 'red' | 'black';

export type ConditionDef = {
  id: ConditionId;
  label: string;
  color: string;
  bpm: [number, number];
  /** Tempo used to drive the visual heartbeat (midpoint of the range). */
  visualBpm: number;
  state: string;
  effects: string[];
};

export const CONDITIONS: ConditionDef[] = [
  {id: 'white', label: 'Condition White', color: '#F7F4EE', bpm: [60, 80], visualBpm: 70, state: 'Unaware', effects: ['Slower to react', 'More easily surprised']},
  {id: 'yellow', label: 'Condition Yellow', color: '#E6C14A', bpm: [80, 115], visualBpm: 96, state: 'Relaxed alert', effects: ['General awareness', 'Calm, but ready']},
  {id: 'orange', label: 'Condition Orange', color: '#E7863B', bpm: [115, 145], visualBpm: 130, state: 'Specific alert', effects: ['Adrenaline rises', 'Fine motor may begin to decline']},
  {id: 'red', label: 'Condition Red', color: '#D8432F', bpm: [145, 175], visualBpm: 160, state: 'Fight / Flight', effects: ['Gross motor strong', 'Fine motor declines', 'Tunnel vision', 'Auditory exclusion']},
  {id: 'black', label: 'Condition Black', color: '#000000', bpm: [175, 220], visualBpm: 196, state: 'Panic / Breakdown', effects: ['Cognitive overload', 'Freezing or irrational action', 'Catastrophic mistakes']},
];

/** Blend condition color for a continuous level 0 (white) .. 4 (black). */
export const conditionColor = (level: number): string => {
  const l = Math.max(0, Math.min(4, level));
  const i = Math.min(3, Math.floor(l));
  const t = l - i;
  // Black is shown as a dark ember in the heart dot so it stays visible.
  const cols = ['#F7F4EE', '#E6C14A', '#E7863B', '#D8432F', '#3A0C08'];
  return mixHex(cols[i], cols[i + 1], t);
};

export const mixHex = (a: string, b: string, t: number): string => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (p: number, s: number) => (p >> s) & 255;
  const m = (s: number) => Math.round(ch(pa, s) + (ch(pb, s) - ch(pa, s)) * t);
  return `#${((1 << 24) | (m(16) << 16) | (m(8) << 8) | m(0)).toString(16).slice(1)}`;
};
