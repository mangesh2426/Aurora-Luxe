"use client";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: "sm" | "md";
}

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  size = "md"
}: QuantitySelectorProps) {
  const isSm = size === "sm";

  return (
    <div className={`flex items-center border border-outline bg-transparent ${isSm ? "h-8 w-24" : "h-14 w-32"}`}>
      <button
        onClick={onDecrease}
        type="button"
        className={`flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer ${
          isSm ? "w-8 h-full" : "w-10 h-full"
        }`}
      >
        <Minus size={14} className="stroke-[1.5]" />
      </button>
      <input
        type="text"
        aria-label="Quantity selector input"
        value={quantity}
        readOnly
        className="w-full text-center border-none bg-transparent font-body text-[13px] text-on-background focus:ring-0 p-0 pointer-events-none select-none"
      />
      <button
        onClick={onIncrease}
        type="button"
        className={`flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer ${
          isSm ? "w-8 h-full" : "w-10 h-full"
        }`}
      >
        <Plus size={14} className="stroke-[1.5]" />
      </button>
    </div>
  );
}
