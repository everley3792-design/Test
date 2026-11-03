(()=>{'use strict';
const PID='builtin_home_plant',SVG='<svg viewBox="0 0 64 92" aria-hidden="true"><ellipse cx="32" cy="87" rx="21" ry="4" fill="#576C56" opacity=".12"/><path d="M32 59C18 48 9 34 11 16C28 19 34 38 32 59Z" fill="var(--leaf-a)"/><path d="M32 59C38 41 44 25 58 17C60 39 45 53 32 59Z" fill="var(--leaf-b)"/><path d="M32 59C24 43 26 26 33 15C41 30 40 45 32 59Z" fill="var(--leaf-c)"/><path d="M32 59C31 43 24 31 16 24M33 57C40 42 49 32 54 25" stroke="#ECF7E6" stroke-opacity=".35" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M15 61L49 61L45 86Q32 92 20 86Z" fill="var(--pot)"/><path d="M33 63L49 63L45 86L34 89Z" fill="#927865" opacity=".17"/><path d="M13 60Q32 56 51 60L49 68Q32 71 15 67Z" fill="var(--pot-rim)"/><path d="M15 60Q32 57 49 60" fill="none" stroke="#FFF4E6" stroke-opacity=".45" stroke-width="2"/></svg>',cl=(v,a,b)=>Math.min(b,Math.max(a,v));
/* ---- 鏡頭跟隨按鈕：可拖曳、記住位置、避開其他浮動按鈕 ---- */
function camDrag(){const b=document.getElementById('camFollow'),page=document.getElementById('p-home');if(!b||!page)return false;
 const K='ocs.camfollow.v1',M=8;let pos=null,s=null,just=false;try{pos=JSON.parse(localStorage.getItem(K))}catch(e){}
 const rc=q=>{const n=document.querySelector(q);if(!n)return null;const r=n.getBoundingClientRect();return r.width?r:null};
 const lim=()=>{const p=page.getBoundingClientRect(),ht=rc('.hud-top'),nv=rc('#nav'),w=b.offsetWidth||38,h=b.offsetHeight||38;return{p,w,h,minX:M,maxX:Math.max(M,p.width-w-M),minY:Math.max(8,ht?ht.bottom-p.top+8:80),maxY:Math.max(80,(nv?nv.top-p.top:p.height-90)-h-8)}};
 const dodge=(x,y,L)=>{for(let k=0;k<2;k++)for(const q of['#qbag','#fab .qa-row']){const r=rc(q);if(!r)continue;const ox=r.left-L.p.left,oy=r.top-L.p.top,pd=8;if(x+L.w+pd<ox||x>ox+r.width+pd||y+L.h+pd<oy||y>oy+r.height+pd)continue;const dn=oy+r.height+pd,up=oy-L.h-pd;y=cl((Math.abs(dn-y)<Math.abs(up-y)&&dn<=L.maxY)||up<L.minY?dn:up,L.minY,L.maxY)}return y};
 const put=(x,y)=>{b.style.right='auto';b.style.left=x+'px';b.style.top=y+'px'};
 const apply=anim=>{if(!pos)return;const L=lim();if(!L.p.width)return;if(anim){b.classList.add('snap');setTimeout(()=>b.classList.remove('snap'),400)}put(cl(L.minX+pos.x*(L.maxX-L.minX),L.minX,L.maxX),cl(L.minY+pos.y*(L.maxY-L.minY),L.minY,L.maxY))};
 b.addEventListener('pointerdown',e=>{if(e.button>0)return;const r=b.getBoundingClientRect(),p=page.getBoundingClientRect();s={sx:e.clientX,sy:e.clientY,ox:r.left-p.left,oy:r.top-p.top,mv:false,id:e.pointerId};b.classList.remove('snap');try{b.setPointerCapture(e.pointerId)}catch(_){}});
 b.addEventListener('pointermove',e=>{if(!s||e.pointerId!==s.id)return;if(!s.mv){if(Math.hypot(e.clientX-s.sx,e.clientY-s.sy)<8)return;s.mv=true;b.classList.add('drag-on');try{navigator.vibrate&&navigator.vibrate(6)}catch(_){}}
  const L=lim();s.x=cl(s.ox+e.clientX-s.sx,L.minX,L.maxX);s.y=cl(s.oy+e.clientY-s.sy,L.minY,L.maxY);put(s.x,s.y);e.preventDefault()});
 const end=()=>{if(!s)return;const w=s;s=null;b.classList.remove('drag-on');if(!w.mv)return;just=true;setTimeout(()=>just=false,120);
  const L=lim();let x=w.x;if(x-L.minX<30)x=L.minX;else if(L.maxX-x<30)x=L.maxX;const y=dodge(x,w.y,L);
  pos={x:cl((x-L.minX)/Math.max(1,L.maxX-L.minX),0,1),y:cl((y-L.minY)/Math.max(1,L.maxY-L.minY),0,1)};try{localStorage.setItem(K,JSON.stringify(pos))}catch(_){}apply(true);try{buzz(6)}catch(_){}};
 b.addEventListener('pointerup',end);b.addEventListener('pointercancel',end);
 b.addEventListener('click',e=>{if(just){e.stopImmediatePropagation();e.preventDefault()}},true);
 addEventListener('resize',()=>apply());addEventListener('orientationchange',()=>setTimeout(()=>apply(),200));
 try{new ResizeObserver(()=>apply()).observe(page)}catch(e){}
 apply();return true}
const t1=setInterval(()=>{try{if(camDrag())clearInterval(t1)}catch(e){console.error('[camDrag]',e);clearInterval(t1)}},150);
/* ---- 盆栽家具化 ---- */
function plantInit(){
 if(!(Home&&Home.stage&&Home.stage.W&&window.OCS24D&&OCS24D.Room&&OCS24D.Room.st&&OCS24D.Ed&&Items&&Items.d&&Life&&Life.spots&&typeof OCS24D.Room.kind==='function'&&typeof OCS24D.Room.clampPlacement==='function'&&typeof OCS24D.Room.findSpot==='function'&&OCS24D.Room.d&&OCS24D.Room.d.s&&OCS24D.Room.d.s.home))return false;
 const Room=OCS24D.Room,Ed=OCS24D.Ed,st=Room.st,oi=Items.icon;
 Items.icon=function(i){return i&&i.id===PID?'<span class="plant-art">'+SVG+'</span>':oi.apply(this,arguments)};
 let fresh=false;
 if(!Room.d.legacyPlant){
  if(!Items.get(PID))Items.d.items.push(Items.norm({id:PID,name:'家中盆栽',cat:'furn',qty:0,builtin:1,tags:['家具','植物'],desc:'小屋旁的老朋友。長按可移動、擺放，也能收回背包。',consume:false,target:'scene',uses:[{type:'furn',fx:{hearts:2,mood:'calm'}}]}));
  const W=st.root.clientWidth,H=st.root.clientHeight,sz=st.size,p={u:'f_legacy_plant',i:PID,x:(W*.06+sz*.18)/W,y:(st.feetY+10)/H,s:1,r:0,z:0,f:1,on:0,w:0},dp=.72+.4*cl((p.y-.5)/.44,0,1);
  p.s=cl(sz*.517/(.2*W*dp),.3,3);Room.clampPlacement(p);Room.d.s.home.push(p);Room.d.legacyPlant=1;Room.save();try{Items.save()}catch(e){}Items.emit();fresh=true}
 document.querySelectorAll('#homeStage .plant').forEach(n=>n.remove());
 /* 澆水等互動改以「場景中最近的盆栽」為對象 */
 Home.plantEl=function(){if(Ed.on)return null;const s=this.stage||st,cx=s.x+s.size/2,W=s.root.clientWidth;let best=null,bd=1e9;for(const p of Room.list()){const it=Items.get(p.i);if(!it||Room.kind(it)!=='plant')continue;const e=Room.els.get(p.u);if(!e)continue;const d=Math.abs(p.x*W-cx);if(d<bd){bd=d;best=e}}return best};
 const et=Home.enterTool;Home.enterTool=function(){if(!Home.plantEl()){if(!this.wbusy){this.stage.say('場景裡還沒有盆栽，從背包把盆栽放出來吧！');try{buzz(6)}catch(e){}}return}return et.apply(this,arguments)};
 document.addEventListener('click',e=>{if(!Home.wt)return;const n=e.target.closest&&e.target.closest('.rm-it');if(n&&n===Home.plantEl()){e.stopImmediatePropagation();e.preventDefault();Home.waterPlant()}},true);
 /* 夥伴照顧盆栽的位置，跟著盆栽走；沒有盆栽就不會去 */
 const sync=()=>{const s=Home.stage;if(!s||!s.spots)return;const W=s.root.clientWidth,sz=s.size,cx=s.x+sz/2;let px=null,bd=1e9;for(const p of Room.list()){const it=Items.get(p.i);if(!it||Room.kind(it)!=='plant')continue;const d=Math.abs(p.x*W-cx);if(d<bd){bd=d;px=p.x*W}}
  if(px==null){s.spots.plant=NaN;return}const side=px<W/2?1:-1;s._plantSide=side;s.spots.plant=cl(px+side*sz*.46-sz/2,s.lo(),s.hi())};
 const sp=Life.spots.plant;if(sp){Object.defineProperty(sp,'face',{get(){const s=Home.stage;return s&&s._plantSide>0?-1:1},configurable:true});sp.acts.forEach(a=>{a.can=()=>Number.isFinite(Home.stage&&Home.stage.spots&&Home.stage.spots.plant)})}
 const cs=Stage.prototype.calcSpots;Stage.prototype.calcSpots=function(){const r=cs.apply(this,arguments);if(this===Home.stage)sync();return r};
 const rr=Room.render;Room.render=function(){const r=rr.apply(this,arguments);if(!Ed.on)sync();return r};
 const ru=Room.use,ra=Room.act;Room.use=function(u,force){if(force){const p=Room.list().find(q=>q.u===u),it=p&&Items.get(p.i);if(it&&Room.kind(it)==='plant')Room._userPlant=u}return ru.apply(this,arguments)};
 const wa=(n,k,o)=>{try{return n.animate(k,o)}catch(_){return {cancel(){}}}},rnd=(a,b)=>a+Math.random()*(b-a);
 const pour=(p,user)=>{const e=Room.els.get(p.u);if(!e){Room._pouring=0;return}const b=e.querySelector('.rm-b'),W=st.root.clientWidth,cx=st.x+st.size/2,dir=p.x*W>=cx?1:-1,P=st._ph||(st._ph={d:0,dv:0,ex:0,ev:0,a:0,av:0,slide:0,dust:0});
  const alive=()=>e.isConnected&&!Ed.on,T=[],at=(ms,f)=>T.push(setTimeout(()=>{if(alive())f()},ms)),mk=(c,h,css)=>{const n=document.createElement('div');n.className=c;if(h)n.innerHTML=h;if(css)n.style.cssText=css;e.append(n);return n};
  Room._pouring=1;p.w=Date.now();Room.save();try{st.go('stand')}catch(_){}st.dir=dir;try{st.render&&st.render(true)}catch(_){}
  P.lean=dir*8;const L=['咕嚕咕嚕～','多喝點水喔。','快快長大！'];st.say(L[Math.floor(Math.random()*L.length)],2400);try{buzz(4)}catch(_){}
  const can=mk('pw-can',Fx.CAN,`left:${dir>0?'46%':'-8%'};transform-origin:${dir>0?'18% 72%':'82% 72%'};scale:${dir>0?'1 1':'-1 1'}`),sg=dir>0?-1:1,wet=mk('pw-wet'),objs=[can,wet];
  const dr=wa(b,[{scale:'1 1'},{scale:'1 .94'}],{duration:380,fill:'forwards',easing:'ease-out'});
  wa(can,[{opacity:0,translate:`${dir*26}px -12px`,rotate:'0deg'},{opacity:1,translate:'0 0',rotate:'0deg'}],{duration:380,fill:'forwards',easing:'cubic-bezier(.2,.8,.3,1)'});
  at(380,()=>wa(can,[{rotate:'0deg'},{rotate:sg*40+'deg',offset:.7},{rotate:sg*32+'deg'}],{duration:480,fill:'forwards',easing:'ease-out'}));
  at(820,()=>{wa(wet,[{opacity:0},{opacity:1}],{duration:1300,fill:'forwards'});wa(can,[{rotate:sg*32+'deg',translate:'0 0'},{rotate:sg*35+'deg',translate:`${-dir*1.5}px 0`},{rotate:sg*32+'deg',translate:`${dir*1.5}px 0`},{rotate:sg*33+'deg',translate:'0 0'}],{duration:260,iterations:6,fill:'forwards'});
   const z=Math.max(.2,e.getBoundingClientRect().width/Math.max(1,e.offsetWidth)),sy=e.offsetHeight*.63;let n=0;const iv=setInterval(()=>{if(!alive()||n++>26){clearInterval(iv);return}
    const er=e.getBoundingClientRect(),cr=can.getBoundingClientRect(),lx=(cr.left+cr.width*(dir>0?.14:.86)-er.left)/z+rnd(-2,2),ly=(cr.top+cr.height*.6-er.top)/z,tx=e.offsetWidth*rnd(.4,.6),fall=Math.max(12,sy-ly),d=mk('pw-d','',`left:${lx}px;top:${ly}px`);objs.push(d);
    wa(d,[{translate:'0 0',opacity:1},{translate:`${(tx-lx)*.9}px ${fall}px`,opacity:1,offset:.92},{translate:`${tx-lx}px ${fall}px`,opacity:0}],{duration:240+fall*2.4,easing:'cubic-bezier(.5,0,.9,.55)',fill:'forwards'}).onfinish=()=>{d.remove();if(!e.isConnected)return;
     for(let i=0;i<3;i++){const s=mk('pw-d pw-s','',`left:${tx}px;top:${sy}px`),vx=rnd(-14,14),h=rnd(8,16);wa(s,[{translate:'0 0',opacity:1},{translate:`${vx*.5}px ${-h}px`,offset:.45},{translate:`${vx}px 2px`,opacity:0}],{duration:300,easing:'ease-out'}).onfinish=()=>s.remove()}
     if(n%3===0){const r=mk('pw-rip');wa(r,[{scale:'.2 .2',opacity:.8},{scale:'1.2 1.2',opacity:0}],{duration:520,easing:'ease-out'}).onfinish=()=>r.remove()}}},58)});
  at(2050,()=>{dr.cancel();if(b)wa(b,[{scale:'1 1'},{scale:'1.06 .93',offset:.2},{scale:'.96 1.1',offset:.45},{scale:'1.03 .98',offset:.7},{scale:'1 1'}],{duration:950,easing:'ease-out'});
   try{Fx.burst(st,e.getBoundingClientRect().left-st.root.getBoundingClientRect().left+e.offsetWidth*.5,e.getBoundingClientRect().top-st.root.getBoundingClientRect().top+e.offsetHeight*.3,6,['#BFE6FF','#CFEBC2','#FFFFFF','#A6DCF5'])}catch(_){}try{buzz(10)}catch(_){}});
  at(2350,()=>{wa(can,[{rotate:sg*32+'deg',opacity:1},{rotate:'0deg',opacity:1,offset:.6},{rotate:'0deg',translate:`${dir*26}px -12px`,opacity:0}],{duration:520,fill:'forwards',easing:'ease-in-out'});P.lean=0;st.hearts(1);if(user)try{Eco.act('water')}catch(_){}});
  at(2700,()=>{st.say(['好喝嗎？','長高一點點囉！','葉子變得有精神了～'][Math.floor(Math.random()*3)],2400);try{st.go('bounce')}catch(_){}});
  const fin=()=>{T.forEach(clearTimeout);objs.forEach(n=>n.remove());e.querySelectorAll('.pw-d,.pw-rip').forEach(n=>n.remove());P.lean=0;Room._pouring=0};
  T.push(setTimeout(fin,3300));if(!user)void 0};
 Room.act=function(p,kd){if(kd==='plant'){if(Room._pouring)return;if(document.documentElement.dataset.motion!=='reduce'){const u=Room._userPlant===p.u;Room._userPlant=null;pour(p,u);return}}
  const r=ra.apply(this,arguments);if(kd==='plant'&&Room._userPlant===p.u){Room._userPlant=null;try{Eco.act('water')}catch(e){}}return r};
 Room.render(Room.list());sync();
 
 return true}
const t2=setInterval(()=>{try{if(plantInit())clearInterval(t2)}catch(e){console.error('[plant furniture]',e);clearInterval(t2)}},150);
})();
