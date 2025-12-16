# MindMate AI - API Reference

**Base URL:** `http://localhost:3000/api/v1` (Dev) / `https://mindmate-api.onrender.com/api/v1` (Prod)

All API requests must be made over **HTTPS**. Responses are returned in **JSON** format.

---

## 🔐 Authentication

MindMate AI uses a hybrid authentication flow.

1. Clients authenticate with Firebase on the device.
2. Clients exchange the Firebase `idToken` for a backend-issued **JWT**.
3. All protected endpoints require this JWT in the `Authorization` header.

**Header Format:**

```http
Authorization: Bearer <your_backend_jwt>
```

---

## ⚠️ Error Handling

All API errors follow a standardized format to aid debugging and frontend handling.

**Structure:**

```json
{
  "status": "error",
  "code": "ERROR_CODE_STRING",
  "message": "Human-readable description.",
  "requestId": "req_abc123",
  "data": { "optional": "metadata" }
}
```

**Common Status Codes:**

- `400 Bad Request`: Validation failure (Zod).
- `401 Unauthorized`: Missing or expired JWT.
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: Unhandled backend exception.

---

## 1\. Authentication Endpoints

### Register / Login (Exchange Token)

Exchanges a valid Firebase ID Token for a MindMate Session JWT. Handles both registration (first time) and login.

- **URL:** `POST /auth/verify-token`
- **Auth Required:** No

**Request Body:**

```json
{
  "idToken": "eyJhbGciOiJSUzI1..." // Firebase ID Token
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGci...", // Backend JWT (Expires in 24h)
    "user": {
      "id": "mongo_id_123",
      "email": "user@example.com",
      "name": "Sarah"
    }
  }
}
```

### Refresh Token

Refresh an expiring session token.

- **URL:** `POST /auth/refresh`
- **Auth Required:** Yes (Valid JWT required)

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "token": "new_jwt_token_string"
  }
}
```

---

## 2\. Journaling Endpoints

**Note on Encryption:** The `content` field in journal entries is **End-to-End Encrypted**. The backend stores this as a generic string (`encryptedContent`) and cannot decrypt it.

### Get All Journals

Retrieve a paginated list of journal entries. Returns metadata and encrypted content.

- **URL:** `GET /journals`
- **Query Params:**
  - `page`: Number (default 1)
  - `limit`: Number (default 20)
  - `startDate`: ISO Date String (optional)
  - `endDate`: ISO Date String (optional)

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "journals": [
      {
        "id": "j_123",
        "date": "2025-12-15T08:30:00Z",
        "mood": "Anxious",
        "encryptedContent": "U2FsdGVkX1+..." // AES-256 Ciphertext
      }
    ],
    "pagination": { "page": 1, "total": 45 }
  }
}
```

### Create Journal Entry

- **URL:** `POST /journals`

**Request Body:**

```json
{
  "date": "2025-12-15T08:30:00Z",
  "mood": "Anxious", // Enum: Peaceful, Content, Anxious, Stressed, Sad, Angry, Overwhelmed
  "intensity": 7, // 1-10
  "encryptedContent": "U2FsdGVkX1+..."
}
```

**Response (201 Created):**

```json
{
  "status": "success",
  "data": { "id": "j_123", "createdAt": "..." }
}
```

### Delete Journal Entry

- **URL:** `DELETE /journals/:id`

**Response (200 OK):**

```json
{ "status": "success", "message": "Journal deleted" }
```

---

## 3\. Mood Tracking Endpoints

### Log Mood (Standalone)

Used for quick mood check-ins without a full journal entry.

- **URL:** `POST /moods`

**Request Body:**

```json
{
  "mood": "Content",
  "intensity": 8,
  "note": "Had a good lunch", // Optional, unencrypted plain text for analytics
  "timestamp": "2025-12-15T12:00:00Z"
}
```

### Get Mood Statistics

Aggregated data for visualizations (Charts/Heatmaps).

- **URL:** `GET /moods/stats`
- **Query Params:** `range=7d` | `30d` | `90d`

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "distribution": { "Anxious": 5, "Content": 12 },
    "trend": [
      { "date": "2025-12-10", "intensity": 6 },
      { "date": "2025-12-11", "intensity": 4 }
    ],
    "insight": "You tend to feel Anxious on Mondays."
  }
}
```

---

## 4\. AI & Chat Endpoints

### Send Chat Message

Streaming or standard response from the AI companion. Context is managed by the backend (last 20 messages).

- **URL:** `POST /chat`

**Request Body:**

```json
{
  "message": "I feel overwhelmed by work today.",
  "localContext": "..." // Optional snippet from current journal
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "reply": "I hear you. It sounds like a lot is on your plate. What specifically is taking up the most mental space right now?",
    "sentiment": "Stressed",
    "suggestedAction": "breathing_exercise" // Optional recommendation
  }
}
```

### Generate Journal Prompts

Generates a prompt based on raw text sentiment (processed in-memory, not stored).

- **URL:** `POST /ai/prompts`

**Request Body:**

```json
{
  "currentText": "I don't know why I am crying..."
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "prompt": "It's okay to let it out. When you're ready, can you name one emotion underneath the sadness?"
  }
}
```

### Get Daily Affirmation

Fetches a personalized affirmation based on recent mood history.

- **URL:** `GET /ai/affirmation`

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "id": "aff_999",
    "text": "I am capable of handling difficult moments with grace.",
    "theme": "resilience"
  }
}
```

---

## 5\. Offline Sync

### Sync Queue

Uploads a batch of offline actions to be reconciled.

- **URL:** `POST /sync`

**Request Body:**

```json
{
  "changes": [
    { "type": "CREATE_JOURNAL", "payload": { ... }, "timestamp": "..." },
    { "type": "LOG_MOOD", "payload": { ... }, "timestamp": "..." }
  ]
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "processed": 2,
    "errors": []
  }
}
```
