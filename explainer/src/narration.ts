/**
 * Narration / VO script: the single source of truth for
 * - the burned-in captions (showCaptions prop), rendered by <NarrationTrack/> in Film.tsx
 * - the VO cue sheet, ElevenLabs script and .srt (npm run vo → docs/explainer/vo/)
 *
 * Times are scene-relative seconds (a = VO in / caption on, b = latest end).
 * A cue may run past its scene's end. Retiming a scene in timeline.ts moves its cues.
 * `onScreen: true` = the words already appear as on-screen type, so the line is voiced but not captioned.
 * Lines are written to fit their window at ~144 wpm (2.4 words/s), a calm narration pace.
 */
export type Cue = {id: string; scene: string; a: number; b: number; text: string; onScreen?: boolean};

export const NARRATION: Cue[] = [
  // ACT I · THE MOMENT (S01 is heartbeat only)
  {id: 'N01', scene: 'S02', a: 1.0, b: 6.5, text: 'Most days are ordinary.'},
  {id: 'N02', scene: 'S02', a: 7.5, b: 14.5, text: 'Nothing happens. Nothing needs to.'},
  {id: 'N03', scene: 'S03', a: 2.5, b: 8.5, text: "Then, sometimes, something doesn't fit."},
  {id: 'N04', scene: 'S03', a: 9.5, b: 15.6, text: 'When a threat appears, a person has to respond.'},
  {id: 'N05', scene: 'S04', a: 1.2, b: 4.2, text: 'Time stops. One moment, one threat.'},
  {id: 'N06', scene: 'S04', a: 4.4, b: 11.6, text: 'Broadly, there are five ways a response can go.'},
  {id: 'N07', scene: 'S05', a: 1.0, b: 7.8, text: 'Fight: move toward the threat and confront it. It can work, when trained and appropriate.'},
  {id: 'N08', scene: 'S06', a: 1.0, b: 8.8, text: 'Flight: move away and increase the distance, when escape is possible.'},
  {id: 'N09', scene: 'S07', a: 0.8, b: 5.2, text: 'Freeze: the body stops, while the world keeps moving.'},
  {id: 'N10', scene: 'S07', a: 5.4, b: 9.0, text: 'Sometimes stillness hides you, or buys time.'},
  {id: 'N11', scene: 'S07', a: 9.2, b: 14.4, text: 'Held too long, the opening closes. It can follow sensory overload.'},
  {id: 'N12', scene: 'S08', a: 1.0, b: 7.8, text: 'Submit: lower, yield, hand control to the threat.'},
  {id: 'N13', scene: 'S09', a: 1.0, b: 6.8, text: 'Posture: look bigger, sound firm, show resistance.'},
  {id: 'N14', scene: 'S09', a: 7.0, b: 12.6, text: 'In people and animals alike, it can stop violence before it starts.'},
  {id: 'N15', scene: 'S10', a: 0.8, b: 6.4, text: 'The appearance of strength is as important, in many cases, as strength itself.', onScreen: true},
  {id: 'N16', scene: 'S10', a: 6.5, b: 9.6, text: 'A threat reacts to what it perceives.'},
  {id: 'N17', scene: 'S10', a: 9.7, b: 11.6, text: 'Animals do it too.'},
  {id: 'N18', scene: 'S10', a: 12.0, b: 16.8, text: 'Signals like this are how we read each other.'},

  // ACT II · THE ROLES
  {id: 'N19', scene: 'S11', a: 0.6, b: 5.8, text: 'One metaphor describes people by how they relate to violence.'},
  {id: 'N20', scene: 'S11', a: 6.2, b: 11.0, text: 'Sheep: ordinary people who live peacefully and avoid violence.'},
  {id: 'N21', scene: 'S11', a: 11.2, b: 15.8, text: "Many are uncomfortable even thinking about it, and that's normal."},
  {id: 'N22', scene: 'S12', a: 1.0, b: 6.6, text: 'Wolves: people who use violence against others.'},
  {id: 'N23', scene: 'S12', a: 6.8, b: 13.6, text: 'For gain, for power, or out of cruelty. Criminals, terrorists, predators.'},
  {id: 'N24', scene: 'S13', a: 0.8, b: 5.8, text: 'Someone on the bench stands up. Nothing about them looks different.'},
  {id: 'N25', scene: 'S13', a: 6.0, b: 11.0, text: 'Sheepdogs: protectors, willing to confront violence to defend others.'},
  {id: 'N26', scene: 'S13', a: 11.2, b: 15.8, text: 'Soldiers, police officers, and others willing to step in.'},
  {id: 'N27', scene: 'S14', a: 0.8, b: 5.2, text: 'Wolf and sheepdog can both use force.'},
  {id: 'N28', scene: 'S14', a: 5.4, b: 10.4, text: 'What differs is intent: one preys, the other protects.'},
  {id: 'N29', scene: 'S14', a: 10.6, b: 16.6, text: 'And control: the sheepdog is expected to use force responsibly.'},
  {id: 'N30', scene: 'S15', a: 0.8, b: 4.8, text: "Most days, the sheepdog's life looks like everyone else's."},
  {id: 'N31', scene: 'S15', a: 5.2, b: 9.2, text: 'The difference is readiness, not aggression.'},
  {id: 'N32', scene: 'S15', a: 9.8, b: 13.8, text: "It's a metaphor, not a scientific classification of people."},
  {id: 'N33', scene: 'S15', a: 14.0, b: 18.0, text: 'Calm, but ready is a state, and states change.'},

  // ACT III · THE LADDER
  {id: 'N34', scene: 'S16', a: 3.2, b: 6.9, text: 'Back to the start. Now, from the inside.'},
  {id: 'N35', scene: 'S17', a: 1.0, b: 6.2, text: 'Condition White: relaxed, unaware, attention somewhere else.'},
  {id: 'N36', scene: 'S17', a: 6.6, b: 11.6, text: 'Here is what you missed the first time.'},
  {id: 'N37', scene: 'S17', a: 12.2, b: 17.2, text: 'When something happens, it takes longer to notice and to react.'},
  {id: 'N38', scene: 'S17', a: 17.6, b: 21.6, text: "The problem isn't fear. It's attention."},
  {id: 'N39', scene: 'S18', a: 0.8, b: 5.2, text: 'Condition Yellow: relaxed alert. Head up, phone away.'},
  {id: 'N40', scene: 'S18', a: 5.6, b: 9.8, text: "Nothing is wrong. You simply notice what's around you."},
  {id: 'N41', scene: 'S18', a: 10.2, b: 13.2, text: 'Calm, but ready.', onScreen: true},
  {id: 'N42', scene: 'S18', a: 14.2, b: 20.4, text: 'When something happens, you see it sooner and respond sooner.'},
  {id: 'N43', scene: 'S19', a: 0.8, b: 6.2, text: 'Condition Orange begins when a specific possible threat appears.'},
  {id: 'N44', scene: 'S19', a: 6.6, b: 11.6, text: 'Attention narrows onto it. Everything else becomes less important.'},
  {id: 'N45', scene: 'S19', a: 12.0, b: 17.0, text: 'Adrenaline rises. The heart speeds up.'},
  {id: 'N46', scene: 'S19', a: 17.2, b: 22.6, text: 'And precise tasks start to get harder.'},
  {id: 'N47', scene: 'S20', a: 0.6, b: 5.2, text: 'Condition Red: the threat is immediate. The action phase.'},
  {id: 'N48', scene: 'S20', a: 5.6, b: 10.2, text: 'Big movements stay strong. Precise ones fall apart.'},
  {id: 'N49', scene: 'S20', a: 10.6, b: 14.8, text: 'Complex thinking can decline too.'},
  {id: 'N50', scene: 'S20', a: 15.4, b: 21.0, text: 'Someone shouts, “This way!” The voice, and the exit, may never register.'},
  {id: 'N51', scene: 'S20', a: 21.4, b: 26.8, text: 'Options narrow to fight or flight. Effects vary from person to person.'},
  {id: 'N52', scene: 'S21', a: 0.6, b: 4.8, text: 'Condition Black: the system overloads.'},
  {id: 'N53', scene: 'S21', a: 5.2, b: 8.6, text: 'Signals overlap. Nothing forms a clear picture.'},
  {id: 'N54', scene: 'S21', a: 9.0, b: 13.0, text: 'Action becomes erratic, or stops altogether.'},
  {id: 'N55', scene: 'S21', a: 13.4, b: 17.8, text: 'Freeze: the same response from the start.'},
  {id: 'N56', scene: 'S21', a: 18.2, b: 24.6, text: "Extreme arousal doesn't make you more ready. It can take decisions away."},
  {id: 'N57', scene: 'S22', a: 1.0, b: 8.6, text: 'Arousal shapes what you notice, what your body can do, and how you decide.'},
  {id: 'N58', scene: 'S22', a: 10.8, b: 16.4, text: 'These ranges are approximate, and they differ from person to person.'},

  // ACT IV · CONTROL
  {id: 'N59', scene: 'S23', a: 0.8, b: 6.4, text: 'Put it together: threat, awareness, arousal, condition, response, decision.'},
  {id: 'N60', scene: 'S23', a: 6.8, b: 13.0, text: "Notice late, and there's less time to respond, and fewer options."},
  {id: 'N61', scene: 'S23', a: 13.4, b: 20.4, text: "Notice early, and there's time: time to stay in control, and to choose."},
  {id: 'N62', scene: 'S23', a: 20.8, b: 26.6, text: 'Preparedness is not aggression. It keeps the decision in your hands.', onScreen: true},
  {id: 'N63', scene: 'S24', a: 1.0, b: 3.6, text: 'Recognize early.', onScreen: true},
  {id: 'N64', scene: 'S24', a: 3.8, b: 6.4, text: 'Know your options.', onScreen: true},
  {id: 'N65', scene: 'S24', a: 6.6, b: 10.4, text: 'Keep control.', onScreen: true},
  {id: 'N66', scene: 'S24', a: 11.4, b: 14.8, text: 'Calm, but ready.', onScreen: true},
];

/** Planning pace for fit checks (words per second). */
export const WORDS_PER_SECOND = 2.4;
