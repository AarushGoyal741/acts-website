import { motion } from "framer-motion";

export default function BlackReveal({ revealDone, setRevealDone }) {
  if (revealDone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-black"
      initial={{ x: "0%" }}
      animate={{ x: "100%" }}
      transition={{ duration: 3.6, ease: "easeInOut" }}
      onAnimationComplete={() => {
        setRevealDone(true);
      }}
    />
  );
}