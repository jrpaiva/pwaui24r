// Nome do cache
const CACHE_NAME = 'mesa-ui24r-v1';

// Arquivos para cache (seu PWA)
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// INSTALA - Salva no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// INTERCEPTA REQUISIÇÕES
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se tem no cache, usa
        if (response) {
          return response;
        }
        
        // Se não tem, busca na rede
        return fetch(event.request)
          .then(response => {
            // Não cacheamos a mesa (só nosso PWA)
            if (!event.request.url.includes('192.168.1.249')) {
              return caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, response.clone());
                  return response;
                });
            }
            return response;
          });
      })
  );
});