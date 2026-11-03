// Headless smoke test. Usage: node tools/smoke.js [scenario...]
// Scenarios: fresh (first run), legacy (existing save), all
// Requires the preinstalled Playwright (NODE_PATH=$(npm root -g)).
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const OUT=path.join(__dirname,'out');fs.mkdirSync(OUT,{recursive:true});
const URL='file://'+path.join(__dirname,'..','web','index.html');
const scenarios=require('./scenarios');
(async()=>{
  const want=process.argv.slice(2);const names=want.length&&want[0]!=='all'?want:Object.keys(scenarios);
  const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});let fail=0;
  for(const n of names){
    const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true,isMobile:true});
    const p=await ctx.newPage();const errs=[];
    p.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
    p.on('console',m=>{if(m.type()==='error')errs.push('console.error '+m.text().slice(0,240))});
    const log=[];const t={page:p,url:URL,shot:async k=>p.screenshot({path:path.join(OUT,`${n}-${k}.png`)}),log:s=>log.push(s),
      assert:(c,msg)=>{if(!c)throw new Error('ASSERT '+msg)}};
    try{await scenarios[n](t);}catch(e){errs.push(String(e.stack||e).slice(0,600))}
    const real=errs.filter(e=>!/favicon|ERR_FILE_NOT_FOUND.*\.ico/.test(e));
    console.log(`${real.length?'FAIL':'ok  '} ${n}${log.length?'\n   '+log.join('\n   '):''}${real.length?'\n   '+real.join('\n   '):''}`);
    if(real.length)fail++;await ctx.close();
  }
  await b.close();process.exit(fail?1:0);
})();
