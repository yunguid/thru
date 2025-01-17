import { Pool } from 'pg';
import dotenv from 'dotenv';
import debug from 'debug';

const log = debug('arkon:db');
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'job_applications',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Enhanced query logging
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    log({
      query: text,
      params,
      rows: result.rowCount,
      duration: `${duration}ms`,
    });
    return result;
  } catch (err) {
    const error = err as Error;
    log({
      query: text,
      params,
      error: error.message,
      stack: error.stack,
      duration: `${Date.now() - start}ms`
    });
    throw error;
  }
};

// Connection monitoring
pool.on('connect', () => {
  const count = (pool as any).totalCount || 0;
  log('New client connected [total=%d]', count);
});

pool.on('remove', () => {
  const count = (pool as any).totalCount || 0;
  log('Client connection closed [total=%d]', count);
});

pool.on('error', (err: Error) => {
  log('Unexpected error on idle client', {
    error: err.message,
    stack: err.stack
  });
});

export default pool; 