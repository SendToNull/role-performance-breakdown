import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string | undefined;
  right?: ReactNode | undefined;
  children: ReactNode;
}

export function SectionCard({ title, subtitle, right, children }: Props) {
  return (
    <section className="grid gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
      <header className="flex items-baseline justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>
          )}
        </div>
        {right}
      </header>
      <div>{children}</div>
    </section>
  );
}
