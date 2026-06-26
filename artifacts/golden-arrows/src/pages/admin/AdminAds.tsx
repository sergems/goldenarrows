import { useState, useRef } from "react";
import { AdminLayout } from "./AdminLayout";
import { useListAds, useUpdateAd, getListAdsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Upload, X, ExternalLink, ImageOff, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SLOT_LABELS: Record<string, { page: string; side: string }> = {
  "fixtures-left":  { page: "Fixtures",      side: "Left"  },
  "fixtures-right": { page: "Fixtures",      side: "Right" },
  "results-left":   { page: "Results",       side: "Left"  },
  "results-right":  { page: "Results",       side: "Right" },
  "table-left":     { page: "League Table",  side: "Left"  },
  "table-right":    { page: "League Table",  side: "Right" },
};

const SLOT_ORDER = Object.keys(SLOT_LABELS);

function AdCard({ slot, imageUrl, linkUrl, altText }: {
  slot: string; imageUrl?: string | null; linkUrl?: string | null; altText?: string | null;
}) {
  const qc = useQueryClient();
  const updateAd = useUpdateAd();
  const fileRef = useRef<HTMLInputElement>(null);

  const [localLink, setLocalLink] = useState(linkUrl ?? "");
  const [localAlt, setLocalAlt] = useState(altText ?? "");
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  const label = SLOT_LABELS[slot] ?? { page: slot, side: "" };

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setSaved(false);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const { url } = await res.json() as { url: string };
      await updateAd.mutateAsync({ slot, data: { imageUrl: url, linkUrl: localLink || null, altText: localAlt || null } });
      qc.invalidateQueries({ queryKey: getListAdsQueryKey() });
      setSaved(true);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSaveLink() {
    setSaved(false);
    await updateAd.mutateAsync({ slot, data: { imageUrl: imageUrl ?? null, linkUrl: localLink || null, altText: localAlt || null } });
    qc.invalidateQueries({ queryKey: getListAdsQueryKey() });
    setSaved(true);
  }

  async function handleClear() {
    setSaved(false);
    await updateAd.mutateAsync({ slot, data: { imageUrl: null, linkUrl: null, altText: null } });
    qc.invalidateQueries({ queryKey: getListAdsQueryKey() });
    setLocalLink("");
    setLocalAlt("");
    setSaved(true);
  }

  return (
    <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between gap-3">
        <div>
          <div className="font-display font-bold text-sm uppercase tracking-tight">{label.page}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{label.side} sidebar</div>
        </div>
        {saved && (
          <span className="flex items-center gap-1 text-xs text-green-400 font-bold">
            <CheckCircle className="h-3 w-3" /> Saved
          </span>
        )}
      </div>

      {/* Image preview */}
      <div className="p-5">
        <div className="relative w-full aspect-[160/300] rounded-lg overflow-hidden bg-background border border-white/5 mb-4">
          {imageUrl ? (
            <>
              <img src={imageUrl} alt={altText ?? slot} className="w-full h-full object-cover" />
              <button
                onClick={handleClear}
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/70 flex items-center justify-center hover:bg-red-500/80 transition-colors"
                title="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
              <ImageOff className="h-8 w-8" />
              <span className="text-xs uppercase tracking-widest">No image</span>
            </div>
          )}
        </div>

        {/* Upload button */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          variant="outline"
          size="sm"
          className="w-full mb-3"
        >
          {uploading ? (
            <span className="flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…</span>
          ) : (
            <span className="flex items-center gap-2"><Upload className="h-3.5 w-3.5" /> {imageUrl ? "Replace Image" : "Upload Image"}</span>
          )}
        </Button>

        {/* Link URL */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
            Destination URL <span className="font-normal normal-case">(optional)</span>
          </label>
          <div className="flex gap-2">
            <Input
              value={localLink}
              onChange={e => { setLocalLink(e.target.value); setSaved(false); }}
              placeholder="https://sponsor.com"
              className="bg-background border-white/10 text-sm h-8"
            />
            {localLink && (
              <a href={localLink} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 h-8 w-8 rounded border border-white/10 flex items-center justify-center hover:border-primary/40 transition-colors">
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            )}
          </div>

          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
            Alt text <span className="font-normal normal-case">(optional)</span>
          </label>
          <Input
            value={localAlt}
            onChange={e => { setLocalAlt(e.target.value); setSaved(false); }}
            placeholder="e.g. Sponsor name"
            className="bg-background border-white/10 text-sm h-8"
          />

          <Button onClick={handleSaveLink} disabled={updateAd.isPending} size="sm" variant="outline" className="w-full">
            {updateAd.isPending ? (
              <span className="flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</span>
            ) : "Save Link & Alt Text"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminAds() {
  const { data: ads, isLoading } = useListAds();

  const sorted = SLOT_ORDER
    .map(slot => ads?.find(a => a.slot === slot))
    .filter(Boolean) as NonNullable<typeof ads>;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl uppercase tracking-tight">Ad Banners</h1>
        <p className="text-muted-foreground mt-1">
          Manage the 6 sidebar ad slots on the Fixtures, Results, and League Table pages.
          Ads appear on the left and right on wide screens.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-20">Loading ad slots…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map(ad => (
            <AdCard
              key={ad.slot}
              slot={ad.slot}
              imageUrl={ad.imageUrl}
              linkUrl={ad.linkUrl}
              altText={ad.altText}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
