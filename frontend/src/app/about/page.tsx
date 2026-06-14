"use client";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ShieldCheck, Leaf } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8 pb-32 bg-white text-on-background overflow-hidden">
      {/* Header */}
      <div className="text-center mb-20 max-w-2xl mx-auto">
        <h1 className="font-display text-[44px] md:text-[56px] text-on-background mb-4 font-light">Our Story</h1>
        <p className="font-body text-[13px] text-on-surface-variant font-light tracking-[0.1em] uppercase font-semibold">Enduring shine for the modern muse</p>
      </div>

      {/* Split section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative h-[50vh] min-h-[350px] border border-outline/30"
        >
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv922ZqUIqmDzVI3rAzco06vXG2NvWZMZvda7tJm2tVlKgyf4NNkePPMUDxctEmXfodxrBGO1rjKUftXI5FOKNGdkRl_Ofq5Gx2dT45pP26Val7dSaHyFw_R_0GvrqOMKtWtV897u1pjEE11huLrK9cx973_YRMmnzmtD6PqX1F_15QM7vfg3TEpipHOcSPUu04UumIhsfuOW0dh99JBLlsz2e2_bOgkJa1o1ms1o4sdIS9Y3MOTFaIUzPmfds4CCFBXGU5RA2KA4"
            alt="Handcrafting gold jewelry"
            fill
            className="object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="font-display text-[32px] text-on-background font-light">Crafted to Endure</h2>
          <p className="font-body text-[14px] text-on-surface-variant font-light leading-relaxed">
            Aurora Luxe was founded in 2026 out of a simple frustration: beautiful daily jewellery that turns green, rusts, or tarnishes after just a few wears. We set out to change that by designing fine, luxury jewellery made to live in.
          </p>
          <p className="font-body text-[14px] text-on-surface-variant font-light leading-relaxed">
            Every piece in our collection is forged with solid sterling silver or high-grade hypoallergenic stainless steel bases, which are then electroplated with extra thick layers of 18K solid gold under vacuum pressure. This advanced nano-coating locks in the golden shine, safeguarding your jewellery against sweat, perfume, and water.
          </p>
        </motion.div>
      </div>

      {/* Brand pillars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-surface p-12 border border-outline/30 shadow-sm"
      >
        <h3 className="font-display text-[28px] text-center mb-12 font-light">Our Commitments</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="space-y-3 flex flex-col items-center">
            <Sparkles size={32} className="text-primary stroke-[1.5]" />
            <h4 className="font-label-caps text-[12px] tracking-widest font-semibold uppercase text-on-background">Waterproof Lifeproof</h4>
            <p className="font-body text-[13px] text-on-surface-variant font-light leading-relaxed">Shower, gym, or swim. Our jewellery withstands moisture without losing its luxurious luster.</p>
          </div>
          <div className="space-y-3 flex flex-col items-center">
            <ShieldCheck size={32} className="text-primary stroke-[1.5]" />
            <h4 className="font-label-caps text-[12px] tracking-widest font-semibold uppercase text-on-background">100% Skin Safe</h4>
            <p className="font-body text-[13px] text-on-surface-variant font-light leading-relaxed">Hypoallergenic bases free from toxic nickel or lead. Designed to protect the most sensitive skin.</p>
          </div>
          <div className="space-y-3 flex flex-col items-center">
            <Leaf size={32} className="text-primary stroke-[1.5]" />
            <h4 className="font-label-caps text-[12px] tracking-widest font-semibold uppercase text-on-background">Ethical Curation</h4>
            <p className="font-body text-[13px] text-on-surface-variant font-light leading-relaxed">Conflict-free stones, recycled precious metals, and fair labor practices in our boutique studio.</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
