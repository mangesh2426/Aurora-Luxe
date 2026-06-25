"use client";
import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function PageProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-primary origin-left z-[9999] pointer-events-none"
    />
  );
}
