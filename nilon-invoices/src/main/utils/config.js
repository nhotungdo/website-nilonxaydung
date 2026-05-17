import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { logger } from './logger';
// Explicitly load .env file from project root
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    logger.info(`Loaded environment configuration from: ${envPath}`);
}
else {
    dotenv.config();
    logger.warn(`No .env file found at ${envPath}, falling back to system environment variables.`);
}
export const config = {
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        name: process.env.DB_NAME || 'nilon-invoices',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '123456',
        url: process.env.DATABASE_URL || 'postgresql://postgres:123456@localhost:5432/nilon-invoices'
    },
    isDev: process.env.NODE_ENV !== 'production'
};
// Strict check assertions
export const assertConfigIsValid = () => {
    const missing = [];
    if (!config.db.host)
        missing.push('DB_HOST');
    if (!config.db.name)
        missing.push('DB_NAME');
    if (!config.db.user)
        missing.push('DB_USER');
    if (missing.length > 0) {
        throw new Error(`CRITICAL CONFIG FAILURE: Missing environment variables: ${missing.join(', ')}`);
    }
};
