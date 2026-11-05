# 이슈 리포트 용어 사전

🔗 **사이트 바로가기: https://nemobin42.github.io/qa-glossary/**

- QA·테스터가 이슈 리포트 작성 시 필요한 용어 모음
- 정확한 용어 사용으로 개발자·디자이너의 문제 파악 시간 단축
- 카드 클릭 시 용어 설명 및 화면 예시 확인 가능

## 수록 분야

- UI/UX 용어 (44개)
  - 오버레이, 내비게이션, 입력·컨트롤, 피드백·상태, 콘텐츠·레이아웃, 환경·플랫폼
- HTTP 상태 코드 (20개)
  - 2xx 성공, 3xx 리다이렉션, 4xx 요청 오류, 5xx 서버 오류

## 주요 기능

- 상단 메뉴(GNB)로 UI/UX 용어 · HTTP 상태 코드 사전 전환
- 분류별 카드형 용어 목록
- 한글·영문·흔히 쓰는 별칭으로 검색
- 상세 팝업: 설명, 화면 예시, 헷갈리기 쉬운 용어 바로가기
- 움직임이 필요한 용어만 동작 애니메이션 적용, 나머지는 정지 화면
- 장면이 여러 개인 예시(헤더/푸터, 버튼 상태)는 ‹ › 버튼·← → 키·스와이프로 넘겨 보기
- HTTP 상태 코드 상세: 개발자 도구 Network 탭 예시, 자주 보이는 상황, 보고할 때 팁
- 다크 모드 지원 (시스템 설정 따라감)

## 폴더 구조

```
index.html          화면 구조
css/common.css      공통 디자인·레이아웃 (검색, 카드, 상세 팝업)
css/ui-demo.css     UI/UX 용어 화면 예시 및 애니메이션
css/status-demo.css HTTP 상태 코드 카드·Network 탭 예시
js/ui-terms.js      UI/UX 용어 데이터
js/status-codes.js  HTTP 상태 코드 데이터
js/app.js           사전 전환, 검색, 분류 필터, 상세 팝업, 장면 넘기기 동작
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
 bugs:['자주 나오는 버그'],
 bad:'나쁜 보고 예시',
 good:'좋은 보고 예시',
 rel:['헷갈리기 쉬운 용어의 id'],
 demo:PAGE('화면 제목')}
```

- `cat`: `UI_CATS` 배열의 분류 중 하나 사용
- `bugs`·`bad`·`good`: 데이터로만 보관, 현재 화면에는 표시하지 않음
- 검색 별칭: `js/app.js`의 `ALIAS`에 `id:'별칭 여러 개'` 추가
- 정지 화면으로 보여줄 용어: `js/app.js`의 `STILL` 목록에 id 추가
- 장면을 넘겨 보는 예시: `demo`에 `CAR([장면1, 장면2, …])` 사용

## HTTP 상태 코드 추가 방법

- `js/status-codes.js`의 `STATUS_CODES` 배열에 항목 추가

```js
{id:'http-코드', code:404, ko:'한글 이름', en:'English Name', cat:'4xx 요청 오류',
 short:'카드에 보이는 한 줄 설명',
 desc:'상세 팝업 설명',
 when:['자주 보이는 상황'],
 tip:'보고할 때 팁',
 alias:'검색 별칭',
 rel:['헷갈리기 쉬운 코드의 id'],
 net:{m:'GET', p:'/요청/주소', r:'응답 내용', h:false}}
```

- `cat`: `STATUS_CATS` 배열의 분류 중 하나 사용
- `net`: Network 탭 예시. `h:true`면 응답 헤더(예: `Location: /login`)로 표시

## 주소

- UI/UX 용어: `#modal`처럼 용어 id
- HTTP 상태 코드 목록: `#http`, 상세: `#http-404`

## 실행

- `index.html`을 브라우저로 실행
- GitHub Pages 배포: 저장소 Settings → Pages에서 배포 브랜치 지정
