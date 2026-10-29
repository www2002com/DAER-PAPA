import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ArticleToc } from '@/components/article/ArticleLayout';

describe('ArticleToc', () => {
  it('renders jump links and a question-style title when every label is a question', () => {
    const html = renderToString(
      <ArticleToc
        items={[
          { id: 'why', label: '왜 올인원을 볼까요?' },
          { id: 'what', label: '남성 올인원은 어떤 제품인가요?' },
        ]}
      />,
    );
    expect(html).toContain('이 글에서 다루는 질문');
    expect(html).toContain('href="#why"');
    expect(html).toContain('href="#what"');
    expect(html).toContain('왜 올인원을 볼까요?');
  });

  it('uses a neutral title when any label is not a question', () => {
    const html = renderToString(
      <ArticleToc
        items={[
          { id: 'one-line', label: '한 줄 답' },
          { id: 'faq', label: '자주 묻는 질문' },
        ]}
      />,
    );
    expect(html).toContain('이 글에서 다루는 내용');
    expect(html).not.toContain('이 글에서 다루는 질문');
  });

  it('honors an explicit toc title', () => {
    const html = renderToString(
      <ArticleToc items={[{ id: 'a', label: '한 줄 답' }]} title="이 글에서 다루는 질문" />,
    );
    expect(html).toContain('이 글에서 다루는 질문');
  });
});
