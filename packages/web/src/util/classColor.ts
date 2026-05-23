// Class-color mapping used for player chips. WCL returns the class name in the
// `type` field of table entries (e.g. "Warrior", "Druid", "DeathKnight").

const CLASS_COLORS: Record<string, string> = {
  DeathKnight: "#C41E3A",
  Druid: "#FF7C0A",
  Hunter: "#AAD372",
  Mage: "#3FC7EB",
  Paladin: "#F48CBA",
  Priest: "#FFFFFF",
  Rogue: "#FFF468",
  Shaman: "#0070DD",
  Warlock: "#8788EE",
  Warrior: "#C69B6D",
};

export function classColor(className: string | undefined): string {
  if (!className) return "#9CA3AF"; // zinc-400 fallback
  return CLASS_COLORS[className] ?? "#9CA3AF";
}

export function normalizeClassName(raw: string | undefined): string {
  if (!raw) return "Unknown";
  // Some endpoints return "Death Knight", some "DeathKnight".
  return raw.replace(/\s+/g, "");
}

/** rgba() string for a class color. alpha in [0,1]. */
export function classColorRgba(className: string | undefined, alpha: number): string {
  const hex = classColor(normalizeClassName(className));
  const m = hex.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return `rgba(156,163,175,${alpha})`;
  const r = parseInt(m[1]!, 16);
  const g = parseInt(m[2]!, 16);
  const b = parseInt(m[3]!, 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
