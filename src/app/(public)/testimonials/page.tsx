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
  "Camp Riverbend is the best — you make new friends. They have really fun activities.",
  "I love Camp Riverbend and wish I could keep coming.",
  "The best thing about Camp Riverbend is that you can make so many friends and there are so many cool and fun things to do.",
  "Camp Riverbend has been amazing. This is the best camp I have been to so far. This camp has so many fun things that I really enjoy. Everyone is very kind.",
  "This camp is great. It made for a really fun summer.",
  "I've been going to Camp Riverbend for 9 years and learned to swim here! Maybe I'll even be a counselor here one day, too!",
  "I think about Camp Riverbend throughout the year and can't wait to see my summer friends again. I just wish camp was all year long!",
  "I can't wait to get back to Camp Riverbend so I can do archery, swim & gameology!",
];

const parentQuotes = [
  {
    quote:
      "My son had another excellent camp experience this summer. He came home in tears tonight upset that camp is over. He had such a great fondness for his counselors and was ecstatic when Robin took the time to work with him on his swimming skills to pass the deep water test. He tried different food he would never try at home. He participated in activities that he would have never experienced if it wasn't for Camp Riverbend. He made great friends and overall I cannot say enough wonderful things about this camp. It is truly a magical experience for these kids. The Breene family runs a dynamic program for 7 weeks and it is done with every detail planned and thought of. I am in awe of everything about it!",
    name: "Allyson",
    town: "Basking Ridge",
  },
  {
    quote:
      "Camp Riverbend is an incredible experience! The kids love all the activities and the Camp takes care of everything -- bus, lunch, even ice cream treats!",
    name: "Erica",
    town: "Westfield",
  },
  {
    quote:
      "We love Camp Riverbend. Our daughter spent 7 weeks here last summer and she loved every minute of her Camp experience. I am so glad we picked Camp Riverbend!",
    name: "John",
    town: "New Providence",
  },
  {
    quote:
      "My daughter had such a great first summer at Riverbend. She couldn't wait for the bus to come everyday! She is so excited for next summer.",
    name: "Lucinda",
    town: "Berkeley Heights",
  },
  {
    quote:
      "We love everything Camp Riverbend has to offer, keeping our girls busy and happy all summer! Both girls advanced so much because of your swimming lessons.",
    name: "Sherri",
    town: "Basking Ridge",
  },
  {
    quote:
      "As a first-time Camp Riverbender this year, my son loved every moment! I was thankful for amazing bus drivers and caring camp counselors. Thanks Camp Riverbend!",
    name: "Megan",
    town: "New Providence",
  },
  {
    quote:
      "Camp Riverbend is all about tradition! We are thrilled to be part of the Riverbend family for years to come!",
    name: "Lisa",
    town: "Bedminster",
  },
  {
    quote: "My son is super high-energy. I'm just glad Camp Riverbend can keep up with him!",
    name: "David",
    town: "Berkeley Heights",
  },
  {
    quote:
      "We love camp Riverbend! There are so many fun and exciting activities. The staff is wonderful with the kids.",
    name: "Jaime",
    town: "Mountainside",
  },
  {
    quote:
      "Camp Riverbend helped my kids learn to swim when they were younger and the variety of other activities are impressive. They also continually improve the camp - every year there seems to be at least one new major addition build for the kids. And the staff, both the group counselors and the activity heads, are uniformly excellent. But most importantly, the kids love it.",
    name: "Diane",
    town: "Westfield",
  },
  {
    quote:
      "We love Camp Riverbend. My children feel so safe, happy and loved there, and can't wait for another summer of new adventures and friendships. They especially love the Camp Riverbend traditions that make this place so special. From the lanyard to the cookouts, sing-a-longs, to the special events and counselor talent show, the Breene family certainly knows how to 'do camp'!",
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
