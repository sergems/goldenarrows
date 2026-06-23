import { useState, useEffect } from "react";
import { useListGallery } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Instagram, Facebook } from "lucide-react";

declare global {
  interface Window {
    FB?: { XFBML?: { parse: () => void } };
  }
}

type SocialPost = { id: number; platform: "facebook" | "instagram"; post_url: string; display_order: number };

const CATEGORIES = ["All", "matches", "training", "community", "events"];

export default function Gallery() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [type, setType] = useState<"photo" | "video" | undefined>(undefined);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);

  useEffect(() => {
    fetch("/api/social-posts").then(r => r.json()).then(setSocialPosts).catch(() => {});
  }, []);

  useEffect(() => {
    if (window.FB?.XFBML) {
      window.FB.XFBML.parse();
    }
  }, [socialPosts]);

  const { data: items, isLoading } = useListGallery({
    category: category || undefined,
    type: type || undefined,
    limit: 50,
  });

  return (
    <div className="min-h-screen">
      <div className="bg-card py-20 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display font-bold text-5xl uppercase tracking-tight mb-4">
            Media <span className="text-primary">Gallery</span>
          </h1>
          <p className="text-muted-foreground">Photos and videos from matches, training, and community events.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Type Toggle */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {(["All", "photo", "video"] as const).map(t => (
            <button
              key={t}
              onClick={() => setType(t === "All" ? undefined : t)}
              className={`px-6 py-2 rounded font-bold uppercase tracking-wider text-sm transition-colors ${
                (t === "All" && !type) || t === type
                  ? "bg-primary text-black"
                  : "bg-card border border-white/10 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "All" ? "All Media" : t === "photo" ? "Photos" : "Videos"}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap justify-center mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat === "All" ? undefined : cat)}
              className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                (cat === "All" && !category) || cat === category
                  ? "bg-secondary text-white"
                  : "bg-card border border-white/10 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading && <div className="text-center text-muted-foreground py-20">Loading gallery...</div>}

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items?.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-card"
              onClick={() => item.type === "photo" ? setLightbox(item.url) : window.open(item.url, "_blank")}
            >
              <img
                src={item.thumbnailUrl || item.url}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {item.type === "video" ? (
                  <Play className="h-10 w-10 text-white" />
                ) : (
                  <div className="h-10 w-10 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="h-5 w-5 rounded-sm border-2 border-white" />
                  </div>
                )}
              </div>
              <div className="absolute top-2 right-2">
                {item.type === "video" && (
                  <span className="bg-primary text-black text-xs font-bold px-2 py-0.5 rounded">VIDEO</span>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-bold truncate">{item.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {!isLoading && (!items || items.length === 0) && (
          <div className="text-center text-muted-foreground py-20">No media available in this category.</div>
        )}
      </div>

      {/* ── From Our Social Media Family ─────────────── */}
      <section className="bg-card border-t border-white/5 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-4xl uppercase tracking-tight mb-3">
              From Our <span className="text-primary">Social Media Family</span>
            </h2>
            <p className="text-muted-foreground">Follow us and stay connected with Abafana Bes'thende</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Facebook Posts */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center flex-shrink-0">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Lamontville Golden Arrows</p>
                  <a href="https://www.facebook.com/LamontvilleGoldenArrows/" target="_blank" rel="noopener noreferrer"
                    className="text-[#1877F2] text-xs font-bold hover:underline">
                    @LamontvilleGoldenArrows
                  </a>
                </div>
              </div>
              {socialPosts.filter(p => p.platform === "facebook").length > 0 ? (
                <div className="space-y-4">
                  {socialPosts.filter(p => p.platform === "facebook").map(post => (
                    <div key={post.id} className="rounded-xl overflow-hidden border border-white/10 bg-white flex justify-center">
                      <div
                        className="fb-post"
                        data-href={post.post_url}
                        data-width="500"
                        data-show-text="true"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-background flex flex-col items-center justify-center text-center px-8 py-16 gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#1877F2]/10 flex items-center justify-center">
                    <Facebook className="w-8 h-8 text-[#1877F2]" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">Follow us on Facebook</p>
                    <p className="text-muted-foreground text-sm">Stay up to date with our latest news and updates.</p>
                  </div>
                  <a href="https://www.facebook.com/LamontvilleGoldenArrows/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1877F2] font-bold text-white text-sm hover:opacity-90 transition-opacity">
                    <Facebook className="w-4 h-4" /> Follow on Facebook
                  </a>
                </div>
              )}
            </div>

            {/* Instagram */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Golden Arrows FC</p>
                  <a href="https://www.instagram.com/goldenarrowsfc/" target="_blank" rel="noopener noreferrer"
                    className="text-[#e1306c] text-xs font-bold hover:underline">
                    @goldenarrowsfc
                  </a>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-background flex flex-col items-center justify-center text-center px-8 py-16 gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-0.5">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <Instagram className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div>
                  <p className="font-display font-bold text-2xl uppercase text-white mb-2">@goldenarrowsfc</p>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                    Follow us on Instagram for match-day moments, behind-the-scenes content, and player features.
                  </p>
                </div>
                <a href="https://www.instagram.com/goldenarrowsfc/" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white text-sm hover:opacity-90 transition-opacity"
                  style={{background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)"}}>
                  <Instagram className="w-4 h-4" /> Follow on Instagram
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white"
              onClick={() => setLightbox(null)}
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={lightbox}
              alt="Gallery"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
