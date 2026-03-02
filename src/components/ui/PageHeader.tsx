"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { useParallax } from "@/hooks/useParallax";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  bgImage?: string;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  bgImage,
  className,
}: PageHeaderProps) {
  const { ref, y } = useParallax({ offset: 40 });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        "relative overflow-hidden bg-charcoal py-20 md:py-28 lg:py-32",
        className
      )}
    >
      {/* Background image */}
      {bgImage && (
        <motion.div
          className="absolute -inset-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})`, y, backgroundPosition: "center center" }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />
        </motion.div>
      )}

      {/* Content */}
      <Container className="relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-4"
          >
            <ol className="flex items-center gap-2 text-sm text-white/70">
              {breadcrumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-white/40">›</span>}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="hover:text-white transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-white">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p className="text-caption text-white/70 mb-3 tracking-wider">
            {subtitle}
          </p>
        )}

        {/* Title */}
        <h1 className="text-white text-balance max-w-4xl">{title}</h1>
      </Container>
    </div>
  );
}
