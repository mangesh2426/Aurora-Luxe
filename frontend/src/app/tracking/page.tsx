"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trackingSchema, TrackingFields } from "@/lib/validation";
import { useStore } from "@/store/useStore";
import api from "@/lib/api";
import { Order } from "@/types";
import { Receipt, Settings, Truck, Home, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function TrackingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { orders } = useStore();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<TrackingFields>({
    resolver: zodResolver(trackingSchema)
  });

  useEffect(() => {
    const fetchOrder = async (id: string) => {
      try {
        const res = await api.get(`/orders/track/${id}`);
        if (res.data.success) {
          setActiveOrder(res.data.data);
        } else {
          // fallback to local if not found in db
          const found = orders.find(o => o.id.toUpperCase() === id.toUpperCase());
          setActiveOrder(found || null);
        }
      } catch (err) {
        // fallback to local
        const found = orders.find(o => o.id.toUpperCase() === id.toUpperCase());
        setActiveOrder(found || null);
      }
    };

    const queryId = searchParams.get("orderId");
    if (queryId) {
      setValue("orderId", queryId);
      fetchOrder(queryId);
    } else {
      setActiveOrder(null);
    }
  }, [searchParams, orders, setValue]);

  const handleTrackSubmit = (data: TrackingFields) => {
    router.push(`/tracking?orderId=${data.orderId.toUpperCase()}`);
  };

  const resetTracking = () => {
    router.push("/tracking");
    setActiveOrder(null);
  };

  const getStepTimestamp = (label: string, order: Order) => {
    const formatDateTime = (dateStr?: string) => {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }) + ", " + d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    };

    const formatFallbackDate = (dateStr: string) => {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    };

    if (label === "Placed") {
      return formatDateTime(order.placedAt) || `${formatFallbackDate(order.date)}, 10:15 AM`;
    }
    if (label === "Processing") {
      return formatDateTime(order.processingAt);
    }
    if (label === "Shipped") {
      return formatDateTime(order.shippedAt);
    }
    if (label === "Delivered") {
      return formatDateTime(order.deliveredAt);
    }
    return null;
  };

  // Determine active step index: Placed=0, Processing=1, Shipped=2, Delivered=3
  const getStepIndex = (status: Order["status"]) => {
    if (status === "Placed") return 0;
    if (status === "Processing") return 1;
    if (status === "Shipped") return 2;
    if (status === "Delivered") return 3;
    return 0;
  };

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8 pb-32 bg-white text-on-background overflow-hidden">
      
      {!activeOrder ? (
        /* Input Form Screen */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-[480px] mx-auto bg-white border border-outline p-10 shadow-md"
        >
          <h2 className="font-display text-[32px] text-center mb-4 font-light">Track Your Order</h2>
          <p className="font-body text-[13px] text-on-surface-variant text-center font-light leading-relaxed mb-8">
            Please enter your unique 7-digit Order ID (e.g. AL-90145) to view its shipping status and transit history.
          </p>

          <form onSubmit={handleSubmit(handleTrackSubmit)} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="orderId" className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant">Order ID</label>
              <input
                type="text"
                id="orderId"
                {...register("orderId")}
                placeholder="AL-XXXXX"
                className="h-12 border border-outline px-4 text-[13px] font-body focus:border-primary outline-none uppercase"
              />
              {errors.orderId && <span className="text-[11px] text-error font-medium">{errors.orderId.message}</span>}
            </div>

            <button type="submit" className="w-full bg-on-background text-white h-12 font-label-caps text-[11px] tracking-widest uppercase hover:bg-primary transition-colors flex items-center justify-center font-bold cursor-pointer">
              Track Package
            </button>
          </form>

          <div className="mt-8 border-t border-outline/50 pt-6 text-center text-[12px] text-on-surface-variant font-light">
            Demo Order IDs: <strong>AL-89732</strong> or <strong>AL-90145</strong>
          </div>
        </motion.div>
      ) : (
        /* Status Results Timeline Screen */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto border border-outline p-8 md:p-12 shadow-sm bg-white"
        >
          <div className="border-b border-outline pb-6 mb-12 flex justify-between items-start flex-wrap gap-4">
            <div>
              <span className="font-label-caps text-[9px] tracking-widest text-on-surface-variant font-semibold uppercase">SHIPPING TRANSIT LOG</span>
              <h2 className="font-display text-[28px] md:text-[34px] leading-tight text-on-background mt-1 font-light">Order #{activeOrder.id}</h2>
              <p className="font-body text-[12px] text-on-surface-variant font-light mt-1">Order placed on: {activeOrder.date}</p>
            </div>
            <button
              onClick={resetTracking}
              className="px-6 py-2.5 border border-outline hover:border-on-background text-on-surface hover:text-on-background font-label-caps text-[9px] tracking-wider uppercase transition-colors cursor-pointer font-semibold"
            >
              Track Another Package
            </button>
          </div>

          {/* Responsive Timeline chart */}
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-12 md:gap-0 mt-8 mb-16 px-4 md:px-12">
            {/* Connecting Bar */}
            <div className="absolute top-1/2 left-[12%] right-[12%] h-0.5 bg-outline/50 z-10 hidden md:block" style={{ transform: "translateY(-50%)" }} />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getStepIndex(activeOrder.status) * 25.3}%` }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute top-1/2 left-[12%] h-0.5 bg-primary z-10 hidden md:block"
              style={{ transform: "translateY(-50%)" }}
            />

            {/* Steps details mapping */}
            {[
              { label: "Placed", icon: Receipt },
              { label: "Processing", icon: Settings },
              { label: "Shipped", icon: Truck },
              { label: "Delivered", icon: Home }
            ].map((step, idx) => {
              const activeIndex = getStepIndex(activeOrder.status);
              const isCompleted = idx < activeIndex || activeOrder.status === "Delivered";
              const isActive = idx === activeIndex && activeOrder.status !== "Delivered";
              const StepIcon = step.icon;

              return (
                <div key={idx} className="relative z-20 flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-md ${
                      isCompleted
                        ? "bg-primary border-primary text-white"
                        : isActive
                        ? "bg-white border-primary text-primary ring-4 ring-primary/10"
                        : "bg-white border-outline text-on-surface-variant/50"
                    }`}
                  >
                    <StepIcon size={18} className="stroke-[1.5]" />
                  </div>
                  <span className={`font-label-caps text-[10px] tracking-widest uppercase mt-4 block ${
                    isCompleted || isActive ? "text-on-background font-bold" : "text-on-surface-variant/50"
                  }`}>
                    {step.label}
                  </span>
                  <span className="font-body text-[9px] text-on-surface-variant/80 font-light mt-1">
                    {idx <= activeIndex ? (getStepTimestamp(step.label, activeOrder) || "--:--") : "--:--"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Shipping coordinates and items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-outline/50 pt-10">
            <div>
              <h3 className="font-display text-[20px] text-on-background mb-4 font-semibold">Recipient Details</h3>
              <div className="space-y-2.5 font-body text-[13px] text-on-surface-variant font-light leading-relaxed">
                <p><strong>Name:</strong> {activeOrder.customer.name}</p>
                <p><strong>Shipping address:</strong> {activeOrder.customer.address}, {activeOrder.customer.city}, {activeOrder.customer.state} - {activeOrder.customer.pincode}</p>
                <p><strong>Contact phone:</strong> {activeOrder.customer.phone}</p>
                <p><strong>Method:</strong> {activeOrder.paymentMethod} ({activeOrder.paymentStatus === "Paid" ? "Paid" : "Cash Pending"})</p>
              </div>
            </div>

            <div>
              <h3 className="font-display text-[20px] text-on-background mb-4 font-semibold">Items in Package</h3>
              <div className="space-y-4">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[13px]">
                    <div className="min-w-0 pr-4">
                      <span className="font-display text-[16px] text-on-background font-semibold block">{item.name}</span>
                      <span className="font-body text-[10px] text-on-surface-variant uppercase tracking-wider block font-semibold">{item.selectedFinish} x{item.quantity}</span>
                    </div>
                    <span className="font-body text-[14px] text-on-background font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                
                <div className="border-t border-outline/50 pt-4 flex justify-between font-body text-[16px] text-on-background font-bold tracking-wider">
                  <span>Total Value</span>
                  <span>₹{activeOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </main>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-40">
        <Loader2 size={36} className="animate-spin stroke-[1.5]" />
      </div>
    }>
      <TrackingContent />
    </Suspense>
  );
}
