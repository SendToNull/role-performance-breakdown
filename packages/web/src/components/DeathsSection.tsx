import { useMemo } from "react";
import type { RunReportResult } from "@rpb/core";
import { SectionCard } from "./SectionCard.js";
import { PlayerChip } from "./PlayerChip.js";

interface Row {
  name: string;
  type: string;
  total: number;
  trash: number;
}

export function DeathsSection({ result }: { result: RunReportResult }) {
  const rows = useMemo<Row[]>(() => {
    const all = result.raw.deaths.entries ?? [];
    const trash = result.raw.deathsOnTrash.entries ?? [];

    const tally = (entries: typeof all) => {
      const m = new Map<string, { name: string; type: string; count: number }>();
      for (const e of entries) {
        const key = e.name;
        const existing = m.get(key) ?? { name: e.name, type: e.type, count: 0 };
        existing.count++;
        m.set(key, existing);
      }
      return m;
    };

    const total = tally(all);
    const tr = tally(trash);

    const result_: Row[] = [];
    for (const [name, v] of total) {
      result_.push({
        name,
        type: v.type,
        total: v.count,
        trash: tr.get(name)?.count ?? 0,
      });
    }
    return result_.sort((a, b) => b.total - a.total);
  }, [result]);

  const totalDeaths = rows.reduce((a, r) => a + r.total, 0);
  const trashDeaths = rows.reduce((a, r) => a + r.trash, 0);

  return (
    <SectionCard
      title="Deaths"
      subtitle={`${totalDeaths} total · ${trashDeaths} on trash · ${rows.length} players died`}
    >
      {rows.length === 0 ? (
        <p className="text-sm text-zinc-500">No deaths in this report.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-2 py-1 font-medium">Player</th>
              <th className="px-2 py-1 text-right font-medium">Total</th>
              <th className="px-2 py-1 text-right font-medium">On trash</th>
              <th className="px-2 py-1 text-right font-medium">On bosses</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-zinc-800/60">
                <td className="px-2 py-1.5">
                  <PlayerChip name={r.name} className={r.type} />
                </td>
                <td className="px-2 py-1.5 text-right tabular-nums">
                  {r.total}
                </td>
                <td className="px-2 py-1.5 text-right tabular-nums text-zinc-400">
                  {r.trash}
                </td>
                <td className="px-2 py-1.5 text-right tabular-nums">
                  {r.total - r.trash}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </SectionCard>
  );
}
