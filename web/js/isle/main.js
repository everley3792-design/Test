/* ===== Isle3D 首頁控制器：掛載 3D 小島、停用舊版 DOM 舞台 ===== */
(()=>{'use strict';
const E=window.Isle3D;if(!E)return;
function mount(){const page=document.getElementById('p-home');if(!page)return false;
  let host=document.getElementById('isle3d');if(!host){host=document.createElement('div');host.id='isle3d';page.prepend(host)}
  // legacy DOM stage: stop its simulation and rendering completely (was the main source of flicker/jank)
  try{Home.stage.stop()}catch(_){}
  try{const C=window.OCSCommunity;if(C){C.active=()=>false;C.paused=true;C.cancelAll=()=>{};C.interrupt=()=>{};C.sync=()=>{try{window.Isle3DLife?.sync()}catch(_){}}}}catch(_){}
  Home.visible=function(v){this.vis=v;E.setActive(v);try{this.stage.stop()}catch(_){}};
  Home.setChar=function(){try{Isle3DUI.refresh()}catch(_){}};
  document.documentElement.classList.add('isle3d-on');
  E.init(host);E.buildProps();
  const H=window.Isle3DHouse;if(H){const st=Cfg.v.isle3d?.home;if(!st&&Cfg.v.ob?.done){H.save(defaultSpot('cottage'))}H.build()}
  window.Isle3DLife?.start();window.Isle3DUI?.start();
  E.setActive(typeof Nav==='undefined'||Nav.cur===0);
  const pf=window.OCSPerf;if(pf){const ap=pf.apply;pf.apply=function(){const r=ap.apply(this,arguments);try{E.applyQuality()}catch(_){}return r}}
  return true}
function defaultSpot(type){const H=window.Isle3DHouse;for(const [x,z] of [[-2,-2.6],[-1,-4],[0,-3],[-3,-1],[2,-4],[-4,-4]])if(H.valid(x,z,type))return{type,x,z,ry:0};return{type,x:-2,z:-2.6,ry:0}}
window.Isle3DMain={defaultSpot};
const t=setInterval(()=>{if(typeof Home==='undefined'||!Home.stage||!window.OCSCommunity?.ready||!window.L30||!window.L31)return;clearInterval(t);try{mount()}catch(e){console.error('[Isle3D]',e)}},60);
})();
