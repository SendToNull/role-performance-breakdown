// Static gear-issue rule data extracted verbatim from GearIssues.gs.
// Adding new IDs: cross-reference against the source script first; these
// lists drive false-positive prevention as much as detection, so guessing
// is dangerous.

// ---- Class-vs-stat gem lists (GearIssues.gs:400, 407) ----------------------

/** Spell-hit / spell-power gems that are wasted on physical DPS. */
export const SPELL_HIT_GEMS: ReadonlySet<number> = new Set([
  31860, 31861, 39725, 30606, 30605, 30564, 32221, 31867, 31866,
]);

/** Melee-hit / strength gems that are wasted on casters. */
export const MELEE_HIT_GEMS: ReadonlySet<number> = new Set([
  28468, 23116, 24051, 30559, 30553, 30575, 30556, 32220, 24061, 23100, 33142,
  32206,
]);

/** Uncut gems (raw gems that haven't been jewelcrafted). */
export const UNCUT_GEMS: ReadonlySet<number> = new Set([
  23112, 23436, 23077, 23441, 23440, 23117, 23438, 23437, 23107, 23079, 21929,
  23439, 32227, 32229, 32228, 32231, 32249, 32230,
]);

// ---- Class-vs-stat weapon-enchant lists (GearIssues.gs:382, 389) -----------

/** Sharpening stones / weapon oils wasted on the wrong class. */
export const SPELL_HIT_TEMP_ENCHANTS: ReadonlySet<number> = new Set([
  3002, 2935, // Superior Wizard Oil etc. — wasted on Hunter/Rogue/Warrior
]);

export const MELEE_HIT_TEMP_ENCHANTS: ReadonlySet<number> = new Set([
  3003, 2658, // Adamantite Sharpening Stone etc. — wasted on Mage/Priest/Warlock
]);

// ---- Consecrated weapon (undead-only) (GearIssues.gs:497) ------------------

/** Items that only work vs undead (e.g. Hammer of the Lightbringer). */
export const CONSECRATED_WEAPON_ITEMS: ReadonlySet<number> = new Set([13209, 19812]);
/** Temp enchants that only work vs undead (Consecrated Sharpening Stone etc). */
export const CONSECRATED_TEMP_ENCHANTS: ReadonlySet<number> = new Set([2684, 2685]);

// ---- Brilliant Wizard Oil (undead/demon only) (GearIssues.gs:524) ----------

export const WIZARD_OIL_DEMON_ITEMS: ReadonlySet<number> = new Set([23206, 23207]);
export const WIZARD_OIL_DEMON_TEMP_ENCHANTS: ReadonlySet<number> = new Set([3093]);

// ---- Encounter-id suffixes (boss-context exclusions) -----------------------
// Source matches `fight.boss.toString().endsWith(suffix)` — TBC encounter ids
// vary in prefix length so endsWith is what we mirror.

/** Bosses that ARE undead (so undead-only gear is fine on them). */
export const UNDEAD_BOSS_SUFFIXES: readonly string[] = [
  "652", "653", "658", "662", "618", "726", "603", "604",
];

/** Bosses that are undead OR demon (so undead-or-demon-only gear is fine). */
export const UNDEAD_OR_DEMON_BOSS_SUFFIXES: readonly string[] = [
  "652", "653", "658", "662", "618", "726", "603", "604",
  "651", "657", "661", "619", "620", "621", "622", "725", "727", "729", "602",
  "607", "609",
];

/** Mother Shahraz encounter suffix — has special spell-pen behavior. */
export const MOTHER_SHAHRAZ_SUFFIX = "607";
/** Illidari Council suffix — spell pen on cloak is acceptable here. */
export const ILLIDARI_COUNCIL_SUFFIX = "608";

// ---- Resistance-gear (SR) (GearIssues.gs:551-553) --------------------------

/** Frost/shadow/arcane-resist gear from Naxx and TBC. */
export const RESISTANCE_GEAR_ITEMS: ReadonlySet<number> = new Set([
  20537, 20538, 20539, 20549, 20550, 20551, 21530, 21627, 21687, 21838, 24097,
  31928, 31939, 32389, 32390, 32391, 32392, 32393, 32394, 32395, 32396, 32397,
  32398, 32399, 32400, 32401, 32402, 32403, 32404, 32420, 32649, 32757,
]);

/**
 * Bosses where resist gear is actively required. Don't flag SR gear on these.
 * 609 (Sunwell trash?) is conditionally excluded for Mage/Warlock only.
 */
export const RESISTANCE_GEAR_OK_BOSS_SUFFIXES: readonly string[] = [
  "607", "620", "621", "727",
];
/** Boss-suffix where SR gear is excused only for casters. */
export const RESISTANCE_GEAR_OK_BOSS_FOR_CASTER = "609";

// ---- PvP gear (GearIssues.gs:585-587) --------------------------------------

export const PVP_GEAR_ITEMS: ReadonlySet<number> = new Set([
  18849, 18858, 18862, 18864, 18851, 18845, 18846, 18850, 18834, 18853, 18856,
  18854, 18863, 18859, 18857, 18852, 28234, 28235, 28236, 28237, 28238, 28239,
  28240, 28241, 28242, 28243, 29592, 29593, 30343, 30344, 30345, 30346, 30348,
  30349, 30350, 30351, 33046, 37864, 37865,
]);

/** PvP-context bosses where this gear is actually expected. */
export const PVP_GEAR_OK_BOSS_SUFFIXES: readonly string[] = [
  "618", "619", "622", "727",
];

// ---- Useless riding gear (GearIssues.gs:603) -------------------------------

export const RIDING_GEAR_ITEMS: ReadonlySet<number> = new Set([
  25653, 32863, 11122, 37313, 37312, 37311, 32481,
]);

// ---- Useless slowfall gear (GearIssues.gs:619) -----------------------------

export const SLOWFALL_GEAR_ITEMS: ReadonlySet<number> = new Set([32538, 32539, 10518]);

// ---- Useless engineering gear (GearIssues.gs:635-637) ----------------------

export const ENGINEERING_GEAR_ITEMS: ReadonlySet<number> = new Set([
  30542, 18984, 30544, 18986, 23824, 35581, 23762, 2789, 10724, 10518, 4397,
]);

// ---- Ignore list — items that bypass all enchant/gem checks ---------------
// (GearIssues.gs:687) Source has 152 IDs inline. Mostly vendor junk, low-level
// items, ranged-slot consumables (totems, librams, idols), and PvP/honor
// trinkets that don't merit checking.

export const IGNORE_ITEM_IDS: ReadonlySet<number> = new Set([
  21471, 21597, 27471, 1172, 22937, 6803, 23029, 15857, 11928, 23048, 23049,
  7344, 22329, 11904, 21666, 8625, 3451, 8624, 6182, 6654, 15986, 12471,
  19115, 6774, 2565, 16887, 7297, 15942, 22206, 11522, 3419, 2879, 22994,
  4696, 15940, 2410, 8626, 15945, 15973, 15967, 18425, 15993, 4838, 4836,
  15984, 13261, 15925, 15935, 15941, 5611, 15972, 5028, 6653, 3424, 15989,
  15932, 15974, 15975, 15965, 7609, 15982, 15931, 15970, 15963, 7559, 7611,
  9914, 15930, 15985, 15912, 15978, 15971, 4837, 3420, 7555, 15947, 15928,
  15962, 15979, 7557, 15976, 15983, 15206, 15934, 3675, 7554, 7608, 7558,
  9769, 15939, 29273, 29270, 28412, 29274, 29272, 29170, 29330, 28734, 31493,
  28781, 28187, 29271, 28603, 29269, 28525, 28728, 28387, 27714, 27477,
  28260, 31732, 32533, 27534, 31699, 31731, 31494, 28213, 25099, 32651,
  32452, 34179, 30872, 25095, 28941, 25091, 31823, 25097, 33334, 28938,
  34206, 25096, 25092, 25090, 28346, 32520, 32361, 33325, 32350, 25093,
  32961, 29923, 34033, 35074, 25098, 33681, 35016, 30911, 33736, 31978,
  25094, 35008,
]);

// ---- Uncommon-gem exclusion list (GearIssues.gs:761) -----------------------
// ilvl-60 gems that are actually fine (PvP/honor gems, raid gems that
// happen to be uncommon-tier). Don't flag these as uncommonGem.

export const UNCOMMON_GEM_EXCLUSIONS: ReadonlySet<number> = new Set([
  38549, 32836, 28118, 27679, 30571, 27812, 30598, 27777, 28362, 28361, 28363,
  28123, 28119, 28120, 28360, 38545, 38550, 27785, 27809, 38546, 27820, 38548,
  27786, 38547,
]);

// ---- Enchant exceptions (GearIssues.gs:725) --------------------------------

/** Spell penetration cloak enchant id — fine for Priest unconditionally. */
export const SPELL_PEN_CLOAK_ENCHANT = 2938;
/** Weapon 40SP enchant — fine for Paladin / Shaman (healers). */
export const WEAPON_40SP_ENCHANT = 2669;
