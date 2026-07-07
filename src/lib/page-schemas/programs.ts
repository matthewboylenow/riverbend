import type { PageSchema } from "./types";
import { PROGRAMS_DEFAULTS as D } from "@/lib/page-defaults/programs";

const programCardBlocks = (
  prefix: "clubhouse" | "riverbend" | "daytrippers",
  defaults: {
    badge: string;
    title: string;
    description: string;
    link_label: string;
    image_url: string;
    image_alt: string;
  }
) => [
  { key: `${prefix}_badge`, type: "text" as const, label: "Badge (e.g. age range)", defaultContent: { value: defaults.badge } },
  { key: `${prefix}_title`, type: "text" as const, label: "Title", defaultContent: { value: defaults.title } },
  { key: `${prefix}_description`, type: "richtext" as const, label: "Description", defaultContent: { html: `<p>${defaults.description}</p>` } },
  { key: `${prefix}_link_label`, type: "text" as const, label: "Button label", defaultContent: { value: defaults.link_label } },
  {
    key: `${prefix}_image`,
    type: "image" as const,
    label: "Photo",
    aspectClass: "aspect-[4/3]",
    defaultContent: { url: defaults.image_url, alt: defaults.image_alt },
  },
];

export const PROGRAMS_SCHEMA: PageSchema = {
  slug: "programs",
  label: "Programs",
  publicHref: "/programs",
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
      label: "Intro",
      blocks: [{ key: "intro", type: "richtext", defaultContent: { html: D.intro_html } }],
    },
    {
      label: "The Clubhouse card (links to /clubhouse)",
      blocks: programCardBlocks("clubhouse", {
        badge: D.clubhouse_badge,
        title: D.clubhouse_title,
        description: D.clubhouse_description,
        link_label: D.clubhouse_link_label,
        image_url: D.clubhouse_image_url,
        image_alt: D.clubhouse_image_alt,
      }),
    },
    {
      label: "Riverbend Experience card (links to /riverbend-experience)",
      blocks: programCardBlocks("riverbend", {
        badge: D.riverbend_badge,
        title: D.riverbend_title,
        description: D.riverbend_description,
        link_label: D.riverbend_link_label,
        image_url: D.riverbend_image_url,
        image_alt: D.riverbend_image_alt,
      }),
    },
    {
      label: "Day Trippers card (links to /day-trippers)",
      blocks: programCardBlocks("daytrippers", {
        badge: D.daytrippers_badge,
        title: D.daytrippers_title,
        description: D.daytrippers_description,
        link_label: D.daytrippers_link_label,
        image_url: D.daytrippers_image_url,
        image_alt: D.daytrippers_image_alt,
      }),
    },
    {
      label: "Learn More cards (bottom of page)",
      help: "Three cards link to /activities, /rates-dates-application, /about-riverbend respectively. Hrefs stay fixed; titles + images are editable.",
      blocks: [
        { key: "learn_more_heading", type: "text", label: "Heading", defaultContent: { value: D.learn_more_heading } },
        { key: "learn_more_1_title", type: "text", label: "Card 1 — title (Activities)", defaultContent: { value: D.learn_more_1_title } },
        {
          key: "learn_more_1_image",
          type: "image",
          label: "Card 1 — image",
          aspectClass: "aspect-[4/3]",
          defaultContent: { url: D.learn_more_1_image, alt: "" },
        },
        { key: "learn_more_2_title", type: "text", label: "Card 2 — title (Rates)", defaultContent: { value: D.learn_more_2_title } },
        {
          key: "learn_more_2_image",
          type: "image",
          label: "Card 2 — image",
          aspectClass: "aspect-[4/3]",
          defaultContent: { url: D.learn_more_2_image, alt: "" },
        },
        { key: "learn_more_3_title", type: "text", label: "Card 3 — title (About)", defaultContent: { value: D.learn_more_3_title } },
        {
          key: "learn_more_3_image",
          type: "image",
          label: "Card 3 — image",
          aspectClass: "aspect-[4/3]",
          defaultContent: { url: D.learn_more_3_image, alt: "" },
        },
      ],
    },
  ],
};
