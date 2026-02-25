"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LinkCardProps {
  title: string;
  href: string;
  image: string;
  index?: number;
  className?: string;
}

export function LinkCard({ title, href, image, index = 0, className }: LinkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={href}
        className={cn(
          "group relative block overflow-hidden rounded-2xl aspect-[4/3] bg-charcoal",
          className
        )}
      >
        {/* Image */}
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-colors duration-300 group-hover:from-black/80" />

        {/* Title */}
        <div className="absolute inset-0 flex items-end p-5 sm:p-6">
          <h3 className="text-white text-lg sm:text-xl font-bold leading-tight tracking-tight drop-shadow-lg">
            {title}
          </h3>
        </div>

        {/* Hover indicator */}
        <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/0 text-white opacity-0 group-hover:bg-white/20 group-hover:opacity-100 transition-all duration-300">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}
