# 디어파파 Gemini API 키 입력

실제 키를 입력할 파일은 이 프로젝트의 [`.env.local`](.env.local)입니다.

1. [Google AI Studio](https://aistudio.google.com/apikey)에서 발급한 Gemini API 키를 준비합니다.
2. `.env.local`을 메모장으로 열고 `GEMINI_API_KEY=`의 등호 뒤에 키를 붙여 넣어 저장합니다. 파일 이름은 `.env.local` 그대로 유지합니다.
3. 나머지 설정은 이미 준비되어 있습니다.

```dotenv
GEMINI_API_KEY=
BUNNY_AI_ENABLED=true
GEMINI_BUNNY_MODEL=gemini-3.5-flash-lite
```

키를 저장한 뒤 미리보기 서버를 다시 시작해야 반영됩니다. 실행 중인 미리보기 터미널에서 Ctrl+C로 종료한 다음, 프로젝트 폴더에서 아래 명령을 실행합니다.

```powershell
npm.cmd run preview
```

[로컬 미리보기](http://127.0.0.1:51900/)에서 아빠에 관한 한 줄을 쓰고 **답변 듣기**를 누릅니다. 성공한 Gemini 응답에는 **AI 답변**이 표시됩니다. **토끼의 기본 답변**은 준비된 문구이며 실제 AI 응답이 아닙니다.

이 파일에 키를 적지 마세요. 실제 키는 `.env.local`에만 입력합니다. `.env.local`은 Git에서 제외되며 서버에서만 읽습니다. 로컬 파일 설정은 운영 사이트 환경 변수에 자동 반영되지 않습니다.

## 모델과 비용

기본 모델은 안정 버전 **Gemini 3.5 Flash-Lite**입니다. 2026-10-25 확인한 표준 유료 API 단가는 입력 100만 토큰당 **$0.30**, 출력 100만 토큰당 **$2.50**입니다. 출력 과금에는 생각 토큰도 포함되며 실제 비용은 대화 길이와 사용량에 따라 달라집니다.

짧은 답변을 목표로 기존 `thinkingLevel=low`, 요청당 최대 출력 2,048토큰, 최근 대화 길이 제한을 유지합니다. 이는 실제 생성 품질을 확인하기 전의 비용 중심 선택입니다.

공식 자료: [모델 설명](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite), [가격표](https://ai.google.dev/gemini-api/docs/pricing#gemini-3.5-flash-lite).
