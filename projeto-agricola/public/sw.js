const CACHE_NAME = 'emater-cache-v1';
const urlsToCache = [
  '/',
  '/login',
  '/servicos',
  '/adicionar-servico',
  '/css/style.css',
  '/js/adicionar-servico.js',
  '/js/db.js',
  '/assets/logo_barra.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache aberto durante a instalação.');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Service Worker: Falha ao adicionar recursos ao cache.', err);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Ativado.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Removendo cache antigo.', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepta requisições GET para servir do cache primeiro (estratégia "Cache-first")
self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((response) => {
            return caches.open(CACHE_NAME).then((cache) => {
              if (event.request.url.startsWith(self.location.origin) && response.status === 200) {
                cache.put(event.request, response.clone());
              }
              return response;
            });
          });
        })
    );
  }
});

// Listener para o evento de sincronização
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-new-services') {
        event.waitUntil(syncNewServices());
    }
});

// Função que busca os serviços offline e os envia para o servidor
async function syncNewServices() {
    console.log('Service Worker: Sincronizando novos serviços.');
    const dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open('emater-db');
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.errorCode);
    });
    
    const db = await dbPromise;
    const tx = db.transaction('offline-services', 'readonly');
    const store = tx.objectStore('offline-services');
    const offlineServices = await store.getAll();

    if (offlineServices.length > 0) {
        console.log(`Encontrados ${offlineServices.length} serviços para sincronizar.`);
        for (const service of offlineServices) {
            try {
                const response = await fetch('/api/sync-services', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(service.servicos)
                });
                if (response.ok) {
                    console.log(`Serviço offline com ID ${service.id} sincronizado com sucesso.`);
                    const deleteTx = db.transaction('offline-services', 'readwrite');
                    const deleteStore = deleteTx.objectStore('offline-services');
                    deleteStore.delete(service.id);
                } else {
                    console.error(`Falha ao sincronizar serviço offline com ID ${service.id}. Status: ${response.status}`);
                }
            } catch (error) {
                console.error(`Erro de rede ao tentar sincronizar serviço offline com ID ${service.id}:`, error);
                // A falha na sincronização não apaga o item do IndexedDB, para que ele seja reenviado depois.
            }
        }
    } else {
        console.log('Nenhum serviço offline para sincronizar.');
    }
}