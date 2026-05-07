export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
  description?: string;
}

export interface NavColumn {
  heading?: string;
  links: NavLink[];
}

export interface FeaturedCard {
  title: string;
  description: string;
  href: string;
  cta: string;
  external?: boolean;
}

export interface NavGroup {
  label: string;
  tagline?: string;
  columns: NavColumn[];
  featured?: FeaturedCard;
  /** Additional featured cards beyond the first one. Mega menu renders up
   *  to 2 cards total (featured + featuredExtras[0]). */
  featuredExtras?: FeaturedCard[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Future Families",
    tagline: "Start your camp journey",
    columns: [
      {
        heading: "Programs",
        links: [
          { label: "Our Programs", href: "/programs", description: "Overview of every program" },
          { label: "The Clubhouse", href: "/clubhouse", description: "Pre-K through Kindergarten" },
          { label: "Riverbend Experience", href: "/riverbend-experience", description: "Grades 1 through 8" },
          { label: "Day Trippers", href: "/day-trippers", description: "Grades 7 through 9" },
        ],
      },
      {
        heading: "Discover",
        links: [
          { label: "Legacy & Tradition", href: "/about-riverbend", description: "Over 60 years of camp magic" },
          { label: "Camp Map", href: "/camp-map", description: "Explore our 30-acre campus" },
          { label: "Activities", href: "/activities" },
          { label: "Sports", href: "/sports" },
          { label: "Video Library", href: "/videos" },
        ],
      },
      {
        heading: "Resources",
        links: [
          { label: "Testimonials", href: "/testimonials" },
          { label: "FAQ", href: "/faq" },
          { label: "Health & Safety", href: "/health-safety" },
          { label: "Rates, Dates & Application", href: "/rates-dates-application-2026" },
        ],
      },
    ],
    featured: {
      title: "Summer 2026",
      description: "Limited space still available.",
      href: "/rates-dates-application-2026",
      cta: "View Rates & Dates",
    },
  },
  {
    label: "Current Families",
    tagline: "Everything you need",
    columns: [
      {
        heading: "Account",
        links: [
          { label: "Family Login", href: "https://riverbend.campintouch.com/v2/login/login.aspx?", external: true, description: "Access your family portal" },
          { label: "Camp Riverbend App", href: "/camp-riverbend-app", description: "Download our mobile app" },
          { label: "Calendar", href: "/calendar" },
        ],
      },
      {
        heading: "Camp Life",
        links: [
          { label: "Lunch & Snacks", href: "/lunch" },
          { label: "Transportation", href: "/transportation" },
          { label: "Health & Safety", href: "/health-safety" },
        ],
      },
    ],
  },
  {
    label: "Get Started",
    tagline: "Join the Riverbend family",
    columns: [
      {
        heading: "Apply & Connect",
        links: [
          { label: "Rates, Dates & Application", href: "/rates-dates-application-2026", description: "View pricing and schedule" },
          { label: "Submit an Inquiry", href: "https://riverbend.campintouch.com/v2/family/inquiryForm.aspx", external: true, description: "We'd love to hear from you" },
          { label: "Camper Application", href: "https://riverbend.campintouch.com/ui/forms/application/camper/App#ApplicationSeason", external: true, description: "Apply for summer 2026" },
          { label: "Book a Tour", href: "https://riverbend.campintouch.com/v2/family/inquiryForm.aspx", external: true, description: "See camp in person" },
        ],
      },
    ],
    featured: {
      title: "Book a Tour",
      description: "Come see Camp Riverbend in action. Schedule your personal tour today!",
      href: "https://riverbend.campintouch.com/v2/family/inquiryForm.aspx",
      cta: "Schedule a Tour",
      external: true,
    },
  },
  {
    label: "Staff",
    tagline: "Our amazing team",
    columns: [
      {
        heading: "Meet Our Team",
        links: [
          { label: "Directors & Senior Staff", href: "/breene-family", description: "The Breene family legacy" },
          { label: "Staff Application", href: "https://riverbend.campintouch.com/ui/forms/application/staff/App", external: true, description: "Join our summer team" },
          { label: "Our Philosophy", href: "/about-riverbend#philosophy" },
          { label: "Our Staff", href: "/about-riverbend#staff" },
        ],
      },
    ],
  },
];

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/CampRiverbend/", icon: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/campriverbend/", icon: "instagram" },
  { label: "Vimeo", href: "https://vimeo.com/campriverbend", icon: "vimeo" },
];

export const EXTERNAL_LINKS = {
  familyLogin: "https://riverbend.campintouch.com/v2/login/login.aspx?",
  inquiryForm: "https://riverbend.campintouch.com/v2/family/inquiryForm.aspx",
  camperApp: "https://riverbend.campintouch.com/ui/forms/application/camper/App#ApplicationSeason",
  staffApp: "https://riverbend.campintouch.com/ui/forms/application/staff/App",
  yessirr: "https://yessirr.com/collections/campriverbend",
};
