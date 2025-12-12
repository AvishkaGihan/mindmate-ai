import { pool } from '../config/database';
import { SyncQueueItem, SyncOperationPayload } from '../types';

class SyncRepository {
  /**
   * Add a new operation to the sync queue
   */
  async enqueue(
    userId: string,
    operation: SyncOperationPayload
  ): Promise<SyncQueueItem> {
    const query = `
      INSERT INTO sync_queue (user_id, operation, status)
      VALUES ($1, $2, 'pending')
      RETURNING
        id,
        user_id as "userId",
        operation,
        status,
        created_at as "createdAt",
        synced_at as "syncedAt"
    `;

    const result = await pool.query<SyncQueueItem>(query, [
      userId,
      JSON.stringify(operation),
    ]);

    return result.rows[0];
  }

  /**
   * Get all pending operations for a user, ordered by creation time (FIFO)
   * This ensures operations are replayed in the exact order they occurred
   */
  async getPendingQueue(userId: string): Promise<SyncQueueItem[]> {
    const query = `
      SELECT
        id,
        user_id as "userId",
        operation,
        status,
        created_at as "createdAt",
        synced_at as "syncedAt"
      FROM sync_queue
      WHERE user_id = $1 AND status = 'pending'
      ORDER BY created_at ASC
    `;

    const result = await pool.query<SyncQueueItem>(query, [userId]);
    return result.rows;
  }

  /**
   * Mark a specific queue item as successfully synced
   */
  async markSynced(id: string): Promise<SyncQueueItem | null> {
    const query = `
      UPDATE sync_queue
      SET status = 'completed', synced_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        user_id as "userId",
        operation,
        status,
        created_at as "createdAt",
        synced_at as "syncedAt"
    `;

    const result = await pool.query<SyncQueueItem>(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Mark a queue item as failed (optional, for error tracking)
   */
  async markFailed(id: string): Promise<SyncQueueItem | null> {
    const query = `
      UPDATE sync_queue
      SET status = 'failed'
      WHERE id = $1
      RETURNING
        id,
        user_id as "userId",
        operation,
        status,
        created_at as "createdAt",
        synced_at as "syncedAt"
    `;

    const result = await pool.query<SyncQueueItem>(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Clear all queue items for a user (used for "Wipe Data" feature)
   */
  async clearQueue(userId: string): Promise<void> {
    const query = 'DELETE FROM sync_queue WHERE user_id = $1';
    await pool.query(query, [userId]);
  }
}

export default new SyncRepository();
