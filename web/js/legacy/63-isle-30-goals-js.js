/* ===== 3.0 生活目標・任務・收藏・成就・角色成長（核心） =====
   整合既有：Econ（每日委託／成就／交易日誌）、Cat／Items（商品與物品）、Taste（喜好）、IsleLife（個性／需求／記憶）、IsleWorld（島嶼活動）。
   所有獎勵經 Econ.pay（收據去重）；物品數量只由 Inv.grant 增加。 */
(()=>{'use strict';
const I=n=>Math.max(0,Math.floor(+n)||0),rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)],cl=(v,a,b)=>Math.min(b,Math.max(a,v));
const hash=s=>{s=String(s);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0)/4294967295};
const dayKey=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const weekKey=()=>{const d=new Date(),t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())),w=(t.getUTCDay()+6)%7;t.setUTCDate(t.getUTCDate()-w+3);const f=new Date(Date.UTC(t.getUTCFullYear(),0,4));return t.getUTCFullYear()+'-W'+(1+Math.round(((t-f)/864e5-3+((f.getUTCDay()+6)%7))/7))};
let L,IW,C;
const O=(o,k,v)=>{if(!o[k]||typeof o[k]!=='object'||Array.isArray(o[k]))o[k]=v;return o[k]},A=(o,k)=>{if(!Array.isArray(o[k]))o[k]=[];return o[k]};

/* ---------- 1. 存檔（Cfg.v.l30 全域 + 各角色延伸資料），缺少欄位時自動補齊 ---------- */
function G(){const v=Cfg.v;if(!v.l30||typeof v.l30!=='object')v.l30={v:1};const s=v.l30;const cx=O(s,'codex',{});['seen','own','use','fav','x','firstBy'].forEach(k=>O(cx,k,{}));
 O(s,'wk',{k:'',q:[],b:0});O(s,'lq',{});O(s,'hq',{});O(s,'titles',{});O(s,'acts',{});O(s,'ev',{});A(s,'flowers');O(s,'secret',{});A(s,'jr');O(s,'day',{d:'',foods:{},req:0});return s}
function P(id){const x=L.X(id);O(x,'sk',{});A(x,'goals');A(x,'jr');O(x,'first',{});O(x,'gcd',{});O(x,'cnt',{});O(x,'rq',{d:'',n:0,next:0});if(x.req&&typeof x.req!=='object')x.req=null;return x}
let sT=0;const save=()=>{clearTimeout(sT);sT=setTimeout(()=>{Cfg.save();try{Eco.save()}catch(_){}},500)};

/* ---------- 2. 收藏圖鑑資料 ---------- */
const SPEC={
 shell:{t:'貝殼',ic:'🐚',list:[['pink','粉紅扇貝','#F5A3B5',1],['star','星星砂','#FFE27A',1],['white','白螺貝','#FFF1DA',1],['blue','藍紋貝','#7EC8E3',.8],['pearl','珍珠貝','#E8E0F5',.4],['tiger','虎紋螺','#E3A07A',.7],['moon','月光貝','#C7B5EC',.35],['urchin','幸運海膽殼','#93C65B',.25]]},
 fish:{t:'魚',ic:'🐟',list:[['clown','小丑魚','#F4A65B',1],['blue','藍鰭魚','#5DB3E0',1],['silver','銀光魚','#C9D6DF',1],['puffer','河豚','#E3C27A',.7],['sakura','櫻花鯛','#F5A3B5',.6],['glow','夜光魚','#9585DD',.5,'night'],['seahorse','海馬','#E0AD35',.4],['betta','鬥魚','#EC7878',.5],['grouper','石斑','#8A9A7B',.6],['whale','鯨鯊寶寶','#5878A8',.12]]},
 flower:{t:'花',ic:'🌼',list:[['daisy','雛菊','#FFF8EE',1],['tulip','鬱金香','#EC7878',1],['lavender','薰衣草','#B9A6E6',.8],['sunflower','向日葵','#FFD54A',.8],['cosmos','波斯菊','#F5A3B5',.8],['lily','鈴蘭','#F2F7EA',.5],['hydrangea','繡球花','#8FB6E8',.5,'rain'],['primrose','月見草','#FFE9A8',.4,'night']]},
 art:{t:'沙灘畫',ic:'🎨',list:[['star','星星','#FFD54A',1],['heart','愛心','#EC7878',1],['cat','貓咪','#C9A27E',.8],['wave','海浪','#5DB3E0',.8],['sun','太陽','#F4A65B',.7],['smile','笑臉','#86BC4E',.6]]},
 event:{t:'特殊事件',ic:'✨',list:[['shooting','流星','#FFE27A'],['meteor','流星雨','#9585DD'],['rainbow','雨後彩虹','#EC7878'],['bottle','瓶中信','#5DB3E0'],['lost','失物招領','#E0AD35'],['campparty','營火晚會','#F4A65B'],['firefly','螢火蟲之夜','#C9E36A'],['firstsnow','初雪','#E3EEF9']]},
 place:{t:'地點',ic:'📍',list:[['home','小屋'],['meadow','花海'],['tree','大樹下'],['dock','碼頭'],['bench','看海長椅'],['campfire','營火'],['field','草原'],['well','飲水台'],['picnic','野餐墊'],['cove','秘密小海灣','#5DB3E0',0,'secret'],['hill','星空山丘','#9585DD',0,'secret']]},
 moment:{t:'生活回憶',ic:'📖',list:[['friend','第一個朋友'],['best','第一位好朋友'],['lv3','第一次技能 Lv3'],['lv5','達人誕生'],['goal','第一個目標達成'],['life','第一個人生目標'],['habit','第一個後天習慣'],['party','全員集合']]}
};
const HOW={shell:'夥伴在海邊撿到',fish:'海洋技能 Lv3 後在碼頭釣到',flower:'園藝技能 Lv3 後照顧花草時發現',art:'創意技能 Lv3 後在發呆時畫出',event:'特別的時刻會自然發生',place:'夥伴去過就會記錄',moment:'生活中的重要第一次'};
function found(cat,id){return !!G().codex.x[cat]?.[id]}
function discover(cat,id,n,quiet){const cx=G().codex,m=O(cx.x,cat,{});if(m[id])return false;const sp=SPEC[cat]?.list.find(z=>z[0]===id);m[id]={t:Date.now(),by:n?.id||''};save();
 if(n){const x=P(n.id);x.cnt['c_'+cat]=(x.cnt['c_'+cat]|0)+1}bus('collect',n,{cat,id});try{Econ.on('collect',{},true)}catch(_){}
 if(!quiet&&sp)UI()?.unlock({k:'codex',title:'新收藏！',name:sp[1],sub:SPEC[cat].t+(n?'・'+n.s.ch.name.split(' ')[0]+'發現':''),art:specArt(cat,sp)});
 if(cat!=='moment'&&n)journal(n,'codex',`發現了${SPEC[cat].t}「${sp?sp[1]:id}」`,cat==='event'?id:null);return true}
function moment(id,n){if(found('moment',id))return;discover('moment',id,n,false)}
function specArt(cat,sp){const c=sp[2]||'#86BC4E';
 if(cat==='shell')return `<svg viewBox="0 0 40 40"><path d="M20 34L6 18Q8 6 20 5Q32 6 34 18Z" fill="${c}" stroke="#fff" stroke-width="1.5"/><path d="M20 34L12 9M20 34L20 5M20 34L28 9M20 34L8 15M20 34L32 15" stroke="rgba(0,0,0,.15)" stroke-width="1.4"/><rect x="16" y="32" width="8" height="4" rx="2" fill="${c}"/></svg>`;
 if(cat==='fish')return `<svg viewBox="0 0 40 30"><path d="M4 15Q16 2 28 15Q16 28 4 15ZM28 15L38 7V23Z" fill="${c}" stroke="#fff" stroke-width="1.5"/><circle cx="10" cy="13" r="2" fill="#2B4A5E"/><path d="M15 9Q18 15 15 21" stroke="rgba(255,255,255,.6)" stroke-width="1.5" fill="none"/></svg>`;
 if(cat==='flower')return `<svg viewBox="0 0 40 40"><path d="M20 22V38" stroke="#5FAE52" stroke-width="3"/><g fill="${c}" stroke="rgba(0,0,0,.12)">${[0,1,2,3,4].map(i=>{const a=i/5*Math.PI*2;return `<circle cx="${20+Math.cos(a)*7}" cy="${15+Math.sin(a)*7}" r="6"/>`}).join('')}</g><circle cx="20" cy="15" r="4.5" fill="#FFD54A"/></svg>`;
 if(cat==='art'){const P={star:'M20 4L24 15L36 15L26 22L30 34L20 27L10 34L14 22L4 15L16 15Z',heart:'M20 34Q4 22 6 13Q9 5 20 12Q31 5 34 13Q36 22 20 34Z',cat:'M8 30Q8 14 12 8L16 15H24L28 8Q32 14 32 30Z',wave:'M3 24Q10 12 17 24Q24 36 31 24Q35 18 38 22',sun:'M20 12A8 8 0 1 0 20.1 12ZM20 2V7M20 33V38M2 20H7M33 20H38M7 7L10 10M30 30L33 33M33 7L30 10M10 30L7 33',smile:'M20 5A15 15 0 1 0 20.1 5ZM13 16V18M27 16V18M12 24Q20 32 28 24'};return `<svg viewBox="0 0 40 40"><rect x="1" y="1" width="38" height="38" rx="10" fill="#F4E2B4"/><path d="${P[sp[0]]}" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
 const EM={shooting:'🌠',meteor:'☄️',rainbow:'🌈',bottle:'🍾',lost:'🎀',campparty:'🔥',firefly:'✨',firstsnow:'❄️',home:'🏠',meadow:'🌸',tree:'🌳',dock:'⚓',bench:'🪑',campfire:'🔥',field:'🌾',well:'⛲',picnic:'🧺',cove:'🏝️',hill:'⛰️',friend:'🤝',best:'💞',lv3:'⭐',lv5:'🏅',goal:'🎯',life:'🌟',habit:'🌱',party:'🎉'};return `<span class="l30-em">${EM[sp[0]]||'✨'}</span>`}

/* ---------- 3. 紀念品（成就獎勵專屬物品，不在商店販售） ---------- */
const MM=[['trophy','星光獎盃','furn','完成夢想的紀念。擺在家裡會閃閃發光。'],['magnifier','探險放大鏡','furn','圖鑑收藏家的證明。'],['starjar','流星瓶','furn','裝著一顆流星的玻璃瓶。'],['chime','貝殼風鈴','furn','用島上的貝殼做成的風鈴。'],['medal','小小勳章','acc','熱心幫手的勳章，可以別在胸前。'],['letter','遠方的信','gift','瓶中信的回信，珍藏起來吧。']];
const MMA={trophy:'<path d="M30 20H70V42Q70 62 50 64Q30 62 30 42Z" fill="#FFD54A"/><path d="M50 20H70V42Q70 62 50 64Z" fill="#E3AC23"/><path d="M30 26H18Q16 44 32 46M70 26H82Q84 44 68 46" stroke="#E3AC23" stroke-width="5" fill="none"/><rect x="44" y="64" width="12" height="12" fill="#C9A77C"/><rect x="32" y="76" width="36" height="10" rx="3" fill="#8A6648"/><path d="M50 30l3 7 7 .6-5.3 4.6 1.6 7-6.3-3.8-6.3 3.8 1.6-7-5.3-4.6 7-.6Z" fill="#fff"/>',
 magnifier:'<circle cx="42" cy="42" r="22" fill="#DDF1F8" stroke="#8A6648" stroke-width="7"/><path d="M58 58L80 80" stroke="#8A6648" stroke-width="10" stroke-linecap="round"/><path d="M32 34Q36 28 44 28" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none"/>',
 starjar:'<path d="M28 30H72V78Q72 88 50 88Q28 88 28 78Z" fill="#E8F6FF" opacity=".8" stroke="#9AD4F5" stroke-width="2"/><rect x="34" y="20" width="32" height="12" rx="4" fill="#C9A77C"/><path d="M50 46l4 9 10 1-7.5 6.6 2.3 9.8-8.8-5.4-8.8 5.4 2.3-9.8-7.5-6.6 10-1Z" fill="#FFE27A"/><circle cx="40" cy="72" r="2" fill="#FFF7C9"/><circle cx="60" cy="66" r="1.6" fill="#FFF7C9"/>',
 chime:'<path d="M20 20H80" stroke="#8A6648" stroke-width="5" stroke-linecap="round"/><g stroke="#C9A77C" stroke-width="1.5"><path d="M30 20V48M50 20V58M70 20V44"/></g><path d="M30 64L22 50Q24 42 30 42Q36 42 38 50Z" fill="#F5A3B5"/><path d="M50 74L42 60Q44 52 50 52Q56 52 58 60Z" fill="#7EC8E3"/><path d="M70 60L62 46Q64 38 70 38Q76 38 78 46Z" fill="#FFE27A"/>',
 medal:'<path d="M36 10L50 40L64 10Z" fill="#EC7878"/><path d="M42 10L50 30L58 10Z" fill="#fff" opacity=".6"/><circle cx="50" cy="60" r="24" fill="#FFD54A" stroke="#E3AC23" stroke-width="4"/><path d="M50 46l4 9 10 1-7.5 6.6 2.3 9.8-8.8-5.4-8.8 5.4 2.3-9.8-7.5-6.6 10-1Z" fill="#E3AC23"/>',
 letter:'<path d="M14 30H86V78H14Z" fill="#FFF6E2" stroke="#C9A77C" stroke-width="2"/><path d="M14 30L50 58L86 30" fill="none" stroke="#C9A77C" stroke-width="2"/><circle cx="50" cy="58" r="8" fill="#EC7878"/><path d="M46 58l3 3 5-6" stroke="#fff" stroke-width="2" fill="none"/>'};
const MMID=k=>'builtin_mm_'+k;
{const oi=Items.icon;Items.icon=function(i){if(i&&typeof i.id==='string'&&i.id.startsWith('builtin_mm_')){const k=i.id.slice(11);if(MMA[k])return `<img class="mini-art" alt="" draggable="false" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><ellipse cx="50" cy="92" rx="30" ry="5" fill="#5C4838" opacity=".1"/>${MMA[k]}</svg>`)}">`}return oi.apply(this,arguments)}}
function installMM(){let ch=0;Cat.d.delisted=Cat.d.delisted||[];for(const [k,name,cat,desc] of MM){const id=MMID(k);if(!Cat.d.delisted.includes(id)){Cat.d.delisted.push(id);ch=1}if(!Items.get(id)){const it=Items.norm({id,name,cat,qty:0,builtin:1,tags:['紀念品'],desc,consume:false,target:cat==='furn'?'scene':cat==='acc'?'char':'both',uses:[{type:cat,fx:{hearts:3,mood:'happy'}}]});it.qty=0;Items.d.items.push(it);ch=1}}
 Cat.d.products=Cat.d.products.filter(p=>!p.itemId.startsWith('builtin_mm_'));if(Cat.d.mode!=='life'){Cat.d.mode='life';ch=1}if(ch){Items.save(true);Cat.save();Items.emit()}}
function giveMM(k,rid){const id=MMID(k);if(!Items.get(id))return false;return Econ.pay(rid,'reward',0,[{id,n:1}])}

/* ---------- 4. 技能與興趣成長 ---------- */
const SK=[['read','閱讀','📚',['read','listen'],['bookworm','smart','introvert','quiet','serious'],'smart'],
 ['cook','料理','🧁',['eat','campfire','treat'],['cook','gourmet','foodie','bigeater'],'cook'],
 ['garden','園藝','🌱',['garden','flowers'],['nature','gentle','hardworking'],'nature'],
 ['explore','探索','🧭',['explore','observe','secret','wander'],['curious','brave','collector','walker'],'curious'],
 ['social','社交','💬',['chat','stroll','gather','listen'],['extrovert','friendlyhost','chatty','caring','cheerful'],'friendlyhost'],
 ['sport','運動','🏃',['tag','butterfly','dance'],['athletic','sporty','hot','cheerful'],'athletic'],
 ['sea','海洋','🐚',['fish'],['sealover','calm','collector'],'sealover'],
 ['art','創意','🎨',['daydream','stargaze','sunset'],['artsy','dreamer','romantic','music'],'artsy']];
const SKM=Object.fromEntries(SK.map(s=>[s[0],s]));
const XPL=[0,30,80,160,280];
const UNL={read:['會翻書','看書更專注，聊天時會分享讀書心得','會唸故事給附近的朋友聽','讀過的書會留在日誌裡','可能養成「聰明」特質'],
 cook:['會吃點心','營火邊會烤棉花糖','會做點心送給朋友','每週會做一盒餅乾送你','可能養成「料理高手」特質'],
 garden:['會澆水','照顧後會在花海種下新的花','會發現不同品種的花','種的花會開得更大','可能養成「喜歡自然」特質'],
 explore:['會四處走走','探險時更容易有發現','能發現島上的秘密地點','秘密地點裡會找到貝殼','可能養成「好奇」特質'],
 social:['會打招呼','聊天話題變多','看到朋友吵架會主動勸和','更容易和大家變熟','可能養成「熱情好客」特質'],
 sport:['會跑跳','跑得更快','開心時會翻跟斗','鬼抓人更厲害','可能養成「運動神經好」特質'],
 sea:['會看海','看海時魚更常跳出水面','能在碼頭釣到魚','更容易釣到稀有的魚','可能養成「海洋迷」特質'],
 art:['會發呆','發呆時會在地上畫畫','沙灘畫會收進圖鑑','畫作會被大家欣賞','可能養成「創意豐富」特質']};
const lvOf=xp=>{let l=1;for(let i=1;i<XPL.length;i++)if(xp>=XPL[i])l=i+1;return l};
function lv(id,k){return lvOf(P(id).sk[k]||0)}
function skillAff(ch,k){const s=SKM[k];let m=1;for(const t of s[4])if(L.has(ch,t))m+=.35;if(k==='sport'&&L.has(ch,'lazy'))m-=.3;if(k==='social'&&(L.has(ch,'loner')||L.has(ch,'shy')))m-=.15;return cl(m,.5,2.2)}
function gain(n,k,amt){if(!n||!SKM[k])return;const x=P(n.id),ch=n.s.ch,before=lvOf(x.sk[k]||0);x.sk[k]=Math.round(((x.sk[k]||0)+amt*skillAff(ch,k))*10)/10;const after=lvOf(x.sk[k]);
 if(after>before){const s=SKM[k];journal(n,'skill',`${s[1]}技能提升到 Lv${after}：${UNL[k][after-1]}`,'levelup:'+k);bus('skill',n,{k,lv:after});try{L.feel(n,'happy',.7,60)}catch(_){}
  IW.Act.say(n,pick([`感覺自己更會${s[1]}了！`,`${s[1]}又進步了一點～`,`嘿嘿，${s[1]} Lv${after}！`]),3,true);celebrate(n);UI()?.unlock({k:'skill',title:`${s[1]} Lv${after}`,name:n.s.ch.name.split(' ')[0],sub:UNL[k][after-1],art:`<span class="l30-em">${s[2]}</span>`});
  if(after===3)moment('lv3',n);if(after===5)moment('lv5',n)}save()}
function totalLv(){let t=0;for(const ch of Chars.list){const x=P(ch.id);for(const s of SK)t+=lvOf(x.sk[s[0]]||0)-1}return t}

/* ---------- 5. 生活日誌 ---------- */
function journal(n,k,txt,rp){const id=n?n.id||n:'';const e={t:Date.now(),k,txt,rp:rp||null,id};if(id){const x=P(id);const last=x.jr[0];if(last&&last.txt===txt&&Date.now()-last.t<6e4)return;x.jr.unshift(e);x.jr.length=Math.min(120,x.jr.length)}else{const g=G();g.jr.unshift(e);g.jr.length=Math.min(80,g.jr.length)}save()}
function first(n,key,txt,rp){const x=P(n.id);if(x.first[key])return false;x.first[key]=Date.now();journal(n,'first',txt,rp);return true}

/* ---------- 6. 事件匯流排：任務、目標、成長、收藏都從這裡計數 ---------- */
function bus(type,n,d={}){try{weeklyOn(type,d);goalsOn(type,n,d);hiddenOn(type,n,d)}catch(e){console.warn('[l30 bus]',e)}}

/* ---------- 7. 角色目標（短期願望・中期計畫・長期人生目標） ---------- */
const SPOT={dock:'碼頭',meadow:'花海',tree:'大樹下',campfire:'營火',bench:'看海長椅',field:'草原',well:'飲水台',picnic:'野餐墊',home:'小屋',cove:'秘密小海灣',hill:'星空山丘'};
const PACT={dock:'fish',meadow:'flowers',tree:'shade',campfire:'campfire',bench:'sunset',field:'stargaze',well:'drink',picnic:'eat',home:'home',cove:'secret',hill:'secret'};
const has=(ch,t)=>L.has(ch,t);
const foodsKnown=n=>Object.keys(L.X(n.id).log.food).filter(id=>Items.get(id)&&['food','drink'].includes(Items.get(id).cat));
const placesKnown=n=>new Set([...Object.keys(L.X(n.id).log.place).filter(k=>SPOT[k]),...Object.keys(G().secret).filter(k=>G().secret[k].by===n.id)]);
const pairsAt=(n,sc)=>Chars.list.filter(c=>c.id!==n.id&&(C.state().pairs[C.key(n.id,c.id)]?.score||0)>=sc).length;
const topSkill=n=>{const ch=n.s.ch;return SK.map(s=>[s[0],skillAff(ch,s[0])+lv(n.id,s[0])*.15+rnd(0,.2)]).sort((a,b)=>b[1]-a[1])[0][0]};
const GT=[
 {id:'s_taste',tier:'short',w:n=>has(n.s.ch,'picky')?.5:1+(has(n.s.ch,'foodie')||has(n.s.ch,'gourmet')?1.5:0),make:n=>({t:has(n.s.ch,'picky')?'找到一種願意吃的新食物':'品嚐一種沒吃過的食物',n:1,ev:'food_new'}),acts:['eat']},
 {id:'s_place',tier:'short',w:n=>.8+(has(n.s.ch,'curious')||has(n.s.ch,'walker')?1:0),make:n=>{const ks=Object.keys(PACT).filter(k=>k!=='home'&&(!['cove','hill'].includes(k)||G().secret[k]));const vis=L.X(n.id).log.place;const k=ks.sort((a,b)=>(vis[a]||0)-(vis[b]||0)+rnd(-1,1))[0];return {t:`去${SPOT[k]}走走`,n:1,ev:'place',data:{place:k}}},acts:n=>[]},
 {id:'s_friend',tier:'short',w:n=>has(n.s.ch,'loner')?.15:has(n.s.ch,'shy')?.5:1.2,make:n=>{const f=IW.friendOf(n,false);return f?{t:`和${f.s.ch.name.split(' ')[0]}聊聊天`,n:1,ev:'chat',data:{with:f.id}}:null},acts:['chat','stroll']},
 {id:'s_read',tier:'short',w:n=>.4+(has(n.s.ch,'bookworm')?2:0)+(has(n.s.ch,'introvert')||has(n.s.ch,'quiet')?.6:0),make:()=>({t:'安靜地看一本書',n:1,ev:'act',data:{k:'read'}}),acts:['read']},
 {id:'s_play',tier:'short',w:n=>.3+Persona.eff(n.s.ch.data).lively/80,make:()=>({t:'痛快地玩一場',n:1,ev:'act',data:{k:['butterfly','tag','dance']}}),acts:['butterfly','tag']},
 {id:'s_garden',tier:'short',w:n=>.3+(has(n.s.ch,'nature')||has(n.s.ch,'gentle')?1.5:0),make:()=>({t:'好好照顧花草',n:1,ev:'act',data:{k:'garden'}}),acts:['garden']},
 {id:'s_cook',tier:'short',w:n=>.2+(has(n.s.ch,'cook')?2:0)+(lv(n.id,'cook')>=2?.8:0),make:()=>({t:'在營火邊烤點心',n:1,ev:'act',data:{k:['campfire','treat']}}),acts:['campfire','treat']},
 {id:'m_skill',tier:'mid',w:()=>1.2,make:n=>{const k=topSkill(n),l=lv(n.id,k);if(l>=5)return null;return {t:`把${SKM[k][1]}練到 Lv${l+1}`,n:l+1,abs:'skill',data:{k}}},acts:n=>[]},
 {id:'m_collect',tier:'mid',w:n=>.3+(has(n.s.ch,'collector')?1.5:0)+(has(n.s.ch,'sealover')?.8:0)+(has(n.s.ch,'nature')?.6:0),make:n=>{const opts=['shell'];if(lv(n.id,'sea')>=3||has(n.s.ch,'sealover'))opts.push('fish');if(lv(n.id,'garden')>=3||has(n.s.ch,'nature'))opts.push('flower');const cat=pick(opts);const have=P(n.id).cnt['c_'+cat]|0;return {t:`收集 3 種${SPEC[cat].t}`,n:have+3,abs:'collect',data:{cat}}},acts:['fish','explore','garden']},
 {id:'m_friends',tier:'mid',w:n=>has(n.s.ch,'loner')?0:has(n.s.ch,'introvert')?.4:.6+Persona.eff(n.s.ch.data).social/80,make:n=>{const c=pairsAt(n,12);if(c>=Chars.list.length-1)return null;return {t:'和 2 位夥伴變得聊得來',n:Math.min(Chars.list.length-1,Math.max(2,c+1)),abs:'pairs12'}},acts:['chat','stroll']},
 {id:'m_taste',tier:'mid',w:n=>has(n.s.ch,'picky')?.2:.4+(has(n.s.ch,'foodie')||has(n.s.ch,'gourmet')||has(n.s.ch,'bigeater')?1.5:0),make:n=>{const c=foodsKnown(n).length;return {t:'嚐過 5 種不同的食物',n:Math.max(5,c+3),abs:'foods'}},acts:['eat']},
 {id:'m_explore',tier:'mid',w:n=>.4+(has(n.s.ch,'curious')||has(n.s.ch,'brave')||has(n.s.ch,'walker')?1.2:0)-(has(n.s.ch,'homebody')?.3:0),make:n=>{const c=placesKnown(n).size;if(c>=8)return null;return {t:'走遍島上 8 個地方',n:8,abs:'places'}},acts:['explore','wander']},
 {id:'m_decor',tier:'mid',w:n=>.2+(has(n.s.ch,'homebody')||has(n.s.ch,'perfectionist')||has(n.s.ch,'handy')||has(n.s.ch,'fashion')?1.2:0),make:()=>({t:'讓小屋多兩件家具',n:2,ev:'furn_add'}),acts:['furniture']},
 {id:'l_master',tier:'long',w:()=>1,make:n=>{const k=topSkill(n);if(lv(n.id,k)>=5)return null;return {t:`成為${SKM[k][1]}高手（Lv5）`,n:5,abs:'skill',data:{k}}},acts:n=>[]},
 {id:'l_bestie',tier:'long',w:()=>1,make:n=>{const ch=n.s.ch;if(has(ch,'loner'))return {t:'找到一位能一起安靜相處的夥伴',n:1,abs:'pairs12'};if(has(ch,'introvert')||has(ch,'shy'))return {t:'擁有一位知己（好朋友以上）',n:1,abs:'pairs32'};const m=Math.min(3,Chars.list.length-1);if(m<1)return null;return {t:`擁有 ${m} 位好朋友`,n:m,abs:'pairs32'}},acts:['chat','stroll']},
 {id:'l_collect',tier:'long',w:n=>.3+(has(n.s.ch,'collector')||has(n.s.ch,'curious')?1.2:0),make:()=>({t:'讓收藏圖鑑完成一半',n:50,abs:'codexpct'}),acts:['explore','fish']},
 {id:'l_secret',tier:'long',w:n=>.2+(has(n.s.ch,'curious')||has(n.s.ch,'brave')?1.2:0)+(lv(n.id,'explore')>=2?.6:0),make:()=>Object.keys(G().secret).length>=2?null:({t:'找到島上所有的秘密地點',n:2,abs:'secrets'}),acts:['explore']},
 {id:'l_chef',tier:'long',w:n=>.1+(has(n.s.ch,'cook')||has(n.s.ch,'caring')?1.3:0)+(lv(n.id,'cook')>=3?.6:0),make:n=>Chars.list.length<2?null:({t:'親手做點心給每位夥伴',n:Math.max(1,Math.min(6,C.nodes.size-1)),abs:'treated'}),acts:['treat','campfire']},
 {id:'l_garden',tier:'long',w:n=>.1+(has(n.s.ch,'nature')||has(n.s.ch,'gentle')?1.3:0),make:()=>({t:'讓花海多開 20 朵花',n:20,abs:'planted'}),acts:['garden']}
];
const GTM=Object.fromEntries(GT.map(g=>[g.id,g]));
const SLOTS={short:2,mid:1,long:1},GCD={short:3*60e3,mid:10*60e3,long:30*60e3},REWARD={short:10,mid:30,long:100};
function absVal(n,g){const x=P(n.id);switch(g.abs){case'skill':return lv(n.id,g.data.k);case'collect':return x.cnt['c_'+g.data.cat]|0;case'pairs12':return pairsAt(n,12);case'pairs32':return pairsAt(n,32);case'foods':return foodsKnown(n).length;case'places':return placesKnown(n).size;case'codexpct':return codexPct();case'secrets':return Object.keys(G().secret).length;case'treated':return Object.keys(x.cnt.treated||{}).length;case'planted':return G().flowers.filter(f=>f.by===n.id).length}return 0}
function goalsTick(n){const x=P(n.id),now=Date.now();
 x.goals=x.goals.filter(g=>g.st==='active'||(g.st==='done'&&now-g.done<7*864e5));
 for(const g of x.goals){if(g.st!=='active')continue;if(g.tier==='short'&&!g.pin&&now-g.t>8*3600e3){g.st='expired';continue}if(g.abs){g.p=Math.min(g.n,absVal(n,g));if(g.p>=g.n)complete(n,g)}}
 x.goals=x.goals.filter(g=>g.st!=='expired');
 if((L.X(n.id).log.act&&Object.values(L.X(n.id).log.act).reduce((s,v)=>s+v,0))<3)return;
 for(const tier of ['short','mid','long']){const act=x.goals.filter(g=>g.st==='active'&&g.tier===tier).length;if(act>=SLOTS[tier])continue;if((x.gcd['_'+tier]||0)>now)continue;
  if(tier==='long'&&Object.values(L.X(n.id).log.act).reduce((s,v)=>s+v,0)<15)continue;makeGoal(n,tier);break}}
function makeGoal(n,tier,exclude){const x=P(n.id),now=Date.now(),cands=GT.filter(t=>t.tier===tier&&t.id!==exclude&&(x.gcd[t.id]||0)<now&&!x.goals.some(g=>g.st==='active'&&g.tpl===t.id)).map(t=>[t,Math.max(0,t.w(n))]).filter(z=>z[1]>0);
 let tot=cands.reduce((s,z)=>s+z[1],0),r=Math.random()*tot;for(const [t,w] of cands){r-=w;if(r>0)continue;const m=t.make(n);if(!m)continue;
  const g=Object.assign({id:'g'+now.toString(36)+Math.random().toString(36).slice(2,5),tpl:t.id,tier,st:'active',t:now,p:0,pin:false},m);if(g.abs)g.p=Math.min(g.n,absVal(n,g));if(g.abs&&g.p>=g.n)continue;x.goals.push(g);x.gcd['_'+tier]=now+GCD[tier];save();
  if(Math.random()<.6)IW.Act.say(n,goalLine(n,g),3);IW.think(n,'explore');return g}
 x.gcd['_'+tier]=now+GCD[tier];return null}
function goalLine(n,g){return pick({short:[`今天想${g.t}！`,`好想${g.t}喔。`],mid:[`我決定要${g.t}！`,`最近的計畫：${g.t}。`],long:[`總有一天，我要${g.t}。`,`我的夢想是${g.t}！`]}[g.tier])}
function goalsOn(type,n,d){if(!n)return;const x=P(n.id);for(const g of x.goals){if(g.st!=='active'||!g.ev||g.ev!==type)continue;
 if(g.ev==='act'){const ks=[].concat(g.data.k);if(!ks.includes(d.k))continue}if(g.ev==='place'&&g.data.place!==d.place)continue;if(g.ev==='chat'&&g.data.with&&d.with!==g.data.with)continue;
 g.p++;if(g.p>=g.n)complete(n,g)}}
function complete(n,g){if(g.st!=='active')return;g.st='done';g.done=Date.now();g.p=g.n;const x=P(n.id),ch=n.s.ch;x.gcd[g.tpl]=Date.now()+(g.tier==='short'?20*60e3:2*3600e3);
 const r=REWARD[g.tier];try{Econ.pay('gl_'+n.id+'_'+g.id,'goal',r)}catch(_){}x.cnt.goals=(x.cnt.goals|0)+1;if(g.tier==='long'){x.cnt.lgoals=(x.cnt.lgoals|0)+1;moment('life',n);G().titles['dream_'+n.id]={t:Date.now(),name:`${ch.name.split(' ')[0]}的夢想`};giveMM('trophy','mm_trophy_'+n.id+'_'+g.id)}
 moment('goal',n);try{Econ.on('goal',{},true)}catch(_){}bus('goal',n,{tier:g.tier});try{L.feel(n,'happy',.9,90);L.memo(n,'wish',{text:g.t})}catch(_){}celebrate(n);
 journal(n,'goal',`${{short:'小目標',mid:'計畫',long:'人生目標'}[g.tier]}達成：${g.t}（+${r} 星幣${g.tier==='long'?'・星光獎盃':''}）`,'goal');
 IW.Act.say(n,pick(g.tier==='long'?['我做到了……！我真的做到了！','這是我一直以來的夢想！']:['達成了！','嘿嘿，做到了～','好有成就感！']),3.2,true);
 UI()?.unlock({k:'goal',title:{short:'小目標達成',mid:'計畫完成',long:'夢想實現！'}[g.tier],name:g.t,sub:`${ch.name.split(' ')[0]}・+${r} 星幣`,art:`<span class="l30-em">${g.tier==='long'?'🌟':g.tier==='mid'?'🎯':'✅'}</span>`});save()}
function goalAction(n,gid,act){const x=P(n.id),g=x.goals.find(z=>z.id===gid);if(!g)return false;
 if(act==='pin'){g.pin=!g.pin;save();return true}
 if(act==='ignore'){x.goals=x.goals.filter(z=>z!==g);x.gcd[g.tpl]=Date.now()+864e5;save();return true}
 if(act==='swap'){x.goals=x.goals.filter(z=>z!==g);x.gcd[g.tpl]=Date.now()+864e5;x.gcd['_'+g.tier]=0;const ng=makeGoal(n,g.tier,g.tpl);save();return !!ng}
 if(act==='help'){C.interrupt(n);const t=GTM[g.tpl];let acts=typeof t.acts==='function'?t.acts(n):t.acts;if(g.tpl==='s_place'||g.ev==='place')acts=[PACT[g.data.place]];if(g.abs==='skill')acts=SKM[g.data.k][3].filter(a=>IW.ACTS[a]);
  if(g.tpl==='s_friend'){const f=C.nodes.get(g.data.with);if(f&&!C.busy(f)){C.interrupt(f);return IW.startStroll(n,f)||C.encounter(n,f,'chat')}}
  for(const a of acts){if(a==='chat'||a==='stroll'){const f=IW.friendOf(n,false);if(f&&!C.busy(f)){C.interrupt(f);if(IW.startStroll(n,f))return true}continue}if(a==='furniture'){const fs=IW.furnList(n);if(fs.length&&C.furnish(n,fs[0].p,true))return true;continue}if(IW.ACTS[a]&&IW.Act.start(n,a))return true}return false}return false}
function goalMul(n,k){const x=P(n.id);let m=1;for(const g of x.goals){if(g.st!=='active')continue;const t=GTM[g.tpl];if(!t)continue;let acts=typeof t.acts==='function'?t.acts(n):t.acts;if(g.data?.place)acts=[PACT[g.data.place]];if(g.abs==='skill')acts=SKM[g.data.k][3];if(acts.includes(k))m*=({short:1.8,mid:1.4,long:1.25})[g.tier]*(g.pin?1.3:1)}return m}

/* ---------- 8. 夥伴的小請求 ---------- */
const RQ={
 drink:{t:'可以給我一杯飲料嗎？',w:n=>1.6-L.needs(n).thirst,how:'從背包拿飲料給牠'},
 food:{t:'肚子餓了，可以給我點吃的嗎？',w:n=>(1.5-L.needs(n).hunger)*(has(n.s.ch,'foodie')?1.6:1),how:'從背包拿食物給牠'},
 toy:{t:'陪我玩玩具好不好？',w:n=>(1.3-L.needs(n).fun)*(Persona.eff(n.s.ch.data).lively/60),how:'把玩具拖給牠'},
 gift:{t:'今天好想收到一點小驚喜…',w:n=>has(n.s.ch,'romantic')||has(n.s.ch,'clingy')?1.2:.4,how:'送牠一份禮物'},
 pet:{t:'可以摸摸我的頭嗎？',w:n=>has(n.s.ch,'clingy')?1.8:Persona.eff(n.s.ch.data).indep<45?1:.4,how:'點一下牠'},
 go:{t:p=>`陪我去${SPOT[p.place]}好嗎？`,w:()=>.8,how:'按「好啊」陪牠過去',make:n=>{const k=pick(['dock','meadow','bench','tree','campfire'].filter(q=>!(IW.ctx().night&&['meadow','dock'].includes(q))));return {place:k}}},
 buy:{t:p=>`商店的「${p.name}」好像很可愛…`,w:n=>has(n.s.ch,'fashion')||has(n.s.ch,'collector')?1.2:.5,how:'在商店買下來送給牠',make:n=>{const ps=Cat.d.products.filter(p=>{const it=Items.get(p.itemId);return it&&!I(it.qty)&&['wear','acc','toy','gift','food','drink'].includes(it.cat)&&window.OCSShop?.inStock(p)!==false&&Cat.price(p)<=Math.max(120,Wallet.bal()+60)});const p=pick(ps);return p?{item:p.itemId,name:Items.get(p.itemId).name,pid:p.id}:null}}
};
function reqTick(n){const x=P(n.id),now=Date.now(),d=dayKey(),gg=G();if(gg.day.d!==d)gg.day={d,foods:{},req:0};if(x.rq.d!==d){x.rq.d=d;x.rq.n=0}
 if(x.req){if(now-x.req.t>2*3600e3){x.req=null;save()}return}if(x.rq.n>=3||now<(x.rq.next||0)||G().day.req>=8)return;if(Math.random()>.025*(has(n.s.ch,'shy')?.4:1)*(has(n.s.ch,'polite')?.8:1))return;
 const opts=Object.entries(RQ).map(([k,r])=>[k,Math.max(0,r.w(n))]).filter(z=>z[1]>0);let tot=opts.reduce((s,z)=>s+z[1],0),r=Math.random()*tot,k=opts[0][0];for(const [kk,w] of opts){r-=w;if(r<=0){k=kk;break}}
 const R=RQ[k],data=R.make?R.make(n):{};if(!data)return;x.req=Object.assign({id:'r'+now.toString(36),k,t:now},data);x.rq.n++;x.rq.next=now+8*60e3;save();
 IW.Act.say(n,typeof R.t==='function'?R.t(x.req):R.t,3.6,true);IW.think(n,'friend')}
function reqText(r){const R=RQ[r.k];return typeof R.t==='function'?R.t(r):R.t}
function reqDone(n,k,o={}){const x=P(n.id),r=x.req;if(!r||r.k!==k)return false;if(k==='buy'&&o.item!==r.item)return false;if(k==='go'&&o.place!==r.place)return false;
 x.req=null;const ch=n.s.ch,amt=15+Math.round(hash(r.id)*10);try{Econ.pay('rq_'+n.id+'_'+r.id,'request',amt)}catch(_){}try{Eco.v.bond[n.id]=I(Eco.v.bond[n.id])+6}catch(_){}G().day.req++;
 const v={tsun:'才、才不是特別想要…不過，謝謝。',shy:'謝、謝謝你…我好開心。',sharp:'哼，算你有心。',chatty:'哇謝謝謝謝！你最好了！我跟你說喔——',gentle:'謝謝你，我會好好珍惜的。',polite:'非常感謝您。',quiet:'…謝謝。'};
 const vo=['tsun','shy','sharp','chatty','gentle','polite','quiet'].find(t=>has(ch,t));IW.Act.say(n,v[vo]||pick(['謝謝你！','你真好～','最喜歡你了！']),3.4,true);
 try{L.feel(n,'happy',.8,70);L.emit(n,'happy');L.memo(n,'wish',{text:reqText(r)})}catch(_){}journal(n,'request',`請求完成：${reqText(r)}（+${amt} 星幣）`);try{window.L31ReqFx&&L31ReqFx(n,r,amt)}catch(_){}try{Econ.on('request',{},true)}catch(_){}bus('request',n,{k});save();return true}

/* ---------- 9. 每週・長期・隱藏任務 ---------- */
const WQ=[['chat','和夥伴聊天 {n} 次',[8,12],[90,120]],['read','看書 {n} 次',[4,6],[70,90]],['garden','照顧花草 {n} 次',[4,6],[70,90]],['shop','在商店購物 {n} 次',[2,4],[60,80]],['collect','發現 {n} 件新收藏',[3,5],[100,130]],['goal','完成 {n} 個夥伴目標',[2,3],[110,140]],['request','完成 {n} 個夥伴請求',[2,4],[90,120]],['view','看夕陽或星星 {n} 次',[2,4],[60,80]],['feed','餵食 {n} 次',[5,8],[70,90]],['skill','夥伴技能升級 {n} 次',[1,2],[120,150]]];
function weekly(){const g=G(),k=weekKey();if(g.wk.k!==k){const pool=WQ.map(q=>({q,h:hash(k+q[0])})).sort((a,b)=>a.h-b.h).slice(0,4);g.wk={k,b:0,q:pool.map(({q,h})=>({k:q[0],t:q[1].replace('{n}',String(Math.round(q[2][0]+(q[2][1]-q[2][0])*h))),n:Math.round(q[2][0]+(q[2][1]-q[2][0])*h),r:Math.round((q[3][0]+(q[3][1]-q[3][0])*h)/5)*5,p:0,c:0}))};save()}return g.wk}
const WMAP={chat:'chat',act_read:'read',act_garden:'garden',shop:'shop',collect:'collect',goal:'goal',request:'request',act_sunset:'view',act_stargaze:'view',feed:'feed',skill:'skill'};
function weeklyOn(type,d){const key=type==='act'?'act_'+d.k:type,k=WMAP[key];if(!k)return;const w=weekly();for(const q of w.q){if(q.k===k&&!q.c&&q.p<q.n){q.p++;if(q.p>=q.n){setTimeout(()=>toast(`每週任務「${q.t}」完成，可領取`,'sparkle'),600)}}}save()}
function claimWeekly(k){const w=weekly(),q=w.q.find(z=>z.k===k);if(!q||q.c||q.p<q.n)return false;q.c=1;if(!Econ.pay('wq_'+w.k+'_'+k,'week',q.r)){q.c=0;return false}buzz(14);toast(`每週任務完成 +${q.r} 星幣`,'sparkle');save();return true}
function claimWeeklyBonus(){const w=weekly();if(w.b||!w.q.every(q=>q.c))return false;w.b=1;const gift=Items.d.items.find(i=>i.id==='builtin_tl_cookies')||Items.d.items.find(i=>i.cat==='gift');if(!Econ.pay('wqb_'+w.k,'week',100,gift?[{id:gift.id,n:1}]:[])){w.b=0;return false}buzz(14);toast(`本週全部完成 +100 星幣${gift?'・'+gift.name:''}`,'sparkle');save();return true}
const LQ=[{id:'c1',t:'島上的新生活',d:'讓 2 位以上夥伴一起生活',ok:()=>OCSCommunity.nodes.size>=2,r:60},
 {id:'c2',t:'有了興趣',d:'任一位夥伴的技能達到 Lv3',ok:()=>Chars.list.some(c=>SK.some(s=>lv(c.id,s[0])>=3)),r:120},
 {id:'c3',t:'小小收藏家',d:'收藏圖鑑發現 30 項',ok:()=>codexCount().have>=30,r:150,title:'島嶼收藏家'},
 {id:'c4',t:'實現夢想',d:'夥伴們一共完成 3 個人生目標',ok:()=>Chars.list.reduce((s,c)=>s+(P(c.id).cnt.lgoals|0),0)>=3,r:300,mm:'starjar'},
 {id:'c5',t:'島嶼傳說',d:'找到所有秘密地點，並看見流星雨',ok:()=>Object.keys(G().secret).length>=2&&found('event','meteor'),r:400,title:'島嶼傳說'}];
function claimLong(id){const g=G(),i=LQ.findIndex(q=>q.id===id),q=LQ[i];if(!q||g.lq[id]||!q.ok())return false;if(i>0&&!g.lq[LQ[i-1].id])return false;g.lq[id]=Date.now();
 if(!Econ.pay('lq_'+id,'long',q.r)){delete g.lq[id];return false}if(q.title)g.titles['lq_'+id]={t:Date.now(),name:q.title};if(q.mm)giveMM(q.mm,'mm_lq_'+id);journal(null,'quest',`長期任務「${q.t}」完成（+${q.r} 星幣${q.title?'・稱號「'+q.title+'」':''}）`);
 UI()?.unlock({k:'quest',title:'長期任務完成',name:q.t,sub:`+${q.r} 星幣${q.title?'・稱號「'+q.title+'」':''}`,art:'<span class="l30-em">📜</span>'});save();return true}
const HQ=[['rainread','雨天書蟲','在下雨時看書',60],['wish','向流星許願','有夥伴正在看星星時出現流星',60],['night','深夜的小島','凌晨 1～4 點還在島上陪夥伴',50],['feast','豐盛的一天','同一天餵了 5 種不同的食物',80],['trio','三人舞會','三位以上夥伴一起跳舞',80],['campparty','營火晚會','三位以上夥伴同時圍著營火',100],['rainbow','雨後彩虹','看見雨停後的彩虹',60],['secret','秘密探險家','找到所有秘密地點',120],['bottle','來自遠方的信','完成瓶中信的往返',120],['gourmet','美食評論家','一位夥伴嚐遍所有食物',150]];
function hiddenDone(id,n){const g=G();if(g.hq[id])return;g.hq[id]={t:Date.now(),c:0};const q=HQ.find(z=>z[0]===id);save();UI()?.unlock({k:'hidden',title:'隱藏任務達成！',name:q[1],sub:q[2],art:'<span class="l30-em">🔮</span>'});journal(n||null,'quest',`發現隱藏任務「${q[1]}」`)}
function claimHidden(id){const g=G(),h=g.hq[id],q=HQ.find(z=>z[0]===id);if(!h||h.c||!q)return false;h.c=1;if(!Econ.pay('hq_'+id,'hidden',q[3])){h.c=0;return false}buzz(14);toast(`隱藏任務「${q[1]}」+${q[3]} 星幣`,'sparkle');save();return true}
function hiddenOn(type,n,d){if(type==='act'&&d.k==='read'&&IW.ctx().rain)hiddenDone('rainread',n);
 if(type==='feed'){const g=G(),dk=dayKey();if(g.day.d!==dk){g.day={d:dk,foods:{},req:g.day.req&&g.day.d===dk?g.day.req:0}}g.day.foods[d.item]=1;if(Object.keys(g.day.foods).length>=5)hiddenDone('feast',n);
  const all=Items.d.items.filter(i=>['food','drink'].includes(i.cat)).map(i=>i.id);if(n&&all.length&&all.every(id=>L.X(n.id).log.food[id]))hiddenDone('gourmet',n)}}

/* ---------- 10. 成就（擴充既有 Econ 成就） ---------- */
const ACH=[['chat','社交達人',[[10,60],[50,150],[200,350]]],['shop','購物愛好者',[[5,50],[25,150],[80,300]]],['codex','圖鑑收藏家',[[10,80],[40,200],[80,400]]],['skill','成長的喜悅',[[5,80],[15,200],[30,400]]],['goal','夢想實踐家',[[3,80],[15,220],[40,450]]],['request','熱心幫手',[[5,60],[25,160],[80,350]]],['event','奇遇見證者',[[3,80],[6,200],[8,400]]],['create','創作新星',[[1,60],[5,150],[15,300]]],['explore2','島嶼探險家',[[5,60],[9,160],[11,300]]],['friends','好朋友圈',[[1,80],[3,200],[6,400]]]];
const AREW={codex:{0:{mm:'magnifier'},2:{title:'圖鑑大師'}},skill:{1:{act:'flip',title:'成長中的島民'}},goal:{1:{mm:'chime'},2:{title:'夢想實踐家'}},request:{0:{mm:'medal'},2:{title:'島上的好幫手'}},event:{0:{mm:'starjar'}},friends:{0:{title:'好人緣'},2:{title:'人氣王'}},explore2:{2:{title:'島嶼地圖師'}},chat:{2:{title:'話匣子'}}};
function absStats(){const e=Econ.s;const set=(k,v)=>{if(I(e.stat[k])<v)e.stat[k]=v};set('codex',codexCount().have);set('skill',totalLv());set('event',Object.keys(G().codex.x.event||{}).length);
 set('create',Cat.d.products.filter(p=>{const it=Items.get(p.itemId);return it&&!it.builtin&&['draw','img','pack','import','migrated'].includes(p.src)}).length);
 set('explore2',Object.keys(G().codex.x.place||{}).length);let f=0;for(const p of Object.values(C.state().pairs))if(p.score>=32)f++;set('friends',f)}
function patchAch(){const have=new Set((window.OCS_AC||[]).map(a=>a.id));ACH.forEach(([id,t,tiers])=>{if(!have.has(id))Econ.addAch({id,t,tiers})});
 const oc=Econ.claimAch.bind(Econ);Econ.claimAch=function(id){const tier=I(Econ.s.ach[id]);const r=oc(id);if(r){try{const rw=AREW[id]?.[tier];if(rw){if(rw.mm&&giveMM(rw.mm,'mm_a_'+id+'_'+tier))setTimeout(()=>toast(`獲得紀念品「${Items.get(MMID(rw.mm)).name}」`,'sparkle'),900);if(rw.title)G().titles['a_'+id+'_'+tier]={t:Date.now(),name:rw.title};if(rw.act)G().acts[rw.act]=Date.now();save()}
   journal(null,'ach',`成就「${(ACH.find(a=>a[0]===id)||[0,id])[1]||id}」第 ${tier+1} 階達成`);UI()?.unlock({k:'ach',title:'成就解鎖',name:(ACH.find(a=>a[0]===id)?.[1])||'成就',sub:rw?.title?`稱號「${rw.title}」`:rw?.mm?`紀念品「${Items.get(MMID(rw.mm))?.name}」`:'',art:'<span class="l30-em">🏆</span>'})}catch(e){}}return r}}
function patchJobs(){[{k:'read',t:'陪夥伴看一次書',ic:'book',n:[1,2],r:[30,45],w:2},{k:'shop',t:'在商店買一樣東西',ic:'bag',n:[1,1],r:[25,35],w:2},{k:'chat',t:'見證夥伴們聊天',ic:'chat',n:[1,2],r:[30,45],w:2},{k:'garden',t:'讓夥伴照顧花草',ic:'seed',n:[1,1],r:[25,40],w:2},{k:'request',t:'完成一個夥伴請求',ic:'heart',n:[1,1],r:[40,55],w:2},{k:'collect',t:'發現一件新收藏',ic:'sparkle',n:[1,1],r:[40,60],w:1}].forEach(j=>Econ.addJob(j))}

/* ---------- 11. 收藏圖鑑計數 ---------- */
const ICAT=['food','drink','wear','acc','furn','toy','gift'];
function itemsFor(cat){const pr=new Set(Cat.d.products.map(p=>p.itemId));return Items.d.items.filter(i=>i.cat===cat&&(pr.has(i.id)||i.id.startsWith('builtin_mm_')))}
function itemFound(i){const cx=G().codex;return !!(cx.own[i.id]||cx.seen[i.id]||I(i.qty)>0)}
function codexCount(){let have=0,all=0;for(const c of ICAT){const L_=itemsFor(c);all+=L_.length;have+=L_.filter(itemFound).length}for(const c of Object.keys(SPEC)){all+=SPEC[c].list.length;have+=Object.keys(G().codex.x[c]||{}).length}return {have,all}}
function codexPct(){const c=codexCount();return c.all?Math.floor(c.have/c.all*100):0}
function ownTick(){const cx=G().codex;let ch=0;for(const i of Items.d.items){if(I(i.qty)>0&&!cx.own[i.id]){cx.own[i.id]=Date.now();ch=1}}if(ch)save()}

/* ---------- 12. 活動接點：技能經驗、新活動、等級效果 ---------- */
function celebrate(n){if(!n?.s)return;try{L.sparkFx(n.s,10,46);L.QA.hop(n.s)}catch(_){}}
function defineActs(){const A=IW.ACTS,P_=IW.props;
 A.listen={icon:'friend',spot:(n,o)=>o.spot,arrive(n,task){task.pose='sit';n.s.go('sit',{forced:1});const r=task.data.reader;if(r)n.s.dir=r.x>n.x?1:-1;n.wait=rnd(8,12);task.hT=3},tick(n,dt,task){task.hT-=dt;if(task.hT<=0){task.hT=rnd(3,5);n.s.hearts(1)}}};
 A.treat={icon:'campfire',spot:(n,o)=>o.spot,arrive(n,task){const m=task.data.mate;n.wait=3.2;if(!m||!C.nodes.has(m.id))return;n.s.dir=m.x>n.x?1:-1;IW.Act.say(n,pick(['這是我做的點心，給你！','嚐嚐看我的手藝～','特地為你做的喔！']),2.8,true);
  setTimeout(()=>{if(!C.nodes.has(m.id))return;const nd=L.needs(m);nd.hunger=cl(nd.hunger+.4,0,1);m.s.dir=n.x>m.x?1:-1;IW.Act.say(m,pick(['哇，好好吃！','謝謝你！','你好厲害喔！']),2.6,true);L.emit(m,'happy');m.s.hearts(2);
   const p=C.pair(n.id,m.id);p.score=Math.min(100,(p.score||0)+2);const x=P(n.id);(x.cnt.treated=x.cnt.treated||{})[m.id]=Date.now();L.memo(m,'gift',{item:'手作點心'});journal(n,'event',`做點心送給${m.s.ch.name.split(' ')[0]}`);gain(n,'cook',6);gain(n,'social',2);save()},900)}};
 A.secret={icon:'explore',spot:n=>{const ks=Object.keys(G().secret);if(!ks.length)return null;const k=pick(ks),s=SECRET[k];return IW.spotNear(s.x,s.y+.02,.04,.01,n)},arrive(n,task){const k=Object.entries(SECRET).sort((a,b)=>Math.hypot(a[1].x-n.x,a[1].y-n.y)-Math.hypot(b[1].x-n.x,b[1].y-n.y))[0][0];task.sk=k;n.wait=rnd(8,12);n.s.go('look');
  IW.Act.say(n,k==='cove'?pick(['這裡的海水好清澈。','潮池裡有小螃蟹！']):pick(['從這裡看得好遠。','晚上這裡一定能看到好多星星。']),2.8);bus('place',n,{place:k});L.X(n.id).log.place[k]=(L.X(n.id).log.place[k]||0)+1;if(k==='cove'&&lv(n.id,'explore')>=4&&Math.random()<.5)setTimeout(()=>findShell(n),3000)}};
 // 閱讀：Lv2 更專注、Lv3 會唸故事給朋友聽
 wrap(A.read,'arrive',(o,n,task)=>{o(n,task);const l=lv(n.id,'read');if(l>=2)n.wait*=1.2;if(l>=3){const f=[...C.nodes.values()].find(q=>q!==n&&!q.task&&!C.busy(q)&&Math.hypot(q.x-n.x,q.y-n.y)<.7);if(f){const s=C.nearest(n.x+(f.x<n.x?-.09:.09),n.y+.01,f,undefined,true);if(s&&IW.Act.start(f,'listen',{spot:s,data:{reader:n},quiet:1})){IW.Act.say(n,pick(['要不要聽我唸故事？','這段好有趣，我唸給你聽！']),2.8,true);setTimeout(()=>IW.Act.say(f,pick(['好呀！','嗯嗯，我在聽～']),2.2,true),1500);L.memo(f,'chat',{with:n.s.ch.name.split(' ')[0]});gain(n,'social',3);gain(f,'read',3)}}}
  if(l>=4&&Math.random()<.4){const BOOKS=['星星的航海日記','會說話的蘑菇','雲朵烘焙坊','月光圖書館','小島的一百個秘密','迷路的風','海底郵局','森林裡的茶會'];const b=pick(BOOKS);journal(n,'read',`讀完了《${b}》`)}});
 // 料理：Lv2 烤棉花糖
 wrap(A.campfire,'arrive',(o,n,task)=>{o(n,task);if(lv(n.id,'cook')>=2){const d=document.createElement('i');d.className='l29-prop roast';d.innerHTML='<svg viewBox="0 0 40 40"><path d="M6 36L30 10" stroke="#8A6648" stroke-width="2.4" stroke-linecap="round"/><rect x="26" y="4" width="10" height="9" rx="3" fill="#FFF6E2" stroke="#E3C08E" stroke-width="1.4" transform="rotate(-42 31 8)"/></svg>';C.world.append(d);const W=IW.W,H=IW.H;d.style.left=(n.x*W+n.s.dir*n.s.size*.25)+'px';d.style.top=(n.y*H-n.s.size*.4)+'px';d.style.zIndex=String(Math.round(n.y*10000)*16+n.order+1);task.roast=d;task.rT=5}});
 wrap(A.campfire,'tick',(o,n,dt,task)=>{o&&o(n,dt,task);if(task.roast){task.rT-=dt;if(task.rT<=0){task.rT=99;task.roast.querySelector('rect')?.setAttribute('fill','#E3A55C');IW.Act.say(n,'棉花糖烤好了～香香的！',2.6);L.needs(n).hunger=cl(L.needs(n).hunger+.2,0,1);gain(n,'cook',3);const mate=[...C.nodes.values()].find(q=>q!==n&&q.task?.act==='campfire');if(mate){setTimeout(()=>{IW.Act.say(mate,'可以分我一口嗎？',2.2,true);mate.s.hearts(1)},1200)}}}});
 wrap(A.campfire,'cleanup',(o,n)=>{o&&o(n);n.task?.roast?.remove()});
 // 園藝：Lv2 種花、Lv3 發現品種
 wrap(A.garden,'arrive',(o,n,task)=>{o(n,task);const l=lv(n.id,'garden');if(l>=3&&Math.random()<.35){const c=IW.ctx(),pool=SPEC.flower.list.filter(f=>!found('flower',f[0])&&(!f[4]||(f[4]==='rain'?c.rain:c.night)));if(pool.length)setTimeout(()=>{const f=pool[Math.floor(Math.random()*pool.length)];if(discover('flower',f[0],n))IW.Act.say(n,`咦，開了一朵${f[1]}！`,2.8,true)},2500)}
  if(l>=2&&n.x<.05&&Math.random()<.7)setTimeout(()=>plantFlower(n),3500)});
 // 創意：Lv2 在地上畫畫、Lv3 收進圖鑑
 wrap(A.daydream,'arrive',(o,n,task)=>{o(n,task);const l=lv(n.id,'art');if(l>=2&&Math.random()<.6)setTimeout(()=>sandArt(n,l>=3),2000)});
 // 運動：Lv3 開心時翻跟斗
 const QA=L.QA;QA.flip=s=>{try{L.an(s,[{rotate:'0deg',translate:'0 0'},{rotate:'-180deg',translate:'0 -26px',offset:.5},{rotate:'-360deg',translate:'0 0'}],700,'cubic-bezier(.4,0,.3,1)')}catch(_){}};
}
function wrap(obj,k,f){const o=obj[k]?.bind(obj);obj[k]=function(...a){return f(o,...a)}}
const SECRET={cove:{x:1.47,y:1.06,name:'秘密小海灣'},hill:{x:-.54,y:.6,name:'星空山丘'}};
const COVE='<svg viewBox="0 0 80 40"><ellipse cx="40" cy="26" rx="36" ry="12" fill="#BCE6EF"/><ellipse cx="40" cy="26" rx="28" ry="8" fill="#7FCFDF"/><path d="M26 24Q30 20 34 24M46 28Q50 24 54 28" stroke="#fff" stroke-width="1.6" fill="none"/><circle cx="58" cy="20" r="3" fill="#EC7878"/><path d="M56 18L54 15M60 18L62 15" stroke="#EC7878" stroke-width="1.2"/><path d="M14 26L8 34M66 26L72 34" stroke="#C3BCA9" stroke-width="6" stroke-linecap="round"/></svg>';
const HILL='<svg viewBox="0 0 60 60"><path d="M4 56Q30 20 56 56Z" fill="#8FCB6C"/><path d="M30 56V26" stroke="#8A6648" stroke-width="2.4"/><path d="M30 26L44 20L42 30Z" fill="#FFD54A"/><circle cx="22" cy="44" r="2" fill="#F5A3B5"/><circle cx="38" cy="48" r="2" fill="#FFF8EE"/></svg>';
function placeSecretProps(){const PR=IW.PROPS,P_=IW.props;for(const k of Object.keys(G().secret)){if(P_['sec_'+k])continue;const s=SECRET[k];PR.push({id:'sec_'+k,x:s.x,y:s.y,w:k==='cove'?.2:.12,h:k==='cove'?.1:.12,obs:null,html:()=>k==='cove'?COVE:HILL});P_['sec_'+k]=PR.at(-1)}IW.buildProps()}
function findSecret(n){const g=G(),left=Object.keys(SECRET).filter(k=>!g.secret[k]);if(!left.length)return false;const k=left.sort((a,b)=>Math.hypot(SECRET[a].x-n.x,SECRET[a].y-n.y)-Math.hypot(SECRET[b].x-n.x,SECRET[b].y-n.y))[0];
 g.secret[k]={t:Date.now(),by:n.id};placeSecretProps();discover('place',k,n,true);IW.Act.say(n,pick(['咦？這裡有一條沒走過的小路……','哇！發現了一個秘密地方！']),3.2,true);celebrate(n);journal(n,'event',`發現了秘密地點「${SECRET[k].name}」`,'secret:'+k);
 UI()?.unlock({k:'secret',title:'發現秘密地點！',name:SECRET[k].name,sub:n.s.ch.name.split(' ')[0]+'找到的',art:specArt('place',SPEC.place.list.find(z=>z[0]===k))});if(Object.keys(g.secret).length>=2)hiddenDone('secret',n);save();return true}
function findShell(n){const pool=SPEC.shell.list;let tot=pool.reduce((s,z)=>s+z[3],0),r=Math.random()*tot,sp=pool[0];for(const z of pool){r-=z[3];if(r<=0){sp=z;break}}const isNew=discover('shell',sp[0],n);L.X(n.id).log.collect++;IW.Act.say(n,isNew?`撿到了${sp[1]}！是新的耶！`:`又撿到一個${sp[1]}。`,2.6,true);gain(n,'explore',2);gain(n,'sea',2)}
function catchFish(n){const c=IW.ctx(),pool=SPEC.fish.list.filter(f=>!f[4]||(f[4]==='night'&&c.night));const bonus=lv(n.id,'sea')>=4?1.8:1;let tot=pool.reduce((s,z)=>s+(z[3]<.3?z[3]*bonus:z[3]),0),r=Math.random()*tot,sp=pool[0];for(const z of pool){r-=(z[3]<.3?z[3]*bonus:z[3]);if(r<=0){sp=z;break}}
 IW.fishJump(n.x*IW.W,(1.21)*IW.H);const isNew=discover('fish',sp[0],n);IW.Act.say(n,isNew?`釣到${sp[1]}了！第一次看到！`:pick([`是${sp[1]}！放牠回家吧～`,`又是${sp[1]}，你好呀。`]),2.8,true);L.emit(n,'happy');gain(n,'sea',4);journal(n,'catch',`在碼頭釣到${sp[1]}`,'catch:'+sp[0])}
function plantFlower(n){const g=G();if(g.flowers.length>=40)return;const known=Object.keys(g.codex.x.flower||{}),sp=SPEC.flower.list.find(f=>f[0]===pick(known.length?known:['daisy','tulip','cosmos']))||SPEC.flower.list[0];const f={x:+(n.x+n.s.dir*.03).toFixed(3),y:+(n.y+.012).toFixed(3),k:sp[0],by:n.id,t:Date.now()};g.flowers.push(f);renderFlower(f,true);IW.Act.say(n,`種下了一朵${sp[1]}～`,2.4);gain(n,'garden',2);save()}
function renderFlower(f,pop){const G_=window.IsleGround;if(!G_)return;const sp=SPEC.flower.list.find(z=>z[0]===f.k)||SPEC.flower.list[0],p=G_.PC(f.x,f.y),d=document.createElement('div');d.className='isle-d l30-fl'+(lv(f.by,'garden')>=4?' big':'');d.style.cssText=`left:${p.l}%;top:${p.t}%`;d.innerHTML=specArt('flower',sp);G_.g.append(d);if(pop&&d.animate)d.animate([{transform:'scale(0)'},{transform:'scale(1.2)'},{transform:'scale(1)'}],{duration:600,easing:'cubic-bezier(.3,1.6,.5,1)'})}
function sandArt(n,codex){const sp=pick(SPEC.art.list),d=document.createElement('i');d.className='l30-sand';d.innerHTML=specArt('art',sp);C.world.append(d);d.style.left=((n.x+n.s.dir*.05)*IW.W)+'px';d.style.top=((n.y+.01)*IW.H)+'px';d.style.zIndex=String(Math.round(n.y*10000)*16-3);setTimeout(()=>{d.style.opacity='0';setTimeout(()=>d.remove(),1500)},25000);
 IW.Act.say(n,pick([`畫了一個${sp[1]}～`,`你看，是${sp[1]}！`]),2.4);gain(n,'art',2);if(codex)discover('art',sp[0],n)}

/* ---------- 13. 特殊事件與連續事件 ---------- */
function showRainbow(sec=45){const a=Home.stage.root.querySelector('.isle-air');if(!a||a.querySelector('.l30-rainbow'))return;const r=document.createElement('i');r.className='l30-rainbow';a.append(r);r.animate([{opacity:0},{opacity:.85,offset:.1},{opacity:.85,offset:.85},{opacity:0}],{duration:sec*1000,fill:'forwards'}).onfinish=()=>r.remove()}
function meteorShower(){for(let i=0;i<12;i++)setTimeout(()=>IW.shootingStar(),i*450+rnd(0,300))}
let starLock=false;
function onStar(){if(starLock)return;starLock=true;setTimeout(()=>starLock=false,3000);const gz=[...C.nodes.values()].filter(n=>n.task?.act==='stargaze');if(!gz.length)return;const n=gz[0];discover('event','shooting',n);hiddenDone('wish',n);gz.forEach(q=>{first(q,'shooting','第一次看到流星，偷偷許了願','shooting');gain(q,'art',2)});try{Econ.on('event',{},true)}catch(_){}}
function eventsTick(){const c=IW.ctx(),g=G(),now=Date.now(),h=new Date().getHours();
 if(h>=1&&h<4&&C.active())hiddenDone('night');
 if(c.night&&c.clear){const gz=[...C.nodes.values()].filter(n=>n.task?.act==='stargaze'||n.task?.act==='secret');const night=dayKey();if(gz.length&&g.ev.meteor!==night&&Math.random()<.04*(gz.some(n=>L.has(n.s.ch,'stargazer')||lv(n.id,'art')>=3)?2:1)){g.ev.meteor=night;meteorShower();discover('event','meteor',gz[0]);gz.forEach(n=>{IW.Act.say(n,'是流星雨！好多好多！',3,true);journal(n,'event','和大家一起看到流星雨','meteor');L.feel(n,'excited',.9,90)});save()}}
 const fire=[...C.nodes.values()].filter(n=>n.task?.act==='campfire'&&n.task.arrived);if(fire.length>=3&&g.ev.party!==dayKey()){g.ev.party=dayKey();discover('event','campparty',fire[0]);hiddenDone('campparty',fire[0]);moment('party',fire[0]);fire.forEach(n=>{L.notesFx(n.s,3);n.s.hearts(2);journal(n,'event','營火晚會：大家圍著營火唱歌','campparty')});IW.Act.say(fire[0],'今晚來開營火晚會吧！',3,true);save()}
 if(c.night&&!c.rain&&Math.random()<.05){const m=[...C.nodes.values()].find(n=>n.x<-.05&&n.y<.88);if(m&&!found('event','firefly')){discover('event','firefly',m);IW.Act.say(m,'哇……好多螢火蟲！',3,true);journal(m,'event','在花海看到滿天的螢火蟲')}}
 if(c.wx==='snow'&&!found('event','firstsnow')){const m=[...C.nodes.values()][0];if(m){discover('event','firstsnow',m);IW.Act.say(m,'下雪了！是今年的初雪！',3,true)}}
 // 瓶中信：第一天撿到，隔天寫回信，再隔天收到回音
 const b=g.ev.bottle;if(b&&b.st===1&&dayKey()!==b.d){const w=[...C.nodes.values()].sort((x,y)=>lv(y.id,'social')-lv(x.id,'social'))[0];if(w){b.st=2;b.d=dayKey();b.w=w.id;journal(w,'event','寫了一封回信，放進瓶子丟回大海','bottle');IW.Act.say(w,'我寫好回信了，希望對方收得到～',3,true);save()}}
 else if(b&&b.st===2&&dayKey()!==b.d){const w=C.nodes.get(b.w)||[...C.nodes.values()][0];if(w){b.st=3;b.d=dayKey();discover('event','bottle',w);hiddenDone('bottle',w);giveMM('letter','mm_bottle');journal(w,'event','收到了遠方的回信！','bottle');IW.Act.say(w,'瓶子又漂回來了！是回信！',3.2,true);toast('收到了「遠方的信」','sparkle');save()}}
 // 失物招領：冒失的夥伴弄丟了東西
 if(g.ev.lost&&g.ev.lost.done&&g.ev.lost.d!==dayKey())delete g.ev.lost;const lo=g.ev.lost;if(!lo&&Math.random()<.004){const cand=[...C.nodes.values()].filter(n=>L.has(n.s.ch,'clumsy')||L.has(n.s.ch,'messy')||Math.random()<.15);const n=cand[0];if(n&&!C.busy(n)){const B=C.bounds(),x=rnd(B.left+.15,B.right-.15),y=rnd(.62,1.02);g.ev.lost={id:n.id,x,y,t:now,d:dayKey()};spawnLost();IW.Act.say(n,'糟糕……我的小髮夾不見了……',3.2,true);try{L.feel(n,'sad',.5,60)}catch(_){}journal(n,'event','弄丟了心愛的小髮夾');save()}}
 if(lo&&!lo.done){for(const n of C.nodes.values()){if(Math.hypot(n.x-lo.x,(n.y-lo.y)*2)<.06&&n.id!==lo.id){returnLost(n);break}}}}
function spawnLost(){const lo=G().ev.lost;if(!lo||lo.done||!C.world||C.world.querySelector('.l30-lost'))return;const b=document.createElement('button');b.className='l30-lost';b.type='button';b.setAttribute('aria-label','撿起掉落的東西');b.innerHTML='🎀';b.style.left=(lo.x*100)+'%';b.style.top=(lo.y*100)+'%';b.style.zIndex=String(Math.round(lo.y*10000)*16);b.addEventListener('pointerdown',e=>e.stopPropagation());b.onclick=e=>{e.stopPropagation();returnLost(null)};C.world.append(b)}
function returnLost(finder){const g=G(),lo=g.ev.lost;if(!lo||lo.done)return;lo.done=1;C.world.querySelector('.l30-lost')?.remove();const owner=C.nodes.get(lo.id);
 if(owner){if(finder){IW.Act.say(finder,'這是不是你的髮夾？我撿到了！',3,true);setTimeout(()=>{IW.Act.say(owner,'是我的！謝謝你！',3,true);L.emit(owner,'happy');const p=C.pair(owner.id,finder.id);p.score=Math.min(100,(p.score||0)+4)},1400);journal(finder,'event',`幫${owner.s.ch.name.split(' ')[0]}找到了小髮夾`)}
  else{IW.Act.say(owner,'你找到了！太好了，謝謝你！',3,true);L.emit(owner,'happy');try{Econ.pay('lost_'+lo.t,'event',20);toast('幫忙找到失物 +20 星幣','sparkle')}catch(_){}}journal(owner,'event','找回了心愛的小髮夾');discover('event','lost',owner)}save()}
function weatherEvents(){const c=IW.ctx();if(lastWx&&/rain|storm/.test(lastWx)&&!c.rain&&c.day){showRainbow();const m=[...C.nodes.values()][0];if(m){discover('event','rainbow',m);hiddenDone('rainbow',m);for(const n of C.nodes.values()){const ch=n.s.ch;if(L.has(ch,'romantic')||L.has(ch,'optimist')||L.has(ch,'dreamer'))IW.Act.say(n,pick(['是彩虹！好漂亮……','雨停了，彩虹出來了！']),3,true)}}}lastWx=c.wx}
let lastWx='';

/* ---------- 14. 對話與決策的掛勾 ---------- */
window.L30Topic=(A,B,e)=>{const g=P(A.id).goals.filter(z=>z.st==='active')[0],l=SK.map(s=>[s,lv(A.id,s[0])]).sort((a,b)=>b[1]-a[1])[0];const bn=B.s.ch.name.split(' ')[0];
 if(g&&Math.random()<.6){e.kind2='shared';return [[`我最近想${g.t}！`,pick(['聽起來很棒耶！','加油，我幫你！','真的嗎？好厲害！']),g.p>0?`已經完成 ${g.p}/${g.n} 了～`:'你也要一起嗎？'],'聊到自己的目標',`${A.s.ch.name.split(' ')[0]}跟${bn}說了自己的目標。`]}
 if(l&&l[1]>=2){const s=l[0];const T={read:['我最近讀了一本好有趣的書！','是什麼樣的故事？','下次借你看！'],cook:['我學會烤棉花糖了！','真的嗎？我也想吃！','下次營火時烤給你～'],garden:['花海又開了新的花喔。','我也想去看看！','一起去澆水吧。'],explore:['我發現島上有好多沒去過的地方。','帶我去看看嘛！','下次一起去探險！'],social:['跟大家聊天真開心。','對呀，你最會聊天了。','嘿嘿，謝謝～'],sport:['我剛剛跑得超快的！','我們來比賽！','好，誰怕誰！'],sea:['今天在碼頭看到好多魚。','有大的嗎？','有一條超大的！'],art:['我在沙灘上畫了一幅畫。','畫了什麼？','是秘密～去看就知道了。']}[s[0]];return [T,`聊到${s[1]}`,`${A.s.ch.name.split(' ')[0]}跟${bn}分享了${s[1]}的心得。`]}return null};
window.L30Score=(n,S,c,nd)=>{for(const k in S){const m=goalMul(n,k);if(m!==1)S[k]*=m}
 for(const s of SK){const l=lv(n.id,s[0]);if(l>1)for(const a of s[3])if(S[a])S[a]*=1+(l-1)*.05}
 const x=P(n.id);if(lv(n.id,'cook')>=3&&C.nodes.size>1){const today=Object.values(x.cnt.treated||{}).some(t=>Date.now()-t<3*3600e3);if(!today)S.treat=.35+(L.has(n.s.ch,'cook')||L.has(n.s.ch,'caring')?.6:0)}
 if(Object.keys(G().secret).length)S.secret=.25+(L.has(n.s.ch,'curious')?.4:0)};
window.L30Disc=n=>SK.map(s=>({id:'sk_'+s[0],kind:'trait',trait:s[5],p:()=>[lv(n.id,s[0]),5],why:`把${s[1]}練到了最高等級，越來越有這方面的天分`})).filter(d=>!L.has(n.s.ch,d.trait));
function treatStart(n){const f=[...C.nodes.values()].filter(q=>q!==n&&!C.busy(q)&&!q.task?.event).sort((a,b)=>(P(n.id).cnt.treated?.[a.id]?1:0)-(P(n.id).cnt.treated?.[b.id]?1:0))[0];if(!f)return false;const s=C.nearest(f.x+(n.x<f.x?-.08:.08),f.y,n,undefined,true);return s&&IW.Act.start(n,'treat',{spot:s,data:{mate:f}})}

/* ---------- 15. 接上既有系統的事件 ---------- */
function hookAll(){
 const A=IW.Act,oa=A.arrive.bind(A);A.arrive=function(n,task){const r=oa(n,task);try{const k=task.act,amt=['wander','idle'].includes(k)?1.5:6;for(const s of SK)if(s[3].includes(k))gain(n,s[0],amt);bus('act',n,{k});
   if(k==='read')try{Econ.on('read',{},true)}catch(_){}if(k==='garden')try{Econ.on('garden',{},true)}catch(_){}
   const pl=L29.PLACE[k];if(pl){bus('place',n,{place:pl});if(!found('place',pl))discover('place',pl,n,true);first(n,'p_'+pl,`第一次去${SPOT[pl]||pl}`)}
   if(first(n,'a_'+k,`第一次${L29.ACTN2[k]||k}`)){}
   if(k==='explore'){const l=lv(n.id,'explore');if(l>=3&&Math.random()<.35)setTimeout(()=>findSecret(n),1500);if(l>=2&&n.s===Home.stage)try{Econ.maybeFind('spot',.25)}catch(_){}if(n.y>.98&&(L.has(n.s.ch,'collector')||l>=2)&&Math.random()<.35)setTimeout(()=>findShell(n),2200);
    if(!G().ev.bottle&&n.y>.98&&Math.random()<.12){G().ev.bottle={st:1,d:dayKey(),by:n.id};IW.Act.say(n,'海邊漂來一個瓶子，裡面有一封信！',3.2,true);journal(n,'event','在海邊撿到一個瓶中信：「你好，我住在遠方的島上……」','bottle');save()}}
   if(k==='fish'&&lv(n.id,'sea')>=3)task.catchT=rnd(5,9);if(k==='dance'){const d=[...C.nodes.values()].filter(q=>q.task?.act==='dance').length;if(d>=3)hiddenDone('trio',n)}
   if(k==='tag'&&lv(n.id,'sport')>=3&&Math.random()<.5)setTimeout(()=>L.QA.flip(n.s),300);if((k==='sunset'||k==='stargaze'))try{Econ.on('view',{},true)}catch(_){}}catch(e){console.warn(e)}return r};
 const ot=A.tick.bind(A);A.tick=function(n,dt,task){const r=ot(n,dt,task);try{if(task.act==='fish'&&task.catchT!=null){task.catchT-=dt;if(task.catchT<=0){task.catchT=rnd(8,13);if(Math.random()<.4+lv(n.id,'sea')*.05)catchFish(n)}}}catch(_){}return r};
 document.addEventListener('l29:memo',e=>{const {n,type,o}=e.detail||{};if(!n)return;if(type==='collect'){findShell(n)}if(type==='observe')gain(n,'explore',3)});
 document.addEventListener('oc:fed',e=>{const d=e.detail||{},n=C.nodes.get(d.charId),it=Items.get(d.itemId);if(!it)return;const cx=G().codex;cx.use[it.id]=(cx.use[it.id]|0)+1;if(!n)return;
  if(first(n,'f_'+it.id,`第一次吃${it.name}`))bus('food_new',n,{item:it.id});bus('feed',n,{item:it.id});reqDone(n,it.cat==='drink'?'drink':'food');reqDone(n,'buy',{item:it.id});save()});
 const iu=Items.use;Items.use=function(id,st){const it=this.get(id),r=iu.apply(this,arguments);try{if(r&&it){const cx=G().codex;cx.use[it.id]=(cx.use[it.id]|0)+1;const n=st&&st._communityNode;if(n){if(it.cat==='toy')reqDone(n,'toy');if(it.cat==='gift')reqDone(n,'gift');reqDone(n,'buy',{item:it.id})}save()}}catch(_){}return r};
 const op=Stage.prototype.pet;Stage.prototype.pet=function(){const r=op.apply(this,arguments);try{const n=this._communityNode;if(n)reqDone(n,'pet')}catch(_){}return r};
 const ob=Econ.buyN;Econ.buyN=function(pid,q,from){const r=ob.apply(this,arguments);try{if(r&&r.ok){Econ.on('shop',{},true);bus('shop',null,{});const p=Cat.prod(pid);G().codex.own[p.itemId]=G().codex.own[p.itemId]||Date.now();
   for(const n of C.nodes.values()){const rq=P(n.id).req;if(rq&&rq.k==='buy'&&rq.item===p.itemId&&['wear','acc','furn'].includes(Items.get(p.itemId)?.cat))reqDone(n,'buy',{item:p.itemId})}save()}}catch(_){}return r};
 const sd=Shop.detail;Shop.detail=function(pid){try{const p=Cat.prod(pid);if(p){const cx=G().codex;if(!cx.seen[p.itemId]){cx.seen[p.itemId]=Date.now();save()}}}catch(_){}return sd.apply(this,arguments)};
 const of=C.finishEvent.bind(C);C.finishEvent=function(e){const done=e.done;const r=of(e);if(done)return r;try{const [a,b]=e.nodes;try{Econ.on('chat',{},true)}catch(_){}
   [a,b].forEach((n,i)=>{const o=i?a:b;bus('chat',n,{with:o.id});gain(n,'social',5);const p=C.pair(a.id,b.id);if(p.score>=12)if(first(n,'fr_'+o.id,`和${o.s.ch.name.split(' ')[0]}變成了朋友`))moment('friend',n);if(p.score>=32&&first(n,'bf_'+o.id,`和${o.s.ch.name.split(' ')[0]}成為好朋友`))moment('best',n)});
   if(e.kind==='squabble'){const med=[...C.nodes.values()].find(q=>q!==a&&q!==b&&!C.busy(q)&&!q.task&&lv(q.id,'social')>=3);if(med)setTimeout(()=>{if(C.busy(a)||C.busy(b)||a.task||b.task)return;IW.Act.say(med,'你們兩個，要不要好好聊聊？',3,true);setTimeout(()=>{if(C.encounter(a,b,'reconcile')){journal(med,'event',`幫${a.s.ch.name.split(' ')[0]}和${b.s.ch.name.split(' ')[0]}和好`);gain(med,'social',6)}},1800)},14000)}}catch(err){}return r};
 const oaa=L.accept;L.accept=function(n,d){const r=oaa.apply(this,arguments);try{journal(n,'habit',`養成了${d.kind==='trait'?'「'+(L.traitInfo(d.trait)?.t||'')+'」特質':'「'+(d.name||d.item)+'」'}`);moment('habit',n)}catch(_){}return r};
 const sp=L.speed;L.speed=function(n){return sp.call(this,n)*(1+.04*(lv(n.id,'sport')-1))};
 const ri=L.ringItems;L.ringItems=function(n){const a=ri.call(this,n);if(G().acts.flip||lv(n.id,'sport')>=3)a.push(['flip','翻跟斗','<span style="font-size:15px">🤸</span>','#EC7878',nn=>{C.interrupt(nn);L.QA.flip(nn.s);setTimeout(()=>{L.sparkFx(nn.s,6,30);IW.Act.say(nn,'看我的！',2,true)},350)}]);
  if(lv(n.id,'cook')>=3)a.push(['treat','做點心','<span style="font-size:15px">🍪</span>','#F4A65B',nn=>{C.interrupt(nn);if(!treatStart(nn))toast('附近沒有可以送點心的夥伴','info')}]);return a};
 IW.ACTS.treat.spot=(n,o)=>o.spot;const oStart=IW.Act.start.bind(IW.Act);IW.Act.start=function(n,id,o={}){if(id==='treat'&&!o.spot)return treatStart(n);return oStart(n,id,o)};
 // 首頁任務卡的「可領取」也要包含新任務
 const ar=Eco.anyReady;Eco.anyReady=()=>ar()||myReady();
 const qt=HUD.questTap;HUD.questTap=function(){if(!ar()&&myReady()){buzz(8);openQuests(myReadyTab());return}return qt.apply(this,arguments)};
}
function myReady(){const w=weekly(),g=G();return w.q.some(q=>q.p>=q.n&&!q.c)||(!w.b&&w.q.every(q=>q.c))||LQ.some((q,i)=>!g.lq[q.id]&&(i===0||g.lq[LQ[i-1].id])&&q.ok())||Object.values(g.hq).some(h=>!h.c)}
function myReadyTab(){const w=weekly(),g=G();if(w.q.some(q=>q.p>=q.n&&!q.c)||(!w.b&&w.q.every(q=>q.c)))return 4;if(LQ.some((q,i)=>!g.lq[q.id]&&(i===0||g.lq[LQ[i-1].id])&&q.ok()))return 6;return 7}

/* ---------- 16. 迴圈與啟動 ---------- */
let acc=0,acc2=0;const UI=()=>window.L30UI;
function post(dt){if(!C.active())return;acc+=dt;acc2+=dt;
 if(acc>5){acc=0;for(const n of C.nodes.values()){goalsTick(n);reqTick(n)}ownTick();try{absStats()}catch(_){}eventsTick();weatherEvents();spawnLost()}
 if(acc2>60){acc2=0;weekly()}}
const wait=setInterval(()=>{try{if(!(window.IsleLife&&window.IsleWorld?.ACTS?.read&&window.OCSCommunity?.ready&&window.Econ&&window.IsleGround&&Cat.d))return;clearInterval(wait);L=IsleLife;IW=IsleWorld;C=OCSCommunity;
 G();for(const ch of Chars.list)P(ch.id);installMM();defineActs();hookAll();patchJobs();patchAch();weekly();placeSecretProps();G().flowers.forEach(f=>renderFlower(f));
 document.addEventListener('isle:star',onStar);
 const up=C.update;C.update=function(d){const r=up.apply(this,arguments);try{post(Math.min(.05,d||.016))}catch(e){console.warn('[l30]',e)}return r};
 window.L30={G,P,SK,SKM,XPL,UNL,lv,lvOf,gain,SPEC,HOW,found,discover,specArt,codexCount,codexPct,itemsFor,itemFound,ICAT,MM,MMID,GT,goalAction,complete,makeGoal,reqText,RQ,reqDone,weekly,claimWeekly,claimWeeklyBonus,LQ,claimLong,HQ,claimHidden,journal,SPOT,SECRET,showRainbow,meteorShower,celebrate,findSecret,catchFish,totalLv,myReady,myReadyTab,save,absVal};
 document.dispatchEvent(new CustomEvent('l30:ready'))}catch(e){console.error('[l30]',e);clearInterval(wait)}},200);
})();
/* ===== 3.0 介面：探索頁整合、任務面板擴充、收藏圖鑑、生活日誌、技能、目標、解鎖動畫 ===== */
(()=>{'use strict';
const X=()=>window.L30,LL=()=>window.IsleLife,reduce=()=>document.documentElement.dataset.motion==='reduce';
const I=n=>Math.max(0,Math.floor(+n)||0),esc2=s=>esc(String(s??''));
const nm=c=>c.name.split(' ')[0];
const TL={fav:'最愛',love:'超喜歡',like:'喜歡',meh:'普通',ok:'普通',dislike:'不喜歡',hate:'討厭',worst:'最討厭'},TC={fav:'#EC7878',love:'#EC7878',like:'#F4A65B',meh:'#A99A88',ok:'#A99A88',dislike:'#5DB3E0',hate:'#9585DD',worst:'#9585DD'};

/* ---------- 解鎖動畫（排隊播放，不互相蓋住） ---------- */
const Q=[];let busy=false;
function unlock(o){Q.push(o);if(Q.length>4)Q.splice(0,Q.length-4);if(!busy)next()}
function next(){const o=Q.shift();if(!o){busy=false;return}busy=true;buzz([10,40,14]);
 const d=document.createElement('div');d.className='l30-unlock k-'+(o.k||'x');d.setAttribute('role','status');
 d.innerHTML=`<i class="ul-ray"></i><span class="ul-art">${o.art||''}</span><div class="ul-b"><small>${esc2(o.title)}</small><b>${esc2(o.name)}</b>${o.sub?`<em>${esc2(o.sub)}</em>`:''}</div>`;document.body.append(d);
 if(!reduce()){d.animate([{opacity:0,transform:'translate(-50%,-24px) scale(.7)'},{opacity:1,transform:'translate(-50%,0) scale(1.04)',offset:.6},{opacity:1,transform:'translate(-50%,0) scale(1)'}],{duration:520,easing:'cubic-bezier(.2,1.3,.35,1)',fill:'both'});
  for(let i=0;i<14;i++){const c=document.createElement('i');c.className='ul-cf';c.style.setProperty('--h',['#FFE27A','#F5A3B5','#7EC8E3','#93C65B','#C7B5EC'][i%5]);d.append(c);const a=i/14*Math.PI*2;c.animate([{transform:'translate(0,0) scale(.3)',opacity:1},{transform:`translate(${Math.cos(a)*120}px,${Math.sin(a)*70+20}px) rotate(${i*50}deg) scale(1)`,opacity:0}],{duration:1100,delay:180,easing:'cubic-bezier(.2,.8,.3,1)',fill:'both'})}}
 const close=()=>{if(!d.isConnected)return;if(reduce()){d.remove();setTimeout(next,80);return}d.animate([{opacity:1,transform:'translate(-50%,0) scale(1)'},{opacity:0,transform:'translate(-50%,-14px) scale(.9)'}],{duration:220,easing:'ease-in',fill:'forwards'}).onfinish=()=>{d.remove();setTimeout(next,120)}};
 d.addEventListener('click',close);setTimeout(close,2900)}

/* ---------- 共用列 ---------- */
const row=(icon,t,p,n,sub,btn,cls='')=>`<div class="qrow ${cls} ${btn==='done'?'done':''}"><span class="qi">${icon}</span><div class="qt"><b>${t}</b>${n?`<div class="bar q"><i style="transform:scaleX(${Math.max(.04,Math.min(1,p/n))})"></i></div>`:''}<small>${sub}</small></div>${btn==='done'?'<span class="tag">已領取</span>':btn||''}</div>`;
const cbtn=(attr,ok,label='領取')=>`<button class="btn primary qb" ${attr} ${ok?'':'disabled'}>${label}</button>`;

/* ---------- 任務面板（擴充既有：今日／心願／探索／成就 + 本週／請求／長期／隱藏） ---------- */
const TABN=['今日委託','心願','探索','成就','本週','請求','長期','隱藏'],ORDER=[0,4,5,1,6,7,2,3];
window.openQuests=function(tab=0){const s=openSheet('<div class="sh-body" id="qBody"></div>',{onClose:()=>{Econ.redraw=null}}),B=s.el.querySelector('#qBody');
 const draw=()=>{const L=X();Econ.sync();const e=Econ.s,ch=Chars.active(),ready=i=>{if(!L)return false;const w=L.weekly(),g=L.G();if(i===4)return w.q.some(q=>q.p>=q.n&&!q.c)||(!w.b&&w.q.every(q=>q.c));if(i===6)return L.LQ.some((q,k)=>!g.lq[q.id]&&(k===0||g.lq[L.LQ[k-1].id])&&q.ok());if(i===7)return Object.values(g.hq).some(h=>!h.c);if(i===0)return QUESTS.some(q=>Eco.ready(q));if(i===3)return (window.OCS_AC||[]).some(a=>Econ.achReady(a));if(i===5)return [...OCSCommunity.nodes.values()].some(n=>L.P(n.id).req);return false};
  const sub=`每天 0 點刷新・已連續登入 ${I(Eco.v.streak)} 天${L?`・本週 ${L.weekly().k}`:''}`;let h='';
  if(tab===0)h+=QUESTS.map(q=>{const p=Eco.prog(q),d=Eco.v.q.done[q.id],rd=Eco.ready(q);return row(ic(q.ic),q.t,p,q.n,`${p} / ${q.n}・獎勵 ${q.r} 星幣${q.id==='jb'?'＋草莓蛋糕':''}`,d?'done':cbtn(`data-job="${q.id}"`,rd))}).join('')+'<p class="q-sub">委託會依夥伴們的生活每天變化，不需要每天都完成。</p>';
  else if(tab===1){const L0=ch&&e.life[ch.id],w=L0&&L0.w&&Items.get(L0.w.item);h+=ch?(w?row(`<span style="font-size:22px">${Items.icon(w)}</span>`,`${esc2(ch.name)}想吃「${esc2(w.name)}」`,0,0,'餵牠吃到就自動獲得 70 星幣與親密度（可在商店購買）',''):row(ic('heart'),'目前沒有心願',0,0,'稍後夥伴會想起新的心願','')):'';
   if(L){for(const n of OCSCommunity.nodes.values()){const ww=LL().X(n.id).wish;if(ww)h+=row(`<span class="l30-av">${artHTML(n.s.ch)}</span>`,`${esc2(nm(n.s.ch))}：${esc2(LL().wishLabel(ww))}`,0,0,'可以幫牠一把，也可以讓牠自己想辦法',`<button class="btn qb" data-wish="${n.id}">幫忙</button>`)}}}
  else if(tab===2)h+=row(ic('sparkle'),'家裡的小發現',I(e.cap.find),6,`今日 ${I(e.cap.find)} / 6・現在地上有 ${e.finds.length} 個`,'')+'<p class="q-sub">夥伴探索、使用家具或被澆水時，可能留下閃閃發亮的發現物，點一下就能撿起。20 分鐘後會消失。</p>';
  else if(tab===3){const AC=window.OCS_AC||[];h+=AC.map(a=>{const c=I(e.ach[a.id]),t=a.tiers[c],cur=I(e.stat[a.id]);return row(ic('sparkle'),a.t,t?cur:1,t?t[0]:1,t?`${Math.min(cur,t[0])} / ${t[0]}・獎勵 ${t[1]} 星幣（${c+1}/${a.tiers.length}）`:'已全部完成',t?cbtn(`data-ach="${a.id}"`,Econ.achReady(a)):'done')}).join('')}
  else if(tab===4&&L){const w=L.weekly();h+=w.q.map(q=>row(ic('cal'),q.t,q.p,q.n,`${Math.min(q.p,q.n)} / ${q.n}・獎勵 ${q.r} 星幣`,q.c?'done':cbtn(`data-wk="${q.k}"`,q.p>=q.n))).join('')+row(ic('gift'),'本週全部完成',w.q.filter(q=>q.c).length,w.q.length,'獎勵 100 星幣＋手作餅乾禮盒',w.b?'done':cbtn('data-wkb',w.q.every(q=>q.c)))+'<p class="q-sub">每週一換新，錯過也沒關係，下週還有新的任務。</p>'}
  else if(tab===5&&L){const list=[...OCSCommunity.nodes.values()].filter(n=>L.P(n.id).req);h+=list.length?list.map(n=>{const r=L.P(n.id).req;return row(`<span class="l30-av">${artHTML(n.s.ch)}</span>`,`${esc2(nm(n.s.ch))}：「${esc2(L.reqText(r))}」`,0,0,L.RQ[r.k].how+'・完成可得 15～25 星幣',r.k==='go'?`<button class="btn primary qb" data-go2="${n.id}">好啊</button>`:r.k==='buy'?`<button class="btn qb" data-shop="${r.pid||''}">去商店</button>`:'')}).join(''):'<div class="l30-empty"><span>💌</span><b>現在沒有請求</b><small>夥伴有需要的時候會主動來找你，每天最多 3 次。</small></div>'}
  else if(tab===6&&L){const g=L.G();h+=L.LQ.map((q,i)=>{const open=i===0||g.lq[L.LQ[i-1].id],done=g.lq[q.id],ok=q.ok();return row(`<span class="qi-n">${i+1}</span>`,open?`第 ${i+1} 章・${q.t}`:`第 ${i+1} 章・？？？`,done||ok?1:0,open?1:0,open?`${q.d}・獎勵 ${q.r} 星幣${q.title?'・稱號「'+q.title+'」':''}${q.mm?'・紀念品':''}`:'完成上一章後解鎖',done?'done':open?cbtn(`data-lq="${q.id}"`,ok):'',open?'':'locked')}).join('')}
  else if(tab===7&&L){const g=L.G(),cnt=Object.keys(g.hq).length;h+=`<p class="q-sub">已發現 ${cnt} / ${L.HQ.length} 個隱藏任務。條件不會事先告訴你，在生活中慢慢發現吧。</p>`+L.HQ.map(([id,t,d,r])=>{const s=g.hq[id];return s?row('<span class="qi-n">🔮</span>',t,0,0,`${d}・獎勵 ${r} 星幣`,s.c?'done':cbtn(`data-hq="${id}"`,true)):row('<span class="qi-n">？</span>','？？？',0,0,'還沒有發現','','locked')}).join('')}
  /* 3.2：標題與分頁只建立一次；切換分類或資料更新時只替換清單，而且內容沒變就不重畫（避免整頁閃爍） */
  if(!B._built){B._built=1;B.innerHTML=`<div class="sh-title">任務與收入</div><p class="q-sub" data-qs></p><div class="bg-chips l30-qtabs">${ORDER.map(i=>`<button class="chip" data-t="${i}">${TABN[i]}<i class="dot" hidden></i></button>`).join('')}</div><div class="l30-ql" data-ql></div>`}
  const qs=B.querySelector('[data-qs]');if(qs._t!==sub){qs.textContent=sub;qs._t=sub}
  B.querySelectorAll('.l30-qtabs [data-t]').forEach(c=>{const i=+c.dataset.t,on=i===tab;if(c.classList.contains('on')!==on)c.classList.toggle('on',on);const dt=c.querySelector('.dot'),rd=!!ready(i);if(dt.hidden===rd)dt.hidden=!rd});
  const ql=B.querySelector('[data-ql]'),sig=tab+'|'+h.replace(/(id="|href="#|url\(#)[^"')]+/g,'$1');
  if(ql._sig!==sig){const sw=ql._tab!==undefined&&ql._tab!==tab;ql._sig=sig;ql.innerHTML=h;
   if(sw){ql._tab=tab;const t=B.querySelector('.l30-qtabs .on');if(t){const bar=t.parentElement,x=t.offsetLeft-(bar.clientWidth-t.offsetWidth)/2;bar.scrollTo({left:x,behavior:'smooth'})}if(document.documentElement.dataset.motion!=='reduce')ql.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:200,easing:'ease-out'})}
   else if(ql._tab===undefined){ql._tab=tab;requestAnimationFrame(()=>{const t=B.querySelector('.l30-qtabs .on');if(t){const bar=t.parentElement;bar.scrollLeft=t.offsetLeft-(bar.clientWidth-t.offsetWidth)/2}})}}};
 B.addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b)return;const d=b.dataset,L=X();
  if(d.t){if(+d.t===tab)return;tab=+d.t;buzz(5);draw();return}if(d.job){Econ.claimJob(d.job)}else if(d.ach){Econ.claimAch(d.ach)}else if(d.wk){L.claimWeekly(d.wk)}else if(d.wkb!==undefined){L.claimWeeklyBonus()}else if(d.lq){L.claimLong(d.lq)}else if(d.hq){L.claimHidden(d.hq)}
  else if(d.wish){const n=OCSCommunity.nodes.get(d.wish);if(n&&LL().helpWish(n)){s.close();toast('出發去實現心願！','sparkle')}else toast('牠現在正在忙','info');return}
  else if(d.go2){const n=OCSCommunity.nodes.get(d.go2),r=n&&L.P(n.id).req;if(n&&r){OCSCommunity.interrupt(n);const act={dock:'fish',meadow:'flowers',bench:'sunset',tree:'shade',campfire:'campfire'}[r.place];if(IsleWorld.Act.start(n,act)){const chk=setInterval(()=>{if(n.task?.arrived){clearInterval(chk);L.reqDone(n,'go',{place:r.place})}else if(!n.task){clearInterval(chk)}},500);s.close();toast('一起出發！','sparkle')}}return}
  else if(d.shop!==undefined){s.close();setTimeout(()=>{Shop.open();if(d.shop)setTimeout(()=>Shop.detail(d.shop),400)},260);return}
  draw()});
 Econ.redraw=()=>{if(!s.closed)draw()};draw()};

/* ---------- 收藏圖鑑 ---------- */
const CDT=[['food','食物'],['drink','飲料'],['wear','服裝'],['acc','飾品'],['furn','家具'],['toy','玩具'],['gift','禮物'],['shell','貝殼'],['fish','魚'],['flower','花'],['art','沙灘畫'],['event','事件'],['place','地點'],['moment','回憶']];
function entries(cat){const L=X(),cx=L.G().codex;if(L.ICAT.includes(cat))return L.itemsFor(cat).map(it=>{const p=Cat.d.products.find(q=>q.itemId===it.id),mm=it.id.startsWith('builtin_mm_'),ok=L.itemFound(it);return {key:'i:'+it.id,cat,id:it.id,name:it.name,art:Items.icon(it),ok,own:I(it.qty)>0||!!cx.own[it.id],qty:I(it.qty),use:I(cx.use[it.id]),hidden:mm&&!ok,how:mm?'成就或任務的特別獎勵':p?`商店 ${Cat.price(p)} 星幣${window.OCSShop?.ROT?.has(it.id)?'（每日限定）':''}`:'特別取得',desc:it.desc,item:it,t:cx.own[it.id]||cx.seen[it.id]||0}});
 const S=L.SPEC[cat];return S.list.map(sp=>{const f=cx.x[cat]?.[sp[0]];const secret=sp[4]==='secret';return {key:cat+':'+sp[0],cat,id:sp[0],name:sp[1],art:L.specArt(cat,sp),ok:!!f,hidden:!f&&(secret||cat==='event'||cat==='moment'),how:L.HOW[cat],t:f?.t||0,by:f?.by,sp}})}
function codex(cat='food'){const L=X();let q='',flt='all';const s=openSheet('<div class="sh-body l30-cx" id="l30Cx"></div>',{cls:'l30-cxs'}),B=s.el.querySelector('#l30Cx');s.el.setAttribute('aria-label','收藏圖鑑');
 const draw=(keep)=>{const cnt=L.codexCount(),fav=L.G().codex.fav;let list=entries(cat);const all=list.length,have=list.filter(e=>e.ok).length;
  if(q)list=list.filter(e=>e.ok&&e.name.includes(q));if(flt==='own')list=list.filter(e=>e.own);if(flt==='ok')list=list.filter(e=>e.ok);if(flt==='no')list=list.filter(e=>!e.ok);if(flt==='fav')list=list.filter(e=>fav[e.key]);
  const sy=B.querySelector('.cx-grid')?.parentElement?.scrollTop;
  B.innerHTML=`<div class="cx-head"><div><small>收藏圖鑑</small><b>${cnt.have} / ${cnt.all}</b></div><div class="cx-ring" style="--p:${Math.round(cnt.have/Math.max(1,cnt.all)*100)}"><span>${Math.round(cnt.have/Math.max(1,cnt.all)*100)}%</span></div></div>
   <div class="cx-tabs">${CDT.map(([k,v])=>{const e=entries(k),h=e.filter(z=>z.ok).length;return `<button class="${k===cat?'on':''}" data-c="${k}"><b>${v}</b><small>${h}/${e.length}</small></button>`}).join('')}</div>
   <div class="cx-tools"><input class="inp" type="search" placeholder="搜尋已發現的收藏" value="${esc2(q)}" aria-label="搜尋收藏"><div class="chips">${[['all','全部'],['ok','已發現'],['own','已持有'],['no','未發現'],['fav','★ 收藏']].map(([k,v])=>`<button class="chip ${flt===k?'on':''}" data-f="${k}">${v}</button>`).join('')}</div></div>
   <div class="cx-prog"><i style="width:${Math.round(have/Math.max(1,all)*100)}%"></i><span>${CDT.find(c=>c[0]===cat)[1]}・${have} / ${all}</span></div>
   <div class="cx-wrap"><div class="cx-grid">${list.map((e,i)=>`<button class="cx-it ${e.ok?'':'no'} ${e.own?'own':''}" data-k="${esc2(e.key)}" style="--i:${Math.min(i,16)}"><span class="cx-art">${e.hidden?'<span class="l30-em">？</span>':e.art}</span><b>${e.ok?esc2(e.name):'？？？'}</b>${fav[e.key]?'<i class="cx-fav">★</i>':''}${e.qty?`<i class="cx-q">×${e.qty}</i>`:''}</button>`).join('')||'<div class="l30-empty"><span>🔍</span><b>沒有符合的收藏</b></div>'}</div></div>`;
  const inp=B.querySelector('input');inp.oninput=()=>{q=inp.value.trim();clearTimeout(inp._t);inp._t=setTimeout(()=>{draw(1);const i2=B.querySelector('input');i2.focus();i2.setSelectionRange(i2.value.length,i2.value.length)},200)};
  if(keep&&sy)B.querySelector('.cx-wrap').scrollTop=sy;B.querySelector('.cx-tabs .on')?.scrollIntoView({inline:'center',block:'nearest'})};
 B.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;buzz(5);if(d.c){cat=d.c;draw()}else if(d.f){flt=d.f;draw()}else if(d.k){const en=entries(cat).find(z=>z.key===d.k);if(en)detail(en,()=>draw(1))}});draw()}
function detail(en,onChange){const L=X(),fav=L.G().codex.fav;let foodRows='';
 if(en.ok&&en.item&&['food','drink'].includes(en.cat)){const rows=Chars.list.map(ch=>{let J=null;try{J=Taste.api.level(ch,en.item)}catch(_){}const n=I(LL().X(ch.id).log.food[en.id]);if(!J?.known&&!n)return `<div class="cf-r unk"><span class="l30-av">${artHTML(ch)}</span><b>${esc2(nm(ch))}</b><em>還沒吃過</em></div>`;return `<div class="cf-r"><span class="l30-av">${artHTML(ch)}</span><b>${esc2(nm(ch))}</b><em style="--c:${TC[J?.level]||'#A99A88'}">${TL[J?.level]||'吃過'}</em><small>${n?'吃過 '+n+' 次':''}</small></div>`}).join('');foodRows=`<div class="l29-h">夥伴們的反應</div><div class="cf-list">${rows}</div>`}
 const by=en.by&&Chars.byId(en.by);
 const s=openSheet(`<div class="sh-body l30-cd"><div class="cd-stage"><span class="cd-art">${en.hidden?'<span class="l30-em">？</span>':en.art}</span></div><div class="cd-meta"><span>${CDT.find(c=>c[0]===en.cat)[1]}</span>${en.own?'<span class="own">已持有</span>':''}${en.ok?'':'<span class="no">尚未發現</span>'}</div><h3>${en.ok?esc2(en.name):'？？？'}</h3>${en.ok&&en.desc?`<p>${esc2(en.desc)}</p>`:''}
  <div class="cd-grid">${en.qty!=null&&en.item?`<div><small>持有</small><b>${en.qty}</b></div><div><small>使用次數</small><b>${en.use||0}</b></div>`:''}<div><small>取得方式</small><b>${en.hidden&&!en.ok?'保持神秘…':esc2(en.how)}</b></div>${en.t?`<div><small>發現時間</small><b>${new Date(en.t).toLocaleDateString('zh-TW')}</b></div>`:''}${by?`<div><small>發現者</small><b>${esc2(nm(by))}</b></div>`:''}</div>
  ${foodRows}${en.ok?`<button class="btn wide ${fav[en.key]?'primary':''}" data-fav>${fav[en.key]?'★ 已收藏':'☆ 加入收藏'}</button>`:''}</div>`,{cls:'l30-cds'});
 s.el.addEventListener('click',e=>{if(e.target.closest('[data-fav]')){if(fav[en.key])delete fav[en.key];else fav[en.key]=Date.now();L.save();buzz(8);const b=s.el.querySelector('[data-fav]');b.classList.toggle('primary',!!fav[en.key]);b.textContent=fav[en.key]?'★ 已收藏':'☆ 加入收藏';onChange&&onChange()}})}

/* ---------- 生活日誌 ---------- */
const JIC={first:'✨',skill:'⭐',goal:'🎯',habit:'🌱',event:'🌈',codex:'📗',request:'💌',quest:'📜',ach:'🏆',read:'📚',catch:'🐟'};
function journalSheet(id){const L=X();let who=id||'all',kind='all';const s=openSheet('<div class="sh-body l30-jr" id="l30Jr"></div>',{cls:'l30-jrs'}),B=s.el.querySelector('#l30Jr');s.el.setAttribute('aria-label','生活日誌');
 const all=()=>{let out=[];for(const ch of Chars.list){if(who!=='all'&&who!==ch.id)continue;L.P(ch.id).jr.forEach(e=>out.push(Object.assign({ch},e)))}if(who==='all')L.G().jr.forEach(e=>out.push(e));
  for(const m of OCSCommunity.state().memories.slice(0,40)){if(who!=='all'&&!m.ids.includes(who))continue;out.push({t:m.t,k:'memory',txt:`${m.ids.map(i=>nm(Chars.byId(i)||{name:'夥伴'})).join('、')}：${m.title}`,shared:1})}
  if(kind!=='all')out=out.filter(e=>kind==='memory'?e.k==='memory':kind==='first'?e.k==='first':kind==='grow'?['skill','habit','goal'].includes(e.k):['event','codex','catch','quest','ach','request','read'].includes(e.k));return out.sort((a,b)=>b.t-a.t).slice(0,120)};
 const draw=()=>{const list=all();let last='',h=`<div class="sh-title">生活日誌</div><div class="chips jr-who"><button class="chip ${who==='all'?'on':''}" data-w="all">全部</button>${Chars.list.map(c=>`<button class="chip ${who===c.id?'on':''}" data-w="${c.id}">${esc2(nm(c))}</button>`).join('')}</div><div class="chips jr-k">${[['all','全部'],['first','第一次'],['grow','成長'],['event','發現與事件'],['memory','共同回憶']].map(([k,v])=>`<button class="chip ${kind===k?'on':''}" data-j="${k}">${v}</button>`).join('')}</div><div class="jr-list">`;
  for(const e of list){const d=new Date(e.t).toLocaleDateString('zh-TW',{month:'long',day:'numeric',weekday:'short'});if(d!==last){h+=`<div class="jr-d">${d}</div>`;last=d}
   h+=`<div class="jr-e k-${e.k}"><span class="jr-i">${e.k==='memory'?'💞':JIC[e.k]||'📝'}</span><div><small>${new Date(e.t).toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'})}${e.ch?'・'+esc2(nm(e.ch)):''}</small><b>${esc2(e.txt)}</b></div>${e.rp?`<button class="l29-ib" data-rp="${esc2(e.rp)}" data-id="${e.ch?.id||''}" aria-label="重新欣賞">▶</button>`:''}</div>`}
  h+=list.length?'</div>':'<div class="l30-empty"><span>📖</span><b>日誌還是空白的</b><small>夥伴的第一次、成長和特別的時刻都會記在這裡。</small></div></div>';B.innerHTML=h};
 B.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;buzz(5);if(b.dataset.w){who=b.dataset.w;draw()}else if(b.dataset.j){kind=b.dataset.j;draw()}else if(b.dataset.rp)replay(b.dataset.rp,b.dataset.id)});draw()}
function replay(rp,id){const L=X(),C=OCSCommunity,IW=IsleWorld;while(Ov.stack.length)Ov.back();if(Nav.cur!==0)Nav.go(0);
 setTimeout(()=>{const n=C.nodes.get(id)||(id?null:[...C.nodes.values()][0]);const [k,arg]=String(rp).split(':');
  if(k==='bottle'){openSheet(`<div class="sh-body l30-letter"><div class="sh-title">瓶中信</div><p>你好，<br>我住在很遠很遠的小島上。這裡的海浪會唱歌，晚上的星星多到數不完。<br>如果你撿到這封信，希望你今天也過得很開心。<br><br>——來自遠方的朋友</p></div>`);return}
  if(!n&&k!=='meteor'&&k!=='rainbow'){toast('這位夥伴現在不在島上','info');return}
  if(k==='shooting'){IW.shootingStar();setTimeout(()=>IW.shootingStar(),700);n.s.go('look');IW.Act.say(n,'看，是流星！',2.6,true)}
  else if(k==='meteor')L.meteorShower();else if(k==='rainbow')L.showRainbow(20);
  else if(k==='levelup'){L.celebrate(n);IW.Act.say(n,`我的${L.SKM[arg]?.[1]||''}進步了喔！`,2.8,true)}
  else if(k==='goal'){L.celebrate(n);IW.Act.say(n,'那時候真的好開心！',2.8,true)}
  else if(k==='campparty'){IW.gather(n)}
  else if(k==='catch'){IW.fishJump(n.x*IW.W,1.21*IW.H);IW.Act.say(n,'還記得那次釣到的魚！',2.6,true)}
  else if(k==='secret'){const s=L.SECRET[arg];if(!s)return;const Cm=OCSCamera,W=IW.W,H=IW.H,z=Cm.tz||1;Cm.setFollow(false);Cm.setTarget(W/2-s.x*W*z,H*.6-s.y*H*z,z);setTimeout(()=>Cm.setFollow(true),4500)}},450)}

/* ---------- 技能與目標 ---------- */
function skillsHTML(ch){const L=X(),x=L.P(ch.id);return `<div class="l30-sk">${L.SK.map(s=>{const xp=x.sk[s[0]]||0,lv=L.lvOf(xp),a=L.XPL[lv-1],b=L.XPL[lv]??a,pct=lv>=5?100:Math.round((xp-a)/Math.max(1,b-a)*100);return `<div class="sk"><span class="sk-i">${s[2]}</span><div class="sk-b"><div class="sk-t"><b>${s[1]}</b><em>Lv${lv}</em></div><i><em style="width:${pct}%"></em></i><small>${lv>=5?'已達最高等級':'下一級：'+L.UNL[s[0]][lv]}</small></div></div>`}).join('')}</div><p class="l29-note">不同性格會影響學習速度，但任何夥伴都可以嘗試每一項活動。</p>`}
function goalsHTML(ch,withChar){const L=X(),x=L.P(ch.id),act=x.goals.filter(g=>g.st==='active'),done=x.goals.filter(g=>g.st==='done').slice(-4).reverse();const TN={short:'小目標',mid:'計畫',long:'人生目標'};
 const one=g=>`<div class="gl t-${g.tier} ${g.pin?'pin':''}"><div class="gl-h"><span>${TN[g.tier]}</span>${withChar?`<em>${esc2(nm(ch))}</em>`:''}${g.pin?'<i>★</i>':''}</div><b>${esc2(g.t)}</b><div class="gl-p"><i><em style="width:${Math.round(g.p/Math.max(1,g.n)*100)}%"></em></i><small>${g.p}/${g.n}</small></div><div class="gl-a"><button class="btn primary sm" data-gact="help" data-gid="${g.id}" data-cid="${ch.id}">幫忙</button><button class="btn sm" data-gact="pin" data-gid="${g.id}" data-cid="${ch.id}">${g.pin?'取消收藏':'收藏'}</button><button class="btn sm" data-gact="swap" data-gid="${g.id}" data-cid="${ch.id}">更換</button><button class="btn sm" data-gact="ignore" data-gid="${g.id}" data-cid="${ch.id}">忽略</button></div></div>`;
 return (act.length?act.map(one).join(''):'<p class="l29-muted">現在還沒有目標。在島上多生活一下，牠會依照自己的個性想要做些什麼。</p>')+(done.length&&!withChar?`<div class="l29-h">最近完成</div>${done.map(g=>`<div class="gl done"><b>✓ ${esc2(g.t)}</b></div>`).join('')}`:'')}
function goalClick(b,redraw){const d=b.dataset;if(!d.gact)return false;const n=OCSCommunity.nodes.get(d.cid);if(!n){toast('這位夥伴現在不在島上','info');return true}buzz(6);const ok=X().goalAction(n,d.gid,d.gact);
 if(d.gact==='help'){if(ok){toast('出發去努力！','sparkle');while(Ov.stack.length)Ov.back();if(Nav.cur!==0)Nav.go(0)}else toast('牠現在正在忙，或這個目標需要時間累積','info')}else if(d.gact==='swap'&&!ok)toast('暫時想不到別的目標','info');redraw&&redraw();return true}
function goalsSheet(){const s=openSheet('<div class="sh-body" id="l30Gl"></div>'),B=s.el.querySelector('#l30Gl');const draw=()=>{B.innerHTML=`<div class="sh-title">生活目標</div><p class="q-sub">夥伴會依照個性、興趣與經歷自己想要做的事。你可以幫忙、收藏、更換或忽略，也可以讓牠慢慢自己努力。</p>${[...OCSCommunity.nodes.values()].map(n=>`<div class="l29-h">${esc2(n.s.ch.name)}</div>${goalsHTML(n.s.ch,false)}`).join('')||'<p class="l29-muted">先在「共同生活」加入夥伴吧。</p>'}`};B.addEventListener('click',e=>{const b=e.target.closest('button');if(b)goalClick(b,draw)});draw()}
function skillsSheet(){const s=openSheet('<div class="sh-body" id="l30Sk"></div>'),B=s.el.querySelector('#l30Sk');B.innerHTML=`<div class="sh-title">興趣與技能</div><p class="q-sub">閱讀、料理、園藝、探索、社交、運動、海洋、創意……做得越多就越拿手，升級後會解鎖新的行為與互動。</p>${Chars.list.map(ch=>`<button class="l30-skc" data-id="${ch.id}"><span class="l30-av">${artHTML(ch)}</span><div><b>${esc2(ch.name)}</b><small>${X().SK.map(s=>s[2]+X().lv(ch.id,s[0])).join(' ')}</small></div>${ic('right')}</button>`).join('')}`;B.onclick=e=>{const b=e.target.closest('[data-id]');if(b){s.close();setTimeout(()=>IsleLifeUI.profile(b.dataset.id,'skill'),260)}}}

/* ---------- 生活檔案新分頁 ---------- */
window.L30Tabs=[['goal','目標',ch=>`<div class="l29-h">目前的目標</div>${goalsHTML(ch)}`],['skill','技能',ch=>`<div class="l29-h">興趣與技能</div>${skillsHTML(ch)}`],['diary','日誌',ch=>{const x=X().P(ch.id);return `<div class="l29-h">生活日誌</div>${x.jr.slice(0,30).map(e=>`<div class="jr-e k-${e.k}"><span class="jr-i">${JIC[e.k]||'📝'}</span><div><small>${new Date(e.t).toLocaleString('zh-TW',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}</small><b>${esc2(e.txt)}</b></div>${e.rp?`<button class="l29-ib" data-rp="${esc2(e.rp)}" data-rid="${ch.id}" aria-label="重新欣賞">▶</button>`:''}</div>`).join('')||'<p class="l29-muted">日誌還是空白的。</p>'}<button class="btn wide" data-alljr="${ch.id}">查看完整日誌</button>`}]];
window.L30TabClick=(b,ch,redraw,s)=>{if(b.dataset.gact)return goalClick(b,redraw);if(b.dataset.rp){replay(b.dataset.rp,b.dataset.rid);return true}if(b.dataset.alljr){s.close();setTimeout(()=>journalSheet(b.dataset.alljr),260);return true}return false};

/* ---------- 探索頁：把「規劃中」換成真正的入口 ---------- */
function hub(){const L=X();if(!L)return;const box=document.getElementById('exCats');if(!box)return;const cnt=L.codexCount(),pct=Math.round(cnt.have/Math.max(1,cnt.all)*100);
 const goals=Chars.list.reduce((s,c)=>s+L.P(c.id).goals.filter(g=>g.st==='active').length,0),jr=Chars.list.reduce((s,c)=>s+L.P(c.id).jr.length,0)+L.G().jr.length,lvl=L.totalLv(),achR=(window.OCS_AC||[]).filter(a=>Econ.achReady(a)).length,qR=QUESTS.some(q=>Eco.ready(q))||L.myReady();
 const isl=OCSCommunity.nodes.size;
 const C=[['quest','flag','任務','每日・每週・長期・隱藏',qR?'有任務可領取':'看看今天的委託',qR],['codex','book','收藏圖鑑','物品、生物、事件與地點',`${cnt.have}/${cnt.all}・${pct}%`,false],['ach','sparkle','成就','生活的每個里程碑',achR?`${achR} 個可領取`:'持續累積中',achR>0],['chars','users','夥伴們','檔案、目標、技能與日誌',`${isl} 位在島上・目標 ${goals} 個`,false]];
 const sig=JSON.stringify(C);if(box._sig===sig)return;box._sig=sig;
 const same=box.querySelectorAll('[data-hub30]').length===C.length&&C.every(([k],j)=>box.children[j]?.dataset.hub30===k);
 if(same){C.forEach(([k,i,t,d,st,hot],j)=>{const b=box.children[j],em=b.querySelector('em');if(em.textContent!==st)em.textContent=st;const tg=b.querySelector('.l30-hot');if(hot&&!tg)b.querySelector('.r-ic').after(el('<span class="tag l30-hot">可領取</span>'));else if(!hot&&tg)tg.remove()})}
 else box.innerHTML=C.map(([k,i,t,d,st,hot])=>`<button class="cat press l30-hub" data-hub30="${k}"><span class="r-ic">${ic(i)}</span>${hot?'<span class="tag l30-hot">可領取</span>':''}<div><b>${t}</b><small>${d}</small><em>${st}</em></div></button>`).join('');
 const p=document.querySelector('#p-explore .phead p');if(p)p.textContent='島上的生活、收藏與回憶';const sec=[...document.querySelectorAll('#p-explore .sec')].find(s=>s.textContent==='夥伴生活');if(sec)sec.textContent='島嶼生活'}
function bindHub(){const box=document.getElementById('exCats');if(!box)return;box.addEventListener('click',e=>{const b=e.target.closest('[data-hub30]');if(!b)return;e.stopImmediatePropagation();buzz(6);const k=b.dataset.hub30;
  if(k==='chars')Nav.go(1);else if(k==='goal')goalsSheet();else if(k==='quest')openQuests(X().myReady()?X().myReadyTab():0);else if(k==='codex')codex();else if(k==='ach')openQuests(3);else if(k==='skill')skillsSheet();else if(k==='diary')journalSheet()},true);
 const go=Nav.go;Nav.go=function(i){const r=go.apply(this,arguments);if(this.cur===3)setTimeout(hub,60);return r};setInterval(()=>{if(Nav.cur===3&&!document.hidden)hub()},4000);
 const eh=Explore.hero.bind(Explore);Explore.hero=function(){const r=eh();try{const t=Object.values(X().G().titles).sort((a,b)=>b.t-a.t)[0],hd=document.querySelector('#exHero .hd');if(t&&hd&&!hd.querySelector('.l30-title')){const s=document.createElement('span');s.className='l30-title';s.textContent='🏅 '+t.name;hd.querySelector('small')?.after(s)}}catch(_){}return r};
 hub();Explore.hero()}
document.addEventListener('l30:ready',()=>{try{bindHub()}catch(e){console.error('[l30 ui]',e)}});
window.L30UI={unlock,codex,journalSheet,goalsSheet,skillsSheet,replay,goalsHTML,skillsHTML,goalClick,hub:()=>hub()};
})();
