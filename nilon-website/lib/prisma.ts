import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in environment variables');
  }

  // Supabase uses pgbouncer (Transaction Pooler) — disable prepared statements
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // Required for Supabase SSL connection
    },
    max: 1, // Serverless: limit pool size when using pgbouncer
  });

  const adapter = new PrismaPg(pool);
  const prismaClient = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

  // Verify connection at startup
  prismaClient.$queryRaw`SELECT 1`.then(() => {
    console.log('[DB] ✅ Connected to Supabase PostgreSQL (nilon-invoices)');
  }).catch((err) => {
    console.error('[DB] ❌ Connection to Supabase failed:', err.message);
  });

  return prismaClient;
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
