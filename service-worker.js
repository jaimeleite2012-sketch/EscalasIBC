const CACHE_NAME='escalas-ibc-v3-1-fix-selection';
const FILES=['./','./index.html','./app.js','./manifest.json','./assets/logo.webp','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null))));self.clients.claim();});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(res=>{let copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy));return res;}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));});
