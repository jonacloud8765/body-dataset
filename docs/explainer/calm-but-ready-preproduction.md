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
