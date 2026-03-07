import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const databaseURL = process.env.DATABASE_URL;

if (!databaseURL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const pool = new Pool({
  connectionString: databaseURL
});

export const db = drizzle(pool);
