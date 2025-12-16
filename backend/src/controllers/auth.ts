import { Request, Response } from "express";
import { firebaseAuth } from "../config/firebase";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

// Generate Session JWT (24h expiry)
const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, env.FIREBASE_PROJECT_ID, {
    // Using Project ID as secret for MVP
    expiresIn: "24h",
  });
};

export const loginOrRegister = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      res.status(400).json({ message: "ID Token required" });
      return;
    }

    // 1. Verify Firebase Token
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

    if (!email) {
      res.status(400).json({ message: "Email required" });
      return;
    }

    // 2. Find or Create User
    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({ uid, email, name: name || "User" });
    }

    // 3. Issue Custom Session Token
    const token = generateToken(user.uid);

    res.status(200).json({
      status: "success",
      data: {
        token,
        user: { uid: user.uid, email: user.email, name: user.name },
      },
    });
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ message: "Invalid Token" });
  }
};
