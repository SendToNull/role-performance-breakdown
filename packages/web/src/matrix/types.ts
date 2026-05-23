// Re-exports from @rpb/core so component code keeps a stable import path,
// plus web-only visual mappings.

import type { MetricCategory } from "@rpb/core";

export type {
  CellValue,
  MatrixData,
  MatrixPlayer,
  MatrixRow,
  MatrixSection,
  MetricCategory,
} from "@rpb/core";

export const CATEGORY_BG: Record<MetricCategory, string> = {
  deaths: "bg-red-950/20",
  damageTaken: "bg-rose-950/15",
  friendlyFire: "bg-pink-950/15",
  consumables: "bg-emerald-950/20",
  buffs: "bg-sky-950/20",
  debuffs: "bg-amber-950/20",
  casts: "bg-violet-950/20",
  interrupts: "bg-cyan-950/20",
  racials: "bg-zinc-800/40",
  healing: "bg-teal-950/20",
};
