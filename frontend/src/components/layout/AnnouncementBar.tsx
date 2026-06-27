"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ANNOUNCEMENTS = [
  "✨ Complimentary Shipping Above ₹1,999",
  "✨ Easy Returns",
  "✨ Premium Anti Tarnish Jewellery",
  "✨ Secure Payments"
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#111111] h-[40px] flex items-center justify-center overflow-hidden border-b border-white/5 relative z-50">
      <div className="relative w-full max-w-container-max px-6 flex justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={current}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="font-label-caps text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-primary font-medium text-center whitespace-nowrap"
            style={{ color: "#C9A227" }}
          >
            {ANNOUNCEMENTS[current]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
