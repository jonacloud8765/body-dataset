import envelope from '../../../analysis/vocal-envelope.json';
import {FPS, LINES} from './song';

/** Per-frame vocal level and syllable pulse from the vocal stem (analysis/vocal_envelope.py). */

const E = envelope as unknown as {fps: number; frames: number; values: number[]; pulse: number[]};

export const vocalLevel = (frame: number) => E.values[frame] ?? 0;
export const vocalPulse = (frame: number) => E.pulse[frame] ?? 0;

const sungAt = (t: number) =>
  LINES.some((l) => !l.text.startsWith('(') && t >= l.start.t - 0.05 && t < l.end.t + 0.1);

/**
 * Beak opening, 0-1. Only inside sung lines (the stem's reverb never closes on its own),
 * shaped by the syllable pulse, with a 1-frame lead so the beak opens just before the sound.
 */
export const beakOpen = (frame: number) => {
  const lead = frame + 1;
  if (!sungAt(lead / FPS)) {
    return 0;
  }
  const level = Math.max(0, Math.min(1, (vocalLevel(lead) - 0.3) / 0.7));
  return level * (0.35 + 0.65 * vocalPulse(lead));
};
