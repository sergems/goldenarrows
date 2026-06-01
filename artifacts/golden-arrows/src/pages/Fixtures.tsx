import { useListFixtures } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Link } from "wouter";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Fixtures() {
  const { data: fixtures, isLoading } = useListFixtures();

  return (
    <div className="min-h-screen">
      <div className="bg-card py-20 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display font-bold text-5xl uppercase tracking-tight mb-4">
            Upcoming <span className="text-primary">Fixtures</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            All upcoming DStv Premiership and cup matches for Abafana Bes'thende.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {isLoading && (
          <div className="text-center text-muted-foreground py-20">Loading fixtures...</div>
        )}
        {!isLoading && (!fixtures || fixtures.length === 0) && (
          <div className="text-center text-muted-foreground py-20">No upcoming fixtures at this time.</div>
        )}
        <div className="space-y-4">
          {fixtures?.map((fixture, i) => (
            <motion.div
              key={fixture.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-card border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-colors"
            >
              <div className="bg-black/20 px-6 py-2 flex items-center justify-between">
                <Badge variant="outline" className="border-primary/30 text-primary text-xs uppercase tracking-wider font-bold">
                  {fixture.competition}
                </Badge>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(fixture.date), "EEEE, MMMM d, yyyy")}
                  {fixture.time && <span>&bull; KO {fixture.time}</span>}
                </div>
              </div>

              <div className="px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6 flex-1 justify-center md:justify-start">
                  <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display font-bold text-lg">
                    {fixture.homeTeam.split(" ").map(w => w[0]).slice(0, 2).join("")}
                  </div>
                  <span className="font-display font-bold text-xl md:text-2xl text-center">{fixture.homeTeam}</span>
                </div>

                <div className="text-center flex-shrink-0">
                  <div className="bg-background border border-white/10 px-6 py-3 rounded-lg">
                    <div className="font-display font-bold text-2xl text-muted-foreground">VS</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 flex-1 justify-center md:justify-end flex-row-reverse md:flex-row">
                  <span className="font-display font-bold text-xl md:text-2xl text-center">{fixture.awayTeam}</span>
                  <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-display font-bold text-lg text-muted-foreground">
                    {fixture.awayTeam.split(" ").map(w => w[0]).slice(0, 2).join("")}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-black/10 border-t border-white/5 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {fixture.venue}
                </div>
                {fixture.ticketUrl && (
                  <a
                    href={fixture.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-primary text-black text-sm font-bold px-4 py-2 rounded uppercase tracking-wider hover:bg-primary/90 transition-colors"
                  >
                    <Ticket className="h-4 w-4" />
                    Buy Tickets
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/results" className="text-primary hover:underline font-bold uppercase tracking-wider text-sm">
            View Past Results &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
