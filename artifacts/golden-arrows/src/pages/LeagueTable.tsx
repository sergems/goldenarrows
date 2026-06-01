import { useGetLeagueTable } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export default function LeagueTable() {
  const { data: table, isLoading } = useGetLeagueTable();

  return (
    <div className="min-h-screen">
      <div className="bg-card py-20 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display font-bold text-5xl uppercase tracking-tight mb-4">
            PSL <span className="text-primary">League Table</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Current DStv Premiership standings. Golden Arrows highlighted in gold.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {isLoading && <div className="text-center text-muted-foreground py-20">Loading table...</div>}

        {table && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-white/5 rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black/30 text-muted-foreground border-b border-white/5">
                    <th className="px-4 py-4 text-left font-bold uppercase tracking-wider w-10">#</th>
                    <th className="px-4 py-4 text-left font-bold uppercase tracking-wider">Club</th>
                    <th className="px-4 py-4 text-center font-bold uppercase tracking-wider w-12">P</th>
                    <th className="px-4 py-4 text-center font-bold uppercase tracking-wider w-12">W</th>
                    <th className="px-4 py-4 text-center font-bold uppercase tracking-wider w-12">D</th>
                    <th className="px-4 py-4 text-center font-bold uppercase tracking-wider w-12">L</th>
                    <th className="px-4 py-4 text-center font-bold uppercase tracking-wider w-12">GF</th>
                    <th className="px-4 py-4 text-center font-bold uppercase tracking-wider w-12">GA</th>
                    <th className="px-4 py-4 text-center font-bold uppercase tracking-wider w-12">GD</th>
                    <th className="px-4 py-4 text-center font-bold uppercase tracking-wider w-14">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {table.map((row, i) => (
                    <motion.tr
                      key={row.team}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className={
                        row.isGoldenArrows
                          ? "bg-primary/10 border-l-4 border-l-primary font-bold"
                          : "hover:bg-white/2"
                      }
                    >
                      <td className={`px-4 py-4 text-left font-display font-bold ${row.isGoldenArrows ? "text-primary text-lg" : "text-muted-foreground"}`}>
                        {row.position}
                      </td>
                      <td className={`px-4 py-4 text-left font-display font-bold ${row.isGoldenArrows ? "text-primary" : ""}`}>
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${row.isGoldenArrows ? "bg-primary text-black" : "bg-white/10 text-muted-foreground"}`}>
                            {row.team.split(" ").map(w => w[0]).slice(0, 2).join("")}
                          </div>
                          <span className="truncate">{row.team}</span>
                          {row.isGoldenArrows && <span className="text-xs bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded uppercase tracking-wider hidden sm:inline">Our Club</span>}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">{row.played}</td>
                      <td className="px-4 py-4 text-center text-green-400">{row.won}</td>
                      <td className="px-4 py-4 text-center text-yellow-400">{row.drawn}</td>
                      <td className="px-4 py-4 text-center text-red-400">{row.lost}</td>
                      <td className="px-4 py-4 text-center">{row.goalsFor}</td>
                      <td className="px-4 py-4 text-center">{row.goalsAgainst}</td>
                      <td className={`px-4 py-4 text-center ${row.goalDifference > 0 ? "text-green-400" : row.goalDifference < 0 ? "text-red-400" : ""}`}>
                        {row.goalDifference > 0 ? "+" : ""}{row.goalDifference}
                      </td>
                      <td className={`px-4 py-4 text-center font-display font-black text-lg ${row.isGoldenArrows ? "text-primary" : ""}`}>
                        {row.points}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        <div className="mt-6 text-xs text-muted-foreground text-center">
          DStv Premiership standings &bull; Updated regularly from official PSL data
        </div>
      </div>
    </div>
  );
}
