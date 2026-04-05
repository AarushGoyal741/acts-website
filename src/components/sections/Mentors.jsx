import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useReveal } from "../../context/RevealContext";
import neeta_mam from '../../assets/team/neeta_mam_grp.png';
import amar_sir from '../../assets/team/amar_sir_grp.png';
import GradientText from '../ui/GradientText';

export default function Mentors({ revealKey }) {
  const revealDone = useReveal();
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    setShouldAnimate(false);
  }, [revealKey]);

  useEffect(() => {
    if (revealDone && isInView) setShouldAnimate(true);
  }, [revealDone, isInView]);

  return (
    <section id="mentors" ref={ref} className="relative w-full mt-20 overflow-hidden">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6"
      >
        <h2
          className="uppercase text-[clamp(2.5rem,5vw,4rem)] font-semibold tracking-tight flex justify-center items-baseline gap-3"
          style={{ fontFamily: "'Jura', sans-serif" }}
        >
          <span className="text-white">OUR</span>
          <span>
            <GradientText
              colors={["#5227FF", "#FF9FFC", "#B19EEF", "#5227FF"]}
              animationSpeed={1.5}
              showBorder={false}
            >
              MENTORS
            </GradientText>
          </span>
        </h2>
        <div className="mt-4 h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <p className="mt-6 text-white/60 max-w-xl mx-auto text-lg">
          Guidance from industry leaders and academic experts
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-16"
      >
        <div className="flex max-md:flex-col max-md:gap-8 justify-around items-center text-center">
          <div className="w-60 h-60 md:w-100 md:h-100 rounded-2xl bg-black/40 border-2 border-white">
            <img src={neeta_mam} alt="Neeta Mam" className="w-full h-full rounded-2xl object-cover" />
          </div>
          <div className="w-60 h-60 md:w-100 md:h-100 rounded-2xl bg-black/40 border-2 border-white">
            <img src={amar_sir} alt="Amar Sir" className="w-full h-full rounded-2xl object-cover" />
          </div>
        </div>
      </motion.div>

    </section>
  );
}