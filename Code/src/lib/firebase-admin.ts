
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

/**
 * @fileOverview Firebase Admin Initialization Node.
 * Identity: Build-Safe Master Protocol.
 * Ensures the system does not crash during the Next.js build phase.
 */

const ADMIN_APP_NAME = 'firebase-admin';

export function getAdminApp(): App | null {
  // 1. Check for existing instance
  const existingApp = getApps().find(app => app.name === ADMIN_APP_NAME);
  if (existingApp) {
    return existingApp;
  }

  // 2. Access the Service Account Signal
  const saVariable = process.env.FIREBASE_SERVICE_ACCOUNT;

  // 3. Build-Phase Bypass: If the variable is missing during build, return null instead of crashing.
  if (!saVariable) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('BUILD_LOG: FIREBASE_SERVICE_ACCOUNT not detected. Skipping Admin initialization for this cycle.');
    }
    return null;
  }

  try {
    // 4. Initialize with authorized credentials
    const serviceAccount = JSON.parse(saVariable);
    
    return initializeApp({
      credential: cert(serviceAccount),
    }, ADMIN_APP_NAME);
  } catch (error) {
    console.error('CRITICAL: Failed to parse Service Account JSON.', error);
    return null;
  }
}
