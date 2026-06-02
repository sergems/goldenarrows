import { useListNews, useGetNextFixture, useListResults, useGetLeagueTable, useListPlayers } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { format, differenceInSeconds } from "date-fns";
import { useState, useEffect } from "react";
import heroStadium from "@/assets/hero-stadium.png";
import playerPlaceholder from "@/assets/player-placeholder.png";
import trophiesImg from "@assets/trophies-won_1780384913023.png";
import sponsor10bet from "@assets/10bet-202425-side-banner_1780384942810.jpg";
import sponsorAquelle from "@assets/aquelle-viv-sidelogo-2425_1780384942808.jpg";
import sponsorDurban from "@assets/durban-tourism-sidelogo-2425_1780384942809.jpg";

function Countdown({ date }: { date: string }) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const matchDate = new Date(date);
      const diff = differenceInSeconds(matchDate, now);

      if (diff > 0) {
        setTimeLeft({
          d: Math.floor(diff / (3600 * 24)),
          h: Math.floor((diff % (3600 * 24)) / 3600),
          m: Math.floor((diff % 3600) / 60),
          s: diff % 60,
        });
      } else {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [date]);

  return (
    <div className="flex gap-4 justify-center">
      {[
        { label: "Days", value: timeLeft.d },
        { label: "Hours", value: timeLeft.h },
        { label: "Mins", value: timeLeft.m },
        { label: "Secs", value: timeLeft.s },
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="bg-black/40 backdrop-blur border border-primary/30 rounded-md w-16 h-16 flex items-center justify-center text-2xl font-display font-bold text-primary">
            {item.value.toString().padStart(2, "0")}
          </div>
          <span className="text-xs uppercase tracking-widest mt-2 text-white/60">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { data: news } = useListNews({ limit: 3 });
  const { data: nextFixture } = useGetNextFixture();
  const { data: recentResults } = useListResults({ limit: 3 });
  const { data: table } = useGetLeagueTable();
  const { data: players } = useListPlayers();

  return (
    <div className="flex flex-col w-full">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={heroStadium} alt="Stadium" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary font-bold uppercase tracking-[0.3em] text-sm mb-4">
              DStv Premiership · Durban, South Africa
            </p>
            <h1
              className="font-display text-6xl md:text-8xl lg:text-9xl text-white uppercase mb-4 drop-shadow-lg"
              style={{ letterSpacing: "0.08em" }}
            >
              Abafana{" "}
              <span className="text-primary" style={{ letterSpacing: "0.08em" }}>
                Bes'thende
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-medium mb-10 max-w-xl mx-auto">
              The Pride of KwaZulu-Natal. Passion, Spirit, and Electric Football.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/fixtures"
                className="bg-primary text-black font-bold uppercase tracking-wider px-8 py-4 rounded-sm hover:bg-primary/90 transition-colors"
              >
                View Fixtures
              </Link>
              <Link
                href="/squad"
                className="bg-white/10 backdrop-blur border border-white/25 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-sm hover:bg-white/20 transition-colors"
              >
                Meet The Squad
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Next Match ───────────────────────────────── */}
      {nextFixture && (
        <section className="relative z-20 mx-4 -mt-8 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-card">
          <div className="h-1 w-full bg-gradient-to-r from-secondary via-primary to-secondary" />
          <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="text-primary font-bold tracking-[0.25em] uppercase text-xs mb-2">Next Match</div>
              <div className="font-display text-xl" style={{ letterSpacing: "0.05em" }}>{nextFixture.competition}</div>
              <div className="text-white/50 text-sm mt-1">
                {format(new Date(nextFixture.date), "PPP")} &bull; {nextFixture.venue}
              </div>
            </div>

            <div className="flex items-center gap-6 font-display">
              <span className="text-xl md:text-3xl" style={{ letterSpacing: "0.04em" }}>{nextFixture.homeTeam}</span>
              <span className="text-white/40 text-sm bg-white/5 border border-white/10 px-3 py-1.5 rounded tracking-widest">VS</span>
              <span className="text-xl md:text-3xl" style={{ letterSpacing: "0.04em" }}>{nextFixture.awayTeam}</span>
            </div>

            <div className="hidden lg:block">
              <Countdown date={`${nextFixture.date}T${nextFixture.time || "15:00:00"}`} />
            </div>
          </div>
        </section>
      )}

      {/* ── Latest News ──────────────────────────────── */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-display text-4xl uppercase" style={{ letterSpacing: "0.06em" }}>
            Latest <span className="text-primary">News</span>
          </h2>
          <Link href="/news" className="text-white/50 hover:text-primary transition-colors font-medium uppercase tracking-wider text-sm hidden md:block">
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news?.map((item) => (
            <motion.div key={item.id} whileHover={{ y: -5 }} className="group cursor-pointer">
              <Link href={`/news/${item.id}`}>
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4 relative bg-card">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 bg-primary text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                    {item.category}
                  </div>
                </div>
                <div className="text-xs text-white/40 mb-2 uppercase tracking-wider">{format(new Date(item.publishedAt), "MMM d, yyyy")}</div>
                <h3 className="font-display text-xl group-hover:text-primary transition-colors line-clamp-2" style={{ letterSpacing: "0.04em" }}>
                  {item.title}
                </h3>
                <p className="text-white/60 line-clamp-2 text-sm mt-2">{item.excerpt}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Results + Table ──────────────────────────── */}
      <section className="bg-card py-20 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            <div className="lg:col-span-2">
              <div className="flex justify-between items-end mb-8">
                <h2 className="font-display text-3xl uppercase" style={{ letterSpacing: "0.06em" }}>
                  Recent <span className="text-primary">Results</span>
                </h2>
                <Link href="/results" className="text-white/50 hover:text-primary transition-colors font-medium uppercase tracking-wider text-sm">
                  All Results &rarr;
                </Link>
              </div>

              <div className="space-y-3">
                {recentResults?.map((result) => {
                  const isWin = result.homeTeam === "Golden Arrows" ? result.homeScore > result.awayScore : result.awayScore > result.homeScore;
                  const isDraw = result.homeScore === result.awayScore;
                  const badge = isWin ? "W" : isDraw ? "D" : "L";
                  const badgeColor = isWin ? "bg-green-600" : isDraw ? "bg-yellow-600" : "bg-red-600";
                  return (
                    <Link key={result.id} href={`/results/${result.id}`} className="block">
                      <div className="bg-background border border-white/5 rounded-lg px-6 py-5 hover:border-primary/40 transition-colors flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-white/40 uppercase tracking-wider">{format(new Date(result.date), "MMM d, yyyy")} · {result.competition}</div>
                        <div className="flex items-center gap-4 font-display text-xl" style={{ letterSpacing: "0.04em" }}>
                          <span className={result.homeScore > result.awayScore ? "text-white" : "text-white/50"}>{result.homeTeam}</span>
                          <div className="bg-card border border-white/10 px-4 py-1.5 rounded text-primary font-bold">
                            {result.homeScore} – {result.awayScore}
                          </div>
                          <span className={result.awayScore > result.homeScore ? "text-white" : "text-white/50"}>{result.awayTeam}</span>
                        </div>
                        <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full text-white ${badgeColor}`}>{badge}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl uppercase mb-8" style={{ letterSpacing: "0.06em" }}>
                League <span className="text-primary">Table</span>
              </h2>
              <div className="bg-background border border-white/5 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-card text-white/40 border-b border-white/5">
                    <tr>
                      <th className="px-4 py-3 text-left font-normal w-8">#</th>
                      <th className="px-4 py-3 text-left font-normal">Team</th>
                      <th className="px-4 py-3 text-center font-normal w-8">P</th>
                      <th className="px-4 py-3 text-center font-normal w-8">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {table?.slice(0, 6).map((row) => (
                      <tr key={row.team} className={row.isGoldenArrows ? "bg-primary/15 text-primary font-bold" : ""}>
                        <td className="px-4 py-3 text-left text-white/50">{row.position}</td>
                        <td className="px-4 py-3 text-left">{row.team}</td>
                        <td className="px-4 py-3 text-center text-white/50">{row.played}</td>
                        <td className="px-4 py-3 text-center font-bold">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-4 bg-card text-center border-t border-white/5">
                  <Link href="/league-table" className="text-sm uppercase tracking-wider font-bold hover:text-primary transition-colors">
                    Full Table &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Player Spotlight ─────────────────────────── */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="font-display text-4xl uppercase text-center mb-12" style={{ letterSpacing: "0.06em" }}>
          Player <span className="text-primary">Spotlight</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {players?.slice(0, 4).map((player) => (
            <Link key={player.id} href={`/squad/${player.id}`}>
              <div className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-card border border-white/10 hover:border-primary/40 transition-colors">
                <img
                  src={player.photoUrl || playerPlaceholder}
                  alt={player.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-primary text-xs font-bold uppercase tracking-widest mb-1">{player.position}</div>
                  <h3 className="text-lg font-display uppercase" style={{ letterSpacing: "0.05em" }}>{player.name}</h3>
                </div>
                <div className="absolute top-3 right-3 text-5xl font-display font-black text-white/10 leading-none">{player.number}</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/squad" className="inline-block border border-primary text-primary px-8 py-3 rounded uppercase tracking-wider font-bold hover:bg-primary hover:text-black transition-colors">
            View Full Squad
          </Link>
        </div>
      </section>

      {/* ── Club Honours / Trophies ───────────────────── */}
      <section className="bg-card border-y border-white/5 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-3">A Legacy of Success</p>
            <h2 className="font-display text-4xl uppercase" style={{ letterSpacing: "0.08em" }}>
              Club <span className="text-primary">Honours</span>
            </h2>
          </div>
          <div className="flex justify-center">
            <img
              src={trophiesImg}
              alt="Lamontville Golden Arrows FC Trophies"
              className="max-w-full w-full max-w-4xl object-contain"
            />
          </div>
        </div>
      </section>

      {/* ── Sponsors ─────────────────────────────────── */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-black/40 mb-10">
            Our Partners & Sponsors
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
            <img src={sponsor10bet} alt="10bet" className="h-16 object-contain rounded-lg" />
            <img src={sponsorAquelle} alt="aQuelle VIV" className="h-16 object-contain" />
            <img src={sponsorDurban} alt="Durban Tourism" className="h-14 object-contain" />
          </div>
        </div>
      </section>

    </div>
  );
}
