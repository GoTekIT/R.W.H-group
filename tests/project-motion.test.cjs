const {test} = require('node:test');
const assert = require('node:assert/strict');
const {bindDetailMotion} = require('../dist/project-motion.js');
function page({reduce=false,supported=true}={}) {
  let callback,settings,change;
  const observed=new Set();
  const targets=[-400,108,850,1600].map(top=>({
    classes:new Set(),getBoundingClientRect:()=>({top}),
    get classList(){return {add:(...names)=>names.forEach(name=>this.classes.add(name)),remove:name=>this.classes.delete(name)};}
  }));
  const preference={matches:reduce,addEventListener(name,handler){change=handler;}};
  const view={innerHeight:800,matchMedia:()=>preference};
  if(supported) view.IntersectionObserver=class {
    constructor(handler,options){callback=handler;settings=options;}
    observe(target){observed.add(target);} unobserve(target){observed.delete(target);} disconnect(){observed.clear();}
  };
  bindDetailMotion({querySelectorAll:()=>targets},view);
  return {targets,observed,settings,enter:target=>callback([{target,isIntersecting:true}]),outside:target=>callback([{target,isIntersecting:false}]),reduce(){preference.matches=true;change();}};
}
test('only lower content waits for scroll; the opening viewport and restored position stay visible',()=>{
  const p=page();assert.equal(p.observed.size,2);
  assert.equal(p.targets[0].classes.size,0);assert.equal(p.targets[1].classes.size,0);
  assert.ok(p.targets[2].classes.has('is-pending'));
  assert.equal(p.settings.rootMargin,'0px 0px -48px 0px');
});
test('content reveals once when it enters and never hides again while scrolling back',()=>{
  const p=page(),target=p.targets[2];p.outside(target);assert.ok(target.classes.has('is-pending'));
  p.enter(target);assert.ok(!target.classes.has('is-pending'));assert.ok(!p.observed.has(target));
  p.outside(target);assert.ok(!target.classes.has('is-pending'));
});
test('reduced-motion and unsupported browsers retain immediately visible content',()=>{
  for(const options of [{reduce:true},{supported:false}]){
    const p=page(options);assert.equal(p.observed.size,0);assert.ok(p.targets.every(target=>target.classes.size===0));
  }
});
test('enabling reduced motion releases all pending content and disconnects observation',()=>{
  const p=page();p.reduce();assert.equal(p.observed.size,0);assert.ok(p.targets.every(target=>!target.classes.has('is-pending')));
});
