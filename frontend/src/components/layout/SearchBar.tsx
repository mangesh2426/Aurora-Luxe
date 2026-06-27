"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, TrendingUp } from "lucide-react";
import api, { mapBackendProduct } from "@/lib/api";
import { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  isMobileOverlay?: boolean;
  onCloseMobile?: () => void;
}

const POPULAR_SEARCHES = ["Gold Necklace", "Stacking Rings", "Hoops", "Bracelets", "Anklets"];

export default function SearchBar({ isMobileOverlay = false, onCloseMobile }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 1. Fetch all products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data.data.map(mapBackendProduct));
      } catch (err) {
        console.error("Failed to load products for search bar:", err);
      }
    };
    loadProducts();
  }, []);

  // 2. Debounce query input
  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
      setLoading(false);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 3. Filter matching products
  useEffect(() => {
    if (!debouncedQuery) {
      setSearchResults([]);
      return;
    }
    const query = debouncedQuery.toLowerCase();
    const matches = products.filter((p) => {
      return (
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.materials?.some((m) => m.toLowerCase().includes(query)) ||
        p.finishes?.some((f) => f.toLowerCase().includes(query))
      );
    });
    setSearchResults(matches.slice(0, 6));
    setActiveIndex(-1);
  }, [debouncedQuery, products]);

  // 4. Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 5. Text highlighting helper
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="text-primary font-semibold">{part}</span>
          ) : part
        )}
      </>
    );
  };

  const handleSelectResult = (product: Product) => {
    setDropdownOpen(false);
    setIsFocused(false);
    setSearchQuery("");
    if (onCloseMobile) onCloseMobile();
    router.push(`/product/${product.id}`);
  };

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!dropdownOpen || searchResults.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
      setIsFocused(false);
      inputRef.current?.blur();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const targetProduct = activeIndex >= 0 ? searchResults[activeIndex] : searchResults[0];
      if (targetProduct) handleSelectResult(targetProduct);
    }
  };

  const showDropdown = isFocused && (searchResults.length > 0 || !searchQuery);

  if (isMobileOverlay) {
    return (
      <div ref={containerRef} className="w-full flex flex-col gap-6">
        {/* Search Input */}
        <div className="relative flex items-center border-b border-outline pb-4">
          <Search size={20} className="text-on-surface-variant/50 stroke-[1.5] mr-4 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search jewelry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full bg-transparent text-[18px] font-display font-light text-on-background focus:outline-none placeholder-on-surface-variant/40 tracking-wide"
          />
          {loading && <Loader2 className="animate-spin text-primary shrink-0" size={18} />}
          {searchQuery && !loading && (
            <button onClick={() => setSearchQuery("")} className="text-on-surface-variant hover:text-primary cursor-pointer shrink-0">
              <X size={18} className="stroke-[1.5]" />
            </button>
          )}
        </div>

        {/* Popular Searches */}
        {!searchQuery && (
          <div>
            <p className="font-label-caps text-[10px] tracking-[0.25em] uppercase text-on-surface-variant mb-4 flex items-center gap-2">
              <TrendingUp size={12} /> Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handlePopularSearch(term)}
                  className="px-4 py-2 border border-outline text-[12px] font-body text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer rounded-sm"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {searchResults.length > 0 && (
          <div className="divide-y divide-outline/30">
            {searchResults.map((product, idx) => (
              <div
                key={product.id}
                onClick={() => handleSelectResult(product)}
                className={`flex items-center gap-5 py-4 cursor-pointer transition-colors group ${activeIndex === idx ? "text-primary" : "hover:text-primary"}`}
              >
                <div className="relative w-14 aspect-square bg-surface-container-low overflow-hidden rounded-sm shrink-0 border border-outline">
                  <Image src={product.imageUrl || "/earrings.png"} alt={product.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-display text-[18px] text-on-background font-medium truncate group-hover:text-primary transition-colors">
                    {highlightText(product.name, searchQuery)}
                  </h4>
                  <p className="font-body text-[11px] text-on-surface-variant uppercase tracking-widest mt-1">{product.category}</p>
                </div>
                <span className="font-body text-[14px] text-primary font-medium shrink-0">₹{product.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {searchQuery && searchResults.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="font-display text-[22px] text-on-surface-variant font-light">No pieces found for</p>
            <p className="font-display text-[22px] text-on-background font-medium mt-1">"{searchQuery}"</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative w-48 lg:w-56`}>
      {/* Desktop Search Input Bar */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setDropdownOpen(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setDropdownOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border-b border-outline focus:border-on-background pl-0 pr-10 py-2 text-[12px] font-body font-light text-on-background focus:outline-none placeholder-on-surface-variant/50 tracking-wide transition-colors"
        />
        <div className="absolute right-0 flex items-center gap-2">
          {loading && <Loader2 className="animate-spin text-primary/50" size={14} />}
          {searchQuery ? (
            <button onClick={() => { setSearchQuery(""); inputRef.current?.focus(); }} className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
              <X size={14} className="stroke-[1.5]" />
            </button>
          ) : (
            <Search size={14} className="text-on-surface-variant/60 stroke-[1.5]" />
          )}
        </div>
      </div>

      {/* Desktop Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-4 bg-white border border-outline shadow-luxury-hover rounded-sm z-50 overflow-hidden min-w-[340px]"
          >
            {!searchQuery ? (
              <div className="p-6">
                <p className="font-label-caps text-[9px] tracking-[0.25em] uppercase text-on-surface-variant mb-4 flex items-center gap-2">
                  <TrendingUp size={11} /> Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handlePopularSearch(term)}
                      className="px-3 py-1.5 border border-outline text-[11px] font-body text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer rounded-sm"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="divide-y divide-outline/30">
                {searchResults.map((product, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleSelectResult(product)}
                      className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${isActive ? "bg-surface-container-low" : "hover:bg-surface"}`}
                    >
                      <div className="relative w-12 aspect-square bg-surface-container-lowest border border-outline overflow-hidden shrink-0 rounded-sm">
                        <Image src={product.imageUrl || "/earrings.png"} alt={product.name} fill sizes="48px" className="object-cover" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-display text-[15px] text-on-background font-medium truncate">
                          {highlightText(product.name, searchQuery)}
                        </h4>
                        <p className="font-body text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">{product.category}</p>
                      </div>
                      <span className="font-body text-[13px] text-primary font-medium shrink-0">₹{product.price.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="font-display text-[18px] text-on-surface-variant font-light">No results for</p>
                <p className="font-display text-[18px] text-on-background font-medium">"{searchQuery}"</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
