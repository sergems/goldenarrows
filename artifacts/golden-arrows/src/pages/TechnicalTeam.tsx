import { useListStaff } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export default function TechnicalTeam() {
  const { data: staff, isLoading } = useListStaff();

  return (
    <div className="min-h-screen">
      <div className="bg-card py-3 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight leading-tight">
            Technical <span className="text-primary">Team</span>
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            The dedicated coaching and support staff behind Abafana Bes'thende's success.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {isLoading && <div className="text-center text-muted-foreground py-20">Loading staff...</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff?.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-colors"
            >
              {/* Photo Placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-secondary/30 to-primary/10 flex items-center justify-center">
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-20 w-20 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center font-display font-bold text-2xl text-primary">
                      {member.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="text-primary text-xs font-bold uppercase tracking-widest mb-1">{member.role}</div>
                <h3 className="font-display font-bold text-xl mb-2">{member.name}</h3>
                {member.nationality && (
                  <div className="text-xs text-muted-foreground mb-3">{member.nationality}</div>
                )}
                {member.bio && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{member.bio}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
