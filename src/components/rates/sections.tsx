/**
 * Section components + content helpers shared by the rates pages
 * (/rates-dates-application and /rates-dates-application-2027). Both
 * pages render the same section designs; only the CMS content slug and
 * defaults differ.
 */
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { sanitizeHtml } from "@/lib/sanitize";
import type { TableContent } from "@/lib/page-content";
import type { DiscountRow, PaymentRow } from "@/lib/page-defaults/rates-dates";

export const DEFAULT_TUITION_COLUMNS = [
  { key: "duration", label: "Duration" },
  { key: "inCamp", label: "In Camp" },
  { key: "dayTripper", label: "Day Tripper" },
  { key: "threeQuarter", label: "Three-Quarter Day" },
];

// Normalize a tuition "table" block: tolerate older "rows"-block content
// that lacks a columns array (fall back to the default column layout), and
// hide columns with no data — handles accidental "Add column" clicks in
// the admin editor that left a placeholder column behind.
export function normalizeTable(raw: Partial<TableContent>) {
  const rawColumns =
    Array.isArray(raw.columns) && raw.columns.length > 0
      ? raw.columns
      : DEFAULT_TUITION_COLUMNS;
  const rows = Array.isArray(raw.rows) ? raw.rows : [];
  const columns = rawColumns.filter((col) =>
    rows.some((row) => (row[col.key] ?? "").toString().trim() !== "")
  );
  return { columns, rows };
}

// Drop rows whose every cell is blank — the admin editor's "Add row"
// button can leave empty placeholder rows behind, and sections use
// "no rows" to mean "keep me off the public page."
export function nonBlankRows<T extends object>(rows: T[]): T[] {
  if (!Array.isArray(rows)) return [];
  return rows.filter((row) =>
    Object.values(row).some((v) => (v ?? "").toString().trim() !== "")
  );
}

export function TuitionTableSection({
  id,
  heading,
  note,
  columns,
  rows,
}: {
  id: string;
  heading: string;
  note: string;
  columns: Array<{ key: string; label: string }>;
  rows: Array<Record<string, string>>;
}) {
  return (
    <Section id={id} bg="white" padding="default">
      <Container>
        <AnimateIn>
          <div className="text-center mb-8">
            <h2 className="font-camp">{heading}</h2>
          </div>
        </AnimateIn>
        <AnimateIn delay={0.1}>
          {note && (
            <div className="mb-4 flex justify-center">
              <p className="inline-block bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-2 text-sm font-medium">
                {note}
              </p>
            </div>
          )}
          <div className="overflow-x-auto rounded-2xl shadow-sm border border-stone/30">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-camp-red">
                  {columns.map((col) => (
                    <th key={col.key} className="py-3 px-4 font-camp text-charcoal">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone/30">
                {rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-cream/40"}>
                    {columns.map((col, ci) => (
                      <td
                        key={col.key}
                        className={
                          ci === 0
                            ? "py-3 px-4 font-semibold text-charcoal"
                            : "py-3 px-4 text-bark"
                        }
                      >
                        {row[col.key] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimateIn>
      </Container>
    </Section>
  );
}

export function DiscountsSection({
  id,
  heading,
  rows,
}: {
  id: string;
  heading: string;
  rows: DiscountRow[];
}) {
  return (
    <Section id={id} bg="cream" padding="default">
      <Container>
        <AnimateIn>
          <div className="text-center mb-10">
            <h2 className="font-camp">{heading}</h2>
          </div>
        </AnimateIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rows.map((discount, i) => (
            <AnimateIn key={`${discount.heading}-${i}`} delay={i * 0.1}>
              <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
                <h3 className="font-camp text-lg mb-3 text-camp-red">{discount.heading}</h3>
                <p className="text-bark leading-relaxed">{discount.body}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function PaymentScheduleSection({
  id,
  heading,
  rows,
}: {
  id: string;
  heading: string;
  rows: PaymentRow[];
}) {
  return (
    <Section id={id} bg="white" padding="default">
      <Container size="narrow">
        <AnimateIn>
          <div className="text-center mb-10">
            <h2 className="font-camp">{heading}</h2>
          </div>
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <div className="space-y-4">
            {rows.map((item, i) => (
              <div
                key={`${item.label}-${i}`}
                className="flex gap-5 items-start bg-cream/50 rounded-2xl p-5 border border-stone/20"
              >
                <div className="shrink-0 w-8 h-8 rounded-full bg-camp-red text-white flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-charcoal font-camp">{item.label}</p>
                  <p className="text-bark leading-relaxed mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimateIn>
      </Container>
    </Section>
  );
}

export function ExtrasSection({ id, html }: { id: string; html: string }) {
  return (
    <Section id={id} bg="white" padding="sm">
      <Container size="narrow">
        <AnimateIn>
          <div
            className="prose prose-lg max-w-2xl mx-auto text-bark [&_h2]:font-camp [&_h2]:text-charcoal [&_h2]:text-center [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:font-camp [&_h3]:text-charcoal [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
          />
        </AnimateIn>
      </Container>
    </Section>
  );
}

export function PoliciesSection({
  id,
  heading,
  html,
}: {
  id: string;
  heading: string;
  html: string;
}) {
  return (
    <Section id={id} bg="cream" padding="default">
      <Container size="narrow">
        <AnimateIn>
          <div className="space-y-6">
            {heading && <h2 className="font-camp text-center">{heading}</h2>}
            <div
              className="prose prose-lg max-w-none text-bark [&_h2]:font-camp [&_h2]:text-charcoal [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:font-camp [&_h3]:text-charcoal [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
            />
          </div>
        </AnimateIn>
      </Container>
    </Section>
  );
}
