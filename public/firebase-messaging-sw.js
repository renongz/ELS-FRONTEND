importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyA2lrfTZ8krKkQ7QSIXrkuL-OhZuPCVxCE",
  authDomain: "bbs-els.firebaseapp.com",
  projectId: "bbs-els",
  storageBucket: "bbs-els.firebasestorage.app",
  messagingSenderId: "781825176147",
  appId: "1:781825176147:web:51ff88194de5d3812a8ca6",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received', payload);

  const { title, body } = payload.notification || {};
  const { type, sound } = payload.data || {};

  // Show notification
  self.registration.showNotification(title || 'Alert', {
    body: body || '',
    icon: '/favicon.ico',
    data: { type },
  });

  // Play sound only for panic alerts
  if (type === 'panic' && sound) {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'play-sound', sound });
      });
    });
  }
});
