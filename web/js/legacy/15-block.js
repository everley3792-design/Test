/* ===== 互動收納：可拖曳移動並記住位置 ===== */
(()=>{const K='ocs.fab.v1',fab=document.getElementById('fab'),tg=document.getElementById('qaToggle'),page=document.getElementById('p-home');if(!fab||!tg||!page)return;
 let pos=null;try{pos=JSON.parse(localStorage.getItem(K))}catch(e){}
 const cl=(v,a,b)=>Math.min(b,Math.max(a,v)),M=10;
 const lim=()=>{const p=page.getBoundingClientRect(),r=(s)=>{const n=document.querySelector(s);if(!n)return null;const b=n.getBoundingClientRect();return b.width?b:null};
  const ht=r('.hud-top'),nv=r('#nav'),w=fab.offsetWidth||58,h=fab.offsetHeight||58;
  return{p,w,h,minX:M,maxX:Math.max(M,p.width-w-M),minY:Math.max(8,ht?ht.bottom-p.top+8:80),maxY:Math.max(80,(nv?nv.top-p.top:p.height-90)-h-8)}};
 const flags=(x,y,L)=>{fab.classList.toggle('rt',x+L.w/2>L.p.width/2);const menu=fab.querySelector('.qa-more'),need=menu?.scrollHeight||300,above=y-L.minY-12,below=L.p.height-y-L.h-90;const down=above<need&&below>above;fab.classList.toggle('dn',down);fab.style.setProperty('--qa-max',Math.max(70,down?below:above)+'px')};
 const put=(x,y,L)=>{fab.style.left=x+'px';fab.style.top=y+'px';fab.style.bottom='auto';flags(x,y,L)};
 const dodge=(x,y,L)=>{const q=document.getElementById('qbag');if(!q)return y;const r=q.getBoundingClientRect();if(!r.width)return y;const qx=r.left-L.p.left,qy=r.top-L.p.top,pad=10;if(x+L.w+pad<qx||x>qx+r.width+pad)return y;if(y+L.h+pad<qy||y>qy+r.height+pad)return y;const below=qy+r.height+pad,above=qy-L.h-pad;return(below<=L.maxY&&(y-qy>=0||above<L.minY))?below:above>=L.minY?above:cl(below,L.minY,L.maxY)};
 const apply=(anim)=>{const L=lim();if(!pos){const r=fab.getBoundingClientRect();flags(r.left-L.p.left,r.top-L.p.top,L);return}if(!L.p.width)return;const x=Number.isFinite(pos.x)?cl(L.minX+pos.x*(L.maxX-L.minX),L.minX,L.maxX):pos.side==='R'?L.maxX:L.minX+4;let y=cl(pos.y*L.p.height,L.minY,L.maxY);y=cl(dodge(x,y,L),L.minY,L.maxY);if(anim){fab.classList.add('snap');setTimeout(()=>fab.classList.remove('snap'),380)}put(x,y,L)};
 let s=null,just=false;
 tg.addEventListener('pointerdown',e=>{if(e.button>0)return;const r=fab.getBoundingClientRect(),p=page.getBoundingClientRect();s={sx:e.clientX,sy:e.clientY,ox:r.left-p.left,oy:r.top-p.top,mv:false,id:e.pointerId};try{tg.setPointerCapture(e.pointerId)}catch(_){}});
 tg.addEventListener('pointermove',e=>{if(!s||e.pointerId!==s.id)return;if(!s.mv){if(Math.hypot(e.clientX-s.sx,e.clientY-s.sy)<8)return;s.mv=true;try{tg.setPointerCapture(e.pointerId)}catch(_){}fab.classList.remove('open');tg.setAttribute('aria-expanded','false');fab.classList.add('drag-on');if(navigator.vibrate)try{navigator.vibrate(6)}catch(_){}}
  const L=lim();s.x=cl(s.ox+e.clientX-s.sx,L.minX,L.maxX);s.y=cl(s.oy+e.clientY-s.sy,L.minY,L.maxY);put(s.x,s.y,L);e.preventDefault()});
 const end=e=>{if(!s)return;const w=s;s=null;fab.classList.remove('drag-on');if(!w.mv)return;just=true;setTimeout(()=>just=false,50);
  const L=lim();pos={side:w.x+L.w/2>L.p.width/2?'R':'L',x:cl((w.x-L.minX)/Math.max(1,L.maxX-L.minX),0,1),y:w.y/L.p.height};try{localStorage.setItem(K,JSON.stringify(pos))}catch(_){}apply(true)};
 tg.addEventListener('pointerup',end);tg.addEventListener('pointercancel',end);
 tg.addEventListener('click',e=>{if(just){e.stopImmediatePropagation();e.preventDefault()}},true);
 document.addEventListener('pointerup',()=>setTimeout(()=>apply(true),380),true);addEventListener('resize',()=>apply());addEventListener('orientationchange',()=>setTimeout(()=>apply(),200));
 try{new ResizeObserver(()=>apply()).observe(page);new ResizeObserver(()=>apply()).observe(fab.querySelector('.qa-more'))}catch(e){}
 apply();
})();
