"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center min-h-[70vh] bg-[#FCFBF9] px-6 text-center">
      {/* Decorative gold ring */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mb-10"
      >
        <div className="w-36 h-36 rounded-full border-[3px] border-primary/30 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-[2px] border-primary/20 flex items-center justify-center">
            <span className="font-display text-[52px] font-light text-primary leading-none select-none">
              4
              <span className="text-on-background">0</span>
              4
            </span>
          </div>
        </div>
        {/* Orbiting dot */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <span className="font-label-caps text-[10px] tracking-[0.3em] uppercase text-primary font-bold mb-4 block">
          Page Not Found
        </span>
        <h1 className="font-display text-[36px] md:text-[50px] font-light text-on-background leading-tight mb-4">
          This Piece Has Left <br />
          <span className="italic text-primary">The Collection</span>
        </h1>
        <p className="font-body text-[13.5px] text-on-surface-variant font-light leading-relaxed max-w-sm mx-auto mb-10">
          The page you're looking for no longer exists or may have been moved.
          Explore our curated collections instead.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-8 py-4 bg-[#111111] text-white font-label-caps text-[10px] tracking-[0.25em] uppercase hover:bg-primary transition-all duration-300 rounded-xl shadow-md"
          >
            <Home size={14} className="stroke-[1.5]" />
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="flex items-center gap-2 px-8 py-4 border border-[#111111]/25 text-on-background font-label-caps text-[10px] tracking-[0.25em] uppercase hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all duration-300 rounded-xl"
          >
            <ShoppingBag size={14} className="stroke-[1.5]" />
            Browse Shop
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
