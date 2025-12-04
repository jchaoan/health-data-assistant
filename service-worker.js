// 健康數據助理 Service Worker
const CACHE_NAME = 'health-assistant-v5';
const urlsToCache = [
  '/',
  '/dashboard.html',
  '/food-detect.html',
  '/chat.html',
  '/diet_records.html',
  '/statistics.html',
  '/exercise.html',
  '/settings.html',
  '/profile_edit.html',
  '/profile_setup.html',
  '/login.html',
  '/register.html',
  '/welcome.html',
  '/verify-email.html',
  '/install.html',
  '/logo.png',
  '/manifest.json',
  '/js/utils.js',
  '/js/security.js',
  '/js/pwa-install.js',
  '/js/pwa-utils.js',
  '/js/config.js',
  '/js/firebase-config.js',
  '/css/pwa.css'
];

// 安裝 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('健康數據助理: 快取已開啟');
        // 使用 addAll 但忽略失敗的項目
        return Promise.allSettled(
          urlsToCache.map(url => cache.add(url).catch(() => console.log('快取失敗:', url)))
        );
      })
      .then(() => self.skipWaiting())
  );
});

// 啟動 Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('健康數據助理: 清除舊快取', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 攔截請求 - 使用 Network First 策略
self.addEventListener('fetch', event => {
  // 只處理 GET 請求
  if (event.request.method !== 'GET') return;

  // API 請求不快取，直接走網路
  if (event.request.url.includes('/api/') ||
      event.request.url.includes('firebase') ||
      event.request.url.includes('googleapis')) {
    return;
  }

  // HTML 頁面使用 Network First 策略
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // 網路成功，更新快取
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // 離線時使用快取
          return caches.match(event.request).then(response => {
            return response || caches.match('/dashboard.html');
          });
        })
    );
    return;
  }

  // 其他資源（CSS, JS, 圖片）使用 Cache First
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
  );
});

// 推播通知
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : '您有新的通知',
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('健康數據助理', options)
  );
});

// 點擊通知
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/dashboard.html')
  );
});
