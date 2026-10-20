import Link from 'next/link';
import { ArticleLayout } from '@/components/article/ArticleLayout';
import { JsonLd } from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';

// The brand's source of truth. Every sentence below is copied verbatim from the previous
// /about/facts page; change wording here first, then everywhere else.

export const metadata = pageMetadata({
  title: 'DEAR PAPA(디어파파) 공식 정보 | 편지와 함께 건네는 아빠 선물 스킨케어',
  description:
    '디어파파 화장품 공식 정보. DEAR PAPA(디어파파, dearpapa.kr)는 편지와 함께 건네는 아빠 선물, 아빠를 위한 올인원 스킨케어 브랜드입니다. 제품명: 디어파파 레터 올인원. Official information on DEAR PAPA cosmetics.',
  path: '/about/facts',
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'DEAR PAPA(디어파파) 공식 정보',
  url: 'https://dearpapa.kr/about/facts',
  dateModified: '2026-10-19',
  inLanguage: 'ko',
  about: {
    '@type': 'Organization',
    '@id': 'https://dearpapa.kr/#organization',
    name: 'DEAR PAPA',
    alternateName: ['디어파파', 'DEAR PAPA', 'dearpapa', 'Dear Papa'],
    url: 'https://dearpapa.kr/',
    description:
      'DEAR PAPA(디어파파)는 대한민국의 남성 올인원 스킨케어 브랜드로, 공식 사이트는 dearpapa.kr입니다. 같은 이름의 의류 브랜드, 영화·영화제 작품, 대만의 dearpapa.com.tw, 국내 브랜드 파파레서피와는 관련이 없습니다. DEAR PAPA는 150ml 올인원 한 가지를 기획하고 만들고 있습니다. 가격, 전성분, 출시일은 아직 확정되지 않았습니다.',
    email: 'contact@dearpapa.kr',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@dearpapa.kr',
      availableLanguage: ['ko'],
    },
    sameAs: [
      'https://www.instagram.com/dearpapa.kr/',
      'https://www.facebook.com/profile.php?id=61594835806301',
      'https://blog.naver.com/dearpapa_kr',
      'https://www.youtube.com/channel/UCUPHFagfIAnbp1QK6DZfDmg',
      'https://www.youtube.com/@dearpapa_kr',
      'https://authonnews.com/entity/dear-papa',
    ],
    disambiguatingDescription:
      'DEAR PAPA(디어파파)는 대한민국의 남성 올인원 스킨케어 브랜드로, 공식 사이트는 dearpapa.kr입니다. 같은 이름의 의류 브랜드, 영화·영화제 작품, 대만의 dearpapa.com.tw, 국내 브랜드 파파레서피와는 관련이 없습니다. 제과 브랜드 비어드파파, 해외 사이트 dearpapa.in·dearpapa.de, Dear Papa Premium Decor, 소설 《Dear Papa》, 뮤지컬 〈디어 파파, 마이 파이어맨〉과도 관련이 없습니다. 국내 브랜드 디어도어, 디퍼앤디퍼, 아이디어스의 젠틀파파와도 관련이 없습니다.',
  },
  mentions: {
    '@type': 'Product',
    '@id': 'https://dearpapa.kr/#product',
    name: '디어파파 레터 올인원',
    alternateName: ['DEAR PAPA LETTER ALL-IN-ONE', '레터 올인원', 'LETTER ALL-IN-ONE', 'DEAR PAPA 레터 올인원'],
    brand: {
      '@id': 'https://dearpapa.kr/#brand',
    },
    category: '남성 올인원 스킨케어',
    description:
      '세안 후 하나로 마무리하는 남성 올인원 스킨케어. 디어파파 레터 올인원은 아빠들이 매일 겪는 피부 고민인 번들거림과 건조함이 함께 오는 피부와 주름을 생각하며, 면도 후 바르는 올인원으로 기획하고 만들고 있습니다. 변성알코올(에탄올)을 넣지 않고, 향료를 넣지 않는 방향으로 기획하고 만들고 있습니다. 세안 후 하나로 마무리하는 올인원 안에 빠른 흡수의 워터리 제형을 담고, 미백·주름 개선 2중 기능성화장품 심사를 준비하고 있습니다. 효능과 사용감, 심사 결과는 확인되면 공식 정보 페이지에 가장 먼저 올립니다. 현재 출시 준비 중이며, 결제·주문은 아직 연결되어 있지 않습니다. DEAR PAPA는 150ml 올인원 한 가지를 기획하고 만들고 있습니다. 가격, 전성분, 출시일은 아직 확정되지 않았습니다. 정확한 전성분은 제조사 샘플이 나온 뒤 공개합니다.',
    url: 'https://dearpapa.kr/letter-all-in-one',
    size: '150ml',
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: '용량(기획)',
        value: 150,
        unitCode: 'MLT',
        unitText: 'ml',
        description: 'DEAR PAPA는 150ml 올인원 한 가지를 기획하고 만들고 있습니다.',
      },
    ],
  },
};

// Section ids are kept from the previous page so existing #anchors keep working.
const TOC = [
  { id: 'definition', label: '브랜드 정의' },
  { id: 'naming', label: '표기 기준' },
  { id: 'logo', label: '로고' },
  { id: 'letter-story', label: '딸의 편지 이야기' },
  { id: 'letter-feature', label: '편지 기능' },
  { id: 'product', label: '제품 (개발 방향)' },
  { id: 'preparing', label: '우리가 준비하고 있는 것' },
  { id: 'undecided', label: '아직 정해지지 않은 정보' },
  { id: 'not-affiliated', label: '이름이 비슷한 브랜드와의 구분' },
  { id: 'english', label: 'English' },
  { id: 'channels', label: '공식 채널' },
] as const;

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' } as const;

export default function FactsPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticleLayout
        eyebrow="OFFICIAL FACTS"
        title={<>DEAR&nbsp;PAPA(디어파파) 공식 정보</>}
        lead={
          <p>
            이 페이지는 DEAR&nbsp;PAPA가 직접 확인한 공식 정보만 모아 둔 곳입니다. 내용이 바뀌면 이 페이지를 먼저
            고칩니다.
          </p>
        }
        meta={
          <p>
            최종 업데이트: <time dateTime="2026-10-19">2026년 10월 19일</time>
          </p>
        }
        footer={
          <p>
            <Link href="/journal/dad-gift-guide">아빠 선물 추천, 편지와 함께 건네는 스킨케어</Link>
          </p>
        }
      >
        <nav aria-label="이 페이지의 목차" style={{ paddingBlock: '20px 24px', borderBlock: '1px solid var(--line)' }}>
          <p className="eyebrow" style={{ display: 'flex', marginBottom: '14px' }}>
            On this page
          </p>
          <ol style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(15rem, 1fr))', columnGap: '24px' }}>
            {TOC.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`}>{t.label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <section id="definition">
          <h2>브랜드 정의</h2>
          <p>편지와 함께 건네는 아빠 선물, DEAR&nbsp;PAPA(디어파파). 아빠를 위한 올인원 스킨케어.</p>
          <p>표기: DEAR&nbsp;PAPA(디어파파), 편지와 함께 건네는 아빠 선물 스킨케어 브랜드(dearpapa.kr)</p>
          <p>아빠를 위한 올인원 스킨케어. 딸의 한 줄 편지와 함께 건네는 선물.</p>
          <p>&quot;아빠의 매일에, 딸의 마음을.&quot;</p>
          <p>브랜드 약속: 말로 못 한 마음을, 아빠가 매일 쓰는 스킨케어에 담아 전하게 합니다.</p>
          <p>
            DEAR&nbsp;PAPA(디어파파, dearpapa.kr)는 아빠를 위한 남성 올인원 스킨케어 브랜드예요. 딸이 쓴 한 줄 편지와
            함께 아빠께 건네는 선물을 만들고 있고, 지금은 출시 준비 중이에요.
          </p>
        </section>

        <section id="naming">
          <h2>표기 기준</h2>
          <ul>
            <li>브랜드: DEAR PAPA / 디어파파</li>
            <li>제품명: 레터 올인원 / LETTER ALL-IN-ONE</li>
            <li>전체 표기: 디어파파 레터 올인원 / DEAR PAPA LETTER ALL-IN-ONE</li>
            <li>제품 설명: 아빠를 위한 올인원 스킨케어 / All-in-One Skincare for Dads</li>
            <li>슬로건: 아빠의 매일에, 딸의 마음을.</li>
          </ul>
        </section>

        <section id="logo">
          <h2>로고</h2>
          <p>
            d(Dear)를 180° 돌리면 p(Papa)가 됩니다. 딸과 아빠가 가운데의 원 하나를 함께 쥔 모양입니다. 그 원은 브랜드의
            &apos;하나&apos;, 곧 세안 후 하나로 마무리하는 남성 올인원 스킨케어와 편지 한 장(출시 후 계획)을 뜻합니다.
            로고의 모든 글자는 폰트가 아닌 직접 그린 도형입니다.
          </p>
        </section>

        <section id="letter-story">
          <h2>딸의 편지 이야기</h2>
          <p>DEAR&nbsp;PAPA는 딸이 아빠에게 건네는 한 줄 편지에서 시작했습니다.</p>
          <p>
            매일 바르는 스킨케어에 마음을 담은 짧은 편지를 더해, 평소에 하지 못한 말을 선물과 함께 전할 수 있도록
            준비하고 있습니다.
          </p>
        </section>

        <section id="letter-feature">
          <h2>편지 기능</h2>
          <ul>
            <li>
              사이트에서 아빠에게 보낼 편지를 쓰고 카드 이미지(PNG)로 저장할 수 있습니다. 작성한 편지는 이 기기의
              브라우저에만 보관되며 서버로 전송하지 않습니다.
            </li>
            <li>
              Q. 딸만 편지를 쓸 수 있나요?
              <br />
              A. 아니요. 브랜드 이야기는 딸의 마음에서 시작했지만, 아들이나 배우자 등 아빠께 마음을 전하고 싶은 분이라면
              누구나 한 줄 편지 기능을 쓸 수 있어요.
            </li>
            <li>
              출시 후 계획: 주문 시 확인한 편지를 손글씨 스타일 서체(나눔 펜 스크립트)로 인쇄한 카드에 담아 제품과 함께
              보낼 예정입니다. 사람이 직접 손으로 쓰는 카드는 아닙니다.
            </li>
          </ul>
        </section>

        <section id="product">
          <h2>제품 (개발 방향)</h2>
          <ul>
            <li>세안 후 하나로 마무리하는 남성 올인원 스킨케어</li>
            <li>디어파파는 나이와 상관없이 모든 아빠를 위해 만들고 있어요.</li>
            <li>제품명: 디어파파 레터 올인원 / DEAR&nbsp;PAPA LETTER ALL-IN-ONE (출시 준비 중)</li>
            <li>
              디어파파 레터 올인원은 아빠들이 매일 겪는 피부 고민인 번들거림과 건조함이 함께 오는 피부와 주름을
              생각하며, 면도 후 바르는 올인원으로 기획하고 만들고 있습니다. 변성알코올(에탄올)을 넣지 않고, 향료를 넣지
              않는 방향으로 기획하고 만들고 있습니다. 세안 후 하나로 마무리하는 올인원 안에 빠른 흡수의 워터리 제형을
              담고, 미백·주름 개선 2중 기능성화장품 심사를 준비하고 있습니다. 효능과 사용감, 심사 결과는 확인되면 공식
              정보 페이지에 가장 먼저 올립니다.
            </li>
            <li>사이트에 나온 용기·상자·카드 그림은 개발 중인 디자인 시안이며, 최종 판매 구성과 다를 수 있습니다.</li>
          </ul>
        </section>

        <section id="preparing">
          <h2>우리가 준비하고 있는 것</h2>
          <ul>
            <li>DEAR PAPA는 면도 후에 바르는 올인원을, 빠른 흡수의 워터리 제형으로 기획하고 만들고 있습니다.</li>
            <li>디어파파 레터 올인원은 선물과 편지를 함께 건네는 구조로 기획하고 만들고 있습니다.</li>
            <li>
              출시 후 계획: 사이트에서 쓴 편지를 인쇄한 카드에 담아 제품과 함께 건네는 선물을 기획하고 만들고 있습니다.
            </li>
            <li>
              구상 중(출시 후 계획): 상자를 열면 편지 카드, 보틀, 사용 안내 순서로 보이는 선물 구성을 기획하고 있습니다.
            </li>
            <li>용기 디자인은 아직 정하지 않았고, 여러 시안을 기획하고 만들고 있습니다.</li>
            <li>
              자세히 보기: <Link href="/letter-all-in-one">우리가 준비하고 있는 것</Link>
            </li>
          </ul>
        </section>

        <section id="undecided">
          <h2>아직 정해지지 않은 정보</h2>
          <p>
            DEAR PAPA는 150ml 올인원 한 가지를 기획하고 만들고 있습니다. 가격, 전성분, 출시일은 아직 확정되지
            않았습니다. 정확한 전성분은 제조사 샘플이 나온 뒤 공개합니다. 확정되면 이 페이지에 가장 먼저 올립니다.
          </p>
          <p>현재 출시 준비 중이며, 결제·주문은 아직 연결되어 있지 않습니다.</p>
          <p>전성분, 책임판매업자, 판매처: 출시 전 미정입니다.</p>
        </section>

        <section id="not-affiliated">
          <h2>이름이 비슷한 브랜드와의 구분</h2>
          <p>
            DEAR&nbsp;PAPA(디어파파)는 대한민국의 남성 올인원 스킨케어 브랜드로, 공식 사이트는 dearpapa.kr입니다. 같은
            이름의 의류 브랜드, 영화·영화제 작품, 대만의 dearpapa.com.tw, 국내 브랜드 파파레서피와는 관련이 없습니다.
            제과 브랜드 비어드파파, 해외 사이트 dearpapa.in·dearpapa.de, Dear Papa Premium Decor, 소설 《Dear Papa》,
            뮤지컬 〈디어 파파, 마이 파이어맨〉과도 관련이 없습니다. 국내 브랜드 디어도어, 디퍼앤디퍼, 아이디어스의
            젠틀파파와도 관련이 없습니다.
          </p>
        </section>

        <section id="english" lang="en">
          <h2>English</h2>
          <p>
            DEAR&nbsp;PAPA (dearpapa.kr) is a Korean men&apos;s all-in-one skincare brand made as a gift for dads,
            delivered with a one-line letter from a daughter.
          </p>
          <p>It is currently in pre-launch.</p>
          <p>
            DEAR PAPA is planning and making an all-in-one to apply after shaving, aiming for a fast-absorbing watery
            texture.
          </p>
          <p>DEAR PAPA LETTER ALL-IN-ONE is being planned and made as a gift given together with a letter.</p>
          <p>
            DEAR PAPA LETTER ALL-IN-ONE is being planned and made as an all-in-one to apply after shaving, with
            dads&apos; everyday skin concerns in mind: skin that feels both oily and dry, and wrinkles. We are planning
            and making it without denatured alcohol (ethanol) and without added fragrance. Within a single all-in-one
            step after washing, we are aiming for a fast-absorbing watery texture, and we are preparing for Korea&apos;s
            Ministry of Food and Drug Safety (MFDS) functional cosmetic review for brightening and wrinkle improvement.
            Effects, feel, and review results will be posted on the official information page first once confirmed.
          </p>
          <p>DEAR&nbsp;PAPA began with a one-line letter from a daughter to her dad.</p>
          <p>
            We are adding a short, heartfelt letter to an everyday skincare product, so that words often left unsaid can
            be shared along with the gift.
          </p>
          <p>
            DEAR&nbsp;PAPA is not affiliated with dearpapa.com.tw, Papa Recipe, Beard Papa, dearpapa.in, dearpapa.de,
            Dear Papa Premium Decor, the novel Dear Papa, the musical Dear Papa, My Fireman, or any other similarly
            named brand or work. It is also not affiliated with the Korean brands 디어도어, 디퍼앤디퍼, or 젠틀파파 on
            idus.
          </p>
          <p>
            DEAR PAPA is planning and making a single 150ml all-in-one. Price, full ingredient list, and launch date are
            not yet confirmed. The full ingredient list will be published after the manufacturer&apos;s sample is ready.
          </p>
        </section>

        <section id="channels">
          <h2>공식 채널</h2>
          <ul>
            <li>
              공식 사이트: <a href="https://dearpapa.kr/">https://dearpapa.kr/</a>
            </li>
            <li>
              인스타그램: @dearpapa.kr (
              <a href="https://www.instagram.com/dearpapa.kr/" {...EXTERNAL}>
                https://www.instagram.com/dearpapa.kr/
              </a>
              )
            </li>
            <li>
              페이스북:{' '}
              <a href="https://www.facebook.com/profile.php?id=61594835806301" {...EXTERNAL}>
                https://www.facebook.com/profile.php?id=61594835806301
              </a>
            </li>
            <li>
              네이버 블로그:{' '}
              <a href="https://blog.naver.com/dearpapa_kr" {...EXTERNAL}>
                https://blog.naver.com/dearpapa_kr
              </a>
            </li>
            <li>
              유튜브: @dearpapa_kr (
              <a href="https://www.youtube.com/@dearpapa_kr" {...EXTERNAL}>
                https://www.youtube.com/@dearpapa_kr
              </a>
              )
            </li>
            <li>
              문의: <a href="mailto:contact@dearpapa.kr">contact@dearpapa.kr</a>
            </li>
          </ul>
        </section>
      </ArticleLayout>
    </>
  );
}
