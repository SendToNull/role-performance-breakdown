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

  // Friendly Fire — damage from teammates' abilities that land on the player
  // (Charge, Necrotic Plague, etc.). Source RPB.gs:964 builds a per-player
  // damage-taken query with a long set of exclusion filters; we mirror that
  // exact filter and fetch it per player.
  items.push({
    kind: "row",
    id: "friendly-fire",
    label: "Friendly Fire",
    description:
      "Damage from teammates' abilities (Charges/Plague/etc.) that hit the player. Excludes specific debuff sequences per source-script logic.",
    category: "friendlyFire",
    pending: !perPlayer,
    cell: (id) => {
      const pp = perPlayer?.get(id);
      const ff = (pp as { friendlyFire?: number } | undefined)?.friendlyFire ?? 0;
      return formatNumeric(ff);
    },
  });

  // Total (partly) avoidable damage taken — sum of the tracked damageTaken
  // section rows + reflected + hostile-players + friendly-fire per player.
  // Mirrors source's accumulator at RPB.gs:3740-3884: only entries whose
  // guid matches one of the spell ids inside a damageTaken row count toward
  // totalAmount, NOT the whole damageTakenTotal response.
  const trackedDamageTakenIds = (() => {
    const set = new Set<number>();
    for (const section of TRACKED_SECTIONS) {
      if (section.section !== "damageTaken") continue;
      for (const row of section.rows) {
        for (const sid of row.spellIds) set.add(sid);
      }
    }
    return set;
  })();
  items.push({
    kind: "row",
    id: "total-avoidable-damage",
    label: "Total (partly) avoidable damage taken",
    description:
      "Sum of tracked damage-taken abilities + reflected self-damage + damage taken from hostile players + friendly fire. Matches source RPB.gs:3740-3884.",
    category: "damageTaken",
    pending: !perPlayer,
    cell: (id) => {
      const pp = perPlayer?.get(id);
      if (!pp) return formatNumeric((reflected.get(id) ?? 0) + (hostiles.get(id) ?? 0));
      let sum = 0;
      for (const entry of pp.damageTakenTotal.entries ?? []) {
        const guid = (entry.guid ?? entry.id) as number;
        if (!trackedDamageTakenIds.has(guid)) continue;
        sum += (entry.total ?? 0) as number;
      }
      // Source only adds these when > 0 (RPB.gs:3799, 3844, 3856). For our
      // sum the check is moot but kept explicit for parity with source.
      const r = reflected.get(id) ?? 0;
      if (r > 0) sum += r;
      const h = hostiles.get(id) ?? 0;
      if (h > 0) sum += h;
      const ff = pp.friendlyFire ?? 0;
      if (ff > 0) sum += ff;
      return formatNumeric(sum);
    },
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

    // RPB.gs:2551-2565 — at the bottom of each class's AoE casts section,
    // synthesize a "# of hits per AoE cast on average" row. Excluded for
    // Druid / Paladin / Warlock because their AoE spells (Hurricane,
    // Consecration, Hellfire) are pulsing — WCL doesn't report a hit count
    // for each individual tick, so the ratio would be misleading.
    if (
      meta.perClass &&
      section.section.endsWith(":aoeCasts") &&
      !["Druid", "Paladin", "Warlock"].includes(meta.perClass)
    ) {
      const aoeIds = section.rows
        .flatMap((r) => r.spellIds)
        .filter((id) => typeof id === "number");
      const perClass = meta.perClass;
      items.push({
        kind: "row",
        id: `row-hits-per-aoe-${perClass}`,
        label: "# of hits per AoE cast (⌀)",
        description:
          "Average hits per cast across all of this class's tracked AoE spells (totalHits / totalCasts). Pulsing spells excluded; classes with only pulsing AoE (Druid/Paladin/Warlock) skip this row entirely.",
        category: "casts",
        onlyForClass: perClass,
        pending: !perPlayer,
        cell: (playerId) => {
          const pp = perPlayer?.get(playerId);
          if (!pp || pp.className !== perClass) return { display: "" };
          const casts = sumCastsByIds(pp.casts, aoeIds);
          if (casts === 0) return { display: "" };
          const hits = sumHitsAndMissesByIds(pp.damageDone, aoeIds);
          const avg = Math.round((hits / casts) * 100) / 100;
          return {
            display: avg.toString(),
            numeric: avg,
            tooltip: `${hits} hits across ${casts} casts`,
          };
        },
      });
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

  // ---- Activity / Seconds Active ----
  // Mirrors RPB.gs:2568-2643. Computed from per-player casts × the baseCastTime
  // modifier captured in trackedMetrics.ts. WCL active% comes directly from
  // the allPlayersCasting global query (entries[].activeTime / totalTime).
  appendActivitySection(items, result, perPlayer);

  // ---- Interrupted spells (RPB.gs:4523-4585) ----
  appendInterruptedSection(items, result);

  return { items };
}

/**
 * Walks the interrupted spells table and emits two summary rows per player:
 *   - "# of interrupted spells"  → total interrupts across all spells
 *   - "names and sources of interrupted spells" → "Spell (target1), Spell (target2), …"
 *
 * The interrupts table shape (WCL v1):
 *   { entries: [{
 *       entries: [{
 *         guid, name,                       // the spell that was interrupted
 *         details: [{
 *           id,                              // player id that did the interrupt
 *           actors: [{ name }],              // NPC targets whose spell was cut
 *           total
 *         }]
 *       }]
 *   }]}
 */
function appendInterruptedSection(
  items: MatrixData["items"],
  result: RunReportResult,
): void {
  type SpellEntry = {
    guid?: number;
    name?: string;
    details?: Array<{
      id?: number;
      actors?: Array<{ name?: string }>;
      total?: number;
    }>;
  };
  const outerEntries = (result.raw.interrupted.entries ?? []) as Array<{
    entries?: SpellEntry[];
  }>;
  const innerEntries: SpellEntry[] = [];
  for (const o of outerEntries) {
    if (Array.isArray(o.entries)) innerEntries.push(...o.entries);
  }

  // playerId → { total: number, label: string }
  const byPlayer = new Map<number, { total: number; label: string }>();
  for (const spell of innerEntries) {
    if (!spell.details) continue;
    for (const detail of spell.details) {
      const pid = detail.id;
      if (typeof pid !== "number") continue;
      const cur = byPlayer.get(pid) ?? { total: 0, label: "" };
      const seenTargets = new Set<string>();
      const targetParts: string[] = [];
      for (const a of detail.actors ?? []) {
        if (!a.name) continue;
        // Source strips the trailing " N" id suffix WCL appends to NPC names.
        const stripped = a.name.replace(/\s\d+$/g, "");
        if (!seenTargets.has(stripped)) {
          seenTargets.add(stripped);
          targetParts.push(stripped);
        }
      }
      const spellLabel = spell.name ?? `spell ${spell.guid ?? "?"}`;
      const segment = targetParts.length
        ? `${spellLabel} (${targetParts.join(", ")})`
        : spellLabel;
      cur.total += detail.total ?? 0;
      cur.label = cur.label ? `${cur.label}, ${segment}` : segment;
      byPlayer.set(pid, cur);
    }
  }

  items.push({
    kind: "section",
    id: "section-interrupts",
    label: "Interrupted spells",
    category: "interrupts",
  });
  items.push({
    kind: "row",
    id: "row-interrupts-count",
    label: "# of interrupted spells",
    description: "Total interrupts performed by this player across all targets.",
    category: "interrupts",
    cell: (id) => {
      const v = byPlayer.get(id)?.total ?? 0;
      return v === 0 ? { display: "" } : { display: v.toString(), numeric: v };
    },
  });
  items.push({
    kind: "row",
    id: "row-interrupts-names",
    label: "Names and sources of interrupted spells",
    description: "Spell (target1, target2, …) for each unique spell interrupted.",
    category: "interrupts",
    cell: (id) => {
      const label = byPlayer.get(id)?.label ?? "";
      return label
        ? { display: label, tooltip: label }
        : { display: "" };
    },
  });
}

interface ClassActivityDef {
  /** Sum of cast_count × baseCastTime over per-class single-target casts. */
  st: Array<{ spellIds: number[]; baseCastTime: number }>;
  /** Same for AoE casts. */
  aoe: Array<{ spellIds: number[]; baseCastTime: number }>;
}

/** className → activity-relevant cast definitions. Built once per buildMatrixData call. */
function buildActivityDefs(): Map<string, ClassActivityDef> {
  const out = new Map<string, ClassActivityDef>();
  for (const section of TRACKED_SECTIONS) {
    if (!section.section.includes(":")) continue;
    const [cls, kind] = section.section.split(":") as [string, string];
    if (kind !== "singleTargetCasts" && kind !== "aoeCasts") continue;
    const def =
      out.get(cls) ?? ({ st: [], aoe: [] } satisfies ClassActivityDef);
    const target = kind === "singleTargetCasts" ? def.st : def.aoe;
    for (const row of section.rows) {
      // baseCastTime 0 = "Melee - excluded from activity" sentinel in config.
      const t = row.modifiers.baseCastTime;
      if (!t || t <= 0) continue;
      if (row.spellIds.length === 0) continue;
      target.push({ spellIds: row.spellIds, baseCastTime: t });
    }
    out.set(cls, def);
  }
  return out;
}

function appendActivitySection(
  items: MatrixData["items"],
  result: RunReportResult,
  perPlayer: Map<number, PerPlayerData> | undefined,
): void {
  items.push({
    kind: "section",
    id: "section-activity",
    label: "Activity / seconds active",
    category: "casts",
  });

  // Report duration in seconds. allPlayersCasting.totalTime is in ms.
  const reportTimeMs = (result.raw.allPlayersCasting.totalTime ?? 0) as number;
  const reportTimeSec = reportTimeMs > 0 ? reportTimeMs / 1000 : 0;

  // WCL's reported active time per player, in ms.
  const wclActiveMsByPlayer = new Map<number, number>();
  for (const entry of result.raw.allPlayersCasting.entries ?? []) {
    const at = (entry as { activeTime?: number }).activeTime;
    if (typeof at === "number") wclActiveMsByPlayer.set(entry.id, at);
  }
  const wclActiveTrashMsByPlayer = new Map<number, number>();
  for (const entry of result.raw.allPlayersCastingOnTrash.entries ?? []) {
    const at = (entry as { activeTime?: number }).activeTime;
    if (typeof at === "number") wclActiveTrashMsByPlayer.set(entry.id, at);
  }
  const trashTotalMs = (result.raw.allPlayersCastingOnTrash.totalTime ??
    0) as number;

  const activityDefs = buildActivityDefs();
  const classCache = new Map<number, string>();
  for (const e of result.raw.allPlayersCasting.entries ?? []) {
    classCache.set(e.id, (e.type ?? "").replace(/\s+/g, ""));
  }

  function secondsFor(playerId: number, defs: Array<{ spellIds: number[]; baseCastTime: number }> | undefined): number {
    if (!defs) return 0;
    const pp = perPlayer?.get(playerId);
    if (!pp) return 0;
    let totalSec = 0;
    for (const def of defs) {
      const casts = sumCastsByIds(pp.casts, def.spellIds);
      if (casts > 0) totalSec += casts * def.baseCastTime;
    }
    return totalSec;
  }

  function stSeconds(playerId: number): number {
    const cls = classCache.get(playerId);
    return secondsFor(playerId, cls ? activityDefs.get(cls)?.st : undefined);
  }
  function aoeSeconds(playerId: number): number {
    const cls = classCache.get(playerId);
    return secondsFor(playerId, cls ? activityDefs.get(cls)?.aoe : undefined);
  }

  const pending = !perPlayer;

  items.push({
    kind: "row",
    id: "activity-total-seconds",
    label: "Total seconds active",
    description:
      "Sum of single-target + AoE casts × each spell's base cast time. Doesn't account for spell-haste gear yet.",
    category: "casts",
    pending,
    cell: (id) => {
      const v = Math.round(stSeconds(id) + aoeSeconds(id));
      return v === 0
        ? { display: "" }
        : { display: v.toLocaleString(), numeric: v };
    },
  });

  items.push({
    kind: "row",
    id: "activity-st-seconds",
    label: "Seconds active (single-target)",
    description: "Single-target cast time only.",
    category: "casts",
    pending,
    cell: (id) => {
      const v = Math.round(stSeconds(id));
      return v === 0
        ? { display: "" }
        : { display: v.toLocaleString(), numeric: v };
    },
  });

  items.push({
    kind: "row",
    id: "activity-aoe-seconds",
    label: "Seconds active (AoE)",
    description: "AoE cast time only.",
    category: "casts",
    pending,
    cell: (id) => {
      const v = Math.round(aoeSeconds(id));
      return v === 0
        ? { display: "" }
        : { display: v.toLocaleString(), numeric: v };
    },
  });

  items.push({
    kind: "row",
    id: "activity-st-pct",
    label: "Active % (single-target)",
    description: "ST seconds / report duration.",
    category: "casts",
    pending,
    cell: (id) => {
      if (reportTimeSec <= 0) return { display: "" };
      const pct = Math.round((stSeconds(id) / reportTimeSec) * 100);
      return pct === 0 ? { display: "" } : { display: `${pct}%`, numeric: pct };
    },
  });

  items.push({
    kind: "row",
    id: "activity-aoe-pct",
    label: "Active % (AoE)",
    description: "AoE seconds / report duration.",
    category: "casts",
    pending,
    cell: (id) => {
      if (reportTimeSec <= 0) return { display: "" };
      const pct = Math.round((aoeSeconds(id) / reportTimeSec) * 100);
      return pct === 0 ? { display: "" } : { display: `${pct}%`, numeric: pct };
    },
  });

  items.push({
    kind: "row",
    id: "activity-total-pct",
    label: "Active % (total)",
    description: "ST% + AoE%.",
    category: "casts",
    pending,
    cell: (id) => {
      if (reportTimeSec <= 0) return { display: "" };
      const pct = Math.round(
        ((stSeconds(id) + aoeSeconds(id)) / reportTimeSec) * 100,
      );
      return pct === 0 ? { display: "" } : { display: `${pct}%`, numeric: pct };
    },
  });

  // WCL's own active%, from allPlayersCasting. Doesn't need per-player.
  items.push({
    kind: "row",
    id: "activity-wcl-pct",
    label: "WCL active %",
    description:
      "WCL's reported activeTime / totalTime from the casts endpoint. Format: overall (trash) when both are available.",
    category: "casts",
    pending: false,
    cell: (id) => {
      const totalMs = wclActiveMsByPlayer.get(id) ?? 0;
      if (totalMs === 0 || reportTimeMs === 0) return { display: "" };
      const pctTotal = Math.round((totalMs / reportTimeMs) * 100);
      const trashMs = wclActiveTrashMsByPlayer.get(id) ?? 0;
      if (trashMs > 0 && trashTotalMs > 0) {
        const pctTrash = Math.round((trashMs / trashTotalMs) * 100);
        return {
          display: `${pctTotal}% (${pctTrash}%)`,
          numeric: pctTotal,
          tooltip: `${pctTotal}% overall · ${pctTrash}% on trash`,
        };
      }
      return { display: `${pctTotal}%`, numeric: pctTotal };
    },
  });
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

    // Trinkets/racials with {true} flag count buff aura bands instead of
    // casts. Mirrors RPB.gs:4186-4214. Cast events for on-use trinkets are
    // unreliable in WCL (some never log a cast), so the script trusts the
    // resulting buff aura instead.
    const checkAura = row.modifiers.checkAura === true;
    const isMultiFight =
      result.filters.mode === "all" &&
      !result.filters.onlyFightId &&
      !result.filters.noWipes;
    const buffDurationSec = row.modifiers.buffDurationSec;

    base.cell = (playerId) => {
      const pp = perPlayer.get(playerId);
      if (!pp) return { display: "" };

      if (checkAura) {
        const auras = pp.buffsTotal.auras ?? [];
        let amount = 0;
        for (const aura of auras) {
          if (!row.spellIds.includes(aura.guid)) continue;
          const bands = aura.bands ?? [];
          // Apply duration-aware dedup in multi-fight mode if we know the
          // buff duration. Otherwise count each band as a use.
          if (
            isMultiFight &&
            typeof buffDurationSec === "number" &&
            buffDurationSec > 0
          ) {
            let lastEnd = 0;
            for (const band of bands) {
              if (
                lastEnd === 0 ||
                lastEnd + buffDurationSec * 1000 < band.endTime
              ) {
                amount += 1;
              }
              lastEnd = band.endTime;
            }
          } else {
            amount += bands.length;
          }
        }
        return amount === 0
          ? { display: "" }
          : { display: amount.toLocaleString(), numeric: amount };
      }

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
      if (total === 0) return { display: "" };
      // RPB.gs:2542-2543 — Cleave / Whirlwind rows show avg targets-hit per cast.
      if (
        section.section.endsWith(":aoeCasts") &&
        (row.label.includes("Cleave") || row.label.includes("Whirlwind"))
      ) {
        const hits = sumHitsAndMissesByIds(pp.damageDone, row.spellIds);
        if (hits > 0) {
          const avg = Math.round((hits / total) * 100) / 100;
          return {
            display: `${total} (⌀${avg})`,
            numeric: total,
            tooltip: `${total} casts · ${hits} hits across all targets · ~${avg} per cast`,
          };
        }
      }
      return { display: total.toLocaleString(), numeric: total };
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

/** Sum buff/debuff totalUptime (ms) across auras (preferred) and entries. */
function sumUptimeByIds(table: TableResponse, ids: number[]): number {
  if (!table) return 0;
  let total = 0;
  const set = new Set(ids);
  for (const aura of table.auras ?? []) {
    if (set.has(aura.guid)) total += numOr0(aura.totalUptime);
  }
  for (const entry of table.entries ?? []) {
    const guid = (entry.guid ?? entry.id) as number;
    if (set.has(guid)) total += numOr0(entry["totalUptime"]);
  }
  return total;
}

function numOr0(v: unknown): number {
  return typeof v === "number" ? v : 0;
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
