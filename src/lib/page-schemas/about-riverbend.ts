import type { PageSchema } from "./types";
import { ABOUT_DEFAULTS } from "@/lib/page-defaults/about-riverbend";

export const ABOUT_RIVERBEND_SCHEMA: PageSchema = {
  slug: "about-riverbend",
  label: "About Riverbend",
  publicHref: "/about-riverbend",
  sections: [
    {
      label: "Page Header",
      blocks: [
        {
          key: "hero_title",
          type: "text",
          label: "Title",
          defaultContent: { value: ABOUT_DEFAULTS.hero_title },
        },
        {
          key: "hero_subtitle",
          type: "text",
          label: "Subtitle",
          defaultContent: { value: ABOUT_DEFAULTS.hero_subtitle },
        },
        {
          key: "hero_bg",
          type: "image",
          label: "Background image",
          aspectClass: "aspect-[16/6]",
          defaultContent: {
            url: ABOUT_DEFAULTS.hero_bg_url,
            alt: ABOUT_DEFAULTS.hero_bg_alt,
          },
        },
      ],
    },
    {
      label: "Legacy section (\"A Family Affair\")",
      blocks: [
        {
          key: "legacy_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: ABOUT_DEFAULTS.legacy_heading },
        },
        {
          key: "legacy",
          type: "richtext",
          label: "Body",
          defaultContent: { html: ABOUT_DEFAULTS.legacy_html },
        },
        {
          key: "legacy_video_id",
          type: "text",
          label: "Vimeo ID",
          help: "The number from the Vimeo URL (e.g. 383347420). Leave empty to hide the video.",
          defaultContent: { value: ABOUT_DEFAULTS.legacy_video_id },
        },
      ],
    },
    {
      label: "Philosophy section",
      blocks: [
        {
          key: "philosophy_caption",
          type: "text",
          label: "Caption (small red label)",
          defaultContent: { value: ABOUT_DEFAULTS.philosophy_caption },
        },
        {
          key: "philosophy_heading",
          type: "richtext",
          label: "Heading",
          help: "Use the rich text editor to style words in the heading (e.g. wrap part in red).",
          defaultContent: { html: ABOUT_DEFAULTS.philosophy_heading_html },
        },
        {
          key: "philosophy",
          type: "richtext",
          label: "Body",
          defaultContent: { html: ABOUT_DEFAULTS.philosophy_html },
        },
        {
          key: "philosophy_image",
          type: "image",
          label: "Photo",
          aspectClass: "aspect-[4/3]",
          defaultContent: {
            url: ABOUT_DEFAULTS.philosophy_image_url,
            alt: ABOUT_DEFAULTS.philosophy_image_alt,
          },
        },
      ],
    },
    {
      label: "Facilities & Location section",
      blocks: [
        {
          key: "location_caption",
          type: "text",
          label: "Caption (small red label)",
          defaultContent: { value: ABOUT_DEFAULTS.location_caption },
        },
        {
          key: "location_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: ABOUT_DEFAULTS.location_heading },
        },
        {
          key: "location",
          type: "richtext",
          label: "Body",
          defaultContent: { html: ABOUT_DEFAULTS.location_html },
        },
        {
          key: "location_phone",
          type: "text",
          label: "Phone (display)",
          defaultContent: { value: ABOUT_DEFAULTS.location_phone },
        },
        {
          key: "location_phone_href",
          type: "text",
          label: "Phone (link, e.g. tel:9085802267)",
          defaultContent: { value: ABOUT_DEFAULTS.location_phone_href },
        },
        {
          key: "location_email",
          type: "text",
          label: "Email",
          defaultContent: { value: ABOUT_DEFAULTS.location_email },
        },
        {
          key: "location_map",
          type: "image",
          label: "Camp map image",
          aspectClass: "aspect-[4/3]",
          defaultContent: {
            url: ABOUT_DEFAULTS.location_map_url,
            alt: ABOUT_DEFAULTS.location_map_alt,
          },
        },
      ],
    },
    {
      label: "Staff section",
      blocks: [
        {
          key: "staff_pullquote",
          type: "text",
          label: "Pull quote",
          defaultContent: { value: ABOUT_DEFAULTS.staff_pullquote },
        },
        {
          key: "staff",
          type: "richtext",
          label: "Body",
          defaultContent: { html: ABOUT_DEFAULTS.staff_html },
        },
        {
          key: "staff_video_id",
          type: "text",
          label: "Vimeo ID",
          help: "Leave empty to hide the video.",
          defaultContent: { value: ABOUT_DEFAULTS.staff_video_id },
        },
      ],
    },
    {
      label: "Learn More cards (bottom of page)",
      help: "Three cards link to /activities, /rates-dates-application-2026, and /programs respectively. The destination links stay fixed; only the title and image are editable.",
      blocks: [
        {
          key: "learn_more_1_title",
          type: "text",
          label: "Card 1 — title (Activities)",
          defaultContent: { value: ABOUT_DEFAULTS.learn_more_card_1_title },
        },
        {
          key: "learn_more_1_image",
          type: "image",
          label: "Card 1 — image",
          aspectClass: "aspect-[4/3]",
          defaultContent: { url: ABOUT_DEFAULTS.learn_more_card_1_image, alt: "" },
        },
        {
          key: "learn_more_2_title",
          type: "text",
          label: "Card 2 — title (Rates)",
          defaultContent: { value: ABOUT_DEFAULTS.learn_more_card_2_title },
        },
        {
          key: "learn_more_2_image",
          type: "image",
          label: "Card 2 — image",
          aspectClass: "aspect-[4/3]",
          defaultContent: { url: ABOUT_DEFAULTS.learn_more_card_2_image, alt: "" },
        },
        {
          key: "learn_more_3_title",
          type: "text",
          label: "Card 3 — title (Programs)",
          defaultContent: { value: ABOUT_DEFAULTS.learn_more_card_3_title },
        },
        {
          key: "learn_more_3_image",
          type: "image",
          label: "Card 3 — image",
          aspectClass: "aspect-[4/3]",
          defaultContent: { url: ABOUT_DEFAULTS.learn_more_card_3_image, alt: "" },
        },
      ],
    },
  ],
};
