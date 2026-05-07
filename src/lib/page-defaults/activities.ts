/** Default content for /activities. Mirrors the live page exactly. */

export interface ActivityCard {
  name: string;
  image: string;
}

export interface NinjaElement {
  label: string;
}

export const ACTIVITIES_DEFAULTS = {
  hero_title: "Activities at Riverbend",
  hero_subtitle: "Explore everything our 30-acre campus has to offer",
  hero_bg_url: "/assets/site/ADV01169.jpg",
  hero_bg_alt: "",

  intro_html:
    "<p>Camp Riverbend is located along the gentle Passaic River in Warren Township New Jersey. With approximately 30 acres, Camp Riverbend has shady woods, open fields, nature trails, a wetlands sanctuary and a variety of athletic fields. Take a look at all the activities and amenities Camp Riverbend has to offer!</p>",

  swimming_heading: "Swimming",
  swimming_html:
    "<p>We are very proud of our exceptional swim program.</p><p>Swimming is one of the most important skills to be learned at camp. Our five heated, crystal-clear pools are designed for teaching campers at all levels. The pools go from a depth of 1 foot to 11 feet so everyone feels comfortable.</p><p>Campers enjoy swimming twice a day, in the morning for instruction and in the afternoon for \"free swim\". Our experienced staff of lifeguards and water safety instructors supervises the waterfront.</p>",
  swimming_image_url: "/assets/site/DSC_0553-scaled.jpg",
  swimming_image_alt: "Campers swimming in one of the five heated pools at Camp Riverbend",
  swimming_video_id: "361310178",
  swimming_video_title: "Aquatics Program",

  sports_heading: "Sports",
  sports_html:
    "<p>At Camp Riverbend our campers enjoy a complete sports program that emphasizes learning new skills, sportsmanship and team cooperation. Our sports programs help campers discover new abilities and gain a sense of achievement and success in whatever they try. Coaches oversee and instruct sports activities in camp.</p>",
  sports_image_url: "/assets/site/ADV06281-scaled.jpg",
  sports_image_alt: "Campers enjoying sports activities at Camp Riverbend",
  sports_button_label: "Explore Sports",
  sports_video_id: "382945475",
  sports_video_title: "Sports",

  more_activities_heading: "More Activities",
  activity_cards: [
    { name: "Adventure Course & High Ropes", image: "/assets/site/ADV02128-scaled.jpg" },
    { name: "Arts & Crafts", image: "/assets/site/ADV07000-scaled.jpg" },
    { name: "Nature", image: "/assets/site/DSC07172-scaled.jpg" },
    { name: "Cooking", image: "/assets/site/ADV01095-scaled.jpg" },
    { name: "Pedal Karts", image: "/assets/site/ADV06848-scaled.jpg" },
    { name: "Spray Park", image: "/assets/site/ADV06766-scaled.jpg" },
  ] as ActivityCard[],
  adventure_video_id: "382946991",
  adventure_video_title: "Adventure Course & High Ropes",

  ninja_heading: "Ninja Course",
  ninja_intro:
    "Camp Riverbend has a Ninja Warrior training course for all campers, large and small, with these challenging elements:",
  ninja_elements: [
    { label: "Stepping Stones" },
    { label: "The Tunnel" },
    { label: "The Terrace" },
    { label: "Monkey Bars/Tumbling Dice" },
    { label: "Rubble Over and Under" },
    { label: "Box Jump" },
    { label: "Curved Wall" },
    { label: "Wooden Balance Beam" },
    { label: "Tire Run" },
    { label: "Tight Wire" },
    { label: "Apex Ladder" },
  ] as NinjaElement[],

  performing_heading: "Performing & Circus Arts",
  performing_html:
    "<p>Camp is a great place for children of all ages to explore performing arts. Our Performance program introduces campers to many techniques of performance, including improv, mime, puppetry, movement, directing, and working with props and costumes. Our Circus program introduces campers to the magic of the Big Top with juggling and clown skills. Both take place in our air-conditioned Studio.</p>",

  choice_heading: "Camper Choice",
  choice_html:
    "<p>As campers get older they have the opportunity to choose more of the activities they like best. Our Club program for campers 1st – 8th grades, before or after lunch Monday – Thursday, is very flexible, and campers can switch clubs every day. In Tracking, rising 4th &amp; 5th grade campers choose activities to explore in depth twice a week; in Superchoice, rising 6th – 8th grade campers pick their own individualized schedule of activities three times a week.</p>",

  indoor_heading: "Indoor Facilities",
  indoor_html:
    "<p>In case of rainy days, campers have plenty of indoor spaces to choose from, including the Studio, the Big Barn, Auditorium, Roller Rink, Dining Pavilion &amp; Game Pavilion. Most of our indoor locations, including all Clubhouse cabins, are air-conditioned.</p><p>Our Game Pavilion, continually supervised, is the place where campers play ping pong, foosball, air hockey, bumper pool, knock hockey, billiards and other table games.</p>",

  learn_more_heading: "Learn More",
  learn_more_1_title: "Our Programs",
  learn_more_1_image: "/assets/site/ADV06620.jpg-marketing-scaled.jpg",
  learn_more_2_title: "Rates & Dates",
  learn_more_2_image: "/assets/site/Canoe.jpg",
  learn_more_3_title: "Sports",
  learn_more_3_image: "/assets/site/DSC_0553-scaled.jpg",
};
