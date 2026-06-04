'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * @fileOverview Firebase Client SDK Initialization.
 * Identity: Node Alpha (june-backend).
 * Hardened for Build-Phase Safety and Placeholder Protection.
 */

function isConfigValid() {
  const config = firebaseConfig;
  return (
    config.apiKey && 
    !config.apiKey.includes("REPLACE_") && 
    !config.apiKey.includes("YOUR_") &&
    config.appId && 
    !config.appId.includes("REPLACE_")
  );
}

export function initializeFirebase() {
  const isServer = typeof window === 'undefined';
  const hasValidConfig = isConfigValid();

  // BUILD SHIELD: During 'next build', if environment variables are missing or placeholders,
  // return null services immediately to prevent 'auth/invalid-api-key' crashes.
  if (isServer && !hasValidConfig) {
    return {
      firebaseApp: null as any,
      auth: null as any,
      firestore: null as any
    };
  }

  const apps = getApps();
  let firebaseApp: FirebaseApp;

  if (!apps.length) {
    try {
      firebaseApp = initializeApp(firebaseConfig);
    } catch (e) {
      return {
        firebaseApp: null as any,
        auth: null as any,
        firestore: null as any
      };
    }
  } else {
    firebaseApp = getApp();
  }

  if (!hasValidConfig) {
    return {
      firebaseApp,
      auth: null as any,
      firestore: null as any
    };
  }

  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  try {
    return {
      firebaseApp,
      auth: getAuth(firebaseApp),
      firestore: getFirestore(firebaseApp)
    };
  } catch (error) {
    return {
      firebaseApp,
      auth: null as any,
      firestore: null as any
    };
  }
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';