import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ─── PASTE YOUR REGISTRATIONS APPS SCRIPT URL HERE ────────────────────────────
const REGISTER_SHEET_URL = "https://script.google.com/macros/s/AKfycbw0whKVthaoygVvUiYeZ52brXyhBcC7JZ6tUR7OnUQOqiJ-8M0RfWuFLveczIbmkSF_Zg/exec";
// ──────────────────────────────────────────────────────────────────────────────

// ─── Fixed column orders per mode — sheet will always receive these in this exact order ──
// Workshop: one registrant, no team fields
const WORKSHOP_COLUMNS = [
  "timestamp", "eventName", "eventDate", "eventVenue", "formMode",
  "name_1", "enrollment_1", "email_1", "phone_1", "branch_1", "batch_1", "year_1",
];

// Solo: one registrant, no team fields
const SOLO_COLUMNS = [
  "timestamp", "eventName", "eventDate", "eventVenue", "formMode",
  "name_1", "enrollment_1", "email_1", "phone_1", "branch_1", "batch_1", "year_1",
];

// Team: team name + leader + up to maxTeam members
// We pre-generate columns for up to 10 members (unused ones will be empty strings)
const MAX_POSSIBLE_MEMBERS = 10;
const TEAM_COLUMNS = [
  "timestamp", "eventName", "eventDate", "eventVenue", "formMode",
  "teamName", "memberCount",
  ...Array.from({ length: MAX_POSSIBLE_MEMBERS }, (_, i) => {
    const n = i + 1;
    return [
      `name_${n}`, `enrollment_${n}`, `email_${n}`,
      `phone_${n}`, `branch_${n}`, `batch_${n}`, `year_${n}`,
    ];
  }).flat(),
];

// Returns an ordered array of values matching the column definition for this mode
function buildOrderedPayload(mode, data) {
  const columns = mode === "workshop" ? WORKSHOP_COLUMNS
                : mode === "team"     ? TEAM_COLUMNS
                :                      SOLO_COLUMNS;

  // data is a flat object — pick values in column order, defaulting to "" if missing
  return {
    keys:   columns,
    values: columns.map(col => String(data[col] ?? "")),
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────
const USS_BRANCHES = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Biotechnology",
  "Other",
];
const YEARS   = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const BATCHES = ["A", "B", "C", "D", "E"];

// ─── Icons ────────────────────────────────────────────────────────────────────
function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

// ─── Mode badge — shows what type of event this is (read-only, not a switcher) ─
const MODE_LABELS = {
  workshop: { label: "Workshop",         color: "border-cyan-400/40 bg-cyan-500/10 text-cyan-300" },
  solo:     { label: "Solo Competition", color: "border-purple-400/40 bg-purple-500/10 text-purple-200" },
  team:     { label: "Team Competition", color: "border-purple-400/40 bg-purple-500/10 text-purple-200" },
};

// ─── Reusable field components ────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label className="block text-xs font-bold tracking-[0.12em] text-white/60 uppercase mb-2">
      {children}{required && <span className="text-purple-400 ml-1">*</span>}
    </label>
  );
}
function Input({ error, ...props }) {
  return (
    <div>
      <input
        {...props}
        className={`w-full bg-black/40 border ${error ? "border-red-500/60" : "border-purple-400/20"} px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-purple-400/60 focus:bg-black/60 transition-all duration-200 rounded-none`}
      />
      {error && <p className="text-red-400 text-[11px] mt-1.5 tracking-wide">{error}</p>}
    </div>
  );
}
function Select({ children, error, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`w-full appearance-none bg-black/40 border ${error ? "border-red-500/60" : "border-purple-400/20"} px-4 py-3 text-sm focus:outline-none focus:border-purple-400/60 transition-all duration-200 rounded-none pr-10
          ${props.value === "" ? "text-white/25" : "text-white"}`}
      >
        {children}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
        <ChevronDown />
      </div>
      {error && <p className="text-red-400 text-[11px] mt-1.5 tracking-wide">{error}</p>}
    </div>
  );
}

// ─── Empty member ─────────────────────────────────────────────────────────────
const emptyMember = () => ({
  name: "", enrollment: "", email: "", branch: "", batch: "", year: "", phone: "",
});

// ─── Validate a single member ─────────────────────────────────────────────────
function validateMember(m) {
  const errs = {};
  if (!m.name.trim())       errs.name       = "Required";
  if (!m.enrollment.trim()) errs.enrollment = "Required";
  if (!m.email.trim())      errs.email      = "Required";
  else if (!/\S+@\S+\.\S+/.test(m.email)) errs.email = "Invalid email";
  if (!m.branch)            errs.branch     = "Required";
  if (!m.batch)             errs.batch      = "Required";
  if (!m.year)              errs.year       = "Required";
  if (!m.phone.trim())      errs.phone      = "Required";
  else if (!/^\d{10}$/.test(m.phone.replace(/\s/g, ""))) errs.phone = "Must be 10 digits";
  return errs;
}

// ─── Member fields block ──────────────────────────────────────────────────────
function MemberFields({ member, index, onChange, errors, isLeader, formMode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="border border-purple-400/15 bg-black/20 p-5 space-y-4"
    >
      {/* Member header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="w-7 h-7 border border-purple-400/40 bg-purple-500/10 flex items-center justify-center text-purple-300 font-black text-xs">
          {index + 1}
        </div>
        <span className="text-white/70 text-xs font-bold tracking-[0.15em] uppercase">
          {isLeader ? "Team Leader" : `Member ${index + 1}`}
        </span>
        {isLeader && (
          <span className="ml-auto px-2 py-0.5 border border-purple-400/30 text-purple-300 text-[10px] font-bold tracking-widest">
            LEADER
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>Full Name</Label>
          <Input
            placeholder="John Doe"
            value={member.name}
            onChange={e => onChange(index, "name", e.target.value)}
            error={errors?.name}
          />
        </div>
        <div>
          <Label required>Enrollment Number</Label>
          <Input
            placeholder="E.g. 22CS001"
            value={member.enrollment}
            onChange={e => onChange(index, "enrollment", e.target.value)}
            error={errors?.enrollment}
          />
        </div>
        <div>
          <Label required>Email ID</Label>
          <Input
            type="email"
            placeholder="you@university.edu"
            value={member.email}
            onChange={e => onChange(index, "email", e.target.value)}
            error={errors?.email}
          />
        </div>
        <div>
          <Label required>Phone Number</Label>
          <Input
            type="tel"
            placeholder="10-digit mobile number"
            value={member.phone}
            onChange={e => onChange(index, "phone", e.target.value)}
            error={errors?.phone}
          />
        </div>
        <div>
          <Label required>USS Branch</Label>
          <Select
            value={member.branch}
            onChange={e => onChange(index, "branch", e.target.value)}
            error={errors?.branch}
          >
            <option value="">Select branch</option>
            {USS_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label required>Batch</Label>
            <Select
              value={member.batch}
              onChange={e => onChange(index, "batch", e.target.value)}
              error={errors?.batch}
            >
              <option value="">Batch</option>
              {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </Select>
          </div>
          <div>
            <Label required>Year</Label>
            <Select
              value={member.year}
              onChange={e => onChange(index, "year", e.target.value)}
              error={errors?.year}
            >
              <option value="">Year</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </Select>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen({ eventName, formMode, teamName }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center py-20 px-6"
    >
      <div className="w-20 h-20 border border-purple-400/40 bg-purple-500/10 flex items-center justify-center text-purple-400 mb-8">
        <CheckIcon />
      </div>
      <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-3">
        Registration Confirmed
      </h2>
      <p className="text-white/50 text-sm tracking-wide mb-2">
        You're registered for <span className="text-purple-300 font-bold">{eventName}</span>
      </p>
      {formMode === "team" && teamName && (
        <p className="text-white/40 text-sm mb-8">
          Team: <span className="text-white/70 font-semibold">{teamName}</span>
        </p>
      )}
      <p className="text-white/30 text-xs tracking-widest mb-10 uppercase">
        A confirmation will be sent to your registered email(s)
      </p>
      <Link
        to="/events"
        className="px-8 py-3.5 border border-purple-400/50 text-white font-bold tracking-[0.12em] text-sm hover:bg-purple-500/15 transition-all duration-300"
      >
        ← BACK TO EVENTS
      </Link>
    </motion.div>
  );
}

// ─── Main RegisterPage ────────────────────────────────────────────────────────
export default function RegisterPage() {
  const location   = useLocation();
  const routeState = location.state || {};

  // All event context locked from router state — user cannot change these
  const eventName  = routeState.eventName  || "";
  const eventDate  = routeState.eventDate  || "";
  const eventVenue = routeState.eventVenue || "";
  const formMode   = routeState.formMode   || "solo"; // locked — no switcher
  const minTeam    = routeState.minTeam    || 2;
  const maxTeam    = routeState.maxTeam    || 5;

  // Team name (team mode only)
  const [teamName,      setTeamName]      = useState("");
  const [teamNameError, setTeamNameError] = useState("");

  // Members array
  const [members,      setMembers]      = useState([emptyMember()]);
  const [memberErrors, setMemberErrors] = useState([{}]);

  // Submission state
  const [submitting,   setSubmitting]   = useState(false);
  const [submitError,  setSubmitError]  = useState("");
  const [submitted,    setSubmitted]    = useState(false);

  function handleMemberChange(index, field, value) {
    setMembers(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m));
    setMemberErrors(prev => prev.map((e, i) => i === index ? { ...e, [field]: undefined } : e));
  }

  function addMember() {
    if (members.length >= maxTeam) return;
    setMembers(prev => [...prev, emptyMember()]);
    setMemberErrors(prev => [...prev, {}]);
  }

  function removeMember(index) {
    if (index === 0 || members.length <= minTeam) return;
    setMembers(prev => prev.filter((_, i) => i !== index));
    setMemberErrors(prev => prev.filter((_, i) => i !== index));
  }

  function validate() {
    let valid = true;
    if (formMode === "team") {
      if (!teamName.trim()) { setTeamNameError("Team name is required"); valid = false; }
      else setTeamNameError("");
    }
    const newErrors = members.map(m => validateMember(m));
    setMemberErrors(newErrors);
    if (newErrors.some(e => Object.keys(e).length > 0)) valid = false;
    return valid;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setSubmitting(true);

    const timestamp = new Date().toISOString();

    // Build the flat data object with all possible keys
    const flatData = {
      timestamp,
      eventName,
      eventDate,
      eventVenue,
      formMode,
      teamName:    formMode === "team" ? teamName : "",
      memberCount: String(members.length),
      // Flatten members — fill all slots up to MAX_POSSIBLE_MEMBERS with ""
      ...Array.from({ length: MAX_POSSIBLE_MEMBERS }, (_, i) => {
        const n = i + 1;
        const m = members[i] || {};
        return {
          [`name_${n}`]:       m.name       || "",
          [`enrollment_${n}`]: m.enrollment || "",
          [`email_${n}`]:      m.email      || "",
          [`phone_${n}`]:      m.phone      || "",
          [`branch_${n}`]:     m.branch     || "",
          [`batch_${n}`]:      m.batch      || "",
          [`year_${n}`]:       m.year       || "",
        };
      }).reduce((acc, obj) => ({ ...acc, ...obj }), {}),
    };

    // Get the ordered keys and values for this mode — guarantees column consistency
    const { keys, values } = buildOrderedPayload(formMode, flatData);

    // Send as tab-separated rows so Apps Script can split them in order
    const body = new URLSearchParams({
      keys:   keys.join("\t"),
      values: values.join("\t"),
      mode:   formMode,
    }).toString();

    try {
      await fetch(REGISTER_SHEET_URL, {
        method:  "POST",
        mode:    "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Submission failed:", err);
      setSubmitError("Submission failed. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const modeConfig = MODE_LABELS[formMode] || MODE_LABELS.solo;

  if (submitted) {
    return (
      <section className="relative min-h-screen overflow-hidden text-white px-5 lg:px-10 py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(120,50,220,0.2),transparent_40%),linear-gradient(180deg,#040210,#000008)]" />
        <div className="max-w-3xl mx-auto">
          <SuccessScreen eventName={eventName} formMode={formMode} teamName={teamName} />
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden text-white px-5 lg:px-10 py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(120,50,220,0.2),transparent_40%),linear-gradient(180deg,#040210,#000008)]" />

      <div className="max-w-3xl mx-auto">

        {/* Back link */}
        <Link to="/events" className="inline-flex items-center gap-2 text-white/40 text-xs tracking-widest uppercase hover:text-purple-300 transition-colors mb-10">
          ← Events
        </Link>

        {/* Header */}
        <div className="relative mb-10 overflow-hidden">
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-[80px] font-black text-white/[0.03] uppercase tracking-tight leading-none select-none pointer-events-none">
            REGISTER
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-none">
            REGISTER
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {/* Event name badge */}
            {eventName && (
              <span className="px-3 py-1 border border-purple-400/40 bg-purple-500/10 text-purple-200 text-xs font-bold tracking-[0.15em]">
                {eventName}
              </span>
            )}
            {/* Mode badge — read-only, shows what type this registration is */}
            <span className={`px-3 py-1 border text-xs font-bold tracking-[0.15em] ${modeConfig.color}`}>
              {modeConfig.label}
            </span>
            {eventDate  && <span className="text-white/40 text-xs tracking-wider">📅 {eventDate}</span>}
            {eventVenue && <span className="text-white/40 text-xs tracking-wider">📍 {eventVenue}</span>}
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div
            className="border border-purple-400/20 bg-[linear-gradient(180deg,rgba(10,5,25,0.85),rgba(2,2,8,0.95))] p-6 md:p-8 space-y-6"
            style={{ boxShadow: "inset 0 0 0 1px rgba(139,92,246,0.08)" }}
          >

            {/* ── Team name (team mode only) ── */}
            <AnimatePresence>
              {formMode === "team" && (
                <motion.div
                  key="teamName"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Label required>Team Name</Label>
                  <Input
                    placeholder="Enter your team name"
                    value={teamName}
                    onChange={e => { setTeamName(e.target.value); setTeamNameError(""); }}
                    error={teamNameError}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Section label ── */}
            <div className="flex items-center gap-3">
              <span className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase">
                {formMode === "team"
                  ? `Participants (${members.length}/${maxTeam})`
                  : "Your Details"}
              </span>
              <div className="flex-1 h-px bg-purple-400/10" />
            </div>

            {/* ── Member fields ── */}
            <div className="space-y-4">
              <AnimatePresence>
                {members.map((member, i) => (
                  <div key={i} className="relative">
                    <MemberFields
                      member={member}
                      index={i}
                      onChange={handleMemberChange}
                      errors={memberErrors[i]}
                      isLeader={formMode === "team" && i === 0}
                      formMode={formMode}
                    />
                    {formMode === "team" && i > 0 && members.length > minTeam && (
                      <button
                        type="button"
                        onClick={() => removeMember(i)}
                        className="absolute -top-2 -right-2 w-6 h-6 border border-red-500/40 bg-black flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-all z-10"
                      >
                        <MinusIcon />
                      </button>
                    )}
                  </div>
                ))}
              </AnimatePresence>
            </div>

            {/* ── Add member (team mode only) ── */}
            {formMode === "team" && members.length < maxTeam && (
              <button
                type="button"
                onClick={addMember}
                className="w-full py-3 border border-dashed border-purple-400/30 text-purple-400/70 text-xs font-bold tracking-[0.15em] uppercase hover:border-purple-400/50 hover:text-purple-300 hover:bg-purple-500/5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <PlusIcon /> Add Member
                <span className="text-white/25 font-normal">({members.length}/{maxTeam})</span>
              </button>
            )}

            {/* ── Submit error ── */}
            {submitError && (
              <div className="px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
                ⚠ {submitError}
              </div>
            )}

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 border border-purple-500/60 bg-purple-600/15 text-white font-black tracking-[0.15em] uppercase text-sm hover:bg-purple-500/25 hover:border-purple-400/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>Submit Registration →</>
              )}
            </button>

            <p className="text-white/25 text-[11px] text-center tracking-wide">
              Fields marked <span className="text-purple-400">*</span> are required
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}