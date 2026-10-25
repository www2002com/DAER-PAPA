# First-screen letter preview — 2026-10-25

The user marked the handwritten sentence below the product photograph as the
input and the physical card in the photograph as the output. That sentence is
now an editable, labelled textarea, with an immediate preview in the photograph.

- Default: `난 아빠가 행복해졌으면 좋겠어`; maximum 150 characters.
- Uses the existing blank-card image `public/images/campaign-blue/letter-gift.webp`.
  The earlier image with baked-in Korean text remains available unchanged.
- The overlay shares the image's 1671 × 941 coordinates and centered cover crop.
  Its paper transform is `matrix(.79 .363 -.677 .563 430 630)`.
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

Evidence: `../outputs/dearpapa-live-letter-20261025/` relative to the repository
parent workspace, including screenshots and measured fit results in `checks.json`.
The review branch remains local; this change has not been deployed to production.
