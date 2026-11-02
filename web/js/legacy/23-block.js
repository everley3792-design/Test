/* ===== 2.4D-b：測試物品・工坊入口・地上物品自主撿取 ===== */
(()=>{'use strict';
const boot=setInterval(()=>{try{if(!(window.OCS24D&&typeof Studio!=='undefined'&&Home.stage&&Items.d&&window.OCS24D.Room.d&&$('#stMods')&&typeof Studio4!=='undefined'))return;clearInterval(boot);init()}catch(e){}},150);
function init(){const {Room,Ed,Dress,addQty}=window.OCS24D;
 /* 1) 測試物品（僅首次加入一次） */
 if(!Room.d.seeded){Room.d.seeded=1;
  Items.add({name:'小蝴蝶結',emoji:'🎀',cat:'acc',qty:1,tags:['蝴蝶結','飾品'],desc:'測試用飾品：拖到角色身上就能穿戴。',uses:[{type:'acc',fx:{hearts:2,mood:'happy'}}],target:'char',consume:false});
  Items.add({name:'木頭小椅子',emoji:'🪑',cat:'furn',qty:1,tags:['椅子','家具'],desc:'測試用家具：拖到場景裡佈置，角色會自己去坐。',uses:[{type:'furn',fx:{hearts:2,mood:'calm'}}],target:'scene',consume:false});
  Room.save();try{Cat.load()}catch(e){}void 0}
 /* 入口：右側功能列加入換裝／佈置 */
 const ext=$('#hudRail .rail-ext');if(ext){ext.insertAdjacentHTML('beforeend','<button class="rail-btn" data-go="dress" aria-label="換裝" style="font-size:20px">'+ic('shirt',22)+'</button><button class="rail-btn" data-go="room" aria-label="佈置" style="font-size:20px">'+ic('chair',22)+'</button>');
  $('#hudRail').addEventListener('click',e=>{const b=e.target.closest('[data-go=dress],[data-go=room]');if(!b)return;e.stopImmediatePropagation();e.preventDefault();b.dataset.go==='dress'?Dress.sheet():(Ed.on||Ed.enter('room',Home.stage))},true)}
 /* 2) 工坊：夥伴生活設定（飲食喜好移到這裡編輯） */
 const sec=[...$$('#p-studio .sec')].find(s=>s.textContent.includes('創作模組'));
 if(sec&&!$('#stLife')){const row=(k,ic,t,d)=>`<button class="row btn-row" data-k="${k}"><span class="r-ic soft" style="font-size:20px">${ic}</span><div class="r-t"><b>${t}</b><small>${d}</small></div></button>`;
  const h=el(`<div><div class="sec">夥伴生活設定</div><div class="group" id="stLife">${row('taste',Items.categoryIcon('food'),'飲食喜好','口味、圖鑑與最愛最討厭')}${row('dress',Items.categoryIcon('wear'),'換裝與飾品','穿戴、搭配方案與隱藏設定')}${row('room',Items.categoryIcon('furn'),'家具佈置','擺放家具，角色會自己使用')}</div></div>`);
  sec.before(...h.children);
  $('#stLife').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(!b)return;buzz(8);const k=b.dataset.k,id=Studio.sel||Cfg.v.active;
   if(k==='taste'){Taste.open(Chars.byId(id)||Chars.active());return}
   if(id!==Cfg.v.active)setActive(id);Nav.go(0);setTimeout(()=>{k==='dress'?Dress.sheet():(Ed.on||Ed.enter('room',Home.stage))},420)})}
 /* 作品選單的試穿／試擺按鈕（編輯與複製只存在於作品） */
 window.ocsPvBtns=id=>{const p=Cat.d.products.find(x=>x.art===id),it=p&&Items.get(p.itemId);if(!it)return'';return(OCS24D.isW(it)?'<button class="c4-b" data-o="pvd">試穿</button>':'')+(OCS24D.isF(it)?'<button class="c4-b" data-o="pvr">試擺</button>':'')};
 /* 3) 地上物品：等角色自己想撿（依個性、好奇心與喜好） */
 Room.d.g=Array.isArray(Room.d.g)?Room.d.g:[];
 const G={els:new Map(),job:null,
  inUse:id=>Room.d.g.some(g=>g.i===id),
  put(id,st,px,py){const it=Items.get(id);if(!it||it.qty<=0)return false;if(Room.d.g.length>=10){toast('地上的東西太多了，先等夥伴撿一些吧','info');return true}
   const r=st.root.getBoundingClientRect();addQty(id,-1);
   Room.d.g.push({u:'g_'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),i:id,x:clamp((px-r.left)/r.width,.06,.94),y:clamp(py!=null?(py-r.top)/r.height:.8,.66,.84),t:Date.now()});
   Room.save();const u=Room.d.g[Room.d.g.length-1].u;this.render(u);buzz(10);toast(`${it.name}放在地上了，${st.ch.name}想拿的時候會自己去`,'check');return true},
  render(pop){const st=Room.st;if(!st||!st.root.clientWidth)return;const W=st.root.clientWidth,seen=new Set();
   Room.d.g.forEach(g=>{const it=Items.get(g.i);if(!it)return;seen.add(g.u);let e=this.els.get(g.u);
    if(!e||!e.isConnected){e=el('<div class="gr-it"><i class="gr-sh"></i><span class="gr-b"></span></div>');st.root.append(e);this.els.set(g.u,e);e._ic=null;this.bind(e,g.u)}
    const ic=Items.icon(it);if(e._ic!==ic){e.querySelector('.gr-b').innerHTML=ic;e._ic=ic}
    const sz=W*.075;e.style.cssText=`left:${g.x*100}%;top:${g.y*100}%;--g:${sz};font-size:${sz*.8}px`;e.classList.toggle('pop',pop===g.u)});
   this.els.forEach((e,u)=>{if(!seen.has(u)){e.remove();this.els.delete(u)}})},
  bind(e,u){let tm=0,long=0;e.addEventListener('pointerdown',ev=>{ev.stopPropagation();long=0;e.classList.add('pr');tm=setTimeout(()=>{long=1;this.take(u)},600)});
   const end=()=>{clearTimeout(tm);e.classList.remove('pr')};e.addEventListener('pointerup',end);e.addEventListener('pointercancel',end);e.addEventListener('pointermove',ev=>{});
   e.addEventListener('click',()=>{if(long||Ed.on)return;this.call(u)})},
  take(u){const g=Room.d.g.find(x=>x.u===u);if(!g)return;Room.d.g=Room.d.g.filter(x=>x.u!==u);addQty(g.i,1);Room.save();this.render();buzz(12);toast('已收回背包','check')},
  call(u){const st=Room.st,g=Room.d.g.find(x=>x.u===u);if(!g||!st||st.state==='held'||st.h>0)return;if(st.sleeping&&st.sleeping()){toast(`${st.ch.name}正在睡覺`,'info');return}
   this.start(g,false)},
  cur(ch){const d=ch.data||{},tr=(d.pers&&d.pers.traits)||[],sl=(d.pers&&d.pers.sl)||{};let c=.5;
   if(tr.includes('curious'))c+=.35;if(tr.includes('foodie'))c+=.1;if(tr.includes('shy'))c-=.2;if(tr.includes('lazy'))c-=.2;if(tr.includes('tsun'))c-=.1;if(tr.includes('dreamer'))c-=.05;
   c+=((sl.lively||50)-50)/250+((sl.indep||50)-50)/500;return clamp(c,.1,1)},
  line(ch){const tr=(ch.data&&ch.data.pers&&ch.data.pers.traits)||[];return tr.includes('curious')?pick(['咦？那是什麼？','哇，地上有東西！']):tr.includes('shy')?pick(['那、那個是…？','…有東西。']):tr.includes('tsun')?pick(['哼，才不是特別在意。','只是剛好路過而已。']):tr.includes('lazy')?pick(['嗯…好像有東西。','等一下再去看看。']):pick(['那邊有東西耶。','那是什麼呢？'])},
  start(g,auto){const st=Room.st,W=st.root.clientWidth,fx=g.x*W,c=this.cur(st.ch),curious=!auto||Math.random()<c;
   this.job={u:g.u,ph:curious?'near':'go',t:Date.now(),side:st.x+st.size/2<fx?-1:1};
   try{st.walkTo(curious?fx-st.size/2+this.job.side*st.size*1.05:fx-st.size/2)}catch(e){}},
  tick(){const st=Room.st;if(!st||!st.ch||!st.root.clientWidth)return;const j=this.job,now=Date.now();
   if(Ed.on||Room.job||Nav.cur!==0||st.state==='held'||(st.sleeping&&st.sleeping())){if(j&&(Ed.on||st.state==='held'))this.job=null;return}
   if(j){const g=Room.d.g.find(x=>x.u===j.u);if(!g||now-j.t>20000){this.job=null;if(g)g.t=now;return}
    const fx=g.x*st.root.clientWidth,cx=st.x+st.size/2,d=Math.abs(cx-fx);
    if(j.ph==='near'){if(Math.abs(d-st.size*1.05)<st.size*.28&&st.h===0){j.ph='look';j.t2=now;try{st.say(this.line(st.ch),2400);st.squash(.07)}catch(e){}}}
    else if(j.ph==='look'){if(now-j.t2>1700+Math.random()*600){j.ph='go';j.t=now;try{st.walkTo(fx-st.size/2)}catch(e){}}}
    else if(j.ph==='go'){if(d<st.size*.22&&st.h===0){this.job=null;this.pick(g)}}return}
   const mk=Room.nx||0;if(!Room.d.g.length)return;
   const ch=st.ch,c=this.cur(ch),ok=Room.d.g.filter(g=>{const it=Items.get(g.i);if(!it)return false;let delay=(70-64*c)*(.7+Math.random()*.6);try{const jd=Items.judge(ch,it,it.uses[0].type);if(jd.love)delay*=.5;else if(jd.hate)delay*=1.8}catch(e){}
    g._d=g._d||delay;return now-g.t>g._d*1000});
   if(ok.length&&(!st.B||['stand','stroll','idle'].includes(st.B.id)||st.state==='idle')){const g=ok[0];g._d=0;this.start(g,true)}},
  pick(g){const st=Room.st,it=Items.get(g.i);if(!it){Room.d.g=Room.d.g.filter(x=>x.u!==g.u);this.render();return}
   addQty(g.i,1);let ok=false;try{ok=Items.use(g.i,st)}catch(e){}
   if(ok){Room.d.g=Room.d.g.filter(x=>x.u!==g.u)}else{addQty(g.i,-1);g.t=Date.now();g._d=0}Room.save();this.render()}};
 const _drop=Items.drop;Items.drop=function(id,st,px){const it=this.get(id);if(!it||it.target==='char'||it.qty<=0||window.OCS24D.isW(it)||window.OCS24D.isF(it))return _drop.apply(this,arguments);return G.put(id,st||Home.stage,px,Drag._y)};
 const _in=Room.inUse.bind(Room);Room.inUse=id=>_in(id)||G.inUse(id);
 G.render();new ResizeObserver(()=>G.render()).observe(Room.st.root);setInterval(()=>G.tick(),450);window.OCS24D.Ground=G}
})();
