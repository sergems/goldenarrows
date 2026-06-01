import { useGetPlayer } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import playerPlaceholder from "@/assets/player-placeholder.png";

export default function PlayerProfile() {
  const { id } = useParams<{ id: string }>();
  const { data: player, isLoading } = useGetPlayer(Number(id));

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!player) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Player not found.</div>;

  const stats = [
    { label: "Appearances", value: player.appearances },
    { label: "Goals", value: player.goals },
    { label: "Assists", value: player.assists },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-card border-b border-white/5">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Link href="/squad" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm font-bold uppercase tracking-wider">
            <ArrowLeft className="h-4 w-4" /> Back to Squad
          </Link>

          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="relative flex-shrink-0">
              <div className="h-64 w-64 rounded-2xl overflow-hidden bg-gradient-to-br from-secondary/30 to-primary/10">
                <img
                  src={player.photoUrl || playerPlaceholder}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-xl bg-primary flex items-center justify-center font-display font-black text-3xl text-black">
                {player.number}
              </div>
            </div>

            <div className="flex-1">
              <div className="text-primary font-bold uppercase tracking-widest text-sm mb-2">{player.position}</div>
              <h1 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tight mb-4">{player.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <span>Nationality: <strong className="text-foreground">{player.nationality}</strong></span>
                {player.age && <span>Age: <strong className="text-foreground">{player.age}</strong></span>}
              </div>
              {player.bio && (
                <p className="text-muted-foreground max-w-2xl leading-relaxed">{player.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-8">Season <span className="text-primary">Statistics</span></h2>
        <div className="grid grid-cols-3 gap-4 max-w-lg">
          {stats.map(stat => (
            <div key={stat.label} className="bg-card border border-white/5 rounded-xl p-6 text-center">
              <div className="font-display font-black text-5xl text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground text-sm uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
