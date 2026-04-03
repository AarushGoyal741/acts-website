import { motion } from "framer-motion";

import salik from "../../assets/team/salik.png";
import samarth from "../../assets/team/samarth.png";
import harsh from "../../assets/team/harsh.png";
import mridul from "../../assets/team/mridul.png";

const founders = [
  {
    name: "MD SALIK INAM",
    role: "PRESIDENT",
    image: salik
  },
  {
    name: "SAMARTH SAXENA",
    role: "TREASURER",
    image: samarth
  },
  {
    name: "HARSH KUMAR",
    role: "SECRETARY",
    image: harsh
  },
  {
    name: "MRIDUL MAKKAR",
    role: "VICE PRESIDENT",
    image: mridul
  }
];

export default function Founders() {
  return (
    <section id="founders" className="py-24 px-6 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* --- NEW TITLE SECTION --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative flex flex-col items-center justify-center w-full mb-24 md:mb-36 mt-10"
        >
          {/* Background Script Text */}
          {/* FIX: Title Case ("Founders") fixes cursive font centering, and reduced mobile base size prevents overflow */}
          <h1
            className="text-gray-300/90 text-[3.8rem] min-[400px]:text-[3.95rem] sm:text-[7rem] md:text-[10rem] lg:text-[10rem] leading-none text-center w-full select-none"
            style={{ fontFamily: "'Nothing You Could Do', cursive" }}
          >
            FOUNDERS
          </h1>

          {/* Foreground Black Ribbon */}
          {/* FIX: Removed max-w-[75vw] and added px-3 so the black box perfectly hugs the text on all devices */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#050505] px-1 sm:px-0.2 py-0 md:py-0 z-10 w-max-[1/2] shadow-2xl">
            <h2
              className="text-[#9254d8] text-[0.55rem] min-[400px]:text-[0.6rem] sm:text-sm md:text-xl lg:text-2xl font-semibold tracking-normal uppercase text-center whitespace-nowrap"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              Association of Computing Science and Technology
            </h2>
          </div>

          {/* Year Subtext */}
          <p
            className="absolute -bottom-8 md:-bottom-12 text-gray-300 text-xs sm:text-sm md:text-lg tracking-[0.2em]"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            2024-2026
          </p>
        </motion.div>


        {/* --- FOUNDERS GRID --- */}
        <div className="grid md:grid-cols-2 gap-y-20 gap-x-12 md:gap-x-24">
          
          {founders.map((person, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative flex items-center w-full"
            >
              {/* Floating Image (Polaroid) */}
              <div className="absolute -left-4 md:-left-8 z-20 drop-shadow-2xl">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-44 md:w-56 object-contain"
                />
              </div>

              {/* Card Background - Glassmorphism Tint */}
              <div
                className="w-full ml-12 md:ml-16 pl-[110px] md:pl-[160px] pr-4 py-12 rounded-xl flex flex-col justify-center items-center shadow-2xl border border-purple-500/20 bg-black/40 backdrop-blur-md"
              >
                {/* Designation (Bigger, Center Aligned) */}
                <h2
                  className="text-purple-400 
                    text-2xl sm:text-3xl lg:text-4xl xl:text-[2.5rem] 
                    leading-none 
                    font-black 
                    tracking-widest 
                    uppercase 
                    text-center
                    w-full"
                  style={{ fontFamily: "Orbitron" }}
                >
                  {person.role}
                </h2>

                {/* Name (Smaller, Center Aligned) */}
                <h3
                  className="text-white/90 
                    text-lg sm:text-xl lg:text-2xl xl:text-3xl 
                    mt-3 
                    tracking-wider 
                    uppercase 
                    font-medium 
                    text-center
                    w-full"
                  style={{ fontFamily: "Orbitron" }}
                >
                  {person.name}
                </h3>

              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}