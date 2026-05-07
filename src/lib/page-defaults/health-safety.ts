/** Default content for /health-safety. Mirrors the live page exactly. */

export interface SafetyPoint {
  heading: string;
  body: string;
}

export const HEALTH_SAFETY_DEFAULTS = {
  hero_title: "Safety & Security",
  hero_subtitle: "Your child's safety is our number one priority",
  hero_bg_url: "/assets/site/ADV06446-scaled.jpg",
  hero_bg_alt: "",

  overview_html:
    "<p>Camper safety is our number one priority, and we are committed to keeping Camp Riverbend as safe and secure as possible!</p><p>We exceed all standards of the New Jersey Youth Camp Safety Act, and through the American Camp Association we keep current with the newest developments in camp safety and operations. We undergo rigorous annual inspections by local and state officials who evaluate every aspect of Camp Riverbend including sanitation, transportation, food safety, staff qualifications, fire prevention and medical record keeping.</p><p>Parent visits are not allowed during the camp season. Security staff at the entrance check all arriving adults.</p>",

  safety_video_id: "380563616",
  safety_video_title: "Safety & Health at Camp Riverbend",

  nurse_heading: "Our Camp Nurse",
  nurse_html:
    "<p>Our on-site camp nurse treats minor injuries that occur during the day, such as bug bites and scrapes.</p><p>A camper who feels sick or is injured will first go to the Nurse's office to be evaluated. In case of serious illness or injury, the nurse will contact the child's parents to pick the child up. Otherwise, the nurse will treat the child with over-the-counter, or prescription medications that have been authorized by the parents. Our camp doctor is on call.</p>",
  nurse_image_url: "/assets/site/ADV06446-scaled.jpg",
  nurse_image_alt: "Camp Riverbend health and safety",

  safety_points_heading: "Our Safety Commitments",
  safety_points: [
    {
      heading: "ACA Accredited",
      body: "Accredited by the American Camp Association since our very first season.",
    },
    {
      heading: "Annual Inspections",
      body: "Rigorous annual inspections by local and state officials covering every aspect of camp operations.",
    },
    {
      heading: "1:5 Ratio",
      body: "One dedicated counselor for every five campers, ensuring personal attention and supervision.",
    },
    {
      heading: "Secret Password",
      body: "No camper is ever released without the family's confidential password for added security.",
    },
  ] as SafetyPoint[],

  cta_text: "Have questions about our safety policies?",
  cta_button_label: "Visit Our FAQ",
};
