"use client";

import { useState } from "react";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { cn } from "@/lib/utils";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export interface FAQClientProps {
  categories: FAQCategory[];
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function FAQClient({ categories }: FAQClientProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  function toggleItem(id: string) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="space-y-12">
      {categories.map((category, catIndex) => (
        <AnimateIn key={category.title} delay={catIndex * 0.05}>
          <div>
            <h2 className="font-camp text-charcoal mb-4">{category.title}</h2>
            <div className="divide-y divide-sand rounded-2xl bg-white shadow-sm overflow-hidden">
              {category.items.map((item) => {
                const isOpen = openItems.has(item.id);
                return (
                  <div key={item.id} className="px-6">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="flex w-full items-center justify-between py-4 text-left font-semibold text-charcoal hover:text-camp-red transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span>{item.question}</span>
                      <ChevronIcon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-transform duration-300",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-4 text-bark text-body leading-relaxed">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </AnimateIn>
      ))}
    </div>
  );
}
