// Bot wrapper around @rpb/core: runs the report, builds the matrix, returns
// a serializable snapshot — the same one the web app produces.

import {
  buildMatrixData,
  buildSnapshot,
  defaultRoleForClass,
  inferRole,
  normalizeClass,
  ROLES,
  runReport,
  type MatrixPlayer,
  type MatrixSnapshot,
  type RunReportResult,
} from "@rpb/core";

export interface BotReportInput {
  apiKey: string;
  reportPathOrId: string;
  mode?: "all" | "onlyBosses" | "onlyTrash";
  noWipes?: boolean;
}

export interface BotReportOutput {
  snapshot: MatrixSnapshot;
  callsMade: number;
  result: RunReportResult;
}

export async function generateSnapshot(
  input: BotReportInput,
  onLog?: (msg: string) => void,
): Promise<BotReportOutput> {
  let callsMade = 0;
  const result = await runReport({
    reportPathOrId: input.reportPathOrId,
    apiKey: input.apiKey,
    fetchPerPlayer: true,
    filters: {
      mode: input.mode ?? "onlyBosses",
      noWipes: input.noWipes ?? false,
    },
    clientOptions: {
      concurrency: 8,
      onProgress: (e) => {
        if (e.type === "request:done") {
          callsMade = e.totalCompleted;
          if (callsMade % 25 === 0) onLog?.(`  ${callsMade} calls done…`);
        }
      },
    },
  });

  const players = buildPlayers(result);
  const data = buildMatrixData(result);
  const snapshot = buildSnapshot(result, data, players, {
    reportUrl: `https://classic.warcraftlogs.com/reports/${result.logId}`,
    filtersDesc: describeFilters(input),
  });
  return { snapshot, callsMade, result };
}

function buildPlayers(result: RunReportResult): MatrixPlayer[] {
  const entries = result.raw.allPlayersCasting.entries ?? [];
  const roleCounts = result.roleCounts;
  return entries
    .filter((e) => (e.total ?? 0) > 0)
    .map((e) => {
      const className = normalizeClass(e.type);
      const role = roleCounts
        ? inferRole(e.type, roleCounts.get(e.id))
        : defaultRoleForClass(className);
      return {
        id: e.id,
        name: e.name,
        className,
        rawClassName: e.type,
        role,
      };
    })
    .sort((a, b) => {
      const ri = ROLES.indexOf(a.role) - ROLES.indexOf(b.role);
      if (ri !== 0) return ri;
      const ci = a.className.localeCompare(b.className);
      if (ci !== 0) return ci;
      return a.name.localeCompare(b.name);
    });
}

function describeFilters(input: BotReportInput): string {
  const bits: string[] = [];
  bits.push(input.mode === "onlyTrash" ? "trash only" : input.mode === "all" ? "all fights" : "bosses only");
  if (input.noWipes) bits.push("no wipes");
  return bits.join(" · ");
}
