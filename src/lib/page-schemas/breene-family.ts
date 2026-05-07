import type { PageSchema } from "./types";
import { BREENE_FAMILY_DEFAULTS as D } from "@/lib/page-defaults/breene-family";

export const BREENE_FAMILY_SCHEMA: PageSchema = {
  slug: "breene-family",
  label: "Directors & Senior Staff",
  publicHref: "/breene-family",
  sections: [
    {
      label: "Page Header",
      blocks: [
        { key: "hero_title", type: "text", label: "Title", defaultContent: { value: D.hero_title } },
        { key: "hero_subtitle", type: "text", label: "Subtitle", defaultContent: { value: D.hero_subtitle } },
        { key: "hero_bg", type: "image", label: "Background image", aspectClass: "aspect-[16/6]", defaultContent: { url: D.hero_bg_url, alt: D.hero_bg_alt } },
        { key: "back_link_label", type: "text", label: "Back link label", defaultContent: { value: D.back_link_label } },
      ],
    },
    {
      label: "Section headings",
      help: "The actual staff cards are managed in /admin/staff. These are the section headings shown above each group.",
      blocks: [
        { key: "directors_heading", type: "text", label: "Directors heading", defaultContent: { value: D.directors_heading } },
        { key: "division_heads_heading", type: "text", label: "Division Heads heading", defaultContent: { value: D.division_heads_heading } },
        { key: "assistant_heads_heading", type: "text", label: "Assistant Division Heads heading", defaultContent: { value: D.assistant_heads_heading } },
      ],
    },
    {
      label: "Founders panel",
      help: "Shown only if at least one founder is active in /admin/staff.",
      blocks: [
        { key: "founders_caption", type: "text", label: "Caption (small red label)", defaultContent: { value: D.founders_caption } },
        { key: "founders_heading", type: "text", label: "Heading", defaultContent: { value: D.founders_heading } },
      ],
    },
  ],
};
