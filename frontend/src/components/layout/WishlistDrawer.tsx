"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/store/useStore";
import { X, Heart, ShoppingBag, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api, { mapBackendProduct } from "@/lib/api";
import { Product } from "@/types";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const { wishlist, removeFromWishlist } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch full product data for wishlisted IDs
  useEffect(() => {
    if (!isOpen || wishlist.length === 0) {
      setProducts([]);
      return;
    }
    const fetchWishlistProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/products");
        const allProducts: Product[] = res.data.data.map(mapBackendProduct);
        const wishlisted = allProducts.filter((p) => wishlist.includes(p.id));
        setProducts(wishlisted);
      } catch (err) {
        console.error("Failed to load wishlist products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistProducts();
  }, [isOpen, wishlist]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 pointer-events-auto"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="fixed top-0 right-0 h-screen w-full sm:w-[480px] bg-background z-50 shadow-2xl flex flex-col border-l border-outline sm:rounded-l-3xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-outline/30 flex justify-between items-center bg-white">
              <h3 className="font-display text-[28px] tracking-wide text-on-background">Your Wishlist</h3>
              <button
                onClick={onClose}
                aria-label="Close wishlist"
                className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full cursor-pointer border border-transparent hover:border-outline/50 bg-surface-container-low"
              >
                <X size={16} className="stroke-[1.5]" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-grow overflow-y-auto p-8 bg-background">
              {loading ? (
                <div className="flex items-center justify-center py-32">
                  <Loader2 size={32} className="animate-spin text-primary stroke-[1]" />
                </div>
              ) : wishlist.length === 0 ? (
                <div className="text-center py-32 text-on-surface-variant flex flex-col items-center h-full justify-center">
                  <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center border border-outline/20 mb-8 shadow-inner">
                    <Heart size={28} className="text-primary stroke-[1]" />
                  </div>
                  <p className="font-display text-[26px] text-on-background mb-4 font-light">Your wishlist is empty</p>
                  <p className="font-body text-[14px] text-on-surface-variant/70 font-light mb-10 max-w-[280px] leading-relaxed">Curate your favorite pieces to save them for later.</p>
                  <button
                    onClick={onClose}
                    className="px-10 py-4 bg-on-background hover:bg-primary text-white font-label-caps text-[11px] tracking-[0.2em] uppercase transition-all duration-400 cursor-pointer rounded-xl font-medium shadow-luxury hover:shadow-luxury-hover"
                  >
                    Discover Pieces
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {products.map((item, idx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      key={item.id}
                      className="flex gap-6 pb-8 border-b border-outline/30 items-start group"
                    >
                      <Link href={`/product/${item.id}`} onClick={onClose} className="w-24 aspect-[4/5] bg-surface-container-lowest overflow-hidden rounded-xl border border-outline/20 relative shrink-0">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                      </Link>
                      <div className="flex-grow flex flex-col h-full justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <Link href={`/product/${item.id}`} onClick={onClose}>
                              <h4 className="font-display text-[20px] text-on-background hover:text-primary transition-colors leading-tight font-medium">{item.name}</h4>
                            </Link>
                            <button
                              onClick={() => removeFromWishlist(item.id)}
                              className="text-on-surface-variant/50 hover:text-error transition-colors cursor-pointer ml-2"
                              aria-label="Remove item"
                            >
                              <X size={16} className="stroke-[1.5]" />
                            </button>
                          </div>
                          <p className="font-body text-[11px] text-on-surface-variant/70 uppercase tracking-widest mt-2 font-medium">
                            {item.category}
                          </p>
                        </div>

                        <div className="flex justify-between items-end mt-6">
                          <span className="font-body text-[16px] text-primary font-semibold tracking-wide">₹{item.price.toLocaleString()}</span>
                          <Link
                            href={`/product/${item.id}`}
                            onClick={onClose}
                            className="px-4 py-2 border border-outline hover:border-primary text-on-background hover:text-primary rounded-lg font-label-caps text-[9px] tracking-widest uppercase transition-colors flex items-center gap-2"
                          >
                            <ShoppingBag size={12} className="stroke-[2]" /> View
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {wishlist.length > 0 && (
              <div className="p-8 border-t border-outline/20 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-10">
                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="w-full py-4 bg-primary text-white text-center font-label-caps text-[11px] tracking-[0.2em] uppercase hover:bg-on-background transition-all duration-400 flex items-center justify-center font-medium rounded-xl shadow-luxury hover:shadow-luxury-hover"
                >
                  View Full Wishlist
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
