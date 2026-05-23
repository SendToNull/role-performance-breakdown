// AUTO-GENERATED from rpb-source/configNew.csv via gen-metrics.mjs.
// DO NOT EDIT BY HAND. Re-run `node rpb-source/gen-metrics.mjs` to refresh.

export interface TrackedMetric {
  /** Stable, unique slug. */
  id: string;
  /** Display label. */
  label: string;
  /** Raw original cell value, for debugging/tooltip. */
  raw: string;
  /** Parsed spell ids. May be empty (e.g. stat rows like "Battle Shout uptime"). */
  spellIds: number[];
  /** Parsed modifiers from the raw label. */
  modifiers: {
    baseCastTime?: number;
    cooldownSec?: number;
    buffDurationSec?: number;
    /** {true} → count aura bands on the player rather than cast totals. */
    checkAura?: boolean;
  };
}

export interface TrackedSection {
  /** Section identifier (e.g. "damageTaken", "Druid:singleTargetCasts"). */
  section: string;
  rows: TrackedMetric[];
}

export const TRACKED_SECTIONS: TrackedSection[] = [
  {
    "section": "damageTaken",
    "rows": [
      {
        "id": "damagetaken-whirlwind",
        "label": "Whirlwind",
        "raw": "Whirlwind [1680,15589,26686,26084,33239,37641,41195,41061,41400,41195]",
        "spellIds": [
          1680,
          15589,
          26686,
          26084,
          33239,
          37641,
          41195,
          41061,
          41400,
          41195
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-rain-of-fire",
        "label": "Rain of Fire",
        "raw": "Rain of Fire [5740,11678,11677,6219,28794,34435,37465,43440,31598,24669,31340,33508,33627,33972,34360,36808,37279,38635,42023]",
        "spellIds": [
          5740,
          11678,
          11677,
          6219,
          28794,
          34435,
          37465,
          43440,
          31598,
          24669,
          31340,
          33508,
          33627,
          33972,
          34360,
          36808,
          37279,
          38635,
          42023
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-fire-shield",
        "label": "Fire Shield",
        "raw": "Fire Shield [8317,8316,2947,11770,11771]",
        "spellIds": [
          8317,
          8316,
          2947,
          11770,
          11771
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-flames",
        "label": "Flames",
        "raw": "Flames [7897,12796,19628,29115,15643]",
        "spellIds": [
          7897,
          12796,
          19628,
          29115,
          15643
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-cleave",
        "label": "Cleave",
        "raw": "Cleave [797,3433,3434,3435,5532,11427,15284,15496,15579,15584,15613,15622,15623,15663,16044,17685,19632,19642,20571,20605,20666,20677,20684,20691,22540,26350,27794,19983,39174,30131,30619,29665,42746,39047,40505,42373,46468,29561,31043,31345,31779,38474,46559]",
        "spellIds": [
          797,
          3433,
          3434,
          3435,
          5532,
          11427,
          15284,
          15496,
          15579,
          15584,
          15613,
          15622,
          15623,
          15663,
          16044,
          17685,
          19632,
          19642,
          20571,
          20605,
          20666,
          20677,
          20684,
          20691,
          22540,
          26350,
          27794,
          19983,
          39174,
          30131,
          30619,
          29665,
          42746,
          39047,
          40505,
          42373,
          46468,
          29561,
          31043,
          31345,
          31779,
          38474,
          46559
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-blizzard",
        "label": "Blizzard",
        "raw": "Blizzard [26607,41482]",
        "spellIds": [
          26607,
          41482
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-explode",
        "label": "Explode",
        "raw": "Explode [26059,25699]",
        "spellIds": [
          26059,
          25699
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-impale",
        "label": "Impale",
        "raw": "Impale [26025]",
        "spellIds": [
          26025
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-bomb",
        "label": "Bomb",
        "raw": "Bomb [8858,9143,22334]",
        "spellIds": [
          8858,
          9143,
          22334
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-thunderclap",
        "label": "Thunderclap",
        "raw": "Thunderclap [26554,8732]",
        "spellIds": [
          26554,
          8732
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-shadow-storm",
        "label": "Shadow Storm",
        "raw": "Shadow Storm [26546,26555]",
        "spellIds": [
          26546,
          26555
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-dark-glare",
        "label": "Dark Glare",
        "raw": "Dark Glare [41936,41937,26029]",
        "spellIds": [
          41936,
          41937,
          26029
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-falling",
        "label": "Falling",
        "raw": "Falling [3]",
        "spellIds": [
          3
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-void-zone",
        "label": "Void Zone",
        "raw": "Void Zone [28863,28865]",
        "spellIds": [
          28863,
          28865
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-poison-cloud",
        "label": "Poison Cloud",
        "raw": "Poison Cloud [28240,28241]",
        "spellIds": [
          28240,
          28241
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-frost-breath",
        "label": "Frost Breath",
        "raw": "Frost Breath [3129,28524]",
        "spellIds": [
          3129,
          28524
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-eruption",
        "label": "Eruption",
        "raw": "Eruption [29371]",
        "spellIds": [
          29371
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-brood-power-bronze",
        "label": "Brood Power Bronze",
        "raw": "Brood Power Bronze [22311]",
        "spellIds": [
          22311
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-void-blast",
        "label": "Void Blast",
        "raw": "Void Blast [27812]",
        "spellIds": [
          27812
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-tail-sweep",
        "label": "Tail Sweep",
        "raw": "Tail Sweep [15847,25653]",
        "spellIds": [
          15847,
          25653
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-positive-charge",
        "label": "Positive Charge",
        "raw": "Positive Charge [28062]",
        "spellIds": [
          28062
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-negative-charge",
        "label": "Negative Charge",
        "raw": "Negative Charge [28085]",
        "spellIds": [
          28085
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-disrupting-shout",
        "label": "Disrupting Shout",
        "raw": "Disrupting Shout [29107]",
        "spellIds": [
          29107
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-chill",
        "label": "Chill",
        "raw": "Chill [28547]",
        "spellIds": [
          28547
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-dark-blast",
        "label": "Dark Blast",
        "raw": "Dark Blast [28457]",
        "spellIds": [
          28457
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-wail-of-souls",
        "label": "Wail of Souls",
        "raw": "Wail of Souls [28459]",
        "spellIds": [
          28459
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-shatter",
        "label": "Shatter",
        "raw": "Shatter [33671]",
        "spellIds": [
          33671
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-cave-in",
        "label": "Cave In",
        "raw": "Cave In [36240]",
        "spellIds": [
          36240
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-charred-earth",
        "label": "Charred Earth",
        "raw": "Charred Earth [30129]",
        "spellIds": [
          30129
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-flame-wreath",
        "label": "Flame Wreath",
        "raw": "Flame Wreath [30004]",
        "spellIds": [
          30004
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-hellfire",
        "label": "Hellfire",
        "raw": "Hellfire [30859]",
        "spellIds": [
          30859
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-shadow-nova",
        "label": "Shadow Nova",
        "raw": "Shadow Nova [30852]",
        "spellIds": [
          30852
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-blast-wave",
        "label": "Blast Wave",
        "raw": "Blast Wave [33061]",
        "spellIds": [
          33061
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-conflagration",
        "label": "Conflagration",
        "raw": "Conflagration [30757]",
        "spellIds": [
          30757
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-debris",
        "label": "Debris",
        "raw": "Debris [30631]",
        "spellIds": [
          30631
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-spout",
        "label": "Spout",
        "raw": "Spout [37433]",
        "spellIds": [
          37433
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-scalding-water",
        "label": "Scalding Water",
        "raw": "Scalding Water [37284]",
        "spellIds": [
          37284
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-flame-quills",
        "label": "Flame Quills",
        "raw": "Flame Quills [34229,34269,34270,34271,34272,34273,34274,34275,34276,34277,34278,34279,34280,34281,34282,34283,34284,34285,34286,34287,34288,34289,34314,34315,34316]",
        "spellIds": [
          34229,
          34269,
          34270,
          34271,
          34272,
          34273,
          34274,
          34275,
          34276,
          34277,
          34278,
          34279,
          34280,
          34281,
          34282,
          34283,
          34284,
          34285,
          34286,
          34287,
          34288,
          34289,
          34314,
          34315,
          34316
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-arcane-orb",
        "label": "Arcane Orb",
        "raw": "Arcane Orb [34190]",
        "spellIds": [
          34190
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-flame-patch",
        "label": "Flame Patch",
        "raw": "Flame Patch [35383]",
        "spellIds": [
          35383
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-rebirth",
        "label": "Rebirth",
        "raw": "Rebirth [34342]",
        "spellIds": [
          34342
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-mortal-cleave",
        "label": "Mortal Cleave",
        "raw": "Mortal Cleave [38572]",
        "spellIds": [
          38572
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-spore-cloud",
        "label": "Spore Cloud",
        "raw": "Spore Cloud [38653]",
        "spellIds": [
          38653
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-arcane-burst",
        "label": "Arcane Burst",
        "raw": "Arcane Burst [36970]",
        "spellIds": [
          36970
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-flame-strike",
        "label": "Flame Strike",
        "raw": "Flame Strike [36731]",
        "spellIds": [
          36731
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-burn",
        "label": "Burn",
        "raw": "Burn [36721]",
        "spellIds": [
          36721
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-toxic-spores",
        "label": "Toxic Spores",
        "raw": "Toxic Spores [360327]",
        "spellIds": [
          360327
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-rain-of-chaos",
        "label": "Rain of Chaos",
        "raw": "Rain of Chaos [40948]",
        "spellIds": [
          40948
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-eye-blast",
        "label": "Eye Blast",
        "raw": "Eye Blast [40018]",
        "spellIds": [
          40018
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-flame-crash",
        "label": "Flame Crash",
        "raw": "Flame Crash [40832]",
        "spellIds": [
          40832
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-consecration",
        "label": "Consecration",
        "raw": "Consecration [41541]",
        "spellIds": [
          41541
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-flamestrike",
        "label": "Flamestrike",
        "raw": "Flamestrike [41481]",
        "spellIds": [
          41481
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-death-decay",
        "label": "Death & Decay",
        "raw": "Death & Decay [31258]",
        "spellIds": [
          31258
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-doomfire",
        "label": "Doomfire",
        "raw": "Doomfire [31944,31969]",
        "spellIds": [
          31944,
          31969
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-malevolent-cleave",
        "label": "Malevolent Cleave",
        "raw": "Malevolent Cleave [31436]",
        "spellIds": [
          31436
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-molten-flame",
        "label": "Molten Flame",
        "raw": "Molten Flame [40265]",
        "spellIds": [
          40265
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-volcanic-eruption",
        "label": "Volcanic Eruption",
        "raw": "Volcanic Eruption [40276]",
        "spellIds": [
          40276
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-l4-arcane-charge",
        "label": "L4 Arcane Charge",
        "raw": "L4 Arcane Charge [41349]",
        "spellIds": [
          41349
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-volcanic-eruption-2",
        "label": "Volcanic Eruption",
        "raw": "Volcanic Eruption [42052]",
        "spellIds": [
          42052
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-demonic-vapor",
        "label": "Demonic Vapor",
        "raw": "Demonic Vapor [46931]",
        "spellIds": [
          46931
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-void-zone-effect",
        "label": "Void Zone Effect",
        "raw": "Void Zone Effect [46264]",
        "spellIds": [
          46264
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-armageddon",
        "label": "Armageddon",
        "raw": "Armageddon [45915]",
        "spellIds": [
          45915
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-darkness",
        "label": "Darkness",
        "raw": "Darkness [45996]",
        "spellIds": [
          45996
        ],
        "modifiers": {}
      },
      {
        "id": "damagetaken-shadow-spike",
        "label": "Shadow Spike",
        "raw": "Shadow Spike [45885]",
        "spellIds": [
          45885
        ],
        "modifiers": {}
      }
    ]
  },
  {
    "section": "debuffs",
    "rows": [
      {
        "id": "debuffs-silence",
        "label": "Silence",
        "raw": "Silence [18327]",
        "spellIds": [
          18327
        ],
        "modifiers": {}
      },
      {
        "id": "debuffs-mana-burn",
        "label": "Mana Burn",
        "raw": "Mana Burn [26049]",
        "spellIds": [
          26049
        ],
        "modifiers": {}
      },
      {
        "id": "debuffs-silence-2",
        "label": "Silence",
        "raw": "Silence [26069]",
        "spellIds": [
          26069
        ],
        "modifiers": {}
      },
      {
        "id": "debuffs-entangling-roots",
        "label": "Entangling Roots",
        "raw": "Entangling Roots [26071]",
        "spellIds": [
          26071
        ],
        "modifiers": {}
      },
      {
        "id": "debuffs-war-stomp",
        "label": "War Stomp",
        "raw": "War Stomp [24375]",
        "spellIds": [
          24375
        ],
        "modifiers": {}
      },
      {
        "id": "debuffs-suppression-aura",
        "label": "Suppression Aura",
        "raw": "Suppression Aura [22247]",
        "spellIds": [
          22247
        ],
        "modifiers": {}
      },
      {
        "id": "debuffs-silence-3",
        "label": "Silence",
        "raw": "Silence [30225]",
        "spellIds": [
          30225
        ],
        "modifiers": {}
      },
      {
        "id": "debuffs-fungal-bloom",
        "label": "Fungal Bloom",
        "raw": "Fungal Bloom [29232]",
        "spellIds": [
          29232
        ],
        "modifiers": {}
      },
      {
        "id": "debuffs-web-wrap",
        "label": "Web Wrap",
        "raw": "Web Wrap [28622]",
        "spellIds": [
          28622
        ],
        "modifiers": {}
      },
      {
        "id": "debuffs-mind-exhaustion",
        "label": "Mind Exhaustion",
        "raw": "Mind Exhaustion [44032]",
        "spellIds": [
          44032
        ],
        "modifiers": {}
      },
      {
        "id": "debuffs-nether-vapor",
        "label": "Nether Vapor",
        "raw": "Nether Vapor [35859]",
        "spellIds": [
          35859
        ],
        "modifiers": {}
      },
      {
        "id": "debuffs-consuming-madness",
        "label": "Consuming Madness",
        "raw": "Consuming Madness [37749]",
        "spellIds": [
          37749
        ],
        "modifiers": {}
      },
      {
        "id": "debuffs-seed-of-corruption",
        "label": "Seed of Corruption",
        "raw": "Seed of Corruption [27243]",
        "spellIds": [
          27243
        ],
        "modifiers": {}
      },
      {
        "id": "debuffs-inferno-effect",
        "label": "Inferno Effect",
        "raw": "Inferno Effect [31302]",
        "spellIds": [
          31302
        ],
        "modifiers": {}
      },
      {
        "id": "debuffs-unquenchable-flames",
        "label": "Unquenchable Flames",
        "raw": "Unquenchable Flames [31341]",
        "spellIds": [
          31341
        ],
        "modifiers": {}
      },
      {
        "id": "debuffs-deaden",
        "label": "Deaden",
        "raw": "Deaden [41410]",
        "spellIds": [
          41410
        ],
        "modifiers": {}
      },
      {
        "id": "debuffs-shear-ignore-if-feral",
        "label": "Shear (ignore if feral)",
        "raw": "Shear (ignore if feral) [41032]",
        "spellIds": [
          41032
        ],
        "modifiers": {}
      },
      {
        "id": "debuffs-fog-of-corruption",
        "label": "Fog of Corruption",
        "raw": "Fog of Corruption [45717]",
        "spellIds": [
          45717
        ],
        "modifiers": {}
      }
    ]
  },
  {
    "section": "statsAndMisc",
    "rows": [
      {
        "id": "statsandmisc-battle-shout-uptime-on-you",
        "label": "Battle Shout uptime on you%",
        "raw": "Battle Shout uptime on you%",
        "spellIds": [],
        "modifiers": {}
      },
      {
        "id": "statsandmisc-commanding-shout-uptime-on-you",
        "label": "Commanding Shout uptime on you%",
        "raw": "Commanding Shout uptime on you%",
        "spellIds": [],
        "modifiers": {}
      },
      {
        "id": "statsandmisc-critical-heals-done",
        "label": "Critical heals done",
        "raw": "Critical heals done",
        "spellIds": [],
        "modifiers": {}
      },
      {
        "id": "statsandmisc-critical-outgoing",
        "label": "Critical outgoing",
        "raw": "Critical outgoing",
        "spellIds": [],
        "modifiers": {}
      },
      {
        "id": "statsandmisc-dodge-outgoing",
        "label": "Dodge outgoing",
        "raw": "Dodge outgoing",
        "spellIds": [],
        "modifiers": {}
      },
      {
        "id": "statsandmisc-miss-outgoing",
        "label": "Miss outgoing",
        "raw": "Miss outgoing",
        "spellIds": [],
        "modifiers": {}
      },
      {
        "id": "statsandmisc-parry-outgoing",
        "label": "Parry outgoing",
        "raw": "Parry outgoing",
        "spellIds": [],
        "modifiers": {}
      },
      {
        "id": "statsandmisc-resist-outgoing",
        "label": "Resist outgoing",
        "raw": "Resist outgoing",
        "spellIds": [],
        "modifiers": {}
      },
      {
        "id": "statsandmisc-critical-incoming-melee-hits",
        "label": "Critical incoming (Melee hits)",
        "raw": "Critical incoming (Melee hits)",
        "spellIds": [],
        "modifiers": {}
      },
      {
        "id": "statsandmisc-crushing-blow-incoming-melee-hits",
        "label": "Crushing Blow incoming (Melee hits)",
        "raw": "Crushing Blow incoming (Melee hits)",
        "spellIds": [],
        "modifiers": {}
      },
      {
        "id": "statsandmisc-blocked-incoming-melee-hits",
        "label": "Blocked incoming (Melee hits)",
        "raw": "Blocked incoming (Melee hits)",
        "spellIds": [],
        "modifiers": {}
      },
      {
        "id": "statsandmisc-dodge-incoming-melee-hits",
        "label": "Dodge incoming (Melee hits)",
        "raw": "Dodge incoming (Melee hits)",
        "spellIds": [],
        "modifiers": {}
      },
      {
        "id": "statsandmisc-immune-incoming-melee-hits",
        "label": "Immune incoming (Melee hits)",
        "raw": "Immune incoming (Melee hits)",
        "spellIds": [],
        "modifiers": {}
      },
      {
        "id": "statsandmisc-miss-incoming-melee-hits",
        "label": "Miss incoming (Melee hits)",
        "raw": "Miss incoming (Melee hits)",
        "spellIds": [],
        "modifiers": {}
      },
      {
        "id": "statsandmisc-parry-incoming-melee-hits",
        "label": "Parry incoming (Melee hits)",
        "raw": "Parry incoming (Melee hits)",
        "spellIds": [],
        "modifiers": {}
      },
      {
        "id": "statsandmisc-of-extra-windfury-attacks",
        "label": "# of extra Windfury Attacks",
        "raw": "# of extra Windfury Attacks",
        "spellIds": [],
        "modifiers": {}
      },
      {
        "id": "statsandmisc-of-battle-squawk-buffs-on-bosses",
        "label": "# of Battle Squawk buffs on bosses",
        "raw": "# of Battle Squawk buffs on bosses",
        "spellIds": [],
        "modifiers": {}
      }
    ]
  },
  {
    "section": "trinketsAndRacials",
    "rows": [
      {
        "id": "trinketsandracials-auslese-s-light-channeler",
        "label": "Auslese's Light Channeler",
        "raw": "Auslese's Light Channeler [31794] --180--",
        "spellIds": [
          31794
        ],
        "modifiers": {
          "cooldownSec": 180
        }
      },
      {
        "id": "trinketsandracials-bangle-of-endless-blessings",
        "label": "Bangle of Endless Blessings",
        "raw": "Bangle of Endless Blessings [34210] {true} --120-- ++20++",
        "spellIds": [
          34210
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-direbrew-hops",
        "label": "Direbrew Hops",
        "raw": "Direbrew Hops [51954] {true} --120-- ++20++",
        "spellIds": [
          51954
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-earring-of-soulful-meditation",
        "label": "Earring of Soulful Meditation",
        "raw": "Earring of Soulful Meditation [40402] {true} --120-- ++20++",
        "spellIds": [
          40402
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-essence-of-the-martyr",
        "label": "Essence of the Martyr",
        "raw": "Essence of the Martyr [35165] {true} --120-- ++20++",
        "spellIds": [
          35165
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-figurine-seaspray-albatross",
        "label": "Figurine - Seaspray Albatross",
        "raw": "Figurine - Seaspray Albatross [46785] --180--",
        "spellIds": [
          46785
        ],
        "modifiers": {
          "cooldownSec": 180
        }
      },
      {
        "id": "trinketsandracials-figurine-talasite-owl",
        "label": "Figurine - Talasite Owl",
        "raw": "Figurine - Talasite Owl [31045] --300--",
        "spellIds": [
          31045
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      },
      {
        "id": "trinketsandracials-glimmering-naaru-sliver",
        "label": "Glimmering Naaru Sliver",
        "raw": "Glimmering Naaru Sliver [45052] --300--",
        "spellIds": [
          45052
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      },
      {
        "id": "trinketsandracials-lower-city-prayerbook",
        "label": "Lower City Prayerbook",
        "raw": "Lower City Prayerbook [37878,37879,37880,37881] {true} --60-- ++15++",
        "spellIds": [
          37878,
          37879,
          37880,
          37881
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 60,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-oculus-of-the-hidden-eye",
        "label": "Oculus of the Hidden Eye",
        "raw": "Oculus of the Hidden Eye [33012] --120--",
        "spellIds": [
          33012
        ],
        "modifiers": {
          "cooldownSec": 120
        }
      },
      {
        "id": "trinketsandracials-pendant-of-the-violet-eye",
        "label": "Pendant of the Violet Eye",
        "raw": "Pendant of the Violet Eye [29601] {true} --120-- ++20++",
        "spellIds": [
          29601
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-ribbon-of-sacrifice",
        "label": "Ribbon of Sacrifice",
        "raw": "Ribbon of Sacrifice [38332] {true} --120-- ++10++",
        "spellIds": [
          38332
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 10
        }
      },
      {
        "id": "trinketsandracials-tome-of-diabolic-remedy",
        "label": "Tome of Diabolic Remedy",
        "raw": "Tome of Diabolic Remedy [43710] {true} --120-- ++20++",
        "spellIds": [
          43710
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-vial-of-the-sunwell",
        "label": "Vial of the Sunwell",
        "raw": "Vial of the Sunwell [45064] --120--",
        "spellIds": [
          45064
        ],
        "modifiers": {
          "cooldownSec": 120
        }
      },
      {
        "id": "trinketsandracials-warp-scarab-brooch",
        "label": "Warp-Scarab Brooch",
        "raw": "Warp-Scarab Brooch [33400] {true} --120-- ++20++",
        "spellIds": [
          33400
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-blessed-prayer-beads",
        "label": "Blessed Prayer Beads",
        "raw": "Blessed Prayer Beads [24354] {true} --120-- ++20++",
        "spellIds": [
          24354
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-enamored-water-spirit",
        "label": "Enamored Water Spirit",
        "raw": "Enamored Water Spirit [24854] --180--",
        "spellIds": [
          24854
        ],
        "modifiers": {
          "cooldownSec": 180
        }
      },
      {
        "id": "trinketsandracials-eye-of-the-dead",
        "label": "Eye of the Dead",
        "raw": "Eye of the Dead [28780] {true} --120-- ++15++",
        "spellIds": [
          28780
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-hazza-rah-s-charm-of-healing",
        "label": "Hazza'rah's Charm of Healing",
        "raw": "Hazza'rah's Charm of Healing [24546] {true} --180-- ++15++",
        "spellIds": [
          24546
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 180,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-hibernation-crystal",
        "label": "Hibernation Crystal",
        "raw": "Hibernation Crystal [24998] {true} --90-- ++15++",
        "spellIds": [
          24998
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 90,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-mar-li-s-eye",
        "label": "Mar'li's Eye",
        "raw": "Mar'li's Eye [24268] --180--",
        "spellIds": [
          24268
        ],
        "modifiers": {
          "cooldownSec": 180
        }
      },
      {
        "id": "trinketsandracials-natural-alignment-crystal",
        "label": "Natural Alignment Crystal",
        "raw": "Natural Alignment Crystal [23734] {true} --300-- ++20++",
        "spellIds": [
          23734
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 300,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-oshu-gun-relic",
        "label": "Oshu'gun Relic",
        "raw": "Oshu'gun Relic [32367] {true} --120-- ++20++",
        "spellIds": [
          32367
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-scarab-brooch",
        "label": "Scarab Brooch",
        "raw": "Scarab Brooch [26467] {true} --180-- ++30++",
        "spellIds": [
          26467
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 180,
          "buffDurationSec": 30
        }
      },
      {
        "id": "trinketsandracials-scroll-of-blinding-light",
        "label": "Scroll of Blinding Light",
        "raw": "Scroll of Blinding Light [23733] {true} --300-- ++20++",
        "spellIds": [
          23733
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 300,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-second-wind",
        "label": "Second Wind",
        "raw": "Second Wind [15604] --900--",
        "spellIds": [
          15604
        ],
        "modifiers": {
          "cooldownSec": 900
        }
      },
      {
        "id": "trinketsandracials-warmth-of-forgiveness",
        "label": "Warmth of Forgiveness",
        "raw": "Warmth of Forgiveness [28760] --180--",
        "spellIds": [
          28760
        ],
        "modifiers": {
          "cooldownSec": 180
        }
      },
      {
        "id": "trinketsandracials-wushoolay-s-charm-of-nature",
        "label": "Wushoolay's Charm of Nature",
        "raw": "Wushoolay's Charm of Nature [24542] {true} --180-- ++15++",
        "spellIds": [
          24542
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 180,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-dark-iron-smoking-pipe",
        "label": "Dark Iron Smoking Pipe",
        "raw": "Dark Iron Smoking Pipe [51953] {true} --120-- ++20++",
        "spellIds": [
          51953
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-hex-shrunken-head",
        "label": "Hex Shrunken Head",
        "raw": "Hex Shrunken Head [43712] {true} --120-- ++20++",
        "spellIds": [
          43712
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-icon-of-the-silver-crescent",
        "label": "Icon of the Silver Crescent",
        "raw": "Icon of the Silver Crescent [35163] {true} --120-- ++20++",
        "spellIds": [
          35163
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-shifting-naaru-sliver",
        "label": "Shifting Naaru Sliver",
        "raw": "Shifting Naaru Sliver [45044] {true} --90-- ++15++",
        "spellIds": [
          45044
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 90,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-spell-power-scryer-s-bloodgem-and-or-xi-ri-s-gift",
        "label": "Spell Power (Scryer's Bloodgem and/or Xi'ri's Gift)",
        "raw": "Spell Power (Scryer's Bloodgem and/or Xi'ri's Gift) [35337] {true} --90-- ++15+",
        "spellIds": [
          35337
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 90
        }
      },
      {
        "id": "trinketsandracials-the-arcanist-s-stone",
        "label": "The Arcanist's Stone",
        "raw": "The Arcanist's Stone [34000] {true} --120-- ++20++",
        "spellIds": [
          34000
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-the-skull-of-gul-dan",
        "label": "The Skull of Gul'dan",
        "raw": "The Skull of Gul'dan [40396] {true} --120-- ++20++",
        "spellIds": [
          40396
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-vengeance-of-the-illidari",
        "label": "Vengeance of the Illidari",
        "raw": "Vengeance of the Illidari [33662] {true} --90-- ++15++",
        "spellIds": [
          33662
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 90,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-draconic-infused-emblem",
        "label": "Draconic Infused Emblem",
        "raw": "Draconic Infused Emblem [27675] {true} --75-- ++15++",
        "spellIds": [
          27675
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 75,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-essence-of-sapphiron",
        "label": "Essence of Sapphiron",
        "raw": "Essence of Sapphiron [28779] {true} --120-- ++20++",
        "spellIds": [
          28779
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-eye-of-moam",
        "label": "Eye of Moam",
        "raw": "Eye of Moam [26166] {true} --180-- ++30++",
        "spellIds": [
          26166
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 180,
          "buffDurationSec": 30
        }
      },
      {
        "id": "trinketsandracials-mind-quickening-gem",
        "label": "Mind Quickening Gem",
        "raw": "Mind Quickening Gem [23723] {true} --300-- ++20++",
        "spellIds": [
          23723
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 300,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-talisman-of-ascendance",
        "label": "Talisman of Ascendance",
        "raw": "Talisman of Ascendance [28200] {true} --60-- ++15++",
        "spellIds": [
          28200
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 60,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-talisman-of-ephemeral-power",
        "label": "Talisman of Ephemeral Power",
        "raw": "Talisman of Ephemeral Power [23271] {true} --90-- ++15++",
        "spellIds": [
          23271
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 90,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-zandalarian-hero-charm",
        "label": "Zandalarian Hero Charm",
        "raw": "Zandalarian Hero Charm [24659] {true} --120-- ++20++",
        "spellIds": [
          24659
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-jewel-of-charismatic-mystique",
        "label": "Jewel of Charismatic Mystique",
        "raw": "Jewel of Charismatic Mystique [33486] --300--",
        "spellIds": [
          33486
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      },
      {
        "id": "trinketsandracials-timelapse-shard",
        "label": "Timelapse Shard",
        "raw": "Timelapse Shard [35352] --120--",
        "spellIds": [
          35352
        ],
        "modifiers": {
          "cooldownSec": 120
        }
      },
      {
        "id": "trinketsandracials-eye-of-diminution",
        "label": "Eye of Diminution",
        "raw": "Eye of Diminution [28862] {true} --120-- ++20++",
        "spellIds": [
          28862
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-fetish-of-the-sand-reaver",
        "label": "Fetish of the Sand Reaver",
        "raw": "Fetish of the Sand Reaver [26400] {true} --180-- ++20++",
        "spellIds": [
          26400
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 180,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-adamantine-figurine",
        "label": "Adamantine Figurine",
        "raw": "Adamantine Figurine [33479] {true} --120-- ++20++",
        "spellIds": [
          33479
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-argussian-compass",
        "label": "Argussian Compass",
        "raw": "Argussian Compass [39228] {true} --120-- ++20++",
        "spellIds": [
          39228
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-brooch-of-the-immortal-king",
        "label": "Brooch of the Immortal King",
        "raw": "Brooch of the Immortal King [40538] {true} --300-- ++15++",
        "spellIds": [
          40538
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 300,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-dabiri-s-enigma",
        "label": "Dabiri's Enigma",
        "raw": "Dabiri's Enigma [36372] {true} --90-- ++15++",
        "spellIds": [
          36372
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 90,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-figurine-of-the-colossus",
        "label": "Figurine of the Colossus",
        "raw": "Figurine of the Colossus [33089] {true} --120-- ++20++",
        "spellIds": [
          33089
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-figurine-crimson-serpent",
        "label": "Figurine - Crimson Serpent",
        "raw": "Figurine - Crimson Serpent [46783] {true} --120-- ++20++",
        "spellIds": [
          46783
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-figurine-dawnstone-crab",
        "label": "Figurine - Dawnstone Crab",
        "raw": "Figurine - Dawnstone Crab [31039] {true} --120-- ++20++",
        "spellIds": [
          31039
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-figurine-felsteel-boar",
        "label": "Figurine - Felsteel Boar",
        "raw": "Figurine - Felsteel Boar [31038] {true} --300-- ++30++",
        "spellIds": [
          31038
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 300,
          "buffDurationSec": 30
        }
      },
      {
        "id": "trinketsandracials-figurine-living-ruby-serpent",
        "label": "Figurine - Living Ruby Serpent",
        "raw": "Figurine - Living Ruby Serpent [31040] {true} --300-- ++20++",
        "spellIds": [
          31040
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 300,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-gnomeregan-auto-blocker-600",
        "label": "Gnomeregan Auto-Blocker 600",
        "raw": "Gnomeregan Auto-Blocker 600 [35169] {true} --120-- ++20++",
        "spellIds": [
          35169
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-regal-protectorate",
        "label": "Regal Protectorate",
        "raw": "Regal Protectorate [33668] {true} --300-- ++15++",
        "spellIds": [
          33668
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 300,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-scarab-of-displacement",
        "label": "Scarab of Displacement",
        "raw": "Scarab of Displacement [38351] {true} --180-- ++15++",
        "spellIds": [
          38351
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 180,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-shadowmoon-insignia",
        "label": "Shadowmoon Insignia",
        "raw": "Shadowmoon Insignia [40464] {true} --180-- ++20++",
        "spellIds": [
          40464
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 180,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-spyglass-of-the-hidden-fleet",
        "label": "Spyglass of the Hidden Fleet",
        "raw": "Spyglass of the Hidden Fleet [38325] --120--",
        "spellIds": [
          38325
        ],
        "modifiers": {
          "cooldownSec": 120
        }
      },
      {
        "id": "trinketsandracials-steely-naaru-sliver",
        "label": "Steely Naaru Sliver",
        "raw": "Steely Naaru Sliver [45049] {true} --300-- ++15++",
        "spellIds": [
          45049
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 300,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-coren-s-lucky-coin",
        "label": "Coren's Lucky Coin",
        "raw": "Coren's Lucky Coin [51952] {true} --120-- ++20++",
        "spellIds": [
          51952
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-figurine-black-diamond-crab",
        "label": "Figurine - Black Diamond Crab",
        "raw": "Figurine - Black Diamond Crab [26609] {true} --300-- ++20++",
        "spellIds": [
          26609
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 300,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-ancient-aqir-artifact",
        "label": "Ancient Aqir Artifact",
        "raw": "Ancient Aqir Artifact [43713] {true} --120-- ++20++",
        "spellIds": [
          43713
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-diamond-flask",
        "label": "Diamond Flask",
        "raw": "Diamond Flask [24427] --360--",
        "spellIds": [
          24427
        ],
        "modifiers": {
          "cooldownSec": 360
        }
      },
      {
        "id": "trinketsandracials-lifegiving-gem",
        "label": "Lifegiving Gem",
        "raw": "Lifegiving Gem [23725] {true} --300-- ++20++",
        "spellIds": [
          23725
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 300,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-glyph-of-deflection",
        "label": "Glyph of Deflection",
        "raw": "Glyph of Deflection [28773] {true} --120-- ++20++",
        "spellIds": [
          28773
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-nat-pagle-s-broken-reel",
        "label": "Nat Pagle's Broken Reel",
        "raw": "Nat Pagle's Broken Reel [24610] {true} --75-- ++15++",
        "spellIds": [
          24610
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 75,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-abacus-of-violent-odds",
        "label": "Abacus of Violent Odds",
        "raw": "Abacus of Violent Odds [33807] {true} --120-- ++10++",
        "spellIds": [
          33807
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 10
        }
      },
      {
        "id": "trinketsandracials-badge-of-tenacity",
        "label": "Badge of Tenacity",
        "raw": "Badge of Tenacity [40729] {true} --120-- ++20++",
        "spellIds": [
          40729
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-berserker-s-call",
        "label": "Berserker's Call",
        "raw": "Berserker's Call [43716] {true} --120-- ++20++",
        "spellIds": [
          43716
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-bladefist-s-breadth",
        "label": "Bladefist's Breadth",
        "raw": "Bladefist's Breadth [33667] {true} --90-- ++15++",
        "spellIds": [
          33667
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 90,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-bloodlust-brooch",
        "label": "Bloodlust Brooch",
        "raw": "Bloodlust Brooch [35166] {true} --120-- ++20++",
        "spellIds": [
          35166
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-core-of-ar-kelos",
        "label": "Core of Ar'kelos",
        "raw": "Core of Ar'kelos [35733] {true} --120-- ++20++",
        "spellIds": [
          35733
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-crystalforged-trinket",
        "label": "Crystalforged Trinket",
        "raw": "Crystalforged Trinket [40724] {true} --60-- ++10++",
        "spellIds": [
          40724
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 60,
          "buffDurationSec": 10
        }
      },
      {
        "id": "trinketsandracials-empty-mug-of-direbrew",
        "label": "Empty Mug of Direbrew",
        "raw": "Empty Mug of Direbrew [51955] {true} --120-- ++20++",
        "spellIds": [
          51955
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-fetish-of-the-fallen",
        "label": "Fetish of the Fallen",
        "raw": "Fetish of the Fallen [33014] {true} --120--",
        "spellIds": [
          33014
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120
        }
      },
      {
        "id": "trinketsandracials-figurine-dark-iron-scorpid",
        "label": "Figurine - Dark Iron Scorpid",
        "raw": "Figurine - Dark Iron Scorpid [26614] {true} --300--",
        "spellIds": [
          26614
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 300
        }
      },
      {
        "id": "trinketsandracials-figurine-nightseye-panther",
        "label": "Figurine - Nightseye Panther",
        "raw": "Figurine - Nightseye Panther [31047] {true} --180-- ++12++",
        "spellIds": [
          31047
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 180,
          "buffDurationSec": 12
        }
      },
      {
        "id": "trinketsandracials-figurine-shadowsong-panther",
        "label": "Figurine - Shadowsong Panther",
        "raw": "Figurine - Shadowsong Panther [46784] {true} --90-- ++15++",
        "spellIds": [
          46784
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 90,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-icon-of-unyielding-courage",
        "label": "Icon of Unyielding Courage",
        "raw": "Icon of Unyielding Courage [34106] {true} --120-- ++20++",
        "spellIds": [
          34106
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-moroes-lucky-pocket-watch",
        "label": "Moroes' Lucky Pocket Watch",
        "raw": "Moroes' Lucky Pocket Watch [34519] {true} --120-- ++10++",
        "spellIds": [
          34519
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 10
        }
      },
      {
        "id": "trinketsandracials-badge-of-the-swarmguard",
        "label": "Badge of the Swarmguard",
        "raw": "Badge of the Swarmguard [26480] {true} --180-- ++30++",
        "spellIds": [
          26480
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 180,
          "buffDurationSec": 30
        }
      },
      {
        "id": "trinketsandracials-devilsaur-eye",
        "label": "Devilsaur Eye",
        "raw": "Devilsaur Eye [24352] {true} --120-- ++20++",
        "spellIds": [
          24352
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-earthstrike",
        "label": "Earthstrike",
        "raw": "Earthstrike [25891] {true} --120-- ++20++",
        "spellIds": [
          25891
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-jom-gabbar",
        "label": "Jom Gabbar",
        "raw": "Jom Gabbar [29604] {true} --120-- ++20++",
        "spellIds": [
          29604
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-kiss-of-the-spider",
        "label": "Kiss of the Spider",
        "raw": "Kiss of the Spider [28866] {true} --120-- ++15++",
        "spellIds": [
          28866
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-renataki-s-charm-of-beasts",
        "label": "Renataki's Charm of Beasts",
        "raw": "Renataki's Charm of Beasts [24531] --180--",
        "spellIds": [
          24531
        ],
        "modifiers": {
          "cooldownSec": 180
        }
      },
      {
        "id": "trinketsandracials-renataki-s-charm-of-trickery",
        "label": "Renataki's Charm of Trickery",
        "raw": "Renataki's Charm of Trickery [24532] --180--",
        "spellIds": [
          24532
        ],
        "modifiers": {
          "cooldownSec": 180
        }
      },
      {
        "id": "trinketsandracials-slayer-s-crest",
        "label": "Slayer's Crest",
        "raw": "Slayer's Crest [28777] {true} --120-- ++20++",
        "spellIds": [
          28777
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-zandalarian-hero-medallion",
        "label": "Zandalarian Hero Medallion",
        "raw": "Zandalarian Hero Medallion [24661] {true} --120-- ++20++",
        "spellIds": [
          24661
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 20
        }
      },
      {
        "id": "trinketsandracials-any-pvp-battlemaster-s",
        "label": "any PvP Battlemaster's",
        "raw": "any PvP Battlemaster's [44055] {true} --180-- ++15++",
        "spellIds": [
          44055
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 180,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-any-pvp-medallion-insignia",
        "label": "any PvP Medallion/Insignia",
        "raw": "any PvP Medallion/Insignia [42292] --120--",
        "spellIds": [
          42292
        ],
        "modifiers": {
          "cooldownSec": 120
        }
      },
      {
        "id": "trinketsandracials-talisman-of-the-horde-alliance",
        "label": "Talisman of the Horde/Alliance",
        "raw": "Talisman of the Horde/Alliance [32140,33828] --120--",
        "spellIds": [
          32140,
          33828
        ],
        "modifiers": {
          "cooldownSec": 120
        }
      },
      {
        "id": "trinketsandracials-cold-eye-basilisk",
        "label": "Cold Eye Basilisk",
        "raw": "Cold Eye Basilisk [1139]",
        "spellIds": [
          1139
        ],
        "modifiers": {}
      },
      {
        "id": "trinketsandracials-heart-of-noxxion",
        "label": "Heart of Noxxion",
        "raw": "Heart of Noxxion [21954]",
        "spellIds": [
          21954
        ],
        "modifiers": {}
      },
      {
        "id": "trinketsandracials-major-recombobulator",
        "label": "Major Recombobulator",
        "raw": "Major Recombobulator [23064]",
        "spellIds": [
          23064
        ],
        "modifiers": {}
      },
      {
        "id": "trinketsandracials-vanquished-tentacle-of-c-thun",
        "label": "Vanquished Tentacle of C'Thun",
        "raw": "Vanquished Tentacle of C'Thun [26391] --180--",
        "spellIds": [
          26391
        ],
        "modifiers": {
          "cooldownSec": 180
        }
      },
      {
        "id": "trinketsandracials-band-of-the-eternal-champion-ring",
        "label": "Band of the Eternal Champion (ring)",
        "raw": "Band of the Eternal Champion (ring) [35081] {true}",
        "spellIds": [
          35081
        ],
        "modifiers": {
          "checkAura": true
        }
      },
      {
        "id": "trinketsandracials-band-of-the-eternal-defender-ring",
        "label": "Band of the Eternal Defender (ring)",
        "raw": "Band of the Eternal Defender (ring) [35078] {true}",
        "spellIds": [
          35078
        ],
        "modifiers": {
          "checkAura": true
        }
      },
      {
        "id": "trinketsandracials-band-of-the-eternal-restorer-ring",
        "label": "Band of the Eternal Restorer (ring)",
        "raw": "Band of the Eternal Restorer (ring) [35087] {true}",
        "spellIds": [
          35087
        ],
        "modifiers": {
          "checkAura": true
        }
      },
      {
        "id": "trinketsandracials-band-of-the-eternal-sage-ring",
        "label": "Band of the Eternal Sage (ring)",
        "raw": "Band of the Eternal Sage (ring) [35084] {true}",
        "spellIds": [
          35084
        ],
        "modifiers": {
          "checkAura": true
        }
      },
      {
        "id": "trinketsandracials-forgotten-knowledge-blade-of-wizardry-weapon",
        "label": "Forgotten Knowledge (Blade of Wizardry; weapon)",
        "raw": "Forgotten Knowledge (Blade of Wizardry; weapon) [38317] {true}",
        "spellIds": [
          38317
        ],
        "modifiers": {
          "checkAura": true
        }
      },
      {
        "id": "trinketsandracials-haste-manual-crowd-pummeler-weapon",
        "label": "Haste (Manual Crowd Pummeler; weapon)",
        "raw": "Haste (Manual Crowd Pummeler; weapon) [13494]",
        "spellIds": [
          13494
        ],
        "modifiers": {}
      },
      {
        "id": "trinketsandracials-spell-blasting-wrath-of-cenarius-ring",
        "label": "Spell Blasting (Wrath of Cenarius; ring)",
        "raw": "Spell Blasting (Wrath of Cenarius; ring) [25907] {true}",
        "spellIds": [
          25907
        ],
        "modifiers": {
          "checkAura": true
        }
      },
      {
        "id": "trinketsandracials-spell-vulnerability-nightfall-weapon",
        "label": "Spell Vulnerability (Nightfall; weapon)",
        "raw": "Spell Vulnerability (Nightfall; weapon) [23605]",
        "spellIds": [
          23605
        ],
        "modifiers": {}
      },
      {
        "id": "trinketsandracials-arcane-torrent",
        "label": "Arcane Torrent",
        "raw": "Arcane Torrent [25046,28730] {true} --120-- ++2++",
        "spellIds": [
          25046,
          28730
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 2
        }
      },
      {
        "id": "trinketsandracials-berserking",
        "label": "Berserking",
        "raw": "Berserking [26635] {true} --180-- ++10++",
        "spellIds": [
          26635
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 180,
          "buffDurationSec": 10
        }
      },
      {
        "id": "trinketsandracials-blood-fury",
        "label": "Blood Fury",
        "raw": "Blood Fury [20572,33697,33702] {true} --120-- ++25++",
        "spellIds": [
          20572,
          33697,
          33702
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 120,
          "buffDurationSec": 25
        }
      },
      {
        "id": "trinketsandracials-desperate-prayer",
        "label": "Desperate Prayer",
        "raw": "Desperate Prayer [19243] --600--",
        "spellIds": [
          19243
        ],
        "modifiers": {
          "cooldownSec": 600
        }
      },
      {
        "id": "trinketsandracials-elune-s-grace",
        "label": "Elune's Grace",
        "raw": "Elune's Grace [2651] {true} --300-- ++15++",
        "spellIds": [
          2651
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 300,
          "buffDurationSec": 15
        }
      },
      {
        "id": "trinketsandracials-escape-artist",
        "label": "Escape Artist",
        "raw": "Escape Artist [20589]",
        "spellIds": [
          20589
        ],
        "modifiers": {}
      },
      {
        "id": "trinketsandracials-fear-ward",
        "label": "Fear Ward",
        "raw": "Fear Ward [6346]",
        "spellIds": [
          6346
        ],
        "modifiers": {}
      },
      {
        "id": "trinketsandracials-gift-of-the-naaru",
        "label": "Gift of the Naaru",
        "raw": "Gift of the Naaru [28880] --180--",
        "spellIds": [
          28880
        ],
        "modifiers": {
          "cooldownSec": 180
        }
      },
      {
        "id": "trinketsandracials-stoneform",
        "label": "Stoneform",
        "raw": "Stoneform [20594] {true} --180-- ++8++",
        "spellIds": [
          20594
        ],
        "modifiers": {
          "checkAura": true,
          "cooldownSec": 180,
          "buffDurationSec": 8
        }
      },
      {
        "id": "trinketsandracials-war-stomp",
        "label": "War Stomp",
        "raw": "War Stomp [20549] --120--",
        "spellIds": [
          20549
        ],
        "modifiers": {
          "cooldownSec": 120
        }
      }
    ]
  },
  {
    "section": "engineering",
    "rows": [
      {
        "id": "engineering-dense-dynamite",
        "label": "Dense Dynamite",
        "raw": "Dense Dynamite [23063]",
        "spellIds": [
          23063
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-heavy-dynamite",
        "label": "Heavy Dynamite",
        "raw": "Heavy Dynamite [4062]",
        "spellIds": [
          4062
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-arcane-bomb",
        "label": "Arcane Bomb",
        "raw": "Arcane Bomb [19821]",
        "spellIds": [
          19821
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-dark-iron-bomb",
        "label": "Dark Iron Bomb",
        "raw": "Dark Iron Bomb [19784]",
        "spellIds": [
          19784
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-fel-iron-bomb",
        "label": "Fel Iron Bomb",
        "raw": "Fel Iron Bomb [30216]",
        "spellIds": [
          30216
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-hi-explosive-bomb",
        "label": "Hi-Explosive Bomb",
        "raw": "Hi-Explosive Bomb [12543]",
        "spellIds": [
          12543
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-the-bigger-one",
        "label": "The Bigger One",
        "raw": "The Bigger One [30461]",
        "spellIds": [
          30461
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-adamantite-grenade",
        "label": "Adamantite Grenade",
        "raw": "Adamantite Grenade [30217]",
        "spellIds": [
          30217
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-frost-grenade",
        "label": "Frost Grenade",
        "raw": "Frost Grenade [39965]",
        "spellIds": [
          39965
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-iron-grenade",
        "label": "Iron Grenade",
        "raw": "Iron Grenade [4068]",
        "spellIds": [
          4068
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-thorium-grenade",
        "label": "Thorium Grenade",
        "raw": "Thorium Grenade [19769]",
        "spellIds": [
          19769
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-super-sapper-charge",
        "label": "Super Sapper Charge",
        "raw": "Super Sapper Charge [30486]",
        "spellIds": [
          30486
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-goblin-sapper-charge",
        "label": "Goblin Sapper Charge",
        "raw": "Goblin Sapper Charge [13241]",
        "spellIds": [
          13241
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-stratholme-holy-water",
        "label": "Stratholme Holy Water",
        "raw": "Stratholme Holy Water [17291]",
        "spellIds": [
          17291
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-gnomish-flame-turret",
        "label": "Gnomish Flame Turret",
        "raw": "Gnomish Flame Turret [30526]",
        "spellIds": [
          30526
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-goblin-land-mine",
        "label": "Goblin Land Mine",
        "raw": "Goblin Land Mine [4100]",
        "spellIds": [
          4100
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-target-dummy",
        "label": "Target Dummy",
        "raw": "Target Dummy [4072,19805,27661]",
        "spellIds": [
          4072,
          19805,
          27661
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-thornling-seed",
        "label": "Thornling Seed",
        "raw": "Thornling Seed [22792]",
        "spellIds": [
          22792
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-crystal-charge",
        "label": "Crystal Charge",
        "raw": "Crystal Charge [15239]",
        "spellIds": [
          15239
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-ez-thro-dynamite-ii",
        "label": "Ez-Thro Dynamite II",
        "raw": "Ez-Thro Dynamite II [23000]",
        "spellIds": [
          23000
        ],
        "modifiers": {}
      },
      {
        "id": "engineering-oil-of-immolation",
        "label": "Oil of Immolation",
        "raw": "Oil of Immolation [11350]",
        "spellIds": [
          11350
        ],
        "modifiers": {}
      }
    ]
  },
  {
    "section": "otherCasts",
    "rows": [
      {
        "id": "othercasts-dense-stone-statue",
        "label": "Dense Stone Statue",
        "raw": "Dense Stone Statue [32805]",
        "spellIds": [
          32805
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-drums-of-battle",
        "label": "Drums of Battle",
        "raw": "Drums of Battle [35476,351771,351355]",
        "spellIds": [
          35476,
          351771,
          351355
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-drums-of-panic",
        "label": "Drums of Panic",
        "raw": "Drums of Panic [35474]",
        "spellIds": [
          35474
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-drums-of-restoration",
        "label": "Drums of Restoration",
        "raw": "Drums of Restoration [35478,351769,351358]",
        "spellIds": [
          35478,
          351769,
          351358
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-drums-of-speed",
        "label": "Drums of Speed",
        "raw": "Drums of Speed [35477,351768,351359]",
        "spellIds": [
          35477,
          351768,
          351359
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-drums-of-war",
        "label": "Drums of War",
        "raw": "Drums of War [35475,351766,351360]",
        "spellIds": [
          35475,
          351766,
          351360
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-bloodthistle",
        "label": "Bloodthistle",
        "raw": "Bloodthistle [28273]",
        "spellIds": [
          28273
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-fel-blossom",
        "label": "Fel Blossom",
        "raw": "Fel Blossom [28527] ++15++",
        "spellIds": [
          28527
        ],
        "modifiers": {
          "buffDurationSec": 15
        }
      },
      {
        "id": "othercasts-flame-cap",
        "label": "Flame Cap",
        "raw": "Flame Cap [28714]",
        "spellIds": [
          28714
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-nightmare-seed",
        "label": "Nightmare Seed",
        "raw": "Nightmare Seed [28726] ++30++",
        "spellIds": [
          28726
        ],
        "modifiers": {
          "buffDurationSec": 30
        }
      },
      {
        "id": "othercasts-destruction-potion",
        "label": "Destruction Potion",
        "raw": "Destruction Potion [28508] ++15++",
        "spellIds": [
          28508
        ],
        "modifiers": {
          "buffDurationSec": 15
        }
      },
      {
        "id": "othercasts-haste-potion",
        "label": "Haste Potion",
        "raw": "Haste Potion [28507] ++15++",
        "spellIds": [
          28507
        ],
        "modifiers": {
          "buffDurationSec": 15
        }
      },
      {
        "id": "othercasts-heroic-potion",
        "label": "Heroic Potion",
        "raw": "Heroic Potion [28506] ++15++",
        "spellIds": [
          28506
        ],
        "modifiers": {
          "buffDurationSec": 15
        }
      },
      {
        "id": "othercasts-insane-strength-potion",
        "label": "Insane Strength Potion",
        "raw": "Insane Strength Potion [28494] ++15++",
        "spellIds": [
          28494
        ],
        "modifiers": {
          "buffDurationSec": 15
        }
      },
      {
        "id": "othercasts-greater-stoneshield-potion",
        "label": "Greater Stoneshield Potion",
        "raw": "Greater Stoneshield Potion [17540] ++120++",
        "spellIds": [
          17540
        ],
        "modifiers": {
          "buffDurationSec": 120
        }
      },
      {
        "id": "othercasts-ironshield-potion",
        "label": "Ironshield Potion",
        "raw": "Ironshield Potion [28515] ++120++",
        "spellIds": [
          28515
        ],
        "modifiers": {
          "buffDurationSec": 120
        }
      },
      {
        "id": "othercasts-limited-invulnerability-potion",
        "label": "Limited Invulnerability Potion",
        "raw": "Limited Invulnerability Potion [3169] ++6++",
        "spellIds": [
          3169
        ],
        "modifiers": {
          "buffDurationSec": 6
        }
      },
      {
        "id": "othercasts-living-free-action-potion",
        "label": "Living/Free Action Potion",
        "raw": "Living/Free Action Potion [6615,24364] ++30++",
        "spellIds": [
          6615,
          24364
        ],
        "modifiers": {
          "buffDurationSec": 30
        }
      },
      {
        "id": "othercasts-purification-potion",
        "label": "Purification Potion",
        "raw": "Purification Potion [17550]",
        "spellIds": [
          17550
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-sneaking-potion",
        "label": "Sneaking Potion",
        "raw": "Sneaking Potion [28492] ++60++",
        "spellIds": [
          28492
        ],
        "modifiers": {
          "buffDurationSec": 60
        }
      },
      {
        "id": "othercasts-shrouding-potion",
        "label": "Shrouding Potion",
        "raw": "Shrouding Potion [28548]",
        "spellIds": [
          28548
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-restorative-potion",
        "label": "Restorative Potion",
        "raw": "Restorative Potion [11359] ++30++",
        "spellIds": [
          11359
        ],
        "modifiers": {
          "buffDurationSec": 30
        }
      },
      {
        "id": "othercasts-great-rage-potion",
        "label": "Great Rage Potion",
        "raw": "Great Rage Potion [6613]",
        "spellIds": [
          6613
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-mighty-rage-potion",
        "label": "Mighty Rage Potion",
        "raw": "Mighty Rage Potion [17528] ++20++",
        "spellIds": [
          17528
        ],
        "modifiers": {
          "buffDurationSec": 20
        }
      },
      {
        "id": "othercasts-super-healing-potion-equivalents",
        "label": "Super Healing Potion equivalents",
        "raw": "Super Healing Potion equivalents [28495,28551,32947,41619,41620]",
        "spellIds": [
          28495,
          28551,
          32947,
          41619,
          41620
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-all-other-healing-potions",
        "label": "all other Healing Potions",
        "raw": "all other Healing Potions [439,440,2024,4042,17534,33732]",
        "spellIds": [
          439,
          440,
          2024,
          4042,
          17534,
          33732
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-fel-regeneration-potion",
        "label": "Fel Regeneration Potion",
        "raw": "Fel Regeneration Potion [38908]",
        "spellIds": [
          38908
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-super-rejuvenation-potion",
        "label": "Super Rejuvenation Potion",
        "raw": "Super Rejuvenation Potion [28517]",
        "spellIds": [
          28517
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-major-rejuvenation-potion",
        "label": "Major Rejuvenation Potion",
        "raw": "Major Rejuvenation Potion [22729]",
        "spellIds": [
          22729
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-super-mana-potion-equivalents",
        "label": "Super Mana Potion equivalents",
        "raw": "Super Mana Potion equivalents [28499,28555,32948,41617,41618]",
        "spellIds": [
          28499,
          28555,
          32948,
          41617,
          41618
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-all-other-mana-potions",
        "label": "all other Mana Potions",
        "raw": "all other Mana Potions [11903,17530,13443,17531,33733]",
        "spellIds": [
          11903,
          17530,
          13443,
          17531,
          33733
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-fel-mana-potion",
        "label": "Fel Mana Potion",
        "raw": "Fel Mana Potion [38929]",
        "spellIds": [
          38929
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-mad-alchemist-s-potion",
        "label": "Mad Alchemist's Potion",
        "raw": "Mad Alchemist's Potion [45051]",
        "spellIds": [
          45051
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-major-dreamless-sleep-potion",
        "label": "Major Dreamless Sleep Potion",
        "raw": "Major Dreamless Sleep Potion [28504] ++12++",
        "spellIds": [
          28504
        ],
        "modifiers": {
          "buffDurationSec": 12
        }
      },
      {
        "id": "othercasts-charged-crystal-focus",
        "label": "Charged Crystal Focus",
        "raw": "Charged Crystal Focus [41237]",
        "spellIds": [
          41237
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-demonic-rune-dark-rune",
        "label": "Demonic Rune/Dark Rune",
        "raw": "Demonic Rune/Dark Rune [27869,16666]",
        "spellIds": [
          27869,
          16666
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-master-major-greater-healthstone",
        "label": "Master/Major/Greater Healthstone",
        "raw": "Master/Major/Greater Healthstone [27237,27236,27235,23477,23476,23475,11732]",
        "spellIds": [
          27237,
          27236,
          27235,
          23477,
          23476,
          23475,
          11732
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-night-dragon-s-breath",
        "label": "Night Dragon's Breath",
        "raw": "Night Dragon's Breath [15701]",
        "spellIds": [
          15701
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-mana-emerald",
        "label": "Mana Emerald",
        "raw": "Mana Emerald [27103]",
        "spellIds": [
          27103
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-all-other-mana-gems",
        "label": "all other Mana Gems",
        "raw": "all other Mana Gems [5405,10052,10057,10058]",
        "spellIds": [
          5405,
          10052,
          10057,
          10058
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-thistle-tea",
        "label": "Thistle Tea",
        "raw": "Thistle Tea [9512]",
        "spellIds": [
          9512
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-whipper-root-tuber",
        "label": "Whipper Root Tuber",
        "raw": "Whipper Root Tuber [15700]",
        "spellIds": [
          15700
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-anti-venoms-and-similar",
        "label": "Anti-Venoms and similar",
        "raw": "Anti-Venoms and similar [16537,3592,23786,7932,7935]",
        "spellIds": [
          16537,
          3592,
          23786,
          7932,
          7935
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-potion-of-curing",
        "label": "Potion of Curing",
        "raw": "Potion of Curing [26677]",
        "spellIds": [
          26677
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-redcap-toadstool",
        "label": "Redcap Toadstool",
        "raw": "Redcap Toadstool [32305] ++60++",
        "spellIds": [
          32305
        ],
        "modifiers": {
          "buffDurationSec": 60
        }
      },
      {
        "id": "othercasts-heavy-netherweave-bandage",
        "label": "Heavy Netherweave Bandage",
        "raw": "Heavy Netherweave Bandage [27031]",
        "spellIds": [
          27031
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-heavy-runecloth-bandage",
        "label": "Heavy Runecloth Bandage",
        "raw": "Heavy Runecloth Bandage [18610]",
        "spellIds": [
          18610
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-gift-of-arthas-uptime",
        "label": "Gift of Arthas (uptime%)",
        "raw": "Gift of Arthas (uptime%) [11374]",
        "spellIds": [
          11374
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-lei-of-lilies",
        "label": "Lei of Lilies",
        "raw": "Lei of Lilies [18832]",
        "spellIds": [
          18832
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-flask-of-petrification",
        "label": "Flask of Petrification",
        "raw": "Flask of Petrification [17624]",
        "spellIds": [
          17624
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-magic-dust",
        "label": "Magic Dust",
        "raw": "Magic Dust [1090]",
        "spellIds": [
          1090
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-netherweave-net",
        "label": "Netherweave Net",
        "raw": "Netherweave Net [31367]",
        "spellIds": [
          31367
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-scourgebane-draught",
        "label": "Scourgebane Draught",
        "raw": "Scourgebane Draught [28486]",
        "spellIds": [
          28486
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-scourgebane-infusion",
        "label": "Scourgebane Infusion",
        "raw": "Scourgebane Infusion [28488]",
        "spellIds": [
          28488
        ],
        "modifiers": {}
      },
      {
        "id": "othercasts-snowball",
        "label": "Snowball",
        "raw": "Snowball [21343]",
        "spellIds": [
          21343
        ],
        "modifiers": {}
      }
    ]
  },
  {
    "section": "absorbs",
    "rows": [
      {
        "id": "absorbs-nature-absorption",
        "label": "Nature Absorption",
        "raw": "Nature Absorption [30999]",
        "spellIds": [
          30999
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-major-nature-protection-potion",
        "label": "Major Nature Protection Potion",
        "raw": "Major Nature Protection Potion [28513]",
        "spellIds": [
          28513
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-greater-nature-protection-potion",
        "label": "Greater Nature Protection Potion",
        "raw": "Greater Nature Protection Potion [17546]",
        "spellIds": [
          17546
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-nature-protection-potion",
        "label": "Nature Protection Potion",
        "raw": "Nature Protection Potion [7254]",
        "spellIds": [
          7254
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-arcane-absorption",
        "label": "Arcane Absorption",
        "raw": "Arcane Absorption [31002]",
        "spellIds": [
          31002
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-major-arcane-protection-potion",
        "label": "Major Arcane Protection Potion",
        "raw": "Major Arcane Protection Potion [28536]",
        "spellIds": [
          28536
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-greater-arcane-protection-potion",
        "label": "Greater Arcane Protection Potion",
        "raw": "Greater Arcane Protection Potion [17549]",
        "spellIds": [
          17549
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-fire-absorption",
        "label": "Fire Absorption",
        "raw": "Fire Absorption [30997]",
        "spellIds": [
          30997
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-major-fire-protection-potion",
        "label": "Major Fire Protection Potion",
        "raw": "Major Fire Protection Potion [28511]",
        "spellIds": [
          28511
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-greater-fire-protection-potion",
        "label": "Greater Fire Protection Potion",
        "raw": "Greater Fire Protection Potion [17543]",
        "spellIds": [
          17543
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-fire-protection-potion",
        "label": "Fire Protection Potion",
        "raw": "Fire Protection Potion [7233]",
        "spellIds": [
          7233
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-fire-ward-not-max-rank-rank-1-5",
        "label": "Fire Ward NOT MAX RANK (rank 1-5)",
        "raw": "Fire Ward NOT MAX RANK (rank 1-5) [543,8457,8458,10223,10225]",
        "spellIds": [
          543,
          8457,
          8458,
          10223,
          10225
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-fire-ward-rank-6",
        "label": "Fire Ward (rank 6)",
        "raw": "Fire Ward (rank 6) [27128]",
        "spellIds": [
          27128
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-frozen-rune",
        "label": "Frozen Rune",
        "raw": "Frozen Rune [29432]",
        "spellIds": [
          29432
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-frost-absorption",
        "label": "Frost Absorption",
        "raw": "Frost Absorption [30994]",
        "spellIds": [
          30994
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-major-frost-protection-potion",
        "label": "Major Frost Protection Potion",
        "raw": "Major Frost Protection Potion [28512]",
        "spellIds": [
          28512
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-greater-frost-protection-potion",
        "label": "Greater Frost Protection Potion",
        "raw": "Greater Frost Protection Potion [17544]",
        "spellIds": [
          17544
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-frost-protection-potion",
        "label": "Frost Protection Potion",
        "raw": "Frost Protection Potion [7239]",
        "spellIds": [
          7239
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-frost-ward-not-max-rank-rank-1-5",
        "label": "Frost Ward NOT MAX RANK (rank 1-5)",
        "raw": "Frost Ward NOT MAX RANK (rank 1-5) [6143,8461,8462,10177,28609]",
        "spellIds": [
          6143,
          8461,
          8462,
          10177,
          28609
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-frost-ward-rank-6",
        "label": "Frost Ward (rank 6)",
        "raw": "Frost Ward (rank 6) [32796]",
        "spellIds": [
          32796
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-ice-barrier",
        "label": "Ice Barrier",
        "raw": "Ice Barrier [33405]",
        "spellIds": [
          33405
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-ice-deflector",
        "label": "Ice Deflector",
        "raw": "Ice Deflector [4077]",
        "spellIds": [
          4077
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-major-holy-protection-potion",
        "label": "Major Holy Protection Potion",
        "raw": "Major Holy Protection Potion [28538]",
        "spellIds": [
          28538
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-shadow-absorption",
        "label": "Shadow Absorption",
        "raw": "Shadow Absorption [31000]",
        "spellIds": [
          31000
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-major-shadow-protection-potion",
        "label": "Major Shadow Protection Potion",
        "raw": "Major Shadow Protection Potion [28537]",
        "spellIds": [
          28537
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-greater-shadow-protection-potion",
        "label": "Greater Shadow Protection Potion",
        "raw": "Greater Shadow Protection Potion [17548]",
        "spellIds": [
          17548
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-shadow-protection-potion",
        "label": "Shadow Protection Potion",
        "raw": "Shadow Protection Potion [7242]",
        "spellIds": [
          7242
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-shadow-ward-not-max-rank-rank-1-3",
        "label": "Shadow Ward NOT MAX RANK (rank 1-3)",
        "raw": "Shadow Ward NOT MAX RANK (rank 1-3) [6229,11739,11740]",
        "spellIds": [
          6229,
          11739,
          11740
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-shadow-ward-rank-4",
        "label": "Shadow Ward (rank 4)",
        "raw": "Shadow Ward (rank 4) [28610]",
        "spellIds": [
          28610
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-voidwalker-sacrifice",
        "label": "Voidwalker Sacrifice",
        "raw": "Voidwalker Sacrifice [697]",
        "spellIds": [
          697
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-mana-shield",
        "label": "Mana Shield",
        "raw": "Mana Shield [27131]",
        "spellIds": [
          27131
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-power-word-shield",
        "label": "Power Word: Shield",
        "raw": "Power Word: Shield [17,592,600,3747,6065,6066,10898,10899,10900,10901,25217,25218]",
        "spellIds": [
          17,
          592,
          600,
          3747,
          6065,
          6066,
          10898,
          10899,
          10900,
          10901,
          25217,
          25218
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-greater-ward-of-shielding",
        "label": "Greater Ward of Shielding",
        "raw": "Greater Ward of Shielding [29719]",
        "spellIds": [
          29719
        ],
        "modifiers": {}
      },
      {
        "id": "absorbs-greater-rune-of-warding",
        "label": "Greater Rune of Warding",
        "raw": "Greater Rune of Warding [42137]",
        "spellIds": [
          42137
        ],
        "modifiers": {}
      }
    ]
  },
  {
    "section": "Druid:singleTargetCasts",
    "rows": [
      {
        "id": "druid-singletargetcasts-faerie-fire-uptime",
        "label": "Faerie Fire (uptime%)",
        "raw": "Faerie Fire (uptime%) [770*,778*,9749*,9907*,26993] {1.5}",
        "spellIds": [
          770,
          778,
          9749,
          9907,
          26993
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-faerie-fire-feral-uptime",
        "label": "Faerie Fire (Feral) (uptime%)",
        "raw": "Faerie Fire (Feral) (uptime%) [16857*,17390*,17391*,17392*,27011] {1.5}",
        "spellIds": [
          16857,
          17390,
          17391,
          17392,
          27011
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-entangling-roots",
        "label": "Entangling Roots",
        "raw": "Entangling Roots [339*,1062*,5195*,5196*,9852*,9853*,26989] {1.5}",
        "spellIds": [
          339,
          1062,
          5195,
          5196,
          9852,
          9853,
          26989
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-cyclone",
        "label": "Cyclone",
        "raw": "Cyclone [33786] {1.5}",
        "spellIds": [
          33786
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-insect-swarm-uptime",
        "label": "Insect Swarm (uptime%)",
        "raw": "Insect Swarm (uptime%) [5570*,24974*,24975*,24976*,24977*,27013] {1.5}",
        "spellIds": [
          5570,
          24974,
          24975,
          24976,
          24977,
          27013
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-moonfire-uptime",
        "label": "Moonfire (uptime%)",
        "raw": "Moonfire (uptime%) [8921*,8924*,8925*,8926*,8927*,8928*,8929*,9833*,9834*,9835*,26987*,26988] {1.5}",
        "spellIds": [
          8921,
          8924,
          8925,
          8926,
          8927,
          8928,
          8929,
          9833,
          9834,
          9835,
          26987,
          26988
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-starfire",
        "label": "Starfire",
        "raw": "Starfire [2912*,8949*,8950*,8951*,9875*,9876*,25298*,26986] {3.5}",
        "spellIds": [
          2912,
          8949,
          8950,
          8951,
          9875,
          9876,
          25298,
          26986
        ],
        "modifiers": {
          "baseCastTime": 3.5
        }
      },
      {
        "id": "druid-singletargetcasts-thorns",
        "label": "Thorns",
        "raw": "Thorns [467*,782*,1075*,8914*,9756*,9910*,26992] {1.5}",
        "spellIds": [
          467,
          782,
          1075,
          8914,
          9756,
          9910,
          26992
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-wrath",
        "label": "Wrath",
        "raw": "Wrath [5176*,5177*,5178*,5179*,5180*,6780*,8905*,9912*,26984*,26985] {2}",
        "spellIds": [
          5176,
          5177,
          5178,
          5179,
          5180,
          6780,
          8905,
          9912,
          26984,
          26985
        ],
        "modifiers": {
          "baseCastTime": 2
        }
      },
      {
        "id": "druid-singletargetcasts-hibernate",
        "label": "Hibernate",
        "raw": "Hibernate [2637,18657,18658] {1.5}",
        "spellIds": [
          2637,
          18657,
          18658
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-abolish-poison",
        "label": "Abolish Poison",
        "raw": "Abolish Poison [2893] {1.5}",
        "spellIds": [
          2893
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-cure-poison",
        "label": "Cure Poison",
        "raw": "Cure Poison [8946] {1.5}",
        "spellIds": [
          8946
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-remove-curse",
        "label": "Remove Curse",
        "raw": "Remove Curse [2782] {1.5}",
        "spellIds": [
          2782
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-gift-of-the-wild-mark-of-the-wild",
        "label": "Gift of the Wild/Mark of the Wild",
        "raw": "Gift of the Wild/Mark of the Wild [1126*,5232*,6756*,5234*,8907*,9884*,21849*,21850*,9885*,26991,26990] {1.5}",
        "spellIds": [
          1126,
          5232,
          6756,
          5234,
          8907,
          9884,
          21849,
          21850,
          9885,
          26991,
          26990
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-healing-touch-rank-13-overheal",
        "label": "Healing Touch (rank 13) (overheal%)",
        "raw": "Healing Touch (rank 13) (overheal%) [26979] {2.5}",
        "spellIds": [
          26979
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      },
      {
        "id": "druid-singletargetcasts-healing-touch-rank-7-12-overheal",
        "label": "Healing Touch (rank 7-12) (overheal%)",
        "raw": "Healing Touch (rank 7-12) (overheal%) [8903,9758,9888,9889,25297,26978] {2.5}",
        "spellIds": [
          8903,
          9758,
          9888,
          9889,
          25297,
          26978
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      },
      {
        "id": "druid-singletargetcasts-healing-touch-rank-1-6-overheal",
        "label": "Healing Touch (rank 1-6) (overheal%)",
        "raw": "Healing Touch (rank 1-6) (overheal%) [5185,5186,5187,5188, 5189,6778] {2.5}",
        "spellIds": [
          5185,
          5186,
          5187,
          5188,
          5189,
          6778
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      },
      {
        "id": "druid-singletargetcasts-lifebloom",
        "label": "Lifebloom",
        "raw": "Lifebloom [33763] {1.5}",
        "spellIds": [
          33763
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-regrowth-rank-10-overheal",
        "label": "Regrowth (rank 10) (overheal%)",
        "raw": "Regrowth (rank 10) (overheal%) [26980] {2}",
        "spellIds": [
          26980
        ],
        "modifiers": {
          "baseCastTime": 2
        }
      },
      {
        "id": "druid-singletargetcasts-regrowth-rank-5-9-overheal",
        "label": "Regrowth (rank 5-9) (overheal%)",
        "raw": "Regrowth (rank 5-9) (overheal%) [8941,9750,9856,9857,9858] {2}",
        "spellIds": [
          8941,
          9750,
          9856,
          9857,
          9858
        ],
        "modifiers": {
          "baseCastTime": 2
        }
      },
      {
        "id": "druid-singletargetcasts-regrowth-rank-1-4-overheal",
        "label": "Regrowth (rank 1-4) (overheal%)",
        "raw": "Regrowth (rank 1-4) (overheal%) [8936,8938,8939,8940] {2}",
        "spellIds": [
          8936,
          8938,
          8939,
          8940
        ],
        "modifiers": {
          "baseCastTime": 2
        }
      },
      {
        "id": "druid-singletargetcasts-rejuvenation-rank-13-overheal",
        "label": "Rejuvenation (rank 13) (overheal%)",
        "raw": "Rejuvenation (rank 13) (overheal%) [26982] {1.5}",
        "spellIds": [
          26982
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-rejuvenation-rank-7-12-overheal",
        "label": "Rejuvenation (rank 7-12) (overheal%)",
        "raw": "Rejuvenation (rank 7-12) (overheal%) [8910,9839,9840,9841,25299,26981] {1.5}",
        "spellIds": [
          8910,
          9839,
          9840,
          9841,
          25299,
          26981
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-rejuvenation-rank-1-6-overheal",
        "label": "Rejuvenation (rank 1-6) (overheal%)",
        "raw": "Rejuvenation (rank 1-6) (overheal%) [774,1058,1430,2090,2091,3627] {1.5}",
        "spellIds": [
          774,
          1058,
          1430,
          2090,
          2091,
          3627
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-swiftmend-overheal",
        "label": "Swiftmend  (overheal%)",
        "raw": "Swiftmend [18562] (overheal%) {1.5}",
        "spellIds": [
          18562
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-melee-excluded-from-activity",
        "label": "Melee - excluded from activity",
        "raw": "Melee - excluded from activity [1] {0}",
        "spellIds": [
          1
        ],
        "modifiers": {
          "baseCastTime": 0
        }
      },
      {
        "id": "druid-singletargetcasts-bear-form",
        "label": "Bear Form",
        "raw": "Bear Form [5487] {1.5}",
        "spellIds": [
          5487
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-cat-form",
        "label": "Cat Form",
        "raw": "Cat Form [768] {1.5}",
        "spellIds": [
          768
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-dire-bear-form",
        "label": "Dire Bear Form",
        "raw": "Dire Bear Form [9634] {1.5}",
        "spellIds": [
          9634
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-moonkin-form",
        "label": "Moonkin Form",
        "raw": "Moonkin Form [24858] {1.5}",
        "spellIds": [
          24858
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-tree-of-life",
        "label": "Tree of Life",
        "raw": "Tree of Life [33891] {1.5}",
        "spellIds": [
          33891
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-bash",
        "label": "Bash",
        "raw": "Bash [5211*,6798*,8983] {1.5}",
        "spellIds": [
          5211,
          6798,
          8983
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-claw",
        "label": "Claw",
        "raw": "Claw [1082*,3029*,5201*,9849*,9850*,27000] {1}",
        "spellIds": [
          1082,
          3029,
          5201,
          9849,
          9850,
          27000
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "druid-singletargetcasts-cower",
        "label": "Cower",
        "raw": "Cower [8998*,9000*,9892*,27004,31709*] {1}",
        "spellIds": [
          8998,
          9000,
          9892,
          27004,
          31709
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "druid-singletargetcasts-demoralizing-roar",
        "label": "Demoralizing Roar",
        "raw": "Demoralizing Roar [99*,1735*,9490*,9747*,9898*,26998] {1.5}",
        "spellIds": [
          99,
          1735,
          9490,
          9747,
          9898,
          26998
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-enrage",
        "label": "Enrage",
        "raw": "Enrage [5229] {0.5}",
        "spellIds": [
          5229
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      },
      {
        "id": "druid-singletargetcasts-ferocious-bite",
        "label": "Ferocious Bite",
        "raw": "Ferocious Bite [22568*,22827*,22828*,31018*,22829*,24248] {1}",
        "spellIds": [
          22568,
          22827,
          22828,
          31018,
          22829,
          24248
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "druid-singletargetcasts-growl",
        "label": "Growl",
        "raw": "Growl [6795] {0.5}",
        "spellIds": [
          6795
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      },
      {
        "id": "druid-singletargetcasts-lacerate",
        "label": "Lacerate",
        "raw": "Lacerate [33745] {1}",
        "spellIds": [
          33745
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "druid-singletargetcasts-maim",
        "label": "Maim",
        "raw": "Maim [22570] {1}",
        "spellIds": [
          22570
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "druid-singletargetcasts-mangle-bear",
        "label": "Mangle (Bear)",
        "raw": "Mangle (Bear) [33878*,33986*,33987] {1}",
        "spellIds": [
          33878,
          33986,
          33987
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "druid-singletargetcasts-mangle-cat",
        "label": "Mangle (Cat)",
        "raw": "Mangle (Cat) [33876*,33982*,33983] {1}",
        "spellIds": [
          33876,
          33982,
          33983
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "druid-singletargetcasts-maul",
        "label": "Maul",
        "raw": "Maul [6807*,6808*,6809*,8972*,9745*,9880*,9881*,26996] {0.5}",
        "spellIds": [
          6807,
          6808,
          6809,
          8972,
          9745,
          9880,
          9881,
          26996
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      },
      {
        "id": "druid-singletargetcasts-pounce",
        "label": "Pounce",
        "raw": "Pounce [9005*,9823*,9827*,27006] {1}",
        "spellIds": [
          9005,
          9823,
          9827,
          27006
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "druid-singletargetcasts-prowl",
        "label": "Prowl",
        "raw": "Prowl [5215*,6783*,9913] {0.5}",
        "spellIds": [
          5215,
          6783,
          9913
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      },
      {
        "id": "druid-singletargetcasts-rake",
        "label": "Rake",
        "raw": "Rake [1822*,1823*,1824*,9904*,27003] {1}",
        "spellIds": [
          1822,
          1823,
          1824,
          9904,
          27003
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "druid-singletargetcasts-ravage",
        "label": "Ravage",
        "raw": "Ravage [6785*,6787*,9866*,9867*,27005] {1}",
        "spellIds": [
          6785,
          6787,
          9866,
          9867,
          27005
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "druid-singletargetcasts-rip",
        "label": "Rip",
        "raw": "Rip [1079*,9492*,9493*,9752*,9894*,9896*,27008] {1}",
        "spellIds": [
          1079,
          9492,
          9493,
          9752,
          9894,
          9896,
          27008
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "druid-singletargetcasts-shred",
        "label": "Shred",
        "raw": "Shred [5221*,6800*,8992*,9829*,9830*,27001*,27002] {1}",
        "spellIds": [
          5221,
          6800,
          8992,
          9829,
          9830,
          27001,
          27002
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "druid-singletargetcasts-swipe",
        "label": "Swipe",
        "raw": "Swipe [779*,780*,769*,9754*,9908*,26997] {1.5}",
        "spellIds": [
          779,
          780,
          769,
          9754,
          9908,
          26997
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "druid-singletargetcasts-thrash-cat",
        "label": "Thrash (Cat)",
        "raw": "Thrash (Cat) [417437] {0.5}",
        "spellIds": [
          417437
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      },
      {
        "id": "druid-singletargetcasts-tiger-s-fury",
        "label": "Tiger's Fury",
        "raw": "Tiger's Fury [5217*,6793*,9845*,9846] {0.5}",
        "spellIds": [
          5217,
          6793,
          9845,
          9846
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      }
    ]
  },
  {
    "section": "Druid:aoeCasts",
    "rows": [
      {
        "id": "druid-aoecasts-hurricane",
        "label": "Hurricane",
        "raw": "Hurricane [16914*,17401*,17402*,27012] {5}",
        "spellIds": [
          16914,
          17401,
          17402,
          27012
        ],
        "modifiers": {
          "baseCastTime": 5
        }
      }
    ]
  },
  {
    "section": "Druid:classCooldowns",
    "rows": [
      {
        "id": "druid-classcooldowns-blessing-of-protection",
        "label": "Blessing of Protection",
        "raw": "Blessing of Protection [10278] --300--",
        "spellIds": [
          10278
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      },
      {
        "id": "druid-classcooldowns-bloodlust",
        "label": "Bloodlust",
        "raw": "Bloodlust [2825] --600-- ++40++",
        "spellIds": [
          2825
        ],
        "modifiers": {
          "cooldownSec": 600,
          "buffDurationSec": 40
        }
      },
      {
        "id": "druid-classcooldowns-heroism",
        "label": "Heroism",
        "raw": "Heroism [32182] --600-- ++40++",
        "spellIds": [
          32182
        ],
        "modifiers": {
          "cooldownSec": 600,
          "buffDurationSec": 40
        }
      },
      {
        "id": "druid-classcooldowns-innervate",
        "label": "Innervate",
        "raw": "Innervate [29166] --360-- ++20++",
        "spellIds": [
          29166
        ],
        "modifiers": {
          "cooldownSec": 360,
          "buffDurationSec": 20
        }
      },
      {
        "id": "druid-classcooldowns-barkskin",
        "label": "Barkskin",
        "raw": "Barkskin [22812] --60--",
        "spellIds": [
          22812
        ],
        "modifiers": {
          "cooldownSec": 60
        }
      },
      {
        "id": "druid-classcooldowns-challenging-roar",
        "label": "Challenging Roar",
        "raw": "Challenging Roar [5209] --600--",
        "spellIds": [
          5209
        ],
        "modifiers": {
          "cooldownSec": 600
        }
      },
      {
        "id": "druid-classcooldowns-dash",
        "label": "Dash",
        "raw": "Dash [33357] --300-- ++15++",
        "spellIds": [
          33357
        ],
        "modifiers": {
          "cooldownSec": 300,
          "buffDurationSec": 15
        }
      },
      {
        "id": "druid-classcooldowns-force-of-nature",
        "label": "Force of Nature",
        "raw": "Force of Nature [33831] --180--",
        "spellIds": [
          33831
        ],
        "modifiers": {
          "cooldownSec": 180
        }
      },
      {
        "id": "druid-classcooldowns-frenzied-regeneration",
        "label": "Frenzied Regeneration",
        "raw": "Frenzied Regeneration [26999] --180--",
        "spellIds": [
          26999
        ],
        "modifiers": {
          "cooldownSec": 180
        }
      },
      {
        "id": "druid-classcooldowns-nature-s-swiftness",
        "label": "Nature's Swiftness",
        "raw": "Nature's Swiftness [17116] --180--",
        "spellIds": [
          17116
        ],
        "modifiers": {
          "cooldownSec": 180
        }
      },
      {
        "id": "druid-classcooldowns-rebirth",
        "label": "Rebirth",
        "raw": "Rebirth [20484*,20739*,20742*,20747*,20748*,26994] --1800--",
        "spellIds": [
          20484,
          20739,
          20742,
          20747,
          20748,
          26994
        ],
        "modifiers": {
          "cooldownSec": 1800
        }
      },
      {
        "id": "druid-classcooldowns-tranquility",
        "label": "Tranquility",
        "raw": "Tranquility [9863*,26983] --300--",
        "spellIds": [
          9863,
          26983
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      }
    ]
  },
  {
    "section": "Hunter:singleTargetCasts",
    "rows": [
      {
        "id": "hunter-singletargetcasts-aimed-shot",
        "label": "Aimed Shot",
        "raw": "Aimed Shot [19434*,20900*,20901*,20902*,20903*,20904*,27065] {1.5}",
        "spellIds": [
          19434,
          20900,
          20901,
          20902,
          20903,
          20904,
          27065
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-arcane-shot",
        "label": "Arcane Shot",
        "raw": "Arcane Shot [3044,14281*,14282*,14283*,14284*,14285*,14286*,14287*,27019] {1.5}",
        "spellIds": [
          3044,
          14281,
          14282,
          14283,
          14284,
          14285,
          14286,
          14287,
          27019
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-concussive-shot",
        "label": "Concussive Shot",
        "raw": "Concussive Shot [5116] {1.5}",
        "spellIds": [
          5116
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-distracting-shot",
        "label": "Distracting Shot",
        "raw": "Distracting Shot [20736,14274*,15629*,15630*,15631*,15632*,27020] {1.5}",
        "spellIds": [
          20736,
          14274,
          15629,
          15630,
          15631,
          15632,
          27020
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-growl",
        "label": "Growl",
        "raw": "Growl [14923*,14924*,14925*,14926*,14927] {0.5}",
        "spellIds": [
          14923,
          14924,
          14925,
          14926,
          14927
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      },
      {
        "id": "hunter-singletargetcasts-kill-command",
        "label": "Kill Command",
        "raw": "Kill Command [34026] {1.5}",
        "spellIds": [
          34026
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-misdirection",
        "label": "Misdirection",
        "raw": "Misdirection [34477] {1.5}",
        "spellIds": [
          34477
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-mongoose-bite",
        "label": "Mongoose Bite",
        "raw": "Mongoose Bite [1495*,14269*,14270*,14271*,36916] {1.5}",
        "spellIds": [
          1495,
          14269,
          14270,
          14271,
          36916
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-raptor-strike",
        "label": "Raptor Strike",
        "raw": "Raptor Strike [2973*,14260*,14261*,14262*,14263*,14264*,14265*,14266*,27014] {1.5}",
        "spellIds": [
          2973,
          14260,
          14261,
          14262,
          14263,
          14264,
          14265,
          14266,
          27014
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-scorpid-sting-uptime",
        "label": "Scorpid Sting (uptime%)",
        "raw": "Scorpid Sting (uptime%) [3043] {1.5}",
        "spellIds": [
          3043
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-serpent-sting",
        "label": "Serpent Sting",
        "raw": "Serpent Sting [1978*,13549*,13550*,13551*,13552*,13553*,13554*,13555*,25295*,27016] {1.5}",
        "spellIds": [
          1978,
          13549,
          13550,
          13551,
          13552,
          13553,
          13554,
          13555,
          25295,
          27016
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-silencing-shot",
        "label": "Silencing Shot",
        "raw": "Silencing Shot [34490] {1.5}",
        "spellIds": [
          34490
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-steady-shot",
        "label": "Steady Shot",
        "raw": "Steady Shot [34120] {1.5}",
        "spellIds": [
          34120
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-tranquilizing-shot",
        "label": "Tranquilizing Shot",
        "raw": "Tranquilizing Shot [19801] {1.5}",
        "spellIds": [
          19801
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-viper-sting",
        "label": "Viper Sting",
        "raw": "Viper Sting [3034*,14279*,14280*,27018] {1.5}",
        "spellIds": [
          3034,
          14279,
          14280,
          27018
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-wing-clip",
        "label": "Wing Clip",
        "raw": "Wing Clip [2974*,14267*,14268] {1.5}",
        "spellIds": [
          2974,
          14267,
          14268
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-wyvern-sting",
        "label": "Wyvern Sting",
        "raw": "Wyvern Sting [19386*,24132*,24133*,27068] {1.5}",
        "spellIds": [
          19386,
          24132,
          24133,
          27068
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-aspect-of-the-beast",
        "label": "Aspect of the Beast",
        "raw": "Aspect of the Beast [13161] {1.5}",
        "spellIds": [
          13161
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-aspect-of-the-cheetah",
        "label": "Aspect of the Cheetah",
        "raw": "Aspect of the Cheetah [5118] {1.5}",
        "spellIds": [
          5118
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-aspect-of-the-hawk",
        "label": "Aspect of the Hawk",
        "raw": "Aspect of the Hawk [13165*,14318*,14319*,14320*,14321*,14322*,25296*,27044] {1.5}",
        "spellIds": [
          13165,
          14318,
          14319,
          14320,
          14321,
          14322,
          25296,
          27044
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-aspect-of-the-monkey",
        "label": "Aspect of the Monkey",
        "raw": "Aspect of the Monkey [13163] {1.5}",
        "spellIds": [
          13163
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-aspect-of-the-pack",
        "label": "Aspect of the Pack",
        "raw": "Aspect of the Pack [13159] {1.5}",
        "spellIds": [
          13159
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-aspect-of-the-viper",
        "label": "Aspect of the Viper",
        "raw": "Aspect of the Viper [34074] {1.5}",
        "spellIds": [
          34074
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-aspect-of-the-wild",
        "label": "Aspect of the Wild",
        "raw": "Aspect of the Wild [20043*,20190*,27045] {1.5}",
        "spellIds": [
          20043,
          20190,
          27045
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-disengage",
        "label": "Disengage",
        "raw": "Disengage [781*,14272*,14273*,27015] {1.5}",
        "spellIds": [
          781,
          14272,
          14273,
          27015
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-dismiss-pet",
        "label": "Dismiss Pet",
        "raw": "Dismiss Pet [2641] {1.5}",
        "spellIds": [
          2641
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-eagle-eye",
        "label": "Eagle Eye",
        "raw": "Eagle Eye [6197] {1.5}",
        "spellIds": [
          6197
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-eyes-of-the-beast",
        "label": "Eyes of the Beast",
        "raw": "Eyes of the Beast [1002] {2}",
        "spellIds": [
          1002
        ],
        "modifiers": {
          "baseCastTime": 2
        }
      },
      {
        "id": "hunter-singletargetcasts-flare",
        "label": "Flare",
        "raw": "Flare [1543] {1.5}",
        "spellIds": [
          1543
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-hunter-s-mark-uptime",
        "label": "Hunter's Mark (uptime%)",
        "raw": "Hunter's Mark (uptime%) [1130*,14323*,14324*,14325] {1.5}",
        "spellIds": [
          1130,
          14323,
          14324,
          14325
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-mend-pet",
        "label": "Mend Pet",
        "raw": "Mend Pet [136*,3111*,3661*,3662*,13542*,13543*,13544*,27046] {2.5}",
        "spellIds": [
          136,
          3111,
          3661,
          3662,
          13542,
          13543,
          13544,
          27046
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      },
      {
        "id": "hunter-singletargetcasts-revive-pet",
        "label": "Revive Pet",
        "raw": "Revive Pet [982] {10}",
        "spellIds": [
          982
        ],
        "modifiers": {
          "baseCastTime": 10
        }
      },
      {
        "id": "hunter-singletargetcasts-trueshot-aura",
        "label": "Trueshot Aura",
        "raw": "Trueshot Aura [19506*,20905*,20906*,27066] {1.5}",
        "spellIds": [
          19506,
          20905,
          20906,
          27066
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-singletargetcasts-auto-shot-expose-weakness-uptime",
        "label": "Auto Shot (Expose Weakness uptime%)",
        "raw": "Auto Shot (Expose Weakness uptime%) [75] {0}",
        "spellIds": [
          75
        ],
        "modifiers": {
          "baseCastTime": 0
        }
      },
      {
        "id": "hunter-singletargetcasts-melee-excl-from-activity",
        "label": "Melee - excl. from activity",
        "raw": "Melee - excl. from activity [1] {0}",
        "spellIds": [
          1
        ],
        "modifiers": {
          "baseCastTime": 0
        }
      }
    ]
  },
  {
    "section": "Hunter:aoeCasts",
    "rows": [
      {
        "id": "hunter-aoecasts-multi-shot",
        "label": "Multi-Shot",
        "raw": "Multi-Shot [2643*,14288*,14289*,14290*,25294*,27021] {1.5}",
        "spellIds": [
          2643,
          14288,
          14289,
          14290,
          25294,
          27021
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-aoecasts-volley",
        "label": "Volley",
        "raw": "Volley [1510*,14294*,14295*,27022] {3}",
        "spellIds": [
          1510,
          14294,
          14295,
          27022
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      },
      {
        "id": "hunter-aoecasts-explosive-trap",
        "label": "Explosive Trap",
        "raw": "Explosive Trap [13813*,14316*,14317*,27025] {1.5}",
        "spellIds": [
          13813,
          14316,
          14317,
          27025
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-aoecasts-freezing-trap",
        "label": "Freezing Trap",
        "raw": "Freezing Trap [1499*,14310*,14311] {1.5}",
        "spellIds": [
          1499,
          14310,
          14311
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-aoecasts-frost-trap",
        "label": "Frost Trap",
        "raw": "Frost Trap [13809] {1.5}",
        "spellIds": [
          13809
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-aoecasts-immolation-trap",
        "label": "Immolation Trap",
        "raw": "Immolation Trap [13795*,14302*,14303*,14304*,14305*,27023] {1.5}",
        "spellIds": [
          13795,
          14302,
          14303,
          14304,
          14305,
          27023
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "hunter-aoecasts-snake-trap",
        "label": "Snake Trap",
        "raw": "Snake Trap [34600] {1.5}",
        "spellIds": [
          34600
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      }
    ]
  },
  {
    "section": "Hunter:classCooldowns",
    "rows": [
      {
        "id": "hunter-classcooldowns-blessing-of-protection",
        "label": "Blessing of Protection",
        "raw": "Blessing of Protection [10278] --300--",
        "spellIds": [
          10278
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      },
      {
        "id": "hunter-classcooldowns-bloodlust",
        "label": "Bloodlust",
        "raw": "Bloodlust [2825] --600-- ++40++",
        "spellIds": [
          2825
        ],
        "modifiers": {
          "cooldownSec": 600,
          "buffDurationSec": 40
        }
      },
      {
        "id": "hunter-classcooldowns-heroism",
        "label": "Heroism",
        "raw": "Heroism [32182] --600-- ++40++",
        "spellIds": [
          32182
        ],
        "modifiers": {
          "cooldownSec": 600,
          "buffDurationSec": 40
        }
      },
      {
        "id": "hunter-classcooldowns-innervate",
        "label": "Innervate",
        "raw": "Innervate [29166] --360-- ++20++",
        "spellIds": [
          29166
        ],
        "modifiers": {
          "cooldownSec": 360,
          "buffDurationSec": 20
        }
      },
      {
        "id": "hunter-classcooldowns-bestial-wrath",
        "label": "Bestial Wrath",
        "raw": "Bestial Wrath [19574] --120-- ++18++",
        "spellIds": [
          19574
        ],
        "modifiers": {
          "cooldownSec": 120,
          "buffDurationSec": 18
        }
      },
      {
        "id": "hunter-classcooldowns-deterrence",
        "label": "Deterrence",
        "raw": "Deterrence [19263] --300-- ++10++",
        "spellIds": [
          19263
        ],
        "modifiers": {
          "cooldownSec": 300,
          "buffDurationSec": 10
        }
      },
      {
        "id": "hunter-classcooldowns-rapid-fire",
        "label": "Rapid Fire",
        "raw": "Rapid Fire [3045] --180-- ++15++",
        "spellIds": [
          3045
        ],
        "modifiers": {
          "cooldownSec": 180,
          "buffDurationSec": 15
        }
      },
      {
        "id": "hunter-classcooldowns-readiness",
        "label": "Readiness",
        "raw": "Readiness [23989] --300--",
        "spellIds": [
          23989
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      }
    ]
  },
  {
    "section": "Mage:singleTargetCasts",
    "rows": [
      {
        "id": "mage-singletargetcasts-arcane-blast",
        "label": "Arcane Blast",
        "raw": "Arcane Blast [30451] {2}",
        "spellIds": [
          30451
        ],
        "modifiers": {
          "baseCastTime": 2
        }
      },
      {
        "id": "mage-singletargetcasts-arcane-brilliance-arcane-intellect",
        "label": "Arcane Brilliance/Arcane Intellect",
        "raw": "Arcane Brilliance/Arcane Intellect [1459*,1460*,1461*,10156*,23028*,10157*,27126,27127] {1.5}",
        "spellIds": [
          1459,
          1460,
          1461,
          10156,
          23028,
          10157,
          27126,
          27127
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-singletargetcasts-arcane-missiles",
        "label": "Arcane Missiles",
        "raw": "Arcane Missiles [25346*,10274*,7268*,7269*,7270*,8418*,8419*,10273*,27076*,38700] {1}",
        "spellIds": [
          25346,
          10274,
          7268,
          7269,
          7270,
          8418,
          8419,
          10273,
          27076,
          38700
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "mage-singletargetcasts-armor",
        "label": "Armor",
        "raw": "Armor [6117*,22782*,22783*,27124,27125,30482,7302*,7320*,10219*,10220*,168*,7300*,7301*] {1.5}",
        "spellIds": [
          6117,
          22782,
          22783,
          27124,
          27125,
          30482,
          7302,
          7320,
          10219,
          10220,
          168,
          7300,
          7301
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-singletargetcasts-blink",
        "label": "Blink",
        "raw": "Blink [1953] {1.5}",
        "spellIds": [
          1953
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-singletargetcasts-counterspell",
        "label": "Counterspell",
        "raw": "Counterspell [2139] {1.5}",
        "spellIds": [
          2139
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-singletargetcasts-fire-blast",
        "label": "Fire Blast",
        "raw": "Fire Blast [2136*,2137*,2138*,8412*,8413*,10197*,10199*,27078*,27079] {1.5}",
        "spellIds": [
          2136,
          2137,
          2138,
          8412,
          8413,
          10197,
          10199,
          27078,
          27079
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-singletargetcasts-fireball",
        "label": "Fireball",
        "raw": "Fireball [133*,143*,3140*,8400*,8401*,8402*,10148*,10149*,10150*,10151*,25306*,27070] {3}",
        "spellIds": [
          133,
          143,
          3140,
          8400,
          8401,
          8402,
          10148,
          10149,
          10150,
          10151,
          25306,
          27070
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      },
      {
        "id": "mage-singletargetcasts-frostbolt-rank-2-wc-uptime",
        "label": "Frostbolt (rank 2+) (WC uptime%)",
        "raw": "Frostbolt (rank 2+) (WC uptime%) [8407*,8406*,7322*,837*,205*,25304*,10181*,10180*,10179*,8408*,27071*,27072] {3}",
        "spellIds": [
          8407,
          8406,
          7322,
          837,
          205,
          25304,
          10181,
          10180,
          10179,
          8408,
          27071,
          27072
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      },
      {
        "id": "mage-singletargetcasts-frostbolt-rank-1",
        "label": "Frostbolt (rank 1)",
        "raw": "Frostbolt (rank 1) [116] {1.5}",
        "spellIds": [
          116
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-singletargetcasts-ice-barrier",
        "label": "Ice Barrier",
        "raw": "Ice Barrier [33405,27134*,13033*,13032*,13031*,11426*] {1.5}",
        "spellIds": [
          33405,
          27134,
          13033,
          13032,
          13031,
          11426
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-singletargetcasts-ice-block",
        "label": "Ice Block",
        "raw": "Ice Block [45438] {1.5}",
        "spellIds": [
          45438
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-singletargetcasts-ice-lance",
        "label": "Ice Lance",
        "raw": "Ice Lance [30455] {1.5}",
        "spellIds": [
          30455
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-singletargetcasts-mana-shield",
        "label": "Mana Shield",
        "raw": "Mana Shield [1463*,8494*,8495*,10191*,10192*,10193*,27131] {1.5}",
        "spellIds": [
          1463,
          8494,
          8495,
          10191,
          10192,
          10193,
          27131
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-singletargetcasts-pyroblast",
        "label": "Pyroblast",
        "raw": "Pyroblast [12505*,12522*,12522*,12523*,18809*,27132*,33938] {6}",
        "spellIds": [
          12505,
          12522,
          12522,
          12523,
          18809,
          27132,
          33938
        ],
        "modifiers": {
          "baseCastTime": 6
        }
      },
      {
        "id": "mage-singletargetcasts-polymorph",
        "label": "Polymorph",
        "raw": "Polymorph [118,12824,12825,12826,28271,28272] {1.5}",
        "spellIds": [
          118,
          12824,
          12825,
          12826,
          28271,
          28272
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-singletargetcasts-remove-lesser-curse",
        "label": "Remove Lesser Curse",
        "raw": "Remove Lesser Curse [475] {1.5}",
        "spellIds": [
          475
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-singletargetcasts-scorch-fire-vuln-uptime",
        "label": "Scorch (Fire Vuln uptime%)",
        "raw": "Scorch (Fire Vuln uptime%) [2948,8444*,8445*,8446*,10205*,10206*,10207*,27073*,27074] {1.5}",
        "spellIds": [
          2948,
          8444,
          8445,
          8446,
          10205,
          10206,
          10207,
          27073,
          27074
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-singletargetcasts-scorch-on-targets-5-stacks",
        "label": "Scorch% on targets <5 stacks",
        "raw": "Scorch% on targets <5 stacks [99998] {0}",
        "spellIds": [
          99998
        ],
        "modifiers": {
          "baseCastTime": 0
        }
      },
      {
        "id": "mage-singletargetcasts-shoot-wand",
        "label": "Shoot (wand)",
        "raw": "Shoot (wand) [5019] {1.5}",
        "spellIds": [
          5019
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-singletargetcasts-slow",
        "label": "Slow",
        "raw": "Slow [31589] {1.5}",
        "spellIds": [
          31589
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-singletargetcasts-spellsteal",
        "label": "Spellsteal",
        "raw": "Spellsteal [30449] {1.5}",
        "spellIds": [
          30449
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-singletargetcasts-amplify-magic",
        "label": "Amplify Magic",
        "raw": "Amplify Magic [1008*,8455*,10169*,10170*,27130*,33946] {1.5}",
        "spellIds": [
          1008,
          8455,
          10169,
          10170,
          27130,
          33946
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-singletargetcasts-dampen-magic",
        "label": "Dampen Magic",
        "raw": "Dampen Magic [604*,8450*,8451*,10173*,10174*,33944] {1.5}",
        "spellIds": [
          604,
          8450,
          8451,
          10173,
          10174,
          33944
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-singletargetcasts-melee-excluded-from-activity",
        "label": "Melee - excluded from activity!",
        "raw": "Melee - excluded from activity! [1] {0}",
        "spellIds": [
          1
        ],
        "modifiers": {
          "baseCastTime": 0
        }
      }
    ]
  },
  {
    "section": "Mage:aoeCasts",
    "rows": [
      {
        "id": "mage-aoecasts-arcane-explosion-rank-2",
        "label": "Arcane Explosion (rank 2+)",
        "raw": "Arcane Explosion (rank 2+) [8437*,8438*,8439*,10201*,10202*,27080*,27082] {1.5}",
        "spellIds": [
          8437,
          8438,
          8439,
          10201,
          10202,
          27080,
          27082
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-aoecasts-arcane-explosion-rank-1",
        "label": "Arcane Explosion (rank 1)",
        "raw": "Arcane Explosion (rank 1) [1449] {1.5}",
        "spellIds": [
          1449
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-aoecasts-blast-wave",
        "label": "Blast Wave",
        "raw": "Blast Wave [11113*,13020*,13021*,13018*,13019*,27133*,33933] {1.5}",
        "spellIds": [
          11113,
          13020,
          13021,
          13018,
          13019,
          27133,
          33933
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-aoecasts-blizzard-doesn-t-count-for",
        "label": "Blizzard (doesn't count for ⌀)",
        "raw": "Blizzard (doesn't count for ⌀) [27085,10187*,10185*,10186*,8427*,6141*,10] {2.5}",
        "spellIds": [
          27085,
          10187,
          10185,
          10186,
          8427,
          6141,
          10
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      },
      {
        "id": "mage-aoecasts-dragon-s-breath",
        "label": "Dragon's Breath",
        "raw": "Dragon's Breath [31661*,33041*,33042*,33043] {1.5}",
        "spellIds": [
          31661,
          33041,
          33042,
          33043
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-aoecasts-cone-of-cold",
        "label": "Cone of Cold",
        "raw": "Cone of Cold [120,8492*,10159*,10160*,10161*,27087] {1.5}",
        "spellIds": [
          120,
          8492,
          10159,
          10160,
          10161,
          27087
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-aoecasts-frost-nova",
        "label": "Frost Nova",
        "raw": "Frost Nova [122,865*,6131*,10230*,27088] {1.5}",
        "spellIds": [
          122,
          865,
          6131,
          10230,
          27088
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "mage-aoecasts-flamestrike-rank-7",
        "label": "Flamestrike (rank 7)",
        "raw": "Flamestrike (rank 7) [27086] {3}",
        "spellIds": [
          27086
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      },
      {
        "id": "mage-aoecasts-flamestrike-rank-6",
        "label": "Flamestrike (rank 6)",
        "raw": "Flamestrike (rank 6) [10216] {3}",
        "spellIds": [
          10216
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      }
    ]
  },
  {
    "section": "Mage:classCooldowns",
    "rows": [
      {
        "id": "mage-classcooldowns-blessing-of-protection",
        "label": "Blessing of Protection",
        "raw": "Blessing of Protection [10278] --300--",
        "spellIds": [
          10278
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      },
      {
        "id": "mage-classcooldowns-bloodlust",
        "label": "Bloodlust",
        "raw": "Bloodlust [2825] --600-- ++40++",
        "spellIds": [
          2825
        ],
        "modifiers": {
          "cooldownSec": 600,
          "buffDurationSec": 40
        }
      },
      {
        "id": "mage-classcooldowns-heroism",
        "label": "Heroism",
        "raw": "Heroism [32182] --600-- ++40++",
        "spellIds": [
          32182
        ],
        "modifiers": {
          "cooldownSec": 600,
          "buffDurationSec": 40
        }
      },
      {
        "id": "mage-classcooldowns-innervate",
        "label": "Innervate",
        "raw": "Innervate [29166] --360-- ++20++",
        "spellIds": [
          29166
        ],
        "modifiers": {
          "cooldownSec": 360,
          "buffDurationSec": 20
        }
      },
      {
        "id": "mage-classcooldowns-power-infusion",
        "label": "Power Infusion",
        "raw": "Power Infusion [10060] --180-- ++15++",
        "spellIds": [
          10060
        ],
        "modifiers": {
          "cooldownSec": 180,
          "buffDurationSec": 15
        }
      },
      {
        "id": "mage-classcooldowns-arcane-power-combustion",
        "label": "Arcane Power/Combustion",
        "raw": "Arcane Power/Combustion [12042,11129,28682] --195--",
        "spellIds": [
          12042,
          11129,
          28682
        ],
        "modifiers": {
          "cooldownSec": 195
        }
      },
      {
        "id": "mage-classcooldowns-cold-snap",
        "label": "Cold Snap",
        "raw": "Cold Snap [11958] --480--",
        "spellIds": [
          11958
        ],
        "modifiers": {
          "cooldownSec": 480
        }
      },
      {
        "id": "mage-classcooldowns-evocation",
        "label": "Evocation",
        "raw": "Evocation [12051] --480-- ++8++",
        "spellIds": [
          12051
        ],
        "modifiers": {
          "cooldownSec": 480,
          "buffDurationSec": 8
        }
      },
      {
        "id": "mage-classcooldowns-icy-veins",
        "label": "Icy Veins",
        "raw": "Icy Veins [12472] --180-- ++20++",
        "spellIds": [
          12472
        ],
        "modifiers": {
          "cooldownSec": 180,
          "buffDurationSec": 20
        }
      },
      {
        "id": "mage-classcooldowns-invisibility",
        "label": "Invisibility",
        "raw": "Invisibility [66] --300--",
        "spellIds": [
          66
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      },
      {
        "id": "mage-classcooldowns-presence-of-mind",
        "label": "Presence of Mind",
        "raw": "Presence of Mind [12043] --180--",
        "spellIds": [
          12043
        ],
        "modifiers": {
          "cooldownSec": 180
        }
      },
      {
        "id": "mage-classcooldowns-summon-water-elemental",
        "label": "Summon Water Elemental",
        "raw": "Summon Water Elemental [31687] --180-- ++45++",
        "spellIds": [
          31687
        ],
        "modifiers": {
          "cooldownSec": 180,
          "buffDurationSec": 45
        }
      }
    ]
  },
  {
    "section": "Paladin:singleTargetCasts",
    "rows": [
      {
        "id": "paladin-singletargetcasts-cleanse",
        "label": "Cleanse",
        "raw": "Cleanse [4987] {1.5}",
        "spellIds": [
          4987
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-holy-shield",
        "label": "Holy Shield",
        "raw": "Holy Shield [20925*,20927*,20928*,27179] {1.5}",
        "spellIds": [
          20925,
          20927,
          20928,
          27179
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-purify",
        "label": "Purify",
        "raw": "Purify [1152] {1.5}",
        "spellIds": [
          1152
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-sense-undead",
        "label": "Sense Undead",
        "raw": "Sense Undead [5502] {1.5}",
        "spellIds": [
          5502
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-turn-undead",
        "label": "Turn Undead",
        "raw": "Turn Undead [2878*,5627*,10326] {1.5}",
        "spellIds": [
          2878,
          5627,
          10326
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-blessing-of-freedom",
        "label": "Blessing of Freedom",
        "raw": "Blessing of Freedom [1044] {1.5}",
        "spellIds": [
          1044
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-blessing-of-kings-greater-blessing-of-kings",
        "label": "Blessing of Kings/Greater Blessing of Kings",
        "raw": "Blessing of Kings/Greater Blessing of Kings [20217,25898] {1.5}",
        "spellIds": [
          20217,
          25898
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-blessing-of-light-greater-blessing-of-light",
        "label": "Blessing of Light/Greater Blessing of Light",
        "raw": "Blessing of Light/Greater Blessing of Light [19977*,19978*,19979*,25890*,27144,27145] {1.5}",
        "spellIds": [
          19977,
          19978,
          19979,
          25890,
          27144,
          27145
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-blessing-of-might-greater-blessing-of-might",
        "label": "Blessing of Might/Greater Blessing of Might",
        "raw": "Blessing of Might/Greater Blessing of Might [19740*,19834*,19835*,19836*,19837*,19838*,25782*,25916*,25291*,19838*,27140,27141] {1.5}",
        "spellIds": [
          19740,
          19834,
          19835,
          19836,
          19837,
          19838,
          25782,
          25916,
          25291,
          19838,
          27140,
          27141
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-blessing-of-sacrifice",
        "label": "Blessing of Sacrifice",
        "raw": "Blessing of Sacrifice [6940*,20729*,27147*,27148] {1.5}",
        "spellIds": [
          6940,
          20729,
          27147,
          27148
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-blessing-of-salvation-greater-blessing-of-salvation",
        "label": "Blessing of Salvation/Greater Blessing of Salvation",
        "raw": "Blessing of Salvation/Greater Blessing of Salvation [25895,1038] {1.5}",
        "spellIds": [
          25895,
          1038
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-blessing-of-sanctuary-greater-blessing-of-sanctuary",
        "label": "Blessing of Sanctuary/Greater Blessing of Sanctuary",
        "raw": "Blessing of Sanctuary/Greater Blessing of Sanctuary [20911*,20912*,20913*,25899*,20914*,27168,27169] {1.5}",
        "spellIds": [
          20911,
          20912,
          20913,
          25899,
          20914,
          27168,
          27169
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-blessing-of-wisdom-greater-blessing-of-wisdom",
        "label": "Blessing of Wisdom/Greater Blessing of Wisdom",
        "raw": "Blessing of Wisdom/Greater Blessing of Wisdom [19742*,19850*,19852*,19853*,19854*,25290*,25894*,25918*,27142,27143] {1.5}",
        "spellIds": [
          19742,
          19850,
          19852,
          19853,
          19854,
          25290,
          25894,
          25918,
          27142,
          27143
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-concentration-aura",
        "label": "Concentration Aura",
        "raw": "Concentration Aura [19746] {1.5}",
        "spellIds": [
          19746
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-crusader-aura",
        "label": "Crusader Aura",
        "raw": "Crusader Aura [32223] {1.5}",
        "spellIds": [
          32223
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-devotion-aura",
        "label": "Devotion Aura",
        "raw": "Devotion Aura [465*,10290*,643*,10291*,1032*,10292*,10293*,27149] {1.5}",
        "spellIds": [
          465,
          10290,
          643,
          10291,
          1032,
          10292,
          10293,
          27149
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-retribution-aura",
        "label": "Retribution Aura",
        "raw": "Retribution Aura [7294*,10298*,10299*,10300*,10301*,27150] {1.5}",
        "spellIds": [
          7294,
          10298,
          10299,
          10300,
          10301,
          27150
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-fire-resistance-aura",
        "label": "Fire Resistance Aura",
        "raw": "Fire Resistance Aura [19891*,19899*,19900*,27153] {1.5}",
        "spellIds": [
          19891,
          19899,
          19900,
          27153
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-frost-resistance-aura",
        "label": "Frost Resistance Aura",
        "raw": "Frost Resistance Aura [19888*,19897*,19898*,27152] {1.5}",
        "spellIds": [
          19888,
          19897,
          19898,
          27152
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-shadow-resistance-aura",
        "label": "Shadow Resistance Aura",
        "raw": "Shadow Resistance Aura [19876*,19895*,19896*,27151] {1.5}",
        "spellIds": [
          19876,
          19895,
          19896,
          27151
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-avenger-s-shield",
        "label": "Avenger's Shield",
        "raw": "Avenger's Shield [31935*,32699*,32700] {1}",
        "spellIds": [
          31935,
          32699,
          32700
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "paladin-singletargetcasts-crusader-strike",
        "label": "Crusader Strike",
        "raw": "Crusader Strike [35395] {1.5}",
        "spellIds": [
          35395
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-exorcism",
        "label": "Exorcism",
        "raw": "Exorcism [879*,5614*,5615*,10312*,10313*,10314*,27138] {1.5}",
        "spellIds": [
          879,
          5614,
          5615,
          10312,
          10313,
          10314,
          27138
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-hammer-of-justice",
        "label": "Hammer of Justice",
        "raw": "Hammer of Justice [853*,5588*,5589*,10308] {1.5}",
        "spellIds": [
          853,
          5588,
          5589,
          10308
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-hammer-of-wrath",
        "label": "Hammer of Wrath",
        "raw": "Hammer of Wrath [24275*,24274*,24239*,27180] {1}",
        "spellIds": [
          24275,
          24274,
          24239,
          27180
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "paladin-singletargetcasts-holy-shock",
        "label": "Holy Shock",
        "raw": "Holy Shock [20473*,20929*,20930*,27174*,33072] {1.5}",
        "spellIds": [
          20473,
          20929,
          20930,
          27174,
          33072
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-holy-wrath",
        "label": "Holy Wrath",
        "raw": "Holy Wrath [2812*,10318*,27139] {2}",
        "spellIds": [
          2812,
          10318,
          27139
        ],
        "modifiers": {
          "baseCastTime": 2
        }
      },
      {
        "id": "paladin-singletargetcasts-judgement",
        "label": "Judgement",
        "raw": "Judgement [20271] {0.5}",
        "spellIds": [
          20271
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      },
      {
        "id": "paladin-singletargetcasts-righteous-defense",
        "label": "Righteous Defense",
        "raw": "Righteous Defense [31789] {1.5}",
        "spellIds": [
          31789
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-righteous-fury",
        "label": "Righteous Fury",
        "raw": "Righteous Fury [25780] {1.5}",
        "spellIds": [
          25780
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-seal-of-blood",
        "label": "Seal of Blood",
        "raw": "Seal of Blood [31892] {1.5}",
        "spellIds": [
          31892
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-seal-of-command-twisted-swings-on-bosses",
        "label": "Seal of Command (twisted swings on bosses%)",
        "raw": "Seal of Command (twisted swings on bosses%) [20375,20424] {1.5}",
        "spellIds": [
          20375,
          20424
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-seal-of-corruption",
        "label": "Seal of Corruption",
        "raw": "Seal of Corruption [348704] {1.5}",
        "spellIds": [
          348704
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-seal-of-justice",
        "label": "Seal of Justice",
        "raw": "Seal of Justice [20164] {1.5}",
        "spellIds": [
          20164
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-seal-of-light",
        "label": "Seal of Light",
        "raw": "Seal of Light [20165*,20347*,20348*,20349*,27160] {1.5}",
        "spellIds": [
          20165,
          20347,
          20348,
          20349,
          27160
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-seal-of-righteousness",
        "label": "Seal of Righteousness",
        "raw": "Seal of Righteousness [20154*,21084*,20287*,20288*,20289*,20290*,20291*,20292*,20293*,27155] {1.5}",
        "spellIds": [
          20154,
          21084,
          20287,
          20288,
          20289,
          20290,
          20291,
          20292,
          20293,
          27155
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-seal-of-the-crusader",
        "label": "Seal of the Crusader",
        "raw": "Seal of the Crusader [21082*,20162*,20305*,20306*,20307*,20308*,27158] {1.5}",
        "spellIds": [
          21082,
          20162,
          20305,
          20306,
          20307,
          20308,
          27158
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-seal-of-the-martyr",
        "label": "Seal of the Martyr",
        "raw": "Seal of the Martyr [348700] {1.5}",
        "spellIds": [
          348700
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-seal-of-vengeance",
        "label": "Seal of Vengeance",
        "raw": "Seal of Vengeance [31801] {1.5}",
        "spellIds": [
          31801
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-seal-of-wisdom",
        "label": "Seal of Wisdom",
        "raw": "Seal of Wisdom [20166*,20356*,20357*,27166] {1.5}",
        "spellIds": [
          20166,
          20356,
          20357,
          27166
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-melee-excluded-from-activity",
        "label": "Melee - excluded from activity",
        "raw": "Melee - excluded from activity [1] {0}",
        "spellIds": [
          1
        ],
        "modifiers": {
          "baseCastTime": 0
        }
      },
      {
        "id": "paladin-singletargetcasts-flash-of-light-rank-7-overheal",
        "label": "Flash of Light (rank 7) (overheal%)",
        "raw": "Flash of Light (rank 7) (overheal%) [27137] {1.5}",
        "spellIds": [
          27137
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-flash-of-light-rank-6-overheal",
        "label": "Flash of Light (rank 6) (overheal%)",
        "raw": "Flash of Light (rank 6) (overheal%) [19943] {1.5}",
        "spellIds": [
          19943
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-flash-of-light-rank-5-overheal",
        "label": "Flash of Light (rank 5) (overheal%)",
        "raw": "Flash of Light (rank 5) (overheal%) [19942] {1.5}",
        "spellIds": [
          19942
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-flash-of-light-rank-4-overheal",
        "label": "Flash of Light (rank 4) (overheal%)",
        "raw": "Flash of Light (rank 4) (overheal%) [19941] {1.5}",
        "spellIds": [
          19941
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-flash-of-light-rank-3-overheal",
        "label": "Flash of Light (rank 3) (overheal%)",
        "raw": "Flash of Light (rank 3) (overheal%) [19940] {1.5}",
        "spellIds": [
          19940
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-flash-of-light-rank-2-overheal",
        "label": "Flash of Light (rank 2) (overheal%)",
        "raw": "Flash of Light (rank 2) (overheal%) [19939] {1.5}",
        "spellIds": [
          19939
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-flash-of-light-rank-1-overheal",
        "label": "Flash of Light (rank 1) (overheal%)",
        "raw": "Flash of Light (rank 1) (overheal%) [19750] {1.5}",
        "spellIds": [
          19750
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "paladin-singletargetcasts-holy-light-rank-11-overheal",
        "label": "Holy Light (rank 11) (overheal%)",
        "raw": "Holy Light (rank 11) (overheal%) [27136] {2.5}",
        "spellIds": [
          27136
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      },
      {
        "id": "paladin-singletargetcasts-holy-light-rank-6-10-overheal",
        "label": "Holy Light (rank 6-10) (overheal%)",
        "raw": "Holy Light (rank 6-10) (overheal%) [3472,10328,10329,25292,27135] {2.5}",
        "spellIds": [
          3472,
          10328,
          10329,
          25292,
          27135
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      },
      {
        "id": "paladin-singletargetcasts-holy-light-rank-1-5-overheal",
        "label": "Holy Light (rank 1-5) (overheal%)",
        "raw": "Holy Light (rank 1-5) (overheal%) [635,639,647,1026,1042] {2.5}",
        "spellIds": [
          635,
          639,
          647,
          1026,
          1042
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      }
    ]
  },
  {
    "section": "Paladin:aoeCasts",
    "rows": [
      {
        "id": "paladin-aoecasts-consecration",
        "label": "Consecration",
        "raw": "Consecration [26573*,20116*,20922*,20923*,20924*,27173] {4}",
        "spellIds": [
          26573,
          20116,
          20922,
          20923,
          20924,
          27173
        ],
        "modifiers": {
          "baseCastTime": 4
        }
      }
    ]
  },
  {
    "section": "Paladin:classCooldowns",
    "rows": [
      {
        "id": "paladin-classcooldowns-blessing-of-protection",
        "label": "Blessing of Protection",
        "raw": "Blessing of Protection [10278] --300--",
        "spellIds": [
          10278
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      },
      {
        "id": "paladin-classcooldowns-bloodlust",
        "label": "Bloodlust",
        "raw": "Bloodlust [2825] --600-- ++40++",
        "spellIds": [
          2825
        ],
        "modifiers": {
          "cooldownSec": 600,
          "buffDurationSec": 40
        }
      },
      {
        "id": "paladin-classcooldowns-heroism",
        "label": "Heroism",
        "raw": "Heroism [32182] --600-- ++40++",
        "spellIds": [
          32182
        ],
        "modifiers": {
          "cooldownSec": 600,
          "buffDurationSec": 40
        }
      },
      {
        "id": "paladin-classcooldowns-innervate",
        "label": "Innervate",
        "raw": "Innervate [29166] --360-- ++20++",
        "spellIds": [
          29166
        ],
        "modifiers": {
          "cooldownSec": 360,
          "buffDurationSec": 20
        }
      },
      {
        "id": "paladin-classcooldowns-avenging-wrath",
        "label": "Avenging Wrath",
        "raw": "Avenging Wrath [31884] --180-- ++20++",
        "spellIds": [
          31884
        ],
        "modifiers": {
          "cooldownSec": 180,
          "buffDurationSec": 20
        }
      },
      {
        "id": "paladin-classcooldowns-divine-favor",
        "label": "Divine Favor",
        "raw": "Divine Favor [20216] --120--",
        "spellIds": [
          20216
        ],
        "modifiers": {
          "cooldownSec": 120
        }
      },
      {
        "id": "paladin-classcooldowns-divine-illumination",
        "label": "Divine Illumination",
        "raw": "Divine Illumination [31842] --180--",
        "spellIds": [
          31842
        ],
        "modifiers": {
          "cooldownSec": 180
        }
      },
      {
        "id": "paladin-classcooldowns-divine-intervention",
        "label": "Divine Intervention",
        "raw": "Divine Intervention [19752] --3600--",
        "spellIds": [
          19752
        ],
        "modifiers": {
          "cooldownSec": 3600
        }
      },
      {
        "id": "paladin-classcooldowns-divine-protection",
        "label": "Divine Protection",
        "raw": "Divine Protection [5573] --300--",
        "spellIds": [
          5573
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      },
      {
        "id": "paladin-classcooldowns-divine-shield",
        "label": "Divine Shield",
        "raw": "Divine Shield [1020] --300--",
        "spellIds": [
          1020
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      },
      {
        "id": "paladin-classcooldowns-lay-on-hands",
        "label": "Lay on Hands",
        "raw": "Lay on Hands [27154] --3600--",
        "spellIds": [
          27154
        ],
        "modifiers": {
          "cooldownSec": 3600
        }
      }
    ]
  },
  {
    "section": "Priest:singleTargetCasts",
    "rows": [
      {
        "id": "priest-singletargetcasts-mana-burn",
        "label": "Mana Burn",
        "raw": "Mana Burn [8129,8131*,10874*,10875*,10876*,25379*,25380] {3}",
        "spellIds": [
          8129,
          8131,
          10874,
          10875,
          10876,
          25379,
          25380
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      },
      {
        "id": "priest-singletargetcasts-mind-blast-vt-efficiency",
        "label": "Mind Blast (VT efficiency%)",
        "raw": "Mind Blast (VT efficiency%) [8092*,8102*,8104*,8105*,8106*,10945*,10946*,10947*,25372*,25375] {1.5}",
        "spellIds": [
          8092,
          8102,
          8104,
          8105,
          8106,
          10945,
          10946,
          10947,
          25372,
          25375
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-mind-flay-shadow-vuln-uptime",
        "label": "Mind Flay (Shadow Vuln uptime%)",
        "raw": "Mind Flay (Shadow Vuln uptime%) [25387,18807*,17314*,17313*,17312*,17311*,15407*] {2.25}",
        "spellIds": [
          25387,
          18807,
          17314,
          17313,
          17312,
          17311,
          15407
        ],
        "modifiers": {
          "baseCastTime": 2.25
        }
      },
      {
        "id": "priest-singletargetcasts-shadowform",
        "label": "Shadowform",
        "raw": "Shadowform [15473] {1.5}",
        "spellIds": [
          15473
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-shadow-word-death",
        "label": "Shadow Word: Death",
        "raw": "Shadow Word: Death [32379*,32996] {1.5}",
        "spellIds": [
          32379,
          32996
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-shadow-word-pain-uptime",
        "label": "Shadow Word: Pain (uptime%)",
        "raw": "Shadow Word: Pain (uptime%) [25368,25367*,10894*,10893*,10892*,2767*,992*,970*,594*,589*] {1.5}",
        "spellIds": [
          25368,
          25367,
          10894,
          10893,
          10892,
          2767,
          992,
          970,
          594,
          589
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-silence",
        "label": "Silence",
        "raw": "Silence [15487] {1.5}",
        "spellIds": [
          15487
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-vampiric-embrace-uptime",
        "label": "Vampiric Embrace (uptime%)",
        "raw": "Vampiric Embrace (uptime%) [15286] {1.5}",
        "spellIds": [
          15286
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-vampiric-touch-uptime",
        "label": "Vampiric Touch (uptime%)",
        "raw": "Vampiric Touch (uptime%) [34914*,34916*,34917] {1.5}",
        "spellIds": [
          34914,
          34916,
          34917
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-holy-fire",
        "label": "Holy Fire",
        "raw": "Holy Fire [14914*,15262*,15263*,15264*,15265*,15266*,15267*,15261*,25384] {3.5}",
        "spellIds": [
          14914,
          15262,
          15263,
          15264,
          15265,
          15266,
          15267,
          15261,
          25384
        ],
        "modifiers": {
          "baseCastTime": 3.5
        }
      },
      {
        "id": "priest-singletargetcasts-smite",
        "label": "Smite",
        "raw": "Smite [25364,25363*,10934*,10933*,6060*,1004*,984*,598*,591*,585*] {2.5}",
        "spellIds": [
          25364,
          25363,
          10934,
          10933,
          6060,
          1004,
          984,
          598,
          591,
          585
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      },
      {
        "id": "priest-singletargetcasts-starshards-nightelf-only",
        "label": "Starshards (nightelf only)",
        "raw": "Starshards (nightelf only) [19305*,25446] {3.5}",
        "spellIds": [
          19305,
          25446
        ],
        "modifiers": {
          "baseCastTime": 3.5
        }
      },
      {
        "id": "priest-singletargetcasts-shoot-wand",
        "label": "Shoot (wand)",
        "raw": "Shoot (wand) [5019] {1.5}",
        "spellIds": [
          5019
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-melee-excluded-from-activity",
        "label": "Melee - excluded from activity!",
        "raw": "Melee - excluded from activity! [1] {0}",
        "spellIds": [
          1
        ],
        "modifiers": {
          "baseCastTime": 0
        }
      },
      {
        "id": "priest-singletargetcasts-abolish-disease",
        "label": "Abolish Disease",
        "raw": "Abolish Disease [552] {1.5}",
        "spellIds": [
          552
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-cure-disease",
        "label": "Cure Disease",
        "raw": "Cure Disease [528] {1.5}",
        "spellIds": [
          528
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-dispel-magic",
        "label": "Dispel Magic",
        "raw": "Dispel Magic [527,988] {1.5}",
        "spellIds": [
          527,
          988
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-mass-dispel",
        "label": "Mass Dispel",
        "raw": "Mass Dispel [32375] {1.5}",
        "spellIds": [
          32375
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-divine-spirit-prayer-of-spirit",
        "label": "Divine Spirit/Prayer of Spirit",
        "raw": "Divine Spirit/Prayer of Spirit [14752*,14818*,14819*,27841*,27681*,25312,32999] {1.5}",
        "spellIds": [
          14752,
          14818,
          14819,
          27841,
          27681,
          25312,
          32999
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-power-word-fortitude-prayer-of-fortitude",
        "label": "Power Word: Fortitude/Prayer of Fortitude",
        "raw": "Power Word: Fortitude/Prayer of Fortitude [1243*,1244*,1245*,2791*,10937*,10938*,21562*,21564*,19838*,25389,25392] {1.5}",
        "spellIds": [
          1243,
          1244,
          1245,
          2791,
          10937,
          10938,
          21562,
          21564,
          19838,
          25389,
          25392
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-shadow-protection-prayer-of-shadow-protection",
        "label": "Shadow Protection/Prayer of Shadow Protection",
        "raw": "Shadow Protection/Prayer of Shadow Protection [976*,27683*,10957*,10958*,39374,25433] {1.5}",
        "spellIds": [
          976,
          27683,
          10957,
          10958,
          39374,
          25433
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-inner-fire",
        "label": "Inner Fire",
        "raw": "Inner Fire [588*,7128*,602*,1006*,10951*,10952*,25431] {1.5}",
        "spellIds": [
          588,
          7128,
          602,
          1006,
          10951,
          10952,
          25431
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-chastise",
        "label": "Chastise",
        "raw": "Chastise [44041*,44043*,44044*,44045*,44046*,44047] {0.5}",
        "spellIds": [
          44041,
          44043,
          44044,
          44045,
          44046,
          44047
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      },
      {
        "id": "priest-singletargetcasts-fade",
        "label": "Fade",
        "raw": "Fade [586*,9578*,9579*,9592*,10941*,10942*,25429] {1.5}",
        "spellIds": [
          586,
          9578,
          9579,
          9592,
          10941,
          10942,
          25429
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-levitate",
        "label": "Levitate",
        "raw": "Levitate [1706] {1.5}",
        "spellIds": [
          1706
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-mind-control",
        "label": "Mind Control",
        "raw": "Mind Control [605*,10911*,10912] {6}",
        "spellIds": [
          605,
          10911,
          10912
        ],
        "modifiers": {
          "baseCastTime": 6
        }
      },
      {
        "id": "priest-singletargetcasts-mind-soothe",
        "label": "Mind Soothe",
        "raw": "Mind Soothe [453*,8192*,10953*,25596] {1.5}",
        "spellIds": [
          453,
          8192,
          10953,
          25596
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-psychic-scream",
        "label": "Psychic Scream",
        "raw": "Psychic Scream [8122,8124,10888,10890] {1.5}",
        "spellIds": [
          8122,
          8124,
          10888,
          10890
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-shackle-undead",
        "label": "Shackle Undead",
        "raw": "Shackle Undead [9484,9485,10955] {1.5}",
        "spellIds": [
          9484,
          9485,
          10955
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-binding-heal-overheal",
        "label": "Binding Heal (overheal%)",
        "raw": "Binding Heal (overheal%) [32546] {1.5}",
        "spellIds": [
          32546
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-flash-heal-rank-9-overheal",
        "label": "Flash Heal (rank 9) (overheal%)",
        "raw": "Flash Heal (rank 9) (overheal%) [25235] {1.5}",
        "spellIds": [
          25235
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-flash-heal-rank-8-overheal",
        "label": "Flash Heal (rank 8) (overheal%)",
        "raw": "Flash Heal (rank 8) (overheal%) [25233] {1.5}",
        "spellIds": [
          25233
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-flash-heal-rank-7-overheal",
        "label": "Flash Heal (rank 7) (overheal%)",
        "raw": "Flash Heal (rank 7) (overheal%) [10917] {1.5}",
        "spellIds": [
          10917
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-flash-heal-rank-6-overheal",
        "label": "Flash Heal (rank 6) (overheal%)",
        "raw": "Flash Heal (rank 6) (overheal%) [10916] {1.5}",
        "spellIds": [
          10916
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-flash-heal-rank-5-overheal",
        "label": "Flash Heal (rank 5) (overheal%)",
        "raw": "Flash Heal (rank 5) (overheal%) [10915] {1.5}",
        "spellIds": [
          10915
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-flash-heal-rank-4-overheal",
        "label": "Flash Heal (rank 4) (overheal%)",
        "raw": "Flash Heal (rank 4) (overheal%) [9474] {1.5}",
        "spellIds": [
          9474
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-flash-heal-rank-3-overheal",
        "label": "Flash Heal (rank 3) (overheal%)",
        "raw": "Flash Heal (rank 3) (overheal%) [9473] {1.5}",
        "spellIds": [
          9473
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-flash-heal-rank-2-overheal",
        "label": "Flash Heal (rank 2) (overheal%)",
        "raw": "Flash Heal (rank 2) (overheal%) [9472] {1.5}",
        "spellIds": [
          9472
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-flash-heal-rank-1-overheal",
        "label": "Flash Heal (rank 1) (overheal%)",
        "raw": "Flash Heal (rank 1) (overheal%) [2061] {1.5}",
        "spellIds": [
          2061
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-greater-heal-rank-7-overheal",
        "label": "Greater Heal (rank 7) (overheal%)",
        "raw": "Greater Heal (rank 7) (overheal%) [25213] {3}",
        "spellIds": [
          25213
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      },
      {
        "id": "priest-singletargetcasts-greater-heal-rank-6-overheal",
        "label": "Greater Heal (rank 6) (overheal%)",
        "raw": "Greater Heal (rank 6) (overheal%) [25210] {3}",
        "spellIds": [
          25210
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      },
      {
        "id": "priest-singletargetcasts-greater-heal-rank-5-overheal",
        "label": "Greater Heal (rank 5) (overheal%)",
        "raw": "Greater Heal (rank 5) (overheal%) [25314] {3}",
        "spellIds": [
          25314
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      },
      {
        "id": "priest-singletargetcasts-greater-heal-rank-4-overheal",
        "label": "Greater Heal (rank 4) (overheal%)",
        "raw": "Greater Heal (rank 4) (overheal%) [10965] {3}",
        "spellIds": [
          10965
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      },
      {
        "id": "priest-singletargetcasts-greater-heal-rank-3-overheal",
        "label": "Greater Heal (rank 3) (overheal%)",
        "raw": "Greater Heal (rank 3) (overheal%) [10964] {3}",
        "spellIds": [
          10964
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      },
      {
        "id": "priest-singletargetcasts-greater-heal-rank-2-overheal",
        "label": "Greater Heal (rank 2) (overheal%)",
        "raw": "Greater Heal (rank 2) (overheal%) [10963] {3}",
        "spellIds": [
          10963
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      },
      {
        "id": "priest-singletargetcasts-greater-heal-rank-1-overheal",
        "label": "Greater Heal (rank 1) (overheal%)",
        "raw": "Greater Heal (rank 1) (overheal%) [2060] {3}",
        "spellIds": [
          2060
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      },
      {
        "id": "priest-singletargetcasts-heal-rank-4-overheal",
        "label": "Heal (rank 4) (overheal%)",
        "raw": "Heal (rank 4) (overheal%) [6064] {3}",
        "spellIds": [
          6064
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      },
      {
        "id": "priest-singletargetcasts-heal-rank-3-overheal",
        "label": "Heal (rank 3) (overheal%)",
        "raw": "Heal (rank 3) (overheal%) [6063] {3}",
        "spellIds": [
          6063
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      },
      {
        "id": "priest-singletargetcasts-heal-rank-2-overheal",
        "label": "Heal (rank 2) (overheal%)",
        "raw": "Heal (rank 2) (overheal%) [2055] {3}",
        "spellIds": [
          2055
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      },
      {
        "id": "priest-singletargetcasts-heal-rank-1-overheal",
        "label": "Heal (rank 1) (overheal%)",
        "raw": "Heal (rank 1) (overheal%) [2054] {3}",
        "spellIds": [
          2054
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      },
      {
        "id": "priest-singletargetcasts-lesser-heal-overheal",
        "label": "Lesser Heal (overheal%)",
        "raw": "Lesser Heal (overheal%) [2053] {2.5}",
        "spellIds": [
          2053
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      },
      {
        "id": "priest-singletargetcasts-power-word-shield",
        "label": "Power Word: Shield",
        "raw": "Power Word: Shield [17,592,600,3747,6065,6066,10898,10899,10900,10901,25217,25218] {1.5}",
        "spellIds": [
          17,
          592,
          600,
          3747,
          6065,
          6066,
          10898,
          10899,
          10900,
          10901,
          25217,
          25218
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-prayer-of-mending",
        "label": "Prayer of Mending",
        "raw": "Prayer of Mending [33076] {1.5}",
        "spellIds": [
          33076
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-renew-rank-12-overheal",
        "label": "Renew (rank 12) (overheal%)",
        "raw": "Renew (rank 12) (overheal%) [25222] {1.5}",
        "spellIds": [
          25222
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-renew-rank-7-11-overheal",
        "label": "Renew (rank 7-11) (overheal%)",
        "raw": "Renew (rank 7-11) (overheal%) [10927,10928,10929,25315,25221] {1.5}",
        "spellIds": [
          10927,
          10928,
          10929,
          25315,
          25221
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-singletargetcasts-renew-rank-1-6-overheal",
        "label": "Renew (rank 1-6) (overheal%)",
        "raw": "Renew (rank 1-6) (overheal%) [139,6074,6075,6076,6077,6078] {1.5}",
        "spellIds": [
          139,
          6074,
          6075,
          6076,
          6077,
          6078
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      }
    ]
  },
  {
    "section": "Priest:aoeCasts",
    "rows": [
      {
        "id": "priest-aoecasts-circle-of-healing-rank-5-overheal",
        "label": "Circle of Healing (rank 5) (overheal%)",
        "raw": "Circle of Healing (rank 5) (overheal%) [34866] {1.5}",
        "spellIds": [
          34866
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-aoecasts-circle-of-healing-rank-4-overheal",
        "label": "Circle of Healing (rank 4) (overheal%)",
        "raw": "Circle of Healing (rank 4) (overheal%) [34865] {1.5}",
        "spellIds": [
          34865
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-aoecasts-circle-of-healing-rank-3-overheal",
        "label": "Circle of Healing (rank 3) (overheal%)",
        "raw": "Circle of Healing (rank 3) (overheal%) [34864] {1.5}",
        "spellIds": [
          34864
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-aoecasts-circle-of-healing-rank-2-overheal",
        "label": "Circle of Healing (rank 2) (overheal%)",
        "raw": "Circle of Healing (rank 2) (overheal%) [34863] {1.5}",
        "spellIds": [
          34863
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-aoecasts-circle-of-healing-rank-1-overheal",
        "label": "Circle of Healing (rank 1) (overheal%)",
        "raw": "Circle of Healing (rank 1) (overheal%) [34861] {1.5}",
        "spellIds": [
          34861
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-aoecasts-holy-nova-overheal",
        "label": "Holy Nova (overheal%)",
        "raw": "Holy Nova (overheal%) [15237*,15430*,15431*,27799*,27800*,27801*,25331] {1.5}",
        "spellIds": [
          15237,
          15430,
          15431,
          27799,
          27800,
          27801,
          25331
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "priest-aoecasts-prayer-of-healing-overheal",
        "label": "Prayer of Healing (overheal%)",
        "raw": "Prayer of Healing (overheal%) [596,996*,10960*,10961*,25316*,25308] {3}",
        "spellIds": [
          596,
          996,
          10960,
          10961,
          25316,
          25308
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      }
    ]
  },
  {
    "section": "Priest:classCooldowns",
    "rows": [
      {
        "id": "priest-classcooldowns-blessing-of-protection",
        "label": "Blessing of Protection",
        "raw": "Blessing of Protection [10278] --300--",
        "spellIds": [
          10278
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      },
      {
        "id": "priest-classcooldowns-bloodlust",
        "label": "Bloodlust",
        "raw": "Bloodlust [2825] --600-- ++40++",
        "spellIds": [
          2825
        ],
        "modifiers": {
          "cooldownSec": 600,
          "buffDurationSec": 40
        }
      },
      {
        "id": "priest-classcooldowns-heroism",
        "label": "Heroism",
        "raw": "Heroism [32182] --600-- ++40++",
        "spellIds": [
          32182
        ],
        "modifiers": {
          "cooldownSec": 600,
          "buffDurationSec": 40
        }
      },
      {
        "id": "priest-classcooldowns-innervate",
        "label": "Innervate",
        "raw": "Innervate [29166] --360-- ++20++",
        "spellIds": [
          29166
        ],
        "modifiers": {
          "cooldownSec": 360,
          "buffDurationSec": 20
        }
      },
      {
        "id": "priest-classcooldowns-desperate-prayer-dwarf-human-only",
        "label": "Desperate Prayer (dwarf/human only)",
        "raw": "Desperate Prayer (dwarf/human only) [25437] --600--",
        "spellIds": [
          25437
        ],
        "modifiers": {
          "cooldownSec": 600
        }
      },
      {
        "id": "priest-classcooldowns-devouring-plague-undead-only",
        "label": "Devouring Plague (undead only)",
        "raw": "Devouring Plague (undead only) [25467] --180--",
        "spellIds": [
          25467
        ],
        "modifiers": {
          "cooldownSec": 180
        }
      },
      {
        "id": "priest-classcooldowns-inner-focus",
        "label": "Inner Focus",
        "raw": "Inner Focus [14751] --180--",
        "spellIds": [
          14751
        ],
        "modifiers": {
          "cooldownSec": 180
        }
      },
      {
        "id": "priest-classcooldowns-pain-suppression",
        "label": "Pain Suppression",
        "raw": "Pain Suppression [33206] --120-- ++8++",
        "spellIds": [
          33206
        ],
        "modifiers": {
          "cooldownSec": 120,
          "buffDurationSec": 8
        }
      },
      {
        "id": "priest-classcooldowns-power-infusion",
        "label": "Power Infusion",
        "raw": "Power Infusion [10060] --180-- ++15++",
        "spellIds": [
          10060
        ],
        "modifiers": {
          "cooldownSec": 180,
          "buffDurationSec": 15
        }
      },
      {
        "id": "priest-classcooldowns-shadowfiend",
        "label": "Shadowfiend",
        "raw": "Shadowfiend [34433] --300--",
        "spellIds": [
          34433
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      }
    ]
  },
  {
    "section": "Rogue:singleTargetCasts",
    "rows": [
      {
        "id": "rogue-singletargetcasts-ambush",
        "label": "Ambush",
        "raw": "Ambush [8676*,8724*,8725*,11267*,11268*,11269*,27441] {1}",
        "spellIds": [
          8676,
          8724,
          8725,
          11267,
          11268,
          11269,
          27441
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "rogue-singletargetcasts-backstab",
        "label": "Backstab",
        "raw": "Backstab [53*,2589*,2590*,2591*,8721*,11279*,11280*,11281*,25300*,26863] {1.5}",
        "spellIds": [
          53,
          2589,
          2590,
          2591,
          8721,
          11279,
          11280,
          11281,
          25300,
          26863
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "rogue-singletargetcasts-cheap-shot",
        "label": "Cheap Shot",
        "raw": "Cheap Shot [1833] {1}",
        "spellIds": [
          1833
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "rogue-singletargetcasts-deadly-throw",
        "label": "Deadly Throw",
        "raw": "Deadly Throw [26679] {1}",
        "spellIds": [
          26679
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "rogue-singletargetcasts-disarm-trap",
        "label": "Disarm Trap",
        "raw": "Disarm Trap [1842] {0.5}",
        "spellIds": [
          1842
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      },
      {
        "id": "rogue-singletargetcasts-distract",
        "label": "Distract",
        "raw": "Distract [1725] {1.5}",
        "spellIds": [
          1725
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "rogue-singletargetcasts-envenom",
        "label": "Envenom",
        "raw": "Envenom [32645*,32684] {1}",
        "spellIds": [
          32645,
          32684
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "rogue-singletargetcasts-eviscerate",
        "label": "Eviscerate",
        "raw": "Eviscerate [2098*,6760*,6761*,6762*,8623*,8624*,11299*,11300*,31016*,26865] {1}",
        "spellIds": [
          2098,
          6760,
          6761,
          6762,
          8623,
          8624,
          11299,
          11300,
          31016,
          26865
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "rogue-singletargetcasts-expose-armor-uptime",
        "label": "Expose Armor (uptime%)",
        "raw": "Expose Armor (uptime%) [8647*,8649*,8650*,11197*,11198*,26866] {1}",
        "spellIds": [
          8647,
          8649,
          8650,
          11197,
          11198,
          26866
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "rogue-singletargetcasts-feint",
        "label": "Feint",
        "raw": "Feint [1966*,6768*,8637*,11303*,25302*,27448] {1}",
        "spellIds": [
          1966,
          6768,
          8637,
          11303,
          25302,
          27448
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "rogue-singletargetcasts-garrote",
        "label": "Garrote",
        "raw": "Garrote [703*,8631*,8632*,8633*,11289*,11290*,26839*,26884] {1}",
        "spellIds": [
          703,
          8631,
          8632,
          8633,
          11289,
          11290,
          26839,
          26884
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "rogue-singletargetcasts-gouge",
        "label": "Gouge",
        "raw": "Gouge [1776*,1777*,8629*,11285*,11286*,38764] {1}",
        "spellIds": [
          1776,
          1777,
          8629,
          11285,
          11286,
          38764
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "rogue-singletargetcasts-hemorrhage",
        "label": "Hemorrhage",
        "raw": "Hemorrhage [16511*,17347*,17348*,26864] {1}",
        "spellIds": [
          16511,
          17347,
          17348,
          26864
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "rogue-singletargetcasts-kick",
        "label": "Kick",
        "raw": "Kick [1766*,1767*,1768*,1769*,38768] {1}",
        "spellIds": [
          1766,
          1767,
          1768,
          1769,
          38768
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "rogue-singletargetcasts-kidney-shot",
        "label": "Kidney Shot",
        "raw": "Kidney Shot [408*,8643] {1}",
        "spellIds": [
          408,
          8643
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "rogue-singletargetcasts-mutilate",
        "label": "Mutilate",
        "raw": "Mutilate [34411*,34412*,34413] {1}",
        "spellIds": [
          34411,
          34412,
          34413
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "rogue-singletargetcasts-rupture",
        "label": "Rupture",
        "raw": "Rupture [1943*,8639*,8640*,11275*,26867] {1}",
        "spellIds": [
          1943,
          8639,
          8640,
          11275,
          26867
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "rogue-singletargetcasts-shadowstep",
        "label": "Shadowstep",
        "raw": "Shadowstep [36554] {0.5}",
        "spellIds": [
          36554
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      },
      {
        "id": "rogue-singletargetcasts-shiv",
        "label": "Shiv",
        "raw": "Shiv [5940] {1}",
        "spellIds": [
          5940
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "rogue-singletargetcasts-sinister-strike",
        "label": "Sinister Strike",
        "raw": "Sinister Strike [1752*,1757*,1758*,1759*,11293*,11294*,26861*,26862] {1}",
        "spellIds": [
          1752,
          1757,
          1758,
          1759,
          11293,
          11294,
          26861,
          26862
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "rogue-singletargetcasts-slice-and-dice-uptime-total",
        "label": "Slice and Dice (uptime total%)",
        "raw": "Slice and Dice (uptime total%) [5171*,6774] {1}",
        "spellIds": [
          5171,
          6774
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "rogue-singletargetcasts-melee-excluded-from-activity",
        "label": "Melee - excluded from activity",
        "raw": "Melee - excluded from activity [1] {0}",
        "spellIds": [
          1
        ],
        "modifiers": {
          "baseCastTime": 0
        }
      }
    ]
  },
  {
    "section": "Rogue:aoeCasts",
    "rows": [
      {
        "id": "rogue-aoecasts-blade-flurry",
        "label": "Blade Flurry",
        "raw": "Blade Flurry [13877] {1}",
        "spellIds": [
          13877
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      }
    ]
  },
  {
    "section": "Rogue:classCooldowns",
    "rows": [
      {
        "id": "rogue-classcooldowns-blessing-of-protection",
        "label": "Blessing of Protection",
        "raw": "Blessing of Protection [10278] --300--",
        "spellIds": [
          10278
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      },
      {
        "id": "rogue-classcooldowns-bloodlust",
        "label": "Bloodlust",
        "raw": "Bloodlust [2825] --600-- ++40++",
        "spellIds": [
          2825
        ],
        "modifiers": {
          "cooldownSec": 600,
          "buffDurationSec": 40
        }
      },
      {
        "id": "rogue-classcooldowns-heroism",
        "label": "Heroism",
        "raw": "Heroism [32182] --600-- ++40++",
        "spellIds": [
          32182
        ],
        "modifiers": {
          "cooldownSec": 600,
          "buffDurationSec": 40
        }
      },
      {
        "id": "rogue-classcooldowns-adrenaline-rush",
        "label": "Adrenaline Rush",
        "raw": "Adrenaline Rush [13750] --300-- ++15++",
        "spellIds": [
          13750
        ],
        "modifiers": {
          "cooldownSec": 300,
          "buffDurationSec": 15
        }
      },
      {
        "id": "rogue-classcooldowns-cloak-of-shadows",
        "label": "Cloak of Shadows",
        "raw": "Cloak of Shadows [31224] --60-- ++5++",
        "spellIds": [
          31224
        ],
        "modifiers": {
          "cooldownSec": 60,
          "buffDurationSec": 5
        }
      },
      {
        "id": "rogue-classcooldowns-evasion",
        "label": "Evasion",
        "raw": "Evasion [5277,26669] --300-- ++15++",
        "spellIds": [
          5277,
          26669
        ],
        "modifiers": {
          "cooldownSec": 300,
          "buffDurationSec": 15
        }
      },
      {
        "id": "rogue-classcooldowns-vanish",
        "label": "Vanish",
        "raw": "Vanish [26889] --300--",
        "spellIds": [
          26889
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      }
    ]
  },
  {
    "section": "Shaman:singleTargetCasts",
    "rows": [
      {
        "id": "shaman-singletargetcasts-earth-shock",
        "label": "Earth Shock",
        "raw": "Earth Shock [8042,8044*,8045*,8046*,10412*,10413*,10414*,25454] {1.5}",
        "spellIds": [
          8042,
          8044,
          8045,
          8046,
          10412,
          10413,
          10414,
          25454
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-flame-shock",
        "label": "Flame Shock",
        "raw": "Flame Shock [8050,8052*,8053*,10447*,10448*,29228*,25457] {1.5}",
        "spellIds": [
          8050,
          8052,
          8053,
          10447,
          10448,
          29228,
          25457
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-frost-shock",
        "label": "Frost Shock",
        "raw": "Frost Shock [8056,8058*,10472*,10473*,25464] {1.5}",
        "spellIds": [
          8056,
          8058,
          10472,
          10473,
          25464
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-lightning-bolt-rank-1-4-mostly-rank-4-if-not-red",
        "label": "Lightning Bolt (rank 1-4, mostly rank 4 if not red)",
        "raw": "Lightning Bolt (rank 1-4, mostly rank 4 if not red) [403*,529*,548*,915] {2}",
        "spellIds": [
          403,
          529,
          548,
          915
        ],
        "modifiers": {
          "baseCastTime": 2
        }
      },
      {
        "id": "shaman-singletargetcasts-lightning-bolt-rank-5-12-mostly-rank-12-if-not-red",
        "label": "Lightning Bolt (rank 5-12, mostly rank 12 if not red)",
        "raw": "Lightning Bolt (rank 5-12, mostly rank 12 if not red) [943*,6041*,10391*,10392*,15207*,15208*,25448*,25449] {2}",
        "spellIds": [
          943,
          6041,
          10391,
          10392,
          15207,
          15208,
          25448,
          25449
        ],
        "modifiers": {
          "baseCastTime": 2
        }
      },
      {
        "id": "shaman-singletargetcasts-lightning-shield",
        "label": "Lightning Shield",
        "raw": "Lightning Shield [324*,325*,905*,945*,8134*,10431*,10432*,25469*,25472] {1.5}",
        "spellIds": [
          324,
          325,
          905,
          945,
          8134,
          10431,
          10432,
          25469,
          25472
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-purge",
        "label": "Purge",
        "raw": "Purge [370,8012] {1.5}",
        "spellIds": [
          370,
          8012
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-earth-elemental-totem",
        "label": "Earth Elemental Totem",
        "raw": "Earth Elemental Totem [2062] {1.5}",
        "spellIds": [
          2062
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-fire-elemental-totem",
        "label": "Fire Elemental Totem",
        "raw": "Fire Elemental Totem [2894] {1.5}",
        "spellIds": [
          2894
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-flametongue-totem",
        "label": "Flametongue Totem",
        "raw": "Flametongue Totem [8227*,8249*,10526*,16387*,25557] {1.5}",
        "spellIds": [
          8227,
          8249,
          10526,
          16387,
          25557
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-searing-totem",
        "label": "Searing Totem",
        "raw": "Searing Totem [3599*,6363*,6364*,6365*,10437*,10438*,25533] {1.5}",
        "spellIds": [
          3599,
          6363,
          6364,
          6365,
          10437,
          10438,
          25533
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-cure-disease",
        "label": "Cure Disease",
        "raw": "Cure Disease [2870] {1.5}",
        "spellIds": [
          2870
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-cure-poison",
        "label": "Cure Poison",
        "raw": "Cure Poison [526] {1.5}",
        "spellIds": [
          526
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-disease-cleansing-totem",
        "label": "Disease Cleansing Totem",
        "raw": "Disease Cleansing Totem [8170] {1.5}",
        "spellIds": [
          8170
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-poison-cleansing-totem",
        "label": "Poison Cleansing Totem",
        "raw": "Poison Cleansing Totem [38306] {1.5}",
        "spellIds": [
          38306
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-fire-resistance-totem",
        "label": "Fire Resistance Totem",
        "raw": "Fire Resistance Totem [8184*,10537*,10538*,25563] {1.5}",
        "spellIds": [
          8184,
          10537,
          10538,
          25563
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-frost-resistance-totem",
        "label": "Frost Resistance Totem",
        "raw": "Frost Resistance Totem [8181*,10478*,10479*,25560] {1.5}",
        "spellIds": [
          8181,
          10478,
          10479,
          25560
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-nature-resistance-totem",
        "label": "Nature Resistance Totem",
        "raw": "Nature Resistance Totem [10595*,10600*,10601*,25574] {1.5}",
        "spellIds": [
          10595,
          10600,
          10601,
          25574
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-grace-of-air-totem",
        "label": "Grace of Air Totem",
        "raw": "Grace of Air Totem [8835*,10627*,25359] {1.5}",
        "spellIds": [
          8835,
          10627,
          25359
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-grounding-totem",
        "label": "Grounding Totem",
        "raw": "Grounding Totem [8177] {1.5}",
        "spellIds": [
          8177
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-stoneclaw-totem",
        "label": "Stoneclaw Totem",
        "raw": "Stoneclaw Totem [5730*,6390*,6391*,6392*,10427*,10428*,25525] {1.5}",
        "spellIds": [
          5730,
          6390,
          6391,
          6392,
          10427,
          10428,
          25525
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-totem-of-wrath",
        "label": "Totem of Wrath",
        "raw": "Totem of Wrath [30706] {1.5}",
        "spellIds": [
          30706
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-tranquil-air-totem",
        "label": "Tranquil Air Totem",
        "raw": "Tranquil Air Totem [25908] {1.5}",
        "spellIds": [
          25908
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-windfury-totem-rank-5",
        "label": "Windfury Totem (rank 5)",
        "raw": "Windfury Totem (rank 5) [25587] {1.5}",
        "spellIds": [
          25587
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-windfury-totem-rank-1-4",
        "label": "Windfury Totem (rank 1-4)",
        "raw": "Windfury Totem (rank 1-4) [8512,10613,10614,25585] {1.5}",
        "spellIds": [
          8512,
          10613,
          10614,
          25585
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-windwall-totem",
        "label": "Windwall Totem",
        "raw": "Windwall Totem [15107*,15111*,15112*,25577] {1.5}",
        "spellIds": [
          15107,
          15111,
          15112,
          25577
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-wrath-of-air-totem",
        "label": "Wrath of Air Totem",
        "raw": "Wrath of Air Totem [3738] {1.5}",
        "spellIds": [
          3738
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-earthbind-totem",
        "label": "Earthbind Totem",
        "raw": "Earthbind Totem [2484] {1.5}",
        "spellIds": [
          2484
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-stoneskin-totem",
        "label": "Stoneskin Totem",
        "raw": "Stoneskin Totem [8071*,8154*,8155*,10406*,10407*,10408*,25508*,25509] {1.5}",
        "spellIds": [
          8071,
          8154,
          8155,
          10406,
          10407,
          10408,
          25508,
          25509
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-strength-of-earth-totem",
        "label": "Strength of Earth Totem",
        "raw": "Strength of Earth Totem [8075*,8160*,8161*,10442*,25361*,25528] {1.5}",
        "spellIds": [
          8075,
          8160,
          8161,
          10442,
          25361,
          25528
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-tremor-totem",
        "label": "Tremor Totem",
        "raw": "Tremor Totem [8143] {1.5}",
        "spellIds": [
          8143
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-flametongue-weapon",
        "label": "Flametongue Weapon",
        "raw": "Flametongue Weapon [8024*,8027*,8030*,16339*,16341*,16342*,25489] {1.5}",
        "spellIds": [
          8024,
          8027,
          8030,
          16339,
          16341,
          16342,
          25489
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-frostbrand-weapon",
        "label": "Frostbrand Weapon",
        "raw": "Frostbrand Weapon [8033*,8038*,10456*,16355*,16356*,25500] {1.5}",
        "spellIds": [
          8033,
          8038,
          10456,
          16355,
          16356,
          25500
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-rockbiter-weapon",
        "label": "Rockbiter Weapon",
        "raw": "Rockbiter Weapon [8017*,8018*,8019*,10399*,16314*,16315*,16316*,25479*,25485] {1.5}",
        "spellIds": [
          8017,
          8018,
          8019,
          10399,
          16314,
          16315,
          16316,
          25479,
          25485
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-windfury-weapon",
        "label": "Windfury Weapon",
        "raw": "Windfury Weapon [8232*,8235*,10486*,16362*,25505] {1.5}",
        "spellIds": [
          8232,
          8235,
          10486,
          16362,
          25505
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-stormstrike",
        "label": "Stormstrike",
        "raw": "Stormstrike [17364] {0}",
        "spellIds": [
          17364
        ],
        "modifiers": {
          "baseCastTime": 0
        }
      },
      {
        "id": "shaman-singletargetcasts-melee-excluded-from-activity",
        "label": "Melee - excluded from activity",
        "raw": "Melee - excluded from activity [1] {0}",
        "spellIds": [
          1
        ],
        "modifiers": {
          "baseCastTime": 0
        }
      },
      {
        "id": "shaman-singletargetcasts-earth-shield-uptime-total",
        "label": "Earth Shield (uptime total%)",
        "raw": "Earth Shield (uptime total%) [974*,32593*,32594] {1.5}",
        "spellIds": [
          974,
          32593,
          32594
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-water-shield-uptime-total",
        "label": "Water Shield (uptime total%)",
        "raw": "Water Shield (uptime total%) [24398*,33736] {1.5}",
        "spellIds": [
          24398,
          33736
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-healing-stream-totem",
        "label": "Healing Stream Totem",
        "raw": "Healing Stream Totem [5394*,6375*,6377*,10462*,10463*,25567] {1.5}",
        "spellIds": [
          5394,
          6375,
          6377,
          10462,
          10463,
          25567
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-mana-spring-totem",
        "label": "Mana Spring Totem",
        "raw": "Mana Spring Totem [5675*,10495*,10496*,10497*,25570] {1.5}",
        "spellIds": [
          5675,
          10495,
          10496,
          10497,
          25570
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-healing-wave-rank-12-overheal",
        "label": "Healing Wave (rank 12) (overheal%)",
        "raw": "Healing Wave (rank 12) (overheal%) [25396] {3}",
        "spellIds": [
          25396
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      },
      {
        "id": "shaman-singletargetcasts-healing-wave-rank-7-11-overheal",
        "label": "Healing Wave (rank 7-11) (overheal%)",
        "raw": "Healing Wave (rank 7-11) (overheal%) [8005,10395,10396,25357,25391] {3}",
        "spellIds": [
          8005,
          10395,
          10396,
          25357,
          25391
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      },
      {
        "id": "shaman-singletargetcasts-healing-wave-rank-1-6-overheal",
        "label": "Healing Wave (rank 1-6) (overheal%)",
        "raw": "Healing Wave (rank 1-6) (overheal%) [331,332,547,913,939,959] {2.5}",
        "spellIds": [
          331,
          332,
          547,
          913,
          939,
          959
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      },
      {
        "id": "shaman-singletargetcasts-lesser-healing-wave-rank-7-overheal",
        "label": "Lesser Healing Wave (rank 7) (overheal%)",
        "raw": "Lesser Healing Wave (rank 7) (overheal%) [25420] {1.5}",
        "spellIds": [
          25420
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-singletargetcasts-lesser-healing-wave-rank-1-6-overheal",
        "label": "Lesser Healing Wave (rank 1-6) (overheal%)",
        "raw": "Lesser Healing Wave (rank 1-6) (overheal%) [10468,10467,10466,8010,8008,8004] {1.5}",
        "spellIds": [
          10468,
          10467,
          10466,
          8010,
          8008,
          8004
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      }
    ]
  },
  {
    "section": "Shaman:aoeCasts",
    "rows": [
      {
        "id": "shaman-aoecasts-chain-heal-rank-5-overheal",
        "label": "Chain Heal (rank 5) (overheal%)",
        "raw": "Chain Heal (rank 5) (overheal%) [25423] {2.5}",
        "spellIds": [
          25423
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      },
      {
        "id": "shaman-aoecasts-chain-heal-rank-4-overheal",
        "label": "Chain Heal (rank 4) (overheal%)",
        "raw": "Chain Heal (rank 4) (overheal%) [25422] {2.5}",
        "spellIds": [
          25422
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      },
      {
        "id": "shaman-aoecasts-chain-heal-rank-3-overheal",
        "label": "Chain Heal (rank 3) (overheal%)",
        "raw": "Chain Heal (rank 3) (overheal%) [10623] {2.5}",
        "spellIds": [
          10623
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      },
      {
        "id": "shaman-aoecasts-chain-heal-rank-2-overheal",
        "label": "Chain Heal (rank 2) (overheal%)",
        "raw": "Chain Heal (rank 2) (overheal%) [10622] {2.5}",
        "spellIds": [
          10622
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      },
      {
        "id": "shaman-aoecasts-chain-heal-rank-1-overheal",
        "label": "Chain Heal (rank 1) (overheal%)",
        "raw": "Chain Heal (rank 1) (overheal%) [1064] {2.5}",
        "spellIds": [
          1064
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      },
      {
        "id": "shaman-aoecasts-chain-lightning",
        "label": "Chain Lightning",
        "raw": "Chain Lightning [421*,930*,2860*,10605*,25439*,25442] {2}",
        "spellIds": [
          421,
          930,
          2860,
          10605,
          25439,
          25442
        ],
        "modifiers": {
          "baseCastTime": 2
        }
      },
      {
        "id": "shaman-aoecasts-fire-nova-totem",
        "label": "Fire Nova Totem",
        "raw": "Fire Nova Totem [1535*,8498*,8499*,11314*,11315*,25546*,25547] {1.5}",
        "spellIds": [
          1535,
          8498,
          8499,
          11314,
          11315,
          25546,
          25547
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "shaman-aoecasts-magma-totem",
        "label": "Magma Totem",
        "raw": "Magma Totem [8190*,10585*,10586*,10587*,25552] {1.5}",
        "spellIds": [
          8190,
          10585,
          10586,
          10587,
          25552
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      }
    ]
  },
  {
    "section": "Shaman:classCooldowns",
    "rows": [
      {
        "id": "shaman-classcooldowns-blessing-of-protection",
        "label": "Blessing of Protection",
        "raw": "Blessing of Protection [10278] --300--",
        "spellIds": [
          10278
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      },
      {
        "id": "shaman-classcooldowns-bloodlust",
        "label": "Bloodlust",
        "raw": "Bloodlust [2825] --600-- ++40++",
        "spellIds": [
          2825
        ],
        "modifiers": {
          "cooldownSec": 600,
          "buffDurationSec": 40
        }
      },
      {
        "id": "shaman-classcooldowns-heroism",
        "label": "Heroism",
        "raw": "Heroism [32182] --600-- ++40++",
        "spellIds": [
          32182
        ],
        "modifiers": {
          "cooldownSec": 600,
          "buffDurationSec": 40
        }
      },
      {
        "id": "shaman-classcooldowns-innervate",
        "label": "Innervate",
        "raw": "Innervate [29166] --360-- ++20++",
        "spellIds": [
          29166
        ],
        "modifiers": {
          "cooldownSec": 360,
          "buffDurationSec": 20
        }
      },
      {
        "id": "shaman-classcooldowns-power-infusion",
        "label": "Power Infusion",
        "raw": "Power Infusion [10060] --180-- ++15++",
        "spellIds": [
          10060
        ],
        "modifiers": {
          "cooldownSec": 180,
          "buffDurationSec": 15
        }
      },
      {
        "id": "shaman-classcooldowns-elemental-mastery",
        "label": "Elemental Mastery",
        "raw": "Elemental Mastery [16166] --180--",
        "spellIds": [
          16166
        ],
        "modifiers": {
          "cooldownSec": 180
        }
      },
      {
        "id": "shaman-classcooldowns-mana-tide-totem",
        "label": "Mana Tide Totem",
        "raw": "Mana Tide Totem [16190] --300--",
        "spellIds": [
          16190
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      },
      {
        "id": "shaman-classcooldowns-nature-s-swiftness",
        "label": "Nature's Swiftness",
        "raw": "Nature's Swiftness [16188] --180--",
        "spellIds": [
          16188
        ],
        "modifiers": {
          "cooldownSec": 180
        }
      },
      {
        "id": "shaman-classcooldowns-shamanistic-rage",
        "label": "Shamanistic Rage",
        "raw": "Shamanistic Rage [30823] --120-- ++15++",
        "spellIds": [
          30823
        ],
        "modifiers": {
          "cooldownSec": 120,
          "buffDurationSec": 15
        }
      }
    ]
  },
  {
    "section": "Warlock:singleTargetCasts",
    "rows": [
      {
        "id": "warlock-singletargetcasts-armor",
        "label": "Armor",
        "raw": "Armor [706*,1086*,11733*,11734*,11735*,28176*,28189,27260] {1.5}",
        "spellIds": [
          706,
          1086,
          11733,
          11734,
          11735,
          28176,
          28189,
          27260
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-banish",
        "label": "Banish",
        "raw": "Banish [710,18647] {1.5}",
        "spellIds": [
          710,
          18647
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-conflagrate",
        "label": "Conflagrate",
        "raw": "Conflagrate [17962*,18930*,18931*,18932*,27266*,30912] {1.5}",
        "spellIds": [
          17962,
          18930,
          18931,
          18932,
          27266,
          30912
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-corruption",
        "label": "Corruption",
        "raw": "Corruption [172*,6222*,6223*,7648*,11671*,11672*,25311*,27216] {1.5}",
        "spellIds": [
          172,
          6222,
          6223,
          7648,
          11671,
          11672,
          25311,
          27216
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-curse-of-agony",
        "label": "Curse of Agony",
        "raw": "Curse of Agony [980*,1014*,6217*,11711*,11712*,11713*,27218] {1.5}",
        "spellIds": [
          980,
          1014,
          6217,
          11711,
          11712,
          11713,
          27218
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-curse-of-doom",
        "label": "Curse of Doom",
        "raw": "Curse of Doom [603*,30910] {1.5}",
        "spellIds": [
          603,
          30910
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-curse-of-recklessness-uptime",
        "label": "Curse of Recklessness (uptime%)",
        "raw": "Curse of Recklessness (uptime%) [704*,7658*,7659*,11717*,27226] {1.5}",
        "spellIds": [
          704,
          7658,
          7659,
          11717,
          27226
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-curse-of-the-elements-uptime",
        "label": "Curse of the Elements (uptime%)",
        "raw": "Curse of the Elements (uptime%) [1490*,11721*,11722*,27228] {1.5}",
        "spellIds": [
          1490,
          11721,
          11722,
          27228
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-curse-of-tongues",
        "label": "Curse of Tongues",
        "raw": "Curse of Tongues [1714*,11719] {1.5}",
        "spellIds": [
          1714,
          11719
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-curse-of-weakness",
        "label": "Curse of Weakness",
        "raw": "Curse of Weakness [702*,1108*,6205*,7646*,11707*,11708*,27224*,30909] {1.5}",
        "spellIds": [
          702,
          1108,
          6205,
          7646,
          11707,
          11708,
          27224,
          30909
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-dark-pact",
        "label": "Dark Pact",
        "raw": "Dark Pact [18220*,18937*,18938*,27265] {1.5}",
        "spellIds": [
          18220,
          18937,
          18938,
          27265
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-death-coil",
        "label": "Death Coil",
        "raw": "Death Coil [6789*,17925*,17926*,27223] {1.5}",
        "spellIds": [
          6789,
          17925,
          17926,
          27223
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-drain-life",
        "label": "Drain Life",
        "raw": "Drain Life [689*,699*,709*,7651*,11699*,11700*,27219*,27220] {2.5}",
        "spellIds": [
          689,
          699,
          709,
          7651,
          11699,
          11700,
          27219,
          27220
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      },
      {
        "id": "warlock-singletargetcasts-drain-mana",
        "label": "Drain Mana",
        "raw": "Drain Mana [5138*,6226*,11703*,11704*,27221*,30908] {2.5}",
        "spellIds": [
          5138,
          6226,
          11703,
          11704,
          27221,
          30908
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      },
      {
        "id": "warlock-singletargetcasts-drain-soul",
        "label": "Drain Soul",
        "raw": "Drain Soul [1120,8288*,8289*,11675*,27217] {1.5}",
        "spellIds": [
          1120,
          8288,
          8289,
          11675,
          27217
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-fear",
        "label": "Fear",
        "raw": "Fear [5782*,6213*,6215] {1.5}",
        "spellIds": [
          5782,
          6213,
          6215
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-health-funnel",
        "label": "Health Funnel",
        "raw": "Health Funnel [755*,3698*,3699*,3700*,11693*,11694*,11695*,27259] {3}",
        "spellIds": [
          755,
          3698,
          3699,
          3700,
          11693,
          11694,
          11695,
          27259
        ],
        "modifiers": {
          "baseCastTime": 3
        }
      },
      {
        "id": "warlock-singletargetcasts-immolate",
        "label": "Immolate",
        "raw": "Immolate [348*,707*,1094*,2941*,11665*,11667*,11668*,25309*,27215] {1.5}",
        "spellIds": [
          348,
          707,
          1094,
          2941,
          11665,
          11667,
          11668,
          25309,
          27215
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-incinerate",
        "label": "Incinerate",
        "raw": "Incinerate [29722*,32231] {2.5}",
        "spellIds": [
          29722,
          32231
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      },
      {
        "id": "warlock-singletargetcasts-life-tap",
        "label": "Life Tap",
        "raw": "Life Tap [1454,1455,1456,11687,11688,11689,27222] {1.5}",
        "spellIds": [
          1454,
          1455,
          1456,
          11687,
          11688,
          11689,
          27222
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-searing-pain",
        "label": "Searing Pain",
        "raw": "Searing Pain [5676*,17919*,17920*,17921*,17922*,17923*,27210*,30459] {1.5}",
        "spellIds": [
          5676,
          17919,
          17920,
          17921,
          17922,
          17923,
          27210,
          30459
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-shadow-bolt",
        "label": "Shadow Bolt",
        "raw": "Shadow Bolt [686*,695*,705*,1088*,1106*,7641*,11659*,11660*,11661*,25307*,27209] {2.5}",
        "spellIds": [
          686,
          695,
          705,
          1088,
          1106,
          7641,
          11659,
          11660,
          11661,
          25307,
          27209
        ],
        "modifiers": {
          "baseCastTime": 2.5
        }
      },
      {
        "id": "warlock-singletargetcasts-shadowburn",
        "label": "Shadowburn",
        "raw": "Shadowburn [17877*,18867*,18868*,18869*,18870*,18871*,27263*,30546] {1.5}",
        "spellIds": [
          17877,
          18867,
          18868,
          18869,
          18870,
          18871,
          27263,
          30546
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-shadowfury",
        "label": "Shadowfury",
        "raw": "Shadowfury [30283*,30413*,30414] {0.5}",
        "spellIds": [
          30283,
          30413,
          30414
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      },
      {
        "id": "warlock-singletargetcasts-siphon-life",
        "label": "Siphon Life",
        "raw": "Siphon Life [18265*,18879*,18880*,18881*,27264*,30911] {4.5}",
        "spellIds": [
          18265,
          18879,
          18880,
          18881,
          27264,
          30911
        ],
        "modifiers": {
          "baseCastTime": 4.5
        }
      },
      {
        "id": "warlock-singletargetcasts-soul-fire",
        "label": "Soul Fire",
        "raw": "Soul Fire [6353*,17924*,27211*,30545] {4}",
        "spellIds": [
          6353,
          17924,
          27211,
          30545
        ],
        "modifiers": {
          "baseCastTime": 4
        }
      },
      {
        "id": "warlock-singletargetcasts-soul-link",
        "label": "Soul Link",
        "raw": "Soul Link [19028] {1.5}",
        "spellIds": [
          19028
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-unstable-affliction",
        "label": "Unstable Affliction",
        "raw": "Unstable Affliction [30108*,30404*,30405] {1.5}",
        "spellIds": [
          30108,
          30404,
          30405
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warlock-singletargetcasts-melee-excluded-from-activity",
        "label": "Melee - excluded from activity!",
        "raw": "Melee - excluded from activity! [1] {0}",
        "spellIds": [
          1
        ],
        "modifiers": {
          "baseCastTime": 0
        }
      },
      {
        "id": "warlock-singletargetcasts-shoot-wand",
        "label": "Shoot (wand)",
        "raw": "Shoot (wand) [5019] {1.5}",
        "spellIds": [
          5019
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      }
    ]
  },
  {
    "section": "Warlock:aoeCasts",
    "rows": [
      {
        "id": "warlock-aoecasts-hellfire",
        "label": "Hellfire",
        "raw": "Hellfire [11684*,11683*,1949*,27213] {7.5}",
        "spellIds": [
          11684,
          11683,
          1949,
          27213
        ],
        "modifiers": {
          "baseCastTime": 7.5
        }
      },
      {
        "id": "warlock-aoecasts-rain-of-fire",
        "label": "Rain of Fire",
        "raw": "Rain of Fire [5740*,6219*,11677*,11678*,27212] {4}",
        "spellIds": [
          5740,
          6219,
          11677,
          11678,
          27212
        ],
        "modifiers": {
          "baseCastTime": 4
        }
      },
      {
        "id": "warlock-aoecasts-seed-of-corruption",
        "label": "Seed of Corruption",
        "raw": "Seed of Corruption [27243] {2}",
        "spellIds": [
          27243
        ],
        "modifiers": {
          "baseCastTime": 2
        }
      }
    ]
  },
  {
    "section": "Warlock:classCooldowns",
    "rows": [
      {
        "id": "warlock-classcooldowns-blessing-of-protection",
        "label": "Blessing of Protection",
        "raw": "Blessing of Protection [10278] --300--",
        "spellIds": [
          10278
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      },
      {
        "id": "warlock-classcooldowns-bloodlust",
        "label": "Bloodlust",
        "raw": "Bloodlust [2825] --600-- ++40++",
        "spellIds": [
          2825
        ],
        "modifiers": {
          "cooldownSec": 600,
          "buffDurationSec": 40
        }
      },
      {
        "id": "warlock-classcooldowns-heroism",
        "label": "Heroism",
        "raw": "Heroism [32182] --600-- ++40++",
        "spellIds": [
          32182
        ],
        "modifiers": {
          "cooldownSec": 600,
          "buffDurationSec": 40
        }
      },
      {
        "id": "warlock-classcooldowns-innervate",
        "label": "Innervate",
        "raw": "Innervate [29166] --360-- ++20++",
        "spellIds": [
          29166
        ],
        "modifiers": {
          "cooldownSec": 360,
          "buffDurationSec": 20
        }
      },
      {
        "id": "warlock-classcooldowns-amplify-curse",
        "label": "Amplify Curse",
        "raw": "Amplify Curse [18288] --180-- ++30++",
        "spellIds": [
          18288
        ],
        "modifiers": {
          "cooldownSec": 180,
          "buffDurationSec": 30
        }
      },
      {
        "id": "warlock-classcooldowns-power-infusion",
        "label": "Power Infusion",
        "raw": "Power Infusion [10060] --180-- ++20++",
        "spellIds": [
          10060
        ],
        "modifiers": {
          "cooldownSec": 180,
          "buffDurationSec": 20
        }
      },
      {
        "id": "warlock-classcooldowns-soulshatter",
        "label": "Soulshatter",
        "raw": "Soulshatter [29858] --300--",
        "spellIds": [
          29858
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      }
    ]
  },
  {
    "section": "Warrior:singleTargetCasts",
    "rows": [
      {
        "id": "warrior-singletargetcasts-battle-shout-uptime-by-you-total",
        "label": "Battle Shout (uptime by you total%)",
        "raw": "Battle Shout (uptime by you total%) [6673*,5242*,6192*,11549*,11550*,11551*,25289*,2048] {1.5}",
        "spellIds": [
          6673,
          5242,
          6192,
          11549,
          11550,
          11551,
          25289,
          2048
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-berserker-stance",
        "label": "Berserker Stance",
        "raw": "Berserker Stance [2458] {1}",
        "spellIds": [
          2458
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "warrior-singletargetcasts-bloodthirst",
        "label": "Bloodthirst",
        "raw": "Bloodthirst [23881*,23892*,23893*,23894*,25251*,30335] {1.5}",
        "spellIds": [
          23881,
          23892,
          23893,
          23894,
          25251,
          30335
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-charge",
        "label": "Charge",
        "raw": "Charge [100*,6178*,11578] {0.5}",
        "spellIds": [
          100,
          6178,
          11578
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      },
      {
        "id": "warrior-singletargetcasts-commanding-shout-uptime-by-you-total",
        "label": "Commanding Shout (uptime by you total%)",
        "raw": "Commanding Shout (uptime by you total%) [469] {1.5}",
        "spellIds": [
          469
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-concussion-blow",
        "label": "Concussion Blow",
        "raw": "Concussion Blow [12809] {0.5}",
        "spellIds": [
          12809
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      },
      {
        "id": "warrior-singletargetcasts-defensive-stance",
        "label": "Defensive Stance",
        "raw": "Defensive Stance [71] {1}",
        "spellIds": [
          71
        ],
        "modifiers": {
          "baseCastTime": 1
        }
      },
      {
        "id": "warrior-singletargetcasts-demoralizing-shout-uptime",
        "label": "Demoralizing Shout (uptime%)",
        "raw": "Demoralizing Shout (uptime%) [1160*,6190*,11554*,11555*,11556*,25202*,25203] {1.5}",
        "spellIds": [
          1160,
          6190,
          11554,
          11555,
          11556,
          25202,
          25203
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-devastate",
        "label": "Devastate",
        "raw": "Devastate [20243*,30016*,30022] {1.5}",
        "spellIds": [
          20243,
          30016,
          30022
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-disarm",
        "label": "Disarm",
        "raw": "Disarm [676] {1.5}",
        "spellIds": [
          676
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-execute",
        "label": "Execute",
        "raw": "Execute [5308*,20658*,20660*,20661*,20647,25234*,25236] {1.5}",
        "spellIds": [
          5308,
          20658,
          20660,
          20661,
          20647,
          25234,
          25236
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-hamstring-flurry-uptime-total",
        "label": "Hamstring (Flurry uptime total%)",
        "raw": "Hamstring (Flurry uptime total%) [1715*,7372*,7373*,25212] {1.5}",
        "spellIds": [
          1715,
          7372,
          7373,
          25212
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-heroic-strike-excluded-from-activity",
        "label": "Heroic Strike - excluded from activity",
        "raw": "Heroic Strike - excluded from activity [78*,284*,285*,1608*,11564*,11565*,11566*,11567*,25286*,29707] {0}",
        "spellIds": [
          78,
          284,
          285,
          1608,
          11564,
          11565,
          11566,
          11567,
          25286,
          29707
        ],
        "modifiers": {
          "baseCastTime": 0
        }
      },
      {
        "id": "warrior-singletargetcasts-intercept",
        "label": "Intercept",
        "raw": "Intercept [20252*,20616*,20617*,25272*,25275] {0.5}",
        "spellIds": [
          20252,
          20616,
          20617,
          25272,
          25275
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      },
      {
        "id": "warrior-singletargetcasts-intimidating-shout",
        "label": "Intimidating Shout",
        "raw": "Intimidating Shout [5246] {1.5}",
        "spellIds": [
          5246
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-intervene",
        "label": "Intervene",
        "raw": "Intervene [3411] {0.5}",
        "spellIds": [
          3411
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      },
      {
        "id": "warrior-singletargetcasts-mocking-blow",
        "label": "Mocking Blow",
        "raw": "Mocking Blow [694*,7400*,7402*,20559*,20560*,25266] {1.5}",
        "spellIds": [
          694,
          7400,
          7402,
          20559,
          20560,
          25266
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-mortal-strike",
        "label": "Mortal Strike",
        "raw": "Mortal Strike [12294*,21551*,21552*,21553*,25248*,30330] {1.5}",
        "spellIds": [
          12294,
          21551,
          21552,
          21553,
          25248,
          30330
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-overpower",
        "label": "Overpower",
        "raw": "Overpower [7384*,7887*,11584*,11585] {1.5}",
        "spellIds": [
          7384,
          7887,
          11584,
          11585
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-pummel",
        "label": "Pummel",
        "raw": "Pummel [6552*,6554] {1.5}",
        "spellIds": [
          6552,
          6554
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-rampage",
        "label": "Rampage",
        "raw": "Rampage [29801*,30030*,30033] {1.5}",
        "spellIds": [
          29801,
          30030,
          30033
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-rend",
        "label": "Rend",
        "raw": "Rend [772*,6546*,6547*,6548*,11572*,11573*,11574*,25208] {1.5}",
        "spellIds": [
          772,
          6546,
          6547,
          6548,
          11572,
          11573,
          11574,
          25208
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-revenge",
        "label": "Revenge",
        "raw": "Revenge [6572*,6574*,7379*,11600*,11601*,25288*,25269*,30357] {1.5}",
        "spellIds": [
          6572,
          6574,
          7379,
          11600,
          11601,
          25288,
          25269,
          30357
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-shield-bash",
        "label": "Shield Bash",
        "raw": "Shield Bash [72*,1671*,1672*,29704] {1.5}",
        "spellIds": [
          72,
          1671,
          1672,
          29704
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-shield-block",
        "label": "Shield Block",
        "raw": "Shield Block [2565] {0.5}",
        "spellIds": [
          2565
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      },
      {
        "id": "warrior-singletargetcasts-shield-slam",
        "label": "Shield Slam",
        "raw": "Shield Slam [23925*,25258*,30356] {1.5}",
        "spellIds": [
          23925,
          25258,
          30356
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-slam",
        "label": "Slam",
        "raw": "Slam [1464*,8820*,11604*,11605*,25241*,25242] {1.5}",
        "spellIds": [
          1464,
          8820,
          11604,
          11605,
          25241,
          25242
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-spell-reflection",
        "label": "Spell Reflection",
        "raw": "Spell Reflection [23920] {0.5}",
        "spellIds": [
          23920
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      },
      {
        "id": "warrior-singletargetcasts-sunder-armor-uptime",
        "label": "Sunder Armor (uptime%)",
        "raw": "Sunder Armor (uptime%) [7386*,7405*,8380*,11596*,11597*,25225] {1.5}",
        "spellIds": [
          7386,
          7405,
          8380,
          11596,
          11597,
          25225
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-sunder-armor-on-targets-5-stacks",
        "label": "Sunder Armor% on targets < 5 stacks",
        "raw": "Sunder Armor% on targets < 5 stacks [99999] {0}",
        "spellIds": [
          99999
        ],
        "modifiers": {
          "baseCastTime": 0
        }
      },
      {
        "id": "warrior-singletargetcasts-sweeping-strikes",
        "label": "Sweeping Strikes",
        "raw": "Sweeping Strikes [12328] {0}",
        "spellIds": [
          12328
        ],
        "modifiers": {
          "baseCastTime": 0
        }
      },
      {
        "id": "warrior-singletargetcasts-taunt",
        "label": "Taunt",
        "raw": "Taunt [355] {0.5}",
        "spellIds": [
          355
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      },
      {
        "id": "warrior-singletargetcasts-thunder-clap-uptime",
        "label": "Thunder Clap (uptime%)",
        "raw": "Thunder Clap (uptime%) [6343*,8198*,8204*,8205*,11580*,11581*,25264] {1.5}",
        "spellIds": [
          6343,
          8198,
          8204,
          8205,
          11580,
          11581,
          25264
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-victory-rush",
        "label": "Victory Rush",
        "raw": "Victory Rush [34428] {1.5}",
        "spellIds": [
          34428
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      },
      {
        "id": "warrior-singletargetcasts-melee-deep-wounds-uptime-total",
        "label": "Melee (Deep Wounds uptime total%)",
        "raw": "Melee (Deep Wounds uptime total%) [1] {0}",
        "spellIds": [
          1
        ],
        "modifiers": {
          "baseCastTime": 0
        }
      }
    ]
  },
  {
    "section": "Warrior:aoeCasts",
    "rows": [
      {
        "id": "warrior-aoecasts-cleave",
        "label": "Cleave",
        "raw": "Cleave [845*,7369*,11608*,11609*,20569*,25231] {0.5}",
        "spellIds": [
          845,
          7369,
          11608,
          11609,
          20569,
          25231
        ],
        "modifiers": {
          "baseCastTime": 0.5
        }
      },
      {
        "id": "warrior-aoecasts-whirlwind",
        "label": "Whirlwind",
        "raw": "Whirlwind [1680] {1.5}",
        "spellIds": [
          1680
        ],
        "modifiers": {
          "baseCastTime": 1.5
        }
      }
    ]
  },
  {
    "section": "Warrior:classCooldowns",
    "rows": [
      {
        "id": "warrior-classcooldowns-blessing-of-protection",
        "label": "Blessing of Protection",
        "raw": "Blessing of Protection [10278] --300--",
        "spellIds": [
          10278
        ],
        "modifiers": {
          "cooldownSec": 300
        }
      },
      {
        "id": "warrior-classcooldowns-bloodlust",
        "label": "Bloodlust",
        "raw": "Bloodlust [2825] --600-- ++40++",
        "spellIds": [
          2825
        ],
        "modifiers": {
          "cooldownSec": 600,
          "buffDurationSec": 40
        }
      },
      {
        "id": "warrior-classcooldowns-heroism",
        "label": "Heroism",
        "raw": "Heroism [32182] --600-- ++40++",
        "spellIds": [
          32182
        ],
        "modifiers": {
          "cooldownSec": 600,
          "buffDurationSec": 40
        }
      },
      {
        "id": "warrior-classcooldowns-berserker-rage",
        "label": "Berserker Rage",
        "raw": "Berserker Rage [18499] --30--",
        "spellIds": [
          18499
        ],
        "modifiers": {
          "cooldownSec": 30
        }
      },
      {
        "id": "warrior-classcooldowns-bloodrage",
        "label": "Bloodrage",
        "raw": "Bloodrage [2687] --60--",
        "spellIds": [
          2687
        ],
        "modifiers": {
          "cooldownSec": 60
        }
      },
      {
        "id": "warrior-classcooldowns-challenging-shout",
        "label": "Challenging Shout",
        "raw": "Challenging Shout [1161] --600--",
        "spellIds": [
          1161
        ],
        "modifiers": {
          "cooldownSec": 600
        }
      },
      {
        "id": "warrior-classcooldowns-death-wish",
        "label": "Death Wish",
        "raw": "Death Wish [12292] --180-- ++30++",
        "spellIds": [
          12292
        ],
        "modifiers": {
          "cooldownSec": 180,
          "buffDurationSec": 30
        }
      },
      {
        "id": "warrior-classcooldowns-last-stand",
        "label": "Last Stand",
        "raw": "Last Stand [12975] --600--",
        "spellIds": [
          12975
        ],
        "modifiers": {
          "cooldownSec": 600
        }
      },
      {
        "id": "warrior-classcooldowns-recklessness",
        "label": "Recklessness",
        "raw": "Recklessness [1719] --1800-- ++15++",
        "spellIds": [
          1719
        ],
        "modifiers": {
          "cooldownSec": 1800,
          "buffDurationSec": 15
        }
      },
      {
        "id": "warrior-classcooldowns-shield-wall",
        "label": "Shield Wall",
        "raw": "Shield Wall [871] --1800--",
        "spellIds": [
          871
        ],
        "modifiers": {
          "cooldownSec": 1800
        }
      }
    ]
  }
];
