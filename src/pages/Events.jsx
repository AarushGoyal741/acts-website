import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// ─── PASTE YOUR APPS SCRIPT URL HERE ──────────────────────────────────────────
const SHEET_URL = "https://script.google.com/macros/s/AKfycbxerP7mF2-ydAEwlnaA8cZTMYWnqS6MPDYxj8rPH2wrr7Uv6rMf5HOIlzvAJly9lPG_/exec";
// ──────────────────────────────────────────────────────────────────────────────

// Maps the "tagColor" column value from the sheet to Tailwind classes
const TAG_COLOR_MAP = {
  purple: "bg-purple-500/20 border-purple-400/60 text-purple-200",
  yellow: "bg-yellow-500/10 border-yellow-400/50 text-yellow-300",
  cyan:   "bg-cyan-500/10   border-cyan-400/50   text-cyan-200",
};

// Maps the "subtitleColor" column value to a Tailwind class
const SUBTITLE_COLOR_MAP = {
  cyan:   "text-cyan-400",
  purple: "text-purple-400",
  white:  "text-white/80",
};

// Reusable SVG icons matching the purple line-art style in the reference
const IconPeople = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconCollege = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const IconReach = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2"/>
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
  </svg>
);

const IconSpeaker = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

const IconPerformance = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

// Icon picker — maps a stat label (from the sheet) to the right SVG icon
function StatIcon({ label }) {
  const l = (label || "").toUpperCase();
  if (l.includes("PARTICIPANT") || l.includes("ATTENDEE"))   return <IconPeople />;
  if (l.includes("COLLEGE")    || l.includes("SCHOOL"))      return <IconCollege />;
  if (l.includes("SPEAKER")    || l.includes("MENTOR"))      return <IconSpeaker />;
  if (l.includes("PERFORM")    || l.includes("ACT"))         return <IconPerformance />;
  return <IconReach />; // default: reach / signal
}

// Safely converts whatever Google Sheets sends for a date cell into a clean string.
// Sheets often serialises date cells as ISO strings or JS Date objects via Apps Script.
// If the value is already a plain string like "NOV 10" or "24 MAY 2025" it passes through untouched.
function formatSheetDate(value, format = "short") {
  if (!value && value !== 0) return "";

  // Already a plain non-numeric string — return as-is
  if (typeof value === "string" && isNaN(Date.parse(value)) ) return value;

  // Try to parse as a date
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value); // unparseable — just stringify

  if (format === "short") {
    // "NOV 10" style — used for the timeline date column
    return d.toLocaleDateString("en-GB", {
      month: "short",
      day:   "numeric",
      timeZone: "UTC",
    }).toUpperCase(); // e.g. "10 Nov" → "10 NOV"
  }

  if (format === "long") {
    // "24 MAY 2025" style — used for the upcoming event date field
    return d.toLocaleDateString("en-GB", {
      day:   "numeric",
      month: "short",
      year:  "numeric",
      timeZone: "UTC",
    }).toUpperCase(); // e.g. "24 May 2025" → "24 MAY 2025"
  }

  return String(value);
}

// Converts a Google Drive share link into a direct embeddable image URL.
// The uc?export=view endpoint is blocked by Drive's hotlink protection in browsers.
// The thumbnail endpoint (with a large size param) works reliably for embedding.
// Input:  https://drive.google.com/file/d/FILE_ID/view?usp=sharing
// Output: https://drive.google.com/thumbnail?id=FILE_ID&sz=w1200
function toDriveDirectUrl(url) {
  if (!url) return "";
  const match = String(url).match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1200`;
  return String(url); // already a direct URL or not a Drive link
}

// Transforms a raw past-event row from the sheet into the shape our UI needs
function parsePastEvent(row) {
  return {
    year:        String(row.year  || ""),
    date:        formatSheetDate(row.date, "short"),
    title:       String(row.title || ""),
    description: String(row.description || ""),
    extra: (() => { const v = String(row.extra || ""); return v && !v.startsWith("+") ? `+${v}` : v; })(),
    folder: String(row.folder || ""),
    // Main cover image (single Drive link or direct URL)
    image:       toDriveDirectUrl(row.image || ""),
    // Up to 3 gallery thumbnails — columns: photo1, photo2, photo3
    photos: [
      toDriveDirectUrl(row.photo1 || ""),
      toDriveDirectUrl(row.photo2 || ""),
      toDriveDirectUrl(row.photo3 || ""),
    ],
    stats: [
      { label: String(row.stat1label || ""), value: String(row.stat1value || "") },
      { label: String(row.stat2label || ""), value: String(row.stat2value || "") },
      { label: String(row.stat3label || ""), value: String(row.stat3value || "") },
    ].filter(s => s.label && s.value),
  };
}

// Transforms a raw upcoming-event row from the sheet
function parseUpcomingEvent(row) {
  return {
    tag:           String(row.tag           || ""),
    tagColor:      TAG_COLOR_MAP[String(row.tagColor || "purple")] || TAG_COLOR_MAP.purple,
    title:         String(row.title         || ""),
    subtitle:      String(row.subtitle      || ""),
    subtitleColor: SUBTITLE_COLOR_MAP[String(row.subtitleColor || "cyan")] || SUBTITLE_COLOR_MAP.cyan,
    date:          formatSheetDate(row.date, "long"),
    venue:         String(row.venue         || ""),
    button:        String(row.button        || ""),
    buttonIcon:    String(row.buttonIcon    || "↗"),
    style:         String(row.style         || "technovate"),
    note:          String(row.note          || ""),
    noteHighlight: String(row.noteHighlight || ""),
  };
}

function TechnovateCard({ event }) {
  return (
    <div className="flex flex-col h-full">
      {/* Image area with CLASSIFIED overlay */}
      <div className="relative h-[220px] rounded-2xl overflow-hidden mb-5 border border-purple-400/20 bg-gradient-to-br from-indigo-950 via-purple-950 to-black flex items-center justify-center">
        {/* Background starfield effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,40,200,0.3),transparent_70%)]" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
        {/* CLASSIFIED tape strips */}
        <div className="absolute inset-0 flex flex-col justify-end gap-1 pb-2 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="text-[10px] font-black tracking-[0.4em] text-white/15 whitespace-nowrap select-none"
              style={{ transform: `rotate(-8deg) translateX(-${i * 10}px)` }}
            >
              CLASSIFIED CLASSIFIED CLASSIFIED CLASSIFIED CLASSIFIED CLASSIFIED
            </div>
          ))}
        </div>
        <div className="relative z-10 text-center px-4">
          <h3 className="text-3xl font-black text-white tracking-tight leading-none">{event.title}</h3>
          <p className={`text-sm font-bold tracking-[0.15em] mt-2 ${event.subtitleColor}`}>{event.subtitle}</p>
        </div>
        {/* DETAILS CLASSIFIED box */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
          <div className="text-[9px] text-white/40 tracking-widest mb-0.5">DETAILS</div>
          <div className="border-2 border-purple-400/60 px-5 py-1.5 text-[11px] font-black tracking-[0.3em] text-purple-200 bg-black/40">
            CLASSIFIED
          </div>
          <div className="text-[9px] text-white/40 tracking-widest mt-0.5">STAY TUNED</div>
        </div>
      </div>

      {/* Info rows */}
      <div className="border border-purple-400/15 rounded-xl overflow-hidden bg-black/20 mb-5">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-white/50 text-xs tracking-widest">
            <span>📅</span> DATE
          </div>
          <span className="text-white/80 text-xs tracking-wider">{event.date}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-white/50 text-xs tracking-widest">
            <span>📍</span> VENUE
          </div>
          <span className="text-white/80 text-xs tracking-wider">{event.venue}</span>
        </div>
      </div>

      <div className="mt-auto">
        <button className="w-full rounded-xl border border-purple-400/50 bg-black/30 py-3.5 text-white font-bold tracking-[0.12em] text-sm hover:bg-purple-500/15 hover:border-purple-400/70 transition-all duration-300 flex items-center justify-center gap-2">
          {event.button} <span className="text-purple-400">{event.buttonIcon}</span>
        </button>
      </div>
    </div>
  );
}

function SecretCard({ event }) {
  return (
    <div className="flex flex-col h-full">
      <div className="relative h-[220px] rounded-2xl overflow-hidden mb-5 border border-purple-400/20 bg-black flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(100,50,200,0.2),transparent_60%)]" />
        {/* Blurred background suggestion */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/40" />
        <div className="relative z-10 text-center">
          {/* TOP SECRET stamp */}
          <div className="relative inline-block">
            <div className="border-4 border-purple-500/80 rounded-lg px-6 py-3 relative" style={{transform: "rotate(-5deg)"}}>
              <div className="absolute inset-0 rounded-md bg-purple-900/20" />
              <span className="relative text-3xl font-black text-purple-300 tracking-[0.2em] uppercase" style={{textShadow: "0 0 20px rgba(168,85,247,0.8)"}}>
                TOP SECRET
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-purple-400/15 rounded-xl overflow-hidden bg-black/20 mb-5">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-white/50 text-xs tracking-widest">
            <span>📅</span> DATE
          </div>
          <span className="text-white/60 text-xs tracking-wider italic">{event.date}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-white/50 text-xs tracking-widest">
            <span>📍</span> VENUE
          </div>
          <span className="text-white/60 text-xs tracking-wider italic">{event.venue}</span>
        </div>
      </div>

      <div className="text-center text-white/70 text-sm mb-5 leading-relaxed">
        <p className="font-semibold tracking-wide">{event.note}</p>
        <p className="text-purple-400 font-bold tracking-wider mt-1">{event.noteHighlight}</p>
      </div>

      <div className="mt-auto">
        <button className="w-full rounded-xl border border-purple-400/50 bg-black/30 py-3.5 text-white font-bold tracking-[0.12em] text-sm hover:bg-purple-500/15 hover:border-purple-400/70 transition-all duration-300 flex items-center justify-center gap-2">
          {event.button} <span>{event.buttonIcon}</span>
        </button>
      </div>
    </div>
  );
}

function RestrictedCard({ event }) {
  return (
    <div className="flex flex-col h-full">
      <div className="relative h-[220px] rounded-2xl overflow-hidden mb-5 border border-yellow-500/20 bg-black flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,80,20,0.2),transparent_60%)]" />
        {/* Caution tape strips */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[150%] h-8 bg-yellow-400/85 flex items-center overflow-hidden"
            style={{
              top: `${15 + i * 22}%`,
              left: "-25%",
              transform: `rotate(${i % 2 === 0 ? -8 : -6}deg)`,
              zIndex: i + 1,
            }}
          >
            <div className="whitespace-nowrap text-black font-black text-[11px] tracking-[0.25em] animate-none">
              {i % 2 === 0
                ? "ACCESS RESTRICTED ACCESS RESTRICTED ACCESS RESTRICTED ACCESS RESTRICTED "
                : "DETAILS HIDDEN DETAILS HIDDEN DETAILS HIDDEN DETAILS HIDDEN DETAILS HIDDEN "}
            </div>
          </div>
        ))}
        {/* Dark overlay on top */}
        <div className="absolute inset-0 bg-black/30 z-10" />
      </div>

      <div className="border border-yellow-500/15 rounded-xl overflow-hidden bg-black/20 mb-5">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-white/50 text-xs tracking-widest">
            <span>📅</span> DATE
          </div>
          <span className="text-white/60 text-xs tracking-wider">{event.date}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-white/50 text-xs tracking-widest">
            <span>📍</span> VENUE
          </div>
          <span className="text-white/60 text-xs tracking-wider">{event.venue}</span>
        </div>
      </div>

      <div className="text-center text-white/60 text-sm mb-5">
        <div className="text-2xl mb-1">🔒</div>
        <p className="tracking-wider font-semibold">{event.note}</p>
      </div>

      <div className="mt-auto">
        <button className="w-full rounded-xl border border-yellow-500/40 bg-black/30 py-3.5 text-white font-bold tracking-[0.12em] text-sm hover:bg-yellow-500/10 hover:border-yellow-400/60 transition-all duration-300 flex items-center justify-center gap-2">
          {event.button} <span className="text-yellow-400">{event.buttonIcon}</span>
        </button>
      </div>
    </div>
  );
}

function UpcomingCard({ event, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="rounded-2xl border border-purple-400/20 bg-[linear-gradient(180deg,rgba(18,7,42,0.95),rgba(3,3,10,0.98))] p-5 shadow-[0_0_40px_rgba(139,92,246,0.1)] relative overflow-hidden flex flex-col"
    >
      {/* Tag */}
      <div className={`inline-flex self-start px-3 py-1 rounded-md border text-[11px] font-bold tracking-[0.1em] mb-4 ${event.tagColor}`}>
        {event.tag}
      </div>

      {event.style === "technovate" && <TechnovateCard event={event} />}
      {event.style === "secret" && <SecretCard event={event} />}
      {event.style === "restricted" && <RestrictedCard event={event} />}
    </motion.div>
  );
}

function PastEventRow({ event, index, isLast }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`grid grid-cols-[80px_1fr] gap-0 ${!isLast ? "pb-10" : "pb-2"}`}
    >
      {/* Timeline column — dot only, line is handled by parent */}
      <div className="relative flex flex-col items-center pt-1">
        <div className="text-purple-400 font-black text-lg leading-tight text-center">{event.year}</div>
        <div className="text-white/50 text-xs mt-0.5 tracking-wider text-center">{event.date}</div>
        {/* Dot — positioned to sit exactly on the parent's left-[39px] line */}
        <div className="mt-3 w-4 h-4 rounded-full border-[3px] border-purple-400 bg-[#0b0718] shadow-[0_0_16px_rgba(168,85,247,0.5)] z-10 relative" />
      </div>

      {/* Content column */}
      <div className="pl-4">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_auto] gap-5 items-start">
          {/* Main cover image */}
          <div className="h-[180px] lg:h-[200px] rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/20 to-black/80 overflow-hidden relative">
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={e => { e.currentTarget.style.display = "none"; }}
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(100,50,200,0.2),transparent_70%)]" />
            )}
          </div>

          {/* Text + stats */}
          <div>
            <h3 className="text-2xl lg:text-3xl font-black text-white mb-3 tracking-tight">{event.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-5">{event.description}</p>

            {/* Stats row — unified pill */}
            <div className="inline-flex rounded-xl border border-purple-400/25 bg-[#0a0618] overflow-hidden">
              {event.stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex items-center gap-3 px-5 py-3 ${i !== event.stats.length - 1 ? "border-r border-purple-400/20" : ""}`}
                >
                  <div className="text-purple-400 shrink-0">
                    <StatIcon label={stat.label} />
                  </div>
                  <div>
                    <div className="text-white font-black text-base leading-none">{stat.value}</div>
                    <div className="text-purple-400/60 text-[10px] tracking-[0.15em] mt-1">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo gallery — 3 thumbnails + overflow badge */}
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-2 w-full lg:w-[200px]">
            {event.photos.map((src, i) => (
              <div key={i} className="h-[90px] rounded-xl border border-white/10 bg-black/40 overflow-hidden">
                {src ? (
                  <img
                    src={src}
                    alt={`${event.title} photo ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={e => { e.currentTarget.style.display = "none"; }}
                  />
                ) : null}
              </div>
            ))}
            {event.folder ? (
              <a
                href={event.folder}
                target="_blank"
                rel="noopener noreferrer"
                className="h-[90px] rounded-xl border border-purple-400/30 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.25),transparent_60%),#05030a] flex flex-col items-center justify-center text-purple-300 font-black text-xl hover:bg-purple-500/20 hover:border-purple-400/60 hover:text-purple-200 hover:scale-105 transition-all duration-200 cursor-pointer group"
              >
                {event.extra}
                <span className="text-[9px] tracking-widest text-purple-400/60 font-semibold mt-1 group-hover:text-purple-300/80 transition-colors">
                  VIEW ALL
                </span>
              </a>
            ) : (
              <div className="h-[90px] rounded-xl border border-purple-400/30 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.25),transparent_60%),#05030a] flex items-center justify-center text-purple-300 font-black text-xl">
                {event.extra}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function Skeleton({ className }) {
  return (
    <div className={`animate-pulse rounded bg-purple-400/10 ${className}`} />
  );
}

function UpcomingLoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-purple-400/15 bg-black/30 p-5 space-y-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-[220px] w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

function PastLoadingSkeleton() {
  return (
    <div className="space-y-10">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="grid grid-cols-[80px_1fr] gap-0">
          <div className="flex flex-col items-center pt-1 gap-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-4 rounded-full mt-2" />
          </div>
          <div className="pl-4 space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-12 w-80 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
      <span>⚠ {message}</span>
      <button
        onClick={onRetry}
        className="px-4 py-1.5 border border-red-400/40 rounded-lg text-xs font-semibold hover:bg-red-500/15 transition-all"
      >
        Retry
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function EventsPage() {
  const [activeDot, setActiveDot]         = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents]         = useState([]);
  const [status, setStatus]                 = useState("loading"); // "loading" | "ok" | "error"
  const [errorMsg, setErrorMsg]             = useState("");

  async function fetchData() {
    setStatus("loading");
    try {
      const res = await fetch(SHEET_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setUpcomingEvents((json.upcoming || []).map(parseUpcomingEvent));
      setPastEvents((json.past || []).map(parsePastEvent));
      setStatus("ok");
    } catch (err) {
      console.error("Sheet fetch failed:", err);
      setErrorMsg("Couldn't load event data. Check your Apps Script URL or network.");
      setStatus("error");
    }
  }

  useEffect(() => { fetchData(); }, []);

  return (
    <section className="relative min-h-screen overflow-hidden text-white px-5 lg:px-10 py-24">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(120,50,220,0.25),transparent_40%),linear-gradient(180deg,#040210,#000008)]" />

      <div className="max-w-7xl mx-auto">

        {/* Hero */}
        <div className="relative mb-20 overflow-hidden">
          {/* Ghost watermark */}
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-[120px] md:text-[180px] font-black text-white/[0.04] uppercase tracking-tight leading-none select-none pointer-events-none whitespace-nowrap">
            EVENTS
          </div>
          <div className="relative">
            <h1 className="text-[72px] md:text-[100px] font-black uppercase tracking-tight text-white leading-none">
              EVENTS
            </h1>
            <p className="mt-3 text-white/50 text-sm tracking-[0.25em] uppercase">
              EXPERIENCES THAT INSPIRE, IMPACT THAT LASTS
            </p>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <section className="mb-20 relative border border-purple-400/20 bg-[linear-gradient(180deg,rgba(10,5,25,0.85),rgba(2,2,8,0.95))] px-5 py-6 md:px-8 md:py-8"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(139,92,246,0.12), 0 0 60px rgba(139,92,246,0.06)"
          }}
        >
          <div className="flex items-center mb-7">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider flex items-center gap-3">
              UPCOMING EVENTS
              <span className="text-purple-400 font-black">///</span>
            </h2>
          </div>

          {status === "loading" && <UpcomingLoadingSkeleton />}
          {status === "error"   && <ErrorBanner message={errorMsg} onRetry={fetchData} />}
          {status === "ok" && (
          <div className="grid md:grid-cols-3 gap-5">
            {upcomingEvents.map((event, index) => (
              <UpcomingCard key={event.title} event={event} index={index} />
            ))}
          </div>
          )}

          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <button
                key={i}
                onClick={() => setActiveDot(i)}
                className={`rounded-full transition-all duration-300 ${
                  activeDot === i
                    ? "w-6 h-2 bg-purple-400"
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </section>

        {/* Past Events Section */}
        <section className="mb-20 relative border border-purple-400/20 bg-[linear-gradient(180deg,rgba(10,5,25,0.85),rgba(2,2,8,0.95))] px-5 py-6 md:px-8 md:py-8"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(139,92,246,0.12), 0 0 60px rgba(139,92,246,0.04)"
          }}
        >
          <div className="flex items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider flex items-center gap-3">
              PAST EVENTS
              <span className="text-purple-400 font-black">///</span>
            </h2>
          </div>

          {/* Timeline wrapper — single continuous line runs full height */}
          <div className="relative">
            {/* The single unbroken vertical line */}
            <div className="absolute left-[39px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-500/80 via-purple-500/50 to-purple-500/10 pointer-events-none" />

            {status === "loading" && <PastLoadingSkeleton />}
            {status === "error"   && <ErrorBanner message={errorMsg} onRetry={fetchData} />}
            {status === "ok" && (
            <div className="space-y-0">
              {pastEvents.map((event, index) => (
                <PastEventRow
                  key={event.title}
                  event={event}
                  index={index}
                  isLast={index === pastEvents.length - 1}
                />
              ))}
            </div>
            )}
          </div>
        </section>

        {/* CTA Footer with diagonal ACTS ribbons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Ribbon — bottom-left, 28deg, shorter */}
          <div
            className="absolute bottom-8 -left-44 w-[420px] pointer-events-none z-0"
            style={{ transform: "rotate(28deg)", transformOrigin: "left bottom" }}
          >
            {/* Torn top edge */}
            <svg viewBox="0 0 420 10" className="w-full" style={{ display: "block", marginBottom: "-1px" }}>
              <path
                d="M0,9 C18,2 30,8 48,3 C62,0 74,7 90,4 C108,1 118,8 136,3 C152,0 168,7 184,3 C200,0 216,8 232,4 C248,1 260,7 278,3 C294,0 310,8 326,3 C342,0 358,7 374,4 C390,1 406,7 420,4 L420,10 L0,10 Z"
                fill="#181818"
              />
            </svg>
            <div className="relative bg-[#181818] flex items-center overflow-hidden" style={{ height: "52px" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.04] via-transparent to-black/20" />
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/40 to-transparent" />
              <div className="flex items-center gap-5 px-3 whitespace-nowrap select-none">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="0.9" className="shrink-0">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      <path d="M12 2v20"/>
                    </svg>
                    <span className="text-white/50 font-black tracking-[0.38em] text-[13px] uppercase">ACTS</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Torn bottom edge */}
            <svg viewBox="0 0 420 10" className="w-full" style={{ display: "block", marginTop: "-1px" }}>
              <path
                d="M0,0 L420,0 L420,2 C400,8 386,1 368,6 C352,9 336,2 318,7 C302,10 286,3 268,6 C250,9 236,2 218,7 C202,10 186,3 168,6 C150,9 134,2 116,7 C100,10 84,3 66,7 C50,10 36,4 18,7 C10,9 4,6 0,8 Z"
                fill="#181818"
              />
            </svg>
          </div>

          {/* Ribbon — bottom-right, 36deg, longer */}
          <div
            className="absolute bottom-6 -right-56 w-[520px] pointer-events-none z-0"
            style={{ transform: "rotate(-36deg)", transformOrigin: "right bottom" }}
          >
            {/* Torn top edge */}
            <svg viewBox="0 0 520 10" className="w-full" style={{ display: "block", marginBottom: "-1px" }}>
              <path
                d="M0,6 C14,1 28,8 46,3 C62,0 80,7 98,3 C116,0 130,8 150,4 C168,1 184,7 204,3 C222,0 240,8 258,4 C274,1 292,7 310,3 C328,0 344,8 364,4 C382,1 398,7 418,3 C436,0 456,7 474,3 C492,0 508,7 520,5 L520,10 L0,10 Z"
                fill="#141414"
              />
            </svg>
            <div className="relative bg-[#141414] flex items-center overflow-hidden" style={{ height: "56px" }}>
              <div className="absolute inset-0 bg-gradient-to-l from-white/[0.04] via-transparent to-black/20" />
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/40 to-transparent" />
              <div className="flex items-center gap-6 px-3 whitespace-nowrap select-none">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="0.9" className="shrink-0">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      <path d="M12 2v20"/>
                    </svg>
                    <span className="text-white/45 font-black tracking-[0.38em] text-[13px] uppercase">ACTS</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Torn bottom edge */}
            <svg viewBox="0 0 520 10" className="w-full" style={{ display: "block", marginTop: "-1px" }}>
              <path
                d="M0,0 L520,0 L520,5 C504,9 488,2 468,7 C450,10 432,3 412,7 C394,10 376,4 356,8 C338,10 320,3 300,7 C282,10 264,4 244,8 C226,10 208,3 188,7 C170,10 152,4 132,8 C114,10 96,3 76,7 C58,10 42,4 24,7 C14,9 6,6 0,8 Z"
                fill="#141414"
              />
            </svg>
          </div>

          {/* The actual CTA card */}
          <section className="relative z-10 border border-purple-400/25 bg-[linear-gradient(135deg,rgba(14,8,35,0.95),rgba(5,3,15,0.98))] px-8 py-8 md:px-10 md:py-9 flex flex-col md:flex-row justify-between gap-6 items-center overflow-hidden"
            style={{ boxShadow: "0 0 0 1px rgba(139,92,246,0.1), 0 0 60px rgba(139,92,246,0.08)" }}
          >
            {/* Left glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(100,50,200,0.12),transparent_55%)] pointer-events-none" />

            <div className="relative flex items-center gap-5">
              {/* Calendar icon box */}
              <div className="w-14 h-14 shrink-0 border border-purple-500/50 bg-purple-600/20 flex items-center justify-center">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(200,160,255,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                  <line x1="8" y1="14" x2="16" y2="14"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black leading-tight tracking-wide uppercase">
                  WANT TO COLLABORATE<br />OR HOST AN EVENT WITH US?
                </h3>
              </div>
            </div>

            <p className="relative text-white/55 text-sm leading-relaxed md:max-w-[180px] shrink-0">
              Let's create something impactful together.
            </p>

            <Link
              to="/faq"
              className="relative shrink-0 px-7 py-3.5 border border-purple-500/60 bg-transparent text-white font-bold tracking-[0.12em] text-sm hover:bg-purple-500/15 transition-all duration-300 flex items-center gap-3 whitespace-nowrap"
            >
              GET IN TOUCH <span className="text-purple-300">→</span>
            </Link>
          </section>
        </motion.div>

      </div>
    </section>
  );
}