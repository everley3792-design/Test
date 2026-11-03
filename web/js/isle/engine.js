/* ===== Isle3D 引擎：低多邊形 3D 小島（取代舊版 DOM 首頁舞台） =====
   Soft low-poly diorama inspired by cozy island life games (original assets, all
   generated in code). Renderer, camera rig (orbit / pinch / follow), sky with
   real-time day/night, sun + hemisphere light, cached shadow map, stylised water
   shader, clouds, weather particles, and a registry of per-frame updaters.
   Quality follows OCSPerf (pixel ratio, shadows, fps cap, ambient motion). */
(()=>{'use strict';
const T=window.THREE;if(!T){console.error('[Isle3D] three.js missing');return}
const V3=T.Vector3,C=c=>new T.Color(c);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),lerp=(a,b,t)=>a+(b-a)*t,smooth=t=>t*t*(3-2*t);

/* deterministic noise (no deps) */
function hash(x,y){let h=Math.sin(x*127.1+y*311.7)*43758.5453;return h-Math.floor(h)}
function vnoise(x,y){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=smooth(xf),v=smooth(yf);
  return lerp(lerp(hash(xi,yi),hash(xi+1,yi),u),lerp(hash(xi,yi+1),hash(xi+1,yi+1),u),v)}
const fbm=(x,y)=>vnoise(x,y)*.6+vnoise(x*2.1,y*2.1)*.3+vnoise(x*4.3,y*4.3)*.1;

const R=12.5;                       // island top radius
const rimR=a=>R*(1+.07*Math.sin(a*3+.6)+.05*Math.sin(a*5+2.1)+.03*Math.sin(a*9));
function heightAt(x,z){const d=Math.hypot(x,z),a=Math.atan2(z,x),rr=rimR(a);if(d>rr)return -9;
  const hill=Math.max(0,1-Math.hypot(x+3.5,z+6)/6.5)*1.15+Math.max(0,1-Math.hypot(x-6,z+4.5)/4)*.55;   // gentle hills at the back
  const edge=smooth(clamp((rr-d)/1.4,0,1));return (fbm(x*.18+5,z*.18)*.35+hill)*edge}

const E={T,R,heightAt,rimR,ready:false,updaters:new Set(),obstacles:[],clock:0,
  q:{pr:1.5,shadows:true,fps:60,ambient:true,weather:'full'},
  sky:{phase:'day',wx:'sunny'}};

/* ---------- renderer / scene ---------- */
E.init=function(host){if(E.ready)return E;E.host=host;
  const r=E.renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance',preserveDrawingBuffer:false});
  r.outputColorSpace=T.SRGBColorSpace;r.toneMapping=T.NoToneMapping;
  r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;r.shadowMap.autoUpdate=false;
  r.domElement.className='isle3d-canvas';host.prepend(r.domElement);
  const s=E.scene=new T.Scene();s.fog=new T.Fog(0xCFE6F2,55,150);
  const cam=E.camera=new T.PerspectiveCamera(30,1,.5,600);
  E.rig={yaw:-.42,pitch:.74,dist:42,tx:-1.2,tz:0.4,ty:0,vy:0,vp:0,want:{yaw:-.42,pitch:.74,dist:42,tx:-1.2,tz:0.4},follow:null};
  buildLights();buildSky();buildTerrain();buildWater();buildClouds();buildDistant();buildWeather();
  E.props=new T.Group();s.add(E.props);
  E.chars=new T.Group();s.add(E.chars);
  bindControls();E.resize();new ResizeObserver(()=>E.resize()).observe(host);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)E.kick()});
  E.ready=true;E.applyQuality();E.setTime();E.kick();setInterval(()=>E.setTime(),30000);return E};
E.resize=function(){const w=E.host.clientWidth||innerWidth,h=E.host.clientHeight||innerHeight;if(!w||!h)return;E.W=w;E.H=h;
  E.renderer.setPixelRatio(Math.min(devicePixelRatio||1,E.q.pr));E.renderer.setSize(w,h,false);E.camera.aspect=w/h;
  // portrait phones need a wider vertical field so the whole island fits
  E.camera.fov=w/h<.7?40:30;E.camera.updateProjectionMatrix();E.dirtyShadow=true;E.kick()};
E.applyQuality=function(){const c=window.OCSPerf?.cfg?.()||{},q=E.q;
  q.pr=c.render==='low'?1:c.render==='medium'?1.5:2;q.shadows=c.shadows!==false;q.fps=c.fps||60;q.ambient=c.ambient!==false;q.weather=c.weather||'full';
  if(E.renderer){E.renderer.shadowMap.enabled=q.shadows;E.sun.castShadow=q.shadows;E.renderer.setPixelRatio(Math.min(devicePixelRatio||1,q.pr));E.resize();
    E.scene.traverse(o=>{if(o.material&&o.material.needsUpdate!==undefined&&o.receiveShadow)o.material.needsUpdate=true});E.dirtyShadow=true}};

/* ---------- lights ---------- */
function buildLights(){const s=E.scene;
  E.hemi=new T.HemisphereLight(0xCFE8FF,0x8FB37A,1.0);s.add(E.hemi);
  const sun=E.sun=new T.DirectionalLight(0xFFF1D6,2.6);sun.position.set(-18,30,14);sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);const sc=sun.shadow.camera;sc.left=-20;sc.right=20;sc.top=20;sc.bottom=-20;sc.near=5;sc.far=90;sun.shadow.bias=-.0006;sun.shadow.normalBias=.03;sun.shadow.radius=3;
  s.add(sun);s.add(sun.target);
  E.fill=new T.DirectionalLight(0xB9D6FF,.35);E.fill.position.set(16,12,-14);s.add(E.fill)}

/* ---------- sky dome (gradient shader), sun/moon, stars ---------- */
function buildSky(){const g=new T.SphereGeometry(300,32,16);
  E.skyU={top:{value:C(0x8EC8F0)},mid:{value:C(0xCFE6F2)},bot:{value:C(0xF4EBDD)}};
  const m=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,fog:false,uniforms:E.skyU,
    vertexShader:'varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'uniform vec3 top;uniform vec3 mid;uniform vec3 bot;varying vec3 vP;void main(){float h=vP.y;vec3 c=h>0.?mix(mid,top,pow(smoothstep(0.,.65,h),.8)):mix(mid,bot,smoothstep(0.,-.25,h));gl_FragColor=vec4(c,1.);}'});
  E.skyMesh=new T.Mesh(g,m);E.skyMesh.renderOrder=-10;E.scene.add(E.skyMesh);
  const disc=(col,size)=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),gr=x.createRadialGradient(64,64,0,64,64,64);
    gr.addColorStop(0,col);gr.addColorStop(.32,col);gr.addColorStop(.36,'rgba(255,240,200,.45)');gr.addColorStop(1,'rgba(255,240,200,0)');x.fillStyle=gr;x.fillRect(0,0,128,128);
    const sp=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),depthWrite:false,fog:false,transparent:true}));sp.scale.set(size,size,1);return sp};
  E.sunDisc=disc('#FFF6D8',46);E.moonDisc=disc('#F4F1FF',30);E.scene.add(E.sunDisc,E.moonDisc);
  const sg=new T.BufferGeometry(),n=500,p=new Float32Array(n*3);for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,y=.15+Math.random()*.85,r=Math.sqrt(1-y*y);p.set([Math.cos(a)*r*280,y*280,Math.sin(a)*r*280],i*3)}
  sg.setAttribute('position',new T.BufferAttribute(p,3));E.stars=new T.Points(sg,new T.PointsMaterial({color:0xFFFFFF,size:1.6,sizeAttenuation:false,transparent:true,opacity:0,fog:false,depthWrite:false}));E.scene.add(E.stars)}

/* ---------- island terrain (flat-shaded, vertex coloured) ---------- */
function tri(pos,col,a,b,c,ca,cb,cc){pos.push(...a,...b,...c);col.push(ca.r,ca.g,ca.b,(cb||ca).r,(cb||ca).g,(cb||ca).b,(cc||ca).r,(cc||ca).g,(cc||ca).b)}
function buildTerrain(){const pos=[],col=[],N=72,RINGS=13;
  const g1=C(0x93CF5E),g2=C(0x84C452),g3=C(0xA9D96C),path=C(0xE2C995);
  const ring=k=>{const out=[];for(let i=0;i<N;i++){const a=(i+(k%2)*.5+(k<RINGS?(hash(i,k*3)-.5)*.35:0))/N*Math.PI*2,rr=rimR(a)*(k/RINGS)*(k===RINGS?1:1+(hash(i,k)-.5)*.06/(k||1));const x=Math.cos(a)*rr,z=Math.sin(a)*rr;out.push([x,heightAt(x*.999,z*.999)+(k===RINGS?-.02:0),z])}return out};
  const grassCol=(p)=>{const n=fbm(p[0]*.25,p[2]*.25);const onPath=pathDist(p[0],p[2])<.9;return onPath?path:(n>.62?g3:n<.4?g2:g1)};
  const center=[0,heightAt(0,0),0];const rs=[];for(let k=1;k<=RINGS;k++)rs.push(ring(k));
  for(let i=0;i<N;i++){const a=rs[0][i],b=rs[0][(i+1)%N];const m=[(a[0]+b[0]+center[0])/3,0,(a[2]+b[2]+center[2])/3];tri(pos,col,center,b,a,grassCol(m))}
  for(let k=0;k<RINGS-1;k++)for(let i=0;i<N;i++){const a=rs[k][i],b=rs[k][(i+1)%N],c=rs[k+1][i],d=rs[k+1][(i+1)%N];
    const m1=[(a[0]+b[0]+c[0])/3,0,(a[2]+b[2]+c[2])/3],m2=[(b[0]+d[0]+c[0])/3,0,(b[2]+d[2]+c[2])/3];tri(pos,col,a,b,c,grassCol(m1));tri(pos,col,b,d,c,grassCol(m2))}
  // cliffs + beach
  const rim=rs[RINGS-1],earth1=C(0xC9A984),earth2=C(0xAE8F6E),rock=C(0xB8B2A6),sand=C(0xF1DDB0),sand2=C(0xE6CC98),wet=C(0xC9B58C);
  const lip=rim.map((p,i)=>{const a=i/N*Math.PI*2;return[p[0]*1.012,p[1]-.25,p[2]*1.012]});
  const cliffB=rim.map((p,i)=>{const a=i/N*Math.PI*2,j=1.03+hash(i,3)*.03;return[p[0]*j,-1.05-hash(i,7)*.25,p[2]*j]});
  const beach=rim.map((p,i)=>{const a=i/N*Math.PI*2,south=Math.max(0,Math.sin(a)),j=1.1+south*.22+hash(i,5)*.04;return[p[0]*j,-1.12,p[2]*j]});
  const under=rim.map((p,i)=>[p[0]*1.5,-3.2,p[2]*1.5]);
  for(let i=0;i<N;i++){const j=(i+1)%N;tri(pos,col,rim[i],rim[j],lip[i],C(0x8DB65E));tri(pos,col,rim[j],lip[j],lip[i],C(0x8DB65E));
    const ec=hash(i,1)>.5?earth1:earth2,rc=hash(i,2)>.75?rock:ec;tri(pos,col,lip[i],lip[j],cliffB[i],rc);tri(pos,col,lip[j],cliffB[j],cliffB[i],ec);
    tri(pos,col,cliffB[i],cliffB[j],beach[i],hash(i,4)>.5?sand:sand2);tri(pos,col,cliffB[j],beach[j],beach[i],sand);
    tri(pos,col,beach[i],beach[j],under[i],wet);tri(pos,col,beach[j],under[j],under[i],wet)}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.computeVertexNormals();
  const m=new T.MeshStandardMaterial({vertexColors:true,flatShading:true,roughness:.95,metalness:0});
  E.terrain=new T.Mesh(g,m);E.terrain.receiveShadow=true;E.terrain.castShadow=false;E.scene.add(E.terrain)}
/* worn dirt path from the plaza to the dock (south-east) and around the plaza */
const PATH=[[-1,3],[1.2,4.6],[3.5,6.2],[6,7.6],[8.4,8.6]];
function pathDist(x,z){let d=1e9;for(let i=0;i<PATH.length-1;i++){const[a,b]=[PATH[i],PATH[i+1]],dx=b[0]-a[0],dz=b[1]-a[1],t=clamp(((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz),0,1);d=Math.min(d,Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t))}return d}
E.pathDist=pathDist;E.PATH=PATH;

/* ---------- water ---------- */
function buildWater(){const g=new T.PlaneGeometry(420,420,1,1);g.rotateX(-Math.PI/2);
  E.waterU={time:{value:0},shallow:{value:C(0x8FE0E6)},deep:{value:C(0x4FA6CF)},foam:{value:C(0xFFFFFF)},R:{value:R},fogColor:{value:C(0xCFE6F2)},fogNear:{value:55},fogFar:{value:150},night:{value:0}};
  const m=new T.ShaderMaterial({uniforms:E.waterU,transparent:true,
    vertexShader:'varying vec3 vW;varying float vD;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vec4 mv=viewMatrix*w;vD=-mv.z;gl_Position=projectionMatrix*mv;}',
    fragmentShader:`uniform float time;uniform vec3 shallow;uniform vec3 deep;uniform vec3 foam;uniform float R;uniform vec3 fogColor;uniform float fogNear;uniform float fogFar;uniform float night;varying vec3 vW;varying float vD;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
      void main(){float a=atan(vW.z,vW.x);float rim=R*(1.+.07*sin(a*3.+.6)+.05*sin(a*5.+2.1)+.03*sin(a*9.));float south=max(0.,sin(a));float shore=rim*(1.1+south*.22);
        float d=length(vW.xz)-shore;vec3 c=mix(shallow,deep,smoothstep(0.,16.,d));
        float rip=n(vW.xz*.35+vec2(time*.05,time*.03))*.6+n(vW.xz*.9-vec2(time*.08,0.))*.4;c+=vec3(.06)*smoothstep(.62,.9,rip);
        float f=smoothstep(1.1,0.,d)*(.55+.45*sin(d*5.-time*1.6));c=mix(c,foam,clamp(f,0.,1.)*.75*step(-.4,d));
        float glint=smoothstep(.93,.99,n(vW.xz*1.6+vec2(time*.2,-time*.12)));c+=glint*.25*(1.-night);
        c=mix(c,c*vec3(.45,.5,.8),night);
        float fog=smoothstep(fogNear,fogFar,vD);c=mix(c,fogColor,fog);gl_FragColor=vec4(c,mix(.9,1.,smoothstep(0.,6.,d)));}`});
  E.water=new T.Mesh(g,m);E.water.position.y=-1.0;E.water.renderOrder=1;E.scene.add(E.water)}

/* ---------- clouds, distant islands ---------- */
const MAT={};
E.mat=(hex,o={})=>{const k=hex+JSON.stringify(o);return MAT[k]||(MAT[k]=new T.MeshStandardMaterial(Object.assign({color:hex,flatShading:true,roughness:.9,metalness:0},o)))};
function buildClouds(){E.clouds=new T.Group();const mm=new T.MeshStandardMaterial({color:0xFFFFFF,flatShading:true,roughness:1,emissive:0x8090A0,emissiveIntensity:.25,transparent:true,opacity:.95});E.cloudMat=mm;
  for(let i=0;i<9;i++){const c=new T.Group();const n=3+Math.floor(Math.random()*3);for(let k=0;k<n;k++){const s=new T.Mesh(new T.IcosahedronGeometry(1.6+Math.random()*1.4,0),mm);s.position.set((k-n/2)*2.2,Math.random()*.8,Math.random()*1.4);s.scale.y=.7;c.add(s)}
    const a=Math.random()*Math.PI*2,r=35+Math.random()*45;c.position.set(Math.cos(a)*r,16+Math.random()*12,Math.sin(a)*r);c.userData={a,r,sp:.006+Math.random()*.01};c.scale.setScalar(1+Math.random()*.8);E.clouds.add(c)}
  E.scene.add(E.clouds)}
function buildDistant(){const g=new T.Group();const mk=(x,z,s,col)=>{const m=new T.Mesh(new T.IcosahedronGeometry(1,1),E.mat(col));m.scale.set(s*1.6,s*.55,s);m.position.set(x,-1.2,z);g.add(m);
    for(let i=0;i<3;i++){const t=new T.Mesh(new T.ConeGeometry(s*.12,s*.45,5),E.mat(0x7FAE7A));t.position.set(x+(i-1)*s*.35,s*.32-1,z+(hash(x,i)-.5)*s*.4);g.add(t)}};
  mk(-62,-70,10,0x9DBF92);mk(30,-95,16,0xA7C49A);mk(85,-40,9,0x9DBF92);mk(-95,10,12,0xA9C7A0);mk(70,60,7,0xA7C49A);E.scene.add(g)}

/* ---------- weather particles ---------- */
function buildWeather(){const n=1400,g=new T.BufferGeometry(),p=new Float32Array(n*3);for(let i=0;i<n;i++)p.set([(Math.random()-.5)*60,Math.random()*30,(Math.random()-.5)*60],i*3);
  g.setAttribute('position',new T.BufferAttribute(p,3));E.rain=new T.Points(g,new T.PointsMaterial({color:0xDDEBFF,size:.14,transparent:true,opacity:.7,depthWrite:false}));E.rain.visible=false;E.scene.add(E.rain)}

/* ---------- time of day & weather ---------- */
const PAL={dawn:{top:0x9BB6E8,mid:0xF4C9B8,bot:0xF8E3CC,sun:0xFFD2A8,si:1.6,hs:0xF0D0C8,hg:0x9AA07A,hi:.9,fog:0xF0D6CC,water:[0x9FD8E0,0x6E9ECF],exp:1},
  day:{top:0x6FB8EE,mid:0xC6E6F6,bot:0xF4EBDD,sun:0xFFEFD2,si:2.35,hs:0xCFE6FF,hg:0x9AB87A,hi:.95,fog:0xCFE6F2,water:[0x8FE0E6,0x4FA6CF],exp:1.05},
  dusk:{top:0x7E7CC8,mid:0xF2B9A6,bot:0xF8D8B8,sun:0xFFB27C,si:1.7,hs:0xE8C0C8,hg:0x8D8A6A,hi:.85,fog:0xEDC6B8,water:[0x9AC9D8,0x5A7FB8],exp:1},
  night:{top:0x1E2A55,mid:0x3D4A80,bot:0x5A5E8C,sun:0xAFC2FF,si:.55,hs:0x6A7AB8,hg:0x2E3A40,hi:.55,fog:0x2E3866,water:[0x3E6E90,0x1F3A62],exp:1.1}};
function phaseOf(h){return h>=5&&h<7.5?'dawn':h>=7.5&&h<17?'day':h>=17&&h<19.3?'dusk':'night'}
E.hourNow=()=>{const o=Cfg?.v?.isle3d?.timeOverride;if(Number.isFinite(o))return o;const d=new Date();return d.getHours()+d.getMinutes()/60};
E.weatherNow=()=>Cfg?.v?.isle3d?.weatherOverride||window.Env?.wid||'sunny';
E.setTime=function(){if(!E.ready)return;const h=E.hourNow(),ph=phaseOf(h),wx=E.weatherNow();E.sky.phase=ph;E.sky.hour=h;E.sky.wx=wx;const P=PAL[ph],grey=wx==='rain'||wx==='storm'?.55:wx==='cloudy'||wx==='snow'?.3:0;
  const mixG=hex=>{const c=C(hex);return grey?c.lerp(C(0xB7C0C8),grey):c};
  E.skyU.top.value.copy(mixG(P.top));E.skyU.mid.value.copy(mixG(P.mid));E.skyU.bot.value.copy(mixG(P.bot));
  E.sun.color.set(P.sun);E.sun.intensity=P.si*(1-grey*.55);E.hemi.color.set(P.hs);E.hemi.groundColor.set(P.hg);E.hemi.intensity=P.hi*(1+grey*.15);
  E.scene.fog.color.copy(mixG(P.fog));E.waterU.fogColor.value.copy(E.scene.fog.color);E.waterU.shallow.value.set(P.water[0]);E.waterU.deep.value.set(P.water[1]);E.waterU.night.value=ph==='night'?.35:0;
  
  // sun path: rises east (+x), sets west
  const t=clamp((h-6)/13,0,1),ang=Math.PI*t,sx=Math.cos(ang)*-1,sy=Math.sin(ang);
  const sunDir=ph==='night'?new V3(.3,.8,.4):new V3(sx*.85,Math.max(.28,sy),.45).normalize();E.sun.position.copy(sunDir.clone().multiplyScalar(40));
  E.sunDisc.position.copy(new V3(sx,Math.max(.05,sy)*.75+.05,.6).normalize().multiplyScalar(260));E.sunDisc.visible=ph!=='night'&&grey<.5;
  E.moonDisc.position.set(-120,170,-150);E.moonDisc.visible=ph==='night';E.stars.material.opacity=ph==='night'?(grey?.25:.9):ph==='dusk'?.15:0;
  E.cloudMat.color.set(ph==='night'?0x8A93B8:grey>.4?0xC8CDD4:0xFFFFFF);E.cloudMat.emissive.set(ph==='dusk'?0xC08070:ph==='night'?0x202840:0x8090A0);
  E.rain.visible=(wx==='rain'||wx==='storm'||wx==='snow')&&E.q.weather!=='off';E.rain.material.size=wx==='snow'?.32:.12;E.rain.material.color.set(wx==='snow'?0xFFFFFF:0xCFE0F5);E.rain.userData.snow=wx==='snow';
  E.night=ph==='night'?1:ph==='dusk'?.45:0;E.updaters.forEach(u=>u.onTime&&u.onTime(ph,wx));E.dirtyShadow=true;E.kick()};

/* ---------- camera rig + controls ---------- */
const ptrs=new Map();let gest=null;
E.onTap=null;E.onDragStart=null;   // set by interaction layer: return true to consume
function bindControls(){const el=E.renderer.domElement;el.style.touchAction='none';
  el.addEventListener('pointerdown',e=>{ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY,t:performance.now()});el.setPointerCapture(e.pointerId);
    if(ptrs.size===1){const consumed=E.onPointerDown&&E.onPointerDown(e);gest=consumed?{mode:'ext'}:{mode:'orbit',moved:false}}
    else if(ptrs.size===2){if(gest&&gest.mode==='ext'&&E.onPointerCancel)E.onPointerCancel();const[a,b]=[...ptrs.values()];gest={mode:'pinch',d0:Math.hypot(a.x-b.x,a.y-b.y),dist0:E.rig.want.dist,cx:(a.x+b.x)/2,cy:(a.y+b.y)/2}}E.kick()});
  el.addEventListener('pointermove',e=>{const p=ptrs.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
    if(!gest)return;if(gest.mode==='ext'){E.onPointerMove&&E.onPointerMove(e);return}
    if(gest.mode==='orbit'){if(Math.hypot(p.x-p.x0,p.y-p.y0)>6)gest.moved=true;if(!gest.moved)return;const w=E.rig.want;w.yaw-=dx*.0065;w.pitch=clamp(w.pitch+dy*.004,.55,1.12);E.rig.follow=null;E.kick()}
    else if(gest.mode==='pinch'&&ptrs.size===2){const[a,b]=[...ptrs.values()],d=Math.hypot(a.x-b.x,a.y-b.y),cx=(a.x+b.x)/2,cy=(a.y+b.y)/2;E.rig.want.dist=clamp(gest.dist0*gest.d0/Math.max(20,d),18,95);
      pan(cx-gest.cx,cy-gest.cy);gest.cx=cx;gest.cy=cy;E.kick()}});
  const up=e=>{const p=ptrs.get(e.pointerId);ptrs.delete(e.pointerId);if(!p||!gest)return;
    if(gest.mode==='ext'){E.onPointerUp&&E.onPointerUp(e);gest=null;return}
    if(gest.mode==='orbit'&&!gest.moved&&performance.now()-p.t<450&&E.onTap)E.onTap(e);if(!ptrs.size)gest=null;else if(gest.mode==='pinch')gest={mode:'orbit',moved:true}};
  el.addEventListener('pointerup',up);el.addEventListener('pointercancel',e=>{ptrs.delete(e.pointerId);if(gest&&gest.mode==='ext'&&E.onPointerCancel)E.onPointerCancel();gest=null});
  el.addEventListener('wheel',e=>{e.preventDefault();E.rig.want.dist=clamp(E.rig.want.dist*(1+Math.sign(e.deltaY)*.08),18,95);E.kick()},{passive:false});
  el.addEventListener('dblclick',()=>E.resetView())}
function pan(dx,dy){const w=E.rig.want,s=w.dist*.0016,cy=Math.cos(w.yaw),sy=Math.sin(w.yaw);w.tx=clamp(w.tx-(dx*cy+dy*sy)*s,-10,10);w.tz=clamp(w.tz-(-dx*sy+dy*cy)*s,-10,10);E.rig.follow=null}
E.resetView=()=>{Object.assign(E.rig.want,{yaw:-.42,pitch:.74,dist:42,tx:-1.2,tz:0.4});E.rig.follow=null;E.kick()};
E.focus=(pos,dist=26)=>{const w=E.rig.want;w.tx=pos.x;w.tz=pos.z;w.dist=dist;E.kick()};
function updateCamera(dt){const r=E.rig,w=r.want;if(r.follow){const p=r.follow.position;w.tx=lerp(w.tx,p.x,1-Math.exp(-dt*2.5));w.tz=lerp(w.tz,p.z,1-Math.exp(-dt*2.5))}
  const k=1-Math.exp(-dt*7);r.yaw=lerp(r.yaw,w.yaw,k);r.pitch=lerp(r.pitch,w.pitch,k);r.dist=lerp(r.dist,w.dist,k);r.tx=lerp(r.tx,w.tx,k);r.tz=lerp(r.tz,w.tz,k);
  const c=E.camera,cp=Math.cos(r.pitch),ty=heightAt(r.tx,r.tz)>-5?Math.max(0,heightAt(r.tx,r.tz))*.6:0;
  c.position.set(r.tx+Math.sin(r.yaw)*cp*r.dist,ty+Math.sin(r.pitch)*r.dist,r.tz+Math.cos(r.yaw)*cp*r.dist);c.lookAt(r.tx,ty+.6,r.tz);
  return Math.abs(r.yaw-w.yaw)+Math.abs(r.pitch-w.pitch)+Math.abs(r.dist-w.dist)+Math.abs(r.tx-w.tx)+Math.abs(r.tz-w.tz)>.001}

/* ---------- helpers for other modules ---------- */
const ray=new T.Raycaster(),ndc=new T.Vector2(),plane=new T.Plane(new V3(0,1,0),0);
E.rayFrom=(cx,cy)=>{const r=E.renderer.domElement.getBoundingClientRect();ndc.set((cx-r.left)/r.width*2-1,-(cy-r.top)/r.height*2+1);ray.setFromCamera(ndc,E.camera);return ray};
E.groundAt=(cx,cy)=>{const r=E.rayFrom(cx,cy),hit=new V3();if(!r.ray.intersectPlane(plane,hit))return null;for(let i=0;i<3;i++){plane.constant=-heightAt(hit.x,hit.z);r.ray.intersectPlane(plane,hit)}plane.constant=0;return hit};
E.inside=(x,z,m=.9)=>{const d=Math.hypot(x,z);return d<rimR(Math.atan2(z,x))-m};
E.blocked=(x,z,rad=.35)=>E.obstacles.some(o=>o.on!==false&&Math.hypot(x-o.x,z-o.z)<o.r+rad);
E.project=(v)=>{const p=v.clone().project(E.camera);return{x:(p.x+1)/2*E.W,y:(1-p.y)/2*E.H,z:p.z,vis:p.z<1&&p.z>-1}};
E.groundY=(x,z)=>Math.max(-1,heightAt(x,z));
E.add=u=>{E.updaters.add(u);return u};

/* ---------- main loop (fps-capped, pauses when hidden/off-screen) ---------- */
let raf=0,last=0,acc=0,idleFrames=0;E.active=true;
E.kick=()=>{idleFrames=0;if(!raf&&E.ready&&E.active&&!document.hidden){last=performance.now();raf=requestAnimationFrame(loop)}};
E.setActive=v=>{E.active=v;if(v)E.kick()};
function loop(t){raf=0;if(!E.active||document.hidden)return;const dt=Math.min(.1,(t-last)/1000);last=t;
  const minDt=1/Math.max(10,E.q.fps)-.002;acc+=dt;if(acc<minDt){raf=requestAnimationFrame(loop);return}const step=Math.min(.1,acc);acc=0;E.clock+=step;
  let moving=updateCamera(step);
  E.waterU.time.value=E.q.ambient?E.clock:0;
  if(E.q.ambient)E.clouds.children.forEach(c=>{const u=c.userData;u.a+=u.sp*step;c.position.x=Math.cos(u.a)*u.r;c.position.z=Math.sin(u.a)*u.r});
  if(E.rain.visible){const p=E.rain.geometry.attributes.position,a=p.array,sn=E.rain.userData.snow,cx=E.rig.tx,cz=E.rig.tz;for(let i=0;i<a.length;i+=3){a[i+1]-=step*(sn?2.2:22);if(sn)a[i]+=Math.sin(E.clock+i)*step*.4;if(a[i+1]<-1){a[i+1]=24+Math.random()*6;a[i]=cx+(Math.random()-.5)*60;a[i+2]=cz+(Math.random()-.5)*60}}p.needsUpdate=true}
  E.updaters.forEach(u=>{try{if(u.update&&u.update(step,E.clock))moving=true}catch(e){console.error(e)}});
  if(E.dirtyShadow&&E.q.shadows){E.renderer.shadowMap.needsUpdate=true;E.dirtyShadow=false}
  E.renderer.render(E.scene,E.camera);
  raf=requestAnimationFrame(loop)}
window.Isle3D=E;
})();
