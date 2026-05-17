import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';

// Determine database path. During dev, place inside project root. In production, place in userData path.
const getDatabasePath = (): string => {
  const isDev = process.env.NODE_ENV !== 'production';
  let storageDir = '';
  
  if (isDev) {
    storageDir = path.resolve(__dirname, '../../../storage');
  } else {
    // Write inside user application data directories to guarantee access permissions on Windows
    storageDir = path.join(app.getPath('userData'), 'storage');
  }

  // Ensure directories are properly setup
  const dirs = [
    storageDir,
    path.join(storageDir, 'sqlite'),
    path.join(storageDir, 'pdf'),
    path.join(storageDir, 'logs'),
    path.join(storageDir, 'cache'),
    path.join(storageDir, 'temp')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  return path.join(storageDir, 'sqlite', 'nilon.db');
};

const dbPath = getDatabasePath();
export const db = new Database(dbPath, { verbose: console.log });

// Enable foreign key support in SQLite
db.pragma('foreign_keys = ON');

export const initDatabase = () => {
  console.log(`[Database] Initializing local cache SQLite DB at: ${dbPath}`);
  
  // Create tables transactionally
  db.transaction(() => {
    // 1. Printers Table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS printers (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        connection_type TEXT NOT NULL CHECK(connection_type IN ('USB', 'LAN', 'WIFI')),
        ip_address TEXT,
        port INTEGER,
        paper_size TEXT NOT NULL CHECK(paper_size IN ('K58', 'K80')),
        is_default INTEGER DEFAULT 0 CHECK(is_default IN (0, 1)),
        status TEXT NOT NULL CHECK(status IN ('ONLINE', 'OFFLINE', 'ERROR')) DEFAULT 'OFFLINE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // 2. Print Jobs Table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS print_jobs (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        printer_id TEXT NOT NULL,
        pdf_path TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('PENDING', 'PRINTING', 'SUCCESS', 'FAILED')) DEFAULT 'PENDING',
        retry_count INTEGER DEFAULT 0,
        max_retries INTEGER DEFAULT 3,
        error_message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        printed_at DATETIME,
        FOREIGN KEY (printer_id) REFERENCES printers(id) ON DELETE CASCADE
      )
    `).run();

    // 3. Failed Jobs Table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS failed_jobs (
        id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        error_type TEXT NOT NULL,
        error_message TEXT NOT NULL,
        failed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        resolved INTEGER DEFAULT 0 CHECK(resolved IN (0, 1)),
        FOREIGN KEY (job_id) REFERENCES print_jobs(id) ON DELETE CASCADE
      )
    `).run();

    // 4. Offline Orders Table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS offline_orders (
        id TEXT PRIMARY KEY,
        order_data TEXT NOT NULL, -- JSON string representation
        sync_status TEXT NOT NULL CHECK(sync_status IN ('PENDING', 'FAILED', 'SYNCED')) DEFAULT 'PENDING',
        retry_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // 5. App Settings Table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS app_settings (
        setting_key TEXT PRIMARY KEY,
        setting_value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // 6. Printer System Logs Table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS printer_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        level TEXT NOT NULL CHECK(level IN ('INFO', 'WARN', 'ERROR')),
        printer_id TEXT,
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
  })();

  // Seed default settings if empty
  const hasSettings = db.prepare('SELECT count(*) as count FROM app_settings').get() as { count: number };
  if (hasSettings.count === 0) {
    console.log('[Database] Seeding default settings...');
    db.transaction(() => {
      const stmt = db.prepare('INSERT OR IGNORE INTO app_settings (setting_key, setting_value) VALUES (?, ?)');
      stmt.run('api_url', 'http://localhost:3000');
      stmt.run('branch_id', 'branch_hanoi_01');
      stmt.run('api_key', 'nilon_sec_auth_key_2026');
      stmt.run('auto_print', 'true');
      stmt.run('sound_alert', 'true');
      stmt.run('run_on_startup', 'false');
      stmt.run('is_online', 'true');
    })();
  }

  // Seed a default Virtual Printer for debugging if no printer exists
  const hasPrinters = db.prepare('SELECT count(*) as count FROM printers').get() as { count: number };
  if (hasPrinters.count === 0) {
    console.log('[Database] Seeding default virtual printer...');
    db.prepare(`
      INSERT INTO printers (id, name, connection_type, paper_size, is_default, status) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('default_thermal_id', 'Xprinter XP-80C (Default)', 'USB', 'K80', 1, 'ONLINE');
  }
};

export default db;
