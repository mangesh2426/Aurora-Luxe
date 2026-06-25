"use client";
import FilterSidebar from "./FilterSidebar";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  selectedCategories,
  onCategoryChange,
  selectedMaterials,
  onMaterialChange,
  selectedFinishes,
  onFinishChange,
  selectedPrices,
  onPriceChange,
  onClearAll
}: MobileFilterDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden pointer-events-auto"
            onClick={onClose}
          />

          {/* Drawer Container */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 300 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.x > 100) onClose();
            }}
            className="fixed top-0 right-0 h-screen w-[300px] bg-white z-50 shadow-2xl flex flex-col border-l border-outline/30 md:hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-outline flex justify-between items-center bg-surface-container-low">
              <h3 className="font-display text-[22px] text-on-background">Filter By</h3>
              <button
                onClick={onClose}
                aria-label="Close filters"
                className="text-on-surface-variant hover:text-primary p-2 border border-outline rounded-full cursor-pointer"
              >
                <X size={16} className="stroke-[1.5]" />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-grow overflow-y-auto p-6">
              <FilterSidebar
                selectedCategories={selectedCategories}
                onCategoryChange={onCategoryChange}
                selectedMaterials={selectedMaterials}
                onMaterialChange={onMaterialChange}
                selectedFinishes={selectedFinishes}
                onFinishChange={onFinishChange}
                selectedPrices={selectedPrices}
                onPriceChange={onPriceChange}
                onClearAll={onClearAll}
              />
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-outline bg-surface-container-low">
              <button
                onClick={onClose}
                className="w-full py-4 bg-on-background text-white text-center font-label-caps text-[11px] tracking-widest uppercase hover:bg-primary transition-colors flex items-center justify-center font-semibold cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
