import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleLayout, FactList } from '@/components/article/ArticleLayout';

const title = 'DEAR PAPA Marketing';
const description = '디어파파 운영자가 Google Search Console 검색 성과를 확인하고 콘텐츠 초안과 검수 보고서를 만드는 업무용 도구입니다.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/marketing' },
  robots: { index: false, follow: true },
  openGraph: { title, description, url: '/marketing', type: 'website' },
};

export default function MarketingPage() {
  return (
    <ArticleLayout
      eyebrow="DEAR PAPA MARKETING"
      title="검색 데이터를 바탕으로, 더 필요한 글을 씁니다."
      lead={<p>DEAR PAPA Marketing은 디어파파 운영자를 위한 검색 성과 분석·콘텐츠 작성 보조 도구입니다.</p>}
    >
      <h2>어떤 일을 하나요?</h2>
      <p>운영자가 Google 계정으로 승인한 뒤, Google Search Console에서 dearpapa.kr의 검색어·페이지별 노출수, 클릭수, 클릭률과 평균 검색 순위를 읽습니다. 이 자료를 바탕으로 아빠의 피부 관리와 선물에 관한 정보성 글의 기회를 찾습니다.</p>
      <FactList rows={[
        ['검색 성과 확인', '최근 확정된 28일 자료를 읽어 독자에게 필요한 주제를 찾습니다.'],
        ['초안 작성', 'Claude가 검색 자료와 브랜드 정보를 참고해 하루 최대 한 주제의 초안을 작성합니다.'],
        ['검수와 보고', 'Codex가 근거·제품 사실·중복 여부를 검수합니다. 조건에 맞는 주제가 없으면 글을 만들지 않고 사유를 보고합니다.'],
      ]} />
      <h2>누가 사용하나요?</h2>
      <p>디어파파 운영자가 자신의 사이트를 관리하기 위한 도구입니다. 일반 방문자의 Google 계정 연결이나 회원가입을 받지 않습니다. 이 페이지는 앱과 데이터 이용 방식을 설명하는 공개 안내이며, 실제 업무 도구는 운영자의 컴퓨터에서 실행됩니다.</p>
      <h2>Google 연결 권한</h2>
      <p>Search Console 읽기 전용 권한을 요청합니다. 접근 가능한 사이트 목록을 확인하고 dearpapa.kr의 검색 성과와 색인 상태를 조회합니다. 이 권한으로 Search Console 설정을 수정하거나 사이트맵을 제출하지 않습니다. Gmail이나 Google Drive의 내용을 읽는 권한은 요청하지 않습니다.</p>
      <h2>데이터 이용 안내</h2>
      <p>검색 자료는 초안 작성과 검수를 위해 Anthropic의 Claude 및 OpenAI의 Codex에 전달될 수 있습니다. 보고서는 운영자의 컴퓨터에 저장되며, OneDrive 설정에 따라 동기화될 수 있습니다. Google 로그인 토큰은 보고서와 별도로 보관합니다.</p>
      <p><Link href="/marketing/privacy">DEAR PAPA Marketing 개인정보처리방침 읽기</Link></p>
      <p>앱 이용·Google 연결·데이터 삭제 문의: <a href="mailto:www2002com82@gmail.com">www2002com82@gmail.com</a></p>
      <p><Link href="/">디어파파 공식 사이트</Link></p>
    </ArticleLayout>
  );
}
