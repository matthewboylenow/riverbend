import type { PageSchema } from "./types";
import { CLUBHOUSE_DEFAULTS } from "@/lib/page-defaults/clubhouse";

export const CLUBHOUSE_SCHEMA: PageSchema = {
  slug: "clubhouse",
  label: "The Clubhouse",
  publicHref: "/clubhouse",
  sections: [
    {
      label: "Page Header",
      blocks: [
        {
          key: "hero_title",
          type: "text",
          label: "Title",
          defaultContent: { value: CLUBHOUSE_DEFAULTS.hero_title },
        },
        {
          key: "hero_subtitle",
          type: "text",
          label: "Subtitle",
          defaultContent: { value: CLUBHOUSE_DEFAULTS.hero_subtitle },
        },
        {
          key: "hero_bg",
          type: "image",
          label: "Background image",
          aspectClass: "aspect-[16/6]",
          defaultContent: {
            url: CLUBHOUSE_DEFAULTS.hero_bg_url,
            alt: CLUBHOUSE_DEFAULTS.hero_bg_alt,
          },
        },
      ],
    },
    {
      label: "Overview section",
      blocks: [
        {
          key: "overview_age_label",
          type: "text",
          label: "Age range pill (e.g. \"Ages 3-5\")",
          defaultContent: { value: CLUBHOUSE_DEFAULTS.overview_age_label },
        },
        {
          key: "overview",
          type: "richtext",
          label: "Body",
          defaultContent: { html: CLUBHOUSE_DEFAULTS.overview_html },
        },
      ],
    },
    {
      label: "Video section",
      blocks: [
        {
          key: "video_caption",
          type: "text",
          label: "Caption above video",
          defaultContent: { value: CLUBHOUSE_DEFAULTS.video_caption },
        },
        {
          key: "video_id",
          type: "text",
          label: "Vimeo ID",
          help: "The number from the Vimeo URL (e.g. 361307397). Leave empty to hide the video.",
          defaultContent: { value: CLUBHOUSE_DEFAULTS.video_id },
        },
        {
          key: "video_title",
          type: "text",
          label: "Video title (accessibility)",
          defaultContent: { value: CLUBHOUSE_DEFAULTS.video_title },
        },
      ],
    },
    {
      label: "Programs section (two columns)",
      blocks: [
        {
          key: "programs_three_quarter_heading",
          type: "text",
          label: "Column 1 — heading",
          defaultContent: {
            value: CLUBHOUSE_DEFAULTS.programs_three_quarter_heading,
          },
        },
        {
          key: "programs_three_quarter",
          type: "richtext",
          label: "Column 1 — body",
          defaultContent: {
            html: CLUBHOUSE_DEFAULTS.programs_three_quarter_html,
          },
        },
        {
          key: "programs_full_day_heading",
          type: "text",
          label: "Column 2 — heading",
          defaultContent: {
            value: CLUBHOUSE_DEFAULTS.programs_full_day_heading,
          },
        },
        {
          key: "programs_full_day",
          type: "richtext",
          label: "Column 2 — body",
          defaultContent: { html: CLUBHOUSE_DEFAULTS.programs_full_day_html },
        },
      ],
    },
    {
      label: "Supervision section",
      blocks: [
        {
          key: "supervision_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: CLUBHOUSE_DEFAULTS.supervision_heading },
        },
        {
          key: "supervision",
          type: "richtext",
          label: "Body",
          defaultContent: { html: CLUBHOUSE_DEFAULTS.supervision_html },
        },
        {
          key: "supervision_image",
          type: "image",
          label: "Photo",
          aspectClass: "aspect-[4/3]",
          defaultContent: {
            url: CLUBHOUSE_DEFAULTS.supervision_image_url,
            alt: CLUBHOUSE_DEFAULTS.supervision_image_alt,
          },
        },
      ],
    },
    {
      label: "Sample Schedules section",
      help: "PDF download links (hrefs) are fixed in the page; only the labels above each card are editable.",
      blocks: [
        {
          key: "schedules_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: CLUBHOUSE_DEFAULTS.schedules_heading },
        },
        {
          key: "schedules_intro",
          type: "text",
          label: "Intro line",
          defaultContent: { value: CLUBHOUSE_DEFAULTS.schedules_intro },
        },
        {
          key: "schedules_card_1_title",
          type: "text",
          label: "Card 1 — title",
          defaultContent: {
            value: CLUBHOUSE_DEFAULTS.schedules_card_1_title,
          },
        },
        {
          key: "schedules_card_1_subtitle",
          type: "text",
          label: "Card 1 — subtitle",
          defaultContent: {
            value: CLUBHOUSE_DEFAULTS.schedules_card_1_subtitle,
          },
        },
        {
          key: "schedules_card_2_title",
          type: "text",
          label: "Card 2 — title",
          defaultContent: {
            value: CLUBHOUSE_DEFAULTS.schedules_card_2_title,
          },
        },
        {
          key: "schedules_card_2_subtitle",
          type: "text",
          label: "Card 2 — subtitle",
          defaultContent: {
            value: CLUBHOUSE_DEFAULTS.schedules_card_2_subtitle,
          },
        },
      ],
    },
    {
      label: "Learn More cards (bottom of page)",
      help: "Three cards link to /programs, /activities, and /rates-dates-application respectively. The destination links stay fixed; only the title and image are editable.",
      blocks: [
        {
          key: "learn_more_1_title",
          type: "text",
          label: "Card 1 — title (Programs)",
          defaultContent: {
            value: CLUBHOUSE_DEFAULTS.learn_more_card_1_title,
          },
        },
        {
          key: "learn_more_1_image",
          type: "image",
          label: "Card 1 — image",
          aspectClass: "aspect-[4/3]",
          defaultContent: {
            url: CLUBHOUSE_DEFAULTS.learn_more_card_1_image,
            alt: "",
          },
        },
        {
          key: "learn_more_2_title",
          type: "text",
          label: "Card 2 — title (Activities)",
          defaultContent: {
            value: CLUBHOUSE_DEFAULTS.learn_more_card_2_title,
          },
        },
        {
          key: "learn_more_2_image",
          type: "image",
          label: "Card 2 — image",
          aspectClass: "aspect-[4/3]",
          defaultContent: {
            url: CLUBHOUSE_DEFAULTS.learn_more_card_2_image,
            alt: "",
          },
        },
        {
          key: "learn_more_3_title",
          type: "text",
          label: "Card 3 — title (Rates)",
          defaultContent: {
            value: CLUBHOUSE_DEFAULTS.learn_more_card_3_title,
          },
        },
        {
          key: "learn_more_3_image",
          type: "image",
          label: "Card 3 — image",
          aspectClass: "aspect-[4/3]",
          defaultContent: {
            url: CLUBHOUSE_DEFAULTS.learn_more_card_3_image,
            alt: "",
          },
        },
      ],
    },
  ],
};
