import type { PageSchema } from "./types";
import { HEALTH_SAFETY_DEFAULTS as D } from "@/lib/page-defaults/health-safety";

export const HEALTH_SAFETY_SCHEMA: PageSchema = {
  slug: "health-safety",
  label: "Health & Safety",
  publicHref: "/health-safety",
  sections: [
    {
      label: "Page Header",
      blocks: [
        { key: "hero_title", type: "text", label: "Title", defaultContent: { value: D.hero_title } },
        { key: "hero_subtitle", type: "text", label: "Subtitle", defaultContent: { value: D.hero_subtitle } },
        {
          key: "hero_bg",
          type: "image",
          label: "Background image",
          aspectClass: "aspect-[16/6]",
          defaultContent: { url: D.hero_bg_url, alt: D.hero_bg_alt },
        },
      ],
    },
    {
      label: "Overview",
      blocks: [
        { key: "overview", type: "richtext", defaultContent: { html: D.overview_html } },
      ],
    },
    {
      label: "Safety video",
      blocks: [
        {
          key: "safety_video_id",
          type: "text",
          label: "Vimeo ID",
          help: "Leave empty to hide the video.",
          defaultContent: { value: D.safety_video_id },
        },
      ],
    },
    {
      label: "Camp Nurse section",
      blocks: [
        { key: "nurse_heading", type: "text", label: "Heading", defaultContent: { value: D.nurse_heading } },
        { key: "nurse", type: "richtext", label: "Body", defaultContent: { html: D.nurse_html } },
        {
          key: "nurse_image",
          type: "image",
          label: "Photo",
          aspectClass: "aspect-[4/3]",
          defaultContent: { url: D.nurse_image_url, alt: D.nurse_image_alt },
        },
      ],
    },
    {
      label: "Safety Commitments cards",
      blocks: [
        {
          key: "safety_points_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: D.safety_points_heading },
        },
        {
          key: "safety_points",
          type: "rows",
          label: "Cards",
          columns: [
            { key: "heading", label: "Heading", width: "240px" },
            { key: "body", label: "Body", multiline: true },
          ],
          blank: { heading: "", body: "" },
          defaultContent: { rows: D.safety_points as unknown as Array<Record<string, string>> },
        },
      ],
    },
    {
      label: "Bottom CTA",
      blocks: [
        { key: "cta_text", type: "text", label: "Lead-in text", defaultContent: { value: D.cta_text } },
        { key: "cta_button_label", type: "text", label: "Button label", defaultContent: { value: D.cta_button_label } },
      ],
    },
  ],
};
