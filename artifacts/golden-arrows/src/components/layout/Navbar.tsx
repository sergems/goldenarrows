import { Link } from "wouter";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          {/* Logo Placeholder */}
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center font-display font-bold text-black text-xl">
            GA
          </div>
          <span className="font-display font-bold text-xl uppercase tracking-wider hidden md:inline-block">
            Golden Arrows
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/news">News</NavLink>
          <NavLink href="/squad">Squad</NavLink>
          <NavLink href="/fixtures">Fixtures</NavLink>
          <NavLink href="/results">Results</NavLink>
          <NavLink href="/league-table">Table</NavLink>
          <NavLink href="/gallery">Gallery</NavLink>
          <NavLink href="/tickets">Tickets</NavLink>
          <NavLink href="/shop">Shop</NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/tickets" className="hidden md:flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-bold text-black transition-colors hover:bg-primary/90 uppercase tracking-widest">
            Tickets
          </Link>
          <button className="md:hidden p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      {/* Gold accent line */}
      <div className="h-1 w-full bg-primary" />
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
      {children}
    </Link>
  );
}
