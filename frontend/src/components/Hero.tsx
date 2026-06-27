"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "/hero_model.png",
      subtitle: "The Signature Collection",
      title: "Radiance\nRedefined",
      cta: "Explore Collection",
      link: "/shop?collection=signature"
    },
    {
      id: 2,
      image: "/necklaces.png",
      subtitle: "Lumina Essentials",
      title: "Timeless\nElegance",
      cta: "Shop Now",
      link: "/shop?collection=lumina"
    },
    {
      id: 3,
      image: "/rings.png",
      subtitle: "Bridal Curation",
      title: "Golden\nMoments",
      cta: "Learn More",
      link: "/shop?category=Rings"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-background">
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title.replace('\n', ' ')}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Luxury dark gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
        </motion.div>
      </AnimatePresence>

      {/* ── Content Container ── */}
      <div className="max-w-container-max mx-auto w-full px-6 md:px-16 relative z-10 flex flex-col items-center text-center mt-20">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="flex flex-col items-center"
          >
            <span className="font-label-caps text-[11px] md:text-[12px] tracking-[0.3em] uppercase text-white/90 font-medium mb-6">
              {slides[currentSlide].subtitle}
            </span>

            <h1 className="font-display text-[64px] sm:text-[80px] md:text-[100px] lg:text-[120px] leading-[0.95] text-white font-light tracking-tight mb-10 whitespace-pre-line drop-shadow-2xl">
              {slides[currentSlide].title}
            </h1>

            <Link
              href={slides[currentSlide].link}
              className="group relative flex items-center justify-center px-12 py-5 bg-white/10 backdrop-blur-md border border-white/40 text-white font-label-caps text-[11px] tracking-[0.25em] uppercase transition-all duration-500 font-medium rounded-sm overflow-hidden hover:bg-white hover:text-on-background"
            >
              <span className="relative z-10">{slides[currentSlide].cta}</span>
            </Link>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className="group py-2 px-1 cursor-pointer"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <div className={`h-[2px] transition-all duration-500 ease-out ${
              currentSlide === idx ? "w-10 bg-white" : "w-4 bg-white/40 group-hover:bg-white/70 group-hover:w-6"
            }`} />
          </button>
        ))}
      </div>
    </section>
  );
}
