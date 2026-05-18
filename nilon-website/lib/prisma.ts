import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in environment variables');
  }

  // Parse the schema parameter from the connection string if present
  let schema = 'public';
  try {
    const url = new URL(connectionString);
    const schemaParam = url.searchParams.get('schema');
    if (schemaParam) {
      schema = schemaParam;
    }
  } catch {
    // If URL parsing fails, default to public and let pg handle the connection error
  }

  const pool = new Pool({
    connectionString,
    // Set the search path to our custom schema upon every physical connection
    onConnect: async (client) => {
      await client.query(`SET search_path TO "${schema}", public`);
    },
  });

  const adapter = new PrismaPg(pool);
  const prismaClient = new PrismaClient({
    adapter,
    log: ['query'],
  });

  // Verify connection at startup
  prismaClient.$queryRaw`SELECT 1`.then(() => {
    console.log('[DB] Connected to nilon-invoices');
  }).catch((err) => {
    console.error('[DB] Connection to nilon-invoices failed:', err);
  });

  return prismaClient;
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;


