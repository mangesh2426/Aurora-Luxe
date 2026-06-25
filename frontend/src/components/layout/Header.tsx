"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchBar from "./SearchBar";
import { Search, Heart, ShoppingBag, User, Menu, X, Store, Truck, Home, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  
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

  return (
    <>
      {/* Sticky Main Nav (Desktop) */}
      <nav
        className={`hidden md:flex justify-between items-center w-full px-16 sticky top-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-lg border-b border-outline/10 shadow-[0_8px_30px_rgba(0,0,0,0.015)] py-3"
            : "bg-white border-b border-outline/20 py-5.5"
        }`}
      >
        {/* Left Side: Logo */}
        <Link href="/" className="font-display text-[26px] text-on-background tracking-[0.25em] font-light hover:text-primary transition-colors duration-300">
          AURORA <span className="text-primary font-semibold tracking-[0.2em]">LUXE</span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="flex gap-9 items-center">
          <Link
            href="/"
            className={`font-label-caps text-[10.5px] tracking-[0.2em] uppercase transition-colors duration-300 relative py-1 ${
              pathname === "/"
                ? "text-primary font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-primary"
                : "text-on-surface-variant hover:text-primary after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1.5px] after:bg-primary after:transition-all after:duration-300"
            }`}
          >
            Home
          </Link>
          <Link
            href="/shop"
            className={`font-label-caps text-[10.5px] tracking-[0.2em] uppercase transition-colors duration-300 relative py-1 ${
              pathname === "/shop"
                ? "text-primary font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-primary"
                : "text-on-surface-variant hover:text-primary after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1.5px] after:bg-primary after:transition-all after:duration-300"
            }`}
          >
            Shop
          </Link>
          <Link
            href="/wishlist"
            className={`font-label-caps text-[10.5px] tracking-[0.2em] uppercase transition-colors duration-300 relative py-1 ${
              pathname === "/wishlist"
                ? "text-primary font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-primary"
                : "text-on-surface-variant hover:text-primary after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1.5px] after:bg-primary after:transition-all after:duration-300"
            }`}
          >
            Wishlist
          </Link>
          <Link
            href="/tracking"
            className={`font-label-caps text-[10.5px] tracking-[0.2em] uppercase transition-colors duration-300 relative py-1 ${
              pathname === "/tracking"
                ? "text-primary font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-primary"
                : "text-on-surface-variant hover:text-primary after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1.5px] after:bg-primary after:transition-all after:duration-300"
            }`}
          >
            Track Order
          </Link>
          {mounted && user?.role === "admin" && (
            <Link
              href="/admin"
              className={`font-label-caps text-[10.5px] tracking-[0.2em] uppercase transition-colors duration-300 relative py-1 ${
                pathname?.startsWith("/admin")
                  ? "text-primary font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-primary"
                  : "text-on-surface-variant hover:text-primary after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1.5px] after:bg-primary after:transition-all after:duration-300"
              }`}
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right Side: Search and Icons */}
        <div className="flex gap-7 items-center">
          {/* Search Box */}
          <SearchBar />

          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="text-on-surface hover:text-primary transition-colors duration-300 relative p-1"
          >
            <Heart size={21} className={`stroke-[1.5] ${wishlistCount > 0 ? "fill-primary text-primary" : ""}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Bag Link */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            aria-label="Cart"
            className="text-on-surface hover:text-primary transition-colors duration-300 relative p-1 cursor-pointer"
          >
            <ShoppingBag size={21} className="stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-on-background text-white text-[8px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Account/Profile Link */}
          <div className="flex items-center gap-2">
            {mounted && user && (
              <span className="text-[11px] font-body text-on-surface-variant/80 max-w-[80px] truncate font-light tracking-wide">
                Hi, {user.name.split(" ")[0]}
              </span>
            )}
            <Link
              href="/login"
              aria-label="Account"
              className="text-on-surface hover:text-primary transition-colors duration-300 p-1"
            >
              <User size={21} className="stroke-[1.5]" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Top Header */}
      <header
        className={`md:hidden flex justify-between items-center w-full px-6 py-3.5 sticky top-0 z-40 transition-all duration-300 border-b border-outline/10 ${
          scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white"
        }`}
      >
        <button
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Menu"
          className="text-on-surface hover:text-primary transition-colors p-2 cursor-pointer"
        >
          <Menu size={22} className="stroke-[1.5]" />
        </button>
        
        <Link href="/" className="font-display text-[22px] text-on-background tracking-[0.2em] font-light">
          AURORA <span className="text-primary font-medium tracking-[0.12em]">LUXE</span>
        </Link>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMobileSearchOpen(true)}
            aria-label="Search"
            className="text-on-surface hover:text-primary transition-colors p-2 cursor-pointer"
          >
            <Search size={21} className="stroke-[1.5]" />
          </button>
          
          <button
            onClick={() => setCartDrawerOpen(true)}
            aria-label="Cart"
            className="text-on-surface hover:text-primary transition-colors p-2 relative cursor-pointer"
          >
            <ShoppingBag size={21} className="stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-on-background text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Bottom Nav Bar (Mobile Navigation Convenience) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe glass-panel border-t border-outline/30 z-45 shadow-2xl">
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center transition-colors duration-200 ${
            pathname === "/shop" ? "text-primary" : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <Store size={20} className="mb-0.5 stroke-[1.5]" />
          <span className="font-label-caps text-[9px] tracking-wider uppercase">Shop</span>
        </Link>
        <Link
          href="/wishlist"
          className={`flex flex-col items-center justify-center transition-colors duration-200 ${
            pathname === "/wishlist" ? "text-primary" : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <Heart size={20} className={`mb-0.5 stroke-[1.5] ${pathname === "/wishlist" && wishlistCount > 0 ? "fill-primary text-primary" : ""}`} />
          <span className="font-label-caps text-[9px] tracking-wider uppercase">Wishlist</span>
        </Link>
        <Link
          href="/"
          className={`flex flex-col items-center justify-center transition-colors duration-200 ${
            pathname === "/" ? "text-primary" : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <Home size={20} className="mb-0.5 stroke-[1.5]" />
          <span className="font-label-caps text-[9px] tracking-wider uppercase">Home</span>
        </Link>
        <Link
          href="/tracking"
          className={`flex flex-col items-center justify-center transition-colors duration-200 ${
            pathname === "/tracking" ? "text-primary" : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <Truck size={20} className="mb-0.5 stroke-[1.5]" />
          <span className="font-label-caps text-[9px] tracking-wider uppercase">Track</span>
        </Link>
        {mounted && user?.role === "admin" && (
          <Link
            href="/admin"
            className={`flex flex-col items-center justify-center transition-colors duration-200 ${
              pathname?.startsWith("/admin") ? "text-primary" : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <LayoutDashboard size={20} className="mb-0.5 stroke-[1.5]" />
            <span className="font-label-caps text-[9px] tracking-wider uppercase">Admin</span>
          </Link>
        )}
      </nav>

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
              className="fixed top-0 left-0 h-screen w-[280px] bg-white z-50 shadow-2xl flex flex-col border-r border-outline/30"
            >
              <div className="p-6 border-b border-outline/10 flex justify-between items-center bg-white">
                <span className="font-display text-[22px] text-on-background tracking-[0.2em] font-light">AURORA <span className="text-primary font-semibold tracking-[0.15em]">LUXE</span></span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="text-on-surface-variant hover:text-primary p-2 border border-outline/10 rounded-full cursor-pointer"
                >
                  <X size={15} className="stroke-[1.5]" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-6 font-body text-[15px] tracking-wide">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1">Home</Link>
                <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1">Shop All Jewelry</Link>
                <Link href="/shop?category=Necklaces" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 pl-4 text-on-surface-variant text-[14px]">- Necklaces</Link>
                <Link href="/shop?category=Rings" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 pl-4 text-on-surface-variant text-[14px]">- Rings</Link>
                <Link href="/shop?category=Earrings" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 pl-4 text-on-surface-variant text-[14px]">- Earrings</Link>
                <Link href="/shop?category=Bracelets" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 pl-4 text-on-surface-variant text-[14px]">- Bracelets</Link>
                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1">Our Story</Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1">Contact Us</Link>
              </div>

              <div className="mt-auto p-6 border-t border-outline bg-surface-container-low flex flex-col gap-4">
                {mounted && user ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-[12px] font-body text-on-surface-variant text-center">
                      Logged in as <span className="font-semibold text-on-background">{user.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                        router.push("/");
                      }}
                      className="w-full py-3 bg-red-600/95 text-white text-center font-label-caps text-[10px] tracking-widest uppercase hover:bg-red-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 bg-on-background text-white text-center font-label-caps text-[10px] tracking-widest uppercase hover:bg-primary transition-colors flex items-center justify-center gap-2"
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
            className="fixed inset-0 bg-white z-50 md:hidden flex flex-col p-6"
          >
            {/* Header part of overlay */}
            <div className="flex items-center justify-between mb-6">
              <span className="font-display text-[22px] text-primary tracking-wider font-light">
                AURORA <span className="font-semibold text-on-background">LUXE</span>
              </span>
              <button
                onClick={() => setMobileSearchOpen(false)}
                aria-label="Close search"
                className="text-on-surface-variant hover:text-primary p-2 border border-outline rounded-full cursor-pointer"
              >
                <X size={18} className="stroke-[1.5]" />
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
    </>
  );
}
