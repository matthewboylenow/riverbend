import type { PageSchema } from "./types";
import { RIVERBEND_EXPERIENCE_DEFAULTS as D } from "@/lib/page-defaults/riverbend-experience";

export const RIVERBEND_EXPERIENCE_SCHEMA: PageSchema = {
  slug: "riverbend-experience",
  label: "Riverbend Experience",
  publicHref: "/riverbend-experience",
  sections: [
    {
      label: "Page Header",
      blocks: [
        { key: "hero_title", type: "text", label: "Title", defaultContent: { value: D.hero_title } },
        { key: "hero_subtitle", type: "text", label: "Subtitle", defaultContent: { value: D.hero_subtitle } },
        { key: "hero_bg", type: "image", label: "Background image", aspectClass: "aspect-[16/6]", defaultContent: { url: D.hero_bg_url, alt: D.hero_bg_alt } },
      ],
    },
    {
      label: "Overview",
      blocks: [
        { key: "overview_badge", type: "text", label: "Badge", defaultContent: { value: D.overview_badge } },
        { key: "overview", type: "richtext", label: "Body", defaultContent: { html: D.overview_html } },
      ],
    },
    {
      label: "Video",
      blocks: [
        { key: "video_caption", type: "text", label: "Caption above video", defaultContent: { value: D.video_caption } },
        { key: "video_id", type: "text", label: "Vimeo ID", help: "Leave empty to hide.", defaultContent: { value: D.video_id } },
        { key: "video_title", type: "text", label: "Video title", defaultContent: { value: D.video_title } },
      ],
    },
    {
      label: "A Typical Day",
      blocks: [
        { key: "typical_day_heading", type: "text", label: "Heading", defaultContent: { value: D.typical_day_heading } },
        { key: "typical_day", type: "richtext", label: "Body", defaultContent: { html: D.typical_day_html } },
        { key: "typical_day_image", type: "image", label: "Photo", aspectClass: "aspect-[4/3]", defaultContent: { url: D.typical_day_image_url, alt: D.typical_day_image_alt } },
      ],
    },
    {
      label: "Supervision",
      blocks: [
        { key: "supervision_heading", type: "text", label: "Heading", defaultContent: { value: D.supervision_heading } },
        { key: "supervision", type: "richtext", label: "Body", defaultContent: { html: D.supervision_html } },
        { key: "supervision_image", type: "image", label: "Photo", aspectClass: "aspect-[4/3]", defaultContent: { url: D.supervision_image_url, alt: D.supervision_image_alt } },
      ],
    },
    {
      label: "Sample Schedules",
      help: "PDFs the schedule tiles link to. Edit hrefs to swap PDFs (use /admin/media or /admin/documents to upload new).",
      blocks: [
        { key: "schedules_heading", type: "text", label: "Heading", defaultContent: { value: D.schedules_heading } },
        { key: "schedules_subheading", type: "text", label: "Subheading", defaultContent: { value: D.schedules_subheading } },
        {
          key: "schedules",
          type: "rows",
          label: "Schedule tiles",
          columns: [
            { key: "label", label: "Label", width: "260px" },
            { key: "href", label: "URL (PDF)" },
          ],
          blank: { label: "", href: "" },
          defaultContent: { rows: D.schedules as unknown as Array<Record<string, string>> },
        },
      ],
    },
    {
      label: "Learn More cards",
      help: "Hrefs stay fixed; titles + images editable.",
      blocks: [
        { key: "learn_more_heading", type: "text", label: "Heading", defaultContent: { value: D.learn_more_heading } },
        { key: "learn_more_1_title", type: "text", label: "Card 1 — title", defaultContent: { value: D.learn_more_1_title } },
        { key: "learn_more_1_image", type: "image", label: "Card 1 — image", aspectClass: "aspect-[4/3]", defaultContent: { url: D.learn_more_1_image, alt: "" } },
        { key: "learn_more_2_title", type: "text", label: "Card 2 — title", defaultContent: { value: D.learn_more_2_title } },
        { key: "learn_more_2_image", type: "image", label: "Card 2 — image", aspectClass: "aspect-[4/3]", defaultContent: { url: D.learn_more_2_image, alt: "" } },
        { key: "learn_more_3_title", type: "text", label: "Card 3 — title", defaultContent: { value: D.learn_more_3_title } },
        { key: "learn_more_3_image", type: "image", label: "Card 3 — image", aspectClass: "aspect-[4/3]", defaultContent: { url: D.learn_more_3_image, alt: "" } },
      ],
    },
  ],
};
