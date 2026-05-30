import { useMemo, useState, useCallback } from "react";
import {
  buildMatrixData,
  buildSnapshot,
  defaultRoleForClass,
  inferRole,
  normalizeClass,
  ROLES,
  ROLE_LABELS,
  snapshotToMatrixData,
  type MatrixData,
  type MatrixSnapshot,
  type Role,
  type RunReportResult,
} from "@rpb/core";
import { classColor, classColorRgba } from "../util/classColor.js";
import { CATEGORY_BG, type MatrixPlayer } from "./types.js";
import { ShareBar } from "../components/ShareBar.js";

interface LiveProps {
  result: RunReportResult;
  snapshot?: undefined;
}
interface SnapshotProps {
  result?: undefined;
  snapshot: MatrixSnapshot;
}
type Props = LiveProps | SnapshotProps;

export function MatrixView(props: Props) {
  const { result, snapshot } = props;
  const isSnapshot = !!snapshot;
  const [hidePending, setHidePending] = useState(true);
  const [hideEmpty, setHideEmpty] = useState(true);
  const [roleFilter, setRoleFilter] = useState<Role | "All">("All");

  const initialPlayers = useMemo<MatrixPlayer[]>(() => {
    if (snapshot) {
      return snapshot.players.map((p) => ({
        id: p.id,
        name: p.name,
        className: p.className,
        rawClassName: p.rawClassName,
        role: p.role,
      }));
    }
    const entries = result!.raw.allPlayersCasting.entries ?? [];
    const roleCounts = result!.roleCounts;
    return entries
      .filter((e) => (e.total ?? 0) > 0)
      .map((e) => {
        const className = normalizeClass(e.type);
        const auto = roleCounts
          ? inferRole(e.type, roleCounts.get(e.id))
          : defaultRoleForClass(className);
        return {
          id: e.id,
          name: e.name,
          className,
          rawClassName: e.type,
          role: auto,
        };
      });
  }, [result, snapshot]);

  const [roleOverrides, setRoleOverrides] = useState<Map<number, Role>>(
    new Map(),
  );

  const allPlayers: MatrixPlayer[] = useMemo(() => {
    return initialPlayers
      .map((p) => ({ ...p, role: roleOverrides.get(p.id) ?? p.role }))
      .sort((a, b) => {
        const ri = ROLES.indexOf(a.role) - ROLES.indexOf(b.role);
        if (ri !== 0) return ri;
        const ci = a.className.localeCompare(b.className);
        if (ci !== 0) return ci;
        return a.name.localeCompare(b.name);
      });
  }, [initialPlayers, roleOverrides]);

  /** Players filtered by the active role tab. */
  const players: MatrixPlayer[] = useMemo(
    () =>
      roleFilter === "All"
        ? allPlayers
        : allPlayers.filter((p) => p.role === roleFilter),
    [allPlayers, roleFilter],
  );

  const playerCountsByRole = useMemo(() => {
    const m: Record<Role, number> = { Tank: 0, Physical: 0, Caster: 0, Healer: 0 };
    for (const p of allPlayers) m[p.role]++;
    return m;
  }, [allPlayers]);

  const setPlayerRole = useCallback((playerId: number, role: Role) => {
    setRoleOverrides((prev) => {
      const next = new Map(prev);
      next.set(playerId, role);
      return next;
    });
  }, []);

  const data: MatrixData = useMemo(
    () => (snapshot ? snapshotToMatrixData(snapshot) : buildMatrixData(result!)),
    [result, snapshot],
  );

  const playerClassSet = useMemo(
    () => new Set(players.map((p) => p.className)),
    [players],
  );

  // Pre-compute whether each row has any populated cells across the visible
  // player set — used by the "hide empty rows" toggle.
  const rowHasData = useMemo(() => {
    const m = new Map<string, boolean>();
    for (const item of data.items) {
      if (item.kind !== "row") continue;
      let any = false;
      for (const p of players) {
        if (item.onlyForClass && item.onlyForClass !== p.className) continue;
        const v = item.cell(p.id);
        if (v.display) {
          any = true;
          break;
        }
      }
      m.set(item.id, any);
    }
    return m;
  }, [data, players]);

  // Filter: drop per-class sections/rows whose class isn't present, drop
  // pending rows / empty rows according to toggles.
  const visibleItems = useMemo(() => {
    return data.items.filter((item) => {
      if (
        "onlyForClass" in item &&
        item.onlyForClass &&
        !playerClassSet.has(item.onlyForClass)
      ) {
        return false;
      }
      if (item.kind === "row") {
        if (item.pending && hidePending) return false;
        if (hideEmpty && !rowHasData.get(item.id)) return false;
      }
      return true;
    });
  }, [data, playerClassSet, hidePending, hideEmpty, rowHasData]);

  // Drop empty sections (section header followed immediately by another section).
  const items = useMemo(() => {
    const out: typeof visibleItems = [];
    for (let i = 0; i < visibleItems.length; i++) {
      const cur = visibleItems[i]!;
      if (cur.kind === "section") {
        const next = visibleItems[i + 1];
        if (!next || next.kind === "section") continue;
      }
      out.push(cur);
    }
    return out;
  }, [visibleItems]);

  const roleGroups = useMemo(() => {
    type ClassGroup = { className: string; players: MatrixPlayer[] };
    type RoleGroup = { role: Role; classes: ClassGroup[]; count: number };
    const groups: RoleGroup[] = [];
    for (const role of ROLES) {
      const playersInRole = players.filter((p) => p.role === role);
      if (playersInRole.length === 0) continue;
      const byClass = new Map<string, MatrixPlayer[]>();
      for (const p of playersInRole) {
        const arr = byClass.get(p.className) ?? [];
        arr.push(p);
        byClass.set(p.className, arr);
      }
      groups.push({
        role,
        count: playersInRole.length,
        classes: [...byClass.entries()].map(([className, players]) => ({
          className,
          players,
        })),
      });
    }
    return groups;
  }, [players]);

  const colW = "min-w-[68px]";
  const rowCount = items.filter((i) => i.kind === "row").length;
  const sectionCount = items.filter((i) => i.kind === "section").length;
  const pendingTotal = data.items.filter(
    (i) => i.kind === "row" && i.pending,
  ).length;

  // For each player id, whether their column is the last of a class group
  // or the last of a role group. Drives the column separator strength.
  type Boundary = "none" | "class" | "role";
  const boundaryByPlayerId = useMemo(() => {
    const m = new Map<number, Boundary>();
    for (const g of roleGroups) {
      for (let ci = 0; ci < g.classes.length; ci++) {
        const cls = g.classes[ci]!;
        const isLastClassInRole = ci === g.classes.length - 1;
        for (let pi = 0; pi < cls.players.length; pi++) {
          const p = cls.players[pi]!;
          const isLastInClass = pi === cls.players.length - 1;
          m.set(
            p.id,
            isLastInClass
              ? isLastClassInRole
                ? "role"
                : "class"
              : "none",
          );
        }
      }
    }
    return m;
  }, [roleGroups]);

  /** Tailwind classes for the right-border treatment of a player column. */
  function cellBorderClass(playerId: number): string {
    const b = boundaryByPlayerId.get(playerId) ?? "none";
    if (b === "role") return "border-r-2 border-r-zinc-500";
    if (b === "class") return "border-r-2 border-r-zinc-600/70";
    return "border-r border-r-zinc-800/60";
  }

  return (
    <section className="grid gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
      <header className="flex flex-wrap items-baseline justify-between gap-2 px-2 pt-1">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
            Role performance breakdown
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {players.length}/{allPlayers.length} players · {sectionCount}{" "}
            sections · {rowCount} rows visible
            {pendingTotal > 0 &&
              ` · ${pendingTotal} rows pending per-player fetcher`}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-400">
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={!hideEmpty}
              onChange={(e) => setHideEmpty(!e.target.checked)}
              className="h-3.5 w-3.5"
            />
            Show empty rows
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={!hidePending}
              onChange={(e) => setHidePending(!e.target.checked)}
              className="h-3.5 w-3.5"
            />
            Show pending rows
          </label>
        </div>
      </header>

      {!isSnapshot && result && (
        <ShareBar
          buildSnapshot={() =>
            buildSnapshot(result, data, allPlayers, {
              reportUrl: `https://classic.warcraftlogs.com/reports/${result.logId}`,
            })
          }
        />
      )}

      <nav
        role="tablist"
        className="flex flex-wrap gap-1 rounded-md border border-zinc-800 bg-zinc-900/40 p-1 text-sm"
      >
        <TabButton
          active={roleFilter === "All"}
          onClick={() => setRoleFilter("All")}
        >
          All ({allPlayers.length})
        </TabButton>
        {ROLES.map((r) => (
          <TabButton
            key={r}
            active={roleFilter === r}
            disabled={playerCountsByRole[r] === 0}
            onClick={() => setRoleFilter(r)}
          >
            {ROLE_LABELS[r]} ({playerCountsByRole[r]})
          </TabButton>
        ))}
      </nav>

      <div className="overflow-auto rounded border border-zinc-800/60 max-h-[80vh]">
        <table className="border-collapse text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-30 w-[280px] min-w-[280px] border-b border-r-2 border-r-zinc-500 border-b-zinc-800 bg-zinc-950 px-2 py-2 text-left">
                <span className="text-[11px] uppercase text-zinc-500">
                  Metric
                </span>
              </th>
              {roleGroups.map((g, gi) => {
                const isLastRole = gi === roleGroups.length - 1;
                return (
                  <th
                    key={g.role}
                    colSpan={g.count}
                    className={`sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950 px-2 py-1.5 text-center text-[11px] uppercase tracking-wide text-zinc-300 ${
                      isLastRole
                        ? "border-r border-r-zinc-800"
                        : "border-r-2 border-r-zinc-500"
                    }`}
                  >
                    {ROLE_LABELS[g.role]}
                  </th>
                );
              })}
            </tr>
            <tr>
              <th className="sticky left-0 top-[34px] z-30 border-b border-r-2 border-r-zinc-500 border-b-zinc-800 bg-zinc-950 px-2 py-1.5" />
              {roleGroups.flatMap((g, gi) =>
                g.classes.map((c, ci) => {
                  const isLastClassInRole = ci === g.classes.length - 1;
                  const isLastRole = gi === roleGroups.length - 1;
                  const borderRight =
                    isLastClassInRole && isLastRole
                      ? "border-r border-r-zinc-800"
                      : isLastClassInRole
                        ? "border-r-2 border-r-zinc-500"
                        : "border-r-2 border-r-zinc-600/70";
                  return (
                    <th
                      key={`${g.role}-${c.className}`}
                      colSpan={c.players.length}
                      className={`sticky top-[34px] z-20 border-b border-b-zinc-800 bg-zinc-950/95 px-1 py-1 text-center text-[10px] font-semibold ${borderRight}`}
                      style={{ color: classColor(c.className) }}
                    >
                      {c.className}
                    </th>
                  );
                }),
              )}
            </tr>
            <tr>
              <th className="sticky left-0 top-[66px] z-30 border-b border-r-2 border-r-zinc-500 border-b-zinc-800 bg-zinc-950 px-2 py-1.5" />
              {roleGroups.flatMap((g) =>
                g.classes.flatMap((c) =>
                  c.players.map((p) => (
                    <th
                      key={p.id}
                      className={`sticky top-[66px] z-20 border-b border-b-zinc-800 bg-zinc-950/95 px-1 py-1 text-center align-bottom ${colW} ${cellBorderClass(p.id)}`}
                    >
                      <PlayerHeader
                        player={p}
                        onRoleChange={(r) => setPlayerRole(p.id, r)}
                      />
                    </th>
                  )),
                ),
              )}
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              if (item.kind === "section") {
                const isPerClass = !!item.onlyForClass;
                const accent = isPerClass
                  ? classColor(item.onlyForClass!)
                  : undefined;
                const tint = isPerClass
                  ? classColorRgba(item.onlyForClass!, 0.18)
                  : undefined;
                return (
                  <tr key={item.id}>
                    {/* Sticky-left label cell so the section name stays
                        visible while horizontally scrolling. Per-class
                        sections get the class color as accent. */}
                    <th
                      scope="row"
                      className="sticky left-0 z-10 w-[280px] min-w-[280px] border-y border-r border-zinc-800 px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide"
                      style={
                        isPerClass
                          ? {
                              backgroundColor: tint,
                              color: accent,
                              borderLeft: `3px solid ${accent}`,
                            }
                          : {
                              backgroundColor: "rgba(24, 24, 27, 0.95)",
                              color: "rgb(228, 228, 231)",
                            }
                      }
                    >
                      {item.label}
                    </th>
                    <td
                      colSpan={players.length}
                      className="border-y border-zinc-800"
                      style={
                        isPerClass
                          ? { backgroundColor: tint }
                          : { backgroundColor: "rgba(24, 24, 27, 0.95)" }
                      }
                    />
                  </tr>
                );
              }
              // Row
              return (
                <tr
                  key={item.id}
                  className={`${CATEGORY_BG[item.category]} ${item.pending ? "opacity-60" : ""}`}
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 w-[280px] min-w-[280px] border-b border-r-2 border-r-zinc-500 border-b-zinc-800 bg-zinc-950/95 px-2 py-1 text-left text-[11px] font-medium text-zinc-200"
                    title={item.description}
                  >
                    <span className="block truncate">
                      {item.label}
                      {item.pending && (
                        <span className="ml-1 text-[9px] text-zinc-600">
                          ⏳
                        </span>
                      )}
                    </span>
                  </th>
                  {players.map((p) => {
                    const visible =
                      !item.onlyForClass || item.onlyForClass === p.className;
                    const value = visible
                      ? item.cell(p.id)
                      : { display: "" };
                    return (
                      <td
                        key={p.id}
                        className={`border-b border-b-zinc-800/60 px-1 py-1 text-center tabular-nums ${colW} ${cellBorderClass(p.id)} ${value.display ? "text-zinc-100" : "text-zinc-700"}`}
                        title={value.tooltip}
                      >
                        {value.display && value.url ? (
                          <a
                            href={value.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-300 hover:text-violet-200 hover:underline"
                          >
                            {value.display}
                          </a>
                        ) : (
                          value.display ?? ""
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TabButton({
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

function PlayerHeader({
  player,
  onRoleChange,
}: {
  player: MatrixPlayer;
  onRoleChange: (role: Role) => void;
}) {
  const c = classColor(player.className);
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="block max-w-[80px] truncate text-[11px] font-medium"
        style={{ color: c }}
        title={player.name}
      >
        {player.name}
      </span>
      <select
        value={player.role}
        onChange={(e) => onRoleChange(e.target.value as Role)}
        className="w-full rounded bg-zinc-900 px-0.5 py-0.5 text-[9px] text-zinc-400 hover:text-zinc-200 focus:outline-none"
        title="Reassign role"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>
    </div>
  );
}
