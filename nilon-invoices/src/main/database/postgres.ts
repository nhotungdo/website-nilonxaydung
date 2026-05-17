import pkg from 'pg';
const { Pool } = pkg;
import type { Pool as PgPool, QueryResult, PoolClient, QueryResultRow } from 'pg';
import { config } from '../utils/config';
import { logger } from '../utils/logger';

export class PostgresDatabase {
  private static instance: PostgresDatabase | null = null;
  private pool: PgPool | null = null;
  private isConnecting = false;

  private constructor() {}

  public static getInstance(): PostgresDatabase {
    if (!PostgresDatabase.instance) {
      PostgresDatabase.instance = new PostgresDatabase();
    }
    return PostgresDatabase.instance;
  }

  /**
   * Initializes and connects to the PostgreSQL Pool
   */
  public async connectDatabase(retries = 5, delayMs = 1000): Promise<void> {
    if (this.pool) return;
    if (this.isConnecting) return;

    this.isConnecting = true;
    logger.info(`[Postgres] Connecting to database at ${config.db.host}:${config.db.port}/${config.db.name}...`);

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.pool = new Pool({
          connectionString: config.db.url,
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000
        });

        // Test connection
        const client = await this.pool.connect();
        client.release();

        logger.info(`[Postgres] Database connected successfully on attempt ${attempt}.`);
        this.isConnecting = false;

        // Register pool error events
        this.pool.on('error', (err: any) => {
          logger.error(`[Postgres] Unexpected pool error: ${err.message}`, err.stack);
          this.handleDisconnect();
        });

        return;
      } catch (err: any) {
        logger.error(`[Postgres] Connection attempt ${attempt} failed: ${err.message}`);
        if (this.pool) {
          try {
            await this.pool.end();
          } catch {}
          this.pool = null;
        }

        if (attempt === retries) {
          this.isConnecting = false;
          throw new Error(`[Postgres] Max connection retries reached. Could not connect to database: ${err.message}`);
        }

        // Exponential backoff delay
        const backoffDelay = delayMs * Math.pow(2, attempt - 1);
        logger.warn(`[Postgres] Retrying connection in ${backoffDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      }
    }
  }

  /**
   * Handle unexpected pool disconnections
   */
  private async handleDisconnect() {
    this.pool = null;
    logger.warn('[Postgres] Connection lost. Re-initiating auto reconnect...');
    try {
      await this.connectDatabase();
    } catch (err: any) {
      logger.error(`[Postgres] Auto-reconnect failed: ${err.message}`);
    }
  }

  /**
   * Closes the database pool
   */
  public async closeDatabase(): Promise<void> {
    if (!this.pool) return;
    try {
      await this.pool.end();
      this.pool = null;
      logger.info('[Postgres] Database connection pool closed.');
    } catch (err: any) {
      logger.error(`[Postgres] Failed to close database: ${err.message}`, err.stack);
    }
  }

  /**
   * Test current connection status
   */
  public async testDatabaseConnection(): Promise<boolean> {
    if (!this.pool) return false;
    try {
      const client = await this.pool.connect();
      const res = await client.query('SELECT NOW()');
      client.release();
      return res.rowCount !== null && res.rowCount > 0;
    } catch (err: any) {
      logger.error(`[Postgres] Connection health check failed: ${err.message}`);
      return false;
    }
  }

  /**
   * Execute query with runtime metrics logging
   */
  public async executeQuery<T extends QueryResultRow = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    if (!this.pool) {
      await this.connectDatabase();
    }
    if (!this.pool) {
      throw new Error('[Postgres] Database pool not initialized.');
    }

    const startTime = Date.now();
    try {
      const result = await this.pool.query<T>(sql, params);
      const duration = Date.now() - startTime;
      logger.query(sql, duration);
      return result;
    } catch (err: any) {
      logger.error(`[Postgres] Query failed: "${sql}" | Error: ${err.message}`, err.stack);
      throw err;
    }
  }

  /**
   * Safe transaction wrapper with client lifecycle checks
   */
  public async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    if (!this.pool) {
      await this.connectDatabase();
    }
    if (!this.pool) {
      throw new Error('[Postgres] Database pool not initialized.');
    }

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      logger.query('BEGIN TRANSACTION');
      const result = await callback(client);
      await client.query('COMMIT');
      logger.query('COMMIT TRANSACTION');
      return result;
    } catch (err: any) {
      await client.query('ROLLBACK');
      logger.warn('[Postgres] Transaction rolled back due to error.');
      logger.error(`[Postgres] Transaction failure: ${err.message}`, err.stack);
      throw err;
    } finally {
      client.release();
    }
  }
}

export const db = PostgresDatabase.getInstance();
