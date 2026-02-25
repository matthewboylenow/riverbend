"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StaffMember } from "@/types";

const sections = [
  { value: "all", label: "All" },
  { value: "directors", label: "Directors" },
  { value: "division_heads", label: "Division Heads" },
  { value: "assistant_heads", label: "Assistant Heads" },
  { value: "founders", label: "Founders" },
] as const;

// Mock staff data
const initialStaff: StaffMember[] = [
  { id: "1", name: "Roger Breene", title: "Director", section: "directors", sortOrder: 0, isActive: true, photoUrl: null, bio: "" },
  { id: "2", name: "Jill Breene Cheng", title: "Director", section: "directors", sortOrder: 1, isActive: true, photoUrl: null, bio: "" },
  { id: "3", name: "Paul Breene", title: "Director", section: "directors", sortOrder: 2, isActive: true, photoUrl: null, bio: "" },
  { id: "4", name: "Robin Breene Hetrick", title: "Waterfront Director", section: "directors", sortOrder: 3, isActive: true, photoUrl: null, bio: "" },
  { id: "5", name: "Miriam Peretsman Breene", title: "Program Director", section: "division_heads", sortOrder: 0, isActive: true, photoUrl: null, bio: "" },
  { id: "6", name: "Katie Higgins", title: "Clubhouse Division Head", section: "division_heads", sortOrder: 1, isActive: true, photoUrl: null, bio: "" },
  { id: "7", name: "Jenni Hetrick Lawrence", title: "B Division Head", section: "division_heads", sortOrder: 2, isActive: true, photoUrl: null, bio: "" },
];

export default function AdminStaffPage() {
  const [filter, setFilter] = useState<string>("all");
  const [staff] = useState<StaffMember[]>(initialStaff);

  const filteredStaff =
    filter === "all" ? staff : staff.filter((s) => s.section === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Staff Management</h1>
        <Button variant="primary" size="sm" href="/admin/staff/new">
          <Plus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      {/* Section filter tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-sand rounded-xl w-fit">
        {sections.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-all",
              filter === s.value
                ? "bg-white text-charcoal shadow-sm"
                : "text-bark hover:text-charcoal"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Staff table */}
      <div className="bg-white rounded-2xl border border-stone/30 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone/20">
              <th className="w-10" />
              <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">
                Photo
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">
                Title
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">
                Section
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">
                Active
              </th>
              <th className="w-24" />
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((member) => (
              <tr
                key={member.id}
                className="border-b border-stone/10 hover:bg-cream/50 transition-colors"
              >
                <td className="pl-3">
                  <GripVertical className="h-4 w-4 text-stone cursor-grab" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-10 w-10 rounded-lg bg-sand overflow-hidden">
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
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-sm text-charcoal">
                    {member.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-bark">{member.title}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full bg-sand text-bark">
                    {member.section.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      member.isActive ? "bg-green-500" : "bg-stone"
                    )}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/staff/${member.id}`}
                      className="p-2 text-bark hover:text-camp-red hover:bg-sand rounded-lg transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button className="p-2 text-bark hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
