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
 * Interactive expanding flex-pill Services gallery matching the horizontal
 * strip accordion pattern while using Hero's sky-mist palette and Studio
 * Cave's architectural photography.
 *
 * One panel stays expanded wide while the remaining 3 collapse into sleek
 * vertical photo strips. Clicking any collapsed strip switches the active
 * panel smoothly; clicking "Explore More" reveals its sub-services inline
 * with live image preview on hover.
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
            Select a discipline to expand its full scope—bridging architecture,
            interiors, construction, and turnkey execution.
          </p>
        </div>

        {/* Horizontal expanding gallery on md+, vertical expanding pills on mobile */}
        <div className="flex w-full flex-col gap-3.5 md:min-h-[580px] md:flex-row md:items-stretch md:gap-4 lg:min-h-[640px]">
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
                className={`group relative overflow-hidden rounded-[26px] border border-[#171815]/12 bg-[#b6d0e6] transition-[flex,width,height,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:rounded-[34px] ${
                    isActive
                      ? "min-h-[430px] flex-1 shadow-[0_28px_64px_-24px_rgba(23,24,21,0.3)] md:min-h-[580px] md:min-w-0 md:flex-[1_1_auto] lg:min-h-[640px]"
                      : "h-[82px] w-full cursor-pointer shadow-[0_12px_32px_-20px_rgba(23,24,21,0.22)] hover:shadow-[0_18px_40px_-18px_rgba(23,24,21,0.28)] md:h-auto md:min-h-[580px] md:w-[74px] md:flex-[0_0_74px] lg:min-h-[640px] lg:w-[92px] lg:flex-[0_0_92px]"
                }`}
              >
                {/* Full-bleed architectural photograph inside pill container */}
                <Image
                  src={displayImage}
                  alt={displayAlt}
                  fill
                  sizes={
                    isActive
                      ? "(min-width: 1024px) 72vw, 96vw"
                      : "(min-width: 1024px) 10vw, 96vw"
                  }
                  className={`object-cover transition-transform duration-700 ease-out ${
                    isActive
                      ? "scale-100"
                      : "scale-[1.06] brightness-95 group-hover:scale-[1.1] group-hover:brightness-100"
                  }`}
                />

                {/* Smooth dark scrim for legibility of bottom icon, title & description */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                    isActive
                      ? isSubOpen
                        ? "bg-gradient-to-t from-[#171815]/92 via-[#171815]/68 to-[#171815]/12"
                        : "bg-gradient-to-t from-[#171815]/84 via-[#171815]/30 to-transparent"
                      : "bg-gradient-to-t from-[#171815]/70 via-[#171815]/15 to-transparent"
                  }`}
                />

                {/* COLLAPSED STRIP TRIGGER OVERLAY (only interactive when collapsed) */}
                {!isActive && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectCard(idx, service.slug);
                    }}
                    aria-label={`Select ${service.title}`}
                    className="relative z-10 flex h-full w-full cursor-pointer items-center gap-3.5 px-5 md:flex-col md:justify-end md:px-0 md:pb-6"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5f3ee] text-[#171815] shadow-md transition-transform duration-300 group-hover:scale-105">
                      <IconComponent size={18} strokeWidth={1.75} />
                    </span>
                    <span className="text-sm font-semibold uppercase tracking-[0.06em] text-[#f5f3ee] md:hidden">
                      {service.title}
                    </span>
                  </button>
                )}

                {/* ACTIVE EXPANDED CARD CONTENT */}
                {isActive && (
                  <div className="relative z-10 flex h-full w-full flex-col justify-end p-5 sm:p-7 lg:p-9">
                    <div className="w-full">
                      {/* Header bar: Circular Hero badge + Title/Description + Explore More/Show Less */}
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex items-start gap-4">
                          <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5f3ee] text-[#171815] shadow-md sm:h-12 sm:w-12">
                            <IconComponent size={20} strokeWidth={1.75} />
                          </span>

                          <div className="min-w-0 max-w-2xl">
                            <h3 className="text-xl font-semibold uppercase tracking-[-0.02em] text-[#f5f3ee] sm:text-2xl lg:text-[1.75rem]">
                              {service.title}
                            </h3>
                            <p
                              className={`mt-1.5 text-sm leading-[1.6] text-[#f5f3ee]/85 sm:text-[15px] ${
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
                          className="shrink-0 cursor-pointer self-start border border-[#f5f3ee]/45 bg-[#f5f3ee]/14 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f5f3ee] backdrop-blur-md transition-all duration-300 hover:border-[#f5f3ee] hover:bg-[#f5f3ee] hover:text-[#171815] lg:self-end"
                        >
                          {isSubOpen ? "Show Less" : "Explore More"}
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
                        <div className="mt-5 border-t border-[#f5f3ee]/18 pt-5">
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
                                    className={`flex h-full w-full cursor-pointer items-start gap-2.5 rounded-2xl border p-3.5 text-left transition-all duration-300 ${
                                      isHovered
                                        ? "border-[#e2c99b]/70 bg-[#171815]/75 text-[#f5f3ee]"
                                        : "border-[#f5f3ee]/16 bg-[#171815]/48 text-[#f5f3ee]/90 backdrop-blur-sm hover:border-[#e2c99b]/50 hover:bg-[#171815]/68"
                                    }`}
                                  >
                                    <span
                                      aria-hidden="true"
                                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 ${
                                        isHovered
                                          ? "bg-[#e2c99b]"
                                          : "bg-[#e2c99b]/65"
                                      }`}
                                    />
                                    <span className="min-w-0 flex-1">
                                      <span className="block text-[11.5px] font-semibold tracking-[0.04em] text-[#f5f3ee] leading-[1.35]">
                                        {sub.title}
                                      </span>
                                      <span className="mt-1 block text-[11.5px] font-normal leading-[1.48] text-[#f5f3ee]/78">
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
