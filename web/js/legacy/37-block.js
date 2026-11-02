/* Pause only the home actor's simulation behind a dialog; editor previews retain
   their own animation tick. Shared-life already pauses whenever a dialog opens. */
(()=>{const update=Stage.prototype.update;Stage.prototype.update=function(){if(this===Home.stage&&Ov.stack.length>0&&!window.OCS24D?.Ed?.on)return;return update.apply(this,arguments)}})();
