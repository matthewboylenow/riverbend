"use client";

import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { EXTERNAL_LINKS } from "@/lib/navigation";

// Note: metadata export is not supported in "use client" components.
// Move to a parent layout or use generateMetadata in a server wrapper if needed.

const camperQuotes = [
  "My favorite thing about Camp Riverbend is you make new friends. They have really fun activities.",
  "I love Camp Riverbend and wish I could keep coming.",
  "What I like about Camp Riverbend is that you can make so many friends and there are so many cool and fun things to do.",
  "My experience at Camp Riverbend has been amazing. This is the best camp I have been to so far.",
  "My experience with Riverbend has not only helped me make new friends but also have fun. I started when I was 3 and have been coming ever since, I am now 13.",
  "This camp is great. It made for a really fun summer.",
  "I've been a camper at Camp Riverbend for 9 years and learned to swim here!",
  "Camp is my favorite time of the year! I always get so excited hearing from Camp Riverbend.",
  "My favorite part of camp is the free & instructional swim. I've been a camper for 8 years.",
  "I love doing lanyard and arts and crafts. I love all my camp friends!",
  "My favorite part about camp is all the friends I made. Also the mini zip line and canoes.",
  "What do I like most about camp?? The pool, the rock wall and the zip line. Wait — no, everything!!!",
  "I can't wait for Camp Riverbend so I can do archery, swim & gameology!",
];

const parentQuotes = [
  {
    quote:
      "My son had another excellent camp experience this summer. He came home in tears tonight upset that camp is over.",
    name: "Allyson",
    town: "Basking Ridge",
  },
  {
    quote:
      "We love Riverbend! There are tons and tons of awesome activities and no better counselors around!",
    name: "Erica",
    town: "Westfield",
  },
  {
    quote:
      "Camp Riverbend is an incredible experience! The kids love all the activities and the Camp takes care of everything.",
    name: "John",
    town: "New Providence",
  },
  {
    quote:
      "Since the very first time we came for an open house visit we knew there was something special and even magical about Camp Riverbend.",
    name: "Lucinda",
    town: "Berkeley Heights",
  },
  {
    quote:
      "My daughter had such a great first summer at Riverbend. She couldn't wait for the bus to come everyday!",
    name: "Amanda",
    town: "Summit",
  },
  {
    quote:
      "We love everything Camp Riverbend has to offer, keeping our girls busy and happy all summer!",
    name: "Sherri",
    town: "Basking Ridge",
  },
  {
    quote:
      "As a new Camp Riverbender this year, my son loved every moment! I was thankful for amazing bus drivers.",
    name: "Megan",
    town: "New Providence",
  },
  {
    quote:
      "We love how Camp Riverbend is all about tradition! We are thrilled to be part of the Riverbend family.",
    name: "Ben",
    town: "Westfield",
  },
  {
    quote:
      "We love how excited our son, Jack is for camp everyday in the summer. He is very active.",
    name: "Lisa",
    town: "Bedminster",
  },
  {
    quote:
      "We absolutely love camp Riverbend! There are so many fun and exciting activities. The staff is wonderful.",
    name: "Nicole",
    town: "Warren",
  },
  {
    quote:
      "When choosing a camp for our kids, picking Riverbend was an obvious choice. I've known the camp for 40 years.",
    name: "David",
    town: "Berkeley Heights",
  },
  {
    quote:
      "It has been a true gift and pleasure watching my children grow and thrive during their summers at Camp Riverbend.",
    name: "Lori",
    town: "Summit",
  },
  {
    quote:
      "This is our second season at Camp Riverbend and the experience keeps getting better. What stands out the most is the thoughtful detail.",
    name: "Jaime",
    town: "Mountainside",
  },
  {
    quote:
      "Every day is something new for the twins to look forward to. You Breenes have really cracked the code on summer campers.",
    name: "Diane",
    town: "Westfield",
  },
  {
    quote:
      "The Breenes offer a top-notch day camp program and are visible throughout the entire camp, overseeing the daily operations.",
    name: "Jodi",
    town: "Hoboken",
  },
  {
    quote:
      "Nowhere I'd rather send my girls to camp than Camp Riverbend! I know that they are safe, cared for, happy as can be.",
    name: "Rachel",
    town: "Scotch Plains",
  },
];

export default function TestimonialsPage() {
  return (
    <InnerPageLayout>
      <PageHeader
        title="Testimonials"
        subtitle="Hear from our campers and families"
        bgImage="/assets/site/ADV07400.jpg-marketing-scaled.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Testimonials" },
        ]}
      />

      {/* Section 1: Camper Quotes */}
      <Section id="camper-quotes" bg="cream" padding="default">
        <Container>
          <AnimateIn>
            <h2 className="font-camp text-center mb-10">What Campers Are Saying&hellip;</h2>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {camperQuotes.map((quote, i) => (
              <AnimateIn key={i} delay={i * 0.05}>
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                  <div className="text-camp-red text-4xl font-serif leading-none mb-3">&ldquo;</div>
                  <p className="text-bark text-body leading-relaxed italic">{quote}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 2: Parent Quotes */}
      <Section id="parent-quotes" bg="white" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <h2 className="font-camp text-center mb-10">What Parents Are Saying&hellip;</h2>
          </AnimateIn>
          <div className="flex flex-col gap-6">
            {parentQuotes.map((item, i) => (
              <AnimateIn key={i} delay={i * 0.04}>
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-sand">
                  <div className="text-camp-red text-4xl font-serif leading-none mb-3">&ldquo;</div>
                  <p className="text-bark text-body leading-relaxed italic">{item.quote}</p>
                  <p className="mt-4 text-sm font-semibold text-camp-red">
                    &mdash; {item.name}, {item.town}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 3: CTA */}
      <section className="bg-charcoal py-16 md:py-20">
        <Container>
          <AnimateIn>
            <div className="text-center space-y-6">
              <h2 className="text-white font-camp">Ready to join the Riverbend family?</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="primary" href={EXTERNAL_LINKS.camperApp} external>
                  Apply Now
                </Button>
                <Button variant="white" href={EXTERNAL_LINKS.inquiryForm} external>
                  Request Information
                </Button>
              </div>
            </div>
          </AnimateIn>
        </Container>
      </section>
    </InnerPageLayout>
  );
}
