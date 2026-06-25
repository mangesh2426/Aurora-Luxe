import axios from 'axios';
import { Product } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  // Read token from Zustand's persisted store (single source of truth)
  try {
    const storeRaw = localStorage.getItem('aurora-luxe-store');
    if (storeRaw) {
      const storeData = JSON.parse(storeRaw);
      const token = storeData?.state?.user?.token;
      if (token && token !== 'undefined') {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {
    console.error('Failed to read auth token from store', e);
  }
  return config;
});

// Helper to map backend product to frontend product interface
export const mapBackendProduct = (backendProduct: any): Product => {
  return {
    id: backendProduct.id,
    name: backendProduct.name,
    description: backendProduct.description,
    category: backendProduct.category?.name || 'Uncategorized',
    price: Number(backendProduct.price),
    originalPrice: backendProduct.originalPrice ? Number(backendProduct.originalPrice) : undefined,
    discount: backendProduct.discountPercent || undefined,
    imageUrl: backendProduct.images && backendProduct.images.length > 0 ? backendProduct.images[0].url : '',
    images: backendProduct.images ? backendProduct.images.map((img: any) => img.url) : [],
    finishes: backendProduct.finishes || [],
    materials: backendProduct.materials || [],
    inStock: backendProduct.stock > 0,
    rating: backendProduct.rating || 0,
    reviewsCount: backendProduct.reviewsCount || 0,
    isNew: backendProduct.isNewArrival || false,
    isBestSeller: backendProduct.isBestSeller || false,
    careInstructions: backendProduct.careInstructions || undefined,
    shippingInfo: backendProduct.shippingInfo || undefined,
  };
};

export default api;
