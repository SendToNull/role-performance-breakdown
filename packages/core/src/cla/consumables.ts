// Combat Log Analytics — Consumables.
// Ports the per-player consumable tracking from Consumables.gs.
//
// Algorithm (matches the source script exactly):
//   For each player and each category:
//     bossIdsFound = fights where ANY aura with a matching spell id had at
//                    least one band overlapping the fight
//     playerFightCount = fights where the player had any aura at all (proxy
//                        for "player participated in this fight")
//     percentage = round(bossIdsFound / playerFightCount * 100)
//
// Mutual exclusion: a player can have either a flask OR (battle elixir +
// guardian elixir). If battle/guardian was found on a fight, that fight is
// excluded from the flask count for that player — same as Consumables.gs:272.
//
// Default scope: boss + trash (any fight with positive duration). The source
// only looked at boss fights, but the user wants trash included so flasks /
// elixirs applied before the first boss show up.
//
// We make exactly ONE buffs query per player covering the whole report
// (no &encounter=). The per-fight participation check is done client-side
// by intersecting aura bands with fight intervals — no per-fight queries.

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
 * Categories iterate in this order. Source script requires Battle + Guardian
 * to be checked BEFORE Flask so the flask-exclusion logic works correctly
 * (a fight with battle/guardian doesn't count toward flask uptime).
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
      33077, // Elixir of Empowerment (spell penetration)
      33726, // Elixir of Mastery (all stats)
      45373, // Elixir of Major Agility (crit + dodge)
      54452, // Adept's Elixir (alt rank)
      // Pre-TBC battle elixirs still legal in TBC
      11406, // Elixir of Demonslaying
      17537, // Elixir of Brute Force
      17538, // Elixir of the Mongoose
      17539, // Greater Arcane Elixir
      22817, // Elixir of Frost Power
      22818, // Elixir of Greater Firepower
      24361, // Elixir of Greater Agility
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
      18192, // Grilled Squid (vanilla, still works)
      24799, // Smoked Desert Dumpling
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
    description: "Cheaper temporary stat boost. Below the 'good' tier.",
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
    description: "Drums of Battle / War / Restoration — group buff.",
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
 * don't fall into Battle by mistake.
 */
function categorizeByName(name: string): string | null {
  if (/^Drums? of /i.test(name)) return "drum";
  if (/^Flask of /i.test(name)) return "flask";
  if (/^Scroll of /i.test(name)) return "scroll";
  if (/^Well Fed$/i.test(name)) return "food";
  if (/(Wizard Oil|Mana Oil|Sharpening Stone|Weightstone)/i.test(name)) {
    return "weaponEnhance";
  }
  // Guardian elixirs — named explicitly so they don't fall into Battle.
  if (
    /^Elixir of (Major Defense|Major Mageblood|Major Fortitude|Greater Defense|the Sages)$/i.test(
      name,
    )
  ) {
    return "guardianElixir";
  }
  if (/^Earthen Elixir$/i.test(name)) return "guardianElixir";
  // Generic elixir → battle bucket.
  if (/^(Elixir of |Adept's Elixir|Greater Arcane Elixir)/i.test(name)) {
    return "battleElixir";
  }
  return null;
}

export interface ConsumableUse {
  /** Category id. */
  category: string;
  /** Number of fights where this category's consumable was active. */
  fightsWithUsage: number;
  /** Best (most-frequent) spell id within the category, for tooltip. */
  bestSpellId?: number;
  bestSpellName?: string;
}

export interface PlayerConsumables {
  id: number;
  name: string;
  type: string;
  /** Combat fights this player participated in. Denominator for every category. */
  playerFightCount: number;
  /** Category id → use info. Missing keys mean not used in any fight. */
  byCategory: Map<string, ConsumableUse>;
}

export interface ConsumablesResult {
  logId: string;
  title?: string;
  /** Combat fights inspected (boss + trash, duration > 0). */
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
  // mode "all" = no `&encounter=` filter → WCL returns auras across the whole
  // report (boss + trash + idle). We then bucket band overlaps to fights.
  const endpoints = makeUrls({
    lang: "EN",
    apiKey: input.apiKey,
    logId: parsed.logId,
    mode: "all",
    noWipes: false,
  });

  const fightsRaw = await client.getJson<FightsResponse>(endpoints.fights);
  // Combat fights = any fight with positive duration (boss + trash + wipes).
  const combatFights = fightsRaw.fights.filter(
    (f) => f.end_time > f.start_time,
  );

  const peopleData = await client.getJson<TableResponse>(
    endpoints.peopleTracked,
  );
  const players = (peopleData.entries ?? []).filter(
    (e) => (e.total ?? 0) > 20,
  );

  const baseBuffsUrl = endpoints.buffsTotalPrefix; // ends with &targetid=
  const playerResults = await Promise.all(
    players.map(async (p) => {
      const url = baseBuffsUrl + p.id;
      const data = await client.getJson<TableResponse>(url);
      return computePlayerConsumables(p, data, combatFights);
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
    totalFightCount: combatFights.length,
    players: playerResults,
  };
}

type Fight = { id: number; start_time: number; end_time: number };

function computePlayerConsumables(
  player: { id: number; name: string; type: string },
  data: TableResponse,
  combatFights: Fight[],
): PlayerConsumables {
  const auras = data.auras ?? [];

  // ---- Determine which fights the player participated in ----
  // A player "participated" in a fight if they have ANY aura with a band
  // overlapping the fight. Same proxy the source uses (it checks "any aura
  // applied during this fight" — line Consumables.gs:250-254).
  const participatedFightIds = new Set<number>();
  for (const fight of combatFights) {
    for (const aura of auras) {
      if (anyBandOverlaps(aura.bands ?? [], fight.start_time, fight.end_time)) {
        participatedFightIds.add(fight.id);
        break;
      }
    }
  }
  const playerFightCount = participatedFightIds.size;

  // ---- For each fight, determine which categories were active ----
  // We bucket each aura into a category (curated id first, name fallback),
  // then for each fight check whether any aura in that category had a band
  // overlapping. This mirrors the source's nested-loop logic but in O(fights
  // * auras) instead of needing N×M API calls.
  type FightCategoryHit = { categoryId: string; spellId: number; spellName: string };
  // category id -> Map<fight id, hit>
  const hitsByCategory = new Map<string, Map<number, FightCategoryHit>>();
  for (const cat of CONSUMABLE_CATEGORIES) hitsByCategory.set(cat.id, new Map());

  for (const aura of auras) {
    if (!aura.guid) continue;
    const cat = idToCategory.get(aura.guid) ?? categorizeByName(aura.name ?? "");
    if (!cat) continue;
    const bucket = hitsByCategory.get(cat);
    if (!bucket) continue;
    for (const fight of combatFights) {
      if (!participatedFightIds.has(fight.id)) continue;
      if (anyBandOverlaps(aura.bands ?? [], fight.start_time, fight.end_time)) {
        if (!bucket.has(fight.id)) {
          bucket.set(fight.id, {
            categoryId: cat,
            spellId: aura.guid,
            spellName: aura.name ?? `spell ${aura.guid}`,
          });
        }
      }
    }
  }

  // ---- Apply flask vs (battle|guardian) mutual exclusion ----
  // Source Consumables.gs:272 + 289-290: if a fight has battle OR guardian
  // elixir, that fight is removed from the flask count (you can't have both).
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
    // Pick the spell that appeared in the most fights as the "best" / display
    // name for the tooltip.
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
