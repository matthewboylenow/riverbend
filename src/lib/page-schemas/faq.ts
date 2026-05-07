import type { PageSchema } from "./types";
import { FAQ_DEFAULTS as D } from "@/lib/page-defaults/faq";

const qaColumns = [
  { key: "question", label: "Question", multiline: true },
  { key: "answer", label: "Answer", multiline: true },
];
const qaBlank = { question: "", answer: "" };

export const FAQ_SCHEMA: PageSchema = {
  slug: "faq",
  label: "FAQ",
  publicHref: "/faq",
  sections: [
    {
      label: "Page Header",
      blocks: [
        { key: "hero_title", type: "text", label: "Title", defaultContent: { value: D.hero_title } },
        { key: "hero_subtitle", type: "text", label: "Subtitle", defaultContent: { value: D.hero_subtitle } },
        { key: "hero_bg", type: "image", label: "Background image", aspectClass: "aspect-[16/6]", defaultContent: { url: D.hero_bg_url, alt: D.hero_bg_alt } },
      ],
    },
    {
      label: "Registration category",
      blocks: [
        { key: "cat_registration_heading", type: "text", label: "Heading", defaultContent: { value: D.cat_registration_heading } },
        {
          key: "cat_registration",
          type: "rows",
          label: "Q&A",
          columns: qaColumns,
          blank: qaBlank,
          defaultContent: { rows: D.cat_registration as unknown as Array<Record<string, string>> },
        },
      ],
    },
    {
      label: "Transportation category",
      blocks: [
        { key: "cat_transportation_heading", type: "text", label: "Heading", defaultContent: { value: D.cat_transportation_heading } },
        {
          key: "cat_transportation",
          type: "rows",
          label: "Q&A",
          columns: qaColumns,
          blank: qaBlank,
          defaultContent: { rows: D.cat_transportation as unknown as Array<Record<string, string>> },
        },
      ],
    },
    {
      label: "Staff & Groups category",
      blocks: [
        { key: "cat_staff_heading", type: "text", label: "Heading", defaultContent: { value: D.cat_staff_heading } },
        {
          key: "cat_staff",
          type: "rows",
          label: "Q&A",
          columns: qaColumns,
          blank: qaBlank,
          defaultContent: { rows: D.cat_staff as unknown as Array<Record<string, string>> },
        },
      ],
    },
    {
      label: "Camp Activities category",
      blocks: [
        { key: "cat_activities_heading", type: "text", label: "Heading", defaultContent: { value: D.cat_activities_heading } },
        {
          key: "cat_activities",
          type: "rows",
          label: "Q&A",
          columns: qaColumns,
          blank: qaBlank,
          defaultContent: { rows: D.cat_activities as unknown as Array<Record<string, string>> },
        },
      ],
    },
    {
      label: "Food category",
      blocks: [
        { key: "cat_food_heading", type: "text", label: "Heading", defaultContent: { value: D.cat_food_heading } },
        {
          key: "cat_food",
          type: "rows",
          label: "Q&A",
          columns: qaColumns,
          blank: qaBlank,
          defaultContent: { rows: D.cat_food as unknown as Array<Record<string, string>> },
        },
      ],
    },
    {
      label: "Visiting, Safety & Security category",
      blocks: [
        { key: "cat_safety_heading", type: "text", label: "Heading", defaultContent: { value: D.cat_safety_heading } },
        {
          key: "cat_safety",
          type: "rows",
          label: "Q&A",
          columns: qaColumns,
          blank: qaBlank,
          defaultContent: { rows: D.cat_safety as unknown as Array<Record<string, string>> },
        },
      ],
    },
    {
      label: "Bottom CTA",
      blocks: [
        { key: "cta_heading", type: "text", label: "Heading", defaultContent: { value: D.cta_heading } },
        { key: "cta_phone_label", type: "text", label: "Phone number (display)", defaultContent: { value: D.cta_phone_label } },
        { key: "cta_phone_href", type: "text", label: "Phone link (e.g. tel:...)", defaultContent: { value: D.cta_phone_href } },
        { key: "cta_after_phone", type: "text", label: "Text after phone number", defaultContent: { value: D.cta_after_phone } },
        { key: "cta_inquiry_label", type: "text", label: "Inquiry button label", defaultContent: { value: D.cta_inquiry_label } },
        { key: "cta_apply_label", type: "text", label: "Apply button label", defaultContent: { value: D.cta_apply_label } },
      ],
    },
  ],
};
