"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnnouncementBarProps {
  message: string;
  href: string;
  linkText?: string;
}

export function AnnouncementBar({
  message,
  href,
  linkText = "Learn More",
}: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="bg-camp-red text-white overflow-hidden relative z-50"
        >
          <div className="container-default flex items-center justify-center gap-3 py-2.5 text-sm">
            <p className="font-medium">
              {message}{" "}
              <Link
                href={href}
                className="underline underline-offset-2 hover:text-sky-light font-semibold transition-colors"
              >
                {linkText} →
              </Link>
            </p>
            <button
              onClick={() => setDismissed(true)}
              className="absolute right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
