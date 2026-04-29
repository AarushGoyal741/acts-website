import { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Background from "./components/backgrounds/Background";
import ScrollToTop from "./components/layout/ScrollToTop";

import BirdFlockReveal from "./components/reveal/BirdFlockReveal";
import BlackReveal from "./components/reveal/BlackReveal";

import { RevealProvider } from "./context/RevealContext";

import Home from "./pages/Home";
import Highlights from "./pages/Highlights";
import Team from "./pages/Team";
import Events from "./pages/Events";
import FAQ from "./pages/FAQ";
import Register from "./pages/RegisterPage";

export default function App() {
  const [revealDone, setRevealDone] = useState(false);
  const [revealKey, setRevealKey] = useState(0);
  const location = useLocation();
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setRevealDone(false);
    setRevealKey(k => k + 1);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen text-white">

      <Background />

      <BirdFlockReveal key={`bird-${revealKey}`} revealDone={revealDone} />
      <BlackReveal key={`black-${revealKey}`} revealDone={revealDone} setRevealDone={setRevealDone} />

      <Navbar revealDone={revealDone} />

      <ScrollToTop />

      <RevealProvider value={revealDone}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/highlights" element={<Highlights revealKey={revealKey} />} />
          <Route path="/team" element={<Team />} />
          <Route path="/events" element={<Events />} />
          <Route path="/register" element={<Register />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </RevealProvider>

    </div>
  );
}