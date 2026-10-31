# 유입 링크 UTM 표 (정본)

2026-10-26 작성. dearpapa.kr로 들어오는 공식 링크에 붙이는 UTM 값의 정본이다. 값은 `lib/campaign-attribution.ts`의 허용 목록(APPROVED)과 1:1로 같아야 하며, 둘 중 하나만 바꾸지 않는다.

## 사이트가 방문을 재는 방법

- 측정 도구: Vercel Web Analytics(`@vercel/analytics`, `components/SiteAnalytics.tsx`). 쿠키를 쓰지 않는 페이지뷰 집계다. 별도 계정 연동이나 새 도구는 추가하지 않았다.
- 페이지뷰를 보내기 전에 URL의 쿼리(`?…`)와 해시(`#…`)를 모두 지운다. 그래서 UTM 원문은 분석 도구에 가지 않는다.
- UTM은 `components/CampaignAttribution.tsx`가 브라우저 안에서만 읽는다. 아래 표의 4개 값(`utm_campaign`, `utm_source`, `utm_medium`, `utm_content`)이 **정확히** 한 행과 같을 때만 고정 코드(예: `ig_bio`) 하나를 `campaign_landing` 이벤트로 보낸다. 탭 세션당 코드별 1회.
- 값이 하나라도 다르거나(대소문자 포함), 빠지거나, 같은 키가 두 번 나오면 아무것도 기록하지 않는다. `utm_term`, `utm_id`, `fbclid` 같은 다른 키는 읽지 않고 버린다. 따라서 링크에 이메일·이름·전화번호 같은 개인정보가 섞여 들어와도 분석으로 넘어가지 않는다.
- 같은 탭 안에서는 고정 코드만 sessionStorage에 남겨 편지 진입·작성 시작·카드 저장·공식 채널 클릭을 채널별로 나눠 본다. 원문 쿼리는 저장하지 않는다. 자세한 해석 기준은 `docs/marketing-measurement.md`.
- 결과는 Vercel 프로젝트의 Analytics → Events → `campaign_landing`에서 `campaign` 속성별로 본다. 활동 건수이며 고유 방문자 수나 매출 기여가 아니다.

## 링크 표

모든 행의 `utm_campaign`은 `prelaunch_202610`이다. 소문자 그대로 쓴다.

| 채널 | 붙이는 곳 | utm_source | utm_medium | utm_campaign | utm_content | 기록 코드 | 권장 도착 페이지 |
|---|---|---|---|---|---|---|---|
| Instagram 프로필 | @dearpapa.kr 바이오 링크 | instagram | social_profile | prelaunch_202610 | bio_link | ig_bio | / |
| Instagram 게시물 | 피드 게시물·캐러셀 캡션 링크 | instagram | organic_social | prelaunch_202610 | feed_post | ig_post | / |
| Instagram 스토리 | 스토리 링크 스티커 | instagram | organic_social | prelaunch_202610 | story_link | ig_story | / |
| YouTube 영상 설명란 | @dearpapa_kr 쇼츠·영상 설명란 링크(AI 생성 영상 포함) | youtube | video_description | prelaunch_202610 | desc_link | yt_desc | / |
| 네이버 블로그 | blog.naver.com/dearpapa_kr 글 본문 링크 | naver | blog | prelaunch_202610 | blog_post | naver_blog | /letter-all-in-one |
| 티스토리 블로그 | 티스토리 글 본문 링크 | tistory | blog | prelaunch_202610 | blog_post | tistory_blog | /letter-all-in-one |
| AUTHON 기사 | authonnews.com 기사 안 공식 사이트 링크 | authonnews | referral | prelaunch_202610 | article_link | authon_article | /about/facts |

기존 캠페인 4개(2026-10-24)도 그대로 유효하다. 특정 콘텐츠를 따로 재고 싶을 때만 쓴다.

| 기록 코드 | utm_source | utm_medium | utm_campaign | utm_content |
|---|---|---|---|---|
| ig_letter | instagram | organic_social | prelaunch_202610 | reel_letter_a |
| ig_product | instagram | organic_social | prelaunch_202610 | reel_product_b |
| yt_letter | youtube | organic_social | prelaunch_202610 | short_letter_a |
| naver_product | naver | blog | prelaunch_202610 | blog_product_questions |

## 바로 붙여 쓰는 URL

```
Instagram 바이오     https://dearpapa.kr/?utm_source=instagram&utm_medium=social_profile&utm_campaign=prelaunch_202610&utm_content=bio_link
Instagram 게시물     https://dearpapa.kr/?utm_source=instagram&utm_medium=organic_social&utm_campaign=prelaunch_202610&utm_content=feed_post
Instagram 스토리     https://dearpapa.kr/?utm_source=instagram&utm_medium=organic_social&utm_campaign=prelaunch_202610&utm_content=story_link
YouTube 설명란       https://dearpapa.kr/?utm_source=youtube&utm_medium=video_description&utm_campaign=prelaunch_202610&utm_content=desc_link
네이버 블로그        https://dearpapa.kr/letter-all-in-one?utm_source=naver&utm_medium=blog&utm_campaign=prelaunch_202610&utm_content=blog_post
티스토리 블로그      https://dearpapa.kr/letter-all-in-one?utm_source=tistory&utm_medium=blog&utm_campaign=prelaunch_202610&utm_content=blog_post
AUTHON 기사          https://dearpapa.kr/about/facts?utm_source=authonnews&utm_medium=referral&utm_campaign=prelaunch_202610&utm_content=article_link
```

## 쓰는 규칙

1. 도착 페이지는 바꿔도 된다(예: 블로그 글이 편지 쓰기를 다루면 `/#letter`). 쿼리는 경로 뒤, `#` 앞에 둔다: `https://dearpapa.kr/?utm_source=…&utm_content=bio_link#letter`.
2. 4개 값은 표에서 그대로 복사한다. 글마다 `utm_content`를 바꾸면 기록되지 않는다. 글·영상별로 따로 재야 하면 이 표와 `lib/campaign-attribution.ts`에 행을 먼저 추가하는 PR을 연다.
3. 이메일, 이름, 전화번호, 주문번호 등 사람을 알아볼 수 있는 값은 어떤 키에도 넣지 않는다.
4. 링크 단축 서비스는 최종 주소에 위 쿼리가 그대로 남는지 확인하고 쓴다.
5. AUTHON 기사를 독립 언론 보도처럼 소개하지 않는다. 공개 기사에는 브랜드 가이드의 고지 문장을 그대로 쓴다.
6. 캠페인 이름(`prelaunch_202610`)을 바꾸려면 이 표, 허용 목록, 테스트(`tests/campaign-attribution.test.tsx`)를 한 PR에서 같이 바꾼다.
