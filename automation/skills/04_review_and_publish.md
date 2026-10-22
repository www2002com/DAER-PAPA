# Skill 04: 검수·승인·게시

## 자동 검수
`assemble`이 끝나면 자동 실행된다. 다시 돌릴 때: `npm run dp -- review <run>`
- 주장 상태표 대조(대사·청크·화면 문구·캡션) — reject면 승인 불가
- 해상도 1080x1920, 오디오 트랙, 길이 15~90초
- 최장 컷 2.2초 이하, 분당 컷 17개 이상
- 영상·02 파일 해시가 조립 시점과 같은지
- 결과: `outputs/<run>/review.json`

## Claude가 할 일
1. review.json의 technical 항목을 확인하고, 고칠 수 있는 것은 02/03 단계로 돌아가 고친다.
2. final.mp4에서 컷마다 프레임을 뽑아 직접 본다:
   ```bash
   ffmpeg -i outputs/<run>/03_assembled_project/render/final.mp4 -vf "fps=1,scale=270:-1,tile=6x10" contact.png
   ```
   - 왜곡, 시안 라벨 표시, 자막이 화면 요소를 가리는지, 엔드카드 문구
3. 사용자에게 영상 경로, 길이·컷 통계, 검수 결과, 사람 확인 항목을 보낸다. 영상은 사용자가 직접 본다.

## 사람 승인 (Claude는 실행하지 않는다)
```bash
npm run dp -- approve sample <run>    # 영상을 본 뒤 샘플 컨펌
npm run dp -- approve publish <run>   # 게시 승인
```
- 승인은 영상 SHA-256에 묶인다. 승인 후 다시 조립하면 승인이 무효가 된다.

## 게시 (오가닉)
```bash
npm run dp -- publish <run>
```
- 샘플 컨펌과 게시 승인이 모두 있어야 한다. 인스타그램 @dearpapa.kr 릴스로만 올린다(광고비 없음).
- 캡션은 게시 직전에 주장 상태표로 다시 검사한다.
- 결과: `outputs/<run>/published.json`

## 하지 않는 것
- 광고 계정 업로드, 캠페인·광고 세트 생성·활성화, 예산 설정 — 05 스킬 잠금 해제 전까지 금지.
