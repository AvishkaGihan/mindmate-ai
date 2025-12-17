import { Request, Response, NextFunction } from "express";
import Journal from "../models/Journal";
import { encrypt, decrypt } from "../services/encryptionService";
import {
  validate,
  journalSchema,
  journalUpdateSchema,
} from "../utils/validators";
import { AppError } from "../utils/AppError";

/**
 * Journal Controller
 * Manages the lifecycle of encrypted journal entries.
 * Responsibilities:
 * - Enforce ownership (User can only act on their own data).
 * - Handle the "Encryption at Rest" layer (Server-side wrapping).
 */
export class JournalController {
  /**
   * Create a new journal entry.
   * Wraps the client-provided ciphertext with server-side encryption before saving.
   */
  public create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // 1. Validate Input
      const data = validate(journalSchema, req.body);

      // 2. Apply Server-Side Encryption (Layer 3)
      // The client sends Layer 2 (Device Encrypted) data.
      // We wrap it again to ensure security at rest (DB dump protection).
      const serverEncryptedContent = encrypt(data.encryptedContent);

      // 3. Save to Database
      const journal = await Journal.create({
        ...data,
        encryptedContent: serverEncryptedContent,
        userId: req.user!.userId, // req.user is guaranteed by authMiddleware
      });

      // 4. Respond
      // We return the saved object. Note: we return the content AS SAVED (server encrypted)
      // or should we return it as the client sent it?
      // Convention: Return what was persisted, or the client-usable format.
      // For consistency, let's strip the server layer so the client gets back what they sent.
      const responseData = journal.toObject();
      responseData.encryptedContent = decrypt(journal.encryptedContent);

      res.status(201).json({
        status: "success",
        data: { journal: responseData },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve all journals for the authenticated user.
   * Supports pagination and basic filtering.
   * Decrypts the server-side encryption layer for each entry.
   */
  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { date, mood, limit = 20, page = 1 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // Build Query
      const query: any = { userId: req.user!.userId };

      if (mood) {
        query.mood = mood;
      }

      if (date) {
        // Simple date filtering (exact day match or range could be added)
        // For MVP, we'll assume the client sends an ISO string start/end or we match loosely.
        // Implementing simple day matching:
        const start = new Date(date as string);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date as string);
        end.setHours(23, 59, 59, 999);
        query.date = { $gte: start, $lte: end };
      }

      // Execute Query
      const journals = await Journal.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(Number(limit));

      // Decrypt Content (Remove Server Layer)
      const decryptedJournals = journals.map((journal) => {
        const doc = journal.toObject();
        try {
          doc.encryptedContent = decrypt(journal.encryptedContent);
        } catch (err) {
          // If decryption fails, we shouldn't crash the whole list.
          // Mark as unavailable or log error.
          doc.encryptedContent = "[Decryption Failed]";
        }
        return doc;
      });

      res.status(200).json({
        status: "success",
        results: journals.length,
        data: { journals: decryptedJournals },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a single journal by ID.
   */
  public getOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const journal = await Journal.findOne({
        _id: req.params.id,
        userId: req.user!.userId,
      });

      if (!journal) {
        throw new AppError("No journal found with that ID", 404);
      }

      // Remove Server Layer
      const doc = journal.toObject();
      doc.encryptedContent = decrypt(journal.encryptedContent);

      res.status(200).json({
        status: "success",
        data: { journal: doc },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a journal entry.
   */
  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const updates = validate(journalUpdateSchema, req.body);

      // If content is being updated, we must re-encrypt it with the server key
      if (updates.encryptedContent) {
        updates.encryptedContent = encrypt(updates.encryptedContent);
      }

      const journal = await Journal.findOneAndUpdate(
        { _id: req.params.id, userId: req.user!.userId },
        updates,
        { new: true, runValidators: true }
      );

      if (!journal) {
        throw new AppError("No journal found with that ID", 404);
      }

      // Return decoded version
      const doc = journal.toObject();
      doc.encryptedContent = decrypt(journal.encryptedContent);

      res.status(200).json({
        status: "success",
        data: { journal: doc },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a journal entry.
   */
  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const journal = await Journal.findOneAndDelete({
        _id: req.params.id,
        userId: req.user!.userId,
      });

      if (!journal) {
        throw new AppError("No journal found with that ID", 404);
      }

      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const journalController = new JournalController();
