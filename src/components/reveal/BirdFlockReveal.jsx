import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import birdAnimation from "../../assets/birds.json";

const BIRD_COUNT = 14;

export default function BirdFlockReveal({ revealDone }) {
  const birdRefs = useRef([]);

  const birds = useRef(
    Array.from({ length: BIRD_COUNT }).map((_, i) => ({
      id: i,
      size: 140 + Math.random() * 50,
      y: (i / (BIRD_COUNT - 1)) * 100 + (Math.random() * 2 - 1),
      startFrame: Math.floor(Math.random() * 120),
      phase: Math.random() * Math.PI * 2,
      duration: 3.8 + Math.random() * 0.6
    }))
  );

  useEffect(() => {
    birdRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.setSpeed(0.65);
        ref.goToAndPlay(birds.current[i].startFrame, true);
      }
    });
  }, []);

  if (revealDone) return null;

  return (
    <div className="fixed inset-0 z-[70] pointer-events-none">
      {birds.current.map((bird, i) => (
        <motion.div
          key={bird.id}
          className="absolute"
          style={{
            top: `${bird.y}%`,
            left: "-12%",
            width: bird.size,
            height: bird.size
          }}
          initial={{ x: 0 }}
          animate={{ x: "130vw" }}
          transition={{
            duration: bird.duration,
            ease: "linear"
          }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3 + Math.random(),
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Lottie
              lottieRef={(el) => (birdRefs.current[i] = el)}
              animationData={birdAnimation}
              autoplay
              loop
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}