import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline w-full pb-[80px] md:pb-0 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-stack-lg max-w-container-max mx-auto relative z-10">
        <div className="md:col-span-1">
          <div className="font-display-lg text-display-lg text-primary tracking-[0.1em] mb-stack-md">AURORA</div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 font-light leading-relaxed">
            Premium, anti-tarnish jewellery designed for the modern minimalists.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-label-caps text-label-caps text-primary tracking-widest uppercase mb-2">Shop</h4>
          <Link href="/shop" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit relative group">
            All Jewellery
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/shop" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit relative group">
            Best Sellers
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/shop" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit relative group">
            New Arrivals
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-label-caps text-label-caps text-primary tracking-widest uppercase mb-2">Support</h4>
          <Link href="/shipping-policy" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit relative group">
            Shipping Policy
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/return-policy" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit relative group">
            Return Policy
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/privacy-policy" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit relative group">
            Privacy Policy
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-label-caps text-label-caps text-primary tracking-widest uppercase mb-2">Experience</h4>
          <Link href="/tracking" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit relative group">
            Track Your Order
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/contact" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit relative group">
            Contact Us
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/about" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit relative group">
            Our Story
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
      </div>
      <div className="border-t border-outline py-6 text-center bg-surface-container-low">
        <p className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.2em] uppercase">© 2026 AURORA LUXE. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
