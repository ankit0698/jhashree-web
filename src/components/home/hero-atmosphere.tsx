"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { heroAtmosphereImages } from "@/components/home/content";

const FADE_MS = 8000;

export default function HeroAtmosphere() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    function syncMotionPreference() {
      setReduceMotion(media.matches);
    }

    syncMotionPreference();
    media.addEventListener("change", syncMotionPreference);

    return () => media.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    if (reduceMotion || heroAtmosphereImages.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroAtmosphereImages.length);
    }, FADE_MS);

    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
      aria-hidden="true"
    >
      {heroAtmosphereImages.map((item, index) => {
        const isActive = reduceMotion ? index === 0 : index === activeIndex;

        return (
          <div
            key={item.src}
            className={`absolute inset-0 transition-opacity duration-[1800ms] ease-in-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={item.src}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="select-none object-cover object-center"
            />
          </div>
        );
      })}

      {/* Cinematic readability wash */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--hero-overlay)" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(0,0,0,0.08),rgba(0,0,0,0.58)_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--hero-background)] to-transparent" />
    </div>
  );
}
