import 'dotenv/config';
import { Pool } from 'pg';

const SCHEMA_SQL = `
-- Create Order table with String status instead of enum to avoid db conflicts
CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT NOT NULL,
    "orderCode" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- Create OrderItem table
CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- Create PrintQueue table
CREATE TABLE IF NOT EXISTS "PrintQueue" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrintQueue_pkey" PRIMARY KEY ("id")
);

-- Create indexes safely
CREATE UNIQUE INDEX IF NOT EXISTS "Order_orderCode_key" ON "Order"("orderCode");
CREATE UNIQUE INDEX IF NOT EXISTS "PrintQueue_orderId_key" ON "PrintQueue"("orderId");

-- Check and link foreign keys safely
ALTER TABLE "OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_orderId_fkey";
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PrintQueue" DROP CONSTRAINT IF EXISTS "PrintQueue_orderId_fkey";
ALTER TABLE "PrintQueue" ADD CONSTRAINT "PrintQueue_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
`;

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('❌ DATABASE_URL is not defined in .env');
    process.exit(1);
  }

  console.log(`🔌 Connecting to shared database to deploy website tables:`);
  console.log(`DATABASE_URL: ${url}`);
  
  const pool = new Pool({ connectionString: url });
  
  try {
    console.log('⚡ Running schema deployment statements...');
    await pool.query(SCHEMA_SQL);
    console.log('✅ Website tables ("Order", "OrderItem", "PrintQueue") deployed/verified successfully!');
  } catch (error) {
    console.error('❌ Failed to deploy website tables.');
    if (error instanceof Error) {
      console.error('Error Details:', error.message);
    } else {
      console.error('Error Details:', error);
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
