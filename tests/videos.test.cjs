const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {bindVideos} = require('../dist/rwh-videos.js');
function page() {
  let focused, observerCallback, events=[];
  const observed=[];
  function element(tagName='BUTTON') {
    const callbacks={};
    return {tagName, dataset:{}, open:false, attributes:{}, pauses:0,
      addEventListener(name, fn){callbacks[name]=fn;},
      emit(name, event={}){callbacks[name]?.({currentTarget:this,...event});},
      getAttribute(name){return this[name] ?? null;},
      removeAttribute(name){delete this[name];},
      focus(){focused=this;},closest(){return null;},
      showModal(){this.open=true;},close(){this.open=false;this.emit('close');},
      pause(){this.pauses++;}
    };
  }
  const library=element('DIALOG'),close=element(),trigger=element('A'),menu=element();
  const videos=[element('VIDEO'),element('VIDEO')],frame=element('IFRAME');
  frame.dataset.videoEmbed='https://www.youtube.com/embed/example?autoplay=0';
  library.querySelector=()=>close;
  library.querySelectorAll=selector=>selector==='video'?videos:[frame];
  const doc={querySelector:selector=>({'#video-library':library,'.menu':menu})[selector],
    querySelectorAll:selector=>({'[data-inline-video]':videos,'[data-video-embed]':[frame],'[data-videos-open]':[trigger]})[selector] || [],
    dispatchEvent:event=>events.push(event.type)};
  bindVideos(doc,callback=>{observerCallback=callback;return {observe:el=>observed.push(el),unobserve(){}};});
  return {library,close,trigger,menu,videos,frame,events,observed,focus:()=>focused,visible:(target,isIntersecting)=>observerCallback([{target,isIntersecting}])};
}
test('native inline playback pauses other files without creating a separate dialog',()=>{
  const p=page();p.videos[0].emit('play');
  assert.equal(p.videos[0].pauses,0);assert.equal(p.videos[1].pauses,1);
  assert.equal(p.library.open,false);
  assert.equal(p.observed.length,3);
});
test('offscreen films stop and YouTube embeds load only when visible without autoplay',()=>{
  const p=page();assert.equal(p.frame.src,undefined);
  p.visible(p.frame,true);assert.match(p.frame.src,/autoplay=0/);
  p.visible(p.frame,false);assert.equal(p.frame.src,undefined);
  p.visible(p.videos[0],false);assert.equal(p.videos[0].pauses,1);
});
test('library dismissal stops inline media and restores focus; modified clicks retain links',()=>{
  const p=page();let prevented=false;
  p.trigger.emit('click',{button:0,ctrlKey:true,preventDefault(){prevented=true;}});
  assert.equal(prevented,false);assert.equal(p.library.open,false);
  p.trigger.emit('click',{button:0,preventDefault(){prevented=true;}});
  assert.equal(prevented,true);assert.deepEqual(p.events,['rwh:close-menu']);assert.equal(p.library.open,true);
  p.visible(p.frame,true);p.close.emit('click');
  assert.equal(p.library.open,false);assert.equal(p.frame.src,undefined);
  assert.ok(p.videos.every(video=>video.pauses>0));assert.equal(p.focus(),p.trigger);
});
test('all project films are embedded native controls with no outbound video link or playback modal',()=>{
  const dist=path.join(__dirname,'../dist');
  for(const project of fs.readdirSync(path.join(dist,'projects'))){
    const html=fs.readFileSync(path.join(dist,'projects',project,'index.html'),'utf8');
    const film=html.match(/<section class="project-film".*?<\/section>/s)?.[0];
    assert.ok(film,project);assert.equal((film.match(/<video /g)||[]).length,1,project);
    assert.match(film,/<video[^>]+controls playsinline preload="none"[^>]+src="\.\.\/\.\.\/assets\/rwh-videos\/[^\"]+\.mp4"/);
    assert.doesNotMatch(film,/<a |<button /);
    assert.doesNotMatch(html,/id="video-player"|class="video-source"/);
  }
});
