const PWA_CACHE = 'PWA_CACHE';
const RUNTIME = 'RUNTIME';
const FILE_CACHES = [
  './',
  './static/img/img1.png',
  './static/styles/index.css',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PWA_CACHE)
      .then(cache => cache.addAll(FILE_CACHES))
      .then(self.skipWaiting())
  )
});

self.addEventListener('activate', event => {
  const currentCaches = [PWA_CACHE, RUNTIME]
  event.waitUntil(
    caches.keys()
      .then(cacheNames => cacheNames.filter(cacheName => !currentCaches.includes(cacheName)))
      .then(cacheNames => Promise.all(cacheNames.map(cacheName => caches.delete(cacheName))))
      .then(() => self.clients.claim())
  )
})

// self.addEventListener('fetch', function(event) {
//   const request = event.request;
//   event.respondWith(
//     caches.match(request)
//       .then(function(response) {
//         if (response) {
//           return response;
//         }
//         return fetch(request);
//       }
//     )
//   );
// });

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.open(RUNTIME).then(function(cache) {
        return cache.match(request).then(function(response) {
          var fetchPromise = fetch(request).then(function(networkResponse) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
          return response || fetchPromise;
        })
      })
    )
  }
})