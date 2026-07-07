/**
 * Default content for the homepage. Mirrors the live page exactly so
 * the editor opens populated and the public page falls back to these
 * values when the DB has no row.
 *
 * BentoGrid layout is structurally fixed (which card sits in which
 * cell, icons by index). Only the per-card copy + image + href are
 * editable. Card 2 is the live countdown to first day of camp; its
 * target date is editable as a text block (ISO format).
 */

export interface ProgramCardDefault {
  badge: string;
  title: string;
  description: string;
  image_url: string;
  image_alt: string;
  link_1_label: string;
  link_1_href: string;
  link_2_label: string;
  link_2_href: string;
  reversed?: boolean;
}

export interface BentoCardDefault {
  title: string;
  subtitle: string; // empty = hide
  href: string;
  image_url: string;
  cta: string;
}

export const HOME_DEFAULTS = {
  // ─── Hero ────────────────────────────────────────────
  hero_overline: "Since 1962",
  hero_headline_1: "Where Tradition",
  hero_headline_2: "Meets Tomorrow",
  hero_subtitle:
    "A summer day camp for 3-14 year olds in Warren, New Jersey. Building confidence since 1962.",
  hero_primary_cta_label: "Explore Programs",
  hero_primary_cta_href: "/programs",
  hero_secondary_cta_label: "Book a Tour",
  hero_video_url: "/videos/hero-riverbend.mp4",
  hero_fallback_image_url: "/assets/site/ADV01122.jpg",
  hero_fallback_image_alt: "Campers enjoying summer at Camp Riverbend",

  // ─── Announcement bar ──────────────────────────────────
  announcement_message:
    "Now accepting applications for 2026 season — Limited spaces still available",
  announcement_link_text: "Apply Now",
  announcement_link_href: "/rates-dates-application",

  // ─── Philosophy section ────────────────────────────────
  philosophy_caption: "Our Philosophy",
  philosophy_heading_html:
    '<p>"Confidence, <em>not</em> Competition"</p>',
  philosophy_body:
    "We honor each camper's talents and efforts. Camp Riverbend is a place where each child can be themself, explore the world and learn new skills in a fun and supportive environment.",
  philosophy_story_label: "Our Story",
  philosophy_story_href: "/about-riverbend",
  philosophy_tour_label: "Book a Tour",

  // ─── Programs section ──────────────────────────────────
  programs_caption: "Ages 3 to 14",
  programs_heading: "Our Programs",
  programs: [
    {
      badge: "Pre-K3 to Kindergarten",
      title: "The Clubhouse",
      description:
        "The Clubhouse is a wonderful introduction to the summer camp experience for campers aged three, four and five years old. They are introduced to arts and crafts, sports, cooking, nature, swimming and other fun activities geared to their age and ability that encourage growth, confidence and learning. Clubhouse campers also have the option of coming three, four or five days a week.",
      image_url: "/assets/site/DSC_0553-scaled.jpg",
      image_alt: "Young campers enjoying activities at The Clubhouse",
      link_1_label: "Learn About The Clubhouse",
      link_1_href: "/clubhouse",
      link_2_label: "A Day in the Life",
      link_2_href: "/clubhouse#video",
      reversed: false,
    },
    {
      badge: "Grades 1 to 8",
      title: "Riverbend Experience",
      description:
        "Campers entering 1st through 8th grades explore, grow and gain confidence! During the day, each group rotates through seven different activities and has many new experiences. There are days packed full of fabulous activities and fun for kids; this is the place to make new friends and life-long memories!",
      image_url: "/assets/site/DSC07006-scaled.jpg",
      image_alt: "Kids exploring and playing at Riverbend Experience",
      link_1_label: "Learn About Riverbend Experience",
      link_1_href: "/riverbend-experience",
      link_2_label: "A Day in the Life",
      link_2_href: "/riverbend-experience#video",
      reversed: true,
    },
    {
      badge: "Grades 7 to 9",
      title: "Day Trippers",
      description:
        "The Day Trippers program takes young teens out of camp and on the road for day trips and short overnight trips in our region. You'll find us down at the beach and up in the mountains. We'll be boating, cooking, climbing, seeing the sights and exploring the world!",
      image_url: "/assets/site/IMG_1650-scaled.jpg",
      image_alt: "Day Trippers on an outdoor adventure",
      link_1_label: "Learn About The Day Trippers",
      link_1_href: "/day-trippers",
      link_2_label: "A Day in the Life",
      link_2_href: "/day-trippers#video",
      reversed: false,
    },
  ] as ProgramCardDefault[],

  // ─── BentoGrid ────────────────────────────────────────
  // Structural layout is fixed (see BentoGrid.tsx). Only per-card
  // copy + image + href are editable. Card index = position in the grid.
  // Card 2 is the live countdown, card 3 is the stat tile.
  bento_card_0: {
    title: "Our Programs",
    subtitle: "Ages 3 to 14",
    href: "/programs",
    image_url: "/assets/site/ADV06620.jpg-marketing-scaled.jpg",
    cta: "View programs",
  },
  bento_card_1: {
    title: "Activities",
    subtitle: "50+ to explore",
    href: "/activities",
    image_url: "/assets/site/ADV01169.jpg",
    cta: "See all activities",
  },
  // Card 2: countdown (no image)
  bento_countdown_label: "First Day of Camp",
  bento_countdown_target: "2026-06-29T09:00:00",
  bento_countdown_href: "/rates-dates-application",
  // Card 3: stat tile
  bento_stat_number: "64",
  bento_stat_label: "Years of tradition",
  bento_stat_href: "/about-riverbend",

  bento_card_4: {
    title: "Rates & Dates 2026",
    subtitle: "Apply now",
    href: "/rates-dates-application",
    image_url: "/assets/site/Canoe.jpg",
    cta: "Apply now",
  },
  bento_card_5: {
    title: "Legacy & Tradition",
    subtitle: "Since 1962",
    href: "/about-riverbend",
    image_url: "/assets/site/ADV07104-scaled.jpg",
    cta: "Our story",
  },
  bento_card_6: {
    title: "Video Library",
    subtitle: "See camp in action",
    href: "/videos",
    image_url: "/assets/site/ADV07400.jpg-marketing-scaled.jpg",
    cta: "Watch videos",
  },
  bento_card_7: {
    title: "Transportation",
    subtitle: "",
    href: "/transportation",
    image_url: "/assets/site/DSC06927-scaled.jpg",
    cta: "Routes & info",
  },
  bento_card_8: {
    title: "Lunch & Snacks",
    subtitle: "",
    href: "/lunch",
    image_url: "/assets/site/IMG_370.jpg",
    cta: "See the menu",
  },
  bento_card_9: {
    title: "Health & Safety",
    subtitle: "",
    href: "/health-safety",
    image_url: "/assets/site/ADV06446-scaled.jpg",
    cta: "Our protocols",
  },
  bento_card_10: {
    title: "Camp Map",
    subtitle: "Explore our grounds",
    href: "/camp-map",
    image_url: "/assets/site/2022-Camp-Map-JPG-scaled.jpg",
    cta: "View the map",
  },
} as const;
