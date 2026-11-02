'use strict';
/* ==========================================================
   工具
   ========================================================== */
const VERSION='2.5I';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const el=h=>{const t=document.createElement('template');t.innerHTML=h.trim();return t.content.firstElementChild};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hex2rgb=h=>{h=h.replace('#','');return[0,2,4].map(i=>parseInt(h.substr(i,2),16))};
const rgb2hex=a=>'#'+a.map(v=>Math.round(clamp(v,0,255)).toString(16).padStart(2,'0')).join('');
const mix=(a,b,t)=>{const x=hex2rgb(a),y=hex2rgb(b);return rgb2hex(x.map((v,i)=>v+(y[i]-v)*t))};
const layer=$('#layer');

/* ---------- 圖示（24px 格線，統一 1.8 線寬） ---------- */
const IC={
home:'<path d="M4 11.2 12 4l8 7.2V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.2a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5.2H5.5A1.5 1.5 0 0 1 4 19z"/>',
users:'<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19.5c.6-3 3-4.8 5.5-4.8s4.9 1.8 5.5 4.8M16 5.2a3 3 0 0 1 0 5.6M17.5 14.9c1.7.5 2.9 2 3.2 4.1"/>',
palette:'<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.2 0 1.8-.8 1.8-1.7 0-1.3-1-1.7-1-2.9 0-1 .8-1.7 1.8-1.7H17a3.5 3.5 0 0 0 3.5-3.5C20.5 7 16.8 3.5 12 3.5z"/><path d="M7.8 11.2h.01M10 7.6h.01M14.4 7.6h.01"/>',
compass:'<circle cx="12" cy="12" r="8.5"/><path d="m15.2 8.8-1.6 4.8-4.8 1.6 1.6-4.8z"/>',
sliders:'<path d="M4 7h8M18 7h2M4 17h2M12 17h8"/><circle cx="15" cy="7" r="2.4"/><circle cx="9" cy="17" r="2.4"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
heart:'<path d="M12 19.5s-7-4.3-7-9.7A4 4 0 0 1 12 7.6a4 4 0 0 1 7 2.2c0 5.4-7 9.7-7 9.7z"/>',
moon:'<path d="M19.5 14.2A7.8 7.8 0 0 1 9.8 4.5a7.8 7.8 0 1 0 9.7 9.7z"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
monitor:'<rect x="3.5" y="5" width="17" height="11.5" rx="2.5"/><path d="M9 20h6M12 16.5V20"/>',
up:'<path d="M12 19V6M7 10.5l5-5 5 5"/>',
locate:'<circle cx="12" cy="12" r="3.2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',
check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
right:'<path d="M9.5 6l6 6-6 6"/>',left:'<path d="M14.5 6l-6 6 6 6"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',
upload:'<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3"/>',
trash:'<path d="M5 7h14M10 7V4.8h4V7M7 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h5.4a1.5 1.5 0 0 0 1.5-1.4L17 7M10 11v6M14 11v6"/>',
seed:'<path d="M12 20v-8M12 12c0-3.5-2.3-5.5-6-5.5 0 3.5 2.3 5.5 6 5.5zM12 14.5c0-3 2-5 5.5-5 0 3-2 5-5.5 5z"/>',
cal:'<rect x="4" y="5.5" width="16" height="14.5" rx="3"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
book:'<path d="M5 5.5v13.8A1.7 1.7 0 0 1 6.7 17.6H19V4H6.5A1.5 1.5 0 0 0 5 5.5zM5 19.3A1.7 1.7 0 0 0 6.7 21H19v-3.4"/>',
flag:'<path d="M6 20.5V4.5M6 5h11l-2 4 2 4H6"/>',
bag:'<path d="M6 8h12l-1 11.5H7zM9 8V7a3 3 0 0 1 6 0v1"/>',
pad:'<rect x="3" y="7.5" width="18" height="10" rx="5"/><path d="M8 10.5v4M6 12.5h4M15.5 11.6h.01M17.5 13.4h.01"/>',
shirt:'<path d="M8.5 4 4 6.5l1.8 4 2.2-1V20h8V9.5l2.2 1 1.8-4L15.5 4a3.5 3.5 0 0 1-7 0z"/>',
layers:'<path d="M12 4 3.5 8.5 12 13l8.5-4.5zM3.5 12.5 12 17l8.5-4.5M3.5 16 12 20.5l8.5-4.5"/>',
bell:'<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0"/>',
grid:'<rect x="4" y="4" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2"/>',
film:'<rect x="3.5" y="5" width="17" height="14" rx="3"/><path d="m10 9.5 5 2.5-5 2.5z"/>',
smile:'<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14c1 1.5 2.3 2.2 3.5 2.2s2.5-.7 3.5-2.2M9 10h.01M15 10h.01"/>',
mic:'<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5"/>',
chat:'<path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-4 3.5V15A2.5 2.5 0 0 1 5 12.5z"/>',
route:'<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H16"/>',
info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
reset:'<path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5L4.5 8.8M4.5 4.5v4.3h4.3"/>',
sparkle:'<path d="M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8z"/>',
db:'<ellipse cx="12" cy="6" rx="7" ry="2.8"/><path d="M5 6v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6M5 12v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-6"/>',
plug:'<path d="M9 3.5v5M15 3.5v5M6.5 8.5h11v3.5a5.5 5.5 0 0 1-11 0zM12 17.5v3"/>',
map:'<path d="M9 5 4 7v12l5-2 6 2 5-2V5l-5 2zM9 5v12M15 7v12"/>',
bag:'<rect x="4" y="8" width="16" height="12" rx="3.2"/><path d="M9 8V6.6A1.6 1.6 0 0 1 10.6 5h2.8A1.6 1.6 0 0 1 15 6.6V8M4 13.2h16"/>',
quest:'<rect x="5" y="4.5" width="14" height="16" rx="3.2"/><path d="M9 4.5V3M15 4.5V3M9 12.2l2.2 2.2 4.3-4.4"/>',
camera:'<path d="M4 9.2A2.2 2.2 0 0 1 6.2 7H7.6l1.2-2h6.4l1.2 2h1.4A2.2 2.2 0 0 1 20 9.2v8.6a2.2 2.2 0 0 1-2.2 2.2H6.2A2.2 2.2 0 0 1 4 17.8z"/><circle cx="12" cy="13.4" r="3.4"/>',
hand:'<path d="M8 12.5V6.8a1.3 1.3 0 0 1 2.6 0V11M10.6 11V5.2a1.3 1.3 0 0 1 2.6 0V11M13.2 11V6.2a1.3 1.3 0 0 1 2.6 0V13M15.8 9.8a1.3 1.3 0 0 1 2.6 0V14a6 6 0 0 1-6 6h-.6a6 6 0 0 1-5-2.7L4.6 14.4c-.5-.9.6-1.9 1.5-1.2L8 14.4"/>',
drop:'<path d="M12 4c3.6 4 6 6.8 6 10a6 6 0 0 1-12 0c0-3.2 2.4-6 6-10z"/><path d="M9.2 14.6a3 3 0 0 0 2.2 2.6"/>',
store:'<path d="M4.5 9.5 6 5h12l1.5 4.5M4.5 9.5V19h15V9.5M4.5 9.5c0 1.8 1.6 2.4 2.7 2.4s2.4-.6 2.4-2.4c0 1.8 1.1 2.4 2.4 2.4s2.7-.6 2.7-2.4c0 1.8 1.1 2.4 2.7 2.4M10 19v-4.5h4V19"/>',
more:'<circle cx="8" cy="8" r="1.6"/><circle cx="16" cy="8" r="1.6"/><circle cx="8" cy="16" r="1.6"/><circle cx="16" cy="16" r="1.6"/>',
scroll:'<path d="M7 4.5h10a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6M9.5 9h6M9.5 12.5h6M9.5 16h3.5"/>'
};
const ic=(n,s)=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"${s?` style="width:${s}px;height:${s}px"`:''}>${IC[n]||''}</svg>`;
Object.assign(IC,{star:'<path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.6 9.7l5.8-.8z"/>',starf:'<path fill="currentColor" d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.6 9.7l5.8-.8z"/>',
utensils:'<path d="M7 3v7a2 2 0 0 0 2 2v9M11 3v7a2 2 0 0 1-2 2M17 21V3c-2 1.5-3 4-3 7 0 1.5 1 2.5 3 3"/>',cup:'<path d="M5 8h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5v2M12 3.5v2"/>',
tag:'<path d="M3.5 12.2V4.5h7.7l9.3 9.3-7.7 7.7zM8 8.2h.01"/>',pen:'<path d="M4 20l1-4.2L16.5 4.3a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 1 0 2.8L8.2 19zM14.5 6.3l3.2 3.2"/>',
eraser:'<path d="M8.5 19.5H20M4.6 14.4l9.2-9.2a2 2 0 0 1 2.8 0l3.2 3.2a2 2 0 0 1 0 2.8l-8 8H8.5l-3.9-3.9a2 2 0 0 1 0-2.9z"/>',
bucket:'<path d="m5 11 7-7 7 7-7 7zM5 11h14M20 15.5c1 1.4 1.5 2.3 1.5 3a1.5 1.5 0 0 1-3 0c0-.7.5-1.6 1.5-3z"/>',
pick:'<path d="m15 5 4 4M17 3.5a2.1 2.1 0 0 1 3 3L10 16.5l-4.5 1.5L7 13.5z"/>',eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
eyeoff:'<path d="M3 3l18 18M10 6a9 9 0 0 1 2-.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-3 3.7M6.3 7.7A15 15 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 3.7-.8"/>',
undo:'<path d="M9 7 4.5 11.5 9 16M4.5 11.5H14.5a5 5 0 0 1 0 10H11"/>',redo:'<path d="m15 7 4.5 4.5L15 16M19.5 11.5H9.5a5 5 0 0 0 0 10H13"/>',
download:'<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>',down:'<path d="M12 5v14M6 13l6 6 6-6"/>',image:'<rect x="3.5" y="5" width="17" height="14" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="m4 17 5-4.5 3.5 3 3-2.5 5 4"/>',
tool:'<rect x="3.5" y="8" width="17" height="11.5" rx="3"/><path d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8M3.5 13h17M11 13v2h2v-2"/>',
chair:'<path d="M7 3.5h8a1 1 0 0 1 1 1V12H6V4.5a1 1 0 0 1 1-1zM5 12h12v3H5zM7 15v5.5M15 15v5.5"/>',ban:'<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>',
help:'<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.4 2.4 0 1 1 3.4 2.2c-.7.4-1 .9-1 1.6M12 16.6h.01"/>',flame:'<path d="M12 3c1 3.5 5.5 5.5 5.5 10.2A5.5 5.5 0 0 1 12 19a5.5 5.5 0 0 1-5.5-5.8c0-2 1-3.3 2-4.4.3 1.2 1 1.8 1.8 2C10.2 8 10.6 5.4 12 3z"/>',
leaf:'<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14zM5 19c2.5-4 5-6.5 8-8.5"/>',frown:'<circle cx="12" cy="12" r="8.5"/><path d="M8.8 16c1-1.3 2.1-1.9 3.2-1.9s2.2.6 3.2 1.9M9 10h.01M15 10h.01"/>',
meh:'<circle cx="12" cy="12" r="8.5"/><path d="M9 15h6M9 10h.01M15 10h.01"/>',note:'<path d="M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM19 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>',
gift:'<rect x="4" y="10" width="16" height="10" rx="2.5"/><path d="M12 10v10M3.5 10h17M12 10C9.5 9.8 8 8.6 8 7a2 2 0 0 1 4 0 2 2 0 0 1 4 0c0 1.600-1.500 2.800-4 3z"/>',
toy:'<circle cx="12" cy="12" r="8.5"/><path d="M3.8 10c5 1 11 1 16.4 0M3.8 14c5-1 11-1 16.4 0"/>',line:'<path d="M5 19 19 5"/>',rect:'<rect x="4.5" y="6.5" width="15" height="11" rx="2"/>',
oval:'<ellipse cx="12" cy="12" rx="8" ry="6"/>',marquee:'<rect x="4.5" y="4.5" width="15" height="15" rx="2" stroke-dasharray="3 3"/>',pause:'<path d="M8.5 6v12M15.5 6v12"/>'});
const HEART='<svg viewBox="0 0 24 24"><path d="M12 20.5s-8-4.9-8-11A4.6 4.6 0 0 1 12 6.9a4.6 4.6 0 0 1 8 2.6c0 6.1-8 11-8 11z" fill="currentColor"/></svg>';
function fillIcons(root=document){$$('[data-ic]',root).forEach(n=>{n.innerHTML=ic(n.dataset.ic)})}

/* ==========================================================
   設定儲存、主題、觸覺、Toast
   ========================================================== */
const defaults=()=>({theme:'system',motion:'system',size:100,activity:'normal',auto:true,bubbles:true,haptics:true,active:'mochi',overrides:{},order:[],dataVer:2});
const Cfg={v:defaults(),
  load(){try{Object.assign(this.v,JSON.parse(localStorage.getItem('ocs.v1')||'{}'))}catch(e){}},
  save(){clearTimeout(this.t);this.t=setTimeout(()=>{try{localStorage.setItem('ocs.v1',JSON.stringify(this.v))}catch(e){}},180)},
  set(k,val){this.v[k]=val;this.save()},
  flush(){clearTimeout(this.t);try{localStorage.setItem('ocs.v1',JSON.stringify(this.v))}catch(e){}}};
const buzz=ms=>{if(Cfg.v.haptics&&navigator.vibrate)try{navigator.vibrate(ms)}catch(e){}};
const Theme={
  mq:matchMedia('(prefers-color-scheme: dark)'),rm:matchMedia('(prefers-reduced-motion: reduce)'),
  resolve(){const t=Cfg.v.theme;return t==='system'?(this.mq.matches?'dark':'light'):t},
  syncChrome(d=document.documentElement.dataset.theme){const meta=$('meta[name=theme-color]'),color=d==='dark'?'#202C38':'#F4F2EC';if(meta&&meta.content!==color)meta.content=color},
  apply(){const d=this.resolve(),r=document.documentElement;r.dataset.theme=d;this.syncChrome(d);
    const m=Cfg.v.motion;r.dataset.motion=(m==='reduce'||(m==='system'&&this.rm.matches))?'reduce':'full'},
  set(t,ev){Cfg.set('theme',t);this.syncChrome(this.resolve());const r=document.documentElement,same=this.resolve()===r.dataset.theme;
    if(same||!document.startViewTransition||r.dataset.motion==='reduce'){this.apply();return}
    const x=ev&&ev.clientX!=null?ev.clientX:innerWidth/2,y=ev&&ev.clientY!=null?ev.clientY:innerHeight/2;
    const rad=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
    const vt=document.startViewTransition(()=>this.apply());
    vt.ready.then(()=>{r.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${rad}px at ${x}px ${y}px)`]},{duration:640,easing:'cubic-bezier(.22,1,.36,1)',pseudoElement:'::view-transition-new(root)'})}).catch(()=>{})}
};
let toastEl=null,toastT=0;
function toast(msg,icon='check'){
  if(toastEl){toastEl.remove()}
  const t=toastEl=el(`<div class="toast glass" role="status">${ic(icon)}<span>${esc(msg)}</span></div>`);
  $('#app').append(t);positionToast();void t.offsetWidth;t.classList.add('show');clearTimeout(toastT);
  toastT=setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),450)},2300)}

function positionToast(){
 const t=toastEl,app=$('#app');if(!t?.isConnected||!app)return;
 const ar=app.getBoundingClientRect(),W=ar.width,H=ar.height,pad=12;
 t.style.maxWidth=Math.min(400,W-pad*2)+'px';
 const menu=$('#hudRail.open .rail-ext');
 const rect=n=>{const r=n.getBoundingClientRect();if(n!==menu)return r;
   const rail=$('#hudRail').getBoundingClientRect(),padding=parseFloat(getComputedStyle(n).paddingTop)||0,cap=W>H&&H<=520?Math.max(60,H-122):innerHeight<=560?innerHeight-84:Math.min(innerHeight*.72,500);
   return new DOMRect(r.right-n.offsetWidth,rail.top+n.offsetTop,n.offsetWidth,Math.min(n.scrollHeight+Math.max(0,24-padding*2),cap));
 };
 const mr=menu?rect(menu):null,nav=$('#nav').getBoundingClientRect();
 let x=W/2,y=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sat'))+124||124;
 if(mr&&mr.height>0){
   const below=mr.bottom-ar.top+12;
   if(below+t.offsetHeight+10<=nav.top-ar.top)y=below;
   else if(mr.left-ar.left>144){t.style.maxWidth=Math.min(400,mr.left-ar.left-pad*2)+'px';x=(mr.left-ar.left)/2;y=Math.max(76,ar.top+12)}
 }
 const w=t.offsetWidth,h=t.offsetHeight;
 const blockers=[...document.querySelectorAll('#homeChip,#hudCap,#hudRail>.rail-btn,#hudRail.open .rail-ext,#fab .qa-row,#fab.open .qa-more,#qbag,#camFollow,#questCard:not(.done),#nav,#edTop,#edBar,.ev-hud,#layer>.sheet.open')].filter(n=>{
   const cs=getComputedStyle(n);return !n.closest('[inert]')&&cs.visibility!=='hidden'&&+cs.opacity>.01&&n.getClientRects().length;
 }).map(n=>({r:rect(n),menu:n===menu}));
 const xs=[x,W/2,pad+w/2,W-pad-w/2],ys=[y,76,nav.top-ar.top-h-12,...blockers.flatMap(b=>[b.r.bottom-ar.top+12,b.r.top-ar.top-h-12])];
 let best=null;
 for(let cy of ys)for(let cx of xs){
   cx=clamp(cx,pad+w/2,W-pad-w/2);cy=clamp(cy,pad,Math.max(pad,H-h-pad));
   let overlap=0;for(const b of blockers){const r=b.r,ix=Math.max(0,Math.min(cx+w/2,r.right-ar.left+5)-Math.max(cx-w/2,r.left-ar.left-5)),iy=Math.max(0,Math.min(cy+h,r.bottom-ar.top+5)-Math.max(cy,r.top-ar.top-5));overlap+=ix*iy*(b.menu?20:1)}
   const score=overlap*100+Math.abs(cy-y)+Math.abs(cx-x)*.2;
   if(!best||score<best.score)best={x:cx,y:cy,score};
 }
 if(best){t.style.left=best.x+'px';t.style.top=best.y+'px';t.style.bottom='auto'}
}

/* ==========================================================
   儲存：IndexedDB（匯入角色）
   ========================================================== */
const DB={db:null,mem:[],amem:[],bad:false,
  open(){if(this.db)return Promise.resolve(this.db);
    return new Promise((res,rej)=>{try{const r=indexedDB.open('oc-shimeji',2);
      r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains('chars'))d.createObjectStore('chars',{keyPath:'id'});if(!d.objectStoreNames.contains('assets'))d.createObjectStore('assets',{keyPath:'id'})};
      r.onsuccess=()=>{this.db=r.result;this.db.onversionchange=()=>{try{this.db.close()}catch(e){}this.db=null};res(this.db)};r.onerror=()=>rej(r.error);r.onblocked=()=>rej(new Error('blocked'))}catch(e){rej(e)}})},
  async tx(mode,fn,store='chars'){const db=await this.open();return new Promise((res,rej)=>{const t=db.transaction(store,mode),s=t.objectStore(store);const q=fn(s);t.oncomplete=()=>res(q&&q.result);t.onerror=()=>rej(t.error);t.onabort=()=>rej(t.error)})},
  async all(){try{return await this.tx('readonly',s=>s.getAll())||[]}catch(e){this.bad=true;return this.mem}},
  async put(rec){if(this.bad){const i=this.mem.findIndex(r=>r.id===rec.id);i>=0?this.mem[i]=rec:this.mem.push(rec);return}try{await this.tx('readwrite',s=>s.put(rec))}catch(e){this.bad=true;this.mem.push(rec)}},
  async del(id){if(this.bad){this.mem=this.mem.filter(r=>r.id!==id);return}try{await this.tx('readwrite',s=>s.delete(id))}catch(e){}},
  async allAssets(){if(this.bad)return this.amem;try{return await this.tx('readonly',s=>s.getAll(),'assets')||[]}catch(e){return this.amem}},
  async assetsOf(cid){return(await this.allAssets()).filter(a=>a.charId===cid)},
  async putAsset(r){if(this.bad){this.amem=this.amem.filter(x=>x.id!==r.id);this.amem.push(r);return}try{await this.tx('readwrite',s=>s.put(r),'assets')}catch(e){this.amem=this.amem.filter(x=>x.id!==r.id);this.amem.push(r)}},
  async delAsset(id){this.amem=this.amem.filter(x=>x.id!==id);if(this.bad)return;try{await this.tx('readwrite',s=>s.delete(id),'assets')}catch(e){}},
  async clear(){this.mem=[];this.amem=[];try{await this.tx('readwrite',s=>s.clear());await this.tx('readwrite',s=>s.clear(),'assets')}catch(e){}}};

/* ==========================================================
   角色資料
   ========================================================== */
const LINES={
  idle:['嗨，我在這裡！','今天也一起加油吧。','你好呀。','有點想散步了。','嘿嘿。','要不要一起發呆一下？'],
  pet:['好舒服～','再摸一下下…','嘿嘿，謝謝你。','今天心情很好喔！','最喜歡你了。'],
  wake:['哇！嚇我一跳！','嗯…？已經早上了嗎。','咦，你回來啦。'],
  drop:['哇啊——！','好高好高！','放我下來啦～','咚！']
};
/* 2.4G · 三隻貓咪：星夢／葉風／暖眠，參照使用者提供的設定圖重繪 */
const DEMOS=[
 {id:'mochi',name:'Starlet 星夢',sub:'閃亮亮的奶油星夢貓',look:{body:'#F6E9E9',accent:'#B8A5DC',ears:'upright',head:'wide',eye:'droop',brow:'none',cheekStyle:'blush',mouth:'caret',pattern:'none',acc:'starlet',tail:'fluffy',tailSide:'left',cheeks:34,eyeSize:108,eyeSpace:100,earSize:106,headSize:103,eyeY:0,mouthY:0},lines:{idle:['今天星星也在閃閃發光耶。','唔……想蒐集漂亮的夢。','陪我一起看星星嘛！'],pet:['嘿嘿，星光都變得暖暖的。','再摸一下下好不好？'],wake:['嗯？我剛剛夢到流星！'],drop:['哇——星星都在轉圈圈！']}},
 {id:'yuzu',name:'Leafy 葉風',sub:'總是帶著小花的森林貓',look:{body:'#F4E6D6',accent:'#A6B88E',ears:'upright',head:'wide',eye:'smile',brow:'none',cheekStyle:'blush',mouth:'caret',pattern:'none',acc:'leafy',tail:'fluffy',tailSide:'right',cheeks:54,eyeSize:111,eyeSpace:100,earSize:99,headSize:103,eyeY:0,mouthY:0},lines:{idle:['葉子在跟我說悄悄話。','聽……今天的風很輕。','想出去找一朵小花嗎？'],pet:['呼嚕嚕……好像春天喔。','小花也喜歡你！'],wake:['咦？森林已經醒來了嗎？'],drop:['呼……像葉子一樣落地。']}},
 {id:'sora',name:'Snoozy 暖眠',sub:'喜歡窩著打盹的藍紫貓',look:{body:'#BDC8E6',accent:'#C6AFCF',ears:'upright',head:'wide',eye:'sleepy',brow:'none',cheekStyle:'none',mouth:'caret',pattern:'none',acc:'snoozy',tail:'fluffy',tailSide:'right',cheeks:22,eyeSize:103,eyeSpace:100,earSize:105,headSize:103,eyeY:0,mouthY:0},lines:{idle:['嗯……再窩五分鐘就好。','這裡好暖和喔……','你有沒有聽見雲朵在打呼？'],pet:['唔……暖暖的，好安心。','就這樣摸著我吧……'],wake:['啊……再睡一下下……'],drop:['慢一點……我還在作夢呢。']}}
];
const SWATCH=['#F6E8E7','#E5DBC2','#B7C1E1','#F8E7D3','#E8B9BB','#C7B8DE','#BDCFB4','#D6D1CE'];
const CAT_OPT={
 head:[['pebble','鵝卵石'],['puff','雲朵圓'],['tall','小方臉'],['wide','寬臉頰']],
 ears:[['upright','直立耳'],['soft','柔軟耳'],['wide','外張耳'],['tuft','小毛尖']],
 eye:[['bean','豆豆眼'],['round','圓眼'],['sleepy','慵懶眼'],['spark','亮晶晶'],['droop','柔柔垂眼'],['smile','笑彎眼']],
 brow:[['none','自然'],['flat','平直'],['soft','柔弧'],['arched','挑眉'],['sad','八字眉']],
 cheekStyle:[['blush','淡腮紅'],['stripes','害羞線'],['heart','愛心'],['spark','閃光'],['paw','貓掌'],['none','無']],
 mouth:[['w','小貓嘴'],['smile','微笑'],['tiny','小點嘴'],['caret','小三角嘴'],['open','小驚訝']],
 pattern:[['none','純色'],['cap','額頂色塊'],['mask','面罩'],['patch','單側斑'],['tabby','虎斑'],['calico','三花'],['socks','白手套']],
 tail:[['curl','捲尾'],['straight','長尾'],['fluffy','蓬鬆尾']],
 tailSide:[['left','左側'],['right','右側']],
 smallAcc:[['none','不佩戴'],['collar','頸圈'],['bandana','領巾'],['bell','鈴鐺'],['leaf','小葉芽'],['glasses','眼鏡'],['crescent','月牙'],['kerchief','頭巾'],['flower','花朵'],['ribbon','蝴蝶結'],['crown','小皇冠'],['pom','毛球帽'],['satchel','側背包']],
 acc:[['none','無裝飾'],['collar','頸圈'],['bandana','領巾'],['bell','鈴鐺'],['leaf','小葉子'],['glasses','圓眼鏡'],['crescent','月牙'],['kerchief','頭巾'],['flower','小花'],['ribbon','蝴蝶結'],['crown','小皇冠'],['pom','毛球帽'],['satchel','小包包'],['starlet','星夢披肩'],['leafy','花葉斗篷'],['snoozy','暖眠圍巾']]
};
const CAT_BASE={smallAcc:'none',accX:0,accY:0,accScale:100,accRot:0,ears:'upright',head:'wide',eye:'droop',brow:'none',cheekStyle:'blush',mouth:'caret',pattern:'none',tail:'curl',tailSide:'right',acc:'none',body:'#F4E8D7',accent:'#C9A9A1',cheeks:35,eyeSize:100,eyeSpace:100,earSize:100,headSize:100,eyeY:2,mouthY:0};
const CAT_RANGES={accX:[-94,94],accY:[-80,75],accScale:[65,170],accRot:[-80,80],cheeks:[0,100],eyeSize:[70,140],eyeSpace:[75,125],earSize:[78,128],headSize:[85,115],eyeY:[-6,10],mouthY:[-5,9]};
const CAT_COLOR=v=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v);
const CAT_NORM=l=>{l=l&&typeof l==='object'?l:{};const o={...CAT_BASE};Object.keys(CAT_OPT).forEach(k=>{let v=l[k];if(k==='ears'){v=({pointy:'upright',round:'soft',long:'wide'})[v]||v}if(k==='acc'){v=({sprout:'leaf',star:'crescent',scarf:'bandana'})[v]||v}if(CAT_OPT[k].some(x=>x[0]===v))o[k]=v});for(const k of ['body','accent'])if(CAT_COLOR(l[k]))o[k]=l[k];for(const [k,[mn,mx]] of Object.entries(CAT_RANGES))if(Number.isFinite(+l[k])&&l[k]!==null&&l[k]!==undefined&&l[k]!=='')o[k]=Math.max(mn,Math.min(mx,Math.round(+l[k])));return o};
const CAT_RAND=()=>{const a=pick(SWATCH),b=pick(['#D38E89','#C7B7D8','#9DA9C5','#8FAE97','#D2B282']);return CAT_NORM({body:a,accent:b,...Object.fromEntries(Object.entries(CAT_OPT).map(([k,v])=>[k,pick(v)[0]])),eyeSize:90+Math.floor(Math.random()*30),eyeSpace:90+Math.floor(Math.random()*20),cheeks:20+Math.floor(Math.random()*50),eyeY:Math.round(Math.random()*8),mouthY:0})};
const Chars={list:[],urls:{},aurls:{},pend:new Set(),
  normLook(l){return CAT_NORM(l)},
  randLook(){return CAT_RAND()},
  subOf(ch){const d=ch.data;if(d.tagline)return d.tagline;if(ch.kind==='demo')return ch.baseSub;const p=[d.species,d.gender].filter(Boolean).join('・');return p||(ch.url?`匯入角色・${ch.w}×${ch.h}`:'原創角色')},
  demo(d){const o=Cfg.v.overrides[d.id]||{};
    const look=this.normLook(Object.assign({},d.look,o.look,{body:((o.look||{}).body)||o.body||d.look.body}));
    const ch={id:d.id,uid:d.id,kind:'demo',name:o.name??d.name,baseSub:d.sub,sub:d.sub,look,ears:look.ears,acc:look.acc,body:look.body,scale:o.scale??1,ox:o.ox??0,oy:o.oy??0,facing:'right',lines:d.lines,assets:{},data:Persona.norm(Object.assign({},DEMO_DATA[d.id],o.data,{species:'貓咪'}))};
    return Persona.refresh(ch)},
  aurl(a){return this.aurls[a.id]||(this.aurls[a.id]=URL.createObjectURL(a.blob))},
  custom(r,assets){const url=r.blob?(this.urls[r.id]||(this.urls[r.id]=URL.createObjectURL(r.blob))):null,look=this.normLook(r.look);
    const ch={id:r.id,uid:r.uid||r.id,kind:'custom',name:r.name,sub:'',scale:r.scale??1,ox:r.ox??0,oy:r.oy??0,facing:r.facing||'right',w:r.w,h:r.h,url,created:r.created,rec:r,look,ears:look.ears,acc:look.acc,body:look.body,assets:{},data:Persona.norm(r.data)};
    (assets||[]).forEach(a=>{ch.assets[a.slot]={blob:a.blob,w:a.w,h:a.h,url:this.aurl(a)}});
    return Persona.refresh(ch)},
  probe(blob){return new Promise((res,rej)=>{const u=URL.createObjectURL(blob),i=new Image();i.onload=()=>{URL.revokeObjectURL(u);res({w:i.naturalWidth||1,h:i.naturalHeight||1})};i.onerror=()=>{URL.revokeObjectURL(u);rej(new Error('img'))};i.src=u})},
  async load(){
    try{const raw=localStorage.getItem('ocs.v1');if(raw&&!localStorage.getItem('ocs.v1.pre2')&&!((JSON.parse(raw)||{}).dataVer>=2))localStorage.setItem('ocs.v1.pre2',raw)}catch(e){}
    const recs=(await DB.all()).sort((a,b)=>(a.created||0)-(b.created||0));
    const as=await DB.allAssets(),by={};as.forEach(a=>(by[a.charId]=by[a.charId]||[]).push(a));
    const out=[];
    for(const r of recs){
      if(r.schema!==2){r.schema=2;r.uid=r.uid||r.id;r.data=Persona.norm(r.data);r.look=this.normLook(r.look);r.created=r.created||Date.now();DB.put(r)}
      out.push(this.custom(r,by[r.id]))}
    this.list=[...DEMOS.map(d=>this.demo(d)),...out];this.applyOrder();Cfg.v.dataVer=2;Cfg.save()},
  applyOrder(){const o=Cfg.v.order||[];if(!o.length)return;const ix=id=>{const i=o.indexOf(id);return i<0?1e6:i};
    this.list=this.list.map((c,i)=>[c,i]).sort((a,b)=>ix(a[0].id)-ix(b[0].id)||a[1]-b[1]).map(x=>x[0])},
  saveOrder(){Cfg.set('order',this.list.map(c=>c.id))},
  move(id,to){const i=this.list.findIndex(c=>c.id===id),j=to==='first'?0:i+to;if(i<0||j<0||j>=this.list.length||i===j)return false;const[c]=this.list.splice(i,1);this.list.splice(j,0,c);this.saveOrder();return true},
  byId(id){return this.list.find(c=>c.id===id)},
  active(){return this.byId(Cfg.v.active)||this.list[0]},
  async create(o){const id=uid('c'),rec={id,uid:id,schema:2,name:(o.name||'新夥伴').slice(0,16),data:Persona.norm(o.data),look:this.normLook(o.look),scale:1,ox:0,oy:0,facing:'right',created:Date.now()};
    await DB.put(rec);const ch=this.custom(rec,[]);this.list.push(ch);this.saveOrder();return ch},
  async duplicate(id){const src=this.byId(id),nid=uid('c'),data=Persona.norm(JSON.parse(JSON.stringify(src.data)));
    if(src.kind==='demo')LINE_KINDS.forEach(([k])=>{if(!data.lines[k].length&&src.lines&&src.lines[k])data.lines[k]=src.lines[k].slice(0,40)});
    const rec={id:nid,uid:nid,schema:2,name:(src.name+' 複製').slice(0,16),data,look:Object.assign({},src.look),scale:src.scale,ox:src.ox,oy:src.oy,facing:src.facing,created:Date.now()};
    if(src.kind==='custom'&&src.rec.blob){rec.blob=src.rec.blob;rec.w=src.w;rec.h=src.h}
    await DB.put(rec);const as=[];
    for(const slot in src.assets){const a=src.assets[slot],r={id:nid+':'+slot,charId:nid,slot,blob:a.blob,w:a.w,h:a.h};await DB.putAsset(r);as.push(r)}
    const ch=this.custom(rec,as),i=this.list.findIndex(c=>c.id===id);this.list.splice(i+1,0,ch);this.saveOrder();return ch},
  patch(ch,p){const changedLook=!!p.look;p=Object.assign({},p);
    if(p.look){ch.look=this.normLook(p.look);ch.ears=ch.look.ears;ch.acc=ch.look.acc;ch.body=ch.look.body;delete p.look}
    if(p.body)ch.look=Object.assign({},ch.look,{body:p.body});
    Object.assign(ch,p);
    if(ch.kind==='demo'){const o=Cfg.v.overrides[ch.id]=Cfg.v.overrides[ch.id]||{};['name','body','scale','ox','oy'].forEach(k=>{if(k in p)o[k]=p[k]});if(changedLook||p.body)o.look=Object.assign({},ch.look);if('data' in p)o.data=ch.data;Cfg.save()}
    else{Object.assign(ch.rec,{name:ch.name,scale:ch.scale,ox:ch.ox,oy:ch.oy,facing:ch.facing,data:ch.data,look:ch.look,schema:2});this.pend.add(ch.id);clearTimeout(this.pt);this.pt=setTimeout(()=>this.flush(),350)}},
  async flush(){clearTimeout(this.pt);const ids=[...this.pend];this.pend.clear();
    await Promise.all(ids.map(async id=>{const c=this.byId(id);if(c&&c.rec)await DB.put(c.rec)}));if(Cfg.flush)Cfg.flush()},
  async setMain(ch,img){if(ch.kind!=='custom')return;const rec=ch.rec;
    if(img){rec.blob=img.blob;rec.w=img.w;rec.h=img.h}else{delete rec.blob;delete rec.w;delete rec.h}
    if(this.urls[ch.id]){URL.revokeObjectURL(this.urls[ch.id]);delete this.urls[ch.id]}
    ch.url=rec.blob?(this.urls[ch.id]=URL.createObjectURL(rec.blob)):null;ch.w=rec.w;ch.h=rec.h;Persona.refresh(ch);await DB.put(rec)},
  async setAsset(ch,slot,img){const id=ch.id+':'+slot,old=ch.assets[slot];if(old)URL.revokeObjectURL(old.url);delete this.aurls[id];
    const r={id,charId:ch.id,slot,blob:img.blob,w:img.w,h:img.h};await DB.putAsset(r);ch.assets[slot]={blob:img.blob,w:img.w,h:img.h,url:this.aurl(r)}},
  async delAsset(ch,slot){const a=ch.assets[slot];if(a)URL.revokeObjectURL(a.url);delete this.aurls[ch.id+':'+slot];delete ch.assets[slot];await DB.delAsset(ch.id+':'+slot)},
  async remove(id){const ch=this.byId(id);if(!ch||ch.kind!=='custom')return;this.pend.delete(id);await DB.del(id);
    for(const s in ch.assets){await DB.delAsset(id+':'+s);URL.revokeObjectURL(ch.assets[s].url);delete this.aurls[id+':'+s]}
    if(this.urls[id]){URL.revokeObjectURL(this.urls[id]);delete this.urls[id]}
    this.list=this.list.filter(c=>c.id!==id);this.saveOrder();if(Cfg.v.active===id)Cfg.set('active',this.list[0].id)}
};

/* ==========================================================
   2.4G REFERENCE MATCH · 獨立 SVG low-poly 貓咪骨架
   保持 .head-g / .ear / .arm / .foot / .eye-* / .mouth-* 等動畫掛鉤
   ========================================================== */

const CAT_ACC_ANCHORS={collar:[120,186],bandana:[120,185],bell:[120,186],leaf:[120,58],glasses:[120,143],crescent:[173,94],kerchief:[120,109],flower:[171,88],ribbon:[66,90],crown:[120,80],pom:[120,90],satchel:[165,209]};
const catSmallKind=l=>l&&l.smallAcc&&l.smallAcc!=='none'?l.smallAcc:l&&CAT_ACC_ANCHORS[l.acc]?l.acc:'none';
const catPlaceable=l=>!!(l&&CAT_ACC_ANCHORS[catSmallKind(l)]);
const catAccTransform=l=>{const p=CAT_ACC_ANCHORS[catSmallKind(l)];if(!p)return'';const dx=Math.max(-94,Math.min(94,+l.accX||0)),dy=Math.max(-80,Math.min(75,+l.accY||0)),scale=Math.max(.65,Math.min(1.7,(+l.accScale||100)/100)),rot=Math.max(-80,Math.min(80,+l.accRot||0));return`translate(${dx} ${dy}) translate(${p[0]} ${p[1]}) rotate(${rot}) scale(${scale}) translate(${-p[0]} ${-p[1]})`};
let ocToySequence=0;
function ocSVG(c){
 const l=CAT_NORM(c.look||c),b=l.body,a=l.accent,theme=l.acc,
  id='softcat-'+(++ocToySequence)+'-',url=n=>'url(#'+id+n+')',
  light=mix(b,'#FFFFFF',.38),cream=mix(b,'#FFF8F3',.7),shadow=mix(b,'#938093',.28),dark=mix(b,'#817184',.24),
  iris=mix('#67546F',a,.22),eyelight=mix(a,'#FFF2F9',.36),blush=mix('#E4A0A3',b,.25),
  trim=mix(a,'#FDF7EE',.52),shade=mix(a,'#686179',.2),size=l.headSize/100,earSz=l.earSize/100,
  ex=l.eyeSize/100,es=l.eyeSpace/100,x1=120-39*es,x2=120+39*es;
 const poly=(pts,col,extra='')=>`<polygon points="${pts}" fill="${col}" ${extra}/>`;
 const headShapes={
  pebble:'M38 93 L43 74 71 65 103 59 142 60 173 66 199 80 211 105 211 141 195 165 160 180 80 180 47 166 30 143 30 115Z',
  puff:'M37 93 L46 73 75 61 103 60 143 58 175 66 201 84 214 110 208 143 190 167 154 183 84 183 48 166 28 143 27 113Z',
  tall:'M42 77 L63 63 98 59 141 59 183 68 202 85 208 118 205 146 185 170 149 180 87 180 49 168 33 139 33 100Z',
  wide:'M30 99 L42 76 67 64 107 60 144 58 179 67 207 88 215 114 211 143 193 166 157 182 82 182 45 163 25 140 25 114Z'};
 const hp=headShapes[l.head]||headShapes.pebble;
 const defs=`<defs><clipPath id="${id}headclip"><path d="${hp}"/></clipPath>
  <linearGradient id="${id}face" x1="0" y1="0" x2=".78" y2="1"><stop stop-color="${cream}"/><stop offset=".53" stop-color="${b}"/><stop offset="1" stop-color="${shadow}"/></linearGradient>
  <linearGradient id="${id}tail" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${cream}"/><stop offset=".62" stop-color="${b}"/><stop offset="1" stop-color="${shadow}"/></linearGradient>
  <linearGradient id="${id}coat" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${trim}"/><stop offset=".55" stop-color="${a}"/><stop offset="1" stop-color="${shade}"/></linearGradient></defs>`;
 const ears={
  upright:['42,87 51,18 109,80','48,76 54,34 86,73'],
  soft:['42,88 49,23 104,82','49,78 57,42 83,75'],
  wide:['39,92 27,27 106,82','43,75 38,45 83,76'],
  tuft:['41,91 46,45 51,18 63,33 101,80','49,76 55,38 83,74']}[l.ears]||['42,87 51,18 109,80','48,76 54,34 86,73'];
 const ear=(flipped=false)=>`${flipped?'<g transform="translate(240 0) scale(-1 1)">':''}<g class="ear ${flipped?'er':'el'}"><g transform="translate(51 82) scale(${earSz}) translate(-51 -82)">
  ${poly(ears[0],shadow)}${poly(ears[0],cream,'opacity=".82"')}${poly(ears[1],mix('#F2B1BC',b,.56))}${poly('50,24 69,51 77,70 54,61',light,'opacity=".50"')}${poly('42,87 75,70 109,80',shadow,'opacity=".24"')}</g></g>${flipped?'</g>':''}`;
 /* 2.4L: 一條連續的貓尾（單一脊線；無根部/尾端拼接）。
    固定根部在角色臀側 (146, 220)，左右使用同一骨架鏡像。 */
 const tailBase=(dir=1)=>{
  const styles={
   straight:{d:'M146 220 C164 222 182 218 196 202 C210 186 214 164 209 145',thick:15},
   fluffy:{d:'M146 220 C161 225 182 222 199 207 C216 192 225 167 218 146',thick:22},
   curl:{d:'M146 220 C166 226 185 215 196 196 C206 178 205 157 193 153 C183 150 178 158 181 165 C183 170 189 170 193 167',thick:16}
  };
  const t=styles[l.tail]||styles.curl;
  /* 共用同一條路徑，以漸層填色的圓端粗筆畫形成真正的一整條尾巴。 */
  return `<g class="tail-side" ${dir===-1?'transform="translate(240 0) scale(-1 1)"':''}>
   <g class="tail">
    <path class="cat-tail-single" d="${t.d}" fill="none" stroke="${url('tail')}" stroke-width="${t.thick}" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="cat-tail-sheen" d="${t.d}" fill="none" stroke="${light}" stroke-width="${Math.max(2.4,t.thick*.2)}" stroke-linecap="round" opacity=".22"/>
   </g>
  </g>`;
 };
 const tail=tailBase(l.tailSide==='left'?-1:1);
 const legs=`<g class="foot fl">${poly('94,220 117,220 119,250 113,255 93,255 90,248',shadow)}${poly('94,222 114,221 115,250 109,254 93,254',cream)}${poly('94,223 101,226 98,253 93,253',light,'opacity=".65"')}</g>
  <g class="foot fr">${poly('121,220 145,219 149,249 144,255 124,255 121,249',shadow)}${poly('124,221 143,222 144,252 138,254 123,252',cream)}${poly('126,223 134,222 129,253 123,252',light,'opacity=".56"')}</g>`;
 const torso=`<path class="torso" d="M104 169 L140 169 151 184 154 219 145 240 99 240 88 220 92 187Z" fill="${url('face')}"/>
  ${poly('92,189 107,170 122,181 105,235 91,220',cream,'opacity=".48"')}${poly('122,181 141,171 152,187 153,218 145,240 136,235',shadow,'opacity=".24"')}`;
 const arms=`<g class="arm al">${poly('106,181 92,182 75,210 80,228 96,227 109,197',light)}${poly('92,182 77,209 84,216 100,187',cream,'opacity=".60"')}${poly('80,214 92,220 95,228 82,225',shadow,'opacity=".22"')}</g>
  <g class="arm ar">${poly('134,181 149,182 166,210 161,228 145,227 131,197',shadow)}${poly('136,186 149,186 160,212 151,219',light,'opacity=".70"')}${poly('151,218 163,212 161,228 145,227',a,'opacity=".12"')}</g>`;
 const outfit={
 starlet:`<g class="acc costume costume-starlet"><path d="M94 175 L84 184 71 219 82 235 163 235 174 220 157 183 145 176 122 184Z" fill="${url('coat')}"/>
 ${poly('91,186 74,220 83,233 104,233 110,193',mix(a,'#B8A2E5',.32))}${poly('148,183 164,189 172,220 161,234 142,233 132,195',shade,'opacity=".50"')}
 ${poly('109,189 131,188 150,231 137,241 100,241 92,234',mix('#FFF9F1',b,.2))}${poly('99,236 108,195 112,239 104,241',mix('#E5D6E6',a,.16),'opacity=".48"')}${poly('121,191 128,241 135,239 133,198',mix('#EEE4F0',b,.15),'opacity=".55"')}
 ${poly('102,191 85,193 79,226 100,230 104,206',mix(a,'#BAAAE0',.34))}${poly('143,191 159,196 164,226 145,231 137,203',mix(a,'#B4A2DA',.38))}
 <path d="M89 179 L108 171 121 185 136 171 155 178 146 200 124 195 120 213 114 195 96 199Z" fill="${mix(a,'#B8A2DE',.35)}"/>
 ${poly('90,179 104,174 115,186 101,190',trim,'opacity=".70"')}${poly('139,174 153,179 142,192 127,186',light,'opacity=".36"')}
 <path d="M121 188 L126 201 139 204 128 211 129 224 120 217 108 223 112 210 102 203 115 201Z" fill="#D5AD70"/>
 <path d="M121 187 L126 199 138 203 126 208 128 221 120 214 109 221 112 208 104 203 116 200Z" fill="#F9DB91"/>
 ${poly('121,191 120,212 111,219 113,208 105,204 116,200', '#FFF0BF','opacity=".75"')}
 ${poly('118,220 121,225 118,229 115,225',mix(a,'#8D81AF',.28))}${poly('117,227 123,235 117,241 112,235',light,'opacity=".70"')}
 </g>`,
 leafy:`<g class="acc costume costume-leafy">
 <path d="M91 181 L76 196 68 222 83 239 162 240 176 221 160 192 144 180 119 191Z" fill="${mix('#92A97D',a,.42)}"/>
 ${poly('90,185 72,222 83,237 103,228 107,192',mix(a,'#C3CCA5',.48))}${poly('141,189 164,189 174,222 162,239 139,229',mix('#7B9773',a,.50))}
 ${poly('108,187 132,189 150,235 135,244 104,242 92,234',mix('#FFF9EF',b,.16))}${poly('112,190 105,239 119,244 117,196',cream,'opacity=".66"')}
 ${poly('84,196 91,207 78,222 73,219',cream,'opacity=".25"')}${poly('150,198 159,215 162,232 150,225',shade,'opacity=".20"')}
 <path d="M99 177 Q121 192 143 177" fill="none" stroke="#F2E6C9" stroke-width="5"/>
 <path d="M121 184 Q97 171 101 189 L118 192 Q120 195 121 190 Q143 171 142 190 L125 192Z" fill="#F9F3DF"/><path d="M120 190 L110 207 121 199 132 207 125 190Z" fill="#FFF7EA"/><circle cx="122" cy="191" r="4" fill="#DCC68A"/>
 ${poly('120,207 124,214 120,220 116,214',mix(a,'#879D7A',.38))}${poly('120,222 125,230 120,236 115,230',mix(a,'#879D7A',.38))}
 <g transform="translate(158 216)"><path d="M0 0 L27-5 29 23 1 25Z" fill="#AD8C77"/>${poly('2,1 25,-3 25,20 4,24','#C7A48C')}${poly('3,1 18,-2 24,4 11,8','#E6C4A6','opacity=".74"')}<path d="M8 1 Q8-11 20-9 Q27-7 25-2" fill="none" stroke="#BDA48F" stroke-width="4"/><path d="M15 8 l4 5 -4 5 -4-5Z" fill="#FFF1E7"/></g>
 </g>`,
 snoozy:`<g class="acc costume costume-snoozy">
 <path d="M88 182 L151 181 167 197 167 235 155 241 87 240 77 232 79 197Z" fill="${mix('#A9B8DB',b,.5)}"/>
 ${poly('81,199 92,187 102,192 93,235 79,231',light,'opacity=".52"')}${poly('146,185 163,196 167,230 155,241 146,233',mix('#8E9AC6',a,.3),'opacity=".54"')}
 ${poly('110,188 132,187 142,237 99,238',mix('#FFF7F1',b,.25))}${poly('110,191 120,191 119,235 109,236',light,'opacity=".46"')}
 <path d="M90 216 L110 213 110 233 92 235Z" fill="#FFF8F0" opacity=".82"/><path d="M139 215 L156 213 155 234 139 234Z" fill="#FFF6EF" opacity=".76"/>
 <path d="M107 192 L107 218 M136 191 L136 217" stroke="${mix('#938EB3',a,.36)}" stroke-width="2" fill="none" opacity=".6"/>
 <path d="M147 225 q6 -9 12 0 q-6 8 -12 0Z" fill="${mix(a,'#8E9FD0',.28)}"/><circle cx="150" cy="222" r="1.6" fill="${trim}"/><circle cx="157" cy="222" r="1.6" fill="${trim}"/>
 <path d="M96 179 Q122 167 149 178 L158 187 152 201 123 204 90 199 83 189Z" fill="${mix('#D5A6BE',a,.42)}"/>
 ${poly('90,180 126,174 152,180 139,184 98,187',mix('#F3CED6',a,.28),'opacity=".86"')}${poly('85,190 93,198 124,203 150,198 158,188 147,199 123,208 94,204',mix('#B99BAE',a,.5),'opacity=".50"')}
 ${poly('90,190 78,194 63,223 73,229 89,207',mix('#E2BDCE',a,.42))}${poly('76,209 70,235 77,238 86,214',mix('#DFC1D2',a,.32))}
 <g stroke="${mix(a,'#978FA9',.35)}" stroke-width="1.2" opacity=".65"><path d="M68 222 L61 235 M73 226 L68 241 M79 227 L76 241"/></g>
 <g transform="translate(89 194)"><circle r="11" fill="#F7E7E7"/><circle cx="-6" cy="-5" r="5.5" fill="#FFF8F5" opacity=".68"/><circle cx="5" cy="7" r="3.5" fill="#EDCFD9"/></g>
 <rect x="143" y="208" width="13" height="7" rx="2" fill="#A18EA8"/><rect x="146" y="209" width="8" height="4" rx="1" fill="#E9D8C6"/>
 </g>`};
 const gloves=theme==='starlet'?`<g class="arm al">${poly('77,198 92,201 87,221 78,228 66,216',mix('#B9A2DD',a,.42))}${poly('69,208 86,215 80,227 69,221',trim,'opacity=".46"')}</g><g class="arm ar">${poly('148,201 165,201 175,218 160,229 150,219',mix('#AD9BD7',a,.38))}${poly('166,207 175,218 160,229 159,218',trim,'opacity=".37"')}</g>`:
 theme==='leafy'?`<g class="arm al">${poly('83,196 95,202 88,223 73,222 70,215',mix(a,'#A6BA8E',.45))}</g><g class="arm ar">${poly('151,198 163,198 170,220 156,224 151,218',mix(a,'#B1C49F',.45))}</g>`:
 theme==='snoozy'?`<g class="arm al">${poly('80,196 92,202 91,230 77,231 69,214',mix(b,'#D8D0ED',.28))}</g><g class="arm ar">${poly('154,198 166,202 174,222 158,233 150,226',mix(b,'#A3AAD3',.3))}</g>`:'';
 const mark={
  none:'',
  cap:`${poly('54,74 84,64 120,67 157,64 187,77 180,95 151,87 118,92 86,86 58,94',a,'opacity=".26"')}${poly('81,67 118,72 151,68 142,82 119,87 93,82',mix(a,'#fff5f0',.18),'opacity=".18"')}`,
  mask:`${poly('47,118 77,110 122,116 164,109 192,118 185,144 160,158 82,159 55,144',a,'opacity=".22"')}${poly('74,115 121,120 166,114 156,134 122,139 84,134',mix(a,'#ffffff',.12),'opacity=".15"')}`,
  patch:`${poly('44,88 79,72 103,92 99,123 72,138 44,124',a,'opacity=".28"')}${poly('56,87 77,79 90,94 88,114 72,125 55,115',mix(a,'#fff9f3',.12),'opacity=".16"')}`,
  tabby:`${poly('84,65 97,62 95,89 86,98',a,'opacity=".28"')}${poly('114,62 122,63 120,98 113,99',a,'opacity=".22"')}${poly('144,66 157,70 148,97 140,90',a,'opacity=".28"')}${poly('70,95 84,101 77,117 63,111',a,'opacity=".18"')}${poly('157,100 174,94 180,111 165,118',a,'opacity=".18"')}`,
  calico:`${poly('43,95 73,72 97,81 91,109 63,126 38,118',a,'opacity=".26"')}${poly('154,70 185,84 193,118 167,128 146,108',mix(a,'#C9A28D',.48),'opacity=".30"')}${poly('84,136 107,126 121,139 112,159 88,158',mix(a,'#ffffff',.08),'opacity=".16"')}`,
  socks:`${poly('42,147 68,164 92,174 149,174 176,164 198,146 185,159 150,169 92,169 58,159',cream,'opacity=".24"')}${poly('61,165 92,173 148,173 176,164 168,173 148,179 90,179 68,173',cream,'opacity=".14"')}`
 }[l.pattern]||'';
 // Triangulated facet system: crisp geometric boundaries, no oversized soft-edged blobs.
 const facets=`<g clip-path="${url('headclip')}">
  ${poly('28,106 63,71 103,62 92,104 52,134 29,126',cream,'opacity=".54"')}
  ${poly('103,62 143,60 188,74 146,101 93,103',light,'opacity=".60"')}
  ${poly('187,73 210,104 207,136 176,122 145,102',shadow,'opacity=".27"')}
  ${poly('29,127 51,133 86,166 81,183 49,167 27,145',shadow,'opacity=".24"')}
  ${poly('52,132 90,104 145,104 176,124 163,175 82,179',cream,'opacity=".38"')}
  ${poly('176,123 212,135 196,168 160,182 166,156',shadow,'opacity=".34"')}
  ${poly('93,102 121,78 145,104 128,150',light,'opacity=".22"')}
  ${poly('80,179 121,159 161,180 116,190',mix(b,'#D0C0C6',.26),'opacity=".14"')}
  ${mark}</g>`;
 function eyeShape(){
  const options={
   droop:`<path d="M-15 -7 Q0-10 15-6 L13 0 Q12 12 1 13 Q-12 14-14 2Z" fill="${iris}"/><path d="M-14 -3 Q-12 10 1 12 Q10 10 13-2" fill="${eyelight}" opacity=".43"/><path d="M-16-9 Q0-14 16-9" stroke="${mix('#524B66',a,.24)}" stroke-width="4.1" stroke-linecap="round" fill="none"/><path d="M-4-4 l5-4 5 4-5 5Z" fill="${cream}" opacity=".83"/>`,
   sleepy:`<path d="M-15-6 Q0-10 15-7 L10 4 Q0 13-12 4Z" fill="${iris}"/><path d="M-15-8 L15-9" stroke="${mix('#504B60',a,.28)}" stroke-width="4" stroke-linecap="round"/><path d="M-10 6 Q0 11 9 5" fill="${eyelight}" opacity=".4"/>`,
   smile:`<path d="M-16 7 Q-1-15 14 6" fill="none" stroke="${iris}" stroke-width="4.1" stroke-linecap="round"/>`,
   bean:`<path d="M-11-10 Q7-16 11-1 L9 9 Q0 16-10 7Z" fill="${iris}"/><ellipse cx="-3" cy="-4" rx="3.5" ry="4.4" fill="${cream}" opacity=".8"/>`,
   round:`<ellipse cx="0" cy="0" rx="11.5" ry="13.5" fill="${iris}"/><ellipse cx="-3" cy="-5" rx="4" ry="4" fill="${cream}"/>`,
   spark:`<path d="M-11-9 Q4-14 11-2 L10 9 Q1 15-10 7Z" fill="${iris}"/><path d="M-3-9 l3 5 6 2 -6 3-2 5-3-5-5-3 5-2Z" fill="#FFF8F8"/>`
  };return options[l.eye]||options.droop;
 }
 const eyeAt=x=>`<g transform="translate(${x} 143) scale(${ex})">${eyeShape()}</g>`;
 const mouthPaths={caret:'M115 160 L120 154 L125 160',w:'M112 156 Q116 163 120 157 Q124 163 128 156',smile:'M112 158 Q120 168 128 158',tiny:'M117 160 Q120 157 123 160',open:'M116 154 Q120 150 124 154 Q127 165 120 166 Q113 165 116 154Z'};
 const isDefault=('mochi yuzu sora'.split(' ').includes(c.id));
 const topWear=()=>{
  const kind=catSmallKind(l);
  const generic=()=>{
   if(kind==='none')return '';
   if(kind==='collar')return `<g class="acc acc-collar"><path d="M90 176 Q120 168 150 176 L145 186 Q120 181 95 186Z" fill="${mix(a,'#E8C8B6',.32)}"/><circle cx="120" cy="186" r="7" fill="${trim}"/><circle cx="120" cy="186" r="3" fill="${mix(a,'#D89B76',.26)}"/></g>`;
   if(kind==='bandana')return `<g class="acc acc-bandana"><path d="M92 176 Q121 168 149 176 L141 194 Q120 189 99 194Z" fill="${mix(a,'#E9C5C7',.28)}"/><path d="M112 190 L120 206 128 190Z" fill="${mix(a,'#D7A0AC',.34)}"/></g>`;
   if(kind==='bell')return `<g class="acc acc-bell"><path d="M97 178 Q120 171 143 178" stroke="${mix(a,'#9E8891',.24)}" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="120" cy="187" r="9" fill="#F0CF82"/><circle cx="120" cy="190" r="2.5" fill="#B98A45"/></g>`;
   if(kind==='leaf')return `<g class="acc acc-leaf"><path d="M120 58 Q106 35 86 36 Q94 56 120 58" fill="#94B07B"/><path d="M120 58 Q135 34 155 30 Q150 54 120 58" fill="#AFC28F"/><path d="M120 58 L120 72" stroke="#82956B" stroke-width="4"/></g>`;
   if(kind==='glasses')return `<g class="acc acc-glasses" fill="none" stroke="${mix(a,'#6F6773',.26)}" stroke-width="3"><circle cx="80" cy="143" r="16"/><circle cx="160" cy="143" r="16"/><path d="M96 143 H144"/><path d="M64 142 H52 M176 142 H188"/></g>`;
   if(kind==='crescent')return `<g class="acc acc-crescent"><path d="M173 79 A15 15 0 1 0 173 109 A11 15 0 1 1 173 79Z" fill="#F7DB98"/></g>`;
   if(kind==='kerchief')return `<g class="acc acc-kerchief"><path d="M48 102 Q120 78 194 102 L185 118 Q120 98 57 120Z" fill="${mix(a,'#C9B7A5',.22)}"/><path d="M58 110 L49 129 63 140 71 120Z" fill="${mix(a,'#BCA89B',.2)}"/></g>`;
   if(kind==='flower')return `<g class="acc acc-flower">${[0,72,144,216,288].map(r=>`<ellipse cx="171" cy="88" rx="8" ry="12" transform="rotate(${r} 171 88)" fill="#FFF6EC"/>`).join('')}<circle cx="171" cy="88" r="7" fill="#EDD5A5"/></g>`;
   if(kind==='ribbon')return `<g class="acc acc-ribbon"><path d="M59 87 L37 75 34 96 52 103Z" fill="${mix(a,'#C8A2C8',.35)}"/><path d="M73 87 L95 75 98 96 80 103Z" fill="${mix(a,'#C8A2C8',.42)}"/><circle cx="66" cy="90" r="8" fill="${trim}"/></g>`;
   if(kind==='crown')return `<g class="acc acc-crown"><path d="M93 66 L107 84 121 60 135 84 149 66 154 88 88 88Z" fill="#F2D287"/>${poly('95,69 106,84 121,62 136,84 147,69 147,83 95,83','#FFF1C2','opacity=".72"')}</g>`;
   if(kind==='pom')return `<g class="acc acc-pom"><path d="M61 93 Q91 59 134 62 Q163 64 188 86" stroke="${mix(a,'#B1AAC8',.36)}" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="52" cy="101" r="13" fill="#F7E4E7"/></g>`;
   if(kind==='satchel')return `<g class="acc acc-satchel"><path d="M155 199 L181 193 184 222 157 225Z" fill="#B8957D"/>${poly('158,197 179,194 180,219 160,222','#D2B299','opacity=".8"')}<path d="M126 170 Q146 179 160 198" stroke="#A68873" stroke-width="4" fill="none" stroke-linecap="round"/></g></g>`;
   return '';
  };
  const placed=catPlaceable(l)?`<g class="accessory-placed" transform="${catAccTransform(l)}">${generic()}</g>`:'';
  if(theme==='starlet')return `<g class="acc head-accessory starlet-accessory">
   <g transform="translate(176 73)"><path d="M0-20 L6-6 21-5 9 4 13 19 0 11-14 19-10 4-21-5-7-7Z" fill="#EEC780"/>${poly('0,-18 5,-5 19,-4 8,3 11,18 0,10 -10,18 -8,3 -18,-4 -6,-6','#FFE4A3','opacity=".95"')}${poly('-17,-4 -7,-6 0,-18 0,10 -10,18 -8,3','#FFF4CB','opacity=".78"')}</g>
   <g transform="translate(56 86)">${poly('-5,-8 -19,-20 -32,-16 -28,4 -14,7',mix(a,'#AD91D3',.34))}${poly('3,-9 26,-20 34,-12 26,8 8,6',mix(a,'#B79EDC',.43))}<circle cx="0" cy="0" r="8" fill="${trim}"/><circle cx="0" cy="0" r="4" fill="#F5D4E1"/></g>
   <path d="M46 91 L38 113 L53 124 65 99Z" fill="${shade}" opacity=".78"/><path d="M38 113 L55 128 59 114 46 102Z" fill="${light}" opacity=".6"/>
   <path d="M57 94 L57 134" stroke="#CAAFE1" stroke-width="2"/><path d="M57 130 L66 143 57 155 48 143Z" fill="${shade}"/>${poly('57,132 65,143 57,154 56,144',trim,'opacity=".9"')}
   <path d="M198 109 l3 5-3 5-4-5Z" fill="#FFF1CE" opacity=".78"/></g>${placed}`;
  if(theme==='leafy')return `<g class="acc head-accessory leafy-accessory">
   <path d="M34 116 L39 85 66 62 102 49 145 47 182 66 203 86 211 112 196 146 178 150 184 126 164 109 146 100 120 97 91 101 67 112 48 138Z" fill="${mix(a,'#A7B68A',.35)}"/>
   ${poly('41,97 64,72 103,53 133,50 94,78 59,112',mix(a,'#D4D8B5',.55))}${poly('146,49 183,66 202,86 207,113 187,124 171,94',mix('#93A97D',a,.4))}
   <path d="M44 115 Q76 75 120 77 Q171 76 193 116" stroke="${mix('#D8D7AF',a,.35)}" stroke-width="7" stroke-linecap="round" fill="none"/>
   <path d="M52 102 L71 87 M82 79 L102 72" stroke="#EEE9CD" stroke-width="2.3" opacity=".78" stroke-linecap="round" stroke-dasharray="5 11"/>
   <g transform="translate(123 52)"><path d="M0 0 Q-15-24-32-22 Q-24-3 0 0" fill="#91A56A"/><path d="M0 0 Q14-22 33-26 Q28-2 0 0" fill="#A9B98B"/><path d="M0 0 L0 16" stroke="#82936E" stroke-width="4"/></g>
   <g transform="translate(171 91)"><path d="M0 0 Q-18-18-27-15 Q-24-5-7 2Z" fill="#92AD81"/><path d="M0 0 Q11-23 24-18 Q22-1 1 4Z" fill="#AABF97"/>
   ${[0,72,144,216,288].map(r=>`<ellipse cy="-12" rx="8" ry="12" transform="rotate(${r})" fill="#FFFAEC"/>`).join('')}<circle r="7" fill="#EDD5A5"/></g>
   <path d="M47 122 L35 146 51 167 63 139Z" fill="${mix('#92A97E',a,.43)}"/><path d="M198 122 L207 146 190 163 184 141Z" fill="${mix('#879F79',a,.36)}"/>
 </g>${placed}`;
  if(theme==='snoozy')return `<g class="acc head-accessory snoozy-accessory">
   <path d="M43 100 Q47 53 96 42 157 36 196 77 L206 108 190 132 171 111 136 103 97 103 58 115Z" fill="${mix('#9E99C6',a,.37)}"/>
   ${poly('47,89 68,59 113,43 150,44 107,71 62,104',mix('#CCD0EC',b,.4))}${poly('149,44 188,67 204,100 182,113 169,77',mix(a,'#9F99C0',.26))}
   <path d="M44 105 Q117 73 203 107 L196 124 Q123 94 54 127Z" fill="${mix('#B7AECF',a,.40)}"/>
   <path d="M55 108 Q127 82 197 109" fill="none" stroke="${mix('#E1D4E8',a,.5)}" stroke-width="3.6"/>
   <g transform="translate(139 45)"><path d="M-18-1 Q-26-18-9-22 Q-2-33 9-24 Q26-26 26-11 Q37-2 23 10 Q19 23 4 18 Q-8 26-18 13 Q-32 10-18-1Z" fill="#F6E5E9"/>${poly('-15,-8 -5,-23 10,-20 20,-10 9,-9','#FFF9F6','opacity=".66"')}<circle cx="-12" cy="7" r="8" fill="#F5E6E6"/><circle cx="16" cy="4" r="7" fill="#F8EDEB"/></g>
   <g transform="translate(177 88)"><circle r="8" fill="#FDF5EF"/><path d="M-2-13 L2-13 2 14 -2 14ZM-13 -2 L14 -2 14 2 -13 2Z" fill="#F8F1ED" transform="rotate(39)"/><circle r="3" fill="#E4C6D6"/></g>
   <g transform="translate(48 126)"><circle r="15" fill="#F7E3E4"/><circle cx="-6" cy="-5" r="6" fill="#FFF9F4" opacity=".65"/></g>
 </g>${placed}`;
  return placed;
 };
 const face=`<g class="head-g"><g transform="translate(120 176) scale(${size}) translate(-120 -176)">${ear(false)}${ear(true)}
  <path d="${hp}" fill="${url('face')}"/><path d="${hp}" stroke="${shadow}" stroke-width="1.2" stroke-opacity=".13" fill="none"/>${facets}
  <g class="cheek" opacity="${l.cheeks/100}">${(()=>{const one=x=>{
   if(l.cheekStyle==='none')return '';
   if(l.cheekStyle==='stripes')return `<g transform="translate(${x} 160)" stroke="${blush}" stroke-width="4" stroke-linecap="round"><path d="M-11 -2 l-4 7 M-3 -3 l-4 8 M5 -4 l-4 8"/></g>`;
   if(l.cheekStyle==='heart')return `<path transform="translate(${x-8} 153)" d="M8 14 Q-5 6 2 1 Q7 -2 8 4 Q14 -3 18 2 Q23 9 8 14Z" fill="${blush}"/>`;
   if(l.cheekStyle==='spark')return `<path transform="translate(${x} 158)" d="M0-11 L3-3 12 0 3 3 0 11-3 3-12 0-3-3Z" fill="#F7E0A6"/>`;
   if(l.cheekStyle==='paw')return `<g transform="translate(${x} 160)" fill="${blush}"><ellipse cx="0" cy="5" rx="6" ry="4"/><circle cx="-8" cy="-3" r="2.5"/><circle cx="-3" cy="-7" r="2.5"/><circle cx="4" cy="-7" r="2.5"/><circle cx="9" cy="-3" r="2.5"/></g>`;
   return `<ellipse cx="${x}" cy="158" rx="18" ry="8" fill="${blush}" opacity=".86"/>`;
  };return one(53)+one(187);})()}</g>
  <g class="eyebrows" transform="translate(0 ${l.eyeY})" stroke="${iris}" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".76">${(()=>{const bw={none:'',flat:'M-11 0 L11 0',soft:'M-11 1 Q0-6 11 1',arched:'M-11 3 Q-2-7 11-2',sad:'M-11-4 L11 3'}[l.brow]||'';return bw?`<path d="${bw}" transform="translate(${x1} 122)"/><path d="${bw}" transform="translate(${x2} 122) scale(-1 1)"/>`:'';})()}</g>
  <g class="eye-o" transform="translate(0 ${l.eyeY})">${eyeAt(x1)}${eyeAt(x2)}</g>
  <g class="eye-c" transform="translate(0 ${l.eyeY})" fill="none" stroke="${iris}" stroke-width="4.2" stroke-linecap="round"><path d="M${x1-14} 150 Q${x1} 128 ${x1+14} 150 M${x2-14} 150 Q${x2} 128 ${x2+14} 150"/></g>
  <g class="eye-h" transform="translate(0 ${l.eyeY})" fill="none" stroke="${iris}" stroke-width="3.8" stroke-linecap="round"><path d="M${x1-13} 150 Q${x1} 137 ${x1+13} 150 M${x2-13} 150 Q${x2} 137 ${x2+13} 150"/></g>
  <path class="mouth-n" d="${mouthPaths[l.mouth]||mouthPaths.caret}" transform="translate(0 ${l.mouthY})" stroke="${iris}" stroke-width="3.3" stroke-linecap="round" stroke-linejoin="round" fill="${l.mouth==='open'?iris:'none'}"/>
  <path class="mouth-h" d="M113 157 Q120 175 127 157Z" fill="${iris}" transform="translate(0 ${l.mouthY})"/><ellipse class="mouth-o" cx="120" cy="159" rx="5.6" ry="7" fill="${iris}" transform="translate(0 ${l.mouthY})"/>
  <g class="eye-extra eye-wow" fill="${iris}"><ellipse cx="${x1}" cy="141" rx="10" ry="15"/><ellipse cx="${x2}" cy="141" rx="10" ry="15"/></g>
  <g class="eye-extra eye-soft" fill="none" stroke="${iris}" stroke-width="3" stroke-linecap="round"><path d="M${x1-13} 144 q13 13 26 0 M${x2-13} 144 q13 13 26 0"/></g>
  <g class="eye-extra eye-worry" fill="${iris}"><ellipse cx="${x1}" cy="143" rx="9" ry="10"/><ellipse cx="${x2}" cy="143" rx="9" ry="10"/></g>
  <g class="eye-extra eye-tsun" fill="${iris}"><path d="M${x1-14} 139 h28 l-4 13 q-13 9-21-2Z M${x2-14} 139 h28 l-4 13 q-13 9-21-2Z"/></g>
  <path class="mouth-extra mouth-pout" d="M115 163 Q120 154 125 163" stroke="${iris}" stroke-width="2.8" fill="none" stroke-linecap="round"/>
  ${topWear()}</g></g>`;
 return `<svg class="oc-svg toy-svg cat-poly cat-ref-v2" data-doll="kitty" viewBox="0 0 240 260" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${defs}
  <g class="body-g">${tail}${legs}${torso}${outfit[theme]||''}${theme==='starlet'||theme==='leafy'||theme==='snoozy'?gloves:arms}</g>${face}</svg>`;
}

function legacyOcSVG(c){
 const b=c.body||'#FFF6EC',light=mix(b,'#ffffff',.5),shade=mix(b,'#79666c',.29),deep=mix(b,'#655158',.38),bel=mix(b,'#ffffff',.78),pink=mix(b,'#e9a6b3',.62),ink='#60414a',id='oc-doll-'+(++ocToySequence)+'-',url=n=>'url(#'+id+n+')',cat=c.ears==='pointy',rabbit=c.ears==='long';
 const defs=`<defs>
 <radialGradient id="${id}clay" cx="33%" cy="24%" r="83%"><stop stop-color="${light}"/><stop offset=".48" stop-color="${b}"/><stop offset=".8" stop-color="${mix(b,shade,.5)}"/><stop offset="1" stop-color="${shade}"/></radialGradient>
 <linearGradient id="${id}body" x1="0" y1="0" x2="1" y2=".7"><stop stop-color="${light}"/><stop offset=".4" stop-color="${b}"/><stop offset="1" stop-color="${shade}"/></linearGradient>
 <radialGradient id="${id}ear" cx="38%" cy="35%" r="70%"><stop stop-color="${light}"/><stop offset=".6" stop-color="${b}"/><stop offset="1" stop-color="${shade}"/></radialGradient>
 <radialGradient id="${id}inner"><stop stop-color="${mix(pink,'#ffffff',.45)}"/><stop offset=".65" stop-color="${pink}"/><stop offset="1" stop-color="${mix(pink,shade,.3)}"/></radialGradient>
 <radialGradient id="${id}belly" cx="38%" cy="28%" r="80%"><stop stop-color="#fffefa"/><stop offset=".65" stop-color="${bel}"/><stop offset="1" stop-color="${mix(bel,shade,.2)}"/></radialGradient>
 <radialGradient id="${id}blush"><stop stop-color="${mix(pink,'#e58e9e',.45)}" stop-opacity=".75"/><stop offset="1" stop-color="${pink}" stop-opacity="0"/></radialGradient>
 <linearGradient id="${id}eye" x2=".8" y2="1"><stop stop-color="#765059"/><stop offset=".55" stop-color="#533640"/><stop offset="1" stop-color="#432b35"/></linearGradient>
 <linearGradient id="${id}leaf" x2=".8" y2="1"><stop stop-color="#c9dc98"/><stop offset=".42" stop-color="#a2c479"/><stop offset="1" stop-color="#6b9b6f"/></linearGradient>
 <linearGradient id="${id}ribbon" x2=".5" y2="1"><stop stop-color="#b9d9c4"/><stop offset=".5" stop-color="#8ebcaa"/><stop offset="1" stop-color="#689987"/></linearGradient>
 <linearGradient id="${id}gold" x2=".8" y2="1"><stop stop-color="#fff0be"/><stop offset=".45" stop-color="#ebcc7f"/><stop offset="1" stop-color="#c49d5f"/></linearGradient>
 </defs>`;
 const ear=rabbit?`<path d="M42 43C31 34 20 35 17 45 7 46 7 55 11 61 1 68 5 80 10 84 2 92 7 103 12 106 6 117 15 127 26 125L43 116 51 60Z" fill="${url('ear')}"/><path d="M31 47C21 45 20 55 23 61 14 68 18 77 21 82 14 90 19 99 22 104 18 114 23 118 29 116L38 106 40 57Z" fill="${url('inner')}" opacity=".64"/>`
 :cat?`<path d="M26 65C20 48 21 24 27 12 31 5 48 18 64 36L70 58Z" fill="${url('ear')}"/><path d="M32 48C29 37 28 24 31 21 35 20 46 30 53 39Z" fill="${url('inner')}" opacity=".7"/>`
 :`<path d="M26 56C12 45 13 21 24 12 37 0 59 8 66 26L65 55Z" fill="${url('ear')}"/><path d="M29 42C22 32 24 20 31 17 42 12 51 22 53 34Z" fill="${url('inner')}" opacity=".55"/>`;
 const ears=`<g class="ear el">${ear}</g><g transform="translate(200 0) scale(-1 1)"><g class="ear er">${ear}</g></g>`;
 const tail=rabbit?`<circle cx="125" cy="187" r="10" fill="${url('belly')}"/>`:cat?`<path d="M112 190C133 202 145 184 131 175" fill="none" stroke="${shade}" stroke-width="11" stroke-linecap="round"/><path d="M113 187C133 197 142 183 130 177" fill="none" stroke="${url('body')}" stroke-width="10" stroke-linecap="round"/>`:`<circle cx="126" cy="190" r="9" fill="${url('body')}"/>`;
 const forelock=cat?`<g fill="${deep}" opacity=".7"><path d="M91 43Q100 55 99 72 90 64 91 43Z"/><path d="M73 47Q72 62 62 68 64 56 73 47Z"/><path d="M120 47Q133 56 136 67 125 64 120 47Z"/></g>`:`<path d="M76 42Q83 34 95 37 108 33 120 43L123 63Q118 69 111 62 106 73 99 67 88 74 84 64 75 68 76 56Z" fill="${url('body')}" opacity=".9"/>`;
 const eyes=cat?`<path d="M58 94C49 96 44 104 47 113 50 121 60 126 67 119 74 112 72 103 66 98ZM142 94C151 96 156 104 153 113 150 121 140 126 133 119 126 112 128 103 134 98Z" fill="${url('eye')}"/><path d="m51 103 9-7m-10 15 15-12m-10 20 13-10m66-6 8-7m-11 15 15-12m-10 20 13-10" stroke="#c5a0a5" stroke-width="1.5" stroke-linecap="round" opacity=".36"/>`
 :rabbit?`<path d="M52 92Q57 85 64 93C70 102 71 115 68 125Q58 130 47 124C46 113 47 100 52 92ZM136 93Q143 85 148 92C153 100 154 113 153 124Q142 130 132 125C129 115 130 102 136 93Z" fill="${url('eye')}"/><path d="m50 102 11-10m-12 20 17-15m-16 24 17-15m67-4 11-10m-13 21 17-15m-16 24 17-15" stroke="#cba3ab" stroke-width="1.6" stroke-linecap="round" opacity=".38"/><path d="m53 92-2-7m88 6-1-6" fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round"/>`
 :`<path d="M52 97Q59 85 67 98C73 108 72 119 70 125Q59 129 48 124C47 115 47 105 52 97ZM133 98Q141 85 148 97C153 105 153 115 152 124Q141 129 130 125C128 119 127 108 133 98Z" fill="${url('belly')}" stroke="${ink}" stroke-width="2.2"/><path d="m51 131 1 2m10-2 1 2m74-2 1 2m9-2 1 2" stroke="${ink}" stroke-width="1.5" stroke-linecap="round"/>`;
 const accessory=c.acc==='sprout'?`<g transform="translate(141 40)"><g class="acc"><path d="M0 14Q1 3-4-7" stroke="#7a9a69" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="M-2 7C-18 9-23-4-20-8-9-11-1-4-2 7Z" fill="${url('leaf')}"/><path d="M-1 10C-1-4 10-8 17-4 19 4 11 13-1 10Z" fill="${url('leaf')}"/><path d="m-18-6 14 11M1 9 14-2" stroke="#dce6b3" stroke-width="1.1" opacity=".55"/></g></g>`:c.acc==='star'?`<g transform="translate(148 51)"><g class="acc"><path d="m0-12 4 8 9 2-6 6 1 9-8-4-8 4 1-9-6-6 9-2Z" fill="${url('gold')}"/><path d="M0-12 0 3-8 13l1-9-6-6 9-2Z" fill="#fff2c5" opacity=".48"/></g></g>`:'';
 const bow=c.acc==='scarf'?`<path d="M85 154Q100 160 115 154L114 161Q100 167 86 161Z" fill="${url('ribbon')}"/><g class="acc"><path d="M100 162C87 150 77 158 85 168L98 165Z" fill="${url('ribbon')}"/><path d="M100 162C113 150 123 158 115 168L102 165Z" fill="${url('ribbon')}"/><path d="m98 164-8 13 8-4 3-9m2 0 8 13-8-4-3-9" fill="${url('ribbon')}"/><ellipse cx="100" cy="163" rx="4" ry="4.5" fill="${mix('#9fc8b4','#fffaf0',.3)}"/></g>`:'';
 return `<svg class="oc-svg toy-svg" data-doll="${rabbit?'bunny':cat?'kitty':'bear'}" viewBox="0 0 200 214" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${defs}
 <g class="body-g"><g class="tail">${tail}</g>
 <g class="foot fl"><path d="M83 191Q90 187 97 194L97 204Q98 213 90 213C81 214 80 207 81 202Z" fill="${url('body')}"/><path d="M82 206Q88 202 97 206L96 210Q90 216 84 211Z" fill="${url('belly')}" opacity=".85"/></g>
 <g class="foot fr"><path d="M103 194Q110 187 117 191L119 202C120 207 119 214 110 213Q102 213 103 204Z" fill="${url('body')}"/><path d="M103 206Q112 202 118 206L116 211Q110 216 104 210Z" fill="${url('belly')}" opacity=".85"/></g>
 <path class="torso" d="M90 152Q100 148 110 152C115 158 118 170 121 181Q127 195 116 201Q108 205 100 202Q92 205 84 201 73 195 79 181C82 170 85 158 90 152Z" fill="${url('body')}"/>
 <ellipse cx="100" cy="183" rx="13" ry="15" fill="${url('belly')}" opacity=".83"/>
 <ellipse cx="100" cy="155" rx="13" ry="4" fill="${shade}" opacity=".23"/>
 <g class="arm al"><path d="M86 164C79 161 74 168 75 176Q75 186 80 188C85 190 88 184 88 180L91 171Q92 167 86 164Z" fill="${url('body')}"/><ellipse cx="80" cy="183" rx="4" ry="4.5" fill="${url('belly')}" opacity=".34"/></g>
 <g class="arm ar"><path d="M114 164C121 161 126 168 125 176Q125 186 120 188C115 190 112 184 112 180L109 171Q108 167 114 164Z" fill="${url('body')}"/><ellipse cx="120" cy="183" rx="4" ry="4.5" fill="${url('belly')}" opacity=".34"/></g>
 ${bow}</g>
 <g class="head-g">${ears}
 <path d="M26 64Q25 45 47 39Q100 29 153 39 175 45 174 64L176 125Q176 143 154 150 100 160 46 150 24 143 24 125Z" fill="${url('clay')}"/>
 <path d="M29 64Q27 47 49 42 101 32 149 41 103 37 57 47 38 51 29 64Z" fill="#fffdf4" opacity=".2"/>
 <path d="M171 62 174 125Q174 142 152 148 101 158 47 148 33 144 28 136 61 147 109 147 155 145 164 132Z" fill="${shade}" opacity=".16"/>
 ${forelock}
 <ellipse class="cheek" cx="43" cy="125" rx="15" ry="10" fill="${url('blush')}"/><ellipse class="cheek" cx="157" cy="125" rx="15" ry="10" fill="${url('blush')}"/>
 <g class="eye-o">${eyes}</g>
 <g class="eye-c" fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"><path d="M48 117Q59 121 70 117M130 117Q141 121 152 117"/></g>
 <g class="eye-h" fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"><path d="M48 118Q59 108 70 118M130 118Q141 108 152 118"/></g>
 <path class="mouth-n" d="M92 128Q95 134 100 128 105 134 108 128" fill="none" stroke="${ink}" stroke-width="2.1" stroke-linecap="round"/>
 <g class="mouth-h"><path d="M92 127Q100 140 108 127Z" fill="${ink}"/><path d="M96 133Q100 130 104 133Q100 137 96 133Z" fill="${pink}"/></g>
 <ellipse class="mouth-o" cx="100" cy="130" rx="4" ry="5" fill="${ink}"/>
 <g class="eye-extra eye-wow"><ellipse cx="59" cy="111" rx="12" ry="17" fill="${url('belly')}" stroke="${ink}" stroke-width="2.1"/><ellipse cx="141" cy="111" rx="12" ry="17" fill="${url('belly')}" stroke="${ink}" stroke-width="2.1"/></g>
 <g class="eye-extra eye-soft" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"><path d="M49 116Q59 122 69 116M131 116Q141 122 151 116"/></g>
 <g class="eye-extra eye-worry" fill="${url('eye')}"><ellipse cx="59" cy="116" rx="7" ry="10"/><ellipse cx="141" cy="116" rx="7" ry="10"/><path d="M47 98q13 4 23-3m60 0q10 7 23 3" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round"/></g>
 <g class="eye-extra eye-tsun" fill="${url('eye')}"><path d="M48 109h22q0 18-9 17-10-1-13-17Zm82 0h22q-3 16-13 17-9 1-9-17Z"/><path d="m49 105 20 3m62 0 20-3" stroke="${ink}" stroke-width="2" stroke-linecap="round"/></g>
 <path class="mouth-extra mouth-pout" d="M95 132q5-4 10 0" fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round"/>
 ${accessory}</g></svg>`;
}


const artHTML=c=>!c.url?(c.kind==='custom'&&c.rec&&c.rec.look&&!Object.hasOwn(c.rec.look,'head')?legacyOcSVG(Object.assign({},c,{ears:c.rec.look.ears,acc:c.rec.look.acc,body:c.rec.look.body})):ocSVG(c)):`<img src="${c.url}" alt="" draggable="false" decoding="async">`;
const thumbHTML=c=>`<div class="thumb"><div class="art"><div class="adj">${artHTML(c)}</div></div></div>`;

/* ==========================================================
   舞台引擎（Stage）
   ========================================================== */
const Ticker={set:new Set(),raf:0,last:0,
  add(s){this.set.add(s);this.kick()},del(s){this.set.delete(s)},
  kick(){if(!this.raf&&this.set.size&&!document.hidden){this.last=performance.now();this.raf=requestAnimationFrame(this.loop)}},
  loop(t){const T=Ticker;T.raf=0;const dt=Math.min(.05,(t-T.last)/1000);T.last=t;T.set.forEach(s=>s.update(dt));if(T.set.size&&!document.hidden)T.raf=requestAnimationFrame(T.loop)}};
document.addEventListener('visibilitychange',()=>Ticker.kick());
const PLANT='<svg viewBox="0 0 64 92" aria-hidden="true"><ellipse cx="32" cy="87" rx="21" ry="4" fill="#576C56" opacity=".12"/><path d="M32 59C18 48 9 34 11 16C28 19 34 38 32 59Z" fill="var(--leaf-a)"/><path d="M32 59C38 41 44 25 58 17C60 39 45 53 32 59Z" fill="var(--leaf-b)"/><path d="M32 59C24 43 26 26 33 15C41 30 40 45 32 59Z" fill="var(--leaf-c)"/><path d="M32 59C31 43 24 31 16 24M33 57C40 42 49 32 54 25" stroke="#ECF7E6" stroke-opacity=".35" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M15 61L49 61L45 86Q32 92 20 86Z" fill="var(--pot)"/><path d="M33 63L49 63L45 86L34 89Z" fill="#927865" opacity=".17"/><path d="M13 60Q32 56 51 60L49 68Q32 71 15 67Z" fill="var(--pot-rim)"/><path d="M15 60Q32 57 49 60" fill="none" stroke="#FFF4E6" stroke-opacity=".45" stroke-width="2"/></svg>';
const SCENE_TREE=(x,y,scale=1,tone=0)=>`<g transform="translate(${x} ${y}) scale(${scale})" class="scene-tree"><ellipse cx="0" cy="3" rx="25" ry="5" fill="#5D795F" opacity=".14"/><g class="sw s${(Math.round(x)%3)+1}"><path d="M-5-1L-5-31L6-31L6 0Q0 3-5-1Z" fill="var(--wood)"/><path d="M-5-24L-5-31L2-31L2-2L-5-1Z" fill="#FFF1CC" opacity=".16"/><path d="M-29-43Q-27-64-18-75L-7-96Q-2-101 5-96L21-76Q32-65 29-42L19-29Q0-21-21-31Z" fill="var(--tree-a)"/><path d="M2-97L21-76Q32-65 29-42L19-29Q5-24-1-26L-1-55Z" fill="var(--tree-b)"/><path d="M-27-43Q-23-58-11-72L-3-92L-1-55L-15-36Z" fill="#E7EFD3" opacity=".31"/><path d="M-1-55L17-72L26-49L12-37L-1-26Z" fill="#436E62" opacity=".14"/><path d="M-19-33Q0-22 19-32" fill="none" stroke="#4D7963" stroke-opacity=".18" stroke-width="2" stroke-linecap="round"/></g></g>`;
const SCENE_BUSH=(x,y,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})"><ellipse cx="1" cy="1" rx="31" ry="5" fill="#607B60" opacity=".11"/><path d="M-27 0Q-28-15-16-20Q-13-31 1-27Q9-30 18-21Q29-19 29-5L25 0Z" fill="var(--bush)"/><path d="M0-27Q16-30 18-21Q29-19 29-5L25 0L0 0Z" fill="var(--tree-b)" opacity=".45"/><path d="M-24-10Q-18-23-5-23L-3-16Q-15-15-21-4Z" fill="#F5F4CF" opacity=".23"/></g>`;
const sceneHTML=g=>`<div class="sky"></div><div class="stars"></div><div class="orb"></div><div class="cloud c1"></div><div class="cloud c2"></div><div class="cloud c3"></div>
<svg class="hills lp cozy-landscape" viewBox="0 0 400 240" aria-hidden="true">
<!-- Far landscape: calm rolling ridge, with gently faceted material planes -->
<path d="M0 132Q27 107 54 92Q76 109 99 123Q133 102 182 66Q191 60 201 70Q244 105 267 116Q303 90 340 83Q372 101 400 113V240H0Z" fill="var(--mtn)" opacity=".72"/>
<path d="M182 66Q191 60 201 70L245 105L214 103L193 78L175 96Z" fill="#FFFFFF" opacity=".18"/>
<path d="M54 92L99 123L74 119L50 107Z" fill="#FFFFFF" opacity=".16"/>
<path d="M0 156Q56 121 105 140Q143 150 201 123Q263 95 322 129Q362 118 400 130V240H0Z" fill="var(--hill-y)"/>
<path d="M201 123Q263 95 322 129L273 136L237 121Z" fill="#FFFFFF" opacity=".13"/>
<path d="M0 184Q48 164 84 163Q125 153 167 164Q222 138 264 154Q323 142 400 155V240H0Z" fill="var(--hill-x)"/>
<path d="M0 184Q48 164 84 163L75 192L0 206Z" fill="#426E60" opacity=".08"/>
<path d="M167 164Q222 138 264 154L237 179L164 183Z" fill="#FAF2D9" opacity=".18"/>
<!-- Cottage: one coherent clay-and-wood miniature, softly lit windows -->
<g class="cozy-cottage" transform="translate(7 9)">
 <ellipse cx="50" cy="153" rx="50" ry="8" fill="#5B7664" opacity=".16"/>
 <path d="M23 112L23 148L86 148L86 113L55 95Z" fill="var(--wood)"/>
 <path d="M56 96L86 113L86 148L56 148Z" fill="#584B49" opacity=".19"/>
 <path d="M24 117L25 146L40 148L40 123Z" fill="#FFFFFF" opacity=".13"/>
 <path d="M38 125Q38 121 42 121H51V148H38Z" fill="#6C6258"/>
 <path d="M41 126H49V148H41Z" fill="#BBA58A"/>
 <circle cx="47" cy="137" r="1.8" fill="#F8E0AA"/>
 <path d="M65 120H78V134H65Z" fill="#F8E0A9"/>
 <path d="M68 123H75V131H68Z" fill="#FFF4D1"/>
 <path d="M71.5 120V134M65 127H78" stroke="#947D68" stroke-width="1.4"/>
 <path d="M13 118L55 80Q59 78 62 82L103 118L91 127L56 101L23 128Z" fill="var(--roof-a)"/>
 <path d="M56 82L103 118L91 127L56 101Z" fill="var(--roof-b)"/>
 <path d="M19 117L56 85L57 91L24 122Z" fill="#F0F6E0" opacity=".34"/>
 <path d="M62 95L91 118M52 93L30 113" stroke="#FFFFFF" opacity=".13" stroke-width="1.8"/>
 <path d="M82 87H92V103L82 99Z" fill="#AD8270"/>
 <path d="M86 85H94V89H85Z" fill="#C79C80"/>
 <path d="M22 146H86" stroke="#544B44" opacity=".2" stroke-width="2"/>
</g>
${SCENE_TREE(337,167,1.04)}${SCENE_TREE(255,164,.55)}${SCENE_TREE(375,166,.60)}${SCENE_TREE(153,162,.74)}
${SCENE_BUSH(15,175,.76)}${SCENE_BUSH(116,173,.56)}${SCENE_BUSH(301,174,.76)}${SCENE_BUSH(392,174,.62)}
<g opacity=".80"><path d="M105 171L111 163L122 165L127 172Z" fill="#B8B5A4"/><path d="M114 163L122 165L127 172L115 172Z" fill="#8D9E99" opacity=".55"/>
<path d="M197 173L202 166L210 168L213 174Z" fill="#C3BBA5" opacity=".75"/></g>
<!-- Tiny flowers are grouped, not scattered particles -->
<g fill="#FFF4D6" opacity=".82"><circle cx="122" cy="169" r="1.5"/><circle cx="127" cy="167" r="1.5"/><circle cx="288" cy="168" r="1.5"/><circle cx="293" cy="171" r="1.5"/></g>
<g fill="#D9B4A6" opacity=".72"><circle cx="125" cy="169" r="1.5"/><circle cx="291" cy="169" r="1.5"/></g>
</svg>
<div class="floor"><svg viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0Q90 8 140 3Q220-1 300 6Q354 7 400 1V100H0Z" fill="#F7F3CF" opacity=".065"/><path d="M0 38Q87 14 164 30Q260 47 400 14V67Q250 84 140 71Q46 60 0 80Z" fill="#638B65" opacity=".08"/><path d="M0 82Q78 61 163 77Q253 91 400 62V100H0Z" fill="#D7DEB9" opacity=".08"/><ellipse cx="323" cy="22" rx="24" ry="4" fill="#FFFCE5" opacity=".13"/><path d="M43 32l2-5 3 5M365 68l3-5 3 5" fill="none" stroke="#F1F5D5" stroke-width="1.6" opacity=".28" stroke-linecap="round"/></svg></div><div class="rug"></div><div class="plant">${PLANT}</div>${g?'<div class="guide-g"></div><div class="guide-c"></div>':''}
<div class="a-shadow"><i></i></div><div class="fx"></div>
<div class="actor" data-state="idle"><div class="a-flip"><div class="a-tilt"><div class="a-pose"><div class="a-squash"><div class="art"><div class="adj"></div></div></div></div></div></div><div class="bubble"></div><div class="mood"><span class="mh"><svg viewBox="0 0 24 24"><path d="M12 20.5s-8-4.9-8-11A4.6 4.6 0 0 1 12 6.9a4.6 4.6 0 0 1 8 2.6c0 6.1-8 11-8 11z" fill="currentColor"/></svg></span><span class="mx">!</span></div><div class="zzz"><b>z</b><b>z</b><b>Z</b></div></div>`;
const phaseNow=()=>{const d=new Date(),h=d.getHours()+d.getMinutes()/60;return h>=5&&h<8?'dawn':h>=8&&h<16.5?'day':h>=16.5&&h<19?'dusk':'night'};
const G=1900;

/* ==========================================================
   行為系統（Behavior System）
   ----------------------------------------------------------
   · 每個行為是一份 def：{id,cat,state,pose,w,can,cd,cdg,enter,tick,exit,land,low,up,fat,max}
   · state 只是「粗分類」（idle／walk／sleep／crouch／hop），沿用既有 CSS 與 onState；
     細部行為以 data-beh／data-ph 呈現，之後的動畫素材可直接掛在這兩個屬性上。
   · 選擇權重 = def.w × Behaviors.mods 的各個修飾器。個性、生活需求、作息、場景互動
     只要 addModifier() 調整權重，或 register() 新增行為即可，不必動引擎。
   · Behaviors.anim()：保留給使用者匯入動畫（Sprite Sheet 等）的接點，目前回傳 null，沿用 SVG／CSS。
   ========================================================== */
const ease=t=>t*t*(3-2*t);
/* 姿勢 [scaleX, scaleY, 前傾角度, 垂直位移(佔角色大小比例)]。皆為輕微形變，由彈簧平滑過渡 */
const POSE={
  stand:[1,1,0,0],walk:[1,1,2.2,0],run:[1,.985,5,0],turn:[.93,.975,0,0],
  sitPre:[1.04,.93,3,0],crouchLite:[1.05,.9,2,0],sit:[1.045,.875,0,0],rest:[1.06,.85,-1.6,0],doze:[1.055,.855,0,0],
  sleep:[1.05,.9,0,0],rise:[.985,1.03,0,0],stretchUp:[.95,1.075,-4.5,0],stretchBow:[1.065,.885,7,0]};
const SPK=[170,170,150,200],SPZ=[.62,.5,.7,.8],SPC=SPK.map((k,i)=>2*SPZ[i]*Math.sqrt(k));
/* 活躍程度：移動速度、待機長度、各類行為頻率 */
const ACTP={quiet:{spd:.72,idle:1.55,move:.55,play:.3,rest:1.45},normal:{spd:1,idle:1,move:1,play:1,rest:1},lively:{spd:1.25,idle:.68,move:1.55,play:1.8,rest:.65}};
const ACTR=Object.fromEntries(Object.entries(ACTP).map(([k,v])=>[k,Object.assign({},v,{spd:v.spd*.8,play:v.play*.5,move:v.move*.8})]));
const Behaviors={defs:{},mods:[],
  register(d){this.defs[d.id]=d;return d},
  addModifier(f){this.mods.push(f)},
  anim(s,id){const a=s.ch&&s.ch.anims;return a&&a[id]||null}};
const BH=Behaviors;

/* ---------- 散步（含轉身、途中停步、減速、邊界處理） ---------- */
const WALK={
  pick(s,b){const lo=s.lo(),hi=s.hi(),o=b.o;let g=o.goal;
    if(g==null){const c=s.ctx();let d=Math.random()<.68?s.dir:-s.dir;
      if(s.x<lo+s.size*.45)d=1;else if(s.x>hi-s.size*.45)d=-1;
      g=s.x+d*(s.size*rnd(.9,2.6)+s.W*.08);
      if(c.rain)g=s.spots.rug+rnd(-.5,.5)*s.size*1.6;
      g=clamp(g,lo,hi);
      if(Math.abs(g-s.x)<s.size*.45){g=clamp(s.x<(lo+hi)/2?s.x+s.size*rnd(.9,1.5):s.x-s.size*rnd(.9,1.5),lo,hi)}}
    return clamp(g,lo,hi)},
  enter(s,b){const o=b.o;b.g=WALK.pick(s,b);b.nd=b.g>=s.x?1:-1;
    b.v0=rnd(.92,1.08)*(o.call?1.25:1)*(o.fast?2.1:1);
    const dist=Math.abs(b.g-s.x);
    b.pz=(o.goal==null&&!o.fast&&dist>s.size*1.4&&Math.random()<.4)?s.x+(b.g-s.x)*rnd(.4,.65):null;
    b.lb=Math.random()<.35;
    if(b.nd!==s.dir&&dist>=3){s.ph(b,'turn');b.flip=0}else WALK.go(s,b)},
  go(s,b){b.ph='go';b.t=0;b.st='walk';s.setState('walk');
    const f=clamp(s.prof().spd*b.v0,.75,2.4),d=((b.o.fast ? .44 : .58)/f).toFixed(2)+'s';
    s.actor.style.setProperty('--wk',d);s.shadow.style.setProperty('--wk',d);
    s.actor.dataset.ph=b.o.fast?'run':'go';s.shadow.dataset.ph=b.o.fast?'run':'go'},
  tick(s,b,dt){const lo=s.lo(),hi=s.hi();b.g=clamp(b.g,lo,hi);
    if(b.ph==='turn'){if(!b.flip&&b.t>.09){s.dir=b.nd;b.flip=1}if(b.t>=.34){s.dir=b.nd;WALK.go(s,b)}return}
    if(b.ph==='pause'){b.pt+=dt;if(b.lb&&!b.lbd&&b.pt>.55){s.dir=-b.nd;b.lbd=1}
      if(b.pt>=b.pd){if(s.dir!==b.nd){b.ph='turn';b.t=0;b.flip=0;s.actor.dataset.ph='turn';s.shadow.dataset.ph='turn'}else WALK.go(s,b)}return}
    const d=b.g-s.x,ad=Math.abs(d),sg=Math.sign(d)||b.nd;
    if(sg!==b.nd&&ad>3){b.nd=sg;b.ph='turn';b.t=0;b.flip=0;b.st='idle';s.setState('idle');return}
    if(b.pz!=null&&(s.x-b.pz)*b.nd>=0&&ad>s.size*.5){b.pz=null;b.ph='pause';b.pt=0;b.pd=rnd(1.2,2.4);b.st='idle';s.setState('idle');s.ws=b.nd*s.size*.12;s.actor.dataset.ph='pause';return}
    const sp=s.size*.22*s.prof().spd*b.v0,r=.12+.88*ease(clamp(b.t/.55,0,1)),br=.35+.65*clamp(ad/(s.size*.3),0,1),v=sp*r*br,step=v*dt;
    if(ad<=step+.5){s.x=b.g;s.ws=0;WALK.arrive(s,b);return}
    s.x+=sg*step;s.ws=sg*v},
  arrive(s,b){const o=b.o;let n=o.after,op=o.afterOpts;
    if(!n){const lo=s.lo(),hi=s.hi();
      if(s.x<lo+s.size*.4){n='look';op={face:1}}else if(s.x>hi-s.size*.4){n='look';op={face:-1}}
      else if(o.fast){s.squash(.12);if(Math.random()<.4)n='wiggle'}}
    s.finish(n,op)},
  pose:(s,b)=>b.ph==='go'?(b.o.fast?'run':'walk'):b.ph==='turn'?'turn':'stand'};

/* ---------- 行為定義 ---------- */
BH.register({id:'stand',cat:'misc',state:'idle',up:true,pose:'stand',fat:.003,
  enter(s,b){b.dur=(b.o.dur||rnd(1.6,4.2))*s.prof().idle},
  tick(s,b){if(b.t>=b.dur){if(s.autoOn())s.choose();else s.go('stand')}}});
BH.register({id:'stroll',cat:'move',state:'idle',up:true,w:()=>40,fat:.008,max:45,pose:WALK.pose,enter:WALK.enter,tick:WALK.tick});
BH.register({id:'shelter',cat:'move',state:'idle',up:true,w:c=>c.rain?22:0,cd:55,fat:.008,max:45,pose:WALK.pose,
  can:(s)=>Math.abs(s.x-s.spots.rug)>s.size*.35,
  enter(s,b){b.o=Object.assign({goal:s.spots.rug+rnd(-.3,.3)*s.size,after:'sit',afterOpts:{shelter:1}},b.o);WALK.enter(s,b)},tick:WALK.tick});
BH.register({id:'visit',cat:'move',state:'idle',up:true,w:()=>6,cd:40,fat:.008,max:45,pose:WALK.pose,
  can:(s)=>Math.abs(s.x-s.spots.plant)>s.size*.5,
  enter(s,b){b.o=Object.assign({goal:s.spots.plant,after:'look',afterOpts:{face:-1}},b.o);WALK.enter(s,b)},tick:WALK.tick});
BH.register({id:'dash',cat:'play',cdg:'play',state:'idle',up:true,w:()=>4,cd:28,fat:.03,max:20,pose:WALK.pose,
  enter(s,b){const mid=(s.lo()+s.hi())/2;b.o=Object.assign({fast:1,goal:s.x<mid?s.hi()-s.size*rnd(0,.3):s.lo()+s.size*rnd(0,.3)},b.o);WALK.enter(s,b)},tick:WALK.tick});

BH.register({id:'look',cat:'misc',state:'idle',up:true,w:()=>9,cd:8,pose:(s,b)=>((b.a&&b.t-b.t1<.3)||(b.b&&b.t-b.t2<.3))?'turn':'stand',
  enter(s,b){b.dur=rnd(2.6,3.6);b.f=b.o.face!=null?b.o.face:-s.dir;b.t1=rnd(.5,.8);b.t2=b.t1+1.5;b.back=b.o.face==null&&Math.random()<.4},
  tick(s,b){if(!b.a&&b.t>=b.t1){s.dir=b.f;b.a=1}
    if(b.back&&!b.b&&b.t>=b.t2){s.dir=-b.f;b.b=1}
    if(b.a)s.ov[2]+=Math.sin(clamp((b.t-b.t1)/1.4,0,1)*Math.PI)*1.2;
    if(b.t>=b.dur)s.finish(null)}});

BH.register({id:'sit',cat:'rest',state:'idle',low:true,w:()=>13,cd:12,fat:-.015,pose:(s,b)=>b.t<.2?'sitPre':'sit',
  enter(s,b){b.dur=rnd(4,8)*s.prof().rest*(b.o.shelter?1.6:1)},
  tick(s,b){if(b.t>=b.dur){const c=s.ctx(),p=clamp(.3+c.fat*.5+(c.phase==='night'?.2:0)+(c.rain?.25:0)+(b.o.shelter?.3:0),0,.92);
    s.finish(Math.random()<p?'rest':null)}}});
BH.register({id:'rest',cat:'rest',state:'idle',low:true,fat:-.025,pose:'rest',
  enter(s,b){b.dur=rnd(8,15)*s.prof().rest},
  exit(s){s.eyes(false)},
  tick(s,b){if(!b.e1&&b.t>.9){s.eyes(true);b.e1=1}
    if(b.e1&&!b.e2&&b.t>=b.dur-1){s.eyes(false);b.e2=1}
    if(b.t>=b.dur){const c=s.ctx(),p=clamp(.12+c.fat*.55+(c.phase==='night'?.25:0),0,.85);
      s.finish(Math.random()<p?'doze':Math.random()<.5?'stretch':null)}}});
BH.register({id:'doze',cat:'rest',state:'idle',low:true,sleepy:true,quiet:true,fat:-.02,pose:'doze',max:40,
  enter(s,b){b.dur=rnd(7,13);b.o2=true;s.eyes(true)},
  exit(s){s.eyes(false)},
  tick(s,b){const T=3.4,k=(b.t%T)/T;let r=0;
    if(k<.7)r=ease(k/.7);else if(k<.78)r=1-(k-.7)/.08;
    s.ov[2]+=r*6;s.ov[3]+=r*.012;
    const open=k>=.7&&k<.86;if(open===b.o2){b.o2=!open;s.eyes(!open)}
    if(b.t>=b.dur){const c=s.ctx(),p=(c.phase==='night'?.65:.2)+c.fat*.3;
      if(Math.random()<p)s.finish('sleep',{soft:1});else s.finish(Math.random()<.5?'stretch':null)}}});
BH.register({id:'sleep',cat:'sleep',state:'idle',low:true,sleepy:true,quiet:true,fat:-.05,max:150,
  w:c=>c.phase==='night'?15:c.fat>.75?3:.5,cd:40,
  pose:(s,b)=>b.ph==='sleep'?'sleep':'sit',
  enter(s,b){const c=s.ctx();s.ph(b,'settle');b.sd=b.pl?.5:1.5;
    b.dur=(c.phase==='night'?rnd(26,48):rnd(13,24))*(b.o.forced?.8:1)*Math.min(1.4,c.p.rest);s.eyes(!!b.pl)},
  exit(s){s.eyes(false)},
  tick(s,b){
    if(b.ph==='settle'){if(b.t>=b.sd){s.ph(b,'sleep');b.t=0;b.st='sleep';s.setState('sleep');s.eyes(true)}}
    else if(b.ph==='sleep'){if(b.t>=b.dur)s.sleepWake(b,false)}
    else{if(b.t>=.7&&s.actor.dataset.eyes)s.eyes(false);
      if(b.t>=1.1&&!b.said){b.said=1;if(!b.manual&&Math.random()<.5)s.say(pick(linesOf(s.ch).wake))}
      if(b.t>=1.8)s.finish(Math.random()<(b.manual?.35:.65)?'stretch':null)}}});
BH.register({id:'startle',cat:'misc',state:'idle',quiet:true,pose:'rise',enter(s,b){b.dur=1},tick(s,b){if(b.t>=b.dur)s.finish(null)}});
BH.register({id:'rise',cat:'misc',state:'idle',pose:(s,b)=>b.t<.2?'sitPre':'stand',
  tick(s,b){if(b.t>=.42){const n=b.o.nx;s.finish(n?n[0]:null,n?n[1]:null)}}});

BH.register({id:'stretch',cat:'misc',state:'idle',up:true,w:()=>5,cd:45,pose:(s,b)=>b.ph==='bow'?'stretchBow':'stretchUp',
  enter(s,b){s.ph(b,'up');b.dur=2.7},
  tick(s,b){if(b.ph==='up'&&b.t>=.9)s.ph(b,'hold');
    else if(b.ph==='hold'){s.ov[2]+=Math.sin(b.t*34)*.6;s.ov[1]+=Math.sin(b.t*30)*.004;if(b.t>=1.6)s.ph(b,'bow')}
    if(b.ph==='bow'&&b.t>=2.05&&!b.sq){b.sq=1;s.squash(.05)}
    if(b.t>=b.dur)s.finish(null)}});
BH.register({id:'wiggle',cat:'play',cdg:'play',state:'idle',up:true,w:()=>5,cd:28,fat:.03,pose:'stand',
  enter(s,b){b.dur=2.4;s.hearts(1)},
  tick(s,b){const k=Math.max(0,Math.min(1,b.t/.35,(b.dur-b.t)/.4)),w=Math.sin(b.t*8.5);
    s.ov[2]+=w*5*k;s.ov[1]+=Math.sin(b.t*17)*.018*k;s.ov[3]-=Math.abs(w)*.012*k;
    if(b.t>=b.dur)s.finish(null)}});
BH.register({id:'bounce',cat:'play',cdg:'play',state:'idle',up:true,w:()=>6,cd:28,fat:.03,max:12,pose:(s,b)=>b.ph==='pre'?'crouchLite':'stand',
  enter(s,b){b.hops=Math.random()<.5?2:3;s.ph(b,'pre')},
  tick(s,b){if(b.ph==='pre'&&b.t>=.16){s.vy=Math.sqrt(2*G*s.size*rnd(.15,.21));s.vx=0;b.hops--;b.st='hop';s.ph(b,'air');s.setState('hop')}},
  land(s,b){s.squash(.11);if(b.hops<=0)s.finish(null);else{s.ph(b,'pre');b.t=0}}});
BH.register({id:'hop',cat:'play',state:'crouch',up:true,w:()=>6,cd:18,fat:.02,max:8,pose:'stand',
  enter(s,b){s.pend=b.o.p||560;s.setState('crouch',.13)},
  land(s){s.finish(null)}});

/* ---------- 修飾器：活躍程度、天氣、時段、疲勞、避免重複 ---------- */
BH.addModifier((d,c)=>{const p=c.p;return d.cat==='move'?p.move:d.cat==='play'?p.play:(d.cat==='rest'||d.cat==='sleep')?p.rest:1});
BH.addModifier((d,c)=>{const w=c.wx,id=d.id,play=d.cat==='play',walk=id==='stroll'||id==='visit';
  if(w==='rain')return play?.25:walk?.5:id==='sit'?1.8:1;
  if(w==='storm')return play?.1:walk?.3:id==='sit'?2.2:1;
  if(w==='sunny')return play?1.35:id==='stroll'?1.3:id==='visit'?1.2:id==='stretch'?1.2:1;
  if(w==='snow')return play?1.3:id==='stroll'?.9:1;
  if(w==='fog')return play?.6:id==='stroll'?.7:1;
  return 1});
BH.addModifier((d,c)=>{const ph=c.phase,id=d.id,play=d.cat==='play',walk=id==='stroll'||id==='visit';
  if(ph==='night')return play?.25:walk?.5:id==='sit'?1.6:1;
  if(ph==='dawn')return id==='stretch'?2.6:id==='stroll'?1.1:play?.8:1;
  if(ph==='dusk')return id==='sit'?1.3:play?.8:1;
  return 1});
BH.addModifier((d,c)=>{const f=c.fat;
  return d.cat==='rest'?1+f*2.2:d.cat==='sleep'?.6+f*2.2:d.cat==='play'?Math.max(.15,1-f*.9):d.cat==='move'?Math.max(.35,1-f*.55):1});
BH.addModifier((d,c,s)=>{const h=s.hist,l=h[h.length-1];if(l===d.id)return .08;
  let m=h.indexOf(d.id)>=0?.55:1;const ld=BH.defs[l];if(ld&&d.cdg&&ld.cdg===d.cdg)m*=.6;return m});


class Stage{
  constructor(root,o={}){
    this.root=root;this.o=Object.assign({auto:true,guides:false,size:(W,H)=>H*.6,onState:null},o);
    root.innerHTML=sceneHTML(this.o.guides);
    const q=s=>$(s,root);
    this.actor=q('.actor');this.flip=q('.a-flip');this.tiltEl=q('.a-tilt');this.sqEl=q('.a-squash');this.poseEl=q('.a-pose');this.art=q('.art');this.adj=q('.adj');
    this.shadow=q('.a-shadow');this.fx=q('.fx');this.bubble=q('.bubble');
    Object.assign(this,{x:0,h:0,vx:0,vy:0,dir:1,flipBase:1,state:'idle',t:0,dur:2,target:0,blinkT:2,talkT:rnd(10,20),tilt:0,pvx:0,pvy:0,W:0,H:0,size:150,minX:0,maxX:0,feetY:0,hitTop:100,running:false,placed:false,drag:null,intro:false,ch:null,lastRender:'',
      P:[1,1,0,0],PV:[0,0,0,0],PT:[1,1,0,0],ov:[0,0,0,0],pT:'',B:null,cool:{},hist:[],fat:rnd(.05,.25),ws:0,life:0,lifeTg:0,lifeT:rnd(2,5),defer:null,spots:{rug:0,plant:0}});
    this.setPhase();this.bindPointer();
    this.ro=new ResizeObserver(()=>this.measure());this.ro.observe(root);
    this.phT=setInterval(()=>this.setPhase(),60000);
  }
  setPhase(){const p=phaseNow();this.phase=p;this.root.dataset.phase=p}
  measure(){
    const W=this.root.clientWidth,H=this.root.clientHeight;if(!W||!H)return;
    this.W=W;this.H=H;this.size=Math.round(this.o.size(W,H));this.root.style.setProperty('--asz',this.size+'px');
    this.minX=-this.size*.12;this.maxX=W-this.size*.88;
    if(!this.placed){this.x=(W-this.size)/2;this.placed=true}
    this.x=clamp(this.x,this.minX,this.maxX);this.calcSpots();
    this.feetY=this.actor.offsetTop+this.actor.offsetHeight;
    this.metrics();
    if(this.intro){this.intro=false;this.startIntro()}
    this.render(true)}
  metrics(){const c=this.ch;if(!c||!this.size)return;
    const demo=!c.url,fh=demo?.97:Math.min(1,(c.h||1)/(c.w||1)),fw=demo?.82:Math.min(1,(c.w||1)/(c.h||1));
    const top=this.size*fh*c.scale-this.size*c.oy/100;this.hitTop=Math.max(30,top);
    this.root.style.setProperty('--btop',Math.max(24,top-8)+'px');
    this.root.style.setProperty('--shw',clamp(fw*c.scale*.62,.22,1.1).toFixed(3))}
  setChar(ch,intro){
    this.interrupt();this.cool={};this.hist=[];this.ws=0;this.ch=ch;this._pk=null;this.adj.innerHTML=artHTML(ch);this.actor.dataset.kind=ch.kind;this.hideBubble();
    this.applyAdjust();
    if(intro){if(this.W)this.startIntro();else this.intro=true}}
  applyAdjust(){const c=this.ch;if(!c)return;
    this.adj.style.transform=`translate(${c.ox}%,${c.oy}%) scale(${c.scale})`;
    this.flipBase=c.facing==='left'?-1:1;this.metrics();this.render(true)}
  startIntro(){this.interrupt();this.ws=0;this.h=Math.min(this.H*.55,420);this.vy=0;this.vx=0;this.greet=true;this.setState('fall');}
  setState(s,dur){this.state=s;this.t=0;this.dur=dur||0;this.actor.dataset.state=s;this.shadow.dataset.st=s;if(this.o.onState)this.o.onState(s)}
  act(){const a={quiet:.6,normal:1,lively:1.5}[Cfg.v.activity]||1;return document.documentElement.dataset.motion==='reduce'?a*.7:a}
  prof(){const T=document.documentElement.dataset.motion==='reduce'?ACTR:ACTP,b=T[Cfg.v.activity]||T.normal,m=this.ch&&this.ch.mind;if(!m)return b;
    const k=(this.ch.id)+'|'+Cfg.v.activity+'|'+(b.spd)+'|'+m.spd+m.idle+m.move+m.play+m.rest;if(this._pk===k)return this._pv;
    this._pk=k;return this._pv={spd:b.spd*m.spd,idle:b.idle*m.idle,move:b.move*m.move,play:b.play*m.play,rest:b.rest*m.rest}}
  start(){if(!this.running){this.running=true;Ticker.add(this)}}
  stop(){this.running=false;Ticker.del(this)}
  destroy(){this.stop();this.ro.disconnect();clearInterval(this.phT);clearTimeout(this.bt);this._destroyed=true;this._communityListeners?.abort();
    if(typeof Env!=='undefined'){Env.st.delete(this);Env.rt=Env.rt.filter(e=>e.stage!==this)}window.OCS24D?.Dress.stages.delete(this)}
  /* --- 範圍、場景定點、環境脈絡 --- */
  autoOn(){return !!(this.o.auto&&Cfg.v.auto)}
  lo(){return this.minX+this.size*.06}
  hi(){return this.maxX-this.size*.06}
  calcSpots(){const W=this.W,sz=this.size,lo=this.lo(),hi=this.hi();
    this.spots={rug:clamp((W-sz)/2,lo,hi),plant:clamp(W*.06+sz*.36-sz*.22,lo,hi)}}
  ctx(){const w=(typeof Env!=='undefined'&&Env.wid)||'sunny';
    return{phase:this.phase||'day',wx:w,rain:w==='rain'||w==='storm',fat:this.fat,p:this.prof()}}
  /* --- 行為引擎 --- */
  begin(id,o){const d=BH.defs[id]||BH.defs.stand,pl=!!(this.B&&this.B.def.low);this.endB();
    const b={def:d,id:d.id,t:0,ph:'',o:o||{},st:d.state||'idle',dur:0,pl};this.B=b;
    this.actor.dataset.beh=d.id;
    if(d.w){this.hist.push(d.id);if(this.hist.length>5)this.hist.shift()}
    this.setState(b.st,0);if(d.enter)d.enter(this,b);
    if(this.o.onBeh)this.o.onBeh(d.id,b)}
  endB(){const b=this.B;if(!b)return;this.B=null;const d=b.def;if(d.exit)d.exit(this,b);
    if(d.cd){const c=d.cd*rnd(.85,1.25);this.cool[d.id]=c;if(d.cdg)this.cool[d.cdg]=Math.max(this.cool[d.cdg]||0,c*.7)}
    const a=this.actor.dataset;delete a.ph;delete a.eyes;a.beh=''}
  interrupt(){this.endB();this.defer=null}
  go(id,o){const d=BH.defs[id]||BH.defs.stand,c=this.B&&this.B.def;
    if(c&&c.low&&d.up&&d.id!==c.id){this.begin('rise',{nx:[d.id,o]});return}
    this.begin(d.id,o)}
  finish(n,o){if(!this.B)return;this.go(n||'stand',o)}
  choose(){const c=this.ctx(),L=[];let tot=0;
    for(const id in BH.defs){const d=BH.defs[id];
      if(!d.w||this.cool[id]>0||(d.cdg&&this.cool[d.cdg]>0))continue;
      if(d.can&&!d.can(this,c))continue;
      let w=d.w(c,this);if(!(w>0))continue;
      for(const m of BH.mods){const k=m(d,c,this);if(k!=null)w*=k}
      if(w>0){L.push([id,w]);tot+=w}}
    if(!tot){this.go('stand');return}
    let r=Math.random()*tot;for(const[id,w]of L){if((r-=w)<=0){this.go(id);return}}
    this.go(L[L.length-1][0])}
  tickBeh(dt){let b=this.B;if(!b){this.begin('stand');b=this.B}
    if(b.st!==this.state){this.begin('stand');return}
    const d=b.def;b.t+=dt;this.fat=clamp(this.fat+(d.fat==null?.003:d.fat)*dt,0,1);
    if(b.t>(d.max||90)){this.finish(null);return}
    if(d.tick)d.tick(this,b,dt)}
  eyes(on){const a=this.actor.dataset;if(on){if(a.eyes!=='closed')a.eyes='closed'}else if(a.eyes)delete a.eyes}
  ph(b,v){b.ph=v;this.actor.dataset.ph=v;this.shadow.dataset.ph=v}
  sleeping(){const b=this.B;return this.state==='sleep'||!!(b&&b.id==='sleep')}
  /* --- 姿勢（彈簧）：站立／坐下／伸展之間柔和過渡，保留輕微彈性 --- */
  poseName(){const st=this.state;if(st!=='idle'&&st!=='walk'&&st!=='sleep')return'stand';
    const b=this.B;if(!b)return'stand';const p=b.def.pose;return typeof p==='function'?p(this,b):(p||'stand')}
  stepPose(dt){const P=this.P,V=this.PV,o=this.ov,g=POSE[this.poseName()]||POSE.stand,T=this.PT;let mv=false;
    for(let i=0;i<4;i++){let t=g[i]+o[i];if(i===2)t*=this.flipBase;T[i]=t;
      V[i]+=(SPK[i]*(t-P[i])-SPC[i]*V[i])*dt;P[i]+=V[i]*dt;
      if(Math.abs(t-P[i])>.0007||Math.abs(V[i])>.006)mv=true}
    if(!mv)for(let i=0;i<4;i++){P[i]=T[i];V[i]=0}
    const sx=clamp(P[0],.86,1.14),sy=clamp(P[1],.78,1.12),r=clamp(P[2],-14,14);
    const s=`translate3d(0,${(P[3]*this.size).toFixed(2)}px,0) rotate(${r.toFixed(2)}deg) scale(${sx.toFixed(3)},${sy.toFixed(3)})`;
    if(s!==this.pT){this.pT=s;this.poseEl.style.transform=s}}
  /* 站著或坐著時的細微重心變化 */
  stepLife(dt){const b=this.B;let amp=0;if(this.state==='idle'&&b)amp=b.def.low?.5:b.id==='stand'?1:0;
    this.lifeT-=dt;if(this.lifeT<=0){this.lifeT=rnd(3,8);this.lifeTg=Math.random()<.3?0:rnd(-1,1)}
    this.life+=(this.lifeTg-this.life)*(1-Math.exp(-1.4*dt));
    if(amp){this.ov[2]+=this.life*1.3*amp;this.ov[0]+=this.life*.007*amp}}
  /* --- 外部操作（點擊、撫摸、拖曳、快捷鍵、預覽）：一律優先於自主行為 --- */
  play(n){if(this.state==='held'||this.h>0)return;
    switch(n){
      case 'walk':this.go('stroll');break;
      case 'sleep':{const b=this.B;if(b&&b.id==='sleep'&&b.ph!=='wake')return;this.go('sleep',{forced:1});break}
      case 'happy':this.interrupt();this.setState('happy',1.8);this.hearts(3);break;
      case 'hop':this.hop();break;
      default:this.go('stand')}}
  walkTo(tx,o){if(this.state==='held'||this.h>0)return;this.go('stroll',Object.assign({goal:clamp(tx,this.lo(),this.hi())},o))}
  hop(p=560){if(this.h>0||this.state==='held')return;this.go('hop',{p})}
  wake(){const b=this.B;
    if(b&&b.id==='sleep'&&b.ph!=='wake')this.sleepWake(b,true);
    else if(this.state==='sleep'){this.interrupt();this.begin('startle')}
    else if(b&&b.def.low)this.go('stand');
    this.say(pick(linesOf(this.ch).wake))}
  sleepWake(b,manual){b.ph='wake';b.t=0;b.st='idle';b.manual=manual;this.setState('idle');this.eyes(true);this.actor.dataset.ph='wake'}
  pet(){if(this.state==='held')return;buzz(12);
    const b=this.B;
    if(this.state==='sleep'||(b&&b.def.sleepy)){this.interrupt();this.begin('startle');if(this.h===0)this.vy=300;this.say(pick(linesOf(this.ch).wake));this.squash(.2);return}
    this.interrupt();this.setState('happy',1.9);if(this.h===0)this.vy=260;this.squash(.15);this.hearts(this.ch.mind?this.ch.mind.hearts:3);this.say(pick(linesOf(this.ch).pet))}
  callTo(){if(this.state==='held'||this.h>0)return;
    this.go('stroll',{goal:clamp((this.W-this.size)/2,this.lo(),this.hi()),call:1});this.say(Persona.pick(this.ch,'call','來囉～'))}
  /* --- 更新 --- */
  update(dt){
    if(!this.W||!this.ch)return;
    this.blinkT-=dt;if(this.blinkT<=0){this.blink();this.blinkT=rnd(2.4,6)}
    const ov=this.ov;ov[0]=ov[1]=ov[2]=ov[3]=0;
    if(this.defer&&(this.defer.t-=dt)<=0){const f=this.defer.fn;this.defer=null;f.call(this)}
    for(const k in this.cool){if((this.cool[k]-=dt)<=0)delete this.cool[k]}
    const st=this.state;
    if(st==='held'){this.pvx*=Math.exp(-7*dt);this.pvy*=Math.exp(-7*dt);this.ws=0}
    else if(this.h>0||this.vy!==0){
      this.ws=0;this.vy-=G*dt;this.h+=this.vy*dt;this.x+=this.vx*dt;this.vx*=Math.exp(-.35*dt);
      if(this.x<this.minX){this.x=this.minX;this.vx=Math.abs(this.vx)*.5}else if(this.x>this.maxX){this.x=this.maxX;this.vx=-Math.abs(this.vx)*.5}
      if(this.h<=0){const imp=-this.vy;this.h=0;
        if(imp>240)this.squash(clamp(imp/2600,.1,.26));
        if(imp>150){this.vy=imp*.26;this.vx*=.6}else{this.vy=0;this.vx=0;this.landed()}}
    }else{
      this.t+=dt;
      switch(this.state){
        case 'crouch':if(this.t>=this.dur){this.vy=this.pend||560;this.vx=this.dir*rnd(0,50)*this.act();this.setState('hop');if(this.B)this.B.st='hop'}break;
        case 'hop':case 'fall':this.landed();break;
        case 'happy':if(this.t>=this.dur){this.interrupt();this.go('stand')}break;
        default:this.tickBeh(dt)}
      /* 動作切換時的慣性滑行，避免突然停住 */
      if(this.state!=='walk'&&Math.abs(this.ws)>2){this.x=clamp(this.x+this.ws*dt,this.minX,this.maxX);this.ws*=Math.exp(-9*dt)}else if(this.state!=='walk')this.ws=0;
      if(this.o.auto&&Cfg.v.auto&&Cfg.v.bubbles&&(this.state==='idle'||this.state==='walk')&&!(this.B&&this.B.def.quiet)){this.talkT-=dt;if(this.talkT<=0){this.say(pick(linesOf(this.ch).idle));this.talkT=rnd(20,42)*((this.ch.mind&&this.ch.mind.talk)||1)}}
      this.stepLife(dt)
    }
    this.tilt+=((this.state==='held'?clamp(this.pvx/42,-20,20):0)-this.tilt)*(1-Math.exp(-12*dt));
    this.stepPose(dt);
    this.render()}
  landed(){const was=this.state;
    if(was==='hop'||was==='fall'){const b=this.B;this.setState('idle',0);
      if(b&&b.def.land){b.st='idle';b.def.land(this,b)}else this.go('stand')}
    if(this.greet){this.greet=false;const hr=new Date().getHours();this.say(Persona.greet(this.ch,hr<5?'夜深了，還沒睡嗎？':hr<11?'早安，今天也請多指教。':hr<14?'午安，記得吃飯喔。':hr<18?'下午好～休息一下吧。':'晚上好，今天辛苦了。'))}
    else if(this.droppedMsg){this.droppedMsg=false;this.say(pick(linesOf(this.ch).drop))}}
  render(force){
    const key=`${this.x.toFixed(1)}|${this.h.toFixed(1)}|${this.dir}|${this.tilt.toFixed(1)}|${this.vy>0?1:this.h>0?2:0}|${this.pT}`;
    if(!force&&key===this.lastRender)return;this.lastRender=key;
    this.actor.style.transform=`translate3d(${this.x}px,${-this.h}px,0)`;
    /* 陰影：離地縮小；坐下時略寬略深，貼近地面 */
    const s=clamp(1-this.h/(this.size*1.7),.4,1),P=this.P,sw=clamp(P[0],.9,1.12),lo=clamp(1-P[1],-.1,.2);
    this.shadow.style.transform=`translate3d(${this.x}px,0,0) scale(${(s*sw*(1+lo*.5)).toFixed(3)})`;this.shadow.style.opacity=Math.min(1,s*(1+lo*.8)).toFixed(2);
    this.flip.style.transform=`scaleX(${this.ch&&!this.ch.url&&this.ch.look&&this.ch.look.head&&!this.adj.classList.contains('uplay') ? -this.dir*this.flipBase : this.dir*this.flipBase})`;
    this.tiltEl.style.transform=this.tilt?`rotate(${this.tilt.toFixed(1)}deg)`:'';
    const air=this.h>0?(this.vy>0?'up':'down'):'';if(this.actor.dataset.air!==air){air?this.actor.dataset.air=air:delete this.actor.dataset.air}}
  /* --- 表現 --- */
  blink(){if(this.state==='sleep'||this.actor.dataset.eyes)return;this.actor.classList.add('blink');setTimeout(()=>this.actor.classList.remove('blink'),110);if(Math.random()<.2)setTimeout(()=>{this.actor.classList.add('blink');setTimeout(()=>this.actor.classList.remove('blink'),100)},230)}
  squash(a=.18){const e=this.sqEl;e.style.setProperty('--sq',a);e.classList.remove('sq');void e.offsetWidth;e.classList.add('sq');e.addEventListener('animationend',()=>e.classList.remove('sq'),{once:true})}
  hearts(n=3){if(this.fx.childElementCount>10)return;
    for(let i=0;i<n;i++){const h=document.createElement('span');h.className='heart';h.innerHTML=HEART;
      h.style.left=(this.x+this.size*rnd(.34,.62))+'px';h.style.top=(this.feetY-this.h-this.hitTop)+'px';
      h.style.setProperty('--dx',rnd(-28,28)+'px');h.style.animationDelay=i*110+'ms';
      this.fx.appendChild(h);h.addEventListener('animationend',()=>h.remove(),{once:true})}}
  say(text,dur=2800){
    if(!Cfg.v.bubbles||!this.W)return;text=Persona.style(this.ch,text);const b=this.bubble;b.textContent=text;
    const bw=b.offsetWidth,cx=this.x+this.size/2,left=clamp(cx-bw/2,10,this.W-10-bw);
    b.style.setProperty('--bx',(left-(cx-bw/2)).toFixed(1)+'px');
    b.classList.add('show');clearTimeout(this.bt);this.bt=setTimeout(()=>this.hideBubble(),dur)}
  hideBubble(){this.bubble.classList.remove('show');clearTimeout(this.bt)}
  /* --- 指標（點擊／拖曳／拋擲） --- */
  bindPointer(){
    const a=this.art;
    a.addEventListener('pointerdown',e=>{
      if(this.drag)return;a.setPointerCapture(e.pointerId);const r=this.root.getBoundingClientRect();const now=performance.now();
      const point=window.OCSCamera?.worldPoint(this.root,e.clientX,e.clientY)||{x:e.clientX-r.left,y:e.clientY-r.top};
      this.drag={id:e.pointerId,sx:e.clientX,sy:e.clientY,t0:now,moved:false,lx:e.clientX,ly:e.clientY,lt:now,r,
        ox:point.x-(this.x+this.size/2),oy:point.y-(this.feetY-this.h-this.size/2)};});
    a.addEventListener('pointermove',e=>{
      const d=this.drag;if(!d||d.id!==e.pointerId)return;
      if(!d.moved&&Math.hypot(e.clientX-d.sx,e.clientY-d.sy)>9){d.moved=true;this.hideBubble();this.vx=0;this.vy=0;this.interrupt();this.ws=0;this.setState('held');buzz(8);this.squash(.08)}
      if(!d.moved)return;
      const now=performance.now(),dt=(now-d.lt)/1000;
      const zoom=this.root.id==='homeStage'?(window.OCSCamera?.z||1):1;
      if(dt>0){this.pvx+=((e.clientX-d.lx)/dt/zoom-this.pvx)*.45;this.pvy+=(-(e.clientY-d.ly)/dt/zoom-this.pvy)*.45}
      d.lx=e.clientX;d.ly=e.clientY;d.lt=now;
      const point=window.OCSCamera?.worldPoint(this.root,e.clientX,e.clientY)||{x:e.clientX-d.r.left,y:e.clientY-d.r.top};
      this.x=clamp(point.x-d.ox-this.size/2,this.minX-this.size*.2,this.maxX+this.size*.2);
      const cy=point.y-d.oy;this.h=clamp(this.feetY-(cy+this.size/2),0,this.H);
      if(Math.abs(this.pvx)>140)this.dir=this.pvx>0?1:-1;
      this.render()});
    const end=(e,cancel)=>{
      const d=this.drag;if(!d||d.id!==e.pointerId)return;this.drag=null;
      if(d.moved){this.vx=clamp(this.pvx,-900,900)*.8;this.vy=clamp(this.pvy*.8,-200,900);this.x=clamp(this.x,this.minX,this.maxX);
        this.droppedMsg=this.h>40;this.setState('fall');this.hasDrop=true}
      else if(!cancel){this.pet()}};
    a.addEventListener('pointerup',e=>end(e,false));a.addEventListener('pointercancel',e=>end(e,true));
  }
}

/* ==========================================================
   疊層管理（返回鍵）、Sheet
   ========================================================== */
const Ov={stack:[],
  sync(){const top=this.stack[this.stack.length-1],editing=window.OCS24D?.Ed;
    this.stack.forEach((o,i)=>{if(!o.el)return;const active=o===top;o.el.inert=!active;
      if(o.el.classList.contains('sheet')){o.el.style.zIndex=String(71+i*2);o.el.setAttribute('aria-modal',String(active));if(active)o.el.removeAttribute('aria-hidden');else o.el.setAttribute('aria-hidden','true')}
      if(o.scrim){o.scrim.style.zIndex=String(70+i*2);o.scrim.style.pointerEvents=active?'auto':'none';o.scrim.classList.toggle('scrim-nested',this.stack.slice(0,i).some(x=>x.scrim))}
    });
    const pages=document.getElementById('pages'),nav=document.getElementById('nav');
    if(pages)pages.inert=!!top&&!(editing?.on&&top===editing._ov);
    if(nav)nav.inert=!!top;
  },
  push(o){this.stack.push(o);this.sync();if(o.el&&!o.el.classList.contains('sheet')){o.el.tabIndex=-1;o.el.setAttribute('role','dialog');queueMicrotask(()=>{if(this.stack[this.stack.length-1]===o)o.el.focus({preventScroll:true})})}},remove(o){const i=this.stack.indexOf(o);if(i>=0)this.stack.splice(i,1);this.sync()},
  back(){const o=this.stack[this.stack.length-1];if(o){o.close();return true}return false}};
function openSheet(html,{cls='',onClose,onOpen}={}){
  const scrim=el('<div class="scrim"></div>'),sh=el(`<div class="sheet ${cls}" role="dialog" aria-modal="true"><div class="sh-grab drag"><i></i></div>${html}</div>`);
  layer.append(scrim,sh);void sh.offsetWidth;requestAnimationFrame(()=>{if(!api.closed){scrim.classList.add('open');sh.classList.add('open')}});
  const api={el:sh,scrim,closed:false,close(){
    if(api.closed)return;const dragY=sh.style.transform?new DOMMatrix(sh.style.transform).m42:0;if(dragY>0)sh.style.setProperty('--sheet-exit-y',(dragY+12)+'px');api.closed=true;Ov.remove(api);sh.dataset.closing='1';sh.inert=true;sh.setAttribute('aria-hidden','true');sh.style.transform='';sh.style.transition='';sh.classList.remove('sheet-dragging','open');scrim.classList.remove('open');scrim.style.pointerEvents='none';
    if(onClose)onClose();setTimeout(()=>{sh.remove();scrim.remove()},document.documentElement.dataset.motion==='reduce'?0:200)}};
  Ov.push(api);scrim.addEventListener('click',()=>api.close());
  /* Modal dimensions are CSS-owned. Never observe a sheet and write its own
     min-height back: intrinsic content, wrapping and mobile viewport changes can
     cause repeated layout/compositing cycles. */
  if(/id="(bgB|wkB|spB|nxB|qBody|drB|tzB|communityPanel)"/.test(html))sh.classList.add('stable-list-sheet');
  sh.addEventListener('click',e=>{if(e.target.closest('[data-close]'))api.close()});
  let d=null;
  sh.addEventListener('pointerdown',e=>{if(e.button>0||e.isPrimary===false||!e.target.closest('.sh-grab')||api.closed)return;d={id:e.pointerId,y:e.clientY,t:performance.now(),dy:0};sh.setPointerCapture(e.pointerId);sh.classList.add('sheet-dragging');sh.style.transition='none';scrim.style.transition='none'});
  sh.addEventListener('pointermove',e=>{if(!d||e.pointerId!==d.id)return;d.dy=Math.max(0,e.clientY-d.y);const dy=Math.min(d.dy*.8,sh.offsetHeight*.6);sh.style.transform=`translate3d(0,${dy}px,0)`;scrim.style.opacity=String(clamp(1-dy/sh.offsetHeight,.3,1))});
  const end=e=>{if(!d||e.pointerId!==d.id)return;const v=d.dy/Math.max(1,performance.now()-d.t),far=e.type==='pointerup'&&(d.dy>Math.min(96,sh.offsetHeight*.28)||d.dy>28&&v>.65);d=null;sh.classList.remove('sheet-dragging');sh.style.transition='';scrim.style.transition='';scrim.style.opacity='';if(far)api.close();else sh.style.transform=''};
  sh.addEventListener('pointerup',end);sh.addEventListener('pointercancel',end);sh.addEventListener('lostpointercapture',e=>{if(d)end({pointerId:e.pointerId,type:'pointercancel'})});
  if(onOpen)onOpen(api);return api}
function confirmSheet({title,msg,ok='確認',danger=true}){
  return new Promise(res=>{let v=false;
    const s=openSheet(`<div class="sh-body info"><h3>${esc(title)}</h3><p>${esc(msg)}</p><div class="pv-cta" style="margin-top:6px"><button class="btn grow" data-close data-modal-focus>取消</button><button class="btn grow ${danger?'danger':'primary'}" id="cfOk">${esc(ok)}</button></div></div>`,{onClose:()=>res(v)});
    $('#cfOk',s.el).onclick=()=>{v=true;s.close()}})}
function infoSheet(it,extra=''){
  openSheet(`<div class="sh-body info"><div class="info-ic">${ic(it.ic)}</div><h3>${esc(it.t)}</h3><p>${esc(it.d)}</p>
  <ul>${it.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${extra}
  <div class="note">${ic('info')}<span>目前尚未開放。第一階段已先保留這個入口，之後加入功能時不需要重做介面。</span></div>
  <button class="btn primary wide" data-close>知道了</button></div>`)}

/* ==========================================================
   共用控制元件
   ========================================================== */
function mkSeg(items,val,onChange){
  const idx=v=>Math.max(0,items.findIndex(i=>i.v===v));
  const root=el(`<div class="seg" role="radiogroup" style="--n:${items.length};--i:${idx(val)}"><i class="seg-thumb"></i>${items.map(i=>`<button role="radio" data-v="${i.v}" class="${i.v===val?'on':''}" aria-checked="${i.v===val}">${i.ic?ic(i.ic):''}<span>${i.t}</span></button>`).join('')}</div>`);
  root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.classList.contains('on'))return;buzz(6);root.set(b.dataset.v);onChange(b.dataset.v,e)});
  root.set=v=>{root.style.setProperty('--i',idx(v));$$('button',root).forEach(b=>{b.classList.toggle('on',b.dataset.v===v);b.setAttribute('aria-checked',String(b.dataset.v===v))})};return root}
function mkRange(label,min,max,step,val,fmt,on){
  const r=el(`<div class="rr"><div class="rr-h"><span>${label}</span><output></output></div><input class="rng" type="range" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label}"></div>`);
  const i=$('input',r),o=$('output',r),paint=()=>{i.style.setProperty('--p',((i.value-min)/(max-min)*100)+'%');o.textContent=fmt(+i.value)};
  paint();i.addEventListener('input',()=>{paint();on(+i.value)});r.set=v=>{i.value=v;paint()};return r}
function mkSwitch(on,fn,disabled){
  const b=el(`<button class="sw" role="switch" aria-checked="${!!on}"${disabled?' disabled':''}></button>`);
  b.addEventListener('click',()=>{const v=b.getAttribute('aria-checked')!=='true';b.setAttribute('aria-checked',v);buzz(8);fn(v)});return b}
function switchRow(icon,title,desc,get,set,disabled){
  const r=el(`<div class="row"><span class="r-ic">${ic(icon)}</span><div class="r-t"><b>${title}</b><small>${desc}</small></div></div>`);
  const s=mkSwitch(get(),set,disabled);r.append(s);if(!disabled)r.addEventListener('click',e=>{if(e.target!==s)s.click()});return r}
const Native={has(){return !!(window.OCNative||window.Android)},call(n,...a){const o=window.OCNative||window.Android;try{return o&&o[n]?o[n](...a):undefined}catch(e){}}};

/* ==========================================================
   導覽
   ========================================================== */
const Nav={cur:0,pages:$$('.page'),btns:$$('.nav-btn[data-tab]'),
  go(i,silent){
    if(i===this.cur&&!silent)return;const prev=this.cur;this.cur=i;
    this.pages.forEach((p,k)=>{p.classList.toggle('on',k===i);p.classList.toggle('before',k<i);p.classList.toggle('after',k>i);p.inert=k!==i});
    this.btns.forEach((b,k)=>{b.classList.toggle('on',k===i);b.setAttribute('aria-selected',k===i)});
    $('#navInd').style.setProperty('--i',[0,1,2,4][i]);$('#nav').dataset.pg=i;if(!silent)buzz(7);
    $('#fab').classList.remove('open');
    Home.visible(i===0);Studio.visible(i===2);if(i===1)Gallery.onShow();if(prev!==i&&i===2)Studio.onShow()}};
function bindScrollHeads(){$$('.scroll').forEach(s=>{const h=$('.phead',s);if(!h)return;s.addEventListener('scroll',()=>h.classList.toggle('scrolled',s.scrollTop>6),{passive:true})})}
const Back={handle(){if(Ov.back())return true;if(Nav.cur!==0){Nav.go(0);return true}return false}};

/* ==========================================================
   首頁
   ========================================================== */
const STATE_LBL={idle:'發呆中',walk:'散步中',sleep:'睡覺中',happy:'心情很好',crouch:'準備跳躍',hop:'跳跳跳',fall:'飄落中',held:'被抱起來了'};
const Home={stage:null,vis:true,
  init(){
    this.stage=new Stage($('#homeStage'),{auto:true,size:W=>clamp(W*.44,136,200)*Cfg.v.size/100,onState:s=>this.onState(s)});
    this.refreshChip();this.stage.setChar(Chars.active(),true);this.stage.start();
    $('#homeChip').onclick=()=>openSwitcher();
    const fab=$('#fab');
    fab.addEventListener('click',e=>{const b=e.target.closest('[data-act],#qaToggle');if(!b)return;
      if(b.id==='qaToggle'){const o=fab.classList.toggle('open');b.setAttribute('aria-expanded',o);buzz(8);return}
      const st=this.stage,a=b.dataset.act;
      ({pet:()=>st.pet(),water:()=>this.water(),hop:()=>{st.hop();Eco.act('hop')},call:()=>{st.callTo();Eco.act('call')},sleep:()=>st.sleeping()?st.wake():st.play('sleep')})[a]();
      if(a!=='pet'&&a!=='water')fab.classList.remove('open')});
    document.addEventListener('pointerdown',e=>{if(fab.classList.contains('open')&&!e.target.closest('#fab')){fab.classList.remove('open');$('#qaToggle').setAttribute('aria-expanded','false')}if(!e.target.closest('#hudRail')){$('#hudRail').classList.remove('open');$('[data-go=toggle]',$('#hudRail')).setAttribute('aria-expanded','false')}if(!e.target.closest('#hudCap')){$('#hudCap').classList.remove('open');$('#hudCap').setAttribute('aria-expanded','false')}},true);
    $('#hudRail').addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(!b)return;buzz(6);
      const g=b.dataset.go,rl=$('#hudRail');if(g==='toggle'){const o=rl.classList.toggle('open');b.setAttribute('aria-expanded',o);return}rl.classList.remove('open');({switch:openSwitcher,studio:()=>Nav.go(2),quest:openQuests,bag:()=>infoSheet(BAG),camera:()=>infoSheet(CAM)})[g]()});
    $('#questCard').onclick=()=>HUD.questTap();
    const cap=$('#hudCap');let ct=0;cap.addEventListener('click',e=>{if(e.target.closest('.res'))return;const o=cap.classList.toggle('open');cap.setAttribute('aria-expanded',o);clearTimeout(ct);if(o)ct=setTimeout(()=>cap.classList.remove('open'),6000);buzz(6)});
    const pg=$('#p-home'),appEl=$('#app'),rail=$('#hudRail');let it=0;
    const closeAll=()=>{fab.classList.remove('open');rail.classList.remove('open');cap.classList.remove('open');$('#qaToggle').setAttribute('aria-expanded','false');$('[data-go=toggle]',rail).setAttribute('aria-expanded','false');cap.setAttribute('aria-expanded','false')};
    const wake=()=>{pg.classList.remove('idle');appEl.classList.remove('hud-idle');clearTimeout(it);
      it=setTimeout(()=>{if($('.sheet.open')||$('.ovp.open'))return;closeAll();pg.classList.add('idle');appEl.classList.add('hud-idle')},5200)};
    addEventListener('pointerdown',wake,true);wake();
    $$('.res').forEach(b=>b.onclick=()=>HUD.resTap(b.dataset.r));
    setInterval(()=>HUD.tick(),20000)},
  onState(s){const f=$('#fabSleepLbl');if(f)f.textContent=s==='sleep'?'叫醒':'睡覺'},
  water(){const p=(Home.plantEl?Home.plantEl():null);if(!p)return;buzz(10);p.classList.remove('water');void p.offsetWidth;p.classList.add('water');
    for(let i=0;i<5;i++){const d=document.createElement('i');d.className='drop';d.style.cssText=`--dx:${(i-2)*9}px;--k:${i}`;p.append(d);setTimeout(()=>d.remove(),1400)}
    setTimeout(()=>p.classList.remove('water'),1000);this.stage.say('植物看起來好開心。');Eco.act('water')},
  setChar(){this.stage.setChar(Chars.active(),true);this.refreshChip()},
  refreshChip(){const c=Chars.active();$('#homeAv').innerHTML=thumbHTML(c);HUD.refresh()},
  visible(v){this.vis=v;v?this.stage.start():this.stage.stop()}};
function setActive(id){Cfg.set('active',id);Home.setChar();Gallery.render();Studio.renderSwitch();Explore.hero()}
function openSwitcher(){
  const cur=Cfg.v.active;
  const s=openSheet(`<div class="sh-body"><div class="sh-title">切換夥伴</div>${Chars.list.map(c=>`<button class="srow ${c.id===cur?'on':''}" data-id="${c.id}"><span class="c">${thumbHTML(c)}</span><span class="t"><b>${esc(c.name)}</b><small>${esc(c.sub)}</small></span><span class="ck">${ic('check')}</span></button>`).join('')}</div>`);
  s.el.addEventListener('click',e=>{const b=e.target.closest('.srow');if(!b)return;buzz(10);s.close();if(b.dataset.id!==Cfg.v.active){setActive(b.dataset.id);toast(`${Chars.active().name} 登場囉`,'sparkle')}})}

/* ==========================================================
   角色頁
   ========================================================== */
const Gallery={filter:'all',first:true,
  init(){
    this.seg=mkSeg([{v:'all',t:'全部'},{v:'demo',t:'示範'},{v:'custom',t:'我的'}],'all',v=>{this.filter=v;this.render()});
    $('#charSeg').append(this.seg);
    $('#btnImport').onclick=()=>NewSheet.open();
    $('#charGrid').addEventListener('click',e=>{const a=e.target.closest('[data-id]');if(a)openPreview(a.dataset.id);else if(e.target.closest('.cc-add'))NewSheet.open()});
    this.render()},
  onShow(){if(this.dirty){this.render()}},
  render(){
    const g=$('#charGrid'),list=Chars.list.filter(c=>this.filter==='all'||c.kind===this.filter),act=Cfg.v.active;
    $('#charSub').textContent=`${Chars.list.length} 位夥伴・${Chars.list.filter(c=>c.kind==='custom').length} 位為我的創作`;
    let i=0;const cards=list.map(c=>{const em=Persona.active(c.data).slice(0,3).map(t=>t.em).join('');
      return `<button class="cc" data-id="${c.id}" style="--i:${i++};--tb:${c.kind==='demo'?c.body:'#8B7CF6'}">
      <div class="cc-art">${c.id===act?'<span class="badge glass">出場中</span>':''}${thumbHTML(c)}</div>
      <div class="cc-info"><div><b>${esc(c.name)}</b><small>${esc(c.sub)}${em?' '+em:''}</small></div><span class="tag ${c.kind}">${c.kind==='demo'?'示範':c.url?'匯入':'原創'}</span></div></button>`});
    cards.push(`<button class="cc-add" style="--i:${i}"><span class="plus">${ic('plus')}</span>新增角色<small>快速創建、進階編輯或匯入圖片</small></button>`);
    g.innerHTML=cards.join('');
    if(this.filter==='custom'&&!list.length)g.insertAdjacentHTML('afterbegin','<div class="empty">還沒有自己的角色。<br>點下方「新增角色」，讓你的 OC 住進來。</div>');
    this.dirty=false}};
function pickFiles(){$('#fileIn').click()}
async function processImage(file){
  const url=URL.createObjectURL(file);
  try{
    const img=new Image();img.src=url;await img.decode();
    let w=img.naturalWidth||512,h=img.naturalHeight||512;const k=Math.min(1,768/Math.max(w,h));w=Math.max(1,Math.round(w*k));h=Math.max(1,Math.round(h*k));
    const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0,w,h);
    let l=w,t=h,r=0,b=0;const d=x.getImageData(0,0,w,h).data;
    for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){if(d[(yy*w+xx)*4+3]>10){if(xx<l)l=xx;if(xx>r)r=xx;if(yy<t)t=yy;if(yy>b)b=yy}}
    if(r<l||b<t){l=0;t=0;r=w-1;b=h-1}
    const pad=3;l=Math.max(0,l-pad);t=Math.max(0,t-pad);r=Math.min(w-1,r+pad);b=Math.min(h-1,b+pad);
    const cw=r-l+1,ch=b-t+1,o=document.createElement('canvas');o.width=cw;o.height=ch;o.getContext('2d').drawImage(c,l,t,cw,ch,0,0,cw,ch);
    const blob=await new Promise(res=>o.toBlob(bl=>res(bl),'image/webp',.92))||await new Promise(res=>o.toBlob(bl=>res(bl),'image/png'));
    return{blob,w:cw,h:ch}}
  finally{URL.revokeObjectURL(url)}}
async function importFiles(files){
  const added=[];
  for(const f of files){
    if(!/^image\//.test(f.type)){toast('不支援的檔案格式','info');continue}
    try{const{blob,w,h}=await processImage(f);
      const nid=uid('c'),rec={id:nid,uid:nid,schema:2,name:f.name.replace(/\.[^.]+$/,'').slice(0,16)||'新角色',blob,w,h,data:Persona.norm({}),look:Chars.randLook(),scale:1,ox:0,oy:0,facing:'right',created:Date.now()};
      await DB.put(rec);const ch=Chars.custom(rec,[]);Chars.list.push(ch);Chars.saveOrder();added.push(ch)}
    catch(e){toast('這張圖片無法讀取','info')}}
  if(!added.length)return;
  Gallery.render();Studio.renderSwitch();Settings.refresh();
  toast(added.length>1?`已匯入 ${added.length} 位角色`:`已匯入「${added[0].name}」`,'upload');
  if(Nav.cur!==1)Nav.go(1);
  if(added.length===1)setTimeout(()=>openPreview(added[0].id),420)}
$('#fileIn').addEventListener('change',e=>{const fs=[...e.target.files];e.target.value='';if(fs.length)importFiles(fs)});

function charMenu(ch,onDone){
  const demo=ch.kind==='demo',i=Chars.list.findIndex(c=>c.id===ch.id),n=Chars.list.length;
  const s=openSheet(`<div class="sh-body"><div class="sh-title">${esc(ch.name)}</div>
    <button class="srow" data-k="dup"><span class="c ns-ic">${ic('copy')}</span><span class="t"><b>複製角色</b><small>連同資料與素材一起複製</small></span></button>
    <button class="srow" data-k="exp"><span class="c ns-ic">${ic('download')}</span><span class="t"><b>匯出角色包</b><small>包含角色圖片、動畫與影格的 .json 檔</small></span></button>
    ${i>0?`<button class="srow" data-k="up"><span class="c ns-ic">${ic('up')}</span><span class="t"><b>往前排</b><small>目前第 ${i+1} 位，共 ${n} 位</small></span></button>`:''}
    ${i<n-1?`<button class="srow" data-k="dn"><span class="c ns-ic" style="transform:rotate(180deg)">${ic('up')}</span><span class="t"><b>往後排</b><small>調整在清單中的順序</small></span></button>`:''}
    ${i>1?`<button class="srow" data-k="first"><span class="c ns-ic">${ic('star')}</span><span class="t"><b>移到最前面</b><small>置頂顯示</small></span></button>`:''}
    ${demo?'':`<button class="srow dng" data-k="del"><span class="c ns-ic">${ic('trash')}</span><span class="t"><b>刪除角色</b><small>資料與素材會從此裝置移除</small></span></button>`}</div>`);
  s.el.addEventListener('click',async e=>{const b=e.target.closest('[data-k]');if(!b)return;const k=b.dataset.k;buzz(8);s.close();
    if(k==='dup'){const c=await Chars.duplicate(ch.id);afterChange();toast(`已複製為「${c.name}」`,'check')}
    else if(k==='exp')Backup.exportOne(ch);
    else if(k==='up'||k==='dn'||k==='first'){Chars.move(ch.id,k==='first'?'first':k==='up'?-1:1);afterChange();toast('已調整順序','check')}
    else if(k==='del'){if(await confirmSheet({title:`刪除「${ch.name}」？`,msg:'資料與素材會從此裝置移除，無法復原。建議先匯出角色包備份。',ok:'刪除'})){await Chars.remove(ch.id);afterChange();toast('已刪除角色','trash')}}
    if(onDone)onDone()})}
function openPreview(id){
  const ch=Chars.byId(id);if(!ch)return;let st=null;
  const isAct=()=>Cfg.v.active===ch.id;
  const acts=[['idle','待機'],['walk','走路'],['sleep','睡覺'],['happy','開心'],['hop','跳躍']];
  const em=Persona.active(ch.data).slice(0,4).map(t=>t.em).join('');
  const s=openSheet(`<div class="pv-stage-wrap"><div class="stage pv" id="pvStage"></div><button class="pv-close icon-btn glass" aria-label="關閉" data-close>${ic('x')}</button></div>
  <div class="sh-body"><div class="pv-title"><div><h2>${esc(ch.name)}</h2><p>${esc(ch.sub)}</p></div><span class="tag ${ch.kind}">${ch.kind==='demo'?'示範':ch.url?'匯入':'原創'}</span></div>
  <p class="pv-desc">${em?`<span class="tem">${em}</span> `:''}${esc(ch.desc)}</p>
  <div class="chips" id="pvActs">${acts.map(([k,t])=>`<button class="chip" data-k="${k}">${t}</button>`).join('')}</div>
  <div class="pv-cta"><button class="btn primary grow" id="pvSet"></button><button class="btn grow" id="pvEdit">${ic('edit',20)}編輯</button><button class="btn icon" id="pvMore" aria-label="更多">${ic('more',20)}</button></div></div>`,
  {onClose:()=>{if(st)st.destroy()}});
  const sync=()=>{const b=$('#pvSet',s.el);b.innerHTML=isAct()?`${ic('check',20)}目前出場中`:'設為桌寵';b.disabled=isAct()};sync();
  st=new Stage($('#pvStage',s.el),{auto:false,size:(W,H)=>H*.5,onState:k=>{$$('#pvActs .chip',s.el).forEach(c=>c.classList.toggle('on',c.dataset.k===k))}});
  st.setChar(ch);st.start();setTimeout(()=>st.say(Persona.line(ch,'idle')),500);
  $('#pvActs',s.el).addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;buzz(6);const k=b.dataset.k;
    if(k==='walk')st.walkTo(st.x<st.W/2?st.maxX*.9:st.minX+st.size*.4);else if(k==='happy')st.play('happy');else if(k==='hop')st.hop();else st.play(k)});
  $('#pvSet',s.el).onclick=()=>{buzz(14);s.close();setActive(ch.id);Nav.go(0);setTimeout(()=>toast(`${ch.name} 登場囉`,'sparkle'),300)};
  $('#pvEdit',s.el).onclick=()=>{s.close();setTimeout(()=>Ed.open(ch.id),320)};
  $('#pvMore',s.el).onclick=()=>{s.close();setTimeout(()=>charMenu(ch),320)}}
function afterChange(){Gallery.render();Studio.renderSwitch();if(!Chars.byId(Studio.sel))Studio.select(Cfg.v.active);Home.setChar();Explore.hero();Settings.refresh()}

/* ==========================================================
   工坊
   ========================================================== */
const MODS=[
 {ic:'shirt',t:'外觀與裝扮',d:'為角色換上服裝、配件與髮型，並可疊加多個圖層。',items:['圖層式裝扮與配件','衣櫃與預設搭配','與商店、任務獎勵連動']},
 {ic:'film',t:'動作與動畫',d:'匯入逐格動畫或 Sprite Sheet，自訂待機、行走、睡覺等動作。',items:['Sprite Sheet 匯入與切格','動作時間軸與銜接','自訂跳躍、攀爬、休息']},
 {ic:'smile',t:'表情',d:'為不同情緒指定表情素材，並設定切換條件。',items:['表情素材庫','情緒與表情對應','對話時自動切換']},
 {ic:'mic',t:'語音',d:'替互動與事件加入角色語音。',items:['點擊／撫摸語音','時間與事件語音','音量與靜音控制']},
 {ic:'chat',t:'對話與劇情',d:'條件式對話與分支劇情，讓角色擁有自己的故事。',items:['條件式對話（時間、好感度、天氣）','事件與分支選項','劇情進度存檔']},
 {ic:'route',t:'行為模式',d:'個性參數已在「編輯角色 → 個性」開放；活動範圍與作息將於後續加入。',items:['個性滑桿與特質（已開放）','活動範圍與速度','作息與喜好']}
];
const Studio={sel:null,stage:null,saveT:0,
  init(){
    this.sel=Cfg.v.active;
    this.stage=new Stage($('#stStage'),{auto:false,guides:true,size:(W,H)=>H*.5});
    $('#stSwitch').addEventListener('click',e=>{const a=e.target.closest('.av');if(!a)return;buzz(6);if(a.dataset.add)NewSheet.open();else this.select(a.dataset.id)});
    $('#stMods').innerHTML=MODS.map((m,i)=>`<button class="row btn-row" data-i="${i}"><span class="r-ic soft">${ic(m.ic)}</span><div class="r-t"><b>${m.t}</b><small>${m.d}</small></div><span class="tag soon">規劃中</span></button>`).join('');
    $('#stMods').addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(b)infoSheet(MODS[+b.dataset.i])});
    this.renderSwitch();this.select(this.sel,true)},
  visible(v){v?this.stage.start():this.stage.stop()},
  onShow(){if(!Chars.byId(this.sel))this.select(Cfg.v.active)},
  renderSwitch(){
    $('#stSwitch').innerHTML=Chars.list.map(c=>`<button class="av ${c.id===this.sel?'on':''}" data-id="${c.id}"><span class="c">${thumbHTML(c)}</span><span>${esc(c.name.split(' ')[0])}</span></button>`).join('')+`<button class="av" data-add="1"><span class="c plus">${ic('plus')}</span><span>新增</span></button>`},
  select(id,silent){
    const ch=Chars.byId(id)||Chars.list[0];this.sel=ch.id;
    $$('#stSwitch .av').forEach(a=>a.classList.toggle('on',a.dataset.id===ch.id));
    this.stage.setChar(ch);this.ctrl(ch);
    if(!silent){const a=$(`#stSwitch [data-id="${ch.id}"]`);a&&Fx.centerIn($('#stSwitch'),a)}},
  saved(){const s=$('#saved');s.classList.add('show');clearTimeout(this.saveT);this.saveT=setTimeout(()=>s.classList.remove('show'),1400)},
  commit(ch,p,rebuild){
    Chars.patch(ch,p);this.saved();
    rebuild?this.stage.setChar(ch):this.stage.applyAdjust();
    if(Cfg.v.active===ch.id){rebuild?Home.stage.setChar(ch):Home.stage.applyAdjust()}
    Gallery.dirty=true;
    if('name' in p){const n=$(`#stSwitch [data-id="${ch.id}"] span:last-child`);if(n)n.textContent=ch.name.split(' ')[0];if(Cfg.v.active===ch.id)Home.refreshChip()}
    if(rebuild){const t=$(`#stSwitch [data-id="${ch.id}"] .c`);if(t)t.innerHTML=thumbHTML(ch);if(Cfg.v.active===ch.id)Home.refreshChip()}},
  ctrl(ch){
    const box=$('#stCtrl');box.innerHTML='';
    const eb=el(`<button class="btn primary wide" style="margin-bottom:14px">${ic('edit',20)}捏臉與個性</button>`);eb.onclick=()=>{buzz(8);Ed.open(ch.id)};box.append(eb);
    const nm=el(`<label class="fld"><span>名稱</span><input class="inp" maxlength="16" value="${esc(ch.name)}" autocomplete="off"></label>`);
    $('input',nm).addEventListener('input',e=>{const v=e.target.value.trim();if(v)this.commit(ch,{name:v.slice(0,16)})});
    box.append(nm);
    const sc=mkRange('縮放',40,180,1,Math.round(ch.scale*100),v=>v+'%',v=>this.commit(ch,{scale:v/100}));
    const ox=mkRange('水平位置',-50,50,1,ch.ox,v=>(v>0?'+':'')+v,v=>this.commit(ch,{ox:v}));
    const oy=mkRange('垂直位置（正值向下）',-40,40,1,ch.oy,v=>(v>0?'+':'')+v,v=>this.commit(ch,{oy:v}));
    box.append(sc,ox,oy);
    if(ch.url){
      const f=el('<div class="fld"><span>素材朝向</span></div>');
      f.append(mkSeg([{v:'right',t:'朝右'},{v:'left',t:'朝左'}],ch.facing,v=>this.commit(ch,{facing:v})));box.append(f)}
    else{
      const f=el('<div class="fld"><span>毛色</span><div class="swatches"></div></div>'),w=$('.swatches',f);
      SWATCH.forEach(c=>{const b=el(`<button style="background:${c}" aria-label="${c}" class="${c.toLowerCase()===ch.body.toLowerCase()?'on':''}"></button>`);
        b.onclick=()=>{buzz(8);$$('button',w).forEach(x=>x.classList.remove('on'));b.classList.add('on');this.commit(ch,{body:c},true)};w.append(b)});
      box.append(f)}
    const rs=el(`<button class="btn wide">${ic('reset',20)}重設擺放</button>`);
    rs.onclick=()=>{this.commit(ch,{scale:1,ox:0,oy:0});sc.set(100);ox.set(0);oy.set(0);toast('已重設擺放','reset')};box.append(rs)}};

/* ==========================================================
   探索
   ========================================================== */
const CATS=[
 {ic:'seed',t:'養成',d:'好感度、情緒與成長',items:['好感度與情緒狀態','餵食、陪伴與照顧','隨互動累積的成長']},
 {ic:'cal',t:'日常',d:'作息與每日活動',items:['依時段變化的作息','角色自己的小日常','每日登入與小驚喜']},
 {ic:'book',t:'劇情',d:'條件式對話與事件',items:['依好感度、時間觸發的劇情','分支選項與多重結局','像日常小品般的故事章節']},
 {ic:'flag',t:'任務',d:'目標與獎勵',items:['每日與長期任務','與角色一起達成目標','獎勵道具與紀念']},
 {ic:'bag',t:'商店',d:'道具、裝扮與家具',items:['道具與食物','裝扮與家具','與任務獎勵整合']},
 {ic:'pad',t:'小遊戲',d:'和夥伴一起玩',items:['輕量休閒小遊戲','與角色互動的玩法','遊戲成績與獎勵']}
];
const NATIVE=[
 {ic:'layers',t:'懸浮窗桌寵',d:'讓角色出現在其他 App 上方，真正陪你生活。',items:['需 Android 懸浮窗權限','可拖曳、可穿透點擊的角色','前景服務與省電處理']},
 {ic:'bell',t:'通知與提醒',d:'角色以自己的方式提醒你。',items:['時段問候與提醒','自訂提醒語氣','勿擾模式配合']},
 {ic:'grid',t:'桌面小工具',d:'把角色放上手機主畫面。',items:['多種尺寸的 Widget','即時顯示角色狀態','點擊直接回到 App']}
];
const Explore={
  init(){
    this.hero();
    $('#exCats').innerHTML=CATS.map((c,i)=>`<button class="cat press" data-i="${i}"><span class="r-ic">${ic(c.ic)}</span><span class="tag soon">規劃中</span><div><b>${c.t}</b><small>${c.d}</small></div></button>`).join('');
    $('#exCats').addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(b)infoSheet(CATS[+b.dataset.i])});
    const ok=Native.has();
    $('#exNative').innerHTML=NATIVE.map((c,i)=>`<button class="row btn-row" data-i="${i}"><span class="r-ic soft">${ic(c.ic)}</span><div class="r-t"><b>${c.t}</b><small>${c.d}</small></div><span class="tag soon">${ok?'待接入':'需 APK'}</span></button>`).join('');
    $('#exNative').addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(b)infoSheet(NATIVE[+b.dataset.i],`<div class="note">${ic('plug')}<span>裝置功能：${ok?'已連接應用程式':'目前使用瀏覽器模式，安裝應用程式後可使用更多裝置功能'}。</span></div>`)});
    $('#exSettings').onclick=()=>Settings.open()},
  hero(){const c=Chars.active();$('#exHero').innerHTML=`<div class="hd"><small>目前夥伴</small><h2>${esc(c.name)}</h2><p>${esc(c.sub)}</p><button class="btn primary" id="exSwitch">切換夥伴</button></div><div class="hv" style="--tb:${c.kind==='demo'?c.body:'#8B7CF6'}">${thumbHTML(c)}</div>`;
    $('#exSwitch').onclick=openSwitcher}};

/* ==========================================================
   設定
   ========================================================== */
const Settings={el:$('#settings'),isOpen:false,api:null,
  build(){
    const e=this.el;
    e.innerHTML=`<div class="scroll" id="setScroll"><div class="ov-bar"><button class="icon-btn" id="setBack" aria-label="返回">${ic('left')}</button><h1>設定</h1></div><div id="setBody" style="padding-top:6px"></div></div>`;
    $('#setBack').onclick=()=>this.close();
    this.body=$('#setBody');this.make();
    // 邊緣滑動返回
    let d=null;
    e.addEventListener('pointerdown',ev=>{if(ev.clientX>26||!this.isOpen)return;d={x:ev.clientX,t:performance.now(),dx:0};e.setPointerCapture(ev.pointerId);e.classList.add('drag')});
    e.addEventListener('pointermove',ev=>{if(!d)return;d.dx=Math.max(0,ev.clientX-d.x);e.style.transform=`translate3d(${d.dx}px,0,0)`});
    const end=()=>{if(!d)return;const v=d.dx/Math.max(1,performance.now()-d.t),far=d.dx>110||v>.5;d=null;e.classList.remove('drag');e.style.transform='';if(far)this.close()};
    e.addEventListener('pointerup',end);e.addEventListener('pointercancel',end)},
  make(){
    const b=this.body;b.innerHTML='';const V=Cfg.v;
    const sec=t=>b.append(el(`<div class="sec">${t}</div>`));
    const grp=(...rows)=>{const g=el('<div class="group"></div>');g.append(...rows);b.append(g)};
    const colRow=(icon,title,desc,ctrl)=>{const r=el(`<div class="row col"><div class="rh"><span class="r-ic">${ic(icon)}</span><div class="r-t"><b>${title}</b><small>${desc}</small></div></div></div>`);r.append(ctrl);return r};
    sec('外觀');
    grp(colRow('sun','主題','深色模式針對夜間觀看重新調校',mkSeg([{v:'system',t:'系統',ic:'monitor'},{v:'light',t:'淺色',ic:'sun'},{v:'dark',t:'深色',ic:'moon'}],V.theme,(v,ev)=>Theme.set(v,ev))),
        colRow('sparkle','動態效果','減少時會關閉轉場與背景動畫',mkSeg([{v:'system',t:'跟隨系統'},{v:'full',t:'標準'},{v:'reduce',t:'減少'}],V.motion,v=>{Cfg.set('motion',v);Theme.apply()})));
    sec('桌寵');
    const sz=mkRange('角色大小',70,140,1,V.size,v=>v+'%',v=>{Cfg.set('size',v);Home.stage.measure();Home.stage.applyAdjust()});
    grp(colRow('users','角色大小','調整桌寵在首頁的顯示大小',sz),
        colRow('route','活躍程度','影響走動、跳躍與說話的頻率',mkSeg([{v:'quiet',t:'安靜'},{v:'normal',t:'普通'},{v:'lively',t:'活潑'}],V.activity,v=>Cfg.set('activity',v))),
        switchRow('film','自動行為','自行散步、睡覺與跳躍',()=>Cfg.v.auto,v=>Cfg.set('auto',v)),
        switchRow('chat','對話氣泡','顯示角色的話語',()=>Cfg.v.bubbles,v=>{Cfg.set('bubbles',v);if(!v)Home.stage.hideBubble()}),
        switchRow('heart','觸覺回饋',navigator.vibrate?'互動時輕微震動':'此裝置不支援',()=>Cfg.v.haptics&&!!navigator.vibrate,v=>Cfg.set('haptics',v),!navigator.vibrate));
    sec('裝置功能');
    const has=Native.has();
    grp(switchRow('layers','桌面懸浮窗',has?'讓角色出現在其他 App 上方':'安裝應用程式後可開啟桌面陪伴',()=>false,v=>{Native.call('setOverlayEnabled',v)},!has),
        (()=>{const r=el(`<div class="row"><span class="r-ic soft">${ic('plug')}</span><div class="r-t"><b>裝置連線</b><small>${has?'已連接 Android 裝置功能':'目前使用瀏覽器模式'}</small></div><span class="tag ${has?'':'soon'}">${has?'已連接':'未偵測'}</span></div>`);return r})());
    sec('資料');
    this.dataRow=el(`<div class="row"><span class="r-ic soft">${ic('db')}</span><div class="r-t"><b>我的角色</b><small id="setStore">計算中…</small></div><span class="r-v" id="setCount"></span></div>`);
    const act=(icon,title,desc,fn,cls='')=>{const r=el(`<button class="row btn-row ${cls}"><span class="r-ic">${ic(icon)}</span><div class="r-t"><b>${title}</b><small>${desc}</small></div></button>`);r.onclick=fn;return r};
    const exp=act('download','匯出完整備份','角色、動畫、穿搭、佈置、作品與養成設定，一個 .json 檔',()=>Backup.exportAll());
    const imp=act('upload','匯入完整備份／角色包','一併還原圖片與動畫，保留現有自創角色',()=>Backup.pick());
    const delAll=act('trash','刪除所有自創角色','示範角色不受影響，建議先匯出備份',async()=>{const n=Chars.list.filter(c=>c.kind==='custom').length;if(!n){toast('目前沒有自創角色','info');return}
      if(await confirmSheet({title:'刪除所有自創角色？',msg:`將移除 ${n} 位角色的資料與素材，無法復原。`,ok:'全部刪除'})){await DB.clear();Chars.list.filter(c=>c.kind==='custom').forEach(c=>{if(c.url)URL.revokeObjectURL(c.url);Object.values(c.assets||{}).forEach(a=>URL.revokeObjectURL(a.url))});Chars.list=Chars.list.filter(c=>c.kind==='demo');Chars.urls={};Chars.aurls={};Chars.pend.clear();Chars.saveOrder();if(!Chars.byId(Cfg.v.active))Cfg.set('active','mochi');afterChange();toast('已刪除','trash')}},'danger');
    const reset=act('reset','重設所有設定','主題、桌寵偏好與示範角色的調整（自創角色保留）',async()=>{if(await confirmSheet({title:'重設所有設定？',msg:'偏好與示範角色的調整會恢復預設，自創的角色會保留。',ok:'重設'})){Cfg.v=defaults();Cfg.save();Theme.apply();Chars.list=Chars.list.map(c=>c.kind==='demo'?Chars.demo(DEMOS.find(d=>d.id===c.id)):c);Chars.saveOrder();this.make();afterChange();Home.stage.measure();Studio.select(Cfg.v.active,true);toast('已重設','reset')}},'danger');
    grp(this.dataRow,exp,imp,delAll,reset);
    sec('關於');
    grp(el(`<div class="row"><span class="r-ic soft">${ic('info')}</span><div class="r-t"><b>OC Shimeji</b><small>讓你的原創角色在小世界裡一起生活</small></div></div>`),
        el(`<div class="row"><span class="r-ic soft">${ic('sparkle')}</span><div class="r-t"><b>示範角色</b><small>三位原創貓咪夥伴，也歡迎匯入自己的角色</small></div></div>`));
    b.append(el('<div style="height:18px"></div>'));this.refresh()},
  refresh(){const c=$('#setCount');if(!c)return;c.textContent=Chars.list.filter(x=>x.kind==='custom').length+' 位';
    const s=$('#setStore');if(navigator.storage&&navigator.storage.estimate){navigator.storage.estimate().then(e=>{s.textContent=`已使用 ${((e.usage||0)/1048576).toFixed(1)} MB 儲存空間`}).catch(()=>s.textContent='儲存於此裝置')}else s.textContent='儲存於此裝置'},
  open(){if(this.isOpen)return;this.isOpen=true;this.refresh();this.el.classList.add('open');this.api={el:this.el,close:()=>this.close()};Ov.push(this.api);buzz(8)},
  close(){if(!this.isOpen)return;this.isOpen=false;this.el.classList.remove('open');Ov.remove(this.api)}};

/* ==========================================================
   對外介面（供 Android 原生層呼叫）
   ========================================================== */
window.OCApp={version:VERSION,
  back:()=>Back.handle(),                                  // onBackPressed：回傳 true 代表已處理
  setInsets:({top=0,bottom=0}={})=>{const s=document.documentElement.style;s.setProperty('--native-top',top+'px');s.setProperty('--native-bottom',bottom+'px');Home&&Home.stage&&Home.stage.measure()},
  setActiveCharacter:id=>{if(Chars.byId(id))setActive(id)},
  onPause:()=>Home.stage&&Home.stage.stop(),onResume:()=>Home.vis&&Home.stage.start()};

/* ==========================================================
   啟動
   ========================================================== */
async function boot(){
  Cfg.load();Eco.load();Theme.apply();
  Theme.mq.addEventListener('change',()=>{if(Cfg.v.theme==='system')Theme.apply()});
  Theme.rm.addEventListener('change',()=>Theme.apply());
  fillIcons();
  await Chars.load();Life.init();
  if(Eco.bonus)setTimeout(()=>toast('每日登入 +20 星幣','sparkle'),1600);
  if(!Chars.byId(Cfg.v.active))Cfg.v.active='mochi';
  Home.init();Gallery.init();Studio.init();Explore.init();Settings.build();Ed.init();bindScrollHeads();
  try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)Chars.flush()});addEventListener('pagehide',()=>Chars.flush());
  $('#nav').addEventListener('click',e=>{const b=e.target.closest('.nav-btn');if(!b)return;buzz(6);if(b.dataset.tab!=null)Nav.go(+b.dataset.tab);else if(b.dataset.nact==='quest')openQuests();else openMore()});
  Nav.go(0,true);Studio.visible(false);
  document.addEventListener('contextmenu',e=>{if(!e.target.closest('input'))e.preventDefault()});
  // 返回鍵（瀏覽器／WebView 歷史堆疊）：先關疊層，再回首頁，最後才離開
  history.replaceState({oc:0},'');history.pushState({oc:1},'');let exitT=0;
  addEventListener('popstate',()=>{
    if(Back.handle()){history.pushState({oc:1},'');return}
    if(Date.now()-exitT<2200)return;
    exitT=Date.now();toast('再返回一次即可離開','info');history.pushState({oc:1},'')});
  window.OCS_HIDE_SPLASH=()=>{const s=$('#splash');if(!s||s.dataset.h)return;s.dataset.h=1;s.classList.add('gone');setTimeout(()=>s.remove(),800)};setTimeout(()=>window.OCS_HIDE_SPLASH(),7000)}
/* ==========================================================
   陪伴進度（本機保存）：親密度、星幣、每日任務
   ========================================================== */
const QUESTS=[{id:'pet',k:'pet',t:'撫摸夥伴',n:3,r:30,ic:'heart'},{id:'water',k:'water',t:'幫植物澆水',n:1,r:15,ic:'drop'}];
const BAG={ic:'bag',t:'背包',d:'收納道具、食物與裝飾素材。',items:['道具與食物','匯入的裝飾素材','與任務獎勵整合']};
const CAM={ic:'camera',t:'相機',d:'替夥伴與小屋拍下紀念照。',items:['場景截圖與濾鏡','相簿與分享','角色專屬拍照動作']};
const Eco={k:'ocs.eco.v1',v:null,bonus:false,
  day(d=new Date()){return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()},
  dn(){const d=new Date();return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5)},
  dnOf(s){const m=/^(\d+)-(\d+)-(\d+)$/.exec(s||'');return m?Math.floor(Date.UTC(+m[1],+m[2]-1,+m[3])/864e5):0},
  load(){let v=null;try{v=JSON.parse(localStorage.getItem(this.k))}catch(e){}
    v=this.v=Object.assign({coins:0,gems:0,streak:0,last:'',bond:{},q:{}},v||{});const d=this.day();
    const dn=this.dn(),dm=Math.max(Math.floor(+v.dm)||0,this.dnOf(v.last));if(v.last!==d&&dn>dm){v.streak=v.last===this.day(new Date(Date.now()-864e5))?v.streak+1:1;v.last=d;v.dm=dn;v.q={day:d,pet:0,water:0,pc:0,done:{}};v.coins=Math.max(0,Math.floor(+v.coins)||0)+20;this.bonus=true}else if(!v.dm)v.dm=dm;
    if(!v.q.done)v.q.done={};this.save()},
  save(){try{localStorage.setItem(this.k,JSON.stringify(this.v))}catch(e){}},
  need:lv=>60+lv*40,
  info(id){let x=this.v.bond[id]||0,lv=1;while(x>=this.need(lv)){x-=this.need(lv);lv++}return{lv,x,n:this.need(lv)}},
  prog(q){return Math.min(q.n,this.v.q[q.k]||0)},
  ready(q){return this.prog(q)>=q.n&&!this.v.q.done[q.id]},
  anyReady(){return QUESTS.some(q=>this.ready(q))},
  act(k){const V=this.v,c=Chars.active();if(!c)return;const xp={pet:8,water:4,hop:1,call:1}[k]||0;
    if(k==='pet'||k==='water')V.q[k]=(V.q[k]||0)+1;
    try{window.Econ&&Econ.on(k)}catch(e){}
    const a=this.info(c.id).lv;V.bond[c.id]=(V.bond[c.id]||0)+xp;const b=this.info(c.id).lv;
    this.save();HUD.refresh();if(b>a)toast(`${c.name} 升到 Lv.${b}`,'heart')},
  claim(id){const q=QUESTS.find(x=>x.id===id);if(!q||!this.ready(q))return;this.v.q.done[id]=1;this.v.coins+=q.r;this.save();HUD.refresh();buzz(14);toast(`任務完成 +${q.r} 星幣`,'sparkle')}};
const HUD={
  fmt:n=>n>=1e4?(n/1e3).toFixed(1).replace('.0','')+'K':String(n),
  refresh(){const V=Eco.v,c=Chars.active();if(!c)return;const b=Eco.info(c.id);
    $('#rCoin').textContent=this.fmt(V.coins);$('#rGem').textContent=this.fmt(V.gems);$('#rStar').textContent=V.streak;
    $('#lvTxt').textContent='Lv.'+b.lv;$('#barFill').style.transform=`scaleX(${Math.max(.04,b.x/b.n)})`;$('#xpTxt').textContent=b.x+' / '+b.n;
    const r=Eco.anyReady(),nx=QUESTS.find(q=>Eco.ready(q))||QUESTS.find(q=>!V.q.done[q.id]&&Eco.prog(q)<q.n);
    $('#qcT').textContent=r?'任務完成！':nx?'每日任務':'今天都完成了';
    $('#qcD').textContent=r?'領取獎勵':nx?`${nx.t} ${Eco.prog(nx)}/${nx.n}`:'';$('#questCard').classList.toggle('done',!r&&!nx);$('#questCard').classList.toggle('ready',r);
    ['qcDot','railDot'].forEach(i=>$('#'+i).classList.toggle('on',r));
    $('#homeStage').dataset.q=0;this.tick()},
  tick(){const d=new Date(),h=d.getHours(),m=String(d.getMinutes()).padStart(2,'0');
    const n=h<5?'深夜':h<8?'清晨':h<11?'早晨':h<14?'午間':h<17?'午後':h<19?'黃昏':'夜晚',night=h>=19||h<5;
    $('#wxName').textContent=n;$('#wxTime').textContent=`${String(h).padStart(2,'0')}:${m}`;
    $('#wxIc').innerHTML=ic(night?'moon':'sun',26);$('#wxIc').style.color=night?'#CFD6FF':'#FFD66B'},
  questTap(){buzz(8);Eco.anyReady()?Eco.claim(QUESTS.find(q=>Eco.ready(q)).id):openQuests()},
  resTap(r){buzz(6);if(r==='coin')openQuests();else if(r==='gem')toast('星鑽尚未開放（規劃中）','info');else toast(`已連續登入 ${Eco.v.streak} 天`,'sparkle')}};
function openQuests(){
  const s=openSheet('<div class="sh-body" id="qBody"></div>');
  const draw=()=>{$('#qBody',s.el).innerHTML=`<div class="sh-title">每日任務</div><p class="q-sub">每天重置・已連續登入 ${Eco.v.streak} 天</p>`+QUESTS.map(q=>{const p=Eco.prog(q),done=Eco.v.q.done[q.id],rd=Eco.ready(q);
    return `<div class="qrow ${done?'done':''}"><span class="qi">${ic(q.ic)}</span><div class="qt"><b>${q.t}</b><div class="bar q"><i style="transform:scaleX(${Math.max(.04,p/q.n)})"></i></div><small>${p} / ${q.n}・獎勵 ${q.r} 星幣</small></div>${done?'<span class="tag">已領取</span>':`<button class="btn primary qb" data-claim="${q.id}" ${rd?'':'disabled'}>領取</button>`}</div>`}).join('')};
  draw();s.el.addEventListener('click',e=>{const b=e.target.closest('[data-claim]');if(b){Eco.claim(b.dataset.claim);draw()}})}
function openMore(){
  const rows=[['sliders','設定','主題、桌寵與資料',()=>Settings.open(),0],['bag','背包','道具與素材',()=>infoSheet(BAG),1],['store','商店','道具、裝扮與家具',()=>infoSheet(CATS[4]),1],['camera','相機','拍下紀念照',()=>infoSheet(CAM),1],['pad','小遊戲','和夥伴一起玩',()=>infoSheet(CATS[5]),1]];
  const s=openSheet(`<div class="sh-body"><div class="sh-title">更多</div><div class="group">${rows.map((r,i)=>`<button class="row btn-row" data-i="${i}"><span class="r-ic">${ic(r[0])}</span><div class="r-t"><b>${r[1]}</b><small>${r[2]}</small></div>${r[4]?'<span class="tag soon">規劃中</span>':ic('right')}</button>`).join('')}</div></div>`);
  s.el.addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(!b)return;const f=rows[+b.dataset.i][3];s.close();setTimeout(f,280)})}
{const _p=Stage.prototype.pet;Stage.prototype.pet=function(){const was=this.state;_p.apply(this,arguments);if(this.root&&this.root.id==='homeStage'&&was!=='held')Eco.act('pet')}}

/* ===== 增強層：時間・天氣系統、雲朵、特效 ===== */
const WI={sunny:'<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',cloudy:'<path d="M7 18a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 8.5 4.8 4.8 0 0 1 17.5 18z"/>',rain:'<path d="M7 14a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 4.5 4.8 4.8 0 0 1 17.5 14z"/><path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3"/>',storm:'<path d="M7 13a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 3.5 4.8 4.8 0 0 1 17.5 13z"/><path d="M12 13l-2 4h3l-2 4"/>',fog:'<path d="M4 8h16M6 12h13M4 16h16M8 20h10"/>',snow:'<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5"/>'};
const wsvg=(k,s=22)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${WI[k]}</svg>`;
const WX={sunny:{n:'晴天',cl:.28,gr:0,rain:0,th:0,fog:0,snow:0,wind:.5},cloudy:{n:'陰天',cl:.85,gr:.5,rain:0,th:0,fog:0,snow:0,wind:.75},rain:{n:'雨天',cl:1,gr:.65,rain:1,th:0,fog:0,snow:0,wind:.85},storm:{n:'雷陣雨',cl:1,gr:.85,rain:1.5,th:1,fog:0,snow:0,wind:1.4},fog:{n:'霧天',cl:.5,gr:.35,rain:0,th:0,fog:1,snow:0,wind:.2},snow:{n:'雪天',cl:.9,gr:.35,rain:0,th:0,fog:0,snow:1,wind:.35}};
const Env=(()=>{
const hx=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),mx=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t),mu=(a,k)=>a.map(v=>v*k),rg=a=>'rgb('+a.map(Math.round)+')',ra=(a,al)=>`rgba(${a.map(Math.round)},${al.toFixed(3)})`,c01=v=>Math.max(0,Math.min(1,v)),sm=t=>t*t*(3-2*t),rn=(a,b)=>a+Math.random()*(b-a);
const PH=[['pre','凌晨',2.5,'#141636','#232658','#3C3D74','#EDE8CF','#7A7CE0',.5,.62,1,0],['early','清晨',6,'#8E9AD0','#F2B9B4','#FBDDC2','#FFC89A','#FFC9B0',.2,.94,.15,.55],['morn','早晨',8,'#9CC4EC','#D6E6EE','#F8EEDB','#FFE9A6','#FFF1D8',.12,.97,0,.2],['fore','上午',10,'#8FC3F0','#CDE5F4','#F4F1E2','#FFF0B0','#FFFFFF',0,1,0,0],['noon','中午',12,'#78B6EE','#BCDDF4','#ECF2E8','#FFF8D0','#FFFFFF',0,1,0,0],['aft','下午',15,'#8DBFEA','#CFE2EE','#F6EEDC','#FFEFB0','#FFF4DC',.1,.97,0,.1],['dusk','黃昏',18,'#6F6BC0','#F0A3A6','#FBD5A8','#FF9E78','#FFB899',.24,.93,.1,.75],['eve','晚上',20.5,'#2A2B66','#4D4C94','#8884BE','#F4EFD4','#8A7CE0',.4,.68,.8,.1],['late','深夜',23.3,'#12132F','#1F2050','#34356A','#EDE8CF','#7A7CE0',.5,.6,1,0]].map(a=>({id:a[0],n:a[1],h:a[2],sky:[hx(a[3]),hx(a[4]),hx(a[5])],orb:hx(a[6]),tint:hx(a[7]),k:a[8],lum:a[9],st:a[10],gw:a[11]}));
const B={mtn:hx('#BAC9CC'),ta:hx('#B1C7A1'),tb:hx('#85AD8E'),hx:hx('#AFCAA6'),hy:hx('#CDDCC0'),bush:hx('#96BBA1'),fa:hx('#B9CF9F'),fb:hx('#9FBE91')};
const idAt=h=>h<5?'pre':h<7?'early':h<9?'morn':h<11?'fore':h<13?'noon':h<17?'aft':h<19?'dusk':h<22?'eve':'late';
const byId=id=>PH.find(p=>p.id===id)||PH[4];
const CL=[[.5,7,3,130,0],[.55,24,2.4,120,.55],[.7,14,5,150,.2],[.75,29,4,140,.7],[1,5,8,190,.35],[1,20,7,170,.8],[.9,32,6,160,.9]];
const E={st:new Set(),rt:[],s:{h:12,cl:0,gr:0,rain:0,th:0,fog:0,snow:0,wind:.5},t:null,dirty:1,started:0,ah:12,aw:'sunny',an:90,rbT:0,lab:0,pt:1200,msg:'',busy:0,granted:0,wid:'sunny',last:0,cb:null,
mode(){return Cfg.v.envMode||'real'},
pal(h){let x=h<PH[0].h?h+24:h,i=PH.length-1;for(let k=0;k<PH.length;k++)if(PH[k].h<=x)i=k;const a=PH[i],b=PH[(i+1)%PH.length],bh=b.h+(i===PH.length-1?24:0),t=sm(c01((x-a.h)/(bh-a.h)));
 return{sky:a.sky.map((c,j)=>mx(c,b.sky[j],t)),orb:mx(a.orb,b.orb,t),tint:mx(a.tint,b.tint,t),k:a.k+(b.k-a.k)*t,lum:a.lum+(b.lum-a.lum)*t,st:a.st+(b.st-a.st)*t,gw:a.gw+(b.gw-a.gw)*t}},
attach(stage){if(this.st.has(stage))return;this.st.add(stage);if(!this.started)this.start();const r=stage.root,q=s=>r.querySelector(s);
 r.querySelectorAll('.cloud').forEach(e=>e.remove());
 const ext=r.id==='homeStage'?.36:0;const stars=q('.stars');if(stars)stars.innerHTML=Array.from({length:ext?120:46},()=>`<i class="${Math.random()<.14?'b':''}" style="left:${rn(2,98).toFixed(1)}%;top:${rn(2,92).toFixed(1)}%;--d:${rn(2.8,6).toFixed(1)}s;--l:${rn(-6,0).toFixed(1)}s"></i>`).join('');
 const orb=q('.orb'),cl=document.createElement('div');cl.className='cl';
 const clouds=(ext?CL.concat(CL):CL).map((c,n)=>{const el=document.createElement('div');el.className='cd';el.innerHTML=this.cloudSVG(c[3]*c[0],n);cl.appendChild(el);return{el,sc:c[0],top:c[1],sp:c[2],w:c[3]*c[0],thr:c[4],x:rn(-100,400),la:c[0]<.6?.72:c[0]<.8?.88:1}});
 clouds.forEach(c=>c.el.style.top=c.top+'%');
 const rb=document.createElement('div');rb.className='rb';rb.innerHTML='<svg viewBox="0 0 200 104" fill="none" stroke-width="3.2">'+['#FF9FA8','#FFC796','#FFEBA0','#B6EBB0','#A6D9F5','#C3B5F2'].map((c,i)=>`<path d="M${8+i*3.2} 104A${92-i*3.2} ${92-i*3.2} 0 0 1 ${192-i*3.2} 104" stroke="${c}" stroke-opacity=".55"/>`).join('')+'</svg>';
 orb.after(cl);cl.after(rb);
 const mk=(c,h)=>{const d=document.createElement('div');d.className=c;if(h)d.innerHTML=h;return d};
 const fog=mk('fog','<i></i><i></i>'),glow=mk('glow'),ff=mk('ffly',Array.from({length:ext?16:9},()=>`<i style="--x:${rn(4,94).toFixed(0)}%;--y:${rn(10,80).toFixed(0)}%;--d:${rn(5,9).toFixed(1)}s;--l:${rn(-8,0).toFixed(1)}s"></i>`).join('')),shade=mk('shade'),cv=document.createElement('canvas'),fl=mk('flash');cv.className='wfx';
 const ap=q('.a-shadow');[glow,fog,ff].forEach(e=>ap.before(e));r.append(shade,cv,fl);
 this.rt.push({ext,stage,r,orb,clouds,rb,cv,cx:cv.getContext('2d'),fl,W:0,H:0,fh:90,dr:[],fk:[],rp:[],bolt:null,nb:4,ph:'',drew:0,pv:r.classList.contains('pv')});this.dirty=1},
cloudSVG(w,n){const h=w*.56,r=h*.26,y0=h*.62,u=w/6,id='cg'+n+'_'+(Math.random()*1e5|0),pf=[[.22,.64,.2],[.4,.38,.3],[.62,.3,.26],[.8,.52,.2]],pf2=[[.18,.66,.19],[.37,.42,.27],[.55,.26,.3],[.75,.4,.24],[.85,.6,.17]];const P=Math.random()<.5?pf:pf2;
 const cs=P.map(p=>`<circle cx="${(p[0]*w).toFixed(1)}" cy="${(p[1]*h).toFixed(1)}" r="${(p[2]*w*.52).toFixed(1)}"/>`).join('');
 return`<svg width="${w.toFixed(0)}" height="${h.toFixed(0)}" viewBox="0 0 ${w.toFixed(0)} ${h.toFixed(0)}"><defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${h.toFixed(0)}"><stop offset="0" style="stop-color:var(--cl-hi,#F8FCFF)"/><stop offset=".62" style="stop-color:var(--cl-hi,#F8FCFF)"/><stop offset="1" style="stop-color:var(--cl-lo,#DDE8EF)"/></linearGradient></defs><g fill="url(#${id})">${cs}<rect x="${(w*.08).toFixed(1)}" y="${(h*.5).toFixed(1)}" width="${(w*.84).toFixed(1)}" height="${(h*.46).toFixed(1)}" rx="${(h*.23).toFixed(1)}"/></g><ellipse cx="${(w*.4).toFixed(1)}" cy="${(h*.26).toFixed(1)}" rx="${(w*.12).toFixed(1)}" ry="${(h*.09).toFixed(1)}" fill="#fff" opacity=".42"/><ellipse cx="${(w*.66).toFixed(1)}" cy="${(h*.3).toFixed(1)}" rx="${(w*.07).toFixed(1)}" ry="${(h*.06).toFixed(1)}" fill="#fff" opacity=".3"/></svg>`},
start(){this.started=1;const m=this.mode();let d=new Date();this.ah=d.getHours()+d.getMinutes()/60;this.target();Object.assign(this.s,{h:this.t.h},this.t.w);
 if(m==='real'){const go=()=>{this.fetchWx()};if(navigator.permissions&&navigator.permissions.query)navigator.permissions.query({name:'geolocation'}).then(r=>{this.granted=r.state==='granted';if(this.granted)go();else if(!(Cfg.v.wxCache))this.stat('尚未同步現實天氣：請於「時間與天氣」按「立即同步」並允許定位')}).catch(()=>{});else go()}
 this.last=performance.now();requestAnimationFrame(n=>this.frame(n))},
target(){const m=this.mode();let h,w;if(m==='manual'){h=byId(Cfg.v.envTime).h;w=Cfg.v.envWx}else if(m==='real'){const d=new Date();h=d.getHours()+d.getMinutes()/60+d.getSeconds()/3600;w=Cfg.v.wxCache&&Cfg.v.wxCache.wx}else{h=this.ah;w=this.aw}
 if(!WX[w])w='sunny';if(w!==this.wid){const old=this.wid;this.wid=w;if((old==='rain'||old==='storm')&&(w==='sunny'||w==='cloudy')&&h>6.5&&h<17.5&&this.started>1)this.rbT=48}
 this.t={h,w:WX[w]}},
freeze(){if(this.mode()!=='manual'){Cfg.set('envTime',idAt(this.s.h));Cfg.set('envWx',this.wid);Cfg.set('envMode','manual')}},
pname(h=this.s.h){return byId(idAt(((h%24)+24)%24)).n},
bucket(h){return h>=5&&h<8?'dawn':h>=8&&h<17?'day':h>=17&&h<19?'dusk':'night'},
frame(now){requestAnimationFrame(n=>this.frame(n));let dt=Math.min(.05,(now-this.last)/1000);this.last=now;if(document.hidden||dt<=0)return;this.started=2;
 const s=this.s;if(this.mode()==='auto'){this.ah=(this.ah+dt*.05)%24;this.an-=dt;if(this.an<=0){this.an=rn(75,160);const ks=['sunny','sunny','cloudy','cloudy','rain','storm','fog','snow'].filter(k=>k!==this.aw);this.aw=ks[Math.random()*ks.length|0]}}
 if(this.mode()==='real'&&this.granted&&(this.pt-=dt)<=0){this.pt=1200;this.fetchWx()}
 this.target();const t=this.t;let df=t.h-s.h;df-=Math.round(df/24)*24;const k1=1-Math.exp(-dt*2.2),k2=1-Math.exp(-dt*1.2);
 if(Math.abs(df)>.002){s.h=((s.h+df*k1)%24+24)%24;this.dirty=1}else if(s.h!==t.h){s.h=t.h;this.dirty=1}
 for(const k in t.w){if(k==='n')continue;const d=t.w[k]-s[k];if(Math.abs(d)>.003){s[k]+=d*k2;this.dirty=1}else s[k]=t.w[k]}
 if(this.rbT>0)this.rbT-=dt;
 if(this.dirty){this.dirty=0;this.paint()}
 if((this.lab-=dt)<=0){this.lab=4;if(typeof HUD!=='undefined'&&HUD.tick)HUD.tick()}
 const rm=document.documentElement.dataset.motion==='reduce';
 for(const e of this.rt){if(e.stage.running===false||!e.r.clientWidth)continue;
  const page=e.r.closest('.page'),sheet=e.r.closest('.sheet');
  if(page&&!page.classList.contains('on')||sheet&&!sheet.classList.contains('open'))continue;
  e._fxDelta=(e._fxDelta||0)+dt;
  const freq=e.r.id==='homeStage'?1/30:1/24;
  if(e._fxDelta<freq)continue;
  const elapsed=Math.min(.075,e._fxDelta);e._fxDelta=0;this.fx(e,elapsed,rm);
 }},
paint(){const s=this.s,p=this.pal(s.h),g=s.gr,fg=s.fog,sn=s.snow,L=p.lum*(1-.12*g-.1*s.th),gray=c=>{const v=c[0]*.3+c[1]*.59+c[2]*.11;return[v*.94,v*.98,v*1.06]};
 const fogc=mu([226,231,240],p.lum),snc=mu([232,238,248],Math.min(1,p.lum+.12));
 const sky=p.sky.map(c=>{c=mx(c,gray(c),g*.8);c=mu(c,1-.22*s.th-.08*g);c=mx(c,fogc,fg*.55);return mx(c,snc,sn*.3)});
 const f=(c,sk,ks)=>{c=mx(mu(c,L),mu(p.tint,L),p.k*.62);c=mx(c,mu(gray(c),.97),g*.4);return mx(c,mu(snc,.96),c01(sn*sk)*ks)};
 const wet=1-.08*c01(s.rain);const fa=mu(f(B.fa,.9,1),wet),fb=mu(f(B.fb,.9,1),wet);
 const hi0=mx(mx([255,255,255],p.tint,p.k*.9),mu([150,160,178],1.05),g*.85),hi=mu(hi0,Math.min(1,p.lum+.08)),lo=mx(mu(hi,.88),mu(mx([150,172,212],p.tint,p.k),p.lum),.38);
 const orbA=Math.max(0,1-g*1.05)*(1-fg*.7)*(1-sn*.8);
 const night=!(s.h>=5.5&&s.h<18.5);let pr,y,x;if(!night){pr=(s.h-5.5)/13}else{pr=(((s.h-18.5)%24+24)%24)/11}x=12+76*pr;y=46-40*Math.sin(Math.PI*pr);
 const star=p.st*(1-g*.85)*(1-fg*.5),ffv=Math.max(0,(star-.3)/.7)*(1-c01(s.rain))*(1-sn)*(1-s.th),shd=.12+.24*c01(p.lum*(1-g*.7)-(1-p.lum)*.5);
 const vars={'--sky-a':rg(sky[0]),'--sky-b':rg(sky[1]),'--sky-c':rg(sky[2]),'--orb':rg(p.orb),'--orb-glow':ra(p.orb,.42*orbA),'--floor-a':rg(fa),'--floor-b':rg(fb),'--rug':ra(mu([255,255,255],1),.38*p.lum),'--mtn':rg(f(B.mtn,.3,.5)),'--hill-x':rg(f(B.hx,.45,.7)),'--hill-y':rg(f(B.hy,.35,.6)),'--tree-a':rg(f(B.ta,.2,.5)),'--tree-b':rg(f(B.tb,.2,.5)),'--bush':rg(f(B.bush,.5,.8)),'--cloud':ra(hi,.9),'--cl-hi':rg(hi),'--cl-lo':rg(lo),'--stars':star.toFixed(3),'--gr':g.toFixed(3),'--fog':c01(fg).toFixed(3),'--fogc':ra(fogc,.28),'--fogc2':ra(fogc,.62),'--ff':ffv.toFixed(3),'--gw':(p.gw*(1-g*.7)).toFixed(3),'--shd':shd.toFixed(3),'--wind':s.wind.toFixed(2),'--shc':ra(p.tint,(1-p.lum)*.5+.05*g*(1-p.lum)+.05*s.th)};
 const bk=this.bucket(s.h);
 for(const e of this.rt){
  if(!e.r.isConnected)continue;
  const st=e.r.style;for(const k in vars)if(st.getPropertyValue(k)!==vars[k])st.setProperty(k,vars[k]);
  const half=night?(e.pv?18:28):(e.pv?23:37);e.orb.classList.toggle('moon',night);{
    const positionX=`calc(${x.toFixed(2)}% - ${half}px)`,positionY=`calc(var(--sat,0px) + ${y.toFixed(2)}%)`,opacity=orbA.toFixed(3),gx=x.toFixed(1)+'%';
    if(e.orb.style.left!==positionX)e.orb.style.left=positionX;
    if(e.orb.style.top!==positionY)e.orb.style.top=positionY;
    if(e.orb.style.opacity!==opacity)e.orb.style.opacity=opacity;
    if(st.getPropertyValue('--gx')!==gx)st.setProperty('--gx',gx);
  }
  e.clouds.forEach(c=>{const v=(c01((s.cl-c.thr)*4)*c.la).toFixed(2);if(c.el.style.opacity!==v)c.el.style.opacity=v});
  if(e.ph!==bk){e.ph=bk;e.r.dataset.phase=bk;e.stage.phase=bk}}},
fx(e,dt,rm){const s=this.s,r=e.r,W=r.clientWidth,H=r.clientHeight,dpr=Math.min(window.devicePixelRatio||1,1.5),xt=e.ext||0,ex=Math.round(W*xt),ey=Math.round(H*xt),ks=(1+2*xt)*(1+xt);
 if(e.W!==W||e.H!==H){const first=!e.W;e.W=W;e.H=H;e.cv.width=(W+2*ex)*dpr;e.cv.height=(H+2*ey)*dpr;e.cx.setTransform(dpr,0,0,dpr,ex*dpr,ey*dpr);if(xt&&first)e.clouds.forEach(c=>c.x=rn(-ex-c.w,W+ex));const f=r.querySelector('.floor');e.fh=f?f.offsetHeight:90;e.dr.length=0;e.fk.length=0}
 const wd=.35+s.wind;if(!rm)for(const c of e.clouds){c.x+=c.sp*wd*dt;if(c.x>W+ex+20)c.x=-ex-c.w-20;c.el.style.transform=`translate3d(${c.x.toFixed(1)}px,0,0)`}
 e.rb.classList.toggle('on',this.rbT>0);
 const cx=e.cx,act=s.rain>.02||s.snow>.02||e.rp.length||e.bolt;if(!act){if(e.drew){cx.clearRect(-ex,-ey,W+2*ex,H+2*ey);e.drew=0}return}
 e.drew=1;cx.clearRect(-ex,-ey,W+2*ex,H+2*ey);const g0=H-e.fh*.82,g1=H-e.fh*.16;
 if(s.rain>.02){const n=Math.min(Math.round((rm?40:120)*ks),Math.round(s.rain*78*ks)),sl=.18+s.wind*.22;cx.strokeStyle=`rgba(205,225,246,${.3+.18*Math.min(1,s.rain)})`;cx.lineWidth=1.2;cx.beginPath();
  const nd=(d,init)=>{d.x=rn(-30-ex,W+60+ex);d.gy=rn(g0,g1);d.y=init?rn(-20-ey,d.gy):rn(-80-ey,-10-ey);d.v=rn(560,780)*(1+s.th*.35);d.l=rn(9,16);return d};
  for(let i=0;i<n;i++){const d=e.dr[i]||(e.dr[i]=nd({},1));d.y+=d.v*dt;d.x+=d.v*dt*sl;if(d.y>=d.gy){if(e.rp.length<12*(1+2*xt)&&Math.random()<.45)e.rp.push({x:d.x,y:d.gy,r:1,a:.5});nd(d,0)}cx.moveTo(d.x,d.y);cx.lineTo(d.x-d.l*sl,d.y-d.l)}cx.stroke()}
 if(e.rp.length){cx.lineWidth=1;for(let i=e.rp.length-1;i>=0;i--){const q=e.rp[i];q.r+=dt*20;q.a-=dt*1.1;if(q.a<=0){e.rp.splice(i,1);continue}cx.strokeStyle=`rgba(255,255,255,${q.a.toFixed(2)})`;cx.beginPath();cx.ellipse(q.x,q.y,q.r,q.r*.34,0,0,6.283);cx.stroke()}}
 if(s.snow>.02){const n=Math.min(Math.round((rm?24:80)*ks),Math.round(s.snow*62*ks));cx.fillStyle='rgba(255,255,255,.88)';cx.beginPath();
  for(let i=0;i<n;i++){const d=e.fk[i]||(e.fk[i]={x:rn(-ex,W+ex),y:rn(-ey,H*.8),r:rn(1.2,3),v:rn(20,42),ph:rn(0,6),gy:rn(g0,g1)});d.ph+=dt;d.y+=d.v*dt;d.x+=(Math.sin(d.ph*1.3)*12+s.wind*9)*dt;if(d.y>=d.gy){d.y=rn(-30-ey,-4-ey);d.x=rn(-ex,W+ex);d.gy=rn(g0,g1)}cx.moveTo(d.x+d.r,d.y);cx.arc(d.x,d.y,d.r,0,6.283)}cx.fill()}
 if(s.th>.4&&!rm){if((e.nb-=dt)<=0){e.nb=rn(3.5,9);const pts=[],x0=rn(W*.15,W*.85),ye=H*rn(.38,.55);let x=x0,y=0;while(y<ye){pts.push([x,y]);y+=ye/8;x+=rn(-22,22)}e.bolt={pts,life:.2};/* subdued lightning is rendered as a narrow bolt on the weather canvas; no full-screen strobe */}}
 if(e.bolt){const b=e.bolt;b.life-=dt;if(b.life<=0)e.bolt=null;else{const a=Math.min(1,b.life/.12);cx.lineJoin='round';cx.strokeStyle=`rgba(190,210,255,${(a*.35).toFixed(2)})`;cx.lineWidth=6;cx.beginPath();b.pts.forEach((p,i)=>i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.stroke();cx.strokeStyle=`rgba(255,255,255,${a.toFixed(2)})`;cx.lineWidth=2;cx.stroke()}}},
codeToWx(c,cc){return c>=95?'storm':(c>=71&&c<=77)||c===85||c===86?'snow':(c>=51&&c<=67)||(c>=80&&c<=82)?'rain':c===45||c===48?'fog':(c===3||cc>=70||(c===2&&cc>=50))?'cloudy':'sunny'},
stat(m,warn){this.msg=m;if(warn&&this.lw!==m){this.lw=m;if(typeof toast==='function')toast(m,'info')}if(this.cb)this.cb()},
async fetchWx(force){if(this.mode()!=='real'||this.busy)return;const c=Cfg.v.wxCache;if(!force&&c&&Date.now()-c.ts<12e5){this.stat('已同步現實天氣：'+WX[c.wx].n);return}
 if(!navigator.geolocation){this.stat('此裝置不支援定位，暫以晴天顯示',1);return}
 this.busy=1;this.stat('定位並取得天氣中…');
 try{const p=await new Promise((ok,no)=>navigator.geolocation.getCurrentPosition(ok,no,{timeout:12000,maximumAge:6e5}));this.granted=1;
  const ac=new AbortController(),to=setTimeout(()=>ac.abort(),10000);
  const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.coords.latitude.toFixed(2)}&longitude=${p.coords.longitude.toFixed(2)}&current=weather_code,cloud_cover`,{signal:ac.signal});clearTimeout(to);
  if(!r.ok)throw new Error('http');const j=await r.json(),w=this.codeToWx(j.current.weather_code,j.current.cloud_cover);Cfg.set('wxCache',{wx:w,ts:Date.now()});this.stat('已同步現實天氣：'+WX[w].n)}
 catch(e){const m=e&&e.code===1?'未授權定位：請在系統設定允許本 App 使用位置':e&&e.code?'無法取得位置，請確認定位服務已開啟':'無法取得天氣資料，請檢查網路';this.stat(m+(c?'（沿用上次資料）':'（暫以晴天顯示）'),1)}
 this.busy=0},
open(){const sw=(k,a)=>`<div class="ev-seg" data-k="${k}">${a.map(x=>`<button data-k="${k}" data-v="${x[0]}">${x[1]}</button>`).join('')}</div>`;
 const tc=PH.map(p=>`<button data-k="time" data-v="${p.id}"><i style="background:linear-gradient(180deg,${rg(p.sky[0])},${rg(p.sky[2])})"></i>${p.n}</button>`).join(''),wc=Object.keys(WX).map(k=>`<button data-k="wx" data-v="${k}">${wsvg(k,18)}${WX[k].n}</button>`).join('');
 const sh=openSheet(`<div class="sh-body ev"><div class="sh-title">時間與天氣</div>${sw('mode',[['manual','自由切換'],['real','現實同步'],['auto','自動循環']])}<div class="ev-st"><span id="evSt"></span><button id="evSync" style="display:none">立即同步</button></div><div class="ev-h">時段</div><div class="ev-g">${tc}</div><div class="ev-h">天氣</div><div class="ev-g">${wc}</div><div class="ev-h">介面主題（與場景日夜互相獨立）</div>${sw('theme',[['system','跟隨系統'],['light','淺色'],['dark','深色']])}</div>`),el=sh.el;
 const paint=()=>{const m=this.mode(),tid=m==='manual'?Cfg.v.envTime||'noon':idAt(this.t.h),wid=m==='manual'?(Cfg.v.envWx||this.wid):this.wid;el.querySelectorAll('[data-v]').forEach(b=>{const k=b.dataset.k,v=b.dataset.v;b.classList.toggle('on',k==='mode'?v===m:k==='theme'?v===Cfg.v.theme:k==='time'?v===tid:v===wid)});
  $('#evSync',el).style.display=m==='real'?'':'none';$('#evSt',el).textContent=m==='real'?(this.msg||'依裝置時間與所在地天氣同步'):m==='auto'?'遊戲時間自動流動，天氣隨機變化':'點選時段與天氣，場景會平滑轉換'};
 this.cb=paint;sh.el.addEventListener('click',ev=>{const b=ev.target.closest('[data-v],#evSync');if(!b)return;buzz(6);if(b.id==='evSync'){this.fetchWx(true);return}
  const k=b.dataset.k,v=b.dataset.v;if(k==='mode'){if(v==='manual')this.freeze();else{Cfg.set('envMode',v);if(v==='real'){this.msg='';this.fetchWx(true)}else{this.ah=this.s.h;this.aw=this.wid}}}
  else if(k==='time'){this.freeze();Cfg.set('envTime',v)}else if(k==='wx'){this.freeze();Cfg.set('envWx',v)}else if(k==='theme')Theme.set(v,ev);paint()});
 paint();const _c=sh.close;return sh}};
return E})();
const Fx={
centerIn(box,a){const br=box.getBoundingClientRect(),ar=a.getBoundingClientRect();box.scrollTo({left:box.scrollLeft+(ar.left-br.left)-(br.width-ar.width)/2,behavior:'smooth'})},
PAL:['#FFB3C7','#FFD0DD','#FFE6A0','#CDBBFF','#BDE7FF','#FFCBAA'],
STAR:'<svg viewBox="0 0 24 24"><path d="M12 2c.8 5.5 4.5 9.2 10 10-5.5.8-9.2 4.5-10 10-.8-5.5-4.5-9.2-10-10 5.5-.8 9.2-4.5 10-10z" fill="currentColor"/></svg>',
burst(stage,x,y,n=6,pal=Fx.PAL){const f=stage.fx,now=performance.now();if(!f)return;if(now-(stage._pb||0)<260)n=Math.min(n,2);stage._pb=now;if(f.childElementCount>9)return;
 for(let i=0;i<n;i++){const k=i%3,e=document.createElement('span');e.className='pp'+(k===2?' d':'');if(k===0)e.innerHTML=HEART;else if(k===1)e.innerHTML=Fx.STAR;
  const sz=k===2?rn2(3,5):rn2(8,13);e.style.cssText=`left:${x+rn2(-8,8)}px;top:${y+rn2(-6,6)}px;--s:${sz}px;--c:${pal[Math.random()*pal.length|0]};--dx:${rn2(-30,30)}px;--dy:${-rn2(34,62)}px;--r:${rn2(-40,40)}deg;--t:${rn2(1.3,1.9)}s;animation-delay:${i*70}ms`;
  f.appendChild(e);e.addEventListener('animationend',()=>e.remove(),{once:true})}}};
const rn2=(a,b)=>a+Math.random()*(b-a);
/* 撫摸特效：小愛心、星光與粉彩粒子 */
Stage.prototype.hearts=function(n=3){let x,y;const pt=this._pt;if(pt&&performance.now()-pt.t<700){x=pt.x;y=pt.y}else{x=this.x+this.size*.5;y=this.feetY-this.h-this.hitTop}Fx.burst(this,x,y,n>=3?6:3)};
{const _s=Stage.prototype.setPhase;Stage.prototype.setPhase=function(){Env.attach(this);if(!this._pd&&this.art){this._pd=1;this.art.addEventListener('pointerdown',e=>{const r=this.root.getBoundingClientRect();this._pt={x:e.clientX-r.left,y:e.clientY-r.top,t:performance.now()}},true)}this.phase=Env.bucket(Env.s.h);this.root.dataset.phase=this.phase}}
{const _p=Stage.prototype.pet;Stage.prototype.pet=function(){const was=this.state;_p.apply(this,arguments);if(was!=='held'&&was!=='sleep'&&this.state==='happy'){if(this.h===0&&this.vy>150)this.vy=150;const t=this.tiltEl;t.classList.remove('nz');void t.offsetWidth;t.classList.add('nz');t.addEventListener('animationend',()=>t.classList.remove('nz'),{once:true})}}}
/* 澆水：直接點植物，或先選工具 */
Object.assign(Home,{wt:0,wbusy:0,
water(){this.wt?this.cancelTool():this.enterTool();$('#fab').classList.remove('open')},
enterTool(){const p=(Home.plantEl?Home.plantEl():null);if(!p||this.wbusy)return;this.wt=1;p.classList.add('thirsty');const c=document.createElement('div');c.className='wcan hint';c.innerHTML=Fx.CAN;p.append(c);($('.qa-pill[data-act=water]')||{classList:{add(){},remove(){}}}).classList.add('on');this.stage.say('點一下植物來澆水吧！');buzz(8);clearTimeout(this.wtT);this.wtT=setTimeout(()=>this.cancelTool(),9000)},
cancelTool(){this.wt=0;clearTimeout(this.wtT);const p=(Home.plantEl?Home.plantEl():null);if(p){p.classList.remove('thirsty');p.querySelectorAll('.wcan.hint').forEach(e=>e.remove())}const b=$('.qa-pill[data-act=water]');b&&b.classList.remove('on')},
waterPlant(){const p=(Home.plantEl?Home.plantEl():null);if(!p||this.wbusy)return;this.wbusy=1;this.cancelTool();buzz(12);
 const c=document.createElement('div');c.className='wcan';c.innerHTML=Fx.CAN;p.append(c);
 for(let i=0;i<9;i++){const d=document.createElement('i');d.className='wd';d.style.cssText=`--x:${rn2(4,42)}%;--l:${(.62+i*.1).toFixed(2)}s`;p.append(d)}
 for(let i=0;i<4;i++){const d=document.createElement('i');d.className='bead';d.style.cssText=`--x:${rn2(18,78)}%;--y:${rn2(8,50)}%;--l:${(1.1+i*.18).toFixed(2)}s`;p.append(d)}
 setTimeout(()=>{p.classList.remove('water');void p.offsetWidth;p.classList.add('water');const r=p.getBoundingClientRect(),sr=this.stage.root.getBoundingClientRect();Fx.burst(this.stage,r.left-sr.left+r.width*.5,r.top-sr.top+r.height*.3,5,['#BFE6FF','#FFFFFF','#A6DCF5','#D7F0FF'])},900);
 setTimeout(()=>{this.stage.say(rainy()?'下雨天也要喝水喔～':'植物看起來好開心。');Eco.act('water')},1400);
 setTimeout(()=>{p.classList.remove('water');p.querySelectorAll('.wcan,.wd,.bead').forEach(e=>e.remove())},2300);setTimeout(()=>{this.wbusy=0},2500)}});
const rainy=()=>Env.wid==='rain'||Env.wid==='storm';
Fx.CAN='<svg viewBox="0 0 52 44"><path d="M16 14h24l-2 22a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z" fill="#8FD0EE"/><path d="M16 14h24l-.7 7H16.7z" fill="#fff" opacity=".4"/><path d="M17 20 4 9l-2 4 14 13z" fill="#6DB6DA"/><path d="M40 18c10 0 10 14 0 14" stroke="#6DB6DA" stroke-width="3.2" fill="none" stroke-linecap="round"/><ellipse cx="28" cy="14" rx="12" ry="2.6" fill="#6DB6DA"/><circle cx="4" cy="9" r="2.2" fill="#fff" opacity=".7"/></svg>';
{const _hi=Home.init;Home.init=function(){_hi.apply(this,arguments);const p=(Home.plantEl?Home.plantEl():null);p&&p.addEventListener('click',e=>{e.stopPropagation();Home.waterPlant()});
 const rx=$('.rail-ext');if(rx&&!$('#railEnv')){const b=document.createElement('button');b.className='rail-btn';b.id='railEnv';b.setAttribute('aria-label','時間與天氣');b.innerHTML=wsvg('sunny',22);b.onclick=()=>{buzz(8);Env.open()};rx.prepend(b)}
 const w=$('.wx');w&&w.addEventListener('click',e=>{e.stopPropagation();buzz(8);Env.open()})}}
HUD.tick=function(){const n=$('#wxName');if(!n)return;const h=Env.s.h,hh=Math.floor(h)%24,mm=Math.floor((h%1)*60);n.textContent=Env.pname();$('#wxTime').textContent=`${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;const ic=$('#wxIc');if(ic.dataset.weather!==Env.wid){ic.dataset.weather=Env.wid;ic.innerHTML=wsvg(Env.wid,20)}const night=!(h>=5.5&&h<18.5);ic.style.color=night?'#CFD6FF':Env.wid==='sunny'?'#FFB93B':'#8FA6C6'};
/* 修正：工坊角色列只在自身水平捲動，並防止祖先被連帶捲動 */
document.addEventListener('scroll',e=>{const t=e.target;if(!t||t===document||!t.classList||t.scrollLeft===0)return;if(t.id==='stSwitch'||t.matches('.swrow,.chips'))return;if(getComputedStyle(t).overflowX==='hidden'||t===document.documentElement||t===document.body)t.scrollLeft=0},true);
addEventListener('scroll',()=>{if(scrollX)scrollTo(0,scrollY)},{passive:true});

/* ==========================================================
   2.0／2.1 角色系統：個性引擎、備份、新增精靈、角色編輯器
   ========================================================== */
Object.assign(IC,{
  edit:'<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  copy:'<rect x="9" y="9" width="11" height="11" rx="3"/><path d="M15 9V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v5a3 3 0 0 0 3 3h2"/>',
  download:'<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 20h14"/>',
  dice:'<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="9" cy="9" r="1.2" fill="currentColor"/><circle cx="15" cy="15" r="1.2" fill="currentColor"/><circle cx="15" cy="9" r="1.2" fill="currentColor"/><circle cx="9" cy="15" r="1.2" fill="currentColor"/>',
  x:IC.x||'<path d="M6 6l12 12M18 6 6 18"/>',
  left:IC.left||'<path d="M15 5l-7 7 7 7"/>'
});

const uid=p=>(p||'c')+'_'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const SLIDERS=[
  {k:'lively',t:'活潑程度',a:'沉穩',b:'活潑',hi:'活力滿滿',lo:'沉穩安靜'},
  {k:'social',t:'外向程度',a:'內向',b:'外向',hi:'外向愛熱鬧',lo:'內向愛獨處'},
  {k:'expr',t:'情緒表達',a:'含蓄',b:'豐富',hi:'情緒外露',lo:'含蓄內斂'},
  {k:'pace',t:'行動速度',a:'慢條斯理',b:'風風火火',hi:'動作俐落',lo:'慢條斯理'},
  {k:'indep',t:'獨立性',a:'愛黏人',b:'很獨立',hi:'獨立自主',lo:'愛黏人'},
  {k:'friendly',t:'友善程度',a:'有點高冷',b:'親切友善',hi:'親切友善',lo:'有點高冷'}];
const TEND=[
  {id:'lively+',t:'更活潑',fx:{lively:18}},{id:'lively-',t:'更沉穩',fx:{lively:-18}},
  {id:'social+',t:'更外向',fx:{social:18}},{id:'social-',t:'更內向',fx:{social:-18}},
  {id:'expr+',t:'更愛表達',fx:{expr:18}},{id:'expr-',t:'更含蓄',fx:{expr:-18}},
  {id:'pace+',t:'動作更快',fx:{pace:18}},{id:'pace-',t:'動作更慢',fx:{pace:-18}},
  {id:'indep+',t:'更獨立',fx:{indep:18}},{id:'indep-',t:'更黏人',fx:{indep:-18}},
  {id:'friendly+',t:'更友善',fx:{friendly:18}},{id:'friendly-',t:'更高冷',fx:{friendly:-18}}];
const BHV=[
  {id:'rest',t:'愛休息',w:{sit:1.5,sleep:1.5,stand:.9}},
  {id:'explore',t:'愛探索',w:{look:2,visit:1.8,stroll:1.3}},
  {id:'play',t:'愛玩鬧',w:{wiggle:1.6,bounce:1.6,dash:1.5,hop:1.4}},
  {id:'talk',t:'愛說話',tk:.6},{id:'quiet',t:'安靜少話',tk:1.7}];
const TRAITS=[
 {id:'lazy',em:'😴',t:'懶散',d:'愛坐著、動作慢',fx:{lively:-22,pace:-22},w:{sit:1.5,sleep:1.4,dash:.5,bounce:.6},idle:['再躺五分鐘就好…','動一下好累喔。','今天的目標：什麼都不做。'],pet:['嗯…繼續，不要停。']},
 {id:'sleepy',em:'💤',t:'貪睡',d:'很容易打瞌睡',fx:{pace:-8},w:{sleep:2.2,sit:1.3},idle:['呼啊…好睏。','眼睛自己閉起來了…','夢裡有好吃的。'],pet:['嗯嗯…還想睡…']},
 {id:'curious',em:'🔍',t:'好奇',d:'東張西望、愛探索',fx:{lively:8},w:{look:2.4,visit:1.8,stroll:1.3},idle:['那邊是什麼？','咦，那朵雲形狀好特別。','我去看看喔！'],pet:['咦？你的手好暖。']},
 {id:'clingy',em:'🥺',t:'愛撒嬌',d:'黏人、需要陪伴',fx:{indep:-26,expr:14,friendly:8},w:{},idle:['你在哪裡呀～','摸摸我嘛～','不要丟下我一個人喔。'],pet:['再抱一下下～','最喜歡了！不要放開～']},
 {id:'tsun',em:'😤',t:'傲嬌',d:'嘴硬心軟',fx:{friendly:-16,expr:10,indep:16},w:{},idle:['才、才不是在等你。','哼，隨便你啦。','別誤會，我只是剛好經過。'],pet:['只、只能一下喔！','才沒有很舒服！']},
 {id:'shy',em:'🙈',t:'害羞',d:'怕生、容易臉紅',fx:{social:-26,expr:-8},w:{visit:1.6},idle:['那個…你在看我嗎？','我、我在這裡就好。','不要一直盯著我看啦…'],pet:['呀！突、突然碰我…']},
 {id:'hot',em:'🔥',t:'熱血',d:'幹勁十足',fx:{lively:24,pace:16,expr:14},w:{dash:1.6,bounce:1.5},idle:['今天也要全力以赴！','衝啊——！','沒有做不到的事！'],pet:['充滿力量了！！']},
 {id:'gentle',em:'🌸',t:'溫柔',d:'體貼、說話輕輕的',fx:{friendly:20,pace:-8},w:{},idle:['你今天還好嗎？','累了就休息一下吧。','我會一直陪著你。'],pet:['謝謝你，好溫柔的手。']},
 {id:'sharp',em:'🌶️',t:'毒舌',d:'講話直接',fx:{friendly:-12,expr:8,social:6},w:{},idle:['又在發呆？真閒。','別問，問就是不想理你。','我只是實話實說。'],pet:['手拿開…好吧，不用拿開。']},
 {id:'chatty',em:'💬',t:'話癆',d:'停不下來的嘴',fx:{social:16,expr:16},w:{},tk:.5,idle:['欸欸欸，你知道嗎！','我跟你說喔～','對了對了還有一件事！'],pet:['哇～我正好有好多話想說！']},
 {id:'quiet',em:'🤫',t:'沉默寡言',d:'話很少',fx:{social:-12},w:{},tk:2,idle:['……','（安靜地看著遠方）'],pet:['……嗯。']},
 {id:'sporty',em:'🏃',t:'愛運動',d:'精力旺盛',fx:{lively:20,pace:16},w:{dash:1.6,bounce:1.5,hop:1.4},idle:['來比賽跑步吧！','身體要動一動才舒服。','跳跳跳！'],pet:['等我跑完再讓你摸！']},
 {id:'homebody',em:'🏠',t:'宅宅',d:'喜歡待在家',fx:{social:-18,indep:8},w:{visit:1.6,stroll:.7},idle:['外面太吵了，這裡剛好。','今天也不想出門。','待在家最舒適。'],pet:['在家被摸，最幸福。']},
 {id:'dreamer',em:'🌙',t:'夢想家',d:'愛幻想、慢悠悠',fx:{pace:-10,expr:10},w:{look:1.6,sit:1.3},idle:['如果雲是棉花糖就好了。','我昨天夢到會飛。','星星是不是在對我眨眼？'],pet:['像在夢裡一樣溫暖。']},
 {id:'prank',em:'😈',t:'搗蛋',d:'愛惡作劇',fx:{lively:14,friendly:-4},w:{wiggle:1.7,bounce:1.5,dash:1.4},idle:['嘿嘿，我有個壞主意。','偷偷把你的東西藏起來～','被發現了嗎？'],pet:['哈哈！被你抓到了！']},
 {id:'foodie',em:'🍙',t:'貪吃',d:'滿腦子好吃的',fx:{},w:{},idle:['肚子咕嚕咕嚕叫了。','好想吃點心喔。','今天的晚餐吃什麼？'],pet:['摸摸會餓得更快喔。']}
];
const TONES=[{v:'',t:'自然'},{v:'soft',t:'溫柔'},{v:'lively',t:'活潑'},{v:'cold',t:'冷淡'},{v:'formal',t:'正式'}];
const LINE_KINDS=[['idle','待機'],['pet','撫摸'],['wake','睡醒'],['drop','被抱起'],['greet','登場問候'],['call','呼喚']];
const TONE_LINES={
  idle:{lively:[['今天精神好到睡不著！','好想動一動～','我們來跑跑跳跳吧！'],['…慢慢來就好。','今天也安安靜靜的。','再發呆一下下。']],
    social:[['陪我聊聊天嘛～','今天有什麼好玩的事嗎？'],['有點想一個人待著。','這裡的角落最安心。']],
    expr:[['哇！！好開心！','我的心情全寫在臉上了吧？'],['……還好。','沒什麼，只是在想事情。']],
    pace:[['快快快，下一個！','等不及要出發了！'],['不急，慢慢來。','一步一步就好。']],
    indep:[['我自己可以的。','不用擔心我啦。'],['你去哪裡了…？','可以待在我旁邊嗎？']],
    friendly:[['今天也遇見你，真好。','謝謝你一直陪著我。'],['…別靠太近。','哼，有事嗎？']]},
  pet:{friendly:[['好溫暖，最喜歡你了！','謝謝你～'],['…只准一下。','別、別得寸進尺。']],
    expr:[['呀～好癢好癢！','開心到想轉圈圈！'],['……嗯。','（微微瞇起眼睛）']],
    indep:[[],['再多摸一下嘛～','不要停～']],social:[[],['突、突然碰我會害羞啦…']]},
  drop:{expr:[['哇啊啊啊！！','救命啊～'],['……！','（僵住）']]},
  wake:{lively:[[],['…再五分鐘。']]}};
const DEMO_DATA={
 mochi:{species:'貓咪',bio:'星夢貓。總是把心事藏進閃亮的星星裡，有點小傲嬌，卻很喜歡被陪伴。',likes:['星光','蝴蝶結','甜點'],dislikes:['突然的巨響'],pers:{sl:{lively:59,social:57,expr:64,pace:47,indep:48,friendly:69},traits:['dreamer']}},
 yuzu:{species:'貓咪',bio:'葉風貓。愛護花草的安靜小夥伴，散步時總會發現新奇的小東西。',likes:['植物','小花','散步'],dislikes:['髒亂'],pers:{sl:{lively:45,social:53,expr:52,pace:37,indep:49,friendly:90},traits:['gentle','curious']}},
 sora:{species:'貓咪',bio:'暖眠貓。喜歡軟軟的毛毯與涼涼的雲影，總想把快樂的夢分給你。',likes:['打盹','毛毯','雨聲'],dislikes:['被吵醒'],pers:{sl:{lively:24,social:40,expr:40,pace:30,indep:53,friendly:75},traits:['sleepy','dreamer']}}
};
const SLOTS=[
  {g:'dir',t:'多方向',items:[['dir.front','正面'],['dir.back','背面'],['dir.left','朝左'],['dir.right','朝右']]},
  {g:'act',t:'動作',items:[['act.walk','走路'],['act.sleep','睡覺'],['act.happy','開心'],['act.hop','跳躍']]},
  {g:'expr',t:'表情',items:[['expr.happy','開心'],['expr.shy','害羞'],['expr.sad','難過'],['expr.angry','生氣'],['expr.sleepy','睏睏']]},
  {g:'wear',t:'服裝與配件',items:[['wear.outfit1','服裝 1'],['wear.outfit2','服裝 2'],['wear.acc1','配件 1'],['wear.acc2','配件 2']]}];
const COLORS=['#F4E8D7','#EFB879','#B9CFDF','#C5D3AF','#A78F8D','#B9AACD','#F2DEBD','#E3E4E7','#F2B9B9','#B3DBD5'];
const NAMES=['小栗','雪糕','麻吉','七七','汪汪','團團','星星','芝麻','布丁','小滿','阿墨','糯米','可可','桃桃'];
const LK=3;

const Persona={
  trait(d,id){return TRAITS.find(t=>t.id===id)||(d.pers.custom||[]).find(t=>t.id===id)||null},
  norm(d){
    d=d&&typeof d==='object'?d:{};
    const S=(v,n)=>typeof v==='string'?v.slice(0,n):'';
    const A=(v,n,m)=>Array.isArray(v)?v.filter(x=>typeof x==='string').map(x=>x.trim().slice(0,m||20)).filter(Boolean).slice(0,n):[];
    const o={nick:S(d.nick,16),birthday:S(d.birthday,12),age:S(d.age,12),gender:S(d.gender,12),pronoun:S(d.pronoun,10),species:S(d.species,16),height:S(d.height,12),
      tagline:S(d.tagline,24),bio:S(d.bio,400),story:S(d.story,1200),
      interests:A(d.interests,24),likes:A(d.likes,24),dislikes:A(d.dislikes,24),habits:A(d.habits,24),
      fields:[],lines:{},linesMode:d.linesMode==='override'?'override':'mix',pers:{sl:{},traits:[],custom:[]},speech:{}};
    (Array.isArray(d.fields)?d.fields:[]).slice(0,30).forEach(f=>{if(f&&typeof f==='object')o.fields.push({id:S(f.id,24)||uid('f'),k:S(f.k,16),v:S(f.v,120)})});
    LINE_KINDS.forEach(([k])=>{o.lines[k]=A(d.lines&&d.lines[k],40,80)});
    const p=d.pers&&typeof d.pers==='object'?d.pers:{};
    SLIDERS.forEach(s=>{const v=p.sl&&Number(p.sl[s.k]);o.pers.sl[s.k]=Number.isFinite(v)?Math.round(clamp(v,0,100)):50});
    o.pers.traits=A(p.traits,8,24);
    (Array.isArray(p.custom)?p.custom:[]).slice(0,12).forEach(c=>{if(c&&typeof c==='object'&&typeof c.name==='string'&&c.name.trim())
      o.pers.custom.push({id:S(c.id,24)||uid('t'),name:c.name.trim().slice(0,8),em:S(c.em,4)||'✨',tend:A(c.tend,3,12),bh:A(c.bh,2,12),say:A(c.say,6,40)})});
    const sp=d.speech&&typeof d.speech==='object'?d.speech:{};
    const fr=Number(sp.freq);
    o.speech={self:S(sp.self,8),call:S(sp.call,8),catch:S(sp.catch,60),tic:S(sp.tic,8),tone:TONES.some(t=>t.v===sp.tone)?sp.tone:'',freq:Number.isFinite(fr)?Math.round(clamp(fr,0,100)):50};
    o.pers.traits=o.pers.traits.filter(id=>TRAITS.some(t=>t.id===id)||o.pers.custom.some(c=>c.id===id));
    return o},
  /* 自訂特質 → 與預設特質同格式 */
  ctrait(c){const fx={},w={};let tk=1;
    (c.tend||[]).forEach(id=>{const t=TEND.find(x=>x.id===id);if(t)for(const k in t.fx)fx[k]=(fx[k]||0)+t.fx[k]});
    (c.bh||[]).forEach(id=>{const b=BHV.find(x=>x.id===id);if(b){if(b.w)for(const k in b.w)w[k]=(w[k]||1)*b.w[k];if(b.tk)tk*=b.tk}});
    return{id:c.id,em:c.em,t:c.name,d:'自訂特質',fx,w,tk,idle:c.say||[],pet:[],custom:1}},
  active(d){return d.pers.traits.map(id=>{const t=TRAITS.find(x=>x.id===id);if(t)return t;const c=d.pers.custom.find(x=>x.id===id);return c?this.ctrait(c):null}).filter(Boolean)},
  eff(d){const sl=Object.assign({},d.pers.sl);this.active(d).forEach(t=>{for(const k in t.fx)sl[k]=(sl[k]??50)+t.fx[k]});for(const k in sl)sl[k]=clamp(sl[k],0,100);return sl},
  mind(d){
    const e=this.eff(d),g=k=>(e[k]-50)/50,tr=this.active(d),sp=d.speech,f=(sp.freq-50)/50;
    const W={stroll:clamp(1+.3*g('lively')+.2*g('pace')+.15*g('social'),.4,1.8),visit:clamp(1-.8*g('social')+.15*g('indep'),.3,2.4),
      dash:clamp(1+1*g('lively')+.4*g('pace'),.3,2.2),wiggle:clamp(1+.9*g('expr')+.4*g('lively'),.3,2.4),bounce:clamp(1+.8*g('lively')+.4*g('expr'),.3,2.2),
      hop:clamp(1+.6*g('lively'),.4,1.9),sit:clamp(1-.45*g('lively')-.2*g('pace'),.4,2),sleep:clamp(1-.4*g('lively')-.2*g('pace'),.4,2),
      stretch:clamp(1-.2*g('lively'),.6,1.3),look:clamp(1+.3*g('expr'),.6,1.5)};
    let tk=clamp(1-.45*g('social')-.3*g('expr'),.45,1.8);
    tr.forEach(t=>{if(t.w)for(const k in t.w)W[k]=(W[k]||1)*t.w[k];if(t.tk)tk*=t.tk});
    for(const k in W)W[k]=+clamp(W[k],.15,3.2).toFixed(2);
    tk=clamp(tk*(1-.55*f),.3,3);
    return{e,w:W,talk:+tk.toFixed(2),
      spd:+clamp(1+.30*g('pace')+.12*g('lively'),.55,1.6).toFixed(2),
      idle:+clamp(1-.3*g('lively')-.2*g('pace'),.5,1.9).toFixed(2),
      move:+clamp(1+.45*g('lively')+.25*g('pace')+.2*g('indep'),.35,2).toFixed(2),
      play:+clamp(1+.9*g('lively')+.3*g('expr')+.2*g('social'),.2,2.6).toFixed(2),
      rest:+clamp(1-.5*g('lively')-.25*g('pace'),.4,2.2).toFixed(2),
      hearts:Math.round(clamp(3+2.2*g('friendly')+1.2*g('expr')-.6*g('indep'),1,5))}},
  describe(ch){
    const d=ch.data,m=ch.mind,e=m.e;
    const ex=SLIDERS.map(s=>({s,v:e[s.k]-50})).filter(x=>Math.abs(x.v)>=18).sort((a,b)=>Math.abs(b.v)-Math.abs(a.v)).slice(0,3).map(x=>x.v>0?x.s.hi:x.s.lo);
    const tn=this.active(d).slice(0,3).map(t=>t.t);
    const T=[];
    if(m.play>1.35)T.push('愛玩愛跳');if(m.play<.7)T.push('不太愛蹦蹦跳跳');
    if(m.rest>1.3)T.push('常常坐下來休息');if(m.move>1.3)T.push('喜歡四處走走');if(m.move<.75)T.push('不太愛走動');
    if(m.w.visit>1.4)T.push('偏愛獨自待在角落');if(m.w.visit<.6)T.push('喜歡待在熱鬧的中央');
    if(m.talk<.75)T.push('話很多');if(m.talk>1.4)T.push('話不多');
    const who=d.species||'夥伴';
    let s=ex.length?`${ex.join('、')}的${who}。`:`個性平衡、容易相處的${who}。`;
    if(tn.length)s+=`帶有「${tn.join('」「')}」的特質。`;
    if(T.length)s+=`平常${T.slice(0,4).join('、')}。`;
    return s},
  refresh(ch){ch.mind=this.mind(ch.data);ch.desc=this.describe(ch);ch.sub=Chars.subOf(ch);ch._pc=null;return ch},
  /* 台詞池：預設／示範台詞 + 個性台詞 + 玩家自訂（自訂句以零寬字元標記，不會被口癖改寫） */
  pool(ch,kind){
    const d=ch.data;if(!d)return LINES[kind]||[];
    const mine=(d.lines[kind]||[]).map(x=>'\u200B'+x);
    if(mine.length&&d.linesMode==='override')return mine;
    let a=[...((ch.lines&&ch.lines[kind])||LINES[kind]||[])];
    const e=ch.mind.e,tb=TONE_LINES[kind];
    if(tb)for(const k in tb){const v=e[k];if(v>=65&&tb[k][0])a.push(...tb[k][0]);else if(v<=35&&tb[k][1])a.push(...tb[k][1])}
    this.active(d).forEach(t=>{if(kind==='idle'||kind==='pet')a.push(...(t[kind]||[]))});
    return[...a,...mine,...mine]},
  custom(ch,kind){const m=ch.data&&ch.data.lines[kind];return m&&m.length?'\u200B'+pick(m):null},
  pick(ch,kind,def){return this.custom(ch,kind)||def},
  greet(ch,def){return this.custom(ch,'greet')||def},
  line(ch,kind){const p=this.pool(ch,kind);return this.style(ch,p.length?pick(p):'……')},
  style(ch,t){
    if(typeof t!=='string')return t;if(t[0]==='\u200B')return t.slice(1);
    const sp=ch&&ch.data&&ch.data.speech;if(!sp)return t;
    if(sp.self)t=t.replace(/我(?!們)/g,sp.self);
    if(sp.call)t=t.replace(/你/g,sp.call);
    if(sp.tone==='soft')t=t.replace(/。$/,'～');
    else if(sp.tone==='cold')t=t.replace(/[！!]/g,'。').replace(/～/g,'');
    else if(sp.tone==='lively')t=t.replace(/。$/,'！');
    else if(sp.tone==='formal')t=t.replace(/～/g,'。').replace(/！/g,'。');
    if(sp.tic&&Math.random()<.65){const core=t.replace(/[。！!～~…]+$/,''),tail=t.slice(core.length);if(core&&!core.endsWith(sp.tic))t=core+sp.tic+tail}
    const cs=sp.catch.split(/[,，、\n]/).map(x=>x.trim()).filter(Boolean);
    if(cs.length&&Math.random()<.3)t=pick(cs)+'，'+t;
    return t}
};
const linesOf=ch=>new Proxy({},{get:(_,k)=>typeof k==='string'?Persona.pool(ch,k):undefined});
/* 個性對行為權重的實際影響 */
BH.addModifier((d,c,s)=>{const w=s&&s.ch&&s.ch.mind&&s.ch.mind.w;return w&&w[d.id]!=null?w[d.id]:1});

/* ==========================================================
   2.3 角色自主生活系統（Life）
   ----------------------------------------------------------
   · 建立在既有 Behaviors 引擎上：新增行為 + 修飾器，不改動引擎本體
   · 情緒（mood）：低頻率、有慣性（hold）、事件與環境共同決定，表情以 emote 小特效呈現
   · 作息（sleepy）：依個體作息偏移（種子 + 特質 + 習慣）決定睡眠／午睡／晚間放鬆
   · 場景定點（Life.reg）：植物、小屋、樹、石頭、灌木、地毯；新增家具／建築只要 reg 一筆
   · 每位角色的生活狀態獨立保存（Cfg.v.life[id]），重開 App／切換角色時以離線時間回補
   ========================================================== */
const MOODS={happy:{em:'♪',n:'開心'},calm:{em:'～',n:'平靜'},excited:{em:'✦',n:'興奮'},tired:{em:'💤',n:'疲倦'},bored:{em:'…',n:'無聊'},shy:{em:'///',n:'害羞'},angry:{em:'💢',n:'生氣'},sad:{em:'💧',n:'難過'}};
const MLINE={happy:['今天心情不錯。','嘿嘿，開心。'],calm:['這樣安安靜靜也很好。','心情很平穩。'],excited:['好想動一動！','感覺會有好事發生！'],tired:['有點睏了…','眼皮好重。'],bored:['好無聊喔…','有沒有什麼好玩的？'],shy:['…！','不要看我啦…'],angry:['哼！','我、我生氣了喔。'],sad:['有點難過…','心裡空空的。']};
const SLINE={sniff:['好香喔。','這盆植物長得真好。'],gaze:['葉子又長高了。'],peek:['有人在家嗎？','屋子裡一定暖暖的。'],porch:['在門口坐一下。'],shade:['樹蔭下好涼快。','葉子沙沙的，好好聽。'],lookup:['樹好高喔。','葉縫的光好漂亮。'],perch:['這顆石頭剛剛好。'],hide:['別、別看我…'],lounge:['地毯軟軟的。']};
const NOMOOD={id:'calm',hold:0,t:0};
const SPA={sniff:{d:[2.4,3.4],pose:'stand',tk(s,b){const k=Math.sin(clamp(b.t/1.2,0,1)*Math.PI/2);s.ov[2]+=k*5;s.ov[3]+=k*.012;if(b.t>1.2&&!b.h){b.h=1;s.hearts(1)}}},
  gaze:{d:[3,5],pose:'stand',tk(s,b){s.ov[2]+=Math.sin(b.t*1.6)*1.2}},
  peek:{d:[2.4,3.6],pose:'stand',tk(s,b){if(b.t<1.4)s.ov[2]+=Math.sin(b.t*5)*1.6}},
  lookup:{d:[3,4.5],pose:'stand',tk(s,b){s.ov[2]-=Math.sin(clamp(b.t/.6,0,1)*Math.PI/2)*4.5}},
  hide:{d:[5,9],pose:'stand',away:1,tk(s,b){if(b.t>.6&&!b.h){b.h=1;Life.emote(s,'shy',1)}}},
  porch:{d:[6,11],pose:'sit',rest:1},shade:{d:[7,13],pose:'sit',rest:1},perch:{d:[6,10],pose:'sit',rest:1},lounge:{d:[8,14],pose:'rest',rest:1}};
const TBOOST={curious:{spot:1.5,skygaze:1.4,leaf:1.5,look:1.3},dreamer:{skygaze:2.2,daze:2,rainwatch:1.6},lazy:{yawn:1.8,daze:1.6,leaf:.5},sleepy:{yawn:2,daze:1.4},clingy:{gaze:2.6},shy:{daze:1.3},hot:{leaf:1.6,joy:1.8},sporty:{leaf:1.6,joy:1.6},prank:{joy:1.5,leaf:1.3},gentle:{rainwatch:1.4,gaze:1.3},quiet:{daze:1.6}};
const MWT={tired:{rest:1.7,sit:1.6,doze:2.2,sleep:1.6,gobed:1.4,yawn:2.5,_move:.6,_play:.35},bored:{_move:1.5,leaf:1.6,spot:1.6,daze:.5,look:1.5,skygaze:1.5},excited:{_play:1.9,dash:1.6,joy:3,bounce:1.5},happy:{wiggle:1.4,bounce:1.3,joy:1.8,spot:1.2},calm:{look:1.3,skygaze:1.3,sit:1.2,daze:1.5,rainwatch:1.4},shy:{spot:1.5,_move:.7,gaze:.3,_play:.5},angry:{_play:.3,_move:.6,gaze:.2},sad:{sit:1.8,_play:.3,_move:.7,gaze:2}};
const MSPD={tired:.8,sad:.85,excited:1.15,angry:1.1,bored:.92};
const Life={spots:{},
  MODES:{lively:{activity:'lively',auto:true},balanced:{activity:'normal',auto:true},quiet:{activity:'quiet',auto:true},manual:{auto:false}},
  mode(){const V=Cfg.v;return V.auto===false?'manual':({quiet:'quiet',lively:'lively'})[V.activity]||'balanced'},
  setMode(m){const o=this.MODES[m];if(!o)return;if(o.activity)Cfg.v.activity=o.activity;Cfg.v.auto=o.auto;Cfg.save()},
  reg(d){this.spots[d.id]=d;return d},
  hash(t){let h=2166136261;for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0)/4294967295},
  has(s,id){return !!(s.ch&&s.ch.data&&s.ch.data.pers.traits.includes(id))},
  eff(s,k){const m=s.ch&&s.ch.mind;return m&&m.e[k]!=null?m.e[k]:50},
  fav(s){const d=s.ch&&s.ch.data;return d?[...d.likes,...d.interests,...d.habits].join(",")+"":""},
  seedK(s,id){const m=s._sk||(s._sk={});return m[id]||(m[id]=.75+.5*this.hash(s.ch.id+"|"+id))},
  /* ---- 作息：回傳 0~1 的睏意（個體就寢時間 = 種子 + 特質 + 習慣） ---- */
  sleepy(s){if(!s.ch)return 0;const T=t=>this.has(s,t),f=this.fav(s),sd=this.hash(s.ch.id),now=new Date(),h=now.getHours()+now.getMinutes()/60;
    const bed=22.2+(sd-.5)*2.4+(T('sleepy')?-.8:0)+(T('lazy')?-.4:0)+(T('dreamer')?.9:0)+(T('sporty')?-.4:0)-(this.eff(s,'lively')-50)/50*.6+(/熬夜|夜貓/.test(f)?1.2:0)-(/早睡|早起/.test(f)?1:0);
    const d=(h-bed+48)%24;let v=d<8.2+(T('lazy')||T('sleepy')?.6:0)?1:d>22?.4+(d-22)*.3:(h>=13&&h<15?.3+(T('lazy')?.2:0):.04);
    return clamp(v+(s.fat||0)*.35,0,1)},
  bedX(s){return this.has(s,'homebody')?clamp(s.W*.108-s.size/2,s.lo(),s.hi()):s.spots.rug},
  /* ---- 情緒 ---- */
  attach(s,ch){const r=Cfg.v.life&&Cfg.v.life[ch.id],home=s===Home.stage;
    s.mood={id:'calm',hold:0,t:0};s.bore=0;s.ann=0;s.pets=[];s.lastP=Date.now();s.lastPx=null;s.lifeAcc=4;s._sk=null;s._back=0;s._wantSleep=0;
    if(r&&home){const away=Math.max(0,(Date.now()-r.ts)/60000);s.fat=clamp((r.fat||0)-away*.012,0,1);s.bore=away>5?0:r.bore||0;
      if(away<8&&MOODS[r.m])s.mood.id=r.m;if(away>15)s._back=away}
    else if(!home)s.fat=rnd(.05,.25);
    s.sl=this.sleepy({ch,fat:s.fat,W:s.W,size:s.size,lo:()=>0,hi:()=>0});
    if(home&&s._back&&s.sl>.8)s._wantSleep=1;
    s.actor.dataset.mood=s.mood.id;
    if(!s._lb){s._lb=1;s.root.addEventListener('pointerdown',e=>{const r=s.root.getBoundingClientRect();s.lastPx=e.clientX-r.left;s.lastP=Date.now();s.bore=0},true)}},
  save(s){if(!s||s!==Home.stage||!s.ch||!s.mood)return;const V=Cfg.v;(V.life=V.life||{})[s.ch.id]={fat:+s.fat.toFixed(3),m:s.mood.id,ts:Date.now(),bore:+s.bore.toFixed(2)};Cfg.save()},
  setMood(s,id,hold=60,quiet){const m=s.mood;if(!m||!MOODS[id])return;
    if(m.id===id){m.hold=Math.max(m.hold,hold);return}
    m.id=id;m.t=0;m.hold=hold*rnd(.85,1.2);s.actor.dataset.mood=id;
    if(s.ch&&s.ch.uid&&window.Anim)Anim.sync(s);
    if(!quiet&&!s.sleeping()){this.emote(s,id);const ex=this.eff(s,'expr')/100;
      if(s.autoOn()&&Math.random()<.2+.5*ex)s.say(pick(MLINE[id]),2400)}},
  emote(s,k,force){if(!s.fx||document.documentElement.dataset.motion==='reduce')return;const n=Date.now();
    if(!force&&n-(s._emT||0)<5000)return;if(s.fx.querySelector('.emote'))return;s._emT=n;
    const e=document.createElement('span');e.className='emote';e.dataset.k=k;e.textContent=(MOODS[k]||{em:k}).em;
    e.style.left=(s.x+s.size*.6)+'px';e.style.top=(s.feetY-s.h-s.hitTop-6)+'px';s.fx.appendChild(e);e.addEventListener('animationend',()=>e.remove(),{once:true})},
  tick(s,dt){const m=s.mood;m.t+=dt;if(m.hold>0)m.hold-=dt;s.ann=Math.max(0,s.ann-dt/25);
    const idle=s.B&&['stand','look','daze'].includes(s.B.id);
    if(s.autoOn())s.bore=clamp(s.bore+(idle?dt/300*(.6+this.eff(s,'lively')/100):-dt/150),0,1);
    s.lifeAcc+=dt;if(s.lifeAcc<5)return;s.lifeAcc=0;s.sl=this.sleepy(s);
    if(!s.autoOn()||m.hold>0||s.state==='held')return;
    const c=s.ctx(),e=k=>this.eff(s,k)/100,away=(Date.now()-s.lastP)/60000,wx=c.wx,ph=c.phase;
    const S={calm:.35+(c.rain?.25:0)+(ph==='dusk'?.2:0)+(1-e('lively'))*.15,happy:.3+(wx==='sunny'&&ph==='day'?.25:0)+(away<2?.25:0)+e('friendly')*.12,
      tired:Math.max(s.sl*.8,s.fat)*1.05,bored:s.bore*.9,sad:(away>8+e('indep')*10&&e('indep')<.5?.55:0)+(wx==='storm'?.3*(1-e('lively')):0)};
    let best=m.id,bs=S[m.id]||0;for(const k in S)if(S[k]>bs+.12){best=k;bs=S[k]}
    if(best!==m.id)this.setMood(s,best,rnd(50,110))},
  /* ---- 玩家互動反應：依個性、情緒與當下活動而不同 ---- */
  onPet(s,asleep){const n=Date.now();s.lastP=n;s.bore=0;s.pets=(s.pets||[]).filter(t=>n-t<30000);s.pets.push(n);
    const T=t=>this.has(s,t),e=k=>this.eff(s,k)/100;
    if(asleep){if(T('tsun')||e('friendly')<.35)this.setMood(s,'angry',30);else this.setMood(s,'tired',40);return}
    if(s.pets.length>=5&&(e('indep')>.55||e('friendly')<.45)){this.setMood(s,'angry',30);s.say(pick(['夠、夠了啦！','別一直戳啦…']));return}
    if(T('shy')||(e('social')<.3&&Math.random()<.6))this.setMood(s,'shy',25);
    else if(T('clingy')||e('friendly')>.7)this.setMood(s,'happy',90);
    else if(e('lively')>.65)this.setMood(s,'excited',30);else this.setMood(s,'happy',50)},
  onCall(s){s.lastP=Date.now();s.bore=0;if(this.eff(s,'friendly')>55)this.setMood(s,'excited',20)},
  onDrop(s){const T=t=>this.has(s,t),e=k=>this.eff(s,k)/100;
    if(T('hot')||T('sporty')||T('prank')||e('lively')>.7)this.setMood(s,'excited',25);
    else if(T('tsun')||T('sharp')||e('friendly')<.4)this.setMood(s,'angry',25);
    else if(T('shy')||T('clingy')||e('expr')>.6)this.setMood(s,'sad',30);else this.setMood(s,'calm',30)},
  /* ---- 場景定點選擇：個性、情緒、天氣、時段、喜好共同決定 ---- */
  like(s,sp,a,c){const T=t=>this.has(s,t),mo=s.mood.id,f=this.fav(s);let w=1;
    if(T('curious'))w*=1.4;if(T('homebody')&&sp==='house')w*=2.2;if(T('dreamer')&&(sp==='tree'||sp==='tree2'))w*=1.5;
    if(mo==='shy')w*=(sp==='bush'||sp==='house')?2.5:.6;
    if(c.rain)w*=(sp==='tree'||sp==='tree2')?.3:sp==='house'?2.2:1;
    else if(c.wx==='sunny'&&c.phase==='day'&&(sp==='tree'||sp==='tree2'))w*=1.6;
    if(c.phase==='night')w*=(sp==='tree'||sp==='tree2')?.5:sp==='house'?1.6:1;
    const kw={plant:/植物|花|草|園/,tree:/樹|森|葉|風|曬太陽|陽光/,tree2:/樹|森|葉|風|曬太陽|陽光/,rock:/石|山/,house:/家|宅/}[sp];if(kw&&kw.test(f))w*=1.8;
    return w},
  pickSpot(s){const c=s.ctx(),lo=s.lo(),hi=s.hi(),L=[];let tot=0;
    for(const id in this.spots){const sp=this.spots[id];for(const a of sp.acts){if(a.can&&!a.can(s,c))continue;
      const x=clamp(sp.x(s),lo,hi);let w=(a.w||1)*this.like(s,id,a.id,c);if(s.lastSpot===id)w*=.3;if(Math.abs(x-s.x)<s.size*.25)w*=.5;
      if(w>0){L.push({id,act:a.id,x,face:a.face!=null?a.face:sp.face,w});tot+=w}}}
    if(!L.length)return null;let r=Math.random()*tot;for(const o of L)if((r-=o.w)<=0)return o;return L[L.length-1]},
  /* ---- 離線／回前景補算 ---- */
  resume(s,away){if(!s.ch||!s.mood||away<1)return;s.fat=clamp(s.fat-away*.012,0,1);s.bore=0;
    if(away>5){s.mood.hold=0;s.lifeAcc=5;s.sl=this.sleepy(s);if(s.autoOn()&&s.sl>.85&&!s.sleeping()&&s.state==='idle')s.go('sleep',{soft:1})}},
  init(){
    Object.assign(BEH2T,{gobed:'walk',spot:'walk',spotdo:'idle',spotrest:'sit',yawn:'stretch',skygaze:'idle',daze:'idle',gaze:'idle',joy:'jump',leaf:'walk',leafhop:'jump',rainwatch:'sit',brood:'sit'});
    const r0=Anim.resolve;Anim.resolve=function(s,L){const mp={happy:'happy',excited:'happy',sad:'sad',angry:'angry',shy:'shy'}[(s.mood||NOMOOD).id],id=s.B&&s.B.id;
      if(mp&&s.state==='idle'&&['stand','daze','gaze','skygaze','look','brood'].includes(id)){const c=L.anims.filter(a=>a.trig===mp&&a.frames.length);if(c.length)return{a:pick(c),k:mp}}
      return r0.call(this,s,L)};
    const cf=Chars.flush;Chars.flush=function(){Life.save(Home.stage);return cf.apply(this,arguments)};
    setInterval(()=>{if(!document.hidden)Life.save(Home.stage)},20000);
    let hid=0;document.addEventListener('visibilitychange',()=>{if(document.hidden){hid=Date.now();Life.save(Home.stage)}else if(hid){const a=(Date.now()-hid)/60000;hid=0;Life.resume(Home.stage,a)}});
    const sm=Settings.make;Settings.make=function(){sm.call(this);
      $$('.row',this.body).forEach(r=>{const t=$('b',r);if(t&&(t.textContent==='活躍程度'||t.textContent==='自動行為'))r.remove()});
      const anchor=$$('.row',this.body).find(r=>{const t=$('b',r);return t&&t.textContent==='角色大小'});if(!anchor)return;
      const row=el('<div class="row col"><div class="rh"><span class="r-ic">'+ic('route')+'</span><div class="r-t"><b>陪伴模式</b><small>角色自己生活的頻率；手動模式只會待機，等你互動</small></div></div></div>');
      row.append(mkSeg([{v:'lively',t:'活潑'},{v:'balanced',t:'平衡'},{v:'quiet',t:'安靜'},{v:'manual',t:'手動'}],Life.mode(),v=>{Life.setMode(v);const st=Home.stage;if(st&&st.ch){st.interrupt();st.go('stand')}}));
      anchor.after(row)}}};
/* ---- Stage 掛接（不改動原引擎） ---- */
{const sC=Stage.prototype.setChar;Stage.prototype.setChar=function(ch,i){if(this.ch&&this===Home.stage)Life.save(this);Life.attach(this,ch);sC.call(this,ch,i)};
 const up=Stage.prototype.update;Stage.prototype.update=function(dt){up.call(this,dt);if(this.mood&&this.o.auto&&this.W&&this.ch)Life.tick(this,dt)};
 const cx=Stage.prototype.ctx;Stage.prototype.ctx=function(){const c=cx.call(this);c.mood=(this.mood||NOMOOD).id;return c};
 const pf=Stage.prototype.prof;Stage.prototype.prof=function(){const b=pf.call(this),k=MSPD[(this.mood||NOMOOD).id];if(!k)return b;
   if(this._pb!==b||this._pk2!==this.mood.id){this._pb=b;this._pk2=this.mood.id;this._pm=Object.assign({},b,{spd:b.spd*k,idle:b.idle/k})}return this._pm};
 const pe=Stage.prototype.pet;Stage.prototype.pet=function(){if(this.state==='held')return;const b=this.B,sl=this.sleeping()||!!(b&&b.def.sleepy);pe.call(this);if(this.mood)Life.onPet(this,sl)};
 const cl=Stage.prototype.callTo;Stage.prototype.callTo=function(){cl.call(this);if(this.mood)Life.onCall(this)};
 const ld=Stage.prototype.landed;Stage.prototype.landed=function(){const d=this.droppedMsg&&this.state!=='held',g=this.greet;ld.call(this);
   if(d&&this.mood)Life.onDrop(this);
   if(g){const s=this;if(s._back){const a=s._back;s._back=0;setTimeout(()=>{if(s.ch&&!s.sleeping())s.say(Life.has(s,'tsun')?'哼，才沒有在等你。':Life.has(s,'clingy')?'你終於回來了…我等好久。':a>720?'好久不見，我好想你。':'歡迎回來～',3000)},3400)}
     if(s._wantSleep){s._wantSleep=0;setTimeout(()=>{if(s.autoOn()&&!s.sleeping()&&s.state==='idle')s.go('sleep',{soft:1})},2600)}}}}
/* ---- 場景定點（座標以 400 寬場景比例換算；新增家具／建築請在此註冊） ---- */
Life.reg({id:'plant',x:s=>s.spots.plant,face:-1,acts:[{id:'sniff',w:1.2},{id:'gaze',w:.8}]});
Life.reg({id:'house',x:s=>s.W*.108-s.size/2,face:-1,acts:[{id:'peek',w:1},{id:'porch',w:.9}]});
Life.reg({id:'tree',x:s=>s.W*.825-s.size/2,face:1,acts:[{id:'shade',w:1.2},{id:'lookup',w:1}]});
Life.reg({id:'tree2',x:s=>s.W*.63-s.size/2,face:-1,acts:[{id:'shade',w:1},{id:'lookup',w:.8}]});
Life.reg({id:'rock',x:s=>s.W*.33-s.size/2,face:1,acts:[{id:'perch',w:1}]});
Life.reg({id:'bush',x:s=>s.W*.75-s.size/2,face:1,acts:[{id:'hide',w:.6,can:s=>s.mood.id==='shy'},{id:'peek',w:.5}]});
Life.reg({id:'rug',x:s=>s.spots.rug,face:1,acts:[{id:'lounge',w:.8}]});
/* ---- 新行為 ---- */
const spotDo=low=>({cat:low?'rest':'misc',state:'idle',up:!low,low:!!low,fat:low?-.012:.004,max:40,
  pose:(s,b)=>b.t<.18?'turn':((b.A&&b.A.pose)||'stand'),
  enter(s,b){const a=SPA[b.o.act]||SPA.gaze;b.A=a;b.dur=rnd(a.d[0],a.d[1])*(a.rest?s.prof().rest:1);
    if(b.o.f!=null)s.dir=a.away?-b.o.f:b.o.f;s.lastSpot=b.o.sp;
    const L=SLINE[b.o.act];if(L&&Math.random()<.35/(s.ch.mind.talk||1))s.say(pick(L),2600)},
  tick(s,b){if(b.A.tk)b.A.tk(s,b);if(b.t<b.dur)return;
    if(low){const c=s.ctx(),p=clamp(.1+s.sl*.5,0,.8);s.finish(Math.random()<p?'doze':null)}else s.finish(null)}});
BH.register(Object.assign({id:'spotdo'},spotDo(false)));BH.register(Object.assign({id:'spotrest'},spotDo(true)));
BH.register({id:'spot',cat:'move',state:'idle',up:true,w:()=>14,cd:20,fat:.008,max:50,pose:WALK.pose,
  enter(s,b){const sp=Life.pickSpot(s);if(!sp){s.finish(null);return}const a=SPA[sp.act];
    b.o=Object.assign({goal:sp.x,after:a&&a.rest?'spotrest':'spotdo',afterOpts:{sp:sp.id,act:sp.act,f:sp.face}},b.o);WALK.enter(s,b)},tick:WALK.tick});
BH.register({id:'gobed',cat:'move',state:'idle',up:true,w:()=>8,cd:60,fat:.004,max:45,pose:WALK.pose,
  can:s=>s.sl>.7&&Math.abs(s.x-Life.bedX(s))>s.size*.4,
  enter(s,b){b.o=Object.assign({goal:Life.bedX(s),after:'sleep'},b.o);WALK.enter(s,b)},tick:WALK.tick});
BH.register({id:'yawn',cat:'misc',state:'idle',up:true,w:(c,s)=>2+(s.sl||0)*10+s.fat*6,cd:50,pose:(s,b)=>b.t<.5?'stretchUp':'stand',
  can:s=>s.fat>.25||s.sl>.35,
  enter(s,b){b.dur=2.2},exit(s){s.eyes(false)},
  tick(s,b){if(b.t>.3&&!b.a){b.a=1;s.eyes(true)}if(b.t>1.5&&!b.b){b.b=1;s.eyes(false)}if(b.t>=b.dur)s.finish(Math.random()<.2?'stretch':null)}});
BH.register({id:'skygaze',cat:'misc',state:'idle',up:true,w:c=>c.rain?0:c.phase==='night'?5:c.wx==='sunny'?4:2.5,cd:35,pose:'stand',
  enter(s,b){b.dur=rnd(3.2,5);if(Math.random()<.3/(s.ch.mind.talk||1))s.say(s.phase==='night'?'星星好亮。':s.phase==='dusk'?'天空變成粉紅色了。':'今天的天空真好看。',2600)},
  tick(s,b){s.ov[2]-=Math.sin(clamp(b.t/.7,0,1)*Math.PI/2)*4.2*(b.t>b.dur-.5?clamp((b.dur-b.t)/.5,0,1):1);if(b.t>=b.dur)s.finish(null)}});
BH.register({id:'daze',cat:'misc',state:'idle',up:true,w:()=>6,cd:25,quiet:true,pose:'stand',fat:-.004,
  enter(s,b){b.dur=rnd(4,8)},
  tick(s,b){s.ov[2]+=Math.sin(b.t*.9)*1.4;if(b.t>b.dur/2&&!b.e&&Math.random()<.01){b.e=1;Life.emote(s,'bored')}if(b.t>=b.dur)s.finish(null)}});
BH.register({id:'gaze',cat:'misc',state:'idle',up:true,cd:60,pose:'stand',
  w:(c,s)=>{const away=(Date.now()-s.lastP)/60000;return(away>1.5?3:.4)*(Life.has(s,'clingy')?2:1)},
  can:s=>s.lastPx!=null,
  enter(s,b){b.dur=rnd(3,4.5);b.f=s.lastPx>s.x+s.size/2?1:-1;b.t1=rnd(.2,.4)},
  tick(s,b){if(!b.a&&b.t>=b.t1){s.dir=b.f;b.a=1}s.ov[2]+=Math.sin(b.t*2)*1.1;
    if(b.t>1.2&&!b.h){b.h=1;if(Life.eff(s,'friendly')>55){s.hearts(1);Life.emote(s,'happy')}else if(Life.has(s,'tsun'))s.say('看、看什麼啦。',2200)}if(b.t>=b.dur)s.finish(null)}});
BH.register({id:'joy',cat:'play',cdg:'play',state:'crouch',up:true,w:(c,s)=>s.mood.id==='excited'?10:s.mood.id==='happy'?3:.6,cd:30,fat:.02,max:8,pose:'stand',
  enter(s,b){s.pend=520;s.setState('crouch',.13);Life.emote(s,'excited',1)},
  land(s){s.squash(.12);s.hearts(1);s.finish(null)}});
BH.register({id:'leaf',cat:'play',cdg:'play',state:'idle',up:true,w:c=>c.rain||c.phase==='night'?0:c.wx==='sunny'||c.wx==='cloudy'?3:2,cd:70,fat:.01,max:25,pose:WALK.pose,
  can:s=>!!s.fx&&!s.fx.querySelector('.leaf'),
  enter(s,b){const lo=s.lo()+s.size/2,hi=s.hi()+s.size/2,x=clamp(s.x+s.size/2+(Math.random()<.5?-1:1)*s.size*rnd(.9,2),lo,hi),fx=rnd(-30,30),T=rnd(3.2,4.4);
    const L=document.createElement('i');L.className='leaf';L.style.cssText='left:'+x+'px;top:'+(s.feetY-s.size*1.9)+'px;--fx:'+fx+'px;--fy:'+(s.size*1.85)+'px;animation-duration:'+T+'s';
    s.fx.appendChild(L);L.addEventListener('animationend',()=>L.remove(),{once:true});
    b.o=Object.assign({goal:clamp(x+fx-s.size/2,s.lo(),s.hi()),after:'leafhop'},b.o);WALK.enter(s,b)},tick:WALK.tick});
BH.register({id:'leafhop',cat:'play',state:'idle',up:true,pose:'stand',fat:.01,max:8,
  tick(s,b){if(b.j)return;if(!s.fx.querySelector('.leaf')||b.t>3.5){b.j=1;s.pend=400;s.setState('crouch',.12);b.st='crouch'}else s.ov[2]-=Math.sin(clamp(b.t/.4,0,1)*Math.PI/2)*3.5},
  land(s){s.squash(.1);s.hearts(1);s.finish(null)}});
BH.register({id:'rainwatch',cat:'rest',low:true,state:'idle',pose:'sit',w:c=>c.rain?14:0,cd:50,fat:-.012,max:30,
  enter(s,b){b.dur=rnd(8,14)*s.prof().rest;if(!['sad','angry'].includes(s.mood.id))Life.setMood(s,'calm',70,1)},
  tick(s,b){s.ov[2]+=Math.sin(b.t*.7)*1.2;if(b.t>1.5&&!b.h){b.h=1;Life.emote(s,'calm');if(Math.random()<.4/(s.ch.mind.talk||1))s.say('雨聲真好聽。',2600)}if(b.t>=b.dur)s.finish(null)}});
BH.register({id:'brood',cat:'rest',low:true,state:'idle',pose:'sit',quiet:true,w:(c,s)=>s.mood.id==='angry'?24:s.mood.id==='sad'?8:0,cd:25,fat:-.01,max:30,
  enter(s,b){b.dur=rnd(7,12);b.ang=s.mood.id==='angry';if(b.ang)s.dir=-s.dir},
  tick(s,b){if(b.t>.6&&!b.h){b.h=1;Life.emote(s,s.mood.id,1);if(b.ang)s.say(Life.has(s,'tsun')?'哼。':'……',2000)}
    if(b.t>=b.dur){if(b.ang){Life.setMood(s,'calm',40,1);if(Math.random()<.5)s.say('…算了。',2000)}s.finish(null)}}});
/* ---- 修飾器：作息、情緒、個性（含個體差異與喜好） ---- */
BH.addModifier((d,c,s)=>{const v=s.sl||0,id=d.id;
  if(id==='sleep'||id==='gobed')return v>.85?4.5:v>.5?1.3:v>.3?.7:.12;
  if(id==='doze')return v>.6?2.6:v>.3?1.5:.8;
  if(d.cat==='play'||id==='stroll'||id==='dash')return v>.85?.15:v>.6?.5:1;
  if(id==='sit'||id==='rest')return 1+v*1.2;return 1});
BH.addModifier((d,c,s)=>{const t=MWT[(s.mood||NOMOOD).id];if(!t)return 1;let k=t[d.id]||1;if(d.cat==='move'&&t._move)k*=t._move;if(d.cat==='play'&&t._play)k*=t._play;return k});
BH.addModifier((d,c,s)=>{if(!s.ch||!s.ch.data)return 1;let k=1;for(const t of s.ch.data.pers.traits){const b=TBOOST[t];if(b&&b[d.id])k*=b[d.id]}
  const e=n=>Life.eff(s,n)/100,f=Life.fav(s);
  if(d.id==='gaze')k*=.6+(1-e('indep'))*1.2+e('friendly')*.5;
  if(d.id==='skygaze'&&/天空|雲|星|月/.test(f))k*=1.6;if(d.id==='leaf'&&/葉|風|秋|森/.test(f))k*=1.5;if(d.id==='rainwatch'&&/雨/.test(f))k*=1.8;
  return k*Life.seedK(s,d.id)});

/* ---------- 檔案儲存／分享 ---------- */
async function saveText(name,text){
  try{if(Native.has()&&Native.call('saveFile',name,text)!==undefined)return true}catch(e){}
  const blob=new Blob([text],{type:'application/json'});
  try{const f=new File([blob],name,{type:'application/json'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:name});return true}}catch(e){if(e&&e.name==='AbortError')return true}
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},4000);return true}
const b2d=b=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(r.error);r.readAsDataURL(b)});
const d2b=u=>{const m=/^data:([^;,]+)?(;base64)?,(.*)$/.exec(u||'');if(!m)throw new Error('bad');const bin=atob(m[3]),n=bin.length,a=new Uint8Array(n);for(let i=0;i<n;i++)a[i]=bin.charCodeAt(i);return new Blob([a],{type:m[1]||'image/webp'})};

/* ==========================================================
   統一資料封存 v3：角色、主圖、插槽素材、動畫、影格、偏好與進度
   · v2 角色包向下相容；v3 角色包亦包含所屬動畫
   · 匯入先完整驗證，再批次寫入兩套 IndexedDB
   · 所有自創角色與動畫建立新 ID，不覆蓋現有資料
   ========================================================== */
const Backup={
  working:false,
  async image(blob,label){
    if(!(blob instanceof Blob)||!blob.size||blob.size>30*1024*1024||!/^image\/(png|jpeg|webp|gif|bmp)$/i.test(blob.type))throw new Error(label+'：圖片格式或容量不符');
    const im=await Chars.probe(blob);
    if(!im.w||!im.h||im.w*im.h>120000000)throw new Error(label+'：圖片尺寸不正確');
    return im;
  },
  async pack(ch){
    const o={id:ch.id,kind:ch.kind,name:ch.name,data:ch.data,scale:ch.scale,ox:ch.ox,oy:ch.oy,facing:ch.facing,body:ch.body,created:ch.created||0};
    if(ch.kind==='custom'){
      o.look=ch.look;o.w=ch.w;o.h=ch.h;
      if(ch.rec.blob)o.image=await b2d(ch.rec.blob);
      o.assets=[];
      for(const slot in ch.assets){const a=ch.assets[slot];o.assets.push({slot,w:a.w,h:a.h,image:await b2d(a.blob)})}
    }
    return o;
  },
  async animPack(ch){
    // 從運行中的函式庫取得尚未完全落盤的變更；未載入則由 IndexedDB 讀取。
    const L=await Anim.load(ch.uid);
    const frames=[];
    for(const r of L.frames.values()){
      if(!r.blob)throw new Error('「'+ch.name+'」有缺少圖片的影格 '+r.id);
      frames.push({id:r.id,name:r.name||'',folder:r.folder||'',tags:r.tags||[],data:await b2d(r.blob),w:r.w,h:r.h});
    }
    const ids=new Set(frames.map(f=>f.id));
    for(const a of L.anims)for(const f of a.frames)if(!ids.has(f.f))throw new Error('「'+ch.name+'」的動畫「'+a.name+'」缺少圖片');
    return {charId:ch.id,frames,anims:L.anims.map(a=>{const o=JSON.parse(JSON.stringify(a));delete o.cid;return o})};
  },
  async exportChars(list,name,full){
    if(this.working){toast('正在處理備份，請勿重複操作','info');return false}
    this.working=true;
    try{
      // 編輯器的防抖儲存與記憶體內容也必須納入快照。
      await Chars.flush();
      if(AnimUI.api)await AnimUI.flush();
      const chars=[],animations=[];
      for(const c of list){chars.push(await this.pack(c));animations.push(await this.animPack(c))}
      const doc={format:'oc-shimeji-pack',ver:3,exported:Date.now(),type:full?'backup':'characters',chars,animations};
      if(full){
        if(window.OCSCommunity?.ready)OCSCommunity.persist();
        doc.cfg=JSON.parse(JSON.stringify(Cfg.v));
        doc.eco=JSON.parse(JSON.stringify(Eco.v));
        doc.ui={animAdvanced:localStorage.getItem('ocs.anim.adv')==='1'};
        doc.items=Items.exportData();doc.workspace=await OCSFullState.snapshot();if(window.OCSEvents)doc.eventSystem=OCSEvents.exportData();
      }
      const content=JSON.stringify(doc);
      const na=animations.reduce((s,x)=>s+x.anims.length,0),nf=animations.reduce((s,x)=>s+x.frames.length,0);
      this.exportSheet(name,content,{chars:chars.length,anims:na,frames:nf,full});
      return true;
    }catch(e){console.error('backup export',e);toast('備份失敗：'+String(e.message||e).slice(0,82),'info');return false}
    finally{this.working=false}
  },
  exportOne(ch){
    const n=String(ch.name||'character').replace(/[^\w\u4e00-\u9fff-]+/g,'_').slice(0,55)||'character';
    return this.exportChars([ch],`oc-${n}.ocpack.json`,false);
  },
  exportAll(){return this.exportChars(Chars.list,`oc-shimeji-full-${new Date().toISOString().slice(0,10)}.ocbackup.json`,true)},
  exportSheet(name,content,counts){
    const blob=new Blob([content],{type:'application/json;charset=utf-8'}),mb=(blob.size/1048576).toFixed(2);
    const desc=`${counts.chars} 位角色・${counts.anims} 個動畫・${counts.frames} 張影格素材・${mb} MB`;
    const s=openSheet(`<div class="sh-body"><h3>${counts.full?'完整備份':'角色內容包'}已準備完成</h3>
      <p style="font-size:13px;color:var(--ink-2);margin:8px 0 14px;overflow-wrap:anywhere">${esc(name)}<br>${esc(desc)}（角色主圖／配件圖片也包含在內）</p>
      <div class="an-chips"><button class="btn primary grow" id="bkSave">${ic('download',18)}下載 JSON</button><button class="btn grow" id="bkShare">分享／另存</button></div>
      <p style="font-size:12px;color:var(--ink-2);margin-top:12px">這是一個包含所有圖片資料的離線備份，無需另外附圖片資料夾。請在「下載」或檔案管理員確認儲存成功；若 APK 不支援下載，請改用分享／另存。</p></div>`);
    $('#bkSave',s.el).onclick=()=>{try{
      let handled=false;
      if(Native.has())try{handled=Native.call('saveFile',name,content)===true}catch(e){}
      if(!handled){const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000)}
      toast('已送出下載，請確認檔案是否儲存','download');
    }catch(e){toast('下載未成功，請改用分享／另存','info')}};
    $('#bkShare',s.el).onclick=async()=>{
      if(!navigator.share){toast('此環境不支援分享，請改用下載','info');return}
      try{const f=new File([blob],name,{type:'application/json'});
        if(navigator.canShare&&!navigator.canShare({files:[f]})){toast('此裝置不支援分享 JSON 檔案','info');return}
        await navigator.share({files:[f],title:name});toast('已完成分享','check');
      }catch(e){toast(e&&e.name==='AbortError'?'已取消分享':'分享失敗，請改用下載','info')}
    };
  },
  chooseRestore(){
    return new Promise(resolve=>{
      let choice=null;
      const s=openSheet(`<div class="sh-body info"><h3>如何還原完整備份？</h3>
        <p>所有圖片、角色和動畫都會一起匯入，現有自創角色不會被刪除；示範角色設定可能依備份更新。可以選擇是否還原主題、出場角色與養成進度。</p>
        <div style="display:flex;flex-direction:column;gap:10px;margin:12px 0">
          <button class="btn wide primary" id="bkRestoreAll">全部還原（含設定、星幣與親密度）</button>
          <button class="btn wide" id="bkRestoreContent">僅匯入角色、圖片與動畫</button>
          <button class="btn wide" data-close>取消匯入</button>
        </div></div>`,{onClose:()=>resolve(choice)});
      $('#bkRestoreAll',s.el).onclick=()=>{choice='full';s.close()};
      $('#bkRestoreContent',s.el).onclick=()=>{choice='content';s.close()};
    });
  },
  // 兩個物件儲存區使用同一個 IDB transaction，任一步失敗就回滾該資料庫。
  async writeChars(chars,assets,remove=false){
    if(!chars.length&&!assets.length)return;
    const db=await DB.open();await new Promise((res,rej)=>{
      const t=db.transaction(['chars','assets'],'readwrite'),cs=t.objectStore('chars'),as=t.objectStore('assets');
      for(const c of chars)remove?cs.delete(c.id):cs.put(c);
      for(const a of assets)remove?as.delete(a.id):as.put(a);
      t.oncomplete=()=>res();t.onerror=t.onabort=()=>rej(t.error||new Error('角色資料庫寫入失敗'));
    });
  },
  async writeAnims(anims,frames){
    if(!anims.length&&!frames.length)return;
    const db=await AnimDB.open();await new Promise((res,rej)=>{
      const t=db.transaction(['anims','frames'],'readwrite'),as=t.objectStore('anims'),fs=t.objectStore('frames');
      for(const a of anims)as.put(a);
      for(const f of frames)fs.put(f);
      t.oncomplete=()=>res();t.onerror=t.onabort=()=>rej(t.error||new Error('動畫資料庫寫入失敗'));
    });
  },
  async importFile(file){
    if(this.working){toast('正在處理備份，請勿重複操作','info');return false}
    if(file.size>250*1024*1024){toast('備份超過 250 MB，無法安全匯入','info');return false}
    this.working=true;let wroteData=false;
    try{
      const doc=JSON.parse(await file.text());
      if(!doc||doc.format!=='oc-shimeji-pack'||!Array.isArray(doc.chars)||!Number.isInteger(doc.ver)||doc.ver<2||doc.ver>3)
        throw new Error('不是支援的 OC Shimeji 角色包或備份');
      if(doc.chars.length>500)throw new Error('角色數量超過安全限制');
      if(doc.ver>=3&&!Array.isArray(doc.animations))throw new Error('完整備份缺少動畫資料區');
      if(doc.ver>=3&&doc.type!=='backup'&&doc.type!=='characters')throw new Error('不認得的備份類型');
      if(doc.type==='backup'&&doc.ver>=3&&(!doc.cfg||typeof doc.cfg!=='object'||Array.isArray(doc.cfg)||!doc.eco||typeof doc.eco!=='object'||Array.isArray(doc.eco)))throw new Error('完整備份缺少設定或養成進度');
      if(DB.bad||AnimDB.bad)throw new Error('本機永久儲存空間不可用，請勿匯入');
      await Promise.all([DB.open(),AnimDB.open()]);
      const isFull=doc.type==='backup'&&!!doc.cfg;
      let restore=false;
      const idMap=new Map(),demoEdits=[],recs=[],assets=[],frames=[],anims=[],stagedChars=[],stagedAnim=new Map(),seenChars=new Set();
      // 先逐筆驗證角色資料（包含全部圖片），未完成前不修改原有存檔。
      for(const o of doc.chars){
        if(!o||typeof o!=='object'||typeof o.id!=='string'||!o.id||seenChars.has(o.id))throw new Error('角色識別碼錯誤或重複');
        seenChars.add(o.id);
        const data=Persona.norm(o.data),name=String(o.name||'新角色').slice(0,16);
        if(o.kind==='demo'){
          const dm=DEMOS.find(x=>x.id===o.id);if(!dm)throw new Error('不認得的示範角色：'+o.id);
          idMap.set(o.id,dm.id);demoEdits.push({o,dm,data,name});continue;
        }
        if(o.kind!=='custom')throw new Error('角色類型無效：'+o.id);
        const id=uid('c');idMap.set(o.id,id);
        const rec={id,uid:id,schema:2,name,data,look:Chars.normLook(o.look),scale:clamp(+o.scale||1,.3,2.5),
          ox:clamp(+o.ox||0,-60,60),oy:clamp(+o.oy||0,-60,60),facing:o.facing==='left'?'left':'right',created:Date.now()+recs.length};
        if(o.image){rec.blob=d2b(o.image);const im=await this.image(rec.blob,'角色主圖');rec.w=im.w;rec.h=im.h}
        if(o.assets!=null&&!Array.isArray(o.assets))throw new Error('角色配件資料格式錯誤');
        const slotIds=new Set();
        for(const a of o.assets||[]){
          if(!a||typeof a.slot!=='string'||!/^[a-z]+\.[a-z0-9]+$/i.test(a.slot)||slotIds.has(a.slot))throw new Error('配件欄位錯誤或重複');
          slotIds.add(a.slot);const blob=d2b(a.image),im=await this.image(blob,'角色配件');
          assets.push({id:id+':'+a.slot,charId:id,slot:a.slot,blob,w:im.w,h:im.h});
        }
        recs.push(rec);stagedChars.push({rec,id});
      }
      // v2 備份沒有動畫區；v3 即使沒有動畫也要保留空集合。
      const entries=doc.ver>=3?doc.animations:[];
      if(entries.length>doc.chars.length)throw new Error('動畫角色資料數量異常');
      const seenAniChars=new Set();let animCount=0,frameCount=0;
      for(const entry of entries){
        if(!entry||typeof entry.charId!=='string'||!idMap.has(entry.charId)||seenAniChars.has(entry.charId)||!Array.isArray(entry.anims)||!Array.isArray(entry.frames))
          throw new Error('動畫與角色的對應資料錯誤');
        seenAniChars.add(entry.charId);const cid=idMap.get(entry.charId);
        animCount+=entry.anims.length;frameCount+=entry.frames.length;
        if(animCount>2000||frameCount>8000)throw new Error('動畫或影格數量超過安全限制');
        const frameIds=new Map(),newFrames=[],newAnims=[];
        for(const f of entry.frames){
          if(!f||typeof f.id!=='string'||!f.id||frameIds.has(f.id)||typeof f.data!=='string')throw new Error('動畫影格識別碼錯誤或重複');
          const blob=d2b(f.data),im=await this.image(blob,'動畫影格');
          const id=nid('fr_');frameIds.set(f.id,id);
          newFrames.push({id,cid,name:String(f.name||'影格').slice(0,60),folder:String(f.folder||'').slice(0,30),
            tags:(Array.isArray(f.tags)?f.tags:[]).slice(0,12).map(x=>String(x).slice(0,30)),blob,w:im.w,h:im.h,created:Date.now(),auto:0});
        }
        const used=new Set((await Anim.load(cid)).anims.map(a=>a.name));
        for(const o of entry.anims){
          if(!o||typeof o!=='object'||!Array.isArray(o.frames)||o.frames.length>5000||!Array.isArray(o.ev||[]))throw new Error('動畫格式錯誤');
          const af=o.frames.map(f=>{
            if(!f||typeof f.f!=='string'||!frameIds.has(f.f))throw new Error('動畫「'+String(o.name||'未命名')+'」缺少影格');
            return {...f,f:frameIds.get(f.f)};
          });
          const a=normAnim({...o,id:null,cid,frames:af});
          const stem=a.name.slice(0,32)||'未命名動畫';let i=2;
          while(used.has(a.name))a.name=`${stem} (${i++})`.slice(0,40);
          used.add(a.name);newAnims.push(a);
        }
        stagedAnim.set(cid,{frames:newFrames,anims:newAnims});frames.push(...newFrames);anims.push(...newAnims);
      }
      // 防止碰到從其他版本遺失的動畫條目：v3 每位角色都應有資料區。
      if(doc.ver>=3&&seenAniChars.size!==doc.chars.length)throw new Error('部分角色缺少動畫資料，備份不完整');
      // 僅在整份備份通過檢驗後才詢問是否還原設定，避免壞檔開啟誤導性的對話框。
      if(isFull){
        const choice=await this.chooseRestore();
        if(!choice){toast('已取消匯入','info');return false}
        restore=choice==='full';
      }
      const workspace=restore&&doc.workspace?await OCSFullState.prepare(doc.workspace,doc.items,idMap):null;
      // commit：先寫角色，後寫動畫。若後者失敗，回滾剛新增的角色資料。
      await this.writeChars(recs,assets);
      try{await this.writeAnims(anims,frames)}catch(e){
        try{await this.writeChars(recs,assets,true)}catch(rollback){console.error('rollback failure',rollback);throw new Error('動畫儲存失敗，且角色回滾未完成：'+String(e.message||e))}
        throw e;
      }
      wroteData=true;
      // 只有全部資料成功保存後，才反映到畫面與偏好。
      const newChars=[];
      for(const {rec,id} of stagedChars){
        const as=assets.filter(a=>a.charId===id),ch=Chars.custom(rec,as);Chars.list.push(ch);newChars.push(ch);
      }
      let demoOverrides={};
      if(restore&&doc.cfg.overrides&&typeof doc.cfg.overrides==='object'&&!Array.isArray(doc.cfg.overrides))demoOverrides=doc.cfg.overrides;
      Cfg.v.overrides=Object.assign({},Cfg.v.overrides,demoOverrides);
      for(const {o,dm,data,name} of demoEdits){
        const ov=Cfg.v.overrides[dm.id]=Object.assign({},Cfg.v.overrides[dm.id]||{});
        ov.name=name;ov.scale=clamp(+o.scale||1,.3,2.5);ov.ox=clamp(+o.ox||0,-60,60);ov.oy=clamp(+o.oy||0,-60,60);
        if(/^#[0-9a-f]{6}$/i.test(o.body||''))ov.body=o.body;
        if(o.look&&typeof o.look==='object')ov.look=Chars.normLook(o.look);
        ov.data=data;
        const idx=Chars.list.findIndex(c=>c.id===dm.id);if(idx>=0)Chars.list[idx]=Chars.demo(dm);
      }
      for(const [cid,rows] of stagedAnim){
        const L=Anim.libs[cid];if(L){rows.frames.forEach(r=>L.frames.set(r.id,r));L.anims.push(...rows.anims);Anim.refresh(cid)}
      }
      if(restore){
        const valid=['theme','motion','size','activity','auto','bubbles','haptics'];
        for(const key of valid)if(doc.cfg[key]!==undefined)Cfg.v[key]=doc.cfg[key];
        const chosen=idMap.get(doc.cfg.active);if(chosen)Cfg.v.active=chosen;
        if(doc.cfg.community&&window.OCSCommunity)OCSCommunity.restore(doc.cfg.community,idMap);
        // 備份內順序指向原本的 ID；須將 ID 翻譯成此次匯入的新角色。
        const order=(Array.isArray(doc.cfg.order)?doc.cfg.order:[]).map(id=>idMap.get(id)).filter(Boolean);
        const existing=Chars.list.map(c=>c.id).filter(id=>!order.includes(id));
        Cfg.v.order=[...order,...existing];
        if(doc.eco&&typeof doc.eco==='object'&&!Array.isArray(doc.eco)){
          const ev=JSON.parse(JSON.stringify(doc.eco)),bond={};
          if(ev.bond&&typeof ev.bond==='object')for(const [id,x] of Object.entries(ev.bond))bond[idMap.get(id)||id]=x;
          ev.bond=bond;
          Eco.v=Object.assign({coins:0,gems:0,streak:0,last:'',bond:{},q:{}},ev);Eco.save();
        }
        if(doc.ui&&typeof doc.ui.animAdvanced==='boolean')localStorage.setItem('ocs.anim.adv',doc.ui.animAdvanced?'1':'0');
        Theme.apply();Settings.make();
        try{if(doc.items)Items.importData(doc.items,true);if(doc.eventSystem&&window.OCSEvents)OCSEvents.restoreData(doc.eventSystem,idMap)}catch(e){console.warn(e)}
      }
      if(restore){if(workspace)await OCSFullState.restore(workspace);OCSFullState.restoreCharacterState(doc,idMap)}
      Chars.applyOrder();Chars.saveOrder();Cfg.flush();
      if(!Chars.byId(Cfg.v.active))Cfg.v.active=Chars.list[0].id;
      afterChange();Home.setChar();HUD.refresh();
      const label=doc.ver===2?'（舊版不含動畫）':'';
      toast(`已匯入 ${doc.chars.length} 位角色、${anims.length} 個動畫、${frames.length} 張影格${label}`,'check');
      if(newChars.length===1&&!isFull)setTimeout(()=>openPreview(newChars[0].id),400);
      return true;
    }catch(e){console.error('backup import',e);const m=String(e.message||e);toast((wroteData||m.includes('回滾未完成')?'部分資料已匯入，請保留備份後重試：':'匯入失敗，原有資料未被覆蓋：')+m.slice(0,68),'info');return false}
    finally{this.working=false}
  },
  pick(){let i=$('#packIn');if(!i){i=el('<input type="file" id="packIn" accept=".json,.ocpack.json,.ocbackup.json,application/json" style="display:none">');document.body.append(i);
      i.addEventListener('change',()=>{const f=i.files[0];i.value='';if(f)Backup.importFile(f)})}i.click()}
};

/* ---------- 共用小元件 ---------- */
const UI={
  field(label,node,hint){const f=el(`<div class="fld ed-f"><span>${label}${hint?`<em>${hint}</em>`:''}</span></div>`);f.append(node);return f},
  input(val,on,{ph='',max=40,type='text',mode}={}){const i=el(`<input class="inp" type="${type}" maxlength="${max}" placeholder="${esc(ph)}" autocomplete="off"${mode?` inputmode="${mode}"`:''}>`);i.value=val||'';i.addEventListener('input',()=>on(i.value));return i},
  area(val,on,{ph='',max=400}={}){const i=el(`<textarea class="inp ta" maxlength="${max}" placeholder="${esc(ph)}" rows="3"></textarea>`);i.value=val||'';
    const fit=()=>{i.style.height='auto';i.style.height=Math.min(220,Math.max(84,i.scrollHeight+2))+'px'};i.addEventListener('input',()=>{fit();on(i.value)});setTimeout(fit,30);return i},
  chips(items,val,on,{multi=false}={}){const r=el('<div class="chips wrap"></div>');
    items.forEach(it=>{const b=el(`<button class="chip ${(multi?val.includes(it.v):val===it.v)?'on':''}" data-v="${esc(it.v)}">${it.em?it.em+' ':''}${esc(it.t)}</button>`);
      b.onclick=()=>{buzz(6);if(multi){const a=val.includes(it.v);val=a?val.filter(x=>x!==it.v):[...val,it.v];b.classList.toggle('on',!a);on(val)}else{val=(val===it.v&&!it.req)?'':it.v;$$('.chip',r).forEach(x=>x.classList.toggle('on',x.dataset.v===val&&val!==''));on(val)}};r.append(b)});return r},
  tags(arr,on,{ph='新增後按 Enter',sugg=[],max=24}={}){
    const box=el('<div class="ed-tags"></div>'),list=el('<div class="tgbox"></div>'),row=el('<div class="tgadd"><input class="inp" maxlength="16" autocomplete="off"><button class="btn ed-add" aria-label="新增">'+ic('plus',20)+'</button></div>'),inp=$('input',row);inp.placeholder=ph;
    const paint=()=>{list.innerHTML='';arr.forEach((t,i)=>{const g=el(`<span class="tg">${esc(t)}<button aria-label="刪除">${ic('x',14)}</button></span>`);$('button',g).onclick=()=>{buzz(6);arr.splice(i,1);on(arr);paint()};list.append(g)});
      if(!arr.length)list.append(el('<span class="ed-empty">還沒有，留空也沒關係</span>'))};
    const add=v=>{v=(v||'').trim().slice(0,16);if(!v||arr.includes(v)||arr.length>=max)return;arr.push(v);on(arr);paint();inp.value=''};
    $('button',row).onclick=()=>add(inp.value);inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();add(inp.value)}});
    box.append(list,row);
    if(sugg.length){const s=el('<div class="chips wrap sugg"></div>');sugg.forEach(t=>{const b=el(`<button class="chip mini">+ ${esc(t)}</button>`);b.onclick=()=>{buzz(6);add(t)};s.append(b)});box.append(s)}
    paint();return box},
  ends(s,val,on){const r=el(`<div class="ed-sl"><div class="rr-h"><b>${s.t}</b><output></output></div><input class="rng" type="range" min="0" max="100" step="1" value="${val}" aria-label="${s.t}"><div class="ends"><small>${s.a}</small><small>${s.b}</small></div></div>`);
    const i=$('input',r),o=$('output',r),paint=()=>{i.style.setProperty('--p',i.value+'%');const v=+i.value;o.textContent=v<=30?s.a:v>=70?s.b:'適中'};
    paint();i.addEventListener('input',()=>{paint();on(+i.value)});r.set=v=>{i.value=v;paint()};return r},
  card(...n){const c=el('<div class="ed-card"></div>');c.append(...n);return c},
  h(t){return el(`<div class="ed-h">${t}</div>`)}
};

/* 角色捏臉：共用於快速建立與角色編輯，所見即所得。 */
const catHexToHsv=hx=>{const r=parseInt(hx.slice(1,3),16)/255,g=parseInt(hx.slice(3,5),16)/255,b=parseInt(hx.slice(5,7),16)/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0;if(d){h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;if(h<0)h+=360}return[h,mx?d/mx:0,mx]};
const catHsvToHex=(h,s,v)=>{const f=n=>{const k=(n+h/60)%6;return Math.round(255*(v-v*s*Math.max(0,Math.min(k,4-k,1))))};return'#'+[f(5),f(3),f(1)].map(q=>q.toString(16).padStart(2,'0')).join('')};
function openCatColorWheel(start,onChange){let col=CAT_COLOR(start)?start:'#F4E8D7';let[h,sa,v]=catHexToHsv(col);const S=270,C=S/2,R=C-3,r1=R-30,hf=r1*.7;const sh=openSheet('<div class="sh-body" id="catWheel"></div>'),B=$('#catWheel',sh.el);
  B.innerHTML=`<div class="sh-title">選擇顏色</div><div style="display:flex;justify-content:center"><canvas id="cwh" width="${S*2}" height="${S*2}" style="width:${S}px;height:${S}px;touch-action:none"></canvas></div>
  <div class="c4-r" style="margin-top:10px"><span id="catSw" style="display:block;width:44px;height:44px;border-radius:14px;flex:none;border:3px solid var(--surface);outline:2px solid var(--accent);background:${col}"></span><b id="catHex" style="flex:1;font-size:14px">${col.toUpperCase()}</b><button class="c4-b" data-save style="padding:0 14px">收藏</button><button class="c4-b p" data-close style="padding:0 18px">完成</button></div>
  <div class="ed-l">已收藏顏色</div><div class="c4-sws" id="catSaved"></div>`;
  const cv=$('#cwh',B),x=cv.getContext('2d');x.scale(2,2);
  const getSaved=()=>{try{return JSON.parse(localStorage.getItem('ocs.catpal')||'[]')}catch(e){return[]}};
  const paintSaved=()=>{$('#catSaved',B).innerHTML=getSaved().map(c=>`<button class="c4-sw" data-c="${c}" style="background:${c}"></button>`).join('')||'<small style="color:var(--ink-3)">尚未收藏</small>'};
  const draw=()=>{x.clearRect(0,0,S,S);for(let a=0;a<360;a+=1){x.beginPath();x.arc(C,C,(R+r1)/2,(a-91)*Math.PI/180,(a-89)*Math.PI/180);x.lineWidth=R-r1;x.strokeStyle=`hsl(${a},100%,50%)`;x.stroke()}x.save();x.translate(C-hf,C-hf);x.fillStyle=`hsl(${h},100%,50%)`;x.fillRect(0,0,hf*2,hf*2);let g=x.createLinearGradient(0,0,hf*2,0);g.addColorStop(0,'#fff');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,hf*2,hf*2);g=x.createLinearGradient(0,0,0,hf*2);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'#000');x.fillStyle=g;x.fillRect(0,0,hf*2,hf*2);x.beginPath();x.arc(sa*hf*2,(1-v)*hf*2,9,0,7);x.lineWidth=3;x.strokeStyle='#fff';x.stroke();x.lineWidth=1.2;x.strokeStyle='#0008';x.stroke();x.restore();const an=(h-90)*Math.PI/180,rm=(R+r1)/2;x.save();x.translate(C+Math.cos(an)*rm,C+Math.sin(an)*rm);x.rotate(an);x.beginPath();x.roundRect(-(R-r1)/2-2,-4,R-r1+4,8,3);x.fillStyle=`hsl(${h},100%,50%)`;x.fill();x.lineWidth=3;x.strokeStyle='#fff';x.stroke();x.lineWidth=1;x.strokeStyle='#0008';x.stroke();x.restore();$('#catSw',B).style.background=col;$('#catHex',B).textContent=col.toUpperCase()};
  const apply=()=>{col=catHsvToHex(h,sa,v);draw();onChange(col)};
  let mode=null;const pos=e=>{const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)*S/r.width-C,y:(e.clientY-r.top)*S/r.height-C}};
  const upd=e=>{const q=pos(e);if(mode==='ring'){h=(Math.atan2(q.y,q.x)*180/Math.PI+90+360)%360}else if(mode==='sv'){sa=Math.max(0,Math.min(1,(q.x+hf)/(hf*2)));v=1-Math.max(0,Math.min(1,(q.y+hf)/(hf*2)))}apply()};
  cv.addEventListener('pointerdown',e=>{const q=pos(e),d=Math.hypot(q.x,q.y);if(d>=r1-6&&d<=R+8)mode='ring';else if(Math.abs(q.x)<=hf+8&&Math.abs(q.y)<=hf+8)mode='sv';else return;e.preventDefault();cv.setPointerCapture(e.pointerId);upd(e)});
  cv.addEventListener('pointermove',e=>{if(mode)upd(e)});cv.addEventListener('pointerup',()=>mode=null);cv.addEventListener('pointercancel',()=>mode=null);
  B.addEventListener('click',e=>{const c=e.target.closest('[data-c]');if(c){col=c.dataset.c;[h,sa,v]=catHexToHsv(col);draw();onChange(col);return}if(e.target.closest('[data-save]')){const A=getSaved().filter(q=>q!==col);A.unshift(col);try{localStorage.setItem('ocs.catpal',JSON.stringify(A.slice(0,15)))}catch(er){}paintSaved();toast('已收藏顏色','check')}});
  draw();paintSaved()}
/* 2.4J · Touch-friendly accessory placement: drag, scale, rotate and save. */
const CatAccessoryPlacement={
  bind(root,getLook,commit){if(!root)return;root.querySelectorAll(':scope > .cat-place-handle').forEach(n=>n.remove());const look=getLook();if(!catPlaceable(look))return;
    const svg=root.querySelector('svg.cat-ref-v2'),inner=svg&&svg.querySelector('.head-g > g'),placed=svg&&svg.querySelector('.accessory-placed');if(!svg||!inner||!placed)return;
    placed.style.pointerEvents='all';placed.style.cursor='grab';svg.style.touchAction='none';
    const paint=()=>{const g=svg.querySelector('.accessory-placed');if(g)g.setAttribute('transform',catAccTransform(getLook()))};
    const current=(x,y)=>{const m=inner.getScreenCTM();if(!m)return;const p=new DOMPoint(x,y).matrixTransform(m.inverse()),a=CAT_ACC_ANCHORS[catSmallKind(getLook())];if(!a)return;const l=getLook();l.accX=Math.round(Math.max(-94,Math.min(94,p.x-a[0])));l.accY=Math.round(Math.max(-80,Math.min(75,p.y-a[1])));paint()};
    let drag=null;const start=e=>{if(!e.target.closest||!e.target.closest('.accessory-placed'))return;e.preventDefault();e.stopPropagation();drag=e.pointerId;svg.setPointerCapture(e.pointerId);placed.classList.add('dragging');placed.style.cursor='grabbing';current(e.clientX,e.clientY)};
    const move=e=>{if(drag!==e.pointerId)return;e.preventDefault();e.stopPropagation();current(e.clientX,e.clientY)};
    const end=e=>{if(drag!==e.pointerId)return;e.stopPropagation();drag=null;placed.classList.remove('dragging');placed.style.cursor='grab';commit({accX:getLook().accX,accY:getLook().accY})};
    svg.addEventListener('pointerdown',start);svg.addEventListener('pointermove',move);svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
    requestAnimationFrame(paint);return {place:paint,node:placed}},
};
function openCatAccessoryPlacement(source,onDone){if(!catPlaceable(source)){toast('先選擇小配件才能擺放','info');return}
 const look=CAT_NORM({...source});const sheet=openSheet(`<div class="sh-body cat-place-sheet"><h3>自由擺放小配件</h3><p class="cat-place-sub">直接拖曳配件本體就能移動位置；下方可以微調大小與角度。</p><div class="cat-place-large" id="catPlaceLarge"></div><div class="cat-place-tuners"><label>大小 <output id="catSizeOut"></output><input id="catSize" type="range" min="65" max="170" step="1"></label><label>角度 <output id="catRotOut"></output><input id="catRot" type="range" min="-80" max="80" step="1"></label></div><div class="cat-place-bottom"><button class="btn grow" id="catPlaceReset" type="button">重設位置</button><button class="btn grow" data-close type="button">取消</button><button class="btn grow primary" id="catPlaceDone" type="button">套用</button></div></div>`,{cls:'tall'});
 const box=$('#catPlaceLarge',sheet.el),size=$('#catSize',sheet.el),rot=$('#catRot',sheet.el),sz=$('#catSizeOut',sheet.el),ro=$('#catRotOut',sheet.el);
 const render=()=>{box.innerHTML=thumbHTML({kind:'demo',look});CatAccessoryPlacement.bind(box,()=>look,()=>{});size.value=look.accScale;rot.value=look.accRot;sz.textContent=look.accScale+'%';ro.textContent=look.accRot+'°'};
 size.addEventListener('input',()=>{look.accScale=+size.value;sz.textContent=size.value+'%';const g=box.querySelector('.accessory-placed');if(g)g.setAttribute('transform',catAccTransform(look))});
 rot.addEventListener('input',()=>{look.accRot=+rot.value;ro.textContent=rot.value+'°';const g=box.querySelector('.accessory-placed');if(g)g.setAttribute('transform',catAccTransform(look))});
 $('#catPlaceReset',sheet.el).onclick=()=>{look.accX=0;look.accY=0;look.accScale=100;look.accRot=0;render();buzz(6)};
 $('#catPlaceDone',sheet.el).onclick=()=>{onDone({accX:look.accX,accY:look.accY,accScale:look.accScale,accRot:look.accRot});sheet.close();toast('已保存配件位置','check')};
 render();}
const CAT_UI={
 colors(look,key,apply){const w=el('<div class="cat-color-actions"></div>'),cols=key==='body'?COLORS:['#C9A9A1','#C57959','#8E9FB8','#769A7E','#F1D5B8','#6F718E','#C98B77','#B7B8CC','#DC98AC','#9C8BBE'];
  const sync=current=>{$$('button.cat-swatch',w).forEach(x=>x.classList.toggle('on',x.dataset.hex&&x.dataset.hex.toLowerCase()===current.toLowerCase()));const pre=$('.cat-color-wheel b',w);if(pre)pre.style.background=current};
  const setCol=c=>{apply(key,c);sync(c)};
  cols.forEach(c=>{const b=el(`<button type="button" data-hex="${c}" class="cat-swatch ${look[key].toLowerCase()===c.toLowerCase()?'on':''}" style="background:${c}" aria-label="${c}" title="${c}"></button>`);b.onclick=()=>setCol(c);w.append(b)});
  const wheel=el(`<button type="button" class="cat-color-wheel" aria-label="開啟色環"><b style="background:${look[key]}"></b><span>色環</span></button>`);wheel.onclick=()=>openCatColorWheel(look[key],c=>{look[key]=c;setCol(c)});w.append(wheel);return w},
 panel(look,apply){const root=el('<div class="cat-maker"></div>'),section=(title,desc)=>{const c=UI.card();c.classList.add('cat-make-card');c.prepend(el(`<div class="cat-section-h"><b>${title}</b><small>${desc}</small></div>`));root.append(c);return c},
  opts=(node,key,title)=>{const choices=key==='acc'?CAT_OPT.acc.filter(([k])=>['none','starlet','leafy','snoozy'].includes(k)):CAT_OPT[key]||[],visual=['head','ears','eye','brow','mouth','cheekStyle','pattern','tail','tailSide'].includes(key),panel=el(`<div class="cat-choice-grid ${visual?'visual':''}" role="group" aria-label="${title}"></div>`);
   const icons={
    head:{pebble:'M9 13 Q15 7 30 8 Q45 8 51 15 L53 35 Q49 47 30 48 Q10 48 7 34Z',puff:'M8 21 Q10 7 26 8 Q40 3 48 14 Q58 24 51 39 Q43 48 26 47 Q8 43 8 21Z',tall:'M12 8 L48 8 53 36 Q49 49 30 48 Q11 48 7 36Z',wide:'M8 14 Q15 7 30 9 Q48 6 53 15 L57 34 Q49 48 30 47 Q10 49 3 34Z'},
    ears:{upright:'M6 47 L14 8 34 33 49 8 58 47Z',soft:'M6 47 L12 16 Q15 12 21 18 L34 32 47 17 Q53 10 55 20 L58 47Z',wide:'M6 47 L2 18 29 33 55 18 58 47Z',tuft:'M6 47 L12 17 17 24 22 8 31 33 47 8 57 47Z'},
    eye:{droop:'M4 20 Q15 15 26 19 L23 30 Q15 37 7 29Z M38 20 Q48 15 58 19 L55 30 Q47 37 39 29Z',sleepy:'M4 24 L27 24 21 31 10 31Z M38 24 L60 24 54 31 42 31Z',bean:'M11 16 Q24 13 25 25 Q23 36 12 34 Q5 27 11 16Z M42 16 Q55 13 56 25 Q53 36 43 34 Q36 27 42 16Z',round:'M7 15 Q18 10 24 21 Q28 32 18 36 Q5 34 7 15Z M39 15 Q50 10 56 21 Q60 32 50 36 Q37 34 39 15Z',spark:'M7 15 Q18 10 24 21 Q28 32 18 36 Q5 34 7 15Z M39 15 Q50 10 56 21 Q60 32 50 36 Q37 34 39 15Z',smile:'M3 29 Q14 10 26 29 M38 29 Q49 10 61 29'},
    brow:{none:'M10 24 L24 24 M40 24 L54 24',flat:'M5 19 L26 19 M38 19 L59 19',soft:'M5 23 Q16 15 26 23 M38 23 Q49 15 59 23',arched:'M5 24 Q16 7 26 19 M38 19 Q49 7 59 24',sad:'M5 14 L26 24 M38 24 L59 14'},
    mouth:{caret:'M23 30 L32 21 L41 30',w:'M18 25 Q25 35 32 25 Q39 35 46 25',smile:'M18 25 Q32 39 46 25',tiny:'M27 26 Q32 22 37 26',open:'M25 24 Q32 18 39 24 Q41 36 32 38 Q24 36 25 24Z'},
    cheekStyle:{none:'M13 27 L22 27 M42 27 L51 27',blush:'M10 24 Q15 18 22 24 Q24 32 15 31Q8 30 10 24 M42 24 Q47 18 54 24 Q56 32 47 31 Q40 30 42 24',stripes:'M12 20 L8 31 M20 20 L16 31 M45 20 L41 31 M53 20 L49 31',heart:'M6 21 Q11 14 16 20 Q21 14 26 22 Q24 30 16 35 Q8 30 6 21Z M39 21 Q44 14 49 20 Q54 14 59 22 Q57 30 49 35 Q41 30 39 21Z',spark:'M16 11 L19 21 29 24 19 27 16 37 13 27 3 24 13 21Z M48 11 L51 21 61 24 51 27 48 37 45 27 35 24 45 21Z',paw:'M12 27 Q17 21 22 27 L25 33 Q17 39 10 33Z M42 27 Q47 21 52 27 L55 33 Q47 39 40 33Z'},
    tail:{curl:'M12 25 Q27 8 41 24 Q50 34 38 43',straight:'M12 40 Q44 40 52 17',fluffy:'M12 39 Q38 52 50 26 L55 15'},
    tailSide:{left:'M14 38 Q6 24 18 16 Q30 10 43 16 L51 21 M20 35 Q31 28 38 14',right:'M50 38 Q58 24 46 16 Q34 10 21 16 L13 21 M44 35 Q33 28 26 14'},
    pattern:{none:'M8 18 Q22 8 32 10 Q43 9 56 18 L56 41 Q45 45 32 44 Q18 45 8 40Z',cap:'M8 18 Q22 8 32 10 Q43 9 56 18 L51 24 Q32 17 14 25Z',mask:'M8 23 Q32 14 56 23 L53 36 Q31 31 11 36Z',patch:'M10 18 Q20 10 28 18 Q26 33 16 36 Q7 29 10 18Z',tabby:'M19 12 L23 23 M32 10 L32 23 M45 12 L41 23',calico:'M10 20 Q20 8 28 18 Q20 28 12 28Z M35 15 Q47 10 54 20 Q51 31 39 28Z',socks:'M8 39 L21 33 31 41 42 33 56 39 L56 46 Q44 49 32 48 Q19 49 8 46Z'}
   };
   choices.forEach(([v,t])=>{const path=(icons[key]||{})[v];const svg=visual?`<svg viewBox="0 0 64 52" aria-hidden="true"><path d="${path||'M9 37 L21 14 31 37 42 14 55 37 48 47 14 47Z'}" ${key==='eye'?'fill="currentColor" stroke="currentColor"':'fill="none" stroke="currentColor"'} stroke-width="${key==='eye'?1.5:3.2}" stroke-linecap="round" stroke-linejoin="round"/></svg>`:'';
    const opt=el(`<button type="button" class="cat-choice ${look[key]===v?'on':''}" data-val="${esc(v)}" aria-pressed="${look[key]===v}">${svg}<small>${esc(t)}</small></button>`);
    opt.onclick=()=>{if(key==='smallAcc'&&look.smallAcc!==v){look.accX=0;look.accY=0;look.accScale=100;look.accRot=0}apply(key,v);$$('.cat-choice',panel).forEach(e=>{const active=e===opt;e.classList.toggle('on',active);e.setAttribute('aria-pressed',String(active))})};panel.append(opt)});
   node.append(UI.field(title,panel))},
  slider=(node,key,title,unit='%')=>{const [mn,mx]=CAT_RANGES[key];node.append(mkRange(title,mn,mx,1,look[key],v=>v+unit,v=>apply(key,v)))};
  const face=section('頭部與耳朵','每一種頭型都保留獨立的圓角幾何結構');opts(face,'head','臉型');opts(face,'ears','耳型');slider(face,'headSize','頭部大小');slider(face,'earSize','耳朵大小');
  const features=section('眼睛與表情','預覽會固定在上方，不用一直滑回去看效果');opts(features,'eye','眼型');opts(features,'brow','眉型');opts(features,'mouth','嘴型');opts(features,'cheekStyle','腮紅／臉頰');slider(features,'eyeSize','眼睛大小');slider(features,'eyeSpace','眼睛間距');slider(features,'eyeY','眼睛高低','');slider(features,'mouthY','嘴巴高低','');slider(features,'cheeks','腮紅濃度');
  const fur=section('毛色與花紋','重新整理成更乾淨、柔和的低多邊形花紋');fur.append(UI.field('主要毛色',this.colors(look,'body',apply)));fur.append(UI.field('花紋色',this.colors(look,'accent',apply)));opts(fur,'pattern','花紋');
  const adorn=section('尾巴與裝扮','服裝和小配件分開選，配件不會再取代原本的衣服');opts(adorn,'tail','尾巴');opts(adorn,'tailSide','尾巴位置');opts(adorn,'acc','主題服裝');opts(adorn,'smallAcc','可移動小配件');
  const place=el(`<div class="cat-position-actions"><button type="button" class="btn primary cat-position-btn">調整小配件位置</button><small>現在可以直接拖曳配件本體；如果想更精準，也可以打開放大調整。</small></div>`);
  const pb=$('button',place);const syncPlace=()=>{pb.disabled=!catPlaceable(look);pb.textContent=catPlaceable(look)?'調整小配件位置':'先選擇一個小配件'};
  pb.onclick=()=>openCatAccessoryPlacement(look,patch=>{Object.assign(look,patch);apply('accX',look.accX)});
  adorn.append(place);syncPlace();
  const oldApply=apply;apply=(key,v)=>{oldApply(key,v);if(key==='smallAcc'||key==='acc')syncPlace()};
  return root}
};

/* ---------- 新增精靈：快速創建／進階／匯入 ---------- */
const TEMPLATES=[
  {id:'sunny',em:'☀️',t:'活潑開朗',sl:{lively:82,social:78,expr:75,pace:70,indep:45,friendly:80},traits:['hot']},
  {id:'calm',em:'🍃',t:'沉穩安靜',sl:{lively:25,social:30,expr:30,pace:30,indep:70,friendly:60},traits:['dreamer']},
  {id:'tsun',em:'😤',t:'傲嬌',sl:{lively:55,social:45,expr:65,pace:60,indep:78,friendly:32},traits:['tsun']},
  {id:'soft',em:'🌸',t:'溫柔體貼',sl:{lively:40,social:60,expr:55,pace:38,indep:35,friendly:90},traits:['gentle']},
  {id:'curio',em:'🔍',t:'好奇寶寶',sl:{lively:70,social:55,expr:65,pace:60,indep:55,friendly:70},traits:['curious']},
  {id:'lazy',em:'😴',t:'懶洋洋',sl:{lively:18,social:40,expr:35,pace:20,indep:55,friendly:60},traits:['lazy','sleepy']}];
const NewSheet={
  open(){
    const s=openSheet(`<div class="sh-body"><div class="sh-title">新增夥伴</div>
    <button class="srow" data-k="quick"><span class="c ns-ic">${ic("sparkle")}</span><span class="t"><b>快速創建</b><small>自由調整貓咪的五官、花紋與造型</small></span></button>
    <button class="srow" data-k="adv"><span class="c ns-ic">${ic("palette")}</span><span class="t"><b>進階創建</b><small>從空白開始，完整自訂資料與個性</small></span></button>
    <button class="srow" data-k="img"><span class="c ns-ic">${ic("picture")}</span><span class="t"><b>匯入圖片角色</b><small>用你的立繪或角色圖片</small></span></button>
    <button class="srow" data-k="pack"><span class="c ns-ic">${ic("parcel")}</span><span class="t"><b>匯入角色包／備份</b><small>讀取 .json 角色檔</small></span></button></div>`);
    s.el.addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(!b)return;buzz(8);s.close();const k=b.dataset.k;
      setTimeout(()=>{if(k==='quick')this.quick();else if(k==='adv')this.advanced();else if(k==='img')pickFiles();else Backup.pick()},260)})},
  async advanced(){const ch=await Chars.create({name:'新夥伴',look:Chars.randLook()});afterChange();Ed.open(ch.id,'basic')},
  quick(){
    const st={name:pick(NAMES),look:Chars.randLook(),tpl:TEMPLATES[0].id,traits:[]};
    const s=openSheet(`<div class="sh-body"><div class="sh-title">捏一隻專屬小貓</div><div class="cat-intro">選擇三隻軟萌貓咪之一，或自由捏出新的小貓。眼睛、耳朵、臉型、嘴型、毛色與服裝都能即時預覽。</div>
      <div class="qk-top cat-hero"><div class="qk-prev" id="qkPrev"></div><div class="qk-name"><label class="fld"><span>小貓的名字</span><div class="qk-row"><input class="inp" id="qkName" maxlength="16" autocomplete="off"><button class="icon-btn qk-dice" id="qkDice" aria-label="重新隨機生成外觀">${ic('dice')}</button></div></label><small class="cat-hero-hint">預覽固定在上方。選擇小配件後，可拖曳 ✥ 調整位置</small></div></div>
      <div class="cat-preset-wrap"><div class="cat-section-h"><b>挑一隻作為造型起點</b><small>選完還可以自由修改，並不會影響原本的預設角色</small></div><div class="cat-preset-scroll" id="qkPresets"></div></div>
      <div id="qkLook"></div>
      <div class="cat-make-card ed-card"><div class="cat-section-h"><b>角色個性</b><small>影響牠的自主行為與生活互動</small></div>
      <div class="fld"><span>個性範本</span><div id="qkTpl"></div></div>
      <div class="fld"><span>再加幾個特質（最多 3 個）</span><div id="qkTr" class="chips wrap"></div></div></div>
      <div class="pv-cta stk"><button class="btn grow" id="qkAdv">進階編輯</button><button class="btn primary grow" id="qkGo">${ic('sparkle',20)}讓牠登場</button></div></div>`,{cls:'tall'});
    const E=s.el,nm=$('#qkName',E);nm.value=st.name;nm.oninput=()=>st.name=nm.value;
    const preview=()=>{const box=$('#qkPrev',E);box.innerHTML=thumbHTML({kind:'demo',look:st.look,body:st.look.body});CatAccessoryPlacement.bind(box,()=>st.look,()=>{st.base=null;presets.querySelectorAll('button').forEach(x=>x.classList.remove('on'));preview()})};
    const presets=$('#qkPresets',E);DEMOS.forEach(d=>{const b=el(`<button class="cat-preset" type="button" data-base="${d.id}" aria-label="以 ${esc(d.name)} 的造型開始"><span class="cat-preset-art">${thumbHTML({kind:'demo',look:d.look})}</span><small>${esc(d.name.split(' ')[0])}</small></button>`);b.onclick=()=>{st.base=d.id;st.look=Chars.normLook(d.look);redraw();buzz(8)};presets.append(b)});
    const redraw=()=>{$('#qkLook',E).replaceChildren(CAT_UI.panel(st.look,(k,v)=>{st.look[k]=v;st.base=null;presets.querySelectorAll('button').forEach(x=>x.classList.remove('on'));preview()}));presets.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x.dataset.base===st.base));preview()};
    $('#qkDice',E).onclick=()=>{buzz(12);st.name=pick(NAMES);nm.value=st.name;st.look=Chars.randLook();st.base=null;redraw()};
    const tp=UI.chips(TEMPLATES.map(t=>({v:t.id,t:t.t,em:ocsPersonaIcon(t.id),req:1})),st.tpl,v=>{if(v){st.tpl=v;st.traits=st.traits.filter(id=>!(TEMPLATES.find(x=>x.id===v).traits.includes(id)))}});$('#qkTpl',E).replaceChildren(tp);
    const tr=$('#qkTr',E);TRAITS.forEach(t=>{const b=el(`<button class="chip">${ocsPersonaIcon(t.id)} ${esc(t.t)}</button>`);b.onclick=()=>{buzz(6);if(st.traits.includes(t.id))st.traits=st.traits.filter(x=>x!==t.id);else if(st.traits.length<LK)st.traits.push(t.id);else{toast('最多選 3 個特質','info');return}b.classList.toggle('on',st.traits.includes(t.id))};tr.append(b)});
    redraw();let saving=false;
    const make=async()=>{if(saving)return null;saving=true;try{const t=TEMPLATES.find(x=>x.id===st.tpl)||TEMPLATES[0];const data={species:'貓咪',pers:{sl:t.sl,traits:[...new Set([...t.traits,...st.traits])]}};return await Chars.create({name:(st.name||'').trim()||'新夥伴',look:st.look,data})}finally{saving=false}};
    $('#qkGo',E).onclick=async()=>{buzz(14);const ch=await make();if(!ch)return;s.close();setActive(ch.id);Gallery.render();Nav.go(0);setTimeout(()=>toast(`${ch.name} 登場囉`,'sparkle'),300)};
    $('#qkAdv',E).onclick=async()=>{const ch=await make();if(!ch)return;s.close();afterChange();setTimeout(()=>Ed.open(ch.id,'look'),280)};
  }
};

/* ---------- 角色編輯器 ---------- */
function refreshViews(ch,rebuild){
  Gallery.dirty=true;Studio.renderSwitch();
  if(Cfg.v.active===ch.id){rebuild?Home.stage.setChar(ch):Home.stage.applyAdjust();Home.refreshChip();Explore.hero()}
  if(Ed.stage&&Ed.ch===ch){rebuild?Ed.stage.setChar(ch):Ed.stage.applyAdjust()}
  if(Studio.sel===ch.id){rebuild?Studio.stage.setChar(ch):Studio.stage.applyAdjust()}}
const Ed={el:null,ch:null,tab:'look',stage:null,isOpen:false,api:null,st:0,
  TABS:[['look','捏臉'],['basic','基本'],['pers','個性'],['talk','說話'],['more','自訂'],['asset','素材']],
  init(){
    const e=this.el=el(`<div class="ovp" id="editor" aria-label="角色編輯"><div class="scroll" id="edScroll"><div class="ed-top">
      <div class="ov-bar"><button class="icon-btn" id="edBack" aria-label="返回">${ic('left')}</button><h1 id="edTitle">編輯角色</h1><span class="saved" id="edSaved"><span>${ic('check')}</span>已儲存</span><button class="icon-btn" id="edMore" aria-label="更多">${ic('more')}</button></div>
      <div class="ed-prev"><div class="stage pv" id="edStage"></div><button class="ed-say glass" id="edSay">${ic('chat',18)}說說話</button></div>
      <div class="chips ed-tabs" id="edTabs"></div></div><div id="edBody" class="ed-body"></div></div></div>`);
    $('#app').append(e);
    $('#edBack').onclick=()=>this.close();$('#edMore').onclick=()=>this.menu();
    $('#edSay').onclick=()=>{buzz(8);const k=pick(['idle','idle','pet']);this.stage.say(Persona.line(this.ch,k))};
    $('#edTabs').addEventListener('click',ev=>{const b=ev.target.closest('[data-t]');if(!b)return;buzz(6);this.go(b.dataset.t)})},
  open(id,tab){
    const ch=Chars.byId(id);if(!ch||this.isOpen)return;this.ch=ch;this.isOpen=true;
    if(!this.stage)this.stage=new Stage($('#edStage'),{auto:true,size:(W,H)=>H*.64});
    this.el.classList.add('open');this.api={el:this.el,close:()=>this.close()};Ov.push(this.api);buzz(8);
    this.stage.setChar(ch,false);this.stage.start();Home.stage.stop();
    $('#edTitle').textContent=ch.name;this.tab=tab||'look';this.go(this.tab,true)},
  close(){
    if(!this.isOpen)return;this.isOpen=false;this.el.classList.remove('open');Ov.remove(this.api);Chars.flush();
    this.stage.stop();Home.vis&&Home.stage.start();
    Gallery.render();Studio.renderSwitch();if(Studio.sel===this.ch.id)Studio.select(this.ch.id,true);Settings.refresh()},
  go(t,instant){
    this.tab=t;$('#edTabs').innerHTML=this.TABS.map(([k,n])=>`<button class="chip ${k===t?'on':''}" data-t="${k}">${n}</button>`).join('');
    const body=$('#edBody'),b=this['t_'+t]();body.replaceChildren(b);b.classList.add('ed-in');
    if(!instant)$('#edScroll').scrollTo({top:0});
    if(t==='look'&&!this.ch.url)requestAnimationFrame(()=>CatAccessoryPlacement.bind($('#edStage'),()=>this.ch.look,patch=>this.adj({look:Object.assign({},this.ch.look,patch)},true)));else $('#edStage').querySelectorAll(':scope > .cat-place-handle').forEach(n=>n.remove());
    const on=$(`#edTabs [data-t="${t}"]`);on&&Fx.centerIn($('#edTabs'),on)},
  /* 修改資料：即時更新個性、台詞與所有畫面 */
  saved(){const s=$('#edSaved');s.classList.add('show');clearTimeout(this.st);this.st=setTimeout(()=>s.classList.remove('show'),1300)},
  set(fn,{rebuild=false,title=false}={}){const ch=this.ch;fn(ch.data);ch.data=Persona.norm(ch.data);Persona.refresh(ch);Chars.patch(ch,{data:ch.data});this.saved();refreshViews(ch,rebuild);if(title)$('#edTitle').textContent=ch.name},
  adj(p,rebuild){Chars.patch(this.ch,p);Persona.refresh(this.ch);this.saved();refreshViews(this.ch,rebuild);if(this.tab==='look'&&!this.ch.url)requestAnimationFrame(()=>CatAccessoryPlacement.bind($('#edStage'),()=>this.ch.look,patch=>this.adj({look:Object.assign({},this.ch.look,patch)},true)))},
  /* —— 捏臉與外觀 —— */
  t_look(){const ch=this.ch,b=el('<div></div>');
    b.append(UI.card(UI.field('名字',UI.input(ch.name,v=>{v=v.trim();if(v){this.adj({name:v.slice(0,16)});$('#edTitle').textContent=ch.name}},{max:16,ph:'角色名稱'}))));
    if(!ch.url){
      b.append(el(`<div class="cat-intro">這是 OC Shimeji 專屬的圓角 Low-Poly 軟萌貓咪骨架。調整時會同步更新首頁、角色縮圖與生活動畫。</div>`));
      const panel=CAT_UI.panel(ch.look,(k,v)=>this.adj({look:Object.assign({},ch.look,{[k]:v})},true));b.append(panel);
      const actions=UI.card(),bar=el('<div class="cat-buttons"></div>');
      const random=el(`<button class="btn grow">${ic('dice',18)} 隨機搭配</button>`);random.onclick=()=>{const next=Chars.randLook();this.adj({look:next},true);this.go('look',true);toast('換了一套新造型','sparkle')};
      const reset=el(`<button class="btn grow">${ic('reset',18)} 恢復基本造型</button>`);reset.onclick=()=>{this.adj({look:Object.assign({},CAT_BASE)},true);this.go('look',true);toast('已恢復基本造型','check')};
      bar.append(random,reset);actions.append(bar);b.append(actions)}
    else b.append(el(`<div class="ed-note">${ic('info')}<span>目前使用你匯入的角色圖片。可以到「素材」分頁更換圖片；捏臉僅適用內建幾何貓咪骨架。</span></div>`));
    const a=UI.card();a.append(mkRange('縮放',40,180,1,Math.round(ch.scale*100),v=>v+'%',v=>this.adj({scale:v/100})),
      mkRange('水平位置',-50,50,1,ch.ox,v=>(v>0?'+':'')+v,v=>this.adj({ox:v})),
      mkRange('垂直位置（正值向下）',-40,40,1,ch.oy,v=>(v>0?'+':'')+v,v=>this.adj({oy:v})));
    if(ch.url)a.append(UI.field('素材朝向',mkSeg([{v:'right',t:'朝右'},{v:'left',t:'朝左'}],ch.facing,v=>this.adj({facing:v}))));
    b.append(a);return b},
  /* —— 基本 —— */
  t_basic(){const ch=this.ch,d=ch.data,b=el('<div></div>'),S=(k,o)=>v=>this.set(x=>{x[k]=v},o);
    b.append(el('<div class="ed-hint">全部都可以留空。想到什麼就填，之後隨時能改。</div>'));
    const g1=UI.card();
    g1.append(UI.field('暱稱',UI.input(d.nick,S('nick'),{max:16,ph:'朋友怎麼叫牠？'})),
      UI.field('一句話介紹',UI.input(d.tagline,S('tagline',{title:true}),{max:24,ph:'顯示在角色卡上'})));
    const row=el('<div class="two"></div>');
    row.append(UI.field('生日',UI.input(d.birthday,S('birthday'),{type:'text',max:12,ph:'例：03/14'})),UI.field('年齡',UI.input(d.age,S('age'),{max:12,ph:'例：17 或 不明'})));
    g1.append(row);b.append(g1);
    const g2=UI.card();
    const gen=['女性','男性','無性別','不設定'].map(t=>({v:t,t}));
    g2.append(UI.field('性別',UI.chips(gen,d.gender,v=>this.set(x=>{x.gender=v}))),UI.input(d.gender,S('gender'),{max:12,ph:'或自己輸入任何描述'}));
    const pn=['他','她','牠','TA'].map(t=>({v:t,t}));
    g2.append(UI.field('代稱',UI.chips(pn,d.pronoun,v=>this.set(x=>{x.pronoun=v}))),UI.input(d.pronoun,S('pronoun'),{max:10,ph:'自訂代稱'}));
    const r2=el('<div class="two"></div>');
    r2.append(UI.field('種族',UI.input(d.species,S('species'),{max:16,ph:'例：貓、妖精、人類'})),UI.field('身高',UI.input(d.height,S('height'),{max:12,ph:'例：30cm'})));
    g2.append(r2);b.append(g2);
    b.append(UI.card(UI.field('角色介紹',UI.area(d.bio,S('bio'),{ph:'簡單介紹這位角色',max:400})),UI.field('背景故事',UI.area(d.story,S('story'),{ph:'來歷、經歷、秘密…',max:1200}))));
    const tg=(label,k,sugg)=>UI.field(label,UI.tags(d[k].slice(),arr=>this.set(x=>{x[k]=arr.slice()}),{sugg}));
    b.append(UI.card(tg('興趣','interests',['畫畫','散步','看雲','唱歌']),tg('喜好','likes',['甜點','陽光','小魚乾']),tg('厭惡','dislikes',['打雷','吵鬧','蟲蟲']),tg('生活習慣','habits',['早起','熬夜','愛喝茶','愛整理'])));
    return b},
  /* —— 個性 —— */
  t_pers(){const ch=this.ch,b=el('<div></div>');
    const sum=el(`<div class="ed-sum"><div class="sm-t">個性預覽</div><p id="pdesc"></p><div class="bars" id="pbars"></div></div>`);
    const paint=()=>{const m=ch.mind;$('#pdesc',sum).textContent=ch.desc;
      const bar=(t,v,mx,c)=>`<div class="br"><span>${t}</span><i><b style="width:${clamp(v/mx*100,6,100)}%;background:${c}"></b></i></div>`;
      $('#pbars',sum).innerHTML=bar('活動量',m.move*.55+m.play*.45,2.2,'#7F8CD8')+bar('休息',m.rest,2,'#8FD3B8')+bar('玩耍',m.play,2.4,'#F5909F')+bar('話量',1/m.talk,3,'#F6C65B')};
    const sl=el('<div class="ed-card"></div>'),sls={};
    SLIDERS.forEach(s=>{const r=UI.ends(s,ch.data.pers.sl[s.k],v=>{this.set(x=>{x.pers.sl[s.k]=v});paint()});sls[s.k]=r;sl.append(r)});
    b.append(UI.h('個性滑桿'),sl);
    const tp=UI.chips(TEMPLATES.map(t=>({v:t.id,t:t.t,em:ocsPersonaIcon(t.id)})),'',v=>{const t=TEMPLATES.find(x=>x.id===v);if(!t)return;buzz(10);
      this.set(x=>{x.pers.sl=Object.assign({},t.sl);x.pers.traits=[...new Set([...x.pers.traits.filter(id=>!TRAITS.some(q=>q.id===id)),...t.traits])]});
      SLIDERS.forEach(s=>sls[s.k].set(t.sl[s.k]));paintTraits();paint();$$('.chip',tp).forEach(c=>c.classList.remove('on'))});
    b.append(el('<div class="ed-h">快速套用範本</div>'),tp);
    b.append(UI.h('性格特質（可多選，也能自訂）'));
    const grid=el('<div class="pgrid"></div>');b.append(grid);
    const paintTraits=()=>{grid.innerHTML='';const d=ch.data,on=d.pers.traits;
      [...TRAITS,...d.pers.custom.map(c=>Persona.ctrait(c))].forEach(t=>{
        const x=el(`<button class="pc ${on.includes(t.id)?'on':''}"><span class="em">${ocsPersonaIcon(t.id)}</span><span class="tx"><b>${esc(t.t)}</b><small>${esc(t.d)}</small></span></button>`);
        x.onclick=()=>{buzz(8);this.set(q=>{const i=q.pers.traits.indexOf(t.id);i>=0?q.pers.traits.splice(i,1):q.pers.traits.length<8?q.pers.traits.push(t.id):toast('特質最多 8 個','info')});paintTraits();paint()};
        if(t.custom){let T=0;const pressStart=()=>{T=setTimeout(()=>{T=-1;this.customTrait(t.id,()=>{paintTraits();paint()})},520)};x.addEventListener('pointerdown',pressStart);['pointerup','pointerleave','pointercancel'].forEach(n=>x.addEventListener(n,()=>clearTimeout(T)));x.addEventListener('click',e=>{if(T===-1){e.stopImmediatePropagation();T=0}},true)}
        grid.append(x)});
      const add=el(`<button class="pc add"><span class="em">＋</span><span class="tx"><b>自訂特質</b><small>長按自訂特質可編輯</small></span></button>`);add.onclick=()=>{buzz(8);this.customTrait(null,()=>{paintTraits();paint()})};grid.append(add)};
    paintTraits();paint();
    b.append(UI.h('實際影響'),el(`<div class="ed-note">${ic('sparkle')}<span>這些設定會即時改變牠在首頁的行動頻率、休息與玩耍傾向、說話頻率與口吻。上方預覽小窗也會立刻反映。</span></div>`));
    b.prepend(sum);return b},
  customTrait(id,done){
    const ch=this.ch,ex=id&&ch.data.pers.custom.find(c=>c.id===id);
    const st=ex?JSON.parse(JSON.stringify(ex)):{id:uid('t'),name:'',em:'✨',tend:[],bh:[],say:[]};
    const EM=['✨','🌟','🍀','🎵','🐾','🌈','💭','🧸','🎀','⚡','🍓','🔮'];
    const s=openSheet(`<div class="sh-body"><div class="sh-title">${ex?'編輯':'自訂'}特質</div>
      <div class="fld"><span>名稱</span><input class="inp" id="ctN" maxlength="8" placeholder="例：愛收集閃亮物"></div>
      <div class="fld"><span>圖示</span><div id="ctE"></div></div>
      <div class="fld"><span>性格傾向（最多 3 項）</span><div id="ctT" class="chips wrap"></div></div>
      <div class="fld"><span>行為傾向</span><div id="ctB" class="chips wrap"></div></div>
      <div class="fld"><span>特質台詞（選填，一行一句）</span><textarea class="inp ta" id="ctS" rows="3" maxlength="200" placeholder="牠有這個特質時會偶爾說的話"></textarea></div>
      <div class="pv-cta">${ex?`<button class="btn danger icon" id="ctD" aria-label="刪除">${ic('trash',20)}</button>`:''}<button class="btn primary grow" id="ctOk">完成</button></div></div>`,{cls:'tall'});
    const E=s.el;$('#ctN',E).value=st.name;$('#ctS',E).value=st.say.join('\n');
    $('#ctE',E).append(UI.chips(EM.map(t=>({v:t,t,req:1})),st.em,v=>{if(v)st.em=v}));
    const tt=$('#ctT',E);TEND.forEach(t=>{const b=el(`<button class="chip ${st.tend.includes(t.id)?'on':''}">${t.t}</button>`);b.onclick=()=>{buzz(6);const i=st.tend.indexOf(t.id);if(i>=0)st.tend.splice(i,1);else{const opp=t.id.endsWith('+')?t.id.slice(0,-1)+'-':t.id.slice(0,-1)+'+';st.tend=st.tend.filter(x=>x!==opp);if(st.tend.length>=3){toast('最多 3 項','info');return}st.tend.push(t.id)}$$('.chip',tt).forEach((c,k)=>c.classList.toggle('on',st.tend.includes(TEND[k].id)))};tt.append(b)});
    const bb=$('#ctB',E);BHV.forEach(t=>{const b=el(`<button class="chip ${st.bh.includes(t.id)?'on':''}">${t.t}</button>`);b.onclick=()=>{buzz(6);const i=st.bh.indexOf(t.id);if(i>=0)st.bh.splice(i,1);else{if(st.bh.length>=2){toast('最多 2 項','info');return}st.bh.push(t.id)}b.classList.toggle('on')};bb.append(b)});
    $('#ctOk',E).onclick=()=>{const n=$('#ctN',E).value.trim();if(!n){toast('請替特質取個名字','info');return}
      st.name=n.slice(0,8);st.say=$('#ctS',E).value.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,6);
      this.set(d=>{const i=d.pers.custom.findIndex(c=>c.id===st.id);if(i>=0)d.pers.custom[i]=st;else{d.pers.custom.push(st);if(d.pers.traits.length<8)d.pers.traits.push(st.id)}});s.close();done&&done()};
    const dl=$('#ctD',E);if(dl)dl.onclick=()=>{this.set(d=>{d.pers.custom=d.pers.custom.filter(c=>c.id!==st.id);d.pers.traits=d.pers.traits.filter(x=>x!==st.id)});s.close();done&&done()}},
  /* —— 說話 —— */
  t_talk(){const ch=this.ch,d=ch.data,b=el('<div></div>'),S=k=>v=>this.set(x=>{x.speech[k]=v});
    const test=el(`<div class="ed-test"><button class="btn primary" id="tkTry">${ic('chat',20)}聽聽看</button><p id="tkOut">按下按鈕，看看口吻改變後的樣子。</p></div>`);
    $('#tkTry',test).onclick=()=>{buzz(8);const t=Persona.line(ch,pick(['idle','idle','pet']));$('#tkOut',test).textContent='「'+t+'」';this.stage.say(t)};
    b.append(test);
    const a=UI.card();
    const r=el('<div class="two"></div>');
    r.append(UI.field('自稱',UI.input(d.speech.self,S('self'),{max:8,ph:'例：本小姐、我、咱'})),UI.field('稱呼你',UI.input(d.speech.call,S('call'),{max:8,ph:'例：主人、你'})));
    a.append(r,UI.field('口頭禪',UI.input(d.speech.catch,S('catch'),{max:60,ph:'可用「、」分隔多句，偶爾會說出來'}),'偶爾出現在句首'),
      UI.field('口癖（語尾）',UI.input(d.speech.tic,S('tic'),{max:8,ph:'例：喵、的說、nya'}),'常接在句尾'),
      UI.field('語氣',UI.chips(TONES,d.speech.tone,v=>this.set(x=>{x.speech.tone=v}))));
    const fr=mkRange('說話頻率',0,100,1,d.speech.freq,v=>v<30?'很安靜':v>70?'很愛說':'普通',v=>this.set(x=>{x.speech.freq=v}));a.append(fr);
    b.append(a);
    b.append(UI.h('自訂台詞'));
    const lc=UI.card(),kinds=LINE_KINDS;let cur=this._lk||'idle';const holder=el('<div></div>');
    const mode=mkSeg([{v:'mix',t:'與系統台詞混合'},{v:'override',t:'只用我的台詞'}],d.linesMode,v=>this.set(x=>{x.linesMode=v}));
    const paint=()=>{holder.innerHTML='';const kc=UI.chips(kinds.map(([v,t])=>({v,t,req:1})),cur,v=>{if(v){cur=this._lk=v;paint()}});holder.append(kc);
      const hint={idle:'閒著時偶爾說的話',pet:'被撫摸時',wake:'被叫醒時',drop:'被抱起或放下時',greet:'每次進入首頁的登場問候（會取代預設問候）',call:'按下「呼喚」時'}[cur];
      holder.append(el(`<div class="ed-hint sm">${hint}。自訂句子會原樣顯示，不會被口癖改寫。</div>`));
      const list=ch.data.lines[cur],box=el('<div class="lns"></div>');
      list.forEach((t,i)=>{const row=el(`<div class="ln"><span>${esc(t)}</span><button aria-label="刪除">${ic('x',16)}</button></div>`);$('button',row).onclick=()=>{buzz(6);this.set(x=>{x.lines[cur].splice(i,1)});paint()};box.append(row)});
      if(!list.length)box.append(el('<span class="ed-empty">尚未設定，會使用系統與個性台詞</span>'));holder.append(box);
      const add=el(`<div class="tgadd"><input class="inp" maxlength="80" placeholder="輸入一句台詞後按 Enter"><button class="btn ed-add" aria-label="新增">${ic('plus',20)}</button></div>`),inp=$('input',add);
      const go=()=>{const v=inp.value.trim();if(!v)return;if(list.length>=40){toast('這一類最多 40 句','info');return}this.set(x=>{x.lines[cur].push(v.slice(0,80))});paint();setTimeout(()=>{const i=$('.tgadd input',holder);i&&i.focus()},0)};
      $('button',add).onclick=go;inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go()}});holder.append(add);
      const tr=el(`<button class="btn wide ed-try">${ic('chat',20)}試說一句</button>`);tr.onclick=()=>{buzz(8);const t=Persona.line(ch,cur==='greet'||cur==='call'?'idle':cur);const c=Persona.custom(ch,cur);this.stage.say(Persona.style(ch,c||t))};holder.append(tr)};
    lc.append(UI.field('台詞模式',mode),holder);b.append(lc);paint();
    return b},
  /* —— 自訂欄位 —— */
  t_more(){const ch=this.ch,b=el('<div></div>');
    b.append(el('<div class="ed-hint">想記什麼都可以：血型、星座、職業、世界觀、小祕密…自己決定欄位名稱。</div>'));
    const card=UI.card(),list=el('<div class="kvs"></div>');
    const paint=()=>{list.innerHTML='';ch.data.fields.forEach(f=>{
      const row=el(`<div class="kv"><div class="kv-h"><input class="inp k" maxlength="16" placeholder="欄位名稱"><button class="icon-btn" aria-label="刪除欄位">${ic('trash',20)}</button></div><textarea class="inp ta" rows="1" maxlength="120" placeholder="內容"></textarea></div>`);
      const k=$('.k',row),v=$('textarea',row);k.value=f.k;v.value=f.v;
      k.oninput=()=>this.set(x=>{const q=x.fields.find(z=>z.id===f.id);if(q)q.k=k.value});v.oninput=()=>this.set(x=>{const q=x.fields.find(z=>z.id===f.id);if(q)q.v=v.value});
      $('button',row).onclick=()=>{buzz(8);this.set(x=>{x.fields=x.fields.filter(z=>z.id!==f.id)});paint()};list.append(row)});
      if(!ch.data.fields.length)list.append(el('<span class="ed-empty">還沒有自訂欄位</span>'))};
    paint();card.append(list);
    const add=(k='')=>{if(ch.data.fields.length>=30){toast('最多 30 個欄位','info');return}buzz(8);this.set(x=>{x.fields.push({id:uid('f'),k,v:''})});paint();const ks=$$('.kv .k',list);const l=ks[ks.length-1];l&&l.focus()};
    const ab=el(`<button class="btn wide">${ic('plus',20)}新增欄位</button>`);ab.onclick=()=>add();card.append(ab);
    const sg=el('<div class="chips wrap sugg"></div>');['血型','星座','職業','所屬','弱點','愛用物','座右銘','世界觀'].forEach(t=>{const c=el(`<button class="chip mini">+ ${t}</button>`);c.onclick=()=>add(t);sg.append(c)});card.append(sg);
    b.append(card);return b},
  /* —— 素材 —— */
  t_asset(){const ch=this.ch,b=el('<div></div>');if(ch.kind==='custom')b.append(AnimUI.entry(ch));
    if(ch.kind==='demo'){b.append(UI.card(el(`<div class="as-t"><b>示範角色使用內建造型</b><small>示範角色無法更換素材。複製一份成為自己的角色，就能上傳圖片、管理素材。</small></div>`),(()=>{const x=el(`<button class="btn primary wide">${ic('copy',20)}複製成我的角色</button>`);x.onclick=async()=>{buzz(8);const n=await Chars.duplicate(ch.id);afterChange();toast(`已複製為「${n.name}」`,'check');this.close();setTimeout(()=>this.open(n.id,'asset'),420)};return x})()));return b}
    const m=el(`<div class="ed-card as-main"><div class="as-pv"><div class="art-box">${thumbHTML(ch)}</div></div><div class="as-t"><b>主圖（待機）</b><small>${ch.url?`匯入圖片・${ch.w}×${ch.h}`:'目前使用內建造型'}</small></div></div>`);
    const row=el('<div class="pv-cta"></div>');
    const up=el(`<button class="btn primary grow">${ic('upload',20)}${ch.url?'更換圖片':'上傳圖片'}</button>`);up.onclick=()=>this.pickAsset('main');row.append(up);
    if(ch.kind==='custom'&&ch.url){const rm=el(`<button class="btn grow">改回內建造型</button>`);rm.onclick=async()=>{if(await confirmSheet({title:'移除主圖？',msg:'會改用內建造型，原圖片將從此裝置移除。可先用「匯出角色包」備份。',ok:'移除'})){await Chars.setMain(ch,null);this.go('asset',true);refreshViews(ch,true);Ed.stage.setChar(ch)}};row.append(rm)}
    m.append(row);b.append(m);
    b.append(el(`<div class="ed-note">${ic('info')}<span>以下是為「多方向、動作、表情、服裝配件」預留的素材欄位。現在可先存放圖片，動畫與切換功能會在後續階段接上。</span></div>`));
    SLOTS.forEach(g=>{b.append(UI.h(g.t));const grid=el('<div class="slots"></div>');
      g.items.forEach(([key,name])=>{const a=ch.assets&&ch.assets[key];
        const t=el(`<button class="slot ${a?'has':''}"><span class="sp">${a?`<img src="${a.url}" alt="">`:ic('plus')}</span><small>${name}</small></button>`);
        t.onclick=()=>{buzz(6);a?this.slotSheet(key,name):this.pickAsset(key)};grid.append(t)});b.append(grid)});
    b.append(el(`<div class="ed-note">${ic('sparkle')}<span>素材皆保存在此裝置的本機資料庫，可隨「匯出角色包／完整備份」一併備份。</span></div>`));
    return b},
  pickAsset(slot){
    let i=$('#assetIn');if(!i){i=el('<input type="file" id="assetIn" accept="image/*" style="display:none">');document.body.append(i)}
    i.onchange=async()=>{const f=i.files[0];i.value='';if(!f||!/^image\//.test(f.type)){f&&toast('不支援的檔案格式','info');return}
      try{const ch=this.ch,{blob,w,h}=await processImage(f);if(slot==='main'){await Chars.setMain(ch,{blob,w,h});toast('已更換主圖','upload');refreshViews(ch,true)}
        else{await Chars.setAsset(ch,slot,{blob,w,h});toast('已加入素材','upload')}
        this.saved();this.go('asset',true)}catch(e){toast('這張圖片無法讀取','info')}};i.click()},
  slotSheet(key,name){const ch=this.ch,a=ch.assets[key];
    const s=openSheet(`<div class="sh-body"><div class="sh-title">${esc(name)}</div><div class="as-big"><img src="${a.url}" alt=""></div><p class="ed-hint sm">${a.w}×${a.h}・尚未套用到動畫，已為後續階段保存。</p><div class="pv-cta"><button class="btn danger icon" id="asD" aria-label="刪除">${ic('trash',20)}</button><button class="btn primary grow" id="asR">${ic('upload',20)}替換</button></div></div>`);
    $('#asR',s.el).onclick=()=>{s.close();this.pickAsset(key)};
    $('#asD',s.el).onclick=async()=>{await Chars.delAsset(ch,key);s.close();this.go('asset',true);toast('已刪除素材','trash')}},
  menu(){const ch=this.ch,demo=ch.kind==='demo';
    const s=openSheet(`<div class="sh-body"><div class="sh-title">${esc(ch.name)}</div>
      <button class="srow" data-k="dup"><span class="c ns-ic">${ic('copy')}</span><span class="t"><b>複製角色</b><small>連同資料與素材一起複製</small></span></button>
      <button class="srow" data-k="exp"><span class="c ns-ic">${ic('download')}</span><span class="t"><b>匯出角色包</b><small>含角色圖片、動畫、影格，可於其他裝置匯入</small></span></button>
      <button class="srow" data-k="rst"><span class="c ns-ic">${ic('reset')}</span><span class="t"><b>重設個性與說話</b><small>恢復預設，保留基本資料</small></span></button>
      ${demo?'':`<button class="srow dng" data-k="del"><span class="c ns-ic">${ic('trash')}</span><span class="t"><b>刪除角色</b><small>素材會從此裝置移除</small></span></button>`}</div>`);
    s.el.addEventListener('click',async e=>{const b=e.target.closest('[data-k]');if(!b)return;const k=b.dataset.k;buzz(8);s.close();
      if(k==='dup'){const n=await Chars.duplicate(ch.id);afterChange();toast(`已複製為「${n.name}」`,'check');setTimeout(()=>{this.close();setTimeout(()=>this.open(n.id,this.tab),420)},200)}
      else if(k==='exp')Backup.exportOne(ch);
      else if(k==='rst'){if(await confirmSheet({title:'重設個性與說話？',msg:'滑桿、特質、口頭禪與自訂台詞會恢復預設。',ok:'重設'})){const keep=ch.data,nd=Persona.norm(demo?DEMO_DATA[ch.id]:{});['nick','birthday','age','gender','pronoun','species','height','tagline','bio','story','interests','likes','dislikes','habits','fields'].forEach(f=>nd[f]=keep[f]);
        this.set(x=>{x.pers=nd.pers;x.speech=nd.speech;x.lines=nd.lines;x.linesMode='mix'});this.go(this.tab,true)}}
      else if(k==='del'){if(await confirmSheet({title:`刪除「${ch.name}」？`,msg:'資料與素材會從此裝置移除，無法復原。建議先匯出角色包備份。',ok:'刪除'})){this.close();await Chars.remove(ch.id);afterChange();toast('已刪除角色','trash')}}})}
};

/* ---- 以上為 2.0／2.1 模組 ---- */

/* ==========================================================
   2.2 素材與動畫系統（執行期）
   · 獨立 IndexedDB「oc-shimeji-anim」：frames（影格素材）、anims（動畫設定），以角色 uid 隔離
   · Player：共用的影格播放器（世界內角色與工作室預覽同一套）
   · 以 Behaviors 的行為 id／Stage 的 state 解析動畫，缺少時依 FALL 退回基礎動畫，再退回原本造型
   ========================================================== */
const ANIM_VER=1;
const nid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const TRIGS=[['idle','待機','base'],['breathe','呼吸','base'],['blink','眨眼','base'],['sit','坐下','base'],['sleep','睡覺','base'],['wake','醒來','base'],['stretch','伸懶腰','base'],
 ['walk','行走','move'],['run','奔跑','move'],['jump','跳躍','move'],['land','落地','move'],['fall','落下','move'],
 ['happy','開心','emotion'],['sad','難過','emotion'],['angry','生氣','emotion'],['surprise','驚訝','emotion'],['shy','害羞','emotion'],
 ['eat','進食','interact'],['play','玩耍','interact'],['pet','撫摸反應','interact'],['drag','被拖曳','interact']];
const ACATS=[['base','基本'],['move','移動'],['emotion','情緒'],['interact','互動'],['custom','自訂']];
const BEH2T={stand:'idle',look:'idle',stroll:'walk',shelter:'walk',visit:'walk',dash:'run',sit:'sit',rest:'sit',doze:'sleep',sleep:'sleep',startle:'surprise',rise:'wake',stretch:'stretch',wiggle:'happy',bounce:'happy',hop:'jump'};
const ST2T={idle:'idle',walk:'walk',sleep:'sleep',crouch:'jump',hop:'jump',fall:'fall',happy:'pet',held:'drag'};
const FALL={run:['walk','idle'],walk:['idle'],jump:['idle'],land:['idle'],fall:['jump','idle'],sit:['idle'],sleep:['sit','idle'],wake:['idle'],stretch:['idle'],breathe:['idle'],blink:['idle'],happy:['idle'],sad:['idle'],angry:['idle'],surprise:['happy','idle'],shy:['idle'],eat:['idle'],play:['happy','idle'],pet:['happy','idle'],drag:['fall','idle']};
const MOVE=new Set(['walk','run']);
const PRIO={drag:5,fall:4,pet:4,land:3,jump:3,surprise:3,wake:2,happy:2,eat:2,play:2};
const ONCE=new Set(['jump','land','wake','surprise','stretch','pet']);
const AFACE=[['any','通用'],['right','朝右'],['left','朝左'],['front','正面'],['back','背面']];
const PRESETS=[['none','靜止'],['breathe','呼吸'],['sway','輕晃'],['bounce','彈跳'],['pulse','縮放'],['tilt','搖擺']];
const PDEF={idle:'breathe',walk:'bounce',run:'bounce',jump:'bounce',sit:'breathe',sleep:'breathe',wake:'pulse',happy:'bounce',sad:'sway',angry:'tilt',surprise:'pulse',shy:'sway',eat:'bounce',play:'bounce',pet:'pulse',drag:'tilt'};
const DEFSPD={idle:6,walk:10,run:15,jump:8,sleep:4,sad:5,sit:5,shy:6};
const ACTS=[['idle','待機','🌿'],['walk','走路','👣'],['run','跑步','💨'],['jump','跳躍','🫧'],['sit','坐下','🪑'],['sleep','睡覺','💤'],['wake','醒來','☀️'],['happy','開心','😊'],['sad','難過','💧'],['angry','生氣','💢'],['surprise','驚訝','❗'],['shy','害羞','🌸'],['eat','吃東西','🍙'],['play','玩耍','🎈'],['pet','被摸摸','💗'],['drag','被拎起','🎀']];
const normAnim=a=>({id:a.id||nid('an_'),cid:a.cid,name:String(a.name||'未命名動畫').slice(0,40),cat:ACATS.some(c=>c[0]===a.cat)?a.cat:'custom',trig:String(a.trig||'custom').slice(0,40),
  face:AFACE.some(f=>f[0]===a.face)?a.face:'any',prio:clamp(Math.round(+a.prio||0),0,9),mode:['loop','once','pingpong'].includes(a.mode)?a.mode:'loop',fps:clamp(+a.fps||8,1,60),preset:PRESETS.some(p=>p[0]===a.preset)?a.preset:'none',
  fx:clamp(a.fx==null?50:+a.fx,0,100),fy:clamp(+a.fy||0,-30,60),
  frames:(Array.isArray(a.frames)?a.frames:[]).filter(f=>f&&typeof f.f==='string'&&f.f).slice(0,5000).map(f=>({f:f.f,d:clamp(+f.d||1,.25,20),ox:+f.ox||0,oy:+f.oy||0,r:+f.r||0,sx:f.sx==null?1:+f.sx,sy:f.sy==null?1:+f.sy,o:f.o==null?1:clamp(+f.o,0,1),fl:f.fl?1:0})),
  ev:(Array.isArray(a.ev)?a.ev:[]).filter(e=>e&&e.t).slice(0,1000).map(e=>({i:Math.max(0,+e.i||0),t:String(e.t),v:String(e.v||'')})),ver:ANIM_VER,created:a.created||Date.now(),mod:a.mod||Date.now()});
const mkAnim=(cid,name,trig,face)=>{const t=TRIGS.find(x=>x[0]===trig);return normAnim({cid,name,trig,cat:t?t[2]:'custom',face,prio:PRIO[trig]||0,mode:ONCE.has(trig)?'once':'loop',fps:8})};

const AnimDB={db:null,bad:false,mem:{frames:[],anims:[]},
  open(){if(this.db)return Promise.resolve(this.db);return new Promise((res,rej)=>{try{const r=indexedDB.open('oc-shimeji-anim',1);
    r.onupgradeneeded=()=>{const d=r.result;['frames','anims'].forEach(n=>{if(!d.objectStoreNames.contains(n))d.createObjectStore(n,{keyPath:'id'}).createIndex('cid','cid')})};
    r.onsuccess=()=>{this.db=r.result;this.db.onversionchange=()=>{try{this.db.close()}catch(e){}this.db=null};res(this.db)};r.onerror=()=>rej(r.error);r.onblocked=()=>rej(new Error('blocked'))}catch(e){rej(e)}})},
  async run(st,mode,fn){const db=await this.open();return new Promise((res,rej)=>{const t=db.transaction(st,mode),q=fn(t.objectStore(st));t.oncomplete=()=>res(q&&q.result);t.onerror=t.onabort=()=>rej(t.error)})},
  async of(st,cid){if(!this.bad){try{return await this.run(st,'readonly',s=>s.index('cid').getAll(cid))||[]}catch(e){this.bad=true}}return this.mem[st].filter(r=>r.cid===cid)},
  async put(st,r){if(!this.bad){try{await this.run(st,'readwrite',s=>s.put(r));return true}catch(e){this.bad=true;toast('儲存空間無法使用，動畫暫存於記憶體','info')}}const a=this.mem[st],i=a.findIndex(x=>x.id===r.id);i>=0?a[i]=r:a.push(r);return false},
  async del(st,id){this.mem[st]=this.mem[st].filter(x=>x.id!==id);if(this.bad)return;try{await this.run(st,'readwrite',s=>s.delete(id))}catch(e){}},
  async bulk(st,rows){if(this.bad)throw new Error('此瀏覽器的永久儲存空間不可用');if(!rows.length)return;
    await this.run(st,'readwrite',s=>{rows.forEach(r=>s.put(r))})},
  async bulkDelete(st,ids){if(this.bad)throw new Error('永久儲存空間不可用');if(!ids.length)return;
    await this.run(st,'readwrite',s=>{ids.forEach(id=>s.delete(id))})},
  async delChar(cid){for(const st of['frames','anims'])for(const r of await this.of(st,cid))await this.del(st,r.id)}};

class Player{
  constructor(img){this.img=img;this.a=null;this.c=1;this.k=-1;this.hold=false;this.onEnd=null;this.fire=null;this.seq=[];this.t=0}
  set(a){this.a=a;this.t=0;this.pt=0;this.k=-1;this.done=false;this.hold=false;this.pend=0;this.seq=a.frames.map((_,i)=>i);
    if(a.mode==='pingpong')for(let i=a.frames.length-2;i>0;i--)this.seq.push(i);
    let ref=1;a.frames.forEach(f=>{const r=Anim.fr(a.cid,f.f);if(r)ref=Math.max(ref,r.w,r.h)});this.ref=ref;
    this.img.style.display=this.seq.length?'':'none';if(this.seq.length)this.step(0,true)}
  reset(){if(this.a)this.set(this.a)}
  tot(){const a=this.a,b=1000/clamp(a.fps,1,60);let s=0;for(const i of this.seq)s+=b*a.frames[i].d;return a.mode==='once'&&a.preset!=='none'?Math.max(s,11200/clamp(a.fps,1,60)):s}
  px(a){const p=a.preset;if(!p||p==='none')return'';const t=this.pt||0,T=Math.PI*2;
    if(p==='breathe'){const s=Math.sin(T*t/3.6);return` scale(${1-.012*s},${1+.025*s})`}
    if(p==='sway')return` rotate(${3*Math.sin(T*t/2.4)}deg)`;if(p==='tilt')return` rotate(${7*Math.sin(T*t/1.2)}deg)`;
    if(p==='pulse')return` scale(${1+.04*Math.sin(T*t/1.6)})`;
    if(p==='bounce'){const k=Math.abs(Math.sin(Math.PI*t/.55));return` translate(0,${-7*k}%) scale(${1+.02*(1-k)},${1-.035*(1-k)})`}return''}
  step(dt,first){const a=this.a;if(!a||!this.seq.length||(this.hold&&!first))return;
    const b=1000/clamp(a.fps,1,60),tot=this.tot()||1;this.t+=dt*1000;this.pt=(this.pt||0)+dt*clamp(a.fps/8,.25,3);let t=this.t;
    if(a.mode==='once'&&t>=tot){t=tot-1;this.t=tot;if(!this.done){this.done=true;this.onEnd&&this.onEnd()}}else t%=tot;
    let acc=0,k=0;for(;k<this.seq.length;k++){acc+=b*a.frames[this.seq[k]].d;if(t<acc)break}
    k=Math.min(k,this.seq.length-1);if(k!==this.k){this.k=k;this.show(this.seq[k],true)}else if(a.preset!=='none')this.show(this.seq[k],false)}
  show(i,ev){const a=this.a,f=a&&a.frames[i];if(!f)return;this.cur=i;const r=Anim.fr(a.cid,f.f),im=this.img;
    if(!r){im.style.opacity=0;im.style.display='none';return}im.style.display='';const u=Anim.url(r);if(im._u!==u){im._u=u;im.src=u}
    im.style.width=(r.w/this.ref*100)+'%';im.style.left=a.fx+'%';im.style.bottom=a.fy+'%';im.style.opacity=f.o;
    im.style.transform=`translate(-${a.fx}%,0) translate(${f.ox}%,${-f.oy}%) rotate(${f.r}deg) scale(${f.sx*(f.fl?-1:1)*this.c},${f.sy})${this.px(a)}`;
    if(ev&&this.fire)a.ev.forEach(e=>{if(e.i===i)this.fire(e)})}}

const Anim={libs:{},libP:{},urls:new Map(),stages:new Set(),listeners:[],
  load(cid){return this.libP[cid]||(this.libP[cid]=(async()=>{const[fr,an]=await Promise.all([AnimDB.of('frames',cid),AnimDB.of('anims',cid)]);
    const L={cid,frames:new Map(),anims:an.map(normAnim)};fr.forEach(r=>L.frames.set(r.id,r));return this.libs[cid]=L})().catch(e=>{delete this.libP[cid];throw e}))},
  fr(cid,fid){const L=this.libs[cid];return L&&L.frames.get(fid)},
  url(r){let u=this.urls.get(r.id);if(!u){u=URL.createObjectURL(r.blob);this.urls.set(r.id,u)}return u},
  drop(id){const u=this.urls.get(id);if(u){URL.revokeObjectURL(u);this.urls.delete(id)}},
  warm(a){a.frames.forEach(f=>{const r=this.fr(a.cid,f.f);if(r&&!r._w){r._w=1;const i=new Image();i.src=this.url(r);i.decode&&i.decode().catch(()=>{})}})},
  ov(s){if(!s._ov){const i=document.createElement('img');i.className='uanim';i.alt='';i.draggable=false;i.decoding='async';s.adj.append(i);s._ov=i}return s._ov},
  resolve(s,L){const b=s.B,st=s.state,id=b&&b.id;
    const t=['held','fall','hop','crouch','happy'].includes(st)?ST2T[st]:(BEH2T[id]||ST2T[st]||'idle'),chain=[];
    if(id&&!['held','fall'].includes(st))chain.push(id);chain.push(t,...(FALL[t]||[]));
    for(const k of chain){const c=L.anims.filter(a=>a.trig===k&&a.frames.length);if(!c.length)continue;
      const sc=a=>{const f=a.face;if(MOVE.has(k))return f===(s.dir>0?'right':'left')?3:f==='any'?2:(f==='right'||f==='left')?1:0;return f==='any'?3:f==='front'?2:1};
      const m=Math.max(...c.map(sc)),best=c.filter(a=>sc(a)===m);return{a:best[Math.floor(Math.random()*best.length)],k}}
    return null},
  sync(s,force){const ch=s.ch;if(!ch||!ch.uid)return;const L=this.libs[ch.uid];if(!L)return;const r=this.resolve(s,L),p=s._pl;
    if(!r){if(p)this.stop(s);return}
    const key=s.state+'|'+(s.B?s.B.id:'');
    if(p&&p.a===r.a&&!(p.done&&p.key!==key)){p.key=key;return}
    if(p&&p.a.mode==='once'&&!p.done&&!force&&r.a.prio<=p.a.prio){p.pend=1;return}
    if(!p){const pl=s._pl=new Player(this.ov(s));pl.onEnd=()=>{if(pl.pend){pl.pend=0;this.sync(s,true)}};
      pl.fire=e=>this.emit(s,e)}
    s._pl.key=key;this.warm(r.a);s.adj.classList.add('uplay');s._ov.style.display='';s._pl.set(r.a);try{s._ov.animate([{opacity:.35},{opacity:1}],{duration:160})}catch(e){}},
  stop(s){if(s._pl){s._pl=null}if(s._ov)s._ov.style.display='none';s.adj.classList.remove('uplay')},
  step(s,dt){const p=s._pl;if(!p||!p.a)return;const a=p.a,n=Math.sign(s.dir||1)*s.flipBase;let c=1;
    if(a.face==='front'||a.face==='back')c=n;else if(a.face==='left'||a.face==='right')c=Math.sign(s.dir||1)*(a.face==='right'?1:-1)*n;
    if(c!==p.c){p.c=c;p.show(p.cur)}p.step(dt)},
  refresh(cid){this.stages.forEach(s=>{if(!s.ch||s.ch.uid!==cid)return;const L=this.libs[cid];if(s._pl&&L&&!L.anims.includes(s._pl.a))this.stop(s);this.sync(s,true);if(s._pl)s._pl.reset()})},
  /* 事件：動畫影格可觸發表情、音效、粒子與自訂事件；其他系統以 Anim.on(fn) 訂閱 */
  on(fn){this.listeners.push(fn)},
  emit(s,e){try{if(e.t==='fx'&&s&&s.hearts)s.hearts(2);else if(e.t==='squash'&&s&&s.squash)s.squash(.16);else if(e.t==='snd')this.beep(e.v);
    this.listeners.forEach(f=>f(s,e));document.dispatchEvent(new CustomEvent('oc-anim-event',{detail:{stage:s,type:e.t,value:e.v}}))}catch(x){}},
  beep(k){if(Cfg.v.sound===false)return;try{const C=this.ac||(this.ac=new(window.AudioContext||window.webkitAudioContext)()),o=C.createOscillator(),g=C.createGain(),f={pop:[620,880],chime:[880,1320],boop:[300,200]}[k]||[520,700];
    o.frequency.setValueAtTime(f[0],C.currentTime);o.frequency.exponentialRampToValueAtTime(f[1],C.currentTime+.12);g.gain.setValueAtTime(.08,C.currentTime);g.gain.exponentialRampToValueAtTime(.001,C.currentTime+.2);o.connect(g);g.connect(C.destination);o.start();o.stop(C.currentTime+.22)}catch(e){}}};

/* —— 接上 Stage／Chars（不改動原有行為引擎）—— */
{const sS=Stage.prototype.setState;Stage.prototype.setState=function(a,b){sS.call(this,a,b);Anim.sync(this)};
 const sC=Stage.prototype.setChar;Stage.prototype.setChar=function(ch,i){Anim.stop(this);this._ov=null;sC.call(this,ch,i);Anim.stages.add(this);
   if(ch&&ch.uid)Anim.load(ch.uid).then(()=>Anim.sync(this,true)).catch(()=>{})};
 const up=Stage.prototype.update;Stage.prototype.update=function(dt){up.call(this,dt);if(this._pl)Anim.step(this,dt)};
 const de=Stage.prototype.destroy;Stage.prototype.destroy=function(){Anim.stages.delete(this);de.call(this)};
 const rm=Chars.remove;Chars.remove=async function(id){const c=this.byId(id),u=c&&c.uid;const r=await rm.call(this,id);if(u){await AnimDB.delChar(u);delete Anim.libs[u];delete Anim.libP[u]}return r}}

/* ==========================================================
   動畫工作室 UI（素材庫・動畫清單・時間軸・屬性・匯入匯出）
   ========================================================== */
const pickF=(accept,multi)=>new Promise(res=>{
  const i=document.createElement('input');i.type='file';i.accept=accept;i.multiple=!!multi;
  i.style.cssText='position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0';document.body.append(i);
  let done=false,focusTimer=0,limit=0;
  const finish=()=>{if(done)return;done=true;clearTimeout(focusTimer);clearTimeout(limit);window.removeEventListener('focus',onFocus);i.remove();res(Array.from(i.files||[]))};
  const onFocus=()=>{clearTimeout(focusTimer);focusTimer=setTimeout(finish,800)};
  limit=setTimeout(finish,45000);i.addEventListener('change',finish,{once:true});i.addEventListener('cancel',finish,{once:true});
  window.addEventListener('focus',onFocus);
  try{i.click()}catch(e){finish()}
});
async function sniff(f){try{const h=new Uint8Array(await f.slice(0,12).arrayBuffer());let t='';
  if(h[0]===0x89&&h[1]===0x50)t='image/png';else if(h[0]===0xFF&&h[1]===0xD8)t='image/jpeg';else if(h[0]===0x47&&h[1]===0x49)t='image/gif';else if(h[0]===0x52&&h[1]===0x49&&h[8]===0x57)t='image/webp';else if(h[0]===0x42&&h[1]===0x4D)t='image/bmp';
  if(!t)return f.type&&f.type.startsWith('image/')?f:null;return f.type===t?f:new Blob([f],{type:t})}catch(e){return null}}
const cvs=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const toBlob=(c,t='image/png')=>new Promise((resolve,reject)=>{try{c.toBlob(b=>b&&b.size?resolve(b):reject(new Error('無法產生影像')),t)}catch(e){reject(e)}});
const loadBmp=async b=>{try{return await createImageBitmap(b)}catch(e){const u=URL.createObjectURL(b);try{return await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=u})}finally{setTimeout(()=>URL.revokeObjectURL(u),3000)}}};
const bw=b=>b.width||b.naturalWidth,bh=b=>b.height||b.naturalHeight;
async function fitBlob(b,max){const im=await loadBmp(b),w=bw(im),h=bh(im);
  if(!w||!h||w*h>120000000)throw new Error('圖片尺寸無效或過大');
  try{if(Math.max(w,h)<=max)return{blob:b,w,h,scaled:false};
    const sc=max/Math.max(w,h),c=cvs(Math.max(1,Math.round(w*sc)),Math.max(1,Math.round(h*sc)));
    c.getContext('2d').drawImage(im,0,0,c.width,c.height);return{blob:await toBlob(c),w:c.width,h:c.height,scaled:true}}
  finally{if(im.close)im.close()}}
async function decodeAnimImg(file){if(!window.ImageDecoder||!/gif|webp|png/.test(file.type))return null;
  let d;try{d=new ImageDecoder({data:await file.arrayBuffer(),type:file.type});await d.tracks.ready;
    const n=d.tracks.selectedTrack.frameCount;if(n<2)return null;const out=[];
    for(let i=0;i<Math.min(n,120);i++){const {image}=await d.decode({frameIndex:i});try{const c=cvs(image.displayWidth,image.displayHeight);c.getContext('2d').drawImage(image,0,0);
      out.push({blob:await toBlob(c),ms:Math.max(20,(image.duration||100000)/1000)})}finally{image.close()}}return out
  }catch(e){return null}finally{if(d)try{d.close()}catch(e){}}}
function autoGrid(bmp){const W=bw(bmp),H=bh(bmp),k=Math.min(1,1024/Math.max(W,H)),c=cvs(Math.max(1,Math.round(W*k)),Math.max(1,Math.round(H*k))),x=c.getContext('2d',{willReadFrequently:true});x.drawImage(bmp,0,0,c.width,c.height);
  let d;try{d=x.getImageData(0,0,c.width,c.height).data}catch(e){return{c:1,r:1}}
  const col=new Uint8Array(c.width),row=new Uint8Array(c.height);for(let j=0;j<c.height;j++)for(let i=0;i<c.width;i++)if(d[(j*c.width+i)*4+3]>16){col[i]=1;row[j]=1}
  const runs=a=>{let n=0,p=0;for(const v of a){if(v&&!p)n++;p=v}return n};let cn=runs(col),rn=runs(row);
  if(cn<2&&W/H>=1.8)cn=Math.round(W/H);if(rn<2&&H/W>=1.8)rn=Math.round(H/W);return{c:clamp(cn||1,1,64),r:clamp(rn||1,1,64)}}
async function sliceSheet(bmp,cols,rows,skip){const W=bw(bmp),H=bh(bmp),cw=Math.floor(W/cols),chh=Math.floor(H/rows),out=[];if(cw<1||chh<1)throw new Error('格數超過圖片尺寸');
  for(let r=0;r<rows;r++)for(let q=0;q<cols;q++){const c=cvs(cw,chh),x=c.getContext('2d',{willReadFrequently:true});x.drawImage(bmp,q*cw,r*chh,cw,chh,0,0,cw,chh);
    if(skip){const d=x.getImageData(0,0,cw,chh).data;let any=0;for(let i=3;i<d.length;i+=4)if(d[i]>8){any=1;break}if(!any)continue}out.push(await toBlob(c))}return out}
async function keyBg(blob,tol=28){const im=await loadBmp(blob),W=bw(im),H=bh(im),c=cvs(W,H),x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0);const id=x.getImageData(0,0,W,H),d=id.data;
  const ref=[0,(W-1)*4,(H-1)*W*4,((H-1)*W+W-1)*4].map(o=>[d[o],d[o+1],d[o+2]]),near=o=>ref.some(r=>Math.abs(d[o]-r[0])+Math.abs(d[o+1]-r[1])+Math.abs(d[o+2]-r[2])<=tol*3);
  const seen=new Uint8Array(W*H),st=[0,W-1,(H-1)*W,H*W-1];
  while(st.length){const p=st.pop();if(seen[p])continue;seen[p]=1;const o=p*4;if(!near(o))continue;d[o+3]=0;const x0=p%W;if(x0>0)st.push(p-1);if(x0<W-1)st.push(p+1);if(p>=W)st.push(p-W);if(p<W*(H-1))st.push(p+W)}
  x.putImageData(id,0,0);return toBlob(c)}
async function padOf(r){if(r.pb!=null)return r.pb;const im=await loadBmp(r.blob),k=Math.min(1,256/Math.max(r.w,r.h)),w=Math.max(1,Math.round(r.w*k)),h=Math.max(1,Math.round(r.h*k)),c=cvs(w,h),x=c.getContext('2d',{willReadFrequently:true});
  x.drawImage(im,0,0,w,h);const d=x.getImageData(0,0,w,h).data;let last=-1;for(let j=h-1;j>=0&&last<0;j--)for(let i=0;i<w;i++)if(d[(j*w+i)*4+3]>16){last=j;break}return r.pb=last<0?0:(h-1-last)/h}
const natCmp=(a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true});

const AnimUI={S:null,el:null,pl:null,api:null,raf:0,
  entry(ch){const b=el(`<div class="an-entry"><div><b>動畫工作室</b><small>匯入影格或 Sprite Sheet，為待機、行走、睡覺等動作製作專屬動畫，即時套用在這隻角色身上。</small></div><button class="btn primary wide">${ic('sparkle',20)}開啟動畫工作室</button></div>`);
    $('button',b).onclick=()=>this.open(ch);return b},
  get L(){return Anim.libs[this.S.ch.uid]},
  async open(ch){if(this.api)return;const L=await Anim.load(ch.uid);let adv=false;try{adv=localStorage.getItem('ocs.anim.adv')==='1'}catch(e){}
    this.S={ch,cid:ch.uid,tab:'anims',cat:'all',fi:0,cur:null,act:null,undo:[],redo:[],dead:new Set(),adv,playing:true,q:'',folder:'all',sel:new Set(),selMode:false,zoom:72};
    if(!this.el){this.el=el(`<div class="ovp" id="anim" aria-label="動畫工作室"><div class="an-top"><button class="icon-btn" data-a="close" aria-label="返回">${ic('left')}</button><h1 id="anT"></h1>
      <button class="icon-btn" data-a="undo" id="anU" aria-label="復原">${ic('reset')}</button><button class="icon-btn" data-a="redo" id="anR" aria-label="重做" style="transform:scaleX(-1)">${ic('reset')}</button><button class="chip" data-a="mode" id="anM"></button></div>
      <div class="an-prev"><div class="an-gnd"></div><div class="an-sh"></div><div class="an-box"><div class="adj" id="anBase"></div><img id="anImg" alt="" draggable="false"></div></div>
      <div class="an-ctl"><button class="btn" data-a="play" id="anP" style="min-width:56px">❚❚</button><span id="anInfo" style="flex:1;font-size:13px;color:var(--ink-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></span></div>
      <div class="an-tabs" id="anTabs"></div><div class="an-panel" id="anPanel"></div></div>`);
      $('#app').append(this.el);const p=$('#anPanel',this.el);
      this.el.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b)this.act(b.dataset.a,b.dataset,b,e)});
      p.addEventListener('input',e=>this.onInput(e));p.addEventListener('change',e=>this.onChange(e));
      this.pl=new Player($('#anImg',this.el));
      const pv=$('.an-prev',this.el);let dr=null;
      pv.addEventListener('pointerdown',e=>{const S=this.S,a=S.cur;if(!a||!a.frames.length||(S.act==null&&!S.adv))return;const im=this.pl.img.getBoundingClientRect(),bx=$('.an-box',this.el).getBoundingClientRect();
        dr={x:e.clientX,y:e.clientY,ox:a.frames[0].ox,fy:a.fy,iw:Math.max(20,im.width),bh:Math.max(20,bx.height),pre:this.snap()};pv.setPointerCapture(e.pointerId)});
      pv.addEventListener('pointermove',e=>{if(!dr)return;const a=this.S.cur;if(!a)return;const ox=clamp(dr.ox+(e.clientX-dr.x)/dr.iw*100,-100,100),fy=clamp(dr.fy-(e.clientY-dr.y)/dr.bh*100,-30,60);
        a.frames.forEach(f=>{f.ox=Math.round(ox*10)/10});a.fy=Math.round(fy*10)/10;dr.moved=1;this.pl.show(this.pl.cur)});
      const up=()=>{if(!dr)return;const d=dr;dr=null;if(d.moved){const S=this.S;S.undo.push(d.pre);if(S.undo.length>50)S.undo.shift();S.redo=[];this.persist();Anim.refresh(S.cid);this.render();this.bar()}};
      pv.addEventListener('pointerup',up);pv.addEventListener('pointercancel',up)}
    this.api={el:this.el,close:()=>this.back()};$('#anBase',this.el).innerHTML=artHTML(ch);Ov.push(this.api);this.el.classList.add('open');buzz(8);
    this.last=performance.now();const loop=t=>{this.raf=requestAnimationFrame(loop);const dt=Math.min(.05,(t-this.last)/1000);this.last=t;if(this.S&&this.S.playing)this.pl.step(dt)};this.raf=requestAnimationFrame(loop);
    this.prevSet();this.render();this.bar()},
  async close(){if(!this.api)return;cancelAnimationFrame(this.raf);Ov.remove(this.api);this.api=null;this.el.classList.remove('open');await this.gcAuto();await this.flush();Anim.refresh(this.S.cid);Gallery.render&&Gallery.render()},
  /* —— 資料保存、復原重做 —— */
  snap(){return JSON.stringify(this.L.anims)},
  restore(j){const L=this.L,S=this.S,old=new Set(L.anims.map(a=>a.id));L.anims=JSON.parse(j).map(normAnim);const now=new Set(L.anims.map(a=>a.id));
    old.forEach(i=>{if(!now.has(i))S.dead.add(i)});now.forEach(i=>S.dead.delete(i));S.cur=L.anims.find(a=>S.cur&&a.id===S.cur.id)||L.anims[0]||null;S.fi=0},
  pushU(){const S=this.S;S.undo.push(this.snap());if(S.undo.length>50)S.undo.shift();S.redo=[]},
  edit(fn){this.pushU();fn();this.touch()},
  touch(){const S=this.S;if(S.cur)S.cur.mod=Date.now();this.persist();Anim.refresh(S.cid);this.prevSet();this.render();this.bar()},
  persist(){const S=this.S;clearTimeout(S.pt);S.pt=setTimeout(()=>this.flush(),350)},
  async flush(){const S=this.S;if(!S)return;clearTimeout(S.pt);try{for(const a of this.L.anims){if(!await AnimDB.put('anims',a))throw new Error('無法持久化')}for(const id of[...S.dead]){await AnimDB.del('anims',id);S.dead.delete(id)}}catch(e){toast('自動保存失敗，請先匯出備份','info')}},
  prevSet(){const S=this.S,a=S.cur,p=this.pl,show=a&&a.frames.length&&(S.adv||S.act!=null);$('#anBase',this.el).style.display=show?'none':'';if(!show){p.a=null;p.img.style.display='none';return}p.c=1;p.set(a);S.fi=clamp(S.fi,0,a.frames.length-1);if(!S.playing){p.hold=true;p.show(S.fi)}},
  bar(){const S=this.S,a=S.cur;$('#anT',this.el).textContent=S.ch.name+'・動畫';$('#anU',this.el).disabled=!S.undo.length;$('#anR',this.el).disabled=!S.redo.length;
    $('#anM',this.el).textContent=S.adv?'簡易模式':'進階編輯';$('#anTabs',this.el).style.display=S.adv?'':'none';$('#anP',this.el).textContent=S.playing?'❚❚':'▶';
    $('#anInfo',this.el).textContent=a?`${a.name}・${a.frames.length} 影格・${a.fps} FPS`:'尚未選擇動畫';
    $('#anTabs',this.el).innerHTML=[['anims','動畫'],['tl','時間軸'],['lib','素材庫'],['prop','屬性'],['io','匯入匯出']].map(([k,n])=>`<button class="chip ${k===S.tab?'on':''}" data-a="tab" data-t="${k}">${n}</button>`).join('')},
  /* —— 互動 —— */
  act(k,d,b){const S=this.S,a=S.cur,L=this.L;buzz(5);
    const A={close:()=>this.back(),undo:()=>{if(S.undo.length){S.redo.push(this.snap());this.restore(S.undo.pop());this.touch()}},redo:()=>{if(S.redo.length){S.undo.push(this.snap());this.restore(S.redo.pop());this.touch()}},
      mode:()=>{S.adv=!S.adv;S.act=null;S.playing=true;this.pl.hold=false;if(!S.adv)S.cur=null;else if(!S.cur)S.cur=L.anims[0]||null;this.prevSet();try{localStorage.setItem('ocs.anim.adv',S.adv?'1':'0')}catch(e){}this.bar();this.render()},
      play:()=>{S.playing=!S.playing;this.pl.hold=!S.playing;if(S.playing)this.pl.step(0,true);else this.pl.show(S.fi);this.bar()},
      tab:()=>{S.tab=d.t;this.bar();this.render();$('#anPanel',this.el).scrollTop=0},
      cat:()=>{S.cat=d.c;this.render()},
      pick:()=>{S.cur=L.anims.find(x=>x.id===d.id);S.fi=0;S.tab='tl';this.prevSet();this.bar();this.render()},
      newA:()=>this.newAnim(),quick:()=>{this.edit(()=>{const n=mkAnim(S.cid,(TRIGS.find(t=>t[0]===d.t)||[0,d.t])[1],d.t);L.anims.push(n);S.cur=n;S.fi=0;S.tab='lib'});this.bar()},
      dupA:()=>{const s=L.anims.find(x=>x.id===d.id);this.edit(()=>{const n=normAnim(Object.assign(JSON.parse(JSON.stringify(s)),{id:null,name:s.name+' 副本',created:Date.now()}));L.anims.push(n);S.cur=n})},
      delA:async()=>{const s=L.anims.find(x=>x.id===d.id);if(await confirmSheet({title:'刪除動畫？',msg:`「${s.name}」會被刪除，影格素材仍保留在素材庫。可用復原找回。`,ok:'刪除'}))this.edit(()=>{L.anims=L.anims.filter(x=>x!==s);S.dead.add(s.id);if(S.cur===s)S.cur=L.anims[0]||null;S.fi=0})},
      fr:()=>{S.fi=+d.i;if(S.adv){this.pl.hold=true;S.playing=false;this.pl.show(S.fi);this.bar()}this.render()},
      mode2:()=>this.edit(()=>{a.mode=d.m}),
      fdup:()=>this.edit(()=>{a.frames.splice(S.fi+1,0,Object.assign({},a.frames[S.fi]));S.fi++}),
      fdel:()=>this.edit(()=>{a.frames.splice(S.fi,1);S.fi=clamp(S.fi,0,a.frames.length-1)}),
      fmv:()=>{const j=S.fi+ +d.v;if(j<0||j>=a.frames.length)return;this.edit(()=>{const[f]=a.frames.splice(S.fi,1);a.frames.splice(j,0,f);S.fi=j})},
      fdur:()=>this.edit(()=>{const f=a.frames[S.fi];f.d=clamp(f.d+ +d.v,.25,20)}),
      fflip:()=>this.edit(()=>{const f=a.frames[S.fi];f.fl=f.fl?0:1}),
      fall:()=>this.edit(()=>{const s=a.frames[S.fi];a.frames.forEach(f=>{Object.assign(f,{ox:s.ox,oy:s.oy,r:s.r,sx:s.sx,sy:s.sy,o:s.o})})}),
      foot:async()=>{if(!a)return;this.pushU();for(const f of a.frames){const r=Anim.fr(a.cid,f.f);if(r)f.oy=-Math.round((await padOf(r))*1000)/10}this.touch();toast('已將所有影格的腳底對齊地面','check')},
      home:()=>this.back(),qimp:()=>this.quickImport(),useMain:()=>this.useMain(),newCustom:()=>this.newCustom(),
      openAct:()=>{S.act=d.t;S.cur=d.id?L.anims.find(x=>x.id===d.id):this.actAnim(d.t);S.fi=0;S.playing=true;this.pl.hold=false;this.prevSet();this.bar();this.render();$('#anPanel',this.el).scrollTop=0},
      preset:()=>this.edit(()=>{a.preset=d.p}),
      delAct:async()=>{if(await confirmSheet({title:'移除這個動作的圖片？',msg:'角色會改用原本造型或其他基礎動作。可用復原找回。',ok:'移除'}))this.edit(()=>{L.anims=L.anims.filter(x=>x!==a);S.dead.add(a.id);S.cur=null;if(!ACTS.some(t=>t[0]===S.act))S.act=null})},
      go:()=>{S.tab='lib';this.bar();this.render()},
      addLib:()=>this.importImgs(),sheet:()=>this.importSheet(),selm:()=>{S.selMode=!S.selMode;S.sel.clear();this.render()},
      tile:()=>this.tileTap(d.id),
      batchAdd:()=>{if(!S.sel.size){toast('請先選擇素材','info');return}this.addToAnim([...S.sel]);S.sel.clear();S.selMode=false},batchDel:()=>S.sel.size?this.delFrames([...S.sel]):toast('請先選擇素材','info'),batchFolder:()=>S.sel.size?this.folderSheet([...S.sel]):toast('請先選擇素材','info'),
      selAll:()=>{this.libList().forEach(r=>S.sel.add(r.id));this.render()},
      fold:()=>{S.folder=d.f;this.render()},
      evAdd:()=>this.evSheet(),evDel:()=>this.edit(()=>{a.ev.splice(+d.i,1)}),
      exOne:()=>a?this.exportPack([a],false,a.name):toast('請先選擇要匯出的動畫','info'),exCat:()=>this.exportPack(L.anims.filter(x=>x.cat===d.c),false,'cat-'+d.c),exAll:()=>this.exportPack(L.anims,true,S.ch.name+'-全部'),
      imp:async()=>{const f=(await pickF('.json,.ocanim.json,application/json'))[0];if(f&&this.S===S){try{if(f.size>250*1024*1024)throw new Error('內容包超過 250 MB');await this.importPack(await f.text())}catch(e){toast('匯入失敗：'+String(e.message||e).slice(0,70),'info')}}},
      wipe:async()=>{if(await confirmSheet({title:'清除全部動畫與素材？',msg:'會移除這隻角色所有自訂動畫與影格素材，無法復原。建議先匯出內容包備份。',ok:'清除'})){clearTimeout(S.pt);for(const a2 of L.anims)await AnimDB.del('anims',a2.id);for(const id of L.frames.keys()){await AnimDB.del('frames',id);Anim.drop(id)}L.anims=[];L.frames.clear();S.cur=null;S.undo=[];S.redo=[];S.dead.clear();Anim.refresh(S.cid);this.prevSet();this.bar();this.render();toast('已清除','trash')}}};
    const f=A[k];if(f)f()},
  onInput(e){const t=e.target,k=t.dataset.k,S=this.S;if(t.id==='anQ'){S.q=t.value.trim().toLowerCase();clearTimeout(this.qt);this.qt=setTimeout(()=>{this.render();const q=$('#anQ',this.el);q&&(q.focus(),q.setSelectionRange(q.value.length,q.value.length))},180);return}
    if(!k)return;const a=S.cur;if(!a)return;if(!/^(a\.(fps|fx|fy|prio)|f\.(ox|oy|r|s|o)|g\.[sx]|z)$/.test(k))return;if(!S.dirty&&k!=='z'){S.pre=this.snap();S.dirty=true}const v=+t.value,f=a.frames[S.fi],o=t.parentNode.querySelector('output');
    const M={'a.fps':()=>a.fps=v,'a.fx':()=>a.fx=v,'a.fy':()=>a.fy=v,'a.prio':()=>a.prio=v,'f.ox':()=>f.ox=v,'f.oy':()=>f.oy=v,'f.r':()=>f.r=v,'f.s':()=>f.sx=f.sy=v/100,'f.o':()=>f.o=v/100,'g.s':()=>a.frames.forEach(x=>{x.sx=x.sy=v/100}),'g.x':()=>a.frames.forEach(x=>{x.ox=v})};
    if(M[k])M[k]();if(k==='z'){S.zoom=v;$('.an-strip',this.el).style.setProperty('--fz',v+'px');S.dirty=false;return}
    if(o)o.textContent=t.dataset.u?v+t.dataset.u:v;if(this.pl.a===a)this.pl.show(S.playing?(this.pl.cur??0):S.fi,false);$('#anInfo',this.el).textContent=`${a.name}・${a.frames.length} 影格・${a.fps} FPS`},
  onChange(e){const t=e.target,k=t.dataset.k,S=this.S,a=S.cur;
    if(S.dirty){S.undo.push(S.pre);if(S.undo.length>50)S.undo.shift();S.redo=[];S.dirty=false;this.persist();return}
    if(!a||!k)return;const V=t.value.trim();
    if(k==='a.name')this.edit(()=>{a.name=V.slice(0,40)||a.name});else if(k==='a.cat')this.edit(()=>{a.cat=V});else if(k==='a.trig')this.edit(()=>{a.trig=V;const T=TRIGS.find(x=>x[0]===V);if(T)a.cat=T[2]});
    else if(k==='a.trigx')this.edit(()=>{if(V)a.trig=V.slice(0,40)});else if(k==='a.face')this.edit(()=>{a.face=V});else if(k==='a.preset')this.edit(()=>{a.preset=V})},
  /* —— 面板繪製 —— */
  thumb(a){const f=a.frames[0],r=f&&Anim.fr(a.cid,f.f);return r?`<img src="${Anim.url(r)}" alt="">`:`<span style="opacity:.4">${ic('plus',18)}</span>`},
  rng(lab,k,min,max,step,val,u){return`<div class="an-row"><label>${lab}</label><input type="range" data-k="${k}" min="${min}" max="${max}" step="${step}" value="${val}"><output>${val}${u||''}</output></div>`.replace('<input','<input'+(u?` data-u="${u}"`:''))},
  render(){const S=this.S,p=$('#anPanel',this.el),sc=p.scrollTop;p.innerHTML=S.adv?this['p_'+S.tab]():(S.act!=null?this.p_act():this.p_home());p.scrollTop=sc;this.bindStrip()},
  p_anims(){const S=this.S,L=this.L,have=new Set(L.anims.map(a=>a.trig)),list=L.anims.filter(a=>S.cat==='all'||a.cat===S.cat),miss=TRIGS.filter(t=>!have.has(t[0])&&(S.cat==='all'||t[2]===S.cat));
    return`<div class="an-chips" style="margin-bottom:10px">${[['all','全部'],...ACATS].map(([k,n])=>`<button class="chip ${S.cat===k?'on':''}" data-a="cat" data-c="${k}">${n}</button>`).join('')}</div>
    <button class="btn primary wide" data-a="newA" style="margin-bottom:10px">${ic('plus',20)}新增動畫</button>
    ${list.length?list.map(a=>`<div class="an-li ${S.cur===a?'on':''}"><div class="an-th">${this.thumb(a)}</div><div class="t" data-a="pick" data-id="${a.id}" style="min-height:44px"><b>${esc(a.name)}</b><small>${esc((TRIGS.find(t=>t[0]===a.trig)||[0,a.trig])[1])}・${AFACE.find(f=>f[0]===a.face)[1]}・${a.frames.length} 影格</small></div>
      <button class="icon-btn" data-a="dupA" data-id="${a.id}" aria-label="複製">${ic('copy',20)}</button><button class="icon-btn" data-a="delA" data-id="${a.id}" aria-label="刪除">${ic('trash',20)}</button></div>`).join(''):'<div class="an-empty">這個分類還沒有動畫。點下方動作快速建立，或新增自訂動畫。</div>'}
    ${miss.length?`<div class="an-card"><h4>尚未設定的動作（沒設定時會自動退回待機或原本造型）</h4><div class="an-chips">${miss.map(t=>`<button class="chip" data-a="quick" data-t="${t[0]}">+ ${t[1]}</button>`).join('')}</div>`:''}`},
  p_tl(){const S=this.S,a=S.cur;if(!a)return'<div class="an-empty">先到「動畫」分頁建立或選擇一個動畫。</div>';const f=a.frames[S.fi],L=this.L;
    const sizes=new Set(a.frames.map(x=>{const r=Anim.fr(a.cid,x.f);return r?r.w+'x'+r.h:''}));
    const strip=a.frames.map((x,i)=>{const r=L.frames.get(x.f);return`<div class="an-fr ${i===S.fi?'on':''}" data-i="${i}"><div class="an-grip" aria-label="拖曳排序">⋮⋮</div><div class="im" data-a="fr" data-i="${i}">${r?`<img src="${Anim.url(r)}" alt="">`:'<span>?</span>'}</div><small>${i+1}・×${x.d}</small></div>`}).join('');
    return`<div class="an-card"><div class="an-chips" style="margin-bottom:6px">${[['loop','循環'],['once','單次'],['pingpong','往返']].map(([k,n])=>`<button class="chip ${a.mode===k?'on':''}" data-a="mode2" data-m="${k}">${n}</button>`).join('')}</div>
      ${this.rng('速度','a.fps',1,30,1,a.fps,' FPS')}${this.rng('縮放','z',44,120,2,S.zoom,'px')}
      <div class="an-strip" style="--fz:${S.zoom}px">${strip}<button class="an-fr" data-a="go" style="min-height:${S.zoom+30}px;display:grid;place-items:center;border:2px dashed var(--ink-3);background:none">${ic('plus',24)}</button></div>
      ${sizes.size>1?'<small style="color:var(--ink-2)">影格尺寸不一致：已依最大尺寸與腳底對齊，建議使用相同畫布大小。</small>':''}</div>
    ${f?`<div class="an-card"><h4>第 ${S.fi+1} 格</h4><div class="an-chips"><button class="btn" data-a="fmv" data-v="-1">◀ 前移</button><button class="btn" data-a="fmv" data-v="1">後移 ▶</button><button class="btn" data-a="fdur" data-v="-.5">停留 −</button><button class="btn" data-a="fdur" data-v="1">停留 ＋</button>
      <button class="btn" data-a="fdup">${ic('copy',18)}複製</button><button class="btn" data-a="fflip">↔ 翻轉</button><button class="btn danger" data-a="fdel">${ic('trash',18)}刪除</button></div>
      ${S.adv?`${this.rng('水平位移','f.ox',-100,100,1,f.ox,'%')}${this.rng('垂直位移','f.oy',-100,100,1,f.oy,'%')}${this.rng('旋轉','f.r',-180,180,1,f.r,'°')}${this.rng('縮放','f.s',10,300,1,Math.round(f.sx*100),'%')}${this.rng('透明度','f.o',0,100,1,Math.round(f.o*100),'%')}
      <div class="an-chips"><button class="btn" data-a="fall">套用到所有影格</button><button class="btn" data-a="foot">腳底自動對齊</button></div>`:'<small style="color:var(--ink-2)">需要位移、旋轉、縮放、透明度時，請切換到「進階」。</small>'}</div>`:'<div class="an-empty">這個動畫還沒有影格。點 ＋ 從素材庫加入。</div>'}`},
  libList(){const S=this.S;return[...this.L.frames.values()].filter(r=>(S.folder==='all'||(S.folder==='_'?!r.folder:r.folder===S.folder))&&(!S.q||(r.name+' '+r.folder+' '+r.tags.join(' ')).toLowerCase().includes(S.q))).sort((x,y)=>natCmp(x.name,y.name))},
  p_lib(){const S=this.S,all=[...this.L.frames.values()],fs=[...new Set(all.map(r=>r.folder).filter(Boolean))],list=this.libList();
    return`<div class="an-chips" style="margin-bottom:8px"><button class="btn primary" data-a="addLib">${ic('upload',18)}匯入圖片</button><button class="btn" data-a="sheet">▦ Sprite Sheet</button><button class="btn ${S.selMode?'primary':''}" data-a="selm">多選</button></div>
    <div class="an-row"><input class="an-in" id="anQ" placeholder="搜尋名稱、標籤、資料夾" value="${esc(S.q)}"></div>
    <div class="an-chips" style="margin-bottom:8px"><button class="chip ${S.folder==='all'?'on':''}" data-a="fold" data-f="all">全部 ${all.length}</button>${fs.map(f=>`<button class="chip ${S.folder===f?'on':''}" data-a="fold" data-f="${esc(f)}">${esc(f)}</button>`).join('')}${all.some(r=>!r.folder)?`<button class="chip ${S.folder==='_'?'on':''}" data-a="fold" data-f="_">未分類</button>`:''}</div>
    ${S.selMode?`<div class="an-chips" style="margin-bottom:8px"><button class="chip" data-a="selAll">全選</button><button class="btn primary" data-a="batchAdd">加入動畫 (${S.sel.size})</button><button class="btn" data-a="batchFolder">資料夾</button><button class="btn danger" data-a="batchDel">刪除</button></div>`:''}
    ${list.length?`<div class="an-grid">${list.map(r=>`<button class="an-tile ${S.sel.has(r.id)?'on':''}" data-a="tile" data-id="${r.id}"><div class="im"><img src="${Anim.url(r)}" alt="" loading="lazy"></div><small>${esc(r.name)}</small></button>`).join('')}</div>`:'<div class="an-empty">素材庫是空的。支援 PNG、WebP、GIF/APNG 與 Sprite Sheet，可一次選多張。<br>點素材可加入目前動畫；數字結尾的檔名會自動依序排列。</div>'}`},
  p_prop(){const S=this.S,a=S.cur;if(!a)return'<div class="an-empty">請先選擇動畫。</div>';const known=TRIGS.some(t=>t[0]===a.trig);
    return`<div class="an-card"><div class="an-row"><label>名稱</label><input class="an-in" data-k="a.name" value="${esc(a.name)}" maxlength="40"></div>
      <div class="an-row"><label>觸發動作</label><select class="an-in" data-k="a.trig">${TRIGS.map(t=>`<option value="${t[0]}" ${t[0]===a.trig?'selected':''}>${t[1]}</option>`).join('')}${known?'':`<option selected value="${esc(a.trig)}">${esc(a.trig)}</option>`}</select></div>
      <div class="an-row"><label>自訂 ID</label><input class="an-in" data-k="a.trigx" placeholder="行為 ID 或自訂名稱" value="${known?'':esc(a.trig)}"></div>
      <div class="an-row"><label>分類</label><select class="an-in" data-k="a.cat">${ACATS.map(c=>`<option value="${c[0]}" ${c[0]===a.cat?'selected':''}>${c[1]}</option>`).join('')}</select></div>
      <div class="an-row"><label>朝向</label><select class="an-in" data-k="a.face">${AFACE.map(c=>`<option value="${c[0]}" ${c[0]===a.face?'selected':''}>${c[1]}</option>`).join('')}</select></div>
      <div class="an-row"><label>內建動態</label><select class="an-in" data-k="a.preset">${PRESETS.map(c=>`<option value="${c[0]}" ${c[0]===a.preset?'selected':''}>${c[1]}</option>`).join('')}</select></div>
      <small style="color:var(--ink-2)">朝向「朝右／朝左」的動畫缺少另一側時，會自動鏡像使用；「通用」跟隨角色朝向。</small></div>
    <div class="an-card"><h4>定位與優先級</h4>${this.rng('優先級','a.prio',0,9,1,a.prio)}${this.rng('腳底錨點 X','a.fx',0,100,1,a.fx,'%')}${this.rng('腳底高度','a.fy',-30,60,1,a.fy,'%')}
      <small style="color:var(--ink-2)">一次性動畫（跳躍、驚訝…）會先播完，除非新動作優先級更高。虛線為地面，影格底部應貼齊虛線。</small></div>
    <div class="an-card"><h4>影格事件（第 ${S.fi+1} 格起可連動）</h4>${a.ev.length?a.ev.map((e,i)=>`<div class="an-li"><div class="t"><b>第 ${e.i+1} 格・${{fx:'愛心粒子',squash:'擠壓彈跳',snd:'音效',expr:'表情',evt:'自訂事件'}[e.t]||esc(e.t)}</b><small>${esc(e.v)}</small></div><button class="icon-btn" data-a="evDel" data-i="${i}" aria-label="刪除">${ic('trash',20)}</button></div>`).join(''):'<div class="an-empty" style="padding:6px">尚無事件</div>'}
      <button class="btn wide" data-a="evAdd">${ic('plus',18)}新增事件</button></div>`},
  p_io(){const L=this.L,cats=ACATS.filter(c=>L.anims.some(a=>a.cat===c[0]));
    return`<div class="an-card"><h4>匯出（含影格素材，可離線保存）</h4><div class="an-chips"><button class="btn" data-a="exOne">目前動畫</button>${cats.map(c=>`<button class="btn" data-a="exCat" data-c="${c[0]}">${c[1]}分類</button>`).join('')}<button class="btn primary" data-a="exAll">${ic('download',18)}全部動畫與素材</button></div></div>
    <div class="an-card"><h4>匯入</h4><button class="btn wide" data-a="imp">${ic('upload',18)}匯入動畫內容包 (.json)</button><small style="color:var(--ink-2)">匯入一律建立新的識別碼，不會覆蓋既有動畫；同名會自動加上編號。</small></div>
    <div class="an-card"><h4>資料</h4><small style="color:var(--ink-2)">素材存放在 IndexedDB，編輯後自動保存，離線也能播放。</small><button class="btn danger wide" data-a="wipe" style="margin-top:8px">清除這隻角色的動畫與素材</button></div>`},

  /* —— 簡易模式：動作卡片 → 匯入圖片 → 自動播放 —— */
  actAnim(t){const l=this.L.anims.filter(a=>a.trig===t);return l.find(a=>a.face==='any')||l[0]||null},
  back(){const S=this.S;if(S&&!S.adv&&S.act!=null){S.act=null;S.cur=null;this.prevSet();this.render();return}this.close()},
  async gcAuto(){const L=this.L,used=new Set();L.anims.forEach(a=>a.frames.forEach(f=>used.add(f.f)));for(const[id,r]of[...L.frames])if(r.auto&&!used.has(id)){L.frames.delete(id);Anim.drop(id);await AnimDB.del('frames',id)}},
  p_home(){const L=this.L,card=(t,l,e,a,id)=>{const has=a&&a.frames.length;return`<button class="an-act ${has?'has':''}" data-a="openAct" data-t="${esc(t)}" ${id?`data-id="${id}"`:''}><span class="e">${has?`<i class="an-th" style="width:44px;height:44px">${this.thumb(a)}</i>`:e}</span><b>${esc(l)}</b><small>${has?(a.frames.length>1?a.frames.length+' 張':(PRESETS.find(p=>p[0]===a.preset)||[null,'動態'])[1]):'原本造型'}</small></button>`};
    const cu=L.anims.filter(a=>!ACTS.some(t=>t[0]===a.trig));
    return`<p style="color:var(--ink-2);font-size:13px;margin:0 2px 10px">點一個動作，匯入圖片就會自動播放。沒設定的動作會使用原本造型。</p><div class="an-acts">${ACTS.map(([t,l,e])=>card(t,l,e,this.actAnim(t))).join('')}${cu.map(a=>card(a.trig,a.name,'⭐',a,a.id)).join('')}<button class="an-act add" data-a="newCustom"><span class="e">＋</span><b>自訂動作</b><small>想怎麼動都行</small></button></div>
    <div class="an-chips" style="margin-top:12px"><button class="btn" data-a="exAll">${ic('download',18)}匯出全部</button><button class="btn" data-a="imp">${ic('upload',18)}匯入內容包</button></div>`},
  p_act(){const S=this.S,a=S.cur,t=S.act,A=ACTS.find(x=>x[0]===t),label=A?A[1]:(a?a.name:t),emo=A?A[2]:'⭐',ch=S.ch,L=this.L;
    const head=`<div class="an-chips" style="margin-bottom:8px"><button class="chip" data-a="home">‹ 全部動作</button></div><h3 style="margin:0 2px 10px">${emo} ${esc(label)}</h3>`;
    const hint='<small style="display:block;margin-top:8px;color:var(--ink-2)">可一次多選，也可以重複點「＋」一張一張加。多張會自動依序播放，只有一張時會加上柔和動態。支援 PNG、WebP、GIF 與 Sprite Sheet。</small>';
    if(!a||!a.frames.length)return head+`<div class="an-card"><div class="an-empty" style="padding:8px">還沒有「${esc(label)}」的圖片，目前使用原本造型。</div><button class="btn primary wide" data-a="qimp">${ic('plus',20)}加入圖片</button>${ch.url?`<button class="btn wide" data-a="useMain" style="margin-top:8px">用角色主圖＋內建動態</button>`:''}${hint}</div>`;
    const one=a.frames.length===1,f0=a.frames[0];
    const strip=a.frames.map((x,i)=>{const r=L.frames.get(x.f);return`<div class="an-fr ${i===S.fi?'on':''}" data-i="${i}"><div class="an-grip" aria-label="拖曳排序">⋮⋮</div><div class="im" data-a="fr" data-i="${i}">${r?`<img src="${Anim.url(r)}" alt="">`:'<span>?</span>'}</div><small>${i+1}${x.d!==1?'・×'+x.d:''}</small></div>`}).join('');
    return head+`<div class="an-card"><h4>圖片（${a.frames.length}）${one?'':'・拖曳 ⋮⋮ 排序'}</h4><div class="an-strip" style="--fz:64px">${strip}<button class="an-fr" data-a="qimp" aria-label="加入圖片" style="min-height:92px;display:grid;place-items:center;border:2px dashed var(--ink-3);background:none">${ic('plus',26)}</button></div>
      <div class="an-chips">${one?'':'<button class="btn" data-a="fmv" data-v="-1">◀</button><button class="btn" data-a="fmv" data-v="1">▶</button><button class="btn" data-a="fdur" data-v="-.5">停留 −</button><button class="btn" data-a="fdur" data-v="1">停留 ＋</button>'}<button class="btn" data-a="fflip">↔ 翻轉</button><button class="btn" data-a="fdup">${ic('copy',18)}複製</button><button class="btn danger" data-a="fdel">${ic('trash',18)}移除此張</button></div>${hint}</div>
    ${one?`<div class="an-card"><h4>動態方式</h4><div class="an-chips">${PRESETS.map(([k,n])=>`<button class="chip ${a.preset===k?'on':''}" data-a="preset" data-p="${k}">${n}</button>`).join('')}</div></div>`:''}
    <div class="an-card">${this.rng('播放速度','a.fps',1,30,1,a.fps)}<h4 style="margin-top:8px">循環方式</h4><div class="an-chips">${[['loop','循環'],['once','只播一次'],...(one?[]:[['pingpong','往返']])].map(([k,n])=>`<button class="chip ${a.mode===k?'on':''}" data-a="mode2" data-m="${k}">${n}</button>`).join('')}</div></div>
    <div class="an-card"><h4>尺寸與位置（也可直接在預覽上拖曳角色）</h4>${this.rng('大小','g.s',40,160,1,Math.round(f0.sx*100),'%')}${this.rng('左右','g.x',-60,60,1,Math.round(f0.ox),'%')}${this.rng('上下','a.fy',-30,60,1,a.fy,'%')}<button class="btn" data-a="foot">自動貼地</button></div>
    <button class="btn danger wide" data-a="delAct">${ic('trash',18)}移除這個動作的所有圖片</button>`},
  async quickImport(){const S=this.S,fs=await pickF('image/*',true);if(!fs.length||this.S!==S)return;fs.sort((a,b)=>natCmp(a.name,b.name));
    toast(`處理 ${fs.length} 個檔案…`,'info');const blobs=[],bad=[];let fps=null;
    for(const f of fs){try{const s=await sniff(f);if(!s){bad.push(f.name||'檔案');continue}
        const fr=await decodeAnimImg(s);if(!fr&&s.type==='image/gif'&&!window.ImageDecoder)toast('目前瀏覽器無法拆解 GIF，請改用 PNG 影格或 Sprite Sheet','info');if(fr){fr.forEach(x=>blobs.push(x));fps=fps||clamp(Math.round(1000/Math.max(20,fr.reduce((q,x)=>q+x.ms,0)/fr.length)),2,30);continue}
        if(fs.length===1&&!(S.cur&&S.cur.frames.length)){const bmp=await loadBmp(s),g=autoGrid(bmp);
          if(g.c*g.r>1&&g.c*g.r<=100&&await confirmSheet({title:'這是 Sprite Sheet 嗎？',msg:`偵測到 ${g.c}×${g.r} 格，要切成 ${g.c*g.r} 個影格嗎？選「取消」會把它當成單張圖片。`,ok:'切割',danger:false})){(await sliceSheet(bmp,g.c,g.r,true)).forEach(b=>blobs.push(b));continue}}
        blobs.push(s)}catch(e){bad.push(f.name||'檔案')}}
    if(blobs.length){try{await this.applyAct(blobs,fps)}catch(e){bad.push('儲存失敗')}}
    if(bad.length)toast(`${bad.length} 個檔案無法讀取（${bad[0]}），請改用 PNG／WebP／GIF`,'info')},
  async useMain(){const b=this.S.ch.rec&&this.S.ch.rec.blob;if(!b){toast('找不到角色主圖','info');return}try{await this.applyAct([b],null)}catch(e){toast('處理失敗','info')}},
  async applyAct(blobs,fps){const S=this.S,L=this.L,trig=S.act,label=(ACTS.find(t=>t[0]===trig)||[0,S.cur?S.cur.name:trig])[1],fits=[];
    for(const b of blobs){try{const v=b&&b.blob?b:{blob:b,ms:0};fits.push({blob:(await fitBlob(v.blob,1536)).blob,ms:v.ms})}catch(e){}}if(!fits.length)throw new Error('無法解碼圖片');
    let a=S.cur&&S.cur.trig===trig?S.cur:this.actAnim(trig);const fresh=!a||!a.frames.length,n0=a?a.frames.length:0,nf=[];
    for(let i=0;i<fits.length;i++){try{const r=await this.addRec(fits[i].blob,`${label}_${String(n0+i+1).padStart(2,'0')}`,label,1);nf.push({f:r.id,d:fits[i].ms&&fps?clamp(Math.round(fits[i].ms*fps/1000*100)/100,.25,20):1,ox:0,oy:0,r:0,sx:1,sy:1,o:1,fl:0})}catch(e){}}
    if(!nf.length)throw new Error('影格儲存失敗');
    for(const f of nf){const r=L.frames.get(f.f);try{f.oy=-Math.round((await padOf(r))*1000)/10}catch(e){f.oy=0}}
    if(this.S!==S)throw new Error('角色已切換');
    this.pushU();if(!a){a=mkAnim(S.cid,label,trig);L.anims.push(a)}
    if(!fresh){const g=a.frames[0];nf.forEach(f=>{f.sx=g.sx;f.sy=g.sy;f.ox=g.ox})}
    a.frames=a.frames.concat(nf);const one=a.frames.length===1;
    if(one){a.preset=PDEF[trig]||'breathe';if(a.mode==='pingpong')a.mode='loop'}else a.preset='none';
    if(fresh||fps)a.fps=fps||(one?(DEFSPD[trig]||8):(trig==='run'?12:8));
    S.cur=a;S.fi=a.frames.length-1;S.playing=true;this.pl.hold=false;this.touch();toast(a.frames.length>1?`已有 ${a.frames.length} 張，依序播放中`:'已設定，並加上柔和動態','check')},
  newCustom(){this.textSheet('自訂動作名稱','',v=>{const S=this.S;this.edit(()=>{const a=mkAnim(S.cid,v,v);a.cat='custom';this.L.anims.push(a);S.cur=a;S.act=a.trig;S.fi=0});this.bar()})},
  /* —— 時間軸拖曳排序（只在把手上起拖，不影響橫向捲動）—— */
  bindStrip(){const st=$('.an-strip',this.el);if(!st)return;$$('.an-grip',st).forEach(g=>g.addEventListener('pointerdown',e=>this.dragStart(e,st)))},
  dragStart(e,st){if(!this.S.cur)return;const it=e.target.closest('.an-fr'),i=+it.dataset.i,a=this.S.cur,items=$$('.an-fr[data-i]',st),rects=items.map(x=>x.getBoundingClientRect()),x0=e.clientX,sl0=st.scrollLeft;let to=i;
    it.setPointerCapture(e.pointerId);it.classList.add('drag');
    const mv=ev=>{const dx=ev.clientX-x0+(st.scrollLeft-sl0);it.style.transform=`translateX(${dx}px)`;const cx=rects[i].left+rects[i].width/2+dx-(st.scrollLeft-sl0);to=rects.findIndex(r=>cx<r.right);if(to<0)to=rects.length-1;
      const sr=st.getBoundingClientRect();if(ev.clientX>sr.right-36)st.scrollLeft+=10;else if(ev.clientX<sr.left+36)st.scrollLeft-=10};
    const up=()=>{it.removeEventListener('pointermove',mv);it.removeEventListener('pointerup',up);it.removeEventListener('pointercancel',up);it.style.transform='';it.classList.remove('drag');
      if(to!==i)this.edit(()=>{const[f]=a.frames.splice(i,1);a.frames.splice(to,0,f);this.S.fi=to})};
    it.addEventListener('pointermove',mv);it.addEventListener('pointerup',up);it.addEventListener('pointercancel',up)},
  /* —— 素材庫操作 —— */
  async addRec(blob,name,folder,auto){const S=this.S,L=this.L;if(!blob||!blob.size)throw new Error('圖片內容為空');
    const im=await Chars.probe(blob),r={id:nid('fr_'),cid:this.S.cid,name:String(name).slice(0,60),folder:String(folder||'').slice(0,30),tags:[],blob,w:im.w,h:im.h,created:Date.now(),auto:auto?1:0};
    if(!im.w||!im.h||this.S!==S)throw new Error('圖片損毀或角色已切換');
    if(!await AnimDB.put('frames',r))throw new Error('動畫素材未能寫入永久儲存空間');
    L.frames.set(r.id,r);return r},
  async importImgs(){const S=this.S,fs=(await pickF('image/png,image/webp,image/gif,image/jpeg,image/*',true)).sort((a,b)=>natCmp(a.name,b.name));if(!fs.length||this.S!==S)return;
    let ok=0,bad=0,sc=0,jpg=0;const ids=[];toast('匯入中…','info');
    for(const f of fs){try{if(f.size>25e6)throw new Error('圖片過大');const base=f.name.replace(/\.[^.]+$/,'');const input=await sniff(f);if(!input)throw new Error('不支援的圖片');const fr=await decodeAnimImg(input);if(!fr&&input.type==='image/gif'&&!window.ImageDecoder)toast('這個環境無法拆解 GIF，僅匯入單張首格','info');
      if(fr){let n=1;for(const x of fr){const q=await fitBlob(x.blob,1536);ids.push((await this.addRec(q.blob,`${base}_${String(n++).padStart(2,'0')}`,base)).id);ok++}continue}
      const q=await fitBlob(input,1536);if(q.scaled)sc++;if(input.type==='image/jpeg')jpg++;ids.push((await this.addRec(q.blob,base,'')).id);ok++}catch(e){bad++}}
    this.render();toast(`已匯入 ${ok} 張${bad?`，${bad} 個檔案無法使用`:''}`,bad&&!ok?'info':'check');
    if(sc)setTimeout(()=>toast('過大的圖片已縮到 1536px 以內','info'),1700);if(jpg)setTimeout(()=>toast('JPG 沒有透明背景：點素材可「去除背景色」','info'),3400);
    if(this.S.cur&&ids.length&&await confirmSheet({title:'加入目前動畫？',msg:`把剛匯入的 ${ids.length} 張依序加入「${this.S.cur.name}」。`,ok:'加入',danger:false}))this.addToAnim(ids)},
  async importSheet(){const S=this.S,f=(await pickF('image/*'))[0];if(!f||this.S!==S)return;let bmp;try{bmp=await loadBmp(f)}catch(e){toast('這張圖片無法讀取','info');return}
    const W=bw(bmp),H=bh(bmp),g=autoGrid(bmp),base=f.name.replace(/\.[^.]+$/,'');
    const s=openSheet(`<div class="sh-body"><h3>切割 Sprite Sheet</h3><img class="an-sheetprev" id="ssI" alt=""><div class="an-row"><label>欄數</label><input class="an-in" id="ssC" type="number" inputmode="numeric" min="1" max="64" value="${g.c}"><label>列數</label><input class="an-in" id="ssR" type="number" inputmode="numeric" min="1" max="64" value="${g.r}"></div>
      <div class="an-row"><label style="flex:1"><input type="checkbox" id="ssT" checked> 略過空白格</label></div><p id="ssN" style="color:var(--ink-2);font-size:13px"></p><div class="pv-cta"><button class="btn grow" id="ssA">重新偵測</button><button class="btn grow primary" id="ssGo">切割並加入</button></div></div>`);
    const $s=q=>$(q,s.el),draw=()=>{const c=+$s('#ssC').value||1,r=+$s('#ssR').value||1,k=Math.min(1,600/Math.max(W,H)),cv=cvs(Math.round(W*k),Math.round(H*k)),x=cv.getContext('2d');x.drawImage(bmp,0,0,cv.width,cv.height);
      x.strokeStyle='#F5909F';x.lineWidth=2;for(let i=1;i<c;i++){x.beginPath();x.moveTo(cv.width*i/c,0);x.lineTo(cv.width*i/c,cv.height);x.stroke()}for(let j=1;j<r;j++){x.beginPath();x.moveTo(0,cv.height*j/r);x.lineTo(cv.width,cv.height*j/r);x.stroke()}
      $s('#ssI').src=cv.toDataURL();$s('#ssN').textContent=`每格 ${Math.floor(W/c)}×${Math.floor(H/r)} px，共 ${c*r} 格`+((W%c||H%r)?'（尺寸無法整除，邊緣會略微裁切）':'')};
    $s('#ssC').oninput=$s('#ssR').oninput=draw;$s('#ssA').onclick=()=>{const a=autoGrid(bmp);$s('#ssC').value=a.c;$s('#ssR').value=a.r;draw()};draw();
    $s('#ssGo').onclick=async()=>{const c=clamp(+$s('#ssC').value||1,1,64),r=clamp(+$s('#ssR').value||1,1,64);if(c*r>400||c>W||r>H){toast('格數超過限制或圖片尺寸，請調整欄列','info');return}
      try{const bl=await sliceSheet(bmp,c,r,$s('#ssT').checked),ids=[];
        for(let i=0;i<bl.length;i++){const q=await fitBlob(bl[i],1536);ids.push((await this.addRec(q.blob,`${base}_${String(i+1).padStart(2,'0')}`,base)).id)}
        s.close();this.render();toast(`已切出 ${ids.length} 格`,'check');if(this.S.cur&&ids.length)this.addToAnim(ids)
      }catch(e){toast('切割失敗：'+String(e.message||e).slice(0,50),'info')}}},
  addToAnim(ids){const S=this.S;if(!S.cur){toast('請先建立或選擇動畫','info');S.tab='anims';this.bar();this.render();return}
    this.edit(()=>{ids.forEach(id=>S.cur.frames.push({f:id,d:1,ox:0,oy:0,r:0,sx:1,sy:1,o:1,fl:0}))});toast(`已加入 ${ids.length} 個影格`,'check')},
  tileTap(id){const S=this.S;if(S.selMode){S.sel.has(id)?S.sel.delete(id):S.sel.add(id);this.render();return}
    const r=this.L.frames.get(id);if(!r){toast('找不到這張素材','info');return}const use=Anim.libs[S.cid].anims.filter(a=>a.frames.some(f=>f.f===id)).length;
    const s=openSheet(`<div class="sh-body"><h3>${esc(r.name)}</h3><div class="an-th" style="width:96px;height:96px;margin:0 auto 8px"><img src="${Anim.url(r)}" alt=""></div><p style="text-align:center;color:var(--ink-2);font-size:13px">${r.w}×${r.h}・用於 ${use} 個動畫${r.folder?'・'+esc(r.folder):''}</p>
      <div class="an-chips" style="justify-content:center"><button class="btn primary" id="t1">加入目前動畫</button><button class="btn" id="t2">重新命名</button><button class="btn" id="t3">資料夾・標籤</button><button class="btn" id="t4">替換圖片</button><button class="btn" id="t5">去除背景色</button><button class="btn" id="t6">複製</button><button class="btn danger" id="t7">刪除</button></div></div>`);
    const $s=q=>$(q,s.el);
    $s('#t1').onclick=()=>{s.close();this.addToAnim([id])};
    $s('#t2').onclick=()=>{s.close();this.textSheet('重新命名',r.name,async v=>{r.name=v.slice(0,60);await AnimDB.put('frames',r);this.render()})};
    $s('#t3').onclick=()=>{s.close();this.folderSheet([id])};
    $s('#t4').onclick=async()=>{const f=(await pickF('image/*'))[0];if(!f)return;try{const q=await fitBlob(f,1536);await this.setBlob(r,q.blob);s.close();toast('已替換，所有使用此素材的動畫同步更新','check')}catch(e){toast('這張圖片無法讀取','info')}};
    $s('#t5').onclick=async()=>{try{await this.setBlob(r,await keyBg(r.blob));s.close();toast('已去除背景色','check')}catch(e){toast('處理失敗','info')}};
    $s('#t6').onclick=async()=>{s.close();await this.addRec(r.blob,r.name+' 副本',r.folder);this.render()};
    $s('#t7').onclick=()=>{s.close();this.delFrames([id])}},
  async setBlob(r,blob){const im=await Chars.probe(blob);if(!im.w||!im.h)throw new Error('圖片無法辨識');
    const updated={...r,blob,w:im.w,h:im.h,pb:null,_w:0};if(!await AnimDB.put('frames',updated))throw new Error('儲存空間無法寫入');
    Object.assign(r,updated);Anim.drop(r.id);Anim.refresh(this.S.cid);this.pl.img._u=null;this.prevSet();this.render()},
  async delFrames(ids){if(!ids.length)return;const L=this.L,S=this.S,use=L.anims.filter(a=>a.frames.some(f=>ids.includes(f.f))).length;
    if(!await confirmSheet({title:`刪除 ${ids.length} 個素材？`,msg:use?`有 ${use} 個動畫正在使用，這些影格也會一併移除。`:'素材會從這隻角色的素材庫移除。',ok:'刪除'}))return;
    S.undo=[];S.redo=[];L.anims.forEach(a=>{a.frames=a.frames.filter(f=>!ids.includes(f.f))});for(const id of ids){L.frames.delete(id);Anim.drop(id);await AnimDB.del('frames',id);S.sel.delete(id)}S.selMode=false;S.fi=0;this.touch()},
  textSheet(title,val,ok){const s=openSheet(`<div class="sh-body"><h3>${esc(title)}</h3><div class="an-row"><input class="an-in" id="tx" value="${esc(val)}" maxlength="60"></div><div class="pv-cta"><button class="btn grow" data-close>取消</button><button class="btn grow primary" id="txOk">確定</button></div></div>`);
    $('#txOk',s.el).onclick=()=>{const v=$('#tx',s.el).value.trim();if(v){s.close();ok(v)}}},
  folderSheet(ids){const L=this.L,r0=L.frames.get(ids[0]),s=openSheet(`<div class="sh-body"><h3>資料夾與標籤</h3><div class="an-row"><label>資料夾</label><input class="an-in" id="fo" maxlength="30" value="${esc(ids.length===1?r0.folder:'')}" placeholder="例如：行走、表情"></div>
      <div class="an-row"><label>標籤</label><input class="an-in" id="tg" maxlength="80" value="${esc(ids.length===1?r0.tags.join(', '):'')}" placeholder="以逗號分隔，留空不變更"></div><div class="pv-cta"><button class="btn grow" data-close>取消</button><button class="btn grow primary" id="foOk">套用</button></div></div>`);
    $('#foOk',s.el).onclick=async()=>{const fo=$('#fo',s.el).value.trim(),tg=$('#tg',s.el).value.split(/[,，]/).map(x=>x.trim()).filter(Boolean).slice(0,12);
      for(const id of ids){const r=L.frames.get(id);r.folder=fo;if(tg.length||ids.length===1)r.tags=tg;await AnimDB.put('frames',r)}s.close();this.S.selMode=false;this.S.sel.clear();this.render()}},
  newAnim(){const S=this.S,s=openSheet(`<div class="sh-body"><h3>新增動畫</h3><div class="an-row"><input class="an-in" id="naN" placeholder="動畫名稱（可留空）" maxlength="30"></div>
      <div class="an-row"><select class="an-in" id="naT">${TRIGS.map(t=>`<option value="${t[0]}">${t[1]}</option>`).join('')}<option value="__c">自訂動作（用名稱當 ID）</option></select></div>
      <div class="an-row"><select class="an-in" id="naF">${AFACE.map(f=>`<option value="${f[0]}">${f[1]}</option>`).join('')}</select></div><div class="pv-cta"><button class="btn grow" data-close>取消</button><button class="btn grow primary" id="naOk">建立</button></div></div>`);
    $('#naOk',s.el).onclick=()=>{let n=$('#naN',s.el).value.trim(),t=$('#naT',s.el).value;const fc=$('#naF',s.el).value;if(t==='__c'){if(!n){toast('自訂動作需要名稱','info');return}t=n}
      s.close();this.edit(()=>{const a=mkAnim(S.cid,n||(TRIGS.find(x=>x[0]===t)||[0,t])[1],t,fc);this.L.anims.push(a);S.cur=a;S.fi=0;S.tab='lib'});this.bar()}},
  evSheet(){const S=this.S,a=S.cur,s=openSheet(`<div class="sh-body"><h3>新增事件（第 ${S.fi+1} 格）</h3><div class="an-row"><select class="an-in" id="evT"><option value="fx">愛心粒子</option><option value="squash">擠壓彈跳</option><option value="snd">音效</option><option value="expr">表情（供事件系統使用）</option><option value="evt">自訂事件</option></select></div>
      <div class="an-row"><input class="an-in" id="evV" placeholder="音效：pop / chime / boop；其他可留空或填名稱" maxlength="40"></div><div class="pv-cta"><button class="btn grow" data-close>取消</button><button class="btn grow primary" id="evOk">加入</button></div></div>`);
    $('#evOk',s.el).onclick=()=>{const t=$('#evT',s.el).value,v=$('#evV',s.el).value.trim();s.close();this.edit(()=>{a.ev.push({i:S.fi,t,v})})}},
  /* —— 動畫內容包：驗證、交易式匯入、下載／分享 —— */
  async exportPack(anims,all,name){
    const S=this.S,L=this.L;
    if(!Array.isArray(anims)||anims.some(a=>!a)){toast('請先選擇動畫','info');return}
    if(!anims.length&&!all){toast('沒有可匯出的動畫','info');return}
    try{
      const ids=new Set();anims.forEach(a=>a.frames.forEach(f=>ids.add(f.f)));
      if(all)L.frames.forEach((_,k)=>ids.add(k));
      const frames=[];
      for(const id of ids){const r=L.frames.get(id);if(!r||!r.blob)throw new Error('缺少影格素材：'+id);
        frames.push({id,name:r.name,folder:r.folder,tags:r.tags,w:r.w,h:r.h,data:await b2d(r.blob)})}
      const pack={ocAnimPack:ANIM_VER,app:'oc-shimeji',appVer:VERSION,char:{uid:S.ch.uid,name:S.ch.name},created:Date.now(),frames,
        anims:anims.map(a=>{const o=JSON.parse(JSON.stringify(a));delete o.cid;return o})};
      const safe=String(name||'animation').replace(/[^\w\u4e00-\u9fff-]+/g,'_').slice(0,65)||'animation';
      this.exportSheet(safe+'.ocanim.json',JSON.stringify(pack),anims.length,frames.length);
    }catch(e){toast('匯出失敗：'+String(e.message||e).slice(0,80),'info')}
  },
  exportSheet(name,content,na,nf){
    const blob=new Blob([content],{type:'application/json;charset=utf-8'});
    const mb=(blob.size/1048576).toFixed(2);
    const s=openSheet(`<div class="sh-body"><h3>動畫內容包已準備完成</h3>
      <p style="font-size:13px;color:var(--ink-2);margin:8px 0 14px;overflow-wrap:anywhere">${esc(name)}<br>${na} 個動畫・${nf} 張素材・${mb} MB</p>
      <div class="an-chips"><button class="btn primary grow" id="anSave">${ic('download',18)}下載 JSON</button>
      <button class="btn grow" id="anShare">分享／另存</button></div>
      <p style="font-size:12px;color:var(--ink-2);margin-top:12px">下載後請檢查裝置的「下載」資料夾；若 APK 的 WebView 不支援直接下載，可用「分享／另存」存到手機檔案管理器或雲端硬碟。請保留 .ocanim.json 副檔名。</p></div>`);
    const b=$('#anSave',s.el),share=$('#anShare',s.el);
    b.onclick=()=>{try{
        let handled=false;
        if(Native.has())try{handled=Native.call('saveFile',name,content)===true}catch(e){}
        if(!handled){const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000)}
        toast('已送出下載，請確認檔案是否儲存','download');
      }catch(e){toast('下載未成功，請改用「分享／另存」','info')}};
    share.onclick=async()=>{
      if(!navigator.share){toast('此環境不支援分享，請改用下載','info');return}
      try{const f=new File([blob],name,{type:'application/json'});
        if(navigator.canShare&&!navigator.canShare({files:[f]})){toast('此裝置不支援分享 JSON 檔案','info');return}
        await navigator.share({files:[f],title:name});toast('已完成分享','check');
      }catch(e){toast(e&&e.name==='AbortError'?'已取消分享':'分享失敗，請改用下載','info')}
    };
  },
  async importPack(text){
    const S=this.S,L=this.L;let p;
    try{p=JSON.parse(text)}catch(e){toast('不是有效的 JSON 檔案','info');return false}
    if(!p||p.app!=='oc-shimeji'||!Number.isInteger(p.ocAnimPack)||p.ocAnimPack<1||
      !Array.isArray(p.anims)||!Array.isArray(p.frames)){
      toast('不是有效的 OC Shimeji 動畫內容包','info');return false}
    if(p.ocAnimPack>ANIM_VER){toast('內容包來自較新版本，為避免資料損壞未匯入','info');return false}
    if(p.anims.length>1000||p.frames.length>5000){toast('內容包超出安全數量限制','info');return false}
    if(!p.anims.length&&!p.frames.length){toast('內容包裡沒有動畫或素材','info');return false}
    const oldMap=new Map(),staged=[],next=[];
    try{
      // 所有素材先驗證並解碼；一個損毀就中止，不會匯入一半。
      for(const f of p.frames){
        if(!f||typeof f.id!=='string'||!f.id||oldMap.has(f.id)||typeof f.data!=='string')throw new Error('影格識別碼重複或缺失');
        const blob=d2b(f.data);
        if(!/^image\/(png|jpeg|webp|gif|bmp)$/i.test(blob.type)||!blob.size||blob.size>30*1024*1024)throw new Error('無效的影格格式或尺寸');
        const im=await Chars.probe(blob);if(!im.w||!im.h||im.w*im.h>120000000)throw new Error('圖片損毀或尺寸過大');
        const id=nid('fr_'),r={id,cid:S.cid,name:String(f.name||'影格').slice(0,60),folder:String(f.folder||'').slice(0,30),
          tags:(Array.isArray(f.tags)?f.tags:[]).slice(0,12).map(x=>String(x).slice(0,30)),blob,w:im.w,h:im.h,created:Date.now(),auto:0};
        oldMap.set(f.id,id);staged.push(r);
      }
      const used=new Set(L.anims.map(x=>x.name));
      for(const o of p.anims){
        if(!o||typeof o!=='object'||!Array.isArray(o.frames)||o.frames.length>5000)throw new Error('動畫資料格式錯誤');
        const fr=o.frames.map(x=>{
          if(!x||typeof x.f!=='string'||!oldMap.has(x.f))throw new Error('動畫「'+String(o.name||'未命名')+'」缺少影格素材');
          return {...x,f:oldMap.get(x.f)};
        });
        let a=normAnim({...o,id:null,cid:S.cid,frames:fr});
        const stem=a.name.slice(0,32)||'未命名動畫';let k=2;
        while(used.has(a.name)){a.name=`${stem} (${k++})`.slice(0,40)}
        used.add(a.name);next.push(a);
      }
      if(this.S!==S)throw new Error('角色已切換，請重新匯入');
      // 先完成 IndexedDB 寫入，再更新運行中角色；失敗不會覆蓋舊內容。
      if(staged.length)await AnimDB.bulk('frames',staged);
      try{if(next.length)await AnimDB.bulk('anims',next)}catch(e){
        await AnimDB.bulkDelete('frames',staged.map(r=>r.id)).catch(()=>{});throw e
      }
      this.pushU();staged.forEach(r=>L.frames.set(r.id,r));next.forEach(a=>L.anims.push(a));
      S.cur=S.cur||next[0]||L.anims[0]||null;this.touch();
      toast(`已匯入 ${next.length} 個動畫、${staged.length} 張素材`,'check');return true;
    }catch(e){toast('匯入中止，未變更原有資料：'+String(e.message||e).slice(0,75),'info');return false}
  }
};

boot();
