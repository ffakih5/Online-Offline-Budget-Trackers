const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/styles.css",
    "/db.js",
    "/index.js",
    "/manifest.webmanifest",
]
const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(PRECACHE)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
            .then(self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
            })
            .then((cachesToDelete) => {
                return Promise.all(
                    cachesToDelete.map((cacheToDelete) => {
                        return caches.delete(cacheToDelete);
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(fetch(event.request));
        return;
    }

    if (event.request.ur.includes("/api/transaction")) {
        event.respondWith(
            caches.open(RUNTIME).then((cache) => {
                fetch(event.request).then((response) => {
                    //console.log(event.request);
                    cache.put(event.request, response.clone()).then(() => {
                        return response;
                    })
                        .catch(() => {
                            caches.match(event.request)
                        })
                });
            }) return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                )

})
        
});
