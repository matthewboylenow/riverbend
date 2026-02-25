"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, ExternalLink, ShoppingBag } from "lucide-react";
import { NAV_GROUPS, EXTERNAL_LINKS } from "@/lib/navigation";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-sand">
              <span className="font-camp text-xl font-bold text-camp-red">
                Camp Riverbend
              </span>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-sand transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick actions */}
            <div className="p-5 space-y-3">
              <a
                href="tel:9085802267"
                className="flex items-center gap-3 px-4 py-3 bg-sand rounded-2xl text-sm font-semibold text-charcoal"
              >
                <Phone className="h-4 w-4 text-camp-red" />
                908-580-CAMP (2267)
              </a>
              <Link
                href="/shop"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 bg-camp-red text-white rounded-2xl text-sm font-semibold"
              >
                <ShoppingBag className="h-4 w-4" />
                Riverbend Store
              </Link>
            </div>

            {/* Nav groups */}
            <div className="px-5 pb-8">
              {NAV_GROUPS.map((group) => (
                <div key={group.label} className="border-t border-sand">
                  <h3 className="text-caption text-bark pt-5 pb-2 px-2">
                    {group.label}
                  </h3>
                  <div className="space-y-0.5 pb-3">
                    {group.columns.flatMap((col) => col.links).map((link, idx) => (
                      <div key={`${group.label}-${idx}`}>
                        {link.external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal hover:bg-sand transition-colors"
                            onClick={onClose}
                          >
                            {link.label}
                            <ExternalLink className="h-3.5 w-3.5 text-bark" />
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="block px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal hover:bg-sand hover:text-camp-red transition-colors"
                            onClick={onClose}
                          >
                            {link.label}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* External login link */}
              <div className="border-t border-sand pt-5">
                <a
                  href={EXTERNAL_LINKS.familyLogin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold text-camp-red hover:bg-sand transition-colors"
                  onClick={onClose}
                >
                  Family Login
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
