import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useGetNextFixture } from "@workspace/api-client-react";
import logo from "@assets/Lamontville_Golden_Arrows_logo_1780312879951.svg";

const THE_CLUB_LINKS = [
  { href: "/club/history", label: "History" },
  { href: "/club/records", label: "Records" },
  { href: "/club/trophy", label: "Trophy Cabinet" },
];

const NAV_LINKS = [
  { href: "/news", label: "News" },
  { href: "/squad", label: "Squad" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/results", label: "Results" },
  { href: "/league-table", label: "Table" },
  { href: "/gallery", label: "Gallery" },
  { href: "https://goldenarrowsfc.co.za/", label: "Shop", external: true },
];

function isSameDay(dateStr: string) {
  const today = new Date();
  const d = new Date(dateStr);
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

function isMatchLive(dateStr: string, timeStr?: string | null) {
  const now = new Date();
  const kickoff = new Date(`${dateStr}T${timeStr || "15:00:00"}`);
  const elapsed = (now.getTime() - kickoff.getTime()) / (1000 * 60);
  return elapsed >= 0 && elapsed <= 105;
}

function ClubDropdown({ location, onNavigate }: { location: string; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = location.startsWith("/club");

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-1 px-4 py-2 text-sm font-bold uppercase tracking-wider rounded transition-colors ${
          isActive ? "text-primary" : "text-white/70 hover:text-white hover:bg-white/5"
        }`}
      >
        The Club
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          {THE_CLUB_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => { setOpen(false); onNavigate?.(); }}
              className={`block px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                location === link.href
                  ? "text-primary bg-primary/10"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileClubOpen, setMobileClubOpen] = useState(false);
  const [location] = useLocation();
  const { data: nextFixture } = useGetNextFixture();

  const matchToday = nextFixture ? isSameDay(nextFixture.date) : false;
  const live = matchToday && nextFixture
    ? isMatchLive(nextFixture.date, nextFixture.time)
    : false;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b border-white/5">
      <div className="container mx-auto flex h-18 items-center justify-center px-4 gap-8 relative">

        {/* Logo + Club name */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="Lamontville Golden Arrows FC"
            className="h-14 w-auto"
          />
          <div className="hidden lg:block">
            <div className="font-display text-sm uppercase tracking-widest text-foreground/80 leading-tight">
              Lamontville
            </div>
            <div className="font-display text-lg uppercase tracking-wider text-primary leading-tight">
              Golden Arrows
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <ClubDropdown location={location} />
          {NAV_LINKS.map(link => {
            const active = !link.external && (location === link.href || (link.href !== "/" && location.startsWith(link.href)));
            return link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-bold uppercase tracking-wider rounded transition-colors text-white/70 hover:text-white hover:bg-white/5"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider rounded transition-colors ${
                  active ? "text-primary" : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Match day / Live badge */}
        {matchToday && (
          <Link
            href="/"
            className={`hidden md:flex items-center gap-2 absolute right-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              live ? "bg-red-600 text-white" : "bg-primary text-black"
            }`}
          >
            {live ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                Live
              </>
            ) : (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-50" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-black" />
                </span>
                Match Day
              </>
            )}
          </Link>
        )}

        {/* Mobile hamburger */}
        <button
          className="md:hidden absolute right-4 p-2 rounded text-white/70 hover:text-white transition-colors"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Accent line */}
      <div
        className={`h-0.5 w-full ${
          live ? "bg-red-500" : matchToday ? "bg-primary" : "bg-gradient-to-r from-secondary via-primary to-secondary"
        }`}
      />

      {/* Mobile match-day strip */}
      {matchToday && (
        <div className={`md:hidden text-center py-1 text-xs font-bold uppercase tracking-widest ${live ? "bg-red-600 text-white" : "bg-primary text-black"}`}>
          {live ? "● Match Live Now" : "● Match Day — Today"}
        </div>
      )}

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur border-b border-white/5 shadow-xl z-50">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {/* Mobile "The Club" accordion */}
            <button
              onClick={() => setMobileClubOpen(v => !v)}
              className={`flex items-center justify-between px-4 py-3 text-sm font-bold uppercase tracking-wider rounded transition-colors w-full ${
                location.startsWith("/club") ? "text-primary bg-primary/10" : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              The Club
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mobileClubOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileClubOpen && (
              <div className="pl-4 flex flex-col gap-1">
                {THE_CLUB_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => { setOpen(false); setMobileClubOpen(false); }}
                    className={`px-4 py-3 text-sm font-bold uppercase tracking-wider rounded transition-colors ${
                      location === link.href ? "text-primary bg-primary/10" : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {NAV_LINKS.map(link =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-sm font-bold uppercase tracking-wider rounded transition-colors text-white/70 hover:text-white hover:bg-white/5"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 text-sm font-bold uppercase tracking-wider rounded transition-colors ${
                    location === link.href ? "text-primary bg-primary/10" : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
