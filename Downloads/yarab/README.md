# Digitiful // Beyond Digital
**Operator:** SAM
**System Status:** [ BROADCAST READY ]

## 🚀 THE GITHUB HANDSHAKE
Connect your unzipped code to your GitHub vault:
1.  **Initialize**: `git init`
2.  **Connect**: `git remote add origin https://github.com/Digitiful/shiny-adventure.git`
3.  **Push**:
    ```bash
    git add .
    git commit -m "System Rebirth // June Backend"
    git branch -M main
    git push -u origin main
    ```

## 🛡 THE VITAL TRIAD (App Hosting Setup)
You MUST add these 3 variables in **Firebase Console > App Hosting > Settings**:
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: `june-backend`
*   `GEMINI_API_KEY`: [Your Key]
*   `FIREBASE_SERVICE_ACCOUNT`: [The single-line JSON string]

## 🛰 DEPLOYMENT PROTOCOL
1.  **Database Security**: `firebase use june-backend` then `firebase deploy --only firestore`
2.  **App Rollout**: `git push origin main` (Triggers automatic build)

**[ SYSTEM STATUS: BROADCASTING // ZERO-WASTE HARDENED ]**