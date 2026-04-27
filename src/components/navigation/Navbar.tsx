"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { NAV_GROUPS, EXTERNAL_LINKS } from "@/lib/navigation";
import { MobileNav } from "./MobileNav";
import { MegaMenu } from "./MegaMenu";
import { Menu, Phone, ShoppingBag, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  const isTransparent = transparent && !scrolled && !activeMenu;

  const handleMenuToggle = useCallback((label: string) => {
    setActiveMenu((prev) => (prev === label ? null : label));
  }, []);

  const handleMouseEnter = useCallback((label: string) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setActiveMenu(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimeout.current = setTimeout(() => {
      setActiveMenu(null);
    }, 250);
  }, []);

  return (
    <>
      {/* Top utility bar */}
      <div
        className={cn(
          "hidden lg:block transition-all duration-300 relative z-[60]",
          isTransparent
            ? "bg-gradient-to-b from-black/50 to-black/10 text-white/90"
            : "bg-camp-red text-white/90"
        )}
      >
        <div className="container-default flex items-center justify-between py-2 text-xs">
          <a
            href="tel:9085802267"
            className="flex items-center gap-1.5 font-semibold hover:text-white transition-colors tracking-wide"
          >
            <Phone className="h-3 w-3" />
            908-580-CAMP (2267)
          </a>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/CampRiverbend/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="https://www.instagram.com/campriverbend/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a
                href="https://vimeo.com/campriverbend"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Vimeo"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197a315.065 315.065 0 003.501-3.123C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.012z"/></svg>
              </a>
            </div>
            <span className="text-white/30">|</span>
            <a
              href={EXTERNAL_LINKS.familyLogin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              Family Login
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header
        onMouseLeave={handleMouseLeave}
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          isTransparent
            ? "bg-gradient-to-b from-black/30 to-transparent"
            : "bg-camp-red shadow-[0_2px_8px_rgba(219,56,50,0.3)]"
        )}
      >
        <nav className="container-default" role="navigation" aria-label="Main">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="relative z-10 flex items-center gap-2"
            >
              <Image
                src="/assets/site/Camp-Riverbend-Logo-white-1.png"
                alt="Camp Riverbend"
                width={180}
                height={48}
                className="h-10 lg:h-12 w-auto drop-shadow-md"
                priority
              />
            </Link>

            {/* Right side actions — nav items + store grouped together */}
            <div className="flex items-center gap-3">
              {/* Desktop nav items */}
              <div className="hidden lg:flex items-center gap-1">
                {NAV_GROUPS.map((group) => (
                  <button
                    key={group.label}
                    onMouseEnter={() => handleMouseEnter(group.label)}
                    onClick={() => handleMenuToggle(group.label)}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                      activeMenu === group.label
                        ? "bg-white text-camp-red shadow-sm"
                        : isTransparent
                          ? "text-white/90 hover:text-white hover:bg-white/15"
                          : "text-white/90 hover:text-white hover:bg-white/15"
                    )}
                  >
                    {group.label}
                    {/* Active dot indicator */}
                    {activeMenu === group.label && (
                      <motion.span
                        layoutId="navDot"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"
                        transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                      />
                    )}
                  </button>
                ))}
              </div>
              <Link
                href="/shop"
                className={cn(
                  "hidden sm:flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                  isTransparent
                    ? "bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border border-white/20"
                    : "bg-white text-camp-red hover:bg-white/90 shadow-sm hover:shadow-md"
                )}
              >
                <ShoppingBag className="h-4 w-4" />
                Store
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                className={cn(
                  "lg:hidden p-2 rounded-lg transition-colors",
                  isTransparent
                    ? "text-white hover:bg-white/10"
                    : "text-white hover:bg-white/10"
                )}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </nav>

        {/* Mega menu dropdown */}
        <AnimatePresence>
          {activeMenu && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 z-[-1]"
                onClick={() => setActiveMenu(null)}
              />
              <div
                className="relative z-[60]"
                onMouseEnter={() => {
                  if (closeTimeout.current) {
                    clearTimeout(closeTimeout.current);
                    closeTimeout.current = null;
                  }
                }}
                onMouseLeave={handleMouseLeave}
              >
                <MegaMenu
                  group={NAV_GROUPS.find((g) => g.label === activeMenu)!}
                  onClose={() => setActiveMenu(null)}
                />
              </div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile nav */}
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
