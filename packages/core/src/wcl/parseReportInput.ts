// Mirrors RPB.gs:90-103 — accept a full report URL or a bare id.

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

export function parseReportInput(input: string): ParsedReportInput {
  const normalized = input.trim().replace(".cn/", ".com/");
  const isVanilla = normalized.includes("vanilla.warcraftlogs");

  for (const pattern of REPORT_PATTERNS) {
    const idx = normalized.indexOf(pattern);
    if (idx >= 0) {
      const tail = normalized.slice(idx + pattern.length);
      const logId = tail.split("#")[0]!.split("?")[0]!;
      return { logId, isVanilla, normalized };
    }
  }

  // Treat as bare id.
  return { logId: normalized, isVanilla, normalized };
}
