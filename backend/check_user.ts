import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany();
  console.log('--- ALL USERS ---');
  console.log(users.map(u => ({ id: u.id, email: u.email, role: u.role })));
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
