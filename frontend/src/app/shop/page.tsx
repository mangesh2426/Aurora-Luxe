"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import FilterSidebar from "@/components/product/FilterSidebar";
import MobileFilterDrawer from "@/components/product/MobileFilterDrawer";
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
    <main className="flex-grow pt-8 pb-32 max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop bg-white text-on-background overflow-hidden">
      {/* Page Header */}
      <div className="mb-12 border-b border-outline pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <nav aria-label="Breadcrumb" className="flex text-on-surface-variant mb-4 font-label-caps text-[9px] tracking-[0.25em] uppercase">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-3 text-outline">/</span>
            <span className="text-primary font-medium">Shop All</span>
          </nav>
          <h1 className="font-display text-[42px] md:text-[58px] text-on-background leading-none font-light tracking-wide">
            The Collection
          </h1>
        </div>
        
        <div className="flex items-center justify-between w-full md:w-auto gap-8 font-label-caps text-[10px] tracking-[0.2em] uppercase">
          <span className="text-on-surface-variant hidden md:inline-block font-semibold">
            {filtered.length} Pieces Found
          </span>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 text-on-surface border border-outline px-6 py-3 hover:bg-surface-container-low transition-colors font-semibold cursor-pointer"
          >
            <SlidersHorizontal size={14} className="stroke-[1.5]" />
            Filters
          </button>
          
          <div className="relative group z-20">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border border-outline text-on-surface text-[10px] uppercase font-label-caps tracking-widest px-4 py-3 cursor-pointer focus:outline-none"
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

      <div className="flex flex-col md:flex-row gap-16">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-[240px] flex-shrink-0">
          <div className="sticky top-[140px] max-h-[calc(100vh-160px)] overflow-y-auto hide-scrollbar pr-4">
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
              <div className="flex justify-center items-center py-32">
                <Loader2 className="animate-spin text-primary" size={48} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-32 border border-outline/30 bg-surface">
                <Search size={48} className="text-outline mb-6 mx-auto stroke-[1.2]" />
                <h3 className="font-display text-[26px] text-on-background mb-4 font-semibold">No Products Match Your Criteria</h3>
                <p className="font-body text-[14px] text-on-surface-variant font-light mb-8 max-w-sm mx-auto">Try clearing your filters or altering search words to discover items.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-10 py-4 bg-primary text-on-primary font-label-caps text-[11px] tracking-[0.2em] uppercase hover:bg-primary-container transition-colors cursor-pointer font-semibold"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
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
      <div className="flex justify-center items-center py-40">
        <span className="material-symbols-outlined text-[36px] animate-spin">progress_activity</span>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
