/* Ominibase service worker: sirf homepage + 3D files phone me save hoti hain.
   Baaki sab pages (jaise /Mdevilal) seedha server se khulte hain. */
var V='ominibase-v2',CORE=['./','index.html','three.min.js'];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(V).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}));
});

self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(k){
      return Promise.all(k.filter(function(x){return x!==V}).map(function(x){return caches.delete(x)}));
    }).then(function(){return self.clients.claim()})
  );
});

self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET')return;
  var u=new URL(r.url);
  var own=u.origin===location.origin;
  var fonts=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(!own&&!fonts)return;

  /* Page open karna (navigation) */
  if(own&&r.mode==='navigate'){
    var isHome=(u.pathname==='/'||u.pathname==='/index.html');
    if(!isHome)return; /* /Mdevilal jaise pages ko bypass: seedha server se aayenge */
    e.respondWith(
      caches.match('index.html').then(function(m){
        var n=fetch(r).then(function(x){
          if(x.ok)caches.open(V).then(function(c){c.put('index.html',x.clone())});
          return x;
        }).catch(function(){return m});
        return m||n;
      })
    );
    return;
  }

  /* Sirf 3D wali core files aur fonts cache honge, baaki seedha network se */
  var isCore=own&&u.pathname==='/three.min.js';
  if(!isCore&&!fonts)return;

  e.respondWith(
    caches.match(r).then(function(m){
      return m||fetch(r).then(function(x){
        if(x.ok||x.type==='opaque')caches.open(V).then(function(c){c.put(r,x.clone())});
        return x;
      });
    })
  );
});
