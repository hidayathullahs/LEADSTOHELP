/**
 * LEADSTOHELP AI - Firebase Client Authentication Service
 * Initializes Firebase Web SDK and manages client-side authentication lifecycle.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'hidayathullah-de22c.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'hidayathullah-de22c',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'hidayathullah-de22c.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Check if Firebase Web SDK is configured with an active API Key
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.length > 5 &&
  firebaseConfig.projectId
);

// Initialize Firebase App safely
let app;
let auth;

try {
  if (isFirebaseConfigured) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    // Graceful placeholder during local developer testing before API keys are populated
    console.info('[FIREBASE] Client API key not yet configured in .env. Running in local developer authentication mode.');
  }
} catch (err) {
  console.warn('[FIREBASE] Client initialization error:', err);
}

export { auth };

/**
 * Signs in user with email and password via Firebase Auth
 */
export async function loginWithEmail(email, password) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase Authentication is not configured. Please set VITE_FIREBASE_API_KEY in frontend/.env.');
  }
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Registers new user with email and password via Firebase Auth
 */
export async function registerWithEmail(email, password, displayName = '') {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase Authentication is not configured. Please set VITE_FIREBASE_API_KEY in frontend/.env.');
  }
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential.user;
}

/**
 * Signs out current user from Firebase Auth
 */
export async function logoutUser() {
  if (auth) {
    await signOut(auth);
  }
}

/**
 * Subscribes to real-time auth state changes
 */
export function subscribeToAuthState(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

/**
 * Retrieves the fresh Firebase ID token for backend API authentication
 */
export async function getCurrentUserToken() {
  if (auth && auth.currentUser) {
    return await auth.currentUser.getIdToken();
  }
  return null;
}
