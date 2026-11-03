/* ===== 2.5b 柔和轉場・圖標統一・儲存空間提示 ===== */
(()=>{
/* 儲存空間不足：瀏覽器 localStorage 約 5MB，圖片物品最占空間；每次存檔失敗都會提示，現改為每 2 分鐘最多一次 */
window.ocsQuota=()=>{const n=Date.now();if(n-(ocsQuota.t||0)<12e4)return;ocsQuota.t=n;toast('瀏覽器儲存空間已滿，新進度可能無法保存。請到設定匯出備份，並刪除用不到的圖片物品','info')};
const css=document.createElement('style');css.textContent=`
svg.emo{display:inline-block;width:1.15em;height:1.15em;vertical-align:-.22em;stroke-width:1.9}
.c4-b svg.i,.chip svg.i,.tzc svg.i,.f svg.i,.tl svg.i{display:inline-block;vertical-align:-3px}.f svg.i{width:12px;height:12px;vertical-align:-1px}
.tl svg.i{width:20px;height:20px}.eb svg.i{width:18px;height:18px}`;document.head.append(css);
/* 其餘 emoji 一律換成與介面一致的線條圖標（物品圖案、輸入框除外） */
const SETS=[['heart','❤♥💓💕💖💗💘💝🧡💛💚💙💜'],['star','⭐🌟🌠'],['sparkle','✨✦✧💫'],['drop','💧💦🫧💨'],['moon','🌙💤😴🌛🌜'],['sun','☀🌞🌈🌤⛅'],
 ['leaf','🌸🌿🍃🌱🍀🌷🌵🪴🌼🌺🍄'],['flame','🔥🌶💢⚡'],['cup','🥤☕🫖🍵🍶🍺🍷🥛🧃🧋🍹🍸🧊♨'],['gift','🎁🎀'],['chair','🪑🛏🛋🕯💡'],['note','🎵🎶♪♫🔔'],['home','🏠'],['shirt','👕👗'],
 ['book','📒💌📖💬💭'],['tag','🏷'],['help','❓❗'],['ban','🚫'],['eye','👁🔍'],['eyeoff','🙈🤫'],['tool','🧰'],['palette','🎨'],['image','🖼'],['store','🛒'],['trash','🗑'],['pen','✏'],['eraser','🧽'],['bucket','🪣'],
 ['route','🏃👣🐾'],['toy','🧸🎈🧶🪁🪆⚽🏀🎾⚾🧩🎲🎮🔮'],['frown','😤😖😕🥺🤢😈😠😡😢😭😞😟😔'],['meh','😐😑😶🙄']];
const EM=/\p{Extended_Pictographic}\uFE0F?(?:\u200D\p{Extended_Pictographic}\uFE0F?)*/gu,HAS=/\p{Extended_Pictographic}/u,SK='.it,.im,.rm-b,.fxi,.dghost,.ed-img,input,textarea,select,script,style,svg,[data-emoji-keep]';
const key=ch=>{const c=ch.replace(/\uFE0F/g,''),f=[...c][0],cp=f.codePointAt(0);if(cp<0x2190)return null;
 for(const[k,s]of SETS)if(s.includes(f))return k;
 if((cp>=0x1F600&&cp<=0x1F64F)||(cp>=0x1F910&&cp<=0x1F92F)||(cp>=0x1F970&&cp<=0x1F97F))return'smile';
 if((cp>=0x1F32D&&cp<=0x1F37F)||(cp>=0x1F950&&cp<=0x1F9AF)||(cp>=0x1FAD0&&cp<=0x1FADF))return'utensils';return'sparkle'};
const svg=k=>`<svg class="i emo" viewBox="0 0 24 24" aria-hidden="true">${IC[k]||IC.sparkle}</svg>`;
const conv=root=>{if(!root||!root.nodeType)return;const base=root.nodeType===1?root:root.parentElement;if(!base||base.closest(SK))return;
 const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),L=[];let n;while(n=tw.nextNode())if(HAS.test(n.nodeValue)&&!n.parentElement.closest(SK))L.push(n);
 L.forEach(n=>{const v=n.nodeValue,fr=document.createDocumentFragment();let i=0;
  v.replace(EM,(m,o)=>{const k=key(m);if(!k)return m;if(o>i)fr.append(v.slice(i,o));const t=document.createElement('template');t.innerHTML=svg(k);fr.append(t.content.firstChild);i=o+m.length;return m});
  if(i){if(i<v.length)fr.append(v.slice(i));n.replaceWith(fr)}})};
let q=new Set(),raf=0;const mo=new MutationObserver(ms=>{ms.forEach(m=>{if(m.type==='characterData')q.add(m.target.parentElement);else m.addedNodes.forEach(a=>q.add(a.nodeType===1?a:a.parentElement))});
 const a=[...q];q=new Set();a.forEach(x=>x&&x.isConnected&&conv(x))});
const start=()=>{conv(document.body);mo.observe(document.body,{childList:true,subtree:true,characterData:true})};
if(document.readyState==='loading')addEventListener('DOMContentLoaded',start);else start();
})();
