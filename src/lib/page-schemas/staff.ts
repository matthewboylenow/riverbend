import type { PageSchema } from "./types";
import { STAFF_DEFAULTS as D } from "@/lib/page-defaults/staff";

export const STAFF_SCHEMA: PageSchema = {
  slug: "staff",
  label: "Staff Info",
  publicHref: "/staff",
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
      blocks: [{ key: "overview", type: "richtext", defaultContent: { html: D.overview_html } }],
    },
    {
      label: "Videos (two side-by-side)",
      blocks: [
        { key: "video_1_heading", type: "text", label: "Video 1 — heading", defaultContent: { value: D.video_1_heading } },
        { key: "video_1_id", type: "text", label: "Video 1 — Vimeo ID", help: "Leave empty to hide.", defaultContent: { value: D.video_1_id } },
        { key: "video_2_heading", type: "text", label: "Video 2 — heading", defaultContent: { value: D.video_2_heading } },
        { key: "video_2_id", type: "text", label: "Video 2 — Vimeo ID", help: "Leave empty to hide.", defaultContent: { value: D.video_2_id } },
      ],
    },
    {
      label: "Why Camp Riverbend section",
      blocks: [
        { key: "why_heading", type: "text", label: "Heading", defaultContent: { value: D.why_heading } },
        { key: "why", type: "richtext", label: "Body", defaultContent: { html: D.why_html } },
      ],
    },
    {
      label: "Roles section",
      blocks: [
        { key: "roles_heading", type: "text", label: "Heading", defaultContent: { value: D.roles_heading } },
        { key: "roles_intro", type: "text", label: "Intro line below heading", defaultContent: { value: D.roles_intro } },
        {
          key: "roles",
          type: "rows",
          label: "Role cards",
          columns: [
            { key: "title", label: "Title", width: "220px" },
            { key: "description", label: "Description", multiline: true },
          ],
          blank: { title: "", description: "" },
          defaultContent: { rows: D.roles as unknown as Array<Record<string, string>> },
        },
      ],
    },
    {
      label: "Dates & Logistics",
      blocks: [
        { key: "logistics_heading", type: "text", label: "Heading", defaultContent: { value: D.logistics_heading } },
        { key: "logistics", type: "richtext", label: "Body", defaultContent: { html: D.logistics_html } },
      ],
    },
    {
      label: "Bottom CTA",
      blocks: [
        { key: "cta_heading", type: "text", label: "Heading", defaultContent: { value: D.cta_heading } },
        { key: "cta_button_label", type: "text", label: "Button label", defaultContent: { value: D.cta_button_label } },
        { key: "cta_phone_main_label", type: "text", label: "Main phone (display)", defaultContent: { value: D.cta_phone_main_label } },
        { key: "cta_phone_main_href", type: "text", label: "Main phone (link, e.g. tel:...)", defaultContent: { value: D.cta_phone_main_href } },
        { key: "cta_phone_text_label", type: "text", label: "Text phone (display)", defaultContent: { value: D.cta_phone_text_label } },
        { key: "cta_phone_text_href", type: "text", label: "Text phone (link)", defaultContent: { value: D.cta_phone_text_href } },
      ],
    },
  ],
};
