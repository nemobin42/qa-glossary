# 이슈 리포트 용어 사전

🔗 **사이트 바로가기: https://nemobin42.github.io/qa-glossary/**

- QA·테스터가 이슈 리포트 작성 시 필요한 용어 모음
- 정확한 용어 사용으로 개발자·디자이너의 문제 파악 시간 단축
- 카드 클릭 시 용어 설명 및 화면 예시 확인 가능

## 수록 분야

- UI/UX 용어 (38개)
- HTTP 상태 코드 (추가 예정)

## 주요 기능

- 분류별 카드형 용어 목록
- 한글·영문·흔히 쓰는 별칭으로 검색
- 상세 팝업: 설명, 화면 예시, 헷갈리기 쉬운 용어 바로가기
- 움직임이 필요한 용어만 동작 애니메이션 적용, 나머지는 정지 화면

## 폴더 구조

```
index.html          화면 구조
css/common.css      공통 디자인·레이아웃 (검색, 카드, 상세 팝업)
css/ui-demo.css     UI/UX 용어 화면 예시 및 애니메이션
js/ui-terms.js      UI/UX 용어 데이터
js/app.js           검색, 분류 필터, 상세 팝업 동작
```

## 파일 명명 규칙

- 공통 파일: `common`, `app`
- 분야 전용 파일: 분야 접두어 사용
- 예: HTTP 상태 코드 추가 시 `js/status-codes.js`, 필요 시 `css/status-demo.css`

## UI/UX 용어 추가 방법

- `js/ui-terms.js`의 `UI_TERMS` 배열에 항목 추가

```js
{id:'영문-id', ko:'한글 이름', en:'English Name', cat:'분류',
 short:'카드에 보이는 한 줄 설명',
 desc:'상세 팝업 설명',
 rel:['헷갈리기 쉬운 용어의 id'],
 demo:PAGE('화면 제목')}
```

- `cat`: `UI_CATS` 배열의 분류 중 하나 사용
- 정지 화면으로 보여줄 용어: `js/app.js`의 `STILL` 목록에 id 추가

## 실행

- `index.html`을 브라우저로 실행
- GitHub Pages 배포: 저장소 Settings → Pages에서 배포 브랜치 지정
