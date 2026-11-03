/* OC Shimeji — Android desktop pet renderer (runs inside each overlay window).
   Native (PetWindow.kt) drives position/physics and calls:
     OCPet.load(petJson, settingsJson)  OCPet.pose(name, dir, wall)
     OCPet.react(kind)                   OCPet.settings(settingsJson)
   Breathing/tail/ear motion come from the game's CSS; blinking is layered on top
   of every pose (except sleep) so small motions never stop while walking. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const actor=$('actor'),adj=$('adj'),fx=$('fx'),flip=actor.querySelector('.a-flip');
const STATE={idle:'idle',walk:'walk',run:'walk',sit:'idle',sleep:'sleep',fall:'fall',jump:'hop',land:'crouch',
  held:'held',happy:'happy',look:'idle',climb:'walk',hang:'idle'};
const BEH={sit:'sit',sleep:'sleep',look:'look',happy:'joy'};
let pet=null,blinkT=0,base=1;
function sanitize(html){
  // Pet art comes from the game's own renderer; still strip anything executable.
  const t=document.createElement('template');t.innerHTML=String(html||'');
  t.content.querySelectorAll('script,iframe,object,embed,foreignObject').forEach(n=>n.remove());
  t.content.querySelectorAll('*').forEach(n=>{for(const a of [...n.attributes]){const v=a.value.trim().toLowerCase();
    if(/^on/i.test(a.name)||((a.name==='href'||a.name==='src'||a.name==='xlink:href')&&!(v.startsWith('data:image/')||v.startsWith('#'))))n.removeAttribute(a.name)}});
  return t.innerHTML}
function applySettings(s){try{s=typeof s==='string'?JSON.parse(s):s||{}}catch(e){s={}}
  const r=document.documentElement;r.dataset.motion=s.reduceMotion?'reduce':'full';if(s.theme)r.dataset.theme=s.theme}
function phase(){const h=new Date().getHours()+new Date().getMinutes()/60;return h>=5&&h<8?'dawn':h<16.5&&h>=8?'day':h<19&&h>=16.5?'dusk':'night'}
function blink(){if(actor.dataset.state==='sleep')return;actor.classList.add('blink');setTimeout(()=>actor.classList.remove('blink'),110);
  if(Math.random()<.2)setTimeout(()=>{actor.classList.add('blink');setTimeout(()=>actor.classList.remove('blink'),100)},230)}
function loop(){blinkT-=.25;if(blinkT<=0){blink();blinkT=2.4+Math.random()*3.6}}
setInterval(loop,250);
const OCPet={
  load(json,settings){try{pet=typeof json==='string'?JSON.parse(json):json}catch(e){return}
    applySettings(settings);
    adj.innerHTML=sanitize(pet.art);
    const a=pet.adjust||{};base=pet.facing==='left'?-1:1;
    adj.style.transform=`translate(${+a.ox||0}%,${+a.oy||0}%) scale(${+a.scale||1})`;
    actor.dataset.kind=pet.kind||'demo';if(pet.mood)actor.dataset.mood=pet.mood;
    $('petStage').dataset.phase=phase();this.pose('fall',1,0)},
  settings(s){applySettings(s)},
  pose(name,dir,wall){const st=STATE[name]||'idle';actor.dataset.state=st;actor.dataset.pose=name;
    actor.dataset.beh=BEH[name]||'';if(name==='run')actor.dataset.ph='run';else delete actor.dataset.ph;
    actor.classList.toggle('climb-l',(name==='climb'||name==='hang')&&wall<0);
    actor.classList.toggle('climb-r',(name==='climb'||name==='hang')&&wall>0);
    actor.classList.toggle('hang',name==='hang');
    flip.style.transform=`scaleX(${(dir<0?-1:1)*base})`},
  react(kind){
    if(kind==='pet'){for(let i=0;i<3;i++){const h=document.createElement('i');h.textContent=['♥','♡','✦'][i%3];h.style.color=['#E58C9A','#F3A6B4','#F6C65B'][i];
      h.style.setProperty('--dx',(i-1)*16+'px');h.style.animationDelay=i*.12+'s';fx.append(h);setTimeout(()=>h.remove(),1600)}}
    if(kind==='dizzy'){actor.classList.remove('dizzy');void actor.offsetWidth;actor.classList.add('dizzy');setTimeout(()=>actor.classList.remove('dizzy'),1600)}
    if(kind==='wake'){blink()}
  }};
window.OCPet=OCPet;
setInterval(()=>{$('petStage').dataset.phase=phase()},60000);
})();
