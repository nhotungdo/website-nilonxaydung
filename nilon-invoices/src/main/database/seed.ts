import { db } from './postgres';
import { logger } from '../utils/logger';

export const runSeeds = async (): Promise<void> => {
  logger.info('[Seeder] Initializing PostgreSQL database with system configurations...');

  try {
    await db.connectDatabase();

    await db.transaction(async (client) => {
      // 1. Seed App Settings (id = 1)
      logger.info('[Seeder] Initializing system configurations app_settings...');
      await client.query(`
        INSERT INTO app_settings (id, api_url, socket_url, api_token, auto_startup, notification_sound, dark_mode)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          api_url = EXCLUDED.api_url,
          socket_url = EXCLUDED.socket_url,
          api_token = EXCLUDED.api_token,
          auto_startup = EXCLUDED.auto_startup,
          notification_sound = EXCLUDED.notification_sound,
          dark_mode = EXCLUDED.dark_mode;
      `, [
        1,
        'http://localhost:3000',
        'http://localhost:3000',
        'nilon_sec_auth_key_2026',
        false,
        true,
        true
      ]);

      // 1b. Seed Users (Admin)
      logger.info('[Seeder] Initializing admin user registry...');
      await client.query(`
        INSERT INTO users (id, username, password_hash, role, is_active)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (username) DO UPDATE SET
          password_hash = EXCLUDED.password_hash,
          role = EXCLUDED.role,
          is_active = EXCLUDED.is_active;
      `, [
        'USR-ADMIN-01',
        'Admin',
        '123456',
        'admin',
        true
      ]);
    });

    logger.info('[Seeder] Database initialized successfully without mock data.');
  } catch (err: any) {
    logger.error(`[Seeder] Initialization failed: ${err.message}`, err.stack);
    throw err;
  }
};

// If executing directly from terminal (e.g. ts-node src/main/database/seed.ts)
if (require.main === module) {
  runSeeds()
    .then(() => {
      logger.info('[Seeder] Seeder CLI command finished.');
      process.exit(0);
    })
    .catch((err) => {
      logger.error('[Seeder] CLI Execution failed.', err.stack);
      process.exit(1);
    });
}
