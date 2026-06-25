"use client";
import { useEffect, useRef } from "react";

/**
 * MouseGlow – a subtle radial gold glow that follows the cursor.
 * Completely pointer-events-none so it never interferes with clicks.
 * Highly optimized using vanilla DOM refs to prevent any React rendering lag.
 */
export default function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;

    const move = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      if (glowRef.current) {
        // LERP for smooth easing without heavy spring math
        currentX += (targetX - currentX) * 0.15;
        currentY += (targetY - currentY) * 0.15;
        glowRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 hidden md:block overflow-hidden"
      aria-hidden="true"
    >
      <div
        ref={glowRef}
        className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(197,159,39,0.035)_0%,transparent_70%)] pointer-events-none will-change-transform"
      />
    </div>
  );
}
