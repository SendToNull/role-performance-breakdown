// Display metadata for matrix sections. Maps the raw section id from
// trackedMetrics.ts to a human label, a category (drives row background color),
// and the data source — i.e. whether the row is computable from current global
// tables or needs the per-player fetcher.

import type { MetricCategory } from "../types/index.js";

export interface SectionMeta {
  /** Display label for the section divider. */
  label: string;
  /** Color category. */
  category: MetricCategory;
  /** Data origin. */
  source: "global" | "perPlayer";
  /** If perClass, the section is only relevant to columns of this class. */
  perClass?: string;
}

export const SECTION_META: Record<string, SectionMeta> = {
  damageTaken: {
    label: "Damage taken from tracked abilities",
    category: "damageTaken",
    // The script queries /report/tables/damage-taken with &sourceid=<player>
    // per player (RPB.gs:937). The global damageTakenTop endpoint only gives
    // top abilities, not per-player breakdown. So this section is pending the
    // per-player fetcher.
    source: "perPlayer",
  },
  debuffs: {
    label: "Avoidable debuffs taken",
    category: "debuffs",
    source: "global", // computable from /report/tables/debuffs
  },
  statsAndMisc: {
    label: "Stats & misc",
    category: "casts",
    source: "perPlayer", // most need per-player buff/cast detail
  },
  trinketsAndRacials: {
    label: "Trinkets & racials used",
    category: "racials",
    source: "perPlayer",
  },
  engineering: {
    label: "Engineering items used",
    category: "consumables",
    source: "perPlayer",
  },
  otherCasts: {
    label: "Drums, potions, consumables",
    category: "consumables",
    source: "perPlayer",
  },
  absorbs: {
    label: "Absorbs",
    category: "healing",
    source: "perPlayer",
  },
};

const CLASS_SECTION_CATS: Record<string, MetricCategory> = {
  singleTargetCasts: "casts",
  aoeCasts: "casts",
  classCooldowns: "buffs",
};

const CLASS_SECTION_LABELS: Record<string, string> = {
  singleTargetCasts: "Single-target casts",
  aoeCasts: "AoE casts",
  classCooldowns: "Class cooldowns & buffs",
};

export function sectionMeta(sectionId: string): SectionMeta {
  // Per-class sections are formatted as "<Class>:<subkind>".
  if (sectionId.includes(":")) {
    const [cls, sub] = sectionId.split(":");
    return {
      label: `${cls} — ${CLASS_SECTION_LABELS[sub!] ?? sub!}`,
      category: CLASS_SECTION_CATS[sub!] ?? "casts",
      source: "perPlayer",
      perClass: cls!,
    };
  }
  return (
    SECTION_META[sectionId] ?? {
      label: sectionId,
      category: "casts",
      source: "perPlayer",
    }
  );
}
