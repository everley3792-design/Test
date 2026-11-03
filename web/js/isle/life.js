/* ===== Isle3D 生活模擬 2.0：效用 AI、社交與關係變化、吵架／絕交／和好、生病 =====
   Every resident decides what to do from needs × personality × traits × time ×
   weather × place memories (utility scores with noise and cooldowns). Social
   interactions can go well or badly depending on compatibility, mood and
   tension; repeated friction leads to quarrels and, eventually, estrangement,
   which can heal through apologies or the player's help. Characters can catch
   a cold in the rain, get a tummy ache from overeating or run down from lack of
   sleep — and recover with rest, care and medicine.
   Persistence reuses existing stores: needs → IsleLife.X(id).needs,
   memories → IsleLife.memo, relationships → OCSCommunity.pair, skills → L30.gain.
   New state lives in Cfg.v.isle3d (health, relationship status, journal). */
(()=>{'use strict';
const E=window.Isle3D;if(!E)return;const T=E.T,V3=T.Vector3;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)],lerpA=(a,b,t)=>{let d=((b-a+Math.PI*3)%(Math.PI*2))-Math.PI;return a+d*t};
const NK=['hunger','thirst','energy','sleep','fun','social','comfort'];
const S=()=>{const v=Cfg.v;if(!v.isle3d||typeof v.isle3d!=='object')v.isle3d={};const s=v.isle3d;for(const k of['health','rel','journal'])if(!s[k]||typeof s[k]!=='object')s[k]=k==='journal'?[]:{};if(!Array.isArray(s.journal))s.journal=[];return s};
const LF=()=>window.IsleLife,CM=()=>window.OCSCommunity,L30=()=>window.L30;
const traitsOf=ch=>{try{return LF()?.traitIds?LF().traitIds(ch):(ch.data?.pers?.traits||[])}catch(_){return ch.data?.pers?.traits||[]}};
const persOf=ch=>{try{return Persona.eff(ch.data)}catch(_){return{lively:50,social:50,expr:50,pace:50,indep:50,friendly:50}}};
const has=(a,...t)=>t.some(x=>a.traits.includes(x));
const first=n=>(n||'').split(' ')[0];

const L={agents:new Map(),listeners:new Set(),selected:null,paused:false};
const emit=(type,d)=>L.listeners.forEach(f=>{try{f(type,d)}catch(e){console.error(e)}});
L.on=f=>{L.listeners.add(f);return()=>L.listeners.delete(f)};
function journal(text,kind='life',ids=[]){const j=S().journal;j.unshift({t:Date.now(),text,kind,ids});j.length=Math.min(120,j.length);Cfg.save();emit('journal',{text,kind,ids})}
L.journal=journal;

/* ---------- lines (offline, personality-aware) ---------- */
const LINES={
  hi:['嗨～','早安呀！','今天也很棒呢！','你在做什麼？','嘿嘿，看到你真好。'],
  chatOk:['哈哈，真的嗎！','我也這麼覺得！','你好有趣喔～','下次一起去海邊吧！','好想聊整天！'],
  chatBad:['……嗯。','你根本沒在聽嘛。','這樣說有點過分喔。','算了啦。','哼。'],
  joke:['你知道為什麼魚不會說話嗎？','噗哈哈哈！','我剛剛差點跌倒，好糗！'],
  quarrel:['你怎麼可以這樣！','我不想跟你說話了！','每次都這樣！','哼！走開啦！'],
  sorry:['那個……對不起。','是我太衝動了，抱歉。','我們和好好不好？'],
  sorryOk:['嗯……我也有不對。','好啦，原諒你了。','和好吧！'],
  sorryNo:['我還沒準備好……','讓我靜一靜。'],
  sneeze:['哈啾！','哈——啾！','鼻子好癢……','咳咳……'],
  sick:['頭有點暈……','好想躺著……','身體熱熱的……'],
  well:['我好多了！','謝謝你照顧我。','元氣恢復！'],
  sleepy:['呼啊……好睏。','要去睡了……'],hungry:['肚子咕嚕叫了……','好想吃東西～'],
  fish:['今天會釣到大魚嗎？','噓，魚要上鉤了。'],garden:['快快長大喔～','花開得好漂亮！'],stargaze:['好多星星……','許個願吧。'],read:['這本書好好看。','再讀一頁就好……'],
  dance:['來跳舞吧♪','啦啦啦～'],fire:['火好暖和。','烤棉花糖最棒了！'],petted:['好舒服～','呼嚕嚕……','再摸一下下……','嘿嘿。'],estranged:['……','（別過頭去）']};
function lineFor(a,k){const own=a.ch.data?.lines?.[k==='petted'?'pet':k==='hi'?'greet':'_'];const pool=[...(own&&own.length&&Math.random()<.5?own:[]),...(LINES[k]||[])];let t=pick(pool.length?pool:['……']);
  const sp=a.ch.data?.speech;if(sp?.tic&&Math.random()<.4)t+=sp.tic;if(sp?.catch&&Math.random()<.12)t=sp.catch;return t}

/* ---------- relationships ---------- */
function pair(a,b){try{return CM().pair(a,b)}catch(_){const k=[a,b].sort().join('|'),r=S().rel;return r[k]||(r[k]={score:0,tension:0,count:0,last:0})}}
const relKey=(a,b)=>[a,b].sort().join('|');
function relState(a,b){return S().rel[relKey(a,b)]||(S().rel[relKey(a,b)]={status:'',since:0})}
function relLabel(a,b){const p=pair(a,b),st=relState(a,b).status;if(st==='estranged')return'絕交中';if(p.tension>=6)return'鬧彆扭';if(p.score>=70)return'摯友';if(p.score>=30)return'朋友';if(p.score<=-10)return'不太合';return p.count?'認識':'陌生'}
function bump(a,b,ds,dt=0){const p=pair(a,b),before=relLabel(a,b);p.score=clamp((p.score||0)+ds,-30,100);p.tension=clamp((p.tension||0)+dt,0,10);p.count=(p.count||0)+1;p.last=Date.now();try{CM().persist()}catch(_){}
  const after=relLabel(a,b);if(after!==before&&(after==='朋友'||after==='摯友')){const A=L.agents.get(a),B=L.agents.get(b);journal(`${first(A?.ch.name)} 和 ${first(B?.ch.name)} 成為${after}了！`,'rel',[a,b]);emit('milestone',{a,b,label:after})}Cfg.save()}
function compat(A,B){const pa=A.pers,pb=B.pers;let c=1-(Math.abs(pa.lively-pb.lively)+Math.abs(pa.social-pb.social)+Math.abs(pa.pace-pb.pace))/300;
  c+=A.traits.filter(t=>B.traits.includes(t)).length*.12;if(has(A,'sharp','tsun')&&has(B,'shy','timid'))c-=.15;if(has(A,'gentle','soft','caring')||has(B,'gentle','soft','caring'))c+=.1;return clamp(c,0,1.3)}
L.relLabel=relLabel;L.pair=pair;L.relState=relState;

/* ---------- agent ---------- */
const STUB=()=>{const div=()=>document.createElement('div');const base={actor:div(),root:div(),bubble:div(),flip:div(),art:div(),adj:div(),shadow:div(),fx:div(),cool:{},hist:[],spots:{},dir:1,state:'idle'};
  return new Proxy(base,{get:(t,k)=>k in t?t[k]:typeof k==='string'&&/^[a-z]/.test(k)?()=>{}:undefined,set:(t,k,v)=>{t[k]=v;return true}})};
class Agent{
  get nd(){return this._nd}
  set nd(v){if(v&&typeof v==='object'&&Number.isFinite(+v.hunger))this._nd=v}
  constructor(ch,i){this._nd={hunger:.8,thirst:.8,energy:.8,sleep:.8,fun:.7,social:.7,comfort:.8};this.id=ch.id;this.ch=ch;this.cat=E.Cat?new E.Cat(ch):null;this.root=this.cat.root;E.chars.add(this.root);
    this.traits=traitsOf(ch);this.pers=persOf(ch);
    const sp=E.spawnPoint?E.spawnPoint(i):{x:rnd(-3,3),z:rnd(1,5)};this.pos=new V3(sp.x,0,sp.z);this.yaw=rnd(-3,3);this.vel=0;
    this.root.position.set(this.pos.x,E.groundY(this.pos.x,this.pos.z),this.pos.z);
    this.task=null;this.cool={};this.q=[];this.thinkT=rnd(.2,2);this.wet=0;this.eaten=0;this.chatT=rnd(5,15);this.inside=false;
    // legacy-compatible node shape (IsleLife.needs / L30.gain / L31 profile read these)
    this.s=STUB();this.s.ch=ch;this.s.fat=0;this.nd=null;try{this.nd=LF()?LF().needs(this):null}catch(_){}if(!this.nd){this.nd={};NK.forEach(k=>this.nd[k]=rnd(.6,.9))}
    this.s.fat=1-(this.nd.energy??.8);this.x=0;this.y=0;this.path=[];this.emo=null}
  get health(){return S().health[this.id]||null}
  set health(v){if(v)S().health[this.id]=v;else delete S().health[this.id];Cfg.save()}
  speedMul(){let m=(.75+this.pers.pace/200)*(this.health?.6:1);if(this.emo?.id==='sad'||this.emo?.id==='tired')m*=.82;if(this.emo?.id==='excited')m*=1.15;return m}
}
L.Agent=Agent;

/* ---------- needs, mood, health tick ---------- */
function circadian(a){const h=E.hourNow();let bed=22.5;if(has(a,'night','owl','nightowl'))bed+=2;if(has(a,'early','earlybird'))bed-=1.5;const d=(h-bed+48)%24;return d<8?1:d>23?.4:0}
function tickNeeds(a,dt){const n=a.nd,k=dt/60,mv=a.vel>.1,ill=a.health,rain=(E.sky.wx==='rain'||E.sky.wx==='storm')&&!a.inside&&!a.under;
  n.hunger-=k*(.035+(has(a,'foodie','bigeater')?.015:0));n.thirst-=k*(.045+(E.sky.phase==='day'&&E.sky.wx==='sunny'?.015:0));n.fun-=k*.03;n.social-=k*(.025+(a.pers.social-50)/2500);
  n.sleep-=k*(.012+circadian(a)*.06);n.comfort-=k*(rain?.08:.015);if(a.task?.rest)n.comfort+=k*.2;
  a.s.fat=clamp(a.s.fat+k*(mv?(a.task?.run?.06:.025):-.03)+(ill?k*.02:0),0,1);n.energy=1-a.s.fat;
  NK.forEach(x=>n[x]=clamp(n[x],.03,1));
  // rain → wet → cold
  a.wet=clamp(a.wet+(rain?k*.9:-k*1.5),0,1);
  if(!ill&&a.wet>.85&&Math.random()<k*.6&&!has(a,'sporty','athletic'))catchSick(a,'cold');
  if(!ill&&n.sleep<.08&&Math.random()<k*.25)catchSick(a,'tired');
  if(ill){ill.sev=clamp(ill.sev-k*(a.task?.type==='sleep'?.25:a.task?.rest?.1:.04)*(ill.cared?1.8:1)*(ill.med?2.5:1),0,1);a.health=ill;
    if(ill.sev<=0){a.health=null;feel(a,'happy',.6,40);say(a,lineFor(a,'well'),3);journal(`${first(a.ch.name)} 的病好了！`,'health',[a.id]);memo(a,'生病後終於康復了')}
    else if(Math.random()<k*(ill.kind==='cold'?3:1.2)){say(a,lineFor(a,ill.kind==='cold'?'sneeze':'sick'),2.2);a.cat.play('sick');a.cat.expr({sick:1,eyes:'sad'},2.5)}
    // contagion to close friends
    if(ill.kind==='cold')for(const b of L.agents.values())if(b!==a&&!b.health&&b.pos.distanceTo(a.pos)<1.4&&Math.random()<k*.08)catchSick(b,'cold',a)}
  // mood from needs
  if(!a.emo||a.emo.i<.4){if(ill)feel(a,'sick',.5,30,true);else if(n.sleep<.2||n.energy<.15)feel(a,'tired',.5,40,true);else if(n.fun<.18)feel(a,'bored',.4,30,true);else if(n.social<.15&&!has(a,'loner','introvert'))feel(a,'sad',.35,40,true);else if(n.hunger<.15)feel(a,'hungry',.4,30,true)}
  if(a.emo){a.emo.i-=dt/(a.emo.d*1.5);if(a.emo.i<=0)a.emo=null}}
function catchSick(a,kind,from){const sev=kind==='cold'?rnd(.55,.8):kind==='tummy'?rnd(.35,.5):rnd(.3,.45);a.health={kind,sev,since:Date.now()};
  const label={cold:'感冒',tummy:'肚子痛',tired:'過度疲勞'}[kind];say(a,kind==='cold'?'哈啾！好像感冒了……':kind==='tummy'?'肚子……好痛……':'好累……撐不住了……',3);a.cat.expr({sick:1,eyes:'sad'},4);
  journal(`${first(a.ch.name)} ${from?`被 ${first(from.ch.name)} 傳染，`:''}${label}了。讓牠多休息，或給牠吃點東西、照顧一下吧。`,'health',[a.id]);memo(a,`${label}了`,-1);emit('sick',{id:a.id,kind});a.task=null}
L.healthLabel=a=>{const h=a.health;return h?({cold:'感冒',tummy:'肚子痛',tired:'過度疲勞'}[h.kind]+`（${Math.round(h.sev*100)}%）`):''};
function feel(a,id,i=.6,d=40){a.emo={id,i,d};const map={happy:{eyes:'happy',blush:1},excited:{eyes:'happy',mouth:'open'},sad:{eyes:'sad',mouth:'frown'},angry:{eyes:'angry',anger:1,mouth:'frown'},shy:{blush:1},tired:{eyes:'sleep'},sick:{sick:1,eyes:'sad'}};
  a.cat.baseFace=map[id]&&id!=='tired'?map[id]:null;a.cat.faceDirty=true;try{LF()?.feel?.(a,id,i,d,true)}catch(_){}}
L.feel=feel;
function memo(a,text,v=1,place){try{LF()?.memo({id:a.id,task:a.task},text,{place:place||a.task?.label||'小島',v})}catch(_){}}

/* ---------- speech / emotes (DOM overlay, transform-only updates) ---------- */
let layer=null;
function ensureLayer(){if(layer)return layer;layer=document.createElement('div');layer.id='isleLabels';layer.dataset.emojiKeep='';(document.getElementById('isle3d')||document.body).append(layer);return layer}
function say(a,text,sec=2.6){if(!text||Cfg.v.bubbles===false)return;const el=a.bubble||(a.bubble=Object.assign(document.createElement('div'),{className:'il-bubble'}));if(!el.isConnected)ensureLayer().append(el);
  el.innerHTML=`<b>${esc(first(a.ch.name))}</b>${esc(text)}`;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');a.bubbleUntil=E.clock+sec;a.cat.expr(Object.assign({},a.cat.face,{talk:1}),Math.min(1.6,sec))}
function emote(a,kind,sec=1.8){const el=document.createElement('div');el.className='il-emote k-'+kind;el.textContent={heart:'❤',note:'♪',anger:'💢',sweat:'💧',idea:'!',question:'?',zzz:'Z',sparkle:'✦',sad:'…',sneeze:'＊'}[kind]||'!';ensureLayer().append(el);a.emotes=(a.emotes||[]);a.emotes.push({el,until:E.clock+sec,born:E.clock});}
L.say=say;L.emote=emote;
const pv=new V3();
function placeLabels(){if(!layer)return;for(const a of L.agents.values()){const vis=a.root.visible;pv.copy(a.root.position);pv.y+=2.15;const p=E.project(pv),on=vis&&p.vis&&p.x>-60&&p.x<E.W+60;
    if(a.bubble){if(E.clock>a.bubbleUntil||!on){if(a.bubble.classList.contains('on'))a.bubble.classList.remove('on')}a.bubble.style.transform=`translate3d(${p.x|0}px,${p.y|0}px,0)`}
    if(a.emotes)a.emotes=a.emotes.filter(m=>{if(E.clock>m.until||!on){m.el.remove();return false}const k=(E.clock-m.born);m.el.style.transform=`translate3d(${(p.x+14)|0}px,${(p.y-8-k*14)|0}px,0) scale(${Math.min(1,k*5)})`;m.el.style.opacity=String(Math.min(1,(m.until-E.clock)*2));return true});
    if(a.tag){a.tag.style.transform=`translate3d(${p.x|0}px,${(p.y+30)|0}px,0)`;a.tag.style.display=on?'':'none'}}}

/* ---------- activities (utility AI) ---------- */
const poi=type=>(E.POI||[]).filter(p=>p.type===type);
const near=(a,type)=>{const l=poi(type);return l.sort((p,q)=>Math.hypot(p.x-a.pos.x,p.z-a.pos.z)-Math.hypot(q.x-a.pos.x,q.z-a.pos.z))[0]};
const DEFS={
  wander:{label:'散步',score:a=>.35+a.pers.lively/300+(has(a,'curious','walker')?.2:0),start:a=>({type:'go',to:randomSpot(a),then:{anim:'look',dur:rnd(2,4)}})},
  rest:{label:'發呆休息',score:a=>(1-a.nd.energy)*.9+(has(a,'lazy','sleepy')?.25:0),start:a=>{const p=near(a,'shade');return{type:'go',to:p||randomSpot(a),then:{anim:'sit',dur:rnd(10,22),rest:1,label:'樹蔭下'}}}},
  bench:{label:'坐長椅',score:a=>(1-a.nd.comfort)*.9+.1,start:a=>{const p=near(a,'sit');return p&&{type:'go',to:p,then:{anim:'sit',dur:rnd(12,25),rest:1,face:p.ry+Math.PI,label:p.label}}}},
  sleep:{label:'睡覺',score:a=>(1-a.nd.sleep)*1.4+circadian(a)*.9+(has(a,'sleepy','napper')?.25:0)+(a.health?.4:0),start:a=>E.house?{type:'go',to:E.house.door,then:{type:'home',why:'sleep',dur:rnd(40,80)}}:{type:'go',to:near(a,'shade')||randomSpot(a),then:{anim:'sleep',dur:rnd(30,60),type:'sleep',label:'樹下'}}},
  eat:{label:'吃飯',score:a=>(1-a.nd.hunger)*1.35+(1-a.nd.thirst)*.6+(has(a,'foodie')?.2:0),start:a=>E.house?{type:'go',to:E.house.door,then:{type:'home',why:'eat',dur:rnd(14,22)}}:{type:'go',to:near(a,'campfire'),then:{anim:'eat',dur:12,eat:1,label:'營火'}}},
  fish:{label:'釣魚',score:a=>.15+(1-a.nd.fun)*.5+(has(a,'sealover','calm','collector')?.45:0),cd:120,start:a=>{const p=near(a,'fish');return p&&{type:'go',to:p,then:{anim:'fish',dur:rnd(20,35),fun:1,skill:'sea',label:'碼頭',face:p.ry}}}},
  garden:{label:'照顧花草',score:a=>.15+(1-a.nd.fun)*.4+(has(a,'nature','gentle','hardworking')?.45:0),cd:100,start:a=>{const p=near(a,'garden');return p&&{type:'go',to:p,then:{anim:'garden',dur:rnd(14,24),fun:1,skill:'garden',label:'花圃',face:Math.PI}}}},
  stargaze:{label:'看星星',score:a=>E.sky.phase==='night'&&E.sky.wx!=='rain'?.25+(has(a,'dreamer','artsy','romantic')?.5:0):0,cd:200,start:a=>{const p=near(a,'stargaze');return p&&{type:'go',to:p,then:{anim:'sit',dur:rnd(18,30),fun:1,skill:'art',label:'山丘',stargaze:1}}}},
  read:{label:'看書',score:a=>.12+(has(a,'bookworm','smart','quiet','introvert')?.5:0)+(E.sky.wx==='rain'?.15:0),cd:150,start:a=>{const p=near(a,'sit')||near(a,'shade');return{type:'go',to:p||randomSpot(a),then:{anim:'read',dur:rnd(18,30),fun:1,skill:'read',label:'讀書',face:p?.ry!=null?p.ry+Math.PI:undefined}}}},
  dance:{label:'跳舞',score:a=>.08+(a.pers.lively-50)/150+(has(a,'sunny','hot','music','cheerful')?.35:0)-(a.health?1:0),cd:160,start:a=>({type:'go',to:near(a,'plaza')||randomSpot(a),then:{anim:'dance',dur:rnd(8,14),fun:1,skill:'sport',label:'廣場'}})},
  campfire:{label:'營火取暖',score:a=>(E.sky.phase==='night'||E.sky.phase==='dusk'?.35:.05)+(1-a.nd.comfort)*.3+(1-a.nd.social)*.3,cd:120,start:a=>{const p=near(a,'campfire');return p&&{type:'go',to:ringAround(p,a),then:{anim:'sit',dur:rnd(16,28),rest:1,social:1,label:'營火',faceTo:p}}}},
  socialize:{label:'找朋友',score:a=>(1-a.nd.social)*1.15+(a.pers.social-50)/180+(has(a,'chatty','extrovert')?.2:0),cd:30,start:a=>{const b=pickFriend(a);return b&&{type:'visit',who:b.id}}},
  mail:{label:'看信箱',score:a=>.06,cd:400,start:a=>{const p=near(a,'mail');return p&&{type:'go',to:p,then:{anim:'look',dur:3,label:'信箱',mail:1}}}},
  shelter:{label:'躲雨',score:a=>(E.sky.wx==='rain'||E.sky.wx==='storm')&&!a.under?.9+a.wet:0,start:a=>E.house?{type:'go',to:E.house.door,then:{type:'home',why:'shelter',dur:rnd(25,45)}}:{type:'go',to:near(a,'shade'),then:{anim:'sit',dur:20,under:1,label:'樹下躲雨'}}}};
function randomSpot(a){for(let i=0;i<30;i++){const ang=rnd(0,6.28),r=rnd(1,E.R-2.2),x=Math.cos(ang)*r,z=Math.sin(ang)*r;if(E.inside(x,z,1.4)&&!E.blocked(x,z,.6))return{x,z}}return{x:0,z:3}}
function ringAround(p,a){const k=[...L.agents.values()].filter(b=>b.task?.then?.label===p.label||b.task?.label===p.label).length,ang=(a.id.length*1.3+k*1.6)%6.28;return{x:p.x+Math.cos(ang)*(p.r||1.4),z:p.z+Math.sin(ang)*(p.r||1.4)}}
function pickFriend(a){const others=[...L.agents.values()].filter(b=>b!==a&&!b.inside&&b.task?.type!=='sleep');if(!others.length)return null;
  return others.map(b=>{const p=pair(a.id,b.id),st=relState(a.id,b.id).status;let w=1+(p.score||0)/40+compat(a,b)-(p.tension||0)*.25;if(st==='estranged')w=.05;if(b.health&&has(a,'caring','gentle','soft'))w+=1;return[b,Math.max(.02,w)+Math.random()*.6]}).sort((x,y)=>y[1]-x[1])[0][0]}
function decide(a){if(a.inside||a.held)return;let best=null,bs=-1;
  for(const k in DEFS){const d=DEFS[k];if((a.cool[k]||0)>E.clock)continue;let sc=d.score(a);if(!(sc>0))continue;
    sc*=rnd(.8,1.2);try{const pl=LF()?.X(a.id)?.log?.place?.[d.label];if(pl)sc*=1+Math.min(.4,pl*.02)}catch(_){}if(a.health&&!['rest','sleep','bench','eat','shelter'].includes(k))sc*=.3;
    if(sc>bs){bs=sc;best=k}}
  const t=best&&DEFS[best].start(a);if(!t){a.thinkT=rnd(2,4);return}t.key=best;t.label=t.then?.label||DEFS[best].label;a.task=t;a.cool[best]=E.clock+(DEFS[best].cd||25);a.thinkT=0}

/* ---------- movement ---------- */
function steer(a,tx,tz,dt,run){const dx=tx-a.pos.x,dz=tz-a.pos.z,d=Math.hypot(dx,dz);if(d<.12)return true;
  let vx=dx/d,vz=dz/d;
  for(const o of E.obstacles){if(o.on===false)continue;const ox=a.pos.x-o.x,oz=a.pos.z-o.z,od=Math.hypot(ox,oz),rr=o.r+.45;if(od<rr+.8&&od>.001){const push=(rr+.8-od)/(rr+.8);
      if(Math.hypot(tx-o.x,tz-o.z)<o.r+.3)continue;const side=(vx*oz-vz*ox)>0?1:-1;vx+=(ox/od)*push*1.2+(-oz/od)*side*push*.9;vz+=(oz/od)*push*1.2+(ox/od)*side*push*.9}}
  for(const b of L.agents.values()){if(b===a||b.inside)continue;const ox=a.pos.x-b.pos.x,oz=a.pos.z-b.pos.z,od=Math.hypot(ox,oz);if(od<.75&&od>.001){vx+=ox/od*.6;vz+=oz/od*.6}}
  const vl=Math.hypot(vx,vz)||1;vx/=vl;vz/=vl;const sp=(run?2.6:1.15)*a.speedMul();
  let nx=a.pos.x+vx*sp*dt,nz=a.pos.z+vz*sp*dt;if(!E.inside(nx,nz,.8)){nx=a.pos.x;nz=a.pos.z;a.stuck=(a.stuck||0)+dt}
  const moved=Math.hypot(nx-a.pos.x,nz-a.pos.z);a.pos.x=nx;a.pos.z=nz;a.vel=moved/dt;a.cat.walkPh+=moved/(run?.42:.3)*Math.PI;
  a.yaw=lerpA(a.yaw,Math.atan2(vx,vz),1-Math.exp(-dt*10));if(moved<sp*dt*.2)a.stuck=(a.stuck||0)+dt;else a.stuck=0;
  return d<.35||(a.stuck>2.5)}

/* ---------- per-agent update ---------- */
function update(a,dt){const c=a.cat;if(a.inside){if(E.viewMode!=='room')a.root.visible=false;return}a.root.visible=E.viewMode!=='room';
  if(a.held){c.play('held');return}
  if(a.petting){c.play('petted');a.vel=0}
  else{const t=a.task;
    if(!t){a.vel=0;if(c.act==='walk'||c.act==='run')c.play('idle');if((a.thinkT-=dt)<=0)decide(a)}
    else if(t.type==='go'||t.type==='cmd'){const tgt=t.to;if(!tgt){a.task=null}else{const run=t.run||(t.type==='cmd'&&Math.hypot(tgt.x-a.pos.x,tgt.z-a.pos.z)>6);c.play(run?'run':'walk');
        if(steer(a,tgt.x,tgt.z,dt,run)){a.vel=0;if(t.then){a.task=Object.assign({type:'do'},t.then,{key:t.key,t0:E.clock});startDo(a,a.task)}else{a.task=null;c.play('idle');a.thinkT=rnd(1,3)}}}}
    else if(t.type==='visit'){const b=L.agents.get(t.who);if(!b||b.inside){a.task=null}else{c.play('walk');if(steer(a,b.pos.x,b.pos.z,dt,false)||a.pos.distanceTo(b.pos)<1.15){a.vel=0;socialEncounter(a,b);if(a.task===t)a.task=null}}}
    else if(t.type==='do'){a.vel=0;if(t.faceTo)a.yaw=lerpA(a.yaw,Math.atan2(t.faceTo.x-a.pos.x,t.faceTo.z-a.pos.z),1-Math.exp(-dt*5));else if(t.face!=null)a.yaw=lerpA(a.yaw,t.face,1-Math.exp(-dt*5));
      doTick(a,t,dt);if(E.clock-t.t0>t.dur){endDo(a,t);a.task=null;a.thinkT=rnd(.5,2.5)}}
    else if(t.type==='talk'){a.vel=0;const b=L.agents.get(t.with);if(b)a.yaw=lerpA(a.yaw,Math.atan2(b.pos.x-a.pos.x,b.pos.z-a.pos.z),1-Math.exp(-dt*6));if(E.clock>t.until){a.task=null;c.play('idle');a.thinkT=rnd(1,3)}}}
  // ambient chatter between passers-by
  if((a.chatT-=dt)<=0){a.chatT=rnd(25,60);if(!a.task||a.task.type==='do'){const lines=a.task?.key&&LINES[a.task.key];if(lines&&Math.random()<.5)say(a,pick(lines),2.4)}}
  a.root.position.set(a.pos.x,E.groundY(a.pos.x,a.pos.z)+(a.task?.seatY||0),a.pos.z);a.root.rotation.y=a.yaw;a.x=a.pos.x;a.y=a.pos.z}
function startDo(a,t){const c=a.cat;if(t.type==='home'){enterHouse(a,t);return}c.play(t.anim||'idle');if(t.anim==='sleep')c.expr({eyes:'sleep'},t.dur);if(t.under)a.under=true;if(t.stargaze)c.expr({eyes:'happy'},6);
  if(t.mail){const has_=Math.random()<.35;setTimeout(()=>{say(a,has_?'有信耶！':'今天沒有信……',2.2);if(has_){emote(a,'sparkle');try{Econ.pay('mail_'+Eco.day()+'_'+a.id,'mail',10)}catch(_){}journal(`${first(a.ch.name)} 收到一封信，裡面夾著 10 星幣。`,'life',[a.id])}},1200)}
  if(t.key&&LINES[t.key]&&Math.random()<.6)setTimeout(()=>say(a,pick(LINES[t.key]),2.4),600)}
function doTick(a,t,dt){const k=dt/60,n=a.nd;if(t.fun)n.fun=clamp(n.fun+k*.5,0,1);if(t.rest)n.comfort=clamp(n.comfort+k*.4,0,1);if(t.social)n.social=clamp(n.social+k*.25,0,1);if(t.anim==='sleep'){n.sleep=clamp(n.sleep+k*.6,0,1);a.s.fat=clamp(a.s.fat-k*.6,0,1);if(Math.random()<dt*.15)emote(a,'zzz',2)}
  if(t.eat){n.hunger=clamp(n.hunger+k*2,0,1);n.thirst=clamp(n.thirst+k*1.5,0,1)}
  if(t.anim==='fish'&&Math.random()<dt*.025){const ok=Math.random()<.55;a.cat.play(ok?'happy':'fish');emote(a,ok?'sparkle':'sweat');say(a,ok?'釣到了！':'啊，跑掉了……',2);if(ok){try{const n_=L30();if(n_?.SPEC?.fish){const z=pick(n_.SPEC.fish.list);n_.discover('fish',z[0],a)}}catch(_){}}setTimeout(()=>a.task?.anim==='fish'&&a.cat.play('fish'),1200)}}
function endDo(a,t){a.under=false;if(t.skill)try{L30()?.gain(a,t.skill,3)}catch(_){}if(t.label&&(t.fun||t.rest)&&Math.random()<.5)memo(a,`在${t.label}${DEFS[t.key]?.label||''}`,1,t.label);if(t.eat){a.eaten++;if(a.eaten>3&&has(a,'foodie','bigeater')&&Math.random()<.2&&!a.health)catchSick(a,'tummy')}
  try{window.Econ?.on?.({fish:'fish',garden:'water',read:'read'}[t.key]||'life')}catch(_){}}

/* ---------- house (enter / exit) ---------- */
function enterHouse(a,t){a.inside=true;a.root.visible=false;a.task=Object.assign({},t,{type:'inside',t0:E.clock,label:'家裡'});emit('enter',{id:a.id});
  setTimeout(()=>{if(!a.inside)return;const n=a.nd;if(t.why==='sleep'){n.sleep=1;a.s.fat=0;if(a.health)a.health=Object.assign(a.health,{sev:Math.max(0,a.health.sev-.35)})}if(t.why==='eat'){n.hunger=Math.min(1,n.hunger+.6);n.thirst=Math.min(1,n.thirst+.6);a.eaten++}
    if(t.why==='shelter'){a.wet=0;n.comfort=Math.min(1,n.comfort+.4)}exitHouse(a)},t.dur*1000/(L.fast||1))}
function exitHouse(a){if(!a.inside)return;a.inside=false;const d=E.house?.door||{x:0,z:3};a.pos.set(d.x+rnd(-.3,.3),0,d.z+.6);a.yaw=E.house?.ry||0;a.task=null;a.thinkT=rnd(.5,1.5);a.root.visible=true;a.cat.play('stretch');emit('exit',{id:a.id})}
L.exitHouse=exitHouse;L.enterHouse=(a,why='rest')=>{if(E.house){a.task={type:'go',to:E.house.door,then:{type:'home',why,dur:20}}}};

/* ---------- social encounters ---------- */
function talkPair(a,b,sec){a.task={type:'talk',with:b.id,until:E.clock+sec};b.task={type:'talk',with:a.id,until:E.clock+sec};a.cat.play('talk');b.cat.play('talk')}
function socialEncounter(a,b,forced){const st=relState(a.id,b.id),p=pair(a.id,b.id);
  if(st.status==='estranged'&&!forced){ // avoid / maybe apologise
    const sorry=(a.pers.friendly>55||has(a,'gentle','soft','caring'))&&Math.random()<.18;if(sorry)return apologize(a,b);
    a.cat.play('sad');say(a,pick(LINES.estranged),2);b.yaw+=Math.PI;emote(b,'sad');a.task={type:'go',to:randomSpot(a)};return}
  if(b.task?.type==='sleep'||b.task?.anim==='sleep'){say(a,'噓……牠在睡覺。',2);a.task=null;return}
  const mood=(x)=>x.emo?.id==='angry'||x.emo?.id==='sad'||x.health?-.25:x.emo?.id==='happy'?.15:0;
  let pOk=.62+compat(a,b)*.25+(p.score||0)/400-(p.tension||0)*.06+mood(a)+mood(b)+(a.pers.friendly-50)/300;if(has(a,'sharp','tsun'))pOk-=.08;pOk=clamp(pOk,.1,.97);
  const kind=b.health&&has(a,'caring','gentle','soft','friendly')?'care':Math.random()<.18&&has(a,'prank','chatty','sunny')?'joke':Math.random()<.12&&(p.score||0)>40?'hug':Math.random()<.1?'play':'chat';
  if(kind==='care'){talkPair(a,b,5);say(a,'你還好嗎？要多休息喔。',3);setTimeout(()=>{say(b,'謝謝你……',2.4);emote(b,'heart')},1500);b.health=Object.assign(b.health,{cared:1});bump(a.id,b.id,4,-1);memo(b,`生病時 ${first(a.ch.name)} 來照顧我`);return}
  if(Math.random()<pOk){talkPair(a,b,kind==='hug'?3:5.5);
    if(kind==='hug'){a.cat.play('hug');b.cat.play('hug');emote(a,'heart');emote(b,'heart');bump(a.id,b.id,4,-1.5)}
    else if(kind==='play'){startTag(a,b);bump(a.id,b.id,3,-1);return}
    else{say(a,lineFor(a,kind==='joke'?'joke':'hi'),2.6);setTimeout(()=>{say(b,lineFor(b,'chatOk'),2.6);b.cat.play('happy');setTimeout(()=>b.task?.type==='talk'&&b.cat.play('talk'),900);emote(b,kind==='joke'?'note':'heart')},1400);bump(a.id,b.id,2.5,-.8)}
    a.nd.social=Math.min(1,a.nd.social+.3);b.nd.social=Math.min(1,b.nd.social+.3);feel(a,'happy',.5,30);feel(b,'happy',.45,30);if(Math.random()<.35)memo(a,`和 ${first(b.ch.name)} 聊天`,1);try{L30()?.gain(a,'social',2)}catch(_){}}
  else{ // misunderstanding → tension; may escalate to a quarrel
    talkPair(a,b,4);say(a,lineFor(a,'hi'),2.2);setTimeout(()=>{say(b,lineFor(b,'chatBad'),2.4);b.cat.play('angry');emote(b,'sweat')},1300);bump(a.id,b.id,-2.5,2.2);
    if((pair(a.id,b.id).tension||0)>=6&&Math.random()<.6)setTimeout(()=>quarrel(a,b),2600)}}
function quarrel(a,b){talkPair(a,b,5);a.cat.play('angry');b.cat.play('angry');a.cat.expr({eyes:'angry',anger:1,mouth:'frown'},6);b.cat.expr({eyes:'angry',anger:1,mouth:'frown'},6);
  say(a,pick(LINES.quarrel),2.4);setTimeout(()=>{say(b,pick(LINES.quarrel),2.4);emote(a,'anger');emote(b,'anger')},1300);
  bump(a.id,b.id,-9,1.5);feel(a,'angry',.8,90);feel(b,'angry',.8,90);memo(a,`和 ${first(b.ch.name)} 吵架了`,-1);memo(b,`和 ${first(a.ch.name)} 吵架了`,-1);
  const p=pair(a.id,b.id);journal(`${first(a.ch.name)} 和 ${first(b.ch.name)} 吵架了……`,'conflict',[a.id,b.id]);emit('quarrel',{a:a.id,b:b.id});
  if((p.score||0)<=-12&&(p.tension||0)>=8.5){const rs=relState(a.id,b.id);rs.status='estranged';rs.since=Date.now();Cfg.save();setTimeout(()=>{journal(`${first(a.ch.name)} 和 ${first(b.ch.name)} 絕交了。也許可以幫牠們和好……`,'conflict',[a.id,b.id]);emit('estranged',{a:a.id,b:b.id})},2000)}
  setTimeout(()=>{a.task={type:'go',to:randomSpot(a),run:true};b.task={type:'go',to:randomSpot(b)};a.cat.play('run')},5200)}
function apologize(a,b,helped){talkPair(a,b,6);a.cat.play('sad');say(a,pick(LINES.sorry),2.8);const p=pair(a.id,b.id),ok=helped?Math.random()<.85:Math.random()<.45+(b.pers.friendly-50)/150+(has(b,'gentle','soft')?.2:0)-(p.tension||0)*.03;
  setTimeout(()=>{if(ok){say(b,pick(LINES.sorryOk),2.6);a.cat.play('hug');b.cat.play('hug');emote(a,'heart');emote(b,'heart');p.tension=0;p.score=Math.max(p.score||0,8);const rs=relState(a.id,b.id);const was=rs.status==='estranged';rs.status='';Cfg.save();try{CM().persist()}catch(_){}
      feel(a,'happy',.7,60);feel(b,'happy',.7,60);memo(a,`和 ${first(b.ch.name)} 和好了`);memo(b,`和 ${first(a.ch.name)} 和好了`);journal(`${first(a.ch.name)} 和 ${first(b.ch.name)} ${was?'終於和好了！':'互相道歉，和好了。'}`,'rel',[a.id,b.id]);emit('reconcile',{a:a.id,b:b.id})}
    else{say(b,pick(LINES.sorryNo),2.6);b.yaw+=Math.PI;emote(a,'sad');bump(a.id,b.id,0,-1)}},1600);return ok}
function startTag(a,b){say(a,'來玩鬼抓人！',2);emote(a,'note');let n=0;const chase=()=>{if(n++>4||!L.agents.has(a.id)){a.task=null;b.task=null;return}const run=randomSpot(b);b.task={type:'go',to:run,run:true};a.task={type:'go',to:{x:run.x+rnd(-1,1),z:run.z+rnd(-1,1)},run:true};setTimeout(chase,2600)};chase();
  a.nd.fun=Math.min(1,a.nd.fun+.35);b.nd.fun=Math.min(1,b.nd.fun+.35);try{L30()?.gain(a,'sport',3);L30()?.gain(b,'sport',3)}catch(_){}memo(a,`和 ${first(b.ch.name)} 玩鬼抓人`)}
L.socialEncounter=socialEncounter;L.quarrel=quarrel;L.apologize=apologize;L.catchSick=catchSick;

/* ---------- player-facing actions (used by the interaction menu) ---------- */
L.command=(id,cmd)=>{const a=L.agents.get(id);if(!a)return;if(a.inside)exitHouse(a);a.petting=false;
  if(cmd.type==='goto'){a.task={type:'cmd',to:{x:cmd.x,z:cmd.z},then:cmd.then||null};a.thinkT=8}
  else if(cmd.type==='use'){const d=DEFS[cmd.key];const t=d&&d.start(a);if(t){t.key=cmd.key;t.label=t.then?.label||d.label;a.task=t}}
  else if(cmd.type==='visit'){const b=L.agents.get(cmd.who);if(b)a.task={type:'visit',who:b.id}}}
L.interact=(id,kind,targetId)=>{const a=L.agents.get(id);if(!a)return;const b=targetId&&L.agents.get(targetId);if(a.inside)exitHouse(a);
  const pl=()=>{try{Eco.act(kind==='pet'?'pet':'call')}catch(_){}};
  switch(kind){
    case 'chat':if(b){a.task={type:'visit',who:b.id}}else{talkSelf(a,lineFor(a,'hi'));a.nd.social=Math.min(1,a.nd.social+.15);pl()}break;
    case 'praise':a.cat.play('happy');a.cat.expr({eyes:'happy',blush:1},3);say(a,pick(['嘿嘿，被誇獎了！','真、真的嗎？','謝謝你～']),2.6);feel(a,'happy',.7,60);a.nd.fun=Math.min(1,a.nd.fun+.15);memo(a,'被誇獎了');pl();break;
    case 'comfort':a.cat.play('hug');a.cat.expr({eyes:'happy',blush:1},3);say(a,a.emo?.id==='sad'||a.emo?.id==='angry'?'謝謝你……我好多了。':'嗯？我很好呀～',2.8);if(a.emo&&['sad','angry'].includes(a.emo.id))a.emo=null;feel(a,'calm',.5,40);pl();break;
    case 'play':a.cat.play('dance');say(a,'好耶！來玩！',2.4);a.nd.fun=Math.min(1,a.nd.fun+.3);a.task={type:'do',anim:'dance',dur:6,t0:E.clock,fun:1};pl();break;
    case 'care':if(a.health){a.health=Object.assign(a.health,{cared:1,sev:Math.max(0,a.health.sev-.15)});a.cat.play('hug');say(a,'謝謝你照顧我……',2.6);emote(a,'heart');memo(a,'生病時被細心照顧')}break;
    case 'sleep':a.task=null;DEFS.sleep.start&&(a.task=Object.assign(DEFS.sleep.start(a),{key:'sleep',label:'睡覺'}));say(a,lineFor(a,'sleepy'),2);break;
    case 'eat':a.task=Object.assign(DEFS.eat.start(a),{key:'eat',label:'吃飯'});break;
    case 'follow':a.task={type:'cmd',to:{x:E.rig.tx,z:E.rig.tz}};break;
    case 'mediate':if(b){const helped=apologize(a,b,true);emote(a,'idea')}break;
    case 'hug':if(b){a.task={type:'visit',who:b.id};a.forceKind='hug'}break;
    case 'quarrel':if(b)quarrel(a,b);break;}
  emit('interact',{id,kind,targetId})};
function talkSelf(a,text){a.cat.play('talk');say(a,text,2.6);setTimeout(()=>{if(a.cat.act==='talk')a.cat.play('idle')},2600)}
/* petting by stroking (called continuously while the finger moves on the character) */
L.pet=(id,on)=>{const a=L.agents.get(id);if(!a)return;if(on&&!a.petting){a.petting=true;a.task=null;a.cat.expr({eyes:'happy',blush:1},999);say(a,lineFor(a,'petted'),2.4);a.petStart=E.clock;a.petAcc=0}
  else if(!on&&a.petting){a.petting=false;a.cat.expr({},0);a.cat.play('happy');setTimeout(()=>a.cat.act==='happy'&&a.cat.play('idle'),900);const dur=E.clock-a.petStart;
    if(dur>.8){feel(a,'happy',.7,60);memo(a,'被摸摸了');jealousy(a)}a.thinkT=rnd(2,4)}};
L.petStroke=(id)=>{const a=L.agents.get(id);if(!a||!a.petting)return;a.petAcc=(a.petAcc||0)+1;if(a.petAcc%3===0)emote(a,'heart',1.4);if(a.petAcc%9===0){say(a,lineFor(a,'petted'),2);try{Eco.act('pet')}catch(_){}}
  a.nd.social=Math.min(1,a.nd.social+.01);a.nd.fun=Math.min(1,a.nd.fun+.006);if(a.health)a.health=Object.assign(a.health,{cared:1})};
function jealousy(a){for(const b of L.agents.values())if(b!==a&&has(b,'jealous','clingy')&&b.pos.distanceTo(a.pos)<4&&Math.random()<.6){setTimeout(()=>{b.yaw=Math.atan2(a.pos.x-b.pos.x,a.pos.z-b.pos.z);b.cat.play('angry');say(b,pick(['……我也要摸摸。','為什麼只摸牠啦！','哼，我才不羨慕。']),2.6);emote(b,'anger');feel(b,'angry',.35,30)},900)}}
L.feed=(id,item)=>{const a=L.agents.get(id);if(!a)return;a.task={type:'do',anim:'eat',dur:3.5,t0:E.clock};a.cat.play('eat');const drink=item?.cat==='drink';
  if(drink)a.nd.thirst=Math.min(1,a.nd.thirst+.6);else a.nd.hunger=Math.min(1,a.nd.hunger+.5);const med=(item?.tags||[]).some(t=>/藥|湯|粥|medicine/.test(t))||/藥|湯|粥/.test(item?.name||'');if(a.health&&med)a.health=Object.assign(a.health,{med:1});
  a.eaten++;if(a.eaten>4&&a.nd.hunger>.95&&Math.random()<.25&&!a.health)setTimeout(()=>catchSick(a,'tummy'),4000)};

/* ---------- lifecycle ---------- */
function roster(){let sel=[];try{sel=CM().state().selected||[]}catch(_){}if(!sel.length)sel=[Cfg.v.active];return sel.map(id=>Chars.byId(id)).filter(Boolean).slice(0,8)}
L.sync=function(){const want=roster(),ids=new Set(want.map(c=>c.id));
  for(const [id,a] of L.agents)if(!(a instanceof Agent)){L.agents.delete(id)}
  for(const [id,a] of L.agents)if(!ids.has(id)){E.chars.remove(a.root);a.bubble?.remove();a.tag?.remove();L.agents.delete(id)}
  want.forEach((ch,i)=>{const a=L.agents.get(ch.id);if(!a){L.agents.set(ch.id,new Agent(ch,i))}else if(a.ch!==ch||JSON.stringify(a.ch.look)!==a.lookSig){a.ch=ch;a.s.ch=ch;a.traits=traitsOf(ch);a.pers=persOf(ch);a.cat.setLook(ch)}L.agents.get(ch.id).lookSig=JSON.stringify(ch.look)});
  // expose to legacy readers (profile cards, quick status, native bridge)
  try{const C=CM();C.nodes=L.agents}catch(_){}E.dirtyShadow=true};
let saveT=0;
L.start=function(){if(L.started)return;L.started=true;ensureLayer();L.sync();
  E.add({update(dt){if(L.paused)return;const fast=L.fast||1,d=dt*fast;for(const a of L.agents.values()){tickNeeds(a,d);update(a,dt);a.cat.update(dt)}placeLabels();
    if((saveT+=dt)>8){saveT=0;save()}return true}});
  // keep in sync with roster/edits
  const pc=Chars.patch.bind(Chars);Chars.patch=function(ch,o){const r=pc(ch,o);if(o&&(o.look||o.body||o.data))setTimeout(()=>L.sync(),50);return r};
  setInterval(()=>{if(!document.hidden)L.sync()},4000);
  addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save()})};
function save(){for(const a of L.agents.values()){try{const x=LF()?.X(a.id);if(x){x.needs=Object.assign({},a.nd,{ts:Date.now()});NK.forEach(k=>x.needs[k]=+(+x.needs[k]).toFixed(3))}}catch(_){}}Cfg.save()}
L.save=save;
L.agent=id=>L.agents.get(id);
window.Isle3DLife=L;
})();
