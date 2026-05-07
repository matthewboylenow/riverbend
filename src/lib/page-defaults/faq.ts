/** Default content for /faq. Mirrors the live page exactly.
 *
 * One block per category (rows of question + answer); category headings
 * are separate text blocks. The accordion id is generated from the row
 * index at render time so admins don't need to think about it.
 */

export interface FAQRow {
  question: string;
  answer: string;
}

export const FAQ_DEFAULTS = {
  hero_title: "Frequently Asked Questions",
  hero_subtitle: "Everything you need to know about Camp Riverbend",
  hero_bg_url: "/assets/site/IMG_2726.jpg",
  hero_bg_alt: "",

  cat_registration_heading: "Registration",
  cat_registration: [
    {
      question: "How do I apply for a space for my child for camp?",
      answer:
        "Complete our online application form and provide a $500 deposit. Payment can be made by cash, EFT/echeck, Master Card, Visa or American Express. There is a 2.9% convenience fee applied to credit card payments.",
    },
    {
      question: "Can Camp Riverbend provide references?",
      answer:
        "Yes! We are happy to connect prospective families with current camp families in your area who have children of similar ages.",
    },
  ] as FAQRow[],

  cat_transportation_heading: "Transportation",
  cat_transportation: [
    { question: "What type of bus will my child ride to camp?", answer: "We use both 24 and 54 passenger yellow school buses." },
    {
      question: "Who drives the camp bus?",
      answer:
        "All drivers are required to have a Commercial Driver's License (CDL) with a special certification to drive passengers. Requirements include: minimum 21 years old, an excellent driving record for the past three years, fingerprinting by State Police, a physical exam and a written and comprehensive road test to ensure safety awareness! Our insurance company checks the driving record of every bus driver every year. Each bus also has a riding counselor for additional supervision.",
    },
    {
      question: "How long is the bus ride to camp?",
      answer:
        "We try to arrange our bus routes so each camper's trip is as short as possible. Most bus routes begin around 8:00 am and arrive at Camp around 8:45 am. We dismiss at 4:00 pm and almost all buses have delivered their campers home by 4:45 pm, depending on town and route position.",
    },
    { question: "Will my child wear a seatbelt on the bus?", answer: "Yes! All campers must wear seat belts at all times." },
    {
      question: "What if there is a problem on the bus?",
      answer:
        "If there is a problem, we can communicate with buses on the road via cell phone. Bus counselors call or text to camp at the end of every afternoon route so we know that everyone is home safely.",
    },
    {
      question: "I work full-time and can't wait for the camp bus, do you offer extra hours?",
      answer:
        "Yes, we have an optional extended day program. You can bring your camper here as early as 8:00 am and pick up as late as 6:00 pm. Counselors supervise extended day campers in games, crafts, sports and quiet activities.",
    },
    {
      question: "What does extended day cost?",
      answer:
        "There is no extra fee for the extended day program if you use it instead of bus transportation. There is a small extra charge to use both extended day and bus service.",
    },
  ] as FAQRow[],

  cat_staff_heading: "Staff & Groups",
  cat_staff: [
    {
      question: "Who is my child's counselor?",
      answer:
        "We take pride in our mature, talented counselor staff. Group head counselors are teachers or college students who have trained at Riverbend. Assistant group counselors are 12th graders or college students. There is no CIT program.",
    },
    {
      question: "How are staff screened?",
      answer:
        "Prospective counselors undergo a rigorous screening process. All staff members, new and returning, are trained before Camp starts. This training teaches safety rules, techniques for working with children, and fun games and activities to share with campers.",
    },
    {
      question: "What is the staff to counselor ratio?",
      answer:
        "There is one counselor for every 5 campers throughout Camp. Groups of 16-18 have two counselors for first graders and up; Clubhouse groups have three.",
    },
    {
      question: "Can my child be in a group with a friend?",
      answer:
        "Yes, if the friend is the same sex and in the same grade as your child (Clubhouse groups and young teen groups are co-ed). Our application includes space to list preferred groupmates.",
    },
    { question: "What is the tipping policy at Camp Riverbend?", answer: "Camp Riverbend has a no-tipping policy for all camp staff." },
  ] as FAQRow[],

  cat_activities_heading: "Camp Activities",
  cat_activities: [
    {
      question: "What will my child do at camp?",
      answer:
        "Our instructors teach a wide variety of skills in creative crafts, swimming, team & individual sports, performing arts, team building and nature. Our PIY (Pick It Yourself) program also lets groups choose their favorite activities together.",
    },
    {
      question: "Can my child choose his/her own activities?",
      answer:
        "Campers entering first grade & up choose their favorite activities during club time before or after lunch Monday through Thursday. Rising 4th and 5th graders choose a cluster of three related activities in our Tracking program for Tuesday and Thursday afternoons. Rising 6th – 8th graders choose three individual activities to explore intensively in our SuperChoice program for Monday, Wednesday and Friday afternoons.",
    },
    {
      question: "Do you have any special events at camp?",
      answer:
        "Each Friday is a special day, with performing artists, parades or counselor talent shows. In years past we have imported \"snow\" for sledding in July, built and raced cardboard boats, and served giant pizza-sized pancakes. Every Friday is super fun!",
    },
    {
      question: "Tell me about swimming at camp.",
      answer:
        "We pride ourselves on our excellent swim instruction program. Each camper has a swim lesson every day. Children are placed in lessons based on their swimming ability. Lesson groups are small, with about 6-8 campers, taught by a swimming instructor and a group counselor assisting. The waterfront has 5 crystal-clear heated pools, designed for teaching children at all swim skill levels. Our committed team of Red Cross certified Lifeguards and Water Safety Instructors supervise the pools at all times.",
    },
    {
      question: "What happens when it rains?",
      answer:
        "We have indoor locations for all campers on rainy days. We continue with our regular program inside.",
    },
  ] as FAQRow[],

  cat_food_heading: "Food",
  cat_food: [
    {
      question: "Who provides lunch for my child?",
      answer:
        "Camp Riverbend provides daily lunch for all campers – kid favorites and healthy choices approved by our Camp Riverbend Dietician, with options every day. All campers also receive an ice cream or ice pop treat as they wrap up their day.",
    },
    {
      question: "How do you handle food allergies?",
      answer:
        "Our kitchen is \"allergy aware.\" We do not serve any tree nut or peanut products and can accommodate a variety of food allergies, such as: gluten, dairy, sesame and egg allergies.",
    },
    {
      question: "Are snacks provided?",
      answer:
        "Yes! Campers can stop by the Snack Shack mid-morning or mid-afternoon for small packaged snacks, such as goldfish crackers, pretzels, popcorn, fresh fruit and fresh veggies! All snack items are tree nut and peanut-free, with gluten-free options available. Snacks are included in camp tuition.",
    },
    {
      question: "What about other food from home?",
      answer:
        "We allow campers to bring food from home for lunch, however we do not permit sharing with other campers, and nothing with tree nuts or peanuts is allowed. For birthdays, we request that you send in only non-edible party favors for the group.",
    },
  ] as FAQRow[],

  cat_safety_heading: "Visiting, Safety & Security",
  cat_safety: [
    {
      question: "What happens if my child feels sick at camp?",
      answer:
        "A camper who feels sick will go to the nurse, who evaluates his or her condition. In case of serious injury or illness, the nurse will contact the child's parents to pick the child up.",
    },
    {
      question: "What does the camp nurse do?",
      answer:
        "Our Camp nurse treats minor injuries that occur during the day, such as bug bites and scrapes, and administers any prescription and over-the-counter medication that has been authorized by a camper's parents.",
    },
    {
      question: "What is your security policy for camp?",
      answer:
        "When applying, parents must select a secret password. No camper will be released to any adult without the password. Our security staff also check all visitors at the front of camp.",
    },
    { question: "Can I visit my child during the summer?", answer: "No parent visits are allowed during the camp day." },
    {
      question: "How important is camp safety?",
      answer:
        "Camper safety is our number one priority! Camp Riverbend undergoes annual inspections by local and state officials covering sanitation, transportation, food safety and fire prevention. We are accredited by the American Camp Association and certified by the New Jersey Department of Health.",
    },
    {
      question: "Who owns Camp Riverbend?",
      answer:
        "The Breene Family has owned and operated Camp Riverbend since 1962. The current owners are Roger Breene, Jill Breene Cheng, Paul Breene and Robin Breene Hetrick. The four of them, along with Roger's spouse, Debbie Breene, and Paul's spouse, Miriam Peretsman, supervise every aspect of the daily operation of Camp.",
    },
  ] as FAQRow[],

  cta_heading: "Still have questions?",
  cta_phone_label: "(908) 580-CAMP",
  cta_phone_href: "tel:9085802267",
  cta_after_phone: " or request more information and we'll be happy to help.",
  cta_inquiry_label: "Request Information",
  cta_apply_label: "Apply Now",
};
