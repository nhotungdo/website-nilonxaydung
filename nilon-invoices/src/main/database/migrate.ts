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

-- 10. Table: inventory_items
CREATE TABLE IF NOT EXISTS inventory_items (
  id              VARCHAR(100) PRIMARY KEY,
  sku             VARCHAR(100) UNIQUE NOT NULL,
  name            VARCHAR(255) NOT NULL,
  category        VARCHAR(100) NOT NULL,
  unit            VARCHAR(50) NOT NULL DEFAULT 'Cuộn',
  current_stock   NUMERIC(15, 2) NOT NULL DEFAULT 0,
  min_stock_alert NUMERIC(15, 2) NOT NULL DEFAULT 10,
  import_price    NUMERIC(15, 2) NOT NULL DEFAULT 0,
  selling_price   NUMERIC(15, 2) NOT NULL DEFAULT 0,
  specs           TEXT,
  location        VARCHAR(255),
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_updated    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Table: stock_in_receipts
CREATE TABLE IF NOT EXISTS stock_in_receipts (
  id           VARCHAR(100) PRIMARY KEY,
  receipt_code VARCHAR(100) UNIQUE NOT NULL,
  product_id   VARCHAR(100) NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  quantity     NUMERIC(15, 2) NOT NULL,
  unit         VARCHAR(50) NOT NULL,
  import_price NUMERIC(15, 2) NOT NULL,
  total_amount NUMERIC(15, 2) NOT NULL,
  batch_code   VARCHAR(100) NOT NULL,
  supplier     VARCHAR(255),
  notes        TEXT,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by   VARCHAR(255) NOT NULL DEFAULT 'Staff'
);

-- 12. Table: daily_production_logs
CREATE TABLE IF NOT EXISTS daily_production_logs (
  id                  VARCHAR(100) PRIMARY KEY,
  production_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  shift               VARCHAR(100) NOT NULL,
  machine_id          VARCHAR(100) NOT NULL,
  operator_name       VARCHAR(255) NOT NULL,
  product_id          VARCHAR(100) NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  product_name        VARCHAR(255) NOT NULL,
  produced_quantity   NUMERIC(15, 2) NOT NULL,
  waste_quantity      NUMERIC(15, 2) NOT NULL DEFAULT 0,
  unit                VARCHAR(50) NOT NULL,
  auto_added_to_stock BOOLEAN NOT NULL DEFAULT TRUE,
  notes               TEXT,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Table: inventory_transactions
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id              VARCHAR(100) PRIMARY KEY,
  type            VARCHAR(50) NOT NULL CHECK (type IN ('STOCK_IN', 'PRODUCTION_ADD', 'STOCK_OUT', 'ADJUSTMENT')),
  product_id      VARCHAR(100) NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  product_name    VARCHAR(255) NOT NULL,
  quantity_change NUMERIC(15, 2) NOT NULL,
  balance_after   NUMERIC(15, 2) NOT NULL,
  reference_code  VARCHAR(100) NOT NULL,
  notes           TEXT,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by      VARCHAR(255) NOT NULL DEFAULT 'Staff'
);

-- Create optimization indexes (IF NOT EXISTS to be idempotent)
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_print_status ON orders(print_status);
CREATE INDEX IF NOT EXISTS idx_print_jobs_status ON print_jobs(status);
CREATE INDEX IF NOT EXISTS idx_printer_logs_created_at ON printer_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_inventory_items_sku ON inventory_items(sku);
CREATE INDEX IF NOT EXISTS idx_stock_in_receipts_created ON stock_in_receipts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_production_date ON daily_production_logs(production_date DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_tx_created ON inventory_transactions(created_at DESC);
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
