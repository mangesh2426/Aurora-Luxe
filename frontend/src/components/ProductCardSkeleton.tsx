export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white border border-outline/10 rounded-2xl overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="w-full aspect-[4/5] bg-[#F0EDE8]" />

      {/* Info layer */}
      <div className="flex flex-col items-center text-center pt-5 pb-5 px-4 gap-2">
        {/* Category */}
        <div className="h-2.5 w-16 bg-[#EDE9E3] rounded-full" />
        {/* Name */}
        <div className="h-5 w-3/4 bg-[#EDE9E3] rounded-full mt-1" />
        {/* Stars */}
        <div className="flex gap-1 mt-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 bg-[#EDE9E3] rounded-full" />
          ))}
        </div>
        {/* Price */}
        <div className="h-4 w-20 bg-[#EDE9E3] rounded-full mt-2" />
      </div>
    </div>
  );
}
