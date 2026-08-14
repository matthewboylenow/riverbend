"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Play, MapPin, Calendar, Heart, Utensils, Shield, Bus } from "lucide-react";
import type { BentoContent } from "@/lib/home-content";

interface BentoCardProps {
  title: string;
  subtitle?: string;
  href: string;
  image: string;
  icon?: React.ReactNode;
  className?: string;
  index: number;
  cta?: string;
}

function BentoCard({
  title,
  subtitle,
  href,
  image,
  icon,
  className = "",
  index,
  cta = "Learn more",
}: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      <Link
        href={href}
        className="group relative block h-full overflow-hidden rounded-2xl bg-charcoal"
      >
        {/* Image */}
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />

        {/* Overlay — neutral dark for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/35 to-charcoal/10 group-hover:from-charcoal/90 transition-all duration-500" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 lg:p-7">
          {icon && (
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm text-white">
              {icon}
            </div>
          )}
          <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold leading-tight tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-sm text-white/70">{subtitle}</p>
          )}

          {/* Arrow indicator */}
          <div className="mt-3 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors duration-300">
            <span className="text-sm font-medium">{cta}</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* Countdown card — counts down to first day of camp */
function CountdownCard({
  targetDate,
  label,
  href,
  index,
  className = "",
}: {
  targetDate: Date;
  label: string;
  href: string;
  index: number;
  className?: string;
}) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      <Link
        href={href}
        className="group relative flex flex-col justify-center items-center h-full rounded-2xl bg-camp-red text-white p-4 overflow-hidden transition-all duration-300 hover:bg-camp-red-dark"
      >
        {/* Decorative ring */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border border-white/10" />
        <span className="text-caption text-white/70 text-[0.6rem] tracking-widest mb-2 uppercase">
          {label}
        </span>
        <div className="flex gap-3 text-center">
          {timeLeft.days > 0 && (
            <div>
              <span className="font-camp text-3xl sm:text-4xl font-bold leading-none">{timeLeft.days}</span>
              <span className="block text-[0.6rem] font-semibold text-white/60 uppercase mt-0.5">Days</span>
            </div>
          )}
          <div>
            <span className="font-camp text-3xl sm:text-4xl font-bold leading-none">{String(timeLeft.hours).padStart(2, "0")}</span>
            <span className="block text-[0.6rem] font-semibold text-white/60 uppercase mt-0.5">Hrs</span>
          </div>
          <div>
            <span className="font-camp text-3xl sm:text-4xl font-bold leading-none">{String(timeLeft.minutes).padStart(2, "0")}</span>
            <span className="block text-[0.6rem] font-semibold text-white/60 uppercase mt-0.5">Min</span>
          </div>
          <div>
            <span className="font-camp text-3xl sm:text-4xl font-bold leading-none">{String(timeLeft.seconds).padStart(2, "0")}</span>
            <span className="block text-[0.6rem] font-semibold text-white/60 uppercase mt-0.5">Sec</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function getTimeLeft(target: Date) {
  const now = new Date();
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/* Small stat card — no image, solid background */
function StatCard({
  number,
  label,
  href,
  index,
  className = "",
}: {
  number: string;
  label: string;
  href: string;
  index: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      <Link
        href={href}
        className="group relative flex flex-col justify-center items-center h-full rounded-2xl bg-forest text-white p-6 overflow-hidden transition-all duration-300 hover:bg-forest-light"
      >
        {/* Decorative ring */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border border-white/10" />
        <span className="font-camp text-4xl sm:text-5xl font-bold leading-none text-white/90">
          {number}
        </span>
        <span className="mt-2 text-sm font-semibold tracking-wide text-white/70 text-center uppercase">
          {label}
        </span>
      </Link>
    </motion.div>
  );
}

export function BentoGrid({
  content,
  promoPosition = "bottom",
  hiddenTiles = [],
}: {
  content: BentoContent;
  /** Where the optional card11 promo row renders (admin-controlled). */
  promoPosition?: "top" | "bottom" | "hidden";
  /** Tiles hidden via the homepage editor's eye toggles. */
  hiddenTiles?: string[];
}) {
  const tileShown = (tile: string) => !hiddenTiles.includes(tile);
  // Full-width promo row (e.g. next season's rates). Renders only when the
  // admin has given it a title AND its section isn't hidden in the editor.
  const promoRow =
    content.card11.title && promoPosition !== "hidden" ? (
      <BentoCard
        title={content.card11.title}
        subtitle={content.card11.subtitle || undefined}
        href={content.card11.href}
        image={content.card11.imageUrl}
        icon={<Calendar className="h-4 w-4" />}
        className="col-span-2 lg:col-span-4 row-span-1"
        index={promoPosition === "top" ? 0 : 11}
        cta={content.card11.cta}
      />
    ) : null;

  return (
    <div className="grid grid-flow-dense grid-cols-2 lg:grid-cols-4 auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[200px] gap-3 sm:gap-4">
      {promoPosition === "top" && promoRow}

      {/* Row 1: Featured large card + tall card + 2 stat cards stacked */}
      {tileShown("card0") && (
        <BentoCard
          title={content.card0.title}
          subtitle={content.card0.subtitle || undefined}
          href={content.card0.href}
          image={content.card0.imageUrl}
          icon={<Heart className="h-4 w-4" />}
          className="col-span-2 row-span-2"
          index={0}
          cta={content.card0.cta}
        />
      )}
      {tileShown("card1") && (
        <BentoCard
          title={content.card1.title}
          subtitle={content.card1.subtitle || undefined}
          href={content.card1.href}
          image={content.card1.imageUrl}
          className="col-span-1 row-span-2"
          index={1}
          cta={content.card1.cta}
        />
      )}
      {tileShown("countdown") && (
        <CountdownCard
          targetDate={new Date(content.countdown.targetIso)}
          label={content.countdown.label}
          href={content.countdown.href}
          index={2}
          className="col-span-1 row-span-1"
        />
      )}
      {tileShown("stat") && (
        <StatCard
          number={content.stat.number}
          label={content.stat.label}
          href={content.stat.href}
          index={3}
          className="col-span-1 row-span-1"
        />
      )}

      {/* Row 2: 4 standard cards */}
      {tileShown("card4") && (
        <BentoCard
          title={content.card4.title}
          subtitle={content.card4.subtitle || undefined}
          href={content.card4.href}
          image={content.card4.imageUrl}
          icon={<Calendar className="h-4 w-4" />}
          className="col-span-1 row-span-1"
          index={4}
          cta={content.card4.cta}
        />
      )}
      {tileShown("card5") && (
        <BentoCard
          title={content.card5.title}
          subtitle={content.card5.subtitle || undefined}
          href={content.card5.href}
          image={content.card5.imageUrl}
          className="col-span-1 row-span-1"
          index={5}
          cta={content.card5.cta}
        />
      )}
      {tileShown("card6") && (
        <BentoCard
          title={content.card6.title}
          subtitle={content.card6.subtitle || undefined}
          href={content.card6.href}
          image={content.card6.imageUrl}
          icon={<Play className="h-4 w-4" />}
          className="col-span-2 row-span-1"
          index={6}
          cta={content.card6.cta}
        />
      )}

      {/* Row 3: Practical links — varied sizes */}
      {tileShown("card7") && (
        <BentoCard
          title={content.card7.title}
          subtitle={content.card7.subtitle || undefined}
          href={content.card7.href}
          image={content.card7.imageUrl}
          icon={<Bus className="h-4 w-4" />}
          className="col-span-1 row-span-1"
          index={7}
          cta={content.card7.cta}
        />
      )}
      {tileShown("card8") && (
        <BentoCard
          title={content.card8.title}
          subtitle={content.card8.subtitle || undefined}
          href={content.card8.href}
          image={content.card8.imageUrl}
          icon={<Utensils className="h-4 w-4" />}
          className="col-span-1 row-span-1"
          index={8}
          cta={content.card8.cta}
        />
      )}
      {tileShown("card9") && (
        <BentoCard
          title={content.card9.title}
          subtitle={content.card9.subtitle || undefined}
          href={content.card9.href}
          image={content.card9.imageUrl}
          icon={<Shield className="h-4 w-4" />}
          className="col-span-1 row-span-1"
          index={9}
          cta={content.card9.cta}
        />
      )}
      {tileShown("card10") && (
        <BentoCard
          title={content.card10.title}
          subtitle={content.card10.subtitle || undefined}
          href={content.card10.href}
          image={content.card10.imageUrl}
          icon={<MapPin className="h-4 w-4" />}
          className="col-span-1 row-span-1"
          index={10}
          cta={content.card10.cta}
        />
      )}

      {promoPosition === "bottom" && promoRow}
    </div>
  );
}
