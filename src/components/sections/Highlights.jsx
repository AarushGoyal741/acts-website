import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useReveal } from "../../context/RevealContext";
import DomeGallery from "../ui/DomeGallery";

import img1 from "../../assets/images/img1.png";
import img2 from "../../assets/images/img2.png";
import img3 from "../../assets/images/img3.png";
import img4 from "../../assets/images/img4.png";
import img5 from "../../assets/images/img5.png";

export default function Highlights({ revealKey }) {
  const revealDone = useReveal();
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    setShouldAnimate(false);
  }, [revealKey]);

  useEffect(() => {
    if (revealDone && isInView) {
      setShouldAnimate(true);
    }
  }, [revealDone, isInView]);

  const images = [
    { src: img1, alt: "ACTS Event" },
    { src: img2, alt: "Workshop" },
    { src: img3, alt: "Hackathon" },
    { src: img4, alt: "Team Activity" },
    { src: img5, alt: "Seminar" }
  ];

  return (
    <section
      id="highlights"
      ref={ref}
      className="relative w-full py-5 overflow-hidden"
    >

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center mb-16 px-6"
      >
        <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold tracking-tight">
          Highlights
        </h2>

        <div className="mt-4 h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <p className="mt-6 text-white/60 max-w-xl mx-auto text-lg">
          Moments that define innovation, collaboration, and growth at ACTS
        </p>
      </motion.div>

      {/* Dome */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative w-full min-h-[55vh] sm:min-h-[60vh] md:min-h-[100vh]"
      >
        <div className="absolute inset-0">
          <DomeGallery
            images={images}
            fit={1.2}
            minRadius={1050}
            maxVerticalRotationDeg={10}
            segments={30}
            dragDampening={2}
            grayscale={false}
            overlayBlurColor="rgba(0,0,0,0.8)"
          />
        </div>
      </motion.div>

    </section>
  );
}