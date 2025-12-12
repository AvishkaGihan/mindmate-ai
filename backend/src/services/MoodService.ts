import moodRepository from '../repositories/MoodRepository';
import { encryptJSON, decryptJSON, EncryptedData } from '../config/encryption';
import { MoodLog } from '../types';

interface CreateMoodDTO {
  userId: string;
  moodScore: number;
  tags?: string[];
  context?: Record<string, unknown>;
}

class MoodService {
  /**
   * Create a new mood log with validation and encryption for sensitive context
   */
  async createMood(data: CreateMoodDTO): Promise<MoodLog> {
    // 1. Validation
    if (data.moodScore < 1 || data.moodScore > 5) {
      throw new Error('Mood score must be between 1 and 5');
    }

    if (data.tags && !Array.isArray(data.tags)) {
      throw new Error('Tags must be an array of strings');
    }

    // 2. Encrypt context if present (Database-level encryption for sensitive metadata)
    // We store the encrypted bundle as JSONB so the DB schema remains valid
    let encryptedContext: EncryptedData | Record<string, unknown> = {};
    if (data.context && Object.keys(data.context).length > 0) {
      encryptedContext = encryptJSON(data.context);
    }

    // 3. Save to repository
    // Note: Tags remain unencrypted to allow for SQL-based pattern analysis (e.g., "Monday anxiety")
    const createdLog = await moodRepository.create({
      userId: data.userId,
      moodScore: data.moodScore,
      tags: data.tags || [],
      context: encryptedContext as Record<string, unknown>,
    });

    // 4. Return decrypted version to the caller immediately
    return {
      ...createdLog,
      context: data.context || {},
    };
  }

  /**
   * Retrieve mood logs for a user, decrypting context on the fly
   */
  async getUserMoods(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<MoodLog[]> {
    const logs = await moodRepository.findByUserId(userId, startDate, endDate);

    return logs.map((log) => ({
      ...log,
      // Attempt to decrypt context if it looks like an encrypted bundle
      context: this.tryDecryptContext(log.context),
    }));
  }

  /**
   * Get aggregated pattern insights (averages, day-of-week trends)
   * These queries run directly on the DB (unencrypted fields)
   */
  async analyzePatterns(userId: string) {
    const [summary, patterns] = await Promise.all([
      moodRepository.getMoodSummary(userId, 30), // Last 30 days
      moodRepository.getPatterns(userId), // Day of week trends
    ]);

    return {
      summary,
      patterns,
    };
  }

  /**
   * Helper to safely decrypt context
   */
  private tryDecryptContext(
    context: Record<string, unknown>
  ): Record<string, unknown> {
    if (
      context &&
      'iv' in context &&
      'content' in context &&
      'tag' in context
    ) {
      try {
        return decryptJSON(context as unknown as EncryptedData);
      } catch (error) {
        console.error('Failed to decrypt mood context:', error);
        return {};
      }
    }
    return context || {};
  }
}

export default new MoodService();
