"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionProps {
  id?: string;
  bg?: "cream" | "white" | "sand" | "dark" | "forest";
  className?: string;
  children: React.ReactNode;
  animate?: boolean;
  padding?: "default" | "sm" | "none";
}

const bgColors = {
  cream: "bg-cream",
  white: "bg-white",
  sand: "bg-sand",
  dark: "section-dark",
  forest: "section-forest",
};

const paddings = {
  default: "section-padding",
  sm: "section-padding-sm",
  none: "",
};

export function Section({
  id,
  bg = "cream",
  className,
  children,
  animate = true,
  padding = "default",
}: SectionProps) {
  const Wrapper = animate ? motion.section : "section";
  const animationProps = animate
    ? {
        initial: { opacity: 0 } as const,
        whileInView: { opacity: 1 } as const,
        viewport: { once: true, margin: "-100px" } as const,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const,
      }
    : {};

  return (
    <Wrapper
      id={id}
      className={cn(bgColors[bg], paddings[padding], className)}
      {...animationProps}
    >
      {children}
    </Wrapper>
  );
}
