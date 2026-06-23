import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Squad from "@/pages/Squad";
import PlayerProfile from "@/pages/PlayerProfile";
import Fixtures from "@/pages/Fixtures";
import Results from "@/pages/Results";
import ResultDetail from "@/pages/ResultDetail";
import LeagueTable from "@/pages/LeagueTable";
import News from "@/pages/News";
import NewsArticle from "@/pages/NewsArticle";
import Gallery from "@/pages/Gallery";
import TechnicalTeam from "@/pages/TechnicalTeam";
import Tickets from "@/pages/Tickets";
import Shop from "@/pages/Shop";
import Community from "@/pages/Community";
import Contact from "@/pages/Contact";
import Club from "@/pages/Club";
import ClubHistory from "@/pages/club/ClubHistory";
import ClubRecords from "@/pages/club/ClubRecords";
import ClubTrophy from "@/pages/club/ClubTrophy";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminNews from "@/pages/admin/AdminNews";
import AdminSquad from "@/pages/admin/AdminSquad";
import AdminGallery from "@/pages/admin/AdminGallery";
import AdminEnquiries from "@/pages/admin/AdminEnquiries";
import AdminSlides from "@/pages/admin/AdminSlides";
import AdminFixtures from "@/pages/admin/AdminFixtures";
import AdminLeagueTable from "@/pages/admin/AdminLeagueTable";
import AdminSocialPosts from "@/pages/admin/AdminSocialPosts";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function PublicLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <PublicLayout><Home /></PublicLayout>
      </Route>
      <Route path="/squad">
        <PublicLayout><Squad /></PublicLayout>
      </Route>
      <Route path="/squad/:id">
        <PublicLayout><PlayerProfile /></PublicLayout>
      </Route>
      <Route path="/fixtures">
        <PublicLayout><Fixtures /></PublicLayout>
      </Route>
      <Route path="/results">
        <PublicLayout><Results /></PublicLayout>
      </Route>
      <Route path="/results/:id">
        <PublicLayout><ResultDetail /></PublicLayout>
      </Route>
      <Route path="/league-table">
        <PublicLayout><LeagueTable /></PublicLayout>
      </Route>
      <Route path="/news">
        <PublicLayout><News /></PublicLayout>
      </Route>
      <Route path="/news/:id">
        <PublicLayout><NewsArticle /></PublicLayout>
      </Route>
      <Route path="/gallery">
        <PublicLayout><Gallery /></PublicLayout>
      </Route>
      <Route path="/technical-team">
        <PublicLayout><TechnicalTeam /></PublicLayout>
      </Route>
      <Route path="/tickets">
        <PublicLayout><Tickets /></PublicLayout>
      </Route>
      <Route path="/shop">
        <PublicLayout><Shop /></PublicLayout>
      </Route>
      <Route path="/community">
        <PublicLayout><Community /></PublicLayout>
      </Route>
      <Route path="/contact">
        <PublicLayout><Contact /></PublicLayout>
      </Route>
      <Route path="/club">
        <PublicLayout><Club /></PublicLayout>
      </Route>
      <Route path="/club/history">
        <PublicLayout><ClubHistory /></PublicLayout>
      </Route>
      <Route path="/club/records">
        <PublicLayout><ClubRecords /></PublicLayout>
      </Route>
      <Route path="/club/trophy">
        <PublicLayout><ClubTrophy /></PublicLayout>
      </Route>

      {/* Admin — no auth wrapper for now */}
      <Route path="/admin">
        <AdminDashboard />
      </Route>
      <Route path="/admin/news">
        <AdminNews />
      </Route>
      <Route path="/admin/squad">
        <AdminSquad />
      </Route>
      <Route path="/admin/gallery">
        <AdminGallery />
      </Route>
      <Route path="/admin/slides">
        <AdminSlides />
      </Route>
      <Route path="/admin/enquiries">
        <AdminEnquiries />
      </Route>
      <Route path="/admin/fixtures">
        <AdminFixtures />
      </Route>
      <Route path="/admin/league-table">
        <AdminLeagueTable />
      </Route>
      <Route path="/admin/social-posts">
        <AdminSocialPosts />
      </Route>

      <Route>
        <PublicLayout><NotFound /></PublicLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
