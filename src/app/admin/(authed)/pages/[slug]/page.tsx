import { notFound } from "next/navigation";
import GenericPageEditor from "@/components/admin/GenericPageEditor";
import { RATES_DATES_SCHEMA } from "@/lib/page-schemas/rates-dates";
import { ABOUT_RIVERBEND_SCHEMA } from "@/lib/page-schemas/about-riverbend";
import { CALENDAR_SCHEMA } from "@/lib/page-schemas/calendar";
import { LUNCH_SCHEMA } from "@/lib/page-schemas/lunch";
import { TRANSPORTATION_SCHEMA } from "@/lib/page-schemas/transportation";
import { VIDEOS_SCHEMA } from "@/lib/page-schemas/videos";
import { CAMP_RIVERBEND_APP_SCHEMA } from "@/lib/page-schemas/camp-riverbend-app";
import { HEALTH_SAFETY_SCHEMA } from "@/lib/page-schemas/health-safety";
import { PROGRAMS_SCHEMA } from "@/lib/page-schemas/programs";
import { CLUBHOUSE_SCHEMA } from "@/lib/page-schemas/clubhouse";
import type { PageSchema } from "@/lib/page-schemas/types";

const SCHEMAS: Record<string, PageSchema> = {
  [RATES_DATES_SCHEMA.slug]: RATES_DATES_SCHEMA,
  [ABOUT_RIVERBEND_SCHEMA.slug]: ABOUT_RIVERBEND_SCHEMA,
  [CALENDAR_SCHEMA.slug]: CALENDAR_SCHEMA,
  [LUNCH_SCHEMA.slug]: LUNCH_SCHEMA,
  [TRANSPORTATION_SCHEMA.slug]: TRANSPORTATION_SCHEMA,
  [VIDEOS_SCHEMA.slug]: VIDEOS_SCHEMA,
  [CAMP_RIVERBEND_APP_SCHEMA.slug]: CAMP_RIVERBEND_APP_SCHEMA,
  [HEALTH_SAFETY_SCHEMA.slug]: HEALTH_SAFETY_SCHEMA,
  [PROGRAMS_SCHEMA.slug]: PROGRAMS_SCHEMA,
  [CLUBHOUSE_SCHEMA.slug]: CLUBHOUSE_SCHEMA,
};

export default async function PageEditor({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const schema = SCHEMAS[slug];
  if (!schema) notFound();
  return <GenericPageEditor schema={schema as PageSchema} />;
}
