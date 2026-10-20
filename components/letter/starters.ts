// Opening lines grouped by occasion. Tapping one writes it into the letter.
export const STARTERS = [
  {
    id: 'thanks',
    label: '고마운 마음',
    lines: [
      '아빠, 늘 고마워요.',
      '말로 다 못 했지만, 언제나 고마워요.',
      '아빠 덕분에 여기까지 왔어요.',
      '묵묵히 지켜 줘서 고마워요.',
    ],
  },
  {
    id: 'daily',
    label: '일상의 안부',
    lines: [
      '아빠, 오늘 하루는 어땠어요?',
      '오늘도 수고 많았어요, 아빠.',
      '요즘 잠은 잘 자요?',
      '밥 잘 챙겨 먹어요. 아빠 건강이 제일이에요.',
    ],
  },
  {
    id: 'special',
    label: '특별한 날',
    lines: [
      '아빠, 오늘은 특별한 날이에요.',
      '생신 축하해요. 오래오래 건강해요.',
      '사랑한다는 말, 오늘은 꼭 하고 싶었어요.',
      '아빠가 우리 아빠라서 참 좋아요.',
    ],
  },
] as const;
