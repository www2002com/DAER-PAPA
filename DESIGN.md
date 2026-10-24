---
name: "DEAR PAPA"
description: "Powder blue product scenes, ink-blue information, and a personal handwritten letter."
colors:
  paper: "#fcfdfd"
  ivory: "#eaf1f6"
  sand: "#dce5eb"
  card: "#ffffff"
  night: "#1c3343"
  sage: "#e5edf2"
  surface-soft: "#f5ebed"
  forest: "#36566b"
  ink: "#203c50"
  ink-2: "#4b6170"
  ink-3: "#5b707e"
  line: "#d7e0e5"
  line-strong: "#aabdc9"
  rose: "#98576b"
  rose-soft: "#f5e5ea"
  rose-ink: "#763c4e"
  placeholder: "#637584"
  letter-paper: "#fcfaf6"
  letter-ink: "#2e4536"
  letter-soft: "#566b56"
  letter-frame: "#b6c5ac"
  letter-logo: "#304b3c"
  letter-back: "#a5b39e"
typography:
  display:
    fontFamily: "'Dear Papa Comma', 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif"
    fontSize: "clamp(42px, 5.25vw, 76px)"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif"
    fontSize: "clamp(1.9rem, 1.3rem + 2.3vw, 3rem)"
    fontWeight: 650
    letterSpacing: "-0.035em"
  body:
    fontFamily: "'Dear Papa Comma', 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif"
    fontSize: "clamp(1rem, 0.97rem + 0.12vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "-0.01em"
  label:
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    letterSpacing: "-0.01em"
  pen:
    fontFamily: "'Nanum Pen Script', cursive"
    fontSize: "clamp(24px, 4.8cqw, 32px)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0"
rounded:
  square: "0"
  stage: "4px"
  s: "6px"
  character: "8px"
  m: "12px"
  pill: "999px"
spacing:
  gutter: "clamp(22px, 5vw, 72px)"
  section-y: "clamp(64px, 8vw, 112px)"
  gap-small: "8px"
  gap-medium: "16px"
  gap-large: "24px"
  group: "32px"
  band: "40px"
  column: "48px"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.s}"
    padding: "0 26px"
  button-primary-hover:
    backgroundColor: "{colors.night}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.s}"
    padding: "0 26px"
  button-hero:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.s}"
    padding: "0 24px"
  link-arrow:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  input-signature:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "4px 2px"
  input-letter:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "4px 2px"
  navigation-link:
    textColor: "{colors.ink}"
    padding: "0 16px"
  status-soft:
    backgroundColor: "{colors.rose-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  suggestion-chip:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
  letter-note:
    backgroundColor: "{colors.card}"
    textColor: "{colors.forest}"
    rounded: "{rounded.square}"
    padding: "20px 24px"
---

# Design System: DEAR PAPA

## Overview

**Creative North Star: "Powder Blue Product Lookbook"**

Broad powder blue surfaces give the approved product drafts room to be understood. Ink-blue Korean typography, white information areas, and pale rose story sections make the site calm and direct. The existing handwritten face and bunny carry the personal voice of the letter.

This records the implemented 2026-10-25 homepage renewal and shared tokens. Existing article routes inherit the shared colors, type, navigation, and controls; their article component layouts remain intact. The exported letter retains its own approved cream-and-green palette. Mobbin references informed composition, not copied assets or claims.

**Key Characteristics:**
- Large, uninterrupted product scenes and clear Korean headings.
- Flat navigation, filled actions, and restrained hairline divisions.
- Handwriting and tactile paper reserved for the letter experience.
- Original logo geometry, product drafts, bunny artwork, and fonts preserved.

Source evidence: `app/globals.css`, `components/home/{Hero,LetterBunny,Product}.module.css`, `components/SiteHeader.module.css`, and the existing composer/article styles. Visual evidence: `.impeccable/review/desktop.png` (1440 × 1000) and `mobile.png` (390 × 844). Surface composition and references live in `.impeccable/surfaces/app-page-tsx.md` and `docs/design/mobbin-renewal-20261025.md`. This document records implementation, not deployment.

## Colors

The interface pairs cool pale backgrounds with blue ink; rose marks the personal story and supporting states. Frontmatter values are normative. Sidecar tonal ramps are synthesized swatch previews, not additional approved application colors. Existing CSS names are retained: `ivory`, `sage`, and `forest` now describe blue-family interface colors, not their literal namesake hues.

- **Primary:** `ink` for headings, logo, and the hero action; `forest` for general filled actions; `night` for pressed or hover depth. `ink-2` supports body copy and `ink-3` supports metadata.
- **Secondary:** `surface-soft` for story/news chapters; `rose-soft` for selection and soft status chips; `rose` and `rose-ink` for existing letter states and article accents.
- **Neutral:** `paper` is the page ground, `card` is white paper, `ivory` is the hero/letter section, and `sage` is the product and preview stage. `line` divides content; `line-strong` identifies controls. `sand` supports archive counts. `placeholder` is for empty fields only.
- **Preserved letter palette:** `letter-*` tokens come from `components/letter/card.ts`, used by both preview and PNG export. They are a bounded asset palette, not replacements for the surrounding interface.

**The Asset Fidelity Rule.** Keep the original product and bunny image bytes and approved logo paths; interface color changes must not recolor the printed packaging or exported letter by accident.

## Typography

Pretendard Variable supplies headings, body text, labels, and navigation. The comma-only local face precedes it without changing Korean copy. Nanum Pen Script at weight 400 supplies the letter; the application binds its loaded font through `--font-nanum-pen` and `--font-pen`. Do not recreate the logo with typed text.

The hero display uses the exact frontmatter role, with responsive overrides at 1000px (`clamp(40px, 5vw, 58px)`) and 700px (`clamp(37px, 10.2vw, 62px)`, line-height 1.17). Section headings use `headline`, with component line-height: product 1.35 and story 1.3. Small support copy commonly uses 12–14px; it must remain subordinate to readable body copy rather than replace it.

Existing article titles use `clamp(2.1rem, 1.5rem + 2.8vw, 3.75rem)` at line-height 1.2; article prose keeps a 38rem measure. Korean copy uses `keep-all`, with overflow wrapping for long content. Letter note type becomes 26px at 1000px and 24px at 700px. The composer uses 30px ruled handwriting and a 26px signature field.

## Layout

The shared container has 1240px usable content plus two fluid gutters. Vertical section rhythm uses `section-y`; local gaps use the recorded spacing steps. The sticky header is 76px high, and anchor scroll padding adds 12px.

The homepage hero is a `1fr / 1.08fr` grid with a 4% gap. Its visual has three separate rows: campaign product scene, white letter note, and disclosure caption, with a 16px gap. The visual height follows its content. The campaign photograph uses a 16:10 frame on desktop and 4:3 at 1000px and below, cropping surrounding studio space without distorting the products. The original logo sits in a row above the photograph. At 700px and below, the order is title, status, actions, product/note, then explanatory copy. The 2026-10-25 user request to apply the teaser images authorizes these derived campaign assets; provenance is recorded in `docs/design/teaser-images-20261025.md`.

The product section uses `1.12fr / 1fr` with a fluid 32–100px gap, stacking at 800px. Desktop navigation appears at 900px; the dialog directory becomes one column at 540px. Composer actions wrap at 600px; editor and sticky preview become side by side at 1024px. These are component-specific transitions, not one universal breakpoint. Preserve the existing article reading column.

## Elevation & Depth

Most surfaces are flat and separated by tone or a thin rule. The hero note has a soft paper shadow (`0 12px 32px -16px rgb(28 51 67 / 24%)`). The saved letter uses the existing layered `--shadow-card`; the sidecar records it exactly. The sticky header adds a one-pixel line and, where supported, a 96% paper surface with 16px blur; reduced-transparency mode restores opaque paper.

**The Paper Depth Rule.** Use shadows to distinguish physical letter paper or transient feedback; broad product and information sections stay flat.

## Shapes

Section backgrounds are square. Product stages use the small `stage` radius; filled buttons use `s`; the existing composer preview uses `m`. The bunny control has its own `character` radius. Status labels, sentence suggestions, and the existing composer switch are pills. These distinctions are functional: do not apply pill geometry to every navigation link or panel.

The hero note is rectangular. The saved letter remains a 4:5 artifact with its existing near-square `0.35cqw` corner and shared preview/export geometry. Fine rules are ordinarily 1px.

## Components

- **Actions:** general primary and ghost buttons are at least 52px high, with 10px icon gaps; the hero action is 54px high with 24px gaps, changing to 50px/16px on mobile. Primary hover uses `night`; hero hover uses `forest`. Ghost buttons use an inset one-pixel border. General buttons translate up 1px only on fine-pointer hover, scale to 0.98 on press, and use opacity 0.45 when disabled.
- **Text links:** the arrow link has a 44px minimum height, a one-pixel underline, and a 3px arrow movement on hover. Keep the existing destination and visible label.
- **Navigation:** text links have 44px minimum height and 14px/500 type. The menu trigger is 44 × 44px. The full-screen native dialog retains focus containment, Escape dismissal, background inertness, and focus return to the trigger.
- **Status and suggestions:** status tags use 12px/500 type, minimum 24px height, and distinct neutral/now/later/soft treatments. Sentence suggestion buttons use minimum 40px height and a visible border state. A status tag is not automatically an action.
- **Writing fields:** the letter textarea has 46px ruling, a transparent ground, 148px minimum height, and a rose caret. Focus strengthens its rules. The signature input has a 52px minimum height and a bottom rule that darkens on focus. Preserve labels, counts, save/error feedback, and local drafts.
- **Letter note and bunny:** the white note holds handwriting and a separate reply area; the approved bunny is a real button with polite live feedback. Its column is 104px, then 76px at 1000px and 64px at 700px. Its greeting animation lasts 420ms and runs only after interaction.
- **Product viewer:** four keyboard-operable views show the campaign bottle, original carton, cap detail, and paired packaging. Product proportions are preserved using cover for campaign scenes and contain for the original carton. The original logo and draft label sit above the image. Active thumbnails use the `ivory` surface and `forest` rule. Product, note, and disclosure remain separate readable elements.

The common focus treatment is a two-pixel ink outline, offset 3px; writing fields retain their existing line-based focus treatment. Standard action transitions use 240ms and `cubic-bezier(0.22, 0.61, 0.36, 1)`. Existing page entrances run once without hiding server-rendered content. Reduced motion removes decorative movement; keyboard mode removes navigation/control transition delays. The sidecar contains precise motion and depth extensions plus ten self-contained component specimens.

## Do's and Don'ts

### Do:
- Do reuse the current CSS token names and the existing Pretendard and Nanum Pen font loading.
- Do keep product images, the note, and draft disclosures in separate readable layout areas.
- Do preserve original logo geometry, approved asset bytes, official copy, URLs, and local letter data.
- Do preserve the letter preview/export geometry and its bounded cream-and-green palette.
- Do check desktop, 390px mobile, 320px narrow layouts, keyboard focus, and reduced motion when changing these patterns.

### Don't:
- Don't copy Mobbin imagery, brand copy, or code into the site; use the recorded composition principles.
- Don't promote a product draft or development direction into a confirmed specification, efficacy claim, price, or launch date.
- Don't turn broad sections into floating cards or put the letter note over the product artwork.
- Don't overwrite the original logo, product drafts, bunny, or fonts. User-authorized campaign scenes may use derived images with documented provenance and visible draft disclosure.
- Don't spread homepage composition into existing article layouts without a separate scoped change.
