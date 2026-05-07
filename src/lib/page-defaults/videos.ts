/**
 * Default content for /videos.
 *
 * Mirrors the live page exactly so the editor opens populated, and the
 * public page falls back to these strings whenever the DB has no row.
 *
 * Editing here updates BOTH the editor's blank-state and the public
 * page's fallback. Once an admin saves through the editor, those DB
 * values take precedence.
 */

export interface VideoRow {
  vimeoId: string;
  title: string;
}

export const VIDEOS_DEFAULTS = {
  hero_title: "Video Library",
  hero_subtitle: "Learn more about Camp Riverbend — watch our videos!",
  hero_bg_url: "/assets/site/ADV07400.jpg-marketing-scaled.jpg",
  hero_bg_alt: "",

  videos: [
    { vimeoId: "383347420", title: "The Breene's Legacy" },
    { vimeoId: "361307397", title: "Clubhouse" },
    { vimeoId: "361309028", title: "Riverbend Experience" },
    { vimeoId: "361308491", title: "Day Trippers" },
    { vimeoId: "361310178", title: "Aquatics Program" },
    { vimeoId: "380563616", title: "Safety & Health" },
    { vimeoId: "382946042", title: "Transportation" },
    { vimeoId: "382945475", title: "Sports" },
    { vimeoId: "382946991", title: "Adventure Course & High Ropes" },
    { vimeoId: "367278383", title: "Arts & Crafts" },
    { vimeoId: "382947510", title: "Choice Clubs, Tracking & Superchoice" },
    { vimeoId: "382946475", title: "Lunch & Snacks" },
    { vimeoId: "361309800", title: "Counselors / Staff" },
    { vimeoId: "386555082", title: "Family Camp Day" },
    { vimeoId: "386555546", title: "Carnival & Special Days" },
    { vimeoId: "386592102", title: "Testimonials from Campers, Staff & Parents" },
  ] as VideoRow[],
};
