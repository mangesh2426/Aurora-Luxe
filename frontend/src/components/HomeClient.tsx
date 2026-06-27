"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Droplets, HeartHandshake, Award, Star, Mail, CircleCheck, Lock, Gift, StarHalf, Truck, Headset, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Product } from "@/types";
import Hero from "@/components/Hero";
import FeaturedCollection from "@/components/FeaturedCollection";

const ProductCard = dynamic(() => import("@/components/ProductCard"), {
  loading: () => <div className="aspect-[4/5] bg-surface-container-lowest rounded-md animate-pulse" />,
});

import { fadeUp, staggerContainer, staggerItem, viewport, buttonVariants } from "@/lib/animations";

interface HomeClientProps {
  bestSellers: Product[];
  newArrivals: Product[];
}

function SectionHeading({ label, title, subtitle }: { label: string; title: string, subtitle?: string }) {
  return (
    <motion.div
      className="text-center mb-20"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={staggerContainer}
    >
      <motion.span
        variants={fadeUp}
        className="font-label-caps text-[10px] tracking-[0.3em] uppercase text-primary font-bold mb-4 block"
      >
        {label}
      </motion.span>
      <motion.h2
        variants={fadeUp}
        className="font-display text-[44px] md:text-[56px] font-light text-on-background leading-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className="font-body text-[14px] text-on-surface-variant font-light mt-4 max-w-lg mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        variants={fadeUp}
        className="w-16 h-[1px] bg-primary/30 mx-auto mt-8"
      />
    </motion.div>
  );
}

export default function HomeClient({ bestSellers, newArrivals }: HomeClientProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <main className="flex-grow bg-background text-on-background overflow-hidden">
      
      {/* ── Premium Landing Page Hero ── */}
      <Hero />

      {/* ── Brand Pillars ── */}
      <section className="py-24 bg-white border-b border-outline">
        <div className="max-w-container-max mx-auto px-6 md:px-16">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-outline"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            {[
              { icon: <ShieldCheck size={28} className="text-primary stroke-[1]" />, title: "Anti-Tarnish", desc: "Advanced PVD coating stops rusting." },
              { icon: <Droplets size={28} className="text-primary stroke-[1]" />, title: "100% Waterproof", desc: "Shower, swim, or sweat in your gold." },
              { icon: <HeartHandshake size={28} className="text-primary stroke-[1]" />, title: "Skin Safe", desc: "Hypoallergenic and nickel-free." },
              { icon: <Award size={28} className="text-primary stroke-[1]" />, title: "Premium Base", desc: "Forged on surgical-grade steel." },
            ].map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                variants={staggerItem}
                className={`flex flex-col items-center text-center gap-5 px-6 ${idx > 0 ? "pt-12 sm:pt-0" : ""}`}
              >
                <div className="p-4 bg-surface-container-low rounded-full">
                  {pillar.icon}
                </div>
                <span className="font-label-caps text-[11px] tracking-[0.25em] uppercase font-bold text-on-background">{pillar.title}</span>
                <p className="font-body text-[13px] text-on-surface-variant font-light leading-relaxed max-w-[200px]">{pillar.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Editorial Collections ── */}
      <FeaturedCollection />

      {/* ── Category Section ── */}
      <section className="py-24 md:py-32 max-w-container-max mx-auto px-6 md:px-16 border-t border-outline/20">
        <SectionHeading label="Discover Curation" title="Shop By Category" />
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-12 justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerContainer}
        >
          {[
            { name: "Earrings", img: "/earrings.png" },
            { name: "Rings", img: "/rings.png" },
            { name: "Necklaces", img: "/necklaces.png" },
            { name: "Bracelets", img: "/bracelets.png" },
          ].map((category) => (
            <motion.div key={category.name} variants={staggerItem}>
              <Link href={`/shop?category=${category.name}`} className="group flex flex-col items-center cursor-pointer">
                <motion.div
                  className="w-full aspect-[4/5] rounded-sm overflow-hidden relative shadow-luxury"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "tween", duration: 0.8, ease: "easeOut" }}
                >
                  <Image src={category.img} alt={category.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                </motion.div>
                <span className="font-display text-[22px] text-on-background mt-6 group-hover:text-primary transition-colors tracking-wide font-light">
                  {category.name}
                </span>
                <span className="font-label-caps text-[9px] tracking-widest uppercase text-on-surface-variant mt-2 border-b border-transparent group-hover:border-primary group-hover:text-primary transition-all pb-1">Explore</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Best Sellers ── */}
      <section className="py-32 bg-white border-t border-outline">
        <div className="max-w-container-max mx-auto px-6 md:px-16">
          <SectionHeading label="The Icons" title="Bestsellers" subtitle="The pieces our muses reach for every single day." />
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16 md:gap-x-10"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            {bestSellers.map((product) => (
              <motion.div key={product.id} variants={staggerItem}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
          <div className="flex justify-center mt-16">
            <Link
              href="/shop?isBestSeller=true"
              className="inline-flex items-center justify-center px-10 py-4 bg-on-background text-white hover:bg-primary font-label-caps text-[10px] tracking-[0.2em] uppercase transition-all duration-400 font-medium rounded-sm shadow-luxury"
            >
              Shop All Icons
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us (Luxury Bento Grid) ── */}
      <section className="py-32 bg-surface-container-low border-y border-outline/20">
        <div className="max-w-container-max mx-auto px-6 md:px-16">
          <SectionHeading label="The Aurora Difference" title="Uncompromising Quality" subtitle="We refuse to cut corners. Every detail is meticulously designed to elevate your everyday." />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Main large cell */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.6 }}
              className="md:col-span-2 md:row-span-2 bg-white rounded-xl p-10 md:p-12 border border-outline shadow-sm flex flex-col justify-end relative overflow-hidden group"
            >
              <div className="absolute inset-0 z-0">
                <Image src="/hero_model.png" alt="Handcrafted" fill className="object-cover object-top opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/20"></div>
              </div>
              <div className="relative z-10">
                <Award size={32} className="text-primary stroke-[1] mb-6" />
                <h3 className="font-display text-[32px] text-on-background mb-4">Certified Materials & Craftsmanship</h3>
                <p className="font-body text-[14px] text-on-surface-variant font-light max-w-md leading-relaxed">
                  Every piece is rigorously tested for longevity. We use only premium 316L stainless steel and genuine 18k gold vacuum plating, ensuring your jewelry never loses its luster.
                </p>
              </div>
            </motion.div>
            
            {/* Smaller cells */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl p-8 border border-outline shadow-sm flex flex-col justify-between"
            >
              <Gift size={28} className="text-primary stroke-[1] mb-6" />
              <div>
                <h3 className="font-display text-[22px] text-on-background mb-2">Premium Packaging</h3>
                <p className="font-body text-[13px] text-on-surface-variant font-light leading-relaxed">Each order arrives in a luxurious velvet pouch and signature box, perfect for gifting.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-8 border border-outline shadow-sm flex flex-col justify-between"
            >
              <Headset size={28} className="text-primary stroke-[1] mb-6" />
              <div>
                <h3 className="font-display text-[22px] text-on-background mb-2">Lifetime Support</h3>
                <p className="font-body text-[13px] text-on-surface-variant font-light leading-relaxed">Our dedicated concierge team is always available to assist with your collection.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl p-8 border border-outline shadow-sm flex flex-col justify-between"
            >
              <Truck size={28} className="text-primary stroke-[1] mb-6" />
              <div>
                <h3 className="font-display text-[22px] text-on-background mb-2">Fast Delivery</h3>
                <p className="font-body text-[13px] text-on-surface-variant font-light leading-relaxed">Complimentary express shipping on all orders over ₹2000 across India.</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="md:col-span-2 bg-[#111111] text-white rounded-xl p-8 border border-outline shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
              <div className="relative z-10 flex-1">
                <Lock size={28} className="text-primary stroke-[1] mb-4" />
                <h3 className="font-display text-[26px] mb-2">Secure Checkout</h3>
                <p className="font-body text-[13px] text-white/70 font-light leading-relaxed">Bank-grade encryption ensures your payment data is completely protected. We accept all major credit cards and UPI.</p>
              </div>
              <div className="relative z-10 shrink-0">
                <Link href="/shop" className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-white font-label-caps text-[10px] tracking-[0.2em] uppercase transition-colors duration-400 font-medium rounded-sm">
                  Shop Securely
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── About Brand (Editorial) ── */}
      <section className="py-0 relative overflow-hidden bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-[60vh] md:h-auto min-h-[500px]">
            <Image src="/hero_model.png" alt="Craftsmanship" fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center px-8 md:px-20 py-24 md:py-32">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={staggerContainer}
            >
              <motion.span variants={fadeUp} className="font-label-caps text-[10px] tracking-[0.3em] uppercase text-primary font-bold mb-6 block">
                Our Story
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-display text-[40px] md:text-[52px] font-light text-on-background leading-[1.1] mb-8">
                Redefining the <br/><i className="text-primary">Standard of Luxury</i>
              </motion.h2>
              <motion.div variants={fadeUp} className="space-y-6 font-body text-[14px] text-on-surface-variant font-light leading-relaxed max-w-md">
                <p>
                  Aurora Luxe was born from a simple frustration: why does beautiful jewelry have to tarnish, fade, or turn skin green?
                </p>
                <p>
                  We spent years perfecting our craft, merging timeless aesthetics with modern PVD (Physical Vapor Deposition) technology. The result is a collection of waterproof, sweat-proof, and life-proof jewelry that looks and feels like solid gold, without the luxury markup.
                </p>
              </motion.div>
              <motion.div variants={fadeUp} className="mt-12">
                <Link
                  href="/about"
                  className="font-label-caps text-[11px] tracking-widest text-on-background uppercase border-b border-on-background pb-1 hover:text-primary hover:border-primary transition-all duration-300 font-medium"
                >
                  Discover The Craft
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="py-32 bg-background border-t border-outline/20">
        <div className="max-w-container-max mx-auto px-6 md:px-16">
          <SectionHeading label="Fresh Additions" title="New Arrivals" />
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16 md:gap-x-10"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            {newArrivals.map((product) => (
              <motion.div key={product.id} variants={staggerItem}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
          <div className="flex justify-center mt-16">
            <Link
              href="/shop?isNew=true"
              className="inline-flex items-center justify-center px-10 py-4 bg-transparent border border-outline hover:border-primary hover:text-primary text-on-background font-label-caps text-[10px] tracking-[0.2em] uppercase transition-all duration-400 font-medium rounded-sm"
            >
              View All New
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust Section (Icon Grid) ── */}
      <section className="py-20 bg-surface-container-highest border-y border-outline/20">
        <div className="max-w-container-max mx-auto px-6 md:px-16 overflow-hidden">
          <div className="flex flex-nowrap md:flex-wrap justify-between items-center gap-8 md:gap-12 overflow-x-auto hide-scrollbar pb-4 md:pb-0">
            {[
              "Secure Payment", "Premium Quality", "Anti Tarnish", "Free Shipping", "Easy Returns", "Warranty"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 shrink-0">
                <CircleCheck size={16} className="text-primary stroke-[1.5]" />
                <span className="font-label-caps text-[10px] tracking-widest text-on-background uppercase font-semibold whitespace-nowrap">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof / Reviews ── */}
      <section className="py-32 bg-white">
        <div className="max-w-container-max mx-auto px-6 md:px-16">
          <SectionHeading label="The Aurora Community" title="Loved By Musés Worldwide" />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            {[
              { text: "\"I wear my signature chain in the shower, gym, and ocean. It hasn't lost a hint of its gold color. Truly impressed by the quality.\"", author: "Priya S.", loc: "Mumbai, IN" },
              { text: "\"Finally found luxury jewelry that doesn't break the bank or turn my skin green. The unboxing experience was just as premium as the jewelry itself.\"", author: "Neha K.", loc: "Delhi, IN" },
              { text: "\"I'm extremely sensitive to cheap metals, but I've worn these earrings for two months straight with zero irritation. They are my absolute favorites now.\"", author: "Aanya M.", loc: "Bangalore, IN" },
            ].map((t, idx) => (
              <motion.div
                key={idx}
                variants={staggerItem}
                className="bg-surface-container-lowest p-10 border border-outline hover:border-primary/30 flex flex-col justify-between shadow-sm hover:shadow-luxury-hover transition-all duration-500 rounded-lg group"
              >
                <div className="flex gap-1 mb-8">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="font-body text-[14px] text-on-surface-variant font-light italic leading-relaxed mb-10 group-hover:text-on-background transition-colors">{t.text}</p>
                <div className="flex items-center gap-4 border-t border-outline/50 pt-6">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-display text-primary text-[18px]">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-label-caps text-[11px] text-on-background font-semibold tracking-wider uppercase mb-1">{t.author}</h4>
                    <span className="font-body text-[12px] text-on-surface-variant/70">{t.loc}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="relative py-32 bg-on-background overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
          >
            <Mail size={32} className="text-primary stroke-[1] mx-auto mb-8" />
            <h2 className="font-display text-[40px] md:text-[56px] text-white font-light mb-6">
              The Inner Circle
            </h2>
            <p className="font-body text-[14px] text-white/70 font-light tracking-wide leading-relaxed mb-12">
              Subscribe to unlock early access to limited collections, styling guides, and exclusive offers.
            </p>

            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-primary/20 border border-primary/40 rounded-sm py-6 px-8 flex items-center justify-center gap-4 text-white"
                >
                  <CircleCheck size={20} className="text-primary" />
                  <span className="font-label-caps text-[11px] tracking-[0.2em] uppercase font-medium">Welcome. Check your inbox.</span>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <input
                    type="email"
                    required
                    placeholder="ENTER YOUR EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow bg-white/5 border border-white/20 rounded-sm px-6 py-4 text-[12px] text-white placeholder-white/40 focus:outline-none focus:border-primary font-label-caps tracking-[0.1em] uppercase transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white transition-colors duration-400 px-10 py-4 font-label-caps text-[11px] tracking-[0.2em] uppercase font-medium rounded-sm hover:bg-white hover:text-on-background shrink-0"
                  >
                    Subscribe
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
