import type { PageSchema } from "./types";
import { RATES_DEFAULTS } from "@/lib/page-defaults/rates-dates";

export const RATES_DATES_SCHEMA: PageSchema = {
  slug: "rates-dates-application-2026",
  label: "Rates, Dates & Application",
  publicHref: "/rates-dates-application-2026",
  sections: [
    {
      label: "Page Header",
      blocks: [
        {
          key: "hero_title",
          type: "text",
          label: "Title",
          defaultContent: { value: RATES_DEFAULTS.hero_title },
        },
        {
          key: "hero_subtitle",
          type: "text",
          label: "Subtitle",
          defaultContent: { value: RATES_DEFAULTS.hero_subtitle },
        },
        {
          key: "hero_bg",
          type: "image",
          label: "Background image",
          aspectClass: "aspect-[16/6]",
          defaultContent: { url: "/assets/site/Canoe.jpg", alt: "" },
        },
      ],
    },
    {
      label: "Intro paragraphs",
      blocks: [
        {
          key: "intro",
          type: "richtext",
          defaultContent: { html: RATES_DEFAULTS.intro_html },
        },
      ],
    },
    {
      label: "Tuition rates table",
      blocks: [
        {
          key: "tuition_note",
          type: "text",
          label: "Note above table (orange banner)",
          help: "Leave empty to hide the banner.",
          placeholder: "(leave empty to hide)",
          defaultContent: { value: RATES_DEFAULTS.tuition_note },
        },
        {
          key: "tuition_rows",
          type: "rows",
          columns: [
            { key: "duration", label: "Duration" },
            { key: "inCamp", label: "In Camp" },
            { key: "dayTripper", label: "Day Tripper" },
            { key: "threeQuarter", label: "Three-Quarter Day" },
          ],
          blank: { duration: "", inCamp: "", dayTripper: "", threeQuarter: "" },
          defaultContent: { rows: RATES_DEFAULTS.tuition_rows as unknown as Array<Record<string, string>> },
        },
      ],
    },
    {
      label: "Below tuition table",
      help: "Free-form area for footnotes, headings, additional copy.",
      blocks: [
        {
          key: "tuition_extras",
          type: "richtext",
          defaultContent: { html: RATES_DEFAULTS.tuition_extras_html },
        },
      ],
    },
    {
      label: "Discounts",
      blocks: [
        {
          key: "discounts",
          type: "rows",
          columns: [
            { key: "heading", label: "Heading", width: "260px" },
            { key: "body", label: "Body", multiline: true },
          ],
          blank: { heading: "", body: "" },
          defaultContent: { rows: RATES_DEFAULTS.discounts as unknown as Array<Record<string, string>> },
        },
      ],
    },
    {
      label: "Payment schedule",
      blocks: [
        {
          key: "payment_schedule",
          type: "rows",
          columns: [
            { key: "label", label: "Label", width: "200px" },
            { key: "detail", label: "Detail", multiline: true },
          ],
          blank: { label: "", detail: "" },
          defaultContent: { rows: RATES_DEFAULTS.payment_schedule as unknown as Array<Record<string, string>> },
        },
      ],
    },
  ],
};
