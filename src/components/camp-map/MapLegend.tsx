"use client";

import { cn } from "@/lib/utils";
import { CATEGORY_META, type ZoneCategory } from "./mapZones";

interface MapLegendProps {
  activeCategory: ZoneCategory | null;
  onCategoryClick: (category: ZoneCategory | null) => void;
}

const categories = Object.entries(CATEGORY_META) as [ZoneCategory, (typeof CATEGORY_META)[ZoneCategory]][];

export function MapLegend({ activeCategory, onCategoryClick }: MapLegendProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryClick(null)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200",
          activeCategory === null
            ? "bg-charcoal text-white shadow-md"
            : "bg-sand text-bark hover:bg-stone"
        )}
      >
        All
      </button>
      {categories.map(([key, meta]) => (
        <button
          key={key}
          onClick={() => onCategoryClick(activeCategory === key ? null : key)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200",
            activeCategory === key
              ? "text-white shadow-md"
              : "bg-sand text-bark hover:bg-stone"
          )}
          style={
            activeCategory === key
              ? { background: meta.color }
              : undefined
          }
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: meta.color }}
          />
          {meta.label}
        </button>
      ))}
    </div>
  );
}
