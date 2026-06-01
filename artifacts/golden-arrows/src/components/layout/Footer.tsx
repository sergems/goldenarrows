import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-card border-t border-white/10 pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center font-display font-bold text-black text-xl">
                GA
              </div>
              <span className="font-display font-bold text-2xl uppercase tracking-wider">
                Lamontville Golden Arrows
              </span>
            </div>
            <p className="text-muted-foreground max-w-sm mb-6">
              Abafana Bes'thende. The pride of KwaZulu-Natal. Competing in the DStv Premiership with passion, spirit, and electric football.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={<Facebook className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Twitter className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Instagram className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Youtube className="h-5 w-5" />} />
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-lg mb-6 uppercase tracking-wider text-primary">Quick Links</h4>
            <ul className="space-y-3">
              <li><FooterLink href="/news">Latest News</FooterLink></li>
              <li><FooterLink href="/fixtures">Fixtures & Tickets</FooterLink></li>
              <li><FooterLink href="/squad">First Team</FooterLink></li>
              <li><FooterLink href="/league-table">League Table</FooterLink></li>
              <li><FooterLink href="/contact">Contact Us</FooterLink></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-lg mb-6 uppercase tracking-wider text-primary">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">Subscribe for the latest club news and exclusive offers.</p>
            <form className="flex flex-col gap-3">
              <Input type="email" placeholder="Your email address" className="bg-background border-white/10" />
              <Button className="w-full font-bold uppercase tracking-wider">Subscribe</Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Lamontville Golden Arrows FC. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a href={href} className="h-10 w-10 rounded-full bg-background border border-white/10 flex items-center justify-center text-foreground hover:bg-primary hover:text-black hover:border-primary transition-colors">
      {icon}
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-muted-foreground hover:text-primary transition-colors">
      {children}
    </Link>
  );
}
