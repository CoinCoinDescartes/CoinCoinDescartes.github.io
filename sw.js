const cacheName = 'coin-tablut-v1.2'
const dataCacheName = 'coin-tablut-1.0-data-v1.2';
const filesToCache = [
  'index.html',
  'main.js',
  'styles.css',
  'icon/tablut255.png',
  'icon/tablut32.png',
  'img/black.png',
  'img/white.png',
  'img/king.png',
  'audio/bip.mp3',
  'audio/boup.mp3',
  'modules/board.js',
  'modules/games.js',
  'modules/player.js',
  'modules/square.js',
  'modules/token.js',
  'modules/utils.js',
  'modules/renderers/renderer.js',
  'modules/renderers/originalRenderer.js',
  'modules/ia/ia.js',
  'modules/ia/randomIA.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
      console.log('[Service Worker] Fetching resource: ' + e.request.url);
      return r || fetch(e.request).then((response) => {
        return caches.open(cacheName).then((cache) => {
          console.log('[Service Worker] Caching new resource: ' + e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== cacheName && key !== dataCacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});