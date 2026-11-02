/* ===== 2.4J 物理強化：拋擲彈跳・擠壓拉伸・家具碰撞推擠・落地彈跳・風雨搖擺 ===== */
(()=>{'use strict';
const cl=(v,a,b)=>Math.min(b,Math.max(a,v)),NO=()=>document.documentElement.dataset.motion==='reduce';
function init(){
 if(!(Home&&Home.stage&&Home.stage.W&&window.OCS24D&&OCS24D.Room&&typeof OCS24D.Room.kind==='function'&&typeof OCS24D.Room.findSpot==='function'&&OCS24D.Ed&&Items&&Stage&&Stage.prototype.update))return false;
 const Room=OCS24D.Room,Ed=OCS24D.Ed,known=new Set();let first=true,saveT=0,lastRes=0,wbase=.5;
 const kindOf=p=>{const it=Items.get(p.i);return it?Room.kind(it):''};
 const wobble=(e,dir,str)=>{if(NO()||!e)return;const now=performance.now();if(now-(e._wt||0)<350)return;e._wt=now;const b=e.querySelector('.rm-b');if(!b||!b.animate)return;
  const d=dir*str;b.animate([{rotate:'0deg'},{rotate:d+'deg',offset:.22},{rotate:-d*.62+'deg',offset:.5},{rotate:d*.3+'deg',offset:.74},{rotate:'0deg'}],{duration:760,easing:'cubic-bezier(.3,.7,.4,1)'})};
 const dropIn=e=>{if(NO()||!e)return;const b=e.querySelector('.rm-b'),sh=e.querySelector('.rm-sh');if(!b||!b.animate)return;
  b.animate([{translate:'0 -70px',scale:'.96 1.06',opacity:0,offset:0,easing:'cubic-bezier(.55,0,.9,.6)'},{opacity:1,offset:.08},{translate:'0 0',scale:'.96 1.06',offset:.44},{translate:'0 0',scale:'1.12 .84',offset:.52,easing:'ease-out'},{translate:'0 -16px',scale:'.97 1.04',offset:.7,easing:'ease-in'},{translate:'0 0',scale:'1.05 .94',offset:.82},{translate:'0 -4px',scale:'1 1',offset:.92},{translate:'0 0',scale:'1 1',opacity:1}],{duration:820});
  if(sh&&sh.animate)sh.animate([{scale:'.4 .4'},{scale:'.4 .4',offset:.4},{scale:'1.15 1.15',offset:.52},{scale:'.9 .9',offset:.7},{scale:'1 1'}],{duration:820})};
 /* 擺放／加入時落地彈跳 */
 const rr=Room.render;Room.render=function(){const r=rr.apply(this,arguments);const now=new Set();Room.els.forEach((e,u)=>{now.add(u);if(!known.has(u)){known.add(u);if(!first)dropIn(e)}});known.forEach(u=>{if(!now.has(u))known.delete(u)});first=false;return r};
 const quake=(s,imp)=>{const W=s.root.clientWidth,cx=s.x+s.size/2;for(const p of Room.list()){const k=kindOf(p);if(!k||k==='rug')continue;const e=Room.els.get(p.u);if(!e)continue;const dx=p.x*W-cx,f=1-Math.abs(dx)/(s.size*1.6);if(f<=0)continue;wobble(e,dx>=0?1:-1,cl(imp/260,1.5,8)*f)}};
 const nudge=(p,dir,v)=>{if(p.lock)return;const ox=p.x;p.x+=dir*cl(Math.abs(v)/9000,.004,.03);Room.clampPlacement(p);if(p.x!==ox){Room.render(Room.list());clearTimeout(saveT);saveT=setTimeout(()=>Room.save(),500)}};
 const collide=(s,v)=>{const W=s.root.clientWidth,H=s.root.clientHeight,cx=s.x+s.size/2,av=Math.abs(v);if(av<70||s.h>s.size*.3)return;
  for(const p of Room.list()){const k=kindOf(p);if(!k||k==='rug'||k==='bed')continue;const e=Room.els.get(p.u);if(!e)continue;const ix=p.x*W,half=e.offsetWidth*.36;
   if(Math.abs(cx-ix)>s.size*.2+half||Math.abs(s.feetY-p.y*H)>Math.max(28,H*.055))continue;
   const dir=ix>=cx?1:-1;if(v*dir<=0)continue;wobble(e,dir,cl(av/90,2,8));
   if(av>150&&(k==='toy'||(av>260&&(k==='plant'||k==='deco'))))nudge(p,dir,av)}};
 const windBase=()=>{let w=parseFloat(getComputedStyle(Home.stage.root).getPropertyValue('--wind'));if(Number.isFinite(w))return w*1.3;const id=(typeof Env!=='undefined'&&Env.wid)||'sunny';return({storm:2.4,rain:1.3,snow:.7,fog:.3,cloudy:.55,sunny:.45})[id]||.5};
 const dust=(s,n)=>{try{const x=s.x+s.size/2;for(let i=0;i<n;i++)Fx.burst(s,x+(i-n/2)*s.size*.12,s.feetY-2,2,['#EFE6D6','#D9CDB8','#F6F0E4'])}catch(e){}};
 const windKind={plant:1,lamp:.16};
 const u0=Stage.prototype.update;
 Stage.prototype.update=function(dt){
  if(this!==Home.stage)return u0.apply(this,arguments);
  const ph=this.h>0,pvy=this.vy,ps=this._ps,P=this._ph||(this._ph={d:0,dv:0,ex:0,ev:0,a:0,av:0,slide:0,dust:0});
  /* 拋擲：放開瞬間給更有力的初速 */
  if(ps==='held'&&this.state==='fall'){this.vx=cl((this.pvx||0)*1.1,-1400,1400);this.vy=cl((this.pvy||0)*1.05,-200,1250)}
  this._ps=this.state;const pvx0=this.vx;
  const r=u0.apply(this,arguments);
  const w=this.root.clientWidth,cx=this.x+this.size/2,d=Math.max(.001,dt||.016);
  if(!Ed.on&&Nav.cur===0){
   /* 落地：非線性反彈、地面摩擦滑行、彈性形變、揚塵 */
   const air=ph||this.h>0,mnx=this.minX,mxx=this.maxX;
   if(ph&&this.h===0){const imp=-pvy,sp=pvx0;
    if(imp>200){this.sqEl.classList.remove('sq');P.dv-=cl(imp/330,1,5);P.av+=-Math.sign(sp||1)*cl(Math.abs(sp)*.1,6,90);quake(this,imp);dust(this,Math.round(cl(imp/450,2,6)))}
    if(this.vy>0){this.vy=Math.min(imp*.42,860);this.vx=sp*.8}
    else if(Math.abs(sp)>90){P.slide=sp*.7;this.vx=0}}
   /* 撞牆：反彈、橫向壓縮、身體後仰 */
   if(air&&Math.abs(pvx0)>170&&(this.x<=mnx||this.x>=mxx)&&this.vx*pvx0<0){this.vx*=1.22;P.ev=cl(Math.abs(pvx0)/160,2,6);P.av+=-Math.sign(pvx0)*70;if(Math.abs(pvx0)>320)dust(this,2)}
   /* 地面摩擦滑行 */
   if(!air&&this.h===0&&this.state!=='held'&&!this.vy&&Math.abs(P.slide)>14&&!this.ws){this.x+=P.slide*d;if(this.x<mnx){this.x=mnx;P.slide=-P.slide*.4}else if(this.x>mxx){this.x=mxx;P.slide=-P.slide*.4}
    P.slide*=Math.exp(-5.2*d);P.dust-=d;if(P.dust<=0&&Math.abs(P.slide)>90){P.dust=.1;dust(this,1)}}
   else if(air||this.state==='held'||this.ws)P.slide=0;
   /* 空氣阻力與終端速度 */
   if(this.h>0&&this.state!=='held'){this.vy*=Math.exp(-.12*d);this.vy=Math.max(this.vy,-1700)}
   /* 與家具碰撞推擠 */
   if(!this._community&&this._pcx!=null)collide(this,(cx-this._pcx)/d);
   /* 風雨：盆栽與立燈隨風搖擺 */
   if(!NO()){const t=performance.now()/1000;if(t-lastRes>1){lastRes=t;wbase=windBase()}
    const g=.62+.38*Math.sin(t*.8)+.3*Math.sin(t*2.1+1.3)+(wbase>1?.35*Math.sin(t*5.3):0);
    for(const p of Room.list()){const f=windKind[kindOf(p)];if(!f)continue;const e=Room.els.get(p.u),b=e&&e.querySelector('.rm-b');if(!b)continue;
     const ph0=(p.u.charCodeAt(p.u.length-1)||0)*.37,deg=f*wbase*1.5*(g+.25*Math.sin(t*1.3+ph0));
     if(Math.abs(deg-(e._wd||0))>.03){e._wd=deg;b.style.rotate=deg.toFixed(2)+'deg'}}}}
  this._pcx=cx;
  /* 彈簧形變：空中拉伸、落地壓扁後果凍般回彈；拖曳／飛行時身體依速度擺盪 */
  {const h=Math.min(d,.033),held=this.state==='held',air2=this.h>0&&!held;
   const tg=air2?cl(Math.abs(this.vy)/4800,0,.13):0,ta=(P.lean||0)+(held?cl((this.pvx||0)*.03,-26,26):air2?cl(this.vx*.012,-24,24):cl(P.slide*.01,-10,10));
   P.dv+=(-240*(P.d-tg)-13*P.dv)*h;P.d=cl(P.d+P.dv*h,-.42,.3);
   P.ev+=(-240*P.ex-11.5*P.ev)*h;P.ex=cl(P.ex+P.ev*h,-.1,.34);
   P.av+=(-110*(P.a-ta)-10*P.av)*h;P.a=cl(P.a+P.av*h,-42,42);
   const e=this.sqEl;if(e&&!NO()){const q=Math.abs(P.d)>.002||Math.abs(P.ex)>.002,v=q?`${(1-.55*P.d-P.ex).toFixed(3)} ${(1+P.d+.4*P.ex).toFixed(3)}`:'',rt=Math.abs(P.a)>.08?P.a.toFixed(2)+'deg':'';
    if(e._sv!==v){e._sv=v;e.style.scale=v;if(v&&!e._so){e._so=1;e.style.transformOrigin='50% 100%'}}if(e._rv!==rt){e._rv=rt;e.style.rotate=rt}}}
  return r};
 return true}
const t=setInterval(()=>{try{if(init())clearInterval(t)}catch(e){console.error('[physics]',e);clearInterval(t)}},180);
})();
