import { Product } from "@/types";
import HomeClient from "@/components/HomeClient";

// ─── server-side data fetcher ──────────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aurora-luxe.onrender.com';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapProduct = (p: any): Product => ({
  id: p.id,
  name: p.name,
  description: p.description,
  category: p.category?.name || "Uncategorized",
  price: Number(p.price),
  originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
  discount: p.discountPercent || undefined,
  imageUrl: p.images?.length ? p.images[0].url : "",
  images: p.images ? p.images.map((img: { url: string }) => img.url) : [],
  finishes: p.finishes || [],
  materials: p.materials || [],
  inStock: p.stock > 0,
  rating: p.rating || 0,
  reviewsCount: p.reviewsCount || 0,
  isNew: p.isNewArrival || false,
  isBestSeller: p.isBestSeller || false,
  careInstructions: p.careInstructions,
  shippingInfo: p.shippingInfo,
});

async function fetchProducts(query: string): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products?${query}`, {
      next: { revalidate: 60 }, // ISR – revalidate every 60 s
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data as any[]).map(mapProduct).slice(0, 4);
  } catch {
    return [];
  }
}

// ─── Page (Server Component) ───────────────────────────────────────────────
export const metadata = {
  title: "Aurora Luxe — Premium Anti-Tarnish Gold Jewellery",
  description:
    "Discover waterproof, skin-safe, vacuum-plated gold jewellery that lasts forever. Shop earrings, rings, necklaces & bracelets at Aurora Luxe.",
};

export default async function Home() {
  const [bestSellers, newArrivals] = await Promise.all([
    fetchProducts("bestSeller=true"),
    fetchProducts("newArrival=true"),
  ]);

  return <HomeClient bestSellers={bestSellers} newArrivals={newArrivals} />;
}
