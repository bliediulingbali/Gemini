const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/service-worker.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
  // Jika ada file CSS internal atau aset lain, tambahkan di sini
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache terbuka');
        // Pastikan semua aset krusial berhasil di-cache.
        // Jika ada aset di urlsToCache yang tidak ditemukan saat instalasi,
        // seluruh proses instalasi Service Worker bisa gagal.
        return cache.addAll(urlsToCache).catch(error => {
            console.error('Gagal caching aset selama instalasi:', error);
            // Anda bisa mempertimbangkan untuk melempar error di sini
            // atau membiarkannya, tergantung seberapa kritis aset tersebut.
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
          // *** TAMBAHAN PENTING DI SINI ***
          // Jika gagal mengambil dari jaringan (misalnya offline),
          // Anda bisa mengembalikan halaman offline khusus atau aset fallback.
          // Untuk kasus ini, karena aplikasi Anda langsung mengarahkan ke Gemini,
          // kita pastikan index.html ada di cache. Jika index.html tidak ada,
          // atau ada resource lain yang gagal, ini bisa menjadi sumber error.
          // Untuk PWA sederhana seperti ini, pastikan '/' atau '/index.html'
          // SELALU ada di cache dan ini lah yang dilayani.

          // Jika Anda ingin mengarahkan ke halaman offline khusus:
          // return caches.match('/offline.html'); // Membutuhkan offline.html di urlsToCache

          // Untuk kasus Anda, karena tujuannya adalah membuka link eksternal
          // saat tombol diklik, error 404 ini mungkin terkait dengan
          // kegagalan memuat *halaman utama PWA Anda* (index.html) saat dibuka terinstal
          // dalam kondisi offline atau saat cache belum penuh.
          // Tidak ada aset fallback otomatis di sini selain halaman error 404 browser.
          // Ini mengapa *sangat penting* agar '/' dan '/index.html' ter-cache dengan baik.
          console.warn('Permintaan gagal dan tidak ada di cache:', event.request.url);
          // Mengembalikan response kosong atau null jika tidak ada fallback
          // bisa menyebabkan blank page, tapi lebih baik daripada 404 yang membingungkan.
          // Namun, yang paling ideal adalah mengembalikan halaman offline yang jelas.
          // Karena tidak ada offline.html, kita tidak bisa return caches.match()
          // Opsi lain adalah mengembalikan Response error
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
