import { z } from 'zod';

export const createOrderSchema = z.object({
  addressId: z.string().uuid('Invalid Address ID'),
  couponCode: z.string().optional().nullable(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
  paymentStatus: z.enum(['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED']).optional(),
  shippingStatus: z.string().optional(),
  trackingId: z.string().optional().nullable(),
  adminNotes: z.string().optional().nullable(),
});

export const createCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
  discount: z.number().positive('Discount value must be positive'),
  type: z.enum(['PERCENTAGE', 'FLAT']),
  minPurchase: z.number().nonnegative().optional().default(0),
  maxDiscount: z.number().positive().optional().nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isActive: z.boolean().optional().default(true),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
