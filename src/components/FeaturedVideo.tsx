"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { preconnect } from "react-dom";
import Image from "next/image";
import { Film, Loader2, Maximize2, Play } from "lucide-react";
import {
  FEATURED_VIDEO,
  extractYouTubeVideoId,
  getYouTubePosterCandidates,
} from "@/data/featuredVideo";

/**
 * Architectural screening showcase directly following the Services section.
 *
 * Uses a click-to-load YouTube facade (`www.youtube.com/embed/...`) paired
 * with proximity & pointer `preconnect` warming so zero third-party video
 * streams load or auto-play with sound on initial visit, while clicking Play
 * starts playback rapidly with full native controls and fullscreen support.
 */
export default function FeaturedVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const warmedRef = useRef(false);

  const videoId = useMemo(
    () => extractYouTubeVideoId(FEATURED_VIDEO.youtubeUrl),
    []
  );

  const posterCandidates = useMemo(
    () =>
      getYouTubePosterCandidates(
        videoId,
        FEATURED_VIDEO.customPosterSrc,
        FEATURED_VIDEO.fallbackPosterSrc
      ),
    [videoId]
  );

  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [posterIdx, setPosterIdx] = useState(0);

  const activePosterSrc =
    posterCandidates[posterIdx] ?? FEATURED_VIDEO.fallbackPosterSrc;

  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&fs=1&rel=0&playsinline=1`
    : null;

  const warmYouTubeConnections = useCallback(() => {
    if (warmedRef.current) return;
    warmedRef.current = true;
    preconnect("https://www.youtube.com");
    preconnect("https://s.ytimg.com");
    preconnect("https://i.ytimg.com");
    preconnect("https://www.google.com");
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          warmYouTubeConnections();
          observer.disconnect();
        }
      },
      { rootMargin: "700px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [warmYouTubeConnections]);

  const advancePoster = () => {
    setPosterIdx((prev) =>
      prev + 1 < posterCandidates.length ? prev + 1 : prev
    );
  };

  return (
    <section
      ref={sectionRef}
      id="featured-film"
      aria-label="Featured Architectural Film"
      onMouseEnter={warmYouTubeConnections}
      onTouchStart={warmYouTubeConnections}
      className="relative z-40 w-full bg-transparent text-[#171815]"
    >
      <div className="w-full px-4 pb-20 pt-10 sm:px-8 md:px-12 md:pb-28 md:pt-12 lg:px-16 lg:pb-36 lg:pt-14">
        {/* Editorial monograph header matching Hero & Services light palette */}
        <div className="mb-10 border-b border-[#171815]/14 pb-8 md:mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 pb-4">
              <span aria-hidden="true" className="h-px w-8 bg-[#171815]/45" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#3a4a52]">
                {FEATURED_VIDEO.eyebrow}
              </p>
            </div>

            <h2 className="text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#171815] sm:text-4xl md:text-5xl lg:text-[3.35rem]">
              {FEATURED_VIDEO.title}
            </h2>
          </div>
        </div>

        {/* Sharp architectural obsidian cinema housing framed over sky-limestone canvas */}
        <div className="relative rounded-none border border-[#171815]/24 bg-[#171815] p-2 shadow-[0_36px_84px_-28px_rgba(23,24,21,0.34)] sm:p-3 lg:p-4">
          {/* Subtle top-left & bottom-right champagne corner accents */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-px -top-px h-5 w-5 border-l-2 border-t-2 border-[#e2c99b]/80"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-px -right-px h-5 w-5 border-b-2 border-r-2 border-[#e2c99b]/80"
          />

          <div className="relative aspect-video w-full overflow-hidden rounded-none bg-[#11120f]">
            {isLoaded && embedUrl && (
              <iframe
                src={embedUrl}
                title={FEATURED_VIDEO.title}
                onLoad={() => setIsPlayerReady(true)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="h-full w-full border-0"
              />
            )}

            {/* Interactive preview facade stays mounted cleanly until iframe loads */}
            {(!isLoaded || !isPlayerReady) && (
              <button
                type="button"
                onClick={() => {
                  if (!embedUrl) return;
                  warmYouTubeConnections();
                  setIsLoaded(true);
                }}
                onFocus={warmYouTubeConnections}
                disabled={!embedUrl}
                aria-label={`Play embedded video: ${FEATURED_VIDEO.title}`}
                className={`group absolute inset-0 z-10 block h-full w-full cursor-pointer text-left transition-opacity duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e2c99b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171815] disabled:cursor-not-allowed ${isLoaded && isPlayerReady ? "pointer-events-none opacity-0" : "opacity-100"
                  }`}
              >
                <Image
                  src={activePosterSrc}
                  alt={FEATURED_VIDEO.title}
                  fill
                  unoptimized
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 1344px"
                  onLoad={(e) => {
                    if (
                      e.currentTarget.naturalWidth > 0 &&
                      e.currentTarget.naturalWidth <= 120
                    ) {
                      advancePoster();
                    }
                  }}
                  onError={advancePoster}
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] group-hover:saturate-[1.04]"
                />

                {/* Editorial vignette for crisp text & play button hierarchy */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,24,21,0.42)_0%,rgba(23,24,21,0.16)_38%,rgba(23,24,21,0.38)_68%,rgba(23,24,21,0.88)_100%)] transition-opacity duration-500 group-hover:opacity-90"
                />

                {/* Top bar inside poster preview */}
                <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 sm:p-6 lg:p-8">
                  <span className="inline-flex items-center gap-2.5 rounded-none border border-[#e2c99b]/40 bg-[#171815]/70 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f5f3ee] backdrop-blur-md">
                    <Film size={13} className="text-[#e2c99b]" />
                    {FEATURED_VIDEO.filmLabel}
                  </span>

                  <span className="hidden items-center gap-2 rounded-none border border-[#f5f3ee]/20 bg-[#171815]/60 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#f5f3ee]/85 backdrop-blur-md sm:inline-flex">
                    <Maximize2 size={12} className="text-[#e2c99b]" />
                    16:9 HD · In-Page Player
                  </span>
                </div>

                {/* Centered Play Plaque (transitions smoothly to spinner right after click) */}
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-none border border-[#e2c99b]/65 bg-[#171815]/72 text-[#f5f3ee] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.85)] backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:border-[#e2c99b] group-hover:bg-[#e2c99b] group-hover:text-[#171815] sm:h-20 sm:w-20 lg:h-24 lg:w-24">
                    {isLoaded ? (
                      <Loader2
                        size={28}
                        strokeWidth={1.75}
                        className="animate-spin text-[#e2c99b] group-hover:text-[#171815]"
                      />
                    ) : (
                      <Play
                        size={26}
                        strokeWidth={1.6}
                        className="ml-0.5 fill-current transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </span>
                </div>

                {/* Bottom architectural caption & play cue */}
                <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-end sm:p-6 lg:p-8">
                  <div>
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-[#e2c99b]">
                      {isLoaded ? "Loading Player" : "Click To Load Video"}
                    </p>
                    <p className="mt-1 text-base font-medium tracking-[-0.01em] text-[#f5f3ee] sm:text-lg lg:text-xl">
                      Studio Cave — Design, Craftsmanship & Architecture
                    </p>
                  </div>

                  <span className="inline-flex w-fit items-center gap-2.5 rounded-none border border-[#f5f3ee]/35 bg-[#171815]/55 px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#f5f3ee] backdrop-blur-md transition-colors duration-300 group-hover:border-[#e2c99b] group-hover:bg-[#f5f3ee] group-hover:text-[#171815]">
                    {isLoaded ? "Connecting..." : "Play Film"}
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
