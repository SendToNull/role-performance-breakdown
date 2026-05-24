import { useMemo } from "react";
import {
  POSITION_LABELS,
  POSITION_ORDER,
  type GearListingFight,
  type GearListingResult,
  type GearPlayer,
} from "@rpb/core";
import { classColor, normalizeClassName } from "../util/classColor.js";

interface Props {
  result: GearListingResult;
}

export function GearListingMatrix({ result }: Props) {
  if (result.fights.length === 0) {
    return (
      <p className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3 text-sm text-zinc-400">
        No boss fights with gear data found in this report.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {result.fights.map((f) => (
        <FightCard key={f.fightId} fight={f} />
      ))}
    </div>
  );
}

function FightCard({ fight }: { fight: GearListingFight }) {
  // Sort players by class then name for a stable layout.
  const players = useMemo(
    () =>
      [...fight.players].sort((a, b) => {
        const c = a.type.localeCompare(b.type);
        if (c !== 0) return c;
        return a.name.localeCompare(b.name);
      }),
    [fight.players],
  );

  const minutes = Math.floor(fight.durationMs / 60000);
  const seconds = Math.floor((fight.durationMs % 60000) / 1000);

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
      <header className="mb-2 flex items-baseline justify-between gap-3 px-1">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">
            {fight.bossName}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            Fight #{fight.fightId} · {minutes}:{seconds.toString().padStart(2, "0")}
            {" · "}
            <span
              className={fight.killed ? "text-emerald-400" : "text-red-400"}
            >
              {fight.killed
                ? "kill"
                : fight.fightPercentage != null
                  ? `wipe at ${fight.fightPercentage}%`
                  : "wipe"}
            </span>
          </p>
        </div>
        <span className="text-xs text-zinc-500">
          {players.length} players with gear
        </span>
      </header>

      <div className="overflow-auto rounded border border-zinc-800/60">
        <table className="border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-950">
              <th className="sticky left-0 z-10 min-w-[140px] border-b border-r border-zinc-800 bg-zinc-950 px-2 py-1.5 text-left text-[11px] uppercase text-zinc-500">
                Player
              </th>
              {POSITION_ORDER.map((pos) => (
                <th
                  key={pos}
                  className="min-w-[120px] border-b border-r border-zinc-800/60 px-1 py-1.5 text-center text-[10px] uppercase text-zinc-500"
                >
                  {POSITION_LABELS[pos]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <PlayerRow key={p.id} player={p} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PlayerRow({ player }: { player: GearPlayer }) {
  const c = classColor(normalizeClassName(player.type));
  return (
    <tr className="border-b border-zinc-800/60">
      <th
        scope="row"
        className="sticky left-0 z-[5] min-w-[140px] border-r border-zinc-800 bg-zinc-950/95 px-2 py-1 text-left text-[11px] font-medium"
        style={{ color: c }}
      >
        {player.name}
      </th>
      {POSITION_ORDER.map((pos) => {
        const item = player.gearByPosition.get(pos);
        return (
          <td
            key={pos}
            className="min-w-[120px] border-r border-zinc-800/60 px-1 py-1 text-center text-[11px]"
            title={item ? itemTooltip(item) : undefined}
          >
            {item ? (
              <span className="block truncate text-zinc-200">{item.name}</span>
            ) : (
              <span className="text-zinc-700">—</span>
            )}
          </td>
        );
      })}
    </tr>
  );
}

function itemTooltip(item: {
  id: number;
  name: string;
  itemLevel?: number;
  permanentEnchantName?: string;
  gems?: Array<{ id: number; itemLevel?: number }>;
}): string {
  const lines = [`${item.name} (id ${item.id})`];
  if (item.itemLevel) lines.push(`iLvl ${item.itemLevel}`);
  if (item.permanentEnchantName) lines.push(`Enchant: ${item.permanentEnchantName}`);
  if (item.gems?.length) lines.push(`Gems: ${item.gems.map((g) => g.id).join(", ")}`);
  return lines.join("\n");
}
