import { z } from 'zod';

export const createAddressSchema = z.object({
  title: z.string().min(1, 'Address title (e.g. Home, Office) is required'),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().default('India'),
  pincode: z.string().min(6, 'Pincode must be at least 6 characters').max(10),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  isDefault: z.boolean().optional().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
