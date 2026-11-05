const $=s=>document.querySelector(s);
const esc=s=>s.replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'})[c]);
const ALIAS={modal:'팝업 팝업창 레이어 창 다이얼로그',toast:'알림 메시지',tooltip:'말풍선 도움말',dropdown:'콤보박스 선택',carousel:'배너 롤링 스와이퍼 슬라이드',drawer:'사이드바',spinner:'로딩',skeleton:'로딩 shimmer',dim:'오버레이 배경',fab:'플로팅 맨위로',chip:'필터 태그',badge:'뱃지 알림 숫자 new',toggle:'스위치 on off',truncation:'말줄임표 ... 오버플로우 잘림',gnb:'헤더 상단 메뉴',sticky:'고정 헤더',validation:'에러 오류 경고 인풋',placeholder:'힌트 입력창','button-state':'호버 포커스 비활성 disabled hover focus pressed',card:'카드형 상품 리스트 그리드 썸네일','dark-mode':'다크테마 야간모드 테마 라이트모드','foreground-background':'포그라운드 백그라운드 앱전환 홈버튼 복귀 resume 라이프사이클',responsive:'반응형 브레이크포인트 해상도 화면크기 태블릿 가로모드 미디어쿼리','bottom-sheet':'하단 팝업 하프모달 액션시트',popover:'더보기 메뉴 점세개 케밥 말풍선',snackbar:'실행취소 undo 하단 알림',progress:'진행률 로딩바 퍼센트 업로드','empty-state':'결과없음 0건 노데이터 no data','bottom-nav':'하단 메뉴 탭바 바텀 네비',hamburger:'메뉴 버튼 줄세개 ≡',tab:'탭메뉴 인디케이터 밑줄',breadcrumb:'경로 위치 빵부스러기',pagination:'페이징 페이지 번호 이전 다음','infinite-scroll':'더보기 load more 자동 로딩',stepper:'단계 진행 스텝 수량 +-',checkbox:'체크 전체동의 약관',radio:'단일선택 동그라미',segmented:'토글 버튼 기간 선택 일주월',slider:'레인지 가격 범위 드래그 바',accordion:'접기 펼치기 FAQ 토글','pull-to-refresh':'새로고침 PTR 끌어내리기','swipe-action':'밀어서 삭제 옆으로 밀기','text-field':'인풋 input 입력칸 텍스트박스 포커스 커서 글자수 지우기','header-footer':'상단바 앱바 타이틀바 네비게이션바 뒤로가기 푸터 회사정보 약관'};
// 정지 화면만 봐도 이해되는 용어 → 애니메이션 없이 대표 장면(초)으로 고정
const STILL={modal:1.4,dim:1.4,popover:1.4,'empty-state':1.4,badge:1.4,gnb:1.4,breadcrumb:1.4,pagination:1.4,stepper:2,fab:1.4,dropdown:1.4,checkbox:1.4,radio:1.4,chip:1.4,validation:2.6,truncation:2.6};
const phone=t=>STILL[t.id]!=null?`<div class="ph still" style="--d:-${STILL[t.id]}s">${t.demo}</div>`:`<div class="ph">${t.demo}</div>`;
// HTTP 상태 코드 카드·상세의 색 구분 (2xx 초록, 3xx 파랑, 4xx 주황, 5xx 빨강)
const sc=t=>`s${String(t.code)[0]}`;
// 개발자 도구 Network 탭 모양의 예시
const net=t=>{const n=t.net;return `<div class="net ${sc(t)}"><div class="net-tabs"><span>Elements</span><span>Console</span><span class="on">Network</span></div>
  <div class="net-row net-h"><span>Name</span><span>Method</span><span>Status</span></div>
  <div class="net-row"><span>main.js</span><span>GET</span><span>200</span></div>
  <div class="net-row"><span>logo.png</span><span>GET</span><span>200</span></div>
  <div class="net-row hit"><span>${esc(n.p)}</span><span>${n.m}</span><span>${t.code}</span></div>
  <div class="net-res"><b>${n.h?'Response Headers':'Response'}</b><code>${esc(n.r)}</code></div></div>`;};

// 사전별 설정: 머리말 문구, 검색 대상, 카드·상세 화면 그리는 방법
const DICTS={
  ui:{items:UI_TERMS,cats:UI_CATS,title:'이슈 리포트 용어 사전',
    eyebrow:n=>`For QA &amp; Testers · UI/UX 용어 ${n}개`,
    h1:'“그 팝업”의<br><mark>정확한 이름</mark>은 뭘까요?',
    lede:'QA·테스터가 이슈 리포트를 쓸 때 필요한 용어를 모았어요. 모달, 바텀 시트, 토스트는 모두 “팝업”이라고 부르기 쉽지만, 개발자와 디자이너에게는 서로 다른 컴포넌트예요. 정확한 이름을 쓰면 어느 부분을 확인해야 하는지 바로 전달돼요. 카드를 누르면 용어 설명과 화면 예시를 볼 수 있어요.',
    foot:'용어 표기는 업계에서 흔히 쓰는 이름 기준입니다. 팀·디자인 시스템마다 부르는 이름이 다를 수 있으니, 처음 쓸 때는 팀 컨벤션을 확인하세요.',
    ph:'용어 검색 (예: 토스트, modal, 팝업)',empty:'다른 이름이나 영문으로 검색해 보세요.',relH:'헷갈리기 쉬운 용어',
    text:t=>[t.ko,t.en,t.short,ALIAS[t.id]||''],
    mini:phone,name:t=>t.ko,sub:t=>t.en,dTitle:t=>t.ko,dEn:t=>t.en},
  http:{items:STATUS_CODES,cats:STATUS_CATS,title:'HTTP 상태 코드 · 이슈 리포트 용어 사전',
    eyebrow:n=>`For QA &amp; Testers · HTTP 상태 코드 ${n}개`,
    h1:'“서버 에러”의<br><mark>정확한 이름</mark>은 뭘까요?',
    lede:'개발자 도구(F12) → Network 탭에 찍히는 세 자리 숫자가 HTTP 상태 코드예요. 4xx는 요청 쪽, 5xx는 서버 쪽 문제를 뜻해서 이슈 리포트에 함께 적으면 원인을 훨씬 빨리 찾을 수 있어요. 카드를 누르면 설명과 Network 탭 예시를 볼 수 있어요.',
    foot:'상태 코드의 의미는 HTTP 표준(RFC 9110) 기준입니다. 서비스마다 실제로 쓰는 코드가 다를 수 있으니 팀의 API 문서도 함께 확인하세요.',
    ph:'코드·이름 검색 (예: 404, 권한, timeout)',empty:'숫자나 영문 이름으로 검색해 보세요.',relH:'헷갈리기 쉬운 코드',
    text:t=>[String(t.code),t.ko,t.en,t.short,t.alias||''],
    mini:t=>`<div class="sc-mini ${sc(t)}">${t.art||''}<b>${t.code}</b></div>`,
    name:t=>t.ko,sub:t=>`${t.code} ${t.en}`,dTitle:t=>`${t.code} ${t.ko}`,dEn:t=>t.en},
};
// id → 항목·소속 사전 (UI 용어 id와 'http-404' 같은 코드 id는 겹치지 않음)
const byId={};
for(const [k,d] of Object.entries(DICTS))d.items.forEach(t=>{byId[t.id]={t,sec:k};});
let sec=null,cat='전체';
const D=()=>DICTS[sec];

function setSec(s){
  if(s===sec)return;
  const first=sec==null;sec=s;cat='전체';$('#q').value='';
  const d=D();
  document.title=d.title;
  $('#eyebrow').innerHTML=d.eyebrow(d.items.filter(t=>!t.egg).length);$('#h1').innerHTML=d.h1;$('#lede').textContent=d.lede;$('#foot').textContent=d.foot;
  $('#q').placeholder=d.ph;
  document.querySelectorAll('.gnb-tabs a').forEach(a=>{if(a.dataset.s===s)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  $('#cats').innerHTML=d.cats.map(c=>`<button type="button" data-c="${c}" aria-pressed="${c===cat}">${c}</button>`).join('');
  render();
  if(!first)scrollTo(0,0);
}

$('#cats').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;cat=b.dataset.c;
  document.querySelectorAll('#cats button').forEach(x=>x.setAttribute('aria-pressed',x===b));render();});
$('#q').addEventListener('input',render);
document.addEventListener('keydown',e=>{
  if(e.key==='/'&&document.activeElement!==$('#q')&&$('#ov').hidden){e.preventDefault();$('#q').focus();}
  if(e.key==='Escape'&&!$('#ov').hidden)closeD();
  if(carGo&&!$('#ov').hidden&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();carGo(e.key==='ArrowLeft'?-1:1);}
});

// 상세 화면의 캐러셀 데모: 화살표·점·키보드 ←→·스와이프로 장면 넘기기
let carGo=null;
function setupCar(){
  carGo=null;
  const car=$('#d-demo .car');if(!car)return;
  const ph=car.parentElement,t=car.querySelector('.car-t'),n=t.children.length,dots=[...ph.querySelectorAll('.car-dots i')];
  let i=0;
  const go=k=>{i=(k+n)%n;t.style.transform=`translateX(-${i*100/n}%)`;dots.forEach((d,j)=>d.classList.toggle('on',j===i));};
  // 점·버튼은 휴대폰 바깥(아래·양옆)에 둠 (휴대폰은 overflow:hidden이라 #d-demo에 붙임)
  $('#d-demo').append(ph.querySelector('.car-dots'));
  $('#d-demo').insertAdjacentHTML('beforeend','<button type="button" class="car-btn prev" aria-label="이전 장면">‹</button><button type="button" class="car-btn next" aria-label="다음 장면">›</button>');
  $('#d-demo .prev').addEventListener('click',()=>go(i-1));
  $('#d-demo .next').addEventListener('click',()=>go(i+1));
  dots.forEach((d,j)=>d.addEventListener('click',()=>go(j)));
  let x0=null;
  car.addEventListener('pointerdown',e=>{x0=e.clientX;});
  car.addEventListener('pointerup',e=>{if(x0!=null&&Math.abs(e.clientX-x0)>30)go(i+(e.clientX<x0?1:-1));x0=null;});
  carGo=d=>go(i+d);
}

function render(){
  const d=D(),q=$('#q').value.trim().toLowerCase();
  // 이스터 에그(egg)는 정해진 검색어와 정확히 같을 때만 보임
  const list=d.items.filter(t=>t.egg?t.egg.includes(q):(cat==='전체'||t.cat===cat)&&(!q||d.text(t).join(' ').toLowerCase().includes(q)));
  $('#count').textContent=`${list.length}개 표시 중`;
  $('#grid').innerHTML=list.length?list.map(t=>`<button class="card" type="button" data-id="${t.id}">
    <div class="mini" aria-hidden="true">${d.mini(t)}</div>
    <div class="body"><span class="cat">${t.cat}</span><h3>${d.name(t)}</h3><span class="en">${d.sub(t)}</span><p>${t.short}</p></div></button>`).join('')
    :`<div class="empty">“${esc(q)}”에 맞는 항목이 없어요. ${d.empty}</div>`;
}
$('#grid').addEventListener('click',e=>{const c=e.target.closest('.card');if(c)location.hash=c.dataset.id;});

let lastFocus=null;
function openD(id){
  const t=byId[id].t,d=D(),isUi=sec==='ui';
  if($('#ov').hidden)lastFocus=document.activeElement;
  $('#d-demo').innerHTML=isUi?phone(t):(t.art?`<div class="sc-art ${sc(t)}">${t.art}</div>`:'')+net(t);setupCar();
  $('#d-note').textContent=t.egg?'🎉 숨겨진 코드를 찾았어요!':!isUi?'개발자 도구(F12) → Network 탭 예시':STILL[t.id]!=null?'화면 예시':carGo?'‹ › 버튼이나 ← → 키로 넘겨 보기':'▶ 동작 예시 (반복 재생)';
  $('#d-cat').textContent=t.cat;$('#d-title').textContent=d.dTitle(t);$('#d-en').textContent=d.dEn(t);
  $('#d-desc').textContent=t.desc;
  // '이럴 때 보여요'·'보고할 때 팁'은 데이터에 있을 때만 표시 (현재 HTTP 상태 코드만)
  $('#d-when-s').hidden=!t.when;$('#d-when').innerHTML=(t.when||[]).map(w=>`<li>${esc(w)}</li>`).join('');
  $('#d-tip-s').hidden=!t.tip;$('#d-tip').textContent=t.tip||'';
  $('#d-rel-h').textContent=d.relH;
  $('#d-rels').innerHTML=t.rel.filter(r=>byId[r]).map(r=>`<button class="rel" type="button" data-id="${r}">${d.dTitle(byId[r].t)}</button>`).join('');
  $('#ov').hidden=false;document.body.style.overflow='hidden';
  $('.dialog').scrollTop=0;$('#d-close').focus();
}
function closeD(){
  // 닫으면 지금 사전의 목록 주소로 (UI 용어는 주소 끝 # 없이)
  const base=sec==='http'?'#http':'';
  if(location.hash!==base)history.replaceState(null,'',location.pathname+location.search+base);
  $('#ov').hidden=true;document.body.style.overflow='';$('#d-demo').innerHTML='';
  if(lastFocus)lastFocus.focus();
}
function route(){
  // hasOwn: '#constructor' 같은 주소가 객체 기본 속성으로 잘못 잡히지 않게
  const h=location.hash.slice(1),hit=Object.hasOwn(byId,h)?byId[h]:null;
  setSec(hit?hit.sec:Object.hasOwn(DICTS,h)?h:'ui');
  if(hit)openD(h);else if(!$('#ov').hidden)closeD();
}
window.addEventListener('hashchange',route);
$('#d-close').addEventListener('click',closeD);
$('#ov').addEventListener('click',e=>{if(e.target===$('#ov'))closeD();});
$('#d-rels').addEventListener('click',e=>{const b=e.target.closest('.rel');if(b)location.hash=b.dataset.id;});
route();
