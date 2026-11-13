const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>s.replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'})[c]);

// 자주 쓰는 요소
const el={q:$('#q'),cats:$('#cats'),grid:$('#grid'),count:$('#count'),ov:$('#ov'),demo:$('#d-demo'),wrap:$('.wrap'),theme:$('#theme')};
const isOpen=()=>!el.ov.hidden;

// UI 용어 미니 휴대폰: still(초)이 있으면 애니메이션 없이 그 장면으로 고정
const phone=t=>t.still!=null?`<div class="ph still" style="--d:-${t.still}s">${t.demo}</div>`:`<div class="ph">${t.demo}</div>`;
// HTTP 상태 코드 색 구분 (2xx 초록, 3xx 파랑, 4xx 주황, 5xx 빨강)
const sc=t=>`s${String(t.code)[0]}`;
// 개발자 도구 Network 탭 모양의 예시
const net=t=>{const n=t.net;return `<div class="net ${sc(t)}"><div class="net-tabs"><span>Elements</span><span>Console</span><span class="on">Network</span></div>
  <div class="net-row net-h"><span>Name</span><span>Method</span><span>Status</span></div>
  <div class="net-row"><span>main.js</span><span>GET</span><span>200</span></div>
  <div class="net-row"><span>logo.png</span><span>GET</span><span>200</span></div>
  <div class="net-row hit"><span>${esc(n.p)}</span><span>${n.m}</span><span>${t.code}</span></div>
  <div class="net-res"><b>${n.h?'Response Headers':'Response'}</b><code>${esc(n.r)}</code></div></div>`;};

// 사전별 설정: 머리말 문구, 검색 대상, 카드·상세 화면 그리는 방법
// 공통 기본값(이름=ko, 영문=en, 상세 제목=이름)은 dict()가 채우고, 다른 것만 사전에 적음
const dict=o=>({name:t=>t.ko,sub:t=>t.en,dEn:t=>t.en,catCls:()=>'',catDot:()=>'',...o,dTitle:o.dTitle||o.name||(t=>t.ko)});
const DICTS={
  ui:dict({items:UI_TERMS,cats:UI_CATS,title:'이슈 리포트 용어 사전',
    eyebrow:n=>`For QA &amp; Testers · UI/UX 용어 ${n}개`,
    h1:'“그 팝업”의<br><mark>정확한 이름</mark>은 뭘까요?',
    lede:'QA·테스터가 이슈 리포트를 쓸 때 필요한 용어를 모았어요. 모달, 바텀 시트, 토스트는 모두 “팝업”이라고 부르기 쉽지만, 개발자와 디자이너에게는 서로 다른 컴포넌트예요. 정확한 이름을 쓰면 어느 부분을 확인해야 하는지 바로 전달돼요. 카드를 누르면 용어 설명과 화면 예시를 볼 수 있어요.',
    foot:'용어 표기는 업계에서 흔히 쓰는 이름 기준입니다. 팀·디자인 시스템마다 부르는 이름이 다를 수 있으니, 처음 쓸 때는 팀 컨벤션을 확인하세요.',
    ph:'용어 검색 (예: 토스트, modal, 팝업)',empty:'다른 이름이나 영문으로 검색해 보세요.',relH:'헷갈리기 쉬운 용어',
    text:t=>[t.ko,t.en,t.short,t.alias],
    mini:phone,stage:phone,
    note:t=>t.still!=null?'화면 예시':carGo?'‹ › 버튼이나 ← → 키로 넘겨 보기':'▶ 동작 예시 (반복 재생)'}),
  http:dict({items:STATUS_CODES,cats:STATUS_CATS,title:'HTTP 상태 코드 · 이슈 리포트 용어 사전',
    eyebrow:n=>`For QA &amp; Testers · HTTP 상태 코드 ${n}개`,
    h1:'“서버 에러”의<br><mark>정확한 이름</mark>은 뭘까요?',
    lede:'개발자 도구(F12) → Network 탭에 찍히는 세 자리 숫자가 HTTP 상태 코드예요. 4xx는 요청 쪽, 5xx는 서버 쪽 문제를 뜻해서 이슈 리포트에 함께 적으면 원인을 훨씬 빨리 찾을 수 있어요. 카드를 누르면 설명과 Network 탭 예시를 볼 수 있어요.',
    foot:'상태 코드의 의미는 HTTP 표준(RFC 9110) 기준입니다. 서비스마다 실제로 쓰는 코드가 다를 수 있으니 팀의 API 문서도 함께 확인하세요.',
    ph:'코드·이름 검색 (예: 404, 권한, timeout)',empty:'숫자나 영문 이름으로 검색해 보세요.',relH:'헷갈리기 쉬운 코드',
    text:t=>[t.code,t.ko,t.en,t.short,t.alias],
    mini:t=>`<div class="sc-mini ${sc(t)}">${t.art||''}<b>${t.code}</b></div>`,
    stage:t=>(t.art?`<div class="sc-art ${sc(t)}">${t.art}</div>`:'')+net(t),
    sub:t=>`${t.code} ${t.en}`,dTitle:t=>`${t.code} ${t.ko}`,
    catCls:sc,catDot:c=>/^[2-5]xx/.test(c)?`s${c[0]}`:'',
    note:t=>t.egg?'🎉 숨겨진 코드를 찾았어요!':'개발자 도구(F12) → Network 탭 예시'}),
};
// id → 항목·소속 사전, 검색용 문자열 (UI 용어 id와 'http-404' 같은 코드 id는 겹치지 않음)
const byId={};
for(const [k,d] of Object.entries(DICTS))for(const t of d.items)
  byId[t.id]={t,sec:k,q:d.text(t).filter(Boolean).join(' ').toLowerCase()};
let sec=null,cat='전체';
const D=()=>DICTS[sec];
const shown=d=>d.items.filter(t=>!t.egg);   // 목록·개수에 나오는 항목 (이스터 에그 제외)
const listHash=()=>sec==='ui'?'':`#${sec}`; // 상세를 닫았을 때 돌아갈 목록 주소

function setSec(s){
  if(s===sec)return;
  const first=sec==null;sec=s;cat='전체';el.q.value='';
  const d=D(),items=shown(d);
  document.title=d.title;
  $('#eyebrow').innerHTML=d.eyebrow(items.length);$('#h1').innerHTML=d.h1;$('#lede').textContent=d.lede;$('#foot').textContent=d.foot;
  el.q.placeholder=d.ph;
  $$('.gnb-tabs a').forEach(a=>a.dataset.s===s?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
  // 분류 버튼: 개수 표시, HTTP는 카드와 같은 색 점
  el.cats.innerHTML=d.cats.map(c=>{const n=c==='전체'?items.length:items.filter(t=>t.cat===c).length,dot=d.catDot(c);
    return `<button type="button" data-c="${c}" aria-pressed="${c===cat}">${dot?`<i class="dot ${dot}"></i>`:''}${c}<span class="n">${n}</span></button>`;}).join('');
  render();
  if(!first)scrollTo(0,0);
}

el.cats.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;cat=b.dataset.c;
  $$('#cats button').forEach(x=>x.setAttribute('aria-pressed',x===b));render();});
el.q.addEventListener('input',render);
document.addEventListener('keydown',e=>{
  if(isOpen()){
    if(e.key==='Escape')closeD();
    else if(carGo&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();carGo(e.key==='ArrowLeft'?-1:1);}
  }else if(e.key==='/'&&document.activeElement!==el.q){e.preventDefault();el.q.focus();}
});

// 상세 화면의 캐러셀 데모: 화살표·점·키보드 ←→·스와이프로 장면 넘기기
let carGo=null;
function setupCar(){
  carGo=null;
  const car=el.demo.querySelector('.car');if(!car)return;
  const ph=car.parentElement,t=car.querySelector('.car-t'),n=t.children.length,dots=[...ph.querySelectorAll('.car-dots i')];
  let i=0;
  const go=k=>{i=(k+n)%n;t.style.transform=`translateX(-${i*100/n}%)`;dots.forEach((d,j)=>d.classList.toggle('on',j===i));};
  // 점·버튼은 휴대폰 바깥(아래·양옆)에 둠 (휴대폰은 overflow:hidden이라 #d-demo에 붙임)
  el.demo.append(ph.querySelector('.car-dots'));
  el.demo.insertAdjacentHTML('beforeend','<button type="button" class="car-btn prev" aria-label="이전 장면">‹</button><button type="button" class="car-btn next" aria-label="다음 장면">›</button>');
  el.demo.querySelector('.prev').addEventListener('click',()=>go(i-1));
  el.demo.querySelector('.next').addEventListener('click',()=>go(i+1));
  dots.forEach((d,j)=>d.addEventListener('click',()=>go(j)));
  let x0=null;
  car.addEventListener('pointerdown',e=>{x0=e.clientX;});
  car.addEventListener('pointerup',e=>{if(x0!=null&&Math.abs(e.clientX-x0)>30)go(i+(e.clientX<x0?1:-1));x0=null;});
  carGo=d=>go(i+d);
}

// 화면 밖 카드의 썸네일 애니메이션은 멈춰 둠 (카드가 많아도 가볍게)
const offscreen=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('off',!e.isIntersecting)),{rootMargin:'120px'});
const card=(d,t)=>`<button class="card" type="button" data-id="${t.id}">
    <div class="mini" aria-hidden="true">${d.mini(t)}</div>
    <div class="body"><span class="cat ${d.catCls(t)}">${t.cat}</span><h3>${d.name(t)}</h3><span class="en">${d.sub(t)}</span><p>${t.short}</p></div></button>`;
function render(){
  const d=D(),q=el.q.value.trim().toLowerCase();
  // 이스터 에그(egg)는 정해진 검색어와 정확히 같을 때만 보임
  const list=d.items.filter(t=>t.egg?t.egg.includes(q):(cat==='전체'||t.cat===cat)&&(!q||byId[t.id].q.includes(q)));
  el.count.textContent=`${list.length}개 표시 중`;
  offscreen.disconnect();
  el.grid.innerHTML=list.length?list.map(t=>card(d,t)).join(''):`<div class="empty">“${esc(q)}”에 맞는 항목이 없어요. ${d.empty}</div>`;
  el.grid.querySelectorAll('.card').forEach(c=>offscreen.observe(c));
}
el.grid.addEventListener('click',e=>{const c=e.target.closest('.card');if(c)location.hash=c.dataset.id;});

let lastFocus=null;
function openD(id){
  const t=byId[id].t,d=D();
  if(!isOpen())lastFocus=document.activeElement;
  el.demo.innerHTML=d.stage(t);setupCar();
  $('#d-note').textContent=d.note(t);
  $('#d-cat').textContent=t.cat;$('#d-title').textContent=d.dTitle(t);$('#d-en').textContent=d.dEn(t);
  $('#d-desc').textContent=t.desc;
  // '이럴 때 보여요'·'보고할 때 팁'은 데이터에 있을 때만 표시 (현재 HTTP 상태 코드만)
  $('#d-when-s').hidden=!t.when;$('#d-when').innerHTML=(t.when||[]).map(w=>`<li>${esc(w)}</li>`).join('');
  $('#d-tip-s').hidden=!t.tip;$('#d-tip').textContent=t.tip||'';
  $('#d-rel-h').textContent=d.relH;
  $('#d-rels').innerHTML=t.rel.filter(r=>byId[r]).map(r=>`<button class="rel" type="button" data-id="${r}">${d.dTitle(byId[r].t)}</button>`).join('');
  // 팝업이 열린 동안 뒤 화면은 inert: Tab 키 포커스가 팝업 밖으로 나가지 않게
  el.ov.hidden=false;el.wrap.inert=true;document.body.style.overflow='hidden';
  $('.dialog').scrollTop=0;$('#d-close').focus();
}
function closeD(){
  if(location.hash!==listHash())history.replaceState(null,'',location.pathname+location.search+listHash());
  el.ov.hidden=true;el.wrap.inert=false;document.body.style.overflow='';el.demo.innerHTML='';carGo=null;
  lastFocus?.focus();
}
function route(){
  // hasOwn: '#constructor' 같은 주소가 객체 기본 속성으로 잘못 잡히지 않게
  const h=location.hash.slice(1),hit=Object.hasOwn(byId,h)?byId[h]:null;
  setSec(hit?hit.sec:Object.hasOwn(DICTS,h)?h:'ui');
  if(hit)openD(h);else if(isOpen())closeD();
}
window.addEventListener('hashchange',route);
$('#d-close').addEventListener('click',closeD);
el.ov.addEventListener('click',e=>{if(e.target===el.ov)closeD();});
$('#d-rels').addEventListener('click',e=>{const b=e.target.closest('.rel');if(b)location.hash=b.dataset.id;});

// 화면 테마: 라이트(기본) ↔ 다크 전환, 선택은 이 브라우저에만 저장
// 처음 적용은 index.html <head>의 스크립트가 함
const THEMES=[['light','라이트','☀'],['dark','다크','☾']];
const curTheme=()=>document.documentElement.dataset.theme==='dark'?'dark':'light';
function setTheme(v,save){
  document.documentElement.dataset.theme=v;
  const [,name,icon]=THEMES.find(x=>x[0]===v)||THEMES[0];
  el.theme.innerHTML=`<span aria-hidden="true">${icon}</span>${name}`;
  el.theme.setAttribute('aria-label',`화면 테마: ${name} (눌러서 바꾸기)`);
  if(save)try{localStorage.setItem('theme',v);}catch(e){}
}
el.theme.addEventListener('click',()=>{const i=THEMES.findIndex(x=>x[0]===curTheme());setTheme(THEMES[(i+1)%THEMES.length][0],true);});
setTheme(curTheme(),false);

route();
