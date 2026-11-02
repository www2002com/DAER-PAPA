# Product evidence navigation experiment — 2026-11-02

The owner explicitly authorized publishing an experimental change to dearpapa.kr and measuring real performance. This is a separate, reversible intervention on an existing page; it is not a daily journal article. The daily article runner found no qualifying keyword today.

## Intervention and hypothesis

Treatment: `/letter-all-in-one` gains one visible, server-rendered section linking existing official planning facts, undecided information and development principles. A contents anchor leads to the section. The hypothesis is that visitors and crawlers can find the source and status of product information more readily. This does not establish that the previous canonical surface or structured data was missing.

The existing official paragraphs, metadata, head JSON-LD, facts body and protected public files stay byte-for-byte under the existing preservation checks. No new product benefit, formula, price, release date, testimonial or independent endorsement is asserted. No new client code, tracker, external service or schema block is added.

## Relationship to the seven AUTHON recommendations

| Recommendation | Treatment in this experiment |
| --- | --- |
| Canonical truth surface | Existing `/about/facts` retained; add a visible route to it from the product information. |
| Structured-data authority layer | Existing head JSON-LD already links to facts; validate and retain it, without duplicate markup. |
| First-person / proprietary content | Link the existing development-principles article; no invented study, manufacturing test or new unverified claim. |
| Measurement variance review | Freeze pre-release baseline, compare full 7/28-day windows and disclose small samples and confounders. |
| Third-party surface options | `/press` already distinguishes AUTHON materials from independent coverage. No new external placements are made; external authority remains untested. |
| Coverage gap plan | Record page/query data; unmeasured AI coverage is not treated as zero. No fabricated query results. |
| External authority review | Existing provenance caveat retained; no independent endorsement claimed or requested. |

This tests **one deployable intervention**, not the causal effect of all seven prescriptions. External publication and new paid AI measurements are not performed by this release.

## Frozen design

- Primary readout: finalized GSC web-search clicks to the treatment URL, with impressions and CTR (`sum(clicks)/sum(impressions)`) beside it.
- Secondary: approximate impression-weighted position, query/page composition, property totals, country/device composition. Query rows can omit anonymized searches; never sum query rows as property totals.
- Descriptive comparison pages: `/journal/dad-gift-guide` and `/journal/brand-identity`. They are not randomized controls. `/journal/development-principles` receives a new link and therefore is not a comparison page.
- The baseline was captured before the release. Latest final date: 2026-10-31 (Pacific); 28-day property total: 418 impressions, 2 clicks, CTR 0.4785%. Baseline treatment metrics and raw rows are in the local evidence file. The immutable baseline initially named development-principles as a comparison; the final config supersedes that scope while reusing captured raw data for all pages.
- Start the post-period on the first full Pacific calendar day after verified production deployment. Evaluate 7 and 28 days independently only once GSC final data reaches each window end. Report pending final data otherwise.
- Compare with the same-length frozen pre-period ending 2026-10-31, explicitly showing the reporting gap and dates. Do not move the baseline to improve results.
- Fewer than 100 impressions or 10 clicks in either compared sample is an operational small-sample flag, **not** a power calculation or statistical significance rule. Results remain descriptive even above it. Increases are observations, not proof of causal lift; decreases and no change are equally reportable.
- AI-answer/citation/GVS and revenue effects remain `not_measured`. GSC is not a substitute for those measurements.
- Concurrent site releases, indexation lag, changing query mix, seasonality and nonrandom comparison pages are confounders. Record changed pages/commits when evaluating. Other authorized work is not frozen by this experiment.

## Verification and rollback

Required before merge: existing test suite, type check, build, unchanged preservation check, initial HTTP check and mobile/desktop layout/link checks. Required after merge: verify the new section on the real canonical URL and run HTTP preservation checks.

Rollback is a new revert commit of this PR's product-page addition after confirming later changes, not a reset or force-push. Record rollback time as the end of exposure; stop treating later days as exposed. Never restore or enable the separate AUTHON Cloudflare workflow.

## Evidence and scheduled review

Local evidence (not public website files):

- `dearpapa-geo/experiments/authon-evidence-20261102/baseline.json`
- `dearpapa-geo/experiments/authon-evidence-20261102/experiment.json` — created only after verified production release; exact commit, URL and observed deployment timestamp.
- `dearpapa-geo/scripts/experiment_measure.py` — read-only OAuth queries and immutable dated follow-up JSON/Markdown.
- `outputs/authon-dearpapa-experiment-20261102/` — before/after HTTP snapshots, browser checks and release report.

The existing daily 08:00 KST Codex review prompt includes this experiment as a separate follow-up even on no-article days. It runs while the configured Windows machine/session and OAuth connection are available; queued work is not a completed review. The reviewer must inspect the saved measurement, report the actual state, and avoid claiming future checks have already happened.
