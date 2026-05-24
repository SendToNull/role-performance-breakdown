import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  fetchGearListing,
  type GearListingResult,
  type ProgressEvent,
} from "@rpb/core";
import { clearApiKey, loadApiKey, saveApiKey } from "../apiKey.js";
import { GearListingMatrix } from "./GearListingMatrix.js";

type ClaTab = "gear-listing" | "gear-issues" | "consumables";

export function ClaApp() {
  const [apiKey, setApiKey] = useState("");
  const [remember, setRemember] = useState(false);
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const [reportInput, setReportInput] = useState("");
  const [tab, setTab] = useState<ClaTab>("gear-listing");
  const [progress, setProgress] = useState<ProgressEvent | null>(null);

  useEffect(() => {
    const { key, remember: r } = loadApiKey();
    if (key) {
      setApiKey(key);
      setHasStoredKey(true);
    }
    setRemember(r);
  }, []);

  const gearMut = useMutation<GearListingResult, Error, void>({
    mutationFn: async () => {
      if (!apiKey.trim()) throw new Error("API key is required");
      if (!reportInput.trim()) throw new Error("Report URL or id is required");
      saveApiKey(apiKey, remember);
      setHasStoredKey(remember);
      return fetchGearListing({
        reportPathOrId: reportInput.trim(),
        apiKey: apiKey.trim(),
        clientOptions: {
          concurrency: 8,
          onProgress: (e) => setProgress(e),
        },
      });
    },
  });

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
            onClick={() => gearMut.mutate()}
            disabled={gearMut.isPending}
            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {gearMut.isPending ? "Running…" : "Run analysis"}
          </button>
          {progress && gearMut.isPending && (
            <span className="text-xs tabular-nums text-zinc-400">
              {totalCalls} calls done · {progress.inFlight} in flight
            </span>
          )}
        </div>
        {gearMut.error && (
          <p className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-300">
            {gearMut.error.message}
          </p>
        )}
      </section>

      <nav
        role="tablist"
        className="flex flex-wrap gap-1 rounded-md border border-zinc-800 bg-zinc-900/40 p-1 text-sm"
      >
        <ClaTabButton active={tab === "gear-listing"} onClick={() => setTab("gear-listing")}>
          Gear listing
        </ClaTabButton>
        <ClaTabButton
          active={tab === "gear-issues"}
          disabled
          onClick={() => setTab("gear-issues")}
        >
          Gear issues (soon)
        </ClaTabButton>
        <ClaTabButton
          active={tab === "consumables"}
          disabled
          onClick={() => setTab("consumables")}
        >
          Consumables (soon)
        </ClaTabButton>
      </nav>

      {tab === "gear-listing" && gearMut.data && (
        <GearListingMatrix result={gearMut.data} />
      )}
      {tab === "gear-listing" && !gearMut.data && !gearMut.isPending && (
        <p className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3 text-sm text-zinc-500">
          Run analysis to see per-boss gear snapshots.
        </p>
      )}
      {tab !== "gear-listing" && (
        <p className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3 text-sm text-zinc-500">
          This tab will mirror the Combat Log Analytics sheet's {tab} tab.
          Coming in a follow-up commit.
        </p>
      )}
    </div>
  );
}

function ClaTabButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      disabled={disabled}
      className={
        "rounded px-3 py-1 text-xs transition disabled:cursor-not-allowed disabled:opacity-40 " +
        (active
          ? "bg-violet-600 text-white"
          : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200")
      }
    >
      {children}
    </button>
  );
}
