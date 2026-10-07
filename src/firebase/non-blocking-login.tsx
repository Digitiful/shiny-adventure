'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). Returns a promise that can optionally be awaited. */
export function initiateAnonymousSignIn(authInstance: Auth): Promise<UserCredential> {
  return signInAnonymously(authInstance);
}

/** Initiate email/password sign-up (non-blocking). Returns a promise that can optionally be awaited. */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(authInstance, email, password);
}

/** Initiate email/password sign-in (non-blocking). Returns a promise that can optionally be awaited. */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(authInstance, email, password);
}
