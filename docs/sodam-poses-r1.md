# Sodam expressions and poses r1

The user supplied ten Sodam v2 expressions and poses (character sheet
`Sodam-v2-02-Expressions-and-Poses.png`, 2026-10-27) with the situation each one
is for. This release shows all ten on the site in those situations, rendered in
the site's 3D Sodam style so one art style is used everywhere.

## Where they appear

Sodam reacts where the visitor is looking. Steady states sit beside the note under
the card preview; momentary reactions come with the notice that already
announces them; empty and missing pages show Sodam large.

| Pose | Sheet | Sheet situation | Where |
| --- | --- | --- | --- |
| `welcome` | 07 환영 | 첫 방문 · 인사 | Beside the card before the visitor starts; notice when a saved draft is restored |
| `listening` | 03 경청 | 안내 · 편지 시작 | Beside the card: letter field focused but empty |
| `writing` | 08 편지 쓰기 | 편지 작성 | Beside the card while typing; notice when a starter line is inserted or a kept letter is reopened |
| `thinking` | 02 생각 중 | 초안 · 선택 고민 | Beside the card: a draft waits outside the field |
| `waiting` | 09 잠깐 대기 | 대기 · 로딩 · 휴식 | Beside the card while the card image is made |
| `smallWin` | 05 작은 성취 | 완료 · 성공 | Notice: card image made |
| `thanks` | 04 쑥스러운 감사 | 감사 · 저장 확인 | Notice: letter kept in the archive |
| `deliver` | 10 편지 전달 | 편지 완성 · 선물 안내 | Beside the card after an export (product note showing) and in an archive with letters |
| `rest` | 01 기운 없음 | 휴식 · 빈 상태 | Large (152 px) in the empty archive; notice when a letter is cleared |
| `oops` | 06 머쓱함 | 실수 · 재시도 | Beside the card on a warning or failed autosave; notice when the card image fails; large (168 px) on the 404 page |

Sizes: beside the card 76 px (88 px from 1024 px wide, 72 px on laptop screens up
to 860 px tall); in the notice 76 px, rising above the notice pill; empty archive
152 px; 404 168 px. The mapping lives in `lib/sodam-poses.ts` and is covered by
`tests/sodam-poses.test.tsx`.

## Rules followed

- Only the drawn pose changes. No words, sentences, written interjections or
  balloons, and no CSS that moves, tilts or stretches the cutout.
- Images are decorative (`alt=""`, `aria-hidden`); the existing status text,
  warnings and notices still say what happened.
- All ten files are warmed in the cache on the first focus or tap inside the
  composer, so later changes do not wait on the network.

## Source and delivery

Package: `Sodam-v2-Continue-at-Home/exports/Sodam-poses-3D-r1/`.

- Eight poses were generated on 2026-10-29 with Higgsfield (GPT Image 2.5, high,
  transparent background, 1.5 credits each; thinking was tried twice) from three
  references: the sheet's 2D pose PNG for pose and expression, and the approved 3D
  front and 3D welcome for identity and rendering. Raw outputs are in `generated/`.
- `listening` and `welcome` reuse the approved 3D expressions from PR #104
  (`Sodam-expression-r1`).
- Every pose was scaled to the same head width (58% of the canvas) and the same
  foot baseline (95.5%), then saved as 1024 px PNG in `source/` and 384 px WebP
  (quality 86) in `web/` and `public/media/sodam-poses-3d-r1/`. 16–26 KB each.
- Checked by eye on a contact sheet: viewer-left ear folded and viewer-right ear
  standing, ivory scarf with the green stitch at the viewer-right front and two
  tails, the sheet's paw placement and expression for each pose, plain paper and
  envelope with no writing, real transparency.
- `manifest-r1.json` records each source file, its SHA-256, the scale and the final
  bounding box. The 2D sheet PNGs and earlier 3D files are unchanged.
