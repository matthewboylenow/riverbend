/** Default content for /testimonials. Mirrors the live page exactly. */

export interface CamperQuote {
  quote: string;
}

export interface ParentQuote {
  quote: string;
  name: string;
  town: string;
}

export const TESTIMONIALS_DEFAULTS = {
  hero_title: "Testimonials",
  hero_subtitle: "Hear from our campers and families",
  hero_bg_url: "/assets/site/ADV07400.jpg-marketing-scaled.jpg",
  hero_bg_alt: "",

  campers_heading: "What Campers Are Saying…",
  camper_quotes: [
    { quote: "My favorite thing about Camp Riverbend is you make new friends. They have really fun activities." },
    { quote: "I love Camp Riverbend and wish I could keep coming." },
    { quote: "What I like about Camp Riverbend is that you can make so many friends and there are so many cool and fun things to do." },
    { quote: "My experience at Camp Riverbend has been amazing. This is the best camp I have been to so far." },
    { quote: "My experience with Riverbend has not only helped me make new friends but also have fun. I started when I was 3 and have been coming ever since, I am now 13." },
    { quote: "This camp is great. It made for a really fun summer." },
    { quote: "I've been a camper at Camp Riverbend for 9 years and learned to swim here!" },
    { quote: "Camp is my favorite time of the year! I always get so excited hearing from Camp Riverbend." },
    { quote: "My favorite part of camp is the free & instructional swim. I've been a camper for 8 years." },
    { quote: "I love doing lanyard and arts and crafts. I love all my camp friends!" },
    { quote: "My favorite part about camp is all the friends I made. Also the mini zip line and canoes." },
    { quote: "What do I like most about camp?? The pool, the rock wall and the zip line. Wait — no, everything!!!" },
    { quote: "I can't wait for Camp Riverbend so I can do archery, swim & gameology!" },
  ] as CamperQuote[],

  parents_heading: "What Parents Are Saying…",
  parent_quotes: [
    { quote: "My son had another excellent camp experience this summer. He came home in tears tonight upset that camp is over.", name: "Allyson", town: "Basking Ridge" },
    { quote: "We love Riverbend! There are tons and tons of awesome activities and no better counselors around!", name: "Erica", town: "Westfield" },
    { quote: "Camp Riverbend is an incredible experience! The kids love all the activities and the Camp takes care of everything.", name: "John", town: "New Providence" },
    { quote: "Since the very first time we came for an open house visit we knew there was something special and even magical about Camp Riverbend.", name: "Lucinda", town: "Berkeley Heights" },
    { quote: "My daughter had such a great first summer at Riverbend. She couldn't wait for the bus to come everyday!", name: "Amanda", town: "Summit" },
    { quote: "We love everything Camp Riverbend has to offer, keeping our girls busy and happy all summer!", name: "Sherri", town: "Basking Ridge" },
    { quote: "As a new Camp Riverbender this year, my son loved every moment! I was thankful for amazing bus drivers.", name: "Megan", town: "New Providence" },
    { quote: "We love how Camp Riverbend is all about tradition! We are thrilled to be part of the Riverbend family.", name: "Ben", town: "Westfield" },
    { quote: "We love how excited our son, Jack is for camp everyday in the summer. He is very active.", name: "Lisa", town: "Bedminster" },
    { quote: "We absolutely love camp Riverbend! There are so many fun and exciting activities. The staff is wonderful.", name: "Nicole", town: "Warren" },
    { quote: "When choosing a camp for our kids, picking Riverbend was an obvious choice. I've known the camp for 40 years.", name: "David", town: "Berkeley Heights" },
    { quote: "It has been a true gift and pleasure watching my children grow and thrive during their summers at Camp Riverbend.", name: "Lori", town: "Summit" },
    { quote: "This is our second season at Camp Riverbend and the experience keeps getting better. What stands out the most is the thoughtful detail.", name: "Jaime", town: "Mountainside" },
    { quote: "Every day is something new for the twins to look forward to. You Breenes have really cracked the code on summer campers.", name: "Diane", town: "Westfield" },
    { quote: "The Breenes offer a top-notch day camp program and are visible throughout the entire camp, overseeing the daily operations.", name: "Jodi", town: "Hoboken" },
    { quote: "Nowhere I'd rather send my girls to camp than Camp Riverbend! I know that they are safe, cared for, happy as can be.", name: "Rachel", town: "Scotch Plains" },
  ] as ParentQuote[],

  cta_heading: "Ready to join the Riverbend family?",
  cta_apply_label: "Apply Now",
  cta_inquiry_label: "Request Information",
};
