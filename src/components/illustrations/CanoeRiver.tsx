"use client";

import { type Variants, motion } from "framer-motion";

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.2, delay: i * 0.2, ease: "easeInOut" as const },
      opacity: { duration: 0.3, delay: i * 0.2 },
    },
  }),
};

export function CanoeRiver({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 1200 100"
      fill="none"
      className={`w-full ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* River waves — continuous */}
      <motion.path
        d="M0 60 Q50 45 100 60 Q150 75 200 60 Q250 45 300 60 Q350 75 400 60 Q450 45 500 60 Q550 75 600 60 Q650 45 700 60 Q750 75 800 60 Q850 45 900 60 Q950 75 1000 60 Q1050 45 1100 60 Q1150 75 1200 60"
        stroke="#3B7EA1"
        strokeWidth="2"
        strokeLinecap="round"
        variants={draw}
        custom={0}
      />
      <motion.path
        d="M0 72 Q50 58 100 72 Q150 86 200 72 Q250 58 300 72 Q350 86 400 72 Q450 58 500 72 Q550 86 600 72 Q650 58 700 72 Q750 86 800 72 Q850 58 900 72 Q950 86 1000 72 Q1050 58 1100 72 Q1150 86 1200 72"
        stroke="#5098B8"
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={draw}
        custom={0.5}
      />

      {/* Canoe hull */}
      <motion.path
        d="M540 48 Q560 38 600 36 Q640 38 660 48 Q640 52 600 54 Q560 52 540 48 Z"
        stroke="#6B5B4E"
        strokeWidth="2"
        fill="none"
        variants={draw}
        custom={1}
      />
      {/* Paddle left */}
      <motion.path d="M570 35 L562 20 L558 22 L566 37" stroke="#6B5B4E" strokeWidth="1.5" strokeLinecap="round" variants={draw} custom={1.5} />
      {/* Paddle right */}
      <motion.path d="M630 35 L638 20 L642 22 L634 37" stroke="#6B5B4E" strokeWidth="1.5" strokeLinecap="round" variants={draw} custom={1.8} />

      {/* Subtle wave animation behind canoe */}
      <motion.path
        d="M560 55 Q580 58 600 55 Q620 52 640 55"
        stroke="#5098B8"
        strokeWidth="1"
        strokeLinecap="round"
        animate={{ d: ["M560 55 Q580 58 600 55 Q620 52 640 55", "M560 55 Q580 52 600 55 Q620 58 640 55", "M560 55 Q580 58 600 55 Q620 52 640 55"] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}
