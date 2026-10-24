// Footer business information (사업자 정보). Only verified facts are filled in.
// null = TODO for 대표님 to fill; null fields are NOT rendered, so no placeholder or invented value
// ever appears on the page. Do not guess these values.
import { BRAND, CONTACT_EMAIL } from './facts';

export const BUSINESS = {
  brand: `${BRAND.nameKo} / ${BRAND.name}`,
  email: CONTACT_EMAIL,
  /** TODO(대표님): 상호(법인명 또는 개인사업자 상호) */
  companyName: null as string | null,
  /** TODO(대표님): 대표자 성명 */
  representative: null as string | null,
  /** TODO(대표님): 사업자등록번호 */
  registrationNumber: null as string | null,
  /** TODO(대표님): 사업장 주소 */
  address: null as string | null,
  /** TODO(대표님): 통신판매업 신고번호 (판매 시작 전 신고 필요) */
  mailOrderNumber: null as string | null,
};

/** 개인정보 보호책임자. TODO(대표님): 성명·직책. Until filled, the page shows only the contact email. */
export const PRIVACY_OFFICER = {
  name: null as string | null,
  title: null as string | null,
  email: CONTACT_EMAIL,
};

export function businessLines(): { label: string; value: string }[] {
  const rows: [string, string | null][] = [
    ['브랜드', BUSINESS.brand],
    ['상호', BUSINESS.companyName],
    ['대표자', BUSINESS.representative],
    ['사업자등록번호', BUSINESS.registrationNumber],
    ['통신판매업 신고번호', BUSINESS.mailOrderNumber],
    ['주소', BUSINESS.address],
    ['이메일', BUSINESS.email],
  ];
  return rows.filter((r): r is [string, string] => typeof r[1] === 'string' && r[1].trim() !== '').map(([label, value]) => ({ label, value }));
}

/**
 * 개인정보 처리 위탁·국외 이전 대상 (개인정보처리방침 6·7항).
 * 신청 흐름: 사이트 신청 칸 → Vercel Function(api/launch-notify) → Resend API → hello@dearpapa.kr 메일함(Google Workspace).
 * 실제로 쓰는 서비스만 적는다. 서비스를 바꾸면 이 목록과 방침 시행일을 함께 고친다.
 */
export const PROCESSORS = [
  {
    name: 'Vercel Inc.',
    task: '웹사이트 호스팅 및 출시 소식 신청을 처리하는 서버 운영',
    country: '미국',
    contact: 'privacy@vercel.com',
    retention: '신청을 받은 즉시 메일로 전달하며, 신청 내용을 따로 보관하지 않음',
  },
  {
    name: 'Resend, Inc.',
    task: '신청 내용을 디어파파 메일함(hello@dearpapa.kr)으로 전달하는 메일 발송',
    country: '미국',
    contact: 'support@resend.com',
    retention: '전달 처리 후 Resend 보관 정책에 따라 발송 기록(메일 내용 포함)을 30일 동안 보관한 뒤 삭제',
  },
  {
    name: 'Google LLC',
    task: '신청 메일을 받는 업무용 메일함(Google Workspace) 운영',
    country: '미국 등 Google 데이터센터가 있는 국가',
    contact: 'policies.google.com/privacy',
    retention: '3번의 보유 기간과 같음',
  },
] as const;

/** 개인정보처리방침 시행일 (YYYY-MM-DD). TODO(대표님): 사이트에 게시(머지)하는 날짜로 채운다. */
export const PRIVACY_EFFECTIVE_DATE = null as string | null;
