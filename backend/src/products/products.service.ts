import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductInput, UpdateProductInput, CreateCategoryInput } from './products.schema';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-'); // Replace multiple - with single -
  }

  // --- Category Operations ---
  async createCategory(data: CreateCategoryInput) {
    const slug = this.slugify(data.name);
    const existing = await this.prisma.category.findFirst({
      where: {
        OR: [{ name: data.name }, { slug }],
      },
    });

    if (existing) {
      throw new ConflictException('Category name or slug already exists');
    }

    return this.prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        slug,
      },
    });
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findCategoryById(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async deleteCategory(id: string) {
    await this.findCategoryById(id);
    return this.prisma.category.delete({ where: { id } });
  }

  // --- Product Operations ---
  async createProduct(data: CreateProductInput) {
    const slug = `${this.slugify(data.name)}-${Math.random().toString(36).substring(2, 7)}`;
    
    // Validate category exists
    await this.findCategoryById(data.categoryId);

    return this.prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        discountPrice: data.discountPrice,
        stock: data.stock,
        categoryId: data.categoryId,
        isBestSeller: data.isBestSeller ?? false,
        isNewArrival: data.isNewArrival ?? false,
        images: {
          create: data.images.map(url => ({ url })),
        },
      },
      include: {
        images: true,
        category: true,
      },
    });
  }

  async findAllProducts(filters: {
    categorySlug?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    bestSeller?: boolean;
    newArrival?: boolean;
  }) {
    const whereClause: any = {};

    if (filters.categorySlug) {
      whereClause.category = { slug: filters.categorySlug };
    }

    if (filters.bestSeller !== undefined) {
      whereClause.isBestSeller = filters.bestSeller;
    }

    if (filters.newArrival !== undefined) {
      whereClause.isNewArrival = filters.newArrival;
    }

    if (filters.search) {
      whereClause.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      whereClause.price = {};
      if (filters.minPrice !== undefined) {
        whereClause.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        whereClause.price.lte = filters.maxPrice;
      }
    }

    return this.prisma.product.findMany({
      where: whereClause,
      include: {
        images: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateProduct(id: string, data: UpdateProductInput) {
    await this.findProductById(id);

    const updateData: any = {
      name: data.name,
      description: data.description,
      price: data.price,
      discountPrice: data.discountPrice,
      stock: data.stock,
      categoryId: data.categoryId,
      isBestSeller: data.isBestSeller,
      isNewArrival: data.isNewArrival,
    };

    if (data.images) {
      // Clear previous images and insert new ones
      await this.prisma.productImage.deleteMany({ where: { productId: id } });
      updateData.images = {
        create: data.images.map(url => ({ url })),
      };
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
        category: true,
      },
    });
  }

  async deleteProduct(id: string) {
    await this.findProductById(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
