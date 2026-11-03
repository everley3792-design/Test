(()=>{const rail=document.getElementById('hudRail'),panel=rail?.querySelector('.rail-ext'),toggle=rail?.querySelector('[data-go=toggle]');if(!panel||!toggle)return;
 panel.id='islandToolsPanel';toggle.setAttribute('aria-label','小島日常');toggle.setAttribute('aria-controls',panel.id);
 const sync=()=>{const open=rail.classList.contains('open');panel.inert=!open;panel.setAttribute('aria-hidden',String(!open));toggle.setAttribute('aria-expanded',String(open));if(!open&&panel.contains(document.activeElement))toggle.focus({preventScroll:true})};
 new MutationObserver(sync).observe(rail,{attributes:true,attributeFilter:['class']});sync();
})();
