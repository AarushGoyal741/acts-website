import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useReveal } from "../../context/RevealContext";

const allMembers = [
  "Aaditya Upadhyay", "Aanya Agarwal", "Aayan Khan", "Aayush Sethia",
  "Amaan Javed", "Anuj Shukla", "Anurag Singh", "Archit", "Arti",
  "Aryan Singla", "Bhavishya", "Dev Dutta", "Gneev Kaur", "Hitesh Tomar",
  "Jatin Khandelwal", "Kshiteej Prakash", "Kshitiz Jain", "Kumar Arnav",
  "Kushagra Jaiswal", "Mausam Bhuwania", "Meghna Thakran", "Pranjal Rathore",
  "Prince Kumar Rai", "Purnima Sukhija", "Rahul Maity", "Rakshita Sati",
  "Ridhima Rawat", "Sanket Jain", "Sanyukta Majumdar", "Shaurya Rawat",
  "Shreya Anand", "Tanisha Mehta", "Tanmay Mewati", "Umang Kaushik",
  "Vipul Joshi", "Yashika", "Yashita Gaur"
].sort();

const CyberName = ({ name }) => {
  const firstLetter = name.charAt(0);
  const restOfName = name.slice(1);
  return (
    <p
      className="text-gray-300 hover:text-white transition-all duration-300 cursor-default tracking-wider"
      style={{ fontFamily: "Orbitron, sans-serif" }}
    >
      <span className="text-purple-400 font-black text-[1.35em] drop-shadow-[0_0_4px_rgba(168,85,247,0.9)]">
        {firstLetter}
      </span>
      <span className="text-[0.85em] opacity-90">{restOfName}</span>
    </p>
  );
};

export default function Teams({ revealKey }) {
  const revealDone = useReveal();
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    setShouldAnimate(false);
  }, [revealKey]);

  useEffect(() => {
    if (revealDone && isInView) setShouldAnimate(true);
  }, [revealDone, isInView]);

  return (
    <section id="teams" ref={ref} className="relative w-full py-24 px-6 overflow-hidden z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="w-full rounded-2xl bg-black/40 backdrop-blur-md border border-purple-500/30 shadow-[0_0_50px_-12px_rgba(168,85,247,0.2)] p-8 md:p-16 relative overflow-hidden group"
        >
          <div className="absolute inset-0 opacity-[0.75] bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.8)_1px,_transparent_1px)] bg-[length:24px_24px] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-purple-600/20 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/2 h-48 bg-purple-800/10 blur-[100px] rounded-full pointer-events-none transition-transform duration-1000 group-hover:translate-x-full" />

          <div className="text-center mb-16 relative z-10">
            <h2
              className="text-white text-4xl md:text-6xl font-black tracking-widest uppercase drop-shadow-md"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">TEAM</span>
            </h2>
            <div className="mt-6 h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          </div>

          <div className="relative z-10 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-8">
            {allMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: index * 0.02 }}
                className="break-inside-avoid mb-5 text-center sm:text-left hover:-translate-y-0.5 transition-transform duration-300"
              >
                <CyberName name={member} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}