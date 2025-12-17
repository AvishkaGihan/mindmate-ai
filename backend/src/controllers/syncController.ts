import { Request, Response, NextFunction } from "express";
import { syncService } from "../services/syncService";
import { AppError } from "../utils/AppError";

/**
 * Sync Controller
 * Handles the "Offline-First" synchronization endpoints.
 * It acts as the gateway for the mobile app to upload a batch of
 * offline changes (journals created, moods logged) when connectivity is restored.
 */
export class SyncController {
  /**
   * Process the Sync Queue.
   * Receives an array of operations and applies them sequentially via the service layer.
   * Returns a report of success/failure counts to help the client manage its local queue.
   */
  public processQueue = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { queue } = req.body;

      // Basic validation: Queue must be an array
      if (!queue || !Array.isArray(queue)) {
        throw new AppError(
          "Invalid sync queue format. Expected an array.",
          400
        );
      }

      // If queue is empty, return early success
      if (queue.length === 0) {
        res.status(200).json({
          status: "success",
          data: {
            processed: 0,
            failed: 0,
            errors: [],
          },
        });
        return;
      }

      const userId = req.user!.userId;

      // Delegate to Sync Service
      // The service handles sorting, idempotency, and conflict logic
      const result = await syncService.processSyncQueue(userId, queue);

      // Return partial success status (200 OK)
      // Even if some items fail, the request itself succeeded in reaching the server.
      // The client uses the 'errors' array to determine which specific items to retry.
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const syncController = new SyncController();
