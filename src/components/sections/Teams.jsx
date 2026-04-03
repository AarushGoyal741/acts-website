import React from 'react';
import GradientText from '../ui/GradientText';

const TEAM_DATA = [

  {
    team: "PR & Outreach",
    members: [
      "Arti",
      "Aayush Sethia",
      "Anuj Shukla",
      "Archit",
      "Pranjal Rathore",
      "Aaditya Upadhyay",
      "Bhavishya",
      "Mausam Bhuwania",
      "Meghna Thakran",
      "Ridhima Rawat",
      "Umang Kaushik",
    ]
  },
  {
    team: "Design & UI/UX",
    members: [
      "Aayan Khan",
      "Anurag Singh",
      "Kumar Arnav",
      "Sanket Jain",
      "Tanisha Mehta",
      "Rahul Maity",
      "Rakshita Sati",
    ]
  },
  {
    team: "TEAM TECH",
    members: [
      "Tanmay Mewati",
      "Yashita Gaur",
      "Hitesh Tomar",
      "Vipul Joshi",
      "Aanya Agarwal",
      "Dev Dutta",
      "Kshiteej Prakash",
      "Kshitiz Jain",
      "Sanyukta Majumdar",
      "Shaurya Rawat",
      "Shreya Anand",
    ]
  },

  {
    team: "Event\nManagement",
    members: [
      "Yashika",
      "Amaan Javed",
      "Aryan Singla",
      "Jatin Khandelwal",
    ]
  },
  {
    team: "Sponsorship & Outreach",
    members: [
      "Gneev Kaur",
      "Kushagra Jaiswal",
      "Prince Kumar Rai",
      "Purnima Sukhija",
    ]
  },
];

const Teams = () => {
  const middleIndex = Math.floor(TEAM_DATA.length / 2);

  return (
    <section id="teams" className="relative w-full py-20 md:py-24 overflow-hidden">

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6">

        {/* Heading */}
        <h2
          className="uppercase text-[clamp(2.5rem,5vw,4rem)] font-semibold tracking-tight flex justify-center items-baseline gap-3"
          style={{ fontFamily: "'Jura', sans-serif" }}
        >
          <span className="text-white">OUR</span>
          <span>

            <GradientText
              colors={["#5227FF", "#FF9FFC", "#B19EEF", "#5227FF"]}
              animationSpeed={1.5}
              showBorder={false}
            >
              teams
            </GradientText>
          </span>

        </h2>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">

          {TEAM_DATA.map((team, index) => {

            const isMiddleOdd =
              TEAM_DATA.length % 2 !== 0 &&
              index === middleIndex;

            return (
              <div
                key={team.team}
                className={`${isMiddleOdd ? "md:col-span-2 md:flex md:justify-center" : ""}`}
              >

                <div
                  className={`h-full min-h-[220px] md:min-h-[260px] rounded-xl border border-white/45 bg-black/40 backdrop-blur-sm p-4 
                  ${isMiddleOdd ? "md:w-[calc(50%-0.75rem)]" : ""}`}
                >

                  <p
                    className="text-[13px] md:text-[1.9rem] font-bold uppercase text-center tracking-wide text-[#c28cff]"
                    style={{ fontFamily: "'Jura', sans-serif" }}
                  >
                    {team.team.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-1 text-center text-lg text-white/80">
                    {team.members.map((member, index) => (
                      <div key={index}>
                        {member}
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
};

export default Teams;