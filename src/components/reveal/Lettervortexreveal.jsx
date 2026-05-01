import { useEffect, useRef } from "react";
import gsap from "gsap";

// Load Jura from Google Fonts
const _juraLink = (() => {
  if (typeof document !== "undefined" && !document.getElementById("jura-font")) {
    const l = document.createElement("link");
    l.id   = "jura-font";
    l.rel  = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Jura:wght@400;500;600;700&display=swap";
    document.head.appendChild(l);
  }
})();

// ─── ORBIT CONFIG ─────────────────────────────────────────────────────────────
// Each orbit: { r: radius, word: text, startOffset%, startTextLength }
const ORBITS = [
  { r: 775, word: "INNOVATE",  startOffset: 30, startTextLength: 300 },
  { r: 700, word: "CONNECT",   startOffset: 31, startTextLength: 280 },
  { r: 625, word: "CREATE",    startOffset: 33, startTextLength: 240 },
  { r: 550, word: "EXPLORE",   startOffset: 32, startTextLength: 260 },
  { r: 475, word: "LEARN",     startOffset: 30, startTextLength: 290 },
  { r: 400, word: "BUILD",     startOffset: 31, startTextLength: 200 },
  { r: 325, word: "GROW",      startOffset: 33, startTextLength: 210 },
  { r: 250, word: "ACTS",      startOffset: 32, startTextLength: 190 },
];

const TARGET_TEXT_LENGTHS = [4000, 3500, 3250, 3000, 2500, 2000, 1500, 1250];
const MAX_ORBIT_RADIUS    = ORBITS[0].r;
const MAX_ANIM_DURATION   = 1.25;
const MIN_ANIM_DURATION   = 1.0;

// Build the repeated SVG circle path string that GSAP's textPath follows
// Repeated 3× so textLength expansion never runs out of path
function makeOrbitPath(cx, cy, r) {
  // Arc from top, going clockwise, repeated 3×
  const x0 = cx;
  const y0 = cy - r;
  const x1 = cx;
  const y1 = cy + r;
  const seg = `M ${x0},${y0} A ${r},${r} 0 0,1 ${x1},${y1} A ${r},${r} 0 0,1 ${x0},${y0}`;
  return `${seg} ${seg} ${seg} M ${x0 - 0.01},${y0}`;
}
// ─────────────────────────────────────────────────────────────────────────────

export default function LetterVortexReveal({ setRevealDone }) {
  const wrapRef  = useRef(null);
  const svgRef   = useRef(null);
  const countRef = useRef(null);
  const tpRefs   = useRef([]);   // textPath DOM refs
  const ctx      = useRef([]);   // gsap context

  useEffect(() => {
    const wrap    = wrapRef.current;
    const svg     = svgRef.current;
    const counter = countRef.current;
    const tps     = tpRefs.current;
    if (!wrap || !svg || !tps.length) return;

    // Get all .orbit-text <text> elements (for opacity stagger)
    const orbitTexts         = svg.querySelectorAll(".ot");
    const orbitTextsReversed = Array.from(orbitTexts).reverse();

    // Fade in innermost → outermost
    gsap.set(orbitTexts, { opacity: 0 });
    gsap.to(orbitTextsReversed, {
      opacity: 1,
      duration: 0.75,
      stagger: 0.125,
      ease: "power1.out",
    });

    // textLength yoyo on each textPath — this is what makes letters bunch/spread
    tps.forEach((tp, i) => {
      const orbit           = ORBITS[i];
      const animDelay       = (tps.length - 1 - i) * 0.1;
      const currentDuration =
        MIN_ANIM_DURATION +
        (orbit.r / MAX_ORBIT_RADIUS) * (MAX_ANIM_DURATION - MIN_ANIM_DURATION);
      const pathLength      = 2 * Math.PI * orbit.r * 3;
      const tlIncrease      = TARGET_TEXT_LENGTHS[i] - orbit.startTextLength;
      const offsetAdj       = (tlIncrease / 2 / pathLength) * 100;
      const targetOffset    = orbit.startOffset - offsetAdj;

      gsap.to(tp, {
        attr: {
          textLength:  TARGET_TEXT_LENGTHS[i],
          startOffset: targetOffset + "%",
        },
        duration:    currentDuration,
        delay:       animDelay,
        ease:        "power2.inOut",
        yoyo:        true,
        repeat:      -1,
        repeatDelay: 0,
      });
    });

    // Random-direction SVG rotation
    let totalRotation = 0;
    function spinOnce() {
      const dir      = Math.random() < 0.5 ? 1 : -1;
      totalRotation += 25 * dir;
      gsap.to(svg, {
        rotation:   totalRotation,
        duration:   2,
        ease:       "power2.inOut",
        onComplete: spinOnce,
      });
    }
    spinOnce();

    // Counter 0 → 100
    const count = { value: 0 };
    gsap.to(count, {
      value:    100,
      duration: 4,
      delay:    1,
      ease:     "power1.out",
      onUpdate() {
        if (counter) counter.textContent = Math.floor(count.value);
      },
      onComplete() {
        gsap.to(counter, { opacity: 0, duration: 0.5, delay: 0.5 });
      },
    });

    // Fade out all text orbits → then fade entire loader → call setRevealDone
    gsap.to(orbitTextsReversed, {
      opacity:  0,
      duration: 0.75,
      stagger:  0.1,
      delay:    6,
      ease:     "power1.out",
      onComplete() {
        gsap.to(wrap, {
          opacity:    0,
          duration:   1,
          onComplete: () => setRevealDone(true),
        });
      },
    });

    return () => {
      gsap.killTweensOf(svg);
      gsap.killTweensOf(orbitTexts);
      gsap.killTweensOf(tps);
      gsap.killTweensOf(count);
    };
  }, [setRevealDone]);

  // ── SVG dimensions — centre at 500,500 to match reference path maths ──────
  const cx = 500, cy = 500;

  return (
    <div
      ref={wrapRef}
      style={{
        position:        "fixed",
        inset:           0,
        zIndex:          9999,
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        backgroundColor: "#0c0c0c",
        fontFamily:      "'Courier New', monospace",
      }}
    >
      {/* ── SVG ── */}
      <svg
        ref={svgRef}
        viewBox="-425 -425 1850 1850"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "min(90vw, 90vh)", height: "min(90vw, 90vh)" }}
      >
        {/* Orbit path defs */}
        <defs>
          {ORBITS.map((o, i) => (
            <path
              key={i}
              id={`lo-${i}`}
              d={makeOrbitPath(cx, cy, o.r)}
            />
          ))}
        </defs>

        {/* Faint guide circles */}
        {ORBITS.map((o, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={o.r}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        ))}

        {/* Orbit text labels */}
        {ORBITS.map((o, i) => (
          <text
            key={i}
            className="ot"
            style={{
              fontSize:      "52px",
              fill:          "rgba(255,255,255,0.85)",
              letterSpacing: "2px",
              fontFamily:    "'Jura', sans-serif",
              fontWeight:    500,
            }}
          >
            <textPath
              ref={(el) => (tpRefs.current[i] = el)}
              href={`#lo-${i}`}
              startOffset={`${o.startOffset}%`}
              textLength={o.startTextLength}
            >
              {o.word}
            </textPath>
          </text>
        ))}

      </svg>

      {/* Counter — outside SVG so it never rotates with it */}
      <div
        ref={countRef}
        style={{
          position:      "absolute",
          top:           "50%",
          left:          "50%",
          transform:     "translate(-50%, -50%)",
          fontSize:      "clamp(40px, 6vw, 80px)",
          color:         "rgba(255,255,255,0.18)",
          fontFamily:    "'Jura', sans-serif",
          fontWeight:    700,
          letterSpacing: "-4px",
          lineHeight:    1,
          pointerEvents: "none",
          userSelect:    "none",
        }}
      >
        0
      </div>
    </div>
  );
}