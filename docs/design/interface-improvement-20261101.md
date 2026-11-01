# DEAR PAPA interface improvement — 2026-11-01

## Ownership and scope

Direct code changes and integration: Codex. Independent repository/flow exploration,
browser verification and a separate source review supported the implementation.
Branch: `feat/interface-improvement-20261101`; baseline: `43f28f4` (`origin/main`).

Applied installed `jakubkrehel/skills`: `better-interface`, `better-accessibility`,
`better-layout`, `better-writing`, `better-typography`, `better-colors`, `better-ui`.
Implementation follows the existing Next.js 16 / React 19 / CSS Modules design.
Read `AGENTS.md`, `PRESERVATION.md`, installed Next.js CSS and client-component docs.

Coverage: all 19 generated public routes at 320, 390 and 1440 CSS pixels; shared
navigation, home, product, journal/articles, official facts, press/privacy, letter
entry and receipt. Official copy, facts, metadata, structured data, image assets,
Sodam naming and backend/analytics behavior are preserved. No production deploy.

## Scope and coverage

| Domain | Evidence inspected | Result |
| --- | --- | --- |
| Accessibility | Header/dialog, composer inputs/undo, comparison tables; browser axe and keyboard checks | Focus and table access corrected; draft recovery protected |
| Layout | Home hierarchy, header/menu DOM order, shared article widths, four comparison tables, narrow widths | Actions moved earlier; consistent reading edges; tables scroll locally |
| Writing | Hero/official strings, entry labels, composer recovery, received empty state | Official wording retained; direct letter and product-section navigation added |
| Typography | Preview helper/privacy text, article and journal headings, share fallback field | 10–11px helper text raised to 13px; headings use readable weight/leading; copy input 16px |
| Colors | Computed axe pairs on journal and received page; existing tokens | Failing pairs replaced with existing `--ink-2` on light surfaces |
| UI polish | Button states, dialog reading order, letter surface, journal/related-link motion | Scoped hover, reduced-motion handling, consistent surfaces and focus treatment |

## Consolidated findings and changes

Locations below refer to the final source; before values are recorded from baseline.

| Severity | Domain | Location | Before | After | Why |
| --- | --- | --- | --- | --- | --- |
| HIGH | Accessibility | `components/letter/Composer.module.css:382` | Message field explicitly removed focus outline; sender used only a subtle underline | Explicit ink focus rings on both fields | Keyboard writing position must remain visible (2.4.7) |
| HIGH | Accessibility | `components/article/ComparisonTable.tsx:4`; four product/journal table call sites | One overflowing table region lacked keyboard focus/name; other tables compressed columns | Native table inside named focusable region, visible scroll cue and minimum reading width | Keyboard access to all columns (2.1.1), readable narrow layout |
| HIGH | Colors | `app/journal/journal.module.css:117` | Latest-story date measured 4.36:1 (`#5b707e` on `#e5edf2`) | Existing darker `--ink-2` | Normal text requires 4.5:1 (1.4.3) |
| HIGH | Colors | `components/letter/ReceivedLetter.module.css:1` | Receipt explanation measured 4.46:1 (`#587184` on `#e9f1f5`) | Shared `--ivory` / `--ink-2` tokens | Normal text requires 4.5:1 (1.4.3) |
| HIGH | Writing | `components/letter/Composer.tsx:199`, `:322` | New-letter action cleared unsaved draft; Undo expired after 6.5 seconds | New-letter action offers Undo; actionable notices remain until dismissed or superseded | Readers can recover without racing a timer |
| MEDIUM | Layout | `components/home/Hero.tsx:26` | Repeated explanatory copy and launch notice preceded main actions | Main invitation and actions precede supporting notice; every original sentence retained | Product and letter tasks are easier to find |
| MEDIUM | Layout | `components/SiteHeader.tsx:99`; `components/SiteHeader.module.css:81` | Letter entry hidden in mobile menu; desktop menu visual order reversed DOM order | Header letter shortcut; menu links lead visually and in keyboard order | Shorter entry path, consistent reading order |
| MEDIUM | Typography | `components/home/HeroLetterPreview.module.css:19` | Helper/privacy copy 10–11px | 13px with 1.65 line height and clearer spacing | Instructions and transmission notice remain legible |
| MEDIUM | Layout | `components/article/Article.module.css:5`; `app/letter-all-in-one/page.tsx:35` | Article title/body used different width limits; long product page lacked local navigation | Shared reading measure and four section shortcuts | Predictable reading edge and faster information lookup |
| MEDIUM | Layout | `components/letter/Composer.module.css:278` | Mobile starter sentences extended past an unmarked hidden scrollbar | Wrapped, fully visible sentence chips | Discover all choices without guessing a scroll gesture |
| MEDIUM | Typography | `components/letter/LetterShareDialog.module.css:32` | Manual-copy input 12px | 16px input | Avoid automatic iOS focus zoom; actual iOS hardware not tested |
| LOW | UI | `app/globals.css:321`; `app/journal/journal.module.css:99` | Generic button text nowrap; hover transforms remained in some reduced-motion paths | Wrapping button labels, explicit border, hover-capability gates and reduced-motion-safe related links | More robust labels and quieter interactions |

Independent review caught a potential stale Undo overwriting a newly typed draft.
Draft-specific Undo now expires on a later text/sender edit or when another saved
letter is opened. Archive-deletion Undo is independent. Regression tests cover
both text and sender edits after 30 seconds.

## Verification

- Baseline `npm.cmd run build`: 181 tests passed, preservation and icons verified.
- Undo regression: two new recovery tests failed before the change, then passed.
- Stale-Undo regression: two parameterized tests failed before the correction,
  then passed; targeted recovery/preservation run: 13 passed.
- Final `npm.cmd run build`: 27 test files / 185 tests passed, production compilation,
  nine protected routes, ten head JSON-LD blocks, exact facts body, protected
  paragraphs/metadata/root hashes and official icons verified.
- `npm.cmd run typecheck`: passed.
- `git diff --check`: passed.
- Initial HTTP response preservation check against `http://127.0.0.1:51921`: passed.
- Final browser sweep: 19 routes × 3 widths = 57 runs, zero horizontal page
  overflow, zero automated axe WCAG violations, no JavaScript page errors.
  Both the independent tester and integration run confirmed these results.
- Recomputed final color pairs: journal date 5.47:1; receipt helper text 5.68:1;
  new control border against white 3.97:1.
- Expanded interaction suite: 44 checks passed (four menu languages at
  320/390/900/1440px, menu open/Escape/focus return, 200% text resizing,
  letter-entry focus, visible input focus, Undo, archive, share fallback,
  valid received letter/title focus, and keyboard table scrolling).
- Final results: `../evidence/dearpapa-interface/final/final-audit.json` and
  `../evidence/dearpapa-interface/final/interaction-results.json`.
- Before/after screenshots were inspected for home, menu, product, journal and
  sharing/receipt. The local static preview's missing Vercel analytics script
  and Next route-prefetch artifacts are expected preview-only 404 requests;
  they did not produce page errors.
- Browser evidence lives outside the repository in
  `../evidence/dearpapa-interface/`; build logs in `../evidence/`.
- Local review URL: `http://127.0.0.1:51921` while the preview process is running.

Not verified: native screen-reader speech, real iOS device behavior, external
Kakao/Instagram delivery and paid Gemini responses. These services were not
changed. This is a UI improvement, not a change to the legacy archive size policy.

## Verdict

**Approve for the inspected UI changes.** No HIGH finding remains within this
change scope. The automated checks do not establish full WCAG conformance or
replace the unperformed native assistive-technology checks listed above.

The production site is unchanged. Review the local preview before merging this
branch into the deployment branch.
