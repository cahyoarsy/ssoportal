/**
 * Firebase Configuration with Hybrid Mode Support
 * 
 * Configures Firebase with offline persistence and authentication
 * for seamless online/offline operation.
 */

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';
import { 
  getAuth, 
  connectAuthEmulator,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789:web:demo"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with offline persistence
const db = getFirestore(app);

// Enable IndexedDB persistence for offline support
let persistenceEnabled = false;

// Initialize persistence asynchronously
(async () => {
  try {
    await enableIndexedDbPersistence(db, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED
    });
    persistenceEnabled = true;
    console.log('Firebase offline persistence enabled');
  } catch (err) {
    if (err.code === 'failed-precondition') {
      console.warn('Firebase persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firebase persistence not supported by browser');
    } else {
      console.error('Firebase persistence error:', err);
    }
  }
})();

// Initialize Auth with persistence
const auth = getAuth(app);

// Set auth persistence asynchronously
(async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.log('Firebase auth persistence enabled');
  } catch (error) {
    console.error('Failed to set auth persistence:', error);
  }
})();

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && process.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  try {
    if (!auth._delegate._config.emulator) {
      connectAuthEmulator(auth, 'http://localhost:9099');
      console.log('Connected to Firebase Auth emulator');
    }
    
    if (!db._delegate._databaseId.projectId.includes('localhost')) {
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.log('Connected to Firestore emulator');
    }
  } catch (error) {
    console.warn('Firebase emulator connection failed:', error);
  }
}

// Export initialized instances
export { 
  app, 
  db, 
  auth, 
  persistenceEnabled,
  firebaseConfig 
};

// Initialize hybrid mode
console.log('Firebase initialized with hybrid mode support');
console.log('Offline persistence:', persistenceEnabled ? 'enabled' : 'disabled');
console.log('Project ID:', firebaseConfig.projectId);