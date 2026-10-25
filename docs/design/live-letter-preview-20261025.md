# First-screen letter preview — 2026-10-25

The user marked the handwritten sentence below the product photograph as the
input and the physical card in the photograph as the output. That sentence is
now an editable, labelled textarea, with an immediate preview in the photograph.

- Default: `난 아빠가 행복해졌으면 좋겠어`; maximum 150 characters.
- Uses the existing blank-card image `public/images/campaign-blue/letter-gift.webp`.
  The earlier image with baked-in Korean text remains available unchanged.
- The overlay shares the image's 1671 × 941 coordinates and centered cover crop.
  After the user's angle correction, a perspective matrix maps a 600 × 300 paper
  plane to the photographed corners `(445,533)`, `(919,752)`, `(711,950)`,
  `(243,703)`. The former affine matrix could not match both the far edge and
  the steeper near edge. The text starts at `(85,115)` in paper coordinates.
- The existing Nanum Pen Script font wraps within 455 × 145 paper coordinates.
  Actual DOM measurements fit long text after edits, resize and font loading.
  Explicit newlines remain intact; clearing the field clears the pictured text.
- The new client component owns only this temporary preview state. The homepage
  copy remains server rendered. No new storage, tracking or API calls are added.
  The lower-page letter composer and the separate bunny AI conversation retain
  their existing behavior. The preview's text is never added to an AI request.
- The input is keyboard accessible, has a visible focus indicator and expands
  to show its full contents. A short hint explains the connection to the image.

Verification: the new tests first failed because the editable field did not
exist, then passed with the implementation. The complete suite has 97 passing
tests in 13 files; the production build and unchanged preservation checks pass.
Chrome verification covered the default desktop viewport, 390 px and 320 px
widths, immediate updates, newlines, 150-character fitting, clearing, no
horizontal overflow and reopening the existing bunny question panel. The bare
question mark remains transparent and pulses continuously when closed.

Evidence is in the parent workspace's `outputs/dearpapa-live-letter-20261025/`
directory, including screenshots and measured fit results in `checks.json`.
The `angle` subdirectory records the subsequent perspective correction.
The review branch remains local; this change has not been deployed to production.

## Bunny writing invitation

The next user request replaces the hero bunny's greeting action with the playful
copy `그냥 써봐라, 각 잡지 말고.`. Clicking or keyboard-activating the bunny focuses
the live letter editor. The initial example is selected for easy replacement;
once edited, the visitor's own text is retained without selecting it all.

The bunny makes two small, impatient bounces in a 3.6-second cycle, with a long
rest between them. Only the character moves; the two-line instruction stays
still. The nudge stops while the letter field is focused, the question panel is
open, a response is loading or the bunny is speaking. Reduced-motion preferences
disable it. The existing standalone greeting and AI speaking motion still work.

Focused behavior tests cover focus transfer, example selection, preserving the
visitor's text and pausing while writing. The full suite now has 98 tests.
