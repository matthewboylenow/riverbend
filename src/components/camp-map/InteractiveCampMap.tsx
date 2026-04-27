"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { MAP_ZONES, CATEGORY_META, type ZoneCategory, type MapZone } from "./mapZones";
import { MapZoneDetail } from "./MapZoneDetail";
import { MapLegend } from "./MapLegend";

export function InteractiveCampMap() {
  const [selectedZone, setSelectedZone] = useState<MapZone | null>(null);
  const [activeCategory, setActiveCategory] = useState<ZoneCategory | null>(null);

  const handleZoneClick = useCallback((zone: MapZone) => {
    setSelectedZone((prev) => (prev?.id === zone.id ? null : zone));
  }, []);

  const filteredZones = activeCategory
    ? MAP_ZONES.filter((z) => z.category === activeCategory)
    : MAP_ZONES;

  return (
    <div className="relative">
      {/* Legend / Filters */}
      <div className="mb-6">
        <MapLegend
          activeCategory={activeCategory}
          onCategoryClick={setActiveCategory}
        />
      </div>

      {/* Map + Zone List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actual Camp Map Image */}
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-stone/40 bg-white shadow-lg">
          <div className="relative aspect-[4/3]">
            <Image
              src="/assets/site/2022-Camp-Map-JPG-scaled.jpg"
              alt="Camp Riverbend campus map showing all activity zones and facilities"
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Zone List */}
        <div className="lg:col-span-1 overflow-y-auto max-h-[600px] rounded-2xl border border-stone/40 bg-white shadow-lg">
          <div className="sticky top-0 bg-white border-b border-stone/20 px-4 py-3 z-10">
            <h3 className="font-bold text-charcoal text-sm">
              {activeCategory
                ? `${CATEGORY_META[activeCategory].label} Zones`
                : "All Zones"}
              <span className="text-bark font-normal ml-2">
                ({filteredZones.length})
              </span>
            </h3>
          </div>
          <div className="divide-y divide-stone/10">
            {filteredZones.map((zone) => {
              const meta = CATEGORY_META[zone.category];
              const isSelected = selectedZone?.id === zone.id;

              return (
                <button
                  key={zone.id}
                  onClick={() => handleZoneClick(zone)}
                  className={`w-full text-left px-4 py-3 transition-colors hover:bg-cream/50 ${
                    isSelected ? "bg-cream" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: meta.color }}
                    />
                    <span className="font-semibold text-sm text-charcoal">
                      {zone.label}
                    </span>
                  </div>
                  <p className="text-xs text-bark mt-1 line-clamp-2 pl-[18px]">
                    {zone.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <MapZoneDetail zone={selectedZone} onClose={() => setSelectedZone(null)} />
    </div>
  );
}
