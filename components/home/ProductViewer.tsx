'use client';

import { useId, useState } from 'react';
import { Bottle, GiftBox } from '@/components/art/Art';
import { LetterCard } from '@/components/letter/LetterCard';
import styles from './Product.module.css';

const VIEWS = [
  {
    id: 'bottle',
    label: '용기',
    caption: '아이보리 몸체와 종이 질감의 캡. 앞면에는 브랜드와 제품군만 간결하게 담습니다.',
  },
  {
    id: 'box',
    label: '단상자',
    caption: '로고 중심의 접이식 상자. 상세 표기는 옆면과 뒷면에 정리합니다.',
  },
  {
    id: 'card',
    label: '메시지 카드',
    caption: '여백을 넉넉히 남긴 카드. 주문할 때 확인한 편지를 손글씨 스타일로 인쇄해 동봉할 계획이에요.',
  },
] as const;

type ViewId = (typeof VIEWS)[number]['id'];

function ViewArt({ id, small = false }: { id: ViewId; small?: boolean }) {
  const key = small ? 'thumb' : 'main';
  if (id === 'bottle') return <Bottle id={`pv-${key}-bottle`} className={styles.vBottle} />;
  if (id === 'box') return <GiftBox id={`pv-${key}-box`} className={styles.vBox} />;
  return (
    <div className={styles.vCard}>
      <LetterCard text={small ? '' : '아빠, 늘 고마워요.'} label="메시지 카드 시안" />
    </div>
  );
}

// Design drafts of the packaging, one at a time. Captions are the brand's own descriptions.
export function ProductViewer() {
  const uid = useId();
  const [view, setView] = useState<ViewId>('bottle');
  const current = VIEWS.find((v) => v.id === view)!;

  return (
    <div className={styles.viewer}>
      <div className={styles.stage} id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-${view}`}>
        {VIEWS.map((v) => (
          <div
            key={v.id}
            className={styles.stageItem}
            data-active={v.id === view || undefined}
            aria-hidden={v.id !== view}
          >
            <ViewArt id={v.id} />
          </div>
        ))}
        <span className={`tag ${styles.draftTag}`}>디자인 시안</span>
      </div>

      <div className={styles.thumbs} role="tablist" aria-label="선물 구성 시안 보기">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            id={`${uid}-${v.id}`}
            type="button"
            role="tab"
            aria-selected={v.id === view}
            aria-controls={`${uid}-panel`}
            className={styles.thumb}
            onClick={() => setView(v.id)}
          >
            <span className={styles.thumbArt} aria-hidden="true">
              <ViewArt id={v.id} small />
            </span>
            <span>{v.label}</span>
          </button>
        ))}
      </div>

      <p className={styles.viewCaption} aria-live="polite">
        <strong>{current.label}</strong> {current.caption}
      </p>
    </div>
  );
}
