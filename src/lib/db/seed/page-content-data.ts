// Default editable content blocks per public page.
// pageSlug + sectionKey is a unique key. Admins edit `content`.
// contentType: "text" = plain text; "rich_html" = Tiptap-produced HTML.

export type ContentBlock = {
  pageSlug: string;
  sectionKey: string;
  label: string;
  contentType: 'text' | 'rich_html';
  content: string;
  sortOrder: number;
};

export const PAGE_CONTENT: ContentBlock[] = [
  // ─── Rates, Dates & Application ──────────────────────
  { pageSlug: 'rates-dates-application-2026', sectionKey: 'page_title', label: 'Page title', contentType: 'text', content: 'Rates, Dates & Application', sortOrder: 0 },
  { pageSlug: 'rates-dates-application-2026', sectionKey: 'page_subtitle', label: 'Subtitle (under title)', contentType: 'text', content: '2026 Season — June 29 through August 14', sortOrder: 1 },
  { pageSlug: 'rates-dates-application-2026', sectionKey: 'overview_body', label: 'Overview paragraph (intro)', contentType: 'rich_html', content: '<p>Camp Riverbend is a 7 week program. Campers can attend from a minimum of 2 consecutive weeks up to the full 7 week season. Minimum enrollment for our Three-Quarter Day campers is 3 days per week. Grouping is done based on the grade a child will enter in September after the camp season.</p><p>Camp Riverbend will run Monday June 29 to Friday August 14, 2026. Camp will be closed on July 3. Camp hours are 9 am to 4 pm, with extended hours from 8 am to 6 pm.</p>', sortOrder: 2 },
  { pageSlug: 'rates-dates-application-2026', sectionKey: 'rates_note', label: 'Note above rates table', contentType: 'text', content: '2025 rates shown for reference. 2026 rates will be updated soon.', sortOrder: 3 },
  { pageSlug: 'rates-dates-application-2026', sectionKey: 'rates_footnote', label: 'Footnote under rates table', contentType: 'text', content: '3 and 4 Year Old Three-Quarter Day tuition rates and discounts listed above are for 5 days a week and will be pro-rated for 3 or 4 days a week.', sortOrder: 4 },
  { pageSlug: 'rates-dates-application-2026', sectionKey: 'payment_note_1', label: 'Payment note (non-refundable)', contentType: 'text', content: 'All tuition payments made on or after January 6 are non-refundable.', sortOrder: 5 },
  { pageSlug: 'rates-dates-application-2026', sectionKey: 'payment_note_2', label: 'Payment note (plans)', contentType: 'text', content: 'Payment plans available for EFT/echeck or credit card — all payments must be completed by April 1.', sortOrder: 6 },
  { pageSlug: 'rates-dates-application-2026', sectionKey: 'whats_included_body', label: "What's Included body", contentType: 'rich_html', content: '<p>Each camper&rsquo;s tuition includes either bus transportation to and from camp <em>or</em> a place in our extended day program at camp (8:00&ndash;9:00 am and 4:00&ndash;6:00 pm). There is an additional fee if your family wants to use bus transportation <em>and</em> extended day daily or hold seats for a camper on two different buses.</p><p>2.9% convenience fee for credit card payments. No charge for EFT or debit card payments.</p>', sortOrder: 7 },
  { pageSlug: 'rates-dates-application-2026', sectionKey: 'cta_heading', label: 'Bottom CTA heading', contentType: 'text', content: 'Ready to Join Camp Riverbend?', sortOrder: 8 },

  // ─── Homepage ────────────────────────────────────────
  { pageSlug: 'homepage', sectionKey: 'hero_eyebrow', label: 'Hero eyebrow text', contentType: 'text', content: 'Summer 2026 — Now Enrolling', sortOrder: 0 },
  { pageSlug: 'homepage', sectionKey: 'hero_title', label: 'Hero headline', contentType: 'text', content: 'Confidence, not competition.', sortOrder: 1 },
  { pageSlug: 'homepage', sectionKey: 'hero_subtitle', label: 'Hero subtitle', contentType: 'text', content: 'A family-run summer day camp in Warren, NJ since 1962. Ages 3-14.', sortOrder: 2 },

  // ─── About / Legacy & Tradition ──────────────────────
  { pageSlug: 'about-riverbend', sectionKey: 'page_title', label: 'Page title', contentType: 'text', content: 'Legacy & Tradition', sortOrder: 0 },
  { pageSlug: 'about-riverbend', sectionKey: 'page_subtitle', label: 'Subtitle', contentType: 'text', content: 'Over 60 years of camp magic', sortOrder: 1 },
  { pageSlug: 'about-riverbend', sectionKey: 'intro_body', label: 'Intro body', contentType: 'rich_html', content: '<p>Camp Riverbend has been a family-run summer day camp in Warren, New Jersey since 1962. Three generations of the Breene family have welcomed campers to our 30-acre camp on the Passaic River.</p>', sortOrder: 2 },

  // ─── Breene Family ──────────────────────────────────
  { pageSlug: 'breene-family', sectionKey: 'page_title', label: 'Page title', contentType: 'text', content: 'Directors & Senior Staff', sortOrder: 0 },
  { pageSlug: 'breene-family', sectionKey: 'page_subtitle', label: 'Subtitle', contentType: 'text', content: 'Meet the Breene family and our senior leadership team.', sortOrder: 1 },

  // ─── FAQ ────────────────────────────────────────────
  { pageSlug: 'faq', sectionKey: 'page_title', label: 'Page title', contentType: 'text', content: 'Frequently Asked Questions', sortOrder: 0 },
  { pageSlug: 'faq', sectionKey: 'page_subtitle', label: 'Subtitle', contentType: 'text', content: 'Answers to the questions we hear most often.', sortOrder: 1 },
  { pageSlug: 'faq', sectionKey: 'intro_body', label: 'Intro paragraph', contentType: 'rich_html', content: '<p>Still have questions? We&rsquo;d love to hear from you. Contact us anytime.</p>', sortOrder: 2 },

  // ─── Testimonials ───────────────────────────────────
  { pageSlug: 'testimonials', sectionKey: 'page_title', label: 'Page title', contentType: 'text', content: 'What Families Say', sortOrder: 0 },
  { pageSlug: 'testimonials', sectionKey: 'page_subtitle', label: 'Subtitle', contentType: 'text', content: 'Hear from our Riverbend families.', sortOrder: 1 },
];
