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
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8 pb-32 bg-white text-on-background flex flex-col gap-16 overflow-hidden">
      <header className="flex justify-between items-end border-b border-outline pb-8">
        <h1 className="font-display text-[40px] md:text-[56px] leading-[1.1] text-on-background">Your Cart</h1>
        <span className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant mb-4 font-semibold">{cart.length} Items</span>
      </header>
      
      <div className="flex flex-col lg:flex-row gap-16 relative">
        {/* Left column: Cart Items list */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-2/3 flex flex-col gap-8"
        >
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-outline bg-surface-container-low shadow-sm">
              <ShoppingBag size={64} className="text-outline mb-6 stroke-[1.2]" />
              <h2 className="font-display text-[32px] text-on-background mb-4 font-semibold">Your Cart is Empty</h2>
              <p className="font-body text-[14px] font-light tracking-[0.05em] text-on-surface-variant mb-10 max-w-md">Looks like you haven't added anything to your cart yet.</p>
              <Link href="/shop" className="px-10 py-4 bg-primary text-on-primary font-label-caps text-[12px] tracking-[0.2em] uppercase hover:bg-primary-container transition-colors border border-transparent font-semibold">
                EXPLORE COLLECTIONS
              </Link>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex gap-8 pb-8 border-b border-outline relative group items-start">
                <Link href={`/product/${item.id}`} className="w-32 md:w-44 aspect-[4/5] shrink-0 bg-surface-container-low relative overflow-hidden border border-outline/30">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                </Link>
                
                <div className="flex flex-col justify-between flex-grow self-stretch py-2">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/product/${item.id}`}>
                        <h3 className="font-display text-[22px] md:text-[24px] text-on-background hover:text-primary transition-colors leading-tight font-medium">{item.name}</h3>
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedFinish, item.selectedMaterial)}
                        aria-label="Remove item"
                        className="text-on-surface-variant hover:text-error transition-colors p-2 border border-outline rounded-full cursor-pointer"
                      >
                        <X size={16} className="stroke-[1.5]" />
                      </button>
                    </div>
                    <p className="font-body text-[11px] tracking-[0.1em] text-on-surface-variant mb-4 uppercase font-medium">
                      Finish: {item.selectedFinish} / Base: {item.selectedMaterial}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <QuantitySelector
                      quantity={item.quantity}
                      onIncrease={() => updateCartQty(item.id, item.selectedFinish, item.selectedMaterial, item.quantity + 1)}
                      onDecrease={() => updateCartQty(item.id, item.selectedFinish, item.selectedMaterial, item.quantity - 1)}
                      size="sm"
                    />
                    <span className="font-body text-[18px] text-primary tracking-wider font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {cart.length > 0 && (
            <div className="mt-6">
              <Link href="/shop" className="btn px-8 py-3 border border-outline font-label-caps text-[10px] tracking-widest uppercase hover:bg-surface-container-low transition-colors flex items-center w-fit font-semibold">
                <ArrowLeft size={14} className="mr-2 stroke-[1.5]" /> Continue Shopping
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
            <div className="sticky top-[140px] bg-surface-container-low p-8 border border-outline flex flex-col gap-8 shadow-sm">
              <h2 className="font-label-caps text-[12px] tracking-[0.2em] uppercase text-on-background border-b border-outline pb-6 font-semibold">Order Summary</h2>
              
              <div className="flex flex-col gap-4 font-body text-[14px]">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-on-surface-variant">
                  <span>Shipping</span>
                  <span>{shippingCharge === 0 ? "Complimentary" : `₹₹{shippingCharge}`}</span>
                </div>

                {appliedDiscountPercent > 0 && (
                  <div className="flex justify-between text-primary font-semibold">
                    <span>Discount ({appliedCodeName})</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-body text-[18px] text-primary pt-6 border-t border-outline mt-2 tracking-wider font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
              
              {/* Promo Coupon Form */}
              <div className="pt-4">
                <label htmlFor="couponInput" className="sr-only">Gift card or discount code</label>
                <div className="flex border-b border-outline pb-4">
                  <input 
                    type="text" 
                    id="couponInput" 
                    placeholder="Gift card or promo code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 font-body text-[14px] font-light text-on-background placeholder-on-surface-variant focus:outline-none" 
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-primary hover:text-primary-container transition-colors ml-4 cursor-pointer font-semibold"
                  >
                    APPLY
                  </button>
                </div>
                {couponSuccess && <p className="text-[11px] text-success mt-2 font-medium">{couponSuccess}</p>}
                {couponError && <p className="text-[11px] text-error mt-2 font-medium">{couponError}</p>}
              </div>
              
              <Link
                href="/checkout"
                className="w-full bg-on-background text-white py-4 font-label-caps text-[12px] tracking-[0.2em] uppercase hover:bg-primary transition-colors flex items-center justify-center font-bold"
              >
                PROCEED TO CHECKOUT
              </Link>
              
              <div className="flex items-center justify-center gap-3 text-on-surface-variant mt-2">
                <Lock size={16} className="stroke-[1.5]" />
                <span className="font-label-caps text-[10px] tracking-[0.15em] uppercase font-semibold">Secure Encrypted Payment</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Reusable cross-sell section */}
      <section className="mt-24 border-t border-outline/30 pt-24">
        <div className="flex flex-col items-center mb-16">
          <h2 className="font-display text-[36px] text-on-background mb-4 font-light">You Might Also Like</h2>
          <div className="w-[40px] h-[1px] bg-primary"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {PRODUCTS.slice(4, 8).map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
              <Link href={`/product/${product.id}`} className="group cursor-pointer">
                <div className="aspect-[4/5] bg-surface-container-low overflow-hidden mb-6 relative border border-outline/30">
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                </div>
                <div className="text-center">
                  <h3 className="font-display text-[18px] text-on-background mb-2 group-hover:text-primary transition-colors font-medium">{product.name}</h3>
                  <p className="font-body text-[14px] text-primary tracking-wider font-semibold">₹{product.price.toLocaleString()}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
