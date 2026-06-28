"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import { viewport, fadeUp, staggerContainer } from "@/lib/animations";

// Load Google Font: Playfair Display for the main heading
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-playfair",
  display: "swap",
});

interface CollectionItem {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  label: string;
}

export default function FeaturedCollection() {
  const collections: CollectionItem[] = [
    {
      id: 1,
      title: "The Signature Series",
      description: "Our most iconic designs, crafted for the modern muse.",
      image: "/rings.png",
      link: "/shop?collection=signature",
      label: "Signature Collection"
    },
    {
      id: 2,
      title: "Lumina Essentials",
      description: "Everyday brilliance that never fades.",
      image: "/earrings.png",
      link: "/shop?collection=lumina",
      label: "Daily Essentials"
    },
    {
      id: 3,
      title: "Classic Gold",
      description: "Timeless chains and bands built for a lifetime.",
      image: "/bracelets.png",
      link: "/shop?collection=classic",
      label: "Heritage Gold"
    },
    {
      id: 4,
      title: "Imperial Combos",
      description: "Artfully matched sets to elevate your statement.",
      image: "/combos.png",
      link: "/shop?category=Combos",
      label: "Curated Sets"
    }
  ];

  // Helper function to render a card to ensure consistent structure, hover visual effects and responsive behavior
  const renderCard = (collection: CollectionItem, heightClass: string) => {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
        className={`relative overflow-hidden rounded-[20px] shadow-luxury border border-outline bg-surface-container-lowest transition-all duration-400 ease-out hover:-translate-y-[4px] hover:shadow-[0_0_15px_rgba(201,162,39,0.2)] hover:border-primary/45 group cursor-pointer ${heightClass}`}
      >
        {/* Absolute card link wrapper */}
        <Link href={collection.link} className="absolute inset-0 block z-20" aria-label={`Shop ${collection.title}`} />
        
        {/* Image and Subtle Gradient Overlay Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={collection.image}
            alt={collection.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center transition-transform duration-[1000ms] ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
          {/* Subtle bottom gradient layer for text readability (removes large black glass boxes) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none z-1" />
        </div>

        {/* Bottom content area */}
        <div className="absolute bottom-6 left-6 right-6 z-10 max-w-[520px] text-left flex flex-col gap-1.5 pointer-events-none">
          {/* Collection label */}
          <span className="text-[11px] tracking-[0.16em] uppercase text-primary font-semibold block">
            {collection.label}
          </span>
          
          {/* Collection title */}
          <h3 className="font-display text-[26px] md:text-[30px] text-white leading-tight font-light transition-transform duration-400 ease-out group-hover:-translate-y-1">
            {collection.title}
          </h3>
          
          {/* Description (max 2 lines) */}
          <p className="font-body text-[14px] text-gray-300 font-light line-clamp-2 leading-relaxed max-w-[450px]">
            {collection.description}
          </p>
          
          {/* CTA: Shop Collection (Always visible, arrow slides on hover) */}
          <div className="mt-2.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.1em] font-label-caps text-white font-medium group-hover:text-primary transition-colors duration-300">
              Shop Collection
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className={`luxury-section py-[90px] border-t border-outline/20 overflow-hidden relative ${playfair.variable}`}>
      {/* Subtle radial luxury gradient & gold micro-dot overlay */}
      <style dangerouslySetInnerHTML={{ __html: `
        .luxury-section {
          background: radial-gradient(circle at 50% 50%, #FCFBF9 0%, #F5F2EB 100%) !important;
          position: relative;
        }
        .luxury-section::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.025;
          pointer-events: none;
          background-image: radial-gradient(#C9A227 1.2px, transparent 1.2px);
          background-size: 28px 28px;
          z-index: 1;
        }
      `}} />

      <div className="max-w-[1180px] mx-auto px-6 md:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          className="flex flex-col items-center text-center mb-12 gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerContainer}
        >
          <motion.span 
            variants={fadeUp} 
            className="font-label-caps text-[11px] tracking-[0.3em] uppercase text-primary font-semibold block"
          >
            SIGNATURE COLLECTIONS
          </motion.span>
          <motion.h2 
            variants={fadeUp} 
            className="text-[32px] md:text-[44px] font-light text-on-background leading-tight font-serif"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Featured Collections
          </motion.h2>
          <motion.p 
            variants={fadeUp} 
            className="font-body text-[14px] md:text-[15px] text-on-surface-variant font-light max-w-[650px] leading-relaxed"
          >
            Discover timeless pieces crafted for everyday luxury.
          </motion.p>
        </motion.div>

        {/* Desktop/Laptop Layout (lg and above: 1024px+) */}
        <div className="hidden lg:grid grid-cols-2 gap-6 max-w-[1180px] mx-auto">
          {/* Left Column: Large featured collection */}
          <div className="flex flex-col">
            {renderCard(collections[0], "h-[380px] xl:h-[420px] w-full")}
          </div>
          {/* Right Column: Two stacked smaller collections */}
          <div className="flex flex-col gap-6">
            {renderCard(collections[1], "h-[280px] xl:h-[320px] w-full")}
            {renderCard(collections[2], "h-[280px] xl:h-[320px] w-full")}
          </div>
          {/* Second Row: Wide Banner */}
          <div className="col-span-2">
            {renderCard(collections[3], "h-[300px] xl:h-[340px] w-full")}
          </div>
        </div>

        {/* Mobile/Tablet Layout (less than lg: <1024px) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden max-w-[1180px] mx-auto">
          {/* Card 1: Large Featured Card */}
          <div className="md:col-span-2">
            {renderCard(collections[0], "h-[280px] w-full")}
          </div>
          {/* Card 2: Smaller Card 1 */}
          <div className="col-span-1">
            {renderCard(collections[1], "h-[280px] w-full")}
          </div>
          {/* Card 3: Smaller Card 2 */}
          <div className="col-span-1">
            {renderCard(collections[2], "h-[280px] w-full")}
          </div>
          {/* Card 4: Wide Banner */}
          <div className="md:col-span-2">
            {renderCard(collections[3], "h-[280px] w-full")}
          </div>
        </div>

        {/* View All collections at the bottom */}
        <div className="flex justify-center mt-10">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-primary text-primary hover:bg-primary hover:text-white font-label-caps text-[11px] tracking-[0.2em] uppercase transition-all duration-300 font-medium rounded-sm bg-transparent shadow-sm hover:shadow-md"
          >
            View All Collections &rarr;
          </Link>
        </div>

      </div>
    </section>
  );
}
