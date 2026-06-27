"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@/store/useStore";
import api from "@/lib/api";
import { checkoutSchema, CheckoutFields } from "@/lib/validation";
import { Order, Customer } from "@/types";
import { ShieldCheck, CreditCard, Smartphone, ChevronRight, ArrowLeft, Loader2, RotateCcw, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, placeOrder, user } = useStore();

  const [activeDiscount, setActiveDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<"Razorpay" | "COD">("Razorpay");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Razorpay simulator views
  const [razorpayOpen, setRazorpayOpen] = useState(false);
  const [paymentOption, setPaymentOption] = useState<"options" | "card" | "upi" | "processing">("options");
  const [formDataCache, setFormDataCache] = useState<CheckoutFields | null>(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState("");

  // Auto-redirect after 5 seconds if Success Modal is open
  useEffect(() => {
    if (showSuccessModal && createdOrderId) {
      const timer = setTimeout(() => {
        router.push(`/tracking?orderId=${createdOrderId}`);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, createdOrderId, router]);

  useEffect(() => {
    const cached = localStorage.getItem("aurora_active_discount");
    if (cached) {
      setActiveDiscount(JSON.parse(cached));
    }

    if (cart.length === 0) {
      router.push("/shop");
    } else if (!user) {
      alert("Please sign in to complete your checkout.");
      router.push("/login");
    }
  }, [cart, user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CheckoutFields>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || "",
      phone: "",
      firstName: "Riya",
      lastName: "Sen",
      address: "H.No. 12, Park Street",
      apartment: "Floor 2, Flat C",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700016",
      paymentMethod: "Razorpay"
    }
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  let shipping = subtotal >= 1999 ? 0 : 99;
  if (selectedPayment === "COD") {
    shipping += 50; // extra COD charge
  }

  const discount = activeDiscount ? Math.round(subtotal * (activeDiscount.percent / 100)) : 0;
  const total = subtotal + shipping - discount;

  const handleCheckoutSubmit = (formData: CheckoutFields) => {
    setFormDataCache(formData);
    if (formData.paymentMethod === "Razorpay") {
      setPaymentOption("options");
      setRazorpayOpen(true);
    } else {
      // COD direct checkout
      completeOrder(formData, "Unpaid");
    }
  };

  const handleRazorpayMockSuccess = () => {
    setPaymentOption("processing");
    setTimeout(() => {
      if (formDataCache) {
        completeOrder(formDataCache, "Paid");
      }
    }, 2000);
  };

  const completeOrder = async (fields: CheckoutFields, paymentStatus: "Paid" | "Unpaid") => {
    setIsSubmitting(true);
    const orderId = `AL-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderDate = new Date().toISOString().split("T")[0];

    const customerDetails: Customer = {
      name: `${fields.firstName} ${fields.lastName}`,
      email: fields.email,
      phone: fields.phone,
      address: `${fields.address}${fields.apartment ? ", " + fields.apartment : ""}`,
      city: fields.city,
      state: fields.state,
      pincode: fields.pincode
    };

    const newOrder: Order = {
      id: orderId,
      date: orderDate,
      items: [...cart],
      total: total,
      status: "Placed",
      paymentStatus: paymentStatus,
      paymentMethod: fields.paymentMethod === "Razorpay" ? "Razorpay Secure" : "Cash on Delivery",
      customer: customerDetails
    };

    try {
      await api.post('/orders/direct', {
        id: orderId,
        items: cart.map(item => ({ id: item.id, quantity: item.quantity, price: item.price })),
        totalAmount: total,
        shippingAddress: customerDetails,
        paymentMethod: fields.paymentMethod === "Razorpay" ? "Razorpay Secure" : "Cash on Delivery",
        paymentStatus: paymentStatus
      });
      
      // Call email notification API safely in the background
      try {
        await fetch('/api/orders/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            customer: customerDetails,
            items: cart,
            total,
            paymentMethod: fields.paymentMethod === "Razorpay" ? "Razorpay Secure" : "Cash on Delivery",
            paymentStatus
          })
        });
      } catch (notifyErr) {
        console.error("Failed to send order emails", notifyErr);
      }
      
      placeOrder(newOrder);
      clearCart();
      localStorage.removeItem("aurora_active_discount");
      setRazorpayOpen(false);
      setCreatedOrderId(orderId);
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      alert("Failed to create order on server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <main className="bg-background text-on-background overflow-hidden">
      {/* Page Header */}
      <div className="bg-white border-b border-outline">
        <div className="max-w-container-max mx-auto px-6 md:px-16 py-12 flex items-end justify-between">
          <div>
            <nav className="font-label-caps text-[9px] tracking-[0.3em] uppercase text-on-surface-variant mb-4">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <span className="mx-3 text-outline/50">/</span>
              <span className="text-primary font-semibold">Secure Checkout</span>
            </nav>
            <h1 className="font-display text-[40px] md:text-[52px] leading-none text-on-background font-light tracking-wide">Secure Checkout</h1>
          </div>
          <div className="hidden md:flex items-center gap-2 text-on-surface-variant/60 mb-2">
            <Lock size={14} className="stroke-[1.5]" />
            <span className="font-label-caps text-[9px] tracking-widest uppercase">SSL Encrypted</span>
          </div>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-6 md:px-16 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        {/* Left Form Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7"
        >
          <form onSubmit={handleSubmit(handleCheckoutSubmit)} className="space-y-12">
            {/* Step 1: Contacts */}
            <div>
              <h2 className="font-display text-[24px] mb-8 flex items-center gap-4">
                <span className="w-8 h-8 bg-on-background text-white rounded-full flex items-center justify-center font-label-caps text-[11px] shrink-0">1</span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-label-caps text-[9px] tracking-[0.25em] uppercase text-on-surface-variant font-semibold">Email Address</label>
                  <input type="email" id="email" {...register("email")} className="h-12 border border-outline px-4 text-[13px] font-body focus:border-on-background focus:outline-none bg-white transition-colors" />
                  {errors.email && <span className="text-[11px] text-error font-medium">{errors.email.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="font-label-caps text-[9px] tracking-[0.25em] uppercase text-on-surface-variant font-semibold">Phone Number</label>
                  <input type="tel" id="phone" {...register("phone")} className="h-12 border border-outline px-4 text-[13px] font-body focus:border-on-background focus:outline-none bg-white transition-colors" placeholder="10 digits" />
                  {errors.phone && <span className="text-[11px] text-error font-medium">{errors.phone.message}</span>}
                </div>
              </div>
            </div>

            {/* Step 2: Shipping */}
            <div>
              <h2 className="font-display text-[24px] mb-8 flex items-center gap-4">
                <span className="w-8 h-8 bg-on-background text-white rounded-full flex items-center justify-center font-label-caps text-[11px] shrink-0">2</span>
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName" className="font-label-caps text-[9px] tracking-[0.25em] uppercase text-on-surface-variant font-semibold">First Name</label>
                  <input type="text" id="firstName" {...register("firstName")} className="h-12 border border-outline px-4 text-[13px] font-body focus:border-on-background focus:outline-none bg-white transition-colors" />
                  {errors.firstName && <span className="text-[11px] text-error font-medium">{errors.firstName.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="font-label-caps text-[9px] tracking-[0.25em] uppercase text-on-surface-variant font-semibold">Last Name</label>
                  <input type="text" id="lastName" {...register("lastName")} className="h-12 border border-outline px-4 text-[13px] font-body focus:border-on-background focus:outline-none bg-white transition-colors" />
                  {errors.lastName && <span className="text-[11px] text-error font-medium">{errors.lastName.message}</span>}
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label htmlFor="address" className="font-label-caps text-[9px] tracking-[0.25em] uppercase text-on-surface-variant font-semibold">Address Line 1</label>
                  <input type="text" id="address" {...register("address")} className="h-12 border border-outline px-4 text-[13px] font-body focus:border-on-background focus:outline-none bg-white transition-colors" placeholder="Street name and house number" />
                  {errors.address && <span className="text-[11px] text-error font-medium">{errors.address.message}</span>}
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label htmlFor="apartment" className="font-label-caps text-[9px] tracking-[0.25em] uppercase text-on-surface-variant font-semibold">Apartment, Floor, Unit <span className="normal-case text-on-surface-variant/50">(Optional)</span></label>
                  <input type="text" id="apartment" {...register("apartment")} className="h-12 border border-outline px-4 text-[13px] font-body focus:border-on-background focus:outline-none bg-white transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="city" className="font-label-caps text-[9px] tracking-[0.25em] uppercase text-on-surface-variant font-semibold">City</label>
                  <input type="text" id="city" {...register("city")} className="h-12 border border-outline px-4 text-[13px] font-body focus:border-on-background focus:outline-none bg-white transition-colors" />
                  {errors.city && <span className="text-[11px] text-error font-medium">{errors.city.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="state" className="font-label-caps text-[9px] tracking-[0.25em] uppercase text-on-surface-variant font-semibold">State</label>
                  <input type="text" id="state" {...register("state")} className="h-12 border border-outline px-4 text-[13px] font-body focus:border-on-background focus:outline-none bg-white transition-colors" />
                  {errors.state && <span className="text-[11px] text-error font-medium">{errors.state.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="pincode" className="font-label-caps text-[9px] tracking-[0.25em] uppercase text-on-surface-variant font-semibold">Pincode</label>
                  <input type="text" id="pincode" {...register("pincode")} className="h-12 border border-outline px-4 text-[13px] font-body focus:border-on-background focus:outline-none bg-white transition-colors" placeholder="6 digits" />
                  {errors.pincode && <span className="text-[11px] text-error font-medium">{errors.pincode.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-[9px] tracking-[0.25em] uppercase text-on-surface-variant font-semibold">Country</label>
                  <input type="text" value="India" disabled className="h-12 border border-outline px-4 text-[13px] font-body bg-surface-container-low text-on-surface-variant/60 cursor-not-allowed" />
                </div>
              </div>
            </div>

            {/* Step 3: Payment */}
            <div>
              <h2 className="font-display text-[24px] mb-8 flex items-center gap-4">
                <span className="w-8 h-8 bg-on-background text-white rounded-full flex items-center justify-center font-label-caps text-[11px] shrink-0">3</span>
                Payment Method
              </h2>
              <div className="space-y-4">
                {/* Razorpay */}
                <label className={`flex gap-5 p-6 border cursor-pointer select-none transition-all duration-300 ${
                  selectedPayment === "Razorpay" ? "border-on-background bg-surface-container-low" : "border-outline hover:border-on-background/40"
                }`}>
                  <input
                    type="radio"
                    value="Razorpay"
                    {...register("paymentMethod")}
                    checked={selectedPayment === "Razorpay"}
                    onChange={() => setSelectedPayment("Razorpay")}
                    className="mt-1 accent-primary"
                  />
                  <div>
                    <h4 className="font-display text-[18px] text-on-background flex items-center gap-3">
                      Razorpay Secure <ShieldCheck size={16} className="text-primary stroke-[1.5]" />
                    </h4>
                    <p className="font-body text-[12px] text-on-surface-variant font-light mt-1.5 leading-relaxed">Pay instantly with Credit/Debit cards, UPI handles, NetBanking, or wallets.</p>
                  </div>
                </label>
                
                {/* COD */}
                <label className={`flex gap-5 p-6 border cursor-pointer select-none transition-all duration-300 ${
                  selectedPayment === "COD" ? "border-on-background bg-surface-container-low" : "border-outline hover:border-on-background/40"
                }`}>
                  <input
                    type="radio"
                    value="COD"
                    {...register("paymentMethod")}
                    checked={selectedPayment === "COD"}
                    onChange={() => setSelectedPayment("COD")}
                    className="mt-1 accent-primary"
                  />
                  <div>
                    <h4 className="font-display text-[18px] text-on-background">Cash On Delivery</h4>
                    <p className="font-body text-[12px] text-on-surface-variant font-light mt-1.5 leading-relaxed">Pay in cash on parcel delivery. Adds ₹50 handling fee.</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-on-background text-white py-5 font-label-caps text-[11px] tracking-[0.25em] uppercase hover:bg-primary transition-all duration-300 flex items-center justify-center font-medium cursor-pointer shadow-luxury hover:shadow-luxury-hover"
            >
              Complete Order & Pay
            </button>
          </form>
        </motion.div>

        {/* Right Summary Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-5"
        >
          <div className="sticky top-[100px] border border-outline overflow-hidden">
            <div className="px-8 py-6 border-b border-outline bg-surface-container-low">
              <h3 className="font-label-caps text-[11px] tracking-[0.25em] uppercase text-on-background font-semibold">Your Order</h3>
            </div>
            
            <div className="px-8 py-8 flex flex-col gap-6 bg-white">
              <div className="max-h-[240px] overflow-y-auto divide-y divide-outline/30 -mx-2">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center py-4">
                    <div className="relative w-14 aspect-[3/4] bg-surface overflow-hidden border border-outline flex-shrink-0">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      <span className="absolute -top-1 -right-1 bg-on-background text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-display text-[15px] font-medium truncate text-on-background">{item.name}</h4>
                      <span className="font-body text-[10px] text-on-surface-variant uppercase tracking-wider">{item.selectedFinish}</span>
                    </div>
                    <span className="font-body text-[14px] text-on-background font-medium shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-outline pt-6 flex flex-col gap-3 font-body text-[13px] text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-primary font-medium" : ""}>{shipping === 0 ? "Complimentary" : `₹${shipping}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Discount ({activeDiscount?.code})</span>
                    <span className="font-medium">-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-on-background pt-5 border-t border-outline mt-2">
                  <span className="font-display text-[20px] font-light">Total</span>
                  <span className="font-display text-[20px] font-light">₹{total.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-5 border border-outline bg-surface-container-low">
                <RotateCcw size={16} className="text-primary stroke-[1.5] shrink-0 mt-0.5" />
                <p className="font-body text-[12px] font-light leading-relaxed text-on-surface-variant">
                  <strong className="font-semibold text-on-background">7-Day Easy Exchange:</strong> Exchange any piece for wrong size or finish within 7 days of delivery.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Razorpay Secure Gateway Simulator Modal */}
      <AnimatePresence>
        {razorpayOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm pointer-events-auto"
              onClick={() => setRazorpayOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: "-40%", x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.9, y: "-40%", x: "-50%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-1/2 left-1/2 w-full max-w-[420px] bg-white z-50 shadow-2xl overflow-hidden border border-outline/30"
            >
              {/* Header */}
              <div className="bg-[#0E1428] text-white p-6 relative">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[#9A9FA5]">Razorpay Secure Checkout</span>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-display text-[22px] tracking-widest text-[#E6C787] font-light">AURORA <span className="font-semibold text-white">LUXE</span></span>
                  <span className="font-body text-[18px] font-bold">₹{total.toLocaleString()}</span>
                </div>
                <button onClick={() => setRazorpayOpen(false)} className="absolute top-4 right-4 text-[#9A9FA5] hover:text-white text-[20px] cursor-pointer">&times;</button>
              </div>

              {/* Content view options */}
              <div className="p-6 bg-[#F8F9FA] min-h-[300px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {paymentOption === "options" && (
                    <motion.div
                      key="options"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 flex-1"
                    >
                      <p className="text-[11px] font-bold uppercase text-on-surface-variant tracking-wider">Cards, UPI & NetBanking</p>
                      
                      {/* Card link */}
                      <div onClick={() => setPaymentOption("card")} className="flex items-center gap-4 bg-white p-4 border border-[#E2E8F0] hover:border-primary/50 cursor-pointer transition-colors shadow-sm">
                        <CreditCard size={24} className="text-blue-500 stroke-[1.5]" />
                        <div className="flex-grow">
                          <span className="block text-[13px] font-bold">Card Payment</span>
                          <span className="block text-[10px] text-on-surface-variant font-light">Visa, MasterCard, RuPay cards</span>
                        </div>
                        <ChevronRight size={16} className="text-outline stroke-[1.5]" />
                      </div>

                      {/* UPI link */}
                      <div onClick={() => setPaymentOption("upi")} className="flex items-center gap-4 bg-white p-4 border border-[#E2E8F0] hover:border-primary/50 cursor-pointer transition-colors shadow-sm">
                        <Smartphone size={24} className="text-emerald-500 stroke-[1.5]" />
                        <div className="flex-grow">
                          <span className="block text-[13px] font-bold">UPI / GPay / PhonePe</span>
                          <span className="block text-[10px] text-on-surface-variant font-light">Pay instantly using UPI apps</span>
                        </div>
                        <ChevronRight size={16} className="text-outline stroke-[1.5]" />
                      </div>
                    </motion.div>
                  )}

                  {paymentOption === "card" && (
                    <motion.div
                      key="card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 flex-1"
                    >
                      <button onClick={() => setPaymentOption("options")} className="text-blue-500 text-[11px] font-bold flex items-center gap-1 mb-2 cursor-pointer">
                        <ArrowLeft size={14} className="stroke-[1.5]" /> Back to options
                      </button>
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase">Card Number</label>
                          <input type="text" className="h-10 border border-outline px-3 text-[13px] font-body bg-white outline-none" value="4111 2222 3333 4444" readOnly />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-on-surface-variant uppercase">Expiry</label>
                            <input type="text" className="h-10 border border-outline px-3 text-[13px] font-body bg-white outline-none" value="12/28" readOnly />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-on-surface-variant uppercase">CVV</label>
                            <input type="password" className="h-10 border border-outline px-3 text-[13px] font-body bg-white outline-none" value="123" readOnly />
                          </div>
                        </div>
                        <button onClick={handleRazorpayMockSuccess} className="w-full bg-blue-600 text-white h-11 text-[11px] font-semibold uppercase tracking-widest mt-2 hover:bg-blue-700 transition-colors cursor-pointer">
                          Pay Securely
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {paymentOption === "upi" && (
                    <motion.div
                      key="upi"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 flex-1"
                    >
                      <button onClick={() => setPaymentOption("options")} className="text-blue-500 text-[11px] font-bold flex items-center gap-1 mb-2 cursor-pointer">
                        <ArrowLeft size={14} className="stroke-[1.5]" /> Back to options
                      </button>
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase">UPI Handle ID</label>
                          <input type="text" className="h-10 border border-outline px-3 text-[13px] font-body bg-white outline-none" value="riya@okaxis" readOnly />
                        </div>
                        <button onClick={handleRazorpayMockSuccess} className="w-full bg-emerald-600 text-white h-11 text-[11px] font-semibold uppercase tracking-widest mt-2 hover:bg-emerald-700 transition-colors cursor-pointer">
                          Verify & Pay
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {paymentOption === "processing" && (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-12 flex-1"
                    >
                      <Loader2 size={48} className="text-blue-500 animate-spin mb-4 stroke-[1.5]" />
                      <h4 className="text-[15px] font-bold text-on-background">Processing Transaction...</h4>
                      <p className="text-[11px] text-on-surface-variant font-light mt-1">Please do not click back or refresh page</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="text-center text-[10px] text-[#A0AEC0] border-t border-[#E2E8F0] pt-4 mt-6 flex items-center justify-center gap-1">
                  <Lock size={10} className="stroke-[1.5]" /> Powered by Razorpay | PCI-DSS Compliant Secure
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Order Booking Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-md pointer-events-auto flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full max-w-[500px] bg-neutral-950 text-white p-8 relative border border-[#E6C787]/30 text-center shadow-2xl rounded-sm"
              >
                {/* Close Button */}
                <button
                  onClick={() => router.push(`/tracking?orderId=${createdOrderId}`)}
                  className="absolute top-4 right-4 text-neutral-400 hover:text-white text-[24px] cursor-pointer"
                >
                  &times;
                </button>

                {/* Animated Gold Sparkles and Check Icon */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="w-20 h-20 rounded-full border-2 border-[#E6C787] flex items-center justify-center text-[#E6C787]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-10 h-10"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </motion.div>
                    
                    {/* Floating Sparkles decoration */}
                    <motion.div
                      animate={{ y: [-2, 2, -2], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-3 -right-3 text-[#E6C787]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                    </motion.div>
                  </div>
                </div>

                {/* Luxury Typography */}
                <h3 className="font-display text-[20px] sm:text-[24px] tracking-[0.15em] text-[#E6C787] uppercase font-semibold mb-2">
                  Order Successfully Booked
                </h3>
                <p className="font-body text-[13px] text-neutral-300 font-light max-w-sm mx-auto mb-6">
                  Thank you for shopping with Aurora Luxe. Your payment has been confirmed, and your anti-tarnish jewelry piece is being prepared.
                </p>

                {/* Order Details Panel */}
                <div className="bg-neutral-900 border border-neutral-800 p-4 mb-6 rounded-sm text-left flex flex-col gap-2 font-body text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Order ID:</span>
                    <span className="font-semibold text-[#E6C787] tracking-wider">{createdOrderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Delivery Method:</span>
                    <span>Standard Express Shipping</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-800 pt-2 mt-2 font-semibold">
                    <span>Total Charged:</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => router.push(`/tracking?orderId=${createdOrderId}`)}
                    className="bg-[#E6C787] text-neutral-950 px-6 py-3 font-label-caps text-[11px] tracking-widest uppercase hover:bg-[#d8b877] font-bold transition-colors cursor-pointer w-full sm:w-auto text-center"
                  >
                    Track Your Order
                  </button>
                  <button
                    onClick={() => router.push("/shop")}
                    className="border border-neutral-600 text-white px-6 py-3 font-label-caps text-[11px] tracking-widest uppercase hover:bg-white hover:text-neutral-950 font-bold transition-all cursor-pointer w-full sm:w-auto text-center"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Auto Redirect Info */}
                <p className="text-[11px] text-neutral-500 mt-6 flex items-center justify-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E6C787] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E6C787]"></span>
                  </span>
                  Redirecting to live tracking page in a few seconds...
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
