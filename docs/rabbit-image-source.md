# Rabbit image

## Current asset — transparent minimal mascot, 2026-10-25

The user requested a background matching the surrounding letter, graph-paper
texture only inside the bunny, and a Claude-character feeling. The new asset
`public/images/letter-bunny-minimal-grid-v2.webp` uses a transparent exterior,
muted blue fill, a simpler silhouette and face, and a grid confined to the body.
The ivory envelope keeps the letter motif. Tape, floating hearts, postage and the
rectangular grid backdrop were removed. This is a newly generated rabbit using
the old illustration as an edit reference; it is not an official Claude asset.

The built-in imagegen tool produced a 1254×1254 RGBA PNG. The website uses a
640×640 WebP (47,434 bytes, quality 92, alpha quality 100), preserving transparency.
Source, exact prompt and alpha/composite checks are retained in
`outputs/dearpapa-minimal-bunny-20261025/`; the delivered PNG is also in
`Downloads/DearPapa-Bunny-Tone-20261025/letter-bunny-minimal-grid.png`.
The prior asset remains untouched. Only the `LetterBunny` image reference changes;
the button, visible labels, live replies, keyboard behavior and reduced-motion
support retain their implementation.

Validation: `npm.cmd run build` (81 tests, TypeScript, export and preservation),
plus desktop 1440×1000, mobile 390×844 and narrow 320×800 screenshots and interaction
checks in the output folder's `site-review/`. Alpha corners are zero; the button
is transparent over the white letter, without a separate image background.
No production deployment or video generation is included in this change.

## Previous asset — user-approved generated concept, 2026-10-24

The user approved the seated letter rabbit with a blue graph-paper background,
sticker border, hearts and postage motif and requested implementation.
`public/images/letter-bunny-grid-v1.webp` is a 640px WebP export of the approved
generated PNG `exec-1dffb3de-e066-48e1-aa7a-19cad9f82b5e.png`.
The approved full-resolution source is retained in the workspace outputs.
Only size/encoding were optimized; the approved composition was retained.
The previous Pinterest image is no longer served from public assets.
Generation and user approval are provenance records, not a legal clearance
or a guarantee of copyright exclusivity. No official artist affiliation is claimed.

## Historical asset and implementation notes

The user requested the supplied rabbit illustration itself on 2026-10-24,
replacing the previous SVG interpretation. The matching illustration was
visually verified in the user's open Pinterest pin:
https://kr.pinterest.com/pin/1107392995864514458/

`public/images/letter-bunny-original.jpg` is the downloaded 736 x 977 JPEG,
unchanged. Its illustration matches the user-provided reference; the source
has additional white margins. Display keeps its aspect ratio and white background.
The existing greeting button animates the whole image once per click, with
reduced-motion support. Envelope color controls were removed because this
illustration has no envelope.

The follow-up refinement adds a blue-lined greeting note using the existing
handwriting font. Clicking or keyboard-activating the rabbit cycles three
short replies and replays a 420ms greeting without remounting the source image.
A letter-entry link opens and focuses the existing composer without changing
the visitor's draft. Reduced-motion users receive the text feedback without
spatial animation; replies are announced through a polite live region.

The subsequent approved refinement places the original rabbit inside the
product scene's existing letter, removing the separate greeting widget and
its duplicate letter-entry link. The hero retains one primary letter CTA.
Guidance and greeting labels use the body font; handwriting is reserved for
the sample letter. Product positioning leaves room above the unified letter.
