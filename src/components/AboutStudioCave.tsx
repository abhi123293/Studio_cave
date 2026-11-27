
import { Clouds } from "@/components/Hero";

export default function AboutStudioCave() {
  return (
<section
  id="about"
className="relative z-40 -mt-[65vh] w-full overflow-hidden bg-transparent text-[#171815]"
>
      {/* Cloud transition at the beginning of About */}
    {/* <div className="pointer-events-none absolute inset-x-0 top-0 h-[120px] overflow-hidden">
        <Clouds
          id="about-cloud"
          seed={4}
          freq="0.0032 0.0065"
          gain={4}
          offset={-1.45}
          blur={5}
          shade
          fadeTop
        />

        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-b from-transparent to-white" />
      </div> */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-x-0 top-[35vh] bottom-0 bg-white"
/>
      {/* About content */}
<div className="relative z-10 mx-auto max-w-[1320px] px-6 pb-24 pt-0 md:px-12 md:pb-32 lg:px-20">

        <p className="mb-8 text-xs font-semibold tracking-[0.2em] text-[#85877D]">
          03.3 — ABOUT STUDIO CAVE
        </p>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-end">

          <h2 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] md:text-6xl lg:text-7xl">
            Creating Spaces.
            <span className="block text-[#92958A]">
              Shaping Experiences.
            </span>
          </h2>

          <p className="max-w-xl text-base leading-8 text-[#686A62] md:ml-auto md:text-lg">
            Studio Cave brings together architectural creativity,
            construction expertise, and thoughtful planning to create
            spaces that balance aesthetics, quality, and functionality.
            Every project is approached with attention to detail,
            purposeful design, and a commitment to careful execution.
          </p>

        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">

          <div className="relative min-h-[350px] overflow-hidden bg-[#E9E8E3] md:min-h-[520px]">
            <div className="absolute inset-0 flex items-center justify-center text-sm text-[#85877D]">
              Architecture Image
            </div>
          </div>

          <div className="flex flex-col justify-between gap-10 py-4 md:py-10">

            <div>
              <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-[#85877D]">
                OUR PHILOSOPHY
              </p>
              <h3 className="mb-4 text-2xl font-medium tracking-tight md:text-3xl">
                Design With Purpose.
              </h3>
              <p className="max-w-lg leading-7 text-[#686A62]">
                We believe architecture should be more than visually
                appealing. It should respond to people's needs,
                complement its surroundings, and make everyday
                experiences better.
              </p>
            </div>

            <div>
              <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-[#85877D]">
                FROM CONCEPT TO CREATION
              </p>
              <h3 className="mb-4 text-2xl font-medium tracking-tight md:text-3xl">
                Built With Precision.
              </h3>
              <p className="max-w-lg leading-7 text-[#686A62]">
                Through thoughtful planning, architectural expertise,
                and careful project execution, we focus on delivering
                spaces that are functional, durable, and timeless.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
