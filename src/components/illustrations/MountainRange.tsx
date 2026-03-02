"use client";

import { motion } from "framer-motion";

export function MountainRange({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 800 150"
      fill="none"
      preserveAspectRatio="xMidYMax meet"
      className={`w-full max-w-3xl mx-auto ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Sky gradient hint */}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#87CEEB" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="mtBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4CFC6" />
          <stop offset="100%" stopColor="#C5BFB5" />
        </linearGradient>
        <linearGradient id="mtFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3D6B1E" />
          <stop offset="100%" stopColor="#2D5016" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="800" height="150" fill="url(#skyGrad)" />

      {/* Back range — filled, softer color */}
      <motion.path
        d="M0 150 L0 110 L60 85 L120 100 L200 60 L280 90 L360 50 L440 78 L500 55 L580 75 L640 45 L720 80 L800 110 L800 150Z"
        fill="url(#mtBack)"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 0.5, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Front range — filled, forest green */}
      <motion.path
        d="M0 150 L0 120 L80 90 L160 108 L260 65 L340 95 L420 72 L500 100 L560 78 L650 55 L730 88 L800 120 L800 150Z"
        fill="url(#mtFront)"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 0.6, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
      />

      {/* Trees on ridgeline */}
      {[
        { x: 150, h: 12 },
        { x: 170, h: 16 },
        { x: 340, h: 10 },
        { x: 500, h: 14 },
        { x: 520, h: 18 },
        { x: 540, h: 12 },
        { x: 650, h: 15 },
        { x: 670, h: 11 },
      ].map((tree, i) => {
        const baseY = i < 2 ? 108 - (i * 3) : i < 3 ? 95 : i < 6 ? 100 - ((i - 3) * 4) : 55 + ((i - 6) * 8);
        return (
          <motion.path
            key={i}
            d={`M${tree.x} ${baseY} L${tree.x - 4} ${baseY} L${tree.x} ${baseY - tree.h} L${tree.x + 4} ${baseY}Z`}
            fill="#2D5016"
            opacity="0.5"
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 0.5, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.05 }}
          />
        );
      })}

      {/* Trail — dashed */}
      <motion.path
        d="M370 140 Q375 120 365 105 Q355 90 360 80 Q365 70 358 60"
        stroke="#8A7A6D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="3 5"
        opacity="0.4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.6, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}
