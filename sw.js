const CACHE="umacha-v5";
const CORE=["./","index.html","manifest.json","icon-180.png","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:"reload"})))));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const same=new URL(e.request.url).origin===location.origin;
  const req=same?new Request(e.request,{cache:"no-cache"}):e.request;
  e.respondWith(
    fetch(req).then(r=>{const copy=r.clone();if(r.ok||r.type==="opaque")caches.open(CACHE).then(c=>c.put(e.request,copy));return r;})
      .catch(()=>caches.match(e.request).then(m=>m||caches.match("index.html")))
  );
});
