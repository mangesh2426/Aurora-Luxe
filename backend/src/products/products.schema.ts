import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  originalPrice: z.number().positive().optional().nullable(),
  discountPrice: z.number().positive().optional().nullable(),
  discountPercent: z.number().int().min(0).max(100).optional().nullable(),
  stock: z.number().int().nonnegative('Stock must be non-negative'),
  categoryId: z.string().uuid('Invalid Category ID'),
  isBestSeller: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  finishes: z.array(z.string()).optional().default([]),
  materials: z.array(z.string()).optional().default([]),
  rating: z.number().min(0).max(5).optional().default(0),
  reviewsCount: z.number().int().nonnegative().optional().default(0),
  careInstructions: z.string().optional().nullable(),
  shippingInfo: z.string().optional().nullable(),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one product image is required'),
});

export const updateProductSchema = createProductSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional().nullable(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
