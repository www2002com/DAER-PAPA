'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import { SectionLogo } from '@/components/SectionLogo';
import styles from './Product.module.css';

const VIEWS = [
  {
    id: 'bottle',
    label: '용기',
    caption: '차분한 블루 몸체에 DEAR PAPA의 이름을 담은 용기 시안입니다. 용기와 사양은 확정 전이에요.',
  },
  {
    id: 'box',
    label: '단상자',
    caption: '차분한 블루 용기에 맞춘 슬림한 무광 단상자 시안입니다. 로고 중심의 접이식 상자. 상세 표기는 옆면과 뒷면에 정리합니다.',
  },
  {
    id: 'cap',
    label: '캡 디테일',
    caption: '투명 캡과 용기 상부를 가까이 살펴본 디자인 시안입니다. 용기의 구조와 최종 사양은 확정 전입니다.',
  },
  {
    id: 'together',
    label: '함께 보기',
    caption: '용기와 단상자를 나란히 놓은 기획 이미지입니다. 최종 제품과 판매 구성은 확정 전입니다.',
  },
] as const;

type ViewId = (typeof VIEWS)[number]['id'];

function ViewArt({ id, small = false }: { id: ViewId; small?: boolean }) {
  if (id === 'box') return <Image src="/images/campaign-blue/carton.webp" alt={small ? '' : '레터 올인원 용기와 색상·로고를 맞춘 차분한 블루 슬림 단상자 디자인 시안'} width={1024} height={1536} className={styles.vBox} />;
  const art = {
    bottle: { file: 'bottle', alt: '파우더블루 배경 위 레터 올인원 블루 용기의 정면 디자인 시안' },
    cap: { file: 'cap', alt: '닫힌 투명 캡과 앞쪽 노즐을 낮은 시점에서 본 레터 올인원 디자인 시안' },
    together: { file: 'packaging', alt: '레터 올인원 용기와 단상자를 나란히 놓고 위에서 본 디자인 시안' },
  }[id];
  return <Image src={`/images/campaign-blue/${art.file}.webp`} alt={small ? '' : art.alt} width={1672} height={941} className={styles.vCampaign} />;
}

// Design drafts of the packaging, one at a time. Captions are the brand's own descriptions.
export function ProductViewer() {
  const uid = useId();
  const [view, setView] = useState<ViewId>('bottle');
  const current = VIEWS.find((v) => v.id === view)!;

  return (
    <div className={styles.viewer} data-reveal="from-left">
      <div className={styles.viewerHead}>
        <SectionLogo />
        <span className={`tag ${styles.draftTag}`}>디자인 시안</span>
      </div>
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
            tabIndex={v.id === view ? 0 : -1}
            className={styles.thumb}
            onClick={() => setView(v.id)}
            onKeyDown={(event) => {
              const index = VIEWS.findIndex((item) => item.id === v.id);
              const next = event.key === 'ArrowRight' ? (index + 1) % VIEWS.length
                : event.key === 'ArrowLeft' ? (index + VIEWS.length - 1) % VIEWS.length
                : event.key === 'Home' ? 0 : event.key === 'End' ? VIEWS.length - 1 : -1;
              if (next < 0) return;
              event.preventDefault();
              setView(VIEWS[next].id);
              document.getElementById(`${uid}-${VIEWS[next].id}`)?.focus();
            }}
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
      <noscript>
        <dl className={styles.fallbackCaptions}>
          {VIEWS.filter((item) => item.id !== 'bottle').map((item) => (
            <div key={item.id}>
              <dt>{item.label}</dt>
              <dd>{item.caption}</dd>
            </div>
          ))}
        </dl>
      </noscript>
    </div>
  );
}
