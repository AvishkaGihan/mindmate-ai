# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### POST `/auth/login`

Exchanges a Firebase ID Token for a Session JWT.

- **Body:** `{ "idToken": "firebase_token_..." }`
- **Response:** `{ "status": "success", "data": { "token": "jwt...", "user": {...} } }`

## Journals

### POST `/journals`

Creates a new encrypted journal entry.

- **Header:** `Authorization: Bearer <token>`
- **Body:** ```json
  {
  "encryptedContent": "U2FsdGVkX1...",
  "mood": "Peaceful"
  }
  ```

  ```

### GET `/journals`

Retrieves all journals for the authenticated user.

- **Response:** Returns an array of _Server-Decrypted_ but still _Device-Encrypted_ entries.

## Chat

### POST `/chat`

Sends a message to the AI companion.

- **Body:** `{ "message": "I feel anxious" }`
- **Response:** ```json
  {
  "status": "success",
  "data": {
  "message": "I'm sorry to hear that...",
  "source": "gemini"
  }
  }
  ```

  ```
