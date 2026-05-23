// All URL builders for the WCL v1 endpoints that the RPB script touches.
// Mirrors RPB.gs:104-181. Keeping them here as pure builders lets the analysis
// layer focus on logic.

import type { FilterMode, Lang } from "../types/index.js";

const HOSTS: Record<Lang, string> = {
  EN: "classic.warcraftlogs.com",
  DE: "de.classic.warcraftlogs.com",
  CN: "cn.classic.warcraftlogs.com",
  RU: "ru.classic.warcraftlogs.com",
  FR: "fr.classic.warcraftlogs.com",
};

export interface EndpointContext {
  lang: Lang;
  apiKey: string;
  logId: string;
  mode: FilterMode;
  noWipes: boolean;
}

/** Filter that excludes the perennially broken encounter id 724 (cf. RPB.gs:105). */
export const ENCOUNTER_FILTER_NOT_724 = "encounterid%20%21%3D%20724";

export function makeUrls(ctx: EndpointContext) {
  const { lang, apiKey, logId, mode, noWipes } = ctx;
  const host = HOSTS[lang];
  const base = `https://${host}:443/v1/`;
  const baseFrontEnd = `https://${host}/reports/`;

  const startEndStringNoFilter = `&start=0&end=999999999999`;
  const startEndString = `${startEndStringNoFilter}&filter=${ENCOUNTER_FILTER_NOT_724}`;

  let apiKeyString = `?translate=true&api_key=${encodeURIComponent(apiKey)}`;
  if (mode === "onlyBosses") apiKeyString += "&encounter=-2";
  if (mode === "onlyTrash") apiKeyString += "&encounter=0";
  if (noWipes) apiKeyString += "&wipes=2";

  const build = (path: string, extras = "") =>
    `${base}${path}/${logId}${apiKeyString}${extras}`;

  return {
    base,
    baseFrontEnd,
    apiKeyString,
    startEndString,
    startEndStringNoFilter,

    // global queries
    fights: `${base}report/fights/${logId}${apiKeyString}`,
    damageTakenTop: build("report/tables/damage-taken", `${startEndString}&options=4098&by=ability`),
    debuffsTop: build("report/tables/debuffs", `${startEndString}&options=2&hostility=1&by=target`),
    peopleTracked: build("report/tables/casts", startEndString),
    debuffInfoPrefix: build("report/tables/debuffs", `${startEndString}&options=2&hostility=1&by=target&abilityid=`),
    playersOnTrashPrefix: build("report/tables/casts", `${startEndString}&encounter=0&sourceid=`),
    playersRacials: build("report/tables/casts", `${startEndStringNoFilter}&filter=ability.id%3D7744%20OR%20ability.id%3D20554%20OR%20ability.id%3D20549%20OR%20ability.id%3D20572`),
    playersPrefix: build("report/tables/casts", `${startEndString}&sourceid=`),
    sunderArmorBelow5: build("report/tables/casts", `${startEndStringNoFilter}&filter=ability.id%3D25225%20AND%20NOT%20IN%20RANGE%20FROM%20type%20%3D%20%22applydebuffstack%22%20AND%20ability.id%20%3D%2025225%20AND%20stack%20%3D%205%20TO%20type%3D%22removedebuff%22%20AND%20ability.id%3D25225%20GROUP%20BY%20target%20ON%20target%20END%20AND%20${ENCOUNTER_FILTER_NOT_724}&by=source`),
    scorchBelow5: build("report/tables/casts", `${startEndStringNoFilter}&filter=ability.id%20IN%20%2827073,27074,10207,10206,10205,8446,8445,8444,2948%29%20AND%20NOT%20IN%20RANGE%20FROM%20type%20%3D%20%22applydebuffstack%22%20AND%20ability.id%20%3D%2022959%20AND%20stack%20%3D%205%20TO%20type%3D%22removedebuff%22%20AND%20ability.id%3D22959%20GROUP%20BY%20target%20END%20AND%20${ENCOUNTER_FILTER_NOT_724}&by=source`),
    summary: build("report/tables/summary", startEndString),
    damageDonePrefix: build("report/tables/damage-done", `${startEndString}&options=2&sourceid=`),
    buffsOnTrashPrefix: build("report/tables/buffs", `${startEndString}&by=target&encounter=0&targetid=`),
    buffsTotalPrefix: build("report/tables/buffs", `${startEndString}&by=target&targetid=`),
    deathsOnTrash: build("report/tables/deaths", `${startEndString}&encounter=0`),
    deathsPrefix: build("report/tables/deaths", `${startEndString}&sourceid=`),
    damageTakenOilOfImmo: build("report/tables/damage-taken", `${startEndString}&hostility=1&abilityid=11351&by=target`),
    damageTakenEngineering: build("report/tables/damage-taken", `${startEndStringNoFilter}&hostility=1&filter=ability.id%20IN%20%2823063%2C13241%2C17291%2C30486%2C4062%2C19821%2C15239%2C19784%2C12543%2C30461%2C30217%2C39965%2C4068%2C19769%2C4100%2C30216%2C22792%2C30526%2C4072%2C19805%2C27661%2C23000%2C11350%29%20AND%20${ENCOUNTER_FILTER_NOT_724}&by=target`),
    damageTakenTotalPrefix: build("report/tables/damage-taken", `${startEndString}&options=4134&sourceid=`),
    debuffsPrefix: build("report/tables/debuffs", `${startEndString}&options=2&hostility=1&by=target&targetid=`),
    debuffsAppliedPrefix: build("report/tables/debuffs", `${startEndString}&hostility=1&targetid=`),
    debuffsAppliedTotal: build("report/tables/debuffs", `${startEndString}&hostility=1`),
    debuffsAppliedBossesPrefix: build("report/tables/debuffs", `${startEndString}&encounter=-2&hostility=1&targetid=`),
    debuffsAppliedBossesJudgementPrefix: build("report/tables/debuffs", `${startEndStringNoFilter}&encounter=-2&hostility=1&filter=ability.id%20IN%20%2827164%2C27162%2C31898%2C41461%2C32220%2C27172%2C27171%2C356112%2C31896%2C27162%2C27163%2C27164%2C27165%2C31804%2C27159%2C27157%2C348702%29%20AND%20${ENCOUNTER_FILTER_NOT_724}&targetid=`),
    debuffsAppliedBossesTotal: build("report/tables/debuffs", `${startEndString}&encounter=-2&hostility=1`),
    hostilePlayers: build("report/tables/damage-done", `${startEndString}&targetclass=player&by=source`),
    healingPrefix: build("report/tables/healing", `${startEndString}&sourceid=`),
    healingTargetPrefix: build("report/tables/healing", `${startEndString}&targetid=`),
    damageReflected: build("report/tables/damage-taken", `${startEndStringNoFilter}&filter=target.name%3Dsource.name%20AND%20ability.id!%3D%27348191%27%20AND%20ability.id!%3D%2716666%27%20AND%20ability.id!%3D%2711684%27%20AND%20ability.id!%3D%2711683%27%20AND%20ability.id!%3D%271949%27%20AND%20ability.id!%3D%2726557%27%20AND%20ability.id!%3D%2728622%27%20AND%20ability.id!%3D%27290025%27%20AND%20ability.id!%3D%2727869%27%20AND%20ability.id!%3D%2716666%27%20AND%20ability.id!%3D%2713241%27AND%20ability.id!%3D%2720476%27AND%20ability.id!%3D%2732221%27AND%20ability.id!%3D%2732220%27AND%20ability.id!%3D%2730486%27AND%20ability.id!%3D%27351761%27AND%20ability.id!%3D%2737852%27AND%20ability.id!%3D%2727213%27AND%20ability.id!%3D%2738281%27AND%20ability.id!%3D%2729766%27AND%20ability.id!%3D%27348703%27AND%20ability.id!%3D%2741352%27AND%20ability.id!%3D%2740871%27AND%20ability.id!%3D%27348703%27AND%20ability.id!%3D%2741352%27AND%20ability.id!%3D%2745348%27AND%20ability.id!%3D%2741352%27AND%20ability.id!%3D%2745034%27AND%20ability.id!%3D%2745642%27%20AND%20${ENCOUNTER_FILTER_NOT_724}`),
    interrupted: build("report/tables/interrupts", startEndString),
    vtManaGainPrefix: build("report/tables/resources-gains", `${startEndStringNoFilter}&filter=ability.id%20%3D%2034919%20AND%20${ENCOUNTER_FILTER_NOT_724}&abilityid=100&sourceid=`),
    shadowDamageDonePrefix: build("report/tables/damage-done", `${startEndStringNoFilter}&filter=ability.id%20IN%20%288129%2C8131%2C10874%2C10875%2C10876%2C25379%2C25380%2C8092%2C8102%2C8104%2C8105%2C8106%2C10945%2C10946%2C10947%2C25372%2C25375%2C25387%2C18807%2C17314%2C17313%2C17312%2C17311%2C15407%2C32379%2C32996%2C25368%2C25367%2C10894%2C10893%2C10892%2C2767%2C992%2C970%2C594%2C589%2C34914%2C34916%2C34917%2C25467%2C45055%29%20AND%20${ENCOUNTER_FILTER_NOT_724}&by=source&sourceid=`),
    twistsDoneOnBossesPrefix: build("report/tables/damage-done", `${startEndStringNoFilter}&abilityid=1&by=source&options=2&sourceAurasPresent=20375,31892&encounter=-2&sourceid=`),
    windfuryAttacksOnTwistsDoneOnBossesPrefix: build("report/tables/damage-done", `${startEndStringNoFilter}&abilityid=1&by=source&options=2&sourceAurasPresent=20375,31892,25584&encounter=-2&sourceid=`),
    windfuryAttacksOnBossesPrefix: build("report/tables/buffs", `${startEndString}&abilityid=25584&by=source&options=2&encounter=-2&sourceid=`),
    damageDoneOnBossesPrefix: build("report/tables/damage-done", `${startEndString}&options=2&abilityid=1&by=source&options=2&encounter=-2&sourceid=`),
  };
}

export type RPBEndpoints = ReturnType<typeof makeUrls>;
