import neetu_mam from '../../assets/images/neeta mam.JPG.jpeg';
export default function Mentors() {
  return (
    <section
      id="mentors"
      className="relative w-full py-32 overflow-hidden"
    >

      {/* Heading */}
      <div className="relative z-10 text-center px-6">
        <h2 className="font-display uppercase text-[clamp(2.5rem,5vw,4rem)] font-semibold tracking-tight">
            our mentors
        </h2>

        <div className="mt-4 h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <p className="mt-6 text-white/60 max-w-xl mx-auto text-lg">
          Guidance from industry leaders and academic experts
        </p>
      </div>
        {/* Mentors */}
        <div className='mt-16'>
          <div className="flex justify-around items-center text-center">
            <img src={neetu_mam} alt="Neetu Mam" className="md:w-100 md:h-100 rounded-2xl object-cover" />
            <img src={neetu_mam} alt="Neetu Mam" className="md:w-100 md:h-100 rounded-2xl object-cover" />

          </div>
        </div>
    </section>
  );
}
