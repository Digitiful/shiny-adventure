
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

// IMPORTANT: Use environment variables for service account credentials in production
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

const ADMIN_APP_NAME = 'firebase-admin';

export function getAdminApp(): App {
  // Check if the admin app is already initialized
  const existingApp = getApps().find(app => app.name === ADMIN_APP_NAME);
  if (existingApp) {
    return existingApp;
  }

  if (!serviceAccount) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set. Admin SDK initialization failed.');
  }

  // Initialize the admin app with a specific name
  return initializeApp({
    credential: cert(serviceAccount),
  }, ADMIN_APP_NAME);
}
