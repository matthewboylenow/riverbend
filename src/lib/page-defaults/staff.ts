/** Default content for /staff. Mirrors the live page exactly. */

export interface StaffRole {
  title: string;
  description: string;
}

export const STAFF_DEFAULTS = {
  hero_title: "Join Our Riverbend Family",
  hero_subtitle: "Make a difference this summer",
  hero_bg_url: "/assets/site/d-22-1024x682.jpg",
  hero_bg_alt: "",

  overview_html:
    "<p>Looking for a summer job? Look no further than Camp Riverbend! We are a children's summer camp located in Warren Township, New Jersey.</p><p>We have been serving the local area for over 60 years and take great pride in our Riverbend staff!</p>",

  video_1_heading: "Life as a Riverbend Counselor",
  video_1_id: "670781165",
  video_2_heading: "About Our Staff",
  video_2_id: "361309800",

  why_heading: "Why Camp Riverbend?",
  why_html:
    "<p>At Camp Riverbend, our philosophy builds \"confidence, not competition!\" We honor each camper's talents and efforts. Camp Riverbend is a place where each child can be themself, explore the world and learn new skills in a fun and supportive environment.</p><p>We also work hard to give each of our counselors and staff opportunities to grow as both individuals and leaders, while building their resumé in a fun, outdoor environment.</p>",

  roles_heading: "Roles at Camp Riverbend",
  roles_intro: "In order to join our Riverbend staff, we ask that all prospective staff be a high school junior (11th grade) or older.",
  roles: [
    {
      title: "Group Counselors",
      description: "Work with one group of children all summer. Assist activity instructors and at the pool.",
    },
    {
      title: "Specialty Instructors",
      description:
        "Teach specific skills — arts & crafts, ceramics, woodworking, baseball, canoeing, cooking, drama, team building and soccer. Camp pays for required certifications (high ropes challenge course, canoeing, archery).",
    },
    {
      title: "Waterfront Counselors",
      description:
        "Teach swimming lessons every morning and lifeguard every afternoon. Must have or earn Lifeguard certification before camp begins; training provided in June.",
    },
    {
      title: "Photo Team",
      description:
        "Document campers daily for the Riverbend app. Photography background and DSLR experience preferred but training is provided. An active outdoor role.",
    },
  ] as StaffRole[],

  logistics_heading: "2026 Dates & Logistics",
  logistics_html:
    "<p>Camp Riverbend is a 7 week summer day camp running Monday, June 29 through Friday, August 14, 2026 (closed July 3). Regular staff hours are Monday–Friday, 8:30 AM–4:00 PM. Staff training is held June 17, 18, 20, and 21, 2026.</p><p>Unfortunately, we are unable to provide lodging. We recommend finding accommodation within about 20 miles of Camp. Bus driver positions are also available with additional compensation.</p>",

  cta_heading: "Ready to Apply?",
  cta_button_label: "Apply to Join Our Staff",
  cta_phone_main_label: "908-580-CAMP",
  cta_phone_main_href: "tel:9085802267",
  cta_phone_text_label: "908-721-2598",
  cta_phone_text_href: "tel:9087212598",
};
