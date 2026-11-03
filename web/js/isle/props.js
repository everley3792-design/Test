/* ===== Isle3D 場景物件：樹木、花草、岩石、步道、柵欄、碼頭、小船、路燈、長椅、營火、信箱 =====
   Low-poly, flat-shaded, built from primitives (no external models).
   Each interactive prop registers a POI (point of interest) the life sim can use. */
(()=>{'use strict';
const E=window.Isle3D;if(!E)return;const T=E.T,V3=T.Vector3,M=E.mat;
const rnd=(a,b)=>a+Math.random()*(b-a);
let seed=7;const sr=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
const POI=E.POI=[];
const mesh=(geo,mat,x=0,y=0,z=0,cast=true)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=true;return m};
const place=(obj,x,z,yo=0)=>{obj.position.set(x,E.groundY(x,z)+yo,z);E.props.add(obj);return obj};
const obstacle=(x,z,r,tag)=>{const o={x,z,r,tag};E.obstacles.push(o);return o};
const sway=[];   // things that move in the wind

/* trees — round canopy (like the reference) and conifers */
function roundTree(x,z,s=1,hue=0){const g=new T.Group(),trunk=M(0x9A7653),leaves=[M(hue?0xA8C85E:0x9CC75A),M(hue?0x8DB84E:0x84B54E),M(0xB8D86E)];
  g.add(mesh(new T.CylinderGeometry(.18*s,.28*s,1.8*s,6),trunk,0,.9*s,0));
  const top=new T.Group();top.position.y=1.7*s;g.add(top);
  [[0,1.15,0,1.25],[.75,.75,.25,.85],[-.7,.8,-.2,.9],[.1,.7,-.75,.8],[-.2,1.75,.1,.85]].forEach(([a,b,c,r],i)=>top.add(mesh(new T.IcosahedronGeometry(r*s,0),leaves[i%3],a*s,b*s,c*s)));
  place(g,x,z);g.rotation.y=sr()*6;obstacle(x,z,.55*s,'tree');sway.push({o:top,ph:sr()*6,a:.025});POI.push({id:'shade'+POI.length,type:'shade',x:x+.9*s,z:z+.9*s,label:'樹蔭'});return g}
function pineTree(x,z,s=1){const g=new T.Group();g.add(mesh(new T.CylinderGeometry(.12*s,.2*s,.9*s,5),M(0x8A6A4C),0,.45*s,0));
  const top=new T.Group();g.add(top);[[1.25,1.3,.9],[1,1.1,1.6],[.7,.9,2.2]].forEach(([r,h,y],i)=>top.add(mesh(new T.ConeGeometry(r*s,h*s,6),M(i%2?0x6FA66A:0x5E9A62),0,y*s,0)));
  place(g,x,z);obstacle(x,z,.5*s,'tree');sway.push({o:top,ph:sr()*6,a:.02});return g}
function bush(x,z,s=1,col=0x7FB35A,flowers){const g=new T.Group();[[0,.35,0,.55],[.4,.3,.15,.42],[-.38,.28,-.1,.45]].forEach(([a,b,c,r])=>g.add(mesh(new T.IcosahedronGeometry(r*s,0),M(col),a*s,b*s,c*s)));
  if(flowers)for(let i=0;i<6;i++){const a=sr()*6,r=.45*s;g.add(mesh(new T.OctahedronGeometry(.09*s,0),M(flowers,{emissive:flowers,emissiveIntensity:.08}),Math.cos(a)*r,.5*s+sr()*.25*s,Math.sin(a)*r,false))}
  place(g,x,z);obstacle(x,z,.45*s,'bush');return g}
function rock(x,z,s=1){const m=mesh(new T.DodecahedronGeometry(.5*s,0),M(sr()>.5?0xBDB7AB:0xA8A397));m.scale.set(1.2,.7,1);m.rotation.set(sr(),sr()*6,sr());place(m,x,z,.15*s);obstacle(x,z,.5*s,'rock');return m}

/* instanced flowers & grass tufts (thousands of tiny objects, one draw call each colour) */
function flowerField(spots){const cols=[0xF6B8C8,0xFFFFFF,0xFFE08A,0xB9A6E6,0x8FB6E8,0xF5A3B5],per=cols.map(()=>[]);
  spots.forEach(([cx,cz,rad,n])=>{for(let i=0;i<n;i++){const a=sr()*6.28,r=Math.sqrt(sr())*rad,x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;if(!E.inside(x,z,1.2)||E.blocked(x,z,.2))continue;per[Math.floor(sr()*cols.length)].push([x,z])}});
  const head=new T.IcosahedronGeometry(.11,0),stem=new T.CylinderGeometry(.015,.015,.28,3),dummy=new T.Object3D();
  const stems=new T.InstancedMesh(stem,M(0x6E9E52),per.flat().length);let si=0;
  per.forEach((list,ci)=>{if(!list.length)return;const im=new T.InstancedMesh(head,M(cols[ci],{emissive:cols[ci],emissiveIntensity:.06}),list.length);
    list.forEach(([x,z],i)=>{const y=E.groundY(x,z);dummy.position.set(x,y+.3,z);dummy.rotation.set(sr(),sr(),sr());dummy.scale.setScalar(.8+sr()*.6);dummy.updateMatrix();im.setMatrixAt(i,dummy.matrix);
      dummy.position.set(x,y+.14,z);dummy.rotation.set(0,0,(sr()-.5)*.3);dummy.scale.setScalar(1);dummy.updateMatrix();stems.setMatrixAt(si++,dummy.matrix)});
    im.castShadow=false;im.receiveShadow=true;E.props.add(im)});stems.count=si;E.props.add(stems)}
function grass(n){const g=new T.ConeGeometry(.07,.32,3),im=new T.InstancedMesh(g,M(0x76B048),n),d=new T.Object3D();let k=0;
  for(let i=0;i<n*3&&k<n;i++){const a=sr()*6.28,r=Math.sqrt(sr())*(E.R-1),x=Math.cos(a)*r,z=Math.sin(a)*r;if(E.pathDist(x,z)<1||E.blocked(x,z,.1))continue;
    for(let j=0;j<3&&k<n;j++){d.position.set(x+(sr()-.5)*.25,E.groundY(x,z)+.12,z+(sr()-.5)*.25);d.rotation.set((sr()-.5)*.5,sr()*6,(sr()-.5)*.5);d.scale.set(1,.7+sr()*.8,1);d.updateMatrix();im.setMatrixAt(k++,d.matrix)}}
  im.count=k;im.receiveShadow=true;E.props.add(im)}
function pathStones(){const g=new T.CylinderGeometry(.32,.36,.08,7),list=[];const P=E.PATH;
  for(let i=0;i<P.length-1;i++){const[a,b]=[P[i],P[i+1]],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.85);for(let k=0;k<n;k++){const t=k/n;list.push([a[0]+(b[0]-a[0])*t+(sr()-.5)*.3,a[1]+(b[1]-a[1])*t+(sr()-.5)*.3])}}
  const im=new T.InstancedMesh(g,M(0xD8D2C4),list.length),d=new T.Object3D();list.forEach(([x,z],i)=>{d.position.set(x,E.groundY(x,z)+.03,z);d.rotation.y=sr()*3;d.scale.set(.8+sr()*.5,1,.8+sr()*.4);d.updateMatrix();im.setMatrixAt(i,d.matrix)});im.receiveShadow=true;E.props.add(im)}

/* fences, dock, boat */
function fence(points){const post=new T.CylinderGeometry(.07,.08,.75,5),pm=M(0xA9825E);for(let i=0;i<points.length;i++){const[x,z]=points[i];place(mesh(post,pm),x,z,.37);
  if(i<points.length-1){const[x2,z2]=points[i+1],len=Math.hypot(x2-x,z2-z),mid=[(x+x2)/2,(z+z2)/2];for(const h of [.55,.3]){const rail=mesh(new T.BoxGeometry(len,.07,.05),M(0xB98E66));rail.rotation.y=-Math.atan2(z2-z,x2-x);place(rail,mid[0],mid[1],h)}
    obstacle(mid[0],mid[1],len/2*.6,'fence')}}}
function dock(){const g=new T.Group(),plank=M(0xB08A64),dark=M(0x8C6A4C),start=[8.2,8.4],dir=[.62,.78],len=7.5,w=2;
  for(let i=0;i<len/.42;i++){const p=mesh(new T.BoxGeometry(w,.12,.38),i%3?plank:M(0xA27E5A));p.position.set(0,0,i*.42);g.add(p)}
  for(let i=0;i<=3;i++)for(const s of [-1,1]){const post=mesh(new T.CylinderGeometry(.1,.12,1.8,6),dark);post.position.set(s*(w/2-.05),-.5,i*(len/3));g.add(post)}
  const lamp=lantern(0,0,true);lamp.position.set(w/2-.1,.06,len-.3);g.add(lamp);
  g.position.set(start[0],-.62,start[1]);g.rotation.y=Math.atan2(dir[0],dir[1]);E.props.add(g);
  const end=new V3(0,0,len-.6).applyAxisAngle(new V3(0,1,0),g.rotation.y).add(g.position);E.dockEnd=end;POI.push({id:'dock',type:'fish',x:end.x,z:end.z,y:-.5,label:'碼頭',ry:g.rotation.y});E.dockLine={a:new V3(start[0],0,start[1]),dir:new V3(dir[0],0,dir[1]).normalize(),len};
  // boat
  const b=new T.Group(),hull=M(0x9A7258);const shape=new T.Shape();shape.moveTo(-1.4,0);shape.quadraticCurveTo(0,-.55,1.4,0);shape.lineTo(1.6,.5);shape.lineTo(-1.6,.5);shape.closePath();
  const hg=new T.ExtrudeGeometry(shape,{depth:1.1,bevelEnabled:false});hg.translate(0,0,-.55);b.add(mesh(hg,hull));const seat=mesh(new T.BoxGeometry(.3,.08,1.05),M(0xC9A27E));seat.position.y=.32;b.add(seat);
  b.position.set(end.x+1.6,-1.15,end.z-1);b.rotation.y=.9;E.props.add(b);E.boat=b;sway.push({o:b,ph:1,a:.05,bob:true})}
function lantern(x,z,raw){const g=new T.Group();g.add(mesh(new T.CylinderGeometry(.05,.07,1.5,5),M(0x6E5A48),0,.75,0));const box=mesh(new T.BoxGeometry(.28,.34,.28),M(0x5E4E40),0,1.55,0);g.add(box);
  const glow=new T.Mesh(new T.BoxGeometry(.2,.24,.2),new T.MeshStandardMaterial({color:0xFFE6A8,emissive:0xFFC56A,emissiveIntensity:.2,flatShading:true}));glow.position.y=1.55;g.add(glow);E.lamps.push(glow);
  const sp=new T.Sprite(new T.SpriteMaterial({map:glowTex(),color:0xFFD27A,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:0}));sp.scale.set(2.2,2.2,1);sp.position.y=1.55;g.add(sp);E.glows.push(sp);
  if(!raw){place(g,x,z);obstacle(x,z,.2,'lamp')}return g}
let _glow=null;function glowTex(){if(_glow)return _glow;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,230,170,1)');g.addColorStop(1,'rgba(255,230,170,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return _glow=new T.CanvasTexture(c)}
E.glowTex=glowTex;E.lamps=[];E.glows=[];
function bench(x,z,ry){const g=new T.Group(),w=M(0xB08A64);g.add(mesh(new T.BoxGeometry(1.6,.1,.5),w,0,.45,0));g.add(mesh(new T.BoxGeometry(1.6,.45,.08),w,0,.75,-.22));
  for(const s of [-.65,.65])g.add(mesh(new T.BoxGeometry(.1,.45,.45),M(0x7E6048),s,.22,0));place(g,x,z);g.rotation.y=ry;obstacle(x,z,.6,'bench');
  POI.push({id:'bench',type:'sit',x:x+Math.sin(ry)*.75,z:z+Math.cos(ry)*.75,seat:new V3(x,E.groundY(x,z)+.5,z),ry,label:'長椅',cap:2});return g}
function campfire(x,z){const g=new T.Group();for(let i=0;i<7;i++){const a=i/7*6.28;g.add(mesh(new T.DodecahedronGeometry(.18,0),M(0xA8A397),Math.cos(a)*.55,.08,Math.sin(a)*.55))}
  for(let i=0;i<3;i++){const l=mesh(new T.CylinderGeometry(.07,.07,.9,5),M(0x7E5A3E));l.rotation.set(Math.PI/2.4,i*2.1,0);l.position.y=.18;g.add(l)}
  const fire=new T.Mesh(new T.ConeGeometry(.28,.7,5),new T.MeshBasicMaterial({color:0xFFB34D,transparent:true,opacity:.9}));fire.position.y=.45;g.add(fire);
  const inner=new T.Mesh(new T.ConeGeometry(.15,.45,5),new T.MeshBasicMaterial({color:0xFFF0A0}));inner.position.y=.38;g.add(inner);
  const sp=new T.Sprite(new T.SpriteMaterial({map:glowTex(),color:0xFFA040,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:.5}));sp.scale.set(3.4,3.4,1);sp.position.y=.6;g.add(sp);
  E.fire={fire,inner,sp,g};place(g,x,z);obstacle(x,z,.75,'fire');POI.push({id:'campfire',type:'campfire',x,z,r:1.5,label:'營火',cap:4});return g}
function mailbox(x,z){const g=new T.Group();g.add(mesh(new T.CylinderGeometry(.06,.06,.9,5),M(0x7E6048),0,.45,0));const b=mesh(new T.BoxGeometry(.32,.3,.5),M(0xE58C7A),0,1,0);g.add(b);
  const flag=mesh(new T.BoxGeometry(.03,.22,.12),M(0xF6C65B),.18,1.12,.1);g.add(flag);E.mailFlag=flag;place(g,x,z);obstacle(x,z,.3,'mail');POI.push({id:'mail',type:'mail',x:x+.6,z:z+.4,label:'信箱'});return g}
function lilies(){for(let i=0;i<9;i++){const a=.2+sr()*1.2,r=E.R*1.35+sr()*3,x=Math.cos(a)*r,z=Math.sin(a)*r;const p=mesh(new T.CylinderGeometry(.35+sr()*.2,.35,.04,8,1,false,0,5.6),M(0x78B85E),0,0,0,false);p.position.set(x,-.97,z);p.rotation.y=sr()*6;E.props.add(p);
  if(sr()>.6){const f=mesh(new T.OctahedronGeometry(.1,0),M(0xFFF0F4,{emissive:0xF6B8C8,emissiveIntensity:.15}),0,0,0,false);f.position.set(x,-.88,z);E.props.add(f)}}}
function reeds(cx,cz){for(let i=0;i<10;i++){const x=cx+(sr()-.5)*2,z=cz+(sr()-.5)*1.5,h=.8+sr()*.7;const r=mesh(new T.CylinderGeometry(.02,.03,h,3),M(0x8DAE5E),0,0,0,false);r.position.set(x,-1+h/2,z);r.rotation.z=(sr()-.5)*.3;E.props.add(r);
  if(sr()>.4){const c=mesh(new T.CylinderGeometry(.05,.05,.25,5),M(0x8A6046),0,0,0,false);c.position.set(x,-1+h,z);E.props.add(c)}sway.push({o:r,ph:sr()*6,a:.04})}}
function garden(x,z){const g=new T.Group();g.add(mesh(new T.BoxGeometry(2.4,.22,1.3),M(0x9A7258),0,.11,0));g.add(mesh(new T.BoxGeometry(2.2,.08,1.1),M(0x6E5240),0,.22,0,false));
  for(let i=0;i<8;i++){const fx=(i%4-1.5)*.5,fz=(Math.floor(i/4)-.5)*.5;g.add(mesh(new T.CylinderGeometry(.015,.015,.3,3),M(0x6E9E52),fx,.38,fz,false));g.add(mesh(new T.IcosahedronGeometry(.1,0),M([0xF6B8C8,0xFFE08A,0xB9A6E6,0xFFFFFF][i%4]),fx,.55,fz,false))}
  place(g,x,z);obstacle(x,z,1,'garden');POI.push({id:'garden',type:'garden',x:x,z:z+1.05,label:'花圃'});return g}
function signpost(x,z){const g=new T.Group();g.add(mesh(new T.CylinderGeometry(.06,.07,1.2,5),M(0x8A6A4C),0,.6,0));const b=mesh(new T.BoxGeometry(.9,.32,.06),M(0xC9A27E),.2,1.05,0);g.add(b);place(g,x,z);g.rotation.y=-.6;obstacle(x,z,.2,'sign');return g}

E.buildProps=function(){seed=7;
  // the plaza / house lot stays open: house.js places the player's home there
  roundTree(-8.5,-4,1.25);roundTree(-6.2,-7.6,1.1,1);roundTree(5.8,-8.2,1.35);roundTree(9.2,-3.4,1.05,1);roundTree(-10.2,2.2,.95);
  pineTree(-3.4,-9.6,1.1);pineTree(2,-10.2,1.25);pineTree(-9.6,-1,.9);pineTree(10.4,1.6,.95);
  bush(-5.4,-3.6,1,0x84B54E,0xF6B8C8);bush(7.5,-5.2,1.1,0x7FB35A,0xFFFFFF);bush(-9.6,5.6,.9,0x8DBF5A,0xB9A6E6);bush(4.2,9.6,.9,0x84B54E,0xFFE08A);bush(-2.6,9.8,1,0x7FB35A);
  rock(-7.4,8,1.1);rock(9.8,5.4,1.3);rock(-11,-2.4,.9);rock(3.4,-6.2,.7);rock(10.8,-1,.8);
  fence([[-11.2,0.5],[-10.4,3.4],[-9,5.6]]);fence([[6.4,-10.2],[8.8,-8.6],[10.4,-6.4]]);
  dock();lantern(1.6,5.4);lantern(-4.2,2.8);lantern(6.4,7.2);
  bench(-6.2,4.6,.9);campfire(2.6,1.8);mailbox(-2.6,4.2);garden(-7.6,-0.6);signpost(5,5.2);
  lilies();reeds(12.6,6.4);reeds(-12.5,6.2);
  flowerField([[-8,7,2.4,70],[8.6,-1.6,2,50],[-4.4,-6.4,2.2,55],[4.5,8.4,1.6,35],[-11,-5,1.5,30],[0,-8.4,2,40],[10.6,3.6,1.4,25]]);
  grass(380);pathStones();
  POI.push({id:'hill',type:'stargaze',x:-3.5,z:-6,label:'山丘'},{id:'beach',type:'beach',x:-2,z:12.4,label:'沙灘'},{id:'plaza',type:'plaza',x:1,z:1.8+2.2,label:'廣場'});
  E.add({update(dt,t){if(E.q.ambient){const wind=(E.sky.wx==='storm'?2.4:E.sky.wx==='rain'?1.5:1);for(const s of sway){if(s.bob){s.o.position.y=-1.15+Math.sin(t*1.3+s.ph)*.05;s.o.rotation.z=Math.sin(t*.9+s.ph)*s.a}else{s.o.rotation.z=Math.sin(t*1.1+s.ph)*s.a*wind;s.o.rotation.x=Math.cos(t*.8+s.ph)*s.a*.6*wind}}}
      if(E.fire){const f=1+Math.sin(t*13)*.08+Math.sin(t*7.3)*.06;E.fire.fire.scale.set(f,1+Math.sin(t*9)*.15,f);E.fire.inner.scale.y=1+Math.sin(t*11)*.2;E.fire.sp.material.opacity=.35+E.night*.45+Math.sin(t*8)*.05}},
    onTime(ph){const on=ph==='night'||ph==='dusk';E.lamps.forEach(l=>l.material.emissiveIntensity=on?1.6:.15);E.glows.forEach(g=>g.material.opacity=ph==='night'?.75:ph==='dusk'?.35:0)}});
  E.dirtyShadow=true};
})();
