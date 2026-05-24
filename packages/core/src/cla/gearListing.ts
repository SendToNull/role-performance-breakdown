// Combat Log Analytics — Gear Listing.
// Ports PullAllGear.gs:1-252.
//
// For each boss fight in a report, fetches /report/tables/casts and pulls
// each player's `gear` array. Returns a per-player, per-slot map.

import type {
  Fight,
  FightsResponse,
  TableResponse,
} from "../types/index.js";
import { makeUrls } from "../wcl/endpoints.js";
import { WCLClient } from "../wcl/client.js";
import { parseReportInput } from "../wcl/parseReportInput.js";

export interface GearItem {
  id: number;
  name: string;
  /** Raw WCL slot id (0-18). */
  slot: number;
  itemLevel?: number;
  /** Permanent enchant name, if WCL has it. */
  permanentEnchantName?: string;
  /** Gems socketed, if WCL has them. */
  gems?: Array<{ id: number; itemLevel?: number }>;
}

export interface GearPlayer {
  id: number;
  name: string;
  /** WCL class (e.g. "Warrior", "Death Knight"). */
  type: string;
  /** Gear keyed by displayPosition (see SLOT_POSITION_ORDER below). */
  gearByPosition: Map<number, GearItem>;
}

export interface GearListingFight {
  fightId: number;
  bossName: string;
  killed: boolean;
  durationMs: number;
  fightPercentage?: number;
  /** Players from this fight's gear snapshot. */
  players: GearPlayer[];
}

export interface GearListingResult {
  logId: string;
  zone?: string;
  title?: string;
  /** One entry per boss fight that had gear data; in chronological order. */
  fights: GearListingFight[];
}

export interface FetchGearListingInput {
  reportPathOrId: string;
  apiKey: string;
  /** Optional specific fight id to limit to. */
  onlyFightId?: number | null;
  clientOptions?: ConstructorParameters<typeof WCLClient>[0] extends infer T
    ? T extends { apiKey: string }
      ? Omit<T, "apiKey">
      : never
    : never;
}

/**
 * The script's slot-to-position remap from PullAllGear.gs:204-224. Maps raw
 * WCL slot ids to the display column order used in the gear sheet.
 *
 * Slot 3 (Shirt) and 18 (Tabard) are skipped — purely cosmetic.
 */
const SLOT_TO_POSITION: Record<number, number> = {
  0: 0,    // Head
  1: 1,    // Neck
  2: 2,    // Shoulders
  14: 3,   // Cloak (script moves slot 14 to pos 3, right after Shoulders)
  4: 4,    // Chest
  8: 5,    // Bracers (script: slot 8 → pos 5)
  9: 6,    // Gloves (script: slot 9 → pos 6)
  5: 7,    // Belt (script: slot 5 → pos 7)
  6: 8,    // Legs (script: slot 6 → pos 8)
  7: 9,    // Boots (script: slot 7 → pos 9)
  10: 10,  // Ring 1
  11: 11,  // Ring 2
  12: 12,  // Trinket 1
  13: 13,  // Trinket 2
  15: 14,  // Main Hand
  16: 15,  // Off Hand
  17: 16,  // Ranged / Relic
};

export const POSITION_LABELS: Record<number, string> = {
  0: "Head",
  1: "Neck",
  2: "Shoulders",
  3: "Cloak",
  4: "Chest",
  5: "Bracers",
  6: "Gloves",
  7: "Belt",
  8: "Legs",
  9: "Boots",
  10: "Ring 1",
  11: "Ring 2",
  12: "Trinket 1",
  13: "Trinket 2",
  14: "Main Hand",
  15: "Off Hand",
  16: "Ranged",
};

export const POSITION_ORDER = Object.keys(POSITION_LABELS)
  .map(Number)
  .sort((a, b) => a - b);

export async function fetchGearListing(
  input: FetchGearListingInput,
): Promise<GearListingResult> {
  const parsed = parseReportInput(input.reportPathOrId);
  const client = new WCLClient({ ...input.clientOptions, apiKey: input.apiKey });
  const endpoints = makeUrls({
    lang: "EN",
    apiKey: input.apiKey,
    logId: parsed.logId,
    mode: "all",
    noWipes: false,
  });

  const fightsRaw = await client.getJson<FightsResponse>(endpoints.fights);
  const bossFights = fightsRaw.fights.filter(
    (f) =>
      f.boss > 0 &&
      f.end_time > f.start_time &&
      (!input.onlyFightId || f.id === input.onlyFightId),
  );

  // Fetch per-boss casts in parallel — gear is in entries[].gear.
  const perFight = await Promise.all(
    bossFights.map(async (f) => {
      const url = endpoints.peopleTracked
        .replace(
          /&start=\d+&end=\d+/,
          `&start=${f.start_time}&end=${f.end_time}`,
        );
      const data = await client.getJson<TableResponse>(url);
      return { fight: f, data };
    }),
  );

  const fights: GearListingFight[] = perFight
    .map(({ fight, data }) => buildGearListingFight(fight, data))
    .filter((f) => f.players.length > 0);

  return {
    logId: parsed.logId,
    ...(fightsRaw.title ? { title: fightsRaw.title } : {}),
    fights,
  };
}

function buildGearListingFight(
  fight: Fight,
  data: TableResponse,
): GearListingFight {
  const players: GearPlayer[] = [];
  for (const entry of data.entries ?? []) {
    const rawGear = (entry as { gear?: unknown[] }).gear;
    if (!Array.isArray(rawGear) || rawGear.length === 0) continue;

    const gearByPosition = new Map<number, GearItem>();
    for (const raw of rawGear) {
      if (typeof raw !== "object" || raw === null) continue;
      const r = raw as Record<string, unknown>;
      const rid = r["id"];
      if (typeof rid !== "number" || rid === 0) continue;
      const slot = typeof r["slot"] === "number" ? r["slot"] : -1;
      const position = SLOT_TO_POSITION[slot];
      if (position == null) continue; // Shirt (3), Tabard (18) skipped
      const name = typeof r["name"] === "string" ? r["name"] : "";
      if (!name) continue;

      const item: GearItem = { id: rid, name, slot };
      if (typeof r["itemLevel"] === "number") item.itemLevel = r["itemLevel"];
      if (typeof r["permanentEnchantName"] === "string" && r["permanentEnchantName"])
        item.permanentEnchantName = r["permanentEnchantName"];
      if (Array.isArray(r["gems"]))
        item.gems = (r["gems"] as Record<string, unknown>[])
          .filter((g) => typeof g["id"] === "number")
          .map((g) => ({
            id: g["id"] as number,
            ...(typeof g["itemLevel"] === "number"
              ? { itemLevel: g["itemLevel"] as number }
              : {}),
          }));
      gearByPosition.set(position, item);
    }
    if (gearByPosition.size === 0) continue;

    players.push({
      id: entry.id,
      name: entry.name,
      type: entry.type,
      gearByPosition,
    });
  }

  return {
    fightId: fight.id,
    bossName: fight.name,
    killed: fight.kill === true,
    durationMs: fight.end_time - fight.start_time,
    players,
  };
}
