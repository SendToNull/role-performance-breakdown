// Snapshot format. A snapshot captures everything needed to render the
// matrix without re-running any WCL API calls:
//   - logId/faction/etc. for the summary cards
//   - list of players with their auto-assigned role
//   - ordered list of section/row items, each row carrying pre-computed cells
//
// Designed to be small enough for inline URL hashes (gzip + base64) when the
// raid is small, and to be hosted as a JSON file otherwise. The bot uploads
// a snapshot file and shares the URL.

import type { Faction, MetricCategory } from "../types/index.js";
import type { Role } from "./roles.js";

export const SNAPSHOT_VERSION = 1;

export interface SnapshotPlayer {
  id: number;
  name: string;
  /** Normalized class name (no spaces). */
  className: string;
  rawClassName: string;
  role: Role;
}

export interface SnapshotCell {
  /** Display string. Empty string means blank cell. */
  d: string;
  /** Numeric value, if applicable (for sorting / highlighting). */
  n?: number;
  /** Tooltip. */
  t?: string;
}

export type SnapshotItem =
  | {
      type: "s";
      id: string;
      label: string;
      cat: MetricCategory;
      /** Only render this section for columns of this class. */
      cls?: string;
    }
  | {
      type: "r";
      id: string;
      label: string;
      desc?: string;
      cat: MetricCategory;
      cls?: string;
      /** 1 = pending row (data not yet available). */
      pending?: 1;
      /** Cells parallel to MatrixSnapshot.players[]. Empty cells are "". */
      cells: Array<string | SnapshotCell>;
    };

export interface MatrixSnapshot {
  v: typeof SNAPSHOT_VERSION;
  /** ISO timestamp. */
  generatedAt: string;
  source: {
    logId: string;
    faction: Faction;
    fightCount: number;
    /** Original report URL, for display. */
    reportUrl?: string;
    /** Human-readable filter description, e.g. "bosses only · no wipes". */
    filtersDesc?: string;
  };
  players: SnapshotPlayer[];
  items: SnapshotItem[];
}

/**
 * Encode a snapshot to a compact URL-safe string. Uses CompressionStream
 * (built-in browser + Node 18+ global), base64url alphabet.
 */
export async function encodeSnapshot(s: MatrixSnapshot): Promise<string> {
  const json = JSON.stringify(s);
  const bytes = new TextEncoder().encode(json);
  const compressed = await gzipBytes(bytes);
  return base64urlEncode(compressed);
}

export async function decodeSnapshot(encoded: string): Promise<MatrixSnapshot> {
  const compressed = base64urlDecode(encoded);
  const bytes = await gunzipBytes(compressed);
  const json = new TextDecoder().decode(bytes);
  const parsed = JSON.parse(json) as MatrixSnapshot;
  if (parsed.v !== SNAPSHOT_VERSION) {
    throw new Error(
      `Snapshot version mismatch: got ${parsed.v}, expected ${SNAPSHOT_VERSION}`,
    );
  }
  return parsed;
}

async function gzipBytes(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Response(data).body!.pipeThrough(
    new CompressionStream("gzip"),
  );
  const buf = await new Response(stream).arrayBuffer();
  return new Uint8Array(buf);
}

async function gunzipBytes(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Response(data).body!.pipeThrough(
    new DecompressionStream("gzip"),
  );
  const buf = await new Response(stream).arrayBuffer();
  return new Uint8Array(buf);
}

function base64urlEncode(bytes: Uint8Array): string {
  // Avoid btoa with non-Latin-1 strings — go char by char.
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  // btoa is available in both browser and Node 16+.
  const b64 = typeof btoa === "function" ? btoa(bin) : Buffer.from(bin, "binary").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (s.length % 4)) % 4);
  const bin = typeof atob === "function" ? atob(b64) : Buffer.from(b64, "base64").toString("binary");
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
