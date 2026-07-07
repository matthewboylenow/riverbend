import type { PageSchema } from "./types";
import { RATES_DEFAULTS } from "@/lib/page-defaults/rates-dates";

export const RATES_DATES_SCHEMA: PageSchema = {
  // NOTE: the slug is a stable DB content key — existing page_content rows
  // are stored under it. The public URL moved to the year-neutral
  // /rates-dates-application; only publicHref/route changed, never this slug.
  slug: "rates-dates-application-2026",
  label: "Rates, Dates & Application",
  publicHref: "/rates-dates-application",
  sections: [
    {
      key: "page-header",
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
      key: "intro",
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
      key: "tuition",
      label: "Tuition rates table 1",
      help: "Current season's rates. When the season ends, hide this section with the eye toggle — the content is kept, not deleted.",
      blocks: [
        {
          key: "tuition_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: RATES_DEFAULTS.tuition_heading },
        },
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
            rows: RATES_DEFAULTS.tuition_rows as unknown as Array<Record<string, string>>,
          },
        },
      ],
    },
    {
      key: "tuition-extras",
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
      key: "tuition-2",
      label: "Tuition rates table 2",
      help: "Second season's rates (e.g. next year). Stays off the public page while the table has no rows; use the eye toggle to hide/show it once filled in.",
      blocks: [
        {
          key: "tuition2_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: RATES_DEFAULTS.tuition2_heading },
        },
        {
          key: "tuition2_note",
          type: "text",
          label: "Note above table (orange banner)",
          help: "Leave empty to hide the banner.",
          placeholder: "(leave empty to hide)",
          defaultContent: { value: RATES_DEFAULTS.tuition2_note },
        },
        {
          key: "tuition2_rows",
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
            rows: RATES_DEFAULTS.tuition2_rows as unknown as Array<Record<string, string>>,
          },
        },
      ],
    },
    {
      key: "discounts",
      label: "Discounts 1",
      help: "Current season's discounts. Hide with the eye toggle when the season ends — content is kept, not deleted.",
      blocks: [
        {
          key: "discounts_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: RATES_DEFAULTS.discounts_heading },
        },
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
      key: "discounts-2",
      label: "Discounts 2",
      help: "Second season's discounts (e.g. next year). Stays off the public page while it has no rows.",
      blocks: [
        {
          key: "discounts2_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: RATES_DEFAULTS.discounts2_heading },
        },
        {
          key: "discounts2",
          type: "rows",
          columns: [
            { key: "heading", label: "Heading", width: "260px" },
            { key: "body", label: "Body", multiline: true },
          ],
          blank: { heading: "", body: "" },
          defaultContent: { rows: RATES_DEFAULTS.discounts2 as unknown as Array<Record<string, string>> },
        },
      ],
    },
    {
      key: "payment-schedule",
      label: "Payment schedule 1",
      help: "Current season's payment schedule. Hide with the eye toggle when the season ends.",
      blocks: [
        {
          key: "payment_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: RATES_DEFAULTS.payment_heading },
        },
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
    {
      key: "payment-schedule-2",
      label: "Payment schedule 2",
      help: "Second season's payment schedule (e.g. next year). Stays off the public page while it has no rows.",
      blocks: [
        {
          key: "payment2_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: RATES_DEFAULTS.payment2_heading },
        },
        {
          key: "payment_schedule2",
          type: "rows",
          columns: [
            { key: "label", label: "Label", width: "200px" },
            { key: "detail", label: "Detail", multiline: true },
          ],
          blank: { label: "", detail: "" },
          defaultContent: { rows: RATES_DEFAULTS.payment_schedule2 as unknown as Array<Record<string, string>> },
        },
      ],
    },
    {
      key: "payment-extras",
      label: "Bottom of page 1",
      help: "Free-form rich text shown below the payment schedule. Add headings, paragraphs, links, lists.",
      blocks: [
        {
          key: "payment_extras",
          type: "richtext",
          defaultContent: { html: RATES_DEFAULTS.payment_extras_html },
        },
      ],
    },
    {
      key: "payment-extras-2",
      label: "Bottom of page 2",
      help: "Second season's version (e.g. next year). Stays off the public page while empty.",
      blocks: [
        {
          key: "payment_extras2",
          type: "richtext",
          defaultContent: { html: RATES_DEFAULTS.payment_extras2_html },
        },
      ],
    },
    {
      key: "policies",
      label: "Policies 1",
      help: "Free-form heading + rich text. Drag to any position on the page.",
      blocks: [
        {
          key: "policies_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: "Policies" },
        },
        {
          key: "policies_body",
          type: "richtext",
          label: "Body",
          defaultContent: { html: "" },
        },
      ],
    },
    {
      key: "policies-2",
      label: "Policies 2",
      help: "Second season's policies (e.g. next year). Stays off the public page while the body is empty.",
      blocks: [
        {
          key: "policies2_heading",
          type: "text",
          label: "Heading",
          defaultContent: { value: RATES_DEFAULTS.policies2_heading },
        },
        {
          key: "policies2_body",
          type: "richtext",
          label: "Body",
          defaultContent: { html: RATES_DEFAULTS.policies2_body_html },
        },
      ],
    },
  ],
};
