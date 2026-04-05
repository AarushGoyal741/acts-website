import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useReveal } from "../../context/RevealContext";

export default function Contact({ revealKey }) {
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
    <section id="contact" ref={ref} className="relative min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-5xl md:text-6xl font-bold mb-6">CONTACT US</h2>
        <p className="text-white/60 text-lg">Contact section coming soon...</p>
      </motion.div>
    </section>
  );
}