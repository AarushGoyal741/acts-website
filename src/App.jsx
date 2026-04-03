import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Highlights from "./components/sections/Highlights";
import Mentors from "./components/sections/Mentors";
import Leadership from "./components/sections/Leadership";
import FAQ from "./components/sections/FAQ";
import AskQuestion from "./components/sections/AskQuestion";
import Founders from "./components/sections/Founders";
import Teams from "./components/sections/Teams";
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

      {/* revealDone && <CursorBirds />     remove from comment to add cursor_birds*/}

      <div id="about"><About /></div>
      <div id="highlights"><Highlights /></div>
      <div><Mentors /></div>
      <div><Teams /></div>
      <div id="team"><Leadership /></div>
      <div><Founders /></div>
      <div><FAQ /></div>
      <div><AskQuestion /></div>

    </div>
  );
}
