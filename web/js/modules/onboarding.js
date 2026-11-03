/* ===== 3.3 開場動畫・新遊戲流程・角色建立・登場演出・互動式新手引導 =====
   Flow: 歡迎 → 開場動畫（世界介紹）→ 開始新遊戲 → 選擇建立方式 → 選擇示範夥伴／捏我的 OC
         → 角色登場 → 互動式引導（真的點、真的拖）→ 自由生活
   • Existing saves are never interrupted: they are marked as onboarded silently.
   • Progress is saved (Cfg.v.ob); a half-finished first run resumes next launch.
   • Opening and tutorial can be skipped, paused and replayed from Settings. */
(()=>{'use strict';
const FIRST=window.OCS_FIRST_RUN===true;
const ST=()=>{const v=Cfg.v;if(!v.ob||typeof v.ob!=='object')v.ob={};return v.ob};
const reduce=()=>document.documentElement.dataset.motion==='reduce';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
let root=null,ovApi=null,backFn=null;

/* ---------- tiny procedural music (no assets; only after a user gesture) ---------- */
const Music={ctx:null,on:true,timer:0,
  start(){if(!this.on||this.ctx)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;this.ctx=new C();this.master=this.ctx.createGain();this.master.gain.value=.12;this.master.connect(this.ctx.destination);this.loop()}catch(e){}},
  note(f,t,d=.9,type='triangle',v=.5){const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+d+.05)},
  loop(){const c=this.ctx;if(!c)return;const P=[523.25,587.33,659.25,783.99,880,1046.5],B=[130.81,174.61,196,164.81];let t=c.currentTime+.05;
    for(let bar=0;bar<4;bar++){this.note(B[bar],t,1.9,'sine',.35);for(let i=0;i<4;i++){if(Math.random()<.82)this.note(P[(bar*2+i*3+Math.floor(Math.random()*2))%P.length],t+i*.48,.8)}t+=1.92}
    this.timer=setTimeout(()=>this.loop(),7600)},
  pause(){try{this.ctx?.suspend()}catch(_){}},resume(){try{this.ctx?.resume()}catch(_){}},
  stop(){clearTimeout(this.timer);const c=this.ctx;this.ctx=null;if(c){try{this.master.gain.linearRampToValueAtTime(0,c.currentTime+.6);setTimeout(()=>c.close(),800)}catch(_){}}}};

/* ---------- shell ---------- */
function mount(){if(root)return root;root=el('<div id="obRoot" class="ob" role="dialog" aria-modal="true" aria-label="新遊戲"><div class="ob-scr-wrap"></div></div>');($('#app')||document.body).append(root);
  try{window.OCS_HIDE_SPLASH&&window.OCS_HIDE_SPLASH()}catch(_){}document.documentElement.classList.add('ob-open');
  // Registering as an overlay pauses the island simulation underneath and routes the Android back key here.
  ovApi={el:root,close:()=>{try{backFn&&backFn()}catch(_){}Ov.stack.includes(ovApi)||Ov.push(ovApi)}};try{Ov.push(ovApi)}catch(_){}return root}
function unmount(){if(!root)return;const r=root;root=null;try{Ov.remove(ovApi)}catch(_){}ovApi=null;backFn=null;document.documentElement.classList.remove('ob-open');r.classList.add('out');setTimeout(()=>r.remove(),700)}
function show(html,cls=''){const w=mount().querySelector('.ob-scr-wrap'),old=w.querySelector('.ob-scr:not(.leaving)');const s=el(`<section class="ob-scr ${cls}">${html}</section>`);w.append(s);fillIcons(s);
  if(old){old.classList.add('leaving');setTimeout(()=>old.remove(),reduce()?0:520)}requestAnimationFrame(()=>s.classList.add('in'));return s}
const SV={'play': '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>', 'pause': '<svg viewBox="0 0 24 24" width="16" height="16"><rect x="6.5" y="5.5" width="4" height="13" rx="1.2" fill="currentColor"/><rect x="13.5" y="5.5" width="4" height="13" rx="1.2" fill="currentColor"/></svg>', 'son': '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>', 'soff': '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>', 'skip': '<svg viewBox="0 0 24 24" width="15" height="15"><path d="M5 6v12l8-6zM13 6v12l8-6z" fill="currentColor"/></svg>'};
const btn=(k,t,cls='')=>`<button class="ob-btn ${cls}" data-k="${k}">${t}</button>`;
function on(s,map){s.addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(!b||b.disabled)return;const f=map[b.dataset.k];if(f){buzz(8);f(b,e)}})}

/* mini actor (game's own art + CSS animation states) */
function actorHTML(ch,state='idle'){return `<div class="ob-actor stage"><div class="actor" data-state="${state}"><div class="a-flip"><div class="a-tilt"><div class="a-pose"><div class="a-squash"><div class="art"><div class="adj">${ch.svg||artHTML(ch)}</div></div></div></div></div></div></div></div>`}
function blinkAll(){if(!root)return;root.querySelectorAll('.ob-actor .actor').forEach(a=>{if(Math.random()<.3&&a.dataset.state!=='sleep'){a.classList.add('blink');setTimeout(()=>a.classList.remove('blink'),120)}})}
setInterval(blinkAll,700);

/* ---------- 1. welcome ---------- */
function welcome(replay){ST().started=1;ST().stage='welcome';Cfg.save();
  const s=show(`<div class="ob-welcome">${islandSVG('wel')}<div class="ob-logo"><small>原創夥伴生活模擬</small><h1>OC Shimeji</h1><p>我的夥伴小世界</p></div>
   <div class="ob-acts">${btn('start',replay?'觀看開場動畫':'開始新遊戲','primary')}${replay?btn('close','返回'):btn('import','匯入備份')+btn('skip','跳過，直接開始','ghost')}</div>
   <small class="ob-hint">建議開啟聲音・開場約 20 秒，可隨時跳過或暫停</small></div>`,'obs-wel');
  on(s,{start:()=>{Music.start();cinematic(replay)},close:()=>{Music.stop();unmount()},
    import:()=>{try{Backup.pick();toast('選擇備份檔後即可繼續舊進度','info');const chk=setInterval(()=>{if(Chars.list.some(c=>c.kind==='custom')){clearInterval(chk);finish({silent:true})}},1500);setTimeout(()=>clearInterval(chk),120000)}catch(e){}},
    skip:()=>skipAll()})}

/* ---------- 2. opening cinematic (Web Animations → pausable, skippable) ---------- */
const CAPS=['在遙遠的海上，有一座小小的島。','島上住著一群獨一無二的夥伴，','每一位都有自己的個性、喜好與小怪癖。','牠們會吃飯、散步、交朋友，也會想念你。','現在——輪到你的夥伴登場了。'];
function islandSVG(k){return `<svg class="ob-isle ob-isle-${k}" viewBox="0 0 400 300" aria-hidden="true">
  <defs><linearGradient id="obSea${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FD7E8"/><stop offset="1" stop-color="#6FB9D4"/></linearGradient></defs>
  <path class="ob-sea" d="M0 190Q100 178 200 190T400 190V300H0Z" fill="url(#obSea${k})"/>
  <path class="ob-wave w1" d="M-40 205Q0 197 40 205T120 205T200 205T280 205T360 205T440 205" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path class="ob-wave w2" d="M-40 228Q0 220 40 228T120 228T200 228T280 228T360 228T440 228" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="2" fill="none" stroke-linecap="round"/>
  <g class="ob-land"><ellipse cx="200" cy="196" rx="128" ry="22" fill="#F2DDB0"/><path d="M86 192Q118 150 170 146Q222 132 270 150Q318 160 314 192Z" fill="#9CCB7E"/><path d="M200 140Q246 136 270 150Q318 160 314 192L232 190Z" fill="#83B86C"/>
   <g class="ob-tree t1" transform="translate(122 168)"><rect x="-3" y="-16" width="6" height="18" rx="2" fill="#9A7653"/><path d="M-18-12L0-48L18-12Z" fill="#5FA36A"/><path d="M0-48L18-12L4-12Z" fill="#4C8D5A"/></g>
   <g class="ob-tree t2" transform="translate(286 172) scale(.85)"><rect x="-3" y="-16" width="6" height="18" rx="2" fill="#9A7653"/><path d="M-18-12L0-48L18-12Z" fill="#6BAE73"/><path d="M0-48L18-12L4-12Z" fill="#579C63"/></g>
   <g transform="translate(178 118)"><path d="M6 30V58H52V30L29 14Z" fill="#E8C9A2"/><path d="M29 14L52 30V58H29Z" fill="#D6B48C"/><path d="M-2 32L29 6L60 32L53 37L29 17L5 37Z" fill="#6FB59A"/><rect x="22" y="40" width="12" height="18" rx="3" fill="#8A6A55"/><rect x="38" y="36" width="9" height="8" rx="1.5" fill="#FFF0BF" class="ob-window"/><rect x="44" y="4" width="7" height="14" fill="#B98A70"/></g>
   <g class="ob-smoke"><circle cx="226" cy="114" r="4" fill="#fff" opacity=".7"/><circle cx="231" cy="104" r="5" fill="#fff" opacity=".5"/><circle cx="238" cy="92" r="6" fill="#fff" opacity=".3"/></g>
   <g fill="#F6B8C8"><circle cx="150" cy="182" r="2.6"/><circle cx="158" cy="186" r="2.2"/><circle cx="252" cy="182" r="2.4"/></g><g fill="#FFE08A"><circle cx="140" cy="186" r="2.2"/><circle cx="262" cy="186" r="2.6"/></g></g>
 </svg>`}
function cinematic3d(replay){ST().stage='opening';Cfg.save();const E=Isle3D;root.classList.add('see');
  const s=show(`<div class="ob-cine3d"><div class="ob-bars"><i></i><i></i></div><div class="ob-cap" aria-live="polite"></div>
    <div class="ob-ctl"><button class="ob-ic" data-k="snd" aria-label="聲音">${Music.on?SV.son:SV.soff}</button><button class="ob-ic" data-k="pause" aria-label="暫停">${SV.pause}</button><button class="ob-skip" data-k="skip">跳過 ${SV.skip}</button></div></div>`,'obs-cine');
  const K=[[0,{yaw:-2.6,pitch:1.25,dist:110,tx:0,tz:0}],[.28,{yaw:-1.4,pitch:1.0,dist:70,tx:0,tz:1}],[.55,{yaw:-.7,pitch:.78,dist:40,tx:2,tz:2.5}],[.8,{yaw:-.2,pitch:.7,dist:30,tx:-1,tz:0}],[1,{yaw:-.42,pitch:.74,dist:42,tx:-1.2,tz:.4}]];
  const total=(reduce()?7:19)*1000;let t=0,paused=false,done=false;const saved=Object.assign({},E.rig.want);E.rig.follow=null;
  const ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
  const cam=E.add({update(dt){if(paused||done)return;t+=dt*1000;const k=Math.min(1,t/total);let i=0;while(i<K.length-2&&k>K[i+1][0])i++;const[a,A]=K[i],[b,B]=K[i+1],f=ease((k-a)/(b-a));
    for(const key in A)E.rig.want[key]=A[key]+(B[key]-A[key])*f;if(k>=1)end();return true}});
  Object.assign(E.rig,K[0][1]);Object.assign(E.rig.want,K[0][1]);E.kick();
  const A=[],cap=s.querySelector('.ob-cap');CAPS.forEach((tx,i)=>{const d=el(`<p>${esc(tx)}</p>`);cap.append(d);A.push(d.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none',offset:.15},{opacity:1,offset:.82},{opacity:0,transform:'translateY(-6px)'}],{duration:total/5.2,delay:300+i*total/5,fill:'both',easing:'ease-in-out'}))});
  function end(){if(done)return;done=true;E.updaters.delete(cam);A.forEach(a=>{try{a.cancel()}catch(_){}});root&&root.classList.remove('see');if(replay){Object.assign(E.rig.want,saved);Music.stop();unmount();return}chooseMode()}
  on(s,{skip:end,pause:b=>{paused=!paused;A.forEach(a=>paused?a.pause():a.play());paused?Music.pause():Music.resume();b.innerHTML=paused?SV.play:SV.pause},
    snd:b=>{Music.on=!Music.on;if(Music.on)Music.start();else Music.stop();b.innerHTML=Music.on?SV.son:SV.soff}})}
function cinematic(replay){if(I3())return cinematic3d(replay);ST().stage='opening';Cfg.save();
  const demos=Chars.list.filter(c=>c.kind==='demo').slice(0,3);
  const s=show(`<div class="ob-cine"><div class="ob-sky"><i class="ob-sun"></i><i class="ob-cloud c1"></i><i class="ob-cloud c2"></i><i class="ob-cloud c3"></i><i class="ob-bird b1">⌒</i><i class="ob-bird b2">⌒</i></div>
    <div class="ob-cam">${islandSVG('cine')}<div class="ob-cats">${demos.map((c,i)=>`<div class="ob-cat k${i}">${actorHTML(c,'walk')}</div>`).join('')}</div></div>
    <div class="ob-bars"><i></i><i></i></div><div class="ob-cap" aria-live="polite"></div>
    <div class="ob-ctl"><button class="ob-ic" data-k="snd" aria-label="聲音">${Music.on?SV.son:SV.soff}</button><button class="ob-ic" data-k="pause" aria-label="暫停">${SV.pause}</button><button class="ob-skip" data-k="skip">跳過 ${SV.skip}</button></div></div>`,'obs-cine');
  const A=[],an=(sel,kf,o)=>{const e=typeof sel==='string'?s.querySelector(sel):sel;if(!e)return null;const a=e.animate(kf,Object.assign({fill:'both',easing:'cubic-bezier(.45,0,.25,1)'},o));A.push(a);return a};
  const T=reduce()?.35:1;const total=20000*T;
  // camera: sky → pan down to the sea → glide over the island → settle on the cats
  an('.ob-cam',[{transform:'translateY(62%) scale(.8)'},{transform:'translateY(20%) scale(.85)',offset:.3},{transform:'translateY(6%) scale(1)',offset:.6},{transform:'translateY(0) scale(1.22)'}],{duration:total});
  an('.ob-sky',[{transform:'translateY(0)'},{transform:'translateY(-18%)'}],{duration:total});
  an('.ob-sun',[{transform:'translateY(40px) scale(.9)',opacity:.6},{transform:'translateY(-10px) scale(1)',opacity:1}],{duration:total*.5});
  s.querySelectorAll('.ob-cloud').forEach((c,i)=>an(c,[{transform:'translateX(-30%)'},{transform:`translateX(${40+i*15}%)`}],{duration:total,easing:'linear'}));
  s.querySelectorAll('.ob-bird').forEach((c,i)=>an(c,[{transform:'translate(-20vw,0)'},{transform:'translate(120vw,-40px)'}],{duration:9000*T,delay:(2000+i*900)*T,easing:'linear'}));
  s.querySelectorAll('.ob-cat').forEach((c,i)=>{an(c,[{opacity:0,transform:`translateX(${i%2?60:-60}px)`},{opacity:1,transform:'translateX(0)'}],{duration:2600*T,delay:(9500+i*700)*T,easing:'cubic-bezier(.22,1,.36,1)'});
    setTimeout(()=>{const a=c.querySelector('.actor');if(a)a.dataset.state=['happy','idle','happy'][i]},(12800+i*500)*T)});
  an('.ob-bars',[{opacity:1},{opacity:1,offset:.9},{opacity:0}],{duration:total});
  const cap=s.querySelector('.ob-cap');CAPS.forEach((t,i)=>{const d=el(`<p>${esc(t)}</p>`);cap.append(d);an(d,[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none',offset:.15},{opacity:1,offset:.82},{opacity:0,transform:'translateY(-6px)'}],{duration:3900*T,delay:(600+i*3800)*T,easing:'ease-in-out'})});
  let paused=false,done=false;const end=()=>{if(done)return;done=true;A.forEach(a=>{try{a.cancel()}catch(_){}});if(replay){Music.stop();unmount();return}chooseMode()};
  Promise.all(A.map(a=>a.finished)).then(()=>{if(!paused)end()}).catch(()=>{});
  on(s,{skip:end,pause:b=>{paused=!paused;A.forEach(a=>paused?a.pause():a.play());paused?Music.pause():Music.resume();b.innerHTML=paused?SV.play:SV.pause;b.setAttribute('aria-label',paused?'繼續':'暫停')},
    snd:b=>{Music.on=!Music.on;if(Music.on)Music.start();else Music.stop();b.innerHTML=Music.on?SV.son:SV.soff}})}

/* ---------- 3. choose how to start ---------- */
function chooseMode(){ST().stage='mode';Cfg.save();backFn=null;
  const s=show(`<div class="ob-page"><div class="ob-head"><small>新遊戲</small><h2>你想和誰一起開始？</h2><p>之後隨時都能在「角色」頁新增、編輯或讓夥伴離開小島。</p></div>
   <div class="ob-modes">
    <button class="ob-mode" data-k="demo"><span class="ob-mi">${ic('heart')}</span><b>和示範夥伴開始</b><small>三隻原創低多邊形貓咪，馬上就能生活</small></button>
    <button class="ob-mode" data-k="create"><span class="ob-mi">${ic('palette')}</span><b>從零捏我的 OC</b><small>外觀、名字、個性與說話方式都由你決定</small></button>
    <button class="ob-mode" data-k="both"><span class="ob-mi">${ic('home')}</span><b>示範夥伴 + 我的 OC</b><small>先捏角色，再選擇要一起住的貓咪</small></button>
    <button class="ob-mode" data-k="import"><span class="ob-mi">${ic('download')}</span><b>匯入角色</b><small>讀取角色包或匯入自己的圖片角色</small></button>
   </div></div>`,'obs-page');
  on(s,{demo:()=>pickDemos({mode:'demo'}),create:()=>creator({mode:'create'}),both:()=>creator({mode:'both'}),
    import:()=>{const before=new Set(Chars.list.map(c=>c.id)),r=root;r.classList.add('behind');try{NewSheet.open()}catch(e){Backup.pick()}
      // Sheets live below the onboarding layer: step aside until a character arrives or the player backs out.
      let seenSheet=false;const chk=setInterval(()=>{if(!root){clearInterval(chk);return}const n=Chars.list.find(c=>!before.has(c.id));const top=Ov.stack[Ov.stack.length-1];
        if(top&&top!==ovApi)seenSheet=true;
        if(n){clearInterval(chk);r.classList.remove('behind');pickDemos({mode:'both',created:n});return}
        if(seenSheet&&top===ovApi&&!document.querySelector('.ed-open,#edRoot.open')){clearInterval(chk);r.classList.remove('behind')}},700)}})}

/* ---------- 4. pick demo companions ---------- */
function pickDemos(o){ST().stage='demos';Cfg.save();backFn=()=>chooseMode();const demos=Chars.list.filter(c=>c.kind==='demo');const sel=new Set(o.mode==='demo'?demos.map(c=>c.id):[]);
  const s=show(`<div class="ob-page"><div class="ob-head"><small>${o.created?esc(o.created.name)+' 的鄰居':'選擇夥伴'}</small><h2>${o.created?'要和哪些貓咪一起住？':'選擇要一起生活的夥伴'}</h2><p>${o.created?'可以都不選，讓小島只屬於你的 OC。':'至少選一位；沒選到的夥伴之後也能再邀請。'}</p></div>
   <div class="ob-strip" id="obStrip"></div>
   <div class="ob-demos">${demos.map(c=>`<button class="ob-demo ${sel.has(c.id)?'on':''}" data-k="t" data-id="${c.id}"><span class="ob-dthumb">${thumbHTML(c)}</span><b>${esc(c.name)}</b><small>${esc(c.sub)}</small><i class="ob-ck">✓</i></button>`).join('')}</div>
   <div class="ob-acts">${btn('go','決定','primary')}${btn('back','返回','ghost')}</div></div>`,'obs-page');
  let pv=null;if(window.Isle3DPreview){pv=new Isle3DPreview(s.querySelector('#obStrip'),{dist:5.2,y:.8});if(pv.failed)pv=null;else{pv.setCats(demos,1.25);demos.forEach((c,i)=>{if(sel.has(c.id))pv.play(i,'happy',1400)})}}
  on(s,{t:b=>{const id=b.dataset.id,i=demos.findIndex(c=>c.id===id);if(sel.has(id)){sel.delete(id);pv&&pv.play(i,'sad',1400)}else{sel.add(id);pv&&pv.play(i,'happy',1600)}b.classList.toggle('on',sel.has(id))},
    back:()=>chooseMode(),
    go:()=>{if(!sel.size&&!o.created){toast('至少選擇一位夥伴，或回上一步捏自己的 OC','info');return}apply({demos:[...sel],created:o.created||null})}})}

/* ---------- 5. OC creator (Tomodachi-style: playful, live preview, no long forms) ---------- */
const LOOKS=[['body','毛色'],['accent','點綴色'],['head','臉型'],['ears','耳朵'],['eye','眼睛'],['brow','眉毛'],['mouth','嘴巴'],['cheekStyle','臉頰'],['pattern','花紋'],['tail','尾巴'],['acc','服飾']];
function personalityLine(sl,traits){const g=k=>(sl[k]??50);
  if(traits.includes('shy')||g('social')<30)return '個性比較怕生，熟了之後會悄悄黏著你。';
  if(traits.includes('lazy')||traits.includes('sleepy')||g('lively')<30)return '慢悠悠的，最喜歡找個舒服的地方窩著。';
  if(g('lively')>70&&g('social')>65)return '精力充沛又愛熱鬧，一出門就停不下來！';
  if(g('expr')>70)return '情緒寫在臉上，開心和不開心都很明顯。';
  if(g('friendly')<30)return '外表有點高冷，其實很在意大家。';
  if(g('indep')>70)return '喜歡自己做決定，常常一個人去探險。';return '溫和自然，和誰都能慢慢變成好朋友。'}
function greetingFor(ch){const d=ch.data||{},sl=Persona.eff(d),tr=d.pers?.traits||[],cp=d.speech?.catch?` ${d.speech.catch}`:'';const me=d.speech?.self||'我';
  if(tr.includes('shy')||sl.social<30)return[`那、那個……${me}是${ch.name}……`,`這裡……好多花喔。請、請多指教……${cp}`];
  if(tr.includes('lazy')||tr.includes('sleepy')||sl.lively<30)return[`呼啊……${me}是${ch.name}。`,`這座島看起來……很適合午睡呢。${cp}`];
  if(tr.includes('tsun')||sl.friendly<30)return[`哼，${me}是${ch.name}。`,`才、才不是因為想見你才來的！……島倒是不錯。${cp}`];
  if(sl.lively>65||tr.includes('hot')||tr.includes('sunny'))return[`哇——！這裡就是${me}的新家嗎？`,`${me}是${ch.name}！快帶我到處看看吧！${cp}`];
  if(tr.includes('curious')||tr.includes('curio'))return[`咦？那邊有房子、那邊有海！`,`${me}是${ch.name}，好想每個地方都去看看。${cp}`];
  return[`你好，${me}是${ch.name}。`,`從今天起，請多多指教囉。${cp}`]}
function creator(o){ST().stage='create';Cfg.save();backFn=()=>chooseMode();
  const st=o.state||{name:pick(['小湯圓','芋圓','麻糬','奶茶','小星','布丁','雲朵','豆花']),look:Chars.randLook(),sl:{lively:50,social:50,expr:50,pace:50,indep:50,friendly:60},traits:[],speech:{catch:'',tone:'',self:''},nick:'',pronoun:'',birthday:'',step:0};
  const steps=['外觀','名字','個性','說話','完成'];
  const s=show(`<div class="ob-page ob-cr"><div class="ob-cr-top"><div class="ob-prev" id="obPrev"></div>
     <div class="ob-test"><button data-k="pose" data-p="happy">開心</button><button data-k="pose" data-p="hop">跳跳</button><button data-k="pose" data-p="walk">走走</button><button data-k="pose" data-p="sleep">睡覺</button></div>
     <p class="ob-say" id="obSay"></p></div>
   <div class="ob-steps">${steps.map((t,i)=>`<i data-i="${i}">${t}</i>`).join('')}</div><div class="ob-cr-body" id="obBody"></div>
   <div class="ob-acts row">${btn('prev','上一步','ghost')}${btn('fin','直接完成','ghost')}${btn('next','下一步','primary')}</div></div>`,'obs-page cr');
  const prev=s.querySelector('#obPrev'),body=s.querySelector('#obBody'),say=s.querySelector('#obSay');
  const fake=()=>({id:'ob_preview',kind:'custom',name:st.name,look:st.look,data:Persona.norm({nick:st.nick,pronoun:st.pronoun,birthday:st.birthday,pers:{sl:st.sl,traits:st.traits},speech:st.speech})});
  // live 3D preview (drag to rotate); falls back to the 2D art when WebGL is unavailable
  let poseT=0,pv=null,pvSig='';const P3={hop:'happy',happy:'happy',walk:'walk',sleep:'sleep',idle:'idle'};
  const paint=()=>{if(!pv&&window.Isle3DPreview){pv=new Isle3DPreview(prev,{dist:4.1,y:.9});if(pv.failed)pv=null;else prev.classList.add('is3d')}
    if(pv){const sig=JSON.stringify(st.look);if(sig!==pvSig){pvSig=sig;pv.setCats([fake()])}pv.play(0,P3[prev._st||'idle']||'idle')}else prev.innerHTML=actorHTML({svg:ocSVG({look:st.look})},prev._st||'idle')};
  const pose=p=>{prev._st=p;paint();clearTimeout(poseT);if(p!=='sleep')poseT=setTimeout(()=>{prev._st='idle';paint()},p==='walk'?2600:1400)};
  const talk=t=>{say.textContent=t;say.classList.remove('pop');void say.offsetWidth;say.classList.add('pop')};
  const swatches=['#F6E8E7','#F4E6D6','#E5DBC2','#F8E7D3','#E8B9BB','#C7B8DE','#BDC8E6','#BDCFB4','#D6D1CE','#9E9AA6','#7D6E66','#F2F0EA'];
  function stepLook(){let cur=st._cat||'body';
    const render=()=>{const opts=cur==='body'||cur==='accent'?`<div class="ob-sw">${swatches.map(c=>`<button data-k="col" data-v="${c}" style="--c:${c}" class="${st.look[cur]===c?'on':''}" aria-label="${c}"></button>`).join('')}<label class="ob-wheel" aria-label="自訂顏色"><input type="color" value="${st.look[cur]}" data-k2="wheel"><span>${ic('pick')}</span></label></div>`
      :`<div class="ob-chips">${(CAT_OPT[cur]||[]).map(([v,t])=>`<button data-k="opt" data-v="${v}" class="${st.look[cur]===v?'on':''}">${t}</button>`).join('')}</div>`;
      body.innerHTML=`<div class="ob-cats-tabs">${LOOKS.map(([k,t])=>`<button data-k="cat" data-v="${k}" class="${k===cur?'on':''}">${t}</button>`).join('')}</div>${opts}<div class="ob-row">${btn('dice',ic('sparkle')+' 隨機一下')}${btn('reset',ic('reset')+' 重置')}</div>`;
      const w=body.querySelector('[data-k2=wheel]');if(w)w.oninput=()=>{st.look=Chars.normLook({...st.look,[cur]:w.value});paint()}};
    body._h={cat:b=>{cur=st._cat=b.dataset.v;render()},col:b=>{st.look=Chars.normLook({...st.look,[cur]:b.dataset.v});paint();render();pose('happy')},
      opt:b=>{st.look=Chars.normLook({...st.look,[cur]:b.dataset.v});paint();render();pose(Math.random()<.5?'happy':'hop')},
      dice:()=>{st.look=Chars.randLook();paint();render();pose('hop');talk(pick(['這樣如何？','新造型！','嘿嘿，變身～']))},reset:()=>{st.look=Chars.normLook({});paint();render()}};render();talk('先決定我長什麼樣子吧！')}
  function stepName(){body.innerHTML=`<label class="ob-fld"><span>名字</span><input class="inp" id="obName" maxlength="16" value="${esc(st.name)}"></label>
     <div class="ob-row2"><label class="ob-fld"><span>暱稱（可留空）</span><input class="inp" data-f="nick" maxlength="16" value="${esc(st.nick)}"></label><label class="ob-fld"><span>代稱（可留空）</span><input class="inp" data-f="pronoun" maxlength="10" value="${esc(st.pronoun)}" placeholder="他／她／牠／祂…"></label></div>
     <label class="ob-fld"><span>生日（可留空）</span><input class="inp" data-f="birthday" maxlength="12" value="${esc(st.birthday)}" placeholder="例如 4/12"></label>`;
    const n=body.querySelector('#obName');n.oninput=()=>{st.name=n.value.slice(0,16);talk(st.name?`我叫${st.name}！`:'我叫什麼名字呢？')};
    body.querySelectorAll('[data-f]').forEach(i=>i.oninput=()=>{st[i.dataset.f]=i.value});body._h={};talk(`我叫${st.name}！喜歡這個名字嗎？`)}
  function stepPers(){const tr=TRAITS.filter((t,i,a)=>a.findIndex(x=>x.id===t.id)===i);
    body.innerHTML=`<div class="ob-sl">${SLIDERS.map(x=>`<label><span><b>${x.t}</b><small>${x.a}</small><small>${x.b}</small></span><input type="range" min="0" max="100" value="${st.sl[x.k]??50}" data-sl="${x.k}" class="rng"></label>`).join('')}</div>
     <p class="ob-desc" id="obDesc"></p><div class="sec">性格特質（最多 3 個）</div><div class="ob-chips tr">${tr.map(t=>`<button data-k="tr" data-v="${t.id}" class="${st.traits.includes(t.id)?'on':''}" title="${esc(t.d)}">${t.em} ${t.t}</button>`).join('')}</div>`;
    const desc=body.querySelector('#obDesc'),upd=()=>{desc.textContent=personalityLine(st.sl,st.traits);try{const p=window.IsleLife?.ptype?.({id:'ob_preview',data:fake().data});if(p&&p.name)desc.textContent=`【${p.name}】`+desc.textContent}catch(_){}};
    body.querySelectorAll('[data-sl]').forEach(r=>{const paintR=()=>r.style.setProperty('--p',r.value+'%');paintR();r.oninput=()=>{st.sl[r.dataset.sl]=+r.value;paintR();upd()};r.onchange=()=>{const k=r.dataset.sl,v=+r.value;pose(k==='lively'&&v>60?'hop':k==='lively'&&v<35?'sleep':v>60?'happy':'idle');talk(personalityLine(st.sl,st.traits))}});
    body._h={tr:b=>{const id=b.dataset.v;if(st.traits.includes(id))st.traits=st.traits.filter(x=>x!==id);else{if(st.traits.length>=3){toast('最多選 3 個特質','info');return}st.traits.push(id);const t=TRAITS.find(x=>x.id===id);if(t&&t.idle&&t.idle.length)talk(pick(t.idle));pose('happy')}b.classList.toggle('on',st.traits.includes(id));upd()}};upd();talk('我是什麼樣的個性呢？')}
  function stepSpeech(){body.innerHTML=`<label class="ob-fld"><span>自稱（可留空）</span><input class="inp" data-s="self" maxlength="8" value="${esc(st.speech.self)}" placeholder="我／人家／本喵…"></label>
     <label class="ob-fld"><span>口頭禪（可留空）</span><input class="inp" data-s="catch" maxlength="30" value="${esc(st.speech.catch)}" placeholder="例如：喵嗚～、沒問題！"></label>
     <div class="sec">說話語氣</div><div class="ob-chips">${TONES.map(t=>`<button data-k="tone" data-v="${t.v}" class="${st.speech.tone===t.v?'on':''}">${t.t}</button>`).join('')}</div>`;
    body.querySelectorAll('[data-s]').forEach(i=>i.oninput=()=>{st.speech[i.dataset.s]=i.value;talk(greetingFor(fake())[1])});
    body._h={tone:b=>{st.speech.tone=b.dataset.v;body.querySelectorAll('[data-k=tone]').forEach(x=>x.classList.toggle('on',x===b));talk(greetingFor(fake())[0])}};talk(greetingFor(fake())[0])}
  function stepDone(){const f=fake(),tr=st.traits.map(id=>TRAITS.find(t=>t.id===id)).filter(Boolean);
    body.innerHTML=`<div class="ob-card"><h3>${esc(st.name)}</h3><p>${esc(personalityLine(st.sl,st.traits))}</p>${tr.length?`<div class="ob-tags">${tr.map(t=>`<span>${t.em} ${t.t}</span>`).join('')}</div>`:''}${st.speech.catch?`<p class="ob-q">口頭禪：「${esc(st.speech.catch)}」</p>`:''}<small>完成後可以在「角色 → 編輯」繼續細調、匯入自己的圖片或動畫素材。</small></div>`;body._h={};pose('happy');talk(greetingFor(f)[1])}
  const RUN=[stepLook,stepName,stepPers,stepSpeech,stepDone];
  const go=i=>{st.step=Math.max(0,Math.min(RUN.length-1,i));s.querySelectorAll('.ob-steps i').forEach((x,k)=>{x.classList.toggle('on',k===st.step);x.classList.toggle('done',k<st.step)});
    s.querySelector('[data-k=prev]').textContent=st.step?'上一步':'返回';s.querySelector('[data-k=next]').textContent=st.step===RUN.length-1?'就決定是你了！':'下一步';s.querySelector('[data-k=fin]').hidden=st.step===RUN.length-1;body.classList.remove('in');void body.offsetWidth;body.classList.add('in');RUN[st.step]()};
  s.addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(!b)return;const k=b.dataset.k;buzz(6);
    if(k==='pose')return pose(b.dataset.p);if(k==='prev'){if(!st.step)return chooseMode();return go(st.step-1)}
    if(k==='fin'){if(!st.name.trim())st.name='新夥伴';return go(RUN.length-1)}
    if(k==='next'){if(st.step===1&&!st.name.trim()){toast('幫夥伴取個名字吧','info');return}if(st.step<RUN.length-1)return go(st.step+1);return createAndContinue()}
    const h=body._h&&body._h[k];if(h)h(b)});
  async function createAndContinue(){const btnN=s.querySelector('[data-k=next]');btnN.disabled=true;
    try{const ch=await Chars.create({name:st.name.trim()||'新夥伴',look:st.look,data:{nick:st.nick,pronoun:st.pronoun,birthday:st.birthday,species:'貓咪',pers:{sl:st.sl,traits:st.traits},speech:st.speech}});
      try{afterChange()}catch(_){}if(o.mode==='both')pickDemos({mode:'both',created:ch});else apply({demos:[],created:ch})}catch(e){console.error(e);btnN.disabled=false;toast('建立失敗，請再試一次','info')}}
  paint();go(st.step)}

/* ---------- 6. apply roster → choose a house → place it → arrival ---------- */
const I3=()=>window.Isle3D&&window.Isle3D.ready&&window.Isle3DHouse&&window.Isle3DLife;
async function apply({demos,created}){ST().stage='arrive';Cfg.save();
  const want=[...(created?[created.id]:[]),...demos];const L=window.L31;
  for(const id of want)try{L&&L.setIsland(id,true)}catch(_){}
  const lead=want[0];if(lead&&Cfg.v.active!==lead){try{setActive(lead)}catch(_){Cfg.set('active',lead)}}
  for(const c of Chars.list.filter(c=>c.kind==='demo'&&!demos.includes(c.id)))try{L&&L.setIsland(c.id,false)}catch(_){}
  ST().lead=lead;Cfg.flush();try{window.Isle3DLife?.sync()}catch(_){}
  if(I3())return chooseHouse();Music.stop();unmount();await wait(450);arrival(Chars.byId(lead)||Chars.active())}
function chooseHouse(){ST().stage='house';Cfg.save();backFn=null;const HS=Isle3DHouse.HOUSES,keys=Object.keys(HS);let cur=ST().houseType||keys[0];
  const s=show(`<div class="ob-page"><div class="ob-head"><small>我的家</small><h2>選一棟喜歡的房子</h2><p>接下來可以把它擺在小島上的任何地方。家裡有床、餐桌、沙發、書櫃和廚房，夥伴會回家睡覺、吃飯、躲雨。</p></div>
   <div class="ob-strip tall" id="obHouse"></div>
   <div class="ob-houses">${keys.map(k=>`<button class="ob-house ${k===cur?'on':''}" data-k="h" data-v="${k}"><b>${HS[k].name}</b><small>${HS[k].desc}</small></button>`).join('')}</div>
   <div class="ob-acts">${btn('go','就是這棟！','primary')}</div></div>`,'obs-page');
  let pv=new Isle3DPreview(s.querySelector('#obHouse'),{dist:15,y:1.6,fov:32});if(pv.failed)pv=null;
  const draw=()=>{if(pv){const b=HS[cur].build();pv.setObject(b.g,.9);pv.wantYaw=-.5}};draw();
  on(s,{h:b=>{cur=b.dataset.v;ST().houseType=cur;s.querySelectorAll('.ob-house').forEach(x=>x.classList.toggle('on',x===b));draw()},
    go:()=>{ST().houseType=cur;Cfg.save();placeHouse(cur)}})}
async function placeHouse(type){ST().stage='place';Cfg.save();Music.stop();unmount();await wait(400);try{Nav.go(0)}catch(_){}
  document.documentElement.classList.add('ob-cine-on');
  const at=window.Isle3DMain?.defaultSpot?.(type)||{x:-2,z:-2.6};
  Isle3DHouse.beginPlace(type,{cancel:false,at,onDone:()=>{document.documentElement.classList.remove('ob-cine-on');setTimeout(()=>arrival(Chars.byId(ST().lead)||Chars.active()),500)}});
  setTimeout(()=>toast('拖曳房子決定位置，可以旋轉方向','home'),600)}
async function arrival(ch){ST().stage='arrival';Cfg.save();try{Nav.go(0)}catch(_){}
  const cine=el(`<div class="ob-arrive"><div class="ob-lb t"></div><div class="ob-lb b"></div><div class="ob-dlg" role="status"><b class="ob-dn"></b><p class="ob-dt"></p><small>點一下繼續</small></div></div>`);($('#app')||document.body).append(cine);
  document.documentElement.classList.add('ob-cine-on');requestAnimationFrame(()=>cine.classList.add('in'));
  let a=null;if(I3()){const L=Isle3DLife,E=Isle3D;L.sync();a=L.agent(ch.id);
    // everyone else waits outside; the new resident steps out of the front door
    if(a&&E.house){a.inside=true;a.task={type:'inside',why:'rest',t0:E.clock};const d=E.house.door;E.focus({x:d.x,z:d.z},16);E.rig.want.pitch=.62;
      await wait(1400);L.exitHouse(a);a.thinkT=99;a.task={type:'cmd',to:{x:d.x+Math.sin(E.house.ry)*1.6,z:d.z+Math.cos(E.house.ry)*1.6}};E.rig.follow=a.root;await wait(1800);
      a.task={type:'do',anim:'look',dur:2.2,t0:E.clock};a.cat.play('look');await wait(1600);a.cat.play('wave');a.cat.expr({eyes:'happy',blush:1},4)}}
  else{try{Home.setChar()}catch(_){}await wait(reduce()?300:1700)}
  const lines=greetingFor(ch),dn=cine.querySelector('.ob-dn'),dt=cine.querySelector('.ob-dt');dn.textContent=ch.name;cine.classList.add('talk');
  for(const line of lines){await typeLine(dt,line);try{if(a){a.cat.play('happy');setTimeout(()=>a.cat.play('talk'),900)}else{Home.stage.actor.dataset.state='happy'}}catch(_){}await tapOrWait(cine,4200)}
  cine.classList.remove('in','talk');document.documentElement.classList.remove('ob-cine-on');setTimeout(()=>cine.remove(),600);
  if(a){a.thinkT=2;a.task=null;Isle3D.rig.follow=null}
  ST().arrived=1;Cfg.save();await wait(500);tutorial(false)}
function typeLine(n,t){return new Promise(r=>{n.textContent='';let i=0;const step=()=>{n.textContent=t.slice(0,++i);if(i<t.length)setTimeout(step,reduce()?0:38);else r()};step()})}
function tapOrWait(n,ms){return new Promise(r=>{let done=false;const f=()=>{if(done)return;done=true;n.removeEventListener('pointerdown',f);r()};n.addEventListener('pointerdown',f);setTimeout(f,ms)})}

/* ---------- 7. interactive tutorial (on the real 3D island UI) ---------- */
function tutorial(replay){ST().stage='tutorial';Cfg.save();const ch=Chars.active(),me=ch?.data?.speech?.self||'我';const is3d=!!I3();
  const agentEl=()=>{if(!is3d)return Home.stage?.actor;const a=Isle3DLife.agent(Cfg.v.active);if(!a)return null;const p=a.root.position.clone();p.y+=.8;const q=Isle3D.project(p);const r=Isle3D.renderer.domElement.getBoundingClientRect();return{getBoundingClientRect:()=>({left:r.left+q.x-46,top:r.top+q.y-60,right:r.left+q.x+46,bottom:r.top+q.y+50,width:92,height:110})}};
  const hold=()=>{if(!is3d)return;const a=Isle3DLife.agent(Cfg.v.active);if(a){if(a.inside)Isle3DLife.exitHouse(a);a.task=null;a.thinkT=40;a.cat.play('idle');Isle3D.focus(a.root.position,17);Isle3D.rig.want.pitch=.7}};
  const steps=is3d?[
    {t:`這就是我們的小島！${me}帶你認識一下。`,before:hold},
    {sel:agentEl,t:'用手指在我身上「上下滑動」，就可以摸摸我喔！',wait:'pet3d',before:hold},
    {sel:agentEl,t:'點我一下，就能操控我，還會打開互動選單：聊天、誇獎、餵食、送禮……',wait:'menu',before:hold},
    {t:'點一下草地，我就會走過去。點長椅、花圃、碼頭、營火，我會去那裡做事。',wait:'move',pad:-40},
    {sel:'.ih-av',t:'這裡是現在操控的夥伴，旁邊是星幣、星鑽、等級與親密度。'},
    {sel:'.ih-wx',t:'點這裡可以看時間與天氣，也能自訂。下雨天大家會躲雨，淋太久可能會感冒！'},
    {sel:'.ih-rail [data-k=bag]',t:'背包：把食物、飲料或禮物送給夥伴。每個夥伴都有自己的口味。'},
    {sel:'.ih-quest',t:'今日委託和夥伴的請求在這裡，完成就能領星幣。'},
    {sel:'.ih-rail [data-k=house]',t:'點這裡可以走進家裡，使用床、餐桌、沙發和書櫃。'},
    {sel:'.ih-rail [data-k=map]',t:'世界地圖：海灘、森林、咖啡館、圖書館都能去探險。'},
    {sel:'.ih-sq[data-k=news]',t:'島嶼日誌：誰和誰變成好朋友、誰吵架了、誰生病了，都會記在這裡。'},
    {t:replay?'複習完畢！':'準備好了嗎？從今天開始，一起自由生活吧！',final:!replay}]
   :[{t:`這就是我們的小島！${me}帶你認識一下。`},{sel:()=>Home.stage?.actor,t:'先摸摸我的頭吧！點一下我。',wait:'pet'},{t:replay?'複習完畢！':'一起自由生活吧！',final:!replay}];
  const ui=el(`<div class="ob-tut" data-emoji-keep><div class="ob-spot"></div><div class="ob-tip"><div class="ob-tip-h"><span class="ob-tav">${thumbHTML(ch)}</span><b>${esc(ch?.name||'')}</b><button class="ob-tskip" data-k="skip">跳過教學</button></div><p></p><div class="ob-tip-a"><small></small><button class="ob-btn primary sm" data-k="next">下一步</button></div></div></div>`);
  ($('#app')||document.body).append(ui);fillIcons(ui);requestAnimationFrame(()=>ui.classList.add('in'));
  const spot=ui.querySelector('.ob-spot'),tip=ui.querySelector('.ob-tip'),txt=tip.querySelector('p'),cnt=tip.querySelector('small'),nb=tip.querySelector('[data-k=next]');
  let i=0,cleanup=null,raf=0;
  const target=s=>!s.sel?null:typeof s.sel==='function'?s.sel():document.querySelector(s.sel);
  const place=()=>{const s=steps[i],t=target(s);const ar=($('#app')||document.body).getBoundingClientRect();
    if(t&&t.getBoundingClientRect){const r=t.getBoundingClientRect(),p=s.pad??8;spot.style.cssText=`opacity:1;left:${r.left-ar.left-p}px;top:${r.top-ar.top-p}px;width:${r.width+p*2}px;height:${r.height+p*2}px`;
      const below=r.top-ar.top<ar.height*.45;tip.style.top=below?Math.min(ar.height-220,r.bottom-ar.top+p+14)+'px':'';tip.style.bottom=below?'':Math.max(16,ar.bottom-r.top+p+14)+'px'}
    else{spot.style.cssText='opacity:0;left:50%;top:50%;width:0;height:0';tip.style.top='';tip.style.bottom='calc(var(--sab) + 190px)'}
    raf=requestAnimationFrame(place)};
  const fallback=()=>setTimeout(()=>{nb.hidden=false},9000);
  const show_=()=>{cleanup&&cleanup();cleanup=null;const s=steps[i];try{s.before&&s.before()}catch(_){}txt.textContent=s.t;cnt.textContent=`${i+1} / ${steps.length}`;nb.textContent=s.final||i===steps.length-1?'開始生活！':'下一步';nb.hidden=!!s.wait;
    ui.classList.toggle('pass',!!s.wait);tip.classList.remove('pop');void tip.offsetWidth;tip.classList.add('pop');
    if(s.wait==='pet3d'){const L=Isle3DLife,op=L.petStroke;let n=0;L.petStroke=function(){const r=op.apply(this,arguments);if(++n===4){L.petStroke=op;setTimeout(next,900)}return r};const fb=fallback();cleanup=()=>{clearTimeout(fb);L.petStroke=op}}
    if(s.wait==='menu'){const fb=fallback();const iv=setInterval(()=>{if(document.querySelector('.im-menu.on')){clearInterval(iv);setTimeout(()=>{try{Isle3DUI.closeMenu()}catch(_){}next()},1600)}},200);cleanup=()=>{clearTimeout(fb);clearInterval(iv)}}
    if(s.wait==='move'){const L=Isle3DLife,oc=L.command;L.command=function(id,c){const r=oc.apply(this,arguments);L.command=oc;setTimeout(next,1400);return r};const fb=fallback();cleanup=()=>{clearTimeout(fb);L.command=oc}}
    if(s.wait==='pet'){const op=Stage.prototype.pet;Stage.prototype.pet=function(){const r=op.apply(this,arguments);if(this===Home.stage){Stage.prototype.pet=op;setTimeout(next,700)}return r};const fb=fallback();cleanup=()=>{clearTimeout(fb);Stage.prototype.pet=op}}};
  const close=()=>{cleanup&&cleanup();cancelAnimationFrame(raf);ui.classList.remove('in');setTimeout(()=>ui.remove(),500);if(is3d){const a=Isle3DLife.agent(Cfg.v.active);if(a)a.thinkT=2}};
  function next(){if(!ui.isConnected)return;if(i>=steps.length-1){close();if(!replay)finish({gift:true});return}i++;show_()}
  ui.addEventListener('click',e=>{const k=e.target.closest('[data-k]')?.dataset.k;if(!k)return;buzz(6);if(k==='next')next();if(k==='skip'){close();if(!replay)finish({gift:true})}});
  show_();place()}

/* ---------- 8. finish / skip ---------- */
function finish(o={}){const s=ST();s.done=true;s.at=s.at||Date.now();s.stage='done';s.v=1;Cfg.flush();
  if(o.gift){try{if(window.Econ&&Econ.pay('ob_newlife_v1','gift',100))toast('新生活禮物：+100 星幣','sparkle');else{Eco.v.coins+=100;Eco.save();HUD.refresh();toast('新生活禮物：+100 星幣','sparkle')}}catch(_){}}
  else if(!o.silent)toast('歡迎來到小島！','sparkle')}
function skipAll(){Music.stop();unmount();const c=document.querySelector('.ob-tut');c&&c.remove();const a=document.querySelector('.ob-arrive');a&&a.remove();document.documentElement.classList.remove('ob-cine-on');finish({silent:true})}
function resume(){const s=ST();if(s.stage==='tutorial'||s.stage==='arrival'||s.arrived)return tutorial(false);if((s.stage==='house'||s.stage==='place')&&I3()){mount();return chooseHouse()}if(s.stage==='create'||s.stage==='demos'||s.stage==='mode')return(mount(),chooseMode());welcome(false)}

/* ---------- settings rows ---------- */
function settingsRows(body){if(body.querySelector('#obSec'))return;const wrap=el('<div id="obSec"><div class="sec">開場與教學</div><div class="group"></div></div>'),g=wrap.querySelector('.group');
  const act=(icon,title,desc,fn)=>{const r=el(`<button class="row btn-row"><span class="r-ic">${ic(icon)}</span><div class="r-t"><b>${title}</b><small>${desc}</small></div></button>`);r.onclick=fn;return r};
  g.append(act('film','重新觀看開場動畫','小島的故事從這裡開始',()=>{Settings.close();setTimeout(()=>welcome(true),350)}),
    act('help','重新進行新手教學','再認識一次小島上的功能',()=>{Settings.close();Nav.go(0);setTimeout(()=>tutorial(true),450)}));
  const data=[...body.querySelectorAll('.sec')].find(s=>s.textContent.trim()==='資料');data?body.insertBefore(wrap,data):body.append(wrap)}

window.OCSOnboarding={start:()=>welcome(false),replayOpening:()=>welcome(true),replayTutorial:()=>tutorial(true),skipAll,state:ST,greetingFor,personalityLine};

/* ---------- boot ---------- */
const bootAt=Date.now();const t=setInterval(()=>{if(typeof Settings==='undefined'||!Settings.body||!window.L31||!Chars.list.length||!Home.stage)return;if(window.Isle3D&&!Isle3D.ready&&Date.now()-bootAt<6000)return;clearInterval(t);
  try{const mk=Settings.make;Settings.make=function(){mk.apply(this,arguments);try{settingsRows(this.body)}catch(e){console.error(e)}};settingsRows(Settings.body)}catch(e){console.error(e)}
  const s=ST();
  if(s.done)return;
  if(!FIRST&&!s.started){s.done=true;s.legacy=true;s.stage='done';Cfg.save();return}   // existing save: never force a restart
  resume()},120);
})();
