import { useMemo } from "react";
import {
  CONSUMABLE_CATEGORIES,
  type ConsumablesResult,
  type PlayerConsumables,
} from "@rpb/core";
import { classColor, normalizeClassName } from "../util/classColor.js";

interface Props {
  result: ConsumablesResult;
}

export function ConsumablesMatrix({ result }: Props) {
  const players = useMemo(() => result.players, [result.players]);

  return (
    <section className="grid gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
      <header className="px-1 pt-1">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
          Consumables (on-boss)
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          {players.length} players · per-category buff usage during boss
          fights · empty / red = not used, green = used
        </p>
      </header>

      <div className="overflow-auto rounded border border-zinc-800/60">
        <table className="border-collapse text-xs">
          <thead className="bg-zinc-950">
            <tr>
              <th className="sticky left-0 z-10 min-w-[140px] border-b border-r border-zinc-800 bg-zinc-950 px-2 py-1.5 text-left text-[11px] uppercase text-zinc-500">
                Player
              </th>
              {CONSUMABLE_CATEGORIES.map((c) => (
                <th
                  key={c.id}
                  className="min-w-[100px] border-b border-r border-zinc-800/60 px-2 py-1.5 text-center text-[10px] uppercase text-zinc-400"
                  title={c.description}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <PlayerRow key={p.id} player={p} totalMs={result.totalBossTimeMs} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PlayerRow({
  player,
  totalMs,
}: {
  player: PlayerConsumables;
  totalMs: number;
}) {
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
      {CONSUMABLE_CATEGORIES.map((cat) => {
        const use = player.byCategory.get(cat.id);
        if (!use) {
          return (
            <td
              key={cat.id}
              className="min-w-[100px] border-r border-zinc-800/60 px-1 py-1 text-center"
              style={{ backgroundColor: "rgba(255, 7, 7, 0.18)" }}
              title={`${cat.label}: never applied during boss fights`}
            >
              <span className="text-red-300">—</span>
            </td>
          );
        }
        const pct = totalMs > 0 ? Math.round((use.uptimeMs / totalMs) * 100) : 0;
        const tooltip =
          `${cat.label}\n` +
          `Uses: ${use.count}\n` +
          `Uptime: ${pct}%` +
          (use.bestSpellName ? `\nMost used: ${use.bestSpellName}` : "");
        return (
          <td
            key={cat.id}
            className="min-w-[100px] border-r border-zinc-800/60 px-1 py-1 text-center tabular-nums"
            style={{ backgroundColor: greenForUptime(pct) }}
            title={tooltip}
          >
            <span className="text-zinc-900">
              {use.count} <span className="text-zinc-700">({pct}%)</span>
            </span>
          </td>
        );
      })}
    </tr>
  );
}

function greenForUptime(pct: number): string {
  // Light → strong green; mirrors the sheet's "good = green" palette.
  const alpha = 0.25 + Math.min(pct, 100) / 100 * 0.55;
  return `rgba(191, 238, 174, ${alpha})`;
}
