import type { PageSchema, BlockSchema } from "./types";
import { HOME_DEFAULTS as D } from "@/lib/page-defaults/home";

const programCardBlocks = (n: 1 | 2 | 3): BlockSchema[] => {
  const idx = n - 1;
  const p = D.programs[idx];
  return [
    {
      key: `program_${n}_badge`,
      type: "text" as const,
      label: "Badge (e.g. age range)",
      defaultContent: { value: p.badge },
    },
    { key: `program_${n}_title`, type: "text" as const, label: "Title", defaultContent: { value: p.title } },
    {
      key: `program_${n}_description`,
      type: "richtext" as const,
      label: "Description",
      defaultContent: { html: `<p>${p.description}</p>` },
    },
    {
      key: `program_${n}_image`,
      type: "image" as const,
      label: "Photo",
      aspectClass: "aspect-[4/3]",
      defaultContent: { url: p.image_url, alt: p.image_alt },
    },
    {
      key: `program_${n}_link_1_label`,
      type: "text" as const,
      label: "Primary link label",
      defaultContent: { value: p.link_1_label },
    },
    {
      key: `program_${n}_link_1_href`,
      type: "text" as const,
      label: "Primary link URL",
      defaultContent: { value: p.link_1_href },
    },
    {
      key: `program_${n}_link_2_label`,
      type: "text" as const,
      label: "Secondary link label",
      defaultContent: { value: p.link_2_label },
    },
    {
      key: `program_${n}_link_2_href`,
      type: "text" as const,
      label: "Secondary link URL",
      defaultContent: { value: p.link_2_href },
    },
  ];
};

const bentoCardBlocks = (
  n: number,
  defaults: { title: string; subtitle: string; href: string; image_url: string; cta: string }
): BlockSchema[] => [
  {
    key: `bento_card_${n}_title`,
    type: "text" as const,
    label: "Title",
    defaultContent: { value: defaults.title },
  },
  {
    key: `bento_card_${n}_subtitle`,
    type: "text" as const,
    label: "Subtitle (leave empty to hide)",
    defaultContent: { value: defaults.subtitle },
  },
  {
    key: `bento_card_${n}_href`,
    type: "text" as const,
    label: "URL",
    defaultContent: { value: defaults.href },
  },
  {
    key: `bento_card_${n}_image`,
    type: "image" as const,
    label: "Image",
    aspectClass: "aspect-[4/3]",
    defaultContent: { url: defaults.image_url, alt: defaults.title },
  },
  {
    key: `bento_card_${n}_cta`,
    type: "text" as const,
    label: "CTA label (small text under title)",
    defaultContent: { value: defaults.cta },
  },
];

export const HOME_SCHEMA: PageSchema = {
  slug: "home",
  label: "Homepage",
  publicHref: "/",
  sections: [
    {
      label: "Hero",
      help: "The full-screen video hero at the top of the page. The fallback image shows when the video can't play.",
      blocks: [
        { key: "hero_overline", type: "text", label: "Overline (small text above headline)", defaultContent: { value: D.hero_overline } },
        { key: "hero_headline_1", type: "text", label: "Headline — line 1", defaultContent: { value: D.hero_headline_1 } },
        { key: "hero_headline_2", type: "text", label: "Headline — line 2 (lighter color)", defaultContent: { value: D.hero_headline_2 } },
        { key: "hero_subtitle", type: "text", label: "Subtitle paragraph", defaultContent: { value: D.hero_subtitle } },
        { key: "hero_primary_cta_label", type: "text", label: "Primary button label", defaultContent: { value: D.hero_primary_cta_label } },
        { key: "hero_primary_cta_href", type: "text", label: "Primary button URL", defaultContent: { value: D.hero_primary_cta_href } },
        { key: "hero_secondary_cta_label", type: "text", label: "Secondary button label", help: "Opens the inquiry form (URL fixed).", defaultContent: { value: D.hero_secondary_cta_label } },
        {
          key: "hero_fallback_image",
          type: "image",
          label: "Fallback image (used when video can't play)",
          aspectClass: "aspect-[16/9]",
          defaultContent: { url: D.hero_fallback_image_url, alt: D.hero_fallback_image_alt },
        },
      ],
    },
    {
      label: "Announcement bar (red bar below hero)",
      blocks: [
        { key: "announcement_message", type: "text", label: "Message", defaultContent: { value: D.announcement_message } },
        { key: "announcement_link_text", type: "text", label: "Link text", defaultContent: { value: D.announcement_link_text } },
        { key: "announcement_link_href", type: "text", label: "Link URL", defaultContent: { value: D.announcement_link_href } },
      ],
    },
    {
      label: "Bento Grid — featured large card (top-left)",
      blocks: bentoCardBlocks(0, D.bento_card_0),
    },
    {
      label: "Bento Grid — Activities (top-right)",
      blocks: bentoCardBlocks(1, D.bento_card_1),
    },
    {
      label: "Bento Grid — countdown tile",
      help: "The red countdown tile that counts down to the first day of camp.",
      blocks: [
        { key: "bento_countdown_label", type: "text", label: "Caption (above the timer)", defaultContent: { value: D.bento_countdown_label } },
        {
          key: "bento_countdown_target",
          type: "text",
          label: "Target date (ISO format, e.g. 2026-06-29T09:00:00)",
          help: "When the countdown should hit zero.",
          defaultContent: { value: D.bento_countdown_target },
        },
        { key: "bento_countdown_href", type: "text", label: "Click destination URL", defaultContent: { value: D.bento_countdown_href } },
      ],
    },
    {
      label: "Bento Grid — stat tile",
      help: "The green stat tile (e.g. 64 Years of Tradition).",
      blocks: [
        { key: "bento_stat_number", type: "text", label: "Big number", defaultContent: { value: D.bento_stat_number } },
        { key: "bento_stat_label", type: "text", label: "Label below number", defaultContent: { value: D.bento_stat_label } },
        { key: "bento_stat_href", type: "text", label: "Click destination URL", defaultContent: { value: D.bento_stat_href } },
      ],
    },
    { label: "Bento Grid — Rates & Dates", blocks: bentoCardBlocks(4, D.bento_card_4) },
    { label: "Bento Grid — Legacy & Tradition", blocks: bentoCardBlocks(5, D.bento_card_5) },
    { label: "Bento Grid — Video Library", blocks: bentoCardBlocks(6, D.bento_card_6) },
    { label: "Bento Grid — Transportation", blocks: bentoCardBlocks(7, D.bento_card_7) },
    { label: "Bento Grid — Lunch & Snacks", blocks: bentoCardBlocks(8, D.bento_card_8) },
    { label: "Bento Grid — Health & Safety", blocks: bentoCardBlocks(9, D.bento_card_9) },
    { label: "Bento Grid — Camp Map", blocks: bentoCardBlocks(10, D.bento_card_10) },
    {
      label: "Philosophy section (dark band)",
      blocks: [
        { key: "philosophy_caption", type: "text", label: "Caption (small white label)", defaultContent: { value: D.philosophy_caption } },
        {
          key: "philosophy_heading",
          type: "richtext",
          label: "Heading (use italic to emphasize)",
          help: 'e.g. \'"Confidence, <em>not</em> Competition"\'',
          defaultContent: { html: D.philosophy_heading_html },
        },
        { key: "philosophy_body", type: "text", label: "Body paragraph", defaultContent: { value: D.philosophy_body } },
        { key: "philosophy_story_label", type: "text", label: "Left button label", defaultContent: { value: D.philosophy_story_label } },
        { key: "philosophy_story_href", type: "text", label: "Left button URL", defaultContent: { value: D.philosophy_story_href } },
        { key: "philosophy_tour_label", type: "text", label: "Right button label", help: "Opens the inquiry form (URL fixed).", defaultContent: { value: D.philosophy_tour_label } },
      ],
    },
    {
      label: "Programs section heading",
      blocks: [
        { key: "programs_caption", type: "text", label: "Caption (small red label)", defaultContent: { value: D.programs_caption } },
        { key: "programs_heading", type: "text", label: "Heading", defaultContent: { value: D.programs_heading } },
      ],
    },
    { label: "Program 1 — The Clubhouse", blocks: programCardBlocks(1) },
    { label: "Program 2 — Riverbend Experience", blocks: programCardBlocks(2) },
    { label: "Program 3 — Day Trippers", blocks: programCardBlocks(3) },
  ],
};
