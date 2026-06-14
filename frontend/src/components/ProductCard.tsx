import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  imageUrl,
  isNew,
  isBestSeller,
}: ProductCardProps) {
  return (
    <div className="group flex flex-col h-full bg-transparent relative lux-transition">
      {/* Badges */}
      {(isNew || isBestSeller) && (
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isNew && (
            <span className="bg-surface-container/80 backdrop-blur-sm border border-outline text-primary font-label-caps text-[10px] px-3 py-1 uppercase tracking-widest lux-transition">
              New
            </span>
          )}
          {isBestSeller && (
            <span className="bg-surface-container/80 backdrop-blur-sm border border-outline text-primary font-label-caps text-[10px] px-3 py-1 uppercase tracking-widest lux-transition">
              Best Seller
            </span>
          )}
        </div>
      )}
      <button className="absolute top-3 right-3 z-10 text-on-surface hover:text-primary transition-colors p-2 bg-surface-container/40 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 lux-transition cursor-pointer">
        <Heart size={18} className="stroke-[1.5]" />
      </button>

      {/* Image Area */}
      <Link href={`/product/${id}`} className="block w-full">
        <div className="aspect-[4/5] bg-surface-container-low relative overflow-hidden mb-4 lux-border">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 lux-transition"></div>
          
          {/* Quick Add Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 lux-transition hidden md:block z-20">
            <button className="w-full bg-primary text-on-primary font-label-caps text-[10px] tracking-[0.2em] uppercase py-3 hover:bg-primary-container transition-colors cursor-pointer">
              Quick Add
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-grow items-center text-center px-2">
        <Link href={`/product/${id}`}>
          <h3 className="font-display text-[18px] md:text-[20px] text-on-surface mb-1 hover:text-primary transition-colors tracking-wide">
            {name}
          </h3>
        </Link>
        <p className="font-body text-[12px] text-on-surface-variant mb-3 font-light tracking-wider">
          {description}
        </p>
        <p className="font-body text-[14px] text-primary mt-auto tracking-wider">
          ${price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
