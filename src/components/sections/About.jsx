import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import MagicBento from "../ui/MagicBento";





export default function About() {

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id ="about"
      ref={ref}
      className="relative py-16 px-6 w-full"
    >
        {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center text-5xl md:text-6xl font-bold mb-20"
      >
        ABOUT US
      </motion.h2>
      {/* Container */}
      <div className="max-w-7xl mx-auto w-full">

        

        {/* Bento Wrapper */}
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
  disableAnimations={false}
/>

        </div>

      </div>

    </section>
  );
}