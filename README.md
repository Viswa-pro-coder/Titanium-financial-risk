# FinGuard AI

Firebase-based financial wellness platform.

## Setup

1.  **Install Dependencies**:
    ```bash
    make install
    ```

2.  **Environment Variables**:
    Copy `.env.local` and fill in your Firebase config.

3.  **Run Emulators**:
    ```bash
    make emulate
    ```

4.  **Deploy**:
    ```bash
    make deploy
    ```

## Architecture

-   **Frontend**: React + TypeScript + Tailwind (Next.js)
-   **Backend**: Firebase (Auth, Firestore, Storage) + Cloud Functions (Python 3.11)
-   **AI**: Local/Cloud AI models for financial analysis

## Folder Structure

-   `/src`: Frontend source code
-   `/functions`: Python Cloud Functions
-   `/ai`: AI model infrastructure
-   `/scripts`: Mock data generators
