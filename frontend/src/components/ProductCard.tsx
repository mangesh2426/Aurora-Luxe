"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
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

  return (
    <div className="group flex flex-col h-full bg-transparent relative lux-transition hover:-translate-y-1">
      {/* Badges Frame */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.isNew && (
          <span className="bg-white/90 backdrop-blur-md border border-outline/10 text-primary font-label-caps text-[8.5px] px-2.5 py-0.5 uppercase tracking-widest font-semibold">
            New
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-[#1C1B17] text-white font-label-caps text-[8.5px] px-2.5 py-0.5 uppercase tracking-widest font-medium">
            Best Seller
          </span>
        )}
        {product.discount && (
          <span className="bg-primary text-white font-label-caps text-[8.5px] px-2.5 py-0.5 uppercase tracking-widest font-semibold">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Wishlist Button Overlay */}
      <button
        onClick={handleWishlistToggle}
        aria-label="Toggle Wishlist"
        className="absolute top-3.5 right-3.5 z-10 p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-outline/10 text-on-surface hover:text-primary transition-all duration-300 hover:scale-105 cursor-pointer"
      >
        <Heart
          size={16}
          className={`stroke-[1.5] transition-colors duration-300 ${
            isWishlisted ? "fill-primary text-primary" : "text-on-surface/70"
          }`}
        />
      </button>

      {/* Product Image Area */}
      <Link href={`/product/${product.id}`} className="block relative w-full aspect-[4/5] bg-[#FAF8F5] overflow-hidden border border-outline/20">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        
        {/* Soft shadow overlay */}
        <div className="absolute inset-0 bg-black/[0.01] group-hover:bg-black/[0.03] transition-colors duration-500"></div>

        {/* Hover Quick Add Action Bar */}
        <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 hidden md:block z-20">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-[#1C1B17] text-white hover:bg-primary font-label-caps text-[9px] tracking-[0.25em] py-3.5 uppercase transition-all duration-350 cursor-pointer flex items-center justify-center gap-2 font-medium"
          >
            <ShoppingBag size={12} className="stroke-[1.5]" />
            Quick Add
          </button>
        </div>
      </Link>

      {/* Product Info Frame */}
      <div className="flex flex-col flex-grow items-center text-center pt-5 pb-3 px-2">
        <span className="font-label-caps text-[9px] text-on-surface-variant/75 tracking-[0.2em] uppercase mb-1.5 block">
          {product.category}
        </span>
        <Link href={`/product/${product.id}`} className="block max-w-full">
          <h3 className="font-display text-[19px] md:text-[21px] text-on-background mb-1.5 hover:text-primary transition-colors tracking-wide font-light line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        {/* Price Tag Frame */}
        <div className="flex gap-2 justify-center items-center mt-auto">
          <span className="font-body text-[13.5px] text-primary font-semibold tracking-wider">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="font-body text-[11.5px] text-on-surface-variant/50 line-through tracking-wider">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
