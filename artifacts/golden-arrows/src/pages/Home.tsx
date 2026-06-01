import { useListNews, useGetNextFixture, useListResults, useGetLeagueTable, useListPlayers, useListSponsors, useListFixtures } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { format, differenceInSeconds } from "date-fns";
import { useState, useEffect } from "react";
import heroStadium from "@/assets/hero-stadium.png";
import playerPlaceholder from "@/assets/player-placeholder.png";

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
          <div className="bg-black/50 backdrop-blur border border-white/10 rounded-md w-16 h-16 flex items-center justify-center text-2xl font-display font-bold text-primary">
            {item.value.toString().padStart(2, "0")}
          </div>
          <span className="text-xs uppercase tracking-widest mt-2 text-white/70">{item.label}</span>
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
  const { data: sponsors } = useListSponsors();
  
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={heroStadium} alt="Stadium" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl text-white uppercase tracking-tighter mb-4 drop-shadow-lg">
              Abafana <span className="text-primary">Bes'thende</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-10 max-w-2xl mx-auto drop-shadow">
              The Pride of KwaZulu-Natal. Passion, Spirit, and Electric Football.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/tickets" className="bg-primary text-black font-bold uppercase tracking-wider px-8 py-4 rounded-sm hover:bg-primary/90 transition-colors">
                Get Tickets
              </Link>
              <Link href="/squad" className="bg-white/10 backdrop-blur border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-sm hover:bg-white/20 transition-colors">
                Meet The Squad
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Next Match Strip */}
      {nextFixture && (
        <section className="bg-card border-y border-white/5 py-8 -mt-8 relative z-20 mx-4 rounded-lg shadow-2xl">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Next Match</div>
              <div className="font-display text-xl">{nextFixture.competition}</div>
              <div className="text-muted-foreground text-sm">{format(new Date(nextFixture.date), "PPP")} &bull; {nextFixture.venue}</div>
            </div>
            
            <div className="flex items-center gap-6 text-xl md:text-3xl font-display font-bold">
              <span>{nextFixture.homeTeam}</span>
              <span className="text-muted-foreground text-sm bg-white/5 px-3 py-1 rounded">VS</span>
              <span>{nextFixture.awayTeam}</span>
            </div>
            
            <div className="hidden lg:block">
              <Countdown date={`${nextFixture.date}T${nextFixture.time || '15:00:00'}`} />
            </div>
          </div>
        </section>
      )}

      {/* Latest News */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-display text-4xl font-bold uppercase tracking-tight">Latest <span className="text-primary">News</span></h2>
          <Link href="/news" className="text-muted-foreground hover:text-primary transition-colors font-medium uppercase tracking-wider text-sm hidden md:block">
            View All News &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news?.map((item) => (
            <motion.div key={item.id} whileHover={{ y: -5 }} className="group cursor-pointer">
              <Link href={`/news/${item.id}`}>
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4 relative">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 bg-primary text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                    {item.category}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-2">{format(new Date(item.publishedAt), "MMM d, yyyy")}</div>
                <h3 className="font-display font-bold text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                <p className="text-muted-foreground line-clamp-2 text-sm">{item.excerpt}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats & Results */}
      <section className="bg-card py-20 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <div className="lg:col-span-2">
              <div className="flex justify-between items-end mb-8">
                <h2 className="font-display text-3xl font-bold uppercase tracking-tight">Recent <span className="text-primary">Results</span></h2>
                <Link href="/results" className="text-muted-foreground hover:text-primary transition-colors font-medium uppercase tracking-wider text-sm">
                  All Results &rarr;
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentResults?.map((result) => (
                  <Link key={result.id} href={`/results/${result.id}`} className="block">
                    <div className="bg-background border border-white/5 rounded-lg p-6 hover:border-primary/50 transition-colors flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-muted-foreground">{format(new Date(result.date), "MMM d, yyyy")} &bull; {result.competition}</div>
                      <div className="flex items-center gap-4 font-display text-xl font-bold w-full md:w-auto justify-center">
                        <span className={`text-right ${result.homeScore > result.awayScore ? 'text-white' : 'text-white/60'}`}>{result.homeTeam}</span>
                        <div className="bg-card border border-white/10 px-4 py-2 rounded text-primary">
                          {result.homeScore} - {result.awayScore}
                        </div>
                        <span className={`text-left ${result.awayScore > result.homeScore ? 'text-white' : 'text-white/60'}`}>{result.awayTeam}</span>
                      </div>
                      <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary hidden md:block">Report</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-8">
                <h2 className="font-display text-3xl font-bold uppercase tracking-tight">League <span className="text-primary">Table</span></h2>
              </div>
              <div className="bg-background border border-white/5 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-card text-muted-foreground border-b border-white/5">
                    <tr>
                      <th className="px-4 py-3 text-left font-normal w-8">#</th>
                      <th className="px-4 py-3 text-left font-normal">Team</th>
                      <th className="px-4 py-3 text-center font-normal w-8">P</th>
                      <th className="px-4 py-3 text-center font-normal w-8">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {table?.slice(0, 5).map((row) => (
                      <tr key={row.team} className={row.isGoldenArrows ? "bg-primary/10 text-primary font-bold" : ""}>
                        <td className="px-4 py-3 text-left">{row.position}</td>
                        <td className="px-4 py-3 text-left">{row.team}</td>
                        <td className="px-4 py-3 text-center">{row.played}</td>
                        <td className="px-4 py-3 text-center">{row.points}</td>
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
      
      {/* Player Spotlight */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-center mb-12">Player <span className="text-primary">Spotlight</span></h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {players?.slice(0, 4).map((player) => (
            <Link key={player.id} href={`/squad/${player.id}`}>
              <div className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-card border border-white/10">
                <img src={player.photoUrl || playerPlaceholder} alt={player.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-6xl font-display font-black text-white/20 absolute -top-8 right-4">{player.number}</div>
                  <div className="text-primary text-sm font-bold uppercase tracking-wider mb-1">{player.position}</div>
                  <h3 className="text-xl font-display font-bold uppercase">{player.name}</h3>
                </div>
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

      {/* Sponsors */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {sponsors?.map((sponsor) => (
              <img key={sponsor.id} src={sponsor.logoUrl} alt={sponsor.name} className="h-12 object-contain" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
