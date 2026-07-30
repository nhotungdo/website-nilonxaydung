import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { logger } from './logger';

// Explicitly load .env file from project root
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  logger.info(`Loaded environment configuration from: ${envPath}`);
} else {
  dotenv.config();
  logger.warn(`No .env file found at ${envPath}, falling back to system environment variables.`);
}

export const config = {
  db: {
    host: process.env.DB_HOST || 'aws-0-ap-southeast-1.pooler.supabase.com',
    port: parseInt(process.env.DB_PORT || '6543', 10),
    name: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres.wtezillfvsdkjfctrimi',
    password: process.env.DB_PASSWORD || 'Donhotung2004',
    url: process.env.DATABASE_URL || 'postgresql://postgres.wtezillfvsdkjfctrimi:Donhotung2004@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
  },
  isDev: !app.isPackaged
};


// Strict check assertions
export const assertConfigIsValid = (): void => {
  const missing: string[] = [];
  if (!config.db.host) missing.push('DB_HOST');
  if (!config.db.name) missing.push('DB_NAME');
  if (!config.db.user) missing.push('DB_USER');
  
  if (missing.length > 0) {
    throw new Error(`CRITICAL CONFIG FAILURE: Missing environment variables: ${missing.join(', ')}`);
  }
};
