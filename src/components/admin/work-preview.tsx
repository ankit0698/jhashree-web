import Image from "next/image";

import type { WorkMedia } from "@/types/work";

type WorkPreviewProps = {
  media: WorkMedia;
  title: string;
  compact?: boolean;
};

export default function WorkPreview({
  media,
  title,
  compact = false,
}: WorkPreviewProps) {
  const className = compact
    ? "relative aspect-video overflow-hidden rounded-xl bg-[var(--hero-background)]"
    : "relative aspect-video overflow-hidden bg-[var(--hero-background)]";

  if (media.source === "youtube") {
    return (
      <div className={className}>
        <Image
          src={`https://i.ytimg.com/vi/${media.videoId}/hqdefault.jpg`}
          alt={`${title} video thumbnail`}
          fill
          sizes={compact ? "240px" : "(max-width: 1280px) 100vw, 50vw"}
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-[0.65rem] font-bold tracking-wider text-white uppercase shadow">
          YouTube
        </span>
      </div>
    );
  }

  if (media.type === "image") {
    return (
      <div className={className}>
        <Image
          src={media.url}
          alt={title}
          fill
          sizes={compact ? "240px" : "(max-width: 1280px) 100vw, 50vw"}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <video
        src={media.url}
        className="h-full w-full object-cover"
        preload="metadata"
        muted
        playsInline
      />
      <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[0.65rem] font-bold tracking-wider text-white uppercase backdrop-blur">
        Uploaded video
      </span>
    </div>
  );
}
