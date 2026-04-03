import React from 'react';

const TEAM_CARDS = [
  'TECH TEAM',
  'DESIGN TEAM',
  'SOCIAL MEDIA TEAM',
  'PR AND OUTREACH',
  'EVENT MANAGEMENT',
  'MEDIA TEAM',
];

const Teams = () => {
  return (
    <section id="teams" className="relative w-full py-20 md:py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-8 left-1/4 h-56 w-56 bg-purple-700/35 blur-[80px]" />
        <div className="absolute top-40 right-1/4 h-64 w-64 bg-fuchsia-600/25 blur-[90px]" />
        <div className="absolute bottom-10 left-1/3 h-56 w-56 bg-violet-600/30 blur-[85px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6">
        <h2
          className="uppercase text-center text-[clamp(2.1rem,5vw,3.8rem)] font-semibold tracking-tight leading-none flex justify-center items-baseline gap-3"
          style={{ fontFamily: "'Jura', sans-serif" }}
        >
          <span className="text-white">OUR</span>
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#c9b2ff] via-[#b764ff] to-[#8452ff]">
            TEAMS
          </span>
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-6 md:gap-8">
          {TEAM_CARDS.map((teamName) => (
            <div
              key={teamName}
              className="h-55 md:h-65 rounded-xl border border-white/45 bg-black/40 backdrop-blur-[1px]"
            >
              <p
                className="px-6 pt-4 md:pt-5 text-[13px] md:text-[1.05rem] font-semibold uppercase text-center tracking-wide text-[#c28cff]"
                style={{ fontFamily: "'Jura', sans-serif" }}
              >
                {teamName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Teams;
