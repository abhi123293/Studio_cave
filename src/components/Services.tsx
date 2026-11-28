"use client";

import { useState } from "react";
import Image from "next/image";
import { Armchair, Building2, Compass, KeyRound } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/data/services";

const SERVICE_ICONS = {
  architecture: Compass,
  "interior-design": Armchair,
  "project-construction": Building2,
  "turnkey-solutions": KeyRound,
} as const;

/**
 * Luxury sharp-rectangular expanding gallery showcase styled in Hero's
 * sky-mist, warm limestone, apricot horizon, and deep charcoal palette.
 *
 * One active architectural discipline expands horizontally across crisp
 * square edges with 4K photography, frosted obsidian icon framing, muted
 * champagne-gold hairlines, and an inline Explore More / Show Less drawer,
 * while inactive panels rest as vertical labeled gallery slices.
 */
export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedSubSlug, setExpandedSubSlug] = useState<string | null>(null);
  const [previewSubIdx, setPreviewSubIdx] = useState<number | null>(null);

  const selectCard = (idx: number, slug: string) => {
    setActiveIndex(idx);
    setPreviewSubIdx(null);
    if (expandedSubSlug && expandedSubSlug !== slug) {
      setExpandedSubSlug(null);
    }
  };

  const toggleSubServices = (slug: string) => {
    setPreviewSubIdx(null);
    setExpandedSubSlug((prev) => (prev === slug ? null : slug));
  };

  return (
    <section
      id="services"
      className="relative z-40 w-full text-[#171815]"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 6% 95%, rgba(255,176,130,0.42) 0%, rgba(255,200,165,0.2) 45%, transparent 80%), linear-gradient(180deg, #f1ded0 0%, #dbe4ee 24%, #b6d0e6 68%, #dbe4ee 100%)",
      }}
    >
      <div className="w-full px-4 py-20 sm:px-8 md:px-12 md:py-24 lg:px-16 lg:pb-36 lg:pt-28">
        {/* Editorial monograph section header */}
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-[#171815]/14 pb-8 md:mb-12 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 pb-4">
              <span aria-hidden="true" className="h-px w-8 bg-[#171815]/45" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#3a4a52]">
                OUR SERVICES
              </p>
            </div>

            <h2 className="text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#171815] sm:text-4xl md:text-5xl lg:text-[3.35rem]">
              Spaces Designed With Purpose.
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-[1.7] text-[#2c3940] md:text-right">
            Select a discipline to explore its full architectural scope across
            design, interiors, structural build, and turnkey delivery.
          </p>
        </div>

        {/* Sharp rectangular expanding gallery on md+, vertical strips on mobile */}
        <div className="flex w-full flex-col gap-3 md:min-h-[600px] md:flex-row md:items-stretch md:gap-3.5 lg:min-h-[660px]">
          {SERVICE_CATEGORIES.map((service, idx) => {
            const isActive = activeIndex === idx;
            const isSubOpen = isActive && expandedSubSlug === service.slug;
            const IconComponent =
              SERVICE_ICONS[service.slug as keyof typeof SERVICE_ICONS] ??
              Compass;

            const activeSub =
              isSubOpen && previewSubIdx !== null
                ? service.subServices[previewSubIdx]
                : null;
            const displayImage = activeSub ? activeSub.image : service.image;
            const displayAlt = activeSub ? activeSub.imageAlt : service.imageAlt;

            return (
              <article
                key={service.slug}
                id={`service-${service.slug}`}
                onClick={() => {
                  if (!isActive) selectCard(idx, service.slug);
                }}
                onMouseLeave={() => {
                  if (isSubOpen) setPreviewSubIdx(null);
                }}
                className={`group relative overflow-hidden rounded-none border transition-[flex,width,height,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive
                  ? "min-h-[450px] flex-1 border-[#171815]/22 bg-[#b6d0e6] shadow-[0_32px_72px_-28px_rgba(23,24,21,0.34)] md:min-h-[600px] md:min-w-0 md:flex-[1_1_auto] lg:min-h-[660px]"
                  : "h-[84px] w-full cursor-pointer border-[#171815]/16 bg-[#b6d0e6] shadow-[0_14px_34px_-22px_rgba(23,24,21,0.22)] hover:border-[#947b52]/65 hover:shadow-[0_22px_48px_-20px_rgba(23,24,21,0.3)] md:h-auto md:min-h-[600px] md:w-[78px] md:flex-[0_0_78px] lg:min-h-[660px] lg:w-[96px] lg:flex-[0_0_96px]"
                  }`}
              >
                {/* Full-bleed 4K architectural photograph inside sharp rectangular frame */}
                <Image
                  src={displayImage}
                  alt={displayAlt}
                  fill
                  priority={isActive}
                  unoptimized
                  sizes="100vw"
                  className={`object-cover transition-all duration-700 ease-out ${isActive
                    ? "scale-100 saturate-[0.96]"
                    : "scale-[1.04] saturate-[0.82] brightness-[0.92] group-hover:scale-[1.08] group-hover:saturate-100 group-hover:brightness-100"
                    }`}
                />

                {/* Whisper-thin inner perimeter architectural highlight */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-[5] border border-white/15"
                />

                {/* Smooth editorial vignette preserving bright top 4K clarity */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${isActive
                    ? isSubOpen
                      ? "bg-gradient-to-t from-[#171815]/92 via-[#171815]/68 to-[#171815]/18"
                      : "bg-[linear-gradient(180deg,rgba(23,24,21,0.28)_0%,rgba(23,24,21,0.02)_26%,rgba(23,24,21,0.18)_58%,rgba(23,24,21,0.86)_100%)]"
                    : "bg-gradient-to-t from-[#171815]/82 via-[#171815]/28 to-[#171815]/14"
                    }`}
                />

                {/* COLLAPSED GALLERY SLICE OVERLAY (vertical discipline title + frosted square emblem) */}
                {!isActive && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectCard(idx, service.slug);
                    }}
                    aria-label={`Select ${service.title}`}
                    className="relative z-10 flex h-full w-full cursor-pointer items-center justify-between px-5 md:flex-col md:justify-end md:gap-5 md:px-0 md:pb-7"
                  >
                    <span className="hidden items-center gap-3 md:flex md:flex-col">
                      <span className="[writing-mode:vertical-rl] rotate-180 text-xs font-semibold uppercase tracking-[0.24em] text-[#f5f3ee]/88 transition-colors duration-300 group-hover:text-[#e2c99b] lg:text-[13px]">
                        {service.title}
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-5 w-px bg-[#e2c99b]/60 transition-all duration-300 group-hover:h-8 group-hover:bg-[#e2c99b]"
                      />
                    </span>

                    <div className="flex items-center gap-3.5 md:justify-center">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none border border-[#f5f3ee]/35 bg-[#171815]/48 text-[#e2c99b] backdrop-blur-md transition-all duration-300 group-hover:border-[#e2c99b] group-hover:bg-[#171815]/75 group-hover:text-[#f5f3ee]">
                        <IconComponent size={18} strokeWidth={1.65} />
                      </span>
                      <span className="text-base font-semibold uppercase tracking-[0.08em] text-[#f5f3ee] md:hidden">
                        {service.title}
                      </span>
                    </div>
                  </button>
                )}

                {/* ACTIVE EXPANDED MONOGRAPH CONTENT */}
                {isActive && (
                  <div className="relative z-10 flex h-full w-full flex-col justify-between p-5 sm:p-7 lg:p-10">
                    {/* Subtle top-left discipline category hairline */}
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="h-px w-8 bg-[#e2c99b]/85"
                      />
                      <span className="text-[10.5px] font-semibold uppercase tracking-[0.26em] text-[#f5f3ee]/88">
                        {service.introLabel}
                      </span>
                    </div>

                    <div className="w-full pt-8">
                      {/* Header bar: Frosted Obsidian Emblem + Title/Description + Explore More/Show Less */}
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex items-start gap-4 sm:gap-5">
                          <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-none border border-[#e2c99b]/45 bg-[#171815]/58 text-[#e2c99b] backdrop-blur-md sm:h-12 sm:w-12">
                            <IconComponent size={20} strokeWidth={1.65} />
                          </span>

                          <div className="min-w-0 max-w-2xl">
                            <h3 className="text-3xl font-semibold uppercase leading-[1.02] tracking-[-0.03em] text-[#f5f3ee] sm:text-4xl lg:text-[2.75rem] xl:text-[3.15rem]">
                              {service.title}
                            </h3>
                            <p
                              className={`mt-2.5 text-sm leading-[1.64] text-[#f5f3ee]/86 sm:text-[15px] ${
                                isSubOpen ? "" : "line-clamp-2"
                              }`}
                            >
                              {service.description}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSubServices(service.slug);
                          }}
                          aria-expanded={isSubOpen}
                          aria-controls={`subservices-${service.slug}`}
                          className={`group/btn relative shrink-0 cursor-pointer self-start overflow-hidden rounded-none border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] backdrop-blur-md transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:self-end ${isSubOpen
                            ? "border-[#e2c99b] bg-[#f5f3ee] text-[#171815] hover:bg-[#e2c99b]"
                            : "border-[#f5f3ee]/45 bg-[#171815]/32 text-[#f5f3ee] hover:border-[#f5f3ee] hover:text-[#171815]"
                            }`}
                        >
                          {!isSubOpen && (
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-[#f5f3ee] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:scale-y-100"
                            />
                          )}
                          <span className="relative z-10">
                            {isSubOpen ? "Show Less" : "Explore More"}
                          </span>
                        </button>
                      </div>

                      {/* Inline Sub-Services Drawer */}
                      <div
                        id={`subservices-${service.slug}`}
                        inert={!isSubOpen}
                        aria-hidden={!isSubOpen}
                        style={{
                          maxHeight: isSubOpen ? "960px" : "0px",
                          opacity: isSubOpen ? 1 : 0,
                          transition:
                            "max-height 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 380ms ease-out",
                        }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 border-t border-[#f5f3ee]/18 pt-5">
                          <p className="mb-3.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#e2c99b]">
                            Included Disciplines
                          </p>

                          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                            {service.subServices.map((sub, subIdx) => {
                              const isHovered =
                                isSubOpen && previewSubIdx === subIdx;

                              return (
                                <li key={sub.title}>
                                  <button
                                    type="button"
                                    onMouseEnter={() => setPreviewSubIdx(subIdx)}
                                    onFocus={() => setPreviewSubIdx(subIdx)}
                                    className={`flex h-full w-full cursor-pointer items-start gap-3 rounded-none border p-3.5 text-left transition-all duration-300 ${isHovered
                                      ? "border-[#e2c99b]/75 bg-[#171815]/84 text-[#f5f3ee]"
                                      : "border-[#f5f3ee]/16 bg-[#171815]/58 text-[#f5f3ee]/92 backdrop-blur-md hover:border-[#e2c99b]/55 hover:bg-[#171815]/76"
                                      }`}
                                  >
                                    <span
                                      aria-hidden="true"
                                      className={`mt-2 h-1.5 w-1.5 shrink-0 rotate-45 transition-colors duration-300 ${
                                        isHovered
                                          ? "bg-[#e2c99b]"
                                          : "bg-[#e2c99b]/65"
                                      }`}
                                    />
                                    <span className="min-w-0 flex-1">
                                      <span className="block text-sm font-semibold tracking-[0.02em] text-[#f5f3ee] leading-[1.3] sm:text-[15px] lg:text-base">
                                        {sub.title}
                                      </span>
                                      <span className="mt-1.5 block text-[11.5px] font-normal leading-[1.52] text-[#f5f3ee]/78">
                                        {sub.description}
                                      </span>
                                    </span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
