"use client";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/store/useStore";
import { X, ShoppingBag, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateCartQty, removeFromCart } = useStore();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
              <h3 className="font-display text-[28px] tracking-wide text-on-background">Your Selection</h3>
              <button
                onClick={onClose}
                aria-label="Close cart"
                className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full cursor-pointer border border-transparent hover:border-outline/50 bg-surface-container-low"
              >
                <X size={16} className="stroke-[1.5]" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-grow overflow-y-auto p-8 space-y-8 bg-background">
              {cart.length === 0 ? (
                <div className="text-center py-32 text-on-surface-variant flex flex-col items-center h-full justify-center">
                  <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center border border-outline/20 mb-8 shadow-inner">
                    <ShoppingBag size={28} className="text-primary stroke-[1]" />
                  </div>
                  <p className="font-display text-[26px] text-on-background mb-4 font-light">Your bag is empty</p>
                  <p className="font-body text-[14px] text-on-surface-variant/70 font-light mb-10 max-w-[280px] leading-relaxed">Discover waterproof, anti-tarnish jewelry designed for a lifetime.</p>
                  <button
                    onClick={onClose}
                    className="px-10 py-4 bg-on-background hover:bg-primary text-white font-label-caps text-[11px] tracking-[0.2em] uppercase transition-all duration-400 cursor-pointer rounded-xl font-medium shadow-luxury hover:shadow-luxury-hover"
                  >
                    Explore Collections
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="flex gap-6 pb-8 border-b border-outline/30 items-start"
                  >
                    <Link href={`/product/${item.id}`} onClick={onClose} className="w-24 aspect-[4/5] bg-surface-container-lowest overflow-hidden rounded-xl border border-outline/20 relative shrink-0 group">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                    </Link>
                    <div className="flex-grow flex flex-col h-full justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link href={`/product/${item.id}`} onClick={onClose}>
                            <h4 className="font-display text-[20px] text-on-background hover:text-primary transition-colors leading-tight font-medium">{item.name}</h4>
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.id, item.selectedFinish, item.selectedMaterial)}
                            className="text-on-surface-variant/50 hover:text-error transition-colors cursor-pointer ml-2"
                            aria-label="Remove item"
                          >
                            <X size={16} className="stroke-[1.5]" />
                          </button>
                        </div>
                        <p className="font-body text-[11px] text-on-surface-variant/70 uppercase tracking-widest mt-2 font-medium">
                          {item.selectedFinish} • {item.selectedMaterial}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-end mt-6">
                        <div className="flex items-center border border-outline/30 h-10 bg-white rounded-lg overflow-hidden shadow-sm">
                          <button
                            onClick={() => updateCartQty(item.id, item.selectedFinish, item.selectedMaterial, item.quantity - 1)}
                            className="w-10 h-full flex items-center justify-center text-on-surface-variant/80 hover:text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
                          >
                            <Minus size={14} className="stroke-[1.5]" />
                          </button>
                          <span className="font-body text-[13px] w-8 text-center text-on-background font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQty(item.id, item.selectedFinish, item.selectedMaterial, item.quantity + 1)}
                            className="w-10 h-full flex items-center justify-center text-on-surface-variant/80 hover:text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
                          >
                            <Plus size={14} className="stroke-[1.5]" />
                          </button>
                        </div>
                        <span className="font-body text-[16px] text-primary font-semibold tracking-wide">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-outline/20 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-10">
                <div className="flex justify-between items-end mb-4">
                  <span className="font-label-caps text-[11px] tracking-[0.15em] uppercase text-on-surface-variant font-medium">Estimated Total</span>
                  <span className="font-display text-[26px] text-on-background tracking-wide">₹{subtotal.toLocaleString()}</span>
                </div>
                <p className="font-body text-[12px] text-on-surface-variant/60 font-light tracking-wide leading-relaxed mb-6">
                  Taxes & complimentary express shipping calculated at checkout.
                </p>
                <div className="flex flex-col gap-4">
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="w-full py-4.5 bg-primary text-white text-center font-label-caps text-[11px] tracking-[0.2em] uppercase hover:bg-on-background transition-all duration-400 flex items-center justify-center font-medium rounded-xl shadow-luxury hover:shadow-luxury-hover"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="w-full py-4 bg-transparent border border-outline text-on-background text-center font-label-caps text-[11px] tracking-[0.2em] uppercase hover:border-on-background transition-all duration-400 rounded-xl font-medium"
                  >
                    View Selection
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
