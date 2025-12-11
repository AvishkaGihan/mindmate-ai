-- Mood logs table definition
CREATE TABLE IF NOT EXISTS mood_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 5),
    tags JSONB DEFAULT '[]'::jsonb,
    context JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Composite index for efficient querying of a user's mood history over time
-- Ordered descending to fetch most recent logs first
CREATE INDEX IF NOT EXISTS idx_mood_logs_user_created ON mood_logs(user_id, created_at DESC);

-- GIN index for efficient searching and filtering within the JSONB tags array
CREATE INDEX IF NOT EXISTS idx_mood_logs_tags ON mood_logs USING GIN (tags);