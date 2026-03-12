"use client";

import { motion } from "framer-motion";

export function SunRays({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 200 120"
      fill="none"
      className={`w-full max-w-[180px] ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <defs>
        <linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.05" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="100%" r="50%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background glow */}
      <circle cx="100" cy="110" r="50" fill="url(#sunGlow)" />

      {/* Radiating rays — soft, filled wedges */}
      <motion.g
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
        style={{ transformOrigin: "100px 110px" }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
          const angle = -180 + i * (180 / 9);
          const rad = (angle * Math.PI) / 180;
          const innerR = 34;
          const outerR = 52;
          const spread = 0.06;
          const cx = 100;
          const cy = 110;
          return (
            <path
              key={i}
              d={`M${cx + innerR * Math.cos(rad - spread)} ${cy + innerR * Math.sin(rad - spread)}
                  L${cx + outerR * Math.cos(rad)} ${cy + outerR * Math.sin(rad)}
                  L${cx + innerR * Math.cos(rad + spread)} ${cy + innerR * Math.sin(rad + spread)}Z`}
              fill="#DB3832"
              opacity="0.12"
            />
          );
        })}
      </motion.g>

      {/* Sun half-disc — filled */}
      <motion.path
        d="M65 110 Q65 68 100 58 Q135 68 135 110Z"
        fill="url(#sunGrad)"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />

      {/* Sun arc outline */}
      <motion.path
        d="M65 110 Q65 68 100 58 Q135 68 135 110"
        stroke="#F59E0B"
        strokeWidth="2"
        opacity="0.35"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
      />

      {/* Horizon line */}
      <motion.path
        d="M35 110 L165 110"
        stroke="#D4CFC6"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}
