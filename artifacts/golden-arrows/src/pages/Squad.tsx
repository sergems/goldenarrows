import { useListPlayers } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import playerPlaceholder from "@/assets/player-placeholder.png";

export default function Squad() {
  const { data: players, isLoading } = useListPlayers();

  if (isLoading) return <div className="p-20 text-center text-muted-foreground">Loading squad...</div>;

  const positions = ["Goalkeepers", "Defenders", "Midfielders", "Forwards"];

  return (
    <div className="min-h-screen">
      <div className="bg-card py-20 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display font-bold text-5xl uppercase tracking-tight mb-4">First <span className="text-primary">Team</span></h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Meet the players representing Abafana Bes'thende in the current season.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="Goalkeepers" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-card border border-white/10 h-auto p-1">
              {positions.map(pos => (
                <TabsTrigger key={pos} value={pos} className="px-6 py-3 uppercase tracking-wider font-bold text-sm data-[state=active]:bg-primary data-[state=active]:text-black">
                  {pos}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {positions.map((pos) => {
            // Simplified position matching for demo
            const mappedPos = pos.slice(0, -1); // "Goalkeeper"
            const group = players?.filter(p => p.position.includes(mappedPos) || (pos === 'Forwards' && p.position.includes('Striker'))) || [];

            return (
              <TabsContent key={pos} value={pos}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {group.map((player, i) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link href={`/squad/${player.id}`}>
                        <div className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-card border border-white/10 cursor-pointer">
                          <img src={player.photoUrl || playerPlaceholder} alt={player.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="text-6xl font-display font-black text-white/20 absolute -top-8 right-4 transition-all group-hover:text-primary/30 group-hover:-top-10">{player.number}</div>
                            <div className="text-primary text-sm font-bold uppercase tracking-wider mb-1">{player.position}</div>
                            <h3 className="text-xl font-display font-bold uppercase">{player.name}</h3>
                            <div className="text-xs text-muted-foreground mt-2">{player.nationality}</div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                  {group.length === 0 && (
                    <div className="col-span-full text-center py-20 text-muted-foreground border border-dashed border-white/10 rounded-xl">
                      No players listed for this position.
                    </div>
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
