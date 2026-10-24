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
 * 출시 알림 신청 정보를 보관하는 서비스(수탁사). TODO(대표님): 저장소를 정하면 채운다.
 * null 이면 개인정보처리방침에 "정해지면 시행 전에 추가 고지" 문장만 보인다.
 * 예: { name: 'Upstash, Inc.', task: '출시 소식 신청 정보(이메일) 보관', country: '미국 또는 선택한 리전', contact: '...' }
 */
export const STORAGE_PROCESSOR = null as null | { name: string; task: string; country: string; contact: string };

/** 개인정보처리방침 시행일 (YYYY-MM-DD). TODO(대표님): 사이트에 게시(머지)하는 날짜로 채운다. */
export const PRIVACY_EFFECTIVE_DATE = null as string | null;
