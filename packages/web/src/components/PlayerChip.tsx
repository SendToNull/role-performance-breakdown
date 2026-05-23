import { classColor, normalizeClassName } from "../util/classColor.js";

interface Props {
  name: string;
  className?: string;
}

export function PlayerChip({ name, className }: Props) {
  const c = classColor(normalizeClassName(className));
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-0.5 text-xs"
    >
      <span
        aria-hidden
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: c }}
      />
      <span style={{ color: c }} className="font-medium">
        {name}
      </span>
    </span>
  );
}
