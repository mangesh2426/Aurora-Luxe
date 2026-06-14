"use client";
import { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0] || "");

  if (images.length === 0) {
    return <div className="aspect-[4/5] bg-surface-container-low border border-outline animate-pulse" />;
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-6">
      {/* Thumbnail Bar */}
      <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible hide-scrollbar pb-4 md:pb-0 w-full md:w-24 shrink-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(img)}
            className={`w-20 h-24 md:w-24 md:h-28 bg-surface-container-low shrink-0 relative overflow-hidden group transition-all duration-300 ${
              activeImage === img
                ? "border border-primary scale-[0.98]"
                : "border border-outline opacity-60 hover:opacity-100 hover:scale-[0.98]"
            }`}
          >
            <Image
              src={img}
              alt={`Product view thumbnail ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* Main Preview Container */}
      <div className="w-full aspect-[4/5] bg-surface-container-low relative overflow-hidden border border-outline select-none group shadow-sm">
        <Image
          src={activeImage}
          alt="Active product display representation"
          fill
          priority
          className="object-cover transition-transform duration-[2s] group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-md px-4 py-1.5 flex items-center gap-2 border border-outline shadow-sm">
          <Sparkles size={14} className="text-primary stroke-[1.5]" />
          <span className="font-label-caps text-[9px] tracking-[0.2em] uppercase text-primary font-semibold">Antitarnish</span>
        </div>
      </div>
    </div>
  );
}
