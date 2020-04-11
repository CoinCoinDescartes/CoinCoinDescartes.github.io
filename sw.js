const cacheName = 'v1'

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './main.js',
        './styles.css',
        './img/black.png',
        './img/white.png',
        './img/king.png',
        './audio/bip.mp3',
        './audio/boup.mp3',
        './modules/',
        './modules/board.js',
        './modules/games.js',
        './modules/player.js',
        './modules/square.js',
        './modules/token.js',
        './modules/utils.js',
        './modules/renderers/',
        './modules/renderers/renderer.js',
        './modules/renderers/originalRenderer.js',
        './modules/ia/',
        './modules/ia/ia.js',
        './modules/ia/randomIA.js',
      ]);
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
  var cacheKeeplist = [cacheName];

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (cacheKeeplist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});