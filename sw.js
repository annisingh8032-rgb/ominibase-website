/* Ominibase service worker: files are saved on the phone after the first visit */
var V='ominibase-v1',CORE=['./','index.html','three.min.js'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
  var own=u.origin===location.origin,fonts=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(!own&&!fonts)return;
  if(own&&r.mode==='navigate'){ /* page: cache first, refresh in background */
    e.respondWith(caches.match('index.html').then(function(m){var n=fetch(r).then(function(x){if(x.ok)caches.open(V).then(function(c){c.put('index.html',x.clone())});return x}).catch(function(){return m});return m||n}));return}
  e.respondWith(caches.match(r).then(function(m){return m||fetch(r).then(function(x){if(x.ok||x.type==='opaque')caches.open(V).then(function(c){c.put(r,x.clone())});return x})}))});
