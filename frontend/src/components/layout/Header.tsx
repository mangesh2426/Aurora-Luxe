"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import CartDrawer from "@/components/cart/CartDrawer";
import WishlistDrawer from "@/components/layout/WishlistDrawer";
import SearchBar from "./SearchBar";
import { Heart, ShoppingBag, User, Menu, X, ChevronDown, Sparkles, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  
  // Mega menu state
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const { cart, wishlist, user, logout } = useStore();
  const [mounted, setMounted] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (menu: string) => {
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  // Nav Item component with refined typography (14px) and luxury gold underline growing from center
  const NavItem = ({ label, href, hasDropdown = false, className = "" }: { label: string; href: string; hasDropdown?: boolean; className?: string }) => {
    const isActive = pathname === href;
    return (
      <div 
        className={`relative h-full flex items-center cursor-pointer group ${className}`}
        onMouseEnter={() => hasDropdown && handleMouseEnter(label)}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          href={href}
          className={`flex items-center gap-1.5 font-sans font-medium text-[14px] tracking-[0.08em] uppercase transition-all duration-[250ms] relative py-4 whitespace-nowrap ${
            isActive ? "text-primary" : "text-[#111111] hover:text-primary"
          }`}
        >
          {label}
          {hasDropdown && (
            <ChevronDown 
              size={13} 
              className={`transition-transform duration-300 ${activeMenu === label ? "rotate-180 text-primary" : "text-gray-400 group-hover:text-primary"}`} 
            />
          )}
          
          {/* Underline indicator growing from center */}
          <span 
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-primary transition-all duration-[250ms] ease-out ${
              isActive ? "w-full" : "w-0 group-hover:w-full"
            }`} 
            style={{ 
              backgroundColor: "#C9A227"
            }} 
          />
        </Link>

        {/* Mega Menu Dropdowns (Categories & Collections) */}
        <AnimatePresence>
          {hasDropdown && activeMenu === label && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute top-full left-1/2 -translate-x-1/2 w-[920px] bg-white border border-[#EDE8DE] shadow-[0_24px_64px_rgba(0,0,0,0.10)] rounded-xl overflow-hidden z-50 mt-[-4px] border-t-2 border-t-[#C9A227]"
            style={{ padding: 0 }}
            >
              {label === "Categories" && (
                <div className="grid grid-cols-12 gap-0">
                  {/* Left: Category & Occasion links */}
                  <div className="col-span-3 flex flex-col gap-0 border-r border-[#F0EBE0] px-7 py-7">
                    <p className="text-[9px] font-sans font-semibold tracking-[0.22em] uppercase text-[#C9A227] mb-4">Shop by Category</p>
                    <div className="flex flex-col mb-6">
                      {[
                        { label: "Necklaces", href: "/shop?category=Necklaces" },
                        { label: "Earrings", href: "/shop?category=Earrings" },
                        { label: "Rings", href: "/shop?category=Rings" },
                        { label: "Bracelets", href: "/shop?category=Bracelets" },
                        { label: "Combos & Sets", href: "/shop?category=Combos" },
                      ].map((item) => (
                        <Link key={item.label} href={item.href}
                          className="group flex items-center justify-between py-2.5 border-b border-[#F5F0E8] last:border-0">
                          <span className="text-[13px] font-sans text-[#1a1a1a] group-hover:text-primary transition-colors duration-200">{item.label}</span>
                          <span className="text-[#C9A227] opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[12px] font-light">→</span>
                        </Link>
                      ))}
                    </div>
                    <p className="text-[9px] font-sans font-semibold tracking-[0.22em] uppercase text-[#C9A227] mb-4">By Occasion</p>
                    <div className="flex flex-col">
                      {[
                        { label: "Daily Radiance", href: "/shop?collection=signature" },
                        { label: "Bridal & Festive", href: "/shop?category=Combos" },
                      ].map((item) => (
                        <Link key={item.label} href={item.href}
                          className="group flex items-center justify-between py-2.5 border-b border-[#F5F0E8] last:border-0">
                          <span className="text-[13px] font-sans text-[#1a1a1a] group-hover:text-primary transition-colors duration-200">{item.label}</span>
                          <span className="text-[#C9A227] opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[12px] font-light">→</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Center: 4 category image thumbnails */}
                  <div className="col-span-5 border-r border-[#F0EBE0] px-7 py-7">
                    <p className="text-[9px] font-sans font-semibold tracking-[0.22em] uppercase text-[#C9A227] mb-4">Category Spotlight</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Necklaces", src: "/necklaces.png", href: "/shop?category=Necklaces" },
                        { label: "Rings", src: "/rings.png", href: "/shop?category=Rings" },
                        { label: "Earrings", src: "/earrings.png", href: "/shop?category=Earrings" },
                        { label: "Bracelets", src: "/bracelets.png", href: "/shop?category=Bracelets" },
                      ].map((cat) => (
                        <Link key={cat.label} href={cat.href} className="group relative overflow-hidden rounded-lg">
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5F0E8]">
                            <Image src={cat.src} alt={cat.label} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-2.5">
                            <span className="text-[10px] font-sans font-semibold text-white uppercase tracking-[0.15em]">{cat.label}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Right: Feature banner */}
                  <div className="col-span-4 relative flex flex-col justify-end overflow-hidden" style={{ minHeight: 280 }}>
                    <Image src="/hero_model.png" alt="Featured" fill className="object-cover brightness-[0.72]" />
                    <div className="relative z-10 p-7 text-white">
                      <span className="text-[8px] font-sans font-bold tracking-[0.25em] uppercase bg-[#C9A227] text-white px-2.5 py-1 mb-3 inline-block">Best Seller</span>
                      <h5 className="font-display text-[17px] font-medium leading-snug mb-1">Royal Baroque Necklaces</h5>
                      <p className="text-[11px] text-white/65 mb-4">Handcrafted in 18k gold plating</p>
                      <Link href="/shop?category=Necklaces"
                        className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] border border-white/50 px-4 py-2 inline-block hover:bg-white hover:text-[#111] transition-all duration-200">
                        Explore Design →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {label === "Collections" && (
                <div className="grid grid-cols-12 gap-0">
                  {/* Left: Collections list */}
                  <div className="col-span-4 border-r border-[#F0EBE0] px-7 py-7">
                    <p className="text-[9px] font-sans font-semibold tracking-[0.22em] uppercase text-[#C9A227] mb-4">Signature Curation Series</p>
                    <div className="flex flex-col">
                      {[
                        { name: "The Signature Collection", desc: "Timeless pieces forged with waterproof layers.", href: "/shop?collection=signature" },
                        { name: "Lumina Essentials", desc: "Minimal chains and stackable bands for daily wear.", href: "/shop?collection=lumina" },
                        { name: "Classic Gold Collection", desc: "Iconic designs inspired by imperial elegance.", href: "/shop?collection=classic" },
                      ].map((col) => (
                        <Link key={col.name} href={col.href}
                          className="group flex items-start justify-between gap-3 py-4 border-b border-[#F5F0E8] last:border-0">
                          <div>
                            <span className="block text-[13px] font-sans font-medium text-[#1a1a1a] group-hover:text-primary transition-colors duration-200">{col.name}</span>
                            <span className="block text-[11px] font-sans font-light text-gray-400 mt-0.5 leading-snug">{col.desc}</span>
                          </div>
                          <span className="text-[#C9A227] opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-0.5 flex-shrink-0 text-[12px]">→</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Center: Combo thumbnail */}
                  <div className="col-span-4 border-r border-[#F0EBE0] px-7 py-7">
                    <p className="text-[9px] font-sans font-semibold tracking-[0.22em] uppercase text-[#C9A227] mb-4">Curated Combos</p>
                    <Link href="/shop?category=Combos" className="group relative overflow-hidden rounded-lg block">
                      <div className="relative w-full overflow-hidden bg-[#F5F0E8]" style={{ aspectRatio: "4/3" }}>
                        <Image src="/combos.png" alt="Festive Combos" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <span className="text-[10px] font-sans font-semibold text-white uppercase tracking-[0.15em]">Festive Combos</span>
                      </div>
                    </Link>
                  </div>

                  {/* Right: Feature banner */}
                  <div className="col-span-4 relative flex flex-col justify-end overflow-hidden" style={{ minHeight: 280 }}>
                    <Image src="/bracelets.png" alt="Classic Gold Bangles" fill className="object-cover brightness-[0.72]" />
                    <div className="relative z-10 p-7 text-white">
                      <span className="text-[8px] font-sans font-bold tracking-[0.25em] uppercase bg-[#C9A227] text-white px-2.5 py-1 mb-3 inline-block">New Arrival</span>
                      <h5 className="font-display text-[17px] font-medium leading-snug mb-1">The Classic Gold Bangles</h5>
                      <p className="text-[11px] text-white/65 mb-4">Stackable elegance, everyday luxury</p>
                      <Link href="/shop?category=Bracelets"
                        className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] border border-white/50 px-4 py-2 inline-block hover:bg-white hover:text-[#111] transition-all duration-200">
                        Discover →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {/* Sticky Main Navbar (Desktop Overhaul) */}
      <motion.nav
        className={`hidden xl:flex justify-between items-center w-full sticky top-0 z-40 transition-all duration-300 px-6 md:px-12 box-border ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-md h-[72px]"
            : "bg-white h-[88px]"
        }`}
      >
        <div className="max-w-[1400px] w-full mx-auto flex items-center justify-between h-full relative gap-6 box-border">
          {/* Left Side: Logo (Left aligned, premium spacing) */}
          <Link href="/" className="flex items-center shrink-0 flex-shrink-0">
            <motion.div 
              animate={{ scale: scrolled ? 0.88 : 1.02 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="font-display text-[28px] lg:text-[31px] text-[#111111] tracking-[0.25em] font-light hover:text-primary transition-colors duration-300 shrink-0 flex-shrink-0"
            >
              AURORA <span className="text-primary font-semibold tracking-[0.2em]">LUXE</span>
            </motion.div>
          </Link>

          {/* Center: Navigation Links (Moved slightly away from logo via margin/padding) */}
          <div className="flex gap-6 items-center h-full flex-shrink-0">
            <NavItem label="Categories" href="/shop" hasDropdown={true} />
            <NavItem label="Collections" href="/shop" hasDropdown={true} />
            <NavItem label="Track Order" href="/tracking" />
          </div>

          {/* Right Side: Search and Luxury Icon Circles */}
          <div className="flex gap-5 items-center flex-shrink-0">
            {/* Search Box Pill */}
            <SearchBar />

            {/* Wishlist Link inside 42px Hover Circle */}
            <button 
              onClick={() => setWishlistDrawerOpen(true)} 
              aria-label="Wishlist" 
              className="h-[42px] w-[42px] rounded-full hover:bg-gray-100/80 active:bg-gray-200/50 flex items-center justify-center transition-all duration-300 relative cursor-pointer text-[#111111] hover:text-primary hover:scale-[1.08]"
            >
              <Heart size={20} className={`stroke-[1.5] ${wishlistCount > 0 ? "fill-primary text-primary" : ""}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center pointer-events-none">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account/Profile Link inside 42px Hover Circle */}
            <Link
              href="/login"
              aria-label="Account"
              className="h-[42px] w-[42px] rounded-full hover:bg-gray-100/80 active:bg-gray-200/50 flex items-center justify-center transition-all duration-300 text-[#111111] hover:text-primary hover:scale-[1.08]"
            >
              <User size={20} className="stroke-[1.5]" />
            </Link>

            {/* Cart Bag Link inside 42px Hover Circle */}
            <button 
              onClick={() => setCartDrawerOpen(true)} 
              aria-label="Cart" 
              className="h-[42px] w-[42px] rounded-full hover:bg-gray-100/80 active:bg-gray-200/50 flex items-center justify-center transition-all duration-300 relative cursor-pointer text-[#111111] hover:text-primary hover:scale-[1.08]"
            >
              <ShoppingBag size={20} className="stroke-[1.5]" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: "#C9A227" }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Very subtle gold divider below navbar */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A227]/30 to-transparent" />
      </motion.nav>

      {/* Mobile Top Header */}
      <header
        className={`xl:hidden flex justify-between items-center w-full px-6 py-4 sticky top-0 z-40 transition-all duration-300 border-b border-[#E5E7EB] ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-white"
        }`}
      >
        <button
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Menu"
          className="text-on-background hover:text-primary transition-colors p-2 cursor-pointer"
        >
          <Menu size={24} className="stroke-[1.5]" />
        </button>
        
        <Link href="/" className="font-display text-[24px] text-on-background tracking-[0.2em] font-light">
          AURORA <span className="text-primary font-semibold tracking-[0.15em]">LUXE</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSearchOpen(true)}
            aria-label="Search"
            className="text-on-background hover:text-primary transition-colors p-2 cursor-pointer"
          >
            <Search size={21} className="stroke-[1.5]" />
          </button>
          
          <button
            onClick={() => setCartDrawerOpen(true)}
            aria-label="Cart"
            className="text-on-background hover:text-primary transition-colors p-2 relative cursor-pointer"
          >
            <ShoppingBag size={21} className="stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Menu Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 pointer-events-auto"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
              className="fixed top-0 left-0 h-screen w-4/5 max-w-sm bg-white z-50 shadow-2xl flex flex-col border-r border-outline/30"
            >
              <div className="p-6 border-b border-outline/10 flex justify-between items-center bg-white">
                <span className="font-display text-[22px] text-on-background tracking-[0.2em] font-light">AURORA <span className="text-primary font-semibold tracking-[0.15em]">LUXE</span></span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="text-on-background hover:text-primary p-2 border border-outline/10 rounded-full cursor-pointer"
                >
                  <X size={20} className="stroke-[1.5]" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-6 font-label-caps text-[13px] tracking-widest uppercase overflow-y-auto">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1">Home</Link>
                <div className="border-t border-outline/10 pt-4 mt-2">
                  <h4 className="text-primary font-semibold mb-4 text-[10px]">Categories</h4>
                  <Link href="/shop?category=Necklaces" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 block text-on-surface-variant">Necklaces</Link>
                  <Link href="/shop?category=Rings" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 block text-on-surface-variant">Rings</Link>
                  <Link href="/shop?category=Earrings" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 block text-on-surface-variant">Earrings</Link>
                  <Link href="/shop?category=Bracelets" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 block text-on-surface-variant">Bracelets</Link>
                </div>
                <div className="border-t border-outline/10 pt-4 mt-2">
                  <Link href="/tracking" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 block">Track Order</Link>
                </div>
              </div>

              <div className="mt-auto p-6 border-t border-outline/10 bg-surface flex flex-col gap-4">
                {mounted && user ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-[12px] font-body text-on-surface-variant text-center">
                      Welcome back, <span className="font-semibold text-on-background">{user.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                        router.push("/");
                      }}
                      className="w-full py-3 bg-red-600/95 text-white text-center font-label-caps text-[10px] tracking-widest uppercase hover:bg-red-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-luxury"
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 bg-on-background text-white text-center font-label-caps text-[10px] tracking-widest uppercase hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-luxury"
                  >
                    <User size={16} className="stroke-[1.5]" /> Sign In / Account
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-white z-50 xl:hidden flex flex-col p-6"
          >
            {/* Header part of overlay */}
            <div className="flex items-center justify-between mb-6">
              <span className="font-display text-[22px] text-primary tracking-wider font-light">
                AURORA <span className="font-semibold text-on-background">LUXE</span>
              </span>
              <button
                onClick={() => setMobileSearchOpen(false)}
                aria-label="Close search"
                className="text-on-background hover:text-primary p-2 border border-outline rounded-full cursor-pointer"
              >
                <X size={20} className="stroke-[1.5]" />
              </button>
            </div>
            
            {/* Search Input and suggestions */}
            <div className="flex-1 flex flex-col min-h-0">
              <SearchBar isMobileOverlay={true} onCloseMobile={() => setMobileSearchOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      <WishlistDrawer isOpen={wishlistDrawerOpen} onClose={() => setWishlistDrawerOpen(false)} />
    </>
  );
}
