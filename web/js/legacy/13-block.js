/* ===== 2.4B 食物喜好探索 · 個性化反應 · 記憶 ===== */
const TG=(()=>{const g=(id,t,em,k,kw,ej)=>({id,t,em,k,kw,ej:[...ej]});return[
 g('sweet','甜食','🍬','口味',['甜','糖','蜜','蛋糕','布丁','餅乾','巧克力','馬卡龍','奶油','冰淇淋','麻糬','年糕','派','焦糖'],'🍰🎂🧁🍩🍪🍫🍬🍭🍮🍯🥧🍡🍨🍦🍧🥮'),
 g('salty','鹹味','🧂','口味',['鹹','鹽','洋芋片','薯條','醬油','起司','培根','海苔'],'🧂🥨🍟🧀🥓'),
 g('spicy','辛辣','🌶️','口味',['辣','辣椒','咖哩','芥末','泡菜'],'🌶'),
 g('sour','酸味','🍋','口味',['酸','檸檬','醋','梅','柑','優格','醃'],'🍋'),
 g('bitter','苦味','🫖','口味',['苦','黑咖啡','抹茶','黑巧克力'],''),
 g('seafood','海鮮','🦐','食材',['魚','蝦','蟹','海鮮','貝','鮭','鮪','壽司','章魚','烏賊','魷魚'],'🍣🍤🦐🦑🦀🦞🐟🐠🦪🐙'),
 g('meat','肉類','🍖','食材',['肉','雞肉','炸雞','豬','牛肉','牛排','香腸','漢堡','火腿','培根','雞腿'],'🍖🍗🥩🥓🌭🍔'),
 g('veg','蔬菜','🥬','食材',['菜','蔬','蘿蔔','番茄','菇','玉米','沙拉','青椒','南瓜','薯'],'🥬🥕🌽🍅🥦🍆🥔🍄🥗'),
 g('fruit','水果','🍓','食材',['水果','莓','蘋果','橘','桃','葡萄','西瓜','香蕉','芒果','鳳梨','檸檬','柳橙','果汁','果凍'],'🍎🍊🍋🍓🍇🍉🍌🍍🥭🍑🍒🥝🍐🫐'),
 g('dairy','乳製品','🥛','食材',['奶','乳','起司','優格'],'🥛🧀🍦'),
 g('grain','麵飯','🍚','食材',['飯','麵','麵包','包子','餃','飯糰','吐司','粥','披薩','餅'],'🍚🍙🍜🍞🥐🥖🍝🍕🥟🥯🍘🍱🥪🌮🌯'),
 g('tea','茶','🍵','食材',['茶'],'🍵🫖'),
 g('coffee','咖啡','☕','食材',['咖啡','拿鐵'],'☕'),
 g('crunchy','酥脆','🥨','口感',['脆','酥','炸','餅乾','洋芋片','爆米花'],'🥨🍿🍟🥠'),
 g('soft','軟綿','☁️','口感',['軟','綿','Q','糯','麻糬','布丁','蛋糕','鬆'],'🍮🍡'),
 g('fizzy','氣泡','🫧','口感',['汽水','氣泡','蘇打','可樂'],'🥤🫧'),
 g('ice','冰品','🍧','溫度',['冰','雪','刨','冷','霜','聖代'],'🍦🍧🍨🧊'),
 g('hot','熱食','♨️','溫度',['熱','燙','湯','火鍋','烤','暖','拉麵'],'♨🍲🍜🥘🍛🔥')]})();
const TGK=['口味','食材','口感','溫度'];
const LV={fav:{t:'最愛',e:ic('heart',15)},love:{t:'很喜歡',e:ic('smile',15)},like:{t:'喜歡',e:ic('smile',15)},meh:{t:'普通',e:ic('meh',15)},dislike:{t:'不太喜歡',e:ic('frown',15)},hate:{t:'討厭',e:ic('frown',15)},worst:{t:'最討厭',e:ic('ban',15)}};
const TRB={gentle:{sweet:.7,spicy:-.5},hot:{spicy:1,bitter:-.3},foodie:{_:.5},picky:{_:-.4},sporty:{meat:.6,veg:.3,fruit:.3},dreamer:{sweet:.5,fizzy:.5,fruit:.3},shy:{sweet:.3,hot:.3},quiet:{tea:.4,hot:.3},tsun:{sweet:.5},prank:{sour:.8,spicy:.5,fizzy:.4},lazy:{soft:.6,sweet:.3},sleepy:{hot:.4,tea:.4,dairy:.3},chatty:{fizzy:.4,sweet:.3},clingy:{sweet:.5,dairy:.3},homebody:{hot:.5,grain:.3},sharp:{bitter:.5,sour:.3}};
const TLN={
 fav:{n:['最喜歡{n}了！','啊，是{n}…太幸福了。','這就是我的最愛！'],l:['哇啊啊！是{n}！最愛啦！！','耶～！{n}！我可以吃一百個！'],s:['是{n}呢…好幸福喔。','呵呵，最喜歡了。'],y:['（小聲）…最喜歡這個。','謝、謝謝…真的好好吃。'],t:['哼，也、也不是特別喜歡啦…（偷笑）','才沒有很開心…好吃就是了！']},
 love:{n:['好好吃！','{n}很棒呢！'],l:['好吃好吃！再來一個！','哇～超讚的！'],s:['嗯～很好吃呢。','心情變好了。'],y:['…好吃。','謝謝，很好吃。'],t:['還、還不錯啦。','勉強說很好吃吧。']},
 like:{n:['不錯呢。','嗯，味道蠻好的。'],l:['好吃！謝啦～','嘿嘿，不錯不錯！'],s:['謝謝，我很喜歡。','暖暖的感覺。'],y:['…還不錯。','嗯…謝謝。'],t:['普通啦…謝謝。','嗯，還行。']},
 meh:{n:['嗯…普通吧。','吃得下，沒特別感覺。'],l:['嗯？還好欸。','吃完了～'],s:['嗯，普通的味道呢。','謝謝你的心意。'],y:['…普通。','嗯。'],t:['就這樣吧。','沒什麼特別的。']},
 dislike:{n:['嗯…不太合口味。','有點微妙…'],l:['咦…這個有點怪欸。','唔，不是我的菜！'],s:['對不起，不太習慣這個味道…','嗚…有點難入口。'],y:['…有點不喜歡。','（皺眉）…'],t:['這什麼味道啦！','哼…不好吃。']},
 hate:{n:['唔！這個不行…','好難吃…'],l:['嗚哇！難吃！！','噁…快拿走啦！'],s:['嗚…真的不行…','好難受的味道。'],y:['…（用力搖頭）','不、不要了…'],t:['這是什麼鬼東西啦！','才不要再吃第二次！']},
 worst:{n:['絕對不要再吃了！','這是最討厭的味道…'],l:['啊啊啊！最討厭了！！','不要不要不要！'],s:['嗚嗚…這個真的、真的不行…','眼淚都要出來了…'],y:['（臉色發白）…','…請不要再給我這個。'],t:['你是故意的吧！！','哼！以後別給我這個！']}};
const TNEW={n:['這是{n}…？','第一次看到呢。','可以吃嗎？'],c:['好奇！我要嚐嚐看！','這是什麼？好有趣！'],y:['（偷偷聞了聞）…','這個…沒問題嗎？'],t:['這什麼…奇怪的東西？','…真的能吃嗎？']};
const TREF={taboo:['這個我不能吃。','不行，這個真的不行。'],full:['吃不下了…肚子滿滿的。','等一下再吃吧～'],tired:['最近一直吃這個，有點膩了。','換個口味好不好？'],dislike:['我不想吃{n}…','這個…不用了。'],dislikeT:['才不要吃這種東西！'],dislikeY:['（默默把頭轉開）'],mood:['現在沒什麼心情吃…']};

const Taste={subs:[],_sv:{},rep:{},cd_:{},
 hash(s){let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}h^=h>>>13;h=Math.imul(h,0x5bd1e995);h^=h>>>15;return(h>>>0)/4294967296},
 on(f){this.subs.push(f);return()=>{this.subs=this.subs.filter(x=>x!==f)}},
 emit(ch){if(ch)this.save(ch);this.subs.forEach(f=>{try{f()}catch(e){}})},
 /* ---- 角色資料（存於 ch.data.taste，隨角色備份／匯入／複製） ---- */
 cleanChar(t){t=t&&typeof t==='object'?t:{};const S=(v,n)=>typeof v==='string'?v.slice(0,n):'';
  const ok=k=>typeof k==='string'&&k.length<=44&&/^(g|t|i|c):/.test(k);
  const mp=(m,mx,fn)=>{const o={};if(m&&typeof m==='object'&&!Array.isArray(m))Object.keys(m).slice(0,mx).forEach(k=>{if(ok(k)){const v=fn(m[k]);if(v!==undefined)o[k]=v}});return o};
  const nm=(a,b)=>v=>{v=+v;return Number.isFinite(v)?Math.round(clamp(v,a,b)*10)/10:undefined};
  const seen={};if(t.seen&&typeof t.seen==='object'&&!Array.isArray(t.seen))Object.keys(t.seen).slice(0,300).forEach(k=>{const s=t.seen[k];if(!s||typeof s!=='object'||typeof k!=='string'||k.length>44)return;
   seen[k]={n:Math.round(clamp(+s.n||0,0,9999)),rj:Math.round(clamp(+s.rj||0,0,999)),first:+s.first||0,last:+s.last||0,lv:nm(-4,4)(s.lv)??0,nm:S(s.nm,16),em:S(s.em,4)}});
  const f=t.fl&&typeof t.fl==='object'?t.fl:{};
  return{mode:['mix','manual','auto'].includes(t.mode)?t.mode:'mix',seed:S(t.seed,16),
   p:mp(t.p,100,v=>[3,2,-2,-3].includes(+v)?+v:undefined),tb:mp(t.tb,50,v=>v?1:undefined),
   ex:mp(t.ex,160,nm(-3,3)),kn:mp(t.kn,160,v=>v?1:undefined),seen,fl:{v:Math.round(clamp(+f.v||0,0,200)),t:+f.t||0}}},
 cd(ch){const d=ch.data||(ch.data={});if(!d.taste){d.taste=this.cleanChar({});d.taste.seed=String(ch.id);d.taste.fl={v:40,t:Date.now()}}const T=d.taste;if(!T.seed)T.seed=String(ch.id);return T},
 save(ch){clearTimeout(this._sv[ch.id]);this._sv[ch.id]=setTimeout(()=>{try{Chars.patch(ch,{data:ch.data})}catch(e){}},400)},
 /* ---- 特徵與標籤 ---- */
 feat(it){const tags=it.tags||[],txt=(it.name+' '+tags.join(' ')+' '+(it.desc||'')).toLowerCase(),em=[...(it.emoji||'')];
  const gs=TG.filter(x=>x.kw.some(k=>txt.includes(k.toLowerCase()))||x.ej.some(e=>em.includes(e))).map(x=>x.id);
  const cu=tags.filter(tg=>!TG.some(x=>tg===x.t||x.kw.some(k=>tg.includes(k)))).map(x=>'t:'+x.slice(0,10));
  return{groups:gs,tokens:[...gs.map(x=>'g:'+x),...cu,'c:'+(it.cat==='drink'?'drink':'food')]}},
 label(tok){const[a,b]=[tok.slice(0,1),tok.slice(2)];if(a==='g'){const g=TG.find(x=>x.id===b);return g?g.t:b}if(a==='c')return b==='drink'?'飲料':'食物';return b},
 traits(ch){try{return Persona.active(ch.data).map(t=>t.id)}catch(e){return[]}},
 voice(ch){const tr=this.traits(ch),sl=(ch.data&&ch.data.pers&&ch.data.pers.sl)||{},has=a=>a.some(x=>tr.includes(x));
  if(has(['tsun']))return't';if(has(['shy','quiet','homebody']))return'y';if(has(['hot','sporty','prank','chatty'])||(sl.lively||50)>68)return'l';if(has(['gentle','clingy','dreamer']))return's';return'n'},
 picky(ch){const d=ch.data||{};return this.traits(ch).includes('picky')||((d.pers&&d.pers.custom)||[]).some(c=>/挑食/.test(c.name||''))},
 /* ---- 自動探索：由種子＋個性產生，穩定且個體化 ---- */
 auto(ch,tok){if(tok.startsWith('c:'))return null;const T=this.cd(ch);if(T.ex[tok]!==undefined)return T.ex[tok];
  let b=0;const id=tok.slice(2),tr=this.traits(ch);tr.forEach(t=>{const m=TRB[t];if(m)b+=(m[id]||0)+(m._||0)});
  const d=ch.data||{},blob=[].concat(d.interests||[],d.habits||[]).join('|'),g=TG.find(x=>x.id===id);if(g&&tok[0]==='g'&&(blob.includes(g.t)||g.kw.some(k=>k.length>1&&blob.includes(k))))b+=.7;
  const v=Math.round(clamp((this.hash(T.seed+'|'+tok)*2-1)*2.1+b,-2.6,2.6)*10)/10;T.ex[tok]=v;this.save(ch);return v},
 ocHit(ch,it,f){const d=ch.data||{},txt=[it.name,...(it.tags||[]),...f.tokens.map(t=>this.label(t))].filter(x=>x&&x.length>=1);
  const hit=a=>(a||[]).some(l=>l&&txt.some(k=>k.length>=2?(k.includes(l)||l.includes(k)):k===l));const o=[];if(hit(d.likes))o.push(2);if(hit(d.dislikes))o.push(-2);return o},
 agg(v){if(!v.length)return 0;const m=v.reduce((a,b)=>Math.abs(b)>Math.abs(a)?b:a,0),r=v.reduce((a,b)=>a+b,0)-m;return clamp(m+r*.3,-3.6,3.6)},
 ex2(v){return v===3?3.6:v===-3?-3.6:v},
 lvOf(s){return s>=3.2?'fav':s>=1.5?'love':s>=.5?'like':s>-.5?'meh':s>-1.5?'dislike':s>-3.2?'hate':'worst'},
 /* ---- 判定：玩家指定優先 → 已品嚐記憶 → 自動探索 ---- */
 judge(ch,it){const T=this.cd(ch),f=this.feat(it),mode=T.mode,o={f,src:'auto',s:0,taboo:false,seen:T.seen[it.id]||null};
  if(mode!=='auto'){const tb=['i:'+it.id,...f.tokens].find(t=>T.tb[t]);if(tb){o.taboo=tb;o.s=-4;o.lv='worst';o.src='taboo';return o}
   const iv=T.p['i:'+it.id];if(iv!=null){o.s=this.ex2(iv);o.src='item';o.lv=this.lvOf(o.s);return o}}
  const ex=[];if(mode!=='auto')f.tokens.forEach(t=>{if(T.p[t]!=null)ex.push(this.ex2(T.p[t]))});
  this.ocHit(ch,it,f).forEach(v=>ex.push(v));
  const au=[];if(mode!=='manual')f.tokens.forEach(t=>{if(mode!=='auto'&&T.p[t]!=null)return;const v=this.auto(ch,t);if(v!=null)au.push(v)});
  if(ex.length){o.s=this.agg(ex.concat(au.map(v=>v*.5)));o.src='explicit'}
  else if(o.seen&&o.seen.n+o.seen.rj>0&&mode!=='manual'){o.s=o.seen.lv;o.src='known'}
  else if(au.length){o.s=this.agg(au)+(this.hash(T.seed+'n'+it.id)*.9-.45);o.src='auto'}
  o.s=Math.round(clamp(o.s,-3.6,3.6)*10)/10;o.lv=this.lvOf(o.s);return o},
 /* ---- 飽足感 / 重複 ---- */
 full(T){const f=T.fl||{v:0,t:0},m=(Date.now()-(f.t||Date.now()))/60000;return Math.max(0,(f.v||0)-m*2.5)},
 sat(it,ty,f){if(it.tx&&Number.isFinite(it.tx.sat))return it.tx.sat;return ty==='drink'?10:(f.groups.includes('grain')||f.groups.includes('meat'))?30:f.groups.includes('sweet')?16:22},
 repN(ch,it){const k=ch.id+'|'+it.id,a=(this.rep[k]||[]).filter(t=>Date.now()-t<48e4);this.rep[k]=a;return a.length},
 /* ---- 餵食主流程 ---- */
 feed(it,use,st){const ch=st.ch,T=this.cd(ch),ty=use.type,now=Date.now();
  if(st._fd){toast(`${ch.name}還在享用中`,'info');return false}
  if(now<(this.cd_[ch.id]||0)){toast('讓牠休息一下吧','info');return false}
  const J=this.judge(ch,it),voice=this.voice(ch),tr=this.traits(ch),pk=this.picky(ch),isNew=!J.seen||!(J.seen.n+J.seen.rj);
  const md=Items.mood(ch),fl=this.full(T),rep=this.repN(ch,it);
  let adj=J.s+((md==='sad'||md==='angry')?-.5:(md==='happy'||md==='excited')?.3:0)+(fl<25?.5:fl>75?-.5:0)-(rep>=2?(rep-1)*.35:0);
  adj=Math.round(clamp(adj,-3.6,3.6)*10)/10;let lv=this.lvOf(adj),no=null;
  const r1=this.hash(T.seed+'rf'+it.id),r2=Math.random();
  if(J.taboo)no='taboo';
  else if(fl>=(ty==='drink'?115:100)&&!(lv==='fav'&&fl<115))no='full';
  else if(rep>=4)no='tired';
  else{const p=lv==='worst'?(pk?.95:.6):lv==='hate'?(pk?.7:.3):lv==='dislike'?(pk?.4:.08):0;
   const q=p?clamp(p-(isNew&&tr.includes('curious')?.25:0)+(isNew&&voice==='y'?.1:0),0,1):0;
   if(q&&r1<q)no='dislike';else if(md==='angry'&&adj<.5&&r2<.3)no='mood'}
  const tok={dead:false,tm:[]};st._fd=tok;this.cd_[ch.id]=now+(no?2200:3800);
  st.interrupt();st.setState('idle',40);st.defer=null;st.vx=0;
  const fast=document.documentElement.dataset.motion==='reduce',K=fast?.35:1,els=[],cls=[];
  const alive=()=>st._fd===tok&&st.ch===ch&&st.state!=='held'&&!(st.sleeping&&st.sleeping())&&document.contains(st.root);
  const add=(node,c)=>{node.classList.add(c);cls.push([node,c])};
  const pulse=(node,c,ms)=>{node.classList.remove(c);void node.offsetWidth;node.classList.add(c);setTimeout(()=>node.classList.remove(c),ms)};
  const finish=()=>{tok.dead=true;tok.tm.forEach(clearTimeout);cls.forEach(([n,c])=>n.classList.remove(c));els.forEach(e=>{e.classList.add('out');setTimeout(()=>e.remove(),420)});if(st._fd===tok){st._fd=null;try{if(st.state==='idle'||st.state==='happy')st.setState('idle',1.4)}catch(e){}}};
  tok.cancel=finish;const at=(ms,fn)=>tok.tm.push(setTimeout(()=>{if(tok.dead)return;if(!alive())return finish();try{fn()}catch(e){console.warn(e);finish()}},ms*K));
  const say=(arr,d)=>st.say(pick(arr).replace(/\{n\}/g,it.name),d||2800);
  /* 食物飛到嘴邊 */
  const f=document.createElement('div');f.className='tfd';f.innerHTML=Items.icon(it);f.style.left=(st.x+st.size/2)+'px';f.style.top=(st.feetY-st.h-st.size*.6)+'px';st.root.append(f);els.push(f);buzz(8);
  at(60,()=>{st.squash(.05);if(isNew)say(tr.includes('curious')?TNEW.c:voice==='y'?TNEW.y:voice==='t'?TNEW.t:TNEW.n,2000)});
  at(420,()=>add(st.tiltEl,'fd-look'));
  if(no){/* ---- 拒絕：不扣數量 ---- */
   const rj=no==='dislike'?(voice==='t'?TREF.dislikeT:voice==='y'?TREF.dislikeY:TREF.dislike):TREF[no];
   at(isNew?1300:850,()=>{st.tiltEl.classList.remove('fd-look');f.classList.add('no');if(no!=='dislike'&&no!=='taboo')say(rj,2600);
    if(no==='dislike'||no==='taboo'){this.record(ch,it,J,null,true);this.know(ch,J,false)}
    if(no==='dislike'&&(voice==='t'||tr.includes('tsun')))try{Life.setMood(st,'angry',18,true);Life.emote(st,'angry',true)}catch(e){}
    buzz(10);toast(`${ch.name}沒有吃${it.name}（${{taboo:'不吃這個',full:'吃不下了',tired:'有點吃膩了',dislike:'不喜歡',mood:'沒心情'}[no]}）`,'info');this.emit(ch)});
   at(isNew?2500:2100,finish);return true}
  /* ---- 接受：觀察 → 試吃 → 咀嚼 → 反應 ---- */
  const look=isNew?(voice==='y'||pk?1500:tr.includes('curious')?700:1050):420;
  at(560+look,()=>{st.tiltEl.classList.remove('fd-look');f.classList.add('b1');add(st.poseEl,'fd-chew');st.squash(.06);
   if(it.consume){it.qty=Math.max(0,it.qty-1)}it.last=Date.now();   /* 成功試吃才扣除 */
   T.fl={v:Math.round(fl+this.sat(it,ty,J.f)),t:Date.now()};(this.rep[ch.id+'|'+it.id]=this.rep[ch.id+'|'+it.id]||[]).push(Date.now());
   const m=(Items.d.mem[ch.id]||(Items.d.mem[ch.id]={}))[it.id]||(Items.d.mem[ch.id][it.id]={n:0,love:0,no:0,last:0});m.n++;m.last=Date.now();if(lv==='dislike'||lv==='hate'||lv==='worst')m.no++;else if(lv!=='meh')m.love++;
   const first=this.record(ch,it,J,adj,false);this._first=first;Items.emit();buzz(10)});
  at(560+look+620,()=>{f.classList.remove('b1');f.classList.add('b2')});
  at(560+look+1300,()=>{st.poseEl.classList.remove('fd-chew');f.classList.add('out');this.react(st,ch,it,J,lv,voice,isNew,tr,pulse,add);
   const left=Items.get(it.id),qty=left?left.qty:0;/* Stock is already visible in the bag; the reaction owns the discovery cue. */
   this.bond(ch,lv);try{document.dispatchEvent(new CustomEvent('oc:fed',{detail:{charId:ch.id,itemId:it.id,level:lv,first:isNew,score:adj}}))}catch(e){}});
  at(560+look+3000,finish);return true},
 react(st,ch,it,J,lv,voice,isNew,tr,pulse,add){const L=TLN[lv],line=(L[voice]||L.n);const fast=document.documentElement.dataset.motion==='reduce';
  const sp=n=>{if(fast)return;for(let i=0;i<n;i++){const e=document.createElement('span');e.className='tsp';e.textContent='✦';e.style.left=(st.x+st.size*rnd(.22,.78))+'px';e.style.top=(st.feetY-st.h-st.hitTop*rnd(.3,.95))+'px';e.style.setProperty('--dx',rnd(-14,14)+'px');e.style.setProperty('--d',i*.13+'s');st.fx.appendChild(e);setTimeout(()=>e.remove(),1700)}};
  const mark=c=>{const e=document.createElement('span');e.className='tsp q';e.textContent=c;e.style.left=(st.x+st.size*.62)+'px';e.style.top=(st.feetY-st.h-st.hitTop*.95)+'px';st.fx.appendChild(e);setTimeout(()=>e.remove(),1700)};
  const hop=v=>{if(!fast&&st.h===0)st.vy=v};const mood=(id,h)=>{try{Life.setMood(st,id,h,true)}catch(e){}};
  const sh=this.hash(this.cd(ch).seed+'q')<.5;   /* 個體差異：跳躍／扭動兩種慶祝方式 */
  st.say(pick(line).replace(/\{n\}/g,it.name),3400);
  if(lv==='fav'){add(st.actor,'fd-glow');setTimeout(()=>st.actor.classList.remove('fd-glow'),1900);st.setState('happy',2.4);st.squash(.14);hop(250);setTimeout(()=>hop(190),520*(sh?1:.8));sp(6);if(isNew)mark('!');st.hearts(2);mood(voice==='l'?'excited':'happy',60);buzz([10,40,10])}
  else if(lv==='love'){add(st.actor,'fd-glow');setTimeout(()=>st.actor.classList.remove('fd-glow'),1300);st.setState('happy',1.9);st.squash(.12);hop(190);sp(3);if(isNew)mark('!');st.hearts(2);mood('happy',45)}
  else if(lv==='like'){st.squash(.1);pulse(st.tiltEl,'fd-nod',620);st.hearts(1);mood('happy',30)}
  else if(lv==='meh'){pulse(st.tiltEl,'fd-nod',620);st.squash(.04)}
  else if(lv==='dislike'){pulse(st.tiltEl,'fd-shake',760);st.squash(.05);mood('sad',20)}
  else if(lv==='hate'){pulse(st.tiltEl,'fd-shake',760);st.squash(.08);mood('sad',30);try{Life.emote(st,'sad',true)}catch(e){}}
  else{pulse(st.tiltEl,'fd-shake',1000);st.tiltEl.classList.add('hard');setTimeout(()=>st.tiltEl.classList.remove('hard'),1100);st.squash(.1);mood(voice==='t'?'angry':'sad',35);try{Life.emote(st,voice==='t'?'angry':'sad',true)}catch(e){}}
  /* 新發現的驚喜 */
  if(isNew&&(lv==='fav'||lv==='love'||lv==='hate'||lv==='worst'))setTimeout(()=>toast(`${ch.name}發現了新的${lv==='fav'||lv==='love'?'喜好':'討厭的味道'}：${it.name}`,'sparkle'),900);
  this.know(ch,J,true);this.emit(ch)},
 /* ---- 記憶 ---- */
 record(ch,it,J,adj,rejected){const T=this.cd(ch),k=it.id,s=T.seen[k]||(T.seen[k]={n:0,rj:0,first:0,last:0,lv:J.s,nm:'',em:''}),first=!(s.n+s.rj);
  if(first)s.lv=Math.round(J.s*10)/10;rejected?s.rj++:s.n++;if(!s.first)s.first=Date.now();s.last=Date.now();s.nm=it.name.slice(0,16);s.em=(it.emoji||'').slice(0,4);
  const ks=Object.keys(T.seen);if(ks.length>300){ks.sort((a,b)=>T.seen[a].last-T.seen[b].last).slice(0,ks.length-300).forEach(x=>delete T.seen[x])}return first},
 know(ch,J,ate){const T=this.cd(ch);if(T.mode==='manual')return;J.f.tokens.forEach(t=>{const v=T.ex[t];if(v!=null&&Math.abs(v)>=1.2&&!T.kn[t]){T.kn[t]=1;if(ate)setTimeout(()=>toast(`${ch.name}${v>0?'喜歡':'不愛'}「${this.label(t)}」`,'sparkle'),1600)}})},
 bond(ch,lv){try{const V=Eco.v,xp={fav:6,love:4,like:3,meh:1,dislike:1,hate:1,worst:1}[lv]||1,a=Eco.info(ch.id).lv;V.bond[ch.id]=(V.bond[ch.id]||0)+xp;Eco.save();HUD.refresh();const b=Eco.info(ch.id).lv;if(b>a)toast(`${ch.name} 升級 Lv.${b}`,'heart')}catch(e){}},
 /* ---- 對外 API（送禮 / 關係 / 劇情預留） ---- */
 api:{level(ch,it){const J=Taste.judge(ch,it);return{level:J.lv,score:J.s,taboo:!!J.taboo,known:!!(J.seen&&J.seen.n+J.seen.rj)}},
  favorites(ch){const T=Taste.cd(ch);return Object.entries(T.seen).filter(([k,s])=>s.lv>=3.2||T.p['i:'+k]===3).map(([id,s])=>({id,name:s.nm}))},
  memory(ch){return JSON.parse(JSON.stringify(Taste.cd(ch).seen))}},
 /* ---- 主動話題 ---- */
 chatter(){const st=Home.stage;if(!st||!st.ch||document.hidden||Nav.cur!==0||st._fd||st.state!=='idle'||(st.sleeping&&st.sleeping())||!(st.autoOn&&st.autoOn()))return;
  const ch=st.ch,T=this.cd(ch),fav=Object.entries(T.seen).filter(([k,s])=>s.lv>=3.2||T.p['i:'+k]===3).map(x=>x[1]),ate=Object.values(T.seen).filter(s=>s.n>0);
  if(!ate.length||Math.random()>.35)return;const fl=this.full(T);
  if(fl<18){const s=fav.length?pick(fav):pick(ate.filter(x=>x.lv>=.5).concat(ate)),n=s.nm||'好吃的東西';st.say(pick([`肚子餓了…想吃${n}。`,`好想吃${n}…`]),3200)}
  else if(fav.length&&Math.random()<.5)st.say(pick([`最喜歡的還是${pick(fav).nm}呢。`,`上次的${pick(fav).nm}真好吃。`]),3000)},
 /* ===== 介面 ===== */
 list(ch){const T=this.cd(ch);return Object.entries(T.seen).filter(([k,s])=>s.n>0||s.rj>0).map(([id,s])=>{const iv=T.p['i:'+id],sc=T.tb['i:'+id]?-4:iv!=null?this.ex2(iv):s.lv;return{id,s,sc,lv:this.lvOf(sc),tb:!!T.tb['i:'+id]}}).sort((a,b)=>b.sc-a.sc)},
 ico(id,s){const it=Items.get(id);return it?Items.icon(it):(s.em?esc(s.em):ic('utensils',18))},
 open(ch){ch=ch||Chars.active();if(!ch)return;let tab=0,off=()=>{};
  const s=openSheet('<div class="sh-body tz" id="tzB"></div>',{onClose:()=>off()});const B=$('#tzB',s.el);
  const tok=(T,t)=>T.tb[t]?{c:'tb',e:'禁忌'}:T.p[t]!=null?{c:'s'+T.p[t],e:{3:'最愛',2:'喜歡','-2':'討厭','-3':'最討厭'}[T.p[t]]}:(T.mode!=='manual'&&T.kn[t]&&T.ex[t]!=null&&Math.abs(T.ex[t])>=1)?{c:'ex',e:T.ex[t]>0?ic('heart',12):ic('x',12)}:{c:'',e:''};
  const chip=(T,t,em)=>{const x=tok(T,t);return`<button class="tzc ${x.c}" data-t="${esc(t)}">${em?em+' ':''}${esc(this.label(t))}${x.e?`<em>${x.e}</em>`:''}</button>`};
  const draw=()=>{const sy=B.scrollTop,T=this.cd(ch),L=this.list(ch),fl=Math.round(clamp(this.full(T),0,100));
   const top=(a)=>a.length?a.slice(0,3).map(x=>`<p><span>${this.ico(x.id,x.s)}</span>${esc(x.s.nm||'?')}</p>`).join(''):'<p class="none">還在探索中…</p>';
   const favs=L.filter(x=>x.sc>=.5),wst=L.filter(x=>x.sc<=-.5).reverse();
   const bag=Items.d.items.filter(i=>i.uses.some(u=>u.type==='food'||u.type==='drink')&&!(T.seen[i.id]&&T.seen[i.id].n+T.seen[i.id].rj>0)).length;
   const cu=[...new Set(Items.d.items.filter(i=>i.uses.some(u=>u.type==='food'||u.type==='drink')).flatMap(i=>this.feat(i).tokens.filter(t=>t[0]==='t')))].slice(0,24);
   const hint={mix:'你設定的優先，沒設定的由系統慢慢探索。',manual:'只依你的設定反應，沒設定的視為普通。',auto:'依個性與個體差異自然形成口味，吃過才會發現。'}[T.mode];
   B.innerHTML=`<h3>${esc(ch.name)} 的飲食喜好</h3><div class="tz-sub">已品嚐 ${L.length} 種・飽足 ${fl}%</div><div class="tz-fl"><i style="width:${fl}%"></i></div>
   ${Chars.list.length>1?`<div class="who">${Chars.list.map(c=>`<button class="chip ${c.id===ch.id?'on':''}" data-w="${c.id}">${esc(c.name.slice(0,6))}</button>`).join('')}</div>`:''}
   <div class="tz-seg">${[['manual','玩家指定'],['auto','自動探索'],['mix','混合']].map(m=>`<button data-m="${m[0]}" class="${T.mode===m[0]?'on':''}">${m[1]}</button>`).join('')}</div><div class="tz-hint">${hint}</div>
   <div class="tz-tabs"><button class="chip ${tab===0?'on':''}" data-tab="0">圖鑑</button><button class="chip ${tab===1?'on':''}" data-tab="1">偏好設定</button></div>
   ${tab===0?`<div class="tz-rk"><div><h5>最愛 TOP3</h5>${top(favs)}</div><div><h5>最討厭 TOP3</h5>${top(wst)}</div></div>
    ${L.length?`<div class="tz-grid">${L.map(x=>`<button class="tz-c lv-${x.lv}" data-i="${x.id}"><span class="tz-e">${this.ico(x.id,x.s)}</span><b>${esc(x.s.nm||'?')}</b><small>${x.tb?ic('ban',14)+' 禁忌':LV[x.lv].e+' '+LV[x.lv].t}</small></button>`).join('')}</div>`:'<div class="tz-un">還沒有紀錄，從背包拖一份食物給牠吧！</div>'}
    ${bag?`<div class="tz-un">背包裡還有 ${bag} 種沒嚐過的食物 ❓</div>`:''}`
   :`${T.mode==='auto'?'<div class="tz-hint" style="margin:0 2px 8px">自動探索模式不使用手動設定；已發現的口味會顯示在下方。</div>':''}
    ${TGK.map(k=>`<div class="tz-sec">${k}</div><div class="tz-ch">${TG.filter(g=>g.k===k).map(g=>chip(T,'g:'+g.id,g.em)).join('')}</div>`).join('')}
    <div class="tz-sec">類別</div><div class="tz-ch">${chip(T,'c:food',ic('utensils',15))}${chip(T,'c:drink',ic('cup',15))}</div>
    ${cu.length?`<div class="tz-sec">自訂標籤</div><div class="tz-ch">${cu.map(t=>chip(T,t,ic('tag',15))).join('')}</div>`:''}
    <div class="tz-hint" style="margin-top:12px">點一下依序切換：喜歡 → 最愛 → 討厭 → 最討厭 → 禁忌 → 未設定。「♡ / ✕」是系統已探索的結果。</div>
    <div class="tz-act"><button class="btn" data-a="fix">固定探索結果</button><button class="btn" data-a="reset">重設探索</button></div>`}`;
   B.scrollTop=sy};
  draw();off=this.on(()=>{if(!s.closed)draw()});
  B.addEventListener('click',async e=>{const c=e.target.closest('button');if(!c||!B.contains(c))return;const T=this.cd(ch);buzz(5);
   if(c.dataset.w){ch=Chars.byId(c.dataset.w)||ch;draw()}
   else if(c.dataset.m){T.mode=c.dataset.m;this.emit(ch)}
   else if(c.dataset.tab){tab=+c.dataset.tab;draw()}
   else if(c.dataset.i)this.itemSheet(ch,c.dataset.i)
   else if(c.dataset.t){if(T.mode==='auto'){toast('自動探索模式不使用手動設定，可切換為混合模式','info');return}
    const t=c.dataset.t,cyc=[null,2,3,-2,-3,'tb'],cur=T.tb[t]?'tb':T.p[t]??null,n=cyc[(cyc.indexOf(cur)+1)%cyc.length];delete T.p[t];delete T.tb[t];if(n==='tb')T.tb[t]=1;else if(n!=null)T.p[t]=n;this.emit(ch)}
   else if(c.dataset.a==='fix'){let n=0;Object.keys(T.kn).forEach(t=>{const v=T.ex[t];if(v!=null&&Math.abs(v)>=1&&T.p[t]==null){T.p[t]=v>=2.3?3:v>=1?2:v<=-2.3?-3:-2;n++}});this.emit(ch);toast(n?`已固定 ${n} 項探索結果`:'還沒有可固定的探索結果',n?'check':'info')}
   else if(c.dataset.a==='reset'){if(await confirmSheet({title:'重設探索？',msg:'會清除系統探索的口味與已品嚐紀錄並重新探索，你手動設定的喜好不受影響。',ok:'重設'})){T.ex={};T.kn={};T.seen={};T.seed=Math.random().toString(36).slice(2,10);this.emit(ch);toast('已重設探索','check')}}})},
 itemSheet(ch,id){const T=this.cd(ch);const s=openSheet('<div class="sh-body tz" id="tziB"></div>');const B=$('#tziB',s.el);
  const draw=()=>{const sn=T.seen[id]||{n:0,rj:0,lv:0,nm:'?',em:''},it=Items.get(id),iv=T.tb['i:'+id]?'tb':T.p['i:'+id]??null,sc=iv==='tb'?-4:iv!=null?this.ex2(iv):sn.lv,lv=this.lvOf(sc);
   const dt=sn.first?new Date(sn.first).toLocaleDateString():'-';
   B.innerHTML=`<div class="dt-hero"><div class="it">${this.ico(id,sn)}</div><div><h3>${esc(sn.nm||'?')}</h3><small>${iv==='tb'?ic('ban',14)+' 禁忌':LV[lv].e+' '+LV[lv].t}${it?'':'・已不在背包'}</small></div></div>
   <p class="tz-hint">吃過 ${sn.n} 次${sn.rj?`・婉拒 ${sn.rj} 次`:''}・第一次：${dt}</p>
   <div class="tz-lv">${[[3,'最愛'],[2,'喜歡'],[null,'依系統'],[-2,'討厭'],[-3,'最討厭'],['tb','禁忌']].map(x=>`<button data-v="${x[0]}" class="${iv===x[0]?'on':''}">${x[1]}</button>`).join('')}</div>
   <div class="pv-cta" style="margin-top:14px;display:flex"><button class="btn grow" data-close>關閉</button></div>`};
  draw();B.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(!b)return;const v=b.dataset.v,k='i:'+id;delete T.p[k];delete T.tb[k];if(v==='tb')T.tb[k]=1;else if(v!=='null')T.p[k]=+v;this.emit(ch);draw();buzz(6)})}};

/* ---- 與 2.4A 整合 ---- */
{const _n=Persona.norm;Persona.norm=function(d){const o=_n.call(this,d);if(d&&d.taste)o.taste=Taste.cleanChar(d.taste);return o}}
{const _nm=Items.norm;Items.norm=function(i){const o=_nm.call(this,i);if(o&&i&&i.tx&&typeof i.tx==='object'){const v=+i.tx.sat;if(Number.isFinite(v))o.tx={sat:clamp(Math.round(v),0,60)}}return o}}
{const _u=Items.use;Items.use=function(id,st,opt={}){const it=this.get(id);st=st||Home.stage;const ch=st&&st.ch;if(!it||!ch)return _u.call(this,id,st,opt);
  const use=(opt.use&&it.uses.find(u=>u.type===opt.use))||it.uses[0];if(!use||(use.type!=='food'&&use.type!=='drink'))return _u.call(this,id,st,opt);
  if(it.qty<=0){toast(`${it.name}已經用完了`,'info');return false}
  if(st.state==='held')return false;
  if(st.sleeping&&st.sleeping()){st.say('zzz…');toast(`${ch.name}正在睡覺`,'info');return false}
  return Taste.feed(it,use,st)}}
/* 完整背包：加入「飲食喜好」入口 */
{const _o=Bag.openFull;Bag.openFull=function(){const r=_o.apply(this,arguments);setTimeout(()=>{const t=$('#bgB .bg-top');if(t&&!$('.tz-bt',t)){const b=el('<button class="bg-sq tz-bt" aria-label="飲食喜好">'+ic('utensils',20)+'</button>');b.onclick=()=>Taste.open(Chars.active());t.append(b)}},30);return r}}
/* 角色選單：加入「飲食喜好」入口 */
{const _c=charMenu;charMenu=function(ch,onDone){const r=_c.apply(this,arguments);try{const sh=[...layer.querySelectorAll('.sheet')].pop(),b=sh&&$('.sh-body',sh);
  if(b&&!$('[data-tz]',b)){const row=el('<button class="srow" data-tz="1"><span class="c ns-ic">'+ic('utensils')+'</span><span class="t"><b>飲食喜好</b><small>口味、圖鑑與最愛最討厭</small></span></button>');const tt=$('.sh-title',b);tt?tt.after(row):b.prepend(row);
   row.onclick=()=>{buzz(8);const sc=[...layer.querySelectorAll('.scrim')].pop();if(sc)sc.click();setTimeout(()=>Taste.open(ch),260)}}}catch(e){}return r}}
/* 物品編輯：口味／食材／口感／溫度 快速標籤 */
{const _e=Bag.edit;Bag.edit=function(){const r=_e.apply(this,arguments);const B=$('#edB',layer);if(!B)return r;
  const inj=()=>{const T=$('#edT',B);if(!T||$('.tzb',B))return;const cur=()=>T.value.split(/[,，]/).map(x=>x.trim()).filter(Boolean);
   const w=el(`<div class="tzb"><div class="ed-l">口味・食材・口感・溫度（點選加入標籤）</div><div class="ed-ch">${TG.map(g=>`<button type="button" class="chip ${cur().includes(g.t)?'on':''}" data-tg2="${g.t}">${g.em} ${g.t}</button>`).join('')}</div></div>`);
   w.addEventListener('click',e=>{const b=e.target.closest('[data-tg2]');if(!b)return;const t=b.dataset.tg2,a=cur(),i=a.indexOf(t);if(i>=0)a.splice(i,1);else a.push(t);T.value=a.join(',');b.classList.toggle('on',i<0)});T.after(w)};
  inj();new MutationObserver(inj).observe(B,{childList:true});return r}}
setInterval(()=>{try{Taste.chatter()}catch(e){}},70000);
Bag.edit=function(){toast('只有自製作品可以編輯，請到工坊的「我的作品」','info')};
/* 舊存檔相容：載入時把已儲存的 taste 資料掛回角色（避免 norm 先於本模組執行而遺失） */
Taste.hydrate=function(){Chars.list.forEach(ch=>{try{const src=ch.kind==='demo'?((Cfg.v.overrides[ch.id]||{}).data||{}).taste:ch.rec&&ch.rec.data&&ch.rec.data.taste;if(src&&(!ch.data.taste||ch.data.taste.seed===''))ch.data.taste=this.cleanChar(src);else if(src&&ch.data.taste&&!ch.data.taste.seed)ch.data.taste=this.cleanChar(src)}catch(e){}})};
{const t=setInterval(()=>{try{if(Home.stage&&Chars.list.length){clearInterval(t);Taste.hydrate()}}catch(e){}},90)}
