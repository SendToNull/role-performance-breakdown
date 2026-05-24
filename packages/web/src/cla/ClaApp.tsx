import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  fetchConsumables,
  fetchGearIssues,
  type ConsumablesResult,
  type GearIssuesResult,
  type ProgressEvent,
} from "@rpb/core";
import { clearApiKey, loadApiKey, saveApiKey } from "../apiKey.js";
import { GearIssuesMatrix } from "./GearIssuesMatrix.js";
import { ConsumablesMatrix } from "./ConsumablesMatrix.js";

type ClaTab = "gear-issues" | "consumables";

export function ClaApp() {
  const [apiKey, setApiKey] = useState("");
  const [remember, setRemember] = useState(false);
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const [reportInput, setReportInput] = useState("");
  const [tab, setTab] = useState<ClaTab>("gear-issues");
  const [progress, setProgress] = useState<ProgressEvent | null>(null);

  useEffect(() => {
    const { key, remember: r } = loadApiKey();
    if (key) {
      setApiKey(key);
      setHasStoredKey(true);
    }
    setRemember(r);
  }, []);

  const gearMut = useMutation<GearIssuesResult, Error, void>({
    mutationFn: async () => {
      validate();
      return fetchGearIssues({
        reportPathOrId: reportInput.trim(),
        apiKey: apiKey.trim(),
        clientOptions: {
          concurrency: 8,
          onProgress: (e) => setProgress(e),
        },
      });
    },
  });

  const consMut = useMutation<ConsumablesResult, Error, void>({
    mutationFn: async () => {
      validate();
      return fetchConsumables({
        reportPathOrId: reportInput.trim(),
        apiKey: apiKey.trim(),
        clientOptions: {
          concurrency: 8,
          onProgress: (e) => setProgress(e),
        },
      });
    },
  });

  function validate() {
    if (!apiKey.trim()) throw new Error("API key is required");
    if (!reportInput.trim()) throw new Error("Report URL or id is required");
    saveApiKey(apiKey, remember);
    setHasStoredKey(remember);
  }

  function runActive() {
    setProgress(null);
    if (tab === "gear-issues") gearMut.mutate();
    else consMut.mutate();
  }

  const activeMut = tab === "gear-issues" ? gearMut : consMut;
  const totalCalls = useMemo(() => progress?.totalCompleted ?? 0, [progress]);

  return (
    <div className="mx-auto flex h-full max-w-[1400px] flex-col gap-6 p-6">
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
        </label>
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4"
            />
            Remember on this device
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
            placeholder="https://classic.warcraftlogs.com/reports/AbCdEf..."
            className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
          />
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={runActive}
            disabled={activeMut.isPending}
            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {activeMut.isPending
              ? "Running…"
              : `Run ${tab === "gear-issues" ? "gear issues" : "consumables"} analysis`}
          </button>
          {progress && activeMut.isPending && (
            <span className="text-xs tabular-nums text-zinc-400">
              {totalCalls} calls done · {progress.inFlight} in flight
            </span>
          )}
        </div>
        {activeMut.error && (
          <p className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-300">
            {activeMut.error.message}
          </p>
        )}
      </section>

      <nav
        role="tablist"
        className="flex flex-wrap gap-1 rounded-md border border-zinc-800 bg-zinc-900/40 p-1 text-sm"
      >
        <ClaTabButton active={tab === "gear-issues"} onClick={() => setTab("gear-issues")}>
          Gear issues
        </ClaTabButton>
        <ClaTabButton active={tab === "consumables"} onClick={() => setTab("consumables")}>
          Consumables
        </ClaTabButton>
      </nav>

      {tab === "gear-issues" && (
        gearMut.data ? (
          <GearIssuesMatrix result={gearMut.data} />
        ) : (
          <Placeholder text="Click Run to scan boss fights for missing items, missing enchants, and low-quality gems." />
        )
      )}
      {tab === "consumables" && (
        consMut.data ? (
          <ConsumablesMatrix result={consMut.data} />
        ) : (
          <Placeholder text="Click Run to scan per-player consumable usage during boss fights." />
        )
      )}
    </div>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <p className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3 text-sm text-zinc-500">
      {text}
    </p>
  );
}

function ClaTabButton({
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
        "rounded px-3 py-1 text-xs transition " +
        (active
          ? "bg-violet-600 text-white"
          : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200")
      }
    >
      {children}
    </button>
  );
}
