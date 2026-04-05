import { motion } from "framer-motion";
import { useReveal } from "../../context/RevealContext";
import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import { FaYoutube, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

function SocialIcon({ icon, link, color }) {
  const handleEnter = (e) => {
    e.currentTarget.style.backgroundColor = color + "55";
    e.currentTarget.style.boxShadow = "0 0 12px 3px " + color + "99";
    e.currentTarget.style.borderColor = color;
  };

  const handleLeave = (e) => {
    e.currentTarget.style.backgroundColor = "";
    e.currentTarget.style.boxShadow = "";
    e.currentTarget.style.borderColor = "";
  };

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" onMouseEnter={handleEnter} onMouseLeave={handleLeave} className="group relative w-8 h-8 rounded-md border border-white/10 flex items-center justify-center text-white/70 transition-all duration-300">
      <span className="relative z-10 group-hover:scale-110 transition duration-300">
        {icon}
      </span>
    </a>
  );
}

function GlowLink({ to, children }) {
  const handleEnter = (e) => {
    e.currentTarget.style.color = "white";
    e.currentTarget.style.textShadow = "0 0 8px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.5)";
  };

  const handleLeave = (e) => {
    e.currentTarget.style.color = "";
    e.currentTarget.style.textShadow = "";
  };

  return (
    <Link to={to} onMouseEnter={handleEnter} onMouseLeave={handleLeave} className="block transition-colors duration-300">
      {children}
    </Link>
  );
}

function GlowAnchor({ href, children, className, target, rel }) {
  const handleEnter = (e) => {
    e.currentTarget.style.color = "white";
    e.currentTarget.style.textShadow = "0 0 8px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.5)";
  };

  const handleLeave = (e) => {
    e.currentTarget.style.color = "";
    e.currentTarget.style.textShadow = "";
  };

  return (
    <a href={href} target={target} rel={rel} onMouseEnter={handleEnter} onMouseLeave={handleLeave} className={"transition-colors duration-300 " + (className || "")}>
      {children}
    </a>
  );
}

export default function Contact() {
  const revealDone = useReveal();

  return (
    <section id="contact" className="relative py-14 px-6 w-full bg-black border-t border-white/10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={revealDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto"
      >
        {/* Top Section */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Left */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center font-bold">
                ACTS
              </div>
            </div>
            <p className="text-white/60 text-sm max-w-xs">
              Association of Computing Technology and Science
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Quick Links</h3>
            <div className="space-y-1.5 text-white/60 text-sm">
              <GlowLink to="/">Home</GlowLink>
              <GlowLink to="/highlights">Highlights</GlowLink>
              <GlowLink to="/about">About</GlowLink>
              <GlowLink to="/team">Team</GlowLink>
              <GlowLink to="/events">Events</GlowLink>
              <GlowLink to="/faq">FAQ</GlowLink>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Contact</h3>
            <div className="space-y-2.5 text-white/60 text-sm">
              <GlowAnchor href="mailto:acts.edc@gmail.com" className="flex items-start gap-2">
                <Mail size={15} className="mt-0.5 shrink-0" />
                <span>acts.edc@gmail.com</span>
              </GlowAnchor>
              <GlowAnchor href="https://maps.app.goo.gl/CMPwPuTSWSNUs3Pr9" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0" />
                <span>GGSIPU East Delhi Campus <br /> New Delhi, India</span>
              </GlowAnchor>
            </div>
          </div>

        </div>

        {/* Animated Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={revealDone ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="border-t border-white/10 my-6 origin-left"
        />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">

          {/* Social */}
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-sm">Follow us:</span>
            <div className="flex gap-2">
              <SocialIcon icon={<FaYoutube size={13} />} link="https://www.youtube.com/@ACTS-EDCSC" color="#ef4444" />
              <SocialIcon icon={<FaInstagram size={13} />} link="https://www.instagram.com/acts_edc/" color="#ec4899" />
              <SocialIcon icon={<FaLinkedinIn size={13} />} link="https://www.linkedin.com/company/acts-edc/posts/?feedView=all" color="#3b82f6" />
              <SocialIcon icon={<FaXTwitter size={13} />} link="https://x.com/acts_edc" color="#9ca3af" />
              <SocialIcon icon={<Mail size={13} />} link="mailto:acts.edc@gmail.com" color="#22c55e" />
            </div>
          </div>

          {/* Copyright */}
          <div className="text-white/50 text-xs text-center md:text-right">
            <p>© 2026 ACTS. All rights reserved.</p>
            <p className="text-white/40">Made with ❤️ by ACTS Team</p>
          </div>

        </div>
      </motion.div>
    </section>
  );
}