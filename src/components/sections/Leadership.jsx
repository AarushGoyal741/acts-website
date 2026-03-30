'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LanyardScene from "../ui/Lanyard";

// Import your 3D models for the laptop view
import rishiModel from "../../assets/team/rishi.glb";
import aarushModel from "../../assets/team/aarush.glb";
import muskanModel from "../../assets/team/muskan.glb";
import shonalModel from "../../assets/team/shonal.glb";
import adityaModel from "../../assets/team/aditya.glb";
import palakModel from "../../assets/team/palak.glb";

// Import your flat images for the phone/iPad view
import rishiFullCardImg from "../../assets/team/MEDIA.png";
import aarushFullCardImg from "../../assets/team/WEB 1.png";
import muskanFullCardImg from "../../assets/team/VICE CHAIR 1.png";
import shonalFullCardImg from "../../assets/team/CHAIR 1.png";
import adityaFullCardImg from "../../assets/team/GEN SEC 1.png";
import palakFullCardImg from "../../assets/team/TRESUURER 1.png";

const TEAM_MEMBERS = [
  { name: "Shonal", fullCardImg: shonalFullCardImg, model: shonalModel, yOffset: 1.6, segmentLength: 1.6, anchorHeight: 8.5 },
  { name: "Muskan", fullCardImg: muskanFullCardImg, model: muskanModel, yOffset: 1.6, segmentLength: 1.9, anchorHeight: 8.5 }, 
  { name: "Palak",  fullCardImg: palakFullCardImg,  model: palakModel, yOffset: 1.6, segmentLength: 0.9, anchorHeight: 6.5 }, 
  { name: "Aditya", fullCardImg: adityaFullCardImg, model: adityaModel, yOffset: 1.6, segmentLength: 1.2, anchorHeight: 6.3 }, 
  { name: "Aarush", fullCardImg: aarushFullCardImg, model: aarushModel, yOffset: 1.6, segmentLength: 1.0, anchorHeight: 6.5 }, 
  { name: "Rishi",  fullCardImg: rishiFullCardImg,  model: rishiModel, yOffset: 1.6, segmentLength: 1.9, anchorHeight: 8.5 },
];

const MarqueeTape = ({ text, altText, className, outlineText = false, direction = 1 }) => {
  const repeatedContent = altText
    ? Array(10).fill(null).map((_, i) => (
        <span key={i} className="inline-flex items-center">
          <span className="text-white">{text}</span>
          <span className="mx-4">•</span>
          <span className="text-transparent [-webkit-text-stroke:2px_gray]">{altText}</span>
          <span className="mx-4">•</span>
        </span>
      ))
    : (() => {
        const repeatedText = Array(10).fill(text).join(" • ");
        return <span className="pr-8">{repeatedText}</span>;
      })();

  return (
    <div className={`absolute w-[200vw] -left-[50vw] overflow-hidden flex whitespace-nowrap ${className}`}>
      <motion.div
        initial={{ x: direction === 1 ? "0%" : "-50%" }}
        animate={{ x: direction === 1 ? "-50%" : "0%" }}
        transition={{ ease: "linear", duration: 40, repeat: Infinity }}
        className={`text-4xl md:text-6xl font-black uppercase tracking-widest py-0 flex items-center ${
          !altText && outlineText ? "text-transparent [-webkit-text-stroke:2px_gray]" : !altText ? "text-purple-300/50" : ""
        }`}
      >
        <span className="pr-8 flex items-center">{repeatedContent}</span>
        <span className="pr-8 flex items-center">{repeatedContent}</span>
      </motion.div>
    </div>
  );
};

export default function Leadership() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // UPDATED: Now checks for < 1024px to safely catch iPhones, Androids, and iPads!
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="team" className="relative min-h-screen overflow-hidden py-10 flex flex-col items-center">

      <div className="absolute bottom-1/2 left-0 w-full h-3/4 bg-purple-900/20 blur-[150px] pointer-events-none z-0" />

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-30 text-center text-white text-5xl md:text-7xl font-black mb-16 md:mb-12 tracking-tight drop-shadow-lg w-full max-w-[1400px] mx-auto px-6"
      >
        OFFICE BEARERS
      </motion.h2>

      <div className="absolute top-[180px] md:top-[14%] left-0 w-full h-full pointer-events-none z-20 opacity-100">
        <MarqueeTape
          text="ASSOCIATION OF COMPUTING AND SCIENCE"
          className="rotate-[8deg] md:rotate-[10deg] bg-black backdrop-blur-sm border-y border-purple-10 top-[6%]"
          direction={-1}
        />
        <MarqueeTape
          text="OFFICE BEARERS"
          altText="OFFICE BEARERS"
          className="-rotate-[10deg] md:-rotate-[5deg] bg-black border-y border-purple-10 top-[6%]"
          direction={1}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6">

        <div className="mt-8 md:mt-0">
          {!isMounted ? null : isMobile ? (
            
            // ==========================================
            // THIS ONLY RENDERS ON PHONES & IPADS
            // ==========================================
            <div className="flex flex-col items-center space-y-12 pb-24">
              {TEAM_MEMBERS.map((member, index) => (
                <div key={index} className="w-full max-w-[320px] pt-12 relative z-10">
                  <img 
                    src={member.fullCardImg} 
                    alt={`${member.name}'s ID Card`} 
                    className="w-full h-auto rounded-xl shadow-2xl"
                  />
                </div>
              ))}
            </div>
            
          ) : (
            
            // ==========================================
            // THIS ONLY RENDERS ON LAPTOPS & DESKTOPS
            // ==========================================
            <LanyardScene members={TEAM_MEMBERS} />
            
          )}
        </div>

      </div>

    </section>
  );
}