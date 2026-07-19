// ✅ ປ່ຽນເລກນີ້ (v1, v2, v3...) ທຸກຄັ້ງທີ່ Deploy ເວີຊັນໃໝ່
const CACHE_NAME = 'emo-finance-v3';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// ຕິດຕັ້ງ Service Worker + ເກັບໄຟລ໌ພື້ນຖານ
self.addEventListener('install', event => {
  self.skipWaiting(); // ✅ ໃຫ້ SW ໃໝ່ພ້ອມເຮັດວຽກທັນທີ ບໍ່ຕ້ອງລໍ tab ເກົ່າປິດ
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// ✅ ລຶບ Cache ເກົ່າທັງໝົດອອກ ເມື່ອມີເວີຊັນໃໝ່
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ຮັບຄຳສັ່ງ SKIP_WAITING ຈາກໜ້າເວັບ
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Network-first ສຳລັບ HTML (ໃຫ້ພະຍາຍາມດຶງໄຟລ໌ໃໝ່ຈາກເນັດກ່ອນສະເໝີ)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
