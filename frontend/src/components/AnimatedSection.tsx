"use client";
import { motion } from "framer-motion";
import { fadeUp, viewport } from "@/lib/animations";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  /** Override the delay (default 0) */
  delay?: number;
}

/**
 * AnimatedSection – drop-in wrapper that fades children in as they scroll into view.
 * Uses `whileInView` so it only triggers once.
 */
export default function AnimatedSection({ children, className = "", delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.65, ease: [0.0, 0.0, 0.2, 1.0], delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
