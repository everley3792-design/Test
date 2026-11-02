(()=>{'use strict';
window.OCSWorldRect={l:-.95,r:1.95,t:-.18,b:1.3};
const reduce=()=>document.documentElement.dataset.motion==='reduce';
const rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)],cl=(v,a,b)=>Math.min(b,Math.max(a,v));
const nowMs=()=>Date.now();

/* =========================================================
   1. 轉場：頁面、底部面板、設定面板
   ========================================================= */
const EASE='cubic-bezier(.2,.9,.25,1)';
function rise(list,{dx=0,dy=16,base=50,step=34,dur=460,max=9}={}){
 if(reduce())return;let k=0;
 for(const e of list){if(k>=max)break;if(!e||!e.animate||!e.getClientRects().length)continue;
  e.animate([{opacity:0,transform:`translate3d(${dx}px,${dy}px,0) scale(.985)`},{opacity:1,transform:'none'}],{duration:dur,delay:base+k*step,easing:EASE,fill:'backwards'});k++}
}
function pageParts(page){
 const sc=page.querySelector('.scroll')||page,out=[];
 for(const c of sc.children){if(c.matches('script,style,template'))continue;
  if(c.children.length>2&&c.offsetHeight>innerHeight*.9&&!c.matches('.phead')){for(const g of c.children)out.push(g)}else out.push(c)}
 return out;
}
function hudParts(){return ['.hud-top','#hudCap','#isleClock','#hudRail','#fab','.hud-quest','#qbFab','.cam-follow'].map(s=>document.querySelector('#p-home '+s)).filter(Boolean)}
function bindPages(){
 const go=Nav.go;
 Nav.go=function(i,silent){const from=this.cur,r=go.apply(this,arguments);
  try{if(!silent&&!reduce()&&from!==i&&this.cur===i){const dir=i>from?1:-1,inc=this.pages[i],out=this.pages[from];
   if(i===0){rise(hudParts(),{dy:-10,base:90,step:30,dur:520});
    /* 3.2：回到首頁不再推動鏡頭（會造成整個天空與場景跳動） */}
   else rise(pageParts(inc),{dx:dir*26,dy:10,base:40,step:36,dur:480});
   /* 3.1：離開的頁面保持不動，由新頁面覆蓋上來，避免兩頁同時半透明造成閃爍 */
  }}catch(e){console.warn('[isle 2.7 page]',e)}
  return r};
}
function bindSheets(){
 const os=openSheet;
 openSheet=function(html,opts){const api=os.apply(this,arguments);
  try{if(!reduce())requestAnimationFrame(()=>{if(api.closed)return;const sh=api.el,body=sh.querySelector('.sh-body')||sh;
   let items=[...body.children].filter(e=>!e.matches('.sheet-close,.sh-grab'));
   if(items.length<=2){const deep=[];items.forEach(e=>{if(e.children.length>2&&!e.matches('.sh-title'))deep.push(...e.children);else deep.push(e)});items=deep}
   rise(items,{dy:18,base:90,step:32,dur:480,max:10})})}catch(e){}
  return api};
 // 設定等全頁面板
 const mo=new MutationObserver(ms=>{for(const m of ms){const p=m.target;if(!p.classList||!p.classList.contains('ovp'))continue;const open=p.classList.contains('open');if(open&&!p._isleOpen){const body=p.querySelector('.ov-body,.scroll,.ovb')||p.children[1]||p;rise([...body.children],{dx:18,dy:6,base:110,step:30,dur:460,max:10})}p._isleOpen=open}});
 const watch=()=>document.querySelectorAll('.ovp').forEach(p=>{if(p._isleWatch)return;p._isleWatch=1;mo.observe(p,{attributes:true,attributeFilter:['class']})});watch();setTimeout(watch,2500);setTimeout(watch,8000);
 // 抽屜與陪伴鍵：給每個磚塊一個順序編號
 const idx=()=>{document.querySelectorAll('#hudRail .rail-ext .rail-btn').forEach((b,k)=>b.style.setProperty('--k',k));document.querySelectorAll('#fab .qa-pill').forEach((b,k)=>b.style.setProperty('--k',k))};
 idx();const rail=document.getElementById('hudRail'),fab=document.getElementById('fab');
 [rail,fab].forEach(n=>n&&new MutationObserver(idx).observe(n,{attributes:true,attributeFilter:['class']}));
}

/* =========================================================
   2. 更大的島：可走範圍、地形遮罩、世界物件
   ========================================================= */
let C,W=0,H=0;
const Mask={x0:-1,y0:.5,dx:.012,dy:.008,cols:251,rows:101,a:new Int8Array(251*101)};
function onLand(x,y){
 const G=window.IsleGround;if(!G||!G.sand)return true;
 const i=Math.round((x-Mask.x0)/Mask.dx),j=Math.round((y-Mask.y0)/Mask.dy);if(i<0||j<0||i>=Mask.cols||j>=Mask.rows)return false;
 const k=j*Mask.cols+i;let v=Mask.a[k];
 if(!v){const cx=Mask.x0+i*Mask.dx,cy=Mask.y0+j*Mask.dy,X=(cx+1)*1000,Y=(cy-.54)/.736*1000;let ok=true;
  try{const S=G.sand,P=(a,b)=>S.isPointInFill(new DOMPoint(a,b));ok=Y>4&&P(X,Y+46)&&P(X-44,Y+18)&&P(X+44,Y+18)}catch(_){ok=true}
  v=Mask.a[k]=ok?1:2}
 return v===1;
}
const TREE_SVG=()=>{try{return `<svg viewBox="-36 -106 72 112" aria-hidden="true">${SCENE_TREE(0,0,1)}</svg>`}catch(_){return '<svg viewBox="-36 -106 72 112"><rect x="-5" y="-30" width="10" height="32" fill="#8A6648"/><circle cx="0" cy="-60" r="34" fill="#6FB563"/></svg>'}};
const FIRE_SVG=`<svg viewBox="0 0 90 64" aria-hidden="true">
 <ellipse class="glow" cx="45" cy="44" rx="44" ry="20" fill="rgba(255,190,90,.38)"/>
 <ellipse cx="45" cy="54" rx="34" ry="8" fill="rgba(60,40,20,.18)"/>
 <g fill="#A99C8C"><ellipse cx="18" cy="52" rx="7" ry="4.5"/><ellipse cx="31" cy="57" rx="7" ry="4.5"/><ellipse cx="47" cy="59" rx="7.5" ry="4.5"/><ellipse cx="63" cy="57" rx="7" ry="4.5"/><ellipse cx="74" cy="51" rx="6.5" ry="4.2"/><ellipse cx="26" cy="46" rx="6" ry="3.8" fill="#BEB2A3"/><ellipse cx="66" cy="45" rx="6" ry="3.8" fill="#BEB2A3"/></g>
 <path d="M24 52L64 38" stroke="#8A5E3C" stroke-width="7" stroke-linecap="round"/><path d="M26 39L66 52" stroke="#9C6B45" stroke-width="7" stroke-linecap="round"/>
 <path class="fl" d="M45 50C31 46 33 30 41 22C41 30 46 31 47 24C54 31 59 45 45 50Z" fill="#F7894A"/>
 <path class="fl b" d="M45 50C37 47 38 37 43 31C44 36 47 37 48 33C52 38 54 47 45 50Z" fill="#FFC14D"/>
 <path class="fl c" d="M45 50C41 48 42 43 45 39C47 43 49 47 45 50Z" fill="#FFF0A8"/>
 <circle class="ember" cx="44" cy="30" r="1.6" fill="#FFD27A"/><circle class="ember b" cx="50" cy="28" r="1.3" fill="#FFB65C"/><circle class="ember c" cx="40" cy="32" r="1.2" fill="#FFE39A"/>
</svg>`;
const BENCH_SVG=`<svg viewBox="0 0 100 58" aria-hidden="true"><ellipse cx="50" cy="55" rx="44" ry="4" fill="rgba(60,40,20,.16)"/>
 <g fill="#7A5A3F"><rect x="14" y="30" width="6" height="26" rx="2"/><rect x="80" y="30" width="6" height="26" rx="2"/><rect x="18" y="6" width="5" height="26" rx="2"/><rect x="77" y="6" width="5" height="26" rx="2"/></g>
 <rect x="8" y="27" width="84" height="8" rx="3" fill="#C49A6C"/><rect x="8" y="27" width="84" height="3" rx="1.5" fill="#E0BB8A"/>
 <rect x="12" y="6" width="76" height="7" rx="3" fill="#B98D60"/><rect x="12" y="16" width="76" height="6" rx="3" fill="#C49A6C"/></svg>`;
const ROCK_SVG=(a,b)=>`<svg viewBox="0 0 60 34" aria-hidden="true"><ellipse cx="30" cy="31" rx="27" ry="3.5" fill="rgba(40,50,40,.16)"/><path d="M6 30C3 18 12 7 26 6C40 4 55 12 56 26C56 30 50 31 30 31C14 31 7 31 6 30Z" fill="${a}"/><path d="M14 14C20 9 30 8 36 10" stroke="rgba(255,255,255,.45)" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M38 30C46 26 50 20 51 14C55 19 56 27 52 30Z" fill="${b}" opacity=".6"/></svg>`;
const SIGN_SVG=`<svg viewBox="0 0 40 46" aria-hidden="true"><rect x="18" y="18" width="4.5" height="28" rx="2" fill="#8A6648"/><rect x="2" y="3" width="36" height="20" rx="5" fill="#D9AE78"/><rect x="2" y="3" width="36" height="20" rx="5" fill="none" stroke="#9C7448" stroke-width="2"/><g transform="translate(20 13)"><circle r="3.4" cx="0" cy="-3.4" fill="#F5A3B5"/><circle r="3.4" cx="3.4" cy="0" fill="#F5A3B5"/><circle r="3.4" cx="0" cy="3.4" fill="#F5A3B5"/><circle r="3.4" cx="-3.4" cy="0" fill="#F5A3B5"/><circle r="2.4" fill="#FFE27A"/></g></svg>`;
const PROPS=[
 {id:'bigtree',x:1.30,y:.625,w:.46,h:.716,obs:[.026,.012],html:TREE_SVG},
 {id:'campfire',x:.22,y:1.0,w:.17,h:.12,obs:[.05,.02],html:()=>FIRE_SVG,tap:1,cls:'isle-fire'},
 {id:'bench',x:.66,y:1.035,w:.21,h:.122,obs:null,html:()=>BENCH_SVG},
 {id:'rock1',x:1.5,y:.95,w:.15,h:.085,obs:[.045,.014],html:()=>ROCK_SVG('#B8B3A6','#8E897D')},
 {id:'rock2',x:-.5,y:.98,w:.11,h:.062,obs:[.032,.011],html:()=>ROCK_SVG('#C3BCA9','#958E7E')},
 {id:'rock3',x:1.56,y:.97,w:.07,h:.04,obs:[.018,.008],html:()=>ROCK_SVG('#ADA899','#8E897D')},
 {id:'msign',x:-.2,y:.6,w:.075,h:.086,obs:[.008,.005],html:()=>SIGN_SVG,tap:1}
];
const P={};PROPS.forEach(p=>P[p.id]=p);
function buildProps(){
 const world=C.world;
 for(const p of PROPS){if(p.el)continue;const d=document.createElement('div');d.className='isle-prop '+(p.cls||'');d.dataset.prop=p.id;if(p.tap)d.dataset.tap='1';d.innerHTML=p.html();d.style.left=(p.x*100)+'%';d.style.top=(p.y*100)+'%';world.append(d);p.el=d}
 layoutProps();
}
function layoutProps(){
 for(const p of PROPS){if(!p.el)continue;const s=C.scale(p.y);p.el.style.width=(p.w*W*s).toFixed(1)+'px';p.el.style.height=(p.h*W*s).toFixed(1)+'px';p.el.style.zIndex=String(p.flat?12:Math.round(p.y*10000)*16)}
}
function propObs(){const out=[];for(const p of PROPS){if(!p.obs)continue;const s=C.scale(p.y);out.push({p:{u:'isle_'+p.id},x:p.x*W,y:p.y*H,rx:p.obs[0]*W*s,ry:p.obs[1]*W*s})}return out}
// 花海：島的西邊
function buildMeadow(){
 const G=window.IsleGround;if(!G||G.g.querySelector('.isle-meadow'))return;const mark=document.createElement('i');mark.className='isle-meadow';G.g.append(mark);
 let s=97;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};
 const FC=[['#F5A3B5','#FFE27A'],['#FFF8EE','#F6C445'],['#C7B5EC','#FFF2B8'],['#F8C7D3','#fff'],['#FFD27A','#F29A3A']];
 const fl=([a,b])=>`<svg viewBox="0 0 16 16"><g style="fill:color-mix(in oklab,${a} 76%,var(--isle-tint))"><circle cx="8" cy="4.5" r="3.1"/><circle cx="11.5" cy="8" r="3.1"/><circle cx="8" cy="11.5" r="3.1"/><circle cx="4.5" cy="8" r="3.1"/></g><circle cx="8" cy="8" r="2.3" fill="${b}"/></svg>`;
 for(let k=0,n=0;k<500&&n<90;k++){const a=r()*Math.PI*2,rr=Math.sqrt(r()),x=-.36+Math.cos(a)*rr*.24,y=.72+Math.sin(a)*rr*.1;if(!onLand(x,y))continue;n++;const p=G.PC(x,y),d=document.createElement('div');d.className='isle-d isle-fl'+(r()<.3?' big':'');d.style.cssText=`left:${p.l}%;top:${p.t}%;scale:${.8+r()*.5}`;d.innerHTML=fl(FC[Math.floor(r()*FC.length)]);G.g.append(d)}
}

/* ---------- 尋路：更大的格子、二元堆積、路徑拉直 ---------- */
let avoid=null;const obsCache={k:'',v:null};
function patchNav(){
 const origObs=C.obstacles;
 C.obstacles=function(ignore){const k=ignore+'|'+Math.floor(performance.now()/80)+'|'+this.W+'|'+this.H;if(obsCache.k===k)return obsCache.v;const v=origObs.call(this,ignore).concat(propObs());obsCache.k=k;obsCache.v=v;return v};
 C.blocked=function(x,y,n,ignore){const b=this.limits(n);if(x<b.left||x>b.right||y<b.min||y>b.max)return true;if(!onLand(x,y))return true;
  const f=this.footprint(n),Wd=this.W,Ht=this.H;for(const o of this.obstacles(ignore)){if(((x*Wd-o.x)/(o.rx+f.x*.6))**2+((y*Ht-o.y)/(o.ry+f.y*.6))**2<1)return true}
  if(avoid&&avoid.n===n){for(const q of this.nodes.values()){if(q===n||(q.path.length&&!avoid.all))continue;if(Math.hypot((q.x-x)*Wd,(q.y-y)*Ht*1.4)<(q.s.size+n.s.size)*.3)return true}}
  return false};
 C.nearest=function(x,y,n,ignore,others=false){const b=this.bounds(),NX=96,NY=40,sx=(b.right-b.left)/NX,sy=(b.max-b.min)/NY;
  const ci=cl(Math.round((x-b.left)/sx),0,NX),cj=cl(Math.round((y-b.min)/sy),0,NY);let best=null,score=Infinity;
  const test=(i,j)=>{if(i<0||j<0||i>NX||j>NY)return;const px=b.left+i*sx,py=b.min+j*sy;const d=((px-x)*this.W)**2+((py-y)*this.H*1.7)**2;if(d>=score)return;if(others?!this.free(px,py,n,ignore):this.blocked(px,py,n,ignore))return;score=d;best={x:px,y:py}};
  if(!(others?!this.free(x,y,n,ignore):this.blocked(x,y,n,ignore)))return {x,y};
  const unit=Math.min(sx*this.W,sy*this.H*1.7);
  for(let r=0;r<=NX;r++){if(best&&(r-1)*unit>Math.sqrt(score))break;
   for(let i=ci-r;i<=ci+r;i++){test(i,cj-r);if(r)test(i,cj+r)}for(let j=cj-r+1;j<=cj+r-1;j++){test(ci-r,j);if(r)test(ci+r,j)}}
  return best};
 C.clear=function(a,b,n,ignore){const L=Math.hypot((b.x-a.x)*this.W,(b.y-a.y)*this.H),steps=Math.max(1,Math.ceil(L/9));for(let k=1;k<=steps;k++){const t=k/steps;if(this.blocked(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,n,ignore))return false}return true};
 C.route=function(n,goal,ignore){const b=this.bounds(),cols=73,rows=31,Wd=this.W,Ht=this.H;
  const ix=x=>cl(Math.round((x-b.left)/(b.right-b.left)*(cols-1)),0,cols-1),iy=y=>cl(Math.round((y-b.min)/(b.max-b.min)*(rows-1)),0,rows-1),xy=k=>({x:b.left+(k%cols)/(cols-1)*(b.right-b.left),y:b.min+Math.floor(k/cols)/(rows-1)*(b.max-b.min)});
  const end=this.nearest(goal.x,goal.y,n,ignore);if(!end)return [];
  if(this.clear({x:n.x,y:n.y},end,n,ignore))return [end];
  const start=iy(n.y)*cols+ix(n.x),finish=iy(end.y)*cols+ix(end.x),N=cols*rows,g=new Float64Array(N).fill(Infinity),prev=new Int32Array(N).fill(-1),closed=new Uint8Array(N),bad=new Int8Array(N);
  const isBad=k=>{if(k===start||k===finish)return false;if(!bad[k]){const p=xy(k);bad[k]=this.blocked(p.x,p.y,n,ignore)?1:2}return bad[k]===1};
  const ex=end.x,ey=end.y,hh=k=>{const a=xy(k);return Math.hypot((a.x-ex)*Wd,(a.y-ey)*Ht*1.4)};
  const heap=[],push=(k,f)=>{heap.push([f,k]);let i=heap.length-1;while(i>0){const p=(i-1)>>1;if(heap[p][0]<=heap[i][0])break;[heap[p],heap[i]]=[heap[i],heap[p]];i=p}},
   pop=()=>{const top=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let i=0;for(;;){const l=i*2+1,r=l+1;let m=i;if(l<heap.length&&heap[l][0]<heap[m][0])m=l;if(r<heap.length&&heap[r][0]<heap[m][0])m=r;if(m===i)break;[heap[m],heap[i]]=[heap[i],heap[m]];i=m}}return top};
  g[start]=0;push(start,hh(start));let found=false,guard=0;
  const D=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  while(heap.length&&guard++<N*3){const [,k]=pop();if(k===finish){found=true;break}if(closed[k])continue;closed[k]=1;const x=k%cols,y=(k/cols)|0,a=xy(k);
   for(const [dx,dy] of D){const xx=x+dx,yy=y+dy;if(xx<0||xx>=cols||yy<0||yy>=rows)continue;const q=yy*cols+xx;if(closed[q]||isBad(q)||dx&&dy&&(isBad(y*cols+xx)||isBad(yy*cols+x)))continue;
    const bb=xy(q),c=g[k]+Math.hypot((a.x-bb.x)*Wd,(a.y-bb.y)*Ht*1.4);if(c<g[q]){g[q]=c;prev[q]=k;push(q,c+hh(q))}}}
  if(!found)return [];const raw=[];for(let k=finish;k!==start;k=prev[k]){if(k<0)return [];raw.unshift(xy(k))}
  raw.push(end);
  // 拉直：從目前位置往前找最遠可直達的點
  const pts=[{x:n.x,y:n.y},...raw],out=[];let i=0;
  while(i<pts.length-1){let j=i+1;while(j+1<pts.length&&this.clear(pts[i],pts[j+1],n,ignore))j++;out.push(pts[j]);i=j}
  return out};
}

/* ---------- 走路：加減速、互相讓路、卡住時重新規劃 ---------- */
function patchWalk(){
 const origInterrupt=C.interrupt;
 C.interrupt=function(n){if(n&&n.act){try{n.act.cleanup&&n.act.cleanup(n)}catch(_){}n.act=null}if(n){n.v=0;delete n.s.actor.dataset.isleAct;if(n.s.art&&n.s._isleAnim){n.s._isleAnim.forEach(a=>a.cancel());n.s._isleAnim=null}}return origInterrupt.apply(this,arguments)};
 C.walk=function(n,dt){
  const s=n.s,task=n.task;
  if(!n.path.length){if(task&&task.type==='activity'&&task.arrived)Act.tick(n,dt,task);return}
  if(s.state==='held'||s._fd||s._toy||s.sleeping()){this.interrupt(n);return}
  if(task&&task.delay>0){task.delay-=dt;return}
  const Wd=this.W,Ht=this.H,g=n.path[0],last=n.path.length===1;
  let dx=(g.x-n.x)*Wd,dy=(g.y-n.y)*Ht*1.4,dist=Math.hypot(dx,dy);
  const pace=Persona.eff(s.ch.data).pace;let vmax=(31+pace*.38)*(task?.type==='social'?1.12:1)*(task?.run?1.75:1)*(task?.slow?.78:1)*(window.IsleLife?IsleLife.speed(n):1);
  if(last)vmax*=cl(dist/30,.35,1);
  n.v=n.v||0;n.v+=cl(vmax-n.v,-vmax*5*dt,vmax*3.2*dt);
  const step=Math.max(4,n.v)*dt;
  if(dist<=step+1.2){n.x=g.x;n.y=g.y;n.path.shift();n.blockT=0;if(n.path.length){this._facing(n,dx,dy,dt);return}this._arrive(n);return}
  let ux=dx/dist,uy=dy/dist,sx=0,sy=0,slow=1,blocker=null;
  for(const q of this.nodes.values()){if(q===n)continue;const rx=(q.x-n.x)*Wd,ry=(q.y-n.y)*Ht*1.4,d=Math.hypot(rx,ry)||.001,R=(q.s.size+n.s.size)*.34;
   if(d>R*2.8)continue;const ahead=rx*ux+ry*uy,lat=ux*ry-uy*rx;
   if(ahead>0&&Math.abs(lat)<R*1.05&&ahead<dist+R){
    const moving=q.path.length>0,headOn=moving&&q.lastUX!=null&&(q.lastUX*ux+q.lastUY*uy)<-.3;
    let side=Math.abs(lat)>2?(lat>0?-1:1):(n.id<q.id?1:-1);if(headOn)side=1; // 迎面相遇時都靠右
    const w=(1-ahead/(R*2.8))*(1-Math.abs(lat)/(R*1.05));sx+=-uy*side*w*1.9;sy+=ux*side*w*1.9;
    if(moving&&!headOn&&(q.v||0)<n.v&&ahead<R*1.6)slow=Math.min(slow,cl(((q.v||0)+6)/Math.max(1,n.v),.35,1));
    if(!moving&&ahead<R*1.25&&Math.abs(lat)<R*.75)blocker=q}
   if(d<R*.95){sx-=rx/d*(1-d/(R*.95))*1.4;sy-=ry/d*(1-d/(R*.95))*1.4}}
  let vx=ux+sx,vy=uy+sy;const L=Math.hypot(vx,vy)||1;vx/=L;vy/=L;
  if(vx*ux+vy*uy<-.1){vx=-uy*(sx*-uy+sy*ux>0?1:-1);vy=ux*(sx*-uy+sy*ux>0?1:-1)}
  const mv=step*slow,px=n.x+vx*mv/Wd,py=n.y+vy*mv/1.4/Ht,ig=task?.furn;let moved=false;
  if(!this.blocked(px,py,n,ig)){n.x=px;n.y=py;moved=true}
  else if(!this.blocked(n.x+vx*mv/Wd,n.y,n,ig)){n.x+=vx*mv/Wd;moved=true}
  else if(!this.blocked(n.x,n.y+vy*mv/1.4/Ht,n,ig)){n.y+=vy*mv/1.4/Ht;moved=true}
  n.lastUX=vx;n.lastUY=vy;
  // 卡住偵測：一段時間內沒有前進
  n.prog=n.prog||{t:0,x:n.x,y:n.y};n.prog.t+=dt;
  if(blocker)n.blockT=(n.blockT||0)+dt;else n.blockT=Math.max(0,(n.blockT||0)-dt*2);
  if(n.prog.t>.9){const gone=Math.hypot((n.x-n.prog.x)*Wd,(n.y-n.prog.y)*Ht);if(gone<n.v*.25*n.prog.t||n.blockT>1.1){n.stuck=(n.stuck||0)+1;this._unstick(n,blocker)}else n.stuck=0;n.prog={t:0,x:n.x,y:n.y}}
  this._facing(n,vx,vy,dt);
  const ph=n.v>58?'run':'go';if(s.actor.dataset.ph!==ph)s.ph(s.B||{},ph);s.actor.style.setProperty('--wk',(ph==='run'?cl(16/n.v,.3,.42):cl(22/Math.max(n.v,18),.46,.72)).toFixed(2)+'s');
  if(ph==='run'&&!reduce()){n.dustT=(n.dustT||0)-dt;if(n.dustT<=0){n.dustT=.24;fx('isle-dust',n.x*Wd-vx*8,n.y*Ht,'',[{opacity:.8,transform:'scale(.6)'},{opacity:0,transform:`translate(${-vx*14}px,-6px) scale(1.5)`}],520)}}
 };
 C._facing=function(n,vx,vy,dt){const s=n.s,want=Math.abs(vy)>Math.abs(vx)*1.15?(vy<0?'back':'front'):'side';
  if(want!==n.facing){n.fT=(n.fT||0)+dt;if(n.fT>.16){n.facing=want;n.fT=0}}else n.fT=0;
  if(Math.abs(vx)>.22){const d=vx>0?1:-1;if(d!==s.dir){n.dT=(n.dT||0)+dt;if(n.dT>.1){s.dir=d;n.dT=0}}else n.dT=0}};
 C._arrive=function(n){const s=n.s,task=n.task;n.v=0;n.prog=null;n.blockT=0;s.go('stand');s.squash(.06);
  if(task?.type==='furniture')this.useFurniture(n);
  else if(task?.type==='activity')Act.arrive(n,task);
  else if(task?.type!=='social'){n.task=null;n.next=this.clock+rnd(4,10)}};
 C._unstick=function(n,blocker){const end=n.path.at(-1);if(!end)return;const ig=n.task?.furn;
  if(blocker&&n.stuck>=1&&!this.busy(blocker)&&!blocker.task&&!blocker.seat&&blocker.s!==undefined){
   // 請擋路的夥伴讓一下
   const ux=n.lastUX||1,uy=n.lastUY||0,side=((blocker.x-n.x)*-uy+(blocker.y-n.y)*ux)>0?1:-1,tx=blocker.x+(-uy*side)*.09,ty=blocker.y+(ux*side)*.05;
   if(this.move(blocker,tx,ty,{type:'yield'})){if(Math.random()<.6){Act.say(n,pick(L.yieldA),2.2,true);setTimeout(()=>Act.say(blocker,pick(L.yieldB),2,true),700)}n.blockT=0;n.path=[...n.path];return}}
  avoid={n};const p=this.route(n,end,ig);avoid=null;
  if(p.length){n.path=p;n.blockT=0;return}
  if(n.stuck>=3||Math.hypot((end.x-n.x)*this.W,(end.y-n.y)*this.H)<n.s.size*.7){n.path=[];this._arrive(n)}};
 // 靠得太近時的推擠：走路中的人讓步多一點
 C.resolve=function(force=false){const b=this.bounds(),A=[...this.nodes.values()];
  for(let turn=0;turn<(force?16:1);turn++){for(let i=0;i<A.length;i++)for(let j=i+1;j<A.length;j++){const a=A[i],c=A[j];if(a.seat||c.seat||a.s.state==='held'||c.s.state==='held')continue;
    let dx=(c.x-a.x)*this.W,dy=(c.y-a.y)*this.H*1.3,d=Math.hypot(dx,dy);const walking=a.path.length||c.path.length,min=(a.s.size+c.s.size)*(walking&&!force?.27:.38);
    if(d<min){if(d<.001){dx=i%2?1:-1;dy=1;d=Math.SQRT2}const push=(min-d)*(force?.5:.22);const wa=a.path.length?.75:c.path.length?.25:.5;
     for(const [n,sign,w] of [[a,-1,wa],[c,1,1-wa]]){const x=cl(n.x+sign*dx/d*push*w*2/this.W,b.left,b.right),y=cl(n.y+sign*dy/d*push*w*2/this.H/1.3,b.min,b.max);if(!this.blocked(x,y,n,n.task?.furn)){n.x=x;n.y=y}}}}
   for(const n of A){const lim=this.limits(n);n.x=cl(n.x,lim.left,lim.right);n.y=cl(n.y,b.min,b.max);if(!n.seat&&n.s.state!=='held'&&this.blocked(n.x,n.y,n,n.task?.furn)){const p=this.nearest(n.x,n.y,n,n.task?.furn);if(p){n.x=p.x;n.y=p.y}}}}};
}

/* =========================================================
   3. 島民 AI：依時間、天氣、個性、需求與朋友決定要做什麼
   ========================================================= */
const L={
 fish:['海浪的聲音好好聽……','看！有魚跳起來了！','今天的海特別藍。','如果釣到大魚，要分給大家吃～','坐在碼頭邊，心都靜下來了。'],
 flowers:['這朵花聞起來甜甜的。','花海裡好像藏著小秘密。','嘿嘿，偷偷聞一下就好。','蝴蝶也喜歡這裡呢。','好想編一個花圈。'],
 shade:['樹蔭下好涼快～','聽，葉子在沙沙作響。','靠著大樹，心情都慢下來了。'],
 nap:['呼……再睡五分鐘……','（打了個小小的呵欠）','大樹好像在唱搖籃曲……'],
 campfire:['火光暖暖的～','要不要來烤棉花糖？','劈啪劈啪……好安心的聲音。','晚上大家聚在一起真好。'],
 campfire2:['你看，火花飛上去變成星星了。','我來說一個小島的傳說吧……','這樣坐著，好像什麼煩惱都沒了。'],
 stargaze:['星星好多……數不完。','那顆最亮的是我的。','夜空好像會呼吸一樣。','今晚的月亮好溫柔。'],
 wish:['流星！快許願！','看到了嗎？流星！'],
 sunset:['夕陽把海染成橘色了……','今天也辛苦了。','好想把這片天空收起來。'],
 butterfly:['等等我～蝴蝶！','抓到……差一點！','牠飛得好開心喔。'],
 bflyEnd:['飛走了……下次再來玩喔！','嘿嘿，追得好累但好好玩。'],
 shelter:['雨好大，先躲一下。','雨聲滴滴答答的。','等雨停了再出去玩。'],
 home:['有點睏了……回家休息吧。','今天也玩得很開心。','晚安，小島。'],
 explore:['咦？那邊有什麼？','去島的另一頭看看！','這裡我還沒來過耶。','往海邊走走好了。'],
 found:['發現了一個好地方！','這裡的風好舒服。','哇，從這裡看得好遠。'],
 strollA:['一起走走吧？','陪我去那邊看看？'],strollB:['好呀，等我～','走吧走吧！'],strollEnd:['這邊風景不錯吧？','走路聊天最舒服了。','下次再一起散步！'],
 tagA:['抓不到我～','來追我呀！'],tagB:['站住！看我的！','我要抓到你了！'],tagEnd:['抓到你了！','哇啊～被抓到了！','再一局！'],
 dance:['一起跳舞吧！♪','左、右、轉一圈～','嘿！嘿！好開心！','跟上節奏！'],
 gatherA:['大家集合～！'],gatherB:['來了來了！','有什麼好事嗎？','我到啦！'],gatherEnd:['耶～！','大家都在，真好！'],
 hi5:['耶！擊掌！','啪！好有精神！','再來一次！'],
 tickle:['哈哈哈……好癢！','住、住手啦～哈哈！','不行不行，那裡最怕癢！'],tickleEnd:['呼……呼……笑到沒力了。','你這個壞蛋～'],
 pose:['咔嚓！拍得好看嗎？','這是我的招牌姿勢！','要把我拍得可愛一點喔。'],
 yieldA:['借過一下～','不好意思，讓我過一下！'],yieldB:['啊，抱歉！','請過～'],
 tree:['哇，樹在搖！','有東西掉下來了嗎？','嚇我一跳！'],splash:['咦，水花？','有魚嗎？','好清涼的聲音～'],
 idle:['今天也是好天氣呢。','（伸了個懶腰）','嗯～接下來做什麼好呢？']
};
const ICON={
 fish:'<svg viewBox="0 0 24 24"><path d="M3 12Q10 4 17 12Q10 20 3 12ZM17 12L22 7V17Z" fill="#7BB7D8"/><circle cx="7.5" cy="11" r="1.2" fill="#2B4A5E"/></svg>',
 flowers:'<svg viewBox="0 0 24 24"><g fill="#F5A3B5"><circle cx="12" cy="7" r="4"/><circle cx="17" cy="12" r="4"/><circle cx="12" cy="17" r="4"/><circle cx="7" cy="12" r="4"/></g><circle cx="12" cy="12" r="3" fill="#FFE27A"/></svg>',
 shade:'<svg viewBox="0 0 24 24"><rect x="10.5" y="14" width="3" height="8" rx="1" fill="#A57A55"/><circle cx="12" cy="10" r="8" fill="#7CC56A"/><circle cx="9" cy="8" r="3" fill="#9BD687"/></svg>',
 nap:'<svg viewBox="0 0 24 24"><text x="3" y="18" font-size="13" font-weight="900" fill="#9C8CE2">z</text><text x="11" y="12" font-size="10" font-weight="900" fill="#9C8CE2">z</text><text x="17" y="7" font-size="7" font-weight="900" fill="#9C8CE2">z</text></svg>',
 campfire:'<svg viewBox="0 0 24 24"><path d="M12 21C6 20 6 13 10 8C10 12 12 12 12 9C16 12 18 20 12 21Z" fill="#F7894A"/><path d="M12 21C9 20 9 16 12 14C15 16 15 20 12 21Z" fill="#FFD26A"/></svg>',
 stargaze:'<svg viewBox="0 0 24 24"><path d="M12 3L14.6 9L21 9.6L16.1 13.8L17.6 20L12 16.7L6.4 20L7.9 13.8L3 9.6L9.4 9Z" fill="#F2CF5E"/></svg>',
 sunset:'<svg viewBox="0 0 24 24"><path d="M4 16A8 8 0 0 1 20 16Z" fill="#F7A35C"/><path d="M2 18H22M5 21H19" stroke="#62B8E6" stroke-width="2" stroke-linecap="round"/></svg>',
 butterfly:'<svg viewBox="0 0 24 24"><path d="M12 12Q3 2 3 9Q4 14 12 13ZM12 12Q21 2 21 9Q20 14 12 13Z" fill="#F8C7D3"/><path d="M12 13Q5 20 6 15ZM12 13Q19 20 18 15Z" fill="#EC8DB6"/><rect x="11.2" y="9" width="1.6" height="8" rx=".8" fill="#5C4838"/></svg>',
 shelter:'<svg viewBox="0 0 24 24"><path d="M2 12A10 9 0 0 1 22 12Z" fill="#62B8E6"/><path d="M12 12V19A2 2 0 0 1 8 19" stroke="#5C4838" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
 home:'<svg viewBox="0 0 24 24"><path d="M3 11L12 4L21 11V20H3Z" fill="#E7B98A"/><path d="M2 11L12 3L22 11" stroke="#3E8E78" stroke-width="2.5" fill="none" stroke-linecap="round"/><rect x="10" y="14" width="4" height="6" fill="#8A6648"/></svg>',
 explore:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#FFF3D6" stroke="#E7B53F" stroke-width="2"/><path d="M15.5 8.5L13.5 13.5L8.5 15.5L10.5 10.5Z" fill="#EF7F7F"/></svg>',
 friend:'<svg viewBox="0 0 24 24"><path d="M12 20S4 15 4 9.5A4 4 0 0 1 12 8A4 4 0 0 1 20 9.5C20 15 12 20 12 20Z" fill="#EF7F7F"/></svg>',
 tag:'<svg viewBox="0 0 24 24"><path d="M5 19L10 14M9 20L13 16" stroke="#F4A65B" stroke-width="2.4" stroke-linecap="round"/><circle cx="15.5" cy="8.5" r="5" fill="#F4A65B"/></svg>',
 music:'<svg viewBox="0 0 24 24"><path d="M9 17V5L19 3V15" stroke="#9C8CE2" stroke-width="2.4" fill="none"/><circle cx="6.5" cy="17.5" r="3" fill="#9C8CE2"/><circle cx="16.5" cy="15.5" r="3" fill="#9C8CE2"/></svg>'
};
const NOTE='<svg viewBox="0 0 16 18"><path d="M6 14V3L14 1V11" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="4" cy="14.5" r="2.8" fill="currentColor"/><circle cx="12" cy="11.5" r="2.8" fill="currentColor"/></svg>';
const SPARK='<svg viewBox="0 0 14 14"><path d="M7 0L8.6 5.4L14 7L8.6 8.6L7 14L5.4 8.6L0 7L5.4 5.4Z" fill="#FFE27A" stroke="#fff" stroke-width=".8"/></svg>';
const FISH='<svg viewBox="0 0 26 22"><path d="M4 11Q11 2 19 11Q11 20 4 11ZM19 11L25 6V16Z" fill="#7BB7D8" stroke="#fff" stroke-width="1.2"/><circle cx="8" cy="10" r="1.3" fill="#2B4A5E"/></svg>';
const BFLY=(a,b)=>`<svg viewBox="0 0 18 16"><g class="wl"><path d="M9 8Q1 0 1 6Q2 10 9 9Z" fill="${a}"/><path d="M9 9Q3 15 4 11Z" fill="${b}"/></g><g class="wr"><path d="M9 8Q17 0 17 6Q16 10 9 9Z" fill="${a}"/><path d="M9 9Q15 15 14 11Z" fill="${b}"/></g><rect x="8.3" y="5" width="1.4" height="7" rx=".7" fill="#5C4838"/></svg>`;

function fx(cls,x,y,html,frames,dur,opt={}){if(reduce()||!C?.world)return null;const d=document.createElement('i');d.className='isle-wfx '+cls;d.style.left=x+'px';d.style.top=y+'px';if(html)d.innerHTML=html;if(opt.color)d.style.color=opt.color;C.world.append(d);const a=d.animate(frames,{duration:dur,easing:opt.easing||'ease-out',delay:opt.delay||0,fill:'both'});a.onfinish=()=>d.remove();setTimeout(()=>d.remove(),dur+(opt.delay||0)+400);return d}
const head=n=>({x:n.x*W,y:n.y*H-n.s.size*.86});
function notes(n,k=1){const c=['#9C8CE2','#EC8DB6','#62B8E6','#F4A65B'];for(let i=0;i<k;i++){const h=head(n),dx=rnd(-26,26);fx('isle-note',h.x+rnd(-10,10),h.y+10,NOTE,[{opacity:0,transform:'translate(0,0) scale(.6) rotate(-10deg)'},{opacity:1,offset:.2},{opacity:0,transform:`translate(${dx}px,-46px) scale(1) rotate(12deg)`}],1300,{color:pick(c),delay:i*180})}}
function sparks(x,y,k=6,r=34){for(let i=0;i<k;i++){const a=i/k*Math.PI*2+rnd(-.2,.2);fx('isle-spark',x,y,SPARK,[{opacity:0,transform:'translate(0,0) scale(.3)'},{opacity:1,offset:.25},{opacity:0,transform:`translate(${Math.cos(a)*r}px,${Math.sin(a)*r*.8}px) scale(1) rotate(90deg)`}],700,{easing:'cubic-bezier(.2,.8,.3,1)'})}}
function fishJump(x,y){fx('isle-wfish',x,y,FISH,[{opacity:0,transform:'translate(0,0) rotate(40deg)'},{opacity:1,transform:'translate(8px,-46px) rotate(-10deg)',offset:.45},{opacity:1,transform:'translate(16px,-10px) rotate(-70deg)',offset:.9},{opacity:0,transform:'translate(18px,0) rotate(-80deg)'}],1100,{easing:'ease-in-out'});
 for(const d of [0,950])fx('isle-wripple',x+(d?18:0),y,'',[{opacity:1,transform:'scale(.4)'},{opacity:0,transform:'scale(2.2)'}],800,{delay:d})}

/* ---------- 念頭泡泡 ---------- */
const thinks=new Map();
function think(n,icon){if(reduce()||!ICON[icon]||!C.world)return;unthink(n);const d=document.createElement('div');d.className='isle-think';d.innerHTML=ICON[icon];C.world.append(d);const h=head(n);d.style.left=h.x+'px';d.style.top=(h.y-8)+'px';
 d.animate([{opacity:0,transform:'translateY(8px) scale(.3)'},{opacity:1,transform:'none',offset:.25},{opacity:1,transform:'none',offset:.8},{opacity:0,transform:'translateY(-6px) scale(.9)'}],{duration:2100,easing:'cubic-bezier(.3,1.4,.5,1)',fill:'both'}).onfinish=()=>unthink(n);thinks.set(n,d)}
function unthink(n){const d=thinks.get(n);if(d){d.remove();thinks.delete(n)}}

/* ---------- 情境 ---------- */
function ctx(){const root=Home.stage.root,ph=root.dataset.phase||'day',wx=(typeof Env!=='undefined'&&Env.wid)||'sunny',h=(typeof Env!=='undefined'&&Env.s?.h)||12;
 return {ph,wx,h,rain:/rain|storm/.test(wx),snow:wx==='snow',clear:wx==='sunny'||wx==='cloudy',night:ph==='night',dusk:ph==='dusk',day:ph==='day'||ph==='dawn',late:h>=22.5||h<5}}
const favOf=n=>{const d=n.s.ch.data||{};return [...(d.likes||[]),...(d.interests||[])].join(' ')};
const traitsOf=n=>(n.s.ch.data?.pers?.traits)||[];
function ai(n){return n.ai||(n.ai={social:rnd(.3,.7),fun:rnd(.3,.7),cur:rnd(.45,.85),last:{},lastAct:null})}
function friendOf(n,idleOnly=true){let best=null,sc=-1e9;for(const q of C.nodes.values()){if(q===n)continue;if(idleOnly&&(q.task||C.busy(q)))continue;const p=C.pair(n.id,q.id),s=(p.score||0)+(p.count?10:0)-Math.hypot(q.x-n.x,q.y-n.y)*20+rnd(0,8);if(s>sc){sc=s;best=q}}return best}
function reserved(x,y,self){for(const q of C.nodes.values()){if(q===self)continue;const e=q.path.at(-1)||(q.task?.spot)||{x:q.x,y:q.y};if(Math.hypot((e.x-x)*W,(e.y-y)*H*1.4)<(q.s.size+self.s.size)*.36)return true}return false}
function spotNear(x,y,rx,ry,self,tries=10){for(let i=0;i<tries;i++){const px=x+rnd(-rx,rx),py=y+rnd(-ry,ry);if(!reserved(px,py,self)&&!C.blocked(px,py,self))return {x:px,y:py}}const p=C.nearest(x,y,self,undefined,true);return p}
function bond(a,b,delta,type,title,text){try{const p=C.pair(a.id,b.id),day=new Date().toLocaleDateString('en-CA');if(p.day!==day){p.day=day;p.gain=0}const before=C.level(p);const d=Math.min(delta,30-p.gain);if(d>0){p.gain+=d;p.score=cl(p.score+d,-30,100)}p.count++;p.last=nowMs();
 const st=C.state();st.memories.unshift({id:'m_'+nowMs()+'_'+(++C.serial),ids:[a.id,b.id],t:nowMs(),type,title,text});st.memories.length=Math.min(160,st.memories.length);
 C.announce((before!==C.level(p)?C.level(p)+' · ':'')+title);C.persist()}catch(e){}}

/* ---------- 活動 ---------- */
const Act={
 lastSay:0,
 say(n,text,dur=3.2,force){if(!text||!Cfg.v.bubbles)return;if(n.task?.event)return;if(!force&&(C.clock-this.lastSay<3.2||C.clock-(n.lastSay||-99)<7))return;this.lastSay=C.clock;n.lastSay=C.clock;C.speak(n,text,dur)},
 start(n,id,o={}){const A=ACTS[id];if(!A)return false;const spot=o.spot||A.spot(n,o);if(!spot)return false;
  const task={type:'activity',act:id,spot,run:!!(o.run||A.run),slow:!!o.slow,delay:o.delay||0,data:o.data||{},arrived:false,t:0};
  const far=Math.hypot((spot.x-n.x)*W,(spot.y-n.y)*H)>8;
  if(far){if(!C.move(n,spot.x,spot.y,task))return false}else{if(C.busy(n))return false;n.task=task;n.path=[]}
  const a=ai(n);a.last[id]=C.clock;a.lastAct=id;n.act={id,cleanup:A.cleanup};
  try{A.begin&&A.begin(n,task)}catch(_){}
  if(A.icon&&!o.quiet)think(n,A.icon);if(A.go&&!o.quiet)this.say(n,pick(L[A.go]||[]),2.6);
  if(!far)this.arrive(n,task);return true},
 arrive(n,task){const A=ACTS[task.act];task.arrived=true;task.t=0;n.wait=0;try{A.arrive&&A.arrive(n,task)}catch(e){console.warn(e)}if(!n.wait&&n.task===task&&!n.path.length)n.wait=rnd(5,8);C.geometry(n)},
 tick(n,dt,task){task.t+=dt;const A=ACTS[task.act];
  if(task.pose&&!['joy','hop','wiggle','bounce','stretch'].includes(n.s.B?.id)&&n.s.B?.id!==task.pose&&!n.s.h){task.poseT=(task.poseT||0)+dt;if(task.poseT>.8){task.poseT=0;n.s.go(task.pose,{forced:1})}}
  if(task.face)n.facing=task.face;
  try{A.tick&&A.tick(n,dt,task)}catch(e){}}
};
const sit=(n,task,face)=>{task.pose='sit';n.s.go('sit',{forced:1});if(face)task.face=face};
const ACTS={
 wander:{spot(n){const b=C.bounds();const a=ai(n),far=a.cur>.6;for(let i=0;i<8;i++){const x=far?rnd(b.left+.05,b.right-.05):cl(n.x+rnd(-.45,.45),b.left+.05,b.right-.05),y=rnd(.58,1.06);if(!reserved(x,y,n)&&!C.blocked(x,y,n))return {x,y}}return null},
  arrive(n,task){n.wait=rnd(1.5,3.5);if(Math.random()<.35){n.s.go(pick(['look','stretch','look']));}}},
 explore:{icon:'explore',go:'explore',spot(n){const b=C.bounds(),side=n.x<.5?1:-1;for(let i=0;i<8;i++){const x=side>0?rnd(.9,b.right-.06):rnd(b.left+.06,.1),y=rnd(.6,1.06);if(!reserved(x,y,n)&&!C.blocked(x,y,n))return {x,y}}return null},
  arrive(n,task){n.wait=rnd(4,7);n.s.go('look');ai(n).cur=Math.max(0,ai(n).cur-.35);if(Math.random()<.5)Act.say(n,pick(L.found));if(Math.random()<.3){const h=head(n);sparks(h.x,h.y+20,5,26)}}},
 fish:{icon:'fish',spot:n=>spotNear(1.0,1.088,.05,.01,n)||spotNear(.4,1.09,.25,.01,n),
  arrive(n,task){sit(n,task,'front');n.wait=rnd(12,18);task.fishT=rnd(2,4);Act.say(n,pick(L.fish))},
  tick(n,dt,task){task.fishT-=dt;if(task.fishT<=0){task.fishT=rnd(4,8);const x=(n.x+rnd(-.08,.08))*W,y=(1.21+rnd(0,.04))*H;fishJump(x,y);if(Math.random()<.4){n.s.actor.dataset.dollFace='surprise';setTimeout(()=>delete n.s.actor.dataset.dollFace,900);Act.say(n,pick(['有魚！','哇，好大一條！','牠在跟我打招呼嗎？']),2.2)}}}},
 flowers:{icon:'flowers',spot:n=>spotNear(-.36,.72,.17,.06,n),
  arrive(n,task){n.s.go('look');n.wait=rnd(8,12);task.pT=1;Act.say(n,pick(L.flowers));ai(n).fun=Math.min(1,ai(n).fun+.3)},
  tick(n,dt,task){task.pT-=dt;if(task.pT<=0){task.pT=rnd(1.4,2.6);const h=head(n),c=pick(['#F5A3B5','#FFE27A','#C7B5EC','#fff']);fx('isle-petal',h.x+rnd(-20,20),n.y*H-6,'',[{opacity:0,transform:'translate(0,0) rotate(0)'},{opacity:1,offset:.2},{opacity:0,transform:`translate(${rnd(-30,30)}px,-40px) rotate(260deg)`}],1500).style.setProperty('--c',c);if(Math.random()<.35)n.s.go(pick(['wiggle','look','stretch']));if(Math.random()<.2)n.s.hearts(1)}}},
 shade:{icon:'shade',spot:n=>spotNear(1.3,.665,.07,.012,n),
  arrive(n,task){sit(n,task);n.wait=rnd(10,16);Act.say(n,pick(L.shade));n.s.fat=Math.max(0,(n.s.fat||0)-.08)}},
 nap:{icon:'nap',spot:n=>spotNear(1.3,.665,.08,.012,n),
  arrive(n,task){task.pose='doze';n.s.go('doze',{forced:1});n.wait=rnd(14,22);Act.say(n,pick(L.nap));task.zT=2},
  tick(n,dt,task){n.s.fat=Math.max(0,(n.s.fat||0)-dt*.006);task.zT-=dt;if(task.zT<=0){task.zT=rnd(2.5,4);const h=head(n);fx('isle-note',h.x+12,h.y+8,'<svg viewBox="0 0 16 18"><text x="2" y="15" font-size="15" font-weight="900" fill="#9C8CE2">z</text></svg>',[{opacity:0,transform:'translate(0,0) scale(.5)'},{opacity:1,offset:.3},{opacity:0,transform:'translate(14px,-30px) scale(1.1)'}],1800)}}},
 campfire:{icon:'campfire',spot(n){const f=P.campfire;for(let i=0;i<10;i++){const a=rnd(0,Math.PI*2),x=f.x+Math.cos(a)*.13,y=f.y+.004+Math.sin(a)*.05;if(!reserved(x,y,n)&&!C.blocked(x,y,n))return {x,y}}return C.nearest(f.x,f.y+.06,n,undefined,true)},
  arrive(n,task){lightFire(true);sit(n,task);n.s.dir=P.campfire.x>n.x?1:-1;task.face=n.y<P.campfire.y?'front':'back';n.wait=rnd(16,24);Act.say(n,pick(L.campfire));task.cT=rnd(4,7)},
  tick(n,dt,task){n.s.dir=P.campfire.x>n.x?1:-1;task.cT-=dt;if(task.cT<=0){task.cT=rnd(6,10);const mates=[...C.nodes.values()].filter(q=>q!==n&&q.task?.act==='campfire'&&q.task.arrived);
   if(mates.length){Act.say(n,pick(L.campfire2));if(!task.bonded&&Math.random()<.5){task.bonded=1;const m=mates[0];bond(n,m,3,'stargaze','營火邊的悄悄話','圍著營火坐在一起，聊到火光變得小小的。')}}else if(Math.random()<.4)Act.say(n,pick(L.campfire))}}},
 stargaze:{icon:'stargaze',spot(n){const b=C.bounds();for(let i=0;i<8;i++){const x=rnd(b.left+.1,b.right-.1),y=rnd(.6,.9);if(!reserved(x,y,n)&&!C.blocked(x,y,n))return {x,y}}return null},
  arrive(n,task){sit(n,task,'back');n.wait=rnd(12,18);Act.say(n,pick(L.stargaze));task.sT=rnd(3,6)},
  tick(n,dt,task){task.sT-=dt;if(task.sT<=0){task.sT=rnd(7,12);if(Math.random()<.55){shootingStar();setTimeout(()=>{if(n.task===task){Act.say(n,pick(L.wish),2.6,true);n.s.hearts(1)}},500)}}}},
 sunset:{icon:'sunset',spot(n){const b=P.bench;if(!reserved(b.x,b.y+.004,n))return {x:b.x+rnd(-.03,.03),y:b.y+.004};return spotNear(.5,1.085,.3,.01,n)},
  arrive(n,task){const b=P.bench;if(Math.abs(n.x-b.x)<.05&&Math.abs(n.y-b.y)<.02){n.seat={p:{u:'isle_bench',x:b.x,y:b.y,s:1},kind:'sit'};n.y=b.y+.004}sit(n,task,'front');n.wait=rnd(14,20);Act.say(n,pick(L.sunset))},
  cleanup(n){if(n.seat?.p?.u==='isle_bench')n.seat=null}},
 shelter:{icon:'shelter',spot:n=>spotNear(1.3,.66,.07,.012,n)||spotNear(.15,.59,.06,.01,n),
  arrive(n,task){task.pose='sit';n.s.go(Math.random()<.5?'rainwatch':'sit',{forced:1});n.wait=rnd(14,22);Act.say(n,pick(L.shelter))}},
 home:{icon:'home',spot:n=>spotNear(.15,.588,.05,.008,n),
  arrive(n,task){task.pose='doze';n.s.go('doze',{forced:1});n.wait=rnd(18,28);task.face='back';Act.say(n,pick(L.home))}},
 bench:{icon:'sunset',spot(n){const b=P.bench;if(!reserved(b.x,b.y+.004,n))return {x:b.x+rnd(-.03,.03),y:b.y+.004};return null},
  arrive(n,task){ACTS.sunset.arrive(n,task);n.wait=rnd(8,12)},cleanup(n){if(n.seat?.p?.u==='isle_bench')n.seat=null}},
 butterfly:{icon:'butterfly',go:'butterfly',run:true,begin(n,task){task.data.fly=makeFly(n)},spot(n){const b=C.bounds();return spotNear(cl(n.x+rnd(-.35,.35),b.left+.1,b.right-.1),rnd(.62,1.0),.04,.02,n)},
  arrive(n,task){task.data.hops=(task.data.hops||0)+1;const b=task.data.fly||(task.data.fly=makeFly(n));n.wait=0;
   if(task.data.hops<3){const nx=cl(n.x+rnd(-.28,.28),C.bounds().left+.1,C.bounds().right-.1),ny=rnd(.62,1.04),p=C.nearest(nx,ny,n,undefined,true);if(p){moveFly(b,p.x,p.y-.06);task.arrived=false;n.path=C.route(n,p);if(n.path.length){n.s.go('communityWalk');if(Math.random()<.4)Act.say(n,pick(L.butterfly),2.2);return}}}
   n.s.go('joy');n.s.hearts(2);Act.say(n,pick(L.bflyEnd));ai(n).fun=1;n.wait=rnd(2.5,4);flyAway(b);task.data.fly=null},
  cleanup(n){const t=n.task;if(t?.data?.fly)flyAway(t.data.fly)}},
 stroll:{icon:'friend',spot:(n,o)=>o.spot,
  arrive(n,task){n.s.go('look');n.wait=rnd(3.5,6);const m=task.data.mate;if(m&&C.nodes.has(m.id)){n.s.dir=m.x>n.x?1:-1;if(task.data.lead){setTimeout(()=>{if(n.task===task)Act.say(n,pick(L.strollEnd),3,true)},600);if(!task.data.bonded){task.data.bonded=1;bond(n,m,3,'chat','一起散步','並肩走到島的另一邊，邊走邊聊今天的小事。')}}}ai(n).social=1}},
 tag:{icon:'tag',run:true,spot:(n,o)=>o.spot,
  arrive(n,task){const m=task.data.mate;if(task.data.runner){n.s.go('look');n.wait=6;if(m)n.s.dir=m.x>n.x?1:-1;return}
   // 追的人抵達：抓到！
   n.s.go('joy');n.s.hearts(1);Act.say(n,pick(L.tagEnd),2.6,true);n.wait=rnd(2,3);
   if(m&&m.task?.act==='tag'){m.s.go('bounce');m.s.actor.dataset.dollFace='surprise';setTimeout(()=>delete m.s.actor.dataset.dollFace,1200);m.wait=rnd(2,3);bond(n,m,4,'play','鬼抓人','在草地上你追我跑，笑到停不下來。')}
   const h=head(n);sparks(h.x,h.y+24,6,30);ai(n).fun=1;if(m)ai(m).fun=1}},
 dance:{icon:'music',spot:(n,o)=>o.spot||{x:n.x,y:n.y},
  arrive(n,task){n.wait=task.data.dur||7;n.s.go('stand');task.nT=.2;if(task.data.lead)Act.say(n,pick(L.dance),2.8,true);
   if(!reduce()&&n.s.art.animate){const s=n.s,beat=520;s._isleAnim=[s.art.animate([{translate:'0 0',rotate:'0deg'},{translate:'0 -9px',rotate:'-7deg',offset:.25},{translate:'0 0',rotate:'0deg',offset:.5},{translate:'0 -9px',rotate:'7deg',offset:.75},{translate:'0 0',rotate:'0deg'}],{duration:beat*2,iterations:Math.ceil(n.wait*1000/(beat*2)),easing:'ease-in-out'})]}},
  tick(n,dt,task){task.nT-=dt;if(task.nT<=0){task.nT=rnd(.5,.9);notes(n,1);if(Math.random()<.18)n.s.dir*=-1}if(n.wait<.6&&!task.end){task.end=1;n.s.hop(420);n.s.hearts(2)}}},
 gather:{icon:'friend',spot:(n,o)=>o.spot,
  arrive(n,task){const c=task.data.center;if(c&&C.nodes.has(c.id))n.s.dir=c.x>n.x?1:-1;n.s.go('stand');n.wait=10;if(!task.data.lead&&Math.random()<.8)setTimeout(()=>{if(n.task===task)Act.say(n,pick(L.gatherB),2.4,true)},rnd(200,900));checkGather(task.data.gid)}},
 idle:{spot:n=>({x:n.x,y:n.y}),arrive(n,task){const pool=['look','sit','stretch','look','wiggle'];const id=pick(pool);n.s.go(id);n.wait=rnd(3,6);if(Math.random()<.18)Act.say(n,pick(L.idle))}}
};
// 世界裡的蝴蝶（追逐用）
function makeFly(n){const d=document.createElement('i');d.className='isle-wfx isle-bfly-w';d.style.translate='-50% -50%';const c=pick([['#FFE27A','#F4A65B'],['#F8C7D3','#EC8DB6'],['#BFE6FF','#62B8E6']]);d.innerHTML=BFLY(c[0],c[1]);C.world.append(d);d.style.left=(n.x*W)+'px';d.style.top=(n.y*H-n.s.size*1.05)+'px';d.style.transition='left 1.6s cubic-bezier(.45,0,.55,1),top 1.6s cubic-bezier(.45,0,.55,1),opacity .6s';const p=n.path.at(-1);if(p)setTimeout(()=>moveFly(d,p.x,p.y-.06),40);return d}
function moveFly(d,x,y){if(!d)return;d.style.left=(x*W)+'px';d.style.top=(y*H)+'px'}
function flyAway(d){if(!d)return;d.style.transition='left 2.4s ease-in,top 2.4s ease-in,opacity 2.4s';d.style.left=(parseFloat(d.style.left)+rnd(-80,80))+'px';d.style.top=(parseFloat(d.style.top)-160)+'px';d.style.opacity='0';setTimeout(()=>d.remove(),2500)}
function lightFire(on){const e=P.campfire?.el;if(!e)return;if(on)e.dataset.lit='1';else delete e.dataset.lit}
function shootingStar(){try{document.dispatchEvent(new CustomEvent('isle:star'))}catch(_){}if(reduce())return;const a=Home.stage.root.querySelector('.isle-air');if(!a)return;const s=document.createElement('i');s.className='isle-shoot';const Wd=a.clientWidth,Hd=a.clientHeight;s.style.left=rnd(Wd*.35,Wd*.95)+'px';s.style.top=rnd(Hd*.06,Hd*.26)+'px';a.append(s);s.animate([{opacity:0,transform:'translateX(0) scaleX(.2)'},{opacity:1,offset:.2},{opacity:0,transform:'translateX(-140px) scaleX(1)'}],{duration:900,easing:'ease-out'}).onfinish=()=>s.remove()}

/* ---------- 決策：效用評分 ---------- */
function choose(n){const c=ctx(),a=ai(n),e=Persona.eff(n.s.ch.data),fav=favOf(n),tr=traitsOf(n),fat=n.s.fat||0,lively=e.lively/100,social=e.social/100;
 const others=[...C.nodes.values()].filter(q=>q!==n),atFire=others.filter(q=>q.task?.act==='campfire').length;
 const S={
  wander:1+a.cur*.6,
  explore:.4+a.cur*1.5+(tr.includes('curious')?.8:0)+(tr.includes('homebody')?-.4:0),
  fish:!c.rain&&!c.night?.5+(/海|魚|水|釣|游泳/.test(fav)?1.4:0)+(tr.includes('quiet')?.4:0):0,
  flowers:!c.rain&&!c.night?.5+(/花|植物|自然|園藝|香/.test(fav)?1.5:0)+(tr.includes('gentle')?.5:0)+(1-a.fun)*.4:0,
  shade:c.day&&!c.snow?(c.wx==='sunny'?.7:.25)+fat*1.4:0,
  nap:fat>.5&&!c.rain?fat*2+(tr.includes('lazy')||tr.includes('sleepy')?1:0):0,
  campfire:(c.dusk||c.night)&&!c.rain?1.2+social*.8+atFire*1.1:0,
  stargaze:c.night&&!c.rain&&c.clear?.8+(tr.includes('dreamer')?1.3:0):0,
  sunset:c.dusk&&!c.rain?1.5+(tr.includes('dreamer')||tr.includes('quiet')?.6:0):0,
  bench:!c.rain&&!c.night&&!c.dusk?.25+(tr.includes('quiet')?.4:0):0,
  butterfly:c.day&&!c.rain&&!c.snow?.25+lively*1.4+(1-a.fun)*.6+(tr.includes('sporty')||tr.includes('prank')?.6:0):0,
  shelter:c.rain?3:0,
  home:c.late?2.4+fat:fat>.8?.9:0,
  idle:.6+(1-lively)*.8,
  furniture:0,stroll:0,tag:0
 };
 if(c.rain){S.wander*=.3;S.explore*=.2}
 if(c.late){S.explore*=.3;S.butterfly=0}
 const fs=furnList(n);if(fs.length)S.furniture=.9+fs[0].weight*.25;
 const f=friendOf(n);if(f){const p=C.pair(n.id,f.id),pl=Persona.eff(f.s.ch.data).lively/100;S.stroll=!c.rain?.3+(1-a.social)*1.2+social*.6+Math.max(0,p.score)/60:0;S.tag=c.day&&!c.rain&&lively>.5&&pl>.45?.25+lively*.9+(tr.includes('prank')?.5:0):0}
 for(const k in S){const t=a.last[k];if(t!=null){const ago=C.clock-t;if(ago<90)S[k]*=.2;else if(ago<220)S[k]*=.6}}
 const list=Object.entries(S).filter(([,v])=>v>0).map(([k,v])=>[k,v*rnd(.75,1.25)]).sort((x,y)=>y[1]-x[1]).slice(0,4);
 const tot=list.reduce((s,[,v])=>s+v*v,0);let r=Math.random()*tot;for(const [k,v] of list){r-=v*v;if(r<=0)return {id:k,friend:f}}return {id:list[0]?.[0]||'wander',friend:f}}
function furnList(n){const R=OCS24D.Room,e=Persona.eff(n.s.ch.data),fav=favOf(n);return R.list().filter(p=>{const it=Items.get(p.i),k=it&&R.kind(it);return k&&!['rug','deco'].includes(k)&&!C.locks.has(p.u)}).map(p=>{const k=R.kind(Items.get(p.i)),weight=k==='bed'?(n.s.fat||0)*4:k==='plant'&&/植物|花|園藝|自然/.test(fav)?4:k==='toy'&&e.lively>55?3:1;return {p,weight}}).sort((a,b)=>b.weight-a.weight)}
function patchPlan(){
 C.plan=function(n){if(n.task||this.busy(n)||this.clock<n.next)return;if(Cfg.v.auto===false){n.next=this.clock+3;return}
  let ok=false;try{const {id,friend}=choose(n);
   if(id==='furniture'){const fs=furnList(n);ok=fs.length&&this.furnish(n,fs[0].p)}
   else if(id==='stroll'&&friend)ok=startStroll(n,friend);
   else if(id==='tag'&&friend)ok=startTag(n,friend);
   else ok=Act.start(n,id)}catch(e){console.warn('[isle ai]',e)}
  if(!ok)Act.start(n,'wander',{quiet:1});
  n.next=this.clock+rnd(4,9)};
}
function startStroll(a,b){const B=C.bounds(),side=a.x<.5?1:-1,x=cl(a.x+side*rnd(.35,.7),B.left+.1,B.right-.1),y=rnd(.62,1.04),A=C.nearest(x,y,a,undefined,true);if(!A)return false;
 const off=C.nearest(A.x-side*.11,A.y+rnd(-.02,.02),b,undefined,true);if(!off)return false;
 if(!Act.start(a,'stroll',{spot:A,slow:true,data:{mate:b,lead:true},quiet:true}))return false;
 if(!Act.start(b,'stroll',{spot:off,delay:.6,data:{mate:a},quiet:true})){C.interrupt(a);return false}
 think(a,'friend');Act.say(a,pick(L.strollA),2.4,true);setTimeout(()=>Act.say(b,pick(L.strollB),2.2,true),900);return true}
function startTag(a,b){const B=C.bounds(),dir=b.x>=a.x?1:-1,x=cl(b.x+dir*rnd(.3,.55),B.left+.1,B.right-.1),y=rnd(.62,1.04),S=C.nearest(x,y,b,undefined,true);if(!S)return false;
 const T=C.nearest(S.x-dir*.07,S.y,a,undefined,false);if(!T)return false;
 if(!Act.start(b,'tag',{spot:S,run:true,data:{mate:a,runner:true},quiet:true}))return false;
 if(!Act.start(a,'tag',{spot:T,run:true,delay:.9,data:{mate:b},quiet:true})){C.interrupt(b);return false}
 think(a,'tag');Act.say(b,pick(L.tagA),2.2,true);setTimeout(()=>Act.say(a,pick(L.tagB),2.2,true),1000);return true}

/* =========================================================
   4. 互動：長按角色的轉盤、對世界的反應
   ========================================================= */
const gathers=new Map();
function checkGather(gid){const g=gathers.get(gid);if(!g||g.done)return;const all=g.nodes.filter(q=>C.nodes.has(q.id)&&q.task?.data?.gid===gid);if(all.length&&all.every(q=>q.task.arrived)){finishGather(gid)}}
function finishGather(gid){const g=gathers.get(gid);if(!g||g.done)return;g.done=true;
 g.nodes.forEach((q,i)=>{if(q.task?.data?.gid!==gid)return;setTimeout(()=>{if(q.task?.data?.gid!==gid)return;q.s.hop(460);q.s.hearts(2);if(i===0)Act.say(q,pick(L.gatherEnd),2.6,true);q.wait=2.2},i*120)});
 const c=g.nodes[0];if(c){const h=head(c);setTimeout(()=>sparks(h.x,h.y,10,60),300)}setTimeout(()=>gathers.delete(gid),4000)}
function gather(n){const others=[...C.nodes.values()].filter(q=>q!==n&&!C.busy(q));if(!others.length){Act.say(n,'咦……大家都在忙嗎？',2.4,true);return}
 const gid='g'+(++C.serial);const g={nodes:[n,...others],done:false};gathers.set(gid,g);
 C.interrupt(n);
 others.forEach((q,i)=>{const a=(i/others.length)*Math.PI*2+Math.PI/2+.4,x=n.x+Math.cos(a)*.15,y=cl(n.y+Math.sin(a)*.06,.57,C.bounds().max),p=C.nearest(x,y,q,undefined,true);C.interrupt(q);if(p)Act.start(q,'gather',{spot:p,run:Math.hypot(p.x-q.x,p.y-q.y)>.4,delay:i*.25,quiet:true,data:{gid,center:n}})});
 Act.start(n,'gather',{spot:{x:n.x,y:n.y},quiet:true,data:{gid,lead:true,center:n}});Act.say(n,pick(L.gatherA),2.6,true);n.s.squash(.12);
 setTimeout(()=>finishGather(gid),11000)}
function danceParty(n){C.interrupt(n);const dur=7.2;Act.start(n,'dance',{spot:{x:n.x,y:n.y},quiet:true,data:{lead:true,dur}});
 [...C.nodes.values()].filter(q=>q!==n&&!C.busy(q)&&!q.task?.event&&Math.abs(q.x-n.x)<.6&&Math.abs(q.y-n.y)<.25).slice(0,5).forEach((q,i)=>{setTimeout(()=>{if(C.busy(q)||q.task?.event)return;C.interrupt(q);q.s.dir=n.x>q.x?1:-1;Act.start(q,'dance',{spot:{x:q.x,y:q.y},quiet:true,data:{dur:dur-.6-i*.3}});think(q,'music');if(i===0)Act.say(q,'我也要跳！',2,true);bond(n,q,2,'play','一起跳舞','音樂一響起，大家都忍不住跟著跳了起來。')},400+i*350)})}
function hi5(n){const s=n.s;C.interrupt(n);n.next=C.clock+6;s.go('stand');s.squash(.12);setTimeout(()=>s.hop(380),60);setTimeout(()=>{const h=head(n);fx('isle-burst',h.x+s.dir*s.size*.32,h.y+s.size*.32,`<svg viewBox="0 0 46 46"><g stroke="#F4A65B" stroke-width="3" stroke-linecap="round">${[0,1,2,3,4,5,6,7].map(i=>{const a=i/8*Math.PI*2;return `<path d="M${23+Math.cos(a)*9} ${23+Math.sin(a)*9}L${23+Math.cos(a)*19} ${23+Math.sin(a)*19}"/>`}).join('')}</g><circle cx="23" cy="23" r="6" fill="#FFE27A"/></svg>`,[{opacity:1,transform:'scale(.3)'},{opacity:1,transform:'scale(1.1)',offset:.4},{opacity:0,transform:'scale(1.4)'}],520,{easing:'cubic-bezier(.2,.8,.3,1)'});buzz([10,30,14])},260);
 Life.setMood(s,'happy',30,true);s.hearts(2);Act.say(n,pick(L.hi5),2.4,true)}
function tickle(n){const s=n.s;C.interrupt(n);n.next=C.clock+7;s.go('stand');s.actor.dataset.dollFace='joy';Act.say(n,pick(L.tickle),2.4,true);
 if(!reduce())s._isleAnim=[s.art.animate([{rotate:'0deg',translate:'0 0'},{rotate:'-8deg',translate:'-2px -3px'},{rotate:'7deg',translate:'2px 0'},{rotate:'-5deg',translate:'-1px -2px'},{rotate:'0deg',translate:'0 0'}],{duration:260,iterations:6,easing:'ease-in-out'})];
 let k=0;const t=setInterval(()=>{if(++k>4){clearInterval(t);return}buzz(6);const h=head(n);sparks(h.x,h.y+18,3,22)},300);
 setTimeout(()=>{delete s.actor.dataset.dollFace;Life.setMood(s,'happy',25,true);s.hearts(1);Act.say(n,pick(L.tickleEnd),2.4,true)},1700)}
function strikePose(n){const s=n.s;C.interrupt(n);n.next=C.clock+6;s.go('stand');s.squash(.1);
 if(!reduce())s._isleAnim=[s.art.animate([{rotate:'0deg',scale:'1'},{rotate:'-8deg',scale:'1.07',offset:.25},{rotate:'-8deg',scale:'1.07',offset:.8},{rotate:'0deg',scale:'1'}],{duration:1700,easing:'cubic-bezier(.3,1.5,.5,1)'})];
 setTimeout(()=>{const f=document.createElement('i');f.className='isle-flash';document.getElementById('p-home').append(f);f.animate([{opacity:0},{opacity:.75,offset:.12},{opacity:0}],{duration:420}).onfinish=()=>f.remove();buzz(14);const h=head(n);sparks(h.x,h.y+20,8,44)},380);
 Act.say(n,pick(L.pose),2.6,true);s.actor.dataset.dollFace='joy';setTimeout(()=>delete s.actor.dataset.dollFace,1800)}
function contextualLine(n){const c=ctx(),a=ai(n),s=n.s,fav=(n.s.ch.data?.likes||[]).concat(n.s.ch.data?.interests||[]),f=friendOf(n,false),out=[];
 const wn={sunny:'晴朗',cloudy:'多雲',rain:'下雨',storm:'暴風雨',snow:'下雪',fog:'起霧'}[c.wx]||'不錯';
 if(c.ph==='dawn')out.push('早安！太陽才剛起床呢。','清晨的空氣好清新～');
 if(c.day)out.push('今天'+wn+'，適合去島上走走。');
 if(c.dusk)out.push('天色暗下來了，晚上要不要去營火那邊？','夕陽好美，要不要去長椅那邊看海？');
 if(c.night)out.push('這麼晚了還醒著呀？','晚上的小島好安靜。');
 if(c.rain)out.push('下雨天就適合待在一起。','雨停了要去找彩虹！');
 if(c.snow)out.push('雪好白……踩起來沙沙的。');
 if((s.fat||0)>.65)out.push('今天有點累了……想找個樹蔭躺一下。');
 const m=s.mood?.id;if(m==='happy'||m==='excited')out.push('心情超好的！想跟大家一起玩！');if(m==='sad')out.push('可以陪我一下嗎？');if(m==='bored')out.push('好無聊喔……去探險好不好？');
 const la={fish:'剛才在碼頭看到魚跳起來了！',flowers:'西邊的花海開得好漂亮！',campfire:'營火烤起來好暖和。',stargaze:'昨晚看到好多星星。',explore:'我剛剛去了島的另一頭喔！',butterfly:'剛才追蝴蝶追得好開心！',nap:'在大樹下睡了個好覺～',tag:'玩鬼抓人好好玩！',stroll:'剛剛散步散得好舒服。'}[a.lastAct];if(la)out.push(la,la);
 if(f){const p=C.pair(n.id,f.id);if(p.score>30)out.push('最近常常和'+f.s.ch.name+'一起玩，好開心。');else if(!p.count)out.push('我還不太認識'+f.s.ch.name+'，有點想跟他聊聊。')}
 if(fav.length)out.push('我最近迷上了'+pick(fav)+'。');
 return pick(out.length?out:L.idle)}
function chat(n){C.interrupt(n);n.next=C.clock+6;n.s.go('look');n.s.dir=1;Act.say(n,contextualLine(n),4.2,true);n.s.squash(.06)}

let ring=null;
function closeRing(){if(!ring)return;const r=ring;ring=null;r.classList.remove('open');const bs=r.querySelectorAll('.ring-b,.ring-name');if(!reduce())bs.forEach(b=>b.animate([{opacity:1,transform:'none'},{opacity:0,transform:`translate(${-(+b.dataset.tx||0)}px,${-(+b.dataset.ty||0)}px) scale(.4)`}],{duration:160,easing:'ease-in',fill:'forwards'}));setTimeout(()=>r.remove(),180)}
function openRing(n){closeRing();const s=n.s,rc=s.art.getBoundingClientRect();if(!rc.width)return;
 const R=window.IsleLife?98:84,cx=cl(rc.left+rc.width/2,R+34,innerWidth-R-34),cy=cl(rc.top+rc.height*.5,R+90,innerHeight-R-110);
 const items=[['hi5','擊掌',ic('hand'),'#F4A65B',hi5],['tickle','搔癢',ic('smile'),'#EC8DB6',tickle],['dance','跳舞',ICON.music.replace(/#9C8CE2/g,'#fff'),'#9C8CE2',danceParty],['pose','擺姿勢',ic('camera'),'#62B8E6',strikePose],['chat','聊天',ic('chat'),'#4DBA9C',chat],['gather','集合',ic('users'),'#E7B53F',gather]];
 const r=document.createElement('div');r.id='isleRing';r.innerHTML='<div class="ring-scrim"></div>';r.style.setProperty('--cx',cx+'px');r.style.setProperty('--cy',cy+'px');
 const nm=document.createElement('div');nm.className='ring-name';nm.innerHTML=esc(s.ch.name)+'<small>'+esc((typeof MOODS!=='undefined'&&MOODS[s.mood?.id]?.n)||'自在')+'</small>';nm.style.left=cx+'px';nm.style.top=(cy-R-34)+'px';nm.dataset.ty='0';r.append(nm);
 if(window.IsleLife)items.push(...IsleLife.ringItems(n));
 items.forEach(([k,label,icon,col,fn],i)=>{const a=-Math.PI/2+(i+.5)/items.length*Math.PI*2,tx=Math.cos(a)*R,ty=Math.sin(a)*R;const b=document.createElement('button');b.type='button';b.className='ring-b';b.style.setProperty('--c',col);b.innerHTML='<span>'+icon+'</span>'+label;b.style.left=(cx+tx)+'px';b.style.top=(cy+ty)+'px';b.dataset.tx=tx;b.dataset.ty=ty;b.setAttribute('aria-label',label+' '+s.ch.name);
  b.addEventListener('click',e=>{e.stopPropagation();closeRing();buzz(8);try{if(C.nodes.get(n.id)===n)fn(n)}catch(err){console.warn(err)}});r.append(b);
  if(!reduce())b.animate([{opacity:0,transform:`translate(${-tx}px,${-ty}px) scale(.3)`},{opacity:1,transform:'none'}],{duration:460,delay:i*34,easing:'cubic-bezier(.2,1.5,.4,1)',fill:'backwards'})});
 if(!reduce())nm.animate([{opacity:0,transform:'translateY(10px) scale(.6)'},{opacity:1,transform:'none'}],{duration:420,easing:'cubic-bezier(.2,1.5,.4,1)'});
 r.querySelector('.ring-scrim').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();closeRing()});
 document.body.append(r);requestAnimationFrame(()=>r.classList.add('open'));ring=r;s.squash(.1);
 clearTimeout(openRing.t);openRing.t=setTimeout(closeRing,7000)}
const bound=new WeakSet();
function attachLP(n){const s=n.s,art=s.art;if(!art||bound.has(art))return;bound.add(art);let t=0,sx=0,sy=0;
 const clear=()=>{clearTimeout(t);t=0};
 art.addEventListener('pointerdown',e=>{if(e.button>0||OCS24D.Ed.on||e.isPrimary===false)return;clear();sx=e.clientX;sy=e.clientY;
  t=setTimeout(()=>{t=0;const node=s._communityNode;if(!node||!s.drag||s.drag.moved)return;const id=s.drag.id;s.drag=null;try{art.releasePointerCapture(id)}catch(_){}s.h=s.vx=s.vy=0;s.go('stand');buzz([8,40,12]);openRing(node)},460)});
 art.addEventListener('pointermove',e=>{if(t&&Math.hypot(e.clientX-sx,e.clientY-sy)>9)clear()});
 art.addEventListener('pointerup',clear);art.addEventListener('pointercancel',clear)}
function patchActors(){const ba=C.bindActor;C.bindActor=function(n){const r=ba.apply(this,arguments);try{attachLP(n)}catch(_){}return r};for(const n of C.nodes.values())attachLP(n)}
// 世界被戳了：附近的島民會轉頭、好奇地看
function bindReactions(){
 document.addEventListener('isle:poke',e=>{if(!C.active()||window.IsleLife)return;const {kind,x,y}=e.detail||{};let k=0;
  for(const n of C.nodes.values()){if(k>=3||C.busy(n)||n.task?.event)continue;const d=Math.hypot((n.x-x)*1.2,(n.y-y)*2);if(d>.55)continue;k++;
   setTimeout(()=>{if(C.busy(n)||n.task?.event)return;n.s.dir=x>n.x?1:-1;n.s.squash(.08);try{Life.emote(n.s,'excited',true)}catch(_){}
    if(kind==='tree'&&!n.task&&Persona.eff(n.s.ch.data).lively>45&&Math.random()<.6){const p=C.nearest(x+(n.x<x?-.06:.06),cl(y+.01,.56,C.bounds().max),n,undefined,true);if(p&&C.move(n,p.x,p.y,{type:'manual'})){n.next=C.clock+6}}
    if(Math.random()<.7)Act.say(n,pick(L[kind]||L.tree),2.2,true)},200+k*260)}});
 document.addEventListener('isle:prop',e=>{const id=e.detail;const n=C.nodes.get(Cfg.v.active);
  if(id==='campfire'){const lit=!P.campfire.el.dataset.lit;lightFire(lit);P.campfire.manual=lit?C.clock:0;buzz(8);if(lit){const f=P.campfire;sparks(f.x*W,(f.y-.05)*H,6,30)}if(n&&!C.busy(n)){C.interrupt(n);Act.start(n,'campfire')}}
  if(id==='msign'&&n&&!C.busy(n)){C.interrupt(n);Act.start(n,'flowers')}});
}

/* =========================================================
   5. 每幀附加：需求變化、念頭位置、營火、魚、尺寸
   ========================================================= */
let fishT=8,fireT=0,lastPhase='';
function patchUpdate(){const up=C.update;C.update=function(dt){const r=up.apply(this,arguments);try{post(Math.min(.05,dt||.016))}catch(e){}return r}}
function post(dt){
 const w=Home.stage.root.clientWidth,h=Home.stage.root.clientHeight;if(w!==W||h!==H){W=w;H=h;layoutProps()}
 if(!C.active())return;
 for(const n of C.nodes.values()){const a=ai(n);a.cur=Math.min(1,a.cur+dt*.004);a.fun=Math.max(0,a.fun-dt*.003);let near=false;for(const q of C.nodes.values())if(q!==n&&Math.hypot(q.x-n.x,(q.y-n.y)*2)<.25){near=true;break}a.social=cl(a.social+(near?dt*.01:-dt*.004),0,1)}
 for(const [n,d] of thinks){if(!C.nodes.has(n.id)){d.remove();thinks.delete(n);continue}const hd=head(n);d.style.left=hd.x.toFixed(1)+'px';d.style.top=(hd.y-8).toFixed(1)+'px'}
 const c=ctx();fireT-=dt;if(fireT<=0){fireT=2;const anyone=[...C.nodes.values()].some(q=>q.task?.act==='campfire');if(c.dusk||c.night){if(c.rain)lightFire(false);else lightFire(true)}else if(!anyone&&P.campfire?.el?.dataset.lit&&!(P.campfire.manual&&C.clock-P.campfire.manual<60))lightFire(false)}
 fishT-=dt;if(fishT<=0){fishT=rnd(10,24);if(!c.night&&!c.rain){const x=rnd(-.4,1.6);let ok=true;try{ok=!onLand(x,1.2)}catch(_){}if(ok)fishJump(x*W,(1.215+rnd(0,.04))*H)}}
 if(c.night&&!c.rain&&Math.random()<dt/40)shootingStar();
 if(c.ph!==lastPhase){const had=lastPhase;lastPhase=c.ph;if(had)for(const n of C.nodes.values())n.next=Math.min(n.next,C.clock+rnd(1,4))}
}

/* ---------- 啟動 ---------- */
let tries=0;
const wait=setInterval(()=>{try{
 if(++tries>400){clearInterval(wait);return}
 if(!(window.OCSCommunity?.ready&&window.IsleGround?.sand&&window.OCSCamera?.plane&&Home?.stage?.W))return;
 C=OCSCommunity;if(!C.world)return;clearInterval(wait);W=C.W||Home.stage.root.clientWidth;H=C.H||Home.stage.root.clientHeight;
 patchNav();patchWalk();patchPlan();patchUpdate();patchActors();buildProps();buildMeadow();bindReactions();
 C.resolve(true);C.renderAll();
 window.IsleWorld={onLand,props:P,PROPS,buildProps,layoutProps,Act,ACTS,choose,think,unthink,gather,danceParty,openRing,closeRing,contextualLine,startStroll,startTag,friendOf,spotNear,reserved,ctx,ai,fx,sparks,notes,head,fishJump,lightFire,shootingStar,furnList,L,ICON,get W(){return W},get H(){return H}};
}catch(e){console.error('[isle 2.7]',e);clearInterval(wait)}},150);
try{bindPages();bindSheets()}catch(e){console.error('[isle 2.7 motion]',e)}
})();
