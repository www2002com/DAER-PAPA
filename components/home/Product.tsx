import Link from 'next/link';
import { RitualIcon } from '@/components/art/Art';
import { LETTER, PRODUCT, UNDECIDED } from '@/lib/facts';
import { ProductViewer } from './ProductViewer';
import { UnboxSteps } from './UnboxSteps';
import styles from './Product.module.css';

const d = (ms: number) => ({ ['--reveal-delay' as string]: ms }) as React.CSSProperties;

type Spec = { k: string; v: React.ReactNode; note?: string; tag?: { label: string; tone?: 'soft' | 'later' } };

// Only what can be said today. Undecided items say so plainly.
const SPECS: Spec[] = [
  { k: '사용', v: PRODUCT.usage, tag: { label: '개발 방향' } },
  { k: '제형', v: '빠른 흡수의 워터리 제형', note: PRODUCT.afterShave, tag: { label: '개발 방향' } },
  { k: '기획 방향', v: PRODUCT.noAdded, tag: { label: '개발 방향' } },
  {
    k: '기능성',
    v: '미백·주름 개선 2중 기능성화장품 심사를 준비하고 있습니다.',
    tag: { label: '심사 준비 중', tone: 'soft' },
  },
  { k: '용량', v: '150ml', note: UNDECIDED.sizeLine, tag: { label: '기획' } },
  { k: '가격', v: '미정', tag: { label: '미정', tone: 'later' } },
  { k: '전성분', v: '미정', note: UNDECIDED.ingredients, tag: { label: '미정', tone: 'later' } },
  { k: '출시일', v: '미정', tag: { label: '미정', tone: 'later' } },
  { k: '용기', v: '디자인 미정', note: PRODUCT.container, tag: { label: '미정', tone: 'later' } },
  { k: '책임판매업자 · 판매처', v: '출시 전 미정', tag: { label: '미정', tone: 'later' } },
];

const STEPS = [
  { n: '01', now: true, title: '1단계: 편지 쓰기', body: '손글씨 스타일로 바로 미리 볼 수 있어요.' },
  {
    n: '02',
    now: true,
    title: '2단계: 저장하고 간직하기',
    body: '이미지로 내려받거나, 이 기기의 보관함에 담아 둡니다. 가입은 필요 없어요.',
  },
  {
    n: '03',
    now: false,
    title: '3단계: 주문할 때 최종 확인',
    body: '주문 과정에서 동봉될 편지의 최종 내용을 확인하고 확정합니다. 확정본은 이후 보관함 수정과 분리됩니다.',
  },
  { n: '04', now: false, title: '4단계: 인쇄 카드와 함께 배송', body: LETTER.printPlan },
];

export function Product() {
  return (
    <section id="product" className={styles.section} aria-labelledby="product-title">
      <div className="container">
        <header className={styles.head}>
          <p className="eyebrow" data-reveal>
            The Product
          </p>
          <h2 id="product-title" className={styles.title} data-reveal style={d(80)}>
            딸의 마음을 담을,
            <br />
            아빠의 하나.
          </h2>
          <p className={styles.lead} data-reveal style={d(160)}>
            선물하는 마음만큼, 쓰는 아빠의 취향까지. 세안 후 하나로 마무리하는 올인원을 준비하며, 실제 사용감과 편의성,
            가격을 제품 선택의 기준으로 확인해 나가겠습니다. 확정된 정보부터 공개합니다.
          </p>
        </header>

        <div className={styles.split}>
          <div className={styles.viewerCol} data-reveal="fade">
            <ProductViewer />
          </div>

          <div className={styles.info}>
            <div className={styles.nameBlock} data-reveal>
              <span className="tag" data-tone="soft">
                출시 준비 중
              </span>
              <h3 className={styles.name}>{PRODUCT.name}</h3>
              <p className={styles.nameEn}>{PRODUCT.nameEn}</p>
              <p className={styles.metaLine}>
                <span>150ml (기획)</span>
                <span>면도 후</span>
                <span>워터리 제형</span>
                <span className={styles.metaNote}>개발 방향 기준</span>
              </p>
            </div>

            <dl className={styles.specs}>
              {SPECS.map((s, i) => (
                <div key={s.k} className={styles.spec} data-reveal style={d(i * 40)}>
                  <dt>{s.k}</dt>
                  <dd>
                    <span
                      className={styles.specValue}
                      data-undecided={s.v === '미정' || s.v === '출시 전 미정' || undefined}
                    >
                      {s.v}
                    </span>
                    {s.note && <span className={styles.specNote}>{s.note}</span>}
                    {s.tag && (
                      <span className={`tag ${styles.specTag}`} data-tone={s.tag.tone}>
                        {s.tag.label}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <p className={styles.notice}>
              {PRODUCT.resultsFirst} {UNDECIDED.status}
            </p>

            <details className={styles.more}>
              <summary>
                개발 방향 전문 보기
                <span className={styles.plus} aria-hidden="true" />
              </summary>
              <div className={styles.moreBody}>
                <p>{PRODUCT.development}</p>
                <p>{PRODUCT.drafts}</p>
                <Link href="/letter-all-in-one" className="link-arrow">
                  우리가 준비하고 있는 것
                  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </Link>
              </div>
            </details>
          </div>
        </div>

        {/* Ritual */}
        <div className={styles.ritual}>
          <p className={styles.ritualHead} data-reveal>
            <span className="tag">개발 방향</span>
            {PRODUCT.usage}
          </p>
          <ol className={styles.ritualSteps}>
            {(
              [
                ['wash', '씻고'],
                ['pump', '덜고'],
                ['apply', '바르고'],
              ] as const
            ).map(([kind, label], i) => (
              <li key={kind} data-reveal style={d(i * 120)}>
                <RitualIcon kind={kind} className={styles.ritualIcon} />
                <span>{label}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Unboxing order (still being planned) */}
        <div className={styles.unboxWrap}>
          <div className={styles.unboxText}>
            <p className="eyebrow" data-reveal>
              Gift Set
            </p>
            <h3 className={styles.subTitle} data-reveal style={d(80)}>
              개봉할 때의 마음이
              <br />
              일상으로 이어지도록.
            </h3>
            <p data-reveal style={d(160)}>
              {PRODUCT.unboxing}
            </p>
            <p className={styles.small} data-reveal style={d(220)}>
              {PRODUCT.giftStructure} 디자인 시안입니다. 최종 판매 구성이 아니며, 형태와 사양은 확정되지 않았습니다.
            </p>
          </div>
          <div data-reveal="fade">
            <UnboxSteps />
          </div>
        </div>

        {/* From letter to Dad's hands */}
        <div className={styles.process}>
          <header className={styles.processHead}>
            <h3 className={styles.subTitle} data-reveal>
              쓴 편지가 아빠 손에 닿기까지.
            </h3>
            <p data-reveal style={d(80)}>
              지금 할 수 있는 것과 출시 후 열리는 것을 구분해 두었어요. 사람이 손으로 쓴 카드가 아니라, 확인한 편지를
              손글씨 스타일로 인쇄한 카드입니다.
            </p>
          </header>
          <ol className={styles.steps}>
            {STEPS.map((s, i) => (
              <li key={s.n} className={styles.step} data-now={s.now || undefined} data-reveal style={d(i * 100)}>
                <span className={styles.stepNum}>{s.n}</span>
                <span className="tag" data-tone={s.now ? 'now' : 'later'}>
                  {s.now ? '지금 가능' : '출시 후'}
                </span>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
          <a href="#letter" className={`link-arrow ${styles.processCta}`}>
            지금 1단계부터 시작하기
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
