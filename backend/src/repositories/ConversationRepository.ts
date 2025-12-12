import { pool } from '../config/database';
import { Conversation, ChatMessage } from '../types';

interface CreateConversationDTO {
  userId: string;
  messages?: ChatMessage[];
}

class ConversationRepository {
  /**
   * Create a new conversation
   */
  async create(data: CreateConversationDTO): Promise<Conversation> {
    const query = `
      INSERT INTO conversations (user_id, messages)
      VALUES ($1, $2::jsonb)
      RETURNING
        id,
        user_id as "userId",
        messages,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    const initialMessages = data.messages || [];
    const result = await pool.query<Conversation>(query, [
      data.userId,
      JSON.stringify(initialMessages),
    ]);

    return result.rows[0];
  }

  /**
   * Find the active conversation for a user
   * (MVP assumes single/most recent conversation context)
   */
  async findByUserId(userId: string): Promise<Conversation | null> {
    const query = `
      SELECT
        id,
        user_id as "userId",
        messages,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM conversations
      WHERE user_id = $1
      ORDER BY updated_at DESC
      LIMIT 1
    `;

    const result = await pool.query<Conversation>(query, [userId]);
    return result.rows[0] || null;
  }

  /**
   * Append new messages to an existing conversation
   * Uses PostgreSQL JSONB concatenation (||) to efficiently append to the array
   */
  async updateMessages(
    conversationId: string,
    newMessages: ChatMessage[]
  ): Promise<Conversation | null> {
    const query = `
      UPDATE conversations
      SET
        messages = messages || $2::jsonb,
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        user_id as "userId",
        messages,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    const result = await pool.query<Conversation>(query, [
      conversationId,
      JSON.stringify(newMessages),
    ]);

    return result.rows[0] || null;
  }
}

export default new ConversationRepository();
