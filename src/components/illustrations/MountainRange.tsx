"use client";

import { type Variants, motion } from "framer-motion";

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.5, delay: i * 0.2, ease: "easeInOut" as const },
      opacity: { duration: 0.3, delay: i * 0.2 },
    },
  }),
};

export function MountainRange({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 800 150"
      fill="none"
      className={`w-full max-w-3xl mx-auto ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Back range — lighter */}
      <motion.path
        d="M0 130 L100 70 L180 100 L280 40 L380 90 L450 55 L530 85 L620 30 L720 80 L800 130"
        stroke="#D4CFC6"
        strokeWidth="2"
        fill="none"
        variants={draw}
        custom={0}
      />

      {/* Front range — darker */}
      <motion.path
        d="M0 140 L120 85 L200 110 L320 55 L420 100 L500 70 L600 95 L700 50 L800 140"
        stroke="#2D5016"
        strokeWidth="2.5"
        fill="none"
        variants={draw}
        custom={1}
      />

      {/* Winding trail */}
      <motion.path
        d="M350 140 Q360 120 370 115 Q390 105 380 90 Q370 75 360 70 Q340 60 345 55"
        stroke="#6B5B4E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="4 4"
        variants={draw}
        custom={2}
      />

      {/* Small trees on front range */}
      <motion.path d="M150 105 L150 95 L146 105 L150 88 L154 105" stroke="#3D6B1E" strokeWidth="1.5" strokeLinecap="round" variants={draw} custom={2.5} />
      <motion.path d="M550 90 L550 80 L546 90 L550 73 L554 90" stroke="#3D6B1E" strokeWidth="1.5" strokeLinecap="round" variants={draw} custom={2.8} />
    </motion.svg>
  );
}
