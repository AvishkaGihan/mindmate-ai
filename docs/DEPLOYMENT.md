# Deployment Guide

This document outlines the step-by-step process for deploying the **MindMate AI** backend to **Render** and the mobile application via **Expo/EAS**.

---

## 1. Prerequisites

Before starting, ensure you have accounts with the following services:

1.  **GitHub:** Host the repository.
2.  **Render:** Host the backend API (Free Tier available).
3.  **MongoDB Atlas:** Host the database (Free Shared Tier).
4.  **Expo:** For building and publishing the mobile app.
5.  **Firebase:** For authentication services.
6.  **Google Cloud Console:** For Gemini API keys.

---

## 2. Database Setup (MongoDB Atlas)

1.  **Create Cluster:**

    - Log in to MongoDB Atlas.
    - Create a new **Shared (Free)** cluster.
    - Select a region close to your target users (e.g., AWS us-east-1).

2.  **Network Access:**

    - Go to **Network Access** in the sidebar.
    - Add IP Address: `0.0.0.0/0` (Allow Access from Anywhere).
    - _Note: Since Render uses dynamic IPs, this is required for the free tier. Production environments should use VPC Peering._

3.  **Database User:**

    - Go to **Database Access**.
    - Create a new user (e.g., `mindmate_api`) with a strong password.
    - Role: `Read and write to any database`.

4.  **Connection String:**
    - Click **Connect** on your cluster.
    - Choose **Drivers** -> **Node.js**.
    - Copy the connection string. Replace `<password>` with the user password created above.
    - **Save this string** for the Backend configuration.

---

## 3. Backend Deployment (Render)

We use Render for hosting the Node.js/Express API.

### 3.1. Create Web Service

1.  Log in to the [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository `mindmate-ai`.

### 3.2. Configuration

Fill in the following details:

- **Name:** `mindmate-api`
- **Region:** Same as MongoDB (e.g., Ohio / us-east-2)
- **Branch:** `main`
- **Root Directory:** `backend` (Important!)
- **Runtime:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Plan:** Free

### 3.3. Environment Variables

Scroll down to "Environment Variables" and add the following:

| Key                   | Value               | Description                                   |
| :-------------------- | :------------------ | :-------------------------------------------- |
| `NODE_ENV`            | `production`        | Optimizes Express                             |
| `PORT`                | `10000`             | Render default port                           |
| `MONGO_URI`           | `mongodb+srv://...` | Connection string from Step 2                 |
| `JWT_SECRET`          | `...`               | Strong random string (32+ chars)              |
| `FIREBASE_PROJECT_ID` | `...`               | From Firebase Console                         |
| `GEMINI_API_KEY`      | `...`               | From Google AI Studio                         |
| `GROQ_API_KEY`        | `...`               | (Optional) Fallback AI Key                    |
| `SERVER_ENC_KEY`      | `...`               | 32-byte hex string for server-side encryption |

### 3.4. Finalize

Click **Create Web Service**. Render will start the first build. Once complete, your API will be live at `https://mindmate-api.onrender.com`.

---

## 4. Mobile Deployment (Expo EAS)

We use **EAS (Expo Application Services)** to build the Android (`.apk`/`.aab`) and iOS (`.ipa`) binaries.

### 4.1. Setup EAS

1.  Install EAS CLI:
    ```bash
    npm install -g eas-cli
    ```
2.  Login to Expo:
    ```bash
    eas login
    ```
3.  Configure Project:
    ```bash
    cd mobile
    eas build:configure
    ```

### 4.2. Environment Variables (Mobile)

In Expo, environment variables are embedded at build time. Create an `eas.json` file (created automatically by step 4.1) and configure your build profiles.

**Note:** Never commit `google-services.json` or `.env` files. Use EAS Secrets for sensitive values.

1.  Go to [Expo Dashboard](https://expo.dev/) -> Select Project -> **Secrets**.
2.  Add secrets like `API_URL` (points to your Render URL).

### 4.3. Build for Android (Example)

To build an APK for testing (sideloading):

```bash
eas build -p android --profile preview
```

To build an AAB for the Play Store:

```bash
eas build -p android --profile production
```

### 4.4. Submit to Stores

Once the build is complete:

```bash
eas submit -p android
# or
eas submit -p ios
```

---

## 5\. CI/CD Integration

We use GitHub Actions to automate testing and deployment triggers.

1.  **Deploy Hook:**

    - In Render Dashboard -\> Settings -\> **Deploy Hook**.
    - Copy the Hook URL (e.g., `https://api.render.com/deploy/srv-xyz?key=abc`).

2.  **GitHub Secrets:**

    - Go to GitHub Repo -\> Settings -\> Secrets and variables -\> Actions.
    - Add `RENDER_DEPLOY_HOOK_URL` with the URL from above.

3.  **Workflow:**

    - Any push to `main` triggers `.github/workflows/deploy.yml`.
    - This workflow calls the Render Hook _only if_ tests pass.

<!-- end list -->
