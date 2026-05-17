import { db } from './postgres';
import { logger } from '../utils/logger';
import { assertConfigIsValid } from '../utils/config';
const SCHEMA_SQL = `
-- Drop existing tables to enable clean re-runs if necessary
DROP TABLE IF EXISTS printer_logs CASCADE;
DROP TABLE IF EXISTS failed_jobs CASCADE;
DROP TABLE IF EXISTS print_jobs CASCADE;
DROP TABLE IF EXISTS printers CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS app_settings CASCADE;

-- 1. Table: orders
CREATE TABLE orders (
  id VARCHAR(100) PRIMARY KEY,
  order_code VARCHAR(100) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  total_amount NUMERIC(15, 2) NOT NULL,
  payment_method VARCHAR(100) NOT NULL,
  status VARCHAR(100) NOT NULL DEFAULT 'PENDING',
  invoice_pdf VARCHAR(512),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: printers
CREATE TABLE printers (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  paper_size VARCHAR(50) NOT NULL CHECK (paper_size IN ('K58', 'K80')),
  connection_type VARCHAR(50) NOT NULL CHECK (connection_type IN ('USB', 'LAN', 'WIFI')),
  ip_address VARCHAR(100),
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: print_jobs
CREATE TABLE print_jobs (
  id VARCHAR(100) PRIMARY KEY,
  order_id VARCHAR(100) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  printer_id VARCHAR(100) NOT NULL REFERENCES printers(id) ON DELETE CASCADE,
  pdf_path VARCHAR(512) NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('WAITING', 'PRINTING', 'COMPLETED', 'FAILED')) DEFAULT 'WAITING',
  retry_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  printed_at TIMESTAMP WITH TIME ZONE
);

-- 4. Table: failed_jobs
CREATE TABLE failed_jobs (
  id VARCHAR(100) PRIMARY KEY,
  print_job_id VARCHAR(100) UNIQUE NOT NULL REFERENCES print_jobs(id) ON DELETE CASCADE,
  error_code VARCHAR(100) NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  retry_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Table: app_settings
CREATE TABLE app_settings (
  id INTEGER PRIMARY KEY, -- We enforce a single config row, e.g., id = 1
  api_url VARCHAR(255) NOT NULL,
  socket_url VARCHAR(255) NOT NULL,
  api_token VARCHAR(512) NOT NULL,
  auto_startup BOOLEAN DEFAULT FALSE,
  notification_sound BOOLEAN DEFAULT TRUE,
  dark_mode BOOLEAN DEFAULT TRUE
);

-- 6. Table: printer_logs
CREATE TABLE printer_logs (
  id SERIAL PRIMARY KEY,
  printer_id VARCHAR(100) REFERENCES printers(id) ON DELETE SET NULL,
  log_level VARCHAR(50) NOT NULL CHECK (log_level IN ('INFO', 'WARN', 'ERROR')),
  message TEXT NOT NULL,
  metadata TEXT, -- JSON string representation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create optimization indexes
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_print_jobs_status ON print_jobs(status);
CREATE INDEX idx_printer_logs_created_at ON printer_logs(created_at);
`;
export const runMigrations = async () => {
    logger.info('[Migration] Running PostgreSQL database migrations...');
    try {
        assertConfigIsValid();
        await db.connectDatabase();
        // Run the complete schema script in a safe transaction block
        await db.transaction(async (client) => {
            await client.query(SCHEMA_SQL);
        });
        logger.info('[Migration] Database tables migrated successfully.');
    }
    catch (err) {
        logger.error(`[Migration] Database migration failed: ${err.message}`, err.stack);
        throw err;
    }
};
