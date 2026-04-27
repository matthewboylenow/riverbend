"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2, ExternalLink, AlertCircle } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { RevisionsButton } from "@/components/admin/RevisionsButton";
import { RATES_DEFAULTS } from "@/lib/page-defaults/rates-dates";

const PAGE_SLUG = "rates-dates-application-2026";

type TuitionRow = {
  duration: string;
  inCamp: string;
  dayTripper: string;
  threeQuarter: string;
} & Record<string, string>;
type DiscountRow = {
  heading: string;
  body: string;
} & Record<string, string>;
type PaymentRow = {
  label: string;
  detail: string;
} & Record<string, string>;

interface State {
  hero_title: string;
  hero_subtitle: string;
  intro_html: string;
  tuition_note: string;
  tuition_rows: TuitionRow[];
  tuition_footer: string;
  discounts: DiscountRow[];
  payment_schedule: PaymentRow[];
  payment_footer_html: string;
  whats_included_html: string;
}

// Defaults shared with the public page so the editor always opens populated
// with current visible content — even before anything is in the DB.
const DEFAULT: State = {
  hero_title: RATES_DEFAULTS.hero_title,
  hero_subtitle: RATES_DEFAULTS.hero_subtitle,
  intro_html: RATES_DEFAULTS.intro_html,
  tuition_note: RATES_DEFAULTS.tuition_note,
  tuition_rows: RATES_DEFAULTS.tuition_rows as TuitionRow[],
  tuition_footer: RATES_DEFAULTS.tuition_footer,
  discounts: RATES_DEFAULTS.discounts as DiscountRow[],
  payment_schedule: RATES_DEFAULTS.payment_schedule as PaymentRow[],
  payment_footer_html: RATES_DEFAULTS.payment_footer_html,
  whats_included_html: RATES_DEFAULTS.whats_included_html,
};

export default function RatesEditor() {
  const [state, setState] = useState<State>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usingDefaults, setUsingDefaults] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/pages/${PAGE_SLUG}`);
    if (!res.ok) {
      setError(
        res.status === 401
          ? "Session expired — please reload."
          : "Couldn't load saved content. Showing current site copy as a starting point."
      );
      setUsingDefaults(true);
      setLoading(false);
      return;
    }
    const data = await res.json();
    const blocks: Record<string, { type: string; content: Record<string, unknown> }> =
      data.blocks || {};

    // Track whether ANY block came from the DB. If none did (fresh page or
    // empty DB), surface a banner so admins know to hit Save to lock in
    // current content.
    const presentKeys = [
      "hero_title",
      "hero_subtitle",
      "intro",
      "tuition_note",
      "tuition_rows",
      "tuition_footer",
      "discounts",
      "payment_schedule",
      "payment_footer",
      "whats_included",
    ].filter((k) => blocks[k] != null);
    setUsingDefaults(presentKeys.length === 0);

    setState({
      hero_title: (blocks.hero_title?.content?.value as string) ?? DEFAULT.hero_title,
      hero_subtitle: (blocks.hero_subtitle?.content?.value as string) ?? DEFAULT.hero_subtitle,
      intro_html: (blocks.intro?.content?.html as string) ?? DEFAULT.intro_html,
      tuition_note: (blocks.tuition_note?.content?.value as string) ?? DEFAULT.tuition_note,
      tuition_rows: ((blocks.tuition_rows?.content?.rows as TuitionRow[]) ?? DEFAULT.tuition_rows),
      tuition_footer:
        (blocks.tuition_footer?.content?.value as string) ?? DEFAULT.tuition_footer,
      discounts: ((blocks.discounts?.content?.rows as DiscountRow[]) ?? DEFAULT.discounts),
      payment_schedule:
        ((blocks.payment_schedule?.content?.rows as PaymentRow[]) ?? DEFAULT.payment_schedule),
      payment_footer_html:
        (blocks.payment_footer?.content?.html as string) ?? DEFAULT.payment_footer_html,
      whats_included_html:
        (blocks.whats_included?.content?.html as string) ?? DEFAULT.whats_included_html,
    });
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function saveBlock(blockKey: string, blockType: string, content: object) {
    const res = await fetch(`/api/pages/${PAGE_SLUG}/blocks/${blockKey}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockType, content }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Save failed");
    }
  }

  async function saveAll() {
    setSaving(true);
    setError(null);
    try {
      await Promise.all([
        saveBlock("hero_title", "text", { value: state.hero_title }),
        saveBlock("hero_subtitle", "text", { value: state.hero_subtitle }),
        saveBlock("intro", "richtext", { html: state.intro_html }),
        saveBlock("tuition_note", "text", { value: state.tuition_note }),
        saveBlock("tuition_rows", "rows", { rows: state.tuition_rows }),
        saveBlock("tuition_footer", "text", { value: state.tuition_footer }),
        saveBlock("discounts", "rows", { rows: state.discounts }),
        saveBlock("payment_schedule", "rows", { rows: state.payment_schedule }),
        saveBlock("payment_footer", "richtext", { html: state.payment_footer_html }),
        saveBlock("whats_included", "richtext", { html: state.whats_included_html }),
      ]);
      setSavedAt(new Date());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-bark">Loading…</p>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/pages"
          className="flex items-center justify-center h-9 w-9 rounded-lg bg-sand text-bark hover:text-charcoal"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-charcoal">Rates, Dates &amp; Application</h1>
          <p className="text-sm text-bark mt-0.5">
            <a
              href={`/${PAGE_SLUG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-camp-red"
            >
              View public page
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="text-xs text-green-700">
              Saved {savedAt.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={saveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-camp-red text-white font-semibold px-5 py-2 rounded-full hover:bg-camp-red-dark disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save All Changes"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
      )}

      {usingDefaults && !loading && (
        <div className="mb-4 flex items-start gap-3 text-sm bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-lg">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <strong>This page hasn&apos;t been saved through the editor yet.</strong> The
            fields below show the current live site copy. Click <em>Save All Changes</em>{" "}
            to lock these values into the editor — after that, every edit you make will
            persist and roll-back.
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Hero */}
        <Block label="Page Header" pageSlug={PAGE_SLUG} blockKey="hero_title" onRestored={load}>
          <Field label="Title">
            <input
              type="text"
              value={state.hero_title}
              onChange={(e) => setState({ ...state, hero_title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white"
            />
          </Field>
          <Field label="Subtitle">
            <input
              type="text"
              value={state.hero_subtitle}
              onChange={(e) => setState({ ...state, hero_subtitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white"
            />
          </Field>
        </Block>

        {/* Intro */}
        <Block label="Intro paragraphs" pageSlug={PAGE_SLUG} blockKey="intro" onRestored={load}>
          <RichTextEditor
            value={state.intro_html}
            onChange={(html) => setState({ ...state, intro_html: html })}
          />
        </Block>

        {/* Tuition table */}
        <Block label="Tuition rates table" pageSlug={PAGE_SLUG} blockKey="tuition_rows" onRestored={load}>
          <Field label="Note above table (orange banner)">
            <input
              type="text"
              value={state.tuition_note}
              onChange={(e) => setState({ ...state, tuition_note: e.target.value })}
              placeholder="(leave empty to hide)"
              className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white text-sm"
            />
          </Field>
          <RowEditor<TuitionRow>
            rows={state.tuition_rows}
            onChange={(rows) => setState({ ...state, tuition_rows: rows })}
            columns={[
              { key: "duration", label: "Duration" },
              { key: "inCamp", label: "In Camp" },
              { key: "dayTripper", label: "Day Tripper" },
              { key: "threeQuarter", label: "Three-Quarter Day" },
            ]}
            blank={{ duration: "", inCamp: "", dayTripper: "", threeQuarter: "" }}
          />
          <Field label="Footnote below table">
            <textarea
              value={state.tuition_footer}
              onChange={(e) => setState({ ...state, tuition_footer: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-stone bg-white text-sm resize-y"
            />
          </Field>
        </Block>

        {/* Discounts */}
        <Block label="Discounts" pageSlug={PAGE_SLUG} blockKey="discounts" onRestored={load}>
          <RowEditor<DiscountRow>
            rows={state.discounts}
            onChange={(rows) => setState({ ...state, discounts: rows })}
            columns={[
              { key: "heading", label: "Heading", width: "260px" },
              { key: "body", label: "Body", multiline: true },
            ]}
            blank={{ heading: "", body: "" }}
          />
        </Block>

        {/* Payment schedule */}
        <Block label="Payment schedule" pageSlug={PAGE_SLUG} blockKey="payment_schedule" onRestored={load}>
          <RowEditor<PaymentRow>
            rows={state.payment_schedule}
            onChange={(rows) => setState({ ...state, payment_schedule: rows })}
            columns={[
              { key: "label", label: "Label", width: "200px" },
              { key: "detail", label: "Detail", multiline: true },
            ]}
            blank={{ label: "", detail: "" }}
          />
        </Block>

        {/* Payment footer */}
        <Block label="Payment notes (below schedule)" pageSlug={PAGE_SLUG} blockKey="payment_footer" onRestored={load}>
          <RichTextEditor
            value={state.payment_footer_html}
            onChange={(html) => setState({ ...state, payment_footer_html: html })}
          />
        </Block>

        {/* What's included */}
        <Block label="What's Included section" pageSlug={PAGE_SLUG} blockKey="whats_included" onRestored={load}>
          <RichTextEditor
            value={state.whats_included_html}
            onChange={(html) => setState({ ...state, whats_included_html: html })}
          />
        </Block>

        <div className="flex justify-end pt-2 border-t border-stone/30">
          <button
            onClick={saveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-camp-red text-white font-semibold px-6 py-2.5 rounded-full hover:bg-camp-red-dark disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save All Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Block({
  label,
  pageSlug,
  blockKey,
  onRestored,
  children,
}: {
  label: string;
  pageSlug: string;
  blockKey: string;
  onRestored: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-stone/30 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-charcoal">{label}</h2>
        <RevisionsButton pageSlug={pageSlug} blockKey={blockKey} onRestored={onRestored} />
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-bark uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function RowEditor<T extends Record<string, string>>({
  rows,
  onChange,
  columns,
  blank,
}: {
  rows: T[];
  onChange: (rows: T[]) => void;
  columns: { key: keyof T & string; label: string; width?: string; multiline?: boolean }[];
  blank: T;
}) {
  function update(index: number, key: keyof T & string, value: string) {
    onChange(rows.map((r, i) => (i === index ? { ...r, [key]: value } : r)));
  }
  function remove(index: number) {
    onChange(rows.filter((_, i) => i !== index));
  }
  function add() {
    onChange([...rows, { ...blank }]);
  }

  return (
    <div>
      <div className="border border-stone/30 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream/50 border-b border-stone/20">
              {columns.map((c) => (
                <th
                  key={c.key as string}
                  className="text-left px-3 py-2 text-xs font-semibold text-bark uppercase"
                  style={c.width ? { width: c.width } : undefined}
                >
                  {c.label}
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-3 py-4 text-center text-bark text-sm"
                >
                  No rows yet. Click &ldquo;Add row&rdquo; below.
                </td>
              </tr>
            )}
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-stone/10 last:border-b-0">
                {columns.map((c) => (
                  <td key={c.key as string} className="px-2 py-1.5">
                    {c.multiline ? (
                      <textarea
                        value={row[c.key]}
                        onChange={(e) => update(i, c.key, e.target.value)}
                        rows={2}
                        className="w-full px-2 py-1 rounded border border-stone bg-white text-sm resize-y"
                      />
                    ) : (
                      <input
                        type="text"
                        value={row[c.key]}
                        onChange={(e) => update(i, c.key, e.target.value)}
                        className="w-full px-2 py-1 rounded border border-stone bg-white text-sm"
                      />
                    )}
                  </td>
                ))}
                <td className="px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="p-1.5 text-bark hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 text-sm text-camp-red hover:bg-camp-red/10 rounded-lg"
      >
        <Plus className="h-3.5 w-3.5" />
        Add row
      </button>
    </div>
  );
}
