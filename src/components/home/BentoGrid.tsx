"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Play, MapPin, Calendar, Heart, Utensils, Shield, Bus } from "lucide-react";

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

export function BentoGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[200px] gap-3 sm:gap-4">
      {/* Row 1: Featured large card + tall card + 2 stat cards stacked */}
      <BentoCard
        title="Our Programs"
        subtitle="Ages 3 to 14"
        href="/programs"
        image="/images/ADV06620.jpg-marketing-scaled.jpg"
        icon={<Heart className="h-4 w-4" />}
        className="col-span-2 row-span-2"
        index={0}
        cta="View programs"
      />
      <BentoCard
        title="Activities"
        subtitle="50+ to explore"
        href="/activities"
        image="/images/ADV01169.jpg"
        className="col-span-1 row-span-2"
        index={1}
        cta="See all activities"
      />
      <CountdownCard
        targetDate={new Date("2026-06-29T09:00:00")}
        label="First Day of Camp"
        href="/rates-dates-application-2026"
        index={2}
        className="col-span-1 row-span-1"
      />
      <StatCard
        number="62+"
        label="Years of tradition"
        href="/about-riverbend"
        index={3}
        className="col-span-1 row-span-1"
      />

      {/* Row 2: 4 standard cards */}
      <BentoCard
        title="Rates & Dates 2026"
        subtitle="Apply now"
        href="/rates-dates-application-2026"
        image="/images/Canoe.jpg"
        icon={<Calendar className="h-4 w-4" />}
        className="col-span-1 row-span-1"
        index={4}
        cta="Apply now"
      />
      <BentoCard
        title="Legacy & Tradition"
        subtitle="Since 1962"
        href="/about-riverbend"
        image="/images/ADV07104-scaled.jpg"
        className="col-span-1 row-span-1"
        index={5}
        cta="Our story"
      />
      <BentoCard
        title="Video Library"
        subtitle="See camp in action"
        href="/videos"
        image="/images/ADV07400.jpg-marketing-scaled.jpg"
        icon={<Play className="h-4 w-4" />}
        className="col-span-2 row-span-1"
        index={6}
        cta="Watch videos"
      />

      {/* Row 3: Practical links — varied sizes */}
      <BentoCard
        title="Transportation"
        href="/transportation"
        image="/images/DSC06927-scaled.jpg"
        icon={<Bus className="h-4 w-4" />}
        className="col-span-1 row-span-1"
        index={7}
        cta="Routes & info"
      />
      <BentoCard
        title="Lunch & Snacks"
        href="/lunch"
        image="/images/IMG_370.jpg"
        icon={<Utensils className="h-4 w-4" />}
        className="col-span-1 row-span-1"
        index={8}
        cta="See the menu"
      />
      <BentoCard
        title="Health & Safety"
        href="/health-safety"
        image="/images/ADV06446-scaled.jpg"
        icon={<Shield className="h-4 w-4" />}
        className="col-span-1 row-span-1"
        index={9}
        cta="Our protocols"
      />
      <BentoCard
        title="Camp Map"
        subtitle="Explore our grounds"
        href="/camp-map"
        image="/images/2022-Camp-Map-JPG-scaled.jpg"
        icon={<MapPin className="h-4 w-4" />}
        className="col-span-1 row-span-1"
        index={10}
        cta="View the map"
      />
    </div>
  );
}
