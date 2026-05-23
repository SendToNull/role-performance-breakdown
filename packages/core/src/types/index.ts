// WCL v1 response shapes (only the fields RPB actually reads).
// Keep these minimal and extend as more analysis modules are ported.

export type Faction = "Horde" | "Alliance";

export type Lang = "EN" | "DE" | "CN" | "RU" | "FR";

export type FilterMode = "all" | "onlyBosses" | "onlyTrash";

export interface ReportFilters {
  mode: FilterMode;
  noWipes: boolean;
  /** Specific fight id, or "last", or null for none. */
  onlyFightId: string | "last" | null;
  /** "<start>-<end>" raw ms, or null. Mutually exclusive with onlyFightId. */
  manualStartEnd: string | null;
  /** Comma-separated character whitelist, or null for all. */
  characterNames: string | null;
}

export interface Fight {
  id: number;
  name: string;
  /** 0 = trash, >0 = boss encounter id. */
  boss: number;
  start_time: number;
  end_time: number;
  kill?: boolean;
}

export interface FightsResponse {
  fights: Fight[];
  enemies?: Array<{ id: number; name: string; guid: number; type: string }>;
  friendlies?: Array<{
    id: number;
    name: string;
    guid: number;
    type: string;
    server?: string;
  }>;
  zone?: number;
  title?: string;
  start?: number;
  end?: number;
}

export interface TableEntry {
  name: string;
  id: number;
  guid?: number;
  type: string;
  total: number;
  icon?: string;
  /** Most tables include this; some don't. */
  itemLevel?: number;
  /** Extra fields keyed by endpoint (uses, hitCount, casts, etc.) tolerated. */
  [extra: string]: unknown;
}

export interface TableResponse {
  entries: TableEntry[];
  totalTime?: number;
  itemLevel?: number;
}

export interface Aura {
  guid: number;
  name: string;
  totalUptime: number;
  totalUses: number;
  bands?: Array<{ startTime: number; endTime: number }>;
}

export interface AurasResponse {
  auras: Aura[];
  totalTime: number;
}

export type RawJSON = Record<string, unknown>;

/** Visual category for a matrix row — drives the row background color. */
export type MetricCategory =
  | "deaths"
  | "damageTaken"
  | "friendlyFire"
  | "consumables"
  | "buffs"
  | "debuffs"
  | "casts"
  | "interrupts"
  | "racials"
  | "healing";
