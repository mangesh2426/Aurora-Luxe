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
    <main className="max-w-container-max mx-auto px-6 md:px-16 pt-8 pb-32 bg-[#FCFBF9] text-on-background overflow-hidden">
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
          <div className="bg-white p-4 rounded-3xl border border-outline/10 shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
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
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="font-label-caps text-[10px] tracking-[0.22em] uppercase text-primary mb-2 block font-bold">{product.category}</span>
              <h1 className="font-display text-[36px] md:text-[42px] text-on-background leading-[1.15] tracking-wide font-light">{product.name}</h1>
            </div>
            
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="Wishlist toggle"
              className="text-on-surface-variant hover:text-primary p-3 border border-outline/15 rounded-full ml-4 cursor-pointer transition-all duration-300 hover:scale-105 bg-white shadow-sm"
            >
              <Heart size={20} className={`stroke-[1.5] ${isWishlisted ? "fill-primary text-primary" : "text-on-surface-variant"}`} />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6 text-[13px] text-on-surface-variant/80">
            <div className="flex text-[#C59F27]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} className={`stroke-[1.5] ${i < Math.floor(product.rating) ? "fill-[#C59F27] text-[#C59F27]" : "text-[#C59F27]/20"}`} />
              ))}
            </div>
            <span className="font-body font-light">{product.rating} ({product.reviewsCount} verified reviews)</span>
          </div>

          <p className="font-body text-[13.5px] leading-relaxed text-on-surface-variant/90 mb-8 font-light tracking-wide">
            {product.description}
          </p>

          {/* Price Container */}
          <div className="flex items-end gap-4 p-6 mb-8 bg-white border border-outline/10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
            <span className="font-body text-[25px] text-[#111111] font-semibold">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="font-body text-[15px] text-on-surface-variant/50 line-through mb-1.5">₹{product.originalPrice.toLocaleString()}</span>
            )}
            {product.discount && (
              <span className="bg-[#C59F27]/10 border border-[#C59F27]/20 text-[#C59F27] text-[9.5px] uppercase font-label-caps px-3 py-1 tracking-wider ml-auto font-bold rounded-lg">
                Save {product.discount}%
              </span>
            )}
          </div>

          {/* Variant Selector: Finish */}
          <div className="mb-6">
            <span className="block font-label-caps text-[9px] tracking-[0.2em] uppercase text-on-surface mb-3 font-bold">Color Finish: {selectedFinish}</span>
            <div className="flex gap-3 flex-wrap">
              {product.finishes.map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFinish(f)}
                  className={`px-5 py-2.5 border text-[12px] font-body transition-all duration-300 cursor-pointer rounded-xl ${
                    selectedFinish === f
                      ? "border-primary bg-primary/5 text-primary font-semibold"
                      : "border-outline hover:border-primary/50 text-on-surface-variant/80 bg-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Variant Selector: Material */}
          <div className="mb-8">
            <span className="block font-label-caps text-[9px] tracking-[0.2em] uppercase text-on-surface mb-3 font-bold">Base Metal: {selectedMaterial}</span>
            <div className="flex gap-3 flex-wrap">
              {product.materials.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMaterial(m)}
                  className={`px-5 py-2.5 border text-[12px] font-body transition-all duration-300 cursor-pointer rounded-xl ${
                    selectedMaterial === m
                      ? "border-primary bg-primary/5 text-primary font-semibold"
                      : "border-outline hover:border-primary/50 text-on-surface-variant/80 bg-white"
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
                className="flex-1 bg-[#111111] text-white hover:bg-primary font-label-caps text-[10px] tracking-[0.22em] uppercase h-14 hover:shadow-lg transition-all duration-300 flex items-center justify-center cursor-pointer font-bold rounded-2xl border border-white/5"
              >
                Add to Bag
              </button>
            </div>
            <button
              onClick={handleBuyNow}
              className="w-full bg-[#C59F27] text-white hover:bg-[#111111] font-label-caps text-[10px] tracking-[0.22em] uppercase h-14 hover:shadow-lg transition-all duration-300 cursor-pointer font-bold rounded-2xl"
            >
              Buy It Now (Express Checkout)
            </button>
          </div>

          {/* Trust Assurances Block */}
          <div className="mt-4 p-6 bg-white border border-outline/10 rounded-2xl flex flex-col gap-4 mb-8 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="text-primary bg-primary/5 p-1.5 rounded-lg border border-primary/10">
                <ShieldCheck size={18} className="stroke-[2]" />
              </div>
              <span className="font-label-caps text-[9px] tracking-[0.18em] text-on-background uppercase font-bold">Lifetime Anti-Tarnish Warranty</span>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="text-primary bg-primary/5 p-1.5 rounded-lg border border-primary/10">
                <Truck size={18} className="stroke-[2]" />
              </div>
              <span className="font-label-caps text-[9px] tracking-[0.18em] text-on-background uppercase font-bold">Free Insured Shipping & 7-Day Exchange</span>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="text-primary bg-primary/5 p-1.5 rounded-lg border border-primary/10">
                <RefreshCw size={18} className="stroke-[2]" />
              </div>
              <span className="font-label-caps text-[9px] tracking-[0.18em] text-on-background uppercase font-bold">100% Skin Safe & Hypoallergenic</span>
            </div>
          </div>

          {/* Collapsible Tabs Details */}
          <div className="border-t border-outline/30 divide-y divide-outline/30 bg-white rounded-2xl border border-outline/10 overflow-hidden shadow-sm">
            <details className="group border-none" open>
              <summary className="flex justify-between items-center px-6 py-5 font-label-caps text-[10.5px] tracking-[0.22em] uppercase cursor-pointer list-none text-on-background hover:text-primary outline-none font-bold bg-[#FAF8F5]/30">
                Specifications
                <ChevronDown size={16} className="transition-transform duration-300 group-open:rotate-180 text-primary stroke-[2]" />
              </summary>
              <div className="text-body text-[13px] font-light tracking-wide text-on-surface-variant/90 px-6 pb-5 pt-3 leading-relaxed border-t border-outline/10">
                <ul className="list-disc list-inside space-y-2">
                  <li>Hypoallergenic medical-grade bases, 100% free of nickel and lead.</li>
                  <li>Electroplated with thick 18K gold via physical vapor deposition.</li>
                  <li>Lifetime anti-corrosion, anti-rust, and anti-greening warranty coverage.</li>
                </ul>
              </div>
            </details>
            
            <details className="group border-none">
              <summary className="flex justify-between items-center px-6 py-5 font-label-caps text-[10.5px] tracking-[0.22em] uppercase cursor-pointer list-none text-on-background hover:text-primary outline-none font-bold bg-[#FAF8F5]/30">
                Care Instructions
                <ChevronDown size={16} className="transition-transform duration-300 group-open:rotate-180 text-primary stroke-[2]" />
              </summary>
              <div className="text-body text-[13px] font-light tracking-wide leading-relaxed text-on-surface-variant/90 px-6 pb-5 pt-3 border-t border-outline/10">
                {product.careInstructions || "Avoid contact with harsh industrial chemicals or highly concentrated detergents. Simply clean using a soft dry microfiber cloth."}
              </div>
            </details>

            <details className="group border-none">
              <summary className="flex justify-between items-center px-6 py-5 font-label-caps text-[10.5px] tracking-[0.22em] uppercase cursor-pointer list-none text-on-background hover:text-primary outline-none font-bold bg-[#FAF8F5]/30">
                Shipping & Exchanges
                <ChevronDown size={16} className="transition-transform duration-300 group-open:rotate-180 text-primary stroke-[2]" />
              </summary>
              <div className="text-body text-[13px] font-light tracking-wide leading-relaxed text-on-surface-variant/90 px-6 pb-5 pt-3 border-t border-outline/10">
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
