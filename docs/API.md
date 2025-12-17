# MindMate AI Backend API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Base URL & Authentication](#base-url--authentication)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Endpoints](#endpoints)
   - [Authentication](#authentication-endpoints)
   - [Journals](#journals-endpoints)
   - [Moods](#moods-endpoints)
   - [Chat](#chat-endpoints)
   - [Affirmations](#affirmations-endpoints)
   - [Sync](#sync-endpoints)
7. [Data Types](#data-types)
8. [Status Codes](#status-codes)

---

## Overview

**MindMate AI** is a mental health and wellness mobile application that provides journaling, mood tracking, AI-powered chat support, and daily affirmations. The backend is built with **Node.js + Express + TypeScript** and uses **MongoDB** for data persistence with **Firebase** for authentication.

### Key Features

- **User Authentication**: Firebase-based authentication with JWT tokens
- **Encrypted Journaling**: End-to-end encrypted journal entries with server-side encryption layer
- **Mood Tracking**: Log and analyze mood patterns with visualizations
- **AI Chat**: Real-time conversational AI support using Google Gemini (with Groq fallback)
- **Daily Affirmations**: AI-generated affirmations based on recent mood trends
- **Offline-First Sync**: Support for offline data creation with server synchronization
- **Security**: Rate limiting, CORS protection, helmet security headers

---

## Base URL & Authentication

### Base URL

```
https://api.mindmate-ai.com/api
```

### Health Check Endpoint

```
GET /health
```

Returns server health status (no authentication required).

**Example Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### Authentication Methods

#### Firebase Token Verification (Login/Register)

The API uses **Firebase Authentication** for client identity verification and JWT tokens for API request authorization.

**Access Token:**

- Expires in: 24 hours
- Used in request headers: `Authorization: Bearer <accessToken>`

**Refresh Token:**

- Expires in: 7 days
- Used to obtain a new access token when the current one expires

### Required Headers

For protected endpoints, include:

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

---

## Response Format

### Success Response

All successful API responses follow this format:

```json
{
  "status": "success",
  "data": {
    // Response data specific to the endpoint
  }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Descriptive error message",
  "code": "ERROR_CODE",
  "requestId": "unique-request-id"
}
```

---

## Error Handling

### Error Codes

| Code                  | HTTP Status | Description                               |
| --------------------- | ----------- | ----------------------------------------- |
| `VALIDATION_ERROR`    | 400         | Invalid request payload                   |
| `UNAUTHORIZED`        | 401         | Missing or invalid authentication token   |
| `FORBIDDEN`           | 403         | Insufficient permissions                  |
| `NOT_FOUND`           | 404         | Resource not found                        |
| `CONFLICT`            | 409         | Resource already exists or state conflict |
| `RATE_LIMIT_EXCEEDED` | 429         | Too many requests                         |
| `SERVER_ERROR`        | 500         | Internal server error                     |

---

## Rate Limiting

The API implements rate limiting to prevent abuse and protect resources:

| Endpoint             | Limit        | Window     |
| -------------------- | ------------ | ---------- |
| `/auth/verify-token` | 5 requests   | 15 minutes |
| `/chat`              | 20 requests  | 1 hour     |
| Global               | 100 requests | 1 hour     |

**Response Header When Rate Limited:**

```
Retry-After: 300 (seconds)
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1705335600
```

---

## Endpoints

### Authentication Endpoints

#### 1. Verify Firebase Token (Login/Register)

**Endpoint:**

```
POST /api/auth/verify-token
```

**Description:**

- Accepts a Firebase ID Token from the client
- Verifies the token with Firebase Admin SDK
- Creates a new user (Just-In-Time provisioning) if this is their first login
- Returns backend JWTs for API authentication

**Rate Limit:** 5 requests per 15 minutes

**Request Body:**

```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ..."
}
```

**Response (201 Created / 200 OK):**

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "preferences": {
        "notificationsEnabled": true,
        "theme": "light"
      }
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**

```json
{
  "status": "error",
  "message": "Validation failed: idToken: Firebase ID Token is required",
  "code": "VALIDATION_ERROR"
}
```

---

#### 2. Refresh Access Token

**Endpoint:**

```
POST /api/auth/refresh-token
```

**Description:**

- Uses a valid refresh token to obtain a new access token
- Allows users to extend their session without re-authentication

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**

```json
{
  "status": "error",
  "message": "Invalid or expired refresh token",
  "code": "UNAUTHORIZED"
}
```

---

#### 3. Logout

**Endpoint:**

```
POST /api/auth/logout
```

**Description:**

- Confirms logout (stateless operation)
- Client should clear stored tokens from local storage
- Server-side token blacklisting may be implemented in future versions

**Authentication Required:** Yes

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

### Journals Endpoints

#### 1. Create Journal Entry

**Endpoint:**

```
POST /api/journals
```

**Description:**

- Creates a new encrypted journal entry
- Client sends device-encrypted content; server adds additional encryption layer for at-rest protection
- Supports mood tagging and intensity levels

**Authentication Required:** Yes

**Request Body:**

```json
{
  "encryptedContent": "U2FsdGVkX1+cIUHBfQ8p...",
  "mood": "Anxious",
  "intensity": 7,
  "date": "2025-01-15T10:30:00.000Z",
  "tags": ["work", "stress"]
}
```

**Mood Values:** `Peaceful`, `Content`, `Anxious`, `Stressed`, `Sad`, `Angry`, `Overwhelmed`

**Intensity:** Integer 1-10

**Response (201 Created):**

```json
{
  "status": "success",
  "data": {
    "journal": {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439010",
      "encryptedContent": "U2FsdGVkX1+cIUHBfQ8p...",
      "mood": "Anxious",
      "intensity": 7,
      "date": "2025-01-15T00:00:00.000Z",
      "tags": ["work", "stress"],
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (400):**

```json
{
  "status": "error",
  "message": "Validation failed: intensity: Number must be less than or equal to 10",
  "code": "VALIDATION_ERROR"
}
```

---

#### 2. Get All Journals

**Endpoint:**

```
GET /api/journals?mood=Anxious&limit=20&page=1
```

**Description:**

- Retrieves all journal entries for the authenticated user
- Supports pagination and filtering by mood
- Decrypts server-side encryption layer for each entry
- Sorted by date (newest first)

**Authentication Required:** Yes

**Query Parameters:**

| Parameter | Type   | Required | Description                                 |
| --------- | ------ | -------- | ------------------------------------------- |
| `mood`    | string | No       | Filter by mood (e.g., "Anxious", "Content") |
| `limit`   | number | No       | Items per page (default: 20, max: 100)      |
| `page`    | number | No       | Page number (default: 1)                    |

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "journals": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "userId": "507f1f77bcf86cd799439010",
        "encryptedContent": "U2FsdGVkX1+cIUHBfQ8p...",
        "mood": "Anxious",
        "intensity": 7,
        "date": "2025-01-15T00:00:00.000Z",
        "tags": ["work"],
        "createdAt": "2025-01-15T10:30:00.000Z",
        "updatedAt": "2025-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 20,
      "hasMore": true
    }
  }
}
```

---

#### 3. Get Single Journal Entry

**Endpoint:**

```
GET /api/journals/{id}
```

**Description:**

- Retrieves a single journal entry by ID
- User can only access their own journals

**Authentication Required:** Yes

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "journal": {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439010",
      "encryptedContent": "U2FsdGVkX1+cIUHBfQ8p...",
      "mood": "Anxious",
      "intensity": 7,
      "date": "2025-01-15T00:00:00.000Z",
      "tags": ["work"],
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (404):**

```json
{
  "status": "error",
  "message": "Journal not found",
  "code": "NOT_FOUND"
}
```

---

#### 4. Update Journal Entry

**Endpoint:**

```
PATCH /api/journals/{id}
PUT /api/journals/{id}
```

**Description:**

- Updates an existing journal entry (partial update supported)
- User can only update their own journals

**Authentication Required:** Yes

**Request Body (all fields optional):**

```json
{
  "encryptedContent": "U2FsdGVkX1+cIUHBfQ8p...",
  "mood": "Content",
  "intensity": 5,
  "date": "2025-01-15T10:30:00.000Z",
  "tags": ["updated", "tag"]
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "journal": {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439010",
      "encryptedContent": "U2FsdGVkX1+cIUHBfQ8p...",
      "mood": "Content",
      "intensity": 5,
      "date": "2025-01-15T00:00:00.000Z",
      "tags": ["updated", "tag"],
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T11:00:00.000Z"
    }
  }
}
```

---

#### 5. Delete Journal Entry

**Endpoint:**

```
DELETE /api/journals/{id}
```

**Description:**

- Permanently deletes a journal entry
- User can only delete their own journals

**Authentication Required:** Yes

**Response (204 No Content):**

```
(Empty body)
```

---

### Moods Endpoints

#### 1. Log Mood Entry

**Endpoint:**

```
POST /api/moods
```

**Description:**

- Creates a new mood log entry
- Entries are stored as embedded documents in the User model
- Typically called when user quick-logs mood without journaling

**Authentication Required:** Yes

**Request Body:**

```json
{
  "mood": "Anxious",
  "intensity": 6,
  "note": "Had a difficult meeting at work",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Note:** timestamp is optional (defaults to current time if omitted)

**Response (201 Created):**

```json
{
  "status": "success",
  "data": {
    "mood": {
      "mood": "Anxious",
      "intensity": 6,
      "note": "Had a difficult meeting at work",
      "timestamp": "2025-01-15T10:30:00.000Z"
    }
  }
}
```

---

#### 2. Get Mood History

**Endpoint:**

```
GET /api/moods?startDate=2025-01-01T00:00:00Z&endDate=2025-01-15T23:59:59Z
```

**Description:**

- Retrieves mood entries within a date range
- Defaults to last 30 days if no range specified
- Returns sorted chronologically

**Authentication Required:** Yes

**Query Parameters:**

| Parameter   | Type     | Required | Description                                |
| ----------- | -------- | -------- | ------------------------------------------ |
| `startDate` | ISO Date | No       | Start of date range (default: 30 days ago) |
| `endDate`   | ISO Date | No       | End of date range (default: now)           |

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "moods": [
      {
        "mood": "Anxious",
        "intensity": 6,
        "note": "Had a difficult meeting at work",
        "timestamp": "2025-01-15T10:30:00.000Z"
      },
      {
        "mood": "Content",
        "intensity": 7,
        "note": "Finished a project",
        "timestamp": "2025-01-14T15:00:00.000Z"
      }
    ],
    "count": 2
  }
}
```

---

#### 3. Get Mood Insights (Statistics)

**Endpoint:**

```
GET /api/moods/insights
```

**Description:**

- Returns aggregated mood statistics for chart visualization
- Includes mood counts, averages, and trends
- Data for last 30 days by default

**Authentication Required:** Yes

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "insights": {
      "totalEntries": 28,
      "averageIntensity": 6.2,
      "moodCounts": {
        "Peaceful": 5,
        "Content": 8,
        "Anxious": 10,
        "Stressed": 3,
        "Sad": 2,
        "Angry": 0,
        "Overwhelmed": 0
      },
      "dominantMood": "Anxious",
      "trend": "stable",
      "periodStart": "2024-12-16T00:00:00.000Z",
      "periodEnd": "2025-01-15T23:59:59.999Z"
    }
  }
}
```

---

### Chat Endpoints

#### 1. Send Chat Message

**Endpoint:**

```
POST /api/chat
```

**Description:**

- Sends a message to the AI and receives a response
- Maintains conversation context using history stored in database
- Leverages Google Gemini API with Groq as fallback
- Supports optional context parameter for better personalization

**Authentication Required:** Yes

**Rate Limit:** 20 requests per hour

**Request Body:**

```json
{
  "message": "I'm feeling anxious about my upcoming presentation",
  "context": "work stress, deadline pressure"
}
```

**Message:** Required, 1-2000 characters
**Context:** Optional, max 500 characters

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "message": "I'm feeling anxious about my upcoming presentation",
    "response": "It's completely natural to feel anxious about presentations. Here are some evidence-based techniques that might help: 1) Deep breathing exercises... 2) Cognitive reframing...",
    "conversationId": "507f1f77bcf86cd799439010",
    "timestamp": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Response (429 - Rate Limited):**

```json
{
  "status": "error",
  "message": "Too many chat requests. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

---

### Affirmations Endpoints

#### 1. Get Daily Affirmation

**Endpoint:**

```
GET /api/affirmations/today
```

**Description:**

- Returns the daily affirmation for the authenticated user
- Uses cache-then-generate strategy:
  - Returns cached affirmation if already generated today
  - Generates new AI affirmation based on mood trends if not
- Affirmations are personalized based on recent mood history (last 7 days)

**Authentication Required:** Yes

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "affirmation": {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439010",
      "text": "You have the strength to navigate challenges with grace and resilience. Your worries are valid, but they do not define you.",
      "theme": "resilience",
      "viewed": false,
      "createdAt": "2025-01-15T09:00:00.000Z"
    }
  }
}
```

**Theme Values:** `resilience`, `anxiety`, `self-compassion`, `courage`, `growth`, etc.

---

### Sync Endpoints

#### 1. Process Sync Queue

**Endpoint:**

```
POST /api/sync
```

**Description:**

- Processes offline-first sync queue from mobile app
- Accepts array of operations (create journal, log mood) created offline
- Applies operations in order with conflict resolution
- Returns report of successful and failed operations

**Authentication Required:** Yes

**Request Body:**

```json
{
  "queue": [
    {
      "type": "journal",
      "action": "create",
      "data": {
        "encryptedContent": "U2FsdGVkX1+cIUHBfQ8p...",
        "mood": "Anxious",
        "intensity": 6,
        "date": "2025-01-14T18:00:00.000Z",
        "tags": ["offline"]
      },
      "clientId": "offline-001"
    },
    {
      "type": "mood",
      "action": "create",
      "data": {
        "mood": "Content",
        "intensity": 7,
        "note": "Feeling better now"
      },
      "clientId": "offline-002"
    }
  ]
}
```

**Operation Types:**

- **type:** `journal` | `mood` | `affirmation`
- **action:** `create` | `update` | `delete`
- **clientId:** Unique identifier for idempotency (required)

**Response (200 OK - Partial Success):**

```json
{
  "status": "success",
  "data": {
    "processed": 2,
    "failed": 0,
    "errors": [],
    "operations": [
      {
        "clientId": "offline-001",
        "status": "success",
        "serverId": "507f1f77bcf86cd799439011"
      },
      {
        "clientId": "offline-002",
        "status": "success",
        "serverId": "507f1f77bcf86cd799439012"
      }
    ]
  }
}
```

**Response (200 OK - Partial Failure):**

```json
{
  "status": "success",
  "data": {
    "processed": 1,
    "failed": 1,
    "errors": [
      {
        "clientId": "offline-002",
        "status": "failed",
        "reason": "Invalid mood value"
      }
    ],
    "operations": [
      {
        "clientId": "offline-001",
        "status": "success",
        "serverId": "507f1f77bcf86cd799439011"
      }
    ]
  }
}
```

---

## Data Types

### MoodState Enum

```typescript
enum MoodState {
  PEACEFUL = "Peaceful",
  CONTENT = "Content",
  ANXIOUS = "Anxious",
  STRESSED = "Stressed",
  SAD = "Sad",
  ANGRY = "Angry",
  OVERWHELMED = "Overwhelmed",
}
```

### User Object

```typescript
{
  id: string;                          // MongoDB _id
  email: string;                       // Unique email
  name?: string;                       // Display name
  firebaseUid: string;                 // Firebase UID
  role: "user" | "admin";              // User role
  provider: "email" | "google";        // Auth provider
  preferences: {
    notificationsEnabled: boolean;
    theme: "light" | "dark" | "system";
  };
  moods: IMood[];                      // Embedded mood entries
  conversationHistory: IConversationMessage[]; // Last 50 messages
  createdAt: Date;
  updatedAt: Date;
}
```

### Journal Object

```typescript
{
  _id: string;
  userId: string;
  encryptedContent: string;            // AES-256 encrypted
  mood: MoodState;
  intensity: number;                   // 1-10
  date: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Mood Object

```typescript
{
  mood: MoodState;
  intensity: number;                   // 1-10
  note?: string;                       // Plain text, max 500 chars
  timestamp: Date;
}
```

### ConversationMessage Object

```typescript
{
  role: "user" | "model";
  content: string; // Message text
  timestamp: Date;
}
```

### Affirmation Object

```typescript
{
  _id: string;
  userId: string;
  text: string;
  theme: string; // e.g., "resilience", "anxiety"
  viewed: boolean;
  createdAt: Date;
}
```

---

## Status Codes

| Code | Status                | Use Case                                        |
| ---- | --------------------- | ----------------------------------------------- |
| 200  | OK                    | Successful GET, PUT, PATCH request              |
| 201  | Created               | Successful POST request (resource created)      |
| 204  | No Content            | Successful DELETE request                       |
| 400  | Bad Request           | Invalid request payload or validation error     |
| 401  | Unauthorized          | Missing or invalid authentication token         |
| 403  | Forbidden             | Insufficient permissions for resource           |
| 404  | Not Found             | Resource does not exist                         |
| 409  | Conflict              | Resource state conflict (e.g., duplicate entry) |
| 429  | Too Many Requests     | Rate limit exceeded                             |
| 500  | Internal Server Error | Server-side error (unexpected)                  |

---

## Example Usage

### Complete Authentication Flow

```bash
# 1. Get Firebase ID Token from client
FIREBASE_ID_TOKEN="eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ..."

# 2. Verify token and get JWT tokens
curl -X POST https://api.mindmate-ai.com/api/auth/verify-token \
  -H "Content-Type: application/json" \
  -d "{\"idToken\": \"$FIREBASE_ID_TOKEN\"}"

# Response:
# {
#   "status": "success",
#   "data": {
#     "user": {...},
#     "accessToken": "...",
#     "refreshToken": "..."
#   }
# }

# 3. Use accessToken for authenticated requests
ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET https://api.mindmate-ai.com/api/moods \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json"

# 4. When accessToken expires, refresh it
REFRESH_TOKEN="..."

curl -X POST https://api.mindmate-ai.com/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}"
```

---

## Best Practices

### Client-Side

1. **Token Management:**

   - Store `accessToken` in secure storage (Secure HttpOnly cookie or Keychain/Keystore)
   - Store `refreshToken` separately for security
   - Implement automatic token refresh before expiration

2. **Request Handling:**

   - Always include `Authorization` header for protected endpoints
   - Implement exponential backoff for rate-limited requests (429)
   - Handle authentication errors (401) by redirecting to login

3. **Encryption:**

   - Encrypt journal content on client-side before sending
   - Use industry-standard AES-256 encryption
   - Never send plaintext sensitive data

4. **Offline-First:**
   - Implement local queue for operations when offline
   - Sync queue when connectivity is restored using `/sync` endpoint
   - Include `clientId` for idempotency

### Server-Side Security

- All endpoints enforce authentication except `/health` and `/auth/verify-token`
- Request logging tracks all API access
- CORS is configured to allow only specified frontend domains
- Rate limiting protects against abuse
- Helmet security headers prevent common attacks
- Input validation via Zod schemas
- Error messages do not expose sensitive system details

---

## Troubleshooting

### Common Issues

**"Invalid Firebase Token"**

- Ensure token is current (not expired)
- Verify Firebase project ID matches configuration
- Check that Firebase Admin SDK is properly initialized

**"Rate limit exceeded"**

- Wait for `Retry-After` seconds before retrying
- Implement exponential backoff with jitter
- Check that client is not making duplicate requests

**"Journal not found"**

- Verify journal ID is correct
- Ensure authenticated user owns the journal
- Check that journal hasn't been deleted

**"AI service unavailable"**

- Server automatically retries with Groq if Gemini fails
- If both fail, receive error response with details
- Implement client-side retry logic for critical features

---

## Version History

| Version | Date       | Changes             |
| ------- | ---------- | ------------------- |
| 1.0.0   | 2025-01-15 | Initial API release |

---

## Support

For API issues or questions, contact: `support@mindmate-ai.com`
