"use client";

import { type Variants, motion } from "framer-motion";

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1, delay: i * 0.2, ease: "easeInOut" as const },
      opacity: { duration: 0.3, delay: i * 0.2 },
    },
  }),
};

export function Campfire({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 200 140"
      fill="none"
      className={`w-full max-w-[200px] mx-auto ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Logs */}
      <motion.path d="M55 120 L145 105" stroke="#6B5B4E" strokeWidth="6" strokeLinecap="round" variants={draw} custom={0} />
      <motion.path d="M55 105 L145 120" stroke="#6B5B4E" strokeWidth="6" strokeLinecap="round" variants={draw} custom={0.3} />

      {/* Flame 1 — center, tallest */}
      <motion.path
        d="M100 100 Q90 75 95 55 Q100 35 100 25 Q100 35 105 55 Q110 75 100 100"
        stroke="#C41E3A"
        strokeWidth="2"
        fill="none"
        variants={draw}
        custom={1}
        style={{ transformOrigin: "100px 100px" }}
        animate={{
          scaleY: [1, 1.15, 0.95, 1.1, 1],
          opacity: [0.9, 1, 0.85, 1, 0.9],
        }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      />

      {/* Flame 2 — left */}
      <motion.path
        d="M90 100 Q82 80 85 65 Q88 50 90 42 Q92 50 95 65 Q98 80 90 100"
        stroke="#E8324F"
        strokeWidth="1.5"
        fill="none"
        variants={draw}
        custom={1.3}
        style={{ transformOrigin: "90px 100px" }}
        animate={{
          scaleY: [1, 1.15, 0.95, 1.1, 1],
          opacity: [0.9, 1, 0.85, 1, 0.9],
        }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.3, ease: "easeInOut" }}
      />

      {/* Flame 3 — right */}
      <motion.path
        d="M110 100 Q118 80 115 65 Q112 50 110 42 Q108 50 105 65 Q102 80 110 100"
        stroke="#E8324F"
        strokeWidth="1.5"
        fill="none"
        variants={draw}
        custom={1.6}
        style={{ transformOrigin: "110px 100px" }}
        animate={{
          scaleY: [1, 1.15, 0.95, 1.1, 1],
          opacity: [0.9, 1, 0.85, 1, 0.9],
        }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.6, ease: "easeInOut" }}
      />

      {/* Sparks */}
      <motion.circle cx="95" cy="30" r="1.5" fill="#C41E3A"
        animate={{ y: [0, -10, -20], opacity: [1, 0.6, 0] }}
        transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
      />
      <motion.circle cx="105" cy="25" r="1" fill="#E8324F"
        animate={{ y: [0, -12, -24], opacity: [1, 0.5, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, delay: 1 }}
      />
    </motion.svg>
  );
}
