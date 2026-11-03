/* ===== 3.3 畫質與效能模式：高畫質／平衡／省電／自訂 =====
   Real, live-applied render budgets (no reload, auto-saved in Cfg.v.perf):
   • FPS cap for every JS-driven animation (global requestAnimationFrame scheduler)
   • idle throttle: frame rate drops after a while without touches
   • render quality tiers (blur/backdrop filters, SVG rendering hints)
   • shadows, weather layer density, particles, ambient scenery motion
   • character LOD: only the N characters nearest the camera run full secondary motion
   • desktop-pet (Android overlay) update rate
   The simulation itself (needs, relationships, events) is never removed; it runs on
   the same dt, only rendered less often. */
(()=>{'use strict';
const PRESET={
  quality:{fps:60,idleFps:30,render:'high',shadows:true,weather:'full',particles:'full',ambient:true,detail:'high',lod:8,overlayFps:30},
  balanced:{fps:60,idleFps:30,render:'medium',shadows:true,weather:'full',particles:'some',ambient:true,detail:'high',lod:5,overlayFps:30},
  saver:{fps:30,idleFps:15,render:'low',shadows:false,weather:'light',particles:'off',ambient:false,detail:'low',lod:3,overlayFps:20}};
const KEYS=Object.keys(PRESET.quality);
const st=()=>{const v=Cfg.v;if(!v.perf||typeof v.perf!=='object')v.perf={mode:defaultMode(),custom:Object.assign({},PRESET.balanced),meter:false};
  const p=v.perf;if(!PRESET[p.mode]&&p.mode!=='custom')p.mode='balanced';if(!p.custom||typeof p.custom!=='object')p.custom=Object.assign({},PRESET.balanced);
  KEYS.forEach(k=>{if(p.custom[k]===undefined)p.custom[k]=PRESET.balanced[k]});return p};
function defaultMode(){try{const m=navigator.deviceMemory||4,c=navigator.hardwareConcurrency||4;if(m<=2||c<=4&&m<=3)return 'saver'}catch(_){}return 'balanced'}
const cfg=()=>{const p=st();return p.mode==='custom'?p.custom:PRESET[p.mode]};

/* ---------- 1. global frame scheduler ---------- */
const native={raf:window.requestAnimationFrame.bind(window),caf:window.cancelAnimationFrame.bind(window)};
let queue=new Map(),seq=0,pending=0,lastFlush=0,lastInput=performance.now(),cap=60;
const interval=()=>1000/cap;
function pump(t){pending=0;if(!queue.size)return;
  if(cap<58&&t-lastFlush<interval()-2){pending=native.raf(pump);return}
  lastFlush=t;const q=queue;queue=new Map();q.forEach(cb=>{try{cb(t)}catch(e){console.error(e)}});meterTick(t)}
window.requestAnimationFrame=cb=>{const id=++seq;queue.set(id,cb);if(!pending)pending=native.raf(pump);return id};
window.cancelAnimationFrame=id=>{queue.delete(id)};
function updateCap(){const c=cfg(),idle=performance.now()-lastInput>45000;const n=idle?Math.min(c.idleFps,c.fps):c.fps;if(n!==cap){cap=n;document.documentElement.dataset.pfps=n}}
['pointerdown','keydown','wheel','touchstart'].forEach(e=>addEventListener(e,()=>{lastInput=performance.now();if(cap!==cfg().fps)updateCap()},{passive:true,capture:true}));
setInterval(updateCap,5000);

/* Keep simulation speed real-time at low frame rates: the legacy Ticker clamps dt to
   50 ms, so at 15–30 fps characters would move in slow motion. Sub-step instead. */
if(typeof Ticker!=='undefined'){Ticker.loop=function(t){const T=Ticker;T.raf=0;let dt=Math.min(.15,Math.max(0,(t-T.last)/1000));T.last=t;
  while(dt>1e-4){const s=Math.min(.05,dt);T.set.forEach(x=>x.update(s));dt-=s}
  if(T.set.size&&!document.hidden)T.raf=requestAnimationFrame(T.loop)}}

/* ---------- 2. FPS meter (for verifying modes) ---------- */
let mEl=null,mFrames=0,mT=0;
function meterTick(t){if(!mEl)return;mFrames++;if(t-mT>=1000){mEl.textContent=`${Math.round(mFrames*1000/(t-mT))} fps・上限 ${cap}`;mFrames=0;mT=t}}
function meter(on){if(on&&!mEl){mEl=document.createElement('div');mEl.className='perf-meter';document.body.append(mEl);mT=performance.now();const keep=()=>{if(!mEl)return;requestAnimationFrame(keep)};keep()}
  if(!on&&mEl){mEl.remove();mEl=null}}

/* ---------- 3. CSS budgets ---------- */
function applyCss(){const c=cfg(),r=document.documentElement.dataset;
  r.prender=c.render;r.pshadow=c.shadows?'on':'off';r.pwx=c.weather;r.pfx=c.particles;r.pamb=c.ambient?'on':'off';r.pdetail=c.detail;r.pmode=st().mode}

/* ---------- 4. character LOD: farthest actors pause secondary CSS motion ---------- */
function lod(){if(document.hidden||typeof Nav!=='undefined'&&Nav.cur!==0)return;const n=cfg().lod,root=document.getElementById('homeStage');if(!root)return;
  const acts=[...root.querySelectorAll('.actor')];if(!acts.length)return;const W=innerWidth/2,H=innerHeight/2;
  const d=acts.map(a=>{const b=a.getBoundingClientRect();return[a,Math.hypot(b.left+b.width/2-W,b.top+b.height/2-H)+(b.right<0||b.left>innerWidth||b.bottom<0||b.top>innerHeight?1e5:0)]}).sort((x,y)=>x[1]-y[1]);
  d.forEach(([a,_],i)=>{const off=i>=n;if(a.classList.contains('p-lod')!==off)a.classList.toggle('p-lod',off)})}
setInterval(lod,1200);

/* ---------- apply / persist ---------- */
function apply(){updateCap();applyCss();meter(!!st().meter);try{window.OCSNative?.save&&window.OCSNative.settings&&window.OCSNative.available()&&window.OCSNative.save()}catch(_){}}
function set(mode){const p=st();p.mode=mode;Cfg.save();apply()}
function setCustom(k,v){const p=st();if(p.mode!=='custom'){p.custom=Object.assign({},cfg());p.mode='custom'}p.custom[k]=v;Cfg.save();apply()}

/* ---------- settings UI ---------- */
const MODES=[{v:'quality',t:'高畫質'},{v:'balanced',t:'平衡'},{v:'saver',t:'省電'},{v:'custom',t:'自訂'}];
const DESC={quality:'完整光影、環境動態與粒子，60 FPS，適合效能較好的手機',balanced:'畫質與耗電取得平衡，一般手機的建議選項',saver:'30 FPS、精簡特效與背景動態，降低耗電與發熱',custom:'自行調整下列項目'};
function section(body){const old=body.querySelector('#perfSec');if(old)old.remove();
  const wrap=el('<div id="perfSec"></div>'),sec=el('<div class="sec">畫質與效能</div>'),g=el('<div class="group"></div>');wrap.append(sec,g);
  const p=st(),c=cfg();
  const colRow=(icon,title,desc,ctrl)=>{const r=el(`<div class="row col"><div class="rh"><span class="r-ic">${ic(icon)}</span><div class="r-t"><b>${title}</b><small>${desc}</small></div></div></div>`);r.append(ctrl);return r};
  const modeRow=colRow('sparkle','效能模式',DESC[p.mode],mkSeg(MODES,p.mode,v=>{set(v);rebuild()}));
  const opt=(icon,title,desc,items,k)=>colRow(icon,title,desc,mkSeg(items.map(([v,t])=>({v:String(v),t})),String(c[k]),v=>{setCustom(k,/^\d+$/.test(v)?+v:v==='true'?true:v==='false'?false:v);rebuild()}));
  g.append(modeRow,
    opt('film','FPS 上限','角色與場景動畫的更新頻率',[[30,'30'],[45,'45'],[60,'60']],'fps'),
    opt('moon','閒置時 FPS','一段時間沒操作時自動降低',[[15,'15'],[30,'30'],[60,'不降']],'idleFps'),
    opt('image','渲染品質','模糊玻璃、濾鏡與向量平滑',[['low','低'],['medium','中'],['high','高']],'render'),
    opt('layers','陰影','角色與物件的柔和陰影',[[false,'關'],[true,'開']],'shadows'),
    opt('drop','天氣特效','雨、雪與光線效果的密度',[['light','精簡'],['full','完整']],'weather'),
    opt('star','粒子效果','花瓣、螢火蟲、閃光等',[['off','關'],['some','適量'],['full','完整']],'particles'),
    opt('leaf','環境動畫','雲、樹、水面等背景動態',[[false,'關'],[true,'開']],'ambient'),
    opt('smile','角色動畫細節','耳朵、尾巴等次級動作（呼吸與眨眼一律保留）',[['low','精簡'],['high','完整']],'detail'),
    opt('users','完整動畫角色數','離鏡頭較遠的角色改用精簡動畫',[[3,'3'],[5,'5'],[8,'8']],'lod'),
    opt('layers','桌面夥伴更新率','Android 懸浮桌寵的移動更新頻率',[[15,'15'],[20,'20'],[30,'30']],'overlayFps'),
    switchRow('info','顯示 FPS','在畫面角落顯示實際更新頻率',()=>!!st().meter,v=>{st().meter=v;Cfg.save();apply()}));
  const data=[...body.querySelectorAll('.sec')].find(s=>s.textContent.trim()==='資料');data?body.insertBefore(wrap,data):body.append(wrap);
  function rebuild(){const sc=document.getElementById('setScroll'),y=sc?.scrollTop;section(body);if(sc)sc.scrollTop=y}}

window.OCSPerf={cfg,set,setCustom,state:st,apply,PRESET,get cap(){return cap}};
const t=setInterval(()=>{if(typeof Settings==='undefined'||!Settings.body||typeof Cfg==='undefined')return;clearInterval(t);
  apply();const mk=Settings.make;Settings.make=function(){mk.apply(this,arguments);try{section(this.body)}catch(e){console.error('[perf]',e)}};section(Settings.body)},100);
})();
