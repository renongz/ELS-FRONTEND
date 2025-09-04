// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2lrfTZ8krKkQ7QSIXrkuL-OhZuPCVxCE",
  authDomain: "bbs-els.firebaseapp.com",
  projectId: "bbs-els",
  storageBucket: "bbs-els.firebasestorage.app",
  messagingSenderId: "781825176147",
  appId: "1:781825176147:web:51ff88194de5d3812a8ca6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

/**
 * Request permission and register for push notifications.
 * Handles both foreground and background notifications.
 */
export const registerForPushNotifications = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return;
    }

    // Register service worker for background notifications
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: "BE0QKARlNeMYBzuY_7mVGVb-euMH0sJhbSaGHoj7lRTkQEms4IbM9T9SHezhUS5Z0q1GGACyp1WQhe7grGT_yRE",
      serviceWorkerRegistration: registration,
    });

    if (!token) return;

    localStorage.setItem("fcm_token", token);

    // Send token to backend
    await fetch("https://els-backend-43ta.onrender.com/api/register-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    console.log("FCM token registered:", token);
  } catch (err) {
    console.error("Error getting FCM token:", err);
  }
};

/**
 * Listen for messages when app is in the foreground.
 * @param {function} callback - Function to handle the message payload
 */
export const onMessageListener = (callback) => {
  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);
    callback(payload);
  });
};

export { messaging };
