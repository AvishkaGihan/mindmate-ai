import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface Config {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiration: string;
  encryptionKey: string;
  geminiApiKey: string;
  allowedOrigins: string[];
  logLevel: string;
}

const validateEnv = (): Config => {
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_EXPIRATION',
    'ENCRYPTION_KEY',
    'GEMINI_API_KEY',
  ];

  const missingVars = requiredVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  return {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL as string,
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpiration: process.env.JWT_EXPIRATION || '30d',
    encryptionKey: process.env.ENCRYPTION_KEY as string,
    geminiApiKey: process.env.GEMINI_API_KEY as string,
    allowedOrigins: (process.env.ALLOWED_ORIGINS || '').split(','),
    logLevel: process.env.LOG_LEVEL || 'info',
  };
};

export const config = validateEnv();
