"use client";
import Link from "next/link";
import { Instagram, Twitter, Facebook, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-on-background text-white w-full pb-[80px] md:pb-0 relative overflow-hidden">
      {/* Decorative Top Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 px-6 md:px-16 py-24 max-w-container-max mx-auto relative z-10">
        
        {/* Brand & Newsletter Section */}
        <div className="md:col-span-5 flex flex-col gap-8 pr-0 md:pr-16">
          <div className="font-display text-[32px] text-white tracking-[0.2em] font-light">
            AURORA <span className="text-primary font-medium tracking-[0.15em]">LUXE</span>
          </div>
          <p className="font-body text-[14px] text-white/70 font-light leading-relaxed max-w-sm">
            Premium, anti-tarnish jewelry crafted for modern elegance. Designed to endure, styled to inspire.
          </p>
          
          <div className="mt-4 max-w-sm">
            <h5 className="font-label-caps text-[10px] tracking-[0.25em] uppercase font-semibold text-white mb-4 flex items-center gap-2">
              <Mail size={14} className="text-primary" /> Join The Inner Circle
            </h5>
            <form onSubmit={(e) => e.preventDefault()} className="flex border-b border-white/30 hover:border-primary transition-colors duration-500 pb-2">
              <input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                className="bg-transparent border-none text-[12px] font-body tracking-[0.1em] py-2 w-full focus:outline-none placeholder:text-white/40 text-white uppercase"
              />
              <button type="submit" className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-primary font-medium hover:text-white transition-colors cursor-pointer px-2">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Links Sections */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <h4 className="font-label-caps text-[11px] tracking-[0.25em] uppercase text-primary font-semibold mb-2">Shop</h4>
          <Link href="/shop" className="font-body text-[14px] text-white/70 hover:text-white transition-colors duration-300 w-fit font-light">
            All Jewelry
          </Link>
          <Link href="/shop?isBestSeller=true" className="font-body text-[14px] text-white/70 hover:text-white transition-colors duration-300 w-fit font-light">
            Best Sellers
          </Link>
          <Link href="/shop?isNew=true" className="font-body text-[14px] text-white/70 hover:text-white transition-colors duration-300 w-fit font-light">
            New Arrivals
          </Link>
          <Link href="/shop?collection=signature" className="font-body text-[14px] text-white/70 hover:text-white transition-colors duration-300 w-fit font-light">
            Signature Collection
          </Link>
        </div>

        <div className="md:col-span-2 flex flex-col gap-6">
          <h4 className="font-label-caps text-[11px] tracking-[0.25em] uppercase text-primary font-semibold mb-2">Support</h4>
          <Link href="/shipping-policy" className="font-body text-[14px] text-white/70 hover:text-white transition-colors duration-300 w-fit font-light">
            Shipping Policy
          </Link>
          <Link href="/return-policy" className="font-body text-[14px] text-white/70 hover:text-white transition-colors duration-300 w-fit font-light">
            Return Policy
          </Link>
          <Link href="/privacy-policy" className="font-body text-[14px] text-white/70 hover:text-white transition-colors duration-300 w-fit font-light">
            Privacy Policy
          </Link>
          <Link href="/terms" className="font-body text-[14px] text-white/70 hover:text-white transition-colors duration-300 w-fit font-light">
            Terms of Service
          </Link>
        </div>

        <div className="md:col-span-3 flex flex-col gap-6">
          <h4 className="font-label-caps text-[11px] tracking-[0.25em] uppercase text-primary font-semibold mb-2">Boutique</h4>
          <Link href="/tracking" className="font-body text-[14px] text-white/70 hover:text-white transition-colors duration-300 w-fit font-light">
            Track Your Order
          </Link>
          <Link href="/contact" className="font-body text-[14px] text-white/70 hover:text-white transition-colors duration-300 w-fit font-light">
            Contact Us
          </Link>
          <Link href="/about" className="font-body text-[14px] text-white/70 hover:text-white transition-colors duration-300 w-fit font-light">
            Our Story
          </Link>
          
          <div className="flex gap-4 mt-6">
            <a href="#" aria-label="Instagram" className="text-white/70 hover:text-primary transition-colors p-2 border border-white/20 rounded-full hover:border-primary">
              <Instagram size={16} className="stroke-[1.5]" />
            </a>
            <a href="#" aria-label="Twitter" className="text-white/70 hover:text-primary transition-colors p-2 border border-white/20 rounded-full hover:border-primary">
              <Twitter size={16} className="stroke-[1.5]" />
            </a>
            <a href="#" aria-label="Facebook" className="text-white/70 hover:text-primary transition-colors p-2 border border-white/20 rounded-full hover:border-primary">
              <Facebook size={16} className="stroke-[1.5]" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-8 text-center bg-[#0a0a0a] flex flex-col md:flex-row justify-between items-center px-6 md:px-16 max-w-container-max mx-auto gap-6">
        <p className="font-label-caps text-[10px] text-white/50 tracking-[0.25em] uppercase">© {new Date().getFullYear()} AURORA LUXE. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-4 items-center opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-label-caps tracking-widest text-white/70">SECURE CHECKOUT</span>
          <div className="flex gap-2">
            <span className="border border-white/20 px-2 py-1 text-[9px] font-semibold tracking-wider rounded text-white/80">VISA</span>
            <span className="border border-white/20 px-2 py-1 text-[9px] font-semibold tracking-wider rounded text-white/80">MC</span>
            <span className="border border-white/20 px-2 py-1 text-[9px] font-semibold tracking-wider rounded text-white/80">AMEX</span>
            <span className="border border-white/20 px-2 py-1 text-[9px] font-semibold tracking-wider rounded text-white/80">UPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
