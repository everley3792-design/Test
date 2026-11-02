// Each scenario receives {page,url,shot,log,assert}.
const wait=(p,ms)=>p.waitForTimeout(ms);
module.exports={
  async boot(t){const p=t.page;await p.goto(t.url);await wait(p,3500);await t.shot('home');
    const ok=await p.evaluate(()=>!!(window.OCApp&&document.querySelector('#homeStage .actor')));t.assert(ok,'home stage rendered');},
};
