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
