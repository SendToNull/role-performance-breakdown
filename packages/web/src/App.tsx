import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  runReport,
  type FilterMode,
  type ProgressEvent,
  type ReportFilters,
  type RunReportResult,
} from "@rpb/core";
import { clearApiKey, loadApiKey, saveApiKey } from "./apiKey.js";
import { ResultView } from "./components/ResultView.js";
import { SnapshotApp } from "./SnapshotApp.js";
import { ClaApp } from "./cla/ClaApp.js";

type TopTab = "rpb" | "cla";

function readSnapshotSource():
  | { kind: "inline"; data: string }
  | { kind: "url"; url: string }
  | null {
  const hash = location.hash.replace(/^#/, "");
  const hashParams = new URLSearchParams(hash);
  const inline = hashParams.get("data");
  if (inline) return { kind: "inline", data: inline };

  const search = new URLSearchParams(location.search);
  const url = search.get("snapshot");
  if (url) return { kind: "url", url };

  return null;
}

export function App() {
  const snapshotSource = useMemo(() => readSnapshotSource(), []);
  // Snapshot viewer is RPB-only and bypasses the nav.
  if (snapshotSource) return <SnapshotApp source={snapshotSource} />;

  const [tab, setTab] = useState<TopTab>(() => {
    return new URLSearchParams(location.search).get("app") === "cla"
      ? "cla"
      : "rpb";
  });

  function switchTo(next: TopTab) {
    setTab(next);
    const url = new URL(location.href);
    if (next === "cla") url.searchParams.set("app", "cla");
    else url.searchParams.delete("app");
    history.replaceState(null, "", url.toString());
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-3">
        <h1 className="text-lg font-semibold tracking-tight">
          WoW Classic TBC Analytics
        </h1>
        <nav className="flex gap-1 rounded-md border border-zinc-800 bg-zinc-900/60 p-1 text-sm">
          <TopTabButton active={tab === "rpb"} onClick={() => switchTo("rpb")}>
            Role Performance Breakdown
          </TopTabButton>
          <TopTabButton active={tab === "cla"} onClick={() => switchTo("cla")}>
            Combat Log Analytics
          </TopTabButton>
        </nav>
      </header>
      <div className="flex-1 overflow-auto">
        {tab === "rpb" ? <Generator /> : <ClaApp />}
      </div>
    </div>
  );
}

function TopTabButton({
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

function Generator() {
  const [apiKey, setApiKey] = useState("");
  const [remember, setRemember] = useState(false);
  const [hasStoredKey, setHasStoredKey] = useState(false);

  const [reportInput, setReportInput] = useState("");
  const [mode, setMode] = useState<FilterMode>("all");
  const [noWipes, setNoWipes] = useState(false);
  const [onlyFightId, setOnlyFightId] = useState("");
  const [characterNames, setCharacterNames] = useState("");

  const [progress, setProgress] = useState<ProgressEvent | null>(null);

  useEffect(() => {
    const { key, remember: r } = loadApiKey();
    if (key) {
      setApiKey(key);
      setHasStoredKey(true);
    }
    setRemember(r);
  }, []);

  const reportMutation = useMutation<RunReportResult, Error, void>({
    mutationFn: async () => {
      if (!apiKey.trim()) throw new Error("API key is required");
      if (!reportInput.trim()) throw new Error("Report URL or id is required");
      saveApiKey(apiKey, remember);
      setHasStoredKey(remember);

      const filters: Partial<ReportFilters> = {
        mode,
        noWipes,
        onlyFightId: onlyFightId.trim() || null,
        characterNames: characterNames.trim() || null,
      };

      return runReport({
        reportPathOrId: reportInput.trim(),
        apiKey: apiKey.trim(),
        filters,
        fetchPerPlayer: true,
        clientOptions: {
          concurrency: 8,
          onProgress: (e) => setProgress(e),
        },
      });
    },
  });

  const result = reportMutation.data;
  const totalCalls = useMemo(() => progress?.totalCompleted ?? 0, [progress]);

  return (
    <div className="mx-auto flex h-full max-w-[1400px] flex-col gap-6 p-6">
      <header className="flex items-baseline justify-between border-b border-zinc-800 pb-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Role Performance Breakdown
        </h1>
        <span className="text-xs text-zinc-500">WCL v1 • Classic TBC</span>
      </header>

      <section className="grid gap-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
          WarcraftLogs credentials
        </h2>
        <label className="grid gap-1.5">
          <span className="text-xs text-zinc-400">V1 API key</span>
          <input
            type="password"
            autoComplete="off"
            spellCheck={false}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste your V1 client key"
            className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-sm focus:border-violet-500 focus:outline-none"
          />
          <span className="text-[11px] text-zinc-500">
            Stored in your browser only. Calls go directly from this page to
            <code className="mx-1 rounded bg-zinc-800 px-1">*.warcraftlogs.com</code>.
            Get a key from{" "}
            <a
              href="https://classic.warcraftlogs.com/profile"
              target="_blank"
              rel="noreferrer"
              className="text-violet-400 hover:underline"
            >
              classic.warcraftlogs.com/profile
            </a>
            .
          </span>
        </label>
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4"
            />
            Remember on this device (uses localStorage)
          </label>
          {hasStoredKey && (
            <button
              type="button"
              onClick={() => {
                clearApiKey();
                setApiKey("");
                setHasStoredKey(false);
              }}
              className="text-xs text-zinc-400 underline hover:text-zinc-200"
            >
              Forget stored key
            </button>
          )}
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
          Report
        </h2>
        <label className="grid gap-1.5">
          <span className="text-xs text-zinc-400">Report URL or ID</span>
          <input
            value={reportInput}
            onChange={(e) => setReportInput(e.target.value)}
            placeholder="https://classic.warcraftlogs.com/reports/AbCdEf... or the bare id"
            className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
          />
        </label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="grid gap-1.5">
            <span className="text-xs text-zinc-400">Mode</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as FilterMode)}
              className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
            >
              <option value="all">All fights</option>
              <option value="onlyBosses">Bosses only</option>
              <option value="onlyTrash">Trash only</option>
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs text-zinc-400">Fight id (or "last")</span>
            <input
              value={onlyFightId}
              onChange={(e) => setOnlyFightId(e.target.value)}
              placeholder="optional"
              className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs text-zinc-400">Character names</span>
            <input
              value={characterNames}
              onChange={(e) => setCharacterNames(e.target.value)}
              placeholder="optional, comma-separated"
              className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
            />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={noWipes}
            onChange={(e) => setNoWipes(e.target.checked)}
            className="h-4 w-4"
          />
          Exclude wipes
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => reportMutation.mutate()}
            disabled={reportMutation.isPending}
            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {reportMutation.isPending ? "Running…" : "Generate breakdown"}
          </button>
          {progress && reportMutation.isPending && (
            <span className="text-xs tabular-nums text-zinc-400">
              {totalCalls} calls done · {progress.inFlight} in flight
            </span>
          )}
        </div>
        {reportMutation.error && (
          <p className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-300">
            {reportMutation.error.message}
          </p>
        )}
      </section>

      {result && <ResultView result={result} />}

      <footer className="mt-auto text-center text-[11px] text-zinc-600">
        Direct browser → WCL. No backend, no telemetry. Your API key never
        leaves this tab.
      </footer>
    </div>
  );
}

