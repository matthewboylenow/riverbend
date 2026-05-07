/**
 * Default content for /clubhouse.
 *
 * Mirrors the live page exactly so the editor opens populated, and the
 * public page falls back to these strings whenever the DB has no row.
 *
 * Editing here updates BOTH the editor's blank-state and the public
 * page's fallback. Once an admin saves through the editor, those DB
 * values take precedence.
 */

export const CLUBHOUSE_DEFAULTS = {
  hero_title: "The Clubhouse",
  hero_subtitle: "A wonderful introduction to camp for ages 3-5",
  hero_bg_url: "/assets/site/DSC_0553-scaled.jpg",
  hero_bg_alt: "",

  // Overview section
  overview_age_label: "Ages 3-5",
  overview_html:
    "<p>The Clubhouse is a wonderful introduction to the classic summer camp experience for campers ages 3-5 years old (rising pre-K and kindergarteners). All our Clubhouse campers are in co-ed groups in a designated area of the camp built just for them. Everything is kid-sized, right down to the chairs and the athletic field, so they are right at home and comfortable!</p><p>The Clubhouse daily schedule alternates between quiet and dynamic activities and includes a rest time after lunch. Swimming is an important part of each day, with group instruction each morning and a &ldquo;free&rdquo; swim in the afternoon for splashing around and having fun (three-quarter day campers have a &ldquo;free&rdquo; swim immediately after their morning lesson). Other fun activities for our Clubhouse Campers include: sports, crafts, cooking, canoeing and nature.</p>",

  // Video section
  video_caption: "See our swim program in action!",
  video_id: "361307397",
  video_title: "Clubhouse Swim Program",

  // Programs Grid section
  programs_three_quarter_heading: "Three-Quarter Day Programs",
  programs_three_quarter_html:
    "<p>Our youngest campers attend camp 9:00 am &ndash; 2:00 pm and experience all the fun of Camp Riverbend! Campers must be toilet trained.</p>",
  programs_full_day_heading: "Full-Day Program",
  programs_full_day_html:
    "<p>Children entering their last year of preschool or Kindergarten and ready for a full day at camp attend our regular full-day program.</p>",

  // Supervision section
  supervision_heading: "Supervision",
  supervision_html:
    "<p>Three counselors supervise about 16 boys and girls in each Clubhouse group. Smaller groups have two counselors.</p><p>The head group counselors are educators with experience in early childhood education. The assistant group counselors are college and older high school students who really enjoy being with young children. We nurture our Clubhouse campers with lots of individual attention and age-appropriate fun and exploration.</p>",
  supervision_image_url: "/assets/site/ADV06620.jpg-marketing-scaled.jpg",
  supervision_image_alt: "Clubhouse counselors with young campers",

  // Sample Schedules section
  schedules_heading: "Sample Schedules",
  schedules_intro: "See how a typical day is structured for our youngest campers.",
  schedules_card_1_title: "Three-Quarter Day",
  schedules_card_1_subtitle: "3-year-olds · 9:00 am – 2:00 pm",
  schedules_card_2_title: "Full Day",
  schedules_card_2_subtitle: "4–5 year-olds · Pre-K and K",

  // Learn More cards (bottom of page) — hrefs stay hardcoded in JSX since
  // they're internal links; only title + image are editable.
  learn_more_card_1_title: "All Programs",
  learn_more_card_1_image: "/assets/site/ADV07104-scaled.jpg",
  learn_more_card_2_title: "Activities",
  learn_more_card_2_image: "/assets/site/ADV01169.jpg",
  learn_more_card_3_title: "Rates & Dates",
  learn_more_card_3_image: "/assets/site/Canoe.jpg",
};
