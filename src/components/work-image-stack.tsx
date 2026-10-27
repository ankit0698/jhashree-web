import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type { UploadedImageMedia } from "@/types/work";

type WorkImageStackProps = {
  images: UploadedImageMedia[];
  title: string;
  compact?: boolean;
};

type Direction = -1 | 1;

const SWIPE_DISTANCE = 42;
const ROTATION_DURATION = 280;

function getCardStyle(
  position: number,
  imageCount: number,
  exitDirection: Direction | 0,
  compact: boolean,
): CSSProperties {
  const offset = compact ? 4 : 8;

  if (position === 0) {
    return {
      zIndex: imageCount + 3,
      opacity: exitDirection === 0 ? 1 : 0,
      transform:
        exitDirection === 0
          ? "translate3d(0, 0, 0) rotate(0deg) scale(1)"
          : `translate3d(${exitDirection === 1 ? "-112%" : "112%"}, 2%, 0) rotate(${exitDirection === 1 ? "-9deg" : "9deg"}) scale(.96)`,
    };
  }

  if (position === 1) {
    return {
      zIndex: imageCount + 2,
      opacity: 0.9,
      transform: `translate3d(${offset}px, ${offset}px, 0) rotate(2.25deg) scale(.975)`,
    };
  }

  if (position === 2) {
    return {
      zIndex: imageCount + 1,
      opacity: 0.62,
      transform: `translate3d(${-offset}px, ${offset * 1.5}px, 0) rotate(-2.75deg) scale(.95)`,
    };
  }

  return {
    zIndex: 0,
    opacity: 0,
    transform: "translate3d(0, 5%, 0) rotate(0deg) scale(.92)",
    pointerEvents: "none",
  };
}

export default function WorkImageStack({
  images,
  title,
  compact = false,
}: WorkImageStackProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<Direction | 0>(0);
  const pointerStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);
  const rotationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (rotationTimer.current) {
        clearTimeout(rotationTimer.current);
      }
    };
  }, []);

  function rotate(direction: Direction) {
    if (exitDirection !== 0 || images.length < 2) {
      return;
    }

    setExitDirection(direction);
    rotationTimer.current = setTimeout(() => {
      setActiveIndex(
        (currentIndex) =>
          (currentIndex + direction + images.length) % images.length,
      );
      setExitDirection(0);
      rotationTimer.current = null;
    }, ROTATION_DURATION);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!event.isPrimary) return;

    const target = event.target as HTMLElement;

    if (target.closest("[data-carousel-control]")) {
      return;
    }

    pointerStartX.current = event.clientX;
    didSwipe.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (pointerStartX.current === null || !event.isPrimary) return;

    const distance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;

    if (Math.abs(distance) >= SWIPE_DISTANCE) {
      didSwipe.current = true;
      rotate(distance < 0 ? 1 : -1);
    }
  }

  function handleImageClick() {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }

    rotate(1);
  }

  return (
    <div
      className="absolute inset-0 touch-pan-y select-none overflow-hidden bg-black"
      role="region"
      aria-roledescription="image carousel"
      aria-label={`${title} image gallery`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        pointerStartX.current = null;
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          rotate(-1);
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          rotate(1);
        }
      }}
    >
      {images.map((image, index) => {
        const position =
          (index - activeIndex + images.length) % images.length;
        const isActive = position === 0;
        const cardClassName = `${
          compact ? "inset-2" : "inset-3 md:inset-4"
        } absolute overflow-hidden rounded-xl bg-[#111] shadow-[0_14px_35px_rgba(0,0,0,0.5)] transition-[transform,opacity] duration-300 ease-out`;
        const cardStyle = getCardStyle(
          position,
          images.length,
          isActive ? exitDirection : 0,
          compact,
        );
        const imageElement = (
          <Image
            src={image.url}
            alt={isActive ? `${title}, image ${index + 1} of ${images.length}` : ""}
            fill
            draggable={false}
            sizes={compact ? "240px" : "(max-width: 767px) 100vw, 50vw"}
            className="object-cover"
          />
        );

        if (isActive) {
          return (
            <button
              key={image.storagePath}
              type="button"
              style={cardStyle}
              onClick={handleImageClick}
              className={`${cardClassName} cursor-grab active:cursor-grabbing`}
              aria-label={`Showing image ${index + 1} of ${images.length}. Show next image.`}
            >
              {imageElement}
            </button>
          );
        }

        return (
          <div
            key={image.storagePath}
            style={cardStyle}
            className={cardClassName}
            aria-hidden="true"
          >
            {imageElement}
          </div>
        );
      })}

      <button
        type="button"
        data-carousel-control
        onClick={(event) => {
          event.stopPropagation();
          rotate(-1);
        }}
        aria-label="Show previous image"
        className={`${
          compact ? "left-3 h-7 w-7 text-sm" : "left-4 h-10 w-10 md:left-5"
        } absolute top-1/2 z-30 grid -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/25 bg-black/65 text-white shadow-lg backdrop-blur-sm transition hover:border-[var(--accent)] hover:bg-[var(--accent)]`}
      >
        ←
      </button>

      <button
        type="button"
        data-carousel-control
        onClick={(event) => {
          event.stopPropagation();
          rotate(1);
        }}
        aria-label="Show next image"
        className={`${
          compact ? "right-3 h-7 w-7 text-sm" : "right-4 h-10 w-10 md:right-5"
        } absolute top-1/2 z-30 grid -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/25 bg-black/65 text-white shadow-lg backdrop-blur-sm transition hover:border-[var(--accent)] hover:bg-[var(--accent)]`}
      >
        →
      </button>

      <div
        className={`${
          compact ? "bottom-2 gap-1" : "bottom-4 gap-1.5"
        } pointer-events-none absolute inset-x-0 z-30 flex justify-center`}
        aria-hidden="true"
      >
        {images.map((image, index) => (
          <span
            key={image.storagePath}
            className={`h-1.5 rounded-full shadow transition-all duration-300 ${
              index === activeIndex
                ? "w-5 bg-[var(--accent)]"
                : "w-1.5 bg-white/55"
            }`}
          />
        ))}
      </div>

      <span className="sr-only" aria-live="polite">
        Image {activeIndex + 1} of {images.length}
      </span>
    </div>
  );
}
