import type { PageSchema } from "./types";
import { CAMP_RIVERBEND_APP_DEFAULTS as D } from "@/lib/page-defaults/camp-riverbend-app";

export const CAMP_RIVERBEND_APP_SCHEMA: PageSchema = {
  slug: "camp-riverbend-app",
  label: "Camp Riverbend App",
  publicHref: "/camp-riverbend-app",
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
      label: "How to Get It",
      blocks: [
        { key: "download_heading", type: "text", label: "Heading", defaultContent: { value: D.download_heading } },
        { key: "download", type: "richtext", label: "Body", defaultContent: { html: D.download_html } },
        { key: "app_store_url", type: "text", label: "App Store URL", defaultContent: { value: D.app_store_url } },
        {
          key: "app_store_badge",
          type: "image",
          label: "App Store badge image",
          aspectClass: "aspect-[3/1]",
          defaultContent: { url: D.app_store_badge_url, alt: "Download on the App Store" },
        },
        { key: "google_play_url", type: "text", label: "Google Play URL", defaultContent: { value: D.google_play_url } },
        {
          key: "google_play_badge",
          type: "image",
          label: "Google Play badge image",
          aspectClass: "aspect-[3/1]",
          defaultContent: { url: D.google_play_badge_url, alt: "Get it on Google Play" },
        },
      ],
    },
    {
      label: "App Features",
      blocks: [
        { key: "features_heading", type: "text", label: "Heading", defaultContent: { value: D.features_heading } },
        {
          key: "features",
          type: "rows",
          label: "Feature cards",
          columns: [
            { key: "title", label: "Title", width: "220px" },
            { key: "description", label: "Description", multiline: true },
          ],
          blank: { title: "", description: "" },
          defaultContent: { rows: D.features as unknown as Array<Record<string, string>> },
        },
      ],
    },
  ],
};
