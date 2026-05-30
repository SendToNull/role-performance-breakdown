// Combat Log Analytics — Consumables.
// Ports the per-player consumable tracking from Consumables.gs.
//
// Source's spell-id-to-category table lives in an external Google Sheet
// (`buffConsumables` tab in spreadsheet 1pIbbPkn9i5jxyQ60Xt86fLthtbdCAmFriIpPSvmXiu0)
// loaded at runtime — not inline in the .gs file. The CONSUMABLE_CATEGORIES
// list below is a verbatim copy of that table's column data, captured 2026-05.
// Do NOT add IDs by guessing from spell name pattern; if a new TBC consumable
// shows up, add it here only after confirming it in the source table.
//
// Algorithm (Consumables.gs:230-322):
//   For each player and each boss fight:
//     - Source queries report/tables/buffs?start=fight.start&end=fight.end
//       &sourceid=PLAYER per fight. We do ONE query covering the whole report
//       and intersect aura bands with each boss fight client-side — same data,
//       fewer API calls.
//   playerFightCount = boss fights where the player had any aura overlap
//                      (source line 250-254).
//   For each category in column order (battle, guardian, flask, food, scroll):
//     bossIdsFound = boss fights where any aura with a matching spell id had
//                    a band overlapping the fight.
//     Flask vs Battle/Guardian exclusion (source line 272 + 289-290): a fight
//     that already had battle OR guardian is removed from the flask count.
//   percentage = round(bossIdsFound / playerFightCount * 100)
//
// Why sourceid not targetid: source uses sourceid for the per-fight buff
// query — filters to auras the player applied themselves. targetid would also
// catch buffs cast on the player by others (raid buffs, drums from other
// players, etc.) and inflate the counts.
//
// Suboptimal flagging (source line 275): a giant boolean OR of class-vs-spell
// gates. When it fires for a player on a given consumable, source styles the
// cell bold+italic with a gray background AND accumulates the spell name into
// a per-player suboptimal-strings list shown in the right margin.
//
// What's NOT yet ported: weapon enhancement (source line 323-447). That path
// fetches per-fight summary tables and scans combatantInfo.gear for slot 15/16
// temporaryEnchant ids; it's a different data source from buff auras and
// needs its own port. The column is omitted from the matrix until that lands.

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
 * cell label (see the `[Agi*]` etc. entries in the conf sheet). We surface
 * the marker in the tooltip so users can spot when someone scrolled rank IV
 * instead of V.
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
  // 33721 — battle elixir, suboptimal for non-caster
  if (id === 33721 && t !== "Mage" && t !== "Paladin" && t !== "Druid" && t !== "Shaman") return true;
  // (11406, 28497, 43764, 28520, 41606, 11374) — physical/strength buffs, suboptimal for casters
  if (
    (id === 11406 || id === 28497 || id === 43764 || id === 28520 || id === 41606 || id === 11374) &&
    t !== "Rogue" && t !== "Druid" && t !== "Warrior" && t !== "Shaman" && t !== "Hunter" && t !== "Paladin"
  ) return true;
  // (28491, 33268, 17627) — spell-crit/spirit, suboptimal for non-caster-healers
  if (
    (id === 28491 || id === 33268 || id === 17627) &&
    t !== "Druid" && t !== "Priest" && t !== "Paladin" && t !== "Shaman"
  ) return true;
  // 28493 — shadow power, only mage
  if (id === 28493 && t !== "Mage") return true;
  // (28501, 43722) — frost power, mages/warlocks only
  if ((id === 28501 || id === 43722) && t !== "Mage" && t !== "Warlock") return true;
  // 28503 — fire power, warlocks/priests only
  if (id === 28503 && t !== "Warlock" && t !== "Priest") return true;
  // (33726, 28502, 28518, 41607) — defense/all-stats, hybrids/warrior only
  if (
    (id === 33726 || id === 28502 || id === 28518 || id === 41607) &&
    t !== "Druid" && t !== "Paladin" && t !== "Warrior"
  ) return true;
  // (28521, 46840) — mighty restoration / wrath equivalent, mp5 classes only
  if (
    (id === 28521 || id === 46840) &&
    t !== "Druid" && t !== "Paladin" && t !== "Mage" && t !== "Shaman"
  ) return true;
  // (28540, 46838) — pure death (shadow flask), spell DPS only
  if (
    (id === 28540 || id === 46838) &&
    t !== "Priest" && t !== "Warlock" && t !== "Mage"
  ) return true;
  // 28509 — major mageblood (mp5), SUBOPTIMAL when used by mana-irrelevant classes
  if (
    id === 28509 &&
    (t === "Rogue" || t === "Warrior" || t === "Mage" || t === "Warlock")
  ) return true;
  // (39627, 33263, 33265) — spell-haste / spell-crit / agi food, SUBOPTIMAL for physical DPS
  if (
    (id === 39627 || id === 33263 || id === 33265) &&
    (t === "Rogue" || t === "Warrior" || t === "Hunter")
  ) return true;
  // (33256, 44106, 40323) — hit-rating food, suboptimal for non-physical-melee
  if (
    (id === 33256 || id === 44106 || id === 40323) &&
    t !== "Shaman" && t !== "Paladin" && t !== "Warrior"
  ) return true;
  // 33261 — spell-damage food, suboptimal for physical
  if (id === 33261 && t !== "Druid" && t !== "Hunter" && t !== "Rogue") return true;
  // 39628 — agility food, only druid
  if (id === 39628 && t !== "Druid") return true;
  // 17538 — mongoose elixir, suboptimal for non-melee/hunter
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
  /**
   * True if any of the spells used in this category were flagged suboptimal
   * for the player's class. Mirrors source's `isPlayerACheapass` per-cell flag.
   */
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

export async function fetchConsumables(
  input: FetchConsumablesInput,
): Promise<ConsumablesResult> {
  const parsed = parseReportInput(input.reportPathOrId);
  const client = new WCLClient({
    ...input.clientOptions,
    apiKey: input.apiKey,
  });
  // mode "all" so WCL returns auras across the whole report; we filter to
  // boss fights client-side via band intersection.
  const endpoints = makeUrls({
    lang: "EN",
    apiKey: input.apiKey,
    logId: parsed.logId,
    mode: "all",
    noWipes: false,
  });

  const fightsRaw = await client.getJson<FightsResponse>(endpoints.fights);
  // Source only evaluates boss fights (Consumables.gs:215, 244).
  const bossFights = fightsRaw.fights.filter(
    (f) => f.boss > 0 && f.end_time > f.start_time,
  );

  // Player roster filter — source skips players with total < 20.
  const peopleData = await client.getJson<TableResponse>(
    endpoints.peopleTracked,
  );
  const players = (peopleData.entries ?? []).filter(
    (e) => (e.total ?? 0) > 20,
  );

  // Source uses &sourceid=PLAYER per-fight (Consumables.gs:246). We do one
  // whole-report query per player and band-intersect each boss fight, which
  // is equivalent and much cheaper.
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

  // ---- Participation set: fights where the player had any aura band ----
  // Source line 250-254: playerFightCount increments per-fight only if the
  // sourceid query returned auras. Equivalent: at least one of OUR aura
  // entries has a band overlapping this fight.
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

  // ---- Per-category, per-fight hits ----
  type Hit = { spellId: number; spellName: string; suboptimal: boolean };
  const hitsByCategory = new Map<string, Map<number, Hit>>();
  for (const cat of CONSUMABLE_CATEGORIES) hitsByCategory.set(cat.id, new Map());

  for (const aura of auras) {
    if (aura.guid == null) continue;
    // Source matches by spell id only (no name fallback). If an id isn't in
    // the conf table, source ignores it — we do the same.
    const cat = idToCategory.get(aura.guid);
    if (!cat) continue;
    const bucket = hitsByCategory.get(cat);
    if (!bucket) continue;
    const bands = aura.bands ?? [];
    const suboptimal = isSuboptimalForPlayer(aura.guid, player.type);
    let label = aura.name ?? `spell ${aura.guid}`;
    if (cat === "scroll" && LOW_LEVEL_SCROLL_IDS.has(aura.guid)) label += "*";
    for (const fight of bossFights) {
      if (!participatedFightIds.has(fight.id)) continue;
      if (!anyBandOverlaps(bands, fight.start_time, fight.end_time)) continue;
      if (!bucket.has(fight.id)) {
        bucket.set(fight.id, {
          spellId: aura.guid,
          spellName: label,
          suboptimal,
        });
      }
    }
  }

  // ---- Flask vs (battle | guardian) mutual exclusion ----
  // Source Consumables.gs:272 + 289-290: a fight where battle OR guardian
  // was active is removed from the flask count (they're mutually exclusive
  // in TBC — using a flask cancels any active elixir).
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

  // ---- Reduce to ConsumableUse per category ----
  const byCategory = new Map<string, ConsumableUse>();
  for (const cat of CONSUMABLE_CATEGORIES) {
    const bucket = hitsByCategory.get(cat.id);
    if (!bucket || bucket.size === 0) continue;
    // Per-spell counts to pick "best" (most-used) for the tooltip.
    const perSpell = new Map<
      number,
      { count: number; name: string; suboptimal: boolean }
    >();
    let anySuboptimal = false;
    const suboptimalNamesSet = new Set<string>();
    for (const hit of bucket.values()) {
      const prev = perSpell.get(hit.spellId);
      if (prev) prev.count++;
      else
        perSpell.set(hit.spellId, {
          count: 1,
          name: hit.spellName,
          suboptimal: hit.suboptimal,
        });
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
