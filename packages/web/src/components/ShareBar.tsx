import { useCallback, useState } from "react";
import {
  encodeSnapshot,
  type MatrixSnapshot,
} from "@rpb/core";

interface Props {
  /** Lazily computed snapshot — only built when the user clicks Share. */
  buildSnapshot: () => MatrixSnapshot;
}

export function ShareBar({ buildSnapshot }: Props) {
  const [inlineUrl, setInlineUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sizeBytes, setSizeBytes] = useState<number | null>(null);

  const onShare = useCallback(async () => {
    setError(null);
    setCopied(false);
    try {
      const snapshot = buildSnapshot();
      const encoded = await encodeSnapshot(snapshot);
      const base = `${location.origin}${location.pathname.replace(/\/$/, "")}/`;
      const url = `${base}#data=${encoded}`;

      const blob = new Blob([JSON.stringify(snapshot)], {
        type: "application/json",
      });
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      const dl = URL.createObjectURL(blob);

      setInlineUrl(url);
      setDownloadUrl(dl);
      setSizeBytes(encoded.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [buildSnapshot, downloadUrl]);

  const copyLink = useCallback(async () => {
    if (!inlineUrl) return;
    try {
      await navigator.clipboard.writeText(inlineUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Some browsers block clipboard in non-https contexts.
    }
  }, [inlineUrl]);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-xs text-zinc-400">
      <button
        type="button"
        onClick={onShare}
        className="rounded bg-violet-600 px-3 py-1 text-xs font-medium text-white hover:bg-violet-500"
      >
        {inlineUrl ? "Regenerate share link" : "Create share link"}
      </button>

      {error && <span className="text-red-300">{error}</span>}

      {inlineUrl && (
        <>
          {sizeBytes != null && (
            <span className="tabular-nums">
              {(sizeBytes / 1024).toFixed(1)} KB encoded
              {sizeBytes > 7000 && (
                <span className="ml-2 text-amber-300">
                  large for inline use — prefer the downloaded file
                </span>
              )}
            </span>
          )}
          <button
            type="button"
            onClick={copyLink}
            className="rounded border border-zinc-700 px-2 py-1 hover:bg-zinc-800"
          >
            {copied ? "Copied!" : "Copy inline link"}
          </button>
          {downloadUrl && (
            <a
              href={downloadUrl}
              download="rpb-snapshot.json"
              className="rounded border border-zinc-700 px-2 py-1 hover:bg-zinc-800"
            >
              Download .json
            </a>
          )}
          <span className="text-zinc-600">
            Inline link is self-contained — anyone who opens it sees the same
            matrix without a WCL key. For long links, host the .json and use{" "}
            <code className="rounded bg-zinc-800 px-1">?snapshot=&lt;url&gt;</code>{" "}
            instead.
          </span>
        </>
      )}
    </div>
  );
}
