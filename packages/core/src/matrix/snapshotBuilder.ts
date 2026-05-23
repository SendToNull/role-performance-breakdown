// Build a MatrixSnapshot from the live MatrixData + player roster.

import type { RunReportResult } from "../analysis/runReport.js";
import {
  SNAPSHOT_VERSION,
  type MatrixSnapshot,
  type SnapshotItem,
} from "../analysis/snapshot.js";
import type { MatrixData, MatrixPlayer } from "./types.js";

export function buildSnapshot(
  result: RunReportResult,
  data: MatrixData,
  players: MatrixPlayer[],
  opts: { reportUrl?: string; filtersDesc?: string } = {},
): MatrixSnapshot {
  const items: SnapshotItem[] = [];
  for (const it of data.items) {
    if (it.kind === "section") {
      const obj: SnapshotItem = {
        type: "s",
        id: it.id,
        label: it.label,
        cat: it.category,
      };
      if (it.onlyForClass) obj.cls = it.onlyForClass;
      items.push(obj);
    } else {
      const cells: SnapshotItem extends infer X
        ? X extends { type: "r"; cells: infer C }
          ? C
          : never
        : never = [];
      for (const p of players) {
        const v = it.cell(p.id);
        if (!v.display) {
          cells.push("");
        } else if (v.numeric != null || v.tooltip) {
          const cell: { d: string; n?: number; t?: string } = { d: v.display };
          if (v.numeric != null) cell.n = v.numeric;
          if (v.tooltip) cell.t = v.tooltip;
          cells.push(cell);
        } else {
          cells.push(v.display);
        }
      }
      const row: SnapshotItem = {
        type: "r",
        id: it.id,
        label: it.label,
        cat: it.category,
        cells,
      };
      if (it.description) row.desc = it.description;
      if (it.onlyForClass) row.cls = it.onlyForClass;
      if (it.pending) row.pending = 1;
      items.push(row);
    }
  }

  return {
    v: SNAPSHOT_VERSION,
    generatedAt: new Date().toISOString(),
    source: {
      logId: result.logId,
      faction: result.faction,
      fightCount: result.fights.length,
      ...(opts.reportUrl ? { reportUrl: opts.reportUrl } : {}),
      ...(opts.filtersDesc ? { filtersDesc: opts.filtersDesc } : {}),
    },
    players: players.map((p) => ({
      id: p.id,
      name: p.name,
      className: p.className,
      rawClassName: p.rawClassName,
      role: p.role,
    })),
    items,
  };
}

/**
 * Convert a snapshot back into the MatrixData shape that MatrixView consumes,
 * with cell functions that return the cached values.
 */
export function snapshotToMatrixData(s: MatrixSnapshot): MatrixData {
  const items: MatrixData["items"] = [];
  for (const it of s.items) {
    if (it.type === "s") {
      items.push({
        kind: "section",
        id: it.id,
        label: it.label,
        category: it.cat,
        ...(it.cls ? { onlyForClass: it.cls } : {}),
      });
    } else {
      // Map player id → cell value via parallel index in s.players.
      const byPlayerId = new Map<number, { display: string; numeric?: number; tooltip?: string }>();
      for (let i = 0; i < s.players.length; i++) {
        const player = s.players[i]!;
        const cell = it.cells[i];
        if (cell == null || cell === "") {
          byPlayerId.set(player.id, { display: "" });
        } else if (typeof cell === "string") {
          byPlayerId.set(player.id, { display: cell });
        } else {
          const obj: { display: string; numeric?: number; tooltip?: string } = {
            display: cell.d,
          };
          if (cell.n != null) obj.numeric = cell.n;
          if (cell.t != null) obj.tooltip = cell.t;
          byPlayerId.set(player.id, obj);
        }
      }
      items.push({
        kind: "row",
        id: it.id,
        label: it.label,
        category: it.cat,
        cell: (id) => byPlayerId.get(id) ?? { display: "" },
        ...(it.desc ? { description: it.desc } : {}),
        ...(it.cls ? { onlyForClass: it.cls } : {}),
        ...(it.pending ? { pending: true as const } : {}),
      });
    }
  }
  return { items };
}
