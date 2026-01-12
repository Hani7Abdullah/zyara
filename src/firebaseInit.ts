import firebase from "firebase/compat/app";
import "firebase/compat/messaging";

// 🔹 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBmXtyZpn3AX6_FMgAX8jwpHQDmlxiF7Vw",
  authDomain: "zyara-1c578.firebaseapp.com",
  projectId: "zyara-1c578",
  storageBucket: "zyara-1c578.firebasestorage.app",
  messagingSenderId: "1058427366563",
  appId: "1:1058427366563:web:96ecd51a8ecf7fd0a3a316",
  measurementId: "G-TWVKE17MWZ",
};

// 🔹 Prevent re-initialization (VERY important in React)
const firebaseApp =
  !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();

// 🔹 Messaging instance (check browser support)
let messaging: firebase.messaging.Messaging | null = null;

if (firebase.messaging.isSupported()) {
  messaging = firebase.messaging();
}

// 🔹 VAPID key
const publicKey =
  "BLR57w95JAMqjyJL3Al7ZKr7fWjF64rawLNF5bTyby25jLhYgw-88RchG4iviEnr2wweSBW2D3JF7id-69qmQ_k";

// 🔹 Get FCM token
export const getFirebaseToken = async (): Promise<string | null> => {
  try {
    if (!messaging) return null;

    const currentToken = await messaging.getToken({
      vapidKey: publicKey,
      serviceWorkerRegistration: await navigator.serviceWorker.ready,
    });

    if (currentToken) {
      console.log("FCM token:", currentToken);
      return currentToken;
    }

    console.warn("No registration token available.");
    return null;
  } catch (error) {
    console.error("Error retrieving FCM token:", error);
    return null;
  }
};

// 🔹 Foreground message listener
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;

    messaging.onMessage((payload:any) => {
      console.log("Foreground message:", payload);
      resolve(payload);
    });
  });

export default firebaseApp;
