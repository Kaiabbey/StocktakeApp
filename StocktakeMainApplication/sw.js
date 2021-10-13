const cacheName = 'v2';

const cacheAssets = [
    'js.js',
    'style.css',
    'icon.png',
    '../StocktakeMainApplication/',
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