import type { TableResponse } from "../types/index.js";
import { WCLClient } from "../wcl/client.js";
import type { RPBEndpoints } from "../wcl/endpoints.js";

/**
 * All per-player API responses. Mirrors RPB.gs:932-956 — these are the calls
 * the script makes inside the per-player loop.
 *
 * Class-specific fields are populated only for matching classes.
 */
export interface PerPlayerData {
  playerId: number;
  playerName: string;
  className: string; // normalized (no spaces)

  // Cast / activity
  casts: TableResponse;
  castsOnTrash: TableResponse;

  // Damage
  damageDone: TableResponse;
  damageTakenTotal: TableResponse;

  // Buffs / debuffs
  buffsTotal: TableResponse;
  buffsOnTrash: TableResponse;
  debuffsTaken: TableResponse;
  /** Debuffs this player applied (sourceless query is targetid=playerId). */
  debuffsAppliedToOthers: TableResponse;
  debuffsAppliedToOthersOnBosses: TableResponse;

  // Healing
  healingDone: TableResponse;
  healingReceived: TableResponse;

  // Class-specific
  judgementDebuffs?: TableResponse; // paladin
  vtManaGain?: TableResponse; // priest
  shadowDamageDone?: TableResponse; // priest
  twistsOnBosses?: TableResponse; // shaman
  windfuryAttacksOnTwists?: TableResponse;
  windfuryAttacksOnTwistsRank1?: TableResponse;
  windfuryAttacks?: TableResponse;
  windfuryAttacksRank1?: TableResponse;
  damageDoneOnBosses?: TableResponse;
}

export interface FetchPerPlayerInput {
  client: WCLClient;
  endpoints: RPBEndpoints;
  players: Array<{
    id: number;
    name: string;
    /** WCL `type` field, e.g. "Warrior" or "Death Knight". */
    className: string;
  }>;
}

/**
 * Fetch every per-player endpoint for every player. The WCLClient queue caps
 * concurrency globally — this just dispatches Promise.all per player and
 * lets the queue do the throttling.
 *
 * Returns a Map keyed by playerId.
 */
export async function fetchPerPlayer({
  client,
  endpoints,
  players,
}: FetchPerPlayerInput): Promise<Map<number, PerPlayerData>> {
  const results = await Promise.all(
    players.map(async (p) => {
      const data = await fetchOnePlayer(client, endpoints, p);
      return [p.id, data] as const;
    }),
  );
  return new Map(results);
}

async function fetchOnePlayer(
  client: WCLClient,
  e: RPBEndpoints,
  p: { id: number; name: string; className: string },
): Promise<PerPlayerData> {
  const normalized = (p.className ?? "").replace(/\s+/g, "");

  const core = {
    casts: client.getJson<TableResponse>(e.playersPrefix + p.id),
    castsOnTrash: client.getJson<TableResponse>(e.playersOnTrashPrefix + p.id),
    damageDone: client.getJson<TableResponse>(e.damageDonePrefix + p.id),
    damageTakenTotal: client.getJson<TableResponse>(
      e.damageTakenTotalPrefix + p.id,
    ),
    buffsTotal: client.getJson<TableResponse>(e.buffsTotalPrefix + p.id),
    buffsOnTrash: client.getJson<TableResponse>(e.buffsOnTrashPrefix + p.id),
    debuffsTaken: client.getJson<TableResponse>(e.debuffsPrefix + p.id),
    debuffsAppliedToOthers: client.getJson<TableResponse>(
      e.debuffsAppliedPrefix + p.id,
    ),
    debuffsAppliedToOthersOnBosses: client.getJson<TableResponse>(
      e.debuffsAppliedBossesPrefix + p.id,
    ),
    healingDone: client.getJson<TableResponse>(e.healingPrefix + p.id),
    healingReceived: client.getJson<TableResponse>(
      e.healingTargetPrefix + p.id + "&by=ability",
    ),
  };

  // Class-specific.
  const extras: Partial<PerPlayerData> = {};
  if (normalized === "Paladin") {
    extras.judgementDebuffs = await client.getJson<TableResponse>(
      e.debuffsAppliedBossesJudgementPrefix + p.id,
    );
  }
  if (normalized === "Priest") {
    extras.vtManaGain = await client.getJson<TableResponse>(
      e.vtManaGainPrefix + p.id,
    );
    extras.shadowDamageDone = await client.getJson<TableResponse>(
      e.shadowDamageDonePrefix + p.id,
    );
  }
  if (normalized === "Shaman") {
    const [twists, wfTwists, wfTwistsR1, wf, wfR1, dmgBosses] =
      await Promise.all([
        client.getJson<TableResponse>(e.twistsDoneOnBossesPrefix + p.id),
        client.getJson<TableResponse>(
          e.windfuryAttacksOnTwistsDoneOnBossesPrefix + p.id,
        ),
        client.getJson<TableResponse>(
          e.windfuryAttacksOnTwistsDoneOnBossesPrefix.replace("25584", "8516") +
            p.id,
        ),
        client.getJson<TableResponse>(
          e.windfuryAttacksOnBossesPrefix + p.id,
        ),
        client.getJson<TableResponse>(
          e.windfuryAttacksOnBossesPrefix.replace("25584", "8516") + p.id,
        ),
        client.getJson<TableResponse>(e.damageDoneOnBossesPrefix + p.id),
      ]);
    extras.twistsOnBosses = twists;
    extras.windfuryAttacksOnTwists = wfTwists;
    extras.windfuryAttacksOnTwistsRank1 = wfTwistsR1;
    extras.windfuryAttacks = wf;
    extras.windfuryAttacksRank1 = wfR1;
    extras.damageDoneOnBosses = dmgBosses;
  }

  const resolved = await resolveAll(core);
  return {
    playerId: p.id,
    playerName: p.name,
    className: normalized,
    ...resolved,
    ...extras,
  };
}

async function resolveAll<T extends Record<string, Promise<unknown>>>(
  obj: T,
): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
  const keys = Object.keys(obj) as Array<keyof T>;
  const values = await Promise.all(keys.map((k) => obj[k]));
  const out = {} as { [K in keyof T]: Awaited<T[K]> };
  keys.forEach((k, i) => {
    out[k] = values[i] as Awaited<T[typeof k]>;
  });
  return out;
}
