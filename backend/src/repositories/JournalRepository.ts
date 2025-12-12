import { Buffer } from 'buffer';
import { pool } from '../config/database';
import { JournalEntry, JournalMetadata } from '../types';

interface CreateJournalDTO {
  userId: string;
  contentEncrypted: string; // Base64 ciphertext
  metadata?: JournalMetadata;
}

interface UpdateJournalDTO {
  contentEncrypted?: string;
  metadata?: JournalMetadata;
}

class JournalRepository {
  /**
   * Create a new encrypted journal entry
   * Converts Base64 ciphertext to Buffer for BYTEA storage
   */
  async create(entry: CreateJournalDTO): Promise<JournalEntry> {
    const query = `
      INSERT INTO journal_entries (user_id, content_encrypted, metadata)
      VALUES ($1, $2, $3)
      RETURNING
        id,
        user_id as "userId",
        content_encrypted as "contentEncrypted",
        metadata,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    // Convert Base64 string to Buffer for DB storage
    const encryptedBuffer = Buffer.from(entry.contentEncrypted, 'base64');

    const values = [
      entry.userId,
      encryptedBuffer,
      JSON.stringify(entry.metadata || {}),
    ];

    const result = await pool.query(query, values);
    const row = result.rows[0];

    // Convert Buffer back to Base64 string for application use
    return this.mapRowToEntry(row);
  }

  /**
   * Find entries by user ID with pagination
   */
  async findByUserId(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ entries: JournalEntry[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get entries
    const query = `
      SELECT
        id,
        user_id as "userId",
        content_encrypted as "contentEncrypted",
        metadata,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM journal_entries
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) FROM journal_entries WHERE user_id = $1`;

    const [entriesResult, countResult] = await Promise.all([
      pool.query(query, [userId, limit, offset]),
      pool.query(countQuery, [userId]),
    ]);

    const entries = entriesResult.rows.map((row) => this.mapRowToEntry(row));
    const total = parseInt(countResult.rows[0].count, 10);

    return { entries, total };
  }

  /**
   * Find a specific entry by ID
   */
  async findById(id: string): Promise<JournalEntry | null> {
    const query = `
      SELECT
        id,
        user_id as "userId",
        content_encrypted as "contentEncrypted",
        metadata,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM journal_entries
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) return null;
    return this.mapRowToEntry(result.rows[0]);
  }

  /**
   * Update an entry
   */
  async update(
    id: string,
    updates: UpdateJournalDTO
  ): Promise<JournalEntry | null> {
    const fields: string[] = [];
    const values: (string | object)[] = [];
    let idx = 1;

    if (updates.contentEncrypted) {
      fields.push(`content_encrypted = $${idx++}`);
      values.push(Buffer.from(updates.contentEncrypted, 'base64'));
    }

    if (updates.metadata) {
      fields.push(`metadata = $${idx++}`);
      values.push(JSON.stringify(updates.metadata));
    }

    if (fields.length === 0) return this.findById(id);

    // Add ID to values
    values.push(id);

    const query = `
      UPDATE journal_entries
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING
        id,
        user_id as "userId",
        content_encrypted as "contentEncrypted",
        metadata,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) return null;
    return this.mapRowToEntry(result.rows[0]);
  }

  /**
   * Delete an entry
   */
  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM journal_entries WHERE id = $1';
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Helper: Map database row to JournalEntry type
   * Handles Buffer -> Base64 conversion
   */
  private mapRowToEntry(row: Record<string, unknown>): JournalEntry {
    return {
      ...(row as unknown as JournalEntry),
      // Ensure content is returned as Base64 string
      contentEncrypted: Buffer.isBuffer(row.contentEncrypted)
        ? row.contentEncrypted.toString('base64')
        : (row.contentEncrypted as string),
    };
  }
}

export default new JournalRepository();
