import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import Background from "./components/backgrounds/Background";
import CursorBirds from "./components/reveal/CursorBirds";

export default function App() {

  const [revealDone, setRevealDone] = useState(false);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* Background */}
      <Background />

      {/* Hero */}
      <Hero setRevealDone={setRevealDone} />

      {/* Navbar */}
      <Navbar revealDone={revealDone} />

      {/* Birds */}
      {revealDone && (
        <CursorBirds />
      )}

    </div>
  );
}