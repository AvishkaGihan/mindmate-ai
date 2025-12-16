# Deployment Guide

## 1. Backend (Render)

1.  Push code to GitHub.
2.  Create a **New Web Service** on Render.
3.  Connect your repository.
4.  **Root Directory:** `backend`
5.  **Build Command:** `npm install && npm run build`
6.  **Start Command:** `npm start`
7.  **Environment Variables:** Add all variables from your local `.env` (MONGODB_URI, GEMINI_API_KEY, etc.).
8.  **Secret File:** For `serviceAccountKey.json`, use Render's "Secret Files" feature to mount it at `/app/src/config/serviceAccountKey.json`.

## 2. Mobile (EAS Build)

1.  Install EAS CLI: `npm install -g eas-cli`
2.  Login: `eas login`
3.  Configure: `eas build:configure`
4.  Build for Android: `eas build -p android --profile preview`
