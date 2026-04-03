import neeta_mam from '../../assets/team/neeta_mam_grp.png';
import amar_sir from '../../assets/team/amar_sir_grp.png';
import GradientText from '../ui/GradientText';

export default function Mentors() {
  return (
    <section
      id="mentors"
      className="relative w-full py-32 overflow-hidden"
    >

      {/* Heading */}
      <div className="relative z-10 text-center px-6">

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
            MENTORS
          </GradientText>
          </span>

        </h2>

        

        <div className="mt-4 h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <p className="mt-6 text-white/60 max-w-xl mx-auto text-lg">
          Guidance from industry leaders and academic experts
        </p>

      </div>


      {/* Mentors Grid */}

      <div className="mt-16">

        <div className="flex max-md:flex-col max-md:gap-8 justify-around items-center text-center">

          {/* Card 1 */}
          <div className="w-60 h-60 md:w-100 md:h-100 rounded-2xl bg-black/40 border-2 border-white">
            <img
              src={neeta_mam}
              alt="Neeta Mam"
              className="w-full h-full rounded-2xl object-cover"
            />
          </div>


          {/* Card 2 */}
          <div className="w-60 h-60 md:w-100 md:h-100 rounded-2xl bg-black/40 border-2 border-white">
            <img
              src={amar_sir}
              alt="Amar Sir"
              className="w-full h-full rounded-2xl object-cover"
            />
          </div>

        </div>

      </div>

    </section>
  );
}
