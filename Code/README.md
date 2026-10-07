# Digitiful // Beyond Digital
**Operator:** SAM
**Repository:** shiny-adventure.git
**Status:** [ PRIME DAY // LIVE BROADCAST ACTIVE ]
**Node:** https://digitiful.net

## 🚀 OPERATIONAL STATUS
The website is currently **LIVE**. All systems are synchronized across the Montreal-NY corridor. Old backend nodes (june-backend) have been decommissioned.

## 🛠 DEPLOYMENT PROTOCOLS
To update the live signal via CLI:

1.  **Stage & Commit**:
    ```bash
    git add .
    git commit -m "Signal Update // Zero-Waste Protocol"
    ```
2.  **GitHub Broadcast**:
    ```bash
    git push origin main
    ```
3.  **Database Security Sync**:
    ```bash
    firebase deploy --only firestore
    ```

## 🔐 403 FORBIDDEN RECOVERY (MAC)
If you encounter `403 denied to Digitiful`, run these commands:
1.  **Identity Reset**: 
    ```bash
    git remote set-url origin https://github.com/Digitiful/shiny-adventure.git
    ```
2.  **Credential Purge**:
    Open "Keychain Access" on your Mac, search for `github.com`, and delete the entry.
3.  **Alternative (GitHub CLI)**:
    ```bash
    gh auth login
    ```

## 🔐 GITHUB SECRETS (REQUIRED)
To enable automated deployments, ensure the following secrets are added to your GitHub repository (Settings > Secrets > Actions):
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: [Your Active Project ID]
*   `FIREBASE_TOKEN`: [Generate via `firebase login:ci` in terminal]
*   `GEMINI_API_KEY`: [Stored in Secure Vault]
*   `FIREBASE_SERVICE_ACCOUNT`: [JSON string from Firebase Console]

**[ SYSTEM STATUS: MISSION SUCCESS // BEYOND DIGITAL ]**
