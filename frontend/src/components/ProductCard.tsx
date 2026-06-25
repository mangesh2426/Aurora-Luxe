"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Product } from "@/types";
import { buttonVariants } from "@/lib/animations";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const finish = product.finishes[0] || "Standard";
    const material = product.materials[0] || "Standard";
    addToCart(product, 1, finish, material);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      className="group flex flex-col h-full bg-white border border-outline/20 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] rounded-2xl overflow-hidden relative"
      whileHover={{ y: -3, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.02)" }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
    >
      {/* Subtle inner border for premium lighting effect */}
      <div className="absolute inset-0 rounded-2xl border border-white/50 pointer-events-none z-10" />

      {/* Image and Action Layer */}
      <div className="relative w-full aspect-[4/5] bg-[#FAF8F5] overflow-hidden">

        {/* Badges Frame */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.isNew && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.35 }}
              className="bg-white/90 backdrop-blur-md border border-outline/15 text-primary font-label-caps text-[8.5px] px-2.5 py-0.5 uppercase tracking-widest font-semibold rounded-md"
            >
              New
            </motion.span>
          )}
          {product.isBestSeller && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              className="bg-[#111111] text-[#C59F27] font-label-caps text-[8.5px] px-2.5 py-0.5 uppercase tracking-widest font-semibold rounded-md border border-[#C59F27]/20"
            >
              Best Seller
            </motion.span>
          )}
          {product.discount && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.35 }}
              className="bg-[#C59F27] text-white font-label-caps text-[8.5px] px-2.5 py-0.5 uppercase tracking-widest font-semibold rounded-md"
            >
              -{product.discount}%
            </motion.span>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          onClick={handleWishlistToggle}
          aria-label="Toggle Wishlist"
          className="absolute top-3.5 right-3.5 z-10 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-outline/10 text-on-surface cursor-pointer"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
        >
          <Heart
            size={15}
            className={`stroke-[1.5] transition-colors duration-300 ${isWishlisted ? "fill-primary text-primary" : "text-on-surface/70"}`}
          />
        </motion.button>

        {/* Main Product Link with image zoom */}
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <motion.div
            className="relative w-full h-full"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1.0] }}
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </motion.div>

          {/* Subtle overlay shading */}
          <div className="absolute inset-0 bg-black/[0.005] group-hover:bg-black/[0.025] transition-colors duration-500 z-[1]" />

          {/* Quick Add button – slides up on card hover (CSS group-hover) */}
          <div className="absolute bottom-0 left-0 w-full p-4 hidden md:block z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-[380ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)]">
            <motion.button
              onClick={handleQuickAdd}
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="w-full bg-[#111111]/90 backdrop-blur-md text-white font-label-caps text-[9px] tracking-[0.25em] py-3.5 uppercase cursor-pointer flex items-center justify-center gap-2 font-semibold rounded-xl border border-white/10 shadow-glass"
            >
              <ShoppingBag size={12} className="stroke-[1.5]" />
              Quick Add
            </motion.button>
          </div>
        </Link>
      </div>

      {/* Info Layer */}
      <div className="flex flex-col flex-grow items-center text-center pt-5 pb-5 px-4.5 bg-white">
        <span className="font-label-caps text-[9px] text-[#C59F27] tracking-[0.2em] uppercase mb-1.5 block font-semibold">
          {product.category}
        </span>
        <Link href={`/product/${product.id}`} className="block max-w-full mb-1">
          <h3 className="font-display text-[18px] md:text-[20px] text-on-background hover:text-primary transition-colors tracking-wide font-medium line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-0.5 mb-2 text-[10.5px] text-on-surface-variant/70 justify-center">
          <div className="flex text-[#C59F27]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={`stroke-[1.5] ${i < Math.floor(product.rating || 5) ? "fill-[#C59F27] text-[#C59F27]" : "text-[#C59F27]/20"}`}
              />
            ))}
          </div>
          <span className="font-body font-light text-on-surface-variant">({product.reviewsCount || 15})</span>
        </div>

        {/* Price */}
        <div className="flex gap-2 justify-center items-center mt-auto">
          <span className="font-body text-[13.5px] text-[#111111] font-semibold tracking-wider">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="font-body text-[11.5px] text-on-surface-variant/70 line-through tracking-wider">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
