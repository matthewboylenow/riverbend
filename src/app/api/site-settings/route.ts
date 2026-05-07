import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { setSetting } from "@/lib/site-settings";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await db.select().from(siteSettings);
  const out: Record<string, unknown> = {};
  for (const r of rows) out[r.key] = r.valueJson;
  return NextResponse.json(out);
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as Record<string, object>;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Expected key/value object" }, { status: 400 });
  }
  for (const [key, value] of Object.entries(body)) {
    if (!key || typeof value !== "object") continue;
    await setSetting(key, value, session.user.id);
  }
  return NextResponse.json({ success: true });
}
