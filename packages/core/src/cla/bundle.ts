// Wraps RPB + CLA results into a single snapshot envelope that the bot can
// upload as one JSON file and the web app can render as tabs.
//
// Why an envelope: the existing MatrixSnapshot only carries RPB data. Rather
// than bolt CLA fields onto it, we wrap both in a discriminated bundle so the
// web app can detect "this snapshot has CLA too" without touching MatrixSnapshot
// internals.

import type { MatrixSnapshot } from "../analysis/snapshot.js";
import type {
  ConsumableUse,
  ConsumablesResult,
  PlayerConsumables,
} from "./consumables.js";
import type {
  GearIssue,
  GearIssuesResult,
  PlayerGearIssues,
} from "./gearIssues.js";

export const BUNDLE_VERSION = 1;

/** JSON-clean form of PlayerConsumables (Map → entries array). */
export interface PlayerConsumablesJson {
  id: number;
  name: string;
  type: string;
  byCategory: Array<[string, ConsumableUse]>;
}

export interface ConsumablesPayload {
  logId: string;
  title?: string;
  totalBossTimeMs: number;
  players: PlayerConsumablesJson[];
}

export interface GearIssuesPayload {
  logId: string;
  title?: string;
  bossesScanned: number;
  players: Array<{
    id: number;
    name: string;
    type: string;
    issues: GearIssue[];
  }>;
}

export interface ClaPayload {
  gearIssues: GearIssuesPayload;
  consumables: ConsumablesPayload;
}

/**
 * Bundle envelope. `rpb` and `cla` are independently optional so /rpb, /cla,
 * and /full all produce the same shape — the web app just reads which keys
 * are present.
 */
export interface BundleSnapshot {
  v: typeof BUNDLE_VERSION;
  generatedAt: string;
  source: {
    logId: string;
    /** Original report URL, for display. */
    reportUrl?: string;
    /** Human-readable filter description. */
    filtersDesc?: string;
  };
  rpb?: MatrixSnapshot;
  cla?: ClaPayload;
}

export function serializeGearIssues(r: GearIssuesResult): GearIssuesPayload {
  return {
    logId: r.logId,
    ...(r.title !== undefined ? { title: r.title } : {}),
    bossesScanned: r.bossesScanned,
    players: r.players.map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      issues: p.issues,
    })),
  };
}

export function serializeConsumables(r: ConsumablesResult): ConsumablesPayload {
  return {
    logId: r.logId,
    ...(r.title !== undefined ? { title: r.title } : {}),
    totalBossTimeMs: r.totalBossTimeMs,
    players: r.players.map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      byCategory: [...p.byCategory.entries()],
    })),
  };
}

export function deserializeGearIssues(p: GearIssuesPayload): GearIssuesResult {
  return {
    logId: p.logId,
    ...(p.title !== undefined ? { title: p.title } : {}),
    bossesScanned: p.bossesScanned,
    players: p.players.map<PlayerGearIssues>((pl) => ({
      id: pl.id,
      name: pl.name,
      type: pl.type,
      issues: pl.issues,
    })),
  };
}

export function deserializeConsumables(p: ConsumablesPayload): ConsumablesResult {
  return {
    logId: p.logId,
    ...(p.title !== undefined ? { title: p.title } : {}),
    totalBossTimeMs: p.totalBossTimeMs,
    players: p.players.map<PlayerConsumables>((pl) => ({
      id: pl.id,
      name: pl.name,
      type: pl.type,
      byCategory: new Map<string, ConsumableUse>(pl.byCategory),
    })),
  };
}

/**
 * Loose check: a JSON blob is a bundle if it has the `v` field at the bundle
 * version and either rpb or cla payloads. Otherwise it's a legacy
 * MatrixSnapshot (which uses `v: SNAPSHOT_VERSION` too but has top-level
 * `items`/`players`).
 */
export function isBundleSnapshot(x: unknown): x is BundleSnapshot {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  if (o["v"] !== BUNDLE_VERSION) return false;
  // Bundle has source.logId but no top-level items array (which MatrixSnapshot has).
  if (Array.isArray(o["items"])) return false;
  return "rpb" in o || "cla" in o;
}
