"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDown } from "lucide-react";

const BUILDING = "/images/building.png";
// BUILDING IMAGE SETTINGS — adjust these when changing the image
const BUILDING_SETTINGS = {
  width: "1500px",
  bottom: "-75vh",
  initialScale: 1,
  scrollScale: 0.35,
  scrollY: 85,
  origin: "50% 75%",
};
const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
// 0 → 1 progress between two scroll points
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => t * t * (3 - 2 * t);

/* ---------- Soft realistic clouds (SVG turbulence, no image needed) ---------- */
function Clouds({
  id,
  seed = 4,
  freq = "0.0035 0.0075", // smaller numbers = bigger clouds
  gain = 3.4, // higher = denser / whiter clouds
  offset = -1.5, // lower = fewer clouds
  blur = 4, // soft edges
  shade = false, // soft pink/grey underside (3D look)
  fadeTop = false, // soft fade on the top edge
  softSides = false, // soft fade on left/right edges (no hard box edges)
  customMask, // any CSS mask (e.g. a round blob for small clouds)
  className = "",
}: {
  id: string;
  seed?: number;
  freq?: string;
  gain?: number;
  offset?: number;
  blur?: number;
  shade?: boolean;
  fadeTop?: boolean;
  softSides?: boolean;
  customMask?: string;
  className?: string;
}) {
  const vFade = fadeTop
    ? "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 25%, #000 50%)"
    : undefined;
  const hFade = softSides
    ? "linear-gradient(to right, transparent 0%, #000 16%, #000 84%, transparent 100%)"
    : undefined;
  const fade =
    customMask ?? ([vFade, hFade].filter(Boolean).join(", ") || undefined);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{
        WebkitMaskImage: fade,
        maskImage: fade,
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      }}
    >
      <defs>
        {/* white cloud body */}
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
            numOctaves="5"
            seed={seed}
          />
          <feColorMatrix
            type="matrix"
            values={`0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${gain} ${offset}`}
          />
          <feGaussianBlur stdDeviation={blur} />
        </filter>

        {/* soft lavender-pink underside */}
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
            numOctaves="5"
            seed={seed}
          />
          <feColorMatrix
            type="matrix"
            values={`0 0 0 0 0.78  0 0 0 0 0.74  0 0 0 0 0.84  0 0 0 ${gain} ${offset + 0.12}`}
          />
          <feGaussianBlur stdDeviation={blur + 8} />
        </filter>
      </defs>

      {shade && (
        <rect
          width="1440"
          height="800"
          filter={`url(#${id}-s)`}
          transform="translate(0 22)"
          opacity="0.5"
        />
      )}
      <rect width="1440" height="800" filter={`url(#${id}-f)`} />
    </svg>
  );
}

// keeps the middle of the sky clear (behind the headline); clouds sit at the edges
const EDGE_MASK =
  "radial-gradient(ellipse 40% 60% at 50% 40%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 55%, #000 100%)";

// round soft mask for small clouds: fades on ALL sides, so no box edges ever show
const BLOB_MASK =
  "radial-gradient(ellipse 50% 50% at 50% 50%, #000 25%, rgba(0,0,0,0.5) 55%, transparent 78%)";
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
/* ---------- Letter-by-letter outline reveal ---------- */
const BRAND_TEXT = "STUDIO CAVE";
// when each letter STARTS drawing (0 → 1 of the reveal). Mixed order = random feel.
//            S    T    U    D    I    O   (space)  C    A    V    E
const LETTER_START = [0.3, 0.0, 0.45, 0.15, 0.05, 0.38, 0, 0.22, 0.5, 0.1, 0.35];
// how each letter is drawn: l2r = left→right, r2l = right→left, b2t = bottom→top, t2b = top→bottom
const LETTER_DIR = ["l2r", "b2t", "l2r", "t2b", "b2t", "r2l", "", "l2r", "b2t", "l2r", "t2b"];
const LETTER_DUR = 0.45; // how long one letter takes to draw

type LetterBox = { x: number; y: number; w: number; h: number };

function letterRect(box: LetterBox, dir: string, t: number) {
  if (dir === "r2l") return { x: box.x + box.w * (1 - t), y: box.y, width: box.w * t, height: box.h };
  if (dir === "b2t") return { x: box.x, y: box.y + box.h * (1 - t), width: box.w, height: box.h * t };
  if (dir === "t2b") return { x: box.x, y: box.y, width: box.w, height: box.h * t };
  return { x: box.x, y: box.y, width: box.w * t, height: box.h }; // l2r
}
export default function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const targetP = useRef(0);
  const [p, setP] = useState(0); // overall scroll progress 0 → 1
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  checkMobile();

  window.addEventListener("resize", checkMobile);

  return () => {
    window.removeEventListener("resize", checkMobile);
  };
}, []);
  // measure where each letter of "STUDIO CAVE" sits, so each can be drawn separately
  const measureRef = useRef<SVGTextElement>(null);
  const [boxes, setBoxes] = useState<LetterBox[] | null>(null);

  useEffect(() => {
    const measure = () => {
      const t = measureRef.current;
      if (!t) return;
      try {
        const out: LetterBox[] = [];
        for (let i = 0; i < BRAND_TEXT.length; i++) {
          const e = t.getExtentOfChar(i);
          out.push({ x: e.x, y: e.y, w: e.width, h: e.height });
        }
        setBoxes(out);
      } catch {
        /* fallback boxes are used */
      }
    };
    measure();
    document.fonts?.ready.then(measure);
  }, []);

  // fallback boxes (equal widths) until the real ones are measured
  const letterBoxes: LetterBox[] =
    boxes ??
    BRAND_TEXT.split("").map((_, i) => ({
      x: BRAND.x - BRAND.textLength / 2 + (i * BRAND.textLength) / BRAND_TEXT.length,
      y: BRAND.y - BRAND.fontSize * 0.8,
      w: BRAND.textLength / BRAND_TEXT.length,
      h: BRAND.fontSize,
    }));
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

  currentP += difference * (window.innerWidth < 768 ? 0.18 : 0.18);

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
  // building rises gradually
  const zoom = ease(range(p, 0.05, 0.78));
const buildingScale =
  BUILDING_SETTINGS.initialScale +
  zoom * BUILDING_SETTINGS.scrollScale;

const buildingY = -zoom * BUILDING_SETTINGS.scrollY;
  // headline moves down + fades as soon as scrolling starts
  const textOut = ease(range(p, 0.02, 0.28));
  const textMove = ease(range(p, 0.01, 0.3));

  // outline "STUDIO CAVE" draws outward from the centre
const reveal = ease(
  range(p, isMobile ? 0.16 : 0.2, isMobile ? 0.38 : 0.48)
);

const revealRaw = range(
  p,
  isMobile ? 0.16 : 0.2,
  isMobile ? 0.38 : 0.48
);

const windowIn = ease(
  range(p, isMobile ? 0.34 : 0.42, isMobile ? 0.43 : 0.52)
);

  // ----- CLOUDS (visible from the very first frame, grow with the scroll) -----
  // side clouds: already in the sky, slowly swell outward
  const sideGrow = ease(range(p, 0, 0.85));
  const sideScale = 1 + sideGrow * 0.3;
  const sideOpacity = 1 - range(p, 0.8, 0.95);

  // front cloud bank: starts ALREADY peeking at the bottom, rises with the building
  const bankLow = ease(range(p, 0, 0.75));
  const bankLowY = 70 * (1 - bankLow); // 55% → 0%

  // thick final bank: rises and covers everything
  const bankHigh = ease(range(p, 0.55, 0.92));

  // fade to white
  const whiteOut = ease(range(p, 0.9, 1));

  return (
    // tall wrapper = scroll distance for the animation
    <div
  ref={wrapRef}
  className={`relative ${isMobile ? "h-[400vh]" : "h-[550vh]"}`}
>
      <section
        id="home"
className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#e9e8e3] text-[#171815]"
      >
        <style>{`
          @keyframes cloudDriftA { from { transform: translateX(-2.5%); } to { transform: translateX(2.5%); } }
          @keyframes cloudDriftB { from { transform: translateX(2%); } to { transform: translateX(-2%); } }
          .cloud-drift { animation: cloudDriftA 45s ease-in-out infinite alternate; }
          .cloud-drift-b { animation: cloudDriftB 38s ease-in-out infinite alternate; }
          @media (prefers-reduced-motion: reduce) { .cloud-drift, .cloud-drift-b { animation: none; } }

          @keyframes heroTitleReveal {
            from { transform: translateY(110%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes heroSupportReveal {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .hero-title-reveal {
            display: inline-block;
            animation: heroTitleReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
          }
          .hero-support-reveal {
            animation: heroSupportReveal 0.8s ease 0.45s both;
          }
        `}</style>

        {/* SKY: blue, warming to peach at the lower left */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 6% 95%, rgba(255,176,130,0.9) 0%, rgba(255,200,165,0.45) 45%, transparent 80%), linear-gradient(180deg, #8fb6dc 0%, #b6d0e6 45%, #dbe4ee 80%, #f1ded0 100%)",
          }}
        />

        {/* SIDE CLOUDS (behind the building): visible from the start, swell on scroll */}
        <div
          className="pointer-events-none absolute inset-0 z-[5] overflow-hidden will-change-transform"
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
            <div className="cloud-drift absolute -left-[6%] -right-[6%] bottom-0 top-0">
              <Clouds
                id="side"
                seed={14}
                freq="0.0035 0.0075"
                gain={3.4}
                offset={-1.5}
                blur={4}
              />
            </div>
            
          </div>
        </div>

        {/* NAVIGATION (always visible) */}
        {/* <header className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-6 md:px-12 lg:px-20">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            STUDIO CAVE<span className="text-[#8b927c]"></span>
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
            sign in
            <ArrowUpRight size={16} />
          </Link>
        </header> */}

        {/* BUILDING */}
    <img
  src={BUILDING}
  alt="Modern architectural building"
  className="pointer-events-none absolute left-1/2 z-10 max-w-none select-none will-change-transform"
 style={{
  width: isMobile ? "900px" : BUILDING_SETTINGS.width,
  bottom: isMobile ? "-18vh" : BUILDING_SETTINGS.bottom,
  transformOrigin: BUILDING_SETTINGS.origin,
  transform: `translate(-50%, ${
    isMobile ? -zoom * 45 : buildingY
  }vh) scale(${
    isMobile
      ? 0.85 + zoom * 0.2
      : buildingScale
  })`,
}}
/>

        {/* HEADLINE BLOCK */}
                {/* SMALL CLOUDS at the top edges of the heading (behind the text) */}
        <div
          aria-hidden="true"
         className="pointer-events-none absolute inset-0 z-[7] md:z-[9]"
          style={{
            opacity: 1 - textOut,
            transform: `translateY(${textMove * 60}px)`,
          }}
        >
          <div className="cloud-drift absolute -left-[0vw] top-[7%] h-[24vh] w-[30vw]">
            <Clouds
              id="hl"
              seed={31}
              freq="0.004 0.009"
              gain={3.2}
              offset={-1.0}
              blur={6}
              customMask={BLOB_MASK}
            />
          </div>
          <div className="cloud-drift-b absolute -right-[0vw] top-[9%] h-[26vh] w-[32vw]">
            <Clouds
              id="hr"
              seed={17}
              freq="0.004 0.009"
              gain={3.2}
              offset={-1.0}
              blur={6}
              customMask={BLOB_MASK}
            />
          </div>
          <div className="cloud-drift absolute right-[18vw] top-[3%] h-[14vh] w-[18vw]">
            <Clouds
              id="hs"
              seed={8}
              freq="0.006 0.013"
              gain={3.2}
              offset={-1.0}
              blur={5}
              customMask={BLOB_MASK}
            />
          </div>
        </div>
 
<div className="absolute inset-x-0 top-[19%] flex justify-center px-4 text-center md:top-[17%]">
  {/* MAIN HEADING */}
  <div
    className="relative z-[8] w-full max-w-none"
    style={{
      opacity: 1 - textOut,
      transform: `translateY(${textMove * 110}px)`,
    }}
  >
    {/* pb / -mb stop the reveal wrapper from clipping g, p, y */}
    <div className="overflow-hidden pb-[0.18em] -mb-[0.18em]">
   <h1 className="text-[clamp(2rem,8.2vw,90px)] font-extrabold leading-[1.08] tracking-[-0.045em] text-[#171815] md:leading-[1.02]">
        <span className="hero-title-reveal block">Designing Spaces.</span>
        <span
          className="hero-title-reveal block"
          style={{ animationDelay: "0.3s" }}
        >
          Building Experiences.
        </span>
      </h1>
    </div>
  </div>

  {/* SUBTITLE */}
  <div
    className="pointer-events-auto absolute inset-x-0 top-full z-[8] px-6"
    style={{
      opacity: 1 - textOut,
      transform: `translateY(${textMove * 110}px)`,
      pointerEvents: textOut > 0.6 ? "none" : "auto",
    }}
  >
<div className="hero-support-reveal">
  <p className="mx-auto mt-5 max-w-3xl text-[14px] font-medium leading-6 sm:text-base md:mt-9 md:text-xl md:leading-8">
    <span className="font-semibold text-[#252923]">
      Transforming ideas into exceptional spaces
    </span>{" "}
    <span className="font-medium text-[#78858A]">
      through architecture, interior design, construction and turnkey solutions.
    </span>
  </p>
  <div className="mt-5 flex justify-center">
  <Link
    href="/properties"
   className="inline-flex items-center gap-2 rounded-full bg-[#171815] px-5 py-3 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#45483d] hover:scale-105 md:gap-3 md:px-6 md:text-sm"
  >
    Find Properties
    <ArrowUpRight size={15} />
  </Link>
</div>
</div>
  </div>
</div>

        {/* ============================================================ */}
        {/* LETTER WINDOW (sky + clouds with "STUDIO CAVE" cut out)      */}
        {/* The wrapper div fades (cheap) — the SVG inside never changes, */}
        {/* so the cloud filter is not re-drawn on every scroll frame.   */}
        {/* ============================================================ */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[22] will-change-[opacity]"
          style={{ opacity: windowIn }}
        >
          <svg
  viewBox="0 0 1440 800"
  preserveAspectRatio="xMidYMid slice"
  style={{
    overflow: "visible",
  }}
            className="absolute inset-0 h-full w-full"
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

              {/* same soft clouds as the side clouds */}
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
                  baseFrequency="0.0035 0.0075"
                  numOctaves="5"
                  seed="14"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 3.4 -1.5"
                />
                <feGaussianBlur stdDeviation="4" />
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

                <g
  transform={
    isMobile
      ? "translate(720 400) scale(0.35) translate(-720 -470)"
      : undefined
  }
>
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
                </g>
              </mask>
            </defs>

            <g mask="url(#win-mask)">
              <rect width="1440" height="800" fill="url(#win-sky)" />
              <rect width="1440" height="800" fill="url(#win-glow)" />
              <rect
                width="1440"
                height="800"
                filter="url(#win-clouds)"
                opacity="0.9"
              />
            </g>
          </svg>
        </div>

        {/* OUTLINE of the letters: draws outward from the centre */}
            {/* OUTLINE of the letters: every letter is drawn on its own, in its own direction */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 800"
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute inset-0 z-[23] h-full w-full"
        >
          <defs>
            {BRAND_TEXT.split("").map((ch, i) => {
              if (ch === " ") return null;
              const t = ease(
                range(revealRaw, LETTER_START[i], LETTER_START[i] + LETTER_DUR)
              );
              const r = letterRect(letterBoxes[i], LETTER_DIR[i], t);
              return (
                <clipPath key={i} id={`letter-clip-${i}`}>
                  <rect x={r.x} y={r.y} width={r.width} height={r.height} />
                </clipPath>
              );
            })}

            {/* subtitle: draws left → right after the big letters */}
            <clipPath id="sub-clip">
              <rect
                x={BRAND.x - SUB.textLength / 2 - 6}
                y={SUB.y - SUB.fontSize}
                width={(SUB.textLength + 12) * ease(range(revealRaw, 0.6, 1))}
                height={SUB.fontSize * 1.6}
              />
            </clipPath>
          </defs>

     <g
  transform={
    isMobile
  ? `translate(720 400) scale(0.25) translate(-720 -470)`
      : undefined
  }
  style={{
    transform: isMobile
      ? undefined
      : `scale(${1.05 - reveal * 0.05})`,
    transformOrigin: "720px 440px",
  }}
>
            {/* invisible copy, only used to measure each letter */}
            <text
              ref={measureRef}
              x={BRAND.x}
              y={BRAND.y}
              textAnchor="middle"
              fontSize={BRAND.fontSize}
              fontWeight={800}
              textLength={BRAND.textLength}
              lengthAdjust="spacingAndGlyphs"
              fill="none"
              opacity={0}
              style={{ fontFamily: "inherit" }}
            >
              {BRAND_TEXT}
            </text>

            {/* one clipped outline copy per letter */}
            {BRAND_TEXT.split("").map((ch, i) =>
              ch === " " ? null : (
                <g key={i} clipPath={`url(#letter-clip-${i})`}>
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
                    {BRAND_TEXT}
                  </text>
                </g>
              )
            )}

            <g clipPath="url(#sub-clip)">
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
                style={{ fontFamily: "inherit" }}
              >
                ARCHITECTURE · INTERIORS · CONSTRUCTION
              </text>
            </g>
          </g>
        </svg>

        {/* FRONT CLOUD BANK — already peeking from the first frame, rises over the building */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[28] h-[50vh] will-change-transform"
          style={{ transform: `translateY(${bankLowY}%)` }}
        >
          <div className="cloud-drift-b absolute -left-[4%] -right-[4%] inset-y-0">
            <Clouds
              id="banklow"
              seed={9}
              freq="0.0032 0.0065"
              gain={4}
              offset={-1.55}
              blur={5}
              shade
              fadeTop
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-white via-white/85 to-transparent" />
        </div>

        {/* THICK FINAL BANK — rises later and covers everything */}
                {/* TWO MORE BOTTOM CLOUDS — same position as the front bank, different shapes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[28] h-[50vh] will-change-transform"
          style={{ transform: `translateY(${bankLowY}%)` }}
        >
          <div className="cloud-drift absolute -left-[4%] -right-[4%] inset-y-0">
            <Clouds
              id="bankextra1"
              seed={17}
              freq="0.0036 0.0072"
              gain={3.6}
              offset={-1.5}
              blur={6}
              fadeTop
              softSides
            />
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[28] h-[50vh] will-change-transform"
          style={{ transform: `translateY(${bankLowY}%)` }}
        >
          <div className="cloud-drift-b absolute -left-[4%] -right-[4%] inset-y-0">
            <Clouds
              id="bankextra2"
              seed={23}
              freq="0.0028 0.0058"
              gain={3.6}
              offset={-1.45}
              blur={6}
              fadeTop
              softSides
            />
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[115vh] will-change-transform"
          style={{ transform: `translateY(${(1 - bankHigh) * 100}%)` }}
        >
          <Clouds
            id="bankhigh"
            seed={4}
            freq="0.0032 0.0065"
            gain={4}
            offset={-1.45}
            blur={5}
            shade
            fadeTop
          />
          <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-white via-white to-transparent" />
        </div>

        {/* CAPTIONS (fade out first) */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex items-center justify-between px-6 text-xs text-[#171815] md:bottom-8 md:px-12 lg:px-20"
          style={{ opacity: 1 - range(p, 0, 0.12) }}
        >
         
     
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