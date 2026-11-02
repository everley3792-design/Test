(()=>{
 new MutationObserver(()=>Theme.syncChrome()).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});Theme.syncChrome();
 const reposition=()=>requestAnimationFrame(positionToast);
 for(const id of ['hudRail','fab','hudCap']){const n=document.getElementById(id);if(n)new MutationObserver(reposition).observe(n,{attributes:true,attributeFilter:['class']})}
 new MutationObserver(reposition).observe(document.getElementById('layer'),{childList:true});
 document.getElementById('hudRail').addEventListener('transitionend',reposition);addEventListener('resize',reposition);addEventListener('orientationchange',reposition);
})();
