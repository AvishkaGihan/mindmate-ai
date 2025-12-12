import syncRepository from '../repositories/SyncRepository';
import moodService from './MoodService';
import journalService from './JournalService';
import { SyncOperationPayload, SyncQueueItem } from '../types';

class SyncService {
  /**
   * Process a batch of sync operations from a client.
   * 1.  Persist incoming operations to the sync_queue (Audit Trail / Durability).
   * 2.  Fetch all pending operations for the user (FIFO).
   * 3.  Replay operations sequentially to update server state.
   * 4.  Mark operations as completed.
   */
  async syncOperations(
    userId: string,
    incomingOperations: SyncOperationPayload[]
  ): Promise<{ processed: number; failed: number }> {
    // 1. Persist incoming operations first
    for (const op of incomingOperations) {
      await syncRepository.enqueue(userId, op);
    }

    // 2. Fetch all pending operations (FIFO) to ensure strict chronological order
    const pendingQueue = await syncRepository.getPendingQueue(userId);

    let processedCount = 0;
    let failedCount = 0;

    // 3. Replay operations
    for (const item of pendingQueue) {
      try {
        await this.processSingleOperation(userId, item);
        await syncRepository.markSynced(item.id);
        processedCount++;
      } catch (error) {
        console.error(
          `Sync failed for item ${item.id} (${item.operation.type}):`,
          error
        );
        // We mark as failed so we don't block the queue forever,
        // but in a real system we might want a retry strategy or dead-letter queue.
        await syncRepository.markFailed(item.id);
        failedCount++;
      }
    }

    return { processed: processedCount, failed: failedCount };
  }

  /**
   * Execute a single operation based on its type.
   * Implements "Server Authority" - the server simply applies valid changes requested by client.
   */
  private async processSingleOperation(
    userId: string,
    item: SyncQueueItem
  ): Promise<void> {
    const { type, data } = item.operation;

    switch (type) {
      case 'mood:created':
        await this.handleMoodCreation(
          userId,
          data as Record<string, unknown>,
          item.operation.enqueuedAt
        );
        break;

      case 'journal:entry:created': {
        // Ensure the entry belongs to the user
        const entryData = data as Record<string, unknown>;
        await journalService.createEntry({
          userId,
          contentEncrypted: entryData.contentEncrypted as string,
          metadata: entryData.metadata as Record<string, unknown>,
        });
        break;
      }

      case 'journal:entry:updated': {
        const entryData = data as Record<string, unknown>;
        if (entryData.id) {
          await journalService.updateEntry(entryData.id as string, userId, {
            contentEncrypted: entryData.contentEncrypted as string,
            metadata: entryData.metadata as Record<string, unknown>,
          });
        }
        break;
      }

      case 'journal:entry:deleted': {
        const entryData = data as Record<string, unknown>;
        if (entryData.id) {
          await journalService.deleteEntry(entryData.id as string, userId);
        }
        break;
      }

      case 'conversation:updated':
        // Conversations are primarily server-managed in this MVP,
        // but this hook exists if we need to sync client-side state changes later.
        break;

      default:
        console.warn(`Unknown sync operation type: ${type}`);
    }
  }

  /**
   * Handle mood creation with deduplication logic.
   * Prevents duplicate logs if client retries sync or user double-taps offline.
   * Deduplication Window: +/- 1 minute of the original enqueue time.
   */
  private async handleMoodCreation(
    userId: string,
    data: Record<string, unknown>,
    enqueuedAt: string
  ): Promise<void> {
    const logTime = new Date(enqueuedAt);

    // Define a small window to check for duplicates (e.g., 1 minute)
    const windowStart = new Date(logTime.getTime() - 60000);
    const windowEnd = new Date(logTime.getTime() + 60000);

    // Check if a mood was already logged in this window
    const existingMoods = await moodService.getUserMoods(
      userId,
      windowStart,
      windowEnd
    );

    // If we find a mood with the exact same score in this window, assume duplicate
    const isDuplicate = existingMoods.some(
      (m) => m.moodScore === (data.moodScore as number)
    );

    if (isDuplicate) {
      console.log(
        `Skipping duplicate mood log for user ${userId} at ${enqueuedAt}`
      );
      return;
    }

    await moodService.createMood({
      userId,
      moodScore: data.moodScore as number,
      tags: data.tags as string[] | undefined,
      context: data.context as Record<string, unknown> | undefined,
    });
  }
}

export default new SyncService();
