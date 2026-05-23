import type { MetricCategory } from "../types/index.js";
import type { Role } from "../analysis/roles.js";

export interface MatrixPlayer {
  id: number;
  name: string;
  className: string; // normalized (no spaces)
  rawClassName: string; // as returned by WCL
  role: Role;
}

export interface CellValue {
  /** Display string, or null/undefined to render as blank. */
  display: string | null | undefined;
  /** Numeric value if applicable, used for highlighting/sorting later. */
  numeric?: number;
  /** Tooltip on hover. */
  tooltip?: string;
}

/** A single row in the matrix — one metric across all players. */
export interface MatrixRow {
  id: string;
  label: string;
  description?: string;
  category: MetricCategory;
  cell: (playerId: number) => CellValue;
  /** If set, only render for players of this class. */
  onlyForClass?: string;
  /** True if the data is not yet available (e.g. needs per-player fetch). */
  pending?: boolean;
}

export interface MatrixSection {
  id: string;
  label: string;
  category: MetricCategory;
  onlyForClass?: string;
}

export interface MatrixData {
  items: Array<
    | ({ kind: "section" } & MatrixSection)
    | ({ kind: "row" } & MatrixRow)
  >;
}
