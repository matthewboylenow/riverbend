import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { Button } from "@/components/ui/Button";
import { LinkCard } from "@/components/ui/LinkCard";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Activities | Camp Riverbend",
  description:
    "Located along the gentle Passaic River in Warren Township, New Jersey, Camp Riverbend has shady woods, open fields, nature trails, a wetlands sanctuary and a variety of athletic fields.",
};

const activityCards = [
  {
    name: "Adventure Course & High Ropes",
    image:
      "/assets/site/ADV02128-scaled.jpg",
  },
  {
    name: "Arts & Crafts",
    image:
      "/assets/site/ADV07000-scaled.jpg",
  },
  {
    name: "Nature",
    image:
      "/assets/site/DSC07172-scaled.jpg",
  },
  {
    name: "Cooking",
    image:
      "/assets/site/ADV01095-scaled.jpg",
  },
  {
    name: "Pedal Karts",
    image:
      "/assets/site/ADV06848-scaled.jpg",
  },
  {
    name: "Spray Park",
    image:
      "/assets/site/ADV06766-scaled.jpg",
  },
];

const ninjaElements = [
  "Stepping Stones",
  "The Tunnel",
  "The Terrace",
  "Monkey Bars/Tumbling Dice",
  "Rubble Over and Under",
  "Box Jump",
  "Curved Wall",
  "Wooden Balance Beam",
  "Tire Run",
  "Tight Wire",
  "Apex Ladder",
];

export default function ActivitiesPage() {
  return (
    <InnerPageLayout>
      {/* Page Header */}
      <PageHeader
        title="Activities at Riverbend"
        subtitle="Explore everything our 30-acre campus has to offer"
        bgImage="/assets/site/ADV01169.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Activities" },
        ]}
      />

      {/* Section 1: Intro */}
      <Section id="intro" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6 text-center">
              <p className="text-body-lg text-bark leading-relaxed">
                Camp Riverbend is located along the gentle Passaic River in
                Warren Township New Jersey. With approximately 30 acres, Camp
                Riverbend has shady woods, open fields, nature trails, a
                wetlands sanctuary and a variety of athletic fields. Take a look
                at all the activities and amenities Camp Riverbend has to offer!
              </p>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 2: Swimming */}
      <Section id="swimming" bg="white" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text left */}
            <AnimateIn direction="left">
              <div className="space-y-6">
                <h2 className="font-camp">Swimming</h2>
                <p className="text-body-lg text-bark leading-relaxed">
                  We are very proud of our exceptional swim program.
                </p>
                <p className="text-body-lg text-bark leading-relaxed">
                  Swimming is one of the most important skills to be learned at
                  camp. Our five heated, crystal-clear pools are designed for
                  teaching campers at all levels. The pools go from a depth of 1
                  foot to 11 feet so everyone feels comfortable.
                </p>
                <p className="text-body-lg text-bark leading-relaxed">
                  Campers enjoy swimming twice a day, in the morning for
                  instruction and in the afternoon for &ldquo;free swim&rdquo;.
                  Our experienced staff of lifeguards and water safety
                  instructors supervises the waterfront.
                </p>
              </div>
            </AnimateIn>

            {/* Image right */}
            <AnimateIn direction="right">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src="/assets/site/DSC_0553-scaled.jpg"
                  alt="Campers swimming in one of the five heated pools at Camp Riverbend"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>
          </div>

          {/* Swimming Video */}
          <AnimateIn delay={0.2}>
            <div className="mt-12">
              <VideoEmbed vimeoId="361310178" title="Aquatics Program" />
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 3: Sports */}
      <Section id="sports" bg="cream" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image left */}
            <AnimateIn direction="left">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src="/assets/site/ADV06281-scaled.jpg"
                  alt="Campers enjoying sports activities at Camp Riverbend"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>

            {/* Text right */}
            <AnimateIn direction="right">
              <div className="space-y-6">
                <h2 className="font-camp">Sports</h2>
                <p className="text-body-lg text-bark leading-relaxed">
                  At Camp Riverbend our campers enjoy a complete sports program
                  that emphasizes learning new skills, sportsmanship and team
                  cooperation. Our sports programs help campers discover new
                  abilities and gain a sense of achievement and success in
                  whatever they try. Coaches oversee and instruct sports
                  activities in camp.
                </p>
                <Button variant="primary" href="/sports">
                  Explore Sports
                </Button>
              </div>
            </AnimateIn>
          </div>

          {/* Sports Video */}
          <AnimateIn delay={0.2}>
            <div className="mt-12">
              <VideoEmbed vimeoId="382945475" title="Sports" />
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 4: Activity Grid */}
      <Section id="more-activities" bg="white" padding="default">
        <Container>
          <AnimateIn>
            <div className="text-center mb-10">
              <h2 className="font-camp">More Activities</h2>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {activityCards.map((activity, index) => (
              <AnimateIn key={activity.name} delay={index * 0.1}>
                <div className="group">
                  <div className="relative aspect-square overflow-hidden rounded-2xl mb-4">
                    <Image
                      src={activity.image}
                      alt={activity.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <h3 className="font-camp text-lg">{activity.name}</h3>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* Adventure Course Video */}
          <AnimateIn delay={0.2}>
            <div className="mt-12">
              <VideoEmbed
                vimeoId="382946991"
                title="Adventure Course & High Ropes"
              />
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 5: Ninja Course */}
      <Section id="ninja-course" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6 text-center">
              <h2 className="font-camp">Ninja Course</h2>
              <p className="text-body-lg text-bark leading-relaxed">
                Camp Riverbend has a Ninja Warrior training course for all
                campers, large and small, with these challenging elements:
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                {ninjaElements.map((element) => (
                  <span
                    key={element}
                    className="inline-block bg-white border border-sand rounded-full px-4 py-2 text-sm font-semibold text-bark shadow-sm"
                  >
                    {element}
                  </span>
                ))}
              </div>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 6: Performing Arts & Camper Choice */}
      <Section id="performing-arts" bg="white" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <AnimateIn direction="left">
              <div className="space-y-6">
                <h2 className="font-camp">Performing &amp; Circus Arts</h2>
                <p className="text-body-lg text-bark leading-relaxed">
                  Camp is a great place for children of all ages to explore
                  performing arts. Our Performance program introduces campers to
                  many techniques of performance, including improv, mime,
                  puppetry, movement, directing, and working with props and
                  costumes. Our Circus program introduces campers to the magic
                  of the Big Top with juggling and clown skills. Both take place
                  in our air-conditioned Studio.
                </p>
              </div>
            </AnimateIn>

            <AnimateIn direction="right">
              <div className="space-y-6">
                <h2 className="font-camp">Camper Choice</h2>
                <p className="text-body-lg text-bark leading-relaxed">
                  As campers get older they have the opportunity to choose more
                  of the activities they like best. Our Club program for campers
                  1st &ndash; 8th grades, before or after lunch Monday &ndash;
                  Thursday, is very flexible, and campers can switch clubs every
                  day. In Tracking, rising 4th &amp; 5th grade campers choose
                  activities to explore in depth twice a week; in Superchoice,
                  rising 6th &ndash; 8th grade campers pick their own
                  individualized schedule of activities three times a week.
                </p>
              </div>
            </AnimateIn>
          </div>
        </Container>
      </Section>

      {/* Section 7: Indoor Facilities */}
      <Section id="indoor-facilities" bg="cream" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="space-y-6 text-center">
              <h2 className="font-camp">Indoor Facilities</h2>
              <p className="text-body-lg text-bark leading-relaxed">
                In case of rainy days, campers have plenty of indoor spaces to
                choose from, including the Studio, the Big Barn, Auditorium,
                Roller Rink, Dining Pavilion &amp; Game Pavilion. Most of our
                indoor locations, including all Clubhouse cabins, are
                air-conditioned.
              </p>
              <p className="text-body-lg text-bark leading-relaxed">
                Our Game Pavilion, continually supervised, is the place where
                campers play ping pong, foosball, air hockey, bumper pool, knock
                hockey, billiards and other table games.
              </p>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Section 8: Learn More */}
      <Section bg="white" padding="default">
        <Container>
          <AnimateIn>
            <div className="text-center mb-10">
              <h2 className="font-camp">Learn More</h2>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <LinkCard
              title="Our Programs"
              href="/programs"
              image="/assets/site/ADV06620.jpg-marketing-scaled.jpg"
              index={0}
            />
            <LinkCard
              title="Rates & Dates"
              href="/rates-dates-application-2026"
              image="/assets/site/Canoe.jpg"
              index={1}
            />
            <LinkCard
              title="Sports"
              href="/sports"
              image="/assets/site/DSC_0553-scaled.jpg"
              index={2}
            />
          </div>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
