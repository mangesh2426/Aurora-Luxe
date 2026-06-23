"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/store/useStore";
import { ShieldCheck, Droplets, HeartHandshake, Award, Heart, Star, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import api, { mapBackendProduct } from "@/lib/api";
import { Product } from "@/types";

const Instagram = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Home() {
  const { addToCart, toggleWishlist, wishlist } = useStore();

  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const [bestRes, newRes] = await Promise.all([
          api.get('/products?bestSeller=true'),
          api.get('/products?newArrival=true')
        ]);
        setBestSellers(bestRes.data.data.map(mapBackendProduct).slice(0, 4));
        setNewArrivals(newRes.data.data.map(mapBackendProduct).slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className="flex-grow bg-white text-on-background overflow-hidden">
      {/* Hero Section */}
      <section className="w-full bg-white py-6 md:py-10">
        <div className="max-w-container-max mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh] md:min-h-[75vh] border border-outline/30 overflow-hidden">
            {/* Left Column: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-[#FAF6F0] flex flex-col justify-center px-8 py-12 md:px-16 md:py-20"
            >
              <span className="font-label-caps text-[11px] tracking-[0.25em] uppercase text-primary font-semibold mb-4 block">
                Premium Anti-Tarnish Collection
              </span>
              <h1 className="font-display text-[44px] sm:text-[54px] md:text-[66px] leading-[1.15] text-on-background font-light tracking-wide mb-6">
                Jewellery Made <br />to Live In
              </h1>
              <p className="font-body text-[14px] text-on-surface-variant font-light tracking-wide leading-relaxed mb-8 max-w-md">
                Luxurious, waterproof, and skin-friendly pieces designed for everyday elegance. Wear it in the shower, at the gym, and everywhere in between without ever losing its gold shine.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/shop?sort=new"
                  className="px-8 py-4 bg-[#1C1B17] text-white font-label-caps text-[11px] tracking-[0.2em] uppercase hover:bg-primary hover:text-white transition-all duration-350 text-center font-medium"
                >
                  Shop New Arrivals
                </Link>
                <Link
                  href="/shop"
                  className="px-8 py-4 border border-[#1C1B17]/25 bg-transparent text-on-background font-label-caps text-[11px] tracking-[0.2em] uppercase hover:bg-[#1C1B17] hover:text-white hover:border-[#1C1B17] transition-all duration-350 text-center font-medium"
                >
                  Explore Collection
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Model Image */}
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative min-h-[40vh] md:min-h-auto w-full select-none bg-surface-container"
            >
              <Image
                src="/hero_model.png"
                alt="Model wearing anti-tarnish gold jewellery"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Image Overlay Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute bottom-6 left-6 bg-white px-6 py-4 border-l-4 border-primary shadow-md"
              >
                <h4 className="font-display text-[18px] text-on-background font-medium tracking-wide">18K Gold Plated</h4>
                <p className="font-label-caps text-[9px] tracking-[0.12em] text-on-surface-variant/90 uppercase mt-0.5 font-medium">Lifetime Color Warranty</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 border-y border-outline/30 bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-outline/50">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center text-center gap-3 pt-6 md:pt-0"
            >
              <ShieldCheck size={28} className="text-primary stroke-[1.5]" />
              <span className="font-label-caps text-[10px] tracking-[0.2em] uppercase font-semibold text-on-surface">Anti-Tarnish</span>
              <p className="font-body text-[11px] text-on-surface-variant font-light px-4">Protective coating stops rusting & tarnishing.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center text-center gap-3 pt-6 md:pt-0"
            >
              <Droplets size={28} className="text-primary stroke-[1.5]" />
              <span className="font-label-caps text-[10px] tracking-[0.2em] uppercase font-semibold text-on-surface">100% Waterproof</span>
              <p className="font-body text-[11px] text-on-surface-variant font-light px-4">Shower, swim, or sweat without worry.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center text-center gap-3 pt-6 md:pt-0"
            >
              <HeartHandshake size={28} className="text-primary stroke-[1.5]" />
              <span className="font-label-caps text-[10px] tracking-[0.2em] uppercase font-semibold text-on-surface">Skin Friendly</span>
              <p className="font-body text-[11px] text-on-surface-variant font-light px-4">Hypoallergenic bases, safe for sensitive skin.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col items-center text-center gap-3 pt-6 md:pt-0"
            >
              <Award size={28} className="text-primary stroke-[1.5]" />
              <span className="font-label-caps text-[10px] tracking-[0.2em] uppercase font-semibold text-on-surface">Premium Gold</span>
              <p className="font-body text-[11px] text-on-surface-variant font-light px-4">18K electroplated sterling bases.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-24 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <h2 className="font-display text-[36px] md:text-[48px] text-center mb-2">Shop By Category</h2>
        <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant text-center mb-16">Curated edits for every style</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 justify-center">
          {[
            { name: "Earrings", img: "/earrings.png" },
            { name: "Rings", img: "/rings.png" },
            { name: "Necklaces", img: "/necklaces.png" },
            { name: "Bracelets", img: "/bracelets.png" },
            { name: "Combos", img: "/combos.png" }
          ].map((category, idx) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link key={category.name} href={`/shop?category=${category.name}`} className="group flex flex-col items-center cursor-pointer">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border border-outline/30 relative select-none group-hover:scale-105 group-hover:border-primary transition-all duration-500 shadow-sm">
                  <Image src={category.img} alt={category.name} fill className="object-cover" />
                </div>
                <span className="font-display text-[18px] text-on-background mt-4 group-hover:text-primary transition-colors font-medium">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 border-t border-outline/20 bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-display text-[36px] md:text-[48px] text-center mb-2">Best Sellers</h2>
          <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant text-center mb-16 font-medium">Timeless additions to your daily curation</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-2 md:col-span-4 flex justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : bestSellers.map((product, idx) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className="group relative flex flex-col bg-transparent"
                >
                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-surface-container/85 backdrop-blur-sm border border-outline text-primary font-label-caps text-[9px] px-2.5 py-1 uppercase tracking-widest font-semibold">
                      Best Seller
                    </span>
                  </div>
                  
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Wishlist toggle"
                    className="absolute top-3 right-3 z-10 text-on-surface hover:text-primary p-2 bg-white/70 backdrop-blur-md rounded-full shadow-md cursor-pointer transition-colors duration-300"
                  >
                    <Heart size={18} className={`stroke-[1.5] ${isWishlisted ? "fill-primary text-primary" : ""}`} />
                  </button>

                  <Link href={`/product/${product.id}`} className="block aspect-[4/5] bg-surface-container-low relative overflow-hidden mb-4 border border-outline/30">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 hidden md:block z-20">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product, 1, product.finishes[0], product.materials[0]);
                        }}
                        className="w-full bg-on-background text-white font-label-caps text-[9px] tracking-widest py-3 uppercase hover:bg-primary transition-colors cursor-pointer font-semibold"
                      >
                        Quick Add to Bag
                      </button>
                    </div>
                  </Link>

                  <div className="text-center px-2">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-display text-[18px] text-on-surface mb-1 hover:text-primary transition-colors font-medium">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="font-body text-[11px] text-on-surface-variant font-light mb-3 tracking-widest uppercase">
                      {product.category}
                    </p>
                    <div className="flex gap-2 justify-center items-center font-body text-[14px]">
                      <span className="text-primary font-medium">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-on-surface-variant/70 line-through text-[12px]">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24 border-t border-outline/20 bg-white">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-display text-[36px] md:text-[48px] text-center mb-2">New Arrivals</h2>
          <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant text-center mb-16 font-medium">Fresh pieces just introduced into store</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-2 md:col-span-4 flex justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : newArrivals.map((product, idx) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className="group relative flex flex-col bg-transparent"
                >
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-surface-container/85 backdrop-blur-sm border border-outline text-primary font-label-caps text-[9px] px-2.5 py-1 uppercase tracking-widest font-semibold">
                      New
                    </span>
                  </div>
                  
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Wishlist toggle"
                    className="absolute top-3 right-3 z-10 text-on-surface hover:text-primary p-2 bg-white/70 backdrop-blur-md rounded-full shadow-md cursor-pointer transition-colors duration-300"
                  >
                    <Heart size={18} className={`stroke-[1.5] ${isWishlisted ? "fill-primary text-primary" : ""}`} />
                  </button>

                  <Link href={`/product/${product.id}`} className="block aspect-[4/5] bg-surface-container-low relative overflow-hidden mb-4 border border-outline/30">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 hidden md:block z-20">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product, 1, product.finishes[0], product.materials[0]);
                        }}
                        className="w-full bg-on-background text-white font-label-caps text-[9px] tracking-widest py-3 uppercase hover:bg-primary transition-colors cursor-pointer font-semibold"
                      >
                        Quick Add to Bag
                      </button>
                    </div>
                  </Link>

                  <div className="text-center px-2">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-display text-[18px] text-on-surface mb-1 hover:text-primary transition-colors font-medium">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="font-body text-[11px] text-on-surface-variant font-light mb-3 tracking-widest uppercase">
                      {product.category}
                    </p>
                    <div className="flex gap-2 justify-center items-center font-body text-[14px]">
                      <span className="text-primary font-medium">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-on-surface-variant/70 line-through text-[12px]">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Loved By Thousands */}
      <section className="py-24 bg-surface border-y border-outline/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-display text-[36px] md:text-[48px] text-center mb-2">Loved By Thousands</h2>
          <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant text-center mb-16 font-medium">Real words from our beautiful community</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "\"I was highly skeptical about the anti-tarnish claim, but I've been wearing the Lumina pendant in the shower and gym for 3 months now. It still shines like new! Highly recommended!\"",
                author: "Kriti S.",
                loc: "Mumbai"
              },
              {
                text: "\"The champagne gold finish is so subtle and elegant—none of that cheap brassy yellow look. It's the perfect daily accessory for professional office settings.\"",
                author: "Shreya M.",
                loc: "Delhi"
              },
              {
                text: "\"Unboxing felt so luxurious! The suede pouch and care manual are beautiful touches. I purchased the Stacking Rings set as a gift, and now I'm ordering for myself!\"",
                author: "Pooja R.",
                loc: "Kolkata"
              }
            ].map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 border border-outline/40 flex flex-col justify-between shadow-sm"
              >
                <div className="flex gap-1 text-primary mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="font-body text-[14px] text-on-surface-variant font-light italic leading-relaxed mb-6">
                  {t.text}
                </p>
                <div>
                  <h4 className="font-display text-[16px] text-on-background font-semibold">{t.author}</h4>
                  <span className="font-label-caps text-[9px] tracking-widest text-primary uppercase font-medium">{t.loc} — Verified Purchaser</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


    </main>
  );
}
