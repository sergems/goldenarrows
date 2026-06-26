import { useGetAd } from "@workspace/api-client-react";
import { ImageOff } from "lucide-react";

interface AdBannerProps {
  slot: string;
  className?: string;
}

export function AdBanner({ slot, className = "" }: AdBannerProps) {
  const { data: ad } = useGetAd(slot);

  const hasImage = !!ad?.imageUrl;

  const inner = hasImage ? (
    <img
      src={ad!.imageUrl!}
      alt={ad!.altText ?? "Advertisement"}
      className="w-full h-full object-cover rounded-xl"
    />
  ) : (
    <div className="w-full h-full min-h-[300px] rounded-xl border border-dashed border-white/10 bg-white/2 flex flex-col items-center justify-center gap-2 text-muted-foreground/40 select-none">
      <ImageOff className="h-6 w-6" />
      <span className="text-[10px] uppercase tracking-widest font-bold">Advertisement</span>
    </div>
  );

  return (
    <div className={`sticky top-24 ${className}`}>
      {hasImage && ad?.linkUrl ? (
        <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer sponsored" className="block">
          {inner}
        </a>
      ) : (
        inner
      )}
      {hasImage && (
        <p className="text-[9px] text-muted-foreground/30 text-center mt-1 uppercase tracking-widest">
          Advert
        </p>
      )}
    </div>
  );
}
