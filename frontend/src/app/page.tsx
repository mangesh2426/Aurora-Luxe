"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/store/useStore";
import { ShieldCheck, Droplets, HeartHandshake, Award, Star, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import api, { mapBackendProduct } from "@/lib/api";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const [bestRes, newRes] = await Promise.all([
          api.get('/products?bestSeller=true'),
          api.get('/products?newArrival=true')
        ]);
        setBestSellers(bestRes.data.data.map(mapBackendProduct).slice(0, 4));
        setNewArrivals(newRes.data.data.map(mapBackendProduct).slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <main className="flex-grow bg-[#FCFBF9] text-on-background overflow-hidden">
      
      {/* Hero Frame Section */}
      <section className="w-full bg-white py-6 md:py-12 border-b border-outline/50">
        <div className="max-w-container-max mx-auto px-4 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[75vh] md:min-h-[80vh] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-outline/10">
            {/* Left Column: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="col-span-1 md:col-span-6 bg-[#FCFBF9] flex flex-col justify-center px-8 py-14 md:px-20 md:py-24 relative"
            >
              {/* Luxury gold circle background asset */}
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <span className="font-label-caps text-[10px] tracking-[0.3em] uppercase text-primary font-bold mb-5 block">
                Premium Anti-Tarnish Curation
              </span>
              <h1 className="font-display text-[44px] sm:text-[56px] md:text-[66px] leading-[1.15] text-on-background font-light tracking-wide mb-7">
                Jewellery <br />
                <span className="italic font-normal text-primary font-display">Made to Live In</span>
              </h1>
              <p className="font-body text-[13.5px] text-on-surface-variant/90 font-light tracking-wide leading-relaxed mb-9 max-w-md">
                Luxurious, waterproof, and skin-friendly pieces forged for everyday radiance. Wear it in the shower, at the gym, and everywhere in between without ever losing its golden shine.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Link
                  href="/shop?sort=new"
                  className="px-9 py-4.5 bg-[#111111] text-white font-label-caps text-[10px] tracking-[0.25em] uppercase hover:bg-primary transition-all duration-350 text-center font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Shop New Arrivals
                </Link>
                <Link
                  href="/shop"
                  className="px-9 py-4.5 border border-[#111111]/25 bg-transparent text-on-background font-label-caps text-[10px] tracking-[0.25em] uppercase hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all duration-350 text-center font-semibold rounded-xl"
                >
                  Explore Catalog
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Model Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="col-span-1 md:col-span-6 relative min-h-[45vh] md:min-h-auto w-full select-none"
            >
              <Image
                src="/hero_model.png"
                alt="Model wearing anti-tarnish gold jewellery"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Luxury Glassmorphic Overlay Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.7 }}
                className="absolute bottom-8 right-8 bg-white/80 backdrop-blur-md px-7 py-5 border border-white/20 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.06)]"
              >
                <h4 className="font-display text-[18px] text-on-background font-medium tracking-wide">18K Gold Vacuum Plated</h4>
                <p className="font-label-caps text-[9px] tracking-[0.18em] text-primary uppercase mt-1.5 font-bold">Lifetime Color Warranty</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Pillars / Trust Indicators */}
      <section className="py-20 bg-white border-b border-outline/10">
        <div className="max-w-container-max mx-auto px-4 md:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-outline/25">
            {[
              {
                icon: <ShieldCheck size={28} className="text-primary stroke-[1.25]" />,
                title: "Anti-Tarnish Coating",
                desc: "Advanced physical vapor deposition (PVD) stops rusting and green skin."
              },
              {
                icon: <Droplets size={28} className="text-primary stroke-[1.25]" />,
                title: "100% Waterproof",
                desc: "Shower, swim, or sweat in your favourite gold pieces without worry."
              },
              {
                icon: <HeartHandshake size={28} className="text-primary stroke-[1.25]" />,
                title: "100% Skin Safe",
                desc: "Hypoallergenic, nickel-free, and lead-free bases for sensitive skin."
              },
              {
                icon: <Award size={28} className="text-primary stroke-[1.25]" />,
                title: "Premium Base Metals",
                desc: "Forged on solid 925 sterling silver or surgical-grade stainless steel."
              }
            ].map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`flex flex-col items-center text-center gap-4 px-6 ${idx > 0 ? "pt-8 sm:pt-0" : ""}`}
              >
                <div className="p-3 bg-[#FCFBF9] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.015)] border border-outline/10">
                  {pillar.icon}
                </div>
                <span className="font-label-caps text-[10px] tracking-[0.2em] uppercase font-bold text-on-surface">{pillar.title}</span>
                <p className="font-body text-[12.5px] text-on-surface-variant/85 font-light leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-24 max-w-container-max mx-auto px-4 md:px-16">
        <div className="text-center mb-16">
          <span className="font-label-caps text-[9px] tracking-[0.3em] uppercase text-primary font-bold mb-3 block">Discover Curation</span>
          <h2 className="font-display text-[40px] md:text-[52px] font-light text-on-background">Shop By Category</h2>
          <div className="w-12 h-[1px] bg-primary/40 mx-auto mt-4"></div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 justify-center">
          {[
            { name: "Earrings", img: "/earrings.png" },
            { name: "Rings", img: "/rings.png" },
            { name: "Necklaces", img: "/necklaces.png" },
            { name: "Bracelets", img: "/bracelets.png" },
            { name: "Combos", img: "/combos.png" }
          ].map((category, idx) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
            >
              <Link href={`/shop?category=${category.name}`} className="group flex flex-col items-center cursor-pointer">
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border border-outline/25 relative select-none group-hover:scale-105 group-hover:border-primary group-hover:shadow-[0_15px_30px_rgba(197,159,39,0.12)] transition-all duration-500 shadow-md">
                  <Image src={category.img} alt={category.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/[0.02] group-hover:bg-transparent transition-colors duration-300"></div>
                </div>
                <span className="font-display text-[18px] md:text-[20px] text-on-background mt-4 group-hover:text-primary transition-colors tracking-wide font-light">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-24 border-t border-outline/10 bg-[#FAF8F5]/30">
        <div className="max-w-container-max mx-auto px-4 md:px-16">
          <div className="text-center mb-16">
            <span className="font-label-caps text-[9px] tracking-[0.3em] uppercase text-primary font-bold mb-3 block">Customer Favourites</span>
            <h2 className="font-display text-[40px] md:text-[52px] font-light">Best Sellers</h2>
            <div className="w-12 h-[1px] bg-primary/40 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-2 md:col-span-4 flex justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={36} />
              </div>
            ) : (
              bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Anti-Tarnish Science & Guarantee Section */}
      <section className="py-24 bg-[#111111] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C59F27]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-container-max mx-auto px-4 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left text column */}
            <div className="lg:col-span-6 z-10">
              <span className="font-label-caps text-[10px] tracking-[0.25em] text-[#C59F27] uppercase font-bold mb-4 block">
                The Science of Shine
              </span>
              <h2 className="font-display text-[38px] md:text-[50px] font-light leading-[1.2] mb-6">
                Designed for Life. <br />
                <span className="italic font-normal text-[#C59F27]">Guaranteed Forever.</span>
              </h2>
              <p className="font-body text-[13.5px] text-white/75 font-light leading-relaxed mb-8">
                Traditional flash plating wears off after a few uses, exposing base metals that corrode and leave ugly green stains on your skin. Our jewelry is crafted using advanced <strong>Physical Vapor Deposition (PVD)</strong>.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-[#C59F27] text-[26px]">water_drop</span>
                  <div>
                    <h5 className="font-display text-[17px] font-medium tracking-wide mb-1">Shower & Sweat Proof</h5>
                    <p className="font-body text-[12px] text-white/60 font-light">Wear it at the gym or in the pool without losing its brilliant golden coating.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-[#C59F27] text-[26px]">spa</span>
                  <div>
                    <h5 className="font-display text-[17px] font-medium tracking-wide mb-1">Hypoallergenic Safe</h5>
                    <p className="font-body text-[12px] text-white/60 font-light">100% free from nickel, lead, and chromium. Completely safe for hyper-sensitive skin.</p>
                  </div>
                </div>
              </div>

              <Link
                href="/shop"
                className="inline-block px-10 py-4.5 bg-[#C59F27] text-[#111111] hover:bg-white hover:text-[#111111] font-label-caps text-[10px] tracking-[0.25em] uppercase transition-all duration-350 font-bold rounded-xl shadow-lg"
              >
                Shop Our Guarantee
              </Link>
            </div>

            {/* Right visual science column */}
            <div className="lg:col-span-6 relative flex justify-center z-10">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                <Image
                  src="/necklaces.png"
                  alt="Premium anti-tarnish vacuum plated gold necklace"
                  fill
                  className="object-cover brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-6 glass-panel rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md flex justify-between items-center text-white">
                  <div>
                    <p className="font-label-caps text-[8.5px] tracking-widest text-[#C59F27] uppercase font-bold">Base Material</p>
                    <h6 className="font-display text-[15px] font-semibold">Sterling Silver / 316L Steel</h6>
                  </div>
                  <div className="text-right">
                    <p className="font-label-caps text-[8.5px] tracking-widest text-[#C59F27] uppercase font-bold">Plating Thickness</p>
                    <h6 className="font-display text-[15px] font-semibold">10x Standard Flash</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-24 bg-white">
        <div className="max-w-container-max mx-auto px-4 md:px-16">
          <div className="text-center mb-16">
            <span className="font-label-caps text-[9px] tracking-[0.3em] uppercase text-primary font-bold mb-3 block">New Releases</span>
            <h2 className="font-display text-[40px] md:text-[52px] font-light">New Arrivals</h2>
            <div className="w-12 h-[1px] bg-primary/40 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-2 md:col-span-4 flex justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={36} />
              </div>
            ) : (
              newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-[#FAF8F5] border-y border-outline/25">
        <div className="max-w-container-max mx-auto px-4 md:px-16">
          <div className="text-center mb-16">
            <span className="font-label-caps text-[9px] tracking-[0.3em] uppercase text-primary font-bold mb-3 block">Testimonials</span>
            <h2 className="font-display text-[40px] md:text-[52px] font-light text-on-background">Loved By Thousands</h2>
            <div className="w-12 h-[1px] bg-primary/40 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "\"I was highly skeptical about the anti-tarnish claim, but I've been wearing the Lumina pendant in the shower and gym for 3 months now. It still shines like new! Highly recommended!\"",
                author: "Kriti S.",
                loc: "Mumbai"
              },
              {
                text: "\"The champagne gold finish is so subtle and elegant—none of that cheap brassy yellow look. It's the perfect daily accessory for professional office settings.\"",
                author: "Shreya M.",
                loc: "Delhi"
              },
              {
                text: "\"Unboxing felt so luxurious! The suede pouch and care manual are beautiful touches. I purchased the Stacking Rings set as a gift, and now I'm ordering for myself!\"",
                author: "Pooja R.",
                loc: "Kolkata"
              }
            ].map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white p-10 border border-outline/10 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.015)] rounded-2xl hover:shadow-[0_15px_35px_rgba(197,159,39,0.05)] transition-all duration-300"
              >
                <div className="flex gap-1 text-[#C59F27] mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-[#C59F27] text-[#C59F27]" />
                  ))}
                </div>
                <p className="font-body text-[13.5px] text-on-surface-variant/90 font-light italic leading-relaxed mb-8">
                  {t.text}
                </p>
                <div className="flex items-center justify-between border-t border-outline/10 pt-4" suppressHydrationWarning>
                  <div>
                    <h4 className="font-display text-[16px] text-on-background font-semibold tracking-wide">{t.author}</h4>
                    <span className="font-label-caps text-[8.5px] tracking-[0.15em] text-[#C59F27] uppercase font-bold">{t.loc}</span>
                  </div>
                  <span className="font-label-caps text-[7.5px] bg-[#C59F27]/10 text-[#C59F27] px-2 py-0.5 uppercase tracking-widest font-bold rounded">Verified Muse</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram / Lifestyle Gallery Section */}
      <section className="py-24 bg-white border-b border-outline/10">
        <div className="max-w-container-max mx-auto px-4 md:px-16">
          <div className="text-center mb-16">
            <span className="font-label-caps text-[9px] tracking-[0.3em] uppercase text-primary font-bold mb-3 block">Social Inspiration</span>
            <h2 className="font-display text-[40px] md:text-[52px] font-light">Lifestyle Showcase</h2>
            <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant/80 mt-2">Mention us <span className="text-primary font-semibold">@AuroraLuxe</span> to be featured</p>
            <div className="w-12 h-[1px] bg-primary/40 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { img: "/bracelets.png", name: "Classic Chain Bracelet" },
              { img: "/rings.png", name: "Stacking Bands Curation" },
              { img: "/earrings.png", name: "Twisted Golden Hoops" },
              { img: "/necklaces.png", name: "Lumina Pendant Style" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative aspect-square bg-[#FCFBF9] rounded-2xl overflow-hidden shadow-sm border border-outline/10"
              >
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Frosted glass overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-4">
                  <Star size={20} className="fill-white text-white mb-2" />
                  <p className="font-display text-[15px] font-medium tracking-wide text-center">{item.name}</p>
                  <p className="font-label-caps text-[8.5px] tracking-widest text-[#C59F27] uppercase font-bold mt-1">Shop The Curation</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-[#FCFBF9]">
        <div className="max-w-container-max mx-auto px-4 md:px-16">
          <div className="relative rounded-3xl overflow-hidden bg-[#111111] text-white py-16 px-8 md:px-16 border border-[#C59F27]/15 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="max-w-xl mx-auto text-center relative z-10">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-white/5 rounded-full border border-white/10 text-primary">
                  <Mail size={24} className="stroke-[1.5]" />
                </div>
              </div>
              
              <h2 className="font-display text-[32px] md:text-[44px] font-light mb-4">Join The Aurora Circle</h2>
              <p className="font-body text-[13px] md:text-[14px] text-white/70 font-light tracking-wide leading-relaxed mb-8">
                Subscribe to receive early notification of limited-edition drops, private sales, and 10% off your next golden acquisition.
              </p>

              {subscribed ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-[#C59F27]/10 border border-[#C59F27]/30 rounded-2xl p-4 flex items-center justify-center gap-3 text-[#C59F27]"
                >
                  <CheckCircle2 size={18} />
                  <span className="font-label-caps text-[11px] tracking-widest uppercase font-semibold">Welcome to the Circle. Check your inbox.</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-[13px] text-white placeholder-white/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body font-light"
                  />
                  <button
                    type="submit"
                    className="bg-[#C59F27] hover:bg-white text-[#111111] hover:text-[#111111] transition-all duration-300 px-8 py-3.5 font-label-caps text-[10px] tracking-widest uppercase font-bold rounded-xl shadow-lg cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
