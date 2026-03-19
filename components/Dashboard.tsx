"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  Download,
  Goal,
  Home,
  Medal,
  Search,
  Shield,
  Star,
  Table2,
  Target,
  Trophy,
  Users,
  BarChart3,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { players } from "@/data/players";
import { games } from "@/data/games";

const TEAM_PHOTO = "/team-photo.jpg";

function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-3xl border border-slate-200 bg-white ${className}`}>{children}</div>;
}

function CardHeader({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

function CardTitle({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <h2 className={`text-2xl font-bold ${className}`}>{children}</h2>;
}

function CardContent({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}

function Button({
  children,
  className = "",
  onClick,
  variant = "solid",
  type = "button",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "solid" | "outline";
  type?: "button" | "submit";
}) {
  const styles =
    variant === "outline"
      ? "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
      : "border border-transparent bg-[#17A05D] text-white hover:bg-[#12844c]";

  return (
    <button type={type} onClick={onClick} className={`inline-flex items-center justify-center rounded-full px-4 py-2 font-medium transition ${styles} ${className}`}>
      {children}
    </button>
  );
}

function Badge({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${className}`} style={style}>
      {children}
    </span>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-[#163E86] ${props.className ?? ""}`} />;
}

function StatCard({ title, value, subtext, icon: Icon }: { title: string; value: string | number; subtext: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/95">
      <CardContent className="p-5 flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="mt-1 text-3xl font-bold text-[#163E86]">{value}</div>
          <div className="mt-1 text-sm text-slate-500">{subtext}</div>
        </div>
        <div className="rounded-2xl bg-[#17A05D]/10 p-3">
          <Icon className="h-5 w-5 text-[#17A05D]" />
        </div>
      </CardContent>
    </Card>
  );
}

function NavButton({ active, onClick, icon: Icon, children }: { active: boolean; onClick: () => void; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${active ? "bg-[#163E86] text-white shadow" : "bg-white/90 text-slate-700 hover:bg-white"}`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

const resultColor = (result: "W" | "L" | "T") => {
  if (result === "W") return "#17A05D";
  if (result === "L") return "#D62828";
  return "#F4B400";
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatMonthLabel = (date: Date) => date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

const buildSeasonMonths = () => {
  if (!games.length) return [];
  const sortedDates = [...games].map((g) => new Date(`${g.date}T12:00:00`)).sort((a, b) => a.getTime() - b.getTime());
  const start = new Date(sortedDates[0].getFullYear(), sortedDates[0].getMonth(), 1);
  const end = new Date(sortedDates[sortedDates.length - 1].getFullYear(), sortedDates[sortedDates.length - 1].getMonth(), 1);
  const months: Date[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    months.push(new Date(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months;
};

const downloadCsv = (filename: string, rows: Array<Array<string | number>>) => {
  const escapeCell = (value: string | number) => {
    const stringValue = String(value ?? "");
    if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const csvContent = rows.map((row) => row.map(escapeCell).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

function SortableHeader({
  label,
  column,
  sortConfig,
  onSort,
  align = "left",
}: {
  label: string;
  column: string;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onSort: (key: string) => void;
  align?: "left" | "right";
}) {
  const isActive = sortConfig.key === column;
  const direction = isActive ? sortConfig.direction : null;
  const arrow = direction === "asc" ? "↑" : direction === "desc" ? "↓" : "↕";
  const alignClass = align === "right" ? "text-right" : "text-left";

  return (
    <th className={`${alignClass} px-2 py-3`}>
      <button onClick={() => onSort(column)} className="inline-flex items-center gap-1 font-semibold text-slate-500 transition hover:text-[#163E86]">
        <span>{label}</span>
        <span className={`text-xs ${isActive ? "text-[#163E86]" : "text-slate-400"}`}>{arrow}</span>
      </button>
    </th>
  );
}

function SeasonCalendar() {
  const gamesByDate = useMemo(() => {
    return games.reduce<Record<string, typeof games>>((acc, game) => {
      if (!acc[game.date]) acc[game.date] = [];
      acc[game.date].push(game);
      return acc;
    }, {});
  }, []);

  const months = useMemo(() => buildSeasonMonths(), []);

  return (
    <div className="space-y-6">
      {months.map((monthDate) => {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const leadingBlankCount = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const cells: Array<{ type: "blank"; key: string } | { type: "day"; key: string; day: number; dateKey: string; games: typeof games }> = [];
        for (let i = 0; i < leadingBlankCount; i += 1) {
          cells.push({ type: "blank", key: `blank-${year}-${month}-${i}` });
        }
        for (let day = 1; day <= totalDays; day += 1) {
          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          cells.push({ type: "day", key: dateKey, day, dateKey, games: gamesByDate[dateKey] || [] });
        }

        return (
          <div key={`${year}-${month}`} className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-bold text-[#163E86]">{formatMonthLabel(monthDate)}</div>
              <div className="text-xs text-slate-500">Green = W · Red = L · Yellow = T</div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {dayNames.map((dayName) => (
                <div key={dayName} className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {dayName}
                </div>
              ))}

              {cells.map((cell) => {
                if (cell.type === "blank") return <div key={cell.key} className="min-h-[84px] rounded-2xl bg-transparent" />;
                const hasGames = cell.games.length > 0;
                return (
                  <div
                    key={cell.key}
                    className={`min-h-[84px] rounded-2xl border p-2 ${hasGames ? "border-slate-200 bg-slate-50" : "border-slate-100 bg-white"}`}
                    title={hasGames ? cell.games.map((g) => `${g.result} vs ${g.opponent} (${g.gf}-${g.ga})`).join(" | ") : undefined}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-700">{cell.day}</div>
                      {hasGames && <div className="text-[10px] font-medium text-slate-500">{cell.games.length} game{cell.games.length > 1 ? "s" : ""}</div>}
                    </div>

                    {hasGames ? (
                      <div className="mt-2 space-y-1.5">
                        {cell.games.map((game, idx) => (
                          <div key={`${cell.dateKey}-${idx}`} className="rounded-lg px-2 py-1 text-[10px] font-semibold text-white" style={{ backgroundColor: resultColor(game.result) }}>
                            <div className="flex items-center justify-between gap-2">
                              <span>{game.result}</span>
                              <span>{game.gf}-{game.ga}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3 text-[10px] text-slate-300">No game</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [query, setQuery] = useState("");
  const [playerSort, setPlayerSort] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "points", direction: "desc" });
  const [gameSort, setGameSort] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "date", direction: "desc" });
  const [gameFilter, setGameFilter] = useState<"all" | "W" | "L" | "T">("all");

  const summary = useMemo(() => {
    const wins = games.filter((g) => g.result === "W").length;
    const losses = games.filter((g) => g.result === "L").length;
    const ties = games.filter((g) => g.result === "T").length;
    const goalsFor = games.reduce((sum, g) => sum + g.gf, 0);
    const goalsAgainst = games.reduce((sum, g) => sum + g.ga, 0);
    return {
      record: `${wins}-${losses}-${ties}`,
      wins,
      losses,
      ties,
      goalsFor,
      goalsAgainst,
      goalDiff: goalsFor - goalsAgainst,
      avgGF: (goalsFor / games.length).toFixed(1),
      avgGA: (goalsAgainst / games.length).toFixed(1),
      winPct: ((wins + ties * 0.5) / games.length * 100).toFixed(0),
    };
  }, []);

  const filteredPlayers = useMemo(() => {
    const q = query.toLowerCase().trim();
    const filtered = [...players].filter((p) => !q || p.player.toLowerCase().includes(q) || String(p.jersey).includes(q));
    filtered.sort((a, b) => {
      const { key, direction } = playerSort;
      const modifier = direction === "asc" ? 1 : -1;
      if (typeof a[key as keyof typeof a] === "string") {
        return String(a[key as keyof typeof a]).localeCompare(String(b[key as keyof typeof b])) * modifier;
      }
      return (Number(a[key as keyof typeof a]) - Number(b[key as keyof typeof b])) * modifier;
    });
    return filtered;
  }, [query, playerSort]);

  const scoringLeaders = useMemo(() => [...players].sort((a, b) => b.points - a.points).slice(0, 8), []);
  const goalLeaders = useMemo(() => [...players].sort((a, b) => b.goals - a.goals).slice(0, 5), []);
  const recentGames = useMemo(() => [...games].slice(-5).reverse(), []);
  const recentForm = useMemo(() => [...games].slice(-10), []);
  const resultBreakdown = useMemo(
    () => [
      { name: "Wins", value: summary.wins, color: resultColor("W") },
      { name: "Losses", value: summary.losses, color: resultColor("L") },
      { name: "Ties", value: summary.ties, color: resultColor("T") },
    ],
    [summary]
  );

  const displayedGames = useMemo(() => {
    const filtered = gameFilter === "all" ? [...games] : games.filter((g) => g.result === gameFilter);
    filtered.sort((a, b) => {
      const { key, direction } = gameSort;
      const modifier = direction === "asc" ? 1 : -1;
      if (key === "date") return (new Date(a.date).getTime() - new Date(b.date).getTime()) * modifier;
      if (key === "opponent" || key === "result") return a[key].localeCompare(b[key]) * modifier;
      return (a[key as "gf" | "ga"] - b[key as "gf" | "ga"]) * modifier;
    });
    return filtered;
  }, [gameFilter, gameSort]);

  const handlePlayerSort = (key: string) => {
    setPlayerSort((current) => ({ key, direction: current.key === key && current.direction === "desc" ? "asc" : "desc" }));
  };

  const handleGameSort = (key: string) => {
    setGameSort((current) => ({ key, direction: current.key === key && current.direction === "desc" ? "asc" : "desc" }));
  };

  const handleDownloadRosterCsv = () => {
    const rows = [["Player", "Jersey", "Goals", "Assists", "Points"], ...filteredPlayers.map((player) => [player.player, player.jersey, player.goals, player.assists, player.points])];
    downloadCsv("sno-king-18u-team-chen-roster-stats.csv", rows);
  };

  const handleDownloadGamesCsv = () => {
    const rows = [["Date", "Opponent", "Goals For", "Goals Against", "Result"], ...displayedGames.map((game) => [game.date, game.opponent, game.gf, game.ga, game.result])];
    downloadCsv("sno-king-18u-team-chen-game-results.csv", rows);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF1FB] via-white to-[#F7FBF9] text-slate-900">
      <div className="sticky top-0 z-30 border-b border-white/50 bg-[#163E86]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-white/70">Sno-King Hockey</div>
            <div className="font-semibold text-white">2025 - 26 Sno-King 18U Team Chen Stats</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <NavButton active={activeSection === "overview"} onClick={() => setActiveSection("overview")} icon={Home}>Overview</NavButton>
            <NavButton active={activeSection === "leaders"} onClick={() => setActiveSection("leaders")} icon={BarChart3}>Leaders</NavButton>
            <NavButton active={activeSection === "roster"} onClick={() => setActiveSection("roster")} icon={Users}>Roster</NavButton>
            <NavButton active={activeSection === "games"} onClick={() => setActiveSection("games")} icon={Table2}>Games</NavButton>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <section className="relative overflow-hidden rounded-[2rem] bg-[#163E86] text-white shadow-2xl shadow-slate-300/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(23,160,93,0.28),transparent_28%),radial-gradient(circle_at_left,rgba(255,255,255,0.12),transparent_22%)]" />
          <div className="relative grid grid-cols-1 items-center gap-8 p-8 md:p-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <Badge className="border-0 bg-white/15 px-4 py-2 text-white">Season 2025 - 26</Badge>
              <div className="space-y-3">
                <div className="text-sm uppercase tracking-[0.25em] text-white/70">Championship Season</div>
                <h1 className="text-4xl font-black leading-tight md:text-6xl">2025 - 26 Sno-King 18U Team Chen Stats</h1>
                <p className="max-w-2xl text-base text-white/85 md:text-lg">2025/2026 18U Sno-King Champions and MHL Champions.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="px-6" onClick={() => setActiveSection("roster")}>View Roster Stats <ChevronRight className="ml-1 h-4 w-4" /></Button>
                <Button variant="outline" className="border-white/30 bg-white/10 px-6 text-white hover:bg-white/20" onClick={() => setActiveSection("games")}>Browse Game Results</Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 backdrop-blur-sm shadow-xl">
  <img
    src={TEAM_PHOTO}
    alt="2025 - 26 Sno-King 18U Team Chen team photo"
    className="h-[320px] md:h-[380px] w-full object-cover"
  />
</div>
              <div className="grid grid-cols-2 gap-4 self-stretch">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                  <div className="text-sm text-white/70">Season Record</div>
                  <div className="mt-2 text-4xl font-black">{summary.record}</div>
                  <div className="mt-2 text-sm text-white/70">Wins-Losses-Ties</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                  <div className="text-sm text-white/70">Win Rate</div>
                  <div className="mt-2 text-4xl font-black">{summary.winPct}%</div>
                  <div className="mt-2 text-sm text-white/70">Overall season mark</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-0 shadow-lg"><CardContent className="p-6"><div className="inline-flex items-center gap-2 rounded-full bg-[#163E86]/10 px-3 py-1 text-sm font-medium text-[#163E86]"><Star className="h-4 w-4" /> For Players</div><div className="mt-4 text-xl font-semibold">Find your name fast</div><p className="mt-2 text-sm text-slate-600">Use the roster section to search by player name or jersey number and quickly find goals, assists, and points.</p></CardContent></Card>
          <Card className="border-0 shadow-lg"><CardContent className="p-6"><div className="inline-flex items-center gap-2 rounded-full bg-[#17A05D]/10 px-3 py-1 text-sm font-medium text-[#12844c]"><Target className="h-4 w-4" /> For Parents</div><div className="mt-4 text-xl font-semibold">Get the story quickly</div><p className="mt-2 text-sm text-slate-600">See team record, recent results, and scoring leaders without digging through a spreadsheet or sorting columns.</p></CardContent></Card>
          <Card className="border-0 shadow-lg"><CardContent className="p-6"><div className="inline-flex items-center gap-2 rounded-full bg-[#163E86]/10 px-3 py-1 text-sm font-medium text-[#163E86]"><Medal className="h-4 w-4" /> For Coaches</div><div className="mt-4 text-xl font-semibold">Keep the useful pieces close</div><p className="mt-2 text-sm text-slate-600">Jump straight to leaders, roster stats, and game history now, with chart and data downloads ready for a future pass.</p></CardContent></Card>
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Games" value={games.length} subtext="Tracked in workbook" icon={CalendarDays} />
          <StatCard title="Goals For" value={summary.goalsFor} subtext={`${summary.avgGF} per game`} icon={Goal} />
          <StatCard title="Goals Against" value={summary.goalsAgainst} subtext={`${summary.avgGA} per game`} icon={Shield} />
          <StatCard title="Goal Differential" value={summary.goalDiff > 0 ? `+${summary.goalDiff}` : summary.goalDiff} subtext="Season total" icon={Trophy} />
        </div>

        {activeSection === "overview" && (
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <Card className="border-0 shadow-lg">
              <CardHeader><CardTitle className="text-[#163E86]">Season Snapshot</CardTitle><div className="text-sm text-slate-500">A quick homepage view of the season story.</div></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[220px_1fr]">
                  <div className="h-[220px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={resultBreakdown} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={3}>{resultBreakdown.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
                  <div className="space-y-3">{resultBreakdown.map((item) => <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><div className="flex items-center gap-3"><span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: item.color }} /><span className="font-medium text-slate-700">{item.name}</span></div><span className="text-xl font-bold text-[#163E86]">{item.value}</span></div>)}</div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-semibold text-slate-600">Last 10 Games</div>
                  <div className="flex flex-wrap gap-2">{recentForm.map((game, idx) => <div key={`${game.date}-${idx}`} className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm" style={{ backgroundColor: resultColor(game.result) }} title={`${game.result} vs ${game.opponent} (${game.gf}-${game.ga})`}>{game.result}</div>)}</div>
                  <div className="mt-3 text-sm text-slate-500">{summary.wins} wins, {summary.losses} losses, and {summary.ties} ties across {games.length} games.</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader><CardTitle className="text-[#163E86]">Recent Games</CardTitle></CardHeader>
              <CardContent className="space-y-3">{recentGames.map((g, idx) => <div key={`${g.date}-${idx}`} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"><div><div className="font-semibold">vs {g.opponent}</div><div className="text-sm text-slate-500">{new Date(`${g.date}T12:00:00`).toLocaleDateString()}</div></div><div className="text-right"><div className="text-lg font-bold">{g.gf}–{g.ga}</div><Badge className="text-white" style={{ backgroundColor: resultColor(g.result) }}>{g.result}</Badge></div></div>)}</CardContent>
            </Card>
          </section>
        )}

        {(activeSection === "overview" || activeSection === "leaders") && (
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card className="border-0 shadow-lg"><CardHeader><CardTitle className="text-[#163E86]">Points Leaders</CardTitle></CardHeader><CardContent className="h-[360px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={scoringLeaders}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="player" tick={{ fontSize: 12 }} interval={0} angle={-25} textAnchor="end" height={80} /><YAxis /><Tooltip /><Bar dataKey="points" fill="#163E86" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="border-0 shadow-lg"><CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-[#163E86]">Top Goal Scorers</CardTitle><div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"><Download className="h-3.5 w-3.5" /> Chart downloads later</div></CardHeader><CardContent className="space-y-3">{goalLeaders.map((p, idx) => <div key={p.player} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-4"><div><div className="font-semibold text-slate-900">{idx + 1}. {p.player}</div><div className="text-sm text-slate-500">#{p.jersey}</div></div><div className="text-2xl font-black text-[#17A05D]">{p.goals}</div></div>)}</CardContent></Card>
          </section>
        )}

        {(activeSection === "overview" || activeSection === "roster") && (
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card className="border-0 shadow-lg xl:col-span-2">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div><CardTitle className="text-[#163E86]">Roster Stats</CardTitle><div className="mt-1 text-sm text-slate-500">Search by player name or jersey number, then sort any stat column.</div></div>
                <div className="flex w-full items-center gap-3 md:w-auto"><Button variant="outline" className="rounded-full" onClick={handleDownloadRosterCsv}><Download className="mr-2 h-4 w-4" /> Download Roster CSV</Button><div className="relative w-full md:w-72"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search player or jersey" className="pl-9" /></div></div>
              </CardHeader>
              <CardContent><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-slate-500"><SortableHeader label="Player" column="player" sortConfig={playerSort} onSort={handlePlayerSort} align="left" /><SortableHeader label="#" column="jersey" sortConfig={playerSort} onSort={handlePlayerSort} align="right" /><SortableHeader label="Goals" column="goals" sortConfig={playerSort} onSort={handlePlayerSort} align="right" /><SortableHeader label="Assists" column="assists" sortConfig={playerSort} onSort={handlePlayerSort} align="right" /><SortableHeader label="Points" column="points" sortConfig={playerSort} onSort={handlePlayerSort} align="right" /></tr></thead><tbody>{filteredPlayers.map((p) => <tr key={p.player} className="border-b hover:bg-slate-50 last:border-0"><td className="py-3 pr-4 font-medium">{p.player}</td><td className="px-2 py-3 text-right">{p.jersey}</td><td className="px-2 py-3 text-right">{p.goals}</td><td className="px-2 py-3 text-right">{p.assists}</td><td className="px-2 py-3 text-right font-semibold text-[#163E86]">{p.points}</td></tr>)}</tbody></table></div></CardContent>
            </Card>
            <Card className="border-0 shadow-lg"><CardHeader><CardTitle className="text-[#163E86]">Quick Leaders</CardTitle></CardHeader><CardContent className="space-y-3">{goalLeaders.map((p, idx) => <div key={p.player} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><div><div className="font-medium">{idx + 1}. {p.player}</div><div className="text-sm text-slate-500">#{p.jersey}</div></div><div className="text-xl font-bold text-[#17A05D]">{p.goals}</div></div>)}</CardContent></Card>
          </section>
        )}

        {(activeSection === "overview" || activeSection === "games") && (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div><CardTitle className="text-[#163E86]">Game Results</CardTitle><div className="mt-1 text-sm text-slate-500">Full season game results in one place, with sorting and quick result filters.</div></div>
                <div className="flex flex-wrap items-center gap-2">{[{ label: "All", value: "all" }, { label: "Wins", value: "W" }, { label: "Losses", value: "L" }, { label: "Ties", value: "T" }].map((option) => { const active = gameFilter === option.value; return <button key={option.value} onClick={() => setGameFilter(option.value as "all" | "W" | "L" | "T")} className={`rounded-full px-3 py-2 text-sm font-medium transition ${active ? "bg-[#163E86] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{option.label}</button>; })}<Button variant="outline" className="rounded-full" onClick={handleDownloadGamesCsv}><Download className="mr-2 h-4 w-4" /> Download Games CSV</Button></div>
              </CardHeader>
              <CardContent><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-slate-500"><SortableHeader label="Date" column="date" sortConfig={gameSort} onSort={handleGameSort} align="left" /><SortableHeader label="Opponent" column="opponent" sortConfig={gameSort} onSort={handleGameSort} align="left" /><SortableHeader label="GF" column="gf" sortConfig={gameSort} onSort={handleGameSort} align="right" /><SortableHeader label="GA" column="ga" sortConfig={gameSort} onSort={handleGameSort} align="right" /><SortableHeader label="Result" column="result" sortConfig={gameSort} onSort={handleGameSort} align="right" /></tr></thead><tbody>{displayedGames.map((g, idx) => <tr key={`${g.date}-${idx}`} className="border-b hover:bg-slate-50 last:border-0"><td className="py-3 pr-4">{new Date(`${g.date}T12:00:00`).toLocaleDateString()}</td><td className="px-2 py-3 font-medium">{g.opponent}</td><td className="px-2 py-3 text-right">{g.gf}</td><td className="px-2 py-3 text-right">{g.ga}</td><td className="px-2 py-3 text-right"><span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: resultColor(g.result) }}>{g.result}</span></td></tr>)}</tbody></table></div></CardContent>
            </Card>
            {activeSection === "games" && <Card className="border-0 shadow-lg"><CardHeader><CardTitle className="text-[#163E86]">Season Calendar</CardTitle><div className="text-sm text-slate-500">Full calendar view of the season. Dates with multiple games are split into separate result blocks.</div></CardHeader><CardContent><SeasonCalendar /></CardContent></Card>}
          </div>
        )}
      </div>
    </div>
  );
}
