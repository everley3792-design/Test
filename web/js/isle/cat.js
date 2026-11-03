/* ===== Isle3D 角色：低多邊形貓咪（捏臉 × 服飾 × 骨架動畫） =====
   Built from primitives, flat-shaded like the reference sheet: big faceted head,
   pointed ears, painted face (eyes / brows / mouth / cheeks / markings drawn into
   the head texture), tiny body + outfit, stubby legs, segmented tail.
   Animation: joint targets per action blended smoothly every frame, with
   additive breathing, blinking, ear twitches and tail sway that never stop
   (except while sleeping). Walk cycle is distance-driven so feet don't slide. */
(()=>{'use strict';
const E=window.Isle3D;if(!E)return;const T=E.T,V3=T.Vector3;
const lerp=(a,b,t)=>a+(b-a)*t,clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const toHex=c=>new T.Color(c).getHexString();
const shade=(hex,k)=>{const c=new T.Color(hex);c.offsetHSL(0,0,k);return c};
const mat=(c,o={})=>new T.MeshStandardMaterial(Object.assign({color:c,emissive:c,emissiveIntensity:.24,flatShading:true,roughness:.8,metalness:0},o));
const M=(g,m,x=0,y=0,z=0)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=false;return o};

/* ---------- face texture (painted on the faceted head, like the reference) ---------- */
const FW=512,FH=256,U0=.75;            // u=.75 is the front of an Icosahedron's UV map
function faceCanvas(){const c=document.createElement('canvas');c.width=FW;c.height=FH;return c}
function drawFace(cv,look,ex){const x=cv.getContext('2d'),L=look,body='#'+toHex(L.body),acc='#'+toHex(L.accent);
  const cx=U0*FW,cy=FH*.5,S=FW/(Math.PI*2)*1.05;   // px per radian around the head
  x.fillStyle=body;x.fillRect(0,0,FW,FH);
  // markings
  const dark='#'+shade(L.body,-.22).getHexString(),light='#'+shade(L.body,.12).getHexString();
  const P=L.pattern;
  if(P==='cap'){x.fillStyle=acc;x.beginPath();x.ellipse(cx,cy-S*.95,S*.9,S*.55,0,0,7);x.fill()}
  if(P==='mask'){x.fillStyle=dark;x.beginPath();x.ellipse(cx-S*.35,cy-S*.08,S*.32,S*.26,0,0,7);x.ellipse(cx+S*.35,cy-S*.08,S*.32,S*.26,0,0,7);x.fill()}
  if(P==='patch'){x.fillStyle=dark;x.beginPath();x.ellipse(cx+S*.42,cy-S*.2,S*.42,S*.38,.3,0,7);x.fill()}
  if(P==='tabby'){x.strokeStyle=dark;x.lineWidth=7;x.lineCap='round';for(const k of[-1,0,1]){x.beginPath();x.moveTo(cx+k*S*.18,cy-S*.95);x.lineTo(cx+k*S*.14,cy-S*.62);x.stroke()}
    for(const s of[-1,1])for(const k of[0,1]){x.beginPath();x.moveTo(cx+s*S*(.9+k*.12),cy-S*(.05-k*.14));x.lineTo(cx+s*S*(.62+k*.08),cy-S*(.02-k*.1));x.stroke()}}
  if(P==='calico'){x.fillStyle='#E9A86A';x.beginPath();x.ellipse(cx-S*.55,cy-S*.5,S*.45,S*.4,.4,0,7);x.fill();x.fillStyle='#5E4E4A';x.beginPath();x.ellipse(cx+S*.6,cy-S*.62,S*.35,S*.3,-.3,0,7);x.fill()}
  // muzzle highlight
  x.fillStyle=light;x.globalAlpha=.55;x.beginPath();x.ellipse(cx,cy+S*.26,S*.36,S*.22,0,0,7);x.fill();x.globalAlpha=1;
  const ey=cy-S*(.0+(L.eyeY||0)*.012),sp=S*.33*(L.eyeSpace||100)/100,es=S*.19*(L.eyeSize||100)/100,iris='#'+shade(L.accent,-.28).getHexString();
  const e=ex||{};const closed=e.blink||e.eyes==='closed'||e.eyes==='sleep',happy=e.eyes==='happy',sad=e.eyes==='sad',angry=e.eyes==='angry',wow=e.eyes==='wow',dizzy=e.eyes==='dizzy';
  x.lineCap='round';x.lineJoin='round';
  for(const s of[-1,1]){const ex_=cx+s*sp;
    if(dizzy){x.strokeStyle='#5B4F6E';x.lineWidth=5;x.beginPath();for(let a=0;a<12;a+=.3)x.lineTo(ex_+Math.cos(a)*a*1.5,ey+Math.sin(a)*a*1.5);x.stroke();continue}
    if(closed||happy){x.strokeStyle='#4E4260';x.lineWidth=7;x.beginPath();if(happy)x.arc(ex_,ey+es*.35,es*.75,Math.PI*1.12,Math.PI*1.88);else x.arc(ex_,ey-es*.25,es*.75,Math.PI*.15,Math.PI*.85);x.stroke();continue}
    const kind=L.eye,ry=kind==='sleepy'||kind==='droop'?es*.72:kind==='bean'?es*.85:es*1.05,rx=kind==='bean'?es*.62:es*.82;
    x.fillStyle=iris;x.beginPath();x.ellipse(ex_,ey+(wow?-2:0),rx*(wow?1.08:1),ry*(wow?1.15:1),0,0,7);x.fill();
    if(kind!=='bean'){x.fillStyle='#2E2638';x.beginPath();x.ellipse(ex_,ey+ry*.12,rx*.55,ry*.62,0,0,7);x.fill()}
    x.fillStyle='#FFFFFF';x.beginPath();x.ellipse(ex_-rx*.32*s,ey-ry*.38,rx*.3,ry*.28,0,0,7);x.fill();x.beginPath();x.arc(ex_+rx*.3,ey+ry*.35,rx*.13,0,7);x.fill();
    if(kind==='spark'){x.fillStyle='#FFFFFF';star(x,ex_+rx*.1,ey,rx*.32)}
    if(kind==='sleepy'||kind==='droop'||sad){x.fillStyle=body;x.beginPath();x.ellipse(ex_,ey-ry*(sad?.62:.72),rx*1.25,ry*.55,s*(sad?-.35:0),0,7);x.fill();x.strokeStyle='#4E4260';x.lineWidth=4;x.beginPath();x.ellipse(ex_,ey-ry*(sad?.62:.72),rx*1.18,ry*.5,s*(sad?-.35:0),0,Math.PI);x.stroke()}
    if(angry){x.fillStyle=body;x.beginPath();x.moveTo(ex_-rx*1.3,ey-ry*1.3);x.lineTo(ex_+rx*1.3,ey-ry*1.3);x.lineTo(ex_+s*rx*1.3,ey-ry*.2);x.closePath();x.fill()}}
  // brows
  const bw=L.brow;if(bw&&bw!=='none'||angry||sad){x.strokeStyle='#6A5A6E';x.lineWidth=5;for(const s of[-1,1]){const bx=cx+s*sp,by=ey-es*1.55;x.beginPath();
    if(angry){x.moveTo(bx-s*es*.8,by-6);x.lineTo(bx+s*es*.7,by+6)}else if(sad||bw==='sad'){x.moveTo(bx-s*es*.8,by+5);x.lineTo(bx+s*es*.7,by-5)}
    else if(bw==='flat'){x.moveTo(bx-es*.7,by);x.lineTo(bx+es*.7,by)}else if(bw==='arched'){x.moveTo(bx-es*.8,by+3);x.quadraticCurveTo(bx,by-9,bx+es*.8,by+3)}else{x.moveTo(bx-es*.7,by+2);x.quadraticCurveTo(bx,by-5,bx+es*.7,by+2)}x.stroke()}}
  // cheeks
  const ck=L.cheekStyle,ca=(L.cheeks??35)/100,chy=ey+es*1.05,chx=sp*1.12;
  if(e.blush||ck==='blush'){x.fillStyle='rgba(240,140,150,'+(.25+ca*.5+(e.blush?.25:0))+')';for(const s of[-1,1]){x.beginPath();x.ellipse(cx+s*chx,chy,es*.7,es*.38,0,0,7);x.fill()}}
  if(ck==='stripes'){x.strokeStyle='rgba(230,120,130,.8)';x.lineWidth=3;for(const s of[-1,1])for(let k=0;k<3;k++){x.beginPath();x.moveTo(cx+s*chx-8+k*7,chy+6);x.lineTo(cx+s*chx-3+k*7,chy-6);x.stroke()}}
  if(ck==='heart'){x.fillStyle='rgba(240,120,140,.85)';for(const s of[-1,1])heart(x,cx+s*chx,chy,9)}
  if(ck==='spark'){x.fillStyle='#F6C65B';for(const s of[-1,1])star(x,cx+s*chx,chy,9)}
  if(ck==='paw'){x.fillStyle='rgba(240,140,150,.8)';for(const s of[-1,1]){const px=cx+s*chx;x.beginPath();x.arc(px,chy+2,5,0,7);x.arc(px-6,chy-5,2.5,0,7);x.arc(px,chy-7,2.5,0,7);x.arc(px+6,chy-5,2.5,0,7);x.fill()}}
  if(e.sick){x.strokeStyle='rgba(110,140,220,.65)';x.lineWidth=3;for(let k=0;k<4;k++){x.beginPath();x.moveTo(cx-S*.4+k*S*.27,cy-S*.62);x.lineTo(cx-S*.42+k*S*.27,cy-S*.38);x.stroke()}}
  // mouth
  const my=cy+S*(.22+(L.mouthY||0)*.012);x.strokeStyle='#5B4F6E';x.fillStyle='#E07E8A';x.lineWidth=4.5;const m=e.mouth||L.mouth;x.beginPath();
  if(e.talk){x.ellipse(cx,my+3,7,6+Math.sin(performance.now()/60)*3,0,0,7);x.fill();x.stroke()}
  else if(m==='open'||e.mouth==='open'){x.ellipse(cx,my+3,6,8,0,0,7);x.fill();x.stroke()}
  else if(e.mouth==='frown'){x.arc(cx,my+10,9,Math.PI*1.2,Math.PI*1.8);x.stroke()}
  else if(e.mouth==='grin'||m==='smile'){x.arc(cx,my-2,10,Math.PI*.15,Math.PI*.85);x.stroke()}
  else if(m==='w'){x.moveTo(cx-12,my);x.quadraticCurveTo(cx-6,my+9,cx,my+1);x.quadraticCurveTo(cx+6,my+9,cx+12,my);x.stroke()}
  else if(m==='tiny'){x.arc(cx,my+2,2.5,0,7);x.fill()}
  else{x.moveTo(cx-7,my+5);x.lineTo(cx,my-1);x.lineTo(cx+7,my+5);x.stroke()}
  if(e.anger){x.strokeStyle='#E05A6A';x.lineWidth=4;const ax=cx+S*.55,ay=cy-S*.65;x.beginPath();x.moveTo(ax-8,ay-3);x.lineTo(ax-2,ay-3);x.lineTo(ax-2,ay-9);x.moveTo(ax+8,ay-3);x.lineTo(ax+2,ay-3);x.lineTo(ax+2,ay-9);x.moveTo(ax-8,ay+3);x.lineTo(ax-2,ay+3);x.lineTo(ax-2,ay+9);x.moveTo(ax+8,ay+3);x.lineTo(ax+2,ay+3);x.lineTo(ax+2,ay+9);x.stroke()}
  if(e.tear){x.fillStyle='#8FD0EE';for(const s of[-1,1]){x.beginPath();x.ellipse(cx+s*sp,ey+es*1.3,4,7,0,0,7);x.fill()}}}
function star(x,cx,cy,r){x.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rr=i%2?r*.45:r;x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}x.closePath();x.fill()}
function heart(x,cx,cy,r){x.beginPath();x.moveTo(cx,cy+r*.8);x.bezierCurveTo(cx-r*1.4,cy-r*.2,cx-r*.6,cy-r*1.2,cx,cy-r*.4);x.bezierCurveTo(cx+r*.6,cy-r*1.2,cx+r*1.4,cy-r*.2,cx,cy+r*.8);x.fill()}
E.drawStar=star;E.drawHeart=heart;

/* ---------- body parts ---------- */
function earGeo(kind){const h=kind==='wide'?.34:kind==='soft'?.3:kind==='tuft'?.42:.4,r=kind==='wide'?.22:.18;const g=new T.ConeGeometry(r,h,4,1);g.translate(0,h/2,0);return g}
function tailParts(kind,colB,colA){const segs=[],n=kind==='fluffy'?5:6;let r=kind==='fluffy'?.11:.07;for(let i=0;i<n;i++){const len=kind==='straight'?.2:.17;const g=new T.Group();
    const m=kind==='fluffy'?M(new T.IcosahedronGeometry(r*1.5,0),colB):M(new T.CylinderGeometry(r*.8,r,len+.02,5),colB);m.position.y=len/2;m.rotation.y=i;g.add(m);
    if(i===n-1&&kind==='fluffy'){const tip=M(new T.IcosahedronGeometry(r*1.35,0),mat(0xFFFFFF));tip.position.y=len;g.add(tip)}
    g.userData.len=len;segs.push(g);if(kind!=='fluffy')r*=.93;else r*=1.02}
  for(let i=1;i<n;i++){segs[i].position.y=segs[i-1].userData.len;segs[i-1].add(segs[i])}return segs}

/* outfit / accessories (presets from the reference sheet + editor options) */
function outfit(c,L){const A=L.acc,acc=L.accent,g={};
  const add=(par,o)=>{par.add(o);return o};
  if(A==='starlet'){ // lilac cape with star brooch, ribbon + star on ear
    const cape=new T.Mesh(new T.ConeGeometry(.42,.5,7,1,true,Math.PI*.25,Math.PI*1.5),mat(acc,{side:T.DoubleSide}));cape.position.set(0,.6,-.02);cape.rotation.y=Math.PI;add(c.hips,cape);
    add(c.hips,M(new T.OctahedronGeometry(.08,0),mat(0xF6C65B,{emissive:0xF6C65B,emissiveIntensity:.25}),0,.8,.22)).scale.set(1,1,.4);
    const st=M(new T.OctahedronGeometry(.13,0),mat(0xF6C65B,{emissive:0xF6C65B,emissiveIntensity:.35}));st.position.set(.36,.36,.14);st.scale.set(1,1,.45);add(c.head,st);
    bow(c.head,-.36,.32,.12,acc,1.2);add(c.head,M(new T.OctahedronGeometry(.05,0),mat(0x9C8CE0)).translateX(-.36).translateY(-.05).translateZ(.1))}
  else if(A==='leafy'){ // green hood with sprout, cream bow, satchel
    const hood=new T.Mesh(new T.SphereGeometry(.64,16,10,Math.PI*.82,Math.PI*1.36,0,Math.PI*.66),mat(acc,{side:T.DoubleSide}));hood.scale.set(1.1,.95,1.02);hood.position.set(0,.02,-.04);hood.rotation.x=-.12;add(c.head,hood);
    const sprout=new T.Group();sprout.position.set(0,.6,0);add(c.head,sprout);add(sprout,M(new T.CylinderGeometry(.015,.02,.16,4),mat(0x6E9E52),0,.08,0));
    for(const s of[-1,1]){const lf=M(new T.SphereGeometry(.08,5,3),mat(0x86BC5A));lf.scale.set(1.6,.35,1);lf.position.set(s*.1,.17,0);lf.rotation.z=s*.4;add(sprout,lf)}c.sprout=sprout;
    flower(c.head,.32,.4,.28);bow(c.hips,0,.82,.2,0xFFF6E8,.6);
    const bag=M(new T.BoxGeometry(.18,.16,.08),mat(0x9A6E52));bag.position.set(.26,.42,.1);add(c.hips,bag);
    const cape=new T.Mesh(new T.ConeGeometry(.4,.45,7,1,true),mat(shade(acc,-.04),{side:T.DoubleSide}));cape.position.set(0,.58,-.03);add(c.hips,cape)}
  else if(A==='snoozy'){ // beanie with pompom + pink scarf + coat
    const cap=new T.Mesh(new T.SphereGeometry(.6,16,8,0,Math.PI*2,0,Math.PI*.4),mat(acc));cap.scale.set(1.1,1,1.04);cap.position.y=.08;cap.rotation.x=-.12;add(c.head,cap);
    {const rim=M(new T.TorusGeometry(.52,.08,5,16),mat(shade(acc,-.06)));rim.rotation.x=Math.PI/2;rim.position.y=.18;cap.add(rim)}
    add(cap,M(new T.IcosahedronGeometry(.15,1),mat(0xFFF6EE),.22,.6,0));
    const sc=M(new T.TorusGeometry(.2,.075,5,10),mat(0xE8A9BE));sc.rotation.x=Math.PI/2;sc.position.y=.84;add(c.hips,sc);
    const tail=M(new T.BoxGeometry(.12,.28,.06),mat(0xE8A9BE));tail.position.set(.12,.68,.18);tail.rotation.z=.2;add(c.hips,tail)}
  else if(A&&A!=='none')smallAcc(c,A,acc);
  if(L.smallAcc&&L.smallAcc!=='none')smallAcc(c,L.smallAcc,acc);
  return g}
function bow(par,x,y,z,col,s=1){const g=new T.Group();g.position.set(x,y,z);g.scale.setScalar(s);for(const k of[-1,1]){const w=M(new T.ConeGeometry(.08,.14,4),mat(col));w.rotation.z=k*Math.PI/2;w.position.x=k*.07;g.add(w)}g.add(M(new T.IcosahedronGeometry(.035,0),mat(col)));par.add(g);return g}
function flower(par,x,y,z){const g=new T.Group();g.position.set(x,y,z);for(let i=0;i<5;i++){const p=M(new T.SphereGeometry(.05,5,3),mat(0xFFFFFF));const a=i/5*6.28;p.position.set(Math.cos(a)*.06,Math.sin(a)*.06,0);p.scale.set(1,1,.4);g.add(p)}g.add(M(new T.IcosahedronGeometry(.035,0),mat(0xF6C65B)));par.add(g);return g}
function smallAcc(c,A,acc){const h=c.head,b=c.hips;
  if(A==='collar'||A==='bell'){const t=M(new T.TorusGeometry(.19,.035,4,10),mat(acc));t.rotation.x=Math.PI/2;t.position.y=.84;b.add(t);if(A==='bell')b.add(M(new T.IcosahedronGeometry(.055,0),mat(0xF6C65B,{metalness:.3}),0,.8,.2))}
  else if(A==='bandana'||A==='kerchief'){const t=M(new T.ConeGeometry(.16,.22,3),mat(acc));if(A==='bandana'){t.rotation.x=Math.PI;t.position.set(0,.74,.17);b.add(t)}else{t.position.set(0,.5,0);t.scale.set(2.2,1,2.2);h.add(t)}}
  else if(A==='leaf'||A==='flower'){if(A==='flower')flower(h,.32,.34,.22);else{const l=M(new T.SphereGeometry(.09,5,3),mat(0x86BC5A));l.scale.set(1.6,.35,1);l.position.set(0,.55,0);h.add(l)}}
  else if(A==='glasses'){for(const s of[-1,1]){const r=M(new T.TorusGeometry(.085,.012,4,12),mat(0x6A5A6E));r.position.set(s*.16,0,.47);h.add(r)}}
  else if(A==='crescent'){const t=M(new T.TorusGeometry(.09,.03,4,10,Math.PI*1.3),mat(0xF6C65B,{emissive:0xF6C65B,emissiveIntensity:.3}));t.position.set(-.3,.34,.18);h.add(t)}
  else if(A==='ribbon')bow(h,.3,.3,.15,acc);
  else if(A==='crown'){const cr=new T.Mesh(new T.CylinderGeometry(.15,.15,.12,6,1,true),mat(0xF6C65B,{side:T.DoubleSide,emissive:0xF6C65B,emissiveIntensity:.2}));cr.position.y=.5;h.add(cr)}
  else if(A==='pom'){const p=M(new T.SphereGeometry(.5,9,6,0,Math.PI*2,0,Math.PI*.4),mat(acc));p.scale.set(1.1,1,1.05);p.position.y=.08;h.add(p);p.add(M(new T.IcosahedronGeometry(.11,0),mat(0xFFFFFF),0,.5,0))}
  else if(A==='satchel')b.add(M(new T.BoxGeometry(.18,.16,.08),mat(0x9A6E52),.26,.42,.1))}

/* ---------- character ---------- */
const BLOB=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(40,60,50,.42)');g.addColorStop(1,'rgba(40,60,50,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new T.CanvasTexture(c)})();
class Cat{
  constructor(ch){this.ch=ch;this.id=ch.id;this.root=new T.Group();this.root.userData.cat=this;this.pose={};this.cur={};this.act='idle';this.t=0;this.walkPh=0;this.speed=0;this.face={};this.faceDirty=true;this.blinkT=1+Math.random()*3;this.twitchT=2;this.lookT=2;this.lookYaw=0;this.lookPitch=0;this.fx=[];
    const sh=new T.Mesh(new T.PlaneGeometry(1.2,1.2),new T.MeshBasicMaterial({map:BLOB,transparent:true,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.02;sh.renderOrder=2;this.shadow=sh;this.root.add(sh);
    this.build()}
  build(){const ch=this.ch;if(this.rig)this.root.remove(this.rig);const rig=this.rig=new T.Group();this.root.add(rig);this.sprite=null;
    if(ch.url){ // imported 2D art: soft billboard that still breathes, hops and walks
      const tex=new T.TextureLoader().load(ch.url,()=>E.kick());tex.colorSpace=T.SRGBColorSpace;const asp=(ch.w||1)/(ch.h||1),h=1.6*(ch.scale||1);
      const sp=new T.Sprite(new T.SpriteMaterial({map:tex,transparent:true,alphaTest:.05}));sp.center.set(.5,0);sp.scale.set(h*asp,h,1);rig.add(sp);this.sprite=sp;this.flipX=ch.facing==='left'?-1:1;return}
    const L=this.look=Chars.normLook(ch.look||{}),bc=L.body,body=mat(bc),acc=L.accent;
    const hips=this.hips=new T.Group();rig.add(hips);
    // legs (pivot at hip), feet
    this.legs=[-1,1].map(s=>{const p=new T.Group();p.position.set(s*.12,.3,0);hips.add(p);const leg=M(new T.CylinderGeometry(.085,.075,.24,6),L.pattern==='socks'?mat(0xFFFFFF):body,0,-.12,0);p.add(leg);
      const foot=M(new T.SphereGeometry(.1,6,4),L.pattern==='socks'?mat(0xFFFFFF):mat(shade(bc,-.03)),0,-.25,.04);foot.scale.set(1,.55,1.25);p.add(foot);return p});
    // torso + dress
    const torso=this.torso=new T.Group();torso.position.y=.3;hips.add(torso);
    const tb=M(new T.CylinderGeometry(.2,.25,.42,7),body,0,.21,0);torso.add(tb);
    const dress=new T.LatheGeometry([new T.Vector2(.31,0),new T.Vector2(.29,.1),new T.Vector2(.22,.3),new T.Vector2(.19,.42)],7);
    const outfitCol=L.acc==='snoozy'?0x9DB0E0:L.acc==='leafy'?0xFFF6EA:L.acc==='starlet'?0xFFF6F2:acc;this.dress=M(dress,mat(outfitCol,{side:T.DoubleSide}),0,0,0);torso.add(this.dress);
    // arms (pivot at shoulder)
    this.arms=[-1,1].map(s=>{const p=new T.Group();p.position.set(s*.23,.37,0);torso.add(p);const a=M(new T.CylinderGeometry(.06,.07,.26,5),mat(outfitCol),0,-.12,0);p.add(a);p.add(M(new T.IcosahedronGeometry(.075,0),body,0,-.26,0));p.rotation.z=s*.35;return p});
    // head (pivot at neck)
    const neck=this.neck=new T.Group();neck.position.y=.47;torso.add(neck);const head=this.head=new T.Group();head.position.y=.42;neck.add(head);
    const hs=(L.headSize||100)/100;this.cv=faceCanvas();this.tex=new T.CanvasTexture(this.cv);this.tex.colorSpace=T.SRGBColorSpace;this.tex.anisotropy=4;
    const hg=new T.IcosahedronGeometry(.56,2);const hm=new T.Mesh(hg,new T.MeshStandardMaterial({map:this.tex,emissiveMap:this.tex,emissive:0xFFFFFF,emissiveIntensity:.24,flatShading:true,roughness:.8}));
    const wide=L.head==='wide'?1.14:L.head==='tall'?.98:L.head==='puff'?1.1:1.05,tall=L.head==='tall'?.98:L.head==='puff'?.94:.88;hm.scale.set(wide*hs,tall*hs,1*hs);head.add(hm);this.headMesh=hm;
    // ears
    const eg=earGeo(L.ears),es=(L.earSize||100)/100,inner=mat(0xF3B8C0);this.ears=[-1,1].map(s=>{const p=new T.Group();p.position.set(s*.3*wide*hs,.38*tall*hs,-.02);p.rotation.z=-s*(L.ears==='wide'?.6:.34);head.add(p);
      const e=M(eg,body);e.scale.setScalar(es);p.add(e);const ie=M(eg,inner);ie.scale.set(.55*es,.62*es,.4*es);ie.position.set(0,.04,.07);p.add(ie);
      if(L.ears==='tuft'){const t=M(new T.ConeGeometry(.04,.12,3),body,0,.44*es,0);p.add(t)}return p});
    // tail
    const tailBase=this.tailBase=new T.Group();tailBase.position.set(L.tailSide==='left'?-.08:.08,.12,-.22);hips.add(tailBase);this.tail=tailParts(L.tail,body);tailBase.add(this.tail[0]);tailBase.rotation.x=-1.1;
    outfit(this,L);
    rig.traverse(o=>{if(o.isMesh)o.castShadow=E.q.shadows});
    this.faceDirty=true;this.redrawFace()}
  setLook(ch){this.ch=ch;this.build()}
  /* expression: {eyes,mouth,blush,talk,sick,anger,tear} */
  expr(o,dur){this.face=Object.assign({},o||{});this.faceUntil=dur?E.clock+dur:0;this.faceDirty=true}
  redrawFace(){if(!this.cv||!this.faceDirty)return;this.faceDirty=false;drawFace(this.cv,this.look,Object.assign({},this.baseFace||{},this.face,{blink:this.blinking}));this.tex.needsUpdate=true}
  play(a,o={}){if(this.act!==a){this.act=a;this.t=0}this.opt=o}
  update(dt){const t=(this.t+=dt),c=this.clockT=(this.clockT||0)+dt;
    if(this.sprite){this.updateSprite(dt);return}
    const P={hipsY:0,lean:0,roll:0,twist:0,headX:0,headY:0,headZ:0,armLx:0,armRx:0,armLz:-.35,armRz:.35,legL:0,legR:0,tailCurl:.35,tailSway:1,earL:0,earR:0,lie:0,sq:1,bodyY:0};
    const breathe=Math.sin(c*2.2)*.012,sp=this.speed;
    switch(this.act){
      case 'walk':case 'run':{const run=this.act==='run',ph=this.walkPh,amp=run?.95:.62;P.legL=Math.sin(ph)*amp;P.legR=-Math.sin(ph)*amp;P.armLx=-Math.sin(ph)*(run?.9:.55);P.armRx=Math.sin(ph)*(run?.9:.55);
        P.armLz=run?-.6:-.42;P.armRz=-P.armLz;P.hipsY=Math.abs(Math.cos(ph))*(run?.09:.05);P.lean=run?.22:.07;P.roll=Math.sin(ph)*(run?.06:.045);P.twist=Math.sin(ph)*.08;P.headX=-P.lean*.6+Math.cos(ph*2)*.03;P.headZ=-P.roll*.6;P.tailSway=run?2.2:1.4;P.tailCurl=run?.15:.3;break}
      case 'sit':P.hipsY=-.24;P.legL=-1.45;P.legR=-1.35;P.armLx=-.5;P.armRx=-.5;P.armLz=-.18;P.armRz=.18;P.tailCurl=.7;P.headX=.06;break;
      case 'sleep':P.lie=1;P.hipsY=-.12;P.legL=-.9;P.legR=-1.1;P.armLx=-1.2;P.armRx=-.9;P.tailCurl=1.1;P.tailSway=.2;P.headX=.2;break;
      case 'happy':{const k=t%0.7/0.7,j=Math.sin(Math.min(1,k)*Math.PI);P.hipsY=j*.28;P.sq=k<.12||k>.9?.86:1.06;P.armLz=-1.9-j*.4;P.armRz=1.9+j*.4;P.legL=-j*.4;P.legR=-j*.4;P.tailSway=3;P.headX=-.1;break}
      case 'wave':P.armRz=2.5+Math.sin(t*10)*.35;P.armRx=-.2;P.headZ=.12;P.tailSway=2;break;
      case 'eat':{const n=Math.sin(t*9);P.headX=.25+n*.12;P.armLx=-1.2+n*.15;P.armRx=-1.2-n*.15;P.armLz=-.1;P.armRz=.1;P.hipsY=-.24;P.legL=-1.45;P.legR=-1.35;P.tailSway=1.6;break}
      case 'talk':P.headY=Math.sin(t*2.2)*.15;P.headZ=Math.sin(t*1.7)*.08;P.armRx=-.5+Math.sin(t*4)*.3;P.armRz=.7;P.tailSway=1.3;break;
      case 'sad':P.headX=.35;P.lean=.05;P.armLz=-.12;P.armRz=.12;P.tailCurl=-.2;P.tailSway=.3;P.earL=.5;P.earR=.5;break;
      case 'angry':P.headX=-.05;P.armLz=-.25;P.armRz=.25;P.armLx=-.3;P.armRx=-.3;P.hipsY=Math.abs(Math.sin(t*14))*.02;P.tailCurl=-.1;P.tailSway=3.2;P.earL=-.4;P.earR=-.4;P.sq=1.03;break;
      case 'sick':P.headX=.25+Math.sin(t*1.2)*.05;P.lean=.08;P.roll=Math.sin(t*1.1)*.05;P.tailSway=.3;P.earL=.45;P.earR=.45;if(t%5<.5){P.headX=-.25+(t%5)*1.4;P.sq=.92}break;
      case 'stretch':{const k=Math.min(1,t/1.2),j=Math.sin(k*Math.PI);P.armLz=-.35-j*2.4;P.armRz=.35+j*2.4;P.hipsY=j*.05;P.headX=-.3*j;P.sq=1+j*.05;break}
      case 'look':P.headY=Math.sin(t*1.3)*.6;P.headX=-.08;break;
      case 'dance':P.hipsY=Math.abs(Math.sin(t*6))*.12;P.roll=Math.sin(t*6)*.18;P.armLz=-1.8+Math.sin(t*6)*.5;P.armRz=1.8+Math.sin(t*6)*.5;P.headZ=Math.sin(t*6)*.15;P.legL=Math.sin(t*6)*.3;P.legR=-P.legL;P.tailSway=3;break;
      case 'fish':P.hipsY=-.24;P.legL=-1.45;P.legR=-1.35;P.armLx=-1.1;P.armRx=-1.1+Math.sin(t*.8)*.05;P.headX=.15;P.tailSway=.8;break;
      case 'read':P.hipsY=-.24;P.legL=-1.45;P.legR=-1.35;P.armLx=-1.2;P.armRx=-1.2;P.armLz=.15;P.armRz=-.15;P.headX=.32;P.tailSway=.6;break;
      case 'garden':{const n=Math.sin(t*5);P.lean=.45;P.hipsY=-.05;P.armRx=-1.3+n*.4;P.armLx=-.6;P.headX=.3;P.tailSway=1.4;break}
      case 'hug':P.armLx=-1.3;P.armRx=-1.3;P.armLz=.35;P.armRz=-.35;P.headZ=.2;P.lean=.08;P.tailSway=2.4;break;
      case 'petted':P.headX=-.12+Math.sin(t*3)*.06;P.headZ=Math.sin(t*2.5)*.18;P.tailSway=2.6;P.sq=1+Math.sin(t*6)*.02;break;
      case 'held':P.legL=Math.sin(t*9)*.6;P.legR=-P.legL;P.armLz=-1.2+Math.sin(t*8)*.3;P.armRz=1.2-Math.sin(t*8)*.3;P.tailSway=3;break;
      case 'fall':P.armLz=-2.3;P.armRz=2.3;P.legL=.3;P.legR=-.2;P.sq=1.05;break;
      default:{ // idle: weight shift + glance around
        P.roll=Math.sin(c*.7)*.025;P.headY=this.lookYaw;P.headX=this.lookPitch;P.armLx=Math.sin(c*.9)*.05;P.armRx=-Math.sin(c*.9)*.05}}
    if(this.act!=='sleep'){P.sq*=1+breathe}else{P.sq*=1+Math.sin(c*1.3)*.03}
    // idle micro-behaviours
    if((this.lookT-=dt)<=0){this.lookT=2+Math.random()*4;this.lookYawT=(Math.random()-.5)*.9;this.lookPitchT=(Math.random()-.4)*.25}
    this.lookYaw=lerp(this.lookYaw,this.lookYawT||0,1-Math.exp(-dt*3));this.lookPitch=lerp(this.lookPitch,this.lookPitchT||0,1-Math.exp(-dt*3));
    let tw=0;if((this.twitchT-=dt)<=0){this.twitchT=1.5+Math.random()*5;this.twitchSide=Math.random()<.5?0:1;this.twitchUntil=c+.18}if(c<this.twitchUntil)tw=.35;
    // blend toward the pose (smooth transitions between every action)
    const k=1-Math.exp(-dt*(this.act==='happy'||this.act==='walk'||this.act==='run'||this.act==='dance'?18:9)),C=this.cur;for(const key in P)C[key]=C[key]===undefined?P[key]:lerp(C[key],P[key],k);
    this.hips.position.y=C.hipsY+C.lie*.05;this.hips.rotation.set(C.lean,C.twist*.5,C.roll);this.rig.rotation.z=C.lie*1.35;this.rig.position.y=C.lie*.18;
    this.torso.scale.set(1/Math.sqrt(C.sq),C.sq,1/Math.sqrt(C.sq));this.neck.rotation.set(C.headX,C.headY-C.twist*.6,C.headZ);
    this.arms[0].rotation.set(C.armLx,0,C.armLz);this.arms[1].rotation.set(C.armRx,0,C.armRz);this.legs[0].rotation.x=C.legL;this.legs[1].rotation.x=C.legR;
    this.ears[0].rotation.x=-C.earL+(this.twitchSide===0?tw:0);this.ears[1].rotation.x=-C.earR+(this.twitchSide===1?tw:0);
    const sw=C.tailSway;this.tail.forEach((s,i)=>{s.rotation.x=C.tailCurl*.35+(i>2?C.tailCurl*.25:0);s.rotation.z=Math.sin(c*2.1*Math.max(.4,sw)-i*.6)*.18*Math.min(2,sw)});
    if(this.sprout)this.sprout.rotation.z=Math.sin(c*2.4)*.15;
    // blink (layered on everything but sleep)
    if(this.act!=='sleep'){if((this.blinkT-=dt)<=0){this.blinking=true;this.faceDirty=true;this.blinkT=2.2+Math.random()*3.8;this.blinkOff=c+.12}if(this.blinking&&c>this.blinkOff){this.blinking=false;this.faceDirty=true}}
    if(this.faceUntil&&E.clock>this.faceUntil){this.face={};this.faceUntil=0;this.faceDirty=true}
    if(this.face.talk&&Math.random()<.35)this.faceDirty=true;
    this.redrawFace();
    this.shadow.scale.setScalar(1-C.hipsY*.8+C.lie*.3)}
  updateSprite(dt){const c=this.clockT,sp=this.sprite,moving=this.act==='walk'||this.act==='run';
    const bob=moving?Math.abs(Math.sin(this.walkPh))*.08:this.act==='happy'?Math.abs(Math.sin(this.t*9))*.3:0;sp.position.y=bob;const br=1+Math.sin(c*2.2)*.015;
    const base=sp.userData.base||(sp.userData.base=sp.scale.clone());sp.scale.set(base.x*(this.faceDir||1)*this.flipX/br,base.y*br*(this.act==='sleep'?.92:1),1);sp.material.rotation=moving?Math.sin(this.walkPh)*.05:this.act==='sleep'?.0:0}
}
E.Cat=Cat;E.drawFace=drawFace;
window.Isle3DCat={create:ch=>new Cat(ch),drawFace,faceCanvas};
})();
