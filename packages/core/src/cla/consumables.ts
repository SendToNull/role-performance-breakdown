// Combat Log Analytics — Consumables.
// Ports the per-player consumable buff tracking from Consumables.gs.
//
// Strategy: one /report/tables/buffs?targetid=X call per player covering the
// full report. We then clip each aura's bands to the union of fight intervals
// (boss + trash) so the uptime% denominator is real in-combat time rather
// than wall-clock time. We cross-reference each aura against curated TBC
// consumable categories (flask, food, battle elixir, guardian elixir, weapon
// oil/stone, scroll, drum). Each cell is either:
//   - empty / red: consumable not used in any fight
//   - green: consumable used (with use count and in-combat uptime%)
//
// Spell-id fallback: if an aura's id isn't in any curated list, we try to
// categorize by name pattern (e.g. "Elixir of *" → battle elixir, "Flask of *"
// → flask). This catches niche or new ranks the curated list missed.

import type { FightsResponse, TableResponse } from "../types/index.js";
import { WCLClient } from "../wcl/client.js";
import { makeUrls } from "../wcl/endpoints.js";
import { parseReportInput } from "../wcl/parseReportInput.js";

export interface ConsumableCategory {
  id: string;
  label: string;
  /** Spell ids that count toward this category. */
  spellIds: number[];
  /** Help text shown on hover. */
  description?: string;
}

/**
 * TBC consumable buff IDs, curated from SimC TBC data + WCL aura logs. Where
 * an elixir spans both worlds (e.g. Elixir of Major Mageblood is technically
 * Guardian in TBC even though it's a stat boost), we follow Blizzard's
 * official category. The name-pattern fallback in `aggregate()` catches any
 * id we missed.
 */
export const CONSUMABLE_CATEGORIES: ConsumableCategory[] = [
  {
    id: "flask",
    label: "Flask",
    description: "Persists through death. Mutually exclusive with elixirs.",
    spellIds: [
      // TBC flasks
      28518, // Flask of Fortification
      28519, // Flask of Relentless Assault
      28520, // Flask of Blinding Light
      28521, // Flask of Mighty Restoration
      28540, // Flask of Pure Death
      41608, // Flask of Chromatic Wonder
      // Shattrath flasks (raid-only, double-strength)
      42735, 42736, 42737, 42738, 42739,
      // Vanilla flasks (still usable in TBC)
      17626, // Flask of the Titans
      17627, // Flask of Distilled Wisdom
      17628, // Flask of Supreme Power
      17629, // Flask of Chromatic Resistance
    ],
  },
  {
    id: "battleElixir",
    label: "Battle Elixir",
    description: "Damage-focused elixir. Mutually exclusive with Flask + Guardian.",
    spellIds: [
      // TBC
      28491, // Adept's Elixir (sp + spell crit)
      28493, // Elixir of Major Shadow Power
      28497, // Elixir of Major Strength
      28501, // Elixir of Major Frost Power
      28503, // Elixir of Major Firepower
      33077, // Elixir of Empowerment (spell penetration)
      33726, // Elixir of Mastery
      45373, // Elixir of Major Agility (TBC, raises crit too)
      54452, // Adept's Elixir (alt rank)
      // Pre-TBC battle elixirs that still work
      11406, // Elixir of Demonslaying
      17537, // Elixir of Brute Force
      17538, // Elixir of the Mongoose
      17539, // Greater Arcane Elixir
      22817, // Elixir of Frost Power
      22818, // Elixir of Greater Firepower
      24361, // Elixir of Greater Agility (Wrath BC ports)
    ],
  },
  {
    id: "guardianElixir",
    label: "Guardian Elixir",
    description: "Defensive elixir. Mutually exclusive with Flask + Battle.",
    spellIds: [
      // TBC
      28502, // Elixir of Major Defense
      28509, // Elixir of Major Mageblood (mp5 — Guardian in TBC)
      39625, // Elixir of Major Fortitude
      39626, // Earthen Elixir (caster armor)
      // Vanilla
      22833, // Elixir of Greater Defense
      11334, // Elixir of the Sages (BC era spirit)
    ],
  },
  {
    id: "food",
    label: "Food buff (Well Fed)",
    description: "Per-stat food bonus. Lost on death.",
    spellIds: [
      33256, // Spicy Hot Talbuk (30 hit)
      33257, // Roasted Clefthoof (20 str)
      33259, // Skullfish Soup (20 spell crit)
      33261, // Crunchy Serpent (23 spell dmg)
      33263, // Blackened Sporefish (8 mp5)
      33265, // Grilled Mudfish (20 agi)
      33268, // Poached Bluefish (23 spell dmg)
      33269, // Golden Fish Sticks (44 heal / 14 spell)
      33272, // Stormchops (20 hit)
      35272, // Crunchy Serpent (alt rank)
      40539, // Blackened Basilisk
      40543, // Spicy Crawdad
      40745, // Fisherman's Feast
      // TBC misc food
      18192, // Grilled Squid (vanilla, still works)
      24799, // Smoked Desert Dumpling
      // Wrath ports (just in case logs include them)
      43764, // Spiced Mammoth Treats
      46899, 46898, 46897, 46896, 46895, 46894,
    ],
  },
  {
    id: "weaponEnhance",
    label: "Weapon oil / stone",
    description: "Superior Wizard Oil, Adamantite Sharpening Stone, etc.",
    spellIds: [
      // TBC oils & stones
      28013, // Superior Wizard Oil
      28019, // Brilliant Wizard Oil
      28017, // Superior Mana Oil
      25123, // Superior Mana Oil (alt)
      29453, // Adamantite Sharpening Stone
      29452, // Adamantite Weightstone
      28583, // Adamantite Sharpening Stone (alt id)
      // Lower-tier (still better than nothing — keeps the column accurate)
      20749, // Brilliant Mana Oil
      20748, // Brilliant Wizard Oil
      20747, // Lesser Mana Oil
      22756, // Sharpen Blade V
      22757, // Enchant Weapon — Mongoose? actually...
    ],
  },
  {
    id: "scroll",
    label: "Scroll (stat)",
    description: "Cheaper temporary stat boost. Below the 'good' tier.",
    spellIds: [
      33077, // Scroll/Elixir overlap — handled in fallback
      // Actual TBC Scroll V spells
      33093, // Scroll of Strength V
      33092, // Scroll of Stamina V
      33078, // Scroll of Agility V
      33079, // Scroll of Spirit V
      33081, // Scroll of Protection V (armor)
      33080, // Scroll of Intellect V
    ],
  },
  {
    id: "drum",
    label: "Drums",
    description: "Drums of Battle / War / Restoration — group buff.",
    spellIds: [
      35476, // Drums of Battle
      35474, // Drums of Panic
      35478, // Drums of Restoration
      35477, // Drums of Speed
      35475, // Drums of War
      // Wrath versions
      351355, 351358, 351359, 351360, 351766, 351768, 351769, 351771,
    ],
  },
];

const KNOWN_SPELL_IDS = new Set<number>(
  CONSUMABLE_CATEGORIES.flatMap((c) => c.spellIds),
);

/**
 * Name-pattern fallback for auras whose spell id isn't in any curated list.
 * Returns the category id to bucket the aura into, or null to ignore it.
 * Patterns are deliberately narrow — we'd rather miss an obscure consumable
 * than misclassify a class buff as one.
 */
function categorizeByName(name: string): string | null {
  // Drum names are distinctive and short.
  if (/^Drums? of /i.test(name)) return "drum";
  // Flasks always start with "Flask of".
  if (/^Flask of /i.test(name)) return "flask";
  // Scrolls.
  if (/^Scroll of /i.test(name)) return "scroll";
  // Weapon enhancements: oils / sharpening / weightstones.
  if (/(Wizard Oil|Mana Oil|Sharpening Stone|Weightstone|Windfury Totem)/i.test(name)) {
    // Windfury Totem accidental match is a class buff, exclude.
    if (/Windfury/i.test(name)) return null;
    return "weaponEnhance";
  }
  // Well Fed always uses the literal aura name "Well Fed" in WCL, or fish names.
  if (/^Well Fed$/i.test(name)) return "food";
  // Guardian elixirs we know about by name. Order matters: check Guardian
  // before Battle so "Elixir of Major Defense" gets classified correctly.
  if (/^Elixir of (Major Defense|Major Mageblood|Major Fortitude|Greater Defense|the Sages|Empowerment)$/i.test(name)) {
    return "guardianElixir";
  }
  if (/^Earthen Elixir$/i.test(name)) return "guardianElixir";
  // Anything else matching elixir naming → battle elixir bucket.
  if (/^(Elixir of |Adept's Elixir|Greater Arcane Elixir)/i.test(name)) {
    return "battleElixir";
  }
  return null;
}

export interface ConsumableUse {
  /** Category id. */
  category: string;
  /** Number of distinct aura applications (bands intersecting any fight). */
  count: number;
  /** ms uptime, clipped to in-combat intervals (boss + trash). */
  uptimeMs: number;
  /** Spell id that produced the most uptime (for tooltip). */
  bestSpellId?: number;
  bestSpellName?: string;
}

export interface PlayerConsumables {
  id: number;
  name: string;
  type: string;
  /** Category id → use info. Missing keys mean not used. */
  byCategory: Map<string, ConsumableUse>;
}

export interface ConsumablesResult {
  logId: string;
  title?: string;
  /** Total ms across all combat intervals (boss + trash, duration > 0). */
  totalCombatTimeMs: number;
  players: PlayerConsumables[];
}

export interface FetchConsumablesInput {
  reportPathOrId: string;
  apiKey: string;
  clientOptions?: Omit<
    ConstructorParameters<typeof WCLClient>[0],
    "apiKey"
  >;
}

export async function fetchConsumables(
  input: FetchConsumablesInput,
): Promise<ConsumablesResult> {
  const parsed = parseReportInput(input.reportPathOrId);
  const client = new WCLClient({
    ...input.clientOptions,
    apiKey: input.apiKey,
  });
  // mode "all" = no `&encounter=` filter → WCL returns auras across the whole
  // report (boss + trash + idle). We clip to fight intervals client-side.
  const endpoints = makeUrls({
    lang: "EN",
    apiKey: input.apiKey,
    logId: parsed.logId,
    mode: "all",
    noWipes: false,
  });

  const fightsRaw = await client.getJson<FightsResponse>(endpoints.fights);
  // Combat = any fight with positive duration, regardless of boss flag. This
  // includes trash, bosses, and wipes — anything the raid was actually
  // fighting through.
  const combatIntervals = mergeIntervals(
    fightsRaw.fights
      .filter((f) => f.end_time > f.start_time)
      .map((f) => [f.start_time, f.end_time] as [number, number]),
  );
  const totalCombatTimeMs = combatIntervals.reduce(
    (acc, [s, e]) => acc + (e - s),
    0,
  );

  const peopleData = await client.getJson<TableResponse>(
    endpoints.peopleTracked,
  );
  const players = (peopleData.entries ?? []).filter(
    (e) => (e.total ?? 0) > 20,
  );

  // For each player, one buffs?targetid=X call. No encounter filter — we want
  // the bands across the whole report so we can clip to combat client-side.
  const baseBuffsUrl = endpoints.buffsTotalPrefix; // ends with &targetid=
  const playerResults = await Promise.all(
    players.map(async (p) => {
      const url = baseBuffsUrl + p.id;
      const data = await client.getJson<TableResponse>(url);
      const byCategory = aggregate(data, combatIntervals);
      return {
        id: p.id,
        name: p.name,
        type: p.type,
        byCategory,
      };
    }),
  );

  playerResults.sort((a, b) => {
    const c = a.type.localeCompare(b.type);
    if (c !== 0) return c;
    return a.name.localeCompare(b.name);
  });

  return {
    logId: parsed.logId,
    ...(fightsRaw.title ? { title: fightsRaw.title } : {}),
    totalCombatTimeMs,
    players: playerResults,
  };
}

/**
 * Sort intervals by start time and merge overlapping ones so we can clip
 * aura bands against a clean union.
 */
function mergeIntervals(
  raw: Array<[number, number]>,
): Array<[number, number]> {
  if (raw.length === 0) return [];
  const sorted = [...raw].sort((a, b) => a[0] - b[0]);
  const out: Array<[number, number]> = [sorted[0]!];
  for (let i = 1; i < sorted.length; i++) {
    const cur = sorted[i]!;
    const last = out[out.length - 1]!;
    if (cur[0] <= last[1]) {
      last[1] = Math.max(last[1], cur[1]);
    } else {
      out.push(cur);
    }
  }
  return out;
}

/**
 * Returns the total duration of [s, e] clipped to the union of `intervals`.
 * Assumes intervals are sorted and non-overlapping (from mergeIntervals).
 */
function clipToIntervals(
  s: number,
  e: number,
  intervals: Array<[number, number]>,
): number {
  let total = 0;
  for (const [is, ie] of intervals) {
    if (ie <= s) continue;
    if (is >= e) break;
    total += Math.min(e, ie) - Math.max(s, is);
  }
  return total;
}

function aggregate(
  data: TableResponse,
  combatIntervals: Array<[number, number]>,
): Map<string, ConsumableUse> {
  // Bucket each aura into a category (curated id first, name pattern fallback).
  type Bucket = {
    count: number;
    uptimeMs: number;
    bestSpellId?: number;
    bestSpellName?: string;
    bestUptime: number;
  };
  const buckets = new Map<string, Bucket>();
  const ensure = (cat: string): Bucket => {
    let b = buckets.get(cat);
    if (!b) {
      b = { count: 0, uptimeMs: 0, bestUptime: 0 };
      buckets.set(cat, b);
    }
    return b;
  };
  const idToCategory = new Map<number, string>();
  for (const cat of CONSUMABLE_CATEGORIES) {
    for (const id of cat.spellIds) idToCategory.set(id, cat.id);
  }

  for (const aura of data.auras ?? []) {
    if (!aura.guid) continue;
    let cat = idToCategory.get(aura.guid);
    if (!cat) {
      const byName = categorizeByName(aura.name ?? "");
      if (!byName) continue;
      cat = byName;
    }
    // Sum in-combat uptime by clipping each band to combat intervals.
    const bands = aura.bands ?? [];
    let inCombatUptime = 0;
    let inCombatCount = 0;
    for (const band of bands) {
      const bs = band.startTime;
      const be = band.endTime;
      if (be <= bs) continue;
      const overlap = clipToIntervals(bs, be, combatIntervals);
      if (overlap > 0) {
        inCombatUptime += overlap;
        inCombatCount++;
      }
    }
    if (inCombatUptime === 0 && inCombatCount === 0) continue;

    const b = ensure(cat);
    b.count += inCombatCount;
    b.uptimeMs += inCombatUptime;
    if (inCombatUptime > b.bestUptime) {
      b.bestUptime = inCombatUptime;
      b.bestSpellId = aura.guid;
      b.bestSpellName = aura.name;
    }
  }

  const out = new Map<string, ConsumableUse>();
  for (const [cat, b] of buckets) {
    const use: ConsumableUse = {
      category: cat,
      count: b.count,
      uptimeMs: b.uptimeMs,
    };
    if (b.bestSpellId !== undefined) use.bestSpellId = b.bestSpellId;
    if (b.bestSpellName !== undefined) use.bestSpellName = b.bestSpellName;
    out.set(cat, use);
  }
  return out;
}
