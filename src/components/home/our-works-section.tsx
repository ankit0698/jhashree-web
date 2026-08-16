import Image from "next/image";
import { useEffect, useState } from "react";

import SectionHeading from "@/components/home/section-heading";
import { getPublishedWorks } from "@/lib/works/public";
import type { Work, WorkMedia } from "@/types/work";

function YouTubePreview({ videoId, title }: { videoId: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={`${title} YouTube video`}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsPlaying(true)}
      className="group absolute inset-0"
      aria-label={`Play ${title}`}
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        fill
        sizes="(max-width: 1280px) 100vw, 50vw"
        className="object-cover transition duration-500 group-hover:scale-[1.02]"
      />
      <span className="absolute inset-0 bg-black/20 transition group-hover:bg-black/30" />
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-xl transition group-hover:scale-105">
        <span className="ml-1 h-0 w-0 border-b-[10px] border-l-[16px] border-t-[10px] border-b-transparent border-l-[var(--foreground-contrast)] border-t-transparent" />
      </span>
    </button>
  );
}

function WorkMediaPreview({ media, title }: { media: WorkMedia; title: string }) {
  if (media.source === "youtube") {
    return <YouTubePreview videoId={media.videoId} title={title} />;
  }

  if (media.type === "image") {
    return (
      <Image
        src={media.url}
        alt={title}
        fill
        sizes="(max-width: 1280px) 100vw, 50vw"
        className="object-cover"
      />
    );
  }

  return (
    <video
      src={media.url}
      className="absolute inset-0 h-full w-full object-cover"
      controls
      preload="metadata"
      playsInline
    >
      Your browser does not support this video.
    </video>
  );
}

function WorkCard({ work }: { work: Work }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,250,242,0.96),rgba(250,241,223,0.94))] shadow-[var(--shadow-soft)]">
      <div className="relative aspect-video overflow-hidden bg-[var(--hero-background)]">
        <WorkMediaPreview media={work.media} title={work.title} />
        <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold tracking-[0.2em] text-white uppercase ring-1 ring-white/15 backdrop-blur sm:left-6 sm:top-6 sm:px-4 sm:py-2">
          {work.label}
        </div>
      </div>

      <div className="px-5 pb-5 pt-5 sm:px-8 sm:pb-8 sm:pt-6">
        <h3 className="font-serif text-3xl text-[var(--foreground)]">
          {work.title}
        </h3>
        <p className="mt-3 text-base leading-8 text-[var(--muted)]">
          {work.description}
        </p>
        {work.instagramUrl ? (
          <a
            href={work.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm font-bold text-[var(--accent-deep)] transition hover:border-[var(--accent)]"
          >
            View on Instagram ↗
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default function OurWorksSection() {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    getPublishedWorks()
      .then((publishedWorks) => {
        if (isActive) setWorks(publishedWorks);
      })
      .catch(() => {
        if (isActive) {
          setError("Our latest work could not be loaded right now.");
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section
      id="works"
      className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <SectionHeading
        eyebrow="Our Works"
        title="Crafted with Care, Delivered with Impact."
        description=""
      />

      {isLoading ? (
        <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 xl:grid-cols-2" role="status">
          {[0, 1].map((item) => (
            <div
              key={item}
              className="aspect-[4/3] animate-pulse rounded-[2rem] bg-[var(--surface-soft)]"
            />
          ))}
          <span className="sr-only">Loading works</span>
        </div>
      ) : error ? (
        <p className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-[var(--muted)]">
          {error}
        </p>
      ) : works.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--surface)] p-8 text-center text-[var(--muted)]">
          New projects will be added here soon.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 xl:grid-cols-2">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      )}
    </section>
  );
}
