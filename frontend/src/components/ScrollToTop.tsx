"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => setVisible(v > 0.12));
    return unsub;
  }, [scrollYProgress]);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-24 md:bottom-8 right-5 md:right-8 z-50 w-11 h-11 bg-[#111111] hover:bg-primary text-white rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_32px_rgba(197,159,39,0.25)] transition-all duration-300 cursor-pointer border border-white/10"
        >
          <ArrowUp size={18} className="stroke-[1.5]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
