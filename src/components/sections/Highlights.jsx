import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useReveal } from "../../context/RevealContext";
import DomeGallery from "../ui/DomeGallery";

import img1 from "../../assets/images/img1.png";
import img2 from "../../assets/images/img2.png";
import img3 from "../../assets/images/img3.png";
import img4 from "../../assets/images/img4.png";
import img5 from "../../assets/images/img5.png";

const Icon = ({ size = 13, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const GradIcon = ({ id, children }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#e879f9"/><stop offset="100%" stopColor="#7c3aed"/>
      </linearGradient>
    </defs>
    {children}
  </svg>
);

const Sparkle = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="#a855f7" aria-hidden>
    <path d="M7 0L8.2 5.8L14 7L8.2 8.2L7 14L5.8 8.2L0 7L5.8 5.8L7 0Z"/>
  </svg>
);

const tags = [
  { label: "Hackathons", icon: <Icon><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Icon> },
  { label: "Talks",      icon: <Icon><path d="M12 2a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></Icon> },
  { label: "Projects",   icon: <Icon><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></Icon> },
  { label: "Culture",    icon: <Icon><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon> },
];

const stats = [
  { value: "100+",      label: "Events Captured", icon: <GradIcon id="g1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="url(#g1)"/></GradIcon> },
  { value: "5000+",     label: "Participants",     icon: <GradIcon id="g2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="url(#g2)"/><circle cx="9" cy="7" r="4" stroke="url(#g2)"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="url(#g2)"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="url(#g2)"/></GradIcon> },
  { value: "2022–2025", label: "Our Journey",      icon: <GradIcon id="g3"><rect x="3" y="4" width="18" height="18" rx="2" stroke="url(#g3)"/><line x1="16" y1="2" x2="16" y2="6" stroke="url(#g3)"/><line x1="8" y1="2" x2="8" y2="6" stroke="url(#g3)"/><line x1="3" y1="10" x2="21" y2="10" stroke="url(#g3)"/></GradIcon> },
];

// ── Images ────────────────────────────────────────────────────────────────────
// img1–img5: local assets
// img6–img10: Unsplash placeholders — when you have the real files, replace each
//   URL with:  import img6 from "../../assets/images/img6.png"  etc.
const images = [
  { src: img1,                                                                       alt: "ACTS Event" },
  { src: img2,                                                                       alt: "Workshop" },
  { src: img3,                                                                       alt: "Hackathon" },
  { src: img4,                                                                       alt: "Team Activity" },
  { src: img5,                                                                       alt: "Seminar" },
  { src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80", alt: "Tech Talk" },
  { src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80", alt: "Collaboration" },
  { src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80", alt: "Presentation" },
  { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80", alt: "Team Meeting" },
  { src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80", alt: "Workshop Session" },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function Highlights({ revealKey }) {
  const revealDone = useReveal();
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const [on, setOn] = useState(false);

  useEffect(() => { setOn(false); }, [revealKey]);
  useEffect(() => { if (revealDone && isInView) setOn(true); }, [revealDone, isInView]);

  const anim = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: on ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.7, delay },
  });

  return (
    <section id="highlights" ref={ref} className="relative w-full overflow-hidden mt-20">

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-purple-700/10 sm:bg-purple-700/25 blur-[180px] rounded-full" />
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/8 sm:bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-violet-500/8 sm:bg-violet-500/20 blur-[140px] rounded-full" />
        {[["8%","12%"],["15%","80%"],["30%","5%"],["45%","90%"],["22%","55%"],["60%","20%"]].map(([top,left],i) => (
          <div key={i} style={{top,left}} className="absolute w-1 h-1 bg-purple-300/40 rounded-full" />
        ))}
      </div>

      <motion.div {...anim(0)} className="relative z-10 text-center px-6 pt-16 pb-0">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkle />
          <p className="text-purple-300/80 tracking-[0.3em] text-sm uppercase">Capturing Our Journey</p>
          <Sparkle />
        </div>

        <h2 className="font-display font-black tracking-tight" style={{
          fontSize: "clamp(4rem,10vw,7rem)",
          background: "linear-gradient(180deg,#e0d0ff 0%,#c084fc 40%,#9333ea 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          filter: "drop-shadow(0 0 40px rgba(168,85,247,0.55))",
        }}>HIGHLIGHTS</h2>

        <div className="relative mt-5 h-[2px] w-48 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400 blur-sm" />
        </div>

        <p className="mt-6 text-white/60 max-w-md mx-auto text-base leading-relaxed">
          Moments that define innovation, collaboration,<br />and growth at ACTS
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {tags.map((t, i) => (
            <motion.div key={t.label} {...anim(0.3 + i * 0.08)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/15 text-sm text-white/80 hover:border-purple-400/60 hover:bg-purple-500/15 transition-all duration-300 cursor-default">
              <span className="text-purple-300/90">{t.icon}</span>{t.label}
            </motion.div>
          ))}
        </div>

        <motion.div {...anim(0.9)} className="mt-12 max-w-2xl mx-auto">
          <div className="flex items-stretch rounded-2xl overflow-hidden" style={{
            background: "linear-gradient(135deg,rgba(109,40,217,0.18),rgba(88,28,135,0.10))",
            border: "1px solid rgba(168,85,247,0.25)",
            boxShadow: "0 0 40px rgba(109,40,217,0.15),inset 0 1px 0 rgba(255,255,255,0.07)",
          }}>
            {stats.map((s, i) => (
              <div key={i} className="flex-1 flex items-center gap-3 px-5 py-5 hover:bg-purple-500/10 transition-colors duration-300"
                style={i < 2 ? { borderRight: "1px solid rgba(168,85,247,0.18)" } : {}}>
                <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{
                  background: "linear-gradient(135deg,rgba(168,85,247,0.20),rgba(109,40,217,0.12))",
                  border: "1px solid rgba(168,85,247,0.30)", boxShadow: "0 0 14px rgba(168,85,247,0.20)",
                }}>{s.icon}</div>
                <div className="text-left">
                  <p className="font-bold text-[1.05rem] leading-tight" style={{
                    background: "linear-gradient(90deg,#e9d5ff,#c084fc)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>{s.value}</p>
                  <p className="text-xs text-white/45 mt-0.5 tracking-wide">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <div className="relative z-10">
        <div className="absolute inset-0 pointer-events-none sm:block" style={{
          background: "radial-gradient(ellipse 65% 80% at 50% 30%,rgba(124,58,237,0.20),rgba(88,28,135,0.10) 50%,transparent 80%)",
          filter: "blur(12px)",
        }} />
        <div className="absolute inset-0 pointer-events-none hidden sm:block" style={{
          background: "radial-gradient(ellipse 65% 80% at 50% 30%,rgba(124,58,237,0.18),transparent 80%)",
          filter: "blur(12px)",
        }} />
        <motion.div {...anim(1.0)} className="relative text-center pt-14 pb-8 px-4">
          <p className="font-black select-none pointer-events-none" style={{
            fontSize: "clamp(3.5rem,10vw,6.5rem)", letterSpacing: "0.22em",
            background: "linear-gradient(180deg,rgba(192,132,252,0.55),rgba(139,92,246,0.30) 50%,rgba(88,28,135,0.10))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            filter: "drop-shadow(0 0 28px rgba(168,85,247,0.40)) drop-shadow(0 0 8px rgba(168,85,247,0.25))",
          }}>MEMORIES</p>
          <div className="flex items-center justify-center gap-3 -mt-4">
            <Sparkle />
            <p className="text-white/50 text-sm tracking-wider">A collection of unforgettable moments</p>
            <Sparkle />
          </div>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none"
          style={{ background: "linear-gradient(to bottom,transparent,rgba(0,0,0,0.40) 60%,rgba(0,0,0,0.65))" }} />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={on ? { opacity: 1 } : {}} transition={{ duration: 1.2, delay: 0.3 }}
        className="relative w-full min-h-[55vh] sm:min-h-[60vh] md:min-h-[100vh]">
        {[
          { top:0, left:0, right:0, height:"22%", background:"linear-gradient(to bottom,rgba(0,0,0,0.60),rgba(0,0,0,0.30) 40%,transparent)" },
          { top:0, left:0, right:0, height:"30%", background:"radial-gradient(ellipse 80% 60% at 50% 0%,rgba(88,28,135,0.18),transparent 70%)" },
          { top:0, bottom:0, left:0, width:"14%", background:"linear-gradient(to right,rgba(0,0,0,0.75),transparent)" },
          { top:0, bottom:0, right:0, width:"14%", background:"linear-gradient(to left,rgba(0,0,0,0.75),transparent)" },
        ].map((style, i) => (
          <div key={i} className="absolute z-10 pointer-events-none" style={style} />
        ))}
        <div className="absolute inset-0">
          <DomeGallery images={images} fit={1.2} minRadius={1050} maxVerticalRotationDeg={10}
            segments={30} dragDampening={2} grayscale={false} overlayBlurColor="rgba(0,0,0,0.8)" />
        </div>
      </motion.div>

    </section>
  );
}