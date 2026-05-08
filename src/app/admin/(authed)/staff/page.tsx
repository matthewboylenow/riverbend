"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Reorder, useDragControls } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StaffMember } from "@/types";

type Section = "directors" | "division_heads" | "founders";

const SECTIONS: { value: Section; label: string }[] = [
  { value: "directors", label: "Directors" },
  { value: "division_heads", label: "Division Heads" },
  { value: "founders", label: "Founders" },
];

const SECTION_LABELS: Record<Section, string> = Object.fromEntries(
  SECTIONS.map((s) => [s.value, s.label]),
) as Record<Section, string>;

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<Section | null>(null);
  const debounceTimers = useRef<Partial<Record<Section, ReturnType<typeof setTimeout>>>>({});

  useEffect(() => {
    void fetch("/api/staff")
      .then((r) => r.json())
      .then((data: StaffMember[]) => setStaff(data))
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const map: Record<Section, StaffMember[]> = {
      directors: [],
      division_heads: [],
      founders: [],
    };
    for (const m of staff) {
      if (m.section in map) map[m.section as Section].push(m);
    }
    for (const k of Object.keys(map) as Section[]) {
      map[k].sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return map;
  }, [staff]);

  function persistOrder(section: Section, ordered: StaffMember[]) {
    if (debounceTimers.current[section]) clearTimeout(debounceTimers.current[section]);
    debounceTimers.current[section] = setTimeout(async () => {
      setSavingSection(section);
      try {
        const res = await fetch("/api/staff/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: ordered.map((m, i) => ({ id: m.id, sortOrder: i })),
          }),
        });
        if (res.ok) toast.success("Order saved");
        else toast.error("Failed to save order");
      } finally {
        setSavingSection(null);
      }
    }, 500);
  }

  function reorderSection(section: Section, next: StaffMember[]) {
    // Rewrite sortOrder locally so UI stays in sync.
    const updated = next.map((m, i) => ({ ...m, sortOrder: i }));
    setStaff((prev) => {
      const others = prev.filter((m) => m.section !== section);
      return [...others, ...updated];
    });
    persistOrder(section, updated);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete ${name}?`)) return;
    const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
    if (res.ok) {
      setStaff((prev) => prev.filter((s) => s.id !== id));
      toast.success(`${name} deleted`);
    } else {
      toast.error("Failed to delete");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Staff Management</h1>
        <Button variant="primary" size="sm" href="/admin/staff/new">
          <Plus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      <p className="text-sm text-bark mb-6">
        Drag the grip handle on each row to reorder staff within a section. Changes save
        automatically and are reflected on the public Directors &amp; Senior Staff page.
      </p>

      {loading ? (
        <p className="text-sm text-bark">Loading…</p>
      ) : (
        <div className="space-y-8">
          {SECTIONS.map(({ value }) => (
            <SectionList
              key={value}
              section={value}
              label={SECTION_LABELS[value]}
              members={grouped[value]}
              saving={savingSection === value}
              onReorder={(next) => reorderSection(value, next)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SectionList({
  section,
  label,
  members,
  saving,
  onReorder,
  onDelete,
}: {
  section: Section;
  label: string;
  members: StaffMember[];
  saving: boolean;
  onReorder: (next: StaffMember[]) => void;
  onDelete: (id: string, name: string) => void;
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-sm font-semibold text-bark uppercase tracking-wider">
          {label}
          <span className="ml-2 text-xs font-normal text-stone normal-case tracking-normal">
            ({members.length})
          </span>
        </h2>
        {saving && <span className="text-xs text-bark">Saving…</span>}
      </div>

      {members.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone/30 px-4 py-6 text-sm text-bark">
          No staff in this section.
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={members}
          onReorder={(next) => onReorder(next as StaffMember[])}
          className="bg-white rounded-2xl border border-stone/30 overflow-hidden divide-y divide-stone/10"
        >
          {members.map((member) => (
            <StaffRow
              key={member.id}
              member={member}
              section={section}
              onDelete={onDelete}
            />
          ))}
        </Reorder.Group>
      )}
    </section>
  );
}

function StaffRow({
  member,
  section,
  onDelete,
}: {
  member: StaffMember;
  section: Section;
  onDelete: (id: string, name: string) => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={member}
      id={member.id}
      dragListener={false}
      dragControls={dragControls}
      data-section={section}
      className="bg-white"
    >
      <div className="flex items-center gap-3 px-3 py-3 hover:bg-cream/50 transition-colors">
        <button
          type="button"
          aria-label="Drag to reorder"
          onPointerDown={(e) => dragControls.start(e)}
          className="touch-none cursor-grab active:cursor-grabbing p-1.5 text-stone hover:text-bark rounded-md"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="h-10 w-10 rounded-lg bg-sand overflow-hidden shrink-0">
          {member.photoUrl ? (
            <Image
              src={member.photoUrl}
              alt={member.name}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone text-xs font-bold">
              {member.name.split(" ").map((n) => n[0]).join("")}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-charcoal truncate">
            {member.name}
          </div>
          <div className="text-xs text-bark truncate">{member.title}</div>
        </div>

        <div
          className={cn(
            "h-2.5 w-2.5 rounded-full shrink-0",
            member.isActive ? "bg-green-500" : "bg-stone",
          )}
          title={member.isActive ? "Active" : "Inactive"}
        />

        <div className="flex items-center gap-1 shrink-0">
          <Link
            href={`/admin/staff/${member.id}`}
            className="p-2 text-bark hover:text-camp-red hover:bg-sand rounded-lg transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onDelete(member.id, member.name)}
            className="p-2 text-bark hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Reorder.Item>
  );
}
