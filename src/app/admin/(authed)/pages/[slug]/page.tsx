import { notFound } from "next/navigation";
import RatesEditor from "./RatesEditor";

const SUPPORTED_PAGES = ["rates-dates-application-2026"] as const;

export default async function PageEditor({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!SUPPORTED_PAGES.includes(slug as (typeof SUPPORTED_PAGES)[number])) {
    notFound();
  }

  if (slug === "rates-dates-application-2026") {
    return <RatesEditor />;
  }

  return null;
}
