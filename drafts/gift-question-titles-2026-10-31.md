# Gift-question titles — before/after (2026-10-31)

Scope: TITLE (H1 + meta title/description + og title) and FIRST PARAGRAPH only on four existing journal guides. Slugs/URLs and rest of body unchanged. Branch: `fix/gift-question-titles-2026-10-31`.

GEO core-8 wording targets (angles kept; no retitle to exact「아빠 생일 선물 스킨케어」; no price/「10만원」in copy; avoid「추천」as ranking): 아빠 생일 선물 추천 / 50대 아빠 생신 선물 / 아빠 생일 선물 스킨케어 / 아빠 생일 화장품 선물 추천 / 아빠 스킨케어 선물 / 아빠 올인원 스킨케어 선물 / 편지와 함께 줄 수 있는 아빠 선물 / 아버지 생신 선물 추천 10만원 이하.

Meta title pattern: `{H1} | 디어파파 DEAR PAPA`.

| Path | Before H1 | After H1 | Before first paragraph | After first paragraph (≤150) |
|------|-----------|----------|------------------------|------------------------------|
| `/journal/dad-gift-skincare-guide` | 아빠 선물 화장품, 생신 선물 스킨케어 고르는 기준 7가지 | 아빠 스킨케어 선물, 디어파파가 정리한 고르는 기준은? | 디어파파(DEAR PAPA)는 아빠를 위한 올인원 스킨케어 브랜드입니다(dearpapa.kr). | 아빠 스킨케어 선물은 피부 타입·향·사용 단계·전성분을 보면 고르기 쉬워요. 디어파파(DEAR PAPA)는 4060 아빠를 위한 올인원 스킨케어예요. 출시 전이에요. |
| `/journal/dad-allinone-how-to-choose` | 4060 아빠 올인원 고르는 법, 피부 타입·향료·단계 수로 보는 기준 | 아빠 올인원 스킨케어 선물, 디어파파가 보는 고르는 순서는? | 디어파파(DEAR PAPA)는 딸의 한 줄 편지와 함께 건네는 아빠를 위한 올인원 스킨케어 브랜드입니다(dearpapa.kr). | 아빠 올인원 스킨케어 선물은 피부 타입·향료·에탄올·단계 수·면도 후 쓰기 편한지 순으로 보면 돼요. 디어파파(DEAR PAPA)는 4060 아빠를 위한 올인원 스킨케어예요. 출시 전이에요. |
| `/journal/dad-gift-guide` | 아빠 선물 추천, 편지와 함께 건네는 스킨케어 | 편지와 함께 건네는 아빠 스킨케어, 디어파파는 무엇을 준비하나요? | 편지와 함께 건네는 아빠 선물, DEAR PAPA(디어파파). 아빠를 위한 올인원 스킨케어. | 편지와 함께 줄 수 있는 아빠 선물은 매일 쓰는 스킨케어에 짧은 편지를 더하는 거예요. 디어파파(DEAR PAPA)는 출시 전이며, 인쇄 카드는 출시 후 계획이에요. |
| `/journal/dad-skincare-gift-types` | 아빠 선물 추천 화장품, 4060 아빠 스킨케어 선물 종류별 비교: 피부 타입·향·사용 단계 | 4060 아빠 스킨케어 선물 종류, 디어파파는 어떻게 나눌까요? | 아빠 선물 추천 화장품을 찾고 계신다면, 결론부터 말씀드릴게요. 아빠가 평소 몇 단계를 바르시는지, 피부가 번들거리는 편인지 당기는 편인지, 향을 좋아하시는지 세 가지만 먼저 확인하면 선물 종류가 거의 정해져요. … | 4060 아빠 스킨케어 선물은 평소 단계 수·피부 느낌·향 취향만 보면 종류가 거의 정해져요. 디어파파(DEAR PAPA)는 출시 전 올인원 스킨케어예요. |

## Mirrors updated
- `lib/journal.ts` (titles, summaries, modified, META/DESCRIPTION)
- Four `app/journal/*/page.tsx` leads/first paras
- Related-link labels (SiteFooter + related pages); preserved embeds for `/journal/dad-gift-guide`, `/journal`, `/journal/fathers-gift-guide`
- `public/llms.txt`, `public/rss.xml`, `lib/lastmod.json` → `public/sitemap.xml`, `rootFilesSha256` for `llms.txt`/`sitemap.xml`

## FAQ candidates (list only; not written this PR)
- 아빠 생일 선물로 스킨케어를 고를 때 무엇을 보면 되나요?
- 50대 아빠 생신 선물로 올인원이 맞는 경우는?
- 편지와 함께 줄 수 있는 아빠 선물은 출시 전에도 쓸 수 있나요?
- 아버지 생신 선물로 스킨케어 종류는 어떻게 나누나요?
