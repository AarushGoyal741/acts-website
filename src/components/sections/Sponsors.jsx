import { motion } from "framer-motion";
import { useReveal } from "../../context/RevealContext";
import OrbitImages from "../ui/OrbitImages";
import AUITS from "../../assets/sponsors/AUITS.png";
import balsamiq from "../../assets/sponsors/balsamiq.png";
import Bifrost from "../../assets/sponsors/Bifrost.png";
import CodeCrafters from "../../assets/sponsors/CodeCrafters.png";
import InterviewBuddy from "../../assets/sponsors/InterviewBuddy.png";
import Potpie from "../../assets/sponsors/Potpie.ai.png";
import RagaAI from "../../assets/sponsors/RagaAI.png";
import SprintDev from "../../assets/sponsors/SprintDev.png";
import Yocto from "../../assets/sponsors/Yocto.png";

import { useEffect, useState } from "react";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);

  return isMobile;
}

export default function Sponsors() {
  const revealDone = useReveal();
  const isMobile = useIsMobile();

  const sponsorImages = [
    AUITS,
    balsamiq,
    Bifrost,
    CodeCrafters,
    InterviewBuddy,
    Potpie,
    RagaAI,
    SprintDev,
    Yocto,
  ];

  return (
    <section
      id="sponsors"
      className="relative py-2 md:py-10 px-4 md:px-6 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={revealDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto relative"
      >
        <div className="relative h-[340px] md:h-[620px] flex items-center justify-center">
          {isMobile ? (
            // ── MOBILE: fixed pixel canvas, no responsive scaling ──
            <OrbitImages
              images={sponsorImages}
              shape="ellipse"
              baseWidth={360}
              radiusX={160}
              radiusY={60}
              rotation={-6}
              duration={18}
              itemSize={52}
              responsive={false}
              width={360}
              height={340}
              direction="normal"
              fill
              showPath
              paused={false}
              pathColor="rgba(255,255,255,0.08)"
              pathWidth={1.2}
              centerContent={
                <div className="relative z-20 text-center px-4">
                  <p className="text-white/60 text-[10px] uppercase tracking-[0.35em] mb-2">
                    Trusted By
                  </p>
                  <h2 className="text-2xl font-bold leading-tight">
                    Previous Sponsors
                    <br />
                    & Partners
                  </h2>
                  
                </div>
              }
            />
          ) : (
            // ── DESKTOP: original responsive behaviour ──
            <OrbitImages
              images={sponsorImages}
              shape="ellipse"
              radiusX={380}
              radiusY={135}
              rotation={-6}
              duration={18}
              itemSize={95}
              responsive={true}
              radius={140}
              direction="normal"
              fill
              showPath
              paused={false}
              pathColor="rgba(255,255,255,0.08)"
              pathWidth={1.2}
              centerContent={
                <div className="relative z-20 text-center px-4">
                  <p className="text-white/60 text-sm uppercase tracking-[0.35em] mb-4">
                    Trusted By
                  </p>
                  <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                    Previous Sponsors
                    <br />
                    & Partners
                  </h2>
                  
                </div>
              }
            />
          )}
        </div>
      </motion.div>
    </section>
  );
}