import type { PageSchema } from "./types";
import { SPORTS_DEFAULTS as D } from "@/lib/page-defaults/sports";

export const SPORTS_SCHEMA: PageSchema = {
  slug: "sports",
  label: "Sports",
  publicHref: "/sports",
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
      label: "Intro",
      blocks: [{ key: "intro", type: "richtext", defaultContent: { html: D.intro_html } }],
    },
    {
      label: "Sports cards",
      help: "Each row is one sport tile. Image URL must be a path from the media library (or /assets/...).",
      blocks: [
        {
          key: "sports",
          type: "rows",
          label: "Cards",
          columns: [
            { key: "name", label: "Name", width: "180px" },
            { key: "image", label: "Image URL" },
            { key: "description", label: "Description", multiline: true },
          ],
          blank: { name: "", image: "", description: "" },
          defaultContent: { rows: D.sports as unknown as Array<Record<string, string>> },
        },
      ],
    },
    {
      label: "Sports video",
      blocks: [
        { key: "video_id", type: "text", label: "Vimeo ID", help: "Leave empty to hide.", defaultContent: { value: D.video_id } },
        { key: "video_title", type: "text", label: "Video title", defaultContent: { value: D.video_title } },
      ],
    },
    {
      label: "Learn More cards",
      help: "Hrefs stay fixed (/activities, /programs, /rates-dates-application-2026); titles + images are editable.",
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
