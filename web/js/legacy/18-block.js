/* ===== 底部導覽列：自訂顯示 / 拖曳排序 ===== */
(()=>{const K='ocs.nav.v1',nav=document.getElementById('nav'),ind=document.getElementById('navInd');if(!nav||nav.dataset.nxReady)return;nav.dataset.nxReady='1';
 const EXTRA=['shop','quest','codex','set'],XI={shop:['store','商店'],quest:['quest','任務'],codex:['book','圖鑑'],set:['sliders','設定']};
 EXTRA.forEach(k=>{if(nav.querySelector('[data-nact="x-'+k+'"]'))return;const b=document.createElement('button');b.className='nav-btn nx-off';b.dataset.nact='x-'+k;b.setAttribute('aria-label',XI[k][1]);b.innerHTML='<span data-ic="'+XI[k][0]+'">'+(typeof ic==='function'?ic(XI[k][0]):'')+'</span>';nav.append(b)});
 nav.addEventListener('click',e=>{const b=e.target.closest('[data-nact^="x-"]');if(!b)return;e.stopImmediatePropagation();e.preventDefault();const k=b.dataset.nact.slice(2);({shop:()=>Shop.open(),quest:()=>openQuests(),codex:()=>window.L30UI&&L30UI.codex(),set:()=>Settings.open()})[k]()},true);
 const DEF=['home','chars','studio','explore','more',...EXTRA],SEL={home:'[data-tab="0"]',chars:'[data-tab="1"]',studio:'[data-tab="2"]',explore:'[data-tab="3"]',more:'[data-nact="more"]',shop:'[data-nact="x-shop"]',quest:'[data-nact="x-quest"]',codex:'[data-nact="x-codex"]',set:'[data-nact="x-set"]'},LOCK={more:1},MAXV=6,MINV=2;
 const btn=k=>nav.querySelector(SEL[k]),lab=k=>(btn(k).getAttribute('aria-label')||k);
 let st={order:DEF.slice(),hide:EXTRA.slice(),lab:false,ver:2};try{const o=JSON.parse(localStorage.getItem(K));if(o&&Array.isArray(o.order)){const od=[...new Set(o.order.filter(k=>DEF.includes(k)))];DEF.forEach(k=>{if(!od.includes(k))od.push(k)});st={order:od,lab:!!o.lab,ver:2,hide:[...new Set((Array.isArray(o.hide)?o.hide:[]).concat(o.ver===2?[]:EXTRA))].filter(k=>DEF.includes(k)&&!LOCK[k])}}}catch(e){}
 const save=()=>{try{localStorage.setItem(K,JSON.stringify(st))}catch(e){}};
 const place=()=>{const b=nav.querySelector('.nav-btn.on:not(.nx-off)');if(!b||!b.offsetWidth){ind.style.opacity='0';return}ind.style.opacity='';ind.style.transform='none';ind.style.left=b.offsetLeft+'px';ind.style.width=b.offsetWidth+'px'};
 const apply=()=>{st.order.forEach(k=>{const b=btn(k);if(b)nav.append(b)});let n=0;DEF.forEach(k=>{const off=st.hide.includes(k);btn(k).classList.toggle('nx-off',off);if(!off)n++});nav.style.setProperty('--n',n);nav.classList.toggle('nx-few',n<6);nav.classList.toggle('nx-lab',!!st.lab);requestAnimationFrame(place)};
 const Nv=window.Nav||(typeof Nav!=='undefined'?Nav:null);
 if(typeof Nav!=='undefined'){const g=Nav.go;Nav.go=function(){const r=g.apply(this,arguments);place();return r}}
 try{new ResizeObserver(place).observe(nav)}catch(e){}addEventListener('resize',place);addEventListener('load',()=>setTimeout(place,200));
 /* 通用拖曳排序 */
 const dragSort=(e0,node,box,sel,X,done)=>{const pc=e=>X?e.clientX:e.clientY,ctr=n=>X?n.offsetLeft+n.offsetWidth/2:n.offsetTop+n.offsetHeight/2,org=()=>{const r=box.getBoundingClientRect();return X?r.left:r.top};
  const vis=()=>[...box.querySelectorAll(sel)].filter(n=>!n.classList.contains('nx-off'));
  const grab=pc(e0)-org()-ctr(node);node.classList.remove('nx-settle');node.classList.add('nx-drag');let moved=false;
  const mv=e=>{const want=pc(e)-org()-grab,v=vis(),i=v.indexOf(node),nx=v[i+1],pv=v[i-1];if(Math.abs(pc(e)-pc(e0))>6)moved=true;
   if(nx&&want>ctr(nx)){nx.after(node);if(navigator.vibrate)try{navigator.vibrate(4)}catch(_){}}else if(pv&&want<ctr(pv)){pv.before(node);if(navigator.vibrate)try{navigator.vibrate(4)}catch(_){}}
   node.style.translate=X?`${want-ctr(node)}px 0`:`0 ${want-ctr(node)}px`;if(e.preventDefault&&e.cancelable)e.preventDefault()};
  const up=()=>{removeEventListener('pointermove',mv,true);removeEventListener('pointerup',up,true);removeEventListener('pointercancel',up,true);
   node.classList.remove('nx-drag');node.classList.add('nx-settle');node.style.translate='0 0';setTimeout(()=>{node.classList.remove('nx-settle');node.style.translate=''},320);done(moved)};
  addEventListener('pointermove',mv,true);addEventListener('pointerup',up,true);addEventListener('pointercancel',up,true);mv(e0)};
 const saveOrderFrom=nodes=>{const o=nodes.map(n=>n.dataset.k).filter(Boolean);st.order=[...new Set(o.concat(st.order))];save();apply()};
 /* 導覽列長按拖曳 */
 let jd=false;document.addEventListener('click',e=>{if(jd&&e.target.closest&&e.target.closest('#nav')){e.stopImmediatePropagation();e.preventDefault()}},true);
 let hold=null;
 nav.addEventListener('pointerdown',e=>{const b=e.target.closest('.nav-btn');if(!b||e.button>0)return;const sx=e.clientX,sy=e.clientY,ev0=e;
  const key=DEF.find(k=>btn(k)===b);hold={t:setTimeout(()=>{if(!hold)return;hold.live=true;nav.classList.add('nx-edit');if(navigator.vibrate)try{navigator.vibrate(12)}catch(_){}
    b.dataset.k=key;nav.querySelectorAll('.nav-btn').forEach(x=>{x.dataset.k=DEF.find(k=>btn(k)===x)});
    dragSort({clientX:sx,clientY:sy},b,nav,'.nav-btn',true,moved=>{nav.classList.remove('nx-edit');jd=true;setTimeout(()=>jd=false,80);hold=null;
     if(moved)saveOrderFrom([...nav.querySelectorAll('.nav-btn')]);else openCfg()})},380),sx,sy}});
 nav.addEventListener('pointermove',e=>{if(hold&&!hold.live&&Math.hypot(e.clientX-hold.sx,e.clientY-hold.sy)>9){clearTimeout(hold.t);hold=null}});
 const cancel=()=>{if(hold&&!hold.live){clearTimeout(hold.t);hold=null}};nav.addEventListener('pointerup',cancel);nav.addEventListener('pointercancel',cancel);
 nav.addEventListener('contextmenu',e=>e.preventDefault());
 /* 自訂面板 */
 function openCfg(){const s=openSheet('<div class="sh-body" id="nxB"></div>');const B=document.getElementById('nxB');
  const draw=()=>{B.innerHTML=`<div class="sh-title">自訂導覽列</div><p class="nx-hint">按住 ≡ 拖曳調整順序，開關決定是否顯示；也可以直接長按底部導覽列拖曳。最多顯示 6 個、至少 2 個；「更多」固定保留，隱藏的主要項目可在「更多」中找到。也可以加入商店、任務、圖鑑、設定等快捷項目。</p>
   <div class="nx-list" id="nxL">${st.order.map(k=>`<div class="nx-row ${st.hide.includes(k)?'off':''}" data-k="${k}"><span class="nx-h" aria-label="拖曳排序">≡</span><span class="nx-i">${btn(k).querySelector('[data-ic]').innerHTML}</span><b>${lab(k)}</b><button class="nx-sw ${st.hide.includes(k)?'':'on'}" data-sw="${k}" ${LOCK[k]?'disabled':''} aria-label="顯示"></button></div>`).join('')}</div>
   <div class="nx-opt"><b>顯示文字標籤<small>在圖示下方顯示名稱</small></b><button class="nx-sw ${st.lab?'on':''}" data-lab="1" aria-label="文字標籤"></button></div><div class="nx-act"><button class="btn" data-r="1">恢復預設</button><button class="btn primary" data-close>完成</button></div>`};
  draw();B.addEventListener('pointerdown',e=>{const h=e.target.closest('.nx-h');if(!h)return;const row=h.closest('.nx-row');e.preventDefault();dragSort(e,row,document.getElementById('nxL'),'.nx-row',false,()=>saveOrderFrom([...B.querySelectorAll('.nx-row')]))});
  B.addEventListener('click',e=>{const w=e.target.closest('[data-sw]');if(e.target.closest('[data-lab]')){st.lab=!st.lab;save();apply();draw();return}
   if(w){const k=w.dataset.sw,shown=DEF.filter(x=>!st.hide.includes(x)).length;if(st.hide.includes(k)&&shown>=MAXV){toast('最多同時顯示 '+MAXV+' 個，請先隱藏其他項目','info');return}if(!st.hide.includes(k)&&shown<=MINV){toast('至少保留 '+MINV+' 個項目','info');return}st.hide=st.hide.includes(k)?st.hide.filter(x=>x!==k):st.hide.concat(k);save();apply();draw();return}
   if(e.target.closest('[data-r]')){st={order:DEF.slice(),hide:EXTRA.slice(),lab:false,ver:2};save();apply();draw()}})}
 window.openNavCfg=openCfg;
 /* 「更多」選單：自訂入口＋隱藏項目的捷徑 */
 if(typeof openMore==='function'){const _m=openMore;openMore=function(){const r=_m.apply(this,arguments);try{const sh=[...document.querySelectorAll('#layer .sheet')].pop(),g=sh&&sh.querySelector('.group');if(g&&!g.querySelector('[data-nx=cfg]')){
   const mk=(k,t,sub,ic)=>{const x=document.createElement('button');x.className='row btn-row';x.dataset.nx=k;x.innerHTML=`<span class="r-ic">${ic}</span><div class="r-t"><b>${t}</b><small>${sub}</small></div>`;return x};
   const hid=DEF.filter(k=>st.hide.includes(k)&&!EXTRA.includes(k)).map(k=>mk(k,lab(k),'已從導覽列隱藏',btn(k).querySelector('[data-ic]').innerHTML));
   g.prepend(...hid,mk('cfg','自訂導覽列','調整順序與顯示項目','≡'));
   g.addEventListener('click',e=>{const b=e.target.closest('[data-nx]');if(!b)return;e.stopPropagation();const k=b.dataset.nx,sc=[...document.querySelectorAll('#layer .scrim')].pop();if(sc)sc.click();
    setTimeout(()=>{if(k==='cfg')openCfg();else{const bt=btn(k);bt.classList.remove('nx-off');bt.click();if(st.hide.includes(k))bt.classList.add('nx-off')}},280)},true)}}catch(e){}return r}}
 apply();
})();
