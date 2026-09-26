/**
 * Exports the narration (src/narration.ts) as VO deliverables in docs/explainer/vo/:
 *   elevenlabs-script.txt  paste-ready, one block per scene (with <break> tags between lines)
 *   elevenlabs-lines.txt   paste-ready, one line per cue (for per-line generation)
 *   vo-cue-sheet.md        timecodes, windows, word counts, fit check
 *   calm-but-ready.srt     subtitles / placement markers for the editor
 * Run: npm run vo
 */
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {NARRATION, WORDS_PER_SECOND} from '../src/narration';
import {FPS, SCENES, TOTAL_FRAMES, sceneStart} from '../src/timeline';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, '..', '..', 'docs', 'explainer', 'vo');
mkdirSync(outDir, {recursive: true});

const S = (id: string) => sceneStart(id) / FPS;
const title = (id: string) => SCENES.find((s) => s.id === id)?.title ?? id;
const words = (t: string) => t.replace(/[“”"]/g, '').split(/\s+/).filter(Boolean).length;
const est = (t: string) => words(t) / WORDS_PER_SECOND;
const mmss = (sec: number) => `${Math.floor(sec / 60)}:${(sec % 60).toFixed(1).padStart(4, '0')}`;
const srtTime = (sec: number) => {
  const ms = Math.round(sec * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
};

const cues = NARRATION.map((c) => ({...c, In: S(c.scene) + c.a, Out: S(c.scene) + c.b, words: words(c.text), est: est(c.text)})).sort((x, y) => x.In - y.In);

// Fit check: each line must fit its window, and must not run into the next line.
const problems: string[] = [];
cues.forEach((c, i) => {
  const next = cues[i + 1];
  const room = Math.min(c.Out, next ? next.In : Infinity) - c.In;
  if (c.est > room - 0.15) problems.push(`${c.id} needs ~${c.est.toFixed(1)}s but has ${room.toFixed(1)}s`);
  if (next && c.Out > next.In) problems.push(`${c.id} window overlaps ${next.id}`);
});

const totalWords = cues.reduce((a, c) => a + c.words, 0);
const totalSpeech = cues.reduce((a, c) => a + c.est, 0);
const runtime = TOTAL_FRAMES / FPS;

// 1) One line per cue.
writeFileSync(join(outDir, 'elevenlabs-lines.txt'), cues.map((c) => c.text).join('\n\n') + '\n');

// 2) Blocks: consecutive lines in the same scene whose gaps fit a <break> tag (<= 3 s).
//    Longer gaps start a new block, so every clip can be dropped exactly at its "place at" time.
const blocks: (typeof cues)[] = [];
cues.forEach((c, i) => {
  const prev = cues[i - 1];
  const gap = prev ? c.In - prev.In - prev.est : Infinity;
  if (!prev || prev.scene !== c.scene || gap > 3) blocks.push([c]);
  else blocks[blocks.length - 1].push(c);
});
const byScene = blocks.map((group, bi) => {
  let text = '';
  group.forEach((c, i) => {
    text += c.text;
    const next = group[i + 1];
    if (next) text += ` <break time="${Math.max(0.3, next.In - c.In - c.est).toFixed(1)}s" /> `;
  });
  const id = `B${String(bi + 1).padStart(2, '0')}`;
  return `### ${id} · ${group[0].scene} ${title(group[0].scene)} · place at ${mmss(group[0].In)} · lines ${group.map((c) => c.id).join(', ')}\n${text.trim()}`;
});
writeFileSync(
  join(outDir, 'elevenlabs-script.txt'),
  `# CALM, BUT READY: VO script for ElevenLabs (${cues.length} lines, ${totalWords} words, ~${Math.round(totalSpeech)} s of speech in a ${mmss(runtime)} film)\n` +
    `# Paste ONLY the text under each ### header (headers are not narration). One generation per block (${blocks.length} blocks).\n` +
    `# Place each generated clip so it starts at the "place at" time. Break tags work with Multilingual v2 / Turbo / Flash;\n` +
    `# on v3, replace them with a short pause or generate lines separately (elevenlabs-lines.txt).\n\n` +
    byScene.join('\n\n') +
    '\n',
);

// 3) SRT (every line, including ones that also appear as on-screen type).
writeFileSync(join(outDir, 'calm-but-ready.srt'), cues.map((c, i) => `${i + 1}\n${srtTime(c.In)} --> ${srtTime(Math.min(c.Out, c.In + c.est + 1.2))}\n${c.text}\n`).join('\n'));

// 4) Cue sheet.
const rows = cues
  .map((c) => `| ${c.id} | ${c.scene} ${title(c.scene)} | ${mmss(c.In)} | ${mmss(c.Out)} | ${(c.Out - c.In).toFixed(1)} s | ${c.words} | ${c.est.toFixed(1)} s | ${c.onScreen ? 'on screen' : ''} | ${c.text} |`)
  .join('\n');
writeFileSync(
  join(outDir, 'vo-cue-sheet.md'),
  `# CALM, BUT READY: VO cue sheet

Generated from \`explainer/src/narration.ts\` by \`npm run vo\`. Do not edit by hand. Edit \`narration.ts\` and re-run.

- **Film runtime:** ${mmss(runtime)} (${runtime} s, 30 fps)
- **Lines:** ${cues.length} · **Words:** ${totalWords} · **Estimated speech:** ~${Math.round(totalSpeech)} s at ${Math.round(WORDS_PER_SECOND * 60)} wpm (calm narration)
- **Fit check:** ${problems.length ? problems.join('; ') : 'every line fits its window at the planning pace'}

## Voice direction
Calm, mid-low register, unhurried, neutral accent. Observational, not instructional, and not a trailer voice. Let the pauses breathe. In ElevenLabs, start at speed 1.0 and stability around 50–60%. If a clip runs longer than its **Window**, lower the speed slightly (0.95) rather than cutting words.

## How to place the audio
1. Generate either one clip per scene block (\`elevenlabs-script.txt\`) or one clip per line (\`elevenlabs-lines.txt\`).
2. In your editor, import \`calm-but-ready.srt\` as a caption or marker track. Each subtitle starts exactly where its line should start.
3. Snap each clip's start to its **In** time. A clip may end any time before the next line's **In**.
4. The video's embedded soundtrack (heartbeat and ambience) is designed to sit under the VO. Duck it about 4–6 dB under speech.
5. S01 (0:00–0:12) has no narration: the heartbeat is the first voice.

## Cues
| ID | Scene | In | Out (latest) | Window | Words | Est. | Note | Line |
|---|---|---|---|---|---|---|---|---|
${rows}
`,
);

console.log(`Wrote VO files to ${outDir}`);
console.log(`${cues.length} lines, ${totalWords} words, ~${Math.round(totalSpeech)} s speech`);
if (problems.length) console.log('FIT PROBLEMS:\n' + problems.join('\n'));
