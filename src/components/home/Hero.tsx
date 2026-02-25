"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ChevronDown } from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/navigation";

export function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] max-h-[1000px] flex items-center overflow-hidden">
      {/* Background — hero video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-camp-kids.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-riverbend.mp4" type="video/mp4" />
        </video>
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-default">
        <div className="max-w-2xl space-y-6">
          {/* Tagline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-white font-camp leading-[1.05] tracking-tight"
          >
            Where Tradition
            <br />
            <span className="text-camp-red-light">Meets Tomorrow</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/80 text-lg sm:text-xl leading-relaxed max-w-lg"
          >
            A summer day camp for 3–14 year olds in Warren, New Jersey.
            Building confidence since 1962.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Button variant="primary" size="lg" href="/programs">
              Explore Programs
            </Button>
            <Button
              variant="white"
              size="lg"
              href={EXTERNAL_LINKS.inquiryForm}
              external
            >
              Book a Tour
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/50"
        >
          <span className="text-xs font-medium tracking-widest uppercase">
            Scroll
          </span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
