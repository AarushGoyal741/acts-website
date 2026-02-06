import { useState } from "react";
import GlassSurface from "../ui/GlassSurface";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Team", href: "#team" },
  { label: "Events", href: "#events" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <GlassSurface
        width="auto"
        height="auto"
        borderRadius={26}
        blur={14}
        brightness={55}
        className="pointer-events-auto"
      >
        {/* Layout container */}
        <div className="w-[92vw] max-w-6xl px-6 py-2.5">
          <div className="flex items-center w-full text-white">

            {/* LOGO */}
            <div className="shrink-0 font-display font-bold tracking-widest text-[16px] px-3">
              ACTS
            </div>

            {/* SPACER (pushes hamburger to right on mobile) */}
            <div className="flex-1 md:hidden" />

            {/* DESKTOP LINKS */}
            <div className="flex-1 hidden md:flex justify-center">
                <div className="w-[70%] max-w-[680px] flex justify-between text-[14px] font-medium">
              {NAV_LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="
                    relative text-[16px] font-medium tracking-wide
                    text-white/80
                    transition-all duration-300
                    hover:text-white
                    after:absolute after:left-0 after:-bottom-1
                    after:h-[1px] after:w-0 after:bg-white/70
                    after:transition-all after:duration-300
                    hover:after:w-full
                  "
                >
                  {link.label}
                </a>
              ))}
              </div>
            </div>

            {/* MOBILE TOGGLE */}
            <button
              className="shrink-0 md:hidden flex flex-col gap-[5px] px-3 "
              onClick={() => setOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <span className="w-5 h-[2px] bg-white" />
              <span className="w-5 h-[2px] bg-white" />
              <span className="w-5 h-[2px] bg-white" />
            </button>
          </div>

          {/* MOBILE MENU */}
          {open && (
            <div className="mt-5 flex flex-col gap-4 text-white md:hidden">
              {NAV_LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium tracking-wide text-white/85 hover:text-white transition"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </GlassSurface>
    </nav>
  );
}
