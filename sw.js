const cacheName = 'coin-tablut-1.0'
const dataCacheName = 'coin-tablut-1.0-data-v1.1';
const filesToCache = [
  'index.html',
  'main.js',
  'styles.css',
  'icon/tablut.png',
  'img/black.png',
  'img/white.png',
  'img/king.png',
  'audio/bip.mp3',
  'audio/boup.mp3',
  'modules/',
  'modules/board.js',
  'modules/games.js',
  'modules/player.js',
  'modules/square.js',
  'modules/token.js',
  'modules/utils.js',
  'modules/renderers/',
  'modules/renderers/renderer.js',
  'modules/renderers/originalRenderer.js',
  'modules/ia/',
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
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
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