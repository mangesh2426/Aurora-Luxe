"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline/20 w-full pb-[80px] md:pb-0 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12 px-16 py-20 max-w-container-max mx-auto relative z-10">
        <div className="md:col-span-2 flex flex-col gap-6 pr-0 md:pr-16">
          <div className="font-display text-[26px] text-primary tracking-[0.2em] font-light">AURORA LUXE</div>
          <p className="font-body text-[13px] text-on-surface-variant font-light leading-relaxed max-w-sm">
            Premium, anti-tarnish daily jewellery crafted for modern elegance. Designed to endure, styled to inspire.
          </p>
          <div className="mt-4 max-w-sm">
            <h5 className="font-label-caps text-[9px] tracking-[0.2em] uppercase font-semibold text-on-surface mb-3">Join the Muse Club</h5>
            <form onSubmit={(e) => e.preventDefault()} className="flex border-b border-outline hover:border-primary transition-colors duration-300">
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="bg-transparent border-none text-[11px] font-body tracking-[0.1em] py-2 w-full focus:outline-none placeholder:text-on-surface-variant/40 text-on-surface uppercase"
              />
              <button type="submit" className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-primary font-semibold hover:text-on-surface transition-colors cursor-pointer px-2">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-label-caps text-[10.5px] tracking-[0.2em] uppercase text-primary font-semibold mb-2">Shop</h4>
          <Link href="/shop" className="font-body text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit font-light relative group">
            All Jewellery
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/shop" className="font-body text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit font-light relative group">
            Best Sellers
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/shop" className="font-body text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit font-light relative group">
            New Arrivals
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-label-caps text-[10.5px] tracking-[0.2em] uppercase text-primary font-semibold mb-2">Support</h4>
          <Link href="/shipping-policy" className="font-body text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit font-light relative group">
            Shipping Policy
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/return-policy" className="font-body text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit font-light relative group">
            Return Policy
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/privacy-policy" className="font-body text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit font-light relative group">
            Privacy Policy
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-label-caps text-[10.5px] tracking-[0.2em] uppercase text-primary font-semibold mb-2">Boutique</h4>
          <Link href="/tracking" className="font-body text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit font-light relative group">
            Track Order
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/contact" className="font-body text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit font-light relative group">
            Contact Us
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/about" className="font-body text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit font-light relative group">
            Our Story
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
      </div>
      <div className="border-t border-outline/20 py-8 text-center bg-surface-container-low flex flex-col md:flex-row justify-between items-center px-16 max-w-container-max mx-auto gap-4">
        <p className="font-label-caps text-[9.5px] text-on-surface-variant tracking-[0.2em] uppercase">© 2026 AURORA LUXE. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-4 items-center opacity-40 hover:opacity-60 transition-opacity">
          <span className="text-[10px] font-label-caps tracking-widest text-on-surface">SECURE CHECKOUT</span>
          <div className="flex gap-2">
            <span className="border border-on-surface/30 px-1 py-0.5 text-[8px] font-semibold tracking-wider rounded-sm text-on-surface">VISA</span>
            <span className="border border-on-surface/30 px-1 py-0.5 text-[8px] font-semibold tracking-wider rounded-sm text-on-surface">MC</span>
            <span className="border border-on-surface/30 px-1 py-0.5 text-[8px] font-semibold tracking-wider rounded-sm text-on-surface">UPI</span>
            <span className="border border-on-surface/30 px-1 py-0.5 text-[8px] font-semibold tracking-wider rounded-sm text-on-surface">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
