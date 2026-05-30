// Bot wrapper around @rpb/core: runs the report, builds the matrix, returns
// a serializable snapshot — the same one the web app produces.

import {
  BUNDLE_VERSION,
  buildMatrixData,
  buildSnapshot,
  defaultRoleForClass,
  fetchConsumables,
  fetchGearIssues,
  inferRole,
  normalizeClass,
  ROLES,
  runReport,
  serializeConsumables,
  serializeGearIssues,
  type BundleSnapshot,
  type ClaPayload,
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
      mode: input.mode ?? "all",
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

export interface ClaSnapshotInput {
  apiKey: string;
  reportPathOrId: string;
  /** Surface noEnchant/badEnchant issues that only appear on Mother Shahraz. */
  includeMotherShahraz?: boolean;
}

export interface ClaSnapshotOutput {
  cla: ClaPayload;
  callsMade: number;
  /** Same logId both fetchers settled on. */
  logId: string;
  /** Bosses scanned for gear issues. */
  bossesScanned: number;
  /** Player count from consumables (largest roster). */
  playerCount: number;
}

export async function generateClaPayload(
  input: ClaSnapshotInput,
  onLog?: (msg: string) => void,
): Promise<ClaSnapshotOutput> {
  let callsMade = 0;
  const onProgress = (e: { type: string; totalCompleted: number }) => {
    if (e.type === "request:done") {
      callsMade = e.totalCompleted;
      if (callsMade % 25 === 0) onLog?.(`  ${callsMade} calls done…`);
    }
  };

  const [gear, cons] = await Promise.all([
    fetchGearIssues({
      reportPathOrId: input.reportPathOrId,
      apiKey: input.apiKey,
      ...(input.includeMotherShahraz
        ? { includeMotherShahraz: true }
        : {}),
      clientOptions: { concurrency: 8, onProgress },
    }),
    fetchConsumables({
      reportPathOrId: input.reportPathOrId,
      apiKey: input.apiKey,
      clientOptions: { concurrency: 8, onProgress },
    }),
  ]);

  return {
    cla: {
      gearIssues: serializeGearIssues(gear),
      consumables: serializeConsumables(cons),
    },
    callsMade,
    logId: gear.logId,
    bossesScanned: gear.bossesScanned,
    playerCount: Math.max(gear.players.length, cons.players.length),
  };
}

export interface BundleInput {
  apiKey: string;
  reportPathOrId: string;
  /** Include RPB section? */
  includeRpb: boolean;
  /** Include CLA section? */
  includeCla: boolean;
  /** RPB-only filter knobs. */
  mode?: "all" | "onlyBosses" | "onlyTrash";
  noWipes?: boolean;
  /** CLA-only: surface Mother-Shahraz-only enchant flags. */
  includeMotherShahraz?: boolean;
}

export interface BundleOutput {
  bundle: BundleSnapshot;
  callsMade: number;
  /** Logical summary for the Discord reply. */
  summary: {
    logId: string;
    fightCount?: number;
    bossesScanned?: number;
    playerCount: number;
  };
}

/**
 * Builds a single BundleSnapshot containing whichever sections were requested.
 * RPB and CLA are fetched concurrently when both are requested.
 */
export async function generateBundle(
  input: BundleInput,
  onLog?: (msg: string) => void,
): Promise<BundleOutput> {
  if (!input.includeRpb && !input.includeCla) {
    throw new Error("generateBundle: at least one of includeRpb/includeCla must be true");
  }

  const rpbPromise = input.includeRpb
    ? generateSnapshot(
        {
          apiKey: input.apiKey,
          reportPathOrId: input.reportPathOrId,
          ...(input.mode !== undefined ? { mode: input.mode } : {}),
          ...(input.noWipes !== undefined ? { noWipes: input.noWipes } : {}),
        },
        onLog,
      )
    : Promise.resolve(null);
  const claPromise = input.includeCla
    ? generateClaPayload(
        {
          apiKey: input.apiKey,
          reportPathOrId: input.reportPathOrId,
          ...(input.includeMotherShahraz
            ? { includeMotherShahraz: true }
            : {}),
        },
        onLog,
      )
    : Promise.resolve(null);

  const [rpb, cla] = await Promise.all([rpbPromise, claPromise]);

  const callsMade = (rpb?.callsMade ?? 0) + (cla?.callsMade ?? 0);
  const logId = rpb?.snapshot.source.logId ?? cla?.logId ?? "";
  const reportUrl = rpb?.snapshot.source.reportUrl
    ?? `https://classic.warcraftlogs.com/reports/${logId}`;
  const filtersDesc = rpb?.snapshot.source.filtersDesc;

  const bundle: BundleSnapshot = {
    v: BUNDLE_VERSION,
    generatedAt: new Date().toISOString(),
    source: {
      logId,
      reportUrl,
      ...(filtersDesc ? { filtersDesc } : {}),
    },
    ...(rpb ? { rpb: rpb.snapshot } : {}),
    ...(cla ? { cla: cla.cla } : {}),
  };

  return {
    bundle,
    callsMade,
    summary: {
      logId,
      ...(rpb ? { fightCount: rpb.snapshot.source.fightCount } : {}),
      ...(cla ? { bossesScanned: cla.bossesScanned } : {}),
      playerCount: Math.max(
        rpb?.snapshot.players.length ?? 0,
        cla?.playerCount ?? 0,
      ),
    },
  };
}
