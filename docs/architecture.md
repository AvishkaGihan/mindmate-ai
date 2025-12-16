---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
inputDocuments: ["prd.md", "ux-design-specification.md"]
workflowType: "architecture"
lastStep: 7
project_name: "mindmate-ai"
user_name: "Avish"
date: "2025-12-15"
workflowStatus: "complete"
hasProjectContext: false
---

# Architecture Decision Document – MindMate AI

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

---

## Project Context Overview

**One-Line Tagline:** A mental wellness companion app with AI-powered mood tracking, personalized journaling prompts, and daily mindfulness exercises.

**Problem Solved:** Millions lack affordable, accessible mental health tools. Therapy apps are expensive ($10-20/month), generic wellness apps don't adapt to individual needs, and users fear privacy violations.

**Solution:** Cross-platform mobile app (iOS & Android) using conversational AI for personalized mental wellness—free, privacy-first, with journaling, AI coaching, mood tracking, and guided breathing.

**Target Market:**

- Young professionals (stress/burnout)
- College students (anxiety management)
- Mindfulness practitioners
- **Fiverr/Upwork Clients:** Health tech startups, corporate wellness programs, telehealth platforms, meditation brands, EdTech companies

**Market Opportunity:** $4.5B mental health tech market in 2026 (17% YoY growth)

**Delivery Model:** Free forever with no subscriptions; privacy-first with local encryption; adaptive AI personalization; production-ready architecture for portfolio impact

**Portfolio Value:** Demonstrates AI mobile app expertise, ethical AI implementation, sensitive data handling, and user-centered design for vulnerable populations—exactly what health tech clients need.

---

## Approved Tech Stack (All Free-Tier Compatible)

**Frontend:** React Native, React Navigation v6, React Native Reanimated, AsyncStorage, react-native-encrypted-storage
**Backend:** Node.js + Express.js, MongoDB Atlas Free Tier, Mongoose
**AI:** Google Gemini API Free Tier, Groq API Free Tier (fallback)
**Auth:** Firebase Authentication, React Native Biometrics
**Deployment:** Render Free Tier, MongoDB Atlas Free Tier, GitHub Actions
**Security:** bcrypt, helmet.js, express-rate-limit, AES-256 encryption, JWT
**Monitoring:** Sentry Free Tier, structured logging (Winston)
**Testing:** Jest, React Native Testing Library, Supertest

**Production Folder Structure:**

```
mindmate-ai/
├── mobile/        (React Native app)
├── backend/       (Node.js API)
├── docs/          (README, API, ARCHITECTURE, USER_GUIDE, DEPLOYMENT)
├── .github/workflows/ (CI/CD)
└── LICENSE
```

---

## Project Context Analysis

### Requirements Overview

**Functional Requirements (10 Core Features):**

- **FR-1: Authentication** – Email/password, biometric unlock (Face ID/Touch ID), Google Sign-In, JWT token management
- **FR-2: Daily Journaling** – Rich text editing, emoji mood selector, auto-save every 30 seconds, timestamp tracking, search/filter by date
- **FR-3: AI Journaling Prompts** – Real-time sentiment analysis, context-aware dynamic prompt generation based on detected emotion
- **FR-4: Mood Tracking** – 7 emotional states (Peaceful, Content, Anxious, Stressed, Sad, Angry, Overwhelmed), intensity scale (1-10), optional physical sensations
- **FR-5: Mood Visualization** – 7/30/90-day trend charts, heatmaps showing emotion frequency, pattern detection ("You're often stressed on Mondays"), PDF export
- **FR-6: AI Chatbot** – Multi-turn conversations with 20+ message context memory, empathetic responses, snippet saving, clear boundaries ("I'm not a therapist")
- **FR-7: Breathing Exercises** – 4 techniques (Box Breathing, 4-7-8, Alternate Nostril, Progressive Relaxation) with 3/5/10-minute versions, haptic feedback sync, visual animations
- **FR-8: Daily Affirmations** – AI-generated personalized affirmations based on mood history, no repeats within 30 days, push notification at 8 AM (customizable)
- **FR-9: Notifications** – Smart reminders for journaling/breathing, customizable frequency/time window, do-not-disturb (10 PM–8 AM), quick-action buttons
- **FR-10: Offline Mode** – Full journaling and mood tracking offline, automatic sync when connection resumes, offline indicator displayed, AI chat gracefully unavailable

**Non-Functional Requirements (Performance, Security, Accessibility):**

| Requirement       | Target                                                               | Rationale                                                           |
| ----------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Performance**   | AI response <2s (90th %), UI <300ms, cold start <3s                  | Users need quick feedback in emotional moments                      |
| **Reliability**   | 99.5% backend SLA, zero data loss                                    | Mental health data is irreplaceable                                 |
| **Security**      | AES-256 encryption, bcrypt 10+ rounds, JWT 24h expiry, rate limiting | Sensitive personal health data requires enterprise-grade protection |
| **Accessibility** | WCAG 2.1 AA compliance                                               | Designed for users in vulnerable emotional states                   |
| **Compatibility** | iOS 14+, Android 8+, <50MB                                           | 95%+ device coverage, accessible to low-storage users               |
| **Offline**       | Core features (journal, mood, breathe) work offline                  | Users need access during connectivity gaps                          |

### Technical Constraints & Dependencies

**Infrastructure Constraints (Free-Tier Limitations):**

- **MongoDB Atlas:** 512MB storage → requires efficient schema design (no redundant data, aggressive archival)
- **Render Free Tier:** 750 compute hours/month → stateless design required (no background jobs on free tier)
- **Gemini API:** Rate-limited free tier → need fallback (Groq API) and intelligent caching
- **React Native:** <50MB app size → careful dependency selection, code splitting

**Critical Integration Points:**

1. **AI Services (Gemini + Groq)**

   - Journaling prompts: on-the-fly sentiment analysis + prompt generation
   - Chatbot: multi-turn conversation management with history
   - Affirmations: personalized generation based on mood patterns
   - Fallback strategy when Gemini quota exceeded

2. **Firebase Authentication**

   - JWT token generation and validation
   - Refresh token mechanism (24-hour expiration)
   - Rate limiting on failed auth attempts (5 attempts → 15-min lockout)

3. **MongoDB**

   - User profiles, encrypted journal entries, mood history (time-series), conversation memory
   - Indexing strategy for fast queries (date-based mood analytics)
   - Data retention policy (archive old entries to conserve 512MB)

4. **Local Encrypted Storage**
   - Offline journal drafts, sync queue, symmetric encryption keys
   - react-native-encrypted-storage for secure key storage

### Cross-Cutting Concerns

These architectural decisions span **multiple features** and require upfront planning:

**1. Privacy & Encryption**

- AES-256 encryption for journal entries at rest
- TLS for all API communication
- No PII (personally identifiable information) in logs or error tracking
- Secure key storage on device (Keychain for iOS, Keystore for Android)

**2. Offline-First Sync**

- Journal entries, mood logs, affirmations must sync without conflicts
- Vector clock or timestamp-based conflict resolution
- Sync queue tracks pending changes during offline periods
- Affects: journal, mood tracking, affirmations

**3. AI Service Orchestration**

- Rate limiting across Gemini/Groq APIs
- Fallback strategy when primary API fails
- Caching of generated prompts/affirmations (reduce API calls)
- Affects: journaling prompts, chatbot, affirmations

**4. State Management**

- User authentication state (persistent JWT + refresh logic)
- Journal draft management (local + remote state)
- Conversation memory for multi-turn AI chat
- Offline queue (pending journal entries, mood logs)
- Unified state solution needed (Redux, Zustand, or MobX)

**5. Real-Time Responsiveness**

- AI latency absorption (skeleton screens, optimistic updates)
- Lazy loading for mood charts (paginate 90-day data)
- Progressive rendering of conversation history
- Database indexing for fast mood analytics queries

**6. Error Handling & Graceful Degradation**

- Network errors → show cached data or offline fallback
- AI API failures → use cached prompts or disable dynamic prompts
- Auth token expiration → silent refresh or prompt re-login
- Consistent error messaging (avoid technical jargon for vulnerable users)

### Project Complexity Assessment

| Dimension                  | Assessment                                         | Implications                                                                   |
| -------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Architectural Scope**    | Medium-High                                        | Offline-first sync, AI orchestration, encryption = complex coordination        |
| **Primary Domain**         | Full-Stack Mobile + AI                             | React Native, Node.js, LLM integration, local encryption, time-series data     |
| **Integration Complexity** | 4 major services (Gemini, Groq, Firebase, MongoDB) | Need adapter pattern for API abstraction, fallback strategies                  |
| **Estimated Components**   | 12-15 modules                                      | Auth, journal, mood, AI services, sync engine, notifications, encryption, etc. |
| **Free-Tier Feasibility**  | ✅ Viable                                          | With careful schema design, API caching, rate limiting, data archival          |

### Portfolio Impact Assessment

This architecture demonstrates:

- ✅ **Thoughtful AI Integration** – Not just wrapping ChatGPT; sentiment analysis, prompt engineering, multi-turn context
- ✅ **Security Consciousness** – Handling sensitive mental health data with AES-256, local key storage, zero PII in logs
- ✅ **Offline-First Mobile Design** – Complex sync patterns proving mobile resilience expertise
- ✅ **Accessibility by Default** – WCAG 2.1 AA compliance for vulnerable populations
- ✅ **Production-Ready Thinking** – Free-tier optimization, monitoring (Sentry), CI/CD, error handling
- ✅ **Scalability Mindset** – From free-tier → production infrastructure (upgradeable without rearchitecting)

---

## Starter Template Evaluation

### Primary Technology Domain

**Full-Stack Mobile + Backend** based on project architecture:

- Frontend: Cross-platform mobile (iOS & Android) using React Native
- Backend: RESTful API using Node.js

### Starter Options Considered

| Domain      | Framework               | Status             | Rationale                                                                         |
| ----------- | ----------------------- | ------------------ | --------------------------------------------------------------------------------- |
| **Mobile**  | React Native (bare)     | ❌ Deprecated      | Complex setup, manual configuration, no TypeScript by default                     |
| **Mobile**  | Expo CLI                | ✅ **Recommended** | Modern, TypeScript built-in, multi-platform, official support, free-tier friendly |
| **Backend** | NestJS                  | ⚠️ Over-engineered | Better for enterprise OOP patterns; too much boilerplate for MVP                  |
| **Backend** | Fastify                 | ⚠️ Overkill        | Performance-focused; adds complexity for this use case                            |
| **Backend** | Express.js + TypeScript | ✅ **Recommended** | Minimal, flexible, Node.js best practices, free-tier optimized                    |

### Selected Starters

#### 1. Mobile: Expo CLI with TypeScript

**Initialization Command:**

```bash
npx create-expo-app mindmate-ai
cd mindmate-ai
npm install expo-router react-native-reanimated react-native-encrypted-storage
```

**Architectural Decisions Provided by Expo:**

| Decision                   | Implication                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| **Language & Runtime**     | TypeScript configured by default; React Native 0.71+ with first-class TypeScript support  |
| **Routing**                | File-based routing (Expo Router) following modern web conventions; prevents prop-drilling |
| **Build Tooling**          | Expo CLI handles Android/iOS/Web builds automatically; no Xcode/Android Studio required   |
| **Development Experience** | Metro bundler with fast refresh; Expo Go app for on-device testing                        |
| **Project Structure**      | `app/` directory for screens; `components/` for reusable UI; clear separation             |
| **Styling**                | React Native StyleSheet with CSS-in-JS support for animations                             |
| **Platform Support**       | iOS 14+, Android 8+, Web ready out-of-the-box                                             |
| **Testing**                | Jest + React Native Testing Library preconfigured                                         |

**Why Expo for MindMate AI:**

- ✅ Eliminates native build complexity (no certificates, provisioning profiles needed)
- ✅ TypeScript first-class support (no manual configuration)
- ✅ File-based routing makes large feature-rich apps manageable
- ✅ Built-in safe area handling (critical for notched phones, vulnerable user design)
- ✅ Free Expo Go app for testing (no device installation needed during development)
- ✅ Scales from free-tier to production (EAS Build for cloud builds if needed)

#### 2. Backend: Express.js with TypeScript

**Initialization Command:**

```bash
mkdir mindmate-api
cd mindmate-api
npm init -y
npm install express typescript @types/express @types/node ts-node nodemon dotenv cors helmet express-rate-limit
npm install -D ts-node-dev @types/jest jest ts-jest
```

**Architectural Decisions Provided by Express:**

| Decision           | Implication                                                       |
| ------------------ | ----------------------------------------------------------------- |
| **Language**       | TypeScript with strict mode configured; type-safe API layer       |
| **Routing**        | Express middleware & handler pattern (flexible, not opinionated)  |
| **Development**    | ts-node + nodemon for hot reload during development               |
| **API Patterns**   | RESTful with middleware for auth, logging, rate limiting          |
| **Configuration**  | Environment variables via dotenv (no hardcoded secrets)           |
| **Security**       | Helmet.js for HTTP headers; express-rate-limit for DOS protection |
| **Error Handling** | Express error middleware pattern (centralized, not scattered)     |
| **Testing**        | Jest configured for unit + integration tests                      |

**Why Express for MindMate AI:**

- ✅ Minimal but complete (not over-engineered for free-tier MVP)
- ✅ Aligns with Node.js Best Practices 2024 (business components, 3-tier layering)
- ✅ Middleware pattern ideal for offline sync queue management
- ✅ Perfect for API layer between mobile app + MongoDB
- ✅ Easy to extend (add WebSockets, GraphQL later without rearchitecting)
- ✅ Security-first defaults (Helmet, rate limiting, input validation ready)

### Project Structure Established by Starters

```
mindmate-ai/
├── mobile/                    # Expo React Native app
│   ├── app/                  # File-based routing
│   │   ├── index.tsx         # Home screen
│   │   ├── journal/
│   │   │   └── [id].tsx      # Journal detail route
│   │   ├── chat.tsx          # Chat screen
│   │   ├── insights.tsx      # Mood analytics screen
│   │   └── _layout.tsx       # Root layout/navigation
│   ├── components/           # Reusable UI components
│   │   ├── MoodSelector/
│   │   ├── BreathingAnimation/
│   │   ├── JournalEditor/
│   │   └── ChatBubble/
│   ├── services/             # API calls, encryption, utils
│   │   ├── api.ts
│   │   ├── encryption.ts
│   │   ├── offline-sync.ts
│   │   └── gemini-service.ts
│   ├── app.json              # Expo configuration
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                  # Express Node.js API
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   │   ├── auth.ts
│   │   │   ├── journals.ts
│   │   │   ├── moods.ts
│   │   │   ├── chat.ts
│   │   │   └── affirmations.ts
│   │   ├── controllers/      # Business logic
│   │   ├── services/         # Database, AI, external APIs
│   │   │   ├── gemini-service.ts
│   │   │   ├── sync-service.ts
│   │   │   └── encryption-service.ts
│   │   ├── middleware/       # Auth, logging, error handling
│   │   ├── models/           # MongoDB schemas (Mongoose)
│   │   ├── utils/            # Validators, helpers
│   │   └── server.ts         # Express app setup
│   ├── tests/               # Jest test files
│   ├── .env.example         # Environment template
│   ├── tsconfig.json
│   └── package.json
│
├── docs/
│   ├── API.md               # API reference
│   ├── DEPLOYMENT.md        # Deployment instructions
│   └── ARCHITECTURE.md      # This file
│
├── .github/
│   └── workflows/           # GitHub Actions CI/CD
│       ├── test.yml         # Run tests
│       └── deploy.yml       # Deploy to Render
│
└── README.md
```

### Architectural Implications of Starter Choices

**Frontend Stack Impact:**

- React Native code sharing between iOS & Android (write once, deploy twice)
- File-based routing prevents navigation complexity (vs. prop-drilling in bare RN)
- Expo Router + TypeScript enables IDE autocompletion for screen names
- Local encryption library integrates cleanly without native module hassles

**Backend Stack Impact:**

- 3-tier architecture easily implemented (Express routes → services → data access)
- Middleware pattern ideal for offline sync queue management + rate limiting
- Centralized error handling across all endpoints (not scattered in route handlers)
- TypeScript enables type-safe API contracts between mobile & backend

**Integration Points:**

- **Shared TypeScript:** Mobile and backend can share type definitions (e.g., `Journal`, `Mood` interfaces)
- **Shared Environment Variables:** Both projects use dotenv (deployment consistency)
- **Shared Testing:** Both use Jest (same testing patterns across stack)
- **Free-Tier Optimized:** Expo (mobile) + Express (backend) = zero infrastructure costs for development

### Production Deployment Paths

| Component    | Dev Environment            | Production Path                                    |
| ------------ | -------------------------- | -------------------------------------------------- |
| **Mobile**   | Expo Go (free testing app) | EAS Build → App Store / Play Store                 |
| **API**      | localhost:3000             | Render Free Tier (750 hrs/month) → Pro (as needed) |
| **Database** | MongoDB Atlas Free (512MB) | Atlas Free → Pro (as needed)                       |
| **CI/CD**    | Local npm test             | GitHub Actions (free for public repos)             |

---

## Core Architectural Decisions

### Decision 1: Data Architecture - MongoDB Schema Design

**Selected:** Option B – Embedded Documents with Size Limits + TTL Indexes

**Rationale:**

- 512MB free-tier constraint requires efficient storage optimization
- Embedding related data (e.g., moods within user profiles, conversations with journals) reduces network calls and query complexity
- Size limits prevent unbounded growth: conversations capped at 50 messages, mood logs capped at 365 entries per year
- TTL indexes automatically archive old affirmations and expired session data

**Implementation:**

```javascript
// User schema with embedded moods (max 365 per year)
const userSchema = new Schema({
  userId: String,
  email: String,
  moods: {
    type: [{ date: Date, mood: String, intensity: Number, note: String }],
    validate: [(arr) => arr.length <= 365, "Max 365 moods per year"],
  },
  conversationHistory: {
    type: [{ timestamp: Date, role: String, content: String }],
    validate: [(arr) => arr.length <= 50, "Max 50 messages per session"],
  },
});

// TTL index on affirmations (7 day expiration)
affirmationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });
```

**Trade-offs Accepted:**

- ❌ Cannot easily query across users for aggregate analytics (not a requirement for MVP)
- ✅ Single-document reads are extremely fast (no joins required)
- ✅ Storage footprint is minimal and predictable

---

### Decision 2: Authentication & Security Architecture

**Selected:** Option A – Firebase + JWT + AES-256 Dual Encryption

**Rationale:**

- Firebase handles registration, password reset, OAuth—removes infrastructure burden
- JWT (24-hour expiration, refreshable) gives backend control over sessions without storing state
- Dual encryption (device-level + server-level) provides defense-in-depth for sensitive mental health data
- GDPR-compliant: users control encrypted data; server never sees plaintext journals

**Implementation:**

```typescript
// Mobile: Encrypt before sending (AES-256)
const encryptedJournal = await encryptionService.encryptAES256(
  plaintext,
  deviceKey // Derived from Keychain/Keystore
);
await api.post('/api/journals', { encryptedJournal });

// Backend: Decrypt with server key, re-encrypt at rest
const serverDecrypted = await decryptAES256(encryptedJournal, serverKey);
await Journal.create({
  encryptedContent: encryptAES256(serverDecrypted, dbKey)
});

// Firebase → JWT flow
1. User logs in via Firebase (email + password)
2. Firebase returns idToken (expires in 1 hour)
3. Mobile calls `/api/auth/verify-token` with idToken
4. Backend verifies token signature → issues JWT (24h expiration)
5. Mobile stores JWT in encrypted storage, refreshes before expiration
```

**Security Layers:**

- **Layer 1 (Transport):** TLS/HTTPS for all connections
- **Layer 2 (Device):** AES-256 encryption before sending (react-native-encrypted-storage)
- **Layer 3 (Server):** AES-256 encryption at rest (MongoDB)
- **Layer 4 (Authentication):** Firebase + JWT with 24h expiration

**Trade-offs Accepted:**

- ❌ Dual encryption adds latency (decrypt server key → decrypt data → re-encrypt for storage)
- ✅ Protects against: server compromise, database breaches, network interception
- ✅ Aligns with privacy-first positioning and GDPR

---

### Decision 3: API & Communication Patterns

**Selected:** Option A – RESTful with Standardized Error Format

**Rationale:**

- RESTful APIs are industry standard; mobile developers expect predictable HTTP semantics
- Standardized error responses with requestId enable client-side debugging without logs
- Sufficient for MindMate's use cases (CRUD operations on journals/moods, streaming AI chat)
- Faster iteration and testing than GraphQL for mental health-focused MVP

**API Design:**

```typescript
// Success Response (2xx)
{
  "status": "success",
  "data": { /* endpoint-specific payload */ }
}

// Error Response (4xx/5xx)
{
  "status": "error",
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please wait before trying again.",
  "requestId": "req_12345abc",
  "metadata": { "retryAfter": 60 }
}
```

**Endpoint Structure:**

```
POST   /api/auth/register              (Firebase idToken)
POST   /api/auth/verify-token          (idToken → JWT exchange)
POST   /api/journals                   (Create encrypted journal)
GET    /api/journals/:id               (Retrieve and decrypt)
PATCH  /api/journals/:id               (Update encrypted content)
POST   /api/moods                      (Log mood + intensity)
GET    /api/moods/weekly               (Aggregate mood trends)
POST   /api/chat                       (Streaming AI conversation)
GET    /api/affirmations/daily         (Get today's affirmation)
POST   /api/sync/queue                 (Upload offline changes)
```

**Error Handling Patterns:**

| Scenario            | Status | Code                | Retry Strategy                      |
| ------------------- | ------ | ------------------- | ----------------------------------- |
| Gemini timeout      | 503    | AI_TIMEOUT          | Exponential backoff + Groq fallback |
| Rate limit (Gemini) | 429    | RATE_LIMIT_EXCEEDED | Wait 60s + queue for later          |
| Invalid JWT         | 401    | UNAUTHORIZED        | Refresh token automatically         |
| Malformed request   | 400    | BAD_REQUEST         | Log and alert developer             |
| Server crash        | 500    | INTERNAL_ERROR      | Retry with exponential backoff      |

**Trade-offs Accepted:**

- ❌ Less efficient for large nested queries (not needed for MindMate)
- ✅ Easy to document, test, and debug
- ✅ Mobile inherently understands REST semantics
- ✅ Compatible with free-tier infrastructure

---

### Decision 4: Frontend Architecture – State Management & Component Patterns

**Selected:** Option C – Zustand (Modern Lightweight)

**Rationale:**

- MindMate has ~5 top-level state pieces: auth, journals, moods, chat, offlineQueue
- Zustand eliminates boilerplate while keeping code organized
- TypeScript with automatic memoization (only re-renders when selected state changes)
- Minimal bundle size (~2KB) perfect for mobile performance
- Easy to test and scales gracefully if features are added post-MVP

**Implementation:**

```typescript
// stores/auth.ts
import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),

  logout: () => {
    AsyncStorage.removeItem('authToken');
    set({ user: null, token: null });
  },

  // Hydrate from AsyncStorage on app start
  hydrate: async () => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) set({ token });
  }
}));

// stores/journals.ts
export const useJournalStore = create((set, get) => ({
  journals: [],
  offlineQueue: [],

  addJournal: (journal) => set(state => ({
    journals: [journal, ...state.journals]
  })),

  queueOfflineChange: (change) => set(state => ({
    offlineQueue: [...state.offlineQueue, change]
  })),

  syncQueue: async () => {
    const queue = get().offlineQueue;
    if (queue.length === 0) return;

    await api.post('/api/sync/queue', { changes: queue });
    set({ offlineQueue: [] });
  }
}));

// Usage in component
function JournalScreen() {
  const journals = useJournalStore(state => state.journals);
  const addJournal = useJournalStore(state => state.addJournal);
  const user = useAuthStore(state => state.user);

  return <FlatList data={journals} ... />;
}
```

**Component Organization:**

```
mobile/
├── app/
│   ├── (auth)/               # Auth screens (login, signup, password reset)
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── _layout.tsx       # Auth stack layout
│   ├── (app)/                # Main app (protected routes)
│   │   ├── index.tsx         # Dashboard
│   │   ├── journal.tsx       # Journal list & editor
│   │   ├── chat.tsx          # AI chat
│   │   ├── moods.tsx         # Mood tracker
│   │   ├── insights.tsx      # Weekly insights
│   │   └── _layout.tsx       # Tab navigation
│   └── _layout.tsx           # Root layout with auth check
├── components/
│   ├── auth/
│   │   ├── SignupForm.tsx
│   │   └── LoginForm.tsx
│   ├── journal/
│   │   ├── JournalEditor.tsx
│   │   ├── JournalCard.tsx
│   │   └── MoodSelector.tsx
│   ├── chat/
│   │   ├── ChatBubble.tsx
│   │   └── ChatInput.tsx
│   ├── common/
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorBoundary.tsx
├── stores/                  # Zustand stores (auth, journals, moods, chat)
├── services/
│   ├── api.ts              # Axios instance + error handling
│   ├── encryption.ts       # AES-256 device encryption
│   └── gemini.ts           # Google Gemini API wrapper
└── utils/
    ├── constants.ts
    └── validators.ts
```

**Performance Optimization:**

- Zustand automatic memoization (re-render only on selected state change)
- AsyncStorage for persistence (no API calls on app start)
- Offline-first: queue changes locally, sync when online
- Image optimization: cache journal thumbnails, lazy-load moods

**Trade-offs Accepted:**

- ❌ Smaller ecosystem than Redux (no DevTools equivalent, fewer plugins)
- ✅ Minimal boilerplate = faster feature iteration
- ✅ Type-safe with TypeScript built-in
- ✅ Perfect fit for small-medium mental health app

---

### Decision 5: Infrastructure & Deployment Strategy

**Context:** MindMate must launch with zero-cost infrastructure, but architecture must scale to production pricing if the app gains traction.

**Decision:** What's your deployment strategy for backend CI/CD, database scaling, and monitoring?

---

#### **Option A: GitHub Actions + Render + MongoDB Atlas (Recommended)**

**CI/CD Pipeline:**

```yaml
# .github/workflows/deploy.yml
on: [push to main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - npm install
      - npm run test:e2e
      - npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - Deploy to Render (auto-redeploy on main push)
      - Run database migrations
      - Send Sentry notification
```

**Deployment Architecture:**

```
GitHub (source)
  → GitHub Actions (CI/CD, runs tests)
    → Render (backend deploy, 750 hrs/month = always-on)
      → MongoDB Atlas (512MB free, auto-backups)
        ← Sentry (error tracking)
        ← Winston (structured logging → stdout → Render logs)
```

**Scaling Path:**

- **Free Phase:** Render Free ($0), MongoDB Free ($0), GitHub Actions ($0)
- **Growth Phase 1:** Render Pro ($7/month), MongoDB M0 ($0) → M2 ($57/month if needed)
- **Production:** Render Standard ($25/month), MongoDB M2 Pro ($57/month)

**Pros:**

- Zero cost to launch (critical for early-stage)
- Git-based deployments (no manual Docker commands)
- Render auto-scales and handles SSL automatically
- GitHub Actions included with public repo
- Easy rollback (revert commit → redeploy)
- Sentry free tier: 5,000 error events/month (plenty for MVP)

**Cons:**

- Render free tier may sleep after 15 mins inactivity (pay tier to prevent)
- MongoDB free tier has 512MB hard limit
- Limited monitoring at free tier (Sentry only)
- Manual database scaling decisions needed

---

#### **Option B: Docker + Railway (All-in-One Platform)**

**Setup:**

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json .
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

```yaml
# railway.toml
[deploy]
startCommand = "npm run build && npm start"
```

**Deployment Architecture:**

```
GitHub (source)
  → Push to Railway (auto-detects Node.js)
    → Auto-builds Docker image + deploys
    → PostgreSQL add-on (free tier available)
    → Deploy preview for PRs
```

**Scaling Path:**

- **Free Phase:** Railway $5 credit/month (covers small Node.js + PostgreSQL)
- **Growth Phase:** Pay-as-you-go (~$10-50/month depending on usage)

**Pros:**

- Simpler than GitHub Actions + Render (one platform)
- Docker-native (good for portfolio, shows containerization skills)
- Built-in preview deployments for PRs
- PostgreSQL simpler schema versioning than MongoDB

**Cons:**

- ❌ PostgreSQL (requires schema migrations; MindMate schema is document-oriented)
- ❌ Free tier only $5/month (tight for production-grade app)
- ❌ Less developer adoption than Render
- ❌ PostgreSQL requires sql-migrate or TypeORM (more infrastructure code)

---

#### **Option C: Serverless (Firebase Cloud Functions + Firestore)**

**Setup:**

```typescript
// functions/src/index.ts
import * as functions from "firebase-admin/functions";

export const createJournal = functions.https.onRequest(async (req, res) => {
  const journal = req.body;
  await admin.firestore().collection("journals").add(journal);
  res.json({ success: true });
});
```

**Deployment:**

```bash
firebase deploy --only functions,firestore
```

**Scaling Path:**

- **Free Phase:** Firebase Free (5GB storage, 125K read/write ops/day)
- **Growth Phase:** Firebase Blaze (pay-per-use)

**Pros:**

- True pay-as-you-go (only pay for invocations)
- Auto-scales instantly
- Firestore built-in (no separate database)
- No DevOps required (Firebase handles everything)

**Cons:**

- ❌ Vendor lock-in (Firebase-specific code; hard to migrate)
- ❌ Cold starts add 1-2 seconds latency (bad for chat UX)
- ❌ Firestore schema less flexible than MongoDB
- ❌ Cost unpredictable (could spike if user surge)
- ❌ Less portfolio value (serverless is commoditized)

---

### **My Recommendation:**

**Option A – GitHub Actions + Render + MongoDB Atlas**

**Why:**

- Zero cost to launch (you need this for MVP credibility)
- Render free tier reliable enough for portfolio project
- GitHub Actions industry standard (adds portfolio value)
- Scales to production smoothly (upgrade Render tier + MongoDB tier)
- Clear separation of concerns: CI/CD (GitHub) | Hosting (Render) | Database (MongoDB)

**Trade-off:** Render free tier may have brief sleep periods; Sentry free tier limited to 5K events/month (monitor via dashboard).

---

### Decision 5: Infrastructure & Deployment Strategy

**Selected:** Option A – GitHub Actions + Render + MongoDB Atlas

**Rationale:**

- Zero cost to launch (essential for MVP credibility)
- GitHub Actions is industry standard, adds portfolio value
- Render free tier: 750 compute hours/month = always-on for small apps
- MongoDB Atlas free tier: 512MB, auto-backups, easy scale path
- Clear separation of concerns: Git-based CI/CD (GitHub) → Compute (Render) → Data (MongoDB)

**Deployment Flow:**

```
GitHub Main Branch Push
  ↓
GitHub Actions:
  1. npm install
  2. npm run lint (ESLint)
  3. npm run test (Jest + Supertest)
  4. npm run build (TypeScript compile)
  5. If tests pass: Deploy to Render

Render Auto-Deploy:
  1. Build Docker image from Dockerfile
  2. Spin up Node.js container
  3. Run database migrations (prisma migrate deploy)
  4. Health check: GET /health → 200 OK
  5. Route traffic to new container

Monitoring:
  - Winston logs → Render console (searchable, 24h retention)
  - Sentry (5K free events/month) → error tracking + alerts
  - MongoDB cloud dashboard → storage usage, query performance
```

**Scaling Timeline:**

- **MVP (Month 1-3):** Free Tier (Render $0, MongoDB $0, GitHub $0)
- **Growth (Month 4+):** Render Pro ($7/month) if app needs to stay "warm"
- **Production (Year 1):** Render Standard ($25/month) + MongoDB M2 ($57/month if needed)

**Implementation Details:**

- Render auto-detects `Dockerfile` → auto-deploys on git push
- Environment variables managed in Render dashboard (no secrets in code)
- Database connection string: MongoDB Atlas → Render env vars
- CDN: Render includes auto-scaling (no extra config needed)

**Trade-offs Accepted:**

- ❌ Render free tier spins down after 15 mins inactivity (fine for portfolio, not production)
- ❌ MongoDB 512MB hard cap (schema design in Decision 1 optimizes for this)
- ✅ Industry-standard tools (GitHub Actions, MongoDB, Render)
- ✅ Smooth scaling path to production pricing
- ✅ Git-based deployments (no DevOps knowledge required)

---

### Decision 6: Testing & Code Quality Strategy

**Context:** MindMate handles sensitive mental health data. Code quality is non-negotiable: encryption must work, AI fallbacks must trigger, offline sync must not lose data.

**Decision:** What testing strategy ensures reliability without slowing MVP iteration?

---

#### **Option A: Unit Tests Only (Fast Iteration)**

```typescript
// tests/encryption.test.ts
describe("AES-256 Encryption", () => {
  it("encrypts and decrypts data correctly", async () => {
    const plaintext = "Personal journal entry";
    const encrypted = await encrypt(plaintext);
    const decrypted = await decrypt(encrypted);
    expect(decrypted).toBe(plaintext);
  });

  it("throws error on invalid key", async () => {
    const encrypted = "malformed_ciphertext";
    expect(() => decrypt(encrypted)).toThrow();
  });
});

// tests/services/gemini.test.ts
describe("Gemini Service", () => {
  it("falls back to Groq on timeout", async () => {
    jest.spyOn(gemini, "prompt").mockRejectedValue(new Error("timeout"));
    const result = await getResponse("user prompt");
    expect(result.source).toBe("groq");
  });
});
```

**Coverage Target:** 70% (core services: encryption, API, auth)

**Pros:**

- Fast to write (mocking external services)
- Runs in seconds (no device emulation)
- Catches logic bugs immediately
- No flakiness from device/network issues

**Cons:**

- ❌ Won't catch mobile-specific bugs (async handling, gesture detection)
- ❌ Won't test end-to-end flows (login → create journal → sync)
- ❌ Integration bugs slip through (API format mismatch, encryption → API roundtrip)

**Best For:** Early MVP (first 2-3 months), tech leads with discipline.

---

#### **Option B: Unit + Integration Tests (Balanced)**

```typescript
// tests/integration/auth-flow.test.ts
describe("Auth Flow (End-to-End)", () => {
  it("registers user, logs in, and gets JWT", async () => {
    // Setup test database
    const testDb = new Database(":memory:");
    const app = createExpressApp(testDb);
    const request = supertest(app);

    // Register
    const signupRes = await request
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "SecurePass123!" });
    expect(signupRes.status).toBe(201);

    // Login
    const loginRes = await request
      .post("/api/auth/verify-token")
      .send({ idToken: signupRes.body.idToken });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
  });
});

// tests/integration/encryption-roundtrip.test.ts
describe("Encryption Roundtrip (Device → Server → Storage)", () => {
  it("encrypts on device, transmits securely, stores encrypted", async () => {
    const plaintext = "My journal entry";
    const deviceEncrypted = await deviceEncryption.encrypt(plaintext);

    // Send to API
    const apiRes = await request
      .post("/api/journals")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({ content: deviceEncrypted });

    // Retrieve and verify still encrypted
    const retrieved = await request
      .get(`/api/journals/${apiRes.body.id}`)
      .set("Authorization", `Bearer ${jwtToken}`);

    expect(retrieved.body.content).not.toBe(plaintext);
    expect(retrieved.body.content).toBeDefined();
  });
});
```

**Coverage Target:** 80% (all unit tests + critical flows)

**Pros:**

- Catches integration bugs (API contracts, encryption roundtrips)
- Database tested in-memory (fast, no external deps)
- Tests auth flow, offline sync, AI fallbacks
- Supertest: mock HTTP requests without network

**Cons:**

- ❌ Takes longer to write (setup, mocking, assertions)
- ❌ E2E tests still need mobile device/emulator
- ❌ Slower CI/CD pipeline (~5-10 min vs 1 min for unit-only)

**Best For:** Professional MVP, client work, sensitive data (mental health).

---

#### **Option C: Full Testing (Unit + Integration + E2E + Mobile)**

```typescript
// tests/e2e/user-journey.test.ts (Detox for React Native)
import { element, by, expect as detoxExpect } from "detox";

describe("User Journey: Signup → Journal → Mood → Insights", () => {
  it("allows user to create a journal and view mood insights", async () => {
    // Signup
    await element(by.id("email-input")).typeText("test@example.com");
    await element(by.id("password-input")).typeText("SecurePass123!");
    await element(by.text("Sign Up")).multiTap();

    // Wait for dashboard
    await waitFor(element(by.id("journal-button"))).toBeVisible();

    // Create journal
    await element(by.id("journal-button")).tap();
    await element(by.id("journal-textarea")).typeText("Today was stressful...");
    await element(by.text("Save")).tap();

    // Verify journal appears in list
    await detoxExpect(element(by.text("Today was stressful"))).toBeVisible();

    // Check mood insights
    await element(by.id("insights-tab")).tap();
    await detoxExpect(element(by.text("Weekly Mood")).atIndex(0)).toBeVisible();
  });
});
```

**Coverage Target:** 100% (unit + integration + E2E + mobile)

**Pros:**

- Catches all bugs (logic, integration, UI, mobile-specific)
- Tests real user journeys
- Confidence for production release

**Cons:**

- ❌ Extremely slow (~30-45 min per CI/CD run)
- ❌ E2E tests flaky on device (timing issues, device state)
- ❌ Detox/Appium maintenance overhead
- ❌ Not worth the time for MVP (fast iteration is priority)

**Best For:** Late-stage production apps, large teams, regulated industries.

---

### **My Recommendation:**

**Option B – Unit + Integration Tests**

**Why:**

- Mental health data = high reliability requirement
- Integration tests catch encryption bugs, API contract mismatches, auth flows
- Still fast enough for CI/CD (~5 min)
- 80% coverage sufficient for MVP confidence
- Can add E2E tests later if needed
- Shows professional testing discipline (portfolio impact)

**Implementation Plan:**

1. **Unit Tests:** Encryption, auth, API response formatting, AI fallbacks (70% coverage)
2. **Integration Tests:** Auth flow, encryption roundtrip, offline sync, API contracts (80% coverage)
3. **Skip for now:** E2E mobile tests (save for production phase)
4. **Pre-commit hook:** Run tests before git push (no broken commits)
5. **CI/CD:** Tests must pass before Render deployment (safety gate)

**Trade-off:** Some mobile-specific bugs won't be caught until release (acceptable for MVP; fix in beta).

---

### Decision 6: Testing & Code Quality Strategy

**Selected:** Option B – Unit + Integration Tests

**Rationale:**

- Mental health data requires high reliability (encryption, auth, sync must work)
- Integration tests catch critical bugs: API contract mismatches, encryption roundtrips, auth flows
- 80% test coverage sufficient for MVP confidence
- Still fast CI/CD (~5 min) allows rapid iteration
- Shows professional testing discipline (portfolio value)

**Trade-offs Accepted:**

- ✅ Catches critical bugs before production
- ✅ Fast enough for daily iteration (5 min CI/CD)
- ✅ Professional portfolio quality
- ❌ Some mobile-specific bugs (UI, gesture handling) won't be caught until release
- ❌ E2E tests deferred to post-MVP phase

---

## Step 7: Implementation Patterns & Development Workflow (Final Step)

**Context:** All architectural decisions are locked. This final step documents how developers will write code—project structure, naming conventions, development workflow, and pre-launch checklist.

---

### Code Organization

```
mindmate-ai/
├── mobile/                           (React Native + Expo)
│   ├── app/                          (File-based routing)
│   │   ├── (auth)/                  (Auth screens)
│   │   ├── (app)/                   (Protected routes)
│   │   └── _layout.tsx              (Root layout)
│   ├── components/                  (Reusable UI)
│   ├── stores/                      (Zustand state)
│   ├── services/                    (API, encryption, AI)
│   ├── hooks/                       (Custom React hooks)
│   ├── utils/                       (Helpers, constants)
│   ├── __tests__/                   (Jest tests)
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                          (Express.js)
│   ├── src/
│   │   ├── routes/                  (Auth, journals, chat)
│   │   ├── controllers/
│   │   ├── services/                (Business logic)
│   │   ├── middleware/              (Auth, logging, errors)
│   │   ├── models/                  (Mongoose schemas)
│   │   ├── config/                  (Database, Firebase)
│   │   └── server.ts
│   ├── tests/
│   │   ├── unit/                    (Service tests)
│   │   └── integration/             (API flow tests)
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── jest.config.js
│
└── docs/
    ├── ARCHITECTURE.md
    ├── API.md
    ├── DEPLOYMENT.md
    ├── DEVELOPMENT.md
    └── SECURITY.md
```

---

### Naming Conventions

| Type             | Convention            | Example                |
| ---------------- | --------------------- | ---------------------- |
| React Component  | PascalCase            | `JournalEditor.tsx`    |
| Hook             | `use` prefix          | `useJournal()`         |
| Zustand Store    | `use` + PascalCase    | `useJournalStore.ts`   |
| Service          | camelCase             | `encryptionService.ts` |
| Constant         | UPPER_SNAKE_CASE      | `MAX_JOURNAL_SIZE`     |
| Variable         | camelCase             | `isLoading`            |
| Boolean function | `is*`, `has*`, `can*` | `isAuthenticated()`    |

---

### Development Workflow

**Feature branches:**

```bash
git checkout -b feat/journal-encryption
git commit -m "feat: implement device encryption"
```

**Code review checklist:**

- [ ] Tests pass (`npm run test`)
- [ ] No TypeScript errors
- [ ] Code formatted
- [ ] No console.log (use logger.ts)

**Deployment:**

```
Push to main
  ↓
GitHub Actions:
  1. Lint
  2. Type-check
  3. Test
  4. Build
  ↓
Pass? → Render auto-deploys
Fail? → Block merge
```

**Local setup:**

```bash
cd backend && npm install && npm run dev    # localhost:3000
cd mobile && npm install && npm run ios     # Simulator
```

---

### Pre-Launch Checklist

**Backend:**

- [ ] 80%+ test coverage
- [ ] Zero TypeScript errors
- [ ] Encryption tested
- [ ] Offline sync tested
- [ ] Rate limiting tested
- [ ] GDPR: data export works
- [ ] GDPR: data deletion works

**Mobile:**

- [ ] 80%+ test coverage
- [ ] Dark mode tested
- [ ] Biometric login works
- [ ] Offline journal creation works
- [ ] Local encryption verified

**Security:**

- [ ] All API calls use HTTPS
- [ ] JWT expires in 24 hours
- [ ] Device key in Keychain/Keystore
- [ ] No API keys in code
- [ ] Rate limiting active

**Documentation:**

- [ ] API.md complete
- [ ] DEPLOYMENT.md complete
- [ ] DEVELOPMENT.md complete
- [ ] README.md complete

---

## Architecture Summary

| Decision    | Selected                          | Impact                 |
| ----------- | --------------------------------- | ---------------------- |
| **Data**    | MongoDB + embedded docs           | 512MB optimized        |
| **Auth**    | Firebase + JWT + dual encryption  | Privacy-first, GDPR    |
| **API**     | RESTful + standardized errors     | Mobile-friendly        |
| **State**   | Zustand                           | Minimal boilerplate    |
| **Deploy**  | GitHub Actions + Render + MongoDB | Zero-cost → production |
| **Testing** | Unit + Integration (80%)          | High reliability       |

---

## Next Steps: Ready to Build

1. **Initialize:** `npx create-expo-app mobile && npx express-generator backend`
2. **Setup:** Node 18+, npm 9+, Xcode/Android Studio
3. **Repository:** Private GitHub with branch protection
4. **CI/CD:** GitHub Actions + Render auto-deploy
5. **Secrets:** Firebase, Gemini, MongoDB in env vars
6. **Code:** Start with auth, then mobile UI, then integrate

✅ **Architecture complete. All 6 decisions documented. Ready to code.**
