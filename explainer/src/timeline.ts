export const FPS = 30;

export type SceneDef = {id: string; title: string; act: 1 | 2 | 3 | 4; dur: number};

/** Single source of truth for scene order and durations (seconds). */
export const SCENES: SceneDef[] = [
  {id: 'S01', title: 'The Pulse', act: 1, dur: 12},
  {id: 'S02', title: 'An Ordinary Day', act: 1, dur: 16},
  {id: 'S03', title: "Something Doesn't Fit", act: 1, dur: 16},
  {id: 'S04', title: 'One Moment, Five Paths', act: 1, dur: 12},
  {id: 'S05', title: 'Fight', act: 1, dur: 10},
  {id: 'S06', title: 'Flight', act: 1, dur: 11},
  {id: 'S07', title: 'Freeze', act: 1, dur: 15},
  {id: 'S08', title: 'Submit', act: 1, dur: 10},
  {id: 'S09', title: 'Posture', act: 1, dur: 13},
  {id: 'S10', title: 'Perceived Strength', act: 1, dur: 17},
  {id: 'S11', title: 'The Flock', act: 2, dur: 16},
  {id: 'S12', title: 'The Wolf', act: 2, dur: 14},
  {id: 'S13', title: 'The Sheepdog', act: 2, dur: 16},
  {id: 'S14', title: 'Same Capability, Different Intent', act: 2, dur: 17},
  {id: 'S15', title: 'Prepared, Not Aggressive', act: 2, dur: 15},
  {id: 'S16', title: 'Back to the Start', act: 3, dur: 7},
  {id: 'S17', title: 'Condition White', act: 3, dur: 22},
  {id: 'S18', title: 'Condition Yellow', act: 3, dur: 21},
  {id: 'S19', title: 'Condition Orange', act: 3, dur: 23},
  {id: 'S20', title: 'Condition Red', act: 3, dur: 27},
  {id: 'S21', title: 'Condition Black', act: 3, dur: 25},
  {id: 'S22', title: 'What Arousal Does', act: 3, dur: 17},
  {id: 'S23', title: 'The Chain', act: 4, dur: 28},
  {id: 'S24', title: 'Calm, But Ready', act: 4, dur: 16},
];

export const sceneStart = (id: string): number => {
  let t = 0;
  for (const s of SCENES) {
    if (s.id === id) return Math.round(t * FPS);
    t += s.dur;
  }
  throw new Error(`Unknown scene ${id}`);
};

export const sceneFrames = (id: string): number => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown scene ${id}`);
  return Math.round(s.dur * FPS);
};

export const TOTAL_FRAMES = Math.round(SCENES.reduce((a, s) => a + s.dur, 0) * FPS);

/** Seconds to frames. */
export const sec = (s: number) => Math.round(s * FPS);
