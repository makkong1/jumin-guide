# jumin-guide

고령 1인가구가 받을 수 있는 복지서비스를 **로그인 없이** 찾아주는 웹 서비스.

질문 여섯 개에 답하면 해당될 만한 제도를 이유와 함께 3~5개로 좁혀준다.
자녀가 부모 대신 알아볼 수 있다는 것이 핵심이다.

설계 배경과 결정은 [docs/superpowers/specs/2026-09-19-jumin-guide-design.md](docs/superpowers/specs/2026-09-19-jumin-guide-design.md)에 있다.

## 설계 요약

- **로그인·DB 없음.** 프로필(나이·소득·건강)은 저장하지 않고 URL 해시에 인코딩한다.
  쿼리스트링이 아닌 해시라 서버 로그·리퍼러·링크 미리보기에 남지 않는다.
- **복지 데이터는 빌드타임 스냅샷.** 런타임 API 호출이 없으므로 캐시·재시도·폴백도 없다.
- **판정은 3값** — `해당` / `아마 해당` / `해당 안 함`. 행정정보를 볼 수 없어 확정이
  원리적으로 불가능하므로 확정인 척하지 않고, 모든 판정에 이유를 붙인다.
- **"잘 모름"이 1급 선택지.** 모르면 `해당 안 함`이 아니라 `확인 필요`로 간다.
- **접근성이 기능이 아니라 전제.** 기본 18px, 한국어 `word-break: keep-all`,
  터치 타겟 44px, 네이티브 폼 요소만 사용.

## 개발

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # Node 내장 테스트 러너 (별도 러너 의존성 없음)
npm run typecheck
npm run lint
npm run build
```

## 기술 스택

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Vercel
