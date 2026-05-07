/**
 * Default content for /calendar.
 *
 * Mirrors the live page exactly so the editor opens populated, and the
 * public page falls back to these strings whenever the DB has no row.
 *
 * Editing here updates BOTH the editor's blank-state and the public
 * page's fallback. Once an admin saves through the editor, those DB
 * values take precedence.
 */

export interface KeyDateRow {
  date: string;
  event: string;
}

export const CALENDAR_DEFAULTS = {
  hero_title: "2026 Calendar",
  hero_subtitle: "Important dates for the upcoming season",
  hero_bg_url: "/assets/site/ADV06620.jpg-marketing-scaled.jpg",
  hero_bg_alt: "",

  // Section 1: program calendar image
  calendar_image_url: "/assets/site/2026-program-calendar.png",
  calendar_image_alt: "2026 Camp Riverbend Program Calendar",

  // Section 2: key dates list
  key_dates_heading: "Key Dates",
  key_dates: [
    { date: "January 6", event: "$2,000 per camper tuition payment charged" },
    { date: "April 1", event: "Final tuition payment charged" },
    { date: "Mid-April", event: "Bus assignments distributed" },
    { date: "May 15", event: "Camper medical forms and authorization documents due" },
    { date: "Mid-May", event: "Parent Handbook distribution and Riverbend App setup" },
    { date: "Early June", event: "Division head orientation sessions; Lunch orders open" },
    { date: "June 18", event: "Week 1 lunch orders close" },
    { date: "June 19", event: "Bus rider introductions sent" },
    { date: "June 20–21", event: "Welcome Weekend at Camp" },
    { date: "June 29", event: "Opening day of the 2026 season" },
    { date: "July 3", event: "Camp is closed" },
    { date: "July 4", event: "Group lists and counselor introductions go out" },
    { date: "Mid-July", event: "Tour weekend for prospective families" },
    { date: "Early August", event: "2027 applications open for enrolled families" },
    { date: "Mid-August", event: "2027 applications open for all" },
    { date: "August 14", event: "Last day of the 2026 season" },
  ] as KeyDateRow[],

  // Section 3: carnival video
  carnival_heading: "Carnival & Special Days",
  carnival_video_id: "382946042",
};
