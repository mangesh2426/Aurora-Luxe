import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const products = await prisma.product.findMany({
    include: {
      _count: {
        select: {
          cartItems: true,
          orderItems: true,
          wishlistItems: true,
          images: true,
        }
      }
    }
  });
  console.log('--- PRODUCT RELATIONSHIPS ---');
  console.log(products.map(p => ({
    id: p.id,
    name: p.name,
    cartItems: p._count.cartItems,
    orderItems: p._count.orderItems,
    wishlistItems: p._count.wishlistItems,
    images: p._count.images,
  })));
}

main()
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
