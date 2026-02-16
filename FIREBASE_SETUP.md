# 🔥 Firebase Setup Guide for FinGuard AI

This guide explains how to set up your own Firebase environment to run FinGuard AI.

---

## 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it (e.g., `finguard-ai-custom`).
3. (Optional) Enable Google Analytics and click **Create Project**.

---

## 2. Enable Services
In the Firebase Console sidebar, enable the following:

### A. Authentication
1. Go to **Authentication** → **Get Started**.
2. Enable **Email/Password** as a sign-in provider.

### B. Cloud Firestore
1. Go to **Cloud Firestore** → **Create Database**.
2. Select **Start in test mode** (or production mode if you prefer).
3. Choose a location (e.g., `us-central1`).

### C. Cloud Functions
1. Go to **Functions** → **Get Started**.
2. You will need to upgrade to the **Blaze (Pay as you go)** plan to use Python Cloud Functions. (There is a free tier).

---

## 3. Configure Frontend Registry
1. In Firebase Console, click the **Settings Gear** ⚙️ → **Project settings**.
2. Down under "Your apps", click the **Web icon** (</>) to register a web app.
3. Copy the `firebaseConfig` object.
4. Replace the values in `src/lib/firebase.ts` (or create a `.env.local` file):

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

---

## 4. Set Up Service Account for Backend/Scripts
1. Go to **Project settings** → **Service accounts**.
2. Click **Generate new private key**.
3. Save the `.json` file to the `functions` directory or your preferred path.
4. For high-level scripts, set the environment variable:
   - **Windows (PowerShell)**: `$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\your-key.json"`
   - **Linux/Mac**: `export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-key.json"`

---

## 5. Security Rules
Deploy the firestore rules to allow tiered access:
```bash
firebase deploy --only firestore:rules
```

---

## 6. Local Emulation (Recommended for Testing)
If you don't want to deploy to live Firebase yet, you can use the emulators:
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase login`
3. Run `firebase init emulators` (Select Auth, Firestore, Functions)
4. Start emulators: `firebase emulators:start`
5. Seed data: `node scripts/seedDemo.js` (Ensure your script points to your local project ID)

---

## 7. Encryption Key
FinGuard AI uses field-level encryption. Add a secret key to your environment:
```bash
NEXT_PUBLIC_ENCRYPTION_KEY=your-random-long-secret-key
```
This key must be identical on both Frontend and Backend to successfully decrypt data.
