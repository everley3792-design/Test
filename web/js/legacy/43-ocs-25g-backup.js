/* Complete backups keep the item IDs shared by inventory, clothes, furniture,
   products, artwork and character memories. Optional for older v3 backups. */
window.OCSFullState=(()=>{
 const copy=x=>JSON.parse(JSON.stringify(x)),object=x=>x&&typeof x==='object'&&!Array.isArray(x);
 const finite=(v,d,min,max)=>Number.isFinite(+v)?clamp(+v,min,max):d;
 const remap=(rows,map)=>Object.fromEntries(Object.entries(object(rows)?rows:{}).map(([id,v])=>[map.get(id)||id,v]));
 return{
  async snapshot(){const {Room,Dress}=OCS24D;OCSCommunity.persist();
   const db=await Art.open(),arts=await new Promise((resolve,reject)=>{const tx=db.transaction('art'),q=tx.objectStore('art').getAll();q.onsuccess=()=>resolve(q.result||[]);q.onerror=()=>reject(q.error)});
   return copy({v:1,room:Room.d,dress:Dress.d,catalog:Cat.d,arts,itemUI:Items.d.ui});
  },
  async prepare(raw,itemDoc,map){
   if(!object(raw)||raw.v!==1||!object(raw.room)||!object(raw.dress)||!object(raw.catalog)||!Array.isArray(raw.arts)||!Array.isArray(itemDoc?.items))throw new Error('完整備份的佈置、穿搭或作品資料不完整');
   const items=new Set();for(const it of itemDoc.items){if(!it||typeof it.id!=='string'||items.has(it.id))throw new Error('備份的物品識別碼重複或無效');items.add(it.id)}
   const wear=w=>{if(!object(w)||!items.has(w.i))throw new Error('穿搭引用了缺少的物品');const offsets={};for(const [k,v]of Object.entries(object(w.o)?w.o:{}))if(/^(walk|sleep|sit|hop)~?$/.test(k)&&Array.isArray(v)&&v.length===2)offsets[k]=v.map(x=>finite(x,0,-1,1));
    return{i:w.i,a:['head','ear','face','neck','body','hand','foot','tail','free'].includes(w.a)?w.a:'free',x:finite(w.x,.5,-.2,1.2),y:finite(w.y,.5,-.2,1.2),s:finite(w.s,.3,.06,1.4),r:finite(w.r,0,-360,360),z:w.z<0?-1:1,f:w.f===-1?-1:1,h:(Array.isArray(w.h)?w.h:[]).filter(k=>['walk','sleep','sit','hop'].includes(k)),o:offsets}};
   const placement=(p,n)=>{if(!object(p)||!items.has(p.i))throw new Error('家具佈置引用了缺少的物品');return{u:typeof p.u==='string'?p.u.slice(0,60):'f_restore_'+n,i:p.i,x:finite(p.x,.5,.02,.98),y:finite(p.y,.75,.5,.94),s:finite(p.s,1,.3,3),r:finite(p.r,0,-360,360),z:[-1,0,1].includes(p.z)?p.z:0,f:p.f===-1?-1:1,on:p.on?1:0,w:finite(p.w,0,0,Date.now()),lock:!!p.lock}};
   const list=(rows,fn,max=100)=>{if(!Array.isArray(rows)||rows.length>max)throw new Error('備份物件清單數量或格式錯誤');return rows.map(fn)};
   const dress={c:{}};for(const [id,r]of Object.entries(raw.dress.c||{})){if(!map.has(id))continue;if(!object(r))throw new Error('角色穿搭格式錯誤');const sets={};for(const [k,w]of Object.entries(r.sets||{}).slice(0,100))Object.defineProperty(sets,k.slice(0,40),{value:list(w,wear),enumerable:true,writable:true,configurable:true});dress.c[map.get(id)]={w:list(r.w||[],wear),sets}}
   const room={s:{home:list(raw.room.s?.home||[],placement)},saved:{},g:[],atelierCatalog:1,legacyPlant:1};
   for(const [k,rows]of Object.entries(raw.room.saved||{}).slice(0,100))Object.defineProperty(room.saved,k.slice(0,40),{value:list(rows,placement),enumerable:true,writable:true,configurable:true});
   room.g=list(raw.room.g||[],(g,n)=>{if(!object(g)||!items.has(g.i))throw new Error('地上物品資料不完整');return{u:typeof g.u==='string'?g.u.slice(0,60):'g_restore_'+n,i:g.i,x:finite(g.x,.5,.06,.94),y:finite(g.y,.8,.5,.94),t:finite(g.t,Date.now(),0,Date.now())}},20);
   const arts=[],ids=new Set();if(raw.arts.length>300)throw new Error('作品數量超過安全限制');
   for(const a of raw.arts){const row=Art.clean(a,true);if(!row||typeof a.id!=='string'||a.id.length>=40||ids.has(a.id))throw new Error('繪畫作品資料無效或重複');
    for(const layer of row.layers)await Backup.image(d2b(layer),'繪畫圖層');if(row.thumb){if(row.thumb.length>3e6)throw new Error('作品預覽圖片過大');await Backup.image(d2b(row.thumb),'作品預覽')}
    ids.add(row.id);row.t=finite(a.t,Date.now(),0,Date.now());arts.push(row)}
   const productIds=new Set(),catalog={v:1,mode:raw.catalog.mode==='free'?'free':'life',products:[],tx:[],bought:{},delisted:(raw.catalog.delisted||[]).filter(id=>items.has(id))};
   catalog.products=list(raw.catalog.products,p=>{if(!object(p)||typeof p.id!=='string'||productIds.has(p.id)||!items.has(p.itemId))throw new Error('商店商品資料無效');productIds.add(p.id);if(p.art&&!ids.has(p.art))throw new Error('商品缺少原始繪畫作品');
    return{id:p.id.slice(0,80),itemId:p.itemId,price:Math.round(finite(p.price,500,0,1e6)),src:['builtin','migrated','draw','img','pack'].includes(p.src)?p.src:'pack',art:p.art||'',sale:object(p.sale)?{off:finite(p.sale.off,0,0,1),until:finite(p.sale.until,0,0,Date.now()+31536e6)}:null,limited:null,cond:object(p.cond)?{ok:!!p.cond.ok}:null,ver:Math.round(finite(p.ver,1,1,1e6)),at:finite(p.at,Date.now(),0,Date.now())}},500);
   catalog.tx=(Array.isArray(raw.catalog.tx)?raw.catalog.tx:[]).slice(0,60).map(p=>({t:finite(p.t,0,0,Date.now()),id:String(p.id||'').slice(0,40),price:finite(p.price,0,0,1e6),bal:finite(p.bal,0,0,1e9)}));
   if(object(raw.catalog.bought))for(const [id,n]of Object.entries(raw.catalog.bought))if(items.has(id))catalog.bought[id]=Math.round(finite(n,0,0,1e6));
   return{dress,room,catalog,arts,itemUI:object(raw.itemUI)?copy(raw.itemUI):null};
  },
  async restore(data){const {Dress,Room,Ground}=OCS24D;
   if(data.arts.length){const db=await Art.open();await new Promise((resolve,reject)=>{const tx=db.transaction('art','readwrite');for(const a of data.arts)tx.objectStore('art').put(a);tx.oncomplete=resolve;tx.onerror=tx.onabort=()=>reject(tx.error||new Error('作品儲存失敗'))})}
   OCSCommunity.cancelAll();Room.job=null;if(Ground)Ground.job=null;
   Dress.d=data.dress;Room.d=data.room;Cat.d=data.catalog;Dress.save();Room.save();Cat.save();Cat.load();
   if(data.itemUI){const u=data.itemUI;Object.assign(Items.d.ui,{side:u.side==='L'?'L':'R',y:finite(u.y,.42,0,1),tab:Math.round(finite(u.tab,0,0,2)),open:false})}
   Dress.syncAll();Room.render(Room.list());Ground?.render();Items.save(true);Items.emit();Bag.place();
  },
  restoreCharacterState(doc,map){
   if(object(doc.cfg?.life))Cfg.v.life=remap(copy(doc.cfg.life),map);
   if(object(Eco.v.e?.life))Eco.v.e.life=remap(Eco.v.e.life,map);
   if(doc.items)Items.d.mem=remap(Items.d.mem,map);
   const cfg=doc.cfg||{};if(['real','manual','auto'].includes(cfg.envMode))Cfg.v.envMode=cfg.envMode;
   if(['pre','early','morn','fore','noon','aft','dusk','eve','late'].includes(cfg.envTime))Cfg.v.envTime=cfg.envTime;
   if(Object.hasOwn(WX,cfg.envWx))Cfg.v.envWx=cfg.envWx;if(typeof cfg.sound==='boolean')Cfg.v.sound=cfg.sound;
   Eco.save();Items.save(true);Cfg.flush();Env.target();Env.dirty=1;Settings.make();
  }
 };
})();
