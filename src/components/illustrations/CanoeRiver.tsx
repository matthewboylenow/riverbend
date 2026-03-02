"use client";

import { motion } from "framer-motion";

export function CanoeRiver({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 1200 100"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={`w-full ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <defs>
        <linearGradient id="riverGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B7EA1" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3B7EA1" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* River body — subtle filled band */}
      <rect x="0" y="45" width="1200" height="30" fill="url(#riverGrad)" rx="15" />

      {/* River wave line 1 */}
      <motion.path
        d="M0 55 Q50 45 100 55 Q150 65 200 55 Q250 45 300 55 Q350 65 400 55 Q450 45 500 55 Q550 65 600 55 Q650 45 700 55 Q750 65 800 55 Q850 45 900 55 Q950 65 1000 55 Q1050 45 1100 55 Q1150 65 1200 55"
        stroke="#3B7EA1"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* River wave line 2 */}
      <motion.path
        d="M0 65 Q50 56 100 65 Q150 74 200 65 Q250 56 300 65 Q350 74 400 65 Q450 56 500 65 Q550 74 600 65 Q650 56 700 65 Q750 74 800 65 Q850 56 900 65 Q950 74 1000 65 Q1050 56 1100 65 Q1150 74 1200 65"
        stroke="#5098B8"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.25"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
      />

      {/* Canoe — filled hull */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Hull shadow */}
        <ellipse cx="600" cy="58" rx="32" ry="4" fill="#3B7EA1" opacity="0.15" />

        {/* Hull */}
        <path
          d="M565 50 Q575 42 600 40 Q625 42 635 50 Q625 54 600 55 Q575 54 565 50Z"
          fill="#6B5B4E"
          opacity="0.7"
        />
        {/* Hull keel line */}
        <path
          d="M572 48 Q600 44 628 48"
          stroke="#5A4A3D"
          strokeWidth="0.8"
          opacity="0.5"
        />

        {/* Left paddle */}
        <motion.g
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{ transformOrigin: "582px 40px" }}
        >
          <line x1="582" y1="40" x2="575" y2="24" stroke="#8A7A6D" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M573 26 L577 18 L579 26Z" fill="#8A7A6D" opacity="0.6" />
        </motion.g>

        {/* Right paddle */}
        <motion.g
          animate={{ rotate: [5, -5, 5] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: "easeInOut" }}
          style={{ transformOrigin: "618px 40px" }}
        >
          <line x1="618" y1="40" x2="625" y2="24" stroke="#8A7A6D" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M623 26 L621 18 L627 26Z" fill="#8A7A6D" opacity="0.6" />
        </motion.g>
      </motion.g>

      {/* Wake ripples behind canoe */}
      <motion.path
        d="M555 53 Q545 56 535 53 Q525 50 515 53"
        stroke="#5098B8"
        strokeWidth="0.8"
        opacity="0.3"
        animate={{
          x: [-2, -6, -2],
          opacity: [0.3, 0.15, 0.3],
        }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}
