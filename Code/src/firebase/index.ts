'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore'

export interface FirebaseSdks {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

/**
 * @fileOverview Universal Initialization Node.
 * Identity: Zero-Waste Build Shield.
 * Performs a defensive check to prevent build-time crashes from missing API keys.
 */
export function initializeFirebase(): FirebaseSdks | null {
  // SSR Guard: Firebase SDKs require a browser environment.
  if (typeof window === 'undefined') {
    return null;
  }

  // Defensive Check: If Project ID is missing during build, bypass init gracefully.
  if (!firebaseConfig.projectId || firebaseConfig.projectId === "") {
    console.warn("FIREBASE_INIT: Missing Project ID. SDK in standby.");
    return null;
  }

  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    return {
      firebaseApp: app,
      auth: getAuth(app),
      firestore: getFirestore(app)
    };
  } catch (error) {
    console.error("FIREBASE_INIT_ERROR:", error);
    return null;
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
