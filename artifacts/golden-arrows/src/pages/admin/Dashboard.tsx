import { useListNews, useListPlayers, useListGallery, useGetStatsSummary, useGetLeagueTable, useListEnquiries } from "@workspace/api-client-react";
import { AdminLayout } from "./AdminLayout";
import { Newspaper, Users, Image, Trophy, TrendingUp, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { data: news } = useListNews({ limit: 5 });
  const { data: players } = useListPlayers();
  const { data: gallery } = useListGallery({ limit: 100 });
  const { data: stats } = useGetStatsSummary();
  const { data: table } = useGetLeagueTable();
  const { data: enquiries } = useListEnquiries({ limit: 50 });
  const { data: unreadEnquiries } = useListEnquiries({ status: "unread" });
  const gaRow = table?.find(r => r.isGoldenArrows);
  const unreadCount = unreadEnquiries?.length ?? 0;

  const CARDS = [
    { label: "News Articles", value: news?.length ?? 0, icon: Newspaper, href: "/admin/news", color: "text-blue-400 bg-blue-400/10" },
    { label: "Players", value: players?.length ?? 0, icon: Users, href: "/admin/squad", color: "text-green-400 bg-green-400/10" },
    { label: "Gallery Items", value: gallery?.length ?? 0, icon: Image, href: "/admin/gallery", color: "text-purple-400 bg-purple-400/10" },
    { label: "League Position", value: gaRow ? `#${gaRow.position}` : "–", icon: Trophy, href: "/league-table", color: "text-primary bg-primary/10" },
    {
      label: "Enquiries",
      value: unreadCount > 0 ? `${unreadCount} new` : (enquiries?.length ?? 0),
      icon: MessageSquare,
      href: "/admin/enquiries",
      color: unreadCount > 0 ? "text-primary bg-primary/20" : "text-white/60 bg-white/5",
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl uppercase tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of Lamontville Golden Arrows FC website.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {CARDS.map(card => (
          <Link key={card.label} href={card.href} className="block">
            <div className="bg-card border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-colors">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div className="font-display font-black text-3xl mb-1">{card.value}</div>
              <div className="text-muted-foreground text-sm uppercase tracking-wider">{card.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Season Stats */}
      {stats && (
        <div className="bg-card border border-white/5 rounded-xl p-6 mb-6">
          <h2 className="font-display font-bold text-lg uppercase tracking-tight mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Season Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Played", value: stats.played },
              { label: "Won", value: stats.won },
              { label: "Goals Scored", value: stats.goalsScored },
              { label: "Points", value: stats.points },
            ].map(s => (
              <div key={s.label} className="text-center bg-background rounded-lg p-4 border border-white/5">
                <div className="font-display font-black text-2xl text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent News */}
        <div className="bg-card border border-white/5 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg uppercase tracking-tight">Recent News</h2>
            <Link href="/admin/news" className="text-xs text-primary font-bold uppercase tracking-wider hover:underline">Manage &rarr;</Link>
          </div>
          <div className="space-y-3">
            {news?.map(article => (
              <div key={article.id} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{article.title}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(article.publishedAt), "MMM d, yyyy")} &bull; {article.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-card border border-white/5 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg uppercase tracking-tight flex items-center gap-2">
              Recent Enquiries
              {unreadCount > 0 && (
                <span className="text-xs bg-primary text-black font-bold px-2 py-0.5 rounded-full">{unreadCount} new</span>
              )}
            </h2>
            <Link href="/admin/enquiries" className="text-xs text-primary font-bold uppercase tracking-wider hover:underline">View All &rarr;</Link>
          </div>
          <div className="space-y-3">
            {enquiries?.slice(0, 5).map(enq => (
              <div key={enq.id} className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
                <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${enq.status === "unread" ? "bg-primary" : "bg-white/20"}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${enq.status === "unread" ? "font-bold text-white" : "text-white/70"}`}>
                    {enq.firstName} {enq.lastName} — {enq.subject}
                  </p>
                  <p className="text-xs text-muted-foreground">{format(new Date(enq.createdAt), "MMM d, yyyy · HH:mm")}</p>
                </div>
              </div>
            ))}
            {(!enquiries || enquiries.length === 0) && (
              <p className="text-sm text-muted-foreground py-4 text-center">No enquiries yet.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
