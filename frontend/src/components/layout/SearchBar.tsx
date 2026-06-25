"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import api, { mapBackendProduct } from "@/lib/api";
import { Product } from "@/types";

interface SearchBarProps {
  isMobileOverlay?: boolean;
  onCloseMobile?: () => void;
}

export default function SearchBar({ isMobileOverlay = false, onCloseMobile }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 1. Fetch all products on focus/mount to enable fast local filtering
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

  // 3. Filter matching products locally when debounced query changes
  useEffect(() => {
    if (!debouncedQuery) {
      setSearchResults([]);
      setDropdownOpen(false);
      return;
    }

    const query = debouncedQuery.toLowerCase();
    const matches = products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(query);
      const matchCategory = p.category.toLowerCase().includes(query);
      const matchMaterials = p.materials.some((m) => m.toLowerCase().includes(query));
      const matchFinishes = p.finishes.some((f) => f.toLowerCase().includes(query));
      return matchName || matchCategory || matchMaterials || matchFinishes;
    });

    setSearchResults(matches.slice(0, 5));
    setDropdownOpen(true);
    setActiveIndex(-1); // Reset index on new search results
  }, [debouncedQuery, products]);

  // 4. Handle clicks outside the search area to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
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
            <span key={i} className="text-primary font-medium">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const handleSelectResult = (product: Product) => {
    setDropdownOpen(false);
    setSearchQuery("");
    if (onCloseMobile) onCloseMobile();
    router.push(`/product/${product.id}`);
  };

  // 6. Keyboard events
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
      inputRef.current?.blur();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const targetProduct = activeIndex >= 0 ? searchResults[activeIndex] : searchResults[0];
      if (targetProduct) {
        handleSelectResult(targetProduct);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${
        isMobileOverlay ? "w-full max-w-lg mx-auto" : "w-64 lg:w-72"
      }`}
    >
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search necklaces, rings, earrings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery.trim() && setDropdownOpen(true)}
          className={`w-full bg-surface-container-low border border-outline/50 pl-5 pr-11 py-2 text-[13px] font-body font-light text-on-background rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm hover:shadow transition-all duration-300 placeholder-on-surface-variant/70`}
        />
        <div className="absolute right-4 flex items-center gap-2">
          {loading && <Loader2 className="animate-spin text-primary" size={16} />}
          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery("");
                inputRef.current?.focus();
              }}
              className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <X size={16} className="stroke-[1.5]" />
            </button>
          ) : (
            <Search size={16} className="text-on-surface-variant/80 stroke-[1.5]" />
          )}
        </div>
      </div>

      {/* Live Dropdown Card */}
      {dropdownOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-md border border-outline/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-2xl z-50 overflow-hidden transition-all duration-300"
        >
          {searchResults.length > 0 ? (
            <div className="divide-y divide-outline/10">
              {searchResults.map((product, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={product.id}
                    onClick={() => handleSelectResult(product)}
                    className={`flex items-center gap-4 p-3.5 cursor-pointer transition-colors duration-300 ${
                      isActive ? "bg-surface-container" : "hover:bg-[#FAF8F5]"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-11 h-13 bg-[#FAF8F5] border border-outline/10 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.imageUrl || "/hero_model.png"}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    {/* Info */}
                    <div className="flex-grow min-w-0">
                      <h4 className="font-display text-[15px] text-on-surface font-medium truncate">
                        {highlightText(product.name, searchQuery)}
                      </h4>
                      <p className="font-body text-[10px] text-on-surface-variant/80 uppercase tracking-[0.12em] font-light mt-1">
                        {highlightText(product.category, searchQuery)}
                      </p>
                    </div>
                    {/* Price */}
                    <div className="font-body text-[13px] text-primary font-semibold flex-shrink-0">
                      ₹{product.price.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-on-surface-variant/80 font-body text-[13px] italic">
              No jewellery found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
