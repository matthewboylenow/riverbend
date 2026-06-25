import type { PageSchema } from "./types";
import { LUNCH_DEFAULTS } from "@/lib/page-defaults/lunch";

export const LUNCH_SCHEMA: PageSchema = {
  slug: "lunch",
  label: "Lunch & Snacks",
  publicHref: "/lunch",
  sections: [
    {
      label: "Page Header",
      blocks: [
        {
          key: "hero_title",
          type: "text",
          label: "Title",
          defaultContent: { value: LUNCH_DEFAULTS.hero_title },
        },
        {
          key: "hero_subtitle",
          type: "text",
          label: "Subtitle",
          defaultContent: { value: LUNCH_DEFAULTS.hero_subtitle },
        },
        {
          key: "hero_bg",
          type: "image",
          label: "Background image",
          aspectClass: "aspect-[16/6]",
          defaultContent: {
            url: LUNCH_DEFAULTS.hero_bg_url,
            alt: LUNCH_DEFAULTS.hero_bg_alt,
          },
        },
      ],
    },
    {
      label: "Lunch Menu button",
      help: "Upload the lunch menu PDF and it appears as a prominent button near the top of the page. Leave the PDF empty to hide the button.",
      blocks: [
        {
          key: "menu_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: LUNCH_DEFAULTS.menu_heading },
        },
        {
          key: "menu_intro",
          type: "text",
          label: "Intro line (optional)",
          defaultContent: { value: LUNCH_DEFAULTS.menu_intro },
        },
        {
          key: "menu_doc",
          type: "document",
          label: "Lunch menu PDF",
          help: "Upload a PDF (or pick one from the media library). The button links here.",
          defaultContent: {
            url: LUNCH_DEFAULTS.menu_url,
            label: LUNCH_DEFAULTS.menu_label,
          },
        },
      ],
    },
    {
      label: "Daily Lunch section",
      blocks: [
        {
          key: "overview_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: LUNCH_DEFAULTS.overview_heading },
        },
        {
          key: "overview",
          type: "richtext",
          label: "Body",
          defaultContent: { html: LUNCH_DEFAULTS.overview_html },
        },
        {
          key: "overview_image",
          type: "image",
          label: "Photo",
          aspectClass: "aspect-[4/3]",
          defaultContent: {
            url: LUNCH_DEFAULTS.overview_image_url,
            alt: LUNCH_DEFAULTS.overview_image_alt,
          },
        },
      ],
    },
    {
      label: "Snack Shack section",
      blocks: [
        {
          key: "snack_shack_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: LUNCH_DEFAULTS.snack_shack_heading },
        },
        {
          key: "snack_shack",
          type: "richtext",
          label: "Body",
          defaultContent: { html: LUNCH_DEFAULTS.snack_shack_html },
        },
      ],
    },
    {
      label: "Allergy Aware Kitchen callout",
      blocks: [
        {
          key: "allergy_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: LUNCH_DEFAULTS.allergy_heading },
        },
        {
          key: "allergy",
          type: "richtext",
          label: "Body",
          defaultContent: { html: LUNCH_DEFAULTS.allergy_html },
        },
      ],
    },
    {
      label: "Video section",
      blocks: [
        {
          key: "video_id",
          type: "text",
          label: "Vimeo ID",
          help: "The number from the Vimeo URL (e.g. 382946475). Leave empty to hide the video.",
          defaultContent: { value: LUNCH_DEFAULTS.video_id },
        },
        {
          key: "video_title",
          type: "text",
          label: "Video title (for accessibility)",
          defaultContent: { value: LUNCH_DEFAULTS.video_title },
        },
      ],
    },
  ],
};
