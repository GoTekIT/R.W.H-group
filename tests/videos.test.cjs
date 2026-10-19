const {test} = require('node:test');
const assert = require('node:assert/strict');
const {bindVideos} = require('../dist/rwh-videos.js');
function page() {
  let focused, created = [], events = [];
  function element(tagName='BUTTON') {
    const callbacks = {};
    return {tagName, dataset:{}, open:false, attributes:{},
      addEventListener(name, fn) { callbacks[name]=fn; },
      emit(name, event={}) { callbacks[name]?.({currentTarget:this, ...event}); },
      setAttribute(name,value) { this.attributes[name]=value; },
      removeAttribute(name) { delete this[name]; },
      focus() { focused=this; }, closest() { return null; },
      showModal() { this.open=true; }, close() { this.open=false; this.emit('close'); },
      play() { this.played=true; return Promise.resolve(); }, pause() { this.paused=true; }, load() { this.loaded=true; },
      remove() { mount.media=null; }
    };
  }
  const mount = {media:null, querySelector() { return this.media; }, append(media) { this.media=media; }};
  const player = element('DIALOG'), library = element('DIALOG');
  const playerClose=element(), libraryClose=element(), trigger=element('A'), menu=element();
  player.querySelector = selector => selector==='[data-video-mount]' ? mount : playerClose;
  library.querySelector = () => libraryClose;
  const buttons=[element(),element()];
  const stages=['mp4','youtube'].map((kind,i)=>({dataset:{videoKind:kind,videoSrc:kind==='mp4'?'/film.mp4':'https://www.youtube-nocookie.com/embed/example',videoTitle:'Film',videoPoster:'/poster.jpg'},querySelector:()=>buttons[i]}));
  const doc={querySelector:selector=>({'#video-library':library,'#video-player':player,'.menu':menu})[selector],
    querySelectorAll:selector=>selector==='[data-video-stage]'?stages:[trigger],
    createElement:tag=>{const el=element(tag.toUpperCase()); created.push(el); return el;},
    dispatchEvent:event=>events.push(event.type)};
  bindVideos(doc);
  return {player,library,playerClose,libraryClose,buttons,trigger,menu,mount,created,events,focus:()=>focused};
}
test('film media stays unloaded until requested, then fills the native modal with controls',()=>{
  const p=page();
  assert.equal(p.created.length,0);
  p.buttons[0].emit('click');
  assert.equal(p.player.open,true);
  assert.equal(p.mount.media.tagName,'VIDEO');
  assert.equal(p.mount.media.controls,true);
  assert.equal(p.mount.media.playsInline,true);
  assert.equal(p.mount.media.played,true);
  assert.equal(p.mount.media.src,'/film.mp4');
});
test('closing a film stops audio and releases its source, then restores the play button focus',()=>{
  const p=page(); p.buttons[0].emit('click'); const media=p.mount.media;
  p.playerClose.emit('click');
  assert.equal(media.paused,true);
  assert.equal(media.src,undefined);
  assert.equal(media.loaded,true);
  assert.equal(p.mount.media,null);
  assert.equal(p.focus(),p.buttons[0]);
});
test('switching films releases the previous player and external embeds retain fullscreen and safe referrers',()=>{
  const p=page();p.buttons[0].emit('click');const first=p.mount.media;
  p.buttons[1].emit('click');
  assert.equal(first.paused,true);
  assert.equal(p.mount.media.tagName,'IFRAME');
  assert.equal(p.mount.media.allowFullscreen,true);
  assert.equal(p.mount.media.referrerPolicy,'strict-origin-when-cross-origin');
  p.player.close(); assert.equal(p.mount.media,null);
});
test('video library closes navigation, supports native dismissal, and preserves modified link clicks',()=>{
  const p=page();let prevented=false;
  p.trigger.emit('click',{button:0,ctrlKey:true,preventDefault(){prevented=true;}});
  assert.equal(p.library.open,false);assert.equal(prevented,false);
  p.trigger.emit('click',{button:0,preventDefault(){prevented=true;}});
  assert.equal(prevented,true);assert.deepEqual(p.events,['rwh:close-menu']);
  assert.equal(p.library.open,true);
  p.libraryClose.emit('click');assert.equal(p.library.open,false);assert.equal(p.focus(),p.trigger);
});
