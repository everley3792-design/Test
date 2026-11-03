/* ===== 3.2 效能、穩定性與打磨 ===== */
(()=>{'use strict';
const reduce=()=>document.documentElement.dataset.motion==='reduce';
const visibleStage=e=>{const r=e.r;if(!r.isConnected)return false;const pg=r.closest('.page'),sh=r.closest('.sheet');if(pg&&!pg.classList.contains('on')&&!/visible/.test(pg.getAttribute('style')||''))return false;if(sh&&!sh.classList.contains('open'))return false;return true};

/* ---------- 1. 天空與光線：原本每一格都改寫 30 個 CSS 變數 → 整個場景每格重新計算樣式 ---------- */
function perfEnv(){if(typeof Env==='undefined'||!Env.paint)return;const paint=Env.paint.bind(Env);let last=0,stale=new Set();
 Env.paint=function(force){const now=performance.now();if(!force&&now-last<110){this.dirty=1;return}last=now;
  const all=this.rt,vis=all.filter(visibleStage);all.forEach(e=>{if(!vis.includes(e))stale.add(e)});vis.forEach(e=>stale.delete(e));
  this.rt=vis;try{paint()}finally{this.rt=all}
  for(const e of vis){const cs=e.r.style,st=+cs.getPropertyValue('--stars')||0,ff=+cs.getPropertyValue('--ff')||0,a=st>.02?'1':'0',b=ff>.02?'1':'0';if(e.r.dataset.st!==a)e.r.dataset.st=a;if(e.r.dataset.ff!==b)e.r.dataset.ff=b}};
 // 頁面或視窗出現的那一刻，立即補畫被略過的場景（避免回到首頁時天空顏色跳一下）
 const refresh=()=>{if(!stale.size)return;const v=[...stale].filter(visibleStage);if(!v.length)return;v.forEach(e=>stale.delete(e));const all=Env.rt;Env.rt=v;try{paint()}finally{Env.rt=all}};
 window.P32EnvRefresh=refresh;
 const go=Nav.go;Nav.go=function(){const r=go.apply(this,arguments);refresh();return r};
 const os=openSheet;openSheet=function(){const a=os.apply(this,arguments);requestAnimationFrame(refresh);setTimeout(refresh,60);return a};
 Env.paint(true)}

/* ---------- 2. 角色站位：每格都在掃描整個房間找盆栽 → 改為最多每 0.4 秒一次 ---------- */
function perfSpots(){const cs=Stage.prototype.calcSpots;Stage.prototype.calcSpots=function(){if(this===Home.stage&&this.spots){const now=performance.now();if(this._csT&&now-this._csT<400&&this.W===this._csW&&this.size===this._csS)return;this._csT=now;this._csW=this.W;this._csS=this.size}return cs.apply(this,arguments)}}

/* ---------- 3. 隱藏中的頁面：暫停裡面的動畫（用 JS 暫停，避免昂貴的全域 CSS 選擇器） ---------- */
function perfPages(){const mine=new WeakSet();const resume=p=>{try{for(const a of p.getAnimations({subtree:true}))if(mine.has(a)){mine.delete(a);if(a.playState==='paused')a.play()}}catch(_){}};
 const sync=()=>{Nav.pages.forEach((p,k)=>{const on=k===Nav.cur;if(p._p32on===on)return;p._p32on=on;if(on){resume(p);return}try{for(const a of p.getAnimations({subtree:true})){if(!(a instanceof CSSAnimation)||a.playState!=='running')continue;a.pause();mine.add(a)}}catch(_){}})};
 const go=Nav.go;Nav.go=function(i){if(Number.isInteger(i)&&this.pages[i]){const p=this.pages[i];p._p32on=true;resume(p)}const r=go.apply(this,arguments);setTimeout(sync,700);return r};
 // 新加入隱藏頁面的元素（例如背景更新的卡片）也要暫停
 setInterval(()=>{Nav.pages.forEach((p,k)=>{if(k!==Nav.cur){p._p32on=null}});sync()},5000);sync()}

/* ---------- 4. 鏡頭縮放後重新以清晰解析度繪製（will-change 圖層放大後會模糊、像破圖） ---------- */
function perfCam(){let rz=null,prev=null;setInterval(()=>{const Cm=window.OCSCamera,pl=Cm&&Cm.plane;if(!pl||Nav.cur!==0||document.hidden)return;const z=+Cm.z||1;if(rz===null){rz=z;prev=z;return}
 if(Math.abs(z-prev)<.004&&Math.abs(z-rz)>.03){rz=z;pl.style.willChange='auto';requestAnimationFrame(()=>requestAnimationFrame(()=>{pl.style.willChange=''}))}prev=z},220)}

/* ---------- 啟動 ---------- */
const wait=setInterval(()=>{try{if(!(window.OCSCommunity?.ready&&window.L31&&typeof Env!=='undefined'&&Env.rt))return;clearInterval(wait);
 perfEnv();perfSpots();perfPages();perfCam();
 (window.P32Init||[]).forEach(f=>{try{f()}catch(e){console.error('[3.2]',e)}});window.P32Ready=true;
 /* 開場：等場景、鏡頭與角色都定位後才收起開場畫面，避免一開始看到未完成的畫面再跳動 */
 requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(()=>window.OCS_HIDE_SPLASH&&OCS_HIDE_SPLASH(),350)))}catch(e){console.error('[3.2]',e);clearInterval(wait)}},200);
})();
/* ===== 3.2 小島擺設：可點擊、可在佈置模式移動；與家具共用前後遮擋規則 ===== */
(()=>{'use strict';
const MOV={bench:'長椅',campfire:'營火',rock1:'大石頭',rock2:'石頭',rock3:'小石頭',msign:'花海告示牌',bigtree:'大樹',well:'飲水台',picnic:'野餐墊'};
const FLAT=new Set(['picnic']);
const st=()=>{const v=Cfg.v.l32;if(!v||typeof v!=='object'||!v.props||typeof v.props!=='object'){Cfg.v.l32={props:{}}}return Cfg.v.l32};
const save=()=>{try{Cfg.set('l32',Cfg.v.l32)}catch(_){try{Cfg.save()}catch(__){}}};
const Z=y=>Math.round(y*10000)*16;
/* 前後遮擋：與夥伴、家具共用同一套深度（腳底越低越前面）；平鋪在地上的野餐墊永遠在大家腳下 */
function apply(p){if(!p.el)return;p.el.style.left=(p.x*100)+'%';p.el.style.top=(p.y*100)+'%';p.el.style.zIndex=FLAT.has(p.id)?'12':String(Z(p.y))}
function init(){const IW=window.IsleWorld,C=window.OCSCommunity;if(!IW||!IW.PROPS||!C)return;
 const S=st().props;
 // 讀取玩家擺放過的位置
 for(const p of IW.PROPS){const s=S[p.id];if(s&&Number.isFinite(s.x)&&Number.isFinite(s.y)){p.x=s.x;p.y=s.y}if(MOV[p.id]&&p.el){p.el.dataset.mv='1';p.el.setAttribute('aria-label',MOV[p.id]);if(p.id==='bench'||p.id==='bigtree')p.el.dataset.tap='1'}apply(p)}
 try{IW.layoutProps()}catch(_){}
 // 大樹被移動後，乘涼的位置跟著大樹走
 try{const T=IW.props.bigtree;if(T&&IW.ACTS.shade){IW.ACTS.shade.spot=n=>IW.spotNear(T.x,T.y+.04,.07,.012,n)}}catch(_){}
 // 點一下：長椅→坐下看風景；大樹→去樹下乘涼（營火、告示牌沿用原本的互動）
 document.addEventListener('isle:prop',e=>{const id=e.detail,n=C.nodes.get(Cfg.v.active);if(!n||C.busy(n))return;
  if(id==='bench'){C.interrupt(n);if(IW.Act.start(n,'bench')||IW.Act.start(n,'sunset')){buzz(8);IW.think(n,'sunset')}else toast('長椅上已經有人了','info')}
  else if(id==='bigtree'){C.interrupt(n);if(IW.Act.start(n,'shade'))buzz(8)}});
 bindDrag(IW,C);
 // 坐下時不再瞬間「吸」到椅子上：從原本的位置輕輕一跳坐上去
 const hopIn=(n,before)=>{if(document.documentElement.dataset.motion==='reduce'||!before)return;requestAnimationFrame(()=>{const a=n.s.actor,r=a.getBoundingClientRect(),dx=before.left-r.left,dy=before.top-r.top,d=Math.hypot(dx,dy);if(d<2||d>260)return;
  a.animate([{translate:`${dx}px ${dy}px`},{translate:`${dx*.45}px ${dy*.45-Math.min(22,8+d*.15)}px`,offset:.5},{translate:'0 0'}],{duration:420,easing:'cubic-bezier(.33,.8,.4,1)'});try{n.s.squash&&setTimeout(()=>n.s.squash(.08),400)}catch(_){}})};
 const uf=C.useFurniture.bind(C);C.useFurniture=function(n){const b=n.s.actor.getBoundingClientRect();const r=uf(n);if(n.seat)hopIn(n,b);return r};
 for(const k of ['bench','sunset']){const A=IW.ACTS[k];if(!A||!A.arrive)continue;const ar=A.arrive;A.arrive=function(n){const b=n.s.actor.getBoundingClientRect(),had=!!n.seat;const r=ar.apply(this,arguments);if(n.seat&&!had)hopIn(n,b);return r}}}

/* ---------- 佈置模式：拖曳小島擺設 ---------- */
function bindDrag(IW,C){let drag=null,ring=null;
 const editing=()=>document.body.classList.contains('room-edit')&&window.OCS24D?.Ed?.on;
 const hitProp=(x,y)=>{let best=null;for(const p of IW.PROPS){if(!MOV[p.id]||!p.el)continue;const r=p.el.getBoundingClientRect();if(x<r.left||x>r.right||y<r.top||y>r.bottom)continue;if(!best||+p.el.style.zIndex>+best.el.style.zIndex)best=p}return best};
 const overFurniture=(x,y)=>[...document.querySelectorAll('#homeStage .rm-it')].some(e=>{const b=e.querySelector('.rm-b')||e,r=b.getBoundingClientRect();return r.width&&x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom});
 const mark=p=>{if(!ring){ring=document.createElement('i');ring.className='p32-ring'}if(!p){ring.remove();return}p.el.append(ring);const lb=ring.querySelector('b')||ring.appendChild(document.createElement('b'));lb.textContent=MOV[p.id]};
 document.addEventListener('pointerdown',e=>{if(!editing()||e.button>0)return;if(e.target.closest('#edTop,#edBar,#edHint,.sheet,button'))return;const p=hitProp(e.clientX,e.clientY);if(!p||overFurniture(e.clientX,e.clientY))return;
  e.stopImmediatePropagation();e.preventDefault();const root=Home.stage.root,w=OCSCamera.worldPoint(root,e.clientX,e.clientY);if(!w)return;
  drag={p,id:e.pointerId,ox:p.x-w.x/IW.W,oy:p.y-w.y/IW.H,x0:p.x,y0:p.y,moved:false};p.el.classList.add('p32-drag');mark(p);buzz(8);try{root.setPointerCapture?.(e.pointerId)}catch(_){}},true);
 document.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;e.stopImmediatePropagation();e.preventDefault();const w=OCSCamera.worldPoint(Home.stage.root,e.clientX,e.clientY);if(!w)return;
  const b=C.bounds();let x=Math.max(b.left,Math.min(b.right,w.x/IW.W+drag.ox)),y=Math.max(b.min,Math.min(b.max,w.y/IW.H+drag.oy));
  const ok=IW.onLand(x,y);drag.p.el.classList.toggle('p32-bad',!ok);if(Math.hypot(x-drag.p.x,y-drag.p.y)>.002)drag.moved=true;drag.p.x=x;drag.p.y=y;apply(drag.p);IW.layoutProps()},true);
 const end=e=>{if(!drag||e.pointerId!==drag.id)return;e.stopImmediatePropagation();const p=drag.p;p.el.classList.remove('p32-drag');
  if(!IW.onLand(p.x,p.y)){p.x=drag.x0;p.y=drag.y0;toast('擺設要放在陸地上喔','info')}p.el.classList.remove('p32-bad');apply(p);IW.layoutProps();
  if(drag.moved){st().props[p.id]={x:+p.x.toFixed(4),y:+p.y.toFixed(4)};save();buzz(6);
   // 正在使用這個擺設的夥伴先起身，避免懸空
   for(const n of C.nodes.values()){if(n.seat?.p?.u==='isle_'+p.id||(['bench','sunset'].includes(n.task?.act)&&p.id==='bench')||(n.task?.act==='campfire'&&p.id==='campfire')){n.seat=null;C.interrupt(n)}}}
  drag=null;setTimeout(()=>mark(null),900)};
 document.addEventListener('pointerup',end,true);document.addEventListener('pointercancel',end,true);
 // 進入佈置模式時，提示小島擺設也能移動
 new MutationObserver(()=>{const on=document.body.classList.contains('room-edit');document.body.classList.toggle('p32-props',on);if(on&&!st().hinted){st().hinted=1;save();setTimeout(()=>toast('長椅、營火、石頭和大樹也可以直接拖曳移動','info'),900)}}).observe(document.body,{attributes:true,attributeFilter:['class']})}

(window.P32Init=window.P32Init||[]).push(init);
})();
