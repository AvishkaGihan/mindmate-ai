import { app } from './app';
import { pool, connectDatabase } from './config/database';
import { config } from './config/env';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    await connectDatabase();
    logger.info('Database connection established successfully');

    const server = app.listen(config.port, () => {
      logger.info(
        `Server running on port ${config.port} in ${config.nodeEnv} mode`
      );
    });

    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} signal received: closing HTTP server`);
      server.close(async () => {
        logger.info('HTTP server closed');
        try {
          await pool.end();
          logger.info('Database connection closed');
          process.exit(0);
        } catch (err) {
          logger.error('Error closing database connection', err);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Unable to connect to the database', error);
    process.exit(1);
  }
};

startServer();
