import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPriceDollars } from "@/lib/utils";

interface ProductCardProps {
  name: string;
  slug: string;
  price: string;
  image?: string;
  category?: string;
  hasVariants?: boolean;
  className?: string;
}

export function ProductCard({
  name,
  slug,
  price,
  image,
  category,
  hasVariants = false,
  className,
}: ProductCardProps) {
  return (
    <Link
      href={`/shop/${slug}`}
      className={cn(
        "group block rounded-2xl bg-white overflow-hidden card-hover",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-sand">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        {category && (
          <span className="absolute top-3 left-3 badge-camp text-[0.65rem]">
            {category}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-1.5">
        <h3 className="text-sm font-semibold text-charcoal group-hover:text-camp-red transition-colors leading-tight line-clamp-2">
          {name}
        </h3>
        <p className="text-sm font-bold text-camp-red">
          {formatPriceDollars(price)}
        </p>
        <p className="text-xs text-bark pt-1">
          {hasVariants ? "Select Options →" : "View Details →"}
        </p>
      </div>
    </Link>
  );
}
