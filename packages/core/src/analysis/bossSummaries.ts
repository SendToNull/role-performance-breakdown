// Per-boss /report/tables/summary fetch + role aggregation.
//
// The summary endpoint returns:
//   {
//     totalTime, itemLevel,
//     composition: [{ id, name, type, specs: [{ spec, role }] }],
//     playerDetails: { tanks: [...], dps: [...], healers: [...] }
//   }
//
// We aggregate `composition[*].specs[*].role` across all boss fights to figure
// out each player's dominant role (mirrors RPB.gs:1966-1978). dpsSpec is kept
// for the Druid-Balance / Shaman-Elemental → "Caster" split.

import type { Fight, TableResponse } from "../types/index.js";
import { WCLClient } from "../wcl/client.js";
import type { RPBEndpoints } from "../wcl/endpoints.js";
import {
  defaultRoleForClass,
  normalizeClass,
  type Role,
} from "./roles.js";

export interface BossSummaryComposition {
  id: number;
  name: string;
  type: string;
  specs: Array<{ spec?: string; role?: "healer" | "dps" | "tank" }>;
}

export interface BossSummary {
  totalTime?: number;
  composition?: BossSummaryComposition[];
  playerDetails?: {
    dps?: Array<{ id?: number; name: string; combatantInfo?: unknown }>;
    healers?: Array<{ id?: number; name: string; combatantInfo?: unknown }>;
    tanks?: Array<{ id?: number; name: string; combatantInfo?: unknown }>;
  };
}

export interface PlayerRoleCounts {
  dps: number;
  tank: number;
  healer: number;
  /** Most frequent dps spec (e.g. "Balance", "Elemental"). */
  dpsSpec?: string;
}

export async function fetchBossSummaries(
  client: WCLClient,
  endpoints: RPBEndpoints,
  fights: Fight[],
): Promise<BossSummary[]> {
  const bossFights = fights.filter(
    (f) => f.boss > 0 && f.end_time > f.start_time,
  );
  if (bossFights.length === 0) return [];

  // urlSummary already has start/end placeholders; rebuild per-fight ranges.
  // The endpoint URL contains "&start=0&end=999999999999&filter=encounterid..."
  // — we replace the &start=...&end=... portion. Also strip &encounter=0.
  return Promise.all(
    bossFights.map((f) => {
      const url = endpoints.summary
        .replace(
          /&start=\d+&end=\d+/,
          `&start=${f.start_time}&end=${f.end_time}`,
        )
        .replace("&encounter=0", "");
      return client.getJson<BossSummary>(url);
    }),
  );
}

/**
 * Aggregate role counts per player across all boss summaries. Returns a Map
 * keyed by playerId.
 */
export function aggregateRoleCounts(
  summaries: BossSummary[],
): Map<number, PlayerRoleCounts> {
  const out = new Map<number, PlayerRoleCounts>();
  for (const summary of summaries) {
    for (const member of summary.composition ?? []) {
      const counts = out.get(member.id) ?? { dps: 0, tank: 0, healer: 0 };
      for (const s of member.specs ?? []) {
        if (s.role === "dps") {
          counts.dps++;
          if (s.spec) counts.dpsSpec = s.spec;
        } else if (s.role === "tank") {
          counts.tank++;
        } else if (s.role === "healer") {
          counts.healer++;
        }
      }
      out.set(member.id, counts);
    }
  }
  return out;
}

/**
 * Mirrors Helpers.gs:664-713: pick a Role using the role counts and (for
 * ambiguous classes) the dpsSpec.
 */
export function inferRole(
  playerClass: string,
  counts: PlayerRoleCounts | undefined,
): Role {
  if (!counts || counts.dps + counts.tank + counts.healer === 0) {
    return defaultRoleForClass(playerClass);
  }
  const cls = normalizeClass(playerClass);
  const { dps, tank, healer, dpsSpec } = counts;

  const dominant: "dps" | "tank" | "healer" =
    healer >= tank && healer >= dps
      ? "healer"
      : tank >= dps && tank >= healer
        ? "tank"
        : "dps";

  switch (cls) {
    case "Druid":
      if (dominant === "healer") return "Healer";
      if (dominant === "tank") return "Tank";
      return dpsSpec === "Balance" ? "Caster" : "Physical";
    case "Hunter":
      return "Physical";
    case "Mage":
      return "Caster";
    case "Paladin":
      if (dominant === "healer") return "Healer";
      if (dominant === "tank") return "Tank";
      return "Physical";
    case "Priest":
      return dominant === "dps" ? "Caster" : "Healer";
    case "Rogue":
      return "Physical";
    case "Shaman":
      if (dominant === "healer") return "Healer";
      if (dominant === "tank") return "Tank";
      return dpsSpec === "Elemental" ? "Caster" : "Physical";
    case "Warlock":
      return "Caster";
    case "Warrior":
      return dominant === "dps" ? "Physical" : "Tank";
    default:
      return defaultRoleForClass(playerClass);
  }
}

// Tiny re-export for consumers that don't want to depend directly on the
// summary types but still want the response shape.
export type { TableResponse };
