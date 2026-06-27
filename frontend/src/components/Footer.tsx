"use client";
import Link from "next/link";
import { Mail } from "lucide-react";

// Brand icons inline SVGs (lucide-react deprecated them in newer versions)
const FacebookIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const PinterestIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.27 2.68 7.9 6.47 9.35-.08-.8-.16-2.03.03-2.9.18-.78 1.16-4.9 1.16-4.9s-.3-.58-.3-1.45c0-1.36.79-2.38 1.77-2.38.84 0 1.24.63 1.24 1.38 0 .84-.53 2.1-.81 3.27-.23.97.49 1.76 1.44 1.76 1.73 0 3.06-1.83 3.06-4.47 0-2.34-1.68-3.97-4.08-3.97-2.78 0-4.4 2.08-4.4 4.23 0 .84.32 1.74.73 2.24.08.1.09.18.06.28l-.27 1.09c-.04.18-.15.22-.34.14-1.28-.6-2.07-2.47-2.07-3.97 0-3.23 2.35-6.2 6.77-6.2 3.55 0 6.3 2.53 6.3 5.9 0 3.53-2.22 6.37-5.3 6.37-1.04 0-2.01-.54-2.34-1.18l-.64 2.42c-.23.88-.86 1.98-1.28 2.66C10.1 21.75 11.03 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white w-full relative overflow-hidden border-t border-white/5 pt-20 pb-28 md:pb-12">
      {/* Subtle Gold Divider */}
      <div className="absolute top-0 left-0 w-full h-[1.5px] bg-[#C9A227]/40" />

      {/* Grid Layout Container */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
        
        {/* COLUMN 1: Brand Info & Socials */}
        <div className="flex flex-col gap-6 text-left">
          <div className="font-display text-[26px] text-white tracking-[0.25em] font-light">
            AURORA <span className="text-primary font-semibold tracking-[0.2em]" style={{ color: "#C9A227" }}>LUXE</span>
          </div>
          <p className="font-sans font-light text-[13px] leading-relaxed text-white/70 max-w-[280px]">
            Finest anti-tarnish waterproof jewelry designed for everyday luxury. Designed to endure, styled to inspire.
          </p>
          
          {/* Social icons */}
          <div className="flex items-center gap-3 mt-2">
            <a 
              href="#" 
              aria-label="Instagram" 
              className="h-9 w-9 rounded-full border border-white/10 hover:border-primary flex items-center justify-center text-white/70 hover:text-primary transition-all duration-300 hover:scale-108"
            >
              <InstagramIcon size={16} />
            </a>
            <a 
              href="#" 
              aria-label="Facebook" 
              className="h-9 w-9 rounded-full border border-white/10 hover:border-primary flex items-center justify-center text-white/70 hover:text-primary transition-all duration-300 hover:scale-108"
            >
              <FacebookIcon size={16} />
            </a>
            <a 
              href="#" 
              aria-label="Pinterest" 
              className="h-9 w-9 rounded-full border border-white/10 hover:border-primary flex items-center justify-center text-white/70 hover:text-primary transition-all duration-300 hover:scale-108"
            >
              <PinterestIcon size={16} />
            </a>
          </div>
        </div>

        {/* COLUMN 2: Shop links */}
        <div className="flex flex-col gap-4 text-left">
          <h4 className="font-sans font-medium text-[13px] tracking-[0.15em] uppercase text-primary mb-2" style={{ color: "#C9A227" }}>Shop</h4>
          <div className="flex flex-col gap-3 text-[13px] font-sans font-light">
            <Link href="/shop" className="text-white/70 hover:text-white transition-colors duration-300 w-fit">All Categories</Link>
            <Link href="/shop?isNew=true" className="text-white/70 hover:text-white transition-colors duration-300 w-fit">New Arrivals</Link>
            <Link href="/shop?isBestSeller=true" className="text-white/70 hover:text-white transition-colors duration-300 w-fit">Best Sellers</Link>
            <Link href="/shop?collection=signature" className="text-white/70 hover:text-white transition-colors duration-300 w-fit">Signature Collection</Link>
          </div>
        </div>

        {/* COLUMN 3: Customer Care */}
        <div className="flex flex-col gap-4 text-left">
          <h4 className="font-sans font-medium text-[13px] tracking-[0.15em] uppercase text-primary mb-2" style={{ color: "#C9A227" }}>Customer Care</h4>
          <div className="flex flex-col gap-3 text-[13px] font-sans font-light">
            <Link href="/contact" className="text-white/70 hover:text-white transition-colors duration-300 w-fit">Contact Us</Link>
            <Link href="/contact" className="text-white/70 hover:text-white transition-colors duration-300 w-fit">FAQs</Link>
            <Link href="/shipping-policy" className="text-white/70 hover:text-white transition-colors duration-300 w-fit">Shipping Policy</Link>
            <Link href="/return-policy" className="text-white/70 hover:text-white transition-colors duration-300 w-fit">Return Policy</Link>
          </div>
        </div>

        {/* COLUMN 4: Company & Newsletter */}
        <div className="flex flex-col gap-4 text-left">
          <h4 className="font-sans font-medium text-[13px] tracking-[0.15em] uppercase text-primary mb-2" style={{ color: "#C9A227" }}>Company</h4>
          <div className="flex flex-col gap-3 text-[13px] font-sans font-light mb-4">
            <Link href="/about" className="text-white/70 hover:text-white transition-colors duration-300 w-fit">About Aurora Luxe</Link>
            <Link href="/privacy-policy" className="text-white/70 hover:text-white transition-colors duration-300 w-fit">Privacy Policy</Link>
            <Link href="/privacy-policy" className="text-white/70 hover:text-white transition-colors duration-300 w-fit">Terms & Conditions</Link>
            <Link href="/return-policy" className="text-white/70 hover:text-white transition-colors duration-300 w-fit">Refund Policy</Link>
          </div>
          
          {/* Email Signup */}
          <div className="w-full max-w-[280px]">
            <h5 className="font-sans font-medium text-[11px] tracking-wider uppercase text-white/90 mb-3 flex items-center gap-1.5">
              <Mail size={12} className="text-primary" style={{ color: "#C9A227" }} /> Newsletter
            </h5>
            <form onSubmit={(e) => e.preventDefault()} className="flex border-b border-white/20 hover:border-primary transition-colors duration-300 pb-1.5">
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="bg-transparent border-none text-[11px] font-sans font-light tracking-wide py-1 w-full focus:outline-none placeholder:text-white/30 text-white uppercase"
              />
              <button type="submit" className="font-sans font-semibold text-[11px] tracking-wider uppercase text-primary hover:text-white transition-colors cursor-pointer pl-2" style={{ color: "#C9A227" }}>
                Join
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Footer Bottom Rights */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-sans text-[10px] text-white/40 tracking-[0.2em] uppercase">
          © {new Date().getFullYear()} AURORA LUXE. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-4 items-center opacity-40 hover:opacity-75 transition-opacity duration-300">
          <span className="text-[9px] font-sans tracking-widest text-white">SECURE CHECKOUT</span>
          <div className="flex gap-1.5">
            <span className="border border-white/20 px-1.5 py-0.5 text-[8px] font-bold rounded text-white">VISA</span>
            <span className="border border-white/20 px-1.5 py-0.5 text-[8px] font-bold rounded text-white">MC</span>
            <span className="border border-white/20 px-1.5 py-0.5 text-[8px] font-bold rounded text-white">UPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
