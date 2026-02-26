"use client";

import { useRef } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";

interface UseParallaxOptions {
  /** Max pixel offset (positive = moves down slower than scroll) */
  offset?: number;
}

export function useParallax({ offset = 50 }: UseParallaxOptions = {}): {
  ref: React.RefObject<HTMLElement | null>;
  y: MotionValue<number>;
} {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return { ref, y };
}
