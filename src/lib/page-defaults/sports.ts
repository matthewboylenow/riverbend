/** Default content for /sports. Mirrors the live page exactly. */

export interface SportCard {
  name: string;
  image: string;
  description: string;
}

export const SPORTS_DEFAULTS = {
  hero_title: "Sports at Riverbend",
  hero_subtitle: "Building skills, sportsmanship, and team cooperation",
  hero_bg_url: "/assets/site/DSC07565-marketing-scaled.jpg",
  hero_bg_alt: "",

  intro_html:
    "<p>At Camp Riverbend our campers enjoy a complete sports program that emphasizes learning new skills, sportsmanship and team cooperation. Our sports programs help campers discover new abilities and gain a sense of achievement and success in whatever they try. Coaches oversee and instruct sports activities in camp.</p>",

  sports: [
    {
      name: "Basketball",
      image: "/assets/site/DSC07326-scaled.jpg",
      description:
        "Our outdoor basketball court, with one full sized court and two half courts, is where our basketball specialist teaches skills and organizes games daily. The outdoor court is surrounded by beautiful shade trees to keep campers cool on hot days.",
    },
    {
      name: "Tennis",
      image: "/assets/site/DSC07389-scaled.jpg",
      description:
        "Tennis is tops for cardio and learning strategy on the court. Our two regulation sized courts provide room for individual and group matches.",
    },
    {
      name: "Baseball / Softball",
      image: "/assets/site/DSC07606-scaled.jpg",
      description:
        "We have a regulation-sized Little League field where campers learn the fundamentals and fine points of Baseball and Softball. An experienced instructor gives campers formal lessons to help develop skills, and also supervises game play.",
    },
    {
      name: "Gaga",
      image: "/assets/site/MEC_9087-scaled.jpg",
      description:
        "The game is played inside a 6-sided court, with walls 2 feet high. If a ball hits you below your knees you are out! But don't worry — each round lasts just three minutes and then you are back in the game.",
    },
    {
      name: "Soccer",
      image: "/assets/site/DSC07242-scaled.jpg",
      description:
        "At the walled soccer field, our specialist teaches various skills and supervises real game play.",
    },
    {
      name: "Stix",
      image: "/assets/site/DSC07236-scaled.jpg",
      description: "Our Stix program includes non-contact lacrosse, field hockey and pillo polo.",
    },
    {
      name: "Hockey",
      image: "/assets/site/DSC07236-scaled.jpg",
      description:
        "Our covered rink is a perfect location for a game of roller hockey or street hockey. The rink has a smooth paved surface and sturdy plastic walls that keep the ball on the court and the action going strong! Campers can also Rollerblade here.",
    },
    {
      name: "Mini-Golf",
      image: "/assets/site/DSC07242-scaled.jpg",
      description:
        "Campers love to perfect their strokes on our 9-hole miniature golf course. Each hole has a tricky detour on the way to the cup.",
    },
    {
      name: "Archery",
      image: "/assets/site/DSC07032-scaled.jpg",
      description:
        "Campers entering 2nd grade and up learn the ancient skill of archery from our experienced instructor. Our archery program emphasizes safety, focus, achievement and fun.",
    },
    {
      name: "Yoga",
      image: "/assets/site/DSC07402-scaled.jpg",
      description:
        "Campers learn the ancient techniques of yoga under the watchful eyes of an experienced instructor. Yoga provides opportunities for developing fitness, coordination and strength.",
    },
    {
      name: "Volleyball",
      image: "/assets/site/Volleyball-Riverbend.jpg",
      description:
        "Our volleyball court is the perfect spot for a great game of volleyball or newcomb.",
    },
  ] as SportCard[],

  video_id: "382945475",
  video_title: "Sports at Camp Riverbend",

  learn_more_heading: "Learn More",
  learn_more_1_title: "Activities",
  learn_more_1_image: "/assets/site/ADV01169.jpg",
  learn_more_2_title: "Our Programs",
  learn_more_2_image: "/assets/site/ADV06620.jpg-marketing-scaled.jpg",
  learn_more_3_title: "Rates & Dates",
  learn_more_3_image: "/assets/site/Canoe.jpg",
};
