import { AppError } from '../types';

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, typically sufficient for MVP,
  // matching the route validation schema.
  return password.length >= 8;
};

export const isValidUUID = (id: string): boolean => {
  const uuidRegex =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(id);
};

export const isValidMoodScore = (score: number): boolean => {
  return Number.isInteger(score) && score >= 1 && score <= 5;
};

export const validateDateRange = (startDate: Date, endDate: Date): void => {
  if (startDate.getTime() > endDate.getTime()) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'Start date cannot be after end date'
    );
  }
};
