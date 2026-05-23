import type { RunReportResult } from "@rpb/core";
import { SectionCard } from "./SectionCard.js";
import { MatrixView } from "../matrix/MatrixView.js";

export function ResultView({ result }: { result: RunReportResult }) {
  return (
    <div className="grid gap-4">
      <SectionCard title="Summary">
        <dl className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
          <Stat label="Log id" value={result.logId} mono />
          <Stat label="Faction" value={result.faction} />
          <Stat label="Fights" value={result.fights.length.toString()} />
          <Stat
            label="Players tracked"
            value={(result.raw.allPlayersCasting.entries?.length ?? 0).toString()}
          />
        </dl>
      </SectionCard>

      <MatrixView result={result} />
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
