"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Product } from "@/types";

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

  const secondaryImage = product.images && product.images.length > 1 ? product.images[1] : product.imageUrl;

  return (
    <motion.div
      className="group flex flex-col h-full bg-white rounded-md overflow-hidden relative"
      whileHover={{ y: -4 }}
      transition={{ type: "tween", duration: 0.4, ease: "easeOut" }}
    >
      {/* Image and Action Layer */}
      <div className="relative w-full aspect-[3/4] bg-surface-container-lowest overflow-hidden rounded-md border border-outline">

        {/* Badges Frame */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
          {product.isNew && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.35 }}
              className="bg-white/95 backdrop-blur-sm border border-outline/30 text-on-background font-label-caps text-[9px] px-3 py-1 uppercase tracking-widest font-medium rounded-sm shadow-sm"
            >
              New
            </motion.span>
          )}
          {product.isBestSeller && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              className="bg-primary text-white font-label-caps text-[9px] px-3 py-1 uppercase tracking-widest font-medium rounded-sm shadow-sm"
            >
              Bestseller
            </motion.span>
          )}
          {product.discount && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.35 }}
              className="bg-on-background text-white font-label-caps text-[9px] px-3 py-1 uppercase tracking-widest font-medium rounded-sm shadow-sm"
            >
              -{product.discount}%
            </motion.span>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          onClick={handleWishlistToggle}
          aria-label="Toggle Wishlist"
          className="absolute top-4 right-4 z-20 p-2.5 bg-white/50 hover:bg-white backdrop-blur-md rounded-full shadow-sm border border-outline/30 text-on-surface cursor-pointer transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart
            size={16}
            className={`stroke-[1.5] transition-colors duration-300 ${isWishlisted ? "fill-primary text-primary" : "text-on-surface/80 hover:text-primary"}`}
          />
        </motion.button>

        {/* Main Product Link with dual image hover */}
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <motion.div
            className="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out opacity-100 group-hover:opacity-0"
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100"
          >
            <Image
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              fill
              className="object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </motion.div>
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 z-10 pointer-events-none" />

          {/* Quick Add overlay */}
          <div className="absolute bottom-4 left-4 right-4 hidden md:flex flex-col gap-2 z-20 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            <motion.button
              onClick={handleQuickAdd}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white/95 hover:bg-on-background hover:text-white backdrop-blur-md text-on-background font-label-caps text-[10px] tracking-[0.2em] py-3 uppercase cursor-pointer flex items-center justify-center gap-2 font-semibold rounded-sm border border-outline/50 shadow-sm transition-colors"
            >
              <ShoppingBag size={14} className="stroke-[1.5]" />
              Quick Add
            </motion.button>
          </div>
        </Link>
      </div>

      {/* Info Layer */}
      <div className="flex flex-col flex-grow items-center text-center pt-6 pb-2 px-2 bg-white">
        <Link href={`/product/${product.id}`} className="block w-full">
          <h3 className="font-display text-[20px] text-on-background hover:text-primary transition-colors tracking-wide font-medium line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex gap-3 justify-center items-center mt-3 mb-3">
          <span className="font-body text-[14px] text-on-background font-medium tracking-wide">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="font-body text-[12px] text-on-surface-variant line-through tracking-wide">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
