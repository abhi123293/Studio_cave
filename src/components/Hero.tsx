"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDown } from "lucide-react";

const BUILDING = "/images/studio-cave-building.png";

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
// 0 → 1 progress between two scroll points
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => t * t * (3 - 2 * t);

/* ---------- Realistic clouds (SVG turbulence, no image needed) ---------- */
function Clouds({
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
}

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
  y: 560,
  fontSize: 40,
  textLength: 880,
};

export default function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const targetP = useRef(0);
  const [p, setP] = useState(0); // overall scroll progress 0 → 1

useEffect(() => {
  let raf = 0;
  let currentP = 0;

  const measureScroll = () => {
    const el = wrapRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const total = rect.height - window.innerHeight;

    targetP.current = clamp(-rect.top / total);

    if (!raf) {
      raf = requestAnimationFrame(animate);
    }
  };

  const animate = () => {
    const difference = targetP.current - currentP;

    currentP += difference * 0.09;

    if (Math.abs(difference) < 0.0005) {
      currentP = targetP.current;
      raf = 0;
    } else {
      raf = requestAnimationFrame(animate);
    }

    setP(currentP);
  };

  measureScroll();

  window.addEventListener("scroll", measureScroll, { passive: true });
  window.addEventListener("resize", measureScroll);

  return () => {
    window.removeEventListener("scroll", measureScroll);
    window.removeEventListener("resize", measureScroll);

    if (raf) cancelAnimationFrame(raf);
  };
}, []);

  /* ---------- animation timeline ---------- */
  // building starts low, then zooms upward (stays visible behind the letters)
// Building rises gradually over a longer scroll interval
const zoom = ease(range(p, 0.05, 0.78));

const buildingScale = 1 + zoom * 1.35;
const buildingY = -zoom * 28;

  // headline block fades out FAST so the name can appear right away
 // Supporting content disappears first
// Subtitle disappears earlier
const supportOut = ease(range(p, 0.08, 0.28));

// Main heading changes colour first
// Heading and paragraph move down and fade out
const textOut = ease(range(p, 0.18, 0.32));
const textMove = ease(range(p, 0.12, 0.65));

  // 1) outline text wipes in left → right
// Draw the STUDIO CAVE outline as the first heading disappears
const reveal = ease(range(p, 0.20, 0.48));

// Reveal the sky and cloud layer after the outline
const windowIn = ease(range(p, 0.46, 0.62));

  // ----- CLOUDS -----
  const sideGrow = ease(range(p, 0, 0.7));
  const sideScale = 1 + sideGrow * 0.35;
  const sideOpacity = 1 - range(p, 0.72, 0.92);

  const bankLow = ease(range(p, 0.06, 0.85));
  const bankHigh = ease(range(p, 0.3, 0.85));

  // fade to white
  const whiteOut = ease(range(p, 0.82, 1));

  return (
    // tall wrapper = scroll distance for the animation
   <div ref={wrapRef} className="relative h-[650vh]">
      <section
        id="home"
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#e9e8e3] text-[#171815]"
      >
        {/* slow drifting for the side clouds */}
        <style>{`
          @keyframes cloudDriftA { from { transform: translateX(-2.5%); } to { transform: translateX(2.5%); } }
          .cloud-drift { animation: cloudDriftA 45s ease-in-out infinite alternate; }
          @media (prefers-reduced-motion: reduce) { .cloud-drift { animation: none; } }
        
       
       @keyframes heroTitleReveal {
  from {
    transform: translateY(110%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes heroSupportReveal {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.hero-title-reveal {
  display: inline-block;
  animation: heroTitleReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
}

.hero-support-reveal {
  animation: heroSupportReveal 0.8s ease 0.45s both;
}`}
        </style>

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
          className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
          style={{
            WebkitMaskImage: EDGE_MASK,
            maskImage: EDGE_MASK,
            opacity: sideOpacity,
          }}
        >
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              transform: `scale(${sideScale})`,
              transformOrigin: "50% 60%",
            }}
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
        <img
          src={BUILDING}
          alt="Modern architectural building"
className="pointer-events-none absolute -bottom-[55vh] left-1/2 z-10 w-[110vw] max-w-none select-none will-change-transform md:w-[105vw] lg:w-[1500px]"
          style={{
            transformOrigin: "50% 75%",
            transform: `translate(-50%, ${buildingY}vh) scale(${buildingScale})`,
          }}
        />

        {/* HEADLINE BLOCK — CENTERED (fades out on scroll) */}
  {/* HEADLINE BLOCK */}
<div className="absolute inset-x-0 top-[16%] flex justify-center px-6 text-center md:top-[17%]">

  {/* MAIN HEADING — stays in front of the building */}
<div
  className="relative z-[8] w-full max-w-5xl"
style={{
  opacity: 1 - textOut,
  transform: `translateY(${textMove * 55}px)`,
}}
  >
    <div className="overflow-hidden">
      <h1 className="whitespace-nowrap text-[clamp(2.5rem,8vw,110px)] font-extrabold leading-none tracking-[-0.055em]">
        <span className="hero-title-reveal">
          Spaces That Move You<span className="text-[#8b927c]">.</span>
        </span>
      </h1>
    </div>
  </div>

  {/* SUBTITLE + CTA — building passes in front of these */}
  <div
    className="pointer-events-auto absolute inset-x-0 top-full z-[8] px-6"
   style={{
  opacity: 1 - textOut,
  transform: `translateY(${textMove * 55}px)`,
  pointerEvents: textOut > 0.6 ? "none" : "auto",
}}
  >
    <div className="hero-support-reveal">
      <p className="mx-auto mt-7 max-w-md text-base leading-7 text-[#52656d] md:text-lg">
        Thoughtfully designed spaces. Meaningful experiences.
        Built around the way you live.
      </p>

      
    </div>
  </div>

</div>

        {/* ============================================================ */}
        {/* LETTER WINDOW: sky + clouds with "STUDIO CAVE" cut out,      */}
        {/* so the building behind is visible THROUGH the letters.       */}
        {/* ============================================================ */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 800"
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute inset-0 z-[22] h-full w-full"
        >
          <defs>
            {/* same sky as the background */}
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

            {/* clouds drawn inside the window layer */}
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

            {/* THE CUT-OUT: white = visible, black text = see-through hole */}
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
                fontWeight={500}
                textLength={SUB.textLength}
                lengthAdjust="spacing"
                fill="black"
                style={{ fontFamily: "inherit" }}
              >
                ARCHITECTURE · INTERIORS · CONSTRUCTION
              </text>
            </mask>
          </defs>

          {/* sky + clouds layer with the letter holes */}
          <g mask="url(#win-mask)" style={{ opacity: windowIn }}>
            <rect width="1440" height="800" fill="url(#win-sky)" />
            <rect width="1440" height="800" fill="url(#win-glow)" />
            <rect width="1440" height="800" filter="url(#win-clouds)" opacity="0.95" />
          </g>

          {/* OUTLINE: wipes in left → right at the very start of the scroll */}
          <g
            style={{
              opacity: 1 - range(p, 0.55, 0.7) * 0.0, // keep the outline visible
              transform: `scale(${1.05 - reveal * 0.05})`,
              transformOrigin: "720px 440px",
            }}
          >
            <clipPath id="win-reveal">
              <rect x="0" y="0" width={1440 * reveal} height="800" />
            </clipPath>

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
             {/* OUTLINE: SVG stroke-drawing reveal */}
<g
  style={{
    opacity: 1,
    transform: `scale(${1.05 - reveal * 0.05})`,
    transformOrigin: "720px 440px",
  }}
>
  {/* STUDIO CAVE outline */}
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
    strokeDasharray="6000"
    strokeDashoffset={6000 * (1 - reveal)}
    style={{
      fontFamily: "inherit",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }}
  >
    STUDIO CAVE
  </text>

  {/* Supporting descriptor outline */}
  <text
    x={BRAND.x}
    y={SUB.y}
    textAnchor="middle"
    fontSize={SUB.fontSize}
    fontWeight={500}
    textLength={SUB.textLength}
    lengthAdjust="spacing"
    fill="none"
    stroke="rgba(255,255,255,0.9)"
    strokeWidth="1.2"
    strokeDasharray="3000"
    strokeDashoffset={3000 * (1 - reveal)}
    style={{
      fontFamily: "inherit",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }}
  >
    ARCHITECTURE · INTERIORS · CONSTRUCTION
  </text>
</g>
            </g>
          </g>
        </svg>

        {/* LOW PUFFY CLOUD BANK (rises first, around the building base) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[28] h-[70vh] will-change-transform"
          style={{ transform: `translateY(${(1 - bankLow) * 100}%)` }}
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

        {/* THICK CLOUD BANK (rises later, covers everything) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[110vh] will-change-transform"
          style={{ transform: `translateY(${(1 - bankHigh) * 100}%)` }}
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
          {/* solid white base so the bottom is fully covered */}
          <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-white via-white/90 to-transparent" />
        </div>

        {/* CAPTIONS (fade out first) */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex items-center justify-between px-6 text-xs text-[#171815] md:bottom-8 md:px-12 lg:px-20"
          style={{ opacity: 1 - range(p, 0, 0.12) }}
        >
          <span className="uppercase tracking-[0.2em]">Designed for living</span>
          <span className="flex items-center gap-2">
            Scroll to explore
            <ArrowDown size={15} />
          </span>
        </div>

        {/* FINAL FADE TO WHITE (matches the next section) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[35] bg-white"
          style={{ opacity: whiteOut }}
        />
      </section>
    </div>
  );
}