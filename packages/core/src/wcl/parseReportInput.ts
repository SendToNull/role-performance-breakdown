// Mirrors RPB.gs:90-103 — accept a full report URL or a bare id.
//
// WCL share URLs can carry any of:
//   #fight=… type=… view=…           (event-view fragment after the id)
//   ?type=damage-done&boss=-3&…       (legacy query-string form)
//   /                                  (trailing slash if pasted from address bar)
// All of those should be stripped to leave just the bare 16-char id, both
// in the web app (used to drive API calls) and in the bot (used to build
// the gist filename and the snapshot share URL).

const REPORT_PATTERNS = [
  "classic.warcraftlogs.com/reports/",
  "tbc.warcraftlogs.com/reports/",
  "fresh.warcraftlogs.com/reports/",
  "warcraftlogs.com/reports/",
] as const;

export interface ParsedReportInput {
  logId: string;
  /** True if the URL was a vanilla report (script warns the user). */
  isVanilla: boolean;
  /** Original input, normalized (.cn → .com). */
  normalized: string;
}

/**
 * Strip query string, hash fragment, and leading/trailing slashes. WCL
 * IDs are alphanumeric so this is safe — any tail like `?type=…`, `#fight=…`,
 * or a trailing `/` from address-bar paste gets removed.
 */
function cleanId(raw: string): string {
  return raw
    .split("#")[0]!
    .split("?")[0]!
    .replace(/^\/+|\/+$/g, "");
}

export function parseReportInput(input: string): ParsedReportInput {
  const normalized = input.trim().replace(".cn/", ".com/");
  const isVanilla = normalized.includes("vanilla.warcraftlogs");

  for (const pattern of REPORT_PATTERNS) {
    const idx = normalized.indexOf(pattern);
    if (idx >= 0) {
      const tail = normalized.slice(idx + pattern.length);
      return { logId: cleanId(tail), isVanilla, normalized };
    }
  }

  // Treat as bare id — still strip ?/# in case the user pasted just the
  // tail with a query string attached.
  return { logId: cleanId(normalized), isVanilla, normalized };
}
