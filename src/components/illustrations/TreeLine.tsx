"use client";

import { motion } from "framer-motion";

export function TreeLine({ className = "" }: { className?: string }) {
  const trees = [
    { x: 130, trunkH: 20, crownW: 14, crownH: 28, delay: 0 },
    { x: 200, trunkH: 30, crownW: 18, crownH: 40, delay: 0.08 },
    { x: 280, trunkH: 24, crownW: 15, crownH: 32, delay: 0.16 },
    { x: 370, trunkH: 35, crownW: 20, crownH: 48, delay: 0.24 },
    { x: 430, trunkH: 18, crownW: 12, crownH: 25, delay: 0.32 },
    { x: 520, trunkH: 32, crownW: 18, crownH: 44, delay: 0.40 },
    { x: 600, trunkH: 22, crownW: 14, crownH: 30, delay: 0.48 },
    { x: 670, trunkH: 26, crownW: 16, crownH: 35, delay: 0.56 },
  ];

  const groundY = 108;

  return (
    <motion.svg
      viewBox="0 0 800 120"
      fill="none"
      preserveAspectRatio="xMidYMax meet"
      className={`w-full max-w-3xl mx-auto ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
    >
      <defs>
        <linearGradient id="trunkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A8F6D" />
          <stop offset="100%" stopColor="#6B5B4E" />
        </linearGradient>
      </defs>

      {/* Ground */}
      <motion.path
        d="M60 108 Q200 106 400 108 Q600 110 740 108"
        stroke="#9AAD8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      {/* Trees */}
      {trees.map((tree, i) => {
        const trunkTop = groundY - tree.trunkH;
        const crownTop = trunkTop - tree.crownH + 8;
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: tree.delay, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Shadow */}
            <ellipse
              cx={tree.x}
              cy={groundY + 2}
              rx={tree.crownW * 0.6}
              ry={2.5}
              fill="#2D5016"
              opacity="0.1"
            />

            {/* Trunk */}
            <rect
              x={tree.x - 2}
              y={trunkTop}
              width={4}
              height={tree.trunkH}
              rx={2}
              fill="url(#trunkGrad)"
              opacity="0.7"
            />

            {/* Crown — layered triangles */}
            <path
              d={`M${tree.x} ${crownTop} L${tree.x - tree.crownW} ${trunkTop + 4} L${tree.x + tree.crownW} ${trunkTop + 4}Z`}
              fill="#2D5016"
              opacity="0.55"
            />
            <path
              d={`M${tree.x} ${crownTop + tree.crownH * 0.2} L${tree.x - tree.crownW * 0.85} ${trunkTop + 4} L${tree.x + tree.crownW * 0.85} ${trunkTop + 4}Z`}
              fill="#3D6B1E"
              opacity="0.45"
            />
          </motion.g>
        );
      })}

      {/* Ground grass tufts */}
      {[180, 310, 480, 640].map((x, i) => (
        <motion.path
          key={i}
          d={`M${x - 4} 108 Q${x} 102 ${x + 4} 108`}
          stroke="#7A8F6D"
          strokeWidth="1"
          opacity="0.3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.3 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 + i * 0.1 }}
        />
      ))}
    </motion.svg>
  );
}
