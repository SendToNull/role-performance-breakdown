// Combat Log Analytics — Consumables.
// Ports the per-player consumable buff tracking from Consumables.gs.
//
// Strategy: one /report/tables/buffs?targetid=X&encounter=-2 call per player
// gives us each player's auras during boss fights. We cross-reference the
// auras against curated TBC consumable categories (flask, food, battle elixir,
// guardian elixir, weapon oil/stone, scroll, drum). Each cell is either:
//   - empty / red: consumable not used
//   - green: consumable used (with use count and uptime%)

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

// Curated TBC consumable buff IDs. Sources: WCL aura logs, WoWHead.
// Phase 1: most-impactful categories. More can be added later.
export const CONSUMABLE_CATEGORIES: ConsumableCategory[] = [
  {
    id: "flask",
    label: "Flask",
    description: "Persists through death. Major raid buff slot.",
    spellIds: [
      28518, // Flask of Fortification
      28519, // Flask of Relentless Assault
      28520, // Flask of Blinding Light
      28521, // Flask of Mighty Restoration
      28540, // Flask of Pure Death
      41608, // Flask of Chromatic Wonder
      42735, // Shattrath Flask of Fortification
      42736, // Shattrath Flask of Mighty Restoration
      42737, // Shattrath Flask of Pure Death
      42738, // Shattrath Flask of Relentless Assault
      42739, // Shattrath Flask of Blinding Light
      17626, // Flask of the Titans (BC-era)
      17628, // Flask of Distilled Wisdom (BC-era)
    ],
  },
  {
    id: "battleElixir",
    label: "Battle Elixir",
    description: "Damage-focused elixir. Mutually exclusive with Flask.",
    spellIds: [
      28490, // Elixir of Major Mageblood
      28491, // Adept's Elixir
      28493, // Elixir of Major Shadow Power
      28501, // Elixir of Major Frost Power
      28503, // Elixir of Major Firepower
      33726, // Elixir of Mastery
      28497, // Elixir of Major Strength
      28491, // dup
      45373, // Elixir of Major Agility (Crit)
      45988, // Earthen Elixir
      54212, // Wrath ports (rare)
      28491, // (already listed)
      33077, // Elixir of Empowerment
    ],
  },
  {
    id: "guardianElixir",
    label: "Guardian Elixir",
    description: "Defensive elixir.",
    spellIds: [
      28502, // Elixir of Major Defense
      28508, // Elixir of Major Fortitude (no, that's a potion)
      28509, // Elixir of Empowerment
      39625, // Elixir of Major Fortitude
      39626, // Earthen Elixir
      28518, // dup safety
      33721, // Insane Strength Potion (battle)
      28499, // Elixir of Mastery (dup)
      28491, // dup
      33077, // dup
      28509, // dup
      54052, // Elixir of Protection
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
      33263, // Blackened Sporefish (8 mp5)
      33265, // Grilled Mudfish (20 agi)
      33268, // Poached Bluefish (23 spell dmg)
      33269, // Golden Fish Sticks (44 heal/14 spell)
      33272, // Stormchops (20 hit)
      35272, // Crunchy Serpent (23 spell dmg)
      40539, // Blackened Basilisk
      40543, // Spicy Crawdad
      40745, // Fisherman's Feast
      43764, // Spiced Mammoth Treats (Wrath safety)
      46899, // Worg Tartare
      46898, // Smoked Salmon
      46897, // Mighty Rhino Dogs
      46896, // Powdered Ridge Mushroom
      46895, // Snapper Extreme
      46894, // Spicy Crawdad
      33268, // dup
      35272, // dup
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
      22756, // Elixir of Sage Mage (incidental)
      36906, // Twink mass enchants ignored
      43233, // Blessed Weapon Coating (Wrath)
      43234, // Righteous Weapon Coating
    ],
  },
  {
    id: "scroll",
    label: "Scroll (stat)",
    description: "Cheaper temporary stat boost. Below the 'good' tier.",
    spellIds: [
      33077, // Scroll of Spirit V
      33078, // Scroll of Stamina V
      33079, // Scroll of Strength V
      33080, // Scroll of Agility V
      33081, // Scroll of Protection V
      33082, // Scroll of Intellect V
      33092, // Scroll of Spirit V (dup)
    ],
  },
  {
    id: "drum",
    label: "Drums",
    description: "Drums of Battle / War / Restoration — group buff.",
    spellIds: [
      35476, 351771, 351355, // Drums of Battle
      35474, // Drums of Panic
      35478, 351769, 351358, // Drums of Restoration
      35477, 351768, 351359, // Drums of Speed
      35475, 351766, 351360, // Drums of War
    ],
  },
];

export interface ConsumableUse {
  /** Category id. */
  category: string;
  /** Number of distinct aura applications. */
  count: number;
  /** ms uptime across all boss fights. */
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
  /** Sum of all boss fight durations in ms — denominator for uptime %. */
  totalBossTimeMs: number;
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
  const endpoints = makeUrls({
    lang: "EN",
    apiKey: input.apiKey,
    logId: parsed.logId,
    mode: "onlyBosses",
    noWipes: false,
  });

  const fightsRaw = await client.getJson<FightsResponse>(endpoints.fights);
  const bossFights = fightsRaw.fights.filter(
    (f) => f.boss > 0 && f.end_time > f.start_time,
  );
  const totalBossTimeMs = bossFights.reduce(
    (acc, f) => acc + (f.end_time - f.start_time),
    0,
  );

  // Pull the player roster (all-fights so we get everyone with non-trivial activity).
  const peopleData = await client.getJson<TableResponse>(
    endpoints.peopleTracked,
  );
  const players = (peopleData.entries ?? []).filter(
    (e) => (e.total ?? 0) > 20,
  );

  // For each player, one buffs?targetid=X&encounter=-2 call.
  // We just append &encounter=-2 to the existing buffsTotalPrefix.
  const baseBuffsUrl = endpoints.buffsTotalPrefix; // ends with &targetid=
  const playerResults = await Promise.all(
    players.map(async (p) => {
      const url = baseBuffsUrl + p.id + "&encounter=-2";
      const data = await client.getJson<TableResponse>(url);
      const byCategory = aggregate(data);
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
    totalBossTimeMs,
    players: playerResults,
  };
}

function aggregate(data: TableResponse): Map<string, ConsumableUse> {
  const out = new Map<string, ConsumableUse>();
  const auras = data.auras ?? [];

  for (const category of CONSUMABLE_CATEGORIES) {
    const set = new Set(category.spellIds);
    let count = 0;
    let uptimeMs = 0;
    let bestSpellId: number | undefined;
    let bestSpellName: string | undefined;
    let bestUptime = 0;
    for (const aura of auras) {
      if (!set.has(aura.guid)) continue;
      const bands = aura.bands ?? [];
      const up = aura.totalUptime ?? 0;
      count += bands.length;
      uptimeMs += up;
      if (up > bestUptime) {
        bestUptime = up;
        bestSpellId = aura.guid;
        bestSpellName = aura.name;
      }
    }
    if (count > 0 || uptimeMs > 0) {
      const use: ConsumableUse = { category: category.id, count, uptimeMs };
      if (bestSpellId !== undefined) use.bestSpellId = bestSpellId;
      if (bestSpellName !== undefined) use.bestSpellName = bestSpellName;
      out.set(category.id, use);
    }
  }
  return out;
}
