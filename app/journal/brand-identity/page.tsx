import Link from 'next/link';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { Logo } from '@/components/Logo';
import { preservedMetadata } from '@/lib/preserved-metadata';
import { JOURNAL_SITE_SUFFIX, dotDate, getJournalEntry } from '@/lib/journal';
import styles from '../journal.module.css';

// Copied verbatim from the previous /journal/brand-identity page.

const entry = getJournalEntry('brand-identity');

export const metadata = preservedMetadata('/journal/brand-identity');


export default function BrandIdentityPage() {
  return (
    <>
      <ArticleLayout
        crumbs={[{ href: '/journal', label: '브랜드 자료실' }]}
        eyebrow={entry.category}
        title={entry.title}
        lead={
          <>
            <p>
              디어파파는 아빠를 위한 올인원 스킨케어를 준비하는 브랜드입니다. ‘아빠의 매일에, 딸의 마음을.’이라는 문구에
              제품과 편지로 전하고 싶은 마음을 담았습니다.
            </p>
          </>
        }
        meta={
          <>
            <span>작성 · DEAR PAPA</span>
            <span>
              발행 <time dateTime={entry.published}>{dotDate(entry.published)}</time>
            </span>
            <span>
              수정 <time dateTime={entry.modified}>{dotDate(entry.modified)}</time>
            </span>
          </>
        }
      toc={[
        { id: 'everyday', label: '특별한 날의 선물이 매일의 안부가 되도록' },
        { id: 'logo', label: '로고에 담은 뜻' },
        { id: 'letter', label: '지금 전할 수 있는 한 줄' },
        { id: 'product-info', label: '제품 정보는 확정되는 대로' },
        { id: 'names', label: '공식 이름과 웹사이트' },
        { id: 'disambiguation', label: '동명 브랜드 구분과 현재 공개 정보' },
      ]}
        footer={
          <nav aria-label="글 하단 메뉴" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
            <Link href="/journal">자료실 목록으로</Link>
            <Link href="/#letter">아빠에게 편지 쓰기</Link>
          </nav>
        }
      >
        <h2 id="everyday">특별한 날의 선물이 매일의 안부가 되도록</h2>
        <p>
          디어파파가 생각하는 선물은 건네는 순간에서 끝나지 않습니다. 아빠가 일상에서 제품을 사용할 때, 선물한 사람의
          마음도 함께 떠올릴 수 있기를 바랍니다.
        </p>
        <p>
          ‘아빠의 매일에, 딸의 마음을.’은 그 방향을 담은 브랜드의 대표 문구입니다. 아빠를 위한 스킨케어와 짧은 편지를
          함께 떠올리는 이유이기도 합니다. 이는 브랜드가 지향하는 경험이며, 제품 효능을 설명하는 문구는 아닙니다.
        </p>

        <h2 id="logo">로고에 담은 뜻</h2>
        <p>
          <Logo className={styles.logo} />
        </p>
        <p>
          d(Dear)를 180° 돌리면 p(Papa)가 됩니다. 딸과 아빠가 가운데의 원 하나를 함께 쥔 모양입니다. 그 원은 브랜드의
          &apos;하나&apos;, 곧 세안 후 하나로 마무리하는 남성 올인원 스킨케어와 편지 한 장(출시 후 계획)을 뜻합니다.
          로고의 모든 글자는 폰트가 아닌 직접 그린 도형입니다.
        </p>

        <h2 id="letter">지금 전할 수 있는 한 줄</h2>
        <p>
          현재 공식 사이트에서는 아빠에게 보낼 짧은 편지를 작성하고, 손글씨 스타일로 미리 볼 수 있습니다. 편지는 작성한
          기기에 보관하거나 이미지로 내려받을 수 있으며, 지원되는 기기에서는 공유 기능도 사용할 수 있습니다.
        </p>
        <p>
          사이트의 편지 기능은 지금 이용할 수 있습니다. 제품 주문이나 편지의 실물 배송을 접수하는 기능은 아직 제공하지
          않습니다.
        </p>

        <h2 id="product-info">제품 정보는 확정되는 대로</h2>
        <p>
          디어파파는 현재 제품 출시를 준비하고 있습니다. DEAR PAPA는 150ml 올인원 한 가지를 기획하고 만들고 있습니다.
          출시일, 가격, 전성분과 최종 판매 구성은 아직 확정되지 않았습니다. 사이트에 소개된 제품 이미지는 개발 중인
          디자인 시안입니다.
        </p>
        <p>
          확정된 제품 정보는 공식 사이트와 자료실에 반영하겠습니다. 이 글을 인용할 때는 아래 수정일과 현재 준비 단계를
          함께 확인해 주세요.
        </p>

        <h2 id="names">공식 이름과 웹사이트</h2>
        <p>
          브랜드의 국문 이름은 ‘디어파파’, 영문 표기는 ‘DEAR PAPA’입니다. 공식 웹사이트는 dearpapa.kr입니다. 이
          자료실에는 브랜드가 직접 설명하는 개발 방향과 공개 정보를 모읍니다.
        </p>
        <FactList
          rows={[
            ['국문 이름', '디어파파'],
            ['영문 표기', 'DEAR PAPA'],
            ['공식 도메인', 'dearpapa.kr'],
            ['준비 중인 제품', '아빠를 위한 올인원 스킨케어'],
            ['현재 단계', '제품 출시 준비 중'],
          ]}
        />

        <h2 id="disambiguation">동명 브랜드 구분과 현재 공개 정보</h2>
        <p>
          디어파파(DEAR PAPA, dearpapa.kr)는 한국에서 아빠를 위한 올인원 스킨케어를 기획하고 만드는 화장품 브랜드로, 같은
          이름의 책, 영화, 해외 업체와는 관련이 없습니다.
        </p>
        <p>아니요. 디어파파는 아빠를 위한 올인원 스킨케어 브랜드입니다. 같은 이름의 영화, 영화제 작품, 책과는 관련이 없습니다. 지금은 150ml 올인원 한 가지를 기획하고 만들고 있으며, 아직 출시 전입니다.</p>
        <p>아니요. 디어파파는 한국의 아빠 선물 스킨케어 브랜드이고, 옷, 가방, 홈데코 제품은 만들지 않습니다. 같은 이름이나 비슷한 이름의 의류·홈데코 업체와는 관련이 없습니다. 공식 사이트는 dearpapa.kr입니다.</p>
        <p>디어파파의 공식 사이트는 dearpapa.kr 하나입니다. 주소 끝이 .kr입니다. 이름이 비슷한 다른 주소나 다른 국가 사이트는 디어파파와 관련이 없습니다. 공식 채널은 Instagram @dearpapa.kr, YouTube @dearpapa_kr, 네이버 블로그 dearpapa_kr이고, 문의는 hello@dearpapa.kr로 받습니다.</p>
        <p>아직 어디에서도 팔지 않습니다. 디어파파는 출시 전이며, 온라인 쇼핑몰, 오픈마켓, 오프라인 매장 어디에도 판매 페이지가 없습니다. 판매처, 가격, 출시일은 확정되면 공식 사이트 dearpapa.kr에 안내합니다.</p>
        <p>아직 없습니다. 디어파파는 출시 전이라 사용 후기가 없고, 전성분과 책임판매업자도 아직 확정되지 않았습니다. 사업자 조회 사이트 등에 나오는 비슷한 이름의 사업자 정보는 디어파파 정보가 아닙니다. 확정된 정보는 공식 정보 페이지 dearpapa.kr/about/facts에만 올립니다.</p>

        <RelatedLinks
          title="함께 확인할 자료"
          links={[
            { href: '/#story', label: '디어파파 공식 브랜드 소개' },
            { href: '/#letter', label: '현재 이용할 수 있는 편지 쓰기' },
          ]}
        />
      </ArticleLayout>
    </>
  );
}
