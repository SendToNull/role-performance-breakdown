import type { PerPlayerData } from "../analysis/fetchPerPlayer.js";
import type { RunReportResult } from "../analysis/runReport.js";
import { sectionMeta } from "../analysis/sectionMeta.js";
import {
  TRACKED_SECTIONS,
  type TrackedSection,
} from "../data/trackedMetrics.js";
import type { TableEntry, TableResponse } from "../types/index.js";
import type { MatrixData, MatrixRow } from "./types.js";
import { evalStatsAndMiscRow } from "./statsAndMisc.js";

export function buildMatrixData(result: RunReportResult): MatrixData {
  const items: MatrixData["items"] = [];
  const perPlayer = result.perPlayer;

  // ---- Overview (always synthesized from globals) ----
  items.push({
    kind: "section",
    id: "overview",
    label: "Overview",
    category: "deaths",
  });

  const deathCounts = countByPlayer(result.raw.deaths.entries ?? []);
  const deathsTrash = countByPlayer(result.raw.deathsOnTrash.entries ?? []);
  items.push({
    kind: "row",
    id: "deaths-total",
    label: "Deaths (overall)",
    description: "Total deaths in selected fights. Format: total (trash).",
    category: "deaths",
    cell: (id) => {
      const total = deathCounts.get(id) ?? 0;
      const trash = deathsTrash.get(id) ?? 0;
      return total === 0
        ? { display: "" }
        : {
            display: `${total} (${trash})`,
            numeric: total,
            tooltip: `${total} total · ${trash} on trash · ${total - trash} on bosses`,
          };
    },
  });

  const reflected = sumByPlayer(result.raw.damageReflected.entries ?? []);
  items.push({
    kind: "row",
    id: "self-friendly-damage",
    label: "Self / friendly damage",
    description:
      "Damage where source.name == target.name. Engineering bombs, oil of immo, etc. (curated allowlist applied).",
    category: "friendlyFire",
    cell: (id) => formatNumeric(reflected.get(id) ?? 0),
  });

  const hostiles = sumByPlayer(result.raw.hostilePlayers.entries ?? []);
  items.push({
    kind: "row",
    id: "damage-taken-from-players",
    label: "Damage taken from players",
    description:
      "targetclass=player aggregated by source. PvP toggles, MC'd adds, bad LoS.",
    category: "damageTaken",
    cell: (id) => formatNumeric(hostiles.get(id) ?? 0),
  });

  // ---- Tracked sections (data-driven from configNew.csv) ----
  for (const section of TRACKED_SECTIONS) {
    const meta = sectionMeta(section.section);
    items.push({
      kind: "section",
      id: `section-${section.section}`,
      label: meta.label,
      category: meta.category,
      ...(meta.perClass ? { onlyForClass: meta.perClass } : {}),
    });
    for (const row of section.rows) {
      items.push(makeRow(section, row, meta, result, perPlayer));
    }

    // The engineering section gets two synthetic summary rows from globals
    // (RPB.gs:4310-4365).
    if (section.section === "engineering") {
      const engiDamage = sumByPlayer(
        result.raw.damageTakenEngineering.entries ?? [],
      );
      items.push({
        kind: "row",
        id: "row-engineering-damage-total",
        label: "Damage done with engineering",
        description:
          "Total damage taken from engineering bombs by this player (sum across all engineering ability ids, by-target). Matches the script's labeling — most often this is your own bombs' self-damage.",
        category: "consumables",
        cell: (id) => formatNumeric(engiDamage.get(id) ?? 0),
      });
      const oilDamage = sumByPlayer(
        result.raw.damageTakenOilOfImmo.entries ?? [],
      );
      items.push({
        kind: "row",
        id: "row-engineering-oil-of-immo-damage",
        label: "Damage done with Oil of Immolation",
        description:
          "Total Oil of Immolation damage taken by this player. Mostly self-damage from your own OoI throws.",
        category: "consumables",
        cell: (id) => formatNumeric(oilDamage.get(id) ?? 0),
      });
    }
  }

  return { items };
}

function makeRow(
  section: TrackedSection,
  row: TrackedSection["rows"][number],
  meta: ReturnType<typeof sectionMeta>,
  result: RunReportResult,
  perPlayer: Map<number, PerPlayerData> | undefined,
): { kind: "row" } & MatrixRow {
  const base: { kind: "row" } & MatrixRow = {
    kind: "row",
    id: `row-${row.id}`,
    label: row.label,
    description: row.raw,
    category: meta.category,
    cell: () => ({ display: "" }),
    pending: meta.source !== "global",
    ...(meta.perClass ? { onlyForClass: meta.perClass } : {}),
  };

  // Always populate debuffs-taken from the global debuffsAppliedTotal table —
  // doesn't need per-player.
  if (section.section === "debuffs" && row.spellIds.length > 0) {
    const idx = buildAuraTargetUptimeIndex(result.raw.debuffsAppliedTotal);
    base.cell = (playerId) => {
      let bestPct = 0;
      for (const sid of row.spellIds) {
        const byPlayer = idx.get(sid);
        if (!byPlayer) continue;
        const pct = byPlayer.get(playerId) ?? 0;
        if (pct > bestPct) bestPct = pct;
      }
      return bestPct === 0
        ? { display: "" }
        : { display: `${bestPct}%`, numeric: bestPct };
    };
    base.pending = false;
    return base;
  }

  if (!perPlayer) return base;

  // Sections that map to "count of casts by spell id" on the per-player casts table.
  const CAST_SECTIONS = new Set([
    "trinketsAndRacials",
    "engineering",
    "otherCasts",
  ]);

  if (CAST_SECTIONS.has(section.section) && row.spellIds.length > 0) {
    // Engineering rows include avg-targets-hit in parens (RPB.gs:4275-4308),
    // except Oil of Immolation and Target Dummy which just show the count.
    const isEngineering = section.section === "engineering";
    const isImmolationOrDummy =
      isEngineering &&
      (row.label.includes("Immolation") || row.label.includes("Dummy"));
    base.cell = (playerId) => {
      const pp = perPlayer.get(playerId);
      if (!pp) return { display: "" };
      const amount = sumCastsByIds(pp.casts, row.spellIds);
      if (amount === 0) return { display: "" };
      if (!isEngineering || isImmolationOrDummy) {
        return { display: amount.toLocaleString(), numeric: amount };
      }
      const hits = sumHitsAndMissesByIds(pp.damageDone, row.spellIds);
      if (hits === 0) {
        return { display: amount.toLocaleString(), numeric: amount };
      }
      const avg = Math.round(hits / amount);
      return {
        display: `${amount} (⌀${avg})`,
        numeric: amount,
        tooltip: `${amount} casts · ${hits} hits/misses across all targets · ~${avg} targets per cast`,
      };
    };
    base.pending = false;
    return base;
  }

  // Per-class casts/cooldowns
  if (section.section.includes(":") && meta.perClass) {
    base.cell = (playerId) => {
      const pp = perPlayer.get(playerId);
      if (!pp || pp.className !== meta.perClass) return { display: "" };
      if (row.spellIds.length === 0) return { display: "" };
      // For uptime% rows, prefer buffs/debuffs lookup.
      if (
        /uptime%/i.test(row.label) ||
        /uptime%/i.test(row.raw)
      ) {
        const totalTime = pp.casts.totalTime ?? 0;
        const uptimeMs = sumUptimeByIds(pp.buffsTotal, row.spellIds);
        if (totalTime > 0 && uptimeMs > 0) {
          const pct = Math.round((uptimeMs / totalTime) * 100);
          return pct === 0 ? { display: "" } : { display: `${pct}%`, numeric: pct };
        }
        // Fall through to cast count if no buff uptime is registered.
      }
      const total = sumCastsByIds(pp.casts, row.spellIds);
      return total === 0
        ? { display: "" }
        : { display: total.toLocaleString(), numeric: total };
    };
    base.pending = false;
    return base;
  }

  // damageTaken section: per-player damage taken from any of the listed ids.
  if (section.section === "damageTaken" && row.spellIds.length > 0) {
    base.cell = (playerId) => {
      const pp = perPlayer.get(playerId);
      if (!pp) return { display: "" };
      const total = sumDamageByIds(pp.damageTakenTotal, row.spellIds);
      return total === 0
        ? { display: "" }
        : { display: total.toLocaleString(), numeric: total };
    };
    base.pending = false;
    return base;
  }

  // absorbs section: amount absorbed shows up under healing tables.
  if (section.section === "absorbs" && row.spellIds.length > 0) {
    base.cell = (playerId) => {
      const pp = perPlayer.get(playerId);
      if (!pp) return { display: "" };
      const total = sumDamageByIds(pp.healingDone, row.spellIds);
      return total === 0
        ? { display: "" }
        : { display: total.toLocaleString(), numeric: total };
    };
    base.pending = false;
    return base;
  }

  if (section.section === "statsAndMisc") {
    base.cell = (playerId) => {
      const pp = perPlayer.get(playerId);
      if (!pp) return { display: "" };
      const v = evalStatsAndMiscRow(row.label, pp);
      if (v.display === "") return { display: "" };
      return typeof v.numeric === "number"
        ? { display: v.display, numeric: v.numeric }
        : { display: v.display };
    };
    base.pending = false;
    return base;
  }

  return base;
}

// ---- Helpers -------------------------------------------------------------

function countByPlayer(entries: Array<{ id: number }>): Map<number, number> {
  const m = new Map<number, number>();
  for (const e of entries) m.set(e.id, (m.get(e.id) ?? 0) + 1);
  return m;
}

function sumByPlayer(
  entries: Array<{ id: number; total: number }>,
): Map<number, number> {
  const m = new Map<number, number>();
  for (const e of entries) m.set(e.id, (m.get(e.id) ?? 0) + (e.total ?? 0));
  return m;
}

/** Sum `total` across entries whose guid/id matches one of the given spell ids. */
function sumCastsByIds(table: TableResponse, ids: number[]): number {
  if (!table?.entries) return 0;
  let total = 0;
  const set = new Set(ids);
  for (const entry of table.entries) {
    const guid = (entry.guid ?? entry.id) as number;
    if (set.has(guid)) total += (entry.total ?? 0) as number;
  }
  return total;
}

/**
 * Sum hitCount + missCount across damage-done entries matching any of the
 * spell ids. Mirrors RPB.gs:4287-4292 — used to compute average targets-hit
 * per cast for engineering items.
 */
function sumHitsAndMissesByIds(
  table: TableResponse,
  ids: number[],
): number {
  if (!table?.entries) return 0;
  let total = 0;
  const set = new Set(ids);
  for (const entry of table.entries) {
    const guid = (entry.guid ?? entry.id) as number;
    if (!set.has(guid)) continue;
    const hit = typeof entry["hitCount"] === "number" ? entry["hitCount"] : 0;
    const miss = typeof entry["missCount"] === "number" ? entry["missCount"] : 0;
    total += hit + miss;
    // RPB.gs:4290-4291 — script double-counts missCount when > 0 (likely a
    // bug, but we match the original output exactly).
    if (miss > 0) total += miss;
  }
  return total;
}

/** Sum damage `total` across damage-taken entries matching any of the ids. */
function sumDamageByIds(table: TableResponse, ids: number[]): number {
  return sumCastsByIds(table, ids);
}

/** Sum buff/debuff totalUptime (ms) across entries matching any of the ids. */
function sumUptimeByIds(table: TableResponse, ids: number[]): number {
  if (!table?.entries) return 0;
  let total = 0;
  const set = new Set(ids);
  for (const entry of table.entries) {
    const guid = (entry.guid ?? entry.id) as number;
    if (set.has(guid)) {
      const up = entry["totalUptime"];
      if (typeof up === "number") total += up;
    }
  }
  return total;
}

/**
 * The /report/tables/debuffs?hostility=1 endpoint groups entries by aura; each
 * entry has nested `entries[]` per target (id + totalUptime). Return a
 * spellId → playerId → uptime% index based on `table.totalTime`.
 */
function buildAuraTargetUptimeIndex(
  table: TableResponse,
): Map<number, Map<number, number>> {
  const out = new Map<number, Map<number, number>>();
  const totalTime = (table as { totalTime?: number }).totalTime ?? 0;
  for (const entry of table.entries ?? []) {
    const guid = (entry.guid ?? entry.id) as number;
    if (!guid) continue;
    const inner = entry["entries"] as
      | Array<{ id: number; totalUptime?: number }>
      | undefined;
    if (Array.isArray(inner) && totalTime > 0) {
      const byPlayer = out.get(guid) ?? new Map<number, number>();
      for (const t of inner) {
        if (typeof t.totalUptime === "number" && t.id) {
          byPlayer.set(t.id, Math.round((t.totalUptime / totalTime) * 100));
        }
      }
      out.set(guid, byPlayer);
    }
  }
  return out;
}

function formatNumeric(v: number) {
  return v === 0 ? { display: "" } : { display: v.toLocaleString(), numeric: v };
}

// (Reserved for future use — typed for non-null guarantee.)
export type _IndexedTable = Map<number, TableEntry[]>;
