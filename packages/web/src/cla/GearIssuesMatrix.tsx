import { useMemo } from "react";
import {
  ISSUE_COLORS,
  ISSUE_LABELS,
  type GearIssue,
  type GearIssuesResult,
  type IssueKind,
  type PlayerGearIssues,
} from "@rpb/core";
import { classColor, normalizeClassName } from "../util/classColor.js";

interface Props {
  result: GearIssuesResult;
}

export function GearIssuesMatrix({ result }: Props) {
  const issuePlayers = useMemo(
    () => result.players.filter((p) => p.issues.length > 0),
    [result.players],
  );
  const noIssuePlayers = useMemo(
    () => result.players.filter((p) => p.issues.length === 0),
    [result.players],
  );

  return (
    <section className="grid gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
      <header className="px-1 pt-1">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
          Gear issues
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          {issuePlayers.length} of {result.players.length} players have issues ·{" "}
          {result.bossesScanned} bosses scanned
        </p>
      </header>

      <Legend />

      {issuePlayers.length === 0 ? (
        <p className="rounded-md border border-emerald-900/50 bg-emerald-950/20 px-3 py-2 text-sm text-emerald-300">
          No gear issues detected.
        </p>
      ) : (
        <div className="overflow-auto rounded border border-zinc-800/60">
          <table className="w-full border-collapse text-xs">
            <thead className="bg-zinc-950">
              <tr>
                <th className="sticky left-0 z-10 min-w-[140px] border-b border-r border-zinc-800 bg-zinc-950 px-2 py-1.5 text-left text-[11px] uppercase text-zinc-500">
                  Player
                </th>
                <th className="border-b border-zinc-800 px-2 py-1.5 text-left text-[11px] uppercase text-zinc-500">
                  Issues
                </th>
              </tr>
            </thead>
            <tbody>
              {issuePlayers.map((p) => (
                <PlayerRow key={p.id} player={p} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {noIssuePlayers.length > 0 && (
        <details className="rounded border border-zinc-800/60 bg-zinc-950/40 px-3 py-2 text-xs text-zinc-400">
          <summary className="cursor-pointer">
            {noIssuePlayers.length} players with no issues
          </summary>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {noIssuePlayers.map((p) => (
              <span
                key={p.id}
                className="rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5"
                style={{ color: classColor(normalizeClassName(p.type)) }}
              >
                {p.name}
              </span>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}

function PlayerRow({ player }: { player: PlayerGearIssues }) {
  const c = classColor(normalizeClassName(player.type));
  return (
    <tr className="border-b border-zinc-800/60 align-top">
      <th
        scope="row"
        className="sticky left-0 z-[5] min-w-[140px] border-r border-zinc-800 bg-zinc-950/95 px-2 py-1.5 text-left text-[11px] font-medium"
        style={{ color: c }}
      >
        {player.name}
      </th>
      <td className="px-2 py-1.5">
        <div className="flex flex-wrap gap-1.5">
          {player.issues.map((issue, i) => (
            <IssueChip key={i} issue={issue} />
          ))}
        </div>
      </td>
    </tr>
  );
}

function IssueChip({ issue }: { issue: GearIssue }) {
  const bg = ISSUE_COLORS[issue.kind];
  const label = ISSUE_LABELS[issue.kind];
  const text = issue.itemId
    ? `${issue.itemName} [${label}]`
    : `${issue.slotName} [${label}]`;
  const seenStr =
    issue.seenOnBosses.length > 0
      ? `Seen on: ${issue.seenOnBosses.join(", ")}`
      : "";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded border border-black/20 px-2 py-0.5 text-[11px] font-medium text-zinc-900"
      style={{ backgroundColor: bg }}
      title={seenStr}
    >
      {text}
    </span>
  );
}

function Legend() {
  const kinds: IssueKind[] = [
    "missing",
    "noEnchant",
    "badEnchant",
    "suboptimalItem",
    "spellHitOnMelee",
    "meleeHitOnCaster",
    "uncutGem",
    "vsNonUndead",
    "vsNonUndeadNonDemon",
    "wrongSRgear",
    "wrongPvPgear",
    "uselessRidingGear",
    "uselessSlowfallGear",
    "uselessEngiGear",
    "commonGem",
    "uncommonGem",
    "metaGemInactive",
  ];
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded border border-zinc-800/60 bg-zinc-950/40 px-3 py-2 text-[10px] text-zinc-500">
      <span className="uppercase tracking-wide">Legend:</span>
      {kinds.map((k) => (
        <span
          key={k}
          className="inline-flex items-center gap-1 rounded border border-black/20 px-1.5 py-0.5 text-[10px] text-zinc-900"
          style={{ backgroundColor: ISSUE_COLORS[k] }}
        >
          {ISSUE_LABELS[k]}
        </span>
      ))}
    </div>
  );
}
