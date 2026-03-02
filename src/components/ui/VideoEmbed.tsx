"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

interface VideoEmbedProps {
  vimeoId: string;
  title?: string;
  poster?: string;
  className?: string;
}

export function VideoEmbed({
  vimeoId,
  title = "Video",
  poster,
  className,
}: VideoEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-video overflow-hidden rounded-2xl bg-charcoal shadow-lg",
        className
      )}
    >
      {!isLoaded && (
        <button
          onClick={() => setIsLoaded(true)}
          className="absolute inset-0 z-10 flex items-center justify-center group cursor-pointer"
          aria-label={`Play ${title}`}
        >
          {poster && (
            <img
              src={poster}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-camp-red text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Play className="h-8 w-8 ml-1" fill="currentColor" />
          </div>
        </button>
      )}

      {(isLoaded || isVisible) && (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?badge=0&title=0&byline=0&portrait=0${isLoaded ? "&autoplay=1" : ""}`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className={cn(
            "absolute inset-0 h-full w-full",
            !isLoaded && "opacity-0"
          )}
        />
      )}
    </div>
  );
}
