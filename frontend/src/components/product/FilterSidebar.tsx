"use client";

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
  return (
    <div className="space-y-12">
      {/* Category Checkboxes */}
      <div className="border-b border-outline pb-8">
        <h3 className="font-label-caps text-[12px] tracking-[0.2em] uppercase text-on-background mb-6">Category</h3>
        <div className="space-y-4">
          {["Rings", "Earrings", "Necklaces", "Bracelets", "Combos"].map((cat) => {
            const isChecked = selectedCategories.includes(cat);
            return (
              <label key={cat} className="flex items-center gap-4 cursor-pointer group select-none">
                <div
                  onClick={() => onCategoryChange(cat)}
                  className={`w-4.5 h-4.5 border flex items-center justify-center transition-all duration-300 ${
                    isChecked ? "border-primary bg-primary/10" : "border-outline group-hover:border-primary/50"
                  }`}
                >
                  {isChecked && <div className="w-2.5 h-2.5 bg-primary"></div>}
                </div>
                <span
                  onClick={() => onCategoryChange(cat)}
                  className={`font-body text-[14px] transition-colors duration-300 ${
                    isChecked ? "text-primary font-medium" : "text-on-surface-variant group-hover:text-primary"
                  }`}
                >
                  {cat}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Checkboxes */}
      <div className="border-b border-outline pb-8">
        <h3 className="font-label-caps text-[12px] tracking-[0.2em] uppercase text-on-background mb-6">Price</h3>
        <div className="space-y-4">
          {[
            { label: "Under $1,000", value: "under-1000" },
            { label: "$1,000 - $2,000", value: "1000-2000" },
            { label: "Above $2,000", value: "above-2000" }
          ].map((range) => {
            const isChecked = selectedPrices.includes(range.value);
            return (
              <label key={range.value} className="flex items-center gap-4 cursor-pointer group select-none">
                <div
                  onClick={() => onPriceChange(range.value)}
                  className={`w-4.5 h-4.5 border flex items-center justify-center transition-all duration-300 ${
                    isChecked ? "border-primary bg-primary/10" : "border-outline group-hover:border-primary/50"
                  }`}
                >
                  {isChecked && <div className="w-2.5 h-2.5 bg-primary"></div>}
                </div>
                <span
                  onClick={() => onPriceChange(range.value)}
                  className={`font-body text-[14px] transition-colors duration-300 ${
                    isChecked ? "text-primary font-medium" : "text-on-surface-variant group-hover:text-primary"
                  }`}
                >
                  {range.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Finish Checkboxes */}
      <div className="border-b border-outline pb-8">
        <h3 className="font-label-caps text-[12px] tracking-[0.2em] uppercase text-on-background mb-6">Color Finish</h3>
        <div className="space-y-4">
          {[
            { label: "Champagne Gold", hex: "#DFBA73" },
            { label: "Rose Gold", hex: "#E0A899" },
            { label: "Silver", hex: "#E2E2E2" }
          ].map((color) => {
            const isChecked = selectedFinishes.includes(color.label);
            return (
              <label key={color.label} className="flex items-center gap-4 cursor-pointer group select-none">
                <div
                  onClick={() => onFinishChange(color.label)}
                  className={`w-4.5 h-4.5 border flex items-center justify-center transition-all duration-300 ${
                    isChecked ? "border-primary bg-primary/10" : "border-outline group-hover:border-primary/50"
                  }`}
                >
                  {isChecked && <div className="w-2.5 h-2.5 bg-primary"></div>}
                </div>
                <span
                  onClick={() => onFinishChange(color.label)}
                  className="flex items-center gap-2 font-body text-[14px] text-on-surface-variant group-hover:text-primary transition-colors"
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block" style={{ backgroundColor: color.hex }} />
                  {color.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Material Checkboxes */}
      <div className="border-b border-outline pb-8">
        <h3 className="font-label-caps text-[12px] tracking-[0.2em] uppercase text-on-background mb-6">Material Base</h3>
        <div className="space-y-4">
          {["18k Solid Gold", "14k Solid Gold", "Sterling Silver"].map((mat) => {
            const isChecked = selectedMaterials.includes(mat);
            return (
              <label key={mat} className="flex items-center gap-4 cursor-pointer group select-none">
                <div
                  onClick={() => onMaterialChange(mat)}
                  className={`w-4.5 h-4.5 border flex items-center justify-center transition-all duration-300 ${
                    isChecked ? "border-primary bg-primary/10" : "border-outline group-hover:border-primary/50"
                  }`}
                >
                  {isChecked && <div className="w-2.5 h-2.5 bg-primary"></div>}
                </div>
                <span
                  onClick={() => onMaterialChange(mat)}
                  className={`font-body text-[14px] transition-colors duration-300 ${
                    isChecked ? "text-primary font-medium" : "text-on-surface-variant group-hover:text-primary"
                  }`}
                >
                  {mat}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={onClearAll}
        className="w-full py-3 border border-outline hover:border-on-background text-on-surface hover:text-on-background text-[11px] font-label-caps uppercase tracking-widest transition-colors font-semibold"
      >
        Clear All Filters
      </button>
    </div>
  );
}
