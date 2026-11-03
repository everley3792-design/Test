(()=>{'use strict';
const PC=(x,y)=>({l:(x+1)/3*100,t:(y-.54)/.736*100});
const mul=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const hashStr=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0)/4294967295};
const reduce=()=>document.documentElement.dataset.motion==='reduce';
const NAMEC=['#F4A65B','#EF7F7F','#62B8E6','#9C8CE2','#4DBA9C','#EC8DB6','#E7B53F','#93C65B'];

/* ---------- 開場畫面 ---------- */
const sp=document.getElementById('splash');
if(sp)sp.innerHTML=`<svg class="sp-isle" viewBox="0 0 132 110" aria-hidden="true"><ellipse cx="66" cy="94" rx="60" ry="13" fill="#7FD0D6"/><path d="M14 88Q22 64 50 60Q66 50 84 60Q112 62 118 88Q66 100 14 88Z" fill="#F4E2B4"/><path d="M22 84Q30 66 52 63Q66 55 82 63Q104 66 110 84Q66 94 22 84Z" fill="#8DCB63"/><path d="M78 64V34" stroke="#A0795A" stroke-width="5" stroke-linecap="round"/><path d="M78 36Q60 20 52 30Q66 30 78 38M78 36Q92 16 104 26Q90 28 78 38M78 34Q74 12 86 8Q84 22 78 36" fill="#5FAE52"/><path d="M36 66L46 54L56 66V74H36Z" fill="#FFF3DC"/><path d="M33 66L46 50L59 66Z" fill="#4DBA9C"/><rect x="43" y="66" width="6" height="8" rx="2" fill="#C99863"/><circle cx="96" cy="70" r="3" fill="#F5A3B5"/><circle cx="30" cy="76" r="2.5" fill="#FFF8EE"/></svg><b class="sp-t">OC SHIMEJI</b><span class="sp-s">我 的 夥 伴 小 島</span><span class="sp-dots"><i></i><i></i><i></i></span>`;

const wait=setInterval(()=>{try{
 if(!(window.OCSCommunity&&OCSCommunity.ready&&window.OCSCamera&&OCSCamera.plane&&Home.stage&&Home.stage.W&&typeof Env!=='undefined'))return;
 clearInterval(wait);init();
}catch(e){console.error('[isle 2.6]',e);clearInterval(wait)}},150);

function init(){
 const st=Home.stage,root=st.root,plane=OCSCamera.plane,C=OCSCommunity;
 buildGround(root,plane);buildAir(root);buildLight();buildClock();
 sync();setInterval(sync,1500);
 bindWorldTaps(root);bindDialogue(root);settingsRow();
}

/* ---------- 島嶼地形 ---------- */
let sandPath=null;
function buildGround(root,plane){
 const floor=plane.querySelector(':scope>.floor');if(!floor||floor.querySelector('.isle-ground'))return;
 const g=document.createElement('div');g.className='isle-ground';
 const sand='M0,0H3000V80C2965,240 2880,470 2770,650C2650,810 2440,875 2100,888C1700,902 1300,902 900,888C560,875 350,810 230,650C120,470 35,240 0,80Z';
 const grass='M0,0H3000V40C2960,200 2860,420 2740,600C2620,760 2420,820 2100,835C1700,850 1300,850 900,835C580,820 380,760 260,600C140,420 40,200 0,40Z';
 const coast='M0,80C35,240 120,470 230,650C350,810 560,875 900,888C1300,902 1700,902 2100,888C2440,875 2650,810 2770,650C2880,470 2965,240 3000,80';
 g.innerHTML=`<svg class="land" viewBox="0 0 3000 1000" preserveAspectRatio="none" aria-hidden="true"><defs>
 <linearGradient id="isleG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--isle-g1)"/><stop offset=".55" style="stop-color:var(--isle-g2)"/><stop offset="1" style="stop-color:var(--isle-g3)"/></linearGradient>
 <linearGradient id="isleHaze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sky-c,#dfe);stop-opacity:.32"/><stop offset=".12" style="stop-color:var(--sky-c,#dfe);stop-opacity:0"/></linearGradient>
 <pattern id="isleMott" width="150" height="90" patternUnits="userSpaceOnUse"><ellipse cx="30" cy="22" rx="34" ry="11" style="fill:#fff" opacity=".07"/><ellipse cx="110" cy="62" rx="40" ry="12" style="fill:#2c5a20" opacity=".06"/><ellipse cx="90" cy="14" rx="14" ry="5" style="fill:#fff" opacity=".06"/></pattern></defs>
 <path class="isle-sand" d="${sand}" style="fill:var(--isle-sand)"/>
 <path class="foam" d="${coast}" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="3" vector-effect="non-scaling-stroke" stroke-linecap="round"/>
 <path class="foam2" d="${coast}" transform="translate(0 16)" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round"/>
 <path class="isle-grass" d="${grass}" fill="url(#isleG)"/><path d="${grass}" fill="url(#isleMott)"/>
 <path d="${grass}" fill="none" style="stroke:color-mix(in oklab,#4E9443 70%,var(--isle-tint))" stroke-width="2.5" vector-effect="non-scaling-stroke" opacity=".45"/>
 </svg><div class="isle-cshade"></div>`;
 floor.append(g);sandPath=g.querySelector('.isle-sand');window.IsleGround={g,sand:sandPath,grass:g.querySelector('.isle-grass'),PC};
 const add=(cls,l,t,html,style='')=>{const d=document.createElement('div');d.className='isle-d '+cls;d.style.cssText=`left:${l}%;top:${t}%;${style}`;if(html)d.innerHTML=html;g.append(d);return d};
 // 雲影
 const cs=g.querySelector('.isle-cshade');[[10,'30%','34%','40s','-6s'],[48,'22%','28%','55s','-30s'],[30,'36%','40%','70s','-50s']].forEach(([t,w,h,dur,dl])=>{const i=document.createElement('i');i.style.cssText=`--t:${t}%;--w:${w};--h:${h};--dur:${dur};--dl:${dl}`;cs.append(i)});
 // 石板小徑：從小屋門口蜿蜒到廣場
 const path=[[.15,.565],[.19,.6],[.24,.635],[.3,.665],[.36,.695],[.42,.72],[.48,.745],[.55,.765],[.62,.8],[.69,.845],[.76,.89],[.83,.935],[.9,.985],[.96,1.04],[1.01,1.09],[.42,.79],[.36,.84],[.3,.89],[.25,.94]];
 path.forEach(([x,y],i)=>{const p=PC(x+(i%2?.008:-.006),y);add('isle-stone',p.l,p.t,'',`scale:${.85+(i%3)*.12}`)});
 const nearPath=(x,y)=>path.some(([a,b])=>Math.hypot((a-x)*1.6,b-y)<.035);
 const grassEl=g.querySelector('.isle-grass'),inside=(x,y)=>{const X=(x+1)*1000,Y=(y-.54)/.736*1000;if(Y<10)return false;try{return grassEl.isPointInFill(new DOMPoint(X,Y+14))}catch(_){return true}};
 const r=mul(2611);
 const tuft=`<svg viewBox="0 0 20 16"><path d="M3 16C4 10 3 6 1 3C5 6 7 10 7 16ZM8 16C8 9 9 5 11 1C12 6 12 11 11 16ZM12 16C13 11 15 8 19 6C17 10 16 13 16 16Z" style="fill:var(--isle-tuft)"/></svg>`;
 let n=0;for(let k=0;k<1600&&n<230;k++){const x=-.85+r()*2.7,y=.56+r()*.62;if(!inside(x,y)||nearPath(x,y))continue;n++;const p=PC(x,y),sw=n%3===0;add('isle-tuft'+(sw?' sway':''),p.l,p.t,tuft,`--sd:${3.4+r()*2.4}s;--dl:${-r()*4}s;scale:${.8+r()*.5}`)}
 const FC=[['#FFF8EE','#F6C445'],['#F5A3B5','#FFE27A'],['#C7B5EC','#FFF2B8'],['#FFE27A','#F29A3A'],['#F8C7D3','#fff']];
 const flower=([p,c])=>`<svg viewBox="0 0 16 16"><g style="fill:color-mix(in oklab,${p} 74%,var(--isle-tint))"><circle cx="8" cy="4.5" r="3.1"/><circle cx="11.5" cy="8" r="3.1"/><circle cx="8" cy="11.5" r="3.1"/><circle cx="4.5" cy="8" r="3.1"/></g><circle cx="8" cy="8" r="2.2" style="fill:color-mix(in oklab,${c} 78%,var(--isle-tint))"/></svg>`;
 n=0;for(let k=0;k<1400&&n<56;k++){const x=-.8+r()*2.6,y=.565+r()*.58;if(!inside(x,y)||nearPath(x,y))continue;n++;const p=PC(x,y),f=FC[Math.floor(r()*FC.length)];for(let j=0;j<3;j++)add('isle-fl',p.l+(j-1)*.26+r()*.1,p.t+(j%2)*1.1,flower(f),`scale:${.75+r()*.4}`)}
 // 睡蓮與海面閃光
 const lily=`<svg viewBox="0 0 24 14"><path d="M12 7L22 4A10 6 0 1 1 20 2Z" style="fill:color-mix(in oklab,#6DBB6A 72%,var(--isle-tint))"/><path d="M5 6Q12 3 18 5" stroke="rgba(255,255,255,.35)" stroke-width="1" fill="none"/></svg>`;
 (()=>{const out=[];for(let k=0;k<400&&out.length<14;k++){const x=-.95+r()*2.9,y=.95+r()*.3;let ins=true;try{ins=sandPath.isPointInFill(new DOMPoint((x+1)*1000,(y-.54)/.736*1000-25))}catch(_){}if(!ins)out.push([x,y])}return out})().forEach(([x,y],i)=>{const p=PC(x,y);add('isle-lily',p.l,p.t,lily+(i%2?'':'<i style="position:absolute;left:9px;top:1px;width:7px;height:7px;border-radius:50%;background:#F8C7D3;box-shadow:0 0 0 2px #fff6"></i>'),`rotate:${r()*80-40}deg`)});
 for(let i=0;i<34;i++){const x=-.95+r()*2.9,y=1.2+r()*.07;const p=PC(x,y);const d=document.createElement('i');d.className='isle-glint';d.style.cssText=`left:${p.l}%;top:${p.t}%;--gd:${2.6+r()*3}s;--dl:${-r()*4}s`;g.append(d)}
 // 木棧道與燈籠
 const dp=PC(1.02,1.162);
 add('isle-dock',dp.l,dp.t,`<svg viewBox="0 0 98 132"><ellipse cx="49" cy="124" rx="44" ry="7" fill="rgba(20,70,90,.18)"/>
  <g fill="#8A6648"><rect x="20" y="20" width="7" height="104" rx="2"/><rect x="71" y="20" width="7" height="104" rx="2"/></g>
  ${Array.from({length:9},(_,i)=>`<rect x="14" y="${8+i*12}" width="70" height="10" rx="2.5" fill="${i%2?'#C49A6C':'#B98D60'}"/><path d="M17 ${11+i*12}H81" stroke="rgba(255,240,210,.35)" stroke-width="1.2"/>`).join('')}
  <g><rect x="6" y="2" width="5" height="34" rx="2" fill="#7A5A3F"/><rect x="3" y="0" width="11" height="5" rx="2" fill="#5E4530"/><rect x="2" y="5" width="13" height="12" rx="3" fill="#FFE9A8" stroke="#5E4530" stroke-width="2"/></g>
  <g><rect x="87" y="2" width="5" height="34" rx="2" fill="#7A5A3F"/><rect x="84" y="0" width="11" height="5" rx="2" fill="#5E4530"/><rect x="83" y="5" width="13" height="12" rx="3" fill="#FFE9A8" stroke="#5E4530" stroke-width="2"/></g>
  <g class="isle-lglow"><circle cx="8.5" cy="11" r="17" fill="rgba(255,214,120,.38)"/><circle cx="89.5" cy="11" r="17" fill="rgba(255,214,120,.38)"/><ellipse cx="49" cy="70" rx="40" ry="44" fill="rgba(255,206,120,.12)"/></g></svg>`);
 // 木頭告示牌（點擊可開啟時間與天氣）
 const sg=PC(.06,.575);
 const sign=add('isle-sign',sg.l,sg.t,`<svg viewBox="0 0 40 40"><rect x="18" y="16" width="4.5" height="24" rx="2" fill="#8A6648"/><rect x="3" y="4" width="34" height="18" rx="5" fill="#D9AE78"/><rect x="3" y="4" width="34" height="18" rx="5" fill="none" stroke="#9C7448" stroke-width="2"/><path d="M10 12H30M10 16H24" stroke="#8A6648" stroke-width="2" stroke-linecap="round"/></svg>`,'width:34px;height:34px');
}

/* ---------- 蝴蝶 ---------- */
function buildAir(root){
 if(root.querySelector('.isle-air'))return;const a=document.createElement('div');a.className='isle-air';root.append(a);
 const cols=[['#FFE27A','#F4A65B'],['#F8C7D3','#EC8DB6'],['#BFE6FF','#62B8E6']];
 const flies=cols.map(([c1,c2])=>{const b=document.createElement('div');b.className='isle-bfly';b.innerHTML=`<i><svg viewBox="0 0 18 16"><g class="wl"><path d="M9 8Q1 0 1 6Q2 10 9 9Z" fill="${c1}"/><path d="M9 9Q3 15 5 11Q6 9 9 9Z" fill="${c2}"/></g><g class="wr"><path d="M9 8Q17 0 17 6Q16 10 9 9Z" fill="${c1}"/><path d="M9 9Q15 15 13 11Q12 9 9 9Z" fill="${c2}"/></g><path d="M9 5V12" stroke="#5C4838" stroke-width="1.4" stroke-linecap="round"/></svg></i>`;a.append(b);return b});
 const move=()=>{if(document.hidden||Nav.cur!==0)return;const W=root.clientWidth,H=root.clientHeight;flies.forEach((b,i)=>{if(Math.random()<.25&&b._x!=null)return;const x=W*(.06+Math.random()*.88),y=H*(.5+Math.random()*.34)-30-Math.random()*60;b._x=x;b.style.transform=`translate(${x}px,${y}px) scaleX(${x<(b._px||0)?-1:1})`;b._px=x})};
 move();setInterval(move,3800);
}

/* ---------- 光影層 ---------- */
function buildLight(){
 if(document.getElementById('isleLight'))return;const L=document.createElement('div');L.id='isleLight';L.setAttribute('aria-hidden','true');
 L.innerHTML='<i class="warm"></i><i class="rays"></i><i class="night"></i><i class="wet"></i><i class="vig"></i>';
 const home=document.getElementById('p-home'),atm=document.getElementById('sceneAtmosphere');(atm||home.firstElementChild).after(L);
}

/* ---------- 島嶼時鐘 ---------- */
let clockEl;
function buildClock(){
 clockEl=document.createElement('button');clockEl.id='isleClock';clockEl.type='button';clockEl.setAttribute('aria-label','時間與天氣');
 clockEl.innerHTML='<span class="ic-wx"></span><span><b></b><small></small></span>';
 clockEl.onclick=()=>{buzz(6);Env.open()};document.getElementById('p-home').append(clockEl);
}
const WD='日一二三四五六';
function sync(){
 const st=Home.stage;if(!st)return;const root=st.root,ph=root.dataset.phase||'day',wx=Env.wid||'sunny';
 if(root.dataset.wx!==wx)root.dataset.wx=wx;
 const L=document.getElementById('isleLight');if(L){if(L.dataset.phase!==ph)L.dataset.phase=ph;if(L.dataset.wx!==wx)L.dataset.wx=wx}
 if(clockEl){const h=Env.s.h,hh=Math.floor(h)%24,mm=Math.floor((h%1)*60),d=new Date(),night=!(h>=5.5&&h<18.5);
  const tB=`${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`,tS=`${d.getMonth()+1}月${d.getDate()}日（${WD[d.getDay()]}）· ${Env.pname()}`,eB=clockEl.querySelector('b'),eS=clockEl.querySelector('small');
  if(eB.textContent!==tB)eB.textContent=tB;if(eS.textContent!==tS)eS.textContent=tS;
  const k=(night&&(wx==='sunny'||wx==='cloudy'))?'moon':wx;if(clockEl._k!==k){clockEl._k=k;clockEl.querySelector('.ic-wx').innerHTML=k==='moon'?ic('moon'):wsvg(wx,20)}
  if(clockEl.dataset.wx!==wx)clockEl.dataset.wx=wx;const nt=night?'1':'0';if(clockEl.dataset.night!==nt)clockEl.dataset.night=nt}
}

/* ---------- 點擊世界：走到那裡、搖樹、碰水 ---------- */
function bindWorldTaps(root){
 const C=OCSCommunity;let down=null;
 root.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,t:performance.now(),multi:(down&&performance.now()-down.t<300)}},true);
 root.addEventListener('click',e=>{
  if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>9||performance.now()-down.t>500)return;
  if(document.body.classList.contains('oc-edit')||Ov.stack.length||Home.wt)return;
  if(e.target.closest('.art,.rm-it,.gr-it,.ec-find,button,.community-name,.bubble'))return;
  const tree=e.target.closest('.scene-tree');if(tree){shakeTree(tree);return}
  if(e.target.closest('.isle-prop[data-tap]')){document.dispatchEvent(new CustomEvent('isle:prop',{detail:e.target.closest('.isle-prop').dataset.prop}));return}
  const p=OCSCamera.worldPoint(root,e.clientX,e.clientY);if(!p)return;
  const W=root.clientWidth,H=root.clientHeight,fx=p.x/W,fy=p.y/H;if(fy<.53)return;
  const X=(fx+1)*1000,Y=(fy-.54)/.736*1000;
  let onLand=true;try{onLand=sandPath?sandPath.isPointInFill(new DOMPoint(X,Y)):true}catch(_){}
  if(!onLand){splash(p.x,p.y);document.dispatchEvent(new CustomEvent('isle:poke',{detail:{kind:'splash',x:fx,y:fy}}));return}
  const n=C.nodes.get(Cfg.v.active);if(!n||n.s.state==='held'||n.s.h>0||n.s._fd||n.s._toy)return;
  const B=C.bounds(),tx=clamp(fx,B.left+.04,B.right-.04),ty=clamp(fy,.56,B.max);
  if(n.task||n.seat||n.path.length)C.interrupt(n);
  const ok=C.move(n,tx,ty,{type:'manual'});
  marker(tx*W,ty*H,ok);if(ok){buzz(5);n.next=C.clock+8}
 });
}
function air(){return Home.stage.root.querySelector('.isle-air')}
function spawn(cls,x,y,html){const d=document.createElement('div');d.className=cls;d.style.left=x+'px';d.style.top=y+'px';if(html)d.innerHTML=html;air().append(d);return d}
const anim=(n,k,o)=>{if(reduce()){setTimeout(()=>n.remove(),o.duration||600);return}const a=n.animate(k,o);a.onfinish=()=>n.remove();return a};
function marker(x,y,ok){const r=spawn('isle-ring',x,y);anim(r,[{opacity:1,scale:'.3'},{opacity:0,scale:'1.4'}],{duration:620,easing:'cubic-bezier(.2,.7,.3,1)'});
 if(ok){const p=spawn('isle-pin',x,y-6);anim(p,[{opacity:0,translate:'-50% -140%'},{opacity:1,translate:'-50% -50%',offset:.3},{opacity:1,offset:.75},{opacity:0,translate:'-50% -50%'}],{duration:1400,easing:'ease-out'})}}
function splash(x,y){for(let i=0;i<2;i++){const r=spawn('isle-ripple',x,y);anim(r,[{opacity:.9,scale:'.3'},{opacity:0,scale:'2.2'}],{duration:900,delay:i*220,easing:'ease-out'})}
 if(Math.random()<.35){const f=spawn('isle-fish',x+(Math.random()-.5)*30,y,'<svg viewBox="0 0 26 22"><path d="M4 11Q11 2 19 11Q11 20 4 11ZM19 11L25 6V16Z" fill="#7BB7D8" stroke="#fff" stroke-width="1.2"/><circle cx="8" cy="10" r="1.3" fill="#2B4A5E"/></svg>');
  anim(f,[{opacity:0,translate:'-50% -20%',rotate:'40deg'},{opacity:1,translate:'-50% -260%',rotate:'-10deg',offset:.45},{opacity:1,translate:'-50% -60%',rotate:'-70deg',offset:.9},{opacity:0,translate:'-50% 0%',rotate:'-80deg'}],{duration:1100,easing:'ease-in-out'});
  setTimeout(()=>{const r=spawn('isle-ripple',x,y);anim(r,[{opacity:1,scale:'.4'},{opacity:0,scale:'2'}],{duration:700})},950);buzz(8)}}
function shakeTree(tree){
 const sw=tree.querySelector('.sw')||tree,now=performance.now();if(now-(tree._t||0)<1100)return;tree._t=now;buzz([6,30,6]);
 if(!reduce())sw.animate([{rotate:'0deg'},{rotate:'-6deg'},{rotate:'5deg'},{rotate:'-4deg'},{rotate:'2deg'},{rotate:'0deg'}],{duration:700,easing:'ease-in-out'});
 const root=Home.stage.root,r=tree.getBoundingClientRect(),top=OCSCamera.worldPoint(root,r.left+r.width/2,r.top+r.height*.3),base=OCSCamera.worldPoint(root,r.left+r.width/2,r.bottom);if(!top||!base)return;
 const cols=['#8BC34A','#A9D46F','#6FAF55','#D9C46A'];document.dispatchEvent(new CustomEvent('isle:poke',{detail:{kind:'tree',x:base.x/root.clientWidth,y:base.y/root.clientHeight}}));
 for(let i=0;i<6;i++){const l=spawn('isle-leaf',top.x+(Math.random()-.5)*r.width,top.y);l.style.setProperty('--c',cols[i%4]);const dx=(Math.random()-.5)*60;
  anim(l,[{opacity:0,transform:'translate(0,0) rotate(0)'},{opacity:1,offset:.1},{transform:`translate(${dx*.5}px,${(base.y-top.y)*.5}px) rotate(200deg)`,offset:.5},{opacity:0,transform:`translate(${dx}px,${base.y-top.y+20}px) rotate(420deg)`}],{duration:1400+Math.random()*600,delay:i*60,easing:'ease-in'})}
 // 每天最多 5 次掉星幣、1 次掉蘋果，經濟系統統一入口（收據去重）
 try{if(!window.Econ)return;const E=Econ.s;Econ.roll();E.cap.tree=E.cap.tree|0;E.cap.treeItem=E.cap.treeItem|0;
  const roll=Math.random(),rid='tree_'+E.day+'_'+(E.cap.tree+E.cap.treeItem);
  if(roll<.1&&E.cap.treeItem<1){const ap=Items.d.items.find(i=>i.builtin&&i.name==='蘋果');if(ap&&Econ.pay(rid,'find',0,[{id:ap.id,n:1}])){E.cap.treeItem++;Eco.save();drop(top,base,MiniArt.img('apple'),'蘋果');toast('樹上掉下了一顆蘋果！','sparkle')}}
  else if(roll<.42&&E.cap.tree<5){const n=6+Math.floor(Math.random()*10);if(Econ.pay(rid,'find',n)){E.cap.tree++;Eco.save();drop(top,base,'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#F6C65B"/><circle cx="12" cy="12" r="6.6" fill="none" stroke="#D9A23A" stroke-width="1.8"/><path d="M12 8l1.2 2.8 3 .3-2.3 2 .7 3-2.6-1.6-2.6 1.6.7-3-2.3-2 3-.3Z" fill="#D9A23A"/></svg>','+'+n)}}
 }catch(e){console.warn(e)}
}
function drop(top,base,html,label){const c=spawn('isle-coin',top.x,top.y,html);const dy=base.y-top.y+10,dx=(Math.random()-.5)*30;
 anim(c,[{transform:'translate(0,0) scale(.6)'},{transform:`translate(${dx}px,${dy}px) scale(1)`,offset:.55,easing:'cubic-bezier(.5,0,.9,.6)'},{transform:`translate(${dx}px,${dy-22}px) scale(1.05)`,offset:.72},{transform:`translate(${dx}px,${dy}px)`,offset:.86},{transform:`translate(${dx}px,${dy-30}px) scale(.6)`,opacity:0}],{duration:1500});
 setTimeout(()=>{const p=spawn('isle-plus',top.x+dx,top.y+dy-24);p.textContent=label;anim(p,[{opacity:0,translate:'-50% 0'},{opacity:1,translate:'-50% -14px',offset:.3},{opacity:0,translate:'-50% -34px'}],{duration:1200})},1200)}

/* ---------- 對話：名牌、逐字顯示、島民語音 ---------- */
let actx=null;
addEventListener('pointerdown',()=>{if(actx)return;try{actx=new(window.AudioContext||window.webkitAudioContext)()}catch(_){}},{once:true,capture:true});
const voiceOn=()=>Cfg.v.voice!==false&&Cfg.v.sound!==false;
function blip(base){if(!actx||actx.state!=='running'||document.hidden)return;try{const t=actx.currentTime,o=actx.createOscillator(),g=actx.createGain(),f=base*(.88+Math.random()*.28);
 o.type='triangle';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*1.18,t+.05);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.032*(blip.vol||1),t+.012);g.gain.exponentialRampToValueAtTime(.0008,t+.07);
 o.connect(g);g.connect(actx.destination);o.start(t);o.stop(t+.08)}catch(_){}}
function bindDialogue(root){
 const typeOut=b=>{const t=b.textContent;if(!t||b._tw===t)return;b._tw=t;
  const actor=b.closest('.actor'),id=actor&&actor.dataset.resident,ch=id&&Chars.byId(id);
  if(ch){b.dataset.name=ch.name.split(' ')[0];const lk=ch.look||{},c=(lk.accent&&/^#/.test(lk.accent))?`color-mix(in oklab,${lk.accent} 75%,#5C4838)`:NAMEC[Math.floor(hashStr(ch.id)*NAMEC.length)];b.style.setProperty('--namec',c)}else delete b.dataset.name;
  const frag=document.createDocumentFragment();[...t].forEach((c,i)=>{const s=document.createElement('span');s.className='tw';s.style.setProperty('--i',i);s.textContent=c;frag.append(s)});
  b.textContent='';b.append(frag);b._tw=b.textContent;
  if(voiceOn()&&ch&&root.contains(b)){const base=260+hashStr(ch.id)*280,chars=[...t];let k=0;for(let i=0;i<chars.length&&k<26;i+=2){if(/[\s，。！？、…～,.!?]/.test(chars[i]))continue;k++;const at=i*30;setTimeout(()=>{if(b._tw===t){blip.vol=window.IsleLife?IsleLife.vol(ch.id):1;blip(base)}},at)}}
 };
 const mo=new MutationObserver(ms=>{for(const m of ms){const b=(m.target.nodeType===1?m.target:m.target.parentElement)?.closest?.('.bubble');if(b)typeOut(b)}});
 mo.observe(root,{subtree:true,childList:true,characterData:true});
}
function settingsRow(){
 const make=Settings.make;Settings.make=function(){const r=make.apply(this,arguments);try{
  const rows=[...this.body.querySelectorAll('.row')],anchor=rows.find(x=>x.querySelector('b')?.textContent==='對話氣泡');
  if(anchor&&!this.body.querySelector('[data-isle-voice]')){const row=switchRow('note','島民語音','角色說話時發出輕柔的「嘟嘟」聲',()=>Cfg.v.voice!==false,v=>{Cfg.set('voice',v);if(v)blip(420)});row.dataset.isleVoice='1';anchor.after(row)}
 }catch(e){}return r};
 if(Settings.body)Settings.make();
}
})();
