import { notFound } from "next/navigation";
import GenericPageEditor from "@/components/admin/GenericPageEditor";
import { RATES_DATES_SCHEMA } from "@/lib/page-schemas/rates-dates";
import type { PageSchema } from "@/lib/page-schemas/types";

// Schemas registered for editing. Add a page here to make it editable.
const SCHEMAS: Record<string, PageSchema> = {
  [RATES_DATES_SCHEMA.slug]: RATES_DATES_SCHEMA,
};

export default async function PageEditor({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const schema = SCHEMAS[slug];
  if (!schema) notFound();
  return <GenericPageEditor schema={schema} />;
}
