// Combat Log Analytics — Gear Issues.
// Ports the gear-checking logic from GearIssues.gs:290-791.
//
// Detects per-player gear problems across all boss fights in a report:
//   - Missing item in a slot                          (#ff0707 bright red)
//   - Item with no permanent enchant                  (#f8aaaa light red)
//   - Item with a known suboptimal enchant            (#fdf2ce light yellow)
//   - Item flagged as suboptimal (PvP/riding/etc.)    (#b9a3ee light purple)
//   - Item with no gem in a socket                    (#f7cfe1 light pink)
//   - Common-quality gem (ilvl < 60)                  (#b7b7b7 grey)
//   - Uncommon-quality gem (ilvl == 60)               (#bfeeae light green)
//   - Meta gem inactive — known-bad meta gem ids      (#f9cb9c orange)
//
// Rare and epic gems are intentionally NOT flagged (matches the script's
// "minimum gem quality = uncommon" mode).

import type {
  Fight,
  FightsResponse,
  TableResponse,
} from "../types/index.js";
import { WCLClient } from "../wcl/client.js";
import { makeUrls } from "../wcl/endpoints.js";
import { parseReportInput } from "../wcl/parseReportInput.js";
import { BAD_ENCHANTS, SUBOPTIMAL_ITEM_IDS } from "./gearIssueData.js";

export type IssueKind =
  | "missing"          // no item in this slot
  | "noEnchant"        // no permanent enchant
  | "badEnchant"       // suboptimal permanent enchant
  | "suboptimalItem"   // item id is on the curated suboptimal list
  | "noGem"            // socket without a gem
  | "commonGem"        // gem itemLevel < 60
  | "uncommonGem"      // gem itemLevel == 60
  | "metaGemInactive";

export const ISSUE_COLORS: Record<IssueKind, string> = {
  missing: "#ff0707",
  noEnchant: "#f8aaaa",
  badEnchant: "#fdf2ce",
  suboptimalItem: "#b9a3ee",
  noGem: "#f7cfe1",
  commonGem: "#b7b7b7",
  uncommonGem: "#bfeeae",
  metaGemInactive: "#f9cb9c",
};

export const ISSUE_LABELS: Record<IssueKind, string> = {
  missing: "no item",
  noEnchant: "no enchant",
  badEnchant: "bad enchant",
  suboptimalItem: "suboptimal item",
  noGem: "no gem",
  commonGem: "common gem",
  uncommonGem: "uncommon gem",
  metaGemInactive: "meta gem inactive",
};

// Build a lookup from enchant id → list of bad-enchant entries. Each entry
// may be slot-specific (e.g. "Bracers - 7 Str" only counts on slot 8) or
// apply to any slot (slot === null).
const BAD_ENCHANT_BY_ID = (() => {
  const m = new Map<number, Array<{ slot: number | null; name: string }>>();
  for (const e of BAD_ENCHANTS) {
    const arr = m.get(e.id) ?? [];
    arr.push({ slot: e.slot, name: e.name });
    m.set(e.id, arr);
  }
  return m;
})();

function lookupBadEnchant(
  enchantId: number,
  slot: number,
): string | null {
  const candidates = BAD_ENCHANT_BY_ID.get(enchantId);
  if (!candidates) return null;
  // Prefer slot-specific match; fall back to a global entry.
  let global: string | null = null;
  for (const c of candidates) {
    if (c.slot === slot) return c.name;
    if (c.slot === null) global = c.name;
  }
  return global;
}

/**
 * Bright/iconic items the script always considers fine (Onyxia Scale Cloak,
 * fishing poles, etc.). Used to suppress noise.
 */
const COMMON_IGNORED_IDS = new Set<number>([
  15138, // Onyxia Scale Cloak
  19022, // Nat Pagle's Extreme Angler FC-5000
  19970, // Arcanite Fishing Pole
  25978, // Seth's Graphite Fishing Pole
  6365, // Strong Fishing Pole
  12225, // Blump Family Fishing Pole
  6367, // Big Iron Fishing Pole
  6366, // Darkwood Fishing Pole
  6256, // Fishing Pole
  38175, // The Horseman's Blade
]);

/**
 * Known TBC meta gems that have activation conditions. If a player has one of
 * these slotted but doesn't meet the rune requirements (e.g. need 2 red + 2
 * yellow), it's effectively inactive. The script flags all of them and lets
 * the user inspect; we do the same — exact rune-requirement enforcement is
 * still phase 2.
 */
const META_GEM_IDS = new Set<number>([
  25897, 25899, 34220, 25890, 35503, 25895, 35501, 32641, 25901, 25893,
  25896, 28557, 32409, 25894, 28556, 25898, 32640, 32410,
]);

/**
 * Item-id → socket count. Hardcoding common raid items is too brittle; for
 * phase 1 we approximate by inferring from WCL data when gems are present
 * (item must have had a socket if any gem is slotted). True missing-gem
 * detection across raid gear requires the proprietary `sockets` reference
 * tab; flagged as phase 2.
 */
const KNOWN_SOCKET_COUNT: Record<number, number> = {};

export interface GearIssue {
  kind: IssueKind;
  itemId: number;
  itemName: string;
  /** Raw WCL slot id 0-18. */
  slot: number;
  /** Slot display name (Head, Neck, ...). */
  slotName: string;
  /** Fights where this issue was seen (boss name → fight id). */
  seenOnBosses: string[];
}

export interface PlayerGearIssues {
  id: number;
  name: string;
  type: string;
  issues: GearIssue[];
}

export interface GearIssuesResult {
  logId: string;
  title?: string;
  bossesScanned: number;
  players: PlayerGearIssues[];
}

export interface FetchGearIssuesInput {
  reportPathOrId: string;
  apiKey: string;
  /** Set of additional item ids to ignore (e.g. user-curated). */
  ignoreItemIds?: number[];
  clientOptions?: Omit<
    ConstructorParameters<typeof WCLClient>[0],
    "apiKey"
  >;
}

const SLOT_LABELS: Record<number, string> = {
  0: "Head",
  1: "Neck",
  2: "Shoulders",
  3: "Shirt",
  4: "Chest",
  5: "Belt",
  6: "Legs",
  7: "Boots",
  8: "Bracers",
  9: "Gloves",
  10: "Ring 1",
  11: "Ring 2",
  12: "Trinket 1",
  13: "Trinket 2",
  14: "Cloak",
  15: "Main Hand",
  16: "Off Hand",
  17: "Ranged",
  18: "Tabard",
};

/** Slots that should be enchanted on a raiding character. */
const ENCHANTABLE_SLOTS = new Set([0, 2, 4, 6, 7, 8, 9, 14, 15, 16]);

/** Slots we expect every player to have an item in. */
const REQUIRED_SLOTS = [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export async function fetchGearIssues(
  input: FetchGearIssuesInput,
): Promise<GearIssuesResult> {
  const parsed = parseReportInput(input.reportPathOrId);
  const client = new WCLClient({
    ...input.clientOptions,
    apiKey: input.apiKey,
  });
  const endpoints = makeUrls({
    lang: "EN",
    apiKey: input.apiKey,
    logId: parsed.logId,
    mode: "all",
    noWipes: false,
  });

  const fightsRaw = await client.getJson<FightsResponse>(endpoints.fights);
  const bossFights = fightsRaw.fights.filter(
    (f) => f.boss > 0 && f.end_time > f.start_time,
  );
  if (bossFights.length === 0) {
    return {
      logId: parsed.logId,
      ...(fightsRaw.title ? { title: fightsRaw.title } : {}),
      bossesScanned: 0,
      players: [],
    };
  }

  const ignoreIds = new Set([
    ...COMMON_IGNORED_IDS,
    ...(input.ignoreItemIds ?? []),
  ]);

  // Per-boss casts gives us each player's gear at that fight.
  const perFight = await Promise.all(
    bossFights.map(async (f) => {
      const url = endpoints.peopleTracked.replace(
        /&start=\d+&end=\d+/,
        `&start=${f.start_time}&end=${f.end_time}`,
      );
      const data = await client.getJson<TableResponse>(url);
      return { fight: f, data };
    }),
  );

  // playerId -> aggregator
  type Agg = {
    name: string;
    type: string;
    /** issueKey (kind+itemId+slot) -> issue with merged bosses */
    issuesByKey: Map<string, GearIssue>;
  };
  const playersById = new Map<number, Agg>();

  for (const { fight, data } of perFight) {
    for (const entry of data.entries ?? []) {
      const rawGear = (entry as { gear?: unknown[] }).gear;
      if (!Array.isArray(rawGear)) continue;
      // Skip players that didn't actually do anything this fight (total <= 20
      // matches the script's RPB.gs:238 noise filter).
      if (typeof entry.total === "number" && entry.total < 20) continue;

      const agg =
        playersById.get(entry.id) ??
        ({
          name: entry.name,
          type: entry.type,
          issuesByKey: new Map<string, GearIssue>(),
        } satisfies Agg);

      const slotsSeen = new Set<number>();

      for (const raw of rawGear) {
        if (typeof raw !== "object" || raw === null) continue;
        const r = raw as Record<string, unknown>;
        const itemId = typeof r["id"] === "number" ? r["id"] : 0;
        if (!itemId || itemId === 0) continue;
        if (ignoreIds.has(itemId)) continue;
        const slot = typeof r["slot"] === "number" ? r["slot"] : -1;
        if (slot < 0 || slot === 3 || slot === 18) continue; // skip shirt/tabard
        const name = typeof r["name"] === "string" ? r["name"] : "(unknown)";
        slotsSeen.add(slot);

        // --- No enchant / suboptimal enchant ---
        if (ENCHANTABLE_SLOTS.has(slot)) {
          const enchantRaw = r["permanentEnchant"];
          if (enchantRaw == null) {
            mergeIssue(agg, fight, {
              kind: "noEnchant",
              itemId,
              itemName: name,
              slot,
              slotName: SLOT_LABELS[slot] ?? `slot ${slot}`,
              seenOnBosses: [],
            });
          } else {
            const enchantId = Number(enchantRaw);
            if (Number.isFinite(enchantId) && enchantId > 0) {
              const badName = lookupBadEnchant(enchantId, slot);
              if (badName) {
                mergeIssue(agg, fight, {
                  kind: "badEnchant",
                  itemId,
                  itemName: `${name} — ${badName}`,
                  slot,
                  slotName: SLOT_LABELS[slot] ?? `slot ${slot}`,
                  seenOnBosses: [],
                });
              }
            }
          }
        }

        // --- Suboptimal item id (PvP/riding/etc.) ---
        if (SUBOPTIMAL_ITEM_IDS.has(itemId)) {
          mergeIssue(agg, fight, {
            kind: "suboptimalItem",
            itemId,
            itemName: name,
            slot,
            slotName: SLOT_LABELS[slot] ?? `slot ${slot}`,
            seenOnBosses: [],
          });
        }

        // --- Gems ---
        const gems = Array.isArray(r["gems"])
          ? (r["gems"] as Array<Record<string, unknown>>)
          : [];

        // Missing gems: only detectable when we know how many sockets the
        // item has. Otherwise we'd over-report. KNOWN_SOCKET_COUNT is empty
        // for now (phase 2).
        const expectedSockets = KNOWN_SOCKET_COUNT[itemId];
        if (typeof expectedSockets === "number" && gems.length < expectedSockets) {
          for (let i = gems.length; i < expectedSockets; i++) {
            mergeIssue(agg, fight, {
              kind: "noGem",
              itemId,
              itemName: name,
              slot,
              slotName: SLOT_LABELS[slot] ?? `slot ${slot}`,
              seenOnBosses: [],
            });
          }
        }

        for (const g of gems) {
          const gid = typeof g["id"] === "number" ? g["id"] : 0;
          const ilvl = typeof g["itemLevel"] === "number" ? g["itemLevel"] : 0;
          if (!gid || !ilvl) continue;

          if (META_GEM_IDS.has(gid)) {
            mergeIssue(agg, fight, {
              kind: "metaGemInactive",
              itemId,
              itemName: name,
              slot,
              slotName: SLOT_LABELS[slot] ?? `slot ${slot}`,
              seenOnBosses: [],
            });
            continue;
          }

          // Gem quality bucketing — only flag uncommon-or-lower per user
          // preference (rare and epic are acceptable):
          //   itemLevel < 60   → common   (#b7b7b7)
          //   itemLevel == 60  → uncommon (#bfeeae)
          if (ilvl < 60) {
            mergeIssue(agg, fight, {
              kind: "commonGem",
              itemId,
              itemName: name,
              slot,
              slotName: SLOT_LABELS[slot] ?? `slot ${slot}`,
              seenOnBosses: [],
            });
          } else if (ilvl === 60) {
            mergeIssue(agg, fight, {
              kind: "uncommonGem",
              itemId,
              itemName: name,
              slot,
              slotName: SLOT_LABELS[slot] ?? `slot ${slot}`,
              seenOnBosses: [],
            });
          }
        }
      }

      // --- Missing items in required slots (only flag once we've seen this
      //     player on any boss). ---
      for (const slot of REQUIRED_SLOTS) {
        if (slotsSeen.has(slot)) continue;
        // Don't flag missing offhand: many specs use 2-handed weapons.
        if (slot === 16) continue;
        // Don't flag missing ranged: some classes don't use it.
        // Already filtered above.
        mergeIssue(agg, fight, {
          kind: "missing",
          itemId: 0,
          itemName: "—",
          slot,
          slotName: SLOT_LABELS[slot] ?? `slot ${slot}`,
          seenOnBosses: [],
        });
      }

      playersById.set(entry.id, agg);
    }
  }

  const players: PlayerGearIssues[] = [];
  for (const [id, agg] of playersById) {
    players.push({
      id,
      name: agg.name,
      type: agg.type,
      issues: [...agg.issuesByKey.values()].sort((a, b) => {
        const c = a.slot - b.slot;
        if (c !== 0) return c;
        return a.kind.localeCompare(b.kind);
      }),
    });
  }
  players.sort((a, b) => {
    const c = a.type.localeCompare(b.type);
    if (c !== 0) return c;
    return a.name.localeCompare(b.name);
  });

  return {
    logId: parsed.logId,
    ...(fightsRaw.title ? { title: fightsRaw.title } : {}),
    bossesScanned: bossFights.length,
    players,
  };
}

function mergeIssue(
  agg: { issuesByKey: Map<string, GearIssue> },
  fight: Fight,
  issue: GearIssue,
): void {
  const key = `${issue.kind}::${issue.itemId}::${issue.slot}`;
  const existing = agg.issuesByKey.get(key);
  if (existing) {
    if (!existing.seenOnBosses.includes(fight.name)) {
      existing.seenOnBosses.push(fight.name);
    }
  } else {
    agg.issuesByKey.set(key, { ...issue, seenOnBosses: [fight.name] });
  }
}
