"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Mobile-smooth editorial About Us section using native CSS `sticky top-0`
 * (eliminating async touch-scroll JS vertical jitter) and GPU-composited
 * `clip-path` + `transform` transitions (zero layout reflow during scroll).
 *
 * Overlapping Hero's final `100svh` cloud exit keeps zero blank gaps while
 * transitioning smoothly from the initial zoomed 3-image proportion to the
 * opened `#171815` / `#9da19e` central typography.
 */
export default function AboutStudioCave() {
  const stageRef = useRef<HTMLDivElement>(null);
  const stickyCanvasRef = useRef<HTMLDivElement>(null);

  const img1FrameRef = useRef<HTMLDivElement>(null);
  const img1ZoomRef = useRef<HTMLDivElement>(null);
  const img2FrameRef = useRef<HTMLDivElement>(null);
  const img2ZoomRef = useRef<HTMLDivElement>(null);
  const img3FrameRef = useRef<HTMLDivElement>(null);
  const img3ZoomRef = useRef<HTMLDivElement>(null);

  const clipRef = useRef<HTMLDivElement>(null);
  const textTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = stickyCanvasRef.current;
    const f1 = img1FrameRef.current;
    const z1 = img1ZoomRef.current;
    const f2 = img2FrameRef.current;
    const z2 = img2ZoomRef.current;
    const f3 = img3FrameRef.current;
    const z3 = img3ZoomRef.current;
    const clip = clipRef.current;
    const track = textTrackRef.current;

    if (
      !stage ||
      !canvas ||
      !f1 ||
      !z1 ||
      !f2 ||
      !z2 ||
      !f3 ||
      !z3 ||
      !clip ||
      !track
    ) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    let lastTime = 0;
    let currentP = 0;
    let targetP = 0;
    let lastAppliedP = -1;

    const getScrollProgress = () => {
      const rect = stage.getBoundingClientRect();
      // Fixed CSS 100svh canvas height avoids mobile browser address-bar jumps
      const viewH = canvas.offsetHeight || window.innerHeight;
      const scrollableDistance = Math.max(0, rect.height - viewH);

      // Gentle fade-in over Hero's finishing white clouds without vertical jitter
      const entryFade = clamp(1 - rect.top / (viewH * 0.2));
      canvas.style.opacity = entryFade.toFixed(3);
      canvas.style.pointerEvents = entryFade > 0.05 ? "auto" : "none";

      if (reducedMotion) {
        targetP = 1;
        return;
      }

      targetP =
        scrollableDistance > 0 ? clamp(-rect.top / scrollableDistance) : 0;
    };

    const applyScene = (stageP: number, force = false) => {
      if (!force && Math.abs(stageP - lastAppliedP) < 0.0002) {
        return;
      }
      lastAppliedP = stageP;

      const vw = canvas.clientWidth || window.innerWidth;
      const vh = canvas.offsetHeight || window.innerHeight;
      const t = reducedMotion ? 1 : easeOutCubic(clamp(stageP / 0.78));
      const zoomScale = lerp(1.02, 1, t).toFixed(4);

      if (vw >= 1024) {
        const leftEndW = Math.min(330, vw * 0.225);
        const rightTrim1 = Math.max(0, vw * 0.405 - leftEndW) * t;
        const bottomTrim1 = 0.045 * vh * t;

        const topTrim2 = 0.095 * vh * t;
        const liftY2 = -clamp(0.04 * vh, 24, 42) * t;

        const leftTrim3 = vw * (0.54 - 0.385) * t;
        const bottomTrim3 = clamp(0.04 * vh, 24, 42) * t;

        f1.style.clipPath = `inset(0px ${rightTrim1.toFixed(1)}px ${bottomTrim1.toFixed(1)}px 0px)`;
        f2.style.transform = `translate3d(0, ${liftY2.toFixed(1)}px, 0)`;
        f2.style.clipPath = `inset(${topTrim2.toFixed(1)}px ${rightTrim1.toFixed(1)}px 0px 0px)`;
        f3.style.clipPath = `inset(0px 0px ${bottomTrim3.toFixed(1)}px ${leftTrim3.toFixed(1)}px)`;
      } else if (vw >= 768) {
        const rightTrim1 = vw * (0.405 - 0.225) * t;
        const bottomTrim1 = 0.045 * vh * t;

        const topTrim2 = 0.095 * vh * t;
        const liftY2 = -28 * t;

        const leftTrim3 = vw * (0.535 - 0.385) * t;
        const bottomTrim3 = 28 * t;

        f1.style.clipPath = `inset(0px ${rightTrim1.toFixed(1)}px ${bottomTrim1.toFixed(1)}px 0px)`;
        f2.style.transform = `translate3d(0, ${liftY2.toFixed(1)}px, 0)`;
        f2.style.clipPath = `inset(${topTrim2.toFixed(1)}px ${rightTrim1.toFixed(1)}px 0px 0px)`;
        f3.style.clipPath = `inset(0px 0px ${bottomTrim3.toFixed(1)}px ${leftTrim3.toFixed(1)}px)`;
      } else {
        const mobileStartH1 = 0.22 * vh;
        const mobileStartH2 = 0.23 * vh;
        const mobileEndH = clamp(0.125 * vh, 74, 100);

        const rightTrim = vw * (0.44 - 0.36) * t;
        const bottomTrim1 = Math.max(0, mobileStartH1 - mobileEndH) * t;
        const topTrim2 = Math.max(0, mobileStartH2 - mobileEndH) * t;
        const liftY2 = -16 * t;

        const leftTrim3 = vw * (0.49 - 0.3) * t;
        const bottomTrim3 = 16 * t;

        f1.style.clipPath = `inset(0px ${rightTrim.toFixed(1)}px ${bottomTrim1.toFixed(1)}px 0px)`;
        f2.style.transform = `translate3d(0, ${liftY2.toFixed(1)}px, 0)`;
        f2.style.clipPath = `inset(${topTrim2.toFixed(1)}px ${rightTrim.toFixed(1)}px 0px 0px)`;
        f3.style.clipPath = `inset(0px 0px ${bottomTrim3.toFixed(1)}px ${leftTrim3.toFixed(1)}px)`;
      }

      z1.style.transform = `scale(${zoomScale})`;
      z2.style.transform = `scale(${zoomScale})`;
      z3.style.transform = `scale(${zoomScale})`;

      const textRevealT = reducedMotion ? 1 : easeOutCubic(clamp((t - 0.12) / 0.88));
      const maxOffsetX = clip.clientWidth + 24;
      const textX = lerp(maxOffsetX, 0, textRevealT);
      track.style.transform = `translate3d(${textX.toFixed(2)}px, 0, 0)`;
    };

    const animate = (now: number) => {
      getScrollProgress();

      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = now;

      const diff = targetP - currentP;
      const dampingSpeed = window.innerWidth < 768 ? 14 : 8.5;
      const factor = 1 - Math.exp(-dampingSpeed * dt);
      currentP += diff * factor;

      if (Math.abs(diff) < 0.0005) {
        currentP = targetP;
        raf = 0;
        lastTime = 0;
      } else {
        raf = requestAnimationFrame(animate);
      }

      applyScene(currentP);
    };

    const onScroll = () => {
      getScrollProgress();
      if (!raf) {
        raf = requestAnimationFrame(animate);
      }
    };

    let prevWidth = window.innerWidth;
    const onResize = () => {
      getScrollProgress();
      if (window.innerWidth !== prevWidth) {
        prevWidth = window.innerWidth;
        applyScene(currentP, true);
      }
      if (!raf) {
        raf = requestAnimationFrame(animate);
      }
    };

    getScrollProgress();
    currentP = reducedMotion ? 1 : targetP;
    applyScene(currentP, true);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      aria-label="About Studio Cave"
      className="relative z-40 -mt-[100svh] w-full bg-transparent text-[#171815]"
    >
      {/* overflow-x-clip keeps position: sticky hardware-locked on mobile & desktop */}
      <div
        ref={stageRef}
        className="relative h-[175vh] w-full overflow-x-clip bg-transparent sm:h-[195vh] md:h-[240vh]"
      >
        {/* Navbar #about anchor targets the revealed editorial composition hold */}
        <div
          id="about"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[58vh] h-px sm:top-[74vh] md:top-[109vh]"
        />

        {/* Compositor-pinned 100svh stage — zero vertical JS scroll shake on mobile */}
        <div
          ref={stickyCanvasRef}
          className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#dbe4ee] will-change-[opacity] md:min-h-[620px]"
          style={{
            background:
              "radial-gradient(ellipse 54% 44% at 6% 62%, rgba(255,176,130,0.42) 0%, rgba(255,200,165,0.18) 42%, transparent 72%), linear-gradient(180deg, #b6d0e6 0%, #dbe4ee 46%, #e9e8e3 84%, #e9e8e3 100%)",
          }}
        >
          {/* CENTRAL CLIPPED TEXT REVEAL AREA */}
          <div
            ref={clipRef}
            className="
              absolute bottom-[112px] left-3 right-[33%] top-[168px] z-20
              flex items-center justify-center overflow-hidden px-1.5 text-center
              sm:bottom-[130px] sm:left-4 sm:right-[34%] sm:top-[184px] sm:px-3
              md:inset-y-0 md:left-[25.5%] md:right-[41%] md:px-4
              lg:left-[25%] lg:right-[40.5%] lg:px-6
            "
          >
            <div
              ref={textTrackRef}
              className="w-full max-w-[460px] will-change-transform motion-reduce:transform-none"
              style={{ transform: "translate3d(460px, 0, 0)" }}
            >
              <h2 className="mb-2.5 text-xl font-bold uppercase leading-[1.02] tracking-[-0.03em] text-[#171815] sm:mb-4 sm:text-3xl md:text-4xl lg:text-[2.6rem] xl:text-[2.9rem]">
                ABOUT US
              </h2>

              <p className="mx-auto text-[13px] font-semibold leading-[1.42] tracking-[-0.02em] sm:text-lg md:text-[1.22rem] lg:text-[1.42rem] xl:text-[1.58rem]">
                <span className="text-[#171815]">
                  Studio Cave is an architecture, interior design, construction,
                  and turnkey-solutions practice{" "}
                </span>
                <span className="text-[#9da19e]">
                  guided by aesthetics, functionality, context, and disciplined
                  execution from concept to final handover.
                </span>
              </p>
            </div>
          </div>

          {/* IMAGE 1 — TOP LEFT: GPU clip-path crops inward without layout reflow */}
          <div
            ref={img1FrameRef}
            className="
              absolute left-3 top-[68px] z-30 h-[22svh] w-[44vw] overflow-hidden bg-[#e9e8e3] will-change-[clip-path]
              md:left-4 md:top-[18.5vh] md:h-[26.5vh] md:w-[40.5vw]
            "
          >
            <div
              ref={img1ZoomRef}
              className="relative h-full w-full will-change-transform motion-reduce:transform-none"
              style={{ transform: "scale(1.02)" }}
            >
              <Image
                src="/images/services/architecture.webp"
                alt="Modern architectural residence exterior with travertine walls and timber soffit"
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* IMAGE 2 — BOTTOM LEFT: GPU translate3d + clip-path without layout reflow */}
          <div
            ref={img2FrameRef}
            className="
              absolute bottom-0 left-3 z-30 h-[23svh] w-[44vw] overflow-hidden bg-[#e9e8e3] will-change-[transform,clip-path]
              md:left-4 md:h-[31.5vh] md:w-[40.5vw]
            "
          >
            <div
              ref={img2ZoomRef}
              className="relative h-full w-full will-change-transform motion-reduce:transform-none"
              style={{ transform: "scale(1.02)" }}
            >
              <Image
                src="/images/about/about-image2-4k.webp"
                alt="Modern dark-matte kitchen featuring backlit ribbed glass cabinets, terrazzo backsplash, black pendant lights, open shelving, and warm LED plinth glow"
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-cover object-[50%_42%]"
              />
            </div>
          </div>

          {/* IMAGE 3 — RIGHT LARGE VERTICAL: GPU clip-path narrows cleanly inward */}
          <div
            ref={img3FrameRef}
            className="
              absolute bottom-0 right-3 top-[68px] z-30 w-[49vw] overflow-hidden bg-[#e9e8e3] will-change-[clip-path]
              md:right-4 md:top-[74px] md:w-[53.5vw] lg:top-[8.5vh] lg:w-[54vw]
            "
          >
            <div
              ref={img3ZoomRef}
              className="relative h-full w-full will-change-transform motion-reduce:transform-none"
              style={{ transform: "scale(1.02)" }}
            >
              <Image
                src="/images/about/about-image3-4k.webp"
                alt="Three-story contemporary residence featuring linear LED facade framing, dark fluted louvers, recessed balconies, double charcoal entry doors, topiary planters, and illuminated stone walkway"
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
