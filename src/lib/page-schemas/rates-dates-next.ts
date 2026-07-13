import type { PageSchema } from "./types";
import { RATES_NEXT_DEFAULTS } from "@/lib/page-defaults/rates-dates-next";

/**
 * Next-season rates page. A full standalone copy of the rates page so
 * next year's tuition, discounts, payment schedule, and policies live on
 * their own URL instead of sharing a page with the current season.
 *
 * The slug is deliberately year-neutral ("-next") so this DB content
 * container can be reused season after season — only the public URL
 * (publicHref + the route directory) carries the year, and updating
 * those is a one-line change at rollover.
 */
export const RATES_DATES_NEXT_SCHEMA: PageSchema = {
  slug: "rates-dates-application-next",
  label: "Rates, Dates & Application — 2027",
  publicHref: "/rates-dates-application-2027",
  sections: [
    {
      key: "page-header",
      label: "Page Header",
      blocks: [
        {
          key: "hero_title",
          type: "text",
          label: "Title",
          defaultContent: { value: RATES_NEXT_DEFAULTS.hero_title },
        },
        {
          key: "hero_subtitle",
          type: "text",
          label: "Subtitle",
          defaultContent: { value: RATES_NEXT_DEFAULTS.hero_subtitle },
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
      key: "intro",
      label: "Intro paragraphs",
      help: "Shown with an Apply Now button. Leave empty to hide the whole section.",
      blocks: [
        {
          key: "intro",
          type: "richtext",
          defaultContent: { html: RATES_NEXT_DEFAULTS.intro_html },
        },
      ],
    },
    {
      key: "tuition",
      label: "Tuition rates table",
      help: "Stays off the public page while the table has no rows.",
      blocks: [
        {
          key: "tuition_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: RATES_NEXT_DEFAULTS.tuition_heading },
        },
        {
          key: "tuition_note",
          type: "text",
          label: "Note above table (orange banner)",
          help: "Leave empty to hide the banner.",
          placeholder: "(leave empty to hide)",
          defaultContent: { value: RATES_NEXT_DEFAULTS.tuition_note },
        },
        {
          key: "tuition_rows",
          type: "table",
          label: "Tuition table",
          help: "Edit column headers, add/remove columns, drag rows to reorder.",
          defaultContent: {
            columns: [
              { key: "duration", label: "Duration" },
              { key: "inCamp", label: "In Camp" },
              { key: "dayTripper", label: "Day Tripper" },
              { key: "threeQuarter", label: "Three-Quarter Day" },
            ],
            rows: RATES_NEXT_DEFAULTS.tuition_rows as unknown as Array<Record<string, string>>,
          },
        },
      ],
    },
    {
      key: "tuition-extras",
      label: "Below tuition table",
      help: "Free-form area for footnotes, headings, additional copy. Leave empty to hide.",
      blocks: [
        {
          key: "tuition_extras",
          type: "richtext",
          defaultContent: { html: RATES_NEXT_DEFAULTS.tuition_extras_html },
        },
      ],
    },
    {
      key: "discounts",
      label: "Discounts",
      help: "Stays off the public page while it has no rows.",
      blocks: [
        {
          key: "discounts_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: RATES_NEXT_DEFAULTS.discounts_heading },
        },
        {
          key: "discounts",
          type: "rows",
          columns: [
            { key: "heading", label: "Heading", width: "260px" },
            { key: "body", label: "Body", multiline: true },
          ],
          blank: { heading: "", body: "" },
          defaultContent: { rows: RATES_NEXT_DEFAULTS.discounts as unknown as Array<Record<string, string>> },
        },
      ],
    },
    {
      key: "payment-schedule",
      label: "Payment schedule",
      help: "Stays off the public page while it has no rows.",
      blocks: [
        {
          key: "payment_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: RATES_NEXT_DEFAULTS.payment_heading },
        },
        {
          key: "payment_schedule",
          type: "rows",
          columns: [
            { key: "label", label: "Label", width: "200px" },
            { key: "detail", label: "Detail", multiline: true },
          ],
          blank: { label: "", detail: "" },
          defaultContent: { rows: RATES_NEXT_DEFAULTS.payment_schedule as unknown as Array<Record<string, string>> },
        },
      ],
    },
    {
      key: "payment-extras",
      label: "Bottom of page",
      help: "Free-form rich text shown below the payment schedule. Leave empty to hide.",
      blocks: [
        {
          key: "payment_extras",
          type: "richtext",
          defaultContent: { html: RATES_NEXT_DEFAULTS.payment_extras_html },
        },
      ],
    },
    {
      key: "policies",
      label: "Policies",
      help: "Free-form heading + rich text. Stays off the public page while the body is empty.",
      blocks: [
        {
          key: "policies_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: RATES_NEXT_DEFAULTS.policies_heading },
        },
        {
          key: "policies_body",
          type: "richtext",
          label: "Body",
          defaultContent: { html: RATES_NEXT_DEFAULTS.policies_body_html },
        },
      ],
    },
  ],
};
