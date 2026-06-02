import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";
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

        {/* Desktop Nav — sits right next to the logo */}
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
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger — absolute right so it doesn't push the centered group */}
        <button
          className="md:hidden absolute right-4 p-2 rounded text-white/70 hover:text-white transition-colors"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Gold–green accent line */}
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
                  location === link.href ? "text-primary bg-primary/10" : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
