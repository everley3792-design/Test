/* ===== 2.4E：天氣時間對話・摸摸過度反應・玩具玩耍・進食動畫 ===== */
(()=>{'use strict';
const reduce=()=>document.documentElement.dataset.motion==='reduce';
const trs=ch=>((ch&&ch.data&&ch.data.pers&&ch.data.pers.traits)||[]);
const pickT=(pool,ch)=>{if(!pool)return null;const tr=trs(ch).find(x=>pool[x]&&pool[x].length);if(tr&&Math.random()<.5)return pick(pool[tr]);return pick(pool.n)};
/* ---------- 天氣・時間對話 ---------- */
const PH={dawn:{n:['天剛亮呢，空氣好清新。','早安～新的一天開始了。','晨光暖暖的。'],tsun:['這麼早就醒了…天空倒是挺漂亮。'],shy:['早、早安…'],lazy:['天亮了嗎…再睡一下下。'],curious:['天空的顏色一直在變耶！'],dreamer:['雲被染成粉紅色了，像棉花糖。'],foodie:['早餐…今天吃什麼呢？']},
 day:{n:['今天的光線剛剛好。','來散散步吧。','白天的世界好熱鬧。'],tsun:['別一直盯著我看啦。'],shy:['今天…也請多指教。'],lazy:['這種天氣最適合躺著了。'],curious:['那邊有什麼呢？去看看！'],dreamer:['雲飄得好慢，我也想慢慢的。'],foodie:['有點餓了…有點心嗎？']},
 dusk:{n:['夕陽把天空染橘了。','一天快結束了呢。','傍晚的風好舒服。'],tsun:['夕陽…還算可以看啦。'],shy:['跟你一起看夕陽，有點開心。'],lazy:['天要黑了，可以準備睡了嗎？'],curious:['天空的顏色怎麼一直變？'],dreamer:['金色的光，像會發光的糖果。'],foodie:['晚餐時間快到了吧？']},
 night:{n:['夜深了，星星出來囉。','晚上好安靜。','該準備睡覺了嗎？'],tsun:['這麼晚還不睡，是想陪我嗎？'],shy:['晚上的話…比較不緊張。'],lazy:['好想睡…zzz。'],curious:['夜晚的聲音和白天不一樣耶。'],dreamer:['星星好像在對我眨眼。'],foodie:['宵夜…不行不行。']}};
const WX={sunny:{n:['好大的太陽，好暖和。','天氣真好！','陽光灑下來好舒服。'],tsun:['太陽這麼大，才不會被曬暈。'],shy:['天氣好的時候，心情也輕盈了。'],lazy:['曬太陽…想睡著了。'],curious:['影子變得好清楚！'],dreamer:['陽光閃閃的，像撒了金粉。']},
 cloudy:{n:['雲好多，好像要變天。','今天灰灰的呢。','雲朵走得好慢。'],dreamer:['那朵雲的形狀像一隻兔子。'],lazy:['陰天最適合發呆了。']},
 rain:{n:['下雨了，滴答滴答。','雨聲好好聽。','今天就待在屋裡吧。'],tsun:['下雨天…才不討厭。'],shy:['雨聲讓人覺得安心。'],lazy:['下雨天最適合睡覺了。'],curious:['雨滴會落在哪裡呢？'],dreamer:['雨像在彈琴。'],gentle:['別淋濕了，要小心喔。']},
 storm:{n:['打雷了…好大聲。','風好大，我們躲好吧。','雷聲轟隆隆的。'],tsun:['才、才不怕打雷！只是…靠近一點而已。'],shy:['那個雷聲…可以靠近你一點嗎？'],lazy:['雷聲太吵睡不著…'],curious:['雷聲是從哪裡來的呢？']},
 snow:{n:['下雪了！好白好白。','雪花輕輕落下來。','好冷，但好漂亮。'],tsun:['雪…還不錯啦，別問我喜不喜歡。'],shy:['雪很安靜，我也想安靜一下。'],lazy:['好冷…想窩進被子。'],curious:['雪花每一片都不一樣耶！'],dreamer:['像天空在撒糖粉。']},
 fog:{n:['起霧了，什麼都朦朦朧朧的。','霧好濃，像在雲裡面。','空氣有點涼涼的。'],dreamer:['像走進夢裡了。'],curious:['霧裡面藏著什麼呢？']}};
const CB={'night|rain':['夜裡的雨聲，好適合睡覺。','雨落在屋頂上，像在唱歌。'],'night|storm':['夜裡打雷…好有壓迫感。'],'night|snow':['夜裡的雪，靜悄悄的。','雪夜好安靜。'],'dusk|rain':['傍晚的雨，空氣有泥土的味道。'],'dawn|fog':['清晨的霧，像一層薄紗。'],'dusk|sunny':['夕陽配上晴天，今天一定很美。'],'day|snow':['白天的雪地閃閃發亮。'],'night|sunny':['晴朗的夜晚，星星好多。'],'night|cloudy':['雲遮住了星星呢。'],'dawn|rain':['清晨的雨，涼涼的。']};
const WC={rain:['下雨了耶。','聽，雨聲開始了。'],storm:['天空突然暗下來了…'],snow:['哇，下雪了！'],sunny:['雲散開了，放晴囉！'],cloudy:['雲變多了。'],fog:['起霧了…']};
const PC={dawn:['天亮了。'],day:['早安，白天到了。'],dusk:['天色漸漸變橘了。'],night:['天黑了呢。']};
const Talk={last:{ph:null,wx:null},nx:Date.now()+40000,
 ok(st){const E=window.OCS24D&&window.OCS24D.Ed;return st&&st.ch&&Nav.cur===0&&!(E&&E.on)&&st.state!=='held'&&st.h===0&&!st._fd&&!st._toy&&!(st.sleeping&&st.sleeping())&&!document.body.classList.contains('dragging')},
 say(st,t){if(t)st.say(t,3200)},
 tick(){const st=Home.stage;if(!st)return;const ph=phaseNow(),wx=(typeof Env!=='undefined'&&Env.wid)||'sunny',now=Date.now();
  if(this.last.ph===null){this.last={ph,wx};return}
  if(!this.ok(st))return;
  if(wx!==this.last.wx){const t=pick(WC[wx]||['天氣變了。']);this.last.wx=wx;this.nx=now+60000;setTimeout(()=>this.ok(st)&&this.say(st,t),1500);return}
  if(ph!==this.last.ph){const t=pick(PC[ph]||['時間過得真快。']);this.last.ph=ph;this.nx=now+60000;setTimeout(()=>this.ok(st)&&this.say(st,t),1500);return}
  if(now<this.nx)return;this.nx=now+(80+Math.random()*90)*1000;
  const r=Math.random(),cb=CB[ph+'|'+wx];let t;
  if(cb&&r<.4)t=pick(cb);else if(r<.75)t=pickT(WX[wx]||WX.sunny,st.ch);else t=pickT(PH[ph],st.ch);this.say(st,t)}};
setInterval(()=>{try{Talk.tick()}catch(e){}},4000);
/* ---------- 摸摸過度：不再增加親密度、抗拒與賭氣 ---------- */
const PL={soft:{n:['嗯…有點癢了。','摸太多次的話，我會害羞喔。','再摸下去頭髮要亂掉了。'],tsun:['夠、夠了啦！一直摸…很煩耶。'],shy:['那、那個…有點太多次了…'],lazy:['嗯…別一直摸，我想休息。'],curious:['咦？怎麼一直摸？有什麼好玩的嗎？'],gentle:['呵呵，有點癢呢，先休息一下好嗎？'],dreamer:['…（縮了縮身體）']},
 refuse:{n:['不要再摸了！','今天夠了！','我要自己待一下。'],tsun:['都說夠了啦！哼，別碰我！'],shy:['嗚…別再摸了…我要躲起來…'],lazy:['好累…別吵我。'],curious:['…不要了，換個玩法好嗎？'],gentle:['對不起，我想要一點自己的空間。']},
 sulk:{n:['…（別過頭）','現在不想讓你摸。','讓我靜一靜。'],tsun:['哼～不理你。'],shy:['…（把臉轉開）'],lazy:['…（翻過身）']},
 forgive:['…好啦，不生氣了。','剛才有點凶，對不起。','我們和好吧。']};
const PET={log:{},s:{}};
const _ea=Eco.act.bind(Eco);Eco.act=function(k){if(k==='pet'&&Eco._np)return;return _ea.apply(this,arguments)};
const _pet=Stage.prototype.pet;
Stage.prototype.pet=function(){
 const st=this;if(!(st.root&&st.root.id==='homeStage')||!st.ch||st.state==='held'||(st.sleeping&&st.sleeping()))return _pet.apply(this,arguments);
 const ch=st.ch,id=ch.id,now=Date.now(),L=(PET.log[id]=(PET.log[id]||[]).filter(x=>now-x<30000));L.push(now);const n=L.length,S=PET.s[id]||(PET.s[id]={until:0,soft:0});
 const mood=(m,h)=>{try{Life.setMood(st,m,h,true);Life.emote(st,m,true)}catch(e){}};
 const pulse=(node,c,ms)=>{node.classList.remove(c);void node.offsetWidth;node.classList.add(c);setTimeout(()=>node.classList.remove(c),ms)};
 if(now<S.until){/* 賭氣中：只會回應拒絕，不增加親密度 */
  S.until=Math.min(now+120000,S.until+6000);st.interrupt();st.setState('idle',1.2);st.squash(.05);pulse(st.tiltEl,'pl-shy',900);st.say(pickT(PL.sulk,ch),2200);buzz(8);return}
 if(n>=9){/* 抗拒：生氣、走開 */
  S.until=now+50000;L.length=0;st.interrupt();st.setState('idle',1.5);st.squash(.08);pulse(st.tiltEl,'fd-shake',760);st.say(pickT(PL.refuse,ch),3000);mood('angry',22);buzz([14,30,14]);
  toast(`${ch.name}不開心了，先讓牠靜一靜吧`,'info');
  setTimeout(()=>{try{if(st.state!=='held')st.walkTo(st.x+st.size/2<st.W/2?st.hi():st.lo())}catch(e){}},500);
  setTimeout(()=>{try{if(PET.s[id]&&Date.now()>=PET.s[id].until-500&&st.ch===ch&&st.state!=='held'&&!(st.sleeping&&st.sleeping())){st.say(pick(PL.forgive),3000);st.hearts(1);mood('calm',30)}}catch(e){}},50500);return}
 if(n>=6){/* 摸太多次：有點癢，不再增加親密度 */
  st.interrupt();st.setState('idle',1);st.squash(.07);pulse(st.tiltEl,'pl-shy',900);if(st.h===0)st.vy=120;st.say(pickT(PL.soft,ch),2600);buzz(8);
  if(!S.soft||now-S.soft>40000){S.soft=now;toast(`${ch.name}有點癢，再摸下去會不開心`,'info')}return}
 return _pet.apply(this,arguments)};
/* ---------- 粒子工具 ---------- */
const layer=st=>{let l=st.root.querySelector(':scope>.ocp-layer');if(!l){l=document.createElement('div');l.className='ocp-layer';st.root.append(l)}return l};
const P=(st,x,y,o)=>{if(reduce())return;const l=layer(st);if(l.childElementCount>60)return;const e=document.createElement('span');e.className='ocp '+(o.c||'');if(o.t)e.textContent=o.t;
 e.style.cssText=`left:${x}px;top:${y}px;--dx:${o.dx||0}px;--dy:${o.dy||0}px;--rot:${o.rot||0}deg;--dur:${o.d||1}s;--sz:${o.s||12}px;--bg:${o.bg||'#fff'};animation-delay:${o.dl||0}s`;l.append(e);setTimeout(()=>e.remove(),((o.d||1)+(o.dl||0))*1000+80)};
const R=(a,b)=>a+Math.random()*(b-a);
/* ---------- 進食動畫加強 ---------- */
const Eat={pal(it){const t=it.name+it.tags.join('');return /莓|蘋|果|橘|桃|柚|檸|瓜/.test(t)?['#FF8A8A','#FFB26B','#FFD76B']:/蛋糕|甜|糖|餅|布丁|巧克|奶油/.test(t)?['#FFD6E0','#FFF3C4','#F7B6C8','#D7A27A']:/魚|肉|蝦/.test(t)?['#E9B98A','#C98B5E']:['#E8C79A','#D9A86C','#F2DDB8']},
 kind(it,use){const t=it.name+it.tags.join('')+(it.emoji||'');return use.type==='drink'?(/熱|茶|可可|咖啡|湯|暖/.test(t)?'hot':'cold'):/莓|蘋|果|橘|桃|柚|檸|瓜/.test(t)?'juicy':'solid'},
 attach(st,it,use){if(reduce())return;const f=[...st.root.querySelectorAll('.tfd')].pop();if(!f)return;const kd=this.kind(it,use),pal=this.pal(it),d={},ch=st.ch;
  const m=()=>[parseFloat(f.style.left)||st.x+st.size/2,parseFloat(f.style.top)||st.feetY-st.size*.6];
  const burst=(n,big)=>{const[x,y]=m();for(let i=0;i<n;i++){
    if(kd==='cold'||kd==='hot')P(st,x+R(-12,12),y+R(-4,8),{c:'bub',s:R(4,9),dx:R(-10,10),dy:-R(22,46),d:R(.7,1.2),dl:i*.05});
    else{const c=pal[(Math.random()*pal.length)|0];P(st,x+R(-14,14),y+R(-2,10),{c:'dot',s:big?R(3,6):R(2,4.5),bg:c,dx:R(-24,24),dy:R(10,34),rot:R(-90,90),d:R(.6,1),dl:i*.03});
     if(kd==='juicy'&&i%3===0)P(st,x+R(-12,12),y+R(0,8),{t:'💧',s:10,dx:R(-14,14),dy:R(14,30),d:.8,dl:i*.04})}}};
  const steam=setInterval(()=>{if(!f.isConnected||d.b1){clearInterval(steam);return}if(kd==='hot'){const[x,y]=m();P(st,x+R(-8,8),y-10,{c:'st',t:'~',s:R(12,16),dx:R(-8,8),dy:-R(20,34),d:1.3})}},420);
  const chew=setInterval(()=>{if(!f.isConnected&&!d.out){clearInterval(chew);return}if(st.poseEl.classList.contains('fd-chew'))burst(kd==='cold'||kd==='hot'?1:2,false)},330);
  const mo=new MutationObserver(()=>{const c=f.classList;
   if(c.contains('b1')&&!d.b1){d.b1=1;burst(7,false)}
   if(c.contains('b2')&&!d.b2){d.b2=1;burst(11,true)}
   if(c.contains('out')&&!d.out){d.out=1;mo.disconnect();clearInterval(steam);setTimeout(()=>clearInterval(chew),1200);const[x,y]=m();
    for(let i=0;i<4;i++)P(st,x+R(-18,18),y-R(0,14),{t:i%2?'✦':'♪',s:R(11,15),dx:R(-16,16),dy:-R(26,48),d:R(1,1.5),dl:i*.1,c:''})}
   if(c.contains('no')&&!d.no){d.no=1;mo.disconnect();clearInterval(steam);clearInterval(chew);P(st,st.x+st.size*.7,st.feetY-st.h-st.hitTop*.85,{t:'💦',s:15,dx:6,dy:-18,d:1.1})}});
  mo.observe(f,{attributes:true,attributeFilter:['class']});setTimeout(()=>{mo.disconnect();clearInterval(steam);clearInterval(chew)},9000)}};
const _feed=Taste.feed;Taste.feed=function(it,use,st){const r=_feed.apply(this,arguments);if(r){try{Eat.attach(st,it,use)}catch(e){}}return r};
/* ---------- 玩具玩耍動畫 ---------- */
const Play={kind(it){const t=it.name+it.tags.join('')+(it.emoji||'');return /氣球|🎈|風箏|🪁/.test(t)?'balloon':/熊|娃娃|玩偶|絨|🧸|🪆|plush/i.test(t)?'plush':/球|ball|⚽|🏀|🎾|⚾|🧶|毛線/i.test(t)?'ball':/積木|🧩|🎲|拼圖|🎮/.test(t)?'puzzle':/鈴|鼓|琴|🎵|🎶|🔔|笛|歌/.test(t)?'music':'bounce'},
 run(st,kind,it){const tk=st._toy={dead:false,tm:[]},fast=reduce(),K=fast?.4:1,S=st.size,root=st.root,love=kind==='love',ty=this.kind(it);
  const prop=document.createElement('div');prop.className='opl';prop.innerHTML=Items.icon(it);prop.style.left=(st.x+S/2)+'px';prop.style.top=(st.feetY-6)+'px';root.append(prop);
  const alive=()=>!tk.dead&&st._toy===tk&&st.state!=='held'&&!(st.sleeping&&st.sleeping())&&document.contains(root);
  const end=()=>{if(tk.dead)return;tk.dead=true;tk.tm.forEach(clearTimeout);if(st._toy===tk)st._toy=null;try{prop.animate([{opacity:1},{opacity:0}],{duration:380,fill:'forwards'})}catch(e){}setTimeout(()=>prop.remove(),420)};
  tk.cancel=end;const at=(ms,fn)=>tk.tm.push(setTimeout(()=>{if(tk.dead)return;if(!alive())return end();try{fn()}catch(e){console.warn(e);end()}},ms*K));
  const T=(x,y,r,s)=>`translate(calc(-50% + ${x}px),calc(-100% + ${y}px)) rotate(${r||0}deg) scale(${s||1})`;
  const an=(fr,d,o)=>prop.animate(fr,Object.assign({duration:d*K,fill:'forwards',easing:'ease-in-out'},o||{}));
  const pulse=(n,c,ms)=>{n.classList.remove(c);void n.offsetWidth;n.classList.add(c);setTimeout(()=>n.classList.remove(c),ms)};
  const hop=v=>{if(!fast&&st.h===0)st.vy=v};const cx=()=>st.x+S/2,hy=()=>st.feetY-st.h-st.hitTop*.7;
  const fin=(ms)=>{at(ms,()=>{st.setState('happy',1.8);st.hearts(love?4:2);for(let i=0;i<(love?5:3);i++)P(st,cx()+R(-S*.3,S*.3),hy(),{t:'✦',s:R(11,15),dx:R(-16,16),dy:-R(20,44),d:R(1,1.5),dl:i*.1})});at(ms+1100,end)};
  if(ty==='ball'){an([{transform:T(S*.8,-S*.9),opacity:0},{transform:T(S*.8,0),opacity:1,offset:.6},{transform:T(S*.8,-S*.18,40),offset:.8},{transform:T(S*.8,0,80),opacity:1}],700,{easing:'cubic-bezier(.3,1.4,.6,1)'});
   at(800,()=>pulse(st.tiltEl,'pl-look',1100));
   at(900,()=>an([{transform:T(S*.8,0,80),opacity:1},{transform:T(-S*.7,0,-360),opacity:1}],1100,{easing:'cubic-bezier(.4,0,.3,1)'}));
   at(2100,()=>{hop(240);st.squash(.14);pulse(st.poseEl,'pl-pounce',500);an([{transform:T(-S*.7,0,-360),opacity:1},{transform:T(-S*.15,-S*.55,-180),opacity:1,offset:.5},{transform:T(S*.2,0,0),opacity:1}],700)});
   at(2800,()=>an([{transform:T(S*.2,0),opacity:1},{transform:T(S*.28,-S*.2),opacity:1,offset:.4},{transform:T(S*.34,0),opacity:1,offset:.7},{transform:T(S*.36,-S*.08),opacity:1},{transform:T(S*.38,0),opacity:1}],800));
   fin(3000)}
  else if(ty==='plush'){an([{transform:T(S*.6,-S*.7,0,.6),opacity:0},{transform:T(S*.35,0,0,1),opacity:1}],600,{easing:'cubic-bezier(.3,1.4,.6,1)'});
   at(700,()=>{st.squash(.1);an([{transform:T(S*.35,0,0,1),opacity:1},{transform:T(-S*.08,-S*.32,-6,1.15),opacity:1}],650)});
   at(1400,()=>{pulse(st.poseEl,'pl-hug',1800);st.hearts(2);an([{transform:T(-S*.08,-S*.32,-6,1.15),opacity:1},{transform:T(-S*.08,-S*.3,6,1.05),opacity:1,offset:.35},{transform:T(-S*.08,-S*.34,-4,1.18),opacity:1,offset:.7},{transform:T(-S*.08,-S*.32,0,1.12),opacity:1}],1800)});
   at(2200,()=>pulse(st.tiltEl,'pl-sway',2700));
   fin(3300)}
  else if(ty==='balloon'){an([{transform:T(S*.7,0,0),opacity:0},{transform:T(S*.62,-S*.5,-6),opacity:1,offset:.5},{transform:T(S*.5,-S*1.0,5),opacity:1}],900);
   at(500,()=>pulse(st.tiltEl,'pl-up',1500));
   at(1100,()=>{hop(320);st.squash(.12);an([{transform:T(S*.5,-S*1.0,5),opacity:1},{transform:T(S*.4,-S*1.28,-8),opacity:1,offset:.4},{transform:T(S*.5,-S*1.02,6),opacity:1}],700)});
   at(1900,()=>{hop(300);an([{transform:T(S*.5,-S*1.02,6),opacity:1},{transform:T(S*.58,-S*1.3,-6),opacity:1,offset:.4},{transform:T(S*.5,-S*1.05,4),opacity:1}],700)});
   at(2700,()=>an([{transform:T(S*.5,-S*1.05,4),opacity:1},{transform:T(S*.6,-S*1.7,-10),opacity:0}],1000,{easing:'ease-in'}));
   fin(2700)}
  else if(ty==='puzzle'){an([{transform:T(S*.5,-S*.7,0,.6),opacity:0},{transform:T(S*.4,0,0,1),opacity:1}],550,{easing:'cubic-bezier(.3,1.4,.6,1)'});
   at(650,()=>pulse(st.tiltEl,'fd-look',720));
   [900,1300,1700].forEach((ms,i)=>at(ms,()=>{an([{transform:T(S*.4,0),opacity:1},{transform:T(S*.4,-S*.16-i*S*.04),opacity:1,offset:.45},{transform:T(S*.4,0),opacity:1}],380)}));
   at(2200,()=>{pulse(st.tiltEl,'fd-nod',600);st.squash(.08);an([{transform:T(S*.4,0,0,1),opacity:1},{transform:T(S*.4,0,0,1.25),opacity:1,offset:.4},{transform:T(S*.4,0,0,1),opacity:1}],450);for(let i=0;i<4;i++)P(st,cx()+S*.4+R(-12,12),st.feetY-S*.15,{t:'✦',s:13,dx:R(-14,14),dy:-R(18,36),d:1.1,dl:i*.06})});
   fin(2700)}
  else if(ty==='music'){an([{transform:T(S*.6,-S*.6,0,.6),opacity:0},{transform:T(S*.45,0,0,1),opacity:1}],550);
   at(600,()=>pulse(st.tiltEl,'pl-sway',2700));
   for(let i=0;i<7;i++)at(700+i*340,()=>{P(st,cx()+S*.45+R(-6,6),st.feetY-S*.3,{t:i%2?'♪':'♫',s:R(14,19),dx:R(-26,26),dy:-R(40,70),d:1.4,rot:R(-20,20)});if(i%2===0)st.squash(.04);an([{transform:T(S*.45,0,0,1),opacity:1},{transform:T(S*.45,-S*.06,i%2?6:-6,1.08),opacity:1,offset:.5},{transform:T(S*.45,0,0,1),opacity:1}],330)});
   fin(3200)}
  else{an([{transform:T(-S*.8,-S*.7,0),opacity:0},{transform:T(-S*.6,0,0),opacity:1,offset:.3},{transform:T(-S*.2,-S*.5,90),opacity:1,offset:.55},{transform:T(S*.2,0,180),opacity:1,offset:.75},{transform:T(S*.5,-S*.22,240),opacity:1,offset:.9},{transform:T(S*.62,0,300),opacity:1}],1700,{easing:'linear'});
   at(500,()=>pulse(st.tiltEl,'pl-look',1100));at(1250,()=>{hop(200);st.squash(.1)});at(1900,()=>pulse(st.poseEl,'pl-pounce',500));fin(2100)}
  return true}};
const _pf=Items.popFx;Items.popFx=function(st,it,no){Items._lastIt=it;return _pf.apply(this,arguments)};
const _an=Items.anim;Items.anim=function(st,kind,use){const r=_an.apply(this,arguments);try{const it=Items._lastIt;if(use&&use.type==='toy'&&kind!=='no'&&it&&!st._toy)Play.run(st,kind,it)}catch(e){console.warn(e)}return r};
window.OCS24E={Talk,Play,Eat,PET};
})();
