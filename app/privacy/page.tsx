import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleLayout, FactList } from '@/components/article/ArticleLayout';
import { CONTACT_EMAIL } from '@/lib/facts';
import { PRIVACY_EFFECTIVE_DATE, PRIVACY_OFFICER, STORAGE_PROCESSOR } from '@/lib/business';

// 개인정보처리방침 (개인정보 보호법 제30조, 표준 개인정보 처리방침 작성지침 기준).
// Covers only what the site actually processes: the 출시 알림 신청 email. TODO values live in lib/business.ts
// and are omitted from the page until filled, so no invented business data is shown.

const URL = 'https://dearpapa.kr/privacy';
const TITLE = '개인정보처리방침 | 디어파파 DEAR PAPA';
const DESCRIPTION = '디어파파(DEAR PAPA) 공식 사이트 dearpapa.kr의 개인정보처리방침. 출시 소식 안내를 위해 이메일만 받으며, 출시 안내 후 또는 동의 철회 시 지체 없이 파기합니다.';

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

export default function PrivacyPage() {
  const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;
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
        ]}
      />
      <p>
        부정 이용(자동 대량 신청)을 막기 위해 신청 시 접속 IP 주소를 서버 메모리에서 최대 10분 동안만 쓰며, 저장하거나 기록하지 않습니다.
        사이트 방문 통계는 쿠키를 쓰지 않는 Vercel Web Analytics로 개인을 알아볼 수 없는 집계 형태로만 확인하며, 입력한 이메일 주소는
        통계에 보내지 않습니다.
      </p>

      <h2 id="retention">3. 개인정보의 처리 및 보유 기간</h2>
      <p>
        출시 소식 안내를 마친 뒤, 또는 정보주체가 동의를 철회한 때에는 지체 없이 파기합니다. 출시가 취소되는 등 처리 목적이 없어진 경우에도
        지체 없이 파기합니다.
      </p>

      <h2 id="destruction">4. 개인정보의 파기 절차 및 방법</h2>
      <p>
        파기 사유가 생긴 개인정보는 지체 없이 파기합니다. 전자적 파일 형태의 정보는 복구할 수 없는 방법으로 삭제하며, 종이 문서로는
        보관하지 않습니다.
      </p>

      <h2 id="third-party">5. 개인정보의 제3자 제공</h2>
      <p>디어파파는 정보주체의 개인정보를 제3자에게 제공하지 않습니다.</p>

      <h2 id="processors">6. 개인정보 처리의 위탁</h2>
      <p>원활한 서비스 운영을 위해 다음과 같이 개인정보 처리 업무를 위탁합니다.</p>
      <FactList
        rows={[
          ['Vercel Inc.', '웹사이트 호스팅 및 출시 소식 신청을 처리하는 서버 운영'],
          ...(STORAGE_PROCESSOR ? [[STORAGE_PROCESSOR.name, STORAGE_PROCESSOR.task] as const] : []),
        ]}
      />
      {!STORAGE_PROCESSOR && (
        <p>신청 정보를 보관하는 서비스가 정해지면, 신청을 받기 전에 이 항목에 추가하여 알려 드립니다.</p>
      )}
      <p>위탁 계약 시 개인정보가 안전하게 관리되도록 필요한 사항을 정하고, 수탁자를 관리·감독합니다.</p>

      <h2 id="overseas">7. 개인정보의 국외 이전</h2>
      <p>웹사이트 호스팅과 신청 처리를 위해 다음과 같이 개인정보를 국외로 이전(처리 위탁·보관)합니다.</p>
      <FactList
        rows={[
          ['이전받는 자', 'Vercel Inc. (privacy@vercel.com)'],
          ['이전 국가', '미국'],
          ['이전 항목', '이메일 주소 및 2번의 함께 기록하는 정보'],
          ['이전 일시와 방법', '신청할 때 암호화된 통신(HTTPS)으로 전송'],
          ['이용 목적', '웹사이트 호스팅 및 출시 소식 신청 처리'],
          ['보유·이용 기간', '3번의 보유 기간과 같음'],
          ...(STORAGE_PROCESSOR
            ? [[`${STORAGE_PROCESSOR.name}`, `${STORAGE_PROCESSOR.country} · ${STORAGE_PROCESSOR.contact}`] as const]
            : []),
        ]}
      />
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
        <li>신청 정보를 공개 소스 저장소나 웹사이트 공개 파일에 저장하지 않으며, 접근 권한을 필요한 최소 인원으로 제한합니다.</li>
        <li>저장소 접근 키는 소스 코드와 분리된 서버 환경 변수로 관리합니다.</li>
        <li>서버 기록(로그)에 이메일 주소를 남기지 않습니다.</li>
      </ul>

      <h2 id="cookies">10. 개인정보 자동 수집 장치의 설치·운영 및 거부</h2>
      <p>
        디어파파 사이트는 개인정보를 수집하는 쿠키를 쓰지 않습니다. 편지 쓰기 기능의 내용은 이용자 기기의 브라우저에만 보관되며
        서버로 전송하지 않습니다.
      </p>

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
