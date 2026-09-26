import type {Tod} from './color';
import type {EyeState, Pose, Role, View} from './figures';

/**
 * When something happens inside a shot:
 * - 'bar.beat' on the song grid ('22.1', '20.4.5'), optionally '+Nf' frames later ('4.1+6f')
 * - '<seconds>s' of song time ('137.4s'), for the epilogue after the music
 * - a number: a fraction of the shot (0 = first frame, 1 = last frame)
 */
export type When = string | number;

export type PenguinKey = {
  at: When;
  x?: number;
  y?: number;
  h?: number;
  view?: View;
  facing?: 1 | -1;
  pose?: Pose;
  headTurn?: number;
};

export type CamKey = {at: When; zoom?: number; x?: number; y?: number; roll?: number};

export type Move = {x?: number; y?: number; at?: [When, When]};

export type SkySpec = Tod | {from: Tod; to: Tod; at: When; over: When} | 'timelapse';

export type El =
  | {k: 'ground'; y: number; marks?: 'sastrugi' | 'none'; scroll?: number; line?: boolean; color?: string}
  | {k: 'mountain'; x: number; y: number; h: number; haze?: number; eyes?: {at: When; state: EyeState}[]; plumes?: When[]; rim?: [When, When]; dark?: boolean; move?: Move; turnAt?: When}
  | {k: 'penguin'; keys: PenguinKey[]; walk?: 'every' | 'half' | 'double'; sing?: boolean; counterRoll?: boolean}
  | {k: 'crew'; x: number; y: number; h: number; role: Role; facing?: 1 | -1; walk?: boolean; sink?: number; look?: 'ahead' | 'up'; move?: Move}
  | {k: 'colony'; x: number; y: number; w: number; ph: number; rows: number; cols: number; hero?: [number, number]; seed?: number; waveAt?: When; turns?: {at: When; until: When; col: number}[]; blur?: number}
  | {k: 'feet'; x: number; y: number; size: number; stepAt?: When}
  | {k: 'print'; x: number; y: number; size: number}
  | {k: 'rect'; x: number; y: number; w: number; h: number; fill: string; opacity?: number; rx?: number; stroke?: string; hatch?: boolean}
  | {k: 'ellipse'; x: number; y: number; rx: number; ry: number; fill: string; opacity?: number}
  | {k: 'poly'; pts: number[][]; fill: string; opacity?: number; stroke?: string; hatch?: boolean; move?: Move}
  | {k: 'footprints'; x1: number; y1: number; x2: number; y2: number; n: number; size: number; color?: string}
  | {k: 'trail'; x1: number; y1: number; x2: number; y2: number; from: When; to: When; width: number}
  | {k: 'sign'; x: number; y: number; w: number; h: number; texts: {at: When; text: string}[]}
  | {k: 'boom'; x: number; y: number; dipAt?: When}
  | {k: 'storm'; density: number; partAt?: When}
  | {k: 'aurora'; foldAt?: When; faint?: boolean}
  | {k: 'streaks'; at: When; frames: number; vertical?: boolean}
  | {k: 'motion'; speed: number}
  | {k: 'glint'; x: number; y: number; at: When; frames: number; r?: number}
  | {k: 'glow'; x: number; y: number; r: number; color: string; from: When; to: When}
  | {k: 'sun'; x: number; y: number; r: number}
  | {k: 'eyes'; x: number; y: number; gap: number; size: number; openAt?: When}
  | {k: 'seal'; x: number; y: number; w: number; h: number; cracks: When[]}
  | {k: 'bigEye'; x: number; y: number; size: number; pupil?: [number, number]; reflection?: boolean}
  | {k: 'ring'; x: number; y: number; at: When}
  | {k: 'breath'; at: When}
  | {k: 'debris'; x: number; y: number; at: When[]; spread?: number; color?: string}
  | {k: 'pip'; x: number; y: number; w: number; h: number; at: When; frames: number; els: El[]}
  | {k: 'camp'; x: number; y: number; s: number}
  | {k: 'group'; els: El[]; move?: Move; clipY?: number; fade?: [When, When]}
  | {k: 'map'}
  | {k: 'endcard'};

export type Phase = {from?: When; sky?: SkySpec; els: El[]; cam?: CamKey[]};

export type Spec = {
  sky?: SkySpec;
  els?: El[];
  cam?: CamKey[];
  /** Shots that cut or dissolve inside themselves (a phase runs until the next one starts). */
  phases?: Phase[];
  dissolveFrames?: number;
  /** DOC: where the focus brackets hunt (defaults to the frame center). */
  focus?: {x: number; y: number; w: number; h: number};
  /** DOC: when the lower third types on (default 12 frames in). */
  lowerThirdAt?: When;
  /** DOC: when the viewfinder glitches. */
  glitchAt?: When;
  /** FULL: when the letterbox slides away. */
  letterboxOutAt?: When;
  /** A camera shake on every downbeat. */
  shakeOnDownbeat?: boolean;
  /** Freeze the picture for the last N frames (the battery dies). */
  freezeLast?: number;
};
