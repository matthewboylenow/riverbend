"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { CATEGORY_META, type MapZone } from "./mapZones";

interface MapZoneDetailProps {
  zone: MapZone | null;
  onClose: () => void;
}

export function MapZoneDetail({ zone, onClose }: MapZoneDetailProps) {
  return (
    <AnimatePresence>
      {zone && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto lg:absolute lg:top-0 lg:h-full lg:rounded-r-2xl"
          >
            {/* Header */}
            <div
              className="relative px-6 pt-6 pb-4"
              style={{ borderBottom: `3px solid ${CATEGORY_META[zone.category].color}` }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-sand transition-colors"
                aria-label="Close detail panel"
              >
                <X className="h-5 w-5 text-bark" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ background: CATEGORY_META[zone.category].color }}
                />
                <span className="text-xs font-semibold uppercase tracking-wide text-bark">
                  {CATEGORY_META[zone.category].label}
                </span>
              </div>
              <h2 className="text-xl font-bold text-charcoal font-camp">{zone.label}</h2>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              <p className="text-body text-bark leading-relaxed">{zone.description}</p>

              {zone.ageGroups && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-bark mb-1">
                    Age Groups
                  </h3>
                  <p className="text-sm text-charcoal">{zone.ageGroups}</p>
                </div>
              )}

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-bark mb-2">
                  Activities
                </h3>
                <ul className="space-y-1">
                  {zone.activities.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm text-charcoal">
                      <span
                        className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ background: CATEGORY_META[zone.category].color }}
                      />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              {zone.learnMoreHref && (
                <Link
                  href={zone.learnMoreHref}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-camp-red hover:underline"
                >
                  Learn more
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
