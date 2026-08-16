import Image from "next/image";

import WorkImageStack from "@/components/work-image-stack";
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

  if (media.source === "instagram") {
    return (
      <a
        href={media.url}
        target="_blank"
        rel="noreferrer"
        className={`${className} group grid place-items-center bg-[linear-gradient(135deg,#35152b,#9d294f_55%,#e17638)] p-5 text-center text-white`}
      >
        <span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="mx-auto h-8 w-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
          <span className="mt-2 block text-xs font-bold uppercase tracking-[0.16em]">
            Instagram media
          </span>
          <span className="mt-1 block text-[0.7rem] text-white/75 group-hover:underline">
            Open post ↗
          </span>
        </span>
      </a>
    );
  }

  if (media.type === "image-collection") {
    return (
      <div className={className}>
        <WorkImageStack
          images={media.images}
          title={title}
          compact={compact}
        />
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
