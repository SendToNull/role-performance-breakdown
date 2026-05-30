// Combat Log Analytics — Consumables.
// Ports the per-player consumable tracking from Consumables.gs verbatim.
//
// CRITICAL: this module makes a separate `report/tables/buffs` API call per
// (player × boss fight). For a 25-player, 26-boss-fight report that's 650
// requests. We deliberately do NOT optimize this into a single whole-report
// call per player because the two queries return DIFFERENT data:
//
//   Per-fight  &start=F.start&end=F.end&sourceid=P
//     → WCL returns auras only when the player was actively a combatant in
//       that fight window. If the player sat out, response.auras is empty.
//
//   Whole-report  &start=0&end=999999999999&sourceid=P
//     → WCL returns every aura the player ever had, with full band history.
//       A long-duration buff (60-minute battle elixir) appears as one band
//       spanning the entire raid, overlapping fights the player wasn't in.
//
// We previously used the whole-report query + client-side band intersection.
// That broke the denominator: playerFightCount counted every boss fight the
// player's lingering buffs overlapped, not just fights they were actually in.
// Sheet showed 100%, our app showed 25-30%, because the divisor was wrong.
//
// The WCLClient queue auto-throttles at concurrency 8 and retries 429/5xx, so
// the call burst is safe. A typical 25×26 run completes in ~10-15 seconds.
//
// Source's spell-id-to-category table lives in an external Google Sheet
// (`buffConsumables` tab in spreadsheet 1pIbbPkn9i5jxyQ60Xt86fLthtbdCAmFriIpPSvmXiu0)
// loaded at runtime. CONSUMABLE_CATEGORIES is a verbatim copy of that table,
// captured 2026-05.

import type { FightsResponse, TableResponse } from "../types/index.js";
import { WCLClient } from "../wcl/client.js";
import { makeUrls } from "../wcl/endpoints.js";
import { parseReportInput } from "../wcl/parseReportInput.js";

export interface ConsumableCategory {
  id: string;
  label: string;
  /** Spell ids that count toward this category. Verbatim from source's conf sheet. */
  spellIds: number[];
  /** Help text shown on hover. */
  description?: string;
}

/**
 * Verbatim copy of the `buffConsumables` configuration tab columns from the
 * RPB source spreadsheet. Order matches source's iteration (Battle → Guardian
 * → Flask → Food → Scroll) so the flask exclusion logic at the end works
 * correctly.
 */
export const CONSUMABLE_CATEGORIES: ConsumableCategory[] = [
  {
    id: "battleElixir",
    label: "Battle Elixir",
    description:
      "Damage-focused elixir. Mutually exclusive with flask + guardian.",
    spellIds: [
      10667, 10669, 11334, 11405, 11406, 11474, 16323, 16329, 17038, 17537,
      17538, 17539, 26276, 28490, 28491, 28493, 28497, 28501, 28503, 33720,
      33721, 33726, 38954, 45373, 45374,
    ],
  },
  {
    id: "guardianElixir",
    label: "Guardian Elixir",
    description:
      "Defensive elixir. Mutually exclusive with flask + battle.",
    spellIds: [
      10668, 10692, 10693, 11348, 11371, 11374, 11396, 17535, 24361, 24363,
      24382, 24383, 24417, 28502, 28509, 28514, 30003, 39625, 39626, 39627,
      39628,
    ],
  },
  {
    id: "flask",
    label: "Flask",
    description: "Persists through death. Mutually exclusive with elixirs.",
    spellIds: [
      17626, 17627, 17628, 17629, 28518, 28519, 28520, 28521, 28540, 40576,
      40577, 40579, 40580, 40582, 40586, 40587, 40588, 40763, 41604, 41605,
      41606, 41607, 42735, 46838, 46840,
    ],
  },
  {
    id: "food",
    label: "Food buff (Well Fed)",
    description: "Per-stat food bonus. Lost on death.",
    spellIds: [
      19705, 19706, 19708, 19709, 19710, 19711, 22730, 22731, 24799, 24870,
      25660, 25661, 25694, 25804, 25941, 33254, 33256, 33257, 33259, 33261,
      33263, 33265, 33268, 35272, 40323, 42293, 43730, 43731, 43733, 43764,
      43771, 44097, 44098, 44099, 44100, 44101, 44102, 44103, 44104, 44105,
      44106, 45245, 45619, 46682, 46687, 46899, 43722, 21149,
    ],
  },
  {
    id: "scroll",
    label: "Scroll (stat)",
    description: "Cheaper temporary stat boost. *  = below level 5.",
    spellIds: [
      33077, 33078, 33079, 33080, 33081, 33082, 12174, 8117, 8116, 8115, 12176,
      8098, 8097, 8096, 12175, 8095, 8094, 8091, 12177, 8114, 8113, 8112,
      12178, 8101, 8100, 8099, 12179, 8120, 8119, 8118,
    ],
  },
];

/**
 * Spell ids of "low-rank" scrolls — source marks these with `*` in their
 * cell label (see the `[Agi*]` etc. entries in the conf sheet).
 */
const LOW_LEVEL_SCROLL_IDS = new Set<number>([
  12174, 8117, 8116, 8115, 12176, 8098, 8097, 8096, 12175, 8095, 8094, 8091,
  12177, 8114, 8113, 8112, 12178, 8101, 8100, 8099, 12179, 8120, 8119, 8118,
]);

const idToCategory = new Map<number, string>();
for (const cat of CONSUMABLE_CATEGORIES) {
  for (const id of cat.spellIds) idToCategory.set(id, cat.id);
}

/**
 * Ports the class-vs-spell-id gate from Consumables.gs:275. Returns true if
 * the consumable is suboptimal for this class.
 *
 * NOTE: source's first clause uses font-italic style on the cell to mark
 * generally-low-tier consumables (e.g. lesser elixirs vs major). We don't
 * have access to the sheet's cell formatting so that clause is skipped here;
 * everything that follows is the explicit class-vs-spell-id list and is
 * ported verbatim.
 */
function isSuboptimalForPlayer(spellId: number, playerType: string): boolean {
  const id = spellId;
  const t = playerType;
  if (id === 33721 && t !== "Mage" && t !== "Paladin" && t !== "Druid" && t !== "Shaman") return true;
  if (
    (id === 11406 || id === 28497 || id === 43764 || id === 28520 || id === 41606 || id === 11374) &&
    t !== "Rogue" && t !== "Druid" && t !== "Warrior" && t !== "Shaman" && t !== "Hunter" && t !== "Paladin"
  ) return true;
  if (
    (id === 28491 || id === 33268 || id === 17627) &&
    t !== "Druid" && t !== "Priest" && t !== "Paladin" && t !== "Shaman"
  ) return true;
  if (id === 28493 && t !== "Mage") return true;
  if ((id === 28501 || id === 43722) && t !== "Mage" && t !== "Warlock") return true;
  if (id === 28503 && t !== "Warlock" && t !== "Priest") return true;
  if (
    (id === 33726 || id === 28502 || id === 28518 || id === 41607) &&
    t !== "Druid" && t !== "Paladin" && t !== "Warrior"
  ) return true;
  if (
    (id === 28521 || id === 46840) &&
    t !== "Druid" && t !== "Paladin" && t !== "Mage" && t !== "Shaman"
  ) return true;
  if (
    (id === 28540 || id === 46838) &&
    t !== "Priest" && t !== "Warlock" && t !== "Mage"
  ) return true;
  if (
    id === 28509 &&
    (t === "Rogue" || t === "Warrior" || t === "Mage" || t === "Warlock")
  ) return true;
  if (
    (id === 39627 || id === 33263 || id === 33265) &&
    (t === "Rogue" || t === "Warrior" || t === "Hunter")
  ) return true;
  if (
    (id === 33256 || id === 44106 || id === 40323) &&
    t !== "Shaman" && t !== "Paladin" && t !== "Warrior"
  ) return true;
  if (id === 33261 && t !== "Druid" && t !== "Hunter" && t !== "Rogue") return true;
  if (id === 39628 && t !== "Druid") return true;
  if (id === 17538 && t !== "Warrior" && t !== "Hunter" && t !== "Rogue") return true;
  return false;
}

export interface ConsumableUse {
  /** Category id. */
  category: string;
  /** Number of boss fights where this category's consumable was active. */
  fightsWithUsage: number;
  /** Best (most-frequent) spell id within the category, for tooltip. */
  bestSpellId?: number;
  bestSpellName?: string;
  /** True if any consumable used in this category was suboptimal for the class. */
  suboptimal?: boolean;
  /** Comma-joined names of the suboptimal spells (for tooltip), if any. */
  suboptimalNames?: string;
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

const TRACKED_CLASSES = new Set([
  "Druid",
  "Hunter",
  "Mage",
  "Priest",
  "Paladin",
  "Rogue",
  "Shaman",
  "Warlock",
  "Warrior",
]);

export async function fetchConsumables(
  input: FetchConsumablesInput,
): Promise<ConsumablesResult> {
  const parsed = parseReportInput(input.reportPathOrId);
  const client = new WCLClient({
    ...input.clientOptions,
    apiKey: input.apiKey,
  });
  // mode "all" — we override start/end per fight ourselves.
  const endpoints = makeUrls({
    lang: "EN",
    apiKey: input.apiKey,
    logId: parsed.logId,
    mode: "all",
    noWipes: false,
  });

  const fightsRaw = await client.getJson<FightsResponse>(endpoints.fights);
  // Source line 215 + 244: boss fights only.
  const bossFights = fightsRaw.fights.filter(
    (f) => f.boss > 0 && f.end_time > f.start_time,
  );

  // Source line 231: only TBC classes with table.total > 20.
  const peopleData = await client.getJson<TableResponse>(
    endpoints.peopleTracked,
  );
  const players = (peopleData.entries ?? []).filter(
    (e) => TRACKED_CLASSES.has(e.type) && (e.total ?? 0) > 20,
  );

  // Build base URL once. Each call appends sourceid + per-fight start/end.
  // Use raw apiKeyString (no mode filter / no encounter filter).
  const baseBuffsUrl =
    `${endpoints.base}report/tables/buffs/${parsed.logId}` +
    `${endpoints.apiKeyString}`;

  const playerResults = await Promise.all(
    players.map(async (p) => {
      // For each boss fight: per-fight per-player buffs query. Source's
      // exact approach. The WCLClient queue (concurrency 8) auto-throttles.
      const perFight = await Promise.all(
        bossFights.map(async (f) => {
          const url =
            `${baseBuffsUrl}&start=${f.start_time}&end=${f.end_time}` +
            `&sourceid=${p.id}`;
          const data = await client.getJson<TableResponse>(url);
          return { fight: f, auras: data.auras ?? [] };
        }),
      );
      return computePlayerConsumables(p, perFight);
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
type FightAuras = {
  fight: Fight;
  auras: Array<{ guid: number; name: string }>;
};

function computePlayerConsumables(
  player: { id: number; name: string; type: string },
  perFight: FightAuras[],
): PlayerConsumables {
  // Source line 250-254: playerFightCount = boss fights where the per-fight
  // sourceid query returned any auras. With our per-fight queries we use the
  // same heuristic.
  let playerFightCount = 0;
  for (const fa of perFight) {
    if (fa.auras.length > 0) playerFightCount++;
  }

  // Per-category boss-fight tracking. Mirrors source's nested loops at
  // Consumables.gs:260-309.
  type Hit = { spellId: number; spellName: string; suboptimal: boolean };
  const hitsByCategory = new Map<string, Map<number, Hit>>();
  for (const cat of CONSUMABLE_CATEGORIES) hitsByCategory.set(cat.id, new Map());

  // bossCovered tracks fight ids where battle or guardian elixir hit. Used
  // for flask mutual exclusion (source line 272 + 289-290).
  const bossCovered = new Set<number>();

  // Iterate categories in column order so battle and guardian populate
  // bossCovered BEFORE flask checks it. Matches source's outer column loop.
  for (const cat of CONSUMABLE_CATEGORIES) {
    const bucket = hitsByCategory.get(cat.id)!;
    for (const { fight, auras } of perFight) {
      for (const aura of auras) {
        if (aura.guid == null) continue;
        // Spell id must belong to THIS category (source matches by id only).
        if (idToCategory.get(aura.guid) !== cat.id) continue;
        // Source line 272: flask excludes fights already covered by elixir.
        if (cat.id === "flask" && bossCovered.has(fight.id)) continue;
        if (bucket.has(fight.id)) continue;
        let label = aura.name ?? `spell ${aura.guid}`;
        if (cat.id === "scroll" && LOW_LEVEL_SCROLL_IDS.has(aura.guid)) {
          label += "*";
        }
        bucket.set(fight.id, {
          spellId: aura.guid,
          spellName: label,
          suboptimal: isSuboptimalForPlayer(aura.guid, player.type),
        });
        // Source line 289-290: only battle + guardian populate bossCovered.
        if (cat.id === "battleElixir" || cat.id === "guardianElixir") {
          bossCovered.add(fight.id);
        }
      }
    }
  }

  // Reduce per-category buckets to ConsumableUse.
  const byCategory = new Map<string, ConsumableUse>();
  for (const cat of CONSUMABLE_CATEGORIES) {
    const bucket = hitsByCategory.get(cat.id);
    if (!bucket || bucket.size === 0) continue;
    const perSpell = new Map<number, { count: number; name: string }>();
    let anySuboptimal = false;
    const suboptimalNamesSet = new Set<string>();
    for (const hit of bucket.values()) {
      const prev = perSpell.get(hit.spellId);
      if (prev) prev.count++;
      else perSpell.set(hit.spellId, { count: 1, name: hit.spellName });
      if (hit.suboptimal) {
        anySuboptimal = true;
        suboptimalNamesSet.add(hit.spellName);
      }
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
    if (anySuboptimal) {
      use.suboptimal = true;
      use.suboptimalNames = [...suboptimalNamesSet].join(", ");
    }
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
