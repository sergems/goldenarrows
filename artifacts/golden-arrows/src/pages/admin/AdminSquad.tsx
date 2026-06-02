import { useState } from "react";
import {
  useListPlayers, useCreatePlayer, useDeletePlayer, getListPlayersQueryKey,
  useCreateNews, getListNewsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "./AdminLayout";
import { Plus, Trash2, X, Megaphone, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import playerPlaceholder from "@/assets/player-placeholder.png";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buildAnnouncement(form: {
  name: string; position: string; nationality: string; age: number; number: number; photoUrl: string;
}) {
  const title = `Golden Arrows Sign ${form.name}`;
  const slug = `golden-arrows-sign-${slugify(form.name)}-${Date.now()}`;
  const article = `${form.nationality} ${form.position.toLowerCase()} ${form.name} joins Lamontville Golden Arrows FC. ` +
    `The ${form.age > 0 ? `${form.age}-year-old` : "new"} signing wears the number ${form.number} shirt and is set to strengthen the Abafana Bes'thende squad for the seasons ahead.\n\n` +
    `"We are delighted to welcome ${form.name.split(" ")[0]} to the club. He brings quality and experience that will benefit the whole squad," said a club spokesperson.\n\n` +
    `${form.name} is available immediately and the club wishes him every success in the famous Golden Arrows colours.`;

  return {
    title,
    slug,
    excerpt: `Lamontville Golden Arrows FC are delighted to announce the signing of ${form.name}, ${form.nationality} ${form.position.toLowerCase()}.`,
    content: article,
    category: "Transfer News",
    imageUrl: form.photoUrl || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    author: "Golden Arrows FC",
    tags: ["Transfer", "Squad", "Signing"],
    featured: false,
  };
}

function PlayerForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const createPlayer = useCreatePlayer();
  const createNews = useCreateNews();
  const [form, setForm] = useState({
    name: "", position: "Forward", number: 1, nationality: "South African",
    age: 22, photoUrl: "", bio: "", appearances: 0, goals: 0, assists: 0,
  });
  const [createAnnouncement, setCreateAnnouncement] = useState(true);
  const [done, setDone] = useState<{ playerName: string; withArticle: boolean } | null>(null);

  function handle(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const val = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm(f => ({ ...f, [e.target.name]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await createPlayer.mutateAsync({ data: form });
    queryClient.invalidateQueries({ queryKey: getListPlayersQueryKey() });

    if (createAnnouncement && form.name.trim()) {
      const article = buildAnnouncement(form);
      await createNews.mutateAsync({ data: article });
      queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() });
    }

    setDone({ playerName: form.name, withArticle: createAnnouncement });
  }

  const isPending = createPlayer.isPending || createNews.isPending;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card border border-white/10 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-display font-bold text-xl uppercase tracking-tight">Add Player</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>

        {done ? (
          <div className="p-10 text-center">
            <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <div className="font-display font-bold text-xl uppercase mb-2" style={{ letterSpacing: "0.06em" }}>
              Player Added!
            </div>
            <p className="text-muted-foreground text-sm mb-2">
              <strong className="text-foreground">{done.playerName}</strong> has been added to the squad.
            </p>
            {done.withArticle && (
              <div className="flex items-center justify-center gap-2 text-sm text-primary font-bold mt-1 mb-6">
                <Megaphone className="h-4 w-4" />
                Signing announcement created in News
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => {
                setDone(null);
                setForm({ name: "", position: "Forward", number: 1, nationality: "South African", age: 22, photoUrl: "", bio: "", appearances: 0, goals: 0, assists: 0 });
                setCreateAnnouncement(true);
              }}>
                Add Another
              </Button>
              <Button onClick={onClose}>Done</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm text-muted-foreground mb-2 block">Full Name *</label>
                <Input name="name" value={form.name} onChange={handle} required placeholder="e.g. Sibusiso Mthethwa" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Position</label>
                <select name="position" value={form.position} onChange={handle} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option>Goalkeeper</option>
                  <option>Defender</option>
                  <option>Midfielder</option>
                  <option>Forward</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Squad Number</label>
                <Input name="number" type="number" value={form.number} onChange={handle} min={1} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Nationality</label>
                <Input name="nationality" value={form.nationality} onChange={handle} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Age</label>
                <Input name="age" type="number" value={form.age} onChange={handle} min={15} max={50} />
              </div>
              <div className="col-span-2">
                <label className="text-sm text-muted-foreground mb-2 block">Photo URL</label>
                <Input name="photoUrl" value={form.photoUrl} onChange={handle} placeholder="https://..." />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Appearances</label>
                <Input name="appearances" type="number" value={form.appearances} onChange={handle} min={0} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Goals</label>
                <Input name="goals" type="number" value={form.goals} onChange={handle} min={0} />
              </div>
            </div>

            {/* Signing announcement toggle */}
            <div
              onClick={() => setCreateAnnouncement(v => !v)}
              className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                createAnnouncement
                  ? "bg-primary/10 border-primary/30"
                  : "bg-white/2 border-white/10 hover:border-white/20"
              }`}
            >
              <div className={`h-5 w-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-colors ${
                createAnnouncement ? "bg-primary border-primary" : "border-white/30"
              }`}>
                {createAnnouncement && (
                  <svg viewBox="0 0 12 10" className="w-3 h-3 fill-black"><path d="M1 5l3 4L11 1"/></svg>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 font-bold text-sm mb-0.5">
                  <Megaphone className={`h-4 w-4 ${createAnnouncement ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={createAnnouncement ? "text-foreground" : "text-muted-foreground"}>
                    Create signing announcement
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-snug">
                  Automatically publishes a <em>"Golden Arrows Sign {form.name || "[Player Name]"}"</em> news article in the Transfer News category.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isPending} className="min-w-32">
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {createPlayer.isPending ? "Adding player…" : "Creating article…"}
                  </span>
                ) : (
                  createAnnouncement ? "Add & Announce" : "Add Player"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AdminSquad() {
  const queryClient = useQueryClient();
  const { data: players, isLoading } = useListPlayers();
  const deletePlayer = useDeletePlayer();
  const [showForm, setShowForm] = useState(false);

  async function handleDelete(id: number) {
    if (!confirm("Remove this player from the squad?")) return;
    await deletePlayer.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getListPlayersQueryKey() });
  }

  return (
    <AdminLayout>
      {showForm && <PlayerForm onClose={() => setShowForm(false)} />}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl uppercase tracking-tight">Squad Management</h1>
          <p className="text-muted-foreground mt-1">{players?.length ?? 0} players in the squad</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Player
        </Button>
      </div>

      {isLoading && <div className="text-muted-foreground">Loading...</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {players?.map(player => (
          <div key={player.id} className="bg-card border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors group">
            <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-secondary/20 to-primary/10">
              <img
                src={player.photoUrl || playerPlaceholder}
                alt={player.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 font-display font-black text-3xl text-white/20">{player.number}</div>
              <button
                onClick={() => handleDelete(player.id)}
                className="absolute top-2 left-2 h-8 w-8 rounded-lg bg-destructive/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4">
              <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1">{player.position}</div>
              <div className="font-display font-bold truncate">{player.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{player.nationality}</div>
              <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
                <span><strong className="text-foreground">{player.appearances}</strong> Apps</span>
                <span><strong className="text-foreground">{player.goals}</strong> Goals</span>
                <span><strong className="text-foreground">{player.assists}</strong> Assists</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
