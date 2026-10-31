# Skill 03: 소스 생성(이미지·영상·TTS)과 프로젝트 조립

## 전제
- `npm run dp -- approve plan <run>`으로 승인된 02 파일. 승인 뒤 파일이 바뀌면 도구가 생성을 거절한다.
- 이 단계부터 API 비용이 든다. 목업 실행(`init --mock`)은 승인 없이 전체 흐름을 확인할 수 있다.

## 출력 구조
```
outputs/<run>/03_assembled_project/
  assets/images/scene_NN.png        GPT 이미지 (청크 전용 프롬프트가 있으면 scene_NN_cK.png)
  assets/videos/scene_NN.mp4        Veo/Omni 이미지→영상
  assets/audio/narration.mp3        전체 내레이션 (ElevenLabs)
  assets/audio/chunk_NNN.mp3        청크별 음성
  assets/audio/tts.json             청크별 시작·길이
  project/timeline.json             컷 목록(소스, 인·아웃, 속도, 구도, 자막)
  project/captions.srt, .ass        자막
  render/final.mp4                  1080x1920 최종 렌더
```

## 절차
### 1. 장면 이미지
```bash
npm run dp -- images <run>
```
- 생성 후 **Claude가 모든 이미지를 직접 열어 본다.** 확인 항목:
  - 손가락 수·관절, 얼굴 비대칭, 글자·로고가 생겼는지, 인물 나이·국적이 프롬프트와 맞는지, 제품 용기가 그려졌는지
- 왜곡된 장면은 1회만 재생성한다: `npm run dp -- images <run> --redo 3,8`
- 재생성 후에도 왜곡이면 도구가 `outputs/manual-queue.jsonl`로 넘긴다. 사용자에게 장면 번호와 문제를 알리고, 해당 장면을 정지 이미지 대체 또는 프롬프트 수정(→ 02 재승인) 중 고르게 한다.

### 2. 이미지→영상
```bash
npm run dp -- videos <run>
```
- video_prompt가 있는 장면만 영상화한다. 시작 프레임은 1단계에서 검사를 통과한 이미지다.
- 생성된 영상도 처음·중간·끝 프레임을 뽑아 확인한다(`ffmpeg -ss 2 -i scene_03.mp4 -frames:v 1 f.png`). 왜곡은 `--redo`로 1회 재생성.

### 3. TTS
```bash
npm run dp -- tts <run>
```
- 전체 대사를 한 번에 합성해 톤을 맞추고, 글자 타임스탬프로 청크별 시간과 음성 파일을 만든다.
- 02 파일이 바뀌면 tts를 다시 실행해야 조립된다.

### 4. 조립·렌더
```bash
npm run dp -- assemble <run>
```
- 청크 1개 = 컷 1개. 2.2초를 넘는 청크는 같은 자막으로 화면만 나눈다.
- 같은 장면 안의 컷은 구도(wide → tight → left → right)를 바꾼다.
- 영상 소스가 장면보다 짧으면 0.85배속까지 늦추고(±15% 보정), 그래도 짧으면 반복한다. 컷마다 이어지는 구간을 쓴다.
- 시안 자산 컷에는 "패키지 디자인 시안 · 개발 중" 라벨이 자동으로 붙는다.
- 완료 후 자동 검수(Skill 04)가 함께 실행된다.

## 프로젝트 파일
- 편집 툴용 파일 형식(CapCut / Premiere)이 정해지기 전까지 `project/timeline.json`과 자막 파일을 남긴다. 형식이 정해지면 이 파일에서 변환한다.

## 예외 처리
- 각 API 호출은 3회 재시도 후 수동 큐로 넘긴다. 키·모델 ID 오류는 재시도하지 말고 사용자에게 `.env` 확인을 요청한다.
- 안전 필터로 영상이 거절되면 해당 장면은 정지 이미지로 두고(video 파일 없음 → 자동으로 still 처리) 사용자에게 알린다.
