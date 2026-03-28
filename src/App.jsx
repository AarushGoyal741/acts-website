import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Highlights from "./components/sections/Highlights";
import Mentors from "./components/sections/Mentors";
import Background from "./components/backgrounds/Background";
import CursorBirds from "./components/reveal/CursorBirds";

export default function App() {
  const [revealDone, setRevealDone] = useState(false);

  return (
    <div className="relative min-h-screen text-white">

      <Background />

      {/* Hero already has id="home" inside it — no wrapper needed */}
      <Hero setRevealDone={setRevealDone} />

      <Navbar revealDone={revealDone} />

      {revealDone && <CursorBirds />}

      <div id="about"><About /></div>
      <div id="highlights"><Highlights /></div>
      <div id="team"><Mentors /></div>

    </div>
  );
}