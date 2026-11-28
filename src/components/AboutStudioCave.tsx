"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Editorial About Us section reproducing the exact reference proportions:
 * Hero sky-mist backdrop framing a wide top-left architectural image, a
 * flush-bottom lower-left image, and a tall right vertical anchor (`~40.5%` /
 * `~40.5%` / `~54%` initially, zoomed `1.08`).
 *
 * Scrolling smoothly contracts all three image widths and scales (`1.08 -> 1.0`)
 * and slides the central About copy horizontally right -> left into the open
 * corridor with deep charcoal primary text and muted grey secondary text.
 */
export default function AboutStudioCave() {
  const stageRef = useRef<HTMLDivElement>(null);
  const pinnedCanvasRef = useRef<HTMLDivElement>(null);

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
    const canvas = pinnedCanvasRef.current;
    const f1 = img1FrameRef.current;
    const z1 = img1ZoomRef.current;
    const f2 = img2FrameRef.current;
    const z2 = img2ZoomRef.current;
    const f3 = img3FrameRef.current;
    const z3 = img3ZoomRef.current;
    const clip = clipRef.current;
    const track = textTrackRef.current;

    if (!stage || !canvas || !f1 || !z1 || !f2 || !z2 || !f3 || !z3 || !clip || !track) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    let lastTime = 0;
    let currentP = 0;
    let targetP = 0;

    const getLayouts = (vw: number, vh: number) => {
      if (vw >= 1024) {
        const edge = 16;
        const leftStartW = vw * 0.405;
        const leftEndW = Math.min(330, vw * 0.225);
        const top3 = clamp(0.085 * vh, 72, 86);
        const endBottom = clamp(0.04 * vh, 24, 42);

        return {
          start: {
            img1: { left: edge, top: 0.19 * vh, width: leftStartW, height: 0.265 * vh },
            img2: { left: edge, bottom: 0, width: leftStartW, height: 0.315 * vh },
            img3: { right: edge, top: top3, width: vw * 0.54, height: vh - top3 },
          },
          end: {
            img1: { left: edge, top: 0.18 * vh, width: leftEndW, height: 0.225 * vh },
            img2: { left: edge, bottom: endBottom, width: leftEndW, height: 0.22 * vh },
            img3: {
              right: edge,
              top: top3,
              width: vw * 0.385,
              height: vh - top3 - endBottom,
            },
          },
        };
      }

      if (vw >= 768) {
        const edge = 16;
        const leftStartW = vw * 0.405;
        const leftEndW = vw * 0.225;
        const top3 = 74;
        const endBottom = 28;

        return {
          start: {
            img1: { left: edge, top: 0.19 * vh, width: leftStartW, height: 0.26 * vh },
            img2: { left: edge, bottom: 0, width: leftStartW, height: 0.31 * vh },
            img3: { right: edge, top: top3, width: vw * 0.535, height: vh - top3 },
          },
          end: {
            img1: { left: edge, top: 0.175 * vh, width: leftEndW, height: 0.22 * vh },
            img2: { left: edge, bottom: endBottom, width: leftEndW, height: 0.215 * vh },
            img3: {
              right: edge,
              top: top3,
              width: vw * 0.385,
              height: vh - top3 - endBottom,
            },
          },
        };
      }

      const edge = 12;
      const top3 = 68;
      const endBottom = 20;
      return {
        start: {
          img1: { left: edge, top: 0.15 * vh, width: vw * 0.42, height: 0.19 * vh },
          img2: { left: edge, bottom: 0, width: vw * 0.42, height: 0.22 * vh },
          img3: { right: edge, top: top3, width: vw * 0.51, height: vh - top3 },
        },
        end: {
          img1: { left: edge, top: 74, width: vw * 0.34, height: 96 },
          img2: { left: edge, bottom: endBottom, width: vw * 0.34, height: 92 },
          img3: {
            right: edge,
            top: top3,
            width: vw * 0.34,
            height: vh - top3 - endBottom,
          },
        },
      };
    };

    const syncCanvasLock = () => {
      const rect = stage.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollableDistance = Math.max(0, rect.height - vh);
      const lockY = clamp(-rect.top, -vh, scrollableDistance + vh);
      canvas.style.transform = `translate3d(0, ${lockY.toFixed(2)}px, 0)`;

      // Cross-dissolve seamlessly out of Hero's finishing clouds with zero white gap
      const entryFade = clamp(1 - rect.top / (vh * 0.24));
      canvas.style.opacity = entryFade.toFixed(3);
      canvas.style.pointerEvents = entryFade > 0.05 ? "auto" : "none";

      if (reducedMotion) {
        targetP = 1;
        return;
      }

      targetP = scrollableDistance > 0 ? clamp(-rect.top / scrollableDistance) : 0;
    };

    const applyScene = (stageP: number) => {
      const vw = canvas.clientWidth || window.innerWidth;
      const vh = canvas.clientHeight || window.innerHeight;
      const t = reducedMotion ? 1 : easeOutCubic(clamp(stageP / 0.78));
      const { start, end } = getLayouts(vw, vh);

      const zoomScale = lerp(1.08, 1, t).toFixed(4);

      // IMAGE 1 — Top-left: contracts horizontally from 40.5% reference proportion
      f1.style.left = `${lerp(start.img1.left, end.img1.left, t).toFixed(2)}px`;
      f1.style.top = `${lerp(start.img1.top, end.img1.top, t).toFixed(2)}px`;
      f1.style.width = `${lerp(start.img1.width, end.img1.width, t).toFixed(2)}px`;
      f1.style.height = `${lerp(start.img1.height, end.img1.height, t).toFixed(2)}px`;
      z1.style.transform = `scale(${zoomScale})`;

      // IMAGE 2 — Bottom-left: flush bottom start, contracts in width & lifts softly
      f2.style.left = `${lerp(start.img2.left, end.img2.left, t).toFixed(2)}px`;
      f2.style.bottom = `${lerp(start.img2.bottom, end.img2.bottom, t).toFixed(2)}px`;
      f2.style.width = `${lerp(start.img2.width, end.img2.width, t).toFixed(2)}px`;
      f2.style.height = `${lerp(start.img2.height, end.img2.height, t).toFixed(2)}px`;
      z2.style.transform = `scale(${zoomScale})`;

      // IMAGE 3 — Tall right anchor: starts at 54% width, contracts horizontally to 38.5%
      f3.style.right = `${lerp(start.img3.right, end.img3.right, t).toFixed(2)}px`;
      f3.style.top = `${lerp(start.img3.top, end.img3.top, t).toFixed(2)}px`;
      f3.style.width = `${lerp(start.img3.width, end.img3.width, t).toFixed(2)}px`;
      f3.style.height = `${lerp(start.img3.height, end.img3.height, t).toFixed(2)}px`;
      z3.style.transform = `scale(${zoomScale})`;

      // Reveal central text horizontally right -> left as the contracting widths open the corridor
      const textRevealT = reducedMotion ? 1 : easeOutCubic(clamp((t - 0.12) / 0.88));
      const maxOffsetX = clip.clientWidth + 24;
      const textX = lerp(maxOffsetX, 0, textRevealT);
      track.style.transform = `translate3d(${textX.toFixed(2)}px, 0, 0)`;
    };

    const animate = (now: number) => {
      syncCanvasLock();

      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = now;

      const diff = targetP - currentP;
      const factor = 1 - Math.exp(-8 * dt);
      currentP += diff * factor;

      if (Math.abs(diff) < 0.0004) {
        currentP = targetP;
        raf = 0;
        lastTime = 0;
      } else {
        raf = requestAnimationFrame(animate);
      }

      applyScene(currentP);
    };

    const onScrollOrResize = () => {
      syncCanvasLock();
      if (!raf) {
        raf = requestAnimationFrame(animate);
      }
    };

    syncCanvasLock();
    currentP = reducedMotion ? 1 : targetP;
    applyScene(currentP);

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  return (
    <section
      aria-label="About Studio Cave"
      className="relative z-40 -mt-[100vh] w-full bg-transparent text-[#171815]"
    >
      {/* Scroll-driving container clipped strictly to the About section window */}
      <div
        ref={stageRef}
        className="relative h-[225vh] w-full overflow-hidden bg-transparent md:h-[240vh]"
      >
        {/* Navbar #about anchor targets the revealed editorial composition hold */}
        <div
          id="about"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[98vh] h-px md:top-[109vh]"
        />

        {/* Viewport-locked canvas inside the About aperture styled with Hero's sky, warm stone & peach horizon */}
        <div
          ref={pinnedCanvasRef}
          className="absolute inset-x-0 top-0 h-[100svh] min-h-[620px] w-full overflow-hidden bg-[#dbe4ee] will-change-[transform,opacity]"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 6% 95%, rgba(255,176,130,0.65) 0%, rgba(255,200,165,0.34) 45%, transparent 80%), linear-gradient(180deg, #b6d0e6 0%, #dbe4ee 42%, #e9e8e3 78%, #f1ded0 100%)",
          }}
        >
          {/* CENTRAL CLIPPED TEXT REVEAL AREA — sits in the opened Hero-toned corridor */}
          <div
            ref={clipRef}
            className="
              absolute bottom-[122px] left-3 right-[37%] top-[180px] z-20
              flex items-center justify-center overflow-hidden px-1 text-center
              sm:bottom-[148px] sm:left-4 sm:right-[36%] sm:top-[214px] sm:px-3
              md:inset-y-0 md:left-[25.5%] md:right-[41%] md:px-4
              lg:left-[25%] lg:right-[40.5%] lg:px-6
            "
          >
            <div
              ref={textTrackRef}
              className="w-full max-w-[460px] will-change-transform motion-reduce:transform-none"
              style={{ transform: "translate3d(460px, 0, 0)" }}
            >
              <h2 className="mb-4 text-2xl font-bold uppercase leading-[1.02] tracking-[-0.03em] text-[#171815] sm:mb-5 sm:text-3xl md:text-4xl lg:text-[2.6rem] xl:text-[2.9rem]">
                ABOUT US
              </h2>

              <p className="mx-auto text-[0.95rem] font-semibold leading-[1.42] tracking-[-0.025em] sm:text-lg md:text-[1.22rem] lg:text-[1.42rem] xl:text-[1.58rem]">
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

          {/* IMAGE 1 — TOP LEFT: starts ~40.5vw wide rectangular proportion, contracts on scroll */}
          <div
            ref={img1FrameRef}
            className="absolute left-4 top-[19vh] z-30 h-[26.5vh] w-[40.5%] overflow-hidden bg-[#e9e8e3] will-change-[left,top,width,height]"
          >
            <div
              ref={img1ZoomRef}
              className="relative h-full w-full will-change-transform motion-reduce:transform-none"
              style={{ transform: "scale(1.08)" }}
            >
              <Image
                src="/images/services/architecture.webp"
                alt="Modern architectural residence exterior with travertine walls and timber soffit"
                fill
                priority
                sizes="(min-width: 1024px) 41vw, 42vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* IMAGE 2 — BOTTOM LEFT: flush bottom, ~40.5vw wide reference proportion */}
          <div
            ref={img2FrameRef}
            className="absolute bottom-0 left-4 z-30 h-[31.5vh] w-[40.5%] overflow-hidden bg-[#e9e8e3] will-change-[left,bottom,width,height]"
          >
            <div
              ref={img2ZoomRef}
              className="relative h-full w-full will-change-transform motion-reduce:transform-none"
              style={{ transform: "scale(1.08)" }}
            >
              <Image
                src="/images/services/interior-design.webp"
                alt="Warm minimalist interior living space with oak paneling and natural stone"
                fill
                sizes="(min-width: 1024px) 41vw, 42vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* IMAGE 3 — RIGHT LARGE VERTICAL: starts ~54vw wide × 91.5vh tall, contracts horizontally on scroll */}
          <div
            ref={img3FrameRef}
            className="absolute right-4 top-[8.5vh] z-30 h-[91.5vh] w-[54%] overflow-hidden bg-[#e9e8e3] will-change-[right,top,width,height]"
          >
            <div
              ref={img3ZoomRef}
              className="relative h-full w-full will-change-transform motion-reduce:transform-none"
              style={{ transform: "scale(1.08)" }}
            >
              <Image
                src="/images/about-vertical.webp"
                alt="Monumental double-height contemporary architectural facade in honed travertine, timber, and charcoal steel"
                fill
                priority
                sizes="(min-width: 1024px) 54vw, 54vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
