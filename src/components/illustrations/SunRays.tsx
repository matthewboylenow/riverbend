"use client";

import { type Variants, motion } from "framer-motion";

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1, delay: i * 0.12, ease: "easeInOut" as const },
      opacity: { duration: 0.3, delay: i * 0.12 },
    },
  }),
};

export function SunRays({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 200 120"
      fill="none"
      className={`w-full max-w-[200px] ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Half sun arc */}
      <motion.path
        d="M60 110 Q60 60 100 50 Q140 60 140 110"
        stroke="#87CEEB"
        strokeWidth="2.5"
        fill="none"
        variants={draw}
        custom={0}
      />

      {/* Radiating rays */}
      <motion.g
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        style={{ transformOrigin: "100px 110px" }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = -180 + i * (180 / 7);
          const rad = (angle * Math.PI) / 180;
          const innerR = 40;
          const outerR = 55;
          const cx = 100;
          const cy = 110;
          return (
            <motion.line
              key={i}
              x1={cx + innerR * Math.cos(rad)}
              y1={cy + innerR * Math.sin(rad)}
              x2={cx + outerR * Math.cos(rad)}
              y2={cy + outerR * Math.sin(rad)}
              stroke="#C41E3A"
              strokeWidth="1.5"
              strokeLinecap="round"
              variants={draw}
              custom={i * 0.15 + 0.5}
            />
          );
        })}
      </motion.g>

      {/* Horizon line */}
      <motion.path d="M30 110 L170 110" stroke="#87CEEB" strokeWidth="1.5" strokeLinecap="round" variants={draw} custom={2} />
    </motion.svg>
  );
}
