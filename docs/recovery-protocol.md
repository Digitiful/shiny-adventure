
# Digitiful // Emergency Recovery Protocol
**Status:** Hardened // **Access Level:** Master / Legacy

This document defines the procedures for maintaining project continuity in the event the primary Architect (The Wizard) is unreachable. 

---

### 1. The Master Signal (Access)
The Digitiful system lives in three primary nodes. To recover the system, access to these nodes must be verified:

*   **Node A: Firebase Console** (`charged-scholar-475920-i9`)
    *   *Action:* The Architect should invite the Legacy Partner as an **Owner** in the IAM settings.
    *   *How to Generate Service Account:* Go to **Project Settings > Service Accounts**, click **Generate new private key**, and save the JSON file. 
    *   *Deployment:* This JSON string must be added as an environment variable named `FIREBASE_SERVICE_ACCOUNT` in the **App Hosting** settings node.
    *   *Purpose:* Controls the database (Firestore), Authentication, and App Hosting.
*   **Node B: GitHub Repository**
    *   *Action:* The Architect should invite the Legacy Partner as a **Collaborator**. 
    *   *Recovery Codes:* Located in GitHub under **Settings > Password and authentication > Two-factor authentication > Recovery codes**. Download and store these in the private "DG Firebase" folder.
    *   *Purpose:* Contains the source code and deployment pipelines.
*   **Node C: Google AI Studio**
    *   *Action:* Secure the `GEMINI_API_KEY`.
    *   *Purpose:* Powers Digi. (the AI persona).

### 2. Environmental Variables (The Vital Signs)
The live application requires the following keys to function. These should be saved in a secure, offline location (Password Manager or "DG Firebase" folder):

1.  `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: `charged-scholar-475920-i9`
2.  `GEMINI_API_KEY`: [Stored in Google AI Studio]
3.  `FIREBASE_SERVICE_ACCOUNT`: [The entire content of the JSON service account key]

### 3. Immediate Recovery Steps
If the system goes dark:
1.  Log in to the **Firebase Console**.
2.  Navigate to **App Hosting**.
3.  Verify the **GitHub Connection** is still active.
4.  Check the **Environment Variables** in the settings node.

### 4. Personal Note to Legacy Partner
"If you are reading this, you are the now the guardian of the Digitiful signal. The system was built to be precise and deliberate. Keep the frequencies stable."

---
**[ SYSTEM STATUS: SECURED FOR CONTINUITY ]**
