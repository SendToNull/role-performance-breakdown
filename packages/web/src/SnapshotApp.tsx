// Read-only renderer used when the URL carries a snapshot (?snapshot=<url> or
// #data=<gzip-b64>). No API key, no fetcher — just renders whatever the
// snapshot contains. Supports both legacy RPB-only MatrixSnapshot and the
// BundleSnapshot envelope produced by the bot (/rpb, /cla, /full).

import { useEffect, useMemo, useState } from "react";
import {
  decodeSnapshot,
  deserializeConsumables,
  deserializeGearIssues,
  isBundleSnapshot,
  type BundleSnapshot,
  type ConsumablesPayload,
  type ConsumablesResult,
  type GearIssuesPayload,
  type GearIssuesResult,
  type MatrixSnapshot,
} from "@rpb/core";
import { MatrixView } from "./matrix/MatrixView.js";
import { SectionCard } from "./components/SectionCard.js";
import { GearIssuesMatrix } from "./cla/GearIssuesMatrix.js";
import { ConsumablesMatrix } from "./cla/ConsumablesMatrix.js";

interface Props {
  source: { kind: "inline"; data: string } | { kind: "url"; url: string };
}

type Loaded =
  | { kind: "legacy"; matrix: MatrixSnapshot }
  | { kind: "bundle"; bundle: BundleSnapshot };

type Tab = "rpb" | "gear-issues" | "consumables";

export function SnapshotApp({ source }: Props) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let json: unknown;
        if (source.kind === "inline") {
          // Inline only carries MatrixSnapshot today; bundles are too big for
          // the URL hash and always come via gist.
          const s = await decodeSnapshot(source.data);
          json = s;
        } else {
          const res = await fetch(source.url);
          if (!res.ok) throw new Error(`HTTP ${res.status} fetching snapshot`);
          json = await res.json();
        }
        if (cancelled) return;
        if (isBundleSnapshot(json)) {
          setLoaded({ kind: "bundle", bundle: json });
        } else {
          setLoaded({ kind: "legacy", matrix: json as MatrixSnapshot });
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [source]);

  // Derive available tabs from what the snapshot actually has.
  const tabs = useMemo<Tab[]>(() => {
    if (!loaded) return [];
    if (loaded.kind === "legacy") return ["rpb"];
    const t: Tab[] = [];
    if (loaded.bundle.rpb) t.push("rpb");
    if (loaded.bundle.cla) {
      t.push("gear-issues");
      t.push("consumables");
    }
    return t;
  }, [loaded]);

  // Default to RPB if present, else first available section.
  const [tab, setTab] = useState<Tab>("rpb");
  useEffect(() => {
    if (tabs.length === 0) return;
    if (!tabs.includes(tab)) setTab(tabs[0]!);
  }, [tabs, tab]);

  return (
    <div className="mx-auto flex h-full max-w-[1400px] flex-col gap-4 p-4">
      <header className="flex items-baseline justify-between border-b border-zinc-800 pb-2">
        <h1 className="text-xl font-semibold tracking-tight">
          Shared Snapshot
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

      {loaded && <Summary loaded={loaded} />}

      {loaded && tabs.length > 1 && (
        <nav
          role="tablist"
          className="flex flex-wrap gap-1 rounded-md border border-zinc-800 bg-zinc-900/40 p-1 text-sm"
        >
          {tabs.includes("rpb") && (
            <TabButton active={tab === "rpb"} onClick={() => setTab("rpb")}>
              Role Performance
            </TabButton>
          )}
          {tabs.includes("gear-issues") && (
            <TabButton
              active={tab === "gear-issues"}
              onClick={() => setTab("gear-issues")}
            >
              Gear issues
            </TabButton>
          )}
          {tabs.includes("consumables") && (
            <TabButton
              active={tab === "consumables"}
              onClick={() => setTab("consumables")}
            >
              Consumables
            </TabButton>
          )}
        </nav>
      )}

      {loaded && <Body loaded={loaded} tab={tab} />}

      {!loaded && !error && (
        <p className="text-sm text-zinc-400">Loading snapshot…</p>
      )}
    </div>
  );
}

function Body({ loaded, tab }: { loaded: Loaded; tab: Tab }) {
  if (loaded.kind === "legacy") {
    return <MatrixView snapshot={loaded.matrix} />;
  }
  const { rpb, cla } = loaded.bundle;
  if (tab === "rpb" && rpb) return <MatrixView snapshot={rpb} />;
  if (tab === "gear-issues" && cla) {
    return <ClaGear payload={cla.gearIssues} />;
  }
  if (tab === "consumables" && cla) {
    return <ClaCons payload={cla.consumables} />;
  }
  return <p className="text-sm text-zinc-500">Section not in this snapshot.</p>;
}

function ClaGear({ payload }: { payload: GearIssuesPayload }) {
  const result = useMemo<GearIssuesResult>(
    () => deserializeGearIssues(payload),
    [payload],
  );
  return <GearIssuesMatrix result={result} />;
}

function ClaCons({ payload }: { payload: ConsumablesPayload }) {
  const result = useMemo<ConsumablesResult>(
    () => deserializeConsumables(payload),
    [payload],
  );
  return <ConsumablesMatrix result={result} />;
}

function Summary({ loaded }: { loaded: Loaded }) {
  if (loaded.kind === "legacy") {
    const s = loaded.matrix;
    return (
      <SectionCard title="Summary">
        <dl className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
          <Stat label="Log id" value={s.source.logId} mono />
          <Stat label="Faction" value={s.source.faction} />
          <Stat label="Fights" value={s.source.fightCount.toString()} />
          <Stat label="Players" value={s.players.length.toString()} />
        </dl>
        <p className="mt-2 text-[11px] text-zinc-500">
          Generated {new Date(s.generatedAt).toLocaleString()}
          {s.source.reportUrl && (
            <>
              {" · "}
              <a
                href={s.source.reportUrl}
                target="_blank"
                rel="noreferrer"
                className="text-violet-400 hover:underline"
              >
                Original report on WCL
              </a>
            </>
          )}
          {s.source.filtersDesc && ` · filters: ${s.source.filtersDesc}`}
        </p>
      </SectionCard>
    );
  }
  const b = loaded.bundle;
  const sections: string[] = [];
  if (b.rpb) sections.push("RPB");
  if (b.cla) sections.push("CLA");
  return (
    <SectionCard title="Summary">
      <dl className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
        <Stat label="Log id" value={b.source.logId} mono />
        <Stat label="Sections" value={sections.join(" + ")} />
        {b.rpb && (
          <Stat label="Fights" value={b.rpb.source.fightCount.toString()} />
        )}
        {b.cla && (
          <Stat
            label="Bosses scanned"
            value={b.cla.gearIssues.bossesScanned.toString()}
          />
        )}
      </dl>
      <p className="mt-2 text-[11px] text-zinc-500">
        Generated {new Date(b.generatedAt).toLocaleString()}
        {b.source.reportUrl && (
          <>
            {" · "}
            <a
              href={b.source.reportUrl}
              target="_blank"
              rel="noreferrer"
              className="text-violet-400 hover:underline"
            >
              Original report on WCL
            </a>
          </>
        )}
        {b.source.filtersDesc && ` · filters: ${b.source.filtersDesc}`}
      </p>
    </SectionCard>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={
        "rounded px-3 py-1.5 text-xs transition " +
        (active
          ? "bg-violet-600 text-white"
          : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200")
      }
    >
      {children}
    </button>
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
