import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Pages",
};

interface PageEntry {
  slug: string;
  label: string;
  status: "ready" | "soon";
  description: string;
}

// Pages enabled for editing. Others come online as we wire them in Phase 2.
const PAGES: PageEntry[] = [
  {
    slug: "home",
    label: "Homepage",
    status: "ready",
    description: "Hero, announcement, bento grid (11 cards + countdown + stat), philosophy, programs",
  },
  {
    slug: "rates-dates-application-2026",
    label: "Rates, Dates & Application",
    status: "ready",
    description: "Tuition table, discounts, payment schedule, intro/outro copy",
  },
  {
    slug: "rates-dates-application-next",
    label: "Rates, Dates & Application — 2027",
    status: "ready",
    description: "Next season's rates page — sections stay off the public page until filled in",
  },
  {
    slug: "about-riverbend",
    label: "About Riverbend",
    status: "ready",
    description: "Hero, legacy, philosophy, facilities, staff, learn-more cards",
  },
  { slug: "programs", label: "Programs", status: "ready", description: "Hero, intro, three program cards, learn-more cards" },
  { slug: "clubhouse", label: "The Clubhouse", status: "ready", description: "Hero + section copy + photos + video" },
  { slug: "riverbend-experience", label: "Riverbend Experience", status: "ready", description: "Hero + sections + sample schedules" },
  { slug: "day-trippers", label: "Day Trippers", status: "ready", description: "Hero + program + supervision + 2026 calendar" },
  { slug: "activities", label: "Activities", status: "ready", description: "Hero + 7 sections + ninja chips + activity cards + videos" },
  { slug: "sports", label: "Sports", status: "ready", description: "Hero + sport cards + video" },
  { slug: "videos", label: "Videos", status: "ready", description: "Hero + video list (vimeoId + title)" },
  { slug: "testimonials", label: "Testimonials", status: "ready", description: "Hero + camper quotes + parent quotes + CTA" },
  { slug: "faq", label: "FAQ", status: "ready", description: "Hero + 6 categories of Q&A + CTA" },
  { slug: "calendar", label: "Calendar", status: "ready", description: "Hero, key dates, carnival video" },
  { slug: "lunch", label: "Lunch", status: "ready", description: "Hero + 3 sections + video" },
  { slug: "transportation", label: "Transportation", status: "ready", description: "Hero + section copy" },
  { slug: "health-safety", label: "Health & Safety", status: "ready", description: "Hero + safety copy + nurse + commitments + CTA" },
  { slug: "staff", label: "Staff Info", status: "ready", description: "Hero + roles + dates + CTA (bios live in /admin/staff)" },
  { slug: "camp-riverbend-app", label: "Camp Riverbend App", status: "ready", description: "Hero + overview + download + features" },
  { slug: "breene-family", label: "Directors & Senior Staff", status: "ready", description: "Hero + section headings (bios live in /admin/staff)" },
];

export default function AdminPagesIndex() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Pages</h1>
        <p className="text-sm text-bark mt-1">
          Edit body copy, tables, and PDFs without touching code. The homepage is intentionally not editable.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone/30 overflow-hidden">
        {PAGES.map((p) => {
          const inner = (
            <>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-charcoal">{p.label}</span>
                  {p.status === "ready" ? (
                    <span className="inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full bg-green-100 text-green-800">
                      Ready
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full bg-stone/30 text-bark">
                      Coming soon
                    </span>
                  )}
                </div>
                <p className="text-xs text-bark mt-0.5">
                  <code className="text-bark/60">/{p.slug}</code> · {p.description}
                </p>
              </div>
              {p.status === "ready" && <ChevronRight className="h-4 w-4 text-bark" />}
            </>
          );

          if (p.status === "ready") {
            return (
              <Link
                key={p.slug}
                href={`/admin/pages/${p.slug}`}
                className="flex items-center justify-between gap-4 px-5 py-4 border-b border-stone/10 last:border-b-0 transition-colors hover:bg-cream/50"
              >
                {inner}
              </Link>
            );
          }
          return (
            <div
              key={p.slug}
              className="flex items-center justify-between gap-4 px-5 py-4 border-b border-stone/10 last:border-b-0 opacity-50"
            >
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
