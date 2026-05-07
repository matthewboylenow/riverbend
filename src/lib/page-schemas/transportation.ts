import type { PageSchema } from "./types";
import { TRANSPORTATION_DEFAULTS } from "@/lib/page-defaults/transportation";

export const TRANSPORTATION_SCHEMA: PageSchema = {
  slug: "transportation",
  label: "Transportation",
  publicHref: "/transportation",
  sections: [
    {
      label: "Page Header",
      blocks: [
        {
          key: "hero_title",
          type: "text",
          label: "Title",
          defaultContent: { value: TRANSPORTATION_DEFAULTS.hero_title },
        },
        {
          key: "hero_subtitle",
          type: "text",
          label: "Subtitle",
          defaultContent: { value: TRANSPORTATION_DEFAULTS.hero_subtitle },
        },
        {
          key: "hero_bg",
          type: "image",
          label: "Background image",
          aspectClass: "aspect-[16/6]",
          defaultContent: {
            url: TRANSPORTATION_DEFAULTS.hero_bg_url,
            alt: TRANSPORTATION_DEFAULTS.hero_bg_alt,
          },
        },
      ],
    },
    {
      label: "Overview section",
      blocks: [
        {
          key: "overview",
          type: "richtext",
          label: "Body",
          defaultContent: { html: TRANSPORTATION_DEFAULTS.overview_html },
        },
      ],
    },
    {
      label: "Bus Service section",
      blocks: [
        {
          key: "bus_service_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: TRANSPORTATION_DEFAULTS.bus_service_heading },
        },
        {
          key: "bus_service",
          type: "richtext",
          label: "Body",
          defaultContent: { html: TRANSPORTATION_DEFAULTS.bus_service_html },
        },
        {
          key: "bus_service_image",
          type: "image",
          label: "Photo",
          aspectClass: "aspect-[4/3]",
          defaultContent: {
            url: TRANSPORTATION_DEFAULTS.bus_service_image_url,
            alt: TRANSPORTATION_DEFAULTS.bus_service_image_alt,
          },
        },
      ],
    },
    {
      label: "Three-Quarter Day Transportation section",
      blocks: [
        {
          key: "three_quarter_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: TRANSPORTATION_DEFAULTS.three_quarter_heading },
        },
        {
          key: "three_quarter",
          type: "richtext",
          label: "Body",
          defaultContent: { html: TRANSPORTATION_DEFAULTS.three_quarter_html },
        },
      ],
    },
    {
      label: "Extended Day Program section",
      blocks: [
        {
          key: "extended_day_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: TRANSPORTATION_DEFAULTS.extended_day_heading },
        },
        {
          key: "extended_day",
          type: "richtext",
          label: "Body",
          defaultContent: { html: TRANSPORTATION_DEFAULTS.extended_day_html },
        },
      ],
    },
  ],
};
