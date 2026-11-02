/* ===== 3.3 世界地圖與多地點探索 =====
   Extensible location registry (LOC). Each location is a real scene with its own
   diorama, ambient motion, wandering party, and activities wired into existing
   systems: codex (L30.discover), skills (L30.gain), coins (Econ.pay / Wallet),
   needs + memories (IsleLife), relationships (OCSCommunity.pair).
   Who comes along is chosen from personality + place memories, so a bookworm
   tends to join library trips and a sea-lover the beach.
   Rewards are capped per day (no infinite farming); everything is saved in Cfg.v.world. */
(()=>{'use strict';
const reduce=()=>document.documentElement.dataset.motion==='reduce';
const dayKey=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const ST=()=>{const v=Cfg.v;if(!v.world||typeof v.world!=='object')v.world={};const w=v.world;if(!w.visits||typeof w.visits!=='object')w.visits={};
  if(!w.day||w.day.k!==dayKey())w.day={k:dayKey(),n:{}};return w};
const totalVisits=()=>Object.values(ST().visits).reduce((a,b)=>a+(+b||0),0);
const used=(k)=>ST().day.n[k]|0,use=k=>{ST().day.n[k]=used(k)+1;Cfg.save()};
const L30_=()=>window.L30,LF=()=>window.IsleLife,CM=()=>window.OCSCommunity;
const node=id=>CM()?.nodes?.get(id);
const traitIds=ch=>{try{return LF()?.traitIds?LF().traitIds(ch):(ch.data?.pers?.traits||[])}catch(_){return ch.data?.pers?.traits||[]}};

/* ---------- new codex categories (merged into the existing collection book) ---------- */
function installCodex(){const S=L30_()?.SPEC;if(!S||S.forage)return;
  S.forage={t:'森林採集',ic:'🍄',list:[['mush','紅帽菇','#E07070',1],['berry','野莓','#B06BC9',1],['acorn','橡實','#B9895A',1],['fern','蕨葉','#7DB36A',.9],['moss','發光苔','#9FE3B0',.4,'night'],['pine','松果','#9A7653',.8],['clover','四葉草','#5FB36A',.25]]};
  S.bug={t:'生物觀察',ic:'🦋',list:[['bfly','粉蝶','#F5C2D6',1],['ladybug','瓢蟲','#EC7878',1],['beetle','獨角仙','#6B5A8E',.6],['dragonfly','蜻蜓','#7EC8E3',.8],['firefly','螢火蟲','#E8F07A',.6,'night'],['snail','小蝸牛','#C9A27E',.8],['squirrel','松鼠','#C98B5A',.35],['owl','貓頭鷹','#8E7A6A',.3,'night']]};
  S.book={t:'圖書館藏書',ic:'📚',list:[['stars','星空圖鑑','#7E8FD6',1],['recipe','島嶼食譜','#F4A65B',1],['fairy','海邊童話','#7EC8E3',1],['flowers','花語小事典','#F5A3B5',.8],['poem','貓咪詩集','#C9A6E0',.6],['map','古老的島嶼地圖','#C9A27E',.3]]};
  S.drink={t:'咖啡館菜單',ic:'☕',list:[['latte','雲朵拿鐵','#E8CFAF',1],['matcha','抹茶歐蕾','#9FCB7E',1],['cocoa','棉花糖可可','#9A6E5A',1],['soda','星星蘇打','#9ED8EF',1],['tea','蜂蜜花茶','#F5D37A',1],['pudding','焦糖布丁','#F0C27A',1]]};
  S.place.list.push(['beach','星砂海灘','#7EC8E3'],['forest','微光森林','#7DB36A'],['cafe','雲朵咖啡館','#E8CFAF'],['library','風鈴圖書館','#C9A6E0']);
  const H=L30_().HOW;if(H){H.forage='在微光森林採集';H.bug='在森林裡安靜觀察';H.book='在風鈴圖書館借閱';H.drink='在雲朵咖啡館點過的飲品'}}
function roll(cat){const c=new Date().getHours(),night=c>=19||c<5,list=L30_().SPEC[cat].list.filter(z=>!z[4]||(z[4]==='night'&&night));let tot=list.reduce((s,z)=>s+(z[3]??1),0),r=Math.random()*tot;for(const z of list){r-=(z[3]??1);if(r<=0)return z}return list[0]}

/* ---------- location registry ---------- */
const LOC={
 home:{n:'小島家園',ic:'home',x:50,y:58,d:'大家生活的小屋與花海。',tr:[],home:true},
 beach:{n:'星砂海灘',ic:'drop',x:22,y:74,d:'閃著星砂的海岸，可以釣魚、撿貝殼、看海。',tr:['sealover','calm','collector','dreamer'],skill:'sea',acts:['fish','shell','gaze'],sky:['#BFE6F5','#F6EAD2']},
 forest:{n:'微光森林',ic:'leaf',x:76,y:30,d:'安靜的林間小徑，藏著許多植物與小生物。',tr:['curious','nature','brave','explorer','quiet','introvert'],skill:'explore',acts:['forage','bugs','rest'],sky:['#CFE7D2','#EEF3E1'],unlock:{v:1,t:'任意探索 1 次後開放'}},
 cafe:{n:'雲朵咖啡館',ic:'cup',x:70,y:70,d:'香香甜甜的小店，適合點杯飲品、和朋友聊天。',tr:['foodie','gourmet','chatty','extrovert','cheerful','sweet'],skill:'social',acts:['order','chat'],indoor:true,sky:['#F6E4D2','#FBF3E8']},
 library:{n:'風鈴圖書館',ic:'book',x:28,y:34,d:'窗邊有風鈴的圖書館，安靜地閱讀、借書。',tr:['bookworm','smart','introvert','quiet','serious','dreamer'],skill:'read',acts:['read','borrow'],indoor:true,sky:['#E4DDF0','#F6F1EA'],unlock:{v:3,t:'探索 3 次後開放'}}};
const ACT={
 fish:{n:'釣魚',ic:'drop',d:'看準時機收竿',cap:6},shell:{n:'撿貝殼',ic:'sparkle',d:'沙灘上閃閃發光的東西',cap:6},gaze:{n:'看海發呆',ic:'eye',d:'放鬆心情',cap:3},
 forage:{n:'採集',ic:'leaf',d:'找找草叢裡的東西',cap:6},bugs:{n:'觀察生物',ic:'eye',d:'趁牠們跑掉前看清楚',cap:5},rest:{n:'樹下休息',ic:'moon',d:'恢復精力',cap:3},
 order:{n:'點飲品',ic:'cup',d:'用星幣請大家喝一杯',cap:4},chat:{n:'一起聊天',ic:'chat',d:'增進彼此的感情',cap:4},
 read:{n:'閱讀時光',ic:'book',d:'培養閱讀技能',cap:4},borrow:{n:'借一本書',ic:'download',d:'收藏新的書',cap:3}};
const unlocked=id=>{const u=LOC[id].unlock;return !u||totalVisits()>=u.v};

/* who wants to go where (personality + memories) */
function affinity(ch,id){const L=LOC[id];if(L.home)return 0;const tr=traitIds(ch);let s=1+tr.filter(t=>L.tr.includes(t)).length*1.2;
  try{const e=Persona.eff(ch.data);if(id==='cafe')s+=(e.social-50)/40;if(id==='library')s+=(50-e.lively)/50;if(id==='forest')s+=(e.indep-50)/60;if(id==='beach')s+=(50-e.pace)/80}catch(_){}
  try{const x=LF()?.X(ch.id);s+=Math.min(1.5,(x?.log?.place?.[L.n]||0)*.05)}catch(_){}return Math.max(.1,s)}
function residents(){const sel=CM()?.state?.().selected||[Cfg.v.active];return sel.map(id=>Chars.byId(id)).filter(Boolean)}
function party(id){const lead=Chars.active(),rs=residents().filter(c=>c.id!==lead.id).map(c=>[c,affinity(c,id)+Math.random()*.8]).sort((a,b)=>b[1]-a[1]);
  return[lead,...rs.filter(r=>r[1]>1.4).slice(0,2).map(r=>r[0])]}
function fans(id){return residents().map(c=>[c,affinity(c,id)]).filter(x=>x[1]>=2).sort((a,b)=>b[1]-a[1]).map(x=>x[0])}

/* ---------- map (Explore page) ---------- */
const MAP_SVG=`<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="wm-bg" aria-hidden="true">
 <rect width="100" height="100" fill="var(--wm-sea)"/><path class="wm-wave" d="M0 12Q10 10 20 12T40 12T60 12T80 12T100 12M0 90Q10 88 20 90T40 90T60 90T80 90T100 90" stroke="#fff" stroke-opacity=".35" stroke-width=".5" fill="none"/>
 <path d="M10 60Q6 40 20 26Q34 12 56 14Q80 12 90 30Q98 48 88 66Q82 84 60 86Q34 90 18 80Q8 72 10 60Z" fill="var(--wm-sand)"/>
 <path d="M14 58Q12 42 24 30Q36 18 56 19Q76 18 85 33Q92 48 84 63Q76 79 58 81Q36 84 22 75Q14 68 14 58Z" fill="var(--wm-grass)"/>
 <path d="M62 20Q78 18 86 32Q90 40 84 46Q72 38 64 30Z" fill="var(--wm-forest)"/><g fill="var(--wm-tree)"><path d="M70 24l3-6 3 6z"/><path d="M76 30l3-6 3 6z"/><path d="M80 38l2.5-5 2.5 5z"/><path d="M66 30l2.5-5 2.5 5z"/></g>
 <path d="M50 58Q40 66 30 72M50 58Q62 64 70 68M50 58Q40 46 30 36M50 58Q62 44 74 32" stroke="var(--wm-path)" stroke-width="1.1" stroke-dasharray="1.6 1.4" fill="none" stroke-linecap="round"/>
</svg>`;
function avatar(c){return `<span class="wm-av" title="${esc(c.name)}">${thumbHTML(c)}</span>`}
function renderMap(){const host=document.getElementById('wMap');if(!host)return;const w=ST();
  host.innerHTML=`<div class="wm">${MAP_SVG}${Object.entries(LOC).map(([id,L])=>{const ok=unlocked(id),f=fans(id).slice(0,3);
    return `<button class="wm-pin ${ok?'':'lock'} ${L.home?'home':''}" data-loc="${id}" style="left:${L.x}%;top:${L.y}%"><span class="wm-ic">${ic(ok?L.ic:'ban')}</span><b>${L.n}</b>${f.length&&ok&&!L.home?`<span class="wm-fans">${f.map(avatar).join('')}</span>`:''}${w.visits[id]?`<i class="wm-v">${w.visits[id]}</i>`:''}</button>`}).join('')}</div>`;
  const prog=document.getElementById('wProg');if(prog){const cats=['forage','bug','book','drink','shell','fish'],S=L30_()?.SPEC;if(S){const tot=cats.reduce((a,c)=>a+(S[c]?.list.length||0),0),got=cats.reduce((a,c)=>a+(S[c]?.list.filter(z=>L30_().found(c,z[0])).length||0),0);
    prog.innerHTML=`<div class="wp"><b>探索收藏</b><i><em style="width:${tot?got/tot*100:0}%"></em></i><small>${got} / ${tot}</small></div>`}}}
function openLocSheet(id){const L=LOC[id];if(L.home){Nav.go(0);return}const ok=unlocked(id),f=fans(id),S=L30_()?.SPEC;
  const cats={beach:['shell','fish'],forest:['forage','bug'],cafe:['drink'],library:['book']}[id]||[];
  const s=openSheet(`<div class="sh-body wl-sheet"><div class="sh-title">${L.n}</div><p class="wl-d">${L.d}</p>
   ${ok?`<div class="sec">可以做的事</div><div class="wl-acts">${L.acts.map(a=>`<span>${ic(ACT[a].ic)}${ACT[a].n}<small>今日 ${Math.min(used(id+':'+a),ACT[a].cap)}/${ACT[a].cap}</small></span>`).join('')}</div>
   ${cats.length&&S?`<div class="sec">收藏進度</div>${cats.map(c=>{const t=S[c]?.list.length||0,g=S[c]?.list.filter(z=>L30_().found(c,z[0])).length||0;return `<div class="wp"><b>${S[c].t}</b><i><em style="width:${t?g/t*100:0}%"></em></i><small>${g} / ${t}</small></div>`}).join('')}`:''}
   ${f.length?`<div class="sec">喜歡這裡的夥伴</div><div class="wl-fans">${f.map(c=>`${avatar(c)}<small>${esc(c.name)}</small>`).join('')}</div>`:''}
   <button class="btn primary wl-go" data-go>${ic('route')}出發</button>`:`<div class="note">${ic('ban')}<span>尚未開放：${L.unlock.t}（目前 ${totalVisits()} 次）</span></div>`}</div>`);
  s.el.addEventListener('click',e=>{if(e.target.closest('[data-go]')){buzz(10);s.close();setTimeout(()=>enter(id),280)}})}

/* ---------- scene ---------- */
const SCENE={
 beach:`<div class="ws-sky"></div><i class="ws-sun"></i><i class="ws-cloud a"></i><i class="ws-cloud b"></i><svg class="ws-bg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice"><path d="M0 120H400V300H0Z" fill="#7CC6DE"/><path class="ws-sea1" d="M-40 140Q0 132 40 140T120 140T200 140T280 140T360 140T440 140V170H-40Z" fill="#9AD6E8"/><path class="ws-sea2" d="M-40 168Q0 160 40 168T120 168T200 168T280 168T360 168T440 168V190H-40Z" fill="#B8E4EF"/><path d="M0 182Q120 168 220 180T400 176V300H0Z" fill="#F3DFB2"/><path d="M0 214Q140 200 260 214T400 210V300H0Z" fill="#EED39E" opacity=".6"/><g transform="translate(330 168)"><rect x="-2" y="-46" width="4" height="48" fill="#A57E5A"/><path d="M0-46Q-26-40-34-26M0-46Q22-44 30-30M0-46Q-10-30-20-20M0-46Q14-30 20-18" stroke="#6BAE73" stroke-width="7" fill="none" stroke-linecap="round"/></g><g transform="translate(60 196)"><path d="M0 0L14-30L28 0Z" fill="#F5A3B5"/><path d="M14-30V4" stroke="#A57E5A" stroke-width="1.5"/></g></svg>`,
 forest:`<div class="ws-sky"></div><i class="ws-cloud a"></i><svg class="ws-bg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice"><path d="M0 150L40 90L80 150L110 70L150 150L190 96L230 150L270 80L310 150L350 100L400 150V300H0Z" fill="#8DBF88"/><path d="M0 170L50 110L100 170L150 120L200 170L260 104L320 170L370 124L400 160V300H0Z" fill="#6FA872"/><path d="M0 196Q100 182 200 194T400 190V300H0Z" fill="#A7CF8B"/><path d="M0 230Q120 216 240 230T400 226V300H0Z" fill="#94C27D" opacity=".7"/><g class="ws-trees">${[40,120,300,370].map((x,i)=>`<g transform="translate(${x} ${186+i%2*8})" class="ws-tree"><rect x="-4" y="-22" width="8" height="24" fill="#8A6A4C"/><path d="M-26-18L0-74L26-18Z" fill="${i%2?'#5E9C63':'#4F8E5A'}"/><path d="M0-74L26-18L6-18Z" fill="#3F7C4C"/></g>`).join('')}</g><g fill="#F6E7A8" class="ws-motes">${[60,140,220,280,340].map((x,i)=>`<circle cx="${x}" cy="${110+i*13%40}" r="1.6"/>`).join('')}</g></svg>`,
 cafe:`<svg class="ws-bg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice"><rect width="400" height="300" fill="#F3E2CF"/><rect y="0" width="400" height="170" fill="#F8ECDD"/><g fill="#EBD5BE">${[0,1,2,3,4,5,6,7].map(i=>`<rect x="${i*52}" y="0" width="26" height="170"/>`).join('')}</g><rect x="40" y="40" width="96" height="70" rx="10" fill="#CFEAF5" stroke="#B98A70" stroke-width="5"/><path d="M88 40V110M40 75H136" stroke="#B98A70" stroke-width="3"/><rect x="250" y="70" width="120" height="16" rx="4" fill="#B98A70"/>${[262,292,322,352].map(x=>`<rect x="${x}" y="46" width="14" height="24" rx="4" fill="${['#F5A3B5','#9FCB7E','#F5D37A','#9ED8EF'][(x/30|0)%4]}"/>`).join('')}<path d="M0 170H400V300H0Z" fill="#D9B796"/><path d="M0 170H400V178H0Z" fill="#C49F7C"/><g transform="translate(200 236)"><ellipse rx="60" ry="12" fill="#B98A70"/><rect x="-5" y="0" width="10" height="40" fill="#9A7653"/></g><g class="ws-steam" fill="#fff" opacity=".7"><circle cx="190" cy="214" r="3"/><circle cx="196" cy="204" r="4"/><circle cx="190" cy="192" r="3"/></g><path d="M300 150Q306 128 330 130Q350 126 352 150Z" fill="#7DB36A"/><rect x="316" y="150" width="22" height="18" rx="4" fill="#E3A07A"/></svg>`,
 library:`<svg class="ws-bg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice"><rect width="400" height="300" fill="#EFE7F2"/>${[0,1].map(r=>`<g transform="translate(${r?250:20} 20)"><rect width="130" height="150" rx="6" fill="#B98A70"/>${[0,1,2,3].map(k=>`<rect x="8" y="${10+k*35}" width="114" height="30" fill="#8E6A55"/>${[0,1,2,3,4,5,6,7].map(b=>`<rect x="${12+b*14}" y="${14+k*35}" width="${10+(b*7+k)%4}" height="${22+(b+k)%3*2}" rx="1.5" fill="${['#F5A3B5','#9FCB7E','#7E8FD6','#F5D37A','#C9A6E0','#7EC8E3'][(b+k*2+r)%6]}"/>`).join('')}`).join('')}</g>`).join('')}<rect x="160" y="30" width="80" height="90" rx="40" fill="#D7EEF7" stroke="#C9A6E0" stroke-width="5"/><g class="ws-chime" transform="translate(200 34)"><path d="M0 0V18" stroke="#9A8269"/><path d="M-6 18H6L4 28H-4Z" fill="#8FD0EE"/></g><path d="M0 172H400V300H0Z" fill="#CDB9D9"/><path d="M0 172H400V180H0Z" fill="#B8A2C6"/><g transform="translate(200 238)"><rect x="-80" y="-8" width="160" height="14" rx="4" fill="#B98A70"/><rect x="-70" y="6" width="8" height="34" fill="#9A7653"/><rect x="62" y="6" width="8" height="34" fill="#9A7653"/></g></svg>`};
const LINES={beach:['海風好舒服～','浪的聲音好好聽。','有螃蟹在走路！','要不要比賽撿貝殼？'],forest:['好安靜喔……','你聽，有鳥在唱歌。','這裡的空氣好清新。','那邊好像有東西在動？'],cafe:['好香的味道！','我想吃甜的～','這家店好可愛。','下次也要一起來喔。'],library:['噓……要小聲一點。','這本書好像很有趣。','我喜歡紙張的味道。','窗外的風鈴在響。']};
let cur=null;
function enter(id){if(!unlocked(id))return;const L=LOC[id],w=ST();w.visits[id]=(w.visits[id]|0)+1;w.last=id;Cfg.save();
  const pty=party(id),root=el(`<div class="wloc" data-loc="${id}" role="dialog" aria-label="${L.n}"><div class="ws ${L.indoor?'indoor':''}" style="--ws-a:${L.sky[0]};--ws-b:${L.sky[1]}">${SCENE[id]}<div class="ws-ground"></div><div class="ws-fx"></div></div>
   <header class="wl-h"><button class="icon-btn" data-k="back" aria-label="返回地圖">${ic('left')}</button><div><b>${L.n}</b><small>${pty.map(c=>esc(c.name.split(' ')[0])).join('、')} 一起來了</small></div></header>
   <div class="wl-panel"></div><nav class="wl-bar">${L.acts.map(a=>`<button data-act="${a}"><span>${ic(ACT[a].ic)}</span><b>${ACT[a].n}</b><small class="wl-cap"></small></button>`).join('')}</nav></div>`);
  ($('#app')||document.body).append(root);fillIcons(root);
  const api={el:root,close:()=>leave()};Ov.push(api);
  const ws=root.querySelector('.ws'),actors=pty.map((c,i)=>{const a=el(`<div class="wa" style="--x:${22+i*26}"><div class="ob-actor stage"><div class="actor" data-state="idle"><div class="a-flip"><div class="a-tilt"><div class="a-pose"><div class="a-squash"><div class="art"><div class="adj">${artHTML(c)}</div></div></div></div></div></div></div></div><span class="wa-b"></span></div>`);
    ws.append(a);return{c,el:a,act:a.querySelector('.actor'),flip:a.querySelector('.a-flip'),x:22+i*26,tx:22+i*26,dir:1,t:Math.random()*3,say:a.querySelector('.wa-b'),busy:0}});
  cur={id,root,api,actors,raf:0,last:performance.now(),panel:root.querySelector('.wl-panel')};
  memoAll(pty,`去了${L.n}`,L.n);try{L30_()?.discover('place',id,node(pty[0].id))}catch(_){}
  try{const sk=L.skill;pty.forEach(c=>{const n=node(c.id);if(n&&sk)L30_()?.gain(n,sk,2)})}catch(_){}
  requestAnimationFrame(()=>root.classList.add('in'));refreshCaps();setTimeout(()=>speak(actors[0],pick(LINES[id])),900);
  root.addEventListener('click',e=>{const b=e.target.closest('[data-k=back]');if(b){buzz(6);leave();return}
    const a=e.target.closest('[data-act]');if(a){buzz(8);runAct(a.dataset.act);return}
    const w=e.target.closest('.wa');if(w){const A=actors.find(x=>x.el===w);if(A){A.act.dataset.state='happy';setTimeout(()=>A.act.dataset.state='idle',900);speak(A,pick([...(A.c.lines?.pet||LINES[id]),...LINES[id]]))}}});
  loop();Nav.cur!==3||renderMap()}
function speak(A,t){if(!A||!t)return;A.say.textContent=t;A.say.classList.add('on');clearTimeout(A.st);A.st=setTimeout(()=>A.say.classList.remove('on'),2800)}
function loop(){if(!cur)return;const now=performance.now(),dt=Math.min(.1,(now-cur.last)/1000);cur.last=now;
  for(const A of cur.actors){if(A.busy>0){A.busy-=dt;continue}A.t-=dt;
    if(A.t<=0){if(Math.random()<.55){A.tx=8+Math.random()*80;A.t=3+Math.random()*4}else{A.tx=A.x;A.t=2+Math.random()*3}}
    const d=A.tx-A.x;if(Math.abs(d)>.6){A.x+=Math.sign(d)*Math.min(Math.abs(d),dt*9);A.dir=Math.sign(d);if(A.act.dataset.state!=='walk')A.act.dataset.state='walk'}else if(A.act.dataset.state==='walk')A.act.dataset.state='idle';
    A.el.style.setProperty('--x',A.x.toFixed(2));A.flip.style.transform=`scaleX(${A.dir<0?-1:1})`;
    if(Math.random()<dt*.04)speak(A,pick(LINES[cur.id]));if(Math.random()<dt*.35&&A.act.dataset.state!=='walk'){A.act.classList.add('blink');setTimeout(()=>A.act.classList.remove('blink'),110)}}
  cur.raf=requestAnimationFrame(loop)}
function leave(){if(!cur)return;const c=cur;cur=null;cancelAnimationFrame(c.raf);try{Ov.remove(c.api)}catch(_){}c.root.classList.remove('in');setTimeout(()=>c.root.remove(),450);Cfg.save();renderMap()}
function memoAll(pty,text,place){pty.forEach(c=>{try{LF()?.memo({id:c.id},text,{place})}catch(_){}})}
function refreshCaps(){if(!cur)return;cur.root.querySelectorAll('[data-act]').forEach(b=>{const a=b.dataset.act,u=used(cur.id+':'+a),cap=ACT[a].cap;b.querySelector('.wl-cap').textContent=u>=cap?'今天夠了':`${cap-u} 次`;b.classList.toggle('spent',u>=cap)})}
function capOK(a){if(used(cur.id+':'+a)>=ACT[a].cap){toast('今天在這裡玩夠了，明天再來吧','info');return false}return true}
function reward(rid,coins,why){try{if(window.Econ&&Econ.pay(`w_${dayKey()}_${rid}`,'explore',coins)){toast(`${why} +${coins} 星幣`,'sparkle');return}}catch(_){}}
function found(cat,z,who){const isNew=L30_()?.discover(cat,z[0],node(who.id));speak(cur.actors.find(a=>a.c===who)||cur.actors[0],isNew?`是新發現！${z[1]}！`:`又是${z[1]}～`);return isNew}
function panel(html,top){const p=cur.panel;p.innerHTML=html;p.classList.toggle('top',!!top);p.classList.add('on');fillIcons(p);return p}
function closePanel(){cur&&cur.panel.classList.remove('on')}

function runAct(a){if(!cur||!capOK(a))return;const id=cur.id,lead=cur.actors[0],who=pick(cur.actors);
  ({fish:()=>fishing(),shell:()=>spawnPick('shell','#FFF6E8',5),forage:()=>spawnPick('forage','#E9F5DF',5),bugs:()=>bugs(),
    gaze:()=>timed('看海發呆','大家靜靜地看著海浪……',4,()=>{needAll({fun:.12,comfort:.1});memoAll(cur.actors.map(x=>x.c),'一起在海邊發呆','星砂海灘');reward(id+'gaze'+used(id+':gaze'),5,'好放鬆')}),
    rest:()=>timed('樹下休息','大家在樹蔭下打了個小盹……',5,()=>{cur.actors.forEach(A=>{const n=node(A.c.id);if(n)n.s.fat=Math.max(0,(n.s.fat||0)-.25)});needAll({comfort:.15,sleep:.1});reward(id+'rest'+used(id+':rest'),5,'精神恢復了')},'sleep'),
    order:()=>cafeMenu(),chat:()=>chat(),
    read:()=>timed('閱讀時光','翻書的聲音沙沙作響……',5,()=>{cur.actors.forEach(A=>{const n=node(A.c.id);if(n)try{L30_().gain(n,'read',6)}catch(_){}});memoAll(cur.actors.map(x=>x.c),'在圖書館讀了一下午的書','風鈴圖書館');reward(id+'read'+used(id+':read'),8,'學到新東西')},'idle'),
    borrow:()=>{use(id+':borrow');const z=roll('book');found('book',z,who);memoAll([who.c],`借了一本《${z[1]}》`,'風鈴圖書館');refreshCaps()}})[a]()}
function needAll(fx){cur.actors.forEach(A=>{const n=node(A.c.id);if(!n||!LF())return;const nd=LF().needs(n);for(const k in fx)nd[k]=Math.min(1,(nd[k]||0)+fx[k])})}
function timed(title,text,sec,done,pose){const a=Object.keys(ACT).find(k=>ACT[k].n===title);use(cur.id+':'+a);refreshCaps();
  const p=panel(`<div class="wg"><b>${title}</b><p>${text}</p><i class="wg-bar"><em></em></i></div>`);const em=p.querySelector('em');
  cur.actors.forEach(A=>{A.busy=sec;A.act.dataset.state=pose||'idle';A.act.dataset.beh=pose==='sleep'?'doze':'sit'});
  em.animate([{width:'0%'},{width:'100%'}],{duration:sec*1000,fill:'forwards'}).finished.then(()=>{if(!cur)return;cur.actors.forEach(A=>{A.act.dataset.state='happy';A.act.dataset.beh='';setTimeout(()=>A.act.dataset.state='idle',900)});done();setTimeout(closePanel,600)})}

/* fishing: tap while the marker is in the zone (zone grows with sea skill) */
function fishing(){const lead=cur.actors[0],sk=(()=>{try{return L30_().lv(lead.c.id,'sea')}catch(_){return 1}})(),zone=16+sk*4;
  const p=panel(`<div class="wg"><b>釣魚</b><p>浮標動了就點「收竿」！</p><div class="wf"><i class="wf-z" style="width:${zone}%;left:${50-zone/2}%"></i><i class="wf-m"></i></div><button class="btn primary" data-reel>收竿</button></div>`);
  const m=p.querySelector('.wf-m');const an=m.animate([{left:'0%'},{left:'96%'}],{duration:Math.max(700,1500-sk*120),iterations:Infinity,direction:'alternate',easing:'ease-in-out'});
  lead.busy=99;lead.act.dataset.beh='sit';
  p.querySelector('[data-reel]').onclick=()=>{const pos=parseFloat(getComputedStyle(m).left)/m.parentElement.clientWidth*100;an.pause();use(cur.id+':fish');refreshCaps();lead.busy=0;lead.act.dataset.beh='';
    if(Math.abs(pos+2-50)<=zone/2){const z=roll('fish');lead.act.dataset.state='happy';found('fish',z,lead.c);try{const n=node(lead.c.id);n&&L30_().gain(n,'sea',5)}catch(_){}reward('fish'+used(cur.id+':fish'),6,`釣到${z[1]}`);memoAll([lead.c],`在海灘釣到${z[1]}`,'星砂海灘')}
    else{speak(lead,pick(['啊，跑掉了！','差一點點！','下次一定可以！']));lead.act.dataset.state='idle'}
    setTimeout(closePanel,900)}}
/* tap-to-collect items spawned on the ground */
function spawnPick(cat,glow,n){use(cur.id+':'+(cat==='shell'?'shell':'forage'));refreshCaps();const fx=cur.root.querySelector('.ws-fx');let left=n;
  panel(`<div class="wg"><b>${cat==='shell'?'撿貝殼':'採集'}</b><p>點一下閃閃發光的地方！</p></div>`,true);
  for(let i=0;i<n;i++){const z=roll(cat),d=el(`<button class="wpick" style="left:${8+Math.random()*82}%;top:${58+Math.random()*16}%;--c:${z[2]};--g:${glow}" aria-label="撿起來"><i></i></button>`);fx.append(d);
    d.animate([{transform:'scale(0)'},{transform:'scale(1)'}],{duration:400,delay:i*120,easing:'cubic-bezier(.34,1.5,.64,1)',fill:'backwards'});
    d.onclick=()=>{buzz(8);const who=pick(cur.actors);found(cat,z,who.c);d.animate([{transform:'scale(1)',opacity:1},{transform:'translateY(-30px) scale(1.3)',opacity:0}],{duration:450,fill:'forwards'}).finished.then(()=>d.remove());
      if(--left===0){memoAll([who.c],cat==='shell'?'在海灘撿了好多貝殼':'在森林採集了好多東西',LOC[cur.id].n);reward(cat+used(cur.id+':'+(cat==='shell'?'shell':'forage')),5,'收穫滿滿');setTimeout(closePanel,500)}}}}
/* bugs: tap them before they fly away */
function bugs(){use(cur.id+':bugs');refreshCaps();const fx=cur.root.querySelector('.ws-fx');panel(`<div class="wg"><b>觀察生物</b><p>趁牠們離開前點一下！</p></div>`,true);let n=3,got=0;
  const spawn=k=>{const z=roll('bug'),d=el(`<button class="wbug" style="--c:${z[2]};top:${30+Math.random()*35}%"><i></i></button>`);fx.append(d);
    const fly=d.animate([{left:'-8%',transform:'translateY(0)'},{left:'40%',transform:'translateY(-30px)'},{left:'70%',transform:'translateY(18px)'},{left:'108%',transform:'translateY(-10px)'}],{duration:4200-k*300,easing:'linear',fill:'forwards'});
    fly.finished.then(()=>{d.remove();if(--n===0)end()}).catch(()=>{});d.onclick=()=>{buzz(8);fly.cancel();d.remove();got++;const who=pick(cur.actors);found('bug',z,who.c);try{const nn=node(who.c.id);nn&&L30_().gain(nn,'explore',4)}catch(_){}if(--n===0)end()}};
  for(let i=0;i<3;i++)setTimeout(()=>cur&&spawn(i),i*900);
  const end=()=>{if(!cur)return;if(got)reward('bugs'+used(cur.id+':bugs'),4*got,`觀察到 ${got} 種生物`);else speak(cur.actors[0],'都跑掉了……');setTimeout(closePanel,600)}}
/* café: spend coins on drinks for the party */
function cafeMenu(){const S=L30_().SPEC.drink.list.slice(0,4),price=12;
  const p=panel(`<div class="wg"><b>點飲品</b><p>每杯 ${price} 星幣，請大家一起喝。（現有 ${Wallet.bal()}）</p><div class="wmenu">${S.map(z=>`<button data-d="${z[0]}" style="--c:${z[2]}"><i></i>${z[1]}</button>`).join('')}</div><button class="btn sm" data-x>先不要</button></div>`);
  p.onclick=e=>{if(e.target.closest('[data-x]')){closePanel();return}const b=e.target.closest('[data-d]');if(!b)return;const z=S.find(x=>x[0]===b.dataset.d),cost=price*cur.actors.length;
    if(!Wallet.spend(cost)){toast(`星幣不夠（需要 ${cost}）`,'info');return}use(cur.id+':order');refreshCaps();buzz(12);
    cur.actors.forEach((A,i)=>{setTimeout(()=>{if(!cur)return;A.act.dataset.state='happy';speak(A,pick(['好好喝！','甜甜的～','再來一杯！','好幸福～']));setTimeout(()=>A.act.dataset.state='idle',1200)},i*500)});
    needAll({thirst:.5,fun:.1,social:.1});try{L30_().discover('drink',z[0],node(cur.actors[0].c.id))}catch(_){}memoAll(cur.actors.map(x=>x.c),`在咖啡館喝了${z[1]}`,'雲朵咖啡館');p.onclick=null;setTimeout(closePanel,700)}}
/* chat: relationship between two party members */
function chat(){if(cur.actors.length<2){toast('要有兩位夥伴一起來才能聊天喔','info');return}use(cur.id+':chat');refreshCaps();const[a,b]=cur.actors;
  const topics=[['最近在島上發現了什麼？','我看到好大的雲！'],['你最喜歡什麼飲料？','當然是甜甜的那種～'],['下次一起去海邊好不好？','好呀！約定好了。'],['你覺得我們是好朋友嗎？','嗯！最好的那種。']],tp=pick(topics);
  panel(`<div class="wg"><b>一起聊天</b><p>${esc(a.c.name.split(' ')[0])} 和 ${esc(b.c.name.split(' ')[0])} 聊得很開心……</p></div>`);
  a.dir=b.x>a.x?1:-1;b.dir=-a.dir;a.busy=b.busy=5;speak(a,tp[0]);setTimeout(()=>{if(cur){speak(b,tp[1]);b.act.dataset.state='happy'}},1600);
  setTimeout(()=>{if(!cur)return;b.act.dataset.state='idle';try{const p=CM().pair(a.c.id,b.c.id);p.score=Math.min(100,(p.score||0)+3);p.count=(p.count||0)+1;p.last=Date.now();CM().persist?.()}catch(_){}
    needAll({social:.2});memoAll([a.c],`在咖啡館和${b.c.name}聊天`,'雲朵咖啡館');memoAll([b.c],`在咖啡館和${a.c.name}聊天`,'雲朵咖啡館');toast(`${a.c.name.split(' ')[0]} 和 ${b.c.name.split(' ')[0]} 的感情變好了`,'heart');closePanel()},3600)}

/* ---------- wire into the Explore page ---------- */
function wire(){installCodex();const pg=document.querySelector('#p-explore .scroll');if(!pg)return;
  const head=pg.querySelector('.phead p');if(head)head.textContent='世界地圖・前往不同的地方';
  const hero=document.getElementById('exHero'),cats=document.getElementById('exCats');
  const box=el(`<div class="wbox"><div id="wMap"></div><div id="wProg"></div></div>`);hero?hero.after(box):pg.prepend(box);
  if(cats){const sec=cats.previousElementSibling;if(sec&&sec.classList.contains('sec'))sec.remove();cats.remove()}
  box.addEventListener('click',e=>{const p=e.target.closest('[data-loc]');if(p){buzz(8);openLocSheet(p.dataset.loc)}});
  renderMap();const go=Nav.go;Nav.go=function(i){const r=go.apply(this,arguments);if(i===3)renderMap();return r}}
window.OCSWorld={LOC,ACT,enter,leave,party,affinity,renderMap,state:ST,open:openLocSheet};
const t=setInterval(()=>{if(!window.L30?.SPEC||!window.OCSCommunity?.ready||typeof Explore==='undefined')return;clearInterval(t);try{wire()}catch(e){console.error('[world]',e)}},200);
})();
