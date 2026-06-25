"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Droplets, HeartHandshake, Award, Star, Mail, CheckCircle2 } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Product } from "@/types";
import Hero from "@/components/Hero";

// Lazy load ProductCard to reduce initial bundle size
const ProductCard = dynamic(() => import("@/components/ProductCard"), {
  loading: () => <div className="aspect-[4/5] bg-gray-100 rounded-3xl animate-pulse" />,
});

import {
  fadeUp, fadeLeft, fadeRight, staggerContainer, staggerItem,
  scaleIn, buttonVariants, viewport,
} from "@/lib/animations";

interface HomeClientProps {
  bestSellers: Product[];
  newArrivals: Product[];
}

// ─── Floating Particles ─────────────────────────────────────────────────────
function Particles() {
  const [particles, setParticles] = useState<{ id: number; left: number; top: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate random particles on client side to avoid hydration mismatch
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-1 h-1 bg-[#C59F27]/40 rounded-full animate-[float-particle_linear_infinite]"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Subtle floating orb (background gradient animation) ────────────────────
function FloatingOrb({ className, color = "197, 159, 39", opacity = 0.05 }: { className: string, color?: string, opacity?: number }) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none animate-[float-orb_9s_ease-in-out_infinite] ${className}`}
      style={{
        background: `radial-gradient(circle, rgba(${color}, ${opacity}) 0%, transparent 70%)`
      }}
    />
  );
}

// ─── Animated gradient headline text ────────────────────────────────────────
function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="italic font-normal text-primary font-display animate-[gradient-shift_6s_linear_infinite]"
      style={{
        background: "linear-gradient(90deg, #C59F27 0%, #f0d87a 45%, #A47E1B 100%)",
        backgroundSize: "200% 200%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}

// ─── Section heading with reveal ────────────────────────────────────────────
function SectionHeading({ label, title }: { label: string; title: string }) {
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
        className="font-label-caps text-[9px] tracking-[0.3em] uppercase text-primary font-bold mb-3 block"
      >
        {label}
      </motion.span>
      <motion.h2
        variants={fadeUp}
        className="font-display text-[44px] md:text-[56px] font-light text-on-background"
      >
        {title}
      </motion.h2>
      <motion.div
        variants={scaleIn}
        className="w-12 h-[1px] bg-primary/40 mx-auto mt-6"
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
    <main className="flex-grow bg-[#FCFBF9] text-on-background overflow-hidden">
      {/* ── Premium Landing Page Hero ─────────────────────────────────────────── */}
      <Hero />

      {/* ── Brand Pillars ─────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white border-b border-outline/10">
        <div className="max-w-container-max mx-auto px-4 md:px-16">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-outline/15"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            {[
              { icon: <ShieldCheck size={28} className="text-primary stroke-[1.25]" />, title: "Anti-Tarnish Coating", desc: "Advanced physical vapor deposition (PVD) stops rusting and green skin." },
              { icon: <Droplets size={28} className="text-primary stroke-[1.25]" />, title: "100% Waterproof", desc: "Shower, swim, or sweat in your favourite gold pieces without worry." },
              { icon: <HeartHandshake size={28} className="text-primary stroke-[1.25]" />, title: "100% Skin Safe", desc: "Hypoallergenic, nickel-free, and lead-free bases for sensitive skin." },
              { icon: <Award size={28} className="text-primary stroke-[1.25]" />, title: "Premium Base Metals", desc: "Forged on solid 925 sterling silver or surgical-grade stainless steel." },
            ].map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                variants={staggerItem}
                className={`flex flex-col items-center text-center gap-4 px-6 ${idx > 0 ? "pt-8 sm:pt-0" : ""}`}
              >
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="p-3 bg-[#FCFBF9] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.015)] border border-outline/10"
                >
                  {pillar.icon}
                </motion.div>
                <span className="font-label-caps text-[10px] tracking-[0.2em] uppercase font-bold text-on-surface">{pillar.title}</span>
                <p className="font-body text-[12.5px] text-on-surface-variant/85 font-light leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Category Section ──────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 max-w-container-max mx-auto px-4 md:px-16">
        <SectionHeading label="Discover Curation" title="Shop By Category" />

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 md:gap-12 justify-center"
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
            { name: "Combos", img: "/combos.png" },
          ].map((category) => (
            <motion.div key={category.name} variants={staggerItem}>
              <Link href={`/shop?category=${category.name}`} className="group flex flex-col items-center cursor-pointer">
                <motion.div
                  className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border border-outline/25 relative select-none shadow-md"
                  whileHover={{ scale: 1.07, borderColor: "rgba(197,159,39,0.6)", boxShadow: "0 15px 30px rgba(197,159,39,0.12)" }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                >
                  <motion.div
                    className="relative w-full h-full"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
                  >
                    <Image 
                      src={category.img} 
                      alt={category.name} 
                      fill 
                      sizes="(max-width: 768px) 128px, 144px"
                      className="object-cover" 
                    />
                  </motion.div>
                </motion.div>
                <span className="font-display text-[18px] md:text-[20px] text-on-background mt-4 group-hover:text-primary transition-colors tracking-wide font-light">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Best Sellers ──────────────────────────────────────────────────── */}
      <section className="py-24 md:py-40 border-t border-outline/5 bg-[#FAF8F5]/30">
        <div className="max-w-container-max mx-auto px-4 md:px-16">
          <SectionHeading label="Customer Favourites" title="Best Sellers" />
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10"
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
        </div>
      </section>

    {/* ── Anti-Tarnish Science Section ─────────────────────────────────── */}
      <section className="relative min-h-[85vh] bg-[#FCFBF9] text-on-background overflow-hidden border-t border-outline/10 flex items-center">

        {/* ── Aurora Mesh Background (same as Hero) ── */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[#FCFBF9]" />
          <div
            className="absolute w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full animate-[aurora-1_15s_ease-in-out_infinite]"
            style={{ top: '-10%', left: '-10%', background: 'radial-gradient(circle, rgba(197,159,39,0.07) 0%, transparent 60%)' }}
          />
          <div
            className="absolute w-[55vw] h-[55vw] md:w-[35vw] md:h-[35vw] rounded-full animate-[aurora-2_20s_ease-in-out_infinite_reverse]"
            style={{ bottom: '-15%', right: '-5%', background: 'radial-gradient(circle, rgba(197,159,39,0.05) 0%, transparent 65%)' }}
          />
          <div
            className="absolute w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] rounded-full animate-[aurora-3_18s_ease-in-out_infinite]"
            style={{ top: '30%', left: '35%', background: 'radial-gradient(circle, rgba(197,159,39,0.04) 0%, transparent 60%)' }}
          />
        </div>

        <div className="max-w-container-max mx-auto w-full px-6 md:px-16 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center py-20">

          {/* Left Column: Typography & CTAs */}
          <motion.div
            className="col-span-1 md:col-span-7 flex flex-col justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          >
            {/* Eyebrow */}
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-gradient-to-r from-[#C59F27] to-transparent" />
              <span className="font-label-caps text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-[#C59F27] font-bold">
                The Science of Shine
              </span>
            </motion.div>

            {/* Staggered Heading */}
            <h2 className="font-display text-[52px] sm:text-[64px] md:text-[76px] lg:text-[84px] leading-[1.05] font-light tracking-tight mb-8">
              <span className="block overflow-hidden pb-2">
                <motion.span
                  className="block"
                  variants={{ hidden: { y: '110%', rotateX: -20, opacity: 0 }, visible: { y: '0%', rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } } }}
                >
                  Designed for Life.
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-2">
                <motion.span
                  className="block italic font-normal"
                  style={{ color: '#C59F27' }}
                  variants={{ hidden: { y: '110%', rotateX: -20, opacity: 0 }, visible: { y: '0%', rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } } }}
                >
                  Guaranteed Forever.
                </motion.span>
              </span>
            </h2>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="font-body text-[13.5px] md:text-[14px] text-on-surface-variant/90 font-light tracking-wide leading-relaxed mb-10 max-w-md"
            >
              Traditional flash plating wears off after a few uses, exposing base metals that corrode and leave ugly green stains on your skin. Our jewelry is crafted using advanced <strong>Physical Vapor Deposition (PVD)</strong>.
            </motion.p>

            {/* Feature Pills */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md border border-outline/10 px-5 py-3 rounded-2xl">
                <span className="material-symbols-outlined text-[#C59F27] text-[18px]">water_drop</span>
                <span className="font-display text-[14px] font-medium">Shower &amp; Sweat Proof</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md border border-outline/10 px-5 py-3 rounded-2xl">
                <span className="material-symbols-outlined text-[#C59F27] text-[18px]">spa</span>
                <span className="font-display text-[14px] font-medium">Hypoallergenic Safe</span>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="tap">
                <Link
                  href="/shop"
                  className="relative flex items-center justify-center px-10 py-4.5 bg-[#111111] border border-transparent text-white font-label-caps text-[10px] md:text-[11px] tracking-[0.25em] uppercase transition-all duration-500 font-semibold rounded-2xl overflow-hidden group shadow-luxury hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[gradient-shift_1.5s_ease-in-out_infinite]" />
                  <span className="relative z-10">Shop Our Guarantee</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column: Image + Floating Badge */}
          <motion.div
            className="col-span-1 md:col-span-5 relative flex justify-center items-center mt-12 md:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewport}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            {/* Glow */}
            <div className="absolute w-[80%] h-[80%] bg-[#C59F27]/10 rounded-full blur-[80px] z-0" />

            <div className="relative w-full aspect-[4/3] max-w-[480px] mx-auto z-10">
              {/* Crisp border frame */}
              <div className="absolute inset-0 rounded-[2.5rem] border border-white/50 bg-gradient-to-br from-white/10 to-transparent z-20 pointer-events-none" />

              <Image
                src="/necklaces.png"
                alt="Premium anti-tarnish vacuum plated gold necklace"
                fill
                className="object-cover rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-10"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Glassmorphic Badge */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewport}
                transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-8 -left-6 md:-left-10 bg-white/80 backdrop-blur-2xl px-7 py-4 border border-white/50 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-30 flex items-center gap-6"
              >
                <div>
                  <p className="font-label-caps text-[8px] tracking-[0.25em] text-[#C59F27] uppercase font-bold mb-1">Base Material</p>
                  <h6 className="font-display text-[14px] font-semibold text-on-background">Sterling Silver / 316L Steel</h6>
                </div>
                <div className="h-7 w-[1px] bg-outline/20" />
                <div>
                  <p className="font-label-caps text-[8px] tracking-[0.25em] text-[#C59F27] uppercase font-bold mb-1">Plating Thickness</p>
                  <h6 className="font-display text-[14px] font-semibold text-on-background">10x Standard Flash</h6>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── New Arrivals ──────────────────────────────────────────────────── */}
      <section className="py-24 md:py-40 bg-white">
        <div className="max-w-container-max mx-auto px-4 md:px-16">
          <SectionHeading label="New Releases" title="New Arrivals" />
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10"
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
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#FAF8F5] border-y border-outline/25">
        <div className="max-w-container-max mx-auto px-4 md:px-16">
          <SectionHeading label="Testimonials" title="Loved By Thousands" />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            {[
              { text: "\"I was highly skeptical about the anti-tarnish claim, but I've been wearing the Lumina pendant in the shower and gym for 3 months now. It still shines like new! Highly recommended!\"", author: "Kriti S.", loc: "Mumbai" },
              { text: "\"The champagne gold finish is so subtle and elegant—none of that cheap brassy yellow look. It's the perfect daily accessory for professional office settings.\"", author: "Shreya M.", loc: "Delhi" },
              { text: "\"Unboxing felt so luxurious! The suede pouch and care manual are beautiful touches. I purchased the Stacking Rings set as a gift, and now I'm ordering for myself!\"", author: "Pooja R.", loc: "Kolkata" },
            ].map((t, idx) => (
              <motion.div
                key={idx}
                variants={staggerItem}
                whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(197,159,39,0.06)" }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-white p-10 border border-outline/10 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.015)] rounded-2xl"
              >
                <div className="flex gap-1 text-[#C59F27] mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-[#C59F27] text-[#C59F27]" />
                  ))}
                </div>
                <p className="font-body text-[13.5px] text-on-surface-variant/90 font-light italic leading-relaxed mb-8">{t.text}</p>
                <div className="flex items-center justify-between border-t border-outline/10 pt-4" suppressHydrationWarning>
                  <div>
                    <h4 className="font-display text-[16px] text-on-background font-semibold tracking-wide">{t.author}</h4>
                    <span className="font-label-caps text-[8.5px] tracking-[0.15em] text-[#C59F27] uppercase font-bold">{t.loc}</span>
                  </div>
                  <span className="font-label-caps text-[7.5px] bg-[#C59F27]/10 text-[#C59F27] px-2 py-0.5 uppercase tracking-widest font-bold rounded">Verified Muse</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Lifestyle Gallery ─────────────────────────────────────────────── */}
      <section className="py-24 bg-white border-b border-outline/10">
        <div className="max-w-container-max mx-auto px-4 md:px-16">
          <SectionHeading label="Social Inspiration" title="Lifestyle Showcase" />
          <motion.p
            className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant/80 text-center -mt-12 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewport}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Mention us <span className="text-primary font-semibold">@AuroraLuxe</span> to be featured
          </motion.p>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            {[
              { img: "/bracelets.png", name: "Classic Chain Bracelet" },
              { img: "/rings.png", name: "Stacking Bands Curation" },
              { img: "/earrings.png", name: "Twisted Golden Hoops" },
              { img: "/necklaces.png", name: "Lumina Pendant Style" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={staggerItem}
                className="group relative aspect-square bg-[#FCFBF9] rounded-2xl overflow-hidden shadow-sm border border-outline/10"
                whileHover={{ scale: 1.015 }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
              >
                <motion.div
                  className="relative w-full h-full"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1.0] }}
                >
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </motion.div>
                {/* Frosted glass hover overlay */}
                <motion.div
                  className="absolute inset-0 flex flex-col justify-center items-center text-white p-4"
                  initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                  whileHover={{ opacity: 1, backdropFilter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                  style={{ background: "rgba(0,0,0,0.35)" }}
                >
                  <Star size={20} className="fill-white text-white mb-2" />
                  <p className="font-display text-[15px] font-medium tracking-wide text-center">{item.name}</p>
                  <p className="font-label-caps text-[8.5px] tracking-widest text-[#C59F27] uppercase font-bold mt-1">Shop The Curation</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────────────── */}
      <section className="relative py-24 bg-[#FCFBF9] overflow-hidden border-t border-outline/10">
        
        {/* ── Aurora Mesh Background & Particles ── */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FCFBF9] to-[#F5F3EC]" />
          <div
            className="absolute w-[60vw] h-[60vw] rounded-full animate-[aurora-1_15s_ease-in-out_infinite]"
            style={{ top: '20%', right: '-10%', background: 'radial-gradient(circle, rgba(197,159,39,0.06) 0%, transparent 60%)' }}
          />
          <div
            className="absolute w-[50vw] h-[50vw] rounded-full animate-[aurora-2_20s_ease-in-out_infinite_reverse]"
            style={{ bottom: '-20%', left: '-10%', background: 'radial-gradient(circle, rgba(197,159,39,0.04) 0%, transparent 65%)' }}
          />
          <Particles />
        </div>

        <div className="max-w-container-max mx-auto px-4 md:px-16 relative z-10">
          <motion.div
            className="relative rounded-3xl overflow-hidden bg-white/60 backdrop-blur-2xl text-on-background py-16 px-8 md:px-16 border border-white/60 shadow-[0_20px_60px_rgba(197,159,39,0.08)]"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
          >

            <div className="max-w-xl mx-auto text-center relative z-10">
              <motion.div
                className="flex justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="p-4 bg-primary/5 rounded-full border border-primary/10 text-primary shadow-[0_4px_20px_rgba(197,159,39,0.1)]">
                  <Mail size={24} className="stroke-[1.5]" />
                </div>
              </motion.div>

              <motion.h2
                className="font-display text-[36px] md:text-[48px] font-light mb-4 tracking-tight"
                variants={fadeUp}
              >
                Join The Aurora Circle
              </motion.h2>
              <motion.p
                className="font-body text-[14px] md:text-[15px] text-on-surface-variant/90 font-light tracking-wide leading-relaxed mb-10"
                variants={fadeUp}
              >
                Subscribe to receive early notification of limited-edition drops, private sales, and 10% off your next golden acquisition.
              </motion.p>

              <AnimatePresence mode="wait">
                {subscribed ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.9, opacity: 0, y: 8 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: [0.0, 0.0, 0.2, 1.0] }}
                    className="bg-[#C59F27]/10 border border-[#C59F27]/30 rounded-2xl p-4 flex items-center justify-center gap-3 text-primary"
                  >
                    <CheckCircle2 size={18} />
                    <span className="font-label-caps text-[11px] tracking-widest uppercase font-semibold">Welcome to the Circle. Check your inbox.</span>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubscribe}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-grow bg-[#FCFBF9] border border-outline/15 rounded-xl px-5 py-4 text-[14px] text-on-background placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body font-light shadow-inner"
                    />
                    <motion.button
                      type="submit"
                      variants={buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      className="bg-[#111111] text-white transition-all duration-300 px-8 py-4 font-label-caps text-[11px] tracking-widest uppercase font-semibold rounded-xl shadow-luxury cursor-pointer border border-transparent hover:shadow-2xl"
                    >
                      Subscribe
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
