"use client";

import { useState } from "react";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { EXTERNAL_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    title: "Registration",
    items: [
      {
        id: "reg-1",
        question: "How do I register my child?",
        answer:
          "Complete our online application form and provide a $500 deposit. Payment can be made by cash, EFT/echeck, Master Card, Visa or American Express. There is a 2.9% convenience fee applied to credit card payments.",
      },
    ],
  },
  {
    title: "Transportation",
    items: [
      {
        id: "trans-1",
        question: "What kind of buses do you use?",
        answer: "We use both 24 and 54 passenger yellow school buses.",
      },
      {
        id: "trans-2",
        question: "What qualifications do bus drivers have?",
        answer:
          "All drivers are required to have a Commercial Driver's License (CDL) with a special certification to drive passengers. Requirements include: minimum 21 years old, an excellent driving record for the past three years, fingerprinting by State Police, a physical exam and a written and comprehensive road test to ensure safety awareness!",
      },
      {
        id: "trans-3",
        question: "How long is the bus ride?",
        answer:
          "We try to arrange our bus routes so each camper's trip is as short as possible. Most bus routes begin around 8:00 am and arrive at Camp around 8:45 am. We dismiss at 4:00 pm and almost all buses have delivered their campers home by 4:45 pm.",
      },
      {
        id: "trans-4",
        question: "Do buses have seat belts?",
        answer: "Yes! All campers must wear seat belts at all times.",
      },
      {
        id: "trans-5",
        question: "How do you communicate with buses?",
        answer:
          "If there is a problem, we can communicate with buses on the road via cell phone. Bus counselors call or text to camp at the end of every afternoon route so we know that everyone is home safely.",
      },
      {
        id: "trans-6",
        question: "Is there an extended day program?",
        answer:
          "Yes, we have an optional extended day program. You can bring your camper here as early as 8:00 am and pick up as late as 6:00 pm. Counselors supervise extended day campers in games, crafts, sports and quiet activities.",
      },
      {
        id: "trans-7",
        question: "What does extended day cost?",
        answer:
          "There is no extra fee for the extended day program if you use it instead of bus transportation. There is a small extra charge to use both extended day and bus service.",
      },
    ],
  },
  {
    title: "Staff & Groups",
    items: [
      {
        id: "staff-1",
        question: "What are the counselors like?",
        answer:
          "We take pride in our mature, talented counselor staff. Group head counselors are teachers or college students who have trained at Riverbend. Assistant group counselors are 12th graders or college students. There is no CIT program.",
      },
      {
        id: "staff-2",
        question: "How are staff screened?",
        answer:
          "Prospective counselors undergo a rigorous screening process. All staff members, new and returning, are trained before Camp starts. This training teaches safety rules, techniques for working with children, and fun games and activities to share with campers.",
      },
      {
        id: "staff-3",
        question: "What is the camper-to-counselor ratio?",
        answer: "There is one counselor for every 5 campers throughout Camp.",
      },
      {
        id: "staff-4",
        question: "Can my child be in the same group as a friend?",
        answer:
          "Yes, if the friend is the same sex and in the same grade as your child (Clubhouse groups and young teen groups are co-ed).",
      },
      {
        id: "staff-5",
        question: "Is there a tipping policy?",
        answer: "Camp Riverbend has a no-tipping policy for all camp staff.",
      },
    ],
  },
  {
    title: "Camp Activities",
    items: [
      {
        id: "act-1",
        question: "What activities are offered?",
        answer:
          "Our instructors teach a wide variety of skills in creative crafts, swimming, team & individual sports, performing arts, team building and nature.",
      },
      {
        id: "act-2",
        question: "How do camper choice programs work?",
        answer:
          "Campers entering first grade & up choose their favorite activities during club time before or after lunch Monday through Thursday. Rising 4th and 5th graders choose a cluster of three related activities in our Tracking program for Tuesday and Thursday afternoons. Rising 6th – 8th graders choose three individual activities to explore intensively in our SuperChoice program for Monday, Wednesday and Friday afternoons.",
      },
      {
        id: "act-3",
        question: "What happens on Fridays?",
        answer:
          "Each Friday is a special day, with performing artists, parades or counselor talent shows. In years past we have imported \"snow\" for sledding in July, built and raced cardboard boats, and served giant pizza-sized pancakes. Every Friday is super fun!",
      },
      {
        id: "act-4",
        question: "What is the swim program like?",
        answer:
          "We pride ourselves on our excellent swim instruction program. Each camper has a swim lesson every day. Children are placed in lessons based on their swimming ability. Lesson groups are small, with about 6-8 campers, taught by a swimming instructor and a group counselor assisting. The waterfront has 5 crystal-clear heated pools, designed for teaching children at all swim skill levels. Our committed team of Red Cross certified Lifeguards and Water Safety Instructors supervise the pools at all times.",
      },
      {
        id: "act-5",
        question: "What happens on rainy days?",
        answer:
          "We have indoor locations for all campers on rainy days. We continue with our regular program inside.",
      },
    ],
  },
  {
    title: "Food",
    items: [
      {
        id: "food-1",
        question: "Is lunch provided?",
        answer:
          "Camp Riverbend provides daily lunch for all campers – kid favorites and healthy choices approved by our Camp Riverbend Dietician, with options every day.",
      },
      {
        id: "food-2",
        question: "How do you handle food allergies?",
        answer:
          "Our kitchen is \"allergy aware.\" We do not serve any tree nut or peanut products and can accommodate a variety of food allergies, such as: gluten, dairy, sesame and egg allergies.",
      },
      {
        id: "food-3",
        question: "Are snacks provided?",
        answer:
          "Yes! Campers can stop by the Snack Shack mid-morning or mid-afternoon for small packaged snacks, such as goldfish crackers, pretzels, popcorn, fresh fruit and fresh veggies! All campers have an ice cream treat as they wrap up their day. Snacks are included in camp tuition.",
      },
      {
        id: "food-4",
        question: "Can campers bring food from home?",
        answer:
          "We allow campers to bring food from home for lunch, however we do not permit sharing with other campers, and nothing with tree nuts or peanuts is allowed. For birthdays, we request that you send in only non-edible party favors for the group.",
      },
    ],
  },
  {
    title: "Visiting, Safety & Security",
    items: [
      {
        id: "safety-1",
        question: "What happens if my child gets sick or injured?",
        answer:
          "A camper who feels sick will go to the nurse, who evaluates his or her condition. In case of serious injury or illness, the nurse will contact the child's parents to pick the child up.",
      },
      {
        id: "safety-2",
        question: "What does the camp nurse do?",
        answer:
          "Our Camp nurse treats minor injuries that occur during the day, such as bug bites and scrapes, and administers any prescription and over-the-counter medication that has been authorized by a camper's parents.",
      },
      {
        id: "safety-3",
        question: "How is camper pickup handled?",
        answer:
          "When applying, parents must select a secret password. No camper will be released to any adult without the password.",
      },
      {
        id: "safety-4",
        question: "Can parents visit during the camp day?",
        answer: "No parent visits are allowed during the camp day.",
      },
      {
        id: "safety-5",
        question: "Who owns and operates Camp Riverbend?",
        answer:
          "The Breene Family has owned and operated Camp Riverbend since 1962. The current owners are Roger Breene, Jill Breene Cheng, Paul Breene and Robin Breene Hetrick. The four of them, along with Roger's spouse, Debbie Breene, and Paul's spouse, Miriam Peretsman, supervise every aspect of the daily operation of Camp.",
      },
    ],
  },
];

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function FAQClient() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  function toggleItem(id: string) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <InnerPageLayout>
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about Camp Riverbend"
        bgImage="/assets/site/IMG_2726.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "FAQ" },
        ]}
      />

      <Section id="faq" bg="cream" padding="default">
        <Container size="narrow">
          <div className="space-y-12">
            {faqCategories.map((category, catIndex) => (
              <AnimateIn key={category.title} delay={catIndex * 0.05}>
                <div>
                  <h2 className="font-camp text-charcoal mb-4">{category.title}</h2>
                  <div className="divide-y divide-sand rounded-2xl bg-white shadow-sm overflow-hidden">
                    {category.items.map((item) => {
                      const isOpen = openItems.has(item.id);
                      return (
                        <div key={item.id} className="px-6">
                          <button
                            onClick={() => toggleItem(item.id)}
                            className="flex w-full items-center justify-between py-4 text-left font-semibold text-charcoal hover:text-camp-red transition-colors"
                            aria-expanded={isOpen}
                          >
                            <span>{item.question}</span>
                            <ChevronIcon
                              className={cn(
                                "h-5 w-5 shrink-0 transition-transform duration-300",
                                isOpen && "rotate-180"
                              )}
                            />
                          </button>
                          {isOpen && (
                            <div className="pb-4 text-bark text-body leading-relaxed">
                              <p>{item.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="text-center space-y-4">
              <h2 className="font-camp text-charcoal">Still have questions?</h2>
              <p className="text-bark text-body leading-relaxed">
                Give us a call at{" "}
                <a href="tel:9085802267" className="text-camp-red font-semibold hover:underline">
                  (908) 580-CAMP
                </a>{" "}
                or request more information and we&apos;ll be happy to help.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Button variant="primary" href={EXTERNAL_LINKS.inquiryForm} external>
                  Request Information
                </Button>
                <Button variant="secondary" href={EXTERNAL_LINKS.camperApp} external>
                  Apply Now
                </Button>
              </div>
            </div>
          </AnimateIn>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
