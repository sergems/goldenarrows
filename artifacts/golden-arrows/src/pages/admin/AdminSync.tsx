import { useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { useSyncFixtures, useSyncResults, useSyncTable } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListFixturesQueryKey, getListResultsQueryKey, getGetLeagueTableQueryKey } from "@workspace/api-client-react";
import { RefreshCw, CheckCircle, AlertCircle, Calendar, Swords, TableProperties, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

type SyncStatus = "idle" | "loading" | "success" | "error";

interface SyncState {
  status: SyncStatus;
  message: string;
  note?: string;
}

function SyncCard({
  icon: Icon,
  title,
  description,
  state,
  onSync,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  state: SyncState;
  onSync: () => void;
}) {
  return (
    <div className="bg-card border border-white/5 rounded-xl p-6 flex flex-col gap-5">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-base uppercase tracking-tight">{title}</h3>
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
    setTableState({ status: "loading", message: "Pulling PSL standings from Football API…" });
    try {
      const data = await syncTable.mutateAsync({});
      qc.invalidateQueries({ queryKey: getGetLeagueTableQueryKey() });
      setTableState({
        status: "success",
        message: `Synced ${data.synced} teams in the league table from the ${data.season} season.`,
        note: data.note,
      });
    } catch (err) {
      setTableState({
        status: "error",
        message: err instanceof Error ? err.message : "Sync failed. Check your FOOTBALL_API_KEY.",
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
            Pull the latest fixtures, results, and standings from the PSL Football API.
          </p>
        </div>
        <Button onClick={handleSyncAll} disabled={anyLoading} size="lg">
          {anyLoading ? (
            <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" /> Syncing All…</span>
          ) : (
            <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4" /> Sync All</span>
          )}
        </Button>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl px-5 py-4 mb-8 flex items-start gap-3 text-sm">
        <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-white/80">
          Data is sourced from <span className="font-bold text-white">API-Sports (v3.football.api-sports.io)</span> using
          your <code className="text-primary font-mono text-xs bg-primary/10 px-1.5 py-0.5 rounded">FOOTBALL_API_KEY</code>.
          Free plan users can access completed seasons only. Syncing will not overwrite manually entered data that already exists.
        </div>
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
          description="Full PSL standings including all teams, points, goal difference, and form."
          state={tableState}
          onSync={handleSyncTable}
        />
      </div>
    </AdminLayout>
  );
}
