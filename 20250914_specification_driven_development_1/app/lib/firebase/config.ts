import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase configuration is provided
const hasFirebaseConfig = Object.values(firebaseConfig).every(value => value);

// Development mode: show helpful message if config is missing
if (!hasFirebaseConfig && process.env.NODE_ENV === 'development') {
  console.warn('🔥 Firebase設定が見つかりません。.env.localファイルを作成してください。');
  console.warn('📝 詳細は TROUBLESHOOTING.md をご覧ください。');
}

// Initialize Firebase with dummy config for development if real config is missing
const devFirebaseConfig = hasFirebaseConfig ? firebaseConfig : {
  apiKey: 'demo-api-key',
  authDomain: 'demo-project.firebaseapp.com',
  projectId: 'demo-project',
  storageBucket: 'demo-project.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:demo',
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(devFirebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
