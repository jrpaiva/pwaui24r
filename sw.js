// Service Worker para PWA Ui24R
// Versão minimalista - não cacheia nada da mesa

const CACHE_NAME = 'ui24r-pwa-v1';
const ASSETS = [
  './ui24r-github.html',
  './manifest-github.json'
];

// Instalação
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch - IMPORTANTE: NÃO cachear requisições para a mesa
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Se for requisição para IP local (mesa), deixar passar direto
  if (url.hostname.match(/^192\.168\./)) {
    return; // Não interceptar
  }
  
  // Cachear apenas assets locais
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
