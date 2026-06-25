"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants, ease } from "@/lib/animations";

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

// ─── Animated Gradient Headline ─────────────────────────────────────────────
function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="italic font-normal font-display animate-[gradient-shift_6s_linear_infinite]"
      style={{
        background: "linear-gradient(90deg, #b08d23 0%, #e6cb65 45%, #8f6d17 100%)",
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

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] md:min-h-[95vh] flex items-center justify-center overflow-hidden bg-[#FCFBF9] border-b border-outline/10">
      
      {/* ── Aurora Mesh Background ── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Base light texture */}
        <div className="absolute inset-0 bg-[#FCFBF9] z-0" />
        
        {/* Aurora Layer 1 */}
        <div 
          className="absolute w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full animate-[aurora-1_15s_ease-in-out_infinite]"
          style={{
            top: '-10%', left: '-10%',
            background: 'radial-gradient(circle, rgba(197, 159, 39, 0.06) 0%, transparent 60%)',
          }}
        />
        {/* Aurora Layer 2 */}
        <div 
          className="absolute w-[55vw] h-[55vw] md:w-[35vw] md:h-[35vw] rounded-full animate-[aurora-2_20s_ease-in-out_infinite_reverse]"
          style={{
            bottom: '-15%', right: '-5%',
            background: 'radial-gradient(circle, rgba(197, 159, 39, 0.04) 0%, transparent 65%)',
          }}
        />
        {/* Aurora Layer 3 */}
        <div 
          className="absolute w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] rounded-full animate-[aurora-3_18s_ease-in-out_infinite]"
          style={{
            top: '20%', left: '40%',
            background: 'radial-gradient(circle, rgba(197, 159, 39, 0.05) 0%, transparent 60%)',
          }}
        />
      </div>

      <Particles />

      {/* ── Content Container ── */}
      <div className="max-w-container-max mx-auto w-full px-6 md:px-16 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center py-20 md:py-0">
        
        {/* Left Column: Typography & CTAs */}
        <motion.div 
          className="col-span-1 md:col-span-7 flex flex-col justify-center text-on-background"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
          }}
        >
          {/* Eyebrow Label */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: ease.out } }
            }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-[1px] w-12 bg-gradient-to-r from-[#C59F27] to-transparent" />
            <span className="font-label-caps text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-[#e6cb65] font-bold">
              Premium Anti-Tarnish Curation
            </span>
          </motion.div>

          {/* Staggered Heading Reveal */}
          <h1 className="font-display text-[56px] sm:text-[72px] md:text-[84px] lg:text-[96px] leading-[1.05] font-light tracking-tight mb-8">
            <span className="block overflow-hidden pb-2">
              <motion.span 
                className="block"
                variants={{
                  hidden: { y: "110%", rotateX: -20, opacity: 0 },
                  visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: ease.luxury } }
                }}
              >
                Jewellery
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span 
                className="block"
                variants={{
                  hidden: { y: "110%", rotateX: -20, opacity: 0 },
                  visible: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.1, ease: ease.luxury } }
                }}
              >
                <GradientText>Made to Live In</GradientText>
              </motion.span>
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: ease.out } }
            }}
            className="font-body text-[13.5px] md:text-[14px] text-on-surface-variant/90 font-light tracking-wide leading-relaxed mb-12 max-w-md"
          >
            Luxurious, waterproof, and skin-friendly pieces forged for everyday radiance. Wear it in the shower, at the gym, and everywhere in between without ever losing its golden shine.
          </motion.p>

          {/* Glass CTA Buttons */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: ease.out } }
            }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="tap">
              <Link
                href="/shop?sort=new"
                className="relative flex items-center justify-center px-10 py-4.5 bg-[#111111] border border-transparent text-white font-label-caps text-[10px] md:text-[11px] tracking-[0.25em] uppercase transition-all duration-500 font-semibold rounded-2xl overflow-hidden group shadow-luxury hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[gradient-shift_1.5s_ease-in-out_infinite]" />
                <span className="relative z-10">Shop New Arrivals</span>
              </Link>
            </motion.div>
            
            <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="tap">
              <Link
                href="/shop"
                className="flex items-center justify-center px-10 py-4.5 bg-white/50 backdrop-blur-md border border-[#111111]/10 text-on-background hover:bg-white font-label-caps text-[10px] md:text-[11px] tracking-[0.25em] uppercase transition-all duration-300 font-semibold rounded-2xl"
              >
                Explore Catalog
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Column: Animated Image & Trust Badge */}
        <motion.div 
          className="col-span-1 md:col-span-5 relative flex justify-center items-center mt-12 md:mt-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: ease.luxury, delay: 0.3 }}
        >
          {/* Subtle background glow behind image */}
          <div className="absolute w-[80%] h-[80%] bg-[#C59F27]/10 rounded-full blur-[80px] z-0" />
          
          <div className="relative w-full aspect-[4/5] max-w-[450px] mx-auto z-10 animate-[float-image_6s_ease-in-out_infinite]">
            {/* Crisp frame for image (No blur overlay) */}
            <div className="absolute inset-0 rounded-[2.5rem] border border-white/50 bg-gradient-to-br from-white/10 to-transparent z-20 pointer-events-none" />
            
            <Image
              src="/hero_model.png"
              alt="Model wearing anti-tarnish gold jewellery"
              fill
              priority
              className="object-cover rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-10"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Glassmorphic Trust Badge */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: ease.out }}
              className="absolute -bottom-8 -left-6 md:-left-12 bg-white/80 backdrop-blur-2xl px-8 py-5 border border-white/50 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-30 flex flex-col gap-1"
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#C59F27] animate-pulse" />
                <h4 className="font-display text-[16px] text-on-background font-semibold tracking-wide">18K Gold Vacuum Plated</h4>
              </div>
              <p className="font-label-caps text-[8px] tracking-[0.25em] text-primary uppercase font-bold pl-5">
                Lifetime Color Warranty
              </p>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
