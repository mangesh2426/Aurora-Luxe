import axios from 'axios';
import { Product } from '@/types';

// ─── Base URL ────────────────────────────────────────────────────────────────
// Priority: NEXT_PUBLIC_API_URL env var → deployed Render backend fallback
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://aurora-luxe.onrender.com';

// Temporary diagnostic log — remove once connection is confirmed stable
if (typeof window !== 'undefined') {
  console.log('[api] Axios baseURL:', BASE_URL);
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Render free-tier can take 50s+ to wake up on cold start
  timeout: 65000,
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Attach JWT auth token from Zustand persisted store on every request
api.interceptors.request.use((config) => {
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

// ─── Response Interceptor ────────────────────────────────────────────────────
// Surface helpful errors to the console without crashing the UI
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error(
        `[api] Network Error — could not reach ${BASE_URL}. ` +
        'Make sure the backend is running or NEXT_PUBLIC_API_URL is correct.'
      );
    } else if (error.response) {
      // Server responded with a non-2xx status — log it but don't crash
      console.error(
        `[api] ${error.config?.method?.toUpperCase()} ${error.config?.url} → ` +
        `${error.response.status} ${error.response.statusText}`
      );
    }
    // Always reject so individual call-sites can handle the error gracefully
    return Promise.reject(error);
  }
);

// ─── Product Mapper ───────────────────────────────────────────────────────────
// Helper to map backend product shape to frontend Product interface
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
