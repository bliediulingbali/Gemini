const CACHE_NAME = 'geminilauncher-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/service-worker.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache terbuka');
        return cache.addAll(urlsToCache).catch(error => {
            console.error('Gagal caching aset selama instalasi:', error);
        });
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Ambil dari cache jika ada
        }
        // Jika tidak ada di cache, coba ambil dari jaringan
        return fetch(event.request).catch(() => {
          // Jika Anda ingin mengarahkan ke halaman offline khusus:
          // return caches.match('/offline.html'); // Membutuhkan offline.html di urlsToCache
          console.warn('Permintaan gagal dan tidak ada di cache:', event.request.url);
          return new Response('<h1>Offline</h1><p>Aplikasi ini membutuhkan koneksi internet untuk memuat konten utama. Mohon cek koneksi Anda.</p>', {
              headers: { 'Content-Type': 'text/html' }
          });
        });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
