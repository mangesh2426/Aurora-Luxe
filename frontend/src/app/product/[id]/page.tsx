"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import QuantitySelector from "@/components/product/QuantitySelector";
import { Heart, Star, ChevronDown, Loader2, ShieldCheck, Truck, RefreshCw } from "lucide-react";
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
        <Link href="/shop" className="px-10 py-4 bg-[#C59F27] text-white font-label-caps text-[12px] tracking-[0.25em] uppercase hover:bg-primary-container transition-all duration-300 font-semibold rounded-xl">
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
    <main className="max-w-container-max mx-auto px-6 md:px-16 pt-8 pb-32 bg-background text-on-background overflow-hidden">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex text-[10px] tracking-[0.2em] uppercase text-on-surface-variant mb-10">
        <ol className="inline-flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          </li>
          <li>
            <span className="text-outline mx-2">/</span>
            <Link href={`/shop?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
          </li>
          <li>
            <span className="text-outline mx-2">/</span>
            <span className="text-[#C59F27] font-semibold">{product.name}</span>
          </li>
        </ol>
      </nav>

      {/* Main product display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-32">
        {/* Left image gallery frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7"
        >
          <div className="bg-white rounded-md border border-outline overflow-hidden shadow-luxury">
            <ProductImageGallery images={product.images} />
          </div>
        </motion.div>

        {/* Right purchase detail parameters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-5 flex flex-col pt-4 md:pt-0"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="font-label-caps text-[10px] tracking-[0.3em] uppercase text-primary mb-3 block font-semibold">{product.category}</span>
              <h1 className="font-display text-[36px] md:text-[48px] text-on-background leading-[1.1] tracking-wide font-light">{product.name}</h1>
            </div>
            
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="Wishlist toggle"
              className="text-on-surface-variant hover:text-primary p-3 border border-outline rounded-full ml-4 cursor-pointer transition-all duration-300 hover:border-primary bg-white shadow-sm"
            >
              <Heart size={20} className={`stroke-[1.5] ${isWishlisted ? "fill-primary text-primary" : "text-on-surface-variant"}`} />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-8 text-[13px] text-on-surface-variant/80">
            <div className="flex text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className={`stroke-[1] ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-primary/20"}`} />
              ))}
            </div>
            <span className="font-body font-light text-[13px]">{product.rating} ({product.reviewsCount} verified reviews)</span>
          </div>

          <p className="font-body text-[13.5px] leading-relaxed text-on-surface-variant/90 mb-8 font-light tracking-wide">
            {product.description}
          </p>

          {/* Price Container */}
          <div className="flex items-end gap-4 p-6 mb-8 bg-surface-container-low border border-outline rounded-sm">
            <span className="font-display text-[32px] text-on-background font-light tracking-wide">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="font-body text-[16px] text-on-surface-variant/50 line-through mb-1">₹{product.originalPrice.toLocaleString()}</span>
            )}
            {product.discount && (
              <span className="bg-primary/10 border border-primary/20 text-primary text-[9px] uppercase font-label-caps px-3 py-1.5 tracking-widest ml-auto font-semibold rounded-sm">
                Save {product.discount}%
              </span>
            )}
          </div>

          {/* Variant Selector: Finish */}
          <div className="mb-6">
            <span className="block font-label-caps text-[10px] tracking-[0.25em] uppercase text-on-background mb-4 font-semibold">Color Finish: <span className="text-primary">{selectedFinish}</span></span>
            <div className="flex gap-3 flex-wrap">
              {product.finishes.map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFinish(f)}
                  className={`px-5 py-2.5 border text-[12px] font-body transition-all duration-300 cursor-pointer rounded-sm font-medium ${
                    selectedFinish === f
                      ? "border-on-background bg-on-background text-white"
                      : "border-outline hover:border-on-background text-on-surface-variant"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Variant Selector: Material */}
          <div className="mb-8">
            <span className="block font-label-caps text-[10px] tracking-[0.25em] uppercase text-on-background mb-4 font-semibold">Base Metal: <span className="text-primary">{selectedMaterial}</span></span>
            <div className="flex gap-3 flex-wrap">
              {product.materials.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMaterial(m)}
                  className={`px-5 py-2.5 border text-[12px] font-body transition-all duration-300 cursor-pointer rounded-sm font-medium ${
                    selectedMaterial === m
                      ? "border-on-background bg-on-background text-white"
                      : "border-outline hover:border-on-background text-on-surface-variant"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex gap-4">
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => setQuantity(q => q + 1)}
                onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
              />
              <button
                onClick={handleAdd}
                className="flex-1 bg-on-background text-white hover:bg-primary font-label-caps text-[10px] tracking-[0.25em] uppercase h-14 transition-all duration-400 flex items-center justify-center cursor-pointer font-semibold rounded-sm shadow-luxury hover:shadow-luxury-hover"
              >
                Add to Bag
              </button>
            </div>
            <button
              onClick={handleBuyNow}
              className="w-full bg-primary text-white hover:bg-on-background font-label-caps text-[10px] tracking-[0.25em] uppercase h-14 transition-all duration-400 cursor-pointer font-semibold rounded-sm shadow-luxury hover:shadow-luxury-hover"
            >
              Buy Now — Express Checkout
            </button>
          </div>

          {/* Trust Assurances Block */}
          <div className="mt-4 p-6 bg-surface-container-low border border-outline rounded-sm flex flex-col gap-5 mb-8">
            <div className="flex items-center gap-4">
              <ShieldCheck size={18} className="text-primary stroke-[1.5] shrink-0" />
              <div>
                <span className="block font-label-caps text-[10px] tracking-[0.2em] text-on-background uppercase font-semibold">Lifetime Anti-Tarnish Warranty</span>
                <span className="font-body text-[12px] text-on-surface-variant font-light">Your piece stays golden, guaranteed forever.</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Truck size={18} className="text-primary stroke-[1.5] shrink-0" />
              <div>
                <span className="block font-label-caps text-[10px] tracking-[0.2em] text-on-background uppercase font-semibold">Free Express Shipping</span>
                <span className="font-body text-[12px] text-on-surface-variant font-light">Complimentary insured delivery across India, 3-5 days.</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <RefreshCw size={18} className="text-primary stroke-[1.5] shrink-0" />
              <div>
                <span className="block font-label-caps text-[10px] tracking-[0.2em] text-on-background uppercase font-semibold">100% Skin Safe & Hypoallergenic</span>
                <span className="font-body text-[12px] text-on-surface-variant font-light">Zero nickel, zero lead. Safe for all skin types.</span>
              </div>
            </div>
          </div>

          {/* Collapsible Tabs Details */}
          <div className="border border-outline divide-y divide-outline overflow-hidden">
            <details className="group border-none" open>
              <summary className="flex justify-between items-center px-6 py-5 font-label-caps text-[10px] tracking-[0.25em] uppercase cursor-pointer list-none text-on-background hover:text-primary outline-none font-semibold">
                Specifications
                <ChevronDown size={16} className="transition-transform duration-300 group-open:rotate-180 text-primary/60 stroke-[1.5]" />
              </summary>
              <div className="font-body text-[13px] font-light tracking-wide text-on-surface-variant px-6 pb-6 pt-4 leading-relaxed border-t border-outline bg-surface">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><span className="text-primary mt-1">—</span> Hypoallergenic medical-grade bases, 100% free of nickel and lead.</li>
                  <li className="flex items-start gap-3"><span className="text-primary mt-1">—</span> Electroplated with thick 18K gold via physical vapor deposition.</li>
                  <li className="flex items-start gap-3"><span className="text-primary mt-1">—</span> Lifetime anti-corrosion, anti-rust, and anti-greening warranty coverage.</li>
                </ul>
              </div>
            </details>
            
            <details className="group border-none">
              <summary className="flex justify-between items-center px-6 py-5 font-label-caps text-[10px] tracking-[0.25em] uppercase cursor-pointer list-none text-on-background hover:text-primary outline-none font-semibold">
                Care Instructions
                <ChevronDown size={16} className="transition-transform duration-300 group-open:rotate-180 text-primary/60 stroke-[1.5]" />
              </summary>
              <div className="font-body text-[13px] font-light tracking-wide leading-relaxed text-on-surface-variant px-6 pb-6 pt-4 border-t border-outline bg-surface">
                {product.careInstructions || "Avoid contact with harsh industrial chemicals or highly concentrated detergents. Simply clean using a soft dry microfiber cloth."}
              </div>
            </details>

            <details className="group border-none">
              <summary className="flex justify-between items-center px-6 py-5 font-label-caps text-[10px] tracking-[0.25em] uppercase cursor-pointer list-none text-on-background hover:text-primary outline-none font-semibold">
                Shipping & Exchanges
                <ChevronDown size={16} className="transition-transform duration-300 group-open:rotate-180 text-primary/60 stroke-[1.5]" />
              </summary>
              <div className="font-body text-[13px] font-light tracking-wide leading-relaxed text-on-surface-variant px-6 pb-6 pt-4 border-t border-outline bg-surface">
                {product.shippingInfo || "Free express home deliveries. Standard delivery time is 3-5 business days. 7-day exchanges on clean items."}
              </div>
            </details>
          </div>

        </motion.div>
      </div>

      {/* Related recommendations */}
      <section className="mt-24 border-t border-outline/20 pt-20">
        <div className="text-center mb-16">
          <span className="font-label-caps text-[9px] tracking-[0.3em] uppercase text-primary font-bold mb-3 block">Complete The Look</span>
          <h2 className="font-display text-[36px] md:text-[46px] font-light">You May Also Love</h2>
          <div className="w-12 h-[1px] bg-primary/40 mx-auto mt-4"></div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

    </main>
  );
}
