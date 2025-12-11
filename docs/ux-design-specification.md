---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - "docs/prd-mindmate-ai-2025-12-10.md"
  - "docs/analysis/product-brief-mindmate-ai-2025-12-10.md"
inspiringApps:
  - "Apple Notes / Notion / Google Keep (frictionless capture)"
  - "Daylio / Reflectly (mood tracking patterns)"
  - "Headspace / Calm (visual calm & design patterns)"
  - "Discord / WhatsApp / iMessage (conversational UX)"
designSystemChoice: "React Native Paper + Custom Components"
workflowType: "ux-design"
lastStep: 8
specificationStatus: "Complete - Ready for Engineering Handoff"
project_name: "mindmate-ai"
user_name: "Avish"
date: "2025-12-10"
---

# UX Design Specification: MindMate AI

**Author:** Avish
**Date:** 2025-12-10
**Project:** MindMate AI
**Platform:** iOS & Android (React Native)
**Target Launch:** Q2 2026

---

## Overview

This UX Design Specification translates the MindMate AI Product Requirements Document into a detailed user experience blueprint covering information architecture, interaction design, visual design system, and key user flows.

**Core Design Philosophy:**

- **Calm over Engagement:** Minimize cognitive load and visual noise; prioritize peaceful, non-intrusive design
- **Non-Judgmental Tone:** Every interaction reassures users they're safe and not being evaluated
- **Accessibility First:** WCAG 2.1 AA compliance ensures inclusive design
- **Predictability:** Consistent patterns reduce friction and build trust

---

## Executive Summary

### Project Vision

MindMate AI is a **privacy-first, adaptive mental wellness companion** designed to help people feel understood and supported without sacrificing data privacy. Unlike subscription-locked wellness apps, MindMate prioritizes:

- **Adaptive AI** that learns mood patterns, language preferences, and emotional triggers to deliver increasingly personalized support
- **Privacy-First Architecture** with transparent practices (AES-256 encryption, local-first storage, user data control)
- **Free Core Features** removing subscription friction from essential mental health support
- **Emotionally Intelligent UX** that feels like a calm, steady companion—never manipulative or invasive

**Core Promise:** Feel understood, supported, and less alone—without sacrificing your privacy.

### Target Users

**Primary Segment 1: Young Professionals (Sarah, 25-30)**

Sarah is a marketing manager juggling deadlines, performance pressure, and an always-on work culture. She experiences:

- **Chronic stress patterns:** Monday anxiety, mid-week fatigue, late-night spirals replaying tough conversations
- **Barriers to help:** Can't afford therapy, exhausted by time commitment, fears transparency in workplace
- **Tech comfort:** Very high (4-5+ hours/day on apps)
- **Core need:** Quick, accessible, private space to process work stress and recognize patterns

**Success for Sarah:** Opens app 3-4x per week, journals after stressful moments, uses breathing exercise during evening peaks, notices "I'm always anxious on Mondays" pattern.

---

**Primary Segment 2: College Students (Maya, 18-24)**

Maya juggles exams, social anxiety, identity questions, and distance from home support systems. She experiences:

- **Volatile emotional state:** Acute stress spikes (exams, presentations), social anxiety, homesickness
- **Barriers to help:** Campus mental health services overwhelmed/stigmatized, can't tell parents, no waiting lists acceptable
- **Tech comfort:** Very high (6+ hours/day, TikTok native)
- **Core need:** Always-available, judgment-free, confidential support that feels like a peer, not an institution

**Success for Maya:** Uses app 3-4x weekly, increases usage during exam weeks, journals authentically about struggles, reports feeling less alone and more resilient.

---

### Key Design Challenges

1. **Building Trust Through Design**

   - Users share vulnerable thoughts in a new app; they must _feel_ safe from the first screen
   - Design solution: Communicate privacy through visual reassurance, transparent data messaging in context, and gentle microcopy

2. **Balancing Simplicity with Adaptive Intelligence**

   - MVP has limited personalization, but must _feel_ personalized and learning
   - Design solution: Use thoughtful context (recent mood, time of day, entry themes) to create relevance without pretending to know too much

3. **Preventing Overwhelm in Vulnerable Moments**

   - Users open during stress peaks (late night spirals, exam panic); complex UI adds friction
   - Design solution: One-tap primary actions, minimal decision trees, clear visual hierarchy showing "what's most important right now"

4. **Creating Habit Without Dark Patterns**

   - Build 3-4x weekly engagement through genuine value, not gamification or aggressive notifications
   - Design solution: Smart timing cues (breathing exercise at typical evening stress peak), pattern insights that surprise and delight, flexible encouragement

5. **Making Privacy Tangible**
   - Privacy is abstract; users need to _see_ that their data is safe
   - Design solution: Visible encryption indicators, clear data deletion flows, transparent privacy messaging woven into core UX

---

### Design Opportunities

1. **Mood Check-In as Design System Anchor**

   - The 5-point mood scale becomes the primary design token driving colors, animations, and prompt tone
   - Creates a cohesive, adaptive visual language where design itself responds to emotional state

2. **Conversation as Pattern Discovery Engine**

   - AI chat isn't just support—it's the mechanism for learning and reflection
   - Users naturally reveal patterns through dialogue; MindMate reflects them back with gentle insight
   - Conversation data → insights → "aha!" moments of self-understanding

3. **Empty States as Celebration**

   - Rather than "No entries yet," empty journal timeline celebrates the journey beginning
   - Builds psychological safety: "This is the start of understanding yourself"

4. **Breathing Exercise as Micro-Reset Ritual**

   - Visual expand/contract animation creates physiological anchor
   - Haptic feedback provides tactile grounding in high-stress moments
   - Creates reliable 90-second stress-response ritual

5. **Navigation as Emotional Journey Arc**
   - Home (check in now) → Journal (process and reflect) → Insights (understand patterns) → Settings (take control)
   - Information architecture mirrors the emotional progression from "I need help" to "I understand myself"

---

### Visual & Interaction Design Direction

**Visual Style:** Minimal, zen aesthetic

- Soft, desaturated color palette (muted teals, warm grays, gentle purples)
- Generous whitespace and low visual noise
- No heavy illustrations or clinical coldness; aim for a calm, neutral "safe room" feeling
- Typography: Clean, readable sans-serif with careful hierarchy
- Icon style: Minimal, line-based, calm

**Tone of Voice:** Neutral, steady companion with gentle warmth

- Neither hyped-up friendship nor formal clinical tone
- Core voice: "I'm here. What's on your mind?" + thoughtful reflection
- Microcopy reassures without presuming or over-explaining
- Responses reference user context without being predictive or invasive

**Onboarding Philosophy:** Speed to first value

- Prioritize reaching first mood check-in and journal entry within 1-2 taps
- Lightweight, inline explanations ("Here's how I'll help you") rather than tutorial flow
- No long signup forms, social proof walls, or feature tours
- Trust is built through experiencing the product, not reading about it

---

## Core User Experience

### Defining the Core Experience

MindMate AI's core experience centers on **two primary usage moments**:

1. **The Crisis/Stress Moment (Primary):** Sarah at 10:45pm, replaying a tense meeting; Maya during exam week, feeling overwhelmed. These are high-friction moments where users need immediate access to processing + grounding tools.

2. **The Daily Habit Moment (Secondary):** Regular journaling rhythm that naturally develops as users discover value. By checking in 3-4x weekly, users build pattern awareness and resilience.

The UX must optimize ruthlessly for the crisis momentremoving every possible barrierwhile making the daily habit effortless.

---

### Platform Strategy

**Platform:** iOS & Android (React Native), mobile-first
**Primary Interaction Model:** Touch-based, one-handed operation
**Primary Context:** Users are often in bed, in cars, during transitions, or in public spaces where privacy is paramount
**Offline Capability:** Journaling works offline (local save, cloud sync when online); AI chat requires internet (acceptable trade-off)

**Speed Requirements:**

- **Quick check-in flow:** Mood selection + optional brief journal entry in under 60 seconds, one hand
- **Extended flow:** When users have bandwidth, full journaling + AI chat in 3-5 minutes
- **Breathing exercise:** Complete guided breathing in 90 seconds

---

### Effortless Interactions

1. **Mood Check-In Entry**

   - On app open, users immediately see "How are you feeling right now?" with a 5-point scale
   - No loading screens, no onboarding, no forced navigation
   - One tap selects mood; optional tap to add context tag ("Work," "Personal," etc.)
   - Feels instant and completely frictionless

2. **Quick Journal Path**

   - After mood selection, user can either:
     - Tap pre-generated AI prompt to start writing
     - Skip and write freely
     - Skip and move directly to breathing exercise or chat
   - No gatekeeping; users control depth of engagement

3. **AI Context Awareness**

   - AI responses immediately reference what they just shared ("I notice you're stressed about work")
   - Feels personalized without being predictive or invasive
   - Responses appear within 2-4 seconds; loading state visible

4. **Breathing Exercise Access**

   - From any screen, users can tap "Take a breath" and start within 1 tap
   - Visual animation guides breathing; haptic feedback anchors attention
   - Complete in 90 seconds; no commitment

5. **Navigation Simplicity**
   - Bottom tab navigation: Home (check in), Journal (history), Insights (patterns), Settings
   - Home screen is the primary hub; all other screens supplement
   - Consistent, predictable navigation

---

### Critical Success Moments (UX Milestones)

**Milestone 1: First Mood Check-In (Day 1, First Tap)**

- User opens app immediately sees mood scale
- Selects mood in <15 seconds
- **Success signal:** Feels frictionless; user thinks "this is fast"

**Milestone 2: First Journal Entry (Day 1, First 5 Minutes)**

- User selects mood sees AI prompt (e.g., "You're feeling stressed. What's weighing on you?")
- Writes 1-3 sentences of authentic emotional content
- Entry auto-saves locally
- **Success signal:** User feels safe pouring thoughts; doesn't worry about judgment or permanence

**Milestone 3: First AI Chat Response (Day 1, First 10 Minutes)**

- User taps "Talk to MindMate"
- AI responds with empathetic, context-aware message (references their entry or mood)
- Response feels warm, not clinical
- **Success signal:** User reads response and thinks "yes, this gets it" (not generic)

**Milestone 4: First Pattern Insight (Day 3-7, First Week)**

- User opens Insights dashboard
- Sees visualization: "You've checked in 5 times this week"
- Sees pattern: "You're most stressed Monday-Wednesday"
- **Success signal:** User has "aha!" moment; realizes MindMate is learning from them

**Milestone 5: First Successful Coping Moment (Day 1-7, During Stress)**

- User opens during stress peak (evening anxiety, exam panic)
- Taps "Take a breath" completes 4-7-8 breathing exercise
- Immediately feels calmer
- **Success signal:** User associates app with stress relief; reaches for it again

---

### Experience Principles

These principles guide all UX decisions:

1. **Reach-In Speed:** Primary action (mood check-in) accessible in <2 taps, <10 seconds. Users should never feel friction when opening the app.

2. **Context Before Asking:** Prompts and responses reference what users have already shared. Each interaction feels personalized without requiring explicit preference configuration.

3. **Pull, Don't Push:** No notifications, no reminders. Users pull the app when they need it. Engagement comes from genuine value, not behavioral nudges.

4. **Authentic Reflection Over Surface Venting:** Chat and journaling encourage real emotional processing, not quick complaint dumps. AI responses create insight, not quick fixes.

5. **Progressive Insight:** Users discover patterns naturally through journaling and mood tracking, not forced analytics. Insights should surprise and delight, not feel obvious.

6. **Visible Safety:** Every interaction subtly communicates privacy and security. Visual indicators (lock icon, "encrypted" messaging, clear data controls) make safety tangible, not abstract.

7. **Adapt to Energy State:** When users are stressed/exhausted, make the app even simpler (mood check-in + breathing). When calm, encourage deeper journaling and insight exploration.

---

## Desired Emotional Response

### Primary Emotional Goals

MindMate AI's emotional design aims to transform users' experience from isolated distress to grounded resilience. The core emotional journey:

**In the Crisis Moment (Primary):**

- **Safety:** Users feel their thoughts are private, non-judgmental space where vulnerability is welcomed
- **Being Understood:** MindMate's responses reference their specific context (""I notice you're stressed about presentations""), not generic advice
- **Calm & Grounding:** After breathing exercise or journaling, measurable reduction in anxiety; user feels physically and mentally contained
- **Agency & Control:** Users experience ""I'm taking action"" rather than ""I'm spiraling helplessly""

**Over Time (Secondary):**

- **Relief:** Stress levels visibly decrease; users notice themselves spiraling less
- **Insight & Self-Compassion:** ""I'm not failing; I'm learning my patterns and taking small steps"" replaces self-criticism
- **Resilience:** Pattern recognition builds predictability: ""Exam weeks are always hard, and I know what helps""
- **Quiet Belonging:** ""I'm not alone in this; my struggles are normal and understandable""

**Emotional Differentiation from Competitors:**
Unlike content-heavy apps (which feel transactional) or gamified wellness tools (which feel performative), MindMate should feel like **having a steady, present companion**not a hyped friend, not a clinical therapist, but someone genuinely listening and reflecting back what you're experiencing.

---

### Emotional Journey Mapping

The emotional arc across critical moments:

| Moment                     | Current State                  | Desired Feeling                       | Design Role                                       |
| -------------------------- | ------------------------------ | ------------------------------------- | ------------------------------------------------- |
| **Opening App (Crisis)**   | Overwhelmed, scattered, stuck  | Contained, focused, ""I can do this"" | Simple UI unclutters mental noise                 |
| **Mood Check-In**          | Raw, unnamed emotion           | Acknowledged, named, validated        | Mood scale honors their specific feeling          |
| **Journaling**             | Venting, confused, spinning    | Processing, gaining clarity, heard    | Prompt structures thinking; tone validates        |
| **AI Response**            | Vulnerable, exposed, judged    | Understood, seen, supported           | Context reference = ""they truly get it""         |
| **Breathing Exercise**     | Anxious, physically tense      | Grounded, calm, anchored              | Animation + haptic = physiological relief         |
| **Viewing Insights**       | Pattern-blind, feeling broken  | ""Aha!"" realization, self-compassion | Simple visualization shows truth without judgment |
| **Returning (Days Later)** | Worried about judgment for gap | Welcomed, non-judgmental, open door   | Tone: ""Welcome back, anytime"" (never guilt)     |

---

### Micro-Emotions: Cultivate vs. Prevent

**Emotions to CULTIVATE:**

- **Trust** ""My data is safe; this company isn't exploiting my vulnerability""
- **Ease & Friction-Free** ""I don't have to figure out how to use this; it just works""
- **Being Truly Seen** ""MindMate gets my specific context, not treating me as generic""
- **Hope** ""Things can get better; I'm not broken""
- **Self-Compassion** ""My struggles are normal; I'm learning, not failing""
- **Quiet Accomplishment** Small wins feel real, not gamified

**Emotions to PREVENT:**

- **Judgment** Users should never feel shame or moral judgment for their feelings
- **Pressure or Guilt** No notifications, streaks, or performance anxiety
- **Overwhelm** Too many options, features, or choices when in distress
- **Betrayal or Distrust** Any hint that data isn't safe or being exploited
- **Fakeness** Generic, templated responses that don't reference what they actually shared
- **Performance Anxiety** Returning after weeks? Welcoming tone always, never guilt

---

### Design Implications for Emotional Responses

To achieve the desired emotional journey, UX decisions must:

1. **Visual Calm Communicates Safety**

   - Minimal, desaturated colors, generous whitespace, no visual noise
   - Slow, organic animations feel meditative
   - Result: Users feel held in a calm, neutral ""safe room""

2. **Context Reference Creates Understanding**

   - Every response references something they shared
   - Prompts adapt based on mood/time/recent themes
   - Result: Users feel genuinely known, not generic

3. **Privacy Visibility Builds Trust**

   - Encryption indicators, clear data controls, transparent messaging
   - Users can see and delete data anytime
   - Result: Safety feels concrete and tangible

4. **No Pressure Removes Guilt**

   - Zero notifications, reminders, or streaks
   - Re-entry after gaps is welcomed, never guilted
   - Result: Genuine engagement, not manipulation

5. **Progressive Insight Builds Self-Compassion**

   - Insights frame patterns as ""you're noticing"" not ""you're broken""
   - Observations are neutral and kind
   - Result: Users develop compassion for themselves

6. **Micro-Delights Add Warmth Without Manipulation**
   - Thoughtful, contextual prompts
   - Small celebrations feel genuine, not hollow badges
   - Result: Users feel cared for, not exploited

---

### Emotional Design Principles

These principles guide all micro-interactions:

1. **Unwavering Safety First** Every interaction signals privacy and non-judgment before functionality

2. **Authenticity Over Engagement** Genuine help over growth metrics; users trust real support

3. **Self-Compassion as Core Value** Help users understand themselves with kindness

4. **Presence Over Pressure** Available and warm without demanding attention

5. **Progress Over Perfection** Celebrate learning and small steps

6. **Human Connection Through Context** Use data to feel personally understood, never invasive

7. **Welcome Vulnerability** Make it easier to share; create psychological safety through design

---

## UX Pattern Analysis & Inspiration

### Inspiring Products Analyzed

**For Sarah (Young Professional) & Maya (College Student)**

Our analysis focuses on proven UX patterns from apps both segments use daily:

#### Text Capture & Journaling Patterns

**Notion / Apple Notes / Google Keep:**

- **Core Pattern: Frictionless Capture** � Blank canvas with minimal UI; typing starts immediately without form fields or configuration
- **Why It Works:** When Sarah or Maya need to journal, zero friction = higher likelihood of opening. Empty text field feels inviting, not intimidating
- **MindMate Adoption:** Journal entry screen should feel like a blank canvas after mood selection. One-tap to start typing, no required fields, optional formatting
- **Key Learning:** Users trust apps that let them think first, structure later

**Daylio / Reflectly Style Mood Trackers:**

- **Core Pattern: Icon-Based Quick Selection** Mood logged via emoji or icon scale, not text; tap-to-select in <2 seconds
- **Why It Works:** Icons create a universal language; quick visual selection removes decision fatigue during high-stress moments
- **MindMate Adoption:** Mood check-in (primary screen) uses 5-point scale with emoji indicators (, , , , ) or color gradients
- **Key Learning:** Visual affordances (icons, colors) communicate faster than text

#### Calm & Peaceful Design Patterns

**Headspace & Calm:**

- **Core Pattern: Color Psychology + Motion Design** Consistent soft color palette (muted blues, warm grays, gentle greens); slow, organic animations
- **Why It Works:** Users feel immediately safe; no jarring transitions or bright alerts; design itself becomes a coping tool
- **Visual Choices:** Soft desaturated colors, plenty of whitespace, rounded corners, slow ease-out animations
- **MindMate Adoption:**
  - Color palette: Muted teals, warm grays, gentle purples (avoid clinical whites or overly vibrant colors)
  - Animations: Slow breathing-pace transitions (400-600ms), no snappy or playful micro-interactions
  - Spacing: Generous margins, ample breathing room around text and buttons
- **Key Learning:** Visual design is not decorationit's emotional communication

#### Conversational UX Patterns

**Discord / WhatsApp / iMessage:**

- **Core Pattern: Message Bubble Interface** User messages on right (one color), other party on left (different color); timestamp; read receipts optional
- **Why It Works:** Feels like talking to a real person; familiar pattern (almost universal on modern phones)
- **MindMate Chat Implementation:**
  - User messages: Right-aligned, soft color (e.g., muted blue)
  - MindMate responses: Left-aligned, neutral warm tone (e.g., muted gray or taupe)
  - No read receipts or "typing" indicators (to avoid pressure)
- **Key Learning:** Familiar patterns reduce cognitive load; users immediately know how to use chat

#### Navigation & Information Architecture

**Bottom Tab Navigation (iOS Standard):**

- **Core Pattern:** 4 tabs at bottom of screen; active state highlighted; clear labels
- **MindMate Structure:**
  - **Home** (mood check-in + quick actions)
  - **Journal** (entry timeline + search)
  - **Insights** (mood chart + patterns)
  - **Settings** (account, privacy, data deletion)
- **Key Learning:** Bottom nav on mobile is ideal for thumb-based navigation

---

### Transferable UX Patterns for MindMate

**Navigation & Structure:**

- **Bottom Tab Navigation** Proven pattern from Daylio, Calm, Discord; thumb-friendly
- **Home as Primary Hub** All secondary screens extend from Home; Home is never buried
- **Consistent Icon + Label** Each tab has clear icon + text label (never icon-only)

**Text Entry & Journaling:**

- **Blank Canvas Approach** After mood selection, present empty text field without required fields
- **Optional Prompt** AI-generated prompt as suggestion, not requirement
- **Auto-Save** Entries save locally every 30 seconds; no "save" button

**Mood Selection:**

- **Icon-Based 5-Point Scale** Emoji or color scale for instant recognition
- **Optional Context Tag** Users can add 1 tag for quick categorization
- **Speed Optimization** Mood logged in <15 seconds

**Visual Calm:**

- **Soft Desaturated Palette** Muted teals, warm grays, gentle purples
- **Generous Whitespace** Minimum 16pt padding around content
- **Slow Animations** 400-600ms transitions (feels meditative)
- **Rounded Corners** Gentle visual hierarchy; no sharp edges

**Chat & Messaging:**

- **Message Bubble Interface** User on right, MindMate on left
- **Context-Aware Responses** Always reference user's recent entries or mood trends
- **No Typing Indicators** Avoid pressure; show only if response takes >2 seconds

**Emotional Safety in Design:**

- **Privacy Indicators** Lock icon on journal entries; "Encrypted" badge
- **No Gamification** No badges, streaks, points, or notifications
- **Non-Judgment Tone** All microcopy is warm and forgiving

---

### Anti-Patterns to Avoid

**What NOT to do (based on Calm, Headspace, Wysa failures):**

**Paywall Friction** Core features locked behind subscriptions

- **MindMate:** All core features are permanently free

**Heavy Onboarding** 5-10 screen signup processes

- **MindMate:** Email + password + first mood check-in, <2 minutes

**Content Library Feel** Browsing curated content instead of personal reflection

- **MindMate:** Focus on user's own entries and AI chat

**Gamification & Streaks** Notifications about achievements

- **MindMate:** Zero notifications, zero streaks, zero pressure

**Generic AI Responses** Templated replies without user context

- **MindMate:** Every response personalized with reference to user's data

**Clinical Tone** Formal therapeutic language

- **MindMate:** Warm, conversational, peer-like voice

**Overwhelming UI** Too many features and options visible at once

- **MindMate:** Progressive disclosure; show only what's needed

---

### Design Inspiration Strategy

**What We're Adopting:**

1. **Blank Canvas Journaling** from Apple Notes
2. **Icon-Based Mood Selection** from Daylio
3. **Bottom Tab Navigation** from Discord/Daylio
4. **Message Bubble Chat** from iMessage
5. **Calm Aesthetic** from Headspace/Calm

**What We're Adapting:**

1. **Calm's Visual Language** Simplified for text-first journaling
2. **Daylio's Quick Logging** Combined with AI context for personalization
3. **Notion's Flexibility** Optional prompts without forcing structure

**What We're Avoiding:**

1. **Paywall Model** from Calm/Headspace
2. **Heavy Onboarding** from most wellness apps
3. **Gamification** from health apps
4. **Generic Chatbot Responses** from Wysa/Replika
5. **Clinical Tone**

---

## Design System Foundation

### Design System Choice

**React Native Paper + Custom Components**

**Rationale:**

MindMate AI requires speed-to-MVP paired with custom emotional UX moments. React Native Paper provides a proven, themeable component foundation that eliminates low-value engineering work (buttons, cards, modals, navigation) while leaving complete creative freedom for high-impact elements (breathing animation, chat bubbles, mood scale, journal entry canvas).

**Why This Approach Works:**

1. **Speed:** Established component library eliminates building basic UI from scratch; allows team to focus on core emotional experience
2. **Customization:** Paper's theming system supports our soft, desaturated color palette and calm aesthetic without requiring design system overhaul
3. **Accessibility:** Built-in WCAG 2.1 AA compliance; secure defaults reduce risk of shipping inaccessible product
4. **React Native Proven:** Paper is battle-tested with React Native; cross-platform consistency between iOS and Android
5. **Flexibility:** Supports both using Paper components as-is and extending/wrapping them for custom UX
6. **Team Efficiency:** Small team can move fast; no time wasted on "how do we build a button?"

---

### Implementation Approach

**Foundation Setup (Week 1-2):**

1. **Install React Native Paper** and configure theming
2. **Define Color Tokens** matching our design direction:
   - Primary Calm: #6B9FA3 (muted teal) Trust, safety
   - Secondary Grounding: #8A7E7E (warm gray) Neutral, contemplative
   - Tertiary Gentle: #9B8FA3 (soft purple) Introspection, kindness
   - Neutral Base: #F5F5F3 (off-white) Breathing room
   - Accent Subtle: #7DA399 (muted sage) Hope, growth
3. **Configure Typography** (clean sans-serif like Inter or Roboto)
4. **Define Spacing Scale** (8pt base, multiples for consistency)
5. **Set Motion Design Defaults** (400-600ms ease-out for transitions)

**Paper Component Usage (Ongoing):**

- **Button:** Use Paper's Button component with custom theming; minimal styling
- **Card:** Use Paper's Card for journal entries, mood summaries; light customization
- **TextField:** Use Paper's TextInput for entry composition; auto-focus, multi-line
- **Modal:** Use Paper's Modal for menus, settings; customize backdrop transparency
- **BottomNavigation:** Use Paper's BottomNavigation for 4-tab structure; full Paper theming applies
- **AppBar:** Use Paper's AppBar for headers; minimal, clean aesthetic
- **List/FlatList:** Use Paper's List component for journal timeline

**Custom Components (Core UX Moments):**

These elements require full custom development to achieve emotional impact:

1. **MoodScale.tsx**

   - 5-point emoji/color-based scale
   - Animated selection feedback
   - Haptic feedback on selection
   - Custom rendering (not a Paper component)

2. **BreathingExercise.tsx**

   - Animated expanding/contracting circle
   - 4-7-8 rhythm (19 seconds per cycle)
   - Haptic feedback on breath transitions
   - Custom animation library (React Native Reanimated)

3. **ChatBubble.tsx**

   - Message bubble interface (user right, AI left)
   - Context-aware content reference (custom rendering)
   - Smooth scroll to latest message
   - Custom styling (not Paper)

4. **JournalCanvas.tsx**

   - Blank text input field (frictionless)
   - Auto-save indicator (custom)
   - Optional prompt display (custom placement)
   - RichTextEditor integration (if needed)

5. **MoodChart.tsx**
   - 7-day and 30-day views
   - Line or bar visualization
   - Custom chart library (React Native Chart Kit or similar)
   - Pattern insight overlays

---

### Customization Strategy

**Paper Components: Minimal Override**

For standard UI elements (buttons, cards, inputs, navigation), use Paper's defaults with color token customization:

`javascript
// Theme configuration
const theme = {
  colors: {
    primary: '#6B9FA3',        // Muted teal
    accent: '#9B8FA3',          // Soft purple
    background: '#F5F5F3',      // Off-white
    surface: '#F5F5F3',
    error: '#E8A8A0',           // Soft red
    text: '#333333',            // Dark gray
    disabled: '#CCCCCC',
    placeholder: '#999999',
    backdrop: 'rgba(0,0,0,0.4)',
  },
  roundness: 12,              // Soft corners
};
`

**Custom Components: Full Creative Control**

For emotional UX moments, build completely custom components with:

- Custom animations (Reanimated for smooth 60fps)
- Haptic feedback integration
- Contextual styling based on mood/state
- Smooth transitions matching our motion design language

---

### Component Inventory (MVP)

**From Paper Library (Themeable):**

- Button, IconButton
- Card, Surface
- TextInput, Text
- Modal, Portal
- BottomNavigation
- AppBar / Header
- List, ListItem
- Divider, FAB (Floating Action Button)
- BottomSheet (if needed for modal flows)
- Checkbox, Radio Button (if needed for settings)

**Custom Components (High-Impact):**

- MoodScale (5-point emoji/color selector)
- BreathingExercise (animated circle + 4-7-8 rhythm)
- ChatBubble (message interface)
- JournalCanvas (blank text entry with prompt)
- MoodChart (7-day, 30-day visualization)
- PatternInsight (simple text cards showing patterns)
- PrivacyIndicator (lock icon, encrypted badge)
- EmptyState (celebration when no entries)

---

### Design Token Documentation

**Colors:**

| Token               | Value   | Usage                                                  |
| ------------------- | ------- | ------------------------------------------------------ |
| Primary Calm        | #6B9FA3 | Primary buttons, active states, trust/safety messaging |
| Secondary Grounding | #8A7E7E | Neutral text, secondary buttons, backgrounds           |
| Tertiary Gentle     | #9B8FA3 | Accent elements, introspection moments                 |
| Neutral Base        | #F5F5F3 | App background, card backgrounds, whitespace           |
| Accent Subtle       | #7DA399 | Progress indicators, positive feedback                 |
| Error               | #E8A8A0 | Validation errors (soft, not jarring)                  |

**Typography:**

| Element   | Font  | Size | Weight | Line Height |
| --------- | ----- | ---- | ------ | ----------- |
| Heading 1 | Inter | 24pt | 600    | 1.3         |
| Heading 2 | Inter | 20pt | 600    | 1.4         |
| Body      | Inter | 16pt | 400    | 1.6         |
| Small     | Inter | 14pt | 400    | 1.5         |
| Tiny      | Inter | 12pt | 400    | 1.4         |

**Spacing:**

| Scale | Value | Usage                           |
| ----- | ----- | ------------------------------- |
| xs    | 4pt   | Tight spacing within components |
| sm    | 8pt   | Small gaps between elements     |
| md    | 16pt  | Standard padding and margins    |
| lg    | 24pt  | Larger sections                 |
| xl    | 32pt  | Major layout divisions          |

**Motion:**

| Type     | Duration | Easing   | Usage                              |
| -------- | -------- | -------- | ---------------------------------- |
| Standard | 300ms    | ease-out | Navigation, state changes          |
| Slow     | 500ms    | ease-out | Breathing exercise, calm moments   |
| Micro    | 150ms    | ease-out | Button presses, small interactions |

---

### Design System Handoff

**For Developers:**

1. Theme file with all color, typography, spacing tokens
2. Component library documentation (which Paper components to use where)
3. Custom component code examples and patterns
4. Motion design specifications and easing curves
5. Accessibility checklist (a11y requirements per component)

**For Designers:**

1. Figma file with Paper component library mirrored
2. Custom component specifications and states
3. Color palette and usage guidelines
4. Typography scales and hierarchy
5. Motion design reference (video/animation samples)

---

## Defining Experience Flows

### Core User Flows Overview

MindMate AI operates three primary experience flows, each supporting a different user need. All flows share consistent navigation and emotional design principles, but vary in depth and time commitment.

| Flow                    | Duration | Trigger                                | Primary Goal                                | Success Metric                                                   |
| ----------------------- | -------- | -------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------- |
| **Crisis Flow**         | 3-5 min  | User experiencing acute stress/anxiety | Immediate grounding & emotional containment | User feels measurably calmer; breathing stabilized               |
| **Daily Check-In**      | 1-2 min  | Regular habit, morning or evening      | Quick mood capture & self-awareness         | 1-2 mood entries logged; minimal friction                        |
| **Insight Exploration** | 5-10 min | User reviewing past entries/patterns   | Pattern discovery & self-compassion         | User discovers connection between mood/context; feels understood |

**Navigation Architecture (4-Tab Bottom Navigation):**

1. **Home (default)** Quick access to mood check-in, breathing exercise, quick journaling
2. **Journal** Timeline of all entries, searchable, filterable by mood
3. **Insights** Pattern visualization (7-day, 30-day charts), pattern cards
4. **Settings** Profile, privacy controls, breathing preferences, notification settings (off by default)

---

### Flow 1: Crisis Flow (Acute Stress/Anxiety Moment)

**Trigger:** User opens app during or immediately after stressful moment

**Time Budget:** 3-5 minutes (user has limited attention/executive function)

**User Goals:**

- Stabilize emotionally
- Feel understood and held (not judged)
- Ground themselves in their body
- Reduce overwhelm/panic

**Screen Sequence:**

**[1] Mood Check-In (30 seconds)**

`

       How are you feeling?        Headline (warm, open-ended)

                       5-point mood scale (emoji + color)
    Bad Okay Mid Good Great        Labels (minimal)

            [Next ]               Primary CTA

`

**Interaction Details:**

- Mood scale is **large, tap-friendly** (min 48pt height)
- Selection provides **haptic feedback** (medium vibration)
- Color associated with mood (sad=warm gray, great=soft teal)
- "Next" button enabled after selection; smooth fade-in
- No overthinking required; user selects mood instantly

**[2] Quick Context (1 minute)**

`

    What's on your mind?           Headline

A few words about what's Text input
making you feel [mood]...

Feeling anxious about the Placeholder text
presentation tomorrow...

[Skip] [Breathe] Secondary/Primary CTA

`

**Interaction Details:**

- **Single-sentence context** is enough; user can skip
- Auto-focus on text input; keyboard appears
- Placeholder text is context-aware ("Feeling anxious about...", "Stressed about...")
- "Skip" allows user to move forward without typing (respect energy level)
- "Breathe" (primary) transitions to breathing exercise

**[3] Breathing Exercise (2-3 minutes)**

`

           Take a breath           Gentle instruction (top)

                                  Expanding/contracting circle
                                   Animated, 19 sec per cycle

Breathe in... Breathe out... Text prompt (matches animation)

         [Finish Early]            Allow exit anytime

`

**Interaction Details:**

- **4-7-8 Breathing:** 4 sec breathe in (circle expands), 7 sec hold (circle holds), 8 sec breathe out (circle contracts)
- **Full-screen, no distractions.** No tabs, no buttons except "Finish Early"
- **Haptic feedback at breath transitions** (subtle haptic cues user when to breathe in/out)
- **Calm color palette** (background is soft off-white, circle is primary calm teal)
- **Loop 3 times automatically** (57 seconds 3 3 min total)
- User can tap "Finish Early" anytime to move on; app respects choice

**[4] Post-Breathing Reflection (1 minute, optional)**

`

    A bit calmer now?              Question (gentle, open)

     Yes, I feel grounded        Checkbox (optional feedback)
     Still overwhelmed
     Just needed a moment

[Journal More] [Done] Exit points (respect choice)

`

**Interaction Details:**

- **No pressure to answer.** Checkboxes are optional; user can skip to "Done"
- **Feedback is private** (not shared anywhere; just helps user reflect)
- "Journal More" leads to quick journaling (Step 6); "Done" returns to home
- This reflection helps user assess if they need deeper support

**[5a] Quick Journal (Optional, 2-5 minutes)**

If user selected "Journal More":

`

      Jot down your thoughts       Headline

What happened? What did you Large text input
do to help? What might help
in the future?

[User typing...]

    Auto-saving...              Auto-save indicator

[Back] [Done] Navigation

`

**Interaction Details:**

- **Completely blank canvas** (no prompts, no structure; respect user's need to express)
- **Auto-save in background** every 2 seconds (no save button, no interruption)
- **Large text input** (full available space below headline)
- User controls depth: 1 sentence or 10 sentences both valid
- "Done" returns to home

**[5b] AI Chat (Optional, if crisis severity remains high)**

If user is still distressed after breathing + journaling, offer:

`

          Talk it out?             Offer (not mandate)

Sometimes it helps to talk
about what you're feeling.
I'm here to listen. Warm, grounded tone

      [Chat]  [Skip]

`

**If user selects "Chat":**

`

[back]

[User's mood check-in]
Feeling anxious about the Right-aligned user message
presentation tomorrow.

I hear youpresentations Left-aligned AI response
can feel really vulnerable.
...

[Message input ] [] Text input + send

`

**Interaction Details:**

- **Chat only appears after breathing + optional journaling** (prevents jumping straight to chat during crisis)
- **AI reads context** from mood + journal entry; responses are specific, not generic
- **User can exit anytime** via back arrow; no guilt, no "are you sure?"
- **Message bubbles** (user right, AI left) with soft colors matching theme
- **Auto-scroll to latest message** as conversation grows

**Crisis Flow Exit Paths:**

After any step, user can:

1. **Return to Home** (feel better, done for now)
2. **Continue to Journal** (need to express more deeply)
3. **Chat with AI** (need someone to talk to)
4. **Exit to Home** (overwhelmed by too many options)

**Key UX Principles for Crisis Flow:**

- **Minimal friction:** 3-5 minutes max; user doesn't have energy for depth
- **No judgment:** Every option (skip, exit, chat) is presented equally; no "right" path
- **Emotional validation:** Wording reflects understanding (""I hear you,"" ""That sounds tough"")
- **Respect agency:** User controls depth, pace, and exit points
- **Haptic + visual feedback:** Physical sensation adds grounding (not just visual)
- **Color psychology:** Soft, calm palette; consistent with emotional goals

---

### Flow 2: Daily Check-In (Regular Habit)

**Trigger:** User opens app daily (morning or evening)

**Time Budget:** 1-2 minutes (habit, not deep reflection)

**User Goals:**

- Quick mood snapshot
- Build awareness of patterns over time
- Minimal friction (respect limited time)
- Feel a sense of small progress/accomplishment

**Screen Sequence:**

**[1] Home Tab (Default Landing)**

`

     Good morning, [name]          Personalized, warm greeting
     Today: [date]

     How are you today?            Simple CTA

                        5-point mood scale

Recent entries: Lightweight journal preview
Yesterday: "Feeling better"
2 days ago: "Had a good...

[View All] Link to Journal tab

`

**Interaction Details:**

- **Greeting is personalized** (""Good morning, Sarah"" vs ""Good evening, Maya"")
- **Mood scale is primary CTA** (takes up ~40% of screen, large, tappable)
- **No mandatory depth;** user taps mood and can stop there
- **Recent entries preview** shows last 3 journal entries (encourages consistency without pressure)
- **Bottom navigation is visible** (user can switch to Journal, Insights, Settings anytime)

**[2] After Mood Selection**

`

Thanks for checking in. Positive reinforcement

Quick note? (optional) Secondary offer (not required)

[Optional text input, 1-2
sentences about how you're
feeling]

         [Save]  [Skip]           Optional; Skip is equally valid


    Tip: 7-day mood chart       Lightweight insight

shows your week. Check
Insights tab to see patterns.

`

**Interaction Details:**

- **Celebration/validation** (""Thanks for checking in"") after mood selection
- **Note is completely optional** (Skip button equal prominence to Save)
- **Micro-tip** suggests next discovery (Insights tab) without mandating
- **If user saves:** Entry is timestamped and added to timeline
- **If user skips:** Mood alone is captured; lightweight entry

**[3] Return to Home**

After saving or skipping, app returns to home tab:

`

Good morning, [name] Checkmark indicates today logged
Today: [date]

You've logged [N] days in a Streak counter (lightweight)
row. Keep it up!

Breathe Quick access to breathing

Recent entries:
Today: [mood emoji] Today's entry marked as done
Yesterday: "Feeling better"
2 days ago: "Had a good..."

`

**Interaction Details:**

- **Checkmark on greeting** shows today is logged (visual completion)
- **Streak counter** is lightweight/celebratory, not gamified (small number, no badges)
- **Breathing quick-access** reminds user they can access anytime
- **Today's entry highlighted** shows user's progress

**Key UX Principles for Daily Check-In:**

- **Zero friction:** Mood only takes 5 seconds; optional note adds 30 seconds
- **Celebration, not nudging:** Positive reinforcement (""Thanks,"" checkmark) vs. reminders
- **Discovery without mandate:** Micro-tips point to Insights without pushing
- **Lightweight streak:** Counter shows consistency without creating pressure
- **Return to home:** User can check in and move on; no forced exploration

---

### Flow 3: Insight Exploration (Discovering Patterns)

**Trigger:** User reviews past entries, checks Insights tab, or AI suggests pattern

**Time Budget:** 5-10 minutes (reflective, not rushed)

**User Goals:**

- Discover patterns in mood, stress, and behaviors
- Understand triggers and effective coping strategies
- Build self-compassion (""I'm learning, not failing"")
- Feel hopeful about growth

**Screen Sequence:**

**[1] Insights Tab (Overview)**

`

         Your Patterns             Simple heading

    7-day mood trend             Tab toggle (7-day / 30-day)

     Line chart, soft colors     Interactive chart (tap for details)
     Average mood: [emoji]

Insights: Auto-generated pattern cards
"You're calmer after
breathing exercises"
"Weekday mornings trend
anxious"
"Journaling helps you
process stress"

[View Full Journal]

`

**Interaction Details:**

- **Chart is interactive** (tap to see specific day, values)
- **7-day / 30-day toggle** allows zooming in/out on patterns
- **Pattern cards are simple, human-readable** (not overly analytical)
- **Each card has a subtle checkbox** (user can mark as ""helpful insight"" without saving)
- **View Full Journal link** allows user to jump to supporting entries

**[2] Pattern Deep-Dive (User taps on pattern card)**

`

[Back]

    Weekday mornings trend       Pattern title
      anxious

From your entries: Supporting evidence
Mon 8:30am: "Anxious
before standup"
Tue 8:15am: "Dreading
meetings today"
Wed 8:45am: "Nervous
about presentations"

What might help: Reflection prompt
Try breathing before your
first meeting?

[Note this insight] [Back]

`

**Interaction Details:**

- **Back arrow** returns to Insights overview
- **Pattern title** is clear and non-judgmental
- **Supporting entries** show specific examples (user can tap to see full entry)
- **Suggested action** is gentle, not prescriptive (""might help,"" not ""you should"")
- **Note insight** allows user to save to a ""My Insights"" section (optional)

**[3] Journal Tab (Timeline View)**

`

Journal Tab label

Sort/Filter:
[All] [Bad] [Okay] Mood filter (touch to toggle)
[Mid] [Good] [Great]

    Today                        Date header
    "Had a really good day,     Entry preview (tap to view)
      felt more focused"

    Yesterday
    "Anxious about the
      presentation tomorrow"

    2 Days Ago
    "Mixed feelings today,      Scrollable list
      good meeting but tired"

[Load more]

`

**Interaction Details:**

- **Mood filters** allow user to browse by mood (e.g., ""Show me all anxious days"")
- **Date headers** group entries by day
- **Entry preview** shows first 1-2 sentences + mood emoji
- **Tap entry to view full text** in modal or full-screen
- **Scroll infinite** with ""Load more"" button for older entries

**[4] Full Entry View (User taps on journal entry)**

`

[Back]

    Yesterday at 8:30pm         Metadata (date, time, mood)
    Anxious

I'm really nervous about the Full entry text
presentation tomorrow. I keep Clean typography, generous spacing
thinking about what could go
wrong, and I can't focus on
anything else. I tried to
journal about it, but I just
keep spiraling.

    Note this insight
    Edit entry
    Delete entry

`

**Interaction Details:**

- **Metadata** (date, time, mood) appears at top
- **Full text displayed** with generous line height and spacing (comfortable to read)
- **Actions** (note, edit, delete) appear at bottom
- **No AI analysis forced** on user; user can tap ""Note insight"" if they want to save reflections
- **Edit/Delete** allow user control over their journal

**Key UX Principles for Insight Exploration:**

- **Patterns surface naturally:** No overwhelming analytics; simple, human-readable cards
- **AI doesn't prescribe:** Suggestions are gentle (""might help""), not directive
- **User drives exploration:** Filtering, sorting, deep-dives are optional
- **Celebration of progress:** Pattern recognition feels like learning, not clinical analysis
- **Privacy respected:** All data stays on device until user explicitly shares
- **Self-compassion emphasized:** Wording frames patterns as opportunities (""You're learning""), not failures

---

### Cross-Flow Navigation Patterns

**Bottom Navigation (4 Tabs, Always Visible)**

`

        [Screen Content]


                           Bottom tabs (icons + labels)

Home Journal Insights Settings

`

**Interaction Details:**

- **Active tab is highlighted** (primary color, bold)
- **Inactive tabs are muted** (secondary gray)
- **Tap switches instantly** between tabs (no animation delay)
- **Tab state is preserved** (if user jumps to Journal, then back to Home, Home retains position)

**Header Back Arrow (When in Modal/Nested View)**

`

[Back] Left-aligned back arrow

[Modal/Nested Content]

`

**Interaction Details:**

- **Back arrow appears** only when user is in modal, deep view, or nested flow
- **Tapping back** returns to previous screen (preserves scroll position)
- **No breadcrumb trail** needed; back arrow is always visible, always works

**Swipe Gestures (Optional, for Power Users)**

- **Swipe right** = Back (same as back arrow)
- **Swipe left** = Forward (if applicable, e.g., next entry)
- **Swipe up** = Scroll (native behavior)

**Interaction Details:**

- **Swipe gestures are optional discovery;** not required for any flow
- **Back arrow remains primary navigation;** swipe is power-user convenience
- **No swipe to dismiss modals** (users must tap back or action button)

---

### Bottom Sheet Patterns (Modals & Secondary Flows)

**Example: Settings Menu (From Home)**

`

      Drag handle (indicates modal)


    Bottom sheet slides up

Settings

    Breathing style
     [Select preference]

    Notifications (Off)
     [Turn on (if off)]

    Privacy & Data
     [View data, export, etc]

[Close]

`

**Interaction Details:**

- **Bottom sheet slides up** from bottom of screen (smooth animation, 400ms)
- **Drag handle** at top indicates user can swipe down to close
- **Tap outside** the sheet also closes it
- **Tap ""Close"" button** is explicit option for users unfamiliar with swipe
- **Sheet covers ~60% of screen** (leaves Home tab visible, not fully modal)

---

### Onboarding Flow (First Time User)

**[1] Welcome Screen (5 seconds)**

`

           mindmate                Logo/brand

    Your mental health             Tagline (concise, warm)
    companion.



    Journal your thoughts        3 key features (visual + text)
    Breathe when stressed
    Discover your patterns

            [Start]               CTA

`

**Interaction Details:**

- **Minimal copy:** Tagline + 3 features is enough
- **Icons + text** make features scannable
- **Single CTA** (Start); no alternative paths
- **Duration:** User spends 5-10 seconds here, taps Start

**[2] Name & Profile (30 seconds)**

`

What's your name?

[Text input, e.g. "Sarah"]

We'll use this to personalize Explanation (why we ask)
your experience.

            [Next ]  [Back]

`

**Interaction Details:**

- **Single field:** Just name; no email, no sign-up friction yet
- **Explanation** briefly explains why we collect this
- **Next/Back buttons** allow user to correct
- **Optional:** User can skip and use app without name (but loses personalization)

**[3] Privacy Commitment (20 seconds)**

`

Your privacy matters. Reassurance headline

    All your data stays on       Bullet points (not paragraphs)
     your device

    Conversations are
     encrypted end-to-end

    No ads, no tracking, no
     selling your data

[Learn more] Optional deep-dive

          [I understand]

`

**Interaction Details:**

- **4 key commitments** (bullet points, not dense text)
- **""Learn more"" link** allows deeper reading without requiring it
- **Positive framing:** What we DO protect, not what we DON'T do
- **Single CTA:** User confirms understanding and moves on

**[4] First Mood Check-In (1 minute)**

`

Let's get started, Sarah. Personalized greeting

How are you feeling right Simple question
now?

                        Standard mood scale

[Skip]

`

**Interaction Details:**

- **First real interaction:** User makes their first mood selection
- **Skip option** for users who don't want to set initial mood
- **No judgment:** Any mood is welcome

**[5] Onboarding Complete Home Tab**

After first mood selection (or skip), user lands on Home tab:

`

Welcome, Sarah! Celebration
Your journal is ready.

Next steps:
Check in daily with your
mood
Journal when you want to
express
Use breathing when you
need to calm down
Discover patterns in
Insights

(This message disappears
after today)

        [Got it]

`

**Interaction Details:**

- **Post-onboarding tip card** appears only once
- **4 key affordances** listed (mode, journal, breathe, insights)
- **Message disappears** after user dismisses; no annoying reminders
- **Tap ""Got it"" to proceed** to normal home tab

**Key UX Principles for Onboarding:**

- **Sub-60 seconds:** Entire flow takes <1 minute
- **No friction:** Minimal form fields, maximum skips
- **Trust building:** Privacy commitments upfront
- **Immediate value:** First mood check-in is real interaction, not a tutorial
- **Personalization:** Name appears in greetings after onboarding
- **Celebration:** Welcome message validates user, not app

---

### Screen States & Edge Cases

**Empty States**

`

Your journal is waiting. Encouraging message
Icon (not emoji, visual signal)

You haven't journaled yet. Explanation

Tap ""Home"" to start your
first entry.

    [Go to Home]

`

**Interaction Details:**

- **Encouraging, not scolding** (""journal is waiting"" vs. ""no entries"")
- **Clear action:** Direct user to Home tab
- **Icon + text** make state clear

**Loading States**

`

       Generating insight...       Simple text

         [Animated pulse]          Subtle animation (not spinner)

    (Usually takes <2 seconds)     Reassurance (set expectations)

`

**Interaction Details:**

- **Simple text + animation** (no spinning wheels)
- **Reassurance text** ("usually takes <2 seconds") prevents user from closing
- **If loading exceeds 5 seconds,** user can cancel and try again

**Error States**

`

Something didn't work. Clear, non-technical explanation

Your entry was saved locally. Reassurance (data is safe)
We couldn't send it to the
cloud right now, but it will
sync when you're back online.

       [Dismiss]

`

**Interaction Details:**

- **User-friendly error message** (not technical jargon like ""HTTP 500"")
- **Reassurance:** Data is safe locally; will sync when network available
- **Single action:** Dismiss and continue
- **No retry button** (app handles retrying in background)

---

### Accessibility Considerations (Per Flow)

**Text Size & Readability:**

- Minimum 16pt for body text (Apple HIG standard)
- Line height 1.6 for comfortable reading
- High contrast (AAA WCAG 2.1) for all text

**Touch Targets:**

- Minimum 48pt 48pt for all tappable elements
- Mood scale emojis are 60pt (easy to select)
- Breathing circle is full-screen (large hit target)

**Screen Reader Support:**

- All images have alt text (e.g., mood emoji descriptions: ""Very anxious"")
- Buttons and interactive elements labeled
- Form inputs have associated labels
- Semantic HTML/React Native structure

**Motion & Animation:**

- Animations can be disabled via system settings (respects prefers-reduced-motion)
- No auto-playing videos or animations
- Motion is purposeful (not distracting)

**Keyboard Navigation:**

- Tab order follows visual flow (left-to-right, top-to-bottom)
- All interactive elements reachable via keyboard
- Back arrows and close buttons accessible

---

## Visual Design Specifications & Component Library

### Visual Design Principles

MindMate AI's visual language is deliberately minimal and calm, designed to reduce cognitive load and create psychological safety. Every design decision supports the emotional journey from crisis to resilience.

**Core Visual Characteristics:**

1. **Minimalism Over Decoration**

   - White space is active, not empty
   - Every visual element serves emotional or functional purpose
   - No illustrations, patterns, or decorative flourishes
   - Result: Calm, focused, non-distracting environment

2. **Soft Desaturated Palette**

   - Muted tones feel safe and non-clinical
   - Avoid bright primaries (too energetic) or grays (too cold)
   - Colors are tied to emotional states (mood scale)
   - Result: Visual warmth without overwhelming

3. **Rounded, Gentle Geometry**

   - All corners rounded (12pt default radius)
   - No sharp edges or hard lines
   - Curves feel organic and approachable
   - Result: Inviting, non-institutional feeling

4. **Generous Spacing & Breathing Room**

   - Minimum 16pt padding around content
   - 24pt gaps between sections
   - Tall line height (1.6) for text readability
   - Result: Visual calm; easy to scan and read

5. **Purposeful Motion**

   - Slow animations (400-600ms) feel meditative
   - No snappy or playful micro-interactions
   - Motion guides attention, doesn't distract
   - Result: Design itself becomes calming tool

6. **Hierarchy Through Restraint**
   - Limited color use forces clear priority
   - Size differences are subtle, not extreme
   - Weight variation (not color variation) creates hierarchy
   - Result: Users intuitively know what to focus on

---

### Color Palette System

**Primary Color Tokens:**

| Token                   | Hex     | Usage                                              | Emotional Association             |
| ----------------------- | ------- | -------------------------------------------------- | --------------------------------- |
| **Primary Calm**        | #6B9FA3 | Primary buttons, active states, mood scale "Great" | Trust, safety, stability          |
| **Secondary Grounding** | #8A7E7E | Secondary buttons, body text, inactive states      | Neutral, contemplative, solid     |
| **Tertiary Gentle**     | #9B8FA3 | Accent elements, introspection prompts             | Kindness, reflection, growth      |
| **Neutral Base**        | #F5F5F3 | App background, cards, whitespace                  | Clean, breathing room, simplicity |
| **Accent Subtle**       | #7DA399 | Progress indicators, "positive" messaging          | Hope, progress, healing           |
| **Error/Alert**         | #E8A8A0 | Validation errors, warnings                        | Gentle alert (soft, not jarring)  |

**Mood Scale Color Map:**

| Mood         | Emoji | Color        | Hex     | When Used                |
| ------------ | ----- | ------------ | ------- | ------------------------ |
| Very Anxious |       | Warm Gray    | #A89090 | Low, distressed state    |
| Anxious      |       | Muted Taupe  | #9B8A80 | Stressed, worried        |
| Neutral      |       | Neutral Gray | #8A7E7E | Medium, baseline         |
| Good         |       | Soft Teal    | #7DA399 | Positive, calm state     |
| Great        |       | Bright Teal  | #6B9FA3 | Very positive, energized |

**Application Rules:**

- **Backgrounds:** Always use Neutral Base (#F5F5F3) or white
- **Primary Actions:** Primary Calm (#6B9FA3) for "next," "breathe," "chat"
- **Secondary Actions:** Secondary Grounding (#8A7E7E) for "skip," "cancel"
- **Text:** Secondary Grounding (#8A7E7E) for body; #333333 for high contrast
- **Disabled States:** Muted gray (#CCCCCC) for inactive elements
- **Mood Indicators:** Use mood scale color map above

---

### Typography System

**Font Choices:**

- **Primary Font:** Inter (or SF Pro / Roboto as fallback)
- **Why Inter:** Clean, humanist sans-serif; neutral, readable at all sizes
- **Monospace (if needed):** JetBrains Mono or Roboto Mono

**Typography Scale:**

| Role          | Size | Weight         | Line Height | Letter Spacing | Usage                         |
| ------------- | ---- | -------------- | ----------- | -------------- | ----------------------------- |
| **Heading 1** | 24pt | 600 (Semibold) | 1.3 (32pt)  | -0.5pt         | Page titles, major sections   |
| **Heading 2** | 20pt | 600 (Semibold) | 1.4 (28pt)  | -0.3pt         | Section headers, modal titles |
| **Heading 3** | 18pt | 600 (Semibold) | 1.4 (25pt)  | 0pt            | Subsections, card titles      |
| **Body**      | 16pt | 400 (Regular)  | 1.6 (26pt)  | 0pt            | Primary content, journal text |
| **Small**     | 14pt | 400 (Regular)  | 1.5 (21pt)  | 0pt            | Secondary info, metadata      |
| **Tiny**      | 12pt | 400 (Regular)  | 1.4 (17pt)  | 0pt            | Captions, timestamps, hints   |
| **Label**     | 12pt | 500 (Medium)   | 1.4 (17pt)  | 0.5pt          | Button text, tab labels       |
| **Button**    | 16pt | 500 (Medium)   | 1.4 (22pt)  | 0pt            | Interactive text buttons      |

**Font Weight Usage:**

- **400 (Regular):** All body text, paragraphs, descriptions
- **500 (Medium):** Labels, button text, hints
- **600 (Semibold):** Headings, emphasis, important labels

**Hierarchy Examples:**

`
Page Title (24pt, 600)

---

Section Header (20pt, 600)

Body text starts here at 16pt regular weight.
Line height is generous (1.6) for comfortable
reading. Secondary info appears smaller.
(14pt, 400)

Caption or timestamp text (12pt, 400)
`

---

### Spacing & Layout System

**Spacing Scale (8pt Base Unit):**

| Scale   | Value | Usage                                 |
| ------- | ----- | ------------------------------------- |
| **xs**  | 4pt   | Tight spacing within dense components |
| **sm**  | 8pt   | Small gaps between adjacent elements  |
| **md**  | 16pt  | Standard padding, default spacing     |
| **lg**  | 24pt  | Major section gaps, card spacing      |
| **xl**  | 32pt  | Large divisions, screen margins       |
| **xxl** | 48pt  | Very large gaps, full-height sections |

**Application:**

- **Screen Padding:** 16pt (md) on all sides
- **Card Internal Padding:** 16pt (md)
- **Between Cards/Sections:** 24pt (lg)
- **Text to Next Element:** 16pt (md) below heading, 12pt below body
- **Button Padding:** 12pt vertical, 16pt horizontal
- **Icon Margins:** 8pt around icons in buttons/tabs

**Safe Area Considerations (Mobile):**

- Add additional padding at top (notch/status bar)
- Add additional padding at bottom (home indicator)
- Never place critical UI in unsafe areas

---

### Motion & Animation System

**Animation Timing:**

| Type          | Duration | Easing   | Use Case                                                 |
| ------------- | -------- | -------- | -------------------------------------------------------- |
| **Micro**     | 150ms    | ease-out | Button presses, state changes, focus indicators          |
| **Standard**  | 300ms    | ease-out | Screen transitions, tab changes, modal opens             |
| **Slow**      | 500ms    | ease-out | Breathing exercise, calming moments, entrance animations |
| **Very Slow** | 800ms    | ease-out | Long-form transitions, emphasis moments                  |

**Easing Curves:**

- **ease-out:** Primary easing (matches natural deceleration, feels calm)
- **ease-in-out:** Avoid for most interactions (feels mechanical)
- **linear:** Only for continuous animations (progress bars)

**Motion Principles:**

1. **Purposeful:** Every animation communicates or guides attention
2. **Respectful:** Respects system prefers-reduced-motion preference
3. **Meditative:** Slow, organic feel (not snappy or playful)
4. **Minimal:** Avoid over-animating; whitespace is animation too

**Example Animations:**

`
Mood Selection Tap:

- Scale: 1.0 1.05 over 150ms (ease-out)
- Opacity: 1.0 0.8 during press
- Haptic feedback: medium vibration
- Result: Satisfying, tactile feedback

Breathing Circle Expand:

- Radius: 80 120 over 4000ms (ease-out)
- Opacity: 1.0 0.8 at expansion peak
- Result: Physiological anchor for breathing

Message Bubble Entrance:

- Slide in: +20pt from right over 300ms (ease-out)
- Fade in: 0 1 over 300ms
- Result: Natural, non-jarring appearance
  `

---

### Component Specifications

#### Paper Library Components (Minimal Customization)

**Button Component**

`
Style: Paper Button
Padding: 12pt vertical, 16pt horizontal
Font: 16pt, 500 weight, Secondary Grounding color
Border Radius: 12pt
States:

- Default: Primary Calm background, white text
- Pressed: 10% darker tint
- Disabled: #CCCCCC background, white text
- Focus: Underline (keyboard navigation)
  Behavior: Tap feedback via haptic

Example: [Breathe] [Next] [Done]
`

**Card Component**

`
Style: Paper Card (Surface)
Padding: 16pt
Margin Bottom: 16pt
Border Radius: 12pt
Background: Neutral Base (#F5F5F3)
Shadow: Soft (elevation: 2)
States:

- Idle: Base style
- Pressed/Selected: Subtle background tint
- Disabled: Opacity 50%
  Usage: Journal entry previews, mood summaries, insights

Example:

Yesterday 8:30pm
Anxious

"Nervous about..."

`

**TextInput Component**

`
Style: Paper TextInput
Padding: 12pt internal
Font: 16pt, 400 weight, Secondary Grounding
Placeholder Color: #999999
Border Radius: 12pt
States:

- Idle: Light gray border
- Focused: Primary Calm border (no shadow)
- Filled: Neutral Base background
- Error: Error color border
  Behavior: Auto-focus on modal open
  Usage: Quick context, journal entry, chat input

Example:

What's on your mind?
[Cursor here]

`

**BottomNavigation Component**

`
Style: Paper BottomNavigation
Padding: 8pt vertical
Background: Neutral Base (#F5F5F3)
Border Top: Subtle divider (#EEEEEE)
Tabs: 4 per design

- Home (icon: )
- Journal (icon: )
- Insights (icon: )
- Settings (icon: )
  Active State: Primary Calm color, bold
  Inactive State: Secondary Grounding, 50% opacity
  Label: Always show (never icon-only)
  `

**Modal/BottomSheet Component**

`Style: Paper Modal / BottomSheet
Backdrop: 40% black overlay
Animation: Slide up from bottom, 400ms ease-out
Drag Handle: Visual indicator at top
Border Radius: 16pt (top only)
Padding: 16pt
Cover: ~60% of screen (leaves context visible)
Dismissal: Tap outside, drag down, "Close" button`

---

#### Custom Components (High-Impact UX)

**MoodScale Component**

`
Layout: Horizontal, 5-point scale
Item Size: 60pt diameter (emoji) or 48pt 48pt (color box)
Spacing: 12pt between items
States per Item:

- Idle: Default color, 100% opacity
- Hovered: +5% brightness
- Selected: Scale 1.1, haptic feedback
- Unselected (after selection): 40% opacity
  Animation:
- Selection feedback: Scale 1.0 1.1 over 150ms
- Haptic: Medium vibration on selection
  Typography:
- Label below emoji (12pt, Secondary Grounding)

Visual Example:

Bad Okay Mid Good Great
`

**BreathingExercise Component**

`
Layout: Full screen, centered
Circle Size: 150pt diameter (responsive to screen)
Center Point: Visual anchor (small dot)
Animation Cycle (19 seconds total):

- 4s: Inhale (expand from 150pt to 200pt)
- 7s: Hold (maintain 200pt)
- 8s: Exhale (contract from 200pt to 150pt)
- Loop 3x (57 seconds total)
  Colors:
- Circle: Primary Calm (#6B9FA3)
- Opacity: 0.8 (slightly transparent)
- Background: Neutral Base
  Text Prompts:
- Top: "Take a breath"
- Center (animated): "Breathe in...", "Hold...", "Breathe out..."
- Bottom: "[Finish Early]" button
  Haptic:
- Subtle pulse at transition points (inhale, exhale)
  Behavior:
- Full screen (no tabs visible)
- "Finish Early" exits anytime
- Loops 3x automatically
  `

**ChatBubble Component**

`
Layout: Message list with bubbles
User Bubble:

- Alignment: Right
- Background: Soft Teal (#7DA399) or similar
- Text Color: White
- Corner Radius: 16pt (rounded except bottom-right)
- Padding: 12pt
- Max Width: 80% of screen
  AI Bubble:
- Alignment: Left
- Background: Light Gray (#F0F0F0) or Neutral Base
- Text Color: Secondary Grounding
- Corner Radius: 16pt (rounded except bottom-left)
- Padding: 12pt
- Max Width: 80% of screen
  Spacing: 8pt between consecutive bubbles
  Timestamp: Small text (12pt) below bubble, optional
  Behavior:
- Auto-scroll to latest message
- Smooth entrance animation (300ms)
- Tap to view full message (if truncated)
  `

**JournalCanvas Component**

`
Layout: Blank text canvas
TextInput:

- Full width, full available height
- No visible border (blends into background)
- Font: 16pt, 400 weight
- Line Height: 1.6
- Padding: 16pt all sides
  Auto-Save Indicator:
- Position: Bottom right
- Text: "Auto-saving..." " Saved"
- Font: 12pt, Secondary Grounding
- Animation: Fade in/out, 300ms
  Optional Prompt:
- Position: Floating above input (if empty)
- Font: 14pt, italic, #999999
- Tap to dismiss or start typing
  Behavior:
- Auto-save every 2 seconds
- No save button (frictionless)
- Back button returns to previous screen
  `

**MoodChart Component**

`
Layout: Interactive chart visualization
Chart Type: Line or bar chart
Toggle: 7-day / 30-day view
X-Axis: Days (7 or 30 labels)
Y-Axis: Mood scale (1-5, labeled)
Data Points:

- Circles at each data point
- Color based on mood (mood scale colors)
- Tap to view details
  Line Color: Primary Calm (#6B9FA3)
  Grid: Subtle (optional, #EEEEEE)
  Average Mood: Display as badge or text ("Avg: 3.2")
  Legend: Simple text indicating mood range
  Behavior:
- Tap any day to see entries from that day
- Smooth animation when switching 7d/30d
- Responsive to screen width
  `

**PatternInsight Card Component**

`
Layout: Simple card container
Content:

- Title: 18pt, 600 weight, Primary Calm
- Description: 16pt, 400 weight, body text
- Supporting Details: Bullet points (14pt, Secondary Grounding)
- Suggested Action: Italic text (14pt, Tertiary Gentle)
  Checkbox: Optional, left side (user marks as "helpful")
  Spacing:
- Padding: 16pt
- Between elements: 8pt
- Below card: 16pt
  Behavior:
- Tap to view pattern details (optional deep-dive)
- Checkbox toggles without page refresh
- No required actions (all optional)

Example:

Weekday mornings trend
anxious

You tend to feel more
stressed Monday-Wednesday.

Try breathing before your
first meeting?

`

**PrivacyIndicator Component**

`
Layout: Icon + badge combo
Lock Icon:

- Size: 16pt or 20pt
- Color: Primary Calm
- Placement: Top-right of journal entry (or inline)
  Badge Text: "Encrypted" (optional)
- Font: 10pt, 500 weight
- Color: Primary Calm
- Background: Light tint (10% opacity)
  Tooltip (on long-press):
- Text: "Your entry is encrypted end-to-end"
- Duration: 2 seconds
- Position: Center of screen
  Behavior:
- Always visible on journal entries
- Reassures without being intrusive
  `

---

### Component States & Variations

**Button Variants:**

`
Primary Button:
Background: Primary Calm (#6B9FA3)
Text: White
Usage: Main CTA (Next, Breathe, Send)

Secondary Button:
Background: Secondary Grounding (#8A7E7E)
Text: White
Usage: Alternative action (Skip, Cancel)

Ghost Button:
Background: Transparent
Border: 1pt Secondary Grounding
Text: Secondary Grounding
Usage: Tertiary actions (Learn more, View full)

Disabled Button:
Background: #CCCCCC
Text: White, 50% opacity
Cursor: not-allowed
`

**Input Field Variants:**

`
Default TextInput:
Border: 1pt #DDDDDD
Background: White
Focused: Border becomes Primary Calm

Error State:
Border: 1pt Error color (#E8A8A0)
Error Message: 12pt, Error color, below input

Filled State:
Background: Neutral Base (#F5F5F3)
Used when user has entered text

Disabled Input:
Background: #F5F5F5
Text Color: #CCCCCC
Cursor: not-allowed
`

---

### Component Library Handoff

**For Developers:**

1. **Figma Component Library** (if using Figma)

   - All Paper components with proper variants
   - Custom components with states documented
   - Design tokens synchronized with code

2. **Code Implementation Guide**

   - React Native Paper setup instructions
   - Custom component implementation examples
   - Theming configuration file
   - Color/spacing token constants

3. **Component Usage Documentation**

   - When to use each component
   - Props and customization options
   - Accessibility requirements per component
   - Common patterns and combinations

4. **Animation Library**
   - React Native Reanimated configurations
   - Preset animations (fade, slide, scale)
   - Haptic feedback triggers
   - Motion design timing constants

**For Designers (Handing Off to QA/Testing):**

1. **Visual Specification Document**

   - Color swatches with exact hex values
   - Typography scale with actual font sizes
   - Spacing grid visualization
   - Component anatomy diagrams

2. **Responsive Behavior Guide**

   - How components scale on different screen sizes
   - Safe area handling (notch, home indicator)
   - Landscape vs. portrait considerations
   - Tablet layout adaptations (if needed for MVP)

3. **State & Interaction Matrix**

   - Component states visually documented
   - Interaction behavior descriptions
   - Animation specifications with timing
   - Accessibility checklist per component

4. **Design QA Checklist** (see below)

---

### Design System Implementation Roadmap

**Week 1-2: Foundation Setup**

- [ ] Install and configure React Native Paper
- [ ] Define theme with color, typography, spacing tokens
- [ ] Create token constants (colors.ts, spacing.ts, typography.ts)
- [ ] Set up Figma library with Paper components mirrored

**Week 3-4: Custom Component Development**

- [ ] Build MoodScale component with haptic feedback
- [ ] Build BreathingExercise with Reanimated animations
- [ ] Build ChatBubble with message formatting
- [ ] Build JournalCanvas with auto-save indicator
- [ ] Build MoodChart with interactive tap behavior

**Week 5-6: Integration & Polish**

- [ ] Integrate all components into core flows
- [ ] Test responsive behavior across iOS/Android
- [ ] Implement accessibility (a11y) features
- [ ] Refine animations and micro-interactions
- [ ] Conduct design QA testing

**Week 7-8: Documentation & Handoff**

- [ ] Finalize Figma library
- [ ] Create developer component docs
- [ ] Document all design tokens
- [ ] Create reusable code examples
- [ ] Handoff to engineering for maintenance

---

## Design QA Checklist

Before shipping any screen or flow, validate against this checklist:

### Visual Consistency

- [ ] Colors match design tokens exactly (hex values verified)
- [ ] Typography scale is applied correctly (font size, weight, line height)
- [ ] Spacing is consistent (uses 8pt scale)
- [ ] Border radius is 12pt (or specified variant)
- [ ] Icons are consistent style and size
- [ ] No missing or misaligned elements

### Interaction & Motion

- [ ] Button taps provide haptic feedback (where specified)
- [ ] Animations use correct timing (micro 150ms, standard 300ms, slow 500ms)
- [ ] Animations respect prefers-reduced-motion setting
- [ ] Loading states show within 500ms
- [ ] Error messages appear with appropriate timing
- [ ] Transitions are smooth (no janky animations)

### Accessibility

- [ ] Text size minimum 16pt for body text
- [ ] Color contrast meets WCAG AAA (7:1 for normal text)
- [ ] Touch targets minimum 48pt 48pt
- [ ] Screen reader labels present on all interactive elements
- [ ] Form inputs have associated labels
- [ ] Focus indicators visible for keyboard navigation
- [ ] No color-only information (redundant indicators for state)

### Responsiveness

- [ ] Layout works on iPhone SE (375pt width) to iPad (1024pt+)
- [ ] Text truncates gracefully (no overflow)
- [ ] Buttons remain tappable on all screen sizes
- [ ] Safe area padding respected (notch, home indicator)
- [ ] Landscape orientation tested
- [ ] Keyboard doesn't overlap critical UI

### Tone & Microcopy

- [ ] All text is warm, non-judgmental
- [ ] No clinical or pressuring language
- [ ] Error messages are helpful, not blaming
- [ ] Empty states are encouraging (not scolding)
- [ ] Loading messages set expectations
- [ ] Buttons clearly indicate action (not "OK," prefer "Got it")

### Privacy & Safety

- [ ] Privacy indicator visible on sensitive data (entries, chat)
- [ ] Encryption messaging clear but not intrusive
- [ ] No user data exposed in logs or debug screens
- [ ] Delete options clearly labeled and reversible (or confirm dialog)
- [ ] Data handling transparent to user

### Performance

- [ ] Screen opens within 500ms (perceived performance)
- [ ] Animations maintain 60fps (no drops)
- [ ] Scroll is smooth (no jank)
- [ ] Chat doesn't lag when loading messages
- [ ] Journal timeline loads incrementally (not all at once)
- [ ] Charts render within 1 second

### Cross-Platform Consistency

- [ ] iOS and Android use same visual system
- [ ] Platform-specific conventions respected (back button vs. nav)
- [ ] Touch feedback consistent (haptic on iOS, visual feedback on Android)
- [ ] Safe areas handled correctly on both platforms
- [ ] Fonts render consistently

---

## Implementation Notes for Engineering

### Setting Up React Native Paper Theme

`javascript
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

const theme = {
...DefaultTheme,
colors: {
...DefaultTheme.colors,
primary: '#6B9FA3', // Primary Calm
secondary: '#8A7E7E', // Secondary Grounding
tertiary: '#9B8FA3', // Tertiary Gentle
error: '#E8A8A0', // Error
background: '#F5F5F3', // Neutral Base
surface: '#FFFFFF',
surfaceVariant: '#F5F5F3',
onBackground: '#333333',
onSurface: '#333333',
},
};
`

### Spacing Constants (TypeScript)

`	ypescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;
`

### Typography Constants

`	ypescript
export const typography = {
  h1: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 26,
  },
  // ... additional scales
} as const;
`

### Custom Component Template

` ypescript
// Example: MoodScale.tsx
import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { Haptics } from 'expo-haptics';
import Animated, {
useSharedValue,
useAnimatedStyle,
withTiming,
} from 'react-native-reanimated';

const moods = [
{ emoji: '', label: 'Bad', value: 1, color: '#A89090' },
{ emoji: '', label: 'Okay', value: 2, color: '#9B8A80' },
// ... additional moods
];

export const MoodScale = ({ onMoodSelect }) => {
return (
<View style={styles.container}>
{moods.map(mood => (
<Pressable
key={mood.value}
onPress={() => {
Haptics.selectionAsync();
onMoodSelect(mood.value);
}} >
<Text style={styles.emoji}>{mood.emoji}</Text>
<Text style={styles.label}>{mood.label}</Text>
</Pressable>
))}
</View>
);
};
`

---

## Next Steps for Design Implementation

**Immediate (This Sprint):**

1. [ ] Share this specification with engineering team
2. [ ] Set up React Native Paper in codebase
3. [ ] Create theme configuration file
4. [ ] Build MoodScale custom component
5. [ ] Implement Home tab layout

**Short-term (Next Sprint):**

1. [ ] Complete remaining custom components
2. [ ] Implement all core flows (Crisis, Daily, Insights)
3. [ ] Conduct design review with stakeholders
4. [ ] Iterate based on feedback
5. [ ] Begin responsive testing

**Medium-term (Sprint 3-4):**

1. [ ] Full QA testing (visual, interaction, a11y)
2. [ ] Refinement pass (polish, edge cases)
3. [ ] Performance optimization
4. [ ] Final accessibility audit
5. [ ] Handoff to QA/Testing team

---
