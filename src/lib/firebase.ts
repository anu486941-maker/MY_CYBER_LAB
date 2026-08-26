import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { productionFirebaseConfig, aiStudioFirebaseConfig } from './firebaseConfig';

// Determine environment
const isAiStudioPreview = typeof window !== 'undefined' && (
  window.location.hostname.includes('.run.app') ||
  window.location.hostname.includes('localhost') ||
  window.location.hostname.includes('127.0.0.1')
);

// In production (Vercel / my-cyber-lab.vercel.app), default to productionFirebaseConfig (my-cyber-lab-c54dd).
// In AI Studio preview containers, fall back to aiStudioFirebaseConfig unless overridden by VITE_ env vars.
const activeDefaultConfig = isAiStudioPreview ? aiStudioFirebaseConfig : productionFirebaseConfig;

export const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY || activeDefaultConfig.apiKey || '').trim(),
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || activeDefaultConfig.authDomain || '').trim(),
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || activeDefaultConfig.projectId || '').trim(),
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || activeDefaultConfig.storageBucket || '').trim(),
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || activeDefaultConfig.messagingSenderId || '').trim(),
  appId: (import.meta.env.VITE_FIREBASE_APP_ID || activeDefaultConfig.appId || '').trim(),
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Resolve Firestore database:
// Production (my-cyber-lab-c54dd) uses standard (default) database in asia-south1.
// AI Studio preview uses named database ai-studio-mycyberlab-72b2ef56-a955-44ea-8f40-478d3756f0ba if on AI Studio.
let resolvedDbId: string | undefined = undefined;
const customDbEnv = import.meta.env.VITE_FIREBASE_DATABASE_ID?.trim();
const customProjEnv = import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim();

if (customDbEnv && customDbEnv !== '(default)' && customDbEnv !== 'default') {
  resolvedDbId = customDbEnv;
} else if (
  isAiStudioPreview &&
  (!customProjEnv || customProjEnv === aiStudioFirebaseConfig.projectId) &&
  aiStudioFirebaseConfig.firestoreDatabaseId
) {
  resolvedDbId = aiStudioFirebaseConfig.firestoreDatabaseId;
}

export const db = resolvedDbId ? getFirestore(app, resolvedDbId) : getFirestore(app);

// Safe diagnostic logging in browser console (never logs keys, secrets, or tokens)
if (typeof window !== 'undefined') {
  const isKeySet = Boolean(firebaseConfig.apiKey && firebaseConfig.apiKey.length > 0);
  console.info(
    `%c[MY CYBER LAB Firebase Config]%c Target Project: %c${firebaseConfig.projectId}%c | Auth Domain: %c${firebaseConfig.authDomain}%c | Firestore DB: %c${resolvedDbId || '(default)'}%c | API Key Present: %c${isKeySet ? 'YES' : 'NO (Required)'}`,
    'color: #06b6d4; font-weight: bold;',
    'color: inherit;',
    'color: #10b981; font-weight: bold;',
    'color: inherit;',
    'color: #10b981; font-weight: bold;',
    'color: inherit;',
    'color: #10b981; font-weight: bold;',
    'color: inherit;',
    isKeySet ? 'color: #10b981; font-weight: bold;' : 'color: #ef4444; font-weight: bold;'
  );
  if (!isKeySet && !isAiStudioPreview) {
    console.warn(
      '[MY CYBER LAB] Notice: VITE_FIREBASE_API_KEY is not set or empty in production config. Please ensure apiKey is configured in src/lib/firebaseConfig.ts or Vercel Environment Variables.'
    );
  }
}
