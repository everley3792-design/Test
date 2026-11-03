/* ===== 3.1 資訊架構整合：角色檔案卡、出場與操控、快速狀態、導覽與入口整理、請求演出 ===== */
(()=>{'use strict';
const reduce=()=>document.documentElement.dataset.motion==='reduce';
const nm=c=>c?c.name.split(' ')[0]:'',E=s=>esc(String(s??''));
const CM=()=>window.OCSCommunity,LF=()=>window.IsleLife,G3=()=>window.L30;
const MOODN={happy:'開心',calm:'平靜',excited:'興奮',tired:'疲倦',bored:'無聊',shy:'害羞',angry:'生氣',sad:'難過'};
const MOODE={happy:'♪',calm:'～',excited:'✦',tired:'💤',bored:'…',shy:'///',angry:'💢',sad:'💧'};
const NEEDS=[['hunger','飽足','#F4A65B','🍙'],['thirst','解渴','#5DB3E0','💧'],['energy','精力','#86BC4E','⚡'],['sleep','睡眠','#9585DD','🌙'],['fun','娛樂','#E884AE','🎈'],['social','社交','#EC7878','💬'],['comfort','舒適','#45B596','🛋️']];

/* ---------- 共用：出場（在小島上）與操控 ---------- */
const onIsle=id=>!!CM()?.state().selected.includes(id);
const isCtrl=id=>Cfg.v.active===id;
function setIsland(id,on){const C=CM(),st=C.state();
 if(on){if(st.selected.includes(id))return true;if(st.selected.length>=8){toast('小島最多同時 8 位夥伴','info');return false}st.selected.push(id)}
 else{if(!st.selected.includes(id))return true;if(st.selected.length<=1){toast('小島上至少要有一位夥伴','info');return false}st.selected=st.selected.filter(x=>x!==id);if(Cfg.v.active===id){C.switching=true;setActive(st.selected[0]);C.switching=false}}
 C.persist();C.sync();buzz(8);changed();return true}
function control(id){if(isCtrl(id)){changed();return}if(!onIsle(id)&&!setIsland(id,true))return;setActive(id);buzz(10);toast(`現在操控 ${nm(Chars.byId(id))}`,'sparkle');changed()}
const subs=new Set();function changed(){subs.forEach(f=>{try{f()}catch(_){}})}
document.addEventListener('oc:residents-changed',()=>changed());
function nodeOf(id){return CM()?.nodes.get(id)}
function activity(id){const n=nodeOf(id);if(!n)return '不在島上';const t=n.task;if(t?.type==='activity'&&t.act)return (L29.ACTN2[t.act]||'活動中')+(t.arrived?'':'（前往中）');if(t?.type==='social'||t?.event)return '和朋友聊天';if(t?.type==='furniture')return '使用家具';if(t?.type==='manual')return '照你說的走過去';if(n.path.length)return '散步中';if(n.s.sleeping&&n.s.sleeping())return '睡覺中';return '休息中'}
function moodOf(id){const n=nodeOf(id);const ch=Chars.byId(id);const m=n?.emo?.id||n?.s.mood?.id||ch&&Cfg.v.life?.[id]?.m||'calm';return {id:m,n:MOODN[m]||'平靜',e:MOODE[m]||'～',i:n?.emo?.i||0}}

/* 角色圖每次產生都帶有新的 SVG id，直接比對字串會導致每次更新都重建圖片（閃爍）→ 去掉 id 後再比對 */
/* 文字只在內容真的改變時才寫入（以寫入值比對；表情符號會被轉成圖示，不能用 textContent 比對） */
const txt=(e,v)=>{if(e&&e._t!==v){e.textContent=v;e._t=v}};
const artSig=h=>h.replace(/(id="|href="#|url\(#)[^"')]+/g,'$1');
/* ---------- 1. 角色頁：檔案卡（局部更新，不整片重建） ---------- */
function cardHTML(c){return `<button class="oc-open" data-open aria-label="查看 ${E(c.name)} 的檔案"><span class="oc-art">${thumbHTML(c)}</span><span class="oc-badges"></span><span class="oc-mood"></span></button>
 <div class="oc-info"><b class="oc-name"></b><small class="oc-type"></small><span class="oc-now"></span></div>
 <div class="oc-acts"><button class="oc-b" data-isle></button><button class="oc-b" data-ctrl></button></div>`}
function patchCard(card,c){const isle=onIsle(c.id),ctl=isCtrl(c.id),mood=moodOf(c.id),t=G3()?LF().ptype(c).name:'',set=(sel,v,html)=>{const e=card.querySelector(sel);if(!e)return;if(html){if(e._v!==v){e.innerHTML=v;e._v=v}}else txt(e,v)};
 const art=thumbHTML(c),sg=artSig(art);if(card._art!==sg){card.querySelector('.oc-art').innerHTML=art;card._art=sg}
 set('.oc-name',c.name);set('.oc-type',`${t}${t?'・':''}${c.kind==='demo'?'示範':c.url?'匯入':'原創'}`);set('.oc-now',isle?`${mood.e} ${mood.n}・${activity(c.id)}`:'在家休息中（不在小島上）');
 set('.oc-badges',`${ctl?'<i class="b-ctl">操控中</i>':''}${isle?'<i class="b-isle">在島上</i>':''}`,true);set('.oc-mood',isle?mood.e:'',false);
 const bi=card.querySelector('[data-isle]'),bc=card.querySelector('[data-ctrl]');const li=isle?'✓ 在島上':'＋ 加入小島',lc=ctl?'● 操控中':'操控';txt(bi,li);txt(bc,lc);bi.classList.toggle('on',isle);bc.classList.toggle('on',ctl);if(bi.getAttribute('aria-pressed')!==String(isle))bi.setAttribute('aria-pressed',String(isle));if(bc.getAttribute('aria-pressed')!==String(ctl))bc.setAttribute('aria-pressed',String(ctl));
 card.classList.toggle('ctl',ctl);card.classList.toggle('isle',isle)}
function bar(){const p=document.getElementById('p-chars'),seg=document.getElementById('charSeg');if(!p||!seg)return null;let b=document.getElementById('ocBar');if(!b){b=document.createElement('div');b.id='ocBar';b.className='oc-bar';b.innerHTML='<div class="ob-t"><b></b><small></small></div><button class="btn sm" data-comm="residents">'+ic('users')+'共同生活</button><button class="btn sm" data-comm="relations">'+ic('heart')+'關係</button>';seg.after(b);b.addEventListener('click',e=>{const x=e.target.closest('[data-comm]');if(x){buzz(6);CM().open(x.dataset.comm)}})}
 const st=CM()?.state(),n=st?st.selected.length:0,a=Chars.active();const t=`小島上 ${n} / 8 位`,s=`目前操控：${a?a.name:'—'}`;txt(b.querySelector('b'),t);txt(b.querySelector('small'),s);return b}
function render(){const g=document.getElementById('charGrid');if(!g)return;const list=Chars.list.filter(c=>Gallery.filter==='all'||c.kind===Gallery.filter);
 const sub=document.getElementById('charSub');if(sub){const t=`${Chars.list.length} 位夥伴・${Chars.list.filter(c=>c.kind==='custom').length} 位為我的創作`;txt(sub,t)}
 bar();g.querySelector('.empty')?.remove();const keep=new Set();let i=0;
 for(const c of list){let card=g.querySelector(`.oc-card[data-cid="${CSS.escape(c.id)}"]`);if(!card){card=document.createElement('div');card.className='oc-card';card.dataset.cid=c.id;card.innerHTML=cardHTML(c);card.style.setProperty('--i',i)}card.style.setProperty('--tb',c.kind==='demo'?c.body:'#8B7CF6');patchCard(card,c);if(g.children[i]!==card)g.insertBefore(card,g.children[i]||null);keep.add(card);i++}
 let add=g.querySelector('.cc-add');if(!add){add=el(`<button class="cc-add"><span class="plus">${ic('plus')}</span>新增角色<small>快速創建、進階編輯或匯入圖片</small></button>`)}if(g.children[i]!==add)g.insertBefore(add,g.children[i]||null);keep.add(add);
 [...g.children].forEach(n=>{if(!keep.has(n))n.remove()});if(Gallery.filter==='custom'&&!list.length)g.insertAdjacentHTML('afterbegin','<div class="empty">還沒有自己的角色。<br>點下方「新增角色」，讓你的 OC 住進來。</div>');Gallery.dirty=false}
function bindChars(){Gallery.render=render;const g=document.getElementById('charGrid');
 g.addEventListener('click',e=>{const card=e.target.closest('.oc-card');if(!card)return;e.stopImmediatePropagation();const id=card.dataset.cid;
  if(e.target.closest('[data-isle]'))setIsland(id,!onIsle(id));else if(e.target.closest('[data-ctrl]'))control(id);else{buzz(6);profile(id)}},true);
 subs.add(()=>{if(document.getElementById('p-chars'))render()});render();setInterval(()=>{if(Nav.cur===1&&!document.hidden)render()},3000)}

/* ---------- 2. 角色檔案（只負責查看；所有修改都在「編輯」） ---------- */
const PT=[['now','總覽'],['pers','個性'],['grow','成長'],['life','生活'],['goal','目標'],['rel','關係'],['mem','回憶']];
const TABMAP={skill:'grow',diary:'mem',story:'mem',status:'now'};
function basicHTML(ch){const d=ch.data||{},F=[['暱稱',d.nick],['物種',d.species],['生日',d.birthday],['年齡',d.age],['性別',d.gender],['代稱',d.pronoun],['身高',d.height]].filter(x=>x[1]);
 return `${d.tagline?`<p class="pf-tag">「${E(d.tagline)}」</p>`:''}${F.length?`<div class="pf-basic">${F.map(([k,v])=>`<div><small>${k}</small><b>${E(v)}</b></div>`).join('')}</div>`:''}${d.bio?`<p class="pf-bio">${E(d.bio)}</p>`:''}${(d.fields||[]).filter(f=>f.k&&f.v).map(f=>`<div class="pf-field"><small>${E(f.k)}</small><b>${E(f.v)}</b></div>`).join('')}${!F.length&&!d.bio?'<p class="l29-muted">還沒有填寫基本資料，可以在「編輯 → 基本」補上。</p>':''}`}
function needsHTML(id){const n=nodeOf(id);if(!n)return '<p class="l29-muted">牠現在不在小島上，加入小島後就能看到即時狀態。</p>';const nd=LF().needs(n);return `<div class="l31-needs">${NEEDS.map(([k,t,c,i])=>{const v=Math.round(nd[k]*100);return `<div class="nb ${v<25?'low':''}" data-need="${k}" style="--c:${c}"><span>${i}</span><b>${t}</b><i><em style="width:${v}%"></em></i><small>${v}</small></div>`}).join('')}</div>`}
function wishHTML(ch){const n=nodeOf(ch.id),x=LF().X(ch.id),r=G3()?.P(ch.id).req,ew=window.Econ&&Econ.s.life[ch.id]?.w,ewi=ew&&Items.get(ew.item);let h='';
 if(x.wish)h+=`<div class="pf-wish"><span>💭</span><div><b>${E(LF().wishLabel(x.wish))}</b><small>${x.wish.type==='pet'?'點一下牠就能摸摸頭':'可以幫牠一把，也可以讓牠自己想辦法'}</small></div>${x.wish.type!=='pet'&&n?'<button class="btn primary sm" data-help>幫忙</button>':''}</div>`;
 if(r)h+=`<div class="pf-wish rq"><span>💌</span><div><b>「${E(G3().reqText(r))}」</b><small>${E(G3().RQ[r.k].how)}</small></div>${r.k==='go'?'<button class="btn primary sm" data-go2>好啊</button>':r.k==='buy'?`<button class="btn sm" data-shop="${E(r.pid||'')}">去商店</button>`:''}</div>`;
 if(ewi)h+=`<div class="pf-wish"><span>🍽️</span><div><b>想吃「${E(ewi.name)}」</b><small>從背包餵牠就能實現</small></div></div>`;return h||'<p class="l29-muted">現在沒有特別的心願。</p>'}
function foodHTML(ch){let L=[];try{L=Taste.list(ch)||[]}catch(_){}const T=(()=>{try{return Taste.cd(ch)}catch(_){return {}}})();const fav=L.filter(x=>x.sc>=1).sort((a,b)=>b.sc-a.sc).slice(0,4),bad=L.filter(x=>x.sc<=-1).sort((a,b)=>a.sc-b.sc).slice(0,4);const mode={manual:'玩家指定',auto:'自動探索',mix:'混合'}[T.mode]||'混合';
 const li=a=>a.length?a.map(x=>`<span>${(()=>{try{return Taste.ico(x.id,x.s)}catch(_){return ''}})()} ${E(x.s?.nm||'?')}</span>`).join(''):'<em>還在探索中</em>';
 return `<div class="pf-food"><div><small>已品嚐</small><b>${L.length} 種</b></div><div><small>口味模式</small><b>${mode}</b></div></div><div class="pf-fl"><b>最愛</b><div class="pf-chips">${li(fav)}</div></div><div class="pf-fl"><b>不喜歡</b><div class="pf-chips">${li(bad)}</div></div><button class="btn wide" data-edit="food">${ic('sliders')}編輯飲食喜好</button>`}
function relHTML(ch){const C=CM(),st=C.state(),others=Chars.list.filter(c=>c.id!==ch.id);if(!others.length)return '<p class="l29-muted">再加入其他夥伴，就能建立關係。</p>';
 return `<div class="pf-rel">${others.map(o=>{const p=st.pairs[C.key(ch.id,o.id)];const lv=p?C.level(p):'尚未認識',sc=p?Math.max(0,Math.min(100,p.score)):0,mem=st.memories.find(m=>m.ids.includes(ch.id)&&m.ids.includes(o.id));const both=onIsle(ch.id)&&onIsle(o.id);
  return `<div class="rl"><span class="l30-av">${artHTML(o)}</span><div class="rl-b"><div class="rl-t"><b>${E(o.name)}</b><em>${lv}</em></div><i><em style="width:${sc}%"></em></i><small>${p?`相處 ${p.count} 次${p.tension?'・有一點小心結':''}`:'還沒有說過話'}${mem?`・最近：${E(mem.title)}`:''}</small></div>${both?`<button class="btn sm" data-chat="${o.id}">聊聊</button>`:''}</div>`}).join('')}</div><button class="btn wide" data-comm="relations">${ic('users')}共同生活與所有關係</button>`}
function memHTML(ch,f){const L=LF(),x=L.X(ch.id),items=[];
 if(f==='all'||f==='jr')(G3()?.P(ch.id).jr||[]).forEach(e=>items.push({t:e.t,i:{first:'✨',skill:'⭐',goal:'🎯',habit:'🌱',event:'🌈',codex:'📗',request:'💌',quest:'📜',read:'📚',catch:'🐟'}[e.k]||'📝',b:e.txt,rp:e.rp}));
 if(f==='all'||f==='mem'){x.mem.forEach(m=>items.push({t:m.t,i:m.v<0?'🌧️':'💛',b:m.text,s:m.place?L29.PLACEN[m.place]:''}));CM().state().memories.filter(m=>m.ids.includes(ch.id)).forEach(m=>items.push({t:m.t,i:'💞',b:m.title,s:m.ids.filter(i=>i!==ch.id).map(i=>nm(Chars.byId(i))).join('、')}))}
 if(f==='all'||f==='story'){try{(window.OCSEvents.read(ch).log||[]).forEach(v=>items.push({t:v.t,i:'📖',b:v.title+(v.line?'：「'+v.line+'」':''),s:v.itemName||''}))}catch(_){}}
 items.sort((a,b)=>b.t-a.t);let last='';return `<div class="chips pf-mf">${[['all','全部'],['jr','日誌'],['mem','回憶'],['story','生活故事']].map(([k,v])=>`<button class="chip ${f===k?'on':''}" data-mf="${k}">${v}</button>`).join('')}</div><div class="jr-list">${items.slice(0,80).map(e=>{const d=new Date(e.t).toLocaleDateString('zh-TW',{month:'long',day:'numeric'});const hd=d!==last?`<div class="jr-d">${d}</div>`:'';last=d;return hd+`<div class="jr-e"><span class="jr-i">${e.i}</span><div><small>${new Date(e.t).toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'})}${e.s?'・'+E(e.s):''}</small><b>${E(e.b)}</b></div>${e.rp?`<button class="l29-ib" data-rp="${E(e.rp)}" aria-label="重新欣賞">▶</button>`:''}</div>`}).join('')||'<p class="l29-muted">還沒有紀錄。夥伴的第一次、成長和特別的時刻都會記在這裡。</p>'}</div><div class="pf-row2"><button class="btn" data-alljr>完整日誌</button><button class="btn" data-evrules>生活故事設定</button></div>`}
function profile(id,tab='now'){const ch=Chars.byId(id);if(!ch)return;tab=TABMAP[tab]||tab;if(!PT.some(t=>t[0]===tab))tab='now';let st=null,live=0,mf='all';
 const s=openSheet(`<div class="sh-body l31-pf" id="l31P"><div class="pf-head"></div><div class="pf-tabs" role="tablist"></div><div class="pf-body"></div></div>`,{cls:'l29-psheet l31-psheet',onClose:()=>{clearInterval(live);st&&st.destroy();subs.delete(head)}}),B=s.el.querySelector('#l31P');s.el.setAttribute('aria-label',ch.name+' 的角色檔案');
 const H=B.querySelector('.pf-head'),T=B.querySelector('.pf-tabs'),BD=B.querySelector('.pf-body');
 const head=()=>{const t=G3()?LF().ptype(ch):{name:'',think:''},m=moodOf(ch.id),isle=onIsle(ch.id),ctl=isCtrl(ch.id);const html=`<span class="pf-av">${artHTML(ch)}</span><div class="pf-hi"><b>${E(ch.name)}</b><small>${t.name}・${t.think}</small><span class="pf-st">${ctl?'<i class="b-ctl">操控中</i>':''}${isle?`<i class="b-isle">在島上</i><i class="b-m">${m.e} ${m.n}</i>`:'<i class="b-off">在家休息</i>'}</span></div><div class="pf-hb"><button class="btn sm" data-edit>${ic('edit')}編輯</button><button class="btn sm icon" data-more aria-label="更多">${ic('more')}</button></div>`;const sg=artSig(html);if(H._v!==sg){H.innerHTML=html;H._v=sg}};
 const tabs=()=>{T.innerHTML=PT.map(([k,v])=>`<button class="${k===tab?'on':''}" role="tab" aria-selected="${k===tab}" data-tab="${k}">${v}</button>`).join('');T.querySelector('.on')?.scrollIntoView({inline:'center',block:'nearest'})};
 const body=()=>{st&&st.destroy();st=null;let h='';
  if(tab==='now'){const isle=onIsle(ch.id),ctl=isCtrl(ch.id);h=`<div class="pf-pv"><div class="stage pv" id="l31Stage"></div><div class="pf-pvb">${[['idle','待機'],['walk','走路'],['happy','開心'],['hop','跳跳'],['sleep','睡覺']].map(([k,v])=>`<button class="chip" data-pv="${k}">${v}</button>`).join('')}</div></div>
   <div class="pf-ctl"><button class="btn ${isle?'on':''}" data-isle>${isle?'✓ 在小島上':'＋ 加入小島'}</button><button class="btn ${ctl?'primary':''}" data-ctrl>${ctl?'● 目前操控':'設為操控夥伴'}</button></div>
   <div class="l29-h">現在</div><div class="pf-now"><div><small>正在</small><b data-live="act">${E(activity(ch.id))}</b></div><div><small>心情</small><b data-live="mood">${moodOf(ch.id).e} ${moodOf(ch.id).n}</b></div></div>${needsHTML(ch.id)}
   <div class="l29-h">心願與請求</div><div data-live="wish">${wishHTML(ch)}</div><div class="l29-h">基本資料</div>${basicHTML(ch)}`}
  else if(tab==='pers'){const P=IsleLifeUI.parts,x=LF().X(ch.id),sp=ch.data.speech||{};h=P.typeCard(ch)+`<p class="pf-desc">${E(ch.desc||'')}</p><div class="l29-h">性格特質</div><div class="pf-chips">${LF().traits(ch).map(t=>`<span>${t.em||'✨'} ${E(t.t)}${x.acq[t.id]?'<i>後天</i>':''}</span>`).join('')||'<em>尚未設定特質</em>'}</div><div class="l29-h">對日常的影響</div>${P.effectSummary(ch)}
   <div class="l29-h">個人特徵與小怪癖</div><div class="pf-chips q">${Object.keys(L29.Q).map(k=>{const v=LF().Q(ch.id,k),o=L29.Q[k].o.find(z=>z[0]===v);return `<span><small>${L29.Q[k].t}</small>${o?o[1]:v}</span>`}).join('')}${(x.habits||[]).filter(hb=>!hb.off).map(hb=>`<span><small>習慣</small>${E(L29.HABITS.find(z=>z[0]===hb.id)?.[1]||hb.name||hb.id)}</span>`).join('')}${x.cq.map(q=>`<span><small>自訂</small>${E(q.name)}</span>`).join('')}</div>
   ${sp.self||sp.tic||sp.catch?`<div class="l29-h">口癖</div><div class="pf-chips">${sp.self?`<span><small>自稱</small>${E(sp.self)}</span>`:''}${sp.tic?`<span><small>句尾</small>${E(sp.tic)}</span>`:''}${sp.catch?`<span><small>口頭禪</small>${E(sp.catch)}</span>`:''}</div>`:''}<div class="pf-row2"><button class="btn" data-edit="pers">編輯個性</button><button class="btn" data-edit="quirk">編輯小怪癖</button></div>`}
  else if(tab==='grow'){h=`<div class="l29-h">興趣與技能</div>${G3()?L30UI.skillsHTML(ch):''}<div class="l29-h">後天特質與習慣</div><div data-grow></div>`}
  else if(tab==='life'){h=`<div class="l29-h">生活節奏</div>${IsleLifeUI.parts.rhythm(ch)}<div class="l29-h">飲食喜好</div>${foodHTML(ch)}<div class="l29-h">興趣與喜好</div><div class="pf-chips">${[...(ch.data.interests||[]),...(ch.data.likes||[])].map(v=>`<span>${E(v)}</span>`).join('')||'<em>尚未設定</em>'}</div>${(ch.data.dislikes||[]).length?`<div class="l29-h">不喜歡</div><div class="pf-chips">${ch.data.dislikes.map(v=>`<span>${E(v)}</span>`).join('')}</div>`:''}${(ch.data.habits||[]).length?`<div class="l29-h">生活習慣（自訂）</div><div class="pf-chips">${ch.data.habits.map(v=>`<span>${E(v)}</span>`).join('')}</div>`:''}<button class="btn wide" data-edit="basic">編輯興趣與喜好</button>`}
  else if(tab==='goal')h=`<div class="l29-h">生活目標</div>${G3()?L30UI.goalsHTML(ch):''}`;
  else if(tab==='rel')h=`<div class="l29-h">人際關係</div>${relHTML(ch)}`;
  else if(tab==='mem')h=memHTML(ch,mf);
  BD.innerHTML=h;if(tab==='grow')IsleLifeUI.parts.growth(ch,BD.querySelector('[data-grow]'));
  if(tab==='now'){const host=BD.querySelector('#l31Stage');try{st=new Stage(host,{auto:true,size:(W,H)=>H*.66});st.setChar(ch,false);st.start();LF().dressActor(st.actor,ch.id);setTimeout(()=>st&&st.say(Persona.line(ch,'idle'),2600),500)}catch(e){st=null}}};
 const tick=()=>{if(s.closed)return;head();if(tab!=='now')return;const n=nodeOf(ch.id);const set=(k,v)=>{const e=BD.querySelector(`[data-live="${k}"]`);txt(e,v)};set('act',activity(ch.id));const m=moodOf(ch.id);set('mood',m.e+' '+m.n);
  if(n){const nd=LF().needs(n);BD.querySelectorAll('[data-need]').forEach(r=>{const v=Math.round(nd[r.dataset.need]*100),em=r.querySelector('em'),sm=r.querySelector('small');const w=v+'%';if(em.style.width!==w)em.style.width=w;txt(sm,String(v));r.classList.toggle('low',v<25)})}
  const wb=BD.querySelector('[data-live="wish"]');if(wb){const w=wishHTML(ch);if(wb._v!==w){wb.innerHTML=w;wb._v=w}}};
 head();tabs();body();subs.add(head);live=setInterval(tick,2000);
 B.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!B.contains(b))return;const d=b.dataset;
  if(d.tab){if(d.tab!==tab){tab=d.tab;buzz(5);tabs();body();BD.scrollTop=0;B.scrollTop=0}return}
  if(d.edit!==undefined){const t={food:'food',pers:'pers',quirk:'quirk',basic:'basic'}[d.edit]||'look';s.close();setTimeout(()=>Ed.open(ch.id,t),260);return}
  if(d.more!==undefined){charMenu(ch,()=>{if(!Chars.byId(ch.id))s.close()});return}
  if(d.isle!==undefined){setIsland(ch.id,!onIsle(ch.id));body();return}if(d.ctrl!==undefined){control(ch.id);body();return}
  if(d.pv&&st){buzz(5);const k=d.pv;if(k==='walk')st.walkTo(st.x<st.W/2?st.maxX*.9:st.minX+st.size*.4);else if(k==='happy'){st.play('happy');try{LF().react({s:st},LF().Q(ch.id,'happy'))}catch(_){}}else if(k==='hop')st.hop();else st.play(k);return}
  if(d.help!==undefined){const n=nodeOf(ch.id);if(n&&LF().helpWish(n)){toast('出發去實現心願！','sparkle');s.close();if(Nav.cur!==0)Nav.go(0)}else toast('牠現在正在忙','info');return}
  if(d.go2!==undefined){goRequest(ch.id)&&s.close();return}if(d.shop!==undefined){s.close();setTimeout(()=>{Shop.open();if(d.shop)setTimeout(()=>Shop.detail(d.shop),400)},260);return}
  if(d.gact){L30UI.goalClick(b,()=>body());return}if(d.rp){L30UI.replay(d.rp,ch.id);return}if(d.mf){mf=d.mf;buzz(5);body();return}
  if(d.alljr!==undefined){s.close();setTimeout(()=>L30UI.journalSheet(ch.id),260);return}if(d.evrules!==undefined){s.close();setTimeout(()=>OCSEventUI.open('rules'),260);return}
  if(d.comm){s.close();setTimeout(()=>CM().open(d.comm),260);return}
  if(d.chat){const a=nodeOf(ch.id),o=nodeOf(d.chat);if(a&&o&&!CM().busy(a)&&!CM().busy(o)){CM().interrupt(a);CM().interrupt(o);if(CM().encounter(a,o,'chat')){buzz(8);toast(`${nm(ch)} 和 ${nm(Chars.byId(d.chat))} 開始聊天了，回小島就能看到`,'sparkle');b.disabled=true;b.textContent='聊天中…';}else toast('牠們剛聊過，等一下再試試','info')}else toast('牠們現在正在忙','info');return}});
 return s}
function goRequest(id){const n=nodeOf(id),r=n&&G3().P(id).req;if(!r||r.k!=='go')return false;CM().interrupt(n);const act={dock:'fish',meadow:'flowers',bench:'sunset',tree:'shade',campfire:'campfire'}[r.place];if(!IsleWorld.Act.start(n,act))return false;const chk=setInterval(()=>{if(n.task?.arrived){clearInterval(chk);G3().reqDone(n,'go',{place:r.place})}else if(!n.task)clearInterval(chk)},500);toast('一起出發！','sparkle');if(Nav.cur!==0)Nav.go(0);return true}

/* ---------- 3. 編輯器：飲食喜好移到這裡 ---------- */
function patchEditor(){const T=Ed.TABS;if(!T.some(t=>t[0]==='food')){const i=T.findIndex(t=>t[0]==='life');T.splice(i>=0?i:T.length,0,['food','飲食喜好'])}
 // 「生活」分頁是查看用的資訊，已整合到角色檔案；編輯器只保留可修改的內容
 const li=T.findIndex(t=>t[0]==='life');if(li>=0)T.splice(li,1);
 Ed.t_food=function(){const ch=this.ch,b=el('<div class="l29-ed"></div>');let L=[];try{L=Taste.list(ch)||[]}catch(_){}
  b.append(UI.h('飲食喜好'),el(`<div class="ed-note">${ic('sparkle')}<span>設定牠喜歡或討厭的口味、食材與單品。沒有設定的部分，牠會在吃東西時自己慢慢探索。</span></div>`),el(`<div class="pf-food"><div><small>已品嚐</small><b>${L.length} 種</b></div><div><small>喜歡</small><b>${L.filter(x=>x.sc>=.5).length} 種</b></div></div>`));
  const go=el(`<button class="btn primary wide">${ic('sliders')}開啟口味設定</button>`);go.onclick=()=>{buzz(8);Taste.open(ch)};b.append(go);
  b.append(UI.h('相關喜好'),el('<p class="l29-note">「興趣、喜好、厭惡」可在「基本」分頁編輯，會一起影響牠想吃什麼。</p>'));return b};
 const oo=Ed.open.bind(Ed);Ed.open=function(id,tab){if(tab==='life')tab='pers';return oo(id,tab)}}
function removeDupTaste(){const ob=Bag.openFull;Bag.openFull=function(){const r=ob.apply(this,arguments);setTimeout(()=>document.querySelectorAll('#bgB .tz-bt').forEach(n=>n.remove()),60);return r};
 const oc=charMenu;charMenu=function(){const r=oc.apply(this,arguments);try{[...layer.querySelectorAll('.sheet [data-tz]')].forEach(n=>n.remove())}catch(_){}return r};
 document.getElementById('stLife')?.closest('div')?.querySelector('.sec')?.remove();document.getElementById('stLife')?.remove()}

/* ---------- 4. 首頁：點頭像開啟小巧的狀態面板 ---------- */
let QP=null,qT=0;
function quick(){if(QP){closeQuick();return}const home=document.getElementById('p-home');QP=document.createElement('div');QP.id='l31Quick';QP.className='l31-q';QP.setAttribute('role','dialog');QP.setAttribute('aria-label','夥伴狀態');home.append(QP);drawQuick(true);
 if(!reduce())QP.animate([{opacity:0,transform:'translateY(-10px) scale(.94)'},{opacity:1,transform:'none'}],{duration:320,easing:'cubic-bezier(.2,1.3,.35,1)'});document.getElementById('homeChip').setAttribute('aria-expanded','true');qT=setInterval(()=>drawQuick(false),1500)}
function closeQuick(){if(!QP)return;const q=QP;QP=null;clearInterval(qT);document.getElementById('homeChip')?.setAttribute('aria-expanded','false');if(reduce()){q.remove();return}q.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-8px) scale(.96)'}],{duration:160,easing:'ease-in',fill:'forwards'}).onfinish=()=>q.remove()}
function drawQuick(full){if(!QP)return;const ch=Chars.active();if(!ch)return;const n=nodeOf(ch.id),m=moodOf(ch.id),t=LF().ptype(ch);
 if(full||QP.dataset.id!==ch.id){QP.dataset.id=ch.id;const res=[...(CM()?.nodes.values()||[])];
  QP.innerHTML=`<div class="q-h"><span class="q-av">${artHTML(ch)}</span><div><b>${E(ch.name)}</b><small>${t.name}</small></div><span class="q-m" data-q="mood"></span></div>
   <div class="q-now"><small>正在</small><b data-q="act"></b></div><div class="q-needs">${NEEDS.map(([k,tt,c,i])=>`<div class="qn" data-need="${k}" style="--c:${c}"><span>${i}</span><i><em></em></i></div>`).join('')}</div><div data-q="wish"></div>
   <div class="q-res"><small>切換操控</small><div class="q-avs">${res.map(r=>`<button class="q-r ${r.id===ch.id?'on':''}" data-cid="${r.id}" aria-label="操控 ${E(r.s.ch.name)}"><span>${artHTML(r.s.ch)}</span></button>`).join('')}<button class="q-r add" data-mng aria-label="出場管理">${ic('plus')}</button></div></div>
   <div class="q-btns"><button class="btn sm primary" data-prof>完整檔案</button><button class="btn sm" data-close2>收起</button></div>`}
 const set=(k,v,html)=>{const e=QP.querySelector(`[data-q="${k}"]`);if(!e)return;if(html){if(e._v!==v){e.innerHTML=v;e._v=v}}else txt(e,v)};
 set('mood',`${m.e} ${m.n}`);set('act',activity(ch.id));
 if(n){const nd=LF().needs(n);QP.querySelectorAll('[data-need]').forEach(r=>{const w=Math.round(nd[r.dataset.need]*100)+'%',em=r.querySelector('em');if(em.style.height!==w)em.style.height=w;r.classList.toggle('low',nd[r.dataset.need]<.25)})}
 const x=LF().X(ch.id),r=G3()?.P(ch.id).req;set('wish',x.wish?`<div class="q-w">💭 ${E(LF().wishLabel(x.wish))}</div>`:r?`<div class="q-w rq">💌 ${E(G3().reqText(r))}</div>`:'',true)}
function bindQuick(){const chip=document.getElementById('homeChip');if(!chip)return;chip.onclick=null;document.addEventListener('click',e=>{if(!e.target.closest('#homeChip'))return;e.stopImmediatePropagation();e.preventDefault();buzz(6);quick()},true);chip.setAttribute('aria-haspopup','dialog');chip.setAttribute('aria-label','查看夥伴狀態與切換操控');
 document.addEventListener('pointerdown',e=>{if(QP&&!e.target.closest('#l31Quick,#homeChip'))closeQuick()},true);
 document.getElementById('p-home').addEventListener('click',e=>{if(!QP||!e.target.closest('#l31Quick'))return;const b=e.target.closest('button');if(!b)return;buzz(6);const d=b.dataset;
  if(d.cid){control(d.cid);drawQuick(true)}else if(d.mng!==undefined){closeQuick();Nav.go(1)}else if(d.prof!==undefined){const id=Chars.active().id;closeQuick();profile(id)}else if(d.close2!==undefined)closeQuick()});
 const ng=Nav.go;Nav.go=function(){closeQuick();return ng.apply(this,arguments)};subs.add(()=>{if(QP)drawQuick(true)});
 window.openSwitcher=()=>{if(Nav.cur!==0)Nav.go(0);setTimeout(quick,320)};}

/* ---------- 5. 小島日常、更多選單、工坊模組：整理入口 ---------- */
function photoMode(){if(document.body.classList.contains('l31-photo'))return;document.getElementById('hudRail')?.classList.remove('open');document.body.classList.add('l31-photo');
 const bar=el(`<div class="l31-photo-bar" role="toolbar" aria-label="拍照模式"><span>📷 拍照模式</span><button class="btn sm primary" data-shot>拍照</button><button class="btn sm" data-exit>離開</button></div>`);document.getElementById('p-home').append(bar);
 bar.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.exit!==undefined){document.body.classList.remove('l31-photo');bar.remove();return}
  buzz([14,40,10]);const f=document.createElement('i');f.className='isle-flash';document.getElementById('p-home').append(f);if(!reduce())f.animate([{opacity:0},{opacity:.85,offset:.12},{opacity:0}],{duration:480}).onfinish=()=>f.remove();else f.remove();
  for(const n of CM().nodes.values()){if(CM().busy(n))continue;n.facing='front';try{LF().react(n,LF().Q(n.id,'happy'))}catch(_){}}const a=nodeOf(Cfg.v.active);if(a)IsleWorld.Act.say(a,'茄子～！',2.2,true);setTimeout(()=>toast('用手機的截圖功能把這一刻存下來吧','info'),700)}}
function tidyRail(){const ext=document.querySelector('#hudRail .rail-ext');if(!ext)return;['#railEnv','#evHistory'].forEach(s=>ext.querySelector(s)?.remove());ext.querySelector('[data-go=studio]')?.remove();
 const q=ext.querySelector('[data-go=quest]');if(q&&!ext.querySelector('[data-l31=codex]')){const c=document.createElement('button');c.className='rail-btn';c.dataset.l31='codex';c.setAttribute('aria-label','收藏圖鑑');c.title='收藏圖鑑';c.innerHTML=ic('book',22)+'<span>收藏圖鑑</span>';const shop=ext.querySelector('[data-hub=shop]');(shop||q).after(c)}
 const cam=ext.querySelector('[data-go=camera]');if(cam){const sp=cam.querySelector('span');if(sp)sp.textContent='拍照模式';cam.setAttribute('aria-label','拍照模式')}
 document.getElementById('hudRail').addEventListener('click',e=>{const b=e.target.closest('[data-l31],[data-go=camera]');if(!b)return;e.stopImmediatePropagation();e.preventDefault();buzz(6);const R=document.getElementById('hudRail');R.classList.remove('open');R.querySelector('[data-go=toggle]')?.setAttribute('aria-expanded','false');if(b.dataset.l31==='codex')L30UI.codex();else photoMode()},true);
 ext.querySelectorAll('.rail-btn').forEach((b,k)=>b.style.setProperty('--k',k))}
function patchMore(){const om=openMore;window.openMore=openMore=function(){const r=om.apply(this,arguments);try{const sh=[...layer.querySelectorAll('.sheet')].pop();if(!sh)return r;sh.querySelector('[data-community-entry]')?.remove();
  const fix={背包:()=>Bag.full(),商店:()=>Shop.open(),相機:()=>{Nav.go(0);setTimeout(photoMode,300)}};
  sh.querySelectorAll('.row[data-i]').forEach(row=>{const t=row.querySelector('b')?.textContent;if(fix[t]){row.querySelector('.tag.soon')?.replaceWith(el(ic('right')));if(t==='相機'){row.querySelector('b').textContent='拍照模式';row.querySelector('small').textContent='隱藏介面，讓夥伴擺姿勢'}row.dataset.fix=t}});
  sh.addEventListener('click',e=>{const row=e.target.closest('[data-fix]');if(!row)return;e.stopImmediatePropagation();const f=fix[row.dataset.fix];Ov.back();setTimeout(f,280)},true)}catch(e){}return r}}
function patchStudio(){const box=document.getElementById('stMods');if(!box)return;const act=()=>Chars.active();
 const M=[['shirt','外觀與裝扮','捏臉、服裝與飾品；穿搭在首頁「小島日常 → 換裝」',()=>Ed.open(Cfg.v.active,'look')],
  ['film','動作與動畫','匯入影格或 Sprite Sheet，製作待機、行走等動畫',()=>{const c=act();if(c.kind==='custom'&&window.AnimUI)AnimUI.open(c);else{toast('動畫工作室適用於自己匯入或原創的角色','info');Ed.open(c.id,'asset')}}],
  ['smile','表情','為不同情緒指定表情素材',()=>Ed.open(Cfg.v.active,'asset')],
  ['chat','對話與劇情','自訂台詞與特殊互動事件',()=>OCSEventUI.open('rules')],
  ['route','行為模式','性格、特質與小怪癖，會改變牠的自主生活',()=>Ed.open(Cfg.v.active,'pers')],
  ['mic','語音','替互動與事件加入角色語音',null]];
 box.innerHTML=M.map((m,i)=>`<button class="row btn-row" data-m31="${i}"><span class="r-ic soft">${ic(m[0])}</span><div class="r-t"><b>${m[1]}</b><small>${m[2]}</small></div>${m[3]?ic('right'):'<span class="tag soon">規劃中</span>'}</button>`).join('');
 box.addEventListener('click',e=>{const b=e.target.closest('[data-m31]');if(!b)return;e.stopImmediatePropagation();buzz(6);const m=M[+b.dataset.m31];if(m[3])m[3]();else infoSheet(MODS[3])},true);
 document.getElementById('evEntry')?.remove()}
function patchExplore(){const eh=Explore.hero.bind(Explore);Explore.hero=function(){const r=eh();try{const b=document.getElementById('exSwitch');if(b){b.textContent='查看角色檔案';b.onclick=()=>profile(Cfg.v.active)}}catch(_){}return r};Explore.hero()}

/* ---------- 6. 完成請求的演出（依請求類型與個性） ---------- */
const CUP='<svg viewBox="0 0 24 24"><path d="M5 7H19L17 21H7Z" fill="#BFE6FF" stroke="#62B8E6" stroke-width="1.6"/><path d="M6 11H18" stroke="#62B8E6" stroke-width="1.2"/></svg>';
function floatOver(n,html,dur=1800){if(reduce()||!CM().world)return;const W=IsleWorld.W,H=IsleWorld.H,d=document.createElement('i');d.className='l31-float';d.innerHTML=html;d.style.left=(n.x*W)+'px';d.style.top=(n.y*H-n.s.size*1.1)+'px';d.style.zIndex='290000';CM().world.append(d);
 d.animate([{opacity:0,transform:'translate(-50%,10px) scale(.4)'},{opacity:1,transform:'translate(-50%,-10px) scale(1.1)',offset:.25},{opacity:1,transform:'translate(-50%,-14px) scale(1) rotate(8deg)',offset:.75},{opacity:0,transform:'translate(-50%,-30px) scale(.8)'}],{duration:dur,easing:'cubic-bezier(.3,1.3,.5,1)',fill:'both'}).onfinish=()=>d.remove()}
window.L31ReqFx=(n,r,amt)=>{const s=n.s,Lf=LF(),QA=Lf.QA,it=r.item&&Items.get(r.item);CM().interrupt(n);n.next=CM().clock+8;
 const seq={drink:()=>{floatOver(n,CUP,1600);Lf.an(s,[{rotate:'0deg'},{rotate:'-12deg',offset:.3},{rotate:'-12deg',offset:.75},{rotate:'0deg'}],1400);setTimeout(()=>Lf.sparkFx(s,5,26),1300)},
  food:()=>{QA.chew(s,2200);setTimeout(()=>{s.hearts(2);QA.hop(s)},2000)},
  toy:()=>{if(it)floatOver(n,Items.icon(it),2000);QA.hop(s);setTimeout(()=>QA.hop(s),650);setTimeout(()=>Lf.notesFx(s,2),900)},
  gift:()=>{QA.blush(s);setTimeout(()=>QA.hug(s),500);setTimeout(()=>s.hearts(3),1100)},
  pet:()=>{Lf.an(s,[{scale:'1'},{scale:'1.06 .94'},{scale:'.97 1.03'},{scale:'1'}],900,'ease-in-out',2);setTimeout(()=>s.hearts(2),400)},
  go:()=>{try{s.go('look')}catch(_){}setTimeout(()=>Lf.sparkFx(s,6,30),500)},
  buy:()=>{if(it)floatOver(n,Items.icon(it),2400);QA.spin(s);setTimeout(()=>Lf.sparkFx(s,8,40),500)}}[r.k];try{seq&&seq()}catch(_){}
 const ch=s.ch,txt=G3().reqText(r);const d=el(`<div class="l31-done" role="status"><span class="l30-av">${artHTML(ch)}</span><div><small>${E(nm(ch))} 的請求完成</small><b>${E(txt)}</b><em>+${amt} 星幣・親密度 +6</em></div></div>`);document.body.append(d);
 if(!reduce())d.animate([{opacity:0,transform:'translate(-50%,16px) scale(.9)'},{opacity:1,transform:'translate(-50%,0) scale(1)'}],{duration:380,easing:'cubic-bezier(.2,1.3,.35,1)',fill:'both'});setTimeout(()=>{if(reduce()){d.remove();return}d.animate([{opacity:1},{opacity:0,transform:'translate(-50%,10px)'}],{duration:220,fill:'forwards'}).onfinish=()=>d.remove()},2800)};

/* ---------- 7. 穩定性 ---------- */
function stabilize(){
 // 首頁頭像：資料沒變時不重建，避免每次 HUD 更新都閃一下
 Home.refreshChip=function(){const c=Chars.active(),av=document.getElementById('homeAv');if(av){const h=thumbHTML(c),sg=c.id+artSig(h);if(av._sg!==sg){av.innerHTML=h;av._sg=sg}}HUD.refresh()};
 // 舊版檔案每 2.5 秒整頁重繪（捲動跳動、閃爍）→ 改用新的檔案頁（局部更新）
 IsleLifeUI.profile=profile;window.L30Tabs=[];
 // 夥伴管理入口統一：舊的「操控哪位夥伴」面板改為狀態面板
}

/* ---------- 啟動 ---------- */
const wait=setInterval(()=>{try{if(!(window.OCSCommunity?.ready&&window.IsleLife&&window.L30&&window.IsleLifeUI?.parts&&window.L30UI&&document.getElementById('charGrid')&&Ed.TABS))return;clearInterval(wait);
 stabilize();bindChars();patchEditor();removeDupTaste();bindQuick();tidyRail();patchMore();patchStudio();patchExplore();
 window.L31={profile,setIsland,control,quick,photoMode,changed}}catch(e){console.error('[3.1]',e);clearInterval(wait)}},200);
})();
