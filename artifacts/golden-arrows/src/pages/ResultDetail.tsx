import { useGetResult } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, Goal, Video } from "lucide-react";

export default function ResultDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: result, isLoading } = useGetResult(Number(id));

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!result) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Match not found.</div>;

  return (
    <div className="min-h-screen">
      <div className="bg-card py-16 border-b border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/results" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm font-bold uppercase tracking-wider">
            <ArrowLeft className="h-4 w-4" /> Back to Results
          </Link>

          <div className="text-center">
            <div className="text-primary font-bold uppercase tracking-widest text-sm mb-2">{result.competition}</div>
            <div className="text-muted-foreground text-sm mb-8">
              {format(new Date(result.date), "EEEE, MMMM d, yyyy")}
              {result.venue && <span> &bull; {result.venue}</span>}
            </div>

            <div className="flex items-center justify-center gap-8 md:gap-16">
              <div className="flex flex-col items-center gap-3">
                <div className="h-20 w-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-display font-bold text-2xl text-primary">
                  {result.homeTeam.split(" ").map(w => w[0]).slice(0, 2).join("")}
                </div>
                <span className="font-display font-bold text-xl md:text-2xl text-center max-w-[160px]">{result.homeTeam}</span>
              </div>

              <div className="text-center">
                <div className="bg-background border border-white/10 rounded-xl px-8 py-4">
                  <div className="font-display font-black text-5xl md:text-7xl text-primary">
                    {result.homeScore} – {result.awayScore}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mt-2">Full Time</div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="h-20 w-20 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center font-display font-bold text-2xl text-muted-foreground">
                  {result.awayTeam.split(" ").map(w => w[0]).slice(0, 2).join("")}
                </div>
                <span className="font-display font-bold text-xl md:text-2xl text-center max-w-[160px]">{result.awayTeam}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {result.scorers && result.scorers.length > 0 && (
              <div className="bg-card border border-white/5 rounded-xl p-6">
                <h2 className="font-display font-bold text-xl uppercase tracking-tight mb-4 flex items-center gap-2">
                  Goalscorers
                </h2>
                <ul className="space-y-3">
                  {result.scorers.map((scorer, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <span>{scorer}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.matchReport && (
              <div className="bg-card border border-white/5 rounded-xl p-6">
                <h2 className="font-display font-bold text-xl uppercase tracking-tight mb-4">Match Report</h2>
                <p className="text-muted-foreground leading-relaxed">{result.matchReport}</p>
              </div>
            )}

            {result.highlightUrl && (
              <div className="bg-card border border-white/5 rounded-xl p-6">
                <h2 className="font-display font-bold text-xl uppercase tracking-tight mb-4 flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  Match Highlights
                </h2>
                <a
                  href={result.highlightUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-black font-bold px-6 py-3 rounded uppercase tracking-wider hover:bg-primary/90 transition-colors"
                >
                  Watch on YouTube
                </a>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-card border border-white/5 rounded-xl p-6">
              <h3 className="font-display font-bold text-lg uppercase tracking-tight mb-4 text-primary">Match Info</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Competition</dt>
                  <dd className="font-bold mt-1">{result.competition}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Date</dt>
                  <dd className="font-bold mt-1">{format(new Date(result.date), "PPP")}</dd>
                </div>
                {result.venue && (
                  <div>
                    <dt className="text-muted-foreground">Venue</dt>
                    <dd className="font-bold mt-1">{result.venue}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
