# Digitiful // Emergency Recovery Protocol
**Status:** LIVE // **Access Level:** Master / Legacy
**Latest Sync:** Zero-Waste Hardening confirmed.

This document defines the procedures for maintaining project continuity for the `shiny-adventure` repository.

---

### 1. LIVE DEPLOYMENT LOG (CLI)
The current live build was successfully broadcast using the following sequence:
*   **Engine**: Firebase App Hosting (Linked to GitHub: `shiny-adventure`).
*   **Security**: `firebase deploy --only firestore` executed locally to sync rules.
*   **Result**: 100% Success rate on production node.

### 2. THE GITHUB COMMAND BRIDGE
To enable automated deployments of Firestore rules, you must generate a CI token:
1.  Run `firebase login:ci` on your local terminal.
2.  Copy the token output (starts with `1//`).
3.  Save it as `FIREBASE_TOKEN` in GitHub Secrets.

### 3. THE 403 PERMISSION SHIELD
If Git returns a 403 error on push:
1.  **Identity Reset**: `git remote set-url origin https://github.com/Digitiful/shiny-adventure.git`
2.  **Identity Verification**: `git config user.name "Digitiful"`
3.  **Credential Cache**: `git config --global credential.helper osxkeychain`
4.  **Token Usage**: If using a PAT (Personal Access Token), include it in the URL: `https://[TOKEN]@github.com/Digitiful/shiny-adventure.git`

### 4. THE BUILD SHIELD (SSR SAFE)
To prevent `auth/invalid-api-key` crashes during Next.js builds:
*   `src/firebase/index.ts` includes a defensive build-phase detector.
*   `src/firebase/provider.tsx` uses defensive hooks that return `null` during SSR.
*   Firebase initialization is restricted to client-side execution to ensure SSR safety.

---
**[ SYSTEM STATUS: HARDENED // PRIME DAY BROADCAST ACTIVE ]**
