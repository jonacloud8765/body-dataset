import {beatEnvelope, kf, makeBeatClock} from './lib/anim';
import {FPS, TOTAL_FRAMES, sceneStart} from './timeline';

/** Absolute start (seconds) of a scene. */
export const S = (id: string) => sceneStart(id) / FPS;

/** Protagonist heart rate (visual tempo) over absolute time T in seconds. */
export const bpmAt = (T: number) =>
  kf(T, [
    [0, 70],
    [S('S03') + 6, 70],
    [S('S04'), 110],
    [S('S04') + 1.5, 118],
    [S('S10') + 12, 118],
    [S('S11') + 3, 82],
    [S('S16'), 82],
    [S('S16') + 5, 70],
    [S('S18') + 4, 70],
    [S('S18') + 9, 96],
    [S('S19') + 3, 96],
    [S('S19') + 14, 130],
    [S('S20') + 1, 130],
    [S('S20') + 6, 160],
    [S('S21') + 1, 160],
    [S('S21') + 9, 196],
    [S('S22') + 1, 196],
    [S('S22') + 12, 92],
    [S('S24') + 16, 92],
  ]);

/** Continuous condition level 0 (white) .. 4 (black) used for heart color and the rail. */
export const levelAt = (T: number) =>
  kf(T, [
    [0, 0],
    [S('S03') + 6, 0],
    [S('S04'), 1.7],
    [S('S04') + 1.5, 1.9],
    [S('S10') + 12, 1.9],
    [S('S11') + 3, 1],
    [S('S16'), 1],
    [S('S16') + 5, 0],
    [S('S18') + 4, 0],
    [S('S18') + 9, 1],
    [S('S19') + 3, 1],
    [S('S19') + 14, 2],
    [S('S20') + 1, 2],
    [S('S20') + 6, 3],
    [S('S21') + 1, 3],
    [S('S21') + 9, 4],
    [S('S22') + 1, 4],
    [S('S22') + 12, 1],
    [S('S24') + 16, 1],
  ]);

export const beatsAt = makeBeatClock(bpmAt, TOTAL_FRAMES / FPS + 1);
export const pulseAt = (T: number) => beatEnvelope(beatsAt(T));
