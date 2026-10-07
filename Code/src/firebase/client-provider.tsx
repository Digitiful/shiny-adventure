
'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase, type FirebaseSdks } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

/**
 * @fileOverview Client-side Firebase Orchestrator.
 * Wraps initialization in useEffect to guarantee it only executes in the browser,
 * making the app fully SSR-safe and preventing build-phase crashes.
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [firebaseServices, setFirebaseServices] = useState<FirebaseSdks | null>(null);

  useEffect(() => {
    // This logic is now guaranteed to run only on the client side after hydration.
    const sdks = initializeFirebase();
    setFirebaseServices(sdks);
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices?.firebaseApp || null}
      auth={firebaseServices?.auth || null}
      firestore={firebaseServices?.firestore || null}
    >
      {children}
    </FirebaseProvider>
  );
}
