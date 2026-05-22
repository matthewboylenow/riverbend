import type { PageSchema } from "./types";
import { ACTIVITIES_DEFAULTS as D } from "@/lib/page-defaults/activities";

export const ACTIVITIES_SCHEMA: PageSchema = {
  slug: "activities",
  label: "Activities",
  publicHref: "/activities",
  sections: [
    {
      key: "page-header",
      label: "Page Header",
      blocks: [
        { key: "hero_title", type: "text", label: "Title", defaultContent: { value: D.hero_title } },
        { key: "hero_subtitle", type: "text", label: "Subtitle", defaultContent: { value: D.hero_subtitle } },
        { key: "hero_bg", type: "image", label: "Background image", aspectClass: "aspect-[16/6]", defaultContent: { url: D.hero_bg_url, alt: D.hero_bg_alt } },
      ],
    },
    {
      key: "intro",
      label: "Intro",
      blocks: [{ key: "intro", type: "richtext", defaultContent: { html: D.intro_html } }],
    },
    {
      key: "swimming",
      label: "Swimming section",
      blocks: [
        { key: "swimming_heading", type: "text", label: "Heading", defaultContent: { value: D.swimming_heading } },
        { key: "swimming", type: "richtext", label: "Body", defaultContent: { html: D.swimming_html } },
        { key: "swimming_image", type: "image", label: "Photo", aspectClass: "aspect-[4/3]", defaultContent: { url: D.swimming_image_url, alt: D.swimming_image_alt } },
        { key: "swimming_video_id", type: "text", label: "Vimeo ID (Aquatics)", help: "Leave empty to hide.", defaultContent: { value: D.swimming_video_id } },
      ],
    },
    {
      key: "sports",
      label: "Sports section",
      blocks: [
        { key: "sports_heading", type: "text", label: "Heading", defaultContent: { value: D.sports_heading } },
        { key: "sports", type: "richtext", label: "Body", defaultContent: { html: D.sports_html } },
        { key: "sports_image", type: "image", label: "Photo", aspectClass: "aspect-[4/3]", defaultContent: { url: D.sports_image_url, alt: D.sports_image_alt } },
        { key: "sports_button_label", type: "text", label: "Button label", defaultContent: { value: D.sports_button_label } },
        { key: "sports_video_id", type: "text", label: "Vimeo ID (Sports)", help: "Leave empty to hide.", defaultContent: { value: D.sports_video_id } },
      ],
    },
    {
      key: "more-activities",
      label: "More Activities cards",
      blocks: [
        { key: "more_activities_heading", type: "text", label: "Heading", defaultContent: { value: D.more_activities_heading } },
        {
          key: "activity_cards",
          type: "rows",
          label: "Cards",
          columns: [
            { key: "name", label: "Name", width: "260px" },
            { key: "image", label: "Image URL" },
          ],
          blank: { name: "", image: "" },
          defaultContent: { rows: D.activity_cards as unknown as Array<Record<string, string>> },
        },
        { key: "adventure_video_id", type: "text", label: "Adventure Course Vimeo ID", help: "Leave empty to hide.", defaultContent: { value: D.adventure_video_id } },
      ],
    },
    {
      key: "ninja",
      label: "Ninja Course section",
      blocks: [
        { key: "ninja_heading", type: "text", label: "Heading", defaultContent: { value: D.ninja_heading } },
        { key: "ninja_intro", type: "text", label: "Intro line", defaultContent: { value: D.ninja_intro } },
        {
          key: "ninja_elements",
          type: "rows",
          label: "Elements (chips)",
          columns: [{ key: "label", label: "Element name" }],
          blank: { label: "" },
          defaultContent: { rows: D.ninja_elements as unknown as Array<Record<string, string>> },
        },
      ],
    },
    {
      key: "performing-arts",
      label: "Performing Arts & Camper Choice (two columns)",
      blocks: [
        { key: "performing_heading", type: "text", label: "Performing Arts heading", defaultContent: { value: D.performing_heading } },
        { key: "performing", type: "richtext", label: "Performing Arts body", defaultContent: { html: D.performing_html } },
        { key: "choice_heading", type: "text", label: "Camper Choice heading", defaultContent: { value: D.choice_heading } },
        { key: "choice", type: "richtext", label: "Camper Choice body", defaultContent: { html: D.choice_html } },
      ],
    },
    {
      key: "indoor-facilities",
      label: "Indoor Facilities section",
      blocks: [
        { key: "indoor_heading", type: "text", label: "Heading", defaultContent: { value: D.indoor_heading } },
        { key: "indoor", type: "richtext", label: "Body", defaultContent: { html: D.indoor_html } },
      ],
    },
    {
      key: "learn-more",
      label: "Learn More cards",
      help: "Hrefs stay fixed (/programs, /rates-dates-application-2026, /sports); titles + images editable.",
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
