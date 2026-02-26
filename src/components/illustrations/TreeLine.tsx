"use client";

import { type Variants, motion } from "framer-motion";

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.5, delay: i * 0.15, ease: "easeInOut" as const },
      opacity: { duration: 0.3, delay: i * 0.15 },
    },
  }),
};

export function TreeLine({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 800 120"
      fill="none"
      className={`w-full max-w-3xl mx-auto ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Tree 1 — small */}
      <motion.path d="M160 110 L160 85" stroke="#7A8F6D" strokeWidth="3" strokeLinecap="round" variants={draw} custom={0} />
      <motion.path d="M160 90 L145 105 L160 65 L175 105 Z" stroke="#2D5016" strokeWidth="2" fill="none" variants={draw} custom={0.5} />

      {/* Tree 2 — tall */}
      <motion.path d="M280 110 L280 55" stroke="#7A8F6D" strokeWidth="3" strokeLinecap="round" variants={draw} custom={1} />
      <motion.path d="M280 65 L258 100 L280 35 L302 100 Z" stroke="#2D5016" strokeWidth="2" fill="none" variants={draw} custom={1.5} />
      <motion.path d="M280 80 L264 100 L280 50 L296 100 Z" stroke="#3D6B1E" strokeWidth="1.5" fill="none" variants={draw} custom={1.8} />

      {/* Tree 3 — medium */}
      <motion.path d="M400 110 L400 70" stroke="#7A8F6D" strokeWidth="3" strokeLinecap="round" variants={draw} custom={2} />
      <motion.path d="M400 78 L382 108 L400 48 L418 108 Z" stroke="#2D5016" strokeWidth="2" fill="none" variants={draw} custom={2.5} />

      {/* Tree 4 — tallest */}
      <motion.path d="M520 110 L520 40" stroke="#7A8F6D" strokeWidth="3" strokeLinecap="round" variants={draw} custom={3} />
      <motion.path d="M520 52 L495 100 L520 20 L545 100 Z" stroke="#2D5016" strokeWidth="2" fill="none" variants={draw} custom={3.5} />
      <motion.path d="M520 70 L503 100 L520 40 L537 100 Z" stroke="#3D6B1E" strokeWidth="1.5" fill="none" variants={draw} custom={3.8} />

      {/* Tree 5 — small */}
      <motion.path d="M640 110 L640 80" stroke="#7A8F6D" strokeWidth="3" strokeLinecap="round" variants={draw} custom={4} />
      <motion.path d="M640 87 L625 108 L640 60 L655 108 Z" stroke="#2D5016" strokeWidth="2" fill="none" variants={draw} custom={4.5} />

      {/* Ground line */}
      <motion.path d="M100 110 Q250 108 400 110 Q550 112 700 110" stroke="#7A8F6D" strokeWidth="1.5" strokeLinecap="round" variants={draw} custom={5} />
    </motion.svg>
  );
}
