import { pool } from '../config/database';
import { MoodLog } from '../types';

class MoodRepository {
  /**
   * Create a new mood log
   */
  async create(moodLog: Omit<MoodLog, 'id' | 'createdAt'>): Promise<MoodLog> {
    const query = `
      INSERT INTO mood_logs (user_id, mood_score, tags, context)
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        user_id as "userId",
        mood_score as "moodScore",
        tags,
        context,
        created_at as "createdAt";
    `;
    const values = [
      moodLog.userId,
      moodLog.moodScore,
      JSON.stringify(moodLog.tags || []),
      JSON.stringify(moodLog.context || {}),
    ];
    const result = await pool.query<MoodLog>(query, values);
    return result.rows[0];
  }

  /**
   * Find mood logs by user ID with optional date range
   */
  async findByUserId(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<MoodLog[]> {
    let query = `
      SELECT
        id,
        user_id as "userId",
        mood_score as "moodScore",
        tags,
        context,
        created_at as "createdAt"
      FROM mood_logs
      WHERE user_id = $1
    `;
    const values: unknown[] = [userId];

    if (startDate && endDate) {
      query += ` AND created_at BETWEEN $2 AND $3`;
      values.push(startDate, endDate);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query<MoodLog>(query, values);
    return result.rows;
  }

  /**
   * Get mood summary statistics (average score, count) for a specific period
   */
  async getMoodSummary(userId: string, days: number): Promise<unknown> {
    const query = `
      SELECT
        COUNT(*) as "totalLogs",
        ROUND(AVG(mood_score), 2) as "averageMood",
        MIN(mood_score) as "minMood",
        MAX(mood_score) as "maxMood"
      FROM mood_logs
      WHERE user_id = $1
        AND created_at >= NOW() - ($2 || ' days')::INTERVAL;
    `;
    const result = await pool.query(query, [userId, days]);
    return result.rows[0];
  }

  /**
   * Analyze mood patterns by day of week
   * Returns average mood score grouped by day (0=Sunday, 6=Saturday)
   */
  async getPatterns(userId: string): Promise<unknown[]> {
    const query = `
      SELECT
        EXTRACT(DOW FROM created_at) as "dayOfWeek",
        ROUND(AVG(mood_score), 2) as "averageMood",
        COUNT(*) as "logCount"
      FROM mood_logs
      WHERE user_id = $1
      GROUP BY "dayOfWeek"
      ORDER BY "dayOfWeek" ASC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Find logs containing specific tags (JSONB array query)
   */
  async findByTag(userId: string, tag: string): Promise<MoodLog[]> {
    const query = `
      SELECT
        id,
        user_id as "userId",
        mood_score as "moodScore",
        tags,
        context,
        created_at as "createdAt"
      FROM mood_logs
      WHERE user_id = $1 AND tags @> $2::jsonb
      ORDER BY created_at DESC;
    `;
    // JSONB containment operator @> checks if the left JSON value contains the right JSON path/value
    const tagJson = JSON.stringify([tag]);
    const result = await pool.query<MoodLog>(query, [userId, tagJson]);
    return result.rows;
  }
}

export default new MoodRepository();
