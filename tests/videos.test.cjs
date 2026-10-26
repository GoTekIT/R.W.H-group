const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {bindVideos} = require('../dist/rwh-videos.js');
function page({reduced=false,mobile=false}={}) {
  let focused, observerCallback, preferenceChange, events=[];
  const observed=new Set(), documentEvents={};
  function element(tagName='BUTTON') {
    const callbacks={};
    return {tagName, dataset:{}, open:false, paused:true, plays:0, pauses:0,
      addEventListener(name, fn){callbacks[name]=fn;},
      emit(name, event={}){callbacks[name]?.({currentTarget:this,...event});},
      getAttribute(name){return this[name] ?? null;},removeAttribute(name){delete this[name];},
      focus(){focused=this;},closest(){return null;},
      showModal(){this.open=true;},close(){this.open=false;this.emit('close');},
      play(){this.plays++;this.paused=false;this.emit('play');return Promise.resolve();},pause(){this.pauses++;this.paused=true;}
    };
  }
  const library=element('DIALOG'),close=element(),trigger=element('A'),menu=element();
  const videos=[element('VIDEO'),element('VIDEO')],frame=element('IFRAME');
  videos[0].dataset.mobileSrc='https://example.com/mobile.mp4';
  videos[0].src='https://example.com/original.mp4';
  frame.dataset.videoEmbed='https://www.youtube.com/embed/example?autoplay=1&mute=1';
  library.querySelectorAll=()=>[];library.querySelector=()=>close;library.contains=item=>item===videos[1] || item===frame;
  const preference={matches:reduced,addEventListener(name,fn){preferenceChange=fn;}};
  const doc={hidden:false,defaultView:{matchMedia:query=>query.includes('prefers-reduced-motion')?preference:{matches:mobile}},
    querySelector:selector=>({'#video-library':library,'.menu':menu})[selector],
    querySelectorAll:selector=>({'[data-inline-video]':videos,'[data-video-embed]':[frame],'[data-videos-open]':[trigger]})[selector] || [],
    dispatchEvent:event=>events.push(event.type),addEventListener(name,fn){documentEvents[name]=fn;}};
  bindVideos(doc,callback=>{observerCallback=callback;return {observe:el=>observed.add(el),unobserve:el=>observed.delete(el)};});
  return {library,close,trigger,menu,videos,frame,events,observed,focus:()=>focused,
    open:()=>trigger.emit('click',{button:0,preventDefault(){}}),
    visible:(target,ratio=1)=>observerCallback([{target,isIntersecting:ratio>0,intersectionRatio:ratio}]),
    hide(hidden){doc.hidden=hidden;documentEvents.visibilitychange();},
    reduce(){preference.matches=true;preferenceChange();}};
}
test('native playback pauses other local clips without creating a separate dialog',()=>{
  const p=page();p.videos[0].play();
  assert.equal(p.videos[0].paused,false);assert.equal(p.videos[1].paused,true);
  assert.equal(p.library.open,false);assert.equal(p.observed.size,3);
});
test('autoplay waits for sufficient visibility, respects manual pause, and resumes after re-entry',()=>{
  const p=page(),video=p.videos[0];p.visible(video,.2);assert.equal(video.plays,0);
  p.visible(video,.6);assert.equal(video.plays,1);assert.equal(video.paused,false);
  video.pause();p.visible(video,1);assert.equal(video.plays,1);assert.equal(video.paused,true);
  p.visible(video,0);p.visible(video,.7);assert.equal(video.plays,2);
  p.hide(true);assert.equal(video.paused,true);p.hide(false);assert.equal(video.plays,3);
});
test('library autoplay owns visible media while the background project remains paused',()=>{
  const p=page();p.visible(p.videos[0],1);p.open();assert.equal(p.videos[0].paused,true);
  p.visible(p.videos[1],.8);assert.equal(p.videos[1].paused,false);assert.equal(p.videos[0].paused,true);
  p.close.emit('click');assert.equal(p.videos[1].paused,true);assert.equal(p.videos[0].paused,false);
});
test('visible YouTube embeds autoplay muted, and offscreen/closed embeds release their sources',()=>{
  const p=page();p.visible(p.frame,1);assert.equal(p.frame.src,undefined);
  p.open();p.visible(p.frame,.2);assert.match(p.frame.src,/autoplay=0/);
  p.visible(p.frame,.8);assert.match(p.frame.src,/autoplay=1/);assert.match(p.frame.src,/mute=1/);
  p.visible(p.frame,0);assert.equal(p.frame.src,undefined);
  p.visible(p.frame,.8);p.close.emit('click');assert.equal(p.frame.src,undefined);assert.equal(p.focus(),p.trigger);
});
test('reduced motion disables autoplay while native Play remains usable',()=>{
  const p=page({reduced:true});p.visible(p.videos[0],1);assert.equal(p.videos[0].plays,0);
  p.videos[0].play();assert.equal(p.videos[0].paused,false);
  p.open();p.visible(p.frame,.8);assert.match(p.frame.src,/autoplay=0/);
  const changing=page();changing.visible(changing.videos[0],1);changing.reduce();assert.equal(changing.videos[0].paused,true);
});
test('modified library clicks retain their link and normal opening closes navigation',()=>{
  const p=page();let prevented=false;
  p.trigger.emit('click',{button:0,ctrlKey:true,preventDefault(){prevented=true;}});
  assert.equal(prevented,false);assert.equal(p.library.open,false);
  p.open();assert.deepEqual(p.events,['rwh:close-menu']);assert.equal(p.library.open,true);
});
test('each project has its assigned inline film without outbound links or a playback modal',()=>{
  const dist=path.join(__dirname,'../dist');
  for(const project of fs.readdirSync(path.join(dist,'projects'))){
    const html=fs.readFileSync(path.join(dist,'projects',project,'index.html'),'utf8');
    const film=html.match(/<section class="project-film".*?<\/section>/s)?.[0];
    assert.ok(film,project);assert.equal((film.match(/<(?:video|iframe) /g)||[]).length,1,project);
    assert.match(film, /<video[^>]+controls playsinline preload="none"[^>]+src="[^\"]+\.mp4"/);
    assert.doesNotMatch(film, /<iframe|\bmuted\b/);
    const assignment=JSON.parse(fs.readFileSync(path.join(__dirname,'../VIDEO_SOURCES.json'),'utf8'));
    const id=assignment.projectAssignments[project];
    const assigned=assignment.videos.find(video=>video.id===id);
    const source=assigned.source;
    assert.ok(film.includes(`src="${assigned.deliveryUrl || `../../${source}`}"`),project);
    if (assigned.deliveryUrl) assert.match(assigned.deliveryUrl, /^https:\/\/media\.nguyenxuanphu\.net\/rwh\/[a-f0-9]{12}\/[^/]+\.mp4$/);
    else assert.ok(fs.existsSync(path.join(dist,source)),project);
    assert.doesNotMatch(film,/<a |<button /);assert.doesNotMatch(html,/id="video-player"|class="video-source"/);
  }
});

test('local videos start unmuted and preserve subsequent viewer volume choices',()=>{
  const p=page(),video=p.videos[0];
  assert.equal(video.muted,false);assert.equal(video.defaultMuted,false);assert.equal(video.volume,1);
  p.visible(video,.8);video.muted=true;video.volume=.4;
  p.visible(video,0);p.visible(video,.8);
  assert.equal(video.muted,true);assert.equal(video.volume,.4);
});

 test('native fullscreen playback is not paused when intersection changes',()=>{
  const p=page(),video=p.videos[0];
  p.visible(video,1);
  video.webkitDisplayingFullscreen=true;
  p.visible(video,0);
  assert.equal(video.paused,false);
  video.webkitDisplayingFullscreen=false;
  p.visible(video,0);
  assert.equal(video.paused,true);
});

test('blocked audible autoplay preserves sound and a subsequent user play remains available',async()=>{
  const p=page(), video=p.videos[0];
  video.play=()=>{video.plays++;return Promise.reject(Object.assign(new Error('blocked'),{name:'NotAllowedError'}));};
  p.visible(video,.8);
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(video.muted,false);
  assert.equal(video.plays,1);
  video.play=()=>{video.paused=false;return Promise.resolve();};
  await video.play();
  assert.equal(video.paused,false);
});

test('mobile selects lightweight source while desktop preserves original',()=>{
 assert.equal(page({mobile:true}).videos[0].src,'https://example.com/mobile.mp4');
 assert.equal(page().videos[0].src,'https://example.com/original.mp4');
});
