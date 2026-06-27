"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import CartDrawer from "@/components/cart/CartDrawer";
import WishlistDrawer from "@/components/layout/WishlistDrawer";
import SearchBar from "./SearchBar";
import { Search, Heart, ShoppingBag, User, LogOut, ShieldAlert, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

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
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
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
        className="relative py-5 px-3 cursor-pointer group"
        onMouseEnter={() => hasDropdown && handleMouseEnter(label)}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          href={href}
          className={`flex items-center gap-1 font-label-caps text-[10px] tracking-[0.25em] uppercase transition-colors duration-300 relative ${
            isActive ? "text-primary font-semibold" : "text-on-background hover:text-primary"
          }`}
        >
          {label}
          {hasDropdown && <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-300" />}
          
          {/* Active indicator */}
          {isActive && (
            <motion.span 
              layoutId="navActiveLine"
              className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-primary"
            />
          )}

          {/* Hover indicator */}
          {!isActive && (
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary/60 transition-all duration-300 group-hover:w-full" />
          )}
        </Link>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {hasDropdown && activeMenu === label && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute top-full left-1/2 -translate-x-1/2 w-max bg-white/95 backdrop-blur-2xl border border-outline/10 shadow-luxury rounded-2xl overflow-hidden py-8 px-10 grid grid-cols-2 gap-12 z-50 mt-1"
            >
              {label === "Categories" && (
                <>
                  <div className="flex flex-col gap-4">
                    <h4 className="font-display text-[15px] tracking-wide text-primary border-b border-outline pb-2 font-medium">By Jewelry Type</h4>
                    <Link href="/shop?category=Necklaces" className="text-[13px] font-light hover:text-primary transition-colors">Necklaces</Link>
                    <Link href="/shop?category=Earrings" className="text-[13px] font-light hover:text-primary transition-colors">Earrings</Link>
                    <Link href="/shop?category=Rings" className="text-[13px] font-light hover:text-primary transition-colors">Rings</Link>
                    <Link href="/shop?category=Bracelets" className="text-[13px] font-light hover:text-primary transition-colors">Bracelets</Link>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h4 className="font-display text-[15px] tracking-wide text-primary border-b border-outline pb-2 font-medium">Featured Collections</h4>
                    <Link href="/shop?category=Combos" className="text-[13px] font-light hover:text-primary transition-colors">Bridal Combos</Link>
                    <Link href="/shop?isBestSeller=true" className="text-[13px] font-light hover:text-primary transition-colors">Best Sellers</Link>
                  </div>
                </>
              )}
              {label === "Collections" && (
                <>
                  <div className="flex flex-col gap-4">
                    <h4 className="font-display text-[15px] tracking-wide text-primary border-b border-outline pb-2 font-medium">Curated Assortments</h4>
                    <Link href="/shop?collection=signature" className="text-[13px] font-light hover:text-primary transition-colors">The Signature Collection</Link>
                    <Link href="/shop?collection=lumina" className="text-[13px] font-light hover:text-primary transition-colors">Lumina Essentials</Link>
                    <Link href="/shop?collection=classic" className="text-[13px] font-light hover:text-primary transition-colors">Classic Gold</Link>
                  </div>
                  <div className="flex flex-col justify-center items-center bg-surface-container-low/60 border border-outline/30 p-6 rounded-xl">
                    <span className="font-label-caps text-[9px] tracking-widest text-primary mb-2 block">Premium Crafts</span>
                    <Link href="/shop" className="border-b border-primary text-[12px] font-semibold tracking-wider uppercase pb-1 hover:text-primary transition-colors">Shop All</Link>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {/* 
        Single outer layout wrapper for sticky navbar behavior to eliminate duplicate header elements.
        Ensures both desktop and mobile modes are rendered in a single structural layer.
      */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-400 border-b ${
          scrolled
            ? "bg-white/85 backdrop-blur-lg border-[#E5E7EB] shadow-luxury py-2 md:py-2.5"
            : "bg-white border-transparent py-4 md:py-5"
        }`}
      >
        <div className="max-w-container-max mx-auto px-6 md:px-16 flex items-center justify-between">
          
          {/* ==================================================
              DESKTOP LEFT SIDE: BRAND LOGO
              ================================================== */}
          <Link href="/" className="flex items-center">
            <motion.div 
              animate={{ scale: scrolled ? 0.95 : 1 }}
              transition={{ duration: 0.3 }}
              className="font-display text-[22px] md:text-[25px] text-on-background tracking-[0.25em] font-light hover:text-primary transition-colors duration-300 leading-none"
            >
              AURORA <span className="text-primary font-semibold tracking-[0.2em]">LUXE</span>
            </motion.div>
          </Link>

          {/* ==================================================
              DESKTOP CENTER: NAV LINKS
              ================================================== */}
          <nav className="hidden xl:flex items-center gap-2">
            <NavItem label="Categories" href="/shop" hasDropdown={true} />
            <NavItem label="Collections" href="/shop" hasDropdown={true} />
            <NavItem label="New Arrivals" href="/shop?isNew=true" />
            <NavItem label="Best Sellers" href="/shop?isBestSeller=true" />
            <NavItem label="Gift Guide" href="/shop?collection=gift-guide" />
            <NavItem label="About" href="/about" />
            <NavItem label="Contact" href="/contact" />
          </nav>

          {/* ==================================================
              DESKTOP RIGHT SIDE: ACTIONS
              ================================================== */}
          <div className="hidden xl:flex items-center gap-6">
            <SearchBar />

            {/* Wishlist Icon */}
            <button 
              onClick={() => setWishlistDrawerOpen(true)} 
              aria-label="Wishlist" 
              className="text-on-background hover:text-primary transition-colors duration-300 relative p-1 cursor-pointer block"
            >
              <Heart size={20} className={`stroke-[1.5] transition-colors duration-300 ${wishlistCount > 0 ? "fill-primary text-primary" : ""}`} />
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center pointer-events-none"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Account / User Menu Dropdown */}
            <div 
              className="relative py-2"
              onMouseEnter={() => setProfileDropdownOpen(true)}
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <button
                aria-label="Account"
                className="text-on-background hover:text-primary transition-colors duration-300 p-1 flex items-center gap-1 cursor-pointer"
              >
                <User size={20} className="stroke-[1.5]" />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E7EB] shadow-luxury rounded-xl p-3 z-50 text-left"
                  >
                    {mounted && user ? (
                      <>
                        <div className="border-b border-[#E5E7EB] pb-2 mb-2 px-2">
                          <p className="text-[11px] text-gray-400 font-label-caps uppercase tracking-widest">Logged In As</p>
                          <p className="text-[13px] font-semibold text-gray-900 truncate mt-0.5">{user.name}</p>
                        </div>
                        {user.role === "admin" && (
                          <Link 
                            href="/admin" 
                            className="flex items-center gap-2 py-2 px-2 text-[11px] font-label-caps tracking-widest uppercase hover:bg-gray-50 rounded-lg text-gray-700 hover:text-gray-900 transition-colors"
                          >
                            <Sparkles size={13} className="text-primary" /> Admin Hub
                          </Link>
                        )}
                        <button 
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                            router.push("/");
                          }}
                          className="w-full flex items-center gap-2 py-2 px-2 text-[11px] font-label-caps tracking-widest uppercase hover:bg-red-50 rounded-lg text-red-500 font-semibold text-left transition-colors cursor-pointer"
                        >
                          <LogOut size={13} /> Sign Out
                        </button>
                      </>
                    ) : (
                      <Link 
                        href="/login"
                        className="flex items-center gap-2 py-2 px-2 text-[11px] font-label-caps tracking-widest uppercase hover:bg-gray-50 rounded-lg text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        <User size={13} /> Sign In
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Bag Icon */}
            <button 
              onClick={() => setCartDrawerOpen(true)} 
              aria-label="Cart" 
              className="text-on-background hover:text-primary transition-colors duration-300 relative p-1 cursor-pointer block"
            >
              <ShoppingBag size={20} className="stroke-[1.5]" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    key={cartCount}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center pointer-events-none"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* ==================================================
              MOBILE MENU BAR TRIGGER & ACTION GROUP
              ================================================== */}
          <div className="flex xl:hidden items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Search"
              className="text-on-background hover:text-primary transition-colors p-2 cursor-pointer"
            >
              <Search size={20} className="stroke-[1.5]" />
            </button>
            
            {/* Cart */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              aria-label="Cart"
              className="text-on-background hover:text-primary transition-colors p-2 relative cursor-pointer"
            >
              <ShoppingBag size={20} className="stroke-[1.5]" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    key={cartCount}
                    initial={{ scale: 0.7 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.7 }}
                    className="absolute top-1.5 right-1.5 bg-primary text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center pointer-events-none"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Hamburger to X Animated button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              className="flex flex-col gap-1.5 justify-center items-center w-8 h-8 p-1 focus:outline-none cursor-pointer z-50 relative"
            >
              <motion.span
                animate={mobileMenuOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
                className="w-5.5 h-[1.5px] bg-on-background block origin-center rounded"
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-5.5 h-[1.5px] bg-on-background block rounded"
              />
              <motion.span
                animate={mobileMenuOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
                className="w-5.5 h-[1.5px] bg-on-background block origin-center rounded"
              />
            </button>
          </div>

        </div>
      </header>

      {/* ==================================================
          MOBILE SIDEBAR MENU DRAWER
          ================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 pointer-events-auto"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
              className="fixed top-0 right-0 h-screen w-4/5 max-w-sm bg-white z-30 shadow-2xl flex flex-col border-l border-outline/20 pt-[80px]"
            >
              <div className="p-6 flex flex-col gap-5 font-label-caps text-[12px] tracking-[0.2em] uppercase overflow-y-auto">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1">Home</Link>
                
                <div className="border-t border-[#E5E7EB] pt-4 mt-2">
                  <h4 className="text-primary font-semibold mb-3 text-[9px] tracking-widest uppercase">Categories</h4>
                  <Link href="/shop?category=Necklaces" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 block text-gray-500">Necklaces</Link>
                  <Link href="/shop?category=Rings" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 block text-gray-500">Rings</Link>
                  <Link href="/shop?category=Earrings" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 block text-gray-500">Earrings</Link>
                  <Link href="/shop?category=Bracelets" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 block text-gray-500">Bracelets</Link>
                </div>

                <div className="border-t border-[#E5E7EB] pt-4 mt-2">
                  <Link href="/shop?isNew=true" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 block">New Arrivals</Link>
                  <Link href="/shop?isBestSeller=true" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 block mt-3">Best Sellers</Link>
                  <Link href="/shop?collection=gift-guide" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 block mt-3">Gift Guide</Link>
                </div>

                <div className="border-t border-[#E5E7EB] pt-4 mt-2">
                  <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 block">About Us</Link>
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors py-1 block mt-3">Contact</Link>
                </div>
              </div>

              {/* Mobile Drawer Bottom Action */}
              <div className="mt-auto p-6 border-t border-[#E5E7EB] bg-gray-50 flex flex-col gap-3">
                {mounted && user ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-[12px] font-body text-gray-500 text-center">
                      Logged in as <span className="font-semibold text-gray-900">{user.name}</span>
                    </div>
                    {user.role === "admin" && (
                      <Link 
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full py-3 bg-[#7C3AED] text-white text-center font-label-caps text-[9px] tracking-widest uppercase hover:bg-[#7C3AED]/90 transition-all flex items-center justify-center gap-2 rounded-lg shadow-sm"
                      >
                        <Sparkles size={13} /> Admin Console
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                        router.push("/");
                      }}
                      className="w-full py-3 bg-red-600 text-white text-center font-label-caps text-[9px] tracking-widest uppercase hover:bg-red-700 transition-colors flex items-center justify-center gap-2 rounded-lg"
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3.5 bg-gray-900 text-white text-center font-label-caps text-[9px] tracking-widest uppercase hover:bg-primary transition-colors flex items-center justify-center gap-2 rounded-lg shadow-sm"
                  >
                    <User size={13} className="stroke-[1.5]" /> Sign In / Account
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ==================================================
          MOBILE SEARCH OVERLAY
          ================================================== */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-white z-50 xl:hidden flex flex-col p-6 pt-[80px]"
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

      {/* drawers */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      <WishlistDrawer isOpen={wishlistDrawerOpen} onClose={() => setWishlistDrawerOpen(false)} />
    </>
  );
}
