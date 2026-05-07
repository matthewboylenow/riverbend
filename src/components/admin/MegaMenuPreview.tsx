"use client";

/**
 * Static, in-place preview of the public mega-menu panel for one nav
 * group. Mirrors the live MegaMenu look without the absolute-positioned
 * overlay or framer-motion entrance, so it can drop into the admin
 * editor and reflect unsaved edits live.
 */
import { ExternalLink, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewLink {
  label: string;
  href: string;
  external?: boolean;
  description?: string;
}
interface PreviewColumn {
  heading?: string;
  links: PreviewLink[];
}
interface PreviewFeatured {
  title: string;
  description: string;
  href: string;
  cta: string;
  external?: boolean;
}
export interface MegaMenuPreviewGroup {
  label: string;
  tagline?: string;
  columns: PreviewColumn[];
  featured: PreviewFeatured[];
}

export function MegaMenuPreview({ group }: { group: MegaMenuPreviewGroup }) {
  const featuredCards = group.featured.slice(0, 2);
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
    <div className="relative overflow-hidden rounded-2xl border border-stone/30">
      {/* Top accent line */}
      <div className="h-[3px] bg-gradient-to-r from-camp-red via-camp-red-light to-camp-red" />

      {/* Panel */}
      <div className="bg-white">
        <div className="px-6 py-8 lg:px-10 lg:py-10">
          {group.tagline && (
            <p className="text-caption text-camp-red tracking-[0.15em] mb-6 text-[0.65rem] font-semibold uppercase">
              {group.tagline}
            </p>
          )}

          <div className={cn("grid gap-8 lg:gap-10", gridClass)}>
            {/* Link columns */}
            {group.columns.map((column, colIdx) => (
              <div key={colIdx}>
                {column.heading && (
                  <h3 className="text-[0.7rem] font-bold text-charcoal/30 uppercase tracking-[0.14em] mb-3 pb-2.5 border-b border-sand/80">
                    {column.heading}
                  </h3>
                )}
                <div className="space-y-0.5">
                  {column.links.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-bark/40 italic">
                      (no links yet)
                    </p>
                  ) : (
                    column.links.map((link, linkIdx) => (
                      <PreviewLinkRow key={linkIdx} link={link} />
                    ))
                  )}
                </div>
              </div>
            ))}

            {/* Featured cards (up to 2, stacked) */}
            {hasFeatured && (
              <div className="hidden lg:flex lg:flex-col gap-3">
                {featuredCards.map((card, i) => (
                  <PreviewFeaturedCard key={i} featured={card} />
                ))}
              </div>
            )}
          </div>

          {hasFeatured && (
            <div className="lg:hidden mt-6 space-y-3">
              {featuredCards.map((card, i) => (
                <PreviewFeaturedCard key={i} featured={card} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewLinkRow({ link }: { link: PreviewLink }) {
  return (
    <div className="group/link flex items-start gap-3 px-3 py-2.5 -mx-3 rounded-xl hover:bg-gradient-to-r hover:from-sand/80 hover:to-transparent transition-all duration-200">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-charcoal group-hover/link:text-camp-red transition-colors duration-200">
            {link.label || <em className="text-bark/40">(empty label)</em>}
          </span>
          {link.external && (
            <ExternalLink className="h-3 w-3 text-bark/30 group-hover/link:text-camp-red/50 transition-colors shrink-0" />
          )}
        </div>
        {link.description && (
          <p className="text-xs text-bark/50 mt-0.5 leading-relaxed">{link.description}</p>
        )}
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-stone/50 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all duration-200 mt-1 shrink-0" />
    </div>
  );
}

function PreviewFeaturedCard({ featured }: { featured: PreviewFeatured }) {
  return (
    <div className="h-full rounded-2xl bg-gradient-to-br from-camp-red via-camp-red to-camp-red-dark p-6 text-white flex flex-col justify-between min-h-[160px] relative overflow-hidden">
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
          {featured.title || <em className="opacity-60">(no title)</em>}
        </h4>
        <p className="text-sm text-white/70 leading-relaxed">
          {featured.description || <em className="opacity-60">(no description)</em>}
        </p>
      </div>
      <div className="relative flex items-center gap-2 mt-4 text-sm font-semibold">
        <span>{featured.cta || "Learn more"}</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}
