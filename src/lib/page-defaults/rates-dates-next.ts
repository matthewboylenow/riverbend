/**
 * Default content for the next-season rates page
 * (/rates-dates-application-2027, CMS slug rates-dates-application-next).
 *
 * The page ships essentially empty: tuition/discount/payment rows are
 * blank and rich-text areas are empty, so the public page shows only the
 * header and bottom CTA until an admin fills sections in. Headings
 * default to 2027 wording but are editable — when this container is
 * reused for a later season, admins just retitle everything.
 */
import type { TuitionRow, DiscountRow, PaymentRow } from "./rates-dates";

export const RATES_NEXT_DEFAULTS = {
  hero_title: "2027 Rates, Dates & Application",
  hero_subtitle: "2027 Season",
  intro_html: "",
  intro_cta_label: "Apply Now",
  intro_cta_href:
    "https://riverbend.campintouch.com/ui/forms/application/camper/App#ApplicationSeason",
  cta_heading: "Ready to Join Camp Riverbend?",
  cta_primary_label: "Apply Now",
  cta_primary_href:
    "https://riverbend.campintouch.com/ui/forms/application/camper/App#ApplicationSeason",
  cta_secondary_label: "Request Information",
  cta_secondary_href: "https://riverbend.campintouch.com/v2/family/inquiryForm.aspx",
  tuition_heading: "2027 Tuition Rates",
  tuition_note: "",
  tuition_rows: [] as TuitionRow[],
  tuition_extras_html: "",
  discounts_heading: "2027 Discounts",
  discounts: [] as DiscountRow[],
  payment_heading: "2027 Payment Schedule",
  payment_schedule: [] as PaymentRow[],
  payment_extras_html: "",
  policies_heading: "Policies",
  policies_body_html: "",
};
