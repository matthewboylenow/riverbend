"use client";

import { useState, useCallback, useRef } from "react";
import { MAP_ZONES, CATEGORY_META, type ZoneCategory, type MapZone } from "./mapZones";
import { MapTooltip } from "./MapTooltip";
import { MapZoneDetail } from "./MapZoneDetail";
import { MapLegend } from "./MapLegend";

export function InteractiveCampMap() {
  const [hoveredZone, setHoveredZone] = useState<MapZone | null>(null);
  const [selectedZone, setSelectedZone] = useState<MapZone | null>(null);
  const [activeCategory, setActiveCategory] = useState<ZoneCategory | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleZoneClick = useCallback((zone: MapZone) => {
    setSelectedZone((prev) => (prev?.id === zone.id ? null : zone));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, zone: MapZone) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleZoneClick(zone);
      }
    },
    [handleZoneClick]
  );

  const isZoneDimmed = (zone: MapZone) =>
    activeCategory !== null && zone.category !== activeCategory;

  return (
    <div className="relative">
      {/* Legend / Filters */}
      <div className="mb-6">
        <MapLegend
          activeCategory={activeCategory}
          onCategoryClick={setActiveCategory}
        />
      </div>

      {/* Map Container */}
      <div className="relative flex gap-0 overflow-hidden rounded-2xl border border-stone/40 bg-white shadow-lg">
        {/* SVG Map */}
        <div className="flex-1 overflow-auto">
          <svg
            ref={svgRef}
            viewBox="0 0 840 440"
            className="w-full h-auto min-h-[400px]"
            onMouseMove={handleMouseMove}
            role="img"
            aria-label="Interactive map of Camp Riverbend showing all activity zones and facilities"
          >
            {/* ── Base layer ── */}
            {/* Green background */}
            <rect x="0" y="0" width="840" height="440" fill="#e8f0dc" rx="8" />

            {/* River on west side */}
            <path
              d="M30,0 Q20,80 25,160 Q35,240 20,320 Q15,400 30,440"
              fill="none"
              stroke="#87CEEB"
              strokeWidth="30"
              opacity="0.5"
            />
            <path
              d="M30,0 Q20,80 25,160 Q35,240 20,320 Q15,400 30,440"
              fill="none"
              stroke="#5098B8"
              strokeWidth="3"
              opacity="0.4"
            />

            {/* Main road path */}
            <path
              d="M416,440 L416,390 Q416,370 400,360 L340,340 Q320,330 310,310 L310,100 Q310,80 330,80 L600,80 Q620,80 620,100 L620,200"
              fill="none"
              stroke="#D4CFC6"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* Secondary paths */}
            <path
              d="M130,300 L300,300 M200,200 L300,200 M450,200 L450,350"
              fill="none"
              stroke="#D4CFC6"
              strokeWidth="4"
              strokeDasharray="8 4"
              opacity="0.4"
            />

            {/* ── Decorative trees ── */}
            {[
              [60, 120], [80, 180], [50, 240],
              [750, 100], [770, 200], [780, 340],
              [350, 80], [500, 80],
            ].map(([x, y], i) => (
              <g key={`tree-${i}`} opacity="0.3">
                <circle cx={x} cy={y} r="8" fill="#2D5016" />
                <circle cx={(x as number) + 6} cy={(y as number) + 4} r="6" fill="#3D6B1E" />
              </g>
            ))}

            {/* ── Zone areas ── */}
            {MAP_ZONES.map((zone) => {
              const meta = CATEGORY_META[zone.category];
              const dimmed = isZoneDimmed(zone);
              const isSelected = selectedZone?.id === zone.id;
              const isHovered = hoveredZone?.id === zone.id;

              return (
                <g
                  key={zone.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${zone.label} — ${meta.label}`}
                  onClick={() => handleZoneClick(zone)}
                  onKeyDown={(e) => handleKeyDown(e, zone)}
                  onMouseEnter={() => setHoveredZone(zone)}
                  onMouseLeave={() => setHoveredZone(null)}
                  className="cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ outline: "none" }}
                >
                  {/* Zone fill */}
                  <path
                    d={zone.path}
                    fill={meta.color}
                    fillOpacity={dimmed ? 0.08 : isSelected ? 0.45 : isHovered ? 0.35 : 0.2}
                    stroke={meta.color}
                    strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                    strokeOpacity={dimmed ? 0.2 : 1}
                    rx="4"
                    style={{ transition: "all 200ms ease" }}
                  />

                  {/* Zone label */}
                  <text
                    x={zone.cx}
                    y={zone.cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={dimmed ? "#aaa" : "#2C2C2C"}
                    fontSize="8"
                    fontWeight="600"
                    style={{
                      pointerEvents: "none",
                      transition: "fill 200ms ease",
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    {zone.label}
                  </text>
                </g>
              );
            })}

            {/* ── Title text ── */}
            <text x="420" y="30" textAnchor="middle" fill="#2D5016" fontSize="16" fontWeight="700" style={{ fontFamily: "system-ui, sans-serif" }}>
              Camp Riverbend Campus Map
            </text>
            <text x="420" y="50" textAnchor="middle" fill="#6B5B4E" fontSize="9" style={{ fontFamily: "system-ui, sans-serif" }}>
              116 Hillcrest Road, Warren, NJ — Click any zone to learn more
            </text>

            {/* ── Compass rose ── */}
            <g transform="translate(790, 410)">
              <circle cx="0" cy="0" r="14" fill="white" fillOpacity="0.8" stroke="#D4CFC6" strokeWidth="1" />
              <text x="0" y="-4" textAnchor="middle" fill="#2D5016" fontSize="8" fontWeight="700" style={{ fontFamily: "system-ui, sans-serif" }}>N</text>
              <path d="M0,-2 L-3,6 L0,4 L3,6 Z" fill="#2D5016" />
            </g>
          </svg>
        </div>
      </div>

      {/* Tooltip */}
      <MapTooltip zone={hoveredZone} x={tooltipPos.x} y={tooltipPos.y} />

      {/* Detail Panel */}
      <MapZoneDetail zone={selectedZone} onClose={() => setSelectedZone(null)} />
    </div>
  );
}
