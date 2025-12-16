import { cleanEnv, str, port } from "envalid";
import dotenv from "dotenv";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "test", "production"] }),
  PORT: port({ default: 5000 }),
  MONGODB_URI: str(),
  FIREBASE_PROJECT_ID: str(),
  GEMINI_API_KEY: str(),
  GROQ_API_KEY: str(),
  SENTRY_DSN: str(),
});
