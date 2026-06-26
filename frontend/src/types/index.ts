export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl: string;
  images: string[];
  finishes: string[];
  materials: string[];
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  careInstructions?: string;
  shippingInfo?: string;
  sku?: string;
  originalStock?: number;
  categoryId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  selectedFinish: string;
  selectedMaterial: string;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "Placed" | "Processing" | "Shipped" | "Delivered";
  paymentStatus: "Paid" | "Unpaid";
  paymentMethod: string;
  customer: Customer;
  placedAt?: string;
  processingAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}
