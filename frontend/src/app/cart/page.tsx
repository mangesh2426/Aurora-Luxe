"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/store/useStore";
import { PRODUCTS } from "@/data/products";
import QuantitySelector from "@/components/product/QuantitySelector";
import { ShoppingBag, X, ArrowLeft, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart } = useStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(0);
  const [appliedCodeName, setAppliedCodeName] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Shipping rules: Complimentary above ₹1,999, else ₹99
  const shippingCharge = subtotal >= 1999 || subtotal === 0 ? 0 : 99;
  
  const discountAmount = Math.round(subtotal * (appliedDiscountPercent / 100));
  
  const total = subtotal + shippingCharge - discountAmount;

  const handleApplyCoupon = () => {
    setCouponError("");
    setCouponSuccess("");
    const code = couponCode.trim().toUpperCase();

    if (code === "GOLDEN10" || code === "WELCOME10") {
      setAppliedDiscountPercent(10);
      setAppliedCodeName(code);
      setCouponSuccess(`Promo code "₹{code}" applied: 10% discount!`);
      localStorage.setItem("aurora_active_discount", JSON.stringify({ code, percent: 10 }));
    } else if (code === "GOLDEN15") {
      setAppliedDiscountPercent(15);
      setAppliedCodeName(code);
      setCouponSuccess(`Promo code "₹{code}" applied: 15% discount!`);
      localStorage.setItem("aurora_active_discount", JSON.stringify({ code, percent: 15 }));
    } else if (code === "") {
      setAppliedDiscountPercent(0);
      setAppliedCodeName("");
      localStorage.removeItem("aurora_active_discount");
    } else {
      setAppliedDiscountPercent(0);
      setAppliedCodeName("");
      setCouponError("Invalid promo code. Try GOLDEN10");
      localStorage.removeItem("aurora_active_discount");
    }
  };

  return (
    <main className="flex-grow w-full bg-background text-on-background overflow-hidden">
      {/* Page Header */}
      <div className="bg-white border-b border-outline">
        <div className="max-w-container-max mx-auto px-6 md:px-16 py-16 flex justify-between items-end">
          <div>
            <nav className="font-label-caps text-[9px] tracking-[0.3em] uppercase text-on-surface-variant mb-4">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <span className="mx-3 text-outline/50">/</span>
              <span className="text-primary font-semibold">Your Selection</span>
            </nav>
            <h1 className="font-display text-[48px] md:text-[64px] leading-none text-on-background font-light tracking-wide">Your Selection</h1>
          </div>
          <span className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant font-medium mb-2">{cart.length} {cart.length === 1 ? 'Piece' : 'Pieces'}</span>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-6 md:px-16 py-16 flex flex-col gap-16">
      
      <div className="flex flex-col lg:flex-row gap-16 relative">
        {/* Left column: Cart Items list */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-2/3 flex flex-col gap-8"
        >
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-center border border-outline">
              <ShoppingBag size={48} className="text-on-surface-variant/30 mb-8 stroke-[1]" />
              <h2 className="font-display text-[36px] text-on-background mb-4 font-light">Your selection is empty</h2>
              <p className="font-body text-[14px] font-light text-on-surface-variant mb-12 max-w-md leading-relaxed">Discover our curated collection of waterproof, anti-tarnish jewelry.</p>
              <Link href="/shop" className="px-12 py-4 bg-on-background text-white font-label-caps text-[11px] tracking-[0.2em] uppercase hover:bg-primary transition-colors font-medium">
                Explore Collections
              </Link>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex gap-8 pb-10 border-b border-outline/30 relative group items-start">
                <Link href={`/product/${item.id}`} className="w-28 md:w-40 aspect-[3/4] shrink-0 bg-surface-container-low relative overflow-hidden rounded-sm border border-outline">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                </Link>
                
                <div className="flex flex-col justify-between flex-grow self-stretch py-1">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <Link href={`/product/${item.id}`}>
                        <h3 className="font-display text-[24px] md:text-[28px] text-on-background hover:text-primary transition-colors leading-tight font-light">{item.name}</h3>
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedFinish, item.selectedMaterial)}
                        aria-label="Remove item"
                        className="text-on-surface-variant/50 hover:text-on-background transition-colors p-2 cursor-pointer ml-2"
                      >
                        <X size={16} className="stroke-[1.5]" />
                      </button>
                    </div>
                    <p className="font-body text-[11px] tracking-widest text-on-surface-variant mb-6 uppercase font-medium">
                      {item.selectedFinish} &bull; {item.selectedMaterial}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <QuantitySelector
                      quantity={item.quantity}
                      onIncrease={() => updateCartQty(item.id, item.selectedFinish, item.selectedMaterial, item.quantity + 1)}
                      onDecrease={() => updateCartQty(item.id, item.selectedFinish, item.selectedMaterial, item.quantity - 1)}
                      size="sm"
                    />
                    <span className="font-display text-[22px] text-on-background font-light tracking-wide">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {cart.length > 0 && (
            <div className="mt-4">
              <Link href="/shop" className="font-label-caps text-[10px] tracking-widest uppercase hover:text-primary transition-colors flex items-center gap-2 w-fit text-on-surface-variant">
                <ArrowLeft size={14} className="stroke-[1.5]" /> Continue Shopping
              </Link>
            </div>
          )}
        </motion.div>
        
        {/* Right column: Sticky Order summary box */}
        {cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="w-full lg:w-1/3"
          >
            <div className="sticky top-[100px] bg-white border border-outline flex flex-col gap-0 overflow-hidden">
              <div className="px-8 py-6 border-b border-outline bg-surface-container-low">
                <h2 className="font-label-caps text-[11px] tracking-[0.25em] uppercase text-on-background font-semibold">Order Summary</h2>
              </div>
              
              <div className="px-8 py-8 flex flex-col gap-5">
                <div className="flex flex-col gap-4 font-body text-[14px]">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Shipping</span>
                    <span className={shippingCharge === 0 ? "text-primary font-medium" : ""}>{shippingCharge === 0 ? "Complimentary" : `₹${shippingCharge}`}</span>
                  </div>

                  {appliedDiscountPercent > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Discount ({appliedCodeName})</span>
                      <span className="font-medium">-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-on-background pt-5 border-t border-outline mt-2">
                    <span className="font-display text-[20px] font-light">Estimated Total</span>
                    <span className="font-display text-[20px] font-light">₹{total.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Promo Coupon Form */}
                <div className="pt-2">
                  <label htmlFor="couponInput" className="sr-only">Gift card or discount code</label>
                  <div className="flex border border-outline focus-within:border-on-background transition-colors">
                    <input 
                      type="text" 
                      id="couponInput" 
                      placeholder="Promo or gift code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-transparent px-4 py-3 font-body text-[13px] font-light text-on-background placeholder-on-surface-variant/50 focus:outline-none" 
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="font-label-caps text-[9px] tracking-[0.2em] uppercase text-primary hover:text-on-background transition-colors px-4 cursor-pointer font-semibold border-l border-outline shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                  {couponSuccess && <p className="text-[11px] text-primary mt-2 font-medium">{couponSuccess}</p>}
                  {couponError && <p className="text-[11px] text-error mt-2 font-medium">{couponError}</p>}
                </div>
                
                <Link
                  href="/checkout"
                  className="w-full bg-on-background text-white py-4.5 font-label-caps text-[11px] tracking-[0.2em] uppercase hover:bg-primary transition-all duration-300 flex items-center justify-center font-medium shadow-luxury"
                >
                  Proceed to Checkout
                </Link>
                
                <div className="flex items-center justify-center gap-2 text-on-surface-variant/60">
                  <Lock size={12} className="stroke-[1.5]" />
                  <span className="font-label-caps text-[9px] tracking-[0.2em] uppercase">Secure Encrypted Payment</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        </div>
      </div>
    </main>
  );
}
