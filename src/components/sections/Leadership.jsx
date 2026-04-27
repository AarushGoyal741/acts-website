'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LanyardScene from "../ui/Lanyard";

// Desktop 3D models
import rishiModel from "../../assets/team/rishi.glb";
import aarushModel from "../../assets/team/aarush.glb";
import muskanModel from "../../assets/team/muskan.glb";
import shonalModel from "../../assets/team/shonal.glb";
import adityaModel from "../../assets/team/aditya.glb";
import palakModel from "../../assets/team/palak.glb";

// Mobile profile photos
import rishiImg from "../../assets/team/rishi.png";
import aarushImg from "../../assets/team/aarush.png";
import muskanImg from "../../assets/team/muskan.png";
import shonalImg from "../../assets/team/shonal.png";
import adityaImg from "../../assets/team/aditya.png";
import palakImg from "../../assets/team/palak.png";

const TEAM_MEMBERS = [
  {
    name: "Shonal Dhauni",
    role: "Chairperson",
    image: shonalImg,
    model: shonalModel,
    yOffset: -1.6,
    segmentLength: 1.6,
    anchorHeight: 8.5,
  },
  {
    name: "Muskan Narang",
    role: "Vice Chairperson",
    image: muskanImg,
    model: muskanModel,
    yOffset: -1.9,
    segmentLength: 1.9,
    anchorHeight: 8.5,
  },
  {
    name: "Palak Dev",
    role: "Treasurer",
    image: palakImg,
    model: palakModel,
    yOffset: -1.6,
    segmentLength: 0.9,
    anchorHeight: 6.5,
  },
  {
    name: "Aditya Singh",
    role: "General Secretary",
    image: adityaImg,
    model: adityaModel,
    yOffset: -1.6,
    segmentLength: 1.2,
    anchorHeight: 6.3,
  },
  {
    name: "Aarush Goyal",
    role: "Web Chair",
    image: aarushImg,
    model: aarushModel,
    yOffset: -1.4,
    segmentLength: 1.0,
    anchorHeight: 6.5,
  },
  {
    name: "Rishi Raj Goel",
    role: "Media Head",
    image: rishiImg,
    model: rishiModel,
    yOffset: -2.3,
    segmentLength: 1.9,
    anchorHeight: 8.5,
  },
];

const MarqueeTape = ({ text, altText, className, direction = 1 }) => {
  const repeatedContent = altText
    ? Array(10)
        .fill(null)
        .map((_, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="text-white">{text}</span>
            <span className="mx-4">•</span>
            <span className="text-transparent [-webkit-text-stroke:2px_gray]">
              {altText}
            </span>
            <span className="mx-4">•</span>
          </span>
        ))
    : Array(10).fill(text).join(" • ");

  return (
    <div
      className={`absolute w-[200vw] -left-[50vw] overflow-hidden flex whitespace-nowrap ${className}`}
    >
      <motion.div
        initial={{ x: direction === 1 ? "0%" : "-50%" }}
        animate={{ x: direction === 1 ? "-50%" : "0%" }}
        transition={{ ease: "linear", duration: 40, repeat: Infinity }}
        className="text-4xl md:text-6xl font-black uppercase tracking-widest py-0 flex items-center text-purple-300/50"
      >
        <span className="pr-8 flex items-center">{repeatedContent}</span>
        <span className="pr-8 flex items-center">{repeatedContent}</span>
      </motion.div>
    </div>
  );
};

const MobileMemberCard = ({ member, index }) => {
  const reverse = index % 2 !== 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`w-full flex items-center gap-0 ${
        reverse ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className="w-[42%] min-w-[155px] max-w-[155px] relative z-10">
        <div className="rounded-[22px] overflow-hidden shadow-4xl bg-transparent">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-[220px] object-contain object-center"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: reverse ? 80 : -80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        className={`flex-1 ${reverse ? "pr-3 -mr-12" : "pl-3 -ml-12"} relative z-0`}>
        <div className="rounded-[20px] border-2 border-white/40 bg-gradient-to-r from-[#4c2cff]/30 via-[#8b3dff]/20 to-[#111]/70 backdrop-blur-md px-10 py-6 shadow-[0_0_30px_rgba(139,61,255)] h-[160px] w-full flex flex-col justify-center">
          
          <h3 className="text-[1.35rem] font-bold text-white leading-tight tracking-tight uppercase">
            {member.name}
          </h3>
          <p className="text-[1rem] text-white mt-3 font-semibold leading-relaxed uppercase tracking-[0.08em] drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] font-['Orbitron']">
            {member.role}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Leadership() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Phone only layout (<768px)
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section
      id="team"
      className="relative min-h-screen overflow-hidden flex flex-col items-center"
    >
      <div className="absolute top-[0.1%] md:top-[14%] left-0 w-full h-full pointer-events-none z-20 opacity-100">
        <MarqueeTape
          text="ASSOCIATION OF COMPUTING AND SCIENCE"
          className="rotate-[8deg] md:rotate-[10deg] bg-black border-y border-purple-10 top-[6%]"
          direction={-1}
        />
        <MarqueeTape
          text="OFFICE BEARERS"
          altText="OFFICE BEARERS"
          className="-rotate-[10deg] md:-rotate-[5deg] bg-black border-y border-purple-10 top-[6%]"
          direction={1}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 max-sm:pt-56">
        {!isMounted ? null : isMobile ? (
          <div className="flex flex-col gap-12 pb-24 pt-16">
            {TEAM_MEMBERS.map((member, index) => (
              <MobileMemberCard
                key={member.name}
                member={member}
                index={index}
              />
            ))}
          </div>
        ) : (
          <LanyardScene members={TEAM_MEMBERS} />
        )}
      </div>
    </section>
  );
}
