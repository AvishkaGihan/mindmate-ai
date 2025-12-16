# MindMate AI

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

> **A privacy-first mental wellness companion app with AI-powered mood tracking, personalized journaling prompts, and daily mindfulness exercises.**

MindMate AI bridges the gap between expensive therapy apps and generic wellness tools. It provides an accessible, emotionally intelligent space for users to process their thoughts, track mood patterns, and practice mindfulness—all while keeping data secure and private.

---

## 🚀 Key Features

- **🔒 Privacy First:** End-to-end encryption for sensitive journal entries. Data stays on your device or is encrypted at rest.
- **🧠 AI Companion:** empathetic, context-aware chat support powered by Google Gemini, designed to listen and support (not diagnose).
- **📝 Smart Journaling:** Real-time sentiment analysis generates dynamic prompts to help you dive deeper into your feelings.
- **📊 Mood Analytics:** Visualize emotional trends over 7, 30, and 90 days to identify triggers and patterns.
- **🌬️ Guided Mindfulness:** Interactive breathing exercises (Box Breathing, 4-7-8) with haptic feedback for immediate grounding.
- **📱 Offline Capable:** robust offline-first architecture ensuring support is available even without an internet connection.

---

## 🛠️ Tech Stack

### Mobile (Frontend)

- **Framework:** React Native (via Expo SDK 50+)
- **Language:** TypeScript
- **State Management:** Zustand
- **Navigation:** Expo Router (File-based routing)
- **Storage:** `react-native-encrypted-storage` & `AsyncStorage`

### API (Backend)

- **Runtime:** Node.js + Express.js
- **Language:** TypeScript
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** Firebase Auth (JWT verification)
- **AI Integration:** Google Gemini API (with Groq fallback)
- **Security:** AES-256 Encryption, Helmet, Rate Limiting

### DevOps & Infrastructure

- **CI/CD:** GitHub Actions
- **Hosting:** Render (Backend), Expo EAS (Mobile builds)
- **Monitoring:** Sentry

---

## 📂 Project Structure

```text
mindmate-ai/
├── mobile/                 # React Native Expo application
│   ├── app/                # Expo Router screens
│   ├── components/         # Reusable UI components
│   └── services/           # API & Encryption logic
├── backend/                # Node.js Express API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose schemas
│   │   └── services/       # Business logic (AI, Sync)
├── docs/                   # Documentation & Guides
└── .github/                # CI/CD Workflows
```

---

## ⚡ Quick Start

For detailed setup instructions, including environment variables and database configuration, please refer to the **[Development Guide](https://www.google.com/search?q=docs/DEVELOPMENT.md)**.

### Prerequisites

- Node.js 18+
- npm 9+
- Expo Go app (installed on your physical device) or Android/iOS Simulator

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/mindmate-ai.git
    cd mindmate-ai
    ```

2.  **Install dependencies**

    ```bash
    # Install backend dependencies
    cd backend && npm install

    # Install mobile dependencies
    cd ../mobile && npm install
    ```

3.  **Run locally**

    ```bash
    # Start Backend (Port 3000)
    cd backend
    npm run dev

    # Start Mobile (Metro Bundler)
    cd ../mobile
    npx expo start
    ```

---

## 📚 Documentation

- **[Architecture Decisions](https://www.google.com/search?q=docs/ARCHITECTURE.md):** Deep dive into system design, encryption strategy, and data flow.
- **[API Reference](https://www.google.com/search?q=docs/API.md):** Complete documentation of backend endpoints and contracts.
- **[Deployment Guide](https://www.google.com/search?q=docs/DEPLOYMENT.md):** Instructions for deploying to Render and App Stores.

---

## 🤝 Contributing

We welcome contributions! Please see the `CONTRIBUTING.md` file for guidelines on how to submit pull requests, report issues, and request features.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.
