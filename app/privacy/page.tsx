import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleLayout, FactList } from '@/components/article/ArticleLayout';
import { CONTACT_EMAIL } from '@/lib/facts';
import { PRIVACY_EFFECTIVE_DATE, PRIVACY_OFFICER, PROCESSORS } from '@/lib/business';
import { launchNotifyReady } from '@/lib/launch-notify-config';
import { LAUNCH_NOTIFY_ENABLED_COPY } from '@/lib/launch-notify';
import { LetterStoryNotice } from '@/components/privacy/LetterStoryNotice';
import { ChallengeOneLineNotice } from '@/components/privacy/ChallengeOneLineNotice';

// 개인정보처리방침 (개인정보 보호법 제30조, 표준 개인정보 처리방침 작성지침 기준).
// Covers only what the site actually processes: the 출시 알림 신청 email. TODO values live in lib/business.ts
// and are omitted from the page until filled, so no invented business data is shown.

const URL = 'https://dearpapa.kr/privacy';
const TITLE = '개인정보처리방침 | 디어파파 DEAR PAPA';
const DESCRIPTION = '디어파파(DEAR PAPA) 공식 사이트의 개인정보 처리 안내. 편지 보관, 사이트 이용 정보와 문의 방법을 확인하세요.';

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: 'website',
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

const dotted = (iso: string) => iso.replaceAll('-', '. ') + '.';

function LetterShareNotice() {
  return <>
    <h3>이용자가 선택한 편지 공유</h3>
    <p>‘편지 공유하기’에서 카카오톡 전송이나 링크 복사를 선택하면 편지 내용·보내는 사람·날짜가 포함된 링크를 만들 수 있습니다. 이 링크는 암호화된 비밀 편지가 아니며 링크를 가진 누구나 내용을 읽을 수 있습니다. 링크를 공개하거나 전달할 때 주의해 주세요. 보관함에서 지워도 이미 전달한 링크는 회수되지 않습니다.</p>
    <p>편지 내용은 링크의 # 뒤에 담기며 이 사이트의 페이지 요청이나 서버 저장소로 보내지 않습니다. 받은 편지 화면에서는 방문 통계와 캠페인 기록 기능을 실행하지 않습니다. 카카오톡으로 보내기를 누르면 해당 링크와 보내는 사람 표기가 카카오에 전달되며 카카오의 개인정보 처리방침이 적용됩니다. 이미지 공유를 선택하면 이미지 안에 편지와 이름이 표시됩니다. 공유 대상과 공개 범위는 이용자가 직접 선택합니다.</p>
  </>;
}

function AiPrivacyNotice() {
  return <>
    <h3 id="ai-questions">AI Sodam 질문 기능</h3>
    <p>첫 화면의 손글씨를 입력하고 잠시 멈추면 브라우저 안에서 준비된 기본 답변을 표시합니다. 이 자동 반응은 입력 내용을 서버로 보내지 않습니다. Enter 또는 ‘답변 듣기’를 눌러 질문을 보내면 현재 문장과 최근 대화가 AI 답변을 위해 전송될 수 있습니다.</p>
    <p>
      AI 질문창은 위 편지 작성기와 별도 기능입니다. 이용자가 질문을 보내면 질문창의 현재 질문과 최근 대화 최대 3쌍을
      답변 생성 목적으로 Google Gemini에 전송합니다. 편지 작성기나 보관함에 저장한 내용은 읽거나 전송하지 않습니다.
      질문창에 이름, 연락처 등 개인정보나 민감한 내용은 입력하지 마세요. 이 기능을 쓰지 않아도 편지 작성과 저장은 이용할 수 있습니다.
    </p>
    <p>
      디어파파 애플리케이션은 AI 대화를 데이터베이스나 로그에 저장하지 않습니다. 대화는 현재 화면 메모리에만 남으며 새로고침하면 사라집니다.
      Google의 데이터 처리 방식은 Gemini API의 이용 조건에 따라 다릅니다. 무료 서비스에서는 입력과 응답이 제품 개선이나 검토에 사용될 수 있으며,
      유료 서비스에서는 제품 개선에 사용하지 않더라도 부정 이용 방지 등을 위해 일정 기간 기록할 수 있습니다.
      자세한 이용 조건과 데이터 처리 안내는 <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer">Google Gemini API 데이터 처리 안내</a>에서 확인할 수 있습니다.
      자동 대량 질문을 줄이기 위해 서버 인스턴스 메모리에 접속 IP별 최근 10분의 요청 횟수를 임시 확인하며, 만료 항목은 다음 요청 시 정리합니다.
    </p>
    <p>일부 위험 표현에는 AI 호출 없이 미리 작성된 도움 안내를 표시합니다. 외부 도움 사이트는 버튼을 눌렀을 때 새 탭에서 열리며 대화 내용을 전달하지 않습니다. 외부 사이트의 이용에는 해당 사이트의 개인정보 처리방침이 적용됩니다.</p>
  </>;
}

export default function PrivacyPage() {
  const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;
  if (!launchNotifyReady()) return (
    <ArticleLayout eyebrow="PRIVACY" title="개인정보 처리 안내" lead={<p>현재 출시 알림 신청을 위한 이메일을 수집하지 않습니다.</p>}>
      <h2>편지 작성과 보관</h2>
      <p>작성한 편지와 보내는 사람 표기는 이 기기의 브라우저에만 보관되며 서버로 전송하지 않습니다. 기기의 편지 도구에서 지우거나 브라우저 저장 데이터를 삭제할 수 있습니다.</p>
      <LetterShareNotice />
      <AiPrivacyNotice />
      <LetterStoryNotice />
      <ChallengeOneLineNotice />
      <h2>사이트 이용 정보</h2>
      <p>사이트 호스팅과 방문 통계에 Vercel을 사용합니다. 통계 이벤트에 편지 원문·보내는 사람 이름·이메일을 넣지 않습니다.</p>
      <p>승인된 홍보 링크로 방문하면 같은 탭의 세션 저장소에 정해진 캠페인 코드만 보관하여 이후 편지 작성·이미지 내보내기·제품 탐색 등의 활동을 유입 경로별로 구분합니다. 이 기능은 개인 식별자나 링크의 원문을 저장하지 않습니다.</p>
      <h2>출시 소식과 문의</h2>
      <p>출시 소식은 공식 사이트와 인스타그램에서 안내합니다. 이메일 신청 기능은 준비가 끝나고 수집 목적·항목·보유 기간·처리 담당 정보를 안내한 뒤 제공합니다.</p>
      <p>개인정보 관련 문의: {mail}</p>
      <p><Link href="/about/facts">공식 정보 확인하기</Link></p>
    </ArticleLayout>
  );
  return (
    <ArticleLayout
      eyebrow="PRIVACY"
      title="개인정보처리방침"
      lead={
        <p>
          디어파파(DEAR PAPA)는 공식 사이트 dearpapa.kr에서 출시 소식 안내를 위해 이메일 주소만 받습니다. 「개인정보 보호법」에 따라
          정보주체의 개인정보를 보호하고 관련 고충을 신속하게 처리할 수 있도록 다음과 같이 개인정보처리방침을 둡니다.
        </p>
      }
      meta={
        <p>
          {PRIVACY_EFFECTIVE_DATE ? (
            <>시행일: <time dateTime={PRIVACY_EFFECTIVE_DATE}>{dotted(PRIVACY_EFFECTIVE_DATE)}</time></>
          ) : (
            <>이 방침은 사이트에 게시한 날부터 시행합니다.</>
          )}
        </p>
      }
    >
      <section id="launch-email-summary" aria-labelledby="launch-email-summary-title">
        <h2 id="launch-email-summary-title">{LAUNCH_NOTIFY_ENABLED_COPY.privacySummaryTitle}</h2>
        <FactList rows={LAUNCH_NOTIFY_ENABLED_COPY.privacySummary.map(([k, v]) => [k, v] as const)} />
      </section>

      <h2 id="purpose">1. 개인정보의 처리 목적</h2>
      <p>
        출시 소식 안내: 디어파파 레터 올인원의 출시 소식을 이메일로 알려 드리기 위해 처리합니다. 이 목적 외의 용도(광고성 정보 발송,
        다른 상품 안내, 제3자 제공 등)로는 이용하지 않으며, 목적이 바뀌면 미리 별도의 동의를 받습니다.
      </p>

      <h2 id="items">2. 처리하는 개인정보 항목</h2>
      <FactList
        rows={[
          ['필수 항목', '이메일 주소'],
          ['함께 기록하는 정보', '동의 여부, 동의 일시, 동의 문구 버전, 신청한 화면(홈 또는 제품 소개 페이지)'],
          ['수집 방법', '사이트의 출시 소식 신청 칸에 정보주체가 직접 입력'],
          ['보관 방법', '신청 내용을 디어파파 업무용 메일함(hello@dearpapa.kr)으로 전달받아 보관'],
        ]}
      />
      <p>
        부정 이용(자동 대량 신청)을 막기 위해 최근 10분의 접속 IP별 요청 횟수를 서버 메모리에서 확인합니다. 만료 항목은 다음 요청 시 정리되며, 서버 인스턴스 종료 시 메모리도 사라집니다. 별도 데이터베이스나 애플리케이션 로그에 기록하지 않습니다.
        사이트 방문 통계는 쿠키를 쓰지 않는 Vercel Web Analytics로 개인을 알아볼 수 없는 집계 형태로만 확인하며, 입력한 이메일 주소는
        통계에 보내지 않습니다.
      </p>

      <h2 id="retention">3. 개인정보의 처리 및 보유 기간</h2>
      <p>
        출시 소식 안내를 마친 뒤, 또는 정보주체가 동의를 철회한 때에는 지체 없이 파기합니다. 출시가 취소되는 등 처리 목적이 없어진 경우에도
        지체 없이 파기합니다. 메일 전달을 맡은 Resend는 자체 보관 정책에 따라 발송 기록을 30일 동안 보관한 뒤 삭제합니다.
      </p>

      <h2 id="destruction">4. 개인정보의 파기 절차 및 방법</h2>
      <p>
        파기 사유가 생긴 개인정보는 지체 없이 파기합니다. 신청 메일은 메일함과 휴지통에서 모두 삭제하는 등 전자적 파일 형태의 정보는 복구할 수 없는 방법으로 삭제하며, 종이 문서로는
        보관하지 않습니다.
      </p>

      <h2 id="third-party">5. 개인정보의 제3자 제공</h2>
      <p>디어파파는 정보주체의 개인정보를 제3자에게 제공하지 않습니다.</p>

      <h2 id="processors">6. 개인정보 처리의 위탁</h2>
      <p>원활한 서비스 운영을 위해 다음과 같이 개인정보 처리 업무를 위탁합니다.</p>
      <FactList rows={PROCESSORS.map((p) => [p.name, p.task] as const)} />
      <p>위탁 계약 시 개인정보가 안전하게 관리되도록 필요한 사항을 정하고, 수탁자를 관리·감독합니다.</p>

      <h2 id="overseas">7. 개인정보의 국외 이전</h2>
      <p>
        위 6번의 수탁자는 모두 국외 사업자로, 신청 처리와 전달을 위해 다음과 같이 개인정보를 국외로 이전(처리 위탁·보관)합니다.
        공통 사항은 다음과 같습니다.
      </p>
      <FactList
        rows={[
          ['이전 항목', '이메일 주소, 동의 여부·일시, 신청한 화면'],
          ['이전 일시와 방법', '신청할 때 네트워크를 통해 전송 (사이트와의 통신은 HTTPS로 암호화)'],
        ]}
      />
      {PROCESSORS.map((p) => (
        <FactList
          key={p.name}
          rows={[
            ['이전받는 자', `${p.name} (${p.contact})`],
            ['이전 국가', p.country],
            ['이용 목적', p.task],
            ['보유·이용 기간', p.retention],
          ]}
        />
      ))}
      <p>국외 이전을 원하지 않으시면 출시 소식 신청을 하지 않으시면 됩니다. 이 경우 출시 소식 메일을 받으실 수 없습니다.</p>

      <h2 id="rights">8. 정보주체의 권리·의무 및 행사 방법</h2>
      <p>
        정보주체는 언제든지 개인정보 열람, 정정·삭제, 처리 정지, 동의 철회를 요구할 수 있습니다. 신청한 이메일 주소로 {mail}에
        요청해 주시면 지체 없이(10일 이내) 처리하고 결과를 알려 드립니다. 법정대리인이나 위임을 받은 사람을 통해서도 요구할 수 있습니다.
      </p>
      <p>만 14세 미만 아동의 신청은 받지 않습니다.</p>

      <h2 id="safety">9. 개인정보의 안전성 확보 조치</h2>
      <ul>
        <li>신청 정보는 암호화된 통신(HTTPS)으로만 전송합니다.</li>
        <li>신청 정보는 업무용 메일함에만 보관하고 공개 소스 저장소나 웹사이트 공개 파일에 저장하지 않으며, 접근 권한을 필요한 최소 인원으로 제한합니다.</li>
        <li>메일 발송 키는 발송 전용 권한으로 만들고, 소스 코드와 분리된 서버 환경 변수로만 관리합니다.</li>
        <li>신청한 분에게 자동 회신 메일을 보내지 않습니다.</li>
        <li>서버 기록(로그)에 이메일 주소를 남기지 않습니다.</li>
      </ul>

      <h2 id="cookies">10. 개인정보 자동 수집 장치의 설치·운영 및 거부</h2>
      <p>승인된 홍보 링크의 고정 캠페인 코드를 같은 탭의 세션 저장소에 보관하여 사이트 이용 통계를 유입 경로별로 구분합니다. 이 기능은 개인 식별자나 링크의 원문을 저장하지 않습니다.</p>
      <p>
        디어파파 사이트는 개인정보를 수집하는 쿠키를 쓰지 않습니다. 편지 쓰기 기능의 내용은 이용자 기기의 브라우저에만 보관되며
        서버로 전송하지 않습니다.
      </p>

      <LetterShareNotice />
      <AiPrivacyNotice />
      <LetterStoryNotice />
      <ChallengeOneLineNotice />

      <h2 id="officer">11. 개인정보 보호책임자</h2>
      <FactList
        rows={[
          ...(PRIVACY_OFFICER.name ? [['성명', PRIVACY_OFFICER.name] as const] : []),
          ...(PRIVACY_OFFICER.title ? [['직책', PRIVACY_OFFICER.title] as const] : []),
          ['연락처', mail],
        ]}
      />
      <p>개인정보 관련 문의, 불만 처리, 피해 구제는 위 연락처로 요청해 주세요.</p>

      <h2 id="remedy">12. 권익침해 구제 방법</h2>
      <p>개인정보 침해에 대한 신고나 상담이 필요하시면 아래 기관에 문의하실 수 있습니다.</p>
      <ul>
        <li>개인정보침해신고센터: privacy.kisa.or.kr / 국번 없이 118</li>
        <li>개인정보분쟁조정위원회: www.kopico.go.kr / 1833-6972</li>
        <li>대검찰청: www.spo.go.kr / 국번 없이 1301</li>
        <li>경찰청: ecrm.police.go.kr / 국번 없이 182</li>
      </ul>

      <h2 id="changes">13. 개인정보처리방침의 변경</h2>
      <p>
        이 방침의 내용이 바뀌면 시행 7일 전부터 이 페이지에 알립니다. 수집 항목이나 이용 목적처럼 중요한 내용이 바뀌면 30일 전부터 알립니다.
      </p>
      <p>
        <Link href="/about/facts">디어파파 공식 정보</Link>
      </p>
    </ArticleLayout>
  );
}
