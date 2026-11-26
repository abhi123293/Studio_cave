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
/* ---------- Realistic clouds (SVG turbulence, no image needed) ---------- */
function Clouds({
  id,
  seed = 11,
  gain = 2.6,
  offset = -0.95,
  freq = "0.0045 0.009",
  fadeTop = true,
  className = "",
}: {
  id: string;
  seed?: number;
  gain?: number; // higher = thicker clouds
  offset?: number; // lower = fewer clouds
  freq?: string; // smaller numbers = bigger clouds
  fadeTop?: boolean;
  className?: string;
}) {
  // soft fade on the top edge (CSS mask = never shows a hard line)
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
            result="n"
          />
          <feColorMatrix
            in="n"
            type="matrix"
            values={`0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${gain} ${offset}`}
          />
        </filter>
      </defs>

      <rect width="1440" height="800" filter={`url(#${id}-f)`} />
    </svg>
  );
}
export default function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0); // overall scroll progress 0 → 1

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      setP(clamp(-rect.top / total));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ---------- animation timeline ---------- */
  // 1) building zooms toward the viewer
// 1) Building starts low, then zooms upward
const zoom = ease(range(p, 0, 0.5));

const buildingScale = 1 + zoom * 2.2;

// Moves upward as the image scales
const buildingY = -zoom * 22; // vh

const buildingOpacity = 1 - range(p, 0.5, 0.68);

  // 2) original headline block fades out
  const textOut = ease(range(p, 0, 0.2));

  // 3) outlined brand text fades in, then out
  const outlineIn = ease(range(p, 0.2, 0.42)) * (1 - range(p, 0.68, 0.78));

  // 4) building shows only inside the letters
  const clipIn = ease(range(p, 0.48, 0.64)) * (1 - range(p, 0.84, 0.94));

  // 5) clouds rise from the bottom
  const cloudRise = ease(range(p, 0.25, 0.8));

  // 6) fade to white
  const whiteOut = ease(range(p, 0.82, 1));

  return (
    // tall wrapper = scroll distance for the animation
    <div ref={wrapRef} className="relative h-[420vh]">
      <section
        id="home"
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#e9e8e3] text-[#171815]"
      >
     
{/* SKY BACKGROUND */}
<div
  className="absolute inset-0"
  style={{
    backgroundColor: "#a9c4d2",
    backgroundImage: `
      radial-gradient(ellipse 45% 20% at 15% 28%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 45%, transparent 100%),
      radial-gradient(ellipse 38% 18% at 42% 20%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 55%, transparent 100%),
      radial-gradient(ellipse 48% 24% at 85% 32%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 50%, transparent 100%),
      radial-gradient(ellipse 55% 22% at 55% 55%, rgba(255,255,255,0.65) 0%, transparent 100%),
      linear-gradient(180deg, #91b3c5 0%, #c4d8e0 55%, #e6e9e7 100%)
    `,
  }}
/>

{/* CLOUD LAYER — BEHIND THE BUILDING */}
<div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
  {/* Left cloud formation */}
  <div className="absolute left-[-12%] top-[28%] h-44 w-[55vw] rounded-full bg-white/80 blur-[45px]" />

  {/* Center cloud formation */}
  <div className="absolute left-[20%] top-[38%] h-48 w-[60vw] rounded-full bg-white/75 blur-[55px]" />

  {/* Right cloud formation */}
  <div className="absolute right-[-15%] top-[25%] h-52 w-[55vw] rounded-full bg-white/85 blur-[50px]" />

  {/* Lower cloud formation */}
  <div className="absolute bottom-[5%] left-[5%] h-40 w-[90vw] rounded-full bg-white/65 blur-[55px]" />
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

        {/* BUILDING (zooms in, then fades) */}
    
<img
  src={BUILDING}
  alt="Modern architectural building"
  className="pointer-events-none absolute -bottom-[22vh] left-1/2 z-10 w-[110vw] max-w-none select-none will-change-transform md:w-[105vw] lg:w-[1500px]"
  style={{
    transformOrigin: "50% 75%",
    transform: `translate(-50%, ${buildingY}vh) scale(${buildingScale})`,
    opacity: buildingOpacity,
  }}
/>


        {/* HEADLINE BLOCK (fades out on scroll) */}
     
{/* HEADLINE BLOCK — CENTERED */}
<div
  className="absolute inset-x-0 top-[16%] z-20 flex justify-center px-6 text-center md:top-[17%]"
  style={{
    opacity: 1 - textOut,
    transform: `translateY(${-textOut * 50}px)`,
    pointerEvents: textOut > 0.6 ? "none" : "auto",
  }}
>
  <div className="w-full max-w-5xl">
    <p className="mb-6 text-xs uppercase tracking-[0.3em] text-[#52656d]">
      Architecture · Interiors · Construction
    </p>

    <h1 className="text-5xl font-medium leading-[1.05] tracking-[-0.055em] sm:text-6xl md:text-8xl lg:text-[110px]">
      Spaces That
      <br />
      Move You<span className="text-[#8b927c]">.</span>
    </h1>

    <p className="mx-auto mt-7 max-w-md text-base leading-7 text-[#52656d] md:text-lg">
      Thoughtfully designed spaces. Meaningful experiences.
      Built around the way you live.
    </p>

    <Link
      href="#projects"
      className="mx-auto mt-7 flex w-fit items-center gap-3 rounded-full border border-[#171815]/30 px-6 py-4 text-sm transition hover:bg-[#171815] hover:text-white"
    >
      Explore Our Work
      <ArrowUpRight size={17} />
    </Link>
  </div>
</div>


        {/* OUTLINED BRAND TEXT (building seen through it) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center"
          style={{
            opacity: outlineIn,
            transform: `scale(${0.94 + outlineIn * 0.06})`,
          }}
        >
          <span
            className="whitespace-nowrap font-semibold uppercase leading-none tracking-[-0.06em] text-transparent"
            style={{
              fontSize: "clamp(3.4rem, 15vw, 15rem)",
              WebkitTextStroke: "2px rgba(255,255,255,0.95)",
            }}
          >
            Studio Cave
          </span>
          <span
            className="mt-3 text-[clamp(1rem,3vw,2.6rem)] font-light tracking-[0.2em] text-transparent"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.9)" }}
          >
            Architecture · Interiors · Construction
          </span>
        </div>

        {/* BUILDING INSIDE THE LETTERS (mask reveal) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center"
          style={{ opacity: clipIn }}
        >
          <span
            className="whitespace-nowrap font-semibold uppercase leading-none tracking-[-0.06em] text-transparent"
            style={{
              fontSize: "clamp(3.4rem, 15vw, 15rem)",
              backgroundImage: `url(${BUILDING})`,
              backgroundSize: "auto 230%",
              backgroundPosition: "50% 78%",
              backgroundRepeat: "no-repeat",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            Studio Cave
          </span>
          <span className="mt-3 text-[clamp(1rem,3vw,2.6rem)] font-medium tracking-[0.2em] text-[#171815]/80">
            Architecture · Interiors · Construction
          </span>
        </div>

        {/* CLOUDS RISING FROM THE BOTTOM */}
     {/* CLOUDS RISING FROM THE BOTTOM */}
<div
  aria-hidden="true"
 className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[110vh] will-change-transform"
  style={{ transform: `translateY(${(1 - cloudRise) * 100}%)` }}
>
  {/* thick cloud bank */}
  <Clouds
    id="bankclouds"
    seed={4}
    gain={3.4}
    offset={-0.9}
    freq="0.004 0.008"
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