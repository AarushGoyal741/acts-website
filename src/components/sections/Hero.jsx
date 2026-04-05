import { motion } from "framer-motion";
import { useReveal } from "../../context/RevealContext";
import actsLogo from "../../assets/logos/Acts-logo(figmafinal2)_20260115_135241_0000.png";

export default function Hero() {
  const revealDone = useReveal();

  const lineVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">

      {/* HERO CONTENT */}
      <div className="relative z-10 flex items-center min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-32 w-full">
          <div className="flex flex-col-reverse md:flex-row items-center gap-20">

            {/* TEXT */}
            <motion.div
              data-bird-target
              initial="hidden"
              animate={revealDone ? "visible" : "hidden"}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.15
                  }
                }
              }}
              className="w-full md:w-1/2 text-center md:text-left"
            >
              <h1 className="font-display font-extrabold tracking-tight leading-none text-[clamp(2.8rem,6vw,5rem)] sm:text-[clamp(3.2rem,7vw,6rem)] md:text-[clamp(3.8rem,7.5vw,7rem)] lg:text-[clamp(4.5rem,6vw,16rem)]">

                <motion.span
                  variants={lineVariant}
                  className="block py-4 -mb-12 text-white/90"
                >
                  Association of
                </motion.span>

                <motion.span
                  variants={lineVariant}
                  className="block py-8 -mb-12 bg-gradient-to-r from-[#8369f3] to-[#81d2e6] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(129,210,230,0.35)]"
                >
                  Computing Technology
                </motion.span>

                <motion.span
                  variants={lineVariant}
                  className="block py-4 text-white/90"
                >
                  and Science
                </motion.span>

              </h1>
            </motion.div>

            {/* LOGO */}
            <motion.div
              data-bird-target
              className="w-full md:w-1/2 flex justify-center"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={
                revealDone
                  ? {
                      opacity: 1,
                      y: [0, -10, 0],
                      scale: [1, 1.02, 1]
                    }
                  : {
                      opacity: 0,
                      y: 40,
                      scale: 0.95
                    }
              }
              transition={{
                opacity: { duration: 0.7, ease: "easeOut", delay: 0.2 },
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                scale: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <div className="relative w-64 sm:w-72 md:w-80 lg:w-96 aspect-square">

                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#8369f3]/30 to-[#81d2e6]/30 blur-3xl opacity-50" />

                {/* Logo */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={actsLogo}
                    alt="ACTS Logo"
                    className="w-4/5 h-4/5 object-contain"
                  />
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealDone ? 1 : 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 1.6,
            repeat: Infinity
          }}
          className="w-6 h-10 border border-white/30 rounded-full flex justify-center"
        >
          <div className="w-1 h-2 bg-white/60 rounded-full mt-2" />
        </motion.div>
      </motion.div>

    </section>
  );
}