// Role assignment for matrix grouping. Mirrors Helpers.gs:664-713 but with two
// changes:
//   1. Until the per-player fetcher lands, dpsCount/tankCount/healerCount are
//      not available, so we fall back to the most common raid spec per class.
//   2. Spec ambiguity (Druid-Tank vs Druid-Phys vs Druid-Heal) is resolved by
//      manual override in the UI rather than guessing badly.

export type Role = "Tank" | "Physical" | "Caster" | "Healer";

export const ROLES: readonly Role[] = ["Tank", "Physical", "Caster", "Healer"] as const;

export const ROLE_LABELS: Record<Role, string> = {
  Tank: "Tank",
  Physical: "Physical Damage",
  Caster: "Magical Damage",
  Healer: "Healer",
};

/** Sensible Classic TBC default if we have no per-player signal yet. */
export function defaultRoleForClass(playerClass: string): Role {
  switch (normalizeClass(playerClass)) {
    case "Druid":
      return "Physical"; // Feral DPS is most common; override for Resto/Bear.
    case "Hunter":
      return "Physical";
    case "Mage":
      return "Caster";
    case "Paladin":
      return "Healer"; // Holy is most common; override for Prot/Ret.
    case "Priest":
      return "Healer"; // Holy/Disc most common; override for Shadow.
    case "Rogue":
      return "Physical";
    case "Shaman":
      return "Caster"; // Elemental; override for Resto/Enhance.
    case "Warlock":
      return "Caster";
    case "Warrior":
      return "Physical"; // Fury/Arms is more common; override for Prot.
    default:
      return "Physical";
  }
}

export function normalizeClass(playerClass: string): string {
  return (playerClass ?? "").replace(/\s+/g, "");
}
