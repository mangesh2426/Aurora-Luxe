"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/store/useStore";
import { ShieldCheck, Droplets, HeartHandshake, Award, Star, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import api, { mapBackendProduct } from "@/lib/api";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

export default function Home() {
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
      {/* Hero Frame Section */}
      <section className="w-full bg-white py-8 md:py-14">
        <div className="max-w-container-max mx-auto px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[75vh] md:min-h-[80vh] border border-outline/25 overflow-hidden">
            {/* Left Column: Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="col-span-1 md:col-span-6 bg-[#FAF8F5] flex flex-col justify-center px-10 py-16 md:px-20 md:py-24 relative"
            >
              {/* Subtle design element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
              
              <span className="font-label-caps text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-5 block">
                Premium Anti-Tarnish Curation
              </span>
              <h1 className="font-display text-[46px] sm:text-[58px] md:text-[68px] leading-[1.1] text-on-background font-light tracking-wide mb-7">
                Jewellery <br />
                <span className="italic font-normal text-primary">Made to Live In</span>
              </h1>
              <p className="font-body text-[13.5px] text-on-surface-variant font-light tracking-wide leading-relaxed mb-9 max-w-md">
                Luxurious, waterproof, and skin-friendly pieces forged for everyday radiance. Wear it in the shower, at the gym, and everywhere in between without ever losing its golden shine.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Link
                  href="/shop?sort=new"
                  className="px-9 py-4.5 bg-[#1C1B17] text-white font-label-caps text-[10px] tracking-[0.25em] uppercase hover:bg-primary transition-all duration-350 text-center font-medium shadow-sm hover:shadow-md"
                >
                  Shop New Arrivals
                </Link>
                <Link
                  href="/shop"
                  className="px-9 py-4.5 border border-[#1C1B17]/20 bg-transparent text-on-background font-label-caps text-[10px] tracking-[0.25em] uppercase hover:bg-[#1C1B17] hover:text-white hover:border-[#1C1B17] transition-all duration-350 text-center font-medium"
                >
                  Explore Catalog
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Model Image */}
            <motion.div
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="col-span-1 md:col-span-6 relative min-h-[45vh] md:min-h-auto w-full select-none bg-[#FAF8F5]"
            >
              <Image
                src="/hero_model.png"
                alt="Model wearing anti-tarnish gold jewellery"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Luxury Overlay Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.7 }}
                className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md px-7 py-5 border-l-[3px] border-primary shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
              >
                <h4 className="font-display text-[19px] text-on-background font-medium tracking-wide">18K Gold Vacuum Plated</h4>
                <p className="font-label-caps text-[9px] tracking-[0.15em] text-primary uppercase mt-1 font-semibold">Lifetime Color Warranty</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Pillars / Trust Indicators */}
      <section className="py-20 border-y border-outline/20 bg-[#FAF8F5]">
        <div className="max-w-container-max mx-auto px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-outline/30">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col items-center text-center gap-3.5 pt-0"
            >
              <div className="p-3 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-outline/10">
                <ShieldCheck size={26} className="text-primary stroke-[1.5]" />
              </div>
              <span className="font-label-caps text-[9.5px] tracking-[0.2em] uppercase font-semibold text-on-surface">Anti-Tarnish Coating</span>
              <p className="font-body text-[12px] text-on-surface-variant/90 font-light px-6 leading-relaxed">Advanced nano-coating stops rusting, greening, and tarnishing.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center text-center gap-3.5 pt-6 md:pt-0"
            >
              <div className="p-3 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-outline/10">
                <Droplets size={26} className="text-primary stroke-[1.5]" />
              </div>
              <span className="font-label-caps text-[9.5px] tracking-[0.2em] uppercase font-semibold text-on-surface">100% Waterproof</span>
              <p className="font-body text-[12px] text-on-surface-variant/90 font-light px-6 leading-relaxed">Shower, swim, or sweat in your favourite pieces without worry.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center text-center gap-3.5 pt-6 md:pt-0"
            >
              <div className="p-3 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-outline/10">
                <HeartHandshake size={26} className="text-primary stroke-[1.5]" />
              </div>
              <span className="font-label-caps text-[9.5px] tracking-[0.2em] uppercase font-semibold text-on-surface">100% Skin Safe</span>
              <p className="font-body text-[12px] text-on-surface-variant/90 font-light px-6 leading-relaxed">Hypoallergenic nickel-free bases designed for the most sensitive skin.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center text-center gap-3.5 pt-6 md:pt-0"
            >
              <div className="p-3 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-outline/10">
                <Award size={26} className="text-primary stroke-[1.5]" />
              </div>
              <span className="font-label-caps text-[9.5px] tracking-[0.2em] uppercase font-semibold text-on-surface">Premium Base Metals</span>
              <p className="font-body text-[12px] text-on-surface-variant/90 font-light px-6 leading-relaxed">Built on solid 925 sterling silver or premium grade stainless steel.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-28 max-w-container-max mx-auto px-16">
        <h2 className="font-display text-[38px] md:text-[50px] text-center mb-3 font-light text-on-background">Shop By Category</h2>
        <p className="font-label-caps text-[10px] tracking-[0.25em] uppercase text-on-surface-variant text-center mb-16">Curated edits for every style</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 justify-center">
          {[
            { name: "Earrings", img: "/earrings.png" },
            { name: "Rings", img: "/rings.png" },
            { name: "Necklaces", img: "/necklaces.png" },
            { name: "Bracelets", img: "/bracelets.png" },
            { name: "Combos", img: "/combos.png" }
          ].map((category, idx) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
            >
              <Link href={`/shop?category=${category.name}`} className="group flex flex-col items-center cursor-pointer">
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border border-outline/25 relative select-none group-hover:scale-105 group-hover:border-primary transition-all duration-500 shadow-sm">
                  <Image src={category.img} alt={category.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/[0.02] group-hover:bg-transparent transition-colors duration-300"></div>
                </div>
                <span className="font-display text-[19px] text-on-background mt-4 group-hover:text-primary transition-colors tracking-wide font-light">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-28 border-t border-outline/10 bg-[#FAF8F5]/40">
        <div className="max-w-container-max mx-auto px-16">
          <h2 className="font-display text-[38px] md:text-[50px] text-center mb-3 font-light">Best Sellers</h2>
          <p className="font-label-caps text-[10px] tracking-[0.25em] uppercase text-on-surface-variant text-center mb-16 font-medium">Timeless additions to your daily curation</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-2 md:col-span-4 flex justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={36} />
              </div>
            ) : (
              bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-28 border-t border-outline/10 bg-white">
        <div className="max-w-container-max mx-auto px-16">
          <h2 className="font-display text-[38px] md:text-[50px] text-center mb-3 font-light">New Arrivals</h2>
          <p className="font-label-caps text-[10px] tracking-[0.25em] uppercase text-on-surface-variant text-center mb-16 font-medium">Fresh pieces just introduced into our collection</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-2 md:col-span-4 flex justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={36} />
              </div>
            ) : (
              newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Frame */}
      <section className="py-28 bg-[#FAF8F5] border-y border-outline/25">
        <div className="max-w-container-max mx-auto px-16">
          <h2 className="font-display text-[38px] md:text-[50px] text-center mb-3 font-light">Loved By Thousands</h2>
          <p className="font-label-caps text-[10px] tracking-[0.25em] uppercase text-on-surface-variant text-center mb-16 font-semibold">Real words from our beautiful community</p>
          
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white p-10 border border-outline/10 flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.015)]"
              >
                <div className="flex gap-1 text-primary mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="font-body text-[13.5px] text-on-surface-variant/90 font-light italic leading-relaxed mb-8">
                  {t.text}
                </p>
                <div>
                  <h4 className="font-display text-[17px] text-on-background font-medium tracking-wide">{t.author}</h4>
                  <span className="font-label-caps text-[9px] tracking-[0.15em] text-primary uppercase font-semibold">{t.loc} — Verified Muse</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
