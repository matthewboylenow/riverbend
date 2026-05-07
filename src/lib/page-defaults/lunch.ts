/**
 * Default content for /lunch.
 *
 * Mirrors the live page exactly so the editor opens populated, and the
 * public page falls back to these strings whenever the DB has no row.
 *
 * Editing here updates BOTH the editor's blank-state and the public
 * page's fallback. Once an admin saves through the editor, those DB
 * values take precedence.
 */

export const LUNCH_DEFAULTS = {
  hero_title: "Lunch & Snacks",
  hero_subtitle: "Kid favorites and healthy choices, every day",
  hero_bg_url: "/assets/site/IMG_370.jpg",
  hero_bg_alt: "",

  overview_heading: "Daily Lunch",
  overview_html:
    "<p>Lunch is provided daily and is the perfect combination of kid favorites and healthy choices, created by our very own Camp Riverbend Dietician.</p>",
  overview_image_url: "/assets/site/IMG_370.jpg",
  overview_image_alt: "Lunch at Camp Riverbend",

  snack_shack_heading: "The Snack Shack",
  snack_shack_html:
    "<p>Our Snack Shack provides campers with mid-morning or mid-afternoon snacks, such as goldfish crackers, pretzels, popcorn, fresh fruit and fresh veggies!</p><p>All campers have an ice cream or ice pop treat as they wrap up their day.</p><p>As always at Riverbend, all snack items offered are tree nut and peanut free. Gluten-free items are also available. Snacks are included in camp tuition.</p>",

  allergy_heading: "Allergy Aware Kitchen",
  allergy_html:
    "<p>Our kitchen is &ldquo;allergy aware.&rdquo; We do not serve any tree nut or peanut products and can accommodate a variety of food allergies, such as: gluten, dairy, sesame and egg allergies.</p>",

  video_id: "382946475",
  video_title: "Lunch & Snacks",
};
