import type { PageSchema } from "./types";
import { TESTIMONIALS_DEFAULTS as D } from "@/lib/page-defaults/testimonials";

export const TESTIMONIALS_SCHEMA: PageSchema = {
  slug: "testimonials",
  label: "Testimonials",
  publicHref: "/testimonials",
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
      label: "Camper quotes",
      blocks: [
        { key: "campers_heading", type: "text", label: "Heading", defaultContent: { value: D.campers_heading } },
        {
          key: "camper_quotes",
          type: "rows",
          label: "Quotes",
          columns: [{ key: "quote", label: "Quote", multiline: true }],
          blank: { quote: "" },
          defaultContent: { rows: D.camper_quotes as unknown as Array<Record<string, string>> },
        },
      ],
    },
    {
      label: "Parent quotes",
      blocks: [
        { key: "parents_heading", type: "text", label: "Heading", defaultContent: { value: D.parents_heading } },
        {
          key: "parent_quotes",
          type: "rows",
          label: "Quotes",
          columns: [
            { key: "quote", label: "Quote", multiline: true },
            { key: "name", label: "Name", width: "160px" },
            { key: "town", label: "Town", width: "160px" },
          ],
          blank: { quote: "", name: "", town: "" },
          defaultContent: { rows: D.parent_quotes as unknown as Array<Record<string, string>> },
        },
      ],
    },
    {
      label: "Bottom CTA",
      blocks: [
        { key: "cta_heading", type: "text", label: "Heading", defaultContent: { value: D.cta_heading } },
        { key: "cta_apply_label", type: "text", label: "Apply button label", defaultContent: { value: D.cta_apply_label } },
        { key: "cta_inquiry_label", type: "text", label: "Inquiry button label", defaultContent: { value: D.cta_inquiry_label } },
      ],
    },
  ],
};
