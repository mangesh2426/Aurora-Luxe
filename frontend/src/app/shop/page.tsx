"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import FilterSidebar from "@/components/product/FilterSidebar";
import MobileFilterDrawer from "@/components/product/MobileFilterDrawer";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { SlidersHorizontal, Search, Heart, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api, { mapBackendProduct } from "@/lib/api";
import { Product } from "@/types";

function ShopContent() {
  const searchParams = useSearchParams();
  const { addToCart, toggleWishlist, wishlist } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("default");
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products');
        setProducts(res.data.data.map(mapBackendProduct));
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Scroll to top when shop products finish loading
  useEffect(() => {
    if (!loading) {
      window.scrollTo({ top: 0, behavior: 'instant' as any });
    }
  }, [loading]);

  // Sync state from query parameters
  useEffect(() => {
    const categoryQuery = searchParams.get("category");
    if (categoryQuery) {
      setSelectedCategories([categoryQuery]);
    } else {
      setSelectedCategories([]);
    }

    const searchQueryParam = searchParams.get("search");
    if (searchQueryParam) {
      setSearchQuery(searchQueryParam.toLowerCase());
    } else {
      setSearchQuery("");
    }

    const sortQuery = searchParams.get("sort");
    if (sortQuery === "new") {
      setSortBy("newest");
    }
  }, [searchParams]);

  // Handle filter state togglers
  const handleCategoryChange = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleMaterialChange = (mat: string) => {
    setSelectedMaterials(prev =>
      prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
    );
  };

  const handleFinishChange = (finish: string) => {
    setSelectedFinishes(prev =>
      prev.includes(finish) ? prev.filter(f => f !== finish) : [...prev, finish]
    );
  };

  const handlePriceChange = (range: string) => {
    setSelectedPrices(prev =>
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setSelectedFinishes([]);
    setSelectedPrices([]);
    setSearchQuery("");
  };

  // Filter products matching active criteria
  let filtered = [...products];

  if (searchQuery) {
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery)
    );
  }

  if (selectedCategories.length > 0) {
    filtered = filtered.filter(p => selectedCategories.includes(p.category));
  }

  if (selectedMaterials.length > 0) {
    filtered = filtered.filter(p =>
      p.materials?.some(m => selectedMaterials.includes(m))
    );
  }

  if (selectedFinishes.length > 0) {
    filtered = filtered.filter(p =>
      p.finishes?.some(f => selectedFinishes.includes(f))
    );
  }

  if (selectedPrices.length > 0) {
    filtered = filtered.filter(p => {
      return selectedPrices.some(r => {
        if (r === "under-1000") return p.price < 1000;
        if (r === "1000-2000") return p.price >= 1000 && p.price <= 2000;
        if (r === "above-2000") return p.price > 2000;
        return true;
      });
    });
  }

  // Sorting
  if (sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "discount") {
    filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
  } else if (sortBy === "newest") {
    filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  return (
    <main className="flex-grow pb-32 bg-background text-on-background overflow-hidden">
      {/* Page Header */}
      <div className="bg-white border-b border-outline">
        <div className="max-w-container-max mx-auto px-6 md:px-16 py-16 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <nav aria-label="Breadcrumb" className="flex text-on-surface-variant mb-4 font-label-caps text-[9px] tracking-[0.3em] uppercase">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="mx-3 text-outline/50">/</span>
              <span className="text-primary font-semibold">The Collection</span>
            </nav>
            <h1 className="font-display text-[48px] md:text-[64px] text-on-background leading-none font-light tracking-wide">
              The Collection
            </h1>
            <p className="font-body text-[13px] text-on-surface-variant font-light mt-3">{filtered.length} curated pieces</p>
          </div>
          
          <div className="flex items-center justify-between w-full md:w-auto gap-6">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 text-on-surface border border-outline px-6 py-3 hover:bg-surface-container-low transition-colors font-label-caps text-[10px] tracking-widest uppercase cursor-pointer"
            >
              <SlidersHorizontal size={14} className="stroke-[1.5]" />
              Filters
            </button>
            
            <div className="relative z-20">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border border-outline text-on-background text-[10px] uppercase font-label-caps tracking-widest px-5 py-3 cursor-pointer focus:outline-none focus:border-primary hover:border-on-background transition-colors"
              >
                <option value="default">Sort: Recommended</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="discount">Highest Discount</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-6 md:px-16 pt-12 flex flex-col md:flex-row gap-12 md:gap-16">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-[260px] flex-shrink-0">
          <div className="sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto hide-scrollbar">
            <FilterSidebar
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              selectedMaterials={selectedMaterials}
              onMaterialChange={handleMaterialChange}
              selectedFinishes={selectedFinishes}
              onFinishChange={handleFinishChange}
              selectedPrices={selectedPrices}
              onPriceChange={handlePriceChange}
              onClearAll={clearAllFilters}
            />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-40 border border-outline">
                <Search size={40} className="text-on-surface-variant/30 mb-6 mx-auto stroke-[1]" />
                <h3 className="font-display text-[28px] text-on-background mb-4 font-light">No Pieces Found</h3>
                <p className="font-body text-[14px] text-on-surface-variant font-light mb-10 max-w-sm mx-auto">Try clearing your filters or exploring our full collection.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-10 py-4 bg-on-background text-white font-label-caps text-[11px] tracking-[0.2em] uppercase hover:bg-primary transition-colors cursor-pointer font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
        selectedMaterials={selectedMaterials}
        onMaterialChange={handleMaterialChange}
        selectedFinishes={selectedFinishes}
        onFinishChange={handleFinishChange}
        selectedPrices={selectedPrices}
        onPriceChange={handlePriceChange}
        onClearAll={clearAllFilters}
      />
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="flex-grow pt-8 pb-32 max-w-container-max mx-auto w-full px-4 md:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mt-24">
          {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
