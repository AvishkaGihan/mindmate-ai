import journalRepository from '../repositories/JournalRepository';
import { JournalEntry, JournalMetadata } from '../types';

interface CreateEntryDTO {
  userId: string;
  contentEncrypted: string;
  metadata?: JournalMetadata;
}

interface UpdateEntryDTO {
  contentEncrypted?: string;
  metadata?: JournalMetadata;
}

interface GetEntriesOptions {
  page?: number;
  limit?: number;
  mood?: number;
  tag?: string;
}

class JournalService {
  /**
   * Create a new encrypted journal entry
   * The server never sees the plaintext content; it receives and stores the ciphertext only.
   */
  async createEntry(data: CreateEntryDTO): Promise<JournalEntry> {
    if (!data.contentEncrypted) {
      throw new Error('Encrypted content is required');
    }

    // Validate metadata if present
    if (data.metadata) {
      if (
        data.metadata.moodScore &&
        (data.metadata.moodScore < 1 || data.metadata.moodScore > 5)
      ) {
        throw new Error('Mood score in metadata must be between 1 and 5');
      }
    }

    return await journalRepository.create({
      userId: data.userId,
      contentEncrypted: data.contentEncrypted,
      metadata: data.metadata || {},
    });
  }

  /**
   * Retrieve journal timeline with pagination
   * Filtering logic (mood/tags) happens in-memory or via refined repository queries in the future.
   * Current MVP repository supports basic pagination.
   */
  async getEntries(
    userId: string,
    options: GetEntriesOptions = {}
  ): Promise<{ entries: JournalEntry[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;

    const result = await journalRepository.findByUserId(userId, page, limit);

    // Basic in-memory filtering for MVP if specific metadata filters are requested
    // (Note: For large datasets, move this logic to the Repository level with JSONB queries)
    let filteredEntries = result.entries;

    if (options.mood) {
      filteredEntries = filteredEntries.filter(
        (e) => e.metadata?.moodScore === options.mood
      );
    }

    if (options.tag) {
      filteredEntries = filteredEntries.filter((e) =>
        e.metadata?.tags?.includes(options.tag!)
      );
    }

    return {
      entries: filteredEntries,
      total: result.total,
    };
  }

  /**
   * Get a single entry by ID
   * Ensures the entry belongs to the requesting user
   */
  async getEntryById(
    entryId: string,
    userId: string
  ): Promise<JournalEntry | null> {
    const entry = await journalRepository.findById(entryId);

    if (!entry) return null;
    if (entry.userId !== userId) {
      throw new Error('Unauthorized access to journal entry');
    }

    return entry;
  }

  /**
   * Update an existing journal entry
   */
  async updateEntry(
    entryId: string,
    userId: string,
    updates: UpdateEntryDTO
  ): Promise<JournalEntry> {
    // Check ownership first
    const existing = await this.getEntryById(entryId, userId);
    if (!existing) {
      throw new Error('Journal entry not found');
    }

    const updated = await journalRepository.update(entryId, updates);
    if (!updated) {
      throw new Error('Failed to update journal entry');
    }

    return updated;
  }

  /**
   * Delete a journal entry
   */
  async deleteEntry(entryId: string, userId: string): Promise<boolean> {
    // Check ownership
    const existing = await this.getEntryById(entryId, userId);
    if (!existing) {
      throw new Error('Journal entry not found');
    }

    return await journalRepository.delete(entryId);
  }
}

export default new JournalService();
