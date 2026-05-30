// Combat Log Analytics — Gear Issues.
// Ports the gear-checking logic from GearIssues.gs verbatim.
//
// The source script defines 22 distinct issue markers across enchants, gems,
// boss-context items, and class-vs-stat mismatches. All are ported here.
//
// Unported: the `sockets` reference table that GearIssues.gs loads from the
// active spreadsheet (item ID → socket count). Without it we can't reliably
// flag "no gem" for raid items, so that check is omitted until the table
// can be supplied.

import type {
  Fight,
  FightsResponse,
  TableResponse,
} from "../types/index.js";
import { WCLClient } from "../wcl/client.js";
import { makeUrls } from "../wcl/endpoints.js";
import { parseReportInput } from "../wcl/parseReportInput.js";
import { BAD_ENCHANTS, SUBOPTIMAL_ITEM_IDS } from "./gearIssueData.js";
import {
  BLUE_GEMS,
  META_GEMS,
  RED_GEMS,
  YELLOW_GEMS,
} from "./gemColors.js";
import {
  CONSECRATED_TEMP_ENCHANTS,
  CONSECRATED_WEAPON_ITEMS,
  ENGINEERING_GEAR_ITEMS,
  IGNORE_ITEM_IDS,
  ILLIDARI_COUNCIL_SUFFIX,
  MELEE_HIT_GEMS,
  MELEE_HIT_TEMP_ENCHANTS,
  MOTHER_SHAHRAZ_SUFFIX,
  PVP_GEAR_ITEMS,
  PVP_GEAR_OK_BOSS_SUFFIXES,
  RESISTANCE_GEAR_ITEMS,
  RESISTANCE_GEAR_OK_BOSS_FOR_CASTER,
  RESISTANCE_GEAR_OK_BOSS_SUFFIXES,
  RIDING_GEAR_ITEMS,
  SLOWFALL_GEAR_ITEMS,
  SPELL_HIT_GEMS,
  SPELL_HIT_TEMP_ENCHANTS,
  SPELL_PEN_CLOAK_ENCHANT,
  UNCOMMON_GEM_EXCLUSIONS,
  UNCUT_GEMS,
  UNDEAD_BOSS_SUFFIXES,
  UNDEAD_OR_DEMON_BOSS_SUFFIXES,
  WEAPON_40SP_ENCHANT,
  WIZARD_OIL_DEMON_ITEMS,
  WIZARD_OIL_DEMON_TEMP_ENCHANTS,
} from "./gearIssueRules.js";

export type IssueKind =
  | "missing"                // no item in this slot
  | "noEnchant"              // no permanent enchant
  | "badEnchant"             // suboptimal permanent enchant
  | "suboptimalItem"         // item id is on the curated suboptimal list
  | "spellHitOnMelee"        // spell-hit gear on physical class
  | "meleeHitOnCaster"       // melee-hit gear on caster class
  | "uncutGem"               // raw / uncut gem
  | "vsNonUndead"            // undead-only weapon/enchant on non-undead boss
  | "vsNonUndeadNonDemon"    // undead-or-demon-only on neither
  | "wrongSRgear"            // resistance gear outside the resist-required fight
  | "wrongPvPgear"           // PvP gear in PvE raid
  | "uselessRidingGear"      // mount-speed item slotted in raid
  | "uselessSlowfallGear"    // slowfall ring/cloak in raid
  | "uselessEngiGear"        // niche engi item with <50% raid usage
  | "noGem"                  // socket without a gem (currently disabled)
  | "commonGem"              // gem itemLevel < 60
  | "uncommonGem"            // gem itemLevel == 60
  | "metaGemInactive";

export const ISSUE_COLORS: Record<IssueKind, string> = {
  missing: "#ff0707",
  noEnchant: "#f8aaaa",
  badEnchant: "#fdf2ce",
  suboptimalItem: "#b9a3ee",
  spellHitOnMelee: "#b9a3ee",
  meleeHitOnCaster: "#b9a3ee",
  uncutGem: "#b9a3ee",
  vsNonUndead: "#b9a3ee",
  vsNonUndeadNonDemon: "#b9a3ee",
  wrongSRgear: "#b9a3ee",
  wrongPvPgear: "#b9a3ee",
  uselessRidingGear: "#b9a3ee",
  uselessSlowfallGear: "#b9a3ee",
  uselessEngiGear: "#b9a3ee",
  noGem: "#f7cfe1",
  commonGem: "#b7b7b7",
  uncommonGem: "#bfeeae",
  metaGemInactive: "#f9cb9c",
};

export const ISSUE_LABELS: Record<IssueKind, string> = {
  missing: "no item",
  noEnchant: "no enchant",
  badEnchant: "bad enchant",
  suboptimalItem: "suboptimal item",
  spellHitOnMelee: "spell-hit on melee",
  meleeHitOnCaster: "melee-hit on caster",
  uncutGem: "uncut gem",
  vsNonUndead: "undead-only on non-undead",
  vsNonUndeadNonDemon: "undead/demon-only on neither",
  wrongSRgear: "resistance gear",
  wrongPvPgear: "PvP gear",
  uselessRidingGear: "riding gear",
  uselessSlowfallGear: "slowfall gear",
  uselessEngiGear: "engi gear",
  noGem: "no gem",
  commonGem: "common gem",
  uncommonGem: "uncommon gem",
  metaGemInactive: "meta gem inactive",
};

// Build a lookup from enchant id → list of bad-enchant entries. Each entry
// may be slot-specific or apply to any slot (slot === null).
const BAD_ENCHANT_BY_ID = (() => {
  const m = new Map<number, Array<{ slot: number | null; name: string }>>();
  for (const e of BAD_ENCHANTS) {
    const arr = m.get(e.id) ?? [];
    arr.push({ slot: e.slot, name: e.name });
    m.set(e.id, arr);
  }
  return m;
})();

function lookupBadEnchant(enchantId: number, slot: number): string | null {
  const candidates = BAD_ENCHANT_BY_ID.get(enchantId);
  if (!candidates) return null;
  let global: string | null = null;
  for (const c of candidates) {
    if (c.slot === slot) return c.name;
    if (c.slot === null) global = c.name;
  }
  return global;
}

/**
 * Meta-gem activation rules (GearIssues.gs:340-364). Counts include overlap
 * (orange = red+yellow, green = yellow+blue, purple = red+blue).
 */
function isMetaGemActive(
  metaGemId: number,
  redCount: number,
  yellowCount: number,
  blueCount: number,
): boolean {
  switch (metaGemId) {
    case 25896: return blueCount > 2;
    case 25897: return redCount > blueCount;
    case 32409:
    case 25899:
    case 25901:
    case 25890:
    case 32410: return redCount > 1 && blueCount > 1 && yellowCount > 1;
    case 25898: return blueCount > 4;
    case 25893:
    case 32640: return blueCount > yellowCount;
    case 34220: return blueCount > 1;
    case 25895: return redCount > yellowCount;
    case 25894:
    case 28556:
    case 28557: return redCount > 0 && yellowCount > 1;
    case 32641: return yellowCount > 2;
    case 35503: return redCount > 2;
    case 35501: return blueCount > 1 && yellowCount > 0;
    default: return true; // unknown meta gem — don't false-flag
  }
}

const PHYSICAL_DPS_CLASSES = new Set(["Hunter", "Rogue", "Warrior"]);
const CASTER_DPS_CLASSES = new Set(["Mage", "Priest", "Warlock"]);

export interface GearIssue {
  kind: IssueKind;
  itemId: number;
  itemName: string;
  /** Raw WCL slot id 0-18. */
  slot: number;
  /** Slot display name (Head, Neck, ...). */
  slotName: string;
  /** Fights where this issue was seen. */
  seenOnBosses: string[];
}

export interface PlayerGearIssues {
  id: number;
  name: string;
  type: string;
  issues: GearIssue[];
}

export interface GearIssuesResult {
  logId: string;
  title?: string;
  bossesScanned: number;
  players: PlayerGearIssues[];
}

export interface FetchGearIssuesInput {
  reportPathOrId: string;
  apiKey: string;
  /** Additional item ids to whitelist (user-curated). */
  ignoreItemIds?: number[];
  /** If true, suppress noEnchant/badEnchant issues seen ONLY on Mother Shahraz. */
  excludeMotherShahraz?: boolean;
  clientOptions?: Omit<
    ConstructorParameters<typeof WCLClient>[0],
    "apiKey"
  >;
}

const SLOT_LABELS: Record<number, string> = {
  0: "Head",
  1: "Neck",
  2: "Shoulders",
  3: "Shirt",
  4: "Chest",
  5: "Belt",
  6: "Legs",
  7: "Boots",
  8: "Bracers",
  9: "Gloves",
  10: "Ring 1",
  11: "Ring 2",
  12: "Trinket 1",
  13: "Trinket 2",
  14: "Cloak",
  15: "Main Hand",
  16: "Off Hand",
  17: "Ranged",
  18: "Tabard",
};

/**
 * Slots that should be enchanted on a raiding character. Source line 689 also
 * has a special-case for slot 16 (off-hand): skip if icon contains "_misc_"
 * (i.e. paladin libram, shaman totem, etc. — non-shield off-hands).
 */
const ENCHANTABLE_SLOTS = new Set([0, 2, 4, 6, 7, 8, 9, 14, 15, 16]);

const REQUIRED_SLOTS = [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

/** Source line 439 skips shirt (3) and off-hand (16) for missing-item flags. */
const MISSING_SKIP_SLOTS = new Set([3, 16]);

function endsWithAny(s: string, suffixes: readonly string[]): boolean {
  for (const sfx of suffixes) if (s.endsWith(sfx)) return true;
  return false;
}

export async function fetchGearIssues(
  input: FetchGearIssuesInput,
): Promise<GearIssuesResult> {
  const parsed = parseReportInput(input.reportPathOrId);
  const client = new WCLClient({
    ...input.clientOptions,
    apiKey: input.apiKey,
  });
  const endpoints = makeUrls({
    lang: "EN",
    apiKey: input.apiKey,
    logId: parsed.logId,
    mode: "all",
    noWipes: false,
  });

  const fightsRaw = await client.getJson<FightsResponse>(endpoints.fights);
  const bossFights = fightsRaw.fights.filter(
    (f) => f.boss > 0 && f.end_time > f.start_time,
  );
  if (bossFights.length === 0) {
    return {
      logId: parsed.logId,
      ...(fightsRaw.title ? { title: fightsRaw.title } : {}),
      bossesScanned: 0,
      players: [],
    };
  }

  const userIgnoreIds = new Set(input.ignoreItemIds ?? []);
  const excludeMotherShahraz = input.excludeMotherShahraz === true;

  // Per-boss casts gives us each player's gear at that fight.
  const perFight = await Promise.all(
    bossFights.map(async (f) => {
      const url = endpoints.peopleTracked.replace(
        /&start=\d+&end=\d+/,
        `&start=${f.start_time}&end=${f.end_time}`,
      );
      const data = await client.getJson<TableResponse>(url);
      return { fight: f, data };
    }),
  );

  // For "useless engineering / SR gear" flags, source needs to know what
  // fraction of raiders had a given item per boss (only flag if <50% wore it).
  // Pre-compute per-boss item-usage so we can answer that quickly.
  type Usage = {
    /** Total players who had any gear array. */
    totalPlayers: number;
    /** itemId → count of players wearing it on this boss. */
    counts: Map<number, number>;
  };
  const usageByFightId = new Map<number, Usage>();
  for (const { fight, data } of perFight) {
    const u: Usage = { totalPlayers: 0, counts: new Map() };
    for (const entry of data.entries ?? []) {
      const rawGear = (entry as { gear?: unknown[] }).gear;
      if (!Array.isArray(rawGear) || rawGear.length === 0) continue;
      u.totalPlayers++;
      for (const raw of rawGear) {
        if (typeof raw !== "object" || raw === null) continue;
        const id = (raw as Record<string, unknown>)["id"];
        if (typeof id === "number" && id > 0) {
          u.counts.set(id, (u.counts.get(id) ?? 0) + 1);
        }
      }
    }
    usageByFightId.set(fight.id, u);
  }

  /** Returns true if <50% of raiders on this boss had the item. */
  function isMinorityOnBoss(fightId: number, itemId: number): boolean {
    const u = usageByFightId.get(fightId);
    if (!u || u.totalPlayers === 0) return false;
    const wearing = u.counts.get(itemId) ?? 0;
    return (wearing * 100) / u.totalPlayers < 50;
  }

  type Agg = {
    name: string;
    type: string;
    issuesByKey: Map<string, GearIssue>;
    /** Tracks bosses where noEnchant/badEnchant was suppressed pending the
     *  Mother-Shahraz-only check. itemId → {motherSeen, elsewhereSeen}. */
    enchantBossFlags: Map<number, { onMother: boolean; elsewhere: boolean; spellPenOnIC: boolean; spellPenElsewhere: boolean }>;
    /** Deferred noEnchant/badEnchant issues, evaluated after walking all fights. */
    deferredEnchant: Map<number, { kind: "noEnchant" | "badEnchant"; itemId: number; itemName: string; slot: number; slotName: string; bosses: string[] }>;
  };
  const playersById = new Map<number, Agg>();

  for (const { fight, data } of perFight) {
    const bossSuffix = String(fight.boss);
    for (const entry of data.entries ?? []) {
      const rawGear = (entry as { gear?: unknown[] }).gear;
      if (!Array.isArray(rawGear)) continue;
      // RPB noise filter: skip players with table.total < 20 on this fight.
      if (typeof entry.total === "number" && entry.total < 20) continue;

      const agg: Agg =
        playersById.get(entry.id) ??
        ({
          name: entry.name,
          type: entry.type,
          issuesByKey: new Map<string, GearIssue>(),
          enchantBossFlags: new Map(),
          deferredEnchant: new Map(),
        });

      const playerType = agg.type;
      const isPhysical = PHYSICAL_DPS_CLASSES.has(playerType);
      const isCaster = CASTER_DPS_CLASSES.has(playerType);

      const slotsSeen = new Set<number>();

      // ---- Pass 1: count red/yellow/blue gems for meta-gem activation ----
      let redCount = 0, yellowCount = 0, blueCount = 0;
      type FoundMeta = { gemId: number; itemId: number; itemName: string; slot: number };
      const foundMetas: FoundMeta[] = [];
      for (const raw of rawGear) {
        if (typeof raw !== "object" || raw === null) continue;
        const r = raw as Record<string, unknown>;
        const itemId = typeof r["id"] === "number" ? r["id"] : 0;
        if (!itemId) continue;
        const slot = typeof r["slot"] === "number" ? r["slot"] : -1;
        const name = typeof r["name"] === "string" ? r["name"] : "(unknown)";
        const gems = Array.isArray(r["gems"])
          ? (r["gems"] as Array<Record<string, unknown>>)
          : [];
        for (const g of gems) {
          const gid = typeof g["id"] === "number" ? g["id"] : 0;
          if (!gid) continue;
          if (META_GEMS.has(gid)) {
            foundMetas.push({ gemId: gid, itemId, itemName: name, slot });
            continue;
          }
          if (RED_GEMS.has(gid)) redCount++;
          if (YELLOW_GEMS.has(gid)) yellowCount++;
          if (BLUE_GEMS.has(gid)) blueCount++;
        }
      }

      // ---- Pass 2: per-item checks ----
      for (const raw of rawGear) {
        if (typeof raw !== "object" || raw === null) continue;
        const r = raw as Record<string, unknown>;
        const itemId = typeof r["id"] === "number" ? r["id"] : 0;
        if (!itemId) continue;
        if (userIgnoreIds.has(itemId)) continue;
        const slot = typeof r["slot"] === "number" ? r["slot"] : -1;
        if (slot < 0) continue;
        const name = typeof r["name"] === "string" ? r["name"] : "(unknown)";
        const icon = typeof r["icon"] === "string" ? r["icon"] : "";
        const tempEnchant = typeof r["temporaryEnchant"] === "number"
          ? r["temporaryEnchant"]
          : typeof r["temporaryEnchant"] === "string"
            ? Number(r["temporaryEnchant"])
            : 0;
        slotsSeen.add(slot);

        const slotName = SLOT_LABELS[slot] ?? `slot ${slot}`;
        const mk = (kind: IssueKind, itemName = name): GearIssue => ({
          kind,
          itemId,
          itemName,
          slot,
          slotName,
          seenOnBosses: [],
        });

        // -- Class-vs-stat temp enchant (GearIssues.gs:382-395) --
        if (tempEnchant > 0) {
          if (isPhysical && SPELL_HIT_TEMP_ENCHANTS.has(tempEnchant)) {
            mergeIssue(agg, fight, mk("spellHitOnMelee"));
          }
          if (isCaster && MELEE_HIT_TEMP_ENCHANTS.has(tempEnchant)) {
            mergeIssue(agg, fight, mk("meleeHitOnCaster"));
          }
        }

        // -- Gem-level checks: wrong-class gems, uncut, common/uncommon
        //    (GearIssues.gs:397-422 + 753-769) --
        const gems = Array.isArray(r["gems"])
          ? (r["gems"] as Array<Record<string, unknown>>)
          : [];
        for (const g of gems) {
          const gid = typeof g["id"] === "number" ? g["id"] : 0;
          const ilvl = typeof g["itemLevel"] === "number" ? g["itemLevel"] : 0;
          if (!gid) continue;
          if (META_GEMS.has(gid)) continue; // handled separately

          if (isPhysical && SPELL_HIT_GEMS.has(gid)) {
            mergeIssue(agg, fight, mk("spellHitOnMelee"));
          }
          if (isCaster && MELEE_HIT_GEMS.has(gid)) {
            mergeIssue(agg, fight, mk("meleeHitOnCaster"));
          }
          if (UNCUT_GEMS.has(gid)) {
            mergeIssue(agg, fight, mk("uncutGem"));
          }

          if (ilvl > 0) {
            if (ilvl < 60) {
              mergeIssue(agg, fight, mk("commonGem"));
            } else if (ilvl === 60 && !UNCOMMON_GEM_EXCLUSIONS.has(gid)) {
              mergeIssue(agg, fight, mk("uncommonGem"));
            }
          }
        }

        // -- Boss-context: undead-only weapon/enchant on non-undead boss --
        // (GearIssues.gs:497-523)
        const isUndeadBoss = endsWithAny(bossSuffix, UNDEAD_BOSS_SUFFIXES);
        if (
          !isUndeadBoss &&
          (CONSECRATED_WEAPON_ITEMS.has(itemId) ||
            (tempEnchant > 0 && CONSECRATED_TEMP_ENCHANTS.has(tempEnchant)))
        ) {
          mergeIssue(agg, fight, mk("vsNonUndead"));
        }

        // -- Boss-context: undead-or-demon-only on neither --
        // (GearIssues.gs:524-550)
        const isUndeadOrDemonBoss = endsWithAny(
          bossSuffix,
          UNDEAD_OR_DEMON_BOSS_SUFFIXES,
        );
        if (
          !isUndeadOrDemonBoss &&
          (WIZARD_OIL_DEMON_ITEMS.has(itemId) ||
            (tempEnchant > 0 && WIZARD_OIL_DEMON_TEMP_ENCHANTS.has(tempEnchant)))
        ) {
          mergeIssue(agg, fight, mk("vsNonUndeadNonDemon"));
        }

        // -- SR resistance gear (GearIssues.gs:551-584) --
        if (RESISTANCE_GEAR_ITEMS.has(itemId)) {
          const okBoss =
            endsWithAny(bossSuffix, RESISTANCE_GEAR_OK_BOSS_SUFFIXES) ||
            (bossSuffix.endsWith(RESISTANCE_GEAR_OK_BOSS_FOR_CASTER) &&
              (playerType === "Mage" || playerType === "Warlock"));
          if (!okBoss && isMinorityOnBoss(fight.id, itemId)) {
            mergeIssue(agg, fight, mk("wrongSRgear"));
          }
        }

        // -- PvP gear in PvE raid (GearIssues.gs:585-602) --
        if (
          PVP_GEAR_ITEMS.has(itemId) &&
          !endsWithAny(bossSuffix, PVP_GEAR_OK_BOSS_SUFFIXES)
        ) {
          mergeIssue(agg, fight, mk("wrongPvPgear"));
        }

        // -- Useless riding gear (GearIssues.gs:603-618) --
        if (RIDING_GEAR_ITEMS.has(itemId)) {
          mergeIssue(agg, fight, mk("uselessRidingGear"));
        }

        // -- Useless slowfall gear (GearIssues.gs:619-634) --
        if (SLOWFALL_GEAR_ITEMS.has(itemId)) {
          mergeIssue(agg, fight, mk("uselessSlowfallGear"));
        }

        // -- Useless engineering gear (GearIssues.gs:635-668) --
        // Source excludes specific (boss-suffix, item, class) combos:
        //   "607" — never flag (Mother Shahraz, who eats engi nukes)
        //   "608" + Mage + 35581 (Adamantite Grenade — fine on IC mages)
        //   "729" + (35581 or 23824)
        //   "727" + 4397
        // and only flags when <50% of raiders use the item on that boss.
        if (ENGINEERING_GEAR_ITEMS.has(itemId)) {
          const skipEngiBoss =
            bossSuffix.endsWith("607") ||
            (bossSuffix.endsWith("608") && playerType === "Mage" && itemId === 35581) ||
            (bossSuffix.endsWith("729") && (itemId === 35581 || itemId === 23824)) ||
            (bossSuffix.endsWith("727") && itemId === 4397);
          if (!skipEngiBoss && isMinorityOnBoss(fight.id, itemId)) {
            mergeIssue(agg, fight, mk("uselessEngiGear"));
          }
        }

        // -- Curated suboptimal-items list (GearIssues.gs:669-684) --
        if (SUBOPTIMAL_ITEM_IDS.has(itemId)) {
          mergeIssue(agg, fight, mk("suboptimalItem"));
        }

        // -- Enchant checks (GearIssues.gs:686-737) --
        // The script applies the "ignore" gate ONLY to the enchant + socket
        // checks below — class-vs-stat and PvP/SR/riding checks above happen
        // regardless. So the ignore list does NOT short-circuit the file.
        if (IGNORE_ITEM_IDS.has(itemId)) continue;

        if (ENCHANTABLE_SLOTS.has(slot)) {
          // Off-hand "_misc_" exception (totems / librams / idols)
          if (slot === 16 && icon.includes("_misc_")) continue;

          const permEnchantRaw = r["permanentEnchant"];
          const permEnchant =
            typeof permEnchantRaw === "number"
              ? permEnchantRaw
              : typeof permEnchantRaw === "string"
                ? Number(permEnchantRaw)
                : 0;

          // Spell-pen cloak on Mother Shahraz: source tracks whether the
          // 2938 enchant appears ONLY on Illidari Council (608), in which
          // case it's not flagged. We capture per-boss occurrences here and
          // resolve after the full scan.
          const flags = agg.enchantBossFlags.get(itemId) ?? {
            onMother: false,
            elsewhere: false,
            spellPenOnIC: false,
            spellPenElsewhere: false,
          };
          if (bossSuffix.endsWith(MOTHER_SHAHRAZ_SUFFIX)) flags.onMother = true;
          else flags.elsewhere = true;
          if (permEnchant === SPELL_PEN_CLOAK_ENCHANT) {
            if (bossSuffix.endsWith(ILLIDARI_COUNCIL_SUFFIX)) flags.spellPenOnIC = true;
            else flags.spellPenElsewhere = true;
          }
          agg.enchantBossFlags.set(itemId, flags);

          if (!permEnchant) {
            // No enchant — defer; could be suppressed by Mother-Shahraz rule
            const cur = agg.deferredEnchant.get(itemId) ?? {
              kind: "noEnchant" as const,
              itemId,
              itemName: name,
              slot,
              slotName,
              bosses: [],
            };
            if (!cur.bosses.includes(fight.name)) cur.bosses.push(fight.name);
            agg.deferredEnchant.set(itemId, cur);
          } else {
            // Healer enchant exceptions
            const isPriestSpellPen =
              permEnchant === SPELL_PEN_CLOAK_ENCHANT && playerType === "Priest";
            const isHealerWeaponSP =
              permEnchant === WEAPON_40SP_ENCHANT &&
              (playerType === "Paladin" || playerType === "Shaman");
            if (isPriestSpellPen || isHealerWeaponSP) {
              // accepted
            } else {
              const badName = lookupBadEnchant(permEnchant, slot);
              if (badName) {
                const cur = agg.deferredEnchant.get(itemId) ?? {
                  kind: "badEnchant" as const,
                  itemId,
                  itemName: `${name} — ${badName}`,
                  slot,
                  slotName,
                  bosses: [],
                };
                if (!cur.bosses.includes(fight.name)) cur.bosses.push(fight.name);
                agg.deferredEnchant.set(itemId, cur);
              }
            }
          }
        }
      }

      // ---- Meta gem activation (uses pass-1 fight-scoped counts) ----
      for (const m of foundMetas) {
        if (isMetaGemActive(m.gemId, redCount, yellowCount, blueCount)) continue;
        mergeIssue(agg, fight, {
          kind: "metaGemInactive",
          itemId: m.itemId,
          itemName: m.itemName,
          slot: m.slot,
          slotName: SLOT_LABELS[m.slot] ?? `slot ${m.slot}`,
          seenOnBosses: [],
        });
      }

      // ---- Missing items in required slots ----
      for (const slot of REQUIRED_SLOTS) {
        if (slotsSeen.has(slot)) continue;
        if (MISSING_SKIP_SLOTS.has(slot)) continue;
        mergeIssue(agg, fight, {
          kind: "missing",
          itemId: 0,
          itemName: "—",
          slot,
          slotName: SLOT_LABELS[slot] ?? `slot ${slot}`,
          seenOnBosses: [],
        });
      }

      playersById.set(entry.id, agg);
    }
  }

  // ---- Resolve deferred enchant issues with the excludeMotherShahraz gate ----
  for (const agg of playersById.values()) {
    for (const [itemId, deferred] of agg.deferredEnchant) {
      const flags = agg.enchantBossFlags.get(itemId);
      // Mother-Shahraz suppression: drop if user requested AND issue was seen
      // only on Mother Shahraz (607), never elsewhere.
      if (
        excludeMotherShahraz &&
        flags &&
        flags.onMother &&
        !flags.elsewhere
      ) {
        continue;
      }
      // Spell-pen-only-on-IC suppression: source line 725 keeps a bad-enchant
      // entry only if 2938 was used somewhere OTHER than Illidari Council.
      // (If only on IC, it's intentional.)
      if (
        deferred.kind === "badEnchant" &&
        flags &&
        flags.spellPenOnIC &&
        !flags.spellPenElsewhere
      ) {
        continue;
      }
      const key = `${deferred.kind}::${itemId}::${deferred.slot}`;
      agg.issuesByKey.set(key, {
        kind: deferred.kind,
        itemId: deferred.itemId,
        itemName: deferred.itemName,
        slot: deferred.slot,
        slotName: deferred.slotName,
        seenOnBosses: deferred.bosses,
      });
    }
  }

  const players: PlayerGearIssues[] = [];
  for (const [id, agg] of playersById) {
    players.push({
      id,
      name: agg.name,
      type: agg.type,
      issues: [...agg.issuesByKey.values()].sort((a, b) => {
        const c = a.slot - b.slot;
        if (c !== 0) return c;
        return a.kind.localeCompare(b.kind);
      }),
    });
  }
  players.sort((a, b) => {
    const c = a.type.localeCompare(b.type);
    if (c !== 0) return c;
    return a.name.localeCompare(b.name);
  });

  return {
    logId: parsed.logId,
    ...(fightsRaw.title ? { title: fightsRaw.title } : {}),
    bossesScanned: bossFights.length,
    players,
  };
}

function mergeIssue(
  agg: { issuesByKey: Map<string, GearIssue> },
  fight: Fight,
  issue: GearIssue,
): void {
  const key = `${issue.kind}::${issue.itemId}::${issue.slot}`;
  const existing = agg.issuesByKey.get(key);
  if (existing) {
    if (!existing.seenOnBosses.includes(fight.name)) {
      existing.seenOnBosses.push(fight.name);
    }
  } else {
    agg.issuesByKey.set(key, { ...issue, seenOnBosses: [fight.name] });
  }
}
