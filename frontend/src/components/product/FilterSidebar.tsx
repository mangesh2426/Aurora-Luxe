"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface FilterSidebarProps {
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  selectedMaterials: string[];
  onMaterialChange: (material: string) => void;
  selectedFinishes: string[];
  onFinishChange: (finish: string) => void;
  selectedPrices: string[];
  onPriceChange: (priceRange: string) => void;
  onClearAll: () => void;
}

const activeFiltersCount = (cats: string[], mats: string[], fins: string[], prices: string[]) =>
  cats.length + mats.length + fins.length + prices.length;

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-sm"
    >
      <span className="font-label-caps text-[9px] tracking-widest uppercase font-medium">{label}</span>
      <button onClick={onRemove} className="hover:text-on-background transition-colors cursor-pointer">
        <X size={10} className="stroke-[2]" />
      </button>
    </motion.div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-outline py-8">
      <h3 className="font-label-caps text-[10px] tracking-[0.25em] uppercase text-on-background font-semibold mb-6">{title}</h3>
      {children}
    </div>
  );
}

function FilterOption({ label, checked, onChange, colorHex }: { label: string; checked: boolean; onChange: () => void; colorHex?: string }) {
  return (
    <label className="flex items-center gap-4 cursor-pointer group select-none py-1" onClick={onChange}>
      <div className={`w-4 h-4 border flex items-center justify-center transition-all duration-300 rounded-sm ${
        checked ? "border-primary bg-primary" : "border-outline group-hover:border-primary/50"
      }`}>
        {checked && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span className={`flex items-center gap-3 font-body text-[13px] transition-colors duration-200 ${
        checked ? "text-primary font-medium" : "text-on-surface-variant group-hover:text-on-background"
      }`}>
        {colorHex && (
          <span className="w-4 h-4 rounded-full border border-outline/30 inline-block shrink-0" style={{ backgroundColor: colorHex }} />
        )}
        {label}
      </span>
    </label>
  );
}

export default function FilterSidebar({
  selectedCategories,
  onCategoryChange,
  selectedMaterials,
  onMaterialChange,
  selectedFinishes,
  onFinishChange,
  selectedPrices,
  onPriceChange,
  onClearAll
}: FilterSidebarProps) {
  const totalFilters = activeFiltersCount(selectedCategories, selectedMaterials, selectedFinishes, selectedPrices);

  return (
    <div>
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4 pb-6 border-b border-outline">
        <div className="flex items-center gap-3">
          <span className="font-label-caps text-[11px] tracking-[0.2em] uppercase text-on-background font-semibold">Filters</span>
          {totalFilters > 0 && (
            <span className="bg-primary text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totalFilters}
            </span>
          )}
        </div>
        {totalFilters > 0 && (
          <button
            onClick={onClearAll}
            className="font-label-caps text-[9px] tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors cursor-pointer border-b border-transparent hover:border-primary pb-0.5"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      <AnimatePresence>
        {totalFilters > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {selectedCategories.map(c => <FilterChip key={c} label={c} onRemove={() => onCategoryChange(c)} />)}
            {selectedMaterials.map(m => <FilterChip key={m} label={m} onRemove={() => onMaterialChange(m)} />)}
            {selectedFinishes.map(f => <FilterChip key={f} label={f} onRemove={() => onFinishChange(f)} />)}
            {selectedPrices.map(p => <FilterChip key={p} label={p.replace(/-/g, ' ')} onRemove={() => onPriceChange(p)} />)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category */}
      <FilterGroup title="Category">
        <div className="space-y-3">
          {["Rings", "Earrings", "Necklaces", "Bracelets", "Combos"].map((cat) => (
            <FilterOption
              key={cat}
              label={cat}
              checked={selectedCategories.includes(cat)}
              onChange={() => onCategoryChange(cat)}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Price */}
      <FilterGroup title="Price Range">
        <div className="space-y-3">
          {[
            { label: "Under ₹1,000", value: "under-1000" },
            { label: "₹1,000 – ₹2,000", value: "1000-2000" },
            { label: "Above ₹2,000", value: "above-2000" }
          ].map((range) => (
            <FilterOption
              key={range.value}
              label={range.label}
              checked={selectedPrices.includes(range.value)}
              onChange={() => onPriceChange(range.value)}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Finish / Color */}
      <FilterGroup title="Color Finish">
        <div className="space-y-3">
          {[
            { label: "Champagne Gold", hex: "#DFBA73" },
            { label: "Rose Gold", hex: "#E0A899" },
            { label: "Silver", hex: "#C0C0C0" }
          ].map((color) => (
            <FilterOption
              key={color.label}
              label={color.label}
              checked={selectedFinishes.includes(color.label)}
              onChange={() => onFinishChange(color.label)}
              colorHex={color.hex}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Material */}
      <FilterGroup title="Material">
        <div className="space-y-3">
          {["18k Solid Gold", "14k Solid Gold", "Sterling Silver"].map((mat) => (
            <FilterOption
              key={mat}
              label={mat}
              checked={selectedMaterials.includes(mat)}
              onChange={() => onMaterialChange(mat)}
            />
          ))}
        </div>
      </FilterGroup>
    </div>
  );
}
