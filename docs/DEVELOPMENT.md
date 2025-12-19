# Development Guide

Welcome to the **MindMate AI** engineering guide. This document covers setting up your local environment, running the application, and adhering to our contribution standards.

---

## 1. System Requirements

Ensure your development machine meets the following criteria:

- **OS:** macOS, Windows (WSL2 recommended), or Linux.
- **Node.js:** v18.x (LTS) or higher.
- **npm:** v9.x or higher.
- **Git:** v2.x or higher.
- **Mobile Development:**
  - **Physical Device:** [Expo Go](https://expo.dev/client) app installed (iOS or Android).
  - **Simulator:** Xcode (macOS/iOS) or Android Studio (all platforms).

---

## 2. Project Setup

### 2.1. Clone Repository

```bash
git clone https://github.com/yourusername/mindmate-ai.git
cd mindmate-ai
```

### 2.2. Install Dependencies

We manage dependencies separately for the mobile client and the backend API.

```bash
# 1. Backend
cd backend
npm install

# 2. Mobile
cd ../mobile
npm install
```

---

## 3\. Configuration (Environment Variables)

### 3.1. Backend Configuration

Create a `.env` file in the `backend/` directory:

```bash
cp backend/.env.example backend/.env
```

**Required Variables (`backend/.env`):**

```ini
NODE_ENV=development
PORT=3000

# Database (Local or Atlas Free Tier)
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/mindmate_dev

# Security
JWT_SECRET=development_secret_do_not_use_in_prod
SERVER_ENC_KEY=0000000000000000000000000000000000000000000000000000000000000000 # 64-char hex

# External Services
FIREBASE_PROJECT_ID=your-firebase-project-id
GEMINI_API_KEY=your-google-gemini-key
GROQ_API_KEY=your-groq-key # Optional fallback
```

### 3.2. Mobile Configuration

Create a `.env` file in the `mobile/` directory. Note that Expo injects these at build time.

```bash
cp mobile/.env.example mobile/.env
```

**Required Variables (`mobile/.env`):**

```ini
# Backend API URL
# For Android Emulator: http://10.0.2.2:3000/api
# For Physical Device: http://<YOUR_LAN_IP>:3000/api
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Firebase Configuration (obtain from Firebase Console)
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3.3. Firebase Setup

Firebase authentication must be enabled for the mobile app:

1. **Create a Firebase Project:**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable Firestore Database (for future features)

2. **Enable Email/Password Authentication:**

   - Go to **Authentication** → **Sign-in method**
   - Enable **Email/Password**
   - (Optional) Enable **Google Sign-In** for social login

3. **Get Firebase Config:**

   - Go to **Project Settings** → **Your Apps**
   - Select or create a new web app
   - Copy the Firebase config object
   - Add the values to `mobile/.env` with `EXPO_PUBLIC_FIREBASE_` prefix

4. **Backend Firebase Admin SDK:**
   - Go to **Project Settings** → **Service Accounts**
   - Click **Generate New Private Key**
   - Download the JSON file
   - Add `FIREBASE_PROJECT_ID` to `backend/.env`
   - (Backend will automatically use Application Default Credentials or read from service account)

---

## 4. Running the Application

### 4.1. Start the Backend

Open a terminal in `backend/`:

```bash
# Starts Node.js with nodemon for hot-reloading
npm run dev
```

- Server will start at `http://localhost:3000`.
- Health check: `http://localhost:3000/health`.

### 4.2. Start the Mobile App

Open a _new_ terminal in `mobile/`:

```bash
# Starts Metro Bundler
npx expo start
```

- **Scan QR Code:** Use the Camera app (iOS) or Expo Go (Android) to run on a physical device.
- **Press 'a':** Launch Android Emulator.
- **Press 'i':** Launch iOS Simulator (macOS only).

### 4.3. Testing Authentication Flow

**Signup:**

1. Launch the app
2. Tap "Sign Up"
3. Enter name, email, and password (min 8 characters)
4. Firebase creates the account
5. App exchanges Firebase ID token for backend JWT
6. User is automatically logged in and redirected to home screen

**Login:**

1. Tap "Sign In"
2. Enter email and password
3. Firebase authenticates the user
4. App exchanges Firebase ID token for backend JWT
5. User is logged in and redirected to home screen

**Biometric Login (requires physical device or configured emulator):**

1. After first login, Face ID / Touch ID option appears
2. Tap "Use FaceID / TouchID"
3. Authenticate with biometric
4. App uses stored refresh token to get new access token
5. User is logged in without entering password

**Logout:**

1. Tap settings/profile
2. Tap "Logout"
3. User is redirected to login screen
4. All tokens are cleared from encrypted storage

## 5\. Testing & Quality

We enforce high code quality standards. Run these checks before submitting a PR.

### 5.1. Backend Tests

```bash
cd backend

# Run Unit & Integration Tests
npm test

# Run Linting
npm run lint
```

### 5.2. Mobile Tests

```bash
cd mobile

# Run Unit Tests
npm test

# Run Type Checking
npm run type-check
```

---

## 6\. Git Workflow

1.  **Main Branch:** `main` is protected and always deployable.
2.  **Feature Branches:** Create branches from `main` using the format:
    - `feat/feature-name`
    - `fix/bug-description`
    - `docs/documentation-update`
3.  **Commits:** Use [Conventional Commits](https://www.conventionalcommits.org/):
    - `feat: add journaling encryption`
    - `fix: resolve crash on login`
4.  **Pull Requests:**
    - Push branch to GitHub.
    - Open PR to `main`.
    - **CI Checks must pass** (Lint, Test, Build).
    - Squash & Merge.

---

## 7\. Troubleshooting

**Issue: Mobile app cannot connect to Backend**

- **Cause:** `localhost` on a phone refers to the phone itself, not your computer.
- **Fix:** Change `EXPO_PUBLIC_API_URL` in `mobile/.env` to your computer's local IP (e.g., `http://192.168.1.50:3000/api/v1`). Ensure your firewall allows port 3000.

**Issue: MongoDB connection error**

- **Cause:** IP not whitelisted in Atlas.
- **Fix:** Go to MongoDB Atlas -\> Network Access -\> Add Current IP Address.

**Issue: "Crypto" module missing in React Native**

- **Cause:** React Native doesn't have Node.js built-ins.
- **Fix:** Ensure you are importing encryption utilities from `src/services/encryption.ts` which uses `react-native-encrypted-storage` or compatible libraries, not `crypto`.

<!-- end list -->
