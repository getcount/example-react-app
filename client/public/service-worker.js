/* eslint-disable no-restricted-globals */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open('my-app-cache')
      .then((cache) => cache.addAll(['/', '/index.html'])),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== 'my-app-cache') {
            return caches.delete(cache);
          }
        }),
      ),
    ),
  );
});
