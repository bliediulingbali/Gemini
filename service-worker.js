self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
    // Anda bisa menambahkan caching aset statis di sini jika diperlukan.
    // Untuk PWA pembuka tautan sederhana, ini mungkin tidak terlalu krusial.
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    // Memastikan service worker baru mengambil alih kendali segera
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Untuk PWA pembuka tautan, kita mungkin tidak perlu menangani fetch secara kompleks.
    // Jika ada, Anda bisa menambahkan strategi caching di sini.
    // event.respondWith(fetch(event.request));
});