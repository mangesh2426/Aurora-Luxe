"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import MagneticButton from "@/components/MagneticButton";
import CartDrawer from "@/components/cart/CartDrawer";
import WishlistDrawer from "@/components/layout/WishlistDrawer";
import SearchBar from "./SearchBar";
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  
  // Mega menu states
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

  // Nav Item component
  const NavItem = ({ label, href, hasDropdown = false }: { label: string, href: string, hasDropdown?: boolean }) => {
    const isActive = pathname === href;
    return (
      <div 
        className="relative py-6 px-2 cursor-pointer group"
        onMouseEnter={() => hasDropdown && handleMouseEnter(label)}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          href={href}
          className={`flex items-center gap-1 font-label-caps text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 relative ${
            isActive ? "text-primary font-medium" : "text-on-background hover:text-primary"
          }`}
        >
          {label}
          {hasDropdown && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
          <span className={`absolute -bottom-1 left-0 h-[1px] bg-primary transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
        </Link>

        {/* Mega Menu Dropdown */}
        {hasDropdown && activeMenu === label && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 w-max bg-white/90 backdrop-blur-2xl border border-outline/20 shadow-glass rounded-2xl overflow-hidden py-8 px-10 grid grid-cols-2 gap-12 z-50"
          >
            {label === "Categories" && (
              <>
                <div className="flex flex-col gap-4">
                  <h4 className="font-display text-[16px] text-primary">By Type</h4>
                  <Link href="/shop?category=Necklaces" className="text-sm font-light hover:text-primary transition-colors">Necklaces</Link>
                  <Link href="/shop?category=Earrings" className="text-sm font-light hover:text-primary transition-colors">Earrings</Link>
                  <Link href="/shop?category=Rings" className="text-sm font-light hover:text-primary transition-colors">Rings</Link>
                  <Link href="/shop?category=Bracelets" className="text-sm font-light hover:text-primary transition-colors">Bracelets</Link>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="font-display text-[16px] text-primary">Featured</h4>
                  <Link href="/shop?category=Combos" className="text-sm font-light hover:text-primary transition-colors">Bridal Combos</Link>
                  <Link href="/shop?isBestSeller=true" className="text-sm font-light hover:text-primary transition-colors">Best Sellers</Link>
                </div>
              </>
            )}
            {label === "Collections" && (
              <>
                <div className="flex flex-col gap-4">
                  <h4 className="font-display text-[16px] text-primary">Curations</h4>
                  <Link href="/shop?collection=signature" className="text-sm font-light hover:text-primary transition-colors">The Signature Collection</Link>
                  <Link href="/shop?collection=lumina" className="text-sm font-light hover:text-primary transition-colors">Lumina Essentials</Link>
                  <Link href="/shop?collection=classic" className="text-sm font-light hover:text-primary transition-colors">Classic Gold</Link>
                </div>
                <div className="flex flex-col justify-center items-center bg-surface-container-low p-6 rounded-xl">
                  <span className="font-label-caps text-[10px] tracking-widest text-primary mb-2">Explore All</span>
                  <Link href="/shop" className="border-b border-primary text-sm font-medium pb-1">Shop Collections</Link>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Sticky Main Nav (Desktop) */}
      <motion.nav
        className={`hidden xl:flex justify-between items-center w-full px-16 sticky top-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-2xl border-b border-outline/10 shadow-glass py-0"
            : "bg-white border-b border-outline/5 py-2"
        }`}
      >
        {/* Left Side: Logo */}
        <Link href="/" className="flex items-center">
          <motion.div 
            animate={{ scale: scrolled ? 0.9 : 1, originX: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="font-display text-[26px] text-on-background tracking-[0.25em] font-light hover:text-primary transition-colors duration-300"
          >
            AURORA <span className="text-primary font-semibold tracking-[0.2em]">LUXE</span>
          </motion.div>
        </Link>

        {/* Center: Navigation Links */}
        <div className="flex gap-4 items-center">
          <NavItem label="Categories" href="/shop" hasDropdown={true} />
          <NavItem label="Collections" href="/shop" hasDropdown={true} />
          <NavItem label="New Arrivals" href="/shop?isNew=true" />
          <NavItem label="Best Sellers" href="/shop?isBestSeller=true" />
          <NavItem label="Gift Guide" href="/shop?collection=gift-guide" />
          <NavItem label="About" href="/about" />
          <NavItem label="Contact" href="/contact" />
        </div>

        {/* Right Side: Search and Icons */}
        <div className="flex gap-7 items-center">
          {/* Search Box */}
          <SearchBar />

          {/* Wishlist Link */}
          <MagneticButton as="button" strength={0.35} onClick={() => setWishlistDrawerOpen(true)} aria-label="Wishlist" className="text-on-background hover:text-primary transition-colors duration-300 relative p-1 cursor-pointer block">
            <Heart size={21} className={`stroke-[1.5] ${wishlistCount > 0 ? "fill-primary text-primary" : ""}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center pointer-events-none">
                {wishlistCount}
              </span>
            )}
          </MagneticButton>

          {/* Account/Profile Link */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              aria-label="Account"
              className="text-on-background hover:text-primary transition-colors duration-300 p-1"
            >
              <User size={21} className="stroke-[1.5]" />
            </Link>
          </div>

          {/* Cart Bag Link */}
          <MagneticButton as="button" strength={0.35} onClick={() => setCartDrawerOpen(true)} aria-label="Cart" className="text-on-background hover:text-primary transition-colors duration-300 relative p-1 cursor-pointer">
            <ShoppingBag size={21} className="stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </MagneticButton>
        </div>
      </motion.nav>

      {/* Mobile Top Header */}
      <header
        className={`xl:hidden flex justify-between items-center w-full px-6 py-4 sticky top-0 z-40 transition-all duration-300 border-b border-[rgba(0,0,0,0.05)] ${
          scrolled ? "bg-white/80 backdrop-blur-2xl shadow-glass" : "bg-white"
        }`}
      >
        <button
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Menu"
          className="text-on-background hover:text-primary transition-colors p-2 cursor-pointer"
        >
          <Menu size={24} className="stroke-[1.5]" />
        </button>
        
        <Link href="/" className="font-display text-[22px] text-on-background tracking-[0.2em] font-light">
          AURORA <span className="text-primary font-medium tracking-[0.12em]">LUXE</span>
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
              <span className="absolute top-0 right-0 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
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
                  <Link href="/shop?isNew=true" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 block">New Arrivals</Link>
                  <Link href="/shop?isBestSeller=true" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 block mt-4">Best Sellers</Link>
                  <Link href="/shop?collection=gift-guide" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 block mt-4">Gift Guide</Link>
                </div>
                <div className="border-t border-outline/10 pt-4 mt-2">
                  <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 block">About Us</Link>
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 block mt-4">Contact</Link>
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
