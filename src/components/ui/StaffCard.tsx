"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { StaffMember } from "@/types";

interface StaffCardProps {
  staff: StaffMember;
  index?: number;
}

export function StaffCard({ staff, index = 0 }: StaffCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left focus-visible:outline-2 focus-visible:outline-camp-red focus-visible:outline-offset-4 rounded-2xl"
        aria-expanded={expanded}
      >
        {/* Photo */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-sand mb-4 shadow-sm">
          {staff.photoUrl ? (
            <Image
              src={staff.photoUrl}
              alt={staff.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-bark/30">
              <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
        </div>

        {/* Name & Title */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-bold text-charcoal group-hover:text-camp-red transition-colors text-base">
              {staff.name}
            </h4>
            <p className="text-caption text-bark mt-0.5 text-[0.7rem]">{staff.title}</p>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 mt-1 text-bark transition-transform duration-300",
              expanded && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Expandable bio */}
      <AnimatePresence>
        {expanded && staff.bio && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className="pt-4 pb-2 text-sm text-bark leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: staff.bio }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
