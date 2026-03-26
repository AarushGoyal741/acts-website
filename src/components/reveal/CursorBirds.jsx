import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import birdAnimation from "../../assets/birds.json";

const BIRD_COUNT = 6;
const SPEED = 0.05;
const ENTRY_SPEED = 0.035;
const FLOCK_RADIUS = 90;

export default function CursorBirds() {

  const containerRef = useRef(null);
  const birdRefs = useRef([]);

  const mouse = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });

  const mouseInitialized = useRef(false);
  const [mouseReady, setMouseReady] = useState(false);

  const getBirdSize = () => {
    const w = window.innerWidth;

    if (w < 640) return 55;
    if (w < 1024) return 70;
    return 90;
  };

  const [birdSize, setBirdSize] = useState(getBirdSize());

  const birds = useRef(
    Array.from({ length: BIRD_COUNT }).map((_, i) => {

      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * FLOCK_RADIUS;

      return {
        x: window.innerWidth + 300 + i * 40,
        y: window.innerHeight * (0.2 + Math.random() * 0.6),

        targetX: 0,
        targetY: 0,

        baseOffsetX: Math.cos(angle) * radius,
        baseOffsetY: Math.sin(angle) * radius,

        wanderOffsetX: 0,
        wanderOffsetY: 0,

        entering: true,

        flapPhase: Math.random() * Math.PI * 2,
        flapSpeed: 0.02 + Math.random() * 0.02,
        flapHeight: 5 + Math.random() * 6,

        direction: -1
      };
    })
  );

  // Mouse tracking
  useEffect(() => {

    const handleMove = (e) => {

      mouse.current = {
        x: e.clientX,
        y: e.clientY
      };

      if (!mouseInitialized.current) {
        mouseInitialized.current = true;
        setMouseReady(true);
      }

    };

    window.addEventListener("mousemove", handleMove);

    return () => window.removeEventListener("mousemove", handleMove);

  }, []);

  // Resize handler
  useEffect(() => {

    const handleResize = () => {
      setBirdSize(getBirdSize());
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);

  }, []);

  // Wander behaviour
  useEffect(() => {

    const interval = setInterval(() => {

      birds.current.forEach(bird => {

        bird.wanderOffsetX = Math.random() * 30 - 15;
        bird.wanderOffsetY = Math.random() * 30 - 15;

      });

    }, 1800);

    return () => clearInterval(interval);

  }, []);

  // Animation loop
  useEffect(() => {

    let animationFrame;

    const animate = () => {

      birds.current.forEach((bird, i) => {

        if (!mouseInitialized.current) return;

        if (bird.entering) {

          bird.targetX = mouse.current.x + bird.baseOffsetX;
          bird.targetY = mouse.current.y + bird.baseOffsetY;

          const dx = bird.targetX - bird.x;
          const dy = bird.targetY - bird.y;

          bird.x += dx * ENTRY_SPEED;
          bird.y += dy * ENTRY_SPEED;

          // FIX direction during entry
          if (Math.abs(dx) > 1) {
            bird.direction = dx > 0 ? 1 : -1;
          }

          if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
            bird.entering = false;
          }

        }

        else {

          bird.targetX =
            mouse.current.x +
            bird.baseOffsetX +
            bird.wanderOffsetX;

          bird.targetY =
            mouse.current.y +
            bird.baseOffsetY +
            bird.wanderOffsetY;

          const dx = bird.targetX - bird.x;
          const dy = bird.targetY - bird.y;

          bird.x += dx * SPEED;
          bird.y += dy * SPEED;

          if (Math.abs(dx) > 1) {
            bird.direction = dx > 0 ? 1 : -1;
          }

        }

        bird.flapPhase += bird.flapSpeed;

        const flapY =
          Math.sin(bird.flapPhase) *
          bird.flapHeight;

        const el = birdRefs.current[i];

        if (el) {
          el.style.transform =
            `translate3d(${bird.x}px, ${bird.y + flapY}px, 0) scaleX(${bird.direction})`;
        }

      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);

  }, []);

  if (!mouseReady) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[15] opacity-0 animate-[fadeIn_0.6s_ease_0.2s_forwards]"
    >
      {birds.current.map((_, i) => {

        return (
          <div
            key={i}
            ref={(el) => (birdRefs.current[i] = el)}
            className="absolute"
            style={{
              width: birdSize,
              height: birdSize,
              willChange: "transform"
            }}
          >
            <Lottie
              animationData={birdAnimation}
              autoplay
              loop
            />
          </div>
        );
      })}
    </div>
  );
}