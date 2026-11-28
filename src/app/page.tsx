
import Hero from "@/components/Hero";
import AboutStudioCave from "@/components/AboutStudioCave";
import Services from "@/components/Services";
import FeaturedVideo from "@/components/FeaturedVideo";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutStudioCave />
      <div
        className="relative z-40 w-full"
        style={{
          background:
            "radial-gradient(ellipse 60% 42% at 6% 52%, rgba(255,176,130,0.44) 0%, rgba(255,200,165,0.2) 45%, transparent 76%), radial-gradient(ellipse 56% 42% at 8% 92%, rgba(255,176,130,0.48) 0%, rgba(255,200,165,0.22) 46%, transparent 76%), linear-gradient(180deg, #e9e8e3 0%, #dbe4ee 24%, #b6d0e6 52%, #dbe4ee 78%, #f1ded0 100%)",
        }}
      >
        <Services />
        <FeaturedVideo />
      </div>
    </main>
  );
}
