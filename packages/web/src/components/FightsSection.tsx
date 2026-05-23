import { useMemo } from "react";
import type { Fight, RunReportResult } from "@rpb/core";
import { SectionCard } from "./SectionCard.js";

interface BossGroup {
  area: string;
  trashCount: number;
  trashDurationMs: number;
  attempts: Fight[];
}

export function FightsSection({ result }: { result: RunReportResult }) {
  const groups = useMemo(() => groupFights(result.fights), [result.fights]);

  const totalKills = groups.reduce(
    (acc, g) => acc + g.attempts.filter((a) => a.kill).length,
    0,
  );
  const totalWipes = groups.reduce(
    (acc, g) => acc + g.attempts.filter((a) => !a.kill).length,
    0,
  );
  const totalTrash = groups.reduce((acc, g) => acc + g.trashCount, 0);

  return (
    <SectionCard
      title="Fights"
      subtitle={`${totalKills} kills · ${totalWipes} wipes · ${totalTrash} trash pulls (WCL labels trash by nearest boss)`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-2 py-1 font-medium">Area</th>
              <th className="px-2 py-1 font-medium">Attempts</th>
              <th className="px-2 py-1 font-medium">Trash</th>
              <th className="px-2 py-1 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr
                key={g.area}
                className="border-t border-zinc-800/60 align-top"
              >
                <td className="px-2 py-2 font-medium text-zinc-200">
                  {g.area}
                </td>
                <td className="px-2 py-2 tabular-nums text-zinc-300">
                  {g.attempts.length === 0 ? (
                    <span className="text-zinc-600">—</span>
                  ) : (
                    <span>
                      <span className="text-emerald-400">
                        {g.attempts.filter((a) => a.kill).length}K
                      </span>{" "}
                      <span className="text-zinc-500">/</span>{" "}
                      <span className="text-red-400">
                        {g.attempts.filter((a) => !a.kill).length}W
                      </span>
                    </span>
                  )}
                </td>
                <td className="px-2 py-2 tabular-nums text-zinc-400">
                  {g.trashCount > 0
                    ? `${g.trashCount} (${formatDuration(g.trashDurationMs)})`
                    : "—"}
                </td>
                <td className="px-2 py-2 text-xs text-zinc-500">
                  {g.attempts.map((a, i) => (
                    <span
                      key={a.id}
                      className={
                        a.kill ? "text-emerald-400" : "text-red-400/80"
                      }
                    >
                      #{a.id} ({formatDuration(a.end_time - a.start_time)})
                      {i < g.attempts.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function groupFights(fights: Fight[]): BossGroup[] {
  const map = new Map<string, BossGroup>();
  for (const f of fights) {
    const key = f.name || "Unknown";
    const existing =
      map.get(key) ??
      ({
        area: key,
        trashCount: 0,
        trashDurationMs: 0,
        attempts: [],
      } satisfies BossGroup);
    if (f.boss > 0) {
      existing.attempts.push(f);
    } else {
      existing.trashCount++;
      existing.trashDurationMs += Math.max(0, f.end_time - f.start_time);
    }
    map.set(key, existing);
  }
  // Preserve report order rather than alpha-sort.
  return [...map.values()];
}

function formatDuration(ms: number): string {
  if (ms <= 0) return "0:00";
  const totalSec = Math.round(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
