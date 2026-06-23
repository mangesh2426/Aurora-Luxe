import axios from 'axios';
import { Product } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  // If we have a token stored from auth
  const session = localStorage.getItem('aurora_user_session');
  if (session) {
    try {
      const parsed = JSON.parse(session);
      if (parsed.token && parsed.token !== "undefined") {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      } else {
        // Token is missing or literally "undefined", which means the session is broken.
        // We will remove it so the app doesn't keep trying to use a broken session.
        localStorage.removeItem('aurora_user_session');
        if (typeof window !== "undefined") {
          window.location.href = '/login';
        }
      }
    } catch (e) {
      console.error('Failed to parse session from localStorage', e);
      localStorage.removeItem('aurora_user_session');
    }
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
