/**
 * Default content for /camp-riverbend-app.
 *
 * Mirrors the live page exactly so the editor opens populated, and the
 * public page falls back to these strings whenever the DB has no row.
 */

export interface FeatureRow {
  title: string;
  description: string;
}

export const CAMP_RIVERBEND_APP_DEFAULTS = {
  hero_title: "Camp Riverbend App",
  hero_subtitle: "Stay connected with your camper all summer",
  hero_bg_url: "/assets/site/MEC_9306.jpg",
  hero_bg_alt: "",

  overview_html:
    "<p>Enrolled families can now stay connected with Camp Riverbend via our app! See and download photos and videos from camp for FREE, get important notifications and texts from camp, connect to your CampMinder Parent Portal, view important dates on the camp calendar &amp; link directly to yours, and easily contact camp staff.</p>",

  download_heading: "How to Get It",
  download_html:
    '<p>Search on the App Store or Google Play for <strong>"Camp Riverbend NJ"</strong> to download. You will need an access code to install the app; this code is listed in our Parent Handbook.</p><p>Prefer your computer? A desktop version of the photo viewer is available at <a href="https://photoviewer.my1218app.com/" target="_blank" rel="noopener noreferrer">photoviewer.my1218app.com</a>.</p>',
  app_store_url: "https://apps.apple.com/app/camp-riverbend-nj",
  app_store_badge_url: "/assets/site/apple-store-badge.png",
  google_play_url: "https://play.google.com/store/search?q=camp+riverbend+nj",
  google_play_badge_url: "/assets/site/google-play-badge.png",

  features_heading: "App Features",
  features: [
    {
      title: "Photo & Video Access",
      description: "See and download photos and videos from camp for FREE throughout the summer.",
    },
    {
      title: "Push Notifications",
      description: "Get important notifications and texts directly from camp staff.",
    },
    { title: "Parent Portal", description: "Connect directly to your CampMinder Parent Portal from the app." },
    { title: "Camp Calendar", description: "View important dates on the camp calendar and link directly to your own." },
    { title: "Contact Staff", description: "Easily reach camp staff with questions at any time." },
  ] as FeatureRow[],
};
