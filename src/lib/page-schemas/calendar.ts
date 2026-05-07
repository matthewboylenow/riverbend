import type { PageSchema } from "./types";
import { CALENDAR_DEFAULTS } from "@/lib/page-defaults/calendar";

export const CALENDAR_SCHEMA: PageSchema = {
  slug: "calendar",
  label: "Calendar",
  publicHref: "/calendar",
  sections: [
    {
      label: "Page Header",
      blocks: [
        {
          key: "hero_title",
          type: "text",
          label: "Title",
          defaultContent: { value: CALENDAR_DEFAULTS.hero_title },
        },
        {
          key: "hero_subtitle",
          type: "text",
          label: "Subtitle",
          defaultContent: { value: CALENDAR_DEFAULTS.hero_subtitle },
        },
        {
          key: "hero_bg",
          type: "image",
          label: "Background image",
          aspectClass: "aspect-[16/6]",
          defaultContent: {
            url: CALENDAR_DEFAULTS.hero_bg_url,
            alt: CALENDAR_DEFAULTS.hero_bg_alt,
          },
        },
      ],
    },
    {
      label: "Program calendar image",
      help: "The poster-style program calendar shown at the top of the page. The \"View full size\" link points at this same image.",
      blocks: [
        {
          key: "calendar_image",
          type: "image",
          label: "Calendar image",
          aspectClass: "aspect-[3/4]",
          defaultContent: {
            url: CALENDAR_DEFAULTS.calendar_image_url,
            alt: CALENDAR_DEFAULTS.calendar_image_alt,
          },
        },
      ],
    },
    {
      label: "Key Dates",
      blocks: [
        {
          key: "key_dates_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: CALENDAR_DEFAULTS.key_dates_heading },
        },
        {
          key: "key_dates",
          type: "rows",
          label: "Dates",
          columns: [
            { key: "date", label: "Date", width: "200px" },
            { key: "event", label: "Event", multiline: true },
          ],
          blank: { date: "", event: "" },
          defaultContent: {
            rows: CALENDAR_DEFAULTS.key_dates as unknown as Array<Record<string, string>>,
          },
        },
      ],
    },
    {
      label: "Carnival & Special Days video",
      blocks: [
        {
          key: "carnival_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: CALENDAR_DEFAULTS.carnival_heading },
        },
        {
          key: "carnival_video_id",
          type: "text",
          label: "Vimeo ID",
          help: "The number from the Vimeo URL (e.g. 382946042). Leave empty to hide the video.",
          defaultContent: { value: CALENDAR_DEFAULTS.carnival_video_id },
        },
      ],
    },
  ],
};
