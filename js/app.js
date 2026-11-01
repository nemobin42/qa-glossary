const $=s=>document.querySelector(s);
const byId=Object.fromEntries(UI_TERMS.map(t=>[t.id,t]));
const ALIAS={modal:'팝업 팝업창 레이어 창 다이얼로그',toast:'알림 메시지',tooltip:'말풍선 도움말',dropdown:'콤보박스 선택',carousel:'배너 롤링 스와이퍼 슬라이드',drawer:'사이드바',spinner:'로딩',skeleton:'로딩 shimmer',dim:'오버레이 배경',fab:'플로팅 맨위로',chip:'필터 태그',badge:'뱃지 알림 숫자 new',toggle:'스위치 on off',truncation:'말줄임표 ... 오버플로우 잘림',gnb:'헤더 상단 메뉴',sticky:'고정 헤더',validation:'에러 오류 경고 인풋',placeholder:'힌트 입력창','button-state':'호버 포커스 비활성 disabled hover focus pressed'};
// 정지 화면만 봐도 이해되는 용어 → 애니메이션 없이 대표 장면(초)으로 고정
const STILL={modal:1.4,dim:1.4,popover:1.4,'empty-state':1.4,badge:1.4,gnb:1.4,'bottom-nav':1.4,breadcrumb:1.4,pagination:1.4,stepper:2,tab:2,fab:1.4,dropdown:1.4,checkbox:1.4,radio:1.4,segmented:2,chip:1.4,validation:2.6,truncation:2.6};
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
});

function render(){
  const q=$('#q').value.trim().toLowerCase();
  const list=UI_TERMS.filter(t=>(cat==='전체'||t.cat===cat)&&(!q||[t.ko,t.en,t.short,ALIAS[t.id]||''].join(' ').toLowerCase().includes(q)));
  $('#count').textContent=`${list.length}개 표시 중`;
  $('#grid').innerHTML=list.length?list.map(t=>`<button class="card" type="button" data-id="${t.id}">
    <div class="mini" aria-hidden="true">${phone(t)}</div>
    <div class="body"><span class="cat">${t.cat}</span><h3>${t.ko}</h3><span class="en">${t.en}</span><p>${t.short}</p></div></button>`).join('')
    :`<div class="empty">“${q.replace(/[<>&]/g,'')}”에 맞는 용어가 없어요. 다른 이름이나 영문으로 검색해 보세요.</div>`;
}
$('#grid').addEventListener('click',e=>{const c=e.target.closest('.card');if(c)location.hash=c.dataset.id;});

let lastFocus=null;
function openD(id){
  const t=byId[id];if(!t)return;
  if($('#ov').hidden)lastFocus=document.activeElement;
  $('#d-demo').innerHTML=phone(t);$('#d-note').textContent=STILL[t.id]!=null?'화면 예시':'▶ 동작 예시 (반복 재생)';
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
