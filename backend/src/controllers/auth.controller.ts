import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const data = await AuthService.signup({ email, password });

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const data = await AuthService.login({ email, password });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // For stateless JWT, logout is handled client-side by discarding the token.
    // This endpoint exists for API completeness or future cookie invalidation.
    res.status(200).json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error('User context missing');
    }

    // TODO: Implement account deletion in AuthService
    // await AuthService.deleteAccount(userId);

    res.status(200).json({
      success: true,
      data: { message: 'Account deleted successfully' },
    });
  } catch (error) {
    next(error);
  }
};
