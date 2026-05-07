/**
 * Sanitize TipTap-produced HTML before storing it in the DB or rendering it
 * via dangerouslySetInnerHTML. Allows only the small set of tags/attrs the
 * editor toolbar exposes — anything else (script, style, iframe, inline
 * styles, custom data-* attrs) is stripped.
 *
 * Pure-JS (sanitize-html) so it runs in any Node runtime — no JSDOM polyfill
 * required, which is critical for Vercel's serverless functions.
 */
import sanitizeHtmlLib from "sanitize-html";

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";
  return sanitizeHtmlLib(dirty, {
    allowedTags: [
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
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {},
    transformTags: {
      // Force safe rel on any link with target="_blank"
      a: (tagName, attribs) => {
        if (attribs.target === "_blank") {
          return {
            tagName,
            attribs: { ...attribs, rel: "noopener noreferrer" },
          };
        }
        return { tagName, attribs };
      },
    },
    // No inline styles, no data-*, no class
    disallowedTagsMode: "discard",
  });
}
