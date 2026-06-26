import { useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { useSyncFixtures, useSyncResults, useSyncTable } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListFixturesQueryKey, getListResultsQueryKey, getGetLeagueTableQueryKey } from "@workspace/api-client-react";
import { RefreshCw, CheckCircle, AlertCircle, Calendar, Swords, TableProperties, Info, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

type SyncStatus = "idle" | "loading" | "success" | "error";

interface SyncState {
  status: SyncStatus;
  message: string;
  note?: string;
}

const TABLE_SCHEDULE_SLOTS = Array.from({ length: 23 }, (_, i) => {
  const h = 12 + Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${h}:${m}`;
});

function SyncCard({
  icon: Icon,
  title,
  description,
  state,
  badge,
  onSync,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  state: SyncState;
  badge?: React.ReactNode;
  onSync: () => void;
}) {
  return (
    <div className="bg-card border border-white/5 rounded-xl p-6 flex flex-col gap-5">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-bold text-base uppercase tracking-tight">{title}</h3>
            {badge}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>

      {state.status !== "idle" && (
        <div
          className={`rounded-lg px-4 py-3 text-sm flex items-start gap-2.5 ${
            state.status === "loading"
              ? "bg-white/5 text-white/70"
              : state.status === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {state.status === "loading" && <RefreshCw className="h-4 w-4 animate-spin flex-shrink-0 mt-0.5" />}
          {state.status === "success" && <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
          {state.status === "error" && <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
          <div>
            <span>{state.message}</span>
            {state.note && (
              <p className="mt-1 text-xs opacity-80 flex items-start gap-1">
                <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
                {state.note}
              </p>
            )}
          </div>
        </div>
      )}

      <Button
        onClick={onSync}
        disabled={state.status === "loading"}
        className="w-full"
        variant={state.status === "success" ? "outline" : "default"}
      >
        {state.status === "loading" ? (
          <span className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" /> Syncing…
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            {state.status === "success" ? "Sync Again" : "Sync Now"}
          </span>
        )}
      </Button>
    </div>
  );
}

export default function AdminSync() {
  const qc = useQueryClient();
  const syncFixtures = useSyncFixtures();
  const syncResults = useSyncResults();
  const syncTable = useSyncTable();

  const [fixturesState, setFixturesState] = useState<SyncState>({ status: "idle", message: "" });
  const [resultsState, setResultsState] = useState<SyncState>({ status: "idle", message: "" });
  const [tableState, setTableState] = useState<SyncState>({ status: "idle", message: "" });

  async function handleSyncFixtures() {
    setFixturesState({ status: "loading", message: "Pulling fixtures from Football API…" });
    try {
      const data = await syncFixtures.mutateAsync({});
      qc.invalidateQueries({ queryKey: getListFixturesQueryKey() });
      setFixturesState({
        status: "success",
        message: `Synced ${data.synced} fixture${data.synced !== 1 ? "s" : ""} from the ${data.season} season.`,
        note: data.note,
      });
    } catch (err) {
      setFixturesState({
        status: "error",
        message: err instanceof Error ? err.message : "Sync failed. Check your FOOTBALL_API_KEY.",
      });
    }
  }

  async function handleSyncResults() {
    setResultsState({ status: "loading", message: "Pulling results from Football API…" });
    try {
      const data = await syncResults.mutateAsync({});
      qc.invalidateQueries({ queryKey: getListResultsQueryKey() });
      setResultsState({
        status: "success",
        message: `Synced ${data.synced} result${data.synced !== 1 ? "s" : ""} from the ${data.season} season.`,
        note: data.note,
      });
    } catch (err) {
      setResultsState({
        status: "error",
        message: err instanceof Error ? err.message : "Sync failed. Check your FOOTBALL_API_KEY.",
      });
    }
  }

  async function handleSyncTable() {
    setTableState({ status: "loading", message: "Fetching live PSL standings from ScoreAxis…" });
    try {
      const data = await syncTable.mutateAsync({});
      qc.invalidateQueries({ queryKey: getGetLeagueTableQueryKey() });
      setTableState({
        status: "success",
        message: `Updated ${data.synced} teams in the 2025/2026 league table.`,
      });
    } catch (err) {
      setTableState({
        status: "error",
        message: err instanceof Error ? err.message : "Sync failed.",
      });
    }
  }

  async function handleSyncAll() {
    await Promise.allSettled([
      handleSyncFixtures(),
      handleSyncResults(),
      handleSyncTable(),
    ]);
  }

  const anyLoading =
    fixturesState.status === "loading" ||
    resultsState.status === "loading" ||
    tableState.status === "loading";

  return (
    <AdminLayout>
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-3xl uppercase tracking-tight">Live Data Sync</h1>
          <p className="text-muted-foreground mt-1">
            Manually refresh fixtures, results, and PSL standings at any time.
          </p>
        </div>
        <Button onClick={handleSyncAll} disabled={anyLoading} size="lg">
          {anyLoading ? (
            <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" /> Syncing All…</span>
          ) : (
            <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4" /> Sync All Now</span>
          )}
        </Button>
      </div>

      {/* Table auto-sync schedule banner */}
      <div className="bg-card border border-white/5 rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Zap className="h-4 w-4 text-primary" />
          <span className="font-display font-bold text-sm uppercase tracking-wider">League Table — Auto-Sync</span>
          <span className="ml-auto text-xs bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Standings are fetched from <span className="text-white font-semibold">ScoreAxis</span> every <span className="text-white font-semibold">30 minutes</span> during the match window — no API key required.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {TABLE_SCHEDULE_SLOTS.map(t => (
            <span key={t} className="text-[11px] font-bold font-mono bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded">
              {t}
            </span>
          ))}
          <span className="text-[11px] text-muted-foreground self-center ml-1">SAST</span>
        </div>
      </div>

      {/* Football API schedule banner */}
      <div className="bg-card border border-white/5 rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground">Fixtures &amp; Results — Auto-Sync</span>
          <span className="ml-auto text-xs bg-white/5 text-white/50 border border-white/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">4× Daily</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["15:00", "18:00", "20:00", "22:00"].map(t => (
            <div key={t} className="bg-background rounded-lg border border-white/5 px-3 py-2.5 text-center">
              <div className="font-display font-black text-lg text-white/60">{t} SAST</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 flex items-start gap-1.5">
          <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
          Requires a <code className="text-white/60 font-mono text-xs bg-white/5 px-1 rounded">FOOTBALL_API_KEY</code> secret. Free plan covers completed seasons only.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SyncCard
          icon={Calendar}
          title="Fixtures"
          description="Upcoming Golden Arrows matches scheduled in the DStv Premiership and cup competitions."
          state={fixturesState}
          onSync={handleSyncFixtures}
        />
        <SyncCard
          icon={Swords}
          title="Results"
          description="Completed match results with scores from the current or most recent accessible season."
          state={resultsState}
          onSync={handleSyncResults}
        />
        <SyncCard
          icon={TableProperties}
          title="League Table"
          description="Live 2025/2026 PSL standings pulled directly from ScoreAxis — always up to date."
          state={tableState}
          badge={
            <span className="text-[10px] bg-primary/15 text-primary border border-primary/25 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
              ScoreAxis
            </span>
          }
          onSync={handleSyncTable}
        />
      </div>
    </AdminLayout>
  );
}
