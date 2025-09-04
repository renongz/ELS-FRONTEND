import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA2lrfTZ8krKkQ7QSIXrkuL-OhZuPCVxCE",
  authDomain: "bbs-els.firebaseapp.com",
  projectId: "bbs-els",
  storageBucket: "bbs-els.firebasestorage.app",
  messagingSenderId: "781825176147",
  appId: "1:781825176147:web:51ff88194de5d3812a8ca6",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission & register service worker
export const registerForPushNotifications = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

  const token = await getToken(messaging, {
    vapidKey: "BE0QKARlNeMYBzuY_7mVGVb-euMH0sJhbSaGHoj7lRTkQEms4IbM9T9SHezhUS5Z0q1GGACyp1WQhe7grGT_yRE",
    serviceWorkerRegistration: registration,
  });

  if (!token) return;

  localStorage.setItem("fcm_token", token);

  await fetch("https://els-backend-43ta.onrender.com/api/register-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  console.log("FCM token registered:", token);
};

// Foreground message listener
export const onMessageListener = (callback) => {
  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);

    const { type, sound } = payload.data || {};

    // Play sound only for panic alerts
    if (type === "panic" && sound) {
      const audio = new Audio(sound);
      audio.play();
    }

    callback(payload);
  });
};

export { messaging };
