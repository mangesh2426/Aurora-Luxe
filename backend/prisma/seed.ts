import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
  const categories = [
    { name: 'Necklaces', slug: 'necklaces' },
    { name: 'Earrings', slug: 'earrings' },
    { name: 'Rings', slug: 'rings' },
    { name: 'Bracelets', slug: 'bracelets' },
    { name: 'Combos & Sets', slug: 'combos' },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    // Store mapping from frontend category name to backend ID
    // We map 'Combos' (from frontend) to the 'Combos & Sets' ID
    categoryMap[cat.name === 'Combos & Sets' ? 'Combos' : cat.name] = createdCat.id;
  }
  console.log('Categories created.');

  // Create Products
  const products = [
    {
      id: "lumina-diamond-pendant",
      name: "Lumina Diamond Pendant",
      slug: "lumina-diamond-pendant",
      description: "18k Solid Gold Celestial Starburst Pendant",
      category: "Necklaces",
      price: 1250,
      originalPrice: 1450,
      discountPercent: 14,
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC74g7OJQozNMMLTvP_T3MTpMjMYmMuIRkNSk-IB0te_PxRvQ8RhBD3NDsHwKlGEOEBzRXBjU1YoagvX4Ujnf_3L2qgLKIS-TDRAr7S7-eWTY7BizcynZN4eEC7BK5HPIAqnq3WIsoaSQHPnvedgtchy0IDDntX6xaPxdCFWO8EOqPscwXVpR1VBCLTeXtbjt8XQaJXVPHx3LKNqoYmU6iuBH5Sug2nYE67BTE7hblAWIs7LA03giKwyDXqteJYZRcW_Bhe0YlFK_c",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAW7DUdZXqbvbzHwRxEoCJMJA2FdKH4A-MhmXGtJ-ho0a_Jn2r3IEOuYmIE0_BH0L01klj2V7xPl8sc0sqIELnHNfar9RKaQ0a2VhBPdXjOBduPoOoi4jlEIgy8tk0DJyUlnh_v205MORjVC5eCFrMw0YZkL_tFn2HE6ILjz896ubZoJSoqETLkAy8DYBI5QMLtHKK-jJ2GfgSDGpHF0BHAzh4Q3GwVTNNOU9wVY514yJchHu0WVOtcfP5_SZyaxBwnTuSsXiTZt8A",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC10nlvVy452Zo8A_ZRNplwyb3iiY1J74pmTJBCVW4OgmDGQ1gtr-wpDApvhXtLNrw6TrGKyXV5dF8Ph0sPwkfTo0-fhZKsfiExm1BL4_7W8GoSgLOuFFKtvO9T3tYZcUVgNwqoBF__iC4tmH1ZjsqvpmTdgqmpcMu3PtHfPnGOqTKHHJHn3yFrQXKdqlW08u8VEc20B-jbKBaie6TH3iB8bRom_Wr842-btdLNdlG8hhdI7RgaP7F7m7fxsBVe7Z-glmbFLTeIRgU"
      ],
      finishes: ["Champagne Gold", "Rose Gold"],
      materials: ["18k Solid Gold", "14k Solid Gold"],
      inStock: true,
      stock: 50,
      rating: 4.8,
      reviewsCount: 124,
      isNewArrival: true,
      isBestSeller: true,
      careInstructions: "Crafted with 18k solid gold. Highly resistant to water, perfume, and oxidation. Clean gently using warm water, a mild soap solution, and our provided microfiber polishing cloth.",
      shippingInfo: "Complimentary express delivery tracking. Ships in 2-3 business days with signature required upon receipt."
    },
    {
      id: "baroque-pearl-drops",
      name: "Baroque Pearl Drops",
      slug: "baroque-pearl-drops",
      description: "Lustrous Freshwater Pearl Drop Earrings",
      category: "Earrings",
      price: 850,
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAb0rwjslXLOE36_JNe51leiUOT_JUC9KKkEu1Dekcn_WJFNUguVH7-SY7XJm3UvCamWmM_NDr82LxEJ6LfJuFk9ZtPaGb_6RPyue6U2_7svWCtWf5Ke1mj3_30WXTlw3GPNTq8rYlPTHzcAq0gD-g177glNz10rT6R9DSW84L5ZHjdGfxQ8bkBYN9ydBjnB7r4ZUUvoSxuZ-VcYO2LJk-fbmWtQ9vbq47TXdx3rS-PL_CdjcNf551ymhgUU0msxEfNvIPM-lLFZO0",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCK1TwNyTn_XATE1SJJcFG2Y1JYeP4kkI4GRB63eviUOEXRHQsNrYTsQVnz1ZU847xopkYX3OASlqKLvzSEd1vL-HWJgY-gBTf4N2TsH15zW8me07uk1o84dNCOoZdx4wKnBhOa3vH6G_GyzanT8ZggABDyz8xHPU-5nfX8k1IzWroaydux7Ak8H8jOvLrlKr-lqj6ROYRtuSsvrBxFq95DV4wDKOVsRDLiDHh1uMs3GHpInLx6IXYfUYjRwNu1FXbrtRIjhOSyi4g"
      ],
      finishes: ["Champagne Gold", "Silver"],
      materials: ["14k Solid Gold", "Sterling Silver"],
      inStock: true,
      stock: 30,
      rating: 4.9,
      reviewsCount: 88,
      isNewArrival: false,
      isBestSeller: true,
      careInstructions: "Baroque pearls are organic gemstones. Protect them from hairspray, perfume, and direct cosmetics. Wipe gently with a soft cloth after each wear.",
      shippingInfo: "Delivered in our signature suede gift box. Complimentary shipping."
    },
    {
      id: "eternity-band",
      name: "Eternity Band",
      slug: "eternity-band",
      description: "Classic Stackable Diamond Eternity Ring",
      category: "Rings",
      price: 920,
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBMSEn5M-kqjnfBe6p3P8Ro25F6VGMPu1GWmuVqIVl_JPMd2a7Z68bxY8zySw27Zx_sMXueziaJMbwfHBb98K45KbeElTVnZZI5gsCsTbbntA8WyAvmUen290EGizZwR0Vmqy275zvNjM7k6lAFZnqA1kRA_Mh5qQSf1LNnYBZ_6vJKufe742YAKYRwp6Ql8c64fQkhmO4EFVW0VpwDZUQmUZjjI4fUnnX40sU3U9H_zo20Cr1HWFWszcbYNJav1t1g9FjJNvHs6VQ"
      ],
      finishes: ["Champagne Gold", "Rose Gold", "Silver"],
      materials: ["18k Solid Gold", "14k Solid Gold", "Sterling Silver"],
      inStock: true,
      stock: 100,
      rating: 4.7,
      reviewsCount: 145,
      isNewArrival: false,
      isBestSeller: true,
      careInstructions: "Features continuous diamond setting. Clean diamond facets by brushing gently with a soft toothbrush in warm soapy water. Dry carefully.",
      shippingInfo: "Requires sizing verification. Standard 2-5 days complimentary delivery."
    },
    {
      id: "sapphire-tennis-bracelet",
      name: "Sapphire Tennis Bracelet",
      slug: "sapphire-tennis-bracelet",
      description: "Deep Blue Sapphire Set Bracelet",
      category: "Bracelets",
      price: 3100,
      originalPrice: 3500,
      discountPercent: 11,
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCoItK309c0XOW0nfETlr_w2jDp4QR0RQBk-MEM0hGQ4U5u94oEJNsHZ5hiGOm82eWklmAlRLZBeJf50Sfv0jOUfiWz6K5Ml53eyjHruwJUZwCgV6UjNIq35b85dAP09UxVJjjzdNcq4X91hLK-xXF00LWSVah5lfiIbgzfDga55ISAjcRrlLrgD6mgSDPrvsjnBTCwoOdKwX12MSYLgrmKepPt0eBPK0MixLMC7lcb6ggPFU2xRvYpRyP5YFhVMkumkChECe8B0ng"
      ],
      finishes: ["Silver", "Champagne Gold"],
      materials: ["14k Solid Gold", "Sterling Silver"],
      inStock: true,
      stock: 15,
      rating: 5.0,
      reviewsCount: 52,
      isNewArrival: false,
      isBestSeller: false,
      careInstructions: "Features heavy clasp mechanism. Double check safety locks. Wipe chain links regularly with polishing cloth.",
      shippingInfo: "Insured courier shipping. Delivered within 3 business days."
    },
    {
      id: "textured-stacking-rings",
      name: "Textured Stacking Rings",
      slug: "textured-stacking-rings",
      description: "Set of Three Stackable Fine Bands",
      category: "Rings",
      price: 650,
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAyWX22dautelSb9ntIYQp8aKWgXz6IXSFF1gNZ_joYUUOaU1pCnPgiVhKyPt52nAKLr1lgBFj5T12GHKa7c5teTYHY1y-ix-1-Z9vAhj8jFXiHw056uVJvD2hLzyBbOiaiGUOxOsNmTMNI6SLqO_xj7xOH4DZJlThmBg5fFCV7T84R5ukcr80Ome0ZcKxU7Ez12lzpd0WK9TtK6f4yqt6e7bxmUS7bH5jtvPTj7SOdZp7hraO0yYq3j-7d2W1Qbe4ZGHVwMQjiKoA"
      ],
      finishes: ["Champagne Gold", "Rose Gold", "Silver"],
      materials: ["14k Solid Gold", "Sterling Silver"],
      inStock: true,
      stock: 80,
      rating: 4.6,
      reviewsCount: 201,
      isNewArrival: false,
      isBestSeller: false,
      careInstructions: "Wear rings separately or stacked. Store in dry suede bag to prevent scratching.",
      shippingInfo: "Ships within 24 hours. Express home delivery."
    },
    {
      id: "ethereal-diamond-band",
      name: "Ethereal Diamond Band",
      slug: "ethereal-diamond-band",
      description: "Slim Diamond Inlaid Solid Gold Band",
      category: "Rings",
      price: 1250,
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA5bzuS3rjywzUOKldH4VoB02TEwcOLkHrfAU3X_W6ofTPMwXD2Iiq1Fc80N_ARFgm7eRsdaE2wFX2dVj0DCZQIeo5zIA7e5UYLTUmeS4D5jQ7lQcWop2_Fx1iw87ZqmbmWHBFyl6Ud_XuIaj1wcCdr0u4LPWDj-3k0ypsr4dbAWf3ZOHF7aPhvBgHjG0WrzbjrtVF7unbFwxImvG0IoCheDsE4m8dKjP3K8gfP0Cg-ZRI5P5-DyAxuhjxuroGj3XV6DoVOdi5_hMg"
      ],
      finishes: ["Champagne Gold", "Rose Gold"],
      materials: ["18k Solid Gold"],
      inStock: true,
      stock: 45,
      rating: 4.8,
      reviewsCount: 76,
      isNewArrival: true,
      isBestSeller: false,
      careInstructions: "Hypoallergenic. Safe for sensitive fingers. Clean with soft cloth.",
      shippingInfo: "Complimentary standard delivery."
    },
    {
      id: "aura-cuff-bracelet",
      name: "Aura Cuff Bracelet",
      slug: "aura-cuff-bracelet",
      description: "Sleek Open-faced Solid Gold Cuff",
      category: "Bracelets",
      price: 2100,
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBs0lyiXgBcZekb9JHDqFKHtQhHa1TB7Hc70NMFWwOlPxNKpTYk69ibBG7xPKLNT-h7c5Uny1SbUiq5Dge2Dc2IrMFlw0Y9woB2Fh86H_bpW_NgyHwp8a3MnIhMcTOfn-r_4_9vC_dbUuE9XSzTZy7POTHU-VKKUyWaUZUkHekv8HgcllOrIRSJ1FwXNT3k3vPoZvhrybNSHjquhK-cAsQw0BiPWYMbHEmzaqsDsv5Kj6fWdb1lB7V4dnfs-yEdB3_KR2rptomyrS0"
      ],
      finishes: ["Champagne Gold"],
      materials: ["18k Solid Gold"],
      inStock: true,
      stock: 20,
      rating: 4.9,
      reviewsCount: 39,
      isNewArrival: false,
      isBestSeller: false,
      careInstructions: "Slightly flexible to adjust fit. Gently press sides to fit wrist size. Avoid heavy twisting.",
      shippingInfo: "Ships within 24 hours. Gift wrapping included."
    },
    {
      id: "celestial-gift-set",
      name: "Celestial Gift Set",
      slug: "celestial-gift-set",
      description: "Set of Lumina Pendant and Baroque Drops",
      category: "Combos",
      price: 1950,
      originalPrice: 2100,
      discountPercent: 7,
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDYjoWYJ577nHey0jV8P-SSYco_BlZtiHD3IBOwwFwoIxP62qpZ3BPwaagqzEBjpZ4ouh-wTKR-qbdPepz1Wyh-2ftAGvGhLCJGpXTxFnzlGitp5uBV3-VDwNMpJ5kHBnFAzdnk2fNZWlMfV_YTGHfWiFxYpIkAFNFMK5d74NUhD8f1jOcd8eYTGjPxTuIl3Xp3gVQb2xXTPaItRNY4uKJeWhmY1BpEWAL1QYLcsp-yeZgundrU52aro_csNjDd_lZXMHSEDgDlKXY"
      ],
      finishes: ["Champagne Gold"],
      materials: ["14k Solid Gold"],
      inStock: true,
      stock: 12,
      rating: 4.9,
      reviewsCount: 31,
      isNewArrival: true,
      isBestSeller: false,
      careInstructions: "Includes multiple pieces. Follow care tips for solid gold and pearls accordingly.",
      shippingInfo: "Premium leather jewelry box packaging. Fast tracked shipping."
    }
  ];

  for (const product of products) {
    const { category, images, inStock, ...rest } = product;
    await prisma.product.upsert({
      where: { slug: rest.slug },
      update: {
        ...rest,
        categoryId: categoryMap[category],
        images: {
          deleteMany: {},
          create: images.map(url => ({ url })),
        },
      },
      create: {
        ...rest,
        categoryId: categoryMap[category],
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
