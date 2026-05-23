// Per-player evaluators for the 17 statsAndMisc rows. Mirrors RPB.gs:3979-4148.
//
// Data sources (all already in PerPlayerData):
//   - buffsTotal / buffsOnTrash → uptime% and use counts of self-buffs
//   - debuffsTaken → uptime% of debuffs landing on the player (e.g. Tinnitus)
//   - healingDone → crit count for healing
//   - damageDone → crit/miss/dodge/parry/resist outgoing
//   - damageTakenTotal → melee miss-detail breakdowns (incoming)

import type { PerPlayerData } from "../analysis/fetchPerPlayer.js";
import type { TableEntry, TableResponse } from "../types/index.js";

export type StatsCell =
  | { display: ""; numeric?: undefined }
  | { display: string; numeric: number };

const EMPTY: StatsCell = { display: "" };

/**
 * Return the cell value for a given statsAndMisc row label. Returns EMPTY for
 * rows we don't recognize so the UI just shows blank.
 */
export function evalStatsAndMiscRow(
  label: string,
  pp: PerPlayerData,
): StatsCell {
  // Uptime-based rows --------------------------------------------------------
  if (label.includes("Battle Shout uptime on you")) {
    return uptimePct(pp.buffsTotal, [2048]);
  }
  if (label.includes("Commanding Shout uptime on you")) {
    return uptimePct(pp.buffsTotal, [469]);
  }
  if (label.includes("Tinnitus uptime on you")) {
    return uptimePct(pp.debuffsTaken, [51120]);
  }

  // Windfury count
  if (label.includes("# of extra Windfury Attacks")) {
    const lower =
      usesByGuid(pp.buffsTotal, 10610) +
      usesByGuid(pp.buffsTotal, 8516) +
      usesByGuid(pp.buffsTotal, 10608) +
      usesByGuid(pp.buffsTotal, 25583);
    const max = usesByGuid(pp.buffsTotal, 25584);
    const total = lower + max;
    return total === 0
      ? EMPTY
      : { display: total.toLocaleString(), numeric: total };
  }

  // Battle Squawk on bosses = totalUses(total) - totalUses(trashOnly)
  if (label.includes("# of Battle Squawk buffs on bosses")) {
    const total = usesByGuid(pp.buffsTotal, 23060);
    const trash = usesByGuid(pp.buffsOnTrash, 23060);
    const onBosses = total - trash;
    return onBosses <= 0
      ? EMPTY
      : { display: onBosses.toLocaleString(), numeric: onBosses };
  }

  // Critical heals done = sum(critHitCount across healingDone entries) /
  //                       sum(hitCount across the same entries) when increased.
  if (label.includes("Critical heals done")) {
    let crits = 0;
    let totalHits = 0;
    for (const entry of pp.healingDone.entries ?? []) {
      const { critCount, hitCount } = collectCritAndHits(entry, pp.playerId);
      if (critCount > 0) {
        crits += critCount;
        totalHits += hitCount;
      }
    }
    return formatCountAndPct(crits, totalHits);
  }

  // Outgoing — Critical, Dodge, Miss, Parry, Resist
  if (label.includes("outgoing")) {
    const searchType = label.split(" outgoing")[0]!.trim();
    let amount = 0;
    let totalDenominator = 0;
    for (const entry of pp.damageDone.entries ?? []) {
      const uses = numOr0(entry["uses"]);
      if (uses <= 0) continue;
      const collected = collectOutgoing(entry, pp.playerId, searchType);
      if (collected.increased) {
        amount += collected.amount;
        const hitCount = numOr0(entry["hitCount"]);
        const missCount = numOr0(entry["missCount"]);
        if (hitCount === 0 && (missCount > 0 || searchType === "Critical")) {
          if (uses >= missCount) totalDenominator += uses;
          else totalDenominator += hitCount;
        } else {
          totalDenominator += hitCount;
        }
        if (missCount > 0) totalDenominator += missCount;
      }
    }
    return formatCountAndPct(amount, totalDenominator);
  }

  // Incoming — Critical/Crushing/Blocked/Dodge/Immune/Miss/Parry (Melee hits)
  if (label.includes("incoming")) {
    const searchType = label.split(" incoming")[0]!.trim();
    let amount = 0;
    let totalIncoming = 0;
    for (const entry of pp.damageTakenTotal.entries ?? []) {
      // Melee = guid 1
      if ((entry.guid ?? entry.id) !== 1) continue;
      const inc = collectIncoming(entry, searchType);
      amount += inc.amount;
      totalIncoming += inc.total;
    }
    return formatCountAndPct(amount, totalIncoming);
  }

  return EMPTY;
}

// ---- helpers -------------------------------------------------------------

function uptimePct(table: TableResponse, ids: number[]): StatsCell {
  const totalTime = (table as { totalTime?: number }).totalTime ?? 0;
  if (totalTime <= 0) return EMPTY;
  let uptimeMs = 0;
  const set = new Set(ids);
  // The buffs/debuffs endpoints return data under .auras (RPB.gs uses
  // *.auras directly). Older code paths also have .entries; check both.
  const sources: Array<{ guid?: number; totalUptime?: number }> = [
    ...((table.auras ?? []) as Array<{ guid?: number; totalUptime?: number }>),
    ...((table.entries ?? []) as Array<{ guid?: number; id?: number; totalUptime?: number }>).map(
      (e) => ({
        guid: (e.guid ?? e.id) as number,
        totalUptime: typeof e.totalUptime === "number" ? e.totalUptime : 0,
      }),
    ),
  ];
  for (const a of sources) {
    if (a.guid != null && set.has(a.guid)) uptimeMs += numOr0(a.totalUptime);
  }
  if (uptimeMs <= 0) return EMPTY;
  const pct = Math.round((uptimeMs / totalTime) * 100);
  return pct === 0 ? EMPTY : { display: `${pct}%`, numeric: pct };
}

function usesByGuid(table: TableResponse, id: number): number {
  for (const aura of table.auras ?? []) {
    if (aura.guid === id) return numOr0(aura.totalUses);
  }
  for (const entry of table.entries ?? []) {
    const guid = (entry.guid ?? entry.id) as number;
    if (guid === id) return numOr0(entry["totalUses"]);
  }
  return 0;
}

function formatCountAndPct(amount: number, denom: number): StatsCell {
  if (amount <= 0) return EMPTY;
  if (denom <= 0) return { display: amount.toLocaleString(), numeric: amount };
  const pct = Math.round((amount * 1000) / denom) / 10;
  return {
    display: `${amount.toLocaleString()} (${pct}%)`,
    numeric: amount,
  };
}

interface CritHits {
  critCount: number;
  hitCount: number;
}

function collectCritAndHits(entry: TableEntry, playerId: number): CritHits {
  let critCount = 0;
  let hitCount = 0;

  const actor = entry["actor"];
  if (entry["targets"] && Array.isArray(entry["targets"]) && actor === playerId) {
    const c = numOr0(entry["critHitCount"]);
    if (c > 0) {
      critCount += c;
      hitCount += numOr0(entry["hitCount"]);
    }
  }
  const subs = entry["subentries"] as TableEntry[] | undefined;
  if (Array.isArray(subs)) {
    for (const sub of subs) {
      const subActor = sub["actor"];
      if (sub["targets"] && Array.isArray(sub["targets"]) && subActor === playerId) {
        const c = numOr0(sub["critHitCount"]);
        if (c > 0) {
          critCount += c;
          hitCount += numOr0(entry["hitCount"]); // script accumulates parent hitCount
        }
      }
    }
  }
  return { critCount, hitCount };
}

function collectOutgoing(
  entry: TableEntry,
  playerId: number,
  searchType: string,
): { amount: number; increased: boolean } {
  let amount = 0;
  let increased = false;

  const matchMissdetails = (md: unknown) => {
    if (!Array.isArray(md)) return;
    for (const m of md as Array<{ type?: string; count?: number }>) {
      if (m.type && m.type.includes(searchType)) {
        amount += numOr0(m.count);
        increased = true;
      }
    }
  };

  const actor = entry["actor"];
  if (entry["targets"] && Array.isArray(entry["targets"]) && actor === playerId) {
    if (searchType === "Critical") {
      const c = numOr0(entry["critHitCount"]);
      if (c > 0) {
        amount += c;
        increased = true;
      }
    } else {
      matchMissdetails(entry["missdetails"]);
    }
  }
  const subs = entry["subentries"] as TableEntry[] | undefined;
  if (Array.isArray(subs)) {
    for (const sub of subs) {
      const subActor = sub["actor"];
      if (
        sub["targets"] &&
        Array.isArray(sub["targets"]) &&
        subActor === playerId
      ) {
        if (searchType === "Critical") {
          const c = numOr0(sub["critHitCount"]);
          if (c > 0) {
            amount += c;
            increased = true;
          }
        } else {
          matchMissdetails(sub["missdetails"]);
        }
      }
    }
  }
  return { amount, increased };
}

function collectIncoming(
  entry: TableEntry,
  searchType: string,
): { amount: number; total: number } {
  let amount = 0;
  let total = 0;

  const matchMissdetails = (md: unknown) => {
    if (!Array.isArray(md)) return;
    for (const m of md as Array<{ type?: string; count?: number }>) {
      total += numOr0(m.count);
      if (m.type && m.type.includes(searchType)) {
        amount += numOr0(m.count);
      }
    }
  };

  if (Array.isArray(entry["sources"]) && (entry["sources"] as unknown[]).length > 0) {
    matchMissdetails(entry["missdetails"]);
    // For pure-crit/crush/block we also need entry-level critHitCount fallback
    if (searchType === "Critical") amount += numOr0(entry["critHitCount"]);
  }
  const subs = entry["subentries"] as TableEntry[] | undefined;
  if (Array.isArray(subs)) {
    for (const sub of subs) {
      if (Array.isArray(sub["sources"]) && (sub["sources"] as unknown[]).length > 0) {
        matchMissdetails(sub["missdetails"]);
        if (searchType === "Critical") amount += numOr0(sub["critHitCount"]);
      }
    }
  }
  return { amount, total };
}

function numOr0(v: unknown): number {
  return typeof v === "number" ? v : 0;
}
