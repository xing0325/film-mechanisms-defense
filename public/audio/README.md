# Local defense soundtrack

This folder holds the licensed music for the defense build. The tracks are committed and
deployed to GitHub Pages so the site can play them during the defense (a deliberate one-time
choice by the owner). If a track is ever absent, the page falls back silently to the built-in
Web Audio textures — no console errors.

## How it works

When the viewer turns sound **ON** (the `SOUND` toggle, the `M` key, or the first scene
click), the page probes this folder. Any track present below is faded in for its scene with a
~600–850 ms crossfade on every scene change. If a file is missing (e.g. on the public deploy),
the page silently falls back to the built-in Web Audio textures — no console errors.

## Expected filenames (drop the tracks in with exactly these names)

| File | Scene cue | Source |
| --- | --- | --- |
| `gbu-main-title.mp3` | 黄金三镖客 — Main Title (骑手 / 眼部) | 01 - Main Title |
| `gbu-story-of-a-soldier.mp3` | 黄金三镖客 — Story of a Soldier (士兵 / 荒漠) | 02 - The Story of a Soldier |
| `gbu-ecstasy-of-gold.mp3` | 黄金三镖客 — Ecstasy of Gold (黄金高潮) | 03 - The Ecstasy of Gold |
| `gbu-trio.mp3` | 黄金三镖客 — The Trio (三角对峙) | 04 - The Trio |
| `jazz-on-broadway.mp3` | 爵士春秋 — 后台 / 身体准备 | 01 - On Broadway |
| `jazz-take-off-with-us.mp3` | 爵士春秋 — 排练 / showtime | 02 - Take Off With Us |
| `jazz-everything-old-is-new-again.mp3` | 爵士春秋 — applause | 03 - Everything Old Is New Again |
| `jazz-bye-bye-life.mp3` | 爵士春秋 — 白线 / 终场 | 04 - Bye Bye Life |

《老无所依》has no licensed track on purpose — it stays on wind / low-frequency / coin / room
sound design generated in the browser.
