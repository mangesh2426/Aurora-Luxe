"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { viewport, fadeUp, staggerContainer, staggerItem } from "@/lib/animations";

export default function FeaturedCollection() {
  const collections = [
    {
      id: 1,
      title: "The Signature Series",
      description: "Our most iconic designs, crafted for the modern muse.",
      image: "/rings.png",
      link: "/shop?collection=signature",
      aspect: "aspect-[3/4]"
    },
    {
      id: 2,
      title: "Lumina Essentials",
      description: "Everyday brilliance that never fades.",
      image: "/earrings.png",
      link: "/shop?collection=lumina",
      aspect: "aspect-square"
    },
    {
      id: 3,
      title: "Classic Gold",
      description: "Timeless chains and bands built for a lifetime.",
      image: "/bracelets.png",
      link: "/shop?collection=classic",
      aspect: "aspect-[3/4]"
    }
  ];

  return (
    <section className="py-32 bg-background border-t border-outline/20">
      <div className="max-w-container-max mx-auto px-6 md:px-16">
        
        {/* Section Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerContainer}
        >
          <div className="max-w-xl">
            <motion.span variants={fadeUp} className="font-label-caps text-[10px] tracking-[0.3em] uppercase text-primary font-bold mb-4 block">
              Curated Selection
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-display text-[44px] md:text-[56px] font-light text-on-background leading-tight">
              Featured Collections
            </motion.h2>
          </div>
          <motion.div variants={fadeUp}>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-outline hover:border-primary text-on-background hover:text-primary font-label-caps text-[10px] tracking-[0.2em] uppercase transition-colors duration-400 font-medium rounded-sm"
            >
              View All
            </Link>
          </motion.div>
        </motion.div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Column 1 (Collection 1) */}
          <div className="md:col-span-5 flex flex-col gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeUp}
              className="group cursor-pointer flex flex-col"
            >
              <Link href={collections[0].link} className={`relative w-full ${collections[0].aspect} overflow-hidden rounded-md bg-surface-container-lowest`}>
                <Image
                  src={collections[0].image}
                  alt={collections[0].title}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
              </Link>
              <div className="mt-8 flex justify-between items-start">
                <div>
                  <h3 className="font-display text-[28px] text-on-background group-hover:text-primary transition-colors">{collections[0].title}</h3>
                  <p className="font-body text-[14px] text-on-surface-variant font-light mt-2 max-w-[280px]">{collections[0].description}</p>
                </div>
                <Link href={collections[0].link} className="font-label-caps text-[10px] tracking-widest text-primary uppercase border-b border-primary/30 pb-1 hover:border-primary transition-colors">
                  Shop Now
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Column 2 (Collections 2 & 3) */}
          <div className="md:col-span-7 flex flex-col gap-12 md:gap-24 md:pl-12">
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeUp}
              className="group cursor-pointer flex flex-col"
            >
              <Link href={collections[1].link} className={`relative w-full ${collections[1].aspect} overflow-hidden rounded-md bg-surface-container-lowest`}>
                <Image
                  src={collections[1].image}
                  alt={collections[1].title}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
              </Link>
              <div className="mt-8 flex justify-between items-start">
                <div>
                  <h3 className="font-display text-[28px] text-on-background group-hover:text-primary transition-colors">{collections[1].title}</h3>
                  <p className="font-body text-[14px] text-on-surface-variant font-light mt-2 max-w-[280px]">{collections[1].description}</p>
                </div>
                <Link href={collections[1].link} className="font-label-caps text-[10px] tracking-widest text-primary uppercase border-b border-primary/30 pb-1 hover:border-primary transition-colors">
                  Shop Now
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeUp}
              className="group cursor-pointer flex flex-col md:w-3/4 self-end"
            >
              <Link href={collections[2].link} className={`relative w-full ${collections[2].aspect} overflow-hidden rounded-md bg-surface-container-lowest`}>
                <Image
                  src={collections[2].image}
                  alt={collections[2].title}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
              </Link>
              <div className="mt-8 flex justify-between items-start">
                <div>
                  <h3 className="font-display text-[28px] text-on-background group-hover:text-primary transition-colors">{collections[2].title}</h3>
                  <p className="font-body text-[14px] text-on-surface-variant font-light mt-2 max-w-[280px]">{collections[2].description}</p>
                </div>
                <Link href={collections[2].link} className="font-label-caps text-[10px] tracking-widest text-primary uppercase border-b border-primary/30 pb-1 hover:border-primary transition-colors">
                  Shop Now
                </Link>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
