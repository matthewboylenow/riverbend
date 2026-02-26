"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CATEGORY_META, type MapZone } from "./mapZones";

interface MapTooltipProps {
  zone: MapZone | null;
  x: number;
  y: number;
}

export function MapTooltip({ zone, x, y }: MapTooltipProps) {
  return (
    <AnimatePresence>
      {zone && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none fixed z-50 max-w-xs rounded-xl bg-white px-4 py-3 shadow-xl border border-stone/30"
          style={{ left: x + 16, top: y - 8 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: CATEGORY_META[zone.category].color }}
            />
            <span className="text-xs font-semibold uppercase tracking-wide text-bark">
              {CATEGORY_META[zone.category].label}
            </span>
          </div>
          <p className="text-sm font-bold text-charcoal">{zone.label}</p>
          <p className="text-xs text-bark mt-0.5 line-clamp-2">{zone.description}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
