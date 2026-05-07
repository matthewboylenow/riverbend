import type { PageSchema } from "./types";
import { DAY_TRIPPERS_DEFAULTS as D } from "@/lib/page-defaults/day-trippers";

export const DAY_TRIPPERS_SCHEMA: PageSchema = {
  slug: "day-trippers",
  label: "Day Trippers",
  publicHref: "/day-trippers",
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
        { key: "overview_badge", type: "text", label: "Badge (e.g. age range)", defaultContent: { value: D.overview_badge } },
        { key: "overview_heading", type: "text", label: "Heading", defaultContent: { value: D.overview_heading } },
        { key: "overview", type: "richtext", label: "Body", defaultContent: { html: D.overview_html } },
      ],
    },
    {
      label: "Program section",
      blocks: [
        { key: "program_heading", type: "text", label: "Heading", defaultContent: { value: D.program_heading } },
        { key: "program", type: "richtext", label: "Body", defaultContent: { html: D.program_html } },
        { key: "program_image", type: "image", label: "Photo", aspectClass: "aspect-[4/3]", defaultContent: { url: D.program_image_url, alt: D.program_image_alt } },
      ],
    },
    {
      label: "Video",
      blocks: [
        { key: "video_caption", type: "text", label: "Caption", defaultContent: { value: D.video_caption } },
        { key: "video_id", type: "text", label: "Vimeo ID", help: "Leave empty to hide.", defaultContent: { value: D.video_id } },
      ],
    },
    {
      label: "Supervision section",
      blocks: [
        { key: "supervision_heading", type: "text", label: "Heading", defaultContent: { value: D.supervision_heading } },
        { key: "supervision", type: "richtext", label: "Body", defaultContent: { html: D.supervision_html } },
        { key: "supervision_image", type: "image", label: "Photo", aspectClass: "aspect-[4/3]", defaultContent: { url: D.supervision_image_url, alt: D.supervision_image_alt } },
        { key: "supervision_button_label", type: "text", label: "Apply button label", defaultContent: { value: D.supervision_button_label } },
      ],
    },
    {
      label: "2026 Calendar section",
      blocks: [
        { key: "calendar_heading", type: "text", label: "Heading", defaultContent: { value: D.calendar_heading } },
        { key: "calendar_subheading", type: "text", label: "Subheading", defaultContent: { value: D.calendar_subheading } },
        { key: "calendar_image", type: "image", label: "Calendar image", aspectClass: "aspect-[4/5]", defaultContent: { url: D.calendar_image_url, alt: D.calendar_image_alt } },
      ],
    },
    {
      label: "Learn More cards",
      help: "Hrefs stay fixed (/programs, /activities, /rates-dates-application-2026); titles + images are editable.",
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
