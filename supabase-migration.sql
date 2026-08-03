-- ================================================================
--  NILON XAY DUNG - Supabase Schema Migration
--  Project ID : wtezillfvsdkjfctrimi
--  CACH CHAY: https://supabase.com/dashboard/project/wtezillfvsdkjfctrimi/sql/new
-- ================================================================

-- BANG 1: users
CREATE TABLE IF NOT EXISTS users (
  id            VARCHAR(100) PRIMARY KEY,
  username      VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(512) NOT NULL,
  role          VARCHAR(50)  NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- BANG 2: customers
CREATE TABLE IF NOT EXISTS customers (
  id         VARCHAR(100) PRIMARY KEY,
  full_name  VARCHAR(255) NOT NULL,
  phone      VARCHAR(50)  UNIQUE NOT NULL,
  address    TEXT         NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- BANG 3: products
CREATE TABLE IF NOT EXISTS products (
  id         VARCHAR(100)   PRIMARY KEY,
  name       VARCHAR(255)   NOT NULL,
  sku        VARCHAR(100)   UNIQUE NOT NULL,
  price      NUMERIC(15, 2) NOT NULL,
  stock      INTEGER        NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- BANG 4: orders (Realtime enabled cho Flutter)
CREATE TABLE IF NOT EXISTS orders (
  id             VARCHAR(100)   PRIMARY KEY,
  order_code     VARCHAR(100)   UNIQUE NOT NULL,
  customer_id    VARCHAR(100)   NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  subtotal       NUMERIC(15, 2) NOT NULL,
  shipping_fee   NUMERIC(15, 2) NOT NULL DEFAULT 0,
  total          NUMERIC(15, 2) NOT NULL,
  payment_method VARCHAR(100)   NOT NULL,
  payment_status VARCHAR(100)   NOT NULL DEFAULT 'pending',
  order_status   VARCHAR(100)   NOT NULL DEFAULT 'pending',
  print_status   VARCHAR(100)   NOT NULL DEFAULT 'waiting',
  note           TEXT,
  invoice_pdf    VARCHAR(512),
  created_at     TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  printed_at     TIMESTAMPTZ,
  printed_by     VARCHAR(255)
);

-- BANG 5: order_items
CREATE TABLE IF NOT EXISTS order_items (
  id           VARCHAR(100)   PRIMARY KEY,
  order_id     VARCHAR(100)   NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
  product_id   VARCHAR(100)   NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_name VARCHAR(255)   NOT NULL,
  price        NUMERIC(15, 2) NOT NULL,
  quantity     INTEGER        NOT NULL,
  total        NUMERIC(15, 2) NOT NULL
);

-- BANG 6: printers
CREATE TABLE IF NOT EXISTS printers (
  id              VARCHAR(100) PRIMARY KEY,
  name            VARCHAR(255) UNIQUE NOT NULL,
  paper_size      VARCHAR(50)  NOT NULL CHECK (paper_size IN ('K58', 'K80')),
  connection_type VARCHAR(50)  NOT NULL CHECK (connection_type IN ('USB', 'LAN', 'WIFI')),
  ip_address      VARCHAR(100),
  is_default      BOOLEAN      NOT NULL DEFAULT FALSE,
  is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- BANG 7: print_jobs
CREATE TABLE IF NOT EXISTS print_jobs (
  id            VARCHAR(100) PRIMARY KEY,
  order_id      VARCHAR(100) NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
  printer_id    VARCHAR(100) NOT NULL REFERENCES printers(id) ON DELETE CASCADE,
  pdf_path      VARCHAR(512) NOT NULL,
  status        VARCHAR(50)  NOT NULL DEFAULT 'WAITING' CHECK (status IN ('WAITING', 'PRINTING', 'COMPLETED', 'FAILED')),
  retry_count   INTEGER      NOT NULL DEFAULT 0,
  error_message TEXT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  printed_at    TIMESTAMPTZ
);

-- BANG 8: failed_jobs
CREATE TABLE IF NOT EXISTS failed_jobs (
  id             VARCHAR(100) PRIMARY KEY,
  print_job_id   VARCHAR(100) UNIQUE NOT NULL REFERENCES print_jobs(id) ON DELETE CASCADE,
  error_code     VARCHAR(100) NOT NULL,
  error_message  TEXT         NOT NULL,
  stack_trace    TEXT,
  retry_attempts INTEGER      NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- BANG 9: app_settings (singleton id=1)
CREATE TABLE IF NOT EXISTS app_settings (
  id                 INTEGER      PRIMARY KEY,
  api_url            VARCHAR(255) NOT NULL,
  socket_url         VARCHAR(255) NOT NULL,
  api_token          VARCHAR(512) NOT NULL,
  auto_startup       BOOLEAN      NOT NULL DEFAULT FALSE,
  notification_sound BOOLEAN      NOT NULL DEFAULT TRUE,
  dark_mode          BOOLEAN      NOT NULL DEFAULT TRUE
);

-- BANG 10: printer_logs
CREATE TABLE IF NOT EXISTS printer_logs (
  id         SERIAL       PRIMARY KEY,
  printer_id VARCHAR(100) REFERENCES printers(id) ON DELETE SET NULL,
  log_level  VARCHAR(50)  NOT NULL CHECK (log_level IN ('INFO', 'WARN', 'ERROR')),
  message    TEXT         NOT NULL,
  metadata   TEXT,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_orders_created_at    ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_print_status  ON orders(print_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_status  ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id   ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_print_jobs_status    ON print_jobs(status);
CREATE INDEX IF NOT EXISTS idx_print_jobs_order_id  ON print_jobs(order_id);
CREATE INDEX IF NOT EXISTS idx_printer_logs_created ON printer_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customers_phone      ON customers(phone);

-- ROW LEVEL SECURITY - Bat RLS va phan quyen full policy (Xoa 14 Supabase Lint Errors)
ALTER TABLE users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE products        ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE printers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE print_jobs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE failed_jobs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE printer_logs    ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "policy_users_all" ON users;
CREATE POLICY "policy_users_all" ON users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "policy_customers_all" ON customers;
CREATE POLICY "policy_customers_all" ON customers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "policy_products_all" ON products;
CREATE POLICY "policy_products_all" ON products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "policy_orders_all" ON orders;
CREATE POLICY "policy_orders_all" ON orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "policy_order_items_all" ON order_items;
CREATE POLICY "policy_order_items_all" ON order_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "policy_printers_all" ON printers;
CREATE POLICY "policy_printers_all" ON printers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "policy_print_jobs_all" ON print_jobs;
CREATE POLICY "policy_print_jobs_all" ON print_jobs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "policy_failed_jobs_all" ON failed_jobs;
CREATE POLICY "policy_failed_jobs_all" ON failed_jobs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "policy_app_settings_all" ON app_settings;
CREATE POLICY "policy_app_settings_all" ON app_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "policy_printer_logs_all" ON printer_logs;
CREATE POLICY "policy_printer_logs_all" ON printer_logs FOR ALL USING (true) WITH CHECK (true);


-- REALTIME cho orders (Flutter app)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  END IF;
END $$;


-- BANG 11: inventory_items
CREATE TABLE IF NOT EXISTS inventory_items (
  id              VARCHAR(100)   PRIMARY KEY,
  sku             VARCHAR(100)   UNIQUE NOT NULL,
  name            VARCHAR(255)   NOT NULL,
  category        VARCHAR(100)   NOT NULL,
  unit            VARCHAR(50)    NOT NULL DEFAULT 'Cuộn',
  current_stock   NUMERIC(15, 2) NOT NULL DEFAULT 0,
  min_stock_alert NUMERIC(15, 2) NOT NULL DEFAULT 10,
  import_price    NUMERIC(15, 2) NOT NULL DEFAULT 0,
  selling_price   NUMERIC(15, 2) NOT NULL DEFAULT 0,
  specs           TEXT,
  location        VARCHAR(255),
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_updated    TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- BANG 12: stock_in_receipts
CREATE TABLE IF NOT EXISTS stock_in_receipts (
  id           VARCHAR(100)   PRIMARY KEY,
  receipt_code VARCHAR(100)   UNIQUE NOT NULL,
  product_id   VARCHAR(100)   NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  product_name VARCHAR(255)   NOT NULL,
  quantity     NUMERIC(15, 2) NOT NULL,
  unit         VARCHAR(50)    NOT NULL,
  import_price NUMERIC(15, 2) NOT NULL,
  total_amount NUMERIC(15, 2) NOT NULL,
  batch_code   VARCHAR(100)   NOT NULL,
  supplier     VARCHAR(255),
  notes        TEXT,
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by   VARCHAR(255)   NOT NULL DEFAULT 'Staff'
);

-- BANG 13: daily_production_logs
CREATE TABLE IF NOT EXISTS daily_production_logs (
  id                  VARCHAR(100)   PRIMARY KEY,
  production_date     DATE           NOT NULL DEFAULT CURRENT_DATE,
  shift               VARCHAR(100)   NOT NULL,
  machine_id          VARCHAR(100)   NOT NULL,
  operator_name       VARCHAR(255)   NOT NULL,
  product_id          VARCHAR(100)   NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  product_name        VARCHAR(255)   NOT NULL,
  produced_quantity   NUMERIC(15, 2) NOT NULL,
  waste_quantity      NUMERIC(15, 2) NOT NULL DEFAULT 0,
  unit                VARCHAR(50)    NOT NULL,
  auto_added_to_stock BOOLEAN        NOT NULL DEFAULT TRUE,
  notes               TEXT,
  created_at          TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- BANG 14: inventory_transactions
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id              VARCHAR(100)   PRIMARY KEY,
  type            VARCHAR(50)    NOT NULL CHECK (type IN ('STOCK_IN', 'PRODUCTION_ADD', 'STOCK_OUT', 'ADJUSTMENT')),
  product_id      VARCHAR(100)   NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  product_name    VARCHAR(255)   NOT NULL,
  quantity_change NUMERIC(15, 2) NOT NULL,
  balance_after   NUMERIC(15, 2) NOT NULL,
  reference_code  VARCHAR(100)   NOT NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by      VARCHAR(255)   NOT NULL DEFAULT 'Staff'
);

-- INDEXES INVENTORY
CREATE INDEX IF NOT EXISTS idx_inventory_items_sku       ON inventory_items(sku);
CREATE INDEX IF NOT EXISTS idx_stock_in_receipts_created ON stock_in_receipts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_production_date    ON daily_production_logs(production_date DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_tx_created      ON inventory_transactions(created_at DESC);

-- ROW LEVEL SECURITY FOR INVENTORY (ENABLE RLS & POLICIES TO FIX LINT ERRORS)
ALTER TABLE inventory_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_in_receipts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_production_logs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "policy_inventory_items_all" ON inventory_items;
CREATE POLICY "policy_inventory_items_all" ON inventory_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "policy_stock_in_receipts_all" ON stock_in_receipts;
CREATE POLICY "policy_stock_in_receipts_all" ON stock_in_receipts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "policy_daily_production_logs_all" ON daily_production_logs;
CREATE POLICY "policy_daily_production_logs_all" ON daily_production_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "policy_inventory_transactions_all" ON inventory_transactions;
CREATE POLICY "policy_inventory_transactions_all" ON inventory_transactions FOR ALL USING (true) WITH CHECK (true);


-- SEED DATA
INSERT INTO users (id, username, password_hash, role, is_active)
VALUES ('USR-ADMIN-01', 'Admin', '123456', 'admin', TRUE)
ON CONFLICT (username) DO NOTHING;

INSERT INTO app_settings (id, api_url, socket_url, api_token, auto_startup, notification_sound, dark_mode)
VALUES (1, 'http://localhost:3000', 'http://localhost:3000', 'nilon_sec_auth_key_2026', FALSE, TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET api_url = EXCLUDED.api_url, socket_url = EXCLUDED.socket_url, api_token = EXCLUDED.api_token;

INSERT INTO printers (id, name, paper_size, connection_type, ip_address, is_default, is_active) VALUES
  ('PRN-01', 'Thermal Cashier K80-A',       'K80', 'USB',  NULL,            TRUE,  TRUE),
  ('PRN-02', 'Thermal Helper K58',           'K58', 'USB',  NULL,            FALSE, TRUE),
  ('PRN-03', 'Warehouse Delivery K80-B',     'K80', 'LAN',  '192.168.1.200', FALSE, TRUE),
  ('PRN-04', 'Administrative Invoice XP-80', 'K80', 'LAN',  '192.168.1.201', FALSE, TRUE),
  ('PRN-05', 'Auxiliary Backup XP-58',       'K58', 'WIFI', '192.168.1.202', FALSE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- SEED DATA INVENTORY
INSERT INTO inventory_items (id, sku, name, category, unit, current_stock, min_stock_alert, import_price, selling_price, specs, location) VALUES
  ('PROD-001', 'PE-LOT-005', 'Nilon Lót Sàn PE Trắng Trẻo 0.05mm', 'Nilon Lót Sàn PE', 'Cuộn', 145, 30, 320000, 450000, 'Khổ 2m x 400m x 0.05mm', 'Kho A - Kệ 01'),
  ('PROD-002', 'PE-LOT-010', 'Nilon Lót Sàn PE Trắng Đục 0.10mm',  'Nilon Lót Sàn PE', 'Cuộn', 82,  25, 580000, 780000, 'Khổ 2m x 200m x 0.10mm', 'Kho A - Kệ 02'),
  ('PROD-003', 'PE-DEN-008', 'Nilon Đen Che Phủ Công Trình 0.08mm', 'Nilon Đen Công Trình', 'Cuộn', 18, 20, 410000, 590000, 'Khổ 2m x 300m (Tái sinh)', 'Kho B - Kệ 01'),
  ('PROD-004', 'BAT-SOC-3M', 'Bạt Sọc 3 Màu Che Nắng Mưa Khổ 4m',  'Bạt Dứa / Bạt Sọc',   'Cuộn', 64, 15, 850000, 1150000, 'Khổ 4m x 50m (Bạt dứa 3 sọc)', 'Kho B - Kệ 04')
ON CONFLICT (id) DO NOTHING;

-- KIEM TRA - Xem ket qua
SELECT table_name AS "Ten bang", 'OK' AS "Trang thai"
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  AND table_name IN ('users','customers','products','orders','order_items','printers','print_jobs','failed_jobs','app_settings','printer_logs','inventory_items','stock_in_receipts','daily_production_logs','inventory_transactions')
ORDER BY table_name;

