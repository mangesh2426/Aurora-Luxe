"use client";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { PRODUCTS } from "@/data/products";
import { X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  const savedItems = PRODUCTS.filter(p => wishlist.includes(p.id));

  const handleMoveToBag = (product: typeof PRODUCTS[0]) => {
    addToCart(product, 1, product.finishes[0], product.materials[0]);
    toggleWishlist(product.id); // remove from wishlist on move
  };

  return (
    <main className="flex-grow pt-8 pb-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full bg-white text-on-background overflow-hidden">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="font-display text-[40px] md:text-[56px] text-on-background mb-6">Your Wishlist</h1>
        <p className="font-body text-[14px] font-light tracking-[0.05em] text-on-surface-variant max-w-2xl mx-auto">
          Curated selections waiting for their perfect moment. You currently have {savedItems.length} pieces saved.
        </p>
      </div>

      {/* Utility Bar */}
      <div className="flex justify-between items-center mb-12 border-b border-outline pb-6">
        <span className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant font-semibold">{savedItems.length} PIECES</span>
      </div>

      {/* Product Grid */}
      <AnimatePresence mode="popLayout">
        {savedItems.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {savedItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  key={item.id}
                  className="group relative flex flex-col bg-white"
                >
                  <button
                    onClick={() => toggleWishlist(item.id)}
                    aria-label="Remove from wishlist"
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-error border border-outline/30 cursor-pointer"
                  >
                    <X size={16} className="stroke-[1.5]" />
                  </button>
                  
                  <Link href={`/product/${item.id}`} className="block">
                    <div className="aspect-[4/5] overflow-hidden bg-surface-container-low mb-6 relative border border-outline/30">
                      <Image src={item.imageUrl} alt={item.name} fill className="w-full h-full object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-105" />
                    </div>
                  </Link>
                  
                  <div className="flex flex-col flex-grow text-center">
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-display text-[20px] text-on-background mb-2 hover:text-primary transition-colors font-semibold">{item.name}</h3>
                    </Link>
                    <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant mb-4 font-semibold">{item.category}</p>
                    <p className="font-body text-[16px] text-primary mb-6 font-semibold">₹{item.price.toLocaleString()}</p>
                    
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => toggleWishlist(item.id)}
                        className="flex-1 py-3 bg-transparent border border-outline text-on-background font-label-caps text-[9px] tracking-wider uppercase hover:border-error hover:text-error transition-colors cursor-pointer font-semibold"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => handleMoveToBag(item)}
                        className="flex-2 py-3 bg-on-background border border-transparent text-white font-label-caps text-[9px] tracking-wider uppercase hover:bg-primary transition-colors cursor-pointer font-semibold"
                      >
                        Move to Bag
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col items-center justify-center py-24 text-center border border-outline/30 bg-surface shadow-sm"
          >
            <Heart size={64} className="text-outline mb-6 stroke-[1.2]" />
            <h2 className="font-display text-[32px] text-on-background mb-4 font-semibold">Your Wishlist is Empty</h2>
            <p className="font-body text-[14px] font-light tracking-[0.05em] text-on-surface-variant mb-10 max-w-md">Discover our timeless collections and save your favorite pieces for later.</p>
            <Link href="/shop" className="px-10 py-4 bg-primary text-on-primary font-label-caps text-[12px] tracking-[0.2em] uppercase hover:bg-primary-container transition-colors border border-transparent font-semibold">
              EXPLORE COLLECTIONS
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
