/* ===== Isle3D 預覽：創角 / 選夥伴 / 選房子用的小型 3D 視窗（可拖曳旋轉） ===== */
(()=>{'use strict';
const E=window.Isle3D;if(!E)return;const T=E.T;
class Preview{
  constructor(host,{dist=4.2,y=.85,fov=30,bg=null,ground=true}={}){this.host=host;this.items=[];this.yaw=0;this.wantYaw=0;this.dead=false;
    let r;try{r=this.r=new T.WebGLRenderer({antialias:true,alpha:!bg})}catch(e){this.failed=true;return}
    r.outputColorSpace=T.SRGBColorSpace;r.setPixelRatio(Math.min(devicePixelRatio||1,2));r.domElement.className='pv3d';host.append(r.domElement);
    const s=this.s=new T.Scene();if(bg)s.background=new T.Color(bg);
    s.add(new T.HemisphereLight(0xFFF6EA,0xB9C9A8,1.15));const d=new T.DirectionalLight(0xFFF1DA,1.9);d.position.set(-3,5,4);s.add(d);
    if(ground){const g=new T.Mesh(new T.CylinderGeometry(1.6,1.75,.18,24),new T.MeshStandardMaterial({color:0xA6D27A,flatShading:true,roughness:.95}));g.position.y=-.09;s.add(g);this.ground=g}
    this.cam=new T.PerspectiveCamera(fov,1,.1,100);this.dist=dist;this.ty=y;this.group=new T.Group();s.add(this.group);
    const el=r.domElement;el.style.touchAction='none';let px=null;
    el.addEventListener('pointerdown',e=>{px=e.clientX;el.setPointerCapture(e.pointerId)});el.addEventListener('pointermove',e=>{if(px==null)return;this.wantYaw+=(e.clientX-px)*.012;px=e.clientX});
    const up=()=>{px=null};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
    this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(host);this.resize();this.last=performance.now();this.loop=this.loop.bind(this);requestAnimationFrame(this.loop)}
  resize(){if(this.failed)return;const w=this.host.clientWidth||200,h=this.host.clientHeight||200;this.r.setSize(w,h,false);this.cam.aspect=w/h;this.cam.updateProjectionMatrix()}
  setCats(chs,gap=1.15){this.items.forEach(c=>this.group.remove(c.root));this.items=chs.map((ch,i)=>{const c=new E.Cat(ch);c.root.position.x=(i-(chs.length-1)/2)*gap;c.shadow.visible=true;this.group.add(c.root);return c});
    if(this.ground)this.ground.scale.setScalar(Math.max(1,chs.length*.75));return this.items}
  setObject(obj,scale=1){this.items.forEach(c=>c.root?this.group.remove(c.root):this.group.remove(c));this.items=[];this.group.clear();obj.scale.setScalar(scale);this.group.add(obj);this.obj=obj}
  play(i,a,dur){const c=this.items[i];if(!c)return;c.play(a);clearTimeout(c._pt);if(dur)c._pt=setTimeout(()=>c.play('idle'),dur)}
  loop(t){if(this.dead||this.failed)return;const dt=Math.min(.05,(t-this.last)/1000);this.last=t;
    if(!this.host.isConnected){this.dispose();return}
    this.yaw+=(this.wantYaw-this.yaw)*Math.min(1,dt*8);this.group.rotation.y=this.yaw+Math.sin(t/3000)*.08;
    for(const c of this.items){if(c.act==='walk')c.walkPh+=dt*7;c.update(dt)}
    this.cam.position.set(0,this.ty+this.dist*.32,this.dist);this.cam.lookAt(0,this.ty,0);this.r.render(this.s,this.cam);requestAnimationFrame(this.loop)}
  dispose(){this.dead=true;try{this.ro.disconnect();this.r.dispose();this.r.forceContextLoss?.();this.r.domElement.remove()}catch(_){}}}
E.Preview=Preview;window.Isle3DPreview=Preview;
})();
