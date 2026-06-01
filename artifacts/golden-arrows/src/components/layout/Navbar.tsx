import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, Ticket } from "lucide-react";
import logo from "@assets/Lamontville_Golden_Arrows_logo_1780312879951.svg";

const NAV_LINKS = [
  { href: "/news", label: "News" },
  { href: "/squad", label: "Squad" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/results", label: "Results" },
  { href: "/league-table", label: "Table" },
  { href: "/gallery", label: "Gallery" },
  { href: "/club", label: "Club" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b border-white/5">
      <div className="container mx-auto flex h-18 items-center justify-between px-4 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="Lamontville Golden Arrows FC"
            className="h-14 w-auto"
          />
          <div className="hidden lg:block">
            <div className="font-display font-bold text-sm uppercase tracking-widest text-foreground leading-tight">
              Lamontville
            </div>
            <div className="font-display font-bold text-lg uppercase tracking-wider text-primary leading-tight">
              Golden Arrows
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => {
            const active = location === link.href || (link.href !== "/" && location.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider rounded transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/tickets"
            className="hidden md:flex items-center gap-2 h-10 px-5 bg-primary text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-primary/90 transition-colors"
          >
            <Ticket className="h-4 w-4" />
            Tickets
          </Link>
          <button
            className="md:hidden p-2 rounded text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Gold accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-secondary via-primary to-secondary" />

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur border-b border-white/5 shadow-xl z-50">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 text-sm font-bold uppercase tracking-wider rounded transition-colors ${
                  location === link.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/tickets"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 h-11 px-5 bg-primary text-black text-sm font-bold uppercase tracking-widest rounded hover:bg-primary/90 transition-colors"
            >
              <Ticket className="h-4 w-4" />
              Buy Tickets
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
