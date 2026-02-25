import type { Metadata } from "next";
import Link from "next/link";
import { InnerPageLayout } from "@/components/navigation/InnerPageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { StaffCard } from "@/components/ui/StaffCard";
import type { StaffMember } from "@/types";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Directors & Senior Staff",
  description:
    "Meet the Breene family and senior staff who have been running Camp Riverbend since 1962.",
};

// Hardcoded staff data — will be replaced with DB queries when Neon is connected
const staffData: StaffMember[] = [
  // Directors
  {
    id: "1",
    name: "Roger Breene",
    title: "Director",
    section: "directors",
    sortOrder: 0,
    isActive: true,
    photoUrl: null,
    bio: "Roger Breene is Marianne and Harold's oldest child. Camp has been a part of Roger's life since it started in 1962. He was a camper, and then worked on the maintenance staff, as a swim instructor and lifeguard and then as the Waterfront Director. It was during his time as Waterfront Director that Roger met his wife, Debbie, who was then a counselor. To this day, she continues to serve as the head of F Division. Roger returned to Camp in approximately 1997 as an Assistant Director, after working full-time as a practicing attorney. Now retired from the practice of law, Roger loves to spend the off-season pursuing his hobbies, which include golf, cycling, skiing and paddle tennis, and of course visiting his grandchildren in Colorado and spending time with his grandchildren in Summit!",
  },
  {
    id: "2",
    name: "Jill Breene Cheng",
    title: "Director",
    section: "directors",
    sortOrder: 1,
    isActive: true,
    photoUrl: null,
    bio: "Jill Breene Cheng has been at Camp Riverbend since she was 5 years old. She started typing camper lists (on a typewriter, with carbon paper!) while she was still in high school. She worked side by side with her Dad, Harold, learning how to run a camp from a very young age. Jill graduated from the College of New Jersey with a degree in Art Therapy. She has three children who have all been campers and counselors at Camp Riverbend and now is the grandmother to two girls and one boy. Her interests are travel and design and playing with her grandchildren.",
  },
  {
    id: "3",
    name: "Paul Breene",
    title: "Director",
    section: "directors",
    sortOrder: 2,
    isActive: true,
    photoUrl: null,
    bio: "Paul Breene grew up at Riverbend and only left for a few years to get a law degree. Paul is married to our program director, Miriam Peretsman and is the father of two former campers and counselors. Paul loves everything about camp and looks forward every year to the first day of staff orientation, which is kind of like baseball spring training in that it is filled with anticipation of another great season with our incredibly talented and devoted staff. Paul loves to help lead morning assemblies and especially loves leading the campfires when D, E and F Division groups have their late nights. In his spare time, Paul gardens, skis, golfs (badly), and reads.",
  },
  {
    id: "4",
    name: "Robin Breene Hetrick",
    title: "Waterfront Director",
    section: "directors",
    sortOrder: 3,
    isActive: true,
    photoUrl: null,
    bio: "Robin Breene Hetrick was too young to be a camper when Camp Riverbend opened, so she toddled around camp with her babysitter. Robin graduated from the University of Delaware with a degree in Physical Therapy. She worked as a physical therapist full time for 6 years and then came back to camp. Robin has been the Waterfront Director since the early 1990s. Both her daughters worked at camp and got married here too. In the off-season she spends time in Florida playing golf and of course swimming! Continuing a tradition started by her father, Robin does cartwheels every Friday afternoon to mark the successful completion of another week at camp.",
  },
  // Division Heads
  {
    id: "5",
    name: "Miriam Peretsman Breene",
    title: "Program Director",
    section: "division_heads",
    sortOrder: 0,
    isActive: true,
    photoUrl: null,
    bio: "Miriam Peretsman Breene had her first summer camp experience as a Girl Scout on Long Island. She has been here at Camp Riverbend since 1988, first as the newspaper editor for one year, and then as the program director every year since then. Miriam studied at the University of Pennsylvania and she met her husband Paul Breene during her (and his) junior year abroad in London. Miriam likes to read, snowshoe, bake and travel.",
  },
  {
    id: "6",
    name: "Katie Higgins",
    title: "Clubhouse Division Head",
    section: "division_heads",
    sortOrder: 1,
    isActive: true,
    photoUrl: null,
    bio: "Katie Higgins has a BA in Art Education and holds a MA in Early Childhood and Elementary Education. She is currently an Art Teacher at a local elementary school. She loves working with kids and getting them excited about new experiences! Katie remembers her first summer working as a junior counselor when she realized she wanted to continue to work with kids and make an impact in their lives. In her free time, Katie loves to travel, explore new places, go to museums, watch movies, snowboard and play sports.",
  },
  {
    id: "7",
    name: "Jenni Hetrick Lawrence",
    title: "B Division Head",
    section: "division_heads",
    sortOrder: 2,
    isActive: true,
    photoUrl: null,
    bio: "Jenni Hetrick has been a Riverbender all her life and is part of the third generation of Breenes at Riverbend. She was a camper, a lifeguard, and a counselor before becoming a Division Head. Jenni has a Master's Degree in Elementary Education and worked as a teacher before becoming an Assistant Principal on the Upper West Side in Manhattan. Jenni currently lives in Hoboken and looks forward to the summer along with her two kids who are Riverbend regulars.",
  },
  {
    id: "8",
    name: "Mike Glackin",
    title: "C Division Head",
    section: "division_heads",
    sortOrder: 3,
    isActive: true,
    photoUrl: null,
    bio: "Mike Glackin has been a counselor at Camp Riverbend since he was in college in 2005, following in the tracks of his mother who was a counselor in the 1970's. Mike is a high school teacher in Edison now. Mike met his wife Jen at Camp (another Riverbend romance) and at their wedding the happy couple came to Riverbend for a game of gaga after the ceremony! Now Mike and Jen have two kids who are also Riverbenders! Mike is an accomplished bagpiper who has performed at many of our Counselor Talent Shows.",
  },
  {
    id: "9",
    name: "Brian Bigelow",
    title: "D Division Head",
    section: "division_heads",
    sortOrder: 4,
    isActive: true,
    photoUrl: null,
    bio: "Brian has been at Riverbend since 2005, as a group counselor and the Spirit specialist. During the school year, he teaches high school biology. Brian has degrees in Biology and Secondary Education. He's the father of two campers and, in his free time, he enjoys playing disc golf, coaching his son in soccer, beating Super Mario Odyssey, and obsessing over the 49ers, NJ Devils, and Yankees.",
  },
  {
    id: "10",
    name: "Jeff Kaesshaefer",
    title: "E Division Head",
    section: "division_heads",
    sortOrder: 5,
    isActive: true,
    photoUrl: null,
    bio: "Jeff Kaesshaefer has worked at Riverbend since 2003. He has taught elementary physical education at South Mountain School in South Orange since 1997. Jeff has 3 kids, all of whom were Riverbend campers in their day and later became counselors. During the school year, he coaches boys and girls lacrosse in his home town. To stay active, Jeff likes to run, play basketball, and spend time outdoors.",
  },
  {
    id: "11",
    name: "Debbie Breene",
    title: "F Division Head",
    section: "division_heads",
    sortOrder: 6,
    isActive: true,
    photoUrl: null,
    bio: "Debbie Breene met her husband Roger Breene at Camp Riverbend in 1977 and has been working at camp ever since that time. She was a Spanish teacher for 5 years, had her family and then taught at the Co-op Nursery School in Summit for 20 years. Debbie is a substitute teacher in Summit at several elementary schools. She enjoys mah jongg, skiing, collecting sea glass at the Jersey shore, cooking and exercising with her Peloton. Debbie and Roger have four grandchildren who attend camp during the summer.",
  },
  // Assistant Division Heads
  {
    id: "12",
    name: "Emily Tomasulo",
    title: "Assistant Division Head",
    section: "assistant_heads",
    sortOrder: 0,
    isActive: true,
    photoUrl: null,
    bio: "Camp Riverbend has always been a summer home for Emily. She was a Riverbend camper for 10 years, then worked as an E Division group counselor before becoming an Assistant Division Head. During the year she is a fourth grade teacher in Scotch Plains. This year Emily became a mom, and is excited for the day her son will love Riverbend too! In her spare time, Emily loves to hike, travel, go to country concerts, and bake!",
  },
  {
    id: "13",
    name: "Samira Brito",
    title: "Assistant Division Head",
    section: "assistant_heads",
    sortOrder: 1,
    isActive: true,
    photoUrl: null,
    bio: "Samira first worked as a counselor at Camp Riverbend in 2007. After a few years away, she returned to Camp in 2019 and has been hooked ever since. Samira holds a B.A. in English from Seton Hall University and is a Primary Lead teacher in a Montessori school in Jersey City. Samira is a proud daughter of Jersey City girl, but thoroughly enjoys her summers outdoors at Riverbend. In her free time, Samira is a full-time soccer mom who cheers her son on from the side lines.",
  },
  {
    id: "14",
    name: 'Emily "Goldie" Goldstein',
    title: "Assistant Division Head",
    section: "assistant_heads",
    sortOrder: 2,
    isActive: true,
    photoUrl: null,
    bio: 'Emily has been teaching in Westfield for many years and takes great pride in her class, also known as "Goldie\'s Firsties". Emily has her Masters in Educational Leadership and Administration and an undergraduate sociology degree. She grew up going to day camp and loves that she gets to share the experience with her son. Emily likes to bake, listen to audiobooks and take walks outside.',
  },
  {
    id: "15",
    name: "Tamie Stearns",
    title: "Assistant Division Head",
    section: "assistant_heads",
    sortOrder: 3,
    isActive: true,
    photoUrl: null,
    bio: 'Tamie has been a Special Education teacher since 2008, when she graduated from Seton Hall University. She instantly fell in love with the energy and atmosphere of Camp Riverbend when she joined the staff in 2021. Tamie loves to spend time with her husband and her two daughters (aka "the ladies"). She\'s a self-proclaimed "foodie" with an appreciation for houseplants. Her summers are now dedicated to the ladies and Camp Riverbend.',
  },
  {
    id: "16",
    name: "Mike Wnoroski",
    title: "Assistant Division Head",
    section: "assistant_heads",
    sortOrder: 4,
    isActive: true,
    photoUrl: null,
    bio: "Michael joined the Camp Riverbend team as a group counselor in 2019. He has worked as a public school counselor in Passaic County for over a decade, helping countless elementary and middle school students navigate their academic and personal challenges. In addition to his professional achievements, Mike is a proud parent; his daughter was a camper and now works here too! In his free time, Mike enjoys spending time with his family, exploring the great outdoors, and playing the guitar.",
  },
  // Founders
  {
    id: "17",
    name: "Harold Breene",
    title: "Founder",
    section: "founders",
    sortOrder: 0,
    isActive: true,
    photoUrl: null,
    bio: "The late Harold Breene was involved in camping his whole life! After a stint in the Army during World War II, he earned a Masters Degree in Camping Education from NYU. He was the Athletic Director of a local private school, and then a college professor of Recreation and Camp Administration. Harold was a proud Eagle Scout, and was a scoutmaster in Berkeley Heights for many years. He was also a stalwart member of the American Camp Association, serving as President of the New Jersey section and of the Association of Independent Camps. He worked to improve camp quality nationwide as a member of the national ACA Standards Board. Harold passed away in 2019 but his legacy will continue to inspire generations of campers and counselors.",
  },
  {
    id: "18",
    name: "Marianne Breene",
    title: "Founder",
    section: "founders",
    sortOrder: 1,
    isActive: true,
    photoUrl: null,
    bio: "The late Marianne Breene was the very first counselor for our preschool campers. For many years she was the director of the Summit Co-Op Nursery School. She earned a degree in Early Childhood Education from Kean University when her own children were in college and high school. She was an avid bridge player and loved to read and go to the theater. She and Harold had 4 children and 10 grandchildren, who have been campers and then counselors. Marianne passed away in 2017 but her values continue to inspire how Camp Riverbend is run.",
  },
];

function StaffSection({
  title,
  staff,
  bg,
  columns = 3,
}: {
  title: string;
  staff: StaffMember[];
  bg: "cream" | "white" | "sand";
  columns?: number;
}) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <Section bg={bg} padding="default">
      <Container>
        <AnimateIn>
          <h2 className="font-camp text-center mb-10">{title}</h2>
        </AnimateIn>
        <div className={`grid ${gridCols} gap-8`}>
          {staff.map((member, i) => (
            <StaffCard key={member.id} staff={member} index={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default function BreeneFamilyPage() {
  const directors = staffData.filter((s) => s.section === "directors");
  const divisionHeads = staffData.filter((s) => s.section === "division_heads");
  const assistantHeads = staffData.filter((s) => s.section === "assistant_heads");
  const founders = staffData.filter((s) => s.section === "founders");

  return (
    <InnerPageLayout>
      {/* Page Header */}
      <PageHeader
        title="Directors & Senior Staff"
        subtitle="The Breene family and senior staff have been running Camp Riverbend for over 60 years"
        bgImage="https://cdn.campriverbend.com/wp-content/uploads/2022/07/ADV06620-scaled.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Riverbend", href: "/about-riverbend" },
          { label: "Directors & Staff" },
        ]}
      />

      {/* Back link */}
      <Section bg="cream" padding="none" animate={false}>
        <Container className="pt-6">
          <Link
            href="/about-riverbend"
            className="inline-flex items-center gap-2 text-sm font-medium text-bark hover:text-camp-red transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to About Riverbend
          </Link>
        </Container>
      </Section>

      {/* Directors */}
      <StaffSection
        title="Directors"
        staff={directors}
        bg="cream"
        columns={4}
      />

      {/* Division Heads */}
      <StaffSection
        title="Division Heads"
        staff={divisionHeads}
        bg="white"
        columns={3}
      />

      {/* Assistant Division Heads */}
      <StaffSection
        title="Assistant Division Heads"
        staff={assistantHeads}
        bg="cream"
        columns={3}
      />

      {/* Founders — special treatment */}
      <Section bg="sand" padding="default">
        <Container size="narrow">
          <AnimateIn>
            <div className="text-center mb-4">
              <span className="text-caption text-camp-red tracking-widest">
                In Loving Memory
              </span>
              <h2 className="font-camp mt-2">Our Founders</h2>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {founders.map((member, i) => (
              <StaffCard key={member.id} staff={member} index={i} />
            ))}
          </div>
        </Container>
      </Section>
    </InnerPageLayout>
  );
}
