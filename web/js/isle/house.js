/* ===== Isle3D 家：三款房屋、自由擺放、可進入的室內與可使用的家具 =====
   Cfg.v.isle3d.home = {type, x, z, ry}. Characters walk to the door to sleep,
   eat or shelter from rain; in the interior view they appear on the bed / table /
   sofa, and the player can tap furniture to have the controlled character use it. */
(()=>{'use strict';
const E=window.Isle3D;if(!E)return;const T=E.T,V3=T.Vector3,Mt=E.mat;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),rnd=(a,b)=>a+Math.random()*(b-a);
const mesh=(g,m,x=0,y=0,z=0)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;return o};
const ST=()=>{const v=Cfg.v;if(!v.isle3d||typeof v.isle3d!=='object')v.isle3d={};return v.isle3d};
const warm=()=>new T.MeshStandardMaterial({color:0xFFE6A8,emissive:0xFFC56A,emissiveIntensity:.3,flatShading:true});
function prism(w,h,d){const s=new T.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(0,h);s.closePath();const g=new T.ExtrudeGeometry(s,{depth:d,bevelEnabled:false});g.translate(0,0,-d/2);return g}
function roofSlab(w,len,th,col){return mesh(new T.BoxGeometry(w,th,len),Mt(col))}
function windowBox(g,x,y,z,ry=0,w=.55,h=.55){const f=mesh(new T.BoxGeometry(w+.12,h+.12,.08),Mt(0xFFFFFF),x,y,z);f.rotation.y=ry;g.add(f);const gl=mesh(new T.BoxGeometry(w,h,.1),warm(),x,y,z);gl.rotation.y=ry;g.add(gl);(g.userData.wins=g.userData.wins||[]).push(gl);
  const bar=mesh(new T.BoxGeometry(.04,h,.12),Mt(0xFFFFFF),x,y,z);bar.rotation.y=ry;g.add(bar);return gl}

/* ---------- house designs ---------- */
const HOUSES={
 cottage:{name:'綠屋頂小屋',desc:'爬滿花藤的溫馨小屋，附木頭露台與遮陽棚',r:2.9,build(){const g=new T.Group(),wall=Mt(0xF6EBD8),wood=Mt(0xA27A58),roofA=0x5FA58A,roofB=0x4E9378;
    g.add(mesh(new T.BoxGeometry(3.2,.3,2.6),Mt(0xC9B9A2),0,.15,0));
    g.add(mesh(new T.BoxGeometry(3,2,2.4),wall,0,1.3,0));
    for(const x of[-1.45,1.45])for(const z of[-1.15,1.15])g.add(mesh(new T.BoxGeometry(.18,2.1,.18),wood,x,1.3,z));
    g.add(mesh(new T.BoxGeometry(3.1,.16,2.5),wood,0,2.33,0));
    const gable=mesh(prism(3,1.3,2.4),wall,0,2.4,0);g.add(gable);
    for(const s of[-1,1]){const r=roofSlab(1.9,2.9,.16,s<0?roofA:roofB);r.position.set(s*.78,3.02,0);r.rotation.z=-s*.72;g.add(r)}
    const ridge=mesh(new T.CylinderGeometry(.09,.09,2.95,6),Mt(0x3F7E66),0,3.66,0);ridge.rotation.x=Math.PI/2;g.add(ridge);
    g.add(mesh(new T.BoxGeometry(.5,1.2,.5),Mt(0xD8D2C4),.9,3.4,-.5));g.add(mesh(new T.BoxGeometry(.6,.14,.6),Mt(0xB9B2A6),.9,4.02,-.5));
    const door=mesh(new T.BoxGeometry(.75,1.25,.1),Mt(0x9A6E52),-.6,.95,1.22);g.add(door);g.add(mesh(new T.CylinderGeometry(.38,.38,.1,10,1,false,0,Math.PI),Mt(0x9A6E52),-.6,1.57,1.22).rotateX(Math.PI/2).rotateZ(Math.PI/2));
    g.add(mesh(new T.SphereGeometry(.05,6,4),Mt(0xF6C65B),-.35,.95,1.29));
    windowBox(g,.7,1.45,1.22);windowBox(g,-1.52,1.45,0,Math.PI/2);windowBox(g,0,2.95,1.23,0,.45,.4);
    // porch + awning + flower boxes
    g.add(mesh(new T.BoxGeometry(3.2,.18,1.3),wood,0,.12,1.85));for(const x of[-1.5,1.5])g.add(mesh(new T.CylinderGeometry(.06,.06,1.7,5),wood,x,1,2.42));
    const aw=mesh(new T.BoxGeometry(3.3,.06,1.4),Mt(0xF4EEDF),0,1.88,1.95);aw.rotation.x=.18;g.add(aw);
    for(let i=0;i<7;i++)g.add(mesh(new T.ConeGeometry(.12,.16,3),Mt([0xF2A3B3,0xF6C65B,0x8FCBEF][i%3]),-1.5+i*.5,1.74,2.62).rotateX(Math.PI));
    g.add(mesh(new T.BoxGeometry(.7,.22,.25),wood,.7,1.05,1.36));for(let i=0;i<4;i++)g.add(mesh(new T.IcosahedronGeometry(.1,0),Mt([0xF2A3B3,0xFFFFFF,0xB9A6E6,0xF6C65B][i]),.45+i*.17,1.22,1.36));
    for(let i=0;i<9;i++){const v=mesh(new T.IcosahedronGeometry(.22,0),Mt(i%2?0x7FB35A:0x6FA64E),1.5,.4+i*.27,1.2-((i*.37)%1)*.2);g.add(v);if(i%2)g.add(mesh(new T.IcosahedronGeometry(.07,0),Mt(0xFFFFFF),1.62,.45+i*.27,1.3))}
    return{g,door:new V3(-.6,0,2.7)}}},
 mushroom:{name:'蘑菇小屋',desc:'圓滾滾的蘑菇房，紅傘帽上有白色圓點',r:2.4,build(){const g=new T.Group();
    g.add(mesh(new T.CylinderGeometry(1.45,1.6,2.2,10),Mt(0xF6EBD8),0,1.1,0));
    const cap=mesh(new T.SphereGeometry(2.25,12,8,0,Math.PI*2,0,Math.PI*.5),Mt(0xE97A7A),0,2.05,0);cap.scale.y=.75;g.add(cap);
    for(let i=0;i<9;i++){const a=i/9*6.28,r=i%3===0?.6:1.5;const d=mesh(new T.SphereGeometry(.24,6,4),Mt(0xFFF6EE),Math.cos(a)*r,2.05+(r<1?1.55:1.05),Math.sin(a)*r);d.scale.y=.45;g.add(d)}
    g.add(mesh(new T.CylinderGeometry(2.25,2.25,.12,12),Mt(0xF7D9D0),0,2.04,0));
    const door=mesh(new T.CylinderGeometry(.45,.45,.12,12),Mt(0x9A6E52),0,.75,1.5);door.rotation.x=Math.PI/2;door.scale.set(1,1,1.6);g.add(door);g.add(mesh(new T.BoxGeometry(.9,.75,.12),Mt(0x9A6E52),0,.4,1.52));
    windowBox(g,-.95,1.35,1.12,-.6,.42,.42);windowBox(g,1.0,1.3,1.08,.65,.42,.42);
    for(let i=0;i<5;i++)g.add(mesh(new T.CylinderGeometry(.22,.26,.1,7),Mt(0xD8D2C4),Math.sin(i*.3)*.3,.05,1.9+i*.55));
    return{g,door:new V3(0,0,2.2)}}},
 cabin:{name:'雙層木屋',desc:'有陽台與藍屋頂的兩層木屋，空間寬敞',r:3.1,build(){const g=new T.Group(),log=Mt(0xB58660),log2=Mt(0xA27554);
    g.add(mesh(new T.BoxGeometry(3.4,.3,2.8),Mt(0xB9B2A6),0,.15,0));
    for(let i=0;i<9;i++)g.add(mesh(new T.BoxGeometry(3.2,.34,2.6),i%2?log:log2,0,.47+i*.34,0));
    g.add(mesh(prism(3.2,1.4,2.6),log,0,3.5,0));
    for(const s of[-1,1]){const r=roofSlab(2.1,3.1,.18,0x6F8FC9);r.position.set(s*.8,4.18,0);r.rotation.z=-s*.72;g.add(r)}
    g.add(mesh(new T.BoxGeometry(.75,1.3,.1),Mt(0x8A6046),.8,.95,1.32));windowBox(g,-.75,1.25,1.32);windowBox(g,-.75,2.65,1.32);windowBox(g,.8,2.65,1.32);
    g.add(mesh(new T.BoxGeometry(3.4,.12,.9),log2,0,2.05,1.72));for(let i=0;i<9;i++)g.add(mesh(new T.CylinderGeometry(.03,.03,.5,4),log2,-1.6+i*.4,2.35,2.12));g.add(mesh(new T.BoxGeometry(3.4,.06,.06),log2,0,2.6,2.12));
    g.add(mesh(new T.BoxGeometry(.4,1,.4),Mt(0xD8D2C4),-1,4.4,-.6));
    return{g,door:new V3(.8,0,2.1)}}}};
const H={HOUSES};

/* ---------- placement on the island ---------- */
let houseObs=null;
function spawnPoint(i){const h=E.house;const base=h?h.door:{x:0,z:3};const a=i*1.3+.6;return{x:base.x+Math.cos(a)*1.4,z:base.z+Math.abs(Math.sin(a))*1.4+.5}}
E.spawnPoint=spawnPoint;
function setHouse(st){if(E.house?.group)E.props.remove(E.house.group);if(!st||!HOUSES[st.type]){E.house=null;if(houseObs)houseObs.on=false;E.dirtyShadow=true;return}
  const D=HOUSES[st.type],b=D.build(),g=b.g;g.position.set(st.x,E.groundY(st.x,st.z)-.05,st.z);g.rotation.y=st.ry||0;g.traverse(o=>{if(o.isMesh){o.castShadow=E.q.shadows;o.receiveShadow=true}});E.props.add(g);
  const door=b.door.clone().applyAxisAngle(new V3(0,1,0),g.rotation.y).add(g.position);
  E.house={type:st.type,group:g,door:{x:door.x,z:door.z},ry:g.rotation.y,r:D.r,x:st.x,z:st.z,wins:g.userData.wins||[]};
  if(!houseObs){houseObs={x:0,z:0,r:1,tag:'house'};E.obstacles.push(houseObs)}Object.assign(houseObs,{x:st.x,z:st.z,r:D.r*.78,on:true});
  E.POI=E.POI||[];E.POI=E.POI.filter(p=>p.id!=='home');E.POI.push({id:'home',type:'home',x:door.x,z:door.z,label:'家'});
  winGlow();E.dirtyShadow=true;E.kick()}
function winGlow(){const on=E.sky.phase==='night'||E.sky.phase==='dusk';(E.house?.wins||[]).forEach(w=>w.material.emissiveIntensity=on?1.4:.25)}
H.valid=(x,z,type)=>{const r=HOUSES[type].r;if(!E.inside(x,z,r*.9+.6))return false;if(E.pathDist(x,z)<r*.75)return false;
  return!E.obstacles.some(o=>o!==houseObs&&o.on!==false&&o.tag!=='fence'&&Math.hypot(x-o.x,z-o.z)<o.r+r*.72)};
H.save=st=>{ST().home=Object.assign({},st);Cfg.save();setHouse(ST().home)};
H.current=()=>ST().home;

/* placement mode: drag the ghost house, rotate, confirm */
H.beginPlace=function(type,opts={}){const st=Object.assign({type,x:-2,z:-2.6,ry:0},ST().home&&ST().home.type===type?ST().home:{} ,opts.at||{});
  const prev=ST().home?Object.assign({},ST().home):null;setHouse(null);
  const D=HOUSES[type],b=D.build(),ghost=b.g;ghost.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.transparent=true;o.material.opacity=.82;o.castShadow=false}});E.props.add(ghost);
  const ring=new T.Mesh(new T.RingGeometry(D.r*.82,D.r*.92,40),new T.MeshBasicMaterial({color:0x7FD6A0,transparent:true,opacity:.75,depthWrite:false}));ring.rotation.x=-Math.PI/2;E.props.add(ring);
  const put=()=>{const y=E.groundY(st.x,st.z);ghost.position.set(st.x,y,st.z);ghost.rotation.y=st.ry;ring.position.set(st.x,y+.06,st.z);const ok=H.valid(st.x,st.z,type);ring.material.color.set(ok?0x7FD6A0:0xF08A8A);bar.querySelector('[data-k=ok]').disabled=!ok;bar.querySelector('small').textContent=ok?'拖曳移動・可以放在這裡':'這裡太擠了，換個地方吧';E.kick()};
  const bar=document.createElement('div');bar.className='hp-bar';bar.innerHTML=`<div class="hp-t"><b>擺放「${D.name}」</b><small></small></div><div class="hp-b"><button data-k="rot" aria-label="旋轉">${ic('reset')}旋轉</button>${opts.cancel===false?'':'<button data-k="no">取消</button>'}<button data-k="ok" class="pri">${ic('check')}決定</button></div>`;
  (document.getElementById('app')||document.body).append(bar);requestAnimationFrame(()=>bar.classList.add('on'));
  E.focus(new V3(st.x,0,st.z),34);const savedRig=Object.assign({},E.rig.want);E.rig.want.pitch=.95;
  let drag=false,offX=0,offZ=0;const od=E.onPointerDown,om=E.onPointerMove,ou=E.onPointerUp,oc=E.onPointerCancel;
  E.onPointerDown=e=>{const p=E.groundAt(e.clientX,e.clientY);if(p&&Math.hypot(p.x-st.x,p.z-st.z)<D.r*1.1){drag=true;offX=st.x-p.x;offZ=st.z-p.z;return true}return false};
  E.onPointerMove=e=>{if(!drag)return;const p=E.groundAt(e.clientX,e.clientY);if(p){st.x=clamp(p.x+offX,-11,11);st.z=clamp(p.z+offZ,-11,11);put()}};
  E.onPointerUp=E.onPointerCancel=()=>{drag=false};
  const done=ok=>{E.props.remove(ghost);E.props.remove(ring);bar.classList.remove('on');setTimeout(()=>bar.remove(),400);Object.assign(E,{onPointerDown:od,onPointerMove:om,onPointerUp:ou,onPointerCancel:oc});E.rig.want.pitch=savedRig.pitch;
    if(ok){H.save(st);toast(`${D.name} 蓋好了！`,'home');window.Isle3DLife?.journal?.(`在小島上蓋了「${D.name}」。`,'home')}else setHouse(prev);opts.onDone&&opts.onDone(ok)};
  bar.addEventListener('click',e=>{const k=e.target.closest('[data-k]')?.dataset.k;if(!k)return;buzz(8);if(k==='rot'){st.ry=(st.ry+Math.PI/2)%(Math.PI*2);put()}else if(k==='ok'&&H.valid(st.x,st.z,type))done(true);else if(k==='no')done(false)});
  put();return{cancel:()=>done(false)}};

/* ---------- interior (separate room far from the island; camera flies in) ---------- */
const ROOM=new V3(240,0,0);let room=null,roomLight=null;const SPOTS={};
function buildRoom(){if(room)return room;room=new T.Group();room.position.copy(ROOM);E.scene.add(room);
  const floor=mesh(new T.BoxGeometry(9,.2,7),Mt(0xD9B48C),0,-.1,0);room.add(floor);for(let i=0;i<9;i++)room.add(mesh(new T.BoxGeometry(.04,.21,7),Mt(0xC49F7C),-4.5+i,-.09,0));
  room.add(mesh(new T.BoxGeometry(9,4,.2),Mt(0xF6EBD8),0,2,-3.5));room.add(mesh(new T.BoxGeometry(.2,4,7),Mt(0xF1E3CC),-4.5,2,0));
  room.add(mesh(new T.BoxGeometry(9,.6,.22),Mt(0xD8C3A6),0,.3,-3.45));
  const win=mesh(new T.BoxGeometry(1.8,1.3,.1),new T.MeshStandardMaterial({color:0xBFE6F5,emissive:0x9FD0EE,emissiveIntensity:.4}),.8,2.2,-3.38);room.add(win);room.add(mesh(new T.BoxGeometry(.06,1.3,.14),Mt(0xFFFFFF),.8,2.2,-3.36));room.userData.win=win;
  const rug=mesh(new T.CylinderGeometry(1.7,1.7,.04,16),Mt(0xE9B9C2),0,.02,.6);rug.scale.z=.7;room.add(rug);
  // bed
  const bed=new T.Group();bed.add(mesh(new T.BoxGeometry(1.6,.45,2.4),Mt(0xA27A58),0,.22,0));bed.add(mesh(new T.BoxGeometry(1.5,.22,2.3),Mt(0xFFF6EE),0,.55,0));bed.add(mesh(new T.BoxGeometry(1.52,.12,1.5),Mt(0x9DB0E0),0,.68,.38));
  bed.add(mesh(new T.BoxGeometry(.9,.18,.45),Mt(0xFFFFFF),0,.72,-.8));bed.add(mesh(new T.BoxGeometry(1.6,1,.12),Mt(0xA27A58),0,.6,-1.2));bed.position.set(-3.2,0,-1.9);room.add(bed);
  SPOTS.bed={pos:new V3(-3.2,.78,-1.6),ry:0,anim:'sleep',label:'床',use:'sleep'};
  // table + chairs
  const tb=new T.Group();tb.add(mesh(new T.CylinderGeometry(.75,.75,.08,10),Mt(0xC49F7C),0,.8,0));tb.add(mesh(new T.CylinderGeometry(.08,.12,.8,6),Mt(0xA27A58),0,.4,0));
  tb.add(mesh(new T.CylinderGeometry(.18,.14,.06,8),Mt(0xFFFFFF),.2,.87,.1));tb.add(mesh(new T.IcosahedronGeometry(.1,0),Mt(0xE97A7A),.2,.95,.1));tb.position.set(2.4,0,.4);room.add(tb);
  for(const s of[-1,1]){const ch=new T.Group();ch.add(mesh(new T.BoxGeometry(.5,.08,.5),Mt(0xB08A64),0,.45,0));ch.add(mesh(new T.BoxGeometry(.5,.5,.07),Mt(0xB08A64),0,.72,-.22));for(const x of[-.2,.2])for(const z of[-.2,.2])ch.add(mesh(new T.BoxGeometry(.06,.45,.06),Mt(0x8A6A4C),x,.22,z));ch.position.set(2.4+s*1.05,0,.4);ch.rotation.y=-s*Math.PI/2;room.add(ch)}
  SPOTS.table={pos:new V3(1.35,.45,.4),ry:Math.PI/2,anim:'eat',label:'餐桌',use:'eat'};
  // sofa
  const so=new T.Group();so.add(mesh(new T.BoxGeometry(2.2,.45,.9),Mt(0x8FB6A8),0,.25,0));so.add(mesh(new T.BoxGeometry(2.2,.6,.25),Mt(0x7FA698),0,.65,-.35));for(const s of[-1,1])so.add(mesh(new T.BoxGeometry(.25,.6,.9),Mt(0x7FA698),s*1.1,.4,0));
  so.add(mesh(new T.BoxGeometry(.45,.35,.15),Mt(0xF6C65B),-.6,.62,-.15));so.position.set(-.6,0,-2.7);room.add(so);SPOTS.sofa={pos:new V3(-.3,.48,-2.55),ry:0,anim:'sit',label:'沙發',use:'rest'};
  // bookshelf
  const bs=new T.Group();bs.add(mesh(new T.BoxGeometry(1.4,2.2,.45),Mt(0xA27A58),0,1.1,0));for(let r=0;r<3;r++)for(let i=0;i<6;i++)bs.add(mesh(new T.BoxGeometry(.16,.4+(i*7%3)*.06,.32),Mt([0xF5A3B5,0x9FCB7E,0x7E8FD6,0xF5D37A,0xC9A6E0][(i+r)%5]),-.5+i*.2,.45+r*.65,.06));
  bs.position.set(-4.15,0,1.4);bs.rotation.y=Math.PI/2;room.add(bs);SPOTS.books={pos:new V3(-3.3,0,1.4),ry:-Math.PI/2,anim:'read',label:'書櫃',use:'read'};
  // kitchen counter
  const kc=new T.Group();kc.add(mesh(new T.BoxGeometry(2.2,.95,.7),Mt(0xF4EEDF),0,.47,0));kc.add(mesh(new T.BoxGeometry(2.3,.08,.75),Mt(0xC9A27E),0,.98,0));kc.add(mesh(new T.CylinderGeometry(.22,.2,.22,8),Mt(0x6E7E8E),-.5,1.13,0));
  kc.add(mesh(new T.BoxGeometry(.5,.5,.4),Mt(0xBFE6F5),.6,1.25,-.1));kc.position.set(2.6,0,-3);room.add(kc);SPOTS.kitchen={pos:new V3(2.4,0,-2.3),ry:Math.PI,anim:'garden',label:'廚房',use:'cook'};
  // lamp + plant
  const lp=new T.Group();lp.add(mesh(new T.CylinderGeometry(.04,.04,1.6,5),Mt(0x6E5A48),0,.8,0));const shade=mesh(new T.ConeGeometry(.35,.4,8,1,true),new T.MeshStandardMaterial({color:0xFFE6A8,emissive:0xFFC56A,emissiveIntensity:.8,side:T.DoubleSide}),0,1.7,0);lp.add(shade);lp.position.set(-1.9,0,-2.9);room.add(lp);
  const pl=new T.Group();pl.add(mesh(new T.CylinderGeometry(.25,.2,.4,7),Mt(0xE3A07A),0,.2,0));for(let i=0;i<5;i++)pl.add(mesh(new T.ConeGeometry(.1,.7,4),Mt(0x6FAE6A),Math.cos(i)*.12,.7,Math.sin(i)*.12).rotateZ((i-2)*.25));pl.position.set(4,0,-2.9);room.add(pl);
  roomLight=new T.PointLight(0xFFDDAA,25,16,1.6);roomLight.position.set(0,3.2,0);room.add(roomLight);roomLight.visible=false;
  const fill=new T.HemisphereLight(0xFFF4E4,0xB09070,.9);fill.visible=false;room.add(fill);room.userData.fill=fill;
  room.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=false}});return room}
H.SPOTS=SPOTS;
H.enterView=function(){buildRoom();if(E.viewMode==='room')return;E.viewMode='room';H.saved=Object.assign({},E.rig.want);roomLight.visible=true;room.userData.fill.visible=true;
  Object.assign(E.rig.want,{tx:ROOM.x-.3,tz:ROOM.z-.4,dist:26,pitch:1.02,yaw:-.18});E.rig.follow=null;document.documentElement.classList.add('in-room');H.emit('room',true);E.kick()};
H.exitView=function(){if(E.viewMode!=='room')return;E.viewMode='island';roomLight.visible=false;room.userData.fill.visible=false;Object.assign(E.rig.want,H.saved||{});document.documentElement.classList.remove('in-room');
  for(const a of(window.Isle3DLife?.agents||new Map()).values())if(a.inside&&a.roomUse){a.roomUse=null}H.emit('room',false);E.kick()};
const ls=new Set();H.on=f=>ls.add(f);H.emit=(t,v)=>ls.forEach(f=>{try{f(t,v)}catch(_){}});
/* use a piece of furniture (from the interior view) */
H.use=function(id,spotKey){const L=window.Isle3DLife,a=L?.agent(id);if(!a)return;const sp=SPOTS[spotKey];if(!sp)return;
  if(!a.inside){a.inside=true;a.task={type:'inside',why:sp.use,t0:E.clock}}
  for(const b of L.agents.values())if(b!==a&&b.roomUse===spotKey&&spotKey!=='sofa')b.roomUse=null;a.roomUse=spotKey;a.roomT=0;
  const msg={sleep:'呼……晚安。',eat:'開動囉！',rest:'沙發好軟～',read:'來看本書吧。',cook:'來做點好吃的！'}[sp.use];window.Isle3DLife.say(a,msg,2.4);
  const n=a.nd;if(sp.use==='eat'){n.hunger=Math.min(1,n.hunger+.5);n.thirst=Math.min(1,n.thirst+.4);try{Econ.on('eat')}catch(_){}}if(sp.use==='rest')n.comfort=Math.min(1,n.comfort+.4);
  if(sp.use==='read')try{L30.gain(a,'read',4)}catch(_){}if(sp.use==='cook'){try{L30.gain(a,'cook',4)}catch(_){}n.fun=Math.min(1,n.fun+.2)}if(sp.use==='sleep'){n.sleep=Math.min(1,n.sleep+.3);a.s.fat=Math.max(0,a.s.fat-.3);if(a.health)a.health=Object.assign(a.health,{sev:Math.max(0,a.health.sev-.15)})}
  try{IsleLife.memo({id:a.id},`在家裡的${sp.label}${{sleep:'睡覺',eat:'吃飯',rest:'休息',read:'看書',cook:'做料理'}[sp.use]}`,{place:'家'})}catch(_){}};
H.spotAt=function(cx,cy){if(E.viewMode!=='room')return null;const r=E.rayFrom(cx,cy);let best=null,bd=1e9;for(const k in SPOTS){const p=SPOTS[k].pos.clone().add(ROOM);p.y+=.4;const d=r.ray.distanceToPoint(p);if(d<1.2&&d<bd){bd=d;best=k}}return best};

H.build=function(){const st=ST().home;if(st)setHouse(st);
  E.add({onTime:()=>winGlow(),update(dt){if(E.viewMode!=='room')return;const L=window.Isle3DLife;if(!L)return;let i=0;
    for(const a of L.agents.values()){if(!a.inside){a.root.visible=false;continue}a.root.visible=true;
      const key=a.roomUse||({sleep:'bed',eat:'table',shelter:'sofa',rest:'sofa'}[a.task?.why]||'sofa');const sp=SPOTS[key];
      const base=sp.pos.clone().add(ROOM);if(key==='sofa'||key==='table'&&i>0)base.x+=i*.7;a.root.position.copy(base);a.root.rotation.y=sp.ry;a.cat.play(sp.anim);i++}
    return true}})};
H.setHouse=setHouse;
window.Isle3DHouse=H;
})();
