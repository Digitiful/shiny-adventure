
# Digitiful // Emergency Recovery Protocol
**Status:** Hardened // **Access Level:** Master / Legacy
**Repository Node:** MonthOfHappy.git

This document defines the procedures for maintaining project continuity, local extraction, and the "Dual-Key" architecture.

---

### 1. LOCAL EXTRACTION (Mac Handshake)
To migrate the code from the cloud Studio to a local Mac environment:
*   **Command:** `zip -r project.zip . -x "node_modules/*" ".next/*" ".git/*"`
*   **Procedure:** Right-click the zip in the explorer and download.
*   **Note:** Always delete the zip file from the Studio after downloading to keep the workspace clean.

### 2. THE DUAL-KEY ARCHITECTURE
Digitiful utilizes two distinct App registrations (API Keys) within the same project (`charged-scholar-475920-i9`):

*   **Registration: "Studio"**: 
    *   *Purpose:* Exclusively for the Firebase Studio environment.
    *   *Function:* Handles developer authentication during build.
*   **Registration: "App"**: 
    *   *Purpose:* The Production Broadcast Tower.
    *   *Function:* Connected to `digitiful.net` and GitHub rollout. Handles public traffic.

### 3. VITAL SIGNS (Environment Variables)
The live application requires these 3 variables in **App Hosting > Settings**:

| **KEY** | **VALUE** |
| :--- | :--- |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `charged-scholar-475920-i9` |
| `GEMINI_API_KEY` | [Your Google AI Key] |
| `FIREBASE_SERVICE_ACCOUNT` | [The single-line JSON string] |

### 4. THE MASTER SIGNAL (Service Account)
1.  In Firebase Console, go to **Project Settings > Service Accounts**.
2.  Click **Generate new private key**.
3.  Minify the JSON to a **Single Line**.
4.  Paste it into the `FIREBASE_SERVICE_ACCOUNT` variable.

---
**[ SYSTEM STATUS: SECURED FOR FRESH PUSH ]**
