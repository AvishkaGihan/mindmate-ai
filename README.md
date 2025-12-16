# MindMate AI 🧠

> A privacy-first mental wellness companion powered by Generative AI.

MindMate AI is a cross-platform mobile application that combines therapeutic journaling with AI-powered emotional support. Built with a "Privacy-by-Design" architecture, it features **Dual-Layer Encryption** (AES-256) ensuring that no sensitive user data—not even journal entries—is accessible to the backend server in plaintext.

![App Screenshot](https://via.placeholder.com/800x400?text=MindMate+AI+Portfolio+Demo)

## 🚀 Key Features

- **🔒 Dual Encryption:** Journal entries are encrypted on-device before transmission. The server re-encrypts them at rest.
- **🤖 Resilience AI:** Prioritizes Google Gemini for chat but automatically fails over to Groq (Llama 3) if rate limits are hit.
- **📱 Offline-First:** Fully functional journaling and history viewing without internet access.
- **⚡ Optimistic UI:** Instant feedback for chat and journaling interactions.

## 🛠️ Tech Stack

- **Mobile:** React Native (Expo SDK 52), TypeScript, Zustand, EncryptedStorage
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB Atlas (Mongoose ODM)
- **AI:** Google Gemini Pro + Groq (Llama 3 Fallback)
- **Auth:** Firebase Authentication + Custom JWT Session Management

## 🏁 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB Atlas Account
- Firebase Project
- Gemini & Groq API Keys

### Installation

1.  **Clone the repository**

    ```bash
    git clone [https://github.com/yourusername/mindmate-ai.git](https://github.com/yourusername/mindmate-ai.git)
    cd mindmate-ai
    ```

2.  **Backend Setup**

    ```bash
    cd backend
    npm install
    cp .env.example .env
    # Fill in your API keys in .env
    npm run dev
    ```

3.  **Mobile Setup**
    ```bash
    cd mobile
    npm install
    npx expo start
    ```

## 🔒 Security Architecture

MindMate uses a unique encryption model to protect mental health data:

1.  **Layer 1 (Device):** Payload encrypted with a locally generated Master Key.
2.  **Layer 2 (Server):** Encrypted payload is wrapped in a second encryption layer using the Server Key.

## 📄 License

MIT
