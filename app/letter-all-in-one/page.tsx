import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductPage.module.css';
import { LaunchNotifySection } from '@/components/LaunchNotifySection';
import { ArticleLayout, RelatedLinks } from '@/components/article/ArticleLayout';
import { ComparisonTable } from '@/components/article/ComparisonTable';
import { preservedMetadata } from '@/lib/preserved-metadata';
import {
  COMPARE_HEAD, COMPARE_INTRO, COMPARE_NOTES, COMPARE_ROWS, FIT_FOR, FIT_INTRO, NOT_YET_FOR, PRODUCT_FAQ,
} from '@/lib/product-fit';

// Copied verbatim from the previous /letter-all-in-one page. Heading ids are kept for old #anchors.

export const metadata = preservedMetadata('/letter-all-in-one');


export default function LetterAllInOnePage() {
  return (
    <>
      <ArticleLayout
        eyebrow="THE PRODUCT"
        title="우리가 준비하고 있는 것"
        lead={<p>제품명: 디어파파 레터 올인원 / DEAR&nbsp;PAPA LETTER ALL-IN-ONE (출시 준비 중)</p>}
        meta={
          <p>
            최종 업데이트: <time dateTime="2026-10-29">2026년 10월 29일</time>
          </p>
        }
        footer={
          <p>
            <Link href="/journal/dad-gift-guide">아빠 선물 추천, 편지와 함께 건네는 스킨케어</Link>
          </p>
        }
      >
        <nav className={styles.contents} aria-label="제품 정보 바로가기">
          <a href="#after-shave">제품 소개</a>
          <a href="#compare">종류별 비교</a>
          <a href="#faq">자주 묻는 질문</a>
          <a href="#undecided">미정 정보</a>
        </nav>
        <figure className={styles.campaign}>
          <Image src="/images/campaign-blue/packaging.webp" width={1672} height={941}
            alt="파우더블루 배경 위 차분한 블루 색상의 레터 올인원 용기와 단상자를 나란히 놓은 디자인 시안"
            preload sizes="(max-width: 700px) calc(100vw - 44px), 608px"
            // Smaller copies round their height by a pixel; pin the original shape so the page below never moves.
            style={{ aspectRatio: '1672 / 941' }} />
          <figcaption>용기와 단상자는 개발 중인 디자인 시안입니다. 최종 제품과 판매 구성은 확정 전입니다.</figcaption>
        </figure>
        <h2 id="after-shave">면도 후에 바르는 올인원</h2>
        <p>디어파파는 면도 후에 바르는 올인원을, 빠른 흡수의 워터리 제형으로 기획하고 만들고 있습니다.</p>
        <p>세안 후 하나로 마무리하는 남성 올인원 스킨케어.</p>
        <p>
          디어파파 레터 올인원은 아빠들이 매일 겪는 피부 고민인 번들거림과 건조함이 함께 오는 피부를 생각하며,
          면도 후 바르는 올인원으로 기획하고 만들고 있습니다. 변성알코올(에탄올)을 넣지 않고, 향료를 넣지 않는 방향으로
          기획하고 만들고 있습니다. 세안 후 하나로 마무리하는 올인원 안에 빠른 흡수의 워터리 제형을 담고,{'\u0020'}
        </p>
        <p>미백·주름 개선 2중 기능성화장품 심사를 준비하고 있습니다.{'\u0020'}</p>
        <p>효능과 사용감, 심사 결과는 확인되면 공식 정보 페이지에 올립니다.</p>

        <h2 id="fit">이런 분께 맞아요</h2>
        <p>{FIT_INTRO}</p>
        <ul>
          {FIT_FOR.map((item) => <li key={item}>{item}</li>)}
        </ul>

        <h2 id="not-yet-fit">아직 이런 분께는 맞지 않아요</h2>
        <ul>
          {NOT_YET_FOR.map((item) => <li key={item}>{item}</li>)}
        </ul>

        <h2 id="compare">올인원과 스킨(토너)·로션·애프터셰이브 비교</h2>
        <p>{COMPARE_INTRO}</p>
        <ComparisonTable label="올인원과 스킨·로션·애프터셰이브 비교표">
        <table>
          <thead>
            <tr>{COMPARE_HEAD.map((cell) => <th scope="col" key={cell}>{cell}</th>)}</tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map(([label, ...cells]) => (
              <tr key={label}><th scope="row">{label}</th>{cells.map((cell, i) => <td key={i}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
        </ComparisonTable>
        {COMPARE_NOTES.map((note) => <p key={note}>{note}</p>)}

        <h2 id="faq">자주 묻는 질문</h2>
        {PRODUCT_FAQ.map(({ q, a }) => (
          <div key={q}>
            <h3>{q}</h3>
            <p>{a}</p>
          </div>
        ))}

        <h2 id="gift-letter">선물과 편지</h2>
        <p>디어파파 레터 올인원은 선물과 편지를 함께 건네는 구조로 기획하고 만들고 있습니다.</p>
        <p>출시 후 계획: 사이트에서 쓴 편지를 인쇄한 카드에 담아 제품과 함께 건네는 선물을 기획하고 만들고 있습니다.</p>

        <h2 id="unboxing">상자를 여는 순서 (구상 중)</h2>
        <p>
          구상 중(출시 후 계획): 상자를 열면 편지 카드, 보틀, 사용 안내 순서로 보이는 선물 구성을 기획하고 있습니다.
        </p>

        <h2 id="container">용기</h2>
        <p>용기 디자인은 아직 정하지 않았고, 여러 시안을 기획하고 만들고 있습니다.</p>

        <h2 id="undecided">아직 정해지지 않은 정보</h2>
        <p>
          DEAR PAPA는 150ml 올인원 한 가지를 기획하고 만들고 있습니다. 가격, 전성분, 출시일은 아직 확정되지 않았습니다.
          정확한 전성분은 제조사 샘플이 나온 뒤 공개합니다.
        </p>
        <p>현재 출시 준비 중이며, 결제·주문은 아직 연결되어 있지 않습니다.</p>
        <p>효능과 사용감, 심사 결과는 확인되면 공식 정보 페이지에 올립니다.</p>

        <LaunchNotifySection placement="product" />

        <div id="see-also">
          <RelatedLinks
            title="함께 보기"
            links={[
              { href: '/about/facts#preparing', label: 'DEAR PAPA(디어파파) 공식 정보' },
              { href: '/#product', label: '홈: 제품 소개' },
              { href: '/#letter', label: '아빠에게 편지 쓰기' },
            ]}
          />
        </div>
      </ArticleLayout>
    </>
  );
}
