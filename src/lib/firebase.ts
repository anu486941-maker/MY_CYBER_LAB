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

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || activeDefaultConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || activeDefaultConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || activeDefaultConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || activeDefaultConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || activeDefaultConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || activeDefaultConfig.appId,
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
