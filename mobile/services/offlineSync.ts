import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import api from "./api";
import { SyncOperation } from "../types";

/**
 * Offline Sync Service
 * "Traffic Controller" for data synchronization.
 * Manages network detection and the transmission of queued offline operations to the backend.
 */

type ConnectionChangeListener = (isConnected: boolean) => void;

class OfflineSyncService {
  private isConnected: boolean = true;
  private listeners: ConnectionChangeListener[] = [];

  constructor() {
    // Initialize network monitoring
    NetInfo.fetch().then((state) => {
      this.isConnected = !!state.isConnected;
    });

    NetInfo.addEventListener((state: NetInfoState) => {
      const prev = this.isConnected;
      this.isConnected = !!state.isConnected;

      if (prev !== this.isConnected) {
        this.notifyListeners(this.isConnected);
      }
    });
  }

  /**
   * Returns current network status.
   */
  public getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Subscribes to network state changes.
   * Useful for the Store to trigger auto-sync when connection returns.
   */
  public subscribe(listener: ConnectionChangeListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(isConnected: boolean) {
    this.listeners.forEach((listener) => listener(isConnected));
  }

  /**
   * Pushes the offline queue to the backend.
   * Implementation of the "Batch Sync" pattern.
   * * @param queue Array of pending operations
   * @returns Promise resolving to the server response or throwing an error
   */
  public async syncQueue(queue: SyncOperation[]): Promise<void> {
    if (!this.isConnected) {
      throw new Error("No internet connection");
    }

    if (queue.length === 0) {
      return;
    }

    try {
      // Send the entire batch to the sync endpoint
      // The backend will process these transactions in order.
      await api.post("/sync", { operations: queue });

      console.log(
        `[OfflineSync] Successfully synced ${queue.length} operations.`
      );
    } catch (error) {
      console.error("[OfflineSync] Sync failed", error);
      throw error;
    }
  }
}

// Export a singleton instance
export const offlineSyncService = new OfflineSyncService();
