import { Request, Response, NextFunction } from 'express';
import ChatService from '../services/ChatService';
import conversationRepository from '../repositories/ConversationRepository';

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User context missing');
    }

    const { message } = req.body;

    // The service handles gathering context (mood, journals) internally
    const responseMessage = await ChatService.sendMessage(userId, message);

    res.status(200).json({
      success: true,
      data: responseMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User context missing');
    }

    const conversation = await conversationRepository.findByUserId(userId);

    res.status(200).json({
      success: true,
      data: conversation || { messages: [] },
    });
  } catch (error) {
    next(error);
  }
};
