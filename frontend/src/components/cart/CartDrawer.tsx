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
            className="fixed top-0 right-0 h-screen w-full sm:w-[440px] bg-white z-50 shadow-2xl flex flex-col border-l border-outline/10 sm:rounded-l-3xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-outline/10 flex justify-between items-center bg-white">
              <h3 className="font-display text-[25px] tracking-wide text-on-background">Your Bag</h3>
              <button
                onClick={onClose}
                aria-label="Close cart"
                className="text-on-surface-variant hover:text-primary transition-colors p-2 border border-outline/10 rounded-full cursor-pointer"
              >
                <X size={15} className="stroke-[1.5]" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-[#FCFBF9]/40">
              {cart.length === 0 ? (
                <div className="text-center py-24 text-on-surface-variant">
                  <div className="w-16 h-16 bg-[#FCFBF9] rounded-2xl flex items-center justify-center border border-outline/10 shadow-sm mx-auto mb-6">
                    <ShoppingBag size={24} className="text-primary stroke-[1.5]" />
                  </div>
                  <p className="font-display text-[22px] text-on-background mb-4 font-light">Your bag is empty</p>
                  <p className="font-body text-[13px] text-on-surface-variant/80 font-light mb-8 max-w-[240px] mx-auto leading-relaxed">Add waterproof, anti-tarnish jewelry to start your curation.</p>
                  <button
                    onClick={onClose}
                    className="px-8 py-3.5 bg-[#111111] hover:bg-primary text-white font-label-caps text-[10px] tracking-widest uppercase transition-all duration-300 cursor-pointer rounded-xl font-bold"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex gap-5 pb-6 border-b border-outline/10 items-start">
                    <Link href={`/product/${item.id}`} onClick={onClose} className="w-20 aspect-[4/5] bg-[#FAF8F5] overflow-hidden rounded-xl border border-outline/15 relative block-shrink-0">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </Link>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <Link href={`/product/${item.id}`} onClick={onClose}>
                          <h4 className="font-display text-[18px] text-on-background hover:text-primary transition-colors leading-tight font-medium">{item.name}</h4>
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedFinish, item.selectedMaterial)}
                          className="text-on-surface-variant/60 hover:text-error transition-colors cursor-pointer ml-2"
                          aria-label="Remove item"
                        >
                          <X size={15} className="stroke-[1.5]" />
                        </button>
                      </div>
                      <p className="font-body text-[10.5px] text-on-surface-variant/80 uppercase tracking-widest mt-1">
                        {item.selectedFinish} / {item.selectedMaterial}
                      </p>
                      
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center border border-outline/15 h-8 bg-white rounded-lg overflow-hidden shadow-sm">
                          <button
                            onClick={() => updateCartQty(item.id, item.selectedFinish, item.selectedMaterial, item.quantity - 1)}
                            className="w-8 h-full flex items-center justify-center text-on-surface-variant/80 hover:text-primary transition-colors cursor-pointer"
                          >
                            <Minus size={12} className="stroke-[2]" />
                          </button>
                          <span className="font-body text-[12px] w-6 text-center text-[#111111] font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQty(item.id, item.selectedFinish, item.selectedMaterial, item.quantity + 1)}
                            className="w-8 h-full flex items-center justify-center text-on-surface-variant/80 hover:text-primary transition-colors cursor-pointer"
                          >
                            <Plus size={12} className="stroke-[2]" />
                          </button>
                        </div>
                        <span className="font-body text-[14px] text-[#C59F27] font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-outline/10 bg-white space-y-6 shadow-[0_-10px_30px_rgba(0,0,0,0.015)]">
                <div className="flex justify-between items-end">
                  <span className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant/80 font-semibold">Subtotal</span>
                  <span className="font-body text-[21px] text-[#C59F27] font-bold">₹{subtotal.toLocaleString()}</span>
                </div>
                <p className="font-body text-[11px] text-on-surface-variant/60 font-light tracking-wide leading-relaxed">
                  Shipping & promotional discounts are calculated at the next checkout step.
                </p>
                <div className="flex flex-col gap-3 pt-2">
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="w-full py-4 border border-outline/20 bg-transparent text-on-background text-center font-label-caps text-[10px] tracking-widest uppercase hover:bg-surface-container hover:border-on-background transition-all duration-300 rounded-xl font-semibold"
                  >
                    View Bag
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="w-full py-4 bg-[#C59F27] text-white text-center font-label-caps text-[10px] tracking-widest uppercase hover:bg-[#111111] transition-all duration-300 flex items-center justify-center font-bold rounded-xl shadow-md"
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
