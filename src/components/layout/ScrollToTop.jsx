import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  // Route change → scroll page to top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [pathname]);

  // Show button only after some scroll
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollTop}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{
            duration: 0.35,
            ease: "easeOut"
          }}
          whileHover={{
            scale: 1.08,
            y: -2
          }}
          whileTap={{
            scale: 0.96
          }}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[999] group"
          aria-label="Scroll to top"
        >
          {/* Outer Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#8369f3]/30 to-[#81d2e6]/30 blur-xl opacity-70 group-hover:opacity-100 transition duration-300" />

          {/* Button */}
          <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-xl flex items-center justify-center shadow-[0_0_20px_rgba(131,105,243,0.18)] group-hover:shadow-[0_0_30px_rgba(129,210,230,0.28)] transition-all duration-300">
            <ChevronUp
              size={22}
              className="text-white/85 group-hover:text-white transition duration-300"
            />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}