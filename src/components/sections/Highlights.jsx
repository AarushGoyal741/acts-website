import DomeGallery from "../ui/DomeGallery";

// Import images
import img1 from "../../assets/images/img1.png";
import img2 from "../../assets/images/img2.png";
import img3 from "../../assets/images/img3.png";
import img4 from "../../assets/images/img4.png";
import img5 from "../../assets/images/img5.png";

export default function Highlights() {

  const images = [
    { src: img1, alt: "ACTS Event" },
    { src: img2, alt: "Workshop" },
    { src: img3, alt: "Hackathon" },
    { src: img4, alt: "Team Activity" },
    { src: img5, alt: "Seminar" }
  ];

  return (
    <section
      id="highlights"
      className="relative w-full py-5 overflow-hidden"
    >

      {/* Heading */}
      <div className="relative z-10 text-center mb-16 px-6">
        <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold tracking-tight">
          Highlights
        </h2>

        <div className="mt-4 h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <p className="mt-6 text-white/60 max-w-xl mx-auto text-lg">
          Moments that define innovation, collaboration, and growth at ACTS
        </p>
      </div>

      {/* Dome */}
      <div className="relative w-full min-h-[55vh] sm:min-h-[60vh] md:min-h-[100vh]">
        <div className="absolute inset-0">
          <DomeGallery
            images={images}
            fit={1.2}
            minRadius={1050}
            maxVerticalRotationDeg={10}
            segments={30}
            dragDampening={2}
            grayscale={false}
            overlayBlurColor="rgba(0,0,0,0.8)"
          />
        </div>
      </div>

    </section>
  );
}