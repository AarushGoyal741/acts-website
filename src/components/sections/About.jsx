import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import MagicBento from "../ui/MagicBento";
import { useReveal } from "../../context/RevealContext";

export default function About({ revealKey }) {
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

  return (
    <section
      id="about"
      ref={ref}
      className="relative pt-16 px-6 w-full mt-20"
    >
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8 }}
        className="text-center text-5xl md:text-6xl font-bold mb-20"
      >
        ABOUT US
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-7xl mx-auto w-full"
      >
        <div className="w-full [&_.bento-section]:max-w-none [&_.bento-section]:w-full">
          <MagicBento
            textAutoHide={true}
            enableStars={false}
            enableSpotlight
            enableBorderGlow={true}
            enableTilt
            enableMagnetism={false}
            clickEffect
            spotlightRadius={570}
            particleCount={12}
            disableAnimations={!revealDone}
          />
        </div>
      </motion.div>
    </section>
  );
}