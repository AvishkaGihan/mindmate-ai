import winston from 'winston';
import { config } from '../config/env';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const envLevel = config.nodeEnv || 'development';
  return envLevel === 'development' ? 'debug' : 'info';
};

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.json()
);

const transports = [new winston.transports.Console()];

export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});
