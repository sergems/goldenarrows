import { useGetNewsArticle, useListNews } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NewsArticle() {
  const { id } = useParams<{ id: string }>();
  const { data: article, isLoading } = useGetNewsArticle(Number(id));
  const { data: related } = useListNews({ category: article?.category, limit: 3 });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading article...</div>;
  if (!article) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Article not found.</div>;

  const relatedArticles = related?.filter(a => a.id !== article.id).slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-10 max-w-4xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">{article.category}</span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight">{article.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-10">
        <Link href="/news" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm font-bold uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" /> Back to News
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <div className="text-muted-foreground text-sm mb-8 flex items-center gap-3">
              <span>{article.author}</span>
              <span>&bull;</span>
              <span>{format(new Date(article.publishedAt), "MMMM d, yyyy")}</span>
            </div>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed font-medium">{article.excerpt}</p>
            {article.content && (
              <div className="prose prose-invert prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                {article.content}
              </div>
            )}

            {article.tags && article.tags.length > 0 && (
              <div className="mt-10 flex gap-2 flex-wrap">
                {article.tags.map(tag => (
                  <span key={tag} className="bg-card border border-white/10 text-muted-foreground text-xs px-3 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          <div>
            {relatedArticles && relatedArticles.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-lg uppercase tracking-tight mb-6 text-primary">Related Articles</h3>
                <div className="space-y-4">
                  {relatedArticles.map(rel => (
                    <Link key={rel.id} href={`/news/${rel.id}`} className="block group">
                      <div className="flex gap-3">
                        <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={rel.imageUrl} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{format(new Date(rel.publishedAt), "MMM d, yyyy")}</p>
                          <p className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-2 leading-snug">{rel.title}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
