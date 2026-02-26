"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "./Button";
import { AnimateIn } from "./AnimateIn";
import { cn } from "@/lib/utils";
import { useParallax } from "@/hooks/useParallax";

interface ProgramCardProps {
  badge: string;
  title: string;
  description: string;
  links: { label: string; href: string }[];
  image: string;
  imageAlt: string;
  reversed?: boolean;
}

export function ProgramCard({
  badge,
  title,
  description,
  links,
  image,
  imageAlt,
  reversed = false,
}: ProgramCardProps) {
  const { ref, y } = useParallax({ offset: 30 });

  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center",
        reversed && "lg:direction-rtl"
      )}
    >
      {/* Image */}
      <AnimateIn direction={reversed ? "right" : "left"}>
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg lg:direction-ltr"
        >
          <motion.div className="absolute -inset-8" style={{ y }}>
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </AnimateIn>

      {/* Content */}
      <AnimateIn direction={reversed ? "left" : "right"} className="lg:direction-ltr">
        <div className="space-y-5">
          <span className="badge-camp">{badge}</span>
          <h2 className="font-camp">{title}</h2>
          <p className="text-body-lg text-bark leading-relaxed">{description}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            {links.map((link, i) => (
              <Button
                key={link.href}
                variant={i === 0 ? "primary" : "secondary"}
                size="md"
                href={link.href}
              >
                {link.label}
              </Button>
            ))}
          </div>
        </div>
      </AnimateIn>
    </div>
  );
}
