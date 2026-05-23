import { useMemo } from "react";
import type { RunReportResult } from "@rpb/core";
import { SectionCard } from "./SectionCard.js";
import { PlayerChip } from "./PlayerChip.js";
import { normalizeClassName } from "../util/classColor.js";

export function RosterSection({ result }: { result: RunReportResult }) {
  const grouped = useMemo(() => {
    const entries = result.raw.allPlayersCasting.entries ?? [];
    const byClass = new Map<string, Array<{ name: string; type: string }>>();
    for (const e of entries) {
      const cls = normalizeClassName(e.type);
      const arr = byClass.get(cls) ?? [];
      arr.push({ name: e.name, type: e.type });
      byClass.set(cls, arr);
    }
    return [...byClass.entries()]
      .map(([cls, players]) => ({
        cls,
        players: [...players].sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.cls.localeCompare(b.cls));
  }, [result]);

  const total = result.raw.allPlayersCasting.entries?.length ?? 0;

  return (
    <SectionCard
      title="Roster"
      subtitle={`${total} players · ${result.faction}`}
    >
      <div className="grid gap-3">
        {grouped.map(({ cls, players }) => (
          <div key={cls} className="flex flex-wrap items-center gap-2">
            <span className="w-28 shrink-0 text-xs text-zinc-500">
              {cls} <span className="text-zinc-600">({players.length})</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {players.map((p) => (
                <PlayerChip key={p.name} name={p.name} className={p.type} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
