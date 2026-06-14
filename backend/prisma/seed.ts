import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@auroraluxe.com' },
    update: {},
    create: {
      email: 'admin@auroraluxe.com',
      password: adminPassword,
      firstName: 'Aurora',
      lastName: 'Admin',
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // Create Categories
  const categoryNecklaces = await prisma.category.upsert({
    where: { slug: 'necklaces' },
    update: {},
    create: { name: 'Necklaces', slug: 'necklaces' },
  });
  const categoryRings = await prisma.category.upsert({
    where: { slug: 'rings' },
    update: {},
    create: { name: 'Rings', slug: 'rings' },
  });
  const categoryEarrings = await prisma.category.upsert({
    where: { slug: 'earrings' },
    update: {},
    create: { name: 'Earrings', slug: 'earrings' },
  });
  const categoryBracelets = await prisma.category.upsert({
    where: { slug: 'bracelets' },
    update: {},
    create: { name: 'Bracelets', slug: 'bracelets' },
  });
  console.log('Categories created.');

  // Create Products
  const products = [
    {
      name: 'Lumina Diamond Pendant',
      slug: 'lumina-diamond-pendant',
      description: '18k Solid Gold',
      price: 1250,
      stock: 50,
      images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuC74g7OJQozNMMLTvP_T3MTpMjMYmMuIRkNSk-IB0te_PxRvQ8RhBD3NDsHwKlGEOEBzRXBjU1YoagvX4Ujnf_3L2qgLKIS-TDRAr7S7-eWTY7BizcynZN4eEC7BK5HPIAqnq3WIsoaSQHPnvedgtchy0IDDntX6xaPxdCFWO8EOqPscwXVpR1VBCLTeXtbjt8XQaJXVPHx3LKNqoYmU6iuBH5Sug2nYE67BTE7hblAWIs7LA03giKwyDXqteJYZRcW_Bhe0YlFK_c'],
      categoryId: categoryNecklaces.id,
      isNew: true,
      isBestSeller: false,
    },
    {
      name: 'Eternity Band',
      slug: 'eternity-band',
      description: '18k Solid Gold',
      price: 920,
      stock: 100,
      images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBMSEn5M-kqjnfBe6p3P8Ro25F6VGMPu1GWmuVqIVl_JPMd2a7Z68bxY8zySw27Zx_sMXueziaJMbwfHBb98K45KbeElTVnZZI5gsCsTbbntA8WyAvmUen290EGizZwR0Vmqy275zvNjM7k6lAFZnqA1kRA_Mh5qQSf1LNnYBZ_6vJKufe742YAKYRwp6Ql8c64fQkhmO4EFVW0VpwDZUQmUZjjI4fUnnX40sU3U9H_zo20Cr1HWFWszcbYNJav1t1g9FjJNvHs6VQ'],
      categoryId: categoryRings.id,
      isNew: false,
      isBestSeller: true,
    },
  ];

  for (const product of products) {
    const { images, isNew, ...rest } = product;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...rest,
        isNewArrival: isNew,
        images: {
          create: images.map(url => ({ url })),
        },
      },
    });
  }
  console.log('Products created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
