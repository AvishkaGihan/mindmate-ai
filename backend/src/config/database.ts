import { Pool } from 'pg';
import { config } from './env';

const pool = new Pool({
  connectionString: config.databaseUrl,
  // Enable SSL in production, usually required by cloud providers
  ssl:
    config.nodeEnv === 'production' ? { rejectUnauthorized: false } : undefined,
});

const connectDatabase = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Handle pool errors (e.g., idle clients disconnected unexpectedly)
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
  process.exit(-1);
});

export { pool, connectDatabase };
