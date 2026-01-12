/* eslint-disable no-undef */

// Import Firebase scripts (must be CDN in Service Worker)
importScripts("https://www.gstatic.com/firebasejs/12.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.7.0/firebase-messaging-compat.js");

// 🔹 Firebase config (SAME as your main app)
firebase.initializeApp({
    apiKey: "AIzaSyBmXtyZpn3AX6_FMgAX8jwpHQDmlxiF7Vw",
    authDomain: "zyara-1c578.firebaseapp.com",
    projectId: "zyara-1c578",
    storageBucket: "zyara-1c578.firebasestorage.app",
    messagingSenderId: "1058427366563",
    appId: "1:1058427366563:web:96ecd51a8ecf7fd0a3a316",
    measurementId: "G-TWVKE17MWZ"
});

// 🔹 Retrieve Firebase Messaging
const messaging = firebase.messaging();

/**
 * Handle background messages
 * This runs when the app is closed or in background
 */
messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Background message:", payload);

    const notificationTitle =
        payload.notification?.title || "New Notification";

    const notificationOptions = {
        body: payload.notification?.body || "",
        icon: payload.notification?.icon || "/favicon.png",
        data: payload.data || {},
    };

    self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});

/**
 * Handle notification click
 */
self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const targetUrl = event.notification.data?.url || "/";

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === targetUrl && "focus" in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
