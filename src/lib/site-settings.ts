/**
 * Tiny helper around the site_settings key/value table.
 * Currently used for the favicon URL; expand for additional global
 * settings as they appear (e.g. site title, default OG image).
 */
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const SETTINGS_KEYS = {
  FAVICON: "favicon",
} as const;

export interface FaviconSetting {
  url: string;
}

export async function getSetting<T>(key: string): Promise<T | null> {
  try {
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);
    return (row?.valueJson as T) ?? null;
  } catch (err) {
    console.error(`site-settings: read failed for ${key}`, err);
    return null;
  }
}

export async function setSetting(
  key: string,
  value: object,
  userId?: string | null
): Promise<void> {
  const existing = await db
    .select({ key: siteSettings.key })
    .from(siteSettings)
    .where(eq(siteSettings.key, key))
    .limit(1);
  if (existing.length) {
    await db
      .update(siteSettings)
      .set({ valueJson: value, updatedAt: new Date(), updatedBy: userId ?? null })
      .where(eq(siteSettings.key, key));
  } else {
    await db.insert(siteSettings).values({ key, valueJson: value, updatedBy: userId ?? null });
  }
}

export async function getFaviconUrl(): Promise<string | null> {
  try {
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, SETTINGS_KEYS.FAVICON))
      .limit(1);
    const url = (row?.valueJson as FaviconSetting | undefined)?.url;
    if (!url) return null;
    // Append updatedAt epoch as a cache-buster so browsers fetch the new
    // icon after admin replaces it. Without this, browsers happily serve
    // a stale favicon for days even when the underlying URL changes.
    const version = row?.updatedAt ? new Date(row.updatedAt).getTime() : Date.now();
    return url.includes("?") ? `${url}&v=${version}` : `${url}?v=${version}`;
  } catch (err) {
    console.error("site-settings: getFaviconUrl failed", err);
    return null;
  }
}
