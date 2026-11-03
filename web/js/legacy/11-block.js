/* ===== 2.4A 物品系統 ===== */
const ITYPES={food:['食物','🍽️'],drink:['飲料','🥤'],toy:['玩具','🧸'],gift:['禮物','🎁'],wear:['服裝','👕'],acc:['飾品','🎀'],furn:['家具','🪑'],custom:['自訂','✨']};
const ICATS=Object.keys(ITYPES);
const Items={k:'ocs.items.v1',d:{v:1,items:[],mem:{},ui:{side:'R',y:.42,open:false,tab:0,seeded:false}},subs:[],
  uid:()=>'it_'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),
  demo(){const m=(n,e,c,q,tags,desc,fx={})=>({id:this.uid(),name:n,emoji:e,img:'',cat:c,tags,qty:q,desc,uses:[{type:c==='food'||c==='drink'||c==='toy'||c==='gift'?c:'custom',fx:Object.assign({hearts:2,mood:'happy'},fx)}],target:'both',consume:c!=='toy',fav:false,last:0,events:[],builtin:1});
    return [m('蘋果','🍎','food',5,['水果','甜','脆'],'清脆多汁，最溫和的點心。'),m('草莓蛋糕','🍰','food',3,['甜點','甜','草莓'],'鬆軟的小蛋糕，很多夥伴都喜歡。',{hearts:3}),m('熱可可','☕','drink',3,['熱飲','甜','可可'],'暖暖的，適合安靜的夜晚。',{mood:'calm'}),m('氣泡水','🥤','drink',2,['冷飲','氣泡'],'一口下去超清爽。',{mood:'excited'}),m('小毛線球','🧶','toy',2,['毛線','玩具'],'滾來滾去的小球，可以重複使用。',{mood:'excited'}),m('手寫卡片','💌','gift',2,['卡片','心意'],'寫著一句悄悄話。',{hearts:4,mood:'shy'}),m('小花束','💐','gift',2,['花','花束'],'清香的小花束。',{hearts:3}),m('緞帶髮飾','🎀','acc',1,['飾品','緞帶'],'可在換裝模式自由調整位置、大小與方向。')]},
  load(){let o=null;try{o=JSON.parse(localStorage.getItem(this.k))}catch(e){}
    if(o&&Array.isArray(o.items)){this.d=Object.assign(this.d,{items:o.items.map(i=>this.norm(i)).filter(Boolean),mem:o.mem&&typeof o.mem==='object'?o.mem:{},ui:Object.assign(this.d.ui,o.ui||{})})}
    if(!this.d.ui.seeded){this.d.items=this.demo().concat(this.d.items);this.d.ui.seeded=true;this.save(true)}},
  norm(i){if(!i||typeof i!=='object')return null;const S=(v,n)=>typeof v==='string'?v.slice(0,n):'';
    const cat=ITYPES[i.cat]?i.cat:'custom';
    const uses=(Array.isArray(i.uses)?i.uses:[]).filter(u=>u&&ITYPES[u.type]).slice(0,6).map(u=>({type:u.type,fx:{hearts:Math.round(clamp(+(u.fx&&u.fx.hearts)||0,0,6)),mood:S(u.fx&&u.fx.mood,10)||'happy'}}));
    const img=typeof i.img==='string'&&/^data:image\/(png|jpeg|webp);base64,/.test(i.img)&&i.img.length<400000?i.img:'';
    return{id:S(i.id,40)||this.uid(),name:S(i.name,16)||'未命名物品',emoji:S(i.emoji,4)||ITYPES[cat][1],img,cat,tags:(Array.isArray(i.tags)?i.tags:[]).filter(t=>typeof t==='string').map(t=>t.trim().slice(0,10)).filter(Boolean).slice(0,10),
      qty:Math.round(clamp(+i.qty||0,0,999)),desc:S(i.desc,120),uses:uses.length?uses:[{type:cat,fx:{hearts:2,mood:'happy'}}],target:['char','scene','both'].includes(i.target)?i.target:'both',consume:i.consume!==false,fav:!!i.fav,last:+i.last||0,events:Array.isArray(i.events)?i.events.slice(0,20):[],builtin:i.builtin?1:0}},
  save(now){clearTimeout(this._t);const go=()=>{try{localStorage.setItem(this.k,JSON.stringify(this.d))}catch(e){window.ocsQuota&&ocsQuota()}};now?go():this._t=setTimeout(go,200)},
  get:id=>Items.d.items.find(i=>i.id===id),
  emit(){this.save();this.subs.forEach(f=>{try{f()}catch(e){}})},
  on(f){this.subs.push(f);return()=>{this.subs=this.subs.filter(x=>x!==f)}},
  add(o){const i=this.norm(o);i.id=this.uid();i.builtin=0;this.d.items.push(i);this.emit();return i},
  upd(id,o){const i=this.get(id);if(!i)return;const n=this.norm(Object.assign({},i,o,{id}));Object.assign(i,n);this.emit()},
  del(id){this.d.items=this.d.items.filter(i=>i.id!==id);this.emit()},
  dup(id){const i=this.get(id);if(!i)return;const c=JSON.parse(JSON.stringify(i));c.name=(c.name+' 副本').slice(0,16);c.fav=false;return this.add(c)},
  qty(id,n){const i=this.get(id);if(!i)return;i.qty=clamp(Math.round(i.qty+n),0,999);this.emit()},
  recent(){return this.d.items.filter(i=>i.last&&i.qty>0).sort((a,b)=>b.last-a.last).slice(0,12)},
  common(){return this.d.items.filter(i=>i.qty>0).sort((a,b)=>(b.last?1:0)-(a.last?1:0)||b.qty-a.qty).slice(0,12)},
  favs(){return this.d.items.filter(i=>i.fav)},
  exportData(){return JSON.parse(JSON.stringify({v:1,items:this.d.items,mem:this.d.mem}))},
  importData(doc,replace){if(!doc||!Array.isArray(doc.items))throw new Error('物品資料格式不正確');if(doc.items.length>500)throw new Error('物品數量超過安全限制');
    const list=doc.items.map(i=>this.norm(i)).filter(Boolean);if(replace)this.d.items=[];
    list.forEach(i=>{if(this.d.items.some(x=>x.id===i.id))i.id=this.uid();this.d.items.push(i)});
    if(replace&&doc.mem&&typeof doc.mem==='object')this.d.mem=doc.mem;this.d.ui.seeded=true;this.emit();return list.length},
  icon(i,s){if(i.img)return `<img src="${i.img}" alt="" draggable="false">`;let e=i.emoji||'';if(e&&[...e].length===1&&!/\uFE0F/.test(e)&&e.codePointAt(0)<0x1F000)e+='\uFE0F';return esc(e)},
  /* ---- 統一使用流程 ---- */
  mood(ch){const m=ch&&ch.mind&&ch.mind.mood;const v=typeof m==='string'?m:m&&m.id;return typeof v==='string'?v:'calm'},
  judge(ch,item,use){const d=ch.data||{likes:[],dislikes:[],pers:{traits:[]}},keys=[item.name,...item.tags];
    const hit=a=>(a||[]).some(l=>l&&keys.some(k=>k.includes(l)||l.includes(k)));
    let s=1;const love=hit(d.likes),hate=hit(d.dislikes);if(love)s+=2;if(hate)s-=2;
    const md=this.mood(ch);if(md==='angry'||md==='sad')s-=.6;if(md==='happy'||md==='excited')s+=.4;if(md==='tired'&&(use==='toy'))s-=1;
    const tr=(d.pers&&d.pers.traits)||[];if(tr.includes('picky')&&use==='food'&&!love)s-=.6;
    return{score:s,love,hate,kind:s>=2?'love':s>=.9?'ok':'no'}},
  LN:{food:{love:['好好吃！最喜歡了！','哇，是我愛的味道。'],ok:['嗯，好吃。','謝謝，剛好有點餓。'],no:['這個…不太合我的口味。','我就不吃了，謝謝。']},
    drink:{love:['好喝～整個人都舒服了。','這個味道太棒了！'],ok:['謝謝，喝起來不錯。','清爽多了。'],no:['有點不想喝這個。','嗯…下次再說吧。']},
    toy:{love:['好好玩！再來再來！','這個我超愛！'],ok:['我來玩玩看。','嗯？好像很有趣。'],no:['現在沒什麼心情玩…','先放一邊好嗎。']},
    gift:{love:['是給我的嗎？我會好好珍惜！','太開心了，謝謝你！'],ok:['謝謝，我收下了。','有心意，我很開心。'],no:['謝謝，只是…我不太習慣這個。','嗯，我先收著。']},
    custom:{love:['我很喜歡。'],ok:['謝謝。'],no:['嗯…']}},
  use(id,st,opt={}){const it=this.get(id);if(!it)return false;st=st||Home.stage;const ch=st&&st.ch;if(!ch)return false;
    if(it.qty<=0){toast(`${it.name}已用完`,'info');return false}
    const use=(opt.use&&it.uses.find(u=>u.type===opt.use))||it.uses[0],ty=use.type;
    if(ty==='wear'||ty==='acc'||ty==='furn'){toast(`${it.name}：換裝與家具將於後續階段開放，已為你保留`,'info');return false}
    if(st.state==='held'){return false}
    if(st.sleeping&&st.sleeping()){st.say('zzz…');toast(`${ch.name}正在睡覺`,'info');return false}
    const j=this.judge(ch,it,ty),L=this.LN[ty]||this.LN.custom;
    this.popFx(st,it,j.kind==='no');
    const mem=(this.d.mem[ch.id]||(this.d.mem[ch.id]={}))[it.id]||(this.d.mem[ch.id][it.id]={n:0,love:0,no:0,last:0});mem.n++;mem.last=Date.now();mem[j.kind==='no'?'no':'love']+=j.kind==='no'?1:(j.kind==='love'?1:0);
    this.anim(st,j.kind,use);
    st.say(pick(L[j.kind]||L.ok),3200);
    const consumed=j.kind==='no'&&(ty==='food'||ty==='drink')?false:it.consume;
    it.last=Date.now();if(consumed)it.qty=Math.max(0,it.qty-1);
    buzz(j.kind==='no'?[10]:14);this.emit();
    toast(j.kind==='no'?`${ch.name}婉拒了${it.name}`:`${ch.name}收下了${it.name}${consumed?'（剩 '+it.qty+'）':''}`,j.kind==='no'?'info':'heart');
    return true},
  anim(st,kind,use){try{if(kind==='no'){st.squash(.08);return}
      const n=use.fx.hearts||1;if(kind==='love'){st.interrupt();st.setState('happy',2.2);st.squash(.18);st.hearts(Math.min(n+2,6))}
      else{st.squash(.12);st.hearts(Math.max(1,n-1));if(st.state==='idle'&&st.h===0){st.vy=120}}}catch(e){try{st.squash(.1)}catch(_){}}},
  popFx(st,it,no){try{const f=document.createElement('div');f.className='fxi'+(no?' no':'');f.innerHTML=this.icon(it);
      f.style.left=(st.x+st.size/2)+'px';f.style.top=(st.feetY-st.h-st.size*.62)+'px';st.root.append(f);setTimeout(()=>f.remove(),1200)}catch(e){}},
  /* 場景投放：角色走過去再使用 */
  tap(id,opt){const it=this.get(id),st=Home.stage;if(!it||!st)return false;if(it.qty<=0){toast(`${it.name}已用完`,'info');return false}
    if(it.target==='scene'&&!(opt&&opt.use)){const r=st.root.getBoundingClientRect();return this.drop(id,st,r.left+r.width/2)}return this.use(id,st,opt)},
  drop(id,st,px){const it=this.get(id);if(!it||it.target==='char'||it.qty<=0){return false}
    const r=st.root.getBoundingClientRect(),x=clamp(px-r.left-st.size/2,st.lo(),st.hi());
    try{st.walkTo(x)}catch(e){}
    const f=document.createElement('div');f.className='fxi';f.style.cssText=`left:${x+st.size/2}px;top:${st.feetY-20}px;animation-duration:1.9s`;f.innerHTML=this.icon(it);st.root.append(f);setTimeout(()=>f.remove(),2000);
    setTimeout(()=>this.use(id,st),1700);return true}};

/* ---- 拖曳（背包 → 角色／場景） ---- */
const Drag={g:null,bag:null,
  ghost(){return this.g||(this.g=$('#dghost'))},
  bind(node,id,o={}){let t=0,s=null;const cancelT=()=>{clearTimeout(t);t=0};
    node.addEventListener('pointerdown',e=>{if(e.button>0||this.cur||e.isPrimary===false)return;tapped=false;s={x:e.clientX,y:e.clientY,id:e.pointerId,live:false,pid:e.pointerId};node.classList.add('pr');
      t=setTimeout(()=>{if(!s)return;const i=Items.get(id);if(!i||i.qty<=0&&0)return;if(o.noDrag&&!o.noDrag()){s.live='menu';buzz(12);o.onMenu&&o.onMenu();return}
        s.live=true;node.classList.remove('pr');this.start(node,id,e.clientX,e.clientY,s.pid,o)},o.delay||230)});
    node.addEventListener('pointermove',e=>{if(!s||s.live)return;if(Math.hypot(e.clientX-s.x,e.clientY-s.y)>9){cancelT();s=null;node.classList.remove('pr')}});
    let tapped=false;const up=()=>{const was=s;cancelT();node.classList.remove('pr');tapped=!!(was&&!was.live&&o.onTap);s=null};
    node.addEventListener('click',()=>{if(tapped){tapped=false;o.onTap()}});
    node.addEventListener('pointerup',up);node.addEventListener('pointercancel',()=>{cancelT();node.classList.remove('pr');s=null});
    node.addEventListener('contextmenu',e=>e.preventDefault())},
  start(node,id,x,y,pid,o){if(this.cur)return;const it=Items.get(id);if(!it)return;const g=this.ghost();g.innerHTML=Items.icon(it)+'<em></em>';g.className='dghost on';
    this.cur={id,node,o,pid,ok:false,tx:x,ty:y};node.classList.add('src');document.body.classList.add('dragging');buzz(14);
    $('#layer').classList.add('lift');
    this.move(x,y);const owns=e=>e.pointerId==null||e.pointerId===pid;
    const mv=e=>{if(owns(e))this.move(e.clientX,e.clientY)};
    const cleanup=()=>{removeEventListener('pointermove',mv,true);removeEventListener('pointerup',end,true);removeEventListener('pointercancel',cn,true);removeEventListener('blur',blur);document.removeEventListener('visibilitychange',hidden);this.cancel=null};
    const end=e=>{if(!owns(e))return;cleanup();this.finish(e.clientX,e.clientY,false)};
    const cn=e=>{if(!owns(e))return;cleanup();this.finish(e.clientX,e.clientY,true)};
    const blur=()=>cn({pointerId:pid,clientX:this.cur?.tx||x,clientY:this.cur?.ty||y}),hidden=()=>{if(document.hidden)blur()};this.cancel=blur;
    addEventListener('pointermove',mv,true);addEventListener('pointerup',end,true);addEventListener('pointercancel',cn,true);addEventListener('blur',blur);document.addEventListener('visibilitychange',hidden)},
  hit(x,y){const st=Home.stage;if(!st||Nav.cur!==0)return null;const it=Items.get(this.cur.id);
    const r=st.art.getBoundingClientRect(),m=14;if(x>r.left-m&&x<r.right+m&&y>r.top-m&&y<r.bottom+m&&it.target!=='scene')return'char';
    const sr=st.root.getBoundingClientRect();if(x>sr.left&&x<sr.right&&y>sr.top+sr.height*.3&&y<sr.bottom-70&&it.target!=='char'&&!this.overBag(x,y))return'scene';return null},
  overBag(x,y){const b=$('#qbag').getBoundingClientRect();return Nav.cur===0&&$('#qbag').classList.contains('open')&&x>b.left-6&&x<b.right+6&&y>b.top-6&&y<b.bottom+6},
  move(x,y){const c=this.cur;if(!c)return;const g=this.ghost();g.style.transform=`translate3d(${x}px,${y-46}px,0) scale(1.08)`;
    const h=this.hit(x,y);c.ok=h;c.tx=x;c.ty=y;g.classList.toggle('ok',!!h);const st=Home.stage;if(st)st.root.classList.toggle('dz',h==='char');
    const em=$('em',g);if(em)em.textContent=h==='char'?'給'+(st.ch?st.ch.name:'角色'):h==='scene'?'放到地上':''},
  finish(x,y,cancel){const c=this.cur;if(!c)return;this.cur=null;const g=this.ghost(),st=Home.stage;
    document.body.classList.remove('dragging');$('#layer').classList.remove('lift');c.node.classList.remove('src');if(st)st.root.classList.remove('dz');
    if(!cancel&&c.ok){Ov.stack.slice().reverse().forEach(o=>o.close());Nav.go(0,true);g.classList.remove('on');buzz(10);const id=c.id;
      if(c.ok==='char'){Items.use(id,st)}else Items.drop(id,st,x);c.node.classList.add('pop');setTimeout(()=>c.node.classList.remove('pop'),500);return}
    const r=c.node.getBoundingClientRect();g.classList.add('back');g.style.transform=`translate3d(${r.left+r.width/2}px,${r.top+r.height/2-46}px,0) scale(.6)`;g.classList.remove('on');
    setTimeout(()=>g.classList.remove('back'),340);if(!cancel&&Nav.cur===0)toast('拖到角色或場景上就能使用','info')}};

/* ---- 快捷背包 ---- */
const Bag={el:null,
  init(){const e=this.el=$('#qbag');e.innerHTML=`<button class="qb-fab" id="qbFab" aria-label="展開快捷背包"><svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="12" rx="3.2"/><path d="M9 8V6.6A1.6 1.6 0 0 1 10.6 5h2.8A1.6 1.6 0 0 1 15 6.6V8M4 13.2h16"/></svg><b id="qbN"></b></button>
    <div class="qb-panel" id="qbP"><div class="qb-grip" id="qbG" aria-label="拖曳移動背包"><i></i></div><div class="qb-tabs" id="qbT"><button data-t="0" aria-label="常用"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2"/></svg></button><button data-t="1" aria-label="最近"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/></svg></button><button data-t="2" aria-label="收藏"><svg viewBox="0 0 24 24"><path d="M12 4l2.5 5.2 5.6.8-4 4 1 5.6L12 17l-5.1 2.6 1-5.6-4-4 5.6-.8z"/></svg></button></div><div class="qb-list" id="qbL"></div><div class="qb-act"><button id="qbFull" aria-label="完整背包"><svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h14"/></svg></button><button id="qbX" aria-label="收合"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div></div>`;
    this.place();this.render();Items.on(()=>this.render());
    $('#qbT').onclick=ev=>{const b=ev.target.closest('[data-t]');if(!b)return;Items.d.ui.tab=+b.dataset.t;Items.save();this.render();buzz(5)};
    $('#qbFull').onclick=()=>this.full();$('#qbX').onclick=()=>this.toggle(false);
    this.dragHandle($('#qbFab'),true);this.dragHandle($('#qbG'),false);
    ['resize','orientationchange'].forEach(n=>addEventListener(n,()=>this.place(true)));
    new ResizeObserver(()=>this.place(true)).observe($('#p-home'));
    document.addEventListener('touchmove',ev=>{if(document.body.classList.contains('dragging')&&ev.cancelable)ev.preventDefault()},{passive:false});
    $('#nav').addEventListener('click',ev=>{const b=ev.target.closest('[data-nact=bag]');if(b){ev.stopImmediatePropagation();this.full()}},true)},
  toggle(o){Items.d.ui.open=o===undefined?!Items.d.ui.open:o;Items.save();this.place(true);buzz(7)},
  bounds(){const p=$('#p-home').getBoundingClientRect(),L=Items.d.ui.side==='L',rel=s=>{const n=$(s);if(!n)return null;const r=n.getBoundingClientRect();return r.width?r:null};
    const hudT=rel('.hud-top'),rail=rel('#hudRail .rail-btn'),nav=rel('#nav'),qa=rel('#fab .qa-row'),qc=rel('#questCard');
    let top=Math.max(hudT?hudT.bottom-p.top+10:84,L?0:(rail?rail.bottom-p.top+10:0));
    let bot=Math.min(nav?nav.top-p.top-10:p.height-96,L?(qa?qa.top-p.top-10:1e9):(qc?qc.top-p.top-10:1e9));
    if(bot-top<150){top=Math.min(top,p.height*.2);bot=Math.max(bot,top+150)}return{w:p.width,h:p.height,top,bot}},
  place(anim){const e=this.el;if(!e)return;const u=Items.d.ui,b=this.bounds(),op=u.open;e.classList.toggle('open',op);
    const lst=$('#qbL');if(lst)lst.style.maxHeight=Math.max(70,Math.min(206,b.bot-b.top-112))+'px';const w=op?66:46,hh=op?Math.min(e.querySelector('.qb-panel').offsetHeight||250,b.bot-b.top):46;
    const y=clamp(b.top+(b.bot-b.top-hh)*u.y,b.top,Math.max(b.top,b.bot-hh)),m=8,x=u.side==='L'?m:b.w-w-m;
    e.style.setProperty('--ox',u.side==='L'?'0%':'100%');e.classList.toggle('snap',!!anim);e.style.transform=`translate3d(${x}px,${y}px,0)`;e.dataset.side=u.side},
  dragHandle(h,isFab){let s=null;h.addEventListener('pointerdown',e=>{const r=this.el.getBoundingClientRect(),p=$('#p-home').getBoundingClientRect();s={sx:e.clientX,sy:e.clientY,ox:r.left-p.left,oy:r.top-p.top,mv:false};h.setPointerCapture(e.pointerId);this.el.classList.remove('snap')});
    h.addEventListener('pointermove',e=>{if(!s)return;if(!s.mv&&Math.hypot(e.clientX-s.sx,e.clientY-s.sy)>7){s.mv=true;buzz(6)}if(!s.mv)return;
      const b=this.bounds(),r=this.el.getBoundingClientRect();const x=clamp(s.ox+e.clientX-s.sx,0,b.w-r.width),y=clamp(s.oy+e.clientY-s.sy,b.top,Math.max(b.top,b.bot-r.height));
      s.x=x;s.y=y;s.cx=x+r.width/2;this.el.style.transform=`translate3d(${x}px,${y}px,0)`});
    const end=()=>{if(!s)return;const w=s,b=this.bounds();s=null;if(!w.mv){if(isFab)this.toggle(true);return}
      const u=Items.d.ui,hh=this.el.getBoundingClientRect().height;u.side=w.cx<b.w/2?'L':'R';u.y=b.bot-b.top-hh>0?clamp((w.y-b.top)/(b.bot-b.top-hh),0,1):0;Items.save();this.place(true);buzz(8)};
    h.addEventListener('pointerup',end);h.addEventListener('pointercancel',end)},
  reset(){Object.assign(Items.d.ui,{side:'R',y:.42,open:false,tab:0});Items.save();this.place(true);this.render();toast('已恢復背包預設位置','check')},
  render(){const u=Items.d.ui,L=[Items.common(),Items.recent(),Items.favs().filter(i=>1)][u.tab]||[];
    $$('#qbT button').forEach(b=>b.classList.toggle('on',+b.dataset.t===u.tab));
    $('#qbN').textContent=Items.d.items.reduce((a,i)=>a+i.qty,0)||'';
    const l=$('#qbL');l.innerHTML=L.length?'':`<div class="qb-empty">${['還沒有物品','還沒使用過','長按物品可收藏'][u.tab]}</div>`;
    L.forEach(i=>{const n=el(`<div class="it ${i.qty<=0?'zero':''}" data-id="${i.id}" title="${esc(i.name)}">${i.fav?'<span class="f">'+ic('starf')+'</span>':''}${Items.icon(i)}<span class="q">${i.qty}</span></div>`);
      Drag.bind(n,i.id,{delay:210,onTap:()=>Items.tap(i.id)});l.append(n)});
    requestAnimationFrame(()=>this.place())},
  full(){this.openFull()},
  hide(){const u=this.sh&&!this.sh.closed?this.sh:null;if(!u)return()=>{};u.el.classList.add('under');u.n=(u.n||0)+1;return()=>{u.n--;if(u.n<=0)u.el.classList.remove('under')}},
  /* ---- 完整背包 ---- */
  F:{q:'',cat:'all',batch:false,sel:new Set()},
  openFull(){const F=this.F;F.batch=false;F.sel.clear();let offF=null;const s=openSheet('<div class="sh-body" id="bgB"></div>',{onClose:()=>{offF&&offF();this.sh=null}});this.sh=s;const B=$('#bgB',s.el);
    const draw=()=>{const list=this.filtered();
      if(!$('#bgGrid',B)){B.innerHTML=`<div class="sh-title" style="display:flex;justify-content:space-between;align-items:center">背包<span id="bgSum" style="font-size:12px;color:var(--ink-3);font-weight:600"></span></div>
      <div class="bg-top"><input class="bg-search" value="${esc(F.q)}" aria-label="搜尋背包物品" placeholder="搜尋名稱、標籤" autocomplete="off" enterkeyhint="search"><button class="bg-sq" id="bgBt" data-a="batch" aria-label="批次管理">${ic("check")}</button><button class="bg-sq" data-a="shop" aria-label="商店">${ic("bag")}</button><button class="bg-sq" data-a="more" aria-label="更多">⋯</button></div>
      <div class="bg-chips" id="bgCh"></div><div class="bg-grid" id="bgGrid"></div><div id="bgEm"></div><div id="bgBa"></div>`}
      $('#bgSum',B).textContent=`${Items.d.items.filter(i=>i.qty>0).length} 種・${Items.d.items.reduce((a,i)=>a+i.qty,0)} 件`;$('#bgBt',B).classList.toggle('on',F.batch);
      const ch=$('#bgCh',B);const chipsHtml=[['all','全部'],['fav',ic('star',14)+' 收藏'],['recent','最近'],...ICATS.map(c=>[c,ITYPES[c][0]])].map(c=>`<button class="chip ${F.cat===c[0]?'on':''}" data-c="${c[0]}">${c[1]}</button>`).join('');if(ch._lastHtml!==chipsHtml){const sx=ch.scrollLeft;ch.innerHTML=chipsHtml;ch.scrollLeft=sx;ch._lastHtml=chipsHtml}
      $('#bgEm',B).innerHTML=list.length?'':'<div class="bg-empty">沒有符合的物品<br><small>到商店購買物品，或調整篩選</small></div>';
      $('#bgBa',B).innerHTML=F.batch?`<div class="bg-batch"><button class="btn" data-a="bfav">收藏</button><button class="btn" data-a="bunfav">取消收藏</button><button class="btn" data-a="bexp">匯出</button><button class="btn danger" data-a="bdel">刪除(${F.sel.size})</button></div>`:'';
      const g=$('#bgGrid',B);
      const previous=new Map([...g.querySelectorAll(':scope>.bg-card[data-item-id]')].map(node=>[node.dataset.itemId,node]));
      list.forEach((i,index)=>{
        let c=previous.get(String(i.id));
        if(!c){
          c=el(`<div class="bg-card" data-item-id="${esc(i.id)}"><div class="it"><span class="q"></span></div><span class="n"></span></div>`);
          Drag.bind(c,i.id,{delay:260,noDrag:()=>!F.batch&&Nav.cur===0&&(Items.get(i.id)?.qty||0)>0,onMenu:()=>this.detail(i.id),onTap:()=>{if(F.batch){F.sel.has(i.id)?F.sel.delete(i.id):F.sel.add(i.id);draw()}else this.detail(i.id)}});
        }
        c.classList.toggle('sel',F.sel.has(i.id));
        const n=c.querySelector(':scope>.n');if(n&&n.textContent!==i.name)n.textContent=i.name;
        const tile=c.querySelector(':scope>.it');tile.classList.toggle('zero',i.qty<=0);
        const imageSignature=JSON.stringify([i.id,i.img,i.emoji,i.icon,i.thumb,i.art,i.data]);
        if(c._itemSignature!==imageSignature){tile.innerHTML=Items.icon(i)+'<span class="q"></span>';c._itemSignature=imageSignature}
        let fav=tile.querySelector(':scope>.f');
        if(i.fav&&!fav)tile.insertAdjacentHTML('afterbegin','<span class="f">'+ic('starf')+'</span>');
        else if(!i.fav&&fav)fav.remove();
        const count=tile.querySelector(':scope>.q');if(count&&count.textContent!==String(i.qty))count.textContent=i.qty;
        if(g.children[index]!==c)g.insertBefore(c,g.children[index]||null);
        previous.delete(String(i.id));
      });
      previous.forEach(node=>node.remove());
    };
    this.redraw=draw;draw();const off=Items.on(()=>{if(!s.closed)draw()});offF=off;
    B.addEventListener('input',e=>{if(e.target.matches('.bg-search')){F.q=e.target.value;draw()}});
    B.addEventListener('click',async e=>{const c=e.target.closest('[data-c]');if(c){F.cat=c.dataset.c;draw();return}const a=e.target.closest('[data-a]');if(!a)return;const k=a.dataset.a;
      if(k==='batch'){F.batch=!F.batch;F.sel.clear();draw()}else if(k==='shop')Shop.open();else if(k==='more')this.moreMenu();
      else if(k==='bfav'||k==='bunfav'){F.sel.forEach(id=>{const i=Items.get(id);if(i)i.fav=k==='bfav'});Items.emit();toast('已更新收藏')}
      else if(k==='bexp'){this.exportFile([...F.sel])}
      else if(k==='bdel'){if(!F.sel.size)return;const removed=await this.discard([...F.sel].map(id=>({id,n:Items.get(id)?.qty||0})),s);if(removed&&!s.closed){F.sel.clear();F.batch=false;draw()}}})},
  filtered(){const F=this.F,q=F.q.trim().toLowerCase();let L=Items.d.items.slice();
    if(F.cat==='fav')L=L.filter(i=>i.fav);else if(F.cat==='recent')L=Items.recent();else if(F.cat!=='all')L=L.filter(i=>i.cat===F.cat||i.uses.some(u=>u.type===F.cat));
    if(q)L=L.filter(i=>(i.name+' '+i.tags.join(' ')+' '+i.desc).toLowerCase().includes(q));return L},
  moreMenu(){const s=openSheet(`<div class="sh-body"><div class="sh-title">背包選項</div><div class="group">${[['匯出全部物品','export'],['匯入物品定義（不含庫存）','import'],['恢復快捷背包預設位置','reset']].map(r=>`<button class="row btn-row" data-m="${r[1]}"><div class="r-t"><b>${r[0]}</b></div></button>`).join('')}</div></div>`);
    s.el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(!b)return;const m=b.dataset.m;s.close();setTimeout(()=>{if(m==='export')this.exportFile();else if(m==='import')this.importFile();else this.reset()},250)})},
  exportFile(ids){const d=Items.exportData();if(ids&&ids.length)d.items=d.items.filter(i=>ids.includes(i.id));const b=new Blob([JSON.stringify({format:'oc-shimeji-items',...d})],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='oc-items-'+Date.now()+'.json';document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);toast(`已匯出 ${d.items.length} 項物品`)},
  importFile(){const f=document.createElement('input');f.type='file';f.accept='application/json,.json';f.onchange=async()=>{try{const t=f.files[0];if(!t||t.size>20e6)throw new Error('檔案過大');const o=JSON.parse(await t.text());if(o.format!=='oc-shimeji-items'&&!Array.isArray(o.items))throw new Error('不是物品檔');toast(`已匯入 ${Items.importData(o,false)} 項物品`)}catch(e){toast(e.message||'匯入失敗','info')}};f.click()},
  residents(){const C=window.OCSCommunity;if(C?.ready)return [...C.nodes.values()].filter(n=>n.s?.actor?.isConnected&&Chars.byId(n.id)).map(n=>Chars.byId(n.id));const ch=Home.stage?.ch;return ch&&Chars.byId(ch.id)?[ch]:[]},
  async discard(requests,owner){
    if(this.discarding||owner?.closed)return 0;
    const rows=[...new Map(requests.map(r=>[r.id,r])).values()].map(r=>{const it=Items.get(r.id),n=Math.min(it?.qty||0,Math.max(0,Math.floor(+r.n||0)));return it&&n?{id:it.id,name:it.name,n}:null}).filter(Boolean);
    if(!rows.length){toast('沒有可丟掉的物品','info');return 0}
    this.discarding=true;
    try{const total=rows.reduce((n,r)=>n+r.n,0),description=rows.slice(0,5).map(r=>'「'+r.name+'」×'+r.n).join('、')+(rows.length>5?'，以及其他 '+(rows.length-5)+' 種物品':'');
      const accepted=await confirmSheet({title:rows.length>1?'丟掉所選物品？':'丟掉物品？',msg:description+'，共 '+total+' 個。丟掉後無法復原，物品的收藏與商店紀錄會保留。',ok:'確認丟掉'});
      if(!accepted||owner?.closed)return 0;
      let removed=0;for(const r of rows){const qty=Math.min(r.n,Items.get(r.id)?.qty||0);if(qty)removed+=+window.ocsDrop(r.id,qty)||0}
      if(removed){buzz(8);toast('已丟掉 '+removed+' 個物品','check')}
      return removed;
    }finally{this.discarding=false}
  },
  detail(id){if(!Items.get(id)||document.querySelector('.sheet:not([data-closing]) #dtB'))return;
    const release=this.hide();let off=null;const s=openSheet('<div class="sh-body item-detail-body" id="dtB"></div>',{cls:'item-detail-sheet',onClose:()=>{off?.();document.removeEventListener('oc:residents-changed',update);release()}}),B=$('#dtB',s.el);
    let who=Cfg.v.active,using=false;
    B.innerHTML=`<div class="dt-hero"><div class="it" data-detail-art></div><div><h3 data-detail-name></h3><small data-detail-meta></small></div></div>
      <div class="dt-tags" data-detail-tags></div><p class="dt-p" data-detail-description></p>
      <div data-detail-recipient><div class="ed-l">給誰</div><div class="who" role="group" aria-label="選擇在場夥伴"></div><p class="dt-p detail-no-residents" hidden>目前沒有可互動的在場夥伴。</p></div>
      <div class="dt-row detail-actions"><span class="detail-use-actions"></span><button class="btn detail-favorite" data-a="fav" aria-pressed="false"><span data-favorite-icon></span><span data-favorite-label></span></button></div>
      <p class="dt-stock">持有 <b data-detail-qty></b> 個</p><div class="dt-row detail-discard"><button class="btn danger" data-a="drop1">丟掉 1 個</button><button class="btn danger" data-a="del">全部丟掉</button></div>
      <p class="dt-p detail-footnote">自製物品可到「創作工坊 → 我的作品」編輯或複製。</p>`;
    const art=$('[data-detail-art]',B),tags=$('[data-detail-tags]',B),list=$('.who',B),recipient=$('[data-detail-recipient]',B),actions=$('.detail-use-actions',B),favorite=$('[data-a=fav]',B);
    const text=(selector,value)=>{const n=$(selector,B),v=String(value);if(n._detailText!==v){n.textContent=v;n._detailText=v}};
    function update(){if(s.closed)return;const it=Items.get(id);if(!it){s.close();return}
      text('[data-detail-name]',it.name);text('[data-detail-meta]',it.uses.map(u=>ITYPES[u.type][0]).join('・')+'｜'+(it.target==='char'?'給角色':it.target==='scene'?'放場景':'角色／場景')+(it.consume?'':'｜可重複使用'));
      s.el.setAttribute('aria-label','物品詳情：'+it.name);
      const image=Items.icon(it);if(art._signature!==image){art.innerHTML=image;art._signature=image}
      const signature=JSON.stringify(it.tags);if(tags._signature!==signature){tags.replaceChildren(...it.tags.map(t=>{const n=document.createElement('span');n.className='tg';n.textContent=t;return n}));tags._signature=signature}tags.hidden=!it.tags.length;
      text('[data-detail-description]',it.desc||'沒有說明');text('[data-detail-qty]',it.qty);
      const available=Bag.residents(),needsRecipient=it.target!=='scene'&&it.uses.some(u=>u.type!=='furn');
      recipient.hidden=!needsRecipient;
      if(!available.some(c=>c.id===who))who=available.some(c=>c.id===Cfg.v.active)?Cfg.v.active:available[0]?.id||'';
      const old=new Map([...list.children].map(n=>[n.dataset.w,n]));
      available.forEach((ch,index)=>{let n=old.get(ch.id);if(!n){n=document.createElement('button');n.className='chip';n.dataset.w=ch.id;n.type='button'}if(n._residentName!==ch.name){n.textContent=ch.name;n._residentName=ch.name}n.classList.toggle('on',who===ch.id);n.setAttribute('aria-pressed',String(who===ch.id));n.setAttribute('aria-label','給 '+ch.name);if(list.children[index]!==n)list.insertBefore(n,list.children[index]||null);old.delete(ch.id)});old.forEach(n=>n.remove());$('.detail-no-residents',B).hidden=available.length>0;
      const previous=new Map([...actions.children].map(n=>[n.dataset.useKey,n]));
      it.uses.forEach((u,index)=>{const key=u.type+'|'+index;let n=previous.get(key);if(!n){n=el(`<button class="btn primary" data-u="${esc(u.type)}">${Items.categoryIcon(u.type==='custom'?it.cat:u.type)} <span></span></button>`);n.dataset.useKey=key;n._category=u.type==='custom'?it.cat:u.type}
        const category=u.type==='custom'?it.cat:u.type;if(n._category!==category){n.querySelector('.item-category')?.replaceWith(el(Items.categoryIcon(category)));n._category=category}
        const label=Items.useLabel(u.type==='custom'?it.cat:u.type);if(n.querySelector('span:last-child').textContent!==label)n.querySelector('span:last-child').textContent=label;
        n.disabled=using||it.qty<=0||(needsRecipient&&u.type!=='furn'&&!who);if(actions.children[index]!==n)actions.insertBefore(n,actions.children[index]||null);previous.delete(key)});previous.forEach(n=>n.remove());
      favorite.setAttribute('aria-pressed',String(!!it.fav));favorite.classList.toggle('is-favorite',!!it.fav);if(favorite._state!==it.fav){$('[data-favorite-icon]',B).innerHTML=ic(it.fav?'starf':'star',16);favorite._state=it.fav}text('[data-favorite-label]',it.fav?'已收藏':'收藏');
      for(const n of B.querySelectorAll('.detail-discard button'))n.disabled=it.qty<=0;
    }
    update();off=Items.on(update);document.addEventListener('oc:residents-changed',update);
    B.addEventListener('click',async e=>{const w=e.target.closest('[data-w]');if(w){if(!this.residents().some(c=>c.id===w.dataset.w)){update();return}who=w.dataset.w;update();buzz(5);return}
      const u=e.target.closest('[data-u]');if(u){if(using)return;const item=Items.get(id);if(!item||item.qty<=0)return;const needsRecipient=item.target!=='scene'&&u.dataset.u!=='furn';
        if(needsRecipient&&!this.residents().some(c=>c.id===who)){update();toast('請選擇仍在場的夥伴','info');return}
        const target=needsRecipient?who:Cfg.v.active,use=u.dataset.u;using=true;update();if(needsRecipient&&who!==Cfg.v.active){if(window.OCSCommunity?.ready)OCSCommunity.focus(who);else setActive(who)}
        Ov.stack.slice().reverse().forEach(o=>o.close());Nav.go(0);
        setTimeout(()=>{if(!Items.get(id)?.qty)return;if(needsRecipient&&(!this.residents().some(c=>c.id===target)||Cfg.v.active!==target)){toast('對象已變更，請重新選擇物品','info');return}Items.tap(id,{use})},280);return
      }
      const a=e.target.closest('[data-a]');if(!a)return;
      if(a.dataset.a==='fav'){const item=Items.get(id);if(item)Items.upd(id,{fav:!item.fav})}
      else if(a.dataset.a==='drop1'||a.dataset.a==='del')await this.discard([{id,n:a.dataset.a==='drop1'?1:Items.get(id)?.qty||0}],s);
    });
  },
  edit(id,rel0){const rel=rel0||this.hide(),src=id?Items.get(id):null,o=src?JSON.parse(JSON.stringify(src)):{name:'',emoji:'🍪',img:'',cat:'food',tags:[],qty:1,desc:'',uses:[{type:'food',fx:{hearts:2,mood:'happy'}}],target:'both',consume:true};
    const s=openSheet('<div class="sh-body" id="edB"></div>',{onClose:()=>rel()});const B=$('#edB',s.el);
    const draw=()=>{const sy=B.scrollTop;requestAnimationFrame(()=>{B.scrollTop=sy});B.innerHTML=`<div class="sh-title">${src?'編輯物品':'新增物品'}</div>
      <div class="ed-r"><div class="ed-img" id="edI" data-a="img">${Items.icon(o)}</div><div style="flex:1"><input class="ed-i" id="edN" maxlength="16" placeholder="名稱" value="${esc(o.name)}"></div></div>
      <div class="ed-r" style="margin-top:8px"><input class="ed-i" id="edE" maxlength="4" placeholder="表情符號" value="${esc(o.emoji)}" style="width:100px"><button class="btn" data-a="img" style="height:44px;font-size:13.5px">選擇圖片</button>${o.img?'<button class="btn" data-a="noimg" style="height:44px;font-size:13.5px">移除圖片</button>':''}</div>
      <div class="ed-l">分類</div><div class="ed-ch">${ICATS.map(c=>`<button class="chip ${o.cat===c?'on':''}" data-cat="${c}">${ITYPES[c][0]}</button>`).join('')}</div>
      <div class="ed-l">用途（可複選，外觀與功能獨立）</div><div class="ed-ch">${ICATS.map(c=>`<button class="chip ${o.uses.some(u=>u.type===c)?'on':''}" data-use="${c}">${ITYPES[c][0]}</button>`).join('')}</div>
      <div class="ed-l">使用對象</div><div class="ed-ch">${[['both','角色／場景'],['char','只給角色'],['scene','只放場景']].map(t=>`<button class="chip ${o.target===t[0]?'on':''}" data-tg="${t[0]}">${t[1]}</button>`).join('')}<button class="chip ${o.consume?'on':''}" data-a="cons">使用後消耗</button></div>
      <div class="ed-l">標籤（逗號分隔，會與角色喜好比對）</div><input class="ed-i" id="edT" placeholder="例：甜,水果" value="${esc(o.tags.join(','))}">
      
      <div class="ed-l">說明</div><textarea class="ed-i" id="edD" maxlength="120">${esc(o.desc)}</textarea>
      <div class="pv-cta" style="margin-top:16px;display:flex;gap:10px"><button class="btn grow" data-close>取消</button><button class="btn grow primary" data-a="save">儲存</button></div>`};
    const grab=()=>{o.name=$('#edN',B).value.trim();o.emoji=$('#edE',B).value.trim()||o.emoji;o.tags=$('#edT',B).value.split(/[,，、]/).map(x=>x.trim()).filter(Boolean);o.qty=src?src.qty:0;o.desc=$('#edD',B).value};
    draw();B.addEventListener('click',async e=>{const c=e.target.closest('button,.ed-img');if(!c)return;if(!B.contains(c))return;grab();
      if(c.dataset.cat){o.cat=c.dataset.cat;if(!o.uses.length)o.uses=[{type:o.cat,fx:{hearts:2,mood:'happy'}}];draw()}
      else if(c.dataset.use){const t=c.dataset.use,i=o.uses.findIndex(u=>u.type===t);if(i>=0){if(o.uses.length>1)o.uses.splice(i,1)}else o.uses.push({type:t,fx:{hearts:2,mood:'happy'}});draw()}
      else if(c.dataset.tg){o.target=c.dataset.tg;draw()}
      else if(c.dataset.a==='cons'){o.consume=!o.consume;draw()}
      else if(c.dataset.a==='noimg'){o.img='';draw()}
      else if(c.dataset.a==='img'){try{const b=await pickF('image/*',false);const f=Array.isArray(b)?b[0]:b;if(f){o.img=await this.shrink(f.blob||f.file||f);draw()}}catch(er){toast('圖片讀取失敗','info')}}
      else if(c.dataset.a==='save'){if(!o.name){toast('請輸入名稱','info');return}if(src)Items.upd(id,o);else Items.add(o);toast(src?'已儲存':'已新增物品','check');s.close()}})},
  async shrink(f){const bmp=await loadBmp(f instanceof Blob?f:new Blob([f])),k=Math.min(1,192/Math.max(bw(bmp),bh(bmp))),c=cvs(Math.max(1,Math.round(bw(bmp)*k)),Math.max(1,Math.round(bh(bmp)*k)));c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);
    let u=c.toDataURL('image/webp',.82);if(!u.startsWith('data:image/webp'))u=c.toDataURL('image/png');return u}};
{const _i=infoSheet;infoSheet=function(it,x){if(it===BAG){Bag.openFull();return}return _i(it,x)}}
{const t=setInterval(()=>{try{if(Home.stage&&Chars.list.length){clearInterval(t);Items.load();Bag.init()}}catch(e){}},80)}
