import { useState } from "react";
import { useListNews, useCreateNews, useDeleteNews, getListNewsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "./AdminLayout";
import { format } from "date-fns";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/ImageUpload";

function NewsForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const createNews = useCreateNews();
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", category: "club-news",
    imageUrl: "", featured: false, author: "Arrows Media", tags: [] as string[],
  });

  function handle(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await createNews.mutateAsync({ data: form });
    queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-display font-bold text-xl uppercase tracking-tight">New Article</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Title *</label>
            <Input name="title" value={form.title} onChange={handle} required placeholder="Article title" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Slug *</label>
              <Input name="slug" value={form.slug} onChange={handle} required placeholder="article-slug" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Category</label>
              <select name="category" value={form.category} onChange={handle} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="club-news">Club News</option>
                <option value="match-report">Match Report</option>
                <option value="community">Community</option>
              </select>
            </div>
          </div>
          <ImageUpload
            label="Article Image"
            required
            value={form.imageUrl}
            onChange={url => setForm(f => ({ ...f, imageUrl: url }))}
          />
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Excerpt *</label>
            <Textarea name="excerpt" value={form.excerpt} onChange={handle} required placeholder="Short summary..." rows={2} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Content</label>
            <Textarea name="content" value={form.content} onChange={handle} placeholder="Full article content..." rows={6} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="h-4 w-4" />
            <label htmlFor="featured" className="text-sm text-muted-foreground">Featured article</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={createNews.isPending}>
              {createNews.isPending ? "Publishing..." : "Publish Article"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminNews() {
  const queryClient = useQueryClient();
  const { data: news, isLoading } = useListNews({ limit: 50 });
  const deleteNews = useDeleteNews();
  const [showForm, setShowForm] = useState(false);

  async function handleDelete(id: number) {
    if (!confirm("Delete this article?")) return;
    await deleteNews.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() });
  }

  return (
    <AdminLayout>
      {showForm && <NewsForm onClose={() => setShowForm(false)} />}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl uppercase tracking-tight">News Management</h1>
          <p className="text-muted-foreground mt-1">{news?.length ?? 0} articles published</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Article
        </Button>
      </div>

      {isLoading && <div className="text-muted-foreground">Loading...</div>}

      <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/20 border-b border-white/5">
            <tr>
              <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-muted-foreground">Article</th>
              <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Category</th>
              <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Date</th>
              <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Status</th>
              <th className="px-4 py-3 text-right font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {news?.map(article => (
              <tr key={article.id} className="hover:bg-white/2 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 hidden sm:block">
                      <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold truncate max-w-[200px]">{article.title}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{article.excerpt}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-muted-foreground hidden md:table-cell">{article.category}</td>
                <td className="px-4 py-4 text-muted-foreground hidden md:table-cell">{format(new Date(article.publishedAt), "MMM d, yyyy")}</td>
                <td className="px-4 py-4 hidden sm:table-cell">
                  <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${article.featured ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"}`}>
                    {article.featured ? "Featured" : "Normal"}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
