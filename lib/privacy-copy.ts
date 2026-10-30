import { RETENTION } from './privacy-retention';

/**
 * /privacy 「아빠가 간직한 편지」 사연 모집 절. Hidden until 대표님 confirms the retention values
 * (lib/privacy-retention.ts). Flip to true in the same change that confirms them.
 */
export const LETTER_STORY_PRIVACY_ENABLED = false;

export const LETTER_STORY_PRIVACY = {
  title: '「아빠가 간직한 편지」 사연 모집(#아빠에게한줄편지)',
  intro: '디어파파 인스타그램 @dearpapa.kr의 DM이나 hello@dearpapa.kr 메일로 아빠가 간직한 편지와 사연을 보내 주실 수 있습니다.',
  rows: [
    ['받는 곳', '보내는 분이 인스타그램 @dearpapa.kr DM 또는 이메일 hello@dearpapa.kr로 직접 보냅니다.'],
    ['수집 항목(필수)', '편지 사진, 한 줄 사연, 회신용 인스타그램 계정 이름 또는 이메일 주소'],
    ['수집 항목(선택)', '소개할 때 쓸 표시 이름(닉네임·이니셜)'],
    ['이용 목적', '사연 확인과 회신, 소개 동의 확인, 동의한 편지의 디어파파 공식 인스타그램 카드뉴스 소개(가림 처리 후)'],
    ['가림 처리', '편지 사진에 아이의 이름이나 학교가 보이면 소개하기 전에 가립니다. 얼굴·주소·연락처도 가린 뒤 동의받은 편지만 소개합니다.'],
    ['만 14세 미만', '만 14세 미만은 보호자(아빠)가 대신 보내 주세요.'],
    ['보관 기간', `${RETENTION.unusedStory}. ${RETENTION.publishedStory}. ${RETENTION.consentRecord}.`],
    ['철회·삭제 요청', 'hello@dearpapa.kr로 말씀해 주시면 7일 안에 게시물을 내리고 원본을 파기합니다.'],
    ['공개 범위', '디어파파 공식 인스타그램(@dearpapa.kr) 카드뉴스. 다른 채널에 쓰려면 다시 동의를 받습니다.'],
    ['받는 경로', 'DM은 인스타그램(Meta), 이메일은 업무용 메일함(hello@dearpapa.kr, Google Workspace)에서 받습니다.'],
    ['동의 거부', '사연을 보내지 않거나 소개에 동의하지 않아도 사이트 이용에 제한이 없습니다.'],
  ],
} as const;

/**
 * /privacy 「한 줄 챌린지」 절. SNS challenge-one-line-v2 표 (3) 그대로.
 * 보관 기간·모집 기간은 대표님 10/30 08:14 KST 확정.
 */
export const CHALLENGE_ONE_LINE_PRIVACY_ENABLED = true;

export const CHALLENGE_ONE_LINE_PRIVACY = {
  title: '「한 줄 챌린지」(#아빠에게한줄편지)',
  intro:
    '디어파파 인스타그램 스토리 태그, DM, 또는 hello@dearpapa.kr로 「아빠에게 한 줄」 챌린지에 참여해 주실 수 있습니다. 모집 게시는 이 항목이 라이브된 뒤에만 합니다.',
  rows: [
    ['수집 방법', '스토리 태그, DM, 또는 hello@dearpapa.kr'],
    ['필수', '가림 처리된 카톡 화면 캡처, 회신용 계정/이메일'],
    ['선택', '소개용 닉네임·이니셜'],
    ['목적', '참여 확인·회신·동의한 경우 공식 인스타 소개'],
    ['대가', '없음'],
    ['철회', 'hello@dearpapa.kr, 7일 안'],
    ['보관 기간', '챌린지 종료 후 30일, 이후 파기'],
    ['모집 기간', '2주'],
  ],
} as const;
