# THE PENGUIN
### Pre-production package: animated music video

**Status:** ⟨draft: timing and character sections are filled in from the source files⟩
**Format:** 1920×1080, 30 fps. Two frames inside it: 2.39:1 letterbox (his film) and full 16:9 with a camcorder viewfinder (the documentary).
**Runtime:** ⟨song duration⟩ plus a ⟨n⟩ s silent epilogue
**Master clock:** the song file. Every shot is placed on its measured beat grid (§1, §13).
**Implementation target:** Remotion (§15)

> **Logline.** A lone penguin walks seventy kilometers inland toward a mountain nobody else will look at, while a documentary crew keeps trying to interrupt him. He knows where he is going. When he gets there, the mountain opens its eyes.

**How to read this document**
- §1 is measurement: what the song and the reference sheet actually contain. Everything after it depends on §1.
- §2–§11 are creative decisions. §12 is the full shot list. §13 is the timeline. §14–§16 are the production handoff.
- Musical positions are written **bar.beat** (for example `33.1` = beat 1 of bar 33, `32.4.5` = the "and" of beat 4 in bar 32). Absolute times are `m:ss.ss`. Bar 1 is the first bar line of the song (§1.3).
- Names in `code style` are reusable components (§15).

---

## 1. Source material

⟨Filled in from the analysis of the song, the vocal stem, and the reference sheet.⟩

---

## 2. Creative concept

### 2.1 The idea: two films fighting over one penguin

The video is made of two films cut together.

1. **The documentary.** A nature-documentary crew is filming the penguin. Their footage is handheld, zoomed, labeled, and faintly condescending. It wants to measure him, explain him, get a quote from him and, when that fails, turn him around. It never looks at the mountain.
2. **His film.** Wide, composed, sincere and heroic. It believes him, and it keeps the mountain in frame.

The video opens as the documentary and slowly becomes his film. In the chorus the crew walks into his film and asks, on camera, "Can we interrupt your journey?" In the bridge he turns and sings straight into their lens. In the final chorus the crew is running behind him through his film. At the end the frame opens wider than either film for the only thing bigger than both: the creator. The last shot belongs to the documentary again: its abandoned camera, lying in the snow, still recording. The documentary gets its ending, just not the one it wanted.

The two films give every line of the song somewhere to stand:

| | **His film** (CINEMA) | **The documentary** (DOC) |
|---|---|---|
| Frame | 2.39:1 letterbox | Full 16:9 with viewfinder UI: `● REC`, timecode, battery, focus brackets, zoom bar |
| Camera | Locked, or slow and deliberate moves | Handheld wobble, snap zooms, focus hunting, reframing late |
| Lens | Wide; he is small in a large world | Telephoto; flattened space, heat shimmer, the mountain is a gray smudge |
| Grade | Rich, directional light; the mountain glows | Flat "video" grade, slightly cool and clipped, grain |
| The penguin | **Sings** (lip sync) when he means it | **Never sings.** He is an animal being observed |
| Text | None | Lower thirds, data tags, the distance counter |
| Point of view | He knows where he is going | Nobody knows why he is going |

**The rule that makes the bridge work:** in the documentary he is silent. The first time his beak opens inside the viewfinder is "Don't turn me around," sung straight down the lens.

### 2.2 Tone

Sincere, funny, lonely, then enormous. The penguin is never in on the joke. The humor comes from the gap between his total seriousness and the absurd things around him: a film crew in the middle of nowhere, a clipboard asking for an interview, a director who physically turns him around, a mountain that is watching him.

- **Direct toward:** deadpan, patient, wide, cold, specific, stubborn, awed.
- **Avoid:** parody of a real documentary or filmmaker, winking at the audience, generic inspirational montage, sadness as the ending.
- **Never shown:** injury, death, a real person's likeness, real place names or logos. The crew's faces are never seen (§6.5).

### 2.3 Rules of the film

1. **The mountain is in almost every exterior shot of his film.** When it is not, that absence is the point (the blizzard, §12).
2. **Screen direction is fixed.** The journey runs left to right. The colony and the sea are always screen left; the mountain is always screen right or dead ahead. Any shot where he faces left is a shot where something is wrong.
3. **His eyes stay on the mountain.** Wherever the camera is, his eyeline points toward the mountain. He looks away from it exactly three times: to look back at the colony ("Turn my back on"), to stare at the crew ("Can we interrupt your journey"), and in doubt ("I'm tryna figure it out").
4. **He walks on the beat.** Every footfall lands on a beat of the measured grid (§6.2). When the music drops out, he stops. When the music doubles, he toboggans.
5. **Every element of the reveal has been seen before.** The creator's silhouette, breath, eyes, footprint and scale are all planted in earlier shots (§3.4). Nothing new appears in the final chorus except the eyes opening.
6. **Text appears only inside the documentary,** or written on something in the world (the crew's clipboard, the end card). No lyric subtitles are burned in; a separate caption file is exported (§15.10).

### 2.4 Why this penguin

The song's premise echoes a well-known image from nature filmmaking: a single penguin that leaves its colony and walks inland toward the mountains instead of toward the sea, and cannot be persuaded back. The usual reading of that image is fatalistic: he is walking to his death, and nobody knows why. The song refuses that reading. He knows where he is going. He is meeting someone.

This video takes the song's side. The documentary carries the fatalistic reading ("nobody knows why"); his film carries the song's reading; the ending proves the song right. This is an original story and original designs. The crew is anonymous and fictional, and nothing imitates a real film, filmmaker, narration style or location.

---

## 3. The creator

"I'm meeting the creator" is the promise the whole song makes. The reveal has to pay off the documentary joke, the mountain, the loneliness and the stubbornness at once, and it has to be the answer to the question the documentary keeps asking: *why that mountain?*

### 3.1 Interpretations considered

| # | The creator is… | Reveal | What it does to the journey | Verdict |
|---|---|---|---|---|
| 1 | **The documentary's director** | He reaches the summit and finds an empty director's chair and a monitor showing his own walk | The journey was staged for television | Rejected. Cynical, and it makes his conviction a dupe. |
| 2 | **The animator** | A giant hand with a stylus; the world is a drawing on a desk | Every hardship was drawn on purpose | Rejected. A well-worn cartoon gag that turns the ending into a joke about the medium and takes his agency away. |
| 3 | **The singer** | A tiny hut on the mountain where a musician is recording this song | The song was about him all along | Rejected. It needs a real performer's likeness, and it shrinks the finale. |
| 4 | **The viewer** | He walks up to the lens; the reverse shot is a screen glow on a dark room | We made him into content | Rejected. Clever but cold, and it scolds the audience at the emotional peak. |
| 5 | **An old penguin** | The first penguin who ever walked away, waiting at the top | He is part of a lineage | Tender but small; kept as a flavor of the chosen idea. |
| 6 | **Nothing** | An empty summit; he watches the sunrise alone | The journey was the point | Rejected. The song says "meeting." |
| 7 | **His reflection** | An ice mirror at the summit | He was the creator all along | Rejected. Cliché. |
| 8 | **The mountain itself** | The mountain is a colossal, ancient penguin of rock, ice and snow, asleep so long the world mistook it for a mountain. It opens its eyes. | He was never walking toward nothing. He was being called home, and the mountain has been looking at him since the first frame. | **Chosen.** |

### 3.2 Why the mountain

- **It answers the question the documentary never can.** Why would a penguin walk toward a mountain? Because it isn't a mountain.
- **It makes the audience rewatch.** The silhouette, the breath, the eyes and the footprint are all on screen long before the reveal (§3.4). On a second viewing the whole video reads differently: every wide shot is a shot of the creator waiting.
- **It keeps the absurdity sincere.** A mountain that is secretly a giant penguin is a ridiculous idea, played completely straight, which is the tone of the whole song.
- **It turns melancholy into wonder without erasing it.** He walked alone for seventy kilometers. He is not alone at the end.
- **It pays off the documentary.** The crew filmed the small penguin for the whole song and never pointed the camera at the most important thing in the landscape. When they finally look up, their camera slides out of their hands.
- **It is literally "the creator."** A penguin shape, at geological scale, with the same eyes as ours: he was made in its image.

### 3.3 Design of the creator

The creator is our penguin's design (§1.6) scaled to a mountain and weathered by ten thousand years of standing still.

- **Asleep, it reads as a mountain.** It stands with its head bowed and its beak resting on its chest. From the colony side, the dark rock of its flanks and back reads as exposed cliffs. Its white front reads as a vast snowfield. Its bowed head is the summit dome, and the beak is a jutting spur below the summit. Snow and ice have smoothed every edge, so at distance nobody would see a penguin.
- **The eyes** are two dark cave mouths under the summit dome, each sealed by a ledge of ice (closed eyelids). When they open, they have the reference penguin's eye design exactly, 400 m across and lit from within by a warm gold. It is the only warm light in the film that doesn't come from the sun.
- **The breath** is a snow plume that lifts off the summit every few bars. Real mountains have wind plumes like this, so nobody questions it; it is also exhaling on a steady rhythm.
- **Scale:** about 2,000 m tall. Our penguin is 0.7 m tall. No shot shows both at true scale and expects the audience to find him. Scale is sold by atmosphere (haze layers), by the crew, and by one shot where the creator's eye fills the frame with the penguin reflected in it.

### 3.4 Seeds: every piece of the reveal, planted in advance

| Seed | First planted | Repeated | Paid off |
|---|---|---|---|
| Silhouette: summit dome plus spur reads as a bowed penguin head | The first frame of the film: a speck on the horizon | Match dissolve from his head in profile to the mountain's profile (Chorus 1) | The rising sun rims the silhouette. For a few seconds it is unmistakable, just before the eyes open. |
| Breath: summit plume on a steady rhythm | Verse 1, "I feel it, I can't explain" | Every wide shot of the mountain; the plume always lands on a downbeat | The final exhale rolls down the slope and ruffles his feathers |
| Eyes: two dark caves with ice ledges | Chorus 1, the first clear view | Night interlude: both caves glint in the aurora for 6 frames | The ledges crack and the eyes open on the last "creator" |
| Footprint: the creator's last step before it stopped | Never mentioned before the bridge | "There's something up ahead now": a lake-sized frozen depression. An overhead shot reveals its shape: a penguin footprint. He looks at his own foot. | It stands up out of the same ice and leaves new footprints |
| It faces the colony: the spur points screen left, toward where he came from | Every wide shot | His POV shots are always framed so the spur points at the lens | Its head turns to look at him |
| Nobody films it | The documentary never frames the mountain in focus | In DOC shots the mountain is always soft and gray at the frame edge | The crew finally tilts up. The autofocus box snaps onto an eye. |

### 3.5 The reveal, beat by beat

Musical positions are set in §12 once the final chorus is measured. The order of beats is fixed:

1. **Arrival.** He reaches the base of the mountain and stops walking for the first time in the film. The music keeps going; he doesn't.
2. **Recognition.** He looks up. The camera tilts up the white face, over the rock flanks, to the bowed summit. The rising sun comes up behind it, and the rim light draws the whole silhouette: a head, a beak, shoulders. The audience gets it a beat before he does.
3. **The eyes open** on the last "creator." The ice ledges crack, snow pours off the brow, and two enormous eyes open with the same design as his, lit gold from within. The letterbox bars slide away: the frame opens to full height for the first time in the film. The creator is too big for his film.
4. **The look.** Extreme close-up on one eye. In its glassy surface, very small, is our penguin, looking up.
5. **The greeting.** The creator lowers its head all the way to the ice. The beak, the size of a ship, stops in front of him. He steps forward and touches it with his own beak. A pulse of warm light runs out across the ice in a ring.
6. **The documentary arrives.** The crew stumbles into frame, sees the creator, and freezes. The camera operator's camera slides off their shoulder into the snow.
7. **The departure** (in the outro). The creator stands up. Avalanches pour off its shoulders, and it pulls its feet out of the ice sheet. It turns inland. He turns with it. They walk away together, the giant in slow motion and him in double time, and their steps land on the same beats. Where the mountain stood, the horizon is empty.
8. **Epilogue** (after the music). The abandoned documentary camera lies tilted in the snow, still recording. Through its viewfinder, two figures, one tiny and one enormous, walk over the horizon. The battery icon blinks empty. End card, typed like a documentary's closing caption:

   > **The penguin was not seen again.**
   > **Neither was the mountain.**

---

## 4. Narrative

### 4.1 Three acts

| Act | Title | Song sections | What happens | He feels |
|---|---|---|---|---|
| I | **Leaving** | Intro, Verse 1 | The documentary finds a penguin facing the wrong way. The distance is measured. He takes one step off the colony's trampled ground, looks back once, and walks. The weather is against him. He goes anyway. | Restless → resolved → alone |
| II | **The Journey** | Chorus 1, ⟨interlude⟩, first half of the Bridge | He sings, the sun comes out, the mountain becomes a destination. The crew walks into his film and asks for an interview; he walks around them. Night falls. The crew sets up camp in his path and physically turns him around, twice. He sings into their lens. A blizzard takes the mountain away. | Joy → persistence → defiance → doubt |
| III | **The Mountain** | Second half of the Bridge, Chorus 2, outro | The storm parts on a giant footprint. The mountain is suddenly close. Dawn. He crosses the last distance with the crew trailing behind him, stops at the foot of the mountain, looks up, and the mountain opens its eyes. | Awe → recognition → belonging |
| — | **Epilogue** | After the last note | The documentary's camera, dropped in the snow, films the two of them leaving. | Wonder, and a laugh |

### 4.2 Beat sheet

The shot list (§12) breaks these into shots. The **bold** beats are the ones the story cannot lose.

**ACT I · LEAVING**
1. **The colony, through the documentary's lens.** Hundreds of penguins, all facing the sea (screen left). One faces inland. The focus brackets find him.
2. **Seventy kilometers.** The documentary's tracking map measures the distance from the colony to the mountains.
3. **That's what they said.** The colony's heads turn toward him in a slow wave. He doesn't look back at them.
4. **His point of view.** The horizon. A speck. Push in: a mountain. The letterbox closes for the first time. We are in his film now.
5. **The first step** off the trampled colony ground onto untouched snow.
6. **Walking out alone.** Extreme wide: one dark dot and one line of footprints on a white field.
7. **The last look back.** He turns to face the colony once. Then he turns his back on it, on the beat.
8. Nothing goes his way: a gust knocks him flat, blue ice takes his feet out from under him, and a drift swallows him to the neck. Each time he gets up with the same face.
9. His own way: the colony's worn trail curves off toward the sea; he steps off it into untouched snow.
10. **"I feel it, I can't explain."** He stops. On the horizon, a plume of snow lifts off the summit, like breath.
11. Every day: the horizon stays fixed while the sun wheels across the sky. The distance counter drops.

**ACT II · THE JOURNEY**
12. **He sings for the first time.** "I'm the penguin / I know where I'm going." Clear sky. The camera circles him until the mountain stands behind him.
13. Heading for the mountain: fast lateral tracking, parallax streaming past. His head in profile dissolves into the mountain's profile. The shapes match.
14. **The documentary interrupts.** Hard cut into the viewfinder. The crew blocks his path. The director holds up a clipboard: WE'RE MAKING A DOCUMENTARY. Flip: CAN WE INTERRUPT YOUR JOURNEY? He stares down the lens for exactly one beat, then walks around them.
15. Joy: he flops onto his belly and toboggans down a long slope. The crew, far behind, flounders in knee-deep snow.
16. ⟨Interlude, if the song has one:⟩ dusk, then night. Aurora. He is tired; he walks slower. **For six frames the mountain's two caves catch the aurora like eyes.**
17. **Don't turn me around.** Night camp in his path, headlamps, REC light. The director picks him up. His feet keep walking in the air, on the beat. He is set down facing the colony. He turns straight back. It happens again.
18. **He sings into their lens.** "Don't care about what you want." The first time his beak opens inside the documentary. The camera operator stumbles backward; the viewfinder UI glitches.
19. **Doubt.** A blizzard. The crew's lights are gone, and so is the mountain. He looks back toward the colony. "I'm tryna figure it out." The only still shot of him in the film.
20. **The world turns; he doesn't.** The camera rolls a full half-turn around him, and the storm and the horizon spin, but he stays pointed the same way, like a compass needle.

**ACT III · THE MOUNTAIN**
21. **Something up ahead.** The storm tears open. He stands at the edge of a vast frozen depression. The camera cranes up to overhead: it is a footprint, penguin-shaped and a hundred meters long. He looks down at his own foot.
22. **"Wow."** He looks up. The mountain fills the sky, moonlit and close. His beak drops open.
23. Dawn. Alpenglow. He sings again, walking harder than ever. Far behind him, the crew is running.
24. The crew's last try: a sign that just says PLEASE?
25. **Arrival.** He reaches the foot of the mountain and stops walking for the first time in the film.
26. **The silhouette.** The sun rises behind the summit, and the rim light draws a head, a beak, and shoulders.
27. **The eyes open** on the last "creator." The letterbox bars slide away and the frame opens to full height.
28. **The reflection.** The creator's eye fills the frame, with a tiny penguin reflected in it.
29. **The greeting.** Beak to beak. A ring of warm light runs across the ice.
30. The crew arrives. The camera slides off the operator's shoulder.
31. **They leave together.** The mountain stands up and walks inland, with him beside it, their steps on the same beats. The horizon is empty.
32. **Epilogue.** The fallen camera, still recording. End card.

### 4.3 Emotional arc

```
wonder   │                                                                  ╭──●──╮
belonging│                                                            ╭─────╯     ╰─ epilogue
awe      │                                                       ╭────╯
defiance │                                    ╭──╮
joy      │                   ╭────╮  ╭──╮    ╭╯  │
resolve  │        ╭───╮     ╭╯    ╰──╯  ╰─╮ ╭╯   │
alone    │  ╭─────╯   ╰─────╯              ╰─╯    │
restless │──╯                                     ╰──╮  doubt (the only stillness)
         └─────────────────────────────────────────────────────────────────────────
           Intro   Verse 1        Chorus 1    ⟨interlude⟩  Bridge      Chorus 2    Outro
```

The two lowest points are placed where the music drops: the white-out in Verse 1 and the blizzard in the Bridge. The highest point is not the loudest moment. It is the greeting, which comes right after the last lyric.

### 4.4 How each lyric is shown

**Literal** means the image shows what the words say. **Shifted** means the image shows something else that means the same thing. **Counterpoint** means the image plays against the words for comedy or irony.

| Lyric | Treatment | What we see | Why |
|---|---|---|---|
| Seventy kilometers | Literal | The documentary map draws a measuring line: `70 KM` | The number is the stakes; state it once, clearly |
| That's what they said | Shifted | "They" is the colony. Heads turn toward him in a wave. | Turns a narration line into a social pressure image |
| Seventy kilometers (repeat) | Shifted | His POV: the actual distance, a white field and a speck | The same number, now felt instead of measured |
| From where I began | Literal | His first footprint on untouched snow | The film's footprint motif starts here |
| I'm the penguin | Counterpoint | The documentary labels him `SUBJECT 01` while he walks out of its frame | He names himself; they number him |
| Walking out alone | Literal | Extreme wide: a dot and a line of footprints | Isolation needs scale, not a sad face |
| Turn my back on / everything I know | Literal | He looks back once, then physically turns his back on the colony | The lyric describes an action; do the action |
| Nothing's going my way | Counterpoint | Three slapstick mishaps, played deadpan | The world is literally not going his way |
| So I'll go my own way | Literal + joke | The last mishap (slipping on blue ice) sends him sliding off the worn trail in the right direction | His own way starts by accident and he keeps it |
| I feel it, I can't explain | Shifted | The summit breathes a plume; he stops to feel it | We don't explain it either; we plant the breath |
| I'm the penguin / And I'm walking every day | Shifted | Time-lapse: the sun wheels, the horizon holds, the counter drops | "Every day" is time; show time passing |
| I'm the penguin / I know where I'm going | Literal | He sings; the camera orbits until the mountain is behind him | First lip sync; the destination is made explicit |
| Heading for the mountain | Literal | Tracking shot; profile-to-mountain match dissolve | Speed, plus the key seed |
| I'm meeting the creator, yeah | Shifted | The sun flares off the mountain's white face | Promise, not reveal |
| We're making a documentary | Literal (diegetic) | The clipboard, the boom mic, the viewfinder | The line is spoken by the crew, so the crew appears |
| Can we interrupt your journey | Literal + counterpoint | They ask; he stares one beat and walks around them | Deadpan refusal, no words |
| Don't turn me around ×2 | Literal | The director physically turns him around; he turns back | The lyric becomes the gag |
| Don't care about what you want | Shifted | He sings into their lens | The subject talks back to the documentary |
| I'm tryna figure it out | Literal | Blizzard; stillness; he looks back once | The only doubt in the film, held long enough to count |
| Don't turn me around ×2 | Surreal | The world spins; he stays pointed at the mountain | Escalates the gag into an image of will |
| There's something up ahead now | Literal, then surreal | The giant footprint | A mystery the audience can read before he does |
| And I'm almost there, wow | Literal | The mountain, close; his beak drops open | "Wow" is a reaction; give him the reaction |
| Final chorus | Literal, bigger | Every line of Chorus 1 is re-staged at the mountain | Callbacks turn repetition into progress |
| I'm meeting the creator (last) | Literal | The eyes open | The one lyric that must be shown exactly |

---

## 5. Visual direction

### 5.1 Style

⟨The rendering language (line, fill, shading) is taken from the reference sheet; see §1.6.⟩ The world is built to match the character, not the other way round:

- **2.5D layered illustration.** Flat-shaded vector forms with smooth gradient light, stacked in depth. It is not a 3D render and not flat clip art.
- **Depth comes from atmosphere.** Every step back in depth adds haze in the section's sky color. The mountain's distance is sold by haze more than by size.
- **Snow is never plain white.** Lit snow is `SNOW_HI`, shadowed snow is a cool blue, and the surface always carries a texture: sastrugi (wind-carved ridges running with the wind), drifts, or sparkle in sun.
- **Shape language.** The ice world is long horizontals: horizon, drift lines, cloud bands. The penguin is round and vertical, the only upright thing in most frames. The crew are lumpy orange blobs. The mountain is the only big vertical until the creator stands.
- **Scale.** The penguin is 0.7 m tall. Wide shots let him be very small: under 3% of frame height in extreme wides. The audience learns to find the dark dot.

### 5.2 Locations

| Location | Look | Section |
|---|---|---|
| **The colony** | A rocky, trampled shoreline by a dark sea with floating ice. Hundreds of penguins facing the water. Everything is gray-blue and crowded; it is the only crowded place in the film. | Intro |
| **The plain** | A flat white field to the horizon, with sastrugi and a low distant range. In the white-out the horizon disappears completely. | Verse 1 |
| **Blue ice** | Wind-polished patches of glassy blue ice, reflective and treacherous | Verse 1 (mishaps) |
| **The slope** | A long gentle incline with a wind lip at the top | Chorus 1 |
| **The night plain** | The plain under stars and aurora; the snow takes the aurora's color | ⟨Interlude⟩ |
| **The camp** | A dome tent, a sled, a tripod and a light stand throwing a harsh cone, set down in the middle of nowhere | Bridge |
| **The storm** | Blizzard: visibility about 30 m, no horizon, snow in every direction | Bridge |
| **The footprint** | A 100 m depression of blue ice with a snow rim and cracks; from above, a penguin footprint | Bridge |
| **The foot of the mountain** | An ice apron, séracs, and a white face that rises past the top of the frame | Chorus 2 |
| **The empty horizon** | The Refrain frame with nothing in it but footprints | Outro |
| **The tracking map** | The documentary's graphic: paper white, contour lines, a grid, the coast, the colony dot, a triangle for the mountain | Intro, Chorus 2 |

### 5.3 The documentary look

- **Viewfinder:** `● REC` top left (the dot blinks on even beats), `TC hh:mm:ss:ff` top right (the song's own time), battery icon beside it, thin safe-frame corners, focus brackets around the subject, and a zoom bar that appears during zooms.
- **Image:** 16:9 full frame; telephoto compression; lifted blacks, clipped highlights, −25% saturation, slight green-cyan cast; heavier grain and a vignette; faint chromatic aberration at the edges.
- **Behavior:** handheld drift, zooms that overshoot and settle, focus that hunts when he moves, reframing half a beat late.
- **Labels:** lower thirds in the documentary's voice: `THE COLONY · DAY 1`, `SUBJECT 01`, `70.0 KM TO THE MOUNTAINS`, `DAY 2`, `NIGHT CAMP`. The voice is institutional and certain, and it is wrong about everything that matters.

### 5.4 Typography

| Role | Font | Settings at 1080p |
|---|---|---|
| Viewfinder UI | IBM Plex Mono 500 | 26 px, UPPERCASE, tracking +0.06em, `UI` |
| Lower-third label | Archivo 600, width 88 | 40 px, UPPERCASE, tracking +0.14em |
| Lower-third tag | IBM Plex Mono 400 | 24 px, UPPERCASE, tracking +0.08em, 75% opacity |
| Distance counter | IBM Plex Mono 500, tabular | 30 px |
| Clipboard | Permanent Marker | Sized to the card, dark ink on white |
| End card | Courier Prime 400 | 44 px, sentence case, centered, type-on |

### 5.5 Weather and atmosphere

Weather carries the emotion in place of dialogue.

| Weather | Meaning | Where |
|---|---|---|
| Still, pre-dawn air | Before the decision | Intro |
| Ground drift (wind skimming snow) | Constant resistance; always blowing against him, right to left | Throughout the journey |
| White-out | Alone in nothing | Verse 1 |
| Clear sky, sparkle | Certainty | Chorus 1 |
| Aurora | Wonder, and the mountain watching | ⟨Interlude⟩ |
| Blizzard | Pressure and doubt | Bridge |
| The storm tearing open | Revelation | "There's something up ahead now" |
| Breath plume | The mountain is alive | Every wide shot |

### 5.6 Footprints

His footprints are the film's thread. Each is a small print matching the reference foot, pressed into the snow with a soft shadow, and each appears on the exact frame the foot lands (on the beat). Behind him they form a line that runs back toward the colony. They are shown in three scales: the line in extreme wides, a single print in close-up ("From where I began"), and the colossal print in the bridge, which has his exact shape.

---

## 6. Character direction

### 6.1 Model sheet

⟨Taken from the reference sheet: proportions, silhouette, markings, colors, eyes, beak, feet, views, expressions, and the rules that keep the penguin consistent.⟩

### 6.2 The walk

A penguin waddle, locked to the music.

- **One step per beat** by default. One full cycle (left and right) takes two beats. The foot's contact frame is the beat frame.
- **Half-time** (one step every two beats) means fatigue: the white-out, the night, and after the blizzard.
- **Double-time** means joy or urgency: the run into the toboggan, and the final approach.
- **Body roll** ±7° toward the planted foot, peaking at contact. **Bob:** 2% of body height, lowest at contact.
- **Head stabilization:** like a real bird, the head stays level while the body rolls. His eyes never bounce off the mountain.
- **Flippers** held 15–25° out from the body for balance, with a small counter-swing.
- **Stride:** 0.18 body heights per step. The feet lift only 5% of body height; he shuffles more than he steps.

### 6.3 Acting states

| State | Where | Body | Head and eyes | Flippers | Feet and timing |
|---|---|---|---|---|---|
| **Restless** | Intro | Upright, slight lean inland | Eyes on the horizon; small glances at the colony | Twitching | Weight shifts, small shuffles, off the beat |
| **Resolved** | First step, Verse 1 | Chest forward | Level, locked on the mountain | Back and slightly out | On the beat |
| **Alone** | White-out | A bit smaller: shoulders in | Level, but the eyes narrow against the white | Close to the body | Half-time |
| **Frustrated** | Mishaps | After each fall, a full-body snow shake (8 frames) | One slow blink | A single flap to shake off snow | Back on the beat right away |
| **Wonder** | "I feel it," the plume | Still | Head tilts 8°; pupils widen | Slowly lower | Stops |
| **Joyful** | Chorus 1 | Bouncier roll (±10°) | Up | Out | Double-time, then belly flop |
| **Deadpan** | "Can we interrupt your journey" | Square to camera | A one-beat stare down the lens, no expression at all | Still | Stops; walks around them on the next downbeat |
| **Tired** | ⟨Interlude⟩ | Slumped; bigger roll | Lower; slower blinks | Hanging | Half-time; a stumble on an off-beat |
| **Defiant** | "Don't care about what you want" | Squared stance facing the lens | Beak up; eyes wide and hard | Raised, pushed back | Planted |
| **Doubt** | "I'm tryna figure it out" | **Completely still.** The only still shot of him in the film. | Head turns slowly back toward the colony, then forward | Limp | Nothing |
| **Awe** | "Wow" | Leaning back slightly | Head tilts up; beak drops open; pupils at maximum | Drop | Stops |
| **Confident** | Chorus 2 | Chest out, full height | Up, on the mountain | Wide | On the beat, driving |
| **Recognition** | The reveal | He stops at the foot of the mountain | Looks all the way up; one slow blink | Still | Still |
| **Belonging** | The greeting | Bows his head, then steps in | Eyes close at the beak touch | Open slightly | One step forward |

### 6.4 Singing

- He sings only in his film, and only where §12 flags `sing: true`: the choruses, the "wow," and "Don't care about what you want" into the documentary lens.
- The beak opens from the vocal envelope (§15.4), which gives amplitude sync without phoneme shapes. A beak doesn't need visemes; timing is what reads.
- On strong syllables he adds a small head nod (3°) and his eyes squeeze slightly.
- When he isn't singing, the song is his inner voice and his beak stays shut.

### 6.5 The crew

- Three anonymous figures in orange expedition parkas: **Director**, **Camera**, **Sound**. The hoods have fur ruffs and dark openings, and a face is never drawn.
- They move like people in deep snow: heavy, bundled, slow, sinking to the knees where he walks on top.
- They are not villains. They are earnest, cold, and completely wrong about what they are filming.
- They never speak on screen. Their lines exist only as the clipboard signs.
- In DOC shots they are mostly off screen (we are the camera). In his film they are specks behind him, until the bridge brings them in close.

### 6.6 The colony

About 300 simplified penguins in the colony's layer stack. They all face the sea. They shuffle idly, and on "That's what they said" their heads turn toward him in a wave rippling out from the nearest, each head on a slightly later frame. None of them follows him.

### 6.7 The creator's performance

- **Asleep:** it doesn't move, except the breath plume on phrase downbeats.
- **Waking:** hairline cracks run through the eye ledges, snow sifts off the brow, then the ledges break away and the eyes open. This takes 2–4 beats.
- **Looking:** its head turns down and slightly left toward him: 2 bars, very slow, heavy easing.
- **The greeting:** its head lowers to the ice over several beats, and its breath stirs his feathers. Its eyes half-close at the beak touch, the same way his do.
- **Standing:** it rises over several bars. Avalanches pour off its shoulders, and its feet pull out of the ice with fountains of snow.
- **Walking:** each of its steps lands on a downbeat (one step per bar) while he takes four beneath it, so their feet land together on every bar line.

---

## 7. The mountain

The mountain is a character that is asleep for the whole film. It is in almost every exterior shot of his film. Its size, clarity and light change by section, and one composition, **the Refrain**, keeps coming back so its growth can be measured.

### 7.1 Stages

| Stage | Where | Height in frame | Atmosphere | What can be seen | Light on it | Sign of life |
|---|---|---|---|---|---|---|
| **M0 · Rumor** | Intro | 1–2% (a speck; clearer in his POV) | Heavy haze, 70% | Silhouette only, barely darker than the sky | Pre-dawn, none | None |
| **M1 · Landmark** | Verse 1 | 2–4% | 55% | Silhouette; the rock/snow split just visible | Overcast, flat; it can vanish in the white-out | First breath plume ("I feel it") |
| **M2 · Destination** | Chorus 1 | 5–12% | 40% | Summit dome, spur, flanks, faint cave shadows | Clear sun from screen right; the white face lights up | Plume on downbeats; the profile match dissolve |
| **M3 · Presence** | ⟨Interlude⟩ | 12–20% | 25% | Ridges, the two caves | Moon and aurora | **Six-frame eye glint** |
| **M4 · Wall** | Bridge, after the storm | 30–60% (fills the sky) | 10% | Ice cliffs, the caves and their ice ledges, snow texture; the footprint at its base | Silver moonlight | Its breath is felt as wind |
| **M5 · Colossus** | Chorus 2 | Larger than the frame; the camera has to tilt | 0–5% | Everything | Alpenglow, then sunrise behind it (rim light) | Breath rolls down the slope; **the eyes open** |
| **M6 · Absence** | Outro | Gone | — | Empty horizon | Gold day | Its footprints |

### 7.2 The Refrain composition

A fixed frame that returns once per stage. The horizon is at 58% of frame height. He is a small dark figure on the left-third line, walking right. The mountain is on the right-third line. The frame is locked, with no camera move.

| Refrain | Where | Mountain height | Light | What has changed |
|---|---|---|---|---|
| R1 | End of Intro | 1.5% | Pre-dawn | He has just left |
| R2 | End of Verse 1 | 3% | Late afternoon | First day done |
| R3 | End of Chorus 1 | 10% | Hard noon | The crew is a speck behind him |
| R4 | ⟨Interlude⟩ | 18% | Night, aurora | He is walking slower |
| R5 | End of Bridge | 55% | Moonlight | He is standing still, looking up |
| R6 | Chorus 2 | Larger than the frame: only the white face and a sliver of sky | Dawn | Nothing left to walk toward but up |
| R7 | Outro | 0%: empty | Gold | The Refrain frame, empty except two sets of footprints |

R7 is the payoff: the same frame the audience has learned to read as progress, now with nothing in it.

### 7.3 Silhouette rules

- Seen from the colony side, the summit dome sits left of center on the massif. The spur (the beak) juts down and to the left, toward the colony and toward him.
- At M0–M2 the outline must read as a mountain. Its penguin-ness comes only from proportion: dome, spur, sloping shoulders, a broad white face. No eyes, no symmetry, no smile.
- At M5 the rim light is the first time the outline is drawn as one clean continuous line. That line is the reference penguin's silhouette in a bowed-head pose (§1.6).
- The breath plume leaves from just above the spur (the nostrils of the beak). It drifts screen left, toward him.

### 7.4 In the documentary

The documentary never frames the mountain as a subject. In DOC shots it is soft, gray, and at the edge of the frame, and the focus brackets ignore it. The one exception is the payoff: in Chorus 2 the crew tilts up, and the autofocus box snaps onto an eye.

---

## 8. Camera language

### 8.1 Height means point of view

- **His film is shot from his height or lower** (lens 20–50 cm off the ice). We are with him; the world is big.
- **The documentary is shot from a standing human's height,** looking down at him. They are observing an animal.
- **The creator is shot from far below** once it wakes. For the first time the camera looks up at something the way the documentary looked down at him.

### 8.2 Shot scales and what each is for

| Scale | Used for | Frequency |
|---|---|---|
| **EWS** (he is under 3% of frame height) | Isolation, distance, weather; the Refrain | One per section, held long |
| **WS** | Journey progress; staging gags | Most common in the verses |
| **MS** | Behavior, comedy, the crew | Chorus DOC shots, bridge gags |
| **MCU / CU** | Singing, decisions, doubt | Choruses, bridge |
| **ECU** | Feet (footprints), eyes, beak, the creator's eye | Punctuation, 1–2 bars each |
| **POV** | His view of the mountain; the spur always points at the lens | Once per act |
| **Overhead** | The map, the footprint reveal, the spin | Three times |

### 8.3 Movement and what each means

| Move | Meaning | Where |
|---|---|---|
| **Locked** | Comedy (a gag needs a still frame) and isolation (the landscape doesn't care) | Refrains, gags, doubt |
| **Lateral track** at his walking speed | The journey; parallax streams past | Verse, choruses |
| **Slow push-in** | Realization | "I feel it," "wow," the silhouette |
| **Orbit** (90–180°) | Putting the destination behind him | "I know where I'm going" |
| **Tilt up** | Scale | The mountain face, the creator |
| **Crane up to overhead** | Revealing a shape the ground can't show | The footprint |
| **Roll** | The world is being turned; he is not | Bridge only |
| **Whip pan** | A decision, used as a transition | "Turn my back on" |
| **Pull-out** | Final scale | The creator stands; the epilogue |
| **Handheld, snap zoom, focus hunt** | The documentary | DOC shots only |

**Stillness budget:** at least a third of the shots in his film are locked. The more the music moves, the more the camera is allowed to move. In the choruses the camera moves; in the verse and the doubt beat it mostly doesn't.

### 8.4 Lens behavior in 2.5D

The world is built from depth layers (§15.5). A "wide lens" means strong parallax between layers and a small subject. A "telephoto" means weak parallax, a large compressed background, and haze (the documentary). Focus is simulated with per-layer blur: his film has deep focus, and the documentary blurs everything that isn't the subject, including the mountain.

---

## 9. Color and lighting arc

### 9.1 Palette

| Token | Hex | Use |
|---|---|---|
| `SNOW_HI` | `#F4F7FA` | Lit snow |
| `SNOW_MID` | `#D9E2EC` | Snow, flat light |
| `SNOW_SHADE` | `#A9B8CC` | Snow in shadow (cool) |
| `ICE_BLUE` | `#7FB3D5` | Blue ice, the footprint |
| `ICE_DEEP` | `#2E5E82` | Crevasse and ice depth |
| `ROCK` | `#3A3F4A` | Exposed rock, the mountain's flanks |
| `SEA` | `#1D3348` | Open water at the colony |
| `NIGHT` | `#0B1426` | Night sky |
| `NIGHT_2` | `#16233F` | Night horizon, blizzard |
| `PREDAWN` | `#8FA3BF` | Intro sky |
| `OVERCAST` | `#CDD5DE` | White-out sky |
| `SKY_TOP` / `SKY_LOW` | `#4F93D2` / `#BFE0F5` | Clear-day gradient |
| `DUSK_LILAC` / `DUSK_PINK` | `#9C8CC2` / `#E6A7B5` | Dusk |
| `AURORA_G` / `AURORA_T` / `AURORA_V` | `#4CF2B0` / `#2BC4C9` / `#8A6CF0` | Aurora |
| `MOON` | `#D8E6FF` | Moonlight |
| `ALPENGLOW` | `#F4A0A8` | Dawn on the mountain face |
| `SUN_GOLD` | `#FFC870` | Sunrise rim |
| `CREATOR_GOLD` | `#FFB547` | The creator's eyes and the greeting pulse; used nowhere else |
| `PARKA` | `#F26A21` | The crew's parkas; the only saturated warm color before dawn |
| `REC` | `#FF2D2D` | The REC dot, the battery warning |
| `UI` | `#F2F2F2` at 85% | Viewfinder UI and lower thirds |

### 9.2 Arc

| Section | Time of day | Key light | Palette | Saturation | Contrast | Feeling |
|---|---|---|---|---|---|---|
| Intro | Pre-dawn | None, only sky fill | `NIGHT_2` → `PREDAWN`, `SNOW_SHADE` | 55% | Low | Cold, quiet, restrained |
| Verse 1 | Overcast, turning to white-out | Flat and shadowless | `OVERCAST`, `SNOW_MID`; the horizon disappears | 45% | Lowest in the film | Alone in nothing |
| Chorus 1 | Clear noon | Hard sun from screen right, the mountain side | `SKY_TOP`, `SNOW_HI`, blue shadows | 100% | High | Open, certain, joyful |
| ⟨Interlude⟩ | Dusk to night | Low sun, then the moon | `DUSK_*`, then `NIGHT` and aurora | 80% | Medium | Tired, wondrous |
| Bridge (first half) | Night blizzard | Headlamps and the REC light; white noise of snow | Near-monochrome `NIGHT_2` plus `PARKA` and `REC` | 25% | Harsh | Pressure, then doubt |
| Bridge (second half) | The storm parts: moonlight | `MOON` from above the mountain | Silver-blue, `ICE_BLUE` footprint | 60% | High | Mystery, awe |
| Chorus 2 | Dawn to sunrise | Alpenglow on the face, then the sun behind the summit (rim) | `ALPENGLOW`, `SUN_GOLD`, blue shadows toward camera | 100%+ | Highest | The biggest the film gets |
| The reveal | Sunrise | The creator's eyes | `CREATOR_GOLD` spreads; the whole grade warms | 100% | High | Recognition |
| Outro | Gold day | Sun | Warm snow, clean sky | 90% | Medium | Peace |
| Epilogue | Same day, seen by the documentary | Flat | DOC grade, `REC` | 50% | Low | The documentary's version |

### 9.3 Lighting rules

- **The light comes from the mountain.** From Chorus 1 on, the key light is always on the mountain's side of frame. He walks into the light; the colony side is always in shadow. At the reveal, the light source turns out to be the creator itself.
- **Warm is earned.** Apart from the crew's orange parkas, nothing warm appears before dawn. `CREATOR_GOLD` appears only in the eyes and the greeting.
- **The DOC grade is applied on top** of whatever the section's light is: lifted blacks, clipped highlights, −25% saturation, a slight green-cyan cast, grain, vignette.

---

## 10. Visual comedy

### 10.1 Rules

1. **He never does a double-take.** His reactions are a slow blink, a one-beat stare, or a small head tilt. He is not in a comedy.
2. **Gags get locked frames.** The camera doesn't move during a joke; the cut lands on the beat after it.
3. **Musical rests are punchlines.** Wherever the arrangement leaves a gap, the stare goes there (§12 pins each gap to the measured music).
4. **Three, then change the rule.** Mishaps come in three; turn-arounds come twice, and then the world turns instead.
5. **No gags from "There's something up ahead now" until the greeting.** The crew's collapse after the greeting is the release.

### 10.2 Running gags

| Gag | Beats |
|---|---|
| **The colony faces the sea** | Intro: hundreds of backs; one face. The wave of turning heads on "That's what they said." |
| **Mishaps, deadpan** | Verse 1: gust (flat on his back), blue ice (feet out, belly slide), drift (buried to the neck). The belly slide carries him the right way. |
| **The clipboard** | Chorus 1: WE'RE MAKING A DOCUMENTARY → CAN WE INTERRUPT YOUR JOURNEY? Chorus 2: PLEASE? |
| **The boom mic** | The fluffy windscreen follows him around like a hungry bird and dips into his film's frame uninvited. |
| **Snow is harder for humans** | The crew sinks to the knees; he waddles over the crust. |
| **Turned around** | Bridge: lifted, feet still walking in the air on the beat, set down backward, turns right back. Twice. Then the world spins instead. |
| **The battery** | The viewfinder's battery icon drains over the whole film: full in the Intro, one bar by the Bridge, blinking empty in the epilogue. |
| **The camera** | The camera operator loses him in every DOC shot: the focus brackets lag, overshoot and hunt. In the epilogue the fallen camera frames the only perfect shot in the documentary. |
| **The end card** | "The penguin was not seen again. Neither was the mountain." |

---

## 11. Transitions

Every cut has a reason. The default cut is a hard cut on a bar line. The transitions below are the exceptions, each tied to something in the world.

| Transition | How it works | Motivation | Musical placement | Where |
|---|---|---|---|---|
| **Power-on** | Black; REC dot; UI elements pop in one by one; exposure settles from white | The documentary's camera starts | First audible note | Film start |
| **Letterbox slam** | Matte bars slide in from top and bottom in 4 frames; the viewfinder UI blinks off | Entering his film | A downbeat or snare hit | DOC → CINEMA |
| **REC pop** | Bars retract in 4 frames; the UI pops on with the REC dot | The documentary takes the frame back | A downbeat | CINEMA → DOC |
| **Footprint to map** | Top shot of his footprints; the prints shrink into the dotted track on the tracking map | Footprints are data to the documentary | Across a bar line | Intro, Chorus 2 |
| **Whip pan** | He turns; the camera whips the same way (12 frames, motion blur) and the cut hides in the blur | His decision | Lands on beat 1 | "Turn my back on" |
| **Body wipe** | He waddles past the lens, and his black back fills the frame for 3–4 frames | His motion | The cut is on the frame where the frame is fully black, on a beat | Verse, Chorus 1 |
| **Gust wipe** | A wall of blown snow crosses left to right and reveals the next shot behind it | Wind | Starts on a swell (cymbal, riser) and clears on the downbeat | Section changes |
| **Horizon hold** | The horizon line stays at the same height across a series of cuts while the time of day changes | Time passing | One cut per beat or per bar | "Every day" |
| **Profile match** | His head in profile dissolves into the mountain's silhouette | The key seed of the reveal | 2-beat dissolve centered on a downbeat | Chorus 1 |
| **Blink** | He closes his eyes on a rest and opens them somewhere later | Fatigue, sleep | On a rest | Interlude |
| **Aurora fold** | The aurora's ribbons fold down into the pink band of dawn | Night into day | Across the Bridge → Chorus 2 boundary | Into Chorus 2 |
| **The spin** | A 180° camera roll around him resolves into the next shot | The world turning | Two bars, landing on a downbeat | Bridge |
| **Crane to overhead** | The camera rises until the ground's shape reads | Revealing the footprint | Across a phrase | Bridge |
| **Letterbox opening** | The bars slide off the top and bottom edges; the image extends to full frame (not a cut) | The creator is bigger than his film | On the last "creator" | The reveal |
| **Camera drop** | The DOC image tumbles, hits the snow, and comes to rest tilted | The operator drops it | On the release after the greeting | Into the epilogue |

**Not used:** generic crossfades in fast sections, spins or zooms without a motivating move, and flashes to white (the only full-frame white is the Verse 1 white-out, and that is weather).

---

⟨§12 Shot list and §13 Timeline are built from the measured song.⟩

---

## 14. Asset plan

No external art, stock footage or sound libraries are assumed. Everything except the three source files is built in code, and the build is deterministic (§15.9).

### 14.1 Existing reference assets

| ID | Asset | Source | Used for |
|---|---|---|---|
| A01 | Song master | `penguin/source/⟨song⟩` | The soundtrack and the master clock. Copied unmodified to `app/public/audio/`. |
| A02 | Vocal stem | `penguin/source/⟨vocals⟩` | Analysis only: line timing and the per-frame vocal envelope that drives lip sync. Never mixed into the soundtrack. |
| A03 | Penguin reference sheet | `penguin/source/⟨sheet⟩` | The model sheet (§6.1). A copy in `app/public/ref/` is used for side-by-side QA overlays and never appears in the film. |

### 14.2 Character animation (SVG rigs, React components)

| ID | Asset | Spec |
|---|---|---|
| C01 | **Penguin rig** | Built from A03, part for part (§6.1). Views: side (mirrored for left/right), three-quarter front, three-quarter back, front, back. Parts: body, belly patch, head, eyes (lids, pupils, highlights), beak (upper and lower, hinged), flippers L/R, feet L/R, tail. Pose library: stand, walk (beat-locked), toboggan, fallen, buried, lifted (dangling, feet walking), look back, look up, doubt, shake, bow, beak-touch. Expression channels: eye openness, pupil size, brow tilt (if the sheet has brows), beak open. |
| C02 | Colony penguins | A reduced C01 (silhouette, belly, head turn only), instanced about 300 times with seeded variation: scale ±8%, value ±4%, idle phase, head-turn delay. |
| C03 | **The crew** | Three figures in `PARKA` orange expedition parkas: DIRECTOR (clipboard, headlamp), CAMERA (shoulder camera with a red tally light), SOUND (boom pole with a gray fuzzy windscreen). Hood with a fur ruff and a dark opening; a face is never drawn. Mittens, boots. Actions: trudge, sink to the knees, stumble, point, hold up the clipboard, lift the penguin, drop the camera. |
| C04 | **The creator** | C01's design at mountain scale, textured with rock, snow and ice. States: asleep (it is the mountain, §7), ledges cracking, eyes open, head lowered to the ground, standing with avalanches, walking. The eyes are C01's eyes, scaled, lit `CREATOR_GOLD`. |

### 14.3 Background environments (SVG layer stacks)

| ID | Location | Layers (far → near) |
|---|---|---|
| E01 | **Sky** (all exteriors) | Gradient by time of day (a 0–24 h parameter), sun or moon disc with halo, cloud bands |
| E02 | Stars | Seeded point field, twinkle by noise, fades with dawn |
| E03 | Aurora | 3–4 ribbon curtains; gradient fills; noise-driven sway; vertical ray texture |
| E04 | Distant range | Seeded ridgelines (low nunataks), 3 haze levels |
| E05 | **The mountain** | C04 in its asleep state, parameterized by stage M0–M6 (§7.1) and light |
| E06 | Ice plain | Mid and near ground planes, sastrugi strokes (wind-carved ridges), blue-ice patches, sparkle |
| E07 | The colony | Dark sea with ice floes, rocky shore, trampled ground, C02 crowd |
| E08 | The slope | Long gentle incline with a wind lip; used for the toboggan run |
| E09 | The camp | Dome tent, equipment sled, tripod, light stand with a harsh cone of light, cables in the snow |
| E10 | **The giant footprint** | A 100 m blue-ice depression shaped like the reference foot, snow rim, crack network; reads as a frozen lake from the ground and as a footprint from overhead |
| E11 | Base of the mountain | Ice apron, séracs, the vertical white face (a large textured layer that exceeds the frame) |
| E12 | Empty horizon | E06 with no mountain; two lines of footprints, one tiny and one enormous |
| E13 | **Tracking map** | Documentary map graphic: coastline, colony dot, contour lines, grid, the mountain as a triangle marker, dotted track, scale bar, `70 KM` measure |

### 14.4 Particle systems (deterministic: position is a pure function of frame, seed and index)

| ID | System | Spec |
|---|---|---|
| P01 | Snowfall | Three depth layers (far, mid, near); density and wind angle are shot props; near flakes are bokeh-blurred in DOC |
| P02 | Ground drift | Thin horizontal streaks skimming the surface, left to right |
| P03 | Gust wall | A dense band of blown snow crossing the frame in 10–16 frames (the gust wipe, §11) |
| P04 | Blizzard | Full-frame dense snow plus noise fog; reduces visibility to about 30 m |
| P05 | Plume / breath | Billowing puffs from the summit (and, at the end, from the creator's beak) |
| P06 | Kick-up spray | Snow from feet, falls and the toboggan |
| P07 | Avalanche | Cascading snow sheets off the creator's shoulders |
| P08 | Sparkle | Glints on sunlit snow, synced to hi-hats or shimmer where the music has them |
| P09 | Breath vapor | Small puffs from the crew's hoods in the cold |
| P10 | Greeting ring | An expanding ring of `CREATOR_GOLD` light across the ice, with a few sparks |

### 14.5 SVG and CSS interface elements (documentary layer)

| ID | Element | Spec |
|---|---|---|
| U01 | **Viewfinder** | `● REC` (dot blinks on every other beat), timecode `TC 00:01:23:12` (song time), battery icon (drains over the film), focus brackets (lagging track with overshoot and hunt), zoom bar `W ▮▮▮▯▯ T`, safe-frame corners |
| U02 | Lower third | Two lines, type-on at 3 frames per character: a label (`THE COLONY · DAY 1`) and a data tag (`SUBJECT 01 · ADULT`) |
| U03 | Distance counter | `70.0 KM`, tabular figures; decreases with the journey (§13.3) |
| U04 | Clipboard signs | Thick marker lettering on white card: `WE'RE MAKING A DOCUMENTARY`, `CAN WE INTERRUPT YOUR JOURNEY?`, `PLEASE?` |
| U05 | Letterbox matte | 2.39:1 bars; animated in/out (§11) |
| U06 | End card | Typewriter type-on, centered, on the epilogue image |
| U07 | Viewfinder glitch | Line tearing, UI jitter and a brief RGB split when he sings into the lens |

### 14.6 Camera effects

| ID | Effect | Spec |
|---|---|---|
| K01 | **2.5D camera** | Position, zoom, roll; depth-scaled parallax per layer |
| K02 | Handheld | Two octaves of seeded noise on position and roll; amplitude by shot (DOC only) |
| K03 | Snap zoom and focus hunt | Zoom overshoot with a damped spring; blur pulses while the brackets hunt |
| K04 | Depth of field | Per-layer blur; DOC blurs non-subject layers |
| K05 | Motion blur | Directional smear for whip pans and the toboggan (stacked offset copies) |
| K06 | Grades | Per-mode filters and overlays: the CINEMA grade by section (§9), the DOC grade on top |
| K07 | Grain and vignette | Seeded grain texture offset per frame; DOC grain is heavier |
| K08 | Flare | Sun and creator: glow, streak and ghost circles along the flare axis |
| K09 | Chromatic aberration | DOC only, subtle; strong during the glitch |

### 14.7 Sound effects (optional layer)

The song is the soundtrack. Effects are only placed where the song leaves space (the pre-roll, if any, and the epilogue), are synthesized in code, and can be turned off with one flag.

| ID | Sound | Where |
|---|---|---|
| X01 | Wind bed (filtered noise with slow gusts) | Epilogue; pre-roll if used |
| X02 | Camcorder "REC" double beep | Power-on (only if it doesn't collide with the first note) |
| X03 | Soft thud into snow | The camera drop, if it falls after the last note |

### 14.8 Fonts (self-hosted, open licenses)

| Font | Use |
|---|---|
| IBM Plex Mono | Viewfinder UI, data tags, distance counter |
| Archivo (variable) | Lower-third labels, map labels |
| Courier Prime | End card |
| Permanent Marker | Clipboard lettering |

---

## 15. Remotion production blueprint

### 15.1 Project layout

```
penguin/
  source/                     the three source files, untouched
  analysis/
    analyze.py                measurement (tempo, grid, bars, features, vocals, lines)
    lyrics.txt
    out/                      raw.json + overview/detail plots (regenerable)
    song-map.json             curated and verified: grid, sections, line and word cues
  storyboard/
    shots.yaml                THE SHOT LIST: one entry per shot, musical cues + all creative fields
    build.py                  shots.yaml + song-map.json -> app/src/gen/timeline.json and the §12 table
  app/                        Remotion project
    remotion.config.ts        pre-installed Chromium, JPEG frames, 'angle' GL
    public/
      audio/song.<ext>        the master (A01)
      data/vocal-envelope.json  per-frame vocal level (0-1) at 30 fps, from A02
      fonts/                  self-hosted fonts
      ref/                    the reference sheet, for QA overlays only
    src/
      index.ts, Root.tsx      compositions: ThePenguin, plus one test composition per system
      Film.tsx                <Audio>, a <Sequence> per shot, global layers
      gen/timeline.json       generated; never edited by hand
      timing/                 song.ts (typed song map), music.ts (cue math)
      theme/                  palette.ts, type.ts, grades.ts
      camera/                 Camera.tsx, handheld.ts, lens.ts
      world/                  Sky, Stars, Aurora, Range, Terrain, Sastrugi, BlueIce, Colony, Sea,
                              Slope, Camp, GiantFootprint, MountainBase, Map
      mountain/               Mountain.tsx (stages M0-M6, plume, eyes)
      characters/
        penguin/              Penguin.tsx (rig), parts/, views/, poses.ts, walk.ts, beak.ts
        crew/                 Crew.tsx, Director.tsx, Operator.tsx, Sound.tsx
        creator/              Creator.tsx (built on the penguin rig's parts)
        colony/               ColonyCrowd.tsx
      fx/                     particles (Snowfall, Drift, Gust, Blizzard, Plume, Spray,
                              Avalanche, Sparkle), Flare, Grain, Vignette, MotionBlur
      doc/                    Viewfinder, LowerThird, DistanceCounter, Clipboard, Glitch
      frame/                  Letterbox, Modes (CINEMA/DOC), Transitions
      shots/                  S01.tsx … Snn.tsx, one file per shot
      util/                   rand.ts (seeded), noise.ts, ease.ts, geom.ts
    scripts/
      vocal-envelope.py       A02 -> public/data/vocal-envelope.json
      stills.ts               renders the key frame of every shot for review
      captions.ts             song-map.json -> out/captions.srt
```

### 15.2 Composition

- `ThePenguin`: 1920×1080, 30 fps, `durationInFrames = ceil(songDuration × 30) + epilogueFrames`.
- `Film.tsx` renders, bottom to top: the shot sequences (each shot draws its own world and characters through the shared camera), then global layers: `Grade` (per mode and section), `Letterbox` or `Viewfinder` (by the shot's mode), `Grain`, `Vignette`.
- `<Audio src={staticFile('audio/song.<ext>')} />` starts at frame 0 at volume 1. No fades unless the song file has them.
- Test compositions: `PenguinTurnaround` (all views next to the reference sheet), `WalkTest` (walk cycle on a click track), `MountainStages` (M0–M6 side by side), `DocUI`, `SkyDay` (a 24-hour time-lapse of the sky system). These are the fastest way to check one system without rendering the film.

### 15.3 Timeline: the song is the master clock

1. `analyze.py` measures the song. `song-map.json` is the curated result: the beat grid (`t0`, `period`, `meter`, or an explicit beat list if the tempo isn't constant), bar numbers, section boundaries, and verified line and key-word cues (for example `chorus1.line4.creator`).
2. `shots.yaml` places every shot on that map by **musical position**, not by seconds:
   ```yaml
   - id: S14
     at: "33.1"                 # bar.beat, or a cue: { line: chorus1.5 } / { word: chorus1.4.creator }
     mode: DOC
     section: Chorus 1
     lyric: "We're making a documentary"
     # …every creative field from §12…
     events:                    # in-shot beats, also in musical time
       - { at: "+0.2", do: clipboard_up }
       - { at: "+2.1", do: clipboard_flip }
   ```
3. `build.py` resolves each `at` to seconds through the grid, then to frames (`round(t × 30)`), sets each shot's duration to the next shot's start, checks for overlaps, gaps, and shots shorter than 12 frames, and writes `gen/timeline.json` plus the §12 table. If the song map changes (a new mix, a corrected downbeat), rerunning `build.py` retimes the whole film.
4. Inside a shot, animation also uses musical time through `music.ts`: `beatFrame(n)`, `barFrame(bar, beat)`, `beatPhase(frame)`, `onBeat(frame, window)`, `vocalLevel(frame)`, `intensity(frame)`. Nothing is timed in raw seconds except the epilogue after the last note.

### 15.4 Synchronization systems

| Sync | Source | Mechanism |
|---|---|---|
| Cuts | Grid | Shot starts land on the frame nearest their bar.beat; default is a bar line |
| **Footfalls** | Grid | `walk.ts`: the contact frame of each step is the beat frame. Between beats, pose phase = (frame − beat) / (next − beat). Modes: every beat, half-time, double-time. Footprints spawn on contact. |
| **Lip sync** | Vocal stem | `vocal-envelope.json` holds the per-frame RMS of the stem, normalized per section, gated at −35 dB, with a 1-frame lead (the beak opens just before the sound), a 1-frame attack and a 3-frame release. Beak angle = 22° × level^0.7. It is only applied in shots flagged `sing: true`. |
| Accents | song-map key words | Named cues (for example `bridge.line8.wow`) trigger specific actions |
| Energy | Per-bar intensity | Drives snow density, drift speed and the handheld amplitude, within limits set per shot |
| Blinks | Grid | REC dot on even beats; the breath plume on phrase downbeats |

### 15.5 The 2.5D world and camera

- Every exterior is a stack of layers, each with a depth `z` (meters). The camera has `x`, `y`, `zoom`, `roll` and a focal parameter that sets parallax strength (wide vs. telephoto, §8.4).
- A layer's screen offset is `(layerX − camX) × focal / (z + focal)`, and its scale is `focal / (z + focal)`. The sky is at infinity and never moves.
- Distance haze is applied per layer by depth and the section's haze level (§7.1).
- Terrain ridgelines come from seeded 1D noise, so a location is a seed plus parameters. The plain, the night plain and the empty horizon are the same generator with different light.
- Locations are components with props (`timeOfDay`, `haze`, `wind`, `mountainStage`, `seed`). Repeated environments are the same component rendered with different props, not copies.

### 15.6 The penguin component

```tsx
<Penguin
  view="side" facing="right"
  pose={{ kind: 'walk', beatMode: 'every' }}   // stand | walk | toboggan | lifted | fallen | …
  expr={{ eyes: 'open', pupil: 1, beak: 'auto' }} // 'auto' = lip sync from the vocal envelope
  x={…} y={…} scale={…}
/>
```

- Parts are SVG paths traced from the reference sheet at 1:1 proportions, with each pivot at the anatomical joint. The same parts build every view. Proportions live in one `model.ts` so the penguin cannot drift between shots.
- Poses are pure functions from (frame, beat phase, props) to part transforms. No keyframe data lives in the shot files except intent.
- QA: the `PenguinTurnaround` composition places each rendered view over the reference sheet at 50% opacity.

### 15.7 Particles

Every particle system is stateless. Particle *i*'s position at frame *f* = seeded start + velocity × *f* + noise(*i*, *f*), wrapped inside the layer bounds. Counts are capped per layer: 180 far, 120 mid, 60 near. The blizzard uses a noise-fog layer instead of thousands of flakes.

### 15.8 Text systems

- The viewfinder, lower thirds, distance counter and end card are the only on-screen text (§2.3).
- `LowerThird` types on at 3 frames per character, holds, then wipes off. `DistanceCounter` reads its value from a single function of global time (§13.3), so every shot shows a consistent number.
- The minimum text size is 22 px at 1080p. Text is white at 85% with a soft shadow; nothing is placed on a busy background without a shadow plate.

### 15.9 Determinism

- No `Math.random`, `Date`, or network access during a render. Randomness uses Remotion's `random(seed)`; noise uses `@remotion/noise` with fixed seeds.
- Fonts, audio and data are local files in `public/`.
- Package versions are pinned exactly.
- Nothing accumulates across frames: every value is a function of the frame number.
- Check: render the same frame range twice and compare frame hashes.

### 15.10 Captions

`captions.ts` exports `out/captions.srt` from the verified line cues in `song-map.json`, for platforms that take a caption file. Captions are never burned into the video.

### 15.11 Editing a shot independently

- Each shot file receives `{from, durationInFrames, cue helpers, props from shots.yaml}` and draws only itself.
- Shared continuity (time of day, distance counter, battery level, mountain stage, crew positions) is computed from global time, not passed from shot to shot, so reordering or retiming a shot never breaks its neighbors.
- Changing a shot's timing means editing its `at` in `shots.yaml`. Changing its content means editing its `Snn.tsx`. Nothing else moves.

---

## 16. Implementation plan and QA

### 16.1 Order of work

1. **Lock the song map.** Verify every section boundary and every line cue against the detail plots (§1). Render a click-track animatic: bar numbers, beat flashes and lyric lines on screen, over the song.
2. **Scaffold** the Remotion app, audio, timing helpers, `build.py` and the vocal envelope.
3. **Animatic:** every shot as blocking (gray shapes, the shot ID, the lyric, the mode frame) at final timing. Render it at half resolution and check every cut against the music.
4. **The penguin rig** from the reference sheet. Turnaround check against the sheet, then a walk test on the beat, then the pose library.
5. **World systems:** sky and time of day, terrain, the mountain stages, particles, the documentary UI, the letterbox.
6. **Shots in film order.** For each shot: build it, render its key frames, compare them with §12, and fix before moving on.
7. **Full previews** (half resolution): check sync, continuity and pacing across the whole film.
8. **Final render:** 1920×1080 H.264 (CRF 18), AAC 320 kbps from the untouched master, and `captions.srt`.

### 16.2 QA checklist

| Check | Pass condition |
|---|---|
| Cuts | Every cut is within ±1 frame of its intended bar.beat |
| Footfalls | Every walking contact frame is within ±1 frame of a beat |
| Lip sync | The beak opens within 0–2 frames before each sung phrase onset; it is closed in DOC shots before the bridge |
| Character | Every view matches the reference sheet overlay (proportions, markings, colors) |
| Screen direction | The mountain is right or ahead in every exterior; left-facing shots are only the intended ones |
| Mountain | Its stage in each shot matches §7.1; it never shrinks between consecutive sections |
| Color | Each section's grade matches §9.2; no warm light before dawn except `PARKA` |
| Text | ≥ 22 px, readable for at least 1.5 s, never over a busy background without a plate |
| Transitions | Each matches §11 and lands on its beat |
| Determinism | Two renders of the same range give identical frame hashes |
