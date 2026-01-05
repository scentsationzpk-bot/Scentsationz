import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5U4kE16q7wiu0gQqKJEakLTQ8nZaQGFA",
  authDomain: "scentsationz.firebaseapp.com",
  projectId: "scentsationz",
  storageBucket: "scentsationz.firebasestorage.app",
  messagingSenderId: "949470920218",
  appId: "1:949470920218:web:86a276977b83c3816b9ba3"
};

// Initialize Firebase once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/**
 * Initialize Firestore with Offline Persistence and Long Polling.
 * experimentalForceLongPolling: true and useFetchStreams: false are used to resolve 
 * connectivity issues (10s timeout) in restricted environments.
 */
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ 
    tabManager: persistentMultipleTabManager() 
  }),
  experimentalForceLongPolling: true,
  // This helps stabilize long-polling connections by avoiding streaming fetch
  // which can be interrupted by certain firewalls/proxies.
  useFetchStreams: false
});