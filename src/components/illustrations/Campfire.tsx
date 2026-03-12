"use client";

import { motion } from "framer-motion";

export function Campfire({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 200 140"
      fill="none"
      className={`w-full max-w-[180px] mx-auto ${className}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Ground shadow */}
      <ellipse cx="100" cy="128" rx="38" ry="5" fill="#D4CFC6" opacity="0.4" />

      {/* Logs */}
      <rect x="60" y="112" width="80" height="8" rx="4" fill="#6B5B4E" transform="rotate(-5 100 116)" />
      <rect x="60" y="112" width="80" height="8" rx="4" fill="#8A7A6D" transform="rotate(5 100 116)" />
      {/* Log grain */}
      <line x1="70" y1="115" x2="75" y2="115" stroke="#5A4A3D" strokeWidth="0.8" strokeLinecap="round" transform="rotate(-5 100 116)" />
      <line x1="90" y1="114" x2="97" y2="114" stroke="#5A4A3D" strokeWidth="0.8" strokeLinecap="round" transform="rotate(-5 100 116)" />

      {/* Inner glow */}
      <motion.ellipse
        cx="100"
        cy="105"
        rx="18"
        ry="8"
        fill="#DB3832"
        opacity="0.15"
        animate={{ rx: [18, 22, 18], opacity: [0.15, 0.25, 0.15] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      />

      {/* Flame: outer glow */}
      <motion.path
        d="M100 108 Q85 85 90 65 Q95 45 100 30 Q105 45 110 65 Q115 85 100 108Z"
        fill="#DB3832"
        opacity="0.12"
        animate={{ d: [
          "M100 108 Q85 85 90 65 Q95 45 100 30 Q105 45 110 65 Q115 85 100 108Z",
          "M100 108 Q83 82 88 60 Q94 40 100 26 Q106 40 112 60 Q117 82 100 108Z",
          "M100 108 Q85 85 90 65 Q95 45 100 30 Q105 45 110 65 Q115 85 100 108Z",
        ] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      />

      {/* Flame: main center */}
      <motion.path
        d="M100 108 Q88 88 92 68 Q96 50 100 38 Q104 50 108 68 Q112 88 100 108Z"
        fill="#E8324F"
        opacity="0.7"
        animate={{
          d: [
            "M100 108 Q88 88 92 68 Q96 50 100 38 Q104 50 108 68 Q112 88 100 108Z",
            "M100 108 Q86 85 90 63 Q95 45 100 34 Q105 45 110 63 Q114 85 100 108Z",
            "M100 108 Q88 88 92 68 Q96 50 100 38 Q104 50 108 68 Q112 88 100 108Z",
          ],
        }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      />

      {/* Flame: bright core */}
      <motion.path
        d="M100 106 Q93 92 95 78 Q97 65 100 55 Q103 65 105 78 Q107 92 100 106Z"
        fill="#F59E0B"
        opacity="0.6"
        animate={{
          d: [
            "M100 106 Q93 92 95 78 Q97 65 100 55 Q103 65 105 78 Q107 92 100 106Z",
            "M100 106 Q92 90 94 75 Q97 60 100 50 Q103 60 106 75 Q108 90 100 106Z",
            "M100 106 Q93 92 95 78 Q97 65 100 55 Q103 65 105 78 Q107 92 100 106Z",
          ],
        }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
      />

      {/* Left flame tongue */}
      <motion.path
        d="M95 108 Q86 92 88 78 Q90 65 92 58 Q94 65 96 78 Q98 92 95 108Z"
        fill="#E8324F"
        opacity="0.5"
        animate={{
          d: [
            "M95 108 Q86 92 88 78 Q90 65 92 58 Q94 65 96 78 Q98 92 95 108Z",
            "M94 108 Q84 90 87 74 Q89 60 91 52 Q93 60 95 74 Q97 90 94 108Z",
            "M95 108 Q86 92 88 78 Q90 65 92 58 Q94 65 96 78 Q98 92 95 108Z",
          ],
        }}
        transition={{ repeat: Infinity, duration: 1.6, delay: 0.3, ease: "easeInOut" }}
      />

      {/* Right flame tongue */}
      <motion.path
        d="M105 108 Q114 92 112 78 Q110 65 108 58 Q106 65 104 78 Q102 92 105 108Z"
        fill="#E8324F"
        opacity="0.5"
        animate={{
          d: [
            "M105 108 Q114 92 112 78 Q110 65 108 58 Q106 65 104 78 Q102 92 105 108Z",
            "M106 108 Q116 90 113 74 Q111 60 109 52 Q107 60 105 74 Q103 90 106 108Z",
            "M105 108 Q114 92 112 78 Q110 65 108 58 Q106 65 104 78 Q102 92 105 108Z",
          ],
        }}
        transition={{ repeat: Infinity, duration: 1.6, delay: 0.6, ease: "easeInOut" }}
      />

      {/* Sparks */}
      {[
        { cx: 93, startY: 40, delay: 0, dur: 2.5 },
        { cx: 107, startY: 35, delay: 0.8, dur: 3 },
        { cx: 99, startY: 32, delay: 1.5, dur: 2.8 },
      ].map((spark, i) => (
        <motion.circle
          key={i}
          cx={spark.cx}
          cy={spark.startY}
          r="1.5"
          fill="#F59E0B"
          animate={{
            y: [0, -15, -30],
            x: [0, (i % 2 === 0 ? 4 : -4), (i % 2 === 0 ? 8 : -8)],
            opacity: [0.8, 0.4, 0],
          }}
          transition={{ repeat: Infinity, duration: spark.dur, delay: spark.delay, ease: "easeOut" }}
        />
      ))}
    </motion.svg>
  );
}
