"use client";
import { useEffect, useState } from "react";

const ANNOUNCEMENTS = [
  "✨ Complimentary Shipping on Orders over ₹1,999 ✨",
  "💖 Lifetime Warranty Against Tarnishing on All Pieces 💖",
  "🌟 Enjoy 10% Off Your First Acquisition — Code: GOLDEN10 🌟"
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % ANNOUNCEMENTS.length);
        setFade(true);
      }, 400);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#111111] py-2.5 text-center transition-all duration-300">
      <p
        className={`font-label-caps text-[9px] md:text-[9.5px] tracking-[0.25em] uppercase text-primary transition-all duration-500 font-medium ${
          fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
        }`}
      >
        {ANNOUNCEMENTS[current]}
      </p>
    </div>
  );
}
