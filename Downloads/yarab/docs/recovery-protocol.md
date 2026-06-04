
# Digitiful // Emergency Recovery Protocol
**Status:** Hardened // **Access Level:** Master / Legacy
**Repository Node:** shiny-adventure.git
**Backend Node:** june-backend

This document defines the procedures for maintaining project continuity, local extraction, and deployment.

---

### 1. LOCAL EXTRACTION (Mac Handshake)
To migrate the code from the cloud Studio to a local Mac environment:
*   **Command**: `zip -r project.zip . -x "node_modules/*" ".next/*" ".git/*"`
*   **Procedure**: Right-click the zip in the explorer and download.

#### [ THE MAC-TO-GITHUB IGNITION ]
1.  **Extract**: Unzip on your local machine.
2.  **Dependencies**: Run `npm install`.
3.  **Repo Setup**:
    ```bash
    git init
    git remote add origin https://github.com/Digitiful/shiny-adventure.git
    git add .
    git commit -m "Initial Broadcast // June Backend"
    git branch -M main
    git push -u origin main
    ```

### 2. DEPLOYMENT FREQUENCIES
The project is bound to **june-backend**.

#### [ FIRESTORE DEPLOY ]
To update security rules and indexes:
*   `firebase deploy --only firestore`

#### [ APP HOSTING DEPLOY ]
The Next.js 15 node is deployed via GitHub push:
*   `git push origin main`
*   Monitor progress in: **Firebase Console > App Hosting > Dashboard**

### 3. VITAL SIGNS (Environment Variables)
The live application requires these 3 variables in **App Hosting > Settings**:

| **KEY** | **VALUE** |
| :--- | :--- |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `june-backend` |
| `GEMINI_API_KEY` | [Your Google AI Key] |
| `FIREBASE_SERVICE_ACCOUNT` | [The single-line JSON string] |

---
**[ SYSTEM STATUS: SECURED FOR JUNE-BACKEND BROADCAST ]**
