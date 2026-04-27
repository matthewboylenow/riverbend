/**
 * Sanitize TipTap-produced HTML before storing it in the DB or rendering it
 * via dangerouslySetInnerHTML. Allows only the small set of tags/attrs the
 * editor toolbar exposes — anything else (script, style, iframe, inline
 * styles, custom data-* attrs) is stripped.
 */
import DOMPurify from "isomorphic-dompurify";

export const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
];

export const ALLOWED_ATTRS = ["href", "target", "rel"];

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";
  const clean = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ALLOWED_ATTRS,
    ALLOW_DATA_ATTR: false,
    // Force any link to open with safe rel
    ADD_ATTR: ["target", "rel"],
  });
  // Force-add rel="noopener noreferrer" on external-target links
  return clean.replace(
    /<a ([^>]*?)target="_blank"([^>]*?)>/g,
    (_m, pre, post) => `<a ${pre}target="_blank"${post} rel="noopener noreferrer">`
  );
}
