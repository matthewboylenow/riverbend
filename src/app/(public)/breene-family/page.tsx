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
import { db } from "@/lib/db";
import { staffMembers } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Directors & Senior Staff",
  description:
    "Meet the Breene family and senior staff who have been running Camp Riverbend since 1962.",
};

// Revalidate every 5 minutes — staff edits in admin show up promptly without a deploy
export const revalidate = 300;

async function getStaff(): Promise<StaffMember[]> {
  try {
    const rows = await db
      .select()
      .from(staffMembers)
      .where(eq(staffMembers.isActive, true))
      .orderBy(asc(staffMembers.section), asc(staffMembers.sortOrder));
    return rows as StaffMember[];
  } catch (err) {
    console.error("Failed to load staff from DB:", err);
    return [];
  }
}

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
  if (!staff.length) return null;

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

export default async function BreeneFamilyPage() {
  const staffData = await getStaff();
  const directors = staffData.filter((s) => s.section === "directors");
  const divisionHeads = staffData.filter((s) => s.section === "division_heads");
  const assistantHeads = staffData.filter((s) => s.section === "assistant_heads");
  const founders = staffData.filter((s) => s.section === "founders");

  return (
    <InnerPageLayout>
      <PageHeader
        title="Directors & Senior Staff"
        subtitle="The Breene family and senior staff have been running Camp Riverbend for over 60 years"
        bgImage="/assets/site/ADV06620.jpg-marketing-scaled.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Riverbend", href: "/about-riverbend" },
          { label: "Directors & Staff" },
        ]}
      />

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

      <StaffSection title="Directors" staff={directors} bg="cream" columns={4} />
      <StaffSection title="Division Heads" staff={divisionHeads} bg="white" columns={3} />
      <StaffSection
        title="Assistant Division Heads"
        staff={assistantHeads}
        bg="cream"
        columns={3}
      />

      {founders.length > 0 && (
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
      )}
    </InnerPageLayout>
  );
}
