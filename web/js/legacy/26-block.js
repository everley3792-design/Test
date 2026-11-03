/* Home World Camera 2.4F-B: layer-safe navigation, fitted accessory close-up. */
(()=>{'use strict';
 const MIN=.6, MAX=3.15, lerp=(a,b,t)=>a+(b-a)*t, cap=(v,a,b)=>Math.min(b,Math.max(a,v));
 const Camera=window.OCSCamera={
   st:null,root:null,plane:null,button:null,follow:true,editing:false,mode:'',
   z:1,x:0,y:0,tz:1,tx:0,ty:0,pointers:new Map(),gesture:null,saveTimer:0,restoreView:null,
   worldPoint(root,cx,cy){if(root!==this.root)return null;const r=root.getBoundingClientRect();return {x:(cx-r.left-this.x)/this.z,y:(cy-r.top-this.y)/this.z}},
   goalWorld(cx,cy){const r=this.root.getBoundingClientRect();return {x:(cx-r.left-this.tx)/this.tz,y:(cy-r.top-this.ty)/this.tz}},
   limits(x,y,z){const W=this.st.W||this.root.clientWidth,H=this.st.H||this.root.clientHeight;
     const R=window.OCSWorldRect||{l:-.95,r:1.95,t:-.18,b:1.3};
     const axis=(v,side,a,b)=>{const lo=side-b*side*z,hi=-a*side*z;return lo>hi?(lo+hi)/2:cap(v,lo,hi)};
     return {x:axis(x,W,R.l,R.r),y:axis(y,H,R.t,R.b)}},
   setTarget(x,y,z){this.tz=cap(z,MIN,MAX);const q=this.limits(x,y,this.tz);this.tx=q.x;this.ty=q.y},
   focusTarget(mode){const s=this.st, W=s.W,H=s.H,focusX=s.x+s.size*.5,focusY=s.feetY-s.h-s.size*.51;
     const z=mode==='dress'?cap(W*.76/s.size,1.50,2.35):this.tz;
     const ay=mode==='dress'?.55:.59;
     this.setTarget(W*.5-focusX*z,H*ay-focusY*z,z)},
   update(dt){if(!this.st||!this.plane||!this.st.W)return;
     if(this.editing){/* fitted editor target remains fixed while placement controls move. */}
     else if(this.follow&&!this.gesture&&!document.body.classList.contains('dragging'))this.focusTarget();
     const m=document.documentElement.dataset.motion==='reduce',k=m?1:1-Math.exp(-cap(dt||.016,0,.07)*11);
     this.z=lerp(this.z,this.tz,k);this.x=lerp(this.x,this.tx,k);this.y=lerp(this.y,this.ty,k);
     if(Math.abs(this.z-this.tz)<.0001)this.z=this.tz;
     if(Math.abs(this.x-this.tx)<.035)this.x=this.tx;
     if(Math.abs(this.y-this.ty)<.035)this.y=this.ty;
     const tr=`translate3d(${this.x.toFixed(2)}px,${this.y.toFixed(2)}px,0) scale(${this.z.toFixed(4)})`;
     if(this.plane.style.transform!==tr)this.plane.style.transform=tr;this.root.classList.toggle('cam-zoomed-out',this.z<.985)},
   setFollow(v){this.follow=!!v;this.paintButton();if(this.follow&&!this.editing)this.focusTarget();this.persistLater()},
   paintButton(){const b=this.button;if(!b)return;b.setAttribute('aria-pressed',String(this.follow));b.setAttribute('aria-label',this.follow?'目前跟隨角色，點擊切換自由鏡頭':'跟隨角色');b.title=this.follow?'切換自由鏡頭':'跟隨角色'},
   persistLater(){clearTimeout(this.saveTimer);this.saveTimer=setTimeout(()=>this.persist(),350)},
   persist(){if(this.editing||!this.st)return;try{
     const W=this.st.W,H=this.st.H;
     localStorage.setItem('ocs.camera.home.v1',JSON.stringify({follow:this.follow,z:this.tz,focusX:(W/2-this.tx)/this.tz/W,focusY:(H/2-this.ty)/this.tz/H}));
   }catch(e){}},
   load(){try{const v=JSON.parse(localStorage.getItem('ocs.camera.home.v1')||'null');if(!v)throw 0;
     this.follow=v.follow!==false;const z=cap(Number(v.z)||1,MIN,MAX),W=this.st.W,H=this.st.H;
     const fx=cap(Number(v.focusX)||.5,-.5,1.5),fy=cap(Number(v.focusY)||.5,-.5,1.5);
     this.setTarget(W/2-fx*W*z,H/2-fy*H*z,z);this.z=this.tz;this.x=this.tx;this.y=this.ty;
   }catch(e){}this.paintButton();this.update(.016)},
   pan(dx,dy){this.setFollow(false);this.setTarget(this.tx+dx,this.ty+dy,this.tz)},
   zoomAt(next,cx,cy){const world=this.goalWorld(cx,cy),r=this.root.getBoundingClientRect(),z=cap(next,MIN,MAX);
     this.setTarget(cx-r.left-world.x*z,cy-r.top-world.y*z,z);this.persistLater()},
   reset(){this.setFollow(true);this.tz=1;this.focusTarget();this.persistLater()},
   editEnter(mode){if(this.editing)return;
     this.restoreView={follow:this.follow,z:this.tz,x:this.tx,y:this.ty};this.editing=true;this.mode=mode;
     this.pointers.clear();this.gesture=null;this.root.classList.remove('cam-panning');
     if(mode==='dress')this.focusTarget('dress');else this.setTarget(0,0,1)},
   editExit(){if(!this.editing)return;
     this.editing=false;this.mode='';const v=this.restoreView;this.restoreView=null;
     if(v){this.follow=v.follow;this.setTarget(v.x,v.y,v.z);if(this.follow)this.focusTarget();this.paintButton()}
     this.persistLater()},
   canGesture(){return !this.editing&&Nav.cur===0&&!document.body.classList.contains('dragging')&&!document.querySelector('.sheet.open,.ovp.open')},
   bind(){const root=this.root;
     root.addEventListener('pointerdown',e=>{if(e.button!==0||!this.canGesture())return;
       const blocked=!!e.target.closest('.rm-it,.gr-it,.accessory-placed'),actor=!!e.target.closest('.art');
       if(blocked&&this.pointers.size===0)return;
       this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,actor});
       if(this.pointers.size===1){this.gesture={type:actor?'actor':'pending',id:e.pointerId,sx:e.clientX,sy:e.clientY,tx:this.tx,ty:this.ty};
         if(!actor)try{root.setPointerCapture(e.pointerId)}catch(_){}
       }else if(this.pointers.size>=2){
         if(window.OCSCommunity?.ready)OCSCommunity.cancelDrags();const s=this.st;if(s.drag){s.drag=null;if(s.state==='held'){s.vx=s.vy=0;s.h=0;s.setState('idle')}}
         this.gesture=this.pinchStart();
         e.preventDefault();e.stopPropagation();
       }
     },true);
     root.addEventListener('pointermove',e=>{const p=this.pointers.get(e.pointerId);if(!p)return;
       p.x=e.clientX;p.y=e.clientY;
       if(!this.canGesture()){this.pointers.clear();this.gesture=null;root.classList.remove('cam-panning');return}
       const g=this.gesture;if(!g)return;
       if(this.pointers.size>=2){if(g.type!=='pinch')this.gesture=this.pinchStart();const a=[...this.pointers.values()].slice(0,2);
         const mid={x:(a[0].x+a[1].x)/2,y:(a[0].y+a[1].y)/2},dist=Math.max(1,Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y));
         const z=cap(g.z*dist/g.dist,MIN,MAX),r=root.getBoundingClientRect();
         this.setTarget(mid.x-r.left-g.world.x*z,mid.y-r.top-g.world.y*z,z);
         this.setFollow(false);e.preventDefault();return}
       if(g.type==='actor')return;
       if(g.type==='pending'&&Math.hypot(p.x-g.sx,p.y-g.sy)>7){g.type='pan';this.setFollow(false);root.classList.add('cam-panning')}
       if(g.type==='pan'){this.setTarget(g.tx+p.x-g.sx,g.ty+p.y-g.sy,this.tz);e.preventDefault()}
     },true);
     const end=e=>{if(!this.pointers.delete(e.pointerId))return;
       if(this.pointers.size<2){if(this.gesture?.type==='pinch'){
         const p=[...this.pointers.values()][0];this.gesture=p?{type:'pending',id:[...this.pointers.keys()][0],sx:p.x,sy:p.y,tx:this.tx,ty:this.ty}:null;
       }else if(!this.pointers.size)this.gesture=null;
       if(!this.pointers.size){root.classList.remove('cam-panning');this.persistLater()}}
     };
     root.addEventListener('pointerup',end,true);root.addEventListener('pointercancel',end,true);
     root.addEventListener('lostpointercapture',end,true);
     root.addEventListener('wheel',e=>{if(!this.canGesture())return;e.preventDefault();
       this.zoomAt(this.tz*Math.exp(-e.deltaY*(e.deltaMode===1?.035:.0014)),e.clientX,e.clientY)
     },{passive:false});
     root.addEventListener('dblclick',e=>{if(!this.canGesture()||e.target.closest('.art,.rm-it,.gr-it'))return;e.preventDefault();this.reset()});
     new ResizeObserver(()=>{if(!this.st?.W)return;
       if(this.editing)this.focusTarget(this.mode);
       else if(this.follow)this.focusTarget();else this.setTarget(this.tx,this.ty,this.tz)
     }).observe(root);
     document.addEventListener('visibilitychange',()=>{if(document.hidden){this.pointers.clear();this.gesture=null;this.persist()}});
   },
   pinchStart(){const a=[...this.pointers.values()].slice(0,2),x=(a[0].x+a[1].x)/2,y=(a[0].y+a[1].y)/2;
     return {type:'pinch',z:this.tz,dist:Math.max(1,Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)),world:this.goalWorld(x,y)}},
   mount(){const st=Home.stage;if(!st||!st.root||!st.W)return false;
     this.st=st;this.root=st.root;
     const root=this.root,plane=document.createElement('div');plane.className='oc-cam-plane';plane.setAttribute('aria-hidden','false');
     root.prepend(plane);[...root.children].forEach(e=>{if(e!==plane)plane.appendChild(e)});this.plane=plane;
     // 左右各鏡像複製一份遠景（去掉小屋），接縫處高度一致、地形連續。
     const hills=plane.querySelector(':scope>.hills');
     if(hills)[-1,1].forEach(sd=>{const c=hills.cloneNode(true);c.classList.add('hills-ext');c.setAttribute('aria-hidden','true');c.dataset.side=sd;c.querySelectorAll('.cozy-cottage').forEach(n=>n.remove());hills.after(c)});
     const fs=plane.querySelector(':scope>.floor>svg');
     if(fs)[-1,1].forEach(sd=>{const c=fs.cloneNode(true);c.classList.add('ext');c.dataset.side=sd;fs.after(c)});
     // Stage-space props/particles appended later still belong to the transformed world.
     new MutationObserver(records=>{for(const rec of records)for(const n of rec.addedNodes)if(n.nodeType===1&&n!==plane&&n.parentNode===root)plane.appendChild(n)}).observe(root,{childList:true});
     const btn=document.createElement('button');btn.id='camFollow';btn.className='cam-follow';btn.type='button';
     btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M12 2.8v3.1M12 18.1v3.1M2.8 12h3.1M18.1 12h3.1"/></svg>';
     $('#p-home').appendChild(btn);this.button=btn;btn.addEventListener('click',()=>{if(this.editing)return;this.setFollow(!this.follow);try{buzz(6)}catch(e){}});
     this.bind();this.load();return true}
 };
 function initialize(){if(!Home?.stage?.W||!window.OCS24D?.Room?.st||!window.OCS24D?.Ed||!document.getElementById('worldProps'))return false;
   if(!Camera.mount())return false;
   const originalUpdate=Stage.prototype.update;
   Stage.prototype.update=function(dt){const value=originalUpdate.apply(this,arguments);if(this===Camera.st)Camera.update(dt);return value};
   // Keep editor gestures in their own screen space; dress focus is a visual camera move only.
   const E=window.OCS24D.Ed,originalEnter=E.enter,originalExit=E.exit;
   E.enter=function(mode,s){const out=originalEnter.apply(this,arguments);if(this.on)Camera.editEnter(mode);return out};
   E.exit=function(save){const out=originalExit.apply(this,arguments);if(!this.on)Camera.editExit();return out};
   // Scene drops use world-space placement even when zoomed and panned.
   const Room=window.OCS24D.Room,originalRoomBegin=Room.begin;
   Room.begin=function(id,s,o){if(o?.px!=null&&Camera.root&&s===Camera.st){const q=Camera.worldPoint(s.root,o.px,o.py??s.root.getBoundingClientRect().top+s.feetY);
      const rect=s.root.getBoundingClientRect();o={...o,px:rect.left+q.x,py:rect.top+q.y}}return originalRoomBegin.call(this,id,s,o)};
   return true
 }
 const boot=setInterval(()=>{try{if(initialize())clearInterval(boot)}catch(err){console.error('[Home Camera] init:',err);clearInterval(boot)}},100);
})();
