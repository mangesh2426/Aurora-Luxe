import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const id = 'uploaded-8';
    console.log(`Trying to delete product with ID: ${id}`);
    const result = await prisma.product.delete({
      where: { id }
    });
    console.log('Product deleted successfully:', result);
  } catch (err) {
    console.error('Error deleting product:', err);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
