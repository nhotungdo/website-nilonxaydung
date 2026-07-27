import { db } from './postgres';
import { logger } from '../utils/logger';
import { assertConfigIsValid } from '../utils/config';

/**
 * Schema for nilon-invoices tables on Supabase PostgreSQL.
 * Uses CREATE TABLE IF NOT EXISTS to be safe with cloud DB —
 * will NOT drop existing data if tables already exist.
 */
const SCHEMA_SQL = `
-- 1. Table: customers
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(100) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) UNIQUE NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: products
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  price NUMERIC(15, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: orders
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(100) PRIMARY KEY,
  order_code VARCHAR(100) UNIQUE NOT NULL,
  customer_id VARCHAR(100) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  subtotal NUMERIC(15, 2) NOT NULL,
  shipping_fee NUMERIC(15, 2) NOT NULL DEFAULT 0,
  total NUMERIC(15, 2) NOT NULL,
  payment_method VARCHAR(100) NOT NULL,
  payment_status VARCHAR(100) NOT NULL DEFAULT 'pending',
  order_status VARCHAR(100) NOT NULL DEFAULT 'pending',
  print_status VARCHAR(100) NOT NULL DEFAULT 'waiting',
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  printed_at TIMESTAMP WITH TIME ZONE,
  printed_by VARCHAR(255)
);

-- 4. Table: order_items
CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(100) PRIMARY KEY,
  order_id VARCHAR(100) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  price NUMERIC(15, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  total NUMERIC(15, 2) NOT NULL
);

-- 5. Table: printers
CREATE TABLE IF NOT EXISTS printers (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  paper_size VARCHAR(50) NOT NULL CHECK (paper_size IN ('K58', 'K80')),
  connection_type VARCHAR(50) NOT NULL CHECK (connection_type IN ('USB', 'LAN', 'WIFI')),
  ip_address VARCHAR(100),
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Table: print_jobs
CREATE TABLE IF NOT EXISTS print_jobs (
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

-- 7. Table: failed_jobs
CREATE TABLE IF NOT EXISTS failed_jobs (
  id VARCHAR(100) PRIMARY KEY,
  print_job_id VARCHAR(100) UNIQUE NOT NULL REFERENCES print_jobs(id) ON DELETE CASCADE,
  error_code VARCHAR(100) NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  retry_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Table: app_settings
CREATE TABLE IF NOT EXISTS app_settings (
  id INTEGER PRIMARY KEY,
  api_url VARCHAR(255) NOT NULL,
  socket_url VARCHAR(255) NOT NULL,
  api_token VARCHAR(512) NOT NULL,
  auto_startup BOOLEAN DEFAULT FALSE,
  notification_sound BOOLEAN DEFAULT TRUE,
  dark_mode BOOLEAN DEFAULT TRUE
);

-- 9. Table: printer_logs
CREATE TABLE IF NOT EXISTS printer_logs (
  id SERIAL PRIMARY KEY,
  printer_id VARCHAR(100) REFERENCES printers(id) ON DELETE SET NULL,
  log_level VARCHAR(50) NOT NULL CHECK (log_level IN ('INFO', 'WARN', 'ERROR')),
  message TEXT NOT NULL,
  metadata TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create optimization indexes (IF NOT EXISTS to be idempotent)
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_print_status ON orders(print_status);
CREATE INDEX IF NOT EXISTS idx_print_jobs_status ON print_jobs(status);
CREATE INDEX IF NOT EXISTS idx_printer_logs_created_at ON printer_logs(created_at);
`;

export const runMigrations = async (): Promise<void> => {
  logger.info('[Migration] Running schema migrations on Supabase PostgreSQL...');
  
  try {
    assertConfigIsValid();
    await db.connectDatabase();

    // Run the complete schema script in a safe transaction block
    await db.transaction(async (client) => {
      await client.query(SCHEMA_SQL);
    });

    logger.info('[Migration] ✅ Supabase schema migrated successfully (tables created if not existed).');
  } catch (err: any) {
    logger.error(`[Migration] ❌ Schema migration failed: ${err.message}`, err.stack);
    throw err;
  }
};
