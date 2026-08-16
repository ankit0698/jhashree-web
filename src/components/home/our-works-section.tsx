import Image from "next/image";
import { useEffect, useState } from "react";

import WorkImageStack from "@/components/work-image-stack";
import { getPublishedWorks } from "@/lib/works/public";
import type { Work, WorkMedia } from "@/types/work";

function YouTubePreview({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
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
      className="group absolute inset-0 cursor-pointer"
      aria-label={`Play ${title}`}
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        fill
        sizes="(max-width: 767px) 100vw, 50vw"
        className="object-cover transition duration-700 group-hover:scale-105"
      />

      {/* VIDEO OVERLAY */}
      <span className="absolute inset-0 bg-black/15 transition duration-500 group-hover:bg-black/30" />

      <PlayButton />
    </button>
  );
}

function InstagramPreview({ url, title }: { url: string; title: string }) {
  return (
    <iframe
      src={`${url}embed/`}
      title={`${title} on Instagram`}
      className="absolute inset-0 h-full w-full bg-white"
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
    />
  );
}

function PlayButton() {
  return (
    <span
      className="
        absolute left-1/2 top-1/2
        grid h-14 w-14
        -translate-x-1/2 -translate-y-1/2
        place-items-center
        rounded-full
        border border-white/50
        bg-black/55
        text-white
        shadow-xl
        backdrop-blur-sm
        transition duration-300
        group-hover:scale-110
        group-hover:border-[var(--rust)]
        group-hover:bg-[var(--rust)]
        md:h-16 md:w-16
      "
    >
      <span
        className="
          ml-1
          h-0 w-0
          border-b-[7px]
          border-l-[11px]
          border-t-[7px]
          border-b-transparent
          border-l-current
          border-t-transparent
          md:border-b-[8px]
          md:border-l-[13px]
          md:border-t-[8px]
        "
      />
    </span>
  );
}

function WorkMediaPreview({
  media,
  title,
}: {
  media: WorkMedia;
  title: string;
}) {
  if (media.source === "youtube") {
    return <YouTubePreview videoId={media.videoId} title={title} />;
  }

  if (media.source === "instagram") {
    return <InstagramPreview url={media.url} title={title} />;
  }

  if (media.type === "image-collection") {
    return <WorkImageStack images={media.images} title={title} />;
  }

  if (media.type === "image") {
    return (
      <Image
        src={media.url}
        alt={title}
        fill
        sizes="(max-width: 767px) 100vw, 50vw"
        className="object-cover transition duration-700 group-hover:scale-105"
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
  const instagramUrl =
    work.media.source === "instagram" ? work.media.url : work.instagramUrl;

  return (
    <article className="group min-w-0">
      {/* MEDIA */}
      <div
        className="
          relative
          overflow-hidden
          rounded-[1.1rem]
          border border-white/[0.11]
          bg-[#141414]
          shadow-[0_22px_60px_rgba(0,0,0,0.35)]
          transition
          duration-500
          group-hover:-translate-y-1
          group-hover:border-white/[0.22]
        "
      >
        <div
          className={`relative overflow-hidden ${
            work.media.source === "instagram"
              ? "aspect-[4/5]"
              : "aspect-[16/9]"
          }`}
        >
          <WorkMediaPreview media={work.media} title={work.title} />

          {/* SUBTLE CINEMATIC GRADIENT */}
          <span
            className="
              pointer-events-none
              absolute inset-x-0 bottom-0
              h-28
              bg-gradient-to-t
              from-black/55
              via-black/10
              to-transparent
            "
          />

          {/* LABEL ON IMAGE */}
          {work.label ? (
            <span
              className="
                pointer-events-none
                absolute
                left-4 top-4
                z-40
                rounded-full
                border border-white/15
                bg-black/45
                px-3 py-1.5
                text-[0.52rem]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-white/85
                backdrop-blur-md
                md:left-5 md:top-5
              "
            >
              {work.label}
            </span>
          ) : null}
        </div>
      </div>

      {/* DETAILS */}
      <div className="px-1 pt-5">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            {/* TITLE */}
            <h3
              className="
                font-serif
                text-[1.65rem]
                leading-[1.08]
                tracking-[-0.015em]
                text-white
                md:text-[2rem]
              "
            >
              {work.title}
            </h3>

            {/* DESCRIPTION */}
            {work.description ? (
              <p
                className="
                  mt-3
                  max-w-[34rem]
                  text-sm
                  leading-6
                  text-white/55
                  md:text-[0.94rem]
                  md:leading-7
                "
              >
                {work.description}
              </p>
            ) : null}
          </div>

          {/* INSTAGRAM LINK */}
          {instagramUrl ? (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${work.title} on Instagram`}
              className="
                mt-1
                grid h-9 w-9
                shrink-0
                place-items-center
                rounded-full
                border border-white/15
                cursor-pointer
                text-[var(--accent-soft)]
                transition
                duration-300
                hover:border-[var(--accent)]
                hover:bg-[var(--accent)]
                hover:text-black
              "
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
          ) : null}
        </div>

        {/* DECORATIVE CARD LINE */}
        <div
          className="
            mt-5
            h-px w-full
            bg-gradient-to-r
            from-[var(--accent)]/50
            via-white/[0.08]
            to-transparent
          "
        />
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
        if (isActive) {
          setWorks(publishedWorks);
        }
      })
      .catch(() => {
        if (isActive) {
          setError("Our latest work could not be loaded right now.");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section
      id="works"
      className="
        relative
        scroll-mt-24
        overflow-hidden
        bg-black
        py-14
        text-white
        md:py-20
      "
    >
      {/* TOP DIVIDER */}
      <div
        className="
          pointer-events-none
          absolute inset-x-0 top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/10
          to-transparent
        "
      />

      {/* SOFT BACKGROUND GLOW */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2 top-[22rem]
          h-[38rem] w-[70rem]
          max-w-full
          -translate-x-1/2
          rounded-full
          bg-[var(--rust)]/[0.035]
          blur-[140px]
        "
      />

      {/* DESKTOP BIRD */}
      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-44
          z-[1]
          hidden
          h-[34rem] w-[34rem]
          rotate-[320deg]
          md:block
          md:h-[39rem]
          md:w-[39rem]
        "
      >
        <Image
          src="/assets/madhubani-paintings/bird.webp"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="39rem"
          className="select-none object-contain opacity-40"
        />
      </div>

      {/* LEFT BOTTOM DECORATION */}
      <div
        className="
          pointer-events-none
          absolute
          -bottom-60
          -left-60
          hidden
          h-[38rem] w-[38rem]
          rotate-[18deg]
          opacity-[0.05]
          md:block
        "
      >
        <Image
          src="/assets/madhubani-paintings/bird.webp"
          alt=""
          aria-hidden="true"
          fill
          sizes="38rem"
          className="select-none object-contain"
        />
      </div>

      {/* CONTENT */}
      <div
        className="
          site-gutter
          relative z-10
          mx-auto
          max-w-[90rem]
        "
      >
        {/* HEADING */}
        <div className="mx-auto max-w-[53rem] text-center">
          <p
            className="
              text-[0.6rem]
              font-extrabold
              uppercase
              tracking-[0.34em]
              text-[var(--orange)]
              md:text-[0.64rem]
            "
          >
            Our Work
          </p>

          <h2
            className="
              mt-3
              font-serif
              text-[2.7rem]
              leading-[0.94]
              tracking-[-0.035em]
              text-white
              md:text-[4.25rem]
            "
          >
            Crafting Visual Stories
            <span className="block">That Connect</span>
          </h2>

          {/* ORNAMENT */}
          <div
            className="
              mx-auto mt-6
              flex w-24
              items-center
              gap-2.5
              text-[var(--accent)]
            "
          >
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-current" />

            <span className="h-1.5 w-1.5 rotate-45 border border-current" />

            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-current" />
          </div>
        </div>

        {/* LOADING */}
        {isLoading ? (
          <div
            className="
              mt-12
              grid
              grid-cols-1
              gap-x-7
              gap-y-12
              md:grid-cols-2
              md:gap-x-8
            "
            role="status"
          >
            {[0, 1, 2, 3].map((item) => (
              <div key={item}>
                <div className="aspect-video animate-pulse rounded-[1.1rem] bg-white/[0.07]" />

                <div className="mt-5 h-6 w-2/3 animate-pulse rounded bg-white/[0.07]" />

                <div className="mt-3 h-3 w-full animate-pulse rounded bg-white/[0.05]" />

                <div className="mt-2 h-3 w-3/4 animate-pulse rounded bg-white/[0.05]" />
              </div>
            ))}

            <span className="sr-only">Loading works</span>
          </div>
        ) : error ? (
          /* ERROR */
          <p
            className="
              mx-auto mt-12
              max-w-2xl
              rounded-xl
              border border-white/10
              bg-white/[0.04]
              p-7
              text-center
              text-sm
              text-white/60
            "
          >
            {error}
          </p>
        ) : works.length === 0 ? (
          /* EMPTY */
          <p
            className="
              mx-auto mt-12
              max-w-2xl
              rounded-xl
              border border-dashed border-white/15
              bg-white/[0.04]
              p-9
              text-center
              font-serif
              text-2xl
              text-white/60
            "
          >
            New visual stories will be added here soon.
          </p>
        ) : (
          /* WORK GRID */
          <div
            className="
              mt-12
              grid
              grid-cols-1
              gap-x-7
              gap-y-12
              md:grid-cols-2
              md:gap-x-8
              md:gap-y-14
            "
          >
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        )}

        {/* VIEW ALL */}
        {works.length > 0 ? (
          <div className="mt-12 flex justify-center md:mt-16">
            <a
              href="#catalogue"
              className="
                group
                inline-flex
                items-center
                gap-4
                border-b
                border-[var(--accent)]/60
                pb-2
                text-[0.64rem]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-[var(--accent-soft)]
                transition
                duration-300
                hover:border-white/70
                hover:text-white
              "
            >
              View All Projects
              <span
                aria-hidden="true"
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1.5
                "
              >
                →
              </span>
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
