import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleLayout, FactList } from '@/components/article/ArticleLayout';

const title = 'DEAR PAPA Marketing 개인정보처리방침';
const description = 'DEAR PAPA Marketing의 Google Search Console 데이터 접근·이용·보관·전달 및 연결 해제 안내입니다.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/marketing/privacy' },
  robots: { index: false, follow: true },
  openGraph: { title, description, url: '/marketing/privacy', type: 'website' },
};

export default function MarketingPrivacyPage() {
  return (
    <ArticleLayout
      eyebrow="PRIVACY"
      title="DEAR PAPA Marketing 개인정보처리방침"
      lead={<p>운영자의 Google Search Console 자료를 사용하는 마케팅 업무 도구에 적용되는 안내입니다. 일반 방문자의 편지 기능에 관한 안내는 <Link href="/privacy">사이트 개인정보처리방침</Link>에서 확인할 수 있습니다.</p>}
      meta={<p>시행일: <time dateTime="2026-11-01">2026년 11월 1일</time></p>}
    >
      <h2>1. 운영 주체와 이용 대상</h2>
      <p>디어파파 운영자는 자신의 사이트 검색 성과를 분석하고 콘텐츠를 개선하기 위해 DEAR PAPA Marketing을 사용합니다. 일반 방문자를 대상으로 Google 계정 연결을 제공하지 않습니다.</p>
      <p>담당 연락처: <a href="mailto:www2002com82@gmail.com">www2002com82@gmail.com</a></p>
      <h2>2. 접근하는 Google 데이터</h2>
      <p>운영자가 Google OAuth 동의 화면에서 승인한 Search Console 읽기 전용 권한(webmasters.readonly)을 사용합니다. Google 계정 비밀번호를 앱에 입력하거나 저장하지 않습니다.</p>
      <FactList rows={[
        ['연결 정보', '접근 가능한 Search Console 사이트 주소와 권한 수준, API 조회에 필요한 OAuth 액세스·갱신 토큰'],
        ['검색 성과', 'dearpapa.kr의 검색어, 페이지 주소, 날짜, 노출수, 클릭수, 클릭률, 평균 검색 순위 및 조회 조건에 따른 국가·기기 등의 집계 정보'],
        ['사이트 점검', 'dearpapa.kr의 사이트맵 현황과 URL 색인 검사 결과'],
      ]} />
      <p>개별 검색 이용자의 Google 계정이나 검색 이력을 받지 않습니다. 다만 검색어에는 사람이 입력한 이름 등의 문자열이 포함될 수 있습니다. 일반 방문자의 편지·질문 내용, Gmail, Google Drive 파일은 이 도구의 수집 대상이 아닙니다.</p>
      <h2>3. 이용 목적</h2>
      <p>검색 노출과 클릭 성과를 비교하고, 글 주제를 선정하며, 초안 작성·검수·발행 후 성과 측정에 이용합니다. 개인별 광고 타기팅이나 Google 데이터 판매 목적으로 사용하지 않습니다. OAuth 토큰은 승인된 API 조회와 인증 갱신에만 사용합니다.</p>
      <h2>4. AI 서비스 및 저장 서비스로 전달되는 정보</h2>
      <p>Claude Code가 조회한 검색 자료와 브랜드 정보를 Anthropic의 Claude에 보내 분석과 초안을 생성합니다. 검수 과정에서는 검색 자료·초안·보고서가 OpenAI의 Codex에 전달될 수 있습니다. 이 서비스에서 해외 서버로 전송·처리될 수 있으며, 각 서비스의 계정 설정과 데이터 보관 정책이 적용됩니다.</p>
      <p>로컬 보고서 폴더는 OneDrive 동기화 대상 경로에 있어, 동기화가 켜져 있으면 보고서와 조회 근거가 Microsoft OneDrive에도 저장될 수 있습니다. Google OAuth 자격 증명과 토큰은 해당 동기화 폴더 밖에 별도로 보관하며, AI에 전달할 원고나 공개 사이트에 포함하지 않습니다.</p>
      <p>검수된 정보성 글은 사이트 등에 공개될 수 있지만, Search Console 원시 조회 자료와 인증 정보는 공개 게시 대상이 아닙니다.</p>
      <ul>
        <li><a href="https://www.anthropic.com/legal/privacy">Anthropic 개인정보처리방침</a></li>
        <li><a href="https://openai.com/policies/privacy-policy/">OpenAI 개인정보처리방침</a></li>
        <li><a href="https://privacy.microsoft.com/privacystatement">Microsoft 개인정보처리방침</a></li>
      </ul>
      <h2>5. 보관과 삭제</h2>
      <p>조회 근거·초안·검수 보고서는 운영자의 컴퓨터에 날짜별 파일로 저장합니다. 현재 자동 삭제 주기는 설정되어 있지 않으며 운영자가 삭제할 때까지 남습니다. OneDrive 동기화 사본과 휴지통, 각 AI 서비스의 대화·실행 기록은 해당 서비스에서도 별도로 관리해야 합니다. 로컬 파일을 지우는 것만으로 외부 서비스의 모든 사본이 즉시 삭제되는 것은 아닙니다.</p>
      <p>이용을 종료할 때에는 예약 실행을 중지하고 Google 연결을 해제한 뒤, 보관할 필요가 없는 로컬 토큰과 보고서를 삭제합니다. 외부 서비스 기록의 삭제는 각 서비스에서 제공하는 계정 설정이나 삭제 요청 절차를 이용합니다.</p>
      <h2>6. 연결 해제와 문의</h2>
      <p><a href="https://myaccount.google.com/connections">Google 계정의 서드 파티 연결 관리</a>에서 DEAR PAPA Marketing의 접근 권한을 해제할 수 있습니다. 이후 Google 자료를 새로 조회하려면 다시 승인해야 합니다. 권한 해제만으로 이미 만든 보고서가 삭제되지는 않습니다.</p>
      <p>열람·정정·삭제·이용 중지 요청은 <a href="mailto:www2002com82@gmail.com">www2002com82@gmail.com</a>으로 보내 주세요. 인증 코드, 비밀번호, OAuth 토큰은 문의 내용에 포함하지 마세요.</p>
      <h2>7. 공개 안내 페이지와 변경 사항</h2>
      <p>이 공개 안내 페이지의 호스팅과 방문 통계에는 사이트의 Vercel 서비스를 사용합니다. 관련 설명은 <Link href="/privacy">사이트 개인정보처리방침</Link>에 있습니다. 마케팅 앱의 권한이나 데이터 이용 방식이 바뀌면 이 페이지의 안내와 시행일을 갱신합니다.</p>
      <p><Link href="/marketing">DEAR PAPA Marketing 앱 소개로 돌아가기</Link></p>
    </ArticleLayout>
  );
}
