const $=s=>document.querySelector(s);
const byId=Object.fromEntries(UI_TERMS.map(t=>[t.id,t]));
const ALIAS={modal:'팝업 팝업창 레이어 창 다이얼로그',toast:'알림 메시지',tooltip:'말풍선 도움말',dropdown:'콤보박스 선택',carousel:'배너 롤링 스와이퍼 슬라이드',drawer:'사이드바',spinner:'로딩',skeleton:'로딩 shimmer',dim:'오버레이 배경',fab:'플로팅 맨위로',chip:'필터 태그',badge:'뱃지 알림 숫자 new',toggle:'스위치 on off',truncation:'말줄임표 ... 오버플로우 잘림',gnb:'헤더 상단 메뉴',sticky:'고정 헤더',validation:'에러 오류 경고 인풋',placeholder:'힌트 입력창','button-state':'호버 포커스 비활성 disabled hover focus pressed',card:'카드형 상품 리스트 그리드 썸네일','dark-mode':'다크테마 야간모드 테마 라이트모드','foreground-background':'포그라운드 백그라운드 앱전환 홈버튼 복귀 resume 라이프사이클',responsive:'반응형 브레이크포인트 해상도 화면크기 태블릿 가로모드 미디어쿼리','bottom-sheet':'하단 팝업 하프모달 액션시트',popover:'더보기 메뉴 점세개 케밥 말풍선',snackbar:'실행취소 undo 하단 알림',progress:'진행률 로딩바 퍼센트 업로드','empty-state':'결과없음 0건 노데이터 no data','bottom-nav':'하단 메뉴 탭바 바텀 네비',hamburger:'메뉴 버튼 줄세개 ≡',tab:'탭메뉴 인디케이터 밑줄',breadcrumb:'경로 위치 빵부스러기',pagination:'페이징 페이지 번호 이전 다음','infinite-scroll':'더보기 load more 자동 로딩',stepper:'단계 진행 스텝 수량 +-',checkbox:'체크 전체동의 약관',radio:'단일선택 동그라미',segmented:'토글 버튼 기간 선택 일주월',slider:'레인지 가격 범위 드래그 바',accordion:'접기 펼치기 FAQ 토글','pull-to-refresh':'새로고침 PTR 끌어내리기','swipe-action':'밀어서 삭제 옆으로 밀기','text-field':'인풋 input 입력칸 텍스트박스 포커스 커서 글자수 지우기','header-footer':'상단바 앱바 타이틀바 네비게이션바 뒤로가기 푸터 회사정보 약관'};
// 정지 화면만 봐도 이해되는 용어 → 애니메이션 없이 대표 장면(초)으로 고정
const STILL={modal:1.4,dim:1.4,popover:1.4,'empty-state':1.4,badge:1.4,gnb:1.4,breadcrumb:1.4,pagination:1.4,stepper:2,fab:1.4,dropdown:1.4,checkbox:1.4,radio:1.4,chip:1.4,validation:2.6,truncation:2.6};
const phone=t=>STILL[t.id]!=null?`<div class="ph still" style="--d:-${STILL[t.id]}s">${t.demo}</div>`:`<div class="ph">${t.demo}</div>`;
let cat='전체';
$('#total').textContent=UI_TERMS.length;

$('#cats').innerHTML=UI_CATS.map(c=>`<button type="button" data-c="${c}" aria-pressed="${c===cat}">${c}</button>`).join('');
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
  const q=$('#q').value.trim().toLowerCase();
  const list=UI_TERMS.filter(t=>(cat==='전체'||t.cat===cat)&&(!q||[t.ko,t.en,t.short,ALIAS[t.id]||''].join(' ').toLowerCase().includes(q)));
  $('#count').textContent=`${list.length}개 표시 중`;
  $('#grid').innerHTML=list.length?list.map(t=>`<button class="card" type="button" data-id="${t.id}">
    <div class="mini" aria-hidden="true">${phone(t)}</div>
    <div class="body"><span class="cat">${t.cat}</span><h3>${t.ko}</h3><span class="en">${t.en}</span><p>${t.short}</p></div></button>`).join('')
    :`<div class="empty">“${q.replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'})[c])}”에 맞는 용어가 없어요. 다른 이름이나 영문으로 검색해 보세요.</div>`;
}
$('#grid').addEventListener('click',e=>{const c=e.target.closest('.card');if(c)location.hash=c.dataset.id;});

let lastFocus=null;
function openD(id){
  const t=byId[id];if(!t)return;
  if($('#ov').hidden)lastFocus=document.activeElement;
  $('#d-demo').innerHTML=phone(t);setupCar();
  $('#d-note').textContent=STILL[t.id]!=null?'화면 예시':carGo?'‹ › 버튼이나 ← → 키로 넘겨 보기':'▶ 동작 예시 (반복 재생)';
  $('#d-cat').textContent=t.cat;$('#d-title').textContent=t.ko;$('#d-en').textContent=t.en;
  $('#d-desc').textContent=t.desc;
  $('#d-rels').innerHTML=t.rel.filter(r=>byId[r]).map(r=>`<button class="rel" type="button" data-id="${r}">${byId[r].ko}</button>`).join('');
  $('#ov').hidden=false;document.body.style.overflow='hidden';
  $('.dialog').scrollTop=0;$('#d-close').focus();
}
function closeD(){
  if(location.hash)history.replaceState(null,'',location.pathname+location.search);
  $('#ov').hidden=true;document.body.style.overflow='';$('#d-demo').innerHTML='';
  if(lastFocus)lastFocus.focus();
}
function route(){const id=location.hash.slice(1);if(byId[id])openD(id);else if(!$('#ov').hidden)closeD();}
window.addEventListener('hashchange',route);
$('#d-close').addEventListener('click',closeD);
$('#ov').addEventListener('click',e=>{if(e.target===$('#ov'))closeD();});
$('#d-rels').addEventListener('click',e=>{const b=e.target.closest('.rel');if(b)location.hash=b.dataset.id;});
render();route();
