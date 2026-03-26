  import { useState } from "react";
import GlassSurface from "../ui/GlassSurface";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Team", href: "#team" },
  { label: "Events", href: "#events" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ revealDone }) {
  const [open, setOpen] = useState(false);

  return (
    <AnimatePresence>
      {revealDone && (
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50"
        >
          <GlassSurface
            width="auto"
            height="auto"
            borderRadius={26}
            blur={14}
            brightness={55}
            className="pointer-events-auto"
          >
            <div className="w-[92vw] max-w-6xl px-6 py-2.5">
              <div className="flex items-center w-full text-white">

                <div className="shrink-0 font-display font-bold tracking-widest text-[16px] px-3">
                  ACTS
                </div>

                <div className="flex-1 md:hidden" />

                <div className="flex-1 hidden md:flex justify-center">
                  <div className="w-[70%] max-w-[680px] flex justify-between text-[14px] font-medium">
                    {NAV_LINKS.map(link => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="relative text-[16px] font-medium tracking-wide text-white/80 transition-all duration-300 hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-white/70 after:transition-all after:duration-300 hover:after:w-full"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>

                <button
                  className="shrink-0 md:hidden flex flex-col gap-[5px] px-3"
                  onClick={() => setOpen(v => !v)}
                >
                  <span className="w-5 h-[2px] bg-white" />
                  <span className="w-5 h-[2px] bg-white" />
                  <span className="w-5 h-[2px] bg-white" />
                </button>
              </div>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -6 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                    className="md:hidden overflow-hidden"
                  >
                    <div className="mt-4 flex flex-col gap-4 text-white text-sm px-1">
                      {NAV_LINKS.map(link => (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="opacity-80 hover:opacity-100 transition"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </GlassSurface>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}