/**
 * @fileOverview Universal Configuration Node.
 * Identity: Zero-Waste Dynamic Alignment.
 * Optimized to adapt to any active FIREBASE_PROJECT_ID via environment variables.
 */

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";

export const firebaseConfig = {
  projectId: projectId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: `${projectId}.firebaseapp.com`,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
  messagingSenderId: "479105030565"
};
