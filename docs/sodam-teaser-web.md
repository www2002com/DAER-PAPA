# Sodam teaser on the homepage

The user requested production integration on 2026-10-29. The homepage places the
approved Sodam v2 teaser after the brand story and before the letter composer,
with a link to `/#letter`. Direct section URL: `https://dearpapa.kr/#sodam-film`.

## Source and delivery

Approved source package: `Sodam-v2-Continue-at-Home/exports/DEAR-PAPA-teaser-r1`.
Use the **r4** final edit, not the r1–r3 drafts. The source package and its original
files remain unchanged. No new Sunra generation or credits are needed.

New versioned assets live under `public/media/sodam-teaser-r4/`:

| File | Source | Delivery |
| --- | --- | --- |
| `landscape-muted.mp4` | `web/DEAR-PAPA-Sodam-teaser-web-muted-r4.mp4` | Exact copy, H.264, 1280 × 720, 11 s, 183,412 bytes |
| `portrait-muted.mp4` | `video/DEAR-PAPA-Sodam-teaser-9x16-r4.mp4` | H.264 CRF 24, 720 × 1280, 11 s, audio removed, faststart, 257,232 bytes |
| `poster-landscape.webp` | `poster/Sodam-teaser-landscape-r4.webp` | Exact copy, 28,468 bytes |
| `poster-portrait.webp` | `poster/Sodam-teaser-portrait-r4.png` | WebP quality 86, 20,368 bytes |

Native video controls allow playback, pausing, seeking and fullscreen. Videos
do not autoplay or loop and use `preload="none"`. CSS reserves the aspect ratio;
the 760 px breakpoint selects the visible landscape or portrait player. Both
players are silent. A text description and the complete on-screen copy are
available in the “영상 내용 읽기” disclosure. Existing product copy, character
assets, story, metadata and preservation baselines remain unchanged.

## Verification

- `npm run build`: 19 test files / 144 tests passed, TypeScript and static export passed.
- Preservation checks passed: 9 routes, 10 JSON-LD blocks, exact facts body,
  article paragraphs, FAQ, metadata, root files and approved story.
- Both delivered MP4 files fully decoded with FFmpeg without errors.
- Chrome desktop and 390 px mobile: correct player/poster selected, initially
  paused, both played to 11 seconds with `ended=true`. No horizontal overflow at
  390 px or 320 px. Text disclosure and letter link checked in the browser.
- Existing launch-release test now awaits Home's dynamic imports before its
  environment is torn down; the original assertions are retained.
- Existing metric-adjusted Pretendard fallback aliases from production commit
  `c4fdadc` are narrowly excluded from the font-name detector. No font CSS changed.

Homepage lastmod was already `2026-10-29`; no date or baseline adjustment is needed.
