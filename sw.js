const CACHE_NAME_CORE = 'cache-v1';
const CACHE_FILES_CORE = [
    'src/images/icons/icon-144x144.png',
    'src/images/computer.jpg',
    'src/css/app.css',
    'src/js/app.js',
    'index.html',
    '/'
];
const CACHE_NAME_DYNAMIC = 'dynamic-v1';

const CACHE_NAME_INMUTABLE = 'inmutable-v1';
const CACHE_FILES_INMUTABLE = [
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://code.getmdl.io/1.3.0/material.cyan-light_blue.min.css',
    'https://code.getmdl.io/1.3.0/material.min.js',
    'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2',
    'https://fonts.gstatic.com/s/materialicons/v118/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    'https://unpkg.com/pwacompat'

];

self.addEventListener('install', (event) => { // Instala ServisWorker cuando usuario entra <INSTALL>.
    const guardandoCache = caches.open(CACHE_NAME_CORE)
        .then(cache => cache.addAll(CACHE_FILES_CORE))
        .catch(err => console.error(err.message));
    const guardandoCacheInmutable = caches.open(CACHE_NAME_INMUTABLE)
        .then(cache => cache.addAll(CACHE_FILES_INMUTABLE))
        .catch(err => console.error(err.message));
    self.skipWaiting();
    event.waitUntil(Promise.all([guardandoCache, guardandoCacheInmutable]));

});
self.addEventListener('activate', (event) => {// Eliminando caches obsoletos <ACTIVATE>.

    console.info('[SW] Activate...');
    //event.waitUntil(clients.claim());

});
self.addEventListener('fetch', (event) => {// Captura salidas de las peticiones <FETCH>.

    if (!(event.request.url.indexOf('http') === 0)) {
        return;
    }
    // Caché luego red.
    const cacheAyudaRed = caches.match(event.request)
        .then(page => page || fetch(event.request)
            .then(eventRequest => {
                return caches.open(CACHE_NAME_DYNAMIC).then(cache => {
                    if (![].concat(CACHE_FILES_CORE, CACHE_FILES_INMUTABLE).indexOf(event.request.url) || eventRequest.type === 'opaque') {
                        cache.put(event.request, eventRequest.clone())
                    }
                    return eventRequest;
                })
            }));
    event.respondWith(cacheAyudaRed);

});

self.addEventListener('sync', (event) => {// informará cuando regrese la conexión a internet <SYNC>.

});
self.addEventListener('push', (event) => {//Controla eventos de notificaciones <PUSH>.


});