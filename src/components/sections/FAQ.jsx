import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useReveal } from "../../context/RevealContext";

const faqData = [
  { question: "What is ACTS?", answer: "ACTS is a student-driven technical club focused on innovation, collaboration, and hands-on learning through projects and events." },
  { question: "How can students join ACTS?", answer: "Students can join through our recruitment drives announced at the beginning of each semester." },
  { question: "What benefits do ACTS members receive?", answer: "Members gain access to workshops, networking opportunities, mentorship, and real-world project experience." },
  { question: "How frequently does ACTS organize events?", answer: "ACTS organizes events regularly including workshops, hackathons, and speaker sessions." },
  { question: "Can students take leadership roles in ACTS?", answer: "Yes, members can apply for leadership roles after demonstrating commitment and contribution." },
  { question: "Do students need prior technical experience?", answer: "No. We welcome beginners and provide mentorship to help you grow." }
];

export default function FAQ({ revealKey }) {
  const revealDone = useReveal();
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [active, setActive] = useState(null);

  useEffect(() => {
    setShouldAnimate(false);
  }, [revealKey]);

  useEffect(() => {
    if (revealDone && isInView) setShouldAnimate(true);
  }, [revealDone, isInView]);

  return (
    <section ref={ref} className="py-20 relative">
      <div className="max-w-5xl mx-auto px-6">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-4xl text-center font-bold mb-10"
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4"
        >
          {faqData.map((item, index) => (
            <div key={index} className="border border-purple-500/30 rounded-xl overflow-hidden">
              <button
                onClick={() => setActive(active === index ? null : index)}
                className="w-full text-left px-6 py-4"
              >
                {item.question}
              </button>
              <AnimatePresence>
                {active === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-4"
                  >
                    {item.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}