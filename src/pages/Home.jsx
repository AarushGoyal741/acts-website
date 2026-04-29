import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Sponsors from "../components/sections/Sponsors";
import Particles from "../components/backgrounds/HomeParticles";

export default function Home() {
  return (
    <div className="relative">

      {/* Fixed background — only on this page */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0">
          <Particles
            particleColors={["#ffffff"]}
            particleCount={500}
            particleSpread={10}
            speed={0.6}
            particleBaseSize={150}
            moveParticlesOnHover
            alphaParticles={false}
            disableRotation
            pixelRatio={2}
            cameraDistance={14}
          />
        </div>
      </div>

      <Hero />
      <About />
      <Sponsors />

    </div>
  );
}