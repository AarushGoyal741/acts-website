import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useReveal } from "../../context/RevealContext";

const faqData = [
   {
        question: "What is ACTS?",
        answer:
            "ACTS (Association of Technical Computing and Science) is a vibrant technical club at Guru Gobind Singh Indraprastha University, East Delhi Campus. The club focuses on AI, Machine Learning, Automation, and Robotics, providing students with a platform to learn, innovate, and grow in these cutting-edge technologies.",
    },
    {
        question: "How can students join ACTS?",
        answer:
            "Students can join ACTS by attending club events, reaching out to current members, or contacting the leadership team directly. The club welcomes students from all academic backgrounds who have an interest in technology and innovation, regardless of their current skill level.",
    },
    {
        question: "What benefits do ACTS members receive?",
        answer:
            "ACTS members gain access to hands-on workshops, hackathons, technical seminars, and career development sessions including resume building and interview preparation. Members also benefit from networking opportunities with industry professionals and mentorship from faculty advisors Dr. Neeta Singh and Dr. Amar Arora.",
    },
    {
        question: "How frequently does ACTS organize events?",
        answer:
            "ACTS maintains an active event schedule throughout the academic year, organizing regular workshops, technical talks, hackathons, and career development sessions. The club also hosts special events and competitions based on emerging technologies and student interests.",
    },
    {
        question: "Can students take leadership roles in ACTS?",
        answer:
            "Yes, ACTS encourages student participation in leadership and organizational roles. Students can contribute by helping organize events, leading workshops, joining committees, or applying for core team positions. The club values initiative and provides opportunities for students to develop leadership skills.",
    },
    {
        question: "Do students need prior technical experience to join ACTS?",
        answer:
            "No prior technical experience is required to join ACTS. The club welcomes students at all skill levels, from beginners who are curious about technology to those with advanced programming knowledge. ACTS believes in collaborative learning and provides support for students to develop their technical skills progressively.",
    },
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