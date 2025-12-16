import { Request, Response } from "express";
import Journal from "../models/Journal";
import { encryptServerSide, decryptServerSide } from "../utils/encryption";

// POST /api/journals
export const createJournal = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - user attached by auth middleware (Phase 2)
    const userId = req.user.uid;
    const { encryptedContent, mood, moodIntensity, tags } = req.body;

    // 1. Validate Input (Basic)
    if (!encryptedContent) {
      res.status(400).json({ message: "Content required" });
      return;
    }

    // 2. Server-Side Encryption (Layer 2)
    // We encrypt the ALREADY encrypted string from the device
    const serverEncrypted = encryptServerSide(encryptedContent);

    // 3. Save to DB
    const journal = await Journal.create({
      userId,
      encryptedContent: serverEncrypted.content,
      iv: serverEncrypted.iv,
      authTag: serverEncrypted.authTag,
      mood,
      moodIntensity,
      tags,
    });

    res.status(201).json({ status: "success", data: journal });
  } catch (error) {
    console.error("Create Journal Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET /api/journals
export const getJournals = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.uid;

    const journals = await Journal.find({ userId }).sort({ createdAt: -1 });

    // Decrypt Server Layer (Layer 2) so device can decrypt Layer 1
    const decryptedJournals = journals
      .map((j) => {
        try {
          const deviceEncryptedContent = decryptServerSide({
            iv: j.iv,
            content: j.encryptedContent,
            authTag: j.authTag,
          });

          return {
            _id: j._id,
            content: deviceEncryptedContent, // Still encrypted by Device Key!
            mood: j.mood,
            createdAt: j.createdAt,
          };
        } catch (e) {
          console.error(`Decryption failed for journal ${j._id}`);
          return null;
        }
      })
      .filter((j) => j !== null);

    res.status(200).json({ status: "success", data: decryptedJournals });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
