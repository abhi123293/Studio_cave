"use client";
import { memo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const BUILDING = "/images/hero.webp";

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
// 0 → 1 progress between two scroll points
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => t * t * (3 - 2 * t);

const toggleVisibility = (el: HTMLElement | SVGElement | null, opacity: number) => {
  if (!el) return;
  el.style.visibility = opacity <= 0.001 ? "hidden" : "visible";
};

/* ---------- Realistic clouds (SVG turbulence, no image needed) ---------- */
const Clouds = memo(function Clouds({
  id,
  seed = 11,
  gain = 4.2, // higher = sharper, puffier edges
  offset = -1.75, // lower = fewer clouds
  freq = "0.0038 0.0075", // smaller numbers = bigger clouds
  shade = false, // adds the grey shaded underside (3D puffy look)
  fadeTop = false, // soft fade on the top edge
  className = "",
}: {
  id: string;
  seed?: number;
  gain?: number;
  offset?: number;
  freq?: string;
  shade?: boolean;
  fadeTop?: boolean;
  className?: string;
}) {
  const fade = fadeTop
    ? "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 18%, rgba(0,0,0,0.8) 38%, #000 55%)"
    : undefined;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ WebkitMaskImage: fade, maskImage: fade }}
    >
      <defs>
        <filter
          id={`${id}-f`}
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency={freq}
            numOctaves="6"
            seed={seed}
          />
          <feColorMatrix
            type="matrix"
            values={`0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${gain} ${offset}`}
          />
        </filter>

        {shade && (
          <filter
            id={`${id}-s`}
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency={freq}
              numOctaves="6"
              seed={seed}
            />
            <feColorMatrix
              type="matrix"
              values={`0 0 0 0 0.52  0 0 0 0 0.58  0 0 0 0 0.7  0 0 0 ${gain} ${offset + 0.4}`}
            />
            <feGaussianBlur stdDeviation="5" />
          </filter>
        )}
      </defs>

      {shade && (
        <rect
          width="1440"
          height="800"
          filter={`url(#${id}-s)`}
          transform="translate(0 14)"
          opacity="0.55"
        />
      )}
      <rect width="1440" height="800" filter={`url(#${id}-f)`} />
    </svg>
  );
});

// keeps the middle of the sky clear (behind the headline); clouds sit at the edges
const EDGE_MASK =
  "radial-gradient(ellipse 40% 60% at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 55%, #000 100%)";

/* ---------- Brand text settings (shared by the window cut-out and the outline) ---------- */
const BRAND = {
  x: 720,
  y: 470,
  fontSize: 230,
  textLength: 1160,
}; // total width of the word inside the 1440 viewBox

const SUB = {
  y: 562,
  fontSize: 54,
  textLength: 1160,
};

export default function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const buildingRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const sideWrapRef = useRef<HTMLDivElement>(null);
  const sideScaleRef = useRef<HTMLDivElement>(null);
  const winSvgRef = useRef<SVGSVGElement>(null);
  const outlineGroupRef = useRef<SVGGElement>(null);
  const revealRectRef = useRef<SVGRectElement>(null);
  const bankLowRef = useRef<HTMLDivElement>(null);
  const bankHighRef = useRef<HTMLDivElement>(null);
  const whiteOutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let lastTime = 0;
    let currentP = 0;
    let targetP = 0;

    // Direct DOM updates in rAF keep scroll animations at 60-120fps with zero React re-renders
    const applyProgress = (p: number) => {
      const zoom = ease(range(p, 0.05, 0.78));
      const buildingScale = 1 + zoom * 0.35;
      const buildingY = -zoom * 82;

      const textOut = ease(range(p, 0.02, 0.28));
      const textMove = ease(range(p, 0.01, 0.30));
      const textOpacity = 1 - textOut;
      const textTransform = `translate3d(0, ${textMove * 110}px, 0)`;

      const reveal = ease(range(p, 0.20, 0.48));
      const windowIn = ease(range(p, 0.48, 0.58));

      const sideGrow = ease(range(p, 0, 0.7));
      const sideScale = 1 + sideGrow * 0.35;
      const sideOpacity = 1 - range(p, 0.72, 0.92);

      const bankLow = ease(range(p, 0.78, 0.93));
      const bankHigh = ease(range(p, 0.84, 0.98));
      const whiteOut = ease(range(p, 0.97, 1));

      if (buildingRef.current) {
        buildingRef.current.style.transform = `translate3d(-51.5%, ${buildingY}vh, 0) scale(${buildingScale})`;
      }

      if (headlineRef.current) {
        headlineRef.current.style.opacity = String(textOpacity);
        headlineRef.current.style.transform = textTransform;
        toggleVisibility(headlineRef.current, textOpacity);
      }

      if (subtitleRef.current) {
        subtitleRef.current.style.opacity = String(textOpacity);
        subtitleRef.current.style.transform = textTransform;
        subtitleRef.current.style.pointerEvents = textOut > 0.6 ? "none" : "auto";
        toggleVisibility(subtitleRef.current, textOpacity);
      }

      if (sideWrapRef.current) {
        sideWrapRef.current.style.opacity = String(sideOpacity);
        toggleVisibility(sideWrapRef.current, sideOpacity);
      }
      if (sideScaleRef.current) {
        sideScaleRef.current.style.transform = `scale(${sideScale})`;
      }

      if (winSvgRef.current) {
        winSvgRef.current.style.opacity = String(windowIn);
        toggleVisibility(winSvgRef.current, windowIn);
      }

      if (outlineGroupRef.current) {
        outlineGroupRef.current.style.transform = `scale(${1.05 - reveal * 0.05})`;
      }
      if (revealRectRef.current) {
        revealRectRef.current.setAttribute("x", String(720 - 720 * reveal));
        revealRectRef.current.setAttribute("width", String(1440 * reveal));
      }

      if (bankLowRef.current) {
        bankLowRef.current.style.transform = `translate3d(0, ${(1 - bankLow) * 100}%, 0)`;
        bankLowRef.current.style.opacity = String(bankLow);
        toggleVisibility(bankLowRef.current, bankLow);
      }

      if (bankHighRef.current) {
        bankHighRef.current.style.transform = `translate3d(0, ${(1 - bankHigh) * 100}%, 0)`;
        bankHighRef.current.style.opacity = String(bankHigh);
        toggleVisibility(bankHighRef.current, bankHigh);
      }

      if (whiteOutRef.current) {
        whiteOutRef.current.style.opacity = String(whiteOut);
        toggleVisibility(whiteOutRef.current, whiteOut);
      }
    };

    const animate = (now: number) => {
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = now;

      const difference = targetP - currentP;
      const factor = 1 - Math.exp(-12 * dt);
      currentP += difference * factor;

      if (Math.abs(difference) < 0.0005) {
        currentP = targetP;
        raf = 0;
        lastTime = 0;
      } else {
        raf = requestAnimationFrame(animate);
      }

      applyProgress(currentP);
    };

    const updateTarget = () => {
      const el = wrapRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      targetP = total > 0 ? clamp(-rect.top / total) : 0;
    };

    const measureScroll = () => {
      updateTarget();
      if (!raf) {
        raf = requestAnimationFrame(animate);
      }
    };

    updateTarget();
    currentP = targetP;
    applyProgress(currentP);

    window.addEventListener("scroll", measureScroll, { passive: true });
    window.addEventListener("resize", measureScroll);

    return () => {
      window.removeEventListener("scroll", measureScroll);
      window.removeEventListener("resize", measureScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    // tall wrapper = scroll distance for the animation
    <div ref={wrapRef} className="relative h-[650vh]">
      <section
        id="home"
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#e9e8e3] text-[#171815]"
      >
        {/* SKY: blue, warming to peach at the lower left */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 6% 95%, rgba(255,176,130,0.9) 0%, rgba(255,200,165,0.45) 45%, transparent 80%), linear-gradient(180deg, #8fb6dc 0%, #b6d0e6 45%, #dbe4ee 80%, #f1ded0 100%)",
          }}
        />

        {/* SIDE CLOUD MASSES (behind the building): grow outward on scroll */}
        <div
          ref={sideWrapRef}
          className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
          style={{
            WebkitMaskImage: EDGE_MASK,
            maskImage: EDGE_MASK,
          }}
        >
          <div
            ref={sideScaleRef}
            className="absolute inset-0 will-change-transform"
            style={{ transformOrigin: "50% 60%" }}
          >
            <div className="cloud-drift absolute -left-[6%] -right-[6%] bottom-0 top-0 opacity-95">
              <Clouds id="side" seed={14} gain={4.2} offset={-1.75} freq="0.0038 0.0075" />
            </div>
          </div>
        </div>

        {/* NAVIGATION (always visible) */}
        <header className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-6 md:px-12 lg:px-20">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            STUDIO CAVE<span className="text-[#8b927c]">.</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            <Link href="#home" className="hover:opacity-60">Home</Link>
            <Link href="#about" className="hover:opacity-60">About</Link>
            <Link href="#services" className="hover:opacity-60">Services</Link>
            <Link href="/blog" className="hover:opacity-60">Blog</Link>
            <Link href="#contact" className="hover:opacity-60">Contact</Link>
          </nav>

          <Link
            href="#contact"
            className="flex items-center gap-2 rounded-full bg-[#171815] px-5 py-3 text-sm text-white transition hover:bg-[#45483d]"
          >
            Get in Touch
            <ArrowUpRight size={16} />
          </Link>
        </header>

        {/* BUILDING (zooms in; stays behind the letter window) */}
        <Image
          ref={buildingRef}
          src={BUILDING}
          alt="Modern architectural building"
          width={1792}
          height={2400}
          priority
          sizes="(min-width: 1024px) 1350px, 100vw"
          className="pointer-events-none absolute -bottom-[67vh] left-1/2 z-10 h-[120vh] w-auto max-w-none select-none will-change-transform sm:-bottom-[93vh] sm:h-[155vh] lg:-bottom-[111vh] lg:h-[180vh]"
          style={{
            transformOrigin: "50% 62%",
            transform: "translate3d(-51.5%, 0vh, 0) scale(1)",
          }}
        />

        {/* HEADLINE BLOCK — CENTERED (fades out on scroll) */}
        <div className="absolute inset-x-0 top-[14%] flex justify-center px-6 text-center md:top-[15%]">
          {/* MAIN HEADING — stays in front of the building */}
          <div
            ref={headlineRef}
            className="relative z-[8] w-full max-w-5xl will-change-transform"
          >
            <div className="overflow-hidden">
              <h1 className="text-[clamp(1.65rem,5.5vw,80px)] font-extrabold leading-[1.04] tracking-[-0.045em]">
                <span className="hero-title-reveal">
                  Designing Spaces.
                  <br />
                  Building Experiences.
                </span>
              </h1>
            </div>
          </div>

          {/* SUBTITLE — building passes in front */}
          <div
            ref={subtitleRef}
            className="pointer-events-auto absolute inset-x-0 top-full z-[8] px-6 will-change-transform"
          >
            <div className="hero-support-reveal">
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#52656d] md:mt-6 md:text-lg md:leading-7">
                Transforming ideas into exceptional spaces through architecture, interior design,
                construction and turnkey solutions.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* STATIC LETTER WINDOW: pre-rasterized sky + clouds cut-out,   */}
        {/* separated from outline animation so feTurbulence never       */}
        {/* re-rasterizes during scroll.                                 */}
        {/* ============================================================ */}
        <svg
          ref={winSvgRef}
          aria-hidden="true"
          viewBox="0 0 1440 800"
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute inset-0 z-[22] h-full w-full will-change-[opacity]"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          <defs>
            <linearGradient id="win-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8fb6dc" />
              <stop offset="0.45" stopColor="#b6d0e6" />
              <stop offset="0.8" stopColor="#dbe4ee" />
              <stop offset="1" stopColor="#f1ded0" />
            </linearGradient>
            <radialGradient id="win-glow" cx="6%" cy="95%" r="65%">
              <stop offset="0" stopColor="#ffb082" stopOpacity="0.9" />
              <stop offset="0.5" stopColor="#ffc8a5" stopOpacity="0.45" />
              <stop offset="1" stopColor="#ffc8a5" stopOpacity="0" />
            </radialGradient>

            <filter
              id="win-clouds"
              x="0"
              y="0"
              width="100%"
              height="100%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.0038 0.0075"
                numOctaves="6"
                seed="14"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 4.2 -1.85"
              />
            </filter>

            <mask
              id="win-mask"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1440"
              height="800"
            >
              <rect width="1440" height="800" fill="white" />
              <text
                x={BRAND.x}
                y={BRAND.y}
                textAnchor="middle"
                fontSize={BRAND.fontSize}
                fontWeight={800}
                textLength={BRAND.textLength}
                lengthAdjust="spacingAndGlyphs"
                fill="black"
                style={{ fontFamily: "inherit" }}
              >
                STUDIO CAVE
              </text>
              <text
                x={BRAND.x}
                y={SUB.y}
                textAnchor="middle"
                fontSize={SUB.fontSize}
                fontWeight={600}
                textLength={SUB.textLength}
                lengthAdjust="spacingAndGlyphs"
                fill="black"
                style={{ fontFamily: "inherit" }}
              >
                ARCHITECTURE · INTERIORS · CONSTRUCTION
              </text>
            </mask>
          </defs>

          <g mask="url(#win-mask)">
            <rect width="1440" height="800" fill="url(#win-sky)" />
            <rect width="1440" height="800" fill="url(#win-glow)" />
            <rect width="1440" height="800" filter="url(#win-clouds)" opacity="0.95" />
          </g>
        </svg>

        {/* OUTLINE REVEAL: separate lightweight SVG with zero turbulence filters */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 800"
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute inset-0 z-[22] h-full w-full"
        >
          <defs>
            <clipPath id="win-reveal">
              <rect ref={revealRectRef} x="720" y="0" width="0" height="800" />
            </clipPath>
          </defs>
          <g
            ref={outlineGroupRef}
            style={{
              transform: "scale(1.05)",
              transformOrigin: "720px 440px",
            }}
          >
            <g clipPath="url(#win-reveal)">
              <text
                x={BRAND.x}
                y={BRAND.y}
                textAnchor="middle"
                fontSize={BRAND.fontSize}
                fontWeight={800}
                textLength={BRAND.textLength}
                lengthAdjust="spacingAndGlyphs"
                fill="none"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="2.5"
                style={{ fontFamily: "inherit" }}
              >
                STUDIO CAVE
              </text>

              <text
                x={BRAND.x}
                y={SUB.y}
                textAnchor="middle"
                fontSize={SUB.fontSize}
                fontWeight={600}
                textLength={SUB.textLength}
                lengthAdjust="spacingAndGlyphs"
                fill="none"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="1.5"
                style={{ fontFamily: "inherit" }}
              >
                ARCHITECTURE · INTERIORS · CONSTRUCTION
              </text>
            </g>
          </g>
        </svg>

        {/* LOW CLOUD BANK — rises from the bottom, behind the lettering */}
        <div
          ref={bankLowRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[18] h-[70vh] will-change-transform"
          style={{ transform: "translate3d(0, 100%, 0)", opacity: 0, visibility: "hidden" }}
        >
          <Clouds
            id="banklow"
            seed={9}
            gain={6}
            offset={-2.7}
            freq="0.006 0.013"
            shade
            fadeTop
          />
        </div>

        {/* THICK CLOUD BANK — rises later, in front of the lettering */}
        <div
          ref={bankHighRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[110vh] will-change-transform"
          style={{ transform: "translate3d(0, 100%, 0)", opacity: 0, visibility: "hidden" }}
        >
          <Clouds
            id="bankhigh"
            seed={4}
            gain={6}
            offset={-2.3}
            freq="0.005 0.011"
            shade
            fadeTop
          />

          <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-white via-white/90 to-transparent" />
        </div>

        {/* FINAL FADE TO WHITE (matches the next section) */}
        <div
          ref={whiteOutRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[35] bg-white"
          style={{ opacity: 0, visibility: "hidden" }}
        />
      </section>
    </div>
  );
}
