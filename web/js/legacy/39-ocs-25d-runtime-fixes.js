/* Minimal, additive fixes. Existing saved characters/items/scene placements are unchanged. */
(()=>{'use strict';
 const ready=()=>{
   if(!window.OCSCommunity?.ready||!window.OCS24D?.Dress?.sync||!window.OCS24D?.Room?.light||(typeof Env==='undefined'||!Env.paint))return false;
   const R=OCS24D.Room,D=OCS24D.Dress;
   // Do not force GPU style/texture invalidations on every 400ms furniture light tick.
   R.light=function(){
     const st=this.st;if(!st)return;
     const ph=st.phase||'day',w=Env.wid||'sunny',rain=(w==='rain'||w==='storm'),
       lt=(ph==='night'?.78:ph==='dusk'?.93:ph==='dawn'?.95:1)*(rain?.94:1),
       ga=ph==='night'?.7:ph==='dusk'?.55:.28,
       sho=ph==='night'?.45:ph==='dusk'?.75:1,
       shx=ph==='dawn'?'-7%':ph==='dusk'?'7%':'0%';
     this.els.forEach(e=>{
       const values={'--lt':String(lt),'--ga':String(ga),'--sho':String(sho),'--shx':shx};
       for(const k in values)if(e.style.getPropertyValue(k)!==values[k])e.style.setProperty(k,values[k]);
     });
   };
   // Reconcile individual worn-item nodes, instead of clearing BOTH entire
   // dress layers on every walk/idle/emotion switch (which made items blink).
   D.sync=function(st,list,sel,pop){
     if(!st?.ch||!st.art)return;
     const L=this.ensure(st);if(!L)return;
     const E=OCS24D.Ed,k=this.key(st),f=this.fl(st),editing=E.on&&E.st===st;
     list=list||this.worn(st.ch.id);
     const state=JSON.stringify([list,sel,Items.d.items.length,k,f,editing]);
     st._hk=k+'|'+f;
     if(pop==null&&st._dk===state)return;
     st._dk=state;
     const used=new Set();
     [...list].map((w,n)=>({w,n})).sort((a,b)=>(+a.w.z||0)-(+b.w.z||0)).forEach(({w,n})=>{
       const item=Items.get(w.i);if(!item)return;
       const parent=w.z<0?L.b:L.f,key=w.i+'|'+n;
       let e=[...L.b.children,...L.f.children].find(x=>x.classList?.contains('dr-it')&&x.dataset.wearKey===key);
       if(!e){e=document.createElement('div');e.className='dr-it';e.dataset.wearKey=key}
       used.add(e);
       const offset=this.off(w,k,f),hidden=!editing&&k&&(w.h||[]).includes(k);
       const cls='dr-it'+(n===sel?' sel':'')+(pop===n?' pop':'')+(hidden?' hid':'');
       if(e.className!==cls)e.className=cls;
       const styles={'--s':w.s,'--r':w.r+'deg','--f':w.f,left:(w.x+(offset?offset[0]:0))*100+'%',top:(w.y+(offset?offset[1]:0))*100+'%'};
       for(const key in styles){const v=String(styles[key]);if(key.startsWith('--')){if(e.style.getPropertyValue(key)!==v)e.style.setProperty(key,v)}else if(e.style[key]!==v)e.style[key]=v}
       const imgSignature=JSON.stringify([item.id,item.thumb,item.icon,item.emoji,item.img,item.url,item.art,item.data,item.name]);
       if(e._imgSignature!==imgSignature){e.innerHTML=Items.icon(item);e._imgSignature=imgSignature}
       if(e.parentNode!==parent)parent.appendChild(e);
     });
     [L.b,L.f].forEach(p=>p.querySelectorAll(':scope>.dr-it').forEach(e=>{if(!used.has(e))e.remove()}));
   };
   // Keep shortcut-bag item nodes mounted across quantities, economy and favorite
   // updates. Rebuilding the entire strip made images visibly flash on each emit.
   Bag.render=function(){
     const u=Items.d.ui,L=[Items.common(),Items.recent(),Items.favs().filter(i=>1)][u.tab]||[];
     document.querySelectorAll('#qbT button').forEach(b=>b.classList.toggle('on',+b.dataset.t===u.tab));
     const count=document.querySelector('#qbN');if(count)count.textContent=Items.d.items.reduce((a,i)=>a+(+i.qty||0),0)||'';
     const host=document.querySelector('#qbL');if(!host)return;
     const old=new Map([...host.querySelectorAll(':scope>.it[data-id]')].map(e=>[e.dataset.id,e]));
     if(!L.length){const msg=['還沒有物品','還沒使用過','長按物品可收藏'][u.tab];if(host.querySelector('.qb-empty')?.textContent!==msg)host.innerHTML='<div class="qb-empty">'+msg+'</div>';requestAnimationFrame(()=>this.place());return}
     host.querySelector('.qb-empty')?.remove();
     L.forEach((it,index)=>{
       let node=old.get(String(it.id));
       if(!node){node=el(`<div class="it" data-id="${esc(it.id)}"><span class="q"></span></div>`);Drag.bind(node,it.id,{delay:210,onTap:()=>Items.tap(it.id)})}
       node.classList.toggle('zero',it.qty<=0);
       if(node.title!==it.name)node.title=it.name;
       const signature=JSON.stringify([it.id,it.img,it.emoji,it.icon,it.thumb,it.art,it.data]);
       if(node._itemSignature!==signature){
         node.innerHTML=Items.icon(it)+'<span class="q"></span>';
         node._itemSignature=signature;
       }
       let badge=node.querySelector(':scope>.f');
       if(it.fav&&!badge)node.insertAdjacentHTML('afterbegin','<span class="f">'+ic('starf')+'</span>');
       else if(!it.fav&&badge)badge.remove();
       const qty=node.querySelector(':scope>.q');if(qty&&qty.textContent!==String(it.qty))qty.textContent=it.qty;
       if(host.children[index]!==node)host.insertBefore(node,host.children[index]||null);
       old.delete(String(it.id));
     });
     old.forEach(node=>node.remove());
     requestAnimationFrame(()=>this.place());
   };
   // Keep the environment palette at a consistent 30 Hz rather than irregular
   // mid-frame CSS rasterization. Animation canvas and actor clocks stay independent.
   const paint=Env.paint.bind(Env);
   Env.paint=function(){const t=performance.now();if(this._paintAt&&t-this._paintAt<34){this.dirty=1;return}this._paintAt=t;return paint()};
   // Make navigation changes close any accidentally retained invisible floating menu.
   const go=Nav.go.bind(Nav);
   Nav.go=function(i){const result=go(...arguments);if(i!==0){document.querySelector('#fab')?.classList.remove('open');document.querySelector('#qbag')?.classList.remove('drag-hover');OCSCamera?.root?.classList.remove('cam-panning')}return result};
   return true;
 };
 let attempts=0;const t=setInterval(()=>{try{if(ready()||++attempts>=100)clearInterval(t)}catch(e){console.warn('[OC Shimeji 2.5D] polish integration:',e);clearInterval(t)}},100);
})();
