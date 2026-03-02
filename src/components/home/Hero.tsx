"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ChevronDown } from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/navigation";

const VIDEO_SRC = "/videos/hero-riverbend.mp4";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);

  // Seamless loop — rewind early so there's no gap
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => {
      // When within 0.3s of the end, fade-rewind to start
      if (video.duration && video.currentTime >= video.duration - 0.3) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    };
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  }, []);

  return (
    <section className="relative z-0 h-[100vh] min-h-[600px] max-h-[1080px] flex items-end overflow-hidden">
      {/* Background: video with image fallback */}
      <div className="absolute inset-0">
        {!videoFailed ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoFailed(true)}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
        ) : (
          <Image
            src="/images/ADV01122.jpg"
            alt="Campers enjoying summer at Camp Riverbend"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        {/* Bottom gradient only — keeps top clear so navbar isn't affected */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Content — pinned to bottom-left */}
      <div className="relative z-10 w-full pb-28 sm:pb-32 pl-6 sm:pl-10 lg:pl-16">
        <div className="max-w-xl space-y-5">
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
          >
            <div className="h-px w-10 bg-white/50" />
            <span className="text-white/70 text-xs font-semibold tracking-[0.2em] uppercase">
              Since 1962
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-white font-camp leading-[1.05] tracking-tight"
          >
            Where Tradition
            <br />
            <span className="text-white/90">Meets Tomorrow</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/80 text-lg sm:text-xl leading-relaxed max-w-lg"
          >
            A summer day camp for 3-14 year olds in Warren, New Jersey.
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

      {/* Sound toggle — pill-shaped, bottom-right */}
      {!videoFailed && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onClick={toggleMute}
          className="absolute bottom-8 right-8 z-20 group flex items-center gap-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300 cursor-pointer"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {/* Sound wave icon */}
          <div className="relative w-5 h-5 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" opacity="0.3" />
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <AnimatePresence mode="wait">
                {isMuted ? (
                  <motion.g key="muted">
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </motion.g>
                ) : (
                  <motion.g key="unmuted">
                    <motion.path
                      d="M15.54 8.46a5 5 0 0 1 0 7.07"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.path
                      d="M19.07 4.93a10 10 0 0 1 0 14.14"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    />
                  </motion.g>
                )}
              </AnimatePresence>
            </svg>
          </div>
          <span className="text-xs font-medium tracking-wide">
            {isMuted ? "Tap for sound" : "Playing"}
          </span>
          {/* Animated sound bars when unmuted */}
          <AnimatePresence>
            {!isMuted && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-end gap-0.5 h-3.5 overflow-hidden"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] bg-camp-red-light rounded-full"
                    animate={{
                      height: ["40%", "100%", "60%", "90%", "40%"],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}

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
          className="flex flex-col items-center gap-2 text-white/40"
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
