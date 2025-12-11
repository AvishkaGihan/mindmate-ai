---
document_type: "Product Requirements Document (PRD)"
project: "MindMate AI"
version: "1.0"
date: "2025-12-10"
author: "Avish"
status: "Active"
based_on: "Product Brief v1.0 (2025-12-10)"
---

# Product Requirements Document: MindMate AI

**Date:** 2025-12-10
**Version:** 1.0
**Author:** Avish
**Status:** Active
**Platforms:** iOS & Android (React Native)
**Target Launch:** Q2 2026

---

## 1. Executive Overview

### 1.1 Product Statement

**MindMate AI** is a privacy-first, adaptive mental wellness companion that learns from users' emotional patterns to provide personalized journaling prompts, empathetic AI chat, and mood insights. Unlike generic wellness apps locked behind paywalls, MindMate AI prioritizes accessibility (free core features), emotional intelligence (adaptive AI responses), and user trust (transparent privacy-first architecture).

**Core Promise:** Feel understood, supported, and less alone—without sacrificing your privacy.

### 1.2 Market Opportunity

- **Market Size:** $4.5B mental wellness app market
- **User Gap:** Millions lack access to affordable, trustworthy, adaptive mental health support
- **Competitive Weakness:** Existing solutions are either paywalled, generic, non-adaptive, or privacy-compromising

### 1.3 Product Positioning

**Primary Value:** Adaptive, empathetic emotional support that respects privacy and removes subscription friction

**Key Differentiators:**

1. Truly adaptive AI (learns mood patterns, language preferences, emotional triggers)
2. Privacy-first architecture (local encryption, transparent data practices)
3. Free core features (removes paywall friction for essential support)
4. Emotionally intelligent UX (calm, non-judgmental design)

### 1.4 Success Definition (Phase 1)

- **60%+ 30-day retention** (vs. industry baseline of 20–30%)
- **80%+ user satisfaction** ("I feel supported by MindMate")
- **Product-market fit validation** through user research and outcome metrics
- **Sustainable engagement** with 3–4 weekly interactions per active user

---

## 2. Target Users

### 2.1 Primary Segment 1: Young Professionals (Ages 25–30)

**Profile:** Sarah, Marketing Manager at a tech company

**Key Characteristics:**

- High stress from deadlines, performance pressure, always-on work culture
- Recurring emotional triggers: Monday anxiety, mid-week fatigue, late-night spirals
- Tech-savvy, digitally native, already use many apps
- Value privacy due to work environment sensitivity (don't want stress visible to employers)
- Time-constrained: need quick, accessible support, not 30-minute meditation sessions

**Primary Pain Points:**

1. Burnout from chronic stress without accessible support options
2. Inability to process work stress without professional help (expensive, time-consuming)
3. Fear that venting about work stress could harm career or be discovered
4. Impersonal wellness apps that don't understand their unique situation

**User Value Drivers:**

- One-tap journaling that's easier than opening social media
- AI that "remembers" patterns and reflects them back with compassion
- Private space to process work stress without judgment
- Quick relief (breathing exercise, reframing) that fits into busy schedule

**Success Indicators:**

- Opens app 3–4x per week
- Journals regularly (3–4 entries per week)
- Uses breathing exercises during evening stress peaks
- Reports improved sense of control and reduced nighttime anxiety

---

### 2.2 Primary Segment 2: College Students (Ages 18–24)

**Profile:** Maya, Junior at state university

**Key Characteristics:**

- Volatile emotional state: exam spikes, social anxiety, identity questions, homesickness
- Institutional gap: campus mental health services overwhelmed, low hours, social stigma
- Already comfortable with AI (generation grew up with technology)
- Value confidentiality: prefer MindMate over telling friends or family
- High emotional intensity but shorter crisis periods (exam panic, rather than chronic stress)

**Primary Pain Points:**

1. Lack of always-available, non-stigmatized support (campus counseling has waiting lists)
2. Fear of judgment from peers if mental health struggles are visible
3. Family anxiety: don't want to worry parents by seeking help
4. Acute stress peaks (exams, presentations) need immediate, accessible coping tools

**User Value Drivers:**

- No waiting lists, no office hours, truly accessible 24/7
- Confidential space without peer judgment or family worry
- AI support that feels like a peer, not clinical
- Pattern recognition that normalizes feelings ("This always happens during exam season")

**Success Indicators:**

- Uses app weekly, even during calm periods
- Increases usage intensity during high-stress periods (exams, deadlines)
- Journals authentically about emotional struggles
- Reports reduced overwhelm and improved crisis resilience

---

### 2.3 Secondary Segments (Future Expansion)

**Remote Workers & Freelancers:**

- High autonomy but isolation and income instability
- Emotional swings around client relationships and self-worth
- Benefit from private, adaptive companion

**Early-Career Parents:**

- Time-constrained (unable to attend therapy/group sessions)
- Acute stress from kids + work + sleep deprivation
- Need short, in-the-margins support (5-min journaling during naptime)

**International Students & Expats:**

- Cultural adjustment stress + student/professional pressure
- Distance from home support systems
- Privacy even more critical due to cultural context

---

### 2.4 User Personas (Detailed)

#### Persona 1: Sarah (Young Professional)

| Attribute                    | Details                                                                            |
| ---------------------------- | ---------------------------------------------------------------------------------- |
| **Age / Role**               | 27, Marketing Manager at SaaS company                                              |
| **Schedule**                 | 9am–6pm office hours + evening emails, Slack on weekends                           |
| **Emotional Cycle**          | Monday anxiety (all-hands, week ahead), mid-week fatigue, Thursday-Friday recovery |
| **Tech Comfort**             | Very high (daily with 8+ apps)                                                     |
| **Mental Health Background** | Never in therapy, thinks "I'm fine," but shows signs of chronic stress             |
| **Phone Usage**              | 4–5 hours/day; primarily messaging, email, social media                            |
| **Goals**                    | Reduce late-night spirals, feel more in control, understand stress patterns        |
| **Motivations**              | Privacy, efficiency, understanding her own patterns                                |
| **Barriers**                 | Skeptical of mental health ("I don't need therapy"), time-constrained              |
| **Device**                   | iPhone (iOS primary), occasional Android tablet                                    |

**Typical Usage Scenario:**

- 10:45pm, in bed, replaying a tense meeting from earlier
- Opens MindMate, journals the interaction in 5 minutes
- AI chat: "I notice you often replay conversations after work. What would help you let this go?"
- Uses 4-7-8 breathing exercise
- Falls asleep feeling less anxious

#### Persona 2: Maya (College Student)

| Attribute                    | Details                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| **Age / Role**               | 20, Junior, engineering major                                                            |
| **Schedule**                 | Classes 9am–4pm, study groups, exams, social events, irregular sleep                     |
| **Emotional Cycle**          | Constant baseline anxiety, spikes during exam weeks, social anxiety around presentations |
| **Tech Comfort**             | Very high (daily with 10+ apps, TikTok native)                                           |
| **Mental Health Background** | Aware anxiety exists, not in therapy (tried campus counseling, 8-week waitlist)          |
| **Phone Usage**              | 6+ hours/day; TikTok, Discord, messaging, studying apps                                  |
| **Goals**                    | Manage exam stress, feel less alone, understand emotional patterns                       |
| **Motivations**              | Accessibility, privacy, feeling understood                                               |
| **Barriers**                 | Limited free time, skeptical of professional help, family/peer judgment                  |
| **Device**                   | iPhone (iOS primary), some Android friends                                               |

**Typical Usage Scenario:**

- 2am during exam week, feeling overwhelmed and can't sleep
- Opens MindMate, journals about exam anxiety and sleep stress
- AI: "I've noticed exam weeks are always hardest for you. Here's what helps: breathing, then studying one section at a time"
- Views mood trends: sees pattern of poor sleep during exams
- Uses breathing exercise, feels slightly calmer, attempts to sleep

---

## 3. Core Requirements (MVP)

### 3.1 Functional Requirements (User-Facing Features)

#### 3.1.1 Mood-Aware Journaling

**Requirement 1.1: Mood Check-In**

- User can log emotional state via 1–2 tap interface
- Mood scale: 5-point scale (or emoji: 😢, 😟, 😐, 🙂, 😄)
- Optional mood tags: "Work," "Personal," "Sleep," "Social," etc. (pre-defined set)
- Timestamp captured automatically (used for pattern detection)
- Entry saved to device first, synced when online

**Acceptance Criteria:**

- Mood check-in completion takes <15 seconds
- Mood data stored securely (encrypted at rest)
- Offline-capable: mood can be logged without internet connection
- Sync happens silently when connection restored

---

**Requirement 1.2: AI-Generated Journaling Prompt**

- After mood selection, AI generates a contextual prompt based on:
  - Current mood (e.g., "You're feeling overwhelmed. What's weighing on you?")
  - Recent mood history (e.g., Monday anxiety → "Another Monday. Let's talk about what's ahead")
  - User's past journal themes (requires MVP-level context, not deep personalization yet)
- Prompt appears as a suggestion, not a requirement
- User can accept, skip, or manually journal without prompt

**Acceptance Criteria:**

- Prompt generates within 1–2 seconds of mood selection
- Prompts feel contextual, not generic (test with user feedback)
- Prompts tone matches "warm and understanding," not clinical
- No prompts that make assumptions ("You must be stressed about work") without evidence

---

**Requirement 1.3: Journal Entry Interface**

- Rich text editor with:
  - Basic formatting: bold, italic, strikethrough
  - Character count with soft guidance (no hard limit, but encourage 50–500 characters for "digestible" entries)
  - Auto-save every 30 seconds
  - Offline support: draft saved locally, synced when online
- No word minimums or gatekeeping; user can write as little or as much as needed
- Optional: brief summary/title field (single line) to categorize entry

**Acceptance Criteria:**

- Text editor is fast and responsive (no lag)
- Entries save locally even without internet
- Formatting preserved on sync
- No data loss if user force-closes app during editing

---

**Requirement 1.4: Journal Entry Timeline**

- Chronological list of past entries (newest first)
- Each entry shows:
  - Date + time
  - Mood level (visual indicator, e.g., emoji or color)
  - Mood tags (if any)
  - Preview text (first 100 characters)
- Tapping entry opens full text for reading/editing
- Swipe to delete (with confirmation)
- Search entries by date, mood, or tag (Phase 2)

**Acceptance Criteria:**

- Smooth scrolling through 100+ entries
- Entry preview is accurate and truncated properly
- Delete action is reversible (soft delete for first 30 days? or warn user)
- Navigation between entries is fast

---

#### 3.1.2 Lightweight AI Chat ("Talk to MindMate")

**Requirement 2.1: Single Conversation Interface**

- Clean chat UI with:
  - Message bubbles (user on right, AI on left)
  - Timestamp on each message
  - "Typing..." indicator when AI is generating response
  - Input field at bottom with send button (or return key)
- Context-aware responses draw from:
  - Recent journal entries (last 3–5 entries)
  - Overall mood trend (past 7 days)
  - Conversation history (within current session)
- Conversation stored locally; user can open/close chat anytime

**Acceptance Criteria:**

- Chat loads in <1 second
- AI response generates within 2–4 seconds (acceptable delay for MVP)
- Message bubbles display correctly with proper text wrapping
- Chat history persists across app closures
- User can see when AI is thinking (typing indicator)

---

**Requirement 2.2: AI Response Tone & Personalization**

- Responses are warm, empathetic, non-clinical (not robotic or therapist-like)
- Responses reference user context when relevant:
  - "I noticed you've been stressed about presentations this week"
  - "You mentioned feeling anxious on Mondays. Is that happening again?"
- Avoid advice-giving in favor of reflection:
  - Instead of: "You should try relaxing"
  - Try: "What would help you feel less pressured right now?"
- Responses are concise (1–3 sentences typically), leaving room for user to respond

**Acceptance Criteria:**

- User testing: 80%+ of responses feel "understood" not "generic"
- Context references are accurate (not making up details user didn't share)
- Tone is consistent across responses (warm, supportive, not overly casual)
- AI doesn't claim diagnostic capability ("I think you have depression")

---

**Requirement 2.3: Conversation Session Boundaries**

- Each time user opens "Talk to MindMate," they see full conversation history (not a new chat each time)
- Clear "Start a New Conversation" button to archive current chat and begin fresh (optional for user)
- Conversations persist indefinitely (or user can delete if they choose)

**Acceptance Criteria:**

- Conversation history always available (not lost when app closes)
- Chat loads quickly even with 50+ message history
- User can easily start a fresh conversation if desired

---

#### 3.1.3 Simple Mood Pattern Insights

**Requirement 3.1: Mood Chart (7-Day & 30-Day Views)**

- Line chart or bar chart showing mood over time
- X-axis: dates (7 days or 30 days selectable)
- Y-axis: mood level (1–5)
- Each data point represents a mood check-in
- Tap a data point to see full entry for that day

**Acceptance Criteria:**

- Chart renders smoothly with scrolling/zooming (30-day view)
- Data points are accurate (match actual mood check-ins)
- Touch interaction is responsive (tap to view entry)
- Chart is readable on phone screen (not cramped)

---

**Requirement 3.2: Pattern Recognition Summaries**

- "Most frequent mood this week: Stressed (4 times)"
- "You're often anxious on Mondays" (basic day-of-week analysis)
- "Sleep was low on days you journaled late at night" (if sleep data available)
- Summaries appear as simple text cards below mood chart
- No complex ML; use basic aggregation and grouping logic

**Acceptance Criteria:**

- Patterns are accurate based on actual data
- Patterns feel relevant and surprising (not obvious truths)
- Text is simple, non-technical (no jargon)
- Pattern cards update daily/weekly as new data comes in

---

**Requirement 3.3: Entry Insight Tags**

- When viewing a past entry, show:
  - Associated mood tag ("Work," "Sleep," "Social")
  - Related entries from same week (2–3 similar entries)
  - Trend snippet ("You were stressed 3 times this week")
- Tapping related entry navigates to that entry

**Acceptance Criteria:**

- Related entries are actually relevant (same mood or tag)
- Navigation between entries is smooth
- Insight cards don't clutter the entry view

---

#### 3.1.4 Guided Breathing Exercise (4-7-8 Method)

**Requirement 4.1: Breathing Exercise UI**

- Simple, elegant screen with:
  - Large visual circle that expands/contracts with breathing rhythm
  - Text instructions: "Breathe in (4)... hold (7)... out (8)"
  - Haptic feedback on breath transitions (optional, nice-to-have for MVP)
  - "Start" button to begin, "Stop" anytime to exit
- One complete cycle: 4 seconds inhale, 7 seconds hold, 8 seconds exhale (total: 19 seconds per cycle)
- Default: 5 cycles (approximately 95 seconds = ~1.5 minutes)

**Acceptance Criteria:**

- Visual circle scales smoothly with breath timing
- Haptic feedback (if implemented) is subtle, not jarring
- User can stop at any time
- Completion message appears after final cycle ("You did it! Take a moment.")
- No audio (keep app discreet in public)

---

**Requirement 4.2: Completion Feedback**

- After completion:
  - Positive message: "You did it! Take a moment to notice how you feel."
  - Optional: brief mood check-in ("How do you feel now?" with 1-5 scale)
  - Option to return to home or journal

**Acceptance Criteria:**

- Feedback is encouraging, not clinical
- Optional mood check-in captures user's post-exercise state
- Navigation options are clear

---

#### 3.1.5 Authentication & Onboarding

**Requirement 5.1: Signup Flow**

- Minimal signup (< 2 minutes):
  1. Email + password (or Google Sign-In option)
  2. "Welcome—this is a safe space for your thoughts" (trust-building message)
  3. Initial mood check-in: "How are you feeling right now?"
  4. "You're ready—start journaling or chat with MindMate"
- No forced profile completion, photo upload, or lengthy questionnaires
- User immediately sees main app interface after onboarding

**Acceptance Criteria:**

- Signup completion time: <2 minutes
- Error messages are helpful (invalid email, weak password, etc.)
- User can skip to app immediately after initial mood check-in
- Onboarding tone matches app (warm, non-clinical)

---

**Requirement 5.2: Login & Session Management**

- Email + password login, or Google Sign-In
- Biometric unlock option (Face ID / Touch ID) for convenience
- Session persists across app closures (user stays logged in)
- "Logout" option in settings (for shared devices)
- Password reset via email

**Acceptance Criteria:**

- Login works offline (with cached credentials)
- Biometric unlock is quick and reliable
- Session timeout after 30 days of inactivity (security best practice)
- Password reset email arrives within 5 minutes

---

### 3.2 Non-Functional Requirements

#### 3.2.1 Security & Privacy

**Requirement S1: Data Encryption**

- All sensitive data encrypted at rest:
  - Journal entries: AES-256 encryption
  - Mood logs: AES-256 encryption
  - User passwords: bcrypt hashing (never stored in plaintext)
- Data in transit: TLS 1.3 for all API calls
- Biometric data: handled by OS (not stored by app)

**Acceptance Criteria:**

- Encryption keys managed securely (not hardcoded)
- All API endpoints use HTTPS
- No sensitive data in app logs or crash reports

---

**Requirement S2: Privacy Policy & Transparency**

- Simple, human-readable privacy policy explaining:
  - What data is collected: email, mood logs, journal entries, authentication info
  - What is NOT collected: no behavioral tracking, no ads, no data sales
  - How data is used: only to improve user experience (storage + personalization)
  - How data is deleted: user can "wipe all data" anytime via settings
  - Who has access: only user + company (no third parties)
- Privacy policy linked in settings and onboarding
- In-app message: "Your mind is not a data source"

**Acceptance Criteria:**

- Privacy policy uses plain language (no legalese)
- Users can access policy from settings
- Data deletion feature works (user can verify deletion)
- No third-party tracking pixels or ads

---

**Requirement S3: Secure Data Deletion**

- User can delete individual entries anytime
- "Wipe all my data" button in settings:
  - Deletes all journals, mood logs, and user account data
  - Irreversible (confirmation required)
  - Data deleted within 30 days (industry standard)
- Account deletion available anytime

**Acceptance Criteria:**

- Data deletion is irreversible
- Deleted data not recoverable (or user warned of this)
- "Wipe all" action requires confirmation (2-step)
- User receives email confirmation of data deletion

---

#### 3.2.2 Performance & Reliability

**Requirement P1: App Performance**

- App launch time: <2 seconds (cold start)
- Navigation transitions: <200ms (smooth 60 FPS)
- Chat response time: <4 seconds (acceptable for AI)
- Chat UI responsive even while AI is generating response

**Acceptance Criteria:**

- Tested on iOS 14+ and Android 10+ devices
- Performance profiling shows consistent frame rates
- Network latency tracked and monitored

---

**Requirement P2: Data Sync & Offline Capability**

- App works offline for:
  - Journaling (entries saved locally, synced later)
  - Mood tracking (mood check-ins saved locally)
  - Viewing past entries (cached locally)
- Chat requires internet (acceptable trade-off for MVP)
- Sync happens automatically when connection restored
- No data loss if app crashes during sync

**Acceptance Criteria:**

- Entries saved offline are synced when online
- Sync doesn't overwrite newer entries (last-write-wins acceptable for MVP)
- User sees "syncing..." indicator
- No data loss in sync failures

---

**Requirement P3: App Reliability**

- Target uptime: 99% (Firebase + MongoDB Atlas both support this)
- Crash rate: <0.1% of sessions
- Graceful error handling (no blank screens)
- Rate limiting on API (prevent abuse)

**Acceptance Criteria:**

- Tested for crashes on main workflows
- Error messages are helpful, not technical
- API rate limits prevent single user from overwhelming backend

---

#### 3.2.3 Platform Compatibility

**Requirement PL1: iOS Requirements**

- Minimum iOS version: iOS 14
- Device types: iPhone (all modern models)
- Biometric: Face ID and Touch ID support
- Safe area handling for notched devices

**Acceptance Criteria:**

- App tested on iOS 14, 15, 16, 17+
- Notched devices display correctly
- Biometric unlocks work on all supported devices

---

**Requirement PL2: Android Requirements**

- Minimum Android version: Android 10 (API 29)
- Device types: phones (all common screen sizes)
- Biometric: fingerprint and face recognition support
- Hardware compatibility: works on various CPUs (ARM, x86)

**Acceptance Criteria:**

- App tested on Android 10, 11, 12, 13+
- Screen sizes supported: 4.5" to 6.5"
- Biometric works on devices with hardware support

---

### 3.3 User Interface Requirements

#### 3.3.1 Design Principles

1. **Calm over Engagement:** Minimalist layouts, soft colors, ample white space (not gamified)
2. **Non-Judgmental Tone:** Gentle microcopy, reassuring messages, no shame-based language
3. **Accessibility:** WCAG 2.1 AA compliance (readable fonts, color contrast, touch targets)
4. **Predictability:** Consistent navigation, familiar patterns, no surprises

---

#### 3.3.2 Key Screens (Wireframe-Level Specs)

**Home Screen:**

- Greeting: "How are you feeling today?" (time-appropriate greeting)
- Quick mood check-in button (large, prominent)
- "Talk to MindMate" button
- "View insights" button (mood chart)
- "Do a breathing exercise" button
- Bottom navigation: Home, Journal, Insights, Settings

**Journal Screen:**

- Title: "Your Journal"
- Timeline of past entries with preview
- Floating action button (FAB): "New entry"
- Search/filter (Phase 2)

**Insights Screen:**

- 7-day mood chart (default)
- Toggle to 30-day view
- Pattern summary cards
- Legend showing mood colors/emojis

**Chat Screen (Talk to MindMate):**

- Conversation history (messages in chronological order)
- User messages on right (blue/purple)
- AI messages on left (neutral/calm color)
- Text input at bottom with send button

**Settings Screen:**

- Account info (email, password reset)
- Privacy policy link
- Data deletion ("Wipe all my data")
- Biometric unlock toggle
- App version + build info

---

## 4. Product Workflows

### 4.1 Happy Path: New User's First 24 Hours

**Step 1: Download & Signup (Minutes 0–3)**

1. User downloads MindMate from App Store / Play Store
2. Opens app, taps "Sign Up"
3. Enters email, creates password (or signs in with Google)
4. Sees: "Welcome—this is a safe space for your thoughts"
5. Prompted: "How are you feeling right now?" with mood scale

**Step 2: First Mood Check-In & Prompt (Minutes 3–5)**

1. User selects mood (e.g., "Stressed")
2. Sees AI-generated prompt: "You're feeling stressed. What's weighing on you right now?"
3. User can journal or skip

**Step 3: First Journal Entry (Minutes 5–10)**

1. User taps prompt or manually starts journaling
2. Writes 2–3 sentences about their stress
3. Entry auto-saves
4. User sees: "Thank you. You're not alone."

**Step 4: First Interaction with AI Chat (Minutes 10–15)**

1. User taps "Talk to MindMate"
2. Sees AI response: "I read that you're feeling stressed. Want to talk about it?"
3. User responds (or explores other features)

**Step 5: First "Aha!" Moment (Minutes 15–20)**

1. User taps "Breathing Exercise"
2. Completes 4-7-8 breathing (1.5 minutes)
3. Feels calmer, sees: "You did it! Take a moment."

**Outcome:** User has experienced core value (feels understood, calm), trusts the app, bookmarks it.

---

### 4.2 Established User Engagement Cycle (Weekly)

**Monday–Friday (Work Days for Young Professionals):**

- Evening: Journals about work stress (2–3 minutes)
- AI chat: Reflects back pattern ("Another stressful Monday?")
- Uses breathing exercise if anxious (1.5 minutes)

**Weekend:**

- Views mood chart to see weekly patterns (2 minutes)
- Notices: "I'm always most stressed Monday–Wednesday"
- Has "aha!" moment: understands their own rhythm

**Outcome:** User feels supported, sees patterns, notices improvement over weeks.

---

### 4.3 High-Stress Moment (Acute Use Case)

**Scenario:** College student during exam week

**Flow:**

1. User opens app at 11pm, can't sleep due to exam anxiety
2. Taps "How are you feeling?" → selects "Anxious"
3. AI generates exam-week-aware prompt
4. Journals about exam stress (2 minutes)
5. AI chat: "Exam weeks are always hardest. Here's what helps: breathing first, then break studying into chunks"
6. Uses breathing exercise (1.5 minutes)
7. Feels slightly better, attempts sleep
8. Next morning: views mood trend, sees exam week pattern

**Outcome:** User has coping tool in acute moment, feels less alone, builds resilience.

---

## 5. Success Metrics

### 5.1 Phase 1 Success Criteria (Launch → Month 6)

#### 5.1.1 User Acquisition & Activation

| Metric                    | Target  | Definition                                                                                  |
| ------------------------- | ------- | ------------------------------------------------------------------------------------------- |
| **Day 7 Retention**       | ≥50%    | % of Day 1 users who return within 7 days                                                   |
| **Day 30 Retention**      | ≥60%    | % of Day 1 users who return within 30 days                                                  |
| **Onboarding Completion** | 70%+    | % of installed users who complete signup + first journal entry                              |
| **Time to First Value**   | <10 min | Average minutes from signup to first positive moment (breathing exercise, chat, or insight) |

---

#### 5.1.2 Core Engagement (Monthly Metrics)

| Metric                        | Target        | Definition                                                  |
| ----------------------------- | ------------- | ----------------------------------------------------------- |
| **Weekly Active Users (WAU)** | Steady growth | Unique users with at least 1 action per week                |
| **Journal Entries per MAU**   | 12–16/month   | Average entries per monthly active user (3–4 per week)      |
| **AI Chat Usage**             | 60%+ of MAU   | % of monthly active users using chat at least once          |
| **Breathing Exercise Usage**  | 50%+ of MAU   | % of monthly active users completing exercise at least once |
| **Insights Engagement**       | 50%+ of MAU   | % of monthly active users viewing mood chart at least once  |

---

#### 5.1.3 User Satisfaction & Outcomes

| Metric                       | Target | Definition                                                      |
| ---------------------------- | ------ | --------------------------------------------------------------- |
| **User Satisfaction Score**  | ≥4.2/5 | In-app survey: "Do you feel supported by MindMate?" (1–5 scale) |
| **Outcome Improvement**      | 65%+   | % of survey respondents reporting reduced stress/anxiety        |
| **Net Promoter Score (NPS)** | ≥40    | "Would you recommend MindMate to a friend?" (0–10 scale)        |
| **Privacy Confidence**       | 90%+   | % of users confident their data is private (onboarding survey)  |

---

#### 5.1.4 Business Metrics

| Metric                         | Target       | Definition                                            |
| ------------------------------ | ------------ | ----------------------------------------------------- |
| **Monthly Active Users (MAU)** | 10K–15K (M6) | Total unique users with at least 1 action per month   |
| **Monthly Downloads**          | 2K–3K        | New installs per month (growing)                      |
| **Organic Growth Rate**        | 15%+ by M6   | Month-over-month growth via referrals + word-of-mouth |

---

### 5.2 Key Performance Indicators (KPIs) to Track Weekly

1. **DAU (Daily Active Users):** Trend upward as product improves
2. **7-Day Retention:** Monitor for product quality; should improve with iterations
3. **New User Onboarding Funnel:** Track drop-off at each step (signup → first journal → chat)
4. **Average Session Length:** Should increase as users find value (target >5 min for engaged users)
5. **Breathing Exercise Completion Rate:** % of users who start and finish exercises
6. **AI Chat Sentiment:** Track if user responses are positive ("thanks," "helpful") vs. negative

---

## 6. Out of Scope (MVP)

**Explicitly NOT in MVP (Phase 2+ features):**

- Advanced personalization (tone preference learning, predictive trigger detection)
- Premium tier & payment infrastructure
- Affirmations & habit systems (badges, streaks, challenges)
- Advanced breathing library (meditation, multiple techniques)
- B2B features (therapist integration, institutional dashboards)
- Social features (sharing, community forums, friend support)
- Advanced analytics (correlation analysis, detailed trend reports)
- Full offline-first architecture (sync refinements, conflict resolution)
- Multi-language support
- Wearable data integration

**What stays in scope:** The core, emotionally safe experience of journaling + AI chat + mood insights.

---

## 7. Technical Architecture (MVP)

### 7.1 Tech Stack

| Layer          | Technology         | Rationale                                         |
| -------------- | ------------------ | ------------------------------------------------- |
| **Frontend**   | React Native       | Shared iOS/Android codebase, fast iteration       |
| **Backend**    | Node.js + Express  | Lightweight, easy to scale, good ecosystem        |
| **Database**   | MongoDB Atlas      | Free tier sufficient for MVP, flexible schema     |
| **Auth**       | Firebase Auth      | Quick setup, built-in security, free tier         |
| **AI/LLM**     | Google Gemini API  | Free tier available, good context-aware responses |
| **Deployment** | Render / Fly.io    | Free tier sufficient, easy deployment             |
| **Analytics**  | Firebase Analytics | Integrated, basic event tracking                  |

---

### 7.2 Data Model (High-Level)

```
User
├── id (unique)
├── email
├── password_hash (bcrypt)
├── created_at
└── settings

Journal Entry
├── id (unique)
├── user_id (FK)
├── mood (1–5 scale)
├── mood_tags (array)
├── text (encrypted)
├── created_at
└── updated_at

Chat Message
├── id (unique)
├── user_id (FK)
├── role ("user" or "assistant")
├── text
├── created_at

Mood Log
├── id (unique)
├── user_id (FK)
├── mood (1–5)
├── mood_tags (array)
├── created_at
```

---

### 7.3 API Endpoints (MVP)

```
POST /auth/signup           # User registration
POST /auth/login            # User login
GET /auth/user              # Get current user
POST /auth/logout           # Logout

POST /journal               # Create journal entry
GET /journal                # Get user's journal entries
GET /journal/:id            # Get specific entry
PUT /journal/:id            # Update entry
DELETE /journal/:id         # Delete entry

POST /chat                  # Send message to AI
GET /chat                   # Get conversation history

GET /mood/summary           # Get mood stats (7-day, 30-day)
GET /mood/insights          # Get mood patterns & insights

POST /user/delete-all       # Wipe all user data
```

---

## 8. Implementation Roadmap

### Phase 1: MVP (Months 0–3)

**Sprint 1–2 (Authentication & Core Journaling)**

- User signup/login (Firebase Auth)
- Basic journal creation + storage
- Simple mood check-in

**Sprint 3–4 (AI & Insights)**

- AI chat integration (Google Gemini)
- Mood tracking & basic pattern detection
- Mood chart (7-day, 30-day)

**Sprint 5–6 (Refinement & Launch)**

- Breathing exercise feature
- Privacy policy & data deletion
- Testing, bug fixes, app store submission

**Deliverable:** Minimum viable product with core features, ready for initial user cohort.

---

### Phase 2: Enhancement & Monetization (Months 6–12)

**Sprint 1–4 (Deep Personalization)**

- Tone preference learning
- Trigger detection algorithms
- Predictive reminder system

**Sprint 5–6 (Premium Tier)**

- Subscription infrastructure
- Advanced analytics (premium feature)
- Custom wellness programs

**Deliverable:** Scalable product with personalization + revenue model.

---

### Phase 3: Expansion (Months 12+)

**B2B Partnerships:**

- University wellness program integrations
- Employer wellness partnerships
- Therapist integration (export journals)

**Deliverable:** Multi-channel user acquisition + institutional revenue.

---

## 9. Constraints & Assumptions

### 9.1 Constraints

- **Launch Timeline:** Q2 2026 (6 months to MVP)
- **Team Size:** Small team (initially 2–3 engineers, 1 designer, 1 PM)
- **Budget:** Limited initial budget; free/low-cost tools prioritized
- **Platform:** iOS & Android simultaneously (React Native)

### 9.2 Assumptions

- **User Motivation:** Users will journal regularly if they feel understood (not forced gamification)
- **AI Quality:** Google Gemini API provides sufficient quality for contextual responses
- **Privacy as Differentiator:** Users will choose MindMate over competitors specifically for privacy
- **Network Effects:** Word-of-mouth referrals will drive acquisition (low CAC)
- **Retention Model:** Adaptive personalization + genuine support drives retention (not dark patterns)

---

## 10. Success Criteria & Decision Points

### 10.1 MVP Go/No-Go Decision (Month 3)

**GO Criteria (at least 3 of 4 must be true):**

1. ✅ 60%+ 30-day retention
2. ✅ 80%+ user satisfaction ("I feel supported")
3. ✅ 50+ positive user testimonials/stories
4. ✅ Organic acquisition rate >10% MoM

**NO-GO Criteria:**

- Retention <40% (indicates fundamental product issues)
- User satisfaction <60% (core value not delivered)
- Churn rate >10% per month (users not finding value)

**Action if NO-GO:** Conduct user research to identify missing value, iterate, then re-launch.

---

## 11. Risk Management

### High-Risk Items

| Risk                                         | Impact                             | Mitigation                                                     |
| -------------------------------------------- | ---------------------------------- | -------------------------------------------------------------- |
| **User privacy breach**                      | Trust destroyed, regulatory issues | Encrypt all sensitive data, hire security consultant for audit |
| **AI responses feel cold/clinical**          | Users churn, poor satisfaction     | Invest in prompt engineering, test with real users early       |
| **Poor retention (<40%)**                    | MVP fails                          | Collect user feedback monthly, iterate quickly                 |
| **Gemini API cost unexpectedly high**        | Budget overrun                     | Cap requests per user, have Ollama (local) fallback            |
| **Security vulnerabilities in dependencies** | Exploitable app                    | Regular dependency audits, use established libraries only      |

---

## 12. Glossary

| Term           | Definition                                                             |
| -------------- | ---------------------------------------------------------------------- |
| **MVP**        | Minimum Viable Product; core features to validate product-market fit   |
| **MAU**        | Monthly Active Users; unique users with at least 1 action per month    |
| **WAU**        | Weekly Active Users; unique users with at least 1 action per week      |
| **DAU**        | Daily Active Users; unique users with at least 1 action per day        |
| **Retention**  | % of users who return after N days                                     |
| **NPS**        | Net Promoter Score; measures likelihood of recommendation (0–10 scale) |
| **CAC**        | Customer Acquisition Cost; cost per new retained user                  |
| **LTV**        | Lifetime Value; estimated $ per user over their lifetime               |
| **Churn**      | % of users who become inactive per month                               |
| **Onboarding** | Initial signup + setup flow                                            |
| **Prompts**    | AI-generated suggestions to guide journaling                           |

---

## 13. Approval & Sign-Off

| Role                 | Name  | Date       | Signature |
| -------------------- | ----- | ---------- | --------- |
| **Product Manager**  | Avish | 2025-12-10 | ✅        |
| **Engineering Lead** | —     | —          | —         |
| **Design Lead**      | —     | —          | —         |

---

## Document History

| Version | Date       | Author | Change                             |
| ------- | ---------- | ------ | ---------------------------------- |
| 1.0     | 2025-12-10 | Avish  | Initial PRD based on Product Brief |

---

**Next Steps:**

1. **Engineering:** Validate technical architecture, begin Sprint 1 planning
2. **Design:** Create wireframes & visual design system
3. **Product:** Finalize launch timeline, set up analytics tracking

**Contact:** Avish (Project Lead)

---

_End of Document_
