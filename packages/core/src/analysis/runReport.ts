import type {
  Faction,
  Fight,
  FightsResponse,
  FilterMode,
  Lang,
  ReportFilters,
  TableResponse,
} from "../types/index.js";
import { makeUrls, type RPBEndpoints } from "../wcl/endpoints.js";
import { WCLClient, type WCLClientOptions } from "../wcl/client.js";
import { parseReportInput } from "../wcl/parseReportInput.js";
import { fetchPerPlayer, type PerPlayerData } from "./fetchPerPlayer.js";
import {
  aggregateRoleCounts,
  fetchBossSummaries,
  type BossSummary,
  type PlayerRoleCounts,
} from "./bossSummaries.js";

/**
 * Entry point. Loads global tables for a report and returns the raw data the
 * per-metric analyzers will consume. Per-metric analysis is added in follow-up
 * modules under analysis/metrics/*.
 */
export interface RunReportInput {
  reportPathOrId: string;
  apiKey: string;
  lang?: Lang;
  filters?: Partial<ReportFilters>;
  /** Optional WCLClient overrides (fetchFn for tests, concurrency, progress). */
  clientOptions?: Omit<WCLClientOptions, "apiKey">;
  /** If true, fetch per-player tables after globals. Adds ~10-15 calls per player. */
  fetchPerPlayer?: boolean;
  /**
   * Minimum total casts a player needs to be included in per-player fetching.
   * Mirrors the script's `total > 20` filter at RPB.gs:238. Defaults to 20.
   */
  perPlayerMinTotal?: number;
}

export interface RunReportResult {
  logId: string;
  isVanilla: boolean;
  lang: Lang;
  filters: ResolvedFilters;
  faction: Faction;
  fights: Fight[];
  /** Raw global tables — keep around so metric analyzers can lazily compute. */
  raw: GlobalTables;
  /** Built endpoint set — exposed so metric modules can compose per-player URLs. */
  endpoints: RPBEndpoints;
  /** Live WCLClient — pass to metric modules. */
  client: WCLClient;
  /** Per-player tables, present when fetchPerPlayer was true. */
  perPlayer?: Map<number, PerPlayerData>;
  /** Per-boss summary tables; one entry per boss fight. */
  bossSummaries?: BossSummary[];
  /** Aggregated role counts per player, derived from bossSummaries. */
  roleCounts?: Map<number, PlayerRoleCounts>;
}

export interface ResolvedFilters {
  mode: FilterMode;
  noWipes: boolean;
  /** Resolved to a concrete fight id (string) or null. "last" is resolved here. */
  onlyFightId: string | null;
  /** Effective start/end strings (raw fight times or full range). */
  startTime: number | null;
  endTime: number | null;
  characterNames: string[];
}

export interface GlobalTables {
  interrupted: TableResponse;
  damageTakenOilOfImmo: TableResponse;
  damageTakenEngineering: TableResponse;
  hostilePlayers: TableResponse;
  damageReflected: TableResponse;
  deathsOnTrash: TableResponse;
  deaths: TableResponse;
  sunderArmorBelow5: TableResponse;
  scorchBelow5: TableResponse;
  allPlayersCasting: TableResponse;
  allPlayersCastingOnTrash: TableResponse;
  debuffsAppliedTotal: TableResponse;
  debuffsAppliedBossesTotal: TableResponse;
  playersRacials: TableResponse;
}

export async function runReport(input: RunReportInput): Promise<RunReportResult> {
  const { reportPathOrId, apiKey } = input;
  const lang: Lang = input.lang ?? "EN";

  const parsed = parseReportInput(reportPathOrId);
  const userFilters: ReportFilters = {
    mode: input.filters?.mode ?? "all",
    noWipes: input.filters?.noWipes ?? false,
    onlyFightId: input.filters?.onlyFightId ?? null,
    manualStartEnd: input.filters?.manualStartEnd ?? null,
    characterNames: input.filters?.characterNames ?? null,
  };

  const client = new WCLClient({ ...input.clientOptions, apiKey });
  const endpoints = makeUrls({
    lang,
    apiKey,
    logId: parsed.logId,
    mode: userFilters.mode,
    noWipes: userFilters.noWipes,
  });

  // 1. Always need fights first — drives filter resolution.
  const fightsRaw = await client.getJson<FightsResponse>(endpoints.fights);

  const resolved = resolveFilters(userFilters, fightsRaw.fights);

  // 2. Parallel fetch all global tables. WCLClient handles concurrency caps.
  const [
    interrupted,
    damageTakenOilOfImmo,
    damageTakenEngineering,
    hostilePlayers,
    damageReflected,
    deathsOnTrash,
    deaths,
    sunderArmorBelow5,
    scorchBelow5,
    allPlayersCasting,
    allPlayersCastingOnTrash,
    debuffsAppliedTotal,
    debuffsAppliedBossesTotal,
    playersRacials,
  ] = await Promise.all([
    client.getJson<TableResponse>(endpoints.interrupted),
    client.getJson<TableResponse>(endpoints.damageTakenOilOfImmo),
    client.getJson<TableResponse>(endpoints.damageTakenEngineering),
    client.getJson<TableResponse>(endpoints.hostilePlayers),
    client.getJson<TableResponse>(endpoints.damageReflected),
    client.getJson<TableResponse>(endpoints.deathsOnTrash),
    // RPB.gs:209 fetches deathsPrefix with sourceid blank (returns all deaths).
    client.getJson<TableResponse>(endpoints.deathsPrefix),
    client.getJson<TableResponse>(endpoints.sunderArmorBelow5),
    client.getJson<TableResponse>(endpoints.scorchBelow5),
    client.getJson<TableResponse>(endpoints.peopleTracked),
    client.getJson<TableResponse>(endpoints.peopleTracked + "&encounter=0"),
    client.getJson<TableResponse>(endpoints.debuffsAppliedTotal),
    client.getJson<TableResponse>(endpoints.debuffsAppliedBossesTotal),
    client.getJson<TableResponse>(endpoints.playersRacials),
  ]);

  // RPB.gs:222-226 — Horde if anyone cast a Horde racial, else Alliance.
  const faction: Faction =
    playersRacials.entries && playersRacials.entries.length > 0
      ? "Horde"
      : "Alliance";

  const result: RunReportResult = {
    logId: parsed.logId,
    isVanilla: parsed.isVanilla,
    lang,
    filters: resolved,
    faction,
    fights: fightsRaw.fights,
    raw: {
      interrupted,
      damageTakenOilOfImmo,
      damageTakenEngineering,
      hostilePlayers,
      damageReflected,
      deathsOnTrash,
      deaths,
      sunderArmorBelow5,
      scorchBelow5,
      allPlayersCasting,
      allPlayersCastingOnTrash,
      debuffsAppliedTotal,
      debuffsAppliedBossesTotal,
      playersRacials,
    },
    endpoints,
    client,
  };

  if (input.fetchPerPlayer) {
    const minTotal = input.perPlayerMinTotal ?? 20;
    const players = (allPlayersCasting.entries ?? [])
      .filter((e) => (e.total ?? 0) > minTotal)
      .map((e) => ({ id: e.id, name: e.name, className: e.type }));

    // Boss summaries + per-player tables can run in parallel — neither needs
    // the other's data.
    const [perPlayer, bossSummaries] = await Promise.all([
      fetchPerPlayer({ client, endpoints, players }),
      fetchBossSummaries(client, endpoints, fightsRaw.fights),
    ]);
    result.perPlayer = perPlayer;
    result.bossSummaries = bossSummaries;
    result.roleCounts = aggregateRoleCounts(bossSummaries);
  }

  return result;
}

function resolveFilters(filters: ReportFilters, fights: Fight[]): ResolvedFilters {
  const characterNames =
    filters.characterNames?.split(",").map((n) => n.trim()).filter(Boolean) ?? [];

  // Manual start-end takes precedence in the script's flow (RPB.gs:143-146).
  if (filters.manualStartEnd) {
    const [s, e] = filters.manualStartEnd.replace(/\s/g, "").split("-");
    return {
      mode: filters.mode,
      noWipes: filters.noWipes,
      onlyFightId: null,
      startTime: s ? Number(s) : null,
      endTime: e ? Number(e) : null,
      characterNames,
    };
  }

  if (filters.onlyFightId) {
    let target: Fight | undefined;
    if (filters.onlyFightId === "last") {
      // RPB.gs:131-141 — last boss (or last trash if onlyTrash).
      for (const f of fights) {
        if (
          (f.boss > 0 && filters.mode !== "onlyTrash") ||
          filters.mode === "onlyTrash"
        ) {
          target = f;
        }
      }
    } else {
      target = fights.find((f) => f.id.toString() === filters.onlyFightId);
    }
    if (target) {
      return {
        mode: filters.mode,
        noWipes: filters.noWipes,
        onlyFightId: target.id.toString(),
        startTime: target.start_time,
        endTime: target.end_time,
        characterNames,
      };
    }
  }

  return {
    mode: filters.mode,
    noWipes: filters.noWipes,
    onlyFightId: null,
    startTime: null,
    endTime: null,
    characterNames,
  };
}
