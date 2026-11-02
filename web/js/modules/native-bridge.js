/* ===== 3.3 Android 原生橋接：系統級桌面夥伴（懸浮桌寵） =====
   The game is the single source of truth. It pushes a snapshot of the chosen
   characters (art, lines, personality, current needs/mood) to the native overlay
   service and, when it comes back to the foreground, applies what happened on the
   desktop (petting, carrying, pets meeting) to needs, bond, memories and relations.
   Browser builds keep working: every native call is optional. */
(()=>{'use strict';
const N=()=>window.OCNative||null;
const call=(n,...a)=>{const o=N();try{return o&&typeof o[n]==='function'?o[n](...a):undefined}catch(e){console.warn('[native]',n,e);return undefined}};
const MAX_PETS=3;
const DEF={on:false,ids:[],scale:1,activity:1,chatter:1,fps:30,climb:true,interact:true,hideInApp:true,opacity:1,bubbles:true};
const S=()=>{const v=Cfg.v;if(!v.desk||typeof v.desk!=='object')v.desk={};const d=v.desk;for(const k in DEF)if(d[k]===undefined)d[k]=Array.isArray(DEF[k])?[]:DEF[k];
  d.ids=(Array.isArray(d.ids)?d.ids:[]).filter(id=>typeof id==='string').slice(0,MAX_PETS);return d};
const save=()=>{Cfg.save();pushSettings();schedule()};

/* ---------- snapshot ---------- */
const blobToData=b=>new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.onerror=()=>r('');f.readAsDataURL(b)});
async function artOf(ch){let h=artHTML(ch);
  if(ch.url&&ch.rec&&ch.rec.blob){const d=await blobToData(ch.rec.blob);h=h.replace(ch.url,d)}
  return h.replace(/src="blob:[^"]*"/g,'')}
const DEF_LINES={greet:['嗨！你也在這裡呀。','一起玩吧～','找到你了！'],climb:['爬高高～','這裡看得好遠！','嘿咻嘿咻。'],
  wake:['嗯…？你叫我嗎？','呼啊～睡飽了。'],drop:['哇啊——！','咚！好暈…','輕一點啦～'],pet:['好舒服～','嘿嘿，謝謝你。','再摸一下下…'],idle:['今天也一起加油吧。','你在忙什麼呀？','嘿嘿。']};
function linesOf(ch){const out={},d=ch.data||{},own=d.lines||{},base=ch.lines||{};
  for(const k of ['idle','pet','wake','drop','greet','call','climb']){const a=[...(own[k]||[]),...(d.linesMode==='override'&&(own[k]||[]).length?[]:(base[k]||[]))];
    out[k]=(a.length?a:(DEF_LINES[k]||LINES[k]||[])).slice(0,24).map(s=>String(s).slice(0,80))}
  const sp=d.speech||{};if(sp.catch)out.idle.push(String(sp.catch).slice(0,60));return out}
const MOODN={happy:'開心',excited:'興奮',calm:'平靜',sad:'有點難過',angry:'不太高興',shy:'害羞',tired:'累了',bored:'無聊'};
function statusOf(ch){const n=window.OCSCommunity?.nodes?.get(ch.id),L=window.IsleLife;let nd=null;
  try{nd=n&&L?L.needs(n):(L?.X(ch.id).needs||null)}catch(e){}
  const v=k=>nd&&Number.isFinite(+nd[k])?+(+nd[k]).toFixed(2):.7;const emo=n?.emo?.id||'';
  const mood=emo?({happy:.9,excited:.95,calm:.7,shy:.6,bored:.4,tired:.45,sad:.25,angry:.2})[emo]??.6:.65;
  return{hunger:v('hunger'),thirst:v('thirst'),energy:v('energy'),sleep:v('sleep'),fun:v('fun'),social:v('social'),mood,moodLabel:MOODN[emo]||'還不錯',activity:n?.task?.act?'剛剛在島上忙著生活':''}}
function personalityOf(ch){let e={};try{e=Persona.eff(ch.data)}catch(_){}const g=k=>((e[k]??50)/100);
  const tr=(ch.data?.pers?.traits||[]).join(' ');
  return{activity:+(0.7+g('lively')*.6+g('pace')*.2).toFixed(2),curiosity:+(g('expr')*.4+(/curious|explor/.test(tr)?.5:.25)).toFixed(2),
    social:+g('social').toFixed(2),sleepy:+(Math.max(0,.55-g('lively')*.5)+(/lazy|napper|sleep/.test(tr)?.3:0)).toFixed(2)}}
async function snapshot(){const d=S(),pets=[];
  for(const id of d.ids){const ch=Chars.byId(id);if(!ch)continue;
    pets.push({id:ch.id,name:ch.name,kind:ch.kind,art:await artOf(ch),facing:ch.facing||'right',adjust:{ox:ch.ox||0,oy:ch.oy||0,scale:ch.scale||1},
      size:Math.round(92*(Cfg.v.size||100)/100),lines:linesOf(ch),status:statusOf(ch),personality:personalityOf(ch),
      theme:document.documentElement.dataset.theme,mood:window.OCSCommunity?.nodes?.get(ch.id)?.emo?.id||''})}
  return{v:1,ts:Date.now(),pets}}
let synT=0,lastSnap='';
function schedule(ms=900){clearTimeout(synT);synT=setTimeout(sync,ms)}
async function sync(){if(!N())return;const snap=await snapshot(),js=JSON.stringify(snap),sig=js.replace(/"ts":\d+,/,'');
  if(sig===lastSnap)return;lastSnap=sig;call('syncPets',js)}
function pushSettings(){const d=S();call('setOverlaySettings',JSON.stringify({scale:d.scale,activity:d.activity,chatter:d.chatter,fps:effFps(),climb:d.climb,interact:d.interact,
  hideInApp:d.hideInApp,opacity:d.opacity,bubbles:d.bubbles&&Cfg.v.bubbles!==false,haptics:Cfg.v.haptics!==false,reduceMotion:document.documentElement.dataset.motion==='reduce'}))}
const effFps=()=>{const p=window.OCSPerf?.cfg?.();return Math.min(S().fps,p?.overlayFps||60)};

/* ---------- desktop → game ---------- */
function applyEvents(){const raw=call('drainPetEvents');if(!raw)return;let ev=[];try{ev=JSON.parse(raw)}catch(e){return}if(!Array.isArray(ev)||!ev.length)return;
  const L=window.IsleLife,C=window.OCSCommunity,count={};
  for(const e of ev.slice(-300)){if(!e||typeof e.id!=='string'||!Chars.byId(e.id))continue;const id=e.id;
    if(e.type==='pet'){count[id]=(count[id]||0)+1;Eco.v.bond[id]=(Eco.v.bond[id]||0)+4;Eco.v.q.pet=(Eco.v.q.pet||0)+1;
      const n=C?.nodes?.get(id);if(n&&L){const nd=L.needs(n);nd.social=Math.min(1,nd.social+.06);nd.fun=Math.min(1,nd.fun+.03)}}
    if(e.type==='meet'&&typeof e.with==='string'&&Chars.byId(e.with)&&C?.pair){try{const p=C.pair(id,e.with);p.score=Math.min(100,(p.score||0)+1.5);p.count=(p.count||0)+1;p.last=Date.now()}catch(_){}
      try{L?.memo({id},`在手機桌面上遇見了${Chars.byId(e.with).name}`,{place:'手機桌面'})}catch(_){}}}
  const ids=Object.keys(count);
  ids.forEach(id=>{try{L?.memo({id},`在手機桌面上被摸摸了 ${count[id]} 次`,{place:'手機桌面'})}catch(_){}});
  Eco.save();try{HUD.refresh()}catch(_){}Cfg.save();
  if(ids.length){const names=ids.map(id=>Chars.byId(id).name).slice(0,2).join('、');setTimeout(()=>toast(`你不在時，${names} 在桌面上被摸摸了`,'heart'),900)}}

/* ---------- public API ---------- */
const API={
  available:()=>!!N()&&!!call('platform'),
  state(){try{return JSON.parse(call('overlayState')||'{}')}catch(e){return{}}},
  ids:()=>S().ids.slice(),
  isPet:id=>S().ids.includes(id),
  async toggle(id,on){const d=S();on=on??!d.ids.includes(id);
    if(on&&!d.ids.includes(id)){if(d.ids.length>=MAX_PETS){toast(`桌面上最多 ${MAX_PETS} 位夥伴`,'info');return false}d.ids.push(id)}
    if(!on)d.ids=d.ids.filter(x=>x!==id);Cfg.save();lastSnap='';await sync();
    if(this.available()){if(d.ids.length&&d.on)call('setOverlayEnabled',true);if(!d.ids.length&&this.state().running){call('setOverlayEnabled',false)}}
    refreshUI();return true},
  async start(){const d=S();if(!this.available()){infoSheet({ic:'layers',t:'桌面夥伴',d:'需要安裝 Android 版 OC Shimeji 才能讓夥伴出現在手機桌面與其他 App 上方。',items:['瀏覽器版本仍可完整遊玩小島生活','在 Android 版的「設定 → 桌面夥伴」開啟','角色、心情與回憶與遊戲共用同一份存檔']});return false}
    if(!d.ids.length){d.ids=[Cfg.v.active].filter(Boolean)}
    if(!call('canDrawOverlays')){toast('請允許「顯示在其他應用程式上層」','info');call('requestOverlayPermission');d.on=true;Cfg.save();return false}
    lastSnap='';await sync();pushSettings();d.on=true;Cfg.save();const ok=call('setOverlayEnabled',true);if(ok)toast('夥伴已經跑到桌面上了！','sparkle');refreshUI();return ok},
  stop(){const d=S();d.on=false;Cfg.save();call('setOverlayEnabled',false);refreshUI()},
  command:c=>call('overlayCommand',c),
  sync:()=>{lastSnap='';return sync()},snapshot,
  onNativeResume(){applyEvents();refreshUI()},
  onNativePause(){lastSnap='';sync()},
  onPermissionResult(ok){if(ok&&S().on)API.start();else refreshUI()},
  settings:S,save,openManager:()=>openManager()};
window.OCSNative=API;

/* ---------- UI: manager sheet ---------- */
function openManager(){const d=S(),has=API.available();let s;
  const row=c=>`<button class="srow dk-pick ${d.ids.includes(c.id)?'on':''}" data-id="${esc(c.id)}"><span class="c">${thumbHTML(c)}</span><span class="t"><b>${esc(c.name)}</b><small>${esc(Chars.subOf(c))}</small></span><span class="ck">${ic('check')}</span></button>`;
  const st=has?API.state():{};
  s=openSheet(`<div class="sh-body dk"><div class="sh-title">桌面夥伴</div>
    <p class="dk-lead">${has?(st.running?'夥伴正在手機桌面陪伴你。':'選擇最多 3 位夥伴，讓牠們走出小島，在手機桌面與其他 App 上方陪你。'):'瀏覽器模式：安裝 Android 版後，夥伴就能走到手機桌面上。這裡的選擇會先保存。'}</p>
    <div class="dk-status">${has?`<span class="tag ${st.permission?'':'soon'}">${st.permission?'已授權懸浮':'尚未授權懸浮'}</span><span class="tag ${st.running?'':'soon'}">${st.running?(st.paused?'暫停中':st.hidden?'已隱藏':'執行中'):'未啟動'}</span>`:'<span class="tag soon">需要 Android 版</span>'}</div>
    <div class="sec">選擇夥伴（${d.ids.length}/${MAX_PETS}）</div><div class="dk-list">${Chars.list.map(row).join('')}</div>
    <div class="sec">顯示與行為</div><div class="group dk-opts"></div>
    <div class="dk-acts">${has&&st.running?`<button class="btn" data-k="pause">${st.paused?'繼續':'暫停'}</button><button class="btn" data-k="call">呼喚集合</button><button class="btn danger" data-k="stop">關閉</button>`:`<button class="btn primary" data-k="start">${ic('layers')}讓夥伴到桌面</button>`}</div></div>`);
  const g=s.el.querySelector('.dk-opts');
  const colRow=(icon,title,desc,ctrl)=>{const r=el(`<div class="row col"><div class="rh"><span class="r-ic">${ic(icon)}</span><div class="r-t"><b>${title}</b><small>${desc}</small></div></div></div>`);r.append(ctrl);return r};
  g.append(colRow('users','桌寵大小','在桌面上的尺寸',mkRange('大小',60,160,5,Math.round(d.scale*100),v=>v+'%',v=>{d.scale=v/100;save()})),
    colRow('route','活潑程度','走動、奔跑與攀爬的頻率',mkSeg([{v:'0.6',t:'安靜'},{v:'1',t:'普通'},{v:'1.5',t:'活潑'}],String(d.activity),v=>{d.activity=+v;save()})),
    colRow('chat','自言自語','在桌面上說話的頻率',mkSeg([{v:'0',t:'不說話'},{v:'0.5',t:'偶爾'},{v:'1',t:'普通'},{v:'2',t:'話多'}],String(d.chatter),v=>{d.chatter=+v;save()})),
    colRow('eye','透明度','降低後較不遮擋畫面',mkRange('透明度',40,100,5,Math.round(d.opacity*100),v=>v+'%',v=>{d.opacity=v/100;save()})),
    switchRow('up','攀爬螢幕邊緣','走到邊緣時可能往上爬',()=>d.climb,v=>{d.climb=v;save()}),
    switchRow('heart','夥伴互動','多位夥伴相遇時會打招呼',()=>d.interact,v=>{d.interact=v;save()}),
    switchRow('chat','對話氣泡','顯示桌寵說的話',()=>d.bubbles,v=>{d.bubbles=v;save()}),
    switchRow('monitor','開啟遊戲時隱藏','回到 App 時桌寵先躲起來，避免重複顯示',()=>d.hideInApp,v=>{d.hideInApp=v;save()}));
  s.el.addEventListener('click',async e=>{const p=e.target.closest('.dk-pick');if(p){buzz(8);const id=p.dataset.id,on=!d.ids.includes(id);if(await API.toggle(id,on)){p.classList.toggle('on',on);s.el.querySelector('.sec').textContent=`選擇夥伴（${S().ids.length}/${MAX_PETS}）`}return}
    const k=e.target.closest('[data-k]')?.dataset.k;if(!k)return;buzz(10);
    if(k==='start'){if(await API.start())s.close()}else if(k==='stop'){API.stop();s.close()}else if(k==='pause'){API.command('pause');s.close()}else if(k==='call'){API.command('call');s.close()}})}

/* ---------- UI wiring: settings row, character cards ---------- */
function refreshUI(){const r=document.getElementById('dkSetRow');if(r){const st=API.available()?API.state():{};r.querySelector('small').textContent=API.available()?(st.running?`執行中・${S().ids.length} 位夥伴`:'讓夥伴出現在手機桌面與其他 App 上方'):'安裝 Android 版後可使用'}
  document.querySelectorAll('#charGrid .oc-card').forEach(decorateCard)}
function decorateCard(card){const id=card.dataset.cid,acts=card.querySelector('.oc-acts');if(!acts)return;let b=acts.querySelector('[data-desk]');
  if(!b){b=document.createElement('button');b.className='oc-b oc-desk';b.dataset.desk='';acts.append(b)}
  const on=API.isPet(id);if(b._on!==on){b._on=on;b.innerHTML=on?'📱 桌寵中':'📱 桌寵';b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',on?'從手機桌面收回':'設為手機桌寵')}}
function wire(){
  const pc=document.getElementById('p-chars');
  pc&&pc.addEventListener('click',e=>{const b=e.target.closest('[data-desk]');if(!b)return;e.stopPropagation();e.preventDefault();buzz(8);
    const id=b.closest('.oc-card')?.dataset.cid;if(!id)return;const on=!API.isPet(id);
    API.toggle(id,on).then(ok=>{if(!ok)return;toast(on?(API.available()?(S().on?`${Chars.byId(id).name} 跑到桌面上了`:`已選為桌寵，在「設定 → 桌面夥伴」開啟`):`已選為桌寵（Android 版可顯示在桌面）`):`${Chars.byId(id).name} 回到小島了`,on?'sparkle':'check')})},true);
  const g=document.getElementById('charGrid');if(g)new MutationObserver(()=>g.querySelectorAll('.oc-card').forEach(decorateCard)).observe(g,{childList:true});
  const mk=Settings.make.bind(Settings);
  Settings.make=function(){mk();try{const body=this.body;const legacy=[...body.querySelectorAll('.row')].find(r=>/桌面懸浮窗/.test(r.textContent));
    const row=el(`<button class="row btn-row" id="dkSetRow"><span class="r-ic">${ic('layers')}</span><div class="r-t"><b>桌面夥伴（Android 懸浮桌寵）</b><small></small></div><span class="chev">${ic('right')}</span></button>`);
    row.onclick=()=>openManager();if(legacy)legacy.replaceWith(row);refreshUI()}catch(e){console.warn(e)}};
  Settings.make();
  refreshUI();
  // Keep the desktop snapshot fresh: character edits, theme, and needs drift.
  const p=Chars.patch.bind(Chars);Chars.patch=function(ch,o){const r=p(ch,o);if(API.isPet(ch.id))schedule(1500);return r};
  setInterval(()=>{if(N()&&S().ids.length&&!document.hidden)sync()},120000);
  if(N()){pushSettings();applyEvents();if(S().on&&S().ids.length)sync()}
}
const t=setInterval(()=>{if(typeof Settings==='undefined'||!Settings.body||!window.L31||!Chars.list.length)return;clearInterval(t);try{wire()}catch(e){console.error('[3.3 native]',e)}},150);
})();
