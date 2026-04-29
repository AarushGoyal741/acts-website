import { useState } from "react";
import { NavLink } from "react-router-dom";
import GlassSurface from "../ui/GlassSurface";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Highlights", href: "/highlights" },
  { label: "Team", href: "/team" },
  { label: "Events", href: "/events" },
  { label: "FAQ", href: "/faq" },
];

function NavItem({ href, label }) {
  const [hovered, setHovered] = useState(false);

  return (
    <NavLink
      to={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={({ isActive }) =>
        `relative flex flex-col items-center text-[16px] font-medium tracking-wide transition-all duration-300 ${
          isActive || hovered ? "text-white" : "text-white/80"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {label}
          <span
            style={{
              display: "block",
              height: "3px",
              backgroundColor: "rgba(255,255,255,0.7)",
              transition: "width 0.3s ease",
              width: isActive || hovered ? "100%" : "0%",
            }}
          />
        </>
      )}
    </NavLink>
  );
}

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
            ease: [0.22, 1, 0.36, 1],
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

                {/* Desktop links */}
                <div className="flex-1 hidden md:flex justify-center">
                  <div className="w-[70%] max-w-[680px] flex justify-between">
                    {NAV_LINKS.map(link => (
                      <NavItem key={link.href} href={link.href} label={link.label} />
                    ))}
                  </div>
                </div>

                {/* Hamburger */}
                <button
                  className="shrink-0 md:hidden flex flex-col gap-[5px] px-3"
                  onClick={() => setOpen(v => !v)}
                >
                  <span className="w-5 h-[2px] bg-white" />
                  <span className="w-5 h-[2px] bg-white" />
                  <span className="w-5 h-[2px] bg-white" />
                </button>
              </div>

              {/* Mobile dropdown */}
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
                        <NavLink
                          key={link.href}
                          to={link.href}
                          onClick={() => setOpen(false)}
                          className={({ isActive }) =>
                            isActive
                              ? "opacity-100 transition"
                              : "opacity-80 hover:opacity-100 transition"
                          }
                        >
                          {link.label}
                        </NavLink>
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