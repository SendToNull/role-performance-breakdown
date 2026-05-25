// Combat Log Analytics — Consumables.
// Ports the per-player consumable tracking from Consumables.gs.
//
// Algorithm (Consumables.gs:230-322):
//   For each player and each boss fight:
//     - Source queries report/tables/buffs?start=fight.start&end=fight.end
//       &sourceid=PLAYER per fight. We do ONE query covering the whole report
//       and intersect aura bands with each boss fight client-side — same data,
//       fewer API calls.
//   playerFightCount = boss fights where the player had any aura overlap
//                      (source: line 250-254, "fights where bossData.auras
//                       is non-empty")
//   For each category (in column order):
//     bossIdsFound = boss fights where any aura with a matching spell id
//                    (or a matching name pattern) had a band overlapping
//                    the fight
//     Flask vs Battle/Guardian exclusion (source: line 272 + 289-290): if a
//     fight already had battle OR guardian elixir, that fight is removed
//     from the flask count.
//   percentage = round(bossIdsFound / playerFightCount * 100)
//
// Why sourceid not targetid: source uses sourceid for the per-fight buff
// query. This filters to auras the player applied themselves — exactly what
// "did this player consume X" means. Using targetid would also catch buffs
// cast on the player by others (drums, raid buffs, etc.) which would inflate
// the counts.

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
 * Categories iterate in this order. Battle + Guardian must be evaluated
 * BEFORE Flask so the flask-exclusion logic works correctly (a fight with
 * battle/guardian doesn't count toward flask — they're mutually exclusive).
 *
 * Spell ids: harvested from Consumables.gs:275 (the suboptimal-class check
 * is the only place ids appear inline, since the actual category lists live
 * in a hidden Google-Sheets config tab we can't fetch). Cross-referenced
 * against TBC Wowhead.
 */
export const CONSUMABLE_CATEGORIES: ConsumableCategory[] = [
  {
    id: "battleElixir",
    label: "Battle Elixir",
    description: "Damage-focused elixir. Mutually exclusive with flask + guardian.",
    spellIds: [
      // TBC battle elixirs
      28491, // Adept's Elixir (sp + spell crit)
      28493, // Elixir of Major Shadow Power
      28497, // Elixir of Major Strength
      28501, // Elixir of Major Frost Power
      28503, // Elixir of Major Firepower
      33726, // Elixir of Mastery (all stats)
      45373, // Elixir of Major Agility (crit + dodge)
      54452, // Adept's Elixir alt rank
      // Pre-TBC battle elixirs still legal in TBC
      11406, // Elixir of Demonslaying
      17537, // Elixir of Brute Force
      17538, // Elixir of the Mongoose (per source labeling)
      17539, // Greater Arcane Elixir
      22817, // Elixir of Frost Power
      22818, // Elixir of Greater Firepower
      24361, // Elixir of Greater Agility
      // Wrath ports source script references defensively
      43722, // Wrath frost
      39628, // Wrath
    ],
  },
  {
    id: "guardianElixir",
    label: "Guardian Elixir",
    description: "Defensive elixir. Mutually exclusive with flask + battle.",
    spellIds: [
      // TBC guardian elixirs
      28502, // Elixir of Major Defense (550 armor)
      28509, // Elixir of Major Mageblood (16 mp5)
      39625, // Elixir of Major Fortitude (250 HP, 10 hp5)
      39626, // Earthen Elixir (caster armor)
      33077, // Elixir of Empowerment (-30 spell resist) — sometimes battle, often guardian
      // Pre-TBC guardian elixirs
      22833, // Elixir of Greater Defense
      11334, // Elixir of the Sages
    ],
  },
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
      // Shattrath (raid-only, double-strength) flasks
      42735, 42736, 42737, 42738, 42739,
      // Vanilla flasks still legal in TBC
      17626, // Flask of the Titans
      17627, // Flask of Distilled Wisdom
      17628, // Flask of Supreme Power
      17629, // Flask of Chromatic Resistance
      // Wrath flasks source script references defensively
      46840, 46838,
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
      18192, // Grilled Squid (Vanilla)
      24799, // Smoked Desert Dumpling
      // Wrath foods the source script references defensively
      39627, 43764, 44106, 40323,
    ],
  },
  {
    id: "weaponEnhance",
    label: "Weapon oil / stone",
    description: "Superior Wizard Oil, Adamantite Sharpening Stone, etc.",
    spellIds: [
      28013, // Superior Wizard Oil
      28019, // Brilliant Wizard Oil
      28017, // Superior Mana Oil
      25123, // Superior Mana Oil (alt)
      29453, // Adamantite Sharpening Stone
      29452, // Adamantite Weightstone
      28583, // Adamantite Sharpening Stone (alt id)
      20749, // Brilliant Mana Oil
      20748, // Brilliant Wizard Oil
      20747, // Lesser Mana Oil
    ],
  },
  {
    id: "scroll",
    label: "Scroll (stat)",
    description: "Cheaper temporary stat boost.",
    spellIds: [
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
    description: "Drums of Battle / War / Restoration — group buff. Only counts the player who cast the drum.",
    spellIds: [
      35476, // Drums of Battle
      35474, // Drums of Panic
      35478, // Drums of Restoration
      35477, // Drums of Speed
      35475, // Drums of War
    ],
  },
];

const idToCategory = new Map<number, string>();
for (const cat of CONSUMABLE_CATEGORIES) {
  for (const id of cat.spellIds) idToCategory.set(id, cat.id);
}

/**
 * Name-pattern fallback for auras whose spell id isn't curated. Returns the
 * category id, or null to ignore.
 *
 * Order matters: Guardian-specific elixir names must match before the
 * generic "Elixir of *" rule so Major Defense / Mageblood / Fortitude etc.
 * don't fall into Battle.
 */
function categorizeByName(name: string): string | null {
  if (/^Drums? of /i.test(name)) return "drum";
  if (/^Flask of /i.test(name)) return "flask";
  if (/^Scroll of /i.test(name)) return "scroll";
  if (/^Well Fed$/i.test(name)) return "food";
  if (/(Wizard Oil|Mana Oil|Sharpening Stone|Weightstone)/i.test(name)) {
    return "weaponEnhance";
  }
  if (
    /^Elixir of (Major Defense|Major Mageblood|Major Fortitude|Greater Defense|the Sages|Empowerment)$/i.test(
      name,
    )
  ) {
    return "guardianElixir";
  }
  if (/^Earthen Elixir$/i.test(name)) return "guardianElixir";
  if (/^(Elixir of |Adept's Elixir|Greater Arcane Elixir)/i.test(name)) {
    return "battleElixir";
  }
  return null;
}

export interface ConsumableUse {
  /** Category id. */
  category: string;
  /** Number of boss fights where this category's consumable was active. */
  fightsWithUsage: number;
  /** Best (most-frequent) spell id within the category, for tooltip. */
  bestSpellId?: number;
  bestSpellName?: string;
}

export interface PlayerConsumables {
  id: number;
  name: string;
  type: string;
  /** Boss fights this player participated in. Denominator for every category. */
  playerFightCount: number;
  /** Category id → use info. Missing keys mean not used in any fight. */
  byCategory: Map<string, ConsumableUse>;
}

export interface ConsumablesResult {
  logId: string;
  title?: string;
  /** Number of boss fights inspected. */
  totalFightCount: number;
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
  // mode "all" = no `&encounter=` filter. We want WCL to return auras across
  // the whole report (so bands that span pre-pull → boss are returned in
  // full), then we filter to boss fights client-side via band intersection.
  const endpoints = makeUrls({
    lang: "EN",
    apiKey: input.apiKey,
    logId: parsed.logId,
    mode: "all",
    noWipes: false,
  });

  const fightsRaw = await client.getJson<FightsResponse>(endpoints.fights);
  // Source script only evaluates boss fights (Consumables.gs:215, line 267
  // filters on fight.boss > 0 OR fight.originalBoss). Match that exactly.
  const bossFights = fightsRaw.fights.filter(
    (f) => f.boss > 0 && f.end_time > f.start_time,
  );

  // Player roster (filter low-activity entries the same way the source does).
  const peopleData = await client.getJson<TableResponse>(
    endpoints.peopleTracked,
  );
  const players = (peopleData.entries ?? []).filter(
    (e) => (e.total ?? 0) > 20,
  );

  // Build the buffs URL inline — buffsTotalPrefix uses by=target&targetid=
  // which doesn't match what we need. Source uses sourceid (per-fight,
  // Consumables.gs:246); we use sourceid covering the whole report.
  const buffsBase =
    `${endpoints.base}report/tables/buffs/${parsed.logId}` +
    `${endpoints.apiKeyString}` +
    `&start=0&end=999999999999&sourceid=`;

  const playerResults = await Promise.all(
    players.map(async (p) => {
      const url = buffsBase + p.id;
      const data = await client.getJson<TableResponse>(url);
      return computePlayerConsumables(p, data, bossFights);
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
    totalFightCount: bossFights.length,
    players: playerResults,
  };
}

type Fight = { id: number; start_time: number; end_time: number };

function computePlayerConsumables(
  player: { id: number; name: string; type: string },
  data: TableResponse,
  bossFights: Fight[],
): PlayerConsumables {
  const auras = data.auras ?? [];

  // ---- Determine which boss fights the player participated in ----
  // Source's heuristic: fights where bossData.auras was non-empty after a
  // sourceid query for that fight. With our whole-report query, an aura
  // overlapping the fight window is equivalent. We need at least ONE aura
  // band overlapping the fight to count it as "participated."
  const participatedFightIds = new Set<number>();
  for (const fight of bossFights) {
    for (const aura of auras) {
      if (anyBandOverlaps(aura.bands ?? [], fight.start_time, fight.end_time)) {
        participatedFightIds.add(fight.id);
        break;
      }
    }
  }
  const playerFightCount = participatedFightIds.size;

  // ---- For each boss fight, determine which categories were active ----
  type Hit = { spellId: number; spellName: string };
  const hitsByCategory = new Map<string, Map<number, Hit>>();
  for (const cat of CONSUMABLE_CATEGORIES) hitsByCategory.set(cat.id, new Map());

  for (const aura of auras) {
    if (!aura.guid) continue;
    const cat = idToCategory.get(aura.guid) ?? categorizeByName(aura.name ?? "");
    if (!cat) continue;
    const bucket = hitsByCategory.get(cat);
    if (!bucket) continue;
    const bands = aura.bands ?? [];
    for (const fight of bossFights) {
      if (!participatedFightIds.has(fight.id)) continue;
      if (anyBandOverlaps(bands, fight.start_time, fight.end_time)) {
        if (!bucket.has(fight.id)) {
          bucket.set(fight.id, {
            spellId: aura.guid,
            spellName: aura.name ?? `spell ${aura.guid}`,
          });
        }
      }
    }
  }

  // ---- Flask vs (battle|guardian) mutual exclusion ----
  // Source Consumables.gs:272 + 289-290: if a fight had battle OR guardian
  // elixir, drop it from the flask count (you can't have both).
  const flaskBucket = hitsByCategory.get("flask");
  const battleBucket = hitsByCategory.get("battleElixir");
  const guardianBucket = hitsByCategory.get("guardianElixir");
  if (flaskBucket && (battleBucket || guardianBucket)) {
    for (const fightId of [...flaskBucket.keys()]) {
      if (battleBucket?.has(fightId) || guardianBucket?.has(fightId)) {
        flaskBucket.delete(fightId);
      }
    }
  }

  // ---- Compute per-category use info ----
  const byCategory = new Map<string, ConsumableUse>();
  for (const cat of CONSUMABLE_CATEGORIES) {
    const bucket = hitsByCategory.get(cat.id);
    if (!bucket || bucket.size === 0) continue;
    const perSpell = new Map<number, { count: number; name: string }>();
    for (const hit of bucket.values()) {
      const prev = perSpell.get(hit.spellId);
      if (prev) prev.count++;
      else perSpell.set(hit.spellId, { count: 1, name: hit.spellName });
    }
    let bestSpellId: number | undefined;
    let bestSpellName: string | undefined;
    let bestCount = 0;
    for (const [sid, info] of perSpell) {
      if (info.count > bestCount) {
        bestCount = info.count;
        bestSpellId = sid;
        bestSpellName = info.name;
      }
    }
    const use: ConsumableUse = {
      category: cat.id,
      fightsWithUsage: bucket.size,
    };
    if (bestSpellId !== undefined) use.bestSpellId = bestSpellId;
    if (bestSpellName !== undefined) use.bestSpellName = bestSpellName;
    byCategory.set(cat.id, use);
  }

  return {
    id: player.id,
    name: player.name,
    type: player.type,
    playerFightCount,
    byCategory,
  };
}

/** True if any band [bs, be] overlaps [s, e]. */
function anyBandOverlaps(
  bands: Array<{ startTime: number; endTime: number }>,
  s: number,
  e: number,
): boolean {
  for (const b of bands) {
    if (b.startTime < e && b.endTime > s) return true;
  }
  return false;
}
