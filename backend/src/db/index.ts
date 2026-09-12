import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool, PoolClient } from 'pg';
import { PGlite } from '@electric-sql/pglite';
import { config } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

export interface DbClient {
  query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>>;
}

class DatabaseManager {
  private pool: Pool | null = null;
  private pglite: PGlite | null = null;
  private isInitialized = false;

  async init(): Promise<void> {
    if (this.isInitialized) return;

    if (config.databaseUrl) {
      console.log('[DB] Connecting to PostgreSQL via DATABASE_URL...');
      this.pool = new Pool({
        connectionString: config.databaseUrl,
        ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : undefined,
      });
      await this.pool.query('SELECT 1');
      console.log('[DB] Connected successfully to remote PostgreSQL.');
    } else {
      console.log('[DB] DATABASE_URL not specified. Initializing embedded PostgreSQL (PGlite)...');
      const isTest = process.env.NODE_ENV === 'test';
      if (isTest) {
        this.pglite = new PGlite();
        await this.pglite.waitReady;
        console.log('[DB] Embedded PostgreSQL ready in in-memory test mode.');
      } else {
        const dataDir = config.pgliteDir;
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        } else {
          // Clean stale lock files from unexpected termination
          const pidFile = path.join(dataDir, 'postmaster.pid');
          if (fs.existsSync(pidFile)) {
            try { fs.unlinkSync(pidFile); } catch (e) {}
          }
          const sockLock = path.join(dataDir, '.s.PGSQL.5432.lock.out');
          if (fs.existsSync(sockLock)) {
            try { fs.unlinkSync(sockLock); } catch (e) {}
          }
        }
        try {
          this.pglite = new PGlite(dataDir);
          await this.pglite.waitReady;
        } catch (initErr) {
          console.warn('[DB] Persistent storage recovery required, reinitializing clean store...');
          try {
            fs.rmSync(dataDir, { recursive: true, force: true });
            fs.mkdirSync(dataDir, { recursive: true });
          } catch (e) {}
          this.pglite = new PGlite(dataDir);
          await this.pglite.waitReady;
        }
        console.log(`[DB] Embedded PostgreSQL ready. Persistent storage at: ${dataDir}`);
      }
    }

    await this.applySchema();
    this.isInitialized = true;
  }

  private async applySchema(): Promise<void> {
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.warn(`[DB] schema.sql not found at ${schemaPath}`);
      return;
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    if (this.pool) {
      await this.pool.query(schemaSql);
    } else if (this.pglite) {
      await this.pglite.exec(schemaSql);
    }
    console.log('[DB] Schema and indexes successfully synchronized.');
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    await this.init();

    if (this.pool) {
      const res = await this.pool.query(sql, params);
      return {
        rows: res.rows as T[],
        rowCount: res.rowCount ?? res.rows.length,
      };
    } else if (this.pglite) {
      const res = await this.pglite.query(sql, params);
      return {
        rows: (res.rows || []) as T[],
        rowCount: res.rows ? res.rows.length : 0,
      };
    }
    throw new Error('Database driver not initialized');
  }

  async withTransaction<T>(
    callback: (client: DbClient) => Promise<T>
  ): Promise<T> {
    await this.init();

    if (this.pool) {
      const client: PoolClient = await this.pool.connect();
      try {
        await client.query('BEGIN');
        const txClient: DbClient = {
          query: async <R = any>(sql: string, params: any[] = []) => {
            const res = await client.query(sql, params);
            return {
              rows: res.rows as R[],
              rowCount: res.rowCount ?? res.rows.length,
            };
          },
        };
        const result = await callback(txClient);
        await client.query('COMMIT');
        return result;
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } else if (this.pglite) {
      return await this.pglite.transaction(async (tx) => {
        const txClient: DbClient = {
          query: async <R = any>(sql: string, params: any[] = []) => {
            const res = await tx.query(sql, params);
            return {
              rows: (res.rows || []) as R[],
              rowCount: res.rows ? res.rows.length : 0,
            };
          },
        };
        return await callback(txClient);
      });
    }

    throw new Error('Database driver not initialized for transaction');
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
    if (this.pglite) {
      await this.pglite.close();
      this.pglite = null;
    }
    this.isInitialized = false;
  }
}

export const db = new DatabaseManager();
