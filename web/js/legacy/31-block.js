/* ===== 2.5 經濟系統：貨幣・交易・任務・收入來源（可擴充） =====
   所有收入統一走 Econ.pay()；所有庫存增加統一走 Inv.grant()（收據去重）。
   擴充：Econ.addJob / Econ.addAch / Econ.hook(kind) 即可新增收入來源。 */
(()=>{
const CAP=99999999,DAY=864e5,I=n=>Math.max(0,Math.floor(+n)||0),LA={};
const hash=s=>{s=String(s);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0)/4294967295};
const dn=()=>{const d=new Date();return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/DAY)};
const BONUS=60,FIND_DAY=6;
const JT=[{k:'pet',t:'撫摸夥伴',ic:'heart',n:[3,5],r:[25,35],w:3},{k:'water',t:'幫植物澆水',ic:'drop',n:[1,1],r:[20,25],w:2},
 {k:'feed',t:'餵夥伴吃點心',ic:'bag',n:[1,2],r:[35,55],w:3},{k:'play',t:'陪夥伴玩玩具',ic:'sparkle',n:[1,2],r:[35,50],w:2},
 {k:'furn',t:'和家具互動',ic:'sparkle',n:[2,3],r:[30,45],w:2},{k:'find',t:'在家裡有新發現',ic:'sparkle',n:[1,2],r:[40,60],w:2},
 {k:'story',t:'見證一段生活小事件',ic:'book',n:[1,1],r:[50,70],w:1},{k:'gift',t:'送出一份禮物',ic:'heart',n:[1,1],r:[45,60],w:1},
 {k:'call',t:'呼叫夥伴過來',ic:'sparkle',n:[2,3],r:[20,30],w:1}];
const AC=[['feed','貼心照顧',[[10,60],[50,150],[200,400]]],['pet','溫柔陪伴',[[30,50],[150,150],[500,350]]],['water','綠手指',[[5,40],[30,120]]],
 ['play','玩伴',[[10,60],[60,160]]],['furn','居家達人',[[10,60],[60,160]]],['find','小小探險家',[[5,60],[30,200]]],
 ['story','故事見證者',[[3,80],[20,250]]],['gift','心意滿滿',[[5,80],[25,220]]],['wish','心願達成',[[3,80],[20,300]]],['job','勤奮委託人',[[7,100],[30,350]]]]
 .map(([id,t,tiers])=>({id,t,tiers}));
const Econ=window.Econ={redraw:null,
 get s(){const v=Eco.v;let e=v.e;if(!e||typeof e!=='object'||Array.isArray(e))e=v.e={};e.v=2;e.day=typeof e.day==='string'?e.day:'';
  ['jobs','finds','rc','pend','led'].forEach(k=>{if(!Array.isArray(e[k]))e[k]=[]});
  ['life','ach','stat','cap'].forEach(k=>{if(!e[k]||typeof e[k]!=='object'||Array.isArray(e[k]))e[k]={}});return e},
 addJob(t){JT.push(t)},addAch(a){AC.push(a)},
 /* ---- 單一入口：發放收入（星幣＋物品），收據去重，先寫日誌再入庫 ---- */
 pay(rid,src,coins,items=[]){const e=this.s;coins=Math.min(I(coins),5000);rid=String(rid);
  items=items.map(x=>({id:String(x.id),n:Math.min(I(x.n),99)})).filter(x=>x.n>0&&Items.get(x.id));
  if(e.rc.includes(rid)||(!coins&&!items.length))return false;
  e.rc.push(rid);if(e.rc.length>400)e.rc.shift();Eco.v.coins=Math.min(CAP,I(Eco.v.coins)+coins);
  if(items.length)e.pend.push({id:rid,items});this.log(src,coins,rid);Eco.save();this.flush();HUD.refresh();return true},
 flush(){const e=this.s;if(!e.pend.length)return;e.pend.forEach(p=>p.items.forEach((x,i)=>Inv.grant(x.id,x.n,'econ',p.id+':'+i)));e.pend=[];Eco.save()},
 log(src,a,rid){const e=this.s;e.led.unshift({t:Date.now(),s:src,a,b:I(Eco.v.coins),r:String(rid).slice(0,40)});e.led.length=Math.min(e.led.length,60)},
 /* ---- 商店購買：扣款與發貨寫入同一份日誌，中途關閉也能補發、不會重複 ---- */
 buy(pid,from){if(Shop.busy)return false;Shop.busy=true;setTimeout(()=>{Shop.busy=false},450);
  const p=Cat.prod(pid),it=p&&Items.get(p.itemId);if(!p||!it)return false;const pr=I(Cat.price(p));
  if(I(it.qty)>=999){toast('這個物品已達持有上限','info');return false}
  if(Wallet.bal()<pr){buzz(20);toast(`星幣不足（還差 ${pr-Wallet.bal()}）`,'info');return false}
  const e=this.s,rid='b_'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  Eco.v.coins=Wallet.bal()-pr;e.pend.push({id:rid,items:[{id:it.id,n:1}]});this.log('shop',-pr,rid);
  Cat.d.tx.unshift({t:Date.now(),id:it.id,price:pr,bal:Wallet.bal()});Cat.d.tx.length=Math.min(Cat.d.tx.length,60);Cat.save();
  Eco.save();this.flush();HUD.refresh();buzz([12,30,12]);Shop.fly(it,from);toast(`已購買「${it.name}」（持有 ${Items.get(it.id).qty}）`,'sparkle');return true},
 /* ---- 每日刷新（以「當日序號」為亂數種子：重開、改時間都刷不出新委託） ---- */
 roll(){const e=this.s,n=dn();if(e.jobs.length&&(e.day===Eco.day()||n<I(Eco.v.dm)))return;
  e.day=Eco.day();e.cap={};e.life={};e.bc=0;e.finds=e.finds.filter(f=>f.exp>Date.now());e.jobs=this.make(n);Eco.save()},
 make(n){return JT.map(t=>({t,k:-Math.log(hash(n+t.k)+1e-9)/t.w})).sort((a,b)=>a.k-b.k).slice(0,3).map(({t})=>{const r=hash(n+t.k+'x'),pk=a=>a[0]+Math.round((a[1]-a[0])*r);
   return{id:'j'+n+'_'+t.k,k:t.k,t:t.t,ic:t.ic,n:pk(t.n),r:Math.round(pk(t.r)/5)*5,p:0,c:0}})},
 sync(){const e=this.s,v=Eco.v;QUESTS.length=0;e.jobs.forEach(j=>QUESTS.push({id:j.id,k:j.k,t:j.t,n:j.n,r:j.r,ic:j.ic}));
  if(e.jobs.length)QUESTS.push({id:'jb',k:'_',t:'全部完成的額外獎勵',n:e.jobs.length,r:BONUS,ic:'sparkle'});
  v.q=v.q&&typeof v.q==='object'?v.q:{};v.q.done={};e.jobs.forEach(j=>{if(j.c)v.q.done[j.id]=1});if(e.bc)v.q.done.jb=1},
 /* ---- 玩法事件進入點 ---- */
 on(k,x,force){const e=this.s;this.roll();const t=Date.now(),g=force?0:({pet:2500,call:2500,hop:2500,furn:4000,play:1500,water:1500}[k]||600);
  if(t-(LA[k]||0)<g)return;LA[k]=t;e.stat[k]=I(e.stat[k])+1;
  e.jobs.forEach(j=>{if(j.k===k&&!j.c&&j.p<j.n){j.p++;if(j.p>=j.n)setTimeout(()=>toast(`委託「${j.t}」完成，可領取獎勵`,'sparkle'),700)}});
  Eco.save();HUD.refresh();this.redraw&&this.redraw()},
 claimJob(id){const e=this.s;this.roll();let r=0;
  if(id==='jb'){if(e.bc||!e.jobs.length||!e.jobs.every(j=>j.c))return false;const it=Items.d.items.find(i=>i.builtin&&i.name==='草莓蛋糕');e.bc=1;r=BONUS;
   if(!this.pay('jb_'+dn(),'job',BONUS,it?[{id:it.id,n:1}]:[])){e.bc=0;return false}}
  else{const j=e.jobs.find(x=>x.id===id);if(!j||j.c||j.p<j.n)return false;j.c=1;r=j.r;if(!this.pay('j_'+j.id,'job',j.r)){j.c=0;return false}e.stat.job=I(e.stat.job)+1;Eco.save()}
  buzz(14);toast(`委託完成 +${r} 星幣${id==='jb'?'・獲得草莓蛋糕':''}`,'sparkle');this.sync();HUD.refresh();this.redraw&&this.redraw();return true},
 achReady(a){const e=this.s,c=I(e.ach[a.id]),t=a.tiers[c];return !!t&&I(e.stat[a.id])>=t[0]},
 claimAch(id){const a=AC.find(x=>x.id===id),e=this.s;if(!a||!this.achReady(a))return false;const c=I(e.ach[id]),t=a.tiers[c];e.ach[id]=c+1;
  if(!this.pay('a_'+id+'_'+c,'ach',t[1])){e.ach[id]=c;return false}buzz(14);toast(`成就「${a.t}」+${t[1]} 星幣`,'sparkle');HUD.refresh();this.redraw&&this.redraw();return true},
 /* ---- 角色心願：想吃某樣物品，餵到就自動獲得獎勵 ---- */
 wishEnsure(){const ch=Chars.active();if(!ch)return;const e=this.s,L=e.life[ch.id]||(e.life[ch.id]={n:0,w:null,next:0});
  if(L.w||L.n>=2||Date.now()<L.next)return;
  const cand=Cat.d.products.map(p=>Items.get(p.itemId)).filter(i=>i&&['food','drink'].includes(i.cat)&&i.uses.some(u=>u.type==='food'||u.type==='drink'));if(!cand.length)return;
  const lv=i=>{try{return({fav:3,love:3,like:2,meh:1})[Taste.api.level(ch,i).level]||0}catch(x){return 1}};
  const best=[2,1,0].map(m=>cand.filter(i=>lv(i)>=m)).find(a=>a.length)||cand,it=best[Math.floor(hash(ch.id+e.day+L.n)*best.length)];
  L.w={item:it.id,n:L.n};L.n++;Eco.save();this.redraw&&this.redraw();
  try{const st=Home.stage;if(st&&st.ch===ch&&Nav.cur===0)setTimeout(()=>st.say(`好想吃「${it.name}」…`,3600),1200)}catch(x){}},
 wishFed(d){const e=this.s,L=e.life[d.charId];if(!L||!L.w||L.w.item!==d.itemId||['dislike','hate','worst'].includes(d.level))return;
  const rid='w_'+d.charId+'_'+e.day+'_'+L.w.n,w=L.w;L.w=null;L.next=Date.now()+40*60e3;
  if(!this.pay(rid,'wish',70)){return}e.stat.wish=I(e.stat.wish)+1;const V=Eco.v;V.bond[d.charId]=I(V.bond[d.charId])+12;Eco.save();
  setTimeout(()=>toast('心願達成！+70 星幣','heart'),1400);HUD.refresh();this.redraw&&this.redraw()},
 /* ---- 探索：夥伴在家探索時留下發現物，點一下撿起（有上限與冷卻） ---- */
 maybeFind(src,p=.3){const e=this.s,st=Home.stage,now=Date.now();if(!st||!st.ch||Math.random()>p||e.finds.length>=2||I(e.cap.find)>=FIND_DAY||now<I(e.fnx))return;
  e.fnx=now+6*60e3;e.cap.find=I(e.cap.find)+1;const x=clamp((st.x+st.size/2)/Math.max(1,st.root.clientWidth)+(Math.random()-.5)*.24,.08,.92);
  e.finds.push({id:'f'+now.toString(36)+Math.random().toString(36).slice(2,5),x,exp:now+20*60e3,src});Eco.save();this.drawFinds()},
 drawFinds(){const st=window.Home&&Home.stage;if(!st||!st.root)return;const e=this.s,now=Date.now(),n0=e.finds.length;e.finds=e.finds.filter(f=>f.exp>now);if(e.finds.length!==n0)Eco.save();
  st.root.querySelectorAll('.ec-find').forEach(n=>{if(!e.finds.some(f=>f.id===n.dataset.id))n.remove()});
  e.finds.forEach(f=>{let b=st.root.querySelector(`.ec-find[data-id="${f.id}"]`);if(!b){b=document.createElement('button');b.className='ec-find';b.dataset.id=f.id;b.setAttribute('aria-label','撿起發現物');b.textContent='✨';
   b.addEventListener('pointerdown',ev=>ev.stopPropagation());b.onclick=ev=>{ev.stopPropagation();this.collect(f.id,b)};st.root.append(b)}
   b.style.left=f.x*100+'%';b.style.top=(st.feetY-26)+'px'})},
 collect(id,node){const e=this.s,i=e.finds.findIndex(f=>f.id===id);if(i<0)return;const f=e.finds.splice(i,1)[0];if(node)node.remove();
  const h=hash(f.id),pool=Items.d.items.filter(x=>x.builtin&&['food','drink'].includes(x.cat));let coins=0,its=[];
  if(h<.22&&I(e.cap.fi)<3&&pool.length){const it=pool[Math.floor(hash(f.id+'i')*pool.length)];its=[{id:it.id,n:1}];e.cap.fi=I(e.cap.fi)+1}else coins=h>.95?60:12+Math.floor(hash(f.id+'c')*19);
  if(!this.pay('f_'+f.id,'find',coins,its)){Eco.save();return}buzz(12);
  toast(its.length?`發現了「${Items.get(its[0].id).name}」！`:`撿到 ${coins} 星幣`,'sparkle');this.on('find',{},true)},
 tick(){try{this.roll();this.wishEnsure();this.drawFinds();HUD.refresh()}catch(e){}}};
Econ.s;window.OCS_AC=AC;

/* ---- 與既有系統接合 ---- */
Eco.prog=q=>q.id==='jb'?Econ.s.jobs.filter(j=>j.c).length:Math.min(q.n,(Econ.s.jobs.find(j=>j.id===q.id)||{}).p||0);
Eco.ready=q=>{const e=Econ.s;if(q.id==='jb')return e.jobs.length>0&&!e.bc&&e.jobs.every(j=>j.c);const j=e.jobs.find(x=>x.id===q.id);return !!j&&!j.c&&j.p>=j.n};
Eco.anyReady=()=>QUESTS.some(q=>Eco.ready(q))||AC.some(a=>Econ.achReady(a));
Eco.claim=id=>Econ.claimJob(id);
{const sv=Eco.save;Eco.save=function(){try{const v=this.v;v.coins=Math.min(CAP,I(v.coins));v.gems=I(v.gems);v.streak=I(v.streak);v.dm=I(v.dm);
  if(!v.bond||typeof v.bond!=='object')v.bond={};for(const k in v.bond)v.bond[k]=I(v.bond[k]);Econ.s}catch(e){}return sv.apply(this,arguments)}}
Wallet.bal=()=>Math.min(CAP,I(Eco.v.coins));
Wallet.spend=function(n){if(!Number.isInteger(n)||n<0||this.bal()<n)return false;Eco.v.coins=this.bal()-n;Eco.save();HUD.refresh();return true};
Wallet.earn=function(n){n=Math.floor(+n);if(!(n>0))return;Eco.v.coins=Math.min(CAP,this.bal()+n);Econ.log('misc',n,'earn');Eco.save();HUD.refresh()};
Inv.grant=function(id,n,src,rid){n=Math.floor(+n);if(!(n>0)||n>99)return false;const it=Items.get(id);if(!it)return false;
 const A=Items.d.applied||(Items.d.applied=[]);if(rid){if(A.includes(rid))return true;A.push(rid);if(A.length>600)A.splice(0,A.length-600)}
 it.qty=Math.min(999,I(it.qty)+n);Items.save(true);Items.emit();return true};
Shop.buy=function(pid,from){return Econ.buy(pid,from)};
HUD.questTap=function(){buzz(8);const q=QUESTS.find(x=>Eco.ready(x));if(q)Eco.claim(q.id);else openQuests(AC.some(a=>Econ.achReady(a))?3:0)};
{const hr=HUD.refresh;HUD.refresh=function(){try{Econ.roll();Econ.sync()}catch(e){}return hr.apply(this,arguments)}}
/* 背包不可造物／改數量：數量只能由 Inv.grant（購買、獎勵）增加，使用與丟棄只會減少 */
{const ia=Items.add;Items.add=function(o){return ia.call(this,Object.assign({},o,{qty:0}))};
 const iu=Items.upd;Items.upd=function(id,o){if(o&&'qty' in o){o=Object.assign({},o);delete o.qty}return iu.call(this,id,o)};
 const il=Items.load;Items.load=function(){il.apply(this,arguments);try{const o=JSON.parse(localStorage.getItem(this.k));if(o&&Array.isArray(o.applied))this.d.applied=o.applied.filter(x=>typeof x==='string').slice(-600)}catch(e){}};
 const iu2=Items.use;Items.use=function(id,st,opt={}){const it=this.get(id),ty=it&&((opt&&opt.use&&it.uses.find(u=>u.type===opt.use))||it.uses[0]||{}).type;const r=iu2.apply(this,arguments);
  if(r&&(ty==='toy'||ty==='gift'))Econ.on(ty==='toy'?'play':'gift');return r};
 const od=window.ocsDrop;window.ocsDrop=function(id,n){n=Math.floor(+n);return n>0?od(id,Math.min(n,999)):false};
 Bag.importFile=()=>toast('物品定義請到「工坊 → 匯入內容包」；實際物品需靠購買或遊戲取得','info')}
document.addEventListener('oc:fed',e=>{try{Econ.on('feed',e.detail,true);Econ.wishFed(e.detail||{})}catch(x){}});
document.addEventListener('oc:story-result',()=>{try{Econ.on('story',{},true)}catch(x){}});
const wire=setInterval(()=>{try{if(!(window.OCS24D&&OCS24D.Room&&OCS24D.Room.act&&BH.defs.spotdo))return;clearInterval(wire);
 const R=OCS24D.Room,ra=R.act.bind(R);R.act=function(p,k){const r=ra(p,k);if(['sit','bed','toy','plant','lamp'].includes(k)){Econ.on('furn');Econ.maybeFind('furn',.25)}return r};
 const sd=BH.defs.spotdo,en=sd.enter;sd.enter=function(s){const r=en.apply(this,arguments);try{if(s===Home.stage)Econ.maybeFind('spot',.3)}catch(x){}return r}}catch(e){}},200);
{const ea=Eco.act;Eco.act=function(k){const r=ea.apply(this,arguments);if(k==='water')Econ.maybeFind('water',.2);return r}}

/* ---- 任務面板 ---- */
window.openQuests=function(tab=0){const s=openSheet('<div class="sh-body" id="qBody"></div>',{onClose:()=>{Econ.redraw=null}}),B=$('#qBody',s.el),TB=['今日委託','心願','探索','成就'];
 const row=(ic0,t,p,n,sub,btn)=>`<div class="qrow ${btn==='done'?'done':''}"><span class="qi">${ic0}</span><div class="qt"><b>${t}</b>${n?`<div class="bar q"><i style="transform:scaleX(${Math.max(.04,Math.min(1,p/n))})"></i></div>`:''}<small>${sub}</small></div>${btn==='done'?'<span class="tag">已領取</span>':btn||''}</div>`;
 const draw=()=>{Econ.sync();const e=Econ.s,ch=Chars.active(),L=ch&&e.life[ch.id];let h=`<div class="sh-title">任務與收入</div><p class="q-sub">每天 0 點刷新・已連續登入 ${Eco.v.streak} 天</p><div class="bg-chips">${TB.map((t,i)=>`<button class="chip ${i===tab?'on':''}" data-t="${i}">${t}</button>`).join('')}</div>`;
  if(tab===0)h+=QUESTS.map(q=>{const p=Eco.prog(q),d=Eco.v.q.done[q.id],rd=Eco.ready(q);return row(ic(q.ic),q.t,p,q.n,`${p} / ${q.n}・獎勵 ${q.r} 星幣${q.id==='jb'?'＋草莓蛋糕':''}`,d?'done':`<button class="btn primary qb" data-job="${q.id}" ${rd?'':'disabled'}>領取</button>`)}).join('');
  else if(tab===1){const w=L&&L.w&&Items.get(L.w.item);h+=ch?(w?row(`<span style="font-size:22px">${Items.icon(w)}</span>`,`${esc(ch.name)}想吃「${esc(w.name)}」`,0,0,'餵牠吃到就自動獲得 70 星幣與親密度（可在商店購買）',''):row(ic('heart'),'目前沒有心願',0,0,L&&L.n>=2?'今天的心願都完成了，明天再來':'稍後夥伴會想起新的心願',''))+`<p class="q-sub">今日已完成 ${e.stat.wish?'累計 '+I(e.stat.wish):'0'} 個・每位夥伴每天最多 2 個</p>`:''}
  else if(tab===2)h+=row(ic('sparkle'),'家裡的小發現',I(e.cap.find),FIND_DAY,`今日 ${I(e.cap.find)} / ${FIND_DAY}・現在地上有 ${e.finds.length} 個`,'')+'<p class="q-sub">夥伴在家散步、探索角落、使用家具或被澆水時，可能留下閃閃發亮的發現物，點一下就能撿起。20 分鐘後會消失。</p>';
  else h+=AC.map(a=>{const c=I(e.ach[a.id]),t=a.tiers[c],cur=I(e.stat[a.id]);return row(ic('sparkle'),a.t,t?cur:1,t?t[0]:1,t?`${Math.min(cur,t[0])} / ${t[0]}・獎勵 ${t[1]} 星幣（${c+1}/${a.tiers.length}）`:'已全部完成',t?`<button class="btn primary qb" data-ach="${a.id}" ${Econ.achReady(a)?'':'disabled'}>領取</button>`:'done')}).join('');
  B.innerHTML=h};
 B.addEventListener('click',ev=>{const t=ev.target.closest('[data-t]'),j=ev.target.closest('[data-job]'),a=ev.target.closest('[data-ach]');
  if(t){tab=+t.dataset.t;draw()}else if(j){Econ.claimJob(j.dataset.job);draw()}else if(a){Econ.claimAch(a.dataset.ach);draw()}});
 Econ.redraw=()=>{if(!s.closed)draw()};draw()};

/* ---- 啟動：保留既有存檔（先備份一次）、修復中斷的交易、清理異常數值 ---- */
const st=document.createElement('style');st.textContent='.ec-find{position:absolute;z-index:30;width:40px;height:40px;margin-left:-20px;border:0;border-radius:50%;background:radial-gradient(circle,#fff9,#ffd66b55 70%,transparent);font-size:22px;cursor:pointer;animation:ecF 1.6s ease-in-out infinite}@keyframes ecF{50%{transform:translateY(-6px) scale(1.08)}}';document.head.append(st);
const init=setInterval(()=>{try{if(!(Items.d&&Items.d.ui&&Items.d.ui.seeded&&Cat.d&&Eco.v&&window.Home&&Home.stage))return;clearInterval(init);
 try{const raw=localStorage.getItem(Eco.k);if(raw&&!localStorage.getItem(Eco.k+'.pre25'))localStorage.setItem(Eco.k+'.pre25',raw)}catch(e){}
 Items.d.items.forEach(i=>{i.qty=Math.min(999,I(i.qty))});Items.save(true);Econ.flush();Econ.roll();Econ.sync();Eco.save();Econ.tick();HUD.refresh()}catch(e){console.warn('[econ]',e)}},150);
setInterval(()=>{if(!document.hidden)Econ.tick()},20000);
document.addEventListener('visibilitychange',()=>{if(document.hidden){try{Items.save(true);Eco.save()}catch(e){}}else Econ.tick()});
addEventListener('pagehide',()=>{try{Items.save(true);Eco.save()}catch(e){}});
})();
