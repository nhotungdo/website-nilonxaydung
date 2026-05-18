import 'dotenv/config'; // MUST be first to load environment variables!
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🔌 Testing PostgreSQL connection for "nilon-website" in shared "nilon-invoices" database...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  
  try {
    // Try a simple raw query first
    console.log('Executing simple query "SELECT NOW()"...');
    const timeResult = await prisma.$queryRaw`SELECT NOW() as now`;
    console.log('✅ Connection established successfully!');
    console.log('🕒 Postgres Server Time:', (timeResult as { now: Date }[])[0]?.now);
    
    // Try accessing a table to make sure the schema exists
    console.log('Counting rows in "Order" table...');
    const orderCount = await prisma.order.count();
    console.log(`✅ Table access successful! Total orders in DB: ${orderCount}`);
  } catch (error) {
    console.error('❌ Database connection test failed!');
    if (error instanceof Error) {
      console.error('Error Details:', error.message);
    } else {
      console.error('Error Details:', error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
