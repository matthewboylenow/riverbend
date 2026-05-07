"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavGroup, NavLink } from "@/lib/navigation";

interface MegaMenuProps {
  group: NavGroup;
  onClose: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, y: -4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      staggerChildren: 0.025,
      delayChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

function MegaMenuLink({
  link,
  onClose,
}: {
  link: NavLink;
  onClose: () => void;
}) {
  const content = (
    <div className="group/link flex items-start gap-3 px-3 py-2.5 -mx-3 rounded-xl hover:bg-gradient-to-r hover:from-sand/80 hover:to-transparent transition-all duration-200 cursor-pointer">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-charcoal group-hover/link:text-camp-red transition-colors duration-200">
            {link.label}
          </span>
          {link.external && (
            <ExternalLink className="h-3 w-3 text-bark/30 group-hover/link:text-camp-red/50 transition-colors shrink-0" />
          )}
        </div>
        {link.description && (
          <p className="text-xs text-bark/50 mt-0.5 leading-relaxed">
            {link.description}
          </p>
        )}
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-stone/50 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all duration-200 mt-1 shrink-0" />
    </div>
  );

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} onClick={onClose}>
      {content}
    </Link>
  );
}

function FeaturedCard({
  featured,
  onClose,
}: {
  featured: NonNullable<NavGroup["featured"]>;
  onClose: () => void;
}) {
  const inner = (
    <div className="h-full rounded-2xl bg-gradient-to-br from-camp-red via-camp-red to-camp-red-dark p-6 text-white flex flex-col justify-between min-h-[200px] transition-all duration-300 group-hover:shadow-xl group-hover:shadow-camp-red/20 group-hover:scale-[1.02] relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-3.5 w-3.5 text-white/60" />
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/60">
            Featured
          </span>
        </div>
        <h4 className="text-lg font-bold text-white mb-2 leading-tight">
          {featured.title}
        </h4>
        <p className="text-sm text-white/70 leading-relaxed">
          {featured.description}
        </p>
      </div>
      <div className="relative flex items-center gap-2 mt-4 text-sm font-semibold">
        <span>{featured.cta}</span>
        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </div>
  );

  if (featured.external) {
    return (
      <a
        href={featured.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full"
        onClick={onClose}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={featured.href} className="group block h-full" onClick={onClose}>
      {inner}
    </Link>
  );
}

export function MegaMenu({ group, onClose }: MegaMenuProps) {
  // Up to 2 featured cards. Stack them vertically in the same column,
  // so the existing grid layout (columns + featured column) keeps working.
  const featuredCards = [
    ...(group.featured ? [group.featured] : []),
    ...(group.featuredExtras ?? []),
  ].slice(0, 2);
  const hasFeatured = featuredCards.length > 0;
  const colCount = group.columns.length;

  const gridClass = hasFeatured
    ? cn(
        colCount === 1 && "lg:grid-cols-[1fr_260px] max-w-3xl",
        colCount === 2 && "lg:grid-cols-[1fr_1fr_260px] max-w-5xl",
        colCount >= 3 && "lg:grid-cols-[1fr_1fr_1fr_280px]"
      )
    : cn(
        colCount === 1 && "lg:grid-cols-1 max-w-md",
        colCount === 2 && "lg:grid-cols-2 max-w-3xl",
        colCount >= 3 && "lg:grid-cols-3 max-w-5xl"
      );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute left-0 right-0 z-40 overflow-hidden"
    >
      {/* Top accent line */}
      <div className="h-[3px] bg-gradient-to-r from-camp-red via-camp-red-light to-camp-red" />

      {/* Panel */}
      <div className="bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] border-b border-sand/50">
        <div className="container-default py-8 lg:py-10">
          {/* Tagline */}
          {group.tagline && (
            <motion.p
              variants={itemVariants}
              className="text-caption text-camp-red tracking-[0.15em] mb-6"
            >
              {group.tagline}
            </motion.p>
          )}

          <div className={cn("grid gap-8 lg:gap-10", gridClass)}>
            {/* Link columns */}
            {group.columns.map((column, colIdx) => (
              <motion.div key={colIdx} variants={itemVariants}>
                {column.heading && (
                  <h3 className="text-[0.7rem] font-bold text-charcoal/30 uppercase tracking-[0.14em] mb-3 pb-2.5 border-b border-sand/80">
                    {column.heading}
                  </h3>
                )}
                <div className="space-y-0.5">
                  {column.links.map((link, linkIdx) => (
                    <motion.div key={`${colIdx}-${linkIdx}`} variants={itemVariants}>
                      <MegaMenuLink link={link} onClose={onClose} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Featured cards (up to 2, stacked) */}
            {hasFeatured && (
              <motion.div
                variants={itemVariants}
                className="hidden lg:flex lg:flex-col gap-3"
              >
                {featuredCards.map((card, i) => (
                  <FeaturedCard key={i} featured={card} onClose={onClose} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
