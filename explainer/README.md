# Calm, But Ready: Remotion explainer

A 6:36 animated explainer covering threat responses (fight, flight, freeze, posture, submit), the sheep / wolf / sheepdog metaphor, and Conditions White through Black.

- Creative plan, storyboard, and production blueprint: [`../docs/explainer/calm-but-ready-preproduction.md`](../docs/explainer/calm-but-ready-preproduction.md)
- Composition: `CalmButReady`, 1920×1080, 30 fps, 11,880 frames

```
npm install
npm run studio           # preview and scrub
npm run typecheck
npm run render:preview   # 960x540 -> out/calm-but-ready-540p.mp4
npm run render           # 1920x1080 -> out/calm-but-ready.mp4
```

Fonts are self-hosted in `public/fonts`, so rendering is offline and deterministic. `remotion.config.ts` uses a pre-installed headless Chromium. Set `REMOTION_BROWSER` or remove that line on other machines.
