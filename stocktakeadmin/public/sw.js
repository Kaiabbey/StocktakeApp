const cacheName = 'v3';

const cacheAssets = [
    'js.js',
    'style.css',
    'icon-192x192.png',
    'icon-256x256.png',
    'icon-384x384.png',
    'icon-512x512.png',
    'manifest.json',
    'index.html',
]

// Call install event
self.addEventListener('install', (e) => {
    console.log('service Worker: installed');
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log("Service Worker: Caching Files");
                cache.addAll(cacheAssets);
            })
    );
});

// Call Activate event
self.addEventListener('activate', (e) => {
    console.log('service Worker: Activated');
    //remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName){
                        console.log("Service Worker: Clearing Old Cache");
                        return caches.delete(cache);
                    }
                })
            )
        })
    );
});

//Call Fetch Event
self.addEventListener('fetch', e => {
    console.log("Service Worker: fetching");
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    )
})