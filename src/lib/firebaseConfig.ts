// Firebase Client Configuration
// Production Project: my-cyber-lab-c54dd
// Standard Firestore Database: (default) in asia-south1

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  firestoreDatabaseId?: string;
  oAuthClientId?: string;
}

// Production Firebase Configuration for my-cyber-lab-c54dd
export const productionFirebaseConfig: FirebaseClientConfig = {
  projectId: "my-cyber-lab-c54dd",
  authDomain: "my-cyber-lab-c54dd.firebaseapp.com",
  storageBucket: "my-cyber-lab-c54dd.firebasestorage.app",
  messagingSenderId: "184850353984",
  appId: "1:184850353984:web:bfa60a9dceb43a18f534a5",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  firestoreDatabaseId: undefined // Standard / (default) database in asia-south1
};

// AI Studio Container Fallback Configuration
export const aiStudioFirebaseConfig: FirebaseClientConfig = {
  projectId: "gen-lang-client-0971226107",
  appId: "1:383110619082:web:cbc9bfa771b44bc29f7933",
  apiKey: "AIzaSyBq7mtCnga3hUD_byk8MEb-nWWBejDeXKs",
  authDomain: "gen-lang-client-0971226107.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-mycyberlab-72b2ef56-a955-44ea-8f40-478d3756f0ba",
  storageBucket: "gen-lang-client-0971226107.firebasestorage.app",
  messagingSenderId: "383110619082",
  oAuthClientId: "383110619082-ljb7jfreev45ul688bq0g7i3pq4952me.apps.googleusercontent.com"
};

// Default export is production
export const defaultFirebaseConfig = productionFirebaseConfig;
