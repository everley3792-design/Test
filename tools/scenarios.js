// Each scenario receives {page,url,shot,log,assert}.
const path=require('path');
const wait=(p,ms)=>p.waitForTimeout(ms);
const MOCK=()=>{window.__native={pets:null,settings:null,calls:[],events:[]};
  window.OCNative={platform:()=>JSON.stringify({android:true,sdk:35,overlay:true}),canDrawOverlays:()=>true,requestOverlayPermission(){},
    isOverlayRunning:()=>!!window.__native.running,overlayState:()=>JSON.stringify({running:!!window.__native.running,permission:true}),
    setOverlayEnabled(v){window.__native.calls.push('enable:'+v);window.__native.running=!!v;return !!v},
    syncPets(j){window.__native.pets=JSON.parse(j);return true},setOverlaySettings(j){window.__native.settings=JSON.parse(j);return true},
    overlayCommand(c){window.__native.calls.push(c)},drainPetEvents(){const e=window.__native.events;window.__native.events=[];return JSON.stringify(e)},saveFile(){return true}}};
module.exports={
  async boot(t){const p=t.page;await p.goto(t.url);await wait(p,3500);await t.shot('home');
    const ok=await p.evaluate(()=>!!(window.OCApp&&document.querySelector('#homeStage .actor')));t.assert(ok,'home stage rendered');},
  async native(t){const p=t.page;await p.addInitScript(MOCK);await p.goto(t.url);await wait(p,3000);
    await p.evaluate(()=>window.OCSOnboarding?.skipAll?.());
    // character page: toggle desk pet on first card
    await p.evaluate(()=>Nav.go(1));await wait(p,800);
    const btn=await p.$('#charGrid .oc-card [data-desk]');t.assert(btn,'desk button on card');await btn.click();await wait(p,600);await t.shot('chars');
    t.assert(await p.evaluate(()=>OCSNative.ids().length===1),'one pet selected');
    await p.evaluate(()=>OCSNative.start());await wait(p,1500);
    const n=await p.evaluate(()=>window.__native);t.assert(n.pets&&n.pets.pets.length===1,'snapshot pushed');t.assert(n.running,'overlay started');
    t.log('pet: '+n.pets.pets[0].name+' art '+n.pets.pets[0].art.length+'B lines '+Object.keys(n.pets.pets[0].lines).join(','));
    require('fs').writeFileSync(path.join(__dirname,'out','pets.json'),JSON.stringify(n.pets));
    // desktop interactions are applied on resume
    const id=n.pets.pets[0].id;const before=await p.evaluate(id=>Eco.v.bond[id]||0,id);
    await p.evaluate(id=>{window.__native.events=[{type:'pet',id,ts:Date.now()},{type:'pet',id,ts:Date.now()}];OCSNative.onNativeResume()},id);
    const after=await p.evaluate(id=>Eco.v.bond[id]||0,id);t.assert(after===before+8,'bond increased by desktop petting '+before+'→'+after);
    await p.evaluate(()=>{Settings.open()});await wait(p,700);await t.shot('settings');
    await p.evaluate(()=>{Settings.close();OCSNative.openManager()});await wait(p,800);await t.shot('manager');
  },
  async overlay(t){const p=t.page;const pets=require('./out/pets.json');await p.setViewportSize({width:120,height:120});
    await p.goto(t.url.replace('index.html','overlay.html'));await wait(p,400);
    await p.evaluate(j=>OCPet.load(j,'{}'),JSON.stringify(pets.pets[0]));
    for(const [pose,dir,wall] of [['idle',1,0],['walk',-1,0],['sleep',1,0],['held',1,0],['climb',1,-1],['sit',1,0]]){
      await p.evaluate(([a,b,c])=>OCPet.pose(a,b,c),[pose,dir,wall]);if(pose==='idle')await p.evaluate(()=>OCPet.react('pet'));await wait(p,500);await t.shot(pose)}
  },
};
module.exports.perf=async t=>{const p=t.page;await p.goto(t.url);await p.waitForTimeout(2500);await p.evaluate(()=>window.OCSOnboarding?.skipAll?.());
  const measure=()=>p.evaluate(()=>new Promise(r=>{let n=0;const t0=performance.now();const f=()=>{n++;if(performance.now()-t0<2000)requestAnimationFrame(f);else r(Math.round(n/2))};requestAnimationFrame(f)}));
  await p.evaluate(()=>Nav.go(1));await p.waitForTimeout(800);const res={};for(const m of ['quality','saver','balanced']){await p.evaluate(m=>OCSPerf.set(m),m);await p.waitForTimeout(300);res[m]=await measure()}
  t.log('measured fps '+JSON.stringify(res));t.assert(res.saver<=32&&res.quality>res.saver+10,'fps cap differs between modes');await p.evaluate(()=>Nav.go(0));
  const attrs=await p.evaluate(()=>{OCSPerf.set('saver');return {...document.documentElement.dataset}});t.assert(attrs.pfx==='off'&&attrs.pamb==='off','saver css budgets');
  await p.evaluate(()=>{OCSPerf.setCustom('fps',45);Cfg.flush()});const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('ocs.v1')).perf);t.assert(saved.mode==='custom'&&saved.custom.fps===45,'custom saved');
  await p.reload();await p.waitForTimeout(2500);t.assert(await p.evaluate(()=>OCSPerf.state().mode==='custom'&&OCSPerf.cap===45),'restored after reload');
  await p.evaluate(()=>{Settings.open()});await p.waitForTimeout(600);await p.evaluate(()=>document.getElementById('perfSec').scrollIntoView());await p.waitForTimeout(300);await t.shot('settings')};
module.exports.firstrun=async t=>{const p=t.page;await p.goto(t.url);await p.waitForSelector('#obRoot .obs-wel',{timeout:20000});await p.waitForTimeout(800);await t.shot('1-welcome');
  await p.click('#obRoot [data-k=start]');await p.waitForTimeout(5000);await t.shot('2-cinematic');
  await p.click('#obRoot [data-k=skip]');await p.waitForTimeout(900);t.assert(await p.$('#obRoot .ob-modes'),'mode chooser');await t.shot('3-mode');
  await p.click('#obRoot [data-k=both]');await p.waitForTimeout(1500);await t.shot('4-create-look');
  await p.click('#obRoot [data-k=cat][data-v=eye]');await p.click('#obRoot [data-k=opt] >> nth=3');await p.waitForTimeout(500);
  await p.click('#obRoot [data-k=next]');await p.waitForTimeout(400);await p.fill('#obName','測試貓');await p.click('#obRoot [data-k=next]');await p.waitForTimeout(400);
  await p.click('#obRoot [data-k=tr] >> nth=5');await p.waitForTimeout(300);await t.shot('5-create-pers');await p.click('#obRoot [data-k=fin]');await p.waitForTimeout(500);await t.shot('6-create-done');
  await p.click('#obRoot [data-k=next]');await p.waitForTimeout(1800);t.assert(await p.$('#obRoot .ob-demos'),'neighbour picker');
  await p.click('#obRoot [data-k=t] >> nth=1');await p.waitForTimeout(900);await t.shot('7-demos');await p.click('#obRoot [data-k=go]');await p.waitForTimeout(1500);
  t.assert(await p.$('#obRoot .ob-houses'),'house chooser');await p.click('#obRoot [data-k=h] >> nth=1');await p.waitForTimeout(800);await t.shot('8-house');await p.click('#obRoot [data-k=go]');
  await p.waitForSelector('.hp-bar.on',{timeout:8000});await p.waitForTimeout(800);await t.shot('9-place');await p.$eval('.hp-bar [data-k=ok]',e=>e.click());await p.waitForTimeout(3500);await t.shot('10-arrival');
  const roster=await p.evaluate(()=>({sel:Cfg.v.community.selected,name:Chars.active().name,home:Cfg.v.isle3d.home}));t.log('roster '+JSON.stringify(roster));
  t.assert(roster.name==='測試貓'&&roster.sel.length===2&&roster.home?.type==='mushroom','created OC + 1 demo + mushroom house');
  for(let i=0;i<6;i++){await p.mouse.click(195,760);await p.waitForTimeout(600)}
  await p.waitForSelector('.ob-tut',{timeout:15000});await p.waitForTimeout(800);await t.shot('11-tut');await p.click('.ob-tut [data-k=next]');await p.waitForTimeout(1500);
  const pos=async()=>p.evaluate(()=>{const a=Isle3DLife.agent(Cfg.v.active),v=a.root.position.clone();v.y+=.85;const s=Isle3D.project(v);return{x:s.x,y:s.y}});
  let s=await pos();await t.shot('12-tut-pet');await p.mouse.move(s.x,s.y);await p.mouse.down();for(let i=0;i<16;i++){await p.mouse.move(s.x,s.y+(i%2?-24:24),{steps:3});await p.waitForTimeout(60)}await p.mouse.up();await p.waitForTimeout(1600);
  t.log('after pet: '+await p.evaluate(()=>document.querySelector('.ob-tip small').textContent));
  s=await pos();await p.mouse.click(s.x,s.y);await p.waitForTimeout(2600);t.log('after tap: '+await p.evaluate(()=>document.querySelector('.ob-tip small').textContent));
  s=await pos();await p.mouse.click(s.x-70,s.y+60);await p.waitForTimeout(2200);t.log('after move: '+await p.evaluate(()=>document.querySelector('.ob-tip small')?.textContent));await t.shot('13-tut-move');
  for(let i=0;i<14;i++){if(!(await p.$('.ob-tut')))break;const b=await p.waitForSelector('.ob-tut [data-k=next]:not([hidden])',{timeout:12000}).catch(()=>null);if(!b)break;if(i===3)await t.shot('14-tut-mid');await b.click();await p.waitForTimeout(600)}
  await p.waitForTimeout(800);const ob=await p.evaluate(()=>{Cfg.flush();return Cfg.v.ob});t.assert(ob.done,'onboarding done');await t.shot('15-free');
  await p.reload();await p.waitForFunction(()=>window.Isle3DLife?.agents?.size>0,null,{timeout:20000});await p.waitForTimeout(1500);t.assert(!(await p.$('#obRoot')),'no onboarding after reload');
  t.assert(await p.evaluate(()=>Chars.active().name==='測試貓'&&Isle3D.house?.type==='mushroom'),'OC and house persisted')};
module.exports.legacy=async t=>{const p=t.page;
  await p.addInitScript(()=>{if(!localStorage.getItem('ocs.v1'))localStorage.setItem('ocs.v1',JSON.stringify({theme:'light',active:'yuzu',dataVer:2,overrides:{}}))});
  await p.goto(t.url);await p.waitForTimeout(3500);t.assert(!(await p.$('#obRoot')),'old save: no forced onboarding');
  const ob=await p.evaluate(()=>Cfg.v.ob);t.assert(ob&&ob.done&&ob.legacy,'old save marked onboarded');t.assert(await p.evaluate(()=>Cfg.v.active==='yuzu'),'old active character kept');
  await p.evaluate(()=>Settings.open());await p.waitForTimeout(500);t.assert(await p.$('#obSec'),'replay rows in settings');
  await p.evaluate(()=>{Settings.close();OCSOnboarding.replayOpening()});await p.waitForTimeout(700);await p.click('#obRoot [data-k=start]');await p.waitForTimeout(1500);await p.click('#obRoot [data-k=skip]');await p.waitForTimeout(900);
  t.assert(!(await p.$('#obRoot')),'replay returns to game');t.assert(await p.evaluate(()=>Cfg.v.active==='yuzu'),'replay does not change roster')};
module.exports.world=async t=>{const p=t.page;await p.goto(t.url);await p.waitForTimeout(2500);await p.evaluate(()=>OCSOnboarding.skipAll());await p.waitForTimeout(500);
  await p.evaluate(()=>Nav.go(3));await p.waitForTimeout(900);t.assert(await p.$('#wMap .wm-pin[data-loc=beach]'),'map pins');await t.shot('map');
  t.assert(await p.$('#wMap .wm-pin.lock[data-loc=forest]'),'forest locked at start');
  await p.$eval('#wMap [data-loc=beach]',e=>e.click());await p.waitForTimeout(700);await t.shot('beach-sheet');await p.click('.wl-go');await p.waitForTimeout(1500);
  t.assert(await p.$('.wloc[data-loc=beach]'),'entered beach');await t.shot('beach');
  const coins0=await p.evaluate(()=>Eco.v.coins);
  await p.click('.wl-bar [data-act=shell]');await p.waitForTimeout(1200);await t.shot('beach-shells');
  for(const b of await p.$$('.wpick')){await b.evaluate(e=>e.click());await p.waitForTimeout(250)}await p.waitForTimeout(800);
  const shells=await p.evaluate(()=>Object.keys(L30.SPEC.shell.list.filter(z=>L30.found('shell',z[0]))).length);t.log('shells found: '+shells);t.assert(shells>0,'shells collected into codex');
  await p.click('.wl-bar [data-act=fish]');await p.waitForTimeout(600);await t.shot('fishing');await p.click('[data-reel]');await p.waitForTimeout(1200);
  const coins1=await p.evaluate(()=>Eco.v.coins);t.log(`coins ${coins0} -> ${coins1}`);t.assert(coins1>coins0,'activity reward paid');
  const mem=await p.evaluate(()=>IsleLife.X(Cfg.v.active).mem.slice(0,3).map(m=>m.text));t.log('memories: '+mem.join(' / '));t.assert(mem.some(m=>/海灘|貝殼|星砂/.test(m)),'location memory saved');
  await p.click('.wl-h [data-k=back]');await p.waitForTimeout(800);t.assert(!(await p.$('.wloc')),'left scene');
  // unlock forest after 1 visit, and cafe chat/drinks
  await p.evaluate(()=>OCSWorld.enter('forest'));await p.waitForTimeout(1500);await t.shot('forest');await p.click('.wl-bar [data-act=bugs]');await p.waitForTimeout(1500);
  for(const b of await p.$$('.wbug')){try{await b.click({timeout:500})}catch(_){}}await p.waitForTimeout(600);await t.shot('forest-bugs');await p.evaluate(()=>OCSWorld.leave());await p.waitForTimeout(500);
  await p.evaluate(()=>{Eco.v.coins+=100;OCSWorld.enter('cafe')});await p.waitForTimeout(1500);await p.click('.wl-bar [data-act=order]');await p.waitForTimeout(500);await t.shot('cafe-menu');
  const before=await p.evaluate(()=>Eco.v.coins);await p.$eval('.wmenu [data-d]',e=>e.click());await p.waitForTimeout(800);const after=await p.evaluate(()=>Eco.v.coins);t.log(`cafe spend ${before} -> ${after}`);t.assert(after<before,'drinks cost coins');
  await p.evaluate(()=>OCSWorld.leave());await p.evaluate(()=>Cfg.flush());await p.reload();await p.waitForTimeout(3000);
  const v=await p.evaluate(()=>Cfg.v.world.visits);t.log('visits '+JSON.stringify(v));t.assert(v.beach===1&&v.forest===1,'visits persisted')};
const GLARGS=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'];module.exports.GLARGS=GLARGS;
module.exports.isle=async t=>{const p=t.page;await p.addInitScript(()=>{if(!localStorage.getItem('ocs.v1'))localStorage.setItem('ocs.v1',JSON.stringify({ob:{done:true},dataVer:2,isle3d:{timeOverride:15}}))});
  await p.goto(t.url);await p.waitForFunction(()=>window.Isle3DLife?.agents?.size>0,null,{timeout:20000});await p.waitForTimeout(2500);await t.shot('home');
  const n=await p.evaluate(()=>Isle3DLife.agents.size);t.log('agents '+n);t.assert(n>=1,'agents spawned');t.assert(await p.evaluate(()=>!!Isle3D.house),'default house placed');
  // tap a character → becomes controlled + radial menu
  const scr=async id=>p.evaluate(id=>{const a=Isle3DLife.agent(id);const v=a.root.position.clone();v.y+=.85;const s=Isle3D.project(v);const r=Isle3D.renderer.domElement.getBoundingClientRect();return{x:s.x+r.left,y:s.y+r.top}},id);
  const ids=await p.evaluate(()=>[...Isle3DLife.agents.keys()]);const target=ids[ids.length-1];
  await p.evaluate(id=>{const a=Isle3DLife.agent(id);if(a.inside)Isle3DLife.exitHouse(a);a.task=null;a.thinkT=99;a.cat.play('idle');for(const b of Isle3DLife.agents.values())if(b!==a){b.task=null;b.thinkT=99;b.pos.set(-8+Math.random(),0,8)}Isle3D.focus(a.root.position,16)},target);await p.waitForTimeout(1500);
  let s=await scr(target);await p.mouse.click(s.x,s.y);await p.waitForTimeout(700);
  t.assert(await p.evaluate(id=>Cfg.v.active===id,target),'tap switches controlled character');t.assert(await p.$('.im-menu.on'),'radial menu open');await t.shot('menu');
  await p.click('.im-scrim',{position:{x:20,y:200}});await p.waitForTimeout(400);
  // stroke up/down on the character → petting
  s=await scr(target);const bond0=await p.evaluate(id=>Eco.v.bond[id]||0,target);
  await p.mouse.move(s.x,s.y);await p.mouse.down();for(let i=0;i<14;i++){await p.mouse.move(s.x,s.y+(i%2?-24:24),{steps:3});await p.waitForTimeout(60)}
  const petting=await p.evaluate(id=>Isle3DLife.agent(id).petting,target);await t.shot('petting');await p.mouse.up();await p.waitForTimeout(500);
  t.assert(petting,'stroking pets the character');t.log('bond '+bond0+' -> '+await p.evaluate(id=>Eco.v.bond[id]||0,target));
  // tap ground → walk there
  const before=await p.evaluate(id=>Isle3DLife.agent(id).pos.clone(),target);await p.mouse.click(120,560);await p.waitForTimeout(2500);
  const moved=await p.evaluate(([id,b])=>Isle3DLife.agent(id).pos.distanceTo(new THREE.Vector3(b.x,b.y,b.z)),[target,before]);t.log('moved '+moved.toFixed(2));t.assert(moved>.3,'tap ground moves controlled character');
  // quests: make a job ready then claim from the panel
  await p.evaluate(()=>{Econ.roll();const j=Econ.s.jobs[0];j.p=j.n;Eco.save()});const c0=await p.evaluate(()=>Eco.v.coins);
  await p.$eval('.ih-quest',e=>e.click());await p.waitForTimeout(800);await t.shot('quests');
  const claimed=await p.evaluate(()=>{const b=[...document.querySelectorAll('.sheet.open [data-job]')].find(x=>!x.disabled);if(b){b.click();return true}return false});await p.waitForTimeout(600);
  const c1=await p.evaluate(()=>Eco.v.coins);t.log(`claim ${claimed} coins ${c0} -> ${c1}`);t.assert(c1>c0,'quest reward claimed');
  await p.evaluate(()=>document.querySelector('.sheet.open')&&Ov.back());await p.waitForTimeout(400);
  // bag → feed
  await p.evaluate(()=>{const f=Items.d.items.find(i=>i.cat==='food');if(f)f.qty=Math.max(f.qty,2);Items.emit()});
  await p.$eval('[data-k=bag]',e=>e.click());await p.waitForTimeout(700);await t.shot('bag');const q0=await p.evaluate(()=>Items.d.items.filter(i=>i.cat==='food').reduce((a,i)=>a+i.qty,0));
  await p.evaluate(()=>document.querySelector('.sheet.open [data-t=food]').click());await p.waitForTimeout(300);await p.evaluate(()=>{const b=document.querySelector('.sheet.open .ib-it');b&&b.click()});await p.waitForTimeout(3200);const q1=await p.evaluate(()=>Items.d.items.filter(i=>i.cat==='food').reduce((a,i)=>a+i.qty,0));const tt=await p.evaluate(()=>document.querySelector('.toast')?.textContent||'');t.log(`feed: ${q0}->${q1} ${tt}`);t.assert(q1===q0-1||/婉拒/.test(tt),'feeding uses one item or is politely refused');
  // house interior
  await p.$eval('[data-k=house]',e=>e.click());await p.waitForTimeout(1800);await t.shot('room');t.assert(await p.evaluate(()=>Isle3D.viewMode==='room'),'entered house');
  await p.$eval('[data-spot=bed]',e=>e.click());await p.waitForTimeout(1200);await t.shot('room-bed');t.assert(await p.evaluate(()=>Isle3DLife.agent(Cfg.v.active).roomUse==='bed'),'used bed');
  await p.$eval('[data-k=leaveRoom]',e=>e.click());await p.waitForTimeout(800);
  // drama: force a quarrel and sickness, check journal
  await p.evaluate(()=>{const [a,b]=[...Isle3DLife.agents.values()];if(b){Isle3DLife.quarrel(a,b)}Isle3DLife.catchSick(a,'cold')});await p.waitForTimeout(1500);await t.shot('drama');
  const j=await p.evaluate(()=>Cfg.v.isle3d.journal.slice(0,3).map(x=>x.text));t.log('journal: '+j.join(' / '));t.assert(j.some(x=>/感冒/.test(x)),'sickness journaled');
  await p.$eval('[data-k=wx]',e=>e.click());await p.waitForTimeout(600);await p.evaluate(()=>{document.querySelector('.sheet.open [data-w=rain]').click()});await p.waitForTimeout(1200);await p.evaluate(()=>Ov.back());await p.waitForTimeout(800);await t.shot('rain');
  t.assert(await p.evaluate(()=>Isle3D.sky.wx==='rain'&&Isle3D.rain.visible),'weather override applied');
  await p.evaluate(()=>{Isle3DLife.save();Cfg.flush()});await p.reload();await p.waitForFunction(()=>window.Isle3DLife?.agents?.size>0,null,{timeout:20000});
  t.assert(await p.evaluate(id=>Cfg.v.active===id&&!!Cfg.v.isle3d.health,target),'state persisted')};
