import type { TableResponse } from "@rpb/core";
import { SectionCard } from "./SectionCard.js";
import { PlayerChip } from "./PlayerChip.js";

interface Props {
  title: string;
  subtitle?: string;
  data: TableResponse | undefined;
  valueFormatter?: (n: number) => string;
  /** Cap rows for compactness. */
  limit?: number;
  /** Optional filter (e.g. only entries with total > 0). */
  filter?: (entry: { total: number }) => boolean;
  emptyHint?: string;
}

export function Leaderboard({
  title,
  subtitle,
  data,
  valueFormatter = (n) => n.toLocaleString(),
  limit = 25,
  filter = (e) => e.total > 0,
  emptyHint = "Nothing to show.",
}: Props) {
  const rows = (data?.entries ?? [])
    .filter(filter)
    .slice()
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);

  return (
    <SectionCard title={title} subtitle={subtitle}>
      {rows.length === 0 ? (
        <p className="text-sm text-zinc-500">{emptyHint}</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-2 py-1 font-medium">Player</th>
              <th className="px-2 py-1 text-right font-medium">Total</th>
              <th className="w-1/2 px-2 py-1 font-medium">Share</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => {
              const max = rows[0]!.total;
              const pct = max > 0 ? Math.round((e.total / max) * 100) : 0;
              return (
                <tr key={`${e.name}-${e.id}`} className="border-t border-zinc-800/60">
                  <td className="px-2 py-1.5">
                    <PlayerChip name={e.name} className={e.type} />
                  </td>
                  <td className="px-2 py-1.5 text-right tabular-nums">
                    {valueFormatter(e.total)}
                  </td>
                  <td className="px-2 py-1.5">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full bg-violet-500/80"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </SectionCard>
  );
}
