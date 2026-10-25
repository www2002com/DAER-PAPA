// Authored first responses, safe to run in the browser. No API, storage or secrets.
export const SAFETY_ANSWERS = {
  urgent: '지금 많이 힘들거나 위험한 상황일 수 있겠어요. 지금 자신이나 다른 사람을 해칠 위험이 있다면, 안전한 곳으로 이동하고 가까운 믿을 만한 사람이나 현지 긴급 구조 서비스에 바로 도움을 요청해 주세요. 가능하면 혼자 있지 말고 위험한 물건과 거리를 두세요. 지금 안전한 곳에 계신가요?',
  referral: '이 이야기를 꺼내기까지 쉽지 않았을 것 같아요. 억지로 화해하거나 혼자 해결하려 애쓰지 않아도 괜찮아요. 믿을 만한 사람이나 전문 상담기관과 함께 다음 방법을 찾아보면 좋겠어요. 당장 위험하다면 안전한 곳에서 현지 긴급 구조 서비스에 도움을 요청해 주세요.',
};

// Conservative phrase checks, not a clinical assessment. The configured AI also
// evaluates context. Sharing these avoids different browser/server safety rules.
export function obviousBunnyConcern(text: string): 'urgent' | 'referral' | null {
  if (/죽고\s*싶|살기\s*싫|살고\s*싶지|목숨|자살|자해|해치고\s*싶|죽이겠|죽여\s*버|kill\s+(myself|him)|suicid|self[- ]harm/i.test(text)) return 'urgent';
  if (/가정\s*폭력|학대|성폭|성추행|맞고\s*있|때려|때리|폭행|협박|전문\s*상담|상담\s*(센터|기관)|일상.{0,10}(불가능|못\s*하)/i.test(text)) return 'referral';
  return null;
}

export function preparedBunnyReply(content: string, supportOnly = false) {
  const text = content.trim();
  const concern = obviousBunnyConcern(text);
  if (concern) return { mode: concern, source: 'guidance' as const, answer: SAFETY_ANSWERS[concern] };
  const reply = (answer: string, mode = 'support') => ({ mode, source: 'prepared' as const, answer });
  if (supportOnly) return reply('편한 만큼만 이야기해 주세요. 지금 혼자 감당하기 어려운 일은 믿을 만한 사람과 함께 살펴봐도 괜찮아요. 지금 가장 필요한 것은 누군가 들어주는 일인가요, 안전하게 도움을 받을 곳을 찾는 일인가요?');
  if (/코딩|코드|파이썬|프로그래밍|주식|코인|날씨|맛집|여행\s*추천/i.test(text)) return reply('저는 아빠와의 관계 고민과 아빠에게 전할 말을 함께 정리하는 토끼예요. 아빠와 이야기하면서 요즘 가장 마음에 걸리는 일이 있나요?', 'off_topic');
  if (/돌아가|사별|장례|하늘나라/.test(text)) return reply('아빠를 떠올리며 꺼낸 말이군요. 마음을 서둘러 정리하거나 괜찮은 척하지 않아도 돼요. 괜찮다면 오늘 특히 떠오른 아빠의 모습을 하나만 들려주실래요?');
  if (/서운|속상|상처|섭섭|실망/.test(text)) return reply('아빠에게 서운한 마음이 있었군요. 그 마음을 바로 접어 두지 않아도 괜찮아요. 대화가 안전하고 편한 때라면 “그때 나는 이런 마음이었어”로 시작해 볼 수 있어요. 어떤 순간이 가장 마음에 남았나요?');
  if (/싸웠|싸우|다퉜|다투|화가|화나|갈등|짜증/.test(text)) return reply('아빠와 부딪히는 일이 마음에 걸리나 봐요. 바로 결론을 내기보다 잠시 쉬고, 내가 전하고 싶은 말 하나를 골라봐도 좋아요. 이번 대화에서 아빠가 알아줬으면 하는 건 무엇인가요?');
  if (/미안|사과|후회/.test(text)) return reply('미안한 마음을 말로 꺼내고 싶으시군요. “내가 한 말 때문에 마음이 쓰여. 미안해”처럼 내 행동부터 짧게 이야기해 볼 수 있어요. 다만 모든 책임을 혼자 떠안을 필요는 없어요. 어떤 일이 마음에 남았나요?', 'letter');
  if (/보고\s*싶|그립|그리워|멀리|연락/.test(text)) return reply('아빠와의 거리나 그리움이 마음에 남아 있나 봐요. 연락하고 싶은 마음이 있고 편한 관계라면 “오늘 아빠 생각났어” 한마디로 시작해도 좋아요. 지금은 안부를 건네고 싶은가요, 그리운 마음을 이야기하고 싶은가요?');
  if (/고마|감사|사랑|행복|건강/.test(text)) return reply('아빠를 생각하는 마음이 느껴져요. 멋진 말로 고치지 않아도 지금 적은 한 줄이면 시작할 수 있어요. 그 마음이 들었던 순간이나 바라는 점을 하나만 더 붙이면 더 내 말 같아져요. 어떤 마음을 가장 전하고 싶나요?', 'letter');
  if (/어색|말이\s*안|대화|어긋|말을\s*못|말하기/.test(text)) return reply('아빠와 말을 나누는 게 생각처럼 쉽지 않으신가 봐요. 긴 대화보다 “내 얘기 잠깐 들어줄 수 있어?”처럼 시간을 먼저 물어봐도 좋아요. 아빠가 들어줬으면 하는 말은 무엇인가요?');
  if (/선물|생신|생일/.test(text)) return reply('아빠에게 마음을 전할 방법을 찾고 계시군요. 선물부터 정하지 않고, 전하고 싶은 한 줄을 먼저 골라도 좋아요. 고마움과 축하 중 어느 마음을 더 담고 싶나요?', 'gift');
  if (/편지|한\s*줄|뭐라고|문장/.test(text)) return reply('한 줄이면 충분해요. “아빠, 오늘은 이 말이 하고 싶었어” 다음에 가장 하고 싶은 말을 붙여보세요. 고마움인지, 서운함인지, 그리움인지부터 골라도 괜찮아요.', 'letter');
  if (/^(응|네|예|좋아|그래|모르겠어|몰라|어떻게)[.!?\s]*$/.test(text)) return reply('그럼 한 가지만 천천히 골라볼까요? 아빠에게 듣고 싶은 말과 내가 꼭 전하고 싶은 말 중, 지금 어느 쪽이 더 마음에 걸리나요?');
  return reply('한 줄 꺼내 주셨네요. 잘 정리된 말이 아니어도 괜찮아요. 이 말 속에서 아빠가 꼭 알아줬으면 하는 마음은 무엇인가요? 고마움도, 서운함도 편한 만큼 이야기해 주세요.');
}
