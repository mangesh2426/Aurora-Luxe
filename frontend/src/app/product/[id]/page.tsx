"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import QuantitySelector from "@/components/product/QuantitySelector";
import { Heart, Star, ChevronDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import api, { mapBackendProduct } from "@/lib/api";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedFinish, setSelectedFinish] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.id) return;
      setLoading(true);
      try {
        const res = await api.get(`/products/${params.id}`);
        const p = mapBackendProduct(res.data.data);
        setProduct(p);
        setSelectedFinish(p.finishes[0] || "");
        setSelectedMaterial(p.materials[0] || "");

        // Fetch related
        const allRes = await api.get('/products');
        const allProducts = allRes.data.data.map(mapBackendProduct);
        let rel = allProducts.filter((item: Product) => item.category === p.category && item.id !== p.id).slice(0, 4);
        if (rel.length < 4) {
          const fill = allProducts.filter((item: Product) => item.id !== p.id && !rel.find((r: Product) => r.id === item.id));
          rel.push(...fill.slice(0, 4 - rel.length));
        }
        setRelated(rel);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params]);

  // Scroll to top when product details finish loading
  useEffect(() => {
    if (!loading) {
      window.scrollTo({ top: 0, behavior: 'instant' as any });
    }
  }, [loading]);

  if (loading) {
    return (
      <main className="flex-grow pt-32 pb-40 flex justify-center items-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex-grow pt-32 pb-40 text-center">
        <h2 className="font-display text-[32px] text-on-background mb-4">Product Not Found</h2>
        <p className="font-body text-[14px] text-on-surface-variant mb-10 font-light">The piece you are seeking does not exist in our catalog.</p>
        <Link href="/shop" className="px-10 py-4 bg-primary text-on-primary font-label-caps text-[12px] tracking-[0.25em] uppercase hover:bg-primary-container transition-colors font-semibold">
          Explore Our Collection
        </Link>
      </main>
    );
  }

  const handleAdd = () => {
    addToCart(product, quantity, selectedFinish, selectedMaterial);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedFinish, selectedMaterial);
    router.push("/checkout");
  };

  const isWishlisted = wishlist.includes(product.id);

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8 pb-32 bg-white text-on-background overflow-hidden">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex text-[10px] tracking-[0.2em] uppercase text-on-surface-variant mb-12">
        <ol className="inline-flex items-center space-x-3">
          <li>
            <Link href="/" className="hover:text-primary lux-transition">Home</Link>
          </li>
          <li>
            <span className="text-outline mx-2">/</span>
            <Link href={`/shop?category=${product.category}`} className="hover:text-primary lux-transition">{product.category}</Link>
          </li>
          <li>
            <span className="text-outline mx-2">/</span>
            <span className="text-primary">{product.name}</span>
          </li>
        </ol>
      </nav>

      {/* Main product display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-32">
        {/* Left image gallery frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7"
        >
          <ProductImageGallery images={product.images} />
        </motion.div>

        {/* Right purchase detail parameters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-5 flex flex-col pt-4 md:pt-0"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-primary mb-2 block font-semibold">{product.category}</span>
              <h1 className="font-display text-[38px] md:text-[44px] text-on-background leading-[1.1] tracking-wide font-light">{product.name}</h1>
            </div>
            
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="Wishlist toggle"
              className="text-on-surface-variant hover:text-primary p-2 border border-outline rounded-full ml-4 cursor-pointer transition-colors duration-300"
            >
              <Heart size={22} className={`stroke-[1.5] ${isWishlisted ? "fill-primary text-primary" : ""}`} />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6 text-[13px] text-on-surface-variant">
            <div className="flex text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className={`stroke-[1.5] ${i < Math.floor(product.rating) ? "fill-primary text-primary" : ""}`} />
              ))}
            </div>
            <span>{product.rating} ({product.reviewsCount} verified reviews)</span>
          </div>

          <p className="font-body text-[14px] leading-relaxed text-on-surface-variant mb-8 font-light tracking-wide">
            {product.description}
          </p>

          <div className="flex items-end gap-4 p-6 mb-8 bg-surface-container-low border border-outline/30">
            <span className="font-body text-[24px] text-on-background font-medium">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="font-body text-[16px] text-on-surface-variant/70 line-through mb-1">₹{product.originalPrice.toLocaleString()}</span>
            )}
            {product.discount && (
              <span className="bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase font-label-caps px-2 py-0.5 tracking-wider ml-auto font-semibold">
                Save {product.discount}%
              </span>
            )}
          </div>

          {/* Variant Selector: Finish */}
          <div className="mb-6">
            <span className="block font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface mb-3 font-semibold">Color Finish: {selectedFinish}</span>
            <div className="flex gap-3 flex-wrap">
              {product.finishes.map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFinish(f)}
                  className={`px-5 py-2.5 border text-[12px] font-body transition-all duration-300 cursor-pointer ${
                    selectedFinish === f
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-outline hover:border-primary/50 text-on-surface-variant"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Variant Selector: Material */}
          <div className="mb-8">
            <span className="block font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface mb-3 font-semibold">Base Metal: {selectedMaterial}</span>
            <div className="flex gap-3 flex-wrap">
              {product.materials.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMaterial(m)}
                  className={`px-5 py-2.5 border text-[12px] font-body transition-all duration-300 cursor-pointer ${
                    selectedMaterial === m
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-outline hover:border-primary/50 text-on-surface-variant"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="flex flex-col gap-4 mb-10">
            <div className="flex gap-4">
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => setQuantity(q => q + 1)}
                onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
              />
              <button
                onClick={handleAdd}
                className="flex-1 bg-on-background text-white font-label-caps text-[11px] tracking-[0.2em] uppercase h-14 hover:bg-primary transition-colors flex items-center justify-center cursor-pointer font-semibold"
              >
                Add to Bag
              </button>
            </div>
            <button
              onClick={handleBuyNow}
              className="w-full bg-white text-black font-label-caps text-[11px] tracking-[0.2em] uppercase h-14 hover:bg-surface-container border border-outline transition-colors cursor-pointer font-semibold"
            >
              Buy It Now (Express Checkout)
            </button>
          </div>

          {/* Trust Assurances Block */}
          <div className="mt-7 p-5 bg-[#FAF8F5] border border-outline/20 flex flex-col gap-3.5 mb-8">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[19px] text-primary">verified</span>
              <span className="font-label-caps text-[9px] tracking-[0.15em] text-on-background uppercase font-semibold">Lifetime Anti-Tarnish Warranty</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[19px] text-primary">local_shipping</span>
              <span className="font-label-caps text-[9px] tracking-[0.15em] text-on-background uppercase font-semibold">Free Insured Home Delivery (7-Day Exchange)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[19px] text-primary">check_circle</span>
              <span className="font-label-caps text-[9px] tracking-[0.15em] text-on-background uppercase font-semibold">100% Skin Safe & Hypoallergenic</span>
            </div>
          </div>

          {/* Tabs Details */}
          <div className="border-t border-outline/50 divide-y divide-outline/50">
            <details className="group py-6" open>
              <summary className="flex justify-between items-center font-label-caps text-[11px] tracking-[0.25em] uppercase cursor-pointer list-none text-on-background hover:text-primary outline-none font-semibold">
                Specifications
                <ChevronDown size={18} className="transition-transform duration-300 group-open:rotate-180 text-primary stroke-[1.5]" />
              </summary>
              <div className="text-body text-[13px] font-light tracking-wide text-on-surface-variant pt-6 pb-2 pl-2">
                <ul className="list-disc list-inside space-y-2.5">
                  <li>Hypoallergenic bases, free of nickel and lead.</li>
                  <li>Electroplated with thick gold protective coating.</li>
                  <li>Lifetime anti-corrosion, anti-rust warranty coverage.</li>
                </ul>
              </div>
            </details>
            
            <details className="group py-6">
              <summary className="flex justify-between items-center font-label-caps text-[11px] tracking-[0.25em] uppercase cursor-pointer list-none text-on-background hover:text-primary outline-none font-semibold">
                Care Instructions
                <ChevronDown size={18} className="transition-transform duration-300 group-open:rotate-180 text-primary stroke-[1.5]" />
              </summary>
              <div className="text-body text-[13px] font-light tracking-wide leading-relaxed text-on-surface-variant pt-6 pb-2 pr-4 pl-2">
                {product.careInstructions || "Avoid contact with harsh detergents, chlorinated pool water, or chemicals. Clean carefully using damp cloth."}
              </div>
            </details>

            <details className="group py-6">
              <summary className="flex justify-between items-center font-label-caps text-[11px] tracking-[0.25em] uppercase cursor-pointer list-none text-on-background hover:text-primary outline-none font-semibold">
                Shipping & Exchanges
                <ChevronDown size={18} className="transition-transform duration-300 group-open:rotate-180 text-primary stroke-[1.5]" />
              </summary>
              <div className="text-body text-[13px] font-light tracking-wide leading-relaxed text-on-surface-variant pt-6 pb-2 pr-4 pl-2">
                {product.shippingInfo || "Free express home deliveries. 7-day exchanges."}
              </div>
            </details>
          </div>

        </motion.div>
      </div>

      {/* Related recommendations */}
      <section className="mt-24 border-t border-outline/30 pt-24">
        <h2 className="font-display text-[32px] text-center mb-2 font-light">You May Also Love</h2>
        <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant text-center mb-16">Explore matching items to complete your style</p>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

    </main>
  );
}
