(()=>{'use strict';
const wait=setInterval(()=>{try{if(!window.OCSCommunity?.ready||!Home?.stage?.root||!document.getElementById('p-home'))return;clearInterval(wait);init()}catch(e){clearInterval(wait);console.error('[isle talk]',e)}},200);
function init(){
 const home=document.getElementById('p-home'),root=Home.stage.root;
 const layer=document.createElement('div');layer.id='isleTalk';layer.setAttribute('aria-live','polite');home.append(layer);
 document.documentElement.classList.add('isle-talk-on');
 const map=new Map();let seq=0,last=performance.now(),hudT=0,hud=[],safe={t:0,b:innerHeight};
 const HUD=['.hud-top','#isleClock','#hudRail>.rail-btn[data-go=toggle]','#camFollow','#qbag','#questCard','#fab','.ev-hud'];
 function readHud(hr){hud=[];let top=0;for(const s of HUD){const n=home.querySelector(s);if(!n||!n.getClientRects().length)continue;const cs=getComputedStyle(n);if(cs.visibility==='hidden'||+cs.opacity<.05)continue;const r=n.getBoundingClientRect();if(!r.width||!r.height)continue;
   const o={l:r.left-hr.left-4,t:r.top-hr.top-4,r:r.right-hr.left+4,b:r.bottom-hr.top+4};if(s==='.hud-top'||s==='#isleClock')top=Math.max(top,o.b);else hud.push(o)}
  const nav=document.getElementById('nav'),nr=nav&&nav.getBoundingClientRect();safe={t:Math.max(8,top+4),b:nr&&nr.height?nr.top-hr.top-6:hr.height-8}}
 const hit=(a,b)=>a.l<b.r&&a.r>b.l&&a.t<b.b&&a.b>b.t;
 function entry(src){let e=map.get(src);if(e)return e;const el=document.createElement('div');el.className='isle-tb';el.innerHTML='<div class="tb-in"></div>';layer.append(el);
  e={src,el,inn:el.firstChild,x:0,y:0,init:false,key:'',order:++seq,on:false,offT:0,pend:0};map.set(src,e);return e}
 function syncContent(e){const s=e.src,t=s.textContent;if(e.key===t&&e.inn.childNodes.length)return;
  const typed=s.querySelector('.tw')||s._tw===t;if(!typed){e.pend=(e.pend||0)+1;if(e.pend<4)return}e.pend=0;e.key=t;
  e.inn.innerHTML=s.innerHTML;if(s.dataset.name){e.el.dataset.name=s.dataset.name;e.inn.dataset.name=s.dataset.name}else{delete e.el.dataset.name;delete e.inn.dataset.name}
  const c=s.style.getPropertyValue('--namec');if(c)e.inn.style.setProperty('--namec',c);e.inn.setAttribute('data-name',s.dataset.name||'');if(!s.dataset.name)e.inn.removeAttribute('data-name');e.order=++seq}
 function frame(now){requestAnimationFrame(frame);const dt=Math.min(.1,(now-last)/1000);last=now;
  const active=Nav.cur===0&&!document.hidden;if(!active){for(const e of map.values())hide(e);return}
  const srcs=root.querySelectorAll('.actor .bubble');if(!srcs.length&&!map.size)return;
  const hr=home.getBoundingClientRect(),W=hr.width;if(now-hudT>400){hudT=now;readHud(hr)}
  const shown=[];
  for(const src of srcs){const on=src.classList.contains('show')&&Cfg.v.bubbles!==false&&!!src.textContent.trim();if(!on){const e=map.get(src);if(e)hide(e);continue}
   const e=entry(src),actor=src.closest('.actor');if(!actor)continue;syncContent(e);const vo=actor.dataset.qvol||'';if(e.el.dataset.vol!==vo)e.el.dataset.vol=vo;
   const r=actor.getBoundingClientRect(),size=parseFloat(actor.style.getPropertyValue('--asz'))||r.height||100,k=r.height/size||1,btop=parseFloat(actor.style.getPropertyValue('--btop'))||size*.9;
   const ax=r.left+r.width/2-hr.left,ay=r.bottom-btop*k-hr.top;
   if(ax<-20||ax>W+20||ay<-60||ay>hr.height+40){hide(e);continue}
   e.ax=ax;e.ay=ay;e.w=e.el.offsetWidth;e.h=e.el.offsetHeight;shown.push(e)}
  shown.sort((a,b)=>a.order-b.order);const placed=[];
  for(const e of shown){const w=e.w,h=e.h;let x=e.ax-w/2,y=e.ay-h-9,flip=false;
   x=Math.min(Math.max(10,x),W-10-w);y=Math.min(Math.max(y,safe.t),safe.b-h);
   for(let it=0;it<8;it++){const box={l:x,t:y,r:x+w,b:y+h};const o=placed.find(p=>hit(box,p))||hud.find(p=>hit(box,p));if(!o)break;
    const isHud=hud.includes(o);
    if(isHud){const lx=o.l-w-4,rx=o.r+4;if(lx>=10&&(rx+w>W-10||Math.abs(lx-x)<=Math.abs(rx-x)))x=lx;else if(rx+w<=W-10)x=rx;else y=o.b+4;continue}
    const up=o.t-h-6,down=o.b+6;
    if(up>=safe.t)y=up;else if(down+h<=safe.b)y=down;else{const lx=o.l-w-6,rx=o.r+6;x=(lx>=10)?lx:(rx+w<=W-10?rx:x);y=Math.max(safe.t,Math.min(y,safe.b-h));break}}
   flip=y>e.ay;placed.push({l:x,t:y,r:x+w,b:y+h});
   const kk=e.init?1-Math.exp(-dt*16):1;e.x+=(x-e.x)*kk;e.y+=(y-e.y)*kk;e.init=true;
   e.el.style.transform=`translate3d(${e.x.toFixed(1)}px,${e.y.toFixed(1)}px,0)`;
   const tx=Math.min(Math.max(18,e.ax-e.x),w-18);e.inn.style.setProperty('--tx',tx.toFixed(1)+'px');
   if(flip)e.el.dataset.flip='1';else delete e.el.dataset.flip;
   if(!e.on){e.on=true;e.el.classList.remove('off');void e.el.offsetWidth;e.el.classList.add('on')}e.offT=0}
  for(const [src,e] of map){if(!src.isConnected){e.el.remove();map.delete(src)}}
 }
 function hide(e){if(!e.on){if(!e.offT)e.offT=performance.now();return}e.on=false;e.init=false;e.el.classList.remove('on');e.el.classList.add('off');e.offT=performance.now()}
 requestAnimationFrame(frame);
 // 設定裡關掉對話氣泡時，同步隱藏
 addEventListener('visibilitychange',()=>{if(document.hidden)for(const e of map.values())hide(e)});
}
})();
