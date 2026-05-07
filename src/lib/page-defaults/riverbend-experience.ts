/** Default content for /riverbend-experience. Mirrors the live page exactly. */

export interface ScheduleLink {
  label: string;
  href: string;
}

export const RIVERBEND_EXPERIENCE_DEFAULTS = {
  hero_title: "Riverbend Experience",
  hero_subtitle: "Where campers in grades 1-8 explore, grow, and gain confidence",
  hero_bg_url: "/assets/site/ADV07104-scaled.jpg",
  hero_bg_alt: "",

  overview_badge: "Grades 1-8",
  overview_html:
    "<p>During the day, each group rotates through eight age-appropriate activities including team sports, arts &amp; crafts, swimming, outdoor adventures like high-ropes, zipline, canoeing, and much more! Campers can explore their favorite activities at midday clubs.</p><p>Campers entering 4th &amp; 5th grades choose their own afternoon schedules twice a week in our tracking program. Campers entering 6th, 7th and 8th grades choose their own individualized afternoon schedules three times a week with \"SuperChoice.\"</p><p>Swimming is an important part of each day at Riverbend, with group instruction each morning and a \"free\" swim in the afternoon.</p>",

  video_caption: "See the Riverbend Experience in action",
  video_id: "361309028",
  video_title: "Riverbend Experience",

  typical_day_heading: "A Typical Day",
  typical_day_html:
    "<p>Each day begins and ends with a camp-wide assembly where our Camp Directors lead everyone in traditional and new camp songs.</p><p>Campers spend the day in all-boy or all-girl groups (8th grade group is co-ed) with others in the same grade.</p>",
  typical_day_image_url: "/assets/site/ADV07400.jpg-marketing-scaled.jpg",
  typical_day_image_alt: "Campers enjoying a typical day at Riverbend",

  supervision_heading: "Supervision",
  supervision_html:
    "<p>Each group has two counselors leading them. Our group head counselors are teachers or older college students who have worked at Camp Riverbend before. Our group assistant counselors are college students or older high school students, many of them former Camp Riverbend campers themselves!</p>",
  supervision_image_url: "/assets/site/ADV06620.jpg-marketing-scaled.jpg",
  supervision_image_alt: "Counselors supervising campers at Riverbend",

  schedules_heading: "Sample Schedules",
  schedules_subheading:
    "Each grade has its own daily rotation. Click any schedule to see how a typical week is structured.",
  schedules: [
    { label: "1st Grade — Boys", href: "/assets/documents/schedules/1st-grade-boys.pdf" },
    { label: "1st Grade — Girls", href: "/assets/documents/schedules/1st-grade-girls.pdf" },
    { label: "2nd Grade — Boys", href: "/assets/documents/schedules/2nd-grade-boys.pdf" },
    { label: "2nd Grade — Girls", href: "/assets/documents/schedules/2nd-grade-girls.pdf" },
    { label: "3rd Grade — Boys", href: "/assets/documents/schedules/3rd-grade-boys.pdf" },
    { label: "3rd Grade — Girls", href: "/assets/documents/schedules/3rd-grade-girls.pdf" },
    { label: "4th Grade — Boys", href: "/assets/documents/schedules/4th-grade-boys.pdf" },
    { label: "4th Grade — Girls", href: "/assets/documents/schedules/4th-grade-girls.pdf" },
    { label: "5th Grade — Boys", href: "/assets/documents/schedules/5th-grade-boys.pdf" },
    { label: "5th Grade — Girls", href: "/assets/documents/schedules/5th-grade-girls.pdf" },
    { label: "6th–7th — Boys", href: "/assets/documents/schedules/6th-7th-grade-boys.pdf" },
    { label: "6th–7th — Girls", href: "/assets/documents/schedules/6th-7th-grade-girls.pdf" },
    { label: "8th Grade (Coed)", href: "/assets/documents/schedules/8th-grade-coed.pdf" },
  ] as ScheduleLink[],

  learn_more_heading: "Learn More",
  learn_more_1_title: "All Programs",
  learn_more_1_image: "/assets/site/ADV06620.jpg-marketing-scaled.jpg",
  learn_more_2_title: "Activities",
  learn_more_2_image: "/assets/site/ADV01169.jpg",
  learn_more_3_title: "Rates & Dates",
  learn_more_3_image: "/assets/site/Canoe.jpg",
};
