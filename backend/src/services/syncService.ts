import Journal from "../models/Journal";
import User from "../models/User";
import { IUser, IMood } from "../types";

/**
 * Sync Service (Offline-First Reconciliation)
 * * Handles the processing of the "Sync Queue" uploaded by the mobile app.
 * * Key Responsibilities:
 * 1. Batch processing of atomic operations (Journal CRUD, Mood Logging).
 * 2. Idempotency: Preventing duplicate data if the same sync packet is sent twice.
 * 3. Conflict Resolution: "Last Write Wins" based on client timestamps.
 */

export type SyncOperationType =
  | "CREATE_JOURNAL"
  | "UPDATE_JOURNAL"
  | "DELETE_JOURNAL"
  | "LOG_MOOD";

export interface SyncChange {
  id: string; // Client-generated UUID for the operation to track status
  type: SyncOperationType;
  payload: any;
  timestamp: string; // ISO Date of when the action occurred on device
}

interface SyncResult {
  processed: number;
  failed: number;
  errors: Array<{ changeId: string; error: string }>;
}

export class SyncService {
  /**
   * Process a batch of offline changes.
   * Uses sequential processing to ensure dependencies are respected
   * (e.g., Create Journal before Update Journal).
   */
  public async processSyncQueue(
    userId: string,
    changes: SyncChange[]
  ): Promise<SyncResult> {
    const result: SyncResult = { processed: 0, failed: 0, errors: [] };

    // Sort changes by timestamp to ensure chronological application
    // This is crucial for LWW (Last Write Wins) consistency.
    const sortedChanges = changes.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    for (const change of sortedChanges) {
      try {
        await this.applyChange(userId, change);
        result.processed++;
      } catch (error) {
        console.error(`Sync Error [${change.type}]:`, error);
        result.failed++;
        result.errors.push({
          changeId: change.id,
          error: (error as Error).message || "Unknown sync error",
        });
        // We continue processing other independent changes
      }
    }

    return result;
  }

  /**
   * Applies a single change to the database based on its type.
   */
  private async applyChange(userId: string, change: SyncChange): Promise<void> {
    const { type, payload, timestamp } = change;
    const changeDate = new Date(timestamp);

    switch (type) {
      case "LOG_MOOD":
        await this.handleLogMood(userId, payload, changeDate);
        break;

      case "CREATE_JOURNAL":
        await this.handleCreateJournal(userId, payload, changeDate);
        break;

      case "UPDATE_JOURNAL":
        await this.handleUpdateJournal(userId, payload, changeDate);
        break;

      case "DELETE_JOURNAL":
        await this.handleDeleteJournal(userId, payload);
        break;

      default:
        throw new Error(`Unsupported sync operation: ${type}`);
    }
  }

  // ============================================================================
  // Handlers
  // ============================================================================

  /**
   * Logs a mood. Uses $addToSet for basic deduplication of exact objects.
   * If the payload is complex, we might need manual existence checks.
   */
  private async handleLogMood(
    userId: string,
    payload: IMood,
    timestamp: Date
  ): Promise<void> {
    // Ensure the timestamp matches the action time
    const moodEntry = { ...payload, timestamp };

    // Idempotency: Check if a mood with the exact timestamp already exists
    // This prevents double-logging if the client retries the sync
    const user = await User.findOne({
      _id: userId,
      "moods.timestamp": timestamp,
    });

    if (user) {
      // Mood already exists, skip (Idempotent success)
      return;
    }

    await User.findByIdAndUpdate(userId, {
      $push: { moods: moodEntry },
    });
  }

  /**
   * Creates a journal.
   * Idempotency Strategy:
   * We rely on the client sending a potential 'clientId' or check for duplicate content/time.
   * For MVP, we check if a journal created at this exact ms already exists for the user.
   */
  private async handleCreateJournal(
    userId: string,
    payload: any,
    timestamp: Date
  ): Promise<void> {
    // Check for existing journal to prevent duplicates (Idempotency)
    const existing = await Journal.findOne({
      userId,
      createdAt: timestamp, // Assuming exact timestamp match implies same offline creation
    });

    if (existing) return;

    await Journal.create({
      ...payload,
      userId,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }

  /**
   * Updates a journal.
   * Conflict Resolution: Last Write Wins (LWW).
   * Only update if the incoming change is newer than the stored document.
   */
  private async handleUpdateJournal(
    userId: string,
    payload: any,
    timestamp: Date
  ): Promise<void> {
    const { _id, ...updates } = payload;

    const journal = await Journal.findOne({ _id, userId });

    if (!journal) {
      // If journal missing, it might have been deleted or never synced.
      // We accept this as a "soft fail" or could create it (Upsert).
      // For strictness, we warn.
      console.warn(`Sync: Attempted to update missing journal ${_id}`);
      return;
    }

    // LWW Check: If server data is newer, ignore this update
    if (journal.updatedAt > timestamp) {
      console.info(`Sync: Ignoring stale update for journal ${_id}`);
      return;
    }

    await Journal.updateOne(
      { _id, userId },
      {
        ...updates,
        updatedAt: timestamp,
      }
    );
  }

  private async handleDeleteJournal(
    userId: string,
    payload: any
  ): Promise<void> {
    const { _id } = payload;
    await Journal.deleteOne({ _id, userId });
  }
}

export const syncService = new SyncService();
