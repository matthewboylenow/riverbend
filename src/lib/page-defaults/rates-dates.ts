/**
 * Default content for /rates-dates-application-2026.
 *
 * Single source of truth — used by:
 *  - The public page as fallback when a block doesn't exist in the DB
 *  - The admin editor as fallback so it always opens populated even if
 *    the DB hasn't been seeded yet (e.g. fresh deploy, env mismatch, etc.)
 *
 * Editing here updates both. Once an admin saves changes through the editor,
 * those DB values take precedence over these defaults.
 */

export interface TuitionRow {
  duration: string;
  inCamp: string;
  dayTripper: string;
  threeQuarter: string;
}

export interface DiscountRow {
  heading: string;
  body: string;
}

export interface PaymentRow {
  label: string;
  detail: string;
}

export const RATES_DEFAULTS = {
  hero_title: "Rates, Dates & Application",
  hero_subtitle: "2026 Season — June 29 through August 14",
  intro_html:
    "<p>Camp Riverbend is a 7 week program. Campers can attend from a minimum of 2 consecutive weeks up to the full 7 week season. Minimum enrollment for our Three-Quarter Day campers is 3 days per week. Grouping is done based on the grade a child will enter in September after the camp season.</p><p>Camp Riverbend will run Monday June 29 to Friday August 14, 2026. Camp will be closed on July 3. Camp hours are 9 am to 4 pm, with extended hours from 8 am to 6 pm.</p>",
  tuition_note: "2025 rates shown for reference. 2026 rates will be updated soon.",
  tuition_rows: [
    { duration: "7 Weeks", inCamp: "$8,375", dayTripper: "$9,170", threeQuarter: "$7,450" },
    { duration: "Any 6 Weeks", inCamp: "$7,820", dayTripper: "$8,640", threeQuarter: "$6,570" },
    { duration: "Any 5 Weeks", inCamp: "$7,230", dayTripper: "$7,950", threeQuarter: "$5,765" },
    { duration: "Any 4 Weeks", inCamp: "$6,470", dayTripper: "$7,200", threeQuarter: "$4,840" },
    { duration: "Any 3 Weeks", inCamp: "$5,215", dayTripper: "$6,150", threeQuarter: "$3,800" },
    { duration: "Any 2 Weeks", inCamp: "$3,970", dayTripper: "$4,875", threeQuarter: "$2,710" },
  ] as TuitionRow[],
  tuition_extras_html:
    "<p>3 and 4 Year Old Three-Quarter Day tuition rates and discounts listed above are for 5 days a week and will be pro-rated for 3 or 4 days a week.</p>",
  discounts: [
    {
      heading: "Sibling Discount (2nd Child)",
      body: "Deduct $300 from 7 or 6 week tuition, $250 from 5 week, $200 from 4 or 3 week, or $150 from 2 week tuition.",
    },
    {
      heading: "Sibling Discount (3rd Child)",
      body: "Deduct $600 from 7 or 6 week tuition, $500 from 5 week, $400 from 4 or 3 week, or $300 from 2 week tuition.",
    },
    {
      heading: "July 4 Holiday Discount",
      body: "If you enroll only for the first two weeks of camp (June 29 and July 7), deduct $300 from total tuition.",
    },
    {
      heading: "Referral Discount",
      body: "Receive a $100 discount on your summer tuition for each first-time camper you refer ($50 for Three-Quarter Day).",
    },
  ] as DiscountRow[],
  payment_schedule: [
    {
      label: "At Application",
      detail: "$500 deposit per camper ($200 becomes non-refundable registration fee)",
    },
    { label: "January 6", detail: "$1,500 per camper payment" },
    { label: "April 1", detail: "Final tuition payment due" },
  ] as PaymentRow[],
  payment_extras_html: "",
};
