/* ===== 2.4C 商品目錄・商店・工坊繪畫 ===== */
const Art={db:null,open(){return this.db?Promise.resolve(this.db):new Promise((res,rej)=>{try{const r=indexedDB.open('oc-shimeji-art',1);r.onupgradeneeded=()=>r.result.createObjectStore('art',{keyPath:'id'});r.onsuccess=()=>res(this.db=r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}})},
  async put(o){const d=await this.open();return new Promise((s,j)=>{const t=d.transaction('art','readwrite');t.objectStore('art').put(o);t.oncomplete=s;t.onerror=()=>j(t.error)})},
  async get(id){const d=await this.open();return new Promise(s=>{const q=d.transaction('art').objectStore('art').get(id);q.onsuccess=()=>s(q.result||null);q.onerror=()=>s(null)})},
  async del(id){const d=await this.open();return new Promise(r=>{const t=d.transaction('art','readwrite');t.objectStore('art').delete(id);t.oncomplete=r;t.onerror=r})},
  clean(a,keep){if(!a||typeof a!=='object'||!Array.isArray(a.layers))return null;const w=Math.round(+a.w),h=Math.round(+a.h);if(!(w>=16&&w<=512&&h>=16&&h<=512)||a.layers.length<1||a.layers.length>5||!a.layers.every(l=>typeof l==='string'&&/^data:image\/png;base64,/.test(l)&&l.length<3e6))return null;const th=typeof a.thumb==='string'&&/^data:image\/(png|webp);base64,/.test(a.thumb)?a.thumb:'';return{id:keep&&typeof a.id==='string'&&a.id.length<40?a.id:'a_'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),w,h,name:String(a.name||'').slice(0,16),t:Date.now(),layers:a.layers,thumb:th}},
  async all(){const d=await this.open();return new Promise(s=>{const q=d.transaction('art').objectStore('art').getAll();q.onsuccess=()=>s(q.result||[]);q.onerror=()=>s([])})}};
const BASE_PRICE=500,BUILTIN_PRICE={food:60,drink:50,toy:120,gift:150,wear:300,acc:200,furn:400,custom:200};
const Cat={k:'ocs.catalog.v1',d:{v:1,mode:'life',products:[],tx:[],bought:{}},
  load(){try{const o=JSON.parse(localStorage.getItem(this.k));if(o&&Array.isArray(o.products))this.d=Object.assign(this.d,o)}catch(e){}
    this.d.products.forEach(p=>{p.price=Math.max(0,Math.round(+p.price)||BASE_PRICE)});
    let ch=0;this.d.delisted=this.d.delisted||[];Items.d.items.forEach(i=>{if(!this.d.delisted.includes(i.id)&&!this.d.products.some(p=>p.itemId===i.id)){this.d.products.push(this.fromItem(i));ch=1}});if(ch)this.save()},
  save(){try{localStorage.setItem(this.k,JSON.stringify(this.d))}catch(e){window.ocsQuota&&ocsQuota()}},
  fromItem(i){return{id:'pr_'+i.id,itemId:i.id,price:i.builtin?(BUILTIN_PRICE[i.cat]||200):BASE_PRICE,src:i.builtin?'builtin':'migrated',art:'',sale:null,limited:null,cond:null,ver:1,at:Date.now()}},
  delist(pid){const p=this.prod(pid);if(!p)return;this.d.products=this.d.products.filter(x=>x!==p);(this.d.delisted=this.d.delisted||[]).push(p.itemId);const it=Items.get(p.itemId);if(it&&it.qty<=0&&!it.builtin)Items.del(it.id);else Items.emit();this.save();toast('已下架','check')},
  prod:id=>Cat.d.products.find(p=>p.id===id),
  /* 登錄 / 更新商品：物品 id 固定，更新時同步，不產生重複，角色記憶以 itemId 保留 */
  register(f,pid){let p=pid&&this.prod(pid),it;
    const body={name:f.name,emoji:f.emoji||'',img:f.img||'',cat:f.cat,tags:f.tags,desc:f.desc,uses:f.uses,target:f.target||'both',consume:f.consume!==false};
    if(p&&Items.get(p.itemId)){Items.upd(p.itemId,body);p.ver++;if(f.art)p.art=f.art}
    else{it=Items.add(Object.assign(body,{qty:0}));it.qty=0;p={id:'pr_'+it.id,itemId:it.id,price:BASE_PRICE,src:f.src||'draw',art:f.art||'',sale:null,limited:null,cond:null,ver:1,at:Date.now()};this.d.products.push(p);Items.emit()}
    this.save();return p},
  price(p){const s=p.sale;return s&&s.until>Date.now()?Math.max(0,Math.round(p.price*(1-s.off))):p.price},
  async packExport(){const arts=[];for(const p of this.d.products){if(p.art){const a=await Art.get(p.art);if(a&&!arts.some(x=>x.id===a.id))arts.push(a)}}return{format:'oc-shimeji-pack',v:1,note:'內容包只含商品定義與圖片，不含庫存',arts,products:this.d.products.map(p=>({p,it:(({qty,last,events,fav,...r})=>r)(Items.get(p.itemId)||{})}))}},
  async packImport(o){if(!o||o.format!=='oc-shimeji-pack'||!Array.isArray(o.products))throw new Error('不是內容包');let n=0;if(Array.isArray(o.arts))for(const a of o.arts.slice(0,300)){const c=Art.clean(a,true);if(c&&!await Art.get(c.id))await Art.put(c)}
    o.products.slice(0,300).forEach(e=>{if(!e||!e.it)return;const cur=Items.get(e.it.id);const f=Object.assign({},e.it,{src:'pack',art:e.p&&typeof e.p.art==='string'?e.p.art:''});
      if(cur&&this.d.products.some(p=>p.itemId===cur.id)){this.register(f,'pr_'+cur.id)}else{const pr=this.register(Object.assign(f,{id:undefined}));if(e.p&&e.p.price>=0)pr.price=Math.round(e.p.price)}n++});this.save();return n}};
/* 統一發放與錢包 */
const Inv={grant(id,n,src){n=Math.floor(+n);if(!(n>0)||n>99)return false;const it=Items.get(id);if(!it)return false;it.qty=Math.min(999,it.qty+n);Items.save(true);Items.emit();return true}};
const Wallet={bal:()=>Math.max(0,Math.floor(+Eco.v.coins)||0),
  spend(n){n=Math.floor(+n);if(!(n>=0)||this.bal()<n)return false;Eco.v.coins=this.bal()-n;Eco.save();HUD.refresh();return true},
  earn(n){n=Math.floor(+n);if(!(n>0))return;Eco.v.coins=this.bal()+n;Eco.save();HUD.refresh()}};
const Shop={busy:false,F:{q:'',c:'all'},
  open(){const F=this.F;F.q='';let off=null;const s=openSheet('<div class="sh-body" id="spB" style="height:min(72vh,600px);display:flex;flex-direction:column;overflow:hidden"></div>',{onClose:()=>off&&off()}),B=$('#spB',s.el);
    B.innerHTML=`<div class="sh-title" style="display:flex;justify-content:space-between;flex:none">商店<span id="spC"></span></div><input class="c4-in" id="spQ" aria-label="搜尋商店商品" placeholder="搜尋商品" style="flex:none"><div class="bg-chips" id="spCh" style="margin-top:8px;flex:none"></div><div id="spG" style="flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;margin-top:6px"></div>`;
    const draw=reset=>{const coins=$('#spC',B);if(!coins.firstChild)coins.innerHTML=ocsCoin()+' <b></b>';coins.querySelector('b').textContent=Wallet.bal();
      const ch=$('#spCh',B),chips=[['all','全部'],...ICATS.map(c=>[c,ITYPES[c][0]])].map(c=>`<button class="chip ${F.c===c[0]?'on':''}" data-c="${c[0]}" aria-pressed="${F.c===c[0]}">${c[1]}</button>`).join('');
      if(ch._signature!==chips){const x=ch.scrollLeft;ch.innerHTML=chips;ch.scrollLeft=x;ch._signature=chips}
      const L=Cat.d.products.filter(p=>{const it=Items.get(p.itemId);if(!it)return false;if(p.cond&&!p.cond.ok)return false;if(F.c!=='all'&&it.cat!==F.c)return false;return !F.q||(it.name+it.tags.join('')+it.desc).toLowerCase().includes(F.q.toLowerCase())});
      const g=$('#spG',B),sy=reset?0:g.scrollTop;
      let grid=g.querySelector('.c4-grid');if(!grid){grid=el('<div class="c4-grid" style="align-content:start;margin-top:0"></div>');g.append(grid)}
      const previous=new Map([...grid.children].map(n=>[n.dataset.p,n]));
      L.forEach((p,index)=>{const it=Items.get(p.itemId),price=Cat.price(p);let n=previous.get(p.id);
        if(!n)n=el(`<button class="c4-pc" data-p="${esc(p.id)}"><div class="im"></div><span class="sp-name"></span><small class="sp-price"></small><small class="ow"></small></button>`);
        const art=Items.icon(it);if(n._art!==art){n.querySelector('.im').innerHTML=art;n._art=art}
        n.querySelector('.sp-name').textContent=it.name;
        const priceHTML=ocsCoin()+' '+price+(price<p.price?' <s>'+p.price+'</s>':'');if(n._price!==priceHTML){n.querySelector('.sp-price').innerHTML=priceHTML;n._price=priceHTML}
        const own=n.querySelector('.ow');own.textContent=it.qty?'持有 '+it.qty:'尚未持有';own.classList.toggle('has-stock',it.qty>0);
        if(grid.children[index]!==n)grid.insertBefore(n,grid.children[index]||null);previous.delete(p.id);
      });previous.forEach(n=>n.remove());
      let empty=g.querySelector('.bg-empty');if(!L.length&&!empty){empty=el('<div class="bg-empty">沒有符合的商品<br><small>試試其他分類，或清除搜尋文字。</small></div>');g.append(empty)}else if(L.length&&empty)empty.remove();g.scrollTop=sy};
    draw(1);off=Items.on(()=>{if(!s.closed)draw()});
    B.addEventListener('input',e=>{if(e.target.id==='spQ'){F.q=e.target.value;draw(1)}});
    B.addEventListener('click',e=>{const c=e.target.closest('[data-c]');if(c){F.c=c.dataset.c;draw(1);return}const p=e.target.closest('[data-p]');if(p)this.detail(p.dataset.p)})},
  detail(pid){const p=Cat.prod(pid),it=p&&Items.get(p.itemId);if(!it)return;const pr=Cat.price(p);
    let off=null;const s=openSheet(`<div class="sh-body"><div class="dt-hero"><div class="it">${Items.icon(it)}</div><div><h3>${esc(it.name)}</h3><small data-owned>${ITYPES[it.cat][0]}｜持有 ${it.qty}</small></div></div><div>${it.tags.map(t=>`<span class="tg">${esc(t)}</span>`).join('')}</div><p class="dt-p">${esc(it.desc||'沒有說明')}</p>${['wear','acc','furn'].includes(it.cat)?'<p class="dt-p">購買後，從背包拖到角色或場景即可使用。</p>':''}<div class="dt-row"><button class="btn grow primary" data-b><span data-price>${ocsCoin()} ${pr}</span> 購買</button></div>${(p.art||['draw','img','pack'].includes(p.src))?'<div class="dt-row"><button class="btn grow" data-e>編輯</button><button class="btn danger grow" data-x>下架</button></div>':''}</div>`,{onClose:()=>off&&off()});
    const refresh=()=>{const item=Items.get(p.itemId),current=Cat.prod(pid);if(!item||!current){s.close();return}const buy=s.el.querySelector('[data-b]');s.el.querySelector('[data-owned]').textContent=ITYPES[item.cat][0]+'｜持有 '+item.qty;buy.disabled=item.qty>=999;const cost=Cat.price(current),price=s.el.querySelector('[data-price]');if(price.dataset.cost!==String(cost)){price.innerHTML=ocsCoin()+' '+cost;price.dataset.cost=String(cost)}buy.setAttribute('aria-label',item.qty>=999?'已達持有上限':'以 '+cost+' 星幣購買 '+item.name)};off=Items.on(refresh);refresh();
    s.el.addEventListener('click',async e=>{if(e.target.closest('[data-e]')){s.close();setTimeout(()=>Studio4.editProduct(pid),260);return}
      if(e.target.closest('[data-x]')){if(await confirmSheet({title:'下架商品',msg:`將「${it.name}」從商店下架？已持有的數量會保留在背包。`,ok:'下架'})){Cat.delist(pid);s.close()}return}if(!e.target.closest('[data-b]'))return;
      const pr=Cat.price(Cat.prod(pid)||p);if(Wallet.bal()<pr){buzz(20);toast(`星幣不足（還差 ${pr-Wallet.bal()}）`,'info');return}
      if(!await confirmSheet({title:'確認購買',msg:`以 ${pr} 星幣購買「${it.name}」？`,ok:'購買',danger:false}))return;this.buy(pid,e.target)})},
  buy(pid,from){if(this.busy)return false;this.busy=true;try{const p=Cat.prod(pid),it=p&&Items.get(p.itemId);if(!p||!it)return false;const pr=Cat.price(p);
      if(it.qty>=999){toast('這個物品已達持有上限','info');return false}
      if(!Wallet.spend(pr)){toast('星幣不足','info');return false}
      if(!Inv.grant(it.id,1,'shop')){Wallet.earn(pr);return false}
      Cat.d.tx.unshift({t:Date.now(),id:it.id,price:pr,bal:Wallet.bal()});Cat.d.tx.length=Math.min(Cat.d.tx.length,60);Cat.save();Eco.save();
      buzz([12,30,12]);this.fly(it,from);toast(`已購買「${it.name}」（持有 ${it.qty}）`,'sparkle');return true}finally{setTimeout(()=>{this.busy=false},450)}},
  fly(it,from){try{const r=from?from.getBoundingClientRect():{left:innerWidth/2,top:innerHeight/2,width:0,height:0},f=document.createElement('div');f.className='c4-fly';f.innerHTML=Items.icon(it);f.style.cssText+=`left:${r.left+r.width/2-23}px;top:${r.top}px;opacity:1`;document.body.append(f);requestAnimationFrame(()=>{f.style.left=innerWidth-60+'px';f.style.top=innerHeight-90+'px';f.style.transform='scale(.4)';f.style.opacity='.2'});setTimeout(()=>f.remove(),900)}catch(e){}}};
/* ---- 工坊：繪畫 ---- */
const Studio4={  mount(){const h=$('#p-studio .phead');if(!h||$('#c4Btn'))return;const b=el('<button class="icon-btn plain" id="c4Btn" aria-label="創作工坊" style="font-size:20px;flex:none">'+ic('tool',22)+'</button>');h.append(b);b.onclick=()=>{buzz(6);this.menu()}},
  menu(){const s=openSheet(`<div class="sh-body"><div class="sh-title">創作工坊</div><small style="color:var(--ink-2)">畫出或匯入物品，登錄成商品後到商店購買</small><div class="c4-row">${[['draw',ic('palette',16)+' 繪畫創作',1],['img',ic('image',16)+' 匯入圖片'],['works',ic('book',16)+' 我的作品'],['shop',ic('store',16)+' 前往商店'],['exp',ic('upload',16)+' 匯出內容包'],['imp',ic('download',16)+' 匯入內容包']].map(r=>`<button class="c4-b ${r[2]?'p':''}" data-k="${r[0]}">${r[1]}</button>`).join('')}</div></div>`);
    s.el.addEventListener('click',e=>{const k=e.target.closest('[data-k]');if(!k)return;const a=k.dataset.k;s.close();setTimeout(()=>this.act(a),280)})},
  async act(a){if(a==='draw')this.paint();else if(a==='img')this.importImg();else if(a==='works')this.works();else if(a==='shop')Shop.open();
    else if(a==='exp'){const b=new Blob([JSON.stringify(await Cat.packExport())],{type:'application/json'}),l=document.createElement('a');l.href=URL.createObjectURL(b);l.download='oc-pack-'+Date.now()+'.json';l.click();toast('已匯出內容包（不含庫存）')}
    else{try{const r=await pickF('application/json,.json',false),f=Array.isArray(r)?r[0]:r;if(!f)return;const t=await (f.blob||f.file||f).text();toast(`已加入 ${await Cat.packImport(JSON.parse(t))} 件商品（需購買才會持有）`)}catch(er){toast(er.message||'匯入失敗','info')}}},
  async importImg(){try{const r=await pickF('image/png,image/webp,image/jpeg,image/*',false),f=Array.isArray(r)?r[0]:r;if(!f)return;const u=await Bag.shrink(f.blob||f.file||f);this.paint({base:u})}catch(e){toast('圖片讀取失敗','info')}},
  async works(){let A=[],batch=false;const sel=new Set(),ld=async()=>{A=(await Art.all()).filter(a=>a.id!=='draft').sort((a,b)=>b.t-a.t)};await ld();
    const s=openSheet('<div class="sh-body" id="wkB"></div>'),B=$('#wkB',s.el);
    const dl=(o,n)=>{const b=new Blob([JSON.stringify(o)],{type:'application/json'}),l=document.createElement('a');l.href=URL.createObjectURL(b);l.download=n+'-'+Date.now()+'.json';l.click();setTimeout(()=>URL.revokeObjectURL(l.href),800)};
    const dr=()=>{B.innerHTML=`<div class="sh-title">我的作品</div><div class="c4-row"><button class="c4-b" data-w="batch">${batch?'結束批次':ic('check',16)+' 批次選取'}</button><button class="c4-b" data-w="imp">${ic('download',16)} 匯入作品檔</button></div><div class="c4-grid">${A.map(a=>`<button class="c4-pc" style="${sel.has(a.id)?'outline:3px solid var(--accent)':''}" data-a="${a.id}"><div class="im"><img src="${a.thumb}"></div>${esc(a.name||'作品')}</button>`).join('')}</div>${A.length?'':'<div class="bg-empty">還沒有作品</div>'}${batch?`<div class="c4-row"><button class="c4-b p" data-w="bexp">匯出所選 (${sel.size})</button><button class="c4-b" data-w="bdup">複製所選</button><button class="c4-b" data-w="bdel">刪除所選</button></div>`:''}`};
    const dup=async id=>{const a=await Art.get(id);if(!a)return;await Art.put(Object.assign({},a,{id:'a_'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),name:((a.name||'作品')+' 副本').slice(0,16),t:Date.now()}))};
    const del=async ids=>{for(const id of ids){await Art.del(id);Cat.d.products.forEach(p=>{if(p.art===id)p.art=''})}Cat.save()};
    dr();
    B.addEventListener('click',async e=>{const w=e.target.closest('[data-w]'),a=e.target.closest('[data-a]');
      if(w){const k=w.dataset.w;
        if(k==='batch'){batch=!batch;sel.clear()}
        else if(k==='imp'){try{const r=await pickF('application/json,.json',false),f=Array.isArray(r)?r[0]:r;if(!f)return;const o=JSON.parse(await (f.blob||f.file||f).text());if(o.format!=='oc-shimeji-art'||!Array.isArray(o.arts))throw new Error('不是作品檔');let n=0;for(const x of o.arts.slice(0,100)){const c=Art.clean(x,false);if(c){await Art.put(c);n++}}toast(`已匯入 ${n} 件作品`)}catch(er){toast(er.message||'匯入失敗','info')}}
        else if(!sel.size){toast('請先選取作品','info');return}
        else if(k==='bexp'){dl({format:'oc-shimeji-art',v:1,arts:A.filter(x=>sel.has(x.id))},'oc-art');toast('已匯出')}
        else if(k==='bdup'){for(const id of sel)await dup(id);sel.clear();toast('已複製','check')}
        else if(k==='bdel'){if(!await confirmSheet({title:'刪除作品',msg:`刪除 ${sel.size} 件作品？已登錄的商品不受影響。`,ok:'刪除'}))return;await del([...sel]);sel.clear()}
        await ld();dr();return}
      if(!a)return;const id=a.dataset.a;
      if(batch){sel.has(id)?sel.delete(id):sel.add(id);dr();return}
      const m=openSheet(`<div class="sh-body"><div class="sh-title">作品</div><div class="c4-row"><button class="c4-b p" data-o="edit">編輯</button><button class="c4-b" data-o="dup">複製</button><button class="c4-b" data-o="exp">匯出</button><button class="c4-b" data-o="del">刪除</button>${window.ocsPvBtns?window.ocsPvBtns(id):''}</div></div>`);
      m.el.addEventListener('click',async e2=>{const o=e2.target.closest('[data-o]');if(!o)return;const k=o.dataset.o;
        if(k==='pvd'||k==='pvr'){const pp=Cat.d.products.find(x=>x.art===id);if(pp){m.close();s.close();k==='pvd'?window.OCS24D.Dress.preview(pp.itemId):window.OCS24D.Room.preview(pp.itemId)}return}
        if(k==='edit'){m.close();s.close();setTimeout(()=>this.paint({art:id}),280);return}
        if(k==='exp'){dl({format:'oc-shimeji-art',v:1,arts:A.filter(x=>x.id===id)},'oc-art');toast('已匯出');return}
        if(k==='dup'){await dup(id);toast('已複製','check')}
        if(k==='del'){if(!await confirmSheet({title:'刪除作品',msg:'刪除這件作品？已登錄的商品不受影響。',ok:'刪除'}))return;await del([id])}
        m.close();await ld();dr()})})},
  editProduct(pid){const p=Cat.prod(pid);if(!p)return;if(p.art)this.paint({art:p.art,pid});else this.form({pid,img:Items.get(p.itemId).img,art:''})},
  async paint(o={}){const ov=el(`<div class="c4-ov"><div class="c4-top" id="tTop"></div><div class="c4-vp" id="tVp"><canvas class="c4-cv" id="tCv"></canvas></div><div class="c4-bot" id="tBot"></div></div>`);(layer.parentNode||document.body).append(ov);history.pushState({c4:1},'');
    let W=256,H=256,layers=[],cur=0,tool='pen',col='#e8607a',size=6,undo=[],redo=[],z=1,px=0,py=0,id=o.art||'a_'+Date.now().toString(36),name='',dirty=0,sh=null,drawing=false,last=null,fl=null,mv=null,fbar=false,lm=null;
    const mk=()=>{const c=cvs(W,H);return c},cv=$('#tCv',ov),vp=$('#tVp',ov),g=cv.getContext('2d');
    const draft=await Art.get(o.art||'draft').catch(()=>null);
    if(draft&&Array.isArray(draft.layers)&&draft.layers.length&&(o.art||!o.base)){W=draft.w;H=draft.h;name=draft.name||'';for(const d of draft.layers){const c=mk(),im=new Image();im.src=d;try{await im.decode()}catch(e){}c.getContext('2d').drawImage(im,0,0);layers.push({c,v:1})}}
    else{layers=[{c:mk(),v:1},{c:mk(),v:1},{c:mk(),v:1}];if(o.base){const im=new Image();im.src=o.base;await im.decode();const k=Math.min(W/im.width,H/im.height),w=im.width*k,h=im.height*k;{const c0=cvs(im.width,im.height);c0.getContext('2d').drawImage(im,0,0);fl={c:c0,src:c0,x:W/2,y:H/2,s:k,r:0,o:1,sn:0,crop:0};tool='sel'}}}
    const rs=()=>{cv.width=W;cv.height=H;z=Math.min(vp.clientWidth/W,vp.clientHeight/H)*.92;px=(vp.clientWidth-W*z)/2;py=(vp.clientHeight-H*z)/2;rd()},
    tf=()=>cv.style.transform=`translate(${px}px,${py}px) scale(${z})`,
    rd=()=>{g.clearRect(0,0,W,H);layers.forEach(l=>l.v&&g.drawImage(l.c,0,0));if(sh&&tool==='sel'){g.save();g.strokeStyle='#7f8cd8';g.setLineDash([4/z,3/z]);g.lineWidth=1.5/z;g.strokeRect(sh.a.x,sh.a.y,sh.b.x-sh.a.x,sh.b.y-sh.a.y);g.restore()}else if(sh){g.save();g.strokeStyle=col;g.lineWidth=size;g.lineCap='round';shape(g,sh);g.restore()}
      if(fl){const T=()=>{g.translate(fl.x,fl.y);g.rotate(fl.r);g.scale(fl.s,fl.s)};g.save();g.globalAlpha=fl.o;T();g.drawImage(fl.c,-fl.c.width/2,-fl.c.height/2);g.restore();g.save();T();g.strokeStyle='#7f8cd8';g.setLineDash([4/(z*fl.s),3/(z*fl.s)]);g.lineWidth=1.5/(z*fl.s);g.strokeRect(-fl.c.width/2,-fl.c.height/2,fl.c.width,fl.c.height);g.restore()}
      if(!!fl!==fbar)bar();tf()},
    shape=(x,s)=>{x.beginPath();if(tool==='line'){x.moveTo(s.a.x,s.a.y);x.lineTo(s.b.x,s.b.y)}else if(tool==='rect')x.rect(s.a.x,s.a.y,s.b.x-s.a.x,s.b.y-s.a.y);else x.ellipse((s.a.x+s.b.x)/2,(s.a.y+s.b.y)/2,Math.abs(s.b.x-s.a.x)/2||.5,Math.abs(s.b.y-s.a.y)/2||.5,0,0,7);x.stroke()},
    pt=e=>{const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)/z,y:(e.clientY-r.top)/z}},
    L=()=>layers[cur].c.getContext('2d',{willReadFrequently:true}),
    snap=()=>{undo.push({i:cur,d:L().getImageData(0,0,W,H)});if(undo.length>30)undo.shift();redo=[]},
    save=()=>{dirty=1;clearTimeout(save.t);save.t=setTimeout(()=>Art.put({id:o.art?id:'draft',w:W,h:H,name,t:Date.now(),layers:layers.map(l=>l.c.toDataURL()),thumb:thumb(48)}).catch(()=>{}),900)},
    flat=()=>{const c=mk(),x=c.getContext('2d');layers.forEach(l=>l.v&&x.drawImage(l.c,0,0));return c},
    thumb=n=>{const f=flat(),k=Math.min(1,n/Math.max(W,H)),c=cvs(Math.max(1,W*k|0),Math.max(1,H*k|0));c.getContext('2d').drawImage(f,0,0,c.width,c.height);return c.toDataURL('image/webp',.8)},
    stroke=(a,b,c)=>{const x=L();x.save();x.lineCap=x.lineJoin='round';x.lineWidth=size;if(tool==='eraser')x.globalCompositeOperation='destination-out';x.strokeStyle=col;x.beginPath();x.moveTo(a.x,a.y);if(c)x.quadraticCurveTo(c.x,c.y,b.x,b.y);else x.lineTo(b.x,b.y);x.stroke();x.restore()},
    fill=p=>{const x=L(),im=x.getImageData(0,0,W,H),d=im.data,X=p.x|0,Y=p.y|0;if(X<0||Y<0||X>=W||Y>=H)return;const hex=col.match(/\w\w/g).map(v=>parseInt(v,16)),i0=(Y*W+X)*4,t=[d[i0],d[i0+1],d[i0+2],d[i0+3]];if(t[0]===hex[0]&&t[1]===hex[1]&&t[2]===hex[2]&&t[3]===255)return;snap();const st=[[X,Y]],ok=i=>Math.abs(d[i]-t[0])+Math.abs(d[i+1]-t[1])+Math.abs(d[i+2]-t[2])+Math.abs(d[i+3]-t[3])<40;
      while(st.length){const[a,b]=st.pop();if(a<0||b<0||a>=W||b>=H)continue;const i=(b*W+a)*4;if(!ok(i))continue;d[i]=hex[0];d[i+1]=hex[1];d[i+2]=hex[2];d[i+3]=255;st.push([a+1,b],[a-1,b],[a,b+1],[a,b-1])}x.putImageData(im,0,0)},
    commit=()=>{if(!fl)return;if(!fl.sn)snap();const x=L();x.save();x.globalAlpha=fl.o;x.translate(fl.x,fl.y);x.rotate(fl.r);x.scale(fl.s,fl.s);x.drawImage(fl.c,-fl.c.width/2,-fl.c.height/2);x.restore();fl=null;rd();save()},
    lift=r=>{const x0=Math.max(0,Math.round(Math.min(r.a.x,r.b.x))),y0=Math.max(0,Math.round(Math.min(r.a.y,r.b.y))),w=Math.min(W,Math.round(Math.max(r.a.x,r.b.x)))-x0,h=Math.min(H,Math.round(Math.max(r.a.y,r.b.y)))-y0;if(w<4||h<4)return;snap();const c=cvs(w,h);c.getContext('2d').putImageData(L().getImageData(x0,y0,w,h),0,0);L().clearRect(x0,y0,w,h);fl={c,src:null,x:x0+w/2,y:y0+h/2,s:1,r:0,o:1,sn:1,crop:0}},
    cancel=()=>{if(!fl)return;const sn=fl.sn;fl=null;if(sn&&undo.length){const u=undo.pop();layers[u.i].c.getContext('2d').putImageData(u.d,0,0)}rd();save()},
    crop=()=>{fl.crop=(fl.crop+1)%4;const R=[0,1,.75,4/3][fl.crop],s=fl.src;if(!R){fl.c=s;return}let cw=s.width,ch=s.height;if(cw/ch>R)cw=ch*R;else ch=cw/R;const c=cvs(Math.round(cw),Math.round(ch));c.getContext('2d').drawImage(s,(s.width-cw)/2,(s.height-ch)/2,cw,ch,0,0,c.width,c.height);fl.c=c},
    h2x=(h,s,l)=>{s/=100;l/=100;const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1))))};return'#'+[f(0),f(8),f(4)].map(v=>v.toString(16).padStart(2,'0')).join('')},
    ptrs=new Map();let pin=null;
    vp.addEventListener('pointerdown',e=>{vp.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,e);if(ptrs.size===2){drawing=false;sh=null;mv=null;const[a,b]=[...ptrs.values()];pin={d:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),z,px,py,cx:(a.clientX+b.clientX)/2,cy:(a.clientY+b.clientY)/2};return}if(ptrs.size>1)return;
      const p=pt(e);if(fl&&tool!=='sel')commit();if(tool==='sel'){drawing=true;if(fl)mv={dx:p.x-fl.x,dy:p.y-fl.y};else sh={a:p,b:p};return}if(tool==='pick'){const f=flat().getContext('2d').getImageData(p.x|0,p.y|0,1,1).data;if(f[3]){col='#'+[f[0],f[1],f[2]].map(v=>v.toString(16).padStart(2,'0')).join('');tool='pen'}bar();return}
      if(tool==='fill'){fill(p);rd();save();return}if(!layers[cur].v){toast('此圖層已隱藏','info');return}snap();drawing=true;last=lm=p;if(['line','rect','ellipse'].includes(tool))sh={a:p,b:p};else{stroke(p,{x:p.x+.01,y:p.y});rd()}});
    vp.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,e);if(ptrs.size===2&&pin){const[a,b]=[...ptrs.values()],d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),cx=(a.clientX+b.clientX)/2,cy=(a.clientY+b.clientY)/2,nz=clamp(pin.z*d/pin.d,.3,12),r=vp.getBoundingClientRect();px=cx-r.left-(pin.cx-r.left-pin.px)*nz/pin.z;py=cy-r.top-(pin.cy-r.top-pin.py)*nz/pin.z;z=nz;tf();return}
      if(!drawing)return;const p=pt(e);if(mv){fl.x=p.x-mv.dx;fl.y=p.y-mv.dy;rd();return}if(sh){sh.b=p}else{const m={x:(last.x+p.x)/2,y:(last.y+p.y)/2};stroke(lm,m,last);lm=m;last=p}rd()});
    const up=e=>{ptrs.delete(e.pointerId);if(ptrs.size<2)pin=null;if(!drawing||ptrs.size)return;drawing=false;if(!sh&&(tool==='pen'||tool==='eraser')&&lm)stroke(lm,last);if(mv){mv=null;rd();return}if(sh&&tool==='sel'){lift(sh);sh=null;rd();return}if(sh){const x=L();x.save();x.strokeStyle=col;x.lineWidth=size;x.lineCap='round';shape(x,sh);x.restore();sh=null}rd();save();bar()};
    vp.addEventListener('pointerup',up);vp.addEventListener('pointercancel',up);
    const dot=()=>{const d=$('#szDot',ov);if(d){const v=Math.max(3,Math.min(32,size));d.style.width=d.style.height=v+'px';d.style.background=tool==='eraser'?'transparent':col;d.style.outline=tool==='eraser'?'2px dashed var(--ink-2)':'none'}const v=$('#szV',ov);if(v)v.textContent=size};
    const PAL=['#2b2430','#ffffff','#e8607a','#f4a261','#f6d365','#7ac77a','#4fb9a0','#6fa8e8','#7f8cd8','#b58be0','#a0705a','#f7c6d0'];
    const bar=()=>{fbar=!!fl;$('#tTop',ov).innerHTML=`<button data-x="close">${ic('x',18)}</button><button data-x="undo">${ic('undo',18)}</button><button data-x="redo">${ic('redo',18)}</button><span style="flex:1"></span><button data-x="layers">圖層 ${cur+1}</button><button data-x="more">⋯</button><button data-x="done" style="background:var(--accent);color:var(--on-accent)">完成</button>`;
      if(fl){$('#tBot',ov).innerHTML=`<button data-x="fz" data-v="1.15">＋</button><button data-x="fz" data-v=".87">－</button><button data-x="fr">⟳</button><button data-x="fo">透明${Math.round(fl.o*100)}%</button>${fl.src?'<button data-x="fc">裁切</button>':''}<button data-x="fok" style="background:var(--accent);color:var(--on-accent)">${ic('check',16)} 確定</button><button data-x="fno">取消</button>`;return}
      $('#tBot',ov).innerHTML=`<div class="c4-r">${[['pen',ic('pen',20)],['eraser',ic('eraser',20)],['fill',ic('bucket',20)],['pick',ic('pick',20)],['line',ic('line',20)],['rect',ic('rect',20)],['ellipse',ic('oval',20)],['sel',ic('marquee',20)]].map(t=>`<button class="tl ${tool===t[0]?'on':''}" data-t="${t[0]}">${t[1]}</button>`).join('')}</div>
      <div class="c4-r"><span class="c4-dotw"><i id="szDot"></i></span><input class="c4-sz" id="szR" type="range" min="1" max="100" value="${size}" aria-label="筆刷大小"><b id="szV" style="width:30px;text-align:right;font-size:13px">${size}</b></div>
      <div class="c4-r"><button class="c4-cur" data-x="pal" aria-label="調色盤" style="background:${col}"></button><div class="c4-sws">${PAL.concat(getPal()).map(c=>`<button class="c4-sw ${c===col?'on':''}" data-c="${c}" style="background:${c}"></button>`).join('')}</div></div>`;dot()};
    const lay=()=>{const m=openSheet('<div class="sh-body" id="lyB"></div>'),B=$('#lyB',m.el);const dr=()=>{B.innerHTML='<div class="sh-title">圖層（下→上）</div>'+layers.map((l,i)=>`<div class="c4-row" style="grid-template-columns:1fr repeat(4,48px);align-items:center"><button class="c4-b ${i===cur?'p':''}" data-s="${i}">圖層 ${i+1}</button><button class="c4-b" data-v="${i}">${l.v?ic('eye',16):ic('eyeoff',16)}</button><button class="c4-b" data-u="${i}">${ic('up',16)}</button><button class="c4-b" data-d="${i}">${ic('down',16)}</button><button class="c4-b" data-r="${i}">${ic('trash',16)}</button></div>`).join('')+'<div class="c4-row"><button class="c4-b" data-n="1">＋ 新增圖層（最多 5）</button></div>'};dr();
      B.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;let ch=0;
        if(d.s!=null)cur=+d.s;else if(d.v!=null){layers[+d.v].v=!layers[+d.v].v;ch=1}
        else if(d.u!=null||d.d!=null){const i=+(d.u??d.d),j=d.u!=null?i+1:i-1;if(j>=0&&j<layers.length){[layers[i],layers[j]]=[layers[j],layers[i]];if(cur===i)cur=j;else if(cur===j)cur=i;undo=[];redo=[];ch=1}}
        else if(d.r!=null){if(layers.length>1){layers.splice(+d.r,1);cur=Math.min(cur,layers.length-1);undo=[];redo=[];ch=1}else toast('至少保留一個圖層','info')}
        else if(d.n&&layers.length<5){layers.push({c:mk(),v:1});cur=layers.length-1;ch=1}
        dr();bar();rd();if(ch)save()})},
    x2h=hx=>{const r=parseInt(hx.slice(1,3),16)/255,g=parseInt(hx.slice(3,5),16)/255,b=parseInt(hx.slice(5,7),16)/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0;if(d){h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;if(h<0)h+=360}return[h,mx?d/mx:0,mx]},
    v2x=(h,s,v)=>{const f=n=>{const k=(n+h/60)%6;return Math.round(255*(v-v*s*Math.max(0,Math.min(k,4-k,1))))};return'#'+[f(5),f(3),f(1)].map(q=>q.toString(16).padStart(2,'0')).join('')},
    pal=()=>{let[h,sa,v]=x2h(col);const S=270,C=S/2,R=C-3,r1=R-30,hf=r1*.7;
      const m=openSheet('<div class="sh-body" id="plB"></div>'),B=$('#plB',m.el);
      B.innerHTML=`<div class="sh-title">調色盤</div><div style="display:flex;justify-content:center"><canvas id="wh" width="${S*2}" height="${S*2}" style="width:${S}px;height:${S}px;touch-action:none"></canvas></div>
      <div class="c4-r" style="margin-top:10px"><span id="plC" style="display:block;width:44px;height:44px;border-radius:14px;flex:none;border:3px solid var(--surface);outline:2px solid var(--accent);background:${col}"></span><b id="plH" style="flex:1;font-size:14px"></b><button class="c4-b" data-save style="padding:0 14px">收藏</button><button class="c4-b p" data-close style="padding:0 18px">完成</button></div>
      <div class="ed-l">我的顏色</div><div class="c4-sws" id="plS"></div>`;
      const cv2=$('#wh',B),x=cv2.getContext('2d');x.scale(2,2);
      const saved=()=>{$('#plS',B).innerHTML=getPal().map(c=>`<button class="c4-sw" data-c="${c}" style="background:${c}"></button>`).join('')||'<small style="color:var(--ink-3)">尚未收藏</small>'};
      const draw=()=>{x.clearRect(0,0,S,S);
        for(let a=0;a<360;a+=1){x.beginPath();x.arc(C,C,(R+r1)/2,(a-91)*Math.PI/180,(a-89)*Math.PI/180);x.lineWidth=R-r1;x.strokeStyle=`hsl(${a},100%,50%)`;x.stroke()}
        x.save();x.translate(C-hf,C-hf);x.fillStyle=`hsl(${h},100%,50%)`;x.fillRect(0,0,hf*2,hf*2);
        let g=x.createLinearGradient(0,0,hf*2,0);g.addColorStop(0,'#fff');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,hf*2,hf*2);
        g=x.createLinearGradient(0,0,0,hf*2);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'#000');x.fillStyle=g;x.fillRect(0,0,hf*2,hf*2);
        x.beginPath();x.arc(sa*hf*2,(1-v)*hf*2,9,0,7);x.lineWidth=3;x.strokeStyle='#fff';x.stroke();x.lineWidth=1.2;x.strokeStyle='#0008';x.stroke();x.restore();
        const an=(h-90)*Math.PI/180,rm=(R+r1)/2;x.save();x.translate(C+Math.cos(an)*rm,C+Math.sin(an)*rm);x.rotate(an);x.beginPath();x.roundRect(-(R-r1)/2-2,-4,R-r1+4,8,3);x.fillStyle=`hsl(${h},100%,50%)`;x.fill();x.lineWidth=3;x.strokeStyle='#fff';x.stroke();x.lineWidth=1;x.strokeStyle='#0008';x.stroke();x.restore();
        $('#plC',B).style.background=col;$('#plH',B).textContent=col.toUpperCase()};
      const apply=()=>{col=v2x(h,sa,v);if(tool==='eraser')tool='pen';draw();bar()};
      let mode=null;const pos=e=>{const r=cv2.getBoundingClientRect();return{x:(e.clientX-r.left)*S/r.width-C,y:(e.clientY-r.top)*S/r.height-C}};
      const upd=e=>{const q=pos(e);if(mode==='ring'){h=(Math.atan2(q.y,q.x)*180/Math.PI+90+360)%360}else if(mode==='sv'){sa=Math.max(0,Math.min(1,(q.x+hf)/(hf*2)));v=1-Math.max(0,Math.min(1,(q.y+hf)/(hf*2)))}apply()};
      cv2.addEventListener('pointerdown',e=>{const q=pos(e),d=Math.hypot(q.x,q.y);if(d>=r1-6&&d<=R+8)mode='ring';else if(Math.abs(q.x)<=hf+8&&Math.abs(q.y)<=hf+8)mode='sv';else return;e.preventDefault();cv2.setPointerCapture(e.pointerId);upd(e)});
      cv2.addEventListener('pointermove',e=>{if(mode)upd(e)});const end=()=>{mode=null};cv2.addEventListener('pointerup',end);cv2.addEventListener('pointercancel',end);
      B.addEventListener('click',e=>{const c=e.target.closest('[data-c]');if(c){col=c.dataset.c;[h,sa,v]=x2h(col);draw();bar();return}if(e.target.closest('[data-save]')){const A=getPal().filter(q=>q!==col);A.unshift(col);try{localStorage.setItem('ocs.pal',JSON.stringify(A.slice(0,12)))}catch(er){}saved();bar();toast('已收藏顏色','check')}});
      draw();saved()};
    bar();rs();
    ov.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
      if(d.t){if(fl&&d.t!=='sel')commit();tool=d.t;if(d.t==='sel')toast('拖曳框出要移動的區域','info');bar()}else if(d.c){col=d.c;if(tool==='eraser')tool='pen';bar()}
      else if((d.x==='undo'||d.x==='redo')&&fl&&!fl.sn){fl=null;rd()}
      else if(d.x==='fz'){fl.s=clamp(fl.s*(+d.v),.05,10);rd()}
      else if(d.x==='fr'){fl.r+=Math.PI/12;rd()}
      else if(d.x==='fo'){fl.o=fl.o<=.25?1:fl.o-.25;rd();bar()}
      else if(d.x==='fc'){crop();rd()}
      else if(d.x==='fok')commit()
      else if(d.x==='fno')cancel()
      else if(d.x==='pal')pal()
      else if(d.x==='undo'&&undo.length){fl=null;const u=undo.pop();redo.push({i:u.i,d:layers[u.i].c.getContext('2d').getImageData(0,0,W,H)});layers[u.i].c.getContext('2d').putImageData(u.d,0,0);rd();save()}
      else if(d.x==='redo'&&redo.length){fl=null;const u=redo.pop();undo.push({i:u.i,d:layers[u.i].c.getContext('2d').getImageData(0,0,W,H)});layers[u.i].c.getContext('2d').putImageData(u.d,0,0);rd();save()}
      else if(d.x==='layers'){if(fl)commit();lay()}
      else if(d.x==='more'){const m=openSheet(`<div class="sh-body"><div class="sh-title">更多</div><div class="c4-row"><button class="c4-b" data-m="vis">顯示／隱藏目前圖層</button><button class="c4-b" data-m="clr">清除目前圖層</button><button class="c4-b" data-m="rot">旋轉目前圖層 90°</button><button class="c4-b" data-m="fit">重設檢視</button><button class="c4-b" data-m="sz">畫布尺寸 ${W}²</button><button class="c4-b" data-m="col">自訂顏色</button></div></div>`);
        m.el.addEventListener('click',e2=>{const k=e2.target.closest('[data-m]');if(!k)return;const a=k.dataset.m;m.close();
          if(a==='vis'){layers[cur].v=!layers[cur].v;rd();save()}else if(a==='clr'){snap();L().clearRect(0,0,W,H);rd();save()}else if(a==='fit')rs();
          else if(a==='rot'){snap();const t=cvs(W,H),x=t.getContext('2d');x.translate(W/2,H/2);x.rotate(Math.PI/2);x.drawImage(layers[cur].c,-W/2,-H/2);L().clearRect(0,0,W,H);L().drawImage(t,0,0);rd();save()}
          else if(a==='sz'){if(undo.length||layers.some(l=>l.c.getContext('2d').getImageData(0,0,1,1).data[3]))toast('請在空白畫布時調整尺寸','info');else{W=H=W===256?384:W===384?128:256;layers.forEach(l=>{l.c.width=W;l.c.height=H});rs()}}
          else if(a==='col'){const i=document.createElement('input');i.type='color';i.value=col;i.oninput=()=>{col=i.value;bar()};i.click()}})}
      else if(d.x==='close'){if(dirty&&!await confirmSheet({title:'離開繪畫',msg:'作品已自動存為草稿，可稍後繼續。離開？',ok:'離開',danger:false}))return;ov.remove()}
      else if(d.x==='done'){if(fl)commit();clearTimeout(save.t);const th=thumb(192);Art.put({id,w:W,h:H,name,t:Date.now(),layers:layers.map(l=>l.c.toDataURL()),thumb:th});if(!o.art)Art.del('draft');ov.remove();this.form({img:th,art:id,pid:o.pid||(Cat.d.products.find(p=>p.art===id)||{}).id})}});
    ov.addEventListener('input',e=>{if(e.target.id==='szR'){size=+e.target.value;dot()}});
    window.addEventListener('resize',rs)},
  form(o){const p=o.pid&&Cat.prod(o.pid),it=p&&Items.get(p.itemId),f=it?JSON.parse(JSON.stringify(it)):{name:'',emoji:'',cat:'food',tags:[],desc:'',uses:[{type:'food',fx:{hearts:2,mood:'happy'}}],target:'both',consume:true};f.img=o.img;
    const s=openSheet('<div class="sh-body" id="fmB"></div>');const B=$('#fmB',s.el);
    const draw=()=>{B.innerHTML=`<div class="sh-title">${p?'修改商品':'登錄商品'}</div><div style="text-align:center;height:84px">${Items.icon(f)}</div><input class="c4-in" id="fN" maxlength="16" placeholder="名稱" value="${esc(f.name)}"><textarea class="c4-in" id="fD" maxlength="120" placeholder="介紹">${esc(f.desc)}</textarea><input class="c4-in" id="fT" placeholder="標籤（例：甜點,草莓,甜味）" value="${esc(f.tags.join(','))}">
      <div class="ed-l">類別（同時決定用途）</div><div class="ed-ch">${ICATS.map(c=>`<button class="chip ${f.cat===c?'on':''}" data-cat="${c}">${ITYPES[c][0]}</button>`).join('')}</div>
      <div class="ed-l">互動效果：愛心 ${f.uses[0].fx.hearts}</div><div class="ed-ch">${[1,2,3,4].map(n=>`<button class="chip ${f.uses[0].fx.hearts===n?'on':''}" data-h="${n}">${n}</button>`).join('')}<button class="chip ${f.consume?'on':''}" data-cons>使用後消耗</button></div>
      <p class="dt-p">商品會加入商店，基礎售價 ${ocsCoin()} ${p?p.price:BASE_PRICE}。登錄不會增加持有數量。</p><div class="dt-row"><button class="btn grow" data-close>取消</button><button class="btn grow primary" data-ok>登錄</button></div>`};
    const grab=()=>{f.name=$('#fN',B).value.trim();f.desc=$('#fD',B).value;f.tags=$('#fT',B).value.split(/[,，、]/).map(x=>x.trim()).filter(Boolean)};draw();
    B.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;grab();const d=b.dataset;
      if(d.cat){f.cat=d.cat;f.uses=[{type:d.cat,fx:{hearts:f.uses[0].fx.hearts,mood:f.uses[0].fx.mood}}];draw()}else if(d.h){f.uses.forEach(u=>u.fx.hearts=+d.h);draw()}else if(d.cons!==undefined){f.consume=!f.consume;draw()}
      else if(d.ok!==undefined){if(!f.name){toast('請輸入名稱','info');return}Cat.register(Object.assign(f,{art:o.art,src:o.art?'draw':'import'}),o.pid);if(o.art)Art.get(o.art).then(a=>{if(a){a.name=f.name.slice(0,16);Art.put(a)}}).catch(()=>{});toast(p?'商品已更新':'已登錄到商店','check');s.close();setTimeout(()=>Shop.open(),300)}})}};
/* 整合：商店入口、背包禁止造物 */
Items.qty=function(){};
const getPal=()=>{try{const a=JSON.parse(localStorage.getItem('ocs.pal'));return Array.isArray(a)?a.filter(c=>/^#[0-9a-f]{6}$/i.test(c)).slice(0,8):[]}catch(e){return[]}};
{const _c=Eco.claim.bind(Eco),RW={pet:'小花束',water:'蘋果'};Eco.claim=function(id){const was=this.v.q.done[id];_c(id);if(!was&&this.v.q.done[id]){const it=Items.d.items.find(i=>i.builtin&&i.name===RW[id]);if(it&&Inv.grant(it.id,1,'quest'))setTimeout(()=>toast(`獲得物品：${it.name}`,'sparkle'),900)}}}
{const _im=Items.importData.bind(Items);Items.importData=function(doc,replace){if(!replace&&doc&&Array.isArray(doc.items))doc.items.forEach(i=>{if(i)i.qty=0});const n=_im(doc,replace);Cat.load();return n}}
{const _a=infoSheet;infoSheet=function(it,x){if(it&&it.t==='商店'){Shop.open();return}return _a(it,x)}}
window.addEventListener('popstate',()=>{const o=$('.c4-ov');if(o&&!history.state)o.remove()});
{const t=setInterval(()=>{try{if(Items.d.ui.seeded){clearInterval(t);Cat.load();Studio4.mount()}}catch(e){}},120)}
