/* ===== Isle3D 介面：HUD、觸控互動（滑動摸摸／點選操控）、環形互動選單、背包、任務、天氣時間、相機、通知 ===== */
(()=>{'use strict';
const E=window.Isle3D;if(!E)return;const T=E.T,V3=T.Vector3;
const L=()=>window.Isle3DLife,H=()=>window.Isle3DHouse;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const first=n=>(n||'').split(' ')[0];
const fmt=n=>n>=1e4?(n/1e3).toFixed(n>=1e5?0:1)+'K':String(n|0);
const ST=()=>{const v=Cfg.v;if(!v.isle3d||typeof v.isle3d!=='object')v.isle3d={};return v.isle3d};

/* colourful icon set (original, matches the reference's soft 3D-ish style) */
const IK={
 coin:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="#F6B73C"/><circle cx="12" cy="12" r="6.6" fill="#FFD66B" stroke="#E79A22" stroke-width="1.4"/><path d="M12 8.6v6.8" stroke="#E79A22" stroke-width="1.8" stroke-linecap="round"/></svg>',
 gem:'<svg viewBox="0 0 24 24"><path d="M12 3l7.5 6.5L12 21 4.5 9.5z" fill="#A98BF0"/><path d="M4.5 9.5h15L12 3z" fill="#C9B6FF"/><path d="M12 21l-3-11.5h6z" fill="#8C6BE0"/></svg>',
 star:'<svg viewBox="0 0 24 24"><path d="M12 2.8l2.8 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17l-5.7 3.1 1.2-6.3L2.9 9.4l6.3-.8z" fill="#FFD25E"/><path d="M12 2.8l2.8 5.8 6.3.8L12 17z" fill="#7FD0F0" opacity=".85"/><path d="M12 17l-5.7 3.1 1.2-6.3L2.9 9.4z" fill="#F59BC0" opacity=".8"/></svg>',
 heart:'<svg viewBox="0 0 24 24"><path d="M12 20.5s-8-4.9-8-11A4.6 4.6 0 0 1 12 6.9a4.6 4.6 0 0 1 8 2.6c0 6.1-8 11-8 11z" fill="#F0718F"/><path d="M7.5 7.8a2.6 2.6 0 0 1 3 .2" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".7"/></svg>',
 map:'<svg viewBox="0 0 32 32"><rect x="3" y="7" width="26" height="20" rx="5" fill="#8FD0A0"/><path d="M3 20l7-6 6 5 5-4 8 6v1a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z" fill="#5FAE72"/><circle cx="23" cy="11" r="4.5" fill="#F0718F"/><circle cx="23" cy="11" r="1.7" fill="#fff"/><path d="M23 15.5l-2.4-2.5h4.8z" fill="#F0718F"/></svg>',
 bag:'<svg viewBox="0 0 32 32"><rect x="4" y="10" width="24" height="17" rx="5" fill="#D99A5E"/><rect x="4" y="10" width="24" height="7" rx="3.5" fill="#E8B47A"/><path d="M12 10V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#A86B3C" stroke-width="2.4" fill="none"/><rect x="14" y="15" width="4" height="4" rx="1" fill="#A86B3C"/></svg>',
 quest:'<svg viewBox="0 0 32 32"><rect x="6" y="5" width="20" height="23" rx="4" fill="#E8B47A"/><rect x="9" y="8" width="14" height="17" rx="2" fill="#FFF6E6"/><rect x="11" y="3" width="10" height="5" rx="2" fill="#B98A70"/><path d="M12 16.5l3 3 5-6" stroke="#F0718F" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 camera:'<svg viewBox="0 0 32 32"><rect x="4" y="9" width="24" height="18" rx="5" fill="#8F7DE8"/><path d="M11 9l2-3h6l2 3z" fill="#7462D0"/><circle cx="16" cy="18" r="5.6" fill="#fff"/><circle cx="16" cy="18" r="3.4" fill="#5E8FE0"/><circle cx="23.5" cy="13" r="1.4" fill="#FFD25E"/></svg>',
 build:'<svg viewBox="0 0 32 32"><path d="M5 16h22v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" fill="#D9A46E"/><path d="M5 16h22v3H5z" fill="#C08A55"/><path d="M10 16c0-4 2-7 6-8 0 4-2 7-6 8z" fill="#7FC66A"/><path d="M16 16c1-5 4-8 9-8-1 5-4 8-9 8z" fill="#5FAE52"/><path d="M15 16c-1-3-3-5-6-5" stroke="#4E9A48" stroke-width="1.6" fill="none"/></svg>',
 house:'<svg viewBox="0 0 32 32"><path d="M16 4l11 9v1H5v-1z" fill="#5FA58A"/><rect x="7" y="13" width="18" height="15" rx="2" fill="#F6EBD8"/><rect x="13" y="18" width="6" height="10" rx="3" fill="#A27A58"/><rect x="9" y="16" width="3.5" height="3.5" rx=".8" fill="#FFD66B"/><rect x="19.5" y="16" width="3.5" height="3.5" rx=".8" fill="#FFD66B"/></svg>',
 bell:'<svg viewBox="0 0 24 24"><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z" fill="#7C8A9A"/><circle cx="12" cy="20" r="2" fill="#7C8A9A"/></svg>',
 gear:'<svg viewBox="0 0 24 24"><path d="M10.3 2.5h3.4l.5 2.6 2 .9 2.2-1.5 2.4 2.4-1.5 2.2.9 2 2.6.5v3.4l-2.6.5-.9 2 1.5 2.2-2.4 2.4-2.2-1.5-2 .9-.5 2.6h-3.4l-.5-2.6-2-.9-2.2 1.5-2.4-2.4 1.5-2.2-.9-2-2.6-.5v-3.4l2.6-.5.9-2-1.5-2.2 2.4-2.4 2.2 1.5 2-.9z" fill="#7C8A9A"/><circle cx="12" cy="12" r="3.2" fill="#fff"/></svg>',
 hand:'<svg viewBox="0 0 32 32"><path d="M11 17V9a1.8 1.8 0 0 1 3.6 0v6M14.6 15V7.4a1.8 1.8 0 0 1 3.6 0V15M18.2 15V9a1.8 1.8 0 0 1 3.6 0v9M21.8 13.5a1.8 1.8 0 0 1 3.6 0V19a8 8 0 0 1-8 8h-1a8 8 0 0 1-6.6-3.5L6.2 19c-.7-1.2.8-2.5 2-1.6L11 19.5" fill="#FFF6EE" stroke="#8A6A5A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 people:'<svg viewBox="0 0 32 32"><circle cx="12" cy="12" r="5" fill="#F5C2A0"/><path d="M3.5 26c.8-5 4.2-7.5 8.5-7.5s7.7 2.5 8.5 7.5z" fill="#8FD0A0"/><circle cx="22" cy="11" r="4" fill="#F5C2A0"/><path d="M19 18.6c3.8-.4 7.4 1.6 8.5 6.4h-5" fill="#7FB0E8"/></svg>',
 home:'<svg viewBox="0 0 24 24"><path d="M3.5 11L12 4l8.5 7v8.5a1.5 1.5 0 0 1-1.5 1.5h-4v-5.5h-6V21H5a1.5 1.5 0 0 1-1.5-1.5z" fill="currentColor"/></svg>',
 chars:'<svg viewBox="0 0 24 24"><path d="M6 5l2.5 3h7L18 5v6.5A6 6 0 0 1 12 18a6 6 0 0 1-6-6.5z" fill="currentColor"/><circle cx="9.5" cy="12" r="1.1" fill="#fff"/><circle cx="14.5" cy="12" r="1.1" fill="#fff"/></svg>',
 navbag:'<svg viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="13" rx="4" fill="currentColor"/><path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" stroke="currentColor" stroke-width="1.8" fill="none"/><rect x="10" y="11" width="4" height="3" rx="1" fill="#fff"/></svg>',
 navquest:'<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="3" fill="currentColor"/><path d="M9 10h6M9 13.5h6M9 17h3.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>',
 shop:'<svg viewBox="0 0 24 24"><path d="M4 10h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill="currentColor"/><path d="M3.5 6l1.5-2.5h14L20.5 6v2a2.5 2.5 0 0 1-4.2 1.8A2.5 2.5 0 0 1 12 10a2.5 2.5 0 0 1-4.3-.2A2.5 2.5 0 0 1 3.5 8z" fill="#F0718F"/><rect x="10" y="14" width="4" height="7" rx="1" fill="#fff"/></svg>',
 more:'<svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="2.2" fill="currentColor"/><circle cx="16" cy="8" r="2.2" fill="currentColor"/><circle cx="8" cy="16" r="2.2" fill="currentColor"/><circle cx="16" cy="16" r="2.2" fill="currentColor"/></svg>'};
const WX={sunny:['☀️','晴朗'],cloudy:['⛅','多雲'],rain:['🌧️','下雨'],storm:['⛈️','暴風雨'],snow:['❄️','下雪']};
const WXI={sunny:'<svg viewBox="0 0 24 24"><g stroke="#F6B73C" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M5.3 18.7L7 17M17 7l1.7-1.7"/></g><circle cx="12" cy="12" r="4.6" fill="#FFD25E"/></svg>',
 cloudy:'<svg viewBox="0 0 24 24"><circle cx="9" cy="9" r="3.6" fill="#FFD25E"/><path d="M7 19a4 4 0 0 1 .4-8 5 5 0 0 1 9.6 1.5A3.3 3.3 0 0 1 17 19z" fill="#E3EAF2"/></svg>',
 rain:'<svg viewBox="0 0 24 24"><path d="M6 15a4 4 0 0 1 .4-8 5 5 0 0 1 9.6 1.5A3.3 3.3 0 0 1 16 15z" fill="#C9D6E3"/><path d="M8 17.5l-1 2.5M12 17.5l-1 2.5M16 17.5l-1 2.5" stroke="#5EA8E0" stroke-width="1.8" stroke-linecap="round"/></svg>',
 snow:'<svg viewBox="0 0 24 24"><path d="M6 14a4 4 0 0 1 .4-8 5 5 0 0 1 9.6 1.5A3.3 3.3 0 0 1 16 14z" fill="#DCE6F0"/><g fill="#8FC6EE"><circle cx="8" cy="18" r="1.3"/><circle cx="12" cy="20" r="1.3"/><circle cx="16" cy="18" r="1.3"/></g></svg>',
 night:'<svg viewBox="0 0 24 24"><path d="M19.5 14.2A7.8 7.8 0 0 1 9.8 4.5a7.8 7.8 0 1 0 9.7 9.7z" fill="#FFE08A"/></svg>'};WXI.storm=WXI.rain;

let hud=null,menu=null,marker=null;
const $h=s=>hud.querySelector(s);

/* ---------- HUD ---------- */
function buildHUD(){const page=document.getElementById('p-home');hud=document.createElement('div');hud.id='ihud';hud.dataset.emojiKeep='';hud.innerHTML=`
 <div class="ih-top">
  <button class="ih-av" data-k="who" aria-label="切換夥伴"><span class="ih-avimg"></span></button>
  <div class="ih-pill">
   <div class="ih-res"><span class="ih-i">${IK.coin}</span><b id="ihCoin">0</b><button class="ih-plus" data-k="earn" aria-label="賺星幣">+</button><span class="ih-i">${IK.gem}</span><b id="ihGem">0</b><button class="ih-plus" data-k="earn" aria-label="星鑽">+</button><span class="ih-i">${IK.star}</span><b id="ihStar">0</b><button class="ih-plus" data-k="streak" aria-label="連續登入">+</button></div>
   <div class="ih-lv"><span class="ih-i sm">${IK.heart}</span><b id="ihLv">Lv.1</b><i class="ih-bar"><em id="ihBar"></em></i><small id="ihXp"></small></div>
  </div>
  <div class="ih-tr"><button class="ih-sq" data-k="news" aria-label="島嶼日誌">${IK.bell}<i class="ih-dot" id="ihNewsDot"></i></button><button class="ih-sq" data-k="settings" aria-label="設定">${IK.gear}</button></div>
 </div>
 <button class="ih-wx" data-k="wx" aria-label="時間與天氣"><span class="ih-wxi" id="ihWxI"></span><span><b id="ihWx"></b><small id="ihTime"></small></span></button>
 <div class="ih-rail">
  <button data-k="map" aria-label="世界地圖">${IK.map}</button><button data-k="bag" aria-label="背包">${IK.bag}</button>
  <button data-k="quest" aria-label="任務">${IK.quest}<i class="ih-dot" id="ihQDot"></i></button><button data-k="camera" aria-label="拍照">${IK.camera}</button>
  <button data-k="build" aria-label="佈置與蓋房">${IK.build}</button><button data-k="house" aria-label="進入家裡">${IK.house}</button></div>
 <div class="ih-bl"><button class="ih-round" data-k="act" aria-label="互動">${IK.hand}<i class="ih-dot heart" id="ihActDot"></i></button><button class="ih-round sm" data-k="who" aria-label="夥伴們">${IK.people}</button></div>
 <button class="ih-quest" data-k="quest"><span class="ih-qi">${IK.quest}</span><span class="ih-qt"><b id="ihQT">新的一天</b><small id="ihQD"></small></span><span class="ih-chev">›</span><i class="ih-dot" id="ihQDot2"></i></button>
 <div class="ih-room"><button class="ih-back" data-k="leaveRoom">‹ 回到小島</button><div class="ih-room-acts"></div></div>
 <div class="ih-toastzone"></div>`;
 page.append(hud);
 hud.addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(!b)return;e.stopPropagation();buzz(8);act(b.dataset.k,b)});
 refresh();setInterval(refresh,1000);
 L()?.on((t,d)=>{if(['journal','sick','quarrel','estranged','milestone','reconcile'].includes(t)){ST().newsSeen=ST().newsSeen||0;newsDot()}if(t==='journal'&&/絕交|吵架|生病|感冒|肚子|疲勞|和好|成為/.test(d.text))banner(d.text,d.kind)})}
let lastHud='';
function refresh(){if(!hud)return;const c=Chars.active();const v=Eco.v,info=c?Eco.info(c.id):{lv:1,x:0,n:100};
  const sig=[c?.id,v.coins,v.gems,v.streak,info.lv,info.x].join('|');if(sig!==lastHud){lastHud=sig;
    if(c){const av=$h('.ih-avimg');if(av._id!==c.id||av._sig!==JSON.stringify(c.look)){av.innerHTML=thumbHTML(c);av._id=c.id;av._sig=JSON.stringify(c.look)}}
    $h('#ihCoin').textContent=fmt(v.coins||0);$h('#ihGem').textContent=fmt(v.gems||0);$h('#ihStar').textContent=fmt(v.streak||0);
    $h('#ihLv').textContent='Lv.'+info.lv;$h('#ihBar').style.width=clamp(info.x/info.n*100,2,100)+'%';$h('#ihXp').textContent=`${info.x} / ${info.n}`}
  const h=E.hourNow(),wx=E.weatherNow(),night=h<5||h>=19;const ws=(night?'night':wx)+'|'+wx;if($h('#ihWxI')._s!==ws){$h('#ihWxI').innerHTML=night&&wx==='sunny'?WXI.night:(WXI[wx]||WXI.sunny);$h('#ihWxI')._s=ws}
  const hh=Math.floor(h),mm=Math.floor((h-hh)*60),ap=hh<12?'AM':'PM',h12=((hh+11)%12)+1;$h('#ihWx').textContent=(night&&wx==='sunny'?'晴朗夜晚':WX[wx]?.[1]||'晴朗')+(Number.isFinite(ST().timeOverride)||ST().weatherOverride?'・自訂':'');$h('#ihTime').textContent=`${ap} ${String(h12).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
  questCard()}
function questCard(){let job=null,readyJob=null,ready=0,goal=0;try{Econ.roll();const jobs=Econ.s.jobs||[];readyJob=jobs.find(j=>!j.c&&j.p>=j.n);ready=jobs.filter(j=>!j.c&&j.p>=j.n).length+((jobs.length&&jobs.every(j=>j.c)&&!Econ.s.bc)?1:0);job=jobs.find(j=>!j.c)}catch(_){}
  try{if(window.L30?.myReady?.()){goal=1;ready++}}catch(_){}
  const t=$h('#ihQT'),d=$h('#ihQD');const tt=ready?'可以領取獎勵！':'今日委託',dd=readyJob?`${readyJob.t} 完成了`:goal?'夥伴的目標達成了':job?`${job.t} (${Math.min(job.p,job.n)}/${job.n})`:'今天的委託都完成了';if(t.textContent!==tt)t.textContent=tt;if(d.textContent!==dd)d.textContent=dd;
  $h('#ihQDot').classList.toggle('on',!!ready);$h('#ihQDot2').classList.toggle('on',!!ready);hud.querySelector('.ih-quest').classList.toggle('ready',!!ready)}
function newsDot(){const j=L()?.journal&&ST().journal||[],seen=ST().newsSeen||0;$h('#ihNewsDot').classList.toggle('on',j.some(x=>x.t>seen))}
function banner(text,kind){const z=$h('.ih-toastzone');const b=document.createElement('div');b.className='ih-banner k-'+(kind||'life');b.textContent=text;z.append(b);requestAnimationFrame(()=>b.classList.add('on'));setTimeout(()=>{b.classList.remove('on');setTimeout(()=>b.remove(),500)},4200)}

/* ---------- actions ---------- */
function act(k,b){const a=L()?.agent(Cfg.v.active);
  ({who:()=>openWho(),earn:()=>openQuests(0),streak:()=>toast(`已連續登入 ${Eco.v.streak||0} 天`,'star'),news:()=>openNews(),settings:()=>Settings.open(),wx:()=>openWx(),
    map:()=>Nav.go(3),bag:()=>openBag(Cfg.v.active),quest:()=>openQuests(0),camera:()=>photo(),build:()=>openBuild(),house:()=>enterHouseView(),
    act:()=>{if(a)openMenu(a);else toast('先點選一位夥伴吧','info')},leaveRoom:()=>H()?.exitView()})[k]?.()}
function enterHouseView(){if(!E.house){openBuild();toast('先蓋一棟房子吧！','home');return}H().enterView()}

/* ---------- touch: stroke to pet, tap to select, tap ground to move ---------- */
const hitR=.85;
function agentAt(cx,cy){const r=E.rayFrom(cx,cy);let best=null,bd=1e9;for(const a of(L()?.agents||new Map()).values()){if(!a.root.visible)continue;const p=a.root.position.clone();p.y+=.85;const d=r.ray.distanceToPoint(p);
    const dist=r.ray.origin.distanceTo(p);if(d<hitR&&dist<bd){bd=dist;best=a}}return best}
let g=null;
function bindTouch(){
  E.onPointerDown=e=>{const a=agentAt(e.clientX,e.clientY);if(!a)return false;g={a,x0:e.clientX,y0:e.clientY,ly:e.clientY,dir:0,turns:0,acc:0,t0:performance.now(),petting:false,moved:0};return true};
  E.onPointerMove=e=>{if(!g)return;const dy=e.clientY-g.ly;g.moved=Math.max(g.moved,Math.hypot(e.clientX-g.x0,e.clientY-g.y0));
    if(Math.abs(dy)>2){const d=Math.sign(dy);if(d!==g.dir){if(g.dir!==0&&Math.abs(g.acc)>9){g.turns++;if(g.turns>=2&&!g.petting){g.petting=true;closeMenu();L().pet(g.a.id,true);buzz(10)}else if(g.petting){L().petStroke(g.a.id);buzz(4)}}g.dir=d;g.acc=0}g.acc+=dy;g.ly=e.clientY}};
  E.onPointerUp=e=>{if(!g)return;const gg=g;g=null;if(gg.petting){L().pet(gg.a.id,false);return}
    if(gg.moved<14&&performance.now()-gg.t0<500)selectAgent(gg.a,true)};
  E.onPointerCancel=()=>{if(g?.petting)L().pet(g.a.id,false);g=null};
  E.onTap=e=>{if(menu){closeMenu();return}
    if(E.viewMode==='room'){const sp=H().spotAt(e.clientX,e.clientY);if(sp){H().use(Cfg.v.active,sp);buzz(8)}return}
    const p=E.groundAt(e.clientX,e.clientY);if(!p||!E.inside(p.x,p.z,.6))return;const a=L()?.agent(Cfg.v.active);if(!a)return;
    // tapping the house door / a place of interest uses it
    if(E.house&&Math.hypot(p.x-E.house.x,p.z-E.house.z)<E.house.r){L().command(a.id,{type:'goto',x:E.house.door.x,z:E.house.door.z,then:{type:'home',why:'rest',dur:20}});showMarker(E.house.door.x,E.house.door.z);toast(`${first(a.ch.name)} 回家了`,'home');return}
    const poi=(E.POI||[]).find(q=>Math.hypot(q.x-p.x,q.z-p.z)<1.3);const key=poi&&{sit:'bench',fish:'fish',garden:'garden',campfire:'campfire',stargaze:'stargaze',mail:'mail',shade:'rest'}[poi.type];
    if(key){L().command(a.id,{type:'use',key});showMarker(poi.x,poi.z);return}
    L().command(a.id,{type:'goto',x:p.x,z:p.z});showMarker(p.x,p.z);buzz(6)}}
function showMarker(x,z){if(!marker){marker=new T.Mesh(new T.RingGeometry(.25,.42,24),new T.MeshBasicMaterial({color:0xFFFFFF,transparent:true,opacity:.9,depthWrite:false}));marker.rotation.x=-Math.PI/2;E.scene.add(marker);
    E.add({update(dt){if(!marker.visible)return;marker.userData.t+=dt;const k=marker.userData.t;marker.scale.setScalar(1+k*1.2);marker.material.opacity=Math.max(0,.9-k*1.1);if(k>.9)marker.visible=false;return true}})}
  marker.position.set(x,E.groundY(x,z)+.05,z);marker.userData.t=0;marker.visible=true;E.kick()}
function selectAgent(a,open){if(Cfg.v.active!==a.id){try{setActive(a.id)}catch(_){Cfg.set('active',a.id)}toast(`現在操控 ${first(a.ch.name)}`,'sparkle')}
  E.rig.follow=null;refresh();if(open)openMenu(a)}

/* ---------- radial interaction menu (Sims-style) ---------- */
const MOODN={happy:'開心',excited:'興奮',calm:'平靜',sad:'難過',angry:'生氣',shy:'害羞',tired:'疲倦',bored:'無聊',sick:'不舒服',hungry:'肚子餓'};
function openMenu(a,sub){closeMenu();const items=sub==='social'?socialItems(a):mainItems(a);
  menu=document.createElement('div');menu.className='im-menu';menu.dataset.emojiKeep='';const mood=a.emo?.id?MOODN[a.emo.id]:'心情不錯',hl=L().healthLabel(a);
  menu.innerHTML=`<div class="im-scrim"></div><div class="im-core"><b>${esc(first(a.ch.name))}</b><small>${hl?'🤒 '+hl:mood}</small></div>${items.map((it,i)=>`<button class="im-it ${it.cls||''}" data-i="${i}" style="--i:${i};--n:${items.length}"><span>${it.ic}</span><b>${it.t}</b></button>`).join('')}`;
  (document.getElementById('app')||document.body).append(menu);const place=()=>{if(!menu)return;const p=a.root.position.clone();p.y+=1;const s=E.project(p),W=E.W,Hh=E.H,r=Math.min(118,W*.3);
    menu.style.setProperty('--x',clamp(s.x,r+44,W-r-44)+'px');menu.style.setProperty('--y',clamp(s.y,r+120,Hh-r-150)+'px');menu.style.setProperty('--r',r+'px')};place();menu._pl=setInterval(place,100);
  requestAnimationFrame(()=>menu&&menu.classList.add('on'));a.cat.play('look');
  menu.addEventListener('click',e=>{const b=e.target.closest('.im-it');if(!b){if(e.target.closest('.im-scrim'))closeMenu();return}buzz(10);const it=items[+b.dataset.i];if(it.keep){it.fn();return}closeMenu();it.fn()})}
function closeMenu(){if(!menu)return;const m=menu;menu=null;clearInterval(m._pl);m.classList.remove('on');setTimeout(()=>m.remove(),260)}
function mainItems(a){const LL=L(),id=a.id,others=[...LL.agents.values()].filter(b=>b!==a),list=[
  {ic:'🤚',t:'摸摸',fn:()=>toast(`在 ${first(a.ch.name)} 身上上下滑動就能摸摸喔`,'heart')},
  {ic:'💬',t:'聊天',fn:()=>LL.interact(id,'chat')},
  {ic:'🌟',t:'誇獎',fn:()=>LL.interact(id,'praise')},
  {ic:'🫂',t:'安慰',fn:()=>LL.interact(id,'comfort')},
  {ic:'🎈',t:'一起玩',fn:()=>LL.interact(id,'play')},
  {ic:'🍙',t:'餵食',fn:()=>openBag(id,'food')},
  {ic:'🎁',t:'送禮',fn:()=>openBag(id,'gift')},
  {ic:'👥',t:'和誰互動',keep:1,fn:()=>openMenu(a,'social'),hide:!others.length},
  {ic:'🩹',t:'照顧',cls:'warn',fn:()=>LL.interact(id,'care'),hide:!a.health},
  {ic:'🌙',t:'去睡覺',fn:()=>LL.interact(id,'sleep')},
  {ic:'📖',t:'檔案',fn:()=>{try{L31.profile(id)}catch(_){Nav.go(1)}}}];return list.filter(x=>!x.hide).slice(0,10)}
function socialItems(a){const LL=L(),list=[];[...LL.agents.values()].filter(b=>b!==a).forEach(b=>{const lab=LL.relLabel(a.id,b.id),bad=/絕交|彆扭/.test(lab);
    list.push({ic:bad?'🕊️':'💞',t:`${first(b.ch.name)}<small>${lab}</small>`,cls:bad?'warn':'',fn:()=>openPair(a,b)})});list.push({ic:'↩',t:'返回',keep:1,fn:()=>openMenu(a)});return list.slice(0,10)}
function openPair(a,b){const LL=L(),lab=LL.relLabel(a.id,b.id),bad=/絕交|彆扭/.test(lab);
  const s=openSheet(`<div data-emoji-keep class="sh-body im-pair"><div class="sh-title">${esc(first(a.ch.name))} × ${esc(first(b.ch.name))}</div><p class="im-rel"><span>${lab}</span>好感 ${Math.round(LL.pair(a.id,b.id).score||0)}・緊張 ${Math.round(LL.pair(a.id,b.id).tension||0)}</p>
    <div class="im-grid">${[['chat','💬','聊天'],['hug','🫂','擁抱'],['play','🎈','玩鬼抓人'],bad?['mediate','🕊️','勸和']:null,['quarrel','💢','故意吵架']].filter(Boolean).map(([k,ic,t])=>`<button data-k="${k}"><span>${ic}</span>${t}</button>`).join('')}</div></div>`);
  s.el.addEventListener('click',e=>{const k=e.target.closest('[data-k]')?.dataset.k;if(!k)return;buzz(8);s.close();
    if(k==='chat'||k==='hug'){LL.command(a.id,{type:'visit',who:b.id})}else if(k==='play'){LL.command(a.id,{type:'visit',who:b.id});setTimeout(()=>LL.socialEncounter(a,b,true),2500)}else if(k==='mediate'){LL.command(a.id,{type:'visit',who:b.id});setTimeout(()=>LL.apologize(a,b,true),2200)}else if(k==='quarrel')LL.quarrel(a,b)})}

/* ---------- bag: feed / gift / play (uses the legacy item logic for reactions & taste memory) ---------- */
let fsRoot=null;
function fakeStage(a){if(!fsRoot){fsRoot=document.createElement('div');fsRoot.id='isleFakeStage';fsRoot.setAttribute('aria-hidden','true');fsRoot.style.cssText='position:fixed;left:-9999px;top:0;width:200px;height:200px;overflow:hidden;visibility:hidden;pointer-events:none';document.body.append(fsRoot)}
  const div=()=>{const d=document.createElement('div');fsRoot.append(d);return d};
  const base={ch:a.ch,state:'idle',sleeping:()=>false,say:t=>L().say(a,t,2.8),root:fsRoot,actor:div(),tiltEl:div(),poseEl:div(),sqEl:div(),flip:div(),art:div(),adj:div(),shadow:div(),fx:div(),bubble:div(),
    x:60,size:100,feetY:180,h:0,hitTop:90,W:E.W,H:E.H,cool:{},hist:[],spots:{},dir:1,setState(st){this.state=st},interrupt(){},squash(){},hearts(){L().emote(a,'heart')}};
  return new Proxy(base,{get:(t,k)=>k in t?t[k]:typeof k==='string'&&/^[a-z]/.test(k)?()=>{}:undefined,set:(t,k,v)=>{t[k]=v;return true}})}
function openBag(id,filter){const a=L()?.agent(id)||L()?.agent(Cfg.v.active);const tabs=[['food','食物',['food']],['drink','飲料',['drink']],['gift','禮物・玩具',['gift','toy']],['all','全部',null]];let tab=filter==='gift'?'gift':filter==='food'?'food':'all';
  const s=openSheet(`<div data-emoji-keep class="sh-body ib"><div class="sh-title">背包${a?`<small>給 ${esc(first(a.ch.name))}</small>`:''}</div><div class="ib-tabs">${tabs.map(t=>`<button data-t="${t[0]}">${t[1]}</button>`).join('')}</div><div class="ib-grid"></div><div class="ib-foot"><button class="btn sm" data-shop>${ic('store')}去商店買</button></div></div>`);
  const grid=s.el.querySelector('.ib-grid');
  const draw=()=>{s.el.querySelectorAll('[data-t]').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));const cats=tabs.find(t=>t[0]===tab)[2];
    const list=(Items.d.items||[]).filter(i=>i.qty>0&&(!cats||cats.includes(i.cat))&&!['furn','wear','acc'].includes(i.cat));
    grid.innerHTML=list.length?list.map(i=>`<button class="ib-it" data-id="${esc(i.id)}"><span class="ib-art">${itemArt(i)}</span><b>${esc(i.name)}</b><small>×${i.qty}</small></button>`).join(''):'<p class="ib-empty">這裡空空的～可以到商店逛逛，或完成任務取得物品。</p>'};
  s.el.addEventListener('click',e=>{const t=e.target.closest('[data-t]');if(t){tab=t.dataset.t;draw();return}if(e.target.closest('[data-shop]')){s.close();openShop();return}
    const b=e.target.closest('.ib-it');if(!b||!a)return;const it=Items.get(b.dataset.id);if(!it)return;buzz(10);s.close();useItem(a,it)});draw()}
function itemArt(i){try{if(window.MiniArt?.url){const u=MiniArt.url(i);if(u)return `<img src="${u}" alt="">`}}catch(_){}try{if(i.img)return `<img src="${i.img}" alt="">`}catch(_){}return `<span class="ib-em">${i.em||{food:'🍙',drink:'🥤',toy:'🧸',gift:'🎁'}[i.cat]||'📦'}</span>`}
function useItem(a,it){if(a.inside&&E.viewMode!=='room')L().exitHouse(a);const q0=it.qty,food=it.cat==='food'||it.cat==='drink';let r=false;
  a.task={type:'do',anim:'look',dur:3,t0:E.clock};a.cat.play('look');
  try{r=Items.use(it.id,fakeStage(a))}catch(e){console.warn(e);r=false}
  if(r===false){if(!food&&it.qty===q0&&q0>0){Items.qty(it.id,-1);r=true}else return}
  if(!food){a.cat.play('happy');a.cat.expr({eyes:'happy',blush:1},3);L().emote(a,'heart');try{IsleLife.memo({id:a.id},`收到禮物「${it.name}」`,{place:'小島'})}catch(_){}try{Econ.on('gift')}catch(_){}refresh();return}
  // the taste system decides after a short "sniff": eaten → happy eating, refused → polite refusal
  setTimeout(()=>{if(it.qty<q0||!it.consume){L().feed(a.id,it);a.cat.expr({eyes:'happy',blush:1},3)}else{a.cat.play('sad');a.cat.expr({eyes:'sad',mouth:'frown'},2.5);L().emote(a,'sweat')}refresh()},2600)}
function openShop(){try{if(window.OCSShop?.open)return OCSShop.open();}catch(_){}try{Shop.open()}catch(_){toast('商店整理中','info')}}

/* ---------- who (residents, quick status, switch control) ---------- */
function bars(a){const n=a.nd;return[['hunger','飽足','#F6A55B'],['energy','精力','#7FD0A0'],['fun','樂趣','#B99CF0'],['social','社交','#F0718F'],['sleep','睡眠','#7FB0E8']].map(([k,t,c])=>`<i class="iw-b" title="${t}"><em style="width:${Math.round((n[k]||0)*100)}%;background:${c}"></em></i>`).join('')}
function openWho(){const LL=L();if(!LL)return;const list=[...LL.agents.values()];
  const s=openSheet(`<div data-emoji-keep class="sh-body iw"><div class="sh-title">小島上的夥伴</div>${list.map(a=>{const hl=LL.healthLabel(a),now=a.inside?'在家裡':a.task?.label||'閒晃中';return `<button class="iw-row ${a.id===Cfg.v.active?'on':''}" data-id="${esc(a.id)}"><span class="iw-av">${thumbHTML(a.ch)}</span><span class="iw-t"><b>${esc(a.ch.name)}${a.id===Cfg.v.active?'<em>操控中</em>':''}</b><small>${hl?'🤒 '+hl+'・':''}${esc(MOODN[a.emo?.id]||'心情不錯')}・${esc(now)}</small><span class="iw-bars">${bars(a)}</span></span></button>`}).join('')}
    <button class="btn" data-manage>${ic('users')}管理角色與小島成員</button></div>`);
  s.el.addEventListener('click',e=>{if(e.target.closest('[data-manage]')){s.close();Nav.go(1);return}const r=e.target.closest('[data-id]');if(!r)return;buzz(8);s.close();const a=LL.agent(r.dataset.id);if(a){selectAgent(a,false);E.rig.follow=a.root;E.rig.want.dist=Math.min(E.rig.want.dist,30);E.kick()}})}

/* ---------- news / journal ---------- */
function openNews(){const j=ST().journal||[];ST().newsSeen=Date.now();Cfg.save();newsDot();const ago=t=>{const m=Math.round((Date.now()-t)/60000);return m<1?'剛剛':m<60?m+' 分鐘前':m<1440?Math.round(m/60)+' 小時前':Math.round(m/1440)+' 天前'};
  openSheet(`<div data-emoji-keep class="sh-body inews"><div class="sh-title">島嶼日誌</div>${j.length?j.slice(0,60).map(x=>`<div class="in-row k-${x.kind}"><i></i><div><p>${esc(x.text)}</p><small>${ago(x.t)}</small></div></div>`).join(''):'<p class="ib-empty">小島上還很平靜～</p>'}</div>`)}

/* ---------- time & weather ---------- */
function openWx(){const st=ST();const live=!Number.isFinite(st.timeOverride)&&!st.weatherOverride;
  const s=openSheet(`<div data-emoji-keep class="sh-body iwx"><div class="sh-title">時間與天氣</div>
   <div class="seg-row"><button data-m="live" class="${live?'on':''}">跟隨現實</button><button data-m="custom" class="${live?'':'on'}">自訂</button></div>
   <div class="iwx-c ${live?'off':''}"><label><span>時間</span><input type="range" min="0" max="23.75" step=".25" value="${Number.isFinite(st.timeOverride)?st.timeOverride:E.hourNow()}" class="rng" id="iwxT"><b id="iwxTv"></b></label>
   <div class="iwx-w">${Object.keys(WX).filter(k=>k!=='storm').map(k=>`<button data-w="${k}" class="${(st.weatherOverride||E.weatherNow())===k?'on':''}"><span>${WXI[k]}</span>${WX[k][1]}</button>`).join('')}</div></div>
   <p class="iwx-n">天氣與時間會影響夥伴的行程：下雨會躲雨、淋太久可能感冒；夜晚會想睡覺、看星星。</p></div>`);
  const r=s.el.querySelector('#iwxT'),tv=s.el.querySelector('#iwxTv'),paint=()=>{const v=+r.value,h=Math.floor(v),m=Math.round((v-h)*60);tv.textContent=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;r.style.setProperty('--p',v/23.75*100+'%')};paint();
  r.oninput=()=>{paint();st.timeOverride=+r.value;Cfg.save();E.setTime();refresh()};
  s.el.addEventListener('click',e=>{const m=e.target.closest('[data-m]');if(m){s.el.querySelectorAll('[data-m]').forEach(x=>x.classList.toggle('on',x===m));const live=m.dataset.m==='live';s.el.querySelector('.iwx-c').classList.toggle('off',live);
      if(live){delete st.timeOverride;delete st.weatherOverride}else{st.timeOverride=+r.value;st.weatherOverride=st.weatherOverride||E.weatherNow()}Cfg.save();E.setTime();refresh();return}
    const w=e.target.closest('[data-w]');if(w){st.weatherOverride=w.dataset.w;s.el.querySelectorAll('[data-w]').forEach(x=>x.classList.toggle('on',x===w));Cfg.save();E.setTime();refresh();buzz(6)}})}

/* ---------- photo mode ---------- */
function photo(){document.documentElement.classList.add('photo-mode');const ov=document.createElement('div');ov.className='ph-ov';ov.innerHTML=`<button class="ph-x" aria-label="離開拍照">✕</button><button class="ph-shot" aria-label="拍照"></button><small>拖曳旋轉・雙指縮放</small>`;
  (document.getElementById('app')||document.body).append(ov);
  ov.querySelector('.ph-x').onclick=()=>{ov.remove();document.documentElement.classList.remove('photo-mode')};
  ov.querySelector('.ph-shot').onclick=()=>{buzz(20);E.renderer.render(E.scene,E.camera);const url=E.renderer.domElement.toDataURL('image/png');ov.classList.add('flash');setTimeout(()=>ov.classList.remove('flash'),300);
    const name=`oc-shimeji-${Date.now()}.png`;if(window.OCNative?.saveFile){try{OCNative.saveFile(name.replace('.png','.txt'),url)}catch(_){}}const aEl=document.createElement('a');aEl.href=url;aEl.download=name;aEl.click();toast('照片已儲存','camera');try{Econ.on('photo')}catch(_){}}}

/* ---------- build (house) ---------- */
function openBuild(){const cur=H()?.current();const s=openSheet(`<div data-emoji-keep class="sh-body ibuild"><div class="sh-title">佈置小島</div>
   <div class="sec">我的家</div><div class="ibh">${Object.entries(H().HOUSES).map(([k,d])=>`<button data-h="${k}" class="${cur?.type===k?'on':''}"><span class="ibh-art k-${k}"></span><b>${d.name}</b><small>${d.desc}</small></button>`).join('')}</div>
   ${cur?`<button class="btn" data-move>${ic('route')}移動房子的位置</button>`:''}</div>`);
  s.el.addEventListener('click',e=>{const h=e.target.closest('[data-h]');if(h){s.close();setTimeout(()=>H().beginPlace(h.dataset.h),280);return}if(e.target.closest('[data-move]')){s.close();setTimeout(()=>H().beginPlace(cur.type),280)}})}

/* ---------- room HUD ---------- */
function roomUI(on){const box=$h('.ih-room-acts');if(!on){box.innerHTML='';return}const S=H().SPOTS;box.innerHTML=Object.entries(S).map(([k,s])=>`<button data-spot="${k}">${{bed:'🛏️',table:'🍽️',sofa:'🛋️',books:'📚',kitchen:'🍳'}[k]}<b>${s.label}</b></button>`).join('');
  box.onclick=e=>{const b=e.target.closest('[data-spot]');if(!b)return;buzz(8);H().use(Cfg.v.active,b.dataset.spot)}}

/* ---------- bottom navigation (reference layout) ---------- */
function rebuildNav(){const nav=document.getElementById('nav');if(!nav||nav.dataset.isle)return;nav.dataset.isle=1;
  const btn=(attrs,icon,label)=>`<button class="nav-btn ih-nav" ${attrs} aria-label="${label}"><span class="ihn-i">${icon}</span><i class="nd"></i></button>`;
  const tabs=[...nav.querySelectorAll('.nav-btn')];tabs.forEach(b=>b.remove());
  nav.insertAdjacentHTML('beforeend',btn('data-tab="0"',IK.home,'首頁')+btn('data-tab="1"',IK.chars,'角色')+btn('data-nact="bag"',IK.navbag,'背包')+btn('data-nact="quest"',IK.navquest,'任務')+btn('data-nact="shop"',IK.shop,'商店')+btn('data-nact="more"',IK.more,'更多'));
  Nav.btns=[...nav.querySelectorAll('.nav-btn[data-tab]')];nav.classList.add('ih-navbar');
  nav.addEventListener('click',e=>{const b=e.target.closest('.nav-btn');if(!b||b.dataset.tab!=null)return;e.stopImmediatePropagation();buzz(6);const k=b.dataset.nact;if(k==='bag')openBag(Cfg.v.active);else if(k==='quest')openQuests(0);else if(k==='shop')openShop();else openMore()},true);
  const go=Nav.go;Nav.go=function(i){const r=go.apply(this,arguments);nav.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('on',b.dataset.tab!=null&&+b.dataset.tab===this.cur));return r};
  nav.querySelector('[data-tab="0"]').classList.add('on')}

/* ---------- quest fix: the card used to "claim" the wrong system ---------- */
function fixQuests(){if(!window.Econ||!window.Eco)return;
  const job=id=>(Econ.s.jobs||[]).find(j=>j.id===id);
  Eco.ready=q=>{const j=job(q.id);if(j)return !j.c&&j.p>=j.n;if(q.id==='jb'){const js=Econ.s.jobs||[];return js.length>0&&js.every(x=>x.c)&&!Econ.s.bc}return false};
  Eco.prog=q=>{const j=job(q.id);return j?Math.min(j.n,j.p):q.id==='jb'?(Econ.s.jobs||[]).filter(x=>x.c).length:0};
  Eco.claim=id=>{const ok=Econ.claimJob(id);refresh();return ok};
  Eco.anyReady=()=>QUESTS.some(q=>Eco.ready(q));
  HUD.questTap=()=>openQuests(0)}

/* ---------- start ---------- */
const UI={start(){if(UI.started)return;UI.started=true;document.documentElement.classList.add('ihud-on');buildHUD();bindTouch();rebuildNav();fixQuests();
  H()?.on?.((t,v)=>{if(t==='room'){hud.classList.toggle('room',v);roomUI(v);closeMenu()}});
  // close the menu when leaving home
  const go=Nav.go;Nav.go=function(i){if(i!==0)closeMenu();return go.apply(this,arguments)};
  newsDot()},refresh,openMenu,closeMenu,openBag,openWho,openQuestsCard:()=>openQuests(0),selectAgent,IK,banner};
window.Isle3DUI=UI;
})();
