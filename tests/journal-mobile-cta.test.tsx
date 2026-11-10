import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ArticleLayout } from '@/components/article/ArticleLayout';

const LABEL = '레터 올인원 알아보기';
const root = path.resolve(__dirname, '..');
const journalDir = path.join(root, 'app/journal');
const postSlugs = readdirSync(journalDir).filter((name) => statSync(path.join(journalDir, name)).isDirectory());

describe('journal post mobile sticky CTA', () => {
  it('renders a real link to /letter-all-in-one on journal posts', () => {
    render(
      <ArticleLayout crumbs={[{ href: '/journal', label: '브랜드 자료실' }]} title="글">
        <p>본문</p>
      </ArticleLayout>,
    );
    const link = screen.getByRole('link', { name: LABEL });
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/letter-all-in-one');
    expect(link.getAttribute('aria-label')).toBe(LABEL);
    expect(link.textContent).toBe(LABEL);
  });

  it('is absent from ArticleLayout pages without a journal breadcrumb', () => {
    render(
      <ArticleLayout title="브랜드 자료실">
        <p>목록</p>
      </ArticleLayout>,
    );
    expect(screen.queryByRole('link', { name: LABEL })).toBeNull();
  });

  it('every journal post passes a /journal breadcrumb; the index and /letter-all-in-one pass none', () => {
    expect(postSlugs.length).toBeGreaterThan(0);
    for (const slug of postSlugs) {
      const src = readFileSync(path.join(journalDir, slug, 'page.tsx'), 'utf8');
      expect(src, slug).toMatch(/crumbs=\{\[\{ href: '\/journal/);
    }
    for (const file of ['app/journal/page.tsx', 'app/letter-all-in-one/page.tsx', 'app/page.tsx']) {
      expect(readFileSync(path.join(root, file), 'utf8'), file).not.toMatch(/crumbs=/);
    }
  });
});
