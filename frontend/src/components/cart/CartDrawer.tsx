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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 pointer-events-auto"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
            className="fixed top-0 right-0 h-screen w-full sm:w-[440px] bg-white z-50 shadow-2xl flex flex-col border-l border-outline/30"
          >
            {/* Header */}
            <div className="p-6 border-b border-outline flex justify-between items-center bg-surface-container-low">
              <h3 className="font-display text-[24px] tracking-wide text-on-background">Your Bag</h3>
              <button
                onClick={onClose}
                aria-label="Close cart"
                className="text-on-surface-variant hover:text-primary lux-transition p-2 border border-outline rounded-full cursor-pointer"
              >
                <X size={16} className="stroke-[1.5]" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-on-surface-variant">
                  <ShoppingBag size={48} className="text-outline mb-4 mx-auto stroke-[1.2]" />
                  <p className="font-display text-[20px] text-on-background mb-4">Your bag is empty</p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border border-outline text-on-background font-label-caps text-[10px] tracking-wider uppercase hover:bg-primary hover:border-primary hover:text-white lux-transition cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex gap-6 pb-6 border-b border-outline/50 items-start">
                    <Link href={`/product/${item.id}`} onClick={onClose} className="w-20 aspect-[4/5] bg-surface-container-low overflow-hidden lux-border relative">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </Link>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <Link href={`/product/${item.id}`} onClick={onClose}>
                          <h4 className="font-display text-[18px] text-on-background hover:text-primary lux-transition leading-tight">{item.name}</h4>
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedFinish, item.selectedMaterial)}
                          className="text-on-surface-variant hover:text-error lux-transition cursor-pointer"
                          aria-label="Remove item"
                        >
                          <X size={16} className="stroke-[1.5]" />
                        </button>
                      </div>
                      <p className="font-body text-[11px] text-on-surface-variant uppercase tracking-wider mt-1">
                        {item.selectedFinish} / {item.selectedMaterial}
                      </p>
                      
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center border border-outline h-8 bg-transparent">
                          <button
                            onClick={() => updateCartQty(item.id, item.selectedFinish, item.selectedMaterial, item.quantity - 1)}
                            className="w-7 h-full flex items-center justify-center text-on-surface-variant hover:text-primary lux-transition cursor-pointer"
                          >
                            <Minus size={14} className="stroke-[1.5]" />
                          </button>
                          <span className="font-body text-[12px] w-4 text-center text-on-background">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQty(item.id, item.selectedFinish, item.selectedMaterial, item.quantity + 1)}
                            className="w-7 h-full flex items-center justify-center text-on-surface-variant hover:text-primary lux-transition cursor-pointer"
                          >
                            <Plus size={14} className="stroke-[1.5]" />
                          </button>
                        </div>
                        <span className="font-body text-[14px] text-primary font-medium">${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-outline bg-surface-container-low space-y-6">
                <div className="flex justify-between items-end">
                  <span className="font-label-caps text-[11px] tracking-widest uppercase text-on-surface-variant">Subtotal</span>
                  <span className="font-body text-[20px] text-primary font-medium">${subtotal.toLocaleString()}</span>
                </div>
                <p className="font-body text-[11px] text-on-surface-variant font-light tracking-wide leading-relaxed">
                  Shipping & promotional discounts are calculated at the next checkout step.
                </p>
                <div className="flex flex-col gap-3 pt-2">
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="w-full py-4 border border-outline bg-transparent text-on-background text-center font-label-caps text-[11px] tracking-[0.2em] uppercase hover:bg-surface-container hover:border-on-background lux-transition"
                  >
                    View Bag
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="w-full py-4 bg-on-background text-white text-center font-label-caps text-[11px] tracking-[0.2em] uppercase hover:bg-primary lux-transition flex items-center justify-center font-semibold"
                  >
                    Secure Checkout
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
