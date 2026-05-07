import type { PageSchema } from "./types";
import { VIDEOS_DEFAULTS } from "@/lib/page-defaults/videos";

export const VIDEOS_SCHEMA: PageSchema = {
  slug: "videos",
  label: "Videos",
  publicHref: "/videos",
  sections: [
    {
      label: "Page Header",
      blocks: [
        {
          key: "hero_title",
          type: "text",
          label: "Title",
          defaultContent: { value: VIDEOS_DEFAULTS.hero_title },
        },
        {
          key: "hero_subtitle",
          type: "text",
          label: "Subtitle",
          defaultContent: { value: VIDEOS_DEFAULTS.hero_subtitle },
        },
        {
          key: "hero_bg",
          type: "image",
          label: "Background image",
          aspectClass: "aspect-[16/6]",
          defaultContent: {
            url: VIDEOS_DEFAULTS.hero_bg_url,
            alt: VIDEOS_DEFAULTS.hero_bg_alt,
          },
        },
      ],
    },
    {
      label: "Video grid",
      help: "Each row is one video tile. Vimeo ID is the number from the video's Vimeo URL (e.g. 383347420). Rows with an empty Vimeo ID are skipped.",
      blocks: [
        {
          key: "videos",
          type: "rows",
          label: "Videos",
          columns: [
            { key: "title", label: "Title" },
            { key: "vimeoId", label: "Vimeo ID", width: "200px" },
          ],
          blank: { title: "", vimeoId: "" },
          defaultContent: {
            rows: VIDEOS_DEFAULTS.videos as unknown as Array<Record<string, string>>,
          },
        },
      ],
    },
  ],
};
