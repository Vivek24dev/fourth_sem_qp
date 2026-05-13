import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";

const fallbackFirebaseConfig = {
  apiKey: "AIzaSyAV8kdwGQ5tUZwCMunKuwfPuciPFwPC1q0",
  authDomain: "fourth-sem-qp.firebaseapp.com",
  projectId: "fourth-sem-qp",
  storageBucket: "fourth-sem-qp.firebasestorage.app",
  messagingSenderId: "433997046896",
  appId: "1:433997046896:web:f08149391d93ff87e200b5",
};

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? fallbackFirebaseConfig.apiKey,
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    fallbackFirebaseConfig.authDomain,
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    fallbackFirebaseConfig.projectId,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    fallbackFirebaseConfig.storageBucket,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
    fallbackFirebaseConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? fallbackFirebaseConfig.appId,
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

export const firebaseApp: FirebaseApp | null = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;
