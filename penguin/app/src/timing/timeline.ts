import timeline from '../../../storyboard/timeline.json';

/** The shot list resolved to frames (penguin/storyboard/timeline.json, written by build.py). */

export type Mode = 'CINEMA' | 'DOC' | 'MAP' | 'FULL';
export type ShotBeat = {at: string; do: string; t: number; frame: number};

export type Shot = {
  id: string;
  at: string;
  title: string;
  section: string;
  mode: Mode;
  intensity: number;
  music: string;
  visual: string;
  action: string;
  framing: string;
  move: string;
  out: string;
  purpose: string;
  view: string;
  head: string;
  sing: boolean;
  stage: string;
  tod: string;
  refrain?: string;
  lower_third?: string[];
  counter?: {day: number[]; km: number[]};
  beats?: ShotBeat[];
  start_s: number;
  end_s: number;
  from: number;
  to: number;
  frames: number;
  dur_s: number;
  sung: string[];
};

const data = timeline as unknown as {
  fps: number;
  durationInFrames: number;
  songEndFrame: number;
  shots: Shot[];
};

export const SHOTS = data.shots;
export const TOTAL_FRAMES = data.durationInFrames;

export const shotAt = (frame: number): Shot =>
  SHOTS.find((s) => frame >= s.from && frame < s.to) ?? SHOTS[SHOTS.length - 1];
