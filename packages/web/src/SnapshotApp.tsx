// Read-only renderer used when the URL carries a snapshot (?snapshot=<url> or
// #data=<gzip-b64>). No API key, no fetcher — just the matrix.

import { useEffect, useState } from "react";
import { decodeSnapshot, type MatrixSnapshot } from "@rpb/core";
import { MatrixView } from "./matrix/MatrixView.js";
import { SectionCard } from "./components/SectionCard.js";

interface Props {
  source: { kind: "inline"; data: string } | { kind: "url"; url: string };
}

export function SnapshotApp({ source }: Props) {
  const [snapshot, setSnapshot] = useState<MatrixSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (source.kind === "inline") {
          const s = await decodeSnapshot(source.data);
          if (!cancelled) setSnapshot(s);
        } else {
          const res = await fetch(source.url);
          if (!res.ok) throw new Error(`HTTP ${res.status} fetching snapshot`);
          const json = (await res.json()) as MatrixSnapshot;
          if (!cancelled) setSnapshot(json);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [source]);

  return (
    <div className="mx-auto flex h-full max-w-[1400px] flex-col gap-4 p-4">
      <header className="flex items-baseline justify-between border-b border-zinc-800 pb-2">
        <h1 className="text-xl font-semibold tracking-tight">
          Role Performance Breakdown — Shared Snapshot
        </h1>
        <a
          href={location.pathname}
          className="text-xs text-violet-400 hover:underline"
        >
          Open generator
        </a>
      </header>

      {error && (
        <p className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {snapshot && (
        <>
          <SectionCard title="Summary">
            <dl className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
              <Stat label="Log id" value={snapshot.source.logId} mono />
              <Stat label="Faction" value={snapshot.source.faction} />
              <Stat
                label="Fights"
                value={snapshot.source.fightCount.toString()}
              />
              <Stat
                label="Players"
                value={snapshot.players.length.toString()}
              />
            </dl>
            <p className="mt-2 text-[11px] text-zinc-500">
              Generated {new Date(snapshot.generatedAt).toLocaleString()}
              {snapshot.source.reportUrl && (
                <>
                  {" · "}
                  <a
                    href={snapshot.source.reportUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-violet-400 hover:underline"
                  >
                    Original report on WCL
                  </a>
                </>
              )}
              {snapshot.source.filtersDesc &&
                ` · filters: ${snapshot.source.filtersDesc}`}
            </p>
          </SectionCard>

          <MatrixView snapshot={snapshot} />
        </>
      )}

      {!snapshot && !error && (
        <p className="text-sm text-zinc-400">Loading snapshot…</p>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2">
      <dt className="text-[11px] uppercase tracking-wide text-zinc-500">
        {label}
      </dt>
      <dd className={"mt-0.5 text-sm " + (mono ? "font-mono" : "")}>{value}</dd>
    </div>
  );
}
