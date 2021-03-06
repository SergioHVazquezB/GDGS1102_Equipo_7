const CACHE_NAME_CORE = 'cache-v1';
const CACHE_FILES_CORE = [
    'src/images/icons/icon-144x144.png',
    'src/images/computer.jpg',
    'src/css/app.css',
    'src/js/app.js',
    'src/js/firebase.js',
    'src/js/db.js',
    'index.html',
    'post.html',
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
    'https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    'https://unpkg.com/pwacompat'

];

self.addEventListener('install', (event) => { //------------------------------------------------<INSTALL>.
    //Instala ServisWorker cuando usuario entra
    const guardandoCache = caches.open(CACHE_NAME_CORE)
        .then(cache => cache.addAll(CACHE_FILES_CORE))
        .catch(err => console.error(err.message));
    const guardandoCacheInmutable = caches.open(CACHE_NAME_INMUTABLE)
        .then(cache => cache.addAll(CACHE_FILES_INMUTABLE))
        .catch(err => console.error(err.message));
    self.skipWaiting();
    event.waitUntil(Promise.all([guardandoCache, guardandoCacheInmutable]));

});
self.addEventListener('activate', (event) => {//----------------------------------------------- <ACTIVATE>.
    // Eliminando caches obsoletos
    const obtenerCaches = caches.keys()
        .then(allCaches => allCaches.filter(cache => ![CACHE_NAME_CORE, CACHE_NAME_INMUTABLE, CACHE_NAME_DYNAMIC].includes(cache)).filter(cacheName => caches.delete(cacheName)))
        .catch(err => console.error(err.message))
    console.info('[SW]: Cache limpiado exitosamente...');
    event.waitUntil(obtenerCaches);


});
self.addEventListener('fetch', (event) => {//-------------------------------------------------- <FETCH>.
    //Captura salidas de las peticiones
    if (!(event.request.url.indexOf('http') === 0)) {
        return;
    }
    if (event.request.url.includes('firestore.googleapis.com')) {
        return;
    }
    // Cach?? luego red.
    // const cacheAyudaRed = caches.match(event.request)
    //     .then(page => page || fetch(event.request)
    //         .then(eventRequest => {
    //             return caches.open(CACHE_NAME_DYNAMIC).then(cache => {
    //                 if (![].concat(CACHE_FILES_CORE, CACHE_FILES_INMUTABLE).indexOf(event.request.url) || eventRequest.type === 'opaque') {
    //                     cache.put(event.request, eventRequest.clone())
    //                 }
    //                 return eventRequest;
    //             })
    //         }));
    // event.respondWith(cacheAyudaRed);
    //3 y 5.
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

self.addEventListener('sync', (event) => {// informar?? cuando regrese la conexi??n a internet <SYNC>.

});
self.addEventListener('push', (event) => {//Controla eventos de notificaciones <PUSH>.


});
self.addEventListener('notificationclick', (event) => {//Controla notificacion
    const notification = event.notification;
    const action = event.action;
    console.log(action);
    if (action === 'confirm') {
      // Cualquier accion
      //clients.openWindow('http://localhost:5000/');
      notification.close();
    } else {
      notification.close();
    }
  });
  
  self.addEventListener('notificationclose', (event) => {//Cierra notificacion
    console.log('Se cerro la notificacion');
  });