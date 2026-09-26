# CALM, BUT READY
### Pre-production document: animated explainer on threat response, roles, and arousal

**Status:** Pre-production v1.0 (creative lock, ready for animatic)
**Format:** 1920×1080, 16:9 canvas, 30 fps
**Runtime:** 6:36 (396 s, 11,880 frames)
**Implementation target:** Remotion (see §13, *Remotion Production Blueprint*)

> **Logline.** One ordinary afternoon, one person, one moment of threat, seen through three lenses: *what a person can do* (five responses), *the roles people play* (sheep, wolf, sheepdog), and *the state a person is in* (Conditions White to Black). The film argues that preparedness is not aggression. Its point is staying calm enough to still be able to choose.

**How to read this document**
- §1–§12 are creative decisions. §13 is the implementation handoff.
- Names in `code style` (such as `HeartDot` and `ConditionRail`) are reusable visual systems. They are defined in §7 and specified for implementation in §13.
- Absolute times use `m:ss`. Beats inside a scene use scene-relative seconds (`+4.5s`).
- "Protagonist" means the one recurring human figure. "The Other" means the threat figure.

**Contents**
1. Creative direction (including the full visual identity)
2. Narrative structure
3. Scene-by-scene storyboard (S01–S24)
4. Visual treatment: the five threat responses
5. Visual treatment: sheep, wolf, sheepdog
6. Visual treatment: Conditions White through Black
7. Visual continuity system
8. Transition system
9. Information hierarchy
10. Timing and runtime
11. Sound design direction
12. Scientific and conceptual caveats
13. REMOTION PRODUCTION BLUEPRINT

**The film at a glance**

| Act | Title | Scenes | Time | Duration | Lens |
|---|---|---|---|---|---|
| I | The Moment | S01–S10 | 0:00–2:12 | 132 s | What can a person do? |
| II | The Roles | S11–S15 | 2:12–3:30 | 78 s | Who is in the encounter, and why? |
| III | The Ladder | S16–S22 | 3:30–5:52 | 142 s | What state is the person in? |
| IV | Control | S23–S24 | 5:52–6:36 | 44 s | How it all connects |

---

## 1. Creative direction

### 1.1 The idea

**One place, one person, one moment, understood three ways.**

The film is one continuous piece of choreography. It is set in a single location, a stone-walled city plaza in late-afternoon light, and follows a single person. Nothing in it is a slide. Every diagram grows out of something physical in the world, such as a shadow, a path on the ground, or a heartbeat, and goes back into the world when it has done its job.

The film's structure depends on a **rewind**. Act I stops time at the moment a threat appears and branches it into five possible futures. Act III rewinds the whole afternoon to its first frame and replays the same encounter from inside the protagonist's body and perception. The viewer sees the same event twice: first as *options*, then as *states*. The final synthesis shows that the two are linked. The state you are in decides which options you can still see.

### 1.2 Tone

Serious, humane, unhurried. The restraint of a documentary, closer to a museum installation or a well-made public-health film than a tactical training video. The emotional temperature stays calm. Tension comes from **stillness, timing, and sound**, never from injury, weapons, or spectacle.

- **Direct toward:** quiet, precise, humane, controlled, observant.
- **Avoid:** tactical, militaristic, heroic, fearful, gamified, "hero shot" framing.
- **Never shown:** blood, impacts on bodies, weapons, muzzle flashes, explosions, uniforms, badges, flags, or tactical gear.

### 1.3 The core visual grammar: five signals and two diagrams

The whole film is built from a small vocabulary. Every element of the final synthesis has already appeared in the film at least twice.

| Signal | What it looks like | What it means | Introduced | Pays off |
|---|---|---|---|---|
| `HeartDot` | A small point of light at the protagonist's sternum that pulses with the heartbeat | Internal arousal. Color = condition. Pulse rate = heart rate. | S01 | Condition Rail (Act III); AROUSAL node (S23) |
| `AttentionField` | A soft, translucent cone or ring projected from the head | What the person currently perceives | S04 (hint); fully revealed in S17 | Conditions White–Black; AWARENESS node |
| `GroundRing` | A thin ellipse on the ground around the feet | Personal space, or who controls the encounter | S04 | The five responses; the sheepdog's control; RESPONSE node |
| `IntentWedge` | A small sharp chevron floating just ahead of a figure's head, pointing where its intent points | Direction of intent | S03 (the Other) | Wolf's eye (inward) and sheepdog's chevron (outward); THREAT node |
| `WallShadow` | The figure's shadow projected on the plaza wall | Perceived presence, or role | S02 (planted) | Posture; the entire metaphor act; the caveat |

Two diagrams are built only from those signals:

- **`ResponseCompass`**: the five responses mapped to five directions of the body. Toward = FIGHT, away = FLIGHT, no movement = FREEZE, up and out = POSTURE, down = SUBMIT.
- **`ConditionRail`**: the heartbeat line from the first shot, with five stops along it (White, Yellow, Orange, Red, Black).

**Rule for the synthesis:** no new visual element may appear in S23. The final chain is assembled from the seven elements above.

### 1.4 Design principles

1. **Demonstrate, then name.** The behavior happens first and the label follows it. A label never arrives before the viewer has already understood the idea from the motion. Standard label lag is 0.5–1.0 s after the key action.
2. **One world, two modes.** In **WORLD mode**, figures, light, and space appear inside a 2.39:1 cinematic matte. In **DIAGRAM mode**, the frame opens to full 16:9 and the view is flat and top-down. The film moves between modes by physically tilting the ground plane toward the viewer, never by cutting to a slide.
3. **Behavior, not appearance.** The Other is identifiable only by movement: walking against the flow, keeping a fixed focus, closing distance. Every figure in the film uses the same body. Nobody is marked out by clothing, skin tone, face, or build.
4. **Warm is inside, cold is outside.** Warm signal colors (yellow, orange, red) only ever show the protagonist's *internal* state. External intent is always cold steel. Color is never used as decoration.
5. **Qualified language on screen.** Effects "may" or "can" occur. Heart rates are always shown as approximate ranges. See §12.

### 1.5 The world: "The Plaza"

A single, stylized side-on location with 2.5D depth.

- **The Wall.** A long, pale stone façade about 12 m tall runs along the back of the walkway. It has one tall **archway** (the EXIT). The wall is the film's projection screen: shadows play on it.
- **Walkway** in front of the wall: a **bench** (center-left), three **lamp posts**, a **café awning** (far left), **planters**, and a **bus-shelter frame** (far right).
- **Skyline** beyond the wall, made of simple stacked rectangles.
- **Light:** late golden hour, with a low sun behind the camera and to the left. In Act I the shadows on the wall are soft and faint. In Act II the light swings squarely behind the camera and the shadows become large and crisp. In Act III the replay returns to Act I's light.

**Setups planted in S02 for later payoff:**

| Setup | Paid off in |
|---|---|
| Protagonist's phone (casual, accurate tap) | Fine-motor demonstration (S19–S20) |
| Archway EXIT | Flight (S06), missed by tunnel vision (S20) |
| Bench | The sheepdog at rest (S15) |
| Cyclist with a bell | Reaction gap (S17, S18) |
| Parent and small child | The flock (S11) |
| Pigeons | The world keeps moving during Freeze (S07, S21) |
| Low-contrast graphite figure standing under the arch for about 4 s | "It was there the whole time" (S17). The viewer was in Condition White too. |

### 1.6 Cast

- **The Protagonist.** A gender-neutral, age-neutral adult figure with no face. Filled in BONE with a warm rim light. The only figure with a visible `HeartDot`, which tells the viewer we are inside this person's experience. Neither a hero nor a victim: an ordinary person.
- **The Other.** Uses the same body rig as everyone else. Filled in graphite with a cold rim light. Carries the `IntentWedge`. No visible heart: we are never inside their experience. The Other never strikes anyone on screen.
- **The Crowd.** 14–18 figures in three depth layers. They walk, sit, and talk. A parent and child, a cyclist, and pigeons are rendered as small particles. Rendered in ASH and MIST depending on depth.
- **The Sheepdog-figure.** A crowd figure who is visually identical to everyone else. Only their shadow reveals the role (S13).
- **Animals appear only as shadows:** sheep, wolf, dog, and once, briefly, a cat. They are never drawn as creatures standing in the plaza. This keeps the metaphor visibly a *projection*, not a label on people.

### 1.7 Visual identity

#### Typography

Two families, both on Google Fonts and loadable through `@remotion/google-fonts`.

| Role | Family | Settings (at 1080p) |
|---|---|---|
| Concept label (FIGHT, SHEEPDOG, CONDITION RED) | **Archivo** (variable: `wght`, `wdth`) | 96 px, wght 620, wdth 100, UPPERCASE, tracking +0.12em |
| Act slate | Archivo | 40 px, wght 500, UPPERCASE, tracking +0.32em, MIST |
| Secondary label / tag | Archivo | 32 px, wght 480, sentence case, tracking +0.01em |
| Data (bpm ranges, condition index) | **IBM Plex Mono** | 24 px, wght 450, tabular figures |
| Caveat footnote | IBM Plex Mono | 20 px, wght 400, MIST at 75% opacity |
| Optional captions | Archivo | 36 px, wght 500, BONE, soft shadow, lower third |

**Kinetic rule: the words behave like their concepts.** Archivo's width axis makes the typography part of the demonstration:

- **FIGHT** scales forward toward the viewer (+8%) as it lands.
- **FLIGHT** drifts backward as its letters spread apart (tracking +0.12em to +0.40em).
- **FREEZE** starts its tracking-in animation and stops dead at 70% complete, then holds.
- **POSTURE** grows in width (wdth 75 to 125) and weight (500 to 760).
- **SUBMIT** narrows and lowers (wdth 100 to 70, baseline down 12 px).

Minimum on-screen text size is 20 px at 1080p. Labels never exceed 3 words, and tags never exceed 6.

#### Color palette

**Neutrals (the world)**

| Token | Hex | Use |
|---|---|---|
| `INK` | `#0A0C0F` | Void, letterbox bars, Condition Black base |
| `NIGHT` | `#11151A` | Sky and primary background |
| `SLATE` | `#1A2027` | Ground plane, diagram panels |
| `STEEL` | `#2A323B` | Far architecture |
| `IRON` | `#3C4550` | Construction lines, mid architecture |
| `ASH` | `#6E7883` | Far crowd, tertiary text |
| `MIST` | `#A7B0B9` | Near crowd, secondary text, sheep shadows' rim |
| `STONE` | `#CFC6B4` | The Wall, lit |
| `BONE` | `#E9E4D8` | Protagonist, primary text, diagram strokes |
| `PAPER` | `#F7F4EE` | Brightest highlight |

**Condition signals.** Used only for the protagonist's internal state.

| Token | Hex | Notes |
|---|---|---|
| `C_WHITE` | `#F7F4EE` | Same value as PAPER. A pale, cool heart glow. |
| `C_YELLOW` | `#E6C14A` | Muted amber, not neon |
| `C_ORANGE` | `#E7863B` | |
| `C_RED` | `#D8432F` | Slightly brick, never pure `#FF0000` |
| `C_BLACK` | `#000000` | Always drawn with a 1.5 px PAPER hairline and a fine static texture so it reads against the dark background |

Lightness steps down monotonically from White to Black, so the sequence reads correctly in grayscale and for color-blind viewers. Position on the rail and the label are redundant cues on top of hue.

**External and role colors**

| Token | Hex | Use |
|---|---|---|
| `COLD` | `#8EA4BA` | `IntentWedge`, the Other's rim light, the wolf's eye |
| `GRAPHITE` | `#262D35` | The Other's body fill |
| `SHADOW` | `#07090B` at 70% | Cast shadows on the wall |
| `SUNLIGHT` | `#F2D9A6` at 18% | Warm light wash on the wall in Act II |

#### Background treatment

- Flat layered planes with a gentle vertical gradient (`NIGHT` at the top to `SLATE` at the horizon).
- Atmospheric depth: each farther layer is lighter and lower in contrast (about +6% luminance and −15% contrast per layer).
- **Film grain:** seeded monochrome noise at 2.5% opacity, regenerated every 2 frames so it moves at 15 fps and feels organic.
- **Ground grid:** faint perspective lines on the walkway (1 px `IRON` at 25%). They are barely visible in WORLD mode. When the camera tilts into DIAGRAM mode they become the diagram's paper.
- **Matte:** in WORLD mode, `INK` letterbox bars create a 2.39:1 frame (138 px top and bottom). In Act III the bars double as instrument panels: the lower bar carries the pulse line and the Condition Rail, and the upper bar carries the condition label and bpm range.

#### Character design

- **Construction:** geometric primitives only. The head is a circle. The torso is a rounded trapezoid. Upper and lower limbs are tapered capsules with rounded joints. Hands are ellipses and feet are small wedges. Proportions are 7.5 heads tall. Wide-shot height is about 180 px.
- **No faces, no clothing detail, no hair.** Identity comes from pose, motion, and signal elements alone.
- **Rim light:** a 1.5 px edge on the side facing the light. Warm (`SUNLIGHT` at full strength) on the protagonist and the crowd. `COLD` on the Other.
- **The HeartDot** is 6 px in wide shots and scales with the camera. Its glow radius is 3× its size. It is the only element of the protagonist that ever takes a condition color, apart from the rim warming during Orange (S19).
- **Idle life:** every figure has a subtle breathing sway (±1.5° torso, 3–4 s period, with seeded phase). **Freeze is shown by removing this sway.** A frozen figure is the only thing in the frame that is perfectly still.
- **Child figure:** 0.6× scale with a larger head ratio. **Cyclist:** the same rig in a seated pose on a two-circle bicycle drawn in line art.

#### Icon style
- 2 px strokes at 1080p with rounded caps and joins, drawn on a 24 px grid. Glyphs are geometric and outlined. Solid fills are reserved for active states.
- Custom glyphs: sheep, wolf, dog, heart dot, intent wedge, attention cone, compass, rail node, sound arcs, fingertip target.
- **No system emoji.** The source's 🐑 🐺 🐕 are translated into this glyph set and into the wall-shadow silhouettes. Emoji glyphs render differently on different machines and would break determinism.

#### Diagram style
- Construction lines are 1 px `IRON`. Primary strokes are 2–3 px `BONE`. Nodes are circles (r = 6, 10, or 14). Arrowheads are open chevrons.
- Labels sit on diagram ends in UPPERCASE Archivo at 20–24 px with +0.2em tracking. Leader lines are 1 px.
- Diagrams are drawn on with animation, never popped on: stroke draw-on over 0.4–0.7 s with an 80 ms stagger.
- Every diagram is anchored to something physical: the compass to the protagonist's chest, the ring to their feet, the rail to the heartbeat line.

#### Line weights (1080p)
| Element | Weight |
|---|---|
| Construction or grid | 1 px at 12–25% opacity |
| Distance line, tick marks | 2 px, dotted 2/7 |
| Compass arms | 2 px, or 3.5 px when lit |
| Ground ring | 2 px with a 6% fill |
| Pulse line | 2.5 px (1.5 px for overload copies) |
| Rail track | 3 px base, 5 px when filled |

#### Shape language
- **Circles** stand for self and state: heart dot, ground ring, rail nodes. They read as contained and safe.
- **Wedges and chevrons** stand for intent and direction: the Other, the wolf's eye (pointing inward), the sheepdog (pointing outward).
- **Arcs** stand for signals: voice, awareness ripples, sound.
- **Lines** stand for distance, time, and paths.
- **Rounded** shapes read as peaceful (sheep). **Angular** shapes read as predatory (wolf). **Upright and clean** shapes read as protective (dog).

#### Lighting
- A single low key light, the late sun, comes from behind the camera and to the left. Rim light falls on the light-facing edge of each figure.
- The light is motivated and changes only for story reasons. It swings squarely behind the camera for Act II so the shadows become the actors, then drops toward dusk to break the metaphor (S15).
- **Perceptual grading** is separate from the world's lighting. It represents what the protagonist perceives, and it is applied only to the world layer, never to the protagonist or the Other. Yellow adds a touch of clarity. Orange desaturates and softens. Red darkens and blurs, and closes a tunnel. Black crushes and misregisters.

#### Depth
Four planes, with parallax factors in brackets:
- Sky gradient [0]
- Skyline [0.3]
- Wall, walkway, and figures [1.0]
- Foreground occluders [1.35], used sparingly

Crowd lanes at y = 812, 836, and 888 scale figures from 0.84 to 1.03. Atmospheric falloff darkens the far lanes.

#### Camera
- A virtual 2.5D camera with `{x, y, zoom}`. Moves are slow and motivated: follow dollies, push-ins on tension, pull-backs to show distance.
- **Act I:** a lateral follow, then a slow push-in onto the pair.
- **Act II:** framed on the wall.
- **Act III:** White follows the protagonist and makes one reveal pan. Yellow is wide and steady. Orange pushes in. Red is tight with a 2–3 px deterministic micro-shake (subtle, never shaky-cam). Black drifts unstably and never settles.
- **Act IV:** a flat diagram, then back to a calm follow.

#### Motion language
- **Default:** weighted calm. Ease-in-out on `cubic-bezier(0.45, 0, 0.2, 1)` over 0.6–1.2 s. Nothing snaps.
- **The Other moves linearly at constant speed.** Mechanical and relentless, it stands out against the eased world.
- **Protagonist:** organic ease. In Red, motion is fast with short, strong ease-outs. In Black it stutters, with erratic direction changes and then a total lock.
- **Freeze** is the absence of motion while everything else keeps moving.
- **Labels** track in (letters converge). Concept labels behave like their concepts (see Typography).
- **Photosensitivity:** no flashing anywhere. Condition Black is built from overlap and misregistration, and luminance never strobes.

#### Transition language (summary; full system in §8)
Transform, don't fade. A heartbeat becomes the skyline. The threat's wedge becomes the wolf's eye. A crowd figure's shadow becomes a sheepdog. A time-freeze becomes the branch point. A rewind replays the day from the inside. The heartbeat line becomes the Condition Rail. The Red tunnel shatters into Black. Black collapses into the Freeze from Act I. The final chain is built from glyphs already seen.

---

## 2. Narrative structure

### 2.1 The proposed structure and why it differs from the brief

The brief's order (life → threat → responses → posture → roles → preparedness → conditions → synthesis) is sound. This plan keeps that order and adds three structural devices that make it one continuous explanation instead of three modules.

1. **One encounter, three lenses.** The same plaza, protagonist, and threat carry all three frameworks. The viewer never has to rebuild a mental picture. Each act adds a layer of meaning to images they already know.
2. **Posture moves to the end of the five responses.** The source lists Fight, Flight, Freeze, Posture, Submit. The film demonstrates **Fight, Flight, Freeze, Submit, Posture**, so Posture becomes the hinge into Act II. The posture demo's *shadow* ("perceived strength") literally becomes the shadow theater of the metaphor. The source order is still used whenever the five are listed together (the compass).
3. **The Rewind.** The Condition sequence is a *replay* of the Act I afternoon, this time from inside the protagonist's perception. This does three things:
   - It lets Condition White show the threat that *was already there* in S02. The viewer also missed it, so they experience White instead of being told about it.
   - It maps states onto responses. Red visibly narrows the Response Compass to fight/flight (the source labels Red "Fight / Flight"). Black collapses into Freeze, the same image as S07.
   - It makes the synthesis feel like a conclusion rather than a summary.

A fourth, smaller change: **"Preparedness versus aggression" becomes the landing point of Act II** (S15), carried by the sheepdog at rest. It then hands off "calm, but ready" as a *state* ("not a role") into Act III, where it becomes Condition Yellow's label.

### 2.2 Structure

| Act | Beat | Scenes | Question answered |
|---|---|---|---|
| I · The Moment | Ordinary life, then a threat, then time stops. Five branches. Posture and perceived strength. | S01–S10 | What can a person do when threatened? |
| II · The Roles | The wall becomes a shadow theater: flock, wolf, sheepdog. Capability versus intent. Preparedness is not aggression. The metaphor is dissolved. | S11–S15 | Who is in the encounter, and what separates the protector from the predator? |
| III · The Ladder | Rewind. The same afternoon replayed from inside: White, Yellow, Orange, Red, Black. What arousal does. | S16–S22 | What state is the person in, and what does that state do to perception, the body, and decisions? |
| IV · Control | The chain: threat → awareness → arousal → condition → response → decision. Coda. | S23–S24 | How does it connect, and what is the goal? |

### 2.3 Emotional arc

Calm (S01–S02), then unease (S03), then suspended tension (S04–S09). Relief and insight (S10). Contemplative (Act II). Calm again after the rewind (S16–S18), then rising tension (S19–S20) and disorientation (S21). Clarity (S22–S23) and resolved calm (S24).

The film's emotional "home" is **Condition Yellow**: calm, but ready. It is the title (S01), the landing of Act II (S15), the named midpoint of the ladder (S18), and the final state (S24).

### 2.4 Narration strategy

- **Voice:** calm, mid-low register, unhurried (about 130 wpm), neutral accent. No trailer voice. The narrator is an observer, not an instructor.
- **Density:** about 560 words over 6:36, roughly 45% of runtime. Narration drops out for key demonstrations: the freeze hold, the rewind, the Red tunnel, the onset of Black.
- **The final VO script** lives in `explainer/src/narration.ts`: 66 timed lines, 549 words, about 229 s of speech. It drives the optional burned-in captions (`showCaptions`) and is exported by `npm run vo` to `docs/explainer/vo/`: an ElevenLabs script in 28 paste-ready blocks with placement times, a one-line-per-cue version, a cue sheet, and an `.srt`. Where the storyboard's narration concepts (§3) differ from it, the VO script wins.

---

## 3. Scene-by-scene storyboard

**How each entry is organized.** Every scene lists: purpose; begin, develop, end; character; camera; graphics; on-screen text; narration concept; sound; animation; transition. Every scene also has an **information-layers** line that sorts its content into four categories: **P** = primary visual information (must be understood without text), **S** = secondary supporting information, **N** = narration, **T** = optional on-screen text. All times are scene-relative. Implemented timings live in `explainer/src/scenes/*`.

### ACT I · THE MOMENT

#### S01 · The Pulse · 12 s · 0:00–0:12
- **Purpose:** Plant the heartbeat, the film's spine, and state the title.
- **Begin:** Pure `INK`. Silence, then a single heartbeat thump.
- **Develop:** A PAPER ECG trace draws left to right at 70 bpm (+0.6–4.2 s), with a bright head dot that pulses on each beat. At +5.2 s the trace lifts and dissolves as the plaza fades up beneath it. The rooftops of the skyline sit exactly where the peaks were. The matte bars slide in (+6–8.5 s): WORLD mode begins. The protagonist materializes around a point of light, the `HeartDot` (+7.4–8.6 s).
- **End:** The protagonist stands at the left of a calm plaza under the title **CALM, BUT READY**.
- **Character:** Still, standing. The heart dot pulses in sync with the trace.
- **Camera:** Starts low and close (zoom 1.25), then eases up and back to a wide shot (1.08).
- **Graphics:** `PulseLine`, `HeartDot`, `Matte`.
- **On-screen text:** Title (Archivo 84, tracking-in) at +8.6 s, out at +10.9 s.
- **Narration concept:** None. The heartbeat is the first voice.
- **Sound:** Heartbeat thumps synced to beats. The city room tone breathes in as the plaza appears.
- **Animation:** Linear trace draw; eased crossfade into the world.
- **Transition to S02:** Continuous. The camera begins its follow move.
- **Layers:** P heartbeat → world; S title; N none; T title.

#### S02 · An Ordinary Day · 16 s · 0:12–0:28
- **Purpose:** Establish peaceful ordinary life and plant every setup (see §1.5).
- **Begin:** The protagonist walks right through a lively plaza.
- **Develop:** The crowd walks, talks, and sits. A parent walks with a child, and a cyclist passes. The protagonist checks their phone (+4.5–9.8 s) and pockets it. **The Other stands still by the bus shelter at far right,** graphite and low-contrast, easy to miss.
- **End:** The protagonist is mid-plaza. The camera has drifted right.
- **Character:** Relaxed walk cycle; head down while on the phone.
- **Camera:** A slow lateral follow dolly (x 520 → 1000), easing wider.
- **Graphics:** None. Faint wall shadows only.
- **On-screen text:** Slate "I · THE MOMENT" in the top bar (+0.4–5 s).
- **Narration concept:** "Most days are ordinary. Nothing happens. Nothing needs to."
- **Sound:** Plaza room tone (footsteps, murmur, distant traffic, birds), a bicycle freewheel, and a sparse three-note piano motif (the *ready* motif).
- **Animation:** Crowd driven by the world clock; seeded variety.
- **Transition to S03:** Continuous. The protagonist decelerates.
- **Layers:** P peaceful crowd, the protagonist on the phone; S hidden figure at the shelter; N ordinary days; T slate.

#### S03 · Something Doesn't Fit · 16 s · 0:28–0:44
- **Purpose:** A potential threat appears, identified by **behavior**, not appearance.
- **Begin:** The protagonist settles to a stop.
- **Develop:** The Other starts walking toward the protagonist from the shelter. It moves against the flow at a constant, linear speed, the only figure in the frame that doesn't ease (+1.5–13.5 s). A cold `IntentWedge` fades in ahead of its head, pointing at the protagonist (+3 s). The protagonist notices and turns alert (+6 s). The heart quickens and warms (70 → 110 bpm). A dotted trajectory line connects them (+8 s). The world desaturates slightly.
- **End:** The two stand facing each other about 450 px apart.
- **Character:** Protagonist: stop, then alert. Other: steady approach, then stop.
- **Camera:** Slow push-in to the branch framing (1025, 650, 1.12).
- **Graphics:** `IntentWedge`, trajectory line, heart warming.
- **On-screen text:** None (captions only).
- **Narration concept:** "Then, sometimes, something doesn't fit. When a threat appears, a person has to respond."
- **Sound:** The piano motif stops mid-phrase. The Other's footsteps come forward in the mix. A low sub-drone enters.
- **Animation:** The Other moves linearly while everyone else eases.
- **Transition to S04:** The world slows to a stop.
- **Layers:** P the approaching figure and wedge; S heart warming; N "doesn't fit"; T none.

#### S04 · One Moment, Five Paths · 12 s · 0:44–0:56
- **Purpose:** Freeze time and reveal the five possibilities as alternatives to one moment.
- **Begin:** The approach resolves.
- **Develop:** Time stops (+0.6–1.6 s): the crowd halts mid-stride and the world drains to 15% saturation, while the protagonist and the Other stay in color. `GroundRing`s form under both (+2 s). A dotted `DistanceLine` measures the gap (+2.8 s). The `ResponseCompass` draws from the protagonist's chest one arm at a time: FIGHT → (+4.2), FLIGHT ← (+5.2), FREEZE ● (+6.2), POSTURE ↑ (+7.2), SUBMIT ↓ (+8.2). Then it dims to "available".
- **End:** A frozen tableau with the full compass.
- **Camera:** Locked. Stillness sells the freeze.
- **Graphics:** Rings, distance line, compass.
- **On-screen text:** Compass labels.
- **Narration concept:** "Time stops. One moment, one threat. Broadly, there are five ways a response can go."
- **Sound:** A tape-stop, then a suspended pad. The heartbeat stays at about 118 bpm, the only thing still moving.
- **Transition to S05:** The FIGHT arm lights and a branch begins.
- **Layers:** P frozen world plus five directions; S rings and distance; N five ways; T labels.

**The branch pattern (S05–S09).** Each response is a *what-if* played from the frozen moment. The world runs in desaturated "hypothetical" mode. A 12% silhouette marks the protagonist's origin. The active compass arm lights while the others dim. The label lands about 0.6 s after the key action and uses its concept's kinetic behavior. Each branch ends with a **0.9 s eased rewind** to the frozen moment, with onion-skin trails (Posture is the exception). The rewind grammar is taught here and pays off at full scale in S16.

#### S05 · Fight · 10 s · 0:56–1:06
- **Develop:** The protagonist advances toward the Other in a compact guard (forearms raised, no fists). The distance line shrinks and disappears as the rings touch (+3.6 s). The contact is shown only as a bright crease where the rings meet, with a 0.05 camera nudge. No blow is shown.
- **Text:** FIGHT (scales toward the viewer). "Confront the threat directly." / "Can be adaptive when trained and appropriate."
- **Narration concept:** "Fight: move toward the threat and confront it. It can work, when trained and appropriate."
- **Sound:** Footfalls accelerate. One dull low thump at contact, never a punch sound effect. Tape-rewind whoosh on the return.
- **Layers:** P movement toward, rings meet; S training caveat; N confront; T tags.

#### S06 · Flight · 11 s · 1:06–1:17
- **Develop:** The protagonist turns and runs left. The EXIT arch outlines softly (escape is possible). The distance line stretches while the camera pulls back (zoom 1.12 → 0.84) to keep both figures in frame. The Other takes two steps, then stops. The protagonist reaches the arch and fades.
- **Text:** FLIGHT (letters spread and recede). "Escape. Create distance." / "Survival-oriented; common when escape is possible."
- **Narration concept:** "Flight: move away and increase the distance, when escape is possible."
- **Sound:** Running steps pan left and recede. The room tone opens up.
- **Layers:** P growing distance, lit exit; S when escape is possible; N distance; T tags.

#### S07 · Freeze · 15 s · 1:17–1:32 *(given the most time among the five)*
- **Develop:**
  - **(a)** The world resumes (crowd, pigeons) while the protagonist stays locked, with a hardened PAPER outline and no idle sway. The heart still pounds.
  - **(b)** *Adaptive:* the protagonist's contrast drops and the Other's wedge sweeps across the scene and passes over them. "Can conceal, or wait for an opening."
  - **(c)** *Maladaptive:* an OPENING lights at the exit arch, then closes. The Other resumes its approach. "Dangerous if it lasts too long."
- **Text:** FREEZE (its tracking-in stops at 70% and holds). "Temporary inability to act."
- **Narration concept:** "Freeze: the body stops, while the world keeps moving. Sometimes stillness hides you, or buys time. Held too long, the opening closes. It can follow sensory overload."
- **Sound:** World sound resumes fully. The protagonist's layer holds only the heartbeat, dry and close. That dissonance is the scene.
- **Layers:** P stillness against motion; S conceal/opening; N overload link (seeds Black); T tags.

#### S08 · Submit · 10 s · 1:32–1:42
- **Develop:** The protagonist lowers to a kneel, head down, palms open. Their ring shrinks (78 → 34) and their shadow shrinks. The Other steps in, and its ring expands (78 → 230) to engulf the protagonist's.
- **Text:** SUBMIT (narrows and sinks). "Yield. Give control to the threat." / "Passive surrender or appeasement."
- **Treatment note:** Neutral, without judgment. No shame lighting and no "failure" color.
- **Narration concept:** "Submit: lower, yield, hand control to the threat."
- **Sound:** The sub-drone swells as the Other's ring grows. The heartbeat is muffled.
- **Layers:** P rings: control transfers; S appeasement; N yield; T tags.

#### S09 · Posture · 13 s · 1:42–1:55
- **Develop:** The protagonist *rises*: chest up, chin up, wide stance, one arm extended palm-out. Voice arcs travel toward the Other (+1.4 s). The protagonist's ring expands (78 → 150) and their wall shadow grows 1.55× (perceived presence). The Other hesitates: its wedge flickers, then rotates away (+3.6–4.6 s). It turns and walks off. The distance grows *without the protagonist moving*. **No rewind:** the branch continues into S10.
- **Text:** POSTURE (widens and thickens: `wdth` 75 → 125, `wght` 480 → 780). "Signal strength to deter the threat." / "Voice · stance · visible resistance." / "Can prevent actual violence."
- **Narration concept:** "Posture: look bigger, sound firm, show resistance. Shouting, an aggressive stance, even displaying a weapon. Often seen in humans and animals, it can stop violence before it starts." *(Weapon display is narration only and never drawn. See §12.)*
- **Sound:** A firm, wordless vocal shout designed as a tonal swell (no scream). The Other's footsteps retreat.
- **Layers:** P expansion, then the threat withdraws; S examples; N deterrence; T tags.

#### S10 · Perceived Strength · 17 s · 1:55–2:12
- **Purpose:** Land the central idea of the section: *the appearance of strength matters*.
- **Develop:** The camera eases back and up toward the wall and the compass fades. The quote sets in the upper frame: "The appearance of strength is as important, in many cases, as strength itself." (+1.2–8.3 s). Brackets compare **ACTUAL** (the figure) with **PERCEIVED** (the larger wall shadow) (+4.6 s): "The threat reacts to what it perceives." The shadow briefly becomes an **arched cat**, "Animals do it too." (+8.4–11.2 s), then turns human again. From +11 s the light swings squarely behind the camera. Saturation returns and the crowd walks again. Wall shadows grow large and crisp, and the wall becomes a screen.
- **End:** A warm, clear wall of big shadows.
- **Text:** Quote; ACTUAL / PERCEIVED; tags; slate "II · THE ROLES" (+14.6 s).
- **Narration concept:** "Posture works on perception, not on actual strength. Signals like these are how we read each other: who is harmless, who is dangerous."
- **Sound:** The piano motif returns, re-harmonized warmer. Room tone returns fully.
- **Transition to S11:** Shadows become the stage (a light change, not a cut).
- **Layers:** P figure vs. shadow size; S cat; N perception; T quote.

### ACT II · THE ROLES *(the shadow play)*

#### S11 · The Flock · 16 s · 2:12–2:28
- **Develop:** The protagonist walks on and joins the crowd. On the wall, one by one (+3–5.5 s, staggered), people's shadows soften into **sheep**, the protagonist's included. The figures themselves never change. Only their projections do.
- **Text:** SHEEP. "Ordinary, peaceful people" / "Law-abiding · cooperative · the majority."
- **Narration concept:** "One metaphor describes people by how they relate to violence. Sheep: ordinary people who live peacefully and avoid violence. Many are uncomfortable even thinking about it. That is normal, not weakness."
- **Treatment:** Sheep are shown with dignity: calm, together, walking. Peacefulness is the norm, not a flaw.
- **Sound:** Soft pastoral undertone (no literal bleats) under the city tone.
- **Layers:** P human → sheep shadows; S majority; N definition; T tags.

#### S12 · The Wolf · 14 s · 2:28–2:42
- **Develop:** The Other re-enters from the right. Its shadow becomes a **wolf**: lowered head, raised hackles, angular. The `IntentWedge` travels from the figure's head onto the wall and **becomes the wolf's eye** (+2.4–3.8 s), still pointing at the flock.
- **Text:** WOLF. "Preys on others" / "Predatory · exploitative · seeks dominance."
- **Narration concept:** "Wolves: people who use violence against others. For gain, for power, or out of cruelty. Criminals, terrorists, predators."
- **Sound:** A low, cold, filtered tone that follows the wolf. The pastoral undertone thins.
- **Layers:** P wedge → wolf eye, facing the flock; S descriptors; N definition; T tags.

#### S13 · The Sheepdog · 16 s · 2:42–2:58
- **Develop:** The person on the bench (seated since S02) stands up (+0.8 s) and walks to stand **between the flock and the wolf, facing out** (+2.2–6.2 s). The figure is ordinary. Its shadow becomes an alert **dog** (+4.2–5.6 s) with a BONE chevron pointing *outward*, toward the threat and away from the flock. The wolf's wedge flickers (hesitation).
- **Text:** SHEEPDOG. "Protects others" / "Capable of confronting violence · under control."
- **Narration concept:** "Someone on the bench stands up. Nothing about them looks different. Sheepdogs: protectors, willing to confront violence to defend others. Soldiers, police officers, and others who step in when it matters."
- **Treatment:** No uniform, badge, or weapon. The role is revealed only by where they stand and which way they face.
- **Layers:** P an ordinary figure, a protective shadow, outward direction; S examples; N definition; T tags.

#### S14 · Same Capability, Different Intent · 17 s · 2:58–3:15
- **Develop:** World time holds and the flock dims to 35%. A dashed **CAPABILITY** line spans the wolf's and dog's shoulders at the same height (+1.2 s). **Intent wedges** appear above them: the dog's BONE wedge points outward (PROTECT), the wolf's COLD wedge points toward the flock (PREY) (+5.2 s). They are the same shape pointing in opposite directions. Ground rings show **control** (+9.6 s): the dog's is a clean circle (UNDER CONTROL), the wolf's is jagged (UNRESTRAINED).
- **Text:** SAME CAPABILITY / DIFFERENT INTENT (stacked labels).
- **Narration concept:** "In the metaphor, wolf and sheepdog can both use force. The difference is direction: one turns toward the flock, the other stands between it and harm. And control: the sheepdog is expected to use force responsibly."
- **Layers:** P equal height, opposite wedges; S control rings; N intent; T labels.

#### S15 · Prepared, Not Aggressive · 15 s · 3:15–3:30
- **Develop:** The wolf turns and leaves. The sheepdog-figure walks back and sits on the bench. Its shadow lies down, head up: at rest, still alert. Then the **sun drops** (+9.2–12.4 s). Shadows shrink, and every animal dissolves back into a human shape.
- **Text:** PREPAREDNESS IS NOT AGGRESSION. "Lives in peace. Ready to protect." Then the caveat: "A metaphor: a way to think about roles and intent." / "Not a scientific classification of people."
- **Narration concept:** "Most of the time, the sheepdog's life looks like everyone else's: peaceful and ordinary. The difference is readiness, not aggression. It's a metaphor, not a classification. And calm, but ready isn't a role. It's a state, and states change."
- **Sound:** Evening room tone. The motif resolves.
- **Transition to S16:** The rewind begins.
- **Layers:** P the dog at rest, then shadows returning to human; S caveat; N state, not role; T caveat.

### ACT III · THE LADDER *(a replay of the afternoon, from the inside)*

#### S16 · Back to the Start · 7 s · 3:30–3:37
- **Develop:** Everything reverses (+0.3–4.6 s, eased): the crowd walks backward, the light returns to afternoon, and the protagonist walks backward across the plaza with onion-skin trails, back to the opening frame. A thin line then drops from the `HeartDot` into the lower bar (+4.4–5.4 s). There the **pulse line** and the **Condition Rail** draw on, with five stops and ≈bpm ranges.
- **Text:** "III · The ladder". Rail labels.
- **Narration concept:** "Back to the start. This time, from the inside. The heartbeat becomes a meter: five conditions of arousal."
- **Sound:** A reversed swell. The heartbeat plays backward, then settles to 70 bpm.
- **Layers:** P rewind, heart → meter; S ranges; N from the inside; T rail labels.

#### S17 · Condition White · 22 s · 3:37–3:59
- **Purpose:** The problem is not fear. It is lack of awareness, and the viewer experiences it firsthand.
- **Develop:** The protagonist replays the S02 walk, looking at the phone. The `AttentionField` is a tiny cone aimed down at the screen. **Reveal** (+6.2–12.4 s): the camera pans right to the Other standing by the shelter, circled by a cold ring with its wedge visible. "It was there the whole time." / "Outside attention, so outside awareness." **Reaction gap** (+12.6–16 s): a cyclist's bell (the stimulus, +13.6 s) and the protagonist's startle (+15.0 s) are marked by a long STIMULUS→REACTION bracket: "Slower to react."
- **Readout:** CONDITION WHITE · Unaware · ≈60–80 bpm.
- **Narration concept:** "Condition White: relaxed, unaware, attention somewhere else. Here is what you missed the first time. When something happens, it takes longer to notice and to react. The problem isn't fear. It's attention."
- **Sound:** A full, wide, comfortable city mix. The phone's soft UI ticks sit close. The bell arrives slightly muffled for the protagonist.
- **Layers:** P tiny cone, hidden figure revealed, long bracket; S readout; N attention; T tags.

#### S18 · Condition Yellow · 21 s · 3:59–4:20
- **Develop:** The phone goes away and the head comes up. The attention cone opens into a **ring** that expands across the plaza (+1.6–8.5 s). As it passes objects they register: an outline on the EXIT, the bench, and **the Other**, which gets a cold outline. It is registered, not alarming. The world gains a touch of clarity. **CALM, BUT READY** returns as a label (+10.2 s), a callback to the title. **Reaction gap, again:** the same cyclist and bell, and a short bracket: "Ready."
- **Readout:** CONDITION YELLOW · Relaxed alert · ≈80–115 bpm (from +8.6 s).
- **Narration concept:** "Condition Yellow: relaxed alert. Head up, phone away. Nothing is wrong. You simply notice what's around you. Calm, but ready. When something happens, you see it sooner, and respond sooner."
- **Sound:** The same mix with more detail: individual footsteps become distinguishable (a presence boost). The motif returns in its home key.
- **Layers:** P an expanding awareness ring touching things; S short bracket; N calm, but ready; T tags.

#### S19 · Condition Orange · 23 s · 4:20–4:43
- **Develop:** The Other starts its S03 approach. The ring **collapses into a cone** aimed at it (+3–8.5 s). The world outside the cone desaturates to 38%, darkens, and softens to about 2 px blur, while the two figures stay sharp. The heart and rim warm toward orange ("Adrenaline rises"). The protagonist takes out the phone. In the **fine-motor panel**, a fingertip path to small targets shows the first tremor (+15.4 s).
- **Readout:** CONDITION ORANGE · Specific alert · ≈115–145 bpm (from +8.6 s).
- **Narration concept:** "Condition Orange begins when a specific possible threat appears. Attention narrows onto it. Everything else becomes less important. The heart speeds up, and precise tasks start to get harder."
- **Sound:** Ambience ducks 6 dB and narrows toward mono. The Other's footsteps sharpen. A pulse enters in the low end.
- **Layers:** P cone narrowing, periphery fading, first tremor; S readout; N selective attention; T tags.

#### S20 · Condition Red · 27 s · 4:43–5:10
- **Develop:** The Other rushes (+0.8–2.4 s) and the threat is immediate. The protagonist turns and drives away in a powerful run (gross motor), then turns back into a braced stance. A tunnel closes, the matte bars thicken by 62 px, and the world falls to 50% brightness with 3.6 px blur. There is a deterministic 3 px micro-shake. The **motor panel** shows a jittering fingertip missing its targets beside a clean stride arc marked GROSS MOTOR (+8.4–15 s). A bystander near the exit shouts and points: the **sound arcs die at the tunnel wall** and the exit stays dark (+15–21 s). Finally, the compass appears with **only ← and → lit** (+21.4 s).
- **Readout:** CONDITION RED · Fight / Flight · ≈145–175 bpm.
- **Tags:** "Gross motor: strong" / "Fine motor and complex thinking may decline" / "Tunnel vision may occur" / "Auditory exclusion may occur" / "Fight or flight."
- **Narration concept:** "Condition Red: the threat is immediate. This is the action phase. Big movements stay strong. Precise ones fall apart. Complex thinking can decline too. Someone shouts 'This way!' The voice, and the exit, may never register. Options narrow toward fight or flight. Effects differ from person to person."
- **Sound:** The world is low-passed (about 400 Hz, −18 dB). Heartbeat and breath move to the front. The bystander's shout is audible to the viewer but filtered almost to nothing: auditory exclusion rendered in the mix.
- **Layers:** P tunnel, strong stride vs. failing taps, arcs that never arrive; S may-occur tags; N action phase; T tags.

#### S21 · Condition Black · 25 s · 5:10–5:35
- **Purpose:** Qualitatively different from Red. Red is *too narrow*. Black is *no focus at all*.
- **Develop:** The single tunnel is replaced by **six attention cones jumping in random directions**, updated every 4 frames. The wedge is triplicated. Sound arcs overlap from three sources. The pulse line multiplies into four misregistered traces. The compass arms rotate out of alignment. Offset copies of the protagonist (warm and cool) misregister. The matte jitters. Movement becomes **erratic**: stepping toward, back, turning (+8.6–12.2 s). Then **lock** (+12.2 s): the chaos drains, and the protagonist stands outlined and frozen while the crowd keeps moving. It is the S07 image, now real. FREEZE lands with its stalled tracking animation (+13.4 s).
- **Readout:** CONDITION BLACK · Panic / Breakdown · ≈175–220+ bpm.
- **Tags:** "Cognitive overload" / "Freezing, hesitation, or irrational action" / then the label MORE AROUSAL IS NOT MORE READINESS / "Higher risk of catastrophic mistakes."
- **Narration concept:** "Condition Black: the system overloads. Signals overlap. Nothing resolves into a clear picture. Action becomes erratic, or stops altogether. Freeze: the same response we saw at the start. Extreme arousal doesn't make you more ready. It can take decisions away."
- **Sound:** Every stem at once (phone buzz, shout, footsteps, a phased double heartbeat, crowd). Then a **hard drop to near-silence** at the lock, leaving only a very fast, dry heartbeat and room tone at −40 dB.
- **Safety:** No luminance flashing. Everything is overlap and misregistration (see §12).
- **Layers:** P fragmentation, then lock; S effects; N overload ≠ readiness; T tags.

#### S22 · What Arousal Does · 17 s · 5:35–5:52
- **Develop:** DIAGRAM mode. The matte opens to a full-frame grid. **Five columns** (White to Black: dot, name, state) and **three rows**: PERCEPTION (mini attention glyphs: down-cone, ring, cone, tunnel, fragments), BODY (fingertip traces from smooth to scribble; GROSS MOTOR ✓ under Red), DECISIONS (mini compasses: disengaged, all available, all available, ← → only, scrambled). The rail with ≈ranges runs along the bottom. **Individual variation** (+10.8 s): three dashed ghost rails offset from the canonical one. "Illustrative: where these shifts happen differs from person to person." Footnote: "Approximate ranges from a simplified training model, not universal thresholds."
- **Transition to S23:** The matte closes and the chain builds.
- **Layers:** P small multiples; S variation rails; N arousal shapes perception, body, decisions; T footnote.

### ACT IV · CONTROL

#### S23 · The Chain · 28 s · 5:52–6:20
- **Develop:** Six nodes build left to right from glyphs the viewer already knows: **THREAT** (wedge) → **AWARENESS** (cone) → **AROUSAL** (heart dot) → **CONDITION** (mini rail) → **RESPONSE** (mini compass) → **DECISION** (a node with a single outgoing arrow). Links draw between them. **Run 1, recognized late** (+6.6–13 s): the signal travels, AWARENESS lights late, and a TIME TO RESPOND bar reaches only 24%, leaving DECISION dim. "Less time. Fewer options." **Run 2, recognized early** (+13.4–20 s): AWARENESS lights at once, the bar fills completely, and DECISION lights with a halo. "Time to stay in control, and to choose." Then PREPAREDNESS IS NOT AGGRESSION / "It keeps the decision in your hands."
- **Narration concept:** "Put it together: threat, awareness, arousal, condition, response, decision. Notice late, and there is less time to respond, and fewer options. Notice early, and there is time: time to stay in control, and to choose. The goal isn't constant aggression. It's controlled preparedness."
- **Layers:** P chain plus time bar; S run labels; N synthesis; T labels.

#### S24 · Calm, But Ready · 16 s · 6:20–6:36
- **Develop:** Back in WORLD mode. The protagonist walks through the warm plaza with a soft awareness ring and a slow amber heart. Three lines stack: **Recognize early. / Know your options. / Keep control.** (+1.0, +3.8, +6.6 s). Then the title **CALM, BUT READY** (+11.2 s). The matte bars close toward the center (+14.2–15.6 s), carrying the amber pulse line up with them, and the film cuts to black on a beat.
- **Narration concept:** "Recognize early. Know your options. Keep control." Then silence under the title.
- **Sound:** The motif resolves fully. The final heartbeat lands exactly on the cut to black. The heartbeat never flatlines.
- **Layers:** P calm walk with awareness ring; S three lines; N closing lines; T title.

---

## 4. Visual treatment: the five threat responses

**Core idea: one moment, five directions of the body.** The five responses are staged as alternatives branching from a single frozen instant. The same person, the same threat, and the same distance are replayed as five *what-ifs*, and each one rewinds back to the branch point. The `ResponseCompass` maps each response to a spatial direction so the vocabulary is physical before it is verbal:

| Response | Direction | Body (pose) | Ground ring | Shadow | Distance line | Other's reaction | Kinetic label |
|---|---|---|---|---|---|---|---|
| **Fight** | → toward | Advance in compact guard, forearms raised | Pushes into the Other's ring until they touch | Unchanged | Shrinks to zero | Holds its ground | Scales toward the viewer |
| **Flight** | ← away | Turn and run to the lit exit | Leaves the Other's ring behind | Unchanged | Stretches; camera pulls back | Two steps, stops | Letters spread and recede |
| **Freeze** | ● none | Mid-step lock, no idle sway, hardened outline | Static while the world moves | Unchanged | Shortens as the Other approaches | Scans past, then approaches | Tracking stalls at 70% |
| **Posture** | ↑ up / out | Chest up, chin up, wide stance, palm-out arm, voice arcs | Expands (78 → 150) | **Grows 1.55×** (perceived presence) | Grows *because the Other retreats* | Hesitates, wedge rotates away, leaves | Widens and thickens |
| **Submit** | ↓ down | Kneel, head down, palms open | Shrinks (78 → 34) and is engulfed | Shrinks 0.72× | Shrinks as the Other steps in | Ring expands (→ 230), steps in | Narrows and sinks |

**Rules**
- The Other's body never touches the protagonist. Fight is resolved as *rings meeting*, not a strike.
- No response is framed as right or wrong. Tags quote only the source's own qualifiers: "adaptive when trained and appropriate", "when escape is possible", "can conceal / wait for an opening", "dangerous if prolonged", "can prevent actual violence". Submit gets no evaluative tag because the source gives none.
- Freeze receives the most time (15 s) because it has the most nuance (adaptive vs. maladaptive) and because Act III calls back to it.
- Posture is demonstrated last because its shadow bridges into Act II and to the quote about the appearance of strength.

## 5. Visual treatment: sheep, wolf, sheepdog

**Core idea: the metaphor exists only as shadows.** People in the plaza stay people. Their *projections* on the wall take animal form. This communicates, without a word, that the framework is **a way of seeing, not a classification of human beings**. When the light changes in S15, every shadow becomes human again.

| | Sheep | Wolf | Sheepdog |
|---|---|---|---|
| Who casts it | Ordinary passers-by, parent and child, café talkers, and the protagonist | The Other (the Act I threat) | A bench sitter who has been in shot since S02 and looks like everyone else |
| Silhouette | Rounded "cloud" body, small head; soft and clustered | Long snout, lowered head, raised hackles; angular | Upright, ears up, head high; clean athletic lines |
| Direction (intent) | Toward each other and the path | `IntentWedge` eye **pointing at the flock** (COLD) | Chevron **pointing outward**, away from the flock and toward the threat (BONE) |
| Ground ring | None | Jagged (UNRESTRAINED) | Clean circle (UNDER CONTROL) |
| Motion | Walking with the crowd | Linear, relentless approach | Stands, walks to the gap, holds; later lies down *head up* |
| Descriptors (source) | Peaceful · law-abiding · cooperative · the majority · uncomfortable thinking about violence | Preys on others · predatory · exploitative · seeks dominance/power/advantage | Protects · capable of violence · used responsibly and under control · lives in peace, prepared |

**The capability vs. intent diagram (S14).** The wolf and dog shadows are shown at the *same height* under one dashed CAPABILITY line. Above them sit the *same wedge shape* pointing in opposite directions (PROTECT vs. PREY). Below them, control is shown by ring quality. The message is carried by geometry rather than text: same capability, opposite intent, different control.

**Rules**
- Sheep are never mocked. They are never shown as scattered, foolish, or helpless. Peacefulness is presented as normal and good.
- The sheepdog carries no uniform, badge, weapon, or heroic lighting. Its role is legible only through position (between flock and threat) and orientation (facing out).
- The sheepdog is shown **at rest** (S15) at least as long as it is shown confronting. That is the preparedness-vs-aggression beat.
- The wolf is identified only by behavior and intent. The figure casting it is the same body rig as everyone else.

## 6. Visual treatment: Conditions White through Black

**Core idea: the same afternoon, rendered from inside the protagonist's perception.** The world layer never changes. Only the **perceptual grade**, the **attention field**, the **heart**, the **instruments**, and the **motor panel** change. Each condition gets a different kind of visual change, not just a stronger version of the previous one.

| Parameter | White | Yellow | Orange | Red | Black |
|---|---|---|---|---|---|
| Heart tempo (visual) | 70 | 96 | 130 | 160 | 196, overlapping traces |
| Heart / rim color | Pale white | Amber | Orange rim warms | Brick red | Dark ember, glow flickers |
| Attention field | Tiny cone into the phone (14°, r 82) | Full ring expanding to r ≈ 1180 with a ripple edge | Cone locked on the threat (180° → 24°) | Needle cone (9°) plus screen tunnel | 6 cones in random directions, re-rolled every 4 frames |
| World grade | Neutral | Saturation 1.08, brightness 1.06 | Sat 0.38, bright 0.74, blur 2.2 px | Sat 0.16, bright 0.5, blur 3.6 px | Sat 0.1, bright 0.42, blur 2.5 px + misregistration |
| Matte | 2.39:1 | 2.39:1 | 2.39:1 | +62 px (frame narrows) | +62 px, jittering; eases after the lock |
| Camera | Follow, one reveal pan | Wide, still | Slow push-in | Tight, 3 px micro-shake | Unstable drift, never settles |
| Fine motor (panel) | Casual accurate taps (phone) | n/a | Slight tremor | Large tremor, misses | n/a (overload) |
| Gross motor | n/a | n/a | n/a | Strong stride arc ✓ | Erratic steps, then lock |
| Compass (perceived options) | Not engaged | All five available | All five available | ← → only | Scrambled, then ● Freeze |
| Sound | Wide, full, comfortable | More detail and clarity | −6 dB, narrowing | Low-passed ~400 Hz, −18 dB; heart and breath forward | All stems at once, then a hard drop to near-silence |
| Signature demonstration | The threat was there all along; long reaction bracket | Awareness ring registers exit, bench, and threat; short bracket | Selective attention; first tremor | Shout arcs die at the tunnel wall; exit stays dark | Fragmentation, then Freeze callback |

**Why Black is qualitatively different.** Red is *one channel at full volume*: a single tunnel, a single target, clean gross movement. Black is *every channel jammed*: many directions, overlapping signals, misregistered copies, arrows spinning, then a lock. The key visual contrast is *narrow* versus *no focus at all*. The payoff line, "more arousal is not more readiness", sits on the Freeze image the viewer already learned in S07.

---

## 7. Visual continuity system

**Persistent assets.** The following appear throughout the film and are always the *same component instance type*, never redrawn per scene:

| Asset | Appears in | Continuity job |
|---|---|---|
| The Plaza (wall, arch, bench, lamps, shelter, café) | S01–S21, S24 | One place; diagrams grow from it and return to it |
| Protagonist rig + `HeartDot` | S01–S21, S24 | One person throughout. The heart dot is the thread from S01 to S23. |
| The Other (graphite, cold rim, `IntentWedge`) | S02–S14, S17–S21 | One threat: hidden (S02), approaching (S03), branching (S04–S09), wolf (S12–S15), replayed (S17–S21) |
| Crowd (seeded agents on a world clock) | All world scenes | Freezes, resumes, and rewinds in step with the story |
| Bench sitter (agent 40) | S02 → S13 → S15 | Hidden in plain sight, then the sheepdog, then back at rest |
| Exit arch | S02, S06, S07, S18, S20 | Escape possible (Flight) → opening missed (Freeze) → registered (Yellow) → lost in the tunnel (Red) |
| Cyclist and bell | S02, S17, S18 | The same stimulus measured twice (reaction gap) |
| Phone | S02, S17, S19, S20 | Relaxed use → White's attention sink → fine-motor task |
| `ResponseCompass` | S04–S09, S20, S21, S22, S23 | Options → narrowed (Red) → scrambled (Black) → RESPONSE node |
| `PulseLine` / `ConditionRail` | S01, S16–S21, S22, S24 | Heartbeat → meter → axis → bookend |

**State continuity rules**
1. **End state equals next start state.** Each scene's first frame must match the previous scene's last frame, with the same actor positions, poses, camera, grade, and world time. Where a scene reuses a state it calls the function that produced it (for example `principalsS03`, `branchStatic`, `postureEnd`, `wt2`), so the values cannot drift apart.
2. **One clock for the world.** Crowd positions are pure functions of *world time*. Freezing, resuming, and rewinding are all done by changing world time, never by animating people individually.
3. **One heart for the film.** Heart rate and condition level are global tracks (`score.ts`) indexed by absolute film time, so every scene shows the same heart.
4. **Color meaning never changes.** Warm is internal arousal, cold is external intent, bone is the human.

## 8. Transition system

| # | From → To | Transition | Mechanism |
|---|---|---|---|
| T1 | Black → S01 | Heartbeat draws on | Pulse line, beat-synced dot |
| T2 | S01 → world | Heartbeat peaks become the skyline as the world rises | Crossfade and lift of the trace; matte slides in |
| T3 | S02 → S03 | Continuous shot; the hidden figure starts moving | No cut |
| T4 | S03 → S04 | **Time stops** | World clock → 0; desaturation to 15% |
| T5 | Branch → branch (S05–S09) | **Eased rewind** to the frozen moment, 0.9 s | Branch clock reverses; onion-skin trails |
| T6 | S09 → S10 | Posture continues without a rewind | Shared end state (`postureEnd`) |
| T7 | S10 → S11 | **Light swings behind the camera**; shadows become the stage | Shadow projection parameters interpolate (Act I → Act II) |
| T8 | S11 → S12 | Human shadows become sheep; the wedge becomes the wolf's eye | Staggered morphs; wedge path from head to eye |
| T9 | S12 → S13 | An ordinary sitter stands; their shadow becomes the dog | Pose blend plus morph |
| T10 | S15 → S16 | **Sun drops**: the metaphor dissolves, then the day **rewinds** | Light parameters → dusk; world clock reversed |
| T11 | S16 → S17 | The heart dot drops a line into the lower bar, which becomes the **Condition Rail** | Line draw, then rail and pulse line draw on |
| T12 | White → Yellow → Orange | The attention field transforms continuously (cone → ring → cone) | Parameter interpolation, no cuts |
| T13 | Orange → Red | Periphery collapses into a tunnel; matte closes | Tunnel amount, matte extra |
| T14 | Red → Black | The tunnel **shatters** into many cones | Single cone replaced by six seeded cones |
| T15 | Black → Freeze | Chaos drains, leaving the S07 freeze image | Callback composition |
| T16 | S21 → S22 | World → diagram: small multiples built from known glyphs | Matte opens |
| T17 | S22 → S23 | Glyphs condense into six chain nodes | Node build-on |
| T18 | S23 → S24 | Back to the world; matte closes onto the beat | Bookend with T1 |

**Rules.** No plain crossfade between concepts. A fade is used only to reveal the world in S01 and between the diagram scenes S22 → S23. Never cut on narration; cut on a heartbeat where possible.

## 9. Information hierarchy

**Four layers, strictly ordered**

1. **Primary visual (P).** The demonstration itself: movement, distance, rings, shadows, attention, heart. It must be understandable with the sound off and no text.
2. **Secondary supporting (S).** Diagram furniture: brackets, distance lines, compass, rail, motor panel, reaction bracket. It confirms and quantifies qualitatively what P shows.
3. **Narration (N).** Explains why, and gives the source's qualifiers. It never merely describes what is on screen.
4. **Optional on-screen text (T).** Concept labels (≤ 3 words) and tags (≤ 6 words). In the current build, captions stand in for VO.

**Text rules**
- At most **one label and two tags** on screen at once. Never a paragraph.
- Labels arrive after the demonstration (0.5–1.0 s lag) and leave before the next idea.
- All effect statements carry "may", "can", or "≈".
- Placement zones: the concept label sits in the upper third of the image area (y ≈ 232). Tags go directly below it. Readouts go in the upper matte bar. Instruments (pulse and rail) go in the lower matte bar. Captions go in the lower bar, or just above it in Act III.

A per-scene breakdown is given in each storyboard entry (§3, **Layers** line).

---

## 10. Timing and runtime

**Recommended runtime: 6:36** (396 s at 30 fps, 11,880 frames). That is long enough for three frameworks and a synthesis without rushing the demonstrations, and short enough to hold attention. Time is weighted toward the ideas that need demonstration: Freeze (15 s), Perceived Strength (17 s), Condition Red (27 s), Condition Black (25 s), and the Chain (28 s). Transitional beats are kept short: the Rewind is 7 s.

| Scene | Title | Start | Duration | Start frame | Frames |
|---|---|---|---|---|---|
| S01 | The Pulse | 0:00 | 12 s | 0 | 360 |
| S02 | An Ordinary Day | 0:12 | 16 s | 360 | 480 |
| S03 | Something Doesn't Fit | 0:28 | 16 s | 840 | 480 |
| S04 | One Moment, Five Paths | 0:44 | 12 s | 1320 | 360 |
| S05 | Fight | 0:56 | 10 s | 1680 | 300 |
| S06 | Flight | 1:06 | 11 s | 1980 | 330 |
| S07 | Freeze | 1:17 | 15 s | 2310 | 450 |
| S08 | Submit | 1:32 | 10 s | 2760 | 300 |
| S09 | Posture | 1:42 | 13 s | 3060 | 390 |
| S10 | Perceived Strength | 1:55 | 17 s | 3450 | 510 |
| S11 | The Flock | 2:12 | 16 s | 3960 | 480 |
| S12 | The Wolf | 2:28 | 14 s | 4440 | 420 |
| S13 | The Sheepdog | 2:42 | 16 s | 4860 | 480 |
| S14 | Same Capability, Different Intent | 2:58 | 17 s | 5340 | 510 |
| S15 | Prepared, Not Aggressive | 3:15 | 15 s | 5850 | 450 |
| S16 | Back to the Start | 3:30 | 7 s | 6300 | 210 |
| S17 | Condition White | 3:37 | 22 s | 6510 | 660 |
| S18 | Condition Yellow | 3:59 | 21 s | 7170 | 630 |
| S19 | Condition Orange | 4:20 | 23 s | 7800 | 690 |
| S20 | Condition Red | 4:43 | 27 s | 8490 | 810 |
| S21 | Condition Black | 5:10 | 25 s | 9300 | 750 |
| S22 | What Arousal Does | 5:35 | 17 s | 10050 | 510 |
| S23 | The Chain | 5:52 | 28 s | 10560 | 840 |
| S24 | Calm, But Ready | 6:20 | 16 s | 11400 | 480 |

**Pacing rules**
- A key demonstration holds at least 1.5 s after its label lands before anything new enters.
- In branch scenes, the last 1.7 s are reserved for the rewind and the reset.
- Condition scenes lengthen as arousal rises (22 → 21 → 23 → 27 → 25 s): more happens, and it needs more reading time.
- When VO is recorded, lock scene durations to the VO edit by editing `SCENES` in `explainer/src/timeline.ts`. Every downstream frame number is derived from it.

## 11. Sound design direction

**Philosophy.** Sound represents *perception*, not action. There are no gunshots, punches, sirens-as-cliché, or explosions. The heartbeat is the score's rhythmic spine.

| Layer | Design |
|---|---|
| Heartbeat | A designed "lub-dub" (sub-thump plus softer second transient, 0.28 beats apart), placed **exactly** at the beat times computed by the score (`beatsAt`). Export the beat timestamps from `score.ts` for the sound designer. |
| Music | Sparse piano and warm analog pad. A three-note **"ready" motif** is heard in S02, re-harmonized in S10, and in its home key at S18 and S24. Music drops out in S19–S21 and resolves in S23–S24. |
| World ambience | Plaza room tone: footsteps, café murmur, distant traffic, birds, bicycle. Recorded wide and spacious. |
| Perceptual mix (Act III) | White: full and wide, phone ticks close. Yellow: presence boost, details audible. Orange: −6 dB, narrowing toward mono, the Other's footsteps forward. Red: world low-passed about 400 Hz and −18 dB; heartbeat and breath forward; the bystander's shout filtered almost to nothing (**auditory exclusion**). Black: all stems overlap, then a hard drop to −40 dB room tone plus a fast, dry heartbeat. |
| Act I branches | A tape-stop into the freeze. Each branch rewinds with a soft reversed whoosh. Fight contact is a single dull low thump. Posture's voice is a firm, wordless tonal swell. |
| Act II | A cold, filtered tone follows the wolf. A soft pastoral bed sits under the flock (no literal bleats). The sheepdog has no theme; its restraint is the point. |
| Ending | The last heartbeat lands on the cut to black. Never a flatline. |

**Mix rules.** VO is always intelligible (sidechain duck −6 dB). Keep loudness around −16 LUFS integrated for web. No sustained high-frequency "tinnitus" tones above −30 dBFS: suggest them, don't inflict them.

## 12. Scientific and conceptual caveats

These are **production rules**, not just disclaimers. Each one is enforced in the design.

1. **The condition system is a simplified training model.** On screen it is labeled "Simplified training model · ranges vary by person" (upper bar, S16–S21) and "Approximate ranges from a simplified training model, not universal thresholds" (S22).
2. **Heart rates are approximate ranges, never thresholds or precise readouts.** They are always written as "≈low–high bpm". There is **no live bpm counter anywhere**. The visual heartbeat tempo is illustrative. S22 shows **ghost rails** offset from the canonical one ("Illustrative: where these shifts happen differs from person to person").
3. **Effects are possibilities, not certainties.** Every effect tag uses "may" or "can". S20 states "Effects differ from person to person."
4. **The film adds no claims beyond the source.** No chemistry, hormones, reaction-time numbers, or percentages. The reaction-gap bracket compares lengths only, with no milliseconds. "Options narrowing" in Red is framed as *perceived* options: the exit still exists in the world and the viewer can see it. That matches the source's "tunnel vision" and "complex thinking may decline".
5. **Sheep / wolf / sheepdog is a conceptual metaphor, not a scientific classification of society.** It exists only as shadows, and those shadows return to human form with the on-screen caveat (S15).
6. **Behavior, not appearance.** The threat is identified only by trajectory, focus, and distance. All figures share one faceless body. No clothing, skin tone, age, or other demographic cues mark anyone as threat or protector. No uniforms define the sheepdog.
7. **No response is endorsed or shamed.** The film reports the source's qualifiers only. Submit is shown neutrally.
8. **No violence is depicted.** Fight is resolved as rings meeting. There are no weapons on screen (weapon display is mentioned in narration as a posture example only), no injuries, and no tactical instruction.
9. **Photosensitivity.** No flashes or strobes, including in Condition Black (overlap and misregistration only; jitter below 8 Hz and low amplitude). Run a Harding/PEAT check before release.
10. **Attribution.** If the frameworks are credited, verify the attribution against primary sources before publishing. This plan deliberately does not attribute or "correct" the provided heart-rate assignments.

---

## 13. REMOTION PRODUCTION BLUEPRINT

> **Status.** A first full implementation of this blueprint exists in `explainer/`: all 24 scenes render end to end. This section documents the architecture so the next developer can extend, polish, and add audio without reverse-engineering it. The paths below are real.

### 13.1 Running it

```
cd explainer
npm install
npm run studio          # Remotion Studio, scrub the whole film
npm run typecheck
npx remotion still src/index.ts CalmButReady out/f.png --frame=2400 --scale=0.5
npm run audio           # regenerate public/audio/soundtrack.wav from score.ts (render scripts do this if missing)
npm run render:preview  # 960x540 full film -> out/calm-but-ready-540p.mp4
npm run render          # 1920x1080 full film -> out/calm-but-ready.mp4
```

**Render performance.** On CPU-only machines use the `angle` GL backend (set in `remotion.config.ts`). It measured about 4× faster than `swangle` for this film, roughly 0.1 s per 540p frame at concurrency 4. Grain is computed at quarter resolution, and crowd shadows share one group blur instead of one filter per shadow.

`remotion.config.ts` points Remotion at a pre-installed headless Chromium. Override it with `REMOTION_BROWSER=/path/to/headless_shell`, or delete the line to let Remotion download its own. Fonts are **self-hosted** in `public/fonts`, so rendering needs no network.

### 13.2 Composition structure

- **One composition:** `CalmButReady`, 1920×1080, 30 fps, `TOTAL_FRAMES = 11,880`, registered in `src/Root.tsx`.
- `src/Film.tsx` maps the `SCENES` table to `<Sequence from={sceneStart(id)} durationInFrames={sceneFrames(id)}>`, each rendering a scene component with prop `T0` (absolute start in seconds). A global `<Grain>` overlay sits on top.
- **Recommended additions:** per-scene dev compositions (the same `Film`, offset to a scene's start) for faster iteration, and a `StyleFrames` still composition for the key frames listed in 13.14.

```
explainer/
  remotion.config.ts        browser, image format, concurrency
  public/fonts/             Archivo (variable wght/wdth), IBM Plex Mono 400/500
  src/
    index.ts  Root.tsx  Film.tsx
    timeline.ts             SCENES table, sceneStart/sceneFrames, FPS, TOTAL_FRAMES
    score.ts                global tracks: bpmAt(T), levelAt(T), beatsAt(T), pulseAt(T)
    theme.ts  fonts.ts      color tokens, CONDITIONS data, conditionColor(), font loading
    lib/anim.ts             easing, p(), kf(), fadeWindow, rand(), beatEnvelope, makeBeatClock, ecg
    components/
      World.tsx             Plaza (layers + camera), WORLD layout, laneScale, camTransform, toScreen
      Figure.tsx            rig: Pose, POSES, walkPose, runPose, mixPose, solve (FK), anchor, <Figure>
      Crowd.tsx             seeded AGENTS, agentState(ag, worldT), <Crowd>, <CrowdShadows>
      Shadows.tsx           <ShadowOf> wall projection, animal silhouettes, light presets
      Signals.tsx           IntentWedge, GroundRing, AttentionField, DistanceLine, SoundArcs,
                            PulseLine, Matte, ConditionRail, Grain, Tunnel
      Compass.tsx           RESPONSES data, <ResponseCompass>
      Type.tsx              Label (kinetic), Tag, Caveat, Slate, ConditionReadout
    scenes/
      common.tsx            useTimes, WorldLayer, ScreenLayer, heartAt, Caption, shared constants
      Act1Open.tsx          S01–S04 (+ exported state fns principalsS03, branchStatic)
      Act1Responses.tsx     BranchScene engine + S05–S10
      Act2.tsx              S11–S15 (+ wt2 world clock)
      Act3Shared.tsx        Instruments, MotorPanel, ReactionGap, wt3
      Act3a.tsx  Act3b.tsx  S16–S19, S20–S22
      Act4.tsx              S23–S24
```

### 13.3 Scene component names

| ID | Component | File |
|---|---|---|
| S01–S04 | `S01Pulse`, `S02OrdinaryDay`, `S03Shift`, `S04Branch` | `Act1Open.tsx` |
| S05–S10 | `S05Fight`, `S06Flight`, `S07Freeze`, `S08Submit`, `S09Posture`, `S10PerceivedStrength` | `Act1Responses.tsx` |
| S11–S15 | `S11Flock`, `S12Wolf`, `S13Sheepdog`, `S14CapabilityIntent`, `S15Prepared` | `Act2.tsx` |
| S16–S19 | `S16Rewind`, `S17White`, `S18Yellow`, `S19Orange` | `Act3a.tsx` |
| S20–S22 | `S20Red`, `S21Black`, `S22Readout` | `Act3b.tsx` |
| S23–S24 | `S23Chain`, `S24Coda` | `Act4.tsx` |

### 13.4 Data structures (field-level)

| Structure | Location | Fields |
|---|---|---|
| `SceneDef` | `timeline.ts` | `id`, `title`, `act` (1–4), `dur` (s). Order in the array defines start times. |
| `ConditionDef` | `theme.ts` | `id`, `label`, `color`, `bpm: [lo, hi]`, `visualBpm`, `state`, `effects[]` |
| `Pose` | `Figure.tsx` | `lean`, `head`, `shN/elN`, `shF/elF`, `hipN/knN`, `hipF/knF` (degrees; limbs measured from vertical, + = forward), `expand` 0–1, `sit` 0–1 |
| `Agent` | `Crowd.tsx` | `id`, `kind` (walker/child/sitter/talker/cyclist), `lane` (y), `x0`, `dir`, `speed` (px/s), `size` |
| `Cam` | `World.tsx` | `x`, `y`, `zoom` (world units ≈ px at zoom 1) |
| `ShadowLight` | `Shadows.tsx` | `k` (projection scale), `dx`, `opacity`, `blur`. Presets `LIGHT_ACT1`, `LIGHT_ACT2`, `lerpLight` |
| `BranchSpec` | `Act1Responses.tsx` | `id`, `behavior`, `label`, `labelAt`, `tags[]`, `captions[]`, `prot(b)`, `other(b)`, `cam?(b)`, `world?(b,t)`, `worldMoves?`, `rewind?` |
| Global tracks | `score.ts` | `bpmAt(T)`, `levelAt(T)` as keyframes on absolute seconds; `beatsAt(T)` (integrated), `pulseAt(T)` (envelope) |

### 13.5 Animation systems

1. **Time model.** Each scene reads `frame` through `useTimes(T0)` and gets `t` (scene seconds) and `T` (absolute seconds). All choreography is written in seconds with `p(t, a, b, ease)` (eased 0–1 progress) and `kf(t, [[t, v], ...])` (keyframes).
2. **World clock.** Crowd motion is `agentState(agent, worldT)`, a closed-form function of world time. Scenes decide world time: `T` normally, a constant for a freeze, `FREEZE_T + b` inside branches, a decreasing value for the rewind (`S16`), `wt2`/`wt3` for Acts II and III.
3. **Heart clock.** `bpmAt(T)` is integrated once into a `Float64Array` (`makeBeatClock`) so tempo changes never jump in phase. `pulseAt(T)` drives the heart dot, `beatsAt(T)` drives the pulse line, and the same timestamps should drive the heartbeat audio.
4. **Branch engine.** `BranchScene` converts scene time into branch time `b` (action, then eased rewind), then evaluates `spec.prot(b)` and `spec.other(b)`. Adding or retiming a response only means editing a spec.
5. **Rig.** Forward kinematics (`solve`) with automatic ground contact: the lowest foot or knee touches the lane, and sitting locks the pelvis to seat height. Cycles (`walkPose`, `runPose`) are phase functions, so stride is tied to distance travelled and feet don't slide.
6. **Morphs.** Shadow→animal is a crossfade with a blur bridge (`blur = base + 7·sin(πt)`). Recommended upgrade: an SVG "gooey" filter (blur + alpha threshold) or `@remotion/paths` `interpolatePath` with point-matched silhouettes.
7. **Kinetic type.** `Label` interpolates tracking, scale, and variable axes (`font-variation-settings: 'wdth', 'wght'`) per behavior.

### 13.6 Timing strategy

- `SCENES` in `timeline.ts` is the **single source of truth**. Start frames are derived and never hard-coded.
- Choreography inside scenes uses scene-relative seconds. Retiming a scene means scaling its internal keys.
- The global tracks in `score.ts` are keyed to `S('Sxx') + offset`, so they follow scene retimes automatically.
- **Animatic first:** record temp VO (or TTS), adjust `dur` values to the VO, then replace captions with VO (see 13.9).

### 13.7 SVG and CSS requirements

- **One camera transform per layer group:** `camTransform(cam, parallax)` = `translate(W/2, H/2) scale(zoom) translate(-x·parallax, -y)`. Actors are drawn in a separate `WorldLayer` with the same camera, above the graded plaza, so perceptual grading never touches the protagonist or the Other.
- **Grading** is CSS `filter` on the plaza layer (`saturate`, `brightness`, `blur`). Keep blur ≤ 4 px; it is the most expensive operation.
- **Unique IDs.** Gradient IDs must be unique per instance (`AttentionField` takes an `id` prop). Multiple instances with the same ID will break.
- **No CSS animations or transitions** anywhere. Remotion renders frames independently, and every value must come from the frame.
- **Text:** HTML for type (better kerning and variable axes), SVG `<text>` only for diagram labels. Tabular figures for data.
- **Non-scaling strokes:** add `vector-effect="non-scaling-stroke"` to diagram lines if the camera zooms further than about 1.3.

### 13.8 Character and condition-meter systems

- **Character:** `<Figure x y pose scale facing fill rim heart outline flat>`. The protagonist passes `heart={heartAt(T)}`. Ghosts and shadows pass `flat`. Freeze passes `outline`. Anchors (`anchor(props, 'head'|'heart'|'HN'|'wedge'|'P')`) give world positions for attaching signals such as attention fields, the phone, compass, and wedges.
- **Condition meter:** `Instruments` (Act III) composes the `PulseLine` (tempo = `beatsAt`, color = `conditionColor(levelAt)`, overload copies in Black), the `ConditionRail` (continuous `level` 0–4, gradient fill, active node grows, ≈ranges), the `ConditionReadout` (name · state · ≈range), and the model caveat. `levelAt` is continuous, so color and fill always interpolate. **Rule: never display a single bpm number.**

### 13.9 Audio integration

**Implemented:** `scripts/make-audio.ts` (run with `npm run audio`) synthesizes `public/audio/soundtrack.wav` deterministically from `score.ts`:
- a lub-dub heartbeat placed on the exact beat onsets of `beatsAt`, so sound and visuals cannot drift;
- a filtered ambience bed that follows the condition: low-passed and ducked in Red (auditory exclusion), overlapping and loud in Black, near-silent at the freeze, fading out on the final beat.

`Film.tsx` plays it with a single `<Audio>`. The WAV is git-ignored and regenerated on demand.

**Still to do:**
1. Replace the synthetic bed with designed stems (plaza ambience, the piano "ready" motif, the reversed swell for the rewind, the S04 tape-stop) in `public/audio/`, one `<Audio>` per act, with `volume={(f) => ...}` automation keyed to `levelAt`.
2. **VO:** the script is final and timed (`src/narration.ts` → `npm run vo` → `docs/explainer/vo/`). Render the picture with `--props='{"showCaptions":false,"grain":false}'` for a VO master, then lay the ElevenLabs clips at their cue times (import the `.srt` as markers).

### 13.10 Programmatic vs. authored

| Programmatic (code-generated) | Authored SVG paths |
|---|---|
| Crowd, walk and run cycles, figure rig | Animal silhouettes (sheep, wolf, dog, dog at rest, cat) |
| Pulse line (ECG function), rail, compass, rings, cones, arcs | Wall arch and props (simple primitives in `World.tsx`) |
| Grain, tunnel, matte, misregistration, jitter | Optional: bespoke glyph icons for print or thumbnails |
| Motor-panel traces, reaction brackets, chain | |

### 13.11 How scenes share components

Scenes never duplicate drawing code. They compose `Plaza` + `Crowd`/`CrowdShadows` + `WorldLayer` actors + signals + type. Continuity comes from shared **state functions**. Cross-file ones are exported (`principalsS03`, `branchStatic`, `OTHER_START`, `FREEZE_T`, `wt2`). Same-file ones are module-local (`postureEnd`, `protS17`, `protS18`, `wolfAt`, `dogAt`, `principalsS20`). A later scene therefore starts from exactly the values that ended the previous one.

### 13.12 Transitions (conceptual implementation)

Because the stage persists, transitions are **state interpolations inside scenes**, not `<TransitionSeries>`: world-clock changes (freeze, rewind), light-parameter interpolation (Act I → II → dusk), morph progress (shadows), attention-field parameters (the conditions), matte and tunnel amounts (Red, Black), and camera keyframes. Keep scene boundaries on matching states. If a boundary needs an overlap, extend a `Sequence` with handles rather than crossfading.

### 13.13 Determinism checklist

- No `Math.random`, `Date`, or network at render time. Use `rand(seed)` from `lib/anim.ts`, or Remotion's `random()`.
- Every value is a pure function of `frame` (and constants). Accumulations are precomputed once (beat clock). There is no mutable module state that changes across frames.
- Jitter is re-seeded on `floor(frame / 3–4)`, so frames rendered in parallel or out of order are identical.
- Fonts are self-hosted and gated by `delayRender`. No system emoji.
- Verify by rendering the same frame twice and diffing, and by rendering with different `--concurrency` values.

### 13.14 Known gaps and next steps (priority order)

1. **Audio:** designed stems, music, and VO on top of the generated heartbeat and ambience (13.9).
2. **Morph quality:** gooey or point-matched shadow morphs; refine the dog and wolf silhouettes; add pigeons (Freeze, Black).
3. **Style-frame pass:** lock SF1 plaza wide (S02), SF2 compass (S04), SF3 freeze (S07), SF4 perceived shadow (S10), SF5 capability/intent (S14), SF6 Yellow ring (S18), SF7 Red tunnel (S20), SF8 Black fragmentation (S21), SF9 chain (S23).
4. **Performance:** cache static plaza layers; reduce blur areas; consider `--gl=angle` on GPU machines.
5. **QA:** photosensitivity check (Harding/PEAT), caption timing against VO, color-blind review of the condition colors.
