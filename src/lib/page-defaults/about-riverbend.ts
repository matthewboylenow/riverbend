/**
 * Default content for /about-riverbend.
 *
 * Mirrors the live page exactly so the editor opens populated, and the
 * public page falls back to these strings whenever the DB has no row.
 *
 * Editing here updates BOTH the editor's blank-state and the public
 * page's fallback. Once an admin saves through the editor, those DB
 * values take precedence.
 */

export const ABOUT_DEFAULTS = {
  hero_title: "Legacy & Tradition",
  hero_subtitle:
    "Camp Riverbend has hosted generations of families for over 60 years in Warren Township, New Jersey",
  hero_bg_url: "/assets/site/IMG_2726.jpg",
  hero_bg_alt: "",

  legacy_heading: "A Family Affair",
  legacy_html:
    "<p>Founded by Marianne and Harold Breene in 1962, Camp Riverbend is a family affair. The four Breene children—Roger, Jill, Paul and Robin, and daughters-in-law Debbie and Miriam, now run the camp, and the newest generation of Breene great-grandchildren are becoming campers! Each member of the family is here to provide a personal, hands-on camp experience you'll never forget!</p><p>Camp Riverbend is proud to be accredited by the American Camp Association, and has been since its very first season. Camp Riverbend traditions create lifelong memories for campers.</p>",
  legacy_video_id: "383347420",

  philosophy_caption: "Our Philosophy",
  philosophy_heading_html: '<p><span style="color: var(--camp-red)">"Confidence,</span> not Competition"</p>',
  philosophy_html:
    "<p>We honor each camper's talents and efforts. Camp Riverbend is a place where each child can be themself, explore the world and learn new skills in a fun and supportive environment.</p><p>We encourage every camper to participate in all activities and we applaud every achievement – from a camper's first at-bat to a grand-slam home run!</p>",
  philosophy_image_url: "/assets/site/ADV06620.jpg-marketing-scaled.jpg",
  philosophy_image_alt: "Young campers building confidence together at camp",

  location_caption: "Our Campus",
  location_heading: "Facilities & Location",
  location_html:
    "<p>Located in beautiful Somerset County, just 35 minutes from NYC, Camp Riverbend sits on a 30-acre site along the Passaic River. The environment is perfect for explorers of all ages, with vibrant woods, open fields, nature trails, a wetlands sanctuary, athletic facilities and the river bank.</p><p>Take a look at all the activities and amenities Camp Riverbend has to offer!</p>",
  location_phone: "(908) 580-CAMP",
  location_phone_href: "tel:9085802267",
  location_email: "info@campriverbend.com",
  location_map_url: "/assets/site/2022-Camp-Map-JPG-scaled.jpg",
  location_map_alt: "Camp Riverbend campus map",

  staff_pullquote: "“A camp is only as good as its counselors.”",
  staff_html:
    "<p>We take pride in our mature, talented staff of dedicated teachers and enthusiastic college students and older high school students, many of whom were once Riverbend campers themselves. There is no CIT program.</p>",
  staff_video_id: "361309800",

  // Three "Learn More" cards at the bottom — fixed slots, hrefs stay hardcoded
  // in JSX since they're internal links; only title + image are editable.
  learn_more_card_1_title: "Activities Offered",
  learn_more_card_1_image: "/assets/site/ADV01169.jpg",
  learn_more_card_2_title: "Rates & Dates",
  learn_more_card_2_image: "/assets/site/Canoe.jpg",
  learn_more_card_3_title: "Our Programs",
  learn_more_card_3_image: "/assets/site/ADV06620.jpg-marketing-scaled.jpg",
};
