import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="min-h-screen">
      <div className="bg-card py-20 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display font-bold text-5xl uppercase tracking-tight mb-4">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get in touch with Lamontville Golden Arrows FC.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-6">Send a <span className="text-primary">Message</span></h2>
            {sent ? (
              <div className="bg-secondary/20 border border-secondary/30 rounded-xl p-8 text-center">
                <div className="font-display font-bold text-2xl text-primary mb-2">Thank You!</div>
                <p className="text-muted-foreground">Your message has been received. We will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">First Name</label>
                    <Input placeholder="John" required />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Last Name</label>
                    <Input placeholder="Doe" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Email Address</label>
                  <Input type="email" placeholder="john@example.com" required />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Subject</label>
                  <Input placeholder="General Enquiry" required />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Message</label>
                  <Textarea placeholder="Your message..." rows={5} required />
                </div>
                <Button type="submit" className="w-full font-bold uppercase tracking-wider">
                  Send Message
                </Button>
              </form>
            )}
          </motion.div>

          {/* Club Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-6">Club <span className="text-primary">Information</span></h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold mb-1">Headquarters</div>
                  <div className="text-muted-foreground text-sm">Princess Magogo Stadium<br />KwaMashu, Durban<br />KwaZulu-Natal, 4051<br />South Africa</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold mb-1">Telephone</div>
                  <div className="text-muted-foreground text-sm">+27 31 000 0000</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold mb-1">Email</div>
                  <div className="text-muted-foreground text-sm">info@goldenarrowsfc.co.za</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg mb-4 text-primary uppercase tracking-wider">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
                  { icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
                  { icon: <Twitter className="h-5 w-5" />, label: "X/Twitter" },
                  { icon: <Youtube className="h-5 w-5" />, label: "YouTube" },
                ].map(social => (
                  <a
                    key={social.label}
                    href="#"
                    title={social.label}
                    className="h-12 w-12 rounded-xl bg-card border border-white/10 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-black hover:border-primary transition-colors"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-xl overflow-hidden bg-card border border-white/5 aspect-video flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-10 w-10 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Princess Magogo Stadium<br />KwaMashu, Durban</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
