/* ===== 2.4D：自由換裝・飾品貼附・家具佈置・物件互動 ===== */
(()=>{'use strict';
const JP=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}},SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){window.ocsQuota&&ocsQuota()}};
const addQty=(id,n)=>{const i=Items.get(id);if(!i)return;i.qty=clamp(Math.round(i.qty+n),0,999);Items.save(true);Items.emit()};
const free=()=>!!(window.OCS24D&&window.OCS24D.free);
window.ocsDrop=(id,n)=>{const i=Items.get(id);if(!i||i.qty<=0)return false;const k=Math.min(n,i.qty);i.qty-=k;Items.save(true);Items.emit();return k};
const ANC={head:{n:'頭',x:.5,y:.1,s:.34},ear:{n:'耳',x:.3,y:.1,s:.2},face:{n:'臉',x:.5,y:.3,s:.3},neck:{n:'頸',x:.5,y:.5,s:.3},body:{n:'身',x:.5,y:.62,s:.5},hand:{n:'手',x:.8,y:.66,s:.22},foot:{n:'腳',x:.5,y:.94,s:.28},tail:{n:'尾',x:.12,y:.72,s:.3,z:-1},free:{n:'自訂',x:.5,y:.5,s:.3}};
const HK=[['walk','走路'],['sleep','睡覺'],['sit','坐下'],['hop','跳躍']];
const isW=it=>it.cat==='wear'||it.cat==='acc'||it.uses.some(u=>u.type==='wear'||u.type==='acc'),isF=it=>it.cat==='furn'||it.uses.some(u=>u.type==='furn');
const cleanW=w=>({i:String(w.i),a:ANC[w.a]?w.a:'free',x:clamp(+w.x||0,-.2,1.2),y:clamp(+w.y||0,-.2,1.2),s:clamp(+w.s||.3,.06,1.4),r:(+w.r||0)%360,z:+w.z<0?-1:1,f:w.f===-1?-1:1,h:Array.isArray(w.h)?w.h.filter(k=>HK.some(x=>x[0]===k)):[],o:w.o&&typeof w.o==='object'?w.o:{}});
const txt=it=>(it.name+' '+it.tags.join(' ')+' '+(it.emoji||'')),cnt=(l,i)=>l.filter(w=>w.i===i).length,cl=JSON.stringify,pr=JSON.parse;
const guess=it=>{const t=txt(it);return /帽|hat|冠|角/i.test(t)?'head':/眼鏡|墨鏡|glass|面/i.test(t)?'face':/蝴蝶結|耳|ribbon|髮|花冠/i.test(t)?'ear':/圍巾|scarf|領|項|鈴|領結/i.test(t)?'neck':/翅|wing|披風/i.test(t)?'body':/尾|tail/i.test(t)?'tail':/鞋|襪|靴|shoe/i.test(t)?'foot':/手|bracelet|握|杖/i.test(t)?'hand':it.cat==='acc'?'head':'body'};
const mk=(it,a)=>{const p=ANC[a||guess(it)];return{i:it.id,a:a||guess(it),x:p.x,y:p.y,s:p.s,r:0,z:p.z||(it.cat==='wear'?-0:1)||1,f:1,h:[]}};
const spark=(st,x,y,n=6)=>{try{for(let k=0;k<n;k++){const e=document.createElement('span');e.className='drsp';e.textContent='✦';e.style.cssText=`left:${x+(Math.random()-.5)*30}px;top:${y+(Math.random()-.5)*20}px;--dx:${(Math.random()-.5)*40}px;animation-delay:${k*.05}s`;st.fx.append(e);setTimeout(()=>e.remove(),1200)}}catch(e){}};
/* ---------- 換裝資料 ---------- */
const Dress={k:'ocs.dress.v1',d:null,stages:new Set(),
 load(){this.d=JP(this.k,{c:{}})},save(){SV(this.k,this.d)},
 rec(id){return this.d.c[id]||(this.d.c[id]={w:[],sets:{}})},
 worn(id){return this.rec(id).w},
 inUse(id){return Object.values(this.d.c).some(r=>r.w.some(w=>w.i===id))},
 ensure(st){const a=st.art;if(!a)return null;let b=a.querySelector(':scope>.dr-b'),f=a.querySelector(':scope>.dr-f');
  if(!b){b=el('<div class="dr-layer dr-b"><i class="dr-mk" style="position:absolute;left:0;top:0"></i></div>');a.insertBefore(b,a.firstChild)}
  if(!f){f=el('<div class="dr-layer dr-f"></div>');a.append(f)}return{b,f}},
 fl(st){const b=st.art&&st.art.querySelector(':scope>.dr-b'),mk=b&&b.querySelector('.dr-mk');if(!mk)return false;const m=mk.getBoundingClientRect(),r=b.getBoundingClientRect();return m.left>r.left+r.width/2},
 key(st){if(Ed.on&&Ed.st===st)return Ed.pk||'';return st.sleeping&&st.sleeping()?'sleep':st.B&&st.B.id==='sit'?'sit':st.state==='walk'?'walk':(st.state==='hop'||st.state==='crouch'||st.state==='fall')?'hop':''},
 off(w,k,f){const o=w.o;return o?(o[k+(f?'~':'')]||o[k]||null):null},
 sync(st,list,sel,pop){if(!st||!st.ch)return;const L=this.ensure(st);if(!L)return;list=list||this.worn(st.ch.id);
  const k=this.key(st),f=this.fl(st),ed=Ed.on&&Ed.st===st,key=cl(list)+sel+Items.d.items.length+'|'+k+'|'+f;st._hk=k+'|'+f;if(!pop&&st._dk===key)return;st._dk=key;
  L.b.querySelectorAll('.dr-it').forEach(n=>n.remove());L.f.innerHTML='';
  list.map((w,n)=>[w,n]).sort((a,b)=>a[0].z-b[0].z).forEach(([w,n])=>{const it=Items.get(w.i);if(!it)return;const o=this.off(w,k,f),hid=!ed&&k&&(w.h||[]).includes(k);
   const e=el(`<div class="dr-it ${n===sel?'sel':''} ${pop===n?'pop':''} ${hid?'hid':''}" style="--s:${w.s};--r:${w.r}deg;--f:${w.f};left:${(w.x+(o?o[0]:0))*100}%;top:${(w.y+(o?o[1]:0))*100}%">${Items.icon(it)}</div>`);(w.z<0?L.b:L.f).append(e)})},
 chk(st){if(!st||!st.art||!st.ch)return;const k=this.key(st)+'|'+this.fl(st);if(st._hk!==k)this.sync(st)},
 syncAll(){this.stages.forEach(s=>{if(!document.contains(s.root)){this.stages.delete(s);return}s._hk=null;this.sync(s)})},
 commit(ch,nl){const rec=this.rec(ch.id),old=rec.w,ids=new Set([...old,...nl].map(w=>w.i));
  for(const id of ids){const d=cnt(nl,id)-cnt(old,id),it=Items.get(id);if(d>0&&!free()&&(!it||it.qty<d)){toast(`${it?it.name:'物品'}數量不足`,'info');return false}}
  for(const id of ids){const d=cnt(nl,id)-cnt(old,id);if(d&&!free())addQty(id,-d)}
  rec.w=pr(cl(nl));this.save();this.syncAll();return true},
 begin(id,st){st=st||Home.stage;if(!st||st!==Home.stage||!st.ch){toast('請回到首頁，拖到角色身上穿戴','info');return false}
  if(Nav.cur!==0)Nav.go(0);const it=Items.get(id);if(!it)return false;
  if(!Ed.on)Ed.enter('dress',st);else if(Ed.mode!=='dress')return false;
  const o=Ed.list.findIndex(w=>w.i===id);if(o>=0){Ed.sel=o;Ed.draw();return true}
  const base=this.rec(st.ch.id).w,need=cnt(Ed.list,id)-cnt(base,id)+1;if(!Ed.pv&&!free()&&it.qty<need){toast(`${it.name}已用完`,'info');return true}
  Ed.snap();Ed.list.push(mk(it));Ed.sel=Ed.list.length-1;Ed.draw(Ed.sel);spark(st,st.x+st.size/2,st.feetY-st.size*.6);buzz(14);return true},
 sheet(){const st=Home.stage;if(!st||!st.ch)return;const ch=st.ch;
  const s=openSheet('<div class="sh-body" id="drB"></div>'),B=$('#drB',s.el);
  const draw=()=>{const rec=this.rec(ch.id),av=Items.d.items.filter(i=>(i.cat==='wear'||i.cat==='acc'||i.uses.some(u=>u.type==='wear'||u.type==='acc'))&&i.qty>0);
   B.innerHTML=`<div class="sh-title">${esc(ch.name)} 的換裝</div>
   ${rec.w.length?rec.w.map((w,n)=>{const it=Items.get(w.i);return it?`<div class="dr-row"><div class="it">${Items.icon(it)}</div><b>${esc(it.name)}・${ANC[w.a]?ANC[w.a].n:'自訂'}</b><button class="btn" style="height:36px;padding:0 12px" data-a="ed" data-n="${n}">調整</button><button class="btn" style="height:36px;padding:0 12px" data-a="rm" data-n="${n}">卸下</button></div><div class="dr-ch"><small style="align-self:center;color:var(--ink-3)">隱藏於</small>${HK.map(h=>`<button class="chip ${(w.h||[]).includes(h[0])?'on':''}" data-a="hk" data-n="${n}" data-h="${h[0]}">${h[1]}</button>`).join('')}</div>`:''}).join(''):'<div class="bg-empty">還沒有穿戴任何物品<br><small>從背包拖到角色身上，或點下方物品</small></div>'}
   <div class="ed-l">可穿戴（背包）</div><div class="dr-ch">${av.length?av.map(i=>`<button class="chip" data-a="add" data-id="${i.id}">${Items.icon(i).replace(/<img/,'<img style="width:18px;height:18px;vertical-align:middle"')} ${esc(i.name)}×${i.qty}</button>`).join(''):'<small style="color:var(--ink-3)">沒有可穿戴物品，到商店購買服裝或飾品</small>'}</div>
   <div class="ed-l">搭配方案</div><div class="dr-ch">${Object.keys(rec.sets).map(k=>`<button class="chip" data-a="ld" data-k="${esc(k)}">${esc(k)}</button><button class="chip" data-a="dl" data-k="${esc(k)}">✕</button>`).join('')}<button class="chip on" data-a="sv">＋ 儲存目前搭配</button></div>
   <div class="dt-row" style="margin-top:10px"><button class="btn grow" data-a="ex">匯出內容包</button><button class="btn grow" data-a="im">匯入</button></div>`};
  draw();B.addEventListener('click',async e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,rec=this.rec(ch.id),n=+b.dataset.n;buzz(6);
   if(a==='ed'){s.close();setTimeout(()=>{if(Ed.on)return;Ed.enter('dress',st);Ed.sel=n;Ed.draw()},250)}
   else if(a==='rm'){const l=pr(cl(rec.w));l.splice(n,1);this.commit(ch,l);draw()}
   else if(a==='hk'){const w=rec.w[n],h=b.dataset.h;w.h=(w.h||[]).includes(h)?w.h.filter(x=>x!==h):[...(w.h||[]),h];this.save();this.syncAll();draw()}
   else if(a==='add'){s.close();setTimeout(()=>this.begin(b.dataset.id,st),250)}
   else if(a==='sv'){const k='搭配'+(Object.keys(rec.sets).length+1);rec.sets[k]=pr(cl(rec.w));this.save();toast('已儲存 '+k,'check');draw()}
   else if(a==='dl'){delete rec.sets[b.dataset.k];this.save();draw()}
   else if(a==='ld'){const set=rec.sets[b.dataset.k];if(set){const l=set.filter(w=>w&&Items.get(w.i)).map(cleanW),ok=this.commit(ch,l);if(ok){spark(st,st.x+st.size/2,st.feetY-st.size*.6,8);toast('已換上 '+b.dataset.k,'sparkle')}draw()}}
   else if(a==='ex')Pack.out();else if(a==='im')Pack.inp()})}};
/* ---------- 家具資料 ---------- */
const YMIN=.50,YMAX=.94,kind=it=>{const t=txt(it);return /地毯|毯|rug|墊/i.test(t)?'rug':/床|窩|枕|bed|🛏/i.test(t)?'bed':/椅|沙發|凳|座|chair|sofa|🪑|🛋/i.test(t)?'sit':/燈|lamp|燭|💡|🕯/i.test(t)?'lamp':/植|花|草|盆|樹|plant|🪴|🌱|🌷|🌵/i.test(t)?'plant':/玩具|球|積木|toy|🧸|⚽|🎈|🧶/i.test(t)?'toy':'deco'};
const dep=y=>.72+.4*clamp((y-YMIN)/(YMAX-YMIN),0,1);
const Room={k:'ocs.room.v1',d:null,els:new Map(),job:null,nx:0,
 load(){this.d=JP(this.k,{s:{home:[]}});if(!this.d.s.home)this.d.s.home=[]},save(){SV(this.k,this.d)},
 list(){return this.d.s.home},
 inUse(id){return this.list().some(p=>p.i===id)},
 mount(st){this.st=st;this.render(this.list());new ResizeObserver(()=>this.render(Ed.on&&Ed.mode==='room'?Ed.list:this.list(),Ed.sel,null,1)).observe(st.root);setInterval(()=>this.tick(),400)},
 render(list,sel,pop,force){const st=this.st;if(!st||!st.root.clientWidth)return;const root=st.root,W=root.clientWidth,H=root.clientHeight,yA=st.feetY/H,seen=new Set();
  list.forEach((p,n)=>{const it=Items.get(p.i);if(!it)return;seen.add(p.u);let e=this.els.get(p.u);const kd=kind(it),fl=kd==='rug';
   if(!e||!e.isConnected){e=el(`<div class="rm-it"><div class="rm-sh"></div><div class="rm-gl"></div><div class="rm-b"></div></div>`);root.append(e);this.els.set(p.u,e);e.dataset.u=p.u;e._ic=null;
    e.addEventListener('pointerdown',ev=>{if(e.classList.contains('act'))ev.stopPropagation()});e.addEventListener('click',()=>{if(!Ed.on)Room.use(p.u,true)})}
   const ic=Items.icon(it);if(e._ic!==ic){e.querySelector('.rm-b').innerHTML=ic;e._ic=ic}
   const k=p.s*dep(p.y);e.className='rm-it'+(fl?' flat':'')+(['sit','bed','lamp','plant','toy'].includes(kd)?' act':'')+(p.on?' on':'')+(n===sel&&Ed.on?' sel':'')+(pop===p.u?' pop':'');
   e.style.cssText=`left:${p.x*100}%;top:${p.y*100}%;--k:${k};--r:${p.r}deg;--f:${p.f};z-index:${n===sel&&Ed.on?6:fl?1:p.z<0?2:p.z>0?4:(p.y<=yA+.01?2:4)};font-size:${W*.2*k*.78}px`;
   if(it.cat==='wear'&&0)e.hidden=1});
  this.els.forEach((e,u)=>{if(!seen.has(u)){e.remove();this.els.delete(u)}});this.light()},
 light(){const st=this.st,ph=st.phase||'day',w=(typeof Env!=='undefined'&&Env.wid)||'sunny',b=(ph==='night'?.78:ph==='dusk'?.93:ph==='dawn'?.95:1)*(w==='rain'||w==='storm'?.94:1);
  this.els.forEach(e=>{e.style.setProperty('--lt',b);e.style.setProperty('--ga',ph==='night'?.7:ph==='dusk'?.55:.28);e.style.setProperty('--sho',ph==='night'?.45:ph==='dusk'?.75:1);e.style.setProperty('--shx',ph==='dawn'?'-7%':ph==='dusk'?'7%':'0%')})},
 begin(id,st,o){st=st||Home.stage;if(!st||st!==Home.stage){toast('請回到首頁佈置','info');return false}if(Nav.cur!==0)Nav.go(0);const it=Items.get(id);if(!it)return false;
  if(!Ed.on)Ed.enter('room',st);else if(Ed.mode!=='room')return false;
  const need=cnt(Ed.list.map(p=>({i:p.i})),id)-cnt(this.list().map(p=>({i:p.i})),id)+1;if(!Ed.pv&&!free()&&it.qty<need){toast(`${it.name}已用完`,'info');return true}
  const r=st.root.getBoundingClientRect();let x=(st.x+st.size/2)/st.root.clientWidth<.5?.78:.22,y=st.feetY/st.H+.015;if(o&&o.px!=null){x=(o.px-r.left)/r.width;y=(o.py-r.top)/r.height}
  Ed.snap();Ed.list.push({u:'f_'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),i:id,x:clamp(x,.05,.95),y:clamp(y,YMIN,YMAX),s:1,r:0,z:0,f:1,on:0,w:0});Ed.sel=Ed.list.length-1;Ed.draw(Ed.list[Ed.sel].u);buzz(12);return true},
 commit(nl){const old=this.list(),ids=new Set([...old,...nl].map(p=>p.i)),c=(l,i)=>l.filter(p=>p.i===i).length;
  for(const id of ids){const d=c(nl,id)-c(old,id),it=Items.get(id);if(d>0&&!free()&&(!it||it.qty<d)){toast(`${it?it.name:'物品'}數量不足`,'info');return false}}
  for(const id of ids){const d=c(nl,id)-c(old,id);if(d&&!free())addQty(id,-d)}
  this.d.s.home=pr(cl(nl));this.save();this.render(this.list());return true},
 /* 互動：角色走到家具旁使用 */
 pos(p){const r=this.st.root;return p.x*r.clientWidth},
 use(u,force){const st=this.st,p=this.list().find(q=>q.u===u);if(!p||!st||Ed.on)return;if(st.state==='held'||st.h>0)return;const it=Items.get(p.i),kd=it&&kind(it);if(!kd||kd==='deco'||kd==='rug')return;
  if(st.sleeping&&st.sleeping()&&kd!=='bed'){if(force)toast(`${st.ch.name}正在睡覺`,'info');return}
  try{if(st.sleeping&&st.sleeping())st.wake()}catch(e){}
  this.job={u,kd,t:Date.now()};try{st.walkTo(this.pos(p)-st.size/2)}catch(e){}},
 act(p,kd){const st=this.st,ch=st.ch,nm=ch.name;let done=1;const go=(id,o)=>{try{st.go(id,o)}catch(e){try{st.play('happy')}catch(_){}}};
  const e=this.els.get(p.u);
  if(kd==='sit'){go('sit');st.say(pick(['坐下來休息一下。','這張椅子好舒服。']),2600)}
  else if(kd==='bed'){st.say('有點睏了…',1800);try{st.play('sleep')}catch(x){go('sleep',{forced:1})}}
  else if(kd==='toy'){go('bounce');st.hearts(2);if(e){e.classList.add('wig');setTimeout(()=>e.classList.remove('wig'),1500)}st.say(pick(['好好玩！','再來一次！']),2200)}
  else if(kd==='plant'){go('wiggle');if(e){for(let i=0;i<4;i++){const d=document.createElement('i');d.className='rm-dr';d.textContent='💧';d.style.left=(30+i*14)+'%';d.style.animationDelay=i*.12+'s';e.append(d);setTimeout(()=>d.remove(),1200)}}p.w=Date.now();this.save();st.hearts(1);st.say('快快長大喔～',2400)}
  else if(kd==='lamp'){p.on=p.on?0:1;this.save();this.render(this.list());st.say(p.on?'亮亮的，好溫暖。':'晚安，燈關囉。',2200)}
  const m=Items.d.mem;spark(st,st.x+st.size/2,st.feetY-st.size*.7,3)},
 tick(){const st=this.st;if(!st||!st.ch||Ed.on)return;const now=Date.now();if(now-(this._lt||0)>5000){this._lt=now;this.light()}
  if(this.job){const p=this.list().find(q=>q.u===this.job.u);if(!p||now-this.job.t>15000||st.state==='held'){this.job=null;return}
   const dist=Math.abs(st.x+st.size/2-this.pos(p));if(dist<st.size*.2&&st.h===0){const j=this.job;this.job=null;this.act(p,j.kd)}return}
  if(Dress.stages.has(st))Dress.chk(st);
  if(now<this.nx)return;this.nx=now+(20+Math.random()*25)*1000;
  if(Nav.cur!==0||document.body.classList.contains('dragging')||st.state==='held'||st.h>0||(st.sleeping&&st.sleeping()))return;
  const ph=st.phase||'day',md=Items.mood(st.ch),tired=md==='tired'||ph==='night',cand=this.list().map(p=>{const it=Items.get(p.i);return it?{p,kd:kind(it)}:null}).filter(c=>c&&['sit','bed','lamp','plant','toy'].includes(c.kd));
  if(!cand.length)return;const wgt=c=>c.kd==='bed'?(tired?4:.3):c.kd==='toy'?(md==='happy'||md==='excited'?3:1):c.kd==='lamp'?(ph==='night'||ph==='dusk'?(c.p.on?.2:3):.4):c.kd==='plant'?(Date.now()-(c.p.w||0)>36e5?2:.3):1.4;
  let tot=cand.reduce((a,c)=>a+wgt(c),0),r=Math.random()*tot,c=cand[0];for(const x of cand){r-=wgt(x);if(r<=0){c=x;break}}this.use(c.p.u)}};
/* ---------- 編輯模式（共用手勢） ---------- */
const Ed={on:false,mode:'',st:null,list:[],sel:-1,undo:[],redo:[],snapOn:true,off:null,pk:'',dm:false,pv:false,
 tk(){return this.pk+(this.dm&&this.flipped()?'~':'')},
 pose(){const st=this.st,pk=this.pk;try{if(pk==='sit')st.go('sit');else if(pk==='sleep')st.play('sleep');else{if(st.sleeping&&st.sleeping())st.wake();st.go('stand')}}catch(e){}},
 guides(c){const cap=this.cap;if(!this.gv){this.gv=el('<i class="edg v"></i>');this.gh=el('<i class="edg h"></i>');cap.append(this.gv,this.gh)}
  cap.classList.toggle('dg',this.snapOn);const st=this.st,yA=st.feetY/st.root.clientHeight;this.gv.classList.toggle('on',this.snapOn&&Math.abs(c.x-.5)<.016);this.gh.style.top=yA*100+'%';this.gh.classList.toggle('on',this.snapOn&&Math.abs(c.y-yA)<.016)},
 snap(){this.undo.push(cl(this.list));if(this.undo.length>40)this.undo.shift();this.redo=[]},
 enter(mode,st){this.on=true;this.mode=mode;this.st=st;this.sel=-1;this.pk='';this.dm=false;this.undo=[];this.redo=[];this.list=pr(cl(mode==='dress'?Dress.worn(st.ch.id):Room.list()));
  document.body.classList.add('oc-edit');this.ao=st.o.auto;st.o.auto=false;try{if(st.sleeping&&st.sleeping())st.wake();st.interrupt();st.go('stand')}catch(e){}
  this.fz=setInterval(()=>{try{if(this.pk==='sit'||this.pk==='sleep')return;if(st.B&&st.B.id!=='stand'&&st.state!=='held')st.go('stand')}catch(e){}},700);
  const home=$('#p-home');this.cap=el('<div id="edCap"></div>');this.top=el(`<div id="edTop" class="glass"><button class="eb" data-k="cancel">取消</button><button class="eb" data-k="undo">${ic('undo',18)}</button><button class="eb" data-k="redo">${ic('redo',18)}</button><button class="eb pri" data-k="done">${this.pv?'結束預覽':'完成'}</button></div>`);
  this.bar=el('<div id="edBar" class="glass"></div>');this.hint=el(`<div id="edHint" class="glass">${mode==='dress'?'拖曳移動・雙指縮放旋轉':'拖曳家具・雙指縮放旋轉・點選切換'}</div>`);
  home.append(this.cap,this.top,this.bar,this.hint);this.bar.onclick=e=>this.act(e);this.top.onclick=e=>this.act(e);this.gest();setTimeout(()=>this.hint&&this.hint.remove(),4200);this.draw()},
 sh(){const st=this.st,r=this.mode==='dress'?(st.art.querySelector('.dr-f')||st.art).getBoundingClientRect():st.root.getBoundingClientRect();return r},
 flipped(){const a=this.st.art,f=a.querySelector('.dr-b');if(!f)return false;const mk=f.querySelector('.dr-mk').getBoundingClientRect(),r=f.getBoundingClientRect();return mk.left>r.left+r.width/2},
 draw(pop){const dr=this.mode==='dress',cur=this.list[this.sel];
  if(dr)Dress.sync(this.st,this.list,this.sel,pop!=null?this.sel:null);else Room.render(this.list,this.sel,pop);
  let h='';if(dr){h+=`<div class="edr">${Object.keys(ANC).map(k=>`<button class="eb ${cur&&cur.a===k?'on':''}" data-k="anc" data-a="${k}" ${cur?'':'disabled'}>${ANC[k].n}</button>`).join('')}<span style="flex:none;width:1px;background:var(--line);margin:4px 2px"></span>${[['','預設'],['walk','走'],['sleep','睡'],['sit','坐'],['hop','跳']].map(m=>`<button class="eb ${this.pk===m[0]?'on':''}" data-k="pk" data-m="${m[0]}">${m[1]}</button>`).join('')}<button class="eb ${this.dm?'on':''}" data-k="dm">僅此方向</button><button class="eb" data-k="turn">↔轉身</button></div>`}
  const D=cur?'':'disabled';h+=`<div class="edr"><button class="eb" data-k="add">＋加入</button><button class="eb" data-k="sm" ${D}>縮小</button><button class="eb" data-k="lg" ${D}>放大</button><button class="eb" data-k="rl" ${D}>↺</button><button class="eb" data-k="rr" ${D}>↻</button><button class="eb" data-k="z" ${D}>${cur?(dr?(cur.z<0?'層：後':'層：前'):(cur.z<0?'層：後':cur.z>0?'層：前':'層：自動')):'圖層'}</button><button class="eb" data-k="fl" ${D}>鏡像</button>${dr?'':`<button class="eb ${this.snapOn?'on':''}" data-k="snap">吸附</button>`}<button class="eb" data-k="rs" ${D}>重設</button><button class="eb" data-k="del" ${D}>${dr?'卸下':'收回'}</button></div>`;if(this.bar._html!==h){this.bar.innerHTML=h;this.bar._html=h}},
 act(e){const b=e.target.closest('[data-k]');if(!b||b.disabled)return;const k=b.dataset.k,c=this.list[this.sel],dr=this.mode==='dress';buzz(6);
  if(k==='cancel'){this.exit(false);return}if(k==='done'){this.exit(true);return}
  if(k==='undo'||k==='redo'){const a=k==='undo'?this.undo:this.redo,o=k==='undo'?this.redo:this.undo;if(!a.length)return;o.push(cl(this.list));this.list=pr(a.pop());this.sel=Math.min(this.sel,this.list.length-1);this.draw();return}
  if(k==='add'){this.addSheet();return}if(k==='snap'){this.snapOn=!this.snapOn;this.draw();return}
  if(k==='pk'){this.pk=b.dataset.m;this.pose();this.draw();return}if(k==='dm'){this.dm=!this.dm;this.draw();return}
  if(k==='turn'){try{const s=this.st;s.dir=-s.dir;s.render&&s.render(true)}catch(e){}setTimeout(()=>{this.st._dk=null;this.draw()},80);return}
  if(!c)return;this.snap();
  if(k==='anc'){const p=ANC[b.dataset.a];Object.assign(c,{a:b.dataset.a,x:p.x,y:p.y,s:c.s||p.s});if(p.z)c.z=p.z}
  else if(k==='sm')c.s=clamp(c.s/1.12,dr?.06:.3,dr?1.4:3);else if(k==='lg')c.s=clamp(c.s*1.12,dr?.06:.3,dr?1.4:3);
  else if(k==='rl')c.r=Math.round((c.r-15)%360);else if(k==='rr')c.r=Math.round((c.r+15)%360);
  else if(k==='z')c.z=dr?(c.z<0?1:-1):(c.z===0?-1:c.z<0?1:0);else if(k==='fl')c.f=-c.f;
  else if(k==='rs'){if(dr){const tk=this.tk();if(tk){if(c.o)delete c.o[tk]}else{const p=ANC[c.a]||ANC.free;Object.assign(c,{x:p.x,y:p.y,s:p.s,r:0,f:1,z:p.z||1,o:{}})}}else Object.assign(c,{x:.25,y:YMAX-.05,s:1,r:0,f:1,z:0})}
  else if(k==='del'){this.list.splice(this.sel,1);this.sel=-1}
  this.draw()},
 addSheet(){const dr=this.mode==='dress';
  const s=openSheet('<div class="sh-body" id="adB"></div>'),B=$('#adB',s.el);
  const draw=()=>{const L=Items.d.items.filter(i=>(i.qty>0||this.pv||free())&&(dr?(i.cat==='wear'||i.cat==='acc'||i.uses.some(u=>u.type==='wear'||u.type==='acc')):(i.cat==='furn'||i.uses.some(u=>u.type==='furn')))),sv=Room.d.saved||{};
   B.innerHTML=`<div class="sh-title">${dr?'選擇服裝或飾品':'選擇家具'}</div><div class="dr-ch">${L.length?L.map(i=>`<button class="chip" data-id="${i.id}">${Items.icon(i).replace(/<img/,'<img style="width:20px;height:20px;vertical-align:middle"')} ${esc(i.name)}×${i.qty}</button>`).join(''):'<div class="bg-empty">背包裡沒有可用物品<br><small>到商店購買後再回來</small></div>'}</div>${dr?'':`<div class="ed-l">場景方案</div><div class="dr-ch">${Object.keys(sv).map(k=>`<button class="chip" data-a="ld" data-k="${esc(k)}">${esc(k)}</button><button class="chip" data-a="dl" data-k="${esc(k)}">✕</button>`).join('')}<button class="chip on" data-a="sv">＋ 儲存目前佈置</button></div>`}`};
  draw();s.el.addEventListener('click',e=>{const a=e.target.closest('[data-a]');
   if(a){const k=a.dataset.k,sv=Room.d.saved||(Room.d.saved={});
    if(a.dataset.a==='sv'){sv['佈置'+(Object.keys(sv).length+1)]=pr(cl(this.list));Room.save();toast('已儲存佈置方案','check');draw()}
    else if(a.dataset.a==='dl'){delete sv[k];Room.save();draw()}
    else if(a.dataset.a==='ld'&&sv[k]){this.snap();this.list=sv[k].filter(p=>p&&Items.get(p.i)).map(p=>({u:'f_'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),i:String(p.i),x:clamp(+p.x||.5,.04,.96),y:clamp(+p.y||.8,YMIN,YMAX),s:clamp(+p.s||1,.3,3),r:(+p.r||0)%360,z:[-1,0,1].includes(p.z)?p.z:0,f:p.f===-1?-1:1,on:0,w:0}));this.sel=-1;this.draw();s.close();toast('已載入佈置，按完成後套用（數量不足會被拒絕）','info')}
    return}
   const b=e.target.closest('[data-id]');if(!b)return;s.close();setTimeout(()=>dr?Dress.begin(b.dataset.id,this.st):Room.begin(b.dataset.id,this.st),220)})},
 gest(){const P=new Map(),cap=this.cap,dr=this.mode==='dress';let g=null;
  const pick=(x,y)=>{const r=this.sh(),fl=dr&&this.flipped();let best=-1,bd=1e9;
   if(dr)this.list.forEach((w,n)=>{const cx=r.left+(fl?1-w.x:w.x)*r.width,cy=r.top+w.y*r.height,rad=Math.max(26,w.s*r.width*.6),d=Math.hypot(x-cx,y-cy);if(d<rad&&d<bd){bd=d;best=n}});
   else this.list.forEach((p,n)=>{const e=Room.els.get(p.u);if(!e)return;const q=e.getBoundingClientRect();if(x>q.left-8&&x<q.right+8&&y>q.top-8&&y<q.bottom+8){const d=n===this.sel?-1:Math.abs(y-q.bottom);if(d<bd){bd=d;best=n}}});return best};
  cap.addEventListener('pointerdown',e=>{cap.setPointerCapture(e.pointerId);P.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(P.size===1){let h=pick(e.clientX,e.clientY);if(h<0&&this.sel>=0&&dr)h=-1;g={x0:e.clientX,y0:e.clientY,lx:e.clientX,ly:e.clientY,m:0,two:0,hit:h};if(h>=0&&h!==this.sel){this.sel=h;this.draw()}
    if(g.hit>=0&&!dr){const p=this.list[this.sel],r=this.st.root.getBoundingClientRect();this.off={x:r.left+p.x*r.width-e.clientX,y:r.top+p.y*r.height-e.clientY}}}
   else if(P.size===2&&this.sel>=0){const [a,b]=[...P.values()];g.d=Math.hypot(a.x-b.x,a.y-b.y);g.a=Math.atan2(b.y-a.y,b.x-a.x);g.two=1;if(!g.sn){this.snap();g.sn=1}}});
  cap.addEventListener('pointermove',e=>{if(!P.has(e.pointerId)||!g)return;P.set(e.pointerId,{x:e.clientX,y:e.clientY});const c=this.list[this.sel];
   if(P.size===1&&!g.two&&g.hit>=0&&c){if(!g.m&&Math.hypot(e.clientX-g.x0,e.clientY-g.y0)<6)return;if(!g.m){g.m=1;this.snap()}
    if(dr){const r=this.sh(),fl=this.flipped(),dx=(e.clientX-g.lx)/r.width*(fl?-1:1),dy=(e.clientY-g.ly)/r.height,tk=this.tk();if(tk){c.o=c.o||{};const o=c.o[tk]||(c.o[tk]=[0,0]);o[0]=clamp(o[0]+dx,-.5,.5);o[1]=clamp(o[1]+dy,-.5,.5)}else{c.x=clamp(c.x+dx,-.2,1.2);c.y=clamp(c.y+dy,-.2,1.2)}}
    else{const r=this.st.root.getBoundingClientRect();let x=(e.clientX+this.off.x-r.left)/r.width,y=(e.clientY+this.off.y-r.top)/r.height;if(this.snapOn){x=Math.round(x*32)/32;y=Math.round(y*50)/50;const yA=this.st.feetY/this.st.root.clientHeight;if(Math.abs(y-yA)<.025)y=yA;this.list.forEach((q,m)=>{if(m!==this.sel&&Math.abs(q.x-x)<.02)x=q.x})}c.x=clamp(x,.04,.96);c.y=clamp(y,YMIN,YMAX);this.guides(c)}
    g.lx=e.clientX;g.ly=e.clientY;this.draw()}
   else if(P.size===2&&c){const [a,b]=[...P.values()],d=Math.hypot(a.x-b.x,a.y-b.y),an=Math.atan2(b.y-a.y,b.x-a.x);let da=(an-g.a)*180/Math.PI;if(da>180)da-=360;if(da<-180)da+=360;
    c.s=clamp(c.s*d/Math.max(g.d,1),dr?.06:.3,dr?1.4:3);const fl=dr&&this.flipped();c.r=Math.round((c.r+(fl?-da:da)+360)%360);if(this.snapOn&&!dr)c.r=Math.round(c.r/15)*15%360;g.d=d;g.a=an;this.draw()}});
  const up=e=>{P.delete(e.pointerId);if(!P.size){cap.classList.remove('dg');if(this.gv){this.gv.classList.remove('on');this.gh.classList.remove('on')}if(g&&!g.m&&!g.two&&g.hit<0){this.sel=-1;this.draw()}g=null}};cap.addEventListener('pointerup',up);cap.addEventListener('pointercancel',up)},
 exit(save){const st=this.st,mode=this.mode;let ok=true;
  if(save&&!this.pv){ok=mode==='dress'?Dress.commit(st.ch,this.list):Room.commit(this.list);if(ok){const l=this.list[this.sel]||this.list[this.list.length-1];spark(st,st.x+st.size/2,st.feetY-st.size*.6,8);toast(mode==='dress'?'穿戴完成':'佈置完成','sparkle')}}
  if(!ok)return;this.on=false;clearInterval(this.fz);[this.cap,this.top,this.bar,this.hint].forEach(n=>n&&n.remove());document.body.classList.remove('oc-edit');st.o.auto=this.ao;st.sel=-1;this.sel=-1;
  this.pk='';if(mode==='dress'){st._dk=null;Dress.syncAll()}else Room.render(Room.list());try{if(st.sleeping&&st.sleeping())st.wake();st.go('stand')}catch(e){}
  if(this.pv){this.pv=false;toast('預覽結束，沒有任何物品變動','info')}else if(!save)toast('已取消，物品未變動','info')}};
Dress.preview=function(id){if(Ed.on)return;if(Nav.cur!==0)Nav.go(0);Ed.pv=true;setTimeout(()=>{if(!Dress.begin(id,Home.stage))Ed.pv=false},420)};
Room.preview=function(id){if(Ed.on)return;if(Nav.cur!==0)Nav.go(0);Ed.pv=true;setTimeout(()=>{if(!Room.begin(id,Home.stage))Ed.pv=false},420)};
/* ---------- 內容包匯入匯出 ---------- */
const Pack={out(){const ids=new Set([...Object.values(Dress.d.c).flatMap(r=>[...r.w,...Object.values(r.sets).flat()].map(w=>w.i)),...Room.list().map(p=>p.i)]);
  const items=Items.d.items.filter(i=>ids.has(i.id)||i.cat==='wear'||i.cat==='acc'||i.cat==='furn').map(i=>Object.assign({},i,{qty:0}));
  const b=new Blob([JSON.stringify({format:'oc-shimeji-pack',v:1,items,dress:Dress.d,room:Room.d})],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='oc-pack-'+Date.now()+'.json';document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);toast('已匯出內容包','check')},
 inp(){const f=document.createElement('input');f.type='file';f.accept='application/json,.json';f.onchange=async()=>{try{const t=f.files[0];if(!t||t.size>30e6)throw 0;const o=JSON.parse(await t.text());if(o.format!=='oc-shimeji-pack'||!Array.isArray(o.items))throw 0;let n=0;
   o.items.slice(0,300).forEach(i=>{const x=Items.norm(i);if(x&&!Items.get(x.id)){x.qty=0;x.builtin=0;Items.d.items.push(x);n++}});Items.emit();
   if(o.dress&&o.dress.c)Object.keys(o.dress.c).forEach(id=>{const r=o.dress.c[id];if(r&&r.sets){const mine=Dress.rec(id);Object.keys(r.sets).forEach(k=>{if(!mine.sets[k])mine.sets[k]=r.sets[k]})}});if(o.room){const sv=Room.d.saved||(Room.d.saved={}),add=(k,l)=>{const f=(Array.isArray(l)?l:[]).filter(p=>p&&Items.get(p.i)).slice(0,60);if(f.length)sv[k]=f};add('匯入佈置',o.room.s&&o.room.s.home);Object.keys(o.room.saved||{}).slice(0,10).forEach(k=>add(('匯入・'+k).slice(0,12),o.room.saved[k]));Room.save()}
   Dress.save();toast(`已匯入 ${n} 件物品（數量 0，需至商店取得）、搭配與佈置方案`,'check')}catch(e){toast('內容包格式不正確','info')}};f.click()}};
/* ---------- 與既有系統掛接 ---------- */
const _use=Items.use;Items.use=function(id,st,opt){const it=this.get(id);if(it){const u=(opt&&opt.use&&it.uses.find(x=>x.type===opt.use))||it.uses[0];
  const ty=u&&u.type,cu=ty==='custom';if(u&&(ty==='wear'||ty==='acc'||(cu&&(it.cat==='wear'||it.cat==='acc'))))return Dress.begin(id,st);if(u&&(ty==='furn'||(cu&&it.cat==='furn')))return Room.begin(id,st,{px:Drag._x,py:Drag._y})}return _use.apply(this,arguments)};
const _drop=Items.drop;Items.drop=function(id,st,px){const it=this.get(id);if(it&&isF(it)&&it.target!=='char')return Room.begin(id,st,{px:px,py:Drag._y});return _drop.apply(this,arguments)};
const _mv=Drag.move;Drag.move=function(x,y){Drag._x=x;Drag._y=y;return _mv.apply(this,arguments)};
const _del=Items.del;Items.del=function(id){if(Dress.inUse(id)||Room.inUse(id)){toast('此物品正在使用中，請先卸下或收回','info');return}return _del.apply(this,arguments)};
const _sc=Stage.prototype.setChar;Stage.prototype.setChar=function(){const r=_sc.apply(this,arguments);try{Dress.stages.add(this);this._dk=null;Dress.sync(this)}catch(e){}return r};
const boot=setInterval(()=>{try{if(!(Home.stage&&Chars.list.length&&Items.d&&Bag.el))return;clearInterval(boot);Dress.load();Room.load();Dress.stages.add(Home.stage);Dress.sync(Home.stage);Room.mount(Home.stage);
  setInterval(()=>{if(Ed.on)return;Dress.stages.forEach(s=>{if(s.art&&!s.art.querySelector(':scope>.dr-f'))s._dk=null;Dress.sync(s)});},800);
  window.OCS24D={Dress,Room,Ed,Pack,free:false,addQty,isW,isF}}catch(e){console.error('2.4D',e)}},120);
})();
